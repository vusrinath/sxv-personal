# System Design Concepts — 60-Day Learning Plan

> **Goal:** Learn System Design from fundamentals to advanced, in the right order. **Time:** 1 hour/day | 60 days **Approach:** Each phase builds on the previous. Don't skip ahead.

---

## Phase 1 — Foundations (Days 1–10)

> Must-know before anything else. Every system design interview starts here.

| Day | Concept | Why It Matters |
| --- | --- | --- |
| 1 | **How the Internet Works** — DNS, HTTP/HTTPS, TCP/IP, Client-Server model | Everything runs on this |
| 2 | **Vertical vs Horizontal Scaling** — Scale up vs scale out | First decision in any design |
| 3 | **Latency vs Throughput vs Availability** — The core tradeoffs | Vocabulary for every discussion |
| 4 | **CAP Theorem** — Consistency, Availability, Partition Tolerance | Foundation of distributed systems |
| 5 | **Load Balancers** — Round robin, least connections, consistent hashing | How traffic is distributed |
| 6 | **Caching Basics** — What, why, where (client, CDN, server, DB) | Most impactful performance tool |
| 7 | **Databases 101** — SQL vs NoSQL, when to use which | Core data storage decision |
| 8 | **APIs** — REST vs GraphQL vs gRPC | How services communicate |
| 9 | **Proxies** — Forward proxy, reverse proxy, API Gateway | Traffic control layer |
| 10 | **CDN (Content Delivery Network)** — How it works, when to use | Static content at scale |

---

## Phase 2 — Core Building Blocks (Days 11–25)

> The components you'll use in every system design.

| Day | Concept | Why It Matters |
| --- | --- | --- |
| 11 | **SQL Deep Dive** — Indexes, joins, ACID, transactions | Most systems use relational DBs |
| 12 | **NoSQL Deep Dive** — Key-value, document, column, graph stores | Right tool for the right job |
| 13 | **Database Replication** — Master-slave, master-master | High availability for data |
| 14 | **Database Sharding** — Horizontal partitioning strategies | Scaling data beyond one machine |
| 15 | **Caching Strategies** — Cache-aside, write-through, write-back, TTL | Cache correctly or cause bugs |
| 16 | **Redis** — Data structures, use cases, pub/sub, persistence | Most used cache in production |
| 17 | **Message Queues** — Why async, decoupling, producers/consumers | Backbone of scalable systems |
| 18 | **Kafka** — Topics, partitions, consumer groups, offsets | Industry standard for streaming |
| 19 | **Consistent Hashing** — How it works, virtual nodes | Load balancing + sharding key |
| 20 | **Bloom Filters** — Probabilistic data structure | Space-efficient membership checks |
| 21 | **Rate Limiting** — Token bucket, leaky bucket, sliding window | Protect services from abuse |
| 22 | **Idempotency** — Keys, retry safety, exactly-once semantics | Correctness in distributed systems |
| 23 | **Long Polling vs WebSockets vs SSE** — Real-time communication | Chat, notifications, live feeds |
| 24 | **Blob Storage** — S3, object storage concepts | Files, images, videos at scale |
| 25 | **Search Systems** — Elasticsearch, inverted index, full-text search | Search feature in any product |

---

## Phase 3 — Reliability & Scalability Patterns (Days 26–38)

> How real systems stay up and handle failures.

| Day | Concept | Why It Matters |
| --- | --- | --- |
| 26 | **High Availability** — Redundancy, failover, SLA/SLO/SLI | Production systems never go down |
| 27 | **Fault Tolerance** — Graceful degradation, bulkheads | Partial failure vs total failure |
| 28 | **Circuit Breaker Pattern** — Fail fast, half-open state | Stop cascading failures |
| 29 | **Retry & Exponential Backoff** — With jitter, idempotency | Safe retries under failure |
| 30 | **Timeouts & Deadlines** — Client/server timeout strategies | Prevent resource exhaustion |
| 31 | **Service Discovery** — Client-side vs server-side, Eureka, Consul | Microservices find each other |
| 32 | **Health Checks & Heartbeats** — Liveness vs readiness probes | Know when a service is down |
| 33 | **Distributed Transactions** — 2PC, Saga pattern | Data consistency across services |
| 34 | **Event-Driven Architecture** — Events, commands, reactions | Loose coupling at scale |
| 35 | **CQRS** — Command Query Responsibility Segregation | Separate read and write models |
| 36 | **Event Sourcing** — Append-only log as source of truth | Audit trail + time travel |
| 37 | **Backpressure** — Handling fast producers, slow consumers | Prevent system overload |
| 38 | **Chaos Engineering** — Intentional failure injection | Netflix's approach to resilience |

