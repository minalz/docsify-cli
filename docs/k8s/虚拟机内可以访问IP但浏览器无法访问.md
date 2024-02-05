# 虚拟机内可以访问IP但是浏览器无法访问

> VirtualBox搭建的三台虚拟机，并且使用kubeadm安装了k8s的集群，集群运行正常。
>
> 问题场景：
>
> 部署了whoami的服务，并且使用NodePort方式暴露端口，集群内访问对应的ip+端口是没问题的（curl），
>
> 但是浏览器访问就不行了

排查步骤：

1.怀疑是ingress-controller占用端口

master上ping不通wordpress的service的ip，由此判断端口是否被占用了，之前安装了ingress-nginx，也是用的80端口
master+nodeport无法访问wordpress，原因是由于ingress-nginx的存在将80端口给占用了

结论：不是



2.查询kube-proxy node是否有报错

kubectl logs kube-proxy-sdfaxxs -n wordprss 发现有错误日志
E0126 05:36:36.072754       1 reflector.go:126] k8s.io/client-go/informers/factory.go:133: Failed to list *v1.Service: Get https://192.168.3.101:6443/api/v1/services?labelSelector=%21service.kubernetes.io%2Fservice-proxy-name&limit=500&resourceVersion=0: dial tcp 192.168.3.101:6443: connect: connection refused

发现还真的有报错，然后重启了节点，再查询日志，无报错信息了

结论：不是这个原因，但是node节点有错，也是有问题的



3.检查etcd集群状态
ETCDCTL_API=3 /opt/etcd/bin/etcdctl --cacert=/opt/etcd/ssl/ca.pem --cert=/opt/etcd/ssl/server.pem --key=/opt/etcd/ssl/server-key.pem --endpoints="https://192.168.3.101:2379,https://192.168.3.102:2379,https://192.168.3.103:2379" endpoint health --write-out=table

结论：不是



4.重新设置calico 报enp0s8 ip冲突
重新设置enp0s8网卡信息，新增enp0s8配置，文件路径：/etc/sysconfig/network-scripts/ifcfg-enp0s8
导致虚拟机本身的网络都无法通信了，删除配置，然后重启虚拟机

结论：不是



5.iptables转发有问题

> 因为搜索了很多解决方案，怀疑是iptables设置出错了

```shell
# (4)配置iptables的ACCEPT规则
iptables -F && iptables -X && iptables -F -t nat && iptables -X -t nat && iptables -P FORWARD ACCEPT
```

然后执行了一遍出错了

![1dbf1f2a3ce21c32b4344170d732d35](http://img.minalz.cn/typora/1dbf1f2a3ce21c32b4344170d732d35.png)

原来这个报错没有注意到，导致配置环境出错了，流量无法转发，所以访问不到，只能访问对应的节点+ip

要么要-w的参数，要么停掉对应的node节点，重新配置一下皆可

下面是参考链接：

![c8de908967cdf30ed566afc1f059d25](http://img.minalz.cn/typora/c8de908967cdf30ed566afc1f059d25.png)

参考链接：https://blog.csdn.net/qq_42532161/article/details/104950672

结论：符合原因