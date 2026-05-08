/**
 * Synthetic-specific context overflow error detection.
 *
 * Some Synthetic backend errors are not matched by Pi's built-in
 * isContextOverflow() patterns. This module provides the regex
 * to detect them so the provider extension can normalize the
 * errorMessage with the `context_length_exceeded:` prefix that
 * Pi recognizes.
 */

/**
 * Matches Synthetic context overflow errors that Pi's built-in
 * overflow detector does not catch:
 *
 * 1. "Error from inference backend: 400 The input (N tokens) is longer
 *    than the model's context length (M tokens)."
 * 2. "Context limit exceeded"
 */
export const SYNTHETIC_OVERFLOW_PATTERN =
  /input \(\d+ tokens\) is longer than the model's context length|Context limit exceeded/i;
