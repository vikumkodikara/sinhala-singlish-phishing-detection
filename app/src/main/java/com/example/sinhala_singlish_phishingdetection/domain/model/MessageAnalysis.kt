package com.example.sinhala_singlish_phishingdetection.domain.model

/**
 * Represents a complete message analysis entry, combining the original
 * message text with its detection result.
 *
 * Used as the primary domain entity for the detection history feature.
 *
 * @property id Unique identifier for this analysis entry.
 * @property text The original message text that was analysed.
 * @property result The [DetectionResult] produced by the ML pipeline.
 * @property language Detected language of the message ("SINHALA", "SINGLISH", "MIXED").
 * @property source Origin of the message ("MANUAL_INPUT", "SMS_IMPORT", "CLIPBOARD").
 * @property analysedAt Timestamp (epoch milliseconds) of when the analysis was performed.
 */
data class MessageAnalysis(
    val id: Long = 0L,
    val text: String,
    val result: DetectionResult,
    val language: String = "UNKNOWN",
    val source: String = "MANUAL_INPUT",
    val analysedAt: Long = System.currentTimeMillis(),
) {
    /**
     * Returns a truncated preview of the message text.
     *
     * @param maxLength Maximum character length for the preview.
     * @return Truncated text with "..." appended if necessary.
     */
    fun textPreview(maxLength: Int = 100): String {
        return if (text.length <= maxLength) {
            text
        } else {
            text.take(maxLength) + "..."
        }
    }
}
