# Spring Boot Layered Architecture

Spring Boot applications follow a layered architecture where each layer has a distinct responsibility. Requests flow from the client through the controller, service, and repository layers down to the database.

## Architecture Flow

```
Client (Browser/Postman)
    ↓
Controller  →  handles HTTP request/response
    ↓
DTO         →  carries data between layers (no logic)
    ↓
Service     →  business logic lives here
    ↓
Repository  →  talks to the database
    ↓
Entity      →  maps to a database table
    ↓
Database
```

## Layer Responsibilities

| Layer | Role |
|-------|------|
| **Controller** | Handles HTTP requests and responses |
| **DTO** | Carries data between layers without business logic |
| **Service** | Contains business logic |
| **Repository** | Communicates with the database |
| **Entity** | Maps to a database table |
