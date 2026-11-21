# Register schemas — WSLIT

**Status: Specified; implemented as header-only registers under Stage 1B.6.**
This Markdown document is the approved **target schema specification**;
documentation amendments are complete. Register implementation was separately
authorised by `decision-log.md §8` (2026-11-21) and completed: all 12 registers
in `data/` now match this specification and contain zero records. The
workstream-local `data/` directory is **not** the repository-root `data/` owned by
Session A.

## Register map

The five existing CSVs were migrated to the target headers in Stage 1B.6; the
seven proposed registers below were created in Stage 1B.6. All 12 files are
header-only and contain zero records. Evidence is in `data/migration-record.md`.

| Register | File | Primary key | Populated | Purpose |
| --- | --- | --- | --- | --- |
| Tier A papers | `data/papers.csv` | `lit_id` | after screening | Included Tier A studies only; not capped at 100 |
| Screening | `data/screening-register.csv` | `record_id` | during screening | Every raw record, decisions, exclusion reasons and abstract-only candidates |
| Verification | `data/verification-register.csv` | `lit_id` | after screening | DOI / authoritative-record verification evidence |
| Evaluation | `data/evaluation-matrix.csv` | `lit_id` | after screening | Six scores, justifications and reported indicators |
| Tier B authoritative | `data/authoritative-register.csv` | `auth_id` | during screening | Tier B overlay linked to a report; never counted in the 100 |
| Record-report links | `data/record-report-links.csv` (proposed) | `link_id` | during screening | Discovery-record ↔ report mapping and conversion provenance |
| Reports | `data/reports.csv` (proposed) | `report_id` | during screening | Distinct document/report identity, current state and tier |
| Report dates | `data/report-dates.csv` (proposed) | `date_id` | during screening | Multiple independently sourced dates per report |
| Report relationships | `data/report-relationships.csv` (proposed) | `relationship_id` | during screening | Directed/symmetric relationships; `SAME_WORK` excluded |
| State history | `data/report-state-history.csv` (proposed) | `history_id` | throughout | Append-only transitions, retry and reassessment events |
| PRISMA snapshots | `data/prisma-snapshots.csv` (proposed) | `snapshot_id` | at accounting gates | Immutable 13-category counts with checksums and supersession |
| Source identifiers | `data/source-identifiers.csv` (proposed) | `map_id` | during verification | Platform identifiers mapped to canonical `LIT-` studies |

## Migration status of existing CSV headers (AUD-04)

The five CSV files originally present in `data/` retained their **pre-amendment
Stage 0 headers** through Stage 1B.5 and Stage 1B.5.1. This Markdown document is
the approved target specification. Under Stage 1B.6, migration and creation were
separately authorised (`decision-log.md §8`) and completed.

- Existing headers **have been migrated** to the target specification.
- The seven proposed registers listed above **have been created**.
- All 12 registers are header-only; zero data rows existed before or after
  migration, and no research record was fabricated.
- Before-and-after checksums and header differences are recorded in
  `data/migration-record.md`; validation is available via
  `tools/validate_registers.py`.

Established differences between current headers and the target specification:

| Register | Difference |
|---|---|
| `papers.csv` | target adds `abstract` (A-6); all other target fields are already present |
| `screening-register.csv` | target adds `abstract_text`, `abstract_source`, `abstract_retrieved_at_utc`, `abstract_provenance_status` (AUD-05); all other target fields are already present |
| `verification-register.csv` | no header difference; validation logic still applies |
| `evaluation-matrix.csv` | no header difference; validation logic still applies |
| `authoritative-register.csv` | target adds required `report_id` FK (F2); all other target fields are already present |

No other header differences were established by direct inspection of the five
files. This list documents the migration actually performed under Stage 1B.6;
it is not a licence to add data rows or further fields.

## Common conventions

- Encoding UTF-8; one header row; no blank lines; no merged cells.
- Multi-valued fields are `;`-separated with no surrounding spaces.
- Dates are `YYYY-MM-DD`. Empty fields are written as an empty string, never
  `NULL`, `N/A` or `unknown` unless that literal is an allowed value.
- `lit_id` = `LIT-001`… (not capped at `LIT-100`); `auth_id` = `AUTH-001`…;
  `record_id` = `REC-0001`…; `report_id` = `REP-0001`…; `map_id` = `MAP-0001`…;
  `search_id` = `S-01`…
