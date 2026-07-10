# 🆔 全局唯一 ID 解决方案

> 💡 分布式系统中全局唯一 ID 生成策略 | 雪花算法 | Redis | Zookeeper

---

## 📚 常见解决方案

### 1️⃣ 雪花算法 (Snowflake)

分布式系统中经典的全局唯一 ID 生成算法。

### 2️⃣ MySQL 的 auto_increment 策略

利用 MySQL 自增主键生成唯一 ID。

### 3️⃣ Redis 的 INCR

使用 Redis 的原子递增操作生成唯一 ID。

### 4️⃣ Zookeeper 的单一节点修改版本号递增

利用 Zookeeper 节点的版本号递增特性。

### 5️⃣ Zookeeper 的持久顺序节点

使用 Zookeeper 持久顺序节点自动生成唯一序列号。

