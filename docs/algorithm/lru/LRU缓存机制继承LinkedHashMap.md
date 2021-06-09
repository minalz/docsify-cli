```java
/**
 * @description: 146. LRU 缓存机制 继承LinkedHashmap
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