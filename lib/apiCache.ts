/**
 * Simple in-memory cache for API responses
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}

export class ApiCache {
  private cache: Record<string, CacheEntry<any>> = {};

  /**
   * Set a cache entry with expiration
   * @param key Cache key
   * @param data Data to cache
   * @param expiresIn Time in milliseconds until the cache entry expires (default: 1 minute)
   */
  set<T>(key: string, data: T, expiresIn: number = 60000): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
      expiresIn
    };
  }

  /**
   * Get a cache entry if it exists and is not expired
   * @param key Cache key
   * @returns The cached data or null if not found or expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache[key];
    if (!entry) return null;

    const isExpired = Date.now() > entry.timestamp + entry.expiresIn;
    if (isExpired) {
      delete this.cache[key];
      return null;
    }

    return entry.data as T;
  }

  /**
   * Invalidate a specific cache entry
   * @param key Cache key to invalidate
   */
  invalidate(key: string): void {
    delete this.cache[key];
  }

  /**
   * Invalidate all cache entries that match a prefix
   * @param prefix Prefix to match cache keys against
   */
  invalidateByPrefix(prefix: string): void {
    Object.keys(this.cache).forEach(key => {
      if (key.startsWith(prefix)) {
        delete this.cache[key];
      }
    });
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache = {};
  }
}

// Create a singleton instance of the cache
export const apiCache = new ApiCache();