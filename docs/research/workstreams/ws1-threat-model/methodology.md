# Methodology — selected methods and their application to HITL 2.0

**Status: Proposed.** Phase 0 baseline. This document explains *how* the selected
methods are applied to the target architecture and defines the semantic model.
It does not merely list frameworks. No framework output is represented as a
validated result.

## 1. Semantic model (Phase 0)

Three independent axes are used; they must never be collapsed:

1. **Primary disposition** — one per threat per applicable architecture variant:
   `Prevent`, `Detect`, `Mitigate`, `Outside boundary` (`n/a` where not applicable).
2. **Capability maturity** — `ESTABLISHED`, `CONDITIONAL`, `NOT_ESTABLISHED`,
   `NOT_APPLICABLE`, applied separately to `Prevent`, `Detect`, `Mitigate`,
   `Response`, `Recovery`.
3. **Control dimensions** — architecture applicability (`BOTH`,
   `ADVISORY_ONLY`, `ENFORCED_ONLY`, `NOT_APPLICABLE`, `UNRESOLVED`) and
   implementation status (`NOT_IMPLEMENTED`, `PARTIALLY_IMPLEMENTED`,
   `IMPLEMENTED`, `NOT_ASSESSED`).

Rules:
- A `CONDITIONAL` or `NOT_ESTABLISHED` capability must not justify an
  unconditional `Prevent` or `Detect` primary.
- A `Prevent` **primary** requires a *defined prevention mechanism*: a concrete
  rejection/enforcement shape whose prerequisites are named. A proposed control
  **name** alone is not a defined mechanism. Where the mechanism depends entirely
  on an unresolved WM2–WM5 design (for example IAM authority, L2/L3 semantics or
  policy signing), the primary is `Mitigate` and `Prevent` remains a
  `NOT_ESTABLISHED` future capability. This distinction separates intended
  posture, defined mechanism and established capability; the three are never
  collapsed into one status.
- Detection status is assigned by **mechanism class** (§1.1), not by the mere
  existence of a control identifier.
- No capability is `ESTABLISHED` in this document set: no mechanism has both
  specified prerequisites and supporting implementation evidence.
- Response and recovery are capability fields only, never primary dispositions.

### 1.1 Detection mechanism classes and mandatory prerequisites

| Class | Detection mechanism | Mandatory prerequisites | Status when prerequisites absent |
| --- | --- | --- | --- |
| **D1** | Application-level validation at a defined boundary (allowlist/access check, level or policy check, threshold, digest revalidation) producing a local denial or alert | Concrete validation shape and named rule/threshold (WM2/WM4/WM3 decisions); **no** independent verifier, separate trust domain, trusted time or key custody required | `NOT_ESTABLISHED`; `CONDITIONAL` only if the validation shape is defined and prerequisites are named |
| **D2** | Policy-violation or bypass detection by independent recomputation/comparison against an execution trace | Verifier independent of the decision path + independent execution trace | `NOT_ESTABLISHED` |
| **D3** | Independent audit-integrity / tamper-evidence verification | Independent verifier, separate trust domain from store/enforcement point, protected verification keys, trusted/monotonic time, defined verification procedure | `NOT_ESTABLISHED` |
| **D4** | Time/freshness-dependent detection (expiry, ordering, replay windows) | Trusted independent time source and counters not writable by the same compromised component | `NOT_ESTABLISHED` |
| **D5** | Protected-key or independent-source-dependent detection (signature/digest verification) | Protected signing/verification key custody or trusted independent digest source | `NOT_ESTABLISHED` |
| **D6** | Independent monitoring/anomaly detection or second-verifier detection | Collector/verifier independent of the monitored component, protected thresholds, separate trust domain | `NOT_ESTABLISHED` |

C-03 (independent out-of-band audit) belongs to classes **D2/D3**; C-14
(anomaly detection and alerting) belongs to **D6**. Where C-03 or C-14 is the
*only* detection path and its prerequisites are unspecified, detection is
`NOT_ESTABLISHED`. This rule is **not** applied indiscriminately: a threat with a
genuine D1 mechanism (for example out-of-allowlist rejection at `TB-06`) may
retain `CONDITIONAL` detection even though independent audit verification is
unestablished. The per-threat class and prerequisites are recorded in
`threat-catalogue.md` under **Detection mechanism**.

## 2. Method selection and rationale

