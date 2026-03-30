# WSL复制同一个Ubuntu版本为多个环境



## 正确的多种安装方式

### 方式一：从商店多次安装（不可行）

Microsoft Store 安装的发行版**无法直接重名安装**，所以需要用导入方式。

### 方式二：导出导入法（最常用）

```bash
# 1. 导出你现有的 Ubuntu-22.04
wsl --export Ubuntu-22.04 D:\WSL\backup\ubuntu-base.tar

# 2. 导入为新实例（名称自定义）
wsl --import ubuntu-101    D:\WSL\Ubuntu\ubuntu-101    D:\WSL\backup\ubuntu-base.tar
wsl --import ubuntu-102   D:\WSL\Ubuntu\ubuntu-102   D:\WSL\backup\ubuntu-base.tar
wsl --import ubuntu-103 D:\WSL\Ubuntu\ubuntu-103 D:\WSL\backup\ubuntu-base.tar
```

查看有哪些虚拟化：

```bash
wsl --list --verbose
```

```bash
# 删除之前不需要的实例
wsl --unregister ubuntu-22.04.05
```



## 设置固定IP

要实现固定 IP `192.168.3.101/102/103`，需要完整配置 **Hyper-V 虚拟交换机 + 静态 IP**。

### 第一步：Windows 上创建虚拟交换机和 NAT

以管理员身份打开 PowerShell：

```bash
# 1. 创建内部虚拟交换机
New-VMSwitch -Name "WSLStaticNet" -SwitchType Internal

# 2. 查看网卡名称（通常是 "vEthernet (WSLStaticNet)"）
Get-NetAdapter

# 3. 配置虚拟交换机 IP（作为网关）
New-NetIPAddress -IPAddress 192.168.3.1 -PrefixLength 24 -InterfaceAlias "vEthernet (WSLStaticNet)"

# 4. 创建 NAT 网络
New-NetNat -Name WSLStaticNat -InternalIPInterfaceAddressPrefix 192.168.3.0/24
```

注意：这里会有问题，可能执行`New-VMSwitch -Name "WSLStaticNet" -SwitchType Internal`报错：

```text
New-VMSwitch : 无法将“New-VMSwitch”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径正确，然后再试一次。
所在位置 行:1 字符: 1
+ New-VMSwitch -Name "WSLStaticNet" -SwitchType Internal
+ ~~~~~~~~~~~~
    + CategoryInfo          : ObjectNotFound: (New-VMSwitch:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
```

这个错误说明你的 Windows 版本**不支持 Hyper-V**，或者 Hyper-V 功能没有启用。

检查原因：

```bash
# 1. 检查 Windows 版本
winver

# 2. 检查是否支持 Hyper-V
systeminfo | findstr "Hyper-V"
```

## 快速解决方案

如果 `New-VMSwitch` 不可用，可能是 **Hyper-V 管理工具** 未安装。尝试：

```bash
# 安装 Hyper-V 管理工具（不需要完整 Hyper-V）
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-Tools-All -All

# 或安装完整 Hyper-V (我执行的是第二种，安装成功后，再执行命令就不报错了)
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```



### 第二步：配置 WSL 使用虚拟交换机

```bash
notepad "$env:USERPROFILE\.wslconfig"
```

写入:

```bash
[wsl2]
vmSwitch=WSLStaticNet
```

### 第三步：停止 WSL 并检查实例

```bash
wsl --shutdown

# 确认三个实例都存在
wsl --list --verbose
```

### 第四步：为每个实例配置静态 IP

101机器：

```bash
wsl -d ubuntu-101

sudo tee /etc/wsl.conf << 'EOF'
[boot]
systemd=true

[network]
generateHosts = false
generateResolvConf = false
EOF

sudo rm -f /etc/netplan/*.yaml

sudo tee /etc/netplan/01-static.yaml << 'EOF'
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: no
      addresses:
        - 192.168.3.101/24
      routes:
        - to: default
          via: 192.168.3.1
      nameservers:
        addresses: [192.168.3.1, 8.8.8.8]
EOF

sudo netplan apply
exit
```

