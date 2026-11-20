# Threat catalogue

**Status: Proposed.** Phase 0 baseline. Only `TM-xx` identifiers are **accepted
in-scope threats**. `PROPOSED-xx` records are proposed and not counted as accepted
until their decision is resolved (`PROPOSED-01` is pending mentor decision D1).
Inventories (`A-xx`, `TA-xx`, `TB-xx`, `AS-xx`) are not threats.

Each threat has exactly one **primary disposition per applicable architecture
variant**. Capability maturity is recorded **separately** using
`ESTABLISHED` / `CONDITIONAL` / `NOT_ESTABLISHED` / `NOT_APPLICABLE` for
`Prevent`, `Detect`, `Mitigate`, `Response`, `Recovery`. No capability is
`ESTABLISHED` in this document set. All controls are `NOT_IMPLEMENTED`
(see [threat-to-control-traceability.md](threat-to-control-traceability.md)).
All verification criteria are future criteria; no verification has been performed.

Reference IDs `R1`…`R15` are in [references.md](references.md).

---

## TM-01 — Agent compromise

- **Description:** Adversary gains control of agent behaviour (weights, system prompt, runtime, persistent state) so it emits attacker-chosen proposals/tool calls.
- **Threat actor:** `TA-01`, `TA-05`.
- **Target asset:** `A-01`, `A-02`, `A-11`.
- **Entry point:** `AS-01`, `AS-06`; across `TB-01` / supply chain.
- **Preconditions:** Ability to modify model, prompt, runtime or dependency.
- **Attack scenario:** Modified model emits valid-looking proposal requesting a harmful tool action.
- **Security impact:** Hostile proposals enter governance; loss of behavioural integrity.
- **Primary disposition:** advisory `Outside boundary` | enforced `Outside boundary`.
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `NOT_ESTABLISHED`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D6 — Anomaly detection on proposals / independent audit (C-14, C-03). Prerequisites: collector and verifier independent of the agent and in a separate trust domain — unspecified (C2).
- **Proposed controls:** `C-01`, `C-03`, `C-04`, `C-07`, `C-14`, `C-16`.
- **Secondary capabilities:** `Detect`, `Mitigate` (bound effects, not root cause).
- **Outside-boundary scope:** (1) origin = model/supply-chain compromise outside assessed boundary; (2) assessed boundary = HITL 2.0 control plane; (3) impact = hostile proposals/actions; (4) in-scope affected assets = `A-02`, `A-03`, `A-11`; (5) residual `RR-01`, controls `C-01/C-03/C-04`.
- **Residual risk:** `RR-01` — full compromise not prevented; blast radius bounded only.
- **Future verification criteria:** Future simulation with malicious agent; confirm block/escalation and audit record. Not run.
- **Relevant references:** R3, R5, R6, R13.

## TM-02 — Prompt injection (direct and indirect)

- **Description:** Adversary embeds instructions in untrusted content that the agent treats as instructions.
- **Threat actor:** `TA-02`, amplified by `TA-01`.
- **Target asset:** `A-01`, `A-02`, `A-07`, `A-11`.
- **Entry point:** `AS-01`, `AS-02`, `AS-06` across `TB-01`.
- **Preconditions:** Attacker-controlled content reaches context without data/instruction separation.
- **Attack scenario:** Indirect injection in retrieved document triggers outbound tool call carrying sensitive context.
- **Security impact:** Control-flow hijack, arbitrary tool invocation, data theft.
- **Primary disposition:** advisory `Mitigate` | enforced `Mitigate`.
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `NOT_ESTABLISHED`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D6 — Anomaly detection on tool outputs / independent audit (C-14, C-03). Prerequisites: independent collector and trust domain — unspecified (C2).
- **Proposed controls:** `C-07`, `C-01`, `C-04`, `C-08`, `C-14`, `C-03`.
- **Secondary capabilities:** limited `Prevent` for specific actions (`C-01`); `Detect`.
- **Residual risk:** `RR-02` — no general prevention; adaptive attacks.
- **Future verification criteria:** AgentDojo-style harness with injected content; count unauthorised tool calls.
- **Relevant references:** R12 (**read**; taxonomy and data/theft/availability impacts), R13 (**read**; harness, tool-filter limitation), R14 (**read**; capability design with explicit non-goals), R5, R3.

## TM-03 — Unauthorized tool invocation

- **Description:** A tool call executes without policy or required human authorisation.
- **Threat actor:** `TA-01`, `TA-02`, `TA-05`, `TA-06`.
- **Target asset:** `A-11`, `A-05`, `A-02`, `A-03`.
- **Entry point:** `AS-06`, `AS-01`, `AS-05` across `TB-06`.
- **Preconditions:** Execution path exists; advisory mode has no choke point; enforced mode needs intact enforcement point.
- **Attack scenario:** Injected instruction or forged proposal requests out-of-allowlist call.
- **Security impact:** Unauthorised state change or external effect.
- **Primary disposition:** advisory `Mitigate` | enforced `Prevent` (`C`: enforced governance + intact enforcement point + WM4 tool model).
- **Capability status:** Prevent `CONDITIONAL`; Detect `CONDITIONAL`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D1 — Boundary validation rejects an out-of-allowlist call at TB-06 and records a local denial (C-01, C-02). Prerequisites: action/tool vocabulary (WM4) and local event recording; no independent verifier or trusted time required.
- **Proposed controls:** `C-01`, `C-02`, `C-10`.
- **Secondary capabilities:** `Detect`, `Mitigate`.
- **Residual risk:** `RR-03` — depends on enforcement-point integrity (TM-10).
- **Future verification criteria:** out-of-allowlist call rejected at `TB-06` and recorded; separate compromised-point test.
- **Relevant references:** R14 (capability concept, **non-goals respected**), R5, R12.

