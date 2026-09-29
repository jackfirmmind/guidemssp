(function (H) {
COURSE.modules.push({
  id: 'm10', code: 'D90', title: 'Your first 90 days', tag: 'Game plan',
  summary: 'Who to meet, how to find and rank automation opportunities, what to ship first, and how to prove value.',
  lessons: [
    {
      id: 'l1', title: 'Week one: listen, map, get access', mins: 12,
      summary: 'Stakeholders, questions, and the access you need to request early.',
      body: `
<h3>Stakeholder map</h3>
${H.table(['Who', 'Why they matter', 'Ask them'], [
  ['Your manager / CTO', 'Sets priorities and defines success', '"What would make you say this hire was a great decision at six months?"'],
  ['SOC manager and shift leads', 'Owners of your biggest user group', '"Which task would you delete from your analysts\' day if you could?"'],
  ['Tier 1 and 2 analysts', 'Know the real friction', '"Show me the last alert you handled, step by step."'],
  ['Detection / platform engineers', 'Own the SIEM and SOAR you will integrate with', '"What automation already exists, and what broke last?"'],
  ['Finance / billing', 'Owners of reconciliation and invoicing pain', '"How long does month-end billing take, and where are errors found?"'],
  ['Sales / account managers', 'Use scorecards, proposals and reports', '"What do clients ask for that we struggle to provide?"'],
  ['Internal IT / security', 'Grant access and approve tools', '"What is the process to approve a new integration or AI service?"'],
  ['Compliance / DPO / legal', 'Approve data flows', '"What rules apply to sending client data to external services?"']
])}
<h3>Access to request on day one</h3>
<ul>
  <li>Read access to the SIEM/XDR (a lab or internal workspace first), PSA, CRM and documentation.</li>
  <li>A lab or test Microsoft 365 tenant for development.</li>
  <li>Source control, a secrets vault, and the approved automation platform (iPaaS or cloud subscription).</li>
  <li>The SOC chat channels and incident review meetings, as an observer.</li>
</ul>
${H.note('tip', '<p>Keep a running "friction log": every time someone sighs, copies and pastes, or says "we just do it manually", write it down with who, what and how often. By day 30 it is your backlog.</p>')}
`,
      takeaways: ['Meet SOC, finance, sales, IT, compliance, not just engineering.', 'Request read access and a lab tenant early.', 'Keep a friction log from day one.'],
      practice: ['Open the Day-one questions page and tick the questions you will ask each stakeholder.'],
      links: []
    },
    {
      id: 'l2', title: 'Finding and ranking opportunities', mins: 14,
      summary: 'Process inventory, time-and-motion, and a scoring model to decide what to build first.',
      body: `
<h3>Capture each candidate process</h3>
${H.table(['Field', 'Example'], [
  ['Process', 'Triage user-reported phishing'],
  ['Owner', 'SOC Tier 1'],
  ['Trigger &amp; frequency', 'Each user report; ~1,200 per month (example)'],
  ['Time per run', '9 minutes'],
  ['Error / rework rate', '8% re-opened'],
  ['Systems touched', 'Email security console, PSA, M365'],
  ['Data sensitivity', 'Email content (personal data)'],
  ['Risk if automated wrongly', 'Missed phish or false quarantine']
])}
<h3>A simple scoring model</h3>
${H.code(`
hours_saved/month = runs/month x minutes/run x automatable_share / 60
value/month       = hours_saved x loaded_hourly_cost  (+ error reduction)
priority          = value x confidence / (effort x risk)
`, 'model')}
<p>The <a href="#scorer">Automation scorer</a> in this app implements this model. Use it to rank your friction log and to explain your choices to leadership.</p>
<h3>Look beyond hours saved</h3>
<ul>
  <li><strong>SLA risk</strong>: a process that is slow at 02:00 might breach contracts.</li>
  <li><strong>Error cost</strong>: billing errors and wrong-client reports cost more than the time they take.</li>
  <li><strong>Analyst experience</strong>: removing the most hated task buys goodwill for everything else.</li>
  <li><strong>Strategic value</strong>: a clean customer ID or data model makes future automations cheaper.</li>
</ul>
`,
      takeaways: ['Inventory processes with frequency, time, error rate and risk.', 'Priority = value × confidence ÷ (effort × risk).', 'Also weigh SLA risk, error cost, goodwill and foundations.'],
      practice: ['Add three imagined processes to the Automation scorer and compare the ranking to your intuition.'],
      links: []
    },
    {
      id: 'l3', title: 'Quick wins vs foundations', mins: 12,
      summary: 'A sample backlog, and how to balance visible wins with platform work.',
      body: `
${H.table(['Candidate', 'Type', 'Why'], [
  ['Alert enrichment pack for the top 5 alert types', 'Quick win', 'Saves minutes on every alert; low risk'],
  ['AI shift-handover summary', 'Quick win', 'Visible to every analyst daily; human-reviewed by design'],
  ['Failed backup job → ticket automation', 'Quick win', 'Simple, removes a silent risk'],
  ['DMARC / MFA posture checks across clients', 'Quick win', 'Feeds scorecard and reports with real evidence'],
  ['Licence and seat reconciliation', 'Quick win → foundation', 'Finds revenue leakage; forces the customer ID mapping'],
  ['Shared customer ID across systems', 'Foundation', 'Makes every integration and report simpler'],
  ['Automation platform standards (git, vault, logging, templates)', 'Foundation', 'Stops sprawl before it starts'],
  ['Phishing triage copilot', 'Flagship', 'High volume, high value; needs evaluation and guardrails'],
  ['Automated monthly client reports', 'Flagship', 'Big time saving; supports renewals']
])}
<h3>A healthy mix</h3>
<p>Aim for roughly one quick win every two weeks in the first 90 days, while laying one foundation and scoping one flagship. Quick wins earn trust; foundations make you fast later; the flagship is your six-month story.</p>
${H.note('verify', '<p>Some of these may already exist at J2. Always ask "what have you tried before?" before proposing. Rebuilding something a team already relies on loses goodwill fast.</p>')}
`,
      takeaways: ['Balance quick wins, foundations and one flagship.', 'One visible win every two weeks early on.', 'Ask what exists before proposing anything.'],
      practice: ['Pick your likely first three projects and write one sentence each on the value metric you would report.'],
      links: []
    },
    {
      id: 'l4', title: 'Proving and communicating value', mins: 10,
      summary: 'ROI, trust with analysts and change management.',
      body: `
<h3>Report value in the business\'s language</h3>
${H.table(['Instead of…', 'Say…'], [
  ['"I built a Logic App with 14 steps."', '"Phishing triage now takes 2 minutes instead of 9. That is about 140 analyst hours a month back to the SOC."'],
  ['"The reconciliation script works."', '"We found 62 under-billed seats at one client and 45 over-billed at another; both are now corrected."'],
  ['"The LLM is 94% accurate."', '"In shadow mode it agreed with analysts on 94% of emails and missed no confirmed phish."']
])}
<h3>Earn the SOC\'s trust</h3>
<ul>
  <li>Frame automation as removing drudgery, not replacing analysts. It frees them for investigation and hunting.</li>
  <li>Give analysts an easy way to flag a bad suggestion, and visibly act on that feedback.</li>
  <li>Never surprise the SOC: announce changes, share runbooks, and be reachable during launches.</li>
</ul>
<h3>A monthly one-pager for leadership</h3>
<ol>
  <li>Shipped this month, with value metric for each.</li>
  <li>Cumulative hours saved and revenue recovered.</li>
  <li>In progress and blockers.</li>
  <li>Risks and incidents involving automations (be open about these).</li>
  <li>Next month\'s plan.</li>
</ol>
`,
      takeaways: ['Translate outputs into hours, money, SLA and risk.', 'Build trust with analysts through feedback loops and no surprises.', 'Send a short monthly value report to leadership.'],
      practice: ['Draft your month-one leadership one-pager with placeholder numbers, so the format is ready.'],
      links: []
    }
  ],
  quiz: [
    { q: 'What is a "friction log"?', options: ['A SIEM table', 'A running list of manual, repetitive or painful tasks you observe, with who, what and how often', 'A billing report', 'A firewall log'], answer: 1, why: 'It becomes your evidence-based backlog.' },
    { q: 'In the scoring model, what lowers a candidate\'s priority?', options: ['Higher value', 'Higher confidence', 'Higher effort and higher risk', 'More runs per month'], answer: 2, why: 'Priority = value × confidence ÷ (effort × risk).' },
    { q: 'Which is the best way to report an automation\'s value to leadership?', options: ['Number of workflow steps', 'Hours saved, money recovered and SLA impact', 'Lines of code', 'Model size'], answer: 1, why: 'Use the business\'s language.' },
    { q: 'Before proposing a new automation you should first ask…', options: ['Which LLM is newest', 'What has been tried before and what already exists', 'Whether you can have admin rights', 'Nothing; just build it'], answer: 1, why: 'Avoid rebuilding what teams already rely on.' },
    { q: 'Which is a "foundation" rather than a quick win?', options: ['Failed backup → ticket', 'Shared customer ID across systems', 'Shift handover summary', 'DMARC check script'], answer: 1, why: 'A shared ID makes all future integrations easier but is not itself a visible quick win.' }
  ]
});
})(window.H);
