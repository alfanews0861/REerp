export interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export class OrganizationCacheService {
  private static cache: Map<string, CacheEntry<unknown>> = new Map();
  private static DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

  public static get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  public static set<T>(key: string, data: T, ttlMs: number = this.DEFAULT_TTL_MS): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlMs,
    });
  }

  public static invalidate(keyPattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(keyPattern)) {
        this.cache.delete(key);
      }
    }
  }

  public static clear(): void {
    this.cache.clear();
  }
}
