// Smoke test: loads the bundled app in headless Chromium, visits every route,
// exercises the main interactions and fails on any console or page error.
// Usage: node scripts/build.mjs && node scripts/smoke.mjs [--shots]
import { chromium } from 'playwright';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const url = pathToFileURL(join(root, 'dist/j2-field-manual.html')).href;
const shots = process.argv.includes('--shots');

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error' && !/fonts\.g/.test(m.text()) && !/ERR_/.test(m.text())) errors.push('console: ' + m.text()); });
const nav = (h) => page.evaluate((x) => { location.hash = x; }, h);

await page.goto(url);
const info = await page.evaluate(() => {
  const r = ['home', 'course', 'cheatsheet', 'cards', 'words', 'scorecard', 'questions', 'settings', 'break', 'finished'];
  let mins = 0;
  COURSE.modules.forEach((m) => { m.lessons.forEach((l) => { r.push(m.id + '.' + l.id); mins += l.mins; }); if (m.quiz.length) r.push(m.id + '.quiz'); });
  return { routes: r, lessonMins: mins };
});

for (const r of info.routes) {
  await nav(r);
  await page.waitForTimeout(15);
  const h1 = await page.locator('#main h1').first().textContent().catch(() => '');
  if (!h1) errors.push('no h1 on #' + r);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (overflow) errors.push('horizontal overflow on #' + r);
}

// Lesson: quick check + complete
await nav('m1.l1');
await page.locator('[data-act="check"]').first().click();
if (!(await page.locator('.feedback').count())) errors.push('quick check gave no feedback');
await page.click('[data-act="complete"]');
await page.waitForTimeout(20);
if (!/m1\.l2/.test(await page.evaluate(() => location.hash))) errors.push('complete did not advance to next lesson');

// Quiz: one question at a time
await nav('m1.quiz');
const qn = await page.evaluate(() => COURSE.modules[0].quiz.length);
for (let i = 0; i < qn; i++) {
  await page.locator('[data-act="quiz-pick"]').first().click();
  await page.click('[data-act="quiz-next"]');
}
if (!/out of/.test(await page.locator('#main h1').textContent())) errors.push('quiz score screen missing');

// Flashcards
await nav('home'); await nav('cards');
await page.click('[data-act="card-reveal"]');
await page.click('[data-act="card-good"]');

// Scorecard, text size, search
await nav('scorecard');
await page.click('[data-act="sc-answer"][data-q="u1"][data-v="3"]');
await page.locator('#side-size [data-act="size"][data-v="l"]').click();
const fs = await page.evaluate(() => document.documentElement.style.fontSize);
if (fs !== '112.5%') errors.push('text size did not apply: ' + fs);
await page.locator('#side-size [data-act="size"][data-v="m"]').click();
await page.fill('#search-input', 'DMARC'); await page.press('#search-input', 'Enter');
if (!(await page.locator('.step, dl.words > div').count())) errors.push('search returned nothing for DMARC');

const state = await page.evaluate(() => JSON.parse(localStorage.getItem('j2-crash-course.v2')));
if (!state.done['m1.l1'] || !state.quiz.m1 || state.sc.u1 !== 3 || state.checks['m1.l1'] === undefined) errors.push('state not persisted');

if (shots) {
  await nav('home'); await page.screenshot({ path: join(root, 'dist/shot-home.png') });
  await nav('m4.l3'); await page.screenshot({ path: join(root, 'dist/shot-lesson.png'), fullPage: true });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.setViewportSize({ width: 400, height: 860 });
  await nav('cheatsheet'); await page.screenshot({ path: join(root, 'dist/shot-mobile-dark.png') });
}

await browser.close();
console.log(`visited ${info.routes.length} routes; lesson minutes ${info.lessonMins}`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('smoke test passed');