102机器：

```bash
wsl -d ubuntu-102

sudo tee /etc/wsl.conf << 'EOF'
[boot]
systemd=true

[network]
generateHosts = false
generateResolvConf = false
EOF

sudo rm -f /etc/netplan/*.yaml

sudo tee /etc/netplan/01-static.yaml << 'EOF'
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: no
      addresses:
        - 192.168.3.102/24
      routes:
        - to: default
          via: 192.168.3.1
      nameservers:
        addresses: [192.168.3.1, 8.8.8.8]
EOF

sudo netplan apply
exit
```

103机器：

```bash
wsl -d ubuntu-103

sudo tee /etc/wsl.conf << 'EOF'
[boot]
systemd=true

[network]
generateHosts = false
generateResolvConf = false
EOF

sudo rm -f /etc/netplan/*.yaml

sudo tee /etc/netplan/01-static.yaml << 'EOF'
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: no
      addresses:
        - 192.168.3.103/24
      routes:
        - to: default
          via: 192.168.3.1
      nameservers:
        addresses: [192.168.3.1, 8.8.8.8]
EOF

sudo netplan apply
exit
```

注意：

1.执行`sudo tee`命令的时候要分段粘贴，容易不生效或者粘贴格式出问题，导致配置失败

2.执行`sudo netplan apply`会报错：

```text
** (generate:539): WARNING **: 23:28:56.419: Permissions for /etc/netplan/01-static.yaml are too open. Netplan configuration should NOT be accessible by others.
WARNING:root:Cannot call Open vSwitch: ovsdb-server.service is not running.

这两个警告不影响功能，可以忽略。但第二个警告说明 systemd-networkd 可能没运行，导致静态 IP 没生效。
但是执行wsl -d ubuntu-101 hostname -I查看ip是生效的

sudo netplan apply
WARNING:root:Cannot call Open vSwitch: ovsdb-server.service is not running.

这个警告可以忽略，Open vSwitch 是可选的虚拟交换机工具，WSL 不需要它。
```

解决方案:

```bash
# 1. 修复权限警告(我就只执行了第一条，就行了)
sudo chmod 600 /etc/netplan/01-static.yaml

# 2. 确保 systemd-networkd 运行
sudo systemctl enable systemd-networkd
sudo systemctl start systemd-networkd

# 3. 重新应用 netplan
sudo netplan apply

# 4. 检查 IP
ip addr show eth0
```



### 第五步：重启 WSL 并验证

```bash
wsl --shutdown

# 逐个启动并检查 IP
wsl -d ubuntu-101 hostname -I
# 应显示 192.168.3.101

wsl -d ubuntu-102 hostname -I
# 应显示 192.168.3.102

wsl -d ubuntu-103 hostname -I
# 应显示 192.168.3.103
```

问题1：

因为三台机器都是通过一个backup tar import得到了，按照这种方式设置ip后，三台机器全都是192.168.3.101，192.168.3.102，192.168.3.103，出现ip重复

解决方案：

ubuntu-102 中执行：

```bash
# 修改 IP 为 102
sudo sed -i 's/192.168.3.101/192.168.3.102/g' /etc/netplan/01-static.yaml

# 验证修改
cat /etc/netplan/01-static.yaml

# 应用配置
sudo netplan apply

# 检查 IP
ip addr show eth0
```

ubuntu-103 中执行：

```bash
# 修改 IP 为 103
sudo sed -i 's/192.168.3.101/192.168.3.103/g' /etc/netplan/01-static.yaml

sudo netplan apply
ip addr show eth0
```

完整命令（从 Windows 执行）

```bash
# 修改 ubuntu-102
wsl -d ubuntu-102 -u root sed -i 's/192.168.3.101/192.168.3.102/g' /etc/netplan/01-static.yaml
wsl -d ubuntu-102 -u root netplan apply

# 修改 ubuntu-103  
wsl -d ubuntu-103 -u root sed -i 's/192.168.3.101/192.168.3.103/g' /etc/netplan/01-static.yaml
wsl -d ubuntu-103 -u root netplan apply

# 验证
wsl -d ubuntu-101 hostname -I
wsl -d ubuntu-102 hostname -I
wsl -d ubuntu-103 hostname -I
```







