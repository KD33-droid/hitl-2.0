# WM1 Decision and Evidence Register

**Status: Proposed.** Phase 0 baseline. This register preserves unresolved decisions,
provisional assumptions and source-access dependencies. It does **not** resolve them.
It is the authoritative index for anything conditional or pending in the WM1 set.
Documented in `README.md`.

## 1. Resolved technical modelling decisions (Phase 0)

| ID | Decision | Resolution | Rationale |
| --- | --- | --- | --- |
| T1 | Primary disposition vs capability maturity | Separated into two axes | A conditional capability must not justify an unconditional `Prevent`/`Detect` primary |
| T2 | Architecture representation | Two analytical matrices (advisory, enforced); no architecture selected | WM2 owns the choice |
| T3 | TM-08 / TM-14 primary | `Mitigate` in both variants; detection `NOT_ESTABLISHED` | Verifier/time/key prerequisites unspecified |
| T4 | TM-10 scope | Enforced variant only; advisory analogue moved to PROPOSED-08 | The two detection problems have different trust dependencies |
| T5 | Proposed threats | Recorded with exact labels; PROPOSED-01 not counted as accepted in-scope | Scope decision belongs to mentor |
| T6 | Audit-log properties | Properties of `A-08`, not separate assets | Same underlying asset identity; different assurance dimensions |
| T7 | Trust-related assets | `A-PROPOSED-01`…`05` provisional | Distinct identity, requirements and threat exposure |
| T8 | Key material vs key-management service | **Retained together** in `A-PROPOSED-02` | Custody boundary undefined by WM5; split trigger recorded |
| T9 | Control dimensions | Architecture applicability and implementation status are separate fields | Prevents implying availability where a control cannot operate |
| T10 | Response/recovery | Capability fields only; no fifth primary disposition | Per Phase 0 semantic model |
| T11 (Phase 0.1) | IA-01 disposition/capability mismatch | Six records (TM-12, PROPOSED-02/03/04/05a/05b) use enforced `Mitigate`; future `Prevent` is `NOT_ESTABLISHED` | No defined prevention mechanism exists; a proposed control name is not a mechanism; `C` ≠ capability `CONDITIONAL` |
| T12 (Phase 0.1) | IA-02 detection-status classes | D1–D6 classes defined; C-03/C-14 paths are D2–D6 and `NOT_ESTABLISHED`; D1 may be `CONDITIONAL` with a named shape | Applies the methodology rule by mechanism class rather than indiscriminately |

## 2. Provisional assumptions (not facts)

| ID | Assumption | Status | Affected records |
| --- | --- | --- | --- |
| PA-01 | Enforcement point may be compromised | Provisional | TM-10, PROPOSED-08 |
| PA-02 | Audit store is not trusted | Provisional | TM-08, TM-14, PROPOSED-07a–c |
| PA-03 | No trusted external time authority | Provisional | TM-14, PROPOSED-05b, TM-16 |
| PA-04 | Single-agent deployment | Provisional, **not approved** | PROPOSED-01 |
| PA-05 | Human approver trusted when honest | Provisional | TM-07, TM-13, PROPOSED-02/05a–d |
| PA-06 | Deployment topology and identity representation undefined | Unresolved | all interface-facing threats |
| PA-07 | No control in WM1 is implemented | Verified against repository | all controls |

## 3. Unresolved decisions

