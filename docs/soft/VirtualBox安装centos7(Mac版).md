# 🖥️ VirtualBox 安装 CentOS7 (Mac 版)

> 💡 Mac 环境下使用 VirtualBox 安装 CentOS7 虚拟机完整指南
>
> 转载链接地址：[原文来源](https://www.cnblogs.com/zhuzi91/p/12356856.html)

---

## 📋 1. 准备条件

- **VirtualBox**：6.1.4 版本
- **CentOS7 镜像**：CentOS-7-x86_64-Minimal-1908.iso

> **说明**：本文是 Mac 环境下的安装。之所以选择 6.1.4 版本的 VirtualBox，是因为低版本不兼容（这个问题会在最后补充中说明）。

### 1.1 下载地址

- **VirtualBox 下载**：[VirtualBox Downloads](https://www.virtualbox.org/wiki/Downloads)
- **CentOS 7 镜像下载**：[CentOS 7 ISO](http://isoredirect.centos.org/centos/7/isos/x86_64/)

## 🔧 2. 安装

### 2.1 配置基本信息

![配置基本信息1](http://img.minalz.cn/typora/974873-20200224140557089-1607215199.png)

![配置基本信息2](http://img.minalz.cn/typora/974873-20200224140707084-337668872.png)

![配置基本信息3](http://img.minalz.cn/typora/974873-20200224141502554-562592588.png)

![配置基本信息4](http://img.minalz.cn/typora/974873-20200224142335124-1983259468.png)

### 2.2 开始安装

![开始安装1](http://img.minalz.cn/typora/974873-20200224142615759-1912231763.png)

![开始安装2](http://img.minalz.cn/typora/974873-20200224142634192-1059826798.png)

![开始安装3](http://img.minalz.cn/typora/974873-20200224142748236-594176110.png)

![开始安装4](http://img.minalz.cn/typora/974873-20200224143020236-500707882.png)

![开始安装5](http://img.minalz.cn/typora/974873-20200224143140519-1359374616.png)

> 这里可以设置 root 密码，也可以创建用户，根据自己需求。

![设置密码](http://img.minalz.cn/typora/974873-20200224143659886-278513646.png)

等待安装完成重启。

### 2.3 修改配置

```bash
# 更新以下两个文件的配置
/etc/sysconfig/network-scripts/ifcfg-enp0s3
/etc/sysconfig/network-scripts/ifcfg-enp0s8

# 修改 onboot=yes
```

然后重启网络：

```bash
service network restart
```

## 🔄 3. 更改 YUM 的配置

### 3.1 下载阿里云的 Repo

```bash
[root@k8s-master ~]# yum install -y wget  
[root@centos7 /]# mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.bak
[root@centos7 /]# wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
```

### 3.2 清除缓存并生成新的缓存

```bash
[root@centos7 /]# yum clean all
[root@centos7 /]# yum makecache
```

### 3.3 验证

安装 net-tools 工具，运行 ifconfig 命令：

```bash
yum install -y net-tools
```

![验证](http://img.minalz.cn/typora/974873-20200224150118396-2101135565.png)

### 3.4 关闭防火墙

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

### 3.5 关闭 SELinux

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

## 📌 4. 补充

### 4.1 Mac 的 VirtualBox 6.X 版本的 Host-Only 配置没有了，怎么配置？！

![Host-Only 问题](http://img.minalz.cn/typora/974873-20200224151346537-942249565.png)

现在需要这么来设置：

![Host-Only 解决1](http://img.minalz.cn/typora/974873-20200224151010757-1597394246.png)

![Host-Only 解决2](http://img.minalz.cn/typora/974873-20200224151147152-1477825400.png)

---

> 以下是非转载内容

### 4.2 Mac 启动报错

**错误：添加网卡报错**

```bash
error：VBoxNetAdpCtl: Error while adding new interface: failed to open /dev/vboxnetctl: No such file or directory.
```

**解决：终端运行**

```bash
sudo /Library/Application\ Support/VirtualBox/LaunchDaemons/VirtualBoxStartup.sh restart
```

## 🌀 5. 虚拟机克隆

### 5.1 相同的虚拟机克隆后，IP 地址没有变化，需要进行修改

修改 Host-Only 的那个网卡信息：

```bash
vi /etc/sysconfig/network-scripts/ifcfg-enp0s3

# 修改 
BOOTPROTO="dhcp" -> BOOTPROTO="static"
IPADDR="192.168.56.101" -> IPADDR="192.168.56.102"

# 保存 
wq

# 重启网卡
service network restart

# 查看网卡信息，IP 变了
```

### 5.2 克隆的 Linux 系统中重启网卡失败

**错误信息**：`Bringing up interface eth0: Device eth0 does not seem to be present`

参考链接：[CSDN 教程](https://blog.csdn.net/cnds123321/article/details/116356027)

**解决步骤**：

> **注**：系统版本 CentOS 6.3

1. 执行以下命令将文件清空：
   ```bash
   echo "" > /etc/udev/rules.d/70-persistent-net.rules
   ```

2. 备份该文件，防止后面出错不能还原：
   ```bash
   cp /etc/udev/rules.d/70-persistent-net.rules /etc/udev/rules.d/70-persistent-net.rules.bak
   ```

3. 删除该文件：
   ```bash
   rm -rf /etc/udev/rules.d/70-persistent-net.rules
   ```

4. 打开文件，并删除 UUID 和 HWADDR 这两行：
   ```bash
   vi /etc/sysconfig/network-scripts/ifcfg-eth0
   ```

5. 保存该文件并退出，执行 reboot 命令，重启系统

6. 再次重启网卡服务：
   ```bash
   service network restart
   ```

7. 最后输入 `ifconfig` 命令查看 IP 地址成功

