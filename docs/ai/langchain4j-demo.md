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



