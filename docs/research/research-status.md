# Research Status Register

This register tracks the maturity of each part of the HITL 2.0 prototype.
Language here is deliberately conservative: proposed work is never described
as implemented.

## Status vocabulary

| Status | Meaning |
| --- | --- |
| **Proposed** | An idea or target capability. No agreed specification exists. |
| **Specified** | A written specification has been agreed and is ready to implement. |
| **Implemented** | Code exists in this repository and is covered by tests. |
| **Experimentally validated** | Empirical evidence supports the claim. No such evidence exists yet. |

## Agreement gates (Dr. Divya Rao review)

These items must be agreed before the actual governance mechanisms are
implemented. All are currently **open**.

| Item | Status | Notes |
| --- | --- | --- |
| Research contribution | Proposed / open | Exact contribution and novelty claim not agreed. |
| Threat model | Proposed / open | Adversaries, assets and trust boundaries not agreed. |
| RSM specification | Proposed / open | No agreed model, features or thresholds. |
| Policy composition | Proposed / open | Composition and conflict-resolution semantics not agreed. |
| Audit integrity | Proposed / open | Guarantees and mechanisms not agreed; no tamper-proof claim is made. |
| Evaluation plan | Proposed / open | IBM AML files are present locally but their source revision is unverified; no metrics or experiments defined. |

## Component status

### Proposed (not specified, not implemented)

| Component | Status | Notes |
| --- | --- | --- |
| Hierarchical autonomy (L0–L4) | Proposed | No selection logic; no level semantics agreed. |
| Dynamic constraint walls / runtime enforcement | Proposed | No enforcement mechanism. |
| Risk scoring model (RSM) | Proposed | No classifier (including no Random Forest), features or thresholds. |
| Policy engine integration | Proposed | No OPA or other engine integrated. |
| Constraint composition | Proposed | Semantics intentionally undefined. |
| Human oversight / escalation workflow | Proposed | No escalation rules. |
| Audit store / integrity mechanism | Proposed | No hashing, chaining or ledger; no integrity guarantee claimed. |
| Notification, IAM, dashboards | Proposed | Supporting services only as concepts. |
| FastAPI transport layer | Proposed | Deliberately not introduced yet. |
| Dataset-driven evaluation | Proposed | Local sources identified; no experiments designed or run. |

### Specified

| Component | Status | Notes |
| --- | --- | --- |
| — | None | No research specification has been agreed and frozen yet. |

### Implemented (current prototype)

| Component | Status | Notes |
| --- | --- | --- |
| `src`-based package layout | Implemented | Distribution/import name `hitl2`. |
| Module boundaries | Implemented | `agents`, `governance`, `risk`, `policies`, `human_oversight`, `audit`, `api` (namespaces only). |
| `ActionProposal` placeholder | Implemented | Typed placeholder; unresolved fields marked. |
| `GovernanceDecision` placeholder | Implemented | Typed placeholder; no autonomy-level logic. |
| `RiskAssessment` placeholder | Implemented | Typed placeholder; no features or thresholds. |
| `AuditEvent` placeholder | Implemented | Typed placeholder; no integrity fields or claims. |
| pytest suite | Implemented | Import, placeholder-instantiation and data-infrastructure tests using small fixtures. |
| Ruff configuration and CI workflow | Implemented | uv-based lint, format and test checks run in GitHub Actions using the committed `uv.lock`. |
| Dataset ingestion infrastructure | Implemented | `src/hitl2/data/`: discovery, format detection, streaming loaders, validation, checksums, reproducible preprocessing; tested with small temporary fixtures. |
| Dataset provenance registry | Implemented | `data/metadata/datasets.yaml` and `checksums.sha256` record source, version, license and restrictions. |
| IEEE-CIS download helper | Implemented | Guarded script documents prerequisites; not executed, and no data downloaded. |
| IBM AML dataset files | Present locally | 18 CSV/TXT files; source revision and retrieval date unverified. Schema, dimensions, labels and semantics not independently validated. |

### Experimentally validated

| Component | Status | Notes |
| --- | --- | --- |
| — | None | No experiments, metrics or results exist. IBM AML data files are present locally but have not been independently validated. |

Dataset discovery and ingestion are infrastructure work and **do not**
constitute experimental validation of HITL 2.0.

## Explicit non-goals for this iteration

- Implementing a Random Forest classifier or any risk model.
- Inventing risk features, scores or thresholds.
- Implementing L0–L4 selection logic.
- Inventing constraint-composition semantics.
- Claiming that any audit component is tamper-proof.
- Fabricating datasets, experiments or results.
- Describing proposed functionality as implemented.
