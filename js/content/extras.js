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
  { id: 'u1', area: 'users', w: 3, q: 'Does every user, including managers, have MFA switched on?', action: 'Turn on MFA for everyone (J2: Multi-Factor Authentication).' },
  { id: 'u2', area: 'users', w: 2, q: 'Do staff get regular training on spotting phishing?', action: 'Start regular awareness training (J2: User Awareness Training).' },
  { id: 'u3', area: 'users', w: 2, q: 'Do staff use strong, different passwords stored in a password manager?', action: 'Roll out a password manager and rules (J2: Password Management).' },
  { id: 'u4', area: 'users', w: 2, q: 'Would you notice if an employee copied lots of data before leaving?', action: 'Add visibility into user behaviour (J2: User Activity Monitoring, Human Risk Management).' },
  { id: 'e1', area: 'email', w: 3, q: 'Is email filtered for phishing and fraud beyond the basic default?', action: 'Add advanced email security (J2: Advanced Email Security).' },
  { id: 'e2', area: 'email', w: 3, q: 'Is someone watching your Microsoft 365 for account takeover, 24/7?', action: 'Add 24/7 monitoring (J2: Advanced Microsoft 365 Security Monitoring).' },
  { id: 'e3', area: 'email', w: 2, q: 'Is your email domain protected against impersonation (DMARC)?', action: 'Set up and manage DMARC (J2: Domain Impersonation & DMARC Compliance).' },
  { id: 'e4', area: 'email', w: 1, q: 'Would email keep working, and stay searchable, if your provider went down?', action: 'Add continuity and archiving (J2: Enhanced Compliance & Business Continuity).' },
  { id: 'd1', area: 'data', w: 3, q: 'Do you have backups that attackers cannot delete, and have you tested a restore recently?', action: 'Fix backups and test restores (J2: Backup and Restoration).' },
  { id: 'd2', area: 'data', w: 2, q: 'Is sensitive data encrypted?', action: 'Encrypt sensitive data (J2: Managed Data Encryption).' },
  { id: 'd3', area: 'data', w: 2, q: 'Would you know if sensitive data was leaving the business?', action: 'Add behavioural data loss prevention (J2: Behavioural DLP).' },
  { id: 'd4', area: 'data', w: 1, q: 'Are old drives and devices wiped securely before disposal?', action: 'Use secure destruction (J2: Secure Data Destruction).' },
  { id: 'm1', area: 'machines', w: 3, q: 'Are all devices protected and monitored 24/7 by people who can act?', action: 'Add endpoint protection with MDR (J2: Endpoint Protection with MDR).' },
  { id: 'm2', area: 'machines', w: 3, q: 'Are updates and patches installed quickly on every device, even remote ones?', action: 'Automate patching (J2: Proactive Patch Management).' },
  { id: 'm3', area: 'machines', w: 2, q: 'Are laptops fully encrypted, with MFA to unlock them?', action: 'Encrypt devices and add device MFA (J2: Advanced Encryption and Access Control).' },
  { id: 'm4', area: 'machines', w: 2, q: 'Do you have a full list of every device connected to your business?', action: 'Get visibility of every device, then monitor them (J2: Intelligent Usage Analytics).' },
  { id: 'i1', area: 'internet', w: 3, q: 'Has anyone checked how an attacker would get in from the internet?', action: 'Run a risk assessment (J2: Cyber Risk Assessments).' },
  { id: 'i2', area: 'internet', w: 2, q: 'Are staff blocked from dangerous websites?', action: 'Add web protection (J2: Secure Web Usage & Threat Protection).' },
  { id: 'i3', area: 'internet', w: 2, q: 'Is remote access checked every time (zero trust), not just with a basic VPN?', action: 'Move to zero trust (J2: Zero-Trust Network and Internet Access).' },
  { id: 'i4', area: 'internet', w: 2, q: 'Would you detect an attacker exploring your network?', action: 'Add network deception (honeypots) and monitoring.' }
];

COURSE.questions = [
  { who: 'Your manager', items: [
    'What does a great first month look like for me?',
    'Which of the five areas matters most to the business right now?',
    'Who are the key people I should meet in my first two weeks?',
    'How do the South Africa and UK sides of the business work together?'
  ]},
  { who: 'Sales and account managers', items: [
    'Who is a typical J2 client? Which industries and company sizes?',
    'Which services do most clients start with, and what do they add next?',
    'How does the Cyber Resilience Scorecard turn into a sale?',
    'Why do clients choose J2 over competitors?',
    'Why do clients leave, when they do?'
  ]},
  { who: 'SOC and technical team', items: [
    'What do the busiest alerts or incidents look like?',
    'Which partner tools do you use most day to day?',
    'What does onboarding a new client involve?',
    'What goes into the reports clients receive?'
  ]},
  { who: 'Anyone', items: [
    'What do you wish you had known in your first week here?',
    'Which words or acronyms do people use here that outsiders don\'t know?',
    'Where can I read about past client incidents or case studies?'
  ]}
];
})();
