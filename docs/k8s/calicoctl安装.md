# 🔧 calicoctl 安装指南

> 📦 Calico 网络插件的管理工具安装教程

---

## 📥 1. 下载 calicoctl

```shell
# 必须在这个目录下
cd /usr/local/bin/

# 注意：版本号需要和安装的 Calico 版本号一致，否则会报版本不匹配错误
curl -o calicoctl -O -L https://github.com/projectcalico/calicoctl/releases/download/v3.20.2/calicoctl
```

> ⚠️ **重要**：calicoctl 版本必须与 Calico 网络插件版本匹配

---

## 🔐 2. 赋予执行权限

```shell
chmod +x calicoctl
```

---

## 📝 3. 查看配置文件

```shell
cat /etc/calico/calicoctl.cfg
```

> ⚠️ **注意**：如果查看不到该文件，需要手动创建文件夹和配置文件
> 
> ```shell
> mkdir -p /etc/calico
> vi /etc/calico/calicoctl.cfg
> ```
> 
> 不要直接使用 `vi /etc/calico/calicoctl.cfg`，会报错！

---

## 🧪 4. 测试安装

```shell
# 查看版本信息
calicoctl version

# 输出示例：
# Client Version:    v3.9.6
# Git commit:        eb009ecf

# 查看节点信息
calicoctl get nodes
```

> 💡 **提示**：如果想在任意目录下操作，需要配置环境变量：
> 
> ```shell
> # 编辑 /etc/profile 文件，末尾添加
> export PATH=$PATH:/usr/local/bin
> 
> # 使配置生效
> source /etc/profile
> ```

---

## 🔗 5. 关联 kubectl

```shell
cd /usr/local/bin/
cp -p calicoctl kubectl-calico

# 使用 kubectl 查看 Calico 状态
kubectl calico node status
```

---

## 📚 6. 参考链接

[Calico 安装官方文档](https://www.cnblogs.com/noise/p/15758641.html)

> 💡 **说明**：本文档主要用于排查 K8s 集群内部 Pod 为什么 ping 不通集群外的机器。最终解决方案是使用 **host 网络模式**，暴露宿主机 IP 即可解决。

---

> 💡 **提示**：calicoctl 是 Calico 网络策略管理工具，用于查看和管理 Calico 网络配置！
