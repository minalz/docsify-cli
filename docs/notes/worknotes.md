# WorkNotes
## 1.java.lang.NoSuchMethodError: org.springframework.boot.builder.SpringApplicationBuilder.<init>([Ljava/lang/Object;)V

springboot版本不兼容导致的

## 2.navicate导出表结构为Excel格式

参考链接：https://www.cnblogs.com/xianxiaobo/p/10254737.html

## 3.删除consul的无效/失效服务

https://www.jianshu.com/p/bd2bfb553915

## 4.DML、DDL、DCL区别

- DML（data manipulation language）数据库操纵语言：

  就是我们最经常用到的 SELECT、UPDATE、INSERT、DELETE。 主要用来对数据库的数据进行一些操作。

  ```mysql
  SELECT 列名称 FROM 表名称
  UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值
  INSERT INTO table_name (列1, 列2,...) VALUES (值1, 值2,....)
  DELETE FROM 表名称 WHERE 列名称 = 值
  ```

  

- DDL（data definition language）数据库定义语言：

  其实就是我们在创建表的时候用到的一些sql，比如说：CREATE、ALTER、DROP等。DDL主要是用在定义或改变表的结构，数据类型，表之间的链接和约束等初始化工作上

  ```mysql
  CREATE TABLE 表名称
  (
  列名称1 数据类型,
  列名称2 数据类型,
  列名称3 数据类型,
  ....
  )
  
  ALTER TABLE table_name
  ALTER COLUMN column_name datatype
  
  DROP TABLE 表名称
  DROP DATABASE 数据库名称
  ```

  

- DCL（Data Control Language）数据库控制语言：

  是用来设置或更改数据库用户或角色权限的语句，包括（grant,deny,revoke等）语句。这个比较少用到。
