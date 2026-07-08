# 🔍 Docker Compose 搭建 SonarQube

> 📦 使用 Docker Compose 部署 SonarQube 代码质量管理平台

---

## 📖 官网

[SonarQube 官方网站](https://www.sonarqube.org/)

---

## 1️⃣ 准备工作

### 配置系统参数

```bash
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
mkdir -p /home/sonar/sonarqube/{extensions,logs,data,conf}

# 解决启动容器映射路径权限问题
chmod -R 777 /home/sonar/*
```

---

## 2️⃣ 创建 docker-compose.yaml

```yaml
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
      # 此设置用于集成 GitLab 时，回调地址设置
      - -Dsonar.core.serverBaseURL=https://sonarqube.example.com
    environment:
      TZ: Asia/Shanghai
      SONARQUBE_JDBC_USERNAME: sonar
      SONARQUBE_JDBC_PASSWORD: sonar
      SONARQUBE_JDBC_URL: jdbc:postgresql://postgres:5432/sonar
```

---

## 3️⃣ 创建容器

```bash
docker-compose up -d
```

---

## 4️⃣ 登录 SonarQube

**访问地址：** `http://yourserver:9000`

**默认账号：**
- 用户名：`admin`
- 密码：`admin`

---

## 5️⃣ 汉化

### 下载汉化插件

[sonar-l10n-zh 插件下载](https://github.com/xuhuisheng/sonar-l10n-zh/releases/tag/sonar-l10n-zh-plugin-1.29)

### 安装步骤

1. 下载好插件
2. 上传到 `~/sonarqube/extensions/downloads` 目录中
3. 重启服务：`docker-compose restart`

> 💡 也可以在应用市场直接下载插件，但速度会比较慢

---

## 6️⃣ 添加 Java 语言插件

![添加 Java 插件](http://img.minalz.cn/typora/image-20210628223609504.png)

---

## 7️⃣ 下载代码规则插件

选择阿里的 **P3C** 插件：

[P3C 插件下载](https://github.com/rhinoceros/sonar-p3c-pmd/releases/tag/pmd-3.2.0-beta-with-p3c1.3.6-pmd6.10.0)

### 安装步骤

1. 下载 `sonar-pmd-plugin-3.2.0-SNAPSHOT.jar`
2. 上传到 `~/sonarqube/extensions/downloads` 目录中
3. 重启服务生效

---

## 8️⃣ 配置规则

### 8.1 创建新的语言配置

![创建语言配置](http://img.minalz.cn/typora/image-20210628225929981.png)

### 8.2 激活配置

![激活配置1](http://img.minalz.cn/typora/image-20210628230845387.png)

![激活配置2](http://img.minalz.cn/typora/image-20210628231013978.png)

![激活配置3](http://img.minalz.cn/typora/image-20210628231105326.png)

---

## 9️⃣ 项目连接到 SonarQube 服务器

[SonarScanner for Maven 文档](https://docs.sonarqube.org/latest/analysis/scan/sonarscanner-for-maven/)

### 9.1 Maven 直接连接

![创建项目](http://img.minalz.cn/typora/image-20210628231413773.png)

点击设置后，会跳转到创建令牌页面

![创建令牌](http://img.minalz.cn/typora/image-20210628231536044.png)

输入一个 token 名字，随后获取到一个 token 密钥

![获取令牌](http://img.minalz.cn/typora/image-20210628231634951.png)

### 9.2 执行扫描命令

```bash
mvn sonar:sonar \
  -Dsonar.projectKey=elkdemo \
  -Dsonar.host.url=http://localhost:9001 \
  -Dsonar.login=ce0994e82cd91bce22342a899f028fcf9fd82e9f
```

### ❌ 常见错误

```
SCM provider autodetection failed. Please use "sonar.scm.provider" 
to define SCM of your project, or disable the SCM Sensor in the project settings
```

**解决方案：**

```bash
# 先试这个，一般可以的
-Dsonar.scm.disabled=true

# 如果不行
-Dsonar.scm.provider=git
```

### ✅ 完整命令

```bash
# 支持生成单元测试的覆盖率和接口测试的覆盖率
mvn clean org.jacoco:jacoco-maven-plugin:prepare-agent install \
sonar:sonar \
  -Dsonar.projectKey=elkdemo \
  -Dsonar.host.url=http://localhost:9001 \
  -Dsonar.login=827179f3f1547e2f34ac5282198fea99a9e5ab74 \
  # 如果单元测试失败，可以继续执行
  -Dmaven.test.failure.ignore=true \
  # 也可以 web ui 中设置 scm 关闭，这样就会少一个警告
  -Dsonar.scm.disabled=true
```

### 9.3 pom.xml 中配置

```xml
<!-- 添加插件 -->
<plugin>
  <groupId>org.sonarsource.scanner.maven</groupId>
  <artifactId>sonar-maven-plugin</artifactId>
  <version>3.6.0.1398</version>
</plugin>
```

---

> 💡 **提示**：SonarQube 是一款强大的代码质量管理工具，支持代码异味、Bug、漏洞等多维度检测！
