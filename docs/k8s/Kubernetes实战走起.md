# 🚀 Kubernetes 实战走起

> 📦 服务部署到 Kubernetes 的完整实践指南

---

## 📝 部署 WordPress + MySQL

### 1. 创建命名空间

```shell
kubectl create namespace wordpress
```

### 2. 部署 MySQL

**创建 wordpress-db.yaml**：

```shell
kubectl apply -f wordpress-db.yaml
kubectl get pods -n wordpress
kubectl get svc mysql -n wordpress
kubectl describe svc mysql -n wordpress
```

### 3. 部署 WordPress

**创建 wordpress.yaml**（注意修改 MySQL 的 IP 地址或使用 Service 名称）：

```shell
kubectl apply -f wordpress.yaml
kubectl get pods -n wordpress
kubectl get svc -n wordpress
```

### 4. 访问测试

在 Windows 上访问集群中任意宿主机节点的 IP:端口（如 30063）

---

## 🌱 部署 Spring Boot 项目

### 流程概览

```
确定服务 → 编写 Dockerfile 制作镜像 → 上传镜像到仓库 → 编写 K8s 文件 → 创建
```

### 1. 准备 Spring Boot 项目

```java
@RestController
public class K8SController {
    @RequestMapping("/k8s")
    public String k8s(){
        return "hello K8s!";
    }
}
```

### 2. 打包项目

```shell
mvn clean package
```

### 3. 编写 Dockerfile

**目录结构**：

```shell
mkdir springboot-demo
cd springboot-demo
vi Dockerfile
```

**Dockerfile 内容**：

```dockerfile
FROM openjdk:8-jre-alpine
COPY springboot-demo-0.0.1-SNAPSHOT.jar /springboot-demo.jar
ENTRYPOINT ["java","-jar","/springboot-demo.jar"]
```

### 4. 构建镜像

```shell
docker build -t springboot-demo-image .
```

### 5. 测试容器

```shell
docker run -d --name s1 springboot-demo-image
docker inspect s1
curl ip:8080/k8s
```

### 6. 推送镜像到阿里云

```shell
# 登录阿里云镜像仓库
docker login --username=itcrazy2016@163.com registry.cn-hangzhou.aliyuncs.com

# 打标签
docker tag springboot-demo-image registry.cn-hangzhou.aliyuncs.com/itcrazy2016/springboot-demo-image:v1.0

# 推送
docker push registry.cn-hangzhou.aliyuncs.com/itcrazy2016/springboot-demo-image:v1.0
```

### 7. 编写 Kubernetes 配置文件

**springboot-demo.yaml**：

```yaml
# 以 Deployment 部署 Pod
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
# 创建 Pod 的 Service
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
# 创建 Ingress，定义访问规则
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

```shell
kubectl apply -f springboot-demo.yaml
```

### 8. 查看资源

```shell
kubectl get pods
kubectl get pods -o wide
curl pod_ip:8080/k8s
kubectl get svc
kubectl scale deploy springboot-demo --replicas=5
```

### 9. 配置 Hosts 并访问

**Windows hosts 文件**：

```
192.168.0.61 springboot.jack.com
```

**浏览器访问**：

```
http://springboot.jack.com/k8s
```

---

## 🏢 部署 Nacos 项目

### 传统方式部署

#### 1. 准备 Spring Boot 项目

- **user 服务**：表示用户服务
- **order 服务**：表示订单服务

#### 2. 部署 Nacos Server

```shell
# 01 上传 nacos-server-1.0.0.tar.gz 到阿里云服务器
# 02 解压
tar -zxvf nacos-server-1.0.0.tar.gz

# 03 启动（需要 Java 环境）
cd bin
sh startup.sh -m standalone

# 04 浏览器访问
http://39.100.39.63:8848/nacos

