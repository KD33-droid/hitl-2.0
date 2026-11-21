# WSLIT — Literature Review (documentation set)

**Status: Specified; registers implemented as header-only under Stage 1B.6.**
This directory contains the approved Stage 0–1B.5 protocol, register specifications
and accounting model for the HITL 2.0 literature review, plus the Stage 1B.6
register implementation. It is **not** review results. The Stage 1A syntax probes
were executed; no literature discovery, paper collection, screening or scoring
has occurred, and no finding is claimed. API probes, collection, screening and
scoring require separate researcher authorisation.

This workstream is owned by **Session C (literature research)**. It is created after
human approval of the Stage 0 plan and the modifications recorded in
[`decision-log.md`](decision-log.md).

## Scope

The review plans a rigorous, reproducible assessment of approximately 100
academic research publications relevant to:

> **HITL 2.0 — A Proactive Symbiotic Co-Governance Framework for Secure and
> Auditable Agentic AI.**

Its purpose is to identify valuable prior work, map the state of the field,
evaluate competing approaches, locate defensible research gaps and establish the
technical foundations of the proposed framework. It is a research exercise, not a
paper-counting exercise; approximately 100 eligible Tier A studies is a **planning
target, not a quota and not a hard cap**. Over-target and under-target results are
reported with per-area deviations and reasons. Eligible studies are never
discarded, and quality criteria are never weakened, to meet the target.
Diversity is a post-ranking diagnostic only; no mandatory diversity caps apply to
Top-25 or Top-10.

Authoritative standards, frameworks, threat catalogues and technical reports are
kept in a **separate register** and are **not** counted toward the ~100 academic
publications (modification 3).

## Relationship to the wider research

All six agreement gates in `docs/research/research-status.md` remain **open**:
research contribution, threat model, RSM specification, policy composition,
audit integrity and evaluation plan. This workstream supplies evidence to those
gates; it does not close them. No shared research-status document is modified by
this workstream.

The WM1 threat model (`docs/research/workstreams/ws1-threat-model/`) is read-only
input. Its reference numbering is still in flux, so this workstream uses its own
stable identifiers and defers any crosswalk until WM1 is frozen.

## Document index

| Document | Stage | Contents |
| --- | --- | --- |
| [`README.md`](README.md) | 0–1B.5 | Scope, conventions, ownership, status |
| [`methodology.md`](methodology.md) | 0–1B.5 | Protocol, search strategy, PRISMA model, identity/relationship model, verification gate, state machine, retry/reassessment rules, scoring rubric, limitations |
| [`search-log.md`](search-log.md) | 0–1B.5 | Stage 1A validation record; empty execution/snowball logs; 13-category PRISMA template; illustrative example; validation-cell matrix |
| [`decision-log.md`](decision-log.md) | 0–1B.5 | Stage 0 decisions, Stage 1A record, Stage 1B.5 approval entry |
| [`register-schemas.md`](register-schemas.md) | 0–1B.5 | Specifications for canonical and proposed registers; keys, constraints, PRISMA and state invariants |
| [`data/*.csv`](data/) | 0 → 1B.6 (headers only) | All 12 registers implemented to the approved schemas with zero data rows; migration evidence in `data/migration-record.md` |
| [`tools/validate_registers.py`](tools/validate_registers.py) | 1B.6 | Local, read-only register validator |

## Mandatory conventions

### 1. Status vocabulary

| Status | Meaning |
| --- | --- |
| **Proposed** | An idea or target; no agreed specification exists. |
| **Specified** | A written specification has been agreed and is ready to implement. |
| **Implemented** | Code exists in this repository and is covered by tests. |
| **Experimentally validated** | Empirical evidence supports the claim. |

Every artefact in this directory is **Proposed** until a human reviewer changes
its status. Proposed components of HITL 2.0 are never described as implemented or
validated.

### 2. Two-tier corpus (modification 3)

- **Tier A — academic research publications.** Peer-reviewed journal articles,
  conference papers and substantive peer-reviewed workshop papers. Target
  approximately 100. This is the **only** set counted in the research-area
  allocation and in Top-25 / Top-10 rankings.
- **Tier B — authoritative standards, frameworks, technical reports, regulations,
  threat catalogues and methodology guidance.** Kept in
  `data/authoritative-register.csv`, never counted toward the 100, and used for
  framing, threat lenses, control candidates and evaluation context.