| ID | Decision | Owner | Why it matters | Alternatives and consequences | What WM1 documents until resolution | Conditional claims |
| --- | --- | --- | --- | --- | --- | --- |
| **D1** | Is multi-agent interaction within the evaluated system scope? | **Mentor** | Determines whether PROPOSED-01 is an accepted threat or an excluded scenario; affects paper claims | Include → new threat, boundary, surface, actor; Exclude → formal scope limitation and narrowed claims | PROPOSED-01 analysis preserved, status PENDING, excluded from aggregate counts | No multi-agent prevention/detection claim |
| **C1** | Advisory or enforced target architecture? | WM2 | Determines which `Prevent` primaries apply | Advisory → no authoritative prevention; Enforced → prevention possible but enforcement point is a target | Two disposition matrices | All `Prevent` primaries marked `C` |
| **C2** | Trusted computing base, trust anchors, key custody, trusted time | WM5 | Determines whether detection can move from `NOT_ESTABLISHED` | Specify → detection may become `CONDITIONAL`/`ESTABLISHED`; do not → detection stays unestablished | Prerequisite lists, `A-PROPOSED-01…05`, capability statuses | TM-08/10/14, PROPOSED-06/07 detection |
| **C3** | L2/L3 semantics, expiry, quorum, override authority | WM2 | Determines whether oversight threats can claim prevention | Define → `Prevent` possible; undefined → `Mitigate` only | PROPOSED-05a–d distinct, no semantics invented | All L2/L3 and override claims |
| **C4** | Fail-open or fail-closed behaviour | WM2 | Determines TM-09 / PROPOSED-05b consequences | Fail-open → bypass risk; fail-closed → availability risk | Unresolved decision recorded | Fail-safe controls conditional |
| **C5** | Final IAM authority model | WM2 | Needed for PROPOSED-02 and PROPOSED-04 | Different models change preventability | Separate threats, shared controls | Both `Prevent` primaries conditional |
| **C6** | Policy update and signing design | WM4/WM5 | Needed for PROPOSED-03 | Signed updates/pinning vs unsigned distribution | One parent threat, three scenarios | `Prevent` conditional |
| **C7** | RSM features and thresholds | WM3 | Needed for any risk-ordering claim | — | Qualitative asset ordering only, labelled judgement | No scores or thresholds |
| **A1** | Original author intent for `TB-09` | WM1 author | Undefined identifier in `trust-boundary-analysis.md` | Likely duplicated `TB-04`; alternatives `TB-05`/`TB-06` | Phase 0 applied the `TB-04` hypothesis and flagged it here | Boundary ID remains under review |
| **A2** | Full-text access to minimum literature set | WM1 evidence owner / mentor where material | Substantive methodology claims depend on it | Read → firm claims; unavailable → provisional claims | Per-source status in `references.md` | See §4 |

## 4. Source-access dependencies (Phase 0 minimum set)

| Source | Access status after Phase 0 | Dependent WM1 claims | Consequence |
| --- | --- | --- | --- |
| R1 Kohnfelder & Garg | **READ** (full archived text via text extraction) | STRIDE category names and definitions | Claim supported; wording aligned to source ("Repudiability", "Spoofing of user identity") |
| R2 Shostack | ACCESSED (publisher metadata only) | Element-by-element STRIDE application method | Provisional; full text required for method fidelity |
| R3 MITRE ATLAS | ACCESSED (landing page only; technique/matrices paths returned 404) | AI threat prompts in `methodology.md` | Provisional; no technique IDs asserted |
| R5 OWASP LLM 2025 | ACCESSED (resource page + category list; PDF text extraction empty) | Category mappings in threat catalogue | Provisional at category-list level |
| R12 Greshake et al. | **READ** (full-text HTML, arXiv v2) | Indirect prompt injection taxonomy, data/theft/availability impacts | Supported; DOI correction recorded in `references.md` |
| R13 AgentDojo | **READ** (full-text HTML, arXiv v3) | Evaluation-harness claims, tool-filter defence, limitation that tools may suffice for attack | Supported; used only at claim level actually reviewed |
| R14 CaMeL | **READ** (full-text HTML, arXiv v2) | Capability/flow-separation concept | Supported **only with explicit non-goals**: no general prompt-injection solution, side channels remain, no rollback/atomicity |

Sources R4, R6–R11, R15 remain at their prior access levels; dependent claims are downgraded to provisional in `references.md`.

**No technique IDs, section numbers or page numbers are asserted unless verified in the retrieved material.**

## 5. Evidence rules

- No source is marked `read` on the basis of a landing page or abstract.
- No source's claim is extended beyond the material actually reviewed.
- Session C retains ownership of systematic literature discovery; this register covers only sources WM1 actually cites.
