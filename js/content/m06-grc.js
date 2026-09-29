(function (H) {
COURSE.modules.push({
  id: 'm6', code: 'GRC', title: 'Governance, risk & compliance', tag: 'Compliance',
  summary: 'The frameworks clients are measured against and the privacy laws that constrain every automation you build.',
  lessons: [
    {
      id: 'l1', title: 'Frameworks clients ask about', mins: 14,
      summary: 'NIST CSF 2.0, ISO/IEC 27001, CIS Controls and UK Cyber Essentials.',
      body: `
${H.table(['Framework', 'Shape', 'Who asks for it'], [
  ['NIST CSF 2.0 (2024)', 'Six functions: Govern, Identify, Protect, Detect, Respond, Recover', 'Boards and risk teams wanting a common language'],
  ['ISO/IEC 27001:2022', 'Certifiable information security management system (ISMS); Annex A has 93 controls in four themes (organisational, people, physical, technological)', 'Enterprises, regulated sectors, procurement questionnaires'],
  ['CIS Critical Security Controls v8', '18 prioritised controls with Implementation Groups IG1–IG3; IG1 is "essential cyber hygiene"', 'Practical teams wanting a to-do list'],
  ['UK Cyber Essentials', 'Five technical controls: firewalls, secure configuration, security update management, user access control, malware protection', 'UK SMEs and government suppliers'],
  ['SOC 2 (AICPA)', 'Attestation report on controls against Trust Services Criteria', 'US-linked SaaS and service buyers'],
  ['PCI DSS v4', 'Card-data security standard', 'Anyone handling payment cards']
])}
<h3>How this shows up in your work</h3>
<ul>
  <li><strong>Mapping</strong>: clients want to see which J2 services satisfy which controls. A maintained control-mapping table can auto-populate reports and questionnaires.</li>
  <li><strong>Evidence</strong>: auditors ask for proof (logs of reviews, restore tests, patch status). Automations that produce evidence as a by-product are gold.</li>
  <li><strong>Security questionnaires</strong>: MSSPs answer hundreds of vendor-risk questionnaires. A retrieval-based assistant over approved past answers is a common, high-ROI AI project.</li>
</ul>
${H.note('verify', '<p>Which certifications does J2 hold itself (for example ISO 27001), and which frameworks do clients most often ask about?</p>')}
`,
      takeaways: ['NIST CSF 2.0 = six functions including Govern.', 'ISO 27001:2022 Annex A = 93 controls in four themes; CIS v8 = 18 controls; Cyber Essentials = five controls.', 'Automations that generate audit evidence and questionnaire answers are high value.'],
      practice: ['Map three J2 services to CSF 2.0 functions and to one Cyber Essentials control each.'],
      links: [['NIST CSF 2.0', 'https://www.nist.gov/cyberframework'], ['CIS Controls v8', 'https://www.cisecurity.org/controls/v8'], ['NCSC Cyber Essentials', 'https://www.ncsc.gov.uk/cyberessentials/overview'], ['ISO/IEC 27001', 'https://www.iso.org/standard/27001']]
    },
    {
      id: 'l2', title: 'POPIA, UK GDPR and your automations', mins: 16,
      summary: 'Two privacy regimes, breach notification duties, and what they mean for sending data to AI services.',
      body: `
${H.table(['', 'POPIA (South Africa)', 'UK GDPR + Data Protection Act 2018'], [
  ['In force', 'Act 4 of 2013; fully enforceable since 1 July 2021', 'Since 1 January 2021 (retained EU GDPR)'],
  ['Regulator', 'Information Regulator', 'Information Commissioner\'s Office (ICO)'],
  ['Core principles', 'Eight conditions for lawful processing: accountability; processing limitation; purpose specification; further processing limitation; information quality; openness; security safeguards; data subject participation', 'Seven principles: lawfulness, fairness &amp; transparency; purpose limitation; data minimisation; accuracy; storage limitation; integrity &amp; confidentiality; accountability'],
  ['Breach notification', 'Notify the Regulator and affected data subjects as soon as reasonably possible after discovering a security compromise', 'Notify the ICO within 72 hours of becoming aware, where the breach poses a risk to individuals'],
  ['Notable twist', 'Also protects juristic persons (companies), not only individuals', 'International transfers need adequacy or safeguards']
])}
<h3>Roles: controller vs processor (POPIA: responsible party vs operator)</h3>
<p>J2's clients are usually the controller of their data. J2, processing it to deliver security services, is usually a processor/operator. That relationship is governed by contract (a data processing agreement). Any sub-processor J2 uses, including an AI provider, must fit inside it.</p>
<h3>What this means for AI automation</h3>
<ul>
  <li><strong>Data minimisation</strong>: send an LLM only the fields it needs. Strip or pseudonymise names, emails and IDs where you can.</li>
  <li><strong>Data residency and transfers</strong>: know which region an AI service processes and stores data in. Cross-border transfers from SA or the UK need a legal basis.</li>
  <li><strong>Retention and training</strong>: use providers and settings where inputs are not used for model training, and set retention deliberately.</li>
  <li><strong>Client separation</strong>: never mix one client's data into another client's prompt, retrieval index or report.</li>
  <li><strong>Records</strong>: document what data each automation processes and why. It is part of accountability.</li>
</ul>
${H.note('warn', '<p>The fastest way to lose a client\'s trust is an automation that sends their incident data somewhere they did not agree to. Check with legal or the DPO before any new data flow to an external service.</p>')}
${H.note('tip', '<p>South Africa\'s Cybercrimes Act (2020) also places reporting duties on some providers, and the UK is legislating to bring managed service providers under its network and information systems rules. Ask J2\'s compliance lead how these affect the company.</p>')}
`,
      takeaways: ['POPIA: eight conditions, Information Regulator, notify as soon as reasonably possible.', 'UK GDPR: ICO, 72-hour notification.', 'For AI: minimise, pseudonymise, control residency and retention, never mix clients.'],
      practice: ['For a planned "LLM phishing triage" workflow, list every personal data field it touches and how you would minimise each.'],
      links: [['Information Regulator (South Africa)', 'https://inforegulator.org.za/'], ['POPIA full text', 'https://popia.co.za/'], ['ICO: UK GDPR guidance', 'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/'], ['ICO: AI and data protection', 'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/']]
    },
    {
      id: 'l3', title: 'Change control, audit trails and evidence', mins: 10,
      summary: 'Making automation auditable by design.',
      body: `
<p>Security companies are audited, and so are their clients. Your automations will be asked the same questions as any other control: who changed it, who approved it, what did it do, and can you prove it?</p>
<h3>Build these in from the start</h3>
<ul>
  <li><strong>Version control</strong> for every workflow, script and prompt. Exported iPaaS flows belong in git too.</li>
  <li><strong>Peer review</strong> before production changes, with the approval recorded.</li>
  <li><strong>Structured run logs</strong>: run ID, trigger, inputs (minimised), decisions, actions taken, outcome, duration.</li>
  <li><strong>Decision records for AI</strong>: model and prompt version, the structured output, confidence, and whether a human accepted or overrode it.</li>
  <li><strong>Separation of environments</strong>: test against a lab tenant, not a client's production tenant.</li>
</ul>
${H.code(`
{
  "run_id": "phish-triage-2026-10-14T02:17:09Z-7f3a",
  "workflow": "phish-triage@1.4.2",
  "prompt_version": "triage-v7",
  "client": "client-042",
  "trigger": "user_report",
  "verdict": "malicious",
  "confidence": 0.93,
  "actions": ["quarantine_all_copies", "notify_user"],
  "human_review": { "required": true, "by": "analyst.t2", "decision": "accepted" },
  "duration_ms": 8431
}
`, 'json')}
`,
      takeaways: ['Treat automations as controls: versioned, reviewed, logged.', 'Log AI decisions with model/prompt version and human review outcome.', 'Test in a lab tenant, never on a client\'s production first.'],
      practice: ['Design the log record for a "disable compromised user" automation. Which fields does an auditor need?'],
      links: []
    }
  ],
  quiz: [
    { q: 'Under UK GDPR, a reportable personal data breach must be notified to the ICO within…', options: ['24 hours', '72 hours of becoming aware, where feasible', '30 days', 'No deadline'], answer: 1, why: 'Article 33: without undue delay and where feasible within 72 hours.' },
    { q: 'How many conditions for lawful processing does POPIA set out?', options: ['Five', 'Seven', 'Eight', 'Eighteen'], answer: 2, why: 'POPIA has eight conditions, from accountability to data subject participation.' },
    { q: 'Which is one of the five UK Cyber Essentials controls?', options: ['Security update management', 'Quantum encryption', 'Board reporting', 'Pen testing'], answer: 0, why: 'Firewalls, secure configuration, security update management, user access control, malware protection.' },
    { q: 'You want to send incident details to an external LLM API. What should you do first?', options: ['Send everything; more context is better', 'Check the data flow with legal/DPO, minimise fields and confirm residency, retention and training terms', 'Only use it at night', 'Ask the client after it is live'], answer: 1, why: 'Privacy law and client contracts govern sub-processors and transfers.' },
    { q: 'An unusual feature of POPIA compared with GDPR is that it…', options: ['Has no regulator', 'Protects juristic persons (companies) as well as individuals', 'Does not cover security', 'Only applies to government'], answer: 1, why: 'POPIA\'s definition of data subject includes juristic persons.' }
  ]
});
})(window.H);