# 05 登录（用户名和密码都是 nacos）
```

#### 3. 注册服务到 Nacos

修改 Spring Boot 项目中的 `application.yml` 文件，将 user/order 服务注册到 Nacos。

#### 4. 测试服务发现

访问 `localhost:8080/user/test`，查看日志输出，测试 user 是否可以发现 order 服务。

---

### K8s 方式部署

#### 场景一：User 和 Order 都是 K8s 中的 Pod

**思考**：如果将 user 和 order 都迁移到 K8s 中，服务注册与发现会有问题吗？

##### 1. 打包项目

```shell
mvn clean package
```

##### 2. 编写 Dockerfile

**user/Dockerfile**：

```dockerfile
FROM openjdk:8-jre-alpine
COPY user-0.0.1-SNAPSHOT.jar /user.jar
ENTRYPOINT ["java","-jar","/user.jar"]
```

**order/Dockerfile**：

```dockerfile
FROM openjdk:8-jre-alpine
COPY order-0.0.1-SNAPSHOT.jar /order.jar
ENTRYPOINT ["java","-jar","/order.jar"]
```

##### 3. 构建镜像

```shell
docker build -t user-image:v1.0 .
docker build -t order-image:v1.0 .
```

##### 4. 推送镜像

```shell
# 登录阿里云
docker login --username=itcrazy2016@163.com registry.cn-hangzhou.aliyuncs.com

# 推送 user 镜像
docker tag user-image:v1.0 registry.cn-hangzhou.aliyuncs.com/itcrazy2016/user-image:v1.0
docker push registry.cn-hangzhou.aliyuncs.com/itcrazy2016/user-image:v1.0
```

##### 5. 编写 Kubernetes 配置文件

**user.yaml**：

```yaml
# 以 Deployment 部署 Pod
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
# 创建 Pod 的 Service
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
# 创建 Ingress
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

**order.yaml**：

```yaml
# 以 Deployment 部署 Pod
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
# 创建 Pod 的 Service
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

```shell
kubectl apply -f user.yaml
kubectl apply -f order.yaml
```

##### 6. 查看资源

```shell
kubectl get pods
kubectl get pods -o wide
kubectl get svc
kubectl get ingress
```

##### 7. 查看 Nacos 服务列表

注册到 Nacos Server 上的服务 IP 地址为 Pod 的 IP（如 192.168.80.206 / 192.168.190.82）。

##### 8. 访问测试

**集群内访问**：

```shell
curl user_pod_ip:8080/user/test

# 查看日志（证明 user 能否访问 order）
kubectl logs -f <pod-name> -c <container-name>
```

**集群外访问**：

```
http://k8s.demo.gper.club/user/test
```

> ✅ **结论**：如果服务都在 K8s 集群中，最终将 Pod IP 注册到了 Nacos Server，服务通过 Pod IP 发现非常简单。

---

#### 场景二：User 传统部署 + Order 迁移到 K8s

**场景说明**：User 在本地 IDEA 中运行，Order 在 K8s 集群中。

##### 1. 启动本地 User 服务

在 IDEA 中启动 User 服务。

##### 2. 查看 Nacos 服务列表

确认 User 服务已注册到 Nacos。

##### 3. 测试访问

访问 `localhost:8080/user/test`，观察 IDEA 中的日志打印。

**问题**：访问的是 Order 的 Pod IP，此时肯定不能进行服务调用。

##### 4. 解决思路

**方案一**：Pod IP 与宿主机 IP 映射

将 Pod 启动时所在的宿主机 IP 写到容器中，建立 Pod IP 和宿主机 IP 的对应关系。

**方案二**：使用 Host 网络模式（✅ 推荐）

Pod 和宿主机使用 Host 网络模式，Pod 直接使用宿主机的 IP。

> ⚠️ **注意**：如果服务高可用会有端口冲突问题。可以使用 Pod 调度策略，尽可能在高可用的情况下，不会将 Pod 调度在同一个 Worker 中。

##### 5. 修改 Order.yaml

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
    image: registry.cn-hangzhou...
...
```

##### 6. 应用配置

```shell
# 应用前检查各节点的 9090 端口是否被占用
lsof -i tcp:9090

# 应用配置
kubectl apply -f order.yaml

# 查看 Pod 运行在哪个机器上
kubectl get pods -o wide

# 查看对应节点上的 9090 端口是否启动
lsof -i tcp:9090
```

##### 7. 查看 Nacos 服务列表

此时 Order 服务使用的是宿主机的 9090 端口。

##### 8. 本地测试

访问 `localhost:8080/user/test`，验证服务调用是否成功。

---

> 💡 **提示**：K8s 中的服务注册与发现，关键在于 Pod IP 的可达性！
