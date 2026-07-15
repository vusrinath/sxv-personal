# Gradle Learning Guide

---

## 1. What is Gradle?

Gradle is a **build automation tool** for Java (and other languages). It handles:

- Downloading libraries (dependencies) your code needs
- Compiling your source code
- Running tests
- Packaging your app into a JAR/WAR file
- Running your application

Think of it like a recipe executor — your `build.gradle` file is the recipe, and Gradle follows it to build your project.

---

## 2. Gradle Project Structure

```
student-management/
├── build.gradle                  ← Main build script (the recipe)
├── settings.gradle               ← Project settings & plugin resolution config
├── gradle.properties             ← Key-value properties (credentials, versions)
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar    ← Small JAR that downloads the correct Gradle version
│       └── gradle-wrapper.properties  ← Specifies which Gradle version to use
├── gradlew.bat                   ← Windows script to run Gradle via wrapper
├── gradlew                       ← Linux/Mac script to run Gradle via wrapper
└── src/
    ├── main/java/...             ← Your application code
    └── test/java/...             ← Your test code
```

### What you faced:

- You had both a **global Gradle installation** (`C:\Third party\gradle-9.1.0\`) and a **wrapper** in the project
- Running `gradle bootRun` used the global installation
- Running `.\gradlew.bat bootRun` uses the wrapper (project-specific version)

---

## 3. build.gradle — The Main Build Script

This is the most important file. It tells Gradle:

- What plugins to use
- Where to download dependencies from (repositories)
- What libraries your project needs (dependencies)

### Your build.gradle breakdown:

```groovy
// SECTION 1: buildscript — configures Gradle itself (plugins, plugin repos)
buildscript {
    repositories { ... }    // Where to find plugins
    dependencies { ... }    // Which plugins to download
}

// SECTION 2: apply plugin — activates plugins
apply plugin: 'java'
apply plugin: 'io.spring.dependency-management'
apply plugin: 'org.springframework.boot'

// SECTION 3: project metadata
group = 'com.college'
version = '0.0.1-SNAPSHOT'

// SECTION 4: repositories — where to find your app's libraries
repositories { ... }

// SECTION 5: dependencies — what libraries your app needs
dependencies { ... }
```

---

## 4. Buildscript Block

```groovy
buildscript {
    repositories {
        maven {
            url "https://artifactory.techopscloud.com/artifactory/business-services/"
            credentials {
                username = findProperty('artifactory_user') ?: ''
                password = findProperty('artifactory_password') ?: ''
            }
        }
    }
    dependencies {
        classpath "org.springframework.boot:spring-boot-gradle-plugin:4.0.6"
    }
}
```

### What it does:

- `buildscript` configures Gradle's own classpath — it tells Gradle where to find **plugins** (not your app's libraries)
- `repositories` inside `buildscript` = where Gradle downloads plugin JARs from
- `dependencies` inside `buildscript` with `classpath` = which plugin JARs to download

### Why you need it:

- The Spring Boot plugin (`spring-boot-gradle-plugin`) adds tasks like `bootRun` to your project
- Without it, Gradle wouldn't know how to run a Spring Boot app

### What you faced:

- **401 Unauthorized** — Gradle couldn't authenticate to download plugins from your artifactory
- **Plugin not found** — Spring Boot 4.1.0 didn't exist; 4.0.6 was the correct version in your artifactory

---

## 5. Plugins

Plugins add capabilities to your build. Think of them as "extensions" for Gradle.

```groovy
apply plugin: 'java'                           // Adds Java compilation support
apply plugin: 'io.spring.dependency-management' // Manages dependency versions automatically
apply plugin: 'org.springframework.boot'        // Adds bootRun, bootJar tasks
```

| Plugin | What it adds |
| --- | --- |
| `java` | `compileJava`, `test`, `jar` tasks; understands `src/main/java` structure |
| `io.spring.dependency-management` | Lets Spring Boot manage library versions for you (you don't specify versions for starters) |
| `org.springframework.boot` | `bootRun` (run app), `bootJar` (create executable JAR) |

### Two ways to apply plugins:

**Legacy way (what you use):**

```groovy
buildscript {
    dependencies {
        classpath "org.springframework.boot:spring-boot-gradle-plugin:4.0.6"
    }
}
apply plugin: 'org.springframework.boot'
```

**Modern way (plugins DSL):**

```groovy
plugins {
    id 'org.springframework.boot' version '4.0.6'
}
```

### What you faced:

- **403 Forbidden** with `plugins {}` DSL — it tried to resolve from `plugins.gradle.org` which was blocked
- Switching to `buildscript` + `apply plugin` let you control exactly where plugins are downloaded from

---

## 6. Repositories

Repositories are **servers that host libraries** (JAR files). Gradle downloads dependencies from these.

```groovy
repositories {
    maven {
        url "https://artifactory.techopscloud.com/artifactory/tiaa-ml-dev"
        credentials {
            username = findProperty('artifactory_user') ?: ''
            password = findProperty('artifactory_password') ?: ''
        }
    }
    mavenCentral()  // Public repository (https://repo.maven.apache.org)
}
```

### Types of repositories:

| Repository | Description |
| --- | --- |
| `mavenCentral()` | Public, free, hosts most open-source libraries |
| `maven { url "..." }` | Custom/private repository (like your Artifactory) |
| `google()` | Google's repository (for Android) |

### Two different repository sections:

1. `buildscript { repositories {} }` — Where to find **plugins**
2. `repositories {}` (top-level) — Where to find your **app's dependencies**

### What you faced:

- Your network blocks `mavenCentral()` and `plugins.gradle.org`
- All dependencies must come through your corporate Artifactory
- **401 errors** = authentication required but not provided

---

## 7. Credentials & Authentication

### How Gradle authenticates to private repositories:

```groovy
maven {
    url "https://artifactory.techopscloud.com/..."
    credentials {
        username = findProperty('artifactory_user') ?: ''
        password = findProperty('artifactory_password') ?: ''
    }
}
```

### Where credentials are stored:

| File | Scope | Location |
| --- | --- | --- |
| Project `gradle.properties` | This project only | `<project>/gradle.properties` |
| User `gradle.properties` | All projects for this user | `~/.gradle/gradle.properties` (`C:\Users\vunnava\.gradle\gradle.properties`) |

### `gradle.properties` content:

```properties
artifactory_user=your.email@company.com
artifactory_password=<identity-token>
```

### `findProperty()` function:

- Reads a property from `gradle.properties` (project-level first, then user-level)
- `findProperty('artifactory_user') ?: ''` means "get the property, or use empty string if not found"

### Credential types (what caused your error):

| Type | When used |
| --- | --- |
| `PasswordCredentials` | Standard username/password — what `credentials { username; password }` uses |
| `HttpHeaderCredentials` | Token-based auth via HTTP headers — used by `systemProp.gradle.wrapperUser` |

### What you faced:

- `HttpHeaderCredentials does not match PasswordCredentials` — Your `~/.gradle/gradle.properties` had `systemProp.gradle.wrapperUser` which set up header-based auth globally, conflicting with the `credentials {}` block in build.gradle
- **Identity Token** — Used in place of API key/password for Artifactory authentication

---

## 8. Gradle Wrapper

The wrapper ensures everyone on the team uses the **same Gradle version**.

### Files:

```
gradle/wrapper/gradle-wrapper.properties   ← Specifies version & download URL
gradle/wrapper/gradle-wrapper.jar          ← Bootstrap JAR that downloads Gradle
gradlew.bat                                ← Windows launcher script
gradlew                                    ← Unix launcher script
```

### `gradle-wrapper.properties`:

```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.14.1-bin.zip
```

### Wrapper vs Global Installation:

| Command | Uses |
| --- | --- |
| `.\gradlew.bat bootRun` | Wrapper (downloads specified version) |
| `gradle bootRun` | Global installation on PATH |

### Wrapper authentication:

```properties
# In ~/.gradle/gradle.properties
systemProp.gradle.wrapperUser=your.email@company.com
systemProp.gradle.wrapperPassword=<token>
```

These authenticate when the wrapper downloads Gradle from a private server.

### What you faced:

- **403 from GitHub** — Wrapper tried to download Gradle from `services.gradle.org` which redirects to GitHub (blocked)
- **Distribution not found** — The Gradle ZIP wasn't at the artifactory path you specified
- **Version mismatch** — Wrapper said 8.14.1 but global was 9.1.0; Spring Boot 4.0.6 requires 8.14+

---

## 9. settings.gradle

Configures project-level settings that are evaluated **before** `build.gradle`.

```groovy
pluginManagement {
    repositories {
        maven {
            url 'https://artifactory.techopscloud.com/artifactory/business-services/'
        }
    }
}

rootProject.name = 'student-management'
```

### Key sections:

| Section | Purpose |
| --- | --- |
| `pluginManagement { repositories {} }` | Where to resolve plugins when using `plugins {}` DSL |
| `rootProject.name` | Sets the project name |

### What you faced:

- Needed `pluginManagement` to redirect plugin downloads from `plugins.gradle.org` to your artifactory
- Credentials in `settings.gradle` use `providers.gradleProperty()` instead of `findProperty()` (different API)

---

## 10. Dependencies

Dependencies are external libraries your code needs.

```groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    compileOnly 'org.projectlombok:lombok'
    runtimeOnly 'com.mysql:mysql-connector-j'
    annotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}
