"""
Text Preprocessing Pipeline for Sinhala/Singlish Mobile Messages

Reproduces the exact text normalization and sequence conversion pipeline used
during research model training.
"""
from __future__ import annotations

import re
import unicodedata
from typing import Dict, List
import numpy as np


# Sinhala Unicode range
SINHALA_CHAR_PATTERN = re.compile(r"[\u0D80-\u0DFF]")
LATIN_CHAR_PATTERN = re.compile(r"[A-Za-z]")

# Common Singlish phonetic tokens / word stems for heuristic script detection
SINGLISH_KEYWORDS = {
    "oyage", "oyata", "mage", "mata", "apita", "ape", "danma", "karanna",
    "enna", "yamu", "gedara", "ganna", "labaganna", "balanna", "kiyanna",
    "eka", "ow", "na", "ne", "ada", "heta", "suba", "dinanna", "dinum"
}


def normalize_text(text: str) -> str:
    """Normalize input message text.

    Pipeline stages:
    1. String conversion and Unicode NFC normalization.
    2. Whitespace normalization (collapsing multi-spaces, newlines, tabs).
    3. Repeated-character normalization for non-numeric characters (e.g. 'pleeeeease' -> 'pleeease').
       CRITICAL: Digits and numeric sequences (OTPs, dates, amounts like 'Rs.250000')
       are strictly preserved.

    Args:
        text: Raw SMS or mobile message text.

    Returns:
        Normalized text string ready for feature extraction and tokenization.
    """
    if not isinstance(text, str):
        text = str(text) if text is not None else ""

    # Step 1: Unicode NFC normalization
    text = unicodedata.normalize("NFC", text)

    # Step 2: Normalize whitespace
    text = re.sub(r"\s+", " ", text)

    # Step 3: Normalize repeated characters for non-digit non-whitespace characters only
    # E.g., 'pleeeeease' -> 'pleeease', '!!!!' -> '!!!', while 'Rs.250000' remains 'Rs.250000'
    text = re.sub(r"([^\d\s])\1{3,}", r"\1\1\1", text)

    return text.strip()


def detect_script(text: str) -> str:
    """Heuristically identify the script and language style of the message.

    Note: This is an explanatory heuristic classifier and does not affect the
    bilingual ML model's internal representations.

    Args:
        text: Normalized message string.

    Returns:
        One of: 'Sinhala', 'Singlish', 'English', 'Mixed (Sinhala/English)', or 'Other'
    """
    if not text:
        return "Unknown"

    sinhala_count = len(SINHALA_CHAR_PATTERN.findall(text))
    latin_count = len(LATIN_CHAR_PATTERN.findall(text))

    if sinhala_count > 0 and latin_count > 0:
        return "Mixed (Sinhala/English)"
    elif sinhala_count > 0:
        return "Sinhala"
    elif latin_count > 0:
        words = set(re.findall(r"[a-z]+", text.lower()))
        if words.intersection(SINGLISH_KEYWORDS):
            return "Singlish"
        return "English / Singlish"
    else:
        return "Symbols / Numeric"


def text_to_sequence(
    text: str,
    word_index: Dict[str, int],
    oov_token: str = "<OOV>",
    max_length: int = 120,
) -> np.ndarray:
    """Convert normalized text into a fixed-length integer token sequence.

    Args:
        text: Normalized input message text.
        word_index: Dictionary mapping token strings to integer IDs.
        oov_token: Out-of-vocabulary marker.
        max_length: Target sequence length (120).

    Returns:
        1D NumPy array of shape (max_length,) with post-padding / truncation.
    """
    oov_id = word_index.get(oov_token, 1)

    # Standard Keras word tokenization: lowercase, split on whitespace and punctuation
    # Filter regex matching standard Keras Tokenizer: '!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~\t\n'
    # but maintaining matching behavior
    tokens = re.findall(r"\b\w+\b|[^\w\s]", text.lower(), re.UNICODE)

    seq: List[int] = []
    for token in tokens:
        idx = word_index.get(token, oov_id)
        seq.append(idx)

    # Post-pad or post-truncate to max_length
    padded = np.zeros((max_length,), dtype=np.int32)
    if seq:
        trunc_len = min(len(seq), max_length)
        padded[:trunc_len] = seq[:trunc_len]

    return padded