- IDs are assigned once and never reused or renumbered.
- Counting units: `REC-` = discovery record (PRISMA 1–7); `REP-` = report
  (PRISMA 8–11 and 13); `LIT-` = study (PRISMA 12). These units must never be
  conflated.

---

## 1. `data/papers.csv` — Tier A canonical register

| Field | Type | Allowed values / format | Required | Description |
| --- | --- | --- | --- | --- |
| `lit_id` | ID | `LIT-\d{3}` | yes | Stable primary key |
| `tier` | enum | `A` | yes | Invariant: always A in this register |
| `title` | text | as published | yes | Exact title from the version of record |
| `authors` | list | `;`-separated | yes | Author names in published order |
| `abstract` | text | — | no | Abstract of the included study (A-6); metadata for an included study only, never a basis for admitting abstract-only candidates |
| `year` | integer | four digits | yes | Publication year of the version of record |
| `venue` | text | — | yes | Journal or proceedings title |
| `publication_type` | enum | `journal_article` / `conference_paper` / `peer_reviewed_workshop` / `review` | yes | Tier A type |
| `doi` | text | DOI string or empty | no | Empty allowed — M3 |
| `doi_status` | enum | `VERIFIED_RESOLVING` / `VERIFIED_METADATA_ONLY` / `NOT_AVAILABLE` / `UNVERIFIED` | yes | Result of DOI-path verification |
| `verification_method` | enum | `DOI_METADATA` / `AUTHORITATIVE_RECORD` / `COMBINED` | yes | Path used per methodology §9 |
| `verification_status` | enum | `VERIFIED` / `PARTIALLY_VERIFIED` / `UNVERIFIED` | yes | Overall bibliographic verification |
| `access_status` | enum | `IDENTIFIED` / `ABSTRACT_ACCESSED` / `FULL_TEXT_ACCESSED` / `FULL_TEXT_REVIEWED` / `EXCLUDED` | yes | Terminal classification |
| `access_flag` | enum | `NONE` / `FULL_TEXT_UNAVAILABLE` / `PAYWALLED` | yes | Availability, not a quality judgement |
| `area_tags` | list | `1`…`7`; `;`-separated | yes | Research-area membership |
| `component_tags` | list | `agentic_security` / `human_oversight` / `risk_scoring` / `policy_enforcement` / `dynamic_constraint_walls` / `audit_integrity` / `evaluation_methodology` | yes | HITL 2.0 components informed |
| `gate_tags` | list | `G1`…`G6`; `;`-separated | yes | Agreement gates informed |
| `included` | enum | `YES` / `NO` | yes | Must agree with `access_status` |
| `exclusion_code` | enum | `E1`…`E7` or empty | no | Non-empty iff `included = NO` |
| `primary_source_url` | URL | — | yes | Publisher or authoritative record |
| `notes` | text | — | no | Including vocabularies, version links |

**Invariants:** `tier = A`; `lit_id` unique; `included = YES` iff `exclusion_code`
is empty **and** at least one contributing report has `assessment_complete = YES`,
`assessment_outcome = ELIGIBLE`, `access_status = FULL_TEXT_REVIEWED`, all
mandatory verification properties resolved (§15.4), `grouping_status = CONFIDENT`,
and a valid included-report `flow_state` (F10, TC-02, AUD-03). The study's
`verification_status` must not be `UNVERIFIED`. No included-but-unscorable state
exists; the evaluation matrix's `FULL_TEXT_REVIEWED` gate follows from this same
invariant. Abstract-only candidates never appear in this register. This register
contains **included studies only** and its row count is **not capped at 100**
(F9); it reconciles with PRISMA category 12. `doi` empty ⇒
`verification_method != DOI_METADATA` and verification register's
`authoritative_records` non-empty.

---

## 2. `data/screening-register.csv` — screening decisions

