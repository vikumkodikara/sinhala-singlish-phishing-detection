"""
Configuration Management
=========================

Loads pipeline settings from a YAML file and exposes them as typed
attributes.  Supports environment-variable overrides for secrets and
CI-specific values.

Usage::

    from ml_engine.utils.config import Config
    cfg = Config.from_yaml("configs/config.yaml")
    print(cfg.pipeline.batch_size)

Author:
    Vikum Kodikara
"""

from __future__ import annotations

import logging
import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Nested configuration data-classes
# ---------------------------------------------------------------------------

@dataclass
class PipelineConfig:
    """Hyper-parameters and runtime options for the training pipeline."""

    batch_size: int = 32
    learning_rate: float = 1e-3
    epochs: int = 10
    max_sequence_length: int = 128
    random_seed: int = 42


@dataclass
class DataConfig:
    """Paths and parameters for dataset handling."""

    raw_dir: str = "dataset/raw"
    processed_dir: str = "dataset/processed"
    annotations_dir: str = "dataset/annotations"
    test_size: float = 0.2
    validation_size: float = 0.1


@dataclass
class ModelConfig:
    """Model architecture settings."""

    model_type: str = "bilstm"  # Options: bilstm, transformer, hybrid
    embedding_dim: int = 128
    hidden_dim: int = 256
    num_layers: int = 2
    dropout: float = 0.3


@dataclass
class ExportConfig:
    """Export and deployment settings."""

    export_dir: str = "results/models"
    tflite_filename: str = "model.tflite"
    quantize: bool = True


@dataclass
class Config:
    """Top-level configuration container.

    Attributes:
        pipeline: Training pipeline hyper-parameters.
        data: Dataset paths and split ratios.
        model: Model architecture settings.
        export: Export and deployment options.
    """

    pipeline: PipelineConfig = field(default_factory=PipelineConfig)
    data: DataConfig = field(default_factory=DataConfig)
    model: ModelConfig = field(default_factory=ModelConfig)
    export: ExportConfig = field(default_factory=ExportConfig)

    # --------------------------------------------------------------------- #
    # Factory
    # --------------------------------------------------------------------- #

    @classmethod
    def from_yaml(cls, path: str | Path) -> "Config":
        """Load configuration from a YAML file.

        Args:
            path: Path to the YAML configuration file.

        Returns:
            A fully-populated :class:`Config` instance.

        Raises:
            FileNotFoundError: If *path* does not exist.

        .. note::
            Environment variables prefixed with ``ML_`` override the
            corresponding YAML values.  For example, ``ML_BATCH_SIZE=64``
            overrides ``pipeline.batch_size``.
        """
        # TODO: Implement YAML loading with PyYAML once added to requirements
        config_path = Path(path)
        if not config_path.exists():
            raise FileNotFoundError(f"Configuration file not found: {config_path}")

        logger.info("Loading configuration from %s", config_path)

        # TODO: Parse YAML and map to dataclass fields
        # TODO: Apply environment variable overrides (ML_BATCH_SIZE, etc.)

        config = cls()
        config._apply_env_overrides()
        return config

    def _apply_env_overrides(self) -> None:
        """Apply environment-variable overrides prefixed with ``ML_``.

        Supported overrides:
            - ``ML_BATCH_SIZE`` → ``pipeline.batch_size``
            - ``ML_LEARNING_RATE`` → ``pipeline.learning_rate``
            - ``ML_EPOCHS`` → ``pipeline.epochs``
            - ``ML_MODEL_TYPE`` → ``model.model_type``
            - ``ML_RANDOM_SEED`` → ``pipeline.random_seed``
        """
        env_map: dict[str, tuple[Any, str, type]] = {
            "ML_BATCH_SIZE": (self.pipeline, "batch_size", int),
            "ML_LEARNING_RATE": (self.pipeline, "learning_rate", float),
            "ML_EPOCHS": (self.pipeline, "epochs", int),
            "ML_MODEL_TYPE": (self.model, "model_type", str),
            "ML_RANDOM_SEED": (self.pipeline, "random_seed", int),
        }

        for env_var, (obj, attr, cast) in env_map.items():
            value = os.environ.get(env_var)
            if value is not None:
                setattr(obj, attr, cast(value))
                logger.info("Override from env: %s = %s", env_var, value)
