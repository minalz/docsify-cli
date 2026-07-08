# 🛠️ 使用 Minikube 搭建单节点 K8s

> 📦 本地 K8s 学习环境搭建指南

---

## ⚠️ 前置要求

> 需要科学上网

---

## 📥 1. 安装 kubectl

**官方文档**：[Install kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

---

## 📥 2. 安装 Minikube

**官方文档**：[Minikube Start](https://minikube.sigs.k8s.io/docs/start/)

---

## 🧪 3. 测试 Minikube

### 查看集群信息

```shell
# 查看连接信息
kubectl config view
kubectl config get-contexts
kubectl cluster-info
```

---

### 体验 Pod

#### 3.1 创建 Pod YAML

创建 `/usr/local/myapp/pod_nginx.yaml`：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80
```

#### 3.2 创建 Pod

```shell
kubectl apply -f pod_nginx.yaml
```

#### 3.3 查看 Pod

```shell
kubectl get pods
kubectl get pods -o wide
kubectl describe pod nginx
```

#### 3.4 进入 Nginx 容器

```shell
# 方式一：通过 kubectl 进入
kubectl exec -it nginx -- bash

# 方式二：通过 docker 进入
minikube ssh
docker ps
docker exec -it containerid bash
```

#### 3.5 访问 Nginx（端口转发）

```shell
# 若在 minikube 中，直接访问
# 若在物理主机上，要做端口转发
kubectl port-forward nginx 8080:80
```

#### 3.6 删除 Pod

```shell
kubectl delete -f pod_nginx.yaml
```

---

## ❓ 4. 常见问题

### 4.1 Minikube Start 启动报错

**错误信息**：启动失败

**解决方案**：

```shell
minikube start --force --kubernetes-version=v1.28.4
```

**参考链接**：[解决方案](https://blog.csdn.net/u013810234/article/details/126568707)

---

### 4.2 进入容器报错

**错误信息**：
```
kubectl exec [POD] [COMMAND] is DEPRECATED and will be removed in a future version.
```

**解决方案**：

```shell
# 旧版本（已废弃）
kubectl exec -it nginx bash

# 新版本（推荐）
kubectl exec -it nginx -- bash
```

---

## 🔄 5. 虚拟机关闭后如何重启

### 5.1 重启 Docker

```shell
sudo systemctl start docker
```

### 5.2 重启 Minikube

```shell
minikube start --force --kubernetes-version=v1.28.4
```

---

## 🛠️ 6. 管理集群常用命令

### 暂停/恢复集群

```shell
# 暂停 Kubernetes（不影响已部署的应用）
minikube pause

# 取消暂停
minikube unpause
```

### 启动/停止集群

```shell
# 停止集群
minikube stop

# 启动集群
minikube start
```

### 修改配置

```shell
# 更改默认内存限制（需要重启）
minikube config set memory 9001
```

### 插件管理

```shell
# 浏览可安装的 Kubernetes 服务目录
minikube addons list
```

### 多集群管理

```shell
# 创建运行旧版 Kubernetes 的第二个集群
minikube start -p aged --kubernetes-version=v1.16.1

# 删除所有 minikube 集群
minikube delete --all
```

---

> 💡 **提示**：Minikube 适合本地学习和测试，生产环境建议使用 Kubeadm 搭建多节点集群！
