# Threat actor model

**Status: Proposed.** Phase 0 baseline. **Inventory, not a threat list.** Actor IDs
carry no dispositions.

| ID | Threat actor | Capabilities / access (assumed) | Motivation | Threats driven |
| --- | --- | --- | --- | --- |
| `TA-01` | Compromised or malicious agent | Emits proposals, invokes tools, may control its context/output | Attacker-directed objectives | TM-01, TM-02, TM-03, TM-05, TM-09, TM-11, TM-12, TM-16, PROPOSED-01, PROPOSED-04, PROPOSED-06 |
| `TA-02` | External attacker via untrusted content | Places content in data, documents, tool outputs, messages | Influence behaviour, exfiltrate | TM-02, TM-03, TM-05, TM-07, TM-09, TM-11, TM-12, PROPOSED-02, PROPOSED-04, PROPOSED-05a/b |
| `TA-03` | Insider — malicious/coerced human approver or operator | Legitimate human credentials at L2–L4; can approve/override | Gain, coercion, sabotage | TM-04, TM-07, TM-13, PROPOSED-04, PROPOSED-05c/d |
| `TA-04` | Privileged administrator / governance operator | Modifies policy/config/IAM/infrastructure; may access audit store | Escalate, hide activity | TM-04, TM-06, TM-08, TM-09, TM-11, TM-14, PROPOSED-02, PROPOSED-03, PROPOSED-04, PROPOSED-05a/b, PROPOSED-06, PROPOSED-07a/b/c |
| `TA-05` | Supply-chain actor (tool/model/plugin/data provider) | Influences third-party components before entry | Persistent access, data theft | TM-01, TM-03, TM-05, TM-11, TM-15, PROPOSED-01, PROPOSED-03 |
| `TA-06` | Attacker controlling a governance component | Compromised policy engine, enforcement point or decision path; issues/suppresses decisions | Disable governance while appearing normal | TM-03, TM-04, TM-06, TM-08, TM-09, TM-10, TM-12, TM-14, TM-16, PROPOSED-02, PROPOSED-03, PROPOSED-05a/b, PROPOSED-06, PROPOSED-07a/b/c |
| `TA-07` | Passive observer / eavesdropper | Observes traffic/interfaces; no modification | Information gathering | TM-05 |
| `TA-08` | Negligent or overloaded human reviewer (non-adversarial) | Honest but fatigued, time-pressured, queue-loaded | None — human-factors condition | TM-07, TM-09, PROPOSED-05b (automation bias via TM-07) |
| `TA-09` | Colluding or impersonating agent peer *(Phase 0 addition)* | Sends messages claiming another agent's identity; delegates authority abusively | Cross-agent bypass of oversight | PROPOSED-01 (pending D1) |
| `TA-10` | Compromised monitoring/verification operator *(Phase 0 addition)* | Controls collector or verifier configuration, thresholds or results | Hide anomalies, suppress alerts | PROPOSED-06, PROPOSED-07c |
| `TA-11` | Key-custody / root-of-trust operator *(Phase 0 addition)* | Holds or can use root/key material and time-source configuration | Forge trust, keys, timestamps | PROPOSED-07a, PROPOSED-07b, TM-14 |

## Attribution notes

- Actors are roles, not identities; one real actor may occupy several roles.
- `TA-09` is **conditional on mentor decision D1**; it must not be treated as
  accepted until multi-agent scope is approved.
- Human approver impersonation (PROPOSED-02, `TA-02`/`TA-04`/`TA-06`) is distinct
  from agent/service identity failure (PROPOSED-04, `TA-01`/`TA-02`/`TA-04`).
- No actor is assumed omnipotent; each threat states preconditions.
- Reference correction: Greshake et al. is **R12**, not R8 (AUD-13).
