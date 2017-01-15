## Setup

### Spin a Docker image

To make thing easy we're going to use a Docker image that runs the RabbitMQ broker. This way you won't need to install RabbitMQ on your machine. If you're not familiar with Docker you can read more about it [here](https://www.docker.com), although it's really not necessary for this training. However, in order to run the following commands you do need to have [Docker](https://www.docker.com/products/overview) installed on your workstation.

```
$ docker pull rabbitmq
$ docker run -p 5672:5672 -p 15672:15672 -d --name rabbitmq rabbitmq
$ docker exec rabbitmq rabbitmq-plugins enable rabbitmq_management
```

Browse to [http://localhost:15672/](http://localhost:15672) and login into the management console:  
User: **guest**  
Password: **guest**

### Download RabbitMQ Admin CLI

```
$ curl http://localhost:15672/cli/rabbitmqadmin > /usr/local/bin/rabbitmqadmin
$ chmod +x /usr/local/bin/rabbitmqadmin

# Check that it works:
$ rabbitmqadmin list exchanges 
```

Next up: [The Basics: Queues and Exchanges](basics.md)
