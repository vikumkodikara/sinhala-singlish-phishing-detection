"""
Text Cleaning Utilities
========================

Provides a multi-stage cleaning pipeline for raw SMS / mobile-message
text, handling common artefacts such as:

- Extra whitespace and newline characters
- HTML entities and tags
- Zero-width Unicode characters
- Mixed-script punctuation normalisation

The cleaning pipeline is designed to be **script-agnostic** so that it
can be applied equally to Sinhala (Unicode) and Singlish (Latin) text.

Usage::

    from ml_engine.preprocessing.clean_text import clean_text, build_cleaning_pipeline

    cleaned = clean_text("  Hello   World!!! ")
    # => "Hello World!!!"

Author:
    Vikum Kodikara
"""

from __future__ import annotations

import logging
import re
import unicodedata
from collections.abc import Callable

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Individual cleaning functions
# ---------------------------------------------------------------------------


def remove_html_tags(text: str) -> str:
    """Strip HTML / XML tags from *text*.

    Args:
        text: Raw input string.

    Returns:
        String with all ``<tag>`` sequences removed.

    Example::

        >>> remove_html_tags("<b>Hello</b> World")
        'Hello World'
    """
    # TODO: Extend to handle HTML entities (e.g. &amp;, &#x200B;)
    return re.sub(r"<[^>]+>", "", text)


def collapse_whitespace(text: str) -> str:
    """Replace multiple consecutive whitespace characters with a single space.

    Args:
        text: Input string potentially containing extra spaces, tabs, or
            newlines.

    Returns:
        String with normalised whitespace.
    """
    return re.sub(r"\s+", " ", text).strip()


def remove_zero_width_chars(text: str) -> str:
    """Remove Unicode zero-width characters.

    These invisible characters frequently appear in Sinhala text copied
    from web sources and can interfere with tokenisation.

    Args:
        text: Input string.

    Returns:
        String with zero-width joiners / non-joiners removed.
    """
    # Zero-width space, joiner, non-joiner, no-break space, etc.
    zero_width_pattern = re.compile("[\u200b\u200c\u200d\u200e\u200f\ufeff\u00a0]")
    return zero_width_pattern.sub("", text)


def normalize_unicode(text: str, form: str = "NFC") -> str:
    """Apply Unicode normalisation.

    Args:
        text: Input string.
        form: Normalisation form — one of ``NFC``, ``NFD``, ``NFKC``,
            ``NFKD``.  Defaults to ``"NFC"`` which is the recommended
            form for Sinhala text processing.

    Returns:
        Unicode-normalised string.
    """
    return unicodedata.normalize(form, text)


def lowercase_latin(text: str) -> str:
    """Lower-case only the Latin (ASCII) portions of *text*.

    Sinhala Unicode characters are unaffected — only A-Z are converted.

    Args:
        text: Input string potentially containing mixed scripts.

    Returns:
        String with Latin characters lower-cased.
    """
    # TODO: Consider locale-aware lowering for edge cases
    result: list[str] = []
    for char in text:
        if "A" <= char <= "Z":
            result.append(char.lower())
        else:
            result.append(char)
    return "".join(result)


# ---------------------------------------------------------------------------
# Pipeline builder
# ---------------------------------------------------------------------------


def build_cleaning_pipeline(
    remove_html: bool = True,
    normalize: bool = True,
    remove_zw: bool = True,
    lower_latin: bool = True,
) -> list[Callable[[str], str]]:
    """Construct an ordered list of cleaning functions.

    Args:
        remove_html: Include HTML tag removal.
        normalize: Include Unicode NFC normalisation.
        remove_zw: Include zero-width character removal.
        lower_latin: Include Latin lower-casing.

    Returns:
        List of callables, each accepting and returning a ``str``.
    """
    steps: list[Callable[[str], str]] = []
    if remove_html:
        steps.append(remove_html_tags)
    if remove_zw:
        steps.append(remove_zero_width_chars)
    if normalize:
        steps.append(normalize_unicode)
    if lower_latin:
        steps.append(lowercase_latin)
    # Whitespace collapsing is always the final step
    steps.append(collapse_whitespace)
    return steps


# ---------------------------------------------------------------------------
# High-level API
# ---------------------------------------------------------------------------


def clean_text(
    text: str,
    *,
    remove_html: bool = True,
    normalize: bool = True,
    remove_zw: bool = True,
    lower_latin: bool = True,
) -> str:
    """Apply the full cleaning pipeline to *text*.

    This is the primary entry point for text cleaning.  It composes the
    individual cleaning functions in the recommended order.

    Args:
        text: Raw input string (Sinhala, Singlish, or mixed).
        remove_html: Strip HTML / XML tags.
        normalize: Apply Unicode NFC normalisation.
        remove_zw: Remove zero-width characters.
        lower_latin: Lower-case Latin characters only.

    Returns:
        Cleaned string ready for downstream normalisation or tokenisation.

    Example::

        >>> clean_text("  <b>ආයුබෝවන්</b>  Hello   WORLD  ")
        'ආයුබෝවන් hello world'
    """
    logger.debug("Cleaning text (len=%d)", len(text))

    pipeline = build_cleaning_pipeline(
        remove_html=remove_html,
        normalize=normalize,
        remove_zw=remove_zw,
        lower_latin=lower_latin,
    )

    for step in pipeline:
        text = step(text)

    logger.debug("Cleaned text (len=%d)", len(text))
    return text