```

### Dependency coordinates format:

```
'group:artifact:version'
'org.springframework.boot:spring-boot-starter-web:4.0.6'
```

When using Spring Boot's dependency management plugin, you can omit the version — it's managed for you.

### Dependency configurations (scopes):

| Configuration | When available | Included in final JAR? |
| --- | --- | --- |
| `implementation` | Compile + Runtime | Yes |
| `compileOnly` | Compile only | No |
| `runtimeOnly` | Runtime only | Yes |
| `annotationProcessor` | Compilation (annotation processing) | No |
| `testImplementation` | Test compile + runtime | No |
| `testRuntimeOnly` | Test runtime only | No |
| `testCompileOnly` | Test compile only | No |

### What you faced:

- Adding `spring-boot-starter-data-jpa` pulled in Hibernate which required a datasource
- Without MySQL configured, the app failed with "Failed to determine a suitable driver class"

---

## 11. Init Scripts (Global Build Configuration)

Init scripts run **before any project build** — they apply to ALL projects on your machine.

### Location:

```
<GRADLE_HOME>/init.d/          ← e.g., C:\Third party\gradle-9.1.0\init.d\
~/.gradle/init.d/              ← User-level init scripts
```

### What they do in your environment:

- `tiaa-gradle-plugins.gradle` — Applies TIAA-specific plugins, configures repositories, handles authentication
- `atom-gradle-plugins.gradle` — Applies Atom framework plugins

### What you faced:

- `groovy/swing/SwingBuilder` — These init scripts use Groovy's SwingBuilder class which was removed in Gradle 9.x (Groovy 4)
- **Solution** — Renamed to `.bak` to disable them, then handled authentication manually in `build.gradle`
- **Trade-off** — Disabling init scripts means you lose automatic artifactory authentication and must configure it yourself

---

## 12. Gradle Versions & Compatibility

### Version compatibility matrix for your project:

| Component | Version | Requirement |
| --- | --- | --- |
| Spring Boot Plugin | 4.0.6 | Gradle 8.14+ or 9.x |
| TIAA Init Scripts | \- | Gradle 8.x only (uses Groovy 3 APIs) |
| Java | 17 | \- |

### What you faced:

- **Gradle 8.5** — Too old for Spring Boot 4.0.6 (needs 8.14+)
- **Gradle 9.1.0** — Breaks TIAA init scripts (Groovy 4 removed `SwingBuilder`)
- **Solution** — Use Gradle 9.1.0 with init scripts disabled

### Groovy version changes:

| Gradle Version | Groovy Version | SwingBuilder |
| --- | --- | --- |
| 8.x | Groovy 3 | Available |
| 9.x | Groovy 4 | Removed |

---

## 13. Tasks

Tasks are units of work Gradle can execute.

### Common tasks:

| Task | What it does |
| --- | --- |
| `bootRun` | Runs your Spring Boot application |
| `build` | Compiles, tests, and packages your app |
| `clean` | Deletes the `build/` directory |
| `test` | Runs unit tests |
| `bootJar` | Creates an executable JAR |
| `dependencies` | Shows all dependencies |
| `tasks` | Lists all available tasks |

### Running tasks:

```powershell
& "C:\Third party\gradle-9.1.0\bin\gradle.bat" bootRun
& "C:\Third party\gradle-9.1.0\bin\gradle.bat" clean build
& "C:\Third party\gradle-9.1.0\bin\gradle.bat" dependencies
```

### Passing system properties:

```powershell
& "C:\Third party\gradle-9.1.0\bin\gradle.bat" bootRun -Dtiaa.gradle.plugins.version=8.10.2.88
```

The `-D` flag passes a Java system property.

---

## 14. Java Toolchain

```groovy
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}
```

### What it does:

- Tells Gradle to use Java 17 for compiling and running
- Gradle can auto-detect or auto-download the correct JDK
- Replaces the older `sourceCompatibility`/`targetCompatibility` approach

---

## 15. System Properties in gradle.properties

Properties prefixed with `systemProp.` become Java system properties.

```properties
# Regular property — accessed via findProperty('artifactory_user')
artifactory_user=your.email@company.com

