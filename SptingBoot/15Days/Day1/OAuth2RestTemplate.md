# OAuth2RestTemplate

## What Is It?

`OAuth2RestTemplate` is a **specialized HTTP client** that automatically handles OAuth2 authentication when making API calls to protected resources. It manages token acquisition, token refresh, and attaches the Bearer token to outgoing requests — all without you writing that logic manually.

> **⚠️ Deprecated Notice:** `OAuth2RestTemplate` is part of the older Spring Security OAuth project. In modern Spring Boot (3.x+), use **WebClient** with `ServerOAuth2AuthorizedClientExchangeFilterFunction` or **RestClient** with OAuth2 interceptors instead. But understanding this concept is still valuable.

## Package

```
org.springframework.security.oauth2.client.OAuth2RestTemplate
```

Part of: `spring-security-oauth2-client` (legacy) / `spring-boot-starter-oauth2-client`

## The Problem It Solves

Without it, calling an OAuth2-protected API looks like:

```java
// Manual approach — painful
String token = getAccessToken(clientId, clientSecret, tokenUrl);  // step 1
if (isExpired(token)) {
    token = refreshToken(refreshToken, tokenUrl);                  // step 2
}
HttpHeaders headers = new HttpHeaders();
headers.setBearerAuth(token);                                      // step 3
HttpEntity<String> entity = new HttpEntity<>(headers);
ResponseEntity<Data> response = restTemplate.exchange(url, GET, entity, Data.class);
```

With `OAuth2RestTemplate`, all that collapses to:

```java
// OAuth2RestTemplate handles token lifecycle automatically
Data response = oauth2RestTemplate.getForObject(url, Data.class);
```

## How It Works

```
Your App  →  OAuth2RestTemplate  →  Token Endpoint (gets/refreshes token)
                                 →  Resource Server (API call with Bearer token)
```

### Configuration (Legacy Style)

```java
@Configuration
public class OAuth2Config {

    @Bean
    public OAuth2RestTemplate oauth2RestTemplate(OAuth2ClientContext context) {
        ClientCredentialsResourceDetails resource = new ClientCredentialsResourceDetails();
        resource.setClientId("my-client-id");
        resource.setClientSecret("my-client-secret");
        resource.setAccessTokenUri("https://auth-server.com/oauth/token");
        resource.setScope(List.of("read", "write"));

        return new OAuth2RestTemplate(resource, context);
    }
}
```

### Modern Replacement (Spring Boot 3.x+)

```java
@Configuration
public class WebClientConfig {

    @Bean
    public WebClient webClient(OAuth2AuthorizedClientManager clientManager) {
        var oauth2 = new ServletOAuth2AuthorizedClientExchangeFilterFunction(clientManager);
        oauth2.setDefaultClientRegistrationId("my-service");

        return WebClient.builder()
            .apply(oauth2.oauth2Configuration())
            .build();
    }
}
```

## OAuth2 Grant Types It Supports

| Grant Type | Use Case |
|-----------|----------|
| **Client Credentials** | Service-to-service calls (no user involved) |
| **Authorization Code** | User-facing apps (redirects to login page) |
| **Password** | Legacy — user provides username/password directly (discouraged) |
| **Refresh Token** | Automatically refreshes expired access tokens |

## Why It Matters

- In microservice architectures, services constantly call each other via OAuth2-secured APIs
- Manually managing tokens is error-prone (race conditions, expiry, refresh logic)
- This abstracts all of that into a single HTTP client

## Industry Context

- **Legacy projects** still use `OAuth2RestTemplate` — you'll encounter it in older codebases
- **New projects** use `WebClient` (reactive) or `RestClient` (blocking, Spring 6.1+) with OAuth2 support
- The **concept** is identical — only the implementation class changed
