(function (H) {
COURSE.modules.push({
  id: 'm8', code: 'BS', title: 'Business systems engineering', tag: 'Back office',
  summary: 'The MSSP back office, integration patterns, secure API access to Microsoft 365, billing reconciliation and automated reporting.',
  lessons: [
    {
      id: 'l1', title: 'The MSSP back-office map', mins: 12,
      summary: 'The systems that run the business, and the idea of a source of truth.',
      body: `
${H.table(['System', 'Holds', 'Common products'], [
  ['CRM', 'Leads, accounts, contacts, opportunities, scorecard results', 'HubSpot, Salesforce, Dynamics 365, Zoho'],
  ['PSA (professional services automation)', 'Tickets, contracts, agreements, time, SLAs, often billing', 'ConnectWise PSA, Autotask, HaloPSA'],
  ['RMM (remote monitoring &amp; management)', 'Device inventory, agents, patching (more MSP than MSSP)', 'NinjaOne, N-able, ConnectWise Automate'],
  ['Accounting / billing', 'Invoices, payments, revenue', 'Xero, Sage, QuickBooks, Dynamics'],
  ['Documentation', 'Client runbooks, configs, contacts', 'IT Glue, Hudu, SharePoint, Confluence'],
  ['Vendor consoles', 'Licences, seats, tenant configs', 'Mimecast, IRONSCALES, DTEX, EDR and backup portals, Microsoft Partner Center'],
  ['Collaboration', 'Chat, alerts, approvals', 'Microsoft Teams, Slack, email'],
  ['BI / reporting', 'Dashboards and client reports', 'Power BI, Looker Studio, Grafana, Metabase']
])}
<h3>Source of truth</h3>
<p>For every important fact, decide which one system owns it, and make every other system copy from there. Typical choices:</p>
<ul>
  <li>Customer identity and contacts → CRM</li>
  <li>What the customer bought (contract lines, quantities, prices) → PSA or CRM, but only one</li>
  <li>What is actually deployed (seats, endpoints, mailboxes) → vendor consoles and Microsoft 365, pulled automatically</li>
  <li>Invoices → accounting system</li>
</ul>
<p>Most back-office pain comes from two systems both believing they own the same fact.</p>
${H.note('j2', '<p>A shared customer ID across CRM, PSA, SIEM workspaces, vendor consoles and accounting is the single most useful thing you can establish. Every later integration and report gets easier.</p>')}
${H.note('verify', '<p>Inventory J2\'s actual systems in week one: name, owner, what it holds, how it is accessed (API? export?), and which system it syncs with.</p>')}
`,
      takeaways: ['Know CRM, PSA, RMM, accounting, documentation, vendor consoles and BI.', 'Every fact needs exactly one owning system.', 'A shared customer ID across systems unlocks everything else.'],
      practice: ['Create a blank systems inventory table (system, owner, data, API, syncs with). You will fill it in on day one.'],
      links: []
    },
    {
      id: 'l2', title: 'Integration patterns that survive production', mins: 16,
      summary: 'APIs, webhooks, iPaaS and the reliability habits that separate scripts from systems.',
      body: `
<h3>Ways systems talk</h3>
${H.table(['Pattern', 'Use when', 'Watch out for'], [
  ['REST API polling', 'No events available; periodic sync', 'Rate limits, pagination, missed changes between polls'],
  ['Webhooks', 'The source can push events', 'Signature verification, retries, duplicate delivery, ordering'],
  ['iPaaS / low-code (Power Automate, Logic Apps, n8n, Make, Zapier)', 'Fast integrations, business-owned flows', 'Sprawl, hidden credentials, weak version control and testing'],
  ['Custom service (Python, Azure Functions)', 'Complex logic, high volume, strong testing needs', 'You own hosting, monitoring and patching'],
  ['Scheduled ETL/ELT into a warehouse', 'Reporting and analytics across systems', 'Freshness, schema changes, data quality']
])}
<h3>Reliability habits</h3>
<dl>
  <dt>Idempotency</dt><dd>Running the same operation twice has the same effect as once. Use natural keys ("invoice for client-042, 2026-10") so retries do not create duplicates.</dd>
  <dt>Retries with exponential backoff</dt><dd>Retry transient failures (timeouts, HTTP 429/503) with growing delays; respect <code>Retry-After</code>. Never retry 400-class validation errors blindly.</dd>
  <dt>Dead-letter queue</dt><dd>Items that keep failing go somewhere visible for a human, not into a silent void.</dd>
  <dt>Pagination</dt><dd>Always follow next links or cursors to the end. The classic bug is processing only the first page.</dd>
  <dt>Observability</dt><dd>Structured logs, run IDs, success and failure counts, and a heartbeat alert when a scheduled job does not run.</dd>
  <dt>Dry-run mode</dt><dd>Every automation that writes data should be able to report what it would do without doing it.</dd>
</dl>
${H.note('warn', '<p>Low-code flows are real production code. Keep them exported in git, owned by a service account, documented and monitored, or they become the next generation of integration debt.</p>')}
`,
      takeaways: ['Choose polling, webhooks, iPaaS, custom code or ETL by need.', 'Idempotency, backoff, dead-letter queues, pagination and heartbeats are non-negotiable.', 'Treat low-code flows as production code.'],
      practice: ['Explain in your own words why webhooks need idempotent handlers.'],
      links: [['Microsoft Graph throttling guidance', 'https://learn.microsoft.com/en-us/graph/throttling'], ['n8n documentation', 'https://docs.n8n.io/'], ['Power Automate documentation', 'https://learn.microsoft.com/en-us/power-automate/']]
    },
    {
      id: 'l3', title: 'Secure access to Microsoft 365 at scale', mins: 16,
      summary: 'App registrations, OAuth client credentials, Graph permissions, GDAP and secrets.',
      body: `
<h3>How an automation authenticates to Microsoft Graph</h3>
${H.flow(['App registration in Entra ID', 'Grant least-privilege application permissions', 'Admin consent in the tenant', 'Client credentials flow (certificate or secret)', 'Access token', 'Call Graph API'])}
${H.code(`
POST https://login.microsoftonline.com/{tenant-id}/oauth2/v2.0/token
  client_id=...            # the app registration
  scope=https://graph.microsoft.com/.default
  grant_type=client_credentials
  client_assertion=...     # certificate-based: preferred over a client secret

GET https://graph.microsoft.com/v1.0/subscribedSkus
Authorization: Bearer <token>
`, 'http')}
<h3>Least privilege in practice</h3>
${H.table(['Need', 'Too broad', 'Better'], [
  ['Count licences', '<code>Directory.ReadWrite.All</code>', '<code>Organization.Read.All</code> (read <code>subscribedSkus</code>)'],
  ['Read sign-in logs', 'Global Administrator', '<code>AuditLog.Read.All</code>'],
  ['Remove a phishing email', 'Full mailbox access to everyone', 'The security tool\'s own remediation API, or scoped permissions with approval']
])}
<h3>Multi-tenant MSSP access</h3>
<ul>
  <li>Microsoft partners manage customer tenants through <strong>GDAP</strong> (Granular Delegated Admin Privileges): time-bound, role-scoped access per customer, replacing the old all-powerful DAP.</li>
  <li>Each client tenant needs its own consent. Track which tenants have which apps consented, and when access expires.</li>
</ul>
<h3>Secrets hygiene</h3>
<ul>
  <li>Store secrets in a vault (Azure Key Vault or similar), never in code, flow definitions or tickets.</li>
  <li>Prefer certificates or managed identities over client secrets; rotate on a schedule.</li>
  <li>Never log tokens. Scrub <code>Authorization</code> headers from debug output.</li>
</ul>
${H.note('warn', '<p>An MSSP automation identity with broad permissions across hundreds of tenants is exactly what supply-chain attackers look for. Scope it narrowly, monitor its sign-ins and alert on anomalies, just as the SOC would for a client.</p>')}
`,
      takeaways: ['App registration + least-privilege application permissions + client credentials.', 'GDAP gives partners time-bound, role-scoped access per customer.', 'Vault secrets, prefer certificates or managed identities, never log tokens.'],
      practice: ['Create a free Microsoft 365 developer or trial tenant (if eligible), register an app, and call GET /organization with Graph Explorer or Python.'],
      links: [['Microsoft Graph overview', 'https://learn.microsoft.com/en-us/graph/overview'], ['Microsoft identity platform: client credentials flow', 'https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-client-creds-grant-flow'], ['GDAP introduction', 'https://learn.microsoft.com/en-us/partner-center/customers/gdap-introduction']]
    },
    {
      id: 'l4', title: 'Billing reconciliation: finding revenue leakage', mins: 14,
      summary: 'The classic MSSP automation: compare what is deployed, what is contracted and what is invoiced.',
      body: `
<p>Clients add users, mailboxes and devices constantly. If nobody updates the contract or invoice, J2 delivers (and pays vendors for) more than it bills. The reverse also happens: clients billed for seats they no longer have, which damages trust.</p>
${H.flow(['Pull deployed counts (M365, EDR, email, backup)', 'Pull contracted quantities (PSA/CRM)', 'Pull invoiced quantities (accounting)', 'Join on customer ID + service', 'Flag differences over tolerance', 'Ticket to account manager', 'Approved change updates contract &amp; invoice'])}
${H.table(['Client', 'Service', 'Deployed', 'Contracted', 'Invoiced', 'Flag'], [
  ['client-017', 'Email security', '412', '350', '350', '<span class="chip bad">Under-billed 62</span>'],
  ['client-042', 'Endpoint', '188', '200', '200', '<span class="chip">Within tolerance</span>'],
  ['client-091', 'Backup', '75', '120', '120', '<span class="chip warn">Over-billed 45</span>'],
  ['client-103', 'Email security', '95', '95', '80', '<span class="chip bad">Invoice mismatch 15</span>']
])}
<p class="small muted">Example data for illustration.</p>
<h3>Design choices</h3>
<ul>
  <li><strong>Tolerance bands</strong> (for example ±5% or ±3 seats) so small fluctuations do not create noise.</li>
  <li><strong>Human in the loop</strong> for commercial changes. The automation raises the question; the account manager decides.</li>
  <li><strong>History</strong>: store monthly snapshots so you can show trends and back-date conversations.</li>
  <li><strong>Mapping table</strong> from vendor SKUs to J2 service names. It is always messier than expected.</li>
</ul>
${H.note('tip', '<p>Try the <a href="#lab.recon">billing reconciliation lab</a>. A working reconciliation in your first 60 days is a very visible win with finance and leadership.</p>')}
`,
      takeaways: ['Reconcile deployed vs contracted vs invoiced per client and service.', 'Use tolerances, human approval and monthly snapshots.', 'The SKU-to-service mapping table is the hard part.'],
      practice: ['Do the billing reconciliation lab.'],
      links: [['Microsoft Graph: subscribedSkus', 'https://learn.microsoft.com/en-us/graph/api/subscribedsku-list']]
    },
    {
      id: 'l5', title: 'Automated client reporting', mins: 12,
      summary: 'Turning the monthly report scramble into a pipeline.',
      body: `
${H.flow(['Scheduled extract (SIEM, PSA, email, EDR)', 'Store in reporting DB', 'Compute KPIs per client', 'Render template', 'LLM drafts executive summary', 'Analyst/AM reviews', 'Deliver &amp; log'])}
<h3>What a strong monthly report contains</h3>
<ol>
  <li>Executive summary: three to five sentences a CEO will read.</li>
  <li>Headline numbers: alerts triaged, incidents, phishing reported and removed, SLA attainment.</li>
  <li>Notable incidents with outcome and lessons.</li>
  <li>Trends vs last month and last quarter.</li>
  <li>Open risks and recommended actions (links back to the scorecard).</li>
</ol>
<h3>Guardrails for LLM-written summaries</h3>
<ul>
  <li>The LLM receives only computed numbers and approved incident notes for <em>that</em> client.</li>
  <li>Instruct it to use only the provided figures; validate that every number in its text exists in the input.</li>
  <li>A named person approves before sending. Log the approved version.</li>
</ul>
${H.note('j2', '<p>Reports are the product clients see most. Better, faster reports support renewals and upsell, and give account managers something to talk about.</p>')}
`,
      takeaways: ['Extract → compute → template → LLM summary → human review → deliver.', 'LLM gets only that client\'s computed figures; numbers are validated.', 'Reports drive renewals; they are a revenue feature.'],
      practice: ['Write a prompt for the executive summary that forbids numbers not present in the input, then write the validation rule in pseudo-code.'],
      links: [['Power BI documentation', 'https://learn.microsoft.com/en-us/power-bi/']]
    }
  ],
  quiz: [
    { q: 'Why must webhook handlers be idempotent?', options: ['Webhooks are always delivered exactly once', 'Senders retry and may deliver duplicates; processing twice must not double the effect', 'For faster rendering', 'Because of DMARC'], answer: 1, why: 'At-least-once delivery means duplicates happen.' },
    { q: 'Your Graph automation only needs licence counts. Which permission fits least privilege?', options: ['Global Administrator', 'Directory.ReadWrite.All', 'Organization.Read.All', 'Mail.ReadWrite'], answer: 2, why: 'subscribedSkus can be read with Organization.Read.All.' },
    { q: 'What is GDAP?', options: ['A backup format', 'Granular Delegated Admin Privileges for Microsoft partners managing customer tenants', 'A DMARC tag', 'A SIEM query language'], answer: 1, why: 'GDAP provides time-bound, least-privilege partner access per customer.' },
    { q: 'A reconciliation shows 412 deployed seats, 350 contracted and 350 invoiced. What next?', options: ['Silently invoice 412', 'Raise a ticket for the account manager to agree a contract change with the client', 'Delete 62 users', 'Ignore it'], answer: 1, why: 'Commercial changes need human agreement; the automation surfaces the gap.' },
    { q: 'The best place to store an automation\'s client secret is…', options: ['In the script', 'In a ticket for reference', 'In a secrets vault such as Azure Key Vault', 'In the flow description'], answer: 2, why: 'Vaults control access, audit use and support rotation.' },
    { q: 'What is the most common pagination bug?', options: ['Requesting too many pages', 'Processing only the first page of results', 'Using JSON', 'Using HTTPS'], answer: 1, why: 'Failing to follow next links silently drops data.' }
  ]
});
})(window.H);
