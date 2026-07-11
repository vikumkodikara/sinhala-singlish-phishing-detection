package com.example.sinhala_singlish_phishingdetection.data.repository

import com.example.sinhala_singlish_phishingdetection.domain.repository.HistoryRepository
import com.example.sinhala_singlish_phishingdetection.domain.model.MessageAnalysis
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.emptyFlow

class HistoryRepositoryImpl : HistoryRepository {
    override fun getDetectionHistory(): Flow<List<MessageAnalysis>> {
        // TODO: Implement method
        return emptyFlow()
    }
}
