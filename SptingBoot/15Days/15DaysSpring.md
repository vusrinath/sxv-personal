# 15-Day Spring Boot Mastery Plan

> **Prerequisites:** You know at least one programming language, basic OOP, and have Java syntax familiarity.\
> \*\***Time commitment:** 2 hours/day\
> \*\***Goal:** Build a production-style REST API from scratch with industry best practices.\
> \*\***Final project:** Employee Management System (built incrementally across all 15 days)

---

## Phase 1: Foundation & Setup (Days 1–3)

### Day 1 — Spring Ecosystem & Project Setup

**Concepts (45 min):**

- What is Spring vs Spring Boot — why Boot exists
- IoC (Inversion of Control) & DI (Dependency Injection) — the core philosophy
- How Spring manages object lifecycle (ApplicationContext, Beans)
- Spring Initializr — generating a project

**Hands-on (75 min):**

- Generate a project at [start.spring.io](https://start.spring.io) with: Spring Web, Spring Data JPA, H2 Database, Validation, Lombok
- Import into your IDE, explore the folder structure
- Run the app, verify Tomcat starts on port 8080
- Read the auto-generated `pom.xml` / `build.gradle` — understand what each starter brings

**Industry context:** Every company uses Spring Initializr or internal templates. Understanding the POM is critical for debugging dependency conflicts.

---

### Day 2 — Dependency Injection in Practice

**Concepts (40 min):**

- @Component, @Service, @Repository, @Controller — stereotype annotations
- Component scanning — how Spring finds your classes
- Constructor injection (preferred) vs field injection (discouraged in production)
- Bean scopes: singleton (default) vs prototype

**Hands-on (80 min):**

- Create a `GreetingService` with a method that returns "Hello, Spring!"
- Inject it into a `CommandLineRunner` bean to print at startup
- Create a second implementation, use `@Primary` or `@Qualifier` to resolve ambiguity
- Experiment: remove `@Service`, see the `NoSuchBeanDefinitionException` — understand what goes wrong

**Industry context:** Constructor injection is the standard in enterprise codebases. Teams enforce this via code reviews and linting rules.

---

### Day 3 — Configuration & Profiles

**Concepts (30 min):**

- `application.properties` vs `application.yml`
- @Value, @ConfigurationProperties
- Profiles: dev, test, prod — `application-dev.yml`
- @Configuration + @Bean — manual bean registration

**Hands-on (90 min):**

- Configure app name, server port, custom property in `application.yml`
- Create a `@ConfigurationProperties` class to bind a group of properties
- Set up `application-dev.yml` and `application-prod.yml` with different DB configs
- Run with `--spring.profiles.active=dev` and verify profile-specific config loads
- Create a `@Configuration` class with a `@Bean` method that returns a configured object

**Industry context:** Every production app uses profiles. Configuration externalization is key to 12-factor app methodology.

---

## Phase 2: REST API Development (Days 4–8)

### Day 4 — Your First REST Endpoints

**Concepts (30 min):**

- HTTP methods: GET, POST, PUT, DELETE, PATCH
- @**RestController** vs @**Controller**
- @RequestMapping, @GetMapping, @PostMapping
- JSON serialization with Jackson (happens automatically)

**Hands-on (90 min):**

- Create `EmployeeController` with `@RestController`
- Build GET `/api/employees` — return a hardcoded list
- Build GET `/api/employees/{id}` — use `@PathVariable`
- Build GET `/api/employees?department=engineering` — use `@RequestParam`
- Test all endpoints with Postman or curl

**Industry context:** RESTful URL design and proper HTTP method usage are table-stakes in any backend interview or code review.

---

### Day 5 — Full CRUD & Request/Response Handling

**Concepts (30 min):**

- @RequestBody — deserializing JSON input
- @PostMapping, @PutMapping, @DeleteMapping
- ResponseEntity — controlling HTTP status codes and headers
- HTTP status codes: 200, 201, 204, 400, 404, 409, 500

**Hands-on (90 min):**

- Add POST `/api/employees` — accept JSON, return 201 Created with Location header
- Add PUT `/api/employees/{id}` — update and return 200
- Add DELETE `/api/employees/{id}` — return 204 No Content
- Use `ResponseEntity.created()`, `ResponseEntity.ok()`, `ResponseEntity.noContent()`
- Store data in an in-memory `ArrayList` for now (DB comes later)

**Industry context:** Proper status codes and headers are not optional. API consumers (frontend, mobile, other services) depend on them.

---

### Day 6 — Service Layer & DTO Pattern

**Concepts (30 min):**

- Why separate Controller → Service → Repository
- DTO (Data Transfer Object) — never expose your entity directly
- Request DTO vs Response DTO
- Manual mapping vs MapStruct/ModelMapper

**Hands-on (90 min):**

- Create `EmployeeService` — move all logic out of the controller
- Create `EmployeeRequestDTO` (what client sends) and `EmployeeResponseDTO` (what client receives)
- Write a manual mapper class: `EmployeeMapper.toEntity()`, `EmployeeMapper.toDTO()`
- Refactor controller to use DTOs — controller never touches the entity directly

**Industry context:** This separation is non-negotiable in production codebases. DTOs prevent leaking internal schema changes to API consumers.

---

### Day 7 — Validation & Error Handling

**Concepts (30 min):**

- Bean Validation: @NotNull, @NotBlank, @Size, @Email, @Min, @Max
- @Valid on @RequestBody
- @ControllerAdvice + @ExceptionHandler — global error handling
- Standard error response structure (timestamp, status, message, path)

**Hands-on (90 min):**

- Add validation annotations to `EmployeeRequestDTO`
- Use @Valid in controller — observe default 400 response
- Create custom exceptions: `EmployeeNotFoundException`, `DuplicateEmailException`
- Build a `GlobalExceptionHandler` with @ControllerAdvice
- Return consistent error JSON: `{ "timestamp": "...", "status": 404, "error": "Not Found", "message": "...", "path": "..." }`

**Industry context:** Every production API has a global error handler. Consistent error formats are part of API contracts shared with frontend teams.

---

### Day 8 — Testing REST APIs

**Concepts (30 min):**

- @WebMvcTest — testing controllers in isolation
- MockMvc — simulating HTTP requests in tests
- @MockBean — mocking service layer
- Testing happy paths and error scenarios

**Hands-on (90 min):**

- Write tests for GET /api/employees — verify 200 + JSON structure
- Write tests for POST with valid body — verify 201
- Write tests for POST with invalid body — verify 400 + error structure
- Write tests for GET /{id} with non-existent ID — verify 404
- Aim for at least 5 test methods covering your controller

**Industry context:** Unit tests for controllers are expected in PRs. @WebMvcTest is faster than loading the full context — teams prefer it for CI/CD speed.

---

## Phase 3: Data Layer & Persistence (Days 9–12)

### Day 9 — Spring Data JPA & H2 Database

**Concepts (30 min):**

- ORM concept — objects ↔ database tables
- @Entity, @Table, @Id, @GeneratedValue
- JpaRepository — CRUD for free
- H2 console for development

**Hands-on (90 min):**

- Create `Employee` entity with fields: id, firstName, lastName, email, department, salary, joinDate
- Create `EmployeeRepository extends JpaRepository<Employee, Long>`
- Enable H2 console in properties, browse your table
- Refactor `EmployeeService` to use the repository instead of ArrayList
- Test all CRUD endpoints now hit the real (in-memory) database

**Industry context:** JPA is the standard ORM in Java enterprise. H2 is used for local dev and integration tests; production uses PostgreSQL/MySQL.

---

### Day 10 — Queries, Relationships & Pagination

**Concepts (40 min):**

- Derived query methods: findByDepartment, findByEmailIgnoreCase
- @Query for custom JPQL and native SQL
- @OneToMany, @ManyToOne relationships
- Pageable, Page, Sort

**Hands-on (80 min):**

- Add `Department` entity with @OneToMany relationship to Employee
- Write derived queries: `findByDepartment`, `findBySalaryGreaterThan`
- Write a @Query with JPQL: find employees who joined after a date
- Add pagination: GET `/api/employees?page=0&size=10&sort=lastName,asc`
- Test pagination responses — verify page metadata in response

**Industry context:** No production API returns unbounded lists. Pagination is mandatory. Derived queries handle 80% of cases; @Query handles the rest.

---

### Day 11 — Database Migrations & Real DB (PostgreSQL)

**Concepts (30 min):**

- Why schema migrations matter (team collaboration, CI/CD)
- Flyway — versioned SQL scripts
- Switching from H2 to PostgreSQL
- Docker basics for running Postgres locally

**Hands-on (90 min):**

- Start PostgreSQL via Docker: `docker run -p 5432:5432 -e POSTGRES_PASSWORD=secret postgres:16`
- Update `application-dev.yml` with PostgreSQL datasource config
- Add Flyway dependency, create `V1__create_employee_table.sql`
- Create `V2__create_department_table.sql`
- Run app — verify Flyway applies migrations, tables exist

**Industry context:** Flyway or Liquibase is used in every serious project. Manual schema changes in production are a career-ending move. Docker for local DBs is standard.

---

### Day 12 — Transactions & Integration Testing

**Concepts (30 min):**

- @Transactional — how Spring manages DB transactions
- Propagation (REQUIRED, REQUIRES_NEW)
- @DataJpaTest — testing repositories
- Testcontainers — real DB in tests

**Hands-on (90 min):**

- Add @Transactional to service methods that do multiple DB writes
- Create a scenario: create department + employee in one transaction, simulate failure, verify rollback
- Write @DataJpaTest for repository — test custom queries
- (Bonus) Add Testcontainers to run tests against real PostgreSQL instead of H2

**Industry context:** Transactional integrity is critical for financial/e-commerce systems. Testcontainers is replacing H2 for integration tests at most companies.

---

## Phase 4: Production Readiness (Days 13–15)

### Day 13 — Security Basics

**Concepts (40 min):**

- Spring Security filter chain
- Authentication vs Authorization
- HTTP Basic → JWT token flow
- SecurityFilterChain configuration (Spring Security 6+ style)

**Hands-on (80 min):**

- Add `spring-boot-starter-security`
- Configure SecurityFilterChain: permit `/api/public/**`, authenticate everything else
- Create a simple in-memory user with password (for learning)
- Test: unauthenticated requests get 401, authenticated get 200
- (Exposure) Read about JWT flow — implementing full JWT is a stretch goal

**Industry context:** Spring Security is complex but unavoidable. Every microservice authenticates requests. JWT + OAuth2 is the dominant pattern.

---

### Day 14 — Logging, Actuator & Exception Monitoring

**Concepts (30 min):**

- SLF4J + Logback — structured logging
- Log levels: TRACE, DEBUG, INFO, WARN, ERROR
- Spring Boot Actuator — health, metrics, info endpoints
- Centralized logging in production (ELK stack concept)

**Hands-on (90 min):**

- Add proper logging to service layer using `@Slf4j` (Lombok) or `LoggerFactory`
- Configure log levels per package in `application.yml`
- Add Actuator dependency, expose `/actuator/health`, `/actuator/info`, `/actuator/metrics`
- Customize health indicator (check DB connectivity)
- Add request/response logging via a `Filter` or `HandlerInterceptor`

**Industry context:** "If it's not logged, it didn't happen." Production debugging relies entirely on logs. Actuator endpoints are scraped by Prometheus/Grafana for monitoring dashboards.

---

### Day 15 — Putting It All Together & Deployment

**Concepts (30 min):**

- Application architecture review — all layers working together
- Building a fat JAR
- Docker containerization for Spring Boot apps
- CI/CD pipeline concepts (GitHub Actions / Jenkins)

**Hands-on (90 min):**

- Review your complete Employee Management API — ensure all layers are clean

- Build the fat JAR: `mvn clean package -DskipTests`

- Write a `Dockerfile`:

  ```dockerfile
  FROM eclipse-temurin:17-jre
  COPY target/*.jar app.jar
  ENTRYPOINT ["java", "-jar", "/app.jar"]
  ```

- Build and run the Docker image locally

- Write a basic `docker-compose.yml` with app + PostgreSQL

- Run `docker-compose up` — your entire stack runs with one command

**Industry context:** Every Spring Boot app ships as a Docker container. docker-compose for local dev, Kubernetes for production. This is the daily workflow at most companies.

---

## Final Project Summary

By Day 15, you'll have built:

| Component | What you built |
| --- | --- |
| REST API | Full CRUD with proper HTTP semantics |
| Layered Architecture | Controller → Service → Repository |
| DTOs & Validation | Request/Response separation, input validation |
| Error Handling | Global handler with consistent error format |
| Database | PostgreSQL with Flyway migrations |
| Relationships | OneToMany/ManyToOne with proper JPA mapping |
| Pagination & Sorting | Industry-standard paginated responses |
| Security | Basic Spring Security configuration |
| Testing | Unit tests (WebMvcTest) + Integration tests (DataJpaTest) |
| Observability | Logging + Actuator health/metrics |
| Deployment | Dockerized app with docker-compose |

---

## Daily Routine Template

| Block | Duration | Activity |
| --- | --- | --- |
| Learn | 30–40 min | Read concepts, watch one focused tutorial section |
| Build | 60–80 min | Implement the day's feature in your project |
| Review | 10–15 min | Commit to Git, write a brief note on what you learned |

---

## Tools You'll Need

- **IDE:** IntelliJ IDEA (Community is fine) or VS Code with Java extensions
- **Java:** JDK 17+ (LTS)
- **Build tool:** Maven (simpler for beginners) or Gradle
- **API testing:** Postman or Bruno
- **Database:** Docker + PostgreSQL
- **Version control:** Git + GitHub

---

## Stretch Goals (After 15 Days)

- [ ] Implement JWT authentication with refresh tokens

- [ ] Add Swagger/OpenAPI documentation (@springdoc-openapi)

- [ ] Implement caching with @Cacheable + Redis

- [ ] Add async processing with @Async

- [ ] Deploy to a cloud provider (AWS/Railway/Render)

- [ ] Add a CI/CD pipeline with GitHub Actions

- [ ] Explore Spring WebFlux (reactive programming)