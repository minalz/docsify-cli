# Git一直推送失败

> connect to host github.com port 22: Connection timed out

各种找方法改端口都试过了，无法成功，也进行了科学上网，仍然不行，结果第二天又可以了（没有任何改动），这是因为github的22端口关闭了

# 一、Github Push总是报22端口超时

### 问题:

```ssh
ssh: connect to host github.com port 22: Connection timed out Could not read from remote repository. Please make sure you have the correct access rights and the repository exists.
```

### 解决方案：

hosts文件中直接填写映射

#### 1.https://site.ip138.com/github.com/

查询github.com映射了哪些地址，然后ping一下ip，看通不通

#### 2.将ip复制下来copy到hosts中

```
20.27.177.113 github.com
140.82.121.3 github.com
```

#### 3.重新推送即可

#### 4.参考链接：

https://mp.weixin.qq.com/s?__biz=MzU2ODYyNDc4OQ==&mid=2247484873&idx=1&sn=8a661efd886a965da90c41e8fd41fdf6&poc_token=HNRbwGijwk7h7RXCuuQpfFd6StHxP9m04DfSBQPo



# 二、git提交 443端口连接超时

由于https推送经常出现推送失败的情况，可以改成ssh的方式：
如
https://github.com/minalz/python-demo-01.git
更改为：
git remote set-url origin git@github.com:minalz/python-demo-01.git

