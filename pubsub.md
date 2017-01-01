## Introduction

You might have heard about the Pub/Sub design pattern before, but if you haven't please read [this article](https://abdulapopoola.com/2013/03/12/design-patterns-pub-sub-explained/) first. 

Messaging brokers like RabbitMQ are very suited for implementing a Pub/Sub design between different systems. In this section we're going to implement a very simple Pub/Sub on top of RabbitMQ by using the `fanout` exchange type.

Wait...what? No one told me that exchanges can have types! Well.. they can. In fact every exchange belongs to one type or another. Exchange types differ from one another in the way they route messages to queues. In the previous section we used the default exchange which is a `direct` exchange. We'll get back to `direct` exchanges in the next section, but for now, let's focus on the `fanout` exchange.

## Goal

Implement a Pub/Sub using a `fanout` exchange

## Instructions

Declare a new exchange:

```
$ rabbitmqadmin declare exchange name=pubsub type=fanout
```

Now let's verify that our exchange is actually there:

```
rabbitmqadmin list exchanges name
```

Our new `pubsub` exchange should be listed. We can also see it in the [UI](http://localhost:15672/#/exchanges):

![Exchanges](/images/pubsub/mgmt-1.png)  

Right now publishing a message to the exchange will do nothing, because no queues are _bound_ to it. In order to get messages into queues we need to bind them to the relevant exchange. Let's see how it's done.

Declare a two new queues:

```
$ rabbitmqadmin declare queue name=sub_1
$ rabbitmqadmin declare queue name=sub_2
```

Now let's bind them to the `pubsub` exchange by declaring new *Bindings*:

```
$ rabbitmqadmin declare binding source=pubsub destination=sub_1
$ rabbitmqadmin declare binding source=pubsub destination=sub_2
```

Like with queues and exchanges you can also list bindings:

```
$ rabbitmqadmin list bindings
```

If everything want OK, you should be able to see the new bindings in the output list. Bindings can also be viewed in the Admin UI:

Go to the [exchanges](http://localhost:15672/#/exchanges) page and select the `pubsub` exchange. Now expend the Bindings section (if it's not already expanded):

![Bindings](/images/pubsub/mgmt-2.png)  

Now for that last and most exciting part - let's publish a message to our `pubsub` exchange and see what happenes:

```
$ rabbitmqadmin publish exchange=pubsub routing_key="" payload="I'm spam!"
```

Navigate back to [Admin UI > Queues](http://localhost:15672/#/queues) tab. Notice that `sub_1` and `sub_2` each have 1 message in _Ready_ state.

![Ready](/images/pubsub/mgmt-3.png)
You can now consume those messages (see [basics](basics.md)) and see that they're actually the same message!

What happened is that we **published** a message to the `pubsub` exchange and it was automatically distributed to all queues that are **subscribed** (or bound) to it. 

***Note***: You might have noticed that the `routing_key` passed to the publish command above is empty. This makes sense since we really just want the message to reach all subscribers when implementing a PubSub. So why did we have to pass it in the first place? Because the [AMQP protocol](https://www.rabbitmq.com/resources/specs/amqp0-9-1.pdf) - which is the communication protocol used by RabbitMQ - says we have too. In effect the `fanout` exchange will just ignore it.

## Recap

The PubSub design pattern can be implemented in RabbitMQ by binding multiple queues to a `fanout` exchange. Every message published to that exchange will be sent to all queues bound to it.

Next up: [Basic Routing](basicrouting.md)
