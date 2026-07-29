"""Tests for dataset merging."""

from __future__ import annotations

from pathlib import Path

from ml_engine.dataset.merge_datasets import merge_datasets, summarise_records


def test_merge_datasets_creates_processed_file(tmp_path: Path) -> None:
    raw_dir = Path("dataset/raw")
    output = tmp_path / "merged.csv"

    records = merge_datasets(raw_dir=raw_dir, output_path=output)
    stats = summarise_records(records)

    assert output.exists()
    assert stats["total"] > 5000
    assert "PHISHING" in stats["label_distribution"]
    assert "SAFE" in stats["label_distribution"]
    assert "google_form" in stats["source_distribution"]
    assert "sms_phishing_v1" in stats["source_distribution"]
