# 📊 Excel 数据用 SQL 批量生成

> 💡 Excel 公式生成 SQL | 批量更新 | 数据处理

---

## 🔧 一、普通生成方式

```excel
="UPDATE `o2o`.`merchant` SET `name` = '"&D2&"' WHERE `id` = "&A2&" and `name` = '"&B2&"';"
```

---

## 🔧 二、带时间的生成方式

```excel
="UPDATE `checkup`.`order_info` SET `arrival_time` = '"&TEXT(D2,"yyyy-mm-dd hh:mm:ss")&"', `order_state` = 3, `appoint_state` = 3 WHERE `order_id` = '"&A2&"';"
```

