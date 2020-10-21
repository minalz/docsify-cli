# Linux 命令

## 1.传输文件

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

  

## 2.常用vim命令

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

## 3.端口被占用

```
netstat -anlp/anpt | grep port

查看端口->找到pid

ps -ef |grep pid -> 找到是哪个服务

netstat -ntpl | grep :端口号 可以直接查看pid
```

