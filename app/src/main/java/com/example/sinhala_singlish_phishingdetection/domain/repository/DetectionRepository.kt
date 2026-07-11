package com.example.sinhala_singlish_phishingdetection.domain.repository

import com.example.sinhala_singlish_phishingdetection.domain.model.DetectionResult

/**
 * Repository interface for the phishing detection domain.
 *
 * Follows the Repository Pattern from Clean Architecture: the domain layer
 * defines the contract, and the data layer provides the implementation.
 *
 * This abstraction allows the domain and presentation layers to remain
 * independent of data-source specifics (Room, network, TFLite, etc.).
 */
interface DetectionRepository {

    /**
     * Analyse a message for phishing indicators.
     *
     * Orchestrates the full detection pipeline:
     * 1. Preprocess the message text
     * 2. Run TFLite model inference
     * 3. Compute risk score and label
     * 4. Persist the result to local storage
     *
     * @param message The raw message text to analyse.
     * @return A [DetectionResult] with the classification outcome.
     */
    suspend fun analyzeMessage(message: String): DetectionResult

    /**
     * Retrieve a previously stored detection result by its ID.
     *
     * @param id The unique identifier of the detection result.
     * @return The [DetectionResult] if found, or `null`.
     */
    suspend fun getDetectionById(id: Long): DetectionResult?

    /**
     * Delete a detection result by its ID.
     *
     * @param id The unique identifier of the detection result to delete.
     */
    suspend fun deleteDetection(id: Long)

    /**
     * Clear all stored detection results.
     *
     * This is a destructive operation — use with caution.
     */
    suspend fun clearAllDetections()
}
