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

+ `pwd`

  查看当前目录

+ `passwd`

  修改密码

+ `telnet 服务器IP`

  远程访问

+ `csh .bash`

  更换模式
  
+ `history -a`

  强制把当前运行的命令写入到history中

+ !数字

  唤回history中该数字位置的命令

+ alias -P

  查询当前可用的假名

+ env / printenv

  查看当前环境变量

+ printenv HOME / echo $HOME

  显示个别环境变量的值

## 3.端口被占用

```
netstat -anlp/anpt | grep port

查看端口->找到pid

ps -ef |grep pid -> 找到是哪个服务

netstat -ntpl | grep :端口号 可以直接查看pid
```

## 4.文件操作

+ `:$`

  调到文件最后一行

+ `:0`或`:1`

  调到文件第一行或另一组命令

+ `x`

  删除当前光标所在位置的字符

+ `dd`

  删除当前光标所在位置的所在行

+ `dw`

  删除当前光标所在位置的单词

+ `d$`

  删除所在位置至行尾的内容

+ `J`

  删除当前光标所在位置至所在行行尾的换行符(拼接行)

+ `u(或Ctrl+r)`

  撤销前一编辑命令

+ `i`

  光标前

+ `a`

  在当前光标后追加数据

+ `A`

  在当前光标所在行行尾追加数据

+ `r char`

  用char替换行前光标所在位置的单个字符

+ `R text`

  用text覆盖当前光标所在位置的数据，直接按下ESC键

+ `q`

  如果未修改缓冲区数据，退出

+ `q!`

  取消所有对缓冲区数据的修改并退出(强制退出不修改)

+ `w filename`

  将文件保存到另一个文件中

+ `wq`

  将缓冲区数据保存到文件中并退出

+ `h`

  左移一个字符

+ `j(Crtl+n)`

  下移一个字符

+ `k(Ctrl+P)`

  上移一个字符

+ `l`

  右移一个字符

+ `n+/n-`

  光标上移/下移n行

+ `o/O`

  在当前行之下/上新开一行

+ `PageDown(或Ctrl+F)`

  下翻一屏

+ `PageUp(或Ctrl+B)`

  上翻一屏

+ `G`

  移到缓冲区的最后一行

+ `num G`

  移动到缓冲区中的第num行

+ `gg`

  移到缓冲区中的第一行

## 5.数据库中的函数

+ `MySQL时间格式化`

  `date_format %Y-%M-%d`

+ `Oracle时间格式化`

  1to_char YYYY-MM-DD`

+ `MySQL中value保留两位小数`

  `Round`(value,2)

+ `修复MySQL table`

  `repair/check` table 表名

## 6.yum命令

+ `yum install package_name`

  安装软件包

+ `yum remove package_name`

  只删除软件包而保留配置文件和数据文件

+ `yum erase package_name`

  要删除软件和它所有的文件