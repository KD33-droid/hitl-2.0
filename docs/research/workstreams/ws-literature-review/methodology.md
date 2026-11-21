# Methodology — HITL 2.0 literature review protocol

**Status: Specified (documentation only).** This document is the approved
Stage 0–1B.5 protocol specification; the researcher approval in
`decision-log.md §7` is documentation-only and authorises no implementation,
search execution, screening or scoring. No literature search has been run, no
paper has been identified or read, and no result is reported (the Stage 1A
syntax-validation probes are recorded in `search-log.md`). Every query string
below is a **proposal to be validated against the live interface in Stage 1**;
an unvalidated string must not be described as the string that was executed.

## 1. Review questions

| ID | Review question | Research area | Agreement gate |
| --- | --- | --- | --- |
| RQ1 | Which agent-specific threats and guardrail mechanisms are established for LLM/tool-using agents? | 1 | G2 (threat model) |
| RQ2 | How is human oversight modelled, and what evidence exists for approval effectiveness, deception and fatigue? | 2 | G1, G6 |
| RQ3 | How do existing governance and accountability frameworks define responsibility allocation and co-governance? | 3 | G1 |
| RQ4 | Which risk-scoring and adaptive-risk approaches exist, and how are features and thresholds justified? | 4 | G3 (RSM) |
| RQ5 | Which runtime policy-enforcement and constraint mechanisms exist, and how are conflicts resolved? | 5 | G4 (policy composition) |
| RQ6 | Which tamper-evident audit and provenance mechanisms exist, and what guarantees do they actually provide? | 6 | G5 (audit integrity) |
| RQ7 | Which evaluation and benchmark methodologies exist for agent security and oversight? | 7 | G6 (evaluation plan) |

## 2. Protocol structure

| Layer | Method | Role |
| --- | --- | --- |
| Protocol | Kitchenham-style software-engineering SLR protocol | Question → search → screening → synthesis chain |
| Reporting | PRISMA 2020 flow and item discipline | Auditable counts from records identified to records included |
| Scoping | Population–Concept–Context scoping logic | Map a young, terminology-fragmented field without premature quality filtering |
| Expansion | Backward and forward snowballing | Recover work missed by keyword search |
| Synthesis | Thematic synthesis plus structured comparison matrix | Seven themes and framework comparison |

## 3. Corpus definition and the two-tier split

### 3.1 Tier A — academic research publications

Peer-reviewed journal articles, conference papers and substantive peer-reviewed
workshop papers, included only after full-text assessment and the mandatory
verification gate (§15.4). **Target: approximately 100 distinct `LIT-` studies.**
This is the only set counted in the area allocation (§4) and in Top-25 / Top-10
rankings. The target is a planning target, **not a quota and not a hard cap**:
over-target and under-target results are reported with per-area deviations and
reasons (A-1, A-8, F9). Eligible studies are never discarded and quality criteria
are never weakened to meet the target. Diversity is a post-ranking diagnostic
only; no mandatory diversity caps apply (§10.3).

### 3.2 Tier B — authoritative standards, frameworks and technical reports

Standards, frameworks, technical reports, regulations, threat catalogues and
methodology guidance. Stored in `data/authoritative-register.csv` with
`counted_in_100 = NO` (an invariant). They provide framing, threat lenses,
candidate controls and evaluation context; they are listed in a separate
"Authoritative sources used" appendix and are **not ranked** against papers.

### 3.3 Classification rule

| Document type | Tier |
| --- | --- |
| Peer-reviewed article, conference or substantive workshop paper | A |
| Peer-reviewed article *about* a standard or framework | A |
| The standard / framework document itself | B |
| Peer-reviewed methodology article | A |
| Methodology technical report or guideline | B (`used_for = methodology`) |
| Thesis or dissertation | A only if peer-reviewed/examined and substantive; otherwise B |
| Blog post, marketing material, unreviewed slide deck | Neither — excluded |

When classification is ambiguous, assign the lower tier and record the ambiguity
in `notes`.

## 4. Research-area allocation (approved M1)

| Area | Target | Rationale |
| --- | ---: | --- |
| 1. Agentic AI security and LLM-agent guardrails | **22** | Fastest-moving area and primary threat surface; underpins WM1 TM-01…TM-03, TM-11, TM-15. |
| 2. Human-in-the-Loop AI and human oversight | **15** | Underpins L0–L4, TM-07, TM-13 and human-factors evidence. |
| 3. AI governance and accountability | **14** | Reduced slightly for overlap with areas 5 and 6. |
| 4. Risk assessment and adaptive risk scoring | **13** | Genuine RSM literature is narrower than generic risk literature; go deep on fewer. Feeds G3. |
| 5. Policy enforcement and runtime governance | **15** | Feeds policy composition and Dynamic Constraint Walls. |
| 6. Auditability, provenance and tamper-evident logging | **12** | Increased: "auditable" is a named contribution needing classic and AI-specific evidence. |
| 7. Security evaluation and adversarial benchmarks | **9** | Reduced slightly; evaluation also captured in areas 1 and 2. Feeds G6. |
| **Total (Tier A)** | **100** | Tier B is additional and never included here. |

The total is a planning target, not a cap. PRISMA category 12 records the actual
number of distinct included `LIT-` studies, which may exceed or fall below 100;
deviations are disclosed per area with reasons (A-8, F9).

## 5. Information sources

**Peer-reviewed indexes:** ACM Digital Library, IEEE Xplore, Scopus (if available),
Web of Science (if available), SpringerLink, ScienceDirect, DBLP, arXiv, Semantic
Scholar. Google Scholar is used for discovery and citation context **only**, never
as a bibliographic authority.

**Priority venues:** IEEE S&P, ACM CCS, USENIX Security, NDSS, ACSAC, ESORICS,
IEEE TDSC / TIFS / TSE / TC, ACM TOSEM, ICSE, FSE, ASE, NeurIPS / ICML / ICLR /
AISTATS, ACL / EMNLP / NAACL, CHI / CSCW.

**Tier B sources (version and date to be confirmed at retrieval):** NIST AI RMF
1.0 and GenAI Profile, NIST SP 800-53r5, SP 800-207, SP 800-92, SP 800-218,
MITRE ATLAS™, MITRE ATT&CK®, OWASP Top 10 for LLM Applications 2025 and agentic
guidance, EU AI Act, ISO/IEC 42001 / 23894 / 27001.

## 6. Search strategy

### 6.1 Canonical query blocks

