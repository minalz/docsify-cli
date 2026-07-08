# 📖 Kubernetes 理论认知

> 📚 K8s 架构设计与核心组件理论

---

## 🏗️ K8s 核心组件

### 1️⃣ kubectl - 集群客户端

- 操作集群的命令行工具
- 与集群打交道的入口

### 2️⃣ 认证与授权

- 请求到达 Master Node 前的安全验证
- 确保只有合法用户可以操作集群

### 3️⃣ API Server - 请求接收

- Master Node 中负责接收请求
- 所有操作的统一入口

### 4️⃣ Scheduler - 调度器

- 决定在哪个 Worker Node 上创建 Pod
- 根据调度策略分配资源

[Scheduler 官方文档](https://kubernetes.io/docs/concepts/scheduling/kube-scheduler/)

### 5️⃣ Controller Manager - 控制器

- 负责具体的资源管理
- 确保集群状态符合预期

### 6️⃣ Kubelet - 节点代理

- Worker Node 上负责创建和维护容器
- 调用 Docker Engine 创建容器
- **要求**：Node 上需要有 Docker Engine

### 7️⃣ DNS - 域名解析

- 集群内部的域名解析服务
- Service 名称解析

### 8️⃣ Dashboard - 监控面板

- 可视化监控集群状态
- 图形化管理界面

### 9️⃣ ETCD - 分布式存储

- 存储集群的所有配置数据
- 分布式键值存储

### 🔟 网络与存储

- 容器的持久化存储
- 网络配置（参考 Docker 中的内容）

---

## 📊 K8s 架构图

![K8s 架构图 1](http://img.minalz.cn/typora/image-20231208161618629.png)

**翻转后的架构图**（方便查看）：

![K8s 架构图 2](http://img.minalz.cn/typora/image-20231208161702697.png)

---

## 📐 官方架构图

[K8s 官方架构文档](https://kubernetes.io/docs/concepts/architecture/cloud-controller/)

![K8s 官方架构图](http://img.minalz.cn/typora/image-20231208161723745.png)

---

## 🛠️ K8s 安装方式

### Minikube - 单节点

**特点**：适合本地学习使用

**资源**：
- 官网：[Minikube 官方文档](https://kubernetes.io/docs/setup/learning-environment/minikube/)
- GitHub：[Minikube 项目](https://github.com/kubernetes/minikube)

**推荐指数**：⭐⭐⭐⭐⭐

---

### Kubeadm - 多节点

**特点**：本地多节点集群搭建

**资源**：
- GitHub：[Kubeadm 项目](https://github.com/kubernetes/kubeadm)

**推荐指数**：⭐⭐⭐⭐⭐

---

## 📝 组件总结

| 组件 | 位置 | 职责 |
|:---|:---|:---|
| kubectl | 客户端 | 操作集群 |
| API Server | Master | 接收请求 |
| Scheduler | Master | 调度 Pod |
| Controller Manager | Master | 管理控制器 |
| ETCD | Master | 存储数据 |
| Kubelet | Worker | 管理容器 |
| Kube-proxy | Worker | 网络代理 |
| DNS | 集群 | 域名解析 |
| Dashboard | 集群 | 可视化监控 |

---

> 💡 **提示**：理解 K8s 架构是学习 Kubernetes 的第一步，掌握各组件的职责和交互关系！