| Field | Type | Allowed values / format | Required | Description |
| --- | --- | --- | --- | --- |
| `record_id` | ID | `REC-\d{4}` | yes | Raw record identifier |
| `lit_id` | ID | `LIT-\d{3}` or empty | no | Assigned when included as Tier A |
| `source_database` | text | — | yes | e.g. ACM DL, IEEE Xplore |
| `search_id` | ID | `S-\d{2}` / `SNOWBALL` / `MANUAL` | yes | Links to `search-log.md` |
| `raw_title` | text | — | yes | Title as retrieved |
| `raw_authors` | text | — | no | Authors as retrieved |
| `raw_year` | text | — | no | Year as retrieved |
| `abstract_text` | text | — | conditional — required when an abstract is available, otherwise empty | Screening-stage abstract text (AUD-05); durable, source-attributed, never fabricated |
| `abstract_source` | enum | `PUBLISHER` / `REPOSITORY` / `VERIFIED_METADATA` / `NONE` | yes | Publisher-provided, repository-metadata or other verified metadata source |
| `abstract_retrieved_at_utc` | timestamp `YYYY-MM-DDTHH:MM:SSZ` or empty | `YYYY-MM-DDTHH:MM:SSZ` or empty | conditional — required when an abstract is available, otherwise empty | Retrieval timestamp of the stored abstract; see Abstract validation below (E-4) |
| `abstract_provenance_status` | enum | `VERIFIED` / `PARTIAL` / `UNVERIFIED` / `UNAVAILABLE` | yes | Confidence that the stored abstract came from the declared source |
| `dedupe_group_id` | ID | `DUP-\d{3}` | no | Group of merged records |
| `pass1_decision` | enum | `INCLUDE` / `EXCLUDE` / `UNCERTAIN` | yes | Title/abstract decision |
| `pass1_reason_code` | enum | `E1`…`E7` or empty | no | Required when pass1 = EXCLUDE |
| `pass1_date` | date | `YYYY-MM-DD` | yes | — |
| `pass2_decision` | enum | `INCLUDE` / `EXCLUDE` / `NOT_APPLICABLE` | yes | Full-text decision |
| `pass2_reason_code` | enum | `E1`…`E7` or empty | no | Required when pass2 = EXCLUDE |
| `pass2_date` | date | `YYYY-MM-DD` | no | — |
| `full_text_access` | enum | `YES` / `NO` | yes | Was full text obtained? |
| `access_flag` | enum | `NONE` / `FULL_TEXT_UNAVAILABLE` / `PAYWALLED` | yes | — |
| `final_status` | enum | same as `papers.access_status` | yes | Terminal classification |
| `final_exclusion_code` | enum | `E1`…`E7` or empty | no | Non-empty iff final = EXCLUDED |
| `reviewer` | text | single reviewer ID | yes | No second reviewer claimed |
| `notes` | text | — | no | Merge history, justification |

**Invariants:** every `LIT-*` in this register exists in `papers.csv`;
`final_status = EXCLUDED` ⇔ `final_exclusion_code` non-empty; availability alone
never produces `EXCLUDED`. Abstract-only candidates remain here with
`full_text_access = NO`, `access_flag = FULL_TEXT_UNAVAILABLE`, empty `lit_id`
and `final_status = ABSTRACT_ACCESSED`; they never enter `papers.csv`, PRISMA
category 12 or 13, ranking or evidence scoring (F10, F-3).

**Abstract validation (AUD-05).** When an abstract is available,
`abstract_text` must be non-empty, `abstract_source` must be `PUBLISHER`,
`REPOSITORY` or `VERIFIED_METADATA`, `abstract_retrieved_at_utc` must be present,
and `abstract_provenance_status` must be `VERIFIED`, `PARTIAL` or `UNVERIFIED`.
When no abstract is available, `abstract_text` must be empty,
`abstract_source = NONE`, `abstract_retrieved_at_utc` must be empty,
`abstract_provenance_status = UNAVAILABLE`, and no
content may be fabricated; the record may be held as `UNCERTAIN` for pass 1 and
promoted to full-text assessment. A revised abstract must not silently overwrite
an earlier one: before replacement, the prior value, its source and retrieval
timestamp must be preserved in `notes` using the required prefix
`ABSTRACT_REVISION:<timestamp>:<source>:<reason>`. The `abstract` field in
`papers.csv` is bibliographic metadata for an included study and does not replace
this screening-stage abstract.

---

## 3. `data/verification-register.csv` — verification evidence (M3)

