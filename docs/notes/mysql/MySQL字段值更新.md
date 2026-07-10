# 🔄 MySQL 字段值更新

> 💡 MySQL 数据更新技巧 | 字符串处理 | 批量操作

---

## 🔧 一、小写字母转大写

```mysql
UPDATE table_name SET field_name = UPPER(field_name);
```

---

## 🔧 二、将值中的空格符号去除

```mysql
UPDATE table_name SET field_name = REPLACE(field_name, ' ', '');
```

