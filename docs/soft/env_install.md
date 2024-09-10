# 软件

## 1. Navicate破解

参考链接：http://www.downcc.com/soft/322714.html

## 2. Idea破解

参考链接：https://shimo.im/docs/52dekJN4tiUAaBgv/read?from=groupmessage&isappinstalled=0

+ idea历史记录下载

  https://www.jetbrains.com/idea/download/other.html

+ idea原始破解链接

  https://zhile.io/2018/08/17/jetbrains-license-server-crack.html

  现在破解jar的下载链接已经没了
  
+ 激活方式

​		code 或者 license server ： [http://fls.jetbrains-agent.com](

## 3.Mysql安装

### 3.1 MacOS

参考链接:

https://www.cnblogs.com/nickchen121/p/11145123.html

👆上了一步关键步骤,就是第一次的密码验证问题

具体步骤：

1. 苹果->系统偏好设置->最下边点mysql 在弹出页面中 关闭mysql服务（点击stop mysql server）

2. 进入终端输入：cd /usr/local/mysql/bin/

   回车后 登录管理员权限 sudo su

   回车后输入以下命令来禁止mysql验证功能 ./mysqld_safe --skip-grant-tables &

   回车后mysql会自动重启（偏好设置中mysql的状态会变成running）

3. 输入命令 ./mysql

   回车后，输入命令 FLUSH PRIVILEGES;

   回车后，输入命令 SET PASSWORD FOR 'root'@'localhost' = PASSWORD('你的新密码');

   至此，密码修改完成，可以成功登陆。

### 3.2 Linux
https://blog.csdn.net/weixin_52799373/article/details/125385105/ (低版本跟着链接即可)

如果是高版本mysql8.0的话：
> msyql8 SET PASSWORD = PASSWORD('ok'); PASSWORD已经过期了 要用新的方法ALTER USER 'username'@'hostname' IDENTIFIED WITH mysql_native_password BY 'ok';
> MySQL 8 中设置密码时遇到错误可能是因为 PASSWORD() 函数在 MySQL 8 中已经弃用。MySQL 8 推荐使用 CREATE USER 或 ALTER USER 语句结合 AUTHENTICATION 选项来设置或更改用户密码。

解决方法：

如果你是要创建一个新用户并设置密码，可以使用如下命令：
sql
CREATE USER 'username'@'hostname' IDENTIFIED WITH mysql_native_password BY 'ok';
如果你是要更改现有用户的密码，可以使用如下命令：
sql
ALTER USER 'username'@'hostname' IDENTIFIED WITH mysql_native_password BY 'ok';
如果你想使用更安全的密码验证插件，可以使用 mysql_native_password 或其他插件，如 caching_sha2_password：
sql
ALTER USER 'username'@'hostname' IDENTIFIED WITH caching_sha2_password BY 'ok';

确保替换 'username' 和 'hostname' 为实际的用户名和主机名。

```shell
# 执行命令格式
ALTER USER 'username'@'hostname' IDENTIFIED WITH caching_sha2_password BY 'ok';
# 执行命令真实用户
ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'ok';
```

注意：从 MySQL 5.7 开始，默认的认证插件从 mysql_native_password 变为了 caching_sha2_password，这可能是为了更安全的密码验证。如果客户端或应用程序不支持新的认证插件，可能需要将认证插件改回到 mysql_native_password。

## 4.Mac上zookeeper的安装与启动

https://www.jianshu.com/p/5491d16e6abd

## 5.Mac上安装Consul

http://www.yulu618.com/article/detail/post-2080.html

## 6.Sublime安装教程:

https://www.jianshu.com/p/9c8db3620be9

## 7.Docsify安装教程

https://www.cnblogs.com/jackson0714/p/docsify01.html

## 8.Mac Nacos启动和windows有点区别

`sh startup.sh -m standalone`

sudo nginx

sudo nginx -s reload

sudo ningx -s stop

/usr/local/etc/nginx/nginx.conf

https://blog.csdn.net/weixin_44722978/article/details/104690535

## 9.Mac 安装Nginx

这是个大坑,配置nacos集群,花了将近四五个小时,一开始是自己的阿里云服务器配置不够高,一直启动不了三个nacos,后来就在mac上直接配置,nginx一直端口改变不成功,最后才发现,对端口号的大小有限制,坑死了

https://www.cnblogs.com/tandaxia/p/8810648.html

配置的6666端口,一直无法生效,原来在mac上配置nginx端口 ,必须是`8000以上`,不需要配置什么权限什么的,只要把端口号改成8000以上就可以了,很多帖子都不正确,在这个帖子的最后一点提到了,改了一下,确实如此

https://blog.csdn.net/yh1061632045/article/details/81518195?utm_source=blogxgwz7



java.lang.IllegalStateException: failed to req API:/nacos/v1/ns/instance after all servers([192.168.1.41:9999]) tried: failed to req API:192.168.1.41:9999/nacos/v1/ns/instance. code:500 msg: java.net.SocketTimeoutException: Read timed out



一直报错,开始以为是jdk的问题,将jdk13改为了jdk8 还是不行



http://zhouweidemacbook-pro.local:9999/nacos/v1/ns/instance

```
Param 'serviceName' is required.
```



JAVA_OPT=”${JAVA_OPT} -Dnacos.server.ip=150.109.127.59”



```bash
# 新增以下参数设置本机ip地址
    JAVA_OPT="${JAVA_OPT} -Dnacos.server.ip= 服务器的ip"
```

https://www.jianshu.com/p/3014b9a4eef2 



最后发现 完全就是自己的配置问题 必须设置成IP才可以 

之前使用的hostname 得到zhouweideMacBook-Pro.local 所以配置的时候 都用了这个 没用IP 谁知道最后是IP配置的问题 最后改成了IP 服务成功注册上去了 至此 已经花费了7小时 我的天

192.168.1.41

/Users/zhouwei/development/nacos

## 10.navicate导出表结构为Excel格式

参考链接：https://www.cnblogs.com/xianxiaobo/p/10254737.html

## 11.删除consul的无效/失效服务

https://www.jianshu.com/p/bd2bfb553915

## 12.DML、DDL、DCL区别

- DML（Data Manipulation Language）数据库操纵语言：

  就是我们最经常用到的 SELECT、UPDATE、INSERT、DELETE。 主要用来对数据库的数据进行一些操作。

  ```mysql
  SELECT 列名称 FROM 表名称
  UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值
  INSERT INTO table_name (列1, 列2,...) VALUES (值1, 值2,....)
  DELETE FROM 表名称 WHERE 列名称 = 值
  ```

  

- DDL（Data Definition Language）数据库定义语言：

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

## 13.查看端口占用情况

https://www.cnblogs.com/keystone/p/12516552.html

## 14.Redis安装
> Mac

https://www.jianshu.com/p/bb7c19c5fc47

> windows  redis 设置开机自启动

+ 参考链接：https://www.cnblogs.com/feigao/p/11157607.html

+ 还需要设置一下环境变量

+ 需要配置一下密码

  如果不配置密码，服务设置了密码，还是会连接出错

  参考链接：https://www.cnblogs.com/GuoJunwen/p/9238624.html

+ 常用的redis服务命令。

  卸载服务：

  ```c
  redis-server --service-uninstall
  ```

  开启服务

  ```c
  redis-server --service-start
  ```

  停止服务：

  ```c
  redis-server --service-stop
  ```

+ 操作步骤

  ```c
  127.0.0.1:6379> config get requirepass
  (error) NOAUTH Authentication required.
  127.0.0.1:6379> auth 123456
  OK
  127.0.0.1:6379> config get requirepass
  1) "requirepass"
  2) "123456"
  ```
https://www.jianshu.com/p/bb7c19c5fc47 

> Linux

+ 获取redis资源

  ```shell
  wget http://download.redis.io/releases/redis-4.0.8.tar.gz
  ```

  

+ 解压

  ```shell
  tar xzvf redis-4.0.8.tar.gz
  ```

  

+ 安装

  ```shell
  cd redis-4.0.8
  make
  cd src
  make install PREFIX=/usr/local/redis
  ```

  

+ 移动配置文件到安装目录下

  ```shell
  cd ../
  mkdir /usr/local/redis/etc
  mv redis.conf /usr/local/redis/etc
  ```

  

+ 配置redis为后台启动

  ```shell
  vi /usr/local/redis/etc/redis.conf //将**daemonize no** 改成daemonize yes 并且 bind 0.0.0.0 需要注释#
  ```

  

+ 将redis加入到开机启动

  ```shell
  vi /etc/rc.local //在里面添加内容：/usr/local/redis/bin/redis-server /usr/local/redis/etc/redis.conf (意思就是开机调用这段开启redis的命令)
  ```

  

+ 开启redis

  ```shell
  /usr/local/redis/bin/redis-server /usr/local/redis/etc/redis.conf
  ```

 

+ 常用命令

  ```shell
  redis-server /usr/local/redis/etc/redis.conf //启动redis
  pkill redis //停止redis
  ```

  + 卸载redis：

    ```shell
    rm -rf /usr/local/redis //删除安装目录
    rm -rf /usr/bin/redis-* //删除所有redis相关命令脚本
    rm -rf /root/download/redis-4.0.4 //删除redis解压文件夹
    ```

  + 使用指定密码连接指定 ip 和指定端口

    ```shell
    ./src/redis-cli -h 指定ip -p 指定端口 -a 指定密码
    ```

> Linux 第二种安装方式（更简单点，下载链接都一样）
https://blog.csdn.net/jiedong_xu/article/details/131626318

后续步骤差不多，cp /redis.conf /etc/redis.conf
并且需要修改里面的配置项

![3fbd97f28341907f3edef4d2f15cb80](http://sjluyi7xe.hd-bkt.clouddn.com/typora/3fbd97f28341907f3edef4d2f15cb80.png)

启动命令：

redis-server /etc/redis.conf

客户端：

redis-cli

## 15.Mac安装Iterm2

参考链接:https://zhuanlan.zhihu.com/p/37195261

```shell
# 安装后的插件要放在 ～/.zshrc/customer/plugin下
```
安装iterm2后，本身的terminal(Mac自带的终端配置)会出现终端文字被覆盖的问题：  
![image-01](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-01.png)

idea中有这样的问题也可以按照这样的方式来解决

解决方式：
![image-02](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-02.png)

参考链接:https://www.liuchuo.net/archives/4678

## 16.Mac千万不要随便修改用户,会导致管理员账号和密码丢失

参考链接:https://discussionschinese.apple.com/thread/140108050

## 17.Mac ZSH隐藏命令行前面的用户名和主机名

修改`vim ~/.zshrc`文件,在文件底部增加

+ 隐藏用户名和主机名

  ```bash
  Copyprompt_context() {}
  ```

+ 只保留用户名，隐藏主机名

  ```bash
  Copyprompt_context() {
    if [[ "$USER" != "$DEFAULT_USER" || -n "$SSH_CLIENT" ]]; then
      prompt_segment black default "%(!.%{%F{yellow}%}.)$USER"
    fi
  }
  ```

+ 只保留主机名，隐藏用户名

  ```bash
  Copyprompt_context() {
    if [[ "$USER" != "$DEFAULT_USER" || -n "$SSH_CLIENT" ]]; then
      prompt_segment black default "%(!.%{%F{yellow}%}.)$HOST"
    fi
  }
  ```

修改后记得执行 `source ~/.zshrc`

## 18.homebrew安装

https://www.cnblogs.com/haojile/p/13193805.html

## 19.Mac连接Linux服务器

```shell
ssh -p 28726 root@107.182.23.xxx
```

## 20.vue环境安装

https://jingyan.baidu.com/article/5225f26bbb430fe6fa0908ce.html

## 21解放双手，markdown文章神器,Typora+PicGo+七牛云图床实现自动上传图片

https://blog.51cto.com/guosisoft/6471645
  
## 22.Linux Nacos安装
https://blog.csdn.net/henrin/article/details/130898186