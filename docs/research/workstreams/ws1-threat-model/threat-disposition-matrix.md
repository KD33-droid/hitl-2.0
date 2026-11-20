# Threat disposition matrix (Phase 0 baseline)

**Status: Proposed.** Exactly one **primary disposition** per threat per
**applicable** architecture variant. `n/a` / `NOT_APPLICABLE` means the threat does
not apply to that variant (rationale given). Primary disposition is **not**
implementation maturity. Capability status is recorded separately below.

Legend: `C` = *posture* conditional on a named unresolved WM2–WM5 decision;
it is **not** the capability status `CONDITIONAL` and does not assert a defined
prevention mechanism. `P` = provisional pending scope/mentor decision;
`n/a` = not applicable. Where the capability status is `NOT_ESTABLISHED`, no
prevention mechanism exists and the primary is `Mitigate`.

## 1. Advisory-governance matrix

| Threat | Primary | Conditional / note |
| --- | --- | --- |
| TM-01 Agent compromise | `Outside boundary` | Consequences in scope |
| TM-02 Prompt injection | `Mitigate` | — |
| TM-03 Unauthorized tool invocation | `Mitigate` | No authoritative choke point |
| TM-04 Privilege escalation | `Mitigate` | — |
| TM-05 Data exfiltration | `Mitigate` | — |
| TM-06 Policy bypass | `Mitigate` | Advice may be ignored |
| TM-07 Approval manipulation | `Mitigate` | — |
| TM-08 Audit tampering | `Mitigate` | Detection `NOT_ESTABLISHED` |
| TM-09 Availability | `Mitigate` | Fail behaviour undecided (C4) |
| TM-10 Enforcement-point compromise | `n/a` | No mediating enforcement point in advisory mode |
| TM-11 Context/RSM poisoning | `Mitigate` | — |
| TM-12 Autonomy-level manipulation | `Mitigate` | Level semantics undecided (C3) |
| TM-13 Malicious approver | `Outside boundary` | Consequences in scope |
| TM-14 Clock manipulation | `Mitigate` | Detection `NOT_ESTABLISHED` |
| TM-15 Supply-chain compromise | `Outside boundary` | Consequences in scope |
| TM-16 Replay / TOCTOU | `Mitigate` | — |
| PROPOSED-01 Cross-agent trust | `PENDING` | D1 mentor scope; **not counted** |
| PROPOSED-02 Approver identity spoofing | `Mitigate` | C5 |
| PROPOSED-03 Policy provenance/update | `Mitigate` | C6 |
| PROPOSED-04 Identity/authn/authz failure | `Mitigate` | C5 |
| PROPOSED-05a L2/L3 confusion | `Mitigate` | C3 |
| PROPOSED-05b Temporal validity | `Mitigate` | C2, C3 |
| PROPOSED-05c Multi-approver conflict | `Mitigate` | C3 |
| PROPOSED-05d Override abuse | `Mitigate` | C3 |
| PROPOSED-06 Monitoring suppression | `Mitigate` | C2 |
| PROPOSED-07a Root-of-trust compromise | `Outside boundary` | Consequences in scope |
| PROPOSED-07b Verification-key compromise | `Mitigate` | C2 |
| PROPOSED-07c Verification-service compromise | `Mitigate` | C2 |
| PROPOSED-08 Advisory advice suppression | `Mitigate` | Advisory-specific |

## 2. Enforced-governance matrix

