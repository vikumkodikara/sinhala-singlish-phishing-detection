package com.example.sinhala_singlish_phishingdetection.ml

/**
 * Tokenizer for on-device text processing.
 *
 * Mirrors the Python-side [SinhalaTokenizer] to ensure consistent
 * tokenisation between training and inference.  Loads the vocabulary
 * from `assets/tokenizer.json`.
 *
 * ## Vocabulary Format (tokenizer.json)
 * ```json
 * {
 *   "version": "1.0",
 *   "max_sequence_length": 128,
 *   "special_tokens": ["<PAD>", "<UNK>", "<BOS>", "<EOS>"],
 *   "vocabulary": { "token": id, ... }
 * }
 * ```
 */
class Tokenizer(
    // TODO: Add Context parameter for asset access
    // private val context: Context,
) {
    /** Maximum sequence length for padding/truncation. */
    var maxSequenceLength: Int = 128
        private set

    /** Token-to-ID vocabulary mapping. */
    private val vocabulary: MutableMap<String, Int> = mutableMapOf()

    /** Special token IDs. */
    companion object {
        const val PAD_TOKEN = "<PAD>"
        const val UNK_TOKEN = "<UNK>"
        const val BOS_TOKEN = "<BOS>"
        const val EOS_TOKEN = "<EOS>"
        const val URL_TOKEN = "<URL>"
        const val PHONE_TOKEN = "<PHONE>"

        const val PAD_ID = 0
        const val UNK_ID = 1
        const val BOS_ID = 2
        const val EOS_ID = 3
    }

    /**
     * Load the tokenizer vocabulary from assets.
     *
     * @param path Relative path within the assets directory.
     * @throws java.io.IOException If the file cannot be read.
     */
    fun loadVocabulary(path: String = "tokenizer.json") {
        // TODO: Implement JSON loading from assets
        // val json = context.assets.open(path).bufferedReader().readText()
        // val data = JSONObject(json)
        // maxSequenceLength = data.getInt("max_sequence_length")
        // val vocab = data.getJSONObject("vocabulary")
        // vocab.keys().forEach { key -> vocabulary[key] = vocab.getInt(key) }
    }

    /**
     * Tokenize and encode a text string into integer IDs.
     *
     * @param text Preprocessed input text.
     * @param addSpecialTokens Whether to prepend BOS and append EOS.
     * @return IntArray of token IDs, padded/truncated to [maxSequenceLength].
     */
    fun encode(text: String, addSpecialTokens: Boolean = true): IntArray {
        // TODO: Implement tokenization matching the Python tokenizer

        // Placeholder: simple whitespace tokenization
        val tokens = text.split("\\s+".toRegex()).filter { it.isNotEmpty() }
        val ids = tokens.map { vocabulary.getOrDefault(it, UNK_ID) }.toMutableList()

        if (addSpecialTokens) {
            ids.add(0, BOS_ID)
            ids.add(EOS_ID)
        }

        // Truncate
        val truncated = ids.take(maxSequenceLength)

        // Pad
        val padded = IntArray(maxSequenceLength) { PAD_ID }
        truncated.forEachIndexed { index, value -> padded[index] = value }

        return padded
    }

    /**
     * Get the current vocabulary size.
     *
     * @return Number of tokens in the vocabulary.
     */
    fun vocabSize(): Int = vocabulary.size
}
