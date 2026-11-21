# Search log — WSLIT

**Status: Specified (documentation only). Stage 1A syntax validation complete;
Stage 1B.5 documentation amendments applied. No literature search executed.**
Section 6 (literature-search execution log) and section 8 (snowballing) remain
empty; section 10 now defines the approved 13-category PRISMA template and an
**ILLUSTRATIVE ONLY — NOT RESEARCH RESULTS** arithmetic example, with no real
counts. No `REC-`, `REP-` or `LIT-` identifier has been assigned; no paper has been
collected, screened or scored.

All validation took place on **2026-11-20 (UTC)**. "Validated" below means a query
was actually sent to the named platform and a response was received; it does
**not** mean a literature search was run or that papers were collected.

## 1. How to use this log

1. Copy the canonical query from `methodology.md §6.2` and translate it using
   `methodology.md §6.3`.
2. Run a **validation query** first; record whether all operators are supported.
3. If the string had to change, record both the proposed and validated string in
   section 4, and any protocol-level change in `decision-log.md §6` for approval.
4. Only after human release, run the full search and populate section 6.
5. Link every resulting `REC-` ID in `data/screening-register.csv` to its `S-` ID.

## 2. Planned searches (NOT executed)

Exact proposed strings are in `methodology.md §6.3`. This table is a coverage
checklist, not evidence of execution.

| Area | Canonical expression | Databases planned | Historical lower bound (upper = `D_EXEC`) | Literature search executed? |
| --- | --- | --- | --- | --- |
| 1 | `A AND B` | ACM DL, IEEE Xplore, Scopus, WoS, SpringerLink, ScienceDirect, arXiv, Semantic Scholar | 2018 | NO |
| 2 | `C AND (A OR D OR E)` | ACM DL, IEEE Xplore, Scopus, WoS, SpringerLink, ScienceDirect, arXiv, Semantic Scholar | 2010 | NO |
| 3 | `D AND (A OR "AI system*" OR "high-risk AI")` | ACM DL, IEEE Xplore, Scopus, WoS, SpringerLink, ScienceDirect, arXiv, Semantic Scholar | 2016 | NO |
| 4 | `E AND (A OR C OR D)` | ACM DL, IEEE Xplore, Scopus, WoS, SpringerLink, ScienceDirect, arXiv, Semantic Scholar | 2012 | NO |
| 5 | `F AND (A OR "AI system*" OR "software agent*")` | ACM DL, IEEE Xplore, Scopus, WoS, SpringerLink, ScienceDirect, arXiv, Semantic Scholar | 2000 | NO |
| 6 | `G AND (A OR D OR "decision log*" OR "AI system*")` | ACM DL, IEEE Xplore, Scopus, WoS, SpringerLink, ScienceDirect, arXiv, Semantic Scholar | 2000 | NO |
| 7 | `H AND (A OR B)` | ACM DL, IEEE Xplore, Scopus, WoS, SpringerLink, ScienceDirect, arXiv, Semantic Scholar | 2019 | NO |

> **AUD-02 date-window precedence:** the years above are historical lower bounds
> only. The upper boundary of every search is the actual execution date `D_EXEC`
> in UTC; no search may include a future publication date relative to its
> execution timestamp. The actual date range sent to each platform is recorded
> in §6. Publication, online-first, repository-submission and preprint-version
> dates remain distinct. Fixed `2026` end years appearing in §3 and §4, and the
> Scopus `PUBYEAR < 2027` boundary appearing in §3.2 below, are **historical Stage 1A
> probe strings**, not current search rules; the authoritative upper boundary is
> `D_EXEC` (Scopus `<D_EXEC year+1>`). After retrieval, any record with a
> publication date later than `D_EXEC` is excluded before screening under the
> documented date rule and counted at PRISMA category 4 (methodology §15.1).

> D5: Scopus / Web of Science availability is unconfirmed. Stage 1A found **no
> evidence of licensed access** to either platform (§3.1). This gap is disclosed.

## 3. Stage 1A — platform access and syntax validation

### 3.1 Platform summary

