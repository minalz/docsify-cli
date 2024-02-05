# k8s集群拉取阿里云镜像失败

> VirtualBox搭建的虚拟机，创建的k8s集群，拉取镜像失败，提示要登录仓库，但是我在对应的服务器中都已经docker login并成功了，可还是拉取不成功，参考如下的方案可解决，这里我使用的是方案三，方案一我操作了没成功，方案二没实际操作



#### 方案一

查看[官方文档](https://links.jianshu.com/go?to=https%3A%2F%2Fkubernetes.io%2Fdocs%2Fconcepts%2Fcontainers%2Fimages%2F%23using-a-private-regist)，发现kubelet在提取镜像时会读取`${home}/.docker/config.json`中的认证密钥，但是上述报错情况，显然没有读取到/root/.docker/config.json的密钥，重启kubelet也没有效果。根据官方文档所写，将`${home}/.docker/config.json`文件复制到`/var/lib/kubelet`下。如下操作：

```shell
$ cp ${home}/.docker/config.json /var/lib/kubelet/
$ systemctl restart kubelet.service
```



执行完以上操作之后，再重新部署服务，就可以正常拉取镜像了。



#### 方案二

参考github上一个[issues](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fkubernetes%2Fkubernetes%2Fissues%2F45487%23issuecomment-464516064),以root用户登录docker仓库(一登录)，在kubelet的systemd unit文件中加入User=root，重启kubelet。

```shell
#注意，我这里是用二进制安装的集群，如果你是用kubeadm安装的，需要找到对应的文件
$ vim /etc/systemd/system/kubelet.service
......
[Service]
User=root  #加入此行
......

$ systemctl daemon-reload
$ systemctl restart kubelet
```



执行完以上操作之后，再重新部署服务，就可以正常拉取镜像了。



#### 方案三（我使用的是方案3）

> 缺点：如果有多个命名空间，需要每个命名空间都单独创建一个secret

创建docker registry认证的Secret。

```shell
# 注意secret不会同步到所有的命名空间  如果是多个命名空间 需要单独都创建
$ kubectl create secret docker-registry my-aliyun-secret --docker-server=XXXXXXX --docker-username=xxxx --docker-password=xxxxx --docker-email=test@gmail.com
$ vim bxpp.yaml
......
    spec:
      imagePullSecrets:  # 加入这个参数
      - name: my-aliyun-secret
      containers:
......
$ kubectl apply -f bxpp-test.yaml
```

执行完以上操作之后，再重新部署服务，就可以正常拉取镜像了。

删除命名：

```shell
kubectl delete secret my-aliyun-secret
```



编辑内容：

```shell
kubectl delete secret my-aliyun-secret
```



我的配置（和上面是一样的，就是整理了一下格式）：

```
kubectl create secret docker-registry my-aliyun-secret \
--docker-server='registry.cn-hangzhou.aliyuncs.com' \
--docker-username='xxx' \
--docker-password='xxxx' \
--docker-email='xxx@163.com'
```

注意：

**如果内容有特殊字符的，加单引号即可**

#### 参考链接

https://www.jianshu.com/p/bf6275f75334