# 🎨 PgVector 架构

> 🔄 PgVector 分片 + 读写分离架构可视化

---

## 🖼️ PgVector 分片读写分离架构图

```mermaid
flowchart TB
    subgraph APP["应用层 (Spring Boot)"]
        direction LR
        A1["分片路由"]
        A2["读写分离判断"]
        A3["结果聚合"]
    end

    subgraph PB1["PgBouncer (读写分离代理)"]
        direction LR
        PB1M["主: master"]
        PB1S["从: slave1, slave2"]
    end

    subgraph PB2["PgBouncer (读写分离代理)"]
        direction LR
        PB2M["主: master"]
        PB2S["从: slave1, slave2"]
    end

    subgraph S0["Shard 0"]
        direction LR
        S0P["主库"] --> |"流复制(同步/异步)"| S0R1["从1"]
        S0P --> |"流复制(同步/异步)"| S0R2["从2"]
    end

    subgraph S1["Shard 1"]
        direction LR
        S1P["主库"] --> |"流复制(同步/异步)"| S1R1["从1"]
        S1P --> |"流复制(同步/异步)"| S1R2["从2"]
    end

    APP --> PB1
    APP --> PB2
    PB1 --> S0
    PB2 --> S1
```

---

## 📝 说明

> 💡 展示 PgVector 基于分片(Shard) + 读写分离(PgBouncer)的高可用向量检索架构。应用层负责分片路由与读写分离判断，每个 PgBouncer 代理对应一个 Shard，每个 Shard 内主库通过流复制(同步/异步)同步到从库。