| Field | Type | Allowed values / format | Required | Description |
| --- | --- | --- | --- | --- |
| `lit_id` | ID | `LIT-\d{3}` | yes | FK to `papers.csv` |
| `doi` | text | DOI string or empty | no | May be empty |
| `doi_resolution_checked` | enum | `YES` / `NO` / `NOT_APPLICABLE` | yes | `NOT_APPLICABLE` if no DOI |
| `doi_resolution_result` | enum | `RESOLVES_TO_PUBLISHER` / `RESOLVES_TO_PREPRINT` / `BROKEN` / `NOT_AVAILABLE` | yes | — |
| `publisher_metadata_match` | enum | `MATCH` / `PARTIAL` / `MISMATCH` / `NOT_AVAILABLE` | yes | Authors/title/year/venue versus publisher |
| `authoritative_records` | list | `;`-separated URLs | yes | Required when DOI unavailable |
| `verification_method` | enum | `DOI_METADATA` / `AUTHORITATIVE_RECORD` / `COMBINED` | yes | — |
| `verification_status` | enum | `VERIFIED` / `PARTIALLY_VERIFIED` / `UNVERIFIED` | yes | — |
| `version_of_record_url` | URL or empty | — | no | Preferred published version |
| `version_of_record_linked` | enum | `YES` / `NO` / `NOT_APPLICABLE` | yes | Preprint ↔ published link |
| `verification_date` | date | `YYYY-MM-DD` | yes | — |
| `citation_count` | integer or `unavailable` | — | yes | Reported only, never scored |
| `citation_count_source` | text or `unavailable` | — | yes | e.g. Semantic Scholar + date |
| `citation_count_snapshot_date` | date or `unavailable` | — | yes | — |
| `citation_context` | enum | `FOUNDATIONAL` / `SUPPORTING` / `NEUTRAL` / `CONTRADICTED` / `UNASSESSED` | yes | How later work cites it |
| `code_availability` | enum | `OPEN` / `LINKED` / `NOT_AVAILABLE` / `UNKNOWN` | yes | — |
| `notes` | text | — | no | — |

**Invariants:** `doi` empty ⇒ `authoritative_records` non-empty;
`UNVERIFIED` ⇒ not top-list eligible; no invented DOI or count.

---

## 4. `data/evaluation-matrix.csv` — scores and justifications

| Field | Type | Allowed values / format | Required | Description |
| --- | --- | --- | --- | --- |
| `lit_id` | ID | `LIT-\d{3}` | yes | FK to `papers.csv` |
| `access_status` | enum | must be `FULL_TEXT_REVIEWED` to score | yes | Gate for evidence scoring |
| `paper_type` | enum | `EMPIRICAL` / `FORMAL` / `STANDARD` / `CONCEPTUAL` / `SURVEY` | yes | Selects evidence anchors |
| `raw_relevance` … `raw_credibility` | integer | 0–5 | yes | Six fields, one per dimension |
| `just_relevance` … `just_credibility` | text | non-empty, with locator or documented rationale | yes | Six fields — M5 |
| `score_relevance` | number | 0–25 | yes | `(raw/5)*25` |
| `score_technical` | number | 0–20 | yes | `(raw/5)*20` |
| `score_evidence` | number | 0–20 | yes | `(raw/5)*20` |
| `score_novelty` | number | 0–15 | yes | `(raw/5)*15` |
| `score_practical` | number | 0–10 | yes | `(raw/5)*10` |
| `score_credibility` | number | 0–10 | yes | `(raw/5)*10` — revised criteria M4 |
| `score_total` | number | 0–100 | yes | Sum of six contributions |
| `score_date` | date | `YYYY-MM-DD` | yes | — |
| `rescore_date` | date or empty | `YYYY-MM-DD` | no | Delayed Top-25 pass |
| `rescore_delta` | integer or empty | signed number | no | Change from first score |
| `citation_count` | integer or `unavailable` | — | yes | Reported only; not in total |
| `datasets_benchmarks` | text | — | no | — |
| `code_availability` | enum | as verification register | yes | — |
| `limitations_reported` | text | — | no | Author-reported limitations |
| `conflicts_with_hitl2_assumptions` | text | — | no | Our interpretation, labelled |
| `disconfirming_evidence_flag` | enum | `YES` / `NO` | yes | Against our proposed contributions |
| `reusable_mechanisms` | text | — | no | With licence where stated |
| `top25` | enum | `YES` / `NO` | yes | Tier A only |
| `top10` | enum | `YES` / `NO` | yes | Implies `top25 = YES` |
| `notes` | text | — | no | — |

