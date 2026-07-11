package com.example.sinhala_singlish_phishingdetection.data.local

import kotlinx.coroutines.flow.Flow

/**
 * Data Access Object for the detections table.
 *
 * Defines all database operations for [DetectionEntity] records.
 * Uses Kotlin [Flow] for reactive queries that automatically emit
 * new values when the underlying data changes.
 *
 * TODO: Add @Dao annotation when Room dependency is configured.
 */
interface DetectionDao {

    /**
     * Insert a new detection record.
     *
     * @param entity The [DetectionEntity] to insert.
     * @return The auto-generated row ID.
     *
     * TODO: Add @Insert annotation
     */
    suspend fun insert(entity: DetectionEntity): Long

    /**
     * Retrieve all detection records, ordered by creation time (newest first).
     *
     * @return A [Flow] emitting the list of all [DetectionEntity] records.
     *
     * TODO: Add @Query("SELECT * FROM detections ORDER BY createdAt DESC") annotation
     */
    fun getAll(): Flow<List<DetectionEntity>>

    /**
     * Retrieve detection records filtered by label.
     *
     * @param label The label to filter by ("SAFE" or "PHISHING").
     * @return A [Flow] of matching [DetectionEntity] records.
     *
     * TODO: Add @Query("SELECT * FROM detections WHERE label = :label ORDER BY createdAt DESC")
     */
    fun getByLabel(label: String): Flow<List<DetectionEntity>>

    /**
     * Retrieve a single detection record by ID.
     *
     * @param id The primary key of the record.
     * @return The [DetectionEntity] if found, or `null`.
     *
     * TODO: Add @Query("SELECT * FROM detections WHERE id = :id") annotation
     */
    suspend fun getById(id: Long): DetectionEntity?

    /**
     * Get the total count of detection records.
     *
     * @return A [Flow] emitting the current count.
     *
     * TODO: Add @Query("SELECT COUNT(*) FROM detections") annotation
     */
    fun getCount(): Flow<Int>

    /**
     * Delete a detection record by ID.
     *
     * @param id The primary key of the record to delete.
     *
     * TODO: Add @Query("DELETE FROM detections WHERE id = :id") annotation
     */
    suspend fun deleteById(id: Long)

    /**
     * Delete all detection records.
     *
     * TODO: Add @Query("DELETE FROM detections") annotation
     */
    suspend fun deleteAll()
}
