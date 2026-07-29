"""Bootstrap ``ml_engine`` imports from the ``ml-engine/`` source folder."""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path


def bootstrap() -> Path:
    """Register ``ml_engine`` so scripts can run without an editable install."""
    root = Path(__file__).resolve().parents[1]
    ml_dir = root / "ml-engine"

    if "ml_engine" not in sys.modules:
        spec = importlib.util.spec_from_file_location(
            "ml_engine",
            ml_dir / "__init__.py",
            submodule_search_locations=[str(ml_dir)],
        )
        if spec is None or spec.loader is None:
            raise ImportError(f"Could not load ml_engine from {ml_dir}")

        module = importlib.util.module_from_spec(spec)
        sys.modules["ml_engine"] = module
        spec.loader.exec_module(module)

    if str(root) not in sys.path:
        sys.path.insert(0, str(root))

    return root
