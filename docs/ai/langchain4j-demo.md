# 🧪 LangChain4j 实战教程

> 💻 Java 生态下的 LangChain 实现，企业级 AI 应用开发

---

## 目录

- [一、会话功能 - AiServices 工具类](#一会话功能---aiservices-工具类)
- [二、会话功能流式调用](#二会话功能流式调用)
- [三、消息注解](#三消息注解)
- [四、会话记忆](#四会话记忆)
- [五、会话记忆隔离](#五会话记忆隔离)
- [六、会话功能 - 会话记忆持久化](#六会话功能---会话记忆持久化)
- [七、RAG 知识库 - 原理](#七rag-知识库---原理)
- [八、RAG 知识库 - 快速入门](#八rag-知识库---快速入门)
- [九、RAG 知识库 - 核心 API](#九rag-知识库---核心-api)
- [十、向量模型](#十向量模型)
- [十一、EmbeddingStore](#十一embeddingstore)
- [十二、Tools 工具](#十二tools-工具)
- [十三、Tools 使用](#十三tools-使用)

---

## 一、会话功能 - AiServices 工具类

### 1. 编程式方式

![image-20250623230220664](http://img.minalz.cn/typora/image-20250623230220664.png)

**使用步骤：**

1. 引入依赖
2. 声明接口
3. 使用 `AiServices` 为接口创建代理对象
4. 在 Controller 中注入并使用

### 2. 声明式方式

![image-20250623231309295](http://img.minalz.cn/typora/image-20250623231309295.png)

加注解即可，更加简洁优雅。

---

## 二、会话功能流式调用

![image-20250623232302703](http://img.minalz.cn/typora/image-20250623232302703.png)

流式调用可以实现实时输出效果，提升用户体验。

---

## 三、消息注解

LangChain4j 提供了丰富的消息注解：

| 注解 | 说明 |
|:---|:---|
| `@SystemMessage` | 系统消息，定义 AI 的角色和行为 |
| `@UserMessage` | 用户消息，表示用户输入的内容 |

---

## 四、会话记忆

大模型本身**不具备记忆能力**。要想让大模型记住之前聊天的内容，唯一的办法就是把之前聊天的内容与新的提示词一起发给大模型。

![image-20250624230135168](http://img.minalz.cn/typora/image-20250624230135168.png)

> 💡 **核心原理**：通过将历史对话内容附加到当前请求中，实现"记忆"效果。

---

## 五、会话记忆隔离

在多用户场景下，需要为每个用户隔离会话记忆。

![image-20250624231923354](http://img.minalz.cn/typora/image-20250624231923354.png)

![image-20250624232014202](http://img.minalz.cn/typora/image-20250624232014202.png)

> 💡 **实现方式**：使用 `Memory ID` 来区分不同用户的会话。

---

## 六、会话功能 - 会话记忆持久化

### 1. 服务器内存持久化

⚠️ **注意**：这只是服务器的持久化，服务器重启后也会丢失记忆。

![image-20250624233150377](http://img.minalz.cn/typora/image-20250624233150377.png)

### 2. Redis 持久化

使用 Redis 进行持久化，可以实现跨重启的记忆保持。

![image-20250624233248582](http://img.minalz.cn/typora/image-20250624233248582.png)

### 3. 实现步骤

![image-20250624233400449](http://img.minalz.cn/typora/image-20250624233400449.png)

**关键点：**
- 配置 Redis 连接
- 实现 `ChatMemoryStore` 接口
- 在 AiServices 中指定存储实现

---

## 七、RAG 知识库 - 原理

### RAG 架构图

![image-20250624235024382](http://img.minalz.cn/typora/image-20250624235024382.png)

#### 1. 灰色部分 - LangChain4j 帮我们做了

![image-20250624235234894](http://img.minalz.cn/typora/image-20250624235234894.png)

#### 2. 用到了向量数据库

**常用向量数据库：**

| 类型 | 数据库 |
|:---|:---|
| 专用向量数据库 | Milvus、Chroma、Pinecone |
| 扩展支持 | RedisSearch (Redis)、pgvector (PostgreSQL) |

![image-20250624235544051](http://img.minalz.cn/typora/image-20250624235544051.png)

![image-20250625000028785](http://img.minalz.cn/typora/image-20250625000028785.png)

![image-20250625000118667](http://img.minalz.cn/typora/image-20250625000118667.png)

![image-20250625000221679](http://img.minalz.cn/typora/image-20250625000221679.png)

![image-20250625000412396](http://img.minalz.cn/typora/image-20250625000412396.png)

#### 3. LangChain4j 的检索流程图

![image-20250625000437703](http://img.minalz.cn/typora/image-20250625000437703.png)

![image-20250625000711138](http://img.minalz.cn/typora/image-20250625000711138.png)

#### 4. RAG 原理总结

1. ✅ **余弦相似度**：两个向量的余弦相似度越高，说明向量对应的文本相似度越高

2. ✅ **向量数据库使用流程**：
   - 借助于向量模型，把文档知识数据向量化后存储到向量数据库
   - 用户输入的内容，借助于向量模型转化为向量后，与数据库中的向量通过计算余弦相似度的方式，找出相似度比较高的文本片段

---

## 八、RAG 知识库 - 快速入门

![image-20250625222555606](http://img.minalz.cn/typora/image-20250625222555606.png)

---

## 九、RAG 知识库 - 核心 API

![image-20250625224905366](http://img.minalz.cn/typora/image-20250625224905366.png)

### 1. 文档加载器

用于把磁盘或者网络中的数据加载进程序。

| 加载器 | 说明 |
|:---|:---|
| `FileSystemDocumentLoader` | 根据本地磁盘绝对路径加载 |
| `ClassPathDocumentLoader` | 相对于类路径加载 |
| `UrlDocumentLoader` | 根据 URL 路径加载 |

### 2. 文档解析器

用于解析使用文档加载器加载进内存的内容，把非纯文本数据转化成纯文本。

| 解析器 | 说明 |
|:---|:---|
| `TextDocumentParser` | 解析纯文本格式的文件 |
| `ApachePdfBoxDocumentParser` | 解析 PDF 格式文件 |
| `ApachePoiDocumentParser` | 解析微软 Office 文件 (DOC、PPT、XLS) |
| `ApacheTikaDocumentParser` | **默认**，几乎可以解析所有格式的文件 |

**使用示例：**

1. 准备 PDF 格式的数据
2. 引入依赖：

```xml
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j-document-parser-apache-pdfbox</artifactId>
    <version>1.0.1-beta6</version>
</dependency>
```

3. 指定解析器

### 3. 文档分割器

用于把一个大的文档，切割成一个一个的小片段。

| 分割器 | 说明 |
|:---|:---|
| `DocumentByParagraphSplitter` | 按照段落分割文本 |
| `DocumentByLineSplitter` | 按照行分割文本 |
| `DocumentBySentenceSplitter` | 按照句子分割文本 |
| `DocumentByWordSplitter` | 按照词分割文本 |
| `DocumentByCharacterSplitter` | 按照固定数量的字符分割文本 |
| `DocumentByRegexSplitter` | 按照正则表达式分割文本 |
| `DocumentSplitters.recursive(...)` | **默认**，递归分割器，优先段落→行→句子→词 |

![image-20250625230325833](http://img.minalz.cn/typora/image-20250625230325833.png)

**代码示例：**

```java
DocumentSplitter documentSplitter = DocumentSplitters.recursive(
    每个片段最大容纳的字符,
    两个片段之间重叠字符的个数
);

EmbeddingStoreIngestor ingestor = EmbeddingStoreIngestor.builder()
    .embeddingStore(store)
    .documentSplitter(documentSplitter)
    .build();
```

---

## 十、向量模型

![image-20250625230655569](http://img.minalz.cn/typora/image-20250625230655569.png)

![image-20250625230746855](http://img.minalz.cn/typora/image-20250625230746855.png)

![image-20250625230804733](http://img.minalz.cn/typora/image-20250625230804733.png)

---

## 十一、EmbeddingStore

用于操作向量数据库（添加、检索）。

![image-20250625231716287](http://img.minalz.cn/typora/image-20250625231716287.png)

![image-20250625231910400](http://img.minalz.cn/typora/image-20250625231910400.png)

### 1. 环境安装

**Redis 向量数据库安装：**

```bash
# 安装普通 Redis
docker pull redis:latest
docker run --name redis -d -p 6379:6379 redis

# 停止并删除原有 Redis
docker stop redis
docker rm redis

# ⚠️ 警告：以下命令已过时，会导致 SpringBoot 启动时容器宕机
# docker run --name redis-vector -d -p 6379:6379 --memory=2g redislabs/redisearch

# ✅ 推荐使用 redis-stack
docker run --name redis-stack -d -p 6379:6379 redis/redis-stack
```

🔗 [Redis Stack 文档](https://hub.docker.com/r/redis/redis-stack)

**MySQL 安装：**

```bash
docker run --name mysql -d -p 3307:3306 -e MYSQL_ROOT_PASSWORD=1234 mysql
```

---

## 十二、Tools 工具

> 💡 以前叫 Function Calling，现在改名为 Tools

![image-20250626230542572](http://img.minalz.cn/typora/image-20250626230542572.png)

---

## 十三、Tools 使用

![image-20250627000055440](http://img.minalz.cn/typora/image-20250627000055440.png)

> 🎉 **好消息**：灰色部分 LangChain4j 都帮我们做了！

![image-20250627000224210](http://img.minalz.cn/typora/image-20250627000224210.png)

---

## 📝 总结

LangChain4j 为 Java 开发者提供了强大的 AI 应用开发能力：

- ✅ **简洁的 API 设计**：通过注解和接口快速开发
- ✅ **完整的 RAG 支持**：从文档加载到向量检索，一站式解决方案
- ✅ **灵活的记忆管理**：支持多种持久化方式
- ✅ **强大的 Tools 机制**：让 AI 能够调用外部工具

---

## 🔗 相关资源

- 📖 [LangChain4j 官方文档](https://docs.langchain4j.dev/)
- 💻 [GitHub 仓库](https://github.com/langchain4j/langchain4j)
- 💬 [社区讨论](https://github.com/langchain4j/langchain4j/discussions)
