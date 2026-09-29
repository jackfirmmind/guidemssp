(function () {
'use strict';
var C = window.COURSE, H = window.H, esc = H.esc;
var KEY = 'j2-crash-course.v2';
var INTERVALS = [0, 1, 3, 7, 14, 30];
var BLOCK_MINS = 40;

/* ---------------- state ---------------- */
function defaults() {
  return { profile: { name: 'Jack' }, prefs: { size: 'm', focus: true }, done: {}, quiz: {}, checks: {}, cards: {}, sc: {}, asked: {} };
}
function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var o = JSON.parse(raw), out = Object.assign(defaults(), o);
      out.profile = Object.assign(defaults().profile, o.profile || {});
      out.prefs = Object.assign(defaults().prefs, o.prefs || {});
      return out;
    }
  } catch (e) { /* storage unavailable: run in memory */ }
  return defaults();
}
var S = load();
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }

/* ---------------- dates ---------------- */
function pad(n) { return String(n).padStart(2, '0'); }
function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
function today() { return iso(new Date()); }
function addDays(s, n) { var p = s.split('-'), d = new Date(+p[0], +p[1] - 1, +p[2]); d.setDate(d.getDate() + n); return iso(d); }

/* ---------------- course index: one ordered list of steps, grouped into ~40 min blocks ---------------- */
var LESSONS = [], STEPS = [];
C.modules.forEach(function (m, mi) {
  m.num = mi + 1;
  m.lessons.forEach(function (l, li) {
    l.key = m.id + '.' + l.id; l.module = m; l.pos = li + 1;
    LESSONS.push(l);
    STEPS.push({ type: 'lesson', key: l.key, title: l.title, mins: l.mins, href: '#' + l.key, module: m });
  });
  if (m.quiz.length) STEPS.push({ type: 'quiz', key: m.id + '.quiz', title: 'Quick quiz: ' + m.title, mins: Math.max(3, Math.round(m.quiz.length * 0.8)), href: '#' + m.id + '.quiz', module: m });
});
STEPS.push({ type: 'review', key: 'review.cheat', title: 'Read the cheat sheet', mins: 10, href: '#cheatsheet' });
STEPS.push({ type: 'review', key: 'review.cards', title: 'Flashcards: one round', mins: 15, href: '#cards' });

var BLOCKS = [];
(function () {
  var cur = { steps: [], mins: 0 };
  STEPS.forEach(function (s, i) {
    cur.steps.push(s); cur.mins += s.mins; s.index = i;
    var nextIsQuiz = STEPS[i + 1] && STEPS[i + 1].type === 'quiz';
    if (cur.mins >= BLOCK_MINS && !nextIsQuiz) { BLOCKS.push(cur); cur = { steps: [], mins: 0 }; }
  });
  if (cur.steps.length) BLOCKS.push(cur);
  BLOCKS.forEach(function (b, i) { b.num = i + 1; b.steps.forEach(function (s) { s.block = b; }); });
})();

function stepDone(s) { return s.type === 'quiz' ? !!S.quiz[s.key.split('.')[0]] : !!S.done[s.key]; }
function nextStep() { return STEPS.find(function (s) { return !stepDone(s); }); }
function minsLeft() { return STEPS.reduce(function (a, s) { return a + (stepDone(s) ? 0 : s.mins); }, 0); }
function totalMins() { return STEPS.reduce(function (a, s) { return a + s.mins; }, 0); }
function doneSteps() { return STEPS.filter(stepDone).length; }
function hm(mins) { var h = Math.floor(mins / 60), m = mins % 60; return ((h ? h + ' h ' : '') + (m || !h ? m + ' min' : '')).trim(); }
function mod(id) { return C.modules.find(function (m) { return m.id === id; }); }
function stepByKey(k) { return STEPS.find(function (s) { return s.key === k; }); }
function isDue(t) { var c = S.cards[t.id]; return !c || c.due <= today(); }
function dueCount() { return C.glossary.filter(isDue).length; }
function bar(pct, label) { return '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="' + (label || 'Progress') + '"><span style="width:' + pct + '%"></span></div>'; }
function strip(html) { return String(html).replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim(); }

/* After finishing a step: go to the break screen if it closed a block, otherwise straight on. */
function afterStep(key) {
  var s = stepByKey(key);
  if (!s) return '#home';
  var b = s.block;
  if (s === b.steps[b.steps.length - 1] && b.steps.every(stepDone) && b.num < BLOCKS.length) return '#break';
  var n = STEPS.slice(s.index + 1).find(function (x) { return !stepDone(x); }) || nextStep();
  return n ? n.href : '#finished';
}

/* ---------------- transient view state ---------------- */
var quizState = { mid: null, i: 0, picks: [] };
var cardState = { filter: 'all', queue: null, revealed: false, ahead: false, reviewed: 0 };
var wordQ = '', searchQ = '', resetArmed = false, lastBreakBlock = 1;

/* ---------------- shared bits ---------------- */
function head(eyebrow, title, lede) {
  return '<header class="head"><div class="eyebrow">' + eyebrow + '</div><h1>' + title + '</h1>' + (lede ? '<p class="lede">' + lede + '</p>' : '') + '</header>';
}
function stepRow(s, current) {
  var done = stepDone(s);
  var kind = s.type === 'quiz' ? 'Quiz' : s.type === 'review' ? 'Review' : 'Lesson';
  return '<a class="step' + (done ? ' is-done' : '') + (current ? ' is-now' : '') + '" href="' + s.href + '">' +
    '<span class="tick" aria-hidden="true">' + (done ? '✓' : '') + '</span>' +
    '<span class="step-main"><span class="step-kind">' + kind + (s.module ? ' · ' + esc(s.module.title) : '') + '</span><span class="step-title">' + esc(s.title) + '</span></span>' +
    '<span class="step-mins">' + (done ? 'Done' : s.mins + ' min') + '</span></a>';
}

