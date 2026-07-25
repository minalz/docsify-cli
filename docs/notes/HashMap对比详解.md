# 🗺️ HashMap / ConcurrentHashMap / LinkedHashMap 详解

> 💡 Java 三大 Map 实现核心对比 | 线程安全 | 有序性 | 底层结构 | 使用场景

## 📑 目录

- [一、核心对比](#一核心对比)
- [二、一句话定位](#二一句话定位)
- [三、关键实现细节](#三关键实现细节)
- [四、使用场景速查](#四使用场景速查)
- [五、源码速记](#五源码速记)

---

## 📊 一、核心对比

| 维度 | **HashMap** | **ConcurrentHashMap** | **LinkedHashMap** |
|:---:|:---:|:---:|:---:|
| **线程安全** | ❌ 不安全 | ✅ 线程安全 | ❌ 不安全 |
| **底层结构** | 数组 + 链表 + 红黑树 | 数组 + 链表 + 红黑树 + **分段锁 / CAS** | 数组 + 链表 + 红黑树 + **双向链表** |
| **锁机制** | 无 | JDK7：分段锁（Segment）<br>JDK8：CAS + synchronized | 无 |
| **有序性** | ❌ 无序 | ❌ 无序 | ✅ **插入有序** 或 **访问有序**（可配置） |
| **null 支持** | key / value 均可为 null | key / value **均不可为 null** | key / value 均可为 null |
| **性能** | 单线程最快 | 并发场景最优 | 略慢于 HashMap（维护链表开销） |
| **迭代器** | fail-fast | 弱一致性（不抛 ConcurrentModificationException） | fail-fast |

---

## 💬 二、一句话定位

| 类 | 一句话定位 |
|:---|:---|
| **HashMap** | 单线程场景下的通用哈希表，无序，最快 |
| **ConcurrentHashMap** | 并发场景下的线程安全哈希表，分段 / CAS 细粒度锁 |
| **LinkedHashMap** | 需要**保持插入 / 访问顺序**的哈希表，如 LRU 缓存 |

---

## 🔍 三、关键实现细节

### 1️⃣ HashMap

```java
// JDK 8 底层：Node 数组 + 链表（长度 > 8 转红黑树）
// 默认容量 16，负载因子 0.75
// 扩容：2 倍扩容，rehash

HashMap<String, String> map = new HashMap<>();
map.put("key", "value");  // 允许 null key / null value
```

> **注意**：
> - 多线程下 `resize()` 可能导致死循环（JDK 7）或数据丢失（JDK 8）
> - 并发场景请用 `ConcurrentHashMap`，不要用 `Collections.synchronizedMap()`（粗粒度锁）

---

### 2️⃣ ConcurrentHashMap

```java
// JDK 7：分段锁（Segment 数组，每个 Segment 独立加 ReentrantLock）
// JDK 8：CAS + synchronized（锁粒度细化到桶级别，只锁链表头节点）
// 读操作基本无锁（volatile + CAS）

ConcurrentHashMap<String, String> map = new ConcurrentHashMap<>();
map.put("key", "value");  // 不允许 null key / null value（避免二义性）
```

> **为什么不允许 null？**
> - `map.get("key")` 返回 `null`，无法区分是 "key 不存在" 还是 "key 对应的 value 为 null"
> - 多线程下这种二义性会导致并发安全问题

---

### 3️⃣ LinkedHashMap

```java
// 继承自 HashMap，额外维护了一个双向链表
// accessOrder = false（默认）：插入有序
// accessOrder = true：访问有序（LRU）

LinkedHashMap<String, String> map = new LinkedHashMap<>(
    16,           // 初始容量
    0.75f,        // 负载因子
    true          // true = 访问有序（LRU），false = 插入有序
);
```

**实现 LRU 缓存**：

```java
class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;

    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;  // 超过容量时移除最久未访问的节点
    }
}
```

---

## 🎯 四、使用场景速查

| 场景 | 推荐选择 |
|:---|:---|
| 单线程，无序，追求性能 | `HashMap` |
| 多线程并发读写 | `ConcurrentHashMap` |
| 需要按插入顺序遍历 | `LinkedHashMap`（默认 `accessOrder=false`） |
| 实现 LRU 缓存 | `LinkedHashMap`（`accessOrder=true`） |
| 需要排序（自然 / 自定义） | `TreeMap` |
| 需要线程安全的有序 Map | `Collections.synchronizedMap(new LinkedHashMap<>())` 或 `ConcurrentSkipListMap` |

---

## 📝 五、源码速记

| 类 | 核心数据结构 |
|:---|:---|
| `HashMap` | `Node<K,V>[] table` |
| `ConcurrentHashMap` | `Node<K,V>[] table` + `volatile` + `CAS` + `synchronized` |
| `LinkedHashMap` | `HashMap` + `Entry<K,V> before, after` 双向链表 |

---

> 记录时间：2026-07-25
