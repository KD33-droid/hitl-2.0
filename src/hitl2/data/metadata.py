"""Typed provenance metadata for local research datasets.

The registry records where data came from, under which license, and whether
files were actually present locally. It deliberately does not describe dataset
schemas, model features or research results.
"""

from __future__ import annotations

from enum import StrEnum
from pathlib import Path

import yaml
from pydantic import BaseModel, ConfigDict, Field

DEFAULT_METADATA_PATH = Path("data/metadata/datasets.yaml")


class _StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class FileRole(StrEnum):
    DATA = "data"
    DOCUMENTATION = "documentation"
    LICENSE = "license"
    METADATA = "metadata"
    ARCHIVE = "archive"


class DatasetFile(_StrictModel):
    """A single file recorded in the provenance registry."""

    path: str
    role: FileRole
    format: str
    size_bytes: int | None = None
    sha256: str | None = None


class SourceArchive(_StrictModel):
    """The local archive from which files were obtained, if any."""

    filename: str
    path: str
    sha256: str


class DatasetSource(_StrictModel):
    """Upstream source references for a dataset."""

    repository: str | None = None
    competition: str | None = None
    snapshot_commit: str | None = None
    snapshot_date: str | None = None
    snapshot_commit_message: str | None = None
    dataset_sources: list[str] = Field(default_factory=list)
    source_archive: SourceArchive | None = None


class Retrieval(_StrictModel):
    date: str
    method: str


class LicenseInfo(_StrictModel):
    """License distinction: repository software vs. actual dataset."""

    repository: str | None = None
    repository_license_file: str | None = None
    data: str
    data_license_reference: str | None = None
    distinction: str | None = None


class Redistribution(_StrictModel):
    raw_data_committed: bool
    raw_data_in_repository: bool | None = None
    notes: str | None = None


class DatasetMetadata(_StrictModel):
    """Provenance record for one dataset."""

    id: str
    name: str
    status: str
    source: DatasetSource
    retrieval: Retrieval
    license: LicenseInfo
    redistribution: Redistribution
    local_path: str
    data_files_present: bool
    supported_formats: list[str] = Field(default_factory=list)
    files: list[DatasetFile] = Field(default_factory=list)
    notes: list[str] = Field(default_factory=list)


class DatasetRegistry(_StrictModel):
    """Top-level registry loaded from ``data/metadata/datasets.yaml``."""

    schema_version: int
    generated_on: str
    datasets: list[DatasetMetadata]

    def get(self, dataset_id: str) -> DatasetMetadata:
        """Return one dataset record, raising ``KeyError`` for unknown ids."""
        for dataset in self.datasets:
            if dataset.id == dataset_id:
                return dataset
        raise KeyError(f"Unknown dataset id: {dataset_id!r}")


def load_registry(path: Path | None = None) -> DatasetRegistry:
    """Load and validate the YAML provenance registry.

    Args:
        path: Registry location. Defaults to ``data/metadata/datasets.yaml``
            relative to the current working directory (the repository root).

    Raises:
        FileNotFoundError: If the registry file does not exist.
        ValidationError: If the YAML content does not match the registry schema.
    """
    registry_path = path or DEFAULT_METADATA_PATH
    if not registry_path.is_file():
        raise FileNotFoundError(f"Dataset metadata file not found: {registry_path}")
    with registry_path.open("r", encoding="utf-8") as handle:
        payload = yaml.safe_load(handle)
    return DatasetRegistry.model_validate(payload)
