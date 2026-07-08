# 🗄️ Docker 搭建 MySQL

> 📦 使用 Docker 部署 MySQL 数据库（单机版 & 集群版）

---

## 1️⃣ 单机版 MySQL

### 📥 指定版本安装（推荐 5.7）

```sh
docker run -d \
  --name my-mysql \
  -p 3301:3306 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  --privileged \
  mysql:5.7
```

### ❌ 不指定版本的问题

如果直接拉取 `latest` 版本，客户端连接时会出现错误：

```
Authentication plugin 'caching_sha2_password' cannot be loaded: ....
```

> 💡 **原因**：MySQL 8.0+ 使用了新的身份验证插件 `caching_sha2_password`，原来的是 `mysql_native_password`

### 🔧 修复步骤

#### 1. 进入 MySQL 容器

```sh
docker exec -it my-mysql /bin/bash
# 或者
docker exec -it my-mysql bash
```

#### 2. 进入 MySQL

```sh
mysql -uroot -p123456
```

> - `-u`：指定用户，这里是 root 用户
> - `-p`：后面跟密码

#### 3. 修改校验方式和密码

```sql
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
```

**参数说明：**
- `'root'`：可以改为你自己定义的用户名
- `'password'`：用户密码
- `'%'`：该用户开放的 IP，`%` 表示所有 IP 均可访问
  - 可以是 `'localhost'`（仅本机访问，相当于 127.0.0.1）
  - 可以是具体的 `'*.*.*.*'`（具体某一 IP）

