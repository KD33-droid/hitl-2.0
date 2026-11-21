#!/usr/bin/env python3
"""Validate the 12 HITL 2.0 literature-review registers against register-schemas.md.

This is a local, workstream-internal tool authorised by Stage 1B.6
(decision-log.md §8). It reads register CSVs and documentation only; it never
writes register data, runs searches or creates research records.

Usage (from any working directory):
    python3 tools/validate_registers.py
    python3 tools/validate_registers.py --self-test
"""

from __future__ import annotations

import argparse
import csv
import re
import sys
from collections import Counter
from datetime import datetime
from pathlib import Path

WORKSTREAM = Path(__file__).resolve().parents[1]
DATA_DIR = WORKSTREAM / "data"
SCHEMA_DOC = WORKSTREAM / "register-schemas.md"
METHODOLOGY_DOC = WORKSTREAM / "methodology.md"

# Exact headers and ordering, transcribed from register-schemas.md §§1–12.
EXPECTED_HEADERS: dict[str, tuple[str, ...]] = {
    "papers.csv": (
        "lit_id",
        "tier",
        "title",
        "authors",
        "abstract",
        "year",
        "venue",
        "publication_type",
        "doi",
        "doi_status",
        "verification_method",
        "verification_status",
        "access_status",
        "access_flag",
        "area_tags",
        "component_tags",
        "gate_tags",
        "included",
        "exclusion_code",
        "primary_source_url",
        "notes",
    ),
    "screening-register.csv": (
        "record_id",
        "lit_id",
        "source_database",
        "search_id",
        "raw_title",
        "raw_authors",
        "raw_year",
        "abstract_text",
        "abstract_source",
        "abstract_retrieved_at_utc",
        "abstract_provenance_status",
        "dedupe_group_id",
        "pass1_decision",
        "pass1_reason_code",
        "pass1_date",
        "pass2_decision",
        "pass2_reason_code",
        "pass2_date",
        "full_text_access",
        "access_flag",
        "final_status",
        "final_exclusion_code",
        "reviewer",
        "notes",
    ),
    "verification-register.csv": (
        "lit_id",
        "doi",
        "doi_resolution_checked",
        "doi_resolution_result",
        "publisher_metadata_match",
        "authoritative_records",
        "verification_method",
        "verification_status",
        "version_of_record_url",
        "version_of_record_linked",
        "verification_date",
        "citation_count",
        "citation_count_source",
        "citation_count_snapshot_date",
        "citation_context",
        "code_availability",
        "notes",
    ),
    "evaluation-matrix.csv": (
        "lit_id",
        "access_status",
        "paper_type",
        "raw_relevance",
        "raw_technical",
        "raw_evidence",
        "raw_novelty",
        "raw_practical",
        "raw_credibility",
        "just_relevance",
        "just_technical",
        "just_evidence",
        "just_novelty",
        "just_practical",
        "just_credibility",
        "score_relevance",
        "score_technical",
        "score_evidence",
        "score_novelty",
        "score_practical",
        "score_credibility",
        "score_total",
        "score_date",
        "rescore_date",
        "rescore_delta",
        "citation_count",
        "datasets_benchmarks",
        "code_availability",
        "limitations_reported",
        "conflicts_with_hitl2_assumptions",
        "disconfirming_evidence_flag",
        "reusable_mechanisms",
        "top25",
        "top10",
        "notes",
    ),
    "authoritative-register.csv": (
        "auth_id",
        "report_id",
        "title",
        "issuing_body",
        "document_type",
        "version_or_revision",
        "publication_date",
        "official_url",
        "authoritative_records",
        "verification_status",
        "verification_date",
        "area_tags",
        "component_tags",
        "gate_tags",
        "used_for",
        "counted_in_100",
        "notes",
    ),
    "record-report-links.csv": (
        "link_id",
        "record_id",
        "report_id",
        "link_type",
        "conversion_status",
        "link_status",
        "discovery_origin",
        "search_id",
        "linked_date_utc",
        "verified_by",
        "verification_date_utc",
        "evidence_note",
        "notes",
    ),
    "reports.csv": (
        "report_id",
        "lit_id",
        "report_type",
        "report_role",
        "title",
        "authors",
        "year",
        "venue",
        "publisher",
        "doi",
        "source_url",
        "peer_review_status",
        "flow_state",
        "retry_count",
        "assessment_complete",
        "assessment_outcome",
        "exclusion_stage",
        "exclusion_reason",
        "grouping_status",
        "tier",
        "notes",
    ),
    "report-dates.csv": (
        "date_id",
        "report_id",
        "date_kind",
        "date_value",
        "date_precision",
        "is_preferred",
        "version_label",
        "source",
        "source_platform",
        "retrieved_date_utc",
        "certainty",
        "superseded_by",
        "notes",
    ),
    "report-relationships.csv": (
        "relationship_id",
        "source_report_id",
        "target_report_id",
        "relationship_type",
        "direction",
        "status",
        "evidence",
        "verified_by",
        "verification_date_utc",
        "notes",
    ),
    "report-state-history.csv": (
        "history_id",
        "report_id",
        "event_type",
        "from_state",
        "to_state",
        "transition_date_utc",
        "actor",
        "requested_by",
        "request_date_utc",
        "authorised_by",
        "authorisation_date_utc",
        "authorisation_expires_at_utc",
        "authorisation_history_id",
        "request_status",
        "exception_type",
        "justification",
        "reason_code",
        "replaces_history_id",
        "correction_of",
        "evidence_note",
        "prisma_snapshot_id",
        "notes",
    ),
    "prisma-snapshots.csv": (
        "snapshot_id",
        "snapshot_date_utc",
        "label",
        *(f"category_{index}" for index in range(1, 14)),
        "unresolved_mapping_count",
        "uncertain_grouping_count",
        "source_checksum",
        "status",
        "superseded_by",
        "notes",
    ),
    "source-identifiers.csv": (
        "map_id",
        "lit_id",
        "source_platform",
        "identifier_type",
        "identifier_value",
        "retrieval_search_id",
        "retrieved_date_utc",
        "verification_status",
        "relation_type",
        "notes",
    ),
}

