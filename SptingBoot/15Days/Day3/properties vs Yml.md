# application.properties vs application.yml

Both are configuration files that Spring Boot reads at startup to configure your application. They do the **exact same thing** — the difference is syntax and readability.

---

## Side-by-Side Comparison

### application.properties (flat key-value pairs)

```properties
server.port=8081
server.servlet.context-path=/api

spring.datasource.url=jdbc:postgresql://localhost:5432/mydb
spring.datasource.username=admin
spring.datasource.password=secret
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

app.name=Employee Service
app.version=1.0.0
app.features.email-notifications=true
app.features.audit-logging=false
```

### application.yml (hierarchical YAML)

```yaml
server:
  port: 8081
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: admin
    password: secret
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true

app:
  name: Employee Service
  version: 1.0.0
  features:
    email-notifications: true
    audit-logging: false
```

---

## Key Differences

| Aspect | .properties | .yml |
|--------|-------------|------|
| **Syntax** | `key=value` flat pairs | Indentation-based hierarchy |
| **Readability** | Repetitive prefixes (`spring.datasource.xxx`) | Grouped naturally by nesting |
| **Lists** | `app.servers[0]=dev`, `app.servers[1]=prod` | `- dev` / `- prod` (cleaner) |
| **Multi-line values** | Awkward (use `\` continuation) | Native support with `|` or `>` |
| **Comments** | `# comment` | `# comment` |
| **Multiple profiles in one file** | Not possible — need separate files | Use `---` separator |
| **Indentation sensitivity** | None — order doesn't matter | **Critical** — wrong indent breaks config |
| **IDE support** | Simple, no formatting issues | Needs YAML plugin for proper validation |

---

## Lists — The Biggest Syntax Difference

### .properties

```properties
app.allowed-origins[0]=http://localhost:3000
app.allowed-origins[1]=http://localhost:8080
app.allowed-origins[2]=https://myapp.com
```

### .yml

```yaml
app:
  allowed-origins:
    - http://localhost:3000
    - http://localhost:8080
    - https://myapp.com
```

YAML is clearly more readable for lists.

---

## Multiple Profiles in One File (YAML only)

### .yml — all profiles in one file

```yaml
# Default (shared by all profiles)
app:
  name: Employee Service

---
spring:
  config:
    activate:
      on-profile: dev
  datasource:
    url: jdbc:h2:mem:devdb

---
spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: jdbc:postgresql://prod-server:5432/mydb
```

### .properties — need separate files

```
application.properties          ← shared config
application-dev.properties      ← dev-specific
application-prod.properties     ← prod-specific
```

---

## Binding to Java Classes (@ConfigurationProperties)

Both formats bind identically to a Java config class:

```java
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppConfig {
    private String name;
    private String version;
    private Features features;

    public static class Features {
        private boolean emailNotifications;
        private boolean auditLogging;
        // getters and setters
    }
    // getters and setters
}
```

Spring maps `app.features.email-notifications` (properties) or the nested YAML equivalent to `features.emailNotifications` automatically. Kebab-case in config → camelCase in Java.

---

## Accessing Values with @Value

Works the same regardless of file format:

```java
@Service
public class MyService {

    @Value("${app.name}")
    private String appName;

    @Value("${server.port}")
    private int port;

    @Value("${app.features.email-notifications:false}")  // default value after colon
    private boolean emailEnabled;
}
```

---

## Common YAML Gotchas

### 1. Indentation Errors (Most Common)

```yaml
# WRONG — misaligned
spring:
  datasource:
  url: jdbc:h2:mem:testdb    # ← this is at the wrong level!

# CORRECT
spring:
  datasource:
    url: jdbc:h2:mem:testdb   # ← 2 more spaces under datasource
```

### 2. Strings That Look Like Other Types

```yaml
# WRONG — YAML interprets "on" as boolean true
feature-toggle: on

# CORRECT — quote it
feature-toggle: "on"

# Same issue with these values: yes, no, true, false, on, off
```

### 3. Colons in Values

```yaml
# WRONG — YAML thinks this is a nested key
message: Error: something broke

# CORRECT — quote it
message: "Error: something broke"
```

### 4. Tab Characters

```yaml
# WRONG — tabs are ILLEGAL in YAML
spring:
→ datasource:     # ← this is a tab, not spaces!

# CORRECT — always use spaces (2 or 4, be consistent)
spring:
  datasource:
```

---

## Which Should You Use?

### Use .yml when:
- Your config is deeply nested (reduces repetition)
- You have lists or complex structures
- You want all profiles in one file
- Your team already uses YAML (most modern projects do)

### Use .properties when:
- Config is simple and flat (just a few keys)
- You're in a legacy codebase that uses it
- You want to avoid indentation-related bugs
- Team members are unfamiliar with YAML syntax

### Industry Reality:
**~80% of new Spring Boot projects use YAML.** It's the de facto standard. But both are equally powerful — Spring doesn't care which you choose.

---

## Pro Tips

1. **Don't mix both in the same project** — pick one and stick with it. If both exist, `.properties` takes precedence for overlapping keys.

2. **Use profiles properly:**
   ```
   application.yml              ← shared/default config
   application-dev.yml          ← local development
   application-test.yml         ← test environment
   application-prod.yml         ← production
   ```

3. **Never commit secrets** — use environment variables or a secrets manager:
   ```yaml
   spring:
     datasource:
       password: ${DB_PASSWORD}   # reads from environment variable
   ```

4. **Validate your YAML** — use the VS Code YAML extension (Red Hat) to catch indentation errors before runtime.

5. **Use relaxed binding** — Spring understands all these as the same property:
   ```
   app.emailNotifications     (camelCase)
   app.email-notifications    (kebab-case) ← recommended
   app.email_notifications    (underscore)
   APP_EMAIL_NOTIFICATIONS    (uppercase — for env vars)
   ```

---

## Quick Reference

```yaml
# String
app.name: My App

# Number
server.port: 8080

# Boolean
spring.jpa.show-sql: true

# List
app.cors.origins:
  - http://localhost:3000
  - https://myapp.com

# Map
app.cache:
  ttl: 3600
  max-size: 1000

# Multi-line string
app.banner: |
  Welcome to
  My Application
  Version 1.0

# Environment variable substitution
spring.datasource.url: ${DATABASE_URL:jdbc:h2:mem:default}
```
