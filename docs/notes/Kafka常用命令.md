# Kafka常用命令

## 1.创建topic

```sh
sh kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic first
```

## 2.查看topic

```shell
# 查看所有的topic
sh kafka-topics.sh --list --zookeeper localhost:2181
# 查看指定的group
sh kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group group-800
```

## 3.查看topic属性

```shell
sh kafka-topics.sh --describe --zookeeper localhost:2181 --topic first
```

## 4.消费消息

如果是集群环境,必须输入IP,如果是单机,可以用localhost

```shell
sh kafka-console-consumer.sh --bootstrap-server 192.168.56.101:9092 --topic first --from-beginning
```

## 5.发送消息

如果是集群环境,必须输入IP,如果是单机,可以用localhost

```shell
sh kafka-console-producer.sh --broker-list 192.168.56.101:9092 --topic first
```

## 6.kafka查看topic数据消费情况

### 6.1 查询消费数据，必须要指定组。查看kafka组使用以下命令

```sh
./kafka-consumer-groups.sh --bootstrap-server 192.168.56.102:9092 --list
```

### 6.2 查看消费情况

```sh
./kafka-consumer-groups.sh --bootstrap-server 192.168.56.102:9092 --describe --group console-consumer-59293
```

### 6.3 字段解析

| `TOPIC`   | `PARTITION` | `CURRENT-OFFSET` | `LOG-END-OFFSET` | `LAG`        | `CONSUMER-ID` | `HOST` | `CLIENT-ID` |
| :-------- | :---------- | :--------------- | :--------------- | :----------- | :------------ | :----- | :---------- |
| topic名字 | 分区id      | 当前已消费的条数 | 总条数           | 未消费的条数 | 消费id        | 主机ip | 客户端id    |