| Block | Concept | Terms |
| --- | --- | --- |
| `A` | Agentic | `("agentic AI" OR "LLM agent*" OR "language-model agent*" OR "autonomous agent*" OR "AI agent*" OR "tool-using agent*" OR "agentic workflow*" OR "agentic system*")` |
| `B` | Security | `(security OR safety OR guardrail* OR "prompt injection" OR jailbreak* OR "tool misuse" OR "excessive agency" OR adversar* OR attack* OR "indirect prompt injection")` |
| `C` | Human oversight | `("human-in-the-loop" OR "human-on-the-loop" OR "human oversight" OR "meaningful human control" OR "human-in-command" OR "human review" OR "human approval" OR "co-governance" OR symbiotic OR "human-AI team*")` |
| `D` | Governance | `("AI governance" OR governance OR accountability OR "responsible AI" OR "risk management" OR oversight OR compliance OR "algorithmic accountability")` |
| `E` | Risk | `("risk assessment" OR "risk scoring" OR "risk model*" OR "dynamic risk" OR "adaptive risk" OR "risk-informed" OR "risk-based" OR "autonomy level*")` |
| `F` | Policy / enforcement | `("policy engine" OR "policy enforcement" OR "runtime enforcement" OR "reference monitor" OR "policy composition" OR constraint* OR "access control" OR "capability-based" OR "data flow control")` |
| `G` | Audit | `(audit* OR "tamper-evident" OR "tamper-proof" OR "tamper-resistan*" OR provenance OR "append-only" OR "hash chain" OR merkle OR "audit trail" OR "non-repudiation" OR "log integrity" OR "immutable log*")` |
| `H` | Evaluation | `(benchmark* OR evaluation OR "red team*" OR "adversarial benchmark*" OR "agent safety" OR "attack surface" OR "safety evaluation" OR "empirical study")` |

> **L0–L4 warning applied here:** block `E` includes `"autonomy level*"`. When
> screening papers on autonomy levels, check whether the paper's level numbering
> runs in the same direction as this repository's (higher = more human
> involvement). Record inverted conventions explicitly; never assume alignment.

### 6.2 Canonical per-area expressions

These are translated into each database's syntax (§6.3). They are not themselves
executable query strings.

| Area | Canonical expression | Historical lower bound (upper = `D_EXEC`) |
| --- | --- | --- |
| 1 | `A AND B` (optionally refined with `H`) | 2018 |
| 2 | `C AND (A OR D OR E)` | 2010; pre-2010 foundational via snowball |
| 3 | `D AND (A OR "AI system*" OR "high-risk AI")` | 2016 |
| 4 | `E AND (A OR C OR D)` | 2012 |
| 5 | `F AND (A OR "AI system*" OR "software agent*")` | 2000; classic reference-monitor work included |
| 6 | `G AND (A OR D OR "decision log*" OR "AI system*")` | 2000 |
| 7 | `H AND (A OR B)` | 2019 |

**Date-window precedence (AUD-02).** The years above are **historical lower
bounds only**, never authoritative upper boundaries. The upper boundary of every
search window is the actual execution date `D_EXEC` in UTC; no search may include
a future publication date relative to its execution timestamp. The actual date
range sent to each platform is recorded in `search-log.md`. Publication date,
online-first date, repository submission date and preprint-version date remain
distinct (§17). Historical Stage 1A probe strings that contain a fixed `2026`
end year are records of what was executed, not current search rules. The
historical Scopus probe additionally used the fixed publication-year boundary
`PUBYEAR < 2027` (`search-log.md §3.2`); that literal is likewise only a record
of the probe, and the authoritative upper boundary is the `<D_EXEC year+1>`
placeholder in §6.3.3 (E-2). After retrieval, any record with a publication date
later than `D_EXEC` is excluded before screening under this documented date
rule: it is counted at PRISMA category 4 (§15.1), logged with its search ID and
reason, and never enters screening or the corpus (E-3).

Language: English. Document types: article / conference paper / review; books
and book chapters only when they are authoritative Tier B items. Screening caps
per area × database are recorded in `search-log.md`; caps are a workload control,
not an inclusion criterion, and any cap applied is logged.

### 6.3 Database-specific search strategies

All strings below are **proposed and unexecuted**. Stage 1 step 1 is to validate
each against the live interface, record the exact validated string in
`search-log.md`, and record result counts with a snapshot identifier. Where a
platform does not support a documented operator, the query is re-expressed by
enumeration and the change is logged (decision-log rule S0-10).

#### 6.3.1 ACM Digital Library — Advanced Search

- **Fields:** Title / Abstract / Keywords (validate the exact field selectors live).
- **Area 1 worked string:**
  `("agentic AI" OR "LLM agent*" OR "autonomous agent*" OR "tool-using agent*") AND (security OR guardrail* OR "prompt injection" OR "excessive agency")`
- **Filters:** Publication year from 2018 to `D_EXEC` (UTC); Content type:
  Research Article, Conference Paper, Review. Exclude books by default.
- **Export:** BibTeX + RIS; record the result URL and hit count.

#### 6.3.2 IEEE Xplore — Command Search

- **Fields:** `"All Metadata:"`, `"Abstract:"`, `"Document Title:"`,
  `"Publication Title:"`, `"Index Terms:"` (validate syntax live).
- **Area 1 worked string:**
  `("All Metadata":"agentic AI" OR "All Metadata":"LLM agent" OR "All Metadata":"tool-using agent") AND ("All Metadata":security OR "All Metadata":"prompt injection" OR "All Metadata":guardrail)`
- **Filters:** Publication Year from 2018 to `D_EXEC` (UTC); Document Type:
  Journals, Conferences.
- **Export:** BibTeX/CSV; record the command string exactly as entered.

#### 6.3.3 Scopus — Advanced Search

- **Fields:** `TITLE-ABS-KEY(...)`.
- **Area 1 worked string:**
  `TITLE-ABS-KEY(("agentic AI" OR "LLM agent*" OR "autonomous agent*" OR "tool-using agent*") AND (security OR guardrail* OR "prompt injection" OR "excessive agency")) AND PUBYEAR > 2017 AND PUBYEAR < <D_EXEC year+1> AND (LIMIT-TO(DOCTYPE,"ar") OR LIMIT-TO(DOCTYPE,"cp"))`
  The `<D_EXEC year+1>` placeholder is resolved from the execution date in UTC;
  no future publication year is included.
