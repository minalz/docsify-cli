# 📦 OpenClaw 安装指南

> 🪟 Windows 安装 OpenClaw 的两种方式

---

## 目录

- [方式一：WSL2 + Ubuntu（官方推荐，最稳定）](#方式一wsl2--ubuntu官方推荐最稳定)
- [方式二：Windows 原生安装（PowerShell）](#方式二windows-原生安装powershell)
- [常见问题](#常见问题)

---

## 方式一：WSL2 + Ubuntu（官方推荐，最稳定）

这是官方推荐的方式，在 Windows 中运行 Linux 环境，兼容性和稳定性最好。

### 步骤 1：启用 WSL2

以**管理员身份**打开 PowerShell，执行以下命令：

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
wsl --set-default-version 2
```

> ⚠️ **重要**：执行完后**重启电脑**。

### 步骤 2：安装 Ubuntu

1. 打开 **Microsoft Store**
2. 搜索 **Ubuntu 22.04 LTS** 并安装
3. 首次启动时设置用户名和密码

### 步骤 3：在 Ubuntu 中安装 OpenClaw

**更新系统并安装依赖：**

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git wget build-essential
```

**安装 Node.js 22.x：**

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

**安装 OpenClaw：**

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### 步骤 4：验证安装

```bash
openclaw --version
```

如果显示版本号，说明安装成功！✅

### 步骤 5：启动服务

```bash
openclaw gateway run --port 18789
```

然后在 Windows 浏览器打开：[http://localhost:18789](http://localhost:18789/) 即可使用。

### 📋 常用管理命令

| 操作 | 命令 | 说明 |
|:---|:---|:---|
| 🚀 启动 | `openclaw gateway start` | 启动网关服务 |
| 🔄 重启 | `openclaw gateway restart` | 重启网关服务 |
| ⏹️ 关闭 | `openclaw gateway stop` | 停止网关服务 |
| ⚙️ 设置 | `openclaw config` | 打开配置文件 |
| 📊 面板 | `openclaw dashboard` | 打开管理面板 |

---

## 方式二：Windows 原生安装（PowerShell）

> ⚠️ **未完全验证**，推荐使用方式一，更简单稳定。

如果你不想用 WSL2，可以直接在 Windows 中安装，但可能会遇到更多环境兼容性问题。

### 安装步骤

**1. 安装 Node.js**

- 访问 [Node.js 官网](https://nodejs.org/)
- 下载并安装 **Node.js 22.x** LTS 版本

**2. 安装 Git**

- 访问 [Git 官网](https://git-scm.com/)
- 下载并安装 Git for Windows

**3. 安装 OpenClaw**

打开 PowerShell，执行：

```powershell
npm install -g openclaw
```

**4. 验证安装**

```powershell
openclaw --version
```

**5. 启动服务**

```powershell
openclaw gateway run --port 18789
```

---

## 常见问题

### ❓ Q1: WSL2 安装失败怎么办？

**解决方案：**

1. 确保 Windows 版本在 2004 以上
2. 启用虚拟机平台功能
3. 以管理员身份运行 PowerShell
4. 查看 [WSL 官方文档](https://docs.microsoft.com/zh-cn/windows/wsl/install)

### ❓ Q2: 安装过程中网络超时？

**解决方案：**

```bash
# 设置 npm 镜像
npm config set registry https://registry.npmmirror.com

# 重新安装
curl -fsSL https://openclaw.ai/install.sh | bash
```

### ❓ Q3: 端口 18789 被占用？

**解决方案：**

```bash
# 查看端口占用
netstat -ano | findstr 18789

# 使用其他端口启动
openclaw gateway run --port 18790
```

### ❓ Q4: 如何更新 OpenClaw？

**解决方案：**

```bash
# WSL2 环境
curl -fsSL https://openclaw.ai/install.sh | bash

# 或者使用 npm
npm update -g openclaw
```

### ❓ Q5: 如何卸载 OpenClaw？

**解决方案：**

```bash
# 停止服务
openclaw gateway stop

# 使用 npm 卸载
npm uninstall -g openclaw

# 删除配置目录（可选）
rm -rf ~/.openclaw
```

---

## 💡 最佳实践

### 1. 推荐使用 WSL2

- ✅ 更好的兼容性
- ✅ 更稳定的运行环境
- ✅ 更容易排查问题
- ✅ 与 Linux 服务器环境一致

### 2. 定期更新

- 保持 OpenClaw 为最新版本
- 及时获取新功能和安全补丁

### 3. 备份配置

```bash
# 备份配置文件
cp ~/.openclaw/config.json ~/.openclaw/config.json.backup
```

### 4. 查看日志

```bash
# 查看服务日志
openclaw logs

# 实时跟踪日志
openclaw logs -f
```

---

## 🔗 相关资源

- 📖 [官方文档](https://openclaw.ai/docs)
- 💻 [GitHub 仓库](https://github.com/openclaw/openclaw)
- 💬 [社区讨论](https://github.com/openclaw/openclaw/discussions)
- 🐛 [问题反馈](https://github.com/openclaw/openclaw/issues)
