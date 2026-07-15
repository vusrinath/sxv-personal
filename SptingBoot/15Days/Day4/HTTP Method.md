# HTTP Methods

Covers the standard HTTP methods (GET, POST, PUT, PATCH, DELETE) with their semantics, idempotency properties, and usage in REST APIs.

## Definitions

### GET

- Retrieves data from the server.
- **Idempotent** – calling it multiple times gives the same result.
- Request body is NOT expected (ignored by most servers).
- Data is sent via URL query parameters.

### POST

- Sends data to the server to **create** a new resource.
- **NOT idempotent** – calling it multiple times may create duplicate resources.
- Data is sent in the request body.

### PUT

- **Updates/replaces** an entire resource. If it doesn't exist, it may create one.
- **Idempotent** – calling it multiple times produces the same result.
- Client sends the complete updated resource in the body.

### PATCH

- **Partially updates** a resource (only the fields that need to change).
- **NOT necessarily idempotent** (depends on implementation).
- Lighter than PUT since you send only changed fields.

### DELETE

- Removes a resource from the server.
- **Idempotent** – deleting the same resource multiple times gives the same outcome (resource is gone).

---

## 🔥 Important / Tricky Interview Questions

**Q1: What is the difference between PUT and PATCH?**

> PUT replaces the **entire** resource. PATCH updates **only specific fields**. If you PUT with missing fields, those fields may be set to null.

**Q2: Is POST idempotent? Why not?**

> No. Calling POST `/users` twice with the same body can create two users with different IDs.

**Q3: Can GET have a request body?**

> Technically HTTP allows it, but it's **not recommended**. Most servers, proxies, and caches ignore or reject it. Use query params instead.

**Q4: Is DELETE always idempotent?**

> Yes in terms of server state (resource stays deleted). But the **response** may differ — first call returns 200, subsequent calls may return 404.

**Q5: PUT vs POST — who decides the URI?**

> - **POST**: Server decides the URI (e.g., `POST /users` → server creates `/users/101`)
> - **PUT**: Client decides the URI (e.g., `PUT /users/101` → client specifies the ID)

**Q6: Can we use GET to delete a resource?**

> Technically yes, but it's a **bad practice** and violates REST principles. GET should be safe (no side effects).

**Q7: What does "Safe" method mean?**

> A safe method does **not modify** server state. GET and HEAD are safe. POST, PUT, DELETE are not.

**Q8: What is the difference between Idempotent and Safe?**

> - **Safe** = No side effects (doesn't change anything)
> - **Idempotent** = Multiple identical calls produce the same result (may change state on first call)
> - GET is both safe and idempotent. PUT/DELETE are idempotent but NOT safe.

**Q9: Which HTTP methods are cacheable?**

> GET and HEAD are cacheable by default. POST responses can be cached only if explicit caching headers are set.

**Q10: What happens if you send a PUT request without the full object?**

> Missing fields may be set to null/default — because PUT means **full replacement**. Use PATCH for partial updates.

---

## Quick Reference Table

| Method | Idempotent | Safe | Has Body | Use Case |
| --- | --- | --- | --- | --- |
| GET | ✅ | ✅ | ❌ | Read data |
| POST | ❌ | ❌ | ✅ | Create resource |
| PUT | ✅ | ❌ | ✅ | Full update |
| PATCH | ❌\* | ❌ | ✅ | Partial update |
| DELETE | ✅ | ❌ | ❌\* | Remove resource |

> \*PATCH can be idempotent depending on implementation.\
> \*DELETE can have a body but it's uncommon.