# RabbitMQ Training Program

Work through the curriculum and thou shall be a RabbitMQ master!

## Curriculum

1. [Setup](setup.md)
1. [The Basics: Queues and Exchanges](basics.md):
    1. Declare a queue
    1. Publish a message
    1. Consume message
1. [Implementing PubSub with RabbitMQ](pubsub.md):
    1. Declare a `fanout` exchange
    1. Declare a queue `foo`
    1. Declare a queue `bar`
    1. Bind `foo` and `bar` to the exchange
    1. Publish a message - this time from the UI!
1. [Basic Routing](basicrouting.md)
1. Advanced Routing
1. Message sharding with `x-consistent-hash` exchange
1. Decoupling producers from consumers with exchange to exchange bindings
1. Message Persistence 
1. Consumers Behavior
    1. Acks
    1. Prefetch
1. Administration
    1. Filtering queues and exchanges
    1. Inspecting bindings
    1. Shoveling queues
    1. Purging queues
    1. Looking at metrics

