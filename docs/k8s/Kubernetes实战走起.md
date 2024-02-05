# 服务部署到Kubernetes

## 部署wordpress+mysql

> (1)创建wordpress命名空间

```shell
kubectl create namespace wordpress
```

> (2)创建wordpress-db.yaml文件：`网盘/Kubernetes实战走起/课堂源码/wordpress-db.yaml`

> (3)根据wordpress-db.yaml创建资源[mysql数据库]

```shell
kubectl apply -f wordpress-db.yaml
kubectl get pods -n wordpress      # 记得获取ip，因为wordpress.yaml文件中要修改
kubectl get svc mysql -n wordpress
kubectl describe svc mysql -n wordpress
```

> (4)创建wordpress.yaml文件：`网盘/Kubernetes实战走起/课堂源码/wordpress.yaml`

> (5)根据wordpress.yaml创建资源[wordpress]

```shell
kubectl apply -f wordpress.yaml    #修改其中mysql的ip地址,其实也可以使用service的name:mysql
kubectl get pods -n wordpress 
kubectl get svc -n wordpress   # 获取到转发后的端口，如30063
```

> (6)访问测试

win上访问集群中任意宿主机节点的IP:30063

## 部署Spring Boot项目

> `流程`：确定服务-->编写Dockerfile制作镜像-->上传镜像到仓库-->编写K8S文件-->创建
>
> `网盘/Kubernetes实战走起/课堂源码/springboot-demo`

> (1)准备Spring Boot项目springboot-demo

```java
@RestController
public class K8SController {
    @RequestMapping("/k8s")
    public String k8s(){
        return "hello K8s!";
    }
}
```

> (2)生成xxx.jar，并且上传到springboot-demo目录

```
mvn clean pakcage
```

> (3)编写Dockerfile文件
>
> mkdir springboot-demo
>
> cd springboot-demo
>
> vi Dockerfile

```dockerfile
FROM openjdk:8-jre-alpine
COPY springboot-demo-0.0.1-SNAPSHOT.jar /springboot-demo.jar
ENTRYPOINT ["java","-jar","/springboot-demo.jar"]
```

> (4)根据Dockerfile创建image

```xshell
docker build -t springboot-demo-image .
```

> (5)使用docker run创建container

```
docker run -d --name s1 springboot-demo-image
```

> (6)访问测试

```
docker inspect s1
curl ip:8080/k8s
```

> (7)将镜像推送到镜像仓库

```shell
# 登录阿里云镜像仓库
docker login --username=itcrazy2016@163.com registry.cn-hangzhou.aliyuncs.com

docker tag springboot-demo-image registry.cn-hangzhou.aliyuncs.com/itcrazy2016/springboot-demo-image:v1.0

docker push registry.cn-hangzhou.aliyuncs.com/itcrazy2016/springboot-demo-image:v1.0
```

> (8)编写Kubernetes配置文件
>
> vi springboot-demo.yaml
>
> kubectl apply -f springboot-demo.yaml

```yaml
# 以Deployment部署Pod
apiVersion: apps/v1
kind: Deployment
metadata: 
  name: springboot-demo
spec: 
  selector: 
    matchLabels: 
      app: springboot-demo
  replicas: 1
  template: 
    metadata:
      labels: 
        app: springboot-demo
    spec: 
      containers: 
      - name: springboot-demo
        image: registry.cn-hangzhou.aliyuncs.com/itcrazy2016/springboot-demo-image:v1.0
        ports: 
        - containerPort: 8080
---
# 创建Pod的Service
apiVersion: v1
kind: Service
metadata: 
  name: springboot-demo
spec: 
  ports: 
  - port: 80
    protocol: TCP
    targetPort: 8080
  selector: 
    app: springboot-demo
---
# 创建Ingress，定义访问规则，一定要记得提前创建好nginx ingress controller
apiVersion: extensions/v1beta1
kind: Ingress
metadata: 
  name: springboot-demo
spec: 
  rules: 
  - host: k8s.demo.gper.club
    http: 
      paths: 
      - path: /
        backend: 
          serviceName: springboot-demo
          servicePort: 80
```

> (9)查看资源

```
kubectl get pods
kubectl get pods -o wide
curl pod_id:8080/k8s
kubectl get svc
kubectl scale deploy springboot-demo --replicas=5
```

> (10)win配置hosts文件[一定要记得提前创建好nginx ingress controller]

```
192.168.0.61 springboot.jack.com
```

> (11)win浏览器访问

```
http://springboot.jack.com/k8s
```

## 部署Nacos项目

### 传统方式

> (1)准备两个Spring Boot项目，名称为user和order，表示两个服务
>
> `网盘/Kubernetes实战走起/课堂源码/user`
>
> `网盘/Kubernetes实战走起/课堂源码/order`

> (2)下载部署nacos server1.0.0
>
> `github`：<https://github.com/alibaba/nacos/releases>
>
> ·网盘/Kubernetes实战走起/课堂源码/nacos-server-1.0.0.tar.gz·

```
01  上传nacos-server-1.0.0.tar.gz到阿里云服务器39:/usr/local/nacos

02  解压：tar -zxvf

03  进入到bin目录执行：sh startup.sh -m standalone  [需要有java环境的支持]

04  浏览器访问：39.100.39.63:8848/nacos

05  用户名和密码：nacos
```

> (3)将应用注册到nacos，记得修改Spring Boot项目中application.yml文件

```
01 将user/order服务注册到nacos

02 user服务能够找到order服务
```

> (4)启动两个Spring Boot项目，然后查看nacos server的服务列表

