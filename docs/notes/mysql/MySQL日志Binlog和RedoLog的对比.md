# 📋 MySQL Binlog 与 Redo Log 详解

> 💡 MySQL 核心日志机制深度对比 | Binlog（二进制日志） vs Redo Log（重做日志）

## 📑 目录

- [一、核心对比](#一核心对比)
- [二、分别存了什么](#二分别存了什么)
- [三、各自的作用](#三各自的作用)
- [四、为什么需要两个日志](#四为什么需要两个日志)
- [五、相关配置参数](#五相关配置参数)

---

## 📊 一、核心对比

| 维度 | **Redo Log（重做日志）** | **Binlog（二进制日志）** |
|:---:|:---:|:---:|
| **所属层级** | 存储引擎层（InnoDB 特有） | Server 层（MySQL 通用） |
| **日志类型** | **物理日志** | **逻辑日志** |
| **记录内容** | "在数据页 X 的偏移 Y 处修改了 Z" | "UPDATE t SET a=1 WHERE id=2" 或行前后镜像 |
| **写入方式** | 循环写（固定大小，会覆盖） | 追加写（不会覆盖，可保留历史） |
| **空间管理** | 固定大小（`innodb_log_file_size` × 文件数） | 无上限，可配置过期策略 |
| **主要作用** | **崩溃恢复**（Crash Recovery） | **主从复制** + **数据恢复** |

---

## 📦 二、分别存了什么

### 🔴 Redo Log

```
记录格式（物理）：
- 表空间ID + 页号 + 页内偏移量 + 修改的数据内容 + 事务ID
```

> **举例**：把 `id=1` 的行的 `name` 从 "A" 改成 "B"
> - Redo Log 记录的是：**"在表空间 5 的第 1024 号数据页，偏移 128 处，写入 'B'"**

### 🔵 Binlog

```
记录格式（逻辑）：
- 事件类型（Query / Table_map / Write_rows / Update_rows / Delete_rows / Xid）
- 执行的 SQL 语句 或 行的变更前后值（Row 格式）
```

> **举例**：同样的 UPDATE 操作
> - **Statement 格式**：`UPDATE user SET name='B' WHERE id=1`
> - **Row 格式**：`id=1` 这行的 `name` 从 `"A"` 变为 `"B"`（前后镜像）

---

## 🎯 三、各自的作用

### 🔴 Redo Log 的作用

1. **崩溃恢复**：MySQL 异常重启后，用 Redo Log 把未持久化到磁盘的数据页修改重新执行一遍
2. **保证持久性（D）**：事务提交时只需保证 Redo Log 刷盘，数据页可以异步刷盘（WAL 机制）
3. **提升性能**：避免每次事务提交都随机写磁盘数据页，改为顺序写 Redo Log

### 🔵 Binlog 的作用

1. **主从复制**：Slave 读取 Master 的 Binlog 重放，实现数据同步
2. **数据恢复**：基于时间点（PITR）恢复误删数据
3. **审计 / CDC**：分析数据变更、同步到大数据平台（如 Canal、Flink CDC）

---

## 🤔 四、为什么需要两个日志？

| 场景 | 只用 Redo Log | 只用 Binlog |
|:---|:---|:---|
| 崩溃恢复 | ✅ 可以 | ❌ 不行（Binlog 是逻辑日志，恢复太慢） |
| 主从复制 | ❌ 不行（Redo Log 是物理的，跨实例不通用） | ✅ 可以 |
| 数据恢复 | ❌ 不行（循环覆盖，无历史） | ✅ 可以 |

**两者缺一不可**，所以 MySQL 用 **两阶段提交（2PC）** 来保证它们的一致性：

```text
1. 准备阶段：写入 Redo Log（状态：prepare）
2. 提交阶段：写入 Binlog
3. 写入 Redo Log（状态：commit）
```

这样即使中途崩溃，也能根据 Binlog 是否写入来判断事务是否真正提交。

---

## ⚙️ 五、相关配置参数

```ini
# Redo Log
innodb_log_file_size = 512M      # 单个 redo log 文件大小
innodb_log_files_in_group = 2    # redo log 文件个数
innodb_flush_log_at_trx_commit = 1  # 每次事务提交都刷盘（0/1/2）

# Binlog
log_bin = /var/lib/mysql/mysql-bin  # 开启 binlog
binlog_format = ROW                 # 格式：STATEMENT / ROW / MIXED
expire_logs_days = 7                # 自动清理 7 天前的 binlog
sync_binlog = 1                     # 每次事务提交都刷盘
```

---

> 记录时间：2026-07-25