- **Note:** if licensed access is unavailable (D5), record as `UNAVAILABLE` in
  `search-log.md`; do not substitute an unlicensed mirror and present it as Scopus.

#### 6.3.4 Web of Science — Advanced Search

- **Fields:** `TS=` (topic), `TI=`, `AB=`, `PY=`.
- **Area 1 worked string:**
  `TS=(("agentic AI" OR "LLM agent*" OR "autonomous agent*" OR "tool-using agent*") AND (security OR guardrail* OR "prompt injection" OR "excessive agency")) AND PY=(2018-<D_EXEC year>)`
- **Filters:** Document Types: Article, Review, Early Access, Proceedings Paper.
  The `<D_EXEC year>` placeholder is resolved from the execution date in UTC.

#### 6.3.5 SpringerLink — Advanced Search

- **Fields:** phrase search with `AND`/`OR`; field prefixes `title:` / `abstract:`
  only if supported live.
- **Area 1 worked string:**
  `"agentic AI" AND (security OR "prompt injection" OR guardrail*)`
- **Filters:** Publication date from 2018 to `D_EXEC` (UTC); Content type:
  Article / Conference Paper.

#### 6.3.6 ScienceDirect — Advanced Search

- **Field:** "Title, abstract, keywords".
- **Area 1 worked string:**
  `("agentic AI" OR "LLM agent*" OR "tool-using agent*") AND (security OR "prompt injection" OR guardrail* OR "excessive agency")`
- **Filters:** Years from 2018 to `D_EXEC` (UTC); Content type: Research
  articles, Review articles. Exclude book chapters by default (they are Tier B
  candidates, not Tier A).

#### 6.3.7 arXiv — API

- **Endpoint:** `http://export.arxiv.org/api/query`
- **Area 1 worked string:**
  `search_query=(all:"agentic AI" OR all:"LLM agent" OR all:"tool-using agent") AND (all:security OR all:"prompt injection" OR all:guardrail) AND (cat:cs.AI OR cat:cs.CR OR cat:cs.CL)&start=0&max_results=200&sortBy=submittedDate&sortOrder=descending`
- **Rule:** an arXiv preprint and its published version of record are **distinct
  reports** (`REP-`) linked by `PREPRINT_OF`. They may share one canonical study
  (`LIT-`) only with verified evidence and reviewer confirmation (§15.5); the
  study is counted once in PRISMA category 12, while the confirmed preprint
  discovery record is removed at category 5.

#### 6.3.8 DBLP — discovery and verification only

- **String:** `q=agentic AI security` (Boolean support limited; validate live).
- **Use:** find venue metadata, authors and conference series; not a sole source
  for inclusion decisions.

#### 6.3.9 Semantic Scholar — API (discovery and citation context)

- **Endpoint:** `GET /graph/v1/paper/search`
- **String:**
  `?query=agentic+AI+security+guardrail&year=2018-<D_EXEC year>&limit=100&fields=title,abstract,year,venue,externalIds,citationCount,openAccessPdf`
- **Use:** discovery, citation context and open-access PDF links. Citation counts
  are reported with source and snapshot date only (never scored). The
  `<D_EXEC year>` placeholder is resolved from the execution date in UTC.

#### 6.3.10 Google Scholar — discovery only

- **String:** `"agentic AI" security guardrails`
- **Use:** citation-context discovery and forward snowballing. Not a bibliographic
  authority; every record found here must be verified per §9 before inclusion.

#### 6.3.11 Bibliographic verification services (Tier A and Tier B)

- Crossref: `GET /works?query.bibliographic=<title>&rows=5`
- OpenAlex: `GET /works?search=<title>&per-page=25`
- DataCite: `GET /dois?query=<title>`
- Publisher pages and standards-body pages: primary authority.

### 6.4 Snowballing

1. **Backward:** inspect reference lists of Top-25 candidates.
2. **Forward:** Semantic Scholar / Google Scholar "cited by" for the same set.
3. Record each seed `LIT-ID`, direction, date, records found and new inclusions in
   `search-log.md`.
4. Stop an iteration when a complete pass adds no new eligible record.

### 6.5 Recording requirements

Every search entry records: search ID `S-nn`, database, interface, exact string,
filters, date and time zone, hit count, export filename, snapshot ID, syntax
validation status and notes. No result is reported without a corresponding log
entry.

## 7. Inclusion and exclusion criteria

### 7.1 Inclusion

1. English-language.
2. Tier A: peer-reviewed article, conference paper or substantive peer-reviewed
   workshop paper; Tier B: authoritative document with a verifiable issuing body.
3. Substantive treatment of at least one of the seven HITL 2.0 components.
4. At least an abstract is obtainable **for screening**; an abstract alone is not
   sufficient for inclusion (F10, F-3).
5. Bibliographic identity verifiable per §9 (a DOI is **not** required — M3).
6. For Tier A inclusion: full text obtained, assessment completed with an
   `ELIGIBLE` outcome, and every mandatory verification property in §15.4 resolved.

### 7.2 Exclusion codes

| Code | Reason |
| --- | --- |
| `E1` | No HITL / agentic / governance component in scope |
| `E2` | Not about AI or autonomous/agentic systems |
| `E3` | Blog, marketing, opinion, or preprint superseded by a version of record (keep the version of record) |
| `E4` | Duplicate (DOI or title match) — merge, retain richest record |
| `E5` | Non-English with no usable translation |
| `E6` | Retracted, erroneous metadata, or unverifiable / predatory venue |
| `E7` | Superseded earlier version of the same work |

**Availability is not a quality exclusion (S0-04).** A candidate whose full text
cannot be retrieved remains `ABSTRACT_ACCESSED` with `FULL_TEXT_UNAVAILABLE` in
the **screening register only**. It receives no `LIT-` ID, does not enter
`papers.csv`, PRISMA category 12 or 13, cannot be ranked and receives no
full-text evidence score (F10, F-3). `EXCLUDED` remains reserved for scope/quality
reasons.

## 8. Screening workflow

1. **Import** all raw results into `screening-register.csv` with `REC-` IDs.
2. **Deduplicate:** exact DOI → normalised title (lowercase, punctuation
   stripped, stopwords removed) → fuzzy title similarity (Jaccard ≥ 0.85) →
   manual confirmation. Log every merge with all contributing `REC-` IDs.
3. **Pass 1 — title/abstract:** decide `INCLUDE`, `EXCLUDE` or `UNCERTAIN` against
   §7.1; `UNCERTAIN` is promoted to pass 2.
