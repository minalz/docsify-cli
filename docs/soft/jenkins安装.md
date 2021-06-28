# jenkins安装

## 1 下载jenkins.war

```shell
wget http://mirrors.jenkins.io/war-stable/latest/jenkins.warCopy to clipboardErrorCopied
```

下载特别慢,最好自己找其他资源下载,版本低了可以安装好了后再选择`在线升级`

## 2 启动

```java
nohup java -Dhudson.util.ProcessTree.disable=true -jar jenkins.war --httpPort=9090 >/dev/null 2>&1 &
  
查看日志:
tail -f nohup.outCopy to clipboardErrorCopied
```

execute shell中启动的进程在Job退出时会被杀死，所以需要加参数

```
-Dhudson.util.ProcessTree.disable=true
```

## 3 访问jenkins

### 3.1 访问的时候需要输入密码

```shell
cat /root/.jenkins/secrets/initialAdminPasswordCopy to clipboardErrorCopied
```

### 3.2 安装推荐的插件

![image-20210108230432312](https://minalz.cn/images/image-20210108230432312.png)

### 3.3 如果插件下载不成功,修改插件的更新地址试试

```shell
https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.jsonCopy to clipboardErrorCopied
```

### 3.4 创建一个用户

```shell
username: admin01
password: admin01
```

