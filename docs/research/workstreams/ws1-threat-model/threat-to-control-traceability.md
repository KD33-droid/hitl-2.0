# Threat-to-control traceability matrix

**Status: Proposed.** Phase 0 baseline. Architecture applicability and
implementation status are **separate dimensions**. No control is implemented.

## 1. Control definitions (two independent dimensions)

| ID | Description | Applicability | Implementation status | Prerequisites | Verification criterion | Evidence status |
| --- | --- | --- | --- | --- | --- | --- |
| `C-01` | Least-privilege, capability-based tool allowlisting | `ENFORCED_ONLY` | `NOT_IMPLEMENTED` | WM4 tool model | Out-of-allowlist call rejected | Proposed |
| `C-02` | Centralized policy-driven enforcement point | `ENFORCED_ONLY` | `NOT_IMPLEMENTED` | WM2 architecture (C1) | Single authoritative path | Proposed |
| `C-03` | Independent, out-of-band audit and monitoring | `BOTH` | `NOT_IMPLEMENTED` | Verifier independence, trust domain, keys, time (C2) | Divergence/tamper detection test | Proposed; detection `NOT_ESTABLISHED` |
| `C-04` | Human approval/confirmation gates at L2–L4 | `BOTH` | `NOT_IMPLEMENTED` | L2/L3 semantics (C3); no implicit approval on timeout | Level-binding test | Proposed |
| `C-05` | Structured approval presentation with rationale + provenance | `BOTH` | `NOT_IMPLEMENTED` | Rationale binding to proposal digest | Misleading-rationale study | Proposed |
| `C-06` | Separation of duties / two-person rule | `BOTH` | `NOT_IMPLEMENTED` | Quorum/authority rule (C3) | Multi-approver test | Proposed |
| `C-07` | Untrusted-data marking / taint tracking | `BOTH` | `NOT_IMPLEMENTED` | Provenance contract | Taint-propagation test | Proposed |
| `C-08` | Context/RSM input validation, conservative defaults | `BOTH` | `NOT_IMPLEMENTED` | Feature contract (WM3, C7) | Perturbed-input test | Proposed |
| `C-09` | Signed policy/config, change control, dual authorization | `BOTH` | `NOT_IMPLEMENTED` | Signing root (C6) | Unauthorized-change test | Proposed |
| `C-10` | Decision↔proposal digest binding, single-use tokens, revalidation | `ENFORCED_ONLY` | `NOT_IMPLEMENTED` | Clock/freshness trust (C2) | Replay/TOCTOU test | Proposed |
| `C-11` | Rate limiting, timeouts, bounded queues, graceful degradation | `BOTH` | `NOT_IMPLEMENTED` | Fail-open/closed decision (C4) | Load test | Proposed |
| `C-12` | Monotonic sequence numbers + independent/trusted time | `BOTH` | `NOT_IMPLEMENTED` | WM5 time source (C2) | Rollback/ordering test | Proposed |
| `C-13` | Dependency/dataset provenance verification | `BOTH` | `NOT_IMPLEMENTED` | Independent digest source | Checksum verification test | Proposed |
| `C-14` | Anomaly detection and alerting | `BOTH` | `NOT_IMPLEMENTED` | **Integrity + independence of collector/thresholds (C2); not assumed** | Monitor-divergence test | Proposed; detection `NOT_ESTABLISHED` |
| `C-15` | Autonomy-level floor constraints | `ENFORCED_ONLY` | `NOT_IMPLEMENTED` | WM2 level semantics (C3) | Level-floor test | Proposed |
| `C-16` | Enforcement-point defence in depth (least privilege, kill switch, fail-safe) | `ENFORCED_ONLY` | `NOT_IMPLEMENTED` | WM2/WM4 (C1, C4) | Kill-switch/divergence test | Proposed |
| `C-PROPOSED-01` | Signed policy updates, version pinning, rollback protection | `ENFORCED_ONLY` | `NOT_IMPLEMENTED` | WM4/WM5 signing design (C6) | Downgrade/rollback test | Proposed |
| `C-PROPOSED-02` | Approver authentication binding + signed approval | `BOTH` | `NOT_IMPLEMENTED` | WM2 IAM model (C5) | Forged-approval test | Proposed |
| `C-PROPOSED-03` | Independent verification service | `BOTH` | `NOT_IMPLEMENTED` | Separate trust domain, keys, time (C2) | Verifier-divergence test | Proposed |
| `C-PROPOSED-04` | Trust-anchor / key-custody / time-source assurance | `UNRESOLVED` | `NOT_IMPLEMENTED` | WM5 TCB (C2) | Anchor-compromise test | Proposed |
| `C-PROPOSED-05` | Independent monitoring/collection service | `BOTH` | `NOT_IMPLEMENTED` | Collector independence (C2) | Suppression test | Proposed |
| `C-PROPOSED-06` | Agent identity authentication + delegation binding | `ENFORCED_ONLY` | `NOT_IMPLEMENTED` | WM2 IAM (C5); D1 if multi-agent | Forged-identity test | Proposed |

