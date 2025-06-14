/**
 * Calculates the vote percentage based on the number of votes received and the total votes cast.
 *
 * This function returns the percentage of votes a candidate received.
 * If either `voteCount` or `totalVotes` is falsy (e.g., 0), the function returns 0
 * to avoid division errors or NaN results.
 *
 * @example
 * calculateVoteCount(25, 100); // Returns: 25
 *
 * @param {number} voteCount - The number of votes received.
 * @param {number} totalVotes - The total number of votes cast.
 *
 * @returns {number} The percentage of votes received (0–100).
 */
export const calculateVoteCount = (
  voteCount: number,
  totalVotes: number,
): number => {
  if (!voteCount || !totalVotes) return 0;
  return (voteCount / totalVotes) * 100;
};

/**
 * Tooltip styling configuration for react-tooltip.
 *
 * This object defines the custom CSS styles applied to tooltips rendered by the react-tooltip library.
 * It ensures consistent appearance across the application, using design system variables for theming.
 *
 * @property {string} backgroundColor - Sets the background color using the primary theme color.
 * @property {string} color - Sets the text color to a light gray for contrast on dark background.
 * @property {string} maxWidth - Restricts the tooltip width to improve readability on large content.
 * @property {string} whiteSpace - Allows the text to wrap normally instead of staying on one line.
 * @property {string} fontSize - Slightly reduces the font size for a subtle, compact tooltip look.
 */
export const tooltipStyles = {
  backgroundColor: "var(--color-primary)",
  color: "var(--color-gray-0)",
  maxWidth: "50rem",
  whiteSpace: "normal",
  fontSize: "0.85rem",
};
