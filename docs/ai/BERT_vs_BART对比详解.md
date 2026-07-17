# 📖 BERT vs BART 对比详解

> 📚 BART 是真实存在的模型，由 Facebook AI（现 Meta）于 2019 年发布，与 BERT 同属 Transformer 家族，但设计目标完全不同。

---

## 🏛️ 一、三大架构的位置关系

理解 BERT 和 BART 的区别，首先要明白 Transformer 的三种架构形态：

```
原始 Transformer（2017, Google）
         │
    ┌────┴────┐
    ▼         ▼
Encoder Only   Encoder-Decoder    Decoder Only
   │               │                  │
  BERT            BART               GPT
  RoBERTa         T5                 LLaMA
  ALBERT          mBART              DeepSeek
  （理解派）        （生成派-翻译/摘要）  （生成派-对话）
```

| 架构 | 代表模型 | 核心能力 |
|------|---------|---------|
| Encoder Only | BERT、RoBERTa | 文本理解、特征提取 |
| Encoder-Decoder | BART、T5、mBART | 序列到序列生成（翻译、摘要）|
| Decoder Only | GPT 系列、LLaMA | 自回归文本生成、对话 |

---

## 📋 二、基本信息对比

| 维度 | BERT | BART |
|------|------|------|
| 全称 | Bidirectional Encoder Representations from Transformers | Bidirectional and Auto-Regressive Transformers |
| 发布方 | Google | Facebook AI（Meta）|
| 发布时间 | 2018 年 10 月 | 2019 年 10 月 |
| 论文 | *BERT: Pre-training of Deep Bidirectional Transformers* | *BART: Denoising Sequence-to-Sequence Pre-training* |
| 架构 | **Encoder Only** | **Encoder + Decoder** |
| 参数量（Base） | 110M | 140M |
| 参数量（Large） | 340M | 400M |
| 开源地址 | HuggingFace: `bert-base-uncased` | HuggingFace: `facebook/bart-large` |

---

## 🏗️ 三、架构结构详解

### 3.1 BERT 架构

```
输入文本：  [CLS] The cat sat on the mat [SEP]
               ↓
         Token Embedding
       + Position Embedding
       + Segment Embedding
               ↓
    ┌─────────────────────┐
    │   Transformer       │
    │   Encoder Layer 1   │  ← 双向注意力（能看到全部 token）
    │   Encoder Layer 2   │
    │       ...           │
    │   Encoder Layer N   │
    └─────────────────────┘
               ↓
    输出：每个 token 的特征向量
    [CLS] 向量 → 用于分类任务
    各 token 向量 → 用于 NER、问答等
```

**关键特点：只有 Encoder，输出是向量，不生成新文字。**

### 3.2 BART 架构

```
损坏的输入：  The [MASK] sat [MASK] the mat
                  ↓
         ┌─────────────────┐
         │  Encoder（双向）  │  ← 完整读取损坏文本
         └────────┬────────┘
                  ↓ 上下文表示
         ┌─────────────────┐
         │  Decoder（单向）  │  ← 自回归逐词生成还原文本
         └────────┬────────┘
                  ↓
    生成输出：  The cat sat on the mat
```

**关键特点：Encoder 理解输入，Decoder 生成输出，天生支持文本生成。**

---

## 🎓 四、预训练任务对比

### 4.1 BERT 预训练：MLM + NSP

**MLM（Masked Language Model，遮蔽语言模型）：**
```
原文：   The cat sat on the mat
处理后： The [MASK] sat on [MASK] mat   ← 随机遮蔽 15% 的 token
目标：   预测被遮蔽的词是什么
```

**NSP（Next Sentence Prediction，下一句预测）：**
```
句子A：  The cat sat on the mat.
句子B：  It was a sunny day.         ← 判断B是否是A的下一句（50%是，50%随机）
目标：   二分类，IsNext / NotNext
```

### 4.2 BART 预训练：去噪自编码（Denoising Autoencoding）

BART 设计了 **5 种文本破坏方式**，训练模型从损坏文本还原原文：

| 破坏方式 | 示例 | 说明 |
|---------|------|------|
| **Token Masking** | The `[MASK]` sat on the mat | 随机替换为 MASK（与 BERT 类似）|
| **Token Deletion** | The sat on mat | 随机删除 token，模型需推断缺失位置 |
| **Text Infilling** | The `[MASK]` the mat | 连续多个 token 变成单个 MASK |
| **Sentence Permutation** | on the mat the cat sat | 打乱句子内部顺序 |
| **Document Rotation** | on the mat. The cat sat | 随机选一个 token 作为开头 |

