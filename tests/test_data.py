"""Tests for the local dataset ingestion infrastructure.

All fixtures are tiny temporary files. No complete research dataset is copied,
loaded or required by these tests.
"""

from __future__ import annotations

import csv
import hashlib
import re
import zipfile
from pathlib import Path

import pytest

from hitl2.data.discovery import (
    DatasetFormat,
    checksum_line,
    detect_format,
    discover_files,
    find_data_files,
    sha256_file,
)
from hitl2.data.loaders import (
    DataFileNotFoundError,
    count_rows,
    iter_csv_chunks,
    read_header,
)
from hitl2.data.metadata import load_registry
from hitl2.data.preprocessing import load_manifest, processed_path, transform_csv
from hitl2.data.validators import (
    ColumnType,
    SchemaSpec,
    infer_column_type,
    validate_csv,
)

REPO_ROOT = Path(__file__).resolve().parents[1]


def _write_csv(path: Path, header: list[str], rows: list[list[str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(header)
        writer.writerows(rows)


def _small_csv(tmp_path: Path) -> Path:
    path = tmp_path / "source.csv"
    _write_csv(
        path,
        ["id", "amount", "note"],
        [
            ["1", "10.5", "ok"],
            ["2", "", ""],
            ["3", "20.0", "ok"],
        ],
    )
    return path


def test_discover_files_is_deterministic_and_recursive(tmp_path: Path) -> None:
    _write_csv(tmp_path / "b.csv", ["x"], [])
    (tmp_path / "a.txt").write_text("doc", encoding="utf-8")
    _write_csv(tmp_path / "nested" / "c.csv", ["y"], [])

    found = discover_files(tmp_path)
    assert [item.relative_path for item in found] == ["a.txt", "b.csv", "nested/c.csv"]
    assert [item.format for item in found] == [
        DatasetFormat.TEXT,
        DatasetFormat.CSV,
        DatasetFormat.CSV,
    ]
    assert [item.relative_path for item in find_data_files(tmp_path)] == [
        "b.csv",
        "nested/c.csv",
    ]
    assert [item.relative_path for item in discover_files(tmp_path, recursive=False)] == [
        "a.txt",
        "b.csv",
    ]


def test_discover_files_accepts_single_file_and_rejects_missing_root(
    tmp_path: Path,
) -> None:
    csv_file = tmp_path / "only.csv"
    _write_csv(csv_file, ["x"], [])
    assert [item.relative_path for item in discover_files(csv_file)] == ["only.csv"]

    with pytest.raises(FileNotFoundError):
        discover_files(tmp_path / "does-not-exist")


def test_detect_format(tmp_path: Path) -> None:
    (tmp_path / "a.csv").write_text("x", encoding="utf-8")
    (tmp_path / "b.tsv").write_text("x", encoding="utf-8")
    (tmp_path / "c.md").write_text("x", encoding="utf-8")
    (tmp_path / "d.json").write_text("{}", encoding="utf-8")
    (tmp_path / "e.unknown").write_text("x", encoding="utf-8")
    with zipfile.ZipFile(tmp_path / "f.zip", "w") as archive:
        archive.writestr("inner.txt", "x")

    assert detect_format(tmp_path / "a.csv") is DatasetFormat.CSV
    assert detect_format(tmp_path / "b.tsv") is DatasetFormat.TSV
    assert detect_format(tmp_path / "c.md") is DatasetFormat.MARKDOWN
    assert detect_format(tmp_path / "d.json") is DatasetFormat.JSON
    assert detect_format(tmp_path / "f.zip") is DatasetFormat.ZIP
    assert detect_format(tmp_path / "e.unknown") is DatasetFormat.UNKNOWN
    assert detect_format(tmp_path / "missing.csv") is DatasetFormat.UNKNOWN


def test_read_header_and_count_rows(tmp_path: Path) -> None:
    path = _small_csv(tmp_path)
    assert read_header(path) == ["id", "amount", "note"]
    assert count_rows(path) == 3


def test_iter_csv_chunks_preserves_every_row(tmp_path: Path) -> None:
    path = tmp_path / "many.csv"
    rows = [[str(index), f"{index}.5", "v"] for index in range(25)]
    _write_csv(path, ["id", "amount", "note"], rows)

    chunks = list(iter_csv_chunks(path, chunk_size=10))
    assert [len(chunk) for chunk in chunks] == [10, 10, 5]
    flattened = [row for chunk in chunks for row in chunk]
    assert len(flattened) == 25
    assert flattened[0] == {"id": "0", "amount": "0.5", "note": "v"}
    assert flattened[-1] == {"id": "24", "amount": "24.5", "note": "v"}


def test_iter_csv_chunks_rejects_malformed_input(tmp_path: Path) -> None:
    ragged = tmp_path / "ragged.csv"
    ragged.write_text("a,b\n1,2\n3\n", encoding="utf-8")
    with pytest.raises(ValueError, match="Ragged row"):
        list(iter_csv_chunks(ragged))

    duplicate = tmp_path / "duplicate.csv"
    duplicate.write_text("a,a\n1,2\n", encoding="utf-8")
    with pytest.raises(ValueError, match="Duplicate column"):
        list(iter_csv_chunks(duplicate))


def test_missing_file_handling(tmp_path: Path) -> None:
    missing = tmp_path / "missing.csv"
    with pytest.raises(DataFileNotFoundError):
        read_header(missing)
    with pytest.raises(DataFileNotFoundError):
        count_rows(missing)
    with pytest.raises(DataFileNotFoundError):
        list(iter_csv_chunks(missing))
    with pytest.raises(DataFileNotFoundError):
        validate_csv(missing)


def test_validate_csv_schema_types_and_missing_values(tmp_path: Path) -> None:
    path = _small_csv(tmp_path)
    result = validate_csv(
        path,
        SchemaSpec(
            required_columns=["id"],
            expected_types={"amount": ColumnType.FLOAT},
            max_missing_fraction=0.5,
        ),
    )
    assert result.ok
    assert result.row_count == 3
    assert result.columns == ["id", "amount", "note"]
    by_name = {profile.name: profile for profile in result.profiles}
    assert by_name["amount"].inferred_type is ColumnType.FLOAT
    assert by_name["amount"].missing_values == 1
    assert by_name["note"].missing_values == 1

    failed = validate_csv(
        path,
        SchemaSpec(required_columns=["label"], max_missing_fraction=0.1),
    )
    codes = {issue.code for issue in failed.issues}
    assert "missing_required_column" in codes
    assert "missing_value_threshold" in codes
    assert not failed.ok


def test_validate_csv_detects_duplicate_columns(tmp_path: Path) -> None:
    path = tmp_path / "duplicates.csv"
    _write_csv(path, ["a", "a"], [["1", "2"]])
    result = validate_csv(path)
    assert any(issue.code == "duplicate_column" for issue in result.issues)


def test_infer_column_type() -> None:
    assert infer_column_type([]) is ColumnType.EMPTY
    assert infer_column_type(["1", "2"]) is ColumnType.INTEGER
    assert infer_column_type(["1", "2.5"]) is ColumnType.FLOAT
    assert infer_column_type(["true", "false"]) is ColumnType.BOOLEAN
    assert infer_column_type(["2024-01-01"]) is ColumnType.DATETIME
    assert infer_column_type(["abc"]) is ColumnType.STRING
    assert infer_column_type(["1", "abc"]) is ColumnType.STRING


def test_metadata_loading_from_repository() -> None:
    registry = load_registry(REPO_ROOT / "data/metadata/datasets.yaml")
    assert registry.schema_version == 1
    ibm = registry.get("ibm_aml")
    assert ibm.data_files_present is True
    assert ibm.license.data == "CDLA-Sharing-1.0"
    assert ibm.license.repository == "Apache-2.0"
    assert ibm.source.snapshot_commit == "366436e605ac7713bf4eee8b4fbc45984d64427c"
    assert registry.get("ieee_cis").data_files_present is False
    with pytest.raises(KeyError):
        registry.get("not-a-dataset")


def test_metadata_loading_missing_file(tmp_path: Path) -> None:
    with pytest.raises(FileNotFoundError):
        load_registry(tmp_path / "missing.yaml")


def test_checksum_generation_streams_and_matches_hashlib(tmp_path: Path) -> None:
    payload = bytes(range(256)) * 40
    path = tmp_path / "blob.bin"
    path.write_bytes(payload)
    expected = hashlib.sha256(payload).hexdigest()

    assert sha256_file(path) == expected
    assert sha256_file(path, chunk_size=7) == expected
    assert checksum_line(path, expected, root=tmp_path) == f"{expected}  blob.bin"

    with pytest.raises(FileNotFoundError):
        sha256_file(tmp_path / "missing.bin")


def test_checksums_manifest_format_and_coverage() -> None:
    """Check manifest format, file coverage and paths without hashing raw data.

    Full SHA-256 verification of large raw files is an explicit, separate
    integrity check: ``bash scripts/verify_checksums.sh``.
    """
    manifest_path = REPO_ROOT / "data/metadata/checksums.sha256"
    entries: dict[str, str] = {}
    for line in manifest_path.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        digest, separator, relative = line.partition("  ")
        assert separator == "  ", f"malformed checksum line: {line!r}"
        assert re.fullmatch(r"[0-9a-f]{64}", digest), f"malformed digest: {digest!r}"
        assert relative and not relative.isspace()
        entries[relative] = digest

    registry = load_registry(REPO_ROOT / "data/metadata/datasets.yaml")
    ibm = registry.get("ibm_aml")
    declared = {item.path: item.sha256 for item in ibm.files if item.sha256}

    assert len(entries) == 20
    assert set(entries) == set(declared)
    assert entries == declared

    raw_root = (REPO_ROOT / "data/raw/ibm_aml").resolve()
    for relative in entries:
        path = Path(relative)
        assert not path.is_absolute()
        assert ".." not in path.parts
        assert (REPO_ROOT / path).resolve().is_relative_to(raw_root)


def test_preprocessing_is_reproducible_and_preserves_data(tmp_path: Path) -> None:
    source = _small_csv(tmp_path)
    original = source.read_bytes()
    mapping = {"amount": "transaction_amount"}

    first_root = tmp_path / "processed_a"
    second_root = tmp_path / "processed_b"
    first = transform_csv(source, first_root, column_map=mapping, chunk_size=2)
    second = transform_csv(source, second_root, column_map=mapping, chunk_size=2)

    assert first == second
    assert first.row_count == 3
    assert first.columns_in == ["id", "amount", "note"]
    assert first.columns_out == ["id", "transaction_amount", "note"]
    output_a = first_root / "source.csv"
    output_b = second_root / "source.csv"
    assert output_a.read_bytes() == output_b.read_bytes()
    assert read_header(output_a) == first.columns_out
    assert count_rows(output_a) == 3
    assert source.read_bytes() == original

    manifest_file = output_a.with_name("source.csv.manifest.json")
    assert load_manifest(manifest_file) == first


def test_preprocessing_rejects_unsafe_settings(tmp_path: Path) -> None:
    source = _small_csv(tmp_path)
    with pytest.raises(ValueError, match="unknown columns"):
        transform_csv(source, tmp_path / "out", column_map={"absent": "x"})
    with pytest.raises(ValueError, match="escapes processed directory"):
        processed_path(tmp_path / "out", "../outside.csv")
