# 🖥️ 虚拟机内可以访问 IP 但浏览器无法访问

> ❌ 问题：VirtualBox 虚拟机 K8s 集群部署服务后，集群内 curl 正常，但浏览器无法访问

---

## 🔍 问题场景

**环境**：
- VirtualBox 搭建的三台虚拟机
- 使用 kubeadm 安装了 K8s 集群
- 集群运行正常

**问题描述**：
- ✅ 部署了 whoami 服务
- ✅ 使用 NodePort 方式暴露端口
- ✅ 集群内访问对应的 IP + 端口正常（curl）
- ❌ 浏览器访问失败

---

## 🔧 排查步骤

### 1️⃣ 怀疑 ingress-controller 占用端口

**排查过程**：
- Master 上 ping 不通 WordPress 的 Service IP
- 检查端口是否被占用
- 之前安装了 ingress-nginx，也使用 80 端口
- Master + NodePort 无法访问 WordPress，原因是 ingress-nginx 占用了 80 端口

**结论**：❌ 不是这个原因

---

### 2️⃣ 查询 kube-proxy Node 是否有报错

**排查过程**：

```shell
kubectl logs kube-proxy-sdfaxxs -n wordpress
```

**发现错误日志**：
```
E0126 05:36:36.072754       1 reflector.go:126] k8s.io/client-go/informers/factory.go:133: Failed to list *v1.Service: Get https://192.168.3.101:6443/api/v1/services?labelSelector=%21service.kubernetes.io%2Fservice-proxy-name&limit=500&resourceVersion=0: dial tcp 192.168.3.101:6443: connect: connection refused
```

**处理**：重启节点后，再查询日志，无报错信息

**结论**：❌ 不是这个原因，但 Node 节点有错确实有问题

---

### 3️⃣ 检查 etcd 集群状态

**排查命令**：

```shell
ETCDCTL_API=3 /opt/etcd/bin/etcdctl \
    --cacert=/opt/etcd/ssl/ca.pem \
    --cert=/opt/etcd/ssl/server.pem \
    --key=/opt/etcd/ssl/server-key.pem \
    --endpoints="https://192.168.3.101:2379,https://192.168.3.102:2379,https://192.168.3.103:2379" \
    endpoint health --write-out=table
```

**结论**：❌ 不是这个原因

---

### 4️⃣ 重新设置 Calico 报 enp0s8 IP 冲突

**排查过程**：
- 重新设置 enp0s8 网卡信息
- 新增 enp0s8 配置，文件路径：`/etc/sysconfig/network-scripts/ifcfg-enp0s8`
- 导致虚拟机本身的网络都无法通信
- 删除配置，然后重启虚拟机

**结论**：❌ 不是这个原因

---

### 5️⃣ iptables 转发有问题（✅ 找到原因）

**怀疑原因**：搜索了很多解决方案，怀疑是 iptables 设置出错了

**执行命令**：

```shell
# 配置 iptables 的 ACCEPT 规则
iptables -F && iptables -X && iptables -F -t nat && iptables -X -t nat && iptables -P FORWARD ACCEPT
```

**发现问题**：

![iptables 报错](http://img.minalz.cn/typora/1dbf1f2a3ce21c32b4344170d732d35.png)

> ⚠️ **关键**：原来这个报错没有注意到，导致配置环境出错了，流量无法转发，所以访问不到，只能访问对应的节点 + IP

**解决方案**：
- 要么使用 `-w` 参数
- 要么停掉对应的 Node 节点，重新配置

**参考链接**：

![参考解决方案](http://img.minalz.cn/typora/c8de908967cdf30ed566afc1f059d25.png)

[iptables 配置问题解决方案](https://blog.csdn.net/qq_42532161/article/details/104950672)

**结论**：✅ 符合原因！

---

## 📋 排查总结

| 步骤 | 排查内容 | 结论 |
|:---|:---|:---|
| 1️⃣ | ingress-controller 占用端口 | ❌ 不是 |
| 2️⃣ | kube-proxy Node 报错 | ❌ 不是（但 Node 有错） |
| 3️⃣ | etcd 集群状态 | ❌ 不是 |
| 4️⃣ | Calico enp0s8 IP 冲突 | ❌ 不是 |
| 5️⃣ | iptables 转发配置 | ✅ 找到原因 |

---

## 💡 核心原因

> 🔑 **iptables 配置错误导致流量无法转发**
> 
> 执行 `iptables` 命令时出现报错但未注意到，导致网络流量无法正常转发，只能访问节点 IP，无法通过浏览器访问服务。

---

## 🛠️ 解决方案

### 方案一：使用 `-w` 参数

```shell
iptables -w -F && iptables -w -X && iptables -w -F -t nat && iptables -w -X -t nat && iptables -w -P FORWARD ACCEPT
```

### 方案二：停掉 Node 节点重新配置

```shell
# 停止相关服务
# 重新配置 iptables
# 重启服务
```

---

> 💡 **提示**：排查网络问题时，注意查看 iptables 规则和日志，流量转发问题往往容易被忽略！
