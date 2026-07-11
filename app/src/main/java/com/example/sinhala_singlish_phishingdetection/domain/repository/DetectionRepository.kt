package com.example.sinhala_singlish_phishingdetection.domain.repository

import com.example.sinhala_singlish_phishingdetection.domain.model.DetectionResult

interface DetectionRepository {
    suspend fun analyzeMessage(message: String): DetectionResult
}
