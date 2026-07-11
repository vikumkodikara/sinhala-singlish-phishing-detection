package com.example.sinhala_singlish_phishingdetection.domain.usecase

import com.example.sinhala_singlish_phishingdetection.domain.model.MessageAnalysis
import com.example.sinhala_singlish_phishingdetection.domain.repository.HistoryRepository
import kotlinx.coroutines.flow.Flow

/**
 * Use case: Retrieve detection history.
 *
 * Provides access to the history of phishing analyses with optional
 * filtering by label.
 *
 * @property historyRepository The repository providing history access.
 */
class GetHistoryUseCase(
    private val historyRepository: HistoryRepository,
) {
    /**
     * Retrieve the full detection history as a reactive [Flow].
     *
     * @param filterLabel Optional label filter ("SAFE", "PHISHING", or `null` for all).
     * @return A [Flow] emitting the list of [MessageAnalysis] entries.
     */
    operator fun invoke(filterLabel: String? = null): Flow<List<MessageAnalysis>> {
        // TODO: Add domain-level sorting, pagination, or search logic

        return if (filterLabel != null) {
            historyRepository.getHistoryByLabel(filterLabel)
        } else {
            historyRepository.getDetectionHistory()
        }
    }
}
