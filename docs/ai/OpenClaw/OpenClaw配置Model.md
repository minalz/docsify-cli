# ⚙️ OpenClaw 配置 Model

> 🤖 配置 AI 模型提供商，支持云端和本地模型

---

## 目录

- [1. 配置阿里云百炼](#1-配置阿里云百炼)
- [2. 配置本地模型 (Ollama + Qwen)](#2-配置本地模型-ollama--qwen)
- [3. Ollama 安装优化](#3-ollama-安装优化)
- [常用命令](#常用命令)

---

## 1. 配置阿里云百炼

在配置文件中添加以下 JSON 配置：

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "bailian": {
        "baseUrl": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        "apiKey": "DASHSCOPE_API_KEY",
        "api": "openai-completions",
        "models": [
          {
            "id": "qwen3.5-plus",
            "name": "qwen3.5-plus",
            "reasoning": false,
            "input": ["text", "image"],
            "contextWindow": 1000000,
            "maxTokens": 65536
          },
          {
            "id": "qwen3-coder-next",
            "name": "qwen3-coder-next",
            "reasoning": false,
            "input": ["text"],
            "contextWindow": 262144,
            "maxTokens": 65536
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "bailian/qwen3.5-plus"
      },
      "models": {
        "bailian/qwen3.5-plus": {},
        "bailian/qwen3-coder-next": {}
      }
    }
  }
}
```

### 📋 模型参数说明

| 参数 | 说明 |
|:---|:---|
| `id` | 模型唯一标识符 |
| `name` | 模型显示名称 |
| `reasoning` | 是否支持推理模式 |
| `input` | 支持的输入类型（text、image 等）|
| `contextWindow` | 上下文窗口大小（token 数）|
| `maxTokens` | 最大输出 token 数 |

---

## 2. 配置本地模型 (Ollama + Qwen)

### 配置示例

```json
{
  "models": {
    "providers": {
      "ollama": {
        "baseUrl": "http://192.168.3.100:11434/v1",
        "apiKey": "__OPENCLAW_REDACTED__",
        "models": [
          {
            "id": "qwen3.5:4b",
            "name": "Qwen3.5-4B",
            "reasoning": false,
            "input": ["text"],
            "cost": {
              "input": 0,
              "output": 0,
              "cacheRead": 0,
              "cacheWrite": 0
            },
            "contextWindow": 32768,
            "maxTokens": 8192
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "ollama/qwen3.5:4b"
      },
      "models": {
        "bailian/qwen3.5-plus": {},
        "bailian/qwen3-coder-next": {},
        "ollama/qwen3.5:4b": {}
      },
      "workspace": "/home/zhouwei/.openclaw/workspace",
      "compaction": {
        "mode": "safeguard"
      },
      "maxConcurrent": 4,
      "subagents": {
        "maxConcurrent": 8
      }
    }
  }
}
```

### ⚠️ 重要注意事项

1. **IP 地址配置**
   - Ollama 的 `baseUrl` IP 必须是电脑的**实际 IP**
   - 如果 Ollama 在 Windows 本机，OpenClaw 在 WSL Ubuntu 中，需要查看实际 IP 地址
   - ❌ 不要盲目使用 `127.0.0.1`

2. **性能提示**
   - 本地模型响应延迟较高
   - 延迟与机器配置密切相关
   - 建议使用 4B 或 7B 的量化模型

---

## 3. Ollama 安装优化

### 🚀 设置国内镜像源

如果从 HuggingFace 下载模型很慢，可以设置国内镜像源：

**PowerShell 管理员模式：**

```powershell
# 设置镜像源
[Environment]::SetEnvironmentVariable("OLLAMA_MODELS", "https://ollama.mirrors.est-unix.cn", "User")

# 关闭 Ollama
taskkill /F /IM ollama.exe

# 重新打开 Ollama 应用
```

### 📥 下载模型

**使用 HF-Mirror 下载（推荐）：**

```bash
# 切换镜像源后，下载速度会很快
ollama pull hf.co/HauhauCS/Qwen3.5-9B-Uncensored-HauhauCS-Aggressive:Q4_K_M
```

**直接下载 GGUF 文件（不推荐，速度慢）：**

```bash
curl -L -o qwen3.5-4b-q4_k_m.gguf https://hf-mirror.com/bartowski/Qwen3.5-4B-GGUF/resolve/main/Qwen3.5-4B-Q4_K_M.gguf
```

### ❌ 已知问题

GGUF 文件下载成功后，安装可能仍然失败：

```text
Error: max retries exceeded: Get "https://huggingface.co/v2/...": 
dial tcp 128.242.240.59:443: connectex: A connection attempt failed...
```

> 💡 **建议**：如果量化模型安装失败，可以切换其他模型或使用云端模型。

---

## 常用命令

| 命令 | 说明 | 示例 |
|:---|:---|:---|
| `ollama list` | 查询已安装的模型列表 | - |
| `ollama pull` | 下载模型 | `ollama pull qwen3.5:4b` |
| `ollama run` | 运行模型 | `ollama run qwen3.5:4b` |
| `ollama rm` | 删除模型 | `ollama rm qwen2.5:7b` |

---

## 🔗 相关资源

- 📖 [Ollama 官方文档](https://ollama.com/docs)
- 🌐 [阿里云百炼平台](https://bailian.console.aliyun.com/)
- 📦 [HuggingFace 镜像站](https://hf-mirror.com/)
