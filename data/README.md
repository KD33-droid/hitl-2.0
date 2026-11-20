# Data directory

This directory holds **local-only** research datasets and their provenance
records. Raw and derived data are never committed. Only the files under
`data/metadata/` are version-controlled.

## Layout

| Path | Contents | Committed? |
| --- | --- | --- |
| `data/raw/ibm_aml/` | IBM AML dataset files plus the earlier repository snapshot | No |
| `data/raw/ieee_cis/` | Reserved for IEEE-CIS competition data | No |
| `data/interim/` | Intermediate artifacts | No |
| `data/processed/` | Reproducible transformed output | No |
| `data/splits/` | Future train/validation/evaluation splits | No |
| `data/metadata/datasets.yaml` | Source, licence and restriction records | Yes |
| `data/metadata/checksums.sha256` | SHA-256 of every file under `data/raw/ibm_aml/` | Yes |

## IBM AML — files present, provenance partially unverified

`data/raw/ibm_aml/` currently contains **18 CSV/TXT dataset files** and the
two files of an earlier **repository snapshot** of
<https://github.com/IBM/AML-Data>:

| Snapshot file | Role | Bytes |
| --- | --- | --- |
| `AML-Data-main/LICENSE` | Apache-2.0 software licence | 11,357 |
| `AML-Data-main/README.md` | Upstream documentation | 2,053 |

### Provenance — what is and is not known

- The user reports that the 18 dataset files were obtained **directly from the
  IBM repository**. Their **exact source revision and retrieval date are
  unverified**.
- The snapshot commit `366436e605ac7713bf4eee8b4fbc45984d64427c`
  (2023-11-23, "Add link to data on Kaggle") applies **only** to the earlier
  repository snapshot containing `LICENSE` and `README.md`. It must **not** be
  associated with the 18 dataset files.
- That earlier snapshot came from a local ZIP archive named
  `AML-Data-main.zip` (SHA-256
  `7aa9552dae59464100cfcf5cf3d436eb6cfdf8fdbb7dd64040865f37b4bf221d`). The
  archive was documentation-only; its machine-specific local location is
  intentionally not recorded here.

### Dataset files present (18)

| Group | Files |
| --- | --- |
| HI-Large | `HI-Large_accounts.csv`, `HI-Large_Patterns.txt`, `HI-Large_Trans.csv` |
| HI-Medium | `HI-Medium_accounts.csv`, `HI-Medium_Patterns.txt`, `HI-Medium_Trans.csv` |
| HI-Small | `HI-Small_accounts.csv`, `HI-Small_Patterns.txt`, `HI-Small_Trans.csv` |
| LI-Large | `LI-Large_accounts.csv`, `LI-Large_Patterns.txt`, `LI-Large_Trans.csv` |
| LI-Medium | `LI-Medium_accounts.csv`, `LI-Medium_Patterns.txt`, `LI-Medium_Trans.csv` |
| LI-Small | `LI-Small_accounts.csv`, `LI-Small_Patterns.txt`, `LI-Small_Trans.csv` |

**Dataset schema, dimensions, labels and column semantics have not been
independently validated.** The upstream README mentions CSV transactions with
a "laundering" tag; that remains a documentation claim only and is recorded as
unverified in `data/metadata/datasets.yaml`. Sizes and SHA-256 digests for all
20 files (18 dataset files plus the 2 snapshot files) are recorded in
`data/metadata/checksums.sha256` and `data/metadata/datasets.yaml`.

The routine test suite validates only the manifest's format, expected-file
coverage and paths; it does **not** re-hash the raw files. Full SHA-256
verification (~46 GB of reads) is an explicit, separate command:

```bash
bash scripts/verify_checksums.sh
```

### Sources recorded upstream

- Kaggle (described upstream as "new and improved"):
  <https://www.kaggle.com/datasets/ealtman2019/ibm-transactions-for-anti-money-laundering-aml>
- IBM Box (described upstream as "original"):
  <https://ibm.box.com/v/AML-Anti-Money-Laundering-Data> — returned HTTP 404 on
  2026-11-20.

### Licensing and redistribution

- The **repository** is Apache-2.0 (see the preserved `LICENSE`).
- The **data** is **CDLA-Sharing-1.0**, per the upstream README — *not*
  Apache-2.0.
- Raw data must remain local and must not be committed or redistributed. The
  `.gitignore` excludes all data directories.
- Verify CDLA-Sharing-1.0 terms before any sharing or publication.

## IEEE-CIS Fraud Detection

Only the local directory structure is prepared. See
`scripts/download_ieee_cis.sh` for the guarded download command. Downloading
requires an authenticated Kaggle account and acceptance of the competition
rules. Nothing has been downloaded and no credentials are stored in this
repository.

## Working with the data infrastructure

The packages under `src/hitl2/data/` are format-agnostic and discover schemas
at runtime; no column names or thresholds are hard-coded.

```python
from hitl2.data.discovery import detect_format, discover_files
from hitl2.data.metadata import load_registry
from hitl2.data.loaders import iter_csv_chunks, read_header
from hitl2.data.validators import validate_csv
from hitl2.data.preprocessing import transform_csv, DEFAULT_PROCESSED_DIR

registry = load_registry()  # data/metadata/datasets.yaml
files = discover_files(registry.datasets[0].local_path)
chunks = iter_csv_chunks(path, chunk_size=10_000)  # streaming, never loads all rows
result = validate_csv(path)  # existence, schema, missing values, types
```

Transformed files are written only under `data/processed/`, together with a
manifest recording the source checksum and transformation settings so results
are reproducible. No records or columns are silently discarded.

## Research status

Dataset discovery and ingestion infrastructure is **implemented**. The
presence of IBM AML files locally is **not** experimental validation of HITL
2.0, and no schema, label or model result has been validated. No risk model,
thresholds, autonomy logic, policy semantics or audit-integrity mechanism is
implemented here. See `docs/research/research-status.md`.
