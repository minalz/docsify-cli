# docker-compose搭建SonarQube

## 1.准备工作

```sh
# 临时生效
sysctl -w vm.max_map_count=262144
sysctl -w fs.file-max=65536
ulimit -n 65536
ulimit -u 4096
# 重启生效
echo "sonar   -   nofile   65536
sonar   -   nproc    4096" > /etc/security/limits.d/99-sonarqube.conf
echo "vm.max_map_count=262144
fs.file-max=65536" > /etc/sysctl.d/99-sonarqube.conf
# 创建容器映射路径
mkdir -p /home/sonar/postgres/{postgresql,data}
mkdir -p  /home/sonar/sonarqube/{extensions,logs,data,conf}
chmod -R 777 /home/sonar/*  # 启动容器映射路径权限问题
```

## 2.新建docker-compose.yaml

```dockerfile
version: '3.1'
services:
  postgres:
    image: postgres:12.3
    restart: always
    container_name: my-postgres
    ports:
      - 9002:5432
    volumes:
      - /home/sonar/postgres/postgresql:/var/lib/postgresql
      - /home/sonar/postgres/data:/var/lib/postgresql/data
      - /etc/localtime:/etc/localtime:ro
    environment:
      TZ: Asia/Shanghai
      POSTGRES_USER: sonar
      POSTGRES_PASSWORD: sonar
      POSTGRES_DB: sonar

  sonar:
    image: sonarqube:7.9.2-community
    container_name: my-sonar
    depends_on:
      - postgres
    volumes:
      - /home/sonar/sonarqube/extensions:/opt/sonarqube/extensions
      - /home/sonar/sonarqube/logs:/opt/sonarqube/logs
      - /home/sonar/sonarqube/data:/opt/sonarqube/data
      - /home/sonar/sonarqube/conf:/opt/sonarqube/conf
      # 设置与宿主机时间同步
      - /etc/localtime:/etc/localtime:ro
    ports:
      - 9001:9000
    command:
      # 内存设置
      - -Dsonar.ce.javaOpts=-Xmx2048m
      - -Dsonar.web.javaOpts=-Xmx2048m
      # 设置服务代理路径
      - -Dsonar.web.context=/
      # 此设置用于集成gitlab时，回调地址设置
      - -Dsonar.core.serverBaseURL=https://sonarqube.example.com
    environment:
      TZ: Asia/Shanghai
      SONARQUBE_JDBC_USERNAME: sonar
      SONARQUBE_JDBC_PASSWORD: sonar
      SONARQUBE_JDBC_URL: jdbc:postgresql://postgres:5432/sonar
```

## 3.创建容器

```sh
docker-compose up -d
```

## 4.登录sonarqube

```http
http://yourserver:9000
```

```properties
账号: admin
密码: admin
```

## 5.汉化

```http
https://github.com/xuhuisheng/sonar-l10n-zh/releases/tag/sonar-l10n-zh-plugin-1.29
```

下载好插件 然后上传到`~/sonarqube/extensions/downloads`目录中 然后重启`docker-compose restart`

## 6.docker-compose其他命令

```sh
docker-compose stop # 停止所有容器
docker-compose rm # 删除所有容器
docker-compose restart # 重新启动所有容器
```

