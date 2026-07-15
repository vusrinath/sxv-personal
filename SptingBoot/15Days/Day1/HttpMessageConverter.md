# HttpMessageConverter

## What Is It?

`HttpMessageConverter` is a Spring interface that handles the **conversion between HTTP request/response bodies and Java objects**. It's the bridge between raw HTTP data (JSON, XML, plain text) and your Java classes.

When you send JSON to a `@RequestBody` parameter or return an object from a `@RestController`, an `HttpMessageConverter` does the heavy lifting behind the scenes.

## Package

```
org.springframework.http.converter.HttpMessageConverter
```

Part of: `spring-web` module

## How It Works

```
HTTP Request (JSON body)  →  HttpMessageConverter  →  Java Object (your DTO)
Java Object (your DTO)    →  HttpMessageConverter  →  HTTP Response (JSON body)
```

### The Interface

```java
public interface HttpMessageConverter<T> {

    // Can this converter read the given class from the given media type?
    boolean canRead(Class<?> clazz, MediaType mediaType);

    // Can this converter write the given class to the given media type?
    boolean canWrite(Class<?> clazz, MediaType mediaType);

    // What media types does this converter support?
    List<MediaType> getSupportedMediaTypes();

    // Read an object from the HTTP input message
    T read(Class<? extends T> clazz, HttpInputMessage inputMessage);

    // Write an object to the HTTP output message
    void write(T t, MediaType contentType, HttpOutputMessage outputMessage);
}
```

## Built-in Implementations

| Converter | Handles |
|-----------|---------|
| `MappingJackson2HttpMessageConverter` | JSON ↔ Java (using Jackson) |
| `StringHttpMessageConverter` | Plain text ↔ String |
| `ByteArrayHttpMessageConverter` | Binary data ↔ byte[] |
| `FormHttpMessageConverter` | Form data ↔ MultiValueMap |
| `Jaxb2RootElementHttpMessageConverter` | XML ↔ Java (using JAXB) |

## When Does It Kick In?

```java
@RestController
public class EmployeeController {

    @PostMapping("/api/employees")
    public Employee create(@RequestBody Employee employee) {
        // @RequestBody → converter READS JSON into Employee object
        return employeeService.save(employee);
        // Return value → converter WRITES Employee object into JSON response
    }
}
```

Spring automatically picks the right converter based on:
1. The `Content-Type` header (for reading requests)
2. The `Accept` header (for writing responses)

## Why It Matters

- You **never manually parse JSON** in Spring — converters handle it
- You can register **custom converters** for proprietary formats (CSV, Protobuf, etc.)
- Understanding this explains why adding Jackson to your classpath magically enables JSON support

## Industry Context

Most teams never implement a custom converter — Jackson's default one handles 95% of cases. But knowing this exists helps debug serialization issues (e.g., "why is my date format wrong?" → configure the converter/ObjectMapper).