| Platform | Access status | Date (UTC) | Area 1 query executed? | Usable bibliographic metadata? |
| --- | --- | --- | --- | --- |
| Crossref REST API | ACCESSIBLE (rate-limited after 2 successful calls) | 2026-11-20 | YES | YES |
| OpenAlex API | ACCESSIBLE (no API key; shared budget notice) | 2026-11-20 | YES | YES |
| DataCite REST API | ACCESSIBLE | 2026-11-20 | YES | YES |
| arXiv API | RATE_LIMITED — HTTP 429 "Rate exceeded." on all attempts | 2026-11-20 | NO | NO |
| Semantic Scholar API | RATE_LIMITED — HTTP 429 on both attempts | 2026-11-20 | NO | NO |
| ACM Digital Library | BLOCKED — HTTP 403 Cloudflare "Just a moment..." | 2026-11-20 | NO | NO |
| Scopus | BLOCKED — HTTP 403 Cloudflare "Attention Required!"; no licensed access verified | 2026-11-20 | NO | NO |
| Web of Science | PARTIAL — HTTP 200 SPA shell only; advanced-search help 403 | 2026-11-20 | NO | NO |
| IEEE Xplore | PARTIAL — HTTP 200 JS shell; no server-side results or count | 2026-11-20 | NO | NO |
| SpringerLink | BLOCKED — HTTP 200 "Client Challenge" bot page | 2026-11-20 | NO | NO |
| ScienceDirect | BLOCKED — HTTP 403 (TDM reservation page, no results) | 2026-11-20 | NO | NO |
| DBLP API | BLOCKED — HTTP 202 Anubis proof-of-work bot challenge | 2026-11-20 | NO | NO |
| Google Scholar | BLOCKED — HTTP 200 redirect to "Verifying..." session check | 2026-11-20 | NO | NO |

### 3.2 Area 1 validation detail

