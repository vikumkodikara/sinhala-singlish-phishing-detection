package com.example.sinhala_singlish_phishingdetection.presentation.screens

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * History Screen — Detection history viewer.
 *
 * Displays a scrollable list of past phishing detection analyses with:
 * - Message text preview
 * - Detection label (SAFE / PHISHING) with colour coding
 * - Risk score
 * - Timestamp
 * - Swipe-to-delete functionality
 *
 * ## Features (Planned)
 * - Filter by label (All / Safe / Phishing)
 * - Search within history
 * - Export history as CSV
 * - Bulk delete
 *
 * @param modifier Optional [Modifier] for layout customisation.
 * @param onNavigateBack Callback to navigate back to the home screen.
 *
 * TODO: Implement full UI in Milestone 3
 * TODO: Integrate with HistoryViewModel via Hilt
 */
@Composable
fun HistoryScreen(
    modifier: Modifier = Modifier,
    onNavigateBack: () -> Unit = {},
) {
    // TODO: Collect history state from HistoryViewModel
    // val viewModel: HistoryViewModel = hiltViewModel()
    // val historyState by viewModel.historyState.collectAsStateWithLifecycle()

    // TODO: Implement LazyColumn with detection history items
    // TODO: Add filter chips (All / Safe / Phishing)
    // TODO: Add empty state illustration
    // TODO: Add swipe-to-delete with undo snackbar
}
