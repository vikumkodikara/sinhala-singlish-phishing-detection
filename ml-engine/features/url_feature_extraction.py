"""
URL-Based Feature Extraction
==============================

Extracts features from URLs embedded in SMS messages that are indicative
of phishing attacks.

Features extracted:

- **Structural**: URL length, path depth, number of subdomains,
  use of IP address vs domain, port presence.
- **Lexical**: Presence of suspicious keywords (e.g. "login", "verify",
  "bank"), use of URL shorteners, character entropy.
- **Domain**: TLD analysis, domain age (if WHOIS available), similarity
  to known legitimate domains (typo-squatting detection).

Usage::

    from ml_engine.features.url_feature_extraction import extract_url_features

    features = extract_url_features("https://fake-bank.example.com/login?id=123")

Author:
    Vikum Kodikara
"""

from __future__ import annotations

import logging
import math
import re
from collections import Counter
from typing import Any, Dict, List, Optional
from urllib.parse import urlparse

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

#: Keywords commonly found in phishing URLs
SUSPICIOUS_KEYWORDS: List[str] = [
    "login", "verify", "update", "secure", "account", "confirm",
    "banking", "password", "signin", "authenticate", "suspend",
    "urgent", "alert", "notification", "click", "free", "prize",
    "winner", "offer", "limited", "expire",
]

#: Known URL-shortening services
URL_SHORTENERS: List[str] = [
    "bit.ly", "tinyurl.com", "goo.gl", "t.co", "ow.ly",
    "is.gd", "buff.ly", "rebrand.ly", "cutt.ly",
]

#: Common legitimate Sri Lankan banking domains (for similarity check)
LEGITIMATE_DOMAINS: List[str] = [
    "combank.lk", "sampath.lk", "hnb.lk", "boc.lk", "peoplesbank.lk",
    "nsb.lk", "seylan.lk", "dfcc.lk", "ndb.lk",
]


# ---------------------------------------------------------------------------
# Feature extraction functions
# ---------------------------------------------------------------------------

def compute_entropy(text: str) -> float:
    """Compute Shannon entropy of a string.

    High entropy may indicate randomised / obfuscated URLs.

    Args:
        text: Input string.

    Returns:
        Shannon entropy value (bits).
    """
    if not text:
        return 0.0

    freq = Counter(text)
    length = len(text)
    entropy = -sum(
        (count / length) * math.log2(count / length)
        for count in freq.values()
    )
    return round(entropy, 4)


def is_ip_address(hostname: str) -> bool:
    """Check whether *hostname* is an IP address.

    Args:
        hostname: The hostname portion of a URL.

    Returns:
        ``True`` if the hostname appears to be an IPv4 or IPv6 address.
    """
    ipv4_pattern = re.compile(r"^\d{1,3}(\.\d{1,3}){3}$")
    if ipv4_pattern.match(hostname):
        return True
    # TODO: Add IPv6 detection
    return False


def count_suspicious_keywords(url: str) -> int:
    """Count the number of suspicious keywords present in the URL.

    Args:
        url: Full URL string.

    Returns:
        Count of matching keywords.
    """
    url_lower = url.lower()
    return sum(1 for kw in SUSPICIOUS_KEYWORDS if kw in url_lower)


def is_url_shortened(hostname: str) -> bool:
    """Check if the URL uses a known shortening service.

    Args:
        hostname: The hostname portion of a URL.

    Returns:
        ``True`` if the hostname matches a known URL shortener.
    """
    return hostname.lower() in URL_SHORTENERS


def compute_domain_similarity(
    domain: str,
    legitimate_domains: Optional[List[str]] = None,
) -> float:
    """Compute maximum similarity to known legitimate domains.

    Uses a simple character-level edit distance ratio.  Higher values
    indicate potential typo-squatting.

    Args:
        domain: The domain to check.
        legitimate_domains: List of known legitimate domains to compare
            against.  Defaults to Sri Lankan banking domains.

    Returns:
        Similarity score (0.0–1.0).  Values above 0.7 are suspicious.
    """
    # TODO: Implement Levenshtein distance or Jaro-Winkler similarity
    # TODO: Consider using the `rapidfuzz` library for performance
    if legitimate_domains is None:
        legitimate_domains = LEGITIMATE_DOMAINS

    logger.debug("Computing domain similarity for '%s'", domain)
    return 0.0  # Placeholder


def extract_url_features(url: str) -> Dict[str, Any]:
    """Extract a comprehensive feature dictionary from a URL.

    This is the primary entry point for URL feature extraction.

    Args:
        url: The URL string to analyse.

    Returns:
        Dictionary of features:
            - ``url_length``: Total character count.
            - ``path_depth``: Number of ``/``-separated path segments.
            - ``num_subdomains``: Number of subdomain levels.
            - ``has_ip_address``: Whether the host is an IP address.
            - ``has_port``: Whether a non-standard port is specified.
            - ``uses_https``: Whether the scheme is HTTPS.
            - ``is_shortened``: Whether a URL shortener is used.
            - ``num_suspicious_keywords``: Count of phishing keywords.
            - ``url_entropy``: Shannon entropy of the full URL.
            - ``domain_similarity_score``: Similarity to legitimate domains.
            - ``num_query_params``: Number of query parameters.
            - ``has_at_symbol``: Presence of ``@`` (credential phishing).

    Example::

        >>> features = extract_url_features("https://example.com/login")
        >>> features["uses_https"]
        True
    """
    logger.debug("Extracting URL features from: %s", url[:80])

    parsed = urlparse(url)
    hostname = parsed.hostname or ""
    path = parsed.path or ""

    features: Dict[str, Any] = {
        "url_length": len(url),
        "path_depth": len([seg for seg in path.split("/") if seg]),
        "num_subdomains": max(0, hostname.count(".") - 1) if hostname else 0,
        "has_ip_address": is_ip_address(hostname),
        "has_port": parsed.port is not None and parsed.port not in (80, 443),
        "uses_https": parsed.scheme.lower() == "https",
        "is_shortened": is_url_shortened(hostname),
        "num_suspicious_keywords": count_suspicious_keywords(url),
        "url_entropy": compute_entropy(url),
        "domain_similarity_score": compute_domain_similarity(hostname),
        "num_query_params": len(parsed.query.split("&")) if parsed.query else 0,
        "has_at_symbol": "@" in url,
    }

    logger.debug("URL features extracted: %s", features)
    return features


def extract_urls_from_text(text: str) -> List[str]:
    """Extract all URLs from a text string.

    Args:
        text: Input text.

    Returns:
        List of URL strings found in the text.
    """
    url_pattern = re.compile(
        r"https?://[^\s<>\"']+|www\.[^\s<>\"']+",
        re.IGNORECASE,
    )
    urls = url_pattern.findall(text)
    logger.debug("Found %d URL(s) in text", len(urls))
    return urls
