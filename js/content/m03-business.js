(function (H) {
COURSE.modules.push({
  id: 'm3', code: 'BZ', title: 'The MSSP business', tag: 'Commercial',
  summary: 'How a managed security provider makes money, where margin leaks, and the customer lifecycle your systems support.',
  lessons: [
    {
      id: 'l1', title: 'MSP, MSSP, MDR, SOCaaS', mins: 10,
      summary: 'The acronyms, what separates them and where J2 sits.',
      body: `
${H.table(['Model', 'What they deliver', 'Typical buyer question'], [
  ['MSP (Managed Service Provider)', 'Runs IT: helpdesk, devices, networks, M365 admin', '"Keep our IT working"'],
  ['MSSP (Managed Security Service Provider)', 'Runs security tools and monitoring as a service', '"Keep us secure and compliant"'],
  ['MDR (Managed Detection &amp; Response)', 'Detection plus hands-on response (contain, isolate), usually on the provider\'s chosen stack', '"Stop attacks for us, 24/7"'],
  ['SOCaaS / co-managed SOC', 'A SOC team on the client\'s own SIEM, sometimes shared with their staff', '"We own the tools, you watch them"']
])}
<p>The lines blur. J2 calls itself an MSSP but its 24/7 SOC that identifies, isolates and neutralises threats is MDR-style work. Many MSSPs also resell licences and provide professional services (assessments, incident response retainers).</p>
<h3>Shared responsibility</h3>
<p>Every contract divides duties. The MSSP might monitor and contain; the client still owns patching, user decisions and business continuity. Unclear responsibility is a leading cause of disputes after an incident. Automations that notify, escalate and record decisions make the boundary visible.</p>
${H.note('verify', '<p>How does J2 describe the split between J2 and the client in its standard contract or SOW? Which response actions can the SOC take without asking the client first?</p>')}
`,
      takeaways: ['MSP runs IT; MSSP runs security; MDR adds hands-on response.', 'J2\'s 24/7 SOC with isolation and neutralisation is MDR-style delivery.', 'Shared responsibility must be explicit; automation can record who did what.'],
      practice: ['Write one sentence explaining the difference between MSSP and MDR as you would to a finance director.'],
      links: [['Gartner glossary: MSSP', 'https://www.gartner.com/en/information-technology/glossary/mssp-managed-security-service-provider']]
    },
    {
      id: 'l2', title: 'The economics: why automation is margin', mins: 14,
      summary: 'Recurring revenue, cost to serve and the analyst-to-client ratio.',
      body: `
<h3>Revenue</h3>
<ul>
  <li><strong>Recurring revenue</strong> (MRR/ARR): monthly or annual fees per user, per endpoint, per mailbox or per service tier. This is the heart of an MSSP.</li>
  <li><strong>Licence resale</strong>: vendor licences resold with a margin. Lower margin, but sticky.</li>
  <li><strong>Professional services</strong>: assessments, onboarding, incident response. Lumpy but high value.</li>
</ul>
<h3>Cost to serve</h3>
<p>The dominant cost is <strong>people</strong>: 24/7 coverage needs roughly five to six full-time staff per seat on the rota once you include nights, weekends, leave and training. Tooling and log ingestion (SIEM costs often scale with data volume) come next.</p>
<h3>The key equation</h3>
${H.code(`
gross margin = recurring revenue - (analyst time + tooling + licences + ingestion)

analyst time per client = alerts per month x minutes per alert
                        + reporting time + onboarding time + meetings
`, 'model')}
<p>If a new client adds 800 alerts a month at 8 minutes each, that is over 100 analyst hours. Cut triage to 3 minutes with enrichment and auto-closure of known-benign patterns and you save more than 65 hours a month for that one client. That is the business case you will make again and again.</p>
${H.table(['Metric', 'What it tells leadership'], [
  ['MRR / ARR', 'Size and growth of recurring revenue'],
  ['Gross margin %', 'How efficiently the service is delivered'],
  ['Net revenue retention', 'Do existing clients grow (upsell) faster than they churn?'],
  ['Churn', 'Clients or revenue lost; often driven by poor reporting or a bad incident'],
  ['Clients or endpoints per analyst', 'Operational leverage; automation raises this']
])}
${H.note('warn', '<p>The figures above are illustrative. Never quote made-up numbers internally; ask finance for real ones.</p>')}
`,
      takeaways: ['Recurring revenue is the core; people are the main cost.', 'Analyst minutes per alert × alert volume is the lever you pull.', 'Express automation value as hours saved and margin gained.'],
      practice: ['Build a tiny spreadsheet: alerts/month, minutes/alert, analyst cost/hour. Model the saving from cutting minutes/alert by half.'],
      links: [['Canalys / MSP industry research (overview)', 'https://www.canalys.com/']]
    },
    {
      id: 'l3', title: 'The customer lifecycle', mins: 14,
      summary: 'From first scorecard to renewal, and the systems each stage touches.',
      body: `
${H.flow(['Lead', 'Scorecard / assessment', 'Proposal &amp; quote', 'Contract / SOW', 'Onboarding', 'Steady-state monitoring', 'Monthly reports &amp; QBRs', 'Renewal / upsell'])}
${H.table(['Stage', 'Systems involved', 'Where it usually breaks'], [
  ['Lead &amp; scorecard', 'Website form, CRM, marketing automation', 'Scorecard answers stuck in email or PDF; not linked to the CRM record'],
  ['Proposal &amp; contract', 'CRM, quoting tool, e-signature', 'Contracted quantities not recorded in a structured way'],
  ['Onboarding', 'PSA/ticketing, vendor consoles, SIEM, documentation', 'Manual checklists; log sources missed; no single "client is live" moment'],
  ['Steady state', 'SIEM/XDR, SOAR, PSA, comms', 'Alert noise; inconsistent notes; client contacts out of date'],
  ['Reporting', 'SIEM, BI tool, document templates', 'Hours spent copy-pasting screenshots into reports every month'],
  ['Billing', 'PSA, accounting, vendor portals', 'Licence counts drift from invoiced quantities (revenue leakage)'],
  ['Renewal', 'CRM, reporting', 'No evidence of value delivered, so renewals are about price']
])}
<h3>The data model underneath</h3>
<p>Almost every MSSP back office revolves around the same entities. If you can draw this on a whiteboard in week one, you understand the business.</p>
${H.code(`
Customer 1--* Contract 1--* ContractLine (service, quantity, unit price)
Customer 1--* Tenant/Environment (M365 tenant, EDR console, SIEM workspace)
Tenant   1--* Asset/Seat (users, mailboxes, endpoints)
Customer 1--* Contact (escalation list, report recipients)
Tenant   1--* Alert *--1 Incident 1--* Ticket
Customer 1--* Invoice 1--* InvoiceLine
`, 'entities')}
${H.note('j2', '<p>Onboarding speed is a competitive advantage. A standard, automated onboarding pipeline (connect tenant, verify log sources, create documentation and PSA records, schedule the first report) is one of the most visible wins you can deliver.</p>')}
`,
      takeaways: ['Know the eight lifecycle stages and the system each uses.', 'Breaks happen at hand-offs between systems, not inside them.', 'Customer, contract, tenant, asset, alert, ticket, invoice: the core data model.'],
      practice: ['Draw the entity model from memory. Add one entity you think is missing and explain why.'],
      links: []
    },
    {
      id: 'l4', title: 'SLAs, severity and reporting', mins: 12,
      summary: 'The promises the SOC makes and the reports that prove they were kept.',
      body: `
<h3>A typical severity matrix</h3>
${H.table(['Severity', 'Example', 'Response target (illustrative)', 'Client notified'], [
  ['<span class="chip bad">P1 Critical</span>', 'Active ransomware, confirmed account takeover of an executive', 'Minutes', 'Phone plus ticket, immediately'],
  ['<span class="chip warn">P2 High</span>', 'Malware on an endpoint, suspicious admin activity', 'Within an hour', 'Ticket plus email'],
  ['<span class="chip accent">P3 Medium</span>', 'Policy violations, risky but unconfirmed sign-ins', 'Same business day', 'Ticket'],
  ['<span class="chip">P4 Low</span>', 'Informational, hygiene findings', 'Scheduled', 'Monthly report']
])}
<h3>SLA vocabulary</h3>
<dl>
  <dt>Time to acknowledge</dt><dd>An analyst has picked up the alert.</dd>
  <dt>Time to notify</dt><dd>The client has been told, through the agreed channel.</dd>
  <dt>Time to contain</dt><dd>The threat can no longer spread (device isolated, account disabled).</dd>
  <dt>SLA clock pauses</dt><dd>Many contracts pause the clock while waiting for the client. Your ticketing automation must track this correctly or SLA reports become disputes.</dd>
</dl>
<h3>Monthly reporting</h3>
<p>Reports are what clients see between incidents. A good MSSP report shows alerts handled, incidents and outcomes, SLA attainment, trends, open risks and recommended next actions. Producing them is often a painful, manual, end-of-month scramble. It is a perfect candidate for automation plus an LLM-drafted executive summary with human review.</p>
${H.note('verify', '<p>Get J2\'s real severity matrix and SLA targets, and a sample client report. These become your requirements documents.</p>')}
`,
      takeaways: ['Severity drives response targets and notification channels.', 'SLA clocks (acknowledge, notify, contain) must be measured precisely, including pauses.', 'Monthly reports are a high-value automation target.'],
      practice: ['Sketch the sections of an ideal one-page monthly security report for a 200-person client.'],
      links: []
    }
  ],
  quiz: [
    { q: 'What most distinguishes MDR from a basic MSSP monitoring service?', options: ['MDR is cheaper', 'MDR includes hands-on response such as isolating devices', 'MDR only covers email', 'MDR never uses a SIEM'], answer: 1, why: 'MDR adds active response, not just alert forwarding.' },
    { q: 'What is usually the largest cost in running a 24/7 SOC?', options: ['Office rent', 'People', 'Laptops', 'Marketing'], answer: 1, why: 'Round-the-clock staffing dominates cost, which is why analyst minutes matter so much.' },
    { q: 'Licence counts in a client tenant rise from 180 to 230 but the invoice still says 180. This is…', options: ['Churn', 'Revenue leakage', 'An SLA breach', 'A DMARC failure'], answer: 1, why: 'Delivering more than you bill is revenue leakage, a classic reconciliation automation target.' },
    { q: 'Why must ticketing automation handle "SLA clock paused" states?', options: ['For cosmetic reasons', 'Because contracts often pause the SLA while waiting on the client, and reports must reflect it', 'Because SLAs only apply at night', 'It does not matter'], answer: 1, why: 'Incorrect pause handling produces wrong SLA reports and disputes.' },
    { q: 'Where do customer-lifecycle processes most often break?', options: ['Inside a single well-configured tool', 'At hand-offs between systems and teams', 'Only in the SIEM', 'Only during renewals'], answer: 1, why: 'Hand-offs, where data moves between tools and people, are where errors and delays appear.' }
  ]
});
})(window.H);
