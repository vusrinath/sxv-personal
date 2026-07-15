# Bean Scopes: Singleton vs Prototype

---

## What is a Bean Scope?

Bean scope defines **how many instances** of a bean Spring creates and **how long they live**.

Spring supports 6 scopes, but the two core ones are:

| Scope | Instances | Lifecycle |
| --- | --- | --- |
| **singleton** (default) | One per Spring container | Lives as long as the application |
| **prototype** | New instance every time it's requested | Spring creates it, but doesn't manage its destruction |

---

## Singleton Scope (Default ✅)

Spring creates **exactly one instance** of the bean and reuses it everywhere.

```java
@Service
public class EmployeeService {

    public EmployeeService() {
        System.out.println("EmployeeService created: " + this.hashCode());
    }
}
```

```java
@RestController
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService service1;
    private final EmployeeService service2;

    @GetMapping("/test")
    public String test() {
        // Both print the SAME hashCode — same instance
        System.out.println(service1.hashCode());
        System.out.println(service2.hashCode());
        return "Same instance: " + (service1 == service2); // true
    }
}
```

### Key Characteristics

- **One instance** shared across the entire application context
- Created at **application startup** (eager initialization)
- **Thread-unsafe** if you store mutable state — avoid instance variables that change
- Default for all beans (`@Component`, `@Service`, `@Repository`, `@Controller`)

### When to Use

- Stateless services (business logic, validation, mapping)
- Repository/DAO classes
- Configuration holders
- 99% of your beans will be singleton

### ⚠️ Common Pitfall — Mutable State in Singleton

```java
@Service
public class CounterService {

    private int count = 0; // DANGEROUS — shared across all threads

    public int increment() {
        return ++count; // Race condition in concurrent requests
    }
}
```

Multiple threads share this single instance — `count` will produce unpredictable results.

---

## Prototype Scope

Spring creates a **new instance every time** the bean is requested.

```java
@Component
@Scope("prototype")
public class ReportGenerator {

    private final String reportId = UUID.randomUUID().toString();

    public ReportGenerator() {
        System.out.println("ReportGenerator created: " + this.hashCode());
    }

    public String getReportId() {
        return reportId;
    }
}
```

```java
@RestController
public class ReportController {

    @Autowired
    private ApplicationContext context;

    @GetMapping("/report")
    public String generateReport() {
        // New instance every time
        ReportGenerator gen1 = context.getBean(ReportGenerator.class);
        ReportGenerator gen2 = context.getBean(ReportGenerator.class);

        System.out.println(gen1.hashCode()); // different
        System.out.println(gen2.hashCode()); // different

        return "Same instance: " + (gen1 == gen2); // false
    }
}
```

### Key Characteristics

- **New instance** created on every `getBean()` call or injection point
- Spring does **NOT manage the full lifecycle** — no `@PreDestroy` callback
- You are responsible for cleanup/resource release
- Created **lazily** — only when requested

### When to Use

- Stateful objects that hold request-specific data
- Objects that are expensive to share (non-thread-safe third-party libs)
- Builder/generator patterns where each caller needs a fresh instance

---

## The Singleton-Prototype Trap ⚠️

Injecting a prototype bean into a singleton **does NOT give you a new prototype each time**.

### ❌ Problem

```java
@Service
public class NotificationService {

    private final ReportGenerator generator; // Injected ONCE at startup

    public NotificationService(ReportGenerator generator) {
        this.generator = generator;
    }

    public String send() {
        // Same instance every time — prototype scope is defeated!
        return generator.getReportId();
    }
}
```

The prototype is injected once when the singleton is created. After that, the same instance is reused.

### ✅ Solution 1: ObjectFactory / Provider

```java
@Service
public class NotificationService {

    private final ObjectFactory<ReportGenerator> generatorFactory;

    public NotificationService(ObjectFactory<ReportGenerator> generatorFactory) {
        this.generatorFactory = generatorFactory;
    }

    public String send() {
        // New instance every call
        ReportGenerator generator = generatorFactory.getObject();
        return generator.getReportId();
    }
}
```

### ✅ Solution 2: @Lookup Method

```java
@Service
public abstract class NotificationService {

    @Lookup
    protected abstract ReportGenerator getReportGenerator();

    public String send() {
        // New instance every call
        return getReportGenerator().getReportId();
    }
}
```

---

## Comparison Table

| Feature | Singleton | Prototype |
| --- | --- | --- |
| Instances | 1 per container | New one every request |
| Default? | Yes | No — must declare `@Scope("prototype")` |
| Initialization | Eager (at startup) | Lazy (on demand) |
| Destruction managed? | Yes (`@PreDestroy` works) | No — you manage cleanup |
| Thread safety | You must ensure it (no mutable state) | Each caller gets its own — inherently safe |
| Memory | Low (one object) | Higher (many objects created) |
| Use case | Stateless services | Stateful/per-request objects |

---

## Other Scopes (Web-Specific)

These exist but are less common:

| Scope | Description |
| --- | --- |
| `request` | One instance per HTTP request |
| `session` | One instance per HTTP session |
| `application` | One instance per ServletContext |
| `websocket` | One instance per WebSocket session |

```java
@Component
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestScopedBean {
    // Fresh instance for every HTTP request
}
```

---

## Quick Rule of Thumb

> **Singleton** = stateless, shared, efficient (use this 99% of the time)\
****Prototype** = stateful, per-use, isolated (use only when you need a fresh instance each time)