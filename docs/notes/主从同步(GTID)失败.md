# 仓储主从同步问题排查,主从同步(GTID)失败

## 1.单个GTID出错

### 1.1 登录从DB，查看同步状态

```
show slave status\G # 执行命令，查看从库状态是否正常

*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: 192.1.168.22
                  Master_User: root
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: binlog.000007
          Read_Master_Log_Pos: 261584359
               Relay_Log_File: svr09306-relay-bin.000009
                Relay_Log_Pos: 211256843
        Relay_Master_Log_File: binlog.000007
             Slave_IO_Running: Yes
            Slave_SQL_Running: No
              Replicate_Do_DB: 
          Replicate_Ignore_DB: 
           Replicate_Do_Table: 
       Replicate_Ignore_Table: 
      Replicate_Wild_Do_Table: 
  Replicate_Wild_Ignore_Table: 
                   Last_Errno: 1032
                   Last_Error: Could not execute Delete_rows event on table scmciwh300.scmciwh_product_matnr; Can't find record in 'scmciwh_product_matnr', Error_code: 1032; handler error HA_ERR_KEY_NOT_FOUND; the event's master log binlog.000007, end_log_pos 211256941
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 211256634
              Relay_Log_Space: 261587894
              Until_Condition: None
               Until_Log_File: 
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File: 
           Master_SSL_CA_Path: 
              Master_SSL_Cert: 
            Master_SSL_Cipher: 
               Master_SSL_Key: 
        Seconds_Behind_Master: NULL
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error: 
               Last_SQL_Errno: 1032
               Last_SQL_Error: Could not execute Delete_rows event on table scmciwh300.scmciwh_product_matnr; Can't find record in 'scmciwh_product_matnr', Error_code: 1032; handler error HA_ERR_KEY_NOT_FOUND; the event's master log binlog.000007, end_log_pos 211256941
  Replicate_Ignore_Server_Ids: 
             Master_Server_Id: 1
                  Master_UUID: a3f802c9-e378-11ea-8c97-fa163e5c3dd6
             Master_Info_File: mysql.slave_master_info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: 
           Master_Retry_Count: 86400
                  Master_Bind: 
      Last_IO_Error_Timestamp: 
     Last_SQL_Error_Timestamp: 210401 07:18:37
               Master_SSL_Crl: 
           Master_SSL_Crlpath: 
           Retrieved_Gtid_Set: a3f802c9-e378-11ea-8c97-fa163e5c3dd6:1-72509
            Executed_Gtid_Set: a3f802c9-e378-11ea-8c97-fa163e5c3dd6:1-70654,
f0094c48-e338-11ea-bf63-fa163e5d631f:1-42
                Auto_Position: 1
         Replicate_Rewrite_DB: 
                 Channel_Name: 
           Master_TLS_Version: 
       Master_public_key_path: 
        Get_master_public_key: 0
            Network_Namespace: 
1 row in set (0.00 sec)
```

发现几个信息：

```
Master_Log_File: binlog.000007 # 读取的binlog文件
Relay_Master_Log_File: binlog.000007 # 读取的binlog文件
Read_Master_Log_Pos: 261584359 # binlog读取到的位置
Slave_IO_Running: Yes # IO运行正常
Slave_SQL_Running: No # SQL同步出了问题
Last_Error: Could not execute Delete_rows event on table scmciwh300.scmciwh_product_matnr; Can't find record in 'scmciwh_product_matnr', Error_code: 1032; handler error HA_ERR_KEY_NOT_FOUND; the event's master log binlog.000007, end_log_pos 211256941 # 我们能看到错误的日志地方 这里没同步成功 阻塞了从库同步
Skip_Counter: 0 # 跳过的个数0 说明没有跳过
Exec_Master_Log_Pos: 211256634 # binlog退出的位置
```

由以上信息：

我们知道了，这是由于主库中有一条删除的操作，从库没有能成功同步，所以导致阻塞了

### 1.2 解决方案,直接跳过这条binlog同步

对数据不严格要求的情况下可以这样，我们这里是delete，所以这条数据不会再出现了，但如果是update，这样解决的话，可能还会出问题，因为这条数据以后还会继续被修改

```
正常解决方案是：
stop slave;
set global sql_slave_skip_counter =1;
ERROR 1858 (HY000): sql_slave_skip_counter can not be set when the server is running with @@GLOBAL.GTID_MODE = ON. Instead, for each transaction that you want to skip, generate an empty transaction with the same GTID as the transaction
start slave;
发现执行global sql_slave_skip_counter =1;有错误，因为开启了gtid
在最上面我们是可以看到gtid的信息的，如下：
Retrieved_Gtid_Set: a3f802c9-e378-11ea-8c97-fa163e5c3dd6:1-72509
Executed_Gtid_Set: a3f802c9-e378-11ea-8c97-fa163e5c3dd6:1-70654, # 这就是gtid 真正执行需要+1
f0094c48-e338-11ea-bf63-fa163e5d631f:1-42

我们根据Exec_Master_Log_Pos: 211256634来查对应的gtid
# 我们需要切换到主库，去查binlog文件，注意文件名称不一定一样，所以根据
# Relay_Master_Log_File: binlog.000007来进行查看
SHOW BINLOG EVENTS in 'binlog.000007' from 211256634;
```

