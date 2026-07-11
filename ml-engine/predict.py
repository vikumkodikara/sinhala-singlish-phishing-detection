"""
Inference Entry Point
======================

Provides a high-level API for running phishing detection predictions
on individual messages or batches.  This module ties together the
preprocessing pipeline, tokeniser, and model inference.

Usage::

    # Command-line
    python -m ml_engine.predict --text "ඔබගේ ගිණුම verify කරන්න"

    # Programmatic
    from ml_engine.predict import PhishingDetector
    detector = PhishingDetector(model_dir="results/models")
    result = detector.predict("Click this link to verify your account")

Author:
    Vikum Kodikara
"""

from __future__ import annotations

import argparse
import logging
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional, Sequence

from ml_engine.preprocessing.clean_text import clean_text
from ml_engine.preprocessing.normalize_sinhala import normalize_sinhala
from ml_engine.preprocessing.normalize_singlish import normalize_singlish
from ml_engine.preprocessing.remove_noise import remove_noise
from ml_engine.utils.logger import setup_logger

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Result data class
# ---------------------------------------------------------------------------

@dataclass
class PredictionResult:
    """Encapsulates a single prediction outcome.

    Attributes:
        text: The original input text.
        label: Predicted label (``SAFE`` or ``PHISHING``).
        confidence: Model confidence score (0.0–1.0).
        risk_score: Normalised risk score (0.0–1.0), where 1.0 is
            highest risk.
        preprocessed_text: The text after preprocessing.
    """

    text: str
    label: str
    confidence: float
    risk_score: float
    preprocessed_text: str = ""

    def is_phishing(self) -> bool:
        """Return ``True`` if the message is classified as phishing."""
        return self.label == "PHISHING"

    def to_dict(self) -> dict:
        """Serialise to a dictionary."""
        return {
            "text": self.text,
            "label": self.label,
            "confidence": self.confidence,
            "risk_score": self.risk_score,
            "is_phishing": self.is_phishing(),
        }


# ---------------------------------------------------------------------------
# Detector
# ---------------------------------------------------------------------------

class PhishingDetector:
    """High-level phishing detection interface.

    Orchestrates preprocessing and model inference.

    Attributes:
        model_dir: Directory containing the trained model artefacts.
        model: The loaded model instance.
        tokenizer: The loaded tokeniser.
    """

    def __init__(
        self,
        model_dir: str | Path = "results/models",
        threshold: float = 0.5,
    ) -> None:
        """Initialise the phishing detector.

        Args:
            model_dir: Path to the directory containing the trained
                model, tokeniser, and labels.
            threshold: Classification threshold for the phishing class.
        """
        self.model_dir = Path(model_dir)
        self.threshold = threshold
        self.model = None
        self.tokenizer = None

        logger.info(
            "PhishingDetector initialised (model_dir=%s, threshold=%.2f)",
            self.model_dir,
            self.threshold,
        )

    def load(self) -> None:
        """Load the model and tokeniser from disk.

        Raises:
            FileNotFoundError: If the model directory does not exist.
        """
        if not self.model_dir.exists():
            raise FileNotFoundError(f"Model directory not found: {self.model_dir}")

        # TODO: Load TFLite model or Keras model
        # TODO: Load tokeniser from JSON
        # TODO: Load labels from JSON

        logger.info("Model and tokeniser loaded from %s", self.model_dir)

    def preprocess(self, text: str) -> str:
        """Apply the full preprocessing pipeline to a message.

        Args:
            text: Raw input message.

        Returns:
            Preprocessed text ready for inference.
        """
        logger.debug("Preprocessing: %s", text[:50])

        # Step 1: Basic cleaning
        text = clean_text(text)

        # Step 2: Script-specific normalisation
        text = normalize_sinhala(text)
        text = normalize_singlish(text)

        # Step 3: Noise removal
        text = remove_noise(text)

        return text

    def predict(self, text: str) -> PredictionResult:
        """Run phishing detection on a single message.

        Args:
            text: Raw input message text.

        Returns:
            A :class:`PredictionResult` with the detection outcome.
        """
        logger.info("Predicting on text (len=%d)", len(text))

        # Preprocess
        preprocessed = self.preprocess(text)

        # TODO: Tokenise and encode
        # TODO: Run model inference
        # TODO: Map output to label and confidence

        # Placeholder result
        result = PredictionResult(
            text=text,
            label="SAFE",
            confidence=0.0,
            risk_score=0.0,
            preprocessed_text=preprocessed,
        )

        logger.info("Prediction: %s (confidence=%.2f)", result.label, result.confidence)
        return result

    def predict_batch(
        self,
        texts: Sequence[str],
    ) -> List[PredictionResult]:
        """Run phishing detection on a batch of messages.

        Args:
            texts: List of raw input message strings.

        Returns:
            List of :class:`PredictionResult` instances.
        """
        logger.info("Batch prediction on %d texts", len(texts))
        return [self.predict(text) for text in texts]


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def main() -> None:
    """Command-line entry point for single-message prediction."""
    parser = argparse.ArgumentParser(
        description="Detect phishing in a Sinhala/Singlish message."
    )
    parser.add_argument(
        "--text",
        type=str,
        required=True,
        help="The message text to analyse.",
    )
    parser.add_argument(
        "--model-dir",
        type=str,
        default="results/models",
        help="Path to the trained model directory.",
    )
    parser.add_argument(
        "--threshold",
        type=float,
        default=0.5,
        help="Classification threshold.",
    )
    args = parser.parse_args()

    setup_logger(log_level="INFO")

    detector = PhishingDetector(
        model_dir=args.model_dir,
        threshold=args.threshold,
    )
    # Note: load() will fail until a model is trained — expected for M2
    # detector.load()

    result = detector.predict(args.text)
    print(result.to_dict())


if __name__ == "__main__":
    main()