## TM-04 — Privilege escalation

- **Description:** Agent, attacker or operator obtains authority beyond policy/IAM grant within the governed system.
- **Threat actor:** `TA-01`, `TA-04`, `TA-06`.
- **Target asset:** `A-06`, `A-05`, `A-11`, `A-03`.
- **Entry point:** `AS-03`, `AS-08`, `AS-06` across `TB-04`/`TB-06`.
- **Preconditions:** Access to identity/policy config or weaker decision path.
- **Attack scenario:** Stolen/forged agent identity mapped to broader role (credential failure itself is PROPOSED-04).
- **Security impact:** Decisions based on incorrect authority.
- **Primary disposition:** advisory `Mitigate` | enforced `Prevent` (`C`: least privilege + enforced IAM; C5).
- **Capability status:** Prevent `CONDITIONAL`; Detect `NOT_ESTABLISHED`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D6 — Anomaly detection on role changes / approval patterns (C-14). Prerequisites: independent collector and trust domain — unspecified (C2).
- **Proposed controls:** `C-01`, `C-02`, `C-09`, `C-16`.
- **Secondary capabilities:** `Detect`, `Mitigate`.
- **Residual risk:** `RR-04` (infra-level escalation outside model).
- **Future verification criteria:** role change fails without dual authorisation; over-privileged proposal denied.
- **Relevant references:** R8, R9, R4 (access levels; bodies not reviewed — provisional).

## TM-05 — Data exfiltration

- **Description:** Sensitive context/dataset/internal information transmitted to unauthorised destination via agent/tool channel.
- **Threat actor:** `TA-02`, `TA-01`, `TA-07`, `TA-05`.
- **Target asset:** `A-07`, `A-12`, `A-08` (confidentiality property).
- **Entry point:** `AS-06`, `AS-01`, `AS-02` across `TB-01`/`TB-06`.
- **Preconditions:** Tool/output channel exists and sensitive data present in context.
- **Attack scenario:** Injected instruction embeds private context in outbound request.
- **Security impact:** Confidentiality loss; regulatory/reputational harm.
- **Primary disposition:** advisory `Mitigate` | enforced `Mitigate`.
- **Capability status:** Prevent `CONDITIONAL` (known destinations); Detect `CONDITIONAL`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D1 — Egress allowlist rejection at the tool boundary produces a local denial event (C-01). Prerequisites: destination/egress policy (WM4); no independent verifier or key custody required.
- **Proposed controls:** `C-01`, `C-03`, `C-04`, `C-07`, `C-08`.
- **Secondary capabilities:** limited `Prevent`, `Detect`.
- **Residual risk:** `RR-05` — covert channels; authorised-human exfiltration outside boundary.
- **Future verification criteria:** blocked destination produces denial + audit event; covert-channel analysis.
- **Relevant references:** R12 (read; data theft via read/side channels), R14 (read; capability data-flow restriction), R5, R8.

## TM-06 — Policy bypass

- **Description:** Action proceeds without required policy evaluation or human approval, or a decision is circumvented via an alternate path/stale policy.
- **Threat actor:** `TA-01`, `TA-04`, `TA-06`.
- **Target asset:** `A-05`, `A-03`, `A-04`, `A-12`.
- **Entry point:** `AS-05`, `AS-03`, `AS-06` across `TB-04`/`TB-05`/`TB-06`.
- **Preconditions:** Alternate path, advisory mode, or policy/decision data alteration.
- **Attack scenario:** Agent calls execution tool directly; or stale policy version used (provenance attack itself is PROPOSED-03).
- **Security impact:** Governance nullified for the action.
- **Primary disposition:** advisory `Mitigate` | enforced `Prevent` (`C`: single authoritative enforcement point; TM-10 dependency).
- **Capability status:** Prevent `CONDITIONAL`; Detect `NOT_ESTABLISHED`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D2 — Detect bypass by comparing decisions against an independent execution trace (C-03). Prerequisites: verifier independent of the decision path + execution trace — unspecified (C2).
- **Proposed controls:** `C-02`, `C-09`, `C-10`, `C-16`.
- **Secondary capabilities:** `Detect`, `Mitigate`.
- **Residual risk:** `RR-06` — enforcement point single point of failure.
- **Future verification criteria:** enumerate execution paths; stale policy rejected.
- **Relevant references:** R9, R8, R6.

## TM-07 — Approval manipulation

- **Description:** Honest approver at L2–L4 deceived or fatigued into approving a harmful action.
- **Threat actor:** `TA-02`, `TA-01`, `TA-08`.
- **Target asset:** `A-04`, `A-10`, `A-03`, `A-12`.
- **Entry point:** `AS-04` across `TB-03`.
- **Preconditions:** Human in loop; presentation derived from untrusted context.
- **Attack scenario:** Poisoned rationale or queue flooding yields approval of harmful action. Automation bias is a sub-scenario (no separate threat).
- **Security impact:** Unauthorised action approved by legitimate human.
- **Primary disposition:** advisory `Mitigate` | enforced `Mitigate`.
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `NOT_ESTABLISHED`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D6 — Anomaly detection on approval patterns (C-14). Prerequisites: collector independent of the approval interface and protected thresholds — unspecified (C2).
- **Proposed controls:** `C-05`, `C-06`, `C-14`, `C-03`.
- **Secondary capabilities:** `Detect`; `Outside boundary` for offline coercion.
- **Residual risk:** `RR-07`.
- **Future verification criteria:** human-factors study under misleading rationale and load.
- **Relevant references:** R6, R7, R5.