/* ---------------- views ---------------- */
function viewHome() {
  var n = nextStep(), done = doneSteps(), pct = Math.round(done / STEPS.length * 100), left = minsLeft();
  var hero = n
    ? '<section class="next"><span class="next-label">' + (done ? 'Next up' : 'Start here') + ' · Block ' + n.block.num + ' of ' + BLOCKS.length + '</span><h2>' + esc(n.title) + '</h2><p>' + n.mins + ' minutes.' + (n.module ? ' Part of "' + esc(n.module.title) + '".' : '') + '</p>' +
      '<a class="btn big" href="' + n.href + '">' + (done ? 'Continue' : 'Start') + ' →</a></section>'
    : '<section class="next"><span class="next-label">All done</span><h2>You finished the crash course.</h2><p>Skim the cheat sheet the morning you start. That is all you need.</p><a class="btn big" href="#cheatsheet">Open cheat sheet →</a></section>';

  var prog = '<section class="panel"><div class="panel-head"><h3>Your progress</h3><span class="chip accent">' + done + ' of ' + STEPS.length + ' steps</span></div>' + bar(pct) +
    '<p class="muted" style="margin:0">' + (left ? 'About <strong>' + hm(left) + '</strong> of study left, plus short breaks.' : 'Nothing left. Well done.') + '</p></section>';

  var plan = '<section class="panel"><div class="panel-head"><h3>The plan</h3><span class="muted small">' + BLOCKS.length + ' blocks · short break after each</span></div>' +
    BLOCKS.map(function (b) {
      var bDone = b.steps.every(stepDone), isNow = n && n.block === b;
      return '<details class="block"' + (isNow ? ' open' : '') + '><summary><span class="block-name">Block ' + b.num + '</span><span class="block-meta">' + b.mins + ' min · ' + b.steps.length + ' steps</span>' +
        (bDone ? '<span class="chip done">Done</span>' : isNow ? '<span class="chip accent">Now</span>' : '<span class="chip">Later</span>') + '</summary>' +
        '<div class="steps">' + b.steps.map(function (s) { return stepRow(s, n === s); }).join('') + '</div>' +
        (b.num < BLOCKS.length ? '<p class="break-note">Then: 5 to 10 minute break</p>' : '') + '</details>';
    }).join('') + '</section>';

  var tools = '<div class="grid-3">' +
    '<a class="tile" href="#cheatsheet"><h4>Cheat sheet</h4><p>Everything on one page. Read it the morning you start.</p></a>' +
    '<a class="tile" href="#cards"><h4>Flashcards</h4><p>' + dueCount() + ' cards ready. Five minutes at a time.</p></a>' +
    '<a class="tile" href="#questions"><h4>Day-one questions</h4><p>Smart questions to ask in your first week.</p></a></div>';

  return '<div class="page">' +
    head('<span>Crash course</span><span>About ' + hm(totalMins()) + ' in total</span>', 'Hi ' + esc(S.profile.name || 'there') + '. Let\'s get you ready for J2.', 'What J2 does, how the business works, and the cyber security basics behind it. Short lessons, one idea at a time. You can stop whenever you like; progress saves automatically.') +
    hero + prog + plan + tools + '</div>';
}

function viewCourse() {
  return '<div class="page">' + head('<span>All lessons</span><span>' + LESSONS.length + ' lessons · ' + C.modules.filter(function (m) { return m.quiz.length; }).length + ' quizzes</span>', 'Course map', 'Six modules, in order. Lessons take 5 to 9 minutes each.') +
    C.modules.map(function (m) {
      var steps = STEPS.filter(function (s) { return s.module === m; });
      var d = steps.filter(stepDone).length, mins = steps.reduce(function (a, s) { return a + s.mins; }, 0);
      return '<section class="panel"><div class="panel-head"><h3><span class="mod-num">' + m.num + '</span>' + esc(m.title) + '</h3><span class="chip' + (d === steps.length ? ' done' : '') + '">' + d + '/' + steps.length + ' · ' + mins + ' min</span></div>' +
        '<p class="muted" style="margin:0">' + esc(m.short) + '</p><div class="steps">' + steps.map(function (s) { return stepRow(s, false); }).join('') + '</div></section>';
    }).join('') + '</div>';
}

