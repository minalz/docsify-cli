# [MAC OS X的ACL扩展权限设置](https://MyBlog.cnblogs.com/pheye/p/5740815.html)

在WEB开发时，网站是以`mymac`的用户运行的，而我在本地是以`root`的用户编辑的。这就带来一个问题：如果所有文件属于`root`，那么网站运行需要写文件时就因**无权限而失败**；如果所有文件属于`mymac`，那么`root`则需要**`sudo`获取权限才能写进去**。最郁闷的是使用git合并的时候，如果忘了加`sudo`，就会因权限不足提示大量的合并失败，需要先回滚，再重合并下，甚是不爽。

这个问题，在标准LINUX下，是可以用`setfacl`/`getfacl`做ACL控制解决此问题，但是MAC OS X上并没有这两个命令。百度了`OS X ACL`半天得到的不是打不开就是跟问题不搭边，最后去查看这些打不开的页面的快照（快照啊，找得是多蛋疼），找到了答案。

MAC OS X上使用`chmod +a`增加ACL权限, `chmod -a`删除ACL权限,`ls -le`查看ACL权限。

要解决上面提到的问题，执行以下两条命令修改网站根目录的扩展权限即可(`MyBlog`是我网站根目录名称，注意`-R`参数必须有，将`MyBlog`下面的所有文件也一并设置）：

```Bash
$sudo chmod  -R +a 'root allow write,delete,file_inherit,directory_inherit,add_subdirectory' MyBlog
$sudo chmod  -R +a 'mymac allow write,delete,file_inherit,directory_inherit,add_subdirectory' MyBlog
```

执行以下命令确认权限设置有成功：

```Bash
$ls -le #以下为命令输出，对比可确认权限设置符合预期
total 0
drwxr-xr-x+ 37 root  staff  1258  8  5 10:04 MyBlog
 0: user:root allow add_file,delete,file_inherit,directory_inherit,add_subdirectory
 1: user:mymac allow add_file,delete,file_inherit,directory_inherit,add_subdirectory
```

该命令的其他用法，请参考原文：[OS X ACL usage](http://cache.baiducontent.com/c?m=9d78d513d99c12fe4fede5234c01d717534380126f868e013894cd47c9221d03506790a63a71525a80803c305dfe1e4bea87672f681e5fe4cab5e920c0e8c3763888506e3643d8&p=87769a47808104ff57ee9475166482&newp=882a9645dd970af81fbe9b7c1b4189231610db2151dcdb01298ffe0cc4241a1a1a3aecbf2620140fd5c47d6002a9485ee8f737783d0834f1f689df08d2ecce7e7bc37073&user=baidu&fm=sc&query=mac+os+x+acl&qid=9253ed90003ad8da&p1=2)。

参考链接：https://www.cnblogs.com/pheye/p/5740815.html