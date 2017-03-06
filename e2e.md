## Introduction

Binding queues to exchanges is the most common topology model one can create with RabbitMQ, and the most appropriate in case there's just one application which consumes messages. However this model breaks as soon as we have multiple applications consuming the same messages, where each application requires a different distribution model for its queues.

Let's use an example to clarify this point: say we have a blogging platform that performs two operations whenever a new post gets published:

1. The title of the post is being sent in realtime to all subscribers (web/mobile clients) of that blog.
1. The title of the post is being sent to the appropriate indexing service, according to the post's category.

Here's an illustration of our wonderful blogging platform:

![Initial](/images/e2e/initial.jpg)

In this example, while the message content is identical - i.e. the title of the blog - the consumption model of each application is different. In the first case (realtime updates), we want the message to reach **all** web servers, so they in turn can update all connected clients. For this use case we would probably choose the `fanout` exchange. In the second case however, we want the message to reach only the queues that are being consumed by the relevant indexer. For this use case we would probably choose the `direct` or `topic` exchanges.

How can we change the diagram above to support both use cases?

### Publishing to Multiple Exchanges

One way of solving this is publishing the same message to two different exchanges - a `direct` exchange to serve the indexing service and a `fanout` exchange to serve the web servers. This is how it would look like:

![Initial](/images/e2e/double-publish.jpg)

While this is a very straightforward and simple solution, it does have a few shortcomings:

1. For every new consumer of we would need to configure - in the **producer application** - a new exchange, instead of configuring the exchange just on the consumer side. This also means that any changes to the consumer exchanges (e.g. name) need to happen in two places.
1. What should happen if the producer successfully publishes a message to one exchange, but fails on the second? Try to think about this for a minute and you'd realize that this opens a pandora box.

The points above illustrate to what extent the producer application becomes "aware" of its consumers. This is called in software engineering ['strong coupling'](https://en.wikipedia.org/wiki/Coupling_(computer_programming)), which is considered bad practice in most cases. In fact systems like RabbitMQ help break strongly coupled subsystems into loosely coupled subsystems, so it feel awkward that RabbitMQ won't give us a solution for this issue.

### Exchange-to-Exchange Bindings

As a matter of fact, RabbitMQ does offer a solution known as Exchange-to-Exchange bindings (a.k.a e2e bindings). As the name suggests, e2e bindings allow RabbitMQ users to create bindings between exchanges (instead of bindings queues to exchanges). With this solution we could completely decouple between producer exchanges and consumer exchanges, allowing us to create rich and complex topologies.

To go back to our blogging platform, we could choose the following architecture:

![E2E](/images/e2e/e2e.jpg)

This might look more complex, but in fact solves the two issues we mentioned above:

1. The producer application now needs to know only one exchange (the one on the left). We can add as many consumer application as we want, and just bind their exchanges to the original exchange.
1. We allow RabbitMQ to handle all the nitty gritty around message delivery reliability.

## Tutorial

Let's see e2e bindings in action. We will start by declaring an exchange to serve the producer application:

```
$ rabbitmqadmin declare exchange name=new-posts type=fanout
```

Declare two new exchanges - one for the indexing service and another for the web service:

```
$ rabbitmqadmin declare exchange name=indexing type=direct
$ rabbitmqadmin declare exchange name=web type=fanout
```

Declare some queues and bind them to each exchange:

```
# Indexing service
$ rabbitmqadmin declare queue name=sports
$ rabbitmqadmin declare binding source=indexing destination=sports routing_key="sports"
$ rabbitmqadmin declare queue name=music
$ rabbitmqadmin declare binding source=indexing destination=music routing_key="music"

# Web service
$ rabbitmqadmin declare queue name=webserver-1
$ rabbitmqadmin declare binding source=web destination=webserver-1 routing_key=""
$ rabbitmqadmin declare queue name=webserver-2
$ rabbitmqadmin declare binding source=web destination=webserver-2 routing_key=""
```

So far we've done nothing unusual right? Declaring exchanges and queues and bindings. Old school! Notice though that publishing messages to the `new-posts` exchange will go to _/dev/null_, since no queues (or exchanges) are bound to it yet. Let's do it then:

```
$ rabbitmqadmin declare binding source=new-posts destination=indexing destination_type=exchange routing_key=""
$ rabbitmqadmin declare binding source=new-posts destination=web destination_type=exchange routing_key=""
```

Notable is the `destination_type` parameter which has to include the value `exchange` when declaring e2e bindings. The reason is simple - how else will RabbitMQ know if the binding is meant for a queue or an exchange?

Also notice that the `routing_key` parameter is an empty string. This is no different than binding queues to a `fanout` exchange. If `new-posts` was a `direct` or `topic` exchange, you could use routing keys to route messages between exchanges the same way you do with queues.

## Exercise

1. Send a message so it reaches all `webserver-*` queues, but not any of the `indexing` queues.
1. Send a message that reaches the `music` queue. Did it also reach the `webserver-*` queues? Why?
1. Recreate the `new-posts` exchange in a way that will allow you to prevent messages from reaching the `webserver-*` queues while reaching the `indexing` queues.

## Recap

Exchange-to-Exchange (e2e) bindings are very useful when we need to create complex topologies in RabbitMQ and decouple producers from consumers, especially when we need to support more than one consumer and the consumption model is inherently different.

Next up: [Message Persistence](persistence.md)
