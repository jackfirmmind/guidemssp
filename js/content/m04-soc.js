(function (H) {
COURSE.modules.push({
  id: 'm4', code: 'SOC', title: 'Inside the SOC', tag: 'Operations',
  summary: 'How a 24/7 security operations centre is organised, the tools it runs on, and the workflow you will automate.',
  lessons: [
    {
      id: 'l1', title: 'People, tiers and shifts', mins: 10,
      summary: 'Who does what in a SOC, and why handover is where things get lost.',
      body: `
${H.table(['Role', 'Focus', 'What they want from you'], [
  ['Tier 1 analyst', 'Triage incoming alerts, close false positives, escalate real ones', 'Enrichment in one place; fewer duplicate alerts; clear playbooks'],
  ['Tier 2 analyst / incident responder', 'Investigate escalations, contain, coordinate with client', 'Timelines built for them; one-click containment with approval'],
  ['Tier 3 / threat hunter', 'Hunt for undetected threats, handle complex incidents', 'Fast query tooling, data access, notebooks'],
  ['Detection engineer', 'Write and tune detection rules', 'Detection-as-code pipelines, test data, FP feedback loops'],
  ['SOC manager / lead', 'Staffing, SLAs, quality, client escalations', 'Accurate metrics and reports without manual work']
])}
<h3>The 24/7 reality</h3>
<ul>
  <li>Shifts rotate through nights, weekends and public holidays. Fatigue is real; automation that removes repetitive work also reduces mistakes.</li>
  <li><strong>Handover</strong> is the riskiest moment: open incidents, pending client callbacks and "keep an eye on this" items must survive a shift change. An automated handover summary is a classic high-value, low-risk AI use case.</li>
  <li>Analysts are experts. Automation that ignores their judgement gets ignored. Co-design with them.</li>
</ul>
${H.note('j2', '<p>Spend a shift or two sitting with analysts early on (a night shift if you can). You will learn more about real friction in one shift than in a week of meetings.</p>')}
`,
      takeaways: ['Tier 1 triages, Tier 2 responds, Tier 3 hunts; detection engineers tune rules.', 'Shift handover is a high-risk, high-value automation target.', 'Build with analysts, not for them.'],
      practice: ['Draft the five fields you think every shift-handover note must contain.'],
      links: [['MITRE: 11 Strategies of a World-Class SOC', 'https://www.mitre.org/news-insights/publication/11-strategies-world-class-cybersecurity-operations-center']]
    },
    {
      id: 'l2', title: 'The SOC tool stack', mins: 14,
      summary: 'SIEM, SOAR, EDR/XDR, threat intelligence and case management, and how data flows between them.',
      body: `
${H.table(['Tool', 'Job', 'Examples in the market'], [
  ['SIEM', 'Collect and correlate logs from many sources; run detection rules; store for search', 'Microsoft Sentinel, Splunk, Google SecOps, Elastic, Wazuh'],
  ['EDR / XDR', 'Deep telemetry and response on endpoints (EDR); correlated across email, identity, endpoint, cloud (XDR)', 'Microsoft Defender XDR, CrowdStrike, SentinelOne'],
  ['SOAR', 'Automate response playbooks: enrich, notify, contain', 'Sentinel playbooks (Logic Apps), Tines, Torq, Cortex XSOAR, Shuffle'],
  ['Threat intelligence (TIP)', 'Reputation and context for IPs, domains, hashes', 'VirusTotal, AbuseIPDB, MISP, vendor feeds'],
  ['Case management / PSA', 'Tickets, client communication, SLA tracking, billing links', 'ConnectWise, Autotask, HaloPSA, ServiceNow, Jira Service Management'],
  ['Documentation', 'Client runbooks, contacts, network notes', 'IT Glue, Hudu, Confluence, SharePoint']
])}
<h3>Data flow</h3>
${H.flow(['Log sources (M365, EDR, firewall, email, DTEX, deception)', 'SIEM / XDR', 'Detection rule fires', 'Incident created', 'SOAR enrichment', 'Analyst', 'PSA ticket &amp; client comms'])}
<h3>Where automation lives</h3>
<p>SOAR is the traditional home of SOC automation: deterministic playbooks triggered by incidents. Your role likely extends this with LLM steps (summarise, classify, draft) and with business-side integrations SOAR tools are weak at, such as syncing to the PSA, billing or the CRM.</p>
${H.note('j2', '<p>Because J2 publicly emphasises Microsoft 365 monitoring, Microsoft\'s security stack (Defender XDR, Sentinel, Entra ID) is worth learning well. Microsoft\'s SC-200 learning path is a free, structured way to do it.</p>')}
${H.note('verify', '<p>Confirm the SIEM, XDR, SOAR and PSA J2 actually uses, and whether it is multi-tenant (one workspace per client) or centralised.</p>')}
`,
      takeaways: ['SIEM correlates, EDR/XDR sees and acts on endpoints and beyond, SOAR automates playbooks.', 'The PSA links security work to clients, SLAs and billing.', 'Your work bridges SOAR-style automation with LLMs and business systems.'],
      practice: ['Start Microsoft Learn\'s SC-200 path. Complete the Defender XDR and Sentinel introduction modules.'],
      links: [['Microsoft Learn: SC-200 Security Operations Analyst', 'https://learn.microsoft.com/en-us/credentials/certifications/security-operations-analyst/'], ['Microsoft Sentinel documentation', 'https://learn.microsoft.com/en-us/azure/sentinel/']]
    },
    {
      id: 'l3', title: 'Alert triage, step by step', mins: 15,
      summary: 'The decision loop an analyst runs hundreds of times a week.',
      body: `
${H.flow(['Alert fires', 'Enrich (user, asset, IP, history)', 'Classify', 'Scope (who else?)', 'Contain / escalate', 'Notify client', 'Document &amp; close'])}
<h3>Classification outcomes</h3>
${H.table(['Outcome', 'Meaning', 'Example'], [
  ['True positive', 'Real malicious activity', 'A confirmed phishing credential theft'],
  ['Benign positive', 'The detection worked, but the activity is expected or authorised', 'The client\'s pentester running Mimikatz'],
  ['False positive', 'The detection logic or data was wrong', 'A rule firing on a misparsed log field']
])}
<h3>Enrichment: the biggest time sink</h3>
<p>For a single "risky sign-in" alert an analyst might check: who the user is and their role; whether the IP is known VPN, hosting provider or TOR; the user's normal locations; recent MFA changes; any new inbox rules; other alerts for the same user or IP across the client. Done by hand that is 5 to 15 minutes. Done by automation it arrives attached to the alert.</p>
<h3>Alert fatigue</h3>
<p>When most alerts are noise, analysts start skimming, and real attacks get missed. Fixes, in order of preference:</p>
<ol>
  <li>Tune the detection (detection engineering) so it fires less on benign activity.</li>
  <li>Suppress or group duplicates (one incident, not fifty alerts).</li>
  <li>Enrich and auto-classify known-benign patterns, with a human sampling the auto-closures.</li>
  <li>Summarise so the analyst reads one paragraph, not ten raw log lines.</li>
</ol>
${H.note('warn', '<p>Auto-closing alerts is the most dangerous automation in a SOC. Always log the reason, sample closures for QA, and make the rule easy to switch off.</p>')}
`,
      takeaways: ['Triage loop: enrich, classify, scope, contain, notify, document.', 'TP / benign positive / FP are different outcomes with different fixes.', 'Enrichment is the biggest manual cost and the safest place to start automating.'],
      practice: ['Pick the "risky sign-in" alert. List every enrichment lookup, its data source and whether it could be automated.'],
      links: [['Microsoft: Classify and resolve incidents in Sentinel', 'https://learn.microsoft.com/en-us/azure/sentinel/investigate-incidents']]
    },
    {
      id: 'l4', title: 'Incident response lifecycle', mins: 12,
      summary: 'NIST SP 800-61 phases and how they connect to the resilience framework.',
      body: `
<p>NIST SP 800-61 is the classic incident-handling guide. Its long-used Revision 2 describes four phases; Revision 3 (2025) reorganises the guidance around the NIST CSF 2.0 functions. Both are worth knowing because people use both vocabularies.</p>
${H.table(['Phase (Rev. 2)', 'Key activities', 'Automation examples'], [
  ['Preparation', 'Playbooks, contacts, tooling, access, training', 'Keep escalation contacts synced from CRM; test playbooks automatically'],
  ['Detection &amp; analysis', 'Validate, scope, prioritise', 'Enrichment, correlation, LLM timeline summaries'],
  ['Containment, eradication &amp; recovery', 'Isolate, remove, restore', 'Approval-gated isolation, account disable, password reset'],
  ['Post-incident activity', 'Lessons learned, reporting', 'Draft incident reports, update detections, track actions']
])}
<h3>Containment options you should recognise</h3>
<ul>
  <li><strong>Isolate a device</strong> via EDR, cutting it from the network except for the security tool.</li>
  <li><strong>Disable a user or revoke sessions</strong> in Entra ID; force password reset and MFA re-registration.</li>
  <li><strong>Remove malicious emails</strong> from every mailbox that received them (email security tools and Microsoft Defender can do this at scale).</li>
  <li><strong>Block indicators</strong> (IP, domain, hash) across controls.</li>
</ul>
${H.note('j2', '<p>"Identify, isolate and neutralise" is how J2 describes its SOC. Those three verbs map directly to detection, containment and eradication.</p>')}
`,
      takeaways: ['Preparation → detection & analysis → containment, eradication, recovery → post-incident.', 'Rev. 3 (2025) aligns incident response with CSF 2.0.', 'High-impact containment actions should be approval-gated in automation.'],
      practice: ['Write a one-page playbook for "user reports a phishing email they clicked". Mark each step: manual, automated, or automated-with-approval.'],
      links: [['NIST SP 800-61 Rev. 3', 'https://csrc.nist.gov/pubs/sp/800/61/r3/final']]
    },
    {
      id: 'l5', title: 'SOC metrics', mins: 10,
      summary: 'The numbers that prove the SOC is working, and the ones your automations will move.',
      body: `
${H.table(['Metric', 'Definition', 'Automation effect'], [
  ['MTTD', 'Mean time to detect: attack start → alert', 'Better detections and coverage'],
  ['MTTA', 'Mean time to acknowledge: alert → analyst picks up', 'Routing, prioritisation, paging'],
  ['MTTR', 'Mean time to respond (or resolve): alert → contained/closed. Always define which', 'Enrichment, playbooks, one-click containment'],
  ['False positive rate', 'FP ÷ all closed alerts', 'Tuning and auto-classification'],
  ['Alerts per analyst per shift', 'Workload measure', 'Deduplication, grouping, auto-closure'],
  ['SLA attainment %', 'Share of incidents meeting contracted targets', 'Accurate clocks and escalation'],
  ['Automation rate', 'Share of alerts with at least one automated step, or fully handled', 'Your headline metric']
])}
<h3>Measure before you automate</h3>
<p>You cannot claim you cut MTTR by 40% if nobody measured MTTR before. In your first month, capture baselines for the workflows you plan to change. Timestamps in the PSA and SIEM usually give you most of what you need.</p>
${H.note('warn', '<p>Metrics can be gamed. Closing alerts faster by closing them wrongly improves MTTR and hurts clients. Pair speed metrics with quality checks such as reopened incidents and QA sampling.</p>')}
`,
      takeaways: ['Know MTTD, MTTA, MTTR (and define which "R").', 'Baseline before you automate.', 'Pair speed metrics with quality metrics.'],
      practice: ['Write the SQL or KQL-style pseudo-query you would use to compute median time-to-acknowledge per severity for last month.'],
      links: []
    }
  ],
  quiz: [
    { q: 'A pentester authorised by the client triggers a credential-dumping alert. The best classification is…', options: ['True positive', 'Benign positive', 'False positive', 'Undetermined'], answer: 1, why: 'The detection correctly spotted real activity, but it was authorised.' },
    { q: 'Which tool\'s primary job is automating response playbooks?', options: ['SIEM', 'SOAR', 'PSA', 'DMARC'], answer: 1, why: 'SOAR = Security Orchestration, Automation and Response.' },
    { q: 'Which is usually the safest first automation in a SOC?', options: ['Auto-closing all low-severity alerts', 'Automatically disabling any user with a risky sign-in', 'Enriching alerts with context before an analyst sees them', 'Deleting old logs'], answer: 2, why: 'Enrichment adds information without taking irreversible action.' },
    { q: 'Why is shift handover a strong AI use case?', options: ['It is legally required to use AI', 'It is high-risk for lost context, repetitive to write, and a human reviews the output', 'Handover never happens in 24/7 SOCs', 'It removes the need for tickets'], answer: 1, why: 'LLM summaries of open items are valuable and naturally reviewed by the incoming shift.' },
    { q: 'Before claiming an automation reduced MTTR, you need…', options: ['A vendor quote', 'A baseline measured before the change', 'An LLM', 'A new SIEM'], answer: 1, why: 'Without a baseline, improvement cannot be shown.' },
    { q: 'Which NIST SP 800-61 phase includes isolating a compromised endpoint?', options: ['Preparation', 'Detection & analysis', 'Containment, eradication & recovery', 'Post-incident activity'], answer: 2, why: 'Isolation is a containment action.' }
  ]
});
})(window.H);
