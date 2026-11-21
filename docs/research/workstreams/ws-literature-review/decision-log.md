# Decision log — WSLIT

**Status: Proposed.** This log records decisions that govern the literature
review. It is appended to, never rewritten; corrections are made as new dated
entries that supersede earlier ones.

> **Status note (documentation-only clarification, 2026-11-21):** the "Proposed"
> label above is retained verbatim because this log is append-only and the header
> is a historical record; it is not a current-state verdict. The current standing
> of the decisions recorded here is governed by §7 (Stage 1B.5 researcher
> approval, 2026-11-20), which records explicit approval of the Stage 1B.4.4
> decision package for **documentation amendment only** (scope in §7.3). No
> historical status label or approval entry has been rewritten or removed.

Approval reference: human approval of the Stage 0 plan, dated **2026-11-20**.

## 1. Approved defaults from the planning review (D1–D5)

| ID | Decision | Source | Rationale | Status |
| --- | --- | --- | --- | --- |
| **D1** | Use **"tamper-evident / integrity-verifiable audit layer"**. Treat immutability as a design goal requiring evidence, never an assumed property. Make no tamper-proof claim. | Approved recommended default | Repository `README.md`, `research-status.md` and `schemas.py` explicitly reject tamper-proof claims; no integrity mechanism exists. | Approved |
| **D2** | Carry both the README control-plane description and WM1 zones **Z1–Z5**; record an explicit crosswalk; do not silently harmonise; flag as an open WM2 item. | Approved recommended default | Task brief says "three-domain"; repository documents a control-plane flow plus five zones. | Approved |
| **D3** | Preserve **L0 = full autonomy → L4 = human control/override** verbatim; warn on every cross-literature mapping that the direction is the reverse of much external autonomy literature. | Approved recommended default | Convention is fixed repository input; inversion would corrupt all comparisons. | Approved |
| **D4** | Own directory: `docs/research/workstreams/ws-literature-review/`. Do not touch repository-root `data/`, `ws1-threat-model/`, `research-status.md`, `schemas.py` or Session A/B files. Workstream-local `data/` holds only register templates. | Approved recommended default | Strict session ownership; avoids collisions with Sessions A and B. | Approved |
| **D5** | Assume **no licensed Scopus / Web of Science access**; if unavailable, disclose coverage limits in the reproducibility report rather than implying completeness. | Approved recommended default | Cannot be determined from the repository; conservative assumption protects integrity. | Approved |

## 2. Approved modifications to the plan (M1–M9)

| ID | Decision | Source | Rationale | Status |
| --- | --- | --- | --- | --- |
| **M1** | Accept area allocation **22 / 15 / 14 / 13 / 15 / 12 / 9** (total 100). | Human approval | Rebalance justified in the approved plan. | Approved |
| **M2** | Separate ~100 **academic research publications** (Tier A) from **authoritative standards, frameworks and technical reports** (Tier B). Maintain a separate register for Tier B. | Human modification 3 | Prevents standards and papers being mixed in counts or rankings. | Approved |
| **M3** | A DOI is **not required** for every publication. Where available, verify DOI resolution and publisher metadata. Where unavailable, verify through authoritative records and document the method explicitly. | Human modification 4 | Avoids excluding valid older or non-DOI work while keeping verification auditable. | Approved |
| **M4** | Publication credibility assesses **peer-review status, venue legitimacy and publication provenance** — not primarily venue prestige. Venue rankings, impact factors and citation counts are excluded from this dimension. | Human modification 5 | Prestige proxies are weak and biased; provenance is verifiable. | Approved |
| **M5** | Retain the six-dimensional 100-point rubric, with **evidence-based justification for every score**. Each raw score carries a locator into the reviewed source (or, for Tier-standard evidence, a documented consensus/adoption rationale). | Human modification 6 | Makes every score auditable and reviewable. | Approved |
| **M6** | Preserve L0–L4 convention and all existing architecture distinctions; no silent changes. | Human modification 7 | Same basis as D2/D3. | Approved |
| **M7** | Maintain strict session ownership; do not modify Session A or Session B files, `research-status.md`, `schemas.py` or dataset infrastructure. | Human modification 8 | Concurrency safety. | Approved |
| **M8** | Do not stage, commit or push anything. | Human modification 9 | Explicit operating constraint. | Approved |
| **M9** | Execute **Stage 0 only**; do not begin Stage 1 searches or identify the 100 papers. | Human approval | Staged human review gate. | Approved |

