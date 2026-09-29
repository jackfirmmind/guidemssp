(function (H) {
COURSE.phrases = [
  ['Cyber resilience', 'Seeing attacks fast, responding, and recovering so the business keeps running.'],
  ['Maturity level', 'How advanced a client\'s security already is.'],
  ['Compliance requirements', 'The laws and standards a client must follow.'],
  ['Visibility', 'Being able to see what is happening in systems and user behaviour.'],
  ['Security posture', 'The overall strength of an organisation\'s security right now.'],
  ['Attack surface', 'All the places an attacker could try to get in.'],
  ['Threat landscape', 'The current types of attacks and attackers out there.'],
  ['Managed Detection and Response (MDR)', 'A team that finds attacks and acts on them for you, 24/7.'],
  ['Attacker-based detections', 'Alerts designed around how real attackers behave.'],
  ['Identify, isolate, remove', 'How J2 describes the SOC\'s response: find it, cut it off, get rid of it.'],
  ['Business continuity', 'Keeping the business running during and after a problem.'],
  ['Human risk', 'Risk that comes from people\'s behaviour: clicks, mistakes, insiders.'],
  ['Account takeover (ATO)', 'An attacker controlling a real user\'s account.'],
  ['Zero trust', 'Never trust automatically; always verify.'],
  ['False positive', 'An alert that turns out to be harmless.'],
  ['Incident', 'A confirmed security problem that needs action.']
];

COURSE.pitch = 'J2 is a cyber security company, founded in 2006 in Honeydew, Johannesburg, with head offices in London and Johannesburg and more than 700 customers on five continents. It is a managed security service provider: clients pay monthly and J2\'s 24/7 Security Operations Centre watches their systems, spotting attacks and identifying, isolating and removing threats as they happen. Everything is organised into five areas: users, email, data, machines and internet. J2\'s big idea is cyber resilience: you can\'t block every attack, so you need to see attacks fast and recover without the business stopping. As they put it, "we keep your business in business."';

COURSE.modules.push({
  id: 'm5', title: 'Partners, rules and industry words', short: 'The vendors J2 works with, the laws clients must follow, and the phrases you will hear in meetings.',
  lessons: [
    {
      id: 'l1', title: 'Partner technology', mins: 7,
      tldr: 'J2 partners with specialist security vendors, then adds its own experts and 24/7 monitoring on top.',
      why: 'Partner names come up constantly. Knowing what each one does stops you getting lost.',
      points: [
        'A <strong>vendor</strong> makes the software. J2 delivers the software <em>plus</em> set-up, tailoring, 24/7 watching and response. That combination is what clients pay J2 for.',
        'Clients get one trusted provider across many tools, instead of managing each vendor themselves.',
        'Vendors also benefit: J2 brings them customers and looks after those customers.'
      ],
      extra: H.table(['Partner / technology', 'What it is known for', 'J2 area'], [
        ['<strong>Mimecast</strong>', 'Email security gateway (filters email before it arrives), archiving, continuity, awareness training', 'Email'],
        ['<strong>IRONSCALES</strong>', 'AI email security that works inside the mailbox. Uses reports from users to catch phishing and removes it from every inbox', 'Email'],
        ['<strong>DTEX</strong>', 'Insider risk and behavioural data loss prevention: visibility into user activity, with privacy protections', 'Users, Data'],
        ['<strong>Microsoft 365</strong>', 'The email and office platform many clients use. J2 monitors it 24/7', 'Email, Users'],
        ['<strong>Deception technology</strong>', 'Honeypots: decoys that raise a high-confidence alarm when an attacker touches them', 'Internet']
      ]),
      j2: 'Other partners (for example the endpoint/MDR, backup and encryption vendors) are not all named on the public pages. Ask which partners are biggest for J2 today.',
      say: 'J2 partners with specialists like Mimecast, IRONSCALES and DTEX, and adds its own 24/7 SOC and expertise on top.',
      words: [['Vendor', 'The company that makes the product.'], ['Partner', 'A vendor J2 works with closely to deliver its services.']],
      check: { q: 'Which partner is best known for insider risk and user behaviour?', options: ['Mimecast', 'DTEX', 'IRONSCALES'], answer: 1, why: 'DTEX focuses on insider risk and behavioural data loss prevention.' }
    },
    {
      id: 'l2', title: 'The rules clients must follow', mins: 8,
      tldr: 'Laws and standards force companies to protect data. This is a major reason businesses buy security services.',
      why: 'J2 tailors every service to "compliance requirements". You need to know what those requirements are.',
      points: [
        '<strong>Compliance</strong> means following the laws and standards that apply to you.',
        'Breaking data protection laws can mean fines, legal action and reputational damage.',
        'J2 is in two regions, so two main privacy laws matter: <strong>POPIA</strong> (South Africa) and <strong>UK GDPR</strong> (UK). EU clients bring EU GDPR.',
        'Many clients must also prove good security to <em>their</em> customers, often through certifications like ISO 27001.',
        'J2\'s footer: it helps organisations <em>"strengthen compliance with international data protection standards."</em>'
      ],
      extra: H.table(['Name', 'Where', 'In one line'], [
        ['POPIA', 'South Africa', 'Protection of Personal Information Act. Enforced since July 2021 by the Information Regulator.'],
        ['UK GDPR', 'United Kingdom', 'UK data protection law. Serious breaches must be reported to the ICO within 72 hours.'],
        ['EU GDPR', 'European Union', 'The EU version, for European clients and their data.'],
        ['ISO 27001', 'International', 'A certifiable standard for managing information security.'],
        ['Cyber Essentials', 'UK', 'A government-backed basic security certification with 5 controls.']
      ]),
      say: 'Clients buy security partly to meet laws like POPIA and GDPR. J2 tailors its services to each client\'s compliance needs.',
      words: [['Compliance', 'Following the rules that apply to you.'], ['Regulator', 'The official body that enforces a law.'], ['ICO', 'Information Commissioner\'s Office, the UK data regulator.'], ['Certification', 'Official proof that you meet a standard.']],
      check: { q: 'Which law applies to personal data in South Africa?', options: ['POPIA', 'HIPAA', 'SOX'], answer: 0, why: 'POPIA, enforced by the Information Regulator.' }
    },
    {
      id: 'l3', title: 'Industry words, translated', mins: 6,
      tldr: 'A short phrasebook: the words you will hear in meetings, in plain English.',
      why: 'Meetings move fast. Knowing these phrases lets you keep up without having to stop and ask.',
      points: [
        'Read the table once, slowly.',
        'Cover the right column and try to explain each phrase.',
        'These phrases are also in your flashcards.'
      ],
      extra: '__PHRASES__',
      say: 'We tailor the service to the client\'s maturity level and compliance requirements, to improve their security posture and cyber resilience.',
      words: [],
      check: { q: '"Attack surface" means…', options: ['The top of a firewall', 'All the places an attacker could try to get in', 'A type of virus'], answer: 1, why: 'More devices, accounts and exposed systems mean a bigger attack surface.' }
    }
  ],
  quiz: [
    { q: 'What does J2 add on top of vendor software?', options: ['Nothing, it only resells', 'Set-up, tailoring, 24/7 monitoring and response by its experts', 'Free laptops', 'Legal advice'], answer: 1, why: 'The managed service (people plus process) is J2\'s value.' },
    { q: 'IRONSCALES and Mimecast belong to which J2 area?', options: ['Email', 'Machines', 'Internet', 'Data'], answer: 0, why: 'Both are email security partners.' },
    { q: 'Under UK GDPR, serious personal data breaches go to the ICO within…', options: ['72 hours', '30 days', '1 year', 'Never'], answer: 0, why: '72 hours of becoming aware, where feasible.' },
    { q: '"Security posture" means…', options: ['How staff sit at their desks', 'The overall strength of an organisation\'s security right now', 'A type of firewall', 'The CEO\'s opinion'], answer: 1, why: 'Posture = current overall security strength.' },
    { q: 'ISO 27001 is…', options: ['A South African law', 'An international, certifiable information security standard', 'An email protocol', 'A J2 product'], answer: 1, why: 'Companies get certified against ISO 27001.' }
  ]
});

COURSE.modules.push({
  id: 'm6', title: 'Ready for day one', short: 'Your 60-second explanation of J2, and smart questions to ask in week one.',
  lessons: [
    {
      id: 'l1', title: 'Explain J2 in 60 seconds', mins: 6,
      tldr: 'If you can explain J2 out loud in one minute, you understand the business well enough to start.',
      why: 'Saying it out loud moves knowledge from "I read it" to "I know it".',
      points: [
        'Read the example explanation below once.',
        'Close it and say your own version out loud. Use the five-part structure.',
        'Do it 3 times. It gets easier each time.',
        'It does not need to be perfect or word for word.'
      ],
      extra: H.table(['Part', 'What to say'], [
        ['1. Who', 'Cyber security company, founded 2006 in Johannesburg; London and Johannesburg offices; 700+ customers.'],
        ['2. How', 'Managed service: monthly fees, 24/7 SOC.'],
        ['3. What', 'Five areas: users, email, data, machines, internet.'],
        ['4. Why', 'Cyber resilience: see attacks fast, respond, recover.'],
        ['5. Promise', '"We keep your business in business."']
      ]) + '<blockquote class="pitch">__PITCH__</blockquote>',
      say: 'We keep your business in business.',
      words: [],
      check: { q: 'Which is the best one-line summary of J2?', options: ['A software shop selling antivirus', 'A managed security provider with a 24/7 SOC protecting users, email, data, machines and internet', 'An IT help desk', 'A cyber insurance company'], answer: 1, why: 'Managed service + 24/7 SOC + five areas.' }
    },
    {
      id: 'l2', title: 'Smart questions for week one', mins: 5,
      tldr: 'Good questions show you did your homework, and they fill the gaps public information can\'t.',
      why: 'The public website doesn\'t show everything. Asking the right questions early saves weeks of guessing.',
      points: [
        'The full list is on the <a href="#questions">Day-one questions</a> page. Tick them off as you get answers.',
        'Pick 3 to ask in your first meeting. Do not ask all of them at once.',
        'Write the answers down. It is fine to say "I\'m writing this down so I remember."',
        'Good starter questions: Which of the five areas brings in the most revenue? Who is a typical client? Which partners matter most right now?'
      ],
      say: 'I\'ve read up on the five areas and the resilience framework. Which area matters most to the business right now?',
      words: [],
      check: { q: 'How many questions should you ask in your first meeting?', options: ['All of them', 'Around 3, and write the answers down', 'None'], answer: 1, why: 'A few good questions beat a long list. Keep the rest for later.' }
    }
  ],
  quiz: []
});

/* fill in generated blocks */
var m5 = COURSE.modules.find(function (m) { return m.id === 'm5'; });
m5.lessons[2].extra = H.table(['Phrase', 'Plain English'], COURSE.phrases.map(function (p) { return ['<strong>' + p[0] + '</strong>', p[1]]; }));
var m6 = COURSE.modules.find(function (m) { return m.id === 'm6'; });
m6.lessons[0].extra = m6.lessons[0].extra.replace('__PITCH__', H.esc(COURSE.pitch));
})(window.H);
