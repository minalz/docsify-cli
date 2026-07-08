# 🐇 Docker 搭建 RabbitMQ

> 📦 快速部署 RabbitMQ 消息队列服务

---

## 🚀 快速开始

### 1️⃣ 拉取镜像

```bash
docker pull rabbitmq
```

### 2️⃣ 创建容器

```bash
docker run -d \
  --name rabbitmq \
  -p 9002:5672 \
  -p 9012:15672 \
  -v `pwd`/data:/usr/local/myapp/rabbitmq \
  --hostname myRabbit \
  -e RABBITMQ_DEFAULT_VHOST=my_vhost \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=adminand123 \
  rabbitmq:latest
```

> 💡 **端口说明**：
> - `5672`：AMQP 协议端口（应用连接）
> - `15672`：管理控制台端口

### 3️⃣ 启用管理插件

```bash
docker exec -it rabbitmq rabbitmq-plugins enable rabbitmq_management
```

---

## 🌐 访问管理控制台

浏览器访问：`http://localhost:9012`

**默认账号：**
- 用户名：`admin`
- 密码：`adminand123`

---

## 📝 配置说明

| 参数 | 说明 |
|:---|:---|
| `--hostname` | 设置容器主机名 |
| `RABBITMQ_DEFAULT_VHOST` | 默认虚拟主机 |
| `RABBITMQ_DEFAULT_USER` | 默认用户名 |
| `RABBITMQ_DEFAULT_PASS` | 默认密码 |
| `-v` | 数据持久化挂载 |

---

> 💡 **提示**：RabbitMQ 是一款开源的消息代理软件，支持多种消息协议，广泛应用于分布式系统中！
