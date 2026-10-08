"""
Model Service - Singleton Loader and Inference Runner
=====================================================

Loads the existing research `.keras` model once on startup, along with the
trained tokenizer vocabulary and StandardScaler parameters.

Executes real-time inference across text and handcrafted feature inputs.
"""
from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional

import numpy as np
import tensorflow as tf
from tensorflow.keras.layers import Layer
import keras

from backend.app.schemas.prediction import PredictResponse, DetectedFeatures
from backend.app.services.preprocessing import normalize_text, detect_script, text_to_sequence
from backend.app.services.feature_extraction import extract_features, scale_features

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Custom Attention Layer (Exact match to research architecture)
# ---------------------------------------------------------------------------


@keras.saving.register_keras_serializable(package="Custom")
class AttentionLayer(Layer):
    """Custom Attention Mechanism layer used in the BiGRU model architecture."""

    def __init__(self, **kwargs: Any) -> None:
        super().__init__(**kwargs)
        self.W = None
        self.b = None

    def build(self, input_shape: Any) -> None:
        self.W = self.add_weight(
            name="attention_W",
            shape=(input_shape[-1], 1),
            initializer="glorot_uniform",
            trainable=True,
        )
        self.b = self.add_weight(
            name="attention_b",
            shape=(input_shape[1], 1),
            initializer="zeros",
            trainable=True,
        )
        super().build(input_shape)

    def call(self, inputs: tf.Tensor) -> tf.Tensor:
        # inputs: (batch, seq_len, dim)
        score = tf.tanh(tf.matmul(inputs, self.W) + self.b)
        attention_weights = tf.nn.softmax(score, axis=1)
        context = inputs * attention_weights
        context = tf.reduce_sum(context, axis=1)
        return context

    def get_config(self) -> Dict[str, Any]:
        return super().get_config()


# ---------------------------------------------------------------------------
# Model Service
# ---------------------------------------------------------------------------


