# Residual-risk register

**Status: Proposed.** Phase 0 baseline. Residuals are projected, not measured:
no control is implemented and no experiment exists. No likelihood/impact scores
or thresholds are assigned. A `NOT_ESTABLISHED` detection capability produces an
explicit "detection unavailable" residual, not a vague "may fail" note.

`RR-12` is **retired**; it was split into `RR-13`, `RR-14` and `RR-15` (AUD-16).

| ID | Residual risk | Threats | Why it remains | Owner / dependency | Closure criterion | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `RR-01` | Full agent behavioural compromise not prevented | TM-01 | Root cause in model/supply chain, outside boundary; anomalous-proposal detection NOT_ESTABLISHED (D6) | Model supply-chain security (outside WM1); WM4 bounds blast radius | Malicious-agent simulation shows blocked/escalated actions + audit record | Open |
| `RR-02` | No general prompt-injection prevention; adaptive attacks | TM-02 | Data/instruction separation unsolved; model robustness varies; anomalous-output detection NOT_ESTABLISHED (D6) | WM4 + model-layer research | Adaptive-injection harness result | Open |
| `RR-03` | Prevention collapses if enforcement point compromised or governance advisory | TM-03, TM-06 | Conditional on intact reference monitor | WM2 architecture (C1); TM-10 | Compromised-point test | Open |
| `RR-04` | Infrastructure/OS-level escalation outside model | TM-04 | Governance-layer scope only; role-change anomaly detection NOT_ESTABLISHED (D6) | Out of scope — boundary record | Mentor scope acceptance | Open |
| `RR-05` | Covert/timing exfiltration channels | TM-05 | Egress allowlisting cannot observe all channels | WM4 | Covert-channel analysis | Open |
| `RR-06` | Enforcement point single point of failure | TM-06, TM-10 | Prevention depends on one component; independent trace-based detection NOT_ESTABLISHED (D2) | WM2/WM4 | Path enumeration + divergence alert test | Open |
| `RR-07` | Human factors irreducible at L2–L4 | TM-07, TM-09 | Fatigue, deception, automation bias intrinsic; approval-pattern anomaly detection NOT_ESTABLISHED (D6) | WM2 oversight design; human-factors study | Human-factors evaluation | Open |
| `RR-08` | Audit integrity depends on unimplemented mechanisms and trusted time/keys | TM-08, TM-14 | `AuditEvent` has no integrity fields; immutability `NOT_ESTABLISHED` | WM5 (C2) | Tamper test on specified design | Open |
| `RR-09` | Fail-open vs fail-closed undecided | TM-09 | Security/availability trade-off unresolved | WM2 (C4) | Load test after decision documented | Open |
| `RR-10` | If enforcement and audit domains are both compromised, no assurance remains | TM-10 | Trust-anchor problem; no independent root assumed; independent decision-recomputation detection NOT_ESTABLISHED (D2) | WM5/WM2 (C2) | Trust-anchor analysis | Open |
| `RR-11` | Poisoning/supply-chain compromise undetectable without trusted provenance | TM-11, TM-15 | No verified upstream trust anchor; datasets absent; independent digest-source verification NOT_ESTABLISHED (D5) | WM3/WM6; provenance work | Digest/checksum verification test | Open |
| `RR-13` | Autonomy-level semantics, conflict and override authority undefined | TM-12, TM-16, PROPOSED-05a, -05c, -05d | L0–L4 selection, quorum and override rules belong to WM2; independent comparison detection NOT_ESTABLISHED (D2); no defined prevention mechanism, primary Mitigate until WM2 defines floors/authority | WM2 (C3) | Level-semantics, quorum and override tests after WM2 | Open |
| `RR-14` | Multi-agent scope unresolved; cross-agent threats not accepted | PROPOSED-01 | Single-agent assumption not approved; consequences unknown; cross-agent detection NOT_ESTABLISHED (D6) | **Mentor (D1)** | Scope decision recorded; claim limitation accepted if excluded | Open — not counted |
| `RR-15` | Malicious/coerced insider approval remains authoritative | TM-13 | Trusted-human assumption; single approver may suffice; approval-pattern anomaly detection NOT_ESTABLISHED (D6) | WM2 (C3) | Policy review on ≥2 approvers; insider simulation | Open |
| `RR-16` | **Audit tampering detection currently unavailable** | TM-08 | Independent verifier, separate trust domain, protected keys and trusted time unspecified | WM5 (C2) | Verifier specified and tamper test passes | Open — NOT_ESTABLISHED |
| `RR-17` | **Enforcement-point compromise detection currently unavailable** | TM-10 | Independent recomputation, execution trace and unmediated human gate unspecified | WM5/WM2 (C2, C1) | Divergence test after design specified | Open — NOT_ESTABLISHED |
| `RR-18` | **Trusted time absent; freshness/expiry detection unavailable** | TM-14, TM-16, PROPOSED-05b | No trusted time source; host-local timestamp not independent | WM5 (C2), WM2 (C3) | Time-source specified; rollback/expiry test | Open — NOT_ESTABLISHED |
| `RR-19` | Policy repository/update/rollback compromise | PROPOSED-03 | Signed updates, version pinning and provenance undefined; signature/version detection NOT_ESTABLISHED (D5); no defined prevention mechanism, primary Mitigate | WM4/WM5 (C6) | Three scenario tests after design | Open |
| `RR-20` | **Monitoring/alerting suppression detection unavailable** | PROPOSED-06 | Collector independence and threshold integrity unspecified | WM5 (C2) | Independent-monitor divergence test | Open — NOT_ESTABLISHED |
| `RR-21` | Root-of-trust compromise; downstream verification untrustworthy | PROPOSED-07a | Root design unspecified; origin outside boundary; independent higher-anchor detection NOT_ESTABLISHED (D6) | WM5 (C2) | Root-compromise test after design | Open |
| `RR-22` | Verification-key compromise forges integrity evidence | PROPOSED-07b | Key custody/rotation undefined; key-misuse detection NOT_ESTABLISHED (D5) | WM5 (C2) | Key-compromise/rotation test | Open |
| `RR-23` | **Verification-service compromise suppresses failure detection** | PROPOSED-07c | Second independent verifier unspecified | WM5 (C2) | Verifier-divergence test | Open — NOT_ESTABLISHED |
| `RR-24` | Human approver identity spoofing | PROPOSED-02 | IAM authority model undefined; no defined prevention mechanism, primary Mitigate | WM2 (C5) | Forged-approval test after IAM defined | Open |
| `RR-25` | Agent/service identity authentication and authorization failure | PROPOSED-04 | IAM authority model undefined; no defined prevention mechanism, primary Mitigate | WM2 (C5) | Unauthenticated proposal / authz-bypass test | Open |
| `RR-26` | Advisory recommendation suppression/forgery | PROPOSED-08 | No authoritative gate in advisory mode; trace independence unspecified; independent trace detection NOT_ESTABLISHED (D6) | WM2 (C1); WM5 (C2) | Advice-vs-execution-trace divergence test | Open |

## Limits of this register

- Residuals are not ranked. Any qualitative criticality ordering is a separate,
  mentor-reviewed analytical judgement (Phase 2, AUD-20); no numeric likelihood
  or impact is introduced.
- Every criterion is future; no test, metric or result is claimed.
- Closing a residual requires a mentor-agreed specification in WM2–WM5 and
  later implementation. Phase 0 closes none of them.

Detection-unavailable residuals above are explicit: where a threat has no D1
validation mechanism and its only path is C-03/C-14 (D2–D6), the residual states
that detection is `NOT_ESTABLISHED`, not merely that it may fail. Primary
`Mitigate` records for TM-12 and PROPOSED-02/03/04/05a/05b state that no defined
prevention mechanism exists; future `Prevent` remains a `NOT_ESTABLISHED`
capability pending WM2–WM5 decisions.
