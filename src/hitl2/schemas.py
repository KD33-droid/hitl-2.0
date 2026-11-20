"""Preliminary cross-cutting interface schemas for HITL 2.0.

.. warning::
   These models are **interface placeholders only**. They give the prototype a
   typed, testable shape; they are not a research specification. Field names,
   types, vocabularies and semantics marked ``UNRESOLVED`` have not been agreed
   and must not be interpreted as final decisions.
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any, ClassVar

from pydantic import BaseModel, ConfigDict, Field

INTERFACE_STATUS = "interface_placeholder"
"""Marker applied to every schema in this module."""

UNRESOLVED = "UNRESOLVED"
"""Prefix used in field descriptions to flag unsettled semantics."""

__all__ = [
    "INTERFACE_STATUS",
    "UNRESOLVED",
    "ActionProposal",
    "AuditEvent",
    "GovernanceDecision",
    "RiskAssessment",
]


class _InterfacePlaceholder(BaseModel):
    """Shared base for preliminary interface placeholders."""

    model_config = ConfigDict(extra="forbid")

    interface_status: ClassVar[str] = INTERFACE_STATUS


class ActionProposal(_InterfacePlaceholder):
    """Placeholder for an action proposal emitted by an agent.

    UNRESOLVED: the descriptor set for an action (target, operation, parameters,
    calling agent identity) has not been specified.
    """

    proposal_id: str = Field(
        description="Opaque identifier used to correlate an action across the workflow.",
    )
    agent_id: str = Field(
        description=f"{UNRESOLVED}: agent identity representation not agreed.",
    )
    action: str = Field(
        description=f"{UNRESOLVED}: action type vocabulary not agreed.",
    )
    parameters: dict[str, Any] = Field(
        default_factory=dict,
        description=f"{UNRESOLVED}: parameter/payload schema not agreed.",
    )
    context: dict[str, Any] = Field(
        default_factory=dict,
        description=f"{UNRESOLVED}: risk and context sensor contract not agreed.",
    )


class GovernanceDecision(_InterfacePlaceholder):
    """Placeholder for a governance decision returned by the control plane.

    UNRESOLVED: the outcome vocabulary (for example allow, monitor, modify,
    block, escalate) and decision precedence are not agreed.
    UNRESOLVED: autonomy-level (L0-L4) representation is deliberately omitted;
    no selection logic is implemented.
    """

    decision_id: str = Field(
        description="Opaque identifier for this decision.",
    )
    proposal_id: str = Field(
        description="Identifier of the proposal this decision refers to.",
    )
    outcome: str = Field(
        description=f"{UNRESOLVED}: allowed outcome vocabulary not agreed.",
    )
    rationale: str | None = Field(
        default=None,
        description=f"{UNRESOLVED}: rationale and evidence requirements not agreed.",
    )


class RiskAssessment(_InterfacePlaceholder):
    """Placeholder for a risk assessment produced by the RSM.

    UNRESOLVED: no risk features, scores, levels, model or thresholds are
    defined here. Inventing them would pre-empt the RSM specification and the
    agreement required before governance mechanisms are implemented.
    """

    assessment_id: str = Field(
        description="Opaque identifier for this assessment.",
    )
    proposal_id: str = Field(
        description="Identifier of the proposal being assessed.",
    )
    result: dict[str, Any] = Field(
        default_factory=dict,
        description=(
            f"{UNRESOLVED}: RSM output contract not agreed; must not encode features or thresholds."
        ),
    )


class AuditEvent(_InterfacePlaceholder):
    """Placeholder for an audit event.

    UNRESOLVED: event taxonomy, payload contract, retention and integrity
    mechanisms are not agreed. No hashing, chaining or ledger fields are
    included, and no tamper-proofness is claimed or implemented.
    """

    event_id: str = Field(
        description="Opaque identifier for this event.",
    )
    event_type: str = Field(
        description=f"{UNRESOLVED}: event type taxonomy not agreed.",
    )
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        description=f"{UNRESOLVED}: clock source and trust semantics not agreed.",
    )
    payload: dict[str, Any] = Field(
        default_factory=dict,
        description=f"{UNRESOLVED}: event payload contract not agreed.",
    )
