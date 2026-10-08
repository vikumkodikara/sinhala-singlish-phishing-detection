"""
Inference Entry Point
======================

Provides high-level API and CLI for running phishing detection predictions
on individual messages or batches using the trained BiGRU + Attention Keras model.

Usage::

    # Command-line
    python ml-engine/predict.py --text "ඔබගේ ගිණුම verify කරන්න http://bank.com"

    # Programmatic
    from ml_engine.predict import PhishingDetector
    detector = PhishingDetector()
    result = detector.predict("Click this link to verify your account http://scam.xyz")

Author:
    Vikum Kodikara
"""
from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path
from typing import Sequence, Dict, Any

# Ensure project root is in sys.path
PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

# Ensure utf-8 output for console
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from backend.app.services.model_service import ModelService
from backend.app.schemas.prediction import PredictResponse

logger = logging.getLogger(__name__)


class PhishingDetector:
    """High-level phishing detection interface using the pre-trained BiGRU model."""

    def __init__(
        self,
        model_dir: str | Path | None = None,
        threshold: float = 0.5,
    ) -> None:
        if model_dir is None:
            model_dir = PROJECT_ROOT / "backend" / "models"
        self.model_dir = Path(model_dir)
        self.threshold = threshold
        self.service = ModelService.get_instance(models_dir=self.model_dir)
        self.load()

    def load(self) -> None:
        """Load the model and tokenizer assets."""
        if not self.service.is_initialized:
            self.service.load()

    def predict(self, text: str) -> PredictResponse:
        """Run phishing detection on a single message.

        Args:
            text: Raw input message string.

        Returns:
            PredictResponse with prediction label, probability, confidence,
            risk level, script detection, and 9 handcrafted features.
        """
        return self.service.predict(text)

    def predict_batch(self, texts: Sequence[str]) -> list[PredictResponse]:
        """Run phishing detection on a batch of messages."""
        return [self.predict(t) for t in texts]


def main() -> None:
    """Command-line entry point for message prediction."""
    parser = argparse.ArgumentParser(
        description="Detect phishing in a Sinhala/Singlish/English SMS message."
    )
    parser.add_argument(
        "--text",
        type=str,
        required=True,
        help="The message text to analyze.",
    )
    parser.add_argument(
        "--model-dir",
        type=str,
        default=None,
        help="Path to the trained model directory (default: backend/models).",
    )
    args = parser.parse_args()

    detector = PhishingDetector(model_dir=args.model_dir)
    result = detector.predict(args.text)

    print("\n" + "=" * 65)
    print("PREDICTION RESULT")
    print("=" * 65)
    print(f"Prediction       : {result.prediction}")
    print(f"Probability      : {result.probability:.4f}")
    print(f"Confidence       : {result.confidence}%")
    print(f"Risk Level       : {result.risk_level}")
    print(f"Detected Script  : {result.detected_script}")
    print(f"Preprocessed Text: {result.preprocessed_text}")
    print("\nDetected Handcrafted Features:")
    for k, v in result.detected_features.model_dump().items():
        print(f"  - {k:22s}: {v}")
    print("=" * 65 + "\n")


if __name__ == "__main__":
    main()
