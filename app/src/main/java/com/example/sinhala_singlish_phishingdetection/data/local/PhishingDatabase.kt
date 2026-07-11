package com.example.sinhala_singlish_phishingdetection.data.local

/**
 * Room database definition for the phishing detection application.
 *
 * Contains the [DetectionEntity] table for persisting analysis history.
 *
 * ## Migration Strategy
 * - **Development**: Use `fallbackToDestructiveMigration()` during
 *   active development.
 * - **Production**: Implement proper Room migrations when schema
 *   changes are needed post-release.
 *
 * ## Usage
 * Accessed via Hilt dependency injection through [AppModule].
 *
 * TODO: Add the following annotations when Room is configured:
 *   @Database(entities = [DetectionEntity::class], version = 1, exportSchema = true)
 */
abstract class PhishingDatabase /* : RoomDatabase() */ {

    /**
     * Provides access to the [DetectionDao] for CRUD operations.
     *
     * @return The [DetectionDao] instance managed by Room.
     */
    // TODO: Uncomment when Room is configured
    // abstract fun detectionDao(): DetectionDao

    companion object {
        /** Database file name. */
        const val DATABASE_NAME: String = "phishing_detection_db"

        /** Current schema version. */
        const val DATABASE_VERSION: Int = 1
    }
}
