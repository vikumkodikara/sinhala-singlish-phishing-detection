"""
End-to-end preprocessing pipeline for SMS messages.
"""

from __future__ import annotations

import logging

from ml_engine.preprocessing.clean_text import clean_text
from ml_engine.preprocessing.normalize_sinhala import normalize_sinhala
from ml_engine.preprocessing.normalize_singlish import normalize_singlish
from ml_engine.preprocessing.remove_noise import remove_noise

logger = logging.getLogger(__name__)


def preprocess_message(text: str) -> str:
    """Run the full preprocessing pipeline on a single message.

    Order: clean → Sinhala normalise → Singlish normalise → denoise.
    """
    logger.debug("Preprocessing message (len=%d)", len(text))
    text = clean_text(text)
    text = normalize_sinhala(text)
    text = normalize_singlish(text)
    text = remove_noise(text)
    return text
