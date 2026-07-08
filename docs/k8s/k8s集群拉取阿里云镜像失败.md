# ☁️ K8s 集群拉取阿里云镜像失败

> ❌ 问题：VirtualBox 虚拟机 K8s 集群拉取阿里云镜像失败，提示需要登录仓库

---

## 🔍 问题描述

- ✅ Docker login 登录成功
- ❌ K8s 拉取镜像仍然失败
- ❌ 提示需要认证

---

## 🛠️ 解决方案

### 方案一：复制 Docker 配置到 kubelet（未成功）

查看[官方文档](https://kubernetes.io/docs/concepts/containers/images/#using-a-private-registry)，发现 kubelet 在提取镜像时会读取 `${home}/.docker/config.json` 中的认证密钥。

**操作步骤**：

```shell
# 复制 Docker 配置到 kubelet 目录
$ cp ${home}/.docker/config.json /var/lib/kubelet/

# 重启 kubelet
$ systemctl restart kubelet.service
```

> ⚠️ **结果**：操作后重新部署服务，仍然无法拉取镜像

---

### 方案二：修改 kubelet 服务用户（未实际操作）

参考 GitHub [Issues](https://github.com/kubernetes/kubernetes/issues/45487#issuecomment-464516064)，以 root 用户登录 Docker 仓库，在 kubelet 的 systemd unit 文件中加入 `User=root`。

**操作步骤**：

```shell
# 编辑 kubelet 服务文件（二进制安装方式）
$ vim /etc/systemd/system/kubelet.service
......
[Service]
User=root  # 加入此行
......

# 重新加载配置
$ systemctl daemon-reload

# 重启 kubelet
$ systemctl restart kubelet
```

> 💡 **注意**：如果是 kubeadm 安装的集群，需要找到对应的配置文件

---

### 方案三：创建 Docker Registry Secret（✅ 推荐，已使用）

> ⚠️ **缺点**：如果有多个命名空间，需要每个命名空间都单独创建一个 Secret

#### 1. 创建 Secret

```shell
# 注意：Secret 不会同步到所有命名空间，多个命名空间需要分别创建
$ kubectl create secret docker-registry my-aliyun-secret \
    --docker-server='registry.cn-hangzhou.aliyuncs.com' \
    --docker-username='xxx' \
    --docker-password='xxxx' \
    --docker-email='xxx@163.com'
```

> 💡 **提示**：如果内容有特殊字符，加单引号即可

#### 2. 在 Deployment 中引用 Secret

```yaml
# 编辑部署文件
$ vim bxpp.yaml
......
spec:
  imagePullSecrets:  # 添加这个参数
  - name: my-aliyun-secret
  containers:
......

# 应用配置
$ kubectl apply -f bxpp-test.yaml
```

#### 3. 验证

执行完以上操作后，重新部署服务，即可正常拉取镜像！

---

## 🔧 Secret 管理命令

### 删除 Secret

```shell
kubectl delete secret my-aliyun-secret
```

### 编辑 Secret

```shell
kubectl edit secret my-aliyun-secret
```

---

## 📝 配置示例

```shell
kubectl create secret docker-registry my-aliyun-secret \
    --docker-server='registry.cn-hangzhou.aliyuncs.com' \
    --docker-username='xxx' \
    --docker-password='xxxx' \
    --docker-email='xxx@163.com'
```

> ⚠️ **重要**：如果内容有特殊字符，加单引号即可

---

## 📚 参考链接

[K8s 拉取私有镜像解决方案](https://www.jianshu.com/p/bf6275f75334)

---

> 💡 **提示**：推荐使用方案三（创建 Secret），简单且可靠！
