# Spring / Spring Boot — Keywords, Technical Terms & Jargons

## Core Spring Concepts

| Term                                  | Meaning                                                                                                        |
| ---------------------------------------| ----------------------------------------------------------------------------------------------------------------|
| **IoC (Inversion of Control)**        | Design principle where the framework controls object creation and lifecycle instead of the developer           |
| **DI (Dependency Injection)**         | Technique where Spring provides (injects) dependencies into a class rather than the class creating them itself |
| **ApplicationContext**                | The central IoC container that holds all beans and manages their lifecycle                                     |
| **BeanFactory**                       | Lower-level container interface; ApplicationContext extends it with extra features                             |
| **Bean**                              | An object managed by the Spring IoC container                                                                  |
| **Bean Scope**                        | Defines lifecycle — singleton, prototype, request, session, application                                        |
| **Bean Definition**                   | Metadata that tells the container how to create and configure a bean                                           |
| **Component Scanning**                | Automatic detection of classes annotated with stereotypes (`@Component`, `@Service`, etc.)                     |
| **Auto-wiring**                       | Spring automatically resolving and injecting dependencies by type or name                                      |
| **Configuration Class**               | A class annotated with `@Configuration` that defines beans via `@Bean` methods                                 |
| **Profiles**                          | Named groupings (`@Profile`) to activate beans only in certain environments (dev, prod, test)                  |
| **SpEL (Spring Expression Language)** | Expression language for querying/manipulating objects at runtime (`#{...}`)                                    |
| **PropertySource**                    | Mechanism to load external configuration (`.properties`, `.yml`, env vars)                                     |
| **Environment**                       | Abstraction representing profiles + properties for the running application                                     |

## Spring Boot Specific

| Term                                         | Meaning                                                                                               |
| ----------------------------------------------| -------------------------------------------------------------------------------------------------------|
| **Auto-configuration**                       | Spring Boot automatically configures beans based on classpath dependencies and properties             |
| **Starter**                                  | Pre-packaged dependency descriptors (e.g., `spring-boot-starter-web`, `spring-boot-starter-data-jpa`) |
| **Opinionated Defaults**                     | Sensible default configurations that work out of the box                                              |
| **Embedded Server**                          | Built-in Tomcat/Jetty/Undertow — no need to deploy WAR to external server                             |
| **SpringApplication**                        | Bootstrap class that launches a Spring Boot app                                                       |
| **@SpringBootApplication**                   | Meta-annotation combining `@Configuration`, `@EnableAutoConfiguration`, `@ComponentScan`              |
| **application.properties / application.yml** | Default configuration files                                                                           |
| **Actuator**                                 | Production-ready features — health checks, metrics, info endpoints                                    |
| **DevTools**                                 | Hot-reload, automatic restart, and dev-time conveniences                                              |
| **Spring Initializr**                        | Web tool (start.spring.io) to generate project scaffolding                                            |
| **Fat JAR / Uber JAR**                       | Single executable JAR containing all dependencies                                                     |
| **Banner**                                   | The ASCII art shown at startup (customizable)                                                         |
| **CommandLineRunner / ApplicationRunner**    | Interfaces to run code after the app context is ready                                                 |
| **Conditional Annotations**                  | `@ConditionalOnClass`, `@ConditionalOnProperty`, etc. — control when auto-config kicks in             |

## Stereotype Annotations

| Term | Meaning |
|------|---------|
| **@Component** | Generic Spring-managed bean |
| **@Service** | Business logic layer bean (semantic marker) |
| **@Repository** | Data access layer bean; adds exception translation |
| **@Controller** | Spring MVC controller (returns views) |
| **@RestController** | `@Controller` + `@ResponseBody` — returns JSON/XML directly |

## Web / MVC

