# MySQL存储过程之循环遍历查询结果集

原文链接: https://www.cnblogs.com/llq1214/p/11202743.html

> 背景：

　　需要从shxh40_test这张表获取upperpolicyno,serialno,kindcode,oldregistno,uniqueno 这几个字段（得到集合），然后循环取值，写sql更新数据。

```mysql
-- 创建存储过程之前需判断该存储过程是否已存在，若存在则删除
DROP PROCEDURE IF EXISTS shxc40;
-- 创建存储过程
CREATE PROCEDURE shxc40()
BEGIN
     
-- 定义变量
    DECLARE s int DEFAULT 0;
    DECLARE p varchar(255);
    DECLARE s1 varchar(255);
    DECLARE k varchar(256);
    DECLARE r varchar(256);
    DECLARE u varchar(256);
 
    -- 定义游标，并将sql结果集赋值到游标中
    DECLARE report CURSOR FOR select upperpolicyno,serialno,kindcode,oldregistno,uniqueno from shxh40_test;
 
    -- 声明当游标遍历完后将标志变量置成某个值
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET s=1;
 
    -- 打开游标
    open report;
 
        -- 将游标中的值赋值给变量，注意：变量名不要和返回的列名同名，变量顺序要和sql结果列的顺序一致
        fetch report into p,s1,k,r,u;
 
        -- 当s不等于1，也就是未遍历完时，会一直循环
        while s<>1 do
             
            -- 执行业务逻辑
            UPDATE icp_claim_info_shxh40 info,icp_engage_shxh40 engage set info.oldregistno = r, info.uniqueno = u
            where info.registno = engage.registno
      and info.sourceflag = '34'
            and info.endcasedate = '2019-07-15'
            and info.upperpolicyno =p
            and engage.serialno = s1
            and engage.kindcode = k
            and oldregistno is null;
 
            -- 当s等于1时表明遍历以完成，退出循环
            fetch report into p,s1,k,r,u;
        end while;
    -- 关闭游标
    close report;
END;
```

```mysql
-- 执行存储过程
call shxc40()
```

