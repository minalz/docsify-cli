# Kafka学习之Kafka选举机制简述

本文完全引用链接地址:https://www.cnblogs.com/jing99/p/13870593.html

　　Kafka是一个高性能，高容错，多副本，可复制的分布式消息系统。在整个系统中，涉及到多处选举机制，被不少人搞混，这里总结一下，本篇文章大概会从三个方面来讲解。

# 1、控制器（Broker）选举

　　所谓控制器就是一个Borker，在一个kafka集群中，有多个broker节点，但是它们之间需要选举出一个leader，其他的broker充当follower角色。集群中第一个启动的broker会通过在zookeeper中创建临时节点/controller来让自己成为控制器，其他broker启动时也会在zookeeper中创建临时节点，但是发现节点已经存在，所以它们会收到一个异常，意识到控制器已经存在，那么就会在zookeeper中创建watch对象，便于它们收到控制器变更的通知。

　　那么如果控制器由于网络原因与zookeeper断开连接或者异常退出，那么其他broker通过watch收到控制器变更的通知，就会去尝试创建临时节点/controller，如果有一个broker创建成功，那么其他broker就会收到创建异常通知，也就意味着集群中已经有了控制器，其他broker只需创建watch对象即可。

　　如果集群中有一个broker发生异常退出了，那么控制器就会检查这个broker是否有分区的副本leader，如果有那么这个分区就需要一个新的leader，此时控制器就会去遍历其他副本，决定哪一个成为新的leader，同时更新分区的ISR集合。

　　如果有一个broker加入集群中，那么控制器就会通过Broker ID去判断新加入的broker中是否含有现有分区的副本，如果有，就会从分区副本中去同步数据。

　　集群中每选举一次控制器，就会通过zookeeper创建一个controller epoch，每一个选举都会创建一个更大，包含最新信息的epoch，如果有broker收到比这个epoch旧的数据，就会忽略它们，kafka也通过这个epoch来防止集群产生“脑裂”。

## 2、分区副本选举机制

在kafka的集群中，会存在着多个主题topic，在每一个topic中，又被划分为多个partition，为了防止数据不丢失，每一个partition又有多个副本，在整个集群中，总共有三种副本角色：

leader副本：也就是leader主副本，每个分区都有一个leader副本，为了保证数据一致性，所有的生产者与消费者的请求都会经过该副本来处理。
follower副本：除了首领副本外的其他所有副本都是follower副本，follower副本不处理来自客户端的任何请求，只负责从leader副本同步数据，保证与首领保持一致。如果leader副本发生崩溃，就会从这其中选举出一个leader。
优先副本：创建分区时指定的优先leader。如果不指定，则为分区的第一个副本。
　　follower需要从leader中同步数据，但是由于网络或者其他原因，导致数据阻塞，出现不一致的情况，为了避免这种情况，follower会向leader发送请求信息，这些请求信息中包含了follower需要数据的偏移量offset，而且这些offset是有序的。

　　如果有follower向leader发送了请求1，接着发送请求2，请求3，那么再发送请求4，这时就意味着follower已经同步了前三条数据，否则不会发送请求4。leader通过跟踪 每一个follower的offset来判断它们的复制进度。

　　默认的，如果follower与leader之间超过10s内没有发送请求，或者说没有收到请求数据，此时该follower就会被认为“不同步副本”。而持续请求的副本就是“同步副本”，当leader发生故障时，只有“同步副本”才可以被选举为leader。其中的请求超时时间可以通过参数replica.lag.time.max.ms参数来配置。

　　我们希望每个分区的leader可以分布到不同的broker中，尽可能的达到负载均衡，所以会有一个优先leader，如果我们设置参数auto.leader.rebalance.enable为true，那么它会检查优先leader是否是真正的leader，如果不是，则会触发选举，让优先leader成为leader。

### 3、消费组选主

　　在kafka的消费端，会有一个消费者协调器以及消费组，组协调器GroupCoordinator需要为消费组内的消费者选举出一个消费组的leader，那么如何选举的呢？

如果消费组内还没有leader，那么第一个加入消费组的消费者即为消费组的leader，如果某一个时刻leader消费者由于某些原因退出了消费组，那么就会重新选举leader，如何选举？

```scala
private val members = new mutable.HashMap[String, MemberMetadata]
leaderId = members.keys.headOption
```
　　上面代码是kafka源码中的部分代码，member是一个hashmap的数据结构，key为消费者的member_id，value是元数据信息，那么它会将leaderId选举为Hashmap中的第一个键值对，它和随机基本没啥区别。