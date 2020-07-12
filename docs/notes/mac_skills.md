# Mac使用技巧

## 1.显示文件扩展名

参考链接:

https://jingyan.baidu.com/article/9113f81b0741e52b3314c756.html

## 2.如何在MAC 指定文件夹打开终端（terminal)

https://www.jianshu.com/p/3e1b5fe48952

## 3.非root用户下一直提示 -bash: /etc/profile: Permission denied

`sudo chmod 775 /etc/profile`

## 4.应用已经删除了，但是应用台还是有这个图标，不过是灰色的

输入如下命令:

sqlite3 $(find /private/var/folders \( -name com.apple.dock.launchpad -a -user $USER \) 2> /dev/null)/db/db "DELETE FROM apps WHERE title='Mousecape';" && killall Dock

参考链接：
https://blog.csdn.net/weixin_44091178/article/details/103330882