# System property — becomes -Dgradle.wrapperUser=... automatically
systemProp.gradle.wrapperUser=your.email@company.com
systemProp.gradle.wrapperPassword=<token>
```

### What you faced:

- `systemProp.gradle.wrapperUser` — Authenticates wrapper downloads from private servers
- These system properties affected ALL repository authentication, causing the `HttpHeaderCredentials` vs `PasswordCredentials` conflict

---

## 16. Dependency Management Plugin

```groovy
apply plugin: 'io.spring.dependency-management'
```

### What it does:

- Imports a BOM (Bill of Materials) from Spring Boot
- Automatically sets versions for all Spring-related dependencies
- You write `'org.springframework.boot:spring-boot-starter-web'` without a version

### Without it:

```groovy
implementation 'org.springframework.boot:spring-boot-starter-web:4.0.6'
implementation 'org.springframework:spring-core:6.2.0'
// Must manually keep all versions compatible
```

### With it:

```groovy
implementation 'org.springframework.boot:spring-boot-starter-web'
// Version automatically resolved from Spring Boot's BOM
```

---

## 17. Auto-Configuration & Dependency Side Effects

### What you faced:

Adding `spring-boot-starter-data-jpa` caused:

```
Failed to determine a suitable driver class
```

### Why:

- Spring Boot **auto-configures** beans based on what's on the classpath
- `data-jpa` on classpath → Spring Boot tries to create a `DataSource` → needs database config → fails

### Fix:

```properties
# Exclude auto-configuration classes
spring.autoconfigure.exclude=org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration,org.springframework.boot.hibernate.autoconfigure.HibernateJpaAutoConfiguration
```

### Important note:

Auto-configuration class packages changed in Spring Boot 4.x:

| Spring Boot 3.x | Spring Boot 4.x |
| --- | --- |
| `org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration` | `org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration` |

---

## 18. Gradle Daemon

Gradle runs a background process (daemon) to speed up builds.

### Useful commands:

```powershell
& "C:\Third party\gradle-9.1.0\bin\gradle.bat" --stop          # Stop all daemons
& "C:\Third party\gradle-9.1.0\bin\gradle.bat" --no-daemon bootRun  # Run without daemon
```

### What you faced:

- IntelliJ and terminal may use **different daemons** with different configurations
- This is why builds worked in terminal but failed in IntelliJ (different credentials loaded)

---

## 19. Troubleshooting Cheat Sheet

| Error | Cause | Fix |
| --- | --- | --- |
| `401 Unauthorized` | Missing or wrong credentials | Add credentials to `gradle.properties` and `build.gradle` |
| `403 Forbidden` | URL blocked by network/firewall | Use corporate artifactory URL instead |
| `Plugin not found` | Wrong version or wrong repository | Verify version exists in your artifactory |
| `HttpHeaderCredentials does not match PasswordCredentials` | Conflicting auth mechanisms | Remove explicit `credentials {}` block or disable `systemProp.gradle.wrapper*` |
| `groovy/swing/SwingBuilder` | Plugin uses removed Groovy API | Use Gradle 8.x or disable the incompatible plugin |
| `Spring Boot requires Gradle 8.14+` | Gradle version too old | Upgrade Gradle |
| `Failed to determine driver class` | Auto-config needs DB but none configured | Exclude DataSource auto-configuration |
| `Task not found` | Wrong command syntax | Use `& "path\to\gradle.bat" taskName` in PowerShell |

---

## 20. Your Project's Build Flow (Summary)

```
1. Gradle starts (9.1.0, init scripts disabled)
2. Reads settings.gradle → sets project name, plugin repos
3. Reads gradle.properties → loads credentials
4. Reads build.gradle:
   a. buildscript {} → downloads Spring Boot plugin from artifactory
   b. apply plugin → activates java, dependency-management, spring-boot
   c. repositories {} → configures where to find app dependencies
   d. dependencies {} → declares what libraries the app needs