| Platform | Original query (Stage 0 §6.3) | Validated query (actually sent) | Syntax changes | Filters supported (observed) | Result count genuinely obtained | Metadata availability | Limitations / observations |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Crossref | `GET /works?query.bibliographic=agentic+AI+security+guardrail&rows=5` | `GET /works?query.bibliographic=agentic+AI+security+guardrail&rows=1&select=DOI,title,published,container-title,type` → HTTP 200 | `rows` 5→1 (probe); `select` added to test field restriction; no logical change | `select` confirmed; `filter=from-pub-date:,until-pub-date:` attempted but returned 429 → **unvalidated** | API field `total-results = 1376713` (see §3.5) | DOI, title, published, container-title, type returned | Third rapid call returned HTTP 429 (shared-IP limit). `query.bibliographic` is relevance search, not Boolean; no phrase or field operators. |
| OpenAlex | `GET /works?search=<title>&per-page=25` | `GET /works?search=agentic+AI+security+guardrail&filter=from_publication_date:2018-01-01,to_publication_date:2026-12-31,type:article&per-page=1&select=id,doi,title,publication_year` → HTTP 200 | `per-page` 25→1 (probe); `filter` and `select` added and confirmed | `from_publication_date`, `to_publication_date`, `type` confirmed; `!` negation documented but not tested | API field `meta.count = 3059` with filters (see §3.5) | id, doi, title, publication_year returned | Response warns no API key: shared free daily budget. `search=` is free-text, not Boolean. |
| DataCite | `GET /dois?query=<title>` | `GET /dois?query=agentic+AI+security&filter=publicationYear:2024&page[size]=1` → HTTP 200 | `filter` and `page[size]` added and confirmed | `publicationYear` confirmed; date-range filters documented but not tested | API field `meta.total = 3486` (see §3.5) | id, type, attributes (DOI, creators, titles) returned | DOI registry, not a comprehensive discovery index; `query=` is free-text. |
| arXiv API | `search_query=(all:"agentic AI" OR all:"LLM agent" OR all:"tool-using agent") AND (all:security OR all:"prompt injection" OR all:guardrail) AND (cat:cs.AI OR cat:cs.CR OR cat:cs.CL)&start=0&max_results=200&sortBy=submittedDate&sortOrder=descending` | **None executed** — HTTP variant timed out; HTTPS returned 429 "Rate exceeded." twice, including a minimal `all:electron` probe | None | Official manual confirms `AND`, `OR`, `ANDNOT`, quoted phrases, field prefixes (`all:`, `cat:`, `ti:`, `abs:`); **no wildcard syntax documented** | None | None | Syntax checked against the official arXiv API user manual only, not live. `*` operators must not be assumed valid. |
| Semantic Scholar API | `?query=agentic+AI+security+guardrail&year=2018-2026&limit=100&fields=title,abstract,year,venue,externalIds,citationCount,openAccessPdf` | **None executed** — HTTP 429 "Too Many Requests" twice (with and without `year`) | None | Not validated | None | None | Requires API key for higher rate limits. `year=2018-2026` syntax unvalidated. |
| ACM DL | `("agentic AI" OR "LLM agent*" OR "autonomous agent*" OR "tool-using agent*") AND (security OR guardrail* OR "prompt injection" OR "excessive agency")` | **None executed** — HTTP 403 on search URL and on help page (both direct fetch and webfetch) | None | Not validated | None | None | Cloudflare challenge. Field selectors (`AllField`) appear only in the attempted URL, not in a response; not confirmed. |
| IEEE Xplore | `("All Metadata":"agentic AI" OR "All Metadata":"LLM agent" OR "All Metadata":"tool-using agent") AND ("All Metadata":security OR "All Metadata":"prompt injection" OR "All Metadata":guardrail)` | **None validated** — HTTP 200 returned a JS application shell titled "IEEE Xplore Search Results" | None | Client-side field labels observed (`title:Document Title`, `documentAbstract:Abstract`, `Publication Title`); `"All Metadata:"` string **absent** from returned HTML | None | None | No server-side records or result count; requires browser/JS and likely institutional session. Command syntax remains unverified. |
| Scopus | `TITLE-ABS-KEY(...) AND PUBYEAR > 2017 AND PUBYEAR < 2027 AND (LIMIT-TO(DOCTYPE,"ar") OR LIMIT-TO(DOCTYPE,"cp"))` | **None executed** — HTTP 403 Cloudflare; help URL returned 404 | None | Not validated | None | None | No licensed access verified. `TITLE-ABS-KEY`, `PUBYEAR`, `LIMIT-TO` are **unverified**. |
| Web of Science | `TS=(("agentic AI" OR "LLM agent*" OR ...) AND (...)) AND PY=(2018-2026)` | **None executed** — base URL returned a 2,705-byte SPA shell; advanced-search help article HTTP 403 | None | Not validated | None | None | `TS=`, `PY=` unverified. No licensed access verified. |
| SpringerLink | `"agentic AI" AND (security OR "prompt injection" OR guardrail*)` | **None executed** — HTTP 200 "Client Challenge" bot page | None | Not validated | None | None | Bot challenge prevents interface inspection. |
| ScienceDirect | `("agentic AI" OR "LLM agent*" OR "tool-using agent*") AND (security OR "prompt injection" OR guardrail* OR "excessive agency")` | **None executed** — HTTP 403 | None | Not validated | None | None | TDM-reservation page returned; no result data. |
| DBLP | `q=agentic AI security` | **None executed** — HTTP 202 Anubis bot challenge (direct fetch and webfetch) | None | Not validated | None | None | `format=json`, `h=1` parameters could not be exercised. |
| Google Scholar | `"agentic AI" security guardrails` | **None executed** — HTTP 200 redirect to `google.com/sgsync` "Verifying..." | None | Not validated | None | None | No API; session verification blocks access. |

### 3.3 Syntax rules actually checked

| Source | Rule confirmed | Evidence |
| --- | --- | --- |
| Official arXiv API user manual (HTTP 200) | Boolean `AND`, `OR`, `ANDNOT`; quoted phrases via `%22`; field prefixes including `all:`, `cat:`, `ti:`, `abs:`; `start` / `max_results` pagination | `https://info.arxiv.org/help/api/user-manual.html` |
| Official OpenAlex help (HTTP 200) | `filter=attribute:value,attribute2:value2`; convenience filters `from_publication_date`, `to_publication_date`; negation `!` | `https://docs.openalex.org/how-to-use-the-api/get-lists-of-entities/filter-entity-lists`, `.../search-works` |
| DataCite API root docs (HTTP 200) | Query/filter documentation available; `filter=publicationYear:2024` confirmed empirically | `https://api.datacite.org/` plus validated request in §3.2 |
| Crossref API (empirical) | `query.bibliographic`, `rows`, `select` confirmed; `filter` not confirmed (429) | §3.2 |
| IEEE Xplore response (empirical) | Client-side field labels exist, but no `All Metadata` command syntax in returned HTML | §3.2 |
| ACM, Scopus, WoS, Springer, ScienceDirect, DBLP, Google Scholar, Semantic Scholar | **No syntax confirmation obtained** | §3.1–3.2 |

