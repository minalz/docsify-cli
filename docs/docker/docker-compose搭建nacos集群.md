# ☁️ Docker Compose 搭建 Nacos 集群

> 📦 使用 Docker Compose 一键部署 Nacos 服务注册中心

---

## 📖 参考链接

[Nacos 官方文档 - Docker 快速开始](https://nacos.io/zh-cn/docs/quick-start-docker.html)

---

## 🚀 Docker Compose 配置

> 💡 单机模式配置（适合开发测试环境）

```yaml
version: '3'

services:
  mysqlnacos:
    image: nacos/nacos-mysql:5.7
    container_name: nacos-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: nacos
      MYSQL_USER: nacos
      MYSQL_PASSWORD: nacos
    ports:
      - 3306:3306
    volumes:
      - ./mysql/data/:/var/lib/mysql/
      - ./mysql/my.cnf:/etc/mysql/my.cnf
      
  nacos:
    image: nacos/nacos-server
    container_name: nacos
    restart: always
    depends_on:
      - mysqlnacos
    environment:
      NACOS_AUTH_ENABLE: "true"
      #SPRING_DATASOURCE_PLATFORM: mysql
      MODE: standalone
      NACOS_REPLICAS: 1
      MYSQL_SERVICE_HOST: mysqlnacos
      MYSQL_SERVICE_DB_NAME: nacos
      MYSQL_SERVICE_PORT: 3306
      MYSQL_SERVICE_USER: nacos
      MYSQL_SERVICE_PASSWORD: liubei@2021
      NACOS_APPLICATION_PORT: 8848
      NACOS_SERVER_PORT: 8848
      PREFER_HOST_MODE: hostname
    # volumes:
      # - ./nacos/standalone-logs:/home/nacos/logs
      # - ./nacos/plugins:/home/nacos/plugins
      # - ./nacos/conf:/home/nacos/conf
    ports:
      - "80:8848"
```

---

## 📝 使用说明

### 1️⃣ 创建 docker-compose.yml 文件

将上面的配置保存为 `docker-compose.yml`

### 2️⃣ 启动服务

```bash
docker-compose up -d
```

### 3️⃣ 访问 Nacos 控制台

浏览器访问：`http://localhost:80`

默认账号密码：`nacos/nacos`

---

> 💡 **提示**：生产环境建议使用集群模式，确保高可用性！
