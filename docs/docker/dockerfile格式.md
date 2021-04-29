# Dockerfile文件

## java -jar包启动

```dockerfile
FROM openjdk:8 
MAINTAINER 作者名称 
LABEL name="dockerfile-demo" version="1.0" author="作者名称" 
COPY dockerfile-demo-0.0.1-SNAPSHOT.jar dockerfile-image.jar 
CMD ["java","-jar","dockerfile-image.jar"]
```

## docsify项目

```dockerfile
FROM node:10-alpine
COPY  /   /docs/
WORKDIR /docs
RUN npm i docsify-cli -g --registry=https://registry.npm.taobao.org
EXPOSE 3000/tcp
ENTRYPOINT docsify serve .
```