class ModelService:
    """Singleton service to hold the loaded Keras model and preprocessing assets."""

    _instance: Optional[ModelService] = None

    def __init__(self, models_dir: Optional[Path] = None) -> None:
        if models_dir is None:
            models_dir = Path(__file__).resolve().parents[2] / "models"
        self.models_dir = Path(models_dir)
        self.model: Optional[keras.Model] = None
        self.tokenizer_data: Dict[str, Any] = {}
        self.word_index: Dict[str, int] = {}
        self.scaler_data: Dict[str, Any] = {}
        self.scaler_mean: list[float] = []
        self.scaler_scale: list[float] = []
        self.labels_data: Dict[str, Any] = {}
        self.threshold: float = 0.5
        self.max_length: int = 120
        self.is_initialized: bool = False

    @classmethod
    def get_instance(cls, models_dir: Optional[Path] = None) -> ModelService:
        if cls._instance is None:
            cls._instance = ModelService(models_dir)
        return cls._instance

    def load(self) -> None:
        """Load the `.keras` model, tokenizer, and feature scaler once into memory."""
        if self.is_initialized:
            logger.info("ModelService is already initialized.")
            return

        model_path = self.models_dir / "phishing_model.keras"
        tokenizer_path = self.models_dir / "tokenizer.json"
        scaler_path = self.models_dir / "feature_scaler.json"
        labels_path = self.models_dir / "labels.json"

        if not model_path.exists():
            raise FileNotFoundError(
                f"Trained Keras model not found at {model_path}. "
                "Ensure the model file exists."
            )

        logger.info("Loading Keras model from %s ...", model_path)
        self.model = keras.models.load_model(
            str(model_path),
            custom_objects={"AttentionLayer": AttentionLayer},
            compile=False,
        )

        # Load Tokenizer vocabulary
        if tokenizer_path.exists():
            with open(tokenizer_path, "r", encoding="utf-8") as f:
                self.tokenizer_data = json.load(f)
                self.word_index = self.tokenizer_data.get("word_index", {})
                self.max_length = self.tokenizer_data.get("max_length", 120)
                logger.info(
                    "Loaded tokenizer vocabulary with %d tokens.",
                    len(self.word_index),
                )
        else:
            raise FileNotFoundError(f"Tokenizer file not found at {tokenizer_path}")

        # Load Feature Scaler
        if scaler_path.exists():
            with open(scaler_path, "r", encoding="utf-8") as f:
                self.scaler_data = json.load(f)
                self.scaler_mean = self.scaler_data.get("mean", [])
                self.scaler_scale = self.scaler_data.get("scale", [])
                logger.info("Loaded feature scaler parameters.")
        else:
            raise FileNotFoundError(f"Feature scaler file not found at {scaler_path}")

        # Load Labels & Threshold
        if labels_path.exists():
            with open(labels_path, "r", encoding="utf-8") as f:
                self.labels_data = json.load(f)
                self.threshold = float(self.labels_data.get("threshold", 0.5))

        self.is_initialized = True
        logger.info(
            "ModelService successfully initialized. Model: %s, Vocab size: %d",
            getattr(self.model, "name", "BiGRU"),
            len(self.word_index),
        )

    def predict(self, raw_message: str) -> PredictResponse:
        """Run complete phishing detection on a raw message.

        Args:
            raw_message: Raw user-submitted SMS or mobile message text.

        Returns:
            PredictResponse schema with prediction, probability, confidence,
            risk level, script detection, and extracted features.
        """
        if not self.is_initialized or self.model is None:
            raise RuntimeError("Model is not loaded. Ensure startup initialization succeeded.")

        # Step 1: Preprocessing & Normalization
        cleaned_text = normalize_text(raw_message)
        detected_script = detect_script(cleaned_text)

        # Step 2: Tokenization and Sequence Padding
        seq_array = text_to_sequence(
            cleaned_text,
            self.word_index,
            max_length=self.max_length,
        )
        seq_input = np.expand_dims(seq_array, axis=0)  # shape: (1, 120)

        # Step 3: 9 Handcrafted Features Extraction & Scaling
        raw_features = extract_features(cleaned_text)
        scaled_feature_input = scale_features(
            raw_features,
            self.scaler_mean,
            self.scaler_scale,
        )  # shape: (1, 9)

        # Step 4: Model Inference (Multi-input)
        raw_prob_array = self.model.predict(
            {"text_input": seq_input, "feature_input": scaled_feature_input},
            verbose=0,
        )
        phishing_probability = float(raw_prob_array[0][0])

        # Step 5: Decision Logic & Categorization
        is_phishing = phishing_probability >= self.threshold
        prediction_label = "PHISHING" if is_phishing else "SAFE"

        # Model Confidence: percentage closeness to the predicted state
        if is_phishing:
            confidence_pct = round(phishing_probability * 100.0, 2)
        else:
            confidence_pct = round((1.0 - phishing_probability) * 100.0, 2)

        # Risk Level
        if phishing_probability >= 0.70:
            risk_level = "HIGH"
        elif phishing_probability >= 0.40:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        # Scientific transparency advisory
        warning = None
        if not is_phishing:
            warning = "No strong phishing signal was detected by the model. Note: 'SAFE' is a probabilistic assessment and does not constitute guaranteed safety."

        return PredictResponse(
            prediction=prediction_label,
            probability=round(phishing_probability, 4),
            confidence=confidence_pct,
            risk_level=risk_level,
            detected_script=detected_script,
            preprocessed_text=cleaned_text,
            detected_features=DetectedFeatures(**raw_features),
            warning=warning,
        )

    def get_info(self) -> Dict[str, Any]:
        """Return metadata about the loaded research model."""
        return {
            "model_name": getattr(self.model, "name", "Sinhala_Singlish_Phishing_BiGRU_Model"),
            "architecture": "Bidirectional GRU + Attention Layer + 9 Handcrafted Features",
            "framework": "TensorFlow / Keras 3 (Real Inference)",
            "max_sequence_length": self.max_length,
            "vocabulary_size": len(self.word_index),
            "handcrafted_features": [
                "url_count",
                "url_length",
                "subdomain_count",
                "digit_count",
                "exclamation_count",
                "question_count",
                "text_length",
                "word_count",
                "suspicious_word_count",
            ],
            "dataset": {
                "total_records": 10040,
                "synthetic_records": 10000,
                "real_messages": 40,
                "classes": ["SAFE", "PHISHING"],
                "train_split": "70%",
                "val_split": "15%",
                "test_split": "15%",
            },
            "benchmarks": {
                "synthetic_heavy_random_split": {
                    "description": "Synthetic-heavy random-split held-out test set (1,344 samples)",
                    "accuracy": 1.0,
                    "precision": 1.0,
                    "recall": 1.0,
                    "f1_score": 1.0,
                    "roc_auc": 1.0,
                    "confusion_matrix": {
                        "tn": 327,
                        "fp": 0,
                        "fn": 0,
                        "tp": 1017,
                    },
                    "note": "Archived random-split benchmark. Does not reflect general out-of-distribution performance.",
                },
                "real_world_message_audit": {
                    "description": "Real-world authentic message holdout evaluation (28 messages)",
                    "accuracy": 0.9286,
                    "precision": 1.0,
                    "recall": 0.9231,
                    "f1_score": 0.9600,
                    "roc_auc": 0.9808,
                    "confusion_matrix": {
                        "safe_correct": 2,
                        "safe_missed": 0,
                        "phishing_correct": 24,
                        "phishing_missed": 2,
                    },
                    "note": "Exploratory real-message audit with small sample size. Presented for scientific transparency.",
                },
            },
            "disclaimer": "This system is a university research prototype designed for AI-assisted mobile phishing detection in Sinhala and Singlish. Predictions are probabilistic and intended for research and security demonstration purposes.",
        }
