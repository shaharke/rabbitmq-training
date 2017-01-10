## Introduction

PubSubs are pretty useful when you want to blindly distribute messages sent to the same exchange across all queues. Sometimes however you require a more granular control over which message is sent to which queue. In this section you'll learn to route messages to specific queues by using the `direct` exchange type and routing keys.

## Goal

Route messages to specific queues using a routing key

## Instrcutions

Declare a new `direct` exchange:

```
$ rabbitmqadmin declare exchange name=morpheus type=direct
```

`direct` exchanges allow you to bind queues to a specific key (AKA `routing key`) and then route messages to the relevant queue according to the key supplied by the producer. Let's see it in action.

Declare two new queues:

```
$ rabbitmqadmin declare queue name=blue
$ rabbitmqadmin declare queue name=red
```

Next we're going to bind the `blue` queue to receive only messages that are associated with the `steak` routing key; the `red` queue will receive only messages that are associated with the `matrix` routing key.

```
$ rabbitmqadmin declare binding source=morpheus destination=blue routing_key=steak
$ rabbitmqadmin declare binding source=morpheus destination=red routing_key=matrix
```

We can see the new bindings with the routing keys we configured in the Admin console:

![Bindings](/images/basic_routing/mgmt-1.png)

If your `morpheus` exchange bindings look like the ones in the above screenshot, you're hunky dory. Let's publish some messages!

In contrast to the `fanout` exchange we're required to provide a relevant routing key - one that is associated with an existing binding.  

```
$ rabbitmqadmin publish exchange=morpheus routing_key="steak" payload='I want to remain ignorant!'
$ rabbitmqadmin publish exchange=morpheus routing_key="matrix" payload='I want to see the light!'
$ rabbitmqadmin publish exchange=morpheus routing_key="neo" payload='going nowhere!'
```

We can observe two things here:  

1. The first two messages were published with no special warnings. The Admin CLI returns the following message: "Message published". The last message, on the other hand, returns a slightly different message: "Message published but NOT routed".  
1. Going to the [queues](http://localhost:15672/#/queues) screen will show that only two messages are now waiting in the `blue` and `red` queues - one in each queue.

What happened to the last message? Well... the routing key that was used was never declared on any binding, so the exchange doesn't know what to do with it and practically throws it away. That's why we also got a warning from the CLI.

__Exercise:__ try to retrieve the messages from the queues and validate that the right message got to the right queue (according to its routing key).

### One key; Many queues

Is it possible to bind multiple queues with the same routing key? Yes! Try it out:

1. Create a new queue called `blue-2`
1. Bind `blue-2` to the `morpheus` exchange using `steak` as routing key.
1. Publish another message when specifying `steak` as routing key.

The message should be replicated to both `blue` and `blue-2`. Checkout the Admin UI if you don't believe me!

### One queue; Many keys

It's also quite possible to bind one queue using multiple routing keys. Just run the `declare binding` command multiple times - each time with a different key:

```
$ rabbitmqadmin declare binding source=morpheus destination=blue routing_key=steak
$ rabbitmqadmin declare binding source=morpheus destination=blue routing_key=wine
```

A much more relevant example can be found in the official [tutorial](https://www.rabbitmq.com/tutorials/tutorial-four-python.html). Here's a nice screenshot:

![Log Levels](/images/basic_routing/tutorial-1.png)

## Recap

This is all you need to know to build a messaging infrastructure where you have a fine-grained control over which message goes to which queue. Using the `direct` exchange is particularly useful when the classification of messages to destinations (e.g. queues) is mostly static, and when the number of routing keys is relatively small. Unfortunately, that's not always the case. In later sections we'll learn about more advanced ways for routing messages.

Next up: [Multi-dimensional Routing with Topics](topics.md)
