# @RequestBody — Deserializing JSON Input

Explains how Spring's @RequestBody annotation reads the HTTP request body and automatically converts JSON into a Java object using HttpMessageConverters.

## What is @RequestBody?

`@RequestBody` is a Spring annotation that tells Spring to **read the HTTP request body** and **convert (deserialize) it into a Java object** automatically.

> JSON → Java Object = **Deserialization**

---

## How It Works (Behind the Scenes)

1. Client sends a POST/PUT request with JSON in the body.
2. Spring uses **HttpMessageConverter** (by default `MappingJackson2HttpMessageConverter` from Jackson library).
3. Jackson maps JSON keys to Java object fields (matching by field name).
4. The Java object is passed to your controller method.

```
Client (JSON) → @RequestBody → Jackson Deserializer → Java Object
```

---

## Example

### Request (from Postman/Frontend)
```json
POST /api/users
Content-Type: application/json

{
  "name": "Shiva",
  "email": "shiva@example.com",
  "age": 25
}
```

### Java DTO Class
```java
public class UserDTO {
    private String name;
    private String email;
    private int age;

    // Getters and Setters (required for Jackson)
}
```

### Controller
```java
@RestController
@RequestMapping("/api")
public class UserController {

    @PostMapping("/users")
    public String createUser(@RequestBody UserDTO user) {
        return "User created: " + user.getName();
    }
}
```

Spring automatically converts the JSON body → `UserDTO` object.

---

## What is Deserialization?

| Term              | Meaning                          |
|-------------------|----------------------------------|
| Serialization     | Java Object → JSON (Response)    |
| Deserialization   | JSON → Java Object (Request)     |

- `@RequestBody` = Deserialization (input)
- `@ResponseBody` = Serialization (output, implicit in `@RestController`)

---

## Important Points

- `Content-Type: application/json` header **must** be set in the request.
- Java class **field names must match** JSON keys (or use `@JsonProperty` to map different names).
- A **no-arg constructor** is needed for Jackson to create the object.
- Getters/Setters are needed (or use Lombok `@Data`).

---

## Handling Mismatches with @JsonProperty

```java
public class UserDTO {
    @JsonProperty("user_name")   // maps JSON key "user_name" → field "name"
    private String name;

    private String email;
}
```

```json
{ "user_name": "Shiva", "email": "shiva@example.com" }
```

---

## 🔥 Tricky Interview Questions

**Q1: What happens if JSON has extra fields not present in the Java class?**
> By default, Jackson **ignores** extra fields. You can make it strict using:
> `@JsonIgnoreProperties(ignoreUnknown = false)` on the class.

**Q2: What if a required field is missing in JSON?**
> The field will be set to its **default value** (null for objects, 0 for int). Use `@NotNull` with `@Valid` for validation.

**Q3: Can @RequestBody be used with GET requests?**
> Technically yes, but it's **bad practice**. GET should not have a body.

**Q4: What if Content-Type header is not set to application/json?**
> Spring throws `HttpMediaTypeNotSupportedException` (415 Unsupported Media Type).

**Q5: Difference between @RequestBody and @RequestParam?**
> - `@RequestParam` → reads from URL query params (`?name=Shiva`)
> - `@RequestBody` → reads from the request body (JSON payload)

**Q6: Can we have multiple @RequestBody in one method?**
> **No.** Only one `@RequestBody` per method. The request body can be read only once. Use a wrapper DTO if you need multiple objects.

**Q7: What library does Spring use for JSON deserialization by default?**
> **Jackson** (`jackson-databind`). It's auto-configured by Spring Boot via `spring-boot-starter-web`.