function viewLesson(l) {
  var m = l.module, done = S.done[l.key], picked = S.checks[l.key];
  var dots = m.lessons.map(function (x) { return '<span class="dot' + (S.done[x.key] ? ' done' : '') + (x === l ? ' now' : '') + '" aria-hidden="true"></span>'; }).join('');
  var check = '';
  if (l.check) {
    var answered = picked !== undefined;
    check = '<section class="blk blk-check"><span class="blk-label">Quick check</span><p class="q-text">' + esc(l.check.q) + '</p><div class="opts">' +
      l.check.options.map(function (o, j) {
        var cls = answered ? (j === l.check.answer ? ' correct' : (j === picked ? ' wrong' : '')) : '';
        return '<button type="button" class="opt' + cls + '" data-act="check" data-key="' + l.key + '" data-j="' + j + '"' + (answered ? ' disabled' : '') + '>' + esc(o) + '</button>';
      }).join('') + '</div>' +
      (answered ? '<p class="feedback ' + (picked === l.check.answer ? 'good' : 'bad') + '" role="status"><strong>' + (picked === l.check.answer ? 'Correct.' : 'Not quite.') + '</strong> ' + esc(l.check.why) + '</p>' : '') + '</section>';
  }
  var words = l.words && l.words.length ? '<section class="blk blk-words"><span class="blk-label">Words to know</span><dl>' + l.words.map(function (w) { return '<div><dt>' + esc(w[0]) + '</dt><dd>' + esc(w[1]) + '</dd></div>'; }).join('') + '</dl></section>' : '';
  var ttsBtn = ('speechSynthesis' in window) ? '<button type="button" class="btn quiet small-btn" data-act="speak" data-key="' + l.key + '">Read aloud</button>' : '';

  return '<article class="page lesson">' +
    '<div class="lesson-top"><span class="eyebrow"><span>Module ' + m.num + ': ' + esc(m.title) + '</span><span>Lesson ' + l.pos + ' of ' + m.lessons.length + '</span><span>' + l.mins + ' min</span></span>' +
    '<span class="dots">' + dots + '</span></div>' +
    '<h1>' + esc(l.title) + '</h1>' +
    '<div class="btn-row">' + ttsBtn + '<button type="button" class="btn quiet small-btn" data-act="focus" aria-pressed="' + !!S.prefs.focus + '">Focus mode: ' + (S.prefs.focus ? 'on' : 'off') + '</button></div>' +
    '<section class="blk blk-tldr"><span class="blk-label">In one sentence</span><p>' + esc(l.tldr) + '</p></section>' +
    '<section class="blk blk-why"><span class="blk-label">Why it matters</span><p>' + esc(l.why) + '</p></section>' +
    '<section class="blk blk-points"><span class="blk-label">Key points</span><ol>' + l.points.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ol></section>' +
    (l.extra ? '<section class="blk blk-extra">' + l.extra + '</section>' : '') +
    (l.j2 ? '<section class="blk blk-j2"><span class="blk-label">At J2</span><p>' + l.j2 + '</p></section>' : '') +
    words +
    '<section class="blk blk-say"><span class="blk-label">Say it like this</span><p>"' + esc(l.say) + '"</p></section>' +
    check +
    '<footer class="lesson-foot">' +
    (done ? '<span class="chip done">Lesson done</span><a class="btn big" href="' + afterStep(l.key) + '">Next →</a>'
      : '<button class="btn big" type="button" data-act="complete" data-key="' + l.key + '">Done. Next →</button>') +
    '<a class="btn quiet" href="#home">Back to plan</a></footer></article>';
}

function viewQuiz(m) {
  if (quizState.mid !== m.id) quizState = { mid: m.id, i: 0, picks: [] };
  var qs = m.quiz, i = quizState.i;
  if (i >= qs.length) {
    var score = quizState.picks.reduce(function (a, p, k) { return a + (p === qs[k].answer ? 1 : 0); }, 0);
    var good = score / qs.length >= 0.8;
    return '<div class="page lesson">' + head('<span>Module ' + m.num + ': ' + esc(m.title) + '</span><span>Quiz finished</span>', score + ' out of ' + qs.length, good ? 'Great. You know this module.' : 'Good effort. The right answers are shown below. The key words are also in your flashcards.') +
      '<div class="steps">' + qs.map(function (q, k) {
        var ok = quizState.picks[k] === q.answer;
        return '<div class="step' + (ok ? ' is-done' : ' is-wrong') + '"><span class="tick" aria-hidden="true">' + (ok ? '✓' : '✗') + '</span><span class="step-main"><span class="step-title">' + esc(q.q) + '</span><span class="step-kind">Answer: ' + esc(q.options[q.answer]) + '</span></span></div>';
      }).join('') + '</div>' +
      '<div class="lesson-foot"><a class="btn big" href="' + afterStep(m.id + '.quiz') + '">Continue →</a><button class="btn quiet" type="button" data-act="quiz-restart">Try again</button></div></div>';
  }
  var q = qs[i], picked = quizState.picks[i], answered = picked !== undefined;
  return '<div class="page lesson">' +
    '<div class="lesson-top"><span class="eyebrow"><span>Quiz · Module ' + m.num + ': ' + esc(m.title) + '</span><span>Question ' + (i + 1) + ' of ' + qs.length + '</span></span>' +
    '<span class="dots">' + qs.map(function (_, k) { return '<span class="dot' + (k < i ? ' done' : '') + (k === i ? ' now' : '') + '" aria-hidden="true"></span>'; }).join('') + '</span></div>' +
    '<h1 class="q-h">' + esc(q.q) + '</h1>' +
    '<div class="opts big-opts">' + q.options.map(function (o, j) {
      var cls = answered ? (j === q.answer ? ' correct' : (j === picked ? ' wrong' : '')) : '';
      return '<button type="button" class="opt' + cls + '" data-act="quiz-pick" data-j="' + j + '"' + (answered ? ' disabled' : '') + '>' + esc(o) + '</button>';
    }).join('') + '</div>' +
    (answered ? '<p class="feedback ' + (picked === q.answer ? 'good' : 'bad') + '" role="status"><strong>' + (picked === q.answer ? 'Correct.' : 'Not quite.') + '</strong> ' + esc(q.why) + '</p>' +
      '<div class="lesson-foot"><button class="btn big" type="button" data-act="quiz-next">' + (i + 1 < qs.length ? 'Next question →' : 'See my score →') + '</button></div>' : '') +
    '</div>';
}

function viewBreak() {
  var b = BLOCKS[lastBreakBlock - 1] || BLOCKS[0], nb = BLOCKS[b.num], n = nextStep();
  return '<div class="page lesson">' + head('<span>Block ' + b.num + ' of ' + BLOCKS.length + ' done</span>', 'Break time.', 'You finished block ' + b.num + '. Take 5 to 10 minutes away from the screen. Your progress is saved.') +
    '<section class="panel"><h3>Ideas for the break</h3><ul class="plain-list"><li>Stand up and stretch.</li><li>Drink some water.</li><li>Walk around for a few minutes.</li><li>Look at something far away to rest your eyes.</li></ul></section>' +
    (nb ? '<section class="panel"><h3>Next: block ' + nb.num + ' (' + nb.mins + ' min)</h3><div class="steps">' + nb.steps.map(function (s) { return stepRow(s, false); }).join('') + '</div></section>' : '') +
    '<div class="lesson-foot">' + (n ? '<a class="btn big" href="' + n.href + '">I\'m back. Continue →</a>' : '<a class="btn big" href="#finished">Finish →</a>') + '<a class="btn quiet" href="#home">Back to plan</a></div></div>';
}

