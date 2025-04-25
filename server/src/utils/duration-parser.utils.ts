/**
 * Utility Function: parse duration to milliseconds
 *
 * Purpose:
 * Converts human-readable time duration strings like '3Minutes', '2h', '7d', '30s'
 * into milliseconds, to be used for setting cookie maxAge or other timeouts.
 *
 * Why This Exists:
 * - Allows flexible configuration of token expiration times via environment variables.
 * - Ensures that both JWT token expiry and cookie expiry are in sync without hardcoding values.
 * - Supports easy testing by allowing shorter durations (e.g., '2Minutes') in non-production environments.
 *
 * Supported Formats:
 * - '3Minutes', '3minutes', '3m'
 * - '2Hours', '2h'
 * - '7Days', '7d'
 * - '30Seconds', '30s'
 *
 * Example Usage:
 * const ms = parseDurationToMs('3Minutes'); // Returns 180000 (3 * 60 * 1000)
 */

export const parseDurationToMs = (duration: string): number => {
  const regex = /^(\d+)\s*(seconds?|minutes?|hours?|days?|s|m|h|d)?$/i;
  const match = duration.trim().match(regex);

  if (!match) throw new Error(`Invalid duration format: ${duration}`);

  const value = parseInt(match[1]);
  const unit = match[2]?.toLowerCase();

  switch (unit) {
    case "seconds":
    case "second":
    case "s":
      return value * 1000;
    case "minutes":
    case "minute":
    case "m":
      return value * 60 * 1000;
    case "hours":
    case "hour":
    case "h":
      return value * 60 * 60 * 1000;
    case "days":
    case "day":
    case "d":
    default:
      return value * 24 * 60 * 60 * 1000;
  }
};
