# 🔧 GitHub 和 Gitee 配置 SSH Key 冲突解决

> 💡 如果你既想从 GitHub 上拉取项目，又想从 Gitee 上拉取项目，并且都想免密的话，有两种方法

---

## 1️⃣ 单独为 Gitee 再生成一个公钥

> ⚠️ **注意**: 需要额外改一下名称，否则会覆盖 GitHub 中生成的公钥。我是用的这种，万一哪天服务器中的公钥被我覆盖了，GitHub 和 Gitee 都会出问题

### 📂 1.1 进入生成公钥的文件目录

```bash
cd ~/.ssh
```

### 🔑 1.2 生成 Gitee 的 Key

> 分别配置后，在 `.ssh` 文件夹会生成指定名称的配置文件

```bash
# 生成 Gitee 的 SSH Key
ssh-keygen -t rsa -C "注册邮箱_xxxx@qq.com" -f "gitee-id_rsa"

# GitHub 如果也要生成 Key 的话，执行方式是一样的
ssh-keygen -t rsa -C "注册邮箱_xxxx@qq.com" -f "github-id_rsa"

# 如果不指定文件名，就是默认的名称 id_rsa
ssh-keygen -t rsa -C "注册邮箱_xxxx@qq.com"
```

### 📤 1.3 把 Public Key 复制到 Gitee

> 查看公钥

```bash
cat gitee-id_rsa.pub
```

> 公钥示例

```dart
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDtHejBT/uDVlBHwyNpaNmgB8qghmlOaLNX27O45rCbzS4m9xr/1NC6KP51Esl0exIu5VsMBRZ702zwUlD0Vetv17HXW4YsdEFDEDhLWbsagSlqC9Z2LU6bFnfP47MJiR3kj8i1i32nu6LgA40z0MXYNbYO2tVa9t7SSp314r+j xxxx@qq.com
```

📋 **操作步骤**：复制你的控制台生成的 Key 到你的仓库上设置 SSH 公钥

### ⚙️ 1.4 添加 Config 文件解决 SSH 冲突

> 在 `.ssh` 文件夹下添加配置文件 config

```bash
vi config
```

> 添加下面的内容

```ruby
# Gitee 配置
Host gitee.com
HostName gitee.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/gitee-id_rsa

# GitHub 配置
Host github.com
HostName github.com
PreferredAuthentications publickey
# 这个是 GitHub 的配置私钥，和 Gitee 生成的方式是一样的，如果单独设置了，也需要指定，否则就是个默认的名称
IdentityFile ~/.ssh/id_rsa
```

### ✅ 1.5 测试是否配置成功

```bash
# 测试 Gitee
$ ssh -T git@gitee.com
Hi minalz! You've successfully authenticated, but GITEE.COM does not provide shell access.

# 测试 GitHub
$ ssh -T git@github.com
Hi minalz! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## 2️⃣ 可以把 GitHub 生成的公钥，也复制到 Gitee 中

> 💡 去生成，但前提是注册的邮箱都是一样的（这种情况我没测试过）

---

## ⚠️ 3. 注意事项

> 🔸 **Gitee**: 拉取的链接需要是 SSH，如果是 HTTPS 的依然需要输入账号密码，Gitee 文档中是有括号说明的
> 
> 🔹 **GitHub**: 不太一样，HTTPS 和 SSH 一样也可以实现免密拉取了