4. **Pass 2 — full text:** decide `INCLUDE` or `EXCLUDE` with a reason code and a
   textual justification. Record `full_text_access`.
5. **Assign `LIT-` IDs only to included Tier A studies** with completed
   full-text assessment and resolved mandatory verification (F10); `AUTH-` IDs to
   Tier B documents. Abstract-only candidates receive no `LIT-` ID. IDs are never
   reused.
6. **Single-reviewer mitigation (S0-08):** a 10-paper calibration set is screened
   twice with a gap of at least one working day; the Top-25 is re-scored in a
   delayed pass. No inter-rater agreement statistic is claimed.

### 8.1 Screening-stage abstract storage and provenance (AUD-05)

Title/abstract screening requires a durable, source-attributed abstract in
`screening-register.csv`, using `abstract_text`, `abstract_source`,
`abstract_retrieved_at_utc` and `abstract_provenance_status` as specified in
`register-schemas.md §2`. Permitted sources are publisher-provided abstracts,
repository-metadata abstracts and other verified metadata sources; each carries
its retrieval timestamp and provenance status (`VERIFIED`, `PARTIAL`,
`UNVERIFIED`). An unavailable abstract is recorded as empty text with
`abstract_source = NONE` and `abstract_provenance_status = UNAVAILABLE`; no
abstract content is fabricated, and the record may be held `UNCERTAIN` for
promotion to full-text assessment. A revised abstract from a source must not
silently overwrite an earlier one: the previous value, source and retrieval
timestamp are preserved in `notes` with the required `ABSTRACT_REVISION:` prefix.
The `abstract` field in `papers.csv` is metadata for an included study and does
not substitute for the screening-stage abstract.

## 9. Bibliographic verification procedure (M3)

Every included record receives one of two verification paths:

### Path A — DOI available

1. Resolve the DOI through `doi.org` and confirm it lands on the publisher or
   authoritative repository record.
2. Compare authors, title, year, venue and type against publisher metadata
   (Crossref or the publisher page).
3. Record `doi_status = VERIFIED_RESOLVING` if resolution succeeds;
   `VERIFIED_METADATA_ONLY` if metadata matches but resolution fails;
   `UNVERIFIED` if neither holds.
4. Link the version of record; if the reviewed copy is a preprint, record
   `version_of_record_linked = YES`. The preprint and version of record remain
   distinct `REP-` reports linked by `PREPRINT_OF`; only one canonical `LIT-`
   study is counted in PRISMA category 12 (§15.5).

### Path B — DOI unavailable

1. Verify through **authoritative records**: publisher/journal issue listing,
   DBLP, ACM/IEEE proceedings record, arXiv record for preprints, official
   standards-body page (Tier B), or institutional repository.
2. Record at least one such record URL in `authoritative_records` and set
   `verification_method = AUTHORITATIVE_RECORD` (or `COMBINED` if partial DOI
   evidence exists).
3. Set `verification_status = VERIFIED` only if two independent authoritative
   sources agree on authors, title, year and type; otherwise
   `PARTIALLY_VERIFIED` or `UNVERIFIED`.
4. Never construct, guess or infer a DOI. `doi` stays empty.

**Consequence:** absence of a DOI does **not** reduce credibility or block a top
list, provided Path B is documented. `UNVERIFIED` records are not eligible for
Top-25 / Top-10.

Citation counts, where reported, are stored with their source and snapshot date
and are never used in scoring (§10.4).

## 10. Quality assessment

### 10.1 Rubric (100 points; approved M5)

Each dimension is scored 0–5 on the anchors below. Contribution =
`(raw / 5) × weight`. Raw scores are integers 0–5.

#### Relevance to HITL 2.0 — weight 25

| Raw | Anchor |
| ---: | --- |
| 5 | Directly proposes, implements or empirically evaluates a named HITL 2.0 component in an agentic/LLM-agent setting. |
| 4 | Directly addresses a named component in an AI setting, but not agentic-specific. |
| 3 | Addresses a component in an adjacent setting (classical software agents, non-ML HCI) with clear transfer. |
| 2 | Tangentially touches two or more components without a primary focus. |
| 1 | Background-only relevance to governance or oversight. |
| 0 | No substantive link to any named component. |

#### Technical contribution — weight 20

| Raw | Anchor |
| ---: | --- |
| 5 | New mechanism, formal model or working system with a specified architecture or algorithm. |
| 4 | Significant extension of a prior mechanism with concrete design detail. |
| 3 | Useful adaptation, taxonomy or systematic analysis of existing mechanisms. |
| 2 | Incremental refinement or comparative evaluation without a new mechanism. |
| 1 | Position paper with concrete recommendations but no artefact. |
| 0 | Pure opinion or summary with no technical content. |

#### Evidence and evaluation quality — weight 20

Paper type is recorded first: `EMPIRICAL`, `FORMAL`, `STANDARD`, `CONCEPTUAL`,
`SURVEY`. Anchors are type-appropriate; a survey is never rewarded for
experiments it did not run.

| Raw | Anchor |
| ---: | --- |
| 5 | Controlled empirical study on real systems or a public benchmark; or complete formal proof; or (STANDARD) formal consensus process plus documented adoption. |
| 4 | Strong empirical evaluation on realistic simulation or multiple cases; or (STANDARD) wide adoption with version history. |
| 3 | Limited case study, single-system evaluation, or systematic survey extraction; or (STANDARD) stable published guidance with a review process. |
| 2 | Illustrative example or expert evaluation without controls. |
| 1 | Anecdotal or assertion-only, but with traceable reasoning. |
| 0 | No evaluation and no traceable evidence. |

#### Novelty and research significance — weight 15

| Raw | Anchor |
| ---: | --- |
| 5 | Field-defining or first-of-kind; still used as a reference point. |
| 4 | High significance; widely adopted or highly influential in its subarea. |
| 3 | Clear incremental advance with demonstrated usefulness. |
| 2 | Modest extension with limited uptake. |
| 1 | Replication or minor variation. |
| 0 | No discernible contribution. |

#### Practical applicability — weight 10

| Raw | Anchor |
| ---: | --- |
| 5 | Deployable artefact or integration path with documented interface and licence. |
| 4 | Directly applicable design needing minor adaptation. |
| 3 | Applicable with substantial adaptation or additional engineering. |
| 2 | Conceptual guidance only, but with actionable principles. |
| 1 | Abstract implication with no concrete path. |
| 0 | No practical relevance. |

