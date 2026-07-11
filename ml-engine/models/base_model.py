"""
Base Model Architecture
========================

Defines the abstract interface that all phishing-detection models must
implement, ensuring consistent APIs for training, prediction, evaluation,
saving, and loading.

Concrete implementations (planned):
    - ``BiLSTMModel``: Bidirectional LSTM with attention.
    - ``TransformerModel``: Lightweight Transformer encoder.
    - ``HybridModel``: Combines linguistic features with deep-learning
      embeddings.

Usage::

    from ml_engine.models.base_model import BaseModel

    class MyModel(BaseModel):
        def build(self) -> None: ...
        def train(self, train_data, val_data) -> dict: ...
        def predict(self, texts) -> list: ...

Author:
    Vikum Kodikara
"""

from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence

logger = logging.getLogger(__name__)


class BaseModel(ABC):
    """Abstract base class for all phishing-detection models.

    Attributes:
        model_name: Human-readable model identifier.
        model_version: Semantic version string.
        config: Model-specific configuration dictionary.
        is_built: Whether :meth:`build` has been called.
        is_trained: Whether :meth:`train` has been called.
    """

    def __init__(
        self,
        model_name: str = "base_model",
        model_version: str = "0.1.0",
        config: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Initialise the base model.

        Args:
            model_name: Identifier for logging and serialisation.
            model_version: Semantic version string.
            config: Model-specific hyperparameters and options.
        """
        self.model_name = model_name
        self.model_version = model_version
        self.config = config or {}
        self.is_built: bool = False
        self.is_trained: bool = False

        logger.info(
            "Model '%s' v%s initialised",
            self.model_name,
            self.model_version,
        )

    # ------------------------------------------------------------------ #
    # Abstract interface
    # ------------------------------------------------------------------ #

    @abstractmethod
    def build(self) -> None:
        """Construct the model architecture.

        Must be called before :meth:`train` or :meth:`predict`.

        Raises:
            RuntimeError: If dependencies are not available.
        """
        ...

    @abstractmethod
    def train(
        self,
        train_data: Sequence[Dict[str, Any]],
        val_data: Optional[Sequence[Dict[str, Any]]] = None,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        """Train the model on the provided data.

        Args:
            train_data: Training records (each with ``text`` and ``label``).
            val_data: Optional validation records.
            **kwargs: Additional training arguments (e.g. ``epochs``,
                ``batch_size``).

        Returns:
            Dictionary of training metrics (e.g. ``loss``, ``accuracy``).
        """
        ...

    @abstractmethod
    def predict(self, texts: Sequence[str]) -> List[Dict[str, Any]]:
        """Run inference on a batch of texts.

        Args:
            texts: List of preprocessed text strings.

        Returns:
            List of prediction dictionaries, each containing:
                - ``label``: Predicted class (``SAFE`` or ``PHISHING``).
                - ``confidence``: Prediction confidence (0.0–1.0).
                - ``risk_score``: Numeric risk score (0.0–1.0).
        """
        ...

    # ------------------------------------------------------------------ #
    # Concrete methods
    # ------------------------------------------------------------------ #

    def save(self, directory: str | Path) -> None:
        """Save the model weights and configuration.

        Args:
            directory: Output directory.  Created if it does not exist.
        """
        # TODO: Implement model serialisation (TensorFlow SavedModel / ONNX)
        save_dir = Path(directory)
        save_dir.mkdir(parents=True, exist_ok=True)
        logger.info("Model '%s' saved to %s", self.model_name, save_dir)

    def load(self, directory: str | Path) -> None:
        """Load model weights and configuration.

        Args:
            directory: Directory containing saved model files.

        Raises:
            FileNotFoundError: If the directory does not exist.
        """
        # TODO: Implement model loading
        load_dir = Path(directory)
        if not load_dir.exists():
            raise FileNotFoundError(f"Model directory not found: {load_dir}")
        logger.info("Model '%s' loaded from %s", self.model_name, load_dir)

    def summary(self) -> str:
        """Return a human-readable model summary.

        Returns:
            Multi-line string describing the model architecture.
        """
        # TODO: Implement detailed summary (layer-by-layer for neural models)
        return (
            f"Model: {self.model_name} v{self.model_version}\n"
            f"Built: {self.is_built}\n"
            f"Trained: {self.is_trained}\n"
            f"Config: {self.config}\n"
        )

    def __repr__(self) -> str:
        return (
            f"{self.__class__.__name__}("
            f"name={self.model_name!r}, "
            f"version={self.model_version!r})"
        )
