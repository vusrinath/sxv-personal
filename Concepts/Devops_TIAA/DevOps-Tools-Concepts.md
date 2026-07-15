# DevOps Tools & Concepts

Reference guide covering Akamai CDN, CyberArk-Conjur secrets management, ElectricFlow CD, F5 load balancing, Federated CI, Jenkins, Kong API Gateway, and NGINX reverse proxy.

---

## 1. Akamai Staging

### What is Akamai?

A **Content Delivery Network (CDN)** and cloud security provider. It caches content at edge servers worldwide to deliver web content faster.

### What is Akamai Staging?

- A **testing environment** within Akamai's CDN to validate configuration changes before pushing to production
- Allows you to test caching rules, redirects, SSL configs, and security policies without affecting live traffic
- Uses staging network IPs — you point your local DNS (via hosts file) to staging servers to test

### Key Concepts

- **Edge Servers** — servers at the network edge closest to users
- **Property Manager** — UI/API to configure how Akamai handles requests (caching, redirects, headers)
- **Purge/Invalidate** — clear cached content when origin content changes
- **Origin Server** — your actual backend server that Akamai pulls content from

### Related Concepts

- **CDN** — Content Delivery Network (Cloudflare, AWS CloudFront are alternatives)
- **Cache-Control Headers** — `max-age`, `no-cache`, `no-store`
- **TTL (Time to Live)** — how long content stays cached
- **SSL/TLS Termination** — Akamai handles HTTPS, forwards HTTP to origin

---

## 2. CyberArk-Conjur

### What is CyberArk?

An enterprise **Privileged Access Management (PAM)** solution that secures, manages, and monitors privileged credentials (passwords, SSH keys, API keys).

### What is Conjur?

- An open-source **secrets management** tool by CyberArk
- Designed for DevOps/CI-CD pipelines to securely inject secrets at runtime
- Applications authenticate to Conjur and retrieve secrets — no hardcoded credentials

### How it Works

```
App/Container → Authenticates to Conjur → Gets secret → Uses secret to connect to DB/API
```

### Key Concepts

- **Vault** — secure storage for credentials
- **Policies** — YAML files defining who/what can access which secrets
- **Host Identity** — machines/containers get an identity to authenticate
- **Rotation** — automatic password rotation for privileged accounts
- **Just-In-Time (JIT) Access** — temporary elevated access

### Related Concepts

- **HashiCorp Vault** — alternative secrets manager
- **AWS Secrets Manager / Parameter Store** — cloud-native alternatives
- **Zero Trust Security** — never trust, always verify
- **Least Privilege Principle** — give minimum access needed

---

## 3. ElectricFlow (CloudBees CD)

### What is it?

An **application release automation** and **continuous delivery** platform (now called CloudBees CD/RO).

### What it Does

- Orchestrates complex deployment pipelines across environments
- Manages release workflows with approvals, gates, and rollbacks
- Provides visibility into what's deployed where

### Key Concepts

- **Pipeline** — sequence of stages (Dev → QA → Staging → Prod)
- **Procedure** — reusable automation scripts (like deploying an app)
- **Environment** — target deployment destination (servers, clusters)
- **Artifact** — deployable package (JAR, WAR, Docker image)
- **Gates/Approvals** — manual or automated checkpoints before promotion
- **Rollback** — revert to previous version on failure

### Related Concepts

- **Blue/Green Deployment** — two identical environments, switch traffic
- **Canary Deployment** — roll out to small % of users first
- **GitOps** — Git as single source of truth for deployments
- **ArgoCD / Spinnaker** — alternatives for CD

---

## 4. F5 Staging

### What is F5?

A **load balancer and application delivery controller (ADC)**. It distributes traffic across multiple backend servers.

### What is F5 Staging?

- A staging/test environment for F5 configurations
- Test load balancing rules, health checks, SSL offloading, and WAF rules before production

### Key Concepts

- **Virtual Server (VIP)** — the IP:port that clients connect to
- **Pool** — group of backend servers that handle requests
- **Pool Members** — individual backend servers in a pool
- **Health Monitor** — checks if backend servers are alive (HTTP, TCP, ping)
- **iRules** — F5's scripting language for traffic manipulation
- **Persistence (Sticky Sessions)** — route same client to same server
- **SSL Offloading** — F5 terminates SSL, forwards plain HTTP to backend

### Load Balancing Methods

| Method | Description |
| --- | --- |
| Round Robin | Distribute evenly in order |
| Least Connections | Send to server with fewest active connections |
| Weighted | Assign more traffic to powerful servers |
| IP Hash | Same client IP always goes to same server |

### Related Concepts

- **Reverse Proxy** — intermediary that forwards client requests to backend
- **HAProxy** — open-source alternative
- **AWS ALB/NLB** — cloud load balancers
- **Layer 4 vs Layer 7** — TCP-level vs HTTP-level load balancing

---

## 5. Fed-CI (Federated CI)

### What is it?

A **federated/centralized CI system** — a shared continuous integration platform across multiple teams/orgs with standardized pipelines.

### Key Concepts

- **Shared Pipeline Templates** — reusable CI templates teams plug into
- **Standardized Build Process** — consistent build, test, scan across all apps
- **Governance** — enforced security scans, code quality gates
- **Self-Service** — teams onboard their apps with minimal config

### Typical Fed-CI Pipeline Flow

```
Code Push → Build → Unit Tests → SAST Scan → Artifact Publish → Deploy to Dev
```

### Related Concepts

- **CI/CD** — Continuous Integration / Continuous Delivery
- **Pipeline as Code** — Jenkinsfile, .gitlab-ci.yml
- **Shared Libraries** — reusable pipeline code (Jenkins Shared Libraries)
- **Inner Source** — open-source practices within an organization