| Term | Meaning |
|------|---------|
| **DispatcherServlet** | Front controller that routes all HTTP requests in Spring MVC |
| **Handler Mapping** | Maps incoming requests to controller methods |
| **@RequestMapping** | Maps a URL pattern to a method; shortcuts: `@GetMapping`, `@PostMapping`, etc. |
| **@PathVariable** | Binds a URI template variable to a method parameter |
| **@RequestParam** | Binds a query parameter to a method parameter |
| **@RequestBody** | Deserializes the HTTP body into a Java object |
| **@ResponseBody** | Serializes the return value into the HTTP response body |
| **@ResponseStatus** | Sets the HTTP status code on a response |
| **ResponseEntity** | Full control over HTTP response (status, headers, body) |
| **@ExceptionHandler** | Handles exceptions thrown by controller methods |
| **@ControllerAdvice** | Global exception handling / model attributes across controllers |
| **Content Negotiation** | Mechanism to return JSON, XML, etc. based on `Accept` header |
| **CORS** | Cross-Origin Resource Sharing configuration |
| **Filter** | Servlet filter for pre/post processing of requests |
| **Interceptor (HandlerInterceptor)** | Spring-level pre/post processing (similar to filter but within Spring context) |
| **WebFlux** | Reactive, non-blocking web framework (alternative to MVC) |
| **Mono / Flux** | Reactive types — Mono (0 or 1 element), Flux (0 to N elements) |

## Data Access

| Term | Meaning |
|------|---------|
| **Spring Data JPA** | Abstraction over JPA with repository pattern |
| **JpaRepository** | Interface providing CRUD + pagination + sorting out of the box |
| **CrudRepository** | Basic CRUD operations interface |
| **Entity** | JPA-annotated class mapped to a database table (`@Entity`) |
| **@Table** | Specifies the database table name |
| **@Id / @GeneratedValue** | Primary key and generation strategy |
| **Derived Query Methods** | Methods like `findByEmailAndStatus()` — Spring generates SQL from method name |
| **@Query** | Custom JPQL or native SQL on repository methods |
| **@Transactional** | Declarative transaction management |
| **Propagation** | How transactions relate to each other (REQUIRED, REQUIRES_NEW, etc.) |
| **Isolation** | Transaction isolation levels (READ_COMMITTED, SERIALIZABLE, etc.) |
| **DataSource** | Connection pool configuration (HikariCP by default in Spring Boot) |
| **Flyway / Liquibase** | Database migration tools integrated with Spring Boot |
| **Spring Data MongoDB / Redis / Elasticsearch** | Spring Data modules for NoSQL stores |
| **JdbcTemplate** | Low-level JDBC helper that removes boilerplate |

## Security

| Term | Meaning |
|------|---------|
| **Spring Security** | Framework for authentication and authorization |
| **SecurityFilterChain** | Chain of filters that process security concerns |
| **Authentication** | Verifying identity (who are you?) |
| **Authorization** | Verifying permissions (what can you do?) |
| **@PreAuthorize / @Secured** | Method-level security annotations |
| **UserDetailsService** | Interface to load user-specific data for authentication |
| **PasswordEncoder** | Hashes passwords (BCrypt, Argon2, etc.) |
| **CSRF** | Cross-Site Request Forgery protection |
| **OAuth2 / OIDC** | Token-based auth standards supported via `spring-boot-starter-oauth2-client` |
| **JWT (JSON Web Token)** | Stateless token format often used with Spring Security |
| **SecurityContext** | Holds the current user's authentication info (thread-local) |
| **Principal** | The currently authenticated user |
| **GrantedAuthority / Role** | Permissions assigned to a user |

## AOP (Aspect-Oriented Programming)

| Term | Meaning |
|------|---------|
| **Aspect** | A cross-cutting concern (logging, security, transactions) |
| **Advice** | Code that runs at a join point (Before, After, Around, AfterReturning, AfterThrowing) |
| **Join Point** | A point in execution (method call, exception throw) |
| **Pointcut** | Expression that selects join points |
| **Weaving** | Linking aspects with target objects (compile-time, load-time, or runtime) |
| **@Aspect** | Declares a class as an aspect |
| **@Around** | Advice that wraps a method — can control whether the method executes |

## Messaging & Events

