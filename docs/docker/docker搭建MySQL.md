# Docker搭建MySQL

## 1. 单机版

指定版本：

```sh
docker run -d --name my-mysql -p 3301:3306 -e MYSQL_ROOT_PASSWORD=123456 --privileged mysql:5.7
```

不指定版本，默认是latest，这时候客户端连接服务器的时候，会出现一个错

```sh
Authentication plugin 'caching_sha2_password' cannot be loaded: ....
```

这是因为8.0之后的版本，更换了新的身份验证插件`caching_sha2_password`, 原来的身份验证插件为`mysql_native_password`

修复步骤：

> 1.进入mysql容器

```sh
docker exec -it my-mysql /bin/bash
或者
docker exec -it my-mysql bash
my-mysql是docker容器名
```

> 2.进入mysql

```sh
mysql -uroot -p123456
    -u 指定用户，这里是root用户
    -p 后面跟密码
```

> 3.修改校验方式和密码

```sh
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
　　　　
'root':可以改为你自己定义的用户名
'password':指的是用户密码，即想使用的验证密码
'%':指的是该用户开放的IP，%表示所有IP均可访问，可以是'localhost'(仅本机访问，相当于127.0.0.1)，可以是具体的'*.*.*.*'(具体某一IP)　　　
比如执行`ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'password';`，那么mysql对用户名为root密码为123456的校验改为了mysql_native_password方式
```

修复步骤的参考链接：https://www.cnblogs.com/woshishanshan/p/10572179.html

## 2. 集群版PXC

```sh
01 拉取pxc镜像
docker pull percona/percona-xtradb-cluster:5.7.21

02 复制pxc镜像(实则重命名)
docker tag percona/percona-xtradb-cluster:5.7.21 pxc

03 删除pxc原来的镜像
docker rmi percona/percona-xtradb-cluster:5.7.21

04 创建一个单独的网段，给mysql数据库集群使用
(1)docker network create --subnet=172.18.0.0/24 pxc-net 
(2)docket network inspect pxc-net	[查看详情]
(3)docker network rm pxc-net	[删除]

05 创建和删除volume
创建：docker volume create --name v1
删除：docker volume rm v1
查看详情：docker volume inspect v1

06 创 建 单 个 PXC 容 器 demo [CLUSTER_NAME PXC集群名字]
[XTRABACKUP_PASSWORD数据库同步需要用到的密码]

docker run -d -p 3301:3306
-v v1:/var/lib/mysql
-e MYSQL_ROOT_PASSWORD=123456
-e CLUSTER_NAME=PXC
-e XTRABACKUP_PASSWORD=123456
--privileged --name=node1 --net=pxc-net --ip 172.18.0.2 pxc

07 搭建PXC[MySQL]集群
(1)准备3个数据卷
docker volume create --name v1 docker volume create --name v2 docker volume create --name v3
(2)运行三个PXC容器
docker run -d -p 3301:3306 -v v1:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -e CLUSTER_NAME=PXC -e XTRABACKUP_PASSWORD=123456 -
-privileged --name=node1 --net=pxc-net --ip 172.18.0.2 pxc

[CLUSTER_JOIN将该数据库加入到某个节点上组成集群]
docker run -d -p 3302:3306 -v v2:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -e CLUSTER_NAME=PXC -e XTRABACKUP_PASSWORD=123456 -
e CLUSTER_JOIN=node1 --privileged --name=node2 --net=pxc-net --ip 172.18.0.3 pxc

docker run -d -p 3303:3306 -v v3:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -e CLUSTER_NAME=PXC -e XTRABACKUP_PASSWORD=123456 -
e CLUSTER_JOIN=node1 --privileged --name=node3 --net=pxc-net --ip 172.18.0.4 pxc 
(3)Navicate工具连接测试
```

### 3.数据库的负载均衡haproxy

> (1)拉取haproxy镜像

```sh
docker pull haproxy
```

> (2)创建haproxy配置文件，这里使用`bind mounting`的方式

```sh
touch /tmp/haproxy/haproxy.cfg
```

```
global
    #工作目录，这边要和创建容器指定的目录对应
    chroot /usr/local/etc/haproxy
    #日志文件
    log 127.0.0.1 local5 info 
    #守护进程运行
    daemon


defaults
    log global mode	http 
    #日志格式
    option	httplog
    #日志中不记录负载均衡的心跳检测记录
    option	dontlognull
    #连接超时（毫秒） timeout connect 5000 
    #客户端超时（毫秒） timeout client	50000 
    #服务器超时（毫秒） timeout server	50000

    #监控界面
    listen	admin_stats
    #监控界面的访问的IP和端口
    bind	0.0.0.0:8888
    #访问协议
    mode	http 
    #URI相对地址
    stats uri	/dbs_monitor 
    #统计报告格式
    stats realm	Global\ statistics 
    #登陆帐户信息
    stats auth	admin:admin 
    #数据库负载均衡
    listen	proxy-mysql
    #访问的IP和端口，haproxy开发的端口为3306
    #假如有人访问haproxy的3306端口，则将请求转发给下面的数据库实例
    bind	0.0.0.0:3306
    #网络协议
    mode	tcp
    #负载均衡算法（轮询算法） 
    #轮询算法：roundrobin 
    #权重算法：static-rr
    #最少连接算法：leastconn 
    #请求源IP算法：source balance	roundrobin
    # 日 志 格 式 
    option	tcplog
    #在MySQL中创建一个没有权限的haproxy用户，密码为空。
    #Haproxy使用这个账户对MySQL数据库心跳检测
    option	mysql-check user haproxy
    server	MySQL_1 172.18.0.2:3306 check weight 1 maxconn 2000
    server	MySQL_2 172.18.0.3:3306 check weight 1 maxconn 2000
    server	MySQL_3 172.18.0.4:3306 check weight 1 maxconn 2000 
    #使用keepalive检测死链
    option	tcpka
```

> (3)创建haproxy容器

```sh
docker run -it -d -p 8888:8888 -p 3306:3306 -v
/tmp/haproxy:/usr/local/etc/haproxy --name haproxy01 --privileged --net=pxc-net haproxy
```

> (4)根据haproxy.cfg文件启动haproxy

```sh
docker exec -it haproxy01 bash
haproxy -f /usr/local/etc/haproxy/haproxy.cfg
```

> (5)在MySQL数据库上创建用户，用于心跳检测

```sh
CREATE USER 'haproxy'@'%' IDENTIFIED BY '';
[小技巧[如果创建失败，可以先输入一下命令]: drop user 'haproxy'@'%';
flush privileges;
CREATE USER 'haproxy'@'%' IDENTIFIED BY '';
]
```

> (6)win浏览器访问

```sh
http://centos_ip:8888/dbs_monitor
用户名密码都是:admin
```

> (7)Navicate连接haproxy01

```sh
ip:centos_ip 
port:3306 
user:root 
password:123456
```

> (8)在haproxy连接上进行数据操作，然后查看数据库集群各个节点

<font color="red" size=5>注意：如果安装出错了，静下心来，仔细检查配置是否出错，如果没有出错，那么再重新安装一次，并且volume也删除掉，再重新创建一次</font>