#### Publication credibility — weight 10 (revised, M4)

Assesses **peer-review status, venue legitimacy and publication provenance**.
Venue prestige, journal impact factor, CORE ranking and citation count are
**not** used here.

| Raw | Anchor |
| ---: | --- |
| 5 | Documented peer review (journal/conference with a stated review process) **or** authoritative standard with a formal consensus process; venue or issuing body verifiable; full provenance (publisher record, version of record, date, pages/identifier). |
| 4 | Peer review strongly evidenced by a reputable series with a documented process; provenance traceable with minor gaps. |
| 3 | Peer review plausible but not explicitly documented; legitimate venue or institution; provenance mostly traceable. |
| 2 | Technical report or preprint with clear institutional provenance but no documented peer review. |
| 1 | Self-published or venue legitimacy unclear; provenance partial. |
| 0 | Unverifiable venue or provenance, or indicators of predatory / duplicate publication. |

### 10.2 Evidence-based justification (M5)

Every raw score must have a non-empty justification in the evaluation matrix.
The justification must contain either:

- a **locator** into the reviewed source (section, table, figure, algorithm,
  page or line) with a one-sentence reason; or
- for `STANDARD` or `CONCEPTUAL` evidence, an explicit rationale naming the
  consensus process, adoption evidence or argument structure relied upon.

Generic praise ("strong paper", "well cited") is not an acceptable justification
and must be rejected during QA.

### 10.3 Ranking procedure

1. Sum the six weighted contributions to `score_total` (0–100).
2. Eligibility for ranking: `access_status = FULL_TEXT_REVIEWED`,
   `verification_status != UNVERIFIED`, and no unresolved score justification.
3. Tie-breakers: relevance → evidence → credibility → year (more recent first
   for fast-moving areas).
4. Diversity is a **post-ranking diagnostic only**: after ranking, report the
   area/year distribution. No area cap, pre-2018 minimum or mandatory area
   representation is applied as an eligibility, exclusion or ranking constraint
   (A-1, F7).
5. Top-25 and Top-10 are **Tier A only**. Tier B appears in a separate
   "Authoritative sources used" appendix and is not ranked.

### 10.4 Separate indicators (reported, never scored)

Citation count **and citation context** (`FOUNDATIONAL`, `SUPPORTING`, `NEUTRAL`,
`CONTRADICTED`, `UNASSESSED`) with source and snapshot date; publication year;
venue and peer-review status; DOI verification status; version of record;
datasets and benchmarks used; evaluation type; code/artifact availability.
`unavailable` is written where data cannot be obtained — never estimated.

## 11. HITL 2.0 alignment and extraction

Each Tier A record is tagged with:

- **Component tags:** Agentic security · Human oversight & autonomy · Risk
  scoring · Policy governance & enforcement · Dynamic Constraint Walls · Audit
  integrity · Evaluation methodology. Runtime-constraint papers receive both
  *Policy* and *Dynamic Constraint Walls*.
- **Gate tags:** `G1` contribution · `G2` threat model · `G3` RSM · `G4` policy
  composition · `G5` audit integrity · `G6` evaluation plan.
- **Optional WM1 crosswalk:** to `TM-*` / `C-*` / `R-*` — deferred until Session B
  freezes `references.md` (decision S0-11).
- **Extraction fields:** research question, system model, threat model,
  mechanism, evaluation type, metrics, datasets, code availability, reported
  limitations, conflicts with HITL 2.0 assumptions, disconfirming-evidence flag,
  reusable mechanisms and licence.

Fields labelled `Reported by authors` and `Our interpretation` are kept
separate. "Dynamic Constraint Walls" is treated as a construct to be located in
the literature under aliases (runtime constraints, capability/data-flow control,
reference monitors, policy guardrails), not as a term assumed to exist.

## 12. Reproducibility and records

- `search-log.md` holds exact strings, dates, hit counts, snapshots and syntax
  validation status.
- `decision-log.md` holds every protocol change with rationale.
- `data/*.csv` are the single source of truth; markdown deliverables are
  generated from them after Stage 4.
- `MANIFEST.sha256` is introduced in Stage 1 when real records exist (S0-09).
- PRISMA counts (identified → screened → eligible → included) are reconciled
  against the screening register at every gate.

## 13. Limitations (known at Stage 0)

1. No licensed Scopus / Web of Science access is assumed (D5); coverage gaps are
   disclosed, not implied away.
2. Paywalls may leave papers abstract-only; these are flagged and excluded from
   ranking, and full text is never claimed to have been read.
3. Screening is single-reviewer; no inter-rater coefficient can be reported
   (S0-08).
4. Query strings are unvalidated until Stage 1; platform syntax may require
   re-expression (S0-10).
5. The field is fast-moving; every search carries a snapshot date.
6. "HITL 2.0" is our term; synonym-rich queries and snowballing are essential.
   A negative search is not proof of novelty.
7. Citation counts are context, not quality, and may be unavailable.
8. D1–D3 terminology and architecture issues are resolved by human ruling, not
   by silent rewrite.
9. Approximately 100 is a target, not a quota or hard cap; both over- and
   under-target results are reported with reasons (A-8, F9).
10. Tier B is deliberately outside the ~100 and outside all rankings.
11. Stage 1A executed syntax-validation probes only. No literature discovery,
    paper collection, screening, scoring or register implementation has occurred;
    no finding is claimed.

## 14. Stage gate

Stage 0 and Stage 1B documentation amendments are complete. Stage 1A syntax
validation is complete. Register implementation was separately authorised and
completed under Stage 1B.6 (`decision-log.md §8`); registers remain header-only.
Actual search execution, screening and scoring still require a separate explicit
researcher release.

---

## 15. Approved accounting, identity and verification model (Stage 1B.5)

### 15.1 Counting units and PRISMA 2020-informed categories

Three counting units are strictly distinct: **record** (`REC-`), **report**
(`REP-`) and **study** (`LIT-`). The reporting is **PRISMA 2020-informed**; strict
PRISMA 2020 compliance is not claimed unless the realised process supports the
full flow and the relevant items are reported.

