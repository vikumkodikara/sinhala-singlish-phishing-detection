package com.example.sinhala_singlish_phishingdetection.domain.model

/**
 * Represents the result of a phishing detection analysis.
 *
 * This is a domain-layer model that encapsulates the outcome of the ML
 * inference pipeline. It is decoupled from both the data layer (Room entities)
 * and the ML layer (raw TFLite outputs).
 *
 * @property id Unique identifier for this detection result.
 * @property isPhishing Whether the message was classified as phishing.
 * @property riskScore Normalised risk score in the range [0.0, 1.0], where
 *   1.0 indicates the highest phishing risk.
 * @property confidence Model confidence in the prediction [0.0, 1.0].
 * @property label Human-readable label: "SAFE" or "PHISHING".
 * @property detectedAt Timestamp (epoch milliseconds) of the detection.
 */
data class DetectionResult(
    val id: Long = 0L,
    val isPhishing: Boolean,
    val riskScore: Float,
    val confidence: Float = 0f,
    val label: String = if (isPhishing) "PHISHING" else "SAFE",
    val detectedAt: Long = System.currentTimeMillis(),
) {
    companion object {
        /** Risk score threshold for classifying a message as phishing. */
        const val PHISHING_THRESHOLD: Float = 0.5f

        /**
         * Creates a [DetectionResult] from a raw model output score.
         *
         * @param score Raw model output (sigmoid probability for phishing class).
         * @param threshold Classification threshold. Defaults to [PHISHING_THRESHOLD].
         * @return A fully-populated [DetectionResult].
         */
        fun fromScore(
            score: Float,
            threshold: Float = PHISHING_THRESHOLD,
        ): DetectionResult {
            // TODO: Implement when ML inference is integrated
            return DetectionResult(
                isPhishing = score >= threshold,
                riskScore = score,
                confidence = if (score >= threshold) score else 1f - score,
            )
        }
    }

    /**
     * Returns a human-readable risk level string.
     *
     * - `riskScore < 0.3` → "LOW"
     * - `riskScore < 0.7` → "MEDIUM"
     * - `riskScore >= 0.7` → "HIGH"
     */
    fun riskLevel(): String = when {
        riskScore < 0.3f -> "LOW"
        riskScore < 0.7f -> "MEDIUM"
        else -> "HIGH"
    }
}
