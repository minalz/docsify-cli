# Docker中的网络

## 1.计算机网络模型

![image-20201208144428992](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20201208144428992.png)

![](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20201208144436073.png)

## 2.Linux中网卡

### 2.1 查看网卡[网络接口]

```sh
1.ip link show

2.ls /sys/class/net

3.ip a
```

### 2.2 网卡

#### 2.2.1 ip a 解读

```
状态：UP/DOWN/UNKOWN等

link/ether：MAC地址 

inet：绑定的IP地址
```

#### 2.2.2 配置文件

```
在Linux中网卡对应的其实就是文件，所以找到对应的网卡文件即可

比如：cat /etc/sysconﬁg/network-scripts/ifcfg-eth0
```

#### 2.2.3 给网卡添加IP地址

当然，这块可以直接修改`ifcfg-*`文件，但是我们通过命令添加试试

```sh
(1)ip addr add 192.168.0.100/24 dev eth0

(2)删除IP地址
ip addr delete 192.168.0.100/24 dev eth0
```

#### 2.2.4 网卡启动与关闭

重启网卡：

```sh
service network restart / systemctl restart network
```

启动/关闭某个网卡：

```sh
ifup/ifdown eth0 or ip link set eth0 up/down
```

## 3.Network Namespace

在linux上，网络的隔离是通过`network namespace`来管理的，不同的`network namespace`是互相隔离的ip 

```sh
netns list：查看当前机器上的`network namespace`
```

`network namespace`的管理：

```sh
ip netns list       #查看

ip netns add ns1    #添加

ip netns delete ns1	#删除
```

### 3.1 namespace实战

> (1)创建一个network namespace

```sh
ip netns add ns1
```

> (2)查看该namespace下网卡的情况

```sh
ip netns exec ns1 ip a
```

> (3)启动ns1上的lo网卡

```sh
ip netns exec ns1 ifup lo
或者
ip netns exec ns1 ip link set lo up
```

> (4)再次查看 

​	可以发现state变成了UNKOWN

```sh
ip netns exec ns1 ip a
```

> (5)再次创建一个network namespace

```sh
ip netns add ns2
```

> (6)此时想让两个namespace网络连通起来

```sh
`veth pair` ：`Virtual Ethernet Pair`，是一个成对的端口，可以实现上述功能
```

> (7)创建一对link，也就是接下来要通过veth pair连接的link

```sh
ip link add veth-ns1 type veth peer name veth-ns2
```

> (8)查看link情况

```sh
ip link
```

> (9)将veth-ns1加入ns1中，将veth-ns2加入ns2中

```sh
ip link set veth-ns1 netns ns1 
ip link set veth-ns2 netns ns2
```

> (10)查看宿主机和ns1，ns2的link情况

```sh
ip link
ip netns exec ns1 ip link 
ip netns exec ns2 ip link
```

> (11)此时veth-ns1和veth-ns2还没有ip地址，显然通信还缺少点条件

```sh
ip netns exec ns1 ip addr add 192.168.0.11/24 dev veth-ns1 
ip netns exec ns2 ip addr add 192.168.0.12/24 dev veth-ns2
```

> (12)再次查看，发现state是DOWN，并且还是没有IP地址

```sh
ip netns exec ns1 ip link 
ip netns exec ns2 ip link
```

> (13)启动veth-ns1和veth-ns2

```sh
ip netns exec ns1 ip link set veth-ns1 up 
ip netns exec ns2 ip link set veth-ns2 up
```

> (14)再次查看，发现state是UP，同时有IP

```sh
ip netns exec ns1 ip a 
ip netns exec ns2 ip a
```

> (15)此时两个network namespace互相ping一下，发现是可以ping通的

```sh
ip netns exec ns1 ping 192.168.0.12 
ip netns exec ns2 ping 192.168.0.11
```

### 3.2 Container的NS

按照上面的描述，实际上每个container，都会有自己的network   namespace，并且是独立的，我们可以进入到容器中进行验证

> (1)不妨创建两个container看看？

```sh
docker run -d --name tomcat01 -p 8081:8080 tomcat 
docker run -d --name tomcat02 -p 8082:8080 tomcat
```

> (2)进入到两个容器中，并且查看ip

```sh
docker exec -it tomcat01 ip a 
docker exec -it tomcat02 ip a
```

> (3)互相ping一下是可以ping通的

```
值得我们思考的是，此时tomcat01和tomcat02属于两个network  namespace，是如何能够ping通的？ 有些小伙伴可能会想，不就跟上面的namespace实战一样吗？注意这里并没有veth-pair技术
```

# 4.深入分析container网络-Bridge

### 4.1 docker0默认bridge

```sh
安装一下：yum install bridge-utils 
brctl show
```

这种网络连接方法我们称之为`Bridge`，其实也可以通过命令查看docker中的网络模式：`docker network ls `

bridge也是docker中默认的网络模式

不妨检查一下

```sh
bridge：docker network inspect bridge
```



![image-20201208151132872](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20201208151132872.png)

在tomcat01容器中是可以访问互联网的，NAT是通过iptables实现的

### 4.2 创建自己的network

> (1)创建一个network，类型为bridge

```sh
docker network create tomcat-net 
or
docker network create --subnet=172.18.0.0/24 tomcat-net
```

> (2)查看已有的network：`docker network ls`

```sh
NETWORK ID          NAME                DRIVER              SCOPE
edfab164840c        bridge              bridge              local
feec1384de6a        host                host                local
1cc51f3cb361        none                null                local
e085cbef6e68        tomcat-net          bridge              local
```

> (3)查看tomcat-net详情信息：docker network inspect tomcat-net 

> (4)创建tomcat的容器，并且指定使用tomcat-net

```sh
docker run -d --name custom-net-tomcat --network tomcat-net tomcat
```

> (5)查看custom-net-tomcat的网络信息

```sh
docker exec -it custom-net-tomcat ip a
```

> (6)查看网卡信息

```sh
ip a
```

> (7)查看网卡接口

```sh
brctl show
```

> (8)此时在custom-net-tomcat容器中ping一下tomcat01的ip会如何？发现无法ping通

```sh
docker exec -it custom-net-tomcat ping 172.17.0.2
```

> (9)此时如果tomcat01容器能够连接到tomcat-net上应该就可以咯

```sh
docker network connect tomcat-net tomcat01
```

> (10)查看tomcat-net网络，可以发现tomcat01这个容器也在其中

```sh
brctl show
```

> (11)此时进入到tomcat01或者custom-net-tomcat中，不仅可以通过ip地址ping通，而且可以通过名字ping
> 到，这时候因为都连接到了用户自定义的tomcat-net bridge上

```sh
docker exec -it tomcat01 bash
ping 172.18.0.2
ping custom-net-tomcat
```

但是`ping tomcat02`是`不通`的

### 4.3 端口映射

`-p` 即可

```sh
docker run -d --name port-tomcat -p 8090:8080 tomcat
```