![image-20210401151408238](images\image-20210401151408238.png)

和上面分析的gtid进行比较，结果一致

```
# 执行新的命令，用跳过gtid来进行解决
STOP SLAVE;
SET @@SESSION.GTID_NEXT= 'a3f802c9-e378-11ea-8c97-fa163e5c3dd6:70655'; # 注意前面的'1-'去掉
BEGIN; COMMIT;
SET SESSION GTID_NEXT = AUTOMATIC;
START SLAVE;
# 执行成功
# 再执行show slave status\G查看状态
Slave_IO_Running: Yes
Slave_SQL_Running: Yes
# 测试 主库中随意修改一条数据,然后看从库中的数据是否同步更新了
# 至此，问题解决
```

## 2.多个GTID出错

> 从主库把数据拉过来全部覆盖到从库中

### 2.1 不要随意执行下面的语句

```mysql
# 将删除日志索引文件中记录的所有binlog文件，创建一个新的日志文件 起始值从000001 开始
# 不能用于有任何slave 正在运行的主从关系的主库。因为在slave 运行时刻 reset master 命令不被支持，reset master 将master 的binlog从000001 开始记录,slave 记录的master log 则是reset master 时主库的最新的binlog,从库会报错无法找到指定的binlog文件
reset master;
```

```mysql
# 用于删除SLAVE数据库的relaylog日志文件，并重新启用新的relaylog文件
# 将使slave 忘记主从复制关系的位置信息。该语句将被用于干净的启动, 它删除master.info文件和relay-log.info 文件以及所有的relay log 文件并重新启用一个新的relaylog文件。
# 使用reset slave之前必须使用stop slave 命令将复制进程停止
reset slave;
```

```mysql
# 刷新binlog的日志文件,重新写入一个新的文件 旧文件:binlog.000007 -> binlog.000008
flush logs;
```

### 2.2 解决问题用到的语句

```mysql
# 进入到master 查询主节点用到的命令
show master status;
```

```mysql
# 进入到slave 查看从节点状态
show slave status\G
```

```mysql
# master上执行 选择从哪个binlog文件查,从什么位置查,可以查到gtid
show BINLOG EVENTS in 'binlog.000007' from 1076199;
```

```mysql
# 关闭从节点
STOP SLAVE;
# 将自动从主库同步关闭 开启是1
change master to master_auto_position=0;
# 设置日志文件和log位置、主节点、同步账号和密码、端口等
change master to master_log_file='binlog.000012',master_log_pos=6535,master_host='192.1.136.119',master_user='root',master_password='TT@ub{pk@4NP',master_port=3306;
# 重新开启从节点
start slave;
```

```mysql
stop slave;
# 重新设置同步策略,但如果之前的gtid有问题,只要打开,就会重新回到错误日志的地方,同步又会失败了 --> 当出现这种情况的时候，其实说明同步的方式是不对的，因为如果你是通过navicate导出表结构和数据,这个设置还是会导致从库的GTID回到错误的地方，正确的复制方式是通过mysqldump来进行备份，看我另一篇mysqldump文档可以顺利进行操作
change master to master_auto_position=1;
start slave;
```

```mysql
# 如果没有开启gtid,那么可以直接通过设置数字来跳过多少个gtid
STOP SLAVE;
# 跳过1个错误
SET GLOBAL SQL_SLAVE_SKIP_COUNTER=1;
START SLAVE;  
```

```mysql
STOP SLAVE;
# 跳过某一条事务ID,但是如果是多个或者上百个,这种操作就很有问题了,需要用脚本来解决
SET @@SESSION.GTID_NEXT='a3f802c9-e378-11ea-8c97-fa163e5c3dd6:100030';
BEGIN; COMMIT;
SET SESSION GTID_NEXT = AUTOMATIC;
START SLAVE;
```

### 2.3 解决完整步骤(通过备份主库数据到从库来恢复同步)

