"""
TensorFlow Lite Export
=======================

Converts a trained Keras / TensorFlow model to TensorFlow Lite format
for deployment on the Android application.

Export options:
    - **Float16 quantisation**: Reduces model size ~2× with minimal
      accuracy loss.
    - **Dynamic-range quantisation**: Further size reduction for
      resource-constrained devices.
    - **Full integer quantisation**: Smallest model size, requires a
      representative dataset for calibration.

Usage::

    from ml_engine.export.export_tflite import TFLiteExporter

    exporter = TFLiteExporter(model_path="results/models/saved_model")
    exporter.export(
        output_path="app/src/main/assets/model.tflite",
        quantization="float16",
    )

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
# Quantisation strategies
# ---------------------------------------------------------------------------

QUANTIZATION_STRATEGIES = ["none", "float16", "dynamic", "full_integer"]


class TFLiteExporter:
    """Exports a trained model to TensorFlow Lite format.

    Attributes:
        model_path: Path to the saved model directory.
        model: The loaded TensorFlow model (populated during export).
    """

    def __init__(self, model_path: str | Path = "results/models") -> None:
        """Initialise the exporter.

        Args:
            model_path: Path to the TensorFlow SavedModel directory or
                Keras ``.h5`` file.
        """
        self.model_path = Path(model_path)
        self.model: Any = None  # Will be tf.keras.Model
        logger.info("TFLiteExporter initialised (model_path=%s)", self.model_path)

    def _load_model(self) -> None:
        """Load the trained TensorFlow / Keras model.

        Raises:
            FileNotFoundError: If the model path does not exist.
            ImportError: If TensorFlow is not installed.
        """
        if not self.model_path.exists():
            raise FileNotFoundError(f"Model not found: {self.model_path}")

        # TODO: Implement model loading
        # import tensorflow as tf
        # self.model = tf.keras.models.load_model(self.model_path)
        logger.info("Model loaded from %s", self.model_path)

    def export(
        self,
        output_path: str | Path = "app/src/main/assets/model.tflite",
        quantization: str = "float16",
        representative_dataset: list[Any] | None = None,
    ) -> Path:
        """Convert and export the model to TFLite format.

        Args:
            output_path: Output path for the ``.tflite`` file.
            quantization: Quantisation strategy.  One of:
                ``"none"``, ``"float16"``, ``"dynamic"``,
                ``"full_integer"``.
            representative_dataset: Required for ``"full_integer"``
                quantisation.  A list of representative input samples.

        Returns:
            The path to the exported ``.tflite`` file.

        Raises:
            ValueError: If *quantization* is not a valid strategy.
            FileNotFoundError: If the source model does not exist.
        """
        if quantization not in QUANTIZATION_STRATEGIES:
            raise ValueError(
                f"Invalid quantization: {quantization!r}. "
                f"Must be one of {QUANTIZATION_STRATEGIES}"
            )

        out = Path(output_path)
        out.parent.mkdir(parents=True, exist_ok=True)

        logger.info(
            "Exporting model to TFLite (quantization=%s, output=%s)",
            quantization,
            out,
        )

        # TODO: Implement TFLite conversion
        # converter = tf.lite.TFLiteConverter.from_saved_model(str(self.model_path))
        #
        # if quantization == "float16":
        #     converter.optimizations = [tf.lite.Optimize.DEFAULT]
        #     converter.target_spec.supported_types = [tf.float16]
        # elif quantization == "dynamic":
        #     converter.optimizations = [tf.lite.Optimize.DEFAULT]
        # elif quantization == "full_integer":
        #     converter.optimizations = [tf.lite.Optimize.DEFAULT]
        #     converter.representative_dataset = representative_dataset
        #     converter.target_spec.supported_ops = [
        #         tf.lite.OpsSet.TFLITE_BUILTINS_INT8
        #     ]
        #
        # tflite_model = converter.convert()
        # with open(out, "wb") as f:
        #     f.write(tflite_model)

        logger.info("TFLite model exported to %s", out)
        return out

    def export_metadata(
        self,
        output_path: str | Path = "app/src/main/assets",
        labels: list[str] | None = None,
    ) -> None:
        """Export model metadata files alongside the TFLite model.

        Creates:
            - ``labels.json``: Class label mapping.
            - ``tokenizer.json``: Tokeniser vocabulary (if applicable).

        Args:
            output_path: Directory for metadata files.
            labels: List of class labels.  Defaults to
                ``["SAFE", "PHISHING"]``.
        """
        out_dir = Path(output_path)
        out_dir.mkdir(parents=True, exist_ok=True)

        if labels is None:
            labels = ["SAFE", "PHISHING"]

        # Save labels
        labels_path = out_dir / "labels.json"
        with open(labels_path, "w", encoding="utf-8") as f:
            json.dump(labels, f, indent=2)
        logger.info("Labels exported to %s", labels_path)

        # TODO: Export tokeniser vocabulary
        # TODO: Export model metadata (input shape, version, etc.)

    def validate_export(self, tflite_path: str | Path) -> dict[str, Any]:
        """Validate the exported TFLite model.

        Runs basic checks:
            - File exists and is non-empty
            - Model can be loaded by the TFLite interpreter
            - Input/output tensor shapes match expectations

        Args:
            tflite_path: Path to the exported ``.tflite`` file.

        Returns:
            Validation report dictionary.
        """
        path = Path(tflite_path)

        report: dict[str, Any] = {
            "file_exists": path.exists(),
            "file_size_bytes": path.stat().st_size if path.exists() else 0,
            "is_loadable": False,
            "input_shape": None,
            "output_shape": None,
        }

        # TODO: Load with TFLite interpreter and verify shapes
        # interpreter = tf.lite.Interpreter(model_path=str(path))
        # interpreter.allocate_tensors()
        # input_details = interpreter.get_input_details()
        # output_details = interpreter.get_output_details()
        # report["is_loadable"] = True
        # report["input_shape"] = input_details[0]["shape"].tolist()
        # report["output_shape"] = output_details[0]["shape"].tolist()

        logger.info("Export validation: %s", report)
        return report
