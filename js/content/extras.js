(function () {
/* Practice scorecard: five areas x four questions. Written for learning; not J2's actual questionnaire. */
COURSE.scorecardAreas = [
  { id: 'users', name: 'Users' },
  { id: 'email', name: 'Email' },
  { id: 'data', name: 'Data' },
  { id: 'machines', name: 'Machines' },
  { id: 'internet', name: 'Internet' }
];
COURSE.scorecard = [
  { id: 'u1', area: 'users', w: 3, q: 'Is MFA enforced for every user, including admins and remote access?', action: 'Enforce MFA for all users via Conditional Access; move admins to phishing-resistant methods.' },
  { id: 'u2', area: 'users', w: 2, q: 'Do staff receive regular phishing awareness training and simulations?', action: 'Run quarterly phishing simulations with short, targeted training for clickers.' },
  { id: 'u3', area: 'users', w: 3, q: 'Are admin rights limited, time-bound and reviewed?', action: 'Remove standing admin rights; introduce just-in-time elevation and quarterly access reviews.' },
  { id: 'u4', area: 'users', w: 2, q: 'Would you detect an employee copying large volumes of data before leaving?', action: 'Deploy insider-risk monitoring (e.g. DTEX) with an agreed HR escalation process.' },
  { id: 'e1', area: 'email', w: 3, q: 'Is inbound email filtered for phishing, malware and impersonation beyond the default?', action: 'Add advanced email security (gateway and/or API-based) with impersonation protection.' },
  { id: 'e2', area: 'email', w: 2, q: 'Are your domains protected with SPF, DKIM and DMARC at p=reject?', action: 'Publish SPF and DKIM, then move DMARC from p=none to p=reject with monitoring.' },
  { id: 'e3', area: 'email', w: 2, q: 'Can users report suspicious email in one click, and is every report reviewed quickly?', action: 'Deploy a report button with 24/7 triage and automated removal of confirmed phish.' },
  { id: 'e4', area: 'email', w: 3, q: 'Do payment-detail changes require verification outside email?', action: 'Mandate call-back verification on a known number for any bank detail change.' },
  { id: 'd1', area: 'data', w: 3, q: 'Do you have immutable or offline backups, restore-tested in the last 90 days?', action: 'Add an immutable backup copy and schedule quarterly restore tests with evidence.' },
  { id: 'd2', area: 'data', w: 2, q: 'Are laptops and sensitive files encrypted, with keys managed centrally?', action: 'Enforce disk encryption and managed key escrow; report coverage monthly.' },
  { id: 'd3', area: 'data', w: 2, q: 'Do you know where your sensitive and personal data lives?', action: 'Run a data discovery exercise and classify key repositories (POPIA/GDPR records).' },
  { id: 'd4', area: 'data', w: 2, q: 'Is there a tested incident response plan including breach notification?', action: 'Write and tabletop-test an IR plan covering Regulator/ICO notification timelines.' },
  { id: 'm1', area: 'machines', w: 3, q: 'Does every endpoint and server run EDR that is monitored 24/7?', action: 'Deploy EDR to all devices and connect it to a 24/7 monitored SOC.' },
  { id: 'm2', area: 'machines', w: 3, q: 'Are critical security patches applied within 14 days?', action: 'Automate patching with compliance reporting; target 14 days for critical patches.' },
  { id: 'm3', area: 'machines', w: 2, q: 'Is there an accurate, current inventory of devices?', action: 'Reconcile inventory against EDR and directory data monthly; investigate gaps.' },
  { id: 'm4', area: 'machines', w: 2, q: 'Are unsupported (end-of-life) systems removed or isolated?', action: 'Identify end-of-life systems; replace, or segment and monitor closely.' },
  { id: 'i1', area: 'internet', w: 3, q: 'Is anyone watching for threats at night, weekends and holidays?', action: 'Move to 24/7 SOC monitoring; attackers favour off-hours.' },
  { id: 'i2', area: 'internet', w: 2, q: 'Do you know which of your systems are exposed to the internet?', action: 'Run external attack surface scans and close unnecessary exposure (RDP, admin panels).' },
  { id: 'i3', area: 'internet', w: 2, q: 'Would you detect an attacker moving laterally inside your network?', action: 'Deploy deception (honeypots/honeytokens) and internal traffic monitoring.' },
  { id: 'i4', area: 'internet', w: 2, q: 'Is web traffic filtered for malicious and newly registered domains?', action: 'Enable DNS/web filtering that blocks malicious and newly registered domains.' }
];

COURSE.plan = [
  { phase: 'before', title: 'Before day one', items: [
    ['Finish modules 1–4 (company, security, business, SOC)', 'Gives you the vocabulary for every first-week conversation'],
    ['Complete all labs once', 'Hands-on familiarity beats reading'],
    ['Start Microsoft SC-200 learning path', 'J2 emphasises Microsoft 365 monitoring'],
    ['Draft your 30-60-90 one-pager and bring it to your first 1:1', 'Shows initiative; invites correction early'],
    ['Prepare your day-one question list', 'See the Day-one questions page'],
    ['Set up a personal lab: M365 trial/dev tenant, Python, git, n8n or Power Automate', 'Somewhere safe to experiment from week one']
  ]},
  { phase: 'd30', title: 'Days 1–30: learn and map', items: [
    ['Meet every stakeholder on the map', 'SOC, finance, sales, IT, compliance, leadership'],
    ['Shadow at least two SOC shifts, including one night or weekend', 'Real friction is only visible on shift'],
    ['Build the systems inventory (system, owner, data, API, syncs)', 'Your integration map'],
    ['Keep a friction log and score it with the Automation scorer', 'Evidence-based backlog'],
    ['Learn the approval path for new integrations and AI data flows', 'Avoid surprises with security and legal'],
    ['Capture baselines (MTTA/MTTR, triage minutes, billing hours)', 'Needed to prove value later'],
    ['Ship one small, low-risk quick win', 'Earns trust early']
  ]},
  { phase: 'd60', title: 'Days 31–60: first wins', items: [
    ['Agree your top 3 priorities with your manager', 'Alignment beats velocity'],
    ['Set automation standards: git, vault, logging, naming, runbook template', 'Foundations prevent sprawl'],
    ['Ship an alert enrichment pack or handover summary', 'Visible daily value to analysts'],
    ['Build licence/seat reconciliation v1', 'Finds revenue leakage; forces customer ID mapping'],
    ['Scope the flagship (e.g. phishing triage copilot) with a golden dataset', 'Evaluation before build'],
    ['Send your first monthly value one-pager', 'Hours saved, money recovered, next steps']
  ]},
  { phase: 'd90', title: 'Days 61–90: scale', items: [
    ['Run the flagship in shadow mode and report agreement rates', 'Evidence for autonomy decisions'],
    ['Establish the shared customer ID across key systems', 'Unlocks reporting and integrations'],
    ['Automate one part of monthly client reporting', 'Supports renewals'],
    ['Hold a retrospective with the SOC on what helped and what did not', 'Keeps trust and direction'],
    ['Present a 6-month roadmap to leadership with measured results', 'Turns wins into a strategy']
  ]}
];

COURSE.questions = [
  { who: 'CTO / your manager', items: [
    'What does success look like for this role at 3, 6 and 12 months?',
    'Which one or two problems do you most want me to solve first?',
    'What automation or AI initiatives have been tried before, and what happened?',
    'What is the approval process for new tools, integrations and AI services?',
    'How will my work be measured and reported?'
  ]},
  { who: 'SOC manager and analysts', items: [
    'Which alert types create the most volume, and which the most wasted time?',
    'Walk me through the last alert you handled, step by step.',
    'What does shift handover look like today?',
    'Which SIEM, XDR, SOAR and ticketing tools do you use, and what do you wish they did?',
    'What automation already exists, and what do you not trust about it?',
    'What are the SLA targets, and when are they most at risk?'
  ]},
  { who: 'Finance and billing', items: [
    'How long does month-end billing take, and which steps are manual?',
    'How are licence and seat changes captured and invoiced?',
    'Where do billing errors or disputes usually come from?',
    'Which system is the source of truth for contracts and quantities?'
  ]},
  { who: 'Sales and account management', items: [
    'How is the Cyber Resilience Scorecard captured and followed up?',
    'What do clients ask for in reports that is hard to produce?',
    'How long does onboarding a new client take, and where does it stall?',
    'Which questionnaires or RFPs take the most time?'
  ]},
  { who: 'IT, security and compliance', items: [
    'What are the rules for sending client data to external or AI services?',
    'Where should secrets live, and how are service accounts managed?',
    'Is there a lab or test tenant I can use?',
    'What certifications does J2 hold, and what evidence do audits require?',
    'How do POPIA and UK GDPR obligations affect internal tooling?'
  ]}
];
})();
