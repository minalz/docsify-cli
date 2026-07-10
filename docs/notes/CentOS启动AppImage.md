# 🐧 CentOS 启动 AppImage

> 💡 CentOS 系统中运行 AppImage 格式应用 | FUSE 依赖 | 常见问题解决

---

## 🚀 一、启动命令

```bash
# 赋权
chmod a+x *.AppImage

# 启动
sudo ./*.AppImage
```

---

## ❌ 二、报错信息

### 1️⃣ 报错 1：FUSE 依赖缺失

```
dlopen(): error loading libfuse.so.2 AppImages require FUSE to run. 
You might still be able to extract the contents of this AppImage if you run it with the --appimage-extract option. 
See https://github.com/AppImage/AppImageKit/wiki/FUSE
```

#### ✅ 解决方案

```bash
yum --enablerepo=epel -y install fuse-sshfs # install from EPEL
```

安装后，又报第二个错。

---

### 2️⃣ 报错 2：GLIBCXX 版本不匹配

```
/lib64/libstdc++.so.6: version `GLIBCXX_3.4.21' not found
```

#### ✅ 解决方案

参考链接：https://blog.csdn.net/salman_tan/article/details/83147827

> ⚠️ **注意**：需要升级 GCC，需要编译很久，请耐心等待...