## 3. Stage 0 design decisions carried from the approved plan

| ID | Decision | Status |
| --- | --- | --- |
| S0-01 | Single source of truth is the workstream-local CSV set; all future markdown tables are generated from it to prevent drift. | Adopted |
| S0-02 | Stable IDs: `LIT-` (Tier A), `AUTH-` (Tier B), `REC-` (screening), `S-` (search log). Never reuse or renumber. | Adopted |
| S0-03 | Corpus target is a cap/guide, not a quota. Under-fill with justification rather than pad. | **Superseded by §7** — target/guide, not a quota or hard cap; over- and under-fill reported with reasons |
| S0-04 | Exclusion codes `E1`–`E7` are reserved for scope/quality reasons; **availability is not a quality exclusion**. Inaccessible full text ⇒ `ABSTRACT_ACCESSED` with an access flag, not `EXCLUDED`. | Adopted |
| S0-05 | `EXCLUDED` requires a non-empty exclusion code; `included = YES` requires an empty one. | Adopted |
| S0-06 | Top-25 and Top-10 are drawn from **Tier A only**. Tier B is listed separately as "Authoritative sources used" and is not ranked. | Adopted (consistent with M2) |
| S0-07 | Ranking tie-breakers: relevance → evidence → credibility → year. Diversity constraints for Top-25: no area >40%, at least 3 pre-2018 works, at least one paper each from areas 1, 2, 5 and 6. | **Superseded by §7** — diversity caps were never approved; post-ranking diagnostics only |
| S0-08 | Screening is single-reviewer. No κ is claimed; mitigation is a 10-paper calibration set, a delayed re-score of the Top-25, and explicit disclosure. | Adopted |
| S0-09 | `MANIFEST.sha256` is deferred until records exist; Stage 0 checksums would only cover empty templates. | Adopted |
| S0-10 | Database query strings in `methodology.md` are **proposed and unexecuted**. Stage 1 begins with live syntax validation; every adjustment is recorded in `search-log.md` and, if it changes protocol, here. | Adopted |
| S0-11 | Crosswalk from `LIT-*` to WM1 `TM-*` / `C-*` / `R*` is deferred until Session B freezes `references.md`. | Adopted |

## 4. Open items deferred to later stages

| Item | Owner | Target stage |
| --- | --- | --- |
| Validate each database query string against the live search interface | Session C | 1 — **partially complete**: 3/13 platforms validated in Stage 1A; remainder in §6 |
| Confirm whether institutional Scopus / Web of Science access exists | Human | 1 |
| Decide whether a second human reviewer is available for double screening | Human | 1 / 4 |
| Freeze the architecture crosswalk (README flow ↔ WM1 Z1–Z5) | Human / WM2 | 2 / 5 |
| Freeze WM1 reference numbering and enable the `TM-*`/`C-*` crosswalk | Session B | 5 |
| Resolve D1 terminology formally in the architecture documentation | Human / WM2 | 5 |
| Report post-ranking diversity diagnostics and final ranking (mandatory caps cancelled; see §7) | Session C | 4 |
| Generate `MANIFEST.sha256` and the reproducibility report | Session C | 7 |

## 5. Amendment rules

- Add a new dated row; do not edit prior rows.
- An amendment affecting D1–D5 or M1–M9 requires human re-approval.
- An amendment affecting only query syntax or formatting is recorded in
  `search-log.md` and noted here without re-approval.

## 6. Stage 1A — syntax validation (2026-11-20)

Stage 1A was a limited execution task: validate the Stage 0 query syntax without
running the literature search. Findings are recorded in `search-log.md §3–5`.
No entry in this section changes an approved decision; proposals are explicitly
marked pending.

