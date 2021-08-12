# CentOS启动AppImage

## 1.启动命令

```sh
# 赋权
chmod a+x *.AppImage
# 启动
sudo ./*.AppImage
```

## 2.报错信息

### 2.1 报错1

```
dlopen(): error loading libfuse.so.2 AppImages require FUSE to run. You might still be able to extract the contents of this AppImage if you run it with the --appimage-extract option. See https://github.com/AppImage/AppImageKit/wiki/FUSE
```

解决：

```sh
yum --enablerepo=epel -y install fuse-sshfs # install from EPEL
```

安装后，又报第二个错

### 2.2 报错2

```
/lib64/libstdc++.so.6: version `GLIBCXX_3.4.21' not found
```

解决：

https://blog.csdn.net/salman_tan/article/details/83147827?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-4.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-4.control

需要升级gcc，需要编译很久，耐心等待......