### 第六步：测试互通

```bash
wsl -d ubuntu-101

# 测试连接其他实例
ping 192.168.3.102
ping 192.168.3.103

# SSH 测试
ssh user@192.168.3.102
```





## 设置用户

### 方法一：启动时指定用户（推荐）

```bash
# 以特定用户启动 WSL 实例
wsl -d ubuntu-101 -u username

# 例如切换到 root
wsl -d ubuntu-101 -u root

# 切换到普通用户
wsl -d ubuntu-101 -u yourname
```



### 方法二：进入实例后切换

```bash
# 先进入实例
wsl -d ubuntu-101

# 然后使用 su 或 sudo 切换
su - username        # 需要对方密码
sudo -u username -i  # 需要当前用户 sudo 权限
```



### 方法三：设置默认用户

```bash
# 设置该实例的默认登录用户
ubuntu-101.exe config --default-user username

# 或者使用 wsl 命令
wsl --terminate ubuntu-101
wsl -d ubuntu-101 --user username
```





## 注意：

未来我可能还要加104 105 106,若还是有这种问题，仍然可以使用这种方式解决：

### 导入新实例并修改 IP

```bash
# 导入 104
wsl --import ubuntu-104 D:\WSL\ubuntu-104 D:\backup\ubuntu-template.tar

# 修改 IP 为 104
wsl -d ubuntu-104 -u root sed -i 's/192.168.3.101/192.168.3.104/g' /etc/netplan/01-static.yaml
wsl -d ubuntu-104 -u root netplan apply

# 导入 105
wsl --import ubuntu-105 D:\WSL\ubuntu-105 D:\backup\ubuntu-template.tar
wsl -d ubuntu-105 -u root sed -i 's/192.168.3.101/192.168.3.105/g' /etc/netplan/01-static.yaml
wsl -d ubuntu-105 -u root netplan apply

# 导入 106
wsl --import ubuntu-106 D:\WSL\ubuntu-106 D:\backup\ubuntu-template.tar
wsl -d ubuntu-106 -u root sed -i 's/192.168.3.101/192.168.3.106/g' /etc/netplan/01-static.yaml
wsl -d ubuntu-106 -u root netplan apply
```

### 批量更新所有 hosts 文件（可选）

```bash
# 定义所有 IP 和主机名
$hosts = @"
192.168.3.101 ubuntu-101
192.168.3.102 ubuntu-102
192.168.3.103 ubuntu-103
192.168.3.104 ubuntu-104
192.168.3.105 ubuntu-105
192.168.3.106 ubuntu-106
"@

# 写入每个实例
foreach ($name in @("ubuntu-101","ubuntu-102","ubuntu-103","ubuntu-104","ubuntu-105","ubuntu-106")) {
    wsl -d $name -u root bash -c "echo '$hosts' > /etc/hosts"
}
```

## 自动化脚本（保存备用）

创建 `add-wsl-node.ps1`：

```bash
param(
    [Parameter(Mandatory=$true)]
    [int]$NodeNumber  # 传入 104、105、106 等
)

$ip = "192.168.3.$NodeNumber"
$name = "ubuntu-$NodeNumber"

# 导入
wsl --import $name "D:\WSL\$name" "D:\backup\ubuntu-template.tar"

# 修改 IP
wsl -d $name -u root sed -i "s/192.168.3.101/$ip/g" /etc/netplan/01-static.yaml
wsl -d $name -u root netplan apply

Write-Host "$name 创建完成，IP: $ip" -ForegroundColor Green
```

使用：

```bash
.\add-wsl-node.ps1 -NodeNumber 104
.\add-wsl-node.ps1 -NodeNumber 105
.\add-wsl-node.ps1 -NodeNumber 106
```



