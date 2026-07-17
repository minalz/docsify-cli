# ⚙️ LLM 核心技术详解：BBPE / RoPE / GeLU / SwiGLU

> 🔧 这四项技术分属 Transformer 的不同层次，共同构成现代大语言模型的技术基础。

---

## 📍 一、四者在模型中的位置

```
原始文本
    ↓
┌─────────────────────────────────────┐
│  Tokenizer 层                        │
│  BBPE（Byte-level BPE）              │  ← 文本 → token id
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Embedding 层                        │
│  token id → 向量                     │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  Transformer Block × N               │
│                                     │
│  ┌──────────────────────────────┐   │
│  │  Self-Attention 层            │   │
│  │  + RoPE（旋转位置编码）       │   │  ← 位置信息注入
│  └──────────────────────────────┘   │
│                                     │
│  ┌──────────────────────────────┐   │
│  │  FFN 层（前馈神经网络）        │   │
│  │  GeLU 或 SwiGLU（激活函数）   │   │  ← 非线性变换
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
               ↓
           输出结果
```

**简单记忆：**
- BBPE → 进门前的"翻译官"（文字变数字）
- RoPE → 模型的"时钟"（告诉每个词在第几位）
- GeLU/SwiGLU → 神经元的"开关"（决定信号怎么传递）

---

## 🔤 二、BBPE（Byte-level Byte Pair Encoding）

### 2.1 是什么

**所在层：** Tokenizer（分词层）  
**作用：** 将原始文本转换为模型可处理的 token id 序列

BBPE = 在**字节（Byte）**上做 BPE，而非字符上。

### 2.2 演进历史

```
Word-level（词级）
    ↓ 问题：OOV（词表外的词变成[UNK]），词表过大
Character-level（字符级）
    ↓ 问题：序列太长，单字符无语义
BPE（字符级字节对编码，2015）
    ↓ 问题：多语言字符无法覆盖，非英文 OOV
BBPE（字节级字节对编码，2019 GPT-2引入）
    → 彻底解决 OOV，任何语言均可处理
```

### 2.3 核心原理

任何文字在 UTF-8 下都是字节序列（0x00~0xFF，共 256 种）：

```
'A'   → [0x41]                    （1字节）
'中'  → [0xE4, 0xB8, 0xAD]        （3字节）
'😀'  → [0xF0, 0x9F, 0x98, 0x80]  （4字节）
```

BBPE 以这 256 个字节为初始词表，训练时反复合并高频字节对：

```
训练过程：
初始：256 个字节 token
步骤1：统计所有相邻字节对的出现频率
步骤2：合并最高频的字节对为新 token
步骤3：重复，直到词表达到目标大小（如 128K）

示例：
"中" = 0xE4 0xB8 0xAD 频繁出现
→ 先合并 [0xE4, 0xB8] → token_257
→ 再合并 [token_257, 0xAD] → token_258（代表"中"）
```

### 2.4 与普通 BPE 对比

| 维度 | 普通 BPE | BBPE |
|------|---------|------|
| 最小操作单元 | Unicode 字符 | 字节（0x00~0xFF）|
| 初始词表大小 | 语料字符数（不固定）| 固定 256 |
| OOV 问题 | 存在（未见字符→UNK）| **彻底消灭** |
| 多语言支持 | 需要语料覆盖 | **天然支持所有语言** |
| emoji/特殊符号 | 可能 UNK | **完美支持** |
| 引入模型 | GPT-1、BERT | GPT-2 起 |

### 2.5 代码示例

```python
import tiktoken  # OpenAI BBPE 实现

enc = tiktoken.get_encoding("cl100k_base")  # GPT-4

# 不同语言，无任何 UNK
print(enc.encode("Hello"))           # [9906]
print(enc.encode("你好"))             # [57668, 53901]
print(enc.encode("مرحبا"))           # [12159, 47643, 65, 247]
print(enc.encode("😀 🎉"))           # [76460, 9635, 102, 35039]

# 统计 token 数（API 计费依据）
text = "人工智能正在改变世界"
tokens = enc.encode(text)
print(f"token 数: {len(tokens)}")    # 约 7 个 token
```

### 2.6 使用 BBPE 的模型

