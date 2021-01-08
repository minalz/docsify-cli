# Docker + Docsify + jenkins搭建CICD的步骤

## 1.需要安装java环境

## 2.安装git

## 3.安装docker

## 4.执行jenkins.war

```java
java -Dhudson.util.ProcessTree.disable=true -jar jenkins.war --httpPort=9090
```

execute shell中启动的进程在Job退出时会被杀死，所以需要加参数

`-Dhudson.util.ProcessTree.disable=true`

## 5.访问jenkins并且安装推荐插件，并且修改插件的更新地址为

`https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json`

5.1. 安装需要的插件 配置github等

5.2 定义pipeline

```shell
node {
    
   // 拉取git上的代码
   stage('Preparation') {
      git 'https://github.com/minalz/docsify-cli.git'
   }
   
   // 开始运行
   stage('Run') { 
      sh "/root/.jenkins/workspace/scripts/docsify-docker.sh"
      // sh "BUILD_ID=DONTKILLME;nohup docsify serve docs > /usr/local/myapp/docsify-cli.log 2>&1 &"
   }
}
```



5.3 写脚本

```shell
# 进入到docsify-cli目录
cd ../docsify-cli/docs

# 编写Dockerfile文件
cat <<EOF > Dockerfile
FROM node:10-alpine
COPY  /   /docs/
WORKDIR /docs
RUN npm i docsify-cli -g --registry=https://registry.npm.taobao.org
EXPOSE 3000/tcp
ENTRYPOINT docsify serve .
EOF

echo "Dockerfile created successfully!"

# 定义镜像名称
imageNameAndTag="registry.cn-hangzhou.aliyuncs.com/first-repo/docsify-cli:v1.0"

# 删除旧的images和正在运行的container 但是不能直接先删除container 需要等成功上传到镜像仓库后才能删除 所以需要分两步
# 先判断是否存在旧的images 存在 先删除images
if [[ "$(docker images -q ${imageNameAndTag} 2> /dev/null)" ！= "" ]]; then
  echo "存在旧的image镜像，需要删除"
  docker rmi -f ${imageNameAndTag}
  echo "删除image成功"
fi

# 基于指定目录下的Dockerfile构建镜像
docker build -t ${imageNameAndTag} .

# 登录阿里云镜像仓库
cat /root/.jenkins/workspace/scripts/pwd.txt | docker login -u kawayi125 registry.cn-hangzhou.aliyuncs.com --password-stdin

# push镜像
docker push ${imageNameAndTag}

# 再判断container是否存在 如果存在 也需要进行删除 否则无法启动的
if [[ "$(docker images -q ${imageNameAndTag} 2> /dev/null)" ！= "" ]]; then
  echo "存在运行中的container容器，需要删除"
  docker rm -f docsify-cli
  echo "删除container成功"
fi

# 运行镜像
docker run -d --name docsify-cli -p 3000:3000 ${imageNameAndTag}
```

docker login登录阿里云有好几种方式，也可以配置一个固定的密钥来进行登录

docker login登录

```shell
docker login -u admin -p admin [镜像库]
```

但是这种方式是不安全的
密码有特殊字符  需要用"/"进行转义
通过STDIN输入密码

通过第二种方式来登录：
通过 STDIN 输入密码

先将密码存储在 pwd.txt 文件中

```shell
cat pwd.txt | docker login -u [镜像库账户名] [镜像库] --password-stdin
```