## TM-08 — Audit tampering

- **Description:** Audit events altered, deleted, reordered or forged to conceal an action.
- **Threat actor:** `TA-04`, `TA-06`.
- **Target asset:** `A-08` (integrity, completeness, ordering, non-repudiation), `A-04`, `A-03`, `A-12`.
- **Entry point:** `AS-07`, `AS-10` across `TB-05`/`TB-08`.
- **Preconditions:** Write/modify access to store or ingestion path; **no integrity mechanism exists in the prototype**.
- **Attack scenario:** Operator removes an event or rewrites a payload to conceal approval.
- **Security impact:** Loss of non-repudiation and detectability.
- **Primary disposition:** advisory `Mitigate` | enforced `Mitigate`.
- **Detection analysis:** proposed mechanism = tamper-evidence verification (hash chain or equivalent) by an **independent verifier**. Prerequisites: independent verifier, separate trust domain from audit store, protected verification keys, trusted/monotonic time, defined verification procedure. The audit-store administrator or compromised component **could** manipulate both event and verification if these prerequisites are absent. **Detection status: `NOT_ESTABLISHED`.** Not meaningfully identical across variants: in advisory mode the falsified artifact is an advice/approval record; in enforced mode it is a governance decision/authorisation, requiring independence from the enforcement point.
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `NOT_ESTABLISHED`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D3 — Independent tamper-evidence verification (C-03, C-PROPOSED-03). Prerequisites: verifier, separate trust domain, protected keys, trusted time, defined procedure — all unspecified (C2).
- **Proposed controls:** `C-03`, `C-12`, `C-09`, `C-PROPOSED-03`.
- **Secondary capabilities:** `Mitigate` (`C-09` reduces feasibility). No tamper-proof claim; immutability `NOT_ESTABLISHED`.
- **Residual risk:** `RR-08`, `RR-16` — detection currently unavailable.
- **Future verification criteria:** future test that modification/deletion is detected by a verifier. No test exists.
- **Relevant references:** R10, R8 (bodies not reviewed — provisional).

## TM-09 — Availability attacks

- **Description:** Control plane/oversight channel saturated or disabled so proposals cannot be assessed or approvals obtained.
- **Threat actor:** `TA-01`, `TA-02`, `TA-04`, `TA-06`, `TA-08`.
- **Target asset:** `A-09`, `A-10`, `A-04`, `A-08` (availability property).
- **Entry point:** `AS-01`, `AS-04`, `AS-07` across `TB-03`/`TB-04`.
- **Preconditions:** Ability to generate excessive proposals, approvals or audit load.
- **Attack scenario:** Flood exhausts reviewer attention; time-critical proposal pushed through under fail-open.
- **Security impact:** Delayed/skipped oversight.
- **Primary disposition:** advisory `Mitigate` | enforced `Mitigate`.
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `CONDITIONAL`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D1 — Latency/queue-depth thresholds at the control-plane boundary (C-11). Prerequisites: threshold values and fail behaviour (C4); no independent verifier required.
- **Proposed controls:** `C-11`, `C-16`, `C-03`.
- **Secondary capabilities:** `Detect`.
- **Residual risk:** `RR-09`; fail-open/closed undecided (C4).
- **Future verification criteria:** load test confirming bounded latency; no unguarded fail-open path.
- **Relevant references:** R5, R8, R6.

## TM-10 — Enforcement-point compromise

- **Description:** The component mediating decisions before execution is compromised, issuing unauthorised allows or suppressing denials while appearing compliant.
- **Threat actor:** `TA-04`, `TA-06`.
- **Target asset:** `A-03`, `A-05`, `A-11`, `A-08`, `A-12`.
- **Entry point:** `AS-05`, `AS-03`, `AS-07` across `TB-05`/`TB-06`.
- **Preconditions:** **Enforced-governance variant only**; attacker has code/config/credential access to the enforcement point. In advisory mode the analogous problem is PROPOSED-08.
- **Attack scenario:** Compromised policy engine returns "allow" for high-risk proposal while presenting a normal audit record.
- **Security impact:** All dependent prevention claims fail.
- **Primary disposition:** advisory `n/a` (not applicable — no mediating point) | enforced `Mitigate`.
- **Detection analysis:** proposed mechanism = independent recomputation of policy decisions compared against an execution trace, optionally with an independent human oversight gate. Prerequisites: verifier independent of enforcement point, independent execution trace, human gate not mediated by the same point, protected key/time custody. The compromised point **could** manipulate both the recorded decision and its verification if independence is absent. **Detection status: `NOT_ESTABLISHED`.** This is **not** the advisory recommendation-suppression problem (PROPOSED-08); their detection mechanisms differ.
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `NOT_ESTABLISHED`; Mitigate `CONDITIONAL`; Response `CONDITIONAL` (kill-switch concept only); Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D2 — Independent policy recomputation vs execution trace (C-PROPOSED-03). Prerequisites: verifier independent of enforcement point + independent trace + unmediated human gate — unspecified (C2).
- **Proposed controls:** `C-16`, `C-03`, `C-04`, `C-06`, `C-12`, `C-PROPOSED-03`.
- **Secondary capabilities:** `Mitigate`, limited `Prevent` (least privilege); no trust assumed.
- **Residual risk:** `RR-10`, `RR-17` — detection unavailable; trust-anchor problem.
- **Future verification criteria:** simulated compromised point → independent divergence alert + out-of-band halt.
- **Relevant references:** R9, R8, R1, R2, R6.

