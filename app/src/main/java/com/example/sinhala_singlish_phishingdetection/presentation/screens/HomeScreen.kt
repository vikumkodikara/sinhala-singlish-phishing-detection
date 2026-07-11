package com.example.sinhala_singlish_phishingdetection.presentation.screens

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * Home Screen — Primary phishing detection interface.
 *
 * Provides a text input area where users can paste or type a message
 * for phishing analysis.  Displays the detection result with a risk
 * score indicator.
 *
 * ## UI Components
 * - [MessageInputCard] — Text input with analyse button
 * - [RiskScoreIndicator] — Visual risk gauge
 * - Detection result card with label, confidence, and recommendations
 *
 * ## State Management
 * State is managed by [DetectionViewModel] following the MVVM pattern.
 * The ViewModel exposes a [StateFlow] of the current UI state.
 *
 * @param modifier Optional [Modifier] for layout customisation.
 * @param onNavigateToHistory Callback to navigate to the history screen.
 * @param onNavigateToSettings Callback to navigate to the settings screen.
 *
 * TODO: Implement full UI in Milestone 3
 * TODO: Integrate with DetectionViewModel via Hilt
 * TODO: Add loading state and error handling
 */
@Composable
fun HomeScreen(
    modifier: Modifier = Modifier,
    onNavigateToHistory: () -> Unit = {},
    onNavigateToSettings: () -> Unit = {},
) {
    // TODO: Collect UI state from DetectionViewModel
    // val viewModel: DetectionViewModel = hiltViewModel()
    // val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    // TODO: Implement Scaffold with TopAppBar
    // TODO: Add MessageInputCard composable
    // TODO: Add RiskScoreIndicator composable
    // TODO: Add result display card
    // TODO: Add bottom navigation or FAB for history access
}
