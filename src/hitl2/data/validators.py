"""Schema, missing-value and coarse type validation for delimited datasets.

Validation is descriptive: it reports issues without modifying, filtering or
casting source data. No dataset-specific columns, labels or thresholds are
hard-coded here; expectations are supplied by the caller.
"""

from __future__ import annotations

import csv
from datetime import datetime
from enum import StrEnum
from pathlib import Path

from pydantic import BaseModel, ConfigDict, Field

from hitl2.data.loaders import DataFileNotFoundError, detect_delimiter

DEFAULT_SAMPLE_SIZE = 1000


class _StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class ColumnType(StrEnum):
    EMPTY = "empty"
    INTEGER = "integer"
    FLOAT = "float"
    BOOLEAN = "boolean"
    DATETIME = "datetime"
    STRING = "string"


class SchemaSpec(_StrictModel):
    """Optional caller-supplied expectations for a dataset.

    All fields are optional so that an uninspected dataset can still be
    profiled without inventing a schema.
    """

    expected_columns: list[str] | None = None
    required_columns: list[str] = Field(default_factory=list)
    expected_types: dict[str, ColumnType] = Field(default_factory=dict)
    max_missing_fraction: float = 1.0
    allow_extra_columns: bool = True


class ValidationIssue(_StrictModel):
    code: str
    message: str
    column: str | None = None


class ColumnProfile(_StrictModel):
    name: str
    inferred_type: ColumnType
    missing_values: int
    sampled_values: int


class ValidationResult(_StrictModel):
    path: str
    row_count: int
    columns: list[str]
    profiles: list[ColumnProfile]
    issues: list[ValidationIssue]

    @property
    def ok(self) -> bool:
        return not self.issues


def infer_type(value: str) -> ColumnType:
    """Infer a coarse type for one string value."""
    text = value.strip()
    if not text:
        return ColumnType.EMPTY
    if text.lower() in {"true", "false", "yes", "no"}:
        return ColumnType.BOOLEAN
    try:
        int(text)
        return ColumnType.INTEGER
    except ValueError:
        pass
    try:
        float(text)
        return ColumnType.FLOAT
    except ValueError:
        pass
    try:
        datetime.fromisoformat(text)
        return ColumnType.DATETIME
    except ValueError:
        return ColumnType.STRING


def infer_column_type(values: list[str]) -> ColumnType:
    """Infer one representative type for a column from sampled values."""
    seen = {
        inferred
        for inferred in (infer_type(value) for value in values)
        if inferred is not ColumnType.EMPTY
    }
    if not seen:
        return ColumnType.EMPTY
    if seen <= {ColumnType.INTEGER, ColumnType.FLOAT}:
        return ColumnType.FLOAT if ColumnType.FLOAT in seen else ColumnType.INTEGER
    if len(seen) == 1:
        return next(iter(seen))
    return ColumnType.STRING


def validate_csv(
    path: Path,
    spec: SchemaSpec | None = None,
    *,
    sample_size: int = DEFAULT_SAMPLE_SIZE,
    encoding: str = "utf-8",
    delimiter: str | None = None,
) -> ValidationResult:
    """Stream a delimited file and report structural validation issues.

    The source file is never modified. Every row and column is observed.
    Unlike the strict loader, the validator *reports* duplicate or ragged
    columns instead of raising, so a full profile can still be produced.
    """
    if not path.is_file():
        raise DataFileNotFoundError(f"Dataset file not found: {path}")

    expectations = spec or SchemaSpec()
    separator = delimiter or detect_delimiter(path)
    issues: list[ValidationIssue] = []

    with path.open("r", encoding=encoding, newline="") as handle:
        reader = csv.reader(handle, delimiter=separator)
        try:
            columns = next(reader)
        except StopIteration:
            columns = []

        if not columns:
            issues.append(ValidationIssue(code="no_columns", message="File has no header row"))
        if len(set(columns)) != len(columns):
            issues.append(
                ValidationIssue(
                    code="duplicate_column",
                    message="Header contains duplicate names",
                )
            )

        column_set = set(columns)
        for name in expectations.required_columns:
            if name not in column_set:
                issues.append(
                    ValidationIssue(
                        code="missing_required_column",
                        message=f"Required column {name!r} is absent",
                        column=name,
                    )
                )
        if expectations.expected_columns is not None:
            expected = set(expectations.expected_columns)
            for name in sorted(expected - column_set):
                issues.append(
                    ValidationIssue(
                        code="missing_expected_column",
                        message=f"Expected column {name!r} is absent",
                        column=name,
                    )
                )
            if not expectations.allow_extra_columns:
                for name in sorted(column_set - expected):
                    issues.append(
                        ValidationIssue(
                            code="unexpected_column",
                            message=f"Unexpected column {name!r} is present",
                            column=name,
                        )
                    )

        for name in expectations.expected_types:
            if name not in column_set:
                issues.append(
                    ValidationIssue(
                        code="unknown_type_column",
                        message=f"Expected type declared for absent column {name!r}",
                        column=name,
                    )
                )

        missing: dict[str, int] = {name: 0 for name in columns}
        samples: dict[str, list[str]] = {name: [] for name in columns}
        row_count = 0
        ragged_rows = 0

        for row in reader:
            row_count += 1
            if len(row) != len(columns):
                ragged_rows += 1
            for index, name in enumerate(columns):
                text = row[index] if index < len(row) else ""
                if not text.strip():
                    missing[name] += 1
                elif len(samples[name]) < sample_size:
                    samples[name].append(text)

        if ragged_rows:
            issues.append(
                ValidationIssue(
                    code="ragged_row",
                    message=f"{ragged_rows} row(s) have a different field count than the header",
                )
            )

    profiles: list[ColumnProfile] = []
    for name in columns:
        inferred = infer_column_type(samples[name])
        profiles.append(
            ColumnProfile(
                name=name,
                inferred_type=inferred,
                missing_values=missing[name],
                sampled_values=len(samples[name]),
            )
        )
        declared = expectations.expected_types.get(name)
        if declared is not None and inferred is not ColumnType.EMPTY and inferred != declared:
            issues.append(
                ValidationIssue(
                    code="column_type_mismatch",
                    message=f"Column {name!r} inferred as {inferred}, expected {declared}",
                    column=name,
                )
            )
        if row_count and missing[name] / row_count > expectations.max_missing_fraction:
            issues.append(
                ValidationIssue(
                    code="missing_value_threshold",
                    message=(
                        f"Column {name!r} has missing fraction "
                        f"{missing[name] / row_count:.3f} above allowed "
                        f"{expectations.max_missing_fraction:.3f}"
                    ),
                    column=name,
                )
            )

    return ValidationResult(
        path=str(path),
        row_count=row_count,
        columns=columns,
        profiles=profiles,
        issues=issues,
    )
