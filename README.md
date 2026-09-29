# J2 Prep Field Manual

A short crash course to learn what **J2 MSSP** does before starting there. It covers the company, the managed security business model, the five J2 service areas, and the cyber security basics behind them. Designed to be ADHD- and autism-friendly, and to be finished in under 4 hours.

## What's inside

| Part | Contents |
|---|---|
| **6 modules, 24 lessons** (about 2 h 45 min) | J2 in 20 minutes · Cyber security basics · What an MSSP does · The J2 framework: 5 areas (users, email, data, machines, internet) · Partners, rules and industry words · Ready for day one |
| **5 quizzes** (26 questions) | One question at a time, with instant feedback |
| **Cheat sheet** | Everything on one page, for the morning you start |
| **Flashcards and word list** | 52 terms in plain English |
| **Practice scorecard** (bonus) | 20 questions across the five areas; produces an action plan that names the matching J2 service |
| **Day-one questions** | A checklist of questions for your manager, sales, the SOC and anyone else |

Total, including quizzes, the cheat sheet and one flashcard round: about 3.5 hours, split into five blocks of about 40 minutes with a break after each.

## Designed for focus

- Every lesson uses the same blocks in the same order: *In one sentence → Why it matters → Key points → At J2 → Words to know → Say it like this → Quick check*.
- One clear "next step" button. The home page shows the whole plan and where you are.
- Plain, literal language. Every term is explained where it's first used.
- Break screens between blocks.
- Focus mode (hides the menu during lessons), three text sizes, read-aloud, and a legible font (Atkinson Hyperlegible).
- Progress saves automatically, so you can stop at any time.

J2 facts come from J2's public service pages (users, email, data, machines, internet) and its About page. The practice scorecard questions were written for this course and are not J2's real scorecard.

## Run it

- Open `dist/j2-field-manual.html` in any browser. It's a single file.
- Or deploy the repo to Vercel. `vercel.json` builds `dist/` and serves it, so no settings are needed.

## Develop

```
js/content/course-*.js  lessons and quizzes (modules 1–6)
js/content/glossary.js  flashcard words
js/content/extras.js    practice scorecard and day-one questions
js/app.js               screens, progress, flashcards
css/app.css             styles (light and dark)
npm run build           writes dist/
npm test                build + headless smoke test (needs Playwright)
```

## Disclaimer

A personal study guide built from public information. It is not affiliated with, endorsed by, or produced by J2 Software / J2 MSSP.