---

## 6. Jenkins

### What is it?

An open-source **automation server** for building, testing, and deploying software. The most widely used CI/CD tool.

### Key Concepts

- **Job/Project** — a task Jenkins executes (build, test, deploy)
- **Pipeline** — defined in a `Jenkinsfile` (Declarative or Scripted)
- **Stage** — logical grouping in a pipeline (Build, Test, Deploy)
- **Step** — a single action (run shell command, archive artifact)
- **Agent/Node** — machine where Jenkins runs jobs
- **Master** — orchestrates jobs, distributes to agents
- **Plugins** — extend Jenkins functionality (Git, Docker, Slack, etc.)

### Jenkinsfile Example (Declarative)

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'mvn clean package'
            }
        }
        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }
        stage('Deploy') {
            steps {
                sh './deploy.sh'
            }
        }
    }
}
```

### Key Features

- **Shared Libraries** — reusable Groovy code across pipelines
- **Multibranch Pipeline** — auto-creates pipelines per branch
- **Credentials Management** — securely store secrets
- **Webhooks** — trigger builds on Git push

### Related Concepts

- **GitHub Actions, GitLab CI, CircleCI** — alternatives
- **Build Triggers** — SCM polling, webhooks, cron
- **Artifact Repository** — Nexus, Artifactory (store build outputs)

---

## 7. Kong

### What is it?

An open-source **API Gateway** built on top of NGINX. It sits between clients and your microservices, handling cross-cutting concerns.

### What it Does

```
Client → Kong (API Gateway) → Microservice A, B, C...
```

### Key Concepts

- **Service** — represents your upstream API/microservice
- **Route** — defines how requests reach a service (path, host, method)
- **Plugin** — middleware that adds functionality to requests/responses
- **Consumer** — an entity (user/app) that consumes your APIs
- **Upstream** — load balancing config for backend targets

### Common Plugins

| Plugin | Purpose |
| --- | --- |
| Rate Limiting | Throttle requests per consumer |
| Authentication | Key-auth, JWT, OAuth2, LDAP |
| Logging | Send logs to HTTP, TCP, Kafka |
| CORS | Handle cross-origin requests |
| Request Transformer | Modify headers/body before forwarding |
| IP Restriction | Allow/deny by IP |

### Related Concepts

- **API Gateway Pattern** — single entry point for all microservices
- **Service Mesh** — Istio, Linkerd (service-to-service communication)
- **AWS API Gateway** — cloud-native alternative
- **OAuth2 / JWT** — token-based authentication
- **Rate Limiting** — protect services from overload

---

## 8. NGINX

### What is it?

A high-performance **web server, reverse proxy, and load balancer**. Used by \~30% of all websites.

### Use Cases

- **Web Server** — serve static files (HTML, CSS, JS)
- **Reverse Proxy** — forward requests to backend apps
- **Load Balancer** — distribute traffic across servers
- **API Gateway** — route and manage API traffic
- **SSL Termination** — handle HTTPS at the edge

### Key Concepts

- **Server Block** — virtual host configuration (like Apache's VirtualHost)
- **Location Block** — defines how to handle specific URL paths
- **Upstream** — group of backend servers for load balancing
- **proxy_pass** — forward request to another server

### Basic Config Example

```nginx
upstream backend {
    server app1:8080;
    server app2:8080;
}

server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        root /var/www/html;
    }
}
```

### NGINX vs Apache

| NGINX | Apache |
| --- | --- |
| Event-driven (async) | Process/Thread per connection |
| Better for static content & reverse proxy | Better for .htaccess, dynamic modules |
| Lower memory usage at scale | Higher memory under load |

### Related Concepts

- **Reverse Proxy vs Forward Proxy** — reverse sits in front of servers, forward sits in front of clients
- **NGINX Ingress Controller** — NGINX as Kubernetes ingress
- **Envoy Proxy** — modern alternative (used in Istio service mesh)

---

## 9. Related Overarching Concepts

### CI/CD Pipeline (End-to-End)

```
Developer → Git Push → Jenkins (Build/Test) → Artifact Repo → ElectricFlow (Deploy) → F5/NGINX (Route Traffic)
                              ↓
                    CyberArk-Conjur (Secrets)
                              ↓
                    Kong (API Gateway) → Microservices
                              ↓
                    Akamai (CDN/Edge Caching)
```

### Infrastructure as Code (IaC)

- **Terraform** — provision infrastructure declaratively
- **Ansible** — configuration management and automation
- **CloudFormation** — AWS-specific IaC

### Containerization & Orchestration

- **Docker** — package apps in containers
- **Kubernetes (K8s)** — orchestrate containers at scale
- **Helm** — package manager for Kubernetes

### Monitoring & Observability

- **Splunk / ELK Stack** — log aggregation and search
- **Prometheus + Grafana** — metrics and dashboards
- **Dynatrace / AppDynamics** — APM (Application Performance Monitoring)

### Networking Basics

- **DNS** — domain name to IP resolution
- **TCP/IP** — network communication protocol
- **HTTP/HTTPS** — web communication protocol
- **TLS/SSL** — encryption for data in transit
- **Ports** — 80 (HTTP), 443 (HTTPS), 8080 (common app port)

### Security in DevOps (DevSecOps)

- **SAST** — Static Application Security Testing (scan code)
- **DAST** — Dynamic Application Security Testing (scan running app)
- **SCA** — Software Composition Analysis (scan dependencies)
- **WAF** — Web Application Firewall (Akamai, F5 ASM)
- **mTLS** — Mutual TLS (both client and server verify each other)