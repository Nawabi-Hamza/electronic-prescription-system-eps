// Usage: const cache = require('./cache');

const client = require('../config/redis');

// connect once (call this at app start)
async function connectRedis() {
  if (!client.isOpen) await client.connect();
}

// Get from cache or run fetcher(), store result, return it
// fetcher must be an async function that returns JS serializable value
async function getOrSetCache(key, fetcher, ttlSeconds = 60) {
  await connectRedis();
  const cached = await client.get(key);
  if (cached !== null) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      // If parse fails, fall back to fetching fresh data
      console.warn('Failed to parse cache for', key, e);
    }
  }

  // Not cached -> run fetcher
  const data = await fetcher();

  // Cache even null/undefined results to avoid repeated DB hits: store null explicitly
  // But keep short ttl for nulls if you want (here same ttl)
  await client.setEx(key, ttlSeconds, JSON.stringify(data === undefined ? null : data));

  return data;
}

// Delete a single key
async function invalidateKey(key) {
  await connectRedis();
  try {
    await client.del(key);
  } catch (err) {
    console.error('Redis invalidateKey error', err);
  }
}

// Delete keys by prefix (careful: scans the keyspace but uses iterator so it is safe)
// Example: invalidateByPrefix('doctor_') removes doctor_1, doctor_2, doctor_list, etc.
async function invalidateByPrefix(prefix) {
  await connectRedis();
  try {
    const pattern = `${prefix}*`;
    // node-redis provides scanIterator for efficient scanning
    for await (const k of client.scanIterator({ MATCH: pattern, COUNT: 100 })) {
      try {
        await client.del(k);
      } catch (e) {
        console.warn('Failed to delete cache key', k, e);
      }
    }
  } catch (err) {
    console.error('Redis invalidateByPrefix error', err);
  }
}

// Export
module.exports = {
  connectRedis,
  getOrSetCache,
  invalidateKey,
  invalidateByPrefix,
};
