"""
Centralized Logging Configuration
===================================

Provides a consistent logging setup across the entire ML Engine.
All modules should obtain their loggers via ``logging.getLogger(__name__)``
after calling :func:`setup_logger` once at application startup.

Usage::

    from ml_engine.utils.logger import setup_logger
    setup_logger(log_level="DEBUG", log_file="runs/experiment.log")

Author:
    Vikum Kodikara
"""

import logging
import sys
from pathlib import Path


def setup_logger(
    log_level: str = "INFO",
    log_file: str | None = None,
    logger_name: str = "ml_engine",
) -> logging.Logger:
    """Configure and return the root logger for the ML Engine.

    Sets up both a **console** handler (``stdout``) and an optional **file**
    handler so that every module in the package inherits the same format.

    Args:
        log_level: Minimum severity level (``DEBUG``, ``INFO``, ``WARNING``,
            ``ERROR``, ``CRITICAL``).  Defaults to ``"INFO"``.
        log_file: Optional path to a log file.  Parent directories are created
            automatically.  When *None*, only console output is produced.
        logger_name: Name of the logger instance.  Defaults to
            ``"ml_engine"`` so that child loggers (e.g.
            ``ml_engine.preprocessing``) inherit the configuration.

    Returns:
        The configured :class:`logging.Logger` instance.

    Raises:
        ValueError: If *log_level* is not a recognised logging level string.

    Example::

        >>> logger = setup_logger(log_level="DEBUG")
        >>> logger.info("Pipeline started")
    """
    # --- Validate log level --------------------------------------------------
    numeric_level = getattr(logging, log_level.upper(), None)
    if not isinstance(numeric_level, int):
        raise ValueError(f"Invalid log level: {log_level!r}")

    # --- Formatter -----------------------------------------------------------
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # --- Root logger ---------------------------------------------------------
    logger = logging.getLogger(logger_name)
    logger.setLevel(numeric_level)

    # Avoid adding duplicate handlers on repeated calls
    if logger.handlers:
        logger.handlers.clear()

    # --- Console handler -----------------------------------------------------
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(numeric_level)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # --- File handler (optional) ---------------------------------------------
    if log_file is not None:
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)

        file_handler = logging.FileHandler(log_path, encoding="utf-8")
        file_handler.setLevel(numeric_level)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

        logger.debug("File logging enabled → %s", log_path.resolve())

    logger.debug("Logger '%s' initialised at level %s", logger_name, log_level)
    return logger
