(function (H) {
COURSE.modules.push({
  id: 'm5', code: 'STK', title: 'The J2 solution stack', tag: 'Services',
  summary: 'Deep dives on the technology behind each service line: email, insider risk, endpoint, encryption, backup and deception.',
  lessons: [
    {
      id: 'l1', title: 'Email security: gateway vs API', mins: 14,
      summary: 'Mimecast and IRONSCALES represent two complementary approaches to stopping phishing and BEC.',
      body: `
${H.table(['Approach', 'How it works', 'Strengths', 'Gaps'], [
  ['Secure Email Gateway (SEG)', 'MX records point to the gateway, which filters mail before it reaches M365 or Google', 'Blocks known-bad mail at the edge; URL rewriting and attachment sandboxing; archiving and continuity', 'Sees mail only once, at the edge; internal mail and post-delivery threats are harder'],
  ['API-based / integrated cloud email security (ICES)', 'Connects to the mailbox via API and inspects mail in place, including after delivery', 'Behavioural and relationship analysis; retroactive removal; strong on BEC and internal phishing', 'Mail has already landed; relies on API permissions and speed']
])}
<p><strong>Mimecast</strong> is widely known for its gateway, archiving, continuity and awareness training. <strong>IRONSCALES</strong> is an API-based platform that combines AI detection with crowdsourced intelligence from user reports across its customer community, and can remediate phishing from every mailbox automatically. Many organisations layer both.</p>
<h3>The user-reported phishing loop</h3>
${H.flow(['User clicks "Report phish"', 'Message analysed', 'Similar messages found across mailboxes', 'Verdict', 'Remove from all inboxes', 'Feedback to user', 'Metrics for client report'])}
<p>This loop is one of the highest-volume manual workloads in any MSSP, and one of the best candidates for AI-assisted triage.</p>
${H.note('j2', '<p>Ask how user-reported phishing is handled today: who reviews reports, how long it takes, and how many are actually malicious. The ratio of real phish to "reported newsletters" tells you how much automation can save.</p>')}
`,
      takeaways: ['SEG filters at the edge; API-based tools inspect in the mailbox and can remediate after delivery.', 'Mimecast (gateway, archive, training) and IRONSCALES (API, AI + crowdsourced) complement each other.', 'User-reported phishing is a top automation target.'],
      practice: ['Read the J2 pages for Mimecast and IRONSCALES. Write down which threats each is best at.'],
      links: [['J2: IRONSCALES', 'https://j2mssp.com/ironscales/'], ['J2: Mimecast', 'https://j2mssp.com/mimecast/'], ['J2: Email services', 'https://j2mssp.com/email-services/']]
    },
    {
      id: 'l2', title: 'Insider risk and DLP with DTEX', mins: 12,
      summary: 'Detecting risky human behaviour without turning the workplace into surveillance.',
      body: `
<p>Insider risk management looks for behaviour that signals data theft, negligence or a compromised account: bulk file copies before a resignation, uploads to personal cloud storage, unusual access to sensitive folders, attempts to bypass controls.</p>
<h3>Traditional DLP vs behavioural insider risk</h3>
${H.table(['Traditional DLP', 'Behavioural insider risk (DTEX style)'], [
  ['Content rules ("block files containing ID numbers")', 'Patterns of behaviour over time (sequence and context)'],
  ['Many false positives, blocks legitimate work', 'Risk scoring, focuses analysts on genuinely unusual activity'],
  ['Little context on intent', 'Timeline of what happened before and after']
])}
<p>DTEX collects lightweight endpoint telemetry about user activity and emphasises privacy by design, for example pseudonymising user identities until an investigation is justified.</p>
<h3>Why this is sensitive</h3>
<ul>
  <li>Insider investigations involve HR, legal and employment law. Process and evidence handling matter as much as detection.</li>
  <li>Privacy law (POPIA, GDPR) applies to employee monitoring. Purpose, proportionality and transparency are required.</li>
  <li>Any automation here (for example LLM case summaries) must keep data minimal and access tightly controlled.</li>
</ul>
${H.note('verify', '<p>Who at J2 handles insider-risk cases, and what is the escalation path to the client\'s HR and legal teams?</p>')}
`,
      takeaways: ['Insider risk looks at behaviour over time, not just content rules.', 'DTEX emphasises lightweight telemetry and privacy (pseudonymisation).', 'Insider cases touch HR, legal and privacy law; automate with extra care.'],
      practice: ['List five behavioural signals that might precede data theft by a departing employee.'],
      links: [['DTEX Systems', 'https://www.dtexsystems.com/']]
    },
    {
      id: 'l3', title: 'Endpoint: EPP, EDR, XDR', mins: 10,
      summary: 'From antivirus to full endpoint telemetry and response.',
      body: `
${H.table(['Layer', 'What it adds'], [
  ['EPP (endpoint protection platform)', 'Prevention: next-gen antivirus, exploit protection, device control'],
  ['EDR (endpoint detection &amp; response)', 'Records process, file, network and registry activity; detects behaviour; lets responders isolate, kill processes and collect evidence'],
  ['XDR (extended detection &amp; response)', 'Correlates endpoint with identity, email, cloud and network signals into single incidents'],
  ['MDR', 'People who watch the EDR/XDR 24/7 and act, which is the managed service J2 provides']
])}
<h3>Terms you will hear</h3>
<dl>
  <dt>Isolation</dt><dd>Network-quarantining a device while keeping the EDR connection alive.</dd>
  <dt>Process tree</dt><dd>Which process launched which. <code>winword.exe → powershell.exe → rundll32.exe</code> is a classic malicious chain.</dd>
  <dt>LOLBins</dt><dd>"Living off the land" binaries: legitimate Windows tools (PowerShell, certutil, rundll32) abused by attackers to avoid detection.</dd>
  <dt>Coverage</dt><dd>Share of the client's devices with a healthy, reporting agent. Unmonitored devices are blind spots, and a reconciliation opportunity for you.</dd>
</dl>
${H.note('tip', '<p>Agent coverage vs asset inventory vs billed endpoints is a three-way reconciliation. It finds security blind spots and revenue leakage at the same time.</p>')}
`,
      takeaways: ['EPP prevents, EDR sees and responds, XDR correlates across domains.', 'Know isolation, process trees and LOLBins.', 'Coverage reconciliation finds blind spots and billing gaps together.'],
      practice: ['Explain why winword.exe spawning powershell.exe is suspicious.'],
      links: [['MITRE ATT&CK: Command and Scripting Interpreter (T1059)', 'https://attack.mitre.org/techniques/T1059/']]
    },
    {
      id: 'l4', title: 'Encryption, backup and ransomware recovery', mins: 12,
      summary: 'Protecting data when everything else fails.',
      body: `
<h3>Encryption basics</h3>
<ul>
  <li><strong>At rest</strong>: disk (BitLocker, FileVault), file or database encryption. Protects lost devices and stolen storage.</li>
  <li><strong>In transit</strong>: TLS. Protects data moving across networks.</li>
  <li><strong>Key management</strong> is the hard part: who holds keys, how they are rotated and recovered. Lose the key and you lose the data.</li>
</ul>
<p>A managed encryption service handles policy, key escrow, recovery requests and coverage reporting so the client does not have to.</p>
<h3>Backup for the ransomware era: 3-2-1-1-0</h3>
${H.table(['Digit', 'Rule'], [
  ['3', 'Three copies of your data'],
  ['2', 'On two different media or storage types'],
  ['1', 'One copy off-site'],
  ['1', 'One copy offline, air-gapped or immutable (cannot be changed or deleted, even by an admin)'],
  ['0', 'Zero errors, verified by restore testing']
])}
<dl>
  <dt>RPO (recovery point objective)</dt><dd>How much data you can afford to lose, measured in time since the last good backup.</dd>
  <dt>RTO (recovery time objective)</dt><dd>How long you can afford to be down.</dd>
</dl>
${H.note('warn', '<p>Attackers target backups first. A backup that an attacker with domain admin rights can delete is not ransomware protection.</p>')}
${H.note('tip', '<p>Failed backup jobs that nobody notices are a common silent risk. An automation that turns failures into tickets, and restore tests into evidence for client reports, is simple and valuable.</p>')}
`,
      takeaways: ['Encryption at rest and in transit; key management is the hard part.', '3-2-1-1-0: include an immutable copy and verified restores.', 'RPO = acceptable data loss; RTO = acceptable downtime.'],
      practice: ['Define RPO and RTO for a small accounting firm during tax season. Justify the numbers.'],
      links: [['J2: Managed data encryption', 'https://j2mssp.com/managed-data-encryption/'], ['NCSC: Offline backups in an online world', 'https://www.ncsc.gov.uk/blog-post/offline-backups-in-an-online-world']]
    },
    {
      id: 'l5', title: 'Deception technology', mins: 10,
      summary: 'Honeypots, honeytokens and tripwires that attackers cannot resist.',
      body: `
<p>Deception places fake assets inside a network: servers, credentials, file shares, documents. Real users have no reason to touch them. Attackers exploring the network often do.</p>
${H.table(['Type', 'Example', 'What triggers it'], [
  ['Honeypot', 'A fake file server named FINANCE-BACKUP-02', 'Any connection or login attempt'],
  ['Honeytoken / canary credential', 'A fake admin account planted in memory or a config file', 'Any use of that credential'],
  ['Canary file', 'A document called "Salaries 2026.xlsx"', 'Opening it calls home'],
  ['Canary DNS / URL token', 'A unique hostname embedded in a config', 'A DNS lookup of that name']
])}
<h3>Why the SOC loves deception</h3>
<ul>
  <li><strong>Very low false positives.</strong> Interaction with a decoy is almost always worth investigating.</li>
  <li><strong>Catches lateral movement and discovery</strong>, the middle of the attack that other tools often miss.</li>
  <li><strong>Cheap to monitor</strong>, and a strong candidate for fast-path automation: auto-create a P1, enrich the source host, and page the on-call analyst immediately.</li>
</ul>
${H.note('j2', '<p>J2 lists network deception (honeypots) among its services. It is a great story for resilience: "we will know the moment someone starts poking around, day or night."</p>')}
`,
      takeaways: ['Decoys have no legitimate use, so touching one is a strong signal.', 'Deception catches discovery and lateral movement.', 'High-confidence alerts suit fast-path automation.'],
      practice: ['Create a free Canarytoken (canarytokens.org) for a test document on your own machine and watch the alert arrive.'],
      links: [['Canarytokens (free)', 'https://canarytokens.org/'], ['MITRE Engage (adversary engagement framework)', 'https://engage.mitre.org/']]
    }
  ],
  quiz: [
    { q: 'Which email security approach can remove a phishing email from every mailbox after delivery?', options: ['Only SPF records', 'API-based integrated email security', 'A firewall rule', 'DNS caching'], answer: 1, why: 'API-based tools connect to mailboxes and can remediate in place after delivery.' },
    { q: 'In 3-2-1-1-0, the second "1" stands for…', options: ['One admin', 'One offline, air-gapped or immutable copy', 'One restore per year', 'One cloud provider'], answer: 1, why: 'An immutable or offline copy survives an attacker with admin rights.' },
    { q: 'Why are deception alerts good candidates for fast-path automation?', options: ['They are noisy', 'They have very low false-positive rates', 'They never involve attackers', 'They are only informational'], answer: 1, why: 'Legitimate users have no reason to touch decoys.' },
    { q: 'What does EDR add beyond classic antivirus?', options: ['Email filtering', 'Detailed endpoint telemetry and response actions such as isolation', 'DMARC reporting', 'Payroll integration'], answer: 1, why: 'EDR records behaviour and lets responders act.' },
    { q: 'Behavioural insider-risk tools differ from classic DLP mainly by…', options: ['Only scanning file contents', 'Analysing sequences of user behaviour in context', 'Blocking all USB devices', 'Replacing HR'], answer: 1, why: 'They look at patterns over time, reducing noise and adding intent context.' },
    { q: 'RTO measures…', options: ['Acceptable data loss', 'Acceptable downtime before recovery', 'Encryption strength', 'Email delivery time'], answer: 1, why: 'Recovery time objective = how long you can be down.' }
  ]
});
})(window.H);
