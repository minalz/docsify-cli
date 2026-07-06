# 🔌 Apifox 对接接口

> 🛠️ 使用 Apifox 测试 AI 模型 API 接口

---

## 📖 什么是 Apifox？

**Apifox** 是一款 API 文档、调试、Mock、测试一体化协作平台，可以帮助开发者更高效地设计、调试和测试 API。

### ✨ 主要功能

- 📝 API 文档管理
- 🔍 API 调试工具
- 🎭 Mock 数据生成
- 🧪 自动化测试
- 👥 团队协作

---

## 🚀 对接 AI 模型 API

### 1. 创建 API 项目

**步骤 1：登录 Apifox**

访问 [Apifox 官网](https://www.apifox.cn) 并登录

**步骤 2：创建项目**

1. 点击 "新建项目"
2. 填写项目名称（如 "AI 模型测试"）
3. 选择项目类型
4. 点击 "创建"

---

### 2. 配置 AI 模型接口

#### 接口信息

以大模型对话接口为例：

| 配置项 | 值 |
|:---|:---|
| **请求方法** | `POST` |
| **请求地址** | `http://localhost:11434/v1/chat/completions` |
| **Content-Type** | `application/json` |

#### 请求参数

**Headers：**

```json
{
  "Content-Type": "application/json"
}
```

> 💡 **注意**：如果使用 Ollama 本地服务，通常不需要 API Key。如果使用云端服务，需要添加 `Authorization: Bearer <API_KEY>`

**Body（JSON 格式）：**

```json
{
  "model": "qwen3.5:4b",
  "messages": [
    {
      "role": "system",
      "content": "你是一个 helpful 的 AI 助手"
    },
    {
      "role": "user",
      "content": "你好，请介绍一下自己"
    }
  ],
  "stream": false,
  "temperature": 0.7,
  "max_tokens": 2048
}
```

#### 参数说明

| 参数 | 类型 | 必填 | 说明 |
|:---|:---|:---|:---|
| `model` | string | ✅ | 模型名称 |
| `messages` | array | ✅ | 对话消息列表 |
| `messages[].role` | string | ✅ | 角色：system / user / assistant |
| `messages[].content` | string | ✅ | 消息内容 |
| `stream` | boolean | ❌ | 是否流式输出（默认 false）|
| `temperature` | number | ❌ | 创造性程度（0-1）|
| `max_tokens` | number | ❌ | 最大输出 token 数 |

---

### 3. 在 Apifox 中配置接口

**步骤 1：新建接口**

1. 在项目中点击 "新建接口"
2. 填写接口名称（如 "大模型对话"）
3. 选择请求方法：`POST`
4. 填写请求路径

**步骤 2：配置请求体**

1. 切换到 "Body" 标签
2. 选择 "raw" 类型
3. 选择 "JSON" 格式
4. 粘贴上述 JSON 参数

**步骤 3：保存接口**

点击 "保存" 按钮

---

### 4. 测试接口

**步骤 1：发送请求**

点击 "发送" 按钮（或按 `Ctrl + Enter`）

**步骤 2：查看响应**

在响应区域查看返回结果：

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "qwen3.5:4b",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "你好！我是一个 AI 助手，很高兴为你服务..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 100,
    "total_tokens": 125
  }
}
```

#### 响应参数说明

| 参数 | 说明 |
|:---|:---|
| `id` | 对话唯一标识 |
| `model` | 使用的模型名称 |
| `choices[].message.content` | AI 回复内容 |
| `usage.prompt_tokens` | 输入 token 数 |
| `usage.completion_tokens` | 输出 token 数 |
| `usage.total_tokens` | 总 token 数 |

---

## 🧪 测试不同场景

### 1. 单轮对话

```json
{
  "model": "qwen3.5:4b",
  "messages": [
    {
      "role": "user",
      "content": "什么是人工智能？"
    }
  ]
}
```

### 2. 多轮对话（带上下文）

```json
{
  "model": "qwen3.5:4b",
  "messages": [
    {
      "role": "system",
      "content": "你是一个技术专家"
    },
    {
      "role": "user",
      "content": "什么是 LangChain？"
    },
    {
      "role": "assistant",
      "content": "LangChain 是一个..."
    },
    {
      "role": "user",
      "content": "它能做什么？"
    }
  ]
}
```

### 3. 流式输出

```json
{
  "model": "qwen3.5:4b",
  "messages": [
    {
      "role": "user",
      "content": "请写一篇关于 AI 的文章"
    }
  ],
  "stream": true
}
```

> 💡 **提示**：流式输出会在 Apifox 中实时显示生成过程。

---

## 🔑 配置云端 API

### 阿里云百炼

**请求地址：**
```
https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
```

**Headers：**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer DASHSCOPE_API_KEY"
}
```

**Body：**
```json
{
  "model": "qwen-plus",
  "messages": [
    {
      "role": "user",
      "content": "你好"
    }
  ]
}
```

### OpenAI

**请求地址：**
```
https://api.openai.com/v1/chat/completions
```

**Headers：**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer sk-xxxxxxxxxxxxxxxx"
}
```

---

## 💡 使用技巧

### 1. 使用环境变量

在 Apifox 中定义环境变量，方便切换不同环境：

```
{{base_url}}/v1/chat/completions
```

### 2. 保存常用请求

将常用的请求保存为用例，方便快速测试。

### 3. 自动化测试

创建测试用例，自动化验证 API 功能：

- 检查响应状态码
- 验证响应格式
- 测试边界条件

### 4. 生成文档

Apifox 可以自动生成美观的 API 文档，方便团队查阅。

---

## ❓ 常见问题

### Q1: 请求超时？

**解决方案：**
- 检查模型服务是否运行
- 增加超时时间设置
- 检查网络连接

### Q2: 返回错误？

**常见错误：**

| 错误码 | 说明 | 解决方案 |
|:---|:---|:---|
| 400 | 请求参数错误 | 检查 JSON 格式 |
| 401 | 未授权 | 检查 API Key |
| 404 | 接口不存在 | 检查 URL |
| 500 | 服务器错误 | 检查模型服务 |

### Q3: 如何测试本地 Ollama？

**步骤：**
1. 确保 Ollama 正在运行
2. 使用地址：`http://localhost:11434/v1/chat/completions`
3. 不需要 API Key
4. 发送测试请求

---

## 🔗 相关资源

- 📖 [Apifox 官方文档](https://www.apifox.cn/help/)
- 🌐 [Apifox 官网](https://www.apifox.cn)
- 📚 [OpenAI API 文档](https://platform.openai.com/docs/api-reference)
- 🔧 [Ollama API 文档](https://github.com/ollama/ollama/blob/main/docs/api.md)

---

> 💡 **提示**：Apifox 是测试 AI API 的利器，建议结合 Postman、curl 等工具一起使用，提高开发和调试效率。
