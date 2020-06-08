# Git指令

参考链接:

https://blog.csdn.net/Capgras/article/details/100540501

## git第一次提交:

+ git init     //初始化git

+ git add .     //添加文件到本地仓库( .为添加整个文件夹，也可以换成某个文件)

- git commit -m "xxx"      //增加更新记录

- git remote add origin https://github.com/oldmanadvancing/docsify-cli.git             //链接远程仓库:（xxxxxx为刚创建的仓库地址) url可以在刚才新建的文件中查看，点击clone

- git push -f origin master     //如果是第一次提交的话，直接提交

## git提交更新操作:

- git add style.css     或者    git add .

- git commit -m "这是注释内容" 

- git remote add origin https://github.com/oldmanadvancing/docsify-cli.git
- git push -u origin master

## git拉取更新操作：

正规流程

- git status（查看本地分支文件信息，确保更新时不产生冲突）

- git checkout – [file name] （若文件有修改，可以还原到最初状态; 若文件需要更新到服务器上，应该先merge到服务器，再更新到本地）

- git branch（查看当前分支情况）

- git checkout remote branch (若分支为本地分支，则需切换到服务器的远程分支)

- git pull

若命令执行成功，则更新代码成功！

快速流程

上面是比较安全的做法，如果你可以确定什么都没有改过只是更新本地代码

+ git pull (一句命令搞定)

+ git branch 看看分支
+ git chechout aaa 切换分支aaa
+ git branck aaa 创建aaa分支
+ git chechout -b aaa 本地创建 aaa分支，同时切换到aaa分支。只有提交的时候才会在服务端上创建一个分支

+ windows安装git参考链接：

  https://www.cnblogs.com/Dcl-Snow/p/10476004.html
  
## 强行推送到仓库
如果一只出现这个错误：
Push rejected: Push to origin/master was rejected
+ git push -u origin master -f

