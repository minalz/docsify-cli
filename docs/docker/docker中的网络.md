# 🌐 Docker 中的网络

> 📦 深入理解 Docker 网络模型与配置

---

## 1️⃣ 计算机网络模型

![计算机网络模型](http://img.minalz.cn/typora/image-20201208144428992.png)

![网络模型详解](http://img.minalz.cn/typora/image-20201208144436073.png)

---

## 2️⃣ Linux 中的网卡

### 2.1 查看网卡（网络接口）

```bash
# 方式一
ip link show

# 方式二
ls /sys/class/net

# 方式三
ip a
```

### 2.2 网卡管理

#### 📖 ip a 解读

```
状态：UP/DOWN/UNKNOWN 等
link/ether：MAC 地址 
inet：绑定的 IP 地址
```

#### 📁 配置文件位置

```bash
# 在 Linux 中网卡对应的其实就是文件
cat /etc/sysconfig/network-scripts/ifcfg-eth0
```

#### ➕ 给网卡添加 IP 地址

```bash
# 添加 IP 地址
ip addr add 192.168.0.100/24 dev eth0

# 删除 IP 地址
ip addr delete 192.168.0.100/24 dev eth0
```

#### ⏯️ 网卡启动与关闭

```bash
# 重启网卡
service network restart
# 或
systemctl restart network

# 启动/关闭某个网卡
ifup/ifdown eth0
# 或
ip link set eth0 up/down
```

---

## 3️⃣ Network Namespace

在 Linux 上，网络的隔离是通过 `network namespace` 来管理的，不同的 `network namespace` 是互相隔离的。

```bash
# 查看当前机器上的 network namespace
ip netns list
```

### 🔧 Namespace 管理命令

```bash
ip netns list       # 查看
ip netns add ns1    # 添加
ip netns delete ns1 # 删除
```

### 🚀 Namespace 实战

#### 1. 创建 Network Namespace

```bash
ip netns add ns1
```

#### 2. 查看该 Namespace 下网卡的情况

```bash
ip netns exec ns1 ip a
```

#### 3. 启动 ns1 上的 lo 网卡

```bash
ip netns exec ns1 ifup lo
# 或
ip netns exec ns1 ip link set lo up
```

#### 4. 再次查看

可以发现 state 变成了 UNKNOWN

```bash
ip netns exec ns1 ip a
```

#### 5. 创建第二个 Namespace

```bash
ip netns add ns2
```

#### 6. 让两个 Namespace 网络连通

使用 `veth pair`（Virtual Ethernet Pair）：一个成对的端口

#### 7. 创建一对 Link

```bash
ip link add veth-ns1 type veth peer name veth-ns2
```

#### 8. 查看 Link 情况

```bash
ip link
```

#### 9. 将 veth 加入 Namespace

```bash
ip link set veth-ns1 netns ns1 
ip link set veth-ns2 netns ns2
```

#### 10. 查看宿主机和 Namespace 的 Link 情况

```bash
ip link
ip netns exec ns1 ip link 
ip netns exec ns2 ip link
```

#### 11. 分配 IP 地址

```bash
ip netns exec ns1 ip addr add 192.168.0.11/24 dev veth-ns1 
ip netns exec ns2 ip addr add 192.168.0.12/24 dev veth-ns2
```

#### 12. 启动网卡

```bash
ip netns exec ns1 ip link set veth-ns1 up 
ip netns exec ns2 ip link set veth-ns2 up
```

#### 13. 查看状态

```bash
ip netns exec ns1 ip a 
ip netns exec ns2 ip a
```

#### 14. 测试连通性

```bash
ip netns exec ns1 ping 192.168.0.12 
ip netns exec ns2 ping 192.168.0.11
```

---

## 4️⃣ Container 的 Network Namespace

### 🐳 创建两个 Container

```bash
docker run -d --name tomcat01 -p 8081:8080 tomcat 
docker run -d --name tomcat02 -p 8082:8080 tomcat
```

### 🔍 查看容器 IP

```bash
docker exec -it tomcat01 ip a 
docker exec -it tomcat02 ip a
```

### 🔄 互相 Ping 测试

```bash
docker exec -it tomcat01 ping <tomcat02-ip>
```

> 💡 **思考**：tomcat01 和 tomcat02 属于两个 network namespace，是如何能够 ping 通的？这里并没有使用 veth-pair 技术！

---

## 5️⃣ 深入分析 Container 网络 - Bridge

### 5.1 Docker0 默认 Bridge

```bash
# 安装桥接工具
yum install bridge-utils

# 查看桥接信息
brctl show
```

这种网络连接方式称之为 **Bridge**，也是 Docker 中默认的网络模式。

```bash
# 查看 Docker 网络模式
docker network ls

# 查看 bridge 详情
docker network inspect bridge
```

![Bridge 网络](http://img.minalz.cn/typora/image-20201208151132872.png)

> 💡 在 tomcat01 容器中是可以访问互联网的，NAT 是通过 iptables 实现的

### 5.2 创建自己的 Network

#### 1. 创建 Bridge 网络

```bash
docker network create tomcat-net
# 或指定子网
docker network create --subnet=172.18.0.0/24 tomcat-net
```

#### 2. 查看已有的 Network

```bash
docker network ls
```

输出示例：
```
NETWORK ID          NAME                DRIVER              SCOPE
edfab164840c        bridge              bridge              local
feec1384de6a        host                host                local
1cc51f3cb361        none                null                local
e085cbef6e68        tomcat-net          bridge              local
```

#### 3. 查看 Network 详情

```bash
docker network inspect tomcat-net
```

#### 4. 创建容器并指定网络

```bash
docker run -d --name custom-net-tomcat --network tomcat-net tomcat
```

#### 5. 查看容器网络信息

```bash
docker exec -it custom-net-tomcat ip a
```

#### 6. 查看网卡信息

```bash
ip a
```

#### 7. 查看网卡接口

```bash
brctl show
```

#### 8. 测试跨网络连通性

```bash
# 从 custom-net-tomcat ping tomcat01（无法 ping 通）
docker exec -it custom-net-tomcat ping 172.17.0.2
```

#### 9. 连接容器到自定义网络

```bash
docker network connect tomcat-net tomcat01
```

#### 10. 查看网卡桥接信息

```bash
brctl show
```

#### 11. 测试连通性

```bash
docker exec -it tomcat01 bash
ping 172.18.0.2
ping custom-net-tomcat
```

> ✅ 此时不仅可以通过 IP 地址 ping 通，而且可以通过名字 ping 到！因为都连接到了用户自定义的 tomcat-net bridge 上

> ❌ 但是 `ping tomcat02` 是不通的

### 5.3 端口映射

```bash
docker run -d --name port-tomcat -p 8090:8080 tomcat
```

---

> 💡 **提示**：理解 Docker 网络模型对于容器编排和微服务架构非常重要！
