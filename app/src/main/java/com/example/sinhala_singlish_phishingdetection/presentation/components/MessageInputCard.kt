package com.example.sinhala_singlish_phishingdetection.presentation.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

/**
 * Message Input Card — Primary text input composable.
 *
 * A Material 3 card containing:
 * - Multi-line text field for message input
 * - Character count indicator
 * - "Analyse" button with loading state
 * - Clear button
 * - Paste-from-clipboard action
 *
 * ## Accessibility
 * - Content description for screen readers
 * - Minimum touch target sizes
 * - High-contrast text
 *
 * @param messageText Current text in the input field.
 * @param onMessageChanged Callback when the text changes.
 * @param onAnalyseClicked Callback when the analyse button is pressed.
 * @param isLoading Whether analysis is currently in progress.
 * @param maxLength Maximum allowed message length.
 * @param modifier Optional [Modifier] for layout customisation.
 *
 * TODO: Implement full composable in Milestone 3
 */
@Composable
fun MessageInputCard(
    messageText: String = "",
    onMessageChanged: (String) -> Unit = {},
    onAnalyseClicked: () -> Unit = {},
    isLoading: Boolean = false,
    maxLength: Int = 1000,
    modifier: Modifier = Modifier,
) {
    // TODO: Implement Card with OutlinedTextField
    // TODO: Add character counter (e.g. "123 / 1000")
    // TODO: Add analyse Button with CircularProgressIndicator when loading
    // TODO: Add paste IconButton
    // TODO: Add clear IconButton
}