ENUMS: dict[str, dict[str, frozenset[str]]] = {
    "papers.csv": {
        "tier": frozenset({"A"}),
        "publication_type": frozenset(
            {"journal_article", "conference_paper", "peer_reviewed_workshop", "review"}
        ),
        "doi_status": frozenset(
            {"VERIFIED_RESOLVING", "VERIFIED_METADATA_ONLY", "NOT_AVAILABLE", "UNVERIFIED"}
        ),
        "verification_method": frozenset({"DOI_METADATA", "AUTHORITATIVE_RECORD", "COMBINED"}),
        "verification_status": frozenset({"VERIFIED", "PARTIALLY_VERIFIED", "UNVERIFIED"}),
        "access_status": frozenset(
            {
                "IDENTIFIED",
                "ABSTRACT_ACCESSED",
                "FULL_TEXT_ACCESSED",
                "FULL_TEXT_REVIEWED",
                "EXCLUDED",
            }
        ),
        "access_flag": frozenset({"NONE", "FULL_TEXT_UNAVAILABLE", "PAYWALLED"}),
        "area_tags": frozenset({str(index) for index in range(1, 8)}),
        "component_tags": frozenset(
            {
                "agentic_security",
                "human_oversight",
                "risk_scoring",
                "policy_enforcement",
                "dynamic_constraint_walls",
                "audit_integrity",
                "evaluation_methodology",
            }
        ),
        "gate_tags": frozenset({f"G{index}" for index in range(1, 7)}),
        "included": frozenset({"YES", "NO"}),
    },
    "screening-register.csv": {
        "abstract_source": frozenset({"PUBLISHER", "REPOSITORY", "VERIFIED_METADATA", "NONE"}),
        "abstract_provenance_status": frozenset(
            {"VERIFIED", "PARTIAL", "UNVERIFIED", "UNAVAILABLE"}
        ),
        "pass1_decision": frozenset({"INCLUDE", "EXCLUDE", "UNCERTAIN"}),
        "pass2_decision": frozenset({"INCLUDE", "EXCLUDE", "NOT_APPLICABLE"}),
        "full_text_access": frozenset({"YES", "NO"}),
        "access_flag": frozenset({"NONE", "FULL_TEXT_UNAVAILABLE", "PAYWALLED"}),
    },
    "verification-register.csv": {
        "doi_resolution_checked": frozenset({"YES", "NO", "NOT_APPLICABLE"}),
        "doi_resolution_result": frozenset(
            {"RESOLVES_TO_PUBLISHER", "RESOLVES_TO_PREPRINT", "BROKEN", "NOT_AVAILABLE"}
        ),
        "publisher_metadata_match": frozenset({"MATCH", "PARTIAL", "MISMATCH", "NOT_AVAILABLE"}),
        "verification_method": frozenset({"DOI_METADATA", "AUTHORITATIVE_RECORD", "COMBINED"}),
        "verification_status": frozenset({"VERIFIED", "PARTIALLY_VERIFIED", "UNVERIFIED"}),
        "version_of_record_linked": frozenset({"YES", "NO", "NOT_APPLICABLE"}),
        "citation_context": frozenset(
            {"FOUNDATIONAL", "SUPPORTING", "NEUTRAL", "CONTRADICTED", "UNASSESSED"}
        ),
        "code_availability": frozenset({"OPEN", "LINKED", "NOT_AVAILABLE", "UNKNOWN"}),
    },
    "evaluation-matrix.csv": {
        "paper_type": frozenset({"EMPIRICAL", "FORMAL", "STANDARD", "CONCEPTUAL", "SURVEY"}),
        "code_availability": frozenset({"OPEN", "LINKED", "NOT_AVAILABLE", "UNKNOWN"}),
        "disconfirming_evidence_flag": frozenset({"YES", "NO"}),
        "top25": frozenset({"YES", "NO"}),
        "top10": frozenset({"YES", "NO"}),
    },
    "authoritative-register.csv": {
        "document_type": frozenset(
            {
                "standard",
                "framework",
                "technical_report",
                "guidance",
                "threat_catalogue",
                "regulation",
                "methodology",
            }
        ),
        "verification_status": frozenset({"VERIFIED", "PARTIALLY_VERIFIED", "UNVERIFIED"}),
        "used_for": frozenset(
            {
                "framing",
                "control_candidate",
                "threat_lens",
                "evaluation_context",
                "methodology",
            }
        ),
        "counted_in_100": frozenset({"NO"}),
        "area_tags": frozenset({str(index) for index in range(1, 8)}),
        "component_tags": frozenset(
            {
                "agentic_security",
                "human_oversight",
                "risk_scoring",
                "policy_enforcement",
                "dynamic_constraint_walls",
                "audit_integrity",
                "evaluation_methodology",
            }
        ),
        "gate_tags": frozenset({f"G{index}" for index in range(1, 7)}),
    },
    "record-report-links.csv": {
        "link_type": frozenset(
            {"DIRECT", "DUPLICATE_ROUTE", "VOLUME_CONTAINS", "CITATION_CHASING", "UNCERTAIN"}
        ),
        "conversion_status": frozenset({"ONE_TO_ONE", "MANY_TO_ONE", "ONE_TO_MANY", "UNRESOLVED"}),
        "link_status": frozenset(
            {"UNRESOLVED", "CANDIDATE", "CONFIRMED", "CONFIRMED_EXCEPTION", "REJECTED"}
        ),
        "discovery_origin": frozenset({"DATABASE", "OTHER_METHOD", "CITATION_CHASING"}),
    },
    "reports.csv": {
        "report_type": frozenset(
            {
                "journal_article",
                "conference_paper",
                "peer_reviewed_workshop",
                "review",
                "preprint",
                "technical_report",
                "standard",
                "other_document",
            }
        ),
        "report_role": frozenset(
            {
                "PRIMARY",
                "VERSION_OF_RECORD",
                "PREPRINT",
                "EXTENDED_VERSION",
                "FOLLOWUP",
                "COMPANION",
                "UNKNOWN",
            }
        ),
        "peer_review_status": frozenset({"VERIFIED", "NOT_VERIFIED", "NOT_APPLICABLE", "UNKNOWN"}),
        "flow_state": frozenset(
            {
                "NOT_SOUGHT",
                "SOUGHT",
                "OBTAINED",
                "ASSESSMENT_PENDING",
                "ASSESSED",
                "ASSESSMENT_INDETERMINATE",
                "INCLUDED",
                "EXCLUDED",
                "UNAVAILABLE",
                "PAYWALLED",
                "UNCERTAIN_GROUPING",
            }
        ),
        "assessment_complete": frozenset({"YES", "NO"}),
        "assessment_outcome": frozenset(
            {"ELIGIBLE", "INELIGIBLE", "INDETERMINATE", "NOT_ASSESSED"}
        ),
        "exclusion_stage": frozenset({"FULL_TEXT", "NONE"}),
        "grouping_status": frozenset({"CONFIDENT", "UNCERTAIN", "UNASSIGNED"}),
        "tier": frozenset({"A", "B", "PREPRINT", "UNCLASSIFIED"}),
    },
    "report-dates.csv": {
        "date_kind": frozenset(
            {
                "PUBLICATION",
                "ONLINE_FIRST",
                "ISSUE_PUBLICATION",
                "REPOSITORY_SUBMISSION",
                "PREPRINT_VERSION",
                "OTHER",
            }
        ),
        "date_precision": frozenset({"YEAR", "MONTH", "DAY"}),
        "is_preferred": frozenset({"YES", "NO"}),
        "certainty": frozenset({"VERIFIED", "REPORTED", "INFERRED", "UNKNOWN"}),
    },
    "report-relationships.csv": {
        "relationship_type": frozenset(
            {
                "PREPRINT_OF",
                "VERSION_OF",
                "EXTENDED_VERSION_OF",
                "FOLLOWUP_TO",
                "COMPANION_TO",
                "UNCERTAIN",
            }
        ),
        "direction": frozenset({"FORWARD", "SYMMETRIC"}),
        "status": frozenset({"PENDING", "CONFIRMED", "UNCERTAIN", "CONFLICTED", "REJECTED"}),
    },
    "report-state-history.csv": {
        "event_type": frozenset(
            {
                "STATE_TRANSITION",
                "RETRY_FAILURE",
                "RETRY_NORMAL",
                "RETRY_EXCEPTION_REQUEST",
                "RETRY_EXCEPTION_DECISION",
                "RETRY_EXCEPTION_EXECUTED",
                "RETRY_EXCEPTION_EXPIRED",
                "REASSESS_OPENED",
                "ASSESSMENT_COMPLETED",
                "ASSESSMENT_INDETERMINATE",
                "CORRECTION",
            }
        ),
        "request_status": frozenset({"PENDING", "ACCEPTED", "REJECTED", "NOT_APPLICABLE"}),
        "exception_type": frozenset({"RETRY_LIMIT_OVERRIDE", "NOT_APPLICABLE"}),
    },
    "prisma-snapshots.csv": {
        "status": frozenset({"DRAFT", "FROZEN", "SUPERSEDED"}),
    },
    "source-identifiers.csv": {
        "identifier_type": frozenset(
            {
                "doi",
                "openalex_id",
                "crossref_record_id",
                "semantic_scholar_id",
                "arxiv_id",
                "datacite_id",
                "dblp_key",
                "url_handle",
                "other",
            }
        ),
        "relation_type": frozenset(
            {"SAME_IDENTITY", "DIFFERENT_WORK", "VOLUME_OF_ITEM", "UNCERTAIN_IDENTITY"}
        ),
    },
}

