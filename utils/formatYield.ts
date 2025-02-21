/**
 * Formats a number with 6 decimal places into a readable string with 3 significant characters
 * Handles scientific notation for very small numbers and K/M suffixes for large numbers
 * @param value The number to format
 * @returns Formatted string representation
 */
export function formatYield(value: number): string {
  // Handle undefined, null, NaN
  if (!value && value !== 0) return "-";

  // Handle zero
  if (value === 0) return "0";

  const absValue = Math.abs(value);

  // Small numbers: Use scientific notation
  if (absValue < 0.01) {
    return value.toExponential(2);
  }

  // Large numbers: Use K/M suffix
  if (absValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (absValue >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  // Numbers between 0.01 and 999.999
  if (absValue >= 100) {
    // No decimals needed for large numbers
    return Math.round(value).toString();
  }
  if (absValue >= 10) {
    // One decimal place for medium numbers
    return value.toFixed(1);
  }
  if (absValue >= 1) {
    // Two decimal places for numbers between 1 and 10
    return value.toFixed(2);
  }
  // Three decimal places for numbers between 0.01 and 1
  return value.toFixed(3);
}