> **Wildcard finding:** Stage 0 proposes `*` truncation, often **inside quoted
> phrases** (e.g. `"LLM agent*"`, `"AI system*"`, `"decision log*"`). Support is
> unconfirmed on every blocked platform and is **not documented** in the arXiv API
> manual. This is logged as a proposed change in §7; it has **not** been applied to
> `methodology.md`.

### 3.4 Static compatibility check — areas 2–7 (not executed)

| Area | Canonical expression | Compatibility issue identified | Validation status |
| --- | --- | --- | --- |
| 2 | `C AND (A OR D OR E)` | Three-block nested OR; no Boolean support in Crossref / OpenAlex / DataCite; needs decomposition or separate block queries | Static only |
| 3 | `D AND (A OR "AI system*" OR "high-risk AI")` | Wildcard inside a quoted phrase; unverified | Static only |
| 4 | `E AND (A OR C OR D)` | `"risk model*"`, `"autonomy level*"` wildcard-in-phrase; L0–L4 inversion warning applies during screening | Static only |
| 5 | `F AND (A OR "AI system*" OR "software agent*")` | Wildcard-in-phrase; classic reference-monitor literature from 2000 (lower bound; upper = `D_EXEC`) may need a separate query | Static only |
| 6 | `G AND (A OR D OR "decision log*" OR "AI system*")` | Wildcard-in-phrase; `"immutable log*"` is a **search synonym only** and must not be read as a tamper-proof claim (D1) | Static only |
| 7 | `H AND (A OR B)` | `"adversarial benchmark*"`, `red team*` truncation unverified | Static only |

No query in areas 2–7 was sent to any platform in Stage 1A.

### 3.5 API response totals — observed, NOT literature counts

| Platform | Validated string | API total field | Value | Use |
| --- | --- | --- | --- | --- |
| Crossref | `query.bibliographic=agentic AI security guardrail` | `message.total-results` | 1376713 | Syntax evidence only; **not** a literature-search hit count |
| OpenAlex | `search=…` + date/type filters | `meta.count` | 3059 | Syntax evidence only; **not** a literature-search hit count |
| OpenAlex | `search=…` (no filters) | `meta.count` | 9539 | Syntax evidence only; **not** a literature-search hit count |
| DataCite | `query=agentic AI security` + `publicationYear:2024` | `meta.total` | 3486 | Syntax evidence only; **not** a literature-search hit count |

These numbers must not be transcribed into PRISMA "records identified" counts.

### 3.6 Stage 1A limitations

- Only 3 of 13 platforms executed a query; 10 supplied no usable response.
- No licensed Scopus or Web of Science access was verified.
- Rate limits (Crossref, OpenAlex budget notice, arXiv, Semantic Scholar) prevent
  treating these probes as capacity tests.
- IEEE Xplore, WoS and Google Scholar returned JS/session shells; browser-based
  validation with appropriate credentials would be needed.
- Syntax documentation could not be retrieved for ACM, Scopus (help 404), IEEE
  (help 404), or Semantic Scholar (DNS failure on docs host).
- Validation of Area 1 does **not** validate areas 2–7 (§3.4).

## 4. Syntax validation record

