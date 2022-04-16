# Idea使用过程中出现的问题

## Tomcat的console乱码问题

1. 找到tomcat 安装目录下的 conf /logging.properties 文件打开

2. 将java.util.logging.ConsoleHandler.encoding = UTF-8修改为java.util.logging.ConsoleHandler.encoding = GBK

3. 保存后 重启idea

## IDEA2020.1启动SpringBoot项目出现java程序包:xxx不存在


例如：Error:(3, 46) java: 程序包org.springframework.context.annotation不存在
参考链接：https://blog.csdn.net/lzzdhhhh/article/details/105907772
