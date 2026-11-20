"""Verify that the package and all declared module boundaries import cleanly."""

import importlib

import pytest

MODULE_NAMES = (
    "hitl2",
    "hitl2.schemas",
    "hitl2.agents",
    "hitl2.governance",
    "hitl2.risk",
    "hitl2.policies",
    "hitl2.human_oversight",
    "hitl2.audit",
    "hitl2.api",
    "hitl2.data",
    "hitl2.data.discovery",
    "hitl2.data.loaders",
    "hitl2.data.validators",
    "hitl2.data.preprocessing",
    "hitl2.data.metadata",
)


@pytest.mark.parametrize("module_name", MODULE_NAMES)
def test_module_imports(module_name: str) -> None:
    module = importlib.import_module(module_name)
    assert module is not None
