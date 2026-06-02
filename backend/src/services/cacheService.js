const DEFAULT_TTL_MS = parsePositiveInteger(process.env.TORRE_CACHE_TTL_MS, 5 * 60 * 1000);
const DEFAULT_MAX_ITEMS = parsePositiveInteger(process.env.TORRE_CACHE_MAX_ITEMS, 100);

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

class MemoryCache {
  constructor({ ttlMs = DEFAULT_TTL_MS, maxItems = DEFAULT_MAX_ITEMS } = {}) {
    this.ttlMs = ttlMs;
    this.maxItems = maxItems;
    this.entries = new Map();
  }

  get(key) {
    const entry = this.entries.get(key);
    if (!entry) return undefined;

    const now = Date.now();
    if (entry.expiresAt <= now) {
      this.entries.delete(key);
      return undefined;
    }

    entry.lastAccessedAt = now;
    return entry.value;
  }

  set(key, value, ttlMs = this.ttlMs) {
    const now = Date.now();
    this.entries.set(key, {
      value,
      expiresAt: now + ttlMs,
      lastAccessedAt: now,
    });
    this.prune(now);
    return value;
  }

  async getOrSet(key, factory, { ttlMs = this.ttlMs } = {}) {
    const cachedValue = this.get(key);
    if (cachedValue !== undefined) return cachedValue;

    const valuePromise = Promise.resolve().then(factory);
    this.set(key, valuePromise, ttlMs);

    try {
      return await valuePromise;
    } catch (err) {
      this.entries.delete(key);
      throw err;
    }
  }

  prune(now = Date.now()) {
    for (const [key, entry] of this.entries.entries()) {
      if (entry.expiresAt <= now) {
        this.entries.delete(key);
      }
    }

    if (this.entries.size <= this.maxItems) return;

    const oldestKeys = [...this.entries.entries()]
      .sort(([, left], [, right]) => left.lastAccessedAt - right.lastAccessedAt)
      .slice(0, this.entries.size - this.maxItems)
      .map(([key]) => key);

    oldestKeys.forEach((key) => this.entries.delete(key));
  }

  clear() {
    this.entries.clear();
  }

  stats() {
    this.prune();
    return {
      size: this.entries.size,
      maxItems: this.maxItems,
      ttlMs: this.ttlMs,
    };
  }
}

const defaultCache = new MemoryCache();

module.exports = {
  MemoryCache,
  defaultCache,
  getOrSet: defaultCache.getOrSet.bind(defaultCache),
  clearCache: defaultCache.clear.bind(defaultCache),
  getCacheStats: defaultCache.stats.bind(defaultCache),
};
