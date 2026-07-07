# 🔄 反转链表 II

> 📝 LeetCode 92. 反转链表 II | 链表操作 | 指定区间反转

---

## 📖 题目描述

给你单链表的头指针 `head` 和两个整数 `left` 和 `right`，请你反转从位置 `left` 到位置 `right` 的链表节点，返回反转后的链表。

---

## 💡 解题思路

- 使用虚拟头节点简化边界处理
- 找到第 `left-1` 个节点，作为反转段的前驱
- 对 `[left, right]` 区间内的节点进行反转
- 重新连接反转后的链表

---

## 🔧 代码实现

```java
public class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

public class ReverseLinkedList {
    public ListNode reverseBetween(ListNode head, int left, int right) {
        if (head == null || left >= right) {
            return head;
        }
        ListNode dummy = new ListNode(-1);
        dummy.next = head;
        head = dummy;
        for (int i = 1; i < left; i++) {
            head = head.next;
        }
        ListNode mNode = head.next;
        ListNode prevM = head;
        ListNode nNode = mNode;
        ListNode postN = nNode.next;
        for (int i = left; i < right; i++) {
            ListNode next = postN.next;
            postN.next = nNode;
            nNode = postN;
            postN = next;
        }
        mNode.next = postN;
        prevM.next = nNode;
        return dummy.next;
    }
}
```

