"""Filesystem discovery, format detection and checksum helpers for datasets.

Discovery never loads dataset contents. It inspects paths, suffixes, sizes and
(optionally) streamed hashes only.
"""

from __future__ import annotations

import hashlib
import zipfile
from collections.abc import Collection
from dataclasses import dataclass
from enum import StrEnum
from pathlib import Path

_SUFFIX_FORMATS = {
    ".csv": "csv",
    ".tsv": "tsv",
    ".parquet": "parquet",
    ".json": "json",
    ".jsonl": "jsonl",
    ".zip": "zip",
    ".md": "markdown",
    ".txt": "text",
    ".pdf": "pdf",
    ".yaml": "yaml",
    ".yml": "yaml",
    ".tar": "archive",
    ".gz": "archive",
    ".7z": "archive",
    ".rar": "archive",
}


class DatasetFormat(StrEnum):
    CSV = "csv"
    TSV = "tsv"
    PARQUET = "parquet"
    JSON = "json"
    JSONL = "jsonl"
    ZIP = "zip"
    MARKDOWN = "markdown"
    TEXT = "text"
    PDF = "pdf"
    YAML = "yaml"
    ARCHIVE = "archive"
    UNKNOWN = "unknown"


DATA_FORMATS = frozenset(
    {
        DatasetFormat.CSV,
        DatasetFormat.TSV,
        DatasetFormat.PARQUET,
        DatasetFormat.JSON,
        DatasetFormat.JSONL,
    }
)


@dataclass(frozen=True, slots=True)
class DiscoveredFile:
    """Description of one discovered file."""

    path: Path
    format: DatasetFormat
    size_bytes: int
    relative_path: str


def detect_format(path: Path) -> DatasetFormat:
    """Detect a dataset file format from its suffix (and ZIP magic bytes)."""
    if not path.is_file():
        return DatasetFormat.UNKNOWN
    suffix = path.suffix.lower()
    if suffix == ".zip" or zipfile.is_zipfile(path):
        return DatasetFormat.ZIP
    name = path.name.lower()
    if name.endswith(".tar.gz"):
        return DatasetFormat.ARCHIVE
    try:
        return DatasetFormat(_SUFFIX_FORMATS[suffix])
    except KeyError:
        return DatasetFormat.UNKNOWN


def _describe(path: Path, root: Path) -> DiscoveredFile:
    return DiscoveredFile(
        path=path,
        format=detect_format(path),
        size_bytes=path.stat().st_size,
        relative_path=path.relative_to(root).as_posix(),
    )


def discover_files(
    root: Path,
    *,
    recursive: bool = True,
    formats: Collection[DatasetFormat] | None = None,
) -> list[DiscoveredFile]:
    """List files under ``root`` in a deterministic order.

    Args:
        root: A directory, or a single file.
        recursive: Whether to descend into subdirectories.
        formats: Optional format filter.

    Raises:
        FileNotFoundError: If ``root`` does not exist.
    """
    if not root.exists():
        raise FileNotFoundError(f"Discovery root not found: {root}")

    if root.is_file():
        candidates = [root]
        base = root.parent
    else:
        candidates = sorted(root.rglob("*") if recursive else root.iterdir())
        base = root

    files = [_describe(path, base) for path in candidates if path.is_file()]
    if formats is not None:
        allowed = set(formats)
        files = [item for item in files if item.format in allowed]
    return sorted(files, key=lambda item: item.relative_path)


def find_data_files(root: Path) -> list[DiscoveredFile]:
    """Return only files in recognised tabular/data formats."""
    return discover_files(root, formats=DATA_FORMATS)


def sha256_file(path: Path, *, chunk_size: int = 1024 * 1024) -> str:
    """Stream a file through SHA-256 without loading it entirely into memory."""
    if not path.is_file():
        raise FileNotFoundError(f"File not found: {path}")
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(chunk_size), b""):
            digest.update(chunk)
    return digest.hexdigest()


def checksum_line(path: Path, digest: str, root: Path | None = None) -> str:
    """Format one ``sha256sum``-compatible line with a relative path."""
    relative = path.relative_to(root).as_posix() if root is not None else path.as_posix()
    return f"{digest}  {relative}"