## TM-11 — Risk-signal / context poisoning and scoring evasion

- **Description:** Context/features manipulated so high-risk action scores low-risk, or scoring evaded.
- **Threat actor:** `TA-02`, `TA-04`, `TA-05`.
- **Target asset:** `A-07`, `A-02`, `A-03`, `A-05`.
- **Entry point:** `AS-02`, `AS-01`, `AS-09` across `TB-07`/`TB-04`.
- **Preconditions:** Attacker influences context/feature sources; RSM undefined so threat is prospective.
- **Attack scenario:** Poisoned context lowers apparent risk, selecting L1 instead of L3.
- **Security impact:** Incorrect risk-informed decision; oversight evaded.
- **Primary disposition:** advisory `Mitigate` | enforced `Mitigate`.
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `CONDITIONAL`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D1 — Distributional/context validation at feature ingestion (C-08). Prerequisites: feature contract and conservative defaults (WM3, C7); no independent verifier required.
- **Proposed controls:** `C-08`, `C-07`, `C-09`, `C-14`.
- **Secondary capabilities:** limited `Prevent`, `Detect`.
- **Residual risk:** `RR-11`.
- **Future verification criteria:** perturbed context must not silently change outcome without check. No RSM exists.
- **Relevant references:** R3, R5, R13 (read), R15 (abstract only — weak relevance), R6.

## TM-12 — Autonomy-level manipulation

- **Description:** Attacker induces selection of lower human-involvement level (e.g., L1 where L3 required).
- **Threat actor:** `TA-01`, `TA-02`, `TA-04`, `TA-06`.
- **Target asset:** `A-05`, `A-04`, `A-03`.
- **Entry point:** `AS-02`, `AS-03`, `AS-05` across `TB-04`/`TB-06`.
- **Preconditions:** A selection mechanism exists; semantics unresolved (WM2, C3). Prospective.
- **Attack scenario:** Manipulated context/policy selects L0/L1 for action requiring L3/L4.
- **Security impact:** Required oversight absent.
- **Primary disposition:** advisory `Mitigate` | enforced `Mitigate` (no defined prevention mechanism exists: WM2 deterministic floors are undecided; future prevention is NOT_ESTABLISHED).
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `NOT_ESTABLISHED`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D2 — Level-decision comparison against recorded policy via audit (C-03). Prerequisites: independent verifier and defined level semantics (WM2, C3) — unspecified.
- **Proposed controls:** `C-15`, `C-02`, `C-09`, `C-10`.
- **Secondary capabilities:** `Detect`, `Mitigate`.
- **Residual risk:** `RR-13` (autonomy semantics).
- **Future verification criteria:** after WM2, no input selects below policy floor.
- **Relevant references:** R6, R7, R5. L0–L4 is a repository convention, not cited.

## TM-13 — Malicious or coerced human approver (insider)

- **Description:** Human with legitimate L2–L4 authority intentionally/coercively approves harmful action. Distinct from TM-07 (honest but deceived).
- **Threat actor:** `TA-03`, `TA-04`.
- **Target asset:** `A-04`, `A-06`, `A-05`, `A-12`.
- **Entry point:** `AS-04`, `AS-08` across `TB-03`.
- **Preconditions:** Valid credentials and approval authority.
- **Attack scenario:** Insider uses legitimate approval right to pass harmful action.
- **Security impact:** Authorized-looking action with no technical violation.
- **Primary disposition:** advisory `Outside boundary` | enforced `Outside boundary`.
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `NOT_ESTABLISHED`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D6 — Anomaly detection on approval patterns (C-14). Prerequisites: independent collector and protected thresholds — unspecified (C2).
- **Proposed controls:** `C-06`, `C-03`, `C-14`.
- **Secondary capabilities:** `Detect`, `Mitigate`.
- **Outside-boundary scope:** origin = trusted-human abuse outside technical boundary; assessed boundary = control plane; impact = governance control compromised; in-scope assets `A-03/A-04/A-05`; residual `RR-15`, controls `C-06/C-03/C-14`.
- **Residual risk:** `RR-15`.
- **Future verification criteria:** policy review on ≥2 approvers for high-risk actions; malicious-approver simulation.
- **Relevant references:** R8, R9, R6.

## TM-14 — Clock / timestamp manipulation

- **Description:** Timestamps/sequence information altered to reorder history, create deniability or defeat freshness.
- **Threat actor:** `TA-04`, `TA-06`, `TA-11`.
- **Target asset:** `A-08`, `A-03`, `A-04`, `A-PROPOSED-04`.
- **Entry point:** `AS-10`, `AS-07` across `TB-08`/`TB-PROPOSED-02`.
- **Preconditions:** Ability to influence time source/timestamp; clock-trust semantics unresolved.
- **Attack scenario:** Backdate approval or advance clock to expire a validity token. A **host-local timestamp is not independently trusted time**.
- **Security impact:** Broken ordering/freshness and non-repudiation.
- **Primary disposition:** advisory `Mitigate` | enforced `Mitigate`.
- **Detection analysis:** potential mechanisms = monotonic sequence numbers, independent time source, verifier trust, counters not writable by the same component. Prerequisites: independent time source and counter integrity; none established. The same compromised component could manipulate event and verification. **Detection status: `NOT_ESTABLISHED`.** Difference by variant: advisory affects advice/decision timestamps; enforced additionally affects decision freshness and replay windows (TM-16).
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `NOT_ESTABLISHED`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D4 — Monotonic sequence + independent time source (C-12, C-PROPOSED-03). Prerequisites: trusted independent time and counters not writable by the same component — absent (C2).
- **Proposed controls:** `C-12`, `C-03`, `C-PROPOSED-03`.
- **Secondary capabilities:** `Mitigate`; `Outside boundary` if external time authority compromised.
- **Residual risk:** `RR-08`, `RR-18` — no trusted time; detection unavailable.
- **Future verification criteria:** out-of-order/rolled-back timestamps detected. No mechanism exists.
- **Relevant references:** R10, R8.

