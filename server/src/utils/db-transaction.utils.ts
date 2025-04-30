import logger from "logger";
import mongoose from "mongoose";

/**
 * Checks if the provided error is a MongoDB transient transaction error.
 */
function isMongoTransientError(error: unknown): boolean {
  const err = error as { hasErrorLabel?: (label: string) => boolean };
  return (
    !!err.hasErrorLabel?.("TransientTransactionError") ||
    !!err.hasErrorLabel?.("UnknownTransactionCommitResult")
  );
}

/**
 * Runs a Mongoose transaction with automatic retry for transient errors.
 *
 * @param callback - The transactional operation to execute
 * @param maxRetries - Maximum number of retries (default: 3)
 */
export async function runTransactionWithRetry<T>(
  callback: (session: mongoose.ClientSession) => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let attempt = 0;

  while (attempt <= maxRetries) {
    const session = await mongoose.startSession();
    try {
      attempt++;
      session.startTransaction();
      logger.info(`🚀 Starting transaction attempt ${attempt}/${maxRetries}`);
      // ✅ A dependency injection or callback parameter injection.
      const result = await callback(session); // Execute your transactional logic
      await session.commitTransaction();
      logger.info(
        `✅ Transaction committed successfully on attempt ${attempt}`
      );
      return result; // Success! Exit
    } catch (error: unknown) {
      logger.error(`❌ Transaction attempt ${attempt} failed ➔ ${error}`);

      if (isMongoTransientError(error) && attempt <= maxRetries) {
        logger.warn(
          `⚠️ Retrying transaction attempt ${attempt}/${maxRetries} due to transient MongoDB error...`
        );
        await session.abortTransaction();
        session.endSession();
        continue; // Retry
      }

      await session.abortTransaction();
      session.endSession();
      logger.error(
        `❌ Transaction permanently failed after ${attempt} attempts.`
      );
      throw error;
    } finally {
      session.endSession();
    }
  }
  // Fallback (should not reach here normally)
  throw new Error("Failed to complete transaction after maximum retries.");
}
