"""Reproducible, non-destructive preprocessing for delimited datasets.

Transformations stream input to ``data/processed/`` and preserve every row and
column. A manifest records the source checksum and settings so a run can be
reproduced or audited. No dataset-specific feature engineering is performed.
"""

from __future__ import annotations

import csv
import json
from collections.abc import Mapping
from pathlib import Path

from pydantic import BaseModel, ConfigDict

from hitl2.data.discovery import sha256_file
from hitl2.data.loaders import (
    DEFAULT_CHUNK_SIZE,
    DataFileNotFoundError,
    iter_csv_chunks,
    read_header,
)

DEFAULT_PROCESSED_DIR = Path("data/processed")


class _StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class PreprocessingManifest(_StrictModel):
    """Deterministic record of one preprocessing run."""

    source_path: str
    source_sha256: str
    output_name: str
    row_count: int
    columns_in: list[str]
    columns_out: list[str]
    column_map: dict[str, str]
    chunk_size: int


def processed_path(root: Path, name: str) -> Path:
    """Resolve ``name`` under ``root``, rejecting path traversal."""
    destination = (root / name).resolve()
    if not destination.is_relative_to(root.resolve()):
        raise ValueError(f"Output path escapes processed directory: {name!r}")
    return destination


def transform_csv(
    source: Path,
    root: Path = DEFAULT_PROCESSED_DIR,
    *,
    name: str | None = None,
    column_map: Mapping[str, str] | None = None,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    encoding: str = "utf-8",
) -> PreprocessingManifest:
    """Stream ``source`` into a processed CSV, preserving all data.

    Args:
        source: Input delimited file. Never modified.
        root: Processed-data root directory. Created if needed.
        name: Output filename. Defaults to the source stem plus ``.csv``.
        column_map: Optional complete-or-partial ``old -> new`` column renaming.
            Unknown source columns raise ``ValueError`` instead of being dropped.
        chunk_size: Rows held in memory per chunk.
        encoding: Text encoding for input and output.

    Raises:
        DataFileNotFoundError: If ``source`` does not exist.
        ValueError: If renaming targets are unknown, collide, or the output
            path escapes ``root``.
    """
    if not source.is_file():
        raise DataFileNotFoundError(f"Source file not found: {source}")

    mapping = dict(column_map or {})
    output_name = name or f"{source.stem}.csv"
    destination = processed_path(root, output_name)
    destination.parent.mkdir(parents=True, exist_ok=True)

    columns_in = read_header(source, encoding=encoding)
    unknown = sorted(set(mapping) - set(columns_in))
    if unknown:
        raise ValueError(f"column_map references unknown columns: {unknown}")
    columns_out = [mapping.get(column, column) for column in columns_in]
    if len(set(columns_out)) != len(columns_out):
        raise ValueError("column_map produces duplicate output column names")

    row_count = 0
    with destination.open("w", encoding=encoding, newline="") as output:
        writer = csv.writer(output)
        writer.writerow(columns_out)
        for chunk in iter_csv_chunks(
            source,
            chunk_size=chunk_size,
            encoding=encoding,
        ):
            for row in chunk:
                writer.writerow([row[column] for column in columns_in])
                row_count += 1

    manifest = PreprocessingManifest(
        source_path=str(source),
        source_sha256=sha256_file(source),
        output_name=output_name,
        row_count=row_count,
        columns_in=columns_in,
        columns_out=columns_out,
        column_map=mapping,
        chunk_size=chunk_size,
    )
    manifest_path = destination.with_name(f"{destination.name}.manifest.json")
    manifest_path.write_text(manifest.model_dump_json(indent=2) + "\n", encoding="utf-8")
    return manifest


def load_manifest(path: Path) -> PreprocessingManifest:
    """Load a manifest written by :func:`transform_csv`."""
    if not path.is_file():
        raise FileNotFoundError(f"Manifest not found: {path}")
    return PreprocessingManifest.model_validate(json.loads(path.read_text(encoding="utf-8")))
