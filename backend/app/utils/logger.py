"""
Logging Configuration for Phishing Detection Service
"""
import logging
import sys


def setup_logger(log_level: str = "INFO") -> logging.Logger:
    """Configure structured, security-conscious logging."""
    numeric_level = getattr(logging, log_level.upper(), logging.INFO)

    logging.basicConfig(
        level=numeric_level,
        format="%(asctime)s | %(levelname)-7s | %(name)s:%(funcName)s:%(lineno)d - %(message)s",
        handlers=[logging.StreamHandler(sys.stdout)],
    )

    logger = logging.getLogger("sinhala_phishing_detector")
    logger.setLevel(numeric_level)
    return logger