**国外模型：**
| 模型 | 实现 | 词表大小 |
|------|------|---------|
| GPT-2 | BBPE（首次引入）| 50,257 |
| GPT-3 | tiktoken BBPE | 50,257 |
| GPT-3.5 / GPT-4 | tiktoken (cl100k_base) | 100,277 |
| GPT-5 | tiktoken | 未披露 |
| RoBERTa | BBPE | 50,265 |
| LLaMA-3 / 3.1 | tiktoken | 128,256 |
| LLaMA-4 | tiktoken | 128,256 |
| Mistral | SentencePiece BPE | 32,000 |

**国内模型：**
| 模型 | 实现 | 词表大小 |
|------|------|---------|
| Qwen2 / Qwen3 | tiktoken BBPE | 151,936 |
| DeepSeek-V2/V3 | SentencePiece BPE（类BBPE）| 129,280 |
| ChatGLM / GLM-4 | SentencePiece | 130,344 |
| Baichuan2 | SentencePiece BPE | 125,696 |

---

## 🔄 三、RoPE（Rotary Position Embedding，旋转位置编码）

### 3.1 是什么

**所在层：** Self-Attention 层（位置编码）  
**作用：** 将 token 的位置信息注入到注意力计算中，让模型知道每个 token 在序列中的位置

### 3.2 为什么需要位置编码

Transformer 的注意力机制本身是**位置无关的**（序列顺序打乱结果不变），必须人为注入位置信息：

```
"我 爱 你"  和  "你 爱 我"
如果不加位置编码，模型看到的特征完全相同！
```

### 3.3 位置编码的演进

```
绝对位置编码（Sinusoidal，2017 原始 Transformer）
    → 固定公式：PE(pos, 2i) = sin(pos/10000^(2i/d))
    → 问题：上下文长度固定，无法外推

可学习绝对位置编码（BERT、GPT-2）
    → 位置向量作为参数训练
    → 问题：训练长度之外的位置没有对应参数

相对位置编码（T5、Transformer-XL）
    → 编码 token 间的相对距离而非绝对位置
    → 问题：实现复杂，计算开销大

RoPE（2021, Su et al.）← 当前主流
    → 通过旋转矩阵将位置信息编码进 Q/K
    → 天然支持相对位置，且可外推到更长上下文
```

### 3.4 RoPE 核心原理

RoPE 的思想：将位置信息用**旋转变换**编码，使得 Q·K 的点积自然包含相对位置信息。

**数学表示（以 2D 为例）：**

```
对位置 m 的向量 x = [x1, x2]，旋转角度 θ = m × base^(-2i/d)

R(m) · x = [x1·cos(mθ) - x2·sin(mθ),
             x1·sin(mθ) + x2·cos(mθ)]

当计算注意力 Q·K^T 时：
q_m · k_n = (R(m)·q)^T · (R(n)·k)
           = q^T · R(m-n) · k
                   ↑
           只依赖相对位置 (m-n)，不依赖绝对位置！
```

**直觉理解：**
```
每个 token 的 Q 和 K 向量，根据它的位置被"旋转"一个角度
位置越靠后，旋转角度越大
两个 token 做点积时，旋转角度相抵，留下的是它们的"相对距离"信息
```

### 3.5 RoPE 的优势

| 特性 | 绝对位置编码 | RoPE |
|------|-----------|------|
| 相对位置感知 | ❌ 需要额外设计 | ✅ 天然具备 |
| 长度外推 | ❌ 超出训练长度性能下降 | ✅ 配合YaRN/ABF可外推 |
| 计算效率 | 高 | 高（仅需对Q/K做旋转）|
| 实现复杂度 | 低 | 中 |
| 参数量 | 有（可学习版本）| 无（纯计算）|

### 3.6 RoPE 扩展：YaRN / ABF

LLaMA-3.1 支持 128K 上下文，就是通过 **YaRN（Yet Another RoPE extensioN）** 实现的：

```
原始 RoPE：base = 10000（训练 4K 上下文）
ABF 方法：调大 base = 500000（扩展到 32K+）
YaRN 方法：动态调整不同频率分量的缩放比例（扩展到 128K+）
LongRoPE：进一步优化，支持 2M+ 上下文
```

### 3.7 代码示例

