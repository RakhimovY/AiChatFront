/**
 * Utility functions for API caching
 */

import { apiCache } from './apiCache';
import { retryWithBackoff } from './retryUtils';

/**
 * Get data from cache or fetch from API if not cached
 * 
 * @param cacheKey Key to use for caching
 * @param fetchFn Function to fetch data if not in cache
 * @param expiresIn Time in milliseconds until the cache entry expires
 * @param logMessage Message to log when using cached data
 * @returns The cached or fetched data
 */
export const getWithCache = async <T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  expiresIn: number = 60000, // Default: 1 minute
  logMessage?: string
): Promise<T> => {
  // Check if we have a cached response
  const cachedData = apiCache.get<T>(cacheKey);
  if (cachedData) {
    if (logMessage) {
      console.log(logMessage);
    }
    return cachedData;
  }

  // If not in cache, fetch from API
  const data = await fetchFn();

  // Cache the response
  apiCache.set(cacheKey, data, expiresIn);

  return data;
};