# kubernetes理论认知

```text
(10)这个集群要配合完成一些工作，总要有一些组件的支持吧？接下来我们来想想有哪些组件，
然后画一个相对完整的架构图
01-总得要有一个操作集群的客户端，也就是和集群打交道
kubectl
02-请求肯定是到达Master Node，然后再分配给Worker Node创建Pod之类的
关键是命令通过kubectl过来之后，是不是要认证授权一下？
03-请求过来之后，Master Node中谁来接收？
APIServer
04-API收到请求之后，接下来调用哪个Worker Node创建Pod，Container之类的，得要有调度策略
Scheduler
[https://kubernetes.io/docs/concepts/scheduling/kube-scheduler/]
05-Scheduler通过不同的策略，真正要分发请求到不同的Worker Node上创建内容，具体谁负责？
Controller Manager
06-Worker Node接收到创建请求之后，具体谁来负责
咕泡学院 只为更好的你
Kubelet服务，最终Kubelet会调用Docker Engine，创建对应的容器[这边是不是也反应出一
点，在Node上需要有Docker Engine，不然怎么创建维护容器？]
07-会不会涉及到域名解析的问题？
DNS
08-是否需要有监控面板能够监测整个集群的状态？
Dashboard
09-集群中这些数据如何保存？分布式存储
ETCD
10-至于像容器的持久化存储，网络等可以联系一下Docker中的内容
```

![image-20231208161618629](http://img.minalz.cn/typora/image-20231208161618629.png)

不妨把这个图翻转一下方便查看

![image-20231208161702697](http://img.minalz.cn/typora/image-20231208161702697.png)

(12)官网K8S架构图

https://kubernetes.io/docs/concepts/architecture/cloud-controller/

![image-20231208161723745](http://img.minalz.cn/typora/image-20231208161723745.png)

**Minikube[Y]**

K8S单节点，适合在本地学习使用

官网 ：https://kubernetes.io/docs/setup/learning-environment/minikube/

GitHub ：https://github.com/kubernetes/minikube

**kubeadm[Y]**

本地多节点

GitHub ：https://github.com/kubernetes/kubeadm