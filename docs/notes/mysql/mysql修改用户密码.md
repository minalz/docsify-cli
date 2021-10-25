# MySQL修改用户密码

## 1.MySQL5.8版本之前update

```bash
update user set password=password("newpassword") where user="username";
```

MySQL5.8后,不能用update方法更新了 没有了password字段和password()函数，所以不能使用上面的修改密码的方法

## 2.alter命令(我用的这个)

```bash
alter user 'root'@'localhost' identified by 'newpassword';
```

## 3.mysqladmin(我用的这个失败了)

```bash
mysqladmin -u root -p '旧密码' password '新密码'
```