| # | Category | Unit | Definition / source |
|---:|---|---|---|
| 1 | Records identified from databases/registers | record | `search-log.md` §6 execution units; may be 0 with reason |
| 2 | Records identified through other methods | record | link register with `OTHER_METHOD` / `CITATION_CHASING` origin; origin retained |
| 3 | Duplicate records removed | record | `dedupe_group_id` plus confirmed links to one `REP-`; same-document records are removed here |
| 4 | Records marked ineligible before screening | record | documented automated rule (includes the post-retrieval exclusion of publications dated after `D_EXEC`, logged with search ID and reason); `0 — not applicable` if none |
| 5 | Other records removed before screening | record | unique surviving records only: non-eligible DataCite types, Tier B, preprints without verified version, unlinked volumes, confirmed-preprint records |
| 6 | Records screened | record | derived: 1 + 2 − 3 − 4 − 5 |
| 7 | Records excluded at title/abstract | record | `pass1_decision = EXCLUDE` with `E1`–`E7` |
| 8 | Reports sought | report | distinct `REP-` with `flow_state != NOT_SOUGHT` linked from records passing category 7 |
| 9 | Reports not retrieved | report | `UNAVAILABLE`, `PAYWALLED` |
| 10 | Reports with completed full-text eligibility assessment | report | `assessment_complete = YES` and full text obtained; includes `ASSESSED`, `INCLUDED`, `EXCLUDED` with `exclusion_stage = FULL_TEXT` and a documented reason, `ASSESSMENT_INDETERMINATE`, and `UNCERTAIN_GROUPING` when assessment is complete |
| 11 | Reports excluded after full-text assessment | report | `EXCLUDED` **and** `exclusion_stage = FULL_TEXT` **and** documented reason; `EXCLUDED` alone is insufficient |
| 12 | Studies included | study | distinct `LIT-` with derived `included = YES`, `tier = A`; no maximum of 100 |
| 13 | Reports of included studies | report | `INCLUDED`, `tier = A`, `grouping_status = CONFIDENT`, `assessment_outcome = ELIGIBLE`, linked to a category-12 study |

Title/abstract exclusions remain record-level (category 7) and never enter
category 11. `EXCLUDED` with `exclusion_stage = TITLE_ABSTRACT` at report level is
invalid. Unresolved record-to-report mappings are disclosed in `search-log.md`
and PRISMA snapshot notes; they are never counted as reports or studies.

### 15.2 Record-to-report conversion and Category 5

Category 8 is produced by an explicit conversion step; it does **not** copy the
number of records surviving category 7.

| Mapping | Conversion rule |
|---|---|
| One record → one report | one report |
| Multiple records → same report | one report after category-3 deduplication |
| One record → multiple reports | each individually verified report is counted (`VOLUME_CONTAINS` / `CONFIRMED_EXCEPTION`, human-verified) |
| Unresolved mapping | no report is invented or counted; disclosed |

Category 5 counts **unique surviving records**; a record is counted at most once.
Same-document records are deduplicated at category 3. Decisions:

| Scenario | Handling |
|---|---|
| One record → one Tier B report | remove record at category 5; route to authoritative register |
| Multiple records → same Tier B report | deduplicate at category 3; one canonical record removed once at category 5 |
| Record → preprint without verified published version | remove record at category 5 with documented reason |
| Confirmed preprint/published pair | remove preprint record at category 5; published report proceeds; no preprint report enters categories 8–13 |
| Unconfirmed preprint | record proceeds to screening; full-text exclusion at category 11 if no version of record is verified |
| Proceedings volume with identifiable papers | do not discard the volume wholesale; link verified individual reports with `CONFIRMED_EXCEPTION`; remove volume record only if no individual paper can be linked |
| Record qualifies under multiple pre-screening rules | one primary reason by priority (category 3 → 4 → 5; within 5: non-eligible resource type > Tier B > unverified preprint > unlinked volume); secondary reasons in `notes` |

### 15.3 Illustrative PRISMA example

**ILLUSTRATIVE ONLY — NOT RESEARCH RESULTS.** All values below are invented to
demonstrate arithmetic; none is a search result, screening outcome or corpus count.

| Category / step | Unit | Value | Derivation |
|---|---|---:|---|
| 1 Records identified | record | 210 | given |
| 2 Other-method records | record | 40 | 25 citation chasing + 15 related |
| 3 Duplicates removed | record | 70 | `dedupe_group_id` and same-document links |
| 4 Ineligible before screening | record | 5 | documented rule |
| 5 Other removed before screening | record | 30 | 10 non-eligible DataCite + 8 Tier B + 4 unverified preprints + 3 unlinked volumes + 5 confirmed-preprint records |
| 6 Screened | record | 145 | 210 + 40 − 70 − 5 − 30 |
| 7 Excluded title/abstract | record | 91 | record-level |
| Surviving records | record | 54 | 145 − 91 |
| Conversion | record→report | 46 one-to-one + 3 volume records → 5 reports + 5 unresolved | 51 reports |
| 8 Reports sought | report | 51 | distinct `REP-` |
| 9 Not retrieved | report | 9 | 5 `UNAVAILABLE` + 4 `PAYWALLED` |
| Retrieved | report | 42 | 51 − 9 |
| Assessment pending | report | 5 | `assessment_complete = NO` |
| 10 Assessed | report | 37 | 42 − 5 |
| `INDETERMINATE` | report | 3 | category 10 only |
| 11 Excluded at full text | report | 17 | 12 ordinary + 5 unconfirmed preprints |
| `INCLUDED` reports | report | 8 | 37 − 3 − 17 − 9 uncertain |
| `UNCERTAIN_GROUPING` | report | 9 | category 10 yes, 12/13 no |
| 12 Studies included | study | 7 | 8 included reports; 1 study has two reports |
| 13 Reports of included studies | report | 8 | eligible included reports only |

Reconciliations: `250 = 70 + 5 + 30 + 145`; `145 = 91 + 54`;
`54 = 46 + 3 + 5`; `51 = 9 + 5 + 37`; `37 = 3 + 17 + 8 + 9`.
Unresolved records are disclosed, not counted as reports or studies.

### 15.4 Mandatory Tier A verification gate

`PARTIALLY_VERIFIED` may remain a bibliographic status but cannot satisfy a
mandatory inclusion property. DOI is not universally required; an alternative
stable identifier plus two authoritative records is acceptable (M3).