**Invariants:** each `score_*` equals `(raw_*/5) × weight` exactly;
`score_total = sum(score_*)`; every `just_*` is non-empty and contains a locator
or an explicit standard/conceptual rationale; `top10 = YES` ⇒ `top25 = YES`;
citation count never enters `score_total`; `access_status = FULL_TEXT_REVIEWED`
for all scored rows.

---

## 5. `data/authoritative-register.csv` — Tier B (separate)

| Field | Type | Allowed values / format | Required | Description |
| --- | --- | --- | --- | --- |
| `auth_id` | ID | `AUTH-\d{3}` | yes | Stable primary key |
| `report_id` | ID | `REP-\d{4}` | yes | FK to report identity; Tier B is an overlay, not a second paper corpus |
| `title` | text | — | yes | Exact document title |
| `issuing_body` | text | — | yes | e.g. NIST, MITRE, OWASP, ISO, EU |
| `document_type` | enum | `standard` / `framework` / `technical_report` / `guidance` / `threat_catalogue` / `regulation` / `methodology` | yes | — |
| `version_or_revision` | text | — | no | e.g. `1.0`, `Rev. 5`, `2025` |
| `publication_date` | date or `YYYY-MM` | — | no | As published |
| `official_url` | URL | — | yes | Issuing body's official page |
| `authoritative_records` | list | `;`-separated URLs | yes | Official page plus archive where possible |
| `verification_status` | enum | `VERIFIED` / `PARTIALLY_VERIFIED` / `UNVERIFIED` | yes | — |
| `verification_date` | date | `YYYY-MM-DD` | yes | — |
| `area_tags` | list | `1`…`7` | no | Relevant areas |
| `component_tags` | list | same vocabulary as Tier A | no | Components informed |
| `gate_tags` | list | `G1`…`G6` | no | Gates informed |
| `used_for` | list | `framing` / `control_candidate` / `threat_lens` / `evaluation_context` / `methodology` | yes | Role in synthesis |
| `counted_in_100` | enum | `NO` | yes | Invariant — never counted or ranked |
| `notes` | text | — | no | Version caveats, access limits |

**Invariants:** `counted_in_100 = NO` for every row; `auth_id` unique; no Tier B
document appears in any Top-25 / Top-10 list; versions confirmed at retrieval time.

---

## Cross-register integrity checks

1. Every `lit_id` in verification and evaluation registers exists in `papers.csv`.
2. Every included `REC-` row has exactly one `lit_id`, and vice versa.
3. No duplicate DOI across Tier A records; cross-tier DOI overlap must be
   explained in `notes`.
4. `papers.csv` row count is the actual number of distinct included `LIT-`
   studies (PRISMA category 12). Approximately 100 is a target, not a quota or
   cap; over- and under-target results are reported with per-area deviations and
   reasons (F9).
5. `papers.csv` row count equals PRISMA category 12 in `search-log.md §10`;
   category 13 counts eligible included reports, not studies.
6. Credibility score reflects peer review, venue legitimacy and provenance only
   — verified by checking `just_credibility` contains no prestige/citation claim.

---

## 6. `record-report-links.csv` — discovery mapping (proposed)

| Field | Type / allowed | Req. | Purpose |
|---|---|---|---|
| `link_id` | `LRL-\d{4}` | yes | Primary key |
| `record_id` | `REC-\d{4}` FK → screening | yes | Discovery record |
| `report_id` | `REP-\d{4}` FK → reports, or empty | no | Identified report |
| `link_type` | `DIRECT` / `DUPLICATE_ROUTE` / `VOLUME_CONTAINS` / `CITATION_CHASING` / `UNCERTAIN` | yes | Mapping class |
| `conversion_status` | `ONE_TO_ONE` / `MANY_TO_ONE` / `ONE_TO_MANY` / `UNRESOLVED` | yes | Record→report conversion |
| `link_status` | `UNRESOLVED` / `CANDIDATE` / `CONFIRMED` / `CONFIRMED_EXCEPTION` / `REJECTED` | yes | Confidence |
| `discovery_origin` | `DATABASE` / `OTHER_METHOD` / `CITATION_CHASING` | yes | PRISMA 1 vs 2 origin |
| `search_id` | `S-\d{2}` / `SNOWBALL` / `MANUAL` | yes | Execution provenance |
| `linked_date_utc` | date | yes | Capture time |
| `verified_by` | reviewer ID or empty | no | Human verification |
| `verification_date_utc` | date or empty | no | — |
| `evidence_note` | text | no | Required for `ONE_TO_MANY` / `CONFIRMED_EXCEPTION` |
| `notes` | text | no | — |

