# 🍎 MAC 使用技巧

> 💡 macOS 系统使用技巧 | 终端配置 | 问题解决

---

## 🔧 一、显示文件扩展名

参考链接：
- [显示扩展名教程](https://jingyan.baidu.com/article/9113f81b0741e52b3314c756.html)

---

## 💻 二、在指定文件夹打开终端（Terminal）

参考链接：
- [打开终端教程](https://www.jianshu.com/p/3e1b5fe48952)

---

## ⚠️ 三、非 root 用户下提示 -bash: /etc/profile: Permission denied

**解决方案：**

```bash
sudo chmod 775 /etc/profile
```

---

## 🗑️ 四、应用已删除但 Dock 栏仍有灰色图标

**输入如下命令：**

```bash
sqlite3 $(find /private/var/folders \( -name com.apple.dock.launchpad -a -user $USER \) 2> /dev/null)/db/db "DELETE FROM apps WHERE title='Mousecape';" && killall Dock
```

参考链接：
- [解决方案](https://blog.csdn.net/weixin_44091178/article/details/103330882)


