"""
Unit Tests for Preprocessing Module
"""
import pytest
from backend.app.services.preprocessing import (
    normalize_text,
    detect_script,
    text_to_sequence,
)


def test_empty_and_whitespace_normalization():
    assert normalize_text("") == ""
    assert normalize_text("   ") == ""
    assert normalize_text("  hello   world  \n\t") == "hello world"


def test_repeated_characters_normalization():
    # Repeated letters should be trimmed to 3
    assert normalize_text("pleeeeease") == "pleeease"
    assert normalize_text("urgent!!!!!!") == "urgent!!!"
    assert normalize_text("win win wiiiiiin") == "win win wiiin"


def test_numeric_preservation():
    # CRITICAL: Numbers, amounts, OTPs, phone numbers must not lose digits
    assert normalize_text("Rs.250000") == "Rs.250000"
    assert normalize_text("OTP 888888") == "OTP 888888"
    assert normalize_text("+94771234567") == "+94771234567"
    assert normalize_text("1000000 LKR") == "1000000 LKR"


def test_sinhala_unicode_normalization():
    raw_sinhala = "ඔබගේ ගිණුම"
    normalized = normalize_text(raw_sinhala)
    assert "ඔබගේ" in normalized
    assert "ගිණුම" in normalized


def test_detect_script():
    assert detect_script("ඔබගේ බැංකු ගිණුම") == "Sinhala"
    assert detect_script("Ada raata gedara enawada?") == "Singlish"
    assert "English" in detect_script("Your account has been credited with funds.")
    assert detect_script("ගිණුම verify කරන්න") == "Mixed (Sinhala/English)"


def test_text_to_sequence():
    vocab = {"<OOV>": 1, "hello": 2, "world": 3, "bank": 4}
    seq = text_to_sequence("hello world unknown bank", vocab, max_length=10)
    assert len(seq) == 10
    assert seq[0] == 2  # hello
    assert seq[1] == 3  # world
    assert seq[2] == 1  # OOV
    assert seq[3] == 4  # bank
    assert seq[4] == 0  # padding
