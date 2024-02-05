# k8s创建镜像并推送镜像到远程仓库

#### 1.根据Dockerfile创建镜像

```shell
docker build -t user-image:v1.0 .
docker build -t order-image:v1.0 .
```

#### 2.推送镜像到远程仓库

> 这里我用的是阿里云

```shell
# 登录阿里云镜像仓库,然后输入密码
docker login --username=yourname registry.cn-hangzhou.aliyuncs.com
# 打tag
docker tag order-image:v1.0 registry.cn-hangzhou.aliyuncs.com/minalz-k8s-repo/order-image:v1.0
# 推送
docker push registry.cn-hangzhou.aliyuncs.com/minalz-k8s-repo/order-image:v1.0
```

