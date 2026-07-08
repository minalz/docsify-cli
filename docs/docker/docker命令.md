# 🔧 Docker 命令速查

> 📝 Docker 常用命令汇总与使用指南

---

## 📦 1. 根据镜像创建容器

```sh
docker run -d --name my-tomcat -p 9090:8080 tomcat
```

---

## 🔍 2. 查看运行中的容器

```sh
docker ps
```

---

## 📋 3. 查看所有容器（包含已退出的）

```sh
docker ps -a
```

---

## 🗑️ 4. 删除容器

```sh
# 删除单个容器
docker rm containerid

# 删除所有容器
docker rm -f $(docker ps -a)

# 删除单个镜像
docker rmi redis

# 强制删除镜像（针对基于镜像有运行的容器进程）
docker rmi -f redis

# 删除多个镜像
docker rmi -f redis tomcat nginx

# 删除本地全部镜像
docker rmi -f $(docker images -q)
```

---

## 🐚 5. 进入容器

```bash
# 方式一：推荐
docker exec -it 容器id bash

# 方式二
docker attach 容器id bash
```

> 💡 **区别说明**：
> - `exec`：进入容器后，开启一个新的终端，可以在里面操作
> - `attach`：进入容器正在执行的终端，不会启动新的终端进程

### 其他进入容器的方式

```bash
# 使用 run 方式在创建时进入
docker run -it centos /bin/bash

# 关闭容器并退出
exit

# 仅退出容器，不关闭
快捷键：Ctrl + P + Q
```

---

## 📸 6. 根据容器生成镜像

```sh
docker commit my-centos new-centos-image
```

---

## 📜 7. 查看容器日志

```sh
# 查看容器日志
docker logs container

# 查看 RabbitMQ 容器日志（默认参数）
docker logs rabbitmq

# 查看 Redis 容器日志，带参数
# -f: 跟踪日志输出
# -t: 显示时间戳
# --tail: 仅列出最新 N 条容器日志
docker logs -f -t --tail=20 redis

# 查看从指定时间后的日志
docker logs --since="2021-08-10" --tail=10 redis
```

---

## 📊 8. 查看容器资源使用情况

```sh
docker stats
```

---

## 🔎 9. 查看容器详情信息

```sh
docker inspect container
```

---

## ⏯️ 10. 停止/启动容器

```sh
# 停止容器
docker stop container

# 启动容器
docker start container
```

---

## 📤 11. 从容器下载文件到本机

```shell
# docker cp 容器id:容器内路径 目的主机路径
docker cp containerid:path <path>
```

---

## 📥 12. 从本机上传文件到容器

```shell
# docker cp 本地路径 容器id:容器内路径
docker cp <path> containerid:path
```

---

## 🔐 13. Docker Login 脚本登录

### ❌ 明文登录（不安全）

```shell
docker login -u [镜像库账户名] [镜像库] -p [密码]
```

### ✅ 通过 STDIN 输入密码（推荐）

> 查看指令时看不到密码，更加安全

```shell
cat pwd.txt | docker login -u [镜像库账户名] [镜像库] --password-stdin
```

---

> 💡 **提示**：掌握这些常用命令，能够让你更高效地使用 Docker 进行容器化管理！
