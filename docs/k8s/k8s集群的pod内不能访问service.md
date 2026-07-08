# 🌐 K8s 集群的 Pod 内不能访问 Service

> ❌ 问题：使用 VirtualBox 搭建虚拟机 K8s 集群，无法访问 Service 的 ClusterIP

---

## 🔍 问题描述

```shell
[root@k8s-master ~]# kubectl get svc
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   53d
```

> ❌ `ping 10.96.0.1` 无法 ping 通

---

## 🛠️ 解决步骤

### 1️⃣ 设置 kube-proxy 为 IPVS 模式

**原因分析**：
- ✅ 能 ping 通的环境：kube-proxy 使用了 `--proxy-mode=ipvs`
- ❌ 不能 ping 通的环境：使用了默认模式（iptables）

**问题现象**：
- CoreDNS 能正常解析到 IP
- 但 ping Service 或 ClusterIP 都不通

**查看 kube-proxy 日志**：

```shell
[root@k8s-master ~]# kubectl logs kube-proxy-2z4cg -n kube-system
W0202 02:01:51.582008       1 proxier.go:493] Failed to load kernel module ip_vs with modprobe.
E0202 02:01:51.603782       1 server_others.go:305] can't determine whether to use ipvs proxy, error: IPVS proxier will not be used because the following required kernel modules are not loaded: [ip_vs_sh ip_vs ip_vs_rr ip_vs_wrr]
I0202 02:01:51.613846       1 server_others.go:148] Using iptables Proxier.
```

> ⚠️ **关键错误**：IPVS 相关内核模块未加载

---

### 2️⃣ 修改 kube-proxy 配置文件

```shell
[root@k8s-master ~]# kubectl edit cm kube-proxy -n kube-system
```

添加或修改以下内容：

```yaml
ipvs:
  excludeCIDRs: null
  minSyncPeriod: 0s
  scheduler: ""
  strictARP: false
  syncPeriod: 30s
kind: KubeProxyConfiguration
metricsBindAddress: 127.0.0.1:10249
mode: "ipvs"  # 添加这一行
```

---

### 3️⃣ 加载 IPVS 相关内核模块

> ⚠️ **重要**：每个节点都要执行（包括 master 和 worker），否则重启 kube-proxy 还是会报错

创建模块加载脚本：

```shell
cat > /etc/sysconfig/modules/ipvs.modules <<EOF
#!/bin/bash 
modprobe -- ip_vs 
modprobe -- ip_vs_rr 
modprobe -- ip_vs_wrr 
modprobe -- ip_vs_sh 
modprobe -- nf_conntrack_ipv4 
EOF
```

---

### 4️⃣ 赋予执行权限并加载模块

```shell
chmod 755 /etc/sysconfig/modules/ipvs.modules && \
bash /etc/sysconfig/modules/ipvs.modules && \
lsmod | grep -e ip_vs -e nf_conntrack_ipv4
```

---

### 5️⃣ 重启 kube-proxy Pod

```shell
[root@k8s-master ~]# kubectl get pod -n kube-system | grep kube-proxy | awk '{system("kubectl delete pod "$1" -n kube-system")}'
pod "kube-proxy-62gvr" deleted
pod "kube-proxy-n2rml" deleted
pod "kube-proxy-ppdb6" deleted
pod "kube-proxy-rr9cg" deleted
```

---

### 6️⃣ 验证模式变化

```shell
[root@k8s-master ~]# kubectl get pod -n kube-system | grep kube-proxy
kube-proxy-cbm8p                     1/1     Running   0          85s
kube-proxy-d97pn                     1/1     Running   0          83s
kube-proxy-gmq6s                     1/1     Running   0          76s
kube-proxy-x6tcg                     1/1     Running   0          81s

[root@k8s-master ~]# kubectl logs -n kube-system kube-proxy-cbm8p 
I1013 07:34:38.685794       1 server_others.go:170] Using ipvs Proxier.  # ✅ 关键：模式已变为 IPVS
W1013 07:34:38.686066       1 proxier.go:401] IPVS scheduler not specified, use rr by default
```

> ✅ **成功标志**：日志显示 `Using ipvs Proxier`

---

### 7️⃣ 测试 Service 访问

```shell
# 暴露 Service
[root@master ~]# kubectl expose deploy nginx --name=svc-nginx1 --type=ClusterIP --port=80 --target-port=80 -n dev
service/svc-nginx1 exposed

# 查看 Service
[root@master ~]# kubectl get svc svc-nginx1 -n dev -o wide
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE     SELECTOR
svc-nginx1   ClusterIP   10.109.179.231   <none>        80/TCP    3m51s   run=nginx

# 测试 ping Service
[root@k8s-master ~]# kubectl exec -it dns-test sh
/ # ping nginx-service
PING nginx-service (10.1.58.65): 56 data bytes
64 bytes from 10.1.58.65: seq=0 ttl=64 time=0.033 ms
64 bytes from 10.1.58.65: seq=1 ttl=64 time=0.069 ms
64 bytes from 10.1.58.65: seq=2 ttl=64 time=0.094 ms
64 bytes from 10.1.58.65: seq=3 ttl=64 time=0.057 ms
^C
--- nginx-service ping statistics ---
4 packets transmitted, 4 packets received, 0% packet loss
round-trip min/avg/max = 0.033/0.063/0.094 ms
```

> ✅ **成功**：Pod 内可以正常 ping 通 Service！

---

## 📚 参考链接

[K8s Pod 无法访问 Service 解决方案](https://blog.csdn.net/demon_xi/article/details/119594749)

---

> 💡 **提示**：将 kube-proxy 模式从 iptables 改为 IPVS 可以解决 Pod 无法访问 Service 的问题！
