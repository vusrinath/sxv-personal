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