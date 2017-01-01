## Setup

### Spin a Docker image

Needless to say - you need to have [Docker](https://www.docker.com/products/overview) installed on your workstation.

```
$ docker pull rabbitmq
$ docker run -p 5672:5672 -p 15672:15672 -d --name rabbitmq rabbitmq
$ docker exec rabbitmq rabbitmq-plugins enable rabbitmq_management
```

Browse to [http://localhost:15672/](http://localhost:15672) and login into the management console:  
User: **guest**  
Password: **guest**

### Download RabbitMQ Admin CLI

Open http://localhost:15672/cli/rabbitmqadmin  
Save the output to `/usr/local/bin/rabbitmqadmin`  
Check that it works: `rabbitmqadmin list exchanges` 

Next up: [The Basics: Queues and Exchanges](basics.md)
