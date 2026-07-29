#!/usr/bin/env python3
"""Preview preprocessing on sample messages from the merged dataset."""

from __future__ import annotations

import argparse
import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts._bootstrap import bootstrap  # noqa: E402

bootstrap()

from ml_engine.preprocessing.pipeline import preprocess_message  # noqa: E402


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Preview SMS preprocessing.")
    parser.add_argument(
        "--input",
        default="dataset/processed/final_sms_phishing_dataset.csv",
        help="Merged dataset CSV to sample from.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=5,
        help="Number of messages to preview.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    input_path = Path(args.input)

    if not input_path.exists():
        print(
            f"Input not found: {input_path}\n"
            "Run `python scripts/merge_datasets.py` first.",
            file=sys.stderr,
        )
        return 1

    with input_path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for index, row in enumerate(reader):
            if index >= args.limit:
                break

            raw_text = row["text"]
            cleaned = preprocess_message(raw_text)
            print(f"--- Sample {index + 1} ({row['source']} / {row['label']}) ---")
            print(f"RAW:       {raw_text[:200]}")
            print(f"CLEANED:   {cleaned[:200]}")
            print()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
