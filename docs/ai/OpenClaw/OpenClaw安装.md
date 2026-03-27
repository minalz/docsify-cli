# OpenClaw 安装指南

Windows 安装 OpenClaw 的两种方式

---

## 方式一：WSL2 + Ubuntu（官方推荐，最稳定）

这是官方推荐的方式，在 Windows 中运行 Linux 环境，兼容性和稳定性最好。

### 步骤 1：启用 WSL2

以管理员身份打开 PowerShell，执行：

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
wsl --set-default-version 2
```

执行完后**重启电脑**。

### 步骤 2：安装 Ubuntu

1. 打开 Microsoft Store
2. 搜索 **Ubuntu 22.04 LTS** 并安装
3. 首次启动时设置用户名和密码

### 步骤 3：在 Ubuntu 中安装 OpenClaw

# 更新系统
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git wget build-essential
```



# 安装 Node.js 22.x
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```



# 安装 OpenClaw
```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```



### 步骤 4：验证安装

```bash
openclaw --version
```



### 步骤 5：启动服务

```bash
openclaw gateway run --port 18789
```



然后在 Windows 浏览器打开 [http://localhost:18789](http://localhost:18789/) 即可使用。

| 操作     | 命令                       |
| :------- | :------------------------- |
| 启动     | `openclaw gateway start`   |
| 重启     | `openclaw gateway restart` |
| 关闭     | `openclaw gateway stop`    |
| 打开设置 | `openclaw config`          |
| 打开面板 | `openclaw dashboard`       |

## 方式二：Windows 原生安装（PowerShell）

> ⚠️ **未验证**，推荐使用方式一，更简单稳定。

如果你不想用 WSL2，可以直接在 Windows 中安装，但可能会遇到更多环境兼容性问题。