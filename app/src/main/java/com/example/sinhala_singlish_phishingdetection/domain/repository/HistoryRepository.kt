package com.example.sinhala_singlish_phishingdetection.domain.repository

import com.example.sinhala_singlish_phishingdetection.domain.model.MessageAnalysis
import kotlinx.coroutines.flow.Flow

interface HistoryRepository {
    fun getDetectionHistory(): Flow<List<MessageAnalysis>>
}