| validation_id | search_id | proposed_string | validated_string | operators_supported | operators_replaced | date_utc | notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| V-01 | — | Crossref `GET /works?query.bibliographic=…&rows=5` | `…&rows=1&select=DOI,title,published,container-title,type` | `query.bibliographic`, `rows`, `select` | none (probe limit changed) | 2026-11-20 | HTTP 200; `filter` unvalidated (429) |
| V-02 | — | OpenAlex `GET /works?search=…&per-page=25` | `…&filter=from_publication_date:2018-01-01,to_publication_date:2026-12-31,type:article&per-page=1&select=id,doi,title,publication_year` | `search`, `filter`, `per-page`, `select` | none (probe limit changed) | 2026-11-20 | HTTP 200; no API key (shared budget) |
| V-03 | — | DataCite `GET /dois?query=…` | `…&query=agentic+AI+security&filter=publicationYear:2024&page[size]=1` | `query`, `filter=publicationYear:…`, `page[size]` | none | 2026-11-20 | HTTP 200 |
| V-04 | — | arXiv §6.3.7 string | none | documented only: `AND`/`OR`/`ANDNOT`, phrases, fields | none | 2026-11-20 | HTTP/HTTPS 429; not live-validated |
| V-05 | — | Semantic Scholar §6.3.9 string | none | none | none | 2026-11-20 | HTTP 429 twice |
| V-06 | — | ACM DL §6.3.1 string | none | none | none | 2026-11-20 | HTTP 403 Cloudflare |
| V-07 | — | IEEE Xplore §6.3.2 string | none | client field labels only; `All Metadata:` absent | none | 2026-11-20 | JS shell, no metadata |
| V-08 | — | Scopus §6.3.3 string | none | none | none | 2026-11-20 | HTTP 403; no licensed access |
| V-09 | — | WoS §6.3.4 string | none | none | none | 2026-11-20 | SPA shell; help 403 |
| V-10 | — | SpringerLink §6.3.5 string | none | none | none | 2026-11-20 | "Client Challenge" |
| V-11 | — | ScienceDirect §6.3.6 string | none | none | none | 2026-11-20 | HTTP 403 |
| V-12 | — | DBLP §6.3.8 string | none | none | none | 2026-11-20 | Anubis challenge (202) |
| V-13 | — | Google Scholar §6.3.10 string | none | none | none | 2026-11-20 | Session verification |

## 5. Proposed changes requiring human approval (NOT applied)

| ID | Proposed change | Reason | Status |
| --- | --- | --- | --- |
| P1 | For Crossref / OpenAlex / DataCite, translate canonical Boolean expressions into separate keyword queries per block, or use API filters; do not submit Boolean strings to these APIs. | These APIs support free-text `search`/`query`, not `AND`/`OR`/field operators (§3.2–3.4). | **Approved for protocol design (Stage 1B); no probe authorised** |
| P2 | Enumerate wildcard terms instead of using `*` inside quotes until platform support is verified, starting with arXiv. | Wildcard behaviour unconfirmed on 10 platforms and undocumented in the arXiv manual (§3.3). | **Approved for protocol design (Stage 1B); no probe authorised** |
| P3 | Obtain browser-based / credentialed validation for ACM DL, IEEE Xplore, Scopus, WoS, SpringerLink, ScienceDirect, DBLP and Google Scholar, or record them as uncovered sources. | Bot challenges, JS shells and no verified licensed access (§3.1). | **Approved for protocol design; human action still required** |
| P4 | Acquire API keys for OpenAlex and Semantic Scholar (and use polite Crossref pooling) before full searches. | Rate limits and shared budgets observed (§3.1–3.2). | **Approved for protocol design; human action still required** |
| P5 | Record the Scopus / Web of Science coverage gap in the reproducibility report as required by D5. | No licensed access verified. | **Approved for protocol design; gap disclosure required** |

These proposals were approved for protocol design in Stage 1B and are recorded in
`decision-log.md §7`. Approval does not authorise probes, collection or screening.

## 6. Literature-search execution log (EMPTY — Stage 1 not started)

| search_id | canonical_query_id | area | platform / endpoint | exact_query_string | filters | date_range_sent | auth_mode | pagination | date_utc | retrieval_status | retries | hits | snapshot_id | export_file | checksum | notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## 7. Deviations from approved protocol (Stage 1A)

| deviation_id | date_utc | planned | actual | rationale | approved_by |
| --- | --- | --- | --- | --- | --- |
| D-1A-01 | 2026-11-20 | Validate Area 1 query on all 13 platforms | Validated on 3 APIs; 10 blocked or rate-limited | Platform access controls and rate limits outside our control | Recorded; no protocol change made |
| D-1A-02 | 2026-11-20 | `rows=5` / `per-page=25` as in Stage 0 | Probe limits reduced to 1 | Minimise data collected during syntax validation | Recorded; not a relevance change |

## 8. Snowballing log (EMPTY — Stage 2/3)

| snowball_id | seed_lit_id | direction (backward/forward) | source | date_utc | records_found | new_included | notes |
| --- | --- | --- | --- | --- | --- | --- | --- |

