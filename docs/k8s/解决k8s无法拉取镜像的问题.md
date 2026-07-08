# 📦 解决 K8s 无法拉取镜像的问题

> ❌ 问题：使用 VirtualBox 搭建的 K8s 集群，从阿里云仓库下载镜像，`docker pull` 正常，但 K8s 拉取失败

---

## 🔍 问题描述

- ✅ Docker 拉取镜像：正常
- ❌ K8s 拉取镜像：失败

**原因**：K8s 在拉取私有镜像时需要进行身份验证

---

## 🛠️ 解决步骤

### 1️⃣ 确保 K8s 集群已安装

如果没有安装，请先根据官方文档安装 K8s 集群。

### 2️⃣ 登录 K8s 集群

```shell
kubectl get nodes
```

### 3️⃣ 创建 Docker Registry Secret

```shell
kubectl create secret docker-registry mysecret \
    --namespace=<your_namespace> \
    --docker-server=<your_registry_url> \
    --docker-username=<your_username> \
    --docker-password=<your_password> \
    --docker-email=<your_email>
```

**参数说明：**

| 参数 | 说明 | 示例 |
|:---|:---|:---|
| `<your_namespace>` | 命名空间（默认为 default） | `default` |
| `<your_registry_url>` | 镜像仓库地址 | `registry.cn-hangzhou.aliyuncs.com` |
| `<your_username>` | 用户名 | `yourname` |
| `<your_password>` | 密码 | `yourpassword` |
| `<your_email>` | 邮箱 | `your@email.com` |

### 4️⃣ 查看 Secret

```shell
kubectl get secrets -n <your_namespace>
```

### 5️⃣ 在 Deployment 中引用 Secret

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: mycontainer
        image: <your_image>:latest
        ports:
        - containerPort: 80
      imagePullSecrets:
      - name: mysecret
```

将 `<your_image>` 替换为您的镜像名称。

### 6️⃣ 部署应用

```shell
kubectl apply -f your_deployment.yaml
```

---

## 🔧 后续管理命令

### 删除 Secret

```shell
kubectl delete secret mysecret
```

### 编辑 Secret

```shell
kubectl edit secret mysecret
```

> ⚠️ **注意**：Secret 内容是加密的，此命令仅用于记录

---

## ⚠️ 重要提示

> 🔑 **Secret 不会同步到所有命名空间！**
> 
> 如果有多个命名空间，需要在每个命名空间中单独创建 Secret：
> 
> ```shell
> kubectl create secret docker-registry mysecret \
>     --namespace=namespace1 \
>     --docker-server=... \
>     --docker-username=... \
>     --docker-password=... \
>     --docker-email=...
> ```

---

## 📚 参考链接

[解决 K8s 无法拉取镜像](https://www.jianshu.com/p/bf6275f75334)

---

> 💡 **提示**：通过创建 `imagePullSecrets`，K8s 就可以成功从私有镜像仓库拉取镜像！