function viewFinished() {
  return '<div class="page lesson">' + head('<span>Crash course complete</span>', 'You\'re ready.', 'You now know what J2 does, how the business works, and the cyber security basics behind it. That is enough for day one.') +
    '<section class="panel"><h3>Before you walk in</h3><ul class="plain-list"><li>Read the <a href="#cheatsheet">cheat sheet</a> once, the morning you start.</li><li>Say your 60-second J2 explanation out loud once.</li><li>Pick 3 <a href="#questions">day-one questions</a> to ask.</li><li>Nobody expects you to know everything on day one. Asking questions is part of the job.</li></ul></section></div>';
}

function viewCheatsheet() {
  var facts = ['Cyber security company, founded <strong>2006</strong> in <strong>Honeydew, Johannesburg</strong>.', 'Head offices in <strong>London</strong> and <strong>Johannesburg</strong>.', '<strong>700+ customers</strong> on <strong>5 continents</strong>.', 'Managed security service provider (MSSP) with a <strong>24/7 SOC</strong>. Also provides MDR.', 'Big idea: <strong>cyber resilience</strong>. Prevent, detect, respond, recover.', 'Tagline: <strong>"We keep your business in business."</strong>'];
  var areas = '<div class="area-cards">' + C.areas.map(function (a, i) {
    return '<section class="area-card"><span class="area-num">' + (i + 1) + '</span><h3>' + esc(a.name) + '</h3><p class="area-risk">' + esc(a.risk) + '</p><p class="area-quote">"' + esc(a.quote) + '"</p><ul>' + a.services.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></section>';
  }).join('') + '</div>';
  return '<div class="page wide">' + head('<span>One page</span><span>About 10 minutes to read</span>', 'Cheat sheet', 'Everything important on one page. Read it once the morning you start.') +
    '<section class="panel"><h3>J2 in six facts</h3><ol class="plain-list">' + facts.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ol></section>' +
    '<section class="panel"><div class="panel-head"><h3>The five areas</h3><span class="chip accent">U E D M I: "U Eat Donuts, Mostly Iced"</span></div>' + areas + '</section>' +
    '<div class="grid-2">' +
    '<section class="panel"><h3>How J2 works</h3>' + H.flow(['Scorecard / assessment', 'Proposal', 'Onboarding', '24/7 SOC monitoring', 'Reports and reviews', 'Renewal and growth']) + '<p class="small muted" style="margin:0">Money: recurring monthly fees. Growth: new clients, and clients adding areas.</p></section>' +
    '<section class="panel"><h3>How the SOC works</h3>' + H.flow(['Alert', 'Triage', 'Investigate', 'Contain', 'Tell the client', 'Fix and report']) + '<p class="small muted" style="margin:0">J2\'s words: identify, isolate and remove threats as they happen.</p></section>' +
    '</div>' +
    '<section class="panel"><h3>Numbers J2 uses</h3><ul class="plain-list"><li><strong>90%+</strong> of cyber attacks start in email.</li><li><strong>80%</strong> of breaches come from the actions of just <strong>8%</strong> of users.</li><li>The scorecard: <strong>20 questions</strong>, <strong>5 areas</strong>.</li></ul></section>' +
    '<section class="panel"><h3>Partners</h3>' + H.table(['Partner', 'Area', 'Known for'], [['Mimecast', 'Email', 'Email gateway, archiving, continuity, training'], ['IRONSCALES', 'Email', 'AI phishing detection inside the mailbox'], ['DTEX', 'Users, Data', 'Insider risk, behavioural DLP'], ['Microsoft 365', 'Email, Users', 'The platform J2 monitors 24/7']]) + '</section>' +
    '<section class="panel"><h3>Rules clients follow</h3><ul class="plain-list"><li><strong>POPIA</strong>: South Africa\'s personal information law.</li><li><strong>UK GDPR</strong>: UK data law. Serious breaches reported within 72 hours.</li><li><strong>ISO 27001</strong>: international security certification.</li></ul></section>' +
    '<section class="panel"><h3>Phrasebook</h3>' + H.table(['Phrase', 'Plain English'], C.phrases.map(function (p) { return ['<strong>' + esc(p[0]) + '</strong>', esc(p[1])]; })) + '</section>' +
    '<section class="panel"><h3>Your 60-second explanation</h3><blockquote class="pitch">' + esc(C.pitch) + '</blockquote></section>' +
    '<div class="lesson-foot">' + (S.done['review.cheat'] ? '<span class="chip done">Read</span>' : '<button class="btn big" type="button" data-act="review-done" data-key="review.cheat">I\'ve read it →</button>') + '<a class="btn quiet" href="#home">Back to plan</a></div></div>';
}

