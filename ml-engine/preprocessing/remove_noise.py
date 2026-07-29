"""
Noise Removal
==============

Removes non-linguistic noise from SMS / mobile-message text while
preserving elements that may carry phishing-detection signal.

Categories of noise handled:

- **Emojis and emoticons** — stripped unless configured otherwise.
- **Special characters** — punctuation normalisation.
- **Numeric noise** — phone-number / OTP masking.
- **URL placeholders** — URLs are extracted separately (see
  :mod:`ml_engine.features.url_feature_extraction`) and replaced with
  a ``<URL>`` token.

Design Decision:
    URLs and phone numbers are **replaced** (not removed) so that
    downstream models retain positional awareness of their presence.

Author:
    Vikum Kodikara
"""

from __future__ import annotations

import logging
import re

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Regex patterns
# ---------------------------------------------------------------------------

#: Matches most URL patterns (http, https, ftp, and bare domains)
URL_PATTERN: re.Pattern[str] = re.compile(
    r"https?://[^\s<>\"']+|www\.[^\s<>\"']+",
    re.IGNORECASE,
)

#: Matches Sri Lankan phone numbers (local and international formats)
SL_PHONE_PATTERN: re.Pattern[str] = re.compile(r"(?:\+94|0094|0)\d{9,10}")

#: Matches emoji Unicode ranges (supplementary multilingual plane)
EMOJI_PATTERN: re.Pattern[str] = re.compile(
    "["
    "\U0001F600-\U0001F64F"  # Emoticons
    "\U0001F300-\U0001F5FF"  # Misc symbols & pictographs
    "\U0001F680-\U0001F6FF"  # Transport & map symbols
    "\U0001F1E0-\U0001F1FF"  # Regional flags
    "\U00002702-\U000027B0"  # Dingbats
    "\U000024C2-\U0001F251"  # Enclosed characters
    "]+",
    flags=re.UNICODE,
)

#: Matches common text emoticons like :), :(, :D, ;), etc.
TEXT_EMOTICON_PATTERN: re.Pattern[str] = re.compile(
    r"(?:[:;=][-']?[)(DPpOo/\\|@])|(?:[)(DPp][-']?[:;=])"
)

#: Special token placeholders
URL_TOKEN: str = "<URL>"
PHONE_TOKEN: str = "<PHONE>"
NUMBER_TOKEN: str = "<NUM>"


# ---------------------------------------------------------------------------
# Noise-removal functions
# ---------------------------------------------------------------------------


def replace_urls(text: str, replacement: str = URL_TOKEN) -> str:
    """Replace URLs with a placeholder token.

    Args:
        text: Input text.
        replacement: Token to insert in place of URLs.

    Returns:
        Text with URLs replaced.

    Example::

        >>> replace_urls("Visit https://example.com now")
        'Visit <URL> now'
    """
    count = len(URL_PATTERN.findall(text))
    if count:
        logger.debug("Replacing %d URL(s)", count)
    return URL_PATTERN.sub(replacement, text)


def replace_phone_numbers(text: str, replacement: str = PHONE_TOKEN) -> str:
    """Replace Sri Lankan phone numbers with a placeholder token.

    Args:
        text: Input text.
        replacement: Token to insert in place of phone numbers.

    Returns:
        Text with phone numbers replaced.
    """
    count = len(SL_PHONE_PATTERN.findall(text))
    if count:
        logger.debug("Replacing %d phone number(s)", count)
    return SL_PHONE_PATTERN.sub(replacement, text)


def replace_numbers(text: str, replacement: str = NUMBER_TOKEN) -> str:
    """Replace standalone numeric sequences with a placeholder.

    Preserves numbers that are part of words (e.g. "4G", "COVID19").

    Args:
        text: Input text.
        replacement: Token to insert.

    Returns:
        Text with isolated numbers replaced.
    """
    # TODO: Fine-tune to preserve meaningful numbers (OTP patterns, etc.)
    return re.sub(r"\b\d+\b", replacement, text)


def remove_emojis(text: str) -> str:
    """Remove emoji characters from *text*.

    Args:
        text: Input text.

    Returns:
        Text with emojis removed.
    """
    return EMOJI_PATTERN.sub("", text)


def remove_text_emoticons(text: str) -> str:
    """Remove ASCII-art emoticons from *text*.

    Args:
        text: Input text.

    Returns:
        Text with text emoticons removed.
    """
    return TEXT_EMOTICON_PATTERN.sub("", text)


def remove_special_characters(
    text: str,
    keep_chars: set[str] | None = None,
) -> str:
    """Remove special characters, keeping alphanumerics and specified chars.

    By default, keeps basic punctuation that may carry meaning for
    phishing detection (e.g. ``!``, ``?``, ``.``).

    Args:
        text: Input text.
        keep_chars: Set of additional characters to preserve.  Defaults
            to ``{"!", "?", ".", ",", "<", ">"}``.

    Returns:
        Text with special characters removed.
    """
    if keep_chars is None:
        keep_chars = {"!", "?", ".", ",", "<", ">"}

    # TODO: Consider Sinhala punctuation marks
    result = []
    for char in text:
        if char.isalnum() or char.isspace() or char in keep_chars:
            result.append(char)
        elif ord(char) >= 0x0D80:
            # Preserve Sinhala Unicode characters
            result.append(char)
    return "".join(result)


# ---------------------------------------------------------------------------
# High-level API
# ---------------------------------------------------------------------------


def remove_noise(
    text: str,
    *,
    handle_urls: bool = True,
    handle_phones: bool = True,
    handle_numbers: bool = False,
    handle_emojis: bool = True,
    handle_emoticons: bool = True,
    handle_special: bool = True,
) -> str:
    """Apply the complete noise-removal pipeline.

    The order of operations is designed to avoid interference between
    patterns (e.g. URLs are replaced before special-character removal).

    Args:
        text: Input text.
        handle_urls: Replace URLs with ``<URL>`` tokens.
        handle_phones: Replace phone numbers with ``<PHONE>`` tokens.
        handle_numbers: Replace standalone numbers with ``<NUM>`` tokens.
        handle_emojis: Remove emoji characters.
        handle_emoticons: Remove ASCII emoticons.
        handle_special: Remove remaining special characters.

    Returns:
        Denoised text.

    Example::

        >>> remove_noise("Click https://x.com 😀 now!!!")
        'Click <URL> now!!!'
    """
    logger.info("Removing noise from text (len=%d)", len(text))

    if handle_urls:
        text = replace_urls(text)
    if handle_phones:
        text = replace_phone_numbers(text)
    if handle_numbers:
        text = replace_numbers(text)
    if handle_emojis:
        text = remove_emojis(text)
    if handle_emoticons:
        text = remove_text_emoticons(text)
    if handle_special:
        text = remove_special_characters(text)

    # Collapse any resulting double spaces
    text = re.sub(r"\s+", " ", text).strip()

    logger.debug("Noise removal complete (len=%d)", len(text))
    return text
