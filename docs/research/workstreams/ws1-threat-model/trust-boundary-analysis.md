# Trust-boundary analysis

**Status: Proposed.** Phase 0 baseline. **Inventory, not a threat list.** Boundaries
carry no dispositions. A boundary is where data/control crosses differing trust
assumptions; STRIDE questions were applied here.

| ID | Boundary | Between | Trust assumption / concern | Threats crossing |
| --- | --- | --- | --- | --- |
| `TB-01` | Untrusted content → agent | External data, retrieved documents, tool outputs → agent context | Content untrusted; data/instruction line blurred | TM-02, TM-05, TM-11, TM-15 |
| `TB-02` | Agent → control plane | Agent ecosystem → proposal ingestion | Proposal metadata may be forged; agent identity unresolved | TM-01, TM-03, TM-16, PROPOSED-04 |
| `TB-03` | Control plane ↔ humans | Approval request and human response at L1–L4 | Human trusted when honest; presentation deceivable; approval origin spoofable; decision ignorable in advisory mode | TM-07, TM-09, TM-13, TM-14, PROPOSED-02, PROPOSED-05a/b/c/d, PROPOSED-08 |
| `TB-04` | Control plane ↔ supporting services | RSM, policy store, IAM, alerts | Inputs may be poisoned; service credentials abused; monitoring path crosses here | TM-04, TM-06, TM-09, TM-11, PROPOSED-03, PROPOSED-06 |
| `TB-05` | Control plane → trust/infrastructure | Policy engine and audit store | **Not assumed trusted**; policy results and audit writes attackable; verifier boundary undefined | TM-06, TM-08, TM-10, TM-14, PROPOSED-03, PROPOSED-06, PROPOSED-07a/b/c |
| `TB-06` | Governance → execution | Enforcement point / decision output → tool invocation | Enforcement absent (advisory) or compromised; alternate paths | TM-03, TM-04, TM-05, TM-10, TM-12, TM-16, PROPOSED-04 |
| `TB-07` | Data ingestion → features | Dataset/telemetry → RSM context | Provenance unverified; raw data absent locally | TM-11, TM-15 |
| `TB-08` | Oversight decision → audit record | Human/governance decision → audit event | Record alterable, droppable, reorderable, forgeable; clock trust unresolved | TM-08, TM-13, TM-14, PROPOSED-02, PROPOSED-05a/b |
| `TB-PROPOSED-01` | Agent ↔ agent *(provisional)* | Inter-agent messages and delegation | Identity and trust propagation undefined | PROPOSED-01 (pending D1) |
| `TB-PROPOSED-02` | Verification / trust-anchor domain *(provisional)* | Verifier, keys, time source, root of trust ↔ governed components | Must be a separate trust domain; not established | TM-08, TM-10, TM-14, PROPOSED-03, PROPOSED-06, PROPOSED-07a/b/c |

## STRIDE at boundaries (summary)

| STRIDE | Boundary examples | Threat IDs |
| --- | --- | --- |
| Spoofing of user identity | `TB-02` agent identity; `TB-03` approval origin | TM-03, TM-16, PROPOSED-02, PROPOSED-04, PROPOSED-01 |
| Tampering with data | `TB-05` audit; `TB-07` features; `TB-04` policy | TM-08, TM-11, TM-06, PROPOSED-03, PROPOSED-06 |
| Repudiability | `TB-08` missing/altered records | TM-08, TM-14 |
| Information disclosure | `TB-01`/`TB-06` exfiltration | TM-05 |
| Denial of service | `TB-03` approval queue; `TB-04`* control-plane saturation | TM-09, PROPOSED-06 |
| Elevation of privilege | `TB-04`/`TB-06` authority beyond grant | TM-04, TM-12, PROPOSED-04, PROPOSED-05d |

\* **A1 resolution-in-progress:** the original document read "`TB-04`/`TB-09` control-plane
saturation". `TB-09` does not exist in the inventory; TM-09's entry points are
`TB-03` and `TB-04`, so Phase 0 applied the **duplicate-`TB-04` hypothesis** and
removed the undefined ID. Original author intent remains decision **A1** in the
[decision register](decisions-and-evidence-register.md); this is not a settled
determination and must be confirmed before gate closure.

## Notes

- Boundaries are logical; deployment topology unresolved.
- No boundary is claimed to be defended.
- Detection prerequisites for `TB-05`/`TB-08` are `NOT_ESTABLISHED`
  ([methodology.md](methodology.md) §1).
