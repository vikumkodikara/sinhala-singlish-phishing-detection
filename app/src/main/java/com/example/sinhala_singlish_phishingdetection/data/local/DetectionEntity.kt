package com.example.sinhala_singlish_phishingdetection.data.local

/**
 * Room entity representing a persisted detection record.
 *
 * Maps directly to the `detections` table in the local SQLite database.
 * This is a data-layer concern — domain models should be used in the
 * presentation and domain layers.
 *
 * @property id Auto-generated primary key.
 * @property messageText The original message text.
 * @property isPhishing Whether the message was classified as phishing.
 * @property riskScore Normalised risk score [0.0, 1.0].
 * @property confidence Model confidence score [0.0, 1.0].
 * @property label Classification label ("SAFE" or "PHISHING").
 * @property language Detected language ("SINHALA", "SINGLISH", "MIXED").
 * @property source Message source ("MANUAL_INPUT", "SMS_IMPORT", "CLIPBOARD").
 * @property createdAt Timestamp (epoch millis) of when the record was created.
 */
// TODO: Add @Entity(tableName = "detections") annotation when Room is configured
data class DetectionEntity(
    // TODO: Add @PrimaryKey(autoGenerate = true) annotation
    val id: Long = 0L,
    // TODO: Add @ColumnInfo(name = "message_text") annotation
    val messageText: String = "",
    val isPhishing: Boolean = false,
    val riskScore: Float = 0f,
    val confidence: Float = 0f,
    val label: String = "SAFE",
    val language: String = "UNKNOWN",
    val source: String = "MANUAL_INPUT",
    val createdAt: Long = System.currentTimeMillis(),
)
