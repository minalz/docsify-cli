# 🏗️ 使用 Kubeadm 搭建集群 K8s

> 📦 无需科学上网，搭建 3 台机器组成的 K8s 集群（1 Master + 2 Worker）

---

## ⚙️ 环境要求

**官网**：[Kubeadm Install](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-kubeadm-kubelet-and-kubectl)

**GitHub**：[kubeadm](https://github.com/kubernetes/kubeadm)

### 系统要求

| 项目 | 要求 |
|:---|:---|
| **操作系统** | Ubuntu 16.04+ / Debian 9+ / CentOS 7 / RHEL 7 |
| **内存** | 2 GB 或更多 |
| **CPU** | 2 核或更多 |
| **网络** | 所有机器之间完全连通 |
| **主机名** | 每个节点唯一的主机名、MAC 地址和 product_uuid |
| **Swap** | **必须禁用** |

---

## 📋 1.1 版本统一

```
Docker:              18.09.0
kubeadm:             1.14.0-0
kubelet:             1.14.0-0
kubectl:             1.14.0-0

K8s 组件镜像:
k8s.gcr.io/kube-apiserver:v1.14.0
k8s.gcr.io/kube-controller-manager:v1.14.0
k8s.gcr.io/kube-scheduler:v1.14.0
k8s.gcr.io/kube-proxy:v1.14.0
k8s.gcr.io/pause:3.1
k8s.gcr.io/etcd:3.3.10
k8s.gcr.io/coredns:1.3.1

网络插件:
calico:v3.9
```

---

## 🖥️ 1.2 准备 3 台 CentOS

保证彼此之间能够 ping 通，处于同一个网络中。

---

## 📥 1.3 更新并安装依赖

> 3 台机器都需要执行

```shell
yum -y update
yum install -y conntrack ipvsadm ipset jq sysstat curl iptables libseccomp
```

---

## 🐳 1.4 安装 Docker

在每一台机器上都安装好 Docker，版本为 18.09.0。

```shell
# 01 安装必要的依赖
sudo yum install -y yum-utils \
    device-mapper-persistent-data \
    lvm2

# 02 设置 docker 仓库
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# 设置阿里云镜像加速器
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["替换成自己的实际地址"]
}
EOF
sudo systemctl daemon-reload

# 03 安装 docker
yum install -y docker-ce-18.09.0 docker-ce-cli-18.09.0 containerd.io

# 04 启动 docker
sudo systemctl start docker && sudo systemctl enable docker
```

---

## 📝 1.5 修改 Hosts 文件

### Master 节点

```shell
sudo hostnamectl set-hostname m

vi /etc/hosts
192.168.8.51 m
192.168.8.61 w1
192.168.8.62 w2
```

### Worker 节点

```shell
# worker01
sudo hostnamectl set-hostname w1

# worker02
sudo hostnamectl set-hostname w2

vi /etc/hosts
192.168.8.51 m
192.168.8.61 w1
192.168.8.62 w2
```

**测试连通性**：

```shell
ping m
ping w1
ping w2
```

---

## ⚙️ 1.6 系统基础前提配置

```shell
# (1) 关闭防火墙
systemctl stop firewalld && systemctl disable firewalld

# (2) 关闭 selinux
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

# (3) 关闭 swap
swapoff -a
sed -i '/swap/s/^\(.*\)$/#\1/g' /etc/fstab

# (4) 配置 iptables 的 ACCEPT 规则
iptables -F && iptables -X && iptables -F -t nat && iptables -X -t nat && iptables -P FORWARD ACCEPT

# (5) 设置系统参数
cat <<EOF >  /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF

sysctl --system
```

> ⚠️ **注意**：第四步要注意是否有报错，否则虚拟机 + NodePort 端口是无法访问的。

---

## 📦 1.7 安装 Kubeadm、Kubelet 和 Kubectl

### 配置 YUM 源

```shell
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=http://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=http://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg
       http://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

### 安装组件

```shell
yum install -y kubeadm-1.14.0-0 kubelet-1.14.0-0 kubectl-1.14.0-0
```

> ⚠️ **注意**：需要分开安装，否则 `kubeadm init` 会报 kubelet 版本不对。

### 设置 Cgroup

```shell
# docker
vi /etc/docker/daemon.json
# 添加："exec-opts": ["native.cgroupdriver=systemd"]

systemctl restart docker

# kubelet
sed -i "s/cgroup-driver=systemd/cgroup-driver=cgroupfs/g" /etc/systemd/system/kubelet.service.d/10-kubeadm.conf

systemctl enable kubelet && systemctl start kubelet
```

---

## 🌐 1.8 拉取国内镜像

### 查看 Kubeadm 使用的镜像

```shell
kubeadm config images list
```

### 创建拉取脚本

**kubeadm.sh**：

```shell
#!/bin/bash
set -e

KUBE_VERSION=v1.14.0
KUBE_PAUSE_VERSION=3.1
ETCD_VERSION=3.3.10
CORE_DNS_VERSION=1.3.1

GCR_URL=k8s.gcr.io
ALIYUN_URL=registry.cn-hangzhou.aliyuncs.com/google_containers

images=(kube-proxy:${KUBE_VERSION}
kube-scheduler:${KUBE_VERSION}
kube-controller-manager:${KUBE_VERSION}
kube-apiserver:${KUBE_VERSION}
pause:${KUBE_PAUSE_VERSION}
etcd:${ETCD_VERSION}
coredns:${CORE_DNS_VERSION})

for imageName in ${images[@]} ; do
  docker pull $ALIYUN_URL/$imageName
  docker tag  $ALIYUN_URL/$imageName $GCR_URL/$imageName
  docker rmi $ALIYUN_URL/$imageName
done
```

**执行脚本**：

```shell
sh ./kubeadm.sh
docker images
```

---

## 🚀 1.9 Kubeadm Init 初始化 Master

### 初始化流程

1. 进行一系列检查，确定机器可以部署 Kubernetes
2. 生成 Kubernetes 对外提供服务所需要的各种证书
3. 为其他组件生成访问 kube-ApiServer 所需的配置文件
4. 为 Master 组件生成 Pod 配置文件
5. 生成 etcd 的 Pod YAML 文件
6. kubelet 自动创建这些 YAML 文件定义的 pod
7. 为集群生成一个 bootstrap token
8. 将 ca.crt 等 Master 节点的重要信息保存在 etcd 中
9. 安装默认插件（kube-proxy 和 DNS）

### 执行初始化

```shell
# 在 master 节点执行
kubeadm init --kubernetes-version=1.14.0 \
  --apiserver-advertise-address=192.168.8.51 \
  --pod-network-cidr=10.244.0.0/16

# 记得保存最后 kubeadm join 的信息！
```

**配置 kubectl**：

```shell
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

**验证**：

```shell
kubectl cluster-info
kubectl get pods -n kube-system
curl -k https://localhost:6443/healthz
```

---

## 🌐 1.10 部署 Calico 网络插件

**官网**：[Calico](https://docs.projectcalico.org/v3.9/getting-started/kubernetes/)

```shell
# 在 master 节点上安装 calico
kubectl apply -f https://docs.projectcalico.org/v3.9/manifests/calico.yaml

# 确认 calico 是否安装成功
kubectl get pods --all-namespaces -w
```

### 常见问题

**问题**：Calico 报 IP 冲突

**解决方案**：

```shell
# 下载 calico.yaml 到本地
# 添加配置：
- name: IP_AUTODETECTION_METHOD
  value: "interface=enp0s3"

# 重新应用
kubectl apply -f calico.yaml
```

**常用排查命令**：

```shell
kubectl get pods -n kube-system
kubectl logs <pod_name> -n kube-system
kubectl describe pod <pod_name> -n kube-system
```

---

## 🔗 1.11 Worker 节点 Join

**在 worker01 和 worker02 上执行**（使用初始化时保存的命令）：

```shell
kubeadm join 192.168.3.101:6443 \
  --token fmvt8o.wagso22i3z1pxx9x \
  --discovery-token-ca-cert-hash sha256:cbc778c550b38174d60716891256cb6c4954c653b2817a00c9cdede01c7e202d
```

**在 master 节点检查集群信息**：

```shell
kubectl get nodes
```

**输出**：

```
NAME                   STATUS   ROLES    AGE     VERSION
master-kubeadm-k8s     Ready    master   19m     v1.14.0
worker01-kubeadm-k8s   Ready    <none>   3m6s    v1.14.0
worker02-kubeadm-k8s   Ready    <none>   2m41s   v1.14.0
```

---

## 🧪 1.12 体验 Pod

### 创建 ReplicaSet

**pod_nginx_rs.yaml**：

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: nginx
  labels:
    tier: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      tier: frontend
  template:
    metadata:
      name: nginx
      labels:
        tier: frontend
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
```

```shell
# 创建 Pod
kubectl apply -f pod_nginx_rs.yaml

# 查看 Pod
kubectl get pods -o wide
kubectl describe pod nginx

# 扩容
kubectl scale rs nginx --replicas=5
kubectl get pods -o wide

# 删除
kubectl delete -f pod_nginx_rs.yaml
```

---

## 📄 02 YAML 基础

### 2.1 YAML 简介

YAML 是一个可读性高的语言，参考了 XML、C、Python 等。

**基础规则**：

- 区分大小写
- 缩进表示层级关系，相同层级的元素左对齐
- 缩进只能使用空格，不能使用 TAB
- `#` 表示注释
- `---` 表示分隔符，可以定义多个结构
- `key: value` 之间要有一个空格

### 2.2 Maps 示例

**简单 Map**：

```yaml
apiVersion: v1
kind: Pod
```

**复杂 Map**：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
```

### 2.3 Lists 示例

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container01
    image: busybox:1.28
  - name: myapp-container02
    image: busybox:1.28
```

### 2.4 K8s YAML 完整示例

```yaml
apiVersion: v1          # 必写，版本号
kind: Pod               # 必写，类型
metadata:               # 必写，元数据
  name: nginx           # 必写，pod 名称
  namespace: default    # 命名空间
  labels:
    app: nginx          # 自定义标签
spec:                   # 必写，容器详细定义
  containers:           # 必写，容器列表
  - name: nginx         # 必写，容器名称
    image: nginx        # 必写，镜像名称
    ports:
    - containerPort: 80 # 容器端口
```

---

## 📦 03 Container 和 Pod

### 3.1 Docker 世界

通过 `docker run` 运行容器，或使用 `docker-compose` / `docker swarm`。

### 3.2 K8s 世界

以 YAML 文件维护，Container 运行在 Pod 中。

### 3.3 Pod 是什么

> A Pod is the basic execution unit of a Kubernetes application.
> A Pod encapsulates an application's container, storage resources, a unique network IP, and options that govern how the container(s) should run.

### 3.4 Pod 实践

**创建 Pod**：

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

```shell
# 创建 Pod
kubectl apply -f nginx_pod.yaml

# 查看 Pod
kubectl get pods
kubectl get pods -o wide
kubectl describe pod nginx-pod

# 访问 Nginx
curl 192.168.80.194  # 在任何一个 Node 上访问都成功

# 删除 Pod
kubectl delete -f nginx_pod.yaml
```

### 3.5 Storage and Networking

**Networking**：

> Each Pod is assigned a unique IP address. Every container in a Pod shares the network namespace.

**Storage**：

> A Pod can specify a set of shared storage Volumes. All containers in the Pod can access the shared volumes.

---

> 💡 **提示**：Kubeadm 是生产环境推荐的多节点集群搭建方式！
