"""
Model Evaluation Pipeline
===========================

Computes classification metrics and generates evaluation reports for
the phishing detection model.

Metrics computed:
    - Accuracy, Precision, Recall, F1-score (per-class and macro)
    - Confusion matrix
    - ROC-AUC and PR-AUC
    - Classification report

Reports generated:
    - JSON metrics file
    - Confusion matrix visualisation (placeholder)
    - Per-class performance breakdown

Usage::

    from ml_engine.evaluation.evaluate import ModelEvaluator

    evaluator = ModelEvaluator(model=model)
    report = evaluator.evaluate(test_data)
    evaluator.save_report(report, "results/evaluation")

Author:
    Vikum Kodikara
"""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Label constants
# ---------------------------------------------------------------------------

LABEL_NAMES: List[str] = ["SAFE", "PHISHING"]


# ---------------------------------------------------------------------------
# Metrics computation
# ---------------------------------------------------------------------------

def compute_confusion_matrix(
    y_true: Sequence[int],
    y_pred: Sequence[int],
    num_classes: int = 2,
) -> List[List[int]]:
    """Compute a confusion matrix.

    Args:
        y_true: Ground-truth labels (0-indexed integers).
        y_pred: Predicted labels (0-indexed integers).
        num_classes: Number of classes.

    Returns:
        Confusion matrix as a nested list ``[num_classes x num_classes]``.

    Example::

        >>> compute_confusion_matrix([0, 0, 1, 1], [0, 1, 1, 0])
        [[1, 1], [1, 1]]
    """
    # TODO: Replace with sklearn.metrics.confusion_matrix in production
    matrix = [[0] * num_classes for _ in range(num_classes)]
    for true, pred in zip(y_true, y_pred):
        matrix[true][pred] += 1
    return matrix


def compute_precision_recall_f1(
    y_true: Sequence[int],
    y_pred: Sequence[int],
    positive_label: int = 1,
) -> Dict[str, float]:
    """Compute precision, recall, and F1-score for the positive class.

    Args:
        y_true: Ground-truth labels.
        y_pred: Predicted labels.
        positive_label: The label considered as "positive" (phishing).

    Returns:
        Dictionary with ``precision``, ``recall``, ``f1_score``.
    """
    tp = sum(1 for t, p in zip(y_true, y_pred) if t == positive_label and p == positive_label)
    fp = sum(1 for t, p in zip(y_true, y_pred) if t != positive_label and p == positive_label)
    fn = sum(1 for t, p in zip(y_true, y_pred) if t == positive_label and p != positive_label)

    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = (
        2 * precision * recall / (precision + recall)
        if (precision + recall) > 0
        else 0.0
    )

    return {
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1_score": round(f1, 4),
    }


def compute_accuracy(
    y_true: Sequence[int],
    y_pred: Sequence[int],
) -> float:
    """Compute overall accuracy.

    Args:
        y_true: Ground-truth labels.
        y_pred: Predicted labels.

    Returns:
        Accuracy score (0.0–1.0).
    """
    if not y_true:
        return 0.0
    correct = sum(1 for t, p in zip(y_true, y_pred) if t == p)
    return round(correct / len(y_true), 4)


# ---------------------------------------------------------------------------
# Evaluator class
# ---------------------------------------------------------------------------

class ModelEvaluator:
    """Evaluates a trained phishing-detection model.

    Attributes:
        model: The trained model implementing :meth:`predict`.
    """

    def __init__(self, model: Any = None) -> None:
        """Initialise the evaluator.

        Args:
            model: A trained model instance with a ``predict()`` method.
        """
        self.model = model
        logger.info("ModelEvaluator initialised")

    def evaluate(
        self,
        test_data: Sequence[Dict[str, Any]],
        label_key: str = "label",
    ) -> Dict[str, Any]:
        """Run evaluation on the test dataset.

        Args:
            test_data: List of test records (each with ``text`` and
                *label_key*).
            label_key: Key containing the ground-truth label.

        Returns:
            Comprehensive evaluation report dictionary.
        """
        logger.info("Evaluating model on %d test samples", len(test_data))

        if not test_data:
            logger.warning("Empty test dataset — returning zero metrics")
            return self._empty_report()

        # TODO: Run model prediction on test_data
        # TODO: Map string labels to integer indices
        # TODO: Compute all metrics

        # Placeholder: simulate evaluation
        y_true: List[int] = []
        y_pred: List[int] = []

        for record in test_data:
            label = record.get(label_key, "SAFE")
            y_true.append(LABEL_NAMES.index(label) if label in LABEL_NAMES else 0)
            # TODO: Replace with actual model predictions
            y_pred.append(0)

        # Compute metrics
        accuracy = compute_accuracy(y_true, y_pred)
        prf = compute_precision_recall_f1(y_true, y_pred, positive_label=1)
        confusion = compute_confusion_matrix(y_true, y_pred, num_classes=2)

        report = {
            "num_samples": len(test_data),
            "accuracy": accuracy,
            "precision": prf["precision"],
            "recall": prf["recall"],
            "f1_score": prf["f1_score"],
            "confusion_matrix": confusion,
            "label_names": LABEL_NAMES,
            # TODO: Add ROC-AUC and PR-AUC
            "roc_auc": 0.0,
            "pr_auc": 0.0,
        }

        logger.info("Evaluation complete: accuracy=%.4f, F1=%.4f", accuracy, prf["f1_score"])
        return report

    def save_report(
        self,
        report: Dict[str, Any],
        output_dir: str | Path = "results/evaluation",
    ) -> None:
        """Save the evaluation report to disk.

        Args:
            report: Evaluation report dictionary from :meth:`evaluate`.
            output_dir: Output directory for report files.
        """
        out_path = Path(output_dir)
        out_path.mkdir(parents=True, exist_ok=True)

        # Save JSON report
        json_path = out_path / "evaluation_report.json"
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
        logger.info("Evaluation report saved to %s", json_path)

        # TODO: Generate and save confusion matrix plot
        # TODO: Generate and save ROC curve plot
        # TODO: Generate per-class performance table

    @staticmethod
    def _empty_report() -> Dict[str, Any]:
        """Return a report with zero metrics."""
        return {
            "num_samples": 0,
            "accuracy": 0.0,
            "precision": 0.0,
            "recall": 0.0,
            "f1_score": 0.0,
            "confusion_matrix": [[0, 0], [0, 0]],
            "label_names": LABEL_NAMES,
            "roc_auc": 0.0,
            "pr_auc": 0.0,
        }
