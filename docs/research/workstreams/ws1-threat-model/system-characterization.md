# System characterization and scope

**Status: Proposed.** Phase 0 baseline. Characterization of the *target* HITL 2.0
architecture from `README.md`. Illustrative target, not running code.

## 1. System under analysis

```text
  Governance objectives ──►  Agentic AI ecosystem  ◄──►  Human stakeholders
                                      │                       │
                                      ▼                       │ (approval / control)
             ┌────────── HITL 2.0 control plane (proposed) ───────────┐
             │ Action proposal → Risk assessment → Policy validation │
             │ → Autonomous decision → Human oversight (if required)│
             │ → Execute / block / modify → Audit & feedback        │
             └───────────────────────────────────────────────────────┘
                                      │
                 Supporting services  │  Trust & infrastructure
              (RSM, policies, IAM,    │  (policy engine, audit store,
               alerts, dashboards)   │   secure infrastructure)
```

| Zone | Role |
| --- | --- |
| Z1 — Agentic AI ecosystem | Produces proposals and invokes tools; never trusted as authority. Multi-agent interaction is **not assumed** (D1). |
| Z2 — HITL 2.0 control plane | Risk assessment, policy validation, autonomy-level selection, oversight routing, decision emission. |
| Z3 — Supporting services | RSM, policy store, IAM, alerts, dashboards; possible source of poisoned inputs. |
| Z4 — Trust/infrastructure | Policy engine, audit store, secure infrastructure; analysed as compromiseable. |
| Z5 — Human stakeholders | Monitor, confirm, approve, control/override; trusted when honest. |

### Principal data flows

1. Agent → control plane: action proposal (`TB-02`).
2. External data / tool output → agent (`TB-01`).
3. Control plane ↔ supporting services (`TB-04`).
4. Control plane → human: approval/confirmation request (`TB-03`).
5. Human → control plane: confirmation / approval / override (`TB-03`).
6. Control plane → trust/infrastructure: policy query, audit event (`TB-05`).
7. Governance/agent → execution: tool invocation (`TB-06`).
8. Data ingestion → features (`TB-07`).

## 2. Architecture variants (analytical alternatives; no selection)

- **Advisory governance** — control plane emits recommendations; execution may
  ignore them. Prevention claims are generally unsupported.
- **Enforced governance** — decisions are mediated before execution. Prevention
  is conditional on an intact enforcement point (all `Prevent` primaries marked `C`).

Enforced governance introduces an execution-path availability dependency absent
in advisory mode: an unavailable mediator forces a fail-open (bypass) or
fail-closed (denial) choice, owned by WM2 (C4). Full comparison:
[methodology.md §4](methodology.md).

## 3. Autonomy convention (preserved, not redefined)

| Level | Meaning |
| --- | --- |
| **L0** | Full autonomy |
| **L1** | Human monitoring |
| **L2** | Human confirmation of a specific bounded action already within authorised scope |
| **L3** | Explicit approval by an appropriately privileged human for an action requiring elevated authority |
| **L4** | Human control/override |

L2 and L3 are **distinct**: confirmation of a bounded in-scope action is not
approval of an elevated-authority action. WM1 does **not** define level-selection
logic, timeout values, expiry periods, quorum rules, override permissions or
implicit-approval behaviour. **No implicit approval on timeout.** These are WM2
decisions (C3). PROPOSED-05a–05d record the corresponding failure modes without
resolving them.

## 4. Scope

### In scope
- Threats arising from the proposed architecture and zones Z1–Z5.
- Both advisory and enforced variants.
- Trust assumptions about enforcement point, policy engine, audit store, time
  source, monitoring and human approver.
- Agent-specific threats, oversight-semantics failures, identity failures,
  policy-provenance failures, monitoring integrity, trust-asset compromise.
- Attack chains combining these threats.

### Out of scope (formal exclusions)
- Implementation, testing, deployment, model training, evaluation and results.
- Physical security, hardware tampering, network-layer DDoS below application layer.
- Legal attribution and organisational incident response.
- WM2–WM6 deliverables and final architecture selection.
- Multi-agent interaction **pending mentor decision D1** — not an accepted
  exclusion yet; PROPOSED-01 is preserved but not counted as in-scope.

Each exclusion records what is excluded, why, what consequences remain in scope
(consequences inside the control plane are always in scope), the owning workstream
for extension, and whether it limits paper claims (D1 does).

## 5. Consistency with the existing repository

| Artifact | Relation |
| --- | --- |
| `README.md` — "proposed, not implemented"; no tamper-proof claim | Matches: all controls `NOT_IMPLEMENTED`; `A-08` immutability `NOT_ESTABLISHED` |
| `src/hitl2/schemas.py` placeholders | Intended roles only; no final field contract; `AuditEvent.timestamp` clock trust unresolved |
| `docs/research/research-status.md` — six open gates | Supports only the Threat Model gate; file not modified |
| `src/hitl2/data/` | Input channel `TB-07`/`AS-09` only; not evidence |
| Module namespaces | Conceptual boundaries; no code assumed |

## 6. Assumptions requiring confirmation

See [decisions-and-evidence-register.md](decisions-and-evidence-register.md) §2–3.
Key items: human approver trusted when honest (PA-05); enforcement point may be
compromised (PA-01); audit store not trusted (PA-02); no trusted external time
(PA-03); single-agent **not approved** (PA-04); deployment/identity undefined
(PA-06); no control implemented (PA-07).
