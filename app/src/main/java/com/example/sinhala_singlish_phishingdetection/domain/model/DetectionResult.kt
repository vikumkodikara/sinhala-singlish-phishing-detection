package com.example.sinhala_singlish_phishingdetection.domain.model

data class DetectionResult(
    val isPhishing: Boolean,
    val riskScore: Float
)