SINGLE_VALUE_LISTS = frozenset({"area_tags", "component_tags", "gate_tags", "used_for"})

ID_PATTERNS: dict[str, dict[str, str]] = {
    "papers.csv": {"lit_id": r"LIT-\d{3}"},
    "screening-register.csv": {
        "record_id": r"REC-\d{4}",
        "lit_id": r"LIT-\d{3}",
        "dedupe_group_id": r"DUP-\d{3}",
    },
    "verification-register.csv": {"lit_id": r"LIT-\d{3}"},
    "evaluation-matrix.csv": {"lit_id": r"LIT-\d{3}"},
    "authoritative-register.csv": {"auth_id": r"AUTH-\d{3}", "report_id": r"REP-\d{4}"},
    "record-report-links.csv": {
        "link_id": r"LRL-\d{4}",
        "record_id": r"REC-\d{4}",
        "report_id": r"REP-\d{4}",
        "search_id": r"S-\d{2}",
    },
    "reports.csv": {"report_id": r"REP-\d{4}", "lit_id": r"LIT-\d{3}"},
    "report-dates.csv": {"date_id": r"RDT-\d{4}", "report_id": r"REP-\d{4}"},
    "report-relationships.csv": {
        "relationship_id": r"REL-\d{4}",
        "source_report_id": r"REP-\d{4}",
        "target_report_id": r"REP-\d{4}",
    },
    "report-state-history.csv": {
        "history_id": r"HST-\d{4}",
        "report_id": r"REP-\d{4}",
        "authorisation_history_id": r"HST-\d{4}",
        "replaces_history_id": r"HST-\d{4}",
        "correction_of": r"HST-\d{4}",
        "prisma_snapshot_id": r"PS-\d{3}",
    },
    "prisma-snapshots.csv": {"snapshot_id": r"PS-\d{3}", "superseded_by": r"PS-\d{3}"},
    "source-identifiers.csv": {"map_id": r"MAP-\d{4}", "lit_id": r"LIT-\d{3}"},
}

