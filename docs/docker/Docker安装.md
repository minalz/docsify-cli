# Docker安装

## 1.卸载之前的docker

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

## 2.安装必要的依赖

```sh
sudo yum install -y yum-utils \
    device-mapper-persistent-data \
    lvm2
```

## 3.设置docker仓库

```sh
sudo yum-config-manager \
      --add-repo \
      https://download.docker.com/linux/centos/docker-ce.repo
```

如果添加错了，用下面的链接修改(因为上面的命令再执行一遍也不会覆盖，是没用的)：

参考链接：https://blog.csdn.net/m0_47333020/article/details/108738569

## 4.安装docker

```sh
sudo yum install -y docker-ce docker-ce-cli containerd.io
```

## 5.启动docker

```sh
sudo systemctl start docker
```

## 6.添加镜像加速器，这里用的是阿里云

使用自己的阿里云账号登录，查看菜单栏左下角，发现有一个镜像加速器:

参考链接：https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors]

## 7.测试docker安装是否成功

```sh
sudo docker run hello-world
```

出现如下提示 说明成功了

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

## 8.测试创建Tomcat

```sh
docker pull tomcat
docker run -d --name my-tomcat -p 9090:8080 tomcat
```

## 9.测试创建MySQL

```sh
docker run -d --name my-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=test123 --privileged mysql
```

## 10.进入到容器里面

```sh
docker exec -it containerid /bin/bash
```

## 11.其他

+ docker pull在哪拉取的镜像？

  默认是在`hub.docker.com`

+ docker pull tomcat拉取的版本是？

  默认是最新的版本，可以在后面指定版本`:`,比如node: 10-alpine

+ 命令

  ```sh
  docker pull        拉取镜像到本地
  docker run         根据某个镜像创建容器
  -d                 让容器在后台运行，其实就是一个进程
  --name             给容器指定一个名字
  -p                 将容器的端口映射到宿主机的端口
  docker exec -it    进入到某个容器中并交互式运行 最后要加一个bash
  ```

  