/* ----- flashcards ----- */
function cardPool() { return C.glossary.filter(function (g) { return cardState.filter === 'all' || g.module === cardState.filter; }); }
function buildQueue() {
  var pool = cardPool(), due = cardState.ahead ? pool.slice() : pool.filter(isDue);
  due.sort(function (a, b) { var ba = (S.cards[a.id] || { box: 0 }).box, bb = (S.cards[b.id] || { box: 0 }).box; return ba - bb || a.term.localeCompare(b.term); });
  cardState.queue = due.map(function (g) { return g.id; });
  cardState.revealed = false;
}
function viewCards() {
  var pool = cardPool();
  var opts = '<option value="all">All words (' + C.glossary.length + ')</option>' + C.modules.filter(function (m) { return C.glossary.some(function (g) { return g.module === m.id; }); }).map(function (m) {
    return '<option value="' + m.id + '"' + (cardState.filter === m.id ? ' selected' : '') + '>Module ' + m.num + ': ' + esc(m.title) + '</option>';
  }).join('');
  var cur = cardState.queue.length ? C.glossary.find(function (g) { return g.id === cardState.queue[0]; }) : null;
  var known = pool.filter(function (g) { return (S.cards[g.id] || { box: 0 }).box > 0; }).length;
  var stage;
  if (cur) {
    stage = '<div class="flash" aria-live="polite"><span class="eyebrow"><span>' + cardState.queue.length + ' left in this round</span></span><div class="term">' + esc(cur.term) + '</div>' +
      (cardState.revealed ? '<div class="def">' + esc(cur.def) + '</div>' : '<div class="def muted">Say what it means, out loud or in your head. Then show the answer.</div>') + '</div>' +
      '<div class="btn-row">' + (cardState.revealed
        ? '<button class="btn quiet big" type="button" data-act="card-again">Not yet <span class="kbd">1</span></button><button class="btn big" type="button" data-act="card-good">Got it <span class="kbd">2</span></button>'
        : '<button class="btn big" type="button" data-act="card-reveal">Show answer <span class="kbd">Space</span></button>') + '</div>';
  } else {
    stage = '<div class="empty"><h3>Round finished</h3><p>' + (cardState.reviewed ? 'You went through ' + cardState.reviewed + ' cards. ' : '') + 'Cards you got right come back in a few days.</p><div class="btn-row" style="justify-content:center">' +
      (S.done['review.cards'] ? '' : '<button class="btn" type="button" data-act="review-done" data-key="review.cards">Mark flashcards done</button>') +
      '<button class="btn quiet" type="button" data-act="card-ahead">Go through them all again</button></div></div>';
  }
  return '<div class="page lesson">' + head('<span>Flashcards</span><span>' + known + ' of ' + pool.length + ' known</span>', 'Flashcards', 'One word at a time. "Got it" moves the card on. "Not yet" brings it back at the end of this round.') +
    '<div class="field" style="max-width:360px"><label for="cards-filter">Which words</label><select id="cards-filter" data-input="cards-filter">' + opts + '</select></div>' +
    bar(pool.length ? Math.round(known / pool.length * 100) : 0, 'Words known') + stage + '</div>';
}
function answerCard(good) {
  var id = cardState.queue.shift(), c = S.cards[id] || { box: 0 };
  if (good) { c.box = Math.min(5, c.box + 1); c.due = addDays(today(), INTERVALS[c.box]); }
  else { c.box = 0; c.due = today(); cardState.queue.push(id); }
  S.cards[id] = c; cardState.reviewed++; cardState.revealed = false;
  save(); render(true);
}

/* ----- word list ----- */
function viewWords() {
  return '<div class="page">' + head('<span>Word list</span><span>' + C.glossary.length + ' words</span>', 'Word list', 'Every term from the course, in plain English.') +
    '<div class="field"><label for="word-q">Find a word</label><input id="word-q" type="text" data-input="words" placeholder="e.g. DMARC, SOC, MDR" value="' + esc(wordQ) + '"></div><div id="word-list"></div></div>';
}
function wordsUpdate() {
  var el = document.getElementById('word-list');
  if (!el) return;
  var q = wordQ.trim().toLowerCase();
  var list = C.glossary.filter(function (g) { return !q || (g.term + ' ' + g.def).toLowerCase().indexOf(q) > -1; }).sort(function (a, b) { return a.term.localeCompare(b.term); });
  el.innerHTML = list.length ? '<dl class="words">' + list.map(function (g) { return '<div><dt>' + esc(g.term) + '</dt><dd>' + esc(g.def) + '</dd></div>'; }).join('') + '</dl>'
    : '<div class="empty">No words match "' + esc(wordQ) + '".</div>';
}

