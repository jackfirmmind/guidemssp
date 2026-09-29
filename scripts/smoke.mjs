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

await page.goto(url);
const routes = await page.evaluate(() => {
  const r = ['home', 'modules', 'labs', 'scenarios', 'cards', 'glossary', 'scorecard', 'scorer', 'plan', 'questions', 'settings'];
  COURSE.modules.forEach((m) => { r.push(m.id); m.lessons.forEach((l) => r.push(m.id + '.' + l.id)); if (m.quiz.length) r.push(m.id + '.quiz'); });
  COURSE.labs.forEach((l) => r.push('lab.' + l.id));
  COURSE.scenarios.forEach((s) => r.push('scn.' + s.id));
  return r;
});

for (const r of routes) {
  await page.evaluate((h) => { location.hash = h; }, r);
  await page.waitForTimeout(15);
  const h1 = await page.locator('#main h1').first().textContent().catch(() => '');
  if (!h1) errors.push('no h1 on #' + r);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (overflow) errors.push('horizontal overflow on #' + r);
}

// Interactions
await page.evaluate(() => { location.hash = 'm1.l1'; });
await page.click('[data-act="complete"]');
await page.evaluate(() => { location.hash = 'm1.quiz'; });
const n = await page.locator('fieldset.q').count();
for (let i = 0; i < n; i++) await page.locator(`input[name="q${i}"]`).first().check();
await page.click('[data-act="quiz-check"]');
await page.evaluate(() => { location.hash = 'cards'; });
await page.click('[data-act="card-reveal"]');
await page.click('[data-act="card-good"]');
await page.evaluate(() => { location.hash = 'scn.s1'; });
for (let i = 0; i < 5; i++) await page.locator(`[data-act="scn-pick"][data-step="${i}"]`).nth(1).click();
await page.evaluate(() => { location.hash = 'scorecard'; });
await page.click('[data-act="sc-answer"][data-q="u1"][data-v="3"]');
await page.evaluate(() => { location.hash = 'scorer'; });
await page.fill('#sc-name', 'Test process'); await page.fill('#sc-runs', '100'); await page.fill('#sc-mins', '5');
await page.click('[data-act="scorer-save"]');
await page.evaluate(() => { location.hash = 'lab.ioc'; });
const iocRows = await page.locator('#ioc-out tbody tr').count();
if (iocRows < 5) errors.push('IOC extractor found too few rows: ' + iocRows);
await page.evaluate(() => { location.hash = 'lab.recon'; });
const reconRows = await page.locator('#recon-out tbody tr').count();
if (reconRows !== 8) errors.push('recon rows: ' + reconRows);
await page.fill('#search-input', 'DMARC'); await page.press('#search-input', 'Enter');
const results = await page.locator('.result-row').count();
if (!results) errors.push('search returned nothing for DMARC');
await page.evaluate(() => { location.hash = 'home'; });
const state = await page.evaluate(() => JSON.parse(localStorage.getItem('j2-field-manual.v1')));
if (!state.done['m1.l1'] || !state.quiz.m1 || !state.scn.s1 || state.sc.u1 !== 3 || !state.scorer.length) errors.push('state not persisted: ' + JSON.stringify(Object.keys(state)));

if (shots) {
  await page.screenshot({ path: join(root, 'dist/shot-home.png'), fullPage: false });
  await page.evaluate(() => { location.hash = 'm4.l3'; });
  await page.screenshot({ path: join(root, 'dist/shot-lesson.png') });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.setViewportSize({ width: 400, height: 860 });
  await page.evaluate(() => { location.hash = 'scorecard'; });
  await page.screenshot({ path: join(root, 'dist/shot-mobile-dark.png') });
}

await browser.close();
console.log(`visited ${routes.length} routes`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('smoke test passed');
