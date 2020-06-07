# Idea使用过程中出现的问题
## Tomcat的console乱码问题
1. 找到tomcat 安装目录下的 conf /logging.properties 文件打开

2. 将 java.util.logging.ConsoleHandler.encoding = UTF-8

  修改为

        java.util.logging.ConsoleHandler.encoding = GBK

3. 保存后 重启idea