---

## Phase 4 — Microservices & Distributed Systems (Days 39–48)

> How large systems are structured and deployed.

| Day | Concept | Why It Matters |
| --- | --- | --- |
| 39 | **Monolith vs Microservices** — Tradeoffs, when to split | Architecture decision #1 |
| 40 | **API Gateway** — Routing, auth, rate limiting, aggregation | Single entry point for microservices |
| 41 | **Service Mesh** — Istio, sidecar proxy, mTLS | Infra-level service communication |
| 42 | **Distributed Caching** — Redis Cluster, cache invalidation | Shared cache across services |
| 43 | **Distributed Locking** — Redis SETNX, Zookeeper | Coordination across instances |
| 44 | **Consensus Algorithms** — Raft, Paxos (conceptual) | How distributed systems agree |
| 45 | **Leader Election** — Zookeeper, etcd | One node takes charge |
| 46 | **Distributed Tracing** — Zipkin, Jaeger, correlation IDs | Debug across 10 services |
| 47 | **Observability** — Metrics, logs, traces (the three pillars) | Know what's happening in prod |
| 48 | **Containerization & Orchestration** — Docker, Kubernetes concepts | Modern deployment standard |

---

## Phase 5 — Real-World System Design (Days 49–60)

> Apply everything by designing real systems end-to-end.

| Day | System to Design | Key Concepts Practiced |
| --- | --- | --- |
| 49 | **URL Shortener** (like bit.ly) | Hashing, redirects, analytics, DB choice |
| 50 | **Rate Limiter** | Token bucket, Redis, distributed counters |
| 51 | **Key-Value Store** (like Redis) | Consistent hashing, replication, CAP |
| 52 | **Pastebin** | Blob storage, expiry, unique ID generation |
| 53 | **Twitter Feed / News Feed** | Fan-out, caching, pagination, ranking |
| 54 | **Instagram / Image Hosting** | CDN, blob storage, metadata DB, resizing |
| 55 | **WhatsApp / Chat System** | WebSockets, message queues, delivery receipts |
| 56 | **YouTube / Video Streaming** | CDN, chunked upload, transcoding, adaptive bitrate |
| 57 | **Uber / Ride Sharing** | Geospatial indexing, real-time location, matching |
| 58 | **Google Search / Typeahead** | Inverted index, trie, ranking, crawling |
| 59 | **Distributed Job Scheduler** | Cron, priority queues, fault tolerance |
| 60 | **Design Review & Gaps** | Revisit weak areas, mock interview practice |

---

## Concepts by Category (Quick Reference)

### Networking

- DNS, HTTP/HTTPS, TCP/UDP, WebSockets, gRPC, REST, GraphQL

### Storage

- SQL, NoSQL, Blob Storage, Time-Series DB, Graph DB, Search Index

### Caching

- Redis, Memcached, CDN, Cache strategies, Cache invalidation

### Messaging

- Kafka, RabbitMQ, SQS, Pub/Sub, Event streaming

### Scalability

- Load balancing, Sharding, Replication, Consistent hashing, Partitioning

### Reliability

- Circuit breaker, Retry, Timeout, Bulkhead, Chaos engineering

### Architecture Patterns

- Microservices, CQRS, Event sourcing, Saga, Event-driven

### Observability

- Logging, Metrics, Tracing, Alerting, Dashboards

---

## Daily Routine (1 Hour)

| Block | Time | Activity |
| --- | --- | --- |
| Learn | 30 min | Read the concept, understand the why |
| Diagram | 15 min | Draw it — boxes, arrows, data flow |
| Note | 15 min | Write key points in your own words |

---

## Resources

| Resource | Best For |
| --- | --- |
| [ByteByteGo](https://bytebytego.com) | Visual system design explanations |
| [System Design Primer (GitHub)](https://github.com/donnemartin/system-design-primer) | Free, comprehensive reference |
| [Designing Data-Intensive Applications](https://dataintensive.net) (book) | Deep distributed systems knowledge |
| [High Scalability Blog](http://highscalability.com) | Real-world architecture case studies |
| YouTube: ByteByteGo channel | Short visual concept videos |
| YouTube: Gaurav Sen | System design walkthroughs |

---

> **Rule:** Understand the tradeoffs, not just the tools. Every system design answer is: *"It depends — here's why."*