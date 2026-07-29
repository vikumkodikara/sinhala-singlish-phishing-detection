"""
Linguistic Feature Extraction
===============================

Extracts language- and style-based features from Sinhala/Singlish messages
that may indicate phishing intent.

Feature categories:

- **Urgency indicators**: Presence of urgency words, excessive punctuation.
- **Sentiment cues**: Negative / threatening language patterns.
- **Script analysis**: Sinhala-to-Latin ratio, code-switching frequency.
- **Structural**: Message length, sentence count, word count.
- **Stylistic**: Capitalisation ratio, special character density.

Usage::

    from ml_engine.features.linguistic_features import extract_linguistic_features

    features = extract_linguistic_features("ඔබගේ ගිණුම අත්හිටුවා ඇත! Verify now!")

Author:
    Vikum Kodikara
"""

from __future__ import annotations

import logging
import re
from typing import Any

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

#: Sinhala urgency words (phishing signals)
SINHALA_URGENCY_WORDS: list[str] = [
    "හදිසි",  # urgent
    "වහාම",  # immediately
    "දැන්ම",  # right now
    "අවසන්",  # last / final
    "අනතුරු",  # danger / warning
    "අවහිර",  # blocked
    "අත්හිටුවා",  # suspended
    "තහනම්",  # banned / prohibited
]

#: Singlish urgency words (phishing signals)
SINGLISH_URGENCY_WORDS: list[str] = [
    "urgent",
    "immediately",
    "now",
    "hurry",
    "quick",
    "suspend",
    "block",
    "verify",
    "confirm",
    "expire",
    "limited",
    "last",
    "final",
    "warning",
    "alert",
    "hadisi",
    "wahama",
    "danma",
    "ikmanata",
]

#: Sinhala Unicode block range
SINHALA_RANGE = range(0x0D80, 0x0DFF + 1)


# ---------------------------------------------------------------------------
# Feature extraction functions
# ---------------------------------------------------------------------------


def count_urgency_indicators(
    text: str,
    *,
    sinhala_words: list[str] | None = None,
    singlish_words: list[str] | None = None,
) -> int:
    """Count urgency-related words in the message.

    Args:
        text: Input text.
        sinhala_words: List of Sinhala urgency words.
        singlish_words: List of Singlish urgency words.

    Returns:
        Total count of urgency indicators found.
    """
    if sinhala_words is None:
        sinhala_words = SINHALA_URGENCY_WORDS
    if singlish_words is None:
        singlish_words = SINGLISH_URGENCY_WORDS

    text_lower = text.lower()
    count = 0

    for word in sinhala_words:
        if word in text:
            count += 1

    for word in singlish_words:
        if word in text_lower:
            count += 1

    return count


def compute_script_ratio(text: str) -> dict[str, float]:
    """Compute the ratio of Sinhala vs Latin characters.

    Args:
        text: Input text.

    Returns:
        Dictionary with ``sinhala_ratio``, ``latin_ratio``, and
        ``other_ratio``, each in the range 0.0–1.0.
    """
    if not text:
        return {"sinhala_ratio": 0.0, "latin_ratio": 0.0, "other_ratio": 0.0}

    sinhala_count = sum(1 for c in text if ord(c) in SINHALA_RANGE)
    latin_count = sum(1 for c in text if c.isascii() and c.isalpha())
    total = len(text.replace(" ", "")) or 1

    return {
        "sinhala_ratio": round(sinhala_count / total, 4),
        "latin_ratio": round(latin_count / total, 4),
        "other_ratio": round(1.0 - (sinhala_count + latin_count) / total, 4),
    }


def count_exclamation_marks(text: str) -> int:
    """Count exclamation marks — excessive use indicates urgency.

    Args:
        text: Input text.

    Returns:
        Number of ``!`` characters.
    """
    return text.count("!")


def compute_capitalisation_ratio(text: str) -> float:
    """Compute the ratio of upper-case to total alphabetic characters.

    High ratios may indicate shouting / urgency (e.g. "VERIFY NOW").

    Args:
        text: Input text.

    Returns:
        Capitalisation ratio (0.0–1.0).
    """
    alpha_chars = [c for c in text if c.isalpha() and c.isascii()]
    if not alpha_chars:
        return 0.0
    upper_count = sum(1 for c in alpha_chars if c.isupper())
    return round(upper_count / len(alpha_chars), 4)


def count_sentences(text: str) -> int:
    """Estimate the number of sentences in the text.

    Args:
        text: Input text.

    Returns:
        Estimated sentence count.
    """
    # TODO: Use a proper sentence segmenter for Sinhala
    terminators = re.findall(r"[.!?။]", text)
    return max(1, len(terminators))


def detect_monetary_references(text: str) -> bool:
    """Check if the message contains monetary references.

    Phishing messages frequently reference money, prizes, or account
    balances.

    Args:
        text: Input text.

    Returns:
        ``True`` if monetary references are detected.
    """
    # TODO: Add Sinhala-language monetary terms
    money_patterns = [
        r"Rs\.?\s*\d+",  # Sri Lankan rupees
        r"LKR\s*\d+",  # ISO code
        r"\$\s*\d+",  # USD
        r"රු\.?\s*\d+",  # Sinhala rupee symbol
        r"ලක්ෂ",  # lakh
        r"මිලියන",  # million
    ]

    return any(re.search(pattern, text, re.IGNORECASE) for pattern in money_patterns)


def extract_linguistic_features(text: str) -> dict[str, Any]:
    """Extract a comprehensive set of linguistic features.

    This is the primary entry point for linguistic feature extraction.

    Args:
        text: Preprocessed input text.

    Returns:
        Dictionary of features:
            - ``message_length``: Character count.
            - ``word_count``: Number of whitespace-delimited tokens.
            - ``sentence_count``: Estimated number of sentences.
            - ``urgency_word_count``: Number of urgency indicators.
            - ``exclamation_count``: Number of ``!`` characters.
            - ``capitalisation_ratio``: Upper-case ratio (Latin only).
            - ``sinhala_ratio``: Proportion of Sinhala characters.
            - ``latin_ratio``: Proportion of Latin characters.
            - ``has_monetary_reference``: Boolean monetary signal.
            - ``has_url``: Whether the text contains a URL token.
            - ``has_phone``: Whether the text contains a phone token.

    Example::

        >>> features = extract_linguistic_features("ඔබගේ ගිණුම verify කරන්න!")
        >>> features["urgency_word_count"]
        1
    """
    logger.debug("Extracting linguistic features (len=%d)", len(text))

    script = compute_script_ratio(text)

    features: dict[str, Any] = {
        # Structural
        "message_length": len(text),
        "word_count": len(text.split()),
        "sentence_count": count_sentences(text),
        # Urgency / phishing signals
        "urgency_word_count": count_urgency_indicators(text),
        "exclamation_count": count_exclamation_marks(text),
        "capitalisation_ratio": compute_capitalisation_ratio(text),
        # Script analysis
        "sinhala_ratio": script["sinhala_ratio"],
        "latin_ratio": script["latin_ratio"],
        # Semantic signals
        "has_monetary_reference": detect_monetary_references(text),
        # Token presence (set by remove_noise special tokens)
        "has_url": "<URL>" in text,
        "has_phone": "<PHONE>" in text,
    }

    logger.debug("Linguistic features: %s", features)
    return features