A peer-reviewed *article about* a standard belongs to Tier A; the standard
document itself belongs to Tier B. A peer-reviewed methodology article belongs to
Tier A; a methodological technical report belongs to Tier B with
`used_for = methodology`.

### 3. Autonomy convention (preserved verbatim)

| Level | Meaning |
| --- | --- |
| **L0** | Full autonomy |
| **L1** | Human monitoring |
| **L2** | Human confirmation |
| **L3** | Human approval |
| **L4** | Human control/override |

> **Warning:** in this repository a **higher** level means **more** human
> involvement. Much external autonomy literature numbers levels the opposite
> way. Every cross-literature mapping must state this explicitly so comparisons
> are not inverted. The convention is fixed input; this workstream does not
> redefine it or invent level-selection logic.

### 4. Audit terminology (approved default D1)

Use **"tamper-evident / integrity-verifiable audit layer"** as the review term.
"Immutable" is treated as a *design goal that would require evidence*, never as an
assumed or achieved property. No claim that any reviewed system — or HITL 2.0 —
is tamper-proof is made unless the source itself demonstrates that property and
the claim is quoted with its evidence.

### 5. Architecture distinctions (approved default D2)

Two descriptions are carried side by side and **not** silently harmonised:

- the illustrative control-plane flow in the repository `README.md`
  (agentic AI ecosystem; control plane: proposal → risk assessment → policy
  validation → autonomous decision → human oversight → execute/block/modify →
  audit & feedback; supporting services; trust/infrastructure; human
  stakeholders);
- the WM1 decomposition into zones **Z1–Z5**.

An explicit crosswalk is an open item for WM2. No proposed component is presented
as implemented.

### 6. Identifier scheme

| Prefix | Meaning |
| --- | --- |
| `REC-0001…` | Discovery record (record-level PRISMA categories 1–7) |
| `REP-0001…` | Distinct report/document (report-level PRISMA categories 8–11 and 13) |
| `LIT-001…` | Canonical included Tier A study (study-level category 12; not capped at `LIT-100`) |
| `MAP-0001…` | Platform-specific source identifier mapping |
| `AUTH-001…` | Tier B authoritative-source classification overlay |
| `S-01…` | Search-log entry |

Identifiers are never reused or renumbered once assigned.

### 7. Claim discipline

- A paper is `FULL_TEXT_REVIEWED` only if its full text was actually read.
- Abstract-only candidates remain in the screening register with no `LIT-` ID;
  they are not included Tier A studies, enter neither PRISMA category 12 nor 13,
  cannot be ranked and receive no full-text evidence score (F10, F-3).
- Fields labelled `Reported by authors` and `Our interpretation` are never
  merged.
- No paper, author, DOI, venue, citation count or finding is invented. Where a
  DOI is unavailable, verification proceeds through authoritative records and is
  documented (modification 4).
- "No paper in our corpus addresses X" is not the same as "no such work exists".

## Session ownership and boundaries

- **Read-only:** `src/hitl2/`, `tests/`, `data/` (repository root),
  `docs/research/research-status.md`, and
  `docs/research/workstreams/ws1-threat-model/` (Session B).
- Session C writes **only** inside `docs/research/workstreams/ws-literature-review/`.
- No staging, committing or pushing, before or after approval (modification 9).
- No dataset downloads, no model or governance implementation and no fabricated
  results. Stage 1B.5 changed documentation only; Stage 1B.6 separately
  authorised register implementation and header migration (no data rows).

## Stage status

| Stage | Status |
| --- | --- |
| 0 — Protocol and register design | **Complete** |
| 1A — Search syntax validation | **Complete** (see `search-log.md §3–5`; 3 of 13 platforms validated) |
| 1B — Protocol finalisation and semantic closure | **Complete** (documentation only) |
| 1B.5 — Authorised documentation amendment | **Complete** (documentation only) |
| 1B.5-AUDIT / 1B.5.1 — Independent audit and remediation | **Closed — PASS** (all findings resolved) |
| 1B.6 — Register implementation and CSV schema migration | **Complete** (5 migrated, 7 created, all header-only; zero data rows) |
| 1 — Search execution | Not started — requires separate explicit human release |
| 2 — Screening and deduplication | Not started |
| 3 — Retrieval and bibliographic verification | Not started |
| 4 — Scoring and top lists | Not started |
| 5 — Synthesis (comparative, gaps, novelty) | Not started |
| 6 — IEEE-style thematic review | Not started |
| 7 — QA and reproducibility audit | Not started |

Stage 1 must **not** begin until the human reviewer explicitly releases it.
