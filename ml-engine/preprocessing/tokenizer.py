"""
Tokenizer for Sinhala and Singlish Text
========================================

Provides a configurable tokeniser that handles the unique challenges of
Sinhala and Singlish text segmentation:

- **Sinhala**: Syllable-aware segmentation respecting conjunct consonants.
- **Singlish**: Word-level tokenisation with sub-word fallback.
- **Mixed**: Automatic script detection per token for hybrid messages.

The tokeniser builds a vocabulary from the training corpus and supports
serialisation to JSON for deployment on the Android client.

Usage::

    from ml_engine.preprocessing.tokenizer import SinhalaTokenizer

    tokenizer = SinhalaTokenizer(max_vocab_size=10_000)
    tokenizer.fit(corpus)
    token_ids = tokenizer.encode("ආයුබෝවන් Hello")

Author:
    Vikum Kodikara
"""

from __future__ import annotations

import json
import logging
import re
from collections import Counter
from collections.abc import Sequence
from pathlib import Path

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

PAD_TOKEN: str = "<PAD>"
UNK_TOKEN: str = "<UNK>"
BOS_TOKEN: str = "<BOS>"
EOS_TOKEN: str = "<EOS>"
URL_TOKEN: str = "<URL>"
PHONE_TOKEN: str = "<PHONE>"
NUM_TOKEN: str = "<NUM>"

SPECIAL_TOKENS: list[str] = [
    PAD_TOKEN,
    UNK_TOKEN,
    BOS_TOKEN,
    EOS_TOKEN,
    URL_TOKEN,
    PHONE_TOKEN,
    NUM_TOKEN,
]


