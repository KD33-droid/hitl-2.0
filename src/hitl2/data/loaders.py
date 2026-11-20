"""Streaming loaders for delimited text datasets.

Loaders preserve every column and row. Malformed input (duplicate headers or
ragged rows) raises an error rather than silently dropping data.
"""

from __future__ import annotations

import csv
from collections.abc import Iterator
from pathlib import Path

from hitl2.data.discovery import DatasetFormat, detect_format

DEFAULT_CHUNK_SIZE = 10_000
_DELIMITERS = ",;\t|"


class DataFileNotFoundError(FileNotFoundError):
    """Raised when a requested dataset file does not exist."""


def _require_file(path: Path) -> Path:
    if not path.is_file():
        raise DataFileNotFoundError(f"Dataset file not found: {path}")
    return path


def detect_delimiter(path: Path, *, sample_bytes: int = 8192) -> str:
    """Infer a delimited file's separator from a small sample."""
    _require_file(path)
    with path.open("r", encoding="utf-8", newline="") as handle:
        sample = handle.read(sample_bytes)
    if not sample:
        return ","
    try:
        return csv.Sniffer().sniff(sample, delimiters=_DELIMITERS).delimiter
    except csv.Error:
        return "\t" if detect_format(path) is DatasetFormat.TSV else ","


def read_header(
    path: Path,
    *,
    encoding: str = "utf-8",
    delimiter: str | None = None,
) -> list[str]:
    """Read and return the header row of a delimited file."""
    _require_file(path)
    sep = delimiter or detect_delimiter(path)
    with path.open("r", encoding=encoding, newline="") as handle:
        try:
            return next(csv.reader(handle, delimiter=sep))
        except StopIteration:
            return []


def iter_csv_chunks(
    path: Path,
    *,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    encoding: str = "utf-8",
    delimiter: str | None = None,
) -> Iterator[list[dict[str, str]]]:
    """Yield rows in fixed-size chunks while streaming the file.

    Only one chunk is resident in memory at a time. All columns are retained.
    """
    if chunk_size < 1:
        raise ValueError("chunk_size must be at least 1")
    _require_file(path)
    sep = delimiter or detect_delimiter(path)

    with path.open("r", encoding=encoding, newline="") as handle:
        reader = csv.reader(handle, delimiter=sep)
        try:
            header = next(reader)
        except StopIteration:
            return
        if not header:
            return
        if len(set(header)) != len(header):
            raise ValueError(f"Duplicate column names in {path}: {header!r}")

        chunk: list[dict[str, str]] = []
        for line_number, row in enumerate(reader, start=2):
            if len(row) != len(header):
                raise ValueError(
                    f"Ragged row {line_number} in {path}: expected {len(header)} "
                    f"fields, got {len(row)}"
                )
            chunk.append(dict(zip(header, row, strict=True)))
            if len(chunk) == chunk_size:
                yield chunk
                chunk = []
        if chunk:
            yield chunk


def count_rows(
    path: Path,
    *,
    encoding: str = "utf-8",
    delimiter: str | None = None,
) -> int:
    """Count data rows without loading the file into memory."""
    _require_file(path)
    sep = delimiter or detect_delimiter(path)
    with path.open("r", encoding=encoding, newline="") as handle:
        reader = csv.reader(handle, delimiter=sep)
        try:
            next(reader)
        except StopIteration:
            return 0
        return sum(1 for _ in reader)
