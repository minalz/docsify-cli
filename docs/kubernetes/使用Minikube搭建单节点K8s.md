# 使用Minikube搭建单节点K8s

> 需要科学上网

## 1.kubectl 安装

官网链接：https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/

## 2.minikube 安装

官网链接：https://minikube.sigs.k8s.io/docs/start/

## 3.测试

查看连接信息

```shell
kubectl config view
kubectl config get-contexts
kubectl cluster-info
```

体验Pod

> (1)创建pod_nginx.yaml
/usr/local/myapp/pod_nginx.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80
```

> (2)根据pod_nginx.yaml文件创建pod

```shell
kubectl apply -f pod_nginx.yaml
```

> (3)查看pod

```shell
kubectl get pods
kubectl get pods -o wide
kubectl describe pod nginx
```

> (4)进入nginx容器

```shell
# kubectl进入
kubectl exec -it nginx -- bash
# 通过docker进入
minikube ssh
docker ps
docker exec -it containerid bash
```

> (5)访问nginx，端口转发

```shell
# 若在minikube中，直接访问
# 若在物理主机上，要做端口转发
kubectl port-forward nginx 8080:80
```

> (6)删除pod

```shell
kubectl delete -f pod_nginx.yaml
```

## 4.问题：

4.1 minikube start 启动报错

```shell
minikube start --force --kubernetes-version=v1.28.4
```

解决链接：https://blog.csdn.net/u013810234/article/details/126568707

4.2 进入容器报错

```shell
kubectl exec [POD] [COMMAND] is DEPRECATED and will be removed in a future version. Use kubectl exec [POD] -- [COMMAND] instead.
```

解决方案：

```shell
旧版本：kubectl exec -it nginx bash
新版本：kubectl exec -it nginx -- bash
```

## 5.虚拟机每次关闭后，如何重新启动

2.1 docker重新启动

```shell
sudo systemctl start docker
```

2.2 minikube重新启动

```shell
minikube start --force --kubernetes-version=v1.28.4
```

## 6.管理您的集群
6.1 暂停 Kubernetes，而不影响已部署的应用程序：

```shell
minikube pause
```

6.2 取消暂停已暂停的实例：

```shell
minikube unpause
```

6.3 停止集群：

```shell
minikube stop
```

6.4 更改默认内存限制（需要重新启动）：

```shell
minikube config set memory 9001
```

6.5 浏览易于安装的 Kubernetes 服务目录：

```shell
minikube addons list
```

6.6 创建运行旧版 Kubernetes 的第二个集群：

```shell
minikube start -p aged --kubernetes-version=v1.16.1
```

6.7 删除所有 minikube 集群：

```shell
minikube delete --all
```