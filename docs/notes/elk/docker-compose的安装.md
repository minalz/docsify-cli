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

如果出现版本号，即安装成功：

```sh
docker-compose version 1.27.4, build 40524192
```

---

## 🔧 3. 常见问题

### ❓ 提示 docker-compose 未识别命令

创建软连接：

```sh
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

### 📦 安装扩展源

如果还是提示不识别，安装以下扩展源：

```sh
sudo yum -y install epel-release
```

### 🐍 安装 python-pip 模块

```sh
sudo yum install python-pip
```

---

> 💡 **提示**：Docker Compose 是用于定义和运行多容器 Docker 应用程序的工具！
