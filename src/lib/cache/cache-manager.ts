// src/lib/cache/cache-manager.ts
import NodeCache from 'node-cache';

class CacheManager {
  private cache: NodeCache;

  constructor() {
    // Standard TTL of 1 hour, check for expired entries every 10 minutes
    this.cache = new NodeCache({
      stdTTL: 3600,
      checkperiod: 600,
      useClones: false,
    });
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get<T>(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    return this.cache.set(key, value, ttl);
  }

  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) return cached;

    const fresh = await fetchFn();
    await this.set(key, fresh, ttl);
    return fresh;
  }

  async invalidate(key: string): Promise<void> {
    this.cache.del(key);
  }
}

export const cacheManager = new CacheManager();

// src/lib/cache/api-cache.ts
import { cacheManager } from './cache-manager';

export const apiCache = {
  async fetchOMDB(imdbId: string) {
    return cacheManager.getOrSet(
      `omdb:${imdbId}`,
      async () => {
        const response = await fetch(
          `https://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.OMDB_API_KEY}`
        );
        if (!response.ok) throw new Error('OMDB API request failed');
        return response.json();
      },
      3600 // Cache for 1 hour
    );
  },

  async fetchTMDB(movieId: string) {
    return cacheManager.getOrSet(
      `tmdb:${movieId}`,
      async () => {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}`
        );
        if (!response.ok) throw new Error('TMDB API request failed');
        return response.json();
      },
      3600
    );
  },
};
