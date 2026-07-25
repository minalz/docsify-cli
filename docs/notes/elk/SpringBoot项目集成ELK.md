# ☕ SpringBoot 项目集成 ELK

> 📈 将 SpringBoot 应用日志接入 ELK 技术栈的完整教程

---

## 📦 1. 新建 SpringBoot 项目

创建一个名为 `elkdemo` 的 SpringBoot 项目

---

## 📚 2. 添加依赖

在 `pom.xml` 中添加 Logstash 日志编码器依赖：

```xml
<!-- ELK Logstash -->
<dependency>
    <groupId>net.logstash.logback</groupId>
    <artifactId>logstash-logback-encoder</artifactId>
    <version>5.2</version>
</dependency>
```

---

## 📝 3. 配置 logback.xml

在 `src/main/resources` 下创建 `logback.xml` 文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <contextName>logback</contextName>
    <property name="log.path" value="log" />

    <!-- 彩色日志 -->
    <conversionRule conversionWord="clr" converterClass="org.springframework.boot.logging.logback.ColorConverter" />
    <conversionRule conversionWord="wex" converterClass="org.springframework.boot.logging.logback.WhitespaceThrowableProxyConverter" />
    <conversionRule conversionWord="wEx" converterClass="org.springframework.boot.logging.logback.ExtendedWhitespaceThrowableProxyConverter" />
    
    <!-- 彩色日志格式 -->
    <property name="CONSOLE_LOG_PATTERN" value="${CONSOLE_LOG_PATTERN:-%clr(%d{yyyy-MM-dd HH:mm:ss.SSS}){faint} %clr(${LOG_LEVEL_PATTERN:-%5p}) %clr([%method,%line])  %clr(${PID:- }){magenta} %clr(---){faint} %clr([%thread]){faint} %clr(%-40.40logger{39}){cyan} %clr(:){faint} %msg%n${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}}"/>

    <!-- 输出到控制台 -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>info</level>
        </filter>
        <encoder>
            <Pattern>${CONSOLE_LOG_PATTERN}</Pattern>
            <charset>UTF-8</charset>
        </encoder>
    </appender>

    <!-- 日志导出到 Logstash -->
    <appender name="stash" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
        <destination>yourserverIP:9250</destination>
        <encoder charset="UTF-8" class="net.logstash.logback.encoder.LogstashEncoder">
            <!-- appname 用于指定索引名称 -->
            <customFields>{"appname":"ye_test"}</customFields>
        </encoder>
    </appender>

    <root level="INFO">
        <appender-ref ref="stash"/>
        <appender-ref ref="CONSOLE" />
    </root>
</configuration>
```

> 💡 **关键配置**：将 `destination` 中的 `yourserverIP` 替换为实际的 Logstash 服务器 IP 地址

---

## 💻 4. 添加测试接口

```java
@Slf4j
@RestController
public class IndexController {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @GetMapping("/index")
    public Object index(String marking) {
        logger.debug("===elkdemo测试: 此时marking=" + marking);
        logger.info("===elkdemo: 此时marking" + marking);
        logger.warn("===elkdemo: 此时marking" + marking);
        logger.error("===elkdemo: 此时marking" + marking);
        
        return "success";
    }
}
```

---

## 🚀 5. 启动项目

运行 SpringBoot 应用

---

## 🔍 6. 查看 Kibana 看板

### 6.1 访问 Kibana

浏览器访问：`http://yourserverIP:5601/`

### 6.2 检查索引

点击 **Management → Elasticsearch → Index Management**，会发现有一个 `elkdemo` 索引

![索引管理](http://img.minalz.cn/typora/image-20210524102112967.png)

### 6.3 创建索引模式

点击 **Kibana → Index Patterns → Create index pattern → 创建 elkdemo → Next step**

![创建索引模式](http://img.minalz.cn/typora/image-20210524102309039.png)

---

## 📡 7. 发送测试请求

```
http://localhost:8088/index?marking=testelk
```

点击 **Discover** 查看日志数据

![查看日志](http://img.minalz.cn/typora/image-20210524102744544.png)

---

## 📊 集成步骤总结

| 步骤 | 说明 |
|:---|:---|
| 1️⃣ | 创建 SpringBoot 项目 |
| 2️⃣ | 添加 logstash-logback-encoder 依赖 |
| 3️⃣ | 配置 logback.xml，设置 Logstash 地址 |
| 4️⃣ | 创建测试接口，输出不同级别日志 |
| 5️⃣ | 启动项目 |
| 6️⃣ | 在 Kibana 中创建索引模式 |
| 7️⃣ | 发送请求，查看日志数据 |

---

> 💡 **提示**：通过 ELK 集成，可以实现集中式日志管理、实时日志搜索与可视化分析！
