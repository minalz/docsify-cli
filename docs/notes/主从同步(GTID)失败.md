# 主从同步(GTID)失败

## 1.单个GTID出错

## 2.多个GTID出错

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
# 重新设置同步策略,但如果之前的gtid有问题,只要打开,就会重新回到错误日志的地方,同步又会失败了
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

### 2.3 批量执行跳过的脚本(`未实际测试、未实际测试`)

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

