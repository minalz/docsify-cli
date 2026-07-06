# WSL 中开启代理配置指南

本文档介绍如何在 WSL2 中配置代理，解决 "检测到 localhost 代理配置，但未镜像到 WSL" 的问题。

---

## 📋 目录

- [问题描述](#问题描述)
- [第一步：配置 WSL 网络镜像模式](#第一步配置-wsl-网络镜像模式)
- [第二步：配置 Ubuntu 代理](#第二步配置-ubuntu-代理)
- [第三步：验证配置](#第三步验证配置)
- [常见问题与解决方案](#常见问题与解决方案)
- [代理命令对照表](#代理命令对照表)

---

## 问题描述

在 WSL 中使用代理时，可能会遇到以下提示：

```
wsl: 检测到 localhost 代理配置，但未镜像到 WSL。NAT 模式下的 WSL 不支持 localhost 代理。
```

这是因为 WSL2 默认使用 NAT 网络模式，无法直接访问 Windows 主机的 localhost 代理。需要通过**网络镜像模式**来解决。

---

## 第一步：配置 WSL 网络镜像模式

> ⚠️ **注意**：以下命令需要在 **Windows PowerShell（管理员）** 中执行。

### 1. 创建/编辑 WSL 配置文件

```powershell
# 创建或编辑 .wslconfig 文件
notepad "$env:USERPROFILE\.wslconfig"
```

### 2. 添加网络镜像配置

在打开的记事本中粘贴以下内容：

```ini
[wsl2]
networkingMode=mirrored
dnsTunneling=true
firewall=true
autoProxy=true
```

**配置说明：**

| 配置项 | 说明 |
|--------|------|
| `networkingMode=mirrored` | 启用网络镜像模式，使 WSL 共享 Windows 网络栈 |
| `dnsTunneling=true` | 启用 DNS 隧道，解决 DNS 解析问题 |
| `firewall=true` | 启用防火墙保护 |
| `autoProxy=true` | 自动代理配置 |

### 3. 重启 WSL

保存文件（Ctrl + S）并关闭记事本后，执行：

```powershell
# 关闭所有 WSL 实例
wsl --shutdown

# 等待 5 秒后，重新打开 WSL（Ubuntu）
```

---

## 第二步：配置 Ubuntu 代理

> 💡 **注意**：以下命令需要在 **WSL Ubuntu** 中执行。

### 方式一：基础代理配置

```bash
# 备份原配置
cp ~/.bashrc ~/.bashrc.bak

# 添加代理配置到 bashrc
cat >> ~/.bashrc << 'EOF'

# Proxy settings
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
export no_proxy=localhost,127.0.0.1
EOF

# 立即生效
source ~/.bashrc
```

### 方式二：增强代理配置（推荐）

包含国内域名和私有网络地址排除：

```bash
# 备份原配置
cp ~/.bashrc ~/.bashrc.bak

# 添加增强代理配置
cat >> ~/.bashrc << 'EOF'

# Proxy settings
export http_proxy=http://127.0.0.1:7897
export https_proxy=http://127.0.0.1:7897
export no_proxy=localhost,127.0.0.1,.baidu.com,.aliyun.com,.tencent.com,.163.com,.cn,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
EOF

# 立即生效
source ~/.bashrc
```

**配置说明：**

- `http_proxy` / `https_proxy`: 代理服务器地址（端口根据实际代理工具调整）
- `no_proxy`: 不走代理的地址列表，包括：
  - 本地地址：`localhost`, `127.0.0.1`
  - 国内域名：`.baidu.com`, `.aliyun.com`, `.tencent.com` 等
  - 私有网络：`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`

---

## 第三步：验证配置

### 1. 检查环境变量

```bash
# 查看代理是否生效
echo $http_proxy
echo $https_proxy
echo $no_proxy
```

### 2. 测试网络连通性

```bash
# 测试外网访问（应该走代理）
curl -I https://www.google.com

# 测试国内网站（应该不走代理）
curl -I https://www.baidu.com
```

---

## 常见问题与解决方案

### 问题 1：如何快速修改代理端口？

如果设置错了端口，可以使用以下命令快速恢复：

```bash
# 删除旧配置
sed -i '/# Proxy settings/,/no_proxy=/d' ~/.bashrc

# 添加新配置（包含国内地址排除）
cat >> ~/.bashrc << 'EOF'

# Proxy settings
export http_proxy=http://127.0.0.1:7897
export https_proxy=http://127.0.0.1:7897
export no_proxy=localhost,127.0.0.1,.baidu.com,.aliyun.com,.tencent.com,.163.com,.cn,10.0.0.0/8,172.16.0.0/12,192.168.0.0/16
EOF

# 立即生效
source ~/.bashrc

# 验证
echo "配置完成！"
echo "http_proxy: $http_proxy"
echo "no_proxy: $no_proxy"
```

### 问题 2：如何临时关闭代理？

```bash
# 临时取消代理（当前终端有效）
unset http_proxy https_proxy

# 或者使用函数快速切换
alias proxy-off='unset http_proxy https_proxy'
alias proxy-on='export http_proxy=http://127.0.0.1:7897; export https_proxy=http://127.0.0.1:7897'
```

### 问题 3：如何永久关闭代理？

```bash
# 编辑 bashrc
nano ~/.bashrc

# 找到并删除 Proxy settings 相关的配置行
# 然后保存并执行
source ~/.bashrc
```

### 问题 4：网络镜像模式配置失败？

1. 确认 WSL2 版本：
   ```powershell
   wsl --set-default-version 2
   ```

2. 确认 Windows 版本支持（需要 Windows 11 或较新的 Windows 10）

3. 检查 `.wslconfig` 文件语法是否正确

---

## 代理命令对照表

了解哪些命令会走代理，哪些不会：

| 命令 | 协议 | 是否走代理 | 说明 |
|------|------|-----------|------|
| `ping google.com` | ICMP | ❌ 不走代理 | ping 使用 ICMP 协议，不受 HTTP 代理影响 |
| `curl https://google.com` | HTTP/HTTPS | ✅ 走代理 | curl 会读取 http_proxy 环境变量 |
| `wget https://google.com` | HTTP/HTTPS | ✅ 走代理 | wget 会读取 http_proxy 环境变量 |
| `git clone` (HTTP) | HTTP/HTTPS | ✅ 走代理 | HTTP/HTTPS 协议的 git 会走代理 |
| `git clone` (SSH) | SSH | ⚠️ 需单独配置 | SSH 协议需要额外配置 ProxyCommand |

### Git SSH 代理配置（可选）

如果需要通过 SSH 协议使用代理：

```bash
# 编辑 SSH 配置
nano ~/.ssh/config

# 添加以下内容
Host github.com
    ProxyCommand nc -v -x 127.0.0.1:7897 %h %p
```

---

## 配置总结

✅ **完成清单：**

- [ ] 配置 `.wslconfig` 启用网络镜像模式
- [ ] 重启 WSL 使网络配置生效
- [ ] 在 `~/.bashrc` 中添加代理环境变量
- [ ] 验证代理是否生效
- [ ] 测试外网和国内网站访问

---

## 参考资料

- [WSL2 网络模式文档](https://learn.microsoft.com/zh-cn/windows/wsl/wsl-config)
- [WSL GitHub 仓库](https://github.com/microsoft/WSL)

