| Method / source | Why selected | What it contributes here | Evidence status |
| --- | --- | --- | --- |
| **STRIDE** (Kohnfelder & Garg, 1999; Shostack, 2014) — R1, R2 | Element-by-element method for software systems; suited to a control plane with interfaces and stores | Completeness check: Spoofing of user identity, Tampering with data, Repudiability, Information disclosure, Denial of Service, Elevation of privilege | R1 **read** (full archived text); R2 metadata only — method application remains provisional pending full text |
| **MITRE ATLAS™** (R3) | Adversary-behaviour knowledge base for AI-enabled systems | AI-specific prompts: model access, poisoning, evasion, exfiltration via outputs | Landing page only; technique/matrices paths unavailable — no technique IDs asserted |
| **MITRE ATT&CK®** (R4) | Enterprise adversary taxonomy | Non-AI chain steps: privilege escalation, defence evasion, collection/exfiltration, impact | Landing page only; technique IDs not asserted |
| **OWASP Top 10 for LLM Applications 2025** (R5) | Community-consensus risks for LLM/agent applications | Cross-check: LLM01 Prompt Injection, LLM02 Sensitive Information Disclosure, LLM03 Supply Chain, LLM04 Data and Model Poisoning, LLM05 Improper Output Handling, LLM06 Excessive Agency, LLM10 Unbounded Consumption | Resource page + category list; PDF text extraction empty — category-level support only |
| **NIST AI RMF 1.0** (R6), **GenAI Profile** (R7) | Governance-side AI risk vocabulary | Framing of trust, oversight and risk management; not a threat catalogue | DOI resolved, body not reviewed — framing claims provisional |
| **NIST SP 800-53 r5** (R8), **SP 800-207** (R9), **SP 800-92** (R10), **SP 800-218** (R11) | Control, zero-trust, log-management and supply-chain guidance | Candidate control families; "no implicit trust" premise | DOI resolved, bodies not reviewed — control claims provisional |

These sources are *lenses and completeness checks*. Threat IDs, dispositions and
residuals are the analyst's proposed contribution, **not** findings quoted from
or validated by these sources.

## 3. Application procedure

1. **Decompose the system** into zones Z1–Z5 and flows 1–8
   ([system-characterization.md](system-characterization.md)).
2. **Inventory separately** assets, actors, boundaries and surfaces; none is a threat.
3. **Apply STRIDE element-by-element** at each boundary:
   - Spoofing at `TB-02` → TM-03, TM-16; spoofing at `TB-03` (approval origin) →
     PROPOSED-02, distinct from PROPOSED-04 (agent/service identity).
   - Tampering at `TB-05` → TM-08; at `TB-07` → TM-11; policy provenance → PROPOSED-03.
   - Repudiability at `TB-08` → TM-08, TM-14.
   - Information disclosure at `TB-01`/`TB-06` → TM-05.
   - Denial of service at `TB-03`/`TB-04` → TM-09; at monitoring → PROPOSED-06.
   - Elevation of privilege at `TB-04`/`TB-06` → TM-04, TM-12.
4. **Apply AI/agent lenses** to add indirect injection (TM-02), excessive agency
   (TM-03), context/poisoning (TM-11), supply chain (TM-15), cross-agent trust
   (PROPOSED-01, pending scope), policy provenance (PROPOSED-03), identity failures
   (PROPOSED-02/04), oversight semantics (PROPOSED-05a–d), monitoring integrity
   (PROPOSED-06), trust assets (PROPOSED-07a–c) and advisory suppression (PROPOSED-08).
5. **Assign one primary disposition per variant**, then record capability statuses
   independently. Conditional capabilities never upgrade a primary.
6. **Model both architectures without choosing** (§4).
7. **Trace and validate** every ID; see the decision register for unresolved items.

## 4. Advisory vs enforced governance (both investigated, neither selected)

| Aspect | Advisory governance | Enforced governance |
| --- | --- | --- |
| Control-plane output | Recommendation / decision the agent or execution layer *may* follow | Decision mediated by an enforcement point before execution |
| "Wall" location | Information channel only; no authoritative choke point | Reference monitor on the proposal→execution path |
| Realistic primaries | Mostly `Mitigate`/`Detect`; `Prevent` generally unsupported | `Prevent` supportable for in-scope actions if the point behaves correctly |
| Principal threat shift | Advice ignored or suppressed → PROPOSED-08 | Enforcement point becomes a high-value target → TM-10 |
| Human oversight L2–L4 | Human consulted; decision can be disregarded | Human decision gates action, conditional on enforcement integrity |
| Availability dependency | Low — execution does not depend on the mediator | **High** — an unavailable mediator forces fail-open (bypass) or fail-closed (denial); decision owned by WM2 (C4) |

**Trust assumption:** the enforcement point, policy engine and audit store are
**not** assumed trusted. Consequently all `Prevent` primaries in the enforced
matrix are marked `C` and all depend on WM2/WM4/WM5 decisions.

### Detection is not shared between the variants

Detection of suppressed advisory recommendations (PROPOSED-08) requires
comparing advice against an independent execution trace. Detection of a
compromised enforcement point (TM-10) requires recomputing policy decisions and
comparing against that trace via a verifier independent of the enforcement point.
These are **different security problems with different trust prerequisites** and
must not reuse one detection mechanism.

## 5. Limitations

- Target architecture only; no deployment topology, host, network or implementation.
- Agent identity, action vocabulary, context contract, event taxonomy, L0–L4
  selection logic, IAM model, trust anchors and time source are unresolved.
- No data, experiments or measurements exist.
- Full text was reviewed only for R1, R12, R13 and R14 in Phase 0; other sources
  remain identified/accessed and dependent claims are provisional
  ([decisions-and-evidence-register.md](decisions-and-evidence-register.md) §4).
- Technique-level ATLAS/ATT&CK IDs are not assigned.
