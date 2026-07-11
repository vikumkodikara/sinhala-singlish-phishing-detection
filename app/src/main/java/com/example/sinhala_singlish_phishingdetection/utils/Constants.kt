package com.example.sinhala_singlish_phishingdetection.utils

/**
 * Application-wide constants.
 *
 * Centralises magic strings and configuration values used across
 * multiple modules.
 */
object Constants {

    // ------------------------------------------------------------------ //
    // ML Model Assets
    // ------------------------------------------------------------------ //

    /** TFLite model file path (relative to assets/). */
    const val MODEL_PATH: String = "model.tflite"

    /** Tokenizer vocabulary file path (relative to assets/). */
    const val TOKENIZER_PATH: String = "tokenizer.json"

    /** Label mapping file path (relative to assets/). */
    const val LABELS_PATH: String = "labels.json"

    // ------------------------------------------------------------------ //
    // Detection Configuration
    // ------------------------------------------------------------------ //

    /** Default classification threshold for phishing detection. */
    const val DEFAULT_THRESHOLD: Float = 0.5f

    /** Maximum message length accepted for analysis (characters). */
    const val MAX_MESSAGE_LENGTH: Int = 1000

    /** Maximum sequence length for the tokenizer (tokens). */
    const val MAX_SEQUENCE_LENGTH: Int = 128

    // ------------------------------------------------------------------ //
    // Database
    // ------------------------------------------------------------------ //

    /** Room database file name. */
    const val DATABASE_NAME: String = "phishing_detection_db"

    // ------------------------------------------------------------------ //
    // Navigation Routes
    // ------------------------------------------------------------------ //

    /** Navigation route for the home / detection screen. */
    const val ROUTE_HOME: String = "home"

    /** Navigation route for the detection history screen. */
    const val ROUTE_HISTORY: String = "history"

    /** Navigation route for the settings screen. */
    const val ROUTE_SETTINGS: String = "settings"

    // ------------------------------------------------------------------ //
    // Labels
    // ------------------------------------------------------------------ //

    /** Label string for safe messages. */
    const val LABEL_SAFE: String = "SAFE"

    /** Label string for phishing messages. */
    const val LABEL_PHISHING: String = "PHISHING"
}