**Constraints:** `link_id` unique; (`record_id`, `report_id`) unique when non-empty;
at most one `CONFIRMED` link per record; `ONE_TO_MANY` requires recorded human
verification; `report_id` empty only when status is `UNRESOLVED`/`REJECTED`.
`dedupe_group_id` is never stored here — record deduplication belongs to the
screening register.

## 7. `reports.csv` — report identity and current state (proposed)

| Field | Type / allowed | Req. | Purpose |
|---|---|---|---|
| `report_id` | `REP-\d{4}` | yes | Primary key |
| `lit_id` | `LIT-\d{3}` or empty | no | FK to canonical study; empty only when grouping unresolved |
| `report_type` | `journal_article` / `conference_paper` / `peer_reviewed_workshop` / `review` / `preprint` / `technical_report` / `standard` / `other_document` | yes | Independent document type |
| `report_role` | `PRIMARY` / `VERSION_OF_RECORD` / `PREPRINT` / `EXTENDED_VERSION` / `FOLLOWUP` / `COMPANION` / `UNKNOWN` | yes | Descriptive role only |
| `title`, `authors` | text, `;`-separated | yes | Report-level metadata |
| `year` | integer or empty | no | Derived from preferred date; non-authoritative |
| `venue`, `publisher`, `doi`, `source_url` | text / URL | mixed | Report-level provenance |
| `peer_review_status` | `VERIFIED` / `NOT_VERIFIED` / `NOT_APPLICABLE` / `UNKNOWN` | yes | Independent of resource labels |
| `flow_state` | `NOT_SOUGHT` / `SOUGHT` / `OBTAINED` / `ASSESSMENT_PENDING` / `ASSESSED` / `ASSESSMENT_INDETERMINATE` / `INCLUDED` / `EXCLUDED` / `UNAVAILABLE` / `PAYWALLED` / `UNCERTAIN_GROUPING` | yes | Current state |
| `retry_count` | integer ≥0 | yes | Cumulative unsuccessful retries, excluding initial attempt |
| `assessment_complete` | `YES` / `NO` | yes | Current assessment field |
| `assessment_outcome` | `ELIGIBLE` / `INELIGIBLE` / `INDETERMINATE` / `NOT_ASSESSED` | yes | Current assessment field |
| `exclusion_stage` | `FULL_TEXT` / `NONE` | yes | Report-level exclusion is only `FULL_TEXT`; `TITLE_ABSTRACT` is invalid here |
| `exclusion_reason` | `E1`…`E7` or empty | no | Required for full-text exclusion |
| `grouping_status` | `CONFIDENT` / `UNCERTAIN` / `UNASSIGNED` | yes | Study-assignment confidence |
| `tier` | `A` / `B` / `PREPRINT` / `UNCLASSIFIED` | yes | Single report-level classification |
| `notes` | text | no | — |

**Constraints:** `report_id` unique; multiple reports may share `lit_id`; `lit_id`
empty only with `grouping_status ∈ {UNCERTAIN, UNASSIGNED}`; no relationship
fields in this register; current fields obey the two invariants in §13. A report
record with `exclusion_stage = TITLE_ABSTRACT` is **invalid** and must be
rejected by validation (AUD-08): title/abstract exclusion is a discovery-record
outcome in `screening-register.csv` (PRISMA category 7), not a report-level
state. A report-level `EXCLUDED` requires `exclusion_stage = FULL_TEXT` and a
documented `exclusion_reason`.

## 8. `report-dates.csv` — multiple dates (proposed)

