# MySQL对表结构进行增删改操作

## 1.测试环境

```shell
# docker mysql运行的容器 无法输入中文
docker run -d --name my-mysql -p 3301:3306 -e MYSQL_ROOT_PASSWORD=123456 --privileged mysql:5.7
```

## 2.进入

```shell
# 由于docker搭建的mysql服务 可能会导致无法输入中文 所以需要设置一下环境 也可以单独修改my.ini
-e LANG=C.UTF-8 / env LANG=C.UTF-8
docker exec -it <contrainerId> env LANG=C.UTF-8 /bin/bash
```

## 3.操作

### 3.1 新增

```mysql
ALTER TABLE `t_study` ADD `memo` varchar(128) COMMENT '服务备注';
```



### 3.2 更新
```mysql
ALTER TABLE `t_study` modify COLUMN  `memo1` varchar(120) COMMENT '修改服务备注';


```

### 3.3 删除

```mysql
ALTER TABLE `t_study` DROP `memo1`;
```



### 3.4 批量新增
```mysql
ALTER TABLE `t_study` ADD COLUMN (
    `desc` varchar(128) COMMENT '描述',
    `name` varchar(255) NOT NULL COMMENT '姓名',
    `age` int(11) COMMENT '年龄'
);
```



### 3.5 修改字段名称
```mysql
alter TABLE `t_study` 
	change COLUMN `name` `name1` varchar(255) NOT NULL COMMENT '姓名1',
	change COLUMN `age` `age1` int(11) COMMENT '年龄1';
```



### 3.6 批量更新
```mysql
ALTER TABLE `t_study` 
        modify COLUMN `desc` varchar(128) COMMENT '描述1',
        modify COLUMN `name1` varchar(255) NOT NULL COMMENT '姓名2',
        modify COLUMN `age1` int(11) COMMENT '年龄2';
```




### 3.7 批量删除
```mysql
alter TABLE `t_study`
        drop COLUMN `desc`,
        drop COLUMN `name1`,
        drop COLUMN `age1`;
```