## TM-15 — Supply-chain compromise

- **Description:** Malicious modification introduced into third-party dependency before entry (model, tool, plugin, library, dataset).
- **Threat actor:** `TA-05`.
- **Target asset:** `A-01`, `A-07`, `A-11`, `A-12`.
- **Entry point:** `AS-06`, `AS-09` across `TB-01`/`TB-07`.
- **Preconditions:** Externally sourced components; dataset provenance recorded but no raw data locally.
- **Attack scenario:** Compromised tool or poisoned dataset enters through ingestion.
- **Security impact:** Persistent, hard-to-detect influence.
- **Primary disposition:** advisory `Outside boundary` | enforced `Outside boundary`.
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `NOT_ESTABLISHED`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D5 — Checksum/digest comparison against an independent source (C-13). Prerequisites: trusted independent digest source — unspecified (C2).
- **Proposed controls:** `C-13`, `C-09`, `C-14`.
- **Secondary capabilities:** `Detect`, `Mitigate`.
- **Outside-boundary scope:** origin = upstream supplier; assessed boundary = control plane; impact = poisoned inputs/behaviour; in-scope assets `A-01/A-07/A-11`; residual `RR-11`, controls `C-13/C-01`.
- **Residual risk:** `RR-11`.
- **Future verification criteria:** dependency digests/checksums verified against independent source.
- **Relevant references:** R11, R5, R3.

## TM-16 — Replay / decision-context substitution (TOCTOU)

- **Description:** Valid decision/proposal reused or context changed between evaluation and execution; executed action differs from assessed one.
- **Threat actor:** `TA-01`, `TA-06`.
- **Target asset:** `A-02`, `A-03`, `A-04`, `A-11`.
- **Entry point:** `AS-01`, `AS-05`, `AS-06`, `AS-10` across `TB-02`/`TB-06`.
- **Preconditions:** Decisions not bound to proposal instance/context; no single-use tokens/revalidation.
- **Attack scenario:** Replay benign approval for different proposal with same ID; substitute parameters post-approval.
- **Security impact:** Approval applied to unapproved action.
- **Primary disposition:** advisory `Mitigate` | enforced `Prevent` (`C`: binding + revalidation + clock trust).
- **Capability status:** Prevent `CONDITIONAL`; Detect `CONDITIONAL`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D1 — Execution-time revalidation rejects replay/parameter substitution (C-10). Prerequisites: digest binding and single-use tokens (WM4). Audit correlation to the correct digest is class D4 and remains NOT_ESTABLISHED.
- **Proposed controls:** `C-10`, `C-02`, `C-03`.
- **Secondary capabilities:** `Detect`, `Mitigate`.
- **Residual risk:** `RR-13`, `RR-18`; expiry handling is PROPOSED-05b.
- **Future verification criteria:** replayed/altered proposal rejected; audit correlates to correct digest.
- **Relevant references:** R8, R10, R6.

---

# Proposed records (not accepted in-scope threats)

## PROPOSED-01 — Cross-agent identity spoofing / collusion — **PENDING MENTOR SCOPE DECISION (D1)**

- **Description:** Forged inter-agent messages, delegated identity abuse, mutual confirmation/collusion.
- **Threat actor:** `TA-01`, `TA-09`, `TA-05`.
- **Target asset:** `A-01`, `A-02`, `A-06`.
- **Entry point:** `AS-PROPOSED-01` across `TB-PROPOSED-01`.
- **Preconditions:** Multi-agent deployment; trust propagation undefined. **Not assumed in scope.**
- **Attack scenario:** Agent A forges proposal as agent B; two agents cross-confirm to skip oversight.
- **Security impact:** Bypass of identity-linked oversight.
- **Primary disposition:** advisory `PENDING` | enforced `PENDING` (no primary assigned until D1).
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `NOT_ESTABLISHED`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D6 — Cross-agent anomaly/audit detection (C-14, C-03). Prerequisites: independent collector and inter-agent identity model (D1 scope, C5) — unspecified.
- **Proposed controls:** `C-01`, `C-03`, `C-07`, `C-14`, `C-PROPOSED-06`.
- **Secondary capabilities:** none claimed as established.
- **Residual risk:** `RR-14` (multi-agent scope).
- **Future verification criteria:** forged inter-agent proposal test (only if D1 includes multi-agent).
- **Relevant references:** R3, R5.
- **Unresolved decision:** D1 (mentor). Not counted in aggregate threat counts.

## PROPOSED-02 — Human approver identity spoofing

