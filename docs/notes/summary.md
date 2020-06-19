# summary

## 1.页面设置body滚动条出不来

因为是iframe框架，`scrolling="yes"`,需要在layout.js中进行设置才能成功

## 2.MySQL->Oracle分页有问题

分析：

+ MySQL分页正常，Oracle命令未正确结束，只要设置query.setFirstResult和MaxResult就报错

+ proxxy.xml 数据库连接正常
+ config.properties 修改Jpa的对应的数据库类型

解决方案：

SQL查询后的字段类型是Number类型，需要进行转换，SQL查询后的count也是如此，需要进行转换数据类型

去掉SQL语句中的单引号('')，因为Oracle中单引号会对后面的字符进行转义

3.传输文件

+ scp [参数] [原路径] [目标路径]

  `scp -P(端口号) 文件名 username@IP:文件路径`

+ 从本地服务器复制到远程服务器

  + 复制文件

  ```shell
  scp local_file remote_username@remote_ip:remote_folder
  ```
  
  
  
    + 复制目录
  
  ```shell
  scp -r local_folder remote_ip:remote_folder
  ```
  
  
  
+ 从远程服务器复制到本地服务器

  ```shell
  scp remote_username@remote_ip: remote_file local_folder
  ```

  

+ 上传本地文件到远程机器指定目录

  ```
  scp local_file remote_username@remote_ip: remote_folder
  ```

  

+ 上传本地目录到远程机器指定目录

  ```
  scp -r local_folder remote_username@remote_ip: remote_folder
  ```

  

4.常用vim命令

+ `:$`

  调到文件最后一行

+ `:0`或`:1`调到文件第一行或另一组命令

  `gg`跳到文件第一行

  `shift+g`跳到文件最后一行

+ `pwd`

  查看当前目录

+ `passwd`

  修改密码

+ `telnet 服务器IP`

  远程访问

+ `csh .bash`

  更换模式

5.端口被占用

```
netstat -anlp/anpt | grep port

查看端口->找到pid

ps -ef |grep pid -> 找到是哪个服务

netstat -ntpl | grep :端口号 可以直接查看pid
```