5. Resolves & downloads all dependencies
6. Executes requested task (e.g., bootRun)
   → Compiles Java 17 code
   → Starts embedded Tomcat on port 8080
   → App is running!
```

---

## Recommended Learning Order

 1. **What is Gradle** (Section 1)
 2. **Project Structure** (Section 2)
 3. **build.gradle basics** (Section 3)
 4. **Repositories** (Section 6)
 5. **Dependencies** (Section 10)
 6. **Plugins** (Section 5)
 7. **Buildscript block** (Section 4)
 8. **Tasks** (Section 13)
 9. **Gradle Wrapper** (Section 8)
10. **settings.gradle** (Section 9)
11. **Credentials** (Section 7)
12. **gradle.properties & System Properties** (Section 15)
13. **Init Scripts** (Section 11)
14. **Version Compatibility** (Section 12)
15. **Dependency Management** (Section 16)
16. **Java Toolchain** (Section 14)
17. **Auto-Configuration side effects** (Section 17)
18. **Gradle Daemon** (Section 18)
19. **Troubleshooting** (Section 19)

---

## Quick Reference Commands (PowerShell)

```powershell
# Run the app
& "C:\Third party\gradle-9.1.0\bin\gradle.bat" bootRun

# Clean and build
& "C:\Third party\gradle-9.1.0\bin\gradle.bat" clean build

