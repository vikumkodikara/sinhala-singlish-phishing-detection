package com.example.sinhala_singlish_phishingdetection.ml

/**
 * Data class representing the output of the ML inference pipeline.
 *
 * Encapsulates the raw model output before it is mapped to a domain-layer
 * [com.example.sinhala_singlish_phishingdetection.domain.model.DetectionResult].
 *
 * @property label Predicted class label ("SAFE" or "PHISHING").
 * @property confidence Softmax probability for the predicted class [0.0, 1.0].
 * @property phishingScore Raw sigmoid output for the phishing class [0.0, 1.0].
 * @property inferenceTimeMs Time taken for inference in milliseconds.
 */
data class PredictionResult(
    val label: String,
    val confidence: Float,
    val phishingScore: Float = 0f,
    val inferenceTimeMs: Long = 0L,
) {
    /** Whether the prediction indicates a phishing message. */
    val isPhishing: Boolean
        get() = label == "PHISHING"

    companion object {
        /** Create a safe (non-phishing) placeholder result. */
        fun safe(): PredictionResult = PredictionResult(
            label = "SAFE",
            confidence = 1.0f,
            phishingScore = 0.0f,
        )

        /** Create from a raw phishing probability score. */
        fun fromScore(score: Float, threshold: Float = 0.5f): PredictionResult {
            val isPhishing = score >= threshold
            return PredictionResult(
                label = if (isPhishing) "PHISHING" else "SAFE",
                confidence = if (isPhishing) score else 1f - score,
                phishingScore = score,
            )
        }
    }
}
