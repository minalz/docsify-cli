# 🛠️ MCP、Function Calling、Agent Skill 三者关系与演进

> 🔧 LLM 工具调用机制的演进：从 Function Calling 到 MCP 再到 Agent Skill

---

## ⏳ 一、时间演进脉络

```
2023-06                          2024-11                        2025~
    │                                │                              │
    ▼                                ▼                              ▼
Function Calling              MCP 协议发布               Agent Skill 体系成熟
(OpenAI GPT-3.5/4)          (Anthropic 开源)            (LangGraph / AutoGen
 LLM首次具备结构化              标准化工具接入协议             各厂商 Agent 框架)
 工具调用能力                    解决碎片化接入问题
```

| 时间 | 事件 | 意义 |
|------|------|------|
| 2023-06 | OpenAI 发布 Function Calling（GPT-3.5/4） | LLM 第一次能以结构化方式调用外部工具 |
| 2023-下半年 | LangChain Tool、各家框架各自实现工具调用 | 百花齐放但高度碎片化，各框架不兼容 |
| 2024-03 | LangGraph 发布，Agent 编排能力增强 | 多步骤、有状态的 Agent 工作流成为主流 |
| 2024-11 | Anthropic 开源 MCP（Model Context Protocol） | 统一工具接入标准，打破碎片化 |
| 2025 | OpenAI、Google 等主流厂商跟进支持 MCP | MCP 成为事实标准 |
| 2025 | Agent Skill 概念在各大框架中系统化落地 | 能力封装从单工具调用走向业务能力单元 |

---

## 🎯 二、三者本质定位

### 2.1 Function Calling —— LLM 的"手"

**本质：** LLM 与外部函数之间的**调用机制**，是 LLM 侧的能力。

**解决的问题：** LLM 只会输出文本，如何让它能触发真实的程序执行？

**工作方式：**
```
用户: "查一下北京明天天气"
    ↓
LLM 识别意图，输出结构化 JSON（而不是自然语言）：
{
  "name": "get_weather",
  "arguments": { "city": "北京", "date": "明天" }
}
    ↓
应用层拦截这个 JSON → 调用真实函数 → 结果返回给 LLM
    ↓
LLM 用结果生成最终回答
```

**局限性：**
- 每个工具都要在调用 LLM 时手动传入 Schema 定义
- 工具实现与 LLM 框架强绑定，换个框架就得重写
- 工具多了上下文膨胀，管理混乱
- 没有标准化，OpenAI / Claude / Gemini 各自格式不同

---

### 2.2 MCP（Model Context Protocol）—— 工具接入的"USB 标准"

**本质：** 外部系统暴露工具能力的**通信协议标准**，是基础设施层的规范。

**解决的问题：** 工具接入高度碎片化，每个 LLM 框架、每个工具都要单独适配。

**类比：**
> 没有 USB 标准之前，每个设备都有专属接口，换电脑就得换线。  
> MCP 就是 AI 工具接入领域的 USB-C，一次实现，到处可用。

**架构：**
```
┌─────────────────────────────────────────┐
│              MCP Client                  │
│  (Claude / GPT / LangGraph Agent 等)    │
└──────────────────┬──────────────────────┘
                   │  MCP 协议（JSON-RPC）
        ┌──────────┼──────────┐
        ▼          ▼          ▼
   MCP Server  MCP Server  MCP Server
   (CRM系统)   (数据库)    (文件系统)
```

**MCP Server 暴露的三类能力：**

| 类型 | 说明 | 示例 |
|------|------|------|
| **Tools** | 可执行的操作（有副作用） | 查询数据库、发送消息、创建订单 |
| **Resources** | 可读取的数据（无副作用） | 读取文件、获取配置 |
| **Prompts** | 预置的提示词模板 | 特定任务的 Prompt 片段 |

**MCP Tool 定义示例：**
```json
{
  "name": "query_customer_info",
  "description": "根据客户ID查询CRM中的客户详情，包含基本信息、联系方式、合同状态",
  "inputSchema": {
    "type": "object",
    "properties": {
      "customerId": {
        "type": "string",
        "description": "客户唯一标识ID"
      }
    },
    "required": ["customerId"]
  }
}
```

**与 Function Calling 的关系：**
- Function Calling 是 LLM 决策"要调用什么工具"的机制（LLM 侧）
- MCP 是工具如何被发现和调用的标准（基础设施侧）
- **两者是互补的**：LLM 通过 Function Calling 触发，通过 MCP 协议找到并执行工具

---

### 2.3 Agent Skill —— Agent 的"岗位职责"

**本质：** 对 Agent 一组相关业务能力的**封装和编排单元**，是业务逻辑层的抽象。

**解决的问题：** 单个工具调用解决不了复杂业务问题，需要将多个工具 + Prompt + 逻辑组合成可复用的能力单元。

**组成要素：**
```
Skill = 触发条件 + Prompt模板 + 工具集合 + 执行逻辑 + 输出格式
```

