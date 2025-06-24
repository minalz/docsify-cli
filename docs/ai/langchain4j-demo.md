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