/* ----- scorecard ----- */
var SC_EXAMPLE = { u1: 2, u2: 1, u3: 0, u4: 0, e1: 2, e2: 0, e3: 1, e4: 1, d1: 1, d2: 2, d3: 0, d4: 1, m1: 1, m2: 2, m3: 1, m4: 1, i1: 0, i2: 1, i3: 0, i4: 0 };
var SC_LABELS = ['No', 'Partly', 'Mostly', 'Yes'];
function viewScorecard() {
  var own = Object.keys(S.sc).length > 0, ans = own ? S.sc : SC_EXAMPLE;
  var rows = C.scorecardAreas.map(function (a) {
    var qs = C.scorecard.filter(function (q) { return q.area === a.id; });
    var got = qs.reduce(function (s, q) { return s + (ans[q.id] || 0); }, 0);
    return { a: a, pct: Math.round(got / (qs.length * 3) * 100) };
  });
  var overall = Math.round(rows.reduce(function (s, r) { return s + r.pct; }, 0) / rows.length);
  var level = overall >= 70 ? ['done', 'Strong'] : overall >= 40 ? ['warn', 'Developing'] : ['bad', 'Exposed'];
  var plan = C.scorecard.filter(function (q) { return ans[q.id] !== undefined && ans[q.id] < 3; })
    .map(function (q) { return { q: q, p: q.w * (3 - ans[q.id]) }; }).sort(function (x, y) { return y.p - x.p; }).slice(0, 6);
  var answered = C.scorecard.filter(function (q) { return S.sc[q.id] !== undefined; }).length;

  var result = '<section class="panel"><div class="panel-head"><h3>Result by area</h3><span class="chip ' + level[0] + '">' + level[1] + ' · ' + overall + '%</span></div><div class="area-bars">' +
    rows.map(function (r) { return '<div class="area-bar"><span>' + esc(r.a.name) + '</span><span class="track"><span class="fill" style="width:' + r.pct + '%"></span></span><span class="val">' + r.pct + '%</span></div>'; }).join('') + '</div></section>';
  var planHtml = '<section class="panel"><h3>Action plan: fix these first</h3>' + (plan.length ? '<ol class="plain-list">' + plan.map(function (x) {
    return '<li>' + esc(x.q.action) + ' <span class="chip">' + esc(C.scorecardAreas.find(function (a) { return a.id === x.q.area; }).name) + '</span></li>';
  }).join('') + '</ol>' : '<p class="muted" style="margin:0">No gaps among the answered questions.</p>') + '</section>';
  var qs = C.scorecardAreas.map(function (a) {
    return '<section class="panel"><h3>' + esc(a.name) + '</h3>' + C.scorecard.filter(function (q) { return q.area === a.id; }).map(function (q) {
      return '<div class="sc-q"><span>' + esc(q.q) + '</span><span class="seg" role="group" aria-label="' + esc(q.q) + '">' + SC_LABELS.map(function (lab, v) {
        return '<button type="button" data-act="sc-answer" data-q="' + q.id + '" data-v="' + v + '" aria-pressed="' + (own && S.sc[q.id] === v) + '">' + lab + '</button>';
      }).join('') + '</span></div>';
    }).join('') + '</section>';
  }).join('');
  return '<div class="page">' + head('<span>Bonus · about 10 min</span>', 'Practice scorecard', 'See how J2 starts a conversation with a new client: answer questions across the five areas, then read the action plan. Each fix names the J2 service that matches it.') +
    '<aside class="blk blk-verify"><span class="blk-label">Good to know</span><p>These 20 questions were written for this course. They follow J2\'s five areas, but they are not J2\'s real scorecard.</p></aside>' +
    (own ? '<div class="btn-row"><span class="chip accent">' + answered + ' of 20 answered</span><button class="btn quiet" type="button" data-act="sc-clear">Clear answers</button></div>'
      : '<aside class="blk blk-j2"><span class="blk-label">Example company</span><p>This shows a sample 150-person company. Answer any question below to start your own (try a company you know).</p></aside>') +
    result + planHtml + qs + '</div>';
}

/* ----- day-one questions ----- */
function viewQuestions() {
  return '<div class="page">' + head('<span>Day one</span>', 'Day-one questions', 'Pick about 3 to ask in each first meeting. Tick them off when you have an answer.') +
    C.questions.map(function (g, gi) {
      return '<section class="panel"><h3>' + esc(g.who) + '</h3><div class="checklist">' + g.items.map(function (q, i) {
        var k = gi + '-' + i, on = !!S.asked[k];
        return '<label class="check' + (on ? ' is-done' : '') + '" for="ask-' + k + '"><input type="checkbox" id="ask-' + k + '" data-input="ask" data-k="' + k + '"' + (on ? ' checked' : '') + '><span>' + esc(q) + '</span></label>';
      }).join('') + '</div></section>';
    }).join('') + '</div>';
}

/* ----- settings ----- */
function sizeButtons(compact) {
  return '<div class="seg" role="group" aria-label="Text size">' + [['m', 'Normal', 'A'], ['l', 'Large', 'A+'], ['xl', 'Extra large', 'A++']].map(function (s) {
    return '<button type="button" data-act="size" data-v="' + s[0] + '" aria-pressed="' + (S.prefs.size === s[0]) + '"' + (compact ? ' aria-label="' + s[1] + '"' : '') + '>' + (compact ? s[2] : s[1]) + '</button>';
  }).join('') + '</div>';
}
function viewSettings() {
  return '<div class="page">' + head('<span>Settings</span>', 'Settings', 'Make the course comfortable for you. Everything is saved in this browser only.') +
    '<section class="panel"><h3>Your name</h3><div class="field" style="max-width:320px"><label for="set-name">Name shown on the home page</label><input id="set-name" type="text" value="' + esc(S.profile.name) + '" data-change="name"></div></section>' +
    '<section class="panel"><h3>Reading</h3><div class="field"><span class="field-label">Text size</span>' + sizeButtons() + '</div>' +
    '<div class="field"><span class="field-label">Focus mode in lessons</span><div class="seg" role="group" aria-label="Focus mode"><button type="button" data-act="set-focus" data-v="1" aria-pressed="' + !!S.prefs.focus + '">On</button><button type="button" data-act="set-focus" data-v="0" aria-pressed="' + !S.prefs.focus + '">Off</button></div><span class="hint">Hides the side menu while you are in a lesson or quiz, so there is less on screen.</span></div></section>' +
    '<section class="panel"><h3>Backup</h3><p class="small muted" style="margin:0">Copy your progress as text. Paste it back here on another device to carry on.</p><div class="btn-row"><button class="btn quiet" type="button" data-act="export">Copy progress</button></div>' +
    '<div class="field"><label for="import-box">Restore from a backup</label><textarea id="import-box" placeholder="Paste backup text here"></textarea></div><div class="btn-row"><button class="btn quiet" type="button" data-act="import">Restore</button></div></section>' +
    '<section class="panel"><h3>Start over</h3><p class="small muted" style="margin:0">Deletes all progress, answers and flashcard history in this browser.</p><div class="btn-row">' +
    (resetArmed ? '<button class="btn danger" type="button" data-act="reset-confirm">Yes, delete my progress</button><button class="btn quiet" type="button" data-act="reset-cancel">Cancel</button>' : '<button class="btn quiet" type="button" data-act="reset-arm">Reset progress…</button>') + '</div></section></div>';
}

