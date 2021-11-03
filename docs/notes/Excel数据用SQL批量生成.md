# Excel数据用SQL批量生成

## 1.普通生成方式

```excel
="UPDATE `o2o`.`merchant` SET `name` = '"&D2&"' WHERE `id` = "&A2&" and `name` = '"&B2&"';"
```

## 2.带时间的生成方式

```excel
="UPDATE `checkup`.`order_info` SET `arrival_time` = '"&TEXT(D2,"yyyy-mm-dd hh:mm:ss")&"', `order_state` = 3, `appoint_state` = 3 WHERE `order_id` = '"&A2&"';"
```

