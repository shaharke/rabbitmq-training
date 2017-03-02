## The Basics: Queues and Exchanges

### Goal

Publishing your first message with RabbitMQ and consuming it via the CLI!

### Tutorial

Create a new queue called `hello`:

```
$ rabbitmqadmin declare queue name=hello
```

Queues are just buffers that get filled with messages. Messages are either stored on a queue or not at all! Let's send our first message:

```
$ rabbitmqadmin publish exchange=amq.default routing_key=hello payload="hello, world"
```

Messages cannot be sent directly to queues. Messages get into queues through exchanges. In this case we've published a message to the **default exchange**. The default exchange is implicitly bound to every queue, with a routing key equal to the queue name. We'll come back to bindings later.

Let's take a look in the management console:

Browse to [http://localhost:15672/#/queues](http://localhost:15672/#/queues). You should see something like this:  
![Queues](/images/basics/mgmt-1.png)  

If the ready counter is 0, then something went wrong :(.

### GOAL

Consuming messages in different ways. The methods illustrated below are relevant only for debugging purposes.

### Tutorial

Let's start by inspecting the message we sent through the management console:


* Browse to http://localhost:15672/#/queues/%2F/hello or just click on the queue name if you haven't left the previous screen.
* Click on the **Get Messages** tab   
![Get Messages Tab](/images/basics/mgmt-2.png)  

* Now click on the **Get Message(s)** button
![Get Messages Button](/images/basics/mgmt-3.png)  

Yes! That's our message!

Notice that the **Requeue** option is set to **Yes**. That means that the message will return back to the queue after we get it. In production messages won't normally return to queue, but for debugging that's perfect.

Now let's use the Admin CLI to read the message:

```
$ rabbitmqadmin get queue=hello requeue=false
```

This time we opted not to requeue the message. Going back to the mgmt. console you should see that the `hello` queue is empty. You can also use the CLI:

```
$ rabbitmqadmin list queues name messages_ready
```

That last two parameters are the names of the columns that you want the CLI to print out when listing the queues. In this case we just wanted to see the queue name and number of messages in ready state.

Feel free to play with the `list queues` command for a while. This might come in handy one day!

Next up: [Implementing PubSub with RabbitMQ](pubsub.md)
