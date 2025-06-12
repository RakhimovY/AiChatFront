import axios from 'axios';

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
      if (axios.isAxiosError(error) && error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }

      if (retries === maxRetries - 1) {
        throw error;
      }

      const delay = initialDelay * Math.pow(2, retries);
      console.log(`Retry attempt ${retries + 1} after ${delay}ms`);

      await new Promise(resolve => setTimeout(resolve, delay));

      retries++;
    }
  }

  throw lastError;
};