No control is `IMPLEMENTED` or `PARTIALLY_IMPLEMENTED`. `NOT_ASSESSED` is unused.

## 2. Forward traceability

Abbreviations: A = advisory, E = enforced; `—` = not available in that variant;
`RES` = residual; `VER` = future verification criterion (in `threat-catalogue.md`).

| Threat | Actors | Assets | Boundaries | Surfaces | Primary A / E | Controls (availability) | RES | VER |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TM-01 | TA-01, TA-05 | A-01, A-02, A-11 | TB-01 | AS-01, AS-06 | Outside / Outside | C-03, C-04, C-07, C-14 (both); C-01, C-16 (E only) | RR-01 | Yes |
| TM-02 | TA-02, TA-01 | A-01, A-02, A-07, A-11 | TB-01 | AS-01, AS-02, AS-06 | Mitigate / Mitigate | C-07, C-04, C-08, C-14, C-03 (both); C-01 (E) | RR-02 | Yes |
| TM-03 | TA-01, TA-02, TA-05, TA-06 | A-11, A-05, A-02, A-03 | TB-06 | AS-06, AS-01, AS-05 | Mitigate / Prevent(C) | C-01, C-02, C-10 (E only); C-03, C-14 (both) | RR-03 | Yes |
| TM-04 | TA-01, TA-04, TA-06 | A-06, A-05, A-11, A-03 | TB-04, TB-06 | AS-03, AS-08, AS-06 | Mitigate / Prevent(C) | C-01, C-02, C-16 (E); C-09, C-14 (both) | RR-04 | Yes |
| TM-05 | TA-02, TA-01, TA-07, TA-05 | A-07, A-12, A-08 | TB-01, TB-06 | AS-06, AS-01, AS-02 | Mitigate / Mitigate | C-03, C-04, C-07, C-08 (both); C-01 (E) | RR-05 | Yes |
| TM-06 | TA-01, TA-04, TA-06 | A-05, A-03, A-04, A-12 | TB-04, TB-05, TB-06 | AS-05, AS-03, AS-06 | Mitigate / Prevent(C) | C-02, C-10, C-16 (E); C-09, C-03, C-14 (both) | RR-06 | Yes |
| TM-07 | TA-02, TA-01, TA-08 | A-04, A-10, A-03, A-12 | TB-03 | AS-04 | Mitigate / Mitigate | C-05, C-06, C-14, C-03 (both) | RR-07 | Yes |
| TM-08 | TA-04, TA-06 | A-08, A-04, A-03, A-12 | TB-05, TB-08, TB-PROPOSED-02 | AS-07, AS-10 | Mitigate / Mitigate | C-03, C-09, C-12, C-PROPOSED-03 (both) | RR-08, RR-16 | Yes |
| TM-09 | TA-01, TA-02, TA-04, TA-06, TA-08 | A-09, A-10, A-04, A-08 | TB-03, TB-04 | AS-01, AS-04, AS-07 | Mitigate / Mitigate | C-11, C-03 (both); C-16 (E) | RR-09 | Yes |
| TM-10 | TA-04, TA-06 | A-03, A-05, A-11, A-08, A-12 | TB-05, TB-06 | AS-05, AS-03, AS-07 | n/a / Mitigate | C-16 (E); C-03, C-04, C-06, C-12, C-PROPOSED-03 (both) | RR-10, RR-17 | Yes |
| TM-11 | TA-02, TA-04, TA-05 | A-07, A-02, A-03, A-05 | TB-07, TB-04 | AS-02, AS-01, AS-09 | Mitigate / Mitigate | C-08, C-07, C-09, C-14 (both) | RR-11 | Yes |
| TM-12 | TA-01, TA-02, TA-04, TA-06 | A-05, A-04, A-03 | TB-04, TB-06 | AS-02, AS-03, AS-05 | Mitigate / Prevent(C) | C-15, C-02, C-10 (E); C-09, C-03 (both) | RR-13 | Yes |
| TM-13 | TA-03, TA-04 | A-04, A-06, A-05, A-12 | TB-03 | AS-04, AS-08 | Outside / Outside | C-06, C-03, C-14 (both) | RR-15 | Yes |
| TM-14 | TA-04, TA-06, TA-11 | A-08, A-03, A-04, A-PROPOSED-04 | TB-08, TB-PROPOSED-02 | AS-10, AS-07 | Mitigate / Mitigate | C-12, C-03, C-PROPOSED-03 (both) | RR-08, RR-18 | Yes |
| TM-15 | TA-05 | A-01, A-07, A-11, A-12 | TB-01, TB-07 | AS-06, AS-09 | Outside / Outside | C-13, C-09, C-14 (both); C-01 (E) | RR-11 | Yes |
| TM-16 | TA-01, TA-06 | A-02, A-03, A-04, A-11 | TB-02, TB-06 | AS-01, AS-05, AS-06, AS-10 | Mitigate / Prevent(C) | C-10, C-02 (E); C-03 (both) | RR-13, RR-18 | Yes |
| PROPOSED-01 | TA-01, TA-09, TA-05 | A-01, A-02, A-06 | TB-PROPOSED-01 | AS-PROPOSED-01 | PENDING / PENDING | C-07, C-14 (both); C-01, C-PROPOSED-06 (E) | RR-14 | Yes |
| PROPOSED-02 | TA-02, TA-04, TA-06 | A-04, A-06, A-03 | TB-03, TB-08 | AS-04, AS-PROPOSED-02, AS-08 | Mitigate / Prevent(C) | C-03, C-05, C-10, C-PROPOSED-02 (both/E) | RR-24 | Yes |
| PROPOSED-03 | TA-04, TA-05, TA-06 | A-05, A-03 | TB-04, TB-05 | AS-03, AS-PROPOSED-03 | Mitigate / Prevent(C) | C-09 (both); C-PROPOSED-01 (E) | RR-19 | Yes |
| PROPOSED-04 | TA-01, TA-02, TA-04 | A-06, A-02, A-03 | TB-02, TB-04, TB-06 | AS-01, AS-06, AS-08 | Mitigate / Prevent(C) | C-01, C-02, C-PROPOSED-06 (E); C-09, C-03 (both) | RR-25 | Yes |
| PROPOSED-05a | TA-02, TA-04, TA-06 | A-04, A-05, A-03 | TB-03, TB-04 | AS-04, AS-05 | Mitigate / Prevent(C) | C-04, C-05, C-10 (both/E) | RR-13 | Yes |
| PROPOSED-05b | TA-02, TA-04, TA-06, TA-08 | A-04, A-03, A-PROPOSED-04 | TB-03, TB-08 | AS-04, AS-PROPOSED-02, AS-10, AS-PROPOSED-06 | Mitigate / Prevent(C) | C-10, C-12, C-PROPOSED-02, C-PROPOSED-03 (E/both) | RR-18 | Yes |
| PROPOSED-05c | TA-03, TA-04, TA-06 | A-04, A-03 | TB-03 | AS-04 | Mitigate / Mitigate | C-06, C-03 (both) | RR-13 | Yes |
| PROPOSED-05d | TA-03, TA-04, TA-06 | A-04, A-03, A-05 | TB-03, TB-06 | AS-04, AS-05 | Mitigate / Mitigate | C-03, C-06 (both); C-16 (E) | RR-13 | Yes |
| PROPOSED-06 | TA-01, TA-04, TA-06, TA-10 | A-PROPOSED-05, A-08, A-03 | TB-04, TB-05 | AS-02, AS-07, AS-PROPOSED-04 | Mitigate / Mitigate | C-14, C-11, C-PROPOSED-03, C-PROPOSED-05 (both) | RR-20 | Yes |
| PROPOSED-07a | TA-04, TA-11 | A-PROPOSED-01 | TB-PROPOSED-02 | AS-PROPOSED-05 | Outside / Outside | C-PROPOSED-04 (UNRESOLVED) | RR-21 | Yes |
| PROPOSED-07b | TA-04, TA-11 | A-PROPOSED-02 | TB-PROPOSED-02 | AS-PROPOSED-05 | Mitigate / Mitigate | C-PROPOSED-04, C-09 | RR-22 | Yes |
| PROPOSED-07c | TA-04, TA-06, TA-10 | A-PROPOSED-03 | TB-PROPOSED-02, TB-05 | AS-PROPOSED-04, AS-07 | Mitigate / Mitigate | C-PROPOSED-03, C-16 (E) | RR-23 | Yes |
| PROPOSED-08 | TA-01, TA-02, TA-04, TA-06 | A-03, A-04, A-12 | TB-03, TB-06 | AS-05, AS-04, AS-06 | Mitigate / n/a | C-03, C-05, C-14 (both) | RR-26 | Yes |

