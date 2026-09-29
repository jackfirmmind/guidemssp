(function () {
'use strict';
var C = window.COURSE, H = window.H, esc = H.esc;
var KEY = 'j2-field-manual.v1';
var INTERVALS = [0, 1, 3, 7, 14, 30];

/* ---------------- state ---------------- */
function defaults() {
  return {
    profile: { name: 'Jack', startDate: '', rate: 450, currency: 'R' },
    done: {}, quiz: {}, cards: {}, notes: {}, plan: {}, asked: {}, sc: {}, scorer: null, scn: {}, labs: {}, activity: {}
  };
}
function load() {
  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var o = JSON.parse(raw), d = defaults();
      var out = Object.assign(d, o);
      out.profile = Object.assign(defaults().profile, o.profile || {});
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
function parseISO(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
function today() { return iso(new Date()); }
function addDays(s, n) { var d = parseISO(s); d.setDate(d.getDate() + n); return iso(d); }
function daysBetween(a, b) { return Math.round((parseISO(b) - parseISO(a)) / 86400000); }
function fmtDate(s) { return parseISO(s).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }); }
function validDate(s) { return /^\d{4}-\d{2}-\d{2}$/.test(s || ''); }

function touch() { var t = today(); S.activity[t] = (S.activity[t] || 0) + 1; save(); }
function streak() {
  var d = today(), n = 0;
  if (!S.activity[d]) d = addDays(d, -1);
  while (S.activity[d]) { n++; d = addDays(d, -1); }
  return n;
}

/* ---------------- course index ---------------- */
var LESSONS = [];
C.modules.forEach(function (m, mi) {
  m.num = mi;
  m.lessons.forEach(function (l, li) {
    l.key = m.id + '.' + l.id;
    l.caseId = 'J2-' + m.code + '-' + pad(li + 1);
    l.module = m;
    LESSONS.push(l);
  });
});
function mod(id) { return C.modules.find(function (m) { return m.id === id; }); }
function lab(id) { return C.labs.find(function (l) { return l.id === id; }); }
function scn(id) { return C.scenarios.find(function (s) { return s.id === id; }); }
function doneCount(m) { return m.lessons.filter(function (l) { return S.done[l.key]; }).length; }
function totalDone() { return LESSONS.filter(function (l) { return S.done[l.key]; }).length; }
function nextLesson() { return LESSONS.find(function (l) { return !S.done[l.key]; }); }
function remainingMins() {
  var a = LESSONS.reduce(function (s, l) { return s + (S.done[l.key] ? 0 : l.mins); }, 0);
  var b = C.labs.reduce(function (s, l) { return s + (S.labs[l.id] ? 0 : l.mins); }, 0);
  return a + b;
}
function quizAvg() {
  var ms = C.modules.filter(function (m) { return S.quiz[m.id]; });
  if (!ms.length) return null;
  return Math.round(ms.reduce(function (s, m) { return s + S.quiz[m.id].best / S.quiz[m.id].total; }, 0) / ms.length * 100);
}
function isDue(term) { var c = S.cards[term.id]; return !c || c.due <= today(); }
function dueCount() { return C.glossary.filter(isDue).length; }
function money(n) { return S.profile.currency + ' ' + Math.round(n).toLocaleString(); }
function ext(label, url) { return '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(label) + '</a>'; }
function bar(pct) { return '<div class="bar" role="img" aria-label="' + pct + '% complete"><span style="width:' + pct + '%"></span></div>'; }
function strip(html) { return html.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' '); }

/* ---------------- transient view state ---------------- */
var quizState = { mid: null, answers: {}, checked: false };
var scnState = { id: null, picks: [] };
var cardState = { filter: 'all', queue: null, revealed: false, ahead: false, reviewed: 0 };
var glossState = { q: '', letter: '' };
var searchQ = '';
var reconState = { tol: 5, price: 85 };
var scorerEdit = null;
var resetArmed = false;

/* ---------------- views ---------------- */
function head(eyebrow, title, lede) {
  return '<div class="head"><div class="eyebrow">' + eyebrow + '</div><h1>' + title + '</h1>' + (lede ? '<p class="lede">' + lede + '</p>' : '') + '</div>';
}

function viewHome() {
  var p = S.profile, rem = remainingMins(), n = nextLesson(), avg = quizAvg(), due = dueCount();
  var cd, daily = 30;
  if (validDate(p.startDate)) {
    var days = daysBetween(today(), p.startDate);
    if (days > 0) {
      daily = Math.max(10, Math.ceil(rem / days));
      cd = '<div class="countdown"><div><div class="cd-label">Days to start</div><div class="big">' + days + '</div></div>' +
        '<div class="cd-text">You start at J2 on <strong>' + fmtDate(p.startDate) + '</strong>. ' +
        (rem > 0 ? 'About <strong>' + Math.round(rem / 60 * 10) / 10 + ' hours</strong> of lessons and labs remain: roughly <strong>' + daily + ' minutes a day</strong> gets you through everything.' : 'You have finished every lesson and lab. Keep your flashcards warm.') + '</div></div>';
    } else if (days === 0) {
      cd = '<div class="countdown"><div><div class="cd-label">Today</div><div class="big">D1</div></div><div class="cd-text">Day one at J2. Bring your <a href="#questions">question list</a> and your <a href="#plan">30-60-90 plan</a>. Listen more than you talk.</div></div>';
    } else {
      cd = '<div class="countdown"><div><div class="cd-label">At J2</div><div class="big">D' + (1 - days) + '</div></div><div class="cd-text">You are on day ' + (1 - days) + '. Track progress on the <a href="#plan">30-60-90 plan</a> and keep scoring your friction log in the <a href="#scorer">Automation scorer</a>.</div></div>';
    }
  } else {
    cd = '<div class="countdown"><div><div class="cd-label">Start date</div><div class="big">?</div></div><div class="cd-text"><p style="margin:0 0 10px">Set your start date and the dashboard will pace the course for you.</p>' +
      '<div class="btn-row"><label class="sr-only" for="cd-date">Start date</label><input id="cd-date" type="date" style="max-width:200px"><button class="btn" type="button" data-act="save-start">Save date</button></div></div></div>';
  }

  var session = [], acc = 0;
  LESSONS.forEach(function (l) { if (!S.done[l.key] && (acc < daily) && session.length < 4) { session.push(l); acc += l.mins; } });

  var stats = '<div class="stats">' +
    stat('Lessons', totalDone() + '<span class="muted" style="font-size:1rem"> / ' + LESSONS.length + '</span>', Math.round(totalDone() / LESSONS.length * 100) + '% of curriculum') +
    stat('Quiz average', avg === null ? '—' : avg + '%', avg === null ? 'No quizzes taken yet' : 'Best score per module') +
    stat('Cards due', due, '<a href="#cards">Review now</a>') +
    stat('Streak', streak() + '<span class="muted" style="font-size:1rem"> days</span>', 'Days in a row with activity') + '</div>';

  var cont = n ? '<a class="tile" href="#' + n.key + '"><span class="eyebrow"><span class="case-id">' + n.caseId + '</span><span>Up next</span></span><h3>' + esc(n.title) + '</h3><p>' + esc(n.summary) + '</p><div class="chip-row"><span class="chip">' + n.mins + ' min</span><span class="chip">' + esc(n.module.title) + '</span></div></a>'
    : '<div class="tile"><h3>Curriculum complete</h3><p>Every lesson is done. Retake quizzes, run the scenarios again and keep your cards moving.</p></div>';

  var sess = '<div class="panel"><div class="panel-head"><h3>Today\'s session</h3><span class="chip accent">~' + acc + ' min</span></div>' +
    (session.length ? '<div class="lesson-list">' + session.map(lessonItem).join('') + '</div>' : '<p class="muted small" style="margin:0">Nothing left in the curriculum. Try a <a href="#scenarios">shift scenario</a>.</p>') +
    '<p class="small muted" style="margin:0">Plus 5 minutes of <a href="#cards">flashcards</a>.</p></div>';

  var mods = '<div class="panel"><div class="panel-head"><h3>Module progress</h3><a class="small" href="#modules">Open curriculum</a></div><div class="area-bars">' +
    C.modules.map(function (m) {
      var pct = Math.round(doneCount(m) / m.lessons.length * 100);
      return '<a class="area-bar" style="grid-template-columns:minmax(0,190px) minmax(0,1fr) 52px;text-decoration:none;color:inherit" href="#' + m.id + '"><span>' + esc(m.title) + '</span><span class="track" title="' + pct + '%"><span class="fill" style="display:block;width:' + pct + '%"></span></span><span class="val">' + doneCount(m) + '/' + m.lessons.length + '</span></a>';
    }).join('') + '</div></div>';

  var quick = '<div class="grid-3">' +
    '<a class="tile" href="#labs"><span class="eyebrow">Hands-on</span><h4>Labs</h4><p>Headers, IOCs, KQL, workflow design, prompt injection, billing reconciliation.</p></a>' +
    '<a class="tile" href="#scenarios"><span class="eyebrow">Judgement</span><h4>Shift scenarios</h4><p>02:47 impossible travel, a phishing surge, and your own automation going wrong.</p></a>' +
    '<a class="tile" href="#scorecard"><span class="eyebrow">Tool</span><h4>Resilience scorecard</h4><p>Practise the 20-question, five-area assessment and read the action plan it builds.</p></a></div>';

  return '<div class="page wide">' +
    head('<span>Dashboard</span><span>' + fmtDate(today()) + '</span>', 'Ready for J2, ' + esc(p.name || 'there') + '?', 'Your crash course for the AI Automation &amp; Business Systems Engineer role at J2 MSSP: the company, security operations, the MSSP business, and the automation craft you will be hired to practise.') +
    cd + stats + '<div class="grid-2 top">' + cont + sess + '</div>' + mods + quick + '</div>';
}
function stat(label, value, sub) {
  return '<div class="stat"><span class="stat-label">' + label + '</span><span class="stat-value">' + value + '</span><span class="stat-sub">' + sub + '</span></div>';
}
function lessonItem(l) {
  var done = S.done[l.key];
  return '<a class="lesson-item" href="#' + l.key + '"><span class="mono">' + l.caseId + '</span><span><strong>' + esc(l.title) + '</strong><span class="small muted">' + esc(l.summary) + '</span></span>' +
    (done ? '<span class="chip done">Done</span>' : '<span class="chip">' + l.mins + ' min</span>') + '</a>';
}

function viewModules() {
  return '<div class="page wide">' + head('<span>Curriculum</span><span>' + C.modules.length + ' modules · ' + LESSONS.length + ' lessons</span>', 'Curriculum', 'Work top to bottom. Modules 1 to 4 are the priority before day one; 7 to 10 are where your role lives.') +
    '<div class="module-list">' + C.modules.map(function (m) {
      var d = doneCount(m), pct = Math.round(d / m.lessons.length * 100), q = S.quiz[m.id];
      var mins = m.lessons.reduce(function (s, l) { return s + l.mins; }, 0);
      return '<a class="module-row" href="#' + m.id + '"><span class="module-num">' + pad(m.num) + '</span><span><span class="eyebrow">' + esc(m.tag) + '</span><h3>' + esc(m.title) + '</h3><p>' + esc(m.summary) + '</p></span>' +
        '<span class="module-meta"><span>' + d + '/' + m.lessons.length + ' lessons · ' + mins + ' min</span>' + bar(pct) + '<span>' + (m.quiz.length ? (q ? 'Quiz best ' + q.best + '/' + q.total : 'Quiz not taken') : 'No quiz') + '</span></span></a>';
    }).join('') + '</div></div>';
}

function viewModule(m) {
  var q = S.quiz[m.id];
  var labsHere = C.labs.filter(function (l) { return l.module === m.id; });
  var terms = C.glossary.filter(function (g) { return g.module === m.id; });
  return '<div class="page">' + head('<a href="#modules">Curriculum</a><span>Module ' + pad(m.num) + '</span><span>' + esc(m.tag) + '</span>', esc(m.title), esc(m.summary)) +
    '<div class="lesson-list">' + m.lessons.map(lessonItem).join('') + '</div>' +
    '<div class="grid-2">' +
    (m.quiz.length ? '<a class="tile" href="#' + m.id + '.quiz"><span class="eyebrow">Check yourself</span><h4>Module quiz</h4><p>' + m.quiz.length + ' questions with explanations.</p><div class="chip-row">' + (q ? '<span class="chip ' + (q.best / q.total >= .8 ? 'done' : 'warn') + '">Best ' + q.best + '/' + q.total + '</span>' : '<span class="chip">Not taken</span>') + '</div></a>' : '') +
    (terms.length ? '<a class="tile" href="#cards" data-act="cards-module" data-mid="' + m.id + '"><span class="eyebrow">Memorise</span><h4>' + terms.length + ' flashcards</h4><p>Glossary terms introduced in this module.</p></a>' : '') +
    labsHere.map(function (l) { return '<a class="tile" href="#lab.' + l.id + '"><span class="eyebrow">Lab</span><h4>' + esc(l.title) + '</h4><p>' + esc(l.summary) + '</p></a>'; }).join('') +
    '</div></div>';
}

function viewLesson(l) {
  var m = l.module, i = LESSONS.indexOf(l), prev = LESSONS[i - 1], next = LESSONS[i + 1], done = S.done[l.key];
  var nextHref = l === m.lessons[m.lessons.length - 1] && m.quiz.length ? '#' + m.id + '.quiz' : (next ? '#' + next.key : '#home');
  return '<article class="page">' +
    head('<span class="case-id">' + l.caseId + '</span><a href="#' + m.id + '">Module ' + pad(m.num) + ' · ' + esc(m.title) + '</a><span>' + l.mins + ' min</span>' + (done ? '<span class="chip done">Complete</span>' : ''), esc(l.title), esc(l.summary)) +
    '<div class="prose">' + l.body + '</div>' +
    (l.takeaways && l.takeaways.length ? '<div class="takeaways"><h4>Key takeaways</h4><ol>' + l.takeaways.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol></div>' : '') +
    (l.practice && l.practice.length ? '<div class="panel"><h4>Practice</h4><ul style="margin:0;padding-left:1.25rem;display:flex;flex-direction:column;gap:6px">' + l.practice.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' : '') +
    (l.links && l.links.length ? '<div class="panel"><h4>Go deeper</h4><ul style="margin:0;padding-left:1.25rem;display:flex;flex-direction:column;gap:6px">' + l.links.map(function (k) { return '<li>' + ext(k[0], k[1]) + '</li>'; }).join('') + '</ul></div>' : '') +
    '<div class="panel"><h4><label for="note-' + l.key + '">Your notes</label></h4><textarea id="note-' + l.key + '" data-input="note" data-key="' + l.key + '" placeholder="What surprised you? What will you ask on day one?">' + esc(S.notes[l.key] || '') + '</textarea><span class="small muted">Saved automatically in this browser.</span></div>' +
    '<div class="lesson-foot"><span>' + (prev ? '<a class="btn quiet" href="#' + prev.key + '">← ' + esc(prev.caseId) + '</a>' : '') + '</span>' +
    '<span class="btn-row">' + (done ? '<button class="btn ghost" type="button" data-act="undone" data-key="' + l.key + '">Mark as not done</button><a class="btn" href="' + nextHref + '">Continue →</a>'
      : '<button class="btn" type="button" data-act="complete" data-key="' + l.key + '" data-next="' + nextHref + '">Mark complete &amp; continue →</button>') + '</span></div>' +
    '</article>';
}

function viewQuiz(m) {
  if (quizState.mid !== m.id) quizState = { mid: m.id, answers: {}, checked: false };
  var qs = m.quiz, score = 0;
  if (quizState.checked) qs.forEach(function (q, i) { if (quizState.answers[i] === q.answer) score++; });
  var best = S.quiz[m.id];
  var summary = quizState.checked
    ? '<div class="callout ' + (score / qs.length >= .8 ? 'callout-tip' : 'callout-verify') + '"><span class="callout-label">Result</span><p style="margin:0"><strong>' + score + ' / ' + qs.length + '</strong>. ' + (score / qs.length >= .8 ? 'Solid. Move on and let flashcards keep it fresh.' : 'Re-read the lessons for the ones you missed, then retake.') + '</p></div>'
    : '';
  return '<div class="page">' + head('<a href="#' + m.id + '">Module ' + pad(m.num) + ' · ' + esc(m.title) + '</a><span>' + qs.length + ' questions</span>' + (best ? '<span>Best ' + best.best + '/' + best.total + '</span>' : ''), 'Module quiz', 'Choose one answer per question, then check.') +
    summary +
    qs.map(function (q, i) {
      return '<fieldset class="q" style="margin:0"><legend class="q-num">Question ' + (i + 1) + '</legend><div class="q-text">' + esc(q.q) + '</div><div class="opts">' +
        q.options.map(function (o, j) {
          var cls = '';
          if (quizState.checked) { if (j === q.answer) cls = ' correct'; else if (quizState.answers[i] === j) cls = ' wrong'; }
          return '<label class="opt' + cls + '"><input type="radio" id="q-' + m.id + '-' + i + '-' + j + '" name="q' + i + '" value="' + j + '" data-input="quiz" data-q="' + i + '"' + (quizState.answers[i] === j ? ' checked' : '') + (quizState.checked ? ' disabled' : '') + '><span>' + esc(o) + '</span></label>';
        }).join('') + '</div>' + (quizState.checked ? '<div class="why">' + esc(q.why) + '</div>' : '') + '</fieldset>';
    }).join('') +
    '<div class="btn-row">' + (quizState.checked ? '<button class="btn quiet" type="button" data-act="quiz-retake">Retake</button><a class="btn" href="#' + (nextModule(m) ? nextModule(m).id : 'home') + '">Next module →</a>'
      : '<button class="btn" type="button" data-act="quiz-check" data-mid="' + m.id + '">Check answers</button><span class="small muted">' + Object.keys(quizState.answers).length + ' of ' + qs.length + ' answered</span>') + '</div></div>';
}
function nextModule(m) { return C.modules[m.num + 1]; }

function viewLabs() {
  return '<div class="page wide">' + head('<span>Labs</span><span>' + C.labs.length + ' labs</span>', 'Labs', 'Hands-on exercises. Attempt each task before revealing the reference answer.') +
    '<div class="grid-2">' + C.labs.map(function (l) {
      return '<a class="tile" href="#lab.' + l.id + '"><span class="eyebrow"><span>' + l.mins + ' min</span><span>' + esc(mod(l.module).title) + '</span></span><h3>' + esc(l.title) + '</h3><p>' + esc(l.summary) + '</p><div class="chip-row">' +
        l.skills.map(function (s) { return '<span class="chip">' + esc(s) + '</span>'; }).join('') + (S.labs[l.id] ? '<span class="chip done">Done</span>' : '') + (l.tool ? '<span class="chip accent">Interactive</span>' : '') + '</div></a>';
    }).join('') + '</div></div>';
}

function viewLab(l) {
  var tool = l.tool === 'ioc' ? iocTool() : l.tool === 'recon' ? reconTool() : '';
  return '<div class="page' + (l.tool ? ' wide' : '') + '">' + head('<a href="#labs">Labs</a><span>' + l.mins + ' min</span><a href="#' + l.module + '">' + esc(mod(l.module).title) + '</a>', esc(l.title), esc(l.summary)) +
    '<div class="prose" style="max-width:none">' + l.body + '</div>' + tool +
    l.tasks.map(function (t, i) {
      return '<div class="panel"><span class="q-num">Task ' + (i + 1) + '</span><div class="q-text">' + t.q + '</div><details class="reveal"><summary>Reveal reference answer</summary><div>' + t.a + '</div></details></div>';
    }).join('') +
    '<div class="btn-row">' + (S.labs[l.id] ? '<span class="chip done">Lab complete</span><button class="btn ghost" type="button" data-act="lab-undone" data-id="' + l.id + '">Mark as not done</button>' : '<button class="btn" type="button" data-act="lab-done" data-id="' + l.id + '">Mark lab complete</button>') + '<a class="btn quiet" href="#labs">All labs</a></div></div>';
}

/* ----- IOC tool ----- */
var IOC_SAMPLE = 'Advisory (example data): The actor sent lures from billing@acme-supp1ies[.]com and hosted a fake login at hxxps://m365-securealerts[.]net/verify?id=7781.\n' +
  'Stage-two payload update.exe was fetched from 198.51.100.44 and beaconed to 203.0.113[.]7:443 and cdn-sync.zip.\n' +
  'Internal pivot observed from 10.20.4.17 to 192.168.1.50.\n' +
  'SHA256: 3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea\nMD5: 44d88612fea8a8f36de82e1278abb02f\nReport link: https://www.cisa.gov/news-events/cybersecurity-advisories.';
function iocTool() {
  return '<div class="panel"><div class="panel-head"><h3>Extractor</h3><button class="btn quiet" type="button" data-act="ioc-sample">Load sample</button></div>' +
    '<div class="field"><label for="ioc-input">Paste text (alerts, emails, threat reports)</label><textarea id="ioc-input" data-input="ioc" style="min-height:150px">' + esc(IOC_SAMPLE) + '</textarea></div><div id="ioc-out"></div></div>';
}
function isPrivate(ip) {
  var p = ip.split('.').map(Number);
  if (p[0] === 10 || p[0] === 127 || p[0] === 0) return 'Private / reserved';
  if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return 'Private';
  if (p[0] === 192 && p[1] === 168) return 'Private';
  if (p[0] === 169 && p[1] === 254) return 'Link-local';
  if ((p[0] === 192 && p[1] === 0 && p[2] === 2) || (p[0] === 198 && p[1] === 51 && p[2] === 100) || (p[0] === 203 && p[1] === 0 && p[2] === 113)) return 'Documentation range (RFC 5737)';
  return '';
}
function refang(t) { return t.replace(/hxxp/gi, 'http').replace(/\[\.\]|\(\.\)|\{\.\}/g, '.').replace(/\[:\]/g, ':').replace(/\[@\]|\[at\]/gi, '@'); }
function defang(v) { return v.replace(/^http/i, 'hxxp').replace(/\./g, '[.]'); }
var FILE_EXT = ['exe', 'dll', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'js', 'ps1', 'txt', 'png', 'jpg', 'html', 'htm', 'php', 'bat', 'vbs', 'iso', 'lnk'];
var AMBIG_TLD = ['zip', 'mov', 'sh', 'py', 'rs', 'md'];
function extractIOCs(text) {
  var t = refang(text), seen = {};
  function uniq(arr) { return arr.filter(function (v) { var k = v.toLowerCase(); if (seen[k]) return false; seen[k] = 1; return true; }); }
  var urls = uniq((t.match(/\bhttps?:\/\/[^\s"'<>]+/gi) || []).map(function (u) { return u.replace(/[.,;:)\]]+$/, ''); }));
  var emails = uniq(t.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g) || []);
  var ips = uniq((t.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || []).filter(function (ip) { return ip.split('.').every(function (o) { return +o <= 255; }); }));
  var hashes = uniq(t.match(/\b(?:[a-f0-9]{64}|[a-f0-9]{40}|[a-f0-9]{32})\b/gi) || []);
  var domains = uniq((t.match(/\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}\b/gi) || []).filter(function (d) { return !/^\d+(\.\d+)+$/.test(d); }));
  return { urls: urls, emails: emails, ips: ips, hashes: hashes, domains: domains };
}
function iocUpdate() {
  var el = document.getElementById('ioc-input'), out = document.getElementById('ioc-out');
  if (!el || !out) return;
  var r = extractIOCs(el.value), lines = [];
  function section(title, rows) {
    if (!rows.length) return '';
    return '<h4 style="margin-top:6px">' + title + ' <span class="chip">' + rows.length + '</span></h4>' + H.table(['Indicator (defanged)', 'Note'], rows.map(function (x) { return ['<span class="mono">' + esc(x[0]) + '</span>', x[1]]; }));
  }
  var ipRows = r.ips.map(function (ip) { var p = isPrivate(ip); lines.push(defang(ip)); return [defang(ip), p ? '<span class="chip warn">' + p + '</span> do not send to external lookups' : '<span class="chip accent">Public</span> candidate for reputation lookup']; });
  var urlRows = r.urls.map(function (u) { lines.push(defang(u)); return [defang(u), '']; });
  var emRows = r.emails.map(function (e) { lines.push(defang(e)); return [defang(e), '']; });
  var hRows = r.hashes.map(function (h) { lines.push(h); return [h, { 32: 'MD5', 40: 'SHA-1', 64: 'SHA-256' }[h.length]]; });
  var dRows = r.domains.map(function (d) {
    var tld = d.split('.').pop().toLowerCase(), note = '';
    if (FILE_EXT.indexOf(tld) > -1) note = '<span class="chip warn">Probably a file name</span>';
    else if (AMBIG_TLD.indexOf(tld) > -1) note = '<span class="chip warn">Ambiguous: .' + tld + ' is a real TLD and a file extension</span>';
    else lines.push(defang(d));
    return [defang(d), note];
  });
  var total = ipRows.length + urlRows.length + emRows.length + hRows.length + dRows.length;
  out.innerHTML = total ? section('IPv4 addresses', ipRows) + section('URLs', urlRows) + section('Email addresses', emRows) + section('Domains', dRows) + section('Hashes', hRows) +
    '<div class="field" style="margin-top:8px"><label for="ioc-copy">Defanged list for a ticket</label><textarea id="ioc-copy" readonly style="min-height:110px;font-family:var(--font-mono);font-size:.8125rem">' + esc(lines.join('\n')) + '</textarea></div><div class="btn-row"><button class="btn quiet" type="button" data-act="copy" data-target="ioc-copy">Copy list</button></div>'
    : '<div class="empty">No indicators found yet. Paste some text above.</div>';
}

/* ----- Recon tool ----- */
var RECON = [
  ['client-017', 'Email security', 412, 350, 350],
  ['client-023', 'Endpoint (EDR)', 142, 140, 140],
  ['client-042', 'Endpoint (EDR)', 188, 200, 200],
  ['client-056', 'Backup', 64, 60, 60],
  ['client-078', 'Email security', 230, 180, 180],
  ['client-091', 'Backup', 75, 120, 120],
  ['client-103', 'Email security', 95, 95, 80],
  ['client-117', 'Insider risk', 48, 50, 50]
];
function reconTool() {
  return '<div class="panel"><div class="panel-head"><h3>Reconciliation</h3><span class="chip">Example data</span></div>' +
    '<div class="form-grid"><div class="field"><label for="recon-tol">Tolerance (%)</label><input id="recon-tol" type="number" min="0" max="50" value="' + reconState.tol + '" data-input="recon"><span class="hint">Minimum 2 seats either way</span></div>' +
    '<div class="field"><label for="recon-price">Price per seat per month (' + esc(S.profile.currency) + ')</label><input id="recon-price" type="number" min="0" value="' + reconState.price + '" data-input="recon"></div></div><div id="recon-out"></div></div>';
}
function reconUpdate() {
  var out = document.getElementById('recon-out');
  if (!out) return;
  var tol = Math.max(0, +document.getElementById('recon-tol').value || 0), price = Math.max(0, +document.getElementById('recon-price').value || 0);
  reconState.tol = tol; reconState.price = price;
  var leak = 0, over = 0, flags = 0;
  var rows = RECON.map(function (r) {
    var dep = r[2], con = r[3], inv = r[4], band = Math.max(2, Math.ceil(con * tol / 100)), gap = dep - con, chips = [];
    if (gap > band) { chips.push('<span class="chip bad">Under-billed ' + gap + '</span>'); }
    else if (gap < -band) { chips.push('<span class="chip warn">Over-billed ' + (-gap) + '</span>'); over += (con - dep) * price; }
    if (inv !== con) chips.push('<span class="chip bad">Invoice ≠ contract ' + (con - inv) + '</span>');
    var unbilled = (gap > band || inv !== con) ? Math.max(0, dep - inv) : 0;
    leak += unbilled * price;
    if (chips.length) flags++;
    return [r[0], r[1], '<span class="num">' + dep + '</span>', con, inv, chips.length ? chips.join(' ') : '<span class="chip">Within tolerance</span>', unbilled ? money(unbilled * price) : '—'];
  });
  out.innerHTML = '<div class="stats" style="grid-template-columns:repeat(3,minmax(0,1fr))">' +
    stat('Flagged lines', flags + '<span class="muted" style="font-size:1rem"> / ' + RECON.length + '</span>', 'Need an account manager decision') +
    stat('Unbilled / month', money(leak), money(leak * 12) + ' a year') +
    stat('Over-billed / month', money(over), 'A renewal risk if left') + '</div>' +
    H.table(['Client', 'Service', 'Deployed', 'Contracted', 'Invoiced', 'Flag', 'Unbilled / mo'], rows);
}

/* ----- scenarios ----- */
function viewScenarios() {
  return '<div class="page wide">' + head('<span>Shift scenarios</span><span>' + C.scenarios.length + ' drills</span>', 'Shift scenarios', 'Short decision drills. Each choice scores 0 to 3 and explains why. Replay until the best path feels obvious.') +
    '<div class="grid-3">' + C.scenarios.map(function (s) {
      var max = s.steps.length * 3, best = S.scn[s.id];
      return '<a class="tile" href="#scn.' + s.id + '"><span class="eyebrow">' + esc(s.setting) + '</span><h3>' + esc(s.title) + '</h3><p>' + esc(s.summary) + '</p><div class="chip-row">' + (best !== undefined ? '<span class="chip ' + (best / max >= .8 ? 'done' : 'warn') + '">Best ' + best + '/' + max + '</span>' : '<span class="chip">Not played</span>') + '<span class="chip">' + s.steps.length + ' decisions</span></div></a>';
    }).join('') + '</div></div>';
}
function viewScenario(s) {
  if (scnState.id !== s.id) scnState = { id: s.id, picks: [] };
  var max = s.steps.length * 3, score = scnState.picks.reduce(function (a, p, i) { return a + s.steps[i].choices[p].pts; }, 0);
  var html = '';
  s.steps.forEach(function (st, i) {
    if (i > scnState.picks.length) return;
    var picked = scnState.picks[i], answered = picked !== undefined, bestPts = Math.max.apply(null, st.choices.map(function (c) { return c.pts; }));
    html += '<div class="panel"><span class="q-num">Decision ' + (i + 1) + ' of ' + s.steps.length + '</span><div class="q-text">' + esc(st.text) + '</div><div class="opts">' +
      st.choices.map(function (c, j) {
        var cls = '';
        if (answered) { if (c.pts === bestPts) cls = ' best'; else if (j === picked) cls = c.pts > 0 ? ' picked-mid' : ' picked-bad'; }
        return '<button class="choice' + cls + '" type="button" data-act="scn-pick" data-step="' + i + '" data-choice="' + j + '"' + (answered ? ' disabled' : '') + '>' + esc(c.t) + (answered && j === picked ? ' <span class="chip">' + c.pts + ' pts</span>' : '') + '</button>';
      }).join('') + '</div>' +
      (answered ? '<div class="why"><strong>' + (st.choices[picked].pts === bestPts ? 'Best call. ' : 'Debrief. ') + '</strong>' + esc(st.choices[picked].fb) + (st.choices[picked].pts !== bestPts ? ' <em>Best option: ' + esc(st.choices.find(function (c) { return c.pts === bestPts; }).t) + '</em>' : '') + '</div>' : '') + '</div>';
  });
  var finished = scnState.picks.length === s.steps.length;
  return '<div class="page">' + head('<a href="#scenarios">Shift scenarios</a><span>' + esc(s.setting) + '</span>', esc(s.title), esc(s.summary)) +
    '<div class="log" role="log" aria-label="Alert timeline">' + esc(s.log) + '</div>' + html +
    (finished ? '<div class="callout ' + (score / max >= .8 ? 'callout-tip' : 'callout-verify') + '"><span class="callout-label">Shift over</span><p style="margin:0">You scored <strong>' + score + ' / ' + max + '</strong>. ' + (score === max ? 'Textbook.' : 'Replay and aim for the best call at every step.') + '</p></div><div class="btn-row"><button class="btn" type="button" data-act="scn-replay">Replay</button><a class="btn quiet" href="#scenarios">All scenarios</a></div>' : '') +
    '</div>';
}

/* ----- flashcards ----- */
function cardPool() {
  return C.glossary.filter(function (g) { return cardState.filter === 'all' || g.module === cardState.filter; });
}
function buildQueue() {
  var pool = cardPool();
  var due = cardState.ahead ? pool.slice() : pool.filter(isDue);
  due.sort(function (a, b) { var ba = (S.cards[a.id] || { box: 0 }).box, bb = (S.cards[b.id] || { box: 0 }).box; return ba - bb || a.term.localeCompare(b.term); });
  cardState.queue = due.map(function (g) { return g.id; });
  cardState.revealed = false;
}
function viewCards() {
  if (!cardState.queue) buildQueue();
  var pool = cardPool(), boxes = [0, 0, 0, 0, 0, 0];
  pool.forEach(function (g) { boxes[(S.cards[g.id] || { box: 0 }).box]++; });
  var opts = '<option value="all">All modules (' + C.glossary.length + ')</option>' + C.modules.filter(function (m) { return C.glossary.some(function (g) { return g.module === m.id; }); }).map(function (m) {
    return '<option value="' + m.id + '"' + (cardState.filter === m.id ? ' selected' : '') + '>' + esc(m.title) + '</option>';
  }).join('');
  var cur = cardState.queue.length ? C.glossary.find(function (g) { return g.id === cardState.queue[0]; }) : null;
  var stage;
  if (cur) {
    var box = (S.cards[cur.id] || { box: 0 }).box;
    stage = '<div class="flash" aria-live="polite"><span class="eyebrow"><span>Box ' + box + '</span><span>' + esc(mod(cur.module).title) + '</span><span>' + cardState.queue.length + ' left</span></span><div class="term">' + esc(cur.term) + '</div>' +
      (cardState.revealed ? '<div class="def">' + esc(cur.def) + '</div>' : '<div class="def muted">Say the definition out loud, then reveal.</div>') + '</div>' +
      '<div class="btn-row">' + (cardState.revealed
        ? '<button class="btn quiet" type="button" data-act="card-again">Again <span class="mono small">1</span></button><button class="btn" type="button" data-act="card-good">Got it <span class="mono small">2</span></button>'
        : '<button class="btn" type="button" data-act="card-reveal">Reveal <span class="mono small">space</span></button>') + '</div>';
  } else {
    var nextDue = pool.map(function (g) { return (S.cards[g.id] || {}).due; }).filter(Boolean).sort()[0];
    stage = '<div class="empty"><h3 style="margin-bottom:8px">All caught up</h3><p style="margin:0 0 14px">' + (cardState.reviewed ? 'You reviewed ' + cardState.reviewed + ' cards this session. ' : '') + (nextDue ? 'Next card due ' + fmtDate(nextDue) + '.' : '') + '</p><button class="btn quiet" type="button" data-act="card-ahead">Study ahead anyway</button></div>';
  }
  return '<div class="page">' + head('<span>Flashcards</span><span>Leitner boxes 0–5</span>', 'Flashcards', 'Cards you get right move up a box and come back later (1, 3, 7, 14, then 30 days). Cards you miss go back to box 0.') +
    '<div class="field" style="max-width:320px"><label for="cards-filter">Deck</label><select id="cards-filter" data-input="cards-filter">' + opts + '</select></div>' +
    '<div class="card-stage">' + stage + '</div>' +
    '<div class="boxes" aria-label="Cards per box">' + boxes.map(function (n, i) { return '<div class="box"><b>' + n + '</b><span>Box ' + i + '</span></div>'; }).join('') + '</div></div>';
}
function answerCard(good) {
  var id = cardState.queue.shift(), c = S.cards[id] || { box: 0 };
  if (good) { c.box = Math.min(5, c.box + 1); c.due = addDays(today(), INTERVALS[c.box]); }
  else { c.box = 0; c.due = today(); cardState.queue.push(id); }
  S.cards[id] = c; cardState.reviewed++; cardState.revealed = false;
  touch(); render(true);
}

/* ----- glossary ----- */
function viewGlossary() {
  var letters = Array.from(new Set(C.glossary.map(function (g) { return /[a-z]/i.test(g.term[0]) ? g.term[0].toUpperCase() : '#'; }))).sort();
  return '<div class="page">' + head('<span>Glossary</span><span>' + C.glossary.length + ' terms</span>', 'Glossary', 'Every term used in the course. The same list powers your flashcards.') +
    '<div class="field"><label for="gloss-q">Filter terms</label><input id="gloss-q" type="text" data-input="gloss" placeholder="e.g. DMARC, MTTR, idempotency" value="' + esc(glossState.q) + '"></div>' +
    '<div class="letter-bar"><button type="button" data-act="gloss-letter" data-l="" aria-pressed="' + (glossState.letter === '') + '">All</button>' + letters.map(function (l) { return '<button type="button" data-act="gloss-letter" data-l="' + l + '" aria-pressed="' + (glossState.letter === l) + '">' + l + '</button>'; }).join('') + '</div>' +
    '<div id="gloss-list"></div></div>';
}
function glossUpdate() {
  var el = document.getElementById('gloss-list');
  if (!el) return;
  var q = glossState.q.trim().toLowerCase();
  var list = C.glossary.filter(function (g) {
    var first = /[a-z]/i.test(g.term[0]) ? g.term[0].toUpperCase() : '#';
    return (!glossState.letter || first === glossState.letter) && (!q || (g.term + ' ' + g.def).toLowerCase().indexOf(q) > -1);
  }).sort(function (a, b) { return a.term.localeCompare(b.term); });
  el.innerHTML = list.length ? '<dl style="margin:0">' + list.map(function (g) {
    return '<div class="gloss"><dt>' + esc(g.term) + '</dt><dd>' + esc(g.def) + ' <a class="small" href="#' + g.module + '">' + esc(mod(g.module).title) + '</a></dd></div>';
  }).join('') + '</dl>' : '<div class="empty">No terms match “' + esc(glossState.q) + '”.</div>';
}

/* ----- scorecard ----- */
var SC_EXAMPLE = { u1: 2, u2: 1, u3: 0, u4: 0, e1: 2, e2: 1, e3: 1, e4: 0, d1: 1, d2: 2, d3: 0, d4: 1, m1: 1, m2: 2, m3: 1, m4: 2, i1: 0, i2: 1, i3: 0, i4: 1 };
var SC_LABELS = ['No', 'Partly', 'Mostly', 'Yes, tested'];
function viewScorecard() {
  var own = Object.keys(S.sc).length > 0, ans = own ? S.sc : SC_EXAMPLE;
  var areaRows = C.scorecardAreas.map(function (a) {
    var qs = C.scorecard.filter(function (q) { return q.area === a.id; });
    var got = qs.reduce(function (s, q) { return s + (ans[q.id] || 0); }, 0), pct = Math.round(got / (qs.length * 3) * 100);
    return { a: a, pct: pct };
  });
  var overall = Math.round(areaRows.reduce(function (s, r) { return s + r.pct; }, 0) / areaRows.length);
  var level = overall >= 70 ? ['done', 'Resilient'] : overall >= 40 ? ['warn', 'Developing'] : ['bad', 'Exposed'];
  var plan = C.scorecard.filter(function (q) { return ans[q.id] !== undefined && ans[q.id] < 3; })
    .map(function (q) { return { q: q, p: q.w * (3 - ans[q.id]) }; })
    .sort(function (x, y) { return y.p - x.p; }).slice(0, 8);
  var answered = C.scorecard.filter(function (q) { return S.sc[q.id] !== undefined; }).length;

  var results = '<div class="panel"><div class="panel-head"><h3>Resilience profile</h3><span class="chip ' + level[0] + '">' + level[1] + ' · ' + overall + '%</span></div>' +
    '<div class="area-bars">' + areaRows.map(function (r) {
      return '<div class="area-bar"><span>' + esc(r.a.name) + '</span><span class="track" title="' + r.a.name + ': ' + r.pct + '%"><span class="fill" style="display:block;width:' + r.pct + '%"></span></span><span class="val">' + r.pct + '%</span></div>';
    }).join('') + '</div><p class="small muted" style="margin:0">Scores: No = 0, Partly = 1, Mostly = 2, Yes and tested = 3; each area has four questions.</p></div>';

  var planHtml = '<div class="panel"><div class="panel-head"><h3>Prioritised action plan</h3><span class="small muted">Priority = weight × gap</span></div>' +
    (plan.length ? '<ol style="margin:0;padding-left:1.25rem;display:flex;flex-direction:column;gap:10px">' + plan.map(function (x) {
      var pr = x.p >= 6 ? ['bad', 'High'] : x.p >= 3 ? ['warn', 'Medium'] : ['', 'Low'];
      return '<li><div class="chip-row" style="margin-bottom:4px"><span class="chip ' + pr[0] + '">' + pr[1] + '</span><span class="chip">' + esc(C.scorecardAreas.find(function (a) { return a.id === x.q.area; }).name) + '</span></div>' + esc(x.q.action) + '</li>';
    }).join('') + '</ol>' : '<p class="muted" style="margin:0">No gaps among answered questions.</p>') + '</div>';

  var qs = C.scorecardAreas.map(function (a) {
    return '<div class="panel"><h3>' + esc(a.name) + '</h3><div>' + C.scorecard.filter(function (q) { return q.area === a.id; }).map(function (q) {
      return '<div class="sc-q"><span>' + esc(q.q) + '</span><span class="seg" role="group" aria-label="' + esc(q.q) + '">' + SC_LABELS.map(function (lab, v) {
        return '<button type="button" data-act="sc-answer" data-q="' + q.id + '" data-v="' + v + '" aria-pressed="' + (own && S.sc[q.id] === v) + '">' + lab + '</button>';
      }).join('') + '</span></div>';
    }).join('') + '</div></div>';
  }).join('');

  return '<div class="page wide">' + head('<span>Tool</span><span>20 questions · 5 areas</span>', 'Resilience scorecard', 'Practise the kind of assessment J2 uses to open client conversations: score five areas, then read the action plan it produces.') +
    H.note('verify', '<p>These questions were written for this course and follow the five public areas (users, email, data, machines, internet). They are not J2\'s actual questionnaire. Ask to see the real one.</p>') +
    (own ? '<div class="btn-row"><span class="chip accent">' + answered + ' / 20 answered</span><button class="btn quiet" type="button" data-act="sc-clear">Clear answers</button></div>'
      : '<div class="callout callout-tip"><span class="callout-label">Example company</span><p style="margin:0">Showing a sample 150-person firm. Answer any question below to start your own assessment.</p></div>') +
    '<div class="grid-2">' + results + planHtml + '</div>' + qs + '</div>';
}

/* ----- automation scorer ----- */
var SCORER_EXAMPLE = [
  { id: 'x1', name: 'Triage user-reported phishing', runs: 1200, mins: 9, share: 70, extra: 0, effort: 4, risk: 3, conf: 4, example: true },
  { id: 'x2', name: 'Enrich risky sign-in alerts', runs: 900, mins: 7, share: 80, extra: 0, effort: 2, risk: 1, conf: 5, example: true },
  { id: 'x3', name: 'Assemble monthly client reports', runs: 180, mins: 90, share: 60, extra: 0, effort: 3, risk: 2, conf: 4, example: true },
  { id: 'x4', name: 'Licence and seat reconciliation', runs: 1, mins: 960, share: 80, extra: 25000, effort: 3, risk: 2, conf: 4, example: true },
  { id: 'x5', name: 'Write shift handover notes', runs: 90, mins: 20, share: 60, extra: 0, effort: 2, risk: 1, conf: 4, example: true },
  { id: 'x6', name: 'Follow up failed backup jobs', runs: 150, mins: 6, share: 90, extra: 0, effort: 1, risk: 1, conf: 5, example: true }
];
function scorerRows() { return S.scorer || SCORER_EXAMPLE; }
function calc(r) {
  var hours = r.runs * r.mins * (r.share / 100) / 60;
  var value = hours * (+S.profile.rate || 0) + (+r.extra || 0);
  var pri = value / 1000 * r.conf / (r.effort * r.risk);
  return { hours: hours, value: value, pri: pri };
}
function viewScorer() {
  var rows = scorerRows().map(function (r) { return { r: r, c: calc(r) }; }).sort(function (a, b) { return b.c.pri - a.c.pri; });
  var isEx = !S.scorer;
  var tot = rows.reduce(function (s, x) { return { h: s.h + x.c.hours, v: s.v + x.c.value }; }, { h: 0, v: 0 });
  var e = scorerEdit ? scorerRows().find(function (r) { return r.id === scorerEdit; }) : null;
  e = e || { name: '', runs: '', mins: '', share: 70, extra: 0, effort: 3, risk: 2, conf: 3 };
  function num(id, label, val, hint, attrs) { return '<div class="field"><label for="' + id + '">' + label + '</label><input id="' + id + '" type="number" ' + (attrs || 'min="0"') + ' value="' + esc(val) + '">' + (hint ? '<span class="hint">' + hint + '</span>' : '') + '</div>'; }
  var form = '<div class="panel"><h3>' + (scorerEdit ? 'Edit process' : 'Add a process from your friction log') + '</h3>' +
    '<div class="field"><label for="sc-name">Process</label><input id="sc-name" type="text" value="' + esc(e.name) + '" placeholder="e.g. Chase clients for missing escalation contacts"></div>' +
    '<div class="form-grid">' + num('sc-runs', 'Runs per month', e.runs) + num('sc-mins', 'Minutes per run', e.mins) + num('sc-share', 'Automatable share (%)', e.share, 'How much of each run automation removes', 'min="0" max="100"') +
    num('sc-extra', 'Other value / month (' + esc(S.profile.currency) + ')', e.extra, 'Revenue recovered, errors avoided') + num('sc-effort', 'Effort (1–5)', e.effort, '1 = an afternoon, 5 = a quarter', 'min="1" max="5"') + num('sc-risk', 'Risk if wrong (1–5)', e.risk, '1 = harmless, 5 = client impact', 'min="1" max="5"') +
    num('sc-conf', 'Confidence (1–5)', e.conf, 'How sure are you of these numbers?', 'min="1" max="5"') + '</div>' +
    '<div class="btn-row"><button class="btn" type="button" data-act="scorer-save">' + (scorerEdit ? 'Save changes' : 'Add process') + '</button>' + (scorerEdit ? '<button class="btn quiet" type="button" data-act="scorer-cancel">Cancel</button>' : '') + '</div></div>';

  var table = H.table(['#', 'Process', 'Hours saved / mo', 'Value / mo', 'Effort', 'Risk', 'Priority', ''], rows.map(function (x, i) {
    return [String(i + 1), esc(x.r.name) + (x.r.example ? ' <span class="chip">example</span>' : ''), '<span class="num">' + x.c.hours.toFixed(1) + '</span>', money(x.c.value), x.r.effort, x.r.risk, '<strong>' + x.c.pri.toFixed(1) + '</strong>',
      '<span class="btn-row" style="flex-wrap:nowrap"><button class="btn quiet" type="button" data-act="scorer-edit" data-id="' + x.r.id + '">Edit</button><button class="btn quiet" type="button" data-act="scorer-del" data-id="' + x.r.id + '">Remove</button></span>'];
  }));

  return '<div class="page wide">' + head('<span>Tool</span><span>Friction log → ranked backlog</span>', 'Automation scorer', 'Rank candidate automations by value, confidence, effort and risk. Hours saved = runs × minutes × automatable share ÷ 60. Priority = value (thousands) × confidence ÷ (effort × risk).') +
    (isEx ? '<div class="callout callout-tip"><span class="callout-label">Example rows</span><p style="margin:0 0 10px">These six processes are illustrative guesses for an MSSP, not J2 data. Replace them with your own friction log.</p><button class="btn quiet" type="button" data-act="scorer-clear">Clear examples</button></div>' : '') +
    '<div class="stats" style="grid-template-columns:repeat(3,minmax(0,1fr))">' + stat('Processes', rows.length, 'In your backlog') + stat('Hours / month', Math.round(tot.h), 'If all were automated') + stat('Value / month', money(tot.v), 'At ' + money(S.profile.rate) + ' per hour') + '</div>' +
    '<div class="field" style="max-width:260px"><label for="scorer-rate">Loaded hourly cost (' + esc(S.profile.currency) + ')</label><input id="scorer-rate" type="number" min="0" value="' + esc(S.profile.rate) + '" data-input="rate"><span class="hint">Salary plus overheads per hour; ask finance</span></div>' +
    table + form + '</div>';
}

/* ----- plan & questions ----- */
function viewPlan() {
  return '<div class="page">' + head('<span>Get ready</span><span>Before day one → day 90</span>', '30-60-90 plan', 'A plan to walk in with. Share it with your manager in the first week and adjust it together.') +
    C.plan.map(function (ph) {
      var done = ph.items.filter(function (it, i) { return S.plan[ph.phase + '-' + i]; }).length;
      return '<section class="panel"><div class="panel-head"><h3>' + esc(ph.title) + '</h3><span class="chip ' + (done === ph.items.length ? 'done' : '') + '">' + done + ' / ' + ph.items.length + '</span></div>' + bar(Math.round(done / ph.items.length * 100)) +
        '<div class="checklist">' + ph.items.map(function (it, i) {
          var k = ph.phase + '-' + i, on = !!S.plan[k];
          return '<label class="check' + (on ? ' is-done' : '') + '" for="plan-' + k + '"><input type="checkbox" id="plan-' + k + '" data-input="plan" data-k="' + k + '"' + (on ? ' checked' : '') + '><span><strong>' + esc(it[0]) + '</strong><span class="why-line">' + esc(it[1]) + '</span></span></label>';
        }).join('') + '</div></section>';
    }).join('') + '</div>';
}
function viewQuestions() {
  return '<div class="page">' + head('<span>Get ready</span><span>' + C.questions.reduce(function (s, g) { return s + g.items.length; }, 0) + ' questions</span>', 'Day-one questions', 'Good questions show you have done the homework. Tick each one once you have an answer, and write the answer in your notes.') +
    '<div class="btn-row"><button class="btn quiet" type="button" data-act="copy-questions">Copy all as text</button></div>' +
    C.questions.map(function (g, gi) {
      return '<section class="panel"><h3>' + esc(g.who) + '</h3><div class="checklist">' + g.items.map(function (q, i) {
        var k = gi + '-' + i, on = !!S.asked[k];
        return '<label class="check' + (on ? ' is-done' : '') + '" for="ask-' + k + '"><input type="checkbox" id="ask-' + k + '" data-input="ask" data-k="' + k + '"' + (on ? ' checked' : '') + '><span><strong>' + esc(q) + '</strong></span></label>';
      }).join('') + '</div></section>';
    }).join('') + '<textarea id="questions-copy" class="sr-only" aria-hidden="true" tabindex="-1" readonly></textarea></div>';
}

/* ----- settings ----- */
function viewSettings() {
  var p = S.profile;
  return '<div class="page">' + head('<span>Settings</span>', 'Settings &amp; backup', 'Everything is stored in this browser only. Copy a backup before clearing site data or switching devices.') +
    '<div class="panel"><h3>Profile</h3><div class="form-grid">' +
    '<div class="field"><label for="set-name">Name</label><input id="set-name" type="text" value="' + esc(p.name) + '" data-change="profile" data-f="name"></div>' +
    '<div class="field"><label for="set-start">Start date at J2</label><input id="set-start" type="date" value="' + esc(p.startDate) + '" data-change="profile" data-f="startDate"></div>' +
    '<div class="field"><label for="set-cur">Currency symbol</label><input id="set-cur" type="text" maxlength="4" value="' + esc(p.currency) + '" data-change="profile" data-f="currency"><span class="hint">R for ZAR, £ for GBP</span></div>' +
    '<div class="field"><label for="set-rate">Loaded hourly cost</label><input id="set-rate" type="number" min="0" value="' + esc(p.rate) + '" data-change="profile" data-f="rate"><span class="hint">Used by the Automation scorer</span></div>' +
    '</div></div>' +
    '<div class="panel"><h3>Backup</h3><p class="small muted" style="margin:0">Copy your progress as text, keep it somewhere safe, and paste it back here to restore.</p>' +
    '<div class="btn-row"><button class="btn quiet" type="button" data-act="export">Copy progress</button></div>' +
    '<div class="field"><label for="import-box">Restore from backup</label><textarea id="import-box" placeholder="Paste backup text here"></textarea></div>' +
    '<div class="btn-row"><button class="btn quiet" type="button" data-act="import">Restore</button></div></div>' +
    '<div class="panel"><h3>Reset</h3><p class="small muted" style="margin:0">Deletes all progress, notes, answers and cards in this browser.</p><div class="btn-row">' +
    (resetArmed ? '<button class="btn danger" type="button" data-act="reset-confirm">Yes, delete everything</button><button class="btn quiet" type="button" data-act="reset-cancel">Cancel</button>' : '<button class="btn quiet" type="button" data-act="reset-arm">Reset progress…</button>') + '</div></div></div>';
}

/* ----- search ----- */
function viewSearch() {
  var q = searchQ.trim().toLowerCase();
  if (!q) return '<div class="page">' + head('<span>Search</span>', 'Search', 'Type in the search box to find lessons, labs and terms.') + '</div>';
  var ls = LESSONS.filter(function (l) { return (l.title + ' ' + l.summary + ' ' + strip(l.body)).toLowerCase().indexOf(q) > -1; });
  var gs = C.glossary.filter(function (g) { return (g.term + ' ' + g.def).toLowerCase().indexOf(q) > -1; });
  var lb = C.labs.filter(function (l) { return (l.title + ' ' + l.summary + ' ' + strip(l.body)).toLowerCase().indexOf(q) > -1; });
  function snip(text) {
    var t = strip(text), i = t.toLowerCase().indexOf(q);
    if (i < 0) return esc(t.slice(0, 140)) + '…';
    var s = Math.max(0, i - 60);
    return (s ? '…' : '') + esc(t.slice(s, i)) + '<mark>' + esc(t.slice(i, i + q.length)) + '</mark>' + esc(t.slice(i + q.length, i + q.length + 80)) + '…';
  }
  var total = ls.length + gs.length + lb.length;
  return '<div class="page">' + head('<span>Search</span><span>' + total + ' results</span>', 'Results for “' + esc(searchQ) + '”', '') +
    (ls.length ? '<section><h3>Lessons</h3>' + ls.map(function (l) { return '<a class="result-row" href="#' + l.key + '"><span class="mono small case-id">' + l.caseId + '</span><strong>' + esc(l.title) + '</strong><span class="small muted">' + snip(l.summary + ' ' + l.body) + '</span></a>'; }).join('') + '</section>' : '') +
    (lb.length ? '<section><h3>Labs</h3>' + lb.map(function (l) { return '<a class="result-row" href="#lab.' + l.id + '"><strong>' + esc(l.title) + '</strong><span class="small muted">' + esc(l.summary) + '</span></a>'; }).join('') + '</section>' : '') +
    (gs.length ? '<section><h3>Glossary</h3>' + gs.map(function (g) { return '<div class="result-row"><strong>' + esc(g.term) + '</strong><span class="small muted">' + esc(g.def) + '</span></div>'; }).join('') + '</section>' : '') +
    (total ? '' : '<div class="empty">Nothing found. Try a shorter or different term.</div>') + '</div>';
}

/* ---------------- router ---------------- */
function route() {
  var h = decodeURIComponent((location.hash || '').replace(/^#/, '')) || 'home', m;
  if (h === 'home') return { nav: 'home', html: viewHome };
  if (h === 'modules') return { nav: 'modules', html: viewModules };
  if ((m = h.match(/^(m\d+)$/)) && mod(m[1])) return { nav: 'modules', html: function () { return viewModule(mod(m[1])); } };
  if ((m = h.match(/^(m\d+)\.quiz$/)) && mod(m[1]) && mod(m[1]).quiz.length) return { nav: 'modules', html: function () { return viewQuiz(mod(m[1])); } };
  if ((m = h.match(/^(m\d+\.l\d+)$/))) { var l = LESSONS.find(function (x) { return x.key === m[1]; }); if (l) return { nav: 'modules', html: function () { return viewLesson(l); } }; }
  if (h === 'labs') return { nav: 'labs', html: viewLabs };
  if ((m = h.match(/^lab\.(\w+)$/)) && lab(m[1])) return { nav: 'labs', html: function () { return viewLab(lab(m[1])); }, after: function () { iocUpdate(); reconUpdate(); } };
  if (h === 'scenarios') return { nav: 'scenarios', html: viewScenarios };
  if ((m = h.match(/^scn\.(\w+)$/)) && scn(m[1])) return { nav: 'scenarios', html: function () { return viewScenario(scn(m[1])); } };
  if (h === 'cards') return { nav: 'cards', html: function () { if (lastHash !== location.hash) buildQueue(); return viewCards(); } };
  if (h === 'glossary') return { nav: 'glossary', html: viewGlossary, after: glossUpdate };
  if (h === 'scorecard') return { nav: 'scorecard', html: viewScorecard };
  if (h === 'scorer') return { nav: 'scorer', html: viewScorer };
  if (h === 'plan') return { nav: 'plan', html: viewPlan };
  if (h === 'questions') return { nav: 'questions', html: viewQuestions };
  if (h === 'settings') return { nav: 'settings', html: viewSettings };
  if (h === 'search') return { nav: '', html: viewSearch };
  return { nav: 'home', html: viewHome };
}

var main = document.getElementById('main');
var lastHash = null;
function render(keepScroll) {
  var y = window.scrollY, r = route();
  main.innerHTML = r.html();
  if (r.after) r.after();
  document.querySelectorAll('[data-nav]').forEach(function (a) {
    if (a.getAttribute('data-nav') === r.nav) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  var due = dueCount();
  document.getElementById('nav-due').textContent = due ? due : '';
  if (keepScroll) window.scrollTo(0, y);
  else if (lastHash !== location.hash) { window.scrollTo(0, 0); try { main.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
  lastHash = location.hash;
  var sb = document.getElementById('sidebar');
  if (sb.classList.contains('open') && !keepScroll) { sb.classList.remove('open'); document.getElementById('menu-btn').setAttribute('aria-expanded', 'false'); }
}
function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
window.addEventListener('hashchange', function () { render(); });

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
    if (fallbackEl) { fallbackEl.classList.remove('sr-only'); fallbackEl.value = text; fallbackEl.focus(); fallbackEl.select(); }
    toast('Select the text and copy it manually');
  }
  try {
    navigator.clipboard.writeText(text).then(function () { toast('Copied'); }, fallback);
  } catch (e) { fallback(); }
}
function val(id) { var el = document.getElementById(id); return el ? el.value : ''; }
function clamp(n, lo, hi) { n = +n; if (isNaN(n)) n = lo; return Math.min(hi, Math.max(lo, n)); }

var actions = {
  'toggle-nav': function () {
    var sb = document.getElementById('sidebar'), open = !sb.classList.contains('open');
    sb.classList.toggle('open', open);
    document.getElementById('menu-btn').setAttribute('aria-expanded', String(open));
  },
  'save-start': function () {
    var v = val('cd-date');
    if (!validDate(v)) { toast('Pick a date first'); return; }
    S.profile.startDate = v; save(); render(true); toast('Start date saved');
  },
  'complete': function (t) { S.done[t.dataset.key] = Date.now(); touch(); toast('Lesson complete'); go(t.dataset.next); },
  'undone': function (t) { delete S.done[t.dataset.key]; save(); render(true); },
  'quiz-check': function (t) {
    var m = mod(t.dataset.mid);
    if (Object.keys(quizState.answers).length < m.quiz.length) { toast('Answer every question first'); return; }
    var score = m.quiz.reduce(function (s, q, i) { return s + (quizState.answers[i] === q.answer ? 1 : 0); }, 0);
    var prev = S.quiz[m.id];
    S.quiz[m.id] = { best: Math.max(score, prev ? prev.best : 0), total: m.quiz.length, last: score };
    quizState.checked = true; touch(); render(); window.scrollTo(0, 0);
  },
  'quiz-retake': function () { quizState = { mid: null, answers: {}, checked: false }; render(); },
  'lab-done': function (t) { S.labs[t.dataset.id] = Date.now(); touch(); render(true); toast('Lab complete'); },
  'lab-undone': function (t) { delete S.labs[t.dataset.id]; save(); render(true); },
  'ioc-sample': function () { var el = document.getElementById('ioc-input'); el.value = IOC_SAMPLE; iocUpdate(); },
  'copy': function (t) { var el = document.getElementById(t.dataset.target); copyText(el.value, el); },
  'scn-pick': function (t) {
    var i = +t.dataset.step;
    if (scnState.picks.length !== i) return;
    scnState.picks.push(+t.dataset.choice);
    var s = scn(scnState.id);
    if (scnState.picks.length === s.steps.length) {
      var score = scnState.picks.reduce(function (a, p, k) { return a + s.steps[k].choices[p].pts; }, 0);
      S.scn[s.id] = Math.max(score, S.scn[s.id] || 0); touch();
    }
    render(true);
  },
  'scn-replay': function () { scnState.picks = []; render(); },
  'card-reveal': function () { cardState.revealed = true; render(true); },
  'card-good': function () { answerCard(true); },
  'card-again': function () { answerCard(false); },
  'card-ahead': function () { cardState.ahead = true; buildQueue(); render(true); },
  'cards-module': function (t, e) { e.preventDefault(); cardState.filter = t.dataset.mid; cardState.ahead = false; buildQueue(); go('#cards'); },
  'gloss-letter': function (t) {
    glossState.letter = t.dataset.l;
    document.querySelectorAll('[data-act="gloss-letter"]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === t)); });
    glossUpdate();
  },
  'sc-answer': function (t) { S.sc[t.dataset.q] = +t.dataset.v; touch(); render(true); },
  'sc-clear': function () { S.sc = {}; save(); render(true); },
  'scorer-save': function () {
    var name = val('sc-name').trim();
    if (!name) { toast('Give the process a name'); document.getElementById('sc-name').focus(); return; }
    var row = {
      id: scorerEdit || 'p' + Date.now().toString(36), name: name,
      runs: clamp(val('sc-runs'), 0, 1e6), mins: clamp(val('sc-mins'), 0, 1e5), share: clamp(val('sc-share'), 0, 100), extra: clamp(val('sc-extra'), 0, 1e9),
      effort: clamp(val('sc-effort'), 1, 5), risk: clamp(val('sc-risk'), 1, 5), conf: clamp(val('sc-conf'), 1, 5)
    };
    var rows = scorerRows().slice();
    if (!S.scorer) rows = rows.filter(function (r) { return r.id === scorerEdit; }).map(function (r) { return Object.assign({}, r); });
    var i = rows.findIndex(function (r) { return r.id === row.id; });
    if (i > -1) rows[i] = row; else rows.push(row);
    S.scorer = rows.filter(function (r) { return !r.example || r.id === row.id; });
    scorerEdit = null; touch(); render(true); toast('Saved');
  },
  'scorer-edit': function (t) { scorerEdit = t.dataset.id; render(true); var f = document.getElementById('sc-name'); if (f) { f.focus(); f.scrollIntoView({ block: 'center' }); } },
  'scorer-cancel': function () { scorerEdit = null; render(true); },
  'scorer-del': function (t) { S.scorer = scorerRows().filter(function (r) { return r.id !== t.dataset.id; }); save(); render(true); },
  'scorer-clear': function () { S.scorer = []; save(); render(true); },
  'copy-questions': function () {
    var txt = C.questions.map(function (g) { return g.who + '\n' + g.items.map(function (q) { return '- ' + q; }).join('\n'); }).join('\n\n');
    copyText(txt, document.getElementById('questions-copy'));
  },
  'export': function () {
    var box = document.getElementById('import-box');
    copyText(JSON.stringify(S), box);
  },
  'import': function () {
    try {
      var o = JSON.parse(val('import-box'));
      if (!o || typeof o !== 'object' || !o.profile) throw new Error('bad');
      S = Object.assign(defaults(), o); S.profile = Object.assign(defaults().profile, o.profile);
      save(); cardState.queue = null; render(); toast('Progress restored');
    } catch (e) { toast('That text is not a valid backup. Paste the full text you copied.'); }
  },
  'reset-arm': function () { resetArmed = true; render(true); },
  'reset-cancel': function () { resetArmed = false; render(true); },
  'reset-confirm': function () { S = defaults(); save(); resetArmed = false; cardState.queue = null; quizState = { mid: null, answers: {}, checked: false }; go('#home'); toast('Progress reset'); }
};

var noteTimer = null;
var inputs = {
  note: function (t) { S.notes[t.dataset.key] = t.value; clearTimeout(noteTimer); noteTimer = setTimeout(save, 300); },
  quiz: function (t) { quizState.answers[+t.dataset.q] = +t.value; var s = main.querySelector('.btn-row .small'); if (s) s.textContent = Object.keys(quizState.answers).length + ' of ' + mod(quizState.mid).quiz.length + ' answered'; },
  ioc: function () { iocUpdate(); },
  recon: function () { reconUpdate(); },
  gloss: function (t) { glossState.q = t.value; glossUpdate(); },
  rate: function (t) { S.profile.rate = clamp(t.value, 0, 1e7); save(); },
  'cards-filter': function (t) { cardState.filter = t.value; cardState.ahead = false; buildQueue(); render(true); },
  plan: function (t) { if (t.checked) S.plan[t.dataset.k] = true; else delete S.plan[t.dataset.k]; touch(); render(true); },
  ask: function (t) { if (t.checked) S.asked[t.dataset.k] = true; else delete S.asked[t.dataset.k]; save(); t.closest('.check').classList.toggle('is-done', t.checked); }
};

document.addEventListener('click', function (e) {
  var t = e.target.closest('[data-act]');
  if (t && actions[t.dataset.act]) actions[t.dataset.act](t, e);
});
document.addEventListener('input', function (e) {
  var t = e.target;
  if (t.dataset && t.dataset.input && inputs[t.dataset.input] && t.type !== 'checkbox' && t.type !== 'radio' && t.tagName !== 'SELECT') inputs[t.dataset.input](t);
});
document.addEventListener('change', function (e) {
  var t = e.target;
  if (t.dataset && t.dataset.input && inputs[t.dataset.input] && (t.type === 'checkbox' || t.type === 'radio' || t.tagName === 'SELECT')) inputs[t.dataset.input](t);
  if (t.id === 'scorer-rate') render(true);
  if (t.dataset && t.dataset.change === 'profile') {
    var f = t.dataset.f;
    S.profile[f] = f === 'rate' ? clamp(t.value, 0, 1e7) : t.value;
    save(); toast('Saved');
  }
});
document.addEventListener('keydown', function (e) {
  if (!/^#cards/.test(location.hash) || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
  if (!cardState.queue || !cardState.queue.length) return;
  if (!cardState.revealed && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); actions['card-reveal'](); }
  else if (cardState.revealed && e.key === '1') answerCard(false);
  else if (cardState.revealed && e.key === '2') answerCard(true);
});
document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault();
  searchQ = val('search-input');
  go('#search');
});

render();
})();
