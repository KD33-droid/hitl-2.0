# Attack-tree and attack-chain scenarios

**Status: Proposed.** Phase 0 baseline. Analytical narratives, not observed
incidents, experiments or results. `AND` / `OR` denote conjunctive / disjunctive
nodes. Disposition readings use the Phase 0 primaries; conditional detection is
never presented as established.

---

## AC-01 — Indirect injection → unauthorized tool → exfiltration → cover-up

**Goal:** Exfiltrate sensitive context and conceal it.
**Actors:** `TA-02`, `TA-01`, `TA-04`/`TA-06`.
**Entry:** `TB-01` → `AS-01`/`AS-02` → `AS-06` → `AS-07`.

```text
Goal: exfiltrate A-07 and conceal it (A-08)
├─ OR  Obtain influence over agent context
│   ├─ TA-02 places injected content in retrieved data          [TM-02]
│   └─ TA-05 supplies compromised tool output                    [TM-15]
├─ AND Cause an unauthorized outbound tool call
│   ├─ Agent treats injected content as instructions             [TM-02]
│   └─ No effective allowlist at TB-06                           [TM-03]
├─ AND Exfiltration succeeds
│   ├─ Sensitive data present in context                         [A-07]
│   └─ Egress not constrained / covert channel used              [TM-05]
└─ AND Concealment
    ├─ Audit event altered or removed                            [TM-08]
    └─ Timestamp reordered to hide sequence                      [TM-14]
```

**Disposition reading:** TM-02 `Mitigate` (both); TM-03 advisory `Mitigate` /
enforced `Prevent` (conditional); TM-05 `Mitigate`; TM-08/TM-14 `Mitigate` with
detection `NOT_ESTABLISHED` (`RR-16`, `RR-18`). Chain not assumed broken today.
**Future verification:** injected-content harness with egress and tamper assertions.

## AC-02 — Approval manipulation at L3

**Goal:** Obtain legitimate-looking L3 approval for a harmful action.
**Actors:** `TA-02`, `TA-08`.
**Entry:** `TB-07`/`TB-04` → `TB-03` → `AS-04`.

```text
Goal: human approves harmful action at L3
├─ OR  Corrupt the approval presentation
│   ├─ Poison context used to build rationale                    [TM-11]
│   └─ Inject misleading text into rationale/UI                  [TM-02]
├─ AND Reviewer does not detect discrepancy
│   ├─ Rationale not bound to proposal digest                    [TM-16]
│   ├─ Reviewer overloaded / queue flooded                       [TM-07, TM-09]
│   └─ Automation bias toward automated recommendation           [TM-07 sub-scenario]
└─ Approval recorded as legitimate                               [A-04, TM-08]
```

**Disposition reading:** TM-07 `Mitigate` (both); TM-11/TM-09 `Mitigate`. L3 here
means elevated-authority approval, distinct from L2 confirmation. Expiry/timeout
handling is PROPOSED-05b and is **not** defined here (no implicit approval on timeout).
**Future verification:** human-factors evaluation.

## AC-03 — Enforcement-point compromise and policy bypass (enforced only)

**Goal:** Disable governance while appearing compliant.
**Actors:** `TA-04`, `TA-06`.
**Entry:** `AS-03` → `AS-05` → `AS-06` → `AS-07`.

```text
Goal: unauthorized action passes as governed
├─ OR  Gain control of decision path
│   ├─ Alter policy/configuration                                [TM-04, TM-06]
│   ├─ Compromise policy update channel                          [PROPOSED-03]
│   └─ Compromise enforcement point                              [TM-10]
├─ AND Suppress or forge audit evidence
│   ├─ Drop or rewrite decision event                            [TM-08]
│   └─ Manipulate sequence/time                                  [TM-14]
└─ Governance output indistinguishable from legitimate           [A-03]
```

**Disposition reading:** TM-06 enforced `Prevent` (conditional) fails when TM-10
occurs; TM-10 enforced `Mitigate` with detection `NOT_ESTABLISHED` (`RR-17`).
**This scenario does not describe advisory suppression** — see AC-06.
**Future verification:** simulated compromised point → independent divergence
alert + out-of-band halt.

## AC-04 — Availability pressure and fail-open bypass

**Goal:** Force action through without required oversight.
**Actors:** `TA-01`, `TA-02`, `TA-08`.
**Entry:** `AS-01` → `AS-04` → `TB-03`.

```text
Goal: required human oversight skipped or rubber-stamped
├─ AND Saturate oversight channel
│   ├─ Flood of low-risk proposals                               [TM-09]
│   └─ Reviewer attention exhausted                              [A-10, TM-07]
├─ AND Time-critical action under pressure
│   └─ Control-plane latency exceeds limit                       [A-09]
└─ Fail-open default permits execution                           [TM-09]
```

**Disposition reading:** TM-09 `Mitigate` (both); fail-open vs fail-closed is C4
(WM2), not decided here. **Future verification:** load test with bounded latency.

## AC-05 — Autonomy downgrade plus replay / TOCTOU

**Goal:** Execute an unapproved action under a lower human-involvement level.
**Actors:** `TA-01`, `TA-06`, `TA-04`.
**Entry:** `AS-02`/`AS-03` → `AS-05` → `AS-06`.

```text
Goal: action runs at L0/L1 where L3 was required
├─ OR  Lower selected level
│   ├─ Manipulate context/features                               [TM-11, PROPOSED-05a]
│   └─ Alter level-selection policy                              [TM-04, TM-06, PROPOSED-03]
├─ AND Bind approval to wrong action
│   ├─ Replay valid decision                                     [TM-16]
│   └─ Substitute parameters after evaluation                    [TM-16]
└─ Execution path does not revalidate                            [TM-03, TM-10]
```

**Disposition reading:** TM-12 advisory `Mitigate` / enforced `Prevent`
(conditional on WM2 floors — unclaimable today); TM-16 advisory `Mitigate` /
enforced `Prevent` (conditional). L2/L3 semantics are not defined here.
**Future verification:** after WM2, level-floor and replay tests.

## AC-06 — Advisory recommendation suppression (advisory-specific)

**Goal:** Cause an action to proceed without effective governance advice.
**Actors:** `TA-01`, `TA-04`, `TA-06`.
**Entry:** `AS-05`/`AS-04` → `TB-03`/`TB-06`.

```text
Goal: advice has no effect on execution
├─ OR  Suppress or forge recommendation
│   ├─ Agent ignores recommendation                              [PROPOSED-08]
│   ├─ Attacker alters recommendation content                    [PROPOSED-08]
│   └─ Human-review notification suppressed                      [PROPOSED-08]
└─ No authoritative gate to block execution                      [advisory variant]
```

**Disposition reading:** PROPOSED-08 advisory `Mitigate`, enforced `n/a`.
**Detection differs from TM-10:** compare advice against an independent
execution trace; it is `CONDITIONAL`, not established. **Future verification:**
advice-vs-trace divergence test after an independent trace is specified.

---

## Cross-scenario notes

- Chains assume multiple controls fail; that is defence-in-depth analysis, not a
  likelihood assertion.
- No scenario demonstrates a working exploit.
- `AND`/`OR` structures derive from the STRIDE/ATLAS/ATT&CK lenses in
  [methodology.md](methodology.md), not from framework case studies.
- Detection claims in all scenarios respect the `NOT_ESTABLISHED` status of
  TM-08, TM-10, TM-14, PROPOSED-06 and PROPOSED-07c.