| Property | Requirement | Evidence | Unresolved blocks inclusion? |
|---|---|---|---|
| Document/report identity | required | primary source URL plus stable identifier, or two authoritative records | Yes |
| DOI or alternative stable identifier | conditional | DOI resolution + publisher metadata, or Path B authoritative records | Yes if neither route available |
| Publisher/bibliographic provenance | required | publisher page, issue, proceedings record, institutional repository | Yes |
| Publication type and eligibility | required | verified type in {journal_article, conference_paper, peer_reviewed_workshop, review} | Yes |
| Peer-review status | required | journal policy, proceedings statement, ACM/IEEE or publisher declaration | Yes |
| Publication date and version | required | preferred date in `report-dates.csv`, version-of-record status known | Yes |
| Report-to-study grouping | required | CONFIRMED relationship or primary-report status plus reviewer confirmation | Yes |

Full-text review is mandatory for inclusion and ranking (F10, AUD-03). The
derivation is deterministic:

1. A report is eligible Tier A only when every mandatory property above is
   resolved.
2. A report becomes `INCLUDED` when `flow_state = INCLUDED`,
   `assessment_complete = YES`, `assessment_outcome = ELIGIBLE`, grouping is
   `CONFIDENT`, and `access_status = FULL_TEXT_REVIEWED`.
3. `papers.csv.included = YES` is derived when at least one contributing report
   satisfies step 2 and the study's `verification_status != UNVERIFIED`.
4. No "included but unscorable" state exists: the evaluation matrix's
   `FULL_TEXT_REVIEWED` requirement is a consequence of the same gate, not a
   separate weaker condition.
5. Category 12 counts distinct derived `LIT-` studies; category 13 counts
   eligible included reports under the same report-level rules.

### 15.5 Identity and relationship model

| Identifier | Meaning |
|---|---|
| `REC-` | discovery record |
| `REP-` | distinct report/document |
| `LIT-` | canonical study |
| `MAP-` | platform-specific source identifier |
| `AUTH-` | Tier B authoritative-source classification overlay |

`SAME_WORK` is removed from the report-relationship vocabulary. Record
deduplication uses record-report links and `dedupe_group_id`; document identity
is one `REP-` per distinct document; study identity is a shared `LIT-` only with
evidence and reviewer confirmation. Distinct reports from one study remain
distinct `REP-` rows.

| Relationship | Direction | Establishes study identity | Human verification | Automated grouping |
|---|---|---|---|---|
| `PREPRINT_OF` | FORWARD, preprint → version of record | contributory only | mandatory | no |
| `VERSION_OF` | FORWARD, later → earlier version | contributory only | mandatory | no |
| `EXTENDED_VERSION_OF` | FORWARD | conditional, with explicit evidence | mandatory | no |
| `FOLLOWUP_TO` | FORWARD | no — distinct study | mandatory | no |
| `COMPANION_TO` | SYMMETRIC, canonical storage | no | mandatory | no |
| `UNCERTAIN` | FORWARD placeholder | no | mandatory to resolve | no |

Directed relationships must remain acyclic; symmetric relationships are stored
once; `PENDING`, `UNCERTAIN`, `CONFLICTED` and `REJECTED` relationships never
drive grouping. `CONFIRMED_EXCEPTION` is retained for verified one-to-many
proceedings-volume mappings.

## 16. Report state machine, retry and reassessment

### 16.1 States

`NOT_SOUGHT`, `SOUGHT`, `OBTAINED`, `ASSESSMENT_PENDING`, `ASSESSED`,
`ASSESSMENT_INDETERMINATE`, `INCLUDED`, `EXCLUDED`, `UNAVAILABLE`, `PAYWALLED`,
`UNCERTAIN_GROUPING`. HITL autonomy levels L0–L4 are **not** imported into this
review workflow.

### 16.2 Transitions

Every state transition writes an append-only history entry with actor, UTC
timestamp, evidence and reason where applicable.

| From → To | Preconditions / evidence | Actor | PRISMA effect |
|---|---|---|---|
| — → `NOT_SOUGHT` | report registered from a record/link | Reviewer | none |
| `NOT_SOUGHT` → `SOUGHT` | retrieval attempted | Reviewer | enters category 8 |
| `SOUGHT` → `OBTAINED` | full text received | Reviewer | category 8 only |
| `OBTAINED` → `ASSESSMENT_PENDING` | queued | Reviewer | none |
| `ASSESSMENT_PENDING` → `ASSESSED` | assessment complete; outcome ELIGIBLE or INELIGIBLE | Reviewer | enters category 10 |
| `ASSESSMENT_PENDING` → `ASSESSMENT_INDETERMINATE` | assessment complete but unresolved; outcome INDETERMINATE | Reviewer | category 10 only |
| `ASSESSED` → `INCLUDED` | ELIGIBLE, tier A, confident grouping, gate resolved | Reviewer | categories 10, 13; study category 12 |
| `ASSESSED` → `EXCLUDED` | INELIGIBLE, `exclusion_stage = FULL_TEXT`, reason | Reviewer | categories 10, 11 |
| `SOUGHT` → `UNAVAILABLE` / `PAYWALLED` | failed retrieval or access block | Reviewer | category 9 |
| `UNAVAILABLE` / `PAYWALLED` → `SOUGHT` | normal retry `retry_count < 2`, or an accepted, unconsumed and unexpired exception authorisation | Reviewer | remains category 9 until obtained |
| `ASSESSMENT_INDETERMINATE` → `ASSESSMENT_PENDING` | new evidence via `REASSESS` | Reviewer | remains category 10 |
| `ASSESSED` / `INCLUDED` / `EXCLUDED` / `UNCERTAIN_GROUPING` → `ASSESSMENT_PENDING` | new evidence, explicit `REASSESS` | Reviewer | new snapshot |
| `ASSESSED` → `UNCERTAIN_GROUPING` | assessment complete, ELIGIBLE, grouping unresolved | Reviewer | category 10 yes, 12/13 no |
| `UNCERTAIN_GROUPING` → `INCLUDED` | grouping resolved and gate satisfied | Reviewer | category 13 |
| `UNCERTAIN_GROUPING` → `ASSESSMENT_PENDING` | separate eligibility failure discovered, `REASSESS` evidence | Reviewer | new assessment required |
| `UNCERTAIN_GROUPING` → `EXCLUDED` | **invalid** | — | grouping resolution alone cannot exclude |

### 16.3 Invariants

**State invariant:** `reports.csv.flow_state` matches the latest valid
state-transition event. Decision-only events are not state transitions.

**Assessment invariant:** current `assessment_complete` and `assessment_outcome`
match the latest assessment event, or explicitly represent a pending reassessment
(`NO` / `NOT_ASSESSED` with `flow_state = ASSESSMENT_PENDING`).

