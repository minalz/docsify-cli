# SpringBoot 5种热部署方式

## 1.模板热部署

```properties
# Thymeleaf的配置
spring.thymeleaf.cache=false
# FreeMarker的配置
spring.freemarker.cache=false
# Groovy的配置
spring.groovy.template.cache=false
# Velocity的配置
spring.velocity.cache=false
```



## 2.使用调试模式Debug实现热部署

运行系统时使用Debug模式，无需装任何插件即可



## 3.spring-boot-devtools

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-devtools</artifactId>
</dependency>
```



## 4.Spring Loaded

与Debug模式类似，适用范围有限，但是不依赖于Debug模式启动，通过Spring Loaded库文件启动，即可在正常模式下进行实时热部署。此种需要在 run confrgration 中进行配置。



## 5.JRebel

Jrebel是Java开发最好的热部署工具，对 Spring Boot 提供了极佳的支持，JRebel为收费软件，试用期14天。，可直接通过插件安装。



## 6.参考链接

[my.oschina.net/
ruoli/blog/1590148](https://mp.weixin.qq.com/s?__biz=MzUzMTA2NTU2Ng==&mid=2247487551&idx=1&sn=18f64ba49f3f0f9d8be9d1fdef8857d9&scene=21#wechat_redirect)