class SinhalaTokenizer:
    """Vocabulary-based tokeniser for Sinhala/Singlish text.

    Attributes:
        max_vocab_size: Upper bound on vocabulary size.
        min_frequency: Minimum token frequency to be included.
        token_to_id: Mapping from token string → integer ID.
        id_to_token: Reverse mapping from integer ID → token string.
    """

    def __init__(
        self,
        max_vocab_size: int = 30_000,
        min_frequency: int = 2,
        max_sequence_length: int = 128,
    ) -> None:
        """Initialise the tokeniser.

        Args:
            max_vocab_size: Maximum number of tokens in the vocabulary.
            min_frequency: Minimum corpus frequency for a token to be
                included in the vocabulary.
            max_sequence_length: Default maximum sequence length for
                padding / truncation during encoding.
        """
        self.max_vocab_size = max_vocab_size
        self.min_frequency = min_frequency
        self.max_sequence_length = max_sequence_length

        # Vocabulary mappings — populated by fit()
        self.token_to_id: dict[str, int] = {}
        self.id_to_token: dict[int, str] = {}

        # Initialise with special tokens
        for idx, token in enumerate(SPECIAL_TOKENS):
            self.token_to_id[token] = idx
            self.id_to_token[idx] = token

        logger.debug(
            "Tokenizer initialised (max_vocab=%d, min_freq=%d)",
            max_vocab_size,
            min_frequency,
        )

    # ------------------------------------------------------------------ #
    # Core tokenisation
    # ------------------------------------------------------------------ #

    def tokenize(self, text: str) -> list[str]:
        """Split *text* into a list of tokens.

        Uses whitespace splitting as the primary strategy, with
        script-aware sub-tokenisation for Sinhala text.

        Args:
            text: Preprocessed input text.

        Returns:
            List of token strings.

        Example::

            >>> tok = SinhalaTokenizer()
            >>> tok.tokenize("ආයුබෝවන් Hello")
            ['ආයුබෝවන්', 'Hello']
        """
        # TODO: Implement syllable-level sub-tokenisation for Sinhala
        # TODO: Implement BPE / SentencePiece as an alternative strategy
        # TODO: Handle special tokens (<URL>, <PHONE>) as atomic units

        # Preserve special tokens
        special_pattern = "|".join(re.escape(t) for t in SPECIAL_TOKENS)
        parts = re.split(f"({special_pattern})", text)

        tokens: list[str] = []
        for part in parts:
            part = part.strip()
            if not part:
                continue
            if part in SPECIAL_TOKENS:
                tokens.append(part)
            else:
                # Basic whitespace tokenisation
                tokens.extend(part.split())

        return tokens

    # ------------------------------------------------------------------ #
    # Vocabulary building
    # ------------------------------------------------------------------ #

    def fit(self, corpus: Sequence[str]) -> SinhalaTokenizer:
        """Build vocabulary from a corpus of texts.

        Args:
            corpus: Iterable of preprocessed text strings.

        Returns:
            ``self`` for method chaining.

        Example::

            >>> tok = SinhalaTokenizer(max_vocab_size=100)
            >>> tok.fit(["ආයුබෝවන්", "Hello World"])
        """
        logger.info("Building vocabulary from %d documents", len(corpus))

        # TODO: Implement frequency-based vocabulary building
        # TODO: Consider sub-word tokenisation (BPE / WordPiece)
        counter: Counter[str] = Counter()
        for text in corpus:
            tokens = self.tokenize(text)
            counter.update(tokens)

        # Filter by minimum frequency and cap at max_vocab_size
        most_common = counter.most_common()
        filtered = [
            (token, freq)
            for token, freq in most_common
            if freq >= self.min_frequency and token not in self.token_to_id
        ]

        # Add tokens up to the vocabulary limit
        available_slots = self.max_vocab_size - len(self.token_to_id)
        for token, _freq in filtered[:available_slots]:
            idx = len(self.token_to_id)
            self.token_to_id[token] = idx
            self.id_to_token[idx] = token

        logger.info("Vocabulary built: %d tokens", len(self.token_to_id))
        return self

    # ------------------------------------------------------------------ #
    # Encoding / Decoding
    # ------------------------------------------------------------------ #

    def encode(
        self,
        text: str,
        max_length: int | None = None,
        add_special_tokens: bool = True,
    ) -> list[int]:
        """Convert *text* to a list of integer token IDs.

        Args:
            text: Input text.
            max_length: Override for maximum sequence length.  Uses
                ``self.max_sequence_length`` when ``None``.
            add_special_tokens: Prepend ``<BOS>`` and append ``<EOS>``.

        Returns:
            List of integer token IDs, padded / truncated to *max_length*.
        """
        max_len = max_length or self.max_sequence_length
        tokens = self.tokenize(text)

        # Map to IDs (use <UNK> for out-of-vocabulary tokens)
        unk_id = self.token_to_id[UNK_TOKEN]
        ids = [self.token_to_id.get(t, unk_id) for t in tokens]

        # Add special tokens
        if add_special_tokens:
            bos_id = self.token_to_id[BOS_TOKEN]
            eos_id = self.token_to_id[EOS_TOKEN]
            ids = [bos_id] + ids + [eos_id]

        # Truncate
        ids = ids[:max_len]

        # Pad
        pad_id = self.token_to_id[PAD_TOKEN]
        while len(ids) < max_len:
            ids.append(pad_id)

        return ids

    def decode(self, ids: list[int], skip_special: bool = True) -> str:
        """Convert a list of token IDs back to a string.

        Args:
            ids: List of integer token IDs.
            skip_special: Skip special tokens in the output.

        Returns:
            Reconstructed text string.
        """
        special_ids = {self.token_to_id[t] for t in SPECIAL_TOKENS}
        tokens = []
        for token_id in ids:
            if skip_special and token_id in special_ids:
                continue
            token = self.id_to_token.get(token_id, UNK_TOKEN)
            tokens.append(token)
        return " ".join(tokens)

    # ------------------------------------------------------------------ #
    # Serialisation
    # ------------------------------------------------------------------ #

    def save(self, path: str | Path) -> None:
        """Save tokeniser configuration and vocabulary to a JSON file.

        The JSON format is designed to be loadable by the Android-side
        ``Tokenizer.kt`` class for on-device inference.

        Args:
            path: Output file path.
        """
        output_path = Path(path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        data = {
            "version": "1.0",
            "max_vocab_size": self.max_vocab_size,
            "min_frequency": self.min_frequency,
            "max_sequence_length": self.max_sequence_length,
            "special_tokens": SPECIAL_TOKENS,
            "vocabulary": self.token_to_id,
        }

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        logger.info(
            "Tokenizer saved to %s (%d tokens)", output_path, len(self.token_to_id)
        )

    @classmethod
    def load(cls, path: str | Path) -> SinhalaTokenizer:
        """Load a tokeniser from a previously saved JSON file.

        Args:
            path: Path to the tokeniser JSON file.

        Returns:
            A :class:`SinhalaTokenizer` instance with restored vocabulary.

        Raises:
            FileNotFoundError: If *path* does not exist.
        """
        input_path = Path(path)
        if not input_path.exists():
            raise FileNotFoundError(f"Tokenizer file not found: {input_path}")

        with open(input_path, encoding="utf-8") as f:
            data = json.load(f)

        tokenizer = cls(
            max_vocab_size=data["max_vocab_size"],
            min_frequency=data["min_frequency"],
            max_sequence_length=data["max_sequence_length"],
        )
        tokenizer.token_to_id = data["vocabulary"]
        tokenizer.id_to_token = {int(v): k for k, v in data["vocabulary"].items()}

        logger.info(
            "Tokenizer loaded from %s (%d tokens)",
            input_path,
            len(tokenizer.token_to_id),
        )
        return tokenizer

    # ------------------------------------------------------------------ #
    # Properties
    # ------------------------------------------------------------------ #

    @property
    def vocab_size(self) -> int:
        """Return the current vocabulary size."""
        return len(self.token_to_id)

    def __repr__(self) -> str:
        return (
            f"SinhalaTokenizer(vocab_size={self.vocab_size}, "
            f"max_seq_len={self.max_sequence_length})"
        )
