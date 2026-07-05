# Window11 通过 VirtualBox 安装 Linux 虚拟机

## 1. 安装方式

结合 Mac 的安装方法，发现最后宿主机无法 ping 通主机，耗费了太多的时间。最终使用了 **桥接方式**，毕竟只是搭建个环境而已，其他的无所谓。

## 2. 网络配置方式

### 方式一：只设置一个网卡（桥接方式）

连接方式：桥接网卡

![桥接网卡](http://img.minalz.cn/typora/image-20230903232418276.png)

**优缺点：**
- ✅ **好处**：配置一个网卡即可
- ❌ **坏处**：宿主机 IP 一直变动，虚拟机 IP 也需要跟着变动，IP 和 GATEWAY 都需要跟着宿主机重新匹配才行

### 方式二：设置两个网卡（仅主机网络 + NAT）

**优缺点：**
- ✅ **好处**：宿主机 IP 一直变动，虚拟机 IP 不用随机改变

参考链接：[知乎教程](https://zhuanlan.zhihu.com/p/363202714)

## 3. 安装步骤

安装步骤参考 Mac 版，都差不多。

> ⚠️ **注意**：网络连接一定要记得打开！

## 4. 安装完成后，修改配置

```bash
# 更新网卡配置（启用一个网卡只会有 0s3）
vi /etc/sysconfig/network-scripts/ifcfg-enp0s3

# 修改以下内容
ONBOOT=yes
BOOTPROTO="dhcp" -> BOOTPROTO="static"
IPADDR="192.168.6.101"
GATEWAY="192.168.6.1"

# 保存并退出
:wq

# 重启网络
service network restart
```

> **注意**：
> 1. 如果一开始启用了两个网卡，然后又修改成了一个网卡（桥接模式），`service network restart` 会报错。解决方式是删除掉多余的配置，如 `0s8` 结尾的文件。
> 2. 设置的 IP 一定要和宿主机是同一个网段的。比如宿主机是 `193.168.6.1`，那么上面的配置就要对应改成这个网段的：
>    ```bash
>    IPADDR="192.168.6.101" -> IPADDR="192.168.6.102"
>    ```

## 5. 更改 YUM 的配置

### 5.1 下载阿里云的 Repo

```bash
[root@k8s-master ~]# yum install -y wget  
[root@centos7 /]# mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.bak
[root@centos7 /]# wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
```

### 5.2 清除缓存并生成新的缓存

```bash
[root@centos7 /]# yum clean all
[root@centos7 /]# yum makecache
```

### 5.3 验证

安装 net-tools 工具，运行 ifconfig 命令：

```bash
yum install -y net-tools
```

### 5.4 关闭防火墙

```bash
[root@k8s-master ~]# firewall-cmd --state
running
[root@k8s-master ~]# systemctl stop firewalld.service
[root@k8s-master ~]# systemctl disable firewalld.service
Removed symlink /etc/systemd/system/multi-user.target.wants/firewalld.service.
Removed symlink /etc/systemd/system/dbus-org.fedoraproject.FirewallD1.service.

# 查看防火墙状态
firewall-cmd --state

# 停止 firewall
systemctl stop firewalld.service

# 禁止 firewall 开机启动
systemctl disable firewalld.service
```

### 5.5 关闭 SELinux

```bash
[root@k8s-master ~]# getenforce
Enforcing
[root@k8s-master ~]# setenforce 0
[root@k8s-master ~]# sed -i 's/^ *SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config

# 查看 SELinux 状态
getenforce

# 临时关闭 SELinux
setenforce 0 

# 永久关闭（需重启系统）
sed -i 's/^ *SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
```

> 至此完成 CentOS 7.6 操作系统安装和优化。

## 6. 可能会出现的问题

### 6.1 相同的虚拟机克隆后，IP 地址没有变化

需要进行修改，修改 Host-Only 的那个网卡信息：

```bash
vi /etc/sysconfig/network-scripts/ifcfg-enp0s3

# 修改 
BOOTPROTO="dhcp" -> BOOTPROTO="static"
IPADDR="192.168.56.101" -> IPADDR="192.168.56.102"

# 保存 
:wq

# 重启网卡
service network restart

# 查看网卡信息，IP 变了
ifconfig
```

### 6.2 Ping 测试

**问题**：主机能 ping 通虚拟机，但虚拟机 ping 不通主机。

**原因**：防火墙的设置问题。

![防火墙设置](http://img.minalz.cn/typora/820c1a029bd0cac2c7944e0d104ea39.png)

参考链接：[zlprogram 教程](http://www.zlprogram.com/Show/34/6529088U.shtml)