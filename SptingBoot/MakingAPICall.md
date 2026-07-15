# Making API Calls in Java

This note covers the packages and classes needed to make HTTP API calls from a Java application, including the standard HttpClient API and Spring-specific utilities.

## Required Packages

```
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
```

## Key Classes

| Class | Purpose |
|-------|---------|
| **HttpClient** | Sends HTTP requests and receives responses |
| **HttpRequest** | Represents an HTTP request (method, URI, headers, body) |
| **HttpResponse** | Represents the HTTP response received from the server |
| **HttpMessageConverter** | Converts between HTTP bodies and Java objects |
| **OAuth2RestTemplate** | Spring template for OAuth2-protected API calls |
| **MappingJackson2HttpMessageConverter** | JSON serialization/deserialization via Jackson |
| **ObjectMapper** | Jackson class for reading/writing JSON |
