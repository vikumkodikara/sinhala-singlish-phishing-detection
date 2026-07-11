"""
Sinhala/Singlish Phishing Detection — ML Engine
=================================================

A Natural Language Processing pipeline for detecting phishing attempts
in Sinhala and Singlish (romanized Sinhala) mobile messages.

This package provides:
    - Text preprocessing and normalization for Sinhala Unicode and Singlish
    - Feature engineering (linguistic + URL-based)
    - Model training, evaluation, and export to TensorFlow Lite
    - Inference utilities for integration with the Android application

Author:
    Vikum Kodikara

License:
    MIT
"""

__version__ = "0.1.0"
__author__ = "Vikum Kodikara"

# Public API — will be populated as modules are implemented
__all__: list[str] = [
    "preprocessing",
    "dataset",
    "features",
    "models",
    "training",
    "evaluation",
    "export",
    "utils",
]
