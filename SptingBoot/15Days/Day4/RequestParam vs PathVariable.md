# @RequestParam vs @PathVariable

## @PathVariable

Extracts values from the URI path itself.

```java
// GET /users/42
@GetMapping("/users/{id}")
public User getUser(@PathVariable Long id) { ... }
```

## @RequestParam

Extracts values from query parameters (after `?`).

```java
// GET /users?id=42
@GetMapping("/users")
public User getUser(@RequestParam Long id) { ... }
```

## Comparison

| Aspect | @PathVariable | @RequestParam |
| --- | --- | --- |
| Source | URL path (`/users/{id}`) | Query string (`?id=42`) |
| Required by default | Yes | Yes (configurable) |
| Use case | Identifying a resource | Filtering, sorting, pagination |
| REST style | More RESTful for resource IDs | Better for optional/multiple params |

## When to Use Which

- Use `@PathVariable` when the value identifies a specific resource (e.g., `/orders/123`).
- Use `@RequestParam` when the value filters or modifies the response (e.g., `/orders?status=pending&page=2`).