| ID | Decision / observation | Basis | Status |
| --- | --- | --- | --- |
| 1A-01 | Stage 1A executed. Area 1 queries were actually sent to **Crossref, OpenAlex and DataCite** (HTTP 200). All other platforms were blocked, rate-limited or returned non-usable shells. | `search-log.md §3.1–3.2` | Recorded |
| 1A-02 | **No licensed Scopus or Web of Science access was verified** (HTTP 403 Cloudflare / SPA shell only). D5 remains applicable; coverage gap to be disclosed. | `search-log.md §3.1` | Recorded |
| 1A-03 | `methodology.md` was **not** edited. All required changes are proposed in `search-log.md §5` (P1–P5) and await human approval. | Stage 1A boundary | Recorded — **superseded by §7**: `methodology.md` was amended under the approved Stage 1B.5 documentation scope; P1–P5 were approved for protocol design |
| 1A-04 | API response totals from validation probes are **syntax evidence only** and must never be entered as PRISMA "records identified" counts. | `search-log.md §3.5` | Recorded |
| 1A-05 | Rate limits observed: Crossref HTTP 429 after two successful calls; OpenAlex no-API-key shared budget; arXiv and Semantic Scholar HTTP 429. API keys are proposed (P4). | `search-log.md §3.1–3.2` | Proposal pending |
| 1A-06 | Wildcard-in-phrase terms (e.g. `"LLM agent*"`, `"AI system*"`) are unconfirmed on 10 platforms and undocumented in the arXiv API manual. Enumeration is proposed (P2). | `search-log.md §3.3` | Proposal pending |
| 1A-07 | Boolean/field syntax cannot be sent to Crossref, OpenAlex or DataCite; free-text `search`/`query` plus filters must be used instead. Decomposition is proposed (P1). | `search-log.md §3.2–3.4` | Proposal pending |
| 1A-08 | ACM DL, IEEE Xplore, Scopus, WoS, SpringerLink, ScienceDirect, DBLP and Google Scholar require browser/credentialed validation or must be declared uncovered (P3). | `search-log.md §3.1–3.2` | Proposal pending |
| 1A-09 | `"immutable log*"` remains a **search synonym only** in query block `G`; D1 terminology is unchanged and no tamper-proof claim is made. | D1 | Preserved |
| 1A-10 | Tier A (~100) / Tier B separation, area allocation 22/15/14/13/15/12/9, L0–L4 convention, six-dimension rubric and Tier-A-only Top-25/Top-10 are **unchanged**. | M1–M9 | Preserved |
| 1A-11 | No `REC-` or `LIT-` ID assigned; no paper collected, screened or scored; all five register CSVs still contain headers only. | `search-log.md §6–10` | Recorded |
| 1A-12 | Stage 1 (full literature discovery) remains **not started** and requires explicit human release. | Stage gate | Recorded |

## 7. Stage 1B.5 — researcher approval and decision reconciliation (2026-11-20)

The researcher explicitly approved the Stage 1B.4.4 decision package. This entry
records the approved disposition of every decision and is the authority for the
documentation amendments made in this stage. **Approval is documentation-only**:
it does not authorise register implementation, CSV header changes, API probes,
paper collection, screening or scoring. Original decision identifiers are
preserved; S0-03, S0-07 and the §4 open item are reconciled here rather than erased.

### 7.1 Methodological choices (researcher decisions)

