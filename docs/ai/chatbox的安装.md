# 💬 Chatbox 安装指南

> 🎨 AI 模型图形化客户端，让对话更优雅

---

## 📖 什么是 Chatbox？

**Chatbox** 是一款美观、易用的 AI 模型客户端应用，支持多种 AI 模型，提供友好的对话界面和丰富的功能。

### ✨ 主要特性

- 🎨 **美观界面**：现代化的 UI 设计
- 🤖 **多模型支持**：兼容 Ollama、OpenAI、Azure 等
- 💾 **本地存储**：对话历史本地保存
- 🔌 **API 兼容**：支持 OpenAI API 格式
- 💻 **跨平台**：Windows、macOS、Linux

---

## 📥 安装步骤

### 方式一：官网下载（推荐）

**步骤 1：访问官网**

打开 [Chatbox 官网](https://chatboxai.app)

**步骤 2：下载安装包**

根据你的操作系统选择对应版本：
- Windows: `.exe` 安装包
- macOS: `.dmg` 安装包
- Linux: `.AppImage` 或 `.deb` 包

**步骤 3：安装**

- **Windows**：双击 `.exe` 文件，按提示安装
- **macOS**：拖动 `.dmg` 中的应用到 Applications 文件夹
- **Linux**：赋予执行权限后运行

---

### 方式二：包管理器安装

**macOS (Homebrew)：**

```bash
brew install --cask chatbox
```

**Windows (Scoop)：**

```bash
scoop install chatbox
```

---

## 🚀 首次配置

### 1. 启动 Chatbox

安装完成后，启动 Chatbox 应用。

### 2. 选择模型提供商

首次启动会提示选择模型提供商，常见的选项：

| 提供商 | 说明 | 配置要求 |
|:---|:---|:---|
| **Ollama** | 本地模型 | 需先安装 Ollama |
| **OpenAI** | OpenAI 官方 API | 需要 API Key |
| **Azure OpenAI** | 微软 Azure 服务 | 需要 Azure 配置 |
| **自定义** | 其他兼容 API | 需要 API 地址 |

### 3. 配置 Ollama（推荐）

如果你已安装 Ollama，按以下步骤配置：

**步骤 1：选择 Ollama**

在模型提供商中选择 "Ollama"

**步骤 2：配置 API 地址**

```
API Base URL: http://localhost:11434/v1
```

**步骤 3：选择模型**

从下拉列表中选择已安装的模型，如：
- `deepseek-r1:1.5b`
- `qwen3.5:4b`
- `llama3.1:8b`

**步骤 4：测试连接**

点击 "Test" 或 "测试连接" 按钮，确认配置正确。

### 4. 配置其他 API

如果使用云端 API（如 OpenAI）：

```
API Base URL: https://api.openai.com/v1
API Key: sk-xxxxxxxxxxxxxxxxxxxxxxxx
Model: gpt-3.5-turbo 或 gpt-4
```

---

## 💡 使用技巧

### 1. 快捷键

| 快捷键 | 功能 |
|:---|:---|
| `Ctrl + N` | 新建对话 |
| `Ctrl + Enter` | 发送消息 |
| `Ctrl + Shift + N` | 清空当前对话 |
| `Ctrl + ,` | 打开设置 |

### 2. 对话管理

- **新建对话**：点击左上角 "+" 按钮
- **重命名对话**：右键点击对话标题
- **删除对话**：右键点击对话，选择删除
- **搜索对话**：使用顶部搜索框

### 3. 自定义设置

**外观设置：**
- 🎨 主题：亮色 / 暗色 / 跟随系统
- 📏 字体大小
- 💬 气泡样式

**功能设置：**
- 🔄 自动保存对话
- 📋 复制按钮显示
- ⌨️ Enter 键行为（发送 / 换行）

---

## 🔧 高级配置

### 1. 配置本地 API

如果使用本地部署的模型服务：

```
API Base URL: http://你的IP:端口/v1
API Key: 任意值（本地服务通常不需要）
Model: 模型名称
```

> ⚠️ **注意**：如果使用 WSL2 中的服务，IP 不能是 `127.0.0.1`，需要使用实际 IP。

### 2. 自定义模型参数

在设置中可以调整：

- **Temperature** (0-1)：创造性程度
  - 0：更 deterministic
  - 1：更有创造性
  
- **Max Tokens**：最大输出长度
  - 建议：2048 - 8192

- **Top P** (0-1)：采样策略
  - 建议：0.9

### 3. 导入/导出配置

**导出配置：**
1. 打开设置
2. 找到 "配置" 选项
3. 点击 "导出"
4. 保存配置文件

**导入配置：**
1. 打开设置
2. 点击 "导入"
3. 选择配置文件

---

## 📱 跨设备同步

### 方式一：手动同步

1. 在设备 A 导出配置和对话
2. 将文件传输到设备 B
3. 在设备 B 导入

### 方式二：云同步（如支持）

- 登录同一账号
- 自动同步对话历史
- 同步设置配置

---

## ❓ 常见问题

### Q1: 无法连接到 Ollama？

**解决方案：**

1. 检查 Ollama 是否运行：
   ```bash
   ollama list
   ```

2. 检查 API 地址是否正确：
   ```
   http://localhost:11434/v1
   ```

3. 测试 API 是否可访问：
   ```bash
   curl http://localhost:11434/api/tags
   ```

### Q2: 响应很慢？

**解决方案：**
- 使用更小的模型（如 1.5B、4B）
- 检查电脑配置是否足够
- 关闭其他占用资源的程序

### Q3: 对话历史丢失？

**解决方案：**
- 检查是否启用了自动保存
- 查看数据存储目录
- 导入之前的备份

### Q4: 如何更改模型？

**解决方案：**
1. 打开设置
2. 找到 "Model" 选项
3. 从下拉列表选择其他模型
4. 保存设置

### Q5: 支持哪些模型？

Chatbox 支持所有兼容 OpenAI API 格式的模型：
- ✅ Ollama 本地模型
- ✅ OpenAI GPT 系列
- ✅ Azure OpenAI
- ✅ 阿里云百炼
- ✅ 其他兼容 API

---

## 💻 与其他工具配合

### 1. Ollama + Chatbox（推荐）

```
Ollama（提供模型服务）
    ↓
Chatbox（图形化界面）
    ↓
用户（流畅的对话体验）
```

### 2. LangChain + Chatbox

- 使用 LangChain 构建 AI 应用
- 通过 API 暴露服务
- Chatbox 作为测试客户端

### 3. 多模型对比

在 Chatbox 中创建多个对话，分别配置不同模型，对比输出效果。

---

## 🔗 相关资源

- 📖 [官方文档](https://chatboxai.app/docs)
- 🌐 [官网下载](https://chatboxai.app)
- 💻 [GitHub 仓库](https://github.com/Bin-Huang/chatbox)
- 💬 [社区支持](https://github.com/Bin-Huang/chatbox/discussions)

---

> 💡 **提示**：Chatbox 是体验 AI 模型的绝佳工具，建议配合 Ollama 使用，既能保护隐私，又能获得良好的使用体验。
