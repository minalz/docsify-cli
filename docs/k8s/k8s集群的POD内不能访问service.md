# k8s集群的POD内不能访问service

> 使用VirtualBox搭建的虚拟机，然后创建了k8s集群，但是无法访问service的IP

```shell
[root@k8s-master ~]# kubectl get svc
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   53d
```

> ping 10.96.0.1 是ping不通的

#### 1.设置集群网络代理为–proxy-mode=ipvs

>k8s 集群能ping通的环境kube-proxy使用了–proxy-mode=ipvs ,不能ping通的环境使用了默认模式（iptables）。
>
>能通过coredns正常的解析到IP，然后去ping了一下service，发现不能ping通，ping clusterIP也不能ping通。

kubeadm 部署方式修改kube-proxy为 ipvs模式

默认情况下，我们部署的kube-proxy通过查看日志，能看到如下信息：Flag proxy-mode="" unknown，assuming iptables proxy

```shell
[root@k8s-master ~]# kubectl logs kube-proxy-2z4cg -n kube-system
W0202 02:01:51.582008       1 proxier.go:493] Failed to load kernel module ip_vs with modprobe. You can ignore this message when kube-proxy is running inside container without mounting /lib/modules
W0202 02:01:51.583943       1 proxier.go:493] Failed to load kernel module ip_vs_rr with modprobe. You can ignore this message when kube-proxy is running inside container without mounting /lib/modules
W0202 02:01:51.584750       1 proxier.go:493] Failed to load kernel module ip_vs_wrr with modprobe. You can ignore this message when kube-proxy is running inside container without mounting /lib/modules
W0202 02:01:51.585601       1 proxier.go:493] Failed to load kernel module ip_vs_sh with modprobe. You can ignore this message when kube-proxy is running inside container without mounting /lib/modules
W0202 02:01:51.594224       1 proxier.go:493] Failed to load kernel module ip_vs with modprobe. You can ignore this message when kube-proxy is running inside container without mounting /lib/modules
W0202 02:01:51.595849       1 proxier.go:493] Failed to load kernel module ip_vs_rr with modprobe. You can ignore this message when kube-proxy is running inside container without mounting /lib/modules
W0202 02:01:51.597687       1 proxier.go:493] Failed to load kernel module ip_vs_wrr with modprobe. You can ignore this message when kube-proxy is running inside container without mounting /lib/modules
W0202 02:01:51.599354       1 proxier.go:493] Failed to load kernel module ip_vs_sh with modprobe. You can ignore this message when kube-proxy is running inside container without mounting /lib/modules
E0202 02:01:51.603782       1 server_others.go:305] can't determine whether to use ipvs proxy, error: IPVS proxier will not be used because the following required kernel modules are not loaded: [ip_vs_sh ip_vs ip_vs_rr ip_vs_wrr]
I0202 02:01:51.613846       1 server_others.go:148] Using iptables Proxier.
I0202 02:01:51.614086       1 server_others.go:178] Tearing down inactive rules.
I0202 02:01:51.634981       1 server.go:555] Version: v1.14.0
I0202 02:01:51.643521       1 conntrack.go:52] Setting nf_conntrack_max to 131072
I0202 02:01:51.644527       1 config.go:202] Starting service config controller
I0202 02:01:51.644584       1 controller_utils.go:1027] Waiting for caches to sync for service config controller
I0202 02:01:51.644606       1 config.go:102] Starting endpoints config controller
I0202 02:01:51.644611       1 controller_utils.go:1027] Waiting for caches to sync for endpoints config controller
I0202 02:01:51.744824       1 controller_utils.go:1034] Caches are synced for service config controller
I0202 02:01:51.744824       1 controller_utils.go:1034] Caches are synced for endpoints config controller
```

#### 2.修改kube-proxy的配置文件,添加mode 为ipvs

```shell
[root@k8s-master ~]# kubectl edit cm kube-proxy -n kube-system
...
ipvs:
      excludeCIDRs: null
      minSyncPeriod: 0s
      scheduler: ""
      strictARP: false
      syncPeriod: 30s
    kind: KubeProxyConfiguration
    metricsBindAddress: 127.0.0.1:10249
    mode: "ipvs"
   ...
```

#### 3.将ipvs模式设置为ip_vs相关模块

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

#### 4.重启kube-proxy 的pod 最小单元

```shell
chmod 755 /etc/sysconfig/modules/ipvs.modules && bash /etc/sysconfig/modules/ipvs.modules && lsmod | grep -e ip_vs -e nf_conntrack_ipv4
```

#### 5.删除kube-proxy 的pod 最小单元

```shell
[root@k8s-master ~]# kubectl get pod -n kube-system | grep kube-proxy |awk '{system("kubectl delete pod "$1" -n kube-system")}'
pod "kube-proxy-62gvr" deleted
pod "kube-proxy-n2rml" deleted
pod "kube-proxy-ppdb6" deleted
pod "kube-proxy-rr9cg" deleted
```

#### 6.查看日志，注意模式变化

> Using ipvs Proxier

```
[root@k8s-master ~]# kubectl get pod -n kube-system |grep kube-proxy
kube-proxy-cbm8p                     1/1     Running   0          85s
kube-proxy-d97pn                     1/1     Running   0          83s
kube-proxy-gmq6s                     1/1     Running   0          76s
kube-proxy-x6tcg                     1/1     Running   0          81s
[root@k8s-master ~]# kubectl logs -n kube-system kube-proxy-cbm8p 
I1013 07:34:38.685794       1 server_others.go:170] Using ipvs Proxier.
W1013 07:34:38.686066       1 proxier.go:401] IPVS scheduler not specified, use rr by default
I1013 07:34:38.687224       1 server.go:534] Version: v1.15.0
I1013 07:34:38.692777       1 conntrack.go:52] Setting nf_conntrack_max to 131072
I1013 07:34:38.693378       1 config.go:187] Starting service config controller
I1013 07:34:38.693391       1 controller_utils.go:1029] Waiting for caches to sync for service config controller
I1013 07:34:38.693406       1 config.go:96] Starting endpoints config controller
I1013 07:34:38.693411       1 controller_utils.go:1029] Waiting for caches to sync for endpoints config controller
I1013 07:34:38.793684       1 controller_utils.go:1036] Caches are synced for endpoints config controller
I1013 07:34:38.793688       1 controller_utils.go:1036] Caches are synced for service config controller
```

#### 7.创建集群内部可访问的Service

```shell
# 暴露Service
[root@master ~]# kubectl expose deploy nginx --name=svc-nginx1 --type=ClusterIP --port=80 --target-port=80 -n dev
service/svc-nginx1 exposed

# 查看service
[root@master ~]# kubectl get svc svc-nginx1 -n dev -o wide
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE     SELECTOR
svc-nginx1   ClusterIP   10.109.179.231   <none>        80/TCP    3m51s   run=nginx
# 测试ping service
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

#### 8.参考链接

https://blog.csdn.net/demon_xi/article/details/119594749