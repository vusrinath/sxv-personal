# FastAPI Framework

FastAPI is a modern, high-performance web framework for building APIs with Python 3.7+ based on standard Python type hints.

## Key Characteristics

- **Fast** — One of the highest-performing Python frameworks, on par with Node.js and Go, thanks to Starlette (for the web layer) and Pydantic (for data validation).
- **Type-driven** — mme schemas using Python type annotations. FastAPI uses these for automatic validation, serialization, and documentation.
- **Auto-generated docs** — Provides interactive Swagger UI (`/docs`) and ReDoc (`/redoc`) out of the box, derived directly from your code.
- **Async-first** — Built on ASGI, so it natively supports `async`/`await` for concurrent I/O without threads.
- **Dependency injection** — Has a built-in DI system for shared logic like DB sessions, auth, pagination, etc.

## Minimal Example

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
```

Run it with:

```bash
uvicorn main:app --reload
```

This gives you a validated endpoint where `item_id` must be an int, `q` is an optional query param, and the docs are auto-generated at `/docs`.

## Core Building Blocks

| Concept | What it does |
|---------|-------------|
| Path operations | `@app.get()`, `@app.post()`, etc. map routes to functions |
| Pydantic models | Define request/response bodies with validation |
| Depends() | Inject shared dependencies (DB, auth, config) |
| Middleware | Cross-cutting concerns (CORS, logging, timing) |
| Background tasks | Fire-and-forget work after returning a response |
| WebSockets | Real-time bidirectional communication |

## When to Pick FastAPI Over Alternatives

- **Over Flask** — when you need async support, automatic validation, or auto docs without extensions.
- **Over Django REST Framework** — when you want something lighter, faster, and don't need Django's ORM/admin.
- **Over Starlette directly** — when you want the ergonomics of type-based validation and docs generation on top of Starlette's performance.

FastAPI is widely used for microservices, ML model serving, and any API-first backend where performance and developer experience both matter.
