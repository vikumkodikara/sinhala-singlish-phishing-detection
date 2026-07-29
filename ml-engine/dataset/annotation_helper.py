"""
Annotation Helper
==================

Utilities for managing dataset annotations for the phishing detection
task, supporting:

- Inter-annotator agreement (Cohen's / Fleiss' kappa)
- Annotation format conversion (custom → standard NLP formats)
- Quality checks and conflict resolution
- Export to labelled training format

Usage::

    from ml_engine.dataset.annotation_helper import AnnotationHelper

    helper = AnnotationHelper()
    helper.load_annotations("dataset/annotations/batch_01.json")
    agreement = helper.compute_agreement()

Author:
    Vikum Kodikara
"""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Annotation schema
# ---------------------------------------------------------------------------


class Annotation:
    """Represents a single annotation entry.

    Attributes:
        text_id: Unique identifier for the text sample.
        text: The original message text.
        label: Assigned label (``SAFE`` or ``PHISHING``).
        annotator: Identifier of the annotator.
        confidence: Annotator's confidence (0.0–1.0).
        notes: Optional free-text notes.
    """

    def __init__(
        self,
        text_id: str,
        text: str,
        label: str,
        annotator: str,
        confidence: float = 1.0,
        notes: str = "",
    ) -> None:
        self.text_id = text_id
        self.text = text
        self.label = label
        self.annotator = annotator
        self.confidence = confidence
        self.notes = notes

    def to_dict(self) -> dict[str, Any]:
        """Serialise to dictionary."""
        return {
            "text_id": self.text_id,
            "text": self.text,
            "label": self.label,
            "annotator": self.annotator,
            "confidence": self.confidence,
            "notes": self.notes,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> Annotation:
        """Deserialise from dictionary."""
        return cls(
            text_id=data["text_id"],
            text=data["text"],
            label=data["label"],
            annotator=data.get("annotator", "unknown"),
            confidence=data.get("confidence", 1.0),
            notes=data.get("notes", ""),
        )


class AnnotationHelper:
    """Manages annotation loading, validation, and agreement computation.

    Attributes:
        annotations: List of loaded :class:`Annotation` objects.
    """

    def __init__(self) -> None:
        self.annotations: list[Annotation] = []
        logger.info("AnnotationHelper initialised")

    def load_annotations(self, path: str | Path) -> None:
        """Load annotations from a JSON file.

        Expected format::

            [
                {"text_id": "001", "text": "...", "label": "SAFE", "annotator": "A1"},
                ...
            ]

        Args:
            path: Path to the annotation JSON file.

        Raises:
            FileNotFoundError: If the file does not exist.
        """
        file_path = Path(path)
        if not file_path.exists():
            raise FileNotFoundError(f"Annotation file not found: {file_path}")

        # TODO: Implement JSON loading and parsing
        # TODO: Validate label values against VALID_LABELS

        logger.info("Loading annotations from %s", file_path)
        with open(file_path, encoding="utf-8") as f:
            raw_data = json.load(f)

        for entry in raw_data:
            self.annotations.append(Annotation.from_dict(entry))

        logger.info("Loaded %d annotations", len(self.annotations))

    def compute_agreement(self) -> dict[str, float]:
        """Compute inter-annotator agreement metrics.

        Returns:
            Dictionary with:
                - ``percent_agreement``: Raw percentage agreement.
                - ``cohens_kappa``: Cohen's kappa (for 2 annotators).
                - ``fleiss_kappa``: Fleiss' kappa (for 3+ annotators).

        Note:
            This is a placeholder — actual computation requires the
            ``scikit-learn`` or ``statsmodels`` library.
        """
        # TODO: Implement Cohen's kappa for 2 annotators
        # TODO: Implement Fleiss' kappa for 3+ annotators
        # TODO: Group annotations by text_id for comparison
        logger.info("Computing inter-annotator agreement")

        return {
            "percent_agreement": 0.0,
            "cohens_kappa": 0.0,
            "fleiss_kappa": 0.0,
        }

    def resolve_conflicts(
        self,
        strategy: str = "majority",
    ) -> list[dict[str, Any]]:
        """Resolve annotation conflicts using the specified strategy.

        Args:
            strategy: Conflict resolution method.  Options:
                - ``"majority"``: Majority vote.
                - ``"confidence"``: Highest confidence wins.
                - ``"expert"``: Specific annotator's label takes priority.

        Returns:
            List of resolved records with final labels.
        """
        # TODO: Implement majority voting
        # TODO: Implement confidence-weighted resolution
        # TODO: Implement expert override
        logger.info("Resolving conflicts (strategy=%s)", strategy)
        return []

    def export_for_training(
        self,
        output_path: str | Path = "dataset/processed/annotated.json",
    ) -> None:
        """Export resolved annotations in training-ready format.

        Args:
            output_path: Path to the output JSON file.
        """
        # TODO: Implement export with resolved labels
        logger.info("Exporting annotations to %s", output_path)

        out = Path(output_path)
        out.parent.mkdir(parents=True, exist_ok=True)

        records = [a.to_dict() for a in self.annotations]
        with open(out, "w", encoding="utf-8") as f:
            json.dump(records, f, ensure_ascii=False, indent=2)

        logger.info("Exported %d annotated records", len(records))