SCORE_FIELDS = {
    "score_relevance": ("raw_relevance", 25),
    "score_technical": ("raw_technical", 20),
    "score_evidence": ("raw_evidence", 20),
    "score_novelty": ("raw_novelty", 15),
    "score_practical": ("raw_practical", 10),
    "score_credibility": ("raw_credibility", 10),
}
JUSTIFICATION_FIELDS = tuple(
    f"just_{raw.removeprefix('raw_')}" for raw, _weight in SCORE_FIELDS.values()
)
RAW_FIELDS = tuple(info[0] for info in SCORE_FIELDS.values())

# Required fields are transcribed from the "Required" columns in
# register-schemas.md §§1–7; §§8–12 define prose field lists, so only fields
# identified as keys/required by their constraints are marked required here.
REQUIRED: dict[str, frozenset[str]] = {
    "papers.csv": frozenset(
        {
            "lit_id",
            "tier",
            "title",
            "authors",
            "year",
            "venue",
            "publication_type",
            "doi_status",
            "verification_method",
            "verification_status",
            "access_status",
            "access_flag",
            "area_tags",
            "component_tags",
            "gate_tags",
            "included",
            "primary_source_url",
        }
    ),
    "screening-register.csv": frozenset(
        {
            "record_id",
            "source_database",
            "search_id",
            "raw_title",
            "abstract_source",
            "abstract_provenance_status",
            "pass1_decision",
            "pass1_date",
            "pass2_decision",
            "full_text_access",
            "access_flag",
            "final_status",
            "reviewer",
        }
    ),
    "verification-register.csv": frozenset(
        {
            "lit_id",
            "doi_resolution_checked",
            "doi_resolution_result",
            "publisher_metadata_match",
            "authoritative_records",
            "verification_method",
            "verification_status",
            "version_of_record_linked",
            "verification_date",
            "citation_count",
            "citation_count_source",
            "citation_count_snapshot_date",
            "citation_context",
            "code_availability",
        }
    ),
    "evaluation-matrix.csv": frozenset(
        {
            "lit_id",
            "access_status",
            "paper_type",
            *RAW_FIELDS,
            *JUSTIFICATION_FIELDS,
            *SCORE_FIELDS,
            "score_total",
            "score_date",
            "citation_count",
            "code_availability",
            "disconfirming_evidence_flag",
            "top25",
            "top10",
        }
    ),
    "authoritative-register.csv": frozenset(
        {
            "auth_id",
            "report_id",
            "title",
            "issuing_body",
            "document_type",
            "official_url",
            "authoritative_records",
            "verification_status",
            "verification_date",
            "used_for",
            "counted_in_100",
        }
    ),
    "record-report-links.csv": frozenset(
        {
            "link_id",
            "record_id",
            "link_type",
            "conversion_status",
            "link_status",
            "discovery_origin",
            "search_id",
            "linked_date_utc",
        }
    ),
    "reports.csv": frozenset(
        {
            "report_id",
            "report_type",
            "report_role",
            "title",
            "authors",
            "peer_review_status",
            "flow_state",
            "retry_count",
            "assessment_complete",
            "assessment_outcome",
            "exclusion_stage",
            "grouping_status",
            "tier",
        }
    ),
    "report-dates.csv": frozenset(
        {"date_id", "report_id", "date_kind", "date_value", "date_precision", "is_preferred"}
    ),
    "report-relationships.csv": frozenset(
        {
            "relationship_id",
            "source_report_id",
            "target_report_id",
            "relationship_type",
            "direction",
            "status",
        }
    ),
    "report-state-history.csv": frozenset(
        {
            "history_id",
            "report_id",
            "event_type",
            "transition_date_utc",
            "actor",
            "request_status",
            "exception_type",
        }
    ),
    "prisma-snapshots.csv": frozenset(
        {
            "snapshot_id",
            "snapshot_date_utc",
            "label",
            *(f"category_{index}" for index in range(1, 14)),
            "unresolved_mapping_count",
            "uncertain_grouping_count",
            "source_checksum",
            "status",
        }
    ),
    "source-identifiers.csv": frozenset(
        {
            "map_id",
            "lit_id",
            "source_platform",
            "identifier_type",
            "identifier_value",
            "retrieval_search_id",
            "retrieved_date_utc",
            "verification_status",
            "relation_type",
        }
    ),
}

