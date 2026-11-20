# Asset inventory (protected assets)

**Status: Proposed.** Phase 0 baseline. **Inventory, not a threat list.** Asset IDs
carry no dispositions.

## 1. Accepted assets

| ID | Protected asset | Description | Why it matters | Zones |
| --- | --- | --- | --- | --- |
| `A-01` | Agent behavioral integrity | Acts according to intended objectives and governance constraints | Loss makes all downstream controls operate on hostile proposals | Z1 |
| `A-02` | Action-proposal integrity | Provenance and correctness of proposing identity, action, parameters, context | Forged proposals defeat assessment and policy validation | Z1, Z2 |
| `A-03` | Governance-decision integrity | Decision reflects actual assessment, policy result and human input | Tampered decisions make enforcement and audit meaningless | Z2, Z4 |
| `A-04` | Human oversight decisions | Records/effects of L1–L4 monitoring, confirmation, approval, override | Core accountability artifact | Z2, Z5 |
| `A-05` | Policy and configuration integrity | Rules, constraints, level policy, allowlists, change history | Silent change nullifies governance | Z2, Z3, Z4 |
| `A-06` | Identity, authentication and authorization data | Agent/human identities, roles, credentials, permissions | Spoofing and escalation flow from here | Z3, Z5 |
| `A-07` | Data, context and sensor inputs | Datasets, retrieved content, tool outputs, telemetry, context fields | Main injection/poisoning channel | Z1, Z3 |
| `A-08` | Audit record/store | The audit trail as a single asset (see §2 for its properties) | Detection, non-repudiation and reconstruction depend on it | Z4 |
| `A-09` | Control-plane availability | Ability to process proposals and obtain oversight in time | Saturation can force bypass/fail-open | Z2 |
| `A-10` | Human reviewer attention | Finite review/approval capacity | Fatigue and overload are exploitable | Z5 |
| `A-11` | Tool/execution environment integrity | Tools, plugins, execution path | Tool misuse and escalation materialise here | Z1, Z4 |
| `A-12` | Compliance, legal and reputational standing | Ability to demonstrate governed behaviour | Harms from tampering and uncontrolled actions | Z5 |

## 2. A-08 security properties (properties, **not** separate assets)

`A-08` keeps its identity: the underlying audit record/store is one asset. The
following are assurance dimensions of that asset:

| Property | Meaning | Affected by | Control / dependency | Status |
| --- | --- | --- | --- | --- |
| Confidentiality | Protection against unauthorised disclosure | TM-05, PROPOSED-07b | Log access control; encryption design undefined | Proposed, `NOT_ESTABLISHED` |
| Availability | Ability to access required records | TM-09, TM-08 (deletion), PROPOSED-06 | C-11; store/architecture undefined | Proposed, `NOT_ESTABLISHED` |
| Completeness | Whether all required events are captured | TM-08 (omission), PROPOSED-06 | Event-coverage requirement undefined | Proposed, `NOT_ESTABLISHED` |
| Integrity | Records remain correct and unaltered | TM-08, TM-10 | C-03, C-12; verifier undefined | Proposed, `NOT_ESTABLISHED` |
| Tamper evidence | Unauthorised modification can be detected | TM-08, TM-14 | Independent verifier + keys + time; all unspecified | `NOT_ESTABLISHED` |
| Tamper resistance | Difficulty of modifying/deleting records | TM-08, PROPOSED-06 | C-09; append-only design undefined | `NOT_ESTABLISHED` |
| Immutability | Stronger property; records cannot be changed | None currently | No mechanism specified | **`NOT_ESTABLISHED`** |

Terminology: use **tamper-evident** and **integrity-verifiable** where appropriate.
An append-only design is **not** automatically immutable or tamper-proof. No
cryptographic integrity mechanism is claimed to exist.

## 3. Proposed supporting assets (temporary labels; none implemented)

| ID | Asset | Description | Security properties | Trust assumptions | Threats | Boundaries | Surfaces | Dependencies | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `A-PROPOSED-01` | Trust anchor / root of trust | Highest-privilege trust root for verification | Integrity, authenticity, non-repudiation | Root is distinct from verifier and keys; custody undefined | PROPOSED-07a | TB-PROPOSED-02 | AS-PROPOSED-05 | C2 (WM5) | Proposed |
| `A-PROPOSED-02` | Cryptographic key material / key-management service | Key generation, storage, rotation, use (retained together — see §4) | Confidentiality, integrity, controlled use | Custody boundary undefined; no HSM/KMS assumed | PROPOSED-07b, TM-08 | TB-PROPOSED-02 | AS-PROPOSED-05 | C2 (WM5) | Proposed |
| `A-PROPOSED-03` | Independent verification service | Verifies audit events / decisions | Independence, integrity, availability | Must be in a trust domain separate from audit store and enforcement point | PROPOSED-07c, TM-08, TM-10 | TB-PROPOSED-02 | AS-PROPOSED-04 | C2 (WM5) | Proposed |
| `A-PROPOSED-04` | Trusted time source | Ordering/freshness reference | Accuracy, monotonicity, independence | Independent of host and governed components | TM-14, PROPOSED-05b, TM-16 | TB-08, TB-PROPOSED-02 | AS-10, AS-PROPOSED-06 | C2 (WM5) | Proposed |
| `A-PROPOSED-05` | Monitoring/collection service | Collects telemetry and emits alerts | Integrity, availability, independence | Collector not controlled by monitored component | PROPOSED-06, TM-09 | TB-04, TB-05 | AS-PROPOSED-04 | C2/WM5 | Proposed |

Every proposed asset is referenced by ≥1 threat. No cryptographic implementation
is asserted.

## 4. Key material vs key-management service — explicit decision

**Decision (Phase 0): retain together as `A-PROPOSED-02`.**
Rationale: the custody boundary, lifecycle ownership and separation requirements
are undefined (C2/WM5). Splitting now would invent a boundary. **Split trigger:**
if WM5 specifies distinct custody domains for raw key material and the service
that uses it, record the split with new labels and re-run traceability.

## 5. Notes

- Assets are described without implementation detail; `schemas.py` contains only
  placeholders (`AuditEvent` has no integrity fields).
- No asset is claimed to be protected today.
- Proposed assets are not counted as accepted assets in gate calculations.