> (5)为了验证user能够发现order的地址
>
> 访问localhost:8080/user/test，查看日志输出，从而测试是否可以ping通order地址

### K8s方式

#### user和order是K8s中的Pod

> `思考`：如果将user和order都迁移到K8s中，那服务注册与发现会有问题吗？

> (1)生成xxx.jar，并且分别上传到master节点的user和order目录
>
> resources/nacos/jar/xxx.jar

```
mvn clean pakcage
```

> (2)来到对应的目录，编写Dockerfile文件
>
> vi Dockerfile

```dockerfile
FROM openjdk:8-jre-alpine
COPY user-0.0.1-SNAPSHOT.jar /user.jar
ENTRYPOINT ["java","-jar","/user.jar"]
```

```dockerfile
FROM openjdk:8-jre-alpine
COPY order-0.0.1-SNAPSHOT.jar /order.jar
ENTRYPOINT ["java","-jar","/order.jar"]
```

> (3)根据Dockerfile创建image

```xshell
docker build -t user-image:v1.0 .
docker build -t order-image:v1.0 .
```

> (4)将镜像推送到镜像仓库

```shell
# 登录阿里云镜像仓库
docker login --username=itcrazy2016@163.com registry.cn-hangzhou.aliyuncs.com

docker tag user-image:v1.0 registry.cn-hangzhou.aliyuncs.com/itcrazy2016/user-image:v1.0

docker push registry.cn-hangzhou.aliyuncs.com/itcrazy2016/user-image:v1.0
```

> (5)编写Kubernetes配置文件
>
> vi user.yaml/order.yaml
>
> kubectl apply -f user.yaml/order.yaml

```yaml
# 以Deployment部署Pod
apiVersion: apps/v1
kind: Deployment
metadata: 
  name: user
spec: 
  selector: 
    matchLabels: 
      app: user
  replicas: 1
  template: 
    metadata:
      labels: 
        app: user
    spec: 
      containers: 
      - name: user
        image: registry.cn-hangzhou.aliyuncs.com/itcrazy2016/user-image:v1.0
        ports: 
        - containerPort: 8080
---
# 创建Pod的Service
apiVersion: v1
kind: Service
metadata: 
  name: user
spec: 
  ports: 
  - port: 80
    protocol: TCP
    targetPort: 8080
  selector: 
    app: user
---
# 创建Ingress，定义访问规则，一定要记得提前创建好nginx ingress controller
apiVersion: extensions/v1beta1
kind: Ingress
metadata: 
  name: user
spec: 
  rules: 
  - host: k8s.demo.gper.club
    http: 
      paths: 
      - path: /
        backend: 
          serviceName: user
          servicePort: 80
```

```yaml
# 以Deployment部署Pod
apiVersion: apps/v1
kind: Deployment
metadata: 
  name: order
spec: 
  selector: 
    matchLabels: 
      app: order
  replicas: 1
  template: 
    metadata:
      labels: 
        app: order
    spec: 
      containers: 
      - name: order
        image: registry.cn-hangzhou.aliyuncs.com/itcrazy2016/order-image:v1.0
        ports: 
        - containerPort: 9090
---
# 创建Pod的Service
apiVersion: v1
kind: Service
metadata: 
  name: order
spec: 
  ports: 
  - port: 80
    protocol: TCP
    targetPort: 9090
  selector: 
    app: order
```

> (6)查看资源

```shell
kubectl get pods
kubectl get pods -o wide
kubectl get svc
kubectl get ingress
```

> (7)查看nacos server上的服务信息
>
> 可以发现，注册到nacos server上的服务ip地址为pod的ip，比如192.168.80.206/192.168.190.82

> (8)访问测试

```shell
# 01 集群内
curl user-pod-ip:8080/user/test
kubectl logs -f <pod-name> -c <container-name>   [主要是为了看日志输出，证明user能否访问order]

# 02 集群外，比如win的浏览器，可以把集群中原来的ingress删除掉
http://k8s.demo.gper.club/user/test
```

**结论**：如果服务都是在K8s集群中，最终将pod ip注册到了nacos server，那么最终服务通过pod ip发现so easy。

#### user传统和order迁移K8s

> 假如user现在不在K8s集群中，order在K8s集群中
>
> 比如user使用本地idea中的，order使用上面K8s中的

> (1)启动本地idea中的user服务

> (2)查看nacos server中的user服务列表

> (3)访问本地的localhost:8080/user/test，并且观察idea中的日志打印，发现访问的是order的pod id，此时肯定是不能进行服务调用的，怎么解决呢？

> (4)解决思路
>
> ```
> 之所以访问不了，是因为order的pod ip在外界访问不了，怎么解决呢？
> 01 可以将pod启动时所在的宿主机的ip写到容器中，也就是pod id和宿主机ip有一个对应关系
> 02 pod和宿主机使用host网络模式，也就是pod直接用宿主机的ip，但是如果服务高可用会有端口冲突问题[可以使用pod的调度策略，尽可能在高可用的情况下，不会将pod调度在同一个worker中]
> ```

> (5)我们来演示一个host网络模式的方式，修改order.yaml文件
>
> 修改之后apply之前可以看一下各个节点的9090端口是否被占用
>
> lsof -i tcp:9090

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

> (6)kubectl apply -f order.yaml 
>
> - kubectl get pods -o wide   --->找到pod运行在哪个机器上，比如w2
> - 查看w2上的9090端口是否启动

> (7)查看nacos server上order服务
>
> 可以发现此时用的是w2宿主机的9090端口

> (8)本地idea访问测试
>
> localhost:8080/user/test