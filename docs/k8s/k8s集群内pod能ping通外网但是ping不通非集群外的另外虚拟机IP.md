# k8s集群内pod能ping通外网但是ping不通非集群外的另外虚拟机IP

>环境：
>
>VirsualBox搭建的4台机器
>
>192.168.3.101 - k8s-master
>
>192.168.3.102 - k8s-worker1
>
>192.168.3.103 - k8s-worker2
>
>192.168.3.104 - nacos
>
>操作：
>
>根据第五步，创建了order和user的pod后，现在进入到k8s集群内的pod中（无论是order还是user），ping www.baidu.com可以通，但是ping192.168.3.104不通

之所以访问不了，是因为order的pod ip在外界访问不了，怎么解决呢？

01 可以将pod启动时所在的宿主机的ip写到容器中，也就是pod id和宿主机ip有一个对应关系

02 pod和宿主机使用host网络模式，也就是pod直接用宿主机的ip，但是如果服务高可用会有端口冲突问题[可以使用pod的调度策略，尽可能在高可用的情况下，不会将pod调度在同一个worker中]

所以直接在yaml文件中使用host网络模式，非host网络模式就不要操作实践了，在我的虚拟机环境中网络是仅主机网卡+NAT模式，就是不通（当然仅主机网卡+桥接方式也是不通的，我都实践过），最终改成host网络模式就可以了
(hostNetwork: true)

```yaml
 ...
 metadata:
      labels: 
        app: order
    spec: 
    # 主要是加上这句话，注意在order.yaml的位置
      hostNetwork: true
      containers: 
      - name: order
        image: registry.cn-hangzhou
...
```