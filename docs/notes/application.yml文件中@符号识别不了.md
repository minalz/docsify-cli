# ⚙️ Application.yml 文件中 @ 符号识别不了

> 💡 Spring Boot 配置文件中 @ 符号解析问题 | Maven 资源过滤 | 解决方案

---

## ❌ 一、报错信息

```
org.yaml.snakeyaml.scanner.ScannerException: while scanning for the next token
found character '@' that cannot start any token. (Do not use @ for indentation)
 in 'reader', line 9, column 12:
      version: @project.version@
               ^
```

---

## ✅ 二、解决方案

在 `pom.xml` 中添加 plugin 和 resource 的配置：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
        <!-- 添加 plugin -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-resources-plugin</artifactId>
            <configuration>
                <delimiters>@</delimiters>
                <useDefaultDelimiters>false</useDefaultDelimiters>
            </configuration>
        </plugin>
    </plugins>
    <resources>
        <!-- 用 Maven 来过滤文件 -->
        <resource>
            <directory>src/main/resources</directory>
            <!-- 开启过滤，只过滤 yml 文件 -->
            <filtering>true</filtering>
            <includes>
                <include>**/*.yml</include>
            </includes>
        </resource>
        <resource>
            <directory>src/main/resources</directory>
            <!-- 关闭过滤，除了 yml 文件外，都不过滤 -->
            <filtering>false</filtering>
            <excludes>
                <exclude>**/*.yml</exclude>
            </excludes>
        </resource>
    </resources>
</build>
```

> 💡 **说明**：通过配置 Maven 资源过滤，可以让 `@project.version@` 这样的占位符在 application.yml 文件中正常解析。



