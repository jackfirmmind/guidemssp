(function (H) {
COURSE.modules.push({
  id: 'm1', code: 'CO', title: 'Know J2', tag: 'Company',
  summary: 'History, footprint, what J2 sells, the resilience philosophy and the scorecard that drives sales and delivery.',
  lessons: [
    {
      id: 'l1', title: 'From Honeydew to five continents', mins: 10,
      summary: 'J2 started in 2006 in Honeydew, Johannesburg, and now serves 700+ customers from dual headquarters in London and Johannesburg.',
      body: `
<h3>The short version</h3>
${H.table(['Fact', 'Detail'], [
  ['Founded', '2006, in Honeydew (a suburb in the north-west of Johannesburg, South Africa)'],
  ['Founders', 'John Mc Loughlin and Jason (co-founder)'],
  ['Headquarters', 'Dual HQ: London, UK and Johannesburg, South Africa'],
  ['Scale', '700+ customers across five continents'],
  ['Positioning', 'Operational cyber resilience, risk reduction, data protection and continuous threat monitoring'],
  ['Company blog milestone', '"18 years from Honeydew to the world" (2024)']
])}
<h3>Why the history matters to you</h3>
<p>A company that grew from a South African reseller-style business into a global MSSP carries its history in its systems. Expect some mix of:</p>
<ul>
  <li><strong>Legacy and modern tools side by side</strong>, added as the company grew. Integration debt is normal and it is your opportunity.</li>
  <li><strong>Two regulatory worlds</strong>: POPIA in South Africa and UK GDPR / Data Protection Act 2018 in the UK, plus EU GDPR for European clients. Every automation that moves customer data must respect both.</li>
  <li><strong>Two currencies and time zones</strong>: ZAR and GBP billing, SAST (UTC+2) and UK time (UTC+0/+1). SAST has no daylight saving, so the gap is one hour in UK summer and two hours in UK winter.</li>
  <li><strong>Vendor relationships</strong>: a long track record of partnering with security vendors (Mimecast, IRONSCALES, DTEX and others) and wrapping them in a managed service.</li>
</ul>
${H.note('j2', '<p>The dual HQ is an advantage for a 24/7 SOC: Johannesburg and London together cover more of the clock during business hours. Ask how shifts are split and how handover works between sites.</p>')}
${H.note('verify', '<p>Confirm headcount, the split of staff between sites, the SOC location(s), and current leadership roles. Public figures such as "700+ customers" may already be out of date.</p>')}
`,
      takeaways: [
        'Founded 2006 in Honeydew; now 700+ customers on five continents.',
        'Dual HQ London + Johannesburg means two privacy regimes, two currencies and a follow-the-sun opportunity.',
        'Expect integration debt from organic growth. That debt is where your quick wins live.'
      ],
      practice: ['Read J2\'s About page and the "18 years" blog post. Note three phrases the company uses to describe itself; use their language in interviews and meetings.'],
      links: [['J2 About us', 'https://j2mssp.com/about-us/'], ['18 years from Honeydew to the world', 'https://j2mssp.com/18-years-from-honeydew-to-the-world/']]
    },
    {
      id: 'l2', title: 'The service catalogue', mins: 15,
      summary: 'Seven service lines, each producing data and manual work you can automate.',
      body: `
<p>J2 does not just resell software. It wraps vendor technology in a managed service run by its own SOC. Learn the catalogue as a map of <em>problems solved</em> and <em>data produced</em>, because the data is what you will automate against.</p>
${H.table(['Service', 'Problem it solves', 'Data it produces', 'Automation angle'], [
  ['24/7 SOC / managed detection', 'Threats noticed late, especially after hours', 'Alerts, incidents, analyst notes, SLA timers', 'Enrichment, triage summaries, routing, shift handover notes'],
  ['Email security (Mimecast, IRONSCALES)', 'Phishing, BEC, malware by email', 'Message verdicts, user reports, quarantine events', 'Auto-triage of user-reported phish, campaign clustering, client reporting'],
  ['Insider risk (DTEX)', 'Data theft, negligent or malicious staff', 'Behavioural telemetry, risk scores', 'Case summaries, HR/legal workflow, evidence packs'],
  ['Endpoint security', 'Malware, ransomware, hands-on-keyboard attackers', 'EDR detections, device inventory', 'Isolation playbooks, inventory vs billing reconciliation'],
  ['Managed data encryption', 'Data exposure if devices or files leak', 'Key and policy status, coverage', 'Coverage reporting, exception alerts'],
  ['Backup &amp; ransomware protection', 'Irrecoverable data loss', 'Job success/failure, restore tests', 'Failed-job ticketing, restore-test evidence'],
  ['Network deception (honeypots)', 'Attackers moving quietly inside the network', 'Very high-confidence tripwire alerts', 'Fast-path escalation and containment']
])}
<h3>How the pieces fit</h3>
<p>Each tool generates signals. The SOC turns signals into decisions. The business turns decisions into reports, renewals and invoices. You sit on the pipes between all three.</p>
${H.flow(['Vendor tools emit telemetry', 'SOC platform correlates', 'Analyst decides', 'Client is notified', 'Monthly report', 'Invoice &amp; renewal'])}
${H.note('j2', '<p>Publicly, J2 also highlights active monitoring of <strong>Microsoft 365</strong> environments to stop account takeover. Microsoft identity and email data is likely a large share of the SOC\'s daily work.</p>')}
${H.note('verify', '<p>Which SIEM/XDR platform does the SOC use, which PSA/ticketing system, and which services are the biggest by revenue and by alert volume? The answers decide where automation pays back first.</p>')}
`,
      takeaways: [
        'J2 sells managed outcomes built on partner technology, run by its own SOC.',
        'For each service, know the problem, the data it produces and the manual work around it.',
        'The biggest automation wins usually sit on the highest-volume data streams, often email and identity.'
      ],
      practice: ['Rank the seven services by your guess of alert volume per month. On day one, ask the SOC lead to rank them and compare.'],
      links: [['J2 Managed Cyber Security Service', 'https://j2mssp.com/managed-cyber-security-service/'], ['J2 IRONSCALES', 'https://j2mssp.com/ironscales/'], ['J2 Mimecast', 'https://j2mssp.com/mimecast/'], ['J2 Managed data encryption', 'https://j2mssp.com/managed-data-encryption/']]
    },
    {
      id: 'l3', title: 'Resilience, not just prevention', mins: 12,
      summary: 'The J2 Cyber Resilience Framework assumes something will get through and optimises for seeing it and responding fast.',
      body: `
<p>Traditional security sales focus on prevention: buy this firewall, this antivirus, and you will be safe. J2's message is different. Prevention fails eventually, so the question becomes: <strong>how fast do you notice, and how well do you respond?</strong></p>
<h3>The two pillars</h3>
<dl>
  <dt>Visibility</dt><dd>You see a breach immediately, including at night, at weekends and on public holidays when attackers prefer to operate.</dd>
  <dt>Capability to respond</dt><dd>You can contain and recover dynamically, not by waiting until Monday for someone to read an email alert.</dd>
</dl>
<h3>How this lines up with industry frameworks</h3>
<p>The NIST Cybersecurity Framework 2.0 organises security into six functions. J2's resilience pitch leans hardest on the last three.</p>
${H.table(['NIST CSF 2.0 function', 'Question it answers', 'Where J2 fits'], [
  ['Govern', 'Who owns cyber risk and how is it managed?', 'Scorecard, action plans, reporting to leadership'],
  ['Identify', 'What do we have and what matters most?', 'Assessment across users, email, data, machines, internet'],
  ['Protect', 'How do we reduce the chance of an incident?', 'Email security, encryption, endpoint, backup'],
  ['Detect', 'How do we notice an incident?', '24/7 SOC monitoring, deception, insider risk analytics'],
  ['Respond', 'What do we do when it happens?', 'SOC isolation, containment and neutralisation'],
  ['Recover', 'How do we get back to normal?', 'Backup and ransomware recovery']
])}
<h3>Why resilience is good for your role</h3>
<p>Resilience is measured in time: time to detect, time to respond, time to recover. Time is exactly what automation compresses. Every lesson you learn about MTTD and MTTR later in this course is a way to express your value in J2's own language.</p>
${H.note('j2', '<p>When you pitch an automation internally, frame it as a resilience gain: "This cuts triage time for user-reported phishing from 12 minutes to 2, which shortens exposure for every client."</p>')}
`,
      takeaways: [
        'Resilience = visibility (notice fast, 24/7) + capability to respond.',
        'It maps to NIST CSF 2.0, especially Detect, Respond and Recover.',
        'Resilience is measured in time, and automation buys time.'
      ],
      practice: ['Explain "cyber resilience" to a non-technical friend in under 60 seconds. If you need jargon, try again.'],
      links: [['NIST Cybersecurity Framework 2.0', 'https://www.nist.gov/cyberframework']]
    },
    {
      id: 'l4', title: 'The Cyber Resilience Scorecard', mins: 12,
      summary: 'A 20-question assessment across users, email, data, machines and internet that feeds prioritised action plans.',
      body: `
<p>J2 uses a short, 20-question <strong>Cyber Resilience Scorecard</strong> to assess an organisation across five areas. The results become a prioritised security action plan, which in turn shapes what the client buys.</p>
${H.table(['Area', 'What it looks at', 'Typical J2 services it points to'], [
  ['Users', 'Awareness, MFA, privileged access, insider behaviour', 'Awareness training, insider risk (DTEX), identity monitoring'],
  ['Email', 'Filtering, impersonation protection, reporting', 'Mimecast, IRONSCALES, phishing response'],
  ['Data', 'Classification, encryption, backup, recovery', 'Managed encryption, backup and ransomware protection'],
  ['Machines', 'Endpoint protection, patching, visibility', 'Endpoint security, 24/7 SOC monitoring'],
  ['Internet', 'Perimeter, exposure, web filtering, lateral movement', 'Network security, deception technology']
])}
<h3>The scorecard as a funnel</h3>
${H.flow(['Scorecard (20 Qs)', 'Gap analysis', 'Prioritised action plan', 'Proposal', 'Onboarding', 'Monitoring', 'Re-score at QBR'])}
<p>A scorecard is both a sales tool and a delivery tool. Re-scoring a client each quarter shows progress, which justifies the spend and opens conversations about the next gap.</p>
<h3>Automation opportunities hiding here</h3>
<ul>
  <li>Scorecard submissions flowing straight into the CRM as structured fields, not PDFs.</li>
  <li>Auto-generated first-draft action plans, with an LLM writing the narrative from the scores and a human reviewing it.</li>
  <li>Evidence-based re-scoring: pulling real telemetry (MFA coverage, patch status, DMARC policy) instead of relying only on self-assessment.</li>
  <li>Dashboards showing score movement across the whole customer base, useful for leadership and marketing.</li>
</ul>
${H.note('tip', '<p>Try the <a href="#scorecard">practice scorecard</a> in this app. It is modelled on the five areas but the questions are written for learning, not copied from J2.</p>')}
${H.note('verify', '<p>Where do scorecard responses live today? Who reviews them, and how long does it take to turn one into an action plan?</p>')}
`,
      takeaways: [
        '20 questions, five areas: users, email, data, machines, internet.',
        'Scores become a prioritised action plan and feed the sales pipeline.',
        'Structured scorecard data plus real telemetry is a strong automation and reporting opportunity.'
      ],
      practice: ['Complete the practice scorecard for a company you know (a previous employer or a friend\'s business). Read the action plan it produces and decide whether you agree with the order.'],
      links: [['J2 home page (scorecard)', 'https://j2mssp.com/']]
    }
  ],
  quiz: [
    { q: 'Which two cities form J2\'s dual headquarters?', options: ['Cape Town and Dublin', 'London and Johannesburg', 'Johannesburg and Amsterdam', 'Durban and Manchester'], answer: 1, why: 'J2 operates dual headquarters in London, UK and Johannesburg, South Africa.' },
    { q: 'What is the core idea behind "cyber resilience" as J2 sells it?', options: ['Buying enough preventive tools that no breach can occur', 'Outsourcing compliance paperwork', 'Seeing a breach quickly, even off-hours, and having the capability to respond', 'Replacing staff with AI'], answer: 2, why: 'Resilience assumes prevention can fail and optimises for visibility and response.' },
    { q: 'The Cyber Resilience Scorecard covers which five areas?', options: ['People, process, technology, budget, board', 'Users, email, data, machines, internet', 'Identify, protect, detect, respond, recover', 'Cloud, on-prem, mobile, OT, IoT'], answer: 1, why: 'The 20 questions span users, email, data, machines and internet.' },
    { q: 'Which vendor pairing is associated with J2\'s email security offering?', options: ['Mimecast and IRONSCALES', 'DTEX and Veeam', 'CrowdStrike and Okta', 'Zscaler and Proofpoint'], answer: 0, why: 'J2 partners with Mimecast and IRONSCALES for advanced email security. DTEX is its insider risk partner.' },
    { q: 'Why is a deception-technology alert (a honeypot being touched) valuable to automate?', options: ['It is usually a false positive', 'Legitimate users rarely touch decoys, so alerts are high-confidence', 'It replaces the need for a SOC', 'It only fires during business hours'], answer: 1, why: 'Decoys have no business use, so interaction is a strong signal. That makes fast-path automation safer.' },
    { q: 'In NIST CSF 2.0, which function was newly added compared with CSF 1.1?', options: ['Detect', 'Recover', 'Govern', 'Protect'], answer: 2, why: 'CSF 2.0 (2024) added Govern to the original five functions.' }
  ]
});
})(window.H);
