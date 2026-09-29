(function (H) {
COURSE.modules.push({
  id: 'm9', code: 'TK', title: 'Engineer\'s toolkit', tag: 'Hands-on skills',
  summary: 'Python for automation, KQL for security data, regex for indicators, and the habits that make automations safe to ship.',
  lessons: [
    {
      id: 'l1', title: 'Python for automation', mins: 18,
      summary: 'A production-shaped API client: pagination, retries, logging and secrets from the environment.',
      body: `
<p>Python is the common language of security automation. You need to be fluent with HTTP APIs, JSON, CSV, dates and logging. Here is the shape every API script should have.</p>
${H.code(`
import os, time, logging, requests

log = logging.getLogger("licence-sync")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

TOKEN = os.environ["GRAPH_TOKEN"]          # never hard-code secrets
SESSION = requests.Session()
SESSION.headers.update({"Authorization": f"Bearer {TOKEN}"})

def get_with_retry(url, max_attempts=5):
    for attempt in range(1, max_attempts + 1):
        resp = SESSION.get(url, timeout=30)
        if resp.status_code in (429, 500, 502, 503, 504):
            wait = int(resp.headers.get("Retry-After", 2 ** attempt))
            log.warning("transient %s, retry %s in %ss", resp.status_code, attempt, wait)
            time.sleep(wait)
            continue
        resp.raise_for_status()            # 4xx errors fail loudly
        return resp.json()
    raise RuntimeError(f"gave up after {max_attempts} attempts: {url}")

def get_all(url):
    """Follow @odata.nextLink until every page is read."""
    while url:
        page = get_with_retry(url)
        yield from page.get("value", [])
        url = page.get("@odata.nextLink")

if __name__ == "__main__":
    skus = list(get_all("https://graph.microsoft.com/v1.0/subscribedSkus"))
    for s in skus:
        log.info("%s consumed=%s enabled=%s", s["skuPartNumber"],
                 s["consumedUnits"], s["prepaidUnits"]["enabled"])
`, 'python')}
<h3>Habits to build now</h3>
<ul>
  <li>Virtual environments and pinned dependencies (<code>requirements.txt</code> or <code>pyproject.toml</code>).</li>
  <li>Type hints and small functions you can unit-test.</li>
  <li><code>pytest</code> with recorded sample API responses, so tests run without live credentials.</li>
  <li>A <code>--dry-run</code> flag on anything that writes.</li>
</ul>
`,
      takeaways: ['Secrets from environment or vault, never in code.', 'Retry transient errors with backoff and Retry-After; fail loudly on 4xx.', 'Always paginate to the end; add logging and dry-run.'],
      practice: ['Rewrite the script from memory. Add a --dry-run flag and a CSV export of the results.'],
      links: [['Requests library docs', 'https://requests.readthedocs.io/'], ['pytest docs', 'https://docs.pytest.org/']]
    },
    {
      id: 'l2', title: 'KQL essentials', mins: 18,
      summary: 'Kusto Query Language: how you ask Microsoft Sentinel and Defender questions.',
      body: `
<p>KQL is a read-only, pipe-based query language. Data flows left to right through operators separated by <code>|</code>.</p>
${H.table(['Operator', 'Does', 'SQL-ish equivalent'], [
  ['<code>where</code>', 'Filter rows', 'WHERE'],
  ['<code>project</code>', 'Choose or rename columns', 'SELECT'],
  ['<code>extend</code>', 'Add calculated columns', 'SELECT expr AS x'],
  ['<code>summarize</code>', 'Aggregate (count, dcount, make_set) by keys', 'GROUP BY'],
  ['<code>bin()</code>', 'Bucket timestamps', 'date_trunc'],
  ['<code>join</code>', 'Combine tables', 'JOIN'],
  ['<code>top</code> / <code>order by</code>', 'Sort and limit', 'ORDER BY … LIMIT']
])}
<h4>Failed sign-ins per user in the last day</h4>
${H.code(`
SigninLogs
| where TimeGenerated > ago(1d)
| where ResultType != "0"              // "0" means success
| summarize Failures = count(), IPs = dcount(IPAddress) by UserPrincipalName
| where Failures > 20
| order by Failures desc
`, 'kql')}
<h4>Successful sign-ins from more than one country in an hour</h4>
${H.code(`
SigninLogs
| where TimeGenerated > ago(7d) and ResultType == "0"
| extend Country = tostring(LocationDetails.countryOrRegion)
| summarize Countries = make_set(Country), CountryCount = dcount(Country)
    by UserPrincipalName, bin(TimeGenerated, 1h)
| where CountryCount > 1
`, 'kql')}
<h4>New inbox rules (a BEC warning sign)</h4>
${H.code(`
OfficeActivity
| where TimeGenerated > ago(7d)
| where Operation in ("New-InboxRule", "Set-InboxRule")
| project TimeGenerated, UserId, ClientIP, Parameters
`, 'kql')}
${H.note('tip', '<p>The free Microsoft "Kusto Detective Agency" and the Log Analytics demo workspace let you practise KQL without a client environment.</p>')}
`,
      takeaways: ['KQL pipes data through where, project, extend, summarize, join.', 'SigninLogs ResultType "0" = success.', 'Know the common tables: SigninLogs, AuditLogs, OfficeActivity, SecurityAlert, SecurityIncident.'],
      practice: ['Do the KQL drills lab.', 'Play the first case of Kusto Detective Agency.'],
      links: [['KQL overview', 'https://learn.microsoft.com/en-us/kusto/query/'], ['Kusto Detective Agency', 'https://detective.kusto.io/'], ['Log Analytics demo environment', 'https://aka.ms/lademo']]
    },
    {
      id: 'l3', title: 'Regex and indicator wrangling', mins: 12,
      summary: 'Extract, normalise and safely share IPs, domains, URLs and hashes.',
      body: `
<p>Indicators of compromise (IOCs) arrive buried in emails, logs and threat reports. Extracting them reliably is a daily task and a building block for enrichment.</p>
${H.table(['Indicator', 'Starter pattern', 'Notes'], [
  ['IPv4', '<code>\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b</code>', 'Validate each octet ≤ 255 in code; exclude private ranges for reputation lookups'],
  ['SHA-256', '<code>\\b[a-fA-F0-9]{64}\\b</code>', 'MD5 = 32 hex, SHA-1 = 40 hex'],
  ['Email', '<code>[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+</code>', 'Good enough for extraction, not validation'],
  ['URL', '<code>https?://[^\\s"\'&lt;&gt;]+</code>', 'Strip trailing punctuation; also match defanged hxxp']
])}
<h3>Defanging</h3>
<p>When sharing indicators in tickets, chats and reports, <strong>defang</strong> them so nobody clicks by accident and tools do not auto-link: <code>hxxps://evil[.]example[.]com</code>, <code>203.0.113[.]7</code>. Your code must also <strong>refang</strong> before doing lookups.</p>
${H.code(`
import re
IPV4 = re.compile(r"\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b")

def refang(text: str) -> str:
    return (text.replace("hxxp", "http").replace("[.]", ".")
                .replace("(.)", ".").replace("[:]", ":"))

def valid_ip(ip: str) -> bool:
    return all(0 <= int(p) <= 255 for p in ip.split("."))

ips = [ip for ip in IPV4.findall(refang(report)) if valid_ip(ip)]
`, 'python')}
${H.note('tip', '<p>The <a href="#lab.ioc">IOC extractor lab</a> is a working tool built on these patterns. Paste any text in and inspect what it finds.</p>')}
`,
      takeaways: ['Extract with regex, then validate in code.', 'Defang for humans, refang for machines.', 'Exclude private and reserved ranges before reputation lookups.'],
      practice: ['Use the IOC extractor lab on a real public threat report (for example a CISA advisory).'],
      links: [['regex101 (practice)', 'https://regex101.com/'], ['CISA advisories', 'https://www.cisa.gov/news-events/cybersecurity-advisories']]
    },
    {
      id: 'l4', title: 'Shipping safely', mins: 12,
      summary: 'Treat every automation as a product with an owner, tests, monitoring and a kill switch.',
      body: `
<h3>The automation definition of done</h3>
${H.table(['Item', 'Question'], [
  ['Owner', 'Who is paged when it breaks?'],
  ['Version control', 'Is the code, flow export and prompt in git?'],
  ['Review', 'Did someone else read the change?'],
  ['Tests', 'Unit tests on logic; a golden set for AI steps; a dry run on real data'],
  ['Least privilege', 'Does its identity have only the permissions it needs?'],
  ['Secrets', 'Are credentials in a vault, and rotated?'],
  ['Logging', 'Can you reconstruct what it did for any run?'],
  ['Monitoring', 'Will you know if it fails or stops running (heartbeat)?'],
  ['Kill switch', 'Can someone turn it off in under a minute without you?'],
  ['Runbook', 'Can the SOC on-call handle a failure at 03:00 without calling you?'],
  ['Value metric', 'What number proves it is worth running?']
])}
<h3>Rollout sequence</h3>
${H.flow(['Lab tenant', 'Dry run on production data', 'Shadow mode', 'One friendly client or team', 'Gradual rollout', 'Review after 30 days'])}
${H.note('j2', '<p>A short, consistent "automation card" (one page per automation with the items above) builds trust with the SOC and leadership faster than any demo.</p>')}
`,
      takeaways: ['Owner, git, review, tests, least privilege, secrets, logs, monitoring, kill switch, runbook, metric.', 'Roll out from lab to shadow to gradual production.', 'Document each automation on a one-page card.'],
      practice: ['Write an automation card for the phishing triage copilot from module 7.'],
      links: [['Google SRE book (free)', 'https://sre.google/sre-book/table-of-contents/']]
    }
  ],
  quiz: [
    { q: 'In SigninLogs, what does ResultType "0" indicate?', options: ['Failure', 'Success', 'MFA required', 'Unknown'], answer: 1, why: '"0" is a successful sign-in; other codes are errors or interrupts.' },
    { q: 'Which KQL operator aggregates rows by keys?', options: ['project', 'where', 'summarize', 'extend'], answer: 2, why: 'summarize is KQL\'s GROUP BY.' },
    { q: 'What is "defanging" an indicator?', options: ['Deleting it', 'Modifying it (hxxp, [.]) so it cannot be clicked or auto-linked', 'Encrypting it', 'Hashing it'], answer: 1, why: 'Defanging makes indicators safe to share; refang before machine lookups.' },
    { q: 'Your script gets HTTP 429 from an API. The right response is…', options: ['Fail immediately', 'Retry immediately in a tight loop', 'Wait for Retry-After (or back off exponentially) and retry', 'Switch to a different account'], answer: 2, why: '429 means throttled; respect Retry-After.' },
    { q: 'A SHA-256 hash is how many hex characters?', options: ['32', '40', '64', '128'], answer: 2, why: 'MD5 32, SHA-1 40, SHA-256 64.' },
    { q: 'Which is part of the automation definition of done?', options: ['A kill switch someone else can use', 'Admin rights for convenience', 'Secrets in the code for portability', 'No logs to save storage'], answer: 0, why: 'Others must be able to stop an automation quickly.' }
  ]
});
})(window.H);
