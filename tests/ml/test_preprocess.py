"""Tests for the preprocessing pipeline."""

from __future__ import annotations

from ml_engine.preprocessing.clean_text import clean_text
from ml_engine.preprocessing.pipeline import preprocess_message
from ml_engine.preprocessing.remove_noise import remove_noise


def test_clean_text_collapses_whitespace() -> None:
    assert clean_text("  hello   world  ") == "hello world"


def test_remove_noise_replaces_urls() -> None:
    result = remove_noise("Visit https://example.com now")
    assert "<URL>" in result
    assert "https://example.com" not in result


def test_preprocess_message_runs_end_to_end() -> None:
    raw = "  Wadi labak! https://m1o1.com/test  "
    cleaned = preprocess_message(raw)
    assert cleaned
    assert "https://m1o1.com/test" not in cleaned
