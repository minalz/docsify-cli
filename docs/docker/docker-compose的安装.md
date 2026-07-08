# 🎼 Docker Compose 安装指南

> 📦 多容器服务编排工具安装教程

---

## 📖 1. 官方链接

[Docker Compose 官方文档](https://docs.docker.com/compose/install/)

---

## 📥 2. 下载与安装

### ✅ 非官方源（推荐，国内速度快）

```sh
sudo curl -L "https://get.daocloud.io/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" > /usr/local/bin/docker-compose
```

> 💡 几乎秒下载完！

### ❌ 官方源（不推荐，国内速度慢）

```sh
sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

### 🗑️ 卸载

```sh
sudo rm /usr/local/bin/docker-compose
```

### 🔐 赋权

```sh
sudo chmod +x /usr/local/bin/docker-compose
```

### ✅ 验证安装

```sh
docker-compose --version
```

或者

```sh
docker-compose version
```

如果出现版本号，即安装成功！✅

```sh
docker-compose version 1.27.4, build 40524192
```

### 🔧 如果出现 "docker-compose 未识别命令"

创建软连接：

```sh
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

---

## 💡 3. 常见问题

### ❓ 如果还是提示命令不识别

安装以下扩展源试试：

#### 1️⃣ 安装扩展源

```sh
sudo yum -y install epel-release
```

#### 2️⃣ 安装 python-pip 模块

```sh
sudo yum install python-pip
```

#### 3️⃣ 如果出现了未识别的字符

![未识别字符错误](http://img.minalz.cn/typora/ad983d5d993a5f181602bdd06e6d616.png)

**解决方式：**

下载的源文件有问题，可参考链接：[解决方法](https://blog.csdn.net/uoYevoLi520/article/details/131046798)

---

> 💡 **提示**：Docker Compose 是 Docker 官方编排工具，可以同时管理多个容器，非常适合微服务架构！
