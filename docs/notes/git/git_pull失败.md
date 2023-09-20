# git pull 失败(Support for password authentication was removed on August 13, 2021)

## 1.报错信息:

>remote: Support for password authentication was removed on August 13, 2021. Please use a personal access token instead.
>remote: Please see https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/ for more information.

图片如下:

说是2021年8月13日,就移除密码验证的方式了,要求使用个人personal access token来进行代替

![image-20210814230803694](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20210814230803694.png)

前一天都还好好的,今天突然就不行,说明验证方式确实是出问题了,查了一些资料,也是这么说的

## 2.参考链接:

https://www.cnblogs.com/zhoulujun/p/15141608.html

https://stackoverflow.com/questions/68775869/support-for-password-authentication-was-removed-please-use-a-personal-access-to

## 3.解决方式:

### 3.1 前提

git之前都是配置好的,没有问题的,起码git上的公私钥都是没问题的,如果以下步骤走完,还是不行,去确定一下是否配置正确(可以参考第一个链接,可以搜其他的,网上一大堆就不写了)

### 3.2 生成Access Token

点击头像->Settings->左边菜单栏Developer settings->Personal access tokens->generate new token->完成信息设置->保存好这个token,窗口关闭就看不到了

![image-20210814233827899](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20210814233827899.png)

最后点击Generate token->一定要记得保存token,如果丢了,只能再重新设置一遍了

### 3.3 配置Access Token

这里使用的Idea来进行设置的

Idea中打开设置->GitHub->如果之前是用户名密码设置的,删除点,然后点'+',重新添加,选择Enter token

![image-20210814233450067](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20210814233450067.png)

## 4.重新设置git origin

如果之前是Https设置的,那就邮件Idea中的项目,Open In Terminal

```sh
# 查看之前仓库的配置
git remote -v
# 如果如下
git remote -v
origin  https://github.com/yourname/test.git (fetch)
origin  https://github.com/yourname/test.git (push)
# 删除掉
git remote rm origin
# git remote -v 再查一次 发现删除成功了
# 改成ssh方式 git remote add origin url
git remote add origin git@github.com:yourname/test.git
# git remote -v 再查一次 变成ssh方式了 说明成功了
# 或者 git remote set-url git@xx.git
```

ssh查看方式->点击项目进去->点击Code

![image-20210814234423342](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20210814234423342.png)

## 5.再次git pull