"""
Training Pipeline
==================

End-to-end training orchestrator for phishing-detection models.

Pipeline stages:
    1. Load configuration
    2. Load and preprocess dataset
    3. Build feature vectors
    4. Initialise and build model
    5. Train with validation monitoring
    6. Log metrics and save checkpoints
    7. Export final model

Usage::

    # Command-line
    python -m ml_engine.training.train --config configs/config.yaml

    # Programmatic
    from ml_engine.training.train import TrainingPipeline
    pipeline = TrainingPipeline(config_path="configs/config.yaml")
    metrics = pipeline.run()

Author:
    Vikum Kodikara
"""

from __future__ import annotations

import argparse
import logging
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

from ml_engine.utils.config import Config
from ml_engine.utils.logger import setup_logger

logger = logging.getLogger(__name__)


class TrainingPipeline:
    """Orchestrates the full training pipeline.

    Attributes:
        config: Pipeline configuration.
        model: The model instance (initialised during :meth:`run`).
        metrics_history: Per-epoch training metrics.
    """

    def __init__(self, config_path: str | Path = "configs/config.yaml") -> None:
        """Initialise the training pipeline.

        Args:
            config_path: Path to the YAML configuration file.
        """
        self.config_path = Path(config_path)
        self.config: Optional[Config] = None
        self.model: Any = None  # Will be a BaseModel subclass
        self.metrics_history: List[Dict[str, Any]] = []

        logger.info("TrainingPipeline initialised (config=%s)", self.config_path)

    # ------------------------------------------------------------------ #
    # Pipeline stages
    # ------------------------------------------------------------------ #

    def load_config(self) -> Config:
        """Stage 1: Load configuration.

        Returns:
            The loaded :class:`Config` instance.
        """
        logger.info("Stage 1: Loading configuration from %s", self.config_path)
        # TODO: Implement Config.from_yaml() integration
        self.config = Config()
        return self.config

    def load_data(self) -> Dict[str, List[Dict[str, Any]]]:
        """Stage 2: Load and preprocess the dataset.

        Returns:
            Dictionary with ``train``, ``validation``, and ``test`` splits.
        """
        logger.info("Stage 2: Loading and preprocessing dataset")

        # TODO: Integrate DatasetLoader
        # TODO: Apply preprocessing pipeline (clean → normalize → denoise)
        # TODO: Split dataset using dataset_split.split_dataset()

        return {"train": [], "validation": [], "test": []}

    def build_features(
        self, data: Dict[str, List[Dict[str, Any]]]
    ) -> Dict[str, Any]:
        """Stage 3: Extract and combine features.

        Args:
            data: Dataset splits from :meth:`load_data`.

        Returns:
            Feature matrices for each split.
        """
        logger.info("Stage 3: Building feature vectors")

        # TODO: Apply tokeniser to generate token IDs
        # TODO: Extract URL features for messages containing URLs
        # TODO: Extract linguistic features
        # TODO: Combine into unified feature tensors

        return {}

    def build_model(self) -> None:
        """Stage 4: Initialise and build the model architecture."""
        logger.info("Stage 4: Building model architecture")

        # TODO: Select model class based on config.model.model_type
        # TODO: Instantiate and call model.build()

    def train_model(
        self,
        train_features: Any,
        val_features: Any,
    ) -> Dict[str, Any]:
        """Stage 5: Train the model.

        Args:
            train_features: Training feature tensors.
            val_features: Validation feature tensors.

        Returns:
            Final training metrics.
        """
        logger.info("Stage 5: Training model")

        # TODO: Implement training loop with:
        #   - Epoch-level logging
        #   - Validation metric monitoring
        #   - Early stopping
        #   - Learning rate scheduling
        #   - Checkpoint saving

        epochs = self.config.pipeline.epochs if self.config else 10

        for epoch in range(1, epochs + 1):
            # TODO: Replace with actual training step
            epoch_metrics = {
                "epoch": epoch,
                "train_loss": 0.0,
                "train_accuracy": 0.0,
                "val_loss": 0.0,
                "val_accuracy": 0.0,
            }
            self.metrics_history.append(epoch_metrics)
            logger.info("Epoch %d/%d — %s", epoch, epochs, epoch_metrics)

        return self.metrics_history[-1] if self.metrics_history else {}

    def save_model(self, output_dir: str | Path = "results/models") -> None:
        """Stage 6: Save model and training artefacts.

        Args:
            output_dir: Directory to save model files.
        """
        logger.info("Stage 6: Saving model to %s", output_dir)

        # TODO: Save model weights
        # TODO: Save tokeniser
        # TODO: Save training metrics history
        # TODO: Save configuration snapshot

    # ------------------------------------------------------------------ #
    # Orchestrator
    # ------------------------------------------------------------------ #

    def run(self) -> Dict[str, Any]:
        """Execute the full training pipeline.

        Returns:
            Dictionary containing final metrics and model path.
        """
        start_time = time.time()
        logger.info("=" * 60)
        logger.info("Starting training pipeline")
        logger.info("=" * 60)

        # Stage 1
        self.load_config()

        # Stage 2
        data = self.load_data()

        # Stage 3
        features = self.build_features(data)

        # Stage 4
        self.build_model()

        # Stage 5
        metrics = self.train_model(
            train_features=features.get("train"),
            val_features=features.get("validation"),
        )

        # Stage 6
        self.save_model()

        elapsed = time.time() - start_time
        logger.info("=" * 60)
        logger.info("Training pipeline complete (%.1fs)", elapsed)
        logger.info("=" * 60)

        return {
            "final_metrics": metrics,
            "elapsed_seconds": elapsed,
            "epochs_trained": len(self.metrics_history),
        }


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def main() -> None:
    """Command-line entry point for the training pipeline."""
    parser = argparse.ArgumentParser(
        description="Train the Sinhala/Singlish phishing detection model."
    )
    parser.add_argument(
        "--config",
        type=str,
        default="configs/config.yaml",
        help="Path to the configuration YAML file.",
    )
    parser.add_argument(
        "--log-level",
        type=str,
        default="INFO",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        help="Logging level.",
    )
    args = parser.parse_args()

    setup_logger(log_level=args.log_level)

    pipeline = TrainingPipeline(config_path=args.config)
    result = pipeline.run()

    logger.info("Result: %s", result)


if __name__ == "__main__":
    main()
