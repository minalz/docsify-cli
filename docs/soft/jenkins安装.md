# jenkins安装

非docker安装的方式,因为我有下载好的包,直接这么操作,真正操作肯定还是docker比较方便的,但是需要做好持久化

## 1.下载jenkins.war

```shell
wget http://mirrors.jenkins.io/war-stable/latest/jenkins.war
```

下载特别慢,最好自己找其他资源下载,版本低了可以安装好了后再选择`在线升级`

## 2.启动

```java
nohup java -Dhudson.util.ProcessTree.disable=true -jar jenkins.war --httpPort=9090 >/dev/null 2>&1 &
  
查看日志:
tail -f nohup.out
```

execute shell中启动的进程在Job退出时会被杀死，所以需要加参数

```
-Dhudson.util.ProcessTree.disable=true
```

## 3.访问jenkins

### 3.1 访问的时候需要输入密码

```shell
cat /root/.jenkins/secrets/initialAdminPassword
```

### 3.2 安装推荐的插件

![image-20210108230432312](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20210108230432312.png)

### 3.3 如果插件下载不成功,修改插件的更新地址试试

```shell
https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json
```

### 3.4 创建一个用户

```shell
username: admin01
password: admin01
```

## 4.jenkins安装链接参考

```http
https://www.cnblogs.com/cjsblog/p/10740840.html
```

## 5.jenkins和SonarQube集成

```http
https://www.cnblogs.com/cjsblog/p/10740840.html
```

## 6.注意事项

6.1 生成git 凭证的时候,可以先生成公钥,然后再去置换私钥

6.2 或者直接用户名密码进行登录

6.3 看日志,github网络很慢,经常拉取代码的时候会超时

```http
https://blog.csdn.net/weixin_39172380/article/details/109580285
```

## 7.maven安装

因为只是演示,所以可装可不装

```http
https://blog.csdn.net/qq_38270106/article/details/97764483
```