/* ----- search ----- */
function viewSearch() {
  var q = searchQ.trim().toLowerCase();
  if (!q) return '<div class="page">' + head('<span>Search</span>', 'Search', 'Type a word in the search box.') + '</div>';
  var ls = LESSONS.filter(function (l) { return (l.title + ' ' + l.tldr + ' ' + l.why + ' ' + strip(l.points.join(' ')) + ' ' + strip(l.extra || '') + ' ' + strip(l.j2 || '')).toLowerCase().indexOf(q) > -1; });
  var gs = C.glossary.filter(function (g) { return (g.term + ' ' + g.def).toLowerCase().indexOf(q) > -1; });
  return '<div class="page">' + head('<span>Search</span><span>' + (ls.length + gs.length) + ' results</span>', 'Results for "' + esc(searchQ) + '"', '') +
    (ls.length ? '<section class="panel"><h3>Lessons</h3><div class="steps">' + ls.map(function (l) { return stepRow(stepByKey(l.key), false); }).join('') + '</div></section>' : '') +
    (gs.length ? '<section class="panel"><h3>Words</h3><dl class="words">' + gs.map(function (g) { return '<div><dt>' + esc(g.term) + '</dt><dd>' + esc(g.def) + '</dd></div>'; }).join('') + '</dl></section>' : '') +
    (ls.length + gs.length ? '' : '<div class="empty">Nothing found. Try a shorter word.</div>') + '</div>';
}

