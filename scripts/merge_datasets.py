#!/usr/bin/env python3
"""Merge raw datasets into a unified processed CSV."""

from __future__ import annotations

import argparse
import json
import logging
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts._bootstrap import bootstrap  # noqa: E402

bootstrap()

from ml_engine.dataset.merge_datasets import (  # noqa: E402
    merge_datasets,
    summarise_records,
)
from ml_engine.utils.logger import setup_logger  # noqa: E402


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Merge raw SMS datasets.")
    parser.add_argument(
        "--raw-dir",
        default="dataset/raw",
        help="Directory containing raw CSV files.",
    )
    parser.add_argument(
        "--output",
        default="dataset/processed/final_sms_phishing_dataset.csv",
        help="Output path for the merged dataset.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    setup_logger(log_level="INFO")

    records = merge_datasets(raw_dir=args.raw_dir, output_path=args.output)
    stats = summarise_records(records)
    print(json.dumps(stats, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
