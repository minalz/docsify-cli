## 一、会话功能-Aiservices工具类

### 编程式

![image-20250623230220664](http://img.minalz.cn/typora/image-20250623230220664.png)



1. 引入依赖
2. 生命接口
3. 使用AiServices为接口创建代理对象
4. 在Controller中注入并使用



### 声明式

![image-20250623231309295](http://img.minalz.cn/typora/image-20250623231309295.png)

加注解即可

## 二、会话功能流式调用

![image-20250623232302703](http://img.minalz.cn/typora/image-20250623232302703.png)



## 三、消息注解

@SystemMessage

@UserMessage



## 四、会话记忆

大模型是不具备记忆能力的，要想让大模型记住之前聊天的内容，唯一的办法就是把之前聊天的内容与新的提示词一起发给大模型

![image-20250624230135168](http://img.minalz.cn/typora/image-20250624230135168.png)



## 五、会话记忆隔离

![image-20250624231923354](http://img.minalz.cn/typora/image-20250624231923354.png)



![image-20250624232014202](http://img.minalz.cn/typora/image-20250624232014202.png)



## 六、会话功能-会话记忆持久化

### 1.这只是服务器的持久化，服务器重启了，也会丢失记忆

![image-20250624233150377](http://img.minalz.cn/typora/image-20250624233150377.png)

### 2.redis-持久化

![image-20250624233248582](http://img.minalz.cn/typora/image-20250624233248582.png)

### 3.实现步骤

![image-20250624233400449](http://img.minalz.cn/typora/image-20250624233400449.png)

## 七、RAG知识库-原理

![image-20250624235024382](http://img.minalz.cn/typora/image-20250624235024382.png)

### 1.灰色部分 langchain4j帮我们做了

![image-20250624235234894](http://img.minalz.cn/typora/image-20250624235234894.png)

### 2.用到了向量数据库：

Milvus、Chroma、Pinecone

RedisSearch(Redis)、pgvector(PostgreSQL)

![image-20250624235544051](http://img.minalz.cn/typora/image-20250624235544051.png)



![image-20250625000028785](http://img.minalz.cn/typora/image-20250625000028785.png)



![image-20250625000118667](http://img.minalz.cn/typora/image-20250625000118667.png)

![image-20250625000221679](http://img.minalz.cn/typora/image-20250625000221679.png)





![image-20250625000412396](http://img.minalz.cn/typora/image-20250625000412396.png)



### 3.langchain4j的检索流程图：

![image-20250625000437703](http://img.minalz.cn/typora/image-20250625000437703.png)



![image-20250625000711138](http://img.minalz.cn/typora/image-20250625000711138.png)



### 4.RAG原理总结：

1. 两个向量的余弦相似度越高,说明向量对应的文本相似度越高

2. 向量数据库使用流程
● 借助于向量模型,把文档知识数据向量化后存储到向量数据库
● 用户输入的内容,借助于向量模型转化为向量后,与数据库中的向量通过计算余弦相似度
的方式,找出相似度比较高的文本片段



## 八、RAG知识库-快速入门

![image-20250625222555606](http://img.minalz.cn/typora/image-20250625222555606.png)



## 九、RAG知识库-核心API

![image-20250625224905366](http://img.minalz.cn/typora/image-20250625224905366.png)



### 1.文档加载器,用于把磁盘或者网络中的数据加载进程序

FileSystemDocumentLoader,根据本地磁盘绝对路径加载

ClassPathDocumentLoader,相对于类路径加载

UrlDocumentLoader,根据url路径加载



### 2.文档解析器,用于解析使用文档加载器加载进内存的内容,把非纯文本数据转化成纯文本

TextDocumentParser,解析纯文本格式的文件

ApachePdfBoxDocumentParser,解析pdf格式文件

ApachePoiDocumentParser,解析微软的office文件,例如DOC、PPT、XLS

ApacheTikaDocumentParser(默认),几乎可以解析所有格式的文件

1.准备pdf格式的数据

2.引入依赖

3.指定解析器

```pom
<dependency>
    <groupId>dev.langchain4j</groupId>
    <artifactId>langchain4j-document-parser-apache-pdfbox</artifactId>
    <version>1.0.1-beta6</version>
</dependency>
```



### 3.文档分割器,用于把一个大的文档,切割成一个一个的小片段

DocuemntByParagraphSplitter,按照段落分割文本

DocumentByLineSplitter,按照行分割文本

DocumentBySentenceSplitter,按照句子分割文本

DocumentByWordSplitter,按照词分割文本

DocumentByCharacterSplitter,按照固定数量的字符分割文本

DocumentByRegexSplitter,按照正则表达式分割文本

DocumentSplitters.recursive( ... )(默认),递归分割器,优先段落分割,再按照行分割,再按照句子分割,再按照词分割

![image-20250625230325833](http://img.minalz.cn/typora/image-20250625230325833.png)

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

## 十、向量模型

![image-20250625230655569](http://img.minalz.cn/typora/image-20250625230655569.png)

![image-20250625230746855](http://img.minalz.cn/typora/image-20250625230746855.png)

![image-20250625230804733](http://img.minalz.cn/typora/image-20250625230804733.png)

## 十一、EmbeddingStore 用于操作向量数据库（添加、检索）

![image-20250625231716287](http://img.minalz.cn/typora/image-20250625231716287.png)



![image-20250625231910400](http://img.minalz.cn/typora/image-20250625231910400.png)

### 1.环境安装

```shell
docker pull redis:latest
安装redis:docker run --name redis -d -p 6379:6379 redis
停止原有的redis镜像:docdocker stop redis
删除原有的redis镜像:docker rm redis
安装带有向量化功能的redis:docker run --name redis-vector -d -p 6379:6379 --memory=2g redislabs/redisearch
可设置内存参数：--memory=512m
安装mysql: docker run -- name mysql-d -p 3307:3306-e MYSQL_ROOT_PASSWORD=1234 mysql
```

