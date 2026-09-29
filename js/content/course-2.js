(function (H) {
function svcTable(rows) {
  return H.table(['J2 service', 'What it does, in plain words'], rows);
}

COURSE.modules.push({
  id: 'm3', title: 'What an MSSP does', short: 'The business model: why companies outsource security, how the SOC works, and how money comes in.',
  lessons: [
    {
      id: 'l1', title: 'MSP, MSSP, MDR: the difference', mins: 6,
      tldr: 'An MSP runs a company\'s IT. An MSSP runs its security. MDR is the part where the provider actively finds and stops attacks.',
      why: 'These letters are used all the time, and they are easy to mix up.',
      points: [
        'Hiring a full in-house security team is expensive, and skilled people are hard to find.',
        'Attacks happen 24/7. Covering nights, weekends and holidays needs many people working in shifts.',
        'An MSSP shares one expert team across many clients. That makes 24/7 protection affordable for each of them.',
        'J2 is an <strong>MSSP</strong> that also provides <strong>MDR</strong>. Its website has a "J2 MDR Service" page.'
      ],
      extra: H.table(['Type', 'What they do', 'Customer says'], [
        ['MSP', 'Runs IT: laptops, help desk, networks, Microsoft 365 setup', '"Keep our IT working."'],
        ['MSSP', 'Runs security tools and watches them as a service', '"Keep us secure and compliant."'],
        ['MDR', 'Detects attacks and responds hands-on: contains, isolates, removes', '"Stop attackers for us, day and night."']
      ]),
      say: 'Most companies can\'t afford their own 24/7 security team. An MSSP like J2 gives them one, shared across many clients.',
      words: [['Outsource', 'Pay another company to do a job for you.'], ['MDR', 'Managed Detection and Response: find attacks and act on them.']],
      check: { q: 'Why do companies use an MSSP?', options: ['It is the law', 'A 24/7 in-house security team is expensive and hard to hire', 'To get cheaper laptops'], answer: 1, why: 'Sharing an expert team across clients makes 24/7 coverage affordable.' }
    },
    {
      id: 'l2', title: 'The SOC: the 24/7 control room', mins: 8,
      tldr: 'The SOC is where analysts watch alerts from all clients, decide what is real, and act fast when something is wrong.',
      why: 'The SOC is the heart of J2. Most of what clients pay for runs through it.',
      points: [
        'Security tools send <strong>alerts</strong> (possible problems) into one central system.',
        'Analysts <strong>triage</strong> each alert: is it real or a false alarm, and how serious is it?',
        'If it is real, they <strong>contain</strong> it (for example, cut a laptop off the network or lock an account), tell the client, then clean up.',
        'Most alerts are false alarms. Too many false alarms causes <strong>alert fatigue</strong>, so good SOCs keep tuning their tools.',
        'J2\'s words for the job: <em>identify, isolate and remove</em> threats as they happen.'
      ],
      extra: H.flow(['Alert', 'Triage', 'Investigate', 'Contain', 'Tell the client', 'Fix and report']) +
        H.table(['Role', 'What they do'], [
          ['Tier 1 analyst', 'First look at alerts. Closes false alarms, escalates real ones.'],
          ['Tier 2 analyst / responder', 'Investigates real incidents and contains them.'],
          ['Tier 3 / threat hunter', 'Hunts for hidden attackers and handles the hardest cases.'],
          ['SOC manager', 'Runs shifts, quality and client escalations.']
        ]),
      j2: 'J2 says it uses <em>"attacker based detections"</em>: detection rules built around how real attackers behave, not just generic warnings.',
      say: 'The SOC identifies, isolates and removes threats as they happen, 24 hours a day.',
      words: [['Alert', 'An automatic warning that something might be wrong.'], ['Triage', 'Quickly deciding how serious something is.'], ['False positive', 'An alert that turns out to be nothing.'], ['Incident', 'A confirmed security problem that needs action.']],
      check: { q: 'What does "contain" mean in the SOC?', options: ['Write a report', 'Stop the threat from spreading, e.g. isolate a laptop', 'Buy a new tool'], answer: 1, why: 'Containment stops the damage growing while the problem is fixed.' }
    },
    {
      id: 'l3', title: 'How the business makes money', mins: 7,
      tldr: 'An MSSP earns steady monthly fees per user, device or service. It grows by winning clients and by existing clients adding more areas.',
      why: 'Knowing how money flows helps you understand priorities, targets and why clients are treated the way they are.',
      points: [
        '<strong>Recurring revenue:</strong> clients pay monthly or yearly (subscriptions), not once.',
        'Pricing is usually per user, per mailbox, per device, or per service bundle.',
        'Many services run on partner technology (for example Mimecast). J2 provides the licences <em>plus</em> the experts who run and watch them. The people are the real value.',
        '<strong>Growth</strong> comes from new clients, and from existing clients adding areas: start with email, then add machines, then data. This is called <strong>upselling</strong>.',
        '<strong>Keeping clients</strong> (retention) matters a lot. Good reports, fast response and trust keep them.',
        'The biggest cost is skilled people working 24/7.'
      ],
      j2: 'Every J2 service is tailored to the client\'s maturity level and compliance needs, so two clients rarely buy exactly the same package. Ask on day one how pricing and packages actually work.',
      say: 'The model is recurring: clients pay monthly for protection, and grow with J2 by adding more of the five areas over time.',
      words: [['Recurring revenue', 'Income that repeats every month or year.'], ['Upsell', 'Selling more to an existing client.'], ['Retention', 'Keeping clients from leaving.'], ['Licence', 'Paid permission to use software.']],
      check: { q: 'What is "upselling" at an MSSP?', options: ['Raising prices without warning', 'An existing client adding more services, e.g. adding data protection to email security', 'Selling laptops'], answer: 1, why: 'Growth from existing clients is a key part of the model.' }
    },
    {
      id: 'l4', title: 'The customer journey', mins: 6,
      tldr: 'A client goes from first contact, to assessment, to onboarding, to 24/7 monitoring, regular reports, and renewal.',
      why: 'Every team at J2 owns part of this journey. It tells you who does what.',
      points: [
        '<strong>First contact:</strong> the website, the scorecard, the domain test, events, referrals.',
        '<strong>Assessment:</strong> measure maturity and gaps (scorecard, cyber risk assessment).',
        '<strong>Proposal:</strong> a tailored plan and price.',
        '<strong>Onboarding:</strong> connect the client\'s email, devices and cloud systems to J2\'s tools and the SOC.',
        '<strong>Monitoring and reporting:</strong> 24/7 watch, plus regular reports showing what was blocked and found. Reports prove the value.',
        '<strong>Review and renewal:</strong> regular meetings to re-check maturity and plan the next area to add.'
      ],
      extra: H.flow(['First contact', 'Assessment', 'Proposal', 'Onboarding', '24/7 monitoring', 'Reports and reviews', 'Renewal and growth']),
      say: 'Clients start with an assessment, get onboarded to the SOC, and then grow their protection area by area over time.',
      words: [['Onboarding', 'Setting up a new client so the service can start.'], ['Renewal', 'The client signing up for another term.']],
      check: { q: 'What happens during onboarding?', options: ['The client signs the first email', 'The client\'s systems are connected to J2\'s tools and SOC', 'The contract ends'], answer: 1, why: 'Onboarding is the technical setup that makes monitoring possible.' }
    }
  ],
  quiz: [
    { q: 'Which letters mean a provider that actively detects and responds to attacks?', options: ['MSP', 'MDR', 'CRM', 'HR'], answer: 1, why: 'Managed Detection and Response.' },
    { q: 'Most SOC alerts are…', options: ['Always real attacks', 'Often false alarms that need triage', 'Ignored', 'Sent to marketing'], answer: 1, why: 'Triage separates real threats from noise.' },
    { q: 'What is the main way an MSSP earns money?', options: ['One-off projects only', 'Recurring monthly or yearly fees', 'Advertising', 'Selling client data'], answer: 1, why: 'Recurring subscription revenue is the core.' },
    { q: 'Why do reports matter so much to clients?', options: ['They are required by the police', 'They show the value of the service between incidents', 'They replace monitoring', 'They are free'], answer: 1, why: 'When nothing goes wrong, reports are how the client sees what J2 did.' },
    { q: 'What is the biggest cost for an MSSP?', options: ['Office plants', 'Skilled people working 24/7', 'Printer paper', 'Website hosting'], answer: 1, why: 'Round-the-clock expert staff cost the most.' }
  ]
});

COURSE.modules.push({
  id: 'm4', title: 'The J2 framework: 5 areas', short: 'Users, email, data, machines, internet. What each risk is and what J2 sells for it.',
  lessons: [
    {
      id: 'l1', title: 'The big picture', mins: 5,
      tldr: 'J2 organises everything it sells into five areas: users, email, data, machines and internet.',
      why: 'This is the map of J2\'s business. Every service, the scorecard, and many conversations follow these five areas.',
      points: [
        'Memory trick for the order: <strong>U</strong>sers, <strong>E</strong>mail, <strong>D</strong>ata, <strong>M</strong>achines, <strong>I</strong>nternet = "<strong>U E</strong>at <strong>D</strong>onuts, <strong>M</strong>ostly <strong>I</strong>ced."',
        'Together they form the <strong>J2 Cyber Resilience Framework</strong>. The website calls them the "J2 Cyber Resilience Areas".',
        'The areas connect: users work in email, handle data, use machines, and go on the internet every day.',
        'J2 says each area <em>"cannot be done in isolation"</em>. Protection works best when all five are covered.'
      ],
      extra: H.table(['Area', 'The risk in one line', 'J2 services'], COURSE.areas.map(function (a) { return ['<strong>' + a.name + '</strong>', a.risk, a.services.join('<br>')]; })),
      say: 'J2 protects five areas: users, email, data, machines and internet. Together they make up the J2 Cyber Resilience Framework.',
      words: [['Framework', 'A structure that organises how you think about something.']],
      check: { q: 'Which list is J2\'s five areas?', options: ['Users, email, data, machines, internet', 'Cloud, mobile, network, apps, people', 'Identify, protect, detect, respond, recover'], answer: 0, why: 'U-E-D-M-I: "U Eat Donuts, Mostly Iced."' }
    },
    {
      id: 'l2', title: 'Area 1: Users', mins: 8,
      tldr: 'People are the biggest cyber risk. With the right help and controls, they can become the strongest defence.',
      why: 'J2 puts users first because almost every attack needs a person to make a mistake.',
      points: [
        'What users do wrong (from J2\'s page): click malicious links, enter credentials in the wrong place, upload sensitive information to unsupported platforms, and make mistakes that are accidental, negligent or even malicious.',
        '<em>"80% of breaches happen because of the actions of just 8% of users."</em> Visibility shows you who those users are.',
        '<em>"Your perimeter is wherever your user is"</em>: home, a coffee shop, anywhere in the world.',
        'Without visibility into what users do, J2 says <em>"you are simply waiting to become a victim."</em>'
      ],
      extra: svcTable([
        ['User Activity Monitoring', 'See what is happening on users\' devices (the endpoint).'],
        ['User Awareness Training', 'Teach staff to spot and avoid threats like phishing.'],
        ['Multi-Factor Authentication (MFA)', 'A second login check to protect accounts.'],
        ['Human Risk Management', 'Actively find and reduce risky behaviour.'],
        ['Password Management', 'Set and enforce strong password rules.'],
        ['Productivity Measurement', 'Understand how the team works, so unusual behaviour stands out.']
      ]),
      j2: 'DTEX, a J2 partner, is known for this kind of user behaviour and insider-risk visibility.',
      say: 'Users are where most breaches begin. J2 gives visibility into user behaviour, plus training, MFA and password controls, to make people the strongest line of defence.',
      words: [['Endpoint', 'A user\'s device: laptop, desktop or phone.'], ['Anomaly', 'Something unusual that stands out from normal behaviour.'], ['Negligent', 'Careless, without meaning harm.']],
      check: { q: 'Which is NOT one of J2\'s user services?', options: ['User Awareness Training', 'Password Management', 'Website design', 'Human Risk Management'], answer: 2, why: 'Website design is not a security service.' }
    },
    {
      id: 'l3', title: 'Area 2: Email', mins: 9,
      tldr: 'J2 says over 90% of cyber attacks start in email, so email gets several layers of protection.',
      why: 'Email is probably J2\'s best-known area, with named partners and a flagship Microsoft 365 monitoring service.',
      points: [
        '<strong>Phishing:</strong> fake emails that steal passwords or deliver malware.',
        '<strong>Business Email Compromise (BEC):</strong> a criminal uses a real or fake business email account to commit fraud.',
        '<strong>CEO impersonation:</strong> pretending to be the boss to rush staff into paying or sharing.',
        '<strong>Invoice fraud:</strong> fake or altered invoices with the criminal\'s bank details.',
        '<strong>Account takeover:</strong> a criminal controls a real mailbox.'
      ],
      extra: svcTable([
        ['Advanced Email Security', 'Top email security tools with AI-driven detection, run and supported by J2.'],
        ['J2 Advanced Microsoft 365 Security Monitoring', 'J2 specialists watch the client\'s Microsoft 365 and identify, isolate and remove threats as they happen. Prevents account takeover.'],
        ['Domain Impersonation & DMARC Compliance', 'Stops criminals sending emails that pretend to come from the client\'s domain. Also improves email deliverability and trust.'],
        ['Enhanced Compliance & Business Continuity', 'Keeps email working during outages (continuity) and stores it safely for legal needs (archiving).']
      ]) + '<p><strong>DMARC in one line:</strong> a setting on a company\'s email domain that tells other email servers what to do with messages pretending to be from that domain: allow, send to junk, or reject.</p>',
      j2: 'Email partners are <strong>Mimecast</strong> and <strong>IRONSCALES</strong>. J2\'s website also has a free <strong>domain score</strong> test, which checks a domain\'s DMARC set-up.',
      say: 'Over 90% of attacks start in email. J2 layers advanced email security, 24/7 Microsoft 365 monitoring, DMARC protection against impersonation, and continuity and archiving.',
      words: [['BEC', 'Business Email Compromise: fraud using business email.'], ['Domain', 'The part after @ in an email address, e.g. company.co.za.'], ['DMARC', 'A domain setting that stops others sending email as you.'], ['Archiving', 'Storing emails safely so they can be found later.']],
      check: { q: 'Which J2 service stops criminals pretending to be the client\'s email domain?', options: ['Password Management', 'Domain Impersonation & DMARC Compliance', 'Patch Management'], answer: 1, why: 'DMARC tells other servers to reject email that fakes your domain.' }
    },
    {
      id: 'l4', title: 'Area 3: Data', mins: 8,
      tldr: 'Data is what criminals want to steal, lock or destroy, so J2 protects it through its whole life in the business.',
      why: 'Data protection links directly to privacy laws, fines and ransomware. That is why clients pay for it.',
      points: [
        'Business data includes plans, strategies, processes, contracts, pricing and customer information. J2: this is <em>"your competitive edge."</em>',
        'Criminal gangs aim to steal, destroy or encrypt data to demand a ransom.',
        'The cost of a breach: lost customers and reputation, regulatory fines, downtime and recovery costs, and the human toll on staff.',
        'J2 protects data through its <em>"entire journey"</em>: while it is used, stored, backed up, and finally destroyed.'
      ],
      extra: svcTable([
        ['Behavioural Data Loss Prevention', 'Spots and prevents data leaving the business, from insiders or from staff making mistakes.'],
        ['Managed Data Encryption', 'Scrambles data so only authorised people can read it, both when stored and while in use.'],
        ['Backup and Restoration', 'Proper backups and the ability to restore quickly after an incident.'],
        ['Secure Data Destruction', 'Permanently removes data and drives that are no longer needed.']
      ]),
      j2: 'DTEX (partner) powers behavioural data loss prevention and insider-risk detection.',
      say: 'J2 protects data across its whole life: it spots data leaving, encrypts it, backs it up, and destroys it safely when it\'s no longer needed.',
      words: [['DLP', 'Data Loss Prevention: stopping data leaving where it shouldn\'t.'], ['Behavioural', 'Based on patterns of what people do, not just on file contents.'], ['Backup', 'A safe copy of data for recovery.']],
      check: { q: 'Why does J2 offer secure data destruction?', options: ['Old drives can still hold data that could leak later', 'To save electricity', 'To speed up laptops'], answer: 0, why: 'Data left on old drives is a future risk.' }
    },
    {
      id: 'l5', title: 'Area 4: Machines', mins: 8,
      tldr: 'Every device is a possible way in, and you cannot protect what you cannot see.',
      why: 'Machines are where ransomware runs. J2\'s MDR service lives here.',
      points: [
        '"Machines" means every device: the access control device at the front door, laptops used remotely, and physical or virtual servers.',
        'An unprotected machine can be compromised in seconds, leading to data theft, ransomware or downtime.',
        'You cannot defend a device you do not know exists. Visibility of every device comes first.',
        'J2 aims to keep machines secure, compliant and ready for business, wherever people work.'
      ],
      extra: svcTable([
        ['Endpoint Protection with MDR', 'Protects devices and watches them continuously. J2 acts the moment a machine is attacked, containing threats 24 hours a day.'],
        ['Proactive Patch Management', 'Keeps software and operating systems updated, even for remote users, so known weaknesses are closed.'],
        ['Advanced Encryption and Access Control', 'Full disk encryption plus device-level MFA. Only the right people can use the device, and it helps with compliance reporting.'],
        ['Intelligent Usage Analytics', 'Spots dangerous activity or account takeover in real time, and can add location- or network-based controls.']
      ]),
      say: 'Every device is an entry point. J2 protects and monitors machines 24/7 with MDR, keeps them patched, encrypts them, and watches for dangerous activity.',
      words: [['Patch', 'A software update that fixes a weakness.'], ['Vulnerability', 'A weakness an attacker can use.'], ['Full disk encryption', 'Scrambling everything on a device so a lost or stolen device is unreadable.'], ['Isolate', 'Cut a device off the network so an attack cannot spread.']],
      check: { q: 'Why does patch management matter?', options: ['It makes screens brighter', 'It closes known weaknesses before attackers use them', 'It deletes old emails'], answer: 1, why: 'Attackers exploit known vulnerabilities that were never patched.' }
    },
    {
      id: 'l6', title: 'Area 5: Internet', mins: 7,
      tldr: 'The internet connects the business to the world. It also connects criminals directly to the business.',
      why: 'This area covers how staff use the web and how the business is exposed online.',
      points: [
        'The internet lets a business advertise, connect, and let staff work from anywhere with remote access.',
        'J2: without basic controls, <em>"it\'s not a matter of if you will be compromised, but when."</em> Attackers actively search for gaps.',
        'J2 aims for security <em>and</em> productivity: people can work safely within policy without stopping creativity.',
        'J2 also offers <strong>network deception technology</strong> (honeypots): fake systems that set off an alarm when an attacker touches them.'
      ],
      extra: svcTable([
        ['Cyber Risk Assessments', 'Shows exactly how attackers would find and use weaknesses, so the gaps can be closed first.'],
        ['Secure Web Usage & Threat Protection', 'Stops users visiting dangerous websites and blocks threats from the internet.'],
        ['Zero-Trust Network and Internet Access', 'Every connection is checked and secured, wherever the user is.']
      ]),
      say: 'The internet is how the business connects to the world and how criminals reach it. J2 assesses the risk, protects web use, and moves clients to zero-trust access.',
      words: [['Honeypot', 'A decoy system. Real users never touch it, so any touch means an attacker.'], ['Remote access', 'Reaching company systems from outside the office.']],
      check: { q: 'What does a cyber risk assessment show?', options: ['How attackers would try to find and exploit weaknesses', 'How fast the Wi-Fi is', 'Staff salaries'], answer: 0, why: 'It looks at the business the way an attacker would.' }
    }
  ],
  quiz: [
    { q: 'A client worries staff will click phishing links. Which area and service fit best?', options: ['Data: Secure Data Destruction', 'Users: User Awareness Training', 'Machines: Patch Management', 'Internet: Risk Assessment'], answer: 1, why: 'Training users to spot threats sits in the Users area.' },
    { q: 'A client\'s supplier invoices are being faked by criminals. Which area?', options: ['Email', 'Machines', 'Internet', 'Data'], answer: 0, why: 'Invoice fraud and BEC sit in the Email area.' },
    { q: 'Which service watches devices 24/7 and contains attacks?', options: ['Password Management', 'Endpoint Protection with MDR', 'Email archiving', 'Productivity Measurement'], answer: 1, why: 'MDR sits in the Machines area.' },
    { q: 'A client needs to prove old hard drives were wiped properly. Which service?', options: ['Secure Data Destruction', 'DMARC Compliance', 'Zero-Trust Access', 'MFA'], answer: 0, why: 'Data area: secure destruction removes future risk.' },
    { q: 'Which service stops criminals sending email that pretends to be from the client\'s domain?', options: ['Backup and Restoration', 'Domain Impersonation & DMARC Compliance', 'Usage Analytics', 'Web Threat Protection'], answer: 1, why: 'DMARC stops domain impersonation.' },
    { q: 'Staff keep visiting dangerous websites. Which area and service?', options: ['Internet: Secure Web Usage & Threat Protection', 'Data: Encryption', 'Email: Archiving', 'Users: Password Management'], answer: 0, why: 'Blocking dangerous sites sits in the Internet area.' }
  ]
});
})(window.H);
