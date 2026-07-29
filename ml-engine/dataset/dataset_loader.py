"""
Dataset Loader
===============

Loads and validates the Sinhala/Singlish SMS phishing dataset from
multiple file formats (CSV, JSON, JSONL).

Responsibilities:
    - File format detection and parsing
    - Schema validation (required columns: ``text``, ``label``)
    - Basic statistics logging (class distribution, text lengths)
    - Optional integration with the preprocessing pipeline

Usage::

    from ml_engine.dataset.dataset_loader import DatasetLoader

    loader = DatasetLoader(data_dir="dataset/raw")
    df = loader.load()
    print(loader.get_statistics(df))

Author:
    Vikum Kodikara
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

REQUIRED_COLUMNS: list[str] = ["text", "label"]
SUPPORTED_EXTENSIONS: list[str] = [".csv", ".json", ".jsonl"]
VALID_LABELS: list[str] = ["SAFE", "PHISHING"]


class DatasetLoader:
    """Loads and validates the phishing detection dataset.

    Attributes:
        data_dir: Root directory containing data files.
        encoding: File encoding.  Defaults to ``"utf-8"``.
    """

    def __init__(
        self,
        data_dir: str | Path = "dataset/raw",
        encoding: str = "utf-8",
    ) -> None:
        """Initialise the dataset loader.

        Args:
            data_dir: Path to the directory containing raw data files.
            encoding: Character encoding of the data files.
        """
        self.data_dir = Path(data_dir)
        self.encoding = encoding
        logger.info("DatasetLoader initialised (data_dir=%s)", self.data_dir)

    def load(self, filename: str | None = None) -> list[dict[str, Any]]:
        """Load the dataset from disk.

        Args:
            filename: Specific file to load.  When ``None``, loads all
                supported files in :attr:`data_dir`.

        Returns:
            List of dictionaries, each containing at minimum ``text``
            and ``label`` keys.

        Raises:
            FileNotFoundError: If :attr:`data_dir` or *filename* does not
                exist.
            ValueError: If required columns are missing.
        """
        if not self.data_dir.exists():
            raise FileNotFoundError(f"Data directory not found: {self.data_dir}")

        # TODO: Implement CSV loading with pandas
        # TODO: Implement JSON / JSONL loading
        # TODO: Validate schema and log warnings for malformed records

        logger.info("Loading dataset from %s", self.data_dir)

        records: list[dict[str, Any]] = []

        if filename:
            file_path = self.data_dir / filename
            records = self._load_file(file_path)
        else:
            for ext in SUPPORTED_EXTENSIONS:
                for file_path in sorted(self.data_dir.glob(f"*{ext}")):
                    records.extend(self._load_file(file_path))

        logger.info("Loaded %d records", len(records))
        self._validate_schema(records)
        return records

    def _load_file(self, path: Path) -> list[dict[str, Any]]:
        """Load records from a single file.

        Args:
            path: Path to the data file.

        Returns:
            List of record dictionaries.

        Raises:
            FileNotFoundError: If the file does not exist.
            ValueError: If the file extension is not supported.
        """
        if not path.exists():
            raise FileNotFoundError(f"File not found: {path}")

        ext = path.suffix.lower()
        if ext not in SUPPORTED_EXTENSIONS:
            raise ValueError(f"Unsupported file format: {ext}")

        logger.debug("Loading file: %s", path)

        # TODO: Implement actual file parsing
        # Placeholder: return empty list
        return []

    def _validate_schema(self, records: list[dict[str, Any]]) -> None:
        """Validate that all records contain the required columns.

        Args:
            records: List of record dictionaries.

        Raises:
            ValueError: If any record is missing required columns.
        """
        for i, record in enumerate(records):
            missing = [col for col in REQUIRED_COLUMNS if col not in record]
            if missing:
                raise ValueError(f"Record {i} is missing required columns: {missing}")

    def get_statistics(self, records: list[dict[str, Any]]) -> dict[str, Any]:
        """Compute basic dataset statistics.

        Args:
            records: List of record dictionaries.

        Returns:
            Dictionary with keys: ``total``, ``label_distribution``,
            ``avg_text_length``, ``min_text_length``, ``max_text_length``.
        """
        if not records:
            return {"total": 0}

        # TODO: Compute text-length statistics
        # TODO: Compute label distribution
        # TODO: Compute language distribution (Sinhala vs Singlish)

        label_counts: dict[str, int] = {}
        text_lengths: list[int] = []

        for record in records:
            label = record.get("label", "UNKNOWN")
            label_counts[label] = label_counts.get(label, 0) + 1
            text_lengths.append(len(record.get("text", "")))

        stats = {
            "total": len(records),
            "label_distribution": label_counts,
            "avg_text_length": (
                sum(text_lengths) / len(text_lengths) if text_lengths else 0
            ),
            "min_text_length": min(text_lengths) if text_lengths else 0,
            "max_text_length": max(text_lengths) if text_lengths else 0,
        }

        logger.info("Dataset statistics: %s", stats)
        return stats
