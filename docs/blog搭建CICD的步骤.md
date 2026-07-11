# 🚀 Docker + Docsify + Jenkins 搭建 CI/CD 的步骤（GitHub 版本）

> 💡 使用 GitHub + Jenkins 实现自动化 CI/CD 部署流程

---

## 📦 1. 需要安装 Java 环境

📋 **步骤**: 下载 JDK 然后安装，配置环境变量即可

```shell
vi /etc/profile
export JAVA_HOME=/usr/local/java8/jdk1.8.0_181
export PATH=$PATH:$JAVA_HOME/bin
source /etc/profile
验证:
java -version
```



---

## 📦 2. 安装 Git

```shell
yum install git
验证:
git --version
📋 **验证和配置**:
git config --global user.name "your account"
git config --global user.email "your email"
ssh-keygen -t rsa -C "your email"
生成的公钥在:/root/.ssh/id_rsa.pub
复制公钥的内容,上传到github上,生成密钥
```

📋 **操作步骤**:

![image-20210108220846587](http://img.minalz.cn/typora/image-20210108220846587.png)

测试是否配置成功:

```shell
ssh -T git@github.com

Hi minalz! You've successfully authenticated, but GitHub does not provide shell access.
如果出现类似语句,说明成功了
```



---

## 🐳 3. 安装 Docker

### 🗑️ 3.1 卸载之前的 Docker

```sh
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

### 📦 3.2 安装必要的依赖

```sh
sudo yum install -y yum-utils \
    device-mapper-persistent-data \
    lvm2
```

### ⚙️ 3.3 设置 Docker 仓库

```sh
sudo yum-config-manager \
      --add-repo \
      https://download.docker.com/linux/centos/docker-ce.repo
```

> ⚠️ **注意**: 如果添加错了，用下面的链接修改（因为上面的命令再执行一遍也不会覆盖，是没用的）

📖 **参考链接**: https://blog.csdn.net/m0_47333020/article/details/108738569

### 📥 3.4 安装 Docker

```sh
sudo yum install -y docker-ce docker-ce-cli containerd.io
```

### 🚀 3.5 启动 Docker

```sh
sudo systemctl start docker
```

### ⚡ 3.6 添加镜像加速器（阿里云）

📋 **步骤**: 使用自己的阿里云账号登录，查看菜单栏左下角，发现有一个镜像加速器

📖 **参考链接**: https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors

### ✅ 3.7 验证 Docker 运行

```shell
docker run hello-world

出现以下说明没问题:
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
0e03bdcc26d7: Pull complete 
Digest: sha256:1a523af650137b8accdaed439c17d684df61ee4d74feac151b5b337bd29e7eec
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```



---

## 🔧 4. Jenkins 配置

### 📥 4.1 下载 Jenkins.war

```shell
wget http://mirrors.jenkins.io/war-stable/latest/jenkins.war
```

> ⚠️ **注意**: 下载特别慢，最好自己找其他资源下载，版本低了可以安装好了后再选择 `在线升级`

### 🚀 4.2 启动 Jenkins

```java
nohup java -Dhudson.util.ProcessTree.disable=true -jar jenkins.war --httpPort=9090 >/dev/null 2>&1 &
  
查看日志:
tail -f nohup.out
```

> 💡 **重要参数**: execute shell 中启动的进程在 Job 退出时会被杀死，所以需要加参数 `-Dhudson.util.ProcessTree.disable=true`

### 🌐 4.3 访问 Jenkins

#### 🔐 4.3.1 访问时需要输入密码

```shell
cat /root/.jenkins/secrets/initialAdminPassword
```

#### 📦 4.3.2 安装推荐的插件

![image-20210108230432312](http://img.minalz.cn/typora/image-20210108230432312.png)

#### 🔧 4.3.3 插件下载失败的解决方案

> ⚠️ **注意**: 如果插件下载不成功，修改插件的更新地址试试

```shell
https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json
```

#### 👤 4.3.4 创建用户

```shell
username: admin01
password: admin01
```

#### ⚙️ 4.3.5 配置 Git Java

📋 **路径**: [系统管理] -> [全局工具配置] -> [JDK、Git]



### 🛠️ 4.4 配置 Jenkins

#### 📝 4.4.1 定义 Pipeline 测试

```shell
node {
    
   // 拉取git上的代码
   stage('Preparation') {
      git 'https://github.com/minalz/docsify-cli.git'
   }
  
}
```

#### 🔗 4.4.2 Git Push 触发 Jenkins 自动构建

> 💡 **目标**: 当用户进行 git commit/push 提交代码到 GitHub 时，能够通知 Jenkins 自动构建

> ⚠️ **注意**: Jenkins 的 IP 一定要是 GitHub 能够访问到的地址

##### 🌐 (1) 在 GitHub 上配置 Jenkins 的 Webhook 地址

http://你的ip:9090/github-webhook

##### 🔑 (2) 生成 Personal Access Tokens

📋 **步骤**: Jenkins 访问 GitHub 需要授权，所以在 GitHub 上生成 Token 交给 Jenkins 使用

**路径**: GitHub Settings [个人信息右上角] → Developer settings → Personal access tokens → Generate new token

> ⚠️ **重要**: 最后保存好该 Token，比如: **72f048b514e95d6fe36f86d84374f2dcce402b43**

![image-20210108233620327](http://img.minalz.cn/typora/image-20210108233620327.png)

##### 📦 (3) Jenkins 安装插件

```
01 安装github plugin插件:[系统管理]->[插件管理]->[可选插件]
02 安装gitlab插件和gitlab hook插件:[系统管理]->[插件管理]->[可选插件]
```

##### ⚙️ (4) 配置 GitHub Server

📋 **配置步骤**:

添加github服务器

![image-20210108234043017](http://img.minalz.cn/typora/image-20210108234043017.png)

添加凭据

![image-20210108233925869](http://img.minalz.cn/typora/image-20210108233925869.png)

进行测试

![image-20210109011429739](http://img.minalz.cn/typora/image-20210109011429739.png)

> 💡 **重要**: 一定要在配置 Pipeline 中配置这个，否则无法触发 Push

![image-20210108234422729](http://img.minalz.cn/typora/image-20210108234422729.png)

📋 **配置全局 Git 账号和邮箱**:

**路径**: Manage Jenkins → System → Git plugin

![image-20240313102953298](http://img.minalz.cn/typora/image-20240313102953298.png)

### 📜 4.5 编写脚本

#### 📋 4.5.1 最终 Pipeline 配置

```shell
node {
    
   // 拉取git上的代码
   stage('Preparation') {
      git 'https://github.com/minalz/docsify-cli.git'
   }
   
   // 开始构建
   stage('Build') { 
      sh "/root/.jenkins/workspace/scripts/docsify-docker-build.sh"
   }

   // 开始推送镜像
   stage('Push') { 
      sh "/root/.jenkins/workspace/scripts/docsify-docker-push.sh"
   }

   // 开始运行
   stage('Run') { 
      sh "/root/.jenkins/workspace/scripts/docsify-docker-run.sh"
      // sh "BUILD_ID=DONTKILLME;nohup docsify serve docs > /usr/local/myapp/docsify-cli.log 2>&1 &"
   }
}
```

#### 📂 4.5.2 创建脚本

##### 📁 4.5.2.1 代码下载路径

```shell
cd /root/.jenkins/workspace/
mkdir scripts
vi pwd.txt 然后输入docker hub的密码 我这里是用的阿里云的镜像仓库
wq
```

##### 🏗️ 4.5.2.2 docsify-docker-build.sh

```shell
echo "==========开始Build=========="
# 进入到docsify-cli目录
cd ../docsify-cli/docs

# 编写Dockerfile文件 之前是10-alpine 但是会报错，升级成12-alpine之后就可以正常启动了
cat <<EOF > Dockerfile
FROM node:12-alpine
COPY  /   /docs/
WORKDIR /docs
# 老的域名 2022年5月31后停止使用了
# RUN npm i docsify-cli -g --registry=https://registry.npm.taobao.org
RUN npm i docsify-cli -g --registry=https://registry.npmmirror.com
EXPOSE 3000/tcp
ENTRYPOINT docsify serve .
EOF

echo "Dockerfile created successfully!"

# 定义镜像名称
imageNameAndTag="registry.cn-hangzhou.aliyuncs.com/first-repo/docsify-cli:v1.0"

# 删除正在运行的container
# 先判断旧的container(docsify-cli)是否存在 如果存在 也需要进行删除 否则无法启动的
if [[ "$(docker ps -as | grep docsify-cli 2> /dev/null)" != "" ]]; then
  echo "存在运行中的container容器，需要删除"
  docker rm -f docsify-cli
  echo "删除container成功"
fi

# 先删除旧的images
if [[ "$(docker images -q ${imageNameAndTag} 2> /dev/null)" != "" ]]; then
  echo "存在旧的image镜像，需要删除"
  docker rmi -f ${imageNameAndTag}
  echo "删除image成功"
fi

# 基于指定目录下的Dockerfile构建镜像
docker build -t ${imageNameAndTag} .
echo "==========结束Build=========="
```

##### 📤 4.5.2.3 docsify-docker-push.sh

```shell
echo "==========开始Push=========="
# 定义镜像名称
imageNameAndTag="registry.cn-hangzhou.aliyuncs.com/first-repo/docsify-cli:v1.0"

# 登录阿里云镜像仓库
cat /root/.jenkins/workspace/scripts/pwd.txt | docker login -u kawayi125 registry.cn-hangzhou.aliyuncs.com --password-stdin

# push镜像
docker push ${imageNameAndTag}
echo "==========结束Push=========="
```

##### 🚀 4.5.2.4 docsify-docker-run.sh

```shell
echo "==========开始Run=========="
# 定义镜像名称
imageNameAndTag="registry.cn-hangzhou.aliyuncs.com/first-repo/docsify-cli:v1.0"

# 运行镜像
docker run -d --name docsify-cli -p 80:3000 ${imageNameAndTag}
echo "==========结束Run=========="
```

##### 🔐 4.5.2.5 给脚本赋权

```shell
chmod +x docsify-*
```

##### 🌐 4.5.2.6 访问 Blog 地址

📋 **访问方式**: yourIp:port



---

## ⚠️ 5. 可能会遇到的问题

### 🔴 5.1 上传文件提示 413 Request Entity Too Large 错误

> 💡 **原因**: 因为我是用 Nginx 来代理的，所以需要设置一下上传的文件大小

```nginx
参数 ：client_max_body_size  2000m;  
```

```nginx
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;
    
    client_max_body_size  2000m; #最大限制为2000M（可根据自己的上传设置文件大小）

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
  
    server {
        listen 80;
...
```

### 🔴 5.2 GitHub Hook 触发了，但是 Jenkins 没有自动构建

📋 **解决步骤**:

**1️⃣ GitHub 网络不好，连接超时**

**2️⃣ Jenkins 上的 Git 无法访问，配置一下 GitHub 的 name 和 email**

📋 **路径**: Manage Jenkins → System → Git plugin

![image-20240313102953298](http://img.minalz.cn/typora/image-20240313102953298.png)

### 🔴 5.3 内网穿透配置（Cpolar）

> 💡 **场景**: 如果配置环境是本地的虚拟机，那么还需要做内网穿透

📖 **Cpolar 链接**: https://dashboard.cpolar.com/status

> ⚠️ **缺点**: 启动的时候提供 HTTP 和 HTTPS 的域名，但是重新启动后，域名就会变动

📋 **其他内网穿透软件对比**:

1.花生壳可以，但是https需要额外花6元认证

2.ngork，会不定时变动域名，不稳定

3.神桌，免费3天，后续就要收费了

4.natfrp，免费，但是是境外服务，延迟比较高，链接：https://www.natfrp.com/user/

**具体配置**:

**1️⃣ 修改 Jenkins URL 的地址为内网映射后的地址**

![image-20240313103649012](http://img.minalz.cn/typora/image-20240313103649012.png)

**路径**: Jenkins Manager → System → Jenkins Location

![image-20240313103623769](http://img.minalz.cn/typora/image-20240313103623769.png)

**2️⃣ GitHub 的 Webhook 地址也要同步改成内网映射后的地址**

![image-20240313103816599](http://img.minalz.cn/typora/image-20240313103816599.png)

---

### 🔴 5.4 Jenkins 和 K8s 不在同一集群中的问题

> ⚠️ **问题**: 执行 YAML 文件的时候会报错

📋 **解决方案**:

**方案 1️⃣: 在同一集群中执行**

> 💡 Jenkins 在 Master 节点上，如果是在 Worker 节点上，需要单独在那个 Worker 节点上执行命令

```sh
切换到master上，cd ~  --->  cat .kube/config  --->复制内容
切换到worker上   cd ~  --->  vi .kube/config   --->粘贴内容
```

**方案 2️⃣: 不在同一集群中，需要跨机器进行操作**

##### 📦 2.1 Hub 仓库登录

```sh
cat /usr/local/myapp/scripts/pwd.txt | docker login -u yourname registry.cn-hangzhou.aliyuncs.com --password-stdin
# pwd.txt 需要单独建在同一文件夹下 输入一行密码即可
```

##### 📜 2.2 执行 YAML 中的脚本命令

```sh
kubectl delete -f /usr/local/myapp/scripts/spring-test-cicd.yaml

kubectl apply -f /usr/local/myapp/scripts/spring-test-cicd.yaml

echo "k8s 【spring-test-cicd】 deploy success"
```

---

### 🔴 5.5 Jenkins 升级后报错

📖 **解决方案 1**: https://blog.csdn.net/CutelittleBo/article/details/123250302

> ⚠️ **注意**: 观察一下操作指令，直接复制执行，会漏命令

📖 **解决方案 2**: https://blog.csdn.net/weixin_45468221/article/details/122861158

> 💡 **说明**: 这个命令是第一个解决方案中的其中一个，按理说执行这个即可，但由于我是先执行了第一个，所以无法确定

