# application.yml文件中@符号识别不了

## 1.报错信息

```
org.yaml.snakeyaml.scanner.ScannerException: while scanning for the next token
found character '@' that cannot start any token. (Do not use @ for indentation)
 in 'reader', line 9, column 12:
      version: @project.version@
               ^
```

## 2.解决方案

在pom.xml中进行添加plugin和resource的配置

```xml
<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
            <!-- 添加plugin -->
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
            <!-- 用maven来过滤文件 -->
			<resource>
				<directory>src/main/resources</directory>
				<!--开启过滤，只过滤yml文件-->
				<filtering>true</filtering>
				<includes>
					<include>**/*.yml</include>
				</includes>
			</resource>
			<resource>
				<directory>src/main/resources</directory>
				<!--关闭过滤，除了yml文件外，都不过滤-->
				<filtering>false</filtering>
				<excludes>
					<exclude>**/*.yml</exclude>
				</excludes>
			</resource>
		</resources>
	</build>
```



