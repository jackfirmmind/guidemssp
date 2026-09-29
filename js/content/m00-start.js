(function (H) {
COURSE.modules.push({
  id: 'm0', code: 'ST', title: 'Start here', tag: 'Orientation',
  summary: 'What your job title actually means at an MSSP, and how to use this manual before day one.',
  lessons: [
    {
      id: 'l1', title: 'Your role, decoded', mins: 12,
      summary: 'An AI Automation & Business Systems Engineer at a security provider has two customers: the SOC and the business that sells it.',
      body: `
<p>Your title has three parts, and each one tells you where you will spend time.</p>
<dl>
  <dt>AI Automation</dt><dd>Using LLMs, classifiers and scripted workflows to cut the manual effort in security operations: triaging alerts, enriching incidents, drafting reports, answering "is this phishing?" at scale.</dd>
  <dt>Business Systems</dt><dd>The back office that turns security work into revenue: CRM, PSA/ticketing, billing, contracts, reporting, HR and finance tools, and the integrations between them.</dd>
  <dt>Engineer</dt><dd>You are expected to ship things that run unattended at 03:00 on a Sunday. That means version control, testing, monitoring, secrets handling and documentation, not just clever prototypes.</dd>
</dl>
<h3>Two customers, one job</h3>
<p>At a Managed Security Services Provider (MSSP) the product <em>is</em> the operation. Every minute an analyst spends copying an IP address into a lookup site, or a finance person spends matching licence counts to invoices, is margin leaking out of the business. Your work is to find those minutes, remove them safely, and prove it.</p>
${H.table(['Customer', 'What they need from you', 'What success looks like'], [
  ['SOC analysts &amp; leads', 'Less noise, faster enrichment, consistent playbooks, better handovers', 'Lower MTTR, fewer alerts per analyst, SLAs met without heroics'],
  ['Sales, finance, ops, leadership', 'Clean customer data, automated onboarding and billing, reports that write themselves', 'No revenue leakage, faster onboarding, one source of truth'],
  ['J2\'s clients (indirectly)', 'Faster, more consistent protection and clearer reporting', 'Better renewal rates and upsell of more services']
])}
<h3>Why security changes the rules</h3>
<p>Automation in a normal company fails quietly. Automation in a security company can fail loudly: a workflow that closes a real alert as "false positive", a script that leaks one client's data into another client's report, or an AI assistant that obeys instructions hidden inside a phishing email. You are building tooling inside a business whose brand is trust. Safe-by-default is part of the job description.</p>
${H.note('j2', '<p>J2 sells <strong>cyber resilience</strong>: noticing a breach quickly, even off-hours, and responding well. Automation is how a 24/7 SOC keeps that promise without growing headcount in step with every new customer.</p>')}
`,
      takeaways: [
        'You serve two internal customers: the SOC (security delivery) and the business (sales, finance, ops).',
        'At an MSSP, operational efficiency is the gross margin. Automation is a revenue lever, not a nice-to-have.',
        'In security, a wrong automation can do harm. Design for human review, least privilege and auditability.'
      ],
      practice: [
        'Write a one-paragraph answer to "What will you do in your first month?" and keep it. Rewrite it when you finish this course.',
        'List three manual tasks you imagine SOC analysts do every shift. You will test these guesses in week one.'
      ],
      links: [['MITRE: 11 Strategies of a World-Class SOC (free book)', 'https://www.mitre.org/news-insights/publication/11-strategies-world-class-cybersecurity-operations-center']]
    },
    {
      id: 'l2', title: 'How to use this manual', mins: 6,
      summary: 'A self-paced plan: lessons, quizzes, flashcards, labs and scenarios, paced to your start date.',
      body: `
<p>This is an autodidact course. There is no instructor, so the app does the scheduling for you.</p>
${H.flow(['Read a lesson', 'Do the practice task', 'Mark complete', 'Take the module quiz', 'Review flashcards daily'])}
<h3>What each part is for</h3>
<ul>
  <li><strong>Curriculum</strong>: eleven modules, from company knowledge to your first 90 days. Each lesson has a case ID (for example <code>J2-SOC-03</code>) so you can reference it in your notes.</li>
  <li><strong>Labs</strong>: hands-on work: read an email header, extract indicators of compromise, write KQL, design a phishing triage workflow, reconcile billing.</li>
  <li><strong>Shift scenarios</strong>: short decision drills set in a 24/7 SOC and a back-office incident. They train judgement, not recall.</li>
  <li><strong>Flashcards</strong>: every glossary term, scheduled with a Leitner box system. Five minutes a day beats an hour on Sunday.</li>
  <li><strong>Tools</strong>: a practice resilience scorecard and an automation opportunity scorer you can keep using after you start.</li>
  <li><strong>30-60-90 plan and day-one questions</strong>: a checklist to walk in with.</li>
</ul>
<h3>Set your start date</h3>
<p>Open <a href="#settings">Settings</a> and enter your start date. The dashboard then counts down and tells you how many minutes a day you need to finish.</p>
${H.note('verify', '<p>This manual was written from public information about J2 and general industry knowledge. Anything specific to J2\'s internal tools, processes or numbers is flagged like this. Treat it as a hypothesis to confirm, not a fact to repeat in a meeting.</p>')}
${H.note('tip', '<p>Progress is saved in this browser only. Use <a href="#settings">Settings → Backup</a> to copy your progress as text if you switch devices.</p>')}
`,
      takeaways: [
        'Lesson → practice → quiz → flashcards is the loop.',
        'Set a start date so the dashboard can pace you.',
        'Orange "Verify on day one" boxes mark assumptions about J2 internals.'
      ],
      practice: ['Set your start date in Settings, then come back to the dashboard.'],
      links: []
    }
  ],
  quiz: []
});
})(window.H);
