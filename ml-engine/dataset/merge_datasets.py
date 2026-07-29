"""
Dataset merging utilities
=========================

Normalises raw Google Form survey responses and the SMS phishing corpus
into a single schema with ``SAFE`` / ``PHISHING`` labels.
"""

from __future__ import annotations

import csv
import logging
from collections.abc import Iterable
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

GOOGLE_FORM_FILENAME = "google_form_sms_dataset.csv"
SMS_CORPUS_FILENAME = "sms_phishing_dataset_v1.csv"
OUTPUT_FILENAME = "final_sms_phishing_dataset.csv"

GOOGLE_FORM_TEXT_COLUMN = "  Copy and paste the SMS here  "
GOOGLE_FORM_CATEGORY_COLUMN = "What best describes this SMS?"
GOOGLE_FORM_LANGUAGE_COLUMN = "What language is the SMS mostly written in? "
GOOGLE_FORM_CONSENT_COLUMN = "Do you agree to take part in this survey? "

GOOGLE_FORM_PHISHING_CATEGORIES = {
    "Phishing (tries to steal credentials or personal information)",
    "Looks like a scam that tries to steal information (Phishing)",
    "Scam (fraud without phishing)",
    "Spam / Advertisement",
    "Spam / Advertisement / Promotion",
    "Looks suspicious but I'm not sure (Scam)",
}

GOOGLE_FORM_SAFE_CATEGORIES = {
    "Legitimate",
    "Normal SMS",
}


def _normalise_label_google_form(category: str) -> str | None:
    """Map a survey category to SAFE/PHISHING, or None to skip."""
    category = category.strip()
    if category in GOOGLE_FORM_PHISHING_CATEGORIES:
        return "PHISHING"
    if category in GOOGLE_FORM_SAFE_CATEGORIES:
        return "SAFE"
    return None


def _normalise_label_sms_corpus(label: str, final_label: str) -> str:
    """Map corpus labels to SAFE/PHISHING."""
    final_label = (final_label or "").strip()
    if final_label in {"Phishing", "Spam"}:
        return "PHISHING"
    if final_label == "Legitimate":
        return "SAFE"

    label = (label or "").strip().lower()
    return "PHISHING" if label == "spam" else "SAFE"


def load_google_form_records(path: Path) -> list[dict[str, Any]]:
    """Load and normalise Google Form survey rows."""
    records: list[dict[str, Any]] = []
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for index, row in enumerate(reader, start=1):
            consent = (row.get(GOOGLE_FORM_CONSENT_COLUMN) or "").strip()
            if consent != "Yes, I agree.":
                continue

            text = (row.get(GOOGLE_FORM_TEXT_COLUMN) or "").strip()
            if not text:
                continue

            category = (row.get(GOOGLE_FORM_CATEGORY_COLUMN) or "").strip()
            label = _normalise_label_google_form(category)
            if label is None:
                logger.debug("Skipping unmapped Google Form category: %s", category)
                continue

            records.append(
                {
                    "text_id": f"GF_{index:04d}",
                    "text": text,
                    "label": label,
                    "source": "google_form",
                    "language": (row.get(GOOGLE_FORM_LANGUAGE_COLUMN) or "").strip(),
                    "original_label": category,
                }
            )

    logger.info("Loaded %d Google Form records from %s", len(records), path.name)
    return records


def load_sms_corpus_records(path: Path) -> list[dict[str, Any]]:
    """Load and normalise the SMS phishing benchmark corpus."""
    records: list[dict[str, Any]] = []
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for index, row in enumerate(reader, start=1):
            text = (row.get("message") or "").strip()
            if not text:
                continue

            label = _normalise_label_sms_corpus(
                row.get("label", ""),
                row.get("final_label", ""),
            )
            records.append(
                {
                    "text_id": f"SMS_{index:05d}",
                    "text": text,
                    "label": label,
                    "source": "sms_phishing_v1",
                    "language": "english",
                    "original_label": row.get("final_label") or row.get("label", ""),
                }
            )

    logger.info("Loaded %d SMS corpus records from %s", len(records), path.name)
    return records


def merge_datasets(
    raw_dir: str | Path = "dataset/raw",
    output_path: str | Path = "dataset/processed/final_sms_phishing_dataset.csv",
) -> list[dict[str, Any]]:
    """Merge all raw sources into one normalised dataset."""
    raw_path = Path(raw_dir)
    google_form_path = raw_path / GOOGLE_FORM_FILENAME
    sms_corpus_path = raw_path / SMS_CORPUS_FILENAME

    if not google_form_path.exists():
        raise FileNotFoundError(f"Google Form dataset not found: {google_form_path}")
    if not sms_corpus_path.exists():
        raise FileNotFoundError(f"SMS corpus not found: {sms_corpus_path}")

    records: list[dict[str, Any]] = []
    records.extend(load_google_form_records(google_form_path))
    records.extend(load_sms_corpus_records(sms_corpus_path))

    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    write_merged_csv(records, output)

    logger.info("Wrote %d merged records to %s", len(records), output)
    return records


def write_merged_csv(records: Iterable[dict[str, Any]], path: Path) -> None:
    """Write merged records to CSV."""
    fieldnames = ["text_id", "text", "label", "source", "language", "original_label"]
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)


def summarise_records(records: list[dict[str, Any]]) -> dict[str, Any]:
    """Return basic statistics for merged records."""
    label_counts: dict[str, int] = {}
    source_counts: dict[str, int] = {}

    for record in records:
        label = record["label"]
        source = record["source"]
        label_counts[label] = label_counts.get(label, 0) + 1
        source_counts[source] = source_counts.get(source, 0) + 1

    return {
        "total": len(records),
        "label_distribution": label_counts,
        "source_distribution": source_counts,
    }
