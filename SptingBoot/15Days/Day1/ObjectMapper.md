# ObjectMapper

## What Is It?

`ObjectMapper` is the **central class in the Jackson library** that handles all JSON ↔ Java conversion. It's not a Spring class — it's from the **Jackson** library — but Spring Boot auto-configures one and uses it everywhere.

Think of it as the engine inside `MappingJackson2HttpMessageConverter`. Every time JSON is read or written in your Spring app, `ObjectMapper` does the actual work.

## Package

```
com.fasterxml.jackson.databind.ObjectMapper
```

Part of: `jackson-databind` library (included transitively via `spring-boot-starter-web`)

## What It Does

```java
ObjectMapper mapper = new ObjectMapper();

// Java Object → JSON String (Serialization)
Employee emp = new Employee("John", "Engineering", 85000);
String json = mapper.writeValueAsString(emp);
// → {"name":"John","department":"Engineering","salary":85000}

// JSON String → Java Object (Deserialization)
String input = "{\"name\":\"Jane\",\"department\":\"HR\",\"salary\":75000}";
Employee parsed = mapper.readValue(input, Employee.class);
```

## How Spring Boot Uses It

Spring Boot auto-creates an `ObjectMapper` bean with sensible defaults:

```
spring-boot-starter-web added
        ↓
Jackson on classpath (jackson-databind)
        ↓
JacksonAutoConfiguration creates ObjectMapper bean
        ↓
MappingJackson2HttpMessageConverter uses it
        ↓
All @RestController serialization/deserialization goes through it
```

## Common Configurations

### Via application.yml (easiest)

```yaml
spring:
  jackson:
    serialization:
      write-dates-as-timestamps: false    # ISO-8601 date strings instead of numbers
      indent-output: true                  # pretty-print JSON (dev only)
    deserialization:
      fail-on-unknown-properties: false   # ignore extra JSON fields
    default-property-inclusion: non_null   # skip null fields in responses
    date-format: "yyyy-MM-dd HH:mm:ss"
```

### Via Java Configuration

```java
@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper()
            .registerModule(new JavaTimeModule())              // support LocalDate, LocalDateTime
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
            .setSerializationInclusion(JsonInclude.Include.NON_NULL);
    }
}
```

### Via Jackson2ObjectMapperBuilderCustomizer (recommended in Boot)

```java
@Bean
public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
    return builder -> builder
        .featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
        .serializationInclusion(JsonInclude.Include.NON_NULL)
        .modules(new JavaTimeModule());
}
```

## Key Jackson Annotations (Used on Your Classes)

| Annotation | What it does |
|-----------|-------------|
| `@JsonProperty("full_name")` | Maps JSON field name to Java field |
| `@JsonIgnore` | Excludes a field from JSON |
| `@JsonFormat(pattern = "yyyy-MM-dd")` | Custom date/number format |
| `@JsonInclude(NON_NULL)` | Skip null fields for this class |
| `@JsonCreator` + `@JsonProperty` | Custom deserialization constructor |
| `@JsonNaming(SnakeCaseStrategy.class)` | Auto snake_case for all fields |

## Example: Real-World DTO

```java
public class EmployeeResponseDTO {

    private Long id;

    @JsonProperty("full_name")
    private String fullName;

    private String department;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate joinDate;

    @JsonIgnore
    private String internalNotes;  // never exposed to API consumers

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String nickname;  // only included if not null
}
```

**Produces:**
```json
{
  "id": 1,
  "full_name": "John Smith",
  "department": "Engineering",
  "joinDate": "2024-03-15",
  "nickname": null          ← this field won't appear (NON_NULL)
}
```

## Common Problems & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| Dates show as `1719273600000` | Timestamps enabled (default) | `write-dates-as-timestamps: false` + register `JavaTimeModule` |
| `InvalidDefinitionException` for `LocalDate` | JavaTimeModule not registered | Add `jackson-datatype-jsr310` dependency + register module |
| Extra JSON fields cause 400 error | `FAIL_ON_UNKNOWN_PROPERTIES` is true (default) | Set to `false` in config |
| Field order random in response | Jackson doesn't guarantee order | Use `@JsonPropertyOrder({"id", "name", "email"})` |
| Circular reference (StackOverflow) | Bidirectional JPA relationships | Use `@JsonManagedReference` / `@JsonBackReference` |

## Industry Context

- The `ObjectMapper` is essentially a **global singleton** in your app — there's one instance shared everywhere
- Never create `new ObjectMapper()` inside request-handling code — it's expensive to construct. Use the Spring-managed bean
- Teams standardize their Jackson config to ensure consistent JSON format across all APIs
- When integrating with external APIs that use snake_case, configure `PropertyNamingStrategies.SNAKE_CASE` on the mapper
