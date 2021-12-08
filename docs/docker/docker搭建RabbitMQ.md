```dockerfile
# 先拉取镜像
docker pull rabbitmq
# 创建容器
docker run -d --name rabbitmq -p 9002:5672 -p 9012:15672 -v `pwd`/data:/usr/local/myapp/rabbitmq --hostname myRabbit -e RABBITMQ_DEFAULT_VHOST=my_vhost  -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=adminand123 rabbitmq:latest
# 进入容器内部
docker exec -it rabbitmq rabbitmq-plugins enable rabbitmq_management
```