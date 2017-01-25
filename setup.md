## Setup

### Spin a Docker image

Needless to say - you need to have [Docker](https://www.docker.com/products/overview) installed on your workstation.

```
$ docker pull rabbitmq
$ docker run -p 5672:5672 -p 15672:15672 -d --name rabbitmq rabbitmq
$ docker exec rabbitmq rabbitmq-plugins enable rabbitmq_management
```
In order to check your docker container's status:
```
$ docker ps -a
```
In case you allready installed the docker container, and for some reason it's down (status = 'Exited' or any other reason),run the next command:
```
docker start rabbitmq
```
Check again your container status, and you are ready to go. 

Browse to [http://localhost:15672/](http://localhost:15672) and login into the management console:  
User: **guest**  
Password: **guest**

### Download RabbitMQ Admin CLI

```
$ curl http://localhost:15672/cli/rabbitmqadmin -o /usr/local/bin/rabbimqadmin
$ chmod +x /usr/local/bin/rabbitmqadmin

# Check that it works:
$ rabbitmqadmin list exchanges 
```

Next up: [The Basics: Queues and Exchanges](basics.md)
