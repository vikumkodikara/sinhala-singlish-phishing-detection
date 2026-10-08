"""
Handcrafted Feature Extraction Pipeline

Extracts the 9 engineered URL and linguistic features expected by the
multi-input BiGRU model.

SECURITY ASSURANCE:
This module treats all URLs purely as static text patterns.
It NEVER performs DNS resolution, socket connections, HTTP requests,
or external URL crawling.
"""
from __future__ import annotations

import re
from typing import Dict, List, Any
import numpy as np


# URL pattern matching standard web URLs and www prefixes
URL_PATTERN = re.compile(r"https?://[^\s]+|www\.[^\s]+", re.IGNORECASE)

# Domain pattern for subdomain counting
DOMAIN_PATTERN = re.compile(r"https?://([^/]+)", re.IGNORECASE)

# Digits pattern
DIGIT_PATTERN = re.compile(r"\d")

# Research vocabulary for suspicious financial/urgency keywords
SUSPICIOUS_WORDS = [
    "otp",
    "verify",
    "verification",
    "account",
    "bank",
    "password",
    "urgent",
    "click",
    "win",
    "winner",
    "free",
    "prize",
    "refund",
    "loan",
    "payment",
    "deposit",
    "register",
]

FEATURE_NAMES = [
    "url_count",
    "url_length",
    "subdomain_count",
    "digit_count",
    "exclamation_count",
    "question_count",
    "text_length",
    "word_count",
    "suspicious_word_count",
]


def extract_features(text: str) -> Dict[str, int]:
    """Extract the exact 9 handcrafted features from the text.

    Args:
        text: Normalized message text string.

    Returns:
        Dictionary mapping each feature name to its integer value.
    """
    text = str(text) if text is not None else ""

    # 1. URL count and max URL length
    urls = URL_PATTERN.findall(text)
    url_count = len(urls)
    url_length = max([len(u) for u in urls]) if urls else 0

    # 2. Subdomain count
    subdomain_count = 0
    for u in urls:
        # Prepend http:// if www is used without protocol for uniform regex parsing
        if not u.startswith(("http://", "https://")):
            u = "http://" + u
        domain_match = DOMAIN_PATTERN.search(u)
        if domain_match:
            domain = domain_match.group(1)
            # A standard domain like example.com has 1 dot -> 0 subdomains
            # a.b.example.com has 3 dots -> 2 subdomains
            subdomain_count += max(0, domain.count(".") - 1)

    # 3. Digit count
    digit_count = len(DIGIT_PATTERN.findall(text))

    # 4. Punctuation counts
    exclamation_count = text.count("!")
    question_count = text.count("?")

    # 5. Text length and Word count
    text_length = len(text)
    words = text.split()
    word_count = len(words)

    # 6. Suspicious word count
    lower_text = text.lower()
    suspicious_count = sum(word in lower_text for word in SUSPICIOUS_WORDS)

    return {
        "url_count": int(url_count),
        "url_length": int(url_length),
        "subdomain_count": int(subdomain_count),
        "digit_count": int(digit_count),
        "exclamation_count": int(exclamation_count),
        "question_count": int(question_count),
        "text_length": int(text_length),
        "word_count": int(word_count),
        "suspicious_word_count": int(suspicious_count),
    }


def scale_features(
    features_dict: Dict[str, int],
    scaler_mean: List[float],
    scaler_scale: List[float],
) -> np.ndarray:
    """Standardize the 9 handcrafted features using the training set parameters.

    (x - mean) / scale

    Args:
        features_dict: Dictionary containing the 9 raw features.
        scaler_mean: Mean vector from StandardScaler fitted on training set.
        scaler_scale: Standard deviation (scale) vector from StandardScaler.

    Returns:
        2D NumPy array of shape (1, 9) with standardized float32 values.
    """
    raw_vector = np.array(
        [
            features_dict["url_count"],
            features_dict["url_length"],
            features_dict["subdomain_count"],
            features_dict["digit_count"],
            features_dict["exclamation_count"],
            features_dict["question_count"],
            features_dict["text_length"],
            features_dict["word_count"],
            features_dict["suspicious_word_count"],
        ],
        dtype=np.float32,
    )

    mean_vec = np.array(scaler_mean, dtype=np.float32)
    scale_vec = np.array(scaler_scale, dtype=np.float32)

    # Avoid division by zero
    scale_vec = np.where(scale_vec == 0.0, 1.0, scale_vec)

    scaled_vector = (raw_vector - mean_vec) / scale_vec
    return np.expand_dims(scaled_vector, axis=0)