```bash
1.主库操作
# 登录主库
mysql -uroot -pXXX;
# 锁表
flush tables with read lock;
2.从库登录 
# 登录从库
mysql -uroot -pXXX;
# 停止从库
stop slave;
3.另外打开一个主库的shell窗口
# 准备进行mysqldump备份
mysqldump -uroot -pXXX db_name > db_name.db
# 备份的过程中会出现一个错误
mysqldump: Got error: 1449: The user specified as a definer ('XXX'@'192.168.1.122') does not exist when using LOCK TABLES
# select user,host from mysql.user; -> XXX用户不存在
原因: 这是因为视图中或函数中是直接拷贝的其他DB中写好的视图或函数，所以将创建的用户也一并带过来了，所以需要先将主库中的视图和函数中的创建用户解决一下，改成root@'%'最是方便了，自己想改成什么样都行，但不能有不存在的用户,修改完后,可以导出成功了
# 将备份发送到从库的服务器中
scp -P端口号 db_name.db root@IP:路径
4.另外打开一个从库的shell窗口
# 查看传送过来的文件是否接受到了
# 如果接收到了 开始备份文件 注意命令式mysql 不是mysqldump了 符号也是 < 不是 >
# -f 是忽略错误继续执行
mysql -uroot -p  -f db_name < db_name.db
注：在导入备份数据库前，db_name如果没有，是需要创建的； 而且与db_name.db中数据库名是一样的才可以导入。
# 导入过程中出现的错误
4.1 mysql 导入 ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password: YES)
如果出现了这种错误，那就先查一下是否有这个用户，没有的话就创建
CREATE USER  'user_name'@'host'  IDENTIFIED BY  'password';
flush privileges;
有的话就刷新权限就行了
flush privileges;
4.2 ERROR 3546 (HY000) at line 24: @@GLOBAL.GTID_PURGED cannot be changed: the added gtid set must not overlap with @@GLOBAL.GTID_EXECUTED
不用管，备份结束后GTID就是最新的了，这也就能解决我们之前失败的几十个GTID的问题了，备份的目的就是为了去覆盖GTID
4.3 ERROR 1305 (42000) at line 4596: FUNCTION db_name.getshl does not exist
如果有视图和函数的话，视图中又涉及到了函数，那么备份的时候忽略错误也是不行的，可以通过navicate先将函数或者视图给备份一下
操作：DB(主) -> 选择一个函数进行复制 -> DB(从) -> 粘贴到函数下，会跳出来一个弹框，你可以勾选你想要复制过来的所有表、视图或函数
注:我只是复制了所有的视图和函数，表还是通过命令来执行的，因为我不清楚把表全部拷贝过去，GTID是否也会更新成功
5.等待更新
更新完成后，查看数据库的表和数据是否都成功了
6.解决主库
# 解锁
unlock tables;
# 查看主库状态 获取binlog文件和pos位置
show master status;
7.回到从库
# 重新设置同步 master_log_file和master_log_pos 就是第6步查到的binlog文件和pos位置
change master to master_log_file='binlog.000013',master_log_pos=5056,master_host='主masterIP',master_user='用户名',master_password='密码',master_port=3306;
# 开启从库
start slave;
# 查看状态
show slave status\G
# 查看关键状态 都是YES了 -> 到这里感觉都成功了
Slave_IO_Running: Yes
Slave_SQL_Running: Yes
# 测试 主库中随意修改一条数据,然后看从库中的数据是否同步更新了
这一步操作完成无误后,从库备份完成
```

### 2.4 批量执行跳过的脚本(`未实际测试、未实际测试`)

```shell
#!/bin/bash
USER=
PWD=""
HOST=
PORT=3306
REP=
REPPWD=""
REPH=
REPP=3306
GTID=$2
GTID_START=$3
GTID_END=$4
GTID_PURGE(){
echo "GTID_UUID:$GTID, GTID_START:$GTID_START, GTID_END=%GTID_END"
mysql -u$USER -p$PWD -h$HOST -P$PORT -e "stop slave;reset slave;reset master;set global gtid_purged='$GTID:$GTID_START-$GTID_END';CHANGE MASTER TO MASTER_HOST='$REPH', MASTER_PORT=$REPP, MASTER_USER='$REP',MASTER_PASSWORD='$REPPWD', master_auto_position=1;start slave;"
sleep 1
mysql -u$USER -p$PWD -h$HOST -P$PORT -e "show slave status\G;"
}
GTID_SKIP(){
mysql -u$USER -p$PWD -h$HOST -P$PORT -e "stop slave;set session gtid_next='$GTID:$GTID_START';begin;commit;set session gtid_next="AUTOMATIC";start slave;"
}

case "$1" in
GTID_PURGE)
echo "Start GTID_PURGE, transaction in $GTID between $GTID_START-$GTID_END will be skipped......"
GTID_PURGE
echo "GTID_PURGE success......"
;;
GTID_SKIP)
echo "Start GTID_SKIP, transaction $GTID:$GTID_START will be skipped......"
GTID_SKIP
echo "GTID_SKIP success......"
;;
*)
echo $"Usage: $0 {GTID_PURGE args1 args2 args3|GTID_SKIP args1 args2}"
exit 1
;;
esac
```

