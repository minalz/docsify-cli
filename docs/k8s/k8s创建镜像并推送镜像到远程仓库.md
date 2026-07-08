# 🐳 K8s 创建镜像并推送到远程仓库

> 📦 Docker 镜像构建与阿里云镜像仓库推送指南

---

## 🏗️ 1. 根据 Dockerfile 创建镜像

```shell
# 构建 user-service 镜像
docker build -t user-image:v1.0 .

# 构建 order-service 镜像
docker build -t order-image:v1.0 .
```

> 💡 **提示**：`.` 表示当前目录下的 Dockerfile

---

## 📤 2. 推送镜像到阿里云仓库

### 登录阿里云镜像仓库

```shell
# 登录阿里云镜像仓库，然后输入密码
docker login --username=yourname registry.cn-hangzhou.aliyuncs.com
```

### 打标签

```shell
# 为镜像打上远程仓库标签
docker tag order-image:v1.0 registry.cn-hangzhou.aliyuncs.com/minalz-k8s-repo/order-image:v1.0
```

### 推送镜像

```shell
# 推送到阿里云镜像仓库
docker push registry.cn-hangzhou.aliyuncs.com/minalz-k8s-repo/order-image:v1.0
```

---

## 📋 操作流程总结

| 步骤 | 命令 | 说明 |
|:---|:---|:---|
| 1️⃣ | `docker build -t image:v1.0 .` | 构建本地镜像 |
| 2️⃣ | `docker login registry.cn-hangzhou.aliyuncs.com` | 登录远程仓库 |
| 3️⃣ | `docker tag image:v1.0 registry/.../image:v1.0` | 打远程标签 |
| 4️⃣ | `docker push registry/.../image:v1.0` | 推送到远程仓库 |

---

> 💡 **提示**：推送镜像到远程仓库后，K8s 集群就可以通过 `imagePullSecrets` 拉取该镜像进行部署！