```python
import torch
import math

def apply_rotary_embedding(x, position_ids, dim):
    """简化版 RoPE 实现"""
    half_dim = dim // 2
    # 计算旋转频率
    freq = 1.0 / (10000 ** (torch.arange(0, half_dim) / half_dim))
    # 位置 × 频率
    angles = position_ids[:, :, None] * freq[None, None, :]  # [batch, seq, half_dim]
    # 构建旋转矩阵
    cos = torch.cos(angles).repeat(1, 1, 2)
    sin = torch.sin(angles).repeat(1, 1, 2)
    # 旋转操作：[x1,x2,...] → [x1·cos-x2·sin, x1·sin+x2·cos,...]
    x_rotated = x * cos + rotate_half(x) * sin
    return x_rotated

def rotate_half(x):
    """将向量后半部分旋转"""
    x1, x2 = x[..., :x.shape[-1]//2], x[..., x.shape[-1]//2:]
    return torch.cat([-x2, x1], dim=-1)
```

### 3.8 使用 RoPE 的模型

**国外模型：**
| 模型 | 位置编码 | 最大上下文 |
|------|---------|---------|
| GPT-2 / GPT-3 | 可学习绝对位置编码 | 2K / 4K |
| GPT-4 | 未披露（推测ALiBi或RoPE变体）| 128K |
| LLaMA-1 | RoPE | 2K |
| LLaMA-2 | RoPE | 4K |
| LLaMA-3 / 3.1 | RoPE + YaRN | 8K / **128K** |
| LLaMA-4 Scout | RoPE + 扩展 | **10M** |
| Mistral 7B | RoPE（sliding window）| 32K |
| Falcon | RoPE | 2K |

**国内模型：**
| 模型 | 位置编码 | 最大上下文 |
|------|---------|---------|
| Qwen1.5 / Qwen2 | RoPE + ABF | 32K |
| Qwen3 | RoPE + YaRN + DCA | 128K（扩展256K）|
| DeepSeek-V2 | RoPE | 128K |
| DeepSeek-V3 | RoPE | 128K |
| ChatGLM / GLM-4 | RoPE | 128K |
| Baichuan2 | ALiBi（7B）/ RoPE（13B）| 4K |
| Kimi K2 | RoPE | 128K（K2.5: 256K）|

---

## ⚡ 四、GeLU（Gaussian Error Linear Unit，高斯误差线性单元）

### 4.1 是什么

**所在层：** FFN（前馈神经网络）层  
**作用：** 非线性激活函数，决定神经元的激活方式，赋予模型非线性表达能力

### 4.2 激活函数的演进

```
Sigmoid（1980s）
    f(x) = 1/(1+e^(-x))
    问题：梯度消失（输出饱和区梯度→0）

ReLU（2010，Hinton）
    f(x) = max(0, x)
    优点：计算简单，缓解梯度消失
    问题：负数全部为0（"死亡神经元"），在x<0处不可导

ELU / SELU（2015-2016）
    对负数部分平滑处理
    问题：计算稍复杂

GeLU（2016, Hendrycks & Gimpel）← BERT/GPT的选择
    将 ReLU 的硬截断改为平滑的概率门控
    对 Transformer 效果更好

SwiGLU（2020, Google）← 现代LLM的选择
    引入门控机制，进一步提升性能
```

### 4.3 GeLU 公式

```
精确公式：
GeLU(x) = x · Φ(x)
         = x · P(X ≤ x)    X ~ N(0,1)
         = x · (1/2)[1 + erf(x/√2)]

近似公式（实际使用）：
GeLU(x) ≈ 0.5x · (1 + tanh[√(2/π) · (x + 0.044715x³)])
```

**直觉理解：**
```
ReLU：  x < 0 → 直接砍掉（硬门控）
GeLU：  x < 0 → 按概率保留（软门控）
         越负的值，被保留的概率越小
         但不是硬截断，保持了平滑性和可导性
```

**图形对比：**
```
        GeLU    ReLU
x = -2: -0.045  0      ← GeLU 不完全为0
x = -1: -0.158  0
x =  0:  0      0
x =  1:  0.841  1      ← GeLU ≈ ReLU（正数部分）
x =  2:  1.955  2
```

### 4.4 GeLU 的优势

| 特性 | ReLU | GeLU |
|------|------|------|
| 负数处理 | 硬截断为0 | 平滑软门控 |
| 可导性 | x=0处不可导 | 处处可导（平滑）|
| 死亡神经元 | 存在 | 极少 |
| 计算量 | 极低 | 中等（有tanh计算）|
| Transformer效果 | 一般 | **明显更好** |

### 4.5 代码示例

