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

## 3.Mysql安装

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