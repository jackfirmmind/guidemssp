# J2 Field Manual

A self-paced crash course for starting as **AI Automation & Business Systems Engineer at J2 MSSP**. It's a static web app with no build step and no server: progress, notes, quiz scores and flashcards are saved in your browser.

## What's inside

| Area | Contents |
|---|---|
| **Curriculum** | 11 modules, 46 lessons (about 10 hours): Know J2 · Security foundations · The MSSP business · Inside the SOC · The J2 solution stack · Governance, risk & compliance · AI automation for security · Business systems engineering · Engineer's toolkit · Your first 90 days |
| **Quizzes** | 57 questions across 10 module quizzes, each with an explanation. The best score is saved. |
| **Flashcards** | 96 glossary terms reviewed with a Leitner schedule (1, 3, 7, 14 and 30 days). Keyboard: space reveals, 1 = again, 2 = got it. |
| **Labs** | Read a BEC email header · a working IOC extractor · KQL drills · design a phishing-report workflow · spot prompt injection · billing reconciliation (interactive) |
| **Shift scenarios** | 02:47 impossible travel (M365 account takeover) · Monday phishing surge · your report automation emails the wrong client |
| **Tools** | A practice Cyber Resilience Scorecard (20 questions across users, email, data, machines and internet, which produces a prioritised action plan) · an Automation scorer that ranks your friction log by value, effort, risk and confidence |
| **Get ready** | A 30-60-90 day plan checklist · day-one questions for each stakeholder · a countdown and daily pace based on your start date |

Anything specific to J2's internal tools or numbers is marked **"Verify on day one"**. The course was written from public information and general industry knowledge, so treat those points as things to check, not facts.

## Run it

- **Easiest:** open `dist/j2-field-manual.html` in a browser. It's one self-contained file.
- **From source:** open `index.html`, or serve the folder with `npm run serve`.
- **GitHub Pages:** turn on Pages for this repo and point it at the root of the branch. `index.html` works as it is.

## Develop

```
js/content/*.js   course content: modules, glossary, labs, scenarios, scorecard, plan
js/app.js         router, views, progress state, tools
css/app.css       design tokens (light + dark) and components
scripts/build.mjs bundles everything into dist/ (single-file builds)
scripts/smoke.mjs headless Chromium test: visits every route, exercises every tool
```

```
npm run build   # regenerate dist/
npm test        # build + smoke test (needs Playwright + Chromium)
```

To add a lesson, add an object to a module's `lessons` array in `js/content/mXX-*.js`. Its case ID (for example `J2-SOC-03`), its place in the navigation and its progress tracking are all generated for you.

## Backup

Progress lives in your browser's `localStorage`. To move it to another device, go to **Settings → Copy progress**, then paste that text into **Restore** on the other device.
