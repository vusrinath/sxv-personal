# CommandLineRunner — Run Code at Application Startup

CommandLineRunner is a Spring Boot interface that lets you execute code once the application context is fully initialized and all beans are ready.

---

## What is CommandLineRunner?

`CommandLineRunner` is a functional interface in Spring Boot that lets you **execute code immediately after the application starts**. It runs once the Spring <mark data-color="#ffd700aa" style="background-color: rgba(255, 215, 0, 0.667); color: inherit;">context </mark>is fully initialized and all beans are ready.

```java
@FunctionalInterface
public interface CommandLineRunner {
    void run(String... args) throws Exception;
}
```

> Think of it as a **"do this when the app is ready"** hook.

---

## Basic Usage

### As a @Component

```java
@Component
public class StartupRunner implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Application started successfully!");
        System.out.println("Arguments: " + Arrays.toString(args));
    }
}
```

### As a @Bean in Main Class

```java
@SpringBootApplication
public class MyApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }

    @Bean
    public CommandLineRunner demo() {
        return args -> {
            System.out.println("App is running!");
        };
    }
}
```

### As a Lambda with Dependency Injection

```java
@SpringBootApplication
public class MyApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadData(EmployeeRepository repository) {
        return args -> {
            repository.save(new Employee("John", "Doe", "john@example.com"));
            repository.save(new Employee("Jane", "Smith", "jane@example.com"));
            System.out.println("Sample data loaded!");
        };
    }
}
```

---

## When Does It Run?

```
JVM starts
    → Spring context initializes
        → All beans created & injected
            → CommandLineRunner.run() executes  ← HERE
                → Application is ready to serve requests
```

It runs **after** all beans are initialized but **before** the application starts accepting HTTP requests (in practice, nearly simultaneously).

---

## Common Use Cases

| Use Case | Example |
| --- | --- |
| **Seed database** | Insert default/test data on startup |
| **Verify connectivity** | Check DB connection, external API health |
| **Cache warming** | Pre-load frequently accessed data |
| **Log configuration** | Print active profile, app version, environment info |
| **Run migrations** | Execute custom data transformations |
| **CLI applications** | Build command-line tools with Spring Boot |

---

## Real-World Examples

### 1. Seed Database with Sample Data

```java
@Component
@RequiredArgsConstructor
@Profile("dev") // Only runs in dev profile
public class DataSeeder implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public void run(String... args) throws Exception {
        Department engineering = departmentRepository.save(new Department("Engineering"));
        Department hr = departmentRepository.save(new Department("HR"));

        employeeRepository.save(new Employee("Alice", "Dev", engineering, 95000));
        employeeRepository.save(new Employee("Bob", "Manager", hr, 85000));

        System.out.println("✅ Dev data seeded: " + employeeRepository.count() + " employees");
    }
}
```

### 2. Print Application Info at Startup

```java
@Component
@RequiredArgsConstructor
public class StartupInfoPrinter implements CommandLineRunner {

    private final Environment environment;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=================================");
        System.out.println("Active Profiles: " + Arrays.toString(environment.getActiveProfiles()));
        System.out.println("Server Port: " + environment.getProperty("server.port", "8080"));
        System.out.println("DB URL: " + environment.getProperty("spring.datasource.url"));
        System.out.println("=================================");
    }
}
```

### 3. Verify External Service Connectivity

```java
@Component
@RequiredArgsConstructor
@Slf4j
public class HealthCheckRunner implements CommandLineRunner {

    private final RestTemplate restTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            restTemplate.getForEntity("http://external-service/health", String.class);
            log.info("✅ External service is reachable");
        } catch (Exception e) {
            log.warn("⚠️ External service is NOT reachable: {}", e.getMessage());
        }
    }
}
```

### 4. Build a CLI Application

```java
@SpringBootApplication
public class CsvImporterApp {

    public static void main(String[] args) {
        SpringApplication.run(CsvImporterApp.class, args);
    }

    @Bean
    public CommandLineRunner importCsv(CsvService csvService) {
        return args -> {
            if (args.length == 0) {
                System.out.println("Usage: java -jar app.jar <file.csv>");
                return;
            }
            csvService.importFile(args[0]);
            System.out.println("Import complete!");
        };
    }
}
```

Run: `java -jar app.jar employees.csv` → `args[0]` = "employees.csv"

---

## Multiple CommandLineRunners — Ordering

You can have multiple runners. Use `@Order` to control execution sequence.

```java
@Component
@Order(1)
public class DatabaseMigrationRunner implements CommandLineRunner {
    @Override
    public void run(String... args) {
        System.out.println("Step 1: Running DB migrations...");
    }
}

@Component
@Order(2)
public class CacheWarmupRunner implements CommandLineRunner {
    @Override
    public void run(String... args) {
        System.out.println("Step 2: Warming up cache...");
    }
}

@Component
@Order(3)
public class NotificationRunner implements CommandLineRunner {
    @Override
    public void run(String... args) {
        System.out.println("Step 3: Sending startup notification...");
    }
}
```

Output:

```
Step 1: Running DB migrations...
Step 2: Warming up cache...
Step 3: Sending startup notification...
```

Lower `@Order` value = runs first.

---

## CommandLineRunner vs ApplicationRunner

Both do the same thing — the difference is how they receive arguments.

| Feature | CommandLineRunner | ApplicationRunner |
| --- | --- | --- |
| Argument type | `String... args` (raw) | `ApplicationArguments` (parsed) |
| Access to raw args | `args[0]`, `args[1]` | `appArgs.getSourceArgs()` |
| Access to option args | Manual parsing | `appArgs.getOptionValues("name")` |

### CommandLineRunner

```java
// java -jar app.jar --server.port=9090 hello
@Override
public void run(String... args) {
    // args = ["--server.port=9090", "hello"]
    System.out.println(Arrays.toString(args));
}
```

### ApplicationRunner

```java
// java -jar app.jar --server.port=9090 hello
@Override
public void run(ApplicationArguments args) {
    // Parsed option arguments
    args.getOptionValues("server.port"); // ["9090"]

    // Non-option arguments
    args.getNonOptionArgs(); // ["hello"]
}
```

> Use `ApplicationRunner` when you need to parse `--key=value` style arguments. Use `CommandLineRunner` for simple cases.

---

## Error Handling

If a `CommandLineRunner` throws an exception, **the application will fail to start**.

```java
@Component
public class CriticalCheckRunner implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        if (!isDatabaseReachable()) {
            throw new RuntimeException("Database is not reachable!"); // App won't start
        }
    }
}
```

If you want the app to start regardless, catch the exception:

```java
@Override
public void run(String... args) {
    try {
        riskyOperation();
    } catch (Exception e) {
        log.warn("Non-critical startup task failed: {}", e.getMessage());
    }
}
```

---

## Summary

> `CommandLineRunner` is a simple hook to **run code once after Spring Boot starts**. Use it for seeding data, health checks, logging config, or building CLI tools. It has access to all Spring beans and receives command-line arguments as raw strings.

```
App starts → Beans ready → CommandLineRunner.run(args) → App serving requests
```