Fields: `date_id` (`RDT-\d{4}`, PK), `report_id` (FK), `date_kind`
(`PUBLICATION` / `ONLINE_FIRST` / `ISSUE_PUBLICATION` / `REPOSITORY_SUBMISSION` /
`PREPRINT_VERSION` / `OTHER`), `date_value` (ISO-8601 `YYYY` / `YYYY-MM` /
`YYYY-MM-DD`), `date_precision` (`YEAR` / `MONTH` / `DAY`), `is_preferred`
(`YES`/`NO`), `version_label`, `source`, `source_platform`, `retrieved_date_utc`,
`certainty` (`VERIFIED` / `REPORTED` / `INFERRED` / `UNKNOWN`), `superseded_by`,
`notes`. Unique (`report_id`, `date_kind`, `version_label`, `date_value`); at most
one preferred date per report; a repository submission date is never a
publication date; corrections are new rows with `superseded_by`.

## 9. `report-relationships.csv` (proposed)

Fields: `relationship_id` (`REL-\d{4}`, PK), `source_report_id` (FK),
`target_report_id` (FK), `relationship_type` (`PREPRINT_OF` / `VERSION_OF` /
`EXTENDED_VERSION_OF` / `FOLLOWUP_TO` / `COMPANION_TO` / `UNCERTAIN` — `SAME_WORK`
is **not** allowed), `direction` (`FORWARD` / `SYMMETRIC`), `status` (`PENDING` /
`CONFIRMED` / `UNCERTAIN` / `CONFLICTED` / `REJECTED`), `evidence`,
`verified_by`, `verification_date_utc`, `notes`. Unique
(`source_report_id`, `target_report_id`, `relationship_type`); no self-reference;
directed types form a DAG; symmetric types stored once with
`source_report_id < target_report_id`; no relationship automatically establishes
study identity or drives automated grouping.

## 10. `report-state-history.csv` — append-only history (proposed)

Fields: `history_id` (`HST-\d{4}`, PK), `report_id` (FK), `event_type`
(`STATE_TRANSITION` / `RETRY_FAILURE` / `RETRY_NORMAL` / `RETRY_EXCEPTION_REQUEST`
/ `RETRY_EXCEPTION_DECISION` / `RETRY_EXCEPTION_EXECUTED` /
`RETRY_EXCEPTION_EXPIRED` / `REASSESS_OPENED` / `ASSESSMENT_COMPLETED` /
`ASSESSMENT_INDETERMINATE` / `CORRECTION`), `from_state`, `to_state`,
`transition_date_utc`, `actor`, `requested_by`, `request_date_utc`,
`authorised_by`, `authorisation_date_utc`, `authorisation_expires_at_utc`
(researcher-specified; required on an accepted authorisation),
`authorisation_history_id` (`HST-\d{4}` FK → `history_id`; required on
`RETRY_EXCEPTION_EXECUTED` and `RETRY_EXCEPTION_EXPIRED`; empty on all other
event types; references the accepted `RETRY_EXCEPTION_DECISION` event that
granted the authorisation), `request_status` (`PENDING` / `ACCEPTED` /
`REJECTED` / `NOT_APPLICABLE`), `exception_type`
(`RETRY_LIMIT_OVERRIDE` / `NOT_APPLICABLE`), `justification`, `reason_code`,
`replaces_history_id`, `correction_of`, `evidence_note`, `prisma_snapshot_id`,
`notes`. Rows are never edited or deleted. `correction_of` is reserved for
decision corrections and must never be used for retry authorisation.
`replaces_history_id` links each reassessment cycle to the prior assessment.

**Retry-expiry validation (AUD-01, NF-01):** an accepted `RETRY_EXCEPTION_DECISION`
must carry `authorisation_expires_at_utc` strictly later than
`authorisation_date_utc`. Each terminal event (`RETRY_EXCEPTION_EXECUTED` or
`RETRY_EXCEPTION_EXPIRED`) must carry `authorisation_history_id` pointing to
that accepted decision event; the field is empty on every other event type. A
`RETRY_EXCEPTION_EXECUTED` event must reference an accepted, unconsumed,
unexpired authorisation and must occur before its expiry timestamp. A
`RETRY_EXCEPTION_EXPIRED` event must record the expiry timestamp, event timestamp
and reason, and must reference an accepted, unconsumed authorisation whose
expiry timestamp has passed. At most one terminal event (`RETRY_EXCEPTION_EXECUTED`
or `RETRY_EXCEPTION_EXPIRED`) may exist per accepted authorisation, enforced by a
uniqueness constraint on non-empty `authorisation_history_id` across terminal
event types. Expiry does not increment `retry_count` or alter retrieval state;
an expired authorisation cannot be reused; a rejected or pending request cannot
produce an expiry event.

