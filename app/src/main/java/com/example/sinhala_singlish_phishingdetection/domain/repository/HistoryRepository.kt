package com.example.sinhala_singlish_phishingdetection.domain.repository

import com.example.sinhala_singlish_phishingdetection.domain.model.MessageAnalysis
import kotlinx.coroutines.flow.Flow

/**
 * Repository interface for detection history management.
 *
 * Provides reactive access to the history of message analyses using
 * Kotlin [Flow], enabling the UI to automatically update when new
 * entries are added or removed.
 */
interface HistoryRepository {

    /**
     * Observe all detection history entries, ordered by most recent first.
     *
     * @return A [Flow] emitting the current list of [MessageAnalysis] entries
     *   whenever the underlying data changes.
     */
    fun getDetectionHistory(): Flow<List<MessageAnalysis>>

    /**
     * Observe detection history filtered by label.
     *
     * @param label The label to filter by ("SAFE" or "PHISHING").
     * @return A [Flow] of filtered [MessageAnalysis] entries.
     */
    fun getHistoryByLabel(label: String): Flow<List<MessageAnalysis>>

    /**
     * Get the total count of analyses performed.
     *
     * @return A [Flow] emitting the current count.
     */
    fun getAnalysisCount(): Flow<Int>

    /**
     * Insert a new analysis entry into the history.
     *
     * @param analysis The [MessageAnalysis] to persist.
     * @return The auto-generated ID of the inserted entry.
     */
    suspend fun insertAnalysis(analysis: MessageAnalysis): Long

    /**
     * Delete a specific analysis entry from history.
     *
     * @param id The unique identifier of the entry to delete.
     */
    suspend fun deleteAnalysis(id: Long)

    /**
     * Clear the entire detection history.
     */
    suspend fun clearHistory()
}
