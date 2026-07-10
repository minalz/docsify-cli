# ⬇️ Git Pull 失败问题解决

> 🔒 Support for password authentication was removed on August 13, 2021 | Token 认证

---

## 📖 报错信息

```
remote: Support for password authentication was removed on August 13, 2021. Please use a personal access token instead.
remote: Please see https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/ for more information.
```

**图片如下：**

![image-20210814230803694](http://img.minalz.cn/typora/image-20210814230803694.png)

> 💡 **说明**：2021年8月13日，GitHub 移除了密码验证的方式，要求使用个人 Personal Access Token 来进行代替。

前一天都还好好的，今天突然就不行，说明验证方式确实是出问题了。查了一些资料，也是这么说的。

---

## 🔗 参考链接

- [Token Authentication Requirements](https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/)
- [StackOverflow 讨论](https://stackoverflow.com/questions/68775869/support-for-password-authentication-was-removed-please-use-a-personal-access-to)

---

## 🔧 解决方式

### 1️⃣ 前提

Git 之前都是配置好的，没有问题的，起码 Git 上的公私钥都是没问题的。如果以下步骤走完，还是不行，去确定一下是否配置正确。

### 2️⃣ 生成 Access Token

**步骤：**
1. 点击头像 → **Settings**
2. 左边菜单栏 **Developer settings**
3. **Personal access tokens**
4. **Generate new token**
5. 完成信息设置
6. ⚠️ **保存好这个 token**，窗口关闭就看不到了

![image-20210814233827899](http://img.minalz.cn/typora/image-20210814233827899.png)

最后点击 **Generate token** → 一定要记得保存 token，如果丢了，只能再重新设置一遍了。

### 3️⃣ 配置 Access Token

这里使用的 IDEA 来进行设置的。

**IDEA 中操作：**
1. 打开 **设置** → **GitHub**
2. 如果之前是用户名密码设置的，删除掉
3. 然后点 **"+"**
4. 重新添加，选择 **Enter token**

![image-20210814233450067](http://img.minalz.cn/typora/image-20210814233450067.png)

---

## 🔄 重新设置 Git Origin

如果之前是 HTTPS 设置的，那就右键 IDEA 中的项目，**Open In Terminal**

```bash
# 查看之前仓库的配置
git remote -v

# 如果如下
origin  https://github.com/yourname/test.git (fetch)
origin  https://github.com/yourname/test.git (push)

# 删除掉
git remote rm origin

# git remote -v 再查一次，发现删除成功了

# 改成 SSH 方式
git remote add origin git@github.com:yourname/test.git

# git remote -v 再查一次，变成 SSH 方式了，说明成功了
# 或者 git remote set-url git@xx.git
```

**SSH 查看方式：**
- 点击项目进去
- 点击 **Code**

![image-20210814234423342](http://img.minalz.cn/typora/image-20210814234423342.png)

---

## ✅ 再次 Git Pull

完成以上步骤后，再次尝试 `git pull` 操作。