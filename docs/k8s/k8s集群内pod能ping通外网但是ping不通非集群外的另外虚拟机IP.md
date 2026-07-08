# 📡 K8s 集群内 Pod 能 Ping 通外网但 Ping 不通其他虚拟机 IP

> ❌ 问题：K8s 集群内的 Pod 可以 ping 通外网，但无法 ping 通非集群的其他虚拟机

---

## 🖥️ 环境信息

**虚拟机配置**：
- `192.168.3.101` - k8s-master
- `192.168.3.102` - k8s-worker1
- `192.168.3.103` - k8s-worker2
- `192.168.3.104` - nacos

**问题场景**：
- ✅ 进入 K8s 集群内的 Pod（order 或 user）
- ✅ `ping www.baidu.com` 可以通
- ❌ `ping 192.168.3.104` 不通

---

## 🔍 问题分析

**根本原因**：Pod 的 IP 在外界无法访问

**解决方案**：

### 方案一：Pod IP 与宿主机 IP 映射

将 Pod 启动时所在的宿主机 IP 写到容器中，建立 Pod IP 和宿主机 IP 的对应关系。

### 方案二：使用 Host 网络模式（✅ 推荐）

Pod 和宿主机使用 Host 网络模式，Pod 直接使用宿主机的 IP。

> ⚠️ **注意**：如果服务高可用会有端口冲突问题
> 
> **解决**：使用 Pod 调度策略，尽可能在高可用的情况下，不会将 Pod 调度在同一个 Worker 中

---

## 🛠️ 实施方案

### 网络环境说明

在我的虚拟机环境中：
- 网络模式：仅主机网卡 + NAT 模式
- 测试：仅主机网卡 + 桥接方式（也不通）

**最终方案**：改成 **Host 网络模式**

### 修改 YAML 文件

在 `order.yaml` 或 `user.yaml` 中添加 `hostNetwork: true`：

```yaml
...
metadata:
  labels: 
    app: order
spec: 
  # 主要是加上这句话，注意在 order.yaml 的位置
  hostNetwork: true
  containers: 
  - name: order
    image: registry.cn-hangzhou.aliyuncs.com/...
...
```

> ⚠️ **重要**：非 Host 网络模式就不要操作实践了，在我的虚拟机环境中就是不通！

---

## ✅ 验证

应用配置后，Pod 会使用宿主机的 IP，外部虚拟机就可以正常访问了！

---

> 💡 **提示**：在 VirtualBox 虚拟机的仅主机 + NAT 网络模式下，使用 Host Network 是解决 Pod 外部访问问题的有效方案！
