## Introduction

Sharding is a concept from the database realm which talks about the way data is partitioned (i.e. distributed) across different nodes of the database. One of the more common strategies for sharding is called [Consistent Hashing](http://www.martinbroadhurst.com/Consistent-Hash-Ring.html). While consistent hashing is a fascinating topic by itself we will try to avoid explaining it in depth. In the context of RabbitMQ it's important to understand that you can use a special exchange type called `x-consistent-hash` to make sure that messages with the same routing key **consistently** reach the same queue, even when new queues are bound to the exchange or existing queues are unbound from it. So "shards" in the context of RabbitMQ are actually queues (in this chapter we will use the two words - "shard" and "queue" interchangeably).

One interesting use case for using the `x-consistent-hash` exchange it maintaining the order of messages associated with a `dynamic property` of those messages. For example, we can use this exchange to make sure that all messages associated with the same bank account number reach the same queue in their original order (ordering here being a native property of queues not the exchange itself). Since bank account numbers are dynamic in nature we can't easily use the `direct` or `topic` exchanges to handle this use case.

## Goal

Use the `x-consistent-hash` exchange to consistently route messages to queues.

## Tutorial

To start using the `x-consistent-hash` exchange we need to first enable it in RabbitMQ:

```
docker exec rabbitmq rabbitmq-plugins enable rabbitmq_consistent_hash_exchange
```

Now let's declare the exchange:

```
$ rabbitmqadmin declare exchange name=transactions type=x-consistent-hash
```

And bind some queues to it:

```
$ rabbitmqadmin declare queue name=shard-1
$ rabbitmqadmin declare queue name=shard-2
$ rabbitmqadmin declare binding source=transactions destination=shard-1 routing_key=100
$ rabbitmqadmin declare binding source=transactions destination=shard-2 routing_key=100
```

Notice that strange routing key associated with each queue:
1. Both queues use the same routing key to bind to the exchange
1. It's a number. WAT?
Back in the introduction we mentioned that this exchange needs to support routing keys with dynamic values, which means it doesn't make sense to use a static routing key in the first place. So why put a routing key to begin with and why is it a number? Because it allows the user to control the size of each shard. If we want to make all the shards **even** - i.e. make sure that 50% of the routing keys go to `shard-1` and the rest to `shard-2` - then we should assign both of them the same routing key number. If, on the other hand, we want `shard-2` to receive twice as many routing keys as `shard-1`, then `shard-2`'s routing key should be x2 relative to `shard-1`'s routing key, for example:

```
... destination=shard-1 routing_key=100
... destination=shard-2 routing_key=200
```

To put it differently, the numbers in the routing key parameter dictate the size (or weight) of the shards.

**Important Note:** when giving even weights to all shards, it's important to remember that the `x-consistent-hash` exchange distributes **routing keys** across shards, not messages. So if all messages have the same routing key, they will all go to the same queue. The only way to guarantee an even distribution of messages would be to assign a random routing key for each message.  

## Exercise

1. Send 10 messages with the same routing key. Use the management console to verify that all messages went to the same queue.
1. Send 10 messages with 10 different routing keys. Use the management console to check their distribution.

## Optional Reading
[X-Consistent-Hash Exchange Documentation](https://github.com/rabbitmq/rabbitmq-consistent-hash-exchange)

## Recap

Use the `x-consistent-hash` exchange when you want to make sure that all messages with the same routing key will be delivered to the same queue, and you have no way of knowing in advance the value of all routing keys (and honestly - you don't care to know). This exchange uses the Consistent Hash algorithm, making it very efficient when queues are often added or removed.

Next up: [Exchange to Exchange (e2e) Bindings](e2e.md)
