## Introduction

In the previous chapter we learned how we can use the `direct` exchange and routing keys to route messages to specific queues. As powerful as it is, this method has one major limitation - it allows for routing based on **one** dimension only.

To understand what this means, let's look at a hypothetical example: assume we have a system that tracks the time tables of all flights - domestic and international - in the US. The system receives the schedule of a flight and sends it to multiple consumers using RabbitMQ as the message broker. At first you want to send all domestic flights to one queue and all international flights to another. For this use case you could easily use the `direct` exchange with two bindings - one with `domestic` as the binding key and the other with `international`. However as the system evolves you realize that you want to route the same messages to more queues based on some other dimensions like airport and airline.

One way of doing it would be to publish the message multiple times - each time using a different routing key. Clearly this creates superfluous traffic.  A better way would be to use the `topic` exchange and compound routing keys. Let see how this works.

## Goal

Route messages to specific queues by pattern matching on routing keys.

## Tutorial

Declare a new `topic` exchange:

```
$ rabbitmqadmin declare exchange name=flights type=topic
```

`topic` exchanges allow you to bind queues by pattern matching on routing keys. The structure of a routing key should always be dot delimited words. To use the flights application example above a routing key should look something like this: `international.lax.delta`. When binding queues to the exchange you can either:

### Match on the whole key

```
$ rabbitmqadmin declare queue name=boring
$ rabbitmqadmin declare binding source=flights destination=boring routing_key="international.lax.delta"
```

This kind of binding behaves the same as a standard binding in a `direct` exchange and is not that interesting.

### Substitute parts of the key with '*'

```
$ rabbitmqadmin declare queue name=lax
$ rabbitmqadmin declare binding source=flights destination=lax routing_key="*.lax.*"
```

This binding will ensure that only **LAX** flights are routed to the `lax` queue.

### Substitute parts of the key with '#'

```
$ rabbitmqadmin declare queue name=international
$ rabbitmqadmin declare binding source=flights destination=international routing_key="international.#"
```

This binding will ensure that only **international** flights are routed to the `international` queue. Notice that in contrast to `*`, the `#` character can substitute more than one word, as can be seen in the example above where we substituted the _airport_ and _airline_ sections with `#`.

Like with the `direct` exchange you can bind multiple queues using the same binding key or one queue using multiple binding keys.

## Exercise

1. Bind a new queue (called `lax_delta`) to the `flights` exchange that will receive all Delta flights - domestic and international - that arrive to LAX.
1. Send a message (payload could be anything) that reaches the `lax_delta` queue but **NOT** the `international` queue.

## Recap

`topic` exchanges differ from `direct` exchanges in that you can bind queues using a pattern instead of explicit routing key values, thus allowing multi-dimensional routing of messages.

Next up: [Message Sharding with `x-consistent-hash` Exchange](message-sharding.md)
