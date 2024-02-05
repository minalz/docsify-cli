# calicoctl安装

> 针对于calico的管理插件

#### 1.下载

```shell
# 必须在这个控制台下
cd /usr/local/bin/
# 注意这个版本号需要和安装的calico版本号是一致的，否则会报版本不匹配的错误
curl -o calicoctl -O -L 
https://github.com/projectcalico/calicoctl/releases/download/v3.20.2/calicoctl
```



#### 2.赋权限

```shell
chmod +x calicoctl
```



#### 3.查看配置文件

> 如果查看不到这个文件，就需要手动创建文件夹（mkdir），然后创建这个文件（vi），不要直接vi /etc/calico/calicoctl.cfg,会报错的

```shell
cat /etc/calico/calicoctl.cfg
```



#### 4.测试

```shell
# 需要在/usr/local/bin下操作，如果想在任意文件下操作，需要配置环境变量/etc/profile 末尾添加export PATH=$PATH:/usr/local/bin,然后source /etc/profile,calicoctl version如果打印版本信息即成功了
Client Version:    v3.9.6
Git commit:        eb009ecf
# 查对应的node节点信息
calicoctl get nodes
```



#### 5.关联kubectl

```shell
cd /usr/local/bin/
cp -p calicoctl kubectl-calico
kubectl calico node status
```



#### 6.参考链接

> 第5步后面的步骤没有实际操作过了，因为当时是为了排查k8s集群内部pod为什么ping不通集群外的机器做的尝试，解决方案是加一个host网络模式，暴露宿主机ip就解决了，所以后续就没继续深入下去了，针对这个文件也有一个对应的解决文档

https://www.cnblogs.com/noise/p/15758641.html