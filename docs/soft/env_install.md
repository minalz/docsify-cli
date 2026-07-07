# 📦 软件安装指南

> 💡 开发环境及常用软件安装汇总，涵盖数据库、IDE、中间件等工具

---

## 🔓 1. Navicat 破解

参考链接：[Navicat 破解教程](http://www.downcc.com/soft/322714.html)

## 💡 2. IDEA 破解

参考链接：[idea 破解教程](https://shimo.im/docs/52dekJN4tiUAaBgv/read?from=groupmessage&isappinstalled=0)

### 2.1 IDEA 历史版本下载

[JetBrains 历史版本下载](https://www.jetbrains.com/idea/download/other.html)

### 2.2 IDEA 原始破解链接

[JetBrains License Server Crack](https://zhile.io/2018/08/17/jetbrains-license-server-crack.html)

> **注意**：现在破解 jar 的下载链接已经没了。

### 2.3 激活方式

- **Code 激活** 或 **License Server 激活**：[http://fls.jetbrains-agent.com](http://fls.jetbrains-agent.com)

## 🗄️ 3. MySQL 安装

### 3.1 MacOS

参考链接：[cnblogs MySQL 安装教程](https://www.cnblogs.com/nickchen121/p/11145123.html)

> 上面链接是关键步骤，特别是第一次的密码验证问题。

**具体步骤：**

1. 苹果 -> 系统偏好设置 -> 最下边点 MySQL，在弹出页面中关闭 MySQL 服务（点击 stop mysql server）

2. 进入终端输入：
   ```bash
   cd /usr/local/mysql/bin/
   ```
   
   回车后登录管理员权限：
   ```bash
   sudo su
   ```
   
   回车后输入以下命令来禁止 MySQL 验证功能：
   ```bash
   ./mysqld_safe --skip-grant-tables &
   ```
   
   回车后 MySQL 会自动重启（偏好设置中 MySQL 的状态会变成 running）

3. 输入命令：
   ```bash
   ./mysql
   ```
   
   回车后，输入命令：
   ```sql
   FLUSH PRIVILEGES;
   ```
   
   回车后，输入命令：
   ```sql
   SET PASSWORD FOR 'root'@'localhost' = PASSWORD('你的新密码');
   ```
   
   至此，密码修改完成，可以成功登陆。

### 3.2 Linux

参考链接：[CSDN MySQL 安装教程](https://blog.csdn.net/weixin_52799373/article/details/125385105/)（低版本跟着链接即可）

> **注意**：如果是高版本 MySQL 8.0 的话，`SET PASSWORD = PASSWORD('ok')` 中的 `PASSWORD()` 已经过期了，要用新的方法：
> ```sql
> ALTER USER 'username'@'hostname' IDENTIFIED WITH mysql_native_password BY 'ok';
> ```
> 
> MySQL 8 中设置密码时遇到错误可能是因为 `PASSWORD()` 函数在 MySQL 8 中已经弃用。MySQL 8 推荐使用 `CREATE USER` 或 `ALTER USER` 语句结合 `AUTHENTICATION` 选项来设置或更改用户密码。

**解决方法：**

如果你是要创建一个新用户并设置密码，可以使用如下命令：

```sql
CREATE USER 'username'@'hostname' IDENTIFIED WITH mysql_native_password BY 'ok';
```

如果你是要更改现有用户的密码，可以使用如下命令：

```sql
ALTER USER 'username'@'hostname' IDENTIFIED WITH mysql_native_password BY 'ok';
```

如果你想使用更安全的密码验证插件，可以使用 `mysql_native_password` 或其他插件，如 `caching_sha2_password`：

```sql
ALTER USER 'username'@'hostname' IDENTIFIED WITH caching_sha2_password BY 'ok';
```

> 确保替换 `'username'` 和 `'hostname'` 为实际的用户名和主机名。

```bash
# 执行命令格式
ALTER USER 'username'@'hostname' IDENTIFIED WITH caching_sha2_password BY 'ok';

# 执行命令真实用户
ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'ok';
```

> **注意**：从 MySQL 5.7 开始，默认的认证插件从 `mysql_native_password` 变为了 `caching_sha2_password`，这可能是为了更安全的密码验证。如果客户端或应用程序不支持新的认证插件，可能需要将认证插件改回到 `mysql_native_password`。

## 🦌 4. Mac 上 Zookeeper 的安装与启动

参考链接：[简书 Zookeeper 教程](https://www.jianshu.com/p/5491d16e6abd)

## 🏛️ 5. Mac 上安装 Consul

参考链接：[Consul 安装教程](http://www.yulu618.com/article/detail/post-2080.html)

## 📝 6. Sublime 安装教程

参考链接：[简书 Sublime 教程](https://www.jianshu.com/p/9c8db3620be9)

## 📚 7. Docsify 安装教程

参考链接：[cnblogs Docsify 教程](https://www.cnblogs.com/jackson0714/p/docsify01.html)

## ☁️ 8. Mac Nacos 启动（和 Windows 有点区别）

```bash
sh startup.sh -m standalone
```

**Nginx 相关命令：**

```bash
sudo nginx
sudo nginx -s reload
sudo nginx -s stop
```

**Nginx 配置文件路径：**

```
/usr/local/etc/nginx/nginx.conf
```

参考链接：[CSDN Nacos 教程](https://blog.csdn.net/weixin_44722978/article/details/104690535)

## 🌐 9. Mac 安装 Nginx

这是个大坑，配置 Nacos 集群，花了将近四五个小时。一开始是自己的阿里云服务器配置不够高，一直启动不了三个 Nacos，后来就在 Mac 上直接配置，Nginx 一直端口改变不成功，最后才发现对端口号的大小有限制，坑死了。

参考链接：[cnblogs Nginx 教程](https://www.cnblogs.com/tandaxia/p/8810648.html)

> **注意**：配置的 6666 端口一直无法生效，原来在 Mac 上配置 Nginx 端口，必须是 **8000 以上**，不需要配置什么权限什么的，只要把端口号改成 8000 以上就可以了。很多帖子都不正确，在这个帖子的最后一点提到了，改了一下，确实如此。

参考链接：[CSDN Nginx 端口教程](https://blog.csdn.net/yh1061632045/article/details/81518195?utm_source=blogxgwz7)

### 9.1 常见报错

```
java.lang.IllegalStateException: failed to req API:/nacos/v1/ns/instance after all servers([192.168.1.41:9999]) tried: failed to req API:192.168.1.41:9999/nacos/v1/ns/instance. code:500 msg: java.net.SocketTimeoutException: Read timed out
```

一直报错，开始以为是 JDK 的问题，将 JDK 13 改为了 JDK 8 还是不行。

```
http://zhouweidemacbook-pro.local:9999/nacos/v1/ns/instance

Param 'serviceName' is required.
```

```bash
JAVA_OPT="${JAVA_OPT} -Dnacos.server.ip=150.109.127.59"
```

```bash
# 新增以下参数设置本机 IP 地址
JAVA_OPT="${JAVA_OPT} -Dnacos.server.ip=服务器的ip"
```

参考链接：[简书 Nacos 教程](https://www.jianshu.com/p/3014b9a4eef2)

> **总结**：最后发现完全就是自己的配置问题，必须设置成 IP 才可以。之前使用的 hostname 得到 `zhouweideMacBook-Pro.local`，所以配置的时候都用了这个，没用 IP，谁知道最后是 IP 配置的问题。最后改成了 IP，服务成功注册上去了。至此已经花费了 7 小时，我的天！

**配置信息：**
- IP: `192.168.1.41`
- 路径: `/Users/zhouwei/development/nacos`

## 📊 10. Navicat 导出表结构为 Excel 格式

参考链接：[cnblogs Navicat 教程](https://www.cnblogs.com/xianxiaobo/p/10254737.html)

## 🧹 11. 删除 Consul 的无效/失效服务

参考链接：[简书 Consul 教程](https://www.jianshu.com/p/bd2bfb553915)

## 🗃️ 12. DML、DDL、DCL 区别

### DML（Data Manipulation Language）数据库操纵语言

就是我们最经常用到的 `SELECT`、`UPDATE`、`INSERT`、`DELETE`。主要用来对数据库的数据进行一些操作。

```sql
SELECT 列名称 FROM 表名称
UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值
INSERT INTO table_name (列1, 列2,...) VALUES (值1, 值2,....)
DELETE FROM 表名称 WHERE 列名称 = 值
```

### DDL（Data Definition Language）数据库定义语言

其实就是我们在创建表的时候用到的一些 SQL，比如说：`CREATE`、`ALTER`、`DROP` 等。DDL 主要是用在定义或改变表的结构，数据类型，表之间的链接和约束等初始化工作上。

```sql
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

### DCL（Data Control Language）数据库控制语言

是用来设置或更改数据库用户或角色权限的语句，包括（`grant`, `deny`, `revoke` 等）语句。这个比较少用到。

## 🔍 13. 查看端口占用情况

参考链接：[cnblogs 端口查看教程](https://www.cnblogs.com/keystone/p/12516552.html)

## 🔴 14. Redis 安装

### 14.1 Mac 安装

参考链接：[简书 Redis 教程](https://www.jianshu.com/p/bb7c19c5fc47)

### 14.2 Windows 安装（设置开机自启动）

参考链接：[cnblogs Redis 开机自启动](https://www.cnblogs.com/feigao/p/11157607.html)

**操作步骤：**

1. 还需要设置一下环境变量
2. 需要配置一下密码

   > 如果不配置密码，服务设置了密码，还是会连接出错。

   参考链接：[cnblogs Redis 密码配置](https://www.cnblogs.com/GuoJunwen/p/9238624.html)

3. 常用的 Redis 服务命令：

   ```bash
   # 卸载服务
   redis-server --service-uninstall

   # 开启服务
   redis-server --service-start

   # 停止服务
   redis-server --service-stop
   ```

4. 连接测试：

   ```bash
   127.0.0.1:6379> config get requirepass
   (error) NOAUTH Authentication required.
   127.0.0.1:6379> auth 123456
   OK
   127.0.0.1:6379> config get requirepass
   1) "requirepass"
   2) "123456"
   ```

### 14.3 Linux 安装

**步骤一：获取 Redis 资源**

```bash
wget http://download.redis.io/releases/redis-4.0.8.tar.gz
```

**步骤二：解压**

```bash
tar xzvf redis-4.0.8.tar.gz
```

**步骤三：安装**

```bash
cd redis-4.0.8
make
cd src
make install PREFIX=/usr/local/redis
```

**步骤四：移动配置文件到安装目录下**

```bash
cd ../
mkdir /usr/local/redis/etc
mv redis.conf /usr/local/redis/etc
```

**步骤五：配置 Redis 为后台启动**

```bash
vi /usr/local/redis/etc/redis.conf
# 将 daemonize no 改成 daemonize yes
# 并且 bind 0.0.0.0 需要注释 #
```

**步骤六：将 Redis 加入到开机启动**

```bash
vi /etc/rc.local
# 在里面添加内容：
# /usr/local/redis/bin/redis-server /usr/local/redis/etc/redis.conf
# 意思就是开机调用这段开启 Redis 的命令
```

**步骤七：开启 Redis**

```bash
/usr/local/redis/bin/redis-server /usr/local/redis/etc/redis.conf
```

**常用命令：**

```bash
# 启动 Redis
redis-server /usr/local/redis/etc/redis.conf

# 停止 Redis
pkill redis
```

**卸载 Redis：**

```bash
rm -rf /usr/local/redis       # 删除安装目录
rm -rf /usr/bin/redis-*       # 删除所有 Redis 相关命令脚本
rm -rf /root/download/redis-4.0.4  # 删除 Redis 解压文件夹
```

**使用指定密码连接指定 IP 和指定端口：**

```bash
./src/redis-cli -h 指定ip -p 指定端口 -a 指定密码
```

### 14.4 Linux 第二种安装方式（更简单点）

参考链接：[CSDN Redis 教程](https://blog.csdn.net/jiedong_xu/article/details/131626318)

后续步骤差不多，`cp /redis.conf /etc/redis.conf`，并且需要修改里面的配置项：

![Redis 配置](http://img.minalz.cn/typora/3fbd97f28341907f3edef4d2f15cb80.png)

**启动命令：**

```bash
redis-server /etc/redis.conf
```

**客户端：**

```bash
redis-cli
```

## 💻 15. Mac 安装 iTerm2

参考链接：[知乎 iTerm2 教程](https://zhuanlan.zhihu.com/p/37195261)

```bash
# 安装后的插件要放在 ~/.zshrc/customer/plugin 下
```

**问题：** 安装 iTerm2 后，本身的 Terminal（Mac 自带的终端配置）会出现终端文字被覆盖的问题：

![iTerm2 问题1](http://img.minalz.cn/typora/image-01.png)

IDEA 中有这样的问题也可以按照这样的方式来解决。

**解决方式：**

![iTerm2 解决](http://img.minalz.cn/typora/image-02.png)

参考链接：[liuchuo iTerm2 教程](https://www.liuchuo.net/archives/4678)

## ⚠️ 16. Mac 千万不要随便修改用户，会导致管理员账号和密码丢失

参考链接：[Apple Discussions 教程](https://discussionschinese.apple.com/thread/140108050)

## 🖥️ 17. Mac ZSH 隐藏命令行前面的用户名和主机名

修改 `vim ~/.zshrc` 文件，在文件底部增加：

### 17.1 隐藏用户名和主机名

```bash
prompt_context() {}
```

### 17.2 只保留用户名，隐藏主机名

```bash
prompt_context() {
  if [[ "$USER" != "$DEFAULT_USER" || -n "$SSH_CLIENT" ]]; then
    prompt_segment black default "%(!.%{%F{yellow}%}.)$USER"
  fi
}
```

### 17.3 只保留主机名，隐藏用户名

```bash
prompt_context() {
  if [[ "$USER" != "$DEFAULT_USER" || -n "$SSH_CLIENT" ]]; then
    prompt_segment black default "%(!.%{%F{yellow}%}.)$HOST"
  fi
}
```

> **注意**：修改后记得执行 `source ~/.zshrc` 使配置生效。

## 🍺 18. Homebrew 安装

参考链接：[cnblogs Homebrew 教程](https://www.cnblogs.com/haojile/p/13193805.html)

## 🔗 19. Mac 连接 Linux 服务器

```bash
ssh -p 28726 root@107.182.23.xxx
```

## 🟢 20. Vue 环境安装

参考链接：[百度经验 Vue 教程](https://jingyan.baidu.com/article/5225f26bbb430fe6fa0908ce.html)

## 🖼️ 21. 解放双手，Markdown 文章神器：Typora + PicGo + 七牛云图床实现自动上传图片

参考链接：[51CTO 教程](https://blog.51cto.com/guosisoft/6471645)

## ☁️ 22. Linux Nacos 安装

参考链接：[CSDN Nacos 教程](https://blog.csdn.net/henrin/article/details/130898186)