## 9. Verification API calls (EMPTY — Stage 3)

| call_id | service | endpoint | parameters | date_utc | response_count | snapshot_id | notes |
| --- | --- | --- | --- | --- | --- | --- | --- |

> The Stage 1A probes in §3 were syntax checks, not bibliographic verification of
> any candidate paper; they are therefore not entered here.

## 10. PRISMA 2020-informed accounting (13 categories)

Real counts are to be filled only from executed searches and screening; none
exists yet. The illustrative column is **ILLUSTRATIVE ONLY — NOT RESEARCH RESULTS**.

| # | Category | Unit | Source register / derived rule | Illustrative value |
|---:|---|---|---|---:|
| 1 | Records identified from databases/registers | record | section 6 execution units; may be 0 with reason | 210 |
| 2 | Records identified through other methods | record | section 8; origin tag `OTHER_METHOD` / `CITATION_CHASING` | 40 |
| 3 | Duplicate records removed | record | `screening-register.csv.dedupe_group_id` + record-report links | 70 |
| 4 | Records ineligible before screening | record | documented automation rule | 5 |
| 5 | Other records removed before screening | record | unique surviving records only; category-5 decision table | 30 |
| 6 | Records screened | record | derived: 1 + 2 − 3 − 4 − 5 | 145 |
| 7 | Records excluded at title/abstract | record | `pass1_decision = EXCLUDE` + `E1`–`E7` | 91 |
| 8 | Reports sought | report | distinct `REP-` with `flow_state != NOT_SOUGHT` after record→report conversion | 51 |
| 9 | Reports not retrieved | report | `UNAVAILABLE`, `PAYWALLED` | 9 |
| 10 | Reports with completed full-text eligibility assessment | report | `assessment_complete = YES` and full text obtained | 37 |
| 11 | Reports excluded after full-text assessment | report | `EXCLUDED` + `exclusion_stage = FULL_TEXT` + reason | 17 |
| 12 | Studies included | study | distinct `LIT-` with derived `included = YES`; no cap | 7 |
| 13 | Reports of included studies | report | `INCLUDED`, `tier = A`, confident grouping, linked to category 12 | 8 |

**Record-to-report conversion (illustrative):** `145 = 91 + 54` surviving
records; `54 = 46` one-to-one records + `3` volume records yielding `5` verified
reports + `5` unresolved records. Category 8 is therefore `51` reports, not 54.
Unresolved mappings are disclosed and never counted as reports or studies.

**Reconciliations:** `250 = 70 + 5 + 30 + 145`; `145 = 91 + 54`;
`54 = 46 + 3 + 5`; `51 = 9 + 5 + 37`; `37 = 3 + 17 + 8 + 9`.
(3 `INDETERMINATE` and 9 `UNCERTAIN_GROUPING` reports are counted in category 10
and excluded from categories 12 and 13.)

**Unresolved mappings:** every record with `link_status = UNRESOLVED` is listed
in the reproducibility report and PRISMA snapshot notes with its ID, origin and
reason. It is never silently omitted, invented as a report, or counted as a study.

## 11. Query validation cell matrix

Seven research areas × five accessible APIs (Crossref, OpenAlex, DataCite,
Semantic Scholar, arXiv) = **35 cells**. Every cell must hold exactly one outcome
and a reason; a blank cell is not permitted at validation exit.

| Outcome | Meaning | Minimum evidence |
|---|---|---|
| `PASS` | Query executed; 2xx; usable metadata returned | exact URL/parameters, title+year+identifier observed, wildcard-free string |
| `FAIL` | Executed but unusable response | error body or missing fields |
| `RATE_LIMITED` | 429 or documented shared-budget exhaustion | retry count and backoff log |
| `BLOCKED` | 401/403, bot challenge, JS shell | challenge type; no bypass attempted |
| `NOT_APPLICABLE` | combination intentionally not planned, with reason | written justification; never used to hide a failure |

Cell template: `validation_id`, research area, canonical expression, platform,
exact executed query, request parameters, `D_EXEC` (UTC), response status, usable
metadata yes/no, records in probe, API-reported total with `EXACT`/`ESTIMATE`/
`UNAVAILABLE` flag (never a PRISMA count), syntax limitation, adaptation, outcome,
reason. Probes validate the query mechanism only, never coverage or recall.
