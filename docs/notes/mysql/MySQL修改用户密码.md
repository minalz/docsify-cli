# 🔑 MySQL 修改用户密码

> 💡 MySQL 用户密码管理 | 版本兼容 | 安全操作

---

## 🔧 一、MySQL 5.8 版本之前 - UPDATE 方法

```bash
update user set password=password("newpassword") where user="username";
```

> ⚠️ **注意**：MySQL 5.8 后，不能用 UPDATE 方法更新了，没有了 `password` 字段和 `password()` 函数。

---

## 🔧 二、ALTER 命令（✅ 推荐）

```bash
alter user 'root'@'localhost' identified by 'newpassword';
```

---

## 🔧 三、mysqladmin 命令

```bash
mysqladmin -u root -p '旧密码' password '新密码'
```

