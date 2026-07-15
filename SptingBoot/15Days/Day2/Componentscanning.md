# Component Scanning in Spring

Component scanning is the mechanism Spring uses to automatically discover and register beans in your application context.

## How It Works

On startup, Spring scans the base package (where your `@SpringBootApplication` class lives) and all sub-packages.

It looks for classes annotated with stereotype annotations: `@Component`, `@Service`, `@Repository`, `@Controller`, `@RestController`.

Each discovered class is instantiated and registered as a bean in the ApplicationContext.

## Key Rules

- `@SpringBootApplication` includes `@ComponentScan` implicitly — it scans from its own package downward
- Classes outside that package tree are invisible unless you explicitly add `@ComponentScan(basePackages = "com.other.package")`
- The class must be concrete (not abstract/interface) and have a usable constructor
