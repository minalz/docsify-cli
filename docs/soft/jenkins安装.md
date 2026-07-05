# Jenkins 安装

> 本文介绍非 Docker 安装方式（使用已下载的 jenkins.war 包）。推荐使用 Docker 方式安装，但需注意做好数据持久化。

## 1. 下载 Jenkins.war

```shell
wget http://mirrors.jenkins.io/war-stable/latest/jenkins.war
```

> 💡 下载速度较慢时，建议寻找其他镜像源。如果版本较低，安装完成后可选择**在线升级**。

## 2. 启动 Jenkins

```shell
nohup java -Dhudson.util.ProcessTree.disable=true -jar jenkins.war --httpPort=9090 >/dev/null 2>&1 &

# 查看日志
tail -f nohup.out
```

> **注意：** execute shell 中启动的进程在 Job 退出时会被杀死，因此需要添加参数：
> ```shell
> -Dhudson.util.ProcessTree.disable=true
> ```

## 3. 访问 Jenkins

### 3.1 首次访问需要输入密码

```shell
cat /root/.jenkins/secrets/initialAdminPassword
```

### 3.2 安装推荐的插件

![安装推荐插件](http://img.minalz.cn/typora/image-20210108230432312.png)

### 3.3 插件下载失败？修改更新源

如果插件下载不成功，可以尝试修改插件更新地址为清华镜像源：

```shell
https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json
```

### 3.4 创建用户

```
username: admin01
password: admin01
```

## 4. Jenkins 安装参考链接

```text
https://www.cnblogs.com/cjsblog/p/10740840.html
```

## 5. Jenkins 和 SonarQube 集成

```text
https://www.cnblogs.com/cjsblog/p/10740840.html
```

## 6. 注意事项

1. **生成 Git 凭证**：可以先生成公钥，然后再去置换私钥
2. **登录方式**：或直接用用户名密码进行登录
3. **查看日志**：GitHub 网络很慢，拉取代码时经常超时，注意查看日志排查问题

```text
https://blog.csdn.net/weixin_39172380/article/details/109580285
```

## 7. Maven 安装

> 本文仅为演示环境，Maven 可装可不装。

```text
https://blog.csdn.net/qq_38270106/article/details/97764483
```