| ID | Approved disposition | Rationale | Affected documents / specifications | Depends on |
|---|---|---|---|---|
| A-1 | Diversity caps rejected; diversity is a post-ranking diagnostic only | Caps never approved; quality must not be overridden | `decision-log.md` S0-07/§4, `methodology.md` §10.3 | — |
| A-2 | PRISMA 2020-informed 13-category accounting adopted | Records, reports and studies must be distinct | `methodology.md` §15, `search-log.md` §10, `register-schemas.md` | — |
| A-3 | 35 RA × API validation cells, each with one outcome and a reason | Prevents success on one API masking failure on another | `search-log.md` §11 | A-7 |
| A-4 | `D_EXEC` in UTC; publication, online-first, repository-submission and preprint-version dates kept distinct | Avoids future-dating and date-concept conflation | `methodology.md` §17, `register-schemas.md` report-dates | — |
| A-5 | Conservative DataCite resource classification | A resource label does not prove peer review | `methodology.md` §18 | — |
| A-6 | `abstract` added to the papers schema specification | Canonical metadata for an included study | `register-schemas.md` §1 | — |
| A-7 | Separate explicit authorisation required before probes and collection | Research integrity and staged gates | `decision-log.md` §7.3 | — |
| A-8 | Shortfalls reported; eligibility and quality criteria never lowered to reach 100 | Targets are not quotas | `methodology.md` §§3.1, 4, 13, `README.md` | — |
| F3 | Category 13 counts eligible included reports only | Preprints cannot inflate report counts | `methodology.md` §15.1, `search-log.md` §10 | A-2 |
| F8 | Probes and collection require separate explicit release | Stage gates remain distinct | `decision-log.md` §7.3 | A-7 |
| F9 | Replace ≤100 invariant with target wording | Category 12 is uncapped | `register-schemas.md` cross-register check 4, `README.md`, `methodology.md` | A-8 |
| F10 | `papers.csv` holds included studies only; abstract-only candidates have no `LIT-` | Resolves full-text/inclusion contradiction | `methodology.md` §§7, 8, 15.4, `register-schemas.md` §1 | A-2 |
| F11 | Exceptional retry requires reviewer request and researcher authorisation | Separates requester from authoriser | `methodology.md` §16.4, `register-schemas.md` history | F5 |
| TC-02 | Mandatory Tier A verification gate adopted | Deterministic, evidence-based inclusion | `methodology.md` §15.4, `register-schemas.md` | F10 |
| TC-04 | Category 5 record-level decision table adopted | Prevents report-level inflation of record counts | `methodology.md` §15.2, `search-log.md` §10 | A-2 |
| F-2 | Confirmed preprint/published pairs handled consistently at Category 5 | Prevents double counting across record and report stages | `methodology.md` §15.2, `search-log.md` §10 | F3 |
| F-3 | Abstract-only candidates explicitly distinguished from included studies | Full-text requirement reconciled with S0-04 | `methodology.md` §§7, 15.4, `register-schemas.md` §2 | F10 |
| 4.4-3 | Unresolved record-to-report mappings disclosed, never silently omitted | Reproducibility and honest accounting | `search-log.md` §10, `methodology.md` §15.2 | A-2, F6 |

### 7.2 Technical corrections (approved, not new methodology)

| ID | Approved disposition | Affected documents / specifications | Depends on |
|---|---|---|---|
| F1 | `record-report-links.csv` with `CONFIRMED_EXCEPTION` specified | `register-schemas.md` §6 | — |
| F2 | Tier B as report-linked authoritative overlay | `register-schemas.md` §5 | — |
| F4 | `report-relationships.csv` authoritative; no overloaded report fields | `register-schemas.md` §9 | — |
| F5 | Append-only state history and immutable PRISMA snapshots specified | `register-schemas.md` §§10–11 | F11 |
| F6 | Search-execution provenance columns specified | `search-log.md` §6 | — |
| F7 | Diversity contradiction on file corrected | `decision-log.md` S0-07/§4, `methodology.md` §10.3 | A-1 |
| TC-01 | `SAME_WORK` removed from report-relationship vocabulary | `methodology.md` §15.5, `register-schemas.md` §9 | F4 |
| TC-03 | `ASSESSMENT_INDETERMINATE` and complete transitions specified | `methodology.md` §16, `register-schemas.md` §§4, 10 | F5 |
| TC-05 | F9 replacement wording applied | `register-schemas.md` cross-register check 4 | F9 |
| TC-06 | Recalculated illustrative example retained as illustrative only | `search-log.md` §10 | TC-01…TC-05 |
| F-1 | Same-document records deduplicated at Category 3, not Category 5 | `methodology.md` §15.2 | TC-04 |
| F-4 | `correction_of` reserved for decision corrections, never retry authorisation | `methodology.md` §16.4, `register-schemas.md` §10 | F11 |
| F-5 | `UNCERTAIN_GROUPING` cannot transition directly to `EXCLUDED` | `methodology.md` §16.2 | TC-03 |
| 1B.4.3-1 | Explicit record-to-report conversion step adopted | `methodology.md` §15.2, `search-log.md` §10 | F1 |
| 1B.4.3-2 | Retry actor model and event sequence adopted | `methodology.md` §16.4 | F11 |
| 1B.4.3-3 | Reassessment current-field semantics adopted | `methodology.md` §16.5 | TC-03 |
| 4.4-1 | `retry_count` = cumulative unsuccessful retry attempts; accepted override does not increment; expiry rule | `methodology.md` §16.4, `register-schemas.md` §10 | F11, 1B.4.3-2 |
| 4.4-2 | Two independent state/assessment invariants adopted | `methodology.md` §16.5, `register-schemas.md` §10 | 1B.4.3-3 |

