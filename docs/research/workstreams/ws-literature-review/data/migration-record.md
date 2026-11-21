# Stage 1B.6 register migration record

**Date:** 2026-11-21
**Authority:** `decision-log.md §8` (Stage 1B.6 researcher authorisation)
**Specification:** `register-schemas.md` (approved target schemas, AUD-04 migration rules)

This record evidences the implementation of all 12 registers. All files remain
**header-only**: no research record, identifier, score, DOI or finding was
created. No API probe, search, collection, screening or scoring was performed.

## Before-and-after: five existing registers

| Register | Fields before | Fields after | Data rows before → after | SHA-256 before → after | Change |
| --- | ---: | ---: | --- | --- | --- |
| `papers.csv` | 20 | 21 | 0 → 0 | `1fe784528c823764d8e3ae9a30289956ef537a7518fdddbd7eba87f3976d8dfa` → `e0cbbbbf6254261e9fb3b7e5a0596a42b72793bc64a810f7ec267cc48feb1cec` | inserted `abstract` after `authors` (A-6) |
| `screening-register.csv` | 20 | 24 | 0 → 0 | `19a2cdd59948e2e53cb5529f0f8ba15ebdf5aa7bb54c4b8bc050bab5b13647c7` → `a3ea7fe682343225b43ee55a498dd542c1a1dc4036b526ee2eb2842a32a7ebdc` | inserted `abstract_text`, `abstract_source`, `abstract_retrieved_at_utc`, `abstract_provenance_status` after `raw_year` (AUD-05) |
| `verification-register.csv` | 17 | 17 | 0 → 0 | `5a7b78b8818c5d7048ac49db8cc44b92857aabd4b97c22f975ed1eec0daf60d9` → `5a7b78b8818c5d7048ac49db8cc44b92857aabd4b97c22f975ed1eec0daf60d9` | none; header already matched target; file byte-identical |
| `evaluation-matrix.csv` | 35 | 35 | 0 → 0 | `09ed8547507a4a23ca1591a83ce954f44cf0128b7d036637215a49965556090e` → `09ed8547507a4a23ca1591a83ce954f44cf0128b7d036637215a49965556090e` | none; header already matched target; file byte-identical |
| `authoritative-register.csv` | 16 | 17 | 0 → 0 | `dd59e10931cabfea636d6617b962e348f682aee584b83b1ef8868aa6a5718344` → `27e5c6cfd091ac3e86407891c67998e4f23cabf0803448126a0c4752752fbb23` | inserted required `report_id` after `auth_id` (F2) |

All five files were verified as one-line, header-only files immediately before
migration. No data row existed to preserve; zero data rows exist after
migration. No other pre-existing field was renamed, reordered or removed.

## Seven newly created registers

| Register | Fields | Data rows | SHA-256 | Source |
| --- | ---: | ---: | --- | --- |
| `record-report-links.csv` | 13 | 0 | `57dbc20929447d2d9a5475d73cdead41f7086138213becae84678af1e6751449` | `register-schemas.md §6` |
| `reports.csv` | 21 | 0 | `1c8226cb13417c1e9e0d0c73199983795ccfe1c53b1d875c4e29a4d7c3c91e73` | `register-schemas.md §7` |
| `report-dates.csv` | 13 | 0 | `f797d06fee21971d88bf8ecf87ce9b563ed2a6f7d3916203b9decd69849b03d5` | `register-schemas.md §8` |
| `report-relationships.csv` | 10 | 0 | `06b14b10982846555c46acc349c47ab225226a2135862de3fd8f2fc114edea98` | `register-schemas.md §9` |
| `report-state-history.csv` | 22 | 0 | `22c5435bc66a59f7701fa86c9a06803783e01144abab0969a1f84e46ff702404` | `register-schemas.md §10` |
| `prisma-snapshots.csv` | 22 | 0 | `300ee89dc70f7db6f9430804f284140a1788380b15ee3214e73c5afacdb93ed8` | `register-schemas.md §11` |
| `source-identifiers.csv` | 10 | 0 | `7ff43348bc148a8e3da45b248a389c864df0bd1cf05479a78f5860f993d9d1e7` | `register-schemas.md §12` |

Headers were transcribed from the approved specification. Field names, order
and required fields were not invented or altered.

## Validation

Run from the workstream directory:

```bash
python3 tools/validate_registers.py
python3 tools/validate_registers.py --self-test
```

- `validate_registers.py`: **PASS** — 12 registers, 0 data rows.
- `--self-test`: **PASS** — 4 synthetic negative cases (report-level
  `TITLE_ABSTRACT`, incorrect weighted score, dangling `lit_id`, accepted
  authorisation without expiry) were rejected as expected. Synthetic fixtures
  exist in memory only and are not written to any register.

The validator checks: file presence; exact header names and ordering; duplicate
headers; required fields; enumerated values (including list members); identifier
patterns; date/timestamp and integer types; conditional rules (abstract
provenance, exclusion codes, DOI/authoritative-record fallback, score formulas,
report state/exclusion, retry expiry, date precision, relationship constraints);
cross-register identifiers; methodology/schema field coverage; and header-only
data preservation.

## Data preservation confirmation

- **0 data rows before and 0 data rows after** across all five existing registers.
- Two registers are byte-identical to their pre-migration state
  (`verification-register.csv`, `evaluation-matrix.csv`).
- The three changed registers differ only by the insertion of the specified
  new header fields, in the positions required by the approved schema.
- No register was populated with fabricated research records.

## Stage 1B.6 completion

All completion criteria in `decision-log.md §8.3` are met. Stage 1 search
execution remains **not started** and requires separate human approval.