DATE_FIELDS = frozenset(
    {
        "pass1_date",
        "pass2_date",
        "verification_date",
        "citation_count_snapshot_date",
        "score_date",
        "rescore_date",
        "publication_date",
        "linked_date_utc",
        "verification_date_utc",
        "transition_date_utc",
        "request_date_utc",
        "authorisation_date_utc",
        "authorisation_expires_at_utc",
        "retrieved_date_utc",
        "snapshot_date_utc",
    }
)
TIMESTAMP_FIELDS = frozenset({"abstract_retrieved_at_utc"})
NON_NEGATIVE_INT_FIELDS = frozenset(
    {
        "year",
        "retry_count",
        "citation_count",
        "raw_relevance",
        "raw_technical",
        "raw_evidence",
        "raw_novelty",
        "raw_practical",
        "raw_credibility",
        *(f"category_{index}" for index in range(1, 14)),
        "unresolved_mapping_count",
        "uncertain_grouping_count",
    }
)
# Selective field-coverage inventory from register-schemas.md §13.
SCHEMA_COVERAGE_FIELDS = (
    "flow_state",
    "retry_count",
    "assessment_complete",
    "assessment_outcome",
    "exclusion_stage",
    "exclusion_reason",
    "grouping_status",
    "tier",
    "peer_review_status",
    "conversion_status",
    "replaces_history_id",
    "exception_type",
    "authorisation_expires_at_utc",
    "authorisation_history_id",
)
# The subset of those fields that methodology.md explicitly names; the other
# four are schema refinements introduced by the Stage 1B.5 audits.
METHODOLOGY_FIELDS = (
    "flow_state",
    "retry_count",
    "assessment_complete",
    "assessment_outcome",
    "exclusion_stage",
    "grouping_status",
    "tier",
    "replaces_history_id",
    "authorisation_expires_at_utc",
    "authorisation_history_id",
)
METHODOLOGY_REGISTERS = (
    "papers.csv",
    "screening-register.csv",
    "authoritative-register.csv",
    "report-dates.csv",
    "reports.csv",
)

ERRORS: list[str] = []


def fail(message: str) -> None:
    ERRORS.append(message)


def read_register(name: str) -> tuple[list[str], list[dict[str, str]]]:
    path = DATA_DIR / name
    if not path.is_file():
        fail(f"{name}: missing register file")
        return [], []
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.reader(handle)
        try:
            header = next(reader)
        except StopIteration:
            fail(f"{name}: empty file (no header)")
            return [], []
        rows: list[dict[str, str]] = []
        for line_number, values in enumerate(reader, start=2):
            if not values:
                fail(f"{name}:{line_number}: blank row")
                continue
            if len(values) != len(header):
                fail(
                    f"{name}:{line_number}: ragged row "
                    f"(expected {len(header)} fields, got {len(values)})"
                )
                continue
            rows.append(dict(zip(header, values, strict=True)))
    return header, rows


def check_headers(headers: dict[str, list[str]]) -> None:
    for name, expected in EXPECTED_HEADERS.items():
        actual = headers.get(name, [])
        if not actual:
            continue
        duplicates = [field for field, count in Counter(actual).items() if count > 1]
        if duplicates:
            fail(f"{name}: duplicate header fields: {duplicates}")
        if tuple(actual) != expected:
            missing = [field for field in expected if field not in actual]
            extra = [field for field in actual if field not in expected]
            fail(
                f"{name}: header mismatch; missing={missing}, extra={extra}, "
                f"order_correct={[f for f in actual if f in expected] == list(expected)}"
            )


def check_row_types(name: str, rows: list[dict[str, str]]) -> None:
    for line_number, row in enumerate(rows, start=2):
        for field, required in REQUIRED[name].items():
            if required and not row[field].strip():
                fail(f"{name}:{line_number}: required field {field!r} is empty")
        for field, allowed in ENUMS.get(name, {}).items():
            value = row[field].strip()
            if value and value not in allowed:
                fail(f"{name}:{line_number}: {field}={value!r} not in schema vocabulary")
            if SINGLE_VALUE_LISTS and field in SINGLE_VALUE_LISTS and value:
                for item in value.split(";"):
                    if item not in allowed:
                        fail(f"{name}:{line_number}: {field} list item {item!r} invalid")
        for field, pattern in ID_PATTERNS.get(name, {}).items():
            value = row[field].strip()
            if value and not re.fullmatch(pattern, value):
                fail(f"{name}:{line_number}: {field}={value!r} violates {pattern}")
        for field in DATE_FIELDS & row.keys():
            value = row[field].strip()
            if not value:
                continue
            valid = False
            for fmt in ("%Y-%m-%d", "%Y-%m"):
                try:
                    datetime.strptime(value, fmt)
                    valid = True
                    break
                except ValueError:
                    continue
            if field.endswith("_utc") and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
                valid = False
            if not valid:
                fail(f"{name}:{line_number}: {field}={value!r} is not an ISO date")
        for field in TIMESTAMP_FIELDS & row.keys():
            value = row[field].strip()
            if value and not re.fullmatch(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z", value):
                fail(f"{name}:{line_number}: {field}={value!r} is not a UTC timestamp")
        for field in NON_NEGATIVE_INT_FIELDS & row.keys():
            value = row[field].strip()
            if not value or value == "unavailable":
                continue
            if not re.fullmatch(r"\d+", value):
                fail(f"{name}:{line_number}: {field}={value!r} is not a non-negative integer")


def check_conditional_rules(rows: dict[str, list[dict[str, str]]]) -> None:
    for line_number, row in enumerate(rows["papers.csv"], start=2):
        context = f"papers.csv:{line_number}"
        included = row["included"]
        if included == "YES":
            if row["exclusion_code"]:
                fail(f"{context}: included = YES requires empty exclusion_code")
            if row["verification_status"] == "UNVERIFIED":
                fail(f"{context}: included study cannot be UNVERIFIED")
        elif included == "NO" and not row["exclusion_code"]:
            fail(f"{context}: included = NO requires a non-empty exclusion_code")
        if not row["doi"] and row["verification_method"] == "DOI_METADATA":
            fail(f"{context}: empty doi forbids verification_method = DOI_METADATA")

    for line_number, row in enumerate(rows["screening-register.csv"], start=2):
        context = f"screening-register.csv:{line_number}"
        has_abstract = bool(row["abstract_text"].strip())
        source = row["abstract_source"]
        retrieved = row["abstract_retrieved_at_utc"]
        provenance = row["abstract_provenance_status"]
        if has_abstract:
            if source not in {"PUBLISHER", "REPOSITORY", "VERIFIED_METADATA"}:
                fail(f"{context}: abstract present but abstract_source invalid")
            if not retrieved:
                fail(f"{context}: abstract present but abstract_retrieved_at_utc empty")
            if provenance not in {"VERIFIED", "PARTIAL", "UNVERIFIED"}:
                fail(f"{context}: abstract present but provenance status invalid")
        else:
            if source != "NONE" or retrieved or provenance != "UNAVAILABLE":
                fail(f"{context}: no abstract requires NONE/empty/UNAVAILABLE")
        if row["pass1_decision"] == "EXCLUDE" and not row["pass1_reason_code"]:
            fail(f"{context}: pass1 EXCLUDE requires pass1_reason_code")
        if row["pass2_decision"] == "EXCLUDE" and not row["pass2_reason_code"]:
            fail(f"{context}: pass2 EXCLUDE requires pass2_reason_code")
        if (row["final_status"] == "EXCLUDED") != bool(row["final_exclusion_code"]):
            fail(f"{context}: final_status EXCLUDED iff final_exclusion_code present")

    for line_number, row in enumerate(rows["verification-register.csv"], start=2):
        context = f"verification-register.csv:{line_number}"
        if not row["doi"]:
            if not row["authoritative_records"]:
                fail(f"{context}: empty doi requires authoritative_records")
            if row["doi_resolution_checked"] != "NOT_APPLICABLE":
                fail(f"{context}: empty doi requires doi_resolution_checked = NOT_APPLICABLE")

    for line_number, row in enumerate(rows["evaluation-matrix.csv"], start=2):
        context = f"evaluation-matrix.csv:{line_number}"
        if row["access_status"] != "FULL_TEXT_REVIEWED":
            fail(f"{context}: scoring requires access_status = FULL_TEXT_REVIEWED")
        for field in JUSTIFICATION_FIELDS:
            if not row[field].strip():
                fail(f"{context}: {field} must contain a locator or rationale")
        for score_field, (raw_field, weight) in SCORE_FIELDS.items():
            try:
                raw = int(row[raw_field])
                actual = float(row[score_field])
            except ValueError:
                continue
            expected = raw / 5 * weight
            if abs(actual - expected) > 1e-9:
                fail(f"{context}: {score_field} must equal {raw_field}/5*{weight}")
        try:
            total = float(row["score_total"])
            calculated = sum(float(row[field]) for field in SCORE_FIELDS)
            if abs(total - calculated) > 1e-9:
                fail(f"{context}: score_total must equal the sum of the six scores")
        except ValueError:
            pass
        if row["top10"] == "YES" and row["top25"] != "YES":
            fail(f"{context}: top10 = YES requires top25 = YES")

    for line_number, row in enumerate(rows["authoritative-register.csv"], start=2):
        if row["counted_in_100"] != "NO":
            fail(f"authoritative-register.csv:{line_number}: counted_in_100 must be NO")

    confirmed_by_record: Counter[str] = Counter()
    link_keys: set[tuple[str, str]] = set()
    for line_number, row in enumerate(rows["record-report-links.csv"], start=2):
        context = f"record-report-links.csv:{line_number}"
        if not row["report_id"] and row["link_status"] not in {"UNRESOLVED", "REJECTED"}:
            fail(f"{context}: empty report_id only legal for UNRESOLVED/REJECTED")
        if row["conversion_status"] == "ONE_TO_MANY" and not row["evidence_note"]:
            fail(f"{context}: ONE_TO_MANY requires evidence_note")
        if row["link_status"] == "CONFIRMED_EXCEPTION" and not row["evidence_note"]:
            fail(f"{context}: CONFIRMED_EXCEPTION requires evidence_note")
        if row["link_status"] == "CONFIRMED":
            confirmed_by_record[row["record_id"]] += 1
        key = (row["record_id"], row["report_id"])
        if key in link_keys:
            fail(f"{context}: duplicate (record_id, report_id) pair")
        link_keys.add(key)
    for record_id, count in confirmed_by_record.items():
        if count > 1:
            fail(f"record-report-links.csv: record {record_id} has {count} CONFIRMED links")

    for line_number, row in enumerate(rows["reports.csv"], start=2):
        context = f"reports.csv:{line_number}"
        exclusion_stage = row["exclusion_stage"]
        if exclusion_stage == "TITLE_ABSTRACT":
            fail(f"{context}: report-level TITLE_ABSTRACT exclusion is invalid (AUD-08)")
        if not row["lit_id"] and row["grouping_status"] not in {"UNCERTAIN", "UNASSIGNED"}:
            fail(f"{context}: empty lit_id requires UNCERTAIN or UNASSIGNED grouping")
        if row["flow_state"] == "EXCLUDED":
            if exclusion_stage != "FULL_TEXT" or not row["exclusion_reason"]:
                fail(f"{context}: report EXCLUDED requires FULL_TEXT stage and reason")

    date_keys: set[tuple[str, ...]] = set()
    preferred_by_report: Counter[str] = Counter()
    for line_number, row in enumerate(rows["report-dates.csv"], start=2):
        context = f"report-dates.csv:{line_number}"
        key = tuple(
            row[field] for field in ("report_id", "date_kind", "version_label", "date_value")
        )
        if key in date_keys:
            fail(f"{context}: duplicate (report_id, date_kind, version_label, date_value)")
        date_keys.add(key)
        if row["is_preferred"] == "YES":
            preferred_by_report[row["report_id"]] += 1
        precision_length = {"YEAR": 4, "MONTH": 7, "DAY": 10}.get(row["date_precision"])
        if precision_length and len(row["date_value"]) != precision_length:
            fail(f"{context}: date_value precision does not match date_precision")
    for report_id, count in preferred_by_report.items():
        if count > 1:
            fail(f"report-dates.csv: report {report_id} has {count} preferred dates")

    relationship_keys: set[tuple[str, ...]] = set()
    for line_number, row in enumerate(rows["report-relationships.csv"], start=2):
        context = f"report-relationships.csv:{line_number}"
        if row["source_report_id"] == row["target_report_id"]:
            fail(f"{context}: self-reference is forbidden")
        if row["relationship_type"] == "SAME_WORK":
            fail(f"{context}: SAME_WORK is not an allowed relationship")
        if row["direction"] == "SYMMETRIC" and row["source_report_id"] >= row["target_report_id"]:
            fail(f"{context}: symmetric relationships require source_report_id < target_report_id")
        key = tuple(
            row[field] for field in ("source_report_id", "target_report_id", "relationship_type")
        )
        if key in relationship_keys:
            fail(f"{context}: duplicate relationship triple")
        relationship_keys.add(key)

    terminal_events = ("RETRY_EXCEPTION_EXECUTED", "RETRY_EXCEPTION_EXPIRED")
    terminal_by_authorisation: Counter[str] = Counter()
    for line_number, row in enumerate(rows["report-state-history.csv"], start=2):
        context = f"report-state-history.csv:{line_number}"
        event = row["event_type"]
        auth_id = row["authorisation_history_id"]
        if event in terminal_events:
            terminal_by_authorisation[auth_id] += 1
            if not auth_id:
                fail(f"{context}: terminal event requires authorisation_history_id")
        elif auth_id:
            fail(f"{context}: authorisation_history_id must be empty for {event}")
        if event == "RETRY_EXCEPTION_DECISION" and row["request_status"] == "ACCEPTED":
            if not row["authorisation_expires_at_utc"]:
                fail(f"{context}: accepted authorisation requires an expiry timestamp")
            elif row["authorisation_expires_at_utc"] <= row["authorisation_date_utc"]:
                fail(f"{context}: expiry must be strictly later than authorisation")
        if event == "RETRY_EXCEPTION_EXECUTED" and row["correction_of"]:
            fail(f"{context}: correction_of cannot be used for retry authorisation")
    for auth_id, count in terminal_by_authorisation.items():
        if auth_id and count > 1:
            fail(f"report-state-history.csv: {count} terminal events for authorisation {auth_id}")

    snapshot_ids = {row["snapshot_id"] for row in rows["prisma-snapshots.csv"]}
    for line_number, row in enumerate(rows["prisma-snapshots.csv"], start=2):
        if row["superseded_by"] and row["superseded_by"] not in snapshot_ids:
            fail(f"prisma-snapshots.csv:{line_number}: superseded_by references unknown snapshot")


def check_cross_references(rows: dict[str, list[dict[str, str]]]) -> None:
    lit_ids = {row["lit_id"] for row in rows["papers.csv"]}
    record_ids = {row["record_id"] for row in rows["screening-register.csv"]}
    report_ids = {row["report_id"] for row in rows["reports.csv"]}
    history_ids = {row["history_id"] for row in rows["report-state-history.csv"]}

    references = (
        ("verification-register.csv", "lit_id", lit_ids),
        ("evaluation-matrix.csv", "lit_id", lit_ids),
        ("screening-register.csv", "lit_id", lit_ids),
        ("reports.csv", "lit_id", lit_ids),
        ("source-identifiers.csv", "lit_id", lit_ids),
        ("record-report-links.csv", "record_id", record_ids),
        ("record-report-links.csv", "report_id", report_ids),
        ("authoritative-register.csv", "report_id", report_ids),
        ("report-dates.csv", "report_id", report_ids),
        ("report-relationships.csv", "source_report_id", report_ids),
        ("report-relationships.csv", "target_report_id", report_ids),
        ("report-state-history.csv", "report_id", report_ids),
    )
    for name, field, targets in references:
        for line_number, row in enumerate(rows[name], start=2):
            value = row[field]
            if value and value not in targets:
                fail(f"{name}:{line_number}: {field}={value!r} has no target register row")

    for line_number, row in enumerate(rows["report-state-history.csv"], start=2):
        value = row["authorisation_history_id"]
        if value and value not in history_ids:
            fail(
                f"report-state-history.csv:{line_number}: "
                f"authorisation_history_id={value!r} references unknown event"
            )

    dois = [row["doi"] for row in rows["papers.csv"] if row["doi"]]
    for doi, count in Counter(dois).items():
        if count > 1:
            fail(f"papers.csv: DOI {doi!r} appears {count} times")

    included_records = [row["record_id"] for row in rows["screening-register.csv"] if row["lit_id"]]
    if set(included_records) != {row["lit_id"] for row in rows["papers.csv"]}:
        fail("cross-register: included REC rows do not correspond one-to-one with LIT studies")


def check_documentation_consistency(rows: dict[str, list[dict[str, str]]]) -> None:
    if not SCHEMA_DOC.is_file() or not METHODOLOGY_DOC.is_file():
        fail("documentation: register-schemas.md or methodology.md is missing")
        return
    schema_text = SCHEMA_DOC.read_text(encoding="utf-8")
    methodology_text = METHODOLOGY_DOC.read_text(encoding="utf-8")
    for field in SCHEMA_COVERAGE_FIELDS:
        if field not in schema_text:
            fail(f"documentation: field {field!r} absent from register-schemas.md")
        if not any(field in fields for fields in EXPECTED_HEADERS.values()):
            fail(f"documentation: field {field!r} absent from implemented headers")
    for field in METHODOLOGY_FIELDS:
        if field not in methodology_text:
            fail(f"documentation: methodology.md no longer references field {field!r}")
    for name in METHODOLOGY_REGISTERS:
        if name not in methodology_text:
            fail(f"documentation: methodology.md no longer references {name}")

    frozen = [
        row
        for row in rows["prisma-snapshots.csv"]
        if row["status"] == "FROZEN" and not row["superseded_by"]
    ]
    if frozen:
        expected = int(frozen[-1]["category_12"])
        actual = len(rows["papers.csv"])
        if actual != expected:
            fail(
                f"cross-register: papers.csv has {actual} studies but latest FROZEN "
                f"snapshot category_12 is {expected}"
            )


def self_test() -> bool:
    """Exercise representative row rules on synthetic in-memory fixtures."""
    passed = 0

    def row(name: str, values: dict[str, str]) -> dict[str, str]:
        """Build a complete synthetic row so sparse fixtures are safe to inspect."""
        return {field: values.get(field, "") for field in EXPECTED_HEADERS[name]}

    def expect_error(action: object, description: str) -> None:
        nonlocal passed
        ERRORS.clear()
        action()
        if not ERRORS:
            print(f"SELF-TEST FAIL: {description} was not rejected")
            raise SystemExit(1)
        passed += 1

    expect_error(
        lambda: check_conditional_rules(
            {
                **{name: [] for name in EXPECTED_HEADERS},
                "reports.csv": [
                    row(
                        "reports.csv",
                        {
                            "exclusion_stage": "TITLE_ABSTRACT",
                            "lit_id": "LIT-001",
                            "grouping_status": "CONFIDENT",
                            "flow_state": "EXCLUDED",
                            "exclusion_reason": "E1",
                        },
                    )
                ],
            }
        ),
        "report-level TITLE_ABSTRACT exclusion",
    )
    expect_error(
        lambda: check_conditional_rules(
            {
                **{name: [] for name in EXPECTED_HEADERS},
                "evaluation-matrix.csv": [
                    row(
                        "evaluation-matrix.csv",
                        {
                            "access_status": "FULL_TEXT_REVIEWED",
                            "raw_relevance": "4",
                            "score_relevance": "25",
                            "raw_technical": "0",
                            "score_technical": "0",
                            "raw_evidence": "0",
                            "score_evidence": "0",
                            "raw_novelty": "0",
                            "score_novelty": "0",
                            "raw_practical": "0",
                            "score_practical": "0",
                            "raw_credibility": "0",
                            "score_credibility": "0",
                            "score_total": "25",
                            "top25": "NO",
                            "top10": "NO",
                            **{f: "locator" for f in JUSTIFICATION_FIELDS},
                        },
                    )
                ],
            }
        ),
        "incorrect weighted score",
    )
    expect_error(
        lambda: check_cross_references(
            {
                **{name: [] for name in EXPECTED_HEADERS},
                "verification-register.csv": [
                    row("verification-register.csv", {"lit_id": "LIT-999"})
                ],
            }
        ),
        "dangling lit_id foreign key",
    )
    expect_error(
        lambda: check_conditional_rules(
            {
                **{name: [] for name in EXPECTED_HEADERS},
                "report-state-history.csv": [
                    row(
                        "report-state-history.csv",
                        {
                            "event_type": "RETRY_EXCEPTION_DECISION",
                            "request_status": "ACCEPTED",
                            "authorisation_date_utc": "2026-11-21",
                            "authorisation_expires_at_utc": "",
                        },
                    )
                ],
            }
        ),
        "accepted authorisation without expiry",
    )
    ERRORS.clear()
    print(f"self-test: {passed} negative cases rejected as expected")
    return True


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--self-test", action="store_true", help="run synthetic negative-case checks only"
    )
    parser.add_argument(
        "--allow-rows",
        action="store_true",
        help="allow data rows (default: require header-only registers at Stage 1B.6)",
    )
    args = parser.parse_args()

    if args.self_test:
        return 0 if self_test() else 1

    ERRORS.clear()
    headers: dict[str, list[str]] = {}
    rows: dict[str, list[dict[str, str]]] = {}
    for name in EXPECTED_HEADERS:
        headers[name], rows[name] = read_register(name)
    check_headers(headers)
    for name, register_rows in rows.items():
        check_row_types(name, register_rows)
        if register_rows and not args.allow_rows:
            fail(
                f"{name}: contains {len(register_rows)} data row(s); registers must be header-only"
            )
    check_conditional_rules(rows)
    check_cross_references(rows)
    check_documentation_consistency(rows)

    if ERRORS:
        print(f"VALIDATION FAILED ({len(ERRORS)} issue(s)):")
        for error in ERRORS:
            print(f"  - {error}")
        return 1
    total_rows = sum(len(register_rows) for register_rows in rows.values())
    print(f"VALIDATION PASSED: {len(EXPECTED_HEADERS)} registers, {total_rows} data rows")
    return 0


if __name__ == "__main__":
    sys.exit(main())
