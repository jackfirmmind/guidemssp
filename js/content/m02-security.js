(function (H) {
COURSE.modules.push({
  id: 'm2', code: 'SF', title: 'Security foundations', tag: 'Core knowledge',
  summary: 'The vocabulary and mental models every SOC conversation assumes you already have.',
  lessons: [
    {
      id: 'l1', title: 'Risk, the CIA triad and controls', mins: 12,
      summary: 'Confidentiality, integrity, availability; risk as likelihood × impact; and the types of control that reduce it.',
      body: `
<h3>The CIA triad</h3>
${H.table(['Property', 'Means', 'Broken by'], [
  ['Confidentiality', 'Only authorised people see the data', 'Data leak, stolen credentials, insider exfiltration'],
  ['Integrity', 'Data and systems are not altered without authorisation', 'Tampered invoice bank details, malware modifying files'],
  ['Availability', 'Systems and data are there when needed', 'Ransomware, DDoS, failed backups']
])}
<p>Ransomware is the modern classic because it hits all three: data is stolen (confidentiality), encrypted (availability) and sometimes altered (integrity).</p>
<h3>Risk vocabulary</h3>
<dl>
  <dt>Asset</dt><dd>Anything of value: data, systems, people, reputation.</dd>
  <dt>Threat</dt><dd>Something that could cause harm: a ransomware gang, a careless employee, a flood.</dd>
  <dt>Vulnerability</dt><dd>A weakness a threat can exploit: an unpatched server, no MFA, an over-trusting finance clerk.</dd>
  <dt>Risk</dt><dd>Likelihood that a threat exploits a vulnerability × the impact if it does.</dd>
</dl>
<h3>Control types</h3>
${H.table(['By function', 'Example'], [
  ['Preventive', 'MFA, email filtering, patching'],
  ['Detective', 'SIEM alerts, honeypots, DLP monitoring'],
  ['Corrective / responsive', 'Isolating a device, resetting credentials, restoring backups'],
  ['Deterrent', 'Acceptable-use warnings, visible monitoring notices']
])}
<p>Controls can also be classed by nature: <strong>administrative</strong> (policies, training), <strong>technical</strong> (software, configuration) and <strong>physical</strong> (locks, badges). Good security layers several of each: <em>defence in depth</em>.</p>
${H.note('j2', '<p>J2\'s resilience model deliberately invests in detective and corrective controls, because preventive controls alone eventually fail.</p>')}
`,
      takeaways: ['CIA: confidentiality, integrity, availability.', 'Risk = likelihood × impact.', 'Layer preventive, detective and corrective controls (defence in depth).'],
      practice: ['Pick one J2 service and classify it: which CIA property does it protect, and is it preventive, detective or corrective?'],
      links: [['NIST glossary', 'https://csrc.nist.gov/glossary']]
    },
    {
      id: 'l2', title: 'How attacks unfold: kill chain and ATT&CK', mins: 15,
      summary: 'Two models the SOC uses to describe where an attacker is and what they will do next.',
      body: `
<h3>The Cyber Kill Chain (Lockheed Martin)</h3>
${H.flow(['Reconnaissance', 'Weaponisation', 'Delivery', 'Exploitation', 'Installation', 'Command &amp; control', 'Actions on objectives'])}
<p>The kill chain is useful for explaining an attack story to a client: the earlier in the chain you break it, the cheaper the incident.</p>
<h3>MITRE ATT&amp;CK</h3>
<p>ATT&amp;CK is a public knowledge base of real attacker behaviour, organised as <strong>tactics</strong> (the attacker's goal at a step) and <strong>techniques</strong> (how they achieve it, with IDs such as <code>T1566</code> Phishing). The Enterprise matrix has 14 tactics:</p>
${H.table(['#', 'Tactic', 'Attacker goal'], [
  ['1', 'Reconnaissance', 'Gather information to plan the attack'],
  ['2', 'Resource Development', 'Set up infrastructure, accounts, tools'],
  ['3', 'Initial Access', 'Get in (phishing, exposed services, stolen credentials)'],
  ['4', 'Execution', 'Run malicious code'],
  ['5', 'Persistence', 'Keep access across reboots and password changes'],
  ['6', 'Privilege Escalation', 'Gain higher permissions'],
  ['7', 'Defense Evasion', 'Avoid being detected'],
  ['8', 'Credential Access', 'Steal account names and passwords or tokens'],
  ['9', 'Discovery', 'Learn the environment'],
  ['10', 'Lateral Movement', 'Move to other systems'],
  ['11', 'Collection', 'Gather the data they want'],
  ['12', 'Command and Control', 'Communicate with compromised systems'],
  ['13', 'Exfiltration', 'Steal the data out'],
  ['14', 'Impact', 'Disrupt, encrypt, destroy (for example ransomware)']
])}
<h3>Why ATT&amp;CK matters for automation</h3>
<ul>
  <li>Detections and alerts are usually tagged with ATT&amp;CK technique IDs. That tag is structured data you can route and report on.</li>
  <li>Coverage heatmaps ("which techniques can we detect?") are a common MSSP report. They are ideal to automate.</li>
  <li>An LLM summary of an incident is far more useful when it maps each step to a tactic.</li>
</ul>
`,
      takeaways: ['Kill chain: a linear attack story for explaining incidents.', 'ATT&CK: 14 tactics, hundreds of techniques with IDs like T1566.', 'ATT&CK tags are structured data you can route, report and summarise on.'],
      practice: ['Open the ATT&CK site, find T1566 (Phishing) and T1078 (Valid Accounts). Write one sentence each on how J2\'s email and M365 monitoring would detect them.'],
      links: [['MITRE ATT&CK Enterprise matrix', 'https://attack.mitre.org/matrices/enterprise/'], ['Lockheed Martin Cyber Kill Chain', 'https://www.lockheedmartin.com/en-us/capabilities/cyber/cyber-kill-chain.html']]
    },
    {
      id: 'l3', title: 'The threats J2 clients actually face', mins: 15,
      summary: 'Phishing, business email compromise, ransomware, account takeover and insider threat.',
      body: `
<dl>
  <dt>Phishing</dt><dd>Deceptive messages that trick people into clicking, entering credentials or opening malware. Still the most common initial access route.</dd>
  <dt>Business Email Compromise (BEC)</dt><dd>Fraud via email with no malware at all: a spoofed or compromised supplier account asks finance to "update our bank details". Often the costliest email threat because the money is gone.</dd>
  <dt>Account takeover (ATO)</dt><dd>An attacker signs in as a real user (phished password, MFA fatigue, stolen session token). In Microsoft 365 they then create inbox rules to hide replies, read mail and launch internal phishing.</dd>
  <dt>Ransomware</dt><dd>Encrypts systems and demands payment. Modern groups use <strong>double extortion</strong>: steal data first, then threaten to publish it. Often sold as Ransomware-as-a-Service (RaaS) to affiliates.</dd>
  <dt>Insider threat</dt><dd>Malicious (an employee stealing client lists before resigning), negligent (uploading sensitive files to a personal drive) or compromised (their account is controlled by an attacker).</dd>
  <dt>Supply chain</dt><dd>Attacking a trusted supplier to reach its customers. MSPs and MSSPs are prime targets because one compromise gives access to many clients.</dd>
</dl>
${H.note('warn', '<p><strong>MSSPs are targets.</strong> Your automations will hold API keys to many client tenants. A leaked token in a script or log is a supply chain incident waiting to happen. Treat every credential as if it could open 700 doors.</p>')}
<h3>A typical M365 account takeover</h3>
${H.flow(['Phishing email with fake login page', 'Password + MFA token captured (adversary-in-the-middle)', 'Sign-in from unusual location', 'Inbox rule hides replies', 'Internal phishing / BEC payment fraud'])}
<p>Each arrow is a detection opportunity: suspicious sign-in, impossible travel, new inbox rule with "delete" or "move to RSS Feeds", mass outbound mail. The SOC watches for all of these.</p>
`,
      takeaways: ['Phishing is the main way in; BEC is often the costliest outcome.', 'M365 account takeover leaves clues: risky sign-ins, new inbox rules, unusual mail volume.', 'MSSPs are supply-chain targets, so your automation credentials are crown jewels.'],
      practice: ['Search for a recent public BEC or ransomware case in South Africa or the UK. Map it to the kill chain and to three ATT&CK tactics.'],
      links: [['CISA: Ransomware guide', 'https://www.cisa.gov/stopransomware'], ['NCSC (UK): Phishing guidance', 'https://www.ncsc.gov.uk/guidance/phishing']]
    },
    {
      id: 'l4', title: 'Identity is the new perimeter', mins: 12,
      summary: 'MFA, conditional access and zero trust, and why most incidents now start with an identity.',
      body: `
<p>When everyone works from anywhere and data lives in Microsoft 365 and other SaaS, the office firewall no longer defines "inside". The thing that grants access is an <strong>identity</strong>: a user, a device or a service account.</p>
<h3>Zero trust in three lines (Microsoft's formulation)</h3>
<ol>
  <li><strong>Verify explicitly</strong>: authenticate and authorise on every request using all signals (user, device, location, risk).</li>
  <li><strong>Use least privilege</strong>: just-enough and just-in-time access.</li>
  <li><strong>Assume breach</strong>: segment, encrypt and monitor as if an attacker is already inside. This is the resilience mindset again.</li>
</ol>
<h3>Controls you will hear about daily</h3>
${H.table(['Control', 'What it does', 'Weakness to know'], [
  ['MFA', 'Second factor beyond a password', 'SMS and push approvals can be phished or fatigued; prefer phishing-resistant methods (FIDO2, passkeys)'],
  ['Conditional Access (Entra ID)', 'Policies such as "block legacy auth" or "require compliant device"', 'Gaps and exclusions are common; service accounts often exempted'],
  ['Privileged Identity Management', 'Time-bound admin rights', 'Standing admin accounts remain a top risk'],
  ['Identity Protection / risky sign-ins', 'Scores sign-ins and users for risk', 'Needs someone watching the alerts 24/7, which is the SOC']
])}
${H.note('j2', '<p>Account takeover in M365 is a headline J2 use case. Expect many SOC alerts to be identity-based: risky sign-ins, impossible travel, MFA changes, suspicious inbox rules and OAuth consent grants.</p>')}
${H.note('tip', '<p>Your own automations are identities too. Every workflow should run as a dedicated service principal with the smallest set of permissions, not as your personal admin account.</p>')}
`,
      takeaways: ['Identity, not the network edge, is the main control point.', 'Zero trust: verify explicitly, least privilege, assume breach.', 'Automations are identities and need least privilege too.'],
      practice: ['Read Microsoft\'s zero trust overview. Write down which of the three principles the SOC most directly supports.'],
      links: [['Microsoft: Zero Trust overview', 'https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview'], ['Microsoft Entra Conditional Access', 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/overview']]
    },
    {
      id: 'l5', title: 'Email authentication: SPF, DKIM, DMARC', mins: 15,
      summary: 'How receiving servers decide whether an email really came from the domain it claims.',
      body: `
<p>Email was designed without authentication. Three DNS-based standards bolt it on. You will read their results in email headers constantly.</p>
${H.table(['Standard', 'Question it answers', 'Lives in', 'Header result'], [
  ['SPF', 'Is this sending server allowed to send for the envelope domain?', 'TXT record: <code>v=spf1 include:... -all</code>', '<code>spf=pass</code> / <code>fail</code> / <code>softfail</code>'],
  ['DKIM', 'Was the message signed by the domain and left unaltered?', 'Public key in DNS at <code>selector._domainkey.domain</code>', '<code>dkim=pass header.d=example.com</code>'],
  ['DMARC', 'Do SPF or DKIM pass <em>and align</em> with the visible From domain? What should I do if not?', 'TXT at <code>_dmarc.domain</code>: <code>p=none|quarantine|reject</code>', '<code>dmarc=pass action=none</code>']
])}
<h3>The idea that trips people up: alignment</h3>
<p>SPF checks the hidden envelope sender (Return-Path), not the From address the user sees. DKIM checks the signing domain (<code>d=</code>). DMARC is the glue: it passes only if SPF or DKIM passes <strong>for the same domain as the visible From</strong>. Without DMARC at <code>p=reject</code>, anyone can put your client's domain in the From line.</p>
${H.code(`
Authentication-Results: mx.google.com;
  dkim=pass header.i=@supplier.co.za header.s=s1 header.b=abc123;
  spf=pass (google.com: domain of bounce@mailer.supplier.co.za designates 203.0.113.25 as permitted sender) smtp.mailfrom=mailer.supplier.co.za;
  dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=supplier.co.za
`, 'header')}
<h3>What authentication does not tell you</h3>
<ul>
  <li>A lookalike domain (<code>supp1ier.co.za</code>) can pass SPF, DKIM and DMARC perfectly, because it is the attacker's own domain.</li>
  <li>A genuinely compromised supplier mailbox passes everything. That is why BEC is hard and why behavioural tools like IRONSCALES matter.</li>
</ul>
${H.note('j2', '<p>Checking a client\'s DMARC policy is a quick, automatable scorecard signal. A script can look up <code>_dmarc</code> for every client domain and flag anything at <code>p=none</code>.</p>')}
`,
      takeaways: ['SPF = allowed sending IPs; DKIM = cryptographic signature; DMARC = alignment + policy.', 'DMARC p=reject is the goal for any domain you protect.', 'Passing authentication does not mean safe: lookalikes and compromised accounts pass too.'],
      practice: ['Look up the DMARC record for three company domains you know: run nslookup -type=TXT _dmarc.example.com (or use an online DNS lookup). Record the policy.', 'Do the "Read a suspicious email header" lab.'],
      links: [['DMARC.org overview', 'https://dmarc.org/overview/'], ['NCSC: Email security and anti-spoofing', 'https://www.ncsc.gov.uk/collection/email-security-and-anti-spoofing']]
    }
  ],
  quiz: [
    { q: 'Ransomware with double extortion primarily violates which CIA properties?', options: ['Integrity only', 'Availability only', 'Availability and confidentiality', 'None, it is a financial crime'], answer: 2, why: 'Encryption removes availability; stealing and threatening to leak data breaks confidentiality.' },
    { q: 'In MITRE ATT&CK, what is "Lateral Movement"?', options: ['A technique ID', 'A tactic: moving from one system to others', 'A type of phishing', 'A backup strategy'], answer: 1, why: 'It is one of the 14 Enterprise tactics, the attacker goal of moving through the environment.' },
    { q: 'An email from "ceo@yourclient.com" passes SPF for mailer-xyz.net but DMARC fails. Why?', options: ['DKIM was missing', 'SPF passed for a domain that does not align with the visible From domain', 'The email was too large', 'DMARC only checks attachments'], answer: 1, why: 'DMARC requires SPF or DKIM to pass for a domain aligned with the header From.' },
    { q: 'Which BEC scenario would pass SPF, DKIM and DMARC?', options: ['A spoofed From address using the client\'s exact domain with p=reject', 'An email sent from a genuinely compromised supplier mailbox', 'An email from an IP not in the SPF record', 'None; BEC always fails authentication'], answer: 1, why: 'A real, compromised account sends legitimately authenticated mail. Detection must rely on behaviour and content.' },
    { q: 'Which is a zero trust principle?', options: ['Trust the internal network', 'Assume breach', 'Grant admin to speed things up', 'Disable logging for performance'], answer: 1, why: 'Verify explicitly, use least privilege, assume breach.' },
    { q: 'A new inbox rule that moves all mail containing "invoice" to the RSS Feeds folder most likely indicates…', options: ['A tidy user', 'Account takeover hiding fraud-related replies', 'A DMARC failure', 'Backup activity'], answer: 1, why: 'Attackers use inbox rules to hide replies from the real user during BEC.' }
  ]
});
})(window.H);
