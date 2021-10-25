# MySQL之mysqldump的使用

[本文转载自博客园](https://www.cnblogs.com/markLogZhu/p/11398028.html)

https://www.cnblogs.com/markLogZhu/p/11398028.html

## 一、mysqldump 简介

`mysqldump` 是 `MySQL` 自带的逻辑备份工具。

它的备份原理是通过协议连接到 `MySQL` 数据库，将需要备份的数据查询出来，将查询出的数据转换成对应的`insert` 语句，当我们需要还原这些数据时，只要执行这些 `insert` 语句，即可将对应的数据还原。

## 二、备份命令

### 2.1 命令格式

```mysql
mysqldump [选项] 数据库名 [表名] > 脚本名
```

或

```mysql
mysqldump [选项] --数据库名 [选项 表名] > 脚本名
```

或

```mysql
mysqldump [选项] --all-databases [选项]  > 脚本名
```

### 2.2 选项说明

| 参数名                          | 缩写 | 含义                          |
| ------------------------------- | ---- | ----------------------------- |
| --host                          | -h   | 服务器IP地址                  |
| --port                          | -P   | 服务器端口号                  |
| --user                          | -u   | MySQL 用户名                  |
| --pasword                       | -p   | MySQL 密码                    |
| --databases                     |      | 指定要备份的数据库            |
| --all-databases                 |      | 备份mysql服务器上的所有数据库 |
| --compact                       |      | 压缩模式，产生更少的输出      |
| --comments                      |      | 添加注释信息                  |
| --complete-insert               |      | 输出完成的插入语句            |
| --lock-tables                   |      | 备份前，锁定所有数据库表      |
| --no-create-db/--no-create-info |      | 禁止生成创建数据库语句        |
| --force                         |      | 当出现错误时仍然继续备份操作  |
| --default-character-set         |      | 指定默认字符集                |
| --add-locks                     |      | 备份数据库表时锁定数据库表    |

### 2.3 实例

备份所有数据库：

```mysql
mysqldump -uroot -p --all-databases > /backup/mysqldump/all.db
```

备份指定数据库：

```mysql
mysqldump -uroot -p test > /backup/mysqldump/test.db
```

备份指定数据库指定表(多个表以空格间隔)

```mysql
mysqldump -uroot -p  mysql db event > /backup/mysqldump/2table.db
```

备份指定数据库排除某些表

```mysql
mysqldump -uroot -p test --ignore-table=test.t1 --ignore-table=test.t2 > /backup/mysqldump/test2.db
```

## 三、还原命令

### 3.1 系统行命令

```mysql
# -f 是忽略错误继续执行
mysqladmin -uroot -p -f create db_name 
mysql -uroot -p  db_name < /backup/mysqldump/db_name.db

注：在导入备份数据库前，db_name如果没有，是需要创建的； 而且与db_name.db中数据库名是一样的才可以导入。
```

```tex
有一个新的问题就是，如果有视图和函数的话，视图中又涉及到了函数，那么备份的时候忽略错误也是不行的，可以通过navicate先将函数或者视图给备份一下

操作：DB(主) -> 选择一个函数进行复制 -> DB(从) -> 粘贴到函数下，会跳出来一个弹框，你可以勾选你想要复制过来的所有表、视图或函数

我只是复制了所有的视图和函数，表还是通过命令来执行的，因为我不清楚把表全部拷贝过去，GTID是否也会更新成功
```

### 3.2 soure 方法

```mysql
mysql > use db_name
mysql > source /backup/mysqldump/db_name.db
```