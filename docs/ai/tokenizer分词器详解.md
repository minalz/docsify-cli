# 🔤 Tokenizer 分词器详解

> Tokenizer 是 NLP 和 LLM 的第一道关卡，负责将原始文本转换为模型能处理的 token 序列。分词粒度和策略直接影响模型的词表大小、处理效率和多语言能力。

---

## 一、为什么需要 Tokenizer

神经网络只能处理数字，无法直接处理文字。Tokenizer 的作用：

```
原始文本
    ↓  Tokenizer（分词）
token 序列：["I", "love", "NLP"]
    ↓  词表映射（token → id）
整数序列：[101, 2293, 17953]
    ↓  Embedding 层
浮点向量矩阵（模型真正的输入）
```

---

## 二、三大分词粒度

### 2.1 Word-level（词级分词）

按空格和标点切分，最直觉的方式。

```
输入：  "I love natural language processing"
输出：  ["I", "love", "natural", "language", "processing"]
映射：  [100, 2293, 3019, 2653, 6364]
```

**优点：**
- 直观，token 本身有完整语义
- 序列长度短

**缺点：**
- 词表极大（英文几十万词，中文更多）
- OOV 问题（Out Of Vocabulary）：遇到没见过的词只能替换为 `[UNK]`
- 形态变化问题："run"、"running"、"runs"、"ran" 被视为 4 个完全不同的词，无法共享语义

```python
# 传统 NLP 词级分词示例
text = "I love running"
tokens = text.split()  # ["I", "love", "running"]
# 词表中没有 "running" → [UNK]
```

---

### 2.2 Character-level（字符级分词）

按单个字符切分，极端细粒度。

```
输入：  "hello"
输出：  ["h", "e", "l", "l", "o"]

中文：  "我爱NLP"
输出：  ["我", "爱", "N", "L", "P"]
```

**优点：**
- 词表极小（英文 26 字母 + 标点 ≈ 数百个）
- 不存在 OOV 问题
- 天然处理拼写错误、新词

**缺点：**
- 序列太长，注意力计算成本 O(n²) 暴增
- 单字符缺乏语义，模型学习难度大
- "cat" 和 "concatenate" 共享字符但语义毫无关联

---

### 2.3 Subword（子词分词）— 现代 LLM 主流

介于词级和字符级之间的最优解：**常见词保留完整，罕见词拆成有意义的子单元**。

```
输入：  "unhappiness"
输出：  ["un", "##happy", "##ness"]   ← 前缀 un- 和后缀 -ness 有独立语义

输入：  "ChatGPT"
输出：  ["Chat", "G", "PT"]           ← 新词也能处理，不会 OOV
```

**核心思想：**
- 高频词 → 整体保留（"the"、"is"、"我"）
- 低频词 → 拆成子词组合（"tokenization" → "token" + "ization"）
- 词表大小可控（通常 3 万 ~ 15 万）

---

## 三、三种主流 Subword 算法

### 3.1 BPE（Byte Pair Encoding，字节对编码）

**来源：** 原为数据压缩算法，2015 年被引入 NLP。

**核心思路：** 从字符出发，反复合并出现频率最高的相邻字节对，直到达到目标词表大小。

**训练过程示例：**

```
初始语料（按字符拆开，词尾加</w>）：
  l o w </w>       频率 5
  l o w e r </w>   频率 2
  n e w e s t </w> 频率 6
  w i d e s t </w> 频率 3

第1步：统计相邻对频率
  e s: 9次（最高）→ 合并为 "es"

第2步：更新语料
  l o w </w>
  l o w e r </w>
  n e w es t </w>
  w i d es t </w>

第3步：继续统计 → "es t" 9次 → 合并为 "est"
...
不断重复，直到词表达到预设大小（如 50000）
```

**使用模型：** GPT-2、GPT-3、GPT-4、RoBERTa、LLaMA、Qwen、DeepSeek

```python
# HuggingFace BPE 分词示例
from transformers import GPT2Tokenizer
tokenizer = GPT2Tokenizer.from_pretrained("gpt2")

text = "I love tokenization"
tokens = tokenizer.tokenize(text)
# ['I', 'Ġlove', 'Ġtoken', 'ization']
# Ġ 表示词前有空格

ids = tokenizer.encode(text)
# [40, 1842, 11241, 1634]
```