**示例（销售 Agent 的客户分析 Skill）：**
```python
class CustomerAnalysisSkill:
    name = "客户分析"
    description = "分析指定客户的续保可能性和销售策略"
    
    # 关联的 MCP Tools
    tools = [
        "query_customer_info",      # MCP Tool
        "query_contract_history",   # MCP Tool
        "query_visit_records",      # MCP Tool
        "query_opportunity_stage",  # MCP Tool
    ]
    
    # Prompt 模板
    system_prompt = """
    你是专业的销售分析助手，请根据以下客户数据：
    1. 分析客户续保可能性（高/中/低）
    2. 给出 3 条具体销售建议
    3. 识别潜在风险点
    """
    
    # 输出结构
    output_schema = {
        "renewal_probability": "string",
        "suggestions": "list",
        "risks": "list"
    }
```

---

## 🏗️ 三、三者层次关系

```
┌─────────────────────────────────────────────────────┐
│                   业务应用层                          │
│                                                     │
│   Agent Skill（客户分析 / 拜访辅助 / 审批处理...）    │  ← 业务能力单元
│   = Prompt + 逻辑编排 + 工具组合                     │
└─────────────────────────┬───────────────────────────┘
                          │ 使用
┌─────────────────────────▼───────────────────────────┐
│                   LLM 决策层                          │
│                                                     │
│         Function Calling / Tool Use                 │  ← LLM 调用机制
│         LLM 决定：何时调用、调用哪个、传什么参数      │
└─────────────────────────┬───────────────────────────┘
                          │ 调用
┌─────────────────────────▼───────────────────────────┐
│                   工具接入层                          │
│                                                     │
│              MCP（标准化协议）                        │  ← 接入规范
│         MCP Server → CRM / DB / 文件 / 外部API      │
└─────────────────────────────────────────────────────┘
```

**一次完整调用链路：**
```
用户: "分析客户张总的续保情况"
    ↓
Agent 路由 → 命中「客户分析 Skill」
    ↓
Skill 加载 Prompt 模板，LLM 开始推理
    ↓
LLM 通过 Function Calling 决策：需要调用 query_customer_info
    ↓
Agent 框架通过 MCP 协议调用 MCP Server
    ↓
MCP Server 查询 CRM 数据库，返回结构化数据
    ↓
LLM 拿到数据继续推理，再次 Function Calling → query_contract_history
    ↓
... 多轮工具调用 ...
    ↓
Skill 定义的输出格式 → 生成续保分析报告
```

---

## 📊 四、核心区别对比

| 维度 | Function Calling | MCP | Agent Skill |
|------|-----------------|-----|-------------|
| **定位** | LLM调用工具的机制 | 工具接入的协议标准 | 业务能力的封装单元 |
| **所在层次** | LLM决策层 | 基础设施层 | 业务逻辑层 |
| **解决问题** | LLM如何触发外部调用 | 工具如何标准化接入 | 复杂任务如何编排 |
| **实现位置** | LLM 模型内置能力 | 独立的 Server 服务 | Agent 框架内 |
| **粒度** | 单次函数调用 | 单个原子工具 | 多工具组合的完整能力 |
| **可移植性** | 与 LLM 厂商绑定 | 与框架无关，通用协议 | 与业务场景绑定 |
| **类比** | 手（执行动作） | USB接口（标准连接） | 岗位职责手册（做什么） |

---

## 🔄 五、演进逻辑总结

```
阶段一：蛮荒期（2023 上半年前）
  └── LLM 只能输出文本，工具调用靠 Prompt 让 LLM 输出特定格式文本，再手动解析
      缺点：不可靠、格式不固定、容易出错

阶段二：Function Calling 时代（2023-06）
  └── LLM 原生支持结构化工具调用，可靠性大幅提升
      缺点：工具定义散落各处，各框架各厂商不兼容，工具多时管理混乱

阶段三：MCP 标准化时代（2024-11）
  └── 工具接入有了统一协议，MCP Server 一次实现，任何支持 MCP 的 Agent 都能用
      解决了碎片化问题，生态开始繁荣

阶段四：Agent Skill 体系化（2025~）
  └── 在 MCP 工具标准化基础上，业务能力开始抽象为可复用的 Skill 单元
      Agent 不再是"工具的堆砌"，而是具备结构化业务能力的智能体
```

**本质演进方向：**
> 从"LLM 能调用工具"→"工具接入标准化"→"能力业务化封装"  
> 每一步都在解决上一步遗留的规模化和工程化问题。

---

## 💼 六、在实际项目中的应用（以 SalesPortalAgent 为例）

```
SalesPortalAgent
│
├── Agent Skills（业务能力层）
│   ├── 客户分析 Skill
│   ├── 商机洞察 Skill
│   ├── 拜访辅助 Skill
│   ├── 审批处理 Skill
│   └── 工单反馈 Skill
│
├── Function Calling / Tool Use（LLM决策层）
│   └── Qwen3 模型原生支持，LLM自主决策调用时机和参数
│
└── MCP Server（工具接入层）
    ├── CRM MCP Server → OceanBase / MySQL
    ├── 订单 MCP Server → 订单系统
    ├── 审批 MCP Server → 审批流引擎
    └── 知识库 MCP Server → ES + Faiss（RAG检索）
```

三者各司其职，共同构成完整的企业级 Agent 平台。
