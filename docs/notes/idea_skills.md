# 💡 IDEA 使用技巧

> 🔧 IntelliJ IDEA 使用技巧与问题解决 | 开发效率提升

---

## 📖 Tomcat 的 Console 乱码问题

**解决步骤：**

1. 找到 Tomcat 安装目录下的 `conf/logging.properties` 文件打开
2. 将 `java.util.logging.ConsoleHandler.encoding = UTF-8` 修改为 `java.util.logging.ConsoleHandler.encoding = GBK`
3. 保存后，重启 IDEA

---

## ⚠️ IDEA 2020.1 启动 SpringBoot 项目出现 java 程序包:xxx 不存在

**错误示例：**

```
Error:(3, 46) java: 程序包org.springframework.context.annotation不存在
```

**参考链接：**
- [解决方案](https://blog.csdn.net/lzzdhhhh/article/details/105907772)