- **Description:** Attacker impersonates a legitimate human approver via credential theft, session hijack or forged approval response. Subject = **human approver**, distinct from PROPOSED-04.
- **Threat actor:** `TA-02`, `TA-04`, `TA-06`.
- **Target asset:** `A-04`, `A-06`, `A-03`.
- **Entry point:** `AS-04`, `AS-PROPOSED-02`, `AS-08` across `TB-03`/`TB-08`.
- **Preconditions:** Approver credentials/session compromise or ability to inject approval-origin data.
- **Attack scenario:** Forged approval response accepted as originating from privileged approver.
- **Security impact:** Unauthorised action with legitimate-looking approval.
- **Primary disposition:** advisory `Mitigate` | enforced `Mitigate` (no defined prevention mechanism exists: WM2 IAM model undecided, C5; future prevention is NOT_ESTABLISHED).
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `CONDITIONAL`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D1 — Authenticity check on the approval origin at AS-04 (C-PROPOSED-02). Prerequisites: WM2 IAM authority model (C5); no independent verifier required.
- **Proposed controls:** `C-03`, `C-05`, `C-10`, `C-PROPOSED-02`.
- **Secondary capabilities:** `Detect`, `Mitigate`.
- **Residual risk:** `RR-24`.
- **Future verification criteria:** forged approval response test after IAM model defined.
- **Relevant references:** R8, R9, R6.
- **Unresolved decision:** C5 (WM2 IAM).

## PROPOSED-03 — Policy provenance / update compromise

- **Description:** One parent threat with three separately documented scenarios: (1) policy repository compromise; (2) policy update-channel compromise; (3) rollback / version substitution.
- **Threat actor:** `TA-04`, `TA-05`, `TA-06`.
- **Target asset:** `A-05`, `A-03`.
- **Entry point:** `AS-03`, `AS-PROPOSED-03` across `TB-04`/`TB-05`.
- **Preconditions:** Write access to repository, control of update channel, or ability to revert version.
- **Attack scenario:** Malicious policy update or rollback to weaker version applied without detection.
- **Security impact:** Governance nullified through apparently valid policy.
- **Primary disposition:** advisory `Mitigate` | enforced `Mitigate` (no defined prevention mechanism exists: WM4/WM5 signing undecided, C6; future prevention is NOT_ESTABLISHED).
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `NOT_ESTABLISHED`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D5 — Signature/version verification of policy updates. Prerequisites: protected signing root and monotonic version source (C6) — unspecified.
- **Proposed controls:** `C-09`, `C-PROPOSED-01`.
- **Scenario-specific controls / verification:** repository → access control / write-authorisation test; update channel → signed transport / tamper test; rollback → version pinning + monotonic freshness / downgrade test.
- **Secondary capabilities:** `Detect`, `Mitigate`.
- **Residual risk:** `RR-19`.
- **Future verification criteria:** three scenario tests as above.
- **Relevant references:** R8, R11, R9.
- **Unresolved decision:** C6 (WM4/WM5). Future split into separate threats if WM4/WM5 establish distinct trust domains; no split in Phase 0.

## PROPOSED-04 — Identity / authentication / authorization failure

- **Description:** Missing authentication at ingestion, weak agent identity, authorization bypass at tool boundary, role-assignment error. Subject = **agent/service identity**, distinct from PROPOSED-02.
- **Threat actor:** `TA-01`, `TA-02`, `TA-04`.
- **Target asset:** `A-06`, `A-02`, `A-03`.
- **Entry point:** `AS-01`, `AS-06`, `AS-08` across `TB-02`/`TB-04`/`TB-06`.
- **Preconditions:** Interface accepts unauthenticated identity or enforces authorization weakly.
- **Attack scenario:** Unauthenticated proposal accepted; agent invokes tool beyond its role.
- **Security impact:** Decisions under wrong identity; unauthorised access.
- **Primary disposition:** advisory `Mitigate` | enforced `Mitigate` (no defined prevention mechanism exists: WM2 IAM model undecided, C5; future prevention is NOT_ESTABLISHED).
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `CONDITIONAL`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D1 — Authentication/authorization check at proposal ingestion and tool boundary (C-01, C-02, C-PROPOSED-06). Prerequisites: WM2 IAM authority model (C5).
- **Proposed controls:** `C-01`, `C-02`, `C-09`, `C-PROPOSED-06`.
- **Secondary capabilities:** `Detect`, `Mitigate`.
- **Residual risk:** `RR-25`.
- **Future verification criteria:** unauthenticated proposal rejected; authz bypass test.
- **Relevant references:** R8, R9.
- **Unresolved decision:** C5 (WM2 IAM).

## PROPOSED-05a — L2/L3 semantic confusion

- **Description:** Confirmation of a bounded in-scope action (L2) presented/recorded as explicit approval for elevated authority (L3), or vice versa.
- **Threat actor:** `TA-02`, `TA-04`, `TA-06`.
- **Target asset:** `A-04`, `A-05`, `A-03`.
- **Entry point:** `AS-04`, `AS-05` across `TB-03`/`TB-04`.
- **Preconditions:** Decision representation does not bind the human input to the level and authority it grants.
- **Attack scenario:** L2 confirmation reused where L3 approval required.
- **Security impact:** Elevated action occurs without required approval.
- **Primary disposition:** advisory `Mitigate` | enforced `Mitigate` (no defined prevention mechanism exists: WM2 L2/L3 semantics undecided, C3; future prevention is NOT_ESTABLISHED).
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `CONDITIONAL`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D1 — Level-binding check at the human input interface (C-04, C-05). Prerequisites: WM2 L2/L3 semantics (C3); mechanism shape defined.
- **Proposed controls:** `C-04`, `C-05`, `C-10`.
- **Secondary capabilities:** `Detect`, `Mitigate`.
- **Residual risk:** `RR-13`.
- **Future verification criteria:** after WM2, level-binding test. No semantics invented here.
- **Relevant references:** R6, R7.

## PROPOSED-05b — Human-authorization temporal validity

