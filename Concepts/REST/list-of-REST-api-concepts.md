# REST API Concepts

## Core Design Principles

- **Idempotency** – Repeated requests produce the same result
- **Statelessness** – Server holds no client session state
- **Cachability** – Responses declare themselves cacheable or not
- **Uniform Interface** – Consistent resource-based URLs
- **HATEOAS** – Hypermedia links drive state transitions
- **Content Negotiation** – Client/server agree on format (JSON, XML)
- **Resource Naming** – Nouns over verbs in URIs

## HTTP Methods & Semantics

- **Safe Methods** – GET/HEAD don't modify state
- **Idempotent Methods** – GET, PUT, DELETE produce same result on repeat
- **Non-idempotent Methods** – POST may create duplicates
- **Method Semantics** – Correct use of GET, POST, PUT, PATCH, DELETE

## Reliability & Resilience

- **Retry Safety** – Safe to retry without side effects
- **Idempotency Keys** – Client-generated tokens to deduplicate requests
- **Exponential Backoff** – Progressive retry delays
- **Circuit Breaker** – Stop calling failing services
- **Timeout Handling** – Client/server timeout strategies
- **Graceful Degradation** – Partial functionality under failure

## Versioning & Evolution

- **API Versioning** – URI, header, or query param based
- **Backward Compatibility** – Changes don't break existing clients
- **Deprecation Strategy** – Sunset headers, migration paths

## Security

- **Authentication** – OAuth2, API Keys, JWT
- **Authorization** – Scopes, RBAC
- **Rate Limiting / Throttling**
- **CORS** – Cross-Origin Resource Sharing
- **Input Validation & Sanitization**
- **TLS/HTTPS Enforcement**

## Pagination & Filtering

- **Cursor-based Pagination**
- **Offset-based Pagination**
- **Filtering, Sorting, Field Selection**
- **Partial Responses** – Sparse fieldsets

## Error Handling

- **Consistent Error Format** – RFC 7807 Problem Details
- **Meaningful HTTP Status Codes**
- **Retry-After Headers**
- **Validation Error Responses**

## Performance

- **ETags & Conditional Requests** – If-None-Match, If-Modified-Since
- **Compression** – gzip, brotli
- **Connection Keep-Alive**
- **Bulk/Batch Operations**
- **Asynchronous Operations** – 202 Accepted + polling

## Observability

- **Correlation IDs / Request IDs**
- **Structured Logging**
- **Health Check Endpoints**
- **OpenAPI/Swagger Documentation**

## Advanced Patterns

- **Optimistic Concurrency Control** – ETags + If-Match
- **Pessimistic Locking**
- **Event-Driven Webhooks**
- **Long Polling / Server-Sent Events**
- **Content-Type Versioning**
- **Hypermedia Controls** – Links, actions
- **Eventual Consistency**
- **Saga Pattern** – Distributed transactions
- **Compensating Transactions**