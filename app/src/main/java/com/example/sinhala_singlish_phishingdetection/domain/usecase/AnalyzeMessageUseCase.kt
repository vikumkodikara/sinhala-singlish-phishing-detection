package com.example.sinhala_singlish_phishingdetection.domain.usecase

import com.example.sinhala_singlish_phishingdetection.domain.model.DetectionResult
import com.example.sinhala_singlish_phishingdetection.domain.repository.DetectionRepository

/**
 * Use case: Analyse a message for phishing.
 *
 * Encapsulates the single responsibility of invoking the detection
 * pipeline through the repository.  This follows the Use Case pattern
 * from Clean Architecture, keeping business logic separate from the
 * ViewModel.
 *
 * @property detectionRepository The repository providing detection capabilities.
 */
class AnalyzeMessageUseCase(
    private val detectionRepository: DetectionRepository,
) {
    /**
     * Execute the phishing analysis.
     *
     * @param message The raw message text to analyse.
     * @return A [DetectionResult] with the classification outcome.
     * @throws IllegalArgumentException If [message] is blank.
     */
    suspend operator fun invoke(message: String): DetectionResult {
        require(message.isNotBlank()) { "Message must not be blank" }

        // TODO: Add any domain-level validation or enrichment here
        // TODO: Consider rate-limiting or deduplication logic

        return detectionRepository.analyzeMessage(message)
    }
}