- **Description:** Expired approval, expired confirmation, timeout manipulation, replay of expired authorization. Cross-reference TM-16.
- **Threat actor:** `TA-02`, `TA-04`, `TA-06`, `TA-08`.
- **Target asset:** `A-04`, `A-03`, `A-PROPOSED-04`.
- **Entry point:** `AS-04`, `AS-PROPOSED-02`, `AS-10`, `AS-PROPOSED-06` across `TB-03`/`TB-08`.
- **Preconditions:** No validity window or trusted time binding.
- **Attack scenario:** Stale approval replayed after its validity window.
- **Security impact:** Action executes under lapsed authority.
- **Primary disposition:** advisory `Mitigate` | enforced `Mitigate` (no defined prevention mechanism exists: WM2 expiry semantics and WM5 trusted time undecided, C3/C2; future prevention is NOT_ESTABLISHED).
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `NOT_ESTABLISHED` (trusted time absent); Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D4 — Expiry/freshness check against trusted time (C-10, C-12). Prerequisites: trusted time source and expiry semantics (C2, C3) — absent.
- **Proposed controls:** `C-10`, `C-12`, `C-PROPOSED-03`.
- **Secondary capabilities:** `Mitigate`.
- **Residual risk:** `RR-18`.
- **Future verification criteria:** expired authorization rejected. **No timeout values or expiry periods are defined; no implicit approval on timeout.**
- **Relevant references:** R6, R7, R10.
- **Unresolved decisions:** C2, C3, C4.

## PROPOSED-05c — Multi-approver conflict

- **Description:** Conflicting approver decisions, undefined decision hierarchy, unresolved quorum/authority conflict.
- **Threat actor:** `TA-03`, `TA-04`, `TA-06`.
- **Target asset:** `A-04`, `A-03`.
- **Entry point:** `AS-04` across `TB-03`.
- **Preconditions:** Multiple approvers with overlapping/unranked authority.
- **Attack scenario:** One approver approves while another denies; no resolution rule.
- **Security impact:** Non-deterministic governance outcome.
- **Primary disposition:** advisory `Mitigate` | enforced `Mitigate` (no decision mechanism is defined, so prevention is not claimed in either variant).
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `CONDITIONAL`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D1 — Conflict surfaced at the approval interface (C-06). Prerequisites: WM2 quorum/hierarchy rule (C3); mechanism shape defined.
- **Proposed controls:** `C-06`, `C-03`.
- **Secondary capabilities:** `Detect`, `Mitigate`.
- **Residual risk:** `RR-13`.
- **Future verification criteria:** after WM2 defines a resolution rule, conflict-resolution test. No quorum rule invented.
- **Relevant references:** R6, R8.
- **Unresolved decision:** C3 (WM2).

## PROPOSED-05d — Emergency override abuse

- **Description:** Misuse of L4 override path, unauthorised override, abuse of undefined override authority. Distinct from TM-13 (malicious approver via approval path).
- **Threat actor:** `TA-03`, `TA-04`, `TA-06`.
- **Target asset:** `A-04`, `A-03`, `A-05`.
- **Entry point:** `AS-04`, `AS-05` across `TB-03`/`TB-06`.
- **Preconditions:** Override path exists; authority undefined.
- **Attack scenario:** Operator uses override to bypass required L3 approval.
- **Security impact:** Human control path becomes a bypass channel.
- **Primary disposition:** advisory `Mitigate` | enforced `Mitigate` (override authority undefined).
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `NOT_ESTABLISHED`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D2 — Override decision comparison against independent audit (C-03). Prerequisites: independent verifier and defined override authority (C2, C3) — unspecified.
- **Proposed controls:** `C-03`, `C-06`, `C-16`.
- **Secondary capabilities:** `Detect`, `Mitigate`.
- **Residual risk:** `RR-13`.
- **Future verification criteria:** after WM2 defines override authority, abuse test. No override permissions invented.
- **Relevant references:** R6, R8.
- **Unresolved decision:** C3 (WM2).

## PROPOSED-06 — Monitoring / alerting suppression

- **Description:** Alert suppression, threshold manipulation, log flooding, sensor/monitoring pipeline compromise.
- **Threat actor:** `TA-01`, `TA-04`, `TA-06`, `TA-10`.
- **Target asset:** `A-PROPOSED-05`, `A-08` (completeness/availability), `A-03`.
- **Entry point:** `AS-02`, `AS-07`, `AS-PROPOSED-04` across `TB-04`/`TB-05`.
- **Preconditions:** Monitoring component not independent or trustworthy. **Do not assume independence.**
- **Attack scenario:** Attacker floods log with benign events to mask anomaly and suppress alerts.
- **Security impact:** Detection capability unavailable or misleading.
- **Primary disposition:** advisory `Mitigate` | enforced `Mitigate`.
- **Detection analysis:** C-14 detection requires an independent collector and protected thresholds; **not established**.
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `NOT_ESTABLISHED`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D6 — Independent monitor divergence/alerting (C-14, C-PROPOSED-05). Prerequisites: collector independent of monitored component and protected thresholds (C2) — unspecified.
- **Proposed controls:** `C-14` (with integrity/independence prerequisites), `C-11`, `C-PROPOSED-05`.
- **Secondary capabilities:** `Mitigate`.
- **Residual risk:** `RR-20`.
- **Future verification criteria:** monitoring divergence test after independence specified.
- **Relevant references:** R10, R8.
- **Unresolved decision:** C2 (WM5).

## PROPOSED-07a — Root-of-trust compromise

