# Docker数据持久化

## 1. Volume

> (1)创建mysql数据库的container

```sh
docker run -d --name mysql01 -e MYSQL_ROOT_PASSWORD=123456	mysql:5.7
```

> (2)查看volume

```sh
docker volume ls
```

> (3)具体查看该volume 

```sh
docker volume inspect
48507d0e7936f94eb984adf8177ec50fc6a7ecd8745ea0bc165ef485371589e8
```

> (4)名字不好看，name太长，修改一下

`-v mysql01_volume:/var/lib/mysql`表示给上述的volume起一个能识别的名字

```sh
docker run -d --name mysql01 -v mysql01_volume:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456	mysql:5.7
```

> (5)查看volume

```sh
 docker volume ls
 docker volume inspect mysql01_volume
```

> (6)测试是否可以持久化保存数据

```sh
# 进入容器中
docker exec -it mysql01 bash

# 登录mysql服务
mysql -uroot -p123456

# 创建测试库
create database db_test

# 退出mysql服务，退出mysql container # 删除mysql容器
docker rm -f mysql01

# 查看volume
docker volume ls

# 发现volume还在
DRIVER         VOLUME NAM
local          mysql01_volume

# 新建一个mysql container，并且指定使用"mysql01_volume"
docker run -d --name test-mysql -v mysql01_volume:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 mysql:5.7

# 进入容器，登录mysql服务，查看数据库docker exec -it test-mysql bash mysql -uroot -p123456
show database;

# 可以发现db_test仍然在
| information_schema |
| db_test	|
| mysql	|
| performance_schema |
| sys |
```

## 2. Bind Mounting

> (1)创建一个tomcat容器

```sh
docker run -d --name tomcat01 -p 9090:8080 -v
/tmp/test:/usr/local/tomcat/webapps/test tomcat
```

> (2)查看两个目录

```sh
centos：cd /tmp/test
tomcat容器：cd /usr/local/tomcat/webapps/test
```

> (3)在centos的/tmp/test中新建1.html，并写一些内容

```sh
<p style="color:blue; font-size:20pt;">Only test content!!!</p
```

> (4)进入tomcat01的对应目录查看，发现也有一个1.html，并且也有内容  

> (5)在centos7上访问该路径：

```sh
curl localhost:9090/test/1.html
```

> (6)在win浏览器中通过ip访问

会显示`Only test content!!!`