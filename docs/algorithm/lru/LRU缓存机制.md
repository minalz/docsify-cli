```java
/**
 * @description: 146.LRU 缓存机制
 * @author: minalz
 * @date: 2021-06-09 22:57
 **/
public class LRUCache {

    class CacheNode {
        int key;
        int value;
        CacheNode prev;
        CacheNode next;
        public CacheNode() {}
        public CacheNode(int _key, int _value) {key = _key; value = _value;}
    }

    private Map<Integer, CacheNode> cache = new HashMap<Integer, CacheNode>();
    private int size;
    private int capacity;
    private CacheNode head, tail;

    public LRUCache(int capacity) {
        this.size = 0;
        this.capacity = capacity;
        // 使用伪头部和伪尾部节点
        head = new CacheNode();
        tail = new CacheNode();
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        CacheNode node = cache.get(key);
        if (node == null) {
            return -1;
        }
        // 如果 key 存在，先通过哈希表定位，再移到头部
        moveToHead(node);
        return node.value;
    }

    public void put(int key, int value) {
        CacheNode node = cache.get(key);
        if (node == null) {
            // 如果 key 不存在，创建一个新的节点
            CacheNode newNode = new CacheNode(key, value);
            // 添加进哈希表
            cache.put(key, newNode);
            // 添加至双向链表的头部
            addToHead(newNode);
            ++size;
            if (size > capacity) {
                // 如果超出容量，删除双向链表的尾部节点
                CacheNode tail = removeTail();
                // 删除哈希表中对应的项
                cache.remove(tail.key);
                --size;
            }
        } else {
            // 如果 key 存在，先通过哈希表定位，再修改 value，并移到头部
            node.value = value;
            moveToHead(node);
        }
    }

    private void addToHead(CacheNode node) {
        node.prev = head;
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
    }

    // 删除node的位置 并将node前后node 再关联起来
    private void removeNode(CacheNode node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    // 移动到头部的时候 这里是先做了一个删除的操作 又重新加了一遍
    // 这个方法是代表 之前的旧数据是存在的 节点改变后 之前的联系不能被破坏 要进行修复
    private void moveToHead(CacheNode node) {
        removeNode(node);
        addToHead(node);
    }

    private CacheNode removeTail() {
        CacheNode res = tail.prev;
        removeNode(res);
        return res;
    }
}

```