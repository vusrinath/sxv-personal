# Constructor Injection vs Field Injection

Compares the two main dependency injection approaches in Spring, explaining why constructor injection is preferred for testability, immutability, and explicitness.

---

## Constructor Injection (Preferred ✅)

Dependencies are provided through the class constructor. Spring resolves and passes them when creating the bean.

```java
@Service
public class EmployeeService {

    private final EmployeeRepository repository;
    private final EmailService emailService;

    // Spring injects dependencies here
    public EmployeeService(EmployeeRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    public Employee findById(Long id) {
        return repository.findById(id).orElseThrow();
    }
}
```

> **Note:** If a class has only one constructor, `@Autowired` is optional — Spring uses it automatically.

### With Lombok (less boilerplate)

```java
@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository repository;
    private final EmailService emailService;
}
```

`@RequiredArgsConstructor` generates a constructor for all `final` fields.

---

## Field Injection (Discouraged ❌)

Dependencies are injected directly into fields using `@Autowired`. No constructor needed.

```java
@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository repository;

    @Autowired
    private EmailService emailService;
}
```

---

## Why Constructor Injection Wins

| Concern | Constructor Injection | Field Injection |
|---------|----------------------|-----------------|
| **Immutability** | Fields can be `final` — set once, never changed | Cannot be `final` — mutable state |
| **Testability** | Pass mocks directly via `new Service(mock1, mock2)` | Requires reflection or Spring context |
| **Explicit deps** | All dependencies visible in constructor signature | Hidden inside the class body |
| **Fail-fast** | App fails at startup if dependency is missing | May fail later at runtime |
| **Framework coupling** | Class is a plain POJO — works without Spring | `@Autowired` ties you to Spring |

---

## Testability Example

### With Constructor Injection — simple and clean

```java
@Test
void shouldFindEmployee() {
    EmployeeRepository mockRepo = mock(EmployeeRepository.class);
    EmailService mockEmail = mock(EmailService.class);
    when(mockRepo.findById(1L)).thenReturn(Optional.of(new Employee("John")));

    // No Spring context needed — just pass mocks
    EmployeeService service = new EmployeeService(mockRepo, mockEmail);

    Employee result = service.findById(1L);
    assertEquals("John", result.getFirstName());
}
```

### With Field Injection — requires extra setup

```java
@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @InjectMocks
    private EmployeeService service;

    @Mock
    private EmployeeRepository repository;

    @Mock
    private EmailService emailService;

    @Test
    void shouldFindEmployee() {
        when(repository.findById(1L)).thenReturn(Optional.of(new Employee("John")));
        Employee result = service.findById(1L);
        assertEquals("John", result.getFirstName());
    }
}
```

You're forced to use Mockito's reflection-based `@InjectMocks` — harder to debug when things go wrong.

---

## When Field Injection Is Acceptable

- **Test classes** (`@SpringBootTest`) — tests aren't production beans
- **Quick prototypes** or demos where testability doesn't matter

---

## The Industry Rule

> Enterprise teams enforce constructor injection via checkstyle/linting rules.  
> If `@Autowired` appears on a field in a PR, it gets flagged.  
> Spring's official documentation itself recommends constructor injection.
