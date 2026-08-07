interface CacheEntry {
  result: boolean;
  timestamp: number;
}

export class PermissionCache {
  private static cache = new Map<string, CacheEntry>();
  private static DEFAULT_TTL_MS = 60 * 1000; // 1 minute cache TTL

  private static generateKey(userPermissions: string[], requiredPermission: string): string {
    return `${userPermissions.sort().join(',')}:${requiredPermission}`;
  }

  public static get(userPermissions: string[], requiredPermission: string): boolean | null {
    const key = this.generateKey(userPermissions, requiredPermission);
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.DEFAULT_TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    return entry.result;
  }

  public static set(userPermissions: string[], requiredPermission: string, result: boolean): void {
    const key = this.generateKey(userPermissions, requiredPermission);
    this.cache.set(key, {
      result,
      timestamp: Date.now(),
    });
  }

  public static clear(): void {
    this.cache.clear();
  }
}