## 11. `prisma-snapshots.csv` (proposed)

Fields: `snapshot_id` (`PS-\d{3}`, PK), `snapshot_date_utc`, `label`, `category_1`
…`category_13` (integers ≥0), `unresolved_mapping_count`,
`uncertain_grouping_count`, `source_checksum`, `status` (`DRAFT` / `FROZEN` /
`SUPERSEDED`), `superseded_by`, `notes`. Snapshots are immutable; a revision
writes a new row and marks the prior row `SUPERSEDED` via `superseded_by`. Counts
are derived from registers, never invented.

## 12. `source-identifiers.csv` (proposed)

Fields: `map_id` (`MAP-\d{4}`, PK), `lit_id` (FK to study), `source_platform`,
`identifier_type` (`doi` / `openalex_id` / `crossref_record_id` /
`semantic_scholar_id` / `arxiv_id` / `datacite_id` / `dblp_key` / `url_handle` /
`other`), `identifier_value`, `retrieval_search_id`, `retrieved_date_utc`,
`verification_status`, `relation_type` (`SAME_IDENTITY` / `DIFFERENT_WORK` /
`VOLUME_OF_ITEM` / `UNCERTAIN_IDENTITY`), `notes`. Multiple identifiers per study
are supported; no value is invented; an empty `doi` is legal; no row overwrites
another.

## 13. Validation invariants

- **State invariant:** `reports.csv.flow_state` equals `to_state` of the latest
  valid state-transition event in `report-state-history.csv`.
- **Assessment invariant:** `assessment_complete` and `assessment_outcome` equal
  the latest assessment event, or represent a pending reassessment
  (`NO` / `NOT_ASSESSED` with `flow_state = ASSESSMENT_PENDING`).
- **Retry:** `retry_count` increments only after an unsuccessful retry, never on
  success, never resets; normal retries ≤2 unsuccessful attempts; an override
  requires reviewer request and researcher authorisation with an explicit
  `authorisation_expires_at_utc`; accepted authorisation does not increment;
  rejected/pending requests change nothing; an unused accepted authorisation
  emits `RETRY_EXCEPTION_EXPIRED` after its researcher-specified expiry
  timestamp; expiry does not increment the counter or change state; a consumed
  authorisation cannot later expire; an expired authorisation cannot be reused.
  Both terminal events must carry `authorisation_history_id` referencing the
  accepted `RETRY_EXCEPTION_DECISION` event; it is empty on all other event
  types, and at most one terminal event may share a given
  `authorisation_history_id` (NF-01).
- **Inclusion (AUD-03):** `papers.csv.included = YES` requires a contributing
  report with `assessment_complete = YES`, `assessment_outcome = ELIGIBLE`,
  `access_status = FULL_TEXT_REVIEWED`, a valid included-report `flow_state`,
  confident grouping and all mandatory verification properties resolved.
- **Report exclusion (AUD-08):** report-level `exclusion_stage` is restricted to
  `FULL_TEXT` or `NONE`; `TITLE_ABSTRACT` is valid only at discovery-record level.
- **Reassessment:** `REASSESS_OPENED` links to the prior assessment via
  `replaces_history_id`; previous events are unchanged; repeated reassessments
  form a traversable chain; evaluation history is preserved via
  `rescore_date` / `rescore_delta`.
- **Field coverage (selective summary):** fields referenced in
  `methodology.md §§15–17` (`flow_state`, `retry_count`, `assessment_complete`,
  `assessment_outcome`, `exclusion_stage`, `exclusion_reason`, `grouping_status`,
  `tier`, `peer_review_status`, `conversion_status`, `replaces_history_id`,
  `exception_type`, `authorisation_expires_at_utc`,
  `authorisation_history_id`) are defined in §§6–12 above. This list is a
  selective coverage summary, not an exhaustive inventory of every field
  specified in §§6–12.
