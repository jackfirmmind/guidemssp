(function (H) {
/* The five J2 areas. Used by lessons, the cheat sheet and the scorecard. Service names are taken from J2's own service pages. */
COURSE.areas = [
  { id: 'users', name: 'Users', risk: 'People get tricked, or make mistakes.', quote: 'Every successful cyber attack usually requires a user.',
    services: ['User Activity Monitoring', 'User Awareness Training', 'Multi-Factor Authentication (MFA)', 'Human Risk Management', 'Password Management', 'Productivity Measurement'] },
  { id: 'email', name: 'Email', risk: 'Email is where most attacks start.', quote: 'Over 90% of all cyber-attacks start in email.',
    services: ['Advanced Email Security', 'J2 Advanced Microsoft 365 Security Monitoring', 'Domain Impersonation & DMARC Compliance', 'Enhanced Compliance & Business Continuity (email continuity and archiving)'] },
  { id: 'data', name: 'Data', risk: 'Criminals want to steal, lock or destroy it.', quote: 'Data is the lifeblood of every business.',
    services: ['Behavioural Data Loss Prevention', 'Managed Data Encryption', 'Backup and Restoration', 'Secure Data Destruction'] },
  { id: 'machines', name: 'Machines', risk: 'Every device is a possible way in.', quote: 'You cannot protect what you cannot see.',
    services: ['Endpoint Protection with Managed Detection and Response (MDR)', 'Proactive Patch Management', 'Advanced Encryption and Access Control', 'Intelligent Usage Analytics'] },
  { id: 'internet', name: 'Internet', risk: 'The internet connects criminals straight to the business.', quote: 'A secure internet means a secure business.',
    services: ['Cyber Risk Assessments', 'Secure Web Usage & Threat Protection', 'Zero-Trust Network and Internet Access'] }
];

COURSE.modules.push({
  id: 'm1', title: 'J2 in 20 minutes', short: 'Who J2 is, what they believe, and how they win customers.',
  lessons: [
    {
      id: 'l1', title: 'Who J2 is', mins: 6,
      tldr: 'J2 is a cyber security company. Other businesses pay J2 every month to protect them and to watch their systems 24 hours a day.',
      why: 'These are the basic facts. Knowing them means you can follow conversations from your first hour.',
      points: [
        'You will see two names: <strong>J2 Software</strong> and <strong>J2 MSSP</strong>. They are the same company.',
        'Started in <strong>2006</strong> in <strong>Honeydew</strong>, a suburb of Johannesburg, South Africa. Founded by John Mc Loughlin and Jason.',
        'Now serves <strong>700+ customers</strong> on <strong>5 continents</strong>.',
        'Two head offices: <strong>London (UK)</strong> and <strong>Johannesburg (South Africa)</strong>.',
        'Runs a <strong>24/7 Security Operations Centre (SOC)</strong>: a team of security specialists who watch customers\' systems day and night.'
      ],
      extra: H.table(['Fact', 'Detail'], [
        ['Founded', '2006, Honeydew (Johannesburg)'],
        ['Customers', '700+, on five continents'],
        ['Head offices', 'London and Johannesburg'],
        ['Core service', '24/7 managed cyber security, run from J2\'s own SOC'],
        ['Tagline', '"We keep your business in business."']
      ]),
      j2: 'J2 describes itself in one line: it provides <em>"practical cyber resilience solutions that protect their users, email, data and machines on the internet."</em>',
      say: 'J2 is a managed security provider. They run a 24/7 security operations centre and protect over 700 organisations across users, email, data, machines and the internet.',
      words: [['MSSP', 'Managed Security Service Provider. A company you pay monthly to run your cyber security for you.'], ['SOC', 'Security Operations Centre. The team (and room) that watches for attacks.']],
      check: { q: 'Where are J2\'s two head offices?', options: ['London and Johannesburg', 'Cape Town and Dublin', 'New York and Durban'], answer: 0, why: 'Dual head offices: London, UK and Johannesburg, South Africa.' }
    },
    {
      id: 'l2', title: 'What J2 believes: cyber resilience', mins: 7,
      tldr: 'J2 assumes some attacks will get through. So it focuses on spotting attacks fast and recovering well, not only on blocking them.',
      why: '"Cyber resilience" is J2\'s main idea. You will hear it in almost every meeting and read it on almost every page of their website.',
      points: [
        '<strong>Old approach:</strong> buy tools to block attacks and hope they work. This is prevention only.',
        '<strong>J2 approach:</strong> block what you can, <em>see</em> what gets through (visibility), and <em>act</em> quickly (response).',
        'Attackers like nights, weekends and public holidays. An attack at 2am on a Saturday is only stopped if someone is watching. That is why the SOC runs 24/7.',
        '<strong>Recovery</strong> matters too: backups and plans, so the business keeps running after an attack.',
        'Every service is <em>"tailored to your cyber resilience maturity level and compliance requirements."</em> In plain words: J2 checks how advanced a client\'s security already is, and which rules they must follow, then builds the service around that.'
      ],
      extra: H.flow(['Prevent', 'Detect', 'Respond', 'Recover']),
      j2: 'J2\'s promise to clients: <em>"We keep your business in business."</em> Resilience is about the business carrying on, not about having the most tools.',
      say: 'Cyber resilience means accepting that you can\'t stop every attack. So you make sure you see it quickly and recover without the business stopping.',
      words: [['Resilience', 'Being able to take a hit and keep going.'], ['Maturity level', 'How developed an organisation\'s security is, from basic to advanced.'], ['Visibility', 'Being able to see what is happening in your systems.']],
      check: { q: 'What does cyber resilience add on top of prevention?', options: ['More antivirus software', 'Seeing attacks quickly, responding, and recovering', 'Blocking all email'], answer: 1, why: 'Resilience adds detection, response and recovery to prevention.' }
    },
    {
      id: 'l3', title: 'How J2 wins customers', mins: 6,
      tldr: 'J2 starts with a quick check of a business (the Cyber Resilience Scorecard). The gaps it finds become a plan and then a proposal.',
      why: 'This is how new business starts. Knowing the journey helps you understand sales and marketing conversations.',
      points: [
        '<strong>Cyber Resilience Scorecard:</strong> 20 questions across the 5 areas (users, email, data, machines, internet).',
        'The results show where the business is weak. J2 turns this into a <strong>prioritised action plan</strong> (most important fixes first).',
        '<strong>Domain score test:</strong> J2\'s website lets a business test its email domain. It is a quick way to show a real risk.',
        '<strong>"Let\'s Talk"</strong> is the button on every service page. The next step is always a conversation, not an online shop.',
        'The <strong>Intelligence Hub</strong> (J2\'s blog) and social channels (LinkedIn, YouTube, Instagram, a WhatsApp community) build trust and bring in new contacts.'
      ],
      extra: H.flow(['Scorecard', 'Gaps found', 'Action plan', '"Let\'s Talk"', 'Proposal', 'Onboarding']),
      j2: 'You can try a practice version of the scorecard in this app. Open <a href="#scorecard">Practice scorecard</a> (bonus, about 10 minutes).',
      say: 'The scorecard shows a business its gaps in a few minutes. J2 then helps close those gaps in order of priority.',
      words: [['Lead', 'A possible new customer.'], ['Prioritised', 'Sorted so the most important things come first.']],
      check: { q: 'The Cyber Resilience Scorecard has…', options: ['20 questions across 5 areas', '100 questions across 3 areas', '5 questions across 20 areas'], answer: 0, why: '20 questions covering users, email, data, machines and internet.' }
    }
  ],
  quiz: [
    { q: 'When and where was J2 founded?', options: ['2006, Honeydew (Johannesburg)', '2016, London', '2006, Cape Town', '1999, Durban'], answer: 0, why: '2006 in Honeydew, a suburb of Johannesburg.' },
    { q: 'What is J2\'s tagline?', options: ['"Security made simple"', '"We keep your business in business"', '"Never get hacked"', '"Trust nobody"'], answer: 1, why: 'The line is on every page footer.' },
    { q: 'Which sentence best describes cyber resilience?', options: ['Blocking every possible attack', 'Seeing attacks fast, responding, and recovering so the business keeps running', 'Buying cyber insurance', 'Having a strong password'], answer: 1, why: 'Resilience = prevention plus detection, response and recovery.' },
    { q: 'What is the name of J2\'s 24/7 monitoring team?', options: ['The help desk', 'The SOC (Security Operations Centre)', 'The sales team', 'The finance team'], answer: 1, why: 'The SOC watches client systems day and night.' },
    { q: 'What does "tailored to your maturity level" mean?', options: ['Every client gets the same package', 'The service is built around how advanced the client\'s security already is', 'Only big companies can buy', 'Prices depend on the company\'s age'], answer: 1, why: 'J2 adjusts each service to the client\'s current security level and compliance needs.' }
  ]
});

COURSE.modules.push({
  id: 'm2', title: 'Cyber security basics', short: 'What gets attacked, who attacks, and how. Plain language, no jargon without a meaning.',
  lessons: [
    {
      id: 'l1', title: 'What cyber security protects', mins: 6,
      tldr: 'Cyber security keeps information private, correct, and available when people need it.',
      why: 'Every security product exists to protect one or more of these three things. It is the base idea everything else builds on.',
      points: [
        '<strong>Confidentiality (private):</strong> only the right people can see it. Broken by: a data leak, a stolen password.',
        '<strong>Integrity (correct):</strong> nobody changes it without permission. Broken by: a criminal changing the bank details on an invoice.',
        '<strong>Availability (there when needed):</strong> broken by ransomware locking files, or systems going down.',
        'Security people call these three the <strong>CIA triad</strong>. It has nothing to do with the American spy agency.',
        'For a business, what is really at stake: money, customer trust, legal fines, and being able to work at all.'
      ],
      j2: 'J2\'s data page lists the costs of a breach: losing customers and reputation, expensive regulatory fines, operational downtime, and the human toll (stress and mental health of staff and leaders).',
      say: 'Security keeps information private, correct and available. Without those, the business can\'t operate.',
      words: [['Breach', 'When an attacker gets in, or data gets out.'], ['Data', 'Any business information: contracts, customer details, prices, plans.']],
      check: { q: 'A criminal changes the bank account number on an invoice. Which property is broken?', options: ['Confidentiality', 'Integrity', 'Availability'], answer: 1, why: 'The information was changed without permission, so its integrity is broken.' }
    },
    {
      id: 'l2', title: 'Who attacks, and why', mins: 6,
      tldr: 'Most attacks are done by criminal groups who want money. Some risk comes from people inside the company.',
      why: 'Knowing the attacker explains why J2 sells what it sells.',
      points: [
        '<strong>Criminal gangs:</strong> they run like businesses. They steal data, lock systems and demand payment. This is the main threat to J2\'s customers.',
        '<strong>Fraudsters:</strong> they trick staff into paying fake invoices or changing bank details.',
        '<strong>Insiders:</strong> staff who make mistakes (negligent), or who steal on purpose (malicious). Example: taking the client list before resigning.',
        '<strong>Nation-state hackers:</strong> governments spying on each other. Big in the news, less common for typical businesses.',
        'Attackers take the easiest way in. That is usually a person, not a clever technical trick.'
      ],
      say: 'Most attackers are after money, and they go for the easiest target. Usually that\'s a person.',
      words: [['Threat actor', 'Whoever is attacking.'], ['Insider threat', 'Risk that comes from someone inside the organisation, on purpose or by accident.']],
      check: { q: 'What do most attackers of normal businesses want?', options: ['Fame', 'Money', 'To test their skills'], answer: 1, why: 'Most attacks are financially motivated crime.' }
    },
    {
      id: 'l3', title: 'How attacks start: people', mins: 7,
      tldr: 'Almost every successful attack needs a person to click, type or share something they should not.',
      why: 'This is J2\'s first area (Users) and the reason email security matters so much.',
      points: [
        '<strong>Phishing:</strong> a fake email or message that tricks you into clicking a link, opening a file, or typing your password.',
        '<strong>Credential theft:</strong> the fake login page steals your username and password.',
        '<strong>Social engineering:</strong> pressuring people with urgency, fear or authority. For example: "This is the CEO. Pay this supplier now."',
        '<strong>Mistakes:</strong> uploading sensitive files to the wrong place, or emailing the wrong person.',
        'J2\'s numbers: <em>"80% of breaches happen because of the actions of just 8% of users."</em>'
      ],
      j2: 'J2\'s view: people are often called the "weakest link". With training and the right controls, J2 aims to make them <em>"the strongest line of defence."</em>',
      say: 'Most attacks start with a person being tricked. J2 works to turn users from the weakest link into the strongest defence.',
      words: [['Phishing', 'Fake messages designed to trick people.'], ['Credentials', 'Username plus password.'], ['Social engineering', 'Manipulating people instead of hacking computers.']],
      check: { q: 'J2 says 80% of breaches are caused by what share of users?', options: ['8%', '50%', '80%'], answer: 0, why: 'A small group of risky users causes most breaches. Visibility shows you who they are.' }
    },
    {
      id: 'l4', title: 'Ransomware and data theft', mins: 7,
      tldr: 'Ransomware locks a company\'s files and demands payment. Modern gangs also steal the data first and threaten to publish it.',
      why: 'Ransomware is the attack business owners fear most. Much of what J2 sells is about stopping it or recovering from it.',
      points: [
        'The usual path: get in (often by phishing) → move around quietly → steal data → lock (encrypt) files → demand a ransom.',
        '<strong>Double extortion:</strong> "Pay us, or your files stay locked <em>and</em> we publish your data."',
        'The damage: the business stops, recovery costs money, fines can follow, and customers lose trust.',
        'Best defences: block the way in, catch attackers early while they move around (24/7 monitoring), and keep backups the attackers cannot delete.',
        'Paying the ransom is no guarantee of getting data back.'
      ],
      extra: H.flow(['Phishing email', 'Attacker gets in', 'Moves around quietly', 'Steals data', 'Locks files', 'Ransom demand']),
      j2: 'J2 covers each step: email security for the way in, MDR on machines to catch and contain attackers 24/7, and backup and restoration so data can come back.',
      say: 'With ransomware, speed and backups decide the outcome. Catch the attacker before they lock files, or restore quickly, and you stay in business.',
      words: [['Ransomware', 'Malware that locks files until a ransom is paid.'], ['Encrypt', 'Scramble data so it cannot be read without a key.'], ['Downtime', 'Time when the business cannot work.']],
      check: { q: 'What is "double extortion"?', options: ['Asking for the ransom twice', 'Locking files and also threatening to publish stolen data', 'Attacking two companies at once'], answer: 1, why: 'Gangs steal data first, so backups alone do not remove the threat.' }
    },
    {
      id: 'l5', title: 'Accounts: passwords, MFA and takeover', mins: 7,
      tldr: 'Attackers now often log in instead of breaking in. Protecting user accounts is one of the most important jobs in security.',
      why: 'Account takeover in Microsoft 365 is a headline J2 service. You will hear about it often.',
      points: [
        'People work from home, cafés and anywhere else. The "wall around the office" is gone. J2: <em>"Your perimeter is wherever your user is."</em>',
        '<strong>Account takeover:</strong> an attacker gets someone\'s login and uses their real account, often their Microsoft 365 email.',
        '<strong>MFA (multi-factor authentication):</strong> a second check as well as the password, such as a code or an app prompt. It stops most password-only attacks.',
        '<strong>Password management:</strong> strong, different passwords for each account, stored in a password manager.',
        'Warning signs of a taken-over account: logins from strange countries, new email rules that hide messages, many emails suddenly sent.'
      ],
      j2: 'J2 sells MFA and password management (Users area), and <strong>J2 Advanced Microsoft 365 Security Monitoring</strong> to stop account takeover (Email area).',
      say: 'Attackers log in rather than break in. MFA and 24/7 monitoring of Microsoft 365 stop account takeover.',
      words: [['Perimeter', 'The edge of the network you protect. It used to be the office walls.'], ['MFA', 'A second proof that it\'s really you, as well as the password.'], ['Microsoft 365', 'Microsoft\'s cloud email and office apps: Outlook, Teams, OneDrive, SharePoint.']],
      check: { q: 'What does MFA add?', options: ['A longer password', 'A second proof of identity as well as the password', 'Faster internet'], answer: 1, why: 'Even if the password is stolen, the second factor blocks most logins.' }
    },
    {
      id: 'l6', title: 'Layers and zero trust', mins: 7,
      tldr: 'No single tool is enough. Good security stacks several layers and never trusts any person or device automatically.',
      why: 'This explains why J2 sells many services across five areas instead of one product.',
      points: [
        '<strong>Defence in depth:</strong> several layers, like a house with a locked gate, a locked door, an alarm and a safe.',
        'The layers do three jobs: <strong>prevent</strong> (block), <strong>detect</strong> (notice) and <strong>respond</strong> (act and recover).',
        '<strong>Zero trust:</strong> "never trust, always verify". Every user and device proves who it is every time, even inside the office network.',
        '<strong>Least privilege:</strong> people only get the access they actually need for their job.',
        'Security should not stop people working. J2: <em>"You shouldn\'t have to choose between security and productivity."</em>'
      ],
      extra: H.table(['Job', 'Example']
        , [['Prevent', 'Email filtering, MFA, patching, blocking bad websites'], ['Detect', '24/7 SOC monitoring, user activity monitoring, honeypots'], ['Respond', 'Isolating a laptop, locking an account, restoring from backup']]),
      j2: 'J2 offers <strong>Zero-Trust Network and Internet Access</strong> in its Internet area.',
      say: 'Good security is layered. Prevent what you can, detect what gets through, and respond fast. Zero trust means every access gets checked.',
      words: [['Defence in depth', 'Several independent layers of protection.'], ['Zero trust', 'Never trust automatically; always verify.'], ['Least privilege', 'Only the access someone needs, nothing more.']],
      check: { q: 'What does zero trust mean?', options: ['Trust everyone inside the office', 'Never trust automatically; always verify every user and device', 'Don\'t trust any vendors'], answer: 1, why: 'Location is not proof of trust. Every access is checked.' }
    }
  ],
  quiz: [
    { q: 'Ransomware locking files mainly breaks which property?', options: ['Availability', 'Integrity', 'Confidentiality', 'None'], answer: 0, why: 'Locked files are not available. With double extortion, confidentiality is hit too.' },
    { q: 'An email says "This is the CEO, pay this supplier in the next hour, keep it quiet." This is…', options: ['A normal request', 'Social engineering using urgency and authority', 'A software bug', 'A backup alert'], answer: 1, why: 'Urgency plus authority plus secrecy is a classic fraud pattern (CEO impersonation).' },
    { q: 'Which is the best defence against ransomware if everything else fails?', options: ['Paying quickly', 'Backups that attackers cannot delete, plus a tested restore', 'Turning off the internet forever', 'A longer password'], answer: 1, why: 'Protected backups let the business recover without paying.' },
    { q: 'Which is a warning sign of account takeover?', options: ['A user changing their desktop background', 'A login from an unusual country, then a new rule hiding emails', 'A printer running out of paper', 'A software update'], answer: 1, why: 'Strange logins and hidden-email rules are classic takeover signs.' },
    { q: '"Defence in depth" means…', options: ['One very strong firewall', 'Several layers of protection that back each other up', 'Hiding servers underground', 'Only protecting the CEO'], answer: 1, why: 'If one layer fails, another catches the attack.' }
  ]
});
})(window.H);
