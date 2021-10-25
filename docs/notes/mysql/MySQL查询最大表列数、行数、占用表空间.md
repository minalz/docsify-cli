# MySQL查询最大表列数、行数、占用表空间

## 1.查询最大表列数

```mysql
select count(*) 
from information_schema.COLUMNS 
where TABLE_SCHEMA='库名' and table_name='表名'

select table_name,count(*) 
from information_schema.COLUMNS 
where TABLE_SCHEMA='dbname' GROUP BY table_name	order by count(*) desc
```

## 2.最大表行数

```mysql
# 下面的这条语句 统计出来的数据是不准确的 因为还没有及时更新 如果第一个很大 只需要用count(*) 查一下实际的就行了
select table_name,table_rows from information_schema.tables where TABLE_SCHEMA='dbname' order by table_rows desc limit 30;

select count(*) from table_name	
```

## 3.表占用多大的存储空间

```mysql
# 每个表占用空间的大小：
select table_name, concat(round(sum(data_length/1024/1024/1024),2),'G') as data from information_schema.tables where table_schema='dbname' group by table_name order by data desc;

# 所有表占用空间的大小：
select concat(round(sum(data_length/1024/1024/1024),2),'G') as data from information_schema.tables where table_schema='dbname';
```

