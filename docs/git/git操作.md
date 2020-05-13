参考链接:

https://blog.csdn.net/Capgras/article/details/100540501

+ git第一次提交:

  + git init     //初始化git

  + git add .     //添加文件到本地仓库( .为添加整个文件夹，也可以换成某个文件)

  - git commit -m "xxx"      //增加更新记录

  - git remote add origin https://github.com/oldmanadvancing/docsify-cli.git             //链接远程仓库:（xxxxxx为刚创建的仓库地址) url可以在刚才新建的文件中查看，点击clone

  - git push -f origin master     //如果是第一次提交的话，直接提交

+ git更新操作:

  - git add style.css     或者    git add .

  - git commit -m "这是注释内容" 

  - git remote add origin https://github.com/oldmanadvancing/docsify-cli.git
  - git push -u origin master

```html
<script src="//unpkg.com/docsify/lib/docsify.min.js" data-repo="https://github.com/oldmanadvancing/docsify-cli.git"></script>
```



