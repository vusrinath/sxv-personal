# Apache Kafka

Apache Kafka is a distributed event streaming platform for building real-time data pipelines. This note covers core concepts (topics, producers, consumers, partitions), use cases, key guarantees, and comparison with traditional message queues.

## What is Kafka?
Apache Kafka is a **distributed event streaming platform** used for building real-time data pipelines and streaming applications. Think of it as a highly scalable, fault-tolerant messaging system.

## Core Concepts

### 1. Topics
- A **category/feed** to which messages are published
- Similar to a table in a database or a folder in a filesystem
- Messages in a topic are retained for a configurable period (default 7 days)

### 2. Producers
- Applications that **publish (write)** messages to Kafka topics

### 3. Consumers
- Applications that **subscribe (read)** messages from Kafka topics

### 4. Brokers
- A Kafka server that stores data and serves clients
- A Kafka **cluster** is made up of multiple brokers for fault tolerance

### 5. Partitions
- Each topic is split into **partitions** for parallelism
- Messages within a partition are **ordered**
- Each message gets an incremental ID called an **offset**

### 6. Consumer Groups
- A group of consumers that **cooperatively** consume from a topic
- Each partition is consumed by only one consumer in a group (ensures no duplicate processing)

## Why Kafka?

| Feature | Benefit |
|---------|---------|
| High Throughput | Handles millions of messages/sec |
| Distributed | Scales horizontally across brokers |
| Durable | Data is persisted to disk and replicated |
| Fault Tolerant | Replication ensures no data loss |
| Decoupling | Producers and consumers are independent |

## Simple Flow

```
Producer --> [Topic (Partition 0, 1, 2...)] --> Consumer Group
```

## Common Use Cases
- **Event-driven microservices** — services communicate via events
- **Log aggregation** — collect logs from multiple services
- **Stream processing** — real-time data transformation (with Kafka Streams / Flink)
- **Activity tracking** — user clicks, page views, etc.
- **Data integration** — sync data between systems (CDC with Debezium)

## Key Guarantees
- Messages within a partition are **strictly ordered**
- A message is **committed** only after it's replicated to all in-sync replicas
- Consumers read in order from each partition

## Kafka vs Traditional Message Queues (RabbitMQ, ActiveMQ)
| Kafka | Traditional MQ |
|-------|---------------|
| Pull-based consumers | Push-based |
| Messages retained after consumption | Messages deleted after consumption |
| Designed for high throughput streaming | Designed for task queues |
| Horizontal scaling via partitions | Vertical scaling |
