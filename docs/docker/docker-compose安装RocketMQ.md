# 🚀 Docker Compose 安装 RocketMQ

> 📦 使用 Docker Compose 快速部署 RocketMQ 消息队列

---

## 📖 参考链接

[RocketMQ Docker Compose 部署教程](https://blog.csdn.net/weixin_42979871/article/details/104382458)

---

## 🎼 Docker Compose 配置

```yaml
version: '3.5'
services:
  rmqnamesrv:
    image: foxiswho/rocketmq:server
    container_name: rmqnamesrv
    ports:
      - 9876:9876
    volumes:
      - ./data/logs:/opt/logs
      - ./data/store:/opt/store
    networks:
        rmq:
          aliases:
            - rmqnamesrv

  rmqbroker:
    image: foxiswho/rocketmq:broker
    container_name: rmqbroker
    ports:
      - 10909:10909
      - 10911:10911
    volumes:
      - ./data/logs:/opt/logs
      - ./data/store:/opt/store
      - ./data/brokerconf/broker.conf:/etc/rocketmq/broker.conf
    environment:
        NAMESRV_ADDR: "rmqnamesrv:9876"
        JAVA_OPTS: " -Duser.home=/opt"
        JAVA_OPT_EXT: "-server -Xms128m -Xmx128m -Xmn128m"
    command: mqbroker -c /etc/rocketmq/broker.conf
    depends_on:
      - rmqnamesrv
    networks:
      rmq:
        aliases:
          - rmqbroker

  rmqconsole:
    image: styletang/rocketmq-console-ng
    container_name: rmqconsole
    ports:
      - 8080:8080
    environment:
        JAVA_OPTS: "-Drocketmq.namesrv.addr=rmqnamesrv:9876 -Dcom.rocketmq.sendMessageWithVIPChannel=false"
    depends_on:
      - rmqnamesrv
    networks:
      rmq:
        aliases:
          - rmqconsole

networks:
  rmq:
    name: rmq
    driver: bridge
```

---

## 📝 服务说明

### 🏷️ 组件说明

| 服务 | 端口 | 说明 |
|:---|:---|:---|
| `rmqnamesrv` | 9876 | NameServer 服务 |
| `rmqbroker` | 10909, 10911 | Broker 服务 |
| `rmqconsole` | 8080 | 控制台 |

### 🚀 启动步骤

#### 1️⃣ 创建配置文件

将上面的配置保存为 `docker-compose.yml`

#### 2️⃣ 创建 Broker 配置文件

创建 `./data/brokerconf/broker.conf` 文件

#### 3️⃣ 启动服务

```bash
docker-compose up -d
```

#### 4️⃣ 访问控制台

浏览器访问：`http://localhost:8080`

---

> 💡 **提示**：RocketMQ 是一款高性能、低延迟的分布式消息中间件，适合大规模分布式系统！