/* ---------------- router ---------------- */
function route() {
  var h = decodeURIComponent((location.hash || '').replace(/^#/, '')) || 'home', m;
  if (h === 'home') return { nav: 'home', html: viewHome };
  if (h === 'course' || ((m = h.match(/^(m\d+)$/)) && mod(m[1]))) return { nav: 'course', html: viewCourse };
  if ((m = h.match(/^(m\d+)\.quiz$/)) && mod(m[1]) && mod(m[1]).quiz.length) { var qm = mod(m[1]); return { nav: 'course', focus: true, html: function () { return viewQuiz(qm); } }; }
  if ((m = h.match(/^(m\d+\.l\d+)$/))) { var l = LESSONS.find(function (x) { return x.key === m[1]; }); if (l) return { nav: 'course', focus: true, html: function () { return viewLesson(l); } }; }
  if (h === 'break') return { nav: 'home', html: viewBreak };
  if (h === 'finished') return { nav: 'home', html: viewFinished };
  if (h === 'cheatsheet') return { nav: 'cheatsheet', html: viewCheatsheet };
  if (h === 'cards') return { nav: 'cards', html: function () { if (lastHash !== location.hash || !cardState.queue) buildQueue(); return viewCards(); } };
  if (h === 'words') return { nav: 'words', html: viewWords, after: wordsUpdate };
  if (h === 'scorecard') return { nav: 'scorecard', html: viewScorecard };
  if (h === 'questions') return { nav: 'questions', html: viewQuestions };
  if (h === 'settings') return { nav: 'settings', html: viewSettings };
  if (h === 'search') return { nav: '', html: viewSearch };
  return { nav: 'home', html: viewHome };
}

var main = document.getElementById('main'), shell = document.querySelector('.shell');
var lastHash = null;
function applyPrefs() {
  var sizes = { m: '100%', l: '112.5%', xl: '125%' };
  document.documentElement.style.fontSize = sizes[S.prefs.size] || '100%';
  var sb = document.getElementById('side-size');
  if (sb) sb.innerHTML = sizeButtons(true);
}
function render(keepScroll) {
  var y = window.scrollY, r = route();
  stopSpeaking();
  main.innerHTML = r.html();
  if (r.after) r.after();
  shell.classList.toggle('focus', !!(r.focus && S.prefs.focus));
  document.querySelectorAll('[data-nav]').forEach(function (a) {
    if (a.getAttribute('data-nav') === r.nav) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  var due = dueCount();
  document.getElementById('nav-due').textContent = due ? due : '';
  document.getElementById('nav-progress').innerHTML = bar(Math.round(doneSteps() / STEPS.length * 100), 'Course progress') + '<span>' + doneSteps() + ' of ' + STEPS.length + ' steps · ' + hm(minsLeft()) + ' left</span>';
  applyPrefs();
  if (keepScroll) window.scrollTo(0, y);
  else if (lastHash !== location.hash) { window.scrollTo(0, 0); try { main.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
  lastHash = location.hash;
  var sb = document.getElementById('sidebar');
  if (sb.classList.contains('open') && !keepScroll) { sb.classList.remove('open'); document.getElementById('menu-btn').setAttribute('aria-expanded', 'false'); }
}
function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
window.addEventListener('hashchange', function () { render(); });

/* ---------------- read aloud ---------------- */
function stopSpeaking() { try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) { /* ignore */ } }
function speakLesson(key, btn) {
  var l = LESSONS.find(function (x) { return x.key === key; });
  if (!l || !window.speechSynthesis) return;
  if (window.speechSynthesis.speaking) { stopSpeaking(); btn.textContent = 'Read aloud'; return; }
  var text = [l.title + '.', 'In one sentence. ' + l.tldr, 'Why it matters. ' + l.why, 'Key points.'].concat(l.points.map(strip)).concat(l.j2 ? ['At J2. ' + strip(l.j2)] : []).concat(['Say it like this. ' + l.say]).join(' ');
  try {
    var u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    u.onend = function () { btn.textContent = 'Read aloud'; };
    window.speechSynthesis.speak(u);
    btn.textContent = 'Stop reading';
  } catch (e) { toast('Read aloud is not available in this browser'); }
}

/* ---------------- interactions ---------------- */
function toast(msg) {
  document.querySelectorAll('.toast').forEach(function (x) { x.remove(); });
  var t = document.createElement('div');
  t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(function () { t.remove(); }, 2200);
}
function copyText(text, fallbackEl) {
  function fallback() {
    if (fallbackEl) { fallbackEl.value = text; fallbackEl.focus(); fallbackEl.select(); }
    toast('Select the text and copy it yourself');
  }
  try { navigator.clipboard.writeText(text).then(function () { toast('Copied'); }, fallback); } catch (e) { fallback(); }
}
function val(id) { var el = document.getElementById(id); return el ? el.value : ''; }
function finish(key) {
  var s = stepByKey(key);
  if (s && s.block) lastBreakBlock = s.block.num;
  return afterStep(key);
}

var actions = {
  'toggle-nav': function () {
    var sb = document.getElementById('sidebar'), open = !sb.classList.contains('open');
    sb.classList.toggle('open', open);
    document.getElementById('menu-btn').setAttribute('aria-expanded', String(open));
  },
  'complete': function (t) { S.done[t.dataset.key] = Date.now(); save(); var to = finish(t.dataset.key); toast('Nice. Lesson done.'); go(to); },
  'check': function (t) { S.checks[t.dataset.key] = +t.dataset.j; save(); render(true); },
  'speak': function (t) { speakLesson(t.dataset.key, t); },
  'focus': function () { S.prefs.focus = !S.prefs.focus; save(); render(true); },
  'set-focus': function (t) { S.prefs.focus = t.dataset.v === '1'; save(); render(true); },
  'size': function (t) { S.prefs.size = t.dataset.v; save(); render(true); },
  'quiz-pick': function (t) {
    var m = mod(quizState.mid);
    quizState.picks[quizState.i] = +t.dataset.j;
    if (quizState.i === m.quiz.length - 1) {
      var score = quizState.picks.reduce(function (a, p, k) { return a + (p === m.quiz[k].answer ? 1 : 0); }, 0);
      var prev = S.quiz[m.id];
      S.quiz[m.id] = { best: Math.max(score, prev ? prev.best : 0), total: m.quiz.length };
      save();
    }
    render(true);
  },
  'quiz-next': function () {
    quizState.i++;
    if (quizState.i >= mod(quizState.mid).quiz.length) { var s = stepByKey(quizState.mid + '.quiz'); if (s) lastBreakBlock = s.block.num; }
    render(); window.scrollTo(0, 0);
  },
  'quiz-restart': function () { quizState = { mid: null, i: 0, picks: [] }; render(); },
  'review-done': function (t) { S.done[t.dataset.key] = Date.now(); save(); go(finish(t.dataset.key)); },
  'card-reveal': function () { cardState.revealed = true; render(true); },
  'card-good': function () { answerCard(true); },
  'card-again': function () { answerCard(false); },
  'card-ahead': function () { cardState.ahead = true; buildQueue(); render(true); },
  'sc-answer': function (t) { S.sc[t.dataset.q] = +t.dataset.v; save(); render(true); },
  'sc-clear': function () { S.sc = {}; save(); render(true); },
  'export': function () { copyText(JSON.stringify(S), document.getElementById('import-box')); },
  'import': function () {
    try {
      var o = JSON.parse(val('import-box'));
      if (!o || typeof o !== 'object' || !o.done) throw new Error('bad');
      S = Object.assign(defaults(), o);
      S.profile = Object.assign(defaults().profile, o.profile || {});
      S.prefs = Object.assign(defaults().prefs, o.prefs || {});
      save(); cardState.queue = null; render(); toast('Progress restored');
    } catch (e) { toast('That text is not a valid backup. Paste the whole text you copied.'); }
  },
  'reset-arm': function () { resetArmed = true; render(true); },
  'reset-cancel': function () { resetArmed = false; render(true); },
  'reset-confirm': function () { S = defaults(); save(); resetArmed = false; cardState.queue = null; quizState = { mid: null, i: 0, picks: [] }; go('#home'); toast('Progress reset'); }
};

var inputs = {
  words: function (t) { wordQ = t.value; wordsUpdate(); },
  'cards-filter': function (t) { cardState.filter = t.value; cardState.ahead = false; buildQueue(); render(true); },
  ask: function (t) { if (t.checked) S.asked[t.dataset.k] = true; else delete S.asked[t.dataset.k]; save(); t.closest('.check').classList.toggle('is-done', t.checked); }
};

document.addEventListener('click', function (e) {
  var t = e.target.closest('[data-act]');
  if (t && actions[t.dataset.act]) actions[t.dataset.act](t, e);
});
document.addEventListener('input', function (e) {
  var t = e.target;
  if (t.dataset && t.dataset.input && inputs[t.dataset.input] && t.type !== 'checkbox' && t.tagName !== 'SELECT') inputs[t.dataset.input](t);
});
document.addEventListener('change', function (e) {
  var t = e.target;
  if (t.dataset && t.dataset.input && inputs[t.dataset.input] && (t.type === 'checkbox' || t.tagName === 'SELECT')) inputs[t.dataset.input](t);
  if (t.dataset && t.dataset.change === 'name') { S.profile.name = t.value.trim(); save(); toast('Saved'); }
});
document.addEventListener('keydown', function (e) {
  if (!/^#cards/.test(location.hash) || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
  if (!cardState.queue || !cardState.queue.length) return;
  if (!cardState.revealed && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); actions['card-reveal'](); }
  else if (cardState.revealed && e.key === '1') answerCard(false);
  else if (cardState.revealed && e.key === '2') answerCard(true);
});
document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault(); searchQ = val('search-input'); go('#search');
});

render();
})();
