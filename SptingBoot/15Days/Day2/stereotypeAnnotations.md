# Stereotype Annotations in Spring

Stereotype annotations are special markers that tell Spring: "Hey, this class is a Spring-managed bean — create an instance of it, put it in the container, and make it available for injection."

They're called "stereotype" because they categorize classes by their **role** in the architecture — just like stereotypes categorize people by role (doctor, teacher, etc.).

---

## The Family Tree

All stereotype annotations are specializations of `@Component`:

```
@Component  (the parent — generic bean)
    ├── @Service        (business logic layer)
    ├── @Repository     (data access layer)
    ├── @Controller     (web/MVC layer — returns views)
    └── @RestController (web/API layer — returns JSON)
```

They all do the **same core thing**: register the class as a bean in Spring's ApplicationContext. The differences are about **semantics** and **extra behavior**.

---

## Each Annotation Explained

### @Component — The Generic One

```java
@Component
public class EmailValidator {
    public boolean isValid(String email) {
        return email != null && email.contains("@");
    }
}
```

Use when your class doesn't fit neatly into service/repository/controller. Examples: utility classes, converters, custom event listeners.

---

### @Service — Business Logic

```java
@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final PaymentGateway paymentGateway;

    public OrderService(OrderRepository orderRepository, PaymentGateway paymentGateway) {
        this.orderRepository = orderRepository;
        this.paymentGateway = paymentGateway;
    }

    public Order placeOrder(OrderRequest request) {
        // validation, business rules, orchestration
        Order order = new Order(request.getItems());
        paymentGateway.charge(request.getPaymentMethod(), order.getTotal());
        return orderRepository.save(order);
    }
}
```

**What makes it different from @Component?**
- Purely semantic — it tells developers "business logic lives here"
- No extra technical behavior (unlike @Repository)
- Makes your codebase self-documenting

---

### @Repository — Data Access

```java
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByDepartment(String department);
}
```

Or in a non-JPA scenario:

```java
@Repository
public class EmployeeDao {
    private final JdbcTemplate jdbcTemplate;

    public EmployeeDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Employee findById(Long id) {
        return jdbcTemplate.queryForObject(
            "SELECT * FROM employees WHERE id = ?", 
            new EmployeeRowMapper(), id
        );
    }
}
```

**What makes it different from @Component?**
- **Exception translation** — Spring automatically converts database-specific exceptions (like `SQLException`, Hibernate's `PersistenceException`) into Spring's unified `DataAccessException` hierarchy
- This means your service layer never deals with vendor-specific DB errors

```
Without @Repository:  → java.sql.SQLException: Duplicate entry 'john@email.com'
With @Repository:     → org.springframework.dao.DuplicateKeyException
```

---

### @Controller — Web Layer (returns views/HTML)

```java
@Controller
public class HomeController {
    @GetMapping("/home")
    public String homePage(Model model) {
        model.addAttribute("message", "Welcome!");
        return "home";  // returns the VIEW name (home.html template)
    }
}
```

Used with template engines like Thymeleaf. The return value is a **view name**, not data.

---

### @RestController — API Layer (returns JSON/XML)

```java
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public List<EmployeeDTO> getAll() {
        return employeeService.getAllEmployees(); // returned as JSON automatically
    }
}
```

**What makes it different from @Controller?**
- `@RestController` = `@Controller` + `@ResponseBody`
- Every method's return value is serialized directly to the HTTP response body (usually JSON)
- No view resolution happens

---

## How Spring Discovers Them — Component Scanning

When your app starts, Spring scans packages starting from the `@SpringBootApplication` class's package downward:

```
com.myapp/
├── MyApplication.java          ← @SpringBootApplication (scan starts here)
├── controller/
│   └── EmployeeController.java ← ✅ found by scanning
├── service/
│   └── EmployeeService.java    ← ✅ found by scanning
├── repository/
│   └── EmployeeRepository.java ← ✅ found by scanning
└── util/
    └── EmailValidator.java     ← ✅ found by scanning
```

If a class is **outside** this package tree, Spring won't find it unless you explicitly add `@ComponentScan("com.otherpackage")`.

---

## Why Not Just Use @Component for Everything?

Technically you could. The app would still work. But:

| Reason | Explanation |
|--------|-------------|
| **Readability** | A new developer instantly knows what layer a class belongs to |
| **Extra behavior** | @Repository adds exception translation; @Controller enables view resolution |
| **AOP targeting** | You can write aspects that apply only to `@Service` or `@Repository` classes |
| **Framework features** | @WebMvcTest only loads `@Controller` beans — not `@Service` or `@Repository` |
| **Team conventions** | Code reviews flag a DAO class that uses `@Service` instead of `@Repository` |

---

## Quick Mental Model

```
HTTP Request
    ↓
@RestController / @Controller  →  "I handle web requests"
    ↓
@Service                       →  "I contain business rules"
    ↓
@Repository                    →  "I talk to the database"
    ↓
Database
```

Each annotation is a signal about **responsibility**. Spring uses these signals for wiring, and your team uses them for understanding the code at a glance.

---

## Common Mistakes

1. **Putting business logic in @Controller** — Controllers should be thin; delegate to @Service
2. **Using @Component when @Service/@Repository fits** — You lose semantic clarity and framework benefits
3. **Forgetting that @Repository gives you exception translation** — This matters when switching databases
4. **Placing classes outside the component scan path** — Spring silently ignores them, and you get `NoSuchBeanDefinitionException`
