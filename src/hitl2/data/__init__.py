"""Dataset discovery, loading, validation and preprocessing infrastructure.

This package operates on local files only. It does not download data, define
features, train models or implement any governance mechanism.
"""

from hitl2.data.discovery import (
    DatasetFormat,
    DiscoveredFile,
    detect_format,
    discover_files,
    sha256_file,
)
from hitl2.data.loaders import iter_csv_chunks, read_header
from hitl2.data.metadata import DatasetRegistry, load_registry
from hitl2.data.preprocessing import transform_csv
from hitl2.data.validators import validate_csv

__all__ = [
    "DatasetFormat",
    "DatasetRegistry",
    "DiscoveredFile",
    "detect_format",
    "discover_files",
    "iter_csv_chunks",
    "load_registry",
    "read_header",
    "sha256_file",
    "transform_csv",
    "validate_csv",
]
