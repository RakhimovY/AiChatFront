/**
 * Utility functions for retrying API calls
 */
import axios from 'axios';

/**
 * Retry a function with exponential backoff
 * 
 * @param fn Function to retry
 * @param maxRetries Maximum number of retry attempts
 * @param initialDelay Initial delay in milliseconds
 * @returns Result of the function
 * @throws Last error encountered if all retries fail
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  let retries = 0;
  let lastError: any;

  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on 4xx errors (client errors)
      if (axios.isAxiosError(error) && error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }

      // If this is the last retry, throw the error
      if (retries === maxRetries - 1) {
        throw error;
      }

      // Calculate backoff delay: 1s, 2s, 4s, etc.
      const delay = initialDelay * Math.pow(2, retries);
      console.log(`Retry attempt ${retries + 1} after ${delay}ms`);

      // Wait for the backoff period
      await new Promise(resolve => setTimeout(resolve, delay));

      retries++;
    }
  }

  // This should never be reached, but TypeScript requires a return
  throw lastError;
};