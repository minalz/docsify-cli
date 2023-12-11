MySQL字段值更新

1.小写字母转大写

```mysql
UPDATE table_name SET field_name = UPPER(field_name);
```

2.将值中的空格符号去除

```mysql
UPDATE table_name SET field_name = REPLACE(field_name, ' ', '');
```

