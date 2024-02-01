# window11 通过VirSualBox安装Linux虚拟机

### 1.安装方式，结合Mac的安装方法

发现最后宿主机无法ping通主机，耗费了太多的时间，用了桥接的方式来设置了，毕竟只是搭建个环境而已，其他的无所谓

### 2.只需要设置一个网卡即可（桥接方式）

> 好处是配置一个网卡即可
> 坏处是宿主机IP一直变动，虚拟机IP也需要跟着变动，IP和GATEWAY都需要跟着宿主机重新匹配才行

连接方式：桥接网卡![image-20230903232418276](http://img.minalz.cn/typora/image-20230903232418276.png)

### 2.1 设置两个网卡，仅主机网络+NAT（网络地址转换）

> 好处是宿主机IP一直变动，虚拟机IP不用随机改变

参考链接：https://zhuanlan.zhihu.com/p/363202714

### 3.安装步骤参考Mac版，都差不多

网络连接一定要记得打开

### 4.安装完成后，修改配置

```sh
##更新 如下两个文件的配置 启用一个网卡只会有0s3
/etc/sysconfig/network-scripts/ifcfg-enp0s3
/etc/sysconfig/network-scripts/ifcfg-enp0s8

# 修改 
onboot=yes
BOOTPROTO="dhcp" -> BOOTPROTO="static"
IPADDR="192.168.56.101"
GATEWAY="192.168.56.1"
# 保存 
wq

##然后重启网络
servcie network restart
```

如果一开始启用了两个网卡，然后又修改成了一个网卡（桥接模式），service network restart会报错的，解决方式是删除掉多余的配置，如0s8结尾的文件

注意：设置的IP一定要和宿主机是同一个网段的，比如宿主机是193.168.6.1，那么上面的配置就要对应改成这个网段的

```sh
IPADDR="192.168.6.101" -> IPADDR="192.168.6.102"
```

### 5.更改yum的配置

#### 5.1下载阿里云的repo

```sh
[root@k8s-master ~]# yum install -y wget  
[root@centos7 /]# mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.bak
[root@centos7 /]# wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repoCopy to clipboardErrorCopied
```

#### 5.2清除缓存并生成新的缓存

```sh
[root@centos7 /]# yum clean all
[root@centos7 /]# yum makecache
```

#### 5.3验证

安装net-tools工具，运行ifconfig命令

```sh
yum install -y net-tools
```

#### 5.4关闭防火墙

```sh
[root@k8s-master ~]# firewall-cmd --state
running
[root@k8s-master ~]# systemctl stop firewalld.service
[root@k8s-master ~]# systemctl disable firewalld.service
Removed symlink /etc/systemd/system/multi-user.target.wants/firewalld.service.
Removed symlink /etc/systemd/system/dbus-org.fedoraproject.FirewallD1.service.

firewall-cmd --state #查看防火墙状态

systemctl stop firewalld.service #停止firewall
systemctl disable firewalld.service #禁止firewall开机启动
```

#### 5.5关闭selinux

```sh
[root@k8s-master ~]# getenforce
Enforcing
[root@k8s-master ~]# setenforce 0
[root@k8s-master ~]# sed -i 's/^ *SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config

#查看selinux状态
getenforce

#临时关闭selinux
setenforce 0 
#永久关闭（需重启系统）
sed -i 's/^ *SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config 
至此完成Centos7.6操作系统安装和优化。
```

### 6.可能会出现的问题

#### 6.1相同的虚拟机克隆后,IP地址没有变化,需要进行修改,修改only-host的那个网卡信息

```sh
vi /etc/sysconfig/network-scripts/ifcfg-enp0s3
# 修改 
BOOTPROTO="dhcp" -> BOOTPROTO="static"
IPADDR="192.168.56.101" -> IPADDR="192.168.56.102"
# 保存 
wq
# 重启网卡
service network restart
# 查看网卡信息,IP变了
ifconfig
```

#### 6.2ping测试

主机能ping通虚拟机但虚拟机ping不通主机，原因是防火墙的设置问题

![820c1a029bd0cac2c7944e0d104ea39](http://img.minalz.cn/typora/820c1a029bd0cac2c7944e0d104ea39.png)

参考链接：http://www.zlprogram.com/Show/34/6529088U.shtml