Every accepted in-scope threat maps to ≥1 actor, asset, boundary, surface,
control, residual and verification criterion. PROPOSED-01 is traceable but not counted.

## 3. Control reverse coverage

| Control | Threats | Orphan? |
| --- | --- | --- |
| C-01 | TM-01, TM-02, TM-03, TM-04, TM-05, TM-15, PROPOSED-01, PROPOSED-04 | No |
| C-02 | TM-03, TM-04, TM-06, TM-10, TM-12, TM-16, PROPOSED-04 | No |
| C-03 | TM-01–TM-16 (except none), PROPOSED-01–08 | No |
| C-04 | TM-01, TM-02, TM-05, TM-10, PROPOSED-05a | No |
| C-05 | TM-07, PROPOSED-02, PROPOSED-05a, PROPOSED-08 | No |
| C-06 | TM-07, TM-10, TM-13, PROPOSED-05c, PROPOSED-05d | No |
| C-07 | TM-01, TM-02, TM-05, TM-11, PROPOSED-01 | No |
| C-08 | TM-02, TM-05, TM-11 | No |
| C-09 | TM-04, TM-06, TM-08, TM-11, TM-12, TM-15, PROPOSED-03, PROPOSED-04, PROPOSED-07b | No |
| C-10 | TM-03, TM-06, TM-12, TM-16, PROPOSED-02, PROPOSED-05a, PROPOSED-05b | No |
| C-11 | TM-09, PROPOSED-06 | No |
| C-12 | TM-08, TM-10, TM-14, PROPOSED-05b | No |
| C-13 | TM-15 | No |
| C-14 | TM-01, TM-02, TM-03, TM-05, TM-06, TM-07, TM-11, TM-13, TM-15, PROPOSED-01, PROPOSED-06, PROPOSED-08 | No |
| C-15 | TM-12 | No |
| C-16 | TM-01, TM-04, TM-06, TM-09, TM-10, PROPOSED-05d, PROPOSED-07c | No |
| C-PROPOSED-01 | PROPOSED-03 | No |
| C-PROPOSED-02 | PROPOSED-02, PROPOSED-05b | No |
| C-PROPOSED-03 | TM-08, TM-10, TM-14, PROPOSED-05b, PROPOSED-06, PROPOSED-07c | No |
| C-PROPOSED-04 | PROPOSED-07a, PROPOSED-07b | No |
| C-PROPOSED-05 | PROPOSED-06 | No |
| C-PROPOSED-06 | PROPOSED-01, PROPOSED-04 | No |