| Threat | Primary | Conditional / note |
| --- | --- | --- |
| TM-01 Agent compromise | `Outside boundary` | Consequences in scope |
| TM-02 Prompt injection | `Mitigate` | — |
| TM-03 Unauthorized tool invocation | `Prevent` (`C`) | Enforced governance + intact enforcement point + WM4 tool model |
| TM-04 Privilege escalation | `Prevent` (`C`) | Least privilege + enforced IAM (C5) |
| TM-05 Data exfiltration | `Mitigate` | — |
| TM-06 Policy bypass | `Prevent` (`C`) | Single authoritative point; TM-10 dependency |
| TM-07 Approval manipulation | `Mitigate` | Human factors irreducible |
| TM-08 Audit tampering | `Mitigate` | Detection `NOT_ESTABLISHED` |
| TM-09 Availability | `Mitigate` | Fail-open/closed undecided (C4) |
| TM-10 Enforcement-point compromise | `Mitigate` | Enforced-specific; detection `NOT_ESTABLISHED` |
| TM-11 Context/RSM poisoning | `Mitigate` | — |
| TM-12 Autonomy-level manipulation | `Mitigate` | No defined prevention mechanism; WM2 floors undecided (C3); future prevention NOT_ESTABLISHED |
| TM-13 Malicious approver | `Outside boundary` | Consequences in scope |
| TM-14 Clock manipulation | `Mitigate` | Detection `NOT_ESTABLISHED` |
| TM-15 Supply-chain compromise | `Outside boundary` | Consequences in scope |
| TM-16 Replay / TOCTOU | `Prevent` (`C`) | Digest binding + revalidation + clock trust |
| PROPOSED-01 Cross-agent trust | `PENDING` | D1 mentor scope; **not counted** |
| PROPOSED-02 Approver identity spoofing | `Mitigate` | No defined mechanism; WM2 IAM undecided (C5); future prevention NOT_ESTABLISHED |
| PROPOSED-03 Policy provenance/update | `Mitigate` | No defined mechanism; WM4/WM5 signing undecided (C6); future prevention NOT_ESTABLISHED |
| PROPOSED-04 Identity/authn/authz failure | `Mitigate` | No defined mechanism; WM2 IAM undecided (C5); future prevention NOT_ESTABLISHED |
| PROPOSED-05a L2/L3 confusion | `Mitigate` | No defined mechanism; WM2 semantics undecided (C3); future prevention NOT_ESTABLISHED |
| PROPOSED-05b Temporal validity | `Mitigate` | No defined mechanism; WM2 expiry + WM5 time undecided (C2/C3); future prevention NOT_ESTABLISHED |
| PROPOSED-05c Multi-approver conflict | `Mitigate` | No resolution rule defined |
| PROPOSED-05d Override abuse | `Mitigate` | Override authority undefined |
| PROPOSED-06 Monitoring suppression | `Mitigate` | Independent monitor unspecified |
| PROPOSED-07a Root-of-trust compromise | `Outside boundary` | Consequences in scope |
| PROPOSED-07b Verification-key compromise | `Mitigate` | C2 |
| PROPOSED-07c Verification-service compromise | `Mitigate` | C2 |
| PROPOSED-08 Advisory advice suppression | `n/a` | Enforced mode uses TM-10/TM-06 |

## 3. Capability-status matrix (maturity, not disposition)

Capabilities: P = Prevent, D = Detect, M = Mitigate, R = Response, V = Recovery.
Statuses: E = ESTABLISHED, C = CONDITIONAL, N = NOT_ESTABLISHED, X = NOT_APPLICABLE.
**No capability is ESTABLISHED** because no mechanism has both specified
prerequisites and supporting evidence.

| Threat | P | D | M | R | V |
| --- | --- | --- | --- | --- | --- |
| TM-01 | N | N | C | N | N |
| TM-02 | N | N | C | N | N |
| TM-03 | C | C | C | N | N |
| TM-04 | C | N | C | N | N |
| TM-05 | C | C | C | N | N |
| TM-06 | C | N | C | N | N |
| TM-07 | N | N | C | N | N |
| TM-08 | N | N | C | N | N |
| TM-09 | N | C | C | N | N |
| TM-10 | N | N | C | C | N |
| TM-11 | N | C | C | N | N |
| TM-12 | N | N | C | N | N |
| TM-13 | N | N | C | N | N |
| TM-14 | N | N | C | N | N |
| TM-15 | N | N | C | N | N |
| TM-16 | C | C | C | N | N |
| PROPOSED-01 | N | N | C | N | N |
| PROPOSED-02 | N | C | C | N | N |
| PROPOSED-03 | N | N | C | N | N |
| PROPOSED-04 | N | C | C | N | N |
| PROPOSED-05a | N | C | C | N | N |
| PROPOSED-05b | N | N | C | N | N |
| PROPOSED-05c | N | C | C | N | N |
| PROPOSED-05d | N | N | C | N | N |
| PROPOSED-06 | N | N | C | N | N |
| PROPOSED-07a | N | N | C | N | N |
| PROPOSED-07b | N | N | C | N | N |
| PROPOSED-07c | N | N | C | N | N |
| PROPOSED-08 | N | N | C | N | N |

## 4. Aggregate counts (accepted in-scope threats only; PROPOSED-01 excluded)

| Primary | Advisory | Enforced |
| --- | --- | --- |
| `Prevent` | 0 | 4 (TM-03, -04, -06, -16) |
| `Detect` | 0 | 0 |
| `Mitigate` | 12 | 9 |
| `Outside boundary` | 3 (TM-01, -13, -15) | 3 |
| `n/a` | 1 (TM-10) | 0 |
| **Total accepted** | **16** | **16** |

No capability is `ESTABLISHED`. Detection is `NOT_ESTABLISHED` for all records
whose only detection path is class D2–D6 (see `methodology.md §1.1` and each
record's **Detection mechanism** field). D1 application-level detection remains
`CONDITIONAL` only where a concrete validation shape and its prerequisites are
named: TM-03, TM-05, TM-09, TM-11, TM-16, PROPOSED-02, PROPOSED-04, PROPOSED-05a
and PROPOSED-05c.