---

### 3.2 WordPiece

**来源：** Google 为 BERT 设计，2016 年首次用于 Google 神经机器翻译。

**与 BPE 的区别：**
- BPE：合并**频率最高**的相邻对
- WordPiece：合并后**语言模型概率提升最大**的相邻对（更关注语言质量）

**标记规则：** 非词首的子词加 `##` 前缀。

```
输入：  "playing"
输出：  ["play", "##ing"]

输入：  "unhappiness"
输出：  ["un", "##happy", "##ness"]

输入：  "OpenAI"（未在词表中）
输出：  ["Open", "##A", "##I"]
```

**训练过程：**
```
初始：把所有词拆成字符
选择合并对的标准：maximize P(合并后语料) / P(合并前语料)
= 选择合并后使语言模型"困惑度"下降最多的那对
```

**使用模型：** BERT、DistilBERT、ELECTRA、ALBERT

```python
from transformers import BertTokenizer
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

text = "I love tokenization"
tokens = tokenizer.tokenize(text)
# ['i', 'love', 'token', '##ization']
# 注意：uncased 版本会转小写

ids = tokenizer.encode(text)
# [101, 1045, 2293, 19204, 3989, 102]
# 101=[CLS], 102=[SEP] 是自动添加的特殊 token
```

---

### 3.3 SentencePiece / Unigram LM

**来源：** Google 2018 年发布，专为多语言场景设计。

**核心创新：** 不依赖空格预分词，直接在原始字节/字符流上建模，天然支持中文、日文等无空格语言。

**两种模式：**
- **BPE 模式**：底层使用 BPE 算法，但输入不需要预先分词
- **Unigram 模式**：从一个大词表开始，反向剪枝，保留使语言模型损失最小的子词集合

```
英文处理：
"Hello world" → ["▁Hello", "▁world"]
▁ 表示词前有空格（等价于 GPT2 的 Ġ）

中文处理（无空格，直接建模）：
"我爱自然语言处理" → ["▁我", "爱", "自然", "语言", "处理"]
不需要先用 jieba 分词，模型自动学习

日文处理：
"東京に行く" → ["▁東京", "に", "行く"]
```

**Unigram 算法核心步骤：**
```
1. 从超大初始词表开始（如 100 万子词）
2. 计算每个子词的概率：P(subword)
3. 计算移除某子词后损失增加多少
4. 移除损失增加最少的 N% 子词
5. 重复直到词表达到目标大小（如 32000）
```

**使用模型：** LLaMA、Mistral、T5、mT5、Qwen（部分）、DeepSeek

```python
import sentencepiece as spm

# 训练 SentencePiece 分词器
spm.SentencePieceTrainer.train(
    input='corpus.txt',
    model_prefix='tokenizer',
    vocab_size=32000,
    model_type='bpe',          # 或 'unigram'
    character_coverage=0.9995, # 覆盖字符比例（中文建议 0.9995）
)

# 使用
sp = spm.SentencePieceProcessor()
sp.load('tokenizer.model')

print(sp.encode("我爱自然语言处理", out_type=str))
# ['▁我', '爱', '自然', '语言', '处理']

print(sp.encode("我爱自然语言处理", out_type=int))
# [22, 456, 1234, 567, 890]
```

---

### 3.4 tiktoken（OpenAI 的 BPE 实现）

**来源：** OpenAI 开源的 BPE 实现，GPT-3.5/4/LLaMA-3/Qwen3 使用。

**特点：**
- 在**字节（Byte）级别**做 BPE，而非字符级别
- 任何 Unicode 字符都能被字节表示，彻底消灭 OOV
- 速度极快（Rust 实现）

```python
import tiktoken

# GPT-4 使用的 cl100k_base 编码
enc = tiktoken.get_encoding("cl100k_base")

text = "我爱ChatGPT！"
tokens = enc.encode(text)
print(tokens)
# [33843, 101, 7983, 38, 2898, 0]

print(enc.decode(tokens))
# "我爱ChatGPT！"

# 查看 token 数量（计费依据）
print(len(tokens))  # 6 个 token
```

---

## 四、三种 Subword 算法核心对比

