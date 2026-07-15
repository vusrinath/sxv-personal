# REST Annotations — Interview Answers

---

## Q: What is @Controller and when do you use it?

`@Controller` is a Spring MVC stereotype annotation that marks a class as a web layer component. It tells Spring that this class handles HTTP requests and its methods return **view names** — which are resolved to HTML templates (like Thymeleaf or JSP).

```java
@Controller
public class HomeController {

    @GetMapping("/home")
    public String home(Model model) {
        model.addAttribute("username", "John");
        return "home"; // resolves to /templates/home.html
    }
}
```

The return value `"home"` is a view name, not data. Spring's `ViewResolver` maps it to an actual template file.

**Use it when:** You're building a server-side rendered web application that returns HTML pages.

---

## Q: What is @RestController and how is it different from @Controller?

`@RestController` is a convenience annotation that combines `@Controller` and `@ResponseBody`. It marks a class as a REST API controller where every method's return value is written **directly to the HTTP response body** as JSON (or XML), instead of being resolved as a view name.

```java
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @GetMapping("/{id}")
    public EmployeeResponseDTO getById(@PathVariable Long id) {
        return employeeService.findById(id); // serialized to JSON automatically
    }
}
```

**The key difference:**

|  | @Controller | @RestController |
| --- | --- | --- |
| Returns | View name (String) → HTML page | Java object → JSON/XML response body |
| Needs @ResponseBody? | Yes, on each method | No — it's built-in |
| Use case | Server-side rendered UI (Thymeleaf) | REST APIs consumed by frontend/mobile |

**Use it when:** You're building a REST API that returns JSON — which is 99% of modern Spring Boot apps.

> Internally, `@RestController` = `@Controller` + `@ResponseBody`. Spring processes them identically — it's just a shortcut.

---

## Q: What is @RequestMapping?

`@RequestMapping` is the base annotation for mapping HTTP requests to controller methods. It can be applied at the **class level** (to define a base URL) and at the **method level** (to define specific endpoints).

```java
@RestController
@RequestMapping("/api/employees") // base path for all methods in this class
public class EmployeeController {

    @RequestMapping(method = RequestMethod.GET) // GET /api/employees
    public List<EmployeeDTO> getAll() {
        return employeeService.getAll();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET) // GET /api/employees/{id}
    public EmployeeDTO getById(@PathVariable Long id) {
        return employeeService.findById(id);
    }

    @RequestMapping(value = "", method = RequestMethod.POST) // POST /api/employees
    public ResponseEntity<EmployeeDTO> create(@RequestBody EmployeeRequestDTO request) {
        return ResponseEntity.status(201).body(employeeService.create(request));
    }
}
```

`@RequestMapping` **supports**:

- `value` / `path` — the URL pattern
- `method` — HTTP method (GET, POST, PUT, DELETE, PATCH)
- `consumes` — expected request Content-Type (e.g., `application/json`)
- `produces` — response Content-Type (e.g., `application/json`)
- `params` — required query parameters
- `headers` — required headers

**In practice:** You rarely use `@RequestMapping` on methods directly anymore. The shortcut annotations (`@GetMapping`, `@PostMapping`, etc.) are cleaner and more readable.

---

## Q: What is @GetMapping?

`@GetMapping` is a shortcut for `@RequestMapping(method = RequestMethod.GET)`. It maps HTTP GET requests to a handler method.

```java
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    // GET /api/employees
    @GetMapping
    public List<EmployeeDTO> getAll() {
        return employeeService.getAll();
    }

    // GET /api/employees/42
    @GetMapping("/{id}")
    public EmployeeDTO getById(@PathVariable Long id) {
        return employeeService.findById(id);
    }

    // GET /api/employees?department=engineering&page=0&size=10
    @GetMapping("/search")
    public Page<EmployeeDTO> search(
            @RequestParam String department,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return employeeService.findByDepartment(department, page, size);
    }
}
```

**Use it for:** Fetching/reading data. GET requests are safe (no side effects) and idempotent (same result every time).

---

## Q: What is @PostMapping?

`@PostMapping` is a shortcut for `@RequestMapping(method = RequestMethod.POST)`. It maps HTTP POST requests to a handler method.

```java
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    // POST /api/employees
    @PostMapping
    public ResponseEntity<EmployeeDTO> create(@RequestBody @Valid EmployeeRequestDTO request) {
        EmployeeDTO created = employeeService.create(request);
        URI location = URI.create("/api/employees/" + created.getId());
        return ResponseEntity.created(location).body(created); // 201 Created
    }
}
```

**Use it for:** Creating a new resource. POST is **not idempotent** — calling it twice creates two records.

---

## Q: What are the other shortcut mapping annotations?

Spring provides a shortcut annotation for every HTTP method:

| Annotation | HTTP Method | Typical Use |
| --- | --- | --- |
| `@GetMapping` | GET | Fetch a resource |
| `@PostMapping` | POST | Create a resource |
| `@PutMapping` | PUT | Replace a resource entirely |
| `@PatchMapping` | PATCH | Partially update a resource |
| `@DeleteMapping` | DELETE | Delete a resource |

```java
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @GetMapping("/{id}")
    public EmployeeDTO get(@PathVariable Long id) { ... }

    @PostMapping
    public ResponseEntity<EmployeeDTO> create(@RequestBody @Valid EmployeeRequestDTO req) { ... }

    @PutMapping("/{id}")
    public EmployeeDTO replace(@PathVariable Long id, @RequestBody @Valid EmployeeRequestDTO req) { ... }

    @PatchMapping("/{id}")
    public EmployeeDTO update(@PathVariable Long id, @RequestBody Map<String, Object> fields) { ... }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) { ... }
}
```

---

## Q: How does @RequestMapping at class level combine with method level?

The class-level `@RequestMapping` defines a **base path**. Method-level mappings are appended to it.

```java
@RestController
@RequestMapping("/api/v1/employees") // base
public class EmployeeController {

    @GetMapping("/{id}")         // → GET  /api/v1/employees/{id}
    @PostMapping                 // → POST /api/v1/employees
    @DeleteMapping("/{id}")      // → DELETE /api/v1/employees/{id}
}
```

This is how you implement **API versioning** via URI — change the base path to `/api/v2/employees` for a new version.

---

## Quick Summary

| Annotation | What It Does |
| --- | --- |
| `@Controller` | Marks class as MVC controller — returns view names (HTML) |
| `@RestController` | `@Controller` + `@ResponseBody` — returns JSON/XML directly |
| `@RequestMapping` | Base annotation — maps URL + HTTP method to a handler |
| `@GetMapping` | Shortcut for GET requests — fetch data |
| `@PostMapping` | Shortcut for POST requests — create data |
| `@PutMapping` | Shortcut for PUT requests — replace data |
| `@PatchMapping` | Shortcut for PATCH requests — partial update |
| `@DeleteMapping` | Shortcut for DELETE requests — remove data |