```
训练流程：
损坏文本 → Encoder → 语义表示 → Decoder → 还原原文
                                目标：最大化原文的生成概率
```

---

## ⚖️ 五、核心能力对比

| 维度 | BERT | BART |
|------|------|------|
| 文本方向 | **双向**（同时看左右上下文） | Encoder 双向 + Decoder 单向 |
| 输出形式 | 特征向量（数字）| **生成文本**（新的词序列）|
| 理解能力 | ⭐⭐⭐⭐⭐ 极强 | ⭐⭐⭐⭐ 较强 |
| 生成能力 | ❌ 不能生成 | ⭐⭐⭐⭐⭐ 极强 |
| 摘要任务 | ❌ 不适合 | ⭐⭐⭐⭐⭐ 最佳选择 |
| 翻译任务 | ❌ 不适合 | ⭐⭐⭐⭐⭐ 非常适合 |
| 分类任务 | ⭐⭐⭐⭐⭐ 首选 | ⭐⭐⭐ 可以但不是最优 |
| NER 任务 | ⭐⭐⭐⭐⭐ 首选 | ⭐⭐⭐ 可以但不是最优 |
| 推理速度 | 快（仅 Encoder）| 较慢（Encoder+Decoder）|

---

## 🎯 六、适用场景

### BERT 擅长（理解类任务）

```
✅ 文本分类        — 情感分析、意图识别、垃圾邮件检测
✅ 命名实体识别     — 从文本中提取人名、地名、机构名
✅ 问答（抽取式）   — 从原文段落中找到答案的位置
✅ 语义相似度       — 判断两段文本是否表达相同含义
✅ 文本向量化       — 生成句子/段落的语义嵌入向量
✅ 关系抽取         — 判断实体间的关系类型
```

### BART 擅长（生成类任务）

```
✅ 文本摘要         — 将长文章压缩为短摘要（在 CNN/DailyMail 长期 SOTA）
✅ 机器翻译         — 跨语言文本转换
✅ 文本改写         — 同义改写、风格转换
✅ 对话生成         — 基于上下文生成回复
✅ 数据增强         — 生成训练样本
✅ 文本填充/补全     — 根据上下文补全缺失内容
✅ 问答（生成式）    — 生成答案而非抽取答案
```

---

## 💻 七、代码示例（HuggingFace）

### BERT 做文本分类

```python
from transformers import BertForSequenceClassification, BertTokenizer
import torch

model = BertForSequenceClassification.from_pretrained(
    "bert-base-chinese",
    num_labels=2  # 二分类：正面/负面
)
tokenizer = BertTokenizer.from_pretrained("bert-base-chinese")

text = "这个产品质量非常好，强烈推荐！"
inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)

with torch.no_grad():
    outputs = model(**inputs)
    logits = outputs.logits
    predicted_class = torch.argmax(logits, dim=1).item()

print(f"预测类别：{predicted_class}")  # 0=负面, 1=正面
```

### BERT 生成语义向量（用于 RAG）

```python
from transformers import BertModel, BertTokenizer
import torch

model = BertTokenizer.from_pretrained("bert-base-chinese")
tokenizer = BertTokenizer.from_pretrained("bert-base-chinese")
bert = BertModel.from_pretrained("bert-base-chinese")

text = "销售机会管理系统"
inputs = tokenizer(text, return_tensors="pt")
with torch.no_grad():
    outputs = bert(**inputs)

# [CLS] token 的向量作为句子语义表示（768维）
sentence_embedding = outputs.last_hidden_state[:, 0, :]
print(sentence_embedding.shape)  # torch.Size([1, 768])
```

### BART 做文本摘要

```python
from transformers import BartForConditionalGeneration, BartTokenizer

# 英文摘要（官方预训练模型）
model = BartForConditionalGeneration.from_pretrained("facebook/bart-large-cnn")
tokenizer = BartTokenizer.from_pretrained("facebook/bart-large-cnn")

article = """
    The sales portal system is a comprehensive digital platform designed for enterprise
    sales teams. It covers CRM, opportunity management, customer visits, business approvals,
    and AI Agent capabilities, enabling full lifecycle management of the sales process.
    The system integrates with SAP for data synchronization and supports million-scale
    data export with stream processing.
"""

inputs = tokenizer(
    article,
    return_tensors="pt",
    max_length=1024,
    truncation=True
)

summary_ids = model.generate(
    inputs["input_ids"],
    max_length=150,
    min_length=40,
    length_penalty=2.0,
    num_beams=4,           # Beam Search，生成质量更高
    early_stopping=True
)

summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
print(summary)
```

