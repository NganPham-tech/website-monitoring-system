/**
 * Simple In-Memory Cache to simulate Redis for light-weight dashboard metrics caching
 */
class MemoryCache {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Set a key-value pair with TTL
   * @param {string} key
   * @param {any} value
   * @param {number} ttlMinutes
   */
  set(key, value, ttlMinutes = 5) {
    const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Get value by key, returns null if not found or expired
   * @param {string} key
   * @returns {any}
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Clear cache manually
   */
  clear(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

// Export as singleton
module.exports = new MemoryCache();
