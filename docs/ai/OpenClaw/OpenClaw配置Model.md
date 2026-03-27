# OpenClaw配置Model

## 1.配置百炼

```json
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
  },
```

## 2.配置本地模型(Ollama + Qwen)

```json
ollama: {
        baseUrl: 'http://192.168.3.100:11434/v1',
        apiKey: '__OPENCLAW_REDACTED__',
        models: [
          {
            id: 'qwen3.5:4b',
            name: 'Qwen3.5-4B',
            reasoning: false,
            input: [
              'text',
            ],
            cost: {
              input: 0,
              output: 0,
              cacheRead: 0,
              cacheWrite: 0,
            },
            contextWindow: 32768,
            maxTokens: 8192,
          }
        ]
      }
    },

agents: {
    defaults: {
      model: {
        primary: 'ollama/qwen3.5:4b',
      },
      models: {
        'bailian/qwen3.5-plus': {},
        'bailian/qwen3-coder-next': {},
        'ollama/qwen3.5:4b': {},
      },
      workspace: '/home/zhouwei/.openclaw/workspace',
      compaction: {
        mode: 'safeguard',
      },
      maxConcurrent: 4,
      subagents: {
        maxConcurrent: 8,
      }
    }
  },
```

注意点:

1.ollama的配置baseUrl IP是电脑本机的ip，如果ollama在windows本机，openclaw在wsl ubuntu中，需要看一下ip地址是多少，不要盲目127.0.0.1

2.本地模型配置后，延迟比较高，和机器的配置有关



## 3.ollama安装huggingface很卡，设置一下环境变量

```powershell
# 设置镜像源（PowerShell 管理员）
[Environment]::SetEnvironmentVariable("OLLAMA_MODELS", "https://ollama.mirrors.est-unix.cn", "User")

# 关闭 Ollama
taskkill /F /IM ollama.exe

# 重新打开 Ollama 应用

# 然后下载（会走国内镜像）
# 使用 HF-Mirror 下载
ollama pull hf.co/HauhauCS/Qwen3.5-9B-Uncensored-HauhauCS-Aggressive:Q4_K_M （镜像源切换了之后，下载很快）
curl -L -o qwen3.5-4b-q4_k_m.gguf https://hf-mirror.com/bartowski/Qwen3.5-4B-GGUF/resolve/main/Qwen3.5-4B-Q4_K_M.gguf（单独下载文件或者huggingface网站下载，都很慢）
```

gguf文件虽然下载成功了，但是安装总是失败, 切换了镜像源也是失败，最后放弃安装这种量化模型了

```text
Error: max retries exceeded: Get "https://huggingface.co/v2/HauhauCS/Qwen3.5-9B-Uncensored-HauhauCS-Aggressive/blobs/sha256:e8b41bd7e9bcbc408abffef18491cba9652b2f618ecf60fe23f01b070bd36374?__sign=eyJhbGciOiJFZERTQSJ9.eyJyZWFkIjp0cnVlLCJwZXJtaXNzaW9ucyI6eyJyZXBvLmNvbnRlbnQucmVhZCI6dHJ1ZX0sImlhdCI6MTc3NDU0MjM5Miwic3ViIjoiL0hhdWhhdUNTL1F3ZW4zLjUtOUItVW5jZW5zb3JlZC1IYXVoYXVDUy1BZ2dyZXNzaXZlIiwiZXhwIjoxNzc0NTQyOTkyLCJpc3MiOiJodHRwczovL2h1Z2dpbmdmYWNlLmNvIn0.d0z3STZbaJAtBWJZP8k1pk7hMfQvulMMXe9KtdXDYrzj8VnH8OL2joM76zCi5jMt7lIEWxCjE4onMxcbr-XnCA": dial tcp 128.242.240.59:443: connectex: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond.
```



常用命令: 

查询列表: ollama list

删除模型：ollama rm qwen2.5:7b

执行模型: ollama run qwen3.5:4b