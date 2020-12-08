# Docker-compose的安装

## 1. 官方链接：

https://docs.docker.com/compose/install/

## 2.官方源：

不推荐使用官方源，因为国内速度会特别慢

```sh
sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

如果上面指令安装了，最好是删除后再换源下载：

```sh
sudo rm /usr/local/bin/docker-compose
```

换个源：

```sh
sudo curl -L "https://get.daocloud.io/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" > /usr/local/bin/docker-compose
```

几乎秒下载完

赋权：

```sh
sudo chmod +x /usr/local/bin/docker-compose
```

查看成功没有：

```sh
docker-compose --version
```

或者

```sh
docker-compose version
```

如果出现版本号，即安装成功了

```sh
docker-compose version 1.27.4, build 40524192
```

但如果出现 docker-compose 未识别命令

创建软连接

```sh
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

## 3.如果还是提示不识别，那么安装以下扩展源试试

+ 安装扩展源

  ```sh
  sudo yum -y install epel-release
  ```

+ 安装python-pip模块

  ```sh
  sudo yum install python-pip
  ```

  

