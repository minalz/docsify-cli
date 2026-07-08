# 📦 Docker 安装指南

> 🚀 在 Linux 系统上安装 Docker 的完整教程

---

## 📖 1. 卸载之前的 Docker

> 💡 如果系统已安装旧版本，需要先卸载

```sh
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

> ⚠️ 如果是已经安装过一次 Docker 的，用下面的方式卸载

```shell
[root@minalz101 ~]# rpm -qa |grep docker
docker-compose-plugin-2.20.2-1.el7.x86_64
docker-ce-rootless-extras-24.0.5-1.el7.x86_64
docker-buildx-plugin-0.11.2-1.el7.x86_64
docker-ce-cli-24.0.5-1.el7.x86_64
docker-ce-24.0.5-1.el7.x86_64
```

```shell
sudo yum remove docker \
        docker-compose-plugin-2.20.2-1.el7.x86_64 \
        docker-ce-rootless-extras-24.0.5-1.el7.x86_64 \
        docker-buildx-plugin-0.11.2-1.el7.x86_64 \
        docker-ce-cli-24.0.5-1.el7.x86_64 \
        docker-ce-24.0.5-1.el7.x86_64
        
rm -rf /var/lib/docker 
```

参考链接：[CentOS 卸载 Docker](https://blog.csdn.net/Zhousan0125/article/details/130574769)

---

## 🔧 2. 安装必要的依赖

```sh
sudo yum install -y yum-utils \
    device-mapper-persistent-data \
    lvm2
```

---

## 📚 3. 设置 Docker 仓库

```sh
sudo yum-config-manager \
      --add-repo \
      https://download.docker.com/linux/centos/docker-ce.repo
```

如果添加错了仓库，可以用下面的方式修改（因为上面的命令再执行一遍也不会覆盖）：

参考链接：[修改 Docker 仓库](https://blog.csdn.net/m0_47333020/article/details/108738569)

---

## 📥 4. 安装 Docker

```sh
sudo yum install -y docker-ce docker-ce-cli containerd.io
```

---

## 🚀 5. 启动 Docker

```sh
# 启动docker
sudo systemctl start docker

# 开启自启动
sudo systemctl enable docker
```

---

## 🌐 6. 添加镜像加速器（阿里云）

> 💡 使用自己的阿里云账号登录，查看菜单栏左下角的镜像加速器

参考链接：[阿里云镜像加速器](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)

---

## ✅ 7. 测试 Docker 安装是否成功

```sh
sudo docker run hello-world
```

出现如下提示说明安装成功！✅

```sh
Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.
```

---

## 🧪 8. 测试创建 Tomcat

```sh
docker pull tomcat
docker run -d --name my-tomcat -p 9090:8080 tomcat
```

> 💡 如果浏览器访问时 404，那是因为 Tomcat 9+ 版本中，容器中有一个 `webapps` 是空的，还有一个 `webapps.dist`

```sh
# 解决 Tomcat 404 问题
docker exec -it my-tomcat bash
cp -r webapps.dist/* ./webapps
rm -rf webapps.dist/
# 再次访问就成功了
```

---

## 🗄️ 9. 测试创建 MySQL

```sh
docker run -d --name my-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=test123 --privileged mysql
```

---

## 🐚 10. 进入容器

```sh
docker exec -it containerid /bin/bash
```

---

## 💡 11. 常见问题

### ❓ docker pull 在哪拉取的镜像？

> 默认是在 `hub.docker.com`

### ❓ docker pull tomcat 拉取的版本是？

> 默认是最新的版本，可以在后面指定版本 `:`，比如 `node:10-alpine`

### 📝 常用命令速查

```bash
docker pull        # 拉取镜像到本地
docker run         # 根据某个镜像创建容器
-d                 # 让容器在后台运行，其实就是一个进程
--name             # 给容器指定一个名字
-p                 # 将容器的端口映射到宿主机的端口
docker exec -it    # 进入到某个容器中并交互式运行，最后要加一个 bash
```
