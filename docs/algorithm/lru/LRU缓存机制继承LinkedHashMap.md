# 🔗 LRU 缓存机制（继承 LinkedHashMap）

> 📝 LeetCode 146. LRU 缓存机制 | 继承 LinkedHashMap | 简捷实现

---

## 📖 题目描述

请你设计并实现一个满足 LRU（最近最少使用）缓存约束的数据结构。

---

## 💡 解题思路

- 直接继承 `LinkedHashMap`，利用其内置的 LRU 特性
- 设置 `accessOrder = true`，使元素按访问顺序排序
- 重写 `removeEldestEntry` 方法，在容量超出时自动移除最久未使用的元素

---

## 🔧 代码实现

```java
/**
 * @description: 146. LRU 缓存机制（继承 LinkedHashMap）
 * @author: minalz
 * @date: 2021-06-10 00:51
 **/
public class LRUCache1 extends LinkedHashMap<Integer, Integer> {

    private int capacity;

    public LRUCache1(int capacity) {
        super(capacity, 0.75F, true);
        this.capacity = capacity;
    }

    public int get(int key) {
        return super.getOrDefault(key, -1);
    }

    public void put(int key, int value) {
        super.put(key, value);
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        return size() > capacity;
    }
}

```