## 4. Schema-placeholder mapping (design intent only)

| Placeholder (`src/hitl2/schemas.py`) | Threats | Unresolved semantics for future workstreams |
| --- | --- | --- |
| `ActionProposal` | TM-01, TM-02, TM-03, TM-16, PROPOSED-01, PROPOSED-04 | agent identity representation; action vocabulary; parameter schema; context contract |
| `GovernanceDecision` | TM-03, TM-06, TM-10, TM-12, TM-16, PROPOSED-05a/b/d, PROPOSED-08 | outcome vocabulary/precedence; autonomy-level representation; level/expiry binding |
| `RiskAssessment` | TM-11, TM-12 | RSM output contract; features; scores; thresholds (none invented) |
| `AuditEvent` | TM-08, TM-10, TM-14, PROPOSED-02, PROPOSED-05b, PROPOSED-07c | event taxonomy; payload; clock trust; integrity (**none implemented**); seven A-08 properties |

This is design intent only; no file outside this directory was modified and no
placeholder was treated as validated.

## 5. Detection-mechanism dependencies (Phase 0.1)

| Control / mechanism class | Detection path | Prerequisites | Status | Dependent records |
| --- | --- | --- | --- | --- |
| `C-03` — D2/D3 | Independent audit / policy recomparison / tamper-evidence verification | Verifier independent of decision path or store, separate trust domain, protected keys, trusted time, execution trace | `NOT_ESTABLISHED` | TM-01, TM-02, TM-06, TM-08, TM-10, TM-12, TM-14, PROPOSED-01, PROPOSED-05d, PROPOSED-06, PROPOSED-07a/c, PROPOSED-08 |
| `C-14` — D6 | Anomaly detection and alerting | Independent collector, protected thresholds, separate trust domain | `NOT_ESTABLISHED` | TM-01, TM-02, TM-04, TM-07, TM-11, TM-13, TM-15, PROPOSED-01, PROPOSED-06, PROPOSED-08 |
| `C-01`/`C-02` — D1 | Boundary allowlist/access-check rejection + local denial event | Action/tool vocabulary (WM4) and local recording | `CONDITIONAL` | TM-03, TM-04 (prevention), PROPOSED-04 |
| `C-08` — D1 | Context distributional validation | Feature contract (WM3, C7) | `CONDITIONAL` | TM-11 |
| `C-10` — D1 / D4 | Revalidation rejects replay; audit correlation needs trusted time | Digest binding; trusted time for correlation | `CONDITIONAL` / `NOT_ESTABLISHED` | TM-16 |
| `C-11` — D1 | Latency/queue thresholds | Threshold values and fail behaviour (C4) | `CONDITIONAL` | TM-09 |
| `C-12` — D4 | Monotonic sequence + independent time | Trusted time (C2) | `NOT_ESTABLISHED` | TM-14, PROPOSED-05b |
| `C-13` — D5 | Digest comparison against independent source | Independent digest source | `NOT_ESTABLISHED` | TM-15 |
| `C-PROPOSED-02` — D1 | Approval-origin authenticity check | WM2 IAM model (C5) | `CONDITIONAL` | PROPOSED-02 |
| `C-PROPOSED-03` — D2/D3 | Independent verifier service | Separate trust domain, keys, time (C2) | `NOT_ESTABLISHED` | TM-08, TM-10, TM-14, PROPOSED-05b, PROPOSED-06, PROPOSED-07c |
| `C-PROPOSED-04` — D5/D6 | Root/key/time assurance | WM5 TCB (C2) | `NOT_ESTABLISHED` | PROPOSED-07a/b |
| `C-PROPOSED-05` — D6 | Independent monitoring collector | Collector independence (C2) | `NOT_ESTABLISHED` | PROPOSED-06 |

Per-threat mechanism classes, prerequisites and statuses are recorded in
`threat-catalogue.md` under **Detection mechanism**. No detection capability is
`ESTABLISHED`.
