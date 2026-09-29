(function () {
COURSE.scenarios.push(
  {
    id: 's1', title: 'Saturday 02:47: impossible travel', setting: 'Night shift · Client: 350-seat logistics firm, Johannesburg',
    summary: 'A finance manager signs in from Johannesburg and, 40 minutes later, from Amsterdam.',
    log: 'ALERT  P2  Impossible travel  user=t.naidoo@client.co.za\n01:58  Sign-in OK  Johannesburg ZA  196.x.x.x  Outlook desktop\n02:38  Sign-in OK  Amsterdam NL   185.x.x.x  OfficeHome (browser)\n02:41  New-InboxRule  "  "  move subject~invoice -> RSS Feeds\n02:44  MailItemsAccessed  x312',
    steps: [
      { text: 'What do you do first?', choices: [
        { t: 'Close it: users travel and use VPNs all the time.', pts: 0, fb: 'The inbox rule is the giveaway. Impossible travel alone can be a VPN; a hidden-folder rule for "invoice" 3 minutes later is classic BEC.' },
        { t: 'Enrich: check the Amsterdam IP (hosting/VPN?), MFA method used, device, and review the inbox rule.', pts: 3, fb: 'Right. Two minutes of enrichment turns an ambiguous alert into a confident verdict. This is exactly what automation should pre-fill.' },
        { t: 'Immediately wipe the user\'s laptop.', pts: 0, fb: 'The evidence points to a cloud session, not the laptop. Wiping destroys evidence and does not revoke the attacker\'s session.' }
      ]},
      { text: 'Enrichment: the Amsterdam IP belongs to a hosting provider; the session token was reused without an MFA prompt. Verdict?', choices: [
        { t: 'True positive: account takeover, likely adversary-in-the-middle token theft.', pts: 3, fb: 'Yes. Token replay from hosting infrastructure plus a concealment rule is a strong ATO pattern.' },
        { t: 'Benign positive: the user is probably travelling.', pts: 0, fb: 'The user\'s 01:58 sign-in was from Johannesburg desktop Outlook. Nobody gets to Amsterdam in 40 minutes.' },
        { t: 'Undetermined: wait until Monday to ask the user.', pts: 1, fb: 'Waiting 48 hours with an active attacker in a finance mailbox is exactly what resilience is meant to prevent.' }
      ]},
      { text: 'Containment. Which set of actions?', choices: [
        { t: 'Revoke sessions, disable sign-in, remove the inbox rule, block the IP, and call the client\'s emergency contact.', pts: 3, fb: 'Correct. Revoking sessions matters because a password reset alone does not kill a stolen token.' },
        { t: 'Reset the password only.', pts: 1, fb: 'Stolen session tokens can survive a password reset. Revoke sessions too.' },
        { t: 'Email the user and ask them to change their password.', pts: 0, fb: 'The attacker is reading that mailbox.' }
      ]},
      { text: 'Scope: what else do you check?', choices: [
        { t: 'Mail sent by the account since 02:38 (internal phishing? payment requests?), OAuth app consents, MFA method changes, other users hit by the same phishing email.', pts: 3, fb: 'Yes. Attackers often register their own MFA method or consent a malicious app for persistence, and the original phish probably went to others.' },
        { t: 'Nothing: contained is done.', pts: 0, fb: 'Containment without scoping misses persistence and other victims.' },
        { t: 'Only check whether the laptop has malware.', pts: 1, fb: 'Worth doing, but the cloud identity is where this attack lives.' }
      ]},
      { text: 'Lessons for you as the automation engineer?', choices: [
        { t: 'Auto-enrich impossible-travel alerts with IP type, MFA details and recent inbox rules; add a one-click, approval-gated "revoke & disable" action; draft the client notification.', pts: 3, fb: 'This cuts minutes at 02:47 when minutes matter, while keeping a human on the trigger.' },
        { t: 'Auto-disable every user with impossible travel, no questions asked.', pts: 1, fb: 'Fast, but VPN users would be locked out constantly and the SOC would lose client goodwill. Reserve full autonomy for narrow, high-confidence patterns.' },
        { t: 'Nothing: this is a SOC problem.', pts: 0, fb: 'The SOC\'s time is exactly your problem.' }
      ]}
    ]
  },
  {
    id: 's2', title: 'Monday 08:10: phishing surge', setting: 'Day shift · 60+ user reports in 15 minutes across three clients',
    summary: 'A credential phishing campaign lands across several clients at once.',
    log: '08:10  User report  client-017  "DocuSign: Q4 bonus letter"\n08:11  User report  client-017  "DocuSign: Q4 bonus letter"\n08:12  User report  client-042  "DocuSign: Q4 bonus letter"\n...    63 reports / 3 clients / 1 sender domain docu-sign-hr[.]com',
    steps: [
      { text: 'Sixty-three tickets just appeared. First move?', choices: [
        { t: 'Group them into one campaign case by sender domain and subject, then triage once.', pts: 3, fb: 'Deduplication turns 63 tasks into one decision. Clustering is a great automation target.' },
        { t: 'Split the 63 tickets across the team and work them one by one.', pts: 1, fb: 'It works, slowly, and each analyst risks reaching a different conclusion.' },
        { t: 'Ignore until the queue calms down.', pts: 0, fb: 'Some users will click while you wait.' }
      ]},
      { text: 'The domain was registered two days ago and hosts a fake login page. Next?', choices: [
        { t: 'Remove the message from every mailbox at all affected clients, block the domain, and check clicks and sign-ins from users who received it.', pts: 3, fb: 'Remove, block, then hunt for anyone who clicked or entered credentials.' },
        { t: 'Only reply to the reporters to say thanks.', pts: 0, fb: 'The unreported copies are still sitting in inboxes.' },
        { t: 'Block the domain only.', pts: 1, fb: 'Helps, but users on mobile or off-network may still reach it; remove the emails too.' }
      ]},
      { text: 'Three users clicked; one entered credentials. What now?', choices: [
        { t: 'Treat the credential entry as an account compromise: revoke sessions, reset, review sign-ins. Check the two clickers\' sign-ins too.', pts: 3, fb: 'Correct. The click alone may be harmless, but credential entry means compromise until proven otherwise.' },
        { t: 'Send the three users to awareness training and close.', pts: 1, fb: 'Training helps later; it does nothing about the stolen credentials now.' },
        { t: 'Nothing: MFA will stop them.', pts: 0, fb: 'Adversary-in-the-middle kits bypass many MFA methods.' }
      ]},
      { text: 'Afterwards, what would you automate first?', choices: [
        { t: 'Campaign clustering of reports, automatic cross-client search, and auto-drafted client notifications for analyst approval.', pts: 3, fb: 'This is where an MSSP has an edge over a single company: one campaign seen across many clients is caught faster for all of them.' },
        { t: 'An auto-reply to reporters only.', pts: 1, fb: 'Nice for users, small for the SOC.' },
        { t: 'Nothing, surges are rare.', pts: 0, fb: 'They are not rare, and they are when SLAs are most at risk.' }
      ]}
    ]
  },
  {
    id: 's3', title: 'Thursday 16:30: the wrong report', setting: 'Business systems incident · Your automation',
    summary: 'A client emails: "Why did we receive a security report for another company?"',
    log: 'report-bot  run 2026-10-30T16:02Z  status=success\n  generated 214 reports  delivered 214\n  client-088 report -> recipients of client-089 (!)\n  cause: contacts join on company name "Mthembu Holdings" (duplicate)',
    steps: [
      { text: 'First response?', choices: [
        { t: 'Pause the report automation (kill switch), tell your manager and the security/compliance lead immediately.', pts: 3, fb: 'Stop the harm, then escalate. A report containing one client\'s security data sent to another is a personal data and confidentiality incident.' },
        { t: 'Quietly fix the bug and hope nobody else noticed.', pts: 0, fb: 'Never. This may be a notifiable breach under POPIA or UK GDPR, and hiding it destroys trust.' },
        { t: 'Reply to the client yourself explaining the bug.', pts: 1, fb: 'Well-meant, but external communication about a potential breach goes through the agreed incident process.' }
      ]},
      { text: 'What caused this, really?', choices: [
        { t: 'Joining on a non-unique human-readable field (company name) instead of a stable customer ID.', pts: 3, fb: 'Yes. This is why a shared customer ID is a foundation, not a nice-to-have.' },
        { t: 'The email server.', pts: 0, fb: 'It delivered exactly what it was given.' },
        { t: 'Bad luck.', pts: 0, fb: 'Two clients with similar names is a certainty at 700 customers.' }
      ]},
      { text: 'Which controls would have prevented or caught it?', choices: [
        { t: 'Join on customer ID; assert that recipient domain matches the client\'s known domains; dry-run and diff before sending; a human approves the first run after any change.', pts: 3, fb: 'Defence in depth applies to your own automations too.' },
        { t: 'Send reports less often.', pts: 0, fb: 'Less frequent failure is still failure.' },
        { t: 'Add a disclaimer to the report.', pts: 0, fb: 'Disclaimers do not un-send data.' }
      ]},
      { text: 'How do you close it out?', choices: [
        { t: 'Blameless post-incident review, documented timeline, fixes with tests, and share lessons with the SOC and leadership.', pts: 3, fb: 'Owning mistakes openly is how an automation engineer earns long-term trust in a security company.' },
        { t: 'Turn off all automation permanently.', pts: 1, fb: 'Overcorrection. The manual process also makes mistakes; fix the controls instead.' },
        { t: 'Move on quickly.', pts: 0, fb: 'Without a review the same class of bug returns.' }
      ]}
    ]
  }
);
})();
