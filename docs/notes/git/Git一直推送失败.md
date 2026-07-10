# 🚫 Git 一直推送失败

> ⏱️ connect to host github.com port 22: Connection timed out

---

## 📖 问题描述

各种找方法改端口都试过了，无法成功，也进行了科学上网，仍然不行，结果第二天又可以了（没有任何改动），这是因为 GitHub 的 22 端口关闭了。

---

## 🔧 一、GitHub Push 总是报 22 端口超时

### 问题

```bash
ssh: connect to host github.com port 22: Connection timed out 
Could not read from remote repository. 
Please make sure you have the correct access rights and the repository exists.
```

### 解决方案

**Hosts 文件中直接填写映射**

#### 1️⃣ 查询 IP 映射

访问 [https://site.ip138.com/github.com/](https://site.ip138.com/github.com/)

查询 github.com 映射了哪些地址，然后 ping 一下 IP，看通不通。

#### 2️⃣ 将 IP 复制到 Hosts 中

```
20.27.177.113 github.com
140.82.121.3 github.com
```

#### 3️⃣ 重新推送即可

#### 4️⃣ 参考链接

- [解决 GitHub 连接问题](https://mp.weixin.qq.com/s?__biz=MzU2ODYyNDc4OQ==&mid=2247484873&idx=1&sn=8a661efd886a965da90c41e8fd41fdf6&poc_token=HNRbwGijwk7h7RXCuuQpfFd6StHxP9m04DfSBQPo)

---

## 🔧 二、Git 提交 443 端口连接超时

由于 HTTPS 推送经常出现推送失败的情况，可以改成 SSH 的方式：

**示例：**

```bash
# 原 HTTPS 链接
https://github.com/minalz/python-demo-01.git

# 更改为 SSH 方式
git remote set-url origin git@github.com:minalz/python-demo-01.git
```

