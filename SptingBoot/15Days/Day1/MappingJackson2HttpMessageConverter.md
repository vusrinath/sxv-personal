# MappingJackson2HttpMessageConverter

## What Is It?

`MappingJackson2HttpMessageConverter` is the **default JSON converter** in Spring Boot. It's the specific `HttpMessageConverter` implementation that converts Java objects ↔ JSON using the **Jackson** library.

When you return an object from a `@RestController` and the client gets JSON back — this is the class doing that work.

## Package

```
org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
```

Part of: `spring-web` module (auto-configured when Jackson is on classpath)

## How It Fits In

```
@RestController method returns Employee object
        ↓
Spring checks: "What converter handles application/json?"
        ↓
MappingJackson2HttpMessageConverter says "I can!"
        ↓
Uses ObjectMapper internally to serialize Employee → JSON string
        ↓
JSON written to HTTP response body
```

## Auto-Configuration

When `spring-boot-starter-web` is in your dependencies, Spring Boot automatically:
1. Adds Jackson (`jackson-databind`) to the classpath
2. Creates an `ObjectMapper` bean
3. Registers `MappingJackson2HttpMessageConverter` with that ObjectMapper
4. You write zero configuration — JSON just works

## When You'd Touch It Directly

### Custom ObjectMapper Configuration

```java
@Configuration
public class JacksonConfig {

    @Bean
    public MappingJackson2HttpMessageConverter jsonConverter() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);  // skip null fields
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd"));

        return new MappingJackson2HttpMessageConverter(mapper);
    }
}
```

### Adding It to RestTemplate

```java
@Bean
public RestTemplate restTemplate() {
    RestTemplate template = new RestTemplate();

    // Replace default converter with custom one
    MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
    converter.setObjectMapper(customObjectMapper());

    template.getMessageConverters().add(0, converter);
    return template;
}
```

## Key Properties

| Property | What it controls |
|----------|-----------------|
| `objectMapper` | The Jackson ObjectMapper instance used for conversion |
| `supportedMediaTypes` | Default: `application/json`, `application/*+json` |
| `defaultCharset` | Default: UTF-8 |

## Common Scenarios

**Problem:** "My dates are serialized as timestamps (numbers) instead of strings"
**Fix:** Configure the ObjectMapper inside this converter

**Problem:** "Unknown JSON fields cause 400 errors"
**Fix:** Set `FAIL_ON_UNKNOWN_PROPERTIES = false` on the ObjectMapper

**Problem:** "I need to support both JSON and XML"
**Fix:** Add `jackson-dataformat-xml` → Spring auto-registers `MappingJackson2XmlHttpMessageConverter` alongside the JSON one

## Industry Context

- You rarely instantiate this class manually — Spring Boot's auto-config handles it
- When you customize JSON behavior, you typically configure the `ObjectMapper` bean (Spring picks it up automatically)
- Understanding this class helps debug "why is my JSON response formatted weirdly?" issues
