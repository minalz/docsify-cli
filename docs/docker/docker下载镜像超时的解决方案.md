# ⏱️ Docker 下载镜像超时的解决方案

> 🚀 解决 Docker Pull 镜像超时问题的完整指南

---

## ❓ 问题描述

使用了阿里云的镜像，但在 `docker pull` 镜像时仍然显示超时错误：

```
Error response from daemon: Get https://registry-1.docker.io/v2/: 
net/http: request canceled while waiting for connection 
(Client.Timeout exceeded while awaiting headers)
```

---

## 🔧 解决方案

### 更换多个镜像源

编辑 Docker 配置文件 `/etc/docker/daemon.json`，添加多个镜像源：

```json
{
  "registry-mirrors": [
    "https://docker.1panelproxy.com",
    "https://2a6bf1988cb6428c877f723ec7530dbc.mirror.swr.myhuaweicloud.com",
    "https://docker.m.daocloud.io",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com",
    "https://your_preferred_mirror",
    "https://dockerhub.icu",
    "https://docker.registry.cyou",
    "https://docker-cf.registry.cyou",
    "https://dockercf.jsdelivr.fyi",
    "https://docker.jsdelivr.fyi",
    "https://dockertest.jsdelivr.fyi",
    "https://mirror.aliyuncs.com",
    "https://dockerproxy.com",
    "https://mirror.baidubce.com",
    "https://docker.m.daocloud.io",
    "https://docker.nju.edu.cn",
    "https://docker.mirrors.sjtug.sjtu.edu.cn",
    "https://docker.mirrors.ustc.edu.cn",
    "https://mirror.iscas.ac.cn",
    "https://docker.rainbond.cc"
  ]
}
```

---

## 📝 配置步骤

### 1️⃣ 编辑配置文件

```bash
sudo vi /etc/docker/daemon.json
```

### 2️⃣ 添加镜像源配置

将上面的 JSON 配置复制到文件中

### 3️⃣ 重启 Docker 服务

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 4️⃣ 验证配置

```bash
docker info
```

在输出中查找 `Registry Mirrors`，确认配置已生效

---

## 🌐 常用国内镜像源

| 镜像源 | 地址 | 说明 |
|:---|:---|:---|
| 阿里云 | `https://mirror.aliyuncs.com` | 稳定可靠 |
| 华为云 | `https://XXXXXXXXX.mirror.swr.myhuaweicloud.com` | 需要注册获取 |
| DaoCloud | `https://docker.m.daocloud.io` | 速度快 |
| 网易 | `https://hub-mirror.c.163.com` | 老牌镜像源 |
| 百度 | `https://mirror.baidubce.com` | 稳定 |
| 中科大 | `https://docker.mirrors.ustc.edu.cn` | 教育网络 |
| 上海交大 | `https://docker.mirrors.sjtug.sjtu.edu.cn` | 教育网络 |

---

## 💡 常见问题

### Q1: 为什么配置了镜像源还是超时？

**解决方案：**
- 尝试更换其他镜像源
- 检查网络连接
- 配置多个镜像源（如上面的配置）
- 重启 Docker 服务

### Q2: 如何查看当前使用的镜像源？

```bash
docker info | grep -A 10 "Registry Mirrors"
```

### Q3: 配置不生效怎么办？

```bash
# 1. 检查配置文件语法
cat /etc/docker/daemon.json

# 2. 重新加载配置
sudo systemctl daemon-reload

# 3. 重启 Docker
sudo systemctl restart docker

# 4. 查看日志
sudo journalctl -u docker -f
```

---

> 💡 **提示**：建议配置多个镜像源，当一个源不可用时会自动切换到下一个源！
