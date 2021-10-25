# github和gitee配置ssh key冲突解决

> 如果你既想从github上拉取项目 又想从gitee上拉取项目 并且都想免密的话 有两种方法

## 1.单独为gitee再生成一个公钥

> 需要额外改一下名称,否则会覆盖github中生成的公钥,我是用的这种,万一哪天服务器中的公钥被我覆盖了,github和gitee都会出问题

### 1.1 进入生成公钥的文件目录中

```bash
cd ~/.ssh
```

### 1.2 生成gitee的key

> 分别配置后，在.ssh文件夹会生成指定名称的配置文件

```bash
ssh-keygen -t rsa -C "注册邮箱_xxxx@qq.com" -f "gitee-id_rsa"
# github如果也要生成key的话,执行方式是一样的
ssh-keygen -t rsa -C "注册邮箱_xxxx@qq.com" -f "github-id_rsa"
# 如果不指定文件名,就是默认的名称id_rsa
ssh-keygen -t rsa -C "注册邮箱_xxxx@qq.com"
```

### 1.3 把public key复制到gitee

> 查看公钥

```bash
cat gitee-id_rsa.pub
```

> 公钥

```dart
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDtHejBT/uDVlBHwyNpaNmgB8qghmlOaLNX27O45rCbzS4m9xr/1NC6KP51Esl0exIu5VsMBRZ702zwUlD0Vetv17HXW4YsdEFDEDhLWbsagSlqC9Z2LU6bFnfP47MJiR3kj8i1i32nu6LgA40z0MXYNbYO2tVa9t7SSp314r+j xxxx@qq.com
```

复制你的控制台生成的 key 到你的仓库上设置SSH公钥

### 1.4 添加config文件解决ssh冲突

> 在.ssh文件夹下添加配置文件config

```bash
vi config
```

> 添加下面的内容

```ruby
# gitee
Host gitee.com
HostName gitee.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/gitee-id_rsa

# github
Host github.com
HostName github.com
PreferredAuthentications publickey
# 这个是github的配置私钥,和gitee生成的方式是一样的,如果单独设置了,也需要指定,否则就是个默认的名称
IdentityFile ~/.ssh/id_rsa 
```

### 1.5 测试是否配置成功

```bash
$ ssh -T git@gitee.com
Hi minalz! You've successfully authenticated, but GITEE.COM does not provide shell access.

$ ssh -T git@github.com
Hi minalz! You've successfully authenticated, but GitHub does not provide shell access.
```



## 2.可以把github生成的公钥,也复制到gitee中

> 去生成,但前提是注册的邮箱都是一样的(这种情况我没测试过)

## 3.注意

> gitee拉取的链接,需要时ssh,如果是https的依然需要输入账号密码,gitee文档中是有括号说明的
> github中不太一样,https和ssh一样也可以实现免密拉取了