## 登录
```properties
account: admin
password: admin
```
创建项目名称，创建一个token，用来执行maven命令

## 添加语言
插件中添加java language

## 添加规范的插件
添加阿里的p3c插件

## 添加质量配置
创建->添加p3c->应用->激活

## 用的maven直接执行的
```sh
mvn clean org.jacoco:jacoco-maven-plugin:prepare-agent install \
sonar:sonar \
  -Dsonar.projectKey=elkdemo \
  -Dsonar.host.url=http://10.0.3.85:9001 \
  -Dsonar.login=827179f3f1547e2f5bac5282198fea99a9e5ab74 \
  -Dmaven.test.failure.ignore=true \
  -Dsonar.scm.disabled=true
```

## 可能会有如下的出错信息
```text
SCM provider autodetection failed. Please use "sonar.scm.provider" to define SCM of your project, or disable the SCM Sensor in the project settings
```
这是因为启动命令有错，需要单独加一个参数
```text
# 先试这个，一般可以的
-Dsonar.scm.disabled=true
# 如果不行
-Dsonar.scm.provider=git
```

## 第二种启动方式，直接配置pom.xml
```pom
<plugin>
    <groupId>org.sonarsource.scanner.maven</groupId>
    <artifactId>sonar-maven-plugin</artifactId>
    <version>3.6.0.1398</version>
</plugin>
<profiles>
    <profile>
        <id>sonar</id>
        <activation>
            <activeByDefault>true</activeByDefault>
        </activation>
        <properties>
            <sonar.jdbc.url>jdbc:postgresql://localhost:9002/sonar</sonar.jdbc.url>
            <sonar.jdbc.driver>org.postgresql.Driver</sonar.jdbc.driver>
            <sonar.jdbc.username>sonar</sonar.jdbc.username>
            <sonar.jdbc.password>sonar</sonar.jdbc.password>
            <sonar.host.url>http://localhost:9001</sonar.host.url>
            <sonar.inclusions>src/main/**</sonar.inclusions>
        </properties>
    </profile>
<profiles>
```
然后启动mvn sonar:sonar 或者 用可视化工具plugins下点击sonar:sonar

## 执行没有报错,回到sonar UI
查看对应的项目