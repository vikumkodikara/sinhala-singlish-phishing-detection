package com.example.sinhala_singlish_phishingdetection.ml

data class PredictionResult(
    val isPhishing: Boolean,
    val confidence: Float
)
