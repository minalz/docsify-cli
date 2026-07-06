# 🔧 Ollama 安装指南

> 🤖 本地 AI 模型运行环境搭建

---

## 📖 什么是 Ollama？

**Ollama** 是一个轻量级、易于使用的 AI 模型本地运行工具，支持在个人电脑上部署和运行各种大语言模型（LLM），如 Llama、Qwen、DeepSeek 等。

### ✨ 主要特性

- 🚀 **简单易用**：一条命令即可运行模型
- 💻 **本地部署**：保护数据隐私
- 📦 **模型丰富**：支持多种开源模型
- 🔧 **API 兼容**：提供 OpenAI 兼容的 API 接口

---

## 📥 安装步骤

### Windows 系统

**步骤 1：下载安装包**

访问 [Ollama 官网](https://ollama.com/download)，下载 Windows 版本的安装包。

**步骤 2：安装**

双击下载的安装包，按照提示完成安装。

**步骤 3：验证安装**

打开 PowerShell 或命令提示符，执行：

```bash
ollama --version
```

如果显示版本号，说明安装成功！✅

### macOS 系统

```bash
# 使用 Homebrew 安装
brew install ollama

# 或者直接下载安装包
# 访问 https://ollama.com/download
```

### Linux 系统

```bash
# 一键安装脚本
curl -fsSL https://ollama.com/install.sh | sh
```

---

## 🚀 快速开始

### 1. 运行第一个模型

```bash
# 下载并运行 DeepSeek 模型（1.5B 参数，适合低配置电脑）
ollama run deepseek-r1:1.5b
```

首次运行会自动下载模型，请耐心等待。

### 2. 查看已安装的模型

```bash
ollama list
```

### 3. 与模型对话

```bash
ollama run <模型名称>
```

例如：

```bash
ollama run qwen3.5:4b
```

### 4. 停止模型

```bash
# 停止正在运行的模型
ollama stop <模型名称>
```

### 5. 删除模型

```bash
ollama rm <模型名称>
```

---

## 🌐 配置 API 服务

Ollama 默认提供 OpenAI 兼容的 API 接口，可以在其他应用中使用。

### 查看 API 地址

默认地址：`http://localhost:11434`

### 测试 API

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "deepseek-r1:1.5b",
  "prompt": "你好，请介绍一下自己"
}'
```

### 配置其他应用

在支持 OpenAI API 的应用中，配置：

- **API Base URL**: `http://localhost:11434/v1`
- **API Key**: 任意值（如 `ollama`）
- **Model**: `deepseek-r1:1.5b` 或其他已安装的模型

---

## 📦 常用模型推荐

| 模型 | 大小 | 特点 | 适用场景 |
|:---|:---|:---|:---|
| `deepseek-r1:1.5b` | 1.5B | 轻量级，速度快 | 低配置电脑、快速测试 |
| `qwen3.5:4b` | 4B | 平衡性能和资源 | 日常使用 |
| `llama3.1:8b` | 8B | Meta 官方模型 | 通用对话 |
| `qwen3.5:14b` | 14B | 高质量输出 | 需要更好效果 |

### 下载模型

```bash
# 下载模型（不运行）
ollama pull <模型名称>

# 示例
ollama pull qwen3.5:4b
ollama pull llama3.1:8b
```

---

## ⚙️ 高级配置

### 修改监听地址

默认情况下，Ollama 只监听 localhost。如需远程访问：

**Windows (PowerShell)：**

```powershell
# 设置环境变量
[Environment]::SetEnvironmentVariable("OLLAMA_HOST", "0.0.0.0", "User")

# 重启 Ollama 服务
taskkill /F /IM ollama.exe
# 重新启动 Ollama
```

**Linux/macOS：**

```bash
# 编辑环境变量
export OLLAMA_HOST=0.0.0.0

# 重启服务
systemctl restart ollama
```

### 配置国内镜像源

如果下载模型很慢，可以配置国内镜像：

**Windows (PowerShell)：**

```powershell
[Environment]::SetEnvironmentVariable("OLLAMA_MODELS", "https://ollama.mirrors.est-unix.cn", "User")

# 重启 Ollama
taskkill /F /IM ollama.exe
```

**Linux/macOS：**

```bash
export OLLAMA_MODELS=https://ollama.mirrors.est-unix.cn
```

---

## 💡 使用技巧

### 1. 搭配 Chatbox 使用

Ollama 提供命令行界面，配合图形化客户端体验更好：

- 📥 下载 [Chatbox](https://chatboxai.app)
- ⚙️ 配置 API 地址为 `http://localhost:11434/v1`
- 💬 享受流畅的对话体验

### 2. 系统要求

| 配置 | 最低要求 | 推荐配置 |
|:---|:---|:---|
| CPU | 多核处理器 | 8核以上 |
| 内存 | 8GB | 16GB+ |
| 硬盘 | 10GB 可用空间 | SSD 20GB+ |
| GPU | 可选 | NVIDIA 4GB+ VRAM |

### 3. 性能优化

- 使用量化模型（如 4B、8B）降低资源占用
- 关闭不需要的后台程序
- 如有 GPU，启用 GPU 加速

---

## ❓ 常见问题

### Q1: 下载模型很慢怎么办？

**解决方案：**
- 配置国内镜像源（见上文）
- 选择较小的模型（如 1.5B、4B）
- 检查网络连接

### Q2: 运行时内存不足？

**解决方案：**
- 使用更小的模型（如 1.5B）
- 关闭其他占用内存的程序
- 增加虚拟内存

### Q3: API 无法访问？

**解决方案：**
```bash
# 检查 Ollama 是否运行
ollama list

# 检查端口是否监听
netstat -ano | findstr 11434

# 重启 Ollama 服务
taskkill /F /IM ollama.exe
# 重新启动
```

### Q4: 如何查看日志？

```bash
# Windows
# 在 Ollama 运行窗口查看

# Linux
journalctl -u ollama -f
```

---

## 🔗 相关资源

- 📖 [官方文档](https://ollama.com/docs)
- 🌐 [模型库](https://ollama.com/library)
- 💬 [社区讨论](https://github.com/ollama/ollama/discussions)
- 📥 [下载地址](https://ollama.com/download)

---

> 💡 **提示**：Ollama 是本地 AI 应用的基础工具，建议先熟练掌握其使用方法，再配合其他工具（如 Chatbox、LangChain 等）构建完整的 AI 应用。