| 维度 | BPE | WordPiece | Unigram/SentencePiece |
|------|-----|-----------|----------------------|
| 合并策略 | 频率最高的字节对 | 最大化LM概率的字节对 | 从大词表反向剪枝 |
| 训练方向 | 自底向上（合并）| 自底向上（合并）| 自顶向下（剪枝）|
| 空格处理 | 需预先分词 | 需预先分词 | **不需要，直接建模** |
| OOV 问题 | tiktoken 字节级可消除 | `[UNK]` | 可消除 |
| 中文友好度 | 一般 | 一般 | **极佳** |
| 分词确定性 | 确定（贪心）| 确定（贪心）| 可概率采样（数据增强）|
| 代表模型 | GPT系列、LLaMA | BERT | T5、LLaMA、DeepSeek |

---

## 五、各大模型使用的分词器

| 模型 | 分词器类型 | 词表大小 | 中文效率 |
|------|-----------|---------|---------|
| BERT-base | WordPiece | 30,522 | 一般（单字切分）|
| BERT-base-Chinese | WordPiece | 21,128 | 良好（专用中文词表）|
| GPT-2 | BPE | 50,257 | 差（一个汉字2-3个token）|
| GPT-3 / GPT-4 | tiktoken (cl100k) | 100,277 | 良好 |
| LLaMA-2 | SentencePiece BPE | 32,000 | 一般 |
| **LLaMA-3** | **tiktoken** | **128,256** | **优秀（专门扩充中文）**|
| T5 | SentencePiece Unigram | 32,100 | 一般 |
| **Qwen3** | tiktoken | 151,936 | **极优秀** |
| **DeepSeek-V3** | SentencePiece | 129,280 | **极优秀** |
| ChatGLM | SentencePiece | 130,344 | **极优秀** |

> **词表越大 → 同样中文文本需要的 token 数越少 → 推理速度越快 → 费用越低**
>
> LLaMA-2（32K词表）处理"人工智能"可能需要 6-8 个 token；  
> LLaMA-3（128K词表）处理同样文字可能只需 2-4 个 token。

---

## 六、完整 Tokenizer 流程

```
原始文本："我爱NLP！"
    ↓
① 预处理（Normalization）
   小写化、Unicode 标准化、去除特殊字符
   → "我爱nlp！"

    ↓
② 预分词（Pre-tokenization）
   按空格/标点初步切分（SentencePiece跳过此步）
   → ["我爱nlp", "！"]

    ↓
③ 子词切分（Subword Tokenization）
   应用 BPE/WordPiece/Unigram 算法
   → ["▁我", "爱", "nl", "##p", "！"]

    ↓
④ 特殊 token 添加（Post-processing）
   BERT: [CLS] + tokens + [SEP]
   GPT:  tokens + <|endoftext|>
   → ["[CLS]", "▁我", "爱", "nlp", "！", "[SEP]"]

    ↓
⑤ 映射到 token id（Numericalization）
   → [101, 2769, 4263, 17953, 106, 102]

    ↓
⑥ 转为 Tensor（模型输入）
   input_ids:      [101, 2769, 4263, 17953, 106, 102]
   attention_mask: [  1,    1,    1,     1,   1,   1]
   token_type_ids: [  0,    0,    0,     0,   0,   0]  ← BERT专有
```

---

## 七、中文分词特殊性

英文有天然空格分隔，中文没有，这是特别需要关注的问题。

### 7.1 三种中文处理方式

```
方式一：字符级（大多数现代模型的中文处理）
"我爱北京天安门" → ["我", "爱", "北", "京", "天", "安", "门"]
优点：简单，无歧义；缺点：序列长

方式二：词级（jieba 等传统 NLP 工具）
"我爱北京天安门" → ["我", "爱", "北京", "天安门"]
优点：语义单元完整；缺点：分词歧义（"研究生命科学" vs "研究/生命/科学"）

方式三：子词（现代 LLM 主流）
"我爱北京天安门" → ["▁我", "爱", "北京", "天安门"]
自动学习最优粒度，"北京"作为高频词被整体保留
```

### 7.2 中文分词歧义示例

```
"南京市长江大桥"
分法A：南京市 / 长江大桥   （城市 + 桥名）
分法B：南京市长 / 江大桥   （市长 + 桥名）

"结婚的和尚未结婚的"
分法A：结婚的 / 和 / 尚未结婚的
分法B：结婚的和尚 / 未结婚的
```

