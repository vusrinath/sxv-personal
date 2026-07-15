# Redis & Caching

Redis is an in-memory key-value data store used as a cache, database, and message broker. This note covers data structures, caching strategies, invalidation patterns, and distributed Redis configurations.

---

## What is Redis?

**Redis** (Remote Dictionary Server) is an open-source, **in-memory key-value data store** used as a cache, database, message broker, and queue.

- Data lives in **RAM** → sub-millisecond reads/writes
- Supports rich data structures (not just strings)
- Single-threaded event loop → no locking issues
- Optional persistence to disk (RDB snapshots, AOF logs)

---

## Why Use Redis?

```
Without Cache:
  Client → App Server → Database (50-100ms per query)

With Redis Cache:
  Client → App Server → Redis (0.5-1ms) ✓ cache hit
                       → Database (only on cache miss)
```

**Use it when:**
- Same data is read frequently (hot data)
- Database is a bottleneck
- You need fast session storage
- You need distributed locking, rate limiting, or pub/sub

---

## Data Structures

| Structure | Example Use Case |
|-----------|-----------------|
| **String** | Cache a JSON response, counters |
| **Hash** | Store user profile fields |
| **List** | Message queue, activity feed |
| **Set** | Tags, unique visitors |
| **Sorted Set (ZSet)** | Leaderboards, ranking |
| **Stream** | Event log (like Kafka-lite) |
| **Bitmap** | Feature flags, daily active users |
| **HyperLogLog** | Approximate unique counts |

---

## Caching Strategies

### 1. Cache-Aside (Lazy Loading)
```
Read:  App checks cache → miss → read DB → write to cache → return
Write: App writes to DB → invalidate/delete cache key
```
- Most common pattern
- Cache only contains data that's been requested
- Risk: stale data if cache isn't invalidated properly

### 2. Write-Through
```
Write: App writes to cache AND DB simultaneously
Read:  Always from cache (always fresh)
```
- Data is never stale
- Higher write latency (two writes)
- Cache may hold data that's never read

### 3. Write-Behind (Write-Back)
```
Write: App writes to cache → cache async writes to DB later
```
- Fastest writes
- Risk: data loss if cache crashes before DB write

### 4. Read-Through
```
Read: App reads from cache → cache itself fetches from DB on miss
```
- Cache is the single interface (app never talks to DB directly)

---

## Cache Invalidation (The Hard Problem)

| Strategy | How |
|----------|-----|
| **TTL (Time to Live)** | Key auto-expires after N seconds |
| **Event-based** | Invalidate on write/update events |
| **Version-based** | Key includes version: `user:123:v2` |
| **Pub/Sub** | Publish invalidation events to subscribers |

> "There are only two hard things in CS: cache invalidation and naming things."

---

## Common Problems

### Cache Stampede (Thundering Herd)
- Popular key expires → 1000 requests hit DB simultaneously
- **Fix:** Lock (only one request fetches), or pre-warm cache before expiry

### Cache Penetration
- Requests for data that doesn't exist (always misses cache AND DB)
- **Fix:** Cache null results with short TTL, or use Bloom Filter

### Cache Avalanche
- Many keys expire at the same time → DB overloaded
- **Fix:** Add random jitter to TTL values

---

## Redis in Distributed Systems

### Redis Cluster
- Data sharded across multiple nodes (16384 hash slots)
- Automatic failover with replicas
- Horizontal scaling for large datasets

### Redis Sentinel
- Monitors master/replica setup
- Automatic failover if master goes down
- Does NOT shard data (single master holds all data)

### Redis as Distributed Lock
```
SET lock_key unique_value NX EX 30
```
- `NX` = only set if not exists
- `EX 30` = expires in 30 seconds
- Used for: preventing duplicate processing, leader election

---

## Redis vs Memcached

| Feature | Redis | Memcached |
|---------|-------|-----------|
| Data structures | Rich (hash, list, set, etc.) | Strings only |
| Persistence | Yes (RDB, AOF) | No |
| Pub/Sub | Yes | No |
| Clustering | Yes (Redis Cluster) | Client-side sharding |
| Lua scripting | Yes | No |
| Use case | Versatile | Simple key-value caching |

---

## Redis in a Spring Boot App

```java
@Cacheable(value = "users", key = "#id")
public User getUserById(Long id) {
    return userRepository.findById(id).orElseThrow();
}

@CacheEvict(value = "users", key = "#id")
public void updateUser(Long id, User user) {
    userRepository.save(user);
}
```

Dependencies: `spring-boot-starter-data-redis`, `spring-boot-starter-cache`

---

## Interview Key Points

1. Redis is **single-threaded** — no race conditions, but CPU-bound operations block everything
2. **TTL** is your best friend — always set expiry on cache keys
3. Cache is **not a source of truth** — DB is; cache is a performance optimization
4. Know the difference between **Cache-Aside vs Write-Through**
5. Know how to handle **cache stampede** and **cache penetration**
6. Redis Cluster for **horizontal scaling**, Sentinel for **high availability**
