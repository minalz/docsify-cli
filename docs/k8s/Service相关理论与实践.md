# 🛠️ Service 相关理论与实践

> 📚 Kubernetes 核心概念：Controllers、Labels、Namespace 和 Network

---

## 📦 01 Controllers

> **官网**：[Kubernetes Controllers](https://kubernetes.io/docs/concepts/workloads/controllers/)

---

### ReplicationController (RC)

**官网**：[ReplicationController](https://kubernetes.io/docs/concepts/workloads/controllers/replicationcontroller/)

> A ReplicationController ensures that a specified number of pod replicas are running at any one time. In other words, a ReplicationController makes sure that a pod or a homogeneous set of pods is always up and available.

ReplicationController 定义了一个期望的场景，即声明某种 Pod 的副本数量在任意时刻都符合某个预期值，所以 RC 的定义包含以下几个部分：

- Pod 期待的副本数（replicas）
- 用于筛选目标 Pod 的 Label Selector
- 当 Pod 的副本数量小于预期数量时，用于创建新 Pod 的 Pod 模板（template）

也就是说通过 RC 实现了集群中 Pod 的高可用，减少了传统 IT 环境中手工运维的工作。

#### 实践操作

| 参数 | 说明 |
|:---|:---|
| `kind` | 表示要新建对象的类型 |
| `spec.selector` | 表示需要管理的 Pod 的 label |
| `spec.replicas` | 表示受此 RC 管理的 Pod 需要运行的副本数 |
| `spec.template` | 表示用于定义 Pod 的模板 |

**示例 YAML**：

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: nginx
spec:
  replicas: 3
  selector:
    app: nginx
  template:
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

**操作命令**：

```shell
# 创建 Pod
kubectl apply -f nginx_replication.yaml

# 查看 Pod
kubectl get pods -o wide
kubectl get rc

# 删除 Pod
kubectl delete pods nginx-zzwzl

# 扩缩容
kubectl scale rc nginx --replicas=5

# 删除 RC
kubectl delete -f nginx_replication.yaml
```

---

### ReplicaSet (RS)

**官网**：[ReplicaSet](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/)

> A ReplicaSet's purpose is to maintain a stable set of replica Pods running at any given time. As such, it is often used to guarantee the availability of a specified number of identical Pods.

- 在 Kubernetes v1.2 时，RC 就升级成了 Replica Set，官方解释为"下一代 RC"
- RS 与 RC 唯一的区别是：RS 支持基于集合的 Label Selector（Set-based selector），而 RC 只支持基于等式的 Label Selector（equality-based selector）

> ⚠️ **注意**：一般情况下，我们很少单独使用 Replica Set，它主要是被 Deployment 这个更高的资源对象所使用。

---

### Deployment

**官网**：[Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)

> A Deployment provides declarative updates for Pods and ReplicaSets.

Deployment 相对 RC 最大的一个升级就是我们可以随时知道当前 Pod"部署"的进度。

**示例 YAML**：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80
```

**操作命令**：

```shell
# 创建 Deployment
kubectl apply -f nginx_deployment.yaml

# 查看资源
kubectl get pods -o wide
kubectl get deployment
kubectl get rs
kubectl get deployment -o wide

# 更新镜像版本
kubectl set image deployment nginx-deployment nginx=nginx:1.9.1
```

---

## 🏷️ 02 Labels and Selectors

**官网**：[Labels and Selectors](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)

> Labels are key/value pairs that are attached to objects, such as pods.

**示例**：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
```

我们可以将具有同一个 label 的 pod，交给 selector 管理：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata: 
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:             # 匹配具有同一个 label 属性的 pod 标签
    matchLabels:
      app: nginx         
  template:             # 定义 pod 的模板
    metadata:
      labels:
        app: nginx      # 定义当前 pod 的 label 属性
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80
```

**查看命令**：

```shell
kubectl get pods --show-labels
```

---

## 🌐 03 Namespace

命名空间就是为了隔离不同的资源，比如：Pod、Service、Deployment 等。

**查看命名空间**：

```shell
kubectl get pods
kubectl get pods -n kube-system
kubectl get namespaces
```

**输出示例**：

```
NAME              STATUS   AGE
default           Active   27m
kube-node-lease   Active   27m
kube-public       Active   27m
kube-system       Active   27m
```

### 创建命名空间

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: myns
```

```shell
kubectl apply -f myns-namespace.yaml
kubectl get namespaces
```

### 指定命名空间下的资源

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  namespace: myns
spec:
  containers:
  - name: nginx-container
    image: nginx
    ports:
    - containerPort: 80
```

**查看命令**：

```shell
kubectl get pods -n myns
kubectl get all -n myns
kubectl get pods --all-namespaces    # 查找所有命名空间下的 pod
```

---

## 🌐 04 Network

### 4.1 同一个 Pod 中的容器通信

> Each Pod is assigned a unique IP address. Every container in a Pod shares the network namespace, including the IP address and network ports.

同一个 pod 中的容器是共享网络 ip 地址和端口号的，通信显然没问题。

那如果是通过容器的名称进行通信呢？就需要将所有 pod 中的容器加入到同一个容器的网络中，我们把该容器称作为 pod 中的 **pause container**。

---

### 4.2 集群内 Pod 之间的通信

#### 准备测试 Pod

**nginx_pod.yaml**：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx-container
    image: nginx
    ports:
    - containerPort: 80
```

**busybox_pod.yaml**：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  labels:
    app: busybox
spec:
  containers:
  - name: busybox
    image: busybox
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
```

```shell
kubectl apply -f nginx_pod.yaml
kubectl apply -f busybox_pod.yaml
kubectl get pods -o wide
```

**输出**：

```
NAME      READY  STATUS    RESTARTS   AGE    IP              NODE
busybox    1/1   Running      0       49s    192.168.221.70  worker02
nginx-pod  1/1   Running      0      7m46s   192.168.14.1    worker01
```

#### 同一个集群中同一台机器

```shell
# 在 worker01 上测试
ping 192.168.14.1
curl 192.168.14.1
```

#### 同一个集群中不同机器

```shell
# 在 worker02 上测试
ping 192.168.14.1
curl 192.168.14.1

# 在 master 上测试
ping 192.168.14.1      # 访问的是 worker01 上的 nginx-pod
ping 192.168.221.70    # 访问的是 worker02 上的 busybox-pod
```

#### Calico 网络模型

**官网**：[Kubernetes Network Model](https://kubernetes.io/docs/concepts/cluster-administration/networking/#the-kubernetes-network-model)

- Pods on a node can communicate with all pods on all nodes without NAT
- Agents on a node (e.g. system daemons, kubelet) can communicate with all pods on that node
- Pods in the host network of a node can communicate with all pods on all nodes without NAT

---

### 4.3 集群内 Service - Cluster IP

**官网**：[Service](https://kubernetes.io/docs/concepts/services-networking/service/)

> An abstract way to expose an application running on a set of Pods as a network service.

Pod 是不稳定的，通过 Deployment 管理 Pod 时，随时可能对 Pod 进行扩缩容，这时候 Pod 的 IP 地址是变化的。Service 有固定的 IP，不管 Pod 怎么创建和销毁，都可以通过 Service 的 IP 进行访问。

#### 创建 Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: whoami-deployment
  labels:
    app: whoami
spec:
  replicas: 3
  selector:
    matchLabels:
      app: whoami
  template:
    metadata:
      labels:
        app: whoami
    spec:
      containers:
      - name: whoami
        image: jwilder/whoami
        ports:
        - containerPort: 8000
```

```shell
kubectl apply -f whoami-deployment.yaml
kubectl get pods -o wide
```

#### 查看 Service

```shell
kubectl get svc
```

**输出**：

```
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   19h
```

#### 创建 Service

```shell
kubectl expose deployment whoami-deployment
kubectl get svc
```

**输出**：

```
NAME                TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
kubernetes          ClusterIP   10.96.0.1       <none>        443/TCP    19h
whoami-deployment   ClusterIP   10.105.147.59   <none>        8000/TCP   23s
```

#### 通过 Service 访问

```shell
curl 10.105.147.59:8000
# 输出：I'm whoami-deployment-678b64444d-b2695

curl 10.105.147.59:8000
# 输出：I'm whoami-deployment-678b64444d-hgdrk
```

#### 查看 Service 详情

```shell
kubectl describe svc whoami-deployment
```

**输出**：

```
Name:              whoami-deployment
Namespace:         default
Labels:            app=whoami
Selector:          app=whoami
Type:              ClusterIP
IP:                10.105.147.59
Port:              <unset>  8000/TCP
TargetPort:        8000/TCP
Endpoints:         192.168.14.8:8000,192.168.221.81:8000,192.168.221.82:8000
Session Affinity:  None
Events:            <none>
```

> 💡 **总结**：Service 存在的意义就是为了 Pod 的不稳定性。Cluster IP 类型的 Service 只能供集群内访问。

---

### 4.4 Pod 访问外部服务

比较简单，直接访问即可。

---

### 4.5 外部服务访问集群中的 Pod

#### Service - NodePort

也是 Service 的一种类型，通过 NodePort 的方式，在集群中每台物理机器上暴露一个相同的端口。

```shell
# 创建 NodePort 类型的 Service
kubectl expose deployment whoami-deployment --type=NodePort

kubectl get svc
```

**输出**：

```
NAME                TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
kubernetes          ClusterIP   10.96.0.1      <none>        443/TCP          21h
whoami-deployment   NodePort    10.99.108.82   <none>        8000:32041/TCP   7s
```

**访问方式**：

```shell
# 查看端口
lsof -i tcp:32041
netstat -ntlp|grep 32041

# 浏览器访问
http://192.168.0.51:32041
curl 192.168.0.61:32041
```

> ⚠️ **注意**：NodePort 虽然能够实现外部访问 Pod 的需求，但是占用了各个物理主机上的端口，生产环境不推荐使用。

---

#### Service - LoadBalance

通常需要第三方云提供商支持，有约束性。

---

#### Ingress

**官网**：[Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)

> An API object that manages external access to the services in a cluster, typically HTTP.
> 
> Ingress can provide load balancing, SSL termination and name-based virtual hosting.

**相关资源**：
- [Ingress Nginx GitHub](https://github.com/kubernetes/ingress-nginx)
- [Nginx Ingress Controller](https://kubernetes.github.io/ingress-nginx/)

**配置步骤**：

**1. 部署 Ingress Nginx Controller**

```shell
# 确保 nginx-controller 运行到 w1 节点上
kubectl label node w1 name=ingress

# 使用 HostPort 方式运行
# mandatory.yaml 在网盘中的"课堂源码"目录
kubectl apply -f mandatory.yaml

kubectl get all -n ingress-nginx
```

**2. 创建 Tomcat Pod 和 Service**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tomcat-deployment
  labels:
    app: tomcat
spec:
  replicas: 1
  selector:
    matchLabels:
      app: tomcat
  template:
    metadata:
      labels:
        app: tomcat
    spec:
      containers:
      - name: tomcat
        image: tomcat
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: tomcat-service
spec:
  ports:
  - port: 80   
    protocol: TCP
    targetPort: 8080
  selector:
    app: tomcat
```

```shell
kubectl apply -f tomcat.yaml
kubectl get svc
kubectl get pods
```

**3. 创建 Ingress 并定义转发规则**

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: nginx-ingress
spec:
  rules:
  - host: tomcat.jack.com
    http:
      paths:
      - path: /
        backend:
          serviceName: tomcat-service
          servicePort: 80
```

```shell
kubectl apply -f nginx-ingress.yaml
kubectl get ingress
kubectl describe ingress nginx-ingress
```

**4. 配置 DNS 解析**

修改 Windows 的 hosts 文件：

```
192.168.8.61 tomcat.jack.com
```

**5. 访问测试**

打开浏览器，访问 `tomcat.jack.com`

> 💡 **总结**：如果以后想要使用 Ingress 网络，其实只要定义 ingress、service 和 pod 即可，前提是要保证 nginx ingress controller 已经配置好了。

---

> 📖 **提示**：本文档涵盖了 Kubernetes 核心概念的完整实践指南！