### 7.3 Scope of approval

P1–P5 were approved for protocol design in Stage 1B and are recorded as approved in
`search-log.md §5`. All dispositions above authorise **documentation amendment only**.
The following remain separately unauthorised and are not granted by this entry:
register creation or CSV header changes; API probes; paper searches and downloads;
corpus collection; eligibility screening; quality scoring; Top-25/Top-10 ranking.

---

## 8. Stage 1B.6 — researcher authorisation for register implementation and CSV schema migration (2026-11-21)

This is a new, appended entry under the §5 amendment rule. It does not edit,
supersede or reinterpret any earlier decision, including §7 and its §7.3 scope
of approval. §7.3 remains accurate for Stage 1B.5; this entry grants a separate,
later authorisation.

| ID | Authorised decision | Scope / boundary | Status |
| --- | --- | --- | --- |
| 1B6-01 | Stage 1B.6 is defined as **research register implementation and CSV schema migration**. | All 12 registers in `register-schemas.md`: migration of the 5 existing CSVs and creation of the 7 proposed CSVs. | **Approved by researcher, 2026-11-21** |
| 1B6-02 | Migration of the five existing register headers to the approved target specification is authorised. | `papers.csv`, `screening-register.csv`, `verification-register.csv`, `evaluation-matrix.csv`, `authoritative-register.csv`. Preserve existing data; verify all five are header-only before migration; do not add research records. | Approved |
| 1B6-03 | Creation of the seven proposed registers is authorised. | `record-report-links.csv`, `reports.csv`, `report-dates.csv`, `report-relationships.csv`, `report-state-history.csv`, `prisma-snapshots.csv`, `source-identifiers.csv`. Exact headers from `register-schemas.md §§6–12`; no invented, reordered or omitted fields. | Approved |
| 1B6-04 | Implementation of the approved target schemas is authorised. | `register-schemas.md` is authoritative. No schema design decisions are delegated to the implementing agent. | Approved |
| 1B6-05 | Creation of local, workstream-internal validation tooling is authorised. | Tooling must live inside `docs/research/workstreams/ws-literature-review/`; no changes to `src/hitl2/`, root `tests/`, root `data/`, WM1, `research-status.md` or other workstreams. | Approved |
| 1B6-06 | Reconciliation of the workstream `README.md` stage-status table and directly affected status statements is authorised. | Documentation changes limited to reflecting this stage; no historical amendment or decision is rewritten. | Approved |

### 8.1 Scope

- Authoritative specification: `register-schemas.md`, including the AUD-04 migration
  section and §13 validation invariants.
- Deliverables: 12 register CSVs (5 migrated headers, 7 new header-only files); a
  workstream-local validator; a migration record with before/after evidence;
  reconciled workstream status documentation.
- All registers remain **header-only**. No research record, identifier, score,
  DOI or finding is created.

### 8.2 Explicit exclusions (not granted by this entry)

API probes and external searches; paper collection or downloads; title/abstract
screening; eligibility decisions; scoring, ranking or comparative evaluation;
literature-review execution or corpus construction; Stage 1 search execution;
any change to WM1, root data, `research-status.md`, unrelated schemas,
application source or root tests. Stage 1 requires a separate human release.

### 8.3 Completion criteria

1. All 12 register files exist with headers exactly matching the approved spec.
2. The validator reports zero header, duplicate, type, enum, cross-register and
   methodology-consistency errors, and confirms all registers are header-only.
3. Pre-migration data preservation is evidenced: zero data rows before and after,
   with the five original file checksums recorded.
4. No excluded activity in §8.2 was performed.
