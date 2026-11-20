# Bibliography and verification status

**Status: Proposed.** Phase 0 baseline. Verification checks were performed on
2026-11-20. Phase 0 additionally attempted substantive-content access for the
minimum source set (R1, R2, R3, R5, R12, R13, R14). No reference is invented and
no claim in WM1 is presented as a finding of these sources.

## Verification-status vocabulary

| Status | Meaning |
| --- | --- |
| `IDENTIFIED` | Bibliographic record and link/DOI confirmed; document body not retrieved. |
| `ACCESSED` | Landing page, abstract, category list or publisher metadata inspected; **full text not read**. |
| `READ` | Full text accessed and reviewed for specific claims in this workstream. |

**Rule:** a landing page, category list or abstract is **not** full-text evidence.
Only R1, R12, R13 and R14 are `READ` after Phase 0, and their review was
targeted at the claims listed in §3 — not exhaustive. No technique IDs, section
numbers or page numbers are asserted unless verified in retrieved material.

---

## 1. Frameworks, standards and methods

**R1 — READ (full text via archived-copy text extraction)**
Kohnfelder, L., & Garg, P. (1999). *The Threats to Our Products*. Microsoft
Interface, April 1999.
Archived copy: <https://shostack.org/files/microsoft/The-Threats-To-Our-Products.docx>
Reviewed: six STRIDE categories (source wording "Spoofing of user identity",
"Tampering with data", "Repudiability", "Information disclosure", "Denial of
Service", "Elevation of privilege"); source definitions of threat, vulnerability
and attack; "beyond the basic threats" discussion including privilege misuse and
rogue administrator. Used for STRIDE category naming and the element-by-element
premise. Source is an internal Microsoft publication with a disclaimer.

**R2 — ACCESSED (publisher metadata only)**
Shostack, A. (2014). *Threat Modeling: Designing for Security*. Wiley, February
2014. ISBN 978-1-118-80999-0.
<https://www.wiley.com/en-us/Threat+Modeling%3A+Designing+for+Security-p-9781118809990>
Full text behind paywall; not reviewed. Element-by-element method claims remain
provisional.

**R3 — ACCESSED (landing page only)**
MITRE Corporation. *MITRE ATLAS™ — Adversarial Threat Landscape for
Artificial-Intelligence Systems*. Living knowledge base; no fixed edition.
<https://atlas.mitre.org/>
Access date 2026-11-20. Phase 0 attempts to retrieve `/techniques/` and
`/matrices/` returned HTTP 404; no version snapshot or technique IDs were
obtained. AI threat prompts derived from ATLAS remain provisional; no technique
IDs asserted.

**R4 — ACCESSED (landing page only)**
MITRE Corporation. *MITRE ATT&CK®*. Living knowledge base; no fixed edition.
<https://attack.mitre.org/> · Access date 2026-11-20. No technique IDs asserted.

**R5 — ACCESSED (resource page + category list; PDF text extraction empty)**
OWASP Foundation (2024). *OWASP Top 10 for LLM Applications 2025*. Published
17 November 2024.
Resource: <https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025>
Category list: <https://genai.owasp.org/llm-top-10/>
PDF: <https://owasp.github.io/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf>
Attempted PDF text extraction via a reader proxy returned empty content; the
category list was verified. Category-level mappings only; no section or page
claims.

**R6 — IDENTIFIED (DOI resolves; metadata verified)**
National Institute of Standards and Technology (2023). *Artificial Intelligence
Risk Management Framework (AI RMF 1.0)*. NIST AI 100-1. January 2023.
DOI: <https://doi.org/10.6028/NIST.AI.100-1>

**R7 — IDENTIFIED (DOI resolves; metadata verified)**
National Institute of Standards and Technology (2024). *Artificial Intelligence
Risk Management Framework: Generative Artificial Intelligence Profile*.
NIST AI 600-1. July 2024.
DOI: <https://doi.org/10.6028/NIST.AI.600-1>

**R8 — IDENTIFIED (DOI resolves; metadata verified)**
National Institute of Standards and Technology (2020). *Security and Privacy
Controls for Information Systems and Organizations*. NIST SP 800-53, Rev. 5.
DOI: <https://doi.org/10.6028/NIST.SP.800-53r5>

**R9 — IDENTIFIED (DOI resolves; metadata verified)**
National Institute of Standards and Technology (2020). *Zero Trust
Architecture*. NIST SP 800-207. August 2020.
DOI: <https://doi.org/10.6028/NIST.SP.800-207>

**R10 — IDENTIFIED (DOI resolves; metadata verified)**
Souppaya, M., & Kent, K. (2006). *Guide to Computer Security Log Management*.
NIST SP 800-92. September 2006.
DOI: <https://doi.org/10.6028/NIST.SP.800-92>

**R11 — IDENTIFIED (DOI resolves)**
National Institute of Standards and Technology. *Secure Software Development
Framework (SSDF)*. NIST SP 800-218. Version/year not asserted (not verified).
DOI: <https://doi.org/10.6028/NIST.SP.800-218>

## 2. Agentic AI / LLM security literature

**R12 — READ (full-text HTML, arXiv v2)**
Greshake, K., Abdelnabi, S., Mishra, S., Endres, C., Holz, T., & Fritz, M.
(2023). *Not what you've signed up for: Compromising Real-World LLM-Integrated
Applications with Indirect Prompt Injection*. arXiv:2302.12173v2 (5 May 2023).
<https://arxiv.org/abs/2302.12173> · DOI: <https://doi.org/10.48550/arXiv.2302.12173>
ACM DOI as cited in R13's bibliography: **10.1145/3605764.3623985** (ACM landing
page not directly verified; an earlier candidate DOI returned HTTP 403 — do not
use that candidate).
Reviewed sections: 1 Introduction; 3 Attack Surface (injection methods, threats,
targets); 4 Evaluation; 5 Discussion (limitations, mitigations). Supports WM1's
indirect-injection mechanism, taxonomy of impacts (information gathering, fraud,
intrusion, manipulated content, availability), and the observation that current
defences lack guarantees. WM1's governance mapping is our interpretation, not a
source claim.

**R13 — READ (full-text HTML, arXiv v3)**
Debenedetti, E., Zhang, J., Balunović, M., Beurer-Kellner, L., Fischer, M., &
Tramèr, F. (2024). *AgentDojo: A Dynamic Environment to Evaluate Prompt Injection
Attacks and Defenses for LLM Agents*. arXiv:2406.13352v3 (24 Nov 2024).
<https://arxiv.org/abs/2406.13352> · DOI: <https://doi.org/10.48550/arXiv.2406.13352>
Reviewed sections: 1 Introduction; 3 Design (components, agents/defences, attacks);
4 Evaluation (including tool-filter defence and its limitations); 5 Conclusion.
Supports WM1's future-evaluation-harness criterion and the note that tool filtering
fails when the tools needed for the task suffice for the attack. No experimental
result of HITL 2.0 is claimed from this source.

**R14 — READ (full-text HTML, arXiv v2)**
Debenedetti, E., Shumailov, I., Fan, T., Hayes, J., Carlini, N., Fabian, D.,
Kern, C., Shi, C., Terzis, A., & Tramèr, F. (2025). *Defeating Prompt Injections
by Design*. arXiv:2503.18813v2 (24 Jun 2025).
<https://arxiv.org/abs/2503.18813> · DOI: <https://doi.org/10.48550/arXiv.2503.18813>
Reviewed sections: 2 Design; 3 Threat Model; 3.1 Explicit non-goals; 4 Security
game; 5 CaMeL Design (capabilities, interpreter); 6 Evaluation; 7 Side Channels.
Supports WM1's capability/data-flow concept for `C-01` **with explicit limits**:
the authors list non-goals (text-to-text attacks, no-exfiltration manipulations),
state side channels remain a problem, and note their implementation has no
atomicity or rollback for side-effecting failed operations. WM1 therefore does
**not** claim general "provable security" for HITL 2.0.

**R15 — ACCESSED (abstract page only)**
Zou, A., Wang, Z., Carlini, N., Nasr, M., Kolter, J. Z., & Fredrikson, M.
(2023). *Universal and Transferable Adversarial Attacks on Aligned Language
Models*. arXiv:2307.15043.
<https://arxiv.org/abs/2307.15043> · DOI: <https://doi.org/10.48550/arXiv.2307.15043>
Relevance to context poisoning is weak; dependent claim in TM-11 is provisional.

## 3. Literature evidence dependency map (Phase 0 minimum set)

| Source | Status | WM1 claim(s) supported | Limitation |
| --- | --- | --- | --- |
| R1 | READ | STRIDE category names/definitions; element-based threat identification | 1999 internal publication; product examples are historical |
| R2 | ACCESSED | Element-by-element method application | Method fidelity unverified — provisional |
| R3 | ACCESSED | AI threat prompts in `methodology.md` §3 | No technique IDs; no snapshot — provisional |
| R5 | ACCESSED | Category names in TM-01/02/03/05/07/09/11/12/15 | Category-list level only |
| R12 | READ | TM-02 indirect-injection mechanism and impact classes | Governance mapping is WM1 interpretation |
| R13 | READ | Future evaluation harness; tool-filter limitation | No HITL 2.0 experiment claimed |
| R14 | READ | Capability/flow-separation concept for `C-01` | Explicit non-goals, side channels, no atomicity/rollback — no general guarantee claimed |

Sources R4, R6–R11 and R15 remain at their stated levels; dependent claims are
provisional. Full details and ownership are in
[decisions-and-evidence-register.md](decisions-and-evidence-register.md) §4.

## 4. Repository-local sources (not literature)

- `README.md`, `docs/research/research-status.md`, `src/hitl2/schemas.py`.
- `src/hitl2/data/` and `data/metadata/` — dataset ingestion infrastructure and
  provenance; intended research inputs only, no experimental evidence.

Session C retains ownership of systematic literature discovery in
`docs/research/workstreams/ws-literature-review/`; WM1 verification covers only
the sources WM1 actually cites and did not modify Session C files.
