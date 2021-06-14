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