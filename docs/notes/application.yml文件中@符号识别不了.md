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
            <!-- 添加resource -->
			<resource>
				<directory>src/main/resources</directory>
				<!--开启过滤，用指定的参数替换directory下的文件中的参数-->
				<filtering>true</filtering>
			</resource>
		</resources>
	</build>
```



