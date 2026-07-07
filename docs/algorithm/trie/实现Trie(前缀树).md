# 🌲 实现 Trie（前缀树）

> 📝 LeetCode 208. 实现 Trie（前缀树）| 树形数据结构 | 字符串检索

---

## 📖 题目描述

请你实现 Trie（前缀树）数据结构，支持插入、搜索前缀、搜索单词操作。

---

## 💡 解题思路

- 每个节点包含 26 个子节点（对应 26 个字母）
- `isEnd` 标记是否是一个完整单词的结尾
- `insert`：逐字符插入，不存在则创建新节点
- `search`：逐字符查找，最后判断 `isEnd`
- `startsWith`：逐字符查找前缀即可

---

## 🔧 代码实现

```java
/**
 * @description: 208. 实现 Trie（前缀树）
 * @author: minalz
 * @date: 2021-06-01 00:13
 **/
public class Trie {

    private Trie[] children;
    private boolean isEnd;

    public Trie() {
        children = new Trie[26];
        isEnd = false;
    }

    public void insert(String word) {
        Trie node = this;
        for (int i = 0; i < word.length(); i++) {
            char ch = word.charAt(i);
            int index = ch - 'a';
            if (node.children[index] == null) {
                node.children[index] = new Trie();
            }
            node = node.children[index];
        }
        node.isEnd = true;
    }

    public boolean search(String word) {
        Trie node = searchPrefix(word);
        return node != null && node.isEnd;
    }

    public boolean startsWith(String prefix) {
        return searchPrefix(prefix) != null;
    }

    private Trie searchPrefix(String prefix) {
        Trie node = this;
        for (int i = 0; i < prefix.length(); i++) {
            char ch = prefix.charAt(i);
            int index = ch - 'a';
            if (node.children[index] == null) {
                return null;
            }
            node = node.children[index];
        }
        return node;
    }
}

```