# List all tasks
& "C:\Third party\gradle-9.1.0\bin\gradle.bat" tasks

# Show dependency tree
& "C:\Third party\gradle-9.1.0\bin\gradle.bat" dependencies

# Run with extra properties
& "C:\Third party\gradle-9.1.0\bin\gradle.bat" bootRun -Dtiaa.gradle.plugins.version=8.10.2.88

# Stop Gradle daemons
& "C:\Third party\gradle-9.1.0\bin\gradle.bat" --stop
```

Build Script — What build.gradle is

Project — A single buildable unit

Task — A unit of work (e.g., bootRun, clean, build)

Plugin — Extension that adds tasks/capabilities (apply plugin)

Repository — Server hosting JAR files (mavenCentral(), maven { url })

Dependency — External library your code needs

Configuration — Scope of a dependency (implementation, compileOnly, runtimeOnly)

Classpath — Set of JARs available to Gradle/your app

Buildscript block — Configures Gradle's own plugins/classpath

Settings file — settings.gradle, evaluated before build script

Plugin Management — Controls where plugins are resolved from

Gradle Wrapper — Project-specific Gradle version (gradlew.bat)

Distribution URL — Where the wrapper downloads Gradle from

Credentials — Username/password for private repositories

PasswordCredentials vs HttpHeaderCredentials — Two auth mechanisms

[gradle.properties](http://gradle.properties) — Key-value config file for properties

System Properties — systemProp.\* entries that become -D flags

findProperty() — Function to read from [gradle.properties](http://gradle.properties)

Init Scripts — Global scripts in &lt;GRADLE_HOME&gt;/init.d/ that run for all builds

Gradle Daemon — Background process that speeds up builds

Java Toolchain — Declares which Java version to compile with

Dependency Management Plugin — Auto-manages library versions via BOM

BOM (Bill of Materials) — A file listing compatible dependency versions

Auto-Configuration — Spring Boot feature that configures beans based on classpath

GAV Coordinates — group:artifact:version format for dependencies

Classpath vs Implementation — classpath = plugin deps, implementation = app deps

Configuration Cache — Speeds up builds by caching build configuration

Deprecation Warnings — Features that will be removed in future Gradle versions