"""Verify that preliminary interface placeholders can be imported and instantiated."""

from hitl2.schemas import (
    INTERFACE_STATUS,
    UNRESOLVED,
    ActionProposal,
    AuditEvent,
    GovernanceDecision,
    RiskAssessment,
)

SCHEMAS = (ActionProposal, GovernanceDecision, RiskAssessment, AuditEvent)


def test_all_schemas_are_marked_as_placeholders() -> None:
    for schema in SCHEMAS:
        assert schema.interface_status == INTERFACE_STATUS


def test_unresolved_fields_are_explicitly_marked() -> None:
    for schema in SCHEMAS:
        assert schema.model_fields
        descriptions = " ".join(
            str(field.description) for field in schema.model_fields.values() if field.description
        )
        assert UNRESOLVED in descriptions, f"{schema.__name__} has no UNRESOLVED marker"


def test_action_proposal_instantiation() -> None:
    proposal = ActionProposal(proposal_id="p-1", agent_id="agent-1", action="example_action")
    assert proposal.proposal_id == "p-1"
    assert proposal.parameters == {}
    assert proposal.context == {}


def test_governance_decision_instantiation() -> None:
    decision = GovernanceDecision(
        decision_id="d-1", proposal_id="p-1", outcome="placeholder_outcome"
    )
    assert decision.decision_id == "d-1"
    assert decision.rationale is None


def test_risk_assessment_instantiation() -> None:
    assessment = RiskAssessment(assessment_id="r-1", proposal_id="p-1")
    assert assessment.assessment_id == "r-1"
    assert assessment.result == {}


def test_audit_event_instantiation() -> None:
    event = AuditEvent(event_id="a-1", event_type="placeholder_event")
    assert event.event_id == "a-1"
    assert event.timestamp is not None
    assert event.payload == {}