| Term | Meaning |
|------|---------|
| **ApplicationEvent** | Event published within the Spring context |
| **@EventListener** | Method-level listener for application events |
| **Spring Kafka / Spring AMQP** | Integration with Kafka / RabbitMQ |
| **@KafkaListener** | Listens to Kafka topics |
| **Spring Cloud Stream** | Abstraction over messaging middleware |

## Testing

| Term | Meaning |
|------|---------|
| **@SpringBootTest** | Loads full application context for integration tests |
| **@WebMvcTest** | Loads only the web layer (controllers, filters) |
| **@DataJpaTest** | Loads only JPA components with an in-memory DB |
| **@MockBean** | Replaces a bean in the context with a Mockito mock |
| **TestRestTemplate / WebTestClient** | HTTP clients for testing endpoints |
| **@ActiveProfiles("test")** | Activates the test profile |
| **Testcontainers** | Spin up real Docker containers (DB, Redis) for integration tests |

## Spring Cloud / Microservices

| Term | Meaning |
|------|---------|
| **Service Discovery** | Eureka / Consul — services register and find each other |
| **API Gateway** | Spring Cloud Gateway — routing, rate limiting, load balancing |
| **Config Server** | Centralized external configuration management |
| **Circuit Breaker** | Resilience4j / Hystrix — fail-fast when downstream is unhealthy |
| **Load Balancer** | Spring Cloud LoadBalancer — client-side load balancing |
| **Feign Client** | Declarative HTTP client (`@FeignClient`) |
| **Distributed Tracing** | Micrometer Tracing / Zipkin — trace requests across services |
| **Service Mesh** | Infrastructure layer (Istio) for service-to-service communication |
| **Sidecar** | Helper process running alongside a service |
| **Saga Pattern** | Manage distributed transactions across microservices |

## Build & Deployment

| Term | Meaning |
|------|---------|
| **Maven / Gradle** | Build tools for dependency management and lifecycle |
| **POM (pom.xml)** | Maven project descriptor |
| **build.gradle** | Gradle build script |
| **Spring Boot Maven Plugin / Gradle Plugin** | Packages fat JARs, runs the app |
| **Layered JAR** | Optimized Docker image layering for Spring Boot apps |
| **Buildpacks** | Cloud Native Buildpacks to create OCI images without Dockerfile |
| **GraalVM Native Image** | Ahead-of-time compilation for instant startup (Spring Boot 3+) |
| **WAR** | Web Application Archive (for traditional servlet containers) |

## Common Patterns & Practices

| Term                                 | Meaning                                                                                  |
| --------------------------------------| ------------------------------------------------------------------------------------------|
| **DTO (Data Transfer Object)**       | Object for transferring data between layers (not entity)                                 |
| **VO (Value Object)**                | Immutable object defined by its attributes                                               |
| **Mapper (MapStruct / ModelMapper)** | Converts between DTOs and entities                                                       |
| **Repository Pattern**               | Abstraction over data access                                                             |
| **Service Layer**                    | Business logic encapsulation                                                             |
| **Controller Layer**                 | HTTP request handling                                                                    |
| **Exception Handling (Global)**      | `@ControllerAdvice` + `@ExceptionHandler`                                                |
| **Pagination**                       | `Pageable`, `Page<T>`, `Slice<T>`                                                        |
| **HATEOAS**                          | Hypermedia as the Engine of Application State — links in REST responses                  |
| **Validation**                       | `@Valid`, `@NotNull`, `@Size`, etc. (Bean Validation / Hibernate Validator)              |
| **Lombok**                           | Reduces boilerplate (`@Data`, `@Builder`, `@Slf4j`) — not Spring-specific but ubiquitous |
| **Scheduling**                       | `@Scheduled`, `@EnableScheduling` for cron/periodic tasks                                |
| **Caching**                          | `@Cacheable`, `@CacheEvict` with pluggable cache providers                               |
| **Async**                            | `@Async`, `@EnableAsync` for asynchronous method execution                               |


An Entity is a Java class that maps to a database table