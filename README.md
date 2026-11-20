# HITL 2.0 — Research Prototype

**Reimagining Human-in-the-Loop 2.0: A Proactive Symbiotic Co-Governance
Framework for Secure and Auditable Agentic AI.**

> **Status:** Early-stage academic research prototype. This repository contains
> project scaffolding, typed interface *placeholders*, local dataset ingestion
> infrastructure and tests. **No governance mechanisms are implemented.** See
> [`docs/research/research-status.md`](docs/research/research-status.md).

## Research motivation

Agentic AI systems can plan and act with increasing autonomy. Traditional
human-in-the-loop patterns tend to be reactive, ad hoc and difficult to audit.
HITL 2.0 explores a *proactive, symbiotic co-governance* model in which human
stakeholders and software governance components share responsibility for
agent behaviour before, during and after an action.

The research questions are open. In particular, the research contribution,
threat model, risk-scoring model (RSM) specification, policy composition, audit
integrity guarantees and evaluation plan must be agreed before any actual
governance mechanism is implemented.

## Project objectives

1. Establish a clean, modular, testable Python foundation for the prototype.
2. Provide clearly marked typed interface placeholders for the core concepts so
   that future work can plug into stable boundaries.
3. Keep all unresolved research semantics explicit rather than encoding guesses
   as code.
4. Maintain separation between what is *proposed*, *specified*, *implemented*
   and *experimentally validated*.

## High-level architecture (proposed, not implemented)

The target design separates an agentic AI ecosystem from a governance control
plane, supported by service and trust/infrastructure layers. The flow below is
an **illustrative target**, not a description of working code:

```text
 Governance objectives  ──►  Agentic AI ecosystem  ◄──►  Human stakeholders
                                     │
                                     ▼
        ┌──────────── HITL 2.0 control plane (proposed) ────────────┐
        │  Action proposal → Risk assessment → Policy validation   │
        │  → Autonomous decision → Human oversight (if required)   │
        │  → Execute / block / modify → Audit & feedback           │
        └───────────────────────────────────────────────────────────┘
                                     │
                 Supporting services │ Trust & infrastructure
              (RSM, policies, IAM,   │ (policy engine, audit store,
               alerts, dashboards)  │  secure infrastructure)
```

Concepts associated with this target — hierarchical autonomy levels (L0–L4),
dynamic constraint walls, risk scoring, policy-engine integration and audit
integrity mechanisms — are **proposed research topics**. None of them are
implemented here. No audit component in this prototype is tamper-proof, and no
such claim is made.

## Current implementation status

| Area | Status |
| --- | --- |
| Python packaging (`src` layout, `pyproject.toml`) | Implemented |
| Module boundaries (`agents`, `governance`, `risk`, `policies`, `human_oversight`, `audit`, `api`) | Implemented as empty namespaces |
| Typed interface placeholders (`ActionProposal`, `GovernanceDecision`, `RiskAssessment`, `AuditEvent`) | Implemented as placeholders |
| Automated tests and CI (pytest, Ruff) | Implemented |
| Risk model / features / thresholds | Not implemented; unresolved |
| Autonomy level (L0–L4) selection logic | Not implemented; unresolved |
| Policy engine and constraint composition | Not implemented; unresolved |
| Audit integrity mechanism | Not implemented; unresolved |
| Dataset ingestion infrastructure (`src/hitl2/data/`) | Implemented; tested with small fixtures |
| IBM AML dataset files | 18 CSV/TXT files present locally; source revision and retrieval date unverified |
| IEEE-CIS data | Not downloaded; authentication and rule acceptance required |
| Experiments, results | None |

## Repository layout

```text
src/hitl2/
  schemas.py            # preliminary typed interface placeholders
  agents/               # agent boundary (namespace only)
  governance/           # control-plane boundary (namespace only)
  risk/                 # risk assessment boundary (namespace only)
  policies/             # policy boundary (namespace only)
  human_oversight/      # human oversight boundary (namespace only)
  audit/                # audit boundary (namespace only)
  api/                  # reserved for a future transport layer
  data/                 # dataset discovery, loaders, validation, preprocessing
tests/                  # import, placeholder and data-infrastructure tests
data/                   # local-only datasets + version-controlled provenance
scripts/                # guarded IEEE-CIS download helper
docs/research/          # research status register
.github/workflows/      # CI: pytest + Ruff
```

The distribution/import name is `hitl2` (the package for "HITL 2.0").

## Setup and test instructions

Requires Python 3.12 or newer.

```bash
# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate

# Install the package in editable mode with development dependencies
python -m pip install -e ".[dev]"

# Run the tests
python -m pytest

# Run linting and formatting checks
python -m ruff check .
python -m ruff format --check .
```

With [uv](https://docs.astral.sh/uv/) installed, the equivalent is:

```bash
uv sync --locked --extra dev   # uses the committed uv.lock
uv run ruff check .
uv run ruff format --check .
uv run pytest
```

CI uses these same uv commands against the committed `uv.lock`; keep the lock
file synchronized with `pyproject.toml` via `uv lock` when dependencies change.

## Dataset infrastructure (implemented; IBM AML files present)

Provenance and checksums are documented in
[`data/README.md`](data/README.md) and
[`data/metadata/datasets.yaml`](data/metadata/datasets.yaml). Eighteen CSV/TXT
IBM AML dataset files are present under `data/raw/ibm_aml/`. The user reports
obtaining them directly from the IBM repository; their exact source revision
and retrieval date are **unverified**. The commit
`366436e605ac7713bf4eee8b4fbc45984d64427c` recorded in the provenance file
applies only to the earlier documentation-only repository snapshot (`LICENSE`
and `README.md`), **not** to these dataset files.

The upstream README identifies the data licence as **CDLA-Sharing-1.0**,
distinct from the repository's Apache-2.0 software licence. Dataset schema,
dimensions, labels and column semantics have **not** been independently
validated.

`hitl2.data` provides format-agnostic discovery, streaming CSV/TSV chunk
loaders, schema/missing-value/type validation, checksum helpers, and
reproducible preprocessing into `data/processed/` with a manifest. No column
names, features or thresholds are hard-coded. All dataset directories are
git-ignored.

IEEE-CIS is **preparation only**. Install the CLI with
`uv tool install kaggle --with six`; see
[`scripts/download_ieee_cis.sh`](scripts/download_ieee_cis.sh) for the guarded
command. Downloading requires the user to authenticate and accept the
competition rules. No download was performed and no credentials are stored.

Dataset ingestion is infrastructure work, **not** experimental validation of
HITL 2.0.

## Research governance note

Per Dr. Divya Rao's review, the following must be agreed before implementing
actual governance mechanisms: the research contribution, threat model, RSM
specification, policy composition, audit integrity and evaluation plan. All six
are currently open. See the status register for details.
