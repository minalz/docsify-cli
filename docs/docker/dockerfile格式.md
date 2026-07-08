# 📝 Dockerfile 格式指南

> 📦 Dockerfile 常用模板与编写规范

---

## ☕ Java JAR 包启动

### Dockerfile 示例

```dockerfile
FROM openjdk:8
MAINTAINER 作者名称
LABEL name="dockerfile-demo" version="1.0" author="作者名称"
COPY dockerfile-demo-0.0.1-SNAPSHOT.jar dockerfile-image.jar
CMD ["java", "-jar", "dockerfile-image.jar"]
```

### 📝 指令说明

| 指令 | 说明 |
|:---|:---|
| `FROM` | 指定基础镜像 |
| `MAINTAINER` | 维护者信息 |
| `LABEL` | 镜像元数据（名称、版本、作者） |
| `COPY` | 复制 JAR 包到镜像中 |
| `CMD` | 容器启动时执行的命令 |

---

## 📚 Docsify 项目

### Dockerfile 示例

```dockerfile
FROM node:10-alpine
COPY . /docs/
WORKDIR /docs
RUN npm i docsify-cli -g --registry=https://registry.npm.taobao.org
EXPOSE 3000/tcp
ENTRYPOINT ["docsify", "serve", "."]
```

### 📝 指令说明

| 指令 | 说明 |
|:---|:---|
| `FROM` | 使用 Node.js 轻量级镜像 |
| `COPY` | 复制项目文件到 `/docs/` 目录 |
| `WORKDIR` | 设置工作目录 |
| `RUN` | 安装 docsify-cli（使用淘宝镜像源） |
| `EXPOSE` | 暴露 3000 端口 |
| `ENTRYPOINT` | 容器启动时执行 docsify serve |

---

## 💡 Dockerfile 编写最佳实践

### 1️⃣ 使用官方基础镜像

```dockerfile
# ✅ 推荐
FROM openjdk:8
FROM node:10-alpine

# ❌ 不推荐
FROM ubuntu
```

### 2️⃣ 合理使用缓存

```dockerfile
# ✅ 先复制依赖文件，利用缓存
COPY package.json ./
RUN npm install
COPY . .

# ❌ 每次都会重新安装依赖
COPY . .
RUN npm install
```

### 3️⃣ 使用多阶段构建

```dockerfile
# 构建阶段
FROM maven:3.8 AS build
COPY . .
RUN mvn clean package

# 运行阶段
FROM openjdk:8
COPY --from=build /target/*.jar app.jar
CMD ["java", "-jar", "app.jar"]
```

### 4️⃣ 减少镜像体积

```dockerfile
# ✅ 使用 Alpine 版本
FROM node:10-alpine

# ✅ 清理缓存
RUN apt-get update && apt-get install -y \
    package1 \
    package2 \
    && rm -rf /var/lib/apt/lists/*
```

---

## 🔧 常用命令速查

| 命令 | 说明 |
|:---|:---|
| `FROM` | 指定基础镜像 |
| `RUN` | 构建时执行的命令 |
| `CMD` | 容器启动时的默认命令 |
| `ENTRYPOINT` | 容器启动时的入口程序 |
| `COPY` | 复制文件到镜像 |
| `ADD` | 复制文件（支持 URL 和自动解压） |
| `WORKDIR` | 设置工作目录 |
| `EXPOSE` | 声明暴露的端口 |
| `ENV` | 设置环境变量 |
| `LABEL` | 添加元数据 |
| `VOLUME` | 创建挂载点 |
| `USER` | 指定运行用户 |

---

> 💡 **提示**：Dockerfile 是构建 Docker 镜像的蓝图，编写良好的 Dockerfile 可以让镜像更小、更快、更安全！