- **Description:** Compromise of the root of trust itself; distinct from verification-key and verification-service compromise.
- **Threat actor:** `TA-04`, `TA-11`.
- **Target asset:** `A-PROPOSED-01`.
- **Entry point:** `AS-PROPOSED-05` across `TB-PROPOSED-02`.
- **Preconditions:** Root-of-trust design exists; not specified.
- **Attack scenario:** Root manipulated so all downstream verification is trusted incorrectly.
- **Security impact:** Whole verification chain untrustworthy.
- **Primary disposition:** advisory `Outside boundary` | enforced `Outside boundary`.
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `NOT_ESTABLISHED`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D6 — Verification-chain check by the root itself. Prerequisites: independent higher trust anchor — absent; root compromise is outside boundary.
- **Proposed controls:** `C-PROPOSED-04`.
- **Secondary capabilities:** `Mitigate` for consequences.
- **Outside-boundary scope:** origin = root compromise outside assessed boundary; consequences in control plane in scope (`A-03`, `A-08`); residual `RR-21`.
- **Residual risk:** `RR-21`.
- **Future verification criteria:** root-compromise test after WM5 design.
- **Relevant references:** R9, R8.
- **Unresolved decision:** C2 (WM5).

## PROPOSED-07b — Verification-key compromise

- **Description:** Key theft, unauthorised key use, reuse or lifecycle compromise.
- **Threat actor:** `TA-04`, `TA-11`.
- **Target asset:** `A-PROPOSED-02`.
- **Entry point:** `AS-PROPOSED-05` across `TB-PROPOSED-02`.
- **Preconditions:** Key custody/rotation undefined.
- **Attack scenario:** Stolen verification key used to forge integrity-verifiable evidence.
- **Security impact:** Tamper evidence becomes unreliable.
- **Primary disposition:** advisory `Mitigate` | enforced `Mitigate`.
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `NOT_ESTABLISHED`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D5 — Key-misuse detection via custody monitoring. Prerequisites: protected key lifecycle/rotation and independent custody audit (C2) — unspecified.
- **Proposed controls:** `C-PROPOSED-04`, `C-09`.
- **Secondary capabilities:** `Detect`, `Mitigate`.
- **Residual risk:** `RR-22`.
- **Future verification criteria:** key-compromise/rotation test after WM5 design.
- **Relevant references:** R8, R10.
- **Unresolved decision:** C2 (WM5).

## PROPOSED-07c — Verification-service compromise

- **Description:** Compromise of the independent verifier, forged verification result, suppression of verification failure.
- **Threat actor:** `TA-04`, `TA-06`, `TA-10`.
- **Target asset:** `A-PROPOSED-03`.
- **Entry point:** `AS-PROPOSED-04`, `AS-07` across `TB-PROPOSED-02`/`TB-05`.
- **Preconditions:** Verifier shares trust domain with audited/ enforced component.
- **Attack scenario:** Verifier reports success for tampered event or suppressed decision.
- **Security impact:** Detection unavailable even if integrity mechanism exists.
- **Primary disposition:** advisory `Mitigate` | enforced `Mitigate`.
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `NOT_ESTABLISHED`; Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D6 — Forged verification result detected by a second verifier. Prerequisites: second verifier in a separate trust domain (C2) — unspecified.
- **Proposed controls:** `C-PROPOSED-03`, `C-16`.
- **Secondary capabilities:** `Mitigate`.
- **Residual risk:** `RR-23`.
- **Future verification criteria:** verifier-divergence test after independent second verifier specified.
- **Relevant references:** R9, R8.
- **Unresolved decision:** C2 (WM5).

## PROPOSED-08 — Advisory recommendation suppression / forgery

- **Description:** Suppression, alteration or forgery of governance recommendations or human-review notifications without an authoritative execution gate. **Not TM-10.**
- **Threat actor:** `TA-01`, `TA-02`, `TA-04`, `TA-06`.
- **Target asset:** `A-03`, `A-04`, `A-12`.
- **Entry point:** `AS-05`, `AS-04`, `AS-06` across `TB-03`/`TB-06`.
- **Preconditions:** Advisory governance; execution not mediated.
- **Attack scenario:** Agent ignores or attacker suppresses recommendation; no execution gate exists to prevent action.
- **Security impact:** Governance advice has no effect.
- **Primary disposition:** advisory `Mitigate` | enforced `n/a` (enforced mode addresses via TM-10/TM-06).
- **Capability status:** Prevent `NOT_ESTABLISHED`; Detect `NOT_ESTABLISHED` (compare advice against independent execution trace); Mitigate `CONDITIONAL`; Response `NOT_ESTABLISHED`; Recovery `NOT_ESTABLISHED`.
- **Detection mechanism:** D6 — Compare advisory recommendation against an independent execution trace (C-03, C-14). Prerequisites: independent trace collector (C2) — unspecified.
- **Proposed controls:** `C-03`, `C-05`, `C-14`.
- **Secondary capabilities:** `Detect`.
- **Residual risk:** `RR-26`.
- **Future verification criteria:** trace-vs-advice divergence test.
- **Relevant references:** R6, R8, R9.
- **Unresolved decision:** C1 (WM2 architecture).

---

## Completeness note

Accepted in-scope threats: `TM-01`…`TM-16` (16). Proposed records: `PROPOSED-01`, `-02`, `-03`, `-05a`, `-05b`, `-05c`, `-05d`, `-06`, `-07a`, `-07b`, `-07c`, `-08`. `PROPOSED-01` is **not counted** as accepted pending D1. Inventories are not threats. The nine originally required categories remain covered by TM-01…TM-09.