现代 LLM 通过大规模训练数据，让模型自己学习上下文消歧，而不依赖规则分词器。

---

## 八、代码实战

### 8.1 HuggingFace 通用分词

```python
from transformers import AutoTokenizer

# 自动选择对应模型的 Tokenizer
tokenizer = AutoTokenizer.from_pretrained("bert-base-chinese")

text = "我爱自然语言处理"
# 编码
encoding = tokenizer(
    text,
    return_tensors="pt",
    padding=True,
    truncation=True,
    max_length=128
)
print(encoding["input_ids"])
# tensor([[101, 2769, 4263, 5632, 4197, 6427, 8192, 1905, 4415, 102]])

# 解码回文本
decoded = tokenizer.decode(encoding["input_ids"][0])
print(decoded)
# "[CLS] 我 爱 自 然 语 言 处 理 [SEP]"

# 查看 token
tokens = tokenizer.convert_ids_to_tokens(encoding["input_ids"][0].tolist())
print(tokens)
# ['[CLS]', '我', '爱', '自', '然', '语', '言', '处', '理', '[SEP]']
```

### 8.2 统计 token 数量（LLM 计费）

```python
import tiktoken

enc = tiktoken.get_encoding("cl100k_base")  # GPT-4 使用

texts = [
    "Hello, how are you?",           # 英文
    "你好，最近怎么样？",              # 中文
    "DeepSeek-V3 is amazing!",        # 英文+专有名词
]

for text in texts:
    tokens = enc.encode(text)
    print(f"文本: {text}")
    print(f"Token数: {len(tokens)}, IDs: {tokens}")
    print()
```

### 8.3 训练自定义 SentencePiece 分词器

```python
import sentencepiece as spm

# 训练（适合企业专有领域，如医疗、法律、金融）
spm.SentencePieceTrainer.train(
    input='domain_corpus.txt',     # 领域语料
    model_prefix='domain_tokenizer',
    vocab_size=50000,
    model_type='bpe',              # 或 unigram
    character_coverage=0.9995,     # 中文必须设高
    pad_id=0,
    unk_id=1,
    bos_id=2,
    eos_id=3,
    user_defined_symbols=['<sep>', '<cls>', '<mask>']  # 自定义特殊token
)

# 使用
sp = spm.SentencePieceProcessor(model_file='domain_tokenizer.model')
tokens = sp.encode("客户拜访记录显示合同续签概率较高", out_type=str)
print(tokens)
# ['▁客户', '拜访', '记录', '显示', '合同', '续签', '概率', '较高']
```

### 8.4 LLaMA 分词器（tiktoken）

```python
from transformers import AutoTokenizer

# LLaMA-3 使用 tiktoken
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Meta-Llama-3-8B")

text = "人工智能正在改变世界"
tokens = tokenizer.tokenize(text)
print(tokens)
# ['人工', '智能', '正在', '改变', '世界']  ← LLaMA-3 中文效率高

ids = tokenizer.encode(text)
print(f"Token数: {len(ids)}")  # 比 LLaMA-2 少很多
```

---

## 九、选型建议

| 场景 | 推荐分词器 | 原因 |
|------|-----------|------|
| 中文文本分类/NER | BERT-base-Chinese (WordPiece) | 专用中文词表，理解任务强 |
| 调用 GPT-4 API（计算费用）| tiktoken cl100k | 官方计费标准 |
| 本地部署 LLM（中文）| Qwen3 / DeepSeek tiktoken | 词表大，中文 token 效率高 |
| 多语言 NLP 任务 | SentencePiece Unigram | 不依赖空格，天然多语言 |
| 医疗/法律专有词汇 | 自训练 SentencePiece | 专有词汇整体保留 |
| RAG 文本切片 | 按 token 数切（用对应模型的 tokenizer）| 避免 token 超出上下文窗口 |

---

## 十、总结

```
粒度从粗到细：
Word > Subword > Character > Byte

现代 LLM 的选择：
Subword（BPE / WordPiece / SentencePiece）

核心权衡：
词表大小  ←————————————→  序列长度
   大：效率高，OOV少       小：计算快，但生词处理差
   
中文关键：
词表越大（Qwen3: 151K，DeepSeek: 129K）
→ 中文 token 越少
→ 相同上下文窗口能处理更多中文内容
→ API 调用费用更低
```
