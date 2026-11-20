# Attack-surface inventory

**Status: Proposed.** Phase 0 baseline. **Inventory, not a threat list.** Surfaces
carry no dispositions. Derived from intended roles of placeholders/namespaces,
not implemented code.

| ID | Attack surface | Related placeholder / namespace (intended role) | Reachable by | Threats using it |
| --- | --- | --- | --- | --- |
| `AS-01` | Action-proposal ingestion | `ActionProposal` (`proposal_id`, `agent_id`, `action`, `parameters`, `context`) | `TA-01`, `TA-02` | TM-01, TM-02, TM-03, TM-16, PROPOSED-04 |
| `AS-02` | Context / RSM sensor inputs | `RiskAssessment.result`; `risk` namespace | `TA-02`, `TA-04` | TM-02, TM-11, PROPOSED-06 |
| `AS-03` | Policy and configuration management | `policies` namespace; policy store (conceptual) | `TA-04`, `TA-06` | TM-04, TM-06, TM-12, PROPOSED-03 |
| `AS-04` | Human approval / confirmation interface | `human_oversight` namespace; L2–L4 decisions | `TA-02`, `TA-03`, `TA-08` | TM-07, TM-09, TM-13, PROPOSED-02, PROPOSED-05a/b/c/d, PROPOSED-08 |
| `AS-05` | Governance decision output | `GovernanceDecision` (`outcome`, `rationale`) | `TA-06` | TM-03, TM-06, TM-10, TM-12, TM-16, PROPOSED-08 |
| `AS-06` | Tool invocation / execution interface | `agents` namespace; execution path | `TA-01`, `TA-02`, `TA-05` | TM-01, TM-03, TM-04, TM-05, PROPOSED-04 |
| `AS-07` | Audit event ingestion / query | `AuditEvent` (`event_id`, `event_type`, `timestamp`, `payload`); `audit` namespace | `TA-04`, `TA-06` | TM-08, TM-10, TM-14, PROPOSED-06, PROPOSED-07c |
| `AS-08` | IAM identity and credential interfaces | IAM supporting service (conceptual) | `TA-03`, `TA-04`, `TA-06` | TM-04, TM-13, PROPOSED-02, PROPOSED-04 |
| `AS-09` | Dataset ingestion / preprocessing | `src/hitl2/data/` (implemented infrastructure; input channel only) | `TA-02`, `TA-05` | TM-11, TM-15 |
| `AS-10` | Clock / time source interface | `AuditEvent.timestamp` (trust semantics unresolved) | `TA-04`, `TA-06`, `TA-11` | TM-08, TM-14, TM-16, PROPOSED-05b |
| `AS-PROPOSED-01` | Inter-agent messaging / delegation *(provisional)* | No existing placeholder | `TA-01`, `TA-09` | PROPOSED-01 (pending D1) |
| `AS-PROPOSED-02` | Approval-origin / credential response *(provisional)* | `AS-04`/`AS-08` refinement | `TA-02`, `TA-03`, `TA-04`, `TA-06` | PROPOSED-02, PROPOSED-05b |
| `AS-PROPOSED-03` | Policy update / distribution channel *(provisional)* | `AS-03` refinement | `TA-04`, `TA-05`, `TA-06` | PROPOSED-03 |
| `AS-PROPOSED-04` | Monitoring / verification interface *(provisional)* | Alerts service; proposed verifier | `TA-06`, `TA-10` | PROPOSED-06, PROPOSED-07c, TM-10 |
| `AS-PROPOSED-05` | Trust-anchor / key-custody interface *(provisional)* | Proposed `A-PROPOSED-01`/`02` | `TA-04`, `TA-11` | PROPOSED-07a, PROPOSED-07b |
| `AS-PROPOSED-06` | Trusted time-source interface *(provisional)* | Proposed `A-PROPOSED-04` | `TA-04`, `TA-11` | TM-14, PROPOSED-05b |

## Notes

- Placeholders have `UNRESOLVED` field descriptions in `src/hitl2/schemas.py`.
- `AS-09` is implemented *data infrastructure*, not experimental data; 18 IBM
  AML CSV/TXT files are present locally, but their exact source revision is
  unverified and their contents have not been independently validated.
  IEEE-CIS was not downloaded.
- No surface is claimed to be validated, hardened or monitored.
- Proposed surfaces are referenced only by proposed threats.
