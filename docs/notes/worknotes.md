# 💼 Work Notes

> 💡 工作过程中的问题记录与解决方案 | 开发实战 | 经验总结

---

## 🔧 一、Spring Boot 版本兼容问题

### ❌ 错误信息

```
java.lang.NoSuchMethodError: org.springframework.boot.builder.SpringApplicationBuilder.<init>([Ljava/lang/Object;)V
```

### ✅ 解决方案

Spring Boot 版本不兼容导致的，需要调整依赖版本。

---

## 📊 二、Navicat 导出表结构为 Excel 格式

参考链接：https://www.cnblogs.com/xianxiaobo/p/10254737.html

---

## 🗑️ 三、删除 Consul 的无效/失效服务

参考链接：https://www.jianshu.com/p/bd2bfb553915

---

## 📚 四、DML、DDL、DCL 区别

### 1️⃣ DML（Data Manipulation Language）- 数据库操纵语言

就是我们最经常用到的 `SELECT`、`UPDATE`、`INSERT`、`DELETE`。主要用来对数据库的数据进行一些操作。

```mysql
SELECT 列名称 FROM 表名称
UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值
INSERT INTO table_name (列1, 列2,...) VALUES (值1, 值2,....)
DELETE FROM 表名称 WHERE 列名称 = 值
```

### 2️⃣ DDL（Data Definition Language）- 数据库定义语言

其实就是我们在创建表的时候用到的一些 SQL，比如说：`CREATE`、`ALTER`、`DROP` 等。DDL 主要是用在定义或改变表的结构，数据类型，表之间的链接和约束等初始化工作上。

```mysql
CREATE TABLE 表名称
(
  列名称1 数据类型,
  列名称2 数据类型,
  列名称3 数据类型,
  ...
)

ALTER TABLE table_name
ALTER COLUMN column_name datatype

DROP TABLE 表名称
DROP DATABASE 数据库名称
```

### 3️⃣ DCL（Data Control Language）- 数据库控制语言

是用来设置或更改数据库用户或角色权限的语句，包括（grant, deny, revoke 等）语句。这个比较少用到。

---

## 🌐 五、页面设置 body 滚动条出不来

### 问题原因

因为是 iframe 框架，需要设置 `scrolling="yes"`，需要在 layout.js 中进行设置才能成功。

---

## 🔄 六、MySQL → Oracle 分页有问题

### 🔍 问题分析

- MySQL 分页正常，Oracle 命令未正确结束
- 只要设置 `query.setFirstResult` 和 `MaxResult` 就报错
- proxxy.xml 数据库连接正常
- config.properties 修改 Jpa 的对应的数据库类型

### ✅ 解决方案

1. SQL 查询后的字段类型是 Number 类型，需要进行转换
2. SQL 查询后的 count 也是如此，需要进行转换数据类型
3. 去掉 SQL 语句中的单引号 (`''`)，因为 Oracle 中单引号会对后面的字符进行转义