### BART 微调做中文摘要

```python
from transformers import MBartForConditionalGeneration, MBart50Tokenizer

# mBART-50 支持中文
model = MBartForConditionalGeneration.from_pretrained("facebook/mbart-large-50")
tokenizer = MBart50Tokenizer.from_pretrained("facebook/mbart-large-50")
tokenizer.src_lang = "zh_CN"

article = "这是一篇关于销售管理系统的详细介绍文章..."
inputs = tokenizer(article, return_tensors="pt")

generated_tokens = model.generate(
    **inputs,
    forced_bos_token_id=tokenizer.lang_code_to_id["zh_CN"]
)
summary = tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)
print(summary)
```

---

## 🔄 八、BART 的主要变体

| 模型 | 发布方 | 特点 |
|------|-------|------|
| **BART-base** | Meta | 6层Encoder+6层Decoder，140M参数 |
| **BART-large** | Meta | 12层Encoder+12层Decoder，400M参数 |
| **BART-large-CNN** | Meta | 在 CNN/DailyMail 微调，专用摘要 |
| **BART-large-XSUM** | Meta | 在 XSum 微调，极简摘要风格 |
| **mBART** | Meta | 多语言版本，支持 25 种语言翻译 |
| **mBART-50** | Meta | 扩展到 50 种语言 |
| **ProphetNet** | 微软 | 类 BART，预测未来 N 个 token |
| **PEGASUS** | Google | 专为摘要设计，抽取重要句子做预训练 |

---

## 🔗 九、与其他模型的关系

```
Transformer（2017）
│
├── Encoder Only
│   ├── BERT（2018, Google）         — 理解鼻祖
│   ├── RoBERTa（2019, Meta）        — BERT 强化版，去掉 NSP
│   ├── ALBERT（2019, Google）       — 参数共享，更轻量
│   └── ELECTRA（2020, Google）      — 判别器替代 MLM
│
├── Encoder-Decoder
│   ├── BART（2019, Meta）           — 去噪预训练，摘要/翻译
│   ├── T5（2019, Google）           — 统一 Text-to-Text 框架
│   ├── mBART（2020, Meta）          — BART 多语言版
│   └── PEGASUS（2020, Google）      — 摘要专用
│
└── Decoder Only
    ├── GPT-2（2019, OpenAI）        — 生成文本
    ├── GPT-3（2020, OpenAI）        — 175B，Few-shot
    └── LLaMA / Qwen / DeepSeek...  — 现代 LLM 主流架构
```

---

## 💼 十、选型建议

| 你的任务 | 推荐模型 | 原因 |
|---------|---------|------|
| 情感分类、意图识别 | **BERT / RoBERTa** | Encoder 理解能力强，微调简单 |
| 文本向量化（RAG/语义搜索）| **BERT / BGE / E5** | BGE 是 BERT 架构的向量化专用版 |
| 中文摘要生成 | **BART（mBART）/ T5** | Seq2Seq 天然适配 |
| 机器翻译 | **mBART-50 / Helsinki-NLP** | 多语言 BART 系列 |
| 现代对话/问答系统 | **Qwen / DeepSeek / LLaMA** | LLM 已全面替代 BERT/BART |
| 轻量本地 NLP 任务 | **BERT-base（110M）** | 资源消耗小，效果稳定 |

> **现实情况：** 在 LLM 时代，BERT/BART 的很多任务已被 GPT/LLaMA/Qwen 等大模型覆盖。但对于**资源受限的私有化部署**、**高性能向量化**（BGE 基于 BERT）、**轻量分类任务**，BERT 系模型依然是最实用的选择。

---

## 📝 十一、一句话总结

> **BERT 是"阅读理解专家"**：把文章读透，输出特征向量，适合理解和分析。  
> **BART 是"写作编辑专家"**：把乱稿或长文改写成好文章，适合生成和改写。  
> **本质区别**：BERT 没有解码器，不能生成新文本；BART 有完整编解码器，天生为生成任务设计。
