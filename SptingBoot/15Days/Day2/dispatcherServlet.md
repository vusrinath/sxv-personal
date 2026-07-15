# DispatcherServlet — The Front Controller of Spring MVC

---

## What is DispatcherServlet?

DispatcherServlet is the **single entry point** for all HTTP requests in a Spring MVC/Spring Boot application. It acts as a **Front Controller** — it receives every incoming request and delegates it to the appropriate handler (controller).

```
Client Request → Tomcat → DispatcherServlet → Controller → Service → Response
```

> Think of it as a **receptionist** in an office — every visitor (request) goes through the receptionist, who directs them to the right person (controller).

---

## How It Works — Request Lifecycle

```
┌──────────┐     ┌───────────────────┐     ┌────────────────┐     ┌────────────┐
│  Client  │────▶│ DispatcherServlet │────▶│ HandlerMapping │────▶│ Controller │
└──────────┘     └───────────────────┘     └────────────────┘     └────────────┘
                          │                                              │
                          │                                              ▼
                          │                                     ┌──────────────┐
                          │                                     │   Service    │
                          │                                     └──────────────┘
                          │                                              │
                          ▼                                              ▼
                 ┌──────────────────┐                           ┌──────────────┐
                 │ ViewResolver /   │◀──────────────────────────│   Response   │
                 │ MessageConverter │                            └──────────────┘
                 └──────────────────┘
                          │
                          ▼
                 ┌──────────────┐
                 │   Client     │
                 └──────────────┘
```

### Step-by-Step Flow

| Step | Component | What Happens |
|------|-----------|--------------|
| 1 | **DispatcherServlet** | Receives the HTTP request from Tomcat |
| 2 | **HandlerMapping** | Finds which controller method handles this URL + HTTP method |
| 3 | **HandlerAdapter** | Invokes the controller method with proper arguments |
| 4 | **Controller** | Executes business logic (via Service layer), returns response |
| 5 | **MessageConverter** | Converts Java object → JSON (for REST APIs via Jackson) |
| 6 | **DispatcherServlet** | Sends the final HTTP response back to the client |

---

## Where Does It Come From?

In Spring Boot, you **don't configure it manually**. It's auto-configured by `DispatcherServletAutoConfiguration`.

```
spring-boot-starter-web
    └── Embedded Tomcat
    └── DispatcherServlet (auto-registered at "/")
```

You can verify it in logs at startup:

```
Mapping servlets: dispatcherServlet urls=[/]
```

This means **every request** to your app (anything under `/`) goes through DispatcherServlet.

---

## Key Components Inside DispatcherServlet

### 1. HandlerMapping

Maps a URL to a controller method.

```java
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @GetMapping("/{id}")  // HandlerMapping maps GET /api/employees/5 → this method
    public Employee getById(@PathVariable Long id) {
        return service.findById(id);
    }
}
```

Spring uses `RequestMappingHandlerMapping` to scan all `@RequestMapping` annotations and build a URL → method map at startup.

### 2. HandlerAdapter

Knows **how to invoke** the handler. It handles:
- Resolving `@PathVariable`, `@RequestParam`, `@RequestBody`
- Calling the method with correct arguments
- Processing the return value

### 3. HttpMessageConverter

Converts between Java objects and HTTP body content.

```
Request:  JSON body → Jackson → Java Object (@RequestBody)
Response: Java Object → Jackson → JSON body (@ResponseBody)
```

`MappingJackson2HttpMessageConverter` is auto-configured when Jackson is on the classpath.

### 4. HandlerExceptionResolver

When a controller throws an exception, DispatcherServlet delegates to exception resolvers:

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmployeeNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(EmployeeNotFoundException ex) {
        return ResponseEntity.status(404).body(new ErrorResponse(ex.getMessage()));
    }
}
```

DispatcherServlet catches the exception and routes it to your `@ExceptionHandler`.

### 5. ViewResolver (for MVC/Thymeleaf apps)

For traditional web apps (not REST APIs), it resolves view names to actual templates:

```
return "home" → ViewResolver → /templates/home.html
```

For `@RestController`, this is skipped — response goes directly through MessageConverter.

---

## DispatcherServlet vs Traditional Servlets

### Without DispatcherServlet (old way)

```xml
<!-- web.xml — one servlet per URL pattern -->
<servlet>
    <servlet-name>employeeServlet</servlet-name>
    <servlet-class>com.app.EmployeeServlet</servlet-class>
</servlet>
<servlet-mapping>
    <url-pattern>/employees/*</url-pattern>
</servlet-mapping>

<servlet>
    <servlet-name>departmentServlet</servlet-name>
    <servlet-class>com.app.DepartmentServlet</servlet-class>
</servlet>
<servlet-mapping>
    <url-pattern>/departments/*</url-pattern>
</servlet-mapping>
```

### With DispatcherServlet (Spring way)

```java
// ONE entry point handles everything
@RestController
@RequestMapping("/api/employees")
public class EmployeeController { ... }

@RestController
@RequestMapping("/api/departments")
public class DepartmentController { ... }
```

| Aspect | Traditional Servlets | DispatcherServlet |
|--------|---------------------|-------------------|
| Entry points | Multiple servlets, each mapped separately | Single servlet handles all |
| Configuration | XML-heavy `web.xml` | Annotation-based, auto-configured |
| Flexibility | Hard to add cross-cutting concerns | Interceptors, filters, exception handlers built-in |
| Testability | Difficult to unit test | MockMvc makes testing easy |

---

## Interceptors — Hooks Into the Flow

DispatcherServlet supports **HandlerInterceptors** that run before/after controller execution.

```java
@Component
public class LoggingInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        System.out.println("Request: " + request.getMethod() + " " + request.getRequestURI());
        return true; // continue processing
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView mv) {
        System.out.println("Response status: " + response.getStatus());
    }
}
```

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoggingInterceptor());
    }
}
```

### Execution Order

```
Filter → DispatcherServlet → Interceptor.preHandle → Controller → Interceptor.postHandle → Response
```

---

## Filters vs Interceptors

| Feature | Filter | Interceptor |
|---------|--------|-------------|
| Level | Servlet container (Tomcat) | Spring MVC (DispatcherServlet) |
| Access to Spring beans | No (unless registered as Spring bean) | Yes |
| Runs for | All requests (static files too) | Only requests handled by DispatcherServlet |
| Use case | Authentication, CORS, logging | Request timing, audit, authorization |

---

## Customizing DispatcherServlet

You rarely need to, but you can:

```yaml
# application.yml
spring:
  mvc:
    servlet:
      path: /api  # Change base path from "/" to "/api"
```

Now DispatcherServlet only handles requests under `/api/*`.

---

## Summary

> DispatcherServlet is the **heart of Spring MVC**. It receives all requests, coordinates with HandlerMapping to find the right controller, uses HandlerAdapter to invoke it, converts the response via MessageConverters, and handles exceptions globally — all without you writing a single line of servlet configuration.

```
Request → Filter → DispatcherServlet → HandlerMapping → HandlerAdapter → Controller
                                                                              ↓
Response ← Filter ← DispatcherServlet ← MessageConverter ← Controller Return Value
```