```python
import torch
import torch.nn.functional as F
import math

def gelu(x):
    """精确 GeLU"""
    return x * 0.5 * (1.0 + torch.erf(x / math.sqrt(2.0)))

def gelu_approx(x):
    """近似 GeLU（速度更快，BERT使用）"""
    return 0.5 * x * (1.0 + torch.tanh(
        math.sqrt(2.0 / math.pi) * (x + 0.044715 * x**3)
    ))

# PyTorch 内置
x = torch.tensor([-2.0, -1.0, 0.0, 1.0, 2.0])
print(F.gelu(x))
# tensor([-0.0454, -0.1587,  0.0000,  0.8413,  1.9545])
```

### 4.6 使用 GeLU 的模型

**国外模型：**
| 模型 | 激活函数 | 说明 |
|------|---------|------|
| BERT-base/large | GeLU | Google 2018 |
| GPT-2 | GeLU | OpenAI 2019 |
| GPT-3 | GeLU | OpenAI 2020 |
| RoBERTa | GeLU | Meta 2019 |
| ALBERT | GeLU | Google 2019 |
| DistilBERT | GeLU | HuggingFace 2019 |
| ELECTRA | GeLU | Google 2020 |

**国内模型（早期）：**
| 模型 | 激活函数 | 说明 |
|------|---------|------|
| ERNIE 1.0/2.0 | GeLU | 百度（BERT架构）|
| MacBERT | GeLU | 哈工大 |
| ChineseBERT | GeLU | 复旦 |

---

## 🚪 五、SwiGLU（Swish-Gated Linear Unit）

### 5.1 是什么

**所在层：** FFN（前馈神经网络）层  
**作用：** GeLU 的升级版激活函数，引入可学习的门控机制，是当前主流 LLM 的标配

### 5.2 从 GLU 到 SwiGLU 的演进

```
FFN 标准结构：
output = Linear2(activation(Linear1(x)))

GLU（Gated Linear Unit，2017 Dauphin et al.）：
output = (xW + b) ⊙ σ(xV + c)     ← sigmoid 门控
引入了门控思想，但 sigmoid 有饱和问题

Swish 激活函数（2017 Google）：
Swish(x) = x · σ(x) = x / (1 + e^(-x))
比 GeLU 计算更简单，效果相近

SwiGLU（2020, Noam Shazeer）：
SwiGLU(x, W, V) = Swish(xW) ⊙ (xV)
                 = (xW · σ(xW)) ⊙ (xV)
将 Swish 和 GLU 结合：用 Swish 做门控，线性变换做值
```

### 5.3 SwiGLU 公式详解

```python
# 标准 FFN（GeLU版）：
def ffn_gelu(x, W1, W2):
    return W2 @ gelu(W1 @ x)           # 2个权重矩阵

# SwiGLU FFN：
def ffn_swiglu(x, W_gate, W_up, W_down):
    gate = swish(W_gate @ x)            # 门控分支（Swish激活）
    up   = W_up @ x                    # 值分支（线性）
    hidden = gate * up                 # 逐元素相乘（门控）
    return W_down @ hidden             # 3个权重矩阵！
```

**注意：** SwiGLU FFN 需要 **3 个权重矩阵**（gate、up、down），而标准 FFN 只需 2 个。
为保持参数量相当，SwiGLU 的隐层维度通常设为标准 FFN 的 2/3：

```
标准 FFN：  d_model → 4·d_model → d_model     参数：2 × 4d²
SwiGLU FFN：d_model → (8/3)·d_model × 2 + down  参数：≈ 2 × 4d²（相当）
```

### 5.4 SwiGLU vs GeLU 对比

| 特性 | GeLU | SwiGLU |
|------|------|--------|
| 门控机制 | 软门控（固定公式）| **可学习门控（两分支）**|
| 权重矩阵数 | 2个（W1, W2）| 3个（gate, up, down）|
| 表达能力 | 强 | **更强**（门控增加灵活性）|
| 计算量 | 中 | 略高（多一个矩阵乘法）|
| 大模型效果 | GPT-3级别够用 | **LLaMA/PaLM实验证明更优** |
| 实现复杂度 | 低 | 中 |

### 5.5 为什么 SwiGLU 更好