参考链接：[MySQL 认证插件问题](https://www.cnblogs.com/woshishanshan/p/10572179.html)

---

## 2️⃣ 集群版 PXC

### 📦 步骤 01：拉取 PXC 镜像

```sh
docker pull percona/percona-xtradb-cluster:5.7.21
```

### 🏷️ 步骤 02：复制（重命名）镜像

```sh
docker tag percona/percona-xtradb-cluster:5.7.21 pxc
```

### 🗑️ 步骤 03：删除原镜像

```sh
docker rmi percona/percona-xtradb-cluster:5.7.21
```

### 🌐 步骤 04：创建独立网段

```sh
# 创建网段
docker network create --subnet=172.18.0.0/24 pxc-net

# 查看网段详情
docker network inspect pxc-net

# 删除网段
docker network rm pxc-net
```

### 💾 步骤 05：创建数据卷

```sh
# 创建
docker volume create --name v1

# 删除
docker volume rm v1

# 查看详情
docker volume inspect v1
```

### 🚀 步骤 06：创建单个 PXC 容器（Demo）

```sh
docker run -d \
  -p 3301:3306 \
  -v v1:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e CLUSTER_NAME=PXC \
  -e XTRABACKUP_PASSWORD=123456 \
  --privileged \
  --name=node1 \
  --net=pxc-net \
  --ip 172.18.0.2 \
  pxc
```

> - `CLUSTER_NAME`：PXC 集群名字
> - `XTRABACKUP_PASSWORD`：数据库同步需要用到的密码

### 🎯 步骤 07：搭建 PXC 集群

#### 1. 准备 3 个数据卷

```sh
docker volume create --name v1
docker volume create --name v2
docker volume create --name v3
```

#### 2. 运行三个 PXC 容器

**Node 1（主节点）：**

```sh
docker run -d \
  -p 3301:3306 \
  -v v1:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e CLUSTER_NAME=PXC \
  -e XTRABACKUP_PASSWORD=123456 \
  --privileged \
  --name=node1 \
  --net=pxc-net \
  --ip 172.18.0.2 \
  pxc
```

**Node 2（加入集群）：**

```sh
docker run -d \
  -p 3302:3306 \
  -v v2:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e CLUSTER_NAME=PXC \
  -e XTRABACKUP_PASSWORD=123456 \
  -e CLUSTER_JOIN=node1 \
  --privileged \
  --name=node2 \
  --net=pxc-net \
  --ip 172.18.0.3 \
  pxc
```

**Node 3（加入集群）：**

```sh
docker run -d \
  -p 3303:3306 \
  -v v3:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e CLUSTER_NAME=PXC \
  -e XTRABACKUP_PASSWORD=123456 \
  -e CLUSTER_JOIN=node1 \
  --privileged \
  --name=node3 \
  --net=pxc-net \
  --ip 172.18.0.4 \
  pxc
```

#### 3. Navicat 工具连接测试

---

## 3️⃣ 数据库负载均衡 HAProxy

### 📥 1. 拉取 HAProxy 镜像

```sh
docker pull haproxy
```

### 📝 2. 创建 HAProxy 配置文件

使用 `bind mounting` 的方式：

```sh
touch /tmp/haproxy/haproxy.cfg
```

**haproxy.cfg 配置：**

```
global
    # 工作目录，这边要和创建容器指定的目录对应
    chroot /usr/local/etc/haproxy
    # 日志文件
    log 127.0.0.1 local5 info 
    # 守护进程运行
    daemon

defaults
    log global
    mode http 
    # 日志格式
    option httplog
    # 日志中不记录负载均衡的心跳检测记录
    option dontlognull
    # 连接超时（毫秒）
    timeout connect 5000 
    # 客户端超时（毫秒）
    timeout client 50000 
    # 服务器超时（毫秒）
    timeout server 50000

    # 监控界面
    listen admin_stats
    # 监控界面的访问的IP和端口
    bind 0.0.0.0:8888
    # 访问协议
    mode http 
    # URI相对地址
    stats uri /dbs_monitor 
    # 统计报告格式
    stats realm Global\ statistics 
    # 登陆帐户信息
    stats auth admin:admin 
    
    # 数据库负载均衡
    listen proxy-mysql
    # 访问的IP和端口，haproxy开发的端口为3306
    bind 0.0.0.0:3306
    # 网络协议
    mode tcp
    # 负载均衡算法（轮询算法）
    # 轮询算法：roundrobin 
    # 权重算法：static-rr
    # 最少连接算法：leastconn 
    # 请求源IP算法：source
    balance roundrobin
    # 日志格式 
    option tcplog
    # 在MySQL中创建一个没有权限的haproxy用户，密码为空
    # Haproxy使用这个账户对MySQL数据库心跳检测
    option mysql-check user haproxy
    server MySQL_1 172.18.0.2:3306 check weight 1 maxconn 2000
    server MySQL_2 172.18.0.3:3306 check weight 1 maxconn 2000
    server MySQL_3 172.18.0.4:3306 check weight 1 maxconn 2000 
    # 使用keepalive检测死链
    option tcpka
```

### 🐳 3. 创建 HAProxy 容器

```sh
docker run -it -d \
  -p 8888:8888 \
  -p 3306:3306 \
  -v /tmp/haproxy:/usr/local/etc/haproxy \
  --name haproxy01 \
  --privileged \
  --net=pxc-net \
  haproxy
```

### ▶️ 4. 启动 HAProxy

```sh
docker exec -it haproxy01 bash
haproxy -f /usr/local/etc/haproxy/haproxy.cfg
```

### 👤 5. 创建 MySQL 心跳检测用户

```sql
CREATE USER 'haproxy'@'%' IDENTIFIED BY '';
```

> 💡 **小技巧**：如果创建失败，可以先执行：
> ```sql
> drop user 'haproxy'@'%';
> flush privileges;
> CREATE USER 'haproxy'@'%' IDENTIFIED BY '';
> ```

### 🌐 6. 访问监控界面

浏览器访问：`http://centos_ip:8888/dbs_monitor`

- 用户名：`admin`
- 密码：`admin`

### 🔌 7. Navicat 连接 HAProxy

```
ip: centos_ip 
port: 3306 
user: root 
password: 123456
```

### 🔄 8. 测试数据同步

在 HAProxy 连接上进行数据操作，然后查看数据库集群各个节点是否同步。

---

> ⚠️ **注意**：如果安装出错了，静下心来，仔细检查配置是否出错。如果没有出错，那么再重新安装一次，并且 volume 也删除掉，再重新创建！
