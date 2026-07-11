package com.example.sinhala_singlish_phishingdetection.data.repository

import com.example.sinhala_singlish_phishingdetection.domain.repository.DetectionRepository
import com.example.sinhala_singlish_phishingdetection.domain.model.DetectionResult

class DetectionRepositoryImpl : DetectionRepository {
    override suspend fun analyzeMessage(message: String): DetectionResult {
        // TODO: Implement method
        return DetectionResult(false, 0f)
    }
}