Further invariants: `assessment_complete = YES` only on completion transitions;
`assessment_outcome = INDETERMINATE` only in `ASSESSMENT_INDETERMINATE`;
`INCLUDED` requires `ELIGIBLE`; `EXCLUDED` requires `INELIGIBLE` with reason;
`UNCERTAIN_GROUPING` requires a completed assessment; grouping resolution never
changes `assessment_outcome`. `INCLUDED`, `EXCLUDED` and `UNAVAILABLE` are stable
but conditionally reopenable only via the documented transitions.

### 16.4 Retry counter, actors and events

The **Reviewer** performs screening and may request an exceptional retry. The
**Researcher** explicitly authorises or rejects the request. `correction_of` is
reserved for correcting recorded decisions and must never authorise a retry.

`retry_count` is the cumulative number of **unsuccessful retrieval attempts**,
excluding the initial retrieval attempt. It increments only after an unsuccessful
retry; a successful retry does not increment it; it never resets after success.
Normal retries are limited to two unsuccessful retries. An accepted override
authorises another attempt but does not itself increment the counter. Rejected or
pending requests change neither state nor counter.

Event types: `RETRY_FAILURE`, `RETRY_NORMAL`, `RETRY_EXCEPTION_REQUEST`,
`RETRY_EXCEPTION_DECISION`, `RETRY_EXCEPTION_EXECUTED`,
`RETRY_EXCEPTION_EXPIRED`, `REASSESS_OPENED`, `ASSESSMENT_COMPLETED`,
`ASSESSMENT_INDETERMINATE`, `CORRECTION`. Request, decision, execution and
outcome are separate append-only events.

**Retry authorisation expiry (AUD-01).** The Researcher must supply an explicit
expiry timestamp, recorded as `authorisation_expires_at_utc` on the
`RETRY_EXCEPTION_DECISION` event, when approving an exceptional retry. There is
no universal fixed validity duration; the researcher-specified timestamp is
authoritative. The following rules are mandatory:

1. `authorisation_expires_at_utc` must be later than `authorisation_date_utc`.
2. An accepted authorisation may be executed only strictly before its expiry
   timestamp; execution at or after expiry is invalid.
3. If an accepted authorisation remains unused at expiry, append a
   `RETRY_EXCEPTION_EXPIRED` event recording the original authorisation event
   ID in `authorisation_history_id`, the expiry timestamp, the event timestamp
   and the reason "unused at expiry".
4. Expiry does not increment `retry_count` and does not change retrieval state.
5. An expired authorisation cannot be reused; a further retry requires a new
   reviewer request and a new researcher decision.
6. A successful execution before expiry consumes the authorisation; no
   `RETRY_EXCEPTION_EXPIRED` event is emitted for that consumed authorisation.
7. A rejected or pending request cannot produce an expiry event, because no
   accepted authorisation exists.

Validation invariants: both terminal event types (`RETRY_EXCEPTION_EXECUTED`
and `RETRY_EXCEPTION_EXPIRED`) must carry `authorisation_history_id` referencing
the accepted `RETRY_EXCEPTION_DECISION` event that granted the authorisation;
the field is empty on all other event types. A `RETRY_EXCEPTION_EXECUTED` event
must reference an accepted, unconsumed, unexpired authorisation whose expiry
timestamp is later than its authorisation timestamp; a `RETRY_EXCEPTION_EXPIRED`
event must reference an accepted, unconsumed authorisation whose expiry timestamp
has passed. At most one terminal event (`RETRY_EXCEPTION_EXECUTED` or
`RETRY_EXCEPTION_EXPIRED`) may exist per accepted authorisation; this is enforced
by the uniqueness constraint on non-empty `authorisation_history_id` across
terminal event types in `register-schemas.md §10`.

### 16.5 Reassessment and audit

On reassessment the Reviewer writes `REASSESS_OPENED` with `replaces_history_id`
pointing to the prior assessment event; current fields become `flow_state =
ASSESSMENT_PENDING`, `assessment_complete = NO`, `assessment_outcome =
NOT_ASSESSED`. The previous assessment event is unchanged. On completion a new
`ASSESSMENT_COMPLETED` or `ASSESSMENT_INDETERMINATE` event links back to the
`REASSESS_OPENED` event and current fields are updated. Repeated reassessments
form a traversable chain; no history is overwritten. PRISMA snapshots are
immutable and supersession is recorded with `superseded_by`. Evaluation scores
and prior outcomes are preserved; `rescore_date` / `rescore_delta` record
reassessment without deleting earlier records.

## 17. Search validation and provenance

The validation matrix has 35 cells: 7 research areas × 5 accessible APIs
(Crossref, OpenAlex, DataCite, Semantic Scholar, arXiv). Each cell must have
exactly one outcome — `PASS`, `FAIL`, `RATE_LIMITED`, `BLOCKED` or
`NOT_APPLICABLE` — with a reason and execution provenance. Success on one API
does not mask failure on another. Probes validate query mechanism only, not
coverage or recall.

Canonical intent, actual platform query, translation/precision loss, search
date, platform/endpoint, pagination, result limits, rate-limit observations and
retrieval outcome are recorded. Wildcard behaviour is not assumed; unverified
`*` operators are enumerated. The upper date boundary is the execution date
`D_EXEC` in UTC and never future-dated. Publication date, online-first date,
repository submission date and preprint-version date are recorded separately
with source and certainty. No licensed Scopus/Web of Science access is claimed;
Stage 1A access limitations remain in force, and no access control or rate limit
is bypassed.

## 18. DataCite record classification

Resource type and peer-review status are separate evidence dimensions.
`resourceTypeGeneral` and `resourceType` are registry labels, not proof of
peer review; a DOI is not proof of peer review or version of record.

| Class | Disposition |
|---|---|
| Individual conference paper (`ConferencePaper`) | Tier A candidate, peer review independently verified |
| Proceedings volume / collection (`ConferenceProceeding`) | never an individual paper; Tier B or removed before screening |
| Journal article | Tier A candidate, peer review verified |
| Review article | Tier A candidate if peer reviewed |
| Preprint | linked version only; no separate Tier A study |
| Technical report / standard | Tier B overlay |
| Dataset / software | excluded from Tier A |
| Other / ambiguous | `UNCLASSIFIED`; manual review; no promotion |

No DataCite filter parameter is claimed beyond those verified in Stage 1A
(`query`, `publicationYear`, `page[size]`); resource-type mapping to the schema
must be verified against official documentation before use.
