# WM1 — Threat Model (documentation set)

**Status: Proposed.** Phase 0 technical-consistency baseline. This is a *proposed
research threat model* of the target HITL 2.0 architecture. It is **not** a
mentor-accepted specification, **not** an implementation, and **not** experimental
validation. No governance mechanism in this repository is implemented; all
controls below are *proposed*.

## Scope of this workstream

This set covers WM1 only. WM2–WM6 are **not** started. It does not modify files
outside this directory. Phase 0 established semantic consistency; Phase 0.1
corrected the two residual semantic inconsistencies identified by independent
audit (IA-01 disposition/capability mismatch; IA-02 detection-status classes).
Neither phase closed the WM1 acceptance gate.

## Document index

| Document | Contents |
| --- | --- |
| [methodology.md](methodology.md) | Selected methods and their application; advisory vs enforced governance; semantic model; evidence limitations |
| [system-characterization.md](system-characterization.md) | Target architecture, scope, data flows, autonomy convention |
| [asset-inventory.md](asset-inventory.md) | Protected assets `A-01`…`A-12`, audit-log properties, proposed trust assets `A-PROPOSED-01`…`05` |
| [threat-actor-model.md](threat-actor-model.md) | Actors `TA-01`…`TA-11` (inventory — not threats) |
| [trust-boundary-analysis.md](trust-boundary-analysis.md) | Boundaries `TB-01`…`TB-08` and provisional `TB-PROPOSED-01`…`02` |
| [attack-surface-inventory.md](attack-surface-inventory.md) | Surfaces `AS-01`…`AS-10` and provisional `AS-PROPOSED-01`…`06` |
| [threat-catalogue.md](threat-catalogue.md) | Accepted threats `TM-01`…`TM-16` and proposed records with required fields |
| [threat-disposition-matrix.md](threat-disposition-matrix.md) | Architecture-specific primary dispositions and capability statuses |
| [residual-risk-register.md](residual-risk-register.md) | Residuals `RR-01`…`RR-11`, `RR-13`…`RR-26` |
| [attack-scenarios.md](attack-scenarios.md) | Attack trees/chains `AC-01`…`AC-06` |
| [threat-to-control-traceability.md](threat-to-control-traceability.md) | Controls `C-01`…`C-16` and proposed controls; two-dimensional applicability/status; traceability |
| [references.md](references.md) | Bibliography `R1`…`R15` with verification and access status |
| [decisions-and-evidence-register.md](decisions-and-evidence-register.md) | **Phase 0 addition**: unresolved decisions, provisional assumptions, source-access dependencies |

## Conventions used throughout

### Primary disposition (per applicable architecture variant)

Exactly one of: `Prevent` | `Detect` | `Mitigate` | `Outside boundary`.
`n/a` / `NOT_APPLICABLE` is used where the threat does not apply to a variant,
with rationale. This field expresses the defensible posture — **not** maturity.

### Capability maturity (separate axis)

| Status | Meaning |
| --- | --- |
| `ESTABLISHED` | Mechanism and prerequisites specified and supported by evidence. |
| `CONDITIONAL` | A defined mechanism could provide the capability if prerequisites are satisfied. |
| `NOT_ESTABLISHED` | Necessary mechanism or trust prerequisites not specified. |
| `NOT_APPLICABLE` | Capability does not apply to the threat or architecture variant. |

Capabilities: `Prevent`, `Detect`, `Mitigate`, `Response`, `Recovery`. Response
and recovery are **capability fields only** — there is no fifth primary
disposition. A `CONDITIONAL` or `NOT_ESTABLISHED` capability must not justify an
unconditional `Prevent` or `Detect` primary.

### Detection mechanism classes

Detection status is assigned by mechanism class (D1 application-level validation;
D2 independent policy comparison; D3 independent tamper-evidence verification;
D4 trusted-time/freshness; D5 protected-key or independent-source verification;
D6 independent monitoring/second verifier), defined in
[methodology.md §1.1](methodology.md). A `CONDITIONAL` detection status is used
only for a concrete D1 validation shape with named prerequisites; C-03/C-14
paths (D2–D6) are `NOT_ESTABLISHED` while their trust prerequisites are absent.
The `C` marker on a primary disposition means "conditional on a WM decision",
**not** the capability status `CONDITIONAL`.

### Architecture applicability and implementation status (separate)

- Applicability: `BOTH` | `ADVISORY_ONLY` | `ENFORCED_ONLY` | `NOT_APPLICABLE` | `UNRESOLVED`.
- Implementation: `NOT_IMPLEMENTED` | `PARTIALLY_IMPLEMENTED` | `IMPLEMENTED` | `NOT_ASSESSED`.

All WM1 controls are `NOT_IMPLEMENTED`.

### Inventories are not threats

`A-xx`, `TA-xx`, `TB-xx` and `AS-xx` are structuring artifacts. Only `TM-xx`
items are accepted threats. Proposed records carry `PROPOSED-xx` labels and are
**not** counted as accepted in-scope threats until the relevant decision is made.
`PROPOSED-01` is pending mentor scope approval.

### Autonomy convention (preserved verbatim)

| Level | Meaning |
| --- | --- |
| **L0** | Full autonomy |
| **L1** | Human monitoring |
| **L2** | Human confirmation of a specific bounded action already within authorised scope |
| **L3** | Explicit approval by an appropriately privileged human for an action requiring elevated authority |
| **L4** | Human control/override |

The L2 clarification (bounded action within authorised scope) and L3 clarification
(elevated authority) are definitional only. No timeout values, expiry periods,
quorum rules, override permissions or implicit-approval behaviour are defined.
**No implicit approval on timeout.**

### Outside-boundary semantics

For `TM-01`, `TM-13`, `TM-15` and `PROPOSED-07a`: the initiating compromise is
outside the assessed boundary; **consequences propagating into the HITL 2.0
control plane remain in scope** and are recorded with affected assets, controls
and residuals.

## Unresolved decisions and assumptions

All unresolved items, their owners and their consequences are in
[decisions-and-evidence-register.md](decisions-and-evidence-register.md).
Key unresolved decisions: D1 multi-agent scope (mentor); C1 architecture (WM2);
C2 trust anchors/key custody/time (WM5); C3 L2/L3 semantics (WM2); C4 fail
behaviour (WM2); C5 IAM model (WM2); C6 policy signing (WM4/WM5); C7 RSM
(WM3); A1 `TB-09` intent; A2 full-text access.

## Research-integrity statement

- No invented threat probability, risk score, RSM feature, threshold, experiment,
  result, security guarantee, cryptographic property or implemented control.
- No claim that a threat is handled merely because it is catalogued.
- No tamper-proof or immutable audit claim; `A-08` immutability is
  `NOT_ESTABLISHED`.
- IBM AML and IEEE-CIS are intended research inputs only; no experiment is claimed.
- Architecture changes are not proposed; WM2 records any future rationale.