```
直觉解释：
GeLU：每个神经元的"开关"强度是固定的（由输入x决定）
SwiGLU：
  - gate 分支：学习"什么信息重要"（动态门控）
  - up 分支：学习"信息的内容"（值）
  - 两者相乘：只让重要的信息通过

类比：
GeLU = 固定亮度的调光开关
SwiGLU = 可编程的智能调光系统（同时感知"需要多亮"和"有多亮"）
```

### 5.6 代码示例

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class SwiGLUFFN(nn.Module):
    """SwiGLU FFN 实现（LLaMA/Qwen/DeepSeek使用）"""
    def __init__(self, d_model, d_ffn=None):
        super().__init__()
        if d_ffn is None:
            # 2/3 × 4 × d_model，保持参数量与标准FFN相当
            d_ffn = int(2/3 * 4 * d_model)
            # 通常再取最近的256倍数
            d_ffn = ((d_ffn + 255) // 256) * 256

        self.w_gate = nn.Linear(d_model, d_ffn, bias=False)
        self.w_up   = nn.Linear(d_model, d_ffn, bias=False)
        self.w_down = nn.Linear(d_ffn, d_model, bias=False)

    def forward(self, x):
        gate   = F.silu(self.w_gate(x))  # Swish = SiLU in PyTorch
        up     = self.w_up(x)
        hidden = gate * up               # 逐元素门控
        return self.w_down(hidden)

class GeLUFFN(nn.Module):
    """标准 GeLU FFN（BERT/GPT-2/3使用）"""
    def __init__(self, d_model, d_ffn=None):
        super().__init__()
        d_ffn = d_ffn or 4 * d_model
        self.w1 = nn.Linear(d_model, d_ffn)
        self.w2 = nn.Linear(d_ffn, d_model)

    def forward(self, x):
        return self.w2(F.gelu(self.w1(x)))

# 对比
model_dim = 512
x = torch.randn(2, 10, model_dim)

swiglu_ffn = SwiGLUFFN(model_dim)
gelu_ffn   = GeLUFFN(model_dim)

print(swiglu_ffn(x).shape)  # [2, 10, 512]
print(gelu_ffn(x).shape)    # [2, 10, 512]
```

### 5.7 使用 SwiGLU 的模型

**国外模型：**
| 模型 | 激活函数 | 说明 |
|------|---------|------|
| PaLM | SwiGLU | Google 2022，首次大规模验证SwiGLU效果 |
| LLaMA-1/2/3 | SwiGLU | Meta，开源模型全系标配 |
| LLaMA-4 | SwiGLU | Meta 2025 |
| Mistral 7B | SwiGLU | 2023 |
| Falcon | GeLU | TII，较早模型 |
| Gemma 2 | GeGLU | Google（GeLU版门控变体）|
| GPT-4 | 未披露（推测SwiGLU）| OpenAI 保密 |

**国内模型：**
| 模型 | 激活函数 | 说明 |
|------|---------|------|
| Qwen1.5 / Qwen2 / Qwen3 | SwiGLU | 阿里全系标配 |
| DeepSeek-V1/V2/V3 | SwiGLU | 深度求索全系 |
| DeepSeek-R1 | SwiGLU | 推理增强版 |
| Kimi K2 | SwiGLU | Moonshot AI |
| GLM-4 | SwiGLU | 智谱 AI |
| Baichuan2 | SwiGLU | 百川智能 |
| InternLM2 | SwiGLU | 上海AI实验室 |
| Yi-34B | SwiGLU | 零一万物 |

---

## 📊 六、四者综合对比

### 6.1 定位对比

| 技术 | 类别 | 解决的问题 | 在模型中的位置 |
|------|------|-----------|--------------|
| **BBPE** | 分词算法 | 文本→token，消灭OOV，多语言支持 | 模型输入前 |
| **RoPE** | 位置编码 | 让模型感知token顺序和相对距离 | Self-Attention层 |
| **GeLU** | 激活函数 | FFN层非线性变换（平滑软门控）| FFN层 |
| **SwiGLU** | 激活函数 | FFN层非线性变换（可学习门控）| FFN层 |

### 6.2 技术演进时间线

```
2015  BPE 引入 NLP（普通BPE）
2016  GeLU 提出，开始替代 ReLU
2018  BERT：WordPiece + GeLU + 绝对位置编码
2019  BBPE 引入（GPT-2）
2019  GPT-2/3：BBPE + GeLU + 绝对位置编码
2020  RoPE 提出
2020  SwiGLU 提出（Shazeer）
2021  RoFormer：首次大规模验证 RoPE
2022  PaLM：SwiGLU 大规模验证，效果显著优于 GeLU
2023  LLaMA-1：BBPE/SP + RoPE + SwiGLU ← 现代标配确立
2023  LLaMA-2/Mistral/Qwen/DeepSeek 全部采用此组合
2024  LLaMA-3：词表扩充到 128K（中文效率提升）
2024  RoPE + YaRN：实现 128K 超长上下文
2025  Qwen3/DeepSeek-V3：词表进一步扩大，中文效率最优
```

### 6.3 现代 LLM 的标准技术栈

```
现代主流 LLM（LLaMA/Qwen/DeepSeek 标准配置）：

Tokenizer：BBPE（tiktoken 或 SentencePiece）
Embedding：Token Embedding（无位置编码参数）
Attention：Multi-Head Attention / GQA
位置编码：RoPE（+ YaRN 实现长上下文）
归一化：  RMSNorm（Pre-Norm，在层前）
激活函数：SwiGLU（FFN 三矩阵结构）
```

### 6.4 各大模型技术栈汇总

**国外模型：**

| 模型 | Tokenizer | 位置编码 | 激活函数 | 归一化 |
|------|-----------|---------|---------|-------|
| BERT | WordPiece | 可学习绝对 | GeLU | LayerNorm |
| GPT-2 | BBPE | 可学习绝对 | GeLU | LayerNorm |
| GPT-3 | BBPE | 可学习绝对 | GeLU | LayerNorm |
| GPT-4 | tiktoken BBPE | 未知 | 未知 | 未知 |
| GPT-5 | tiktoken BBPE | 未知 | 未知 | 未知 |
| LLaMA-1 | SP BPE | RoPE | SwiGLU | RMSNorm |
| LLaMA-2 | SP BPE | RoPE | SwiGLU | RMSNorm |
| LLaMA-3 | tiktoken BBPE | RoPE+YaRN | SwiGLU | RMSNorm |
| LLaMA-4 | tiktoken BBPE | RoPE | SwiGLU | RMSNorm |
| Mistral 7B | SP BPE | RoPE | SwiGLU | RMSNorm |
| PaLM | SP | RoPE | SwiGLU | LayerNorm |
| Gemma 2 | SP | RoPE | GeGLU | RMSNorm |

**国内模型：**

| 模型 | Tokenizer | 位置编码 | 激活函数 | 归一化 |
|------|-----------|---------|---------|-------|
| Qwen2 | tiktoken BBPE | RoPE+ABF | SwiGLU | RMSNorm |
| Qwen3 | tiktoken BBPE | RoPE+YaRN+DCA | SwiGLU | RMSNorm |
| DeepSeek-V2 | SP BPE | RoPE | SwiGLU | RMSNorm |
| DeepSeek-V3 | SP BPE | RoPE | SwiGLU | RMSNorm |
| DeepSeek-R1 | SP BPE | RoPE | SwiGLU | RMSNorm |
| GLM-4 | SP | RoPE | SwiGLU | LayerNorm |
| Kimi K2 | SP/tiktoken | RoPE | SwiGLU | RMSNorm |
| Baichuan2-7B | SP BPE | ALiBi | SwiGLU | RMSNorm |
| Baichuan2-13B | SP BPE | RoPE | SwiGLU | RMSNorm |
| InternLM2 | SP BPE | RoPE | SwiGLU | RMSNorm |
| Yi-34B | SP BPE | RoPE | SwiGLU | RMSNorm |
| ERNIE 3.0 | WordPiece | 绝对位置 | GeLU | LayerNorm |

---

## 📝 七、总结

```
技术选型的历史趋势：

分词器：WordPiece → BPE → BBPE（tiktoken）
         词表从 3万 → 5万 → 10万 → 15万（中文效率持续提升）

位置编码：绝对位置 → 可学习绝对 → ALiBi → RoPE → RoPE+YaRN
          上下文：2K → 4K → 32K → 128K → 1M → 10M

激活函数：ReLU → GeLU → SwiGLU
          效果逐步提升，SwiGLU 已成现代LLM事实标准

一句话：
如果你在 2024 年以后训练一个中文 LLM，
最优选择几乎是固定的：
  BBPE（词表15万+）+ RoPE + SwiGLU + RMSNorm
  这也是 Qwen3 / DeepSeek-V3 采用的方案。
```
