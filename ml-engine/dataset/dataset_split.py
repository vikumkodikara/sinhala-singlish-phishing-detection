"""
Dataset Splitting
==================

Provides stratified splitting of the phishing detection dataset into
train, validation, and test partitions while respecting class balance.

Design decisions:
    - Stratified splitting ensures proportional label representation.
    - A fixed random seed guarantees reproducibility.
    - Split metadata is saved alongside the data for traceability.

Usage::

    from ml_engine.dataset.dataset_split import split_dataset

    splits = split_dataset(records, test_size=0.2, val_size=0.1)
    print(f"Train: {len(splits['train'])}")

Author:
    Vikum Kodikara
"""

from __future__ import annotations

import json
import logging
import random
from collections import defaultdict
from pathlib import Path
from typing import Any, TypedDict

logger = logging.getLogger(__name__)


class DatasetSplits(TypedDict):
    """Type definition for the split output."""

    train: list[dict[str, Any]]
    validation: list[dict[str, Any]]
    test: list[dict[str, Any]]


def split_dataset(
    records: list[dict[str, Any]],
    *,
    test_size: float = 0.2,
    val_size: float = 0.1,
    random_seed: int = 42,
    stratify_key: str = "label",
) -> DatasetSplits:
    """Split the dataset into train, validation, and test sets.

    Uses stratified sampling to preserve label distribution across
    all partitions.

    Args:
        records: List of record dictionaries (must contain *stratify_key*).
        test_size: Fraction of data reserved for testing (0.0–1.0).
        val_size: Fraction of data reserved for validation (0.0–1.0).
        random_seed: Random seed for reproducibility.
        stratify_key: Key in each record to use for stratification.

    Returns:
        A :class:`DatasetSplits` dictionary with ``train``, ``validation``,
        and ``test`` lists.

    Raises:
        ValueError: If *test_size* + *val_size* >= 1.0.
        ValueError: If *records* is empty.

    Example::

        >>> records = [{"text": "msg", "label": "SAFE"}] * 100
        >>> splits = split_dataset(records, test_size=0.2, val_size=0.1)
        >>> len(splits["train"])
        70
    """
    if not records:
        raise ValueError("Cannot split an empty dataset.")

    if test_size + val_size >= 1.0:
        raise ValueError(
            f"test_size ({test_size}) + val_size ({val_size}) must be < 1.0"
        )

    logger.info(
        "Splitting %d records (test=%.1f%%, val=%.1f%%, seed=%d)",
        len(records),
        test_size * 100,
        val_size * 100,
        random_seed,
    )

    # TODO: Replace with sklearn.model_selection.train_test_split for
    #       production-grade stratified splitting.

    rng = random.Random(random_seed)

    # Group by stratum
    strata: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for record in records:
        key = record.get(stratify_key, "UNKNOWN")
        strata[key].append(record)

    train: list[dict[str, Any]] = []
    validation: list[dict[str, Any]] = []
    test: list[dict[str, Any]] = []

    for label, group in strata.items():
        rng.shuffle(group)
        n = len(group)
        n_test = max(1, int(n * test_size))
        n_val = max(1, int(n * val_size))

        test.extend(group[:n_test])
        validation.extend(group[n_test : n_test + n_val])
        train.extend(group[n_test + n_val :])

        logger.debug(
            "Stratum '%s': %d train, %d val, %d test",
            label,
            len(group) - n_test - n_val,
            n_val,
            n_test,
        )

    logger.info(
        "Split complete — Train: %d | Val: %d | Test: %d",
        len(train),
        len(validation),
        len(test),
    )

    return DatasetSplits(train=train, validation=validation, test=test)


def save_splits(
    splits: DatasetSplits,
    output_dir: str | Path = "dataset/processed",
) -> None:
    """Save dataset splits to JSON files.

    Creates ``train.json``, ``validation.json``, and ``test.json`` in the
    *output_dir*.

    Args:
        splits: The dataset splits to save.
        output_dir: Directory to write split files to.
    """
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    for split_name, records in splits.items():
        file_path = output_path / f"{split_name}.json"
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(records, f, ensure_ascii=False, indent=2)
        logger.info("Saved %d records to %s", len(records), file_path)

    # Save split metadata
    metadata = {
        "train_size": len(splits["train"]),
        "validation_size": len(splits["validation"]),
        "test_size": len(splits["test"]),
        "total": sum(len(v) for v in splits.values()),
    }
    meta_path = output_path / "split_metadata.json"
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    logger.info("Split metadata saved to %s", meta_path)
