# ➕ 和为 K 的子数组

> 📝 LeetCode 560. 和为 K 的子数组 | HashMap | 前缀和

---

## 📖 题目描述

给定一个整数数组和一个整数 `k`，你需要找到该数组中和为 `k` 的连续的子数组的个数。

---

## 💡 解题思路

- 使用前缀和 + HashMap
- 将数组转换为前缀和数组：`nums[i] += nums[i-1]`
- 使用 HashMap 存储前缀和出现的次数
- 如果 `nums[i] - k` 在 Map 中存在，说明存在和为 `k` 的子数组

---

## 🔧 代码实现

```java
/**
 * @description: 560. 和为 K 的子数组
 * 给定一个整数数组和一个整数 k，你需要找到该数组中和为 k 的连续的子数组的个数。
 * @author: minalz
 * @date: 2021-05-27 23:46
 **/
public class SubArraySum {

    public int subarraySum(int[] nums, int k) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        Map<Integer,Integer> map = new HashMap<>();
        for (int i = 1; i < nums.length; i++) {
            nums[i] += nums[i - 1];
        }
        int ans = 0;
        int temp = 0;
        map.put(0, 1);
        for (int i = 0; i < nums.length; i++) {
            int index = nums[i] - k;
            if (map.containsKey(index)) {
                ans += map.get(index);
            }
            temp = map.containsKey(nums[i]) ? map.get(nums[i]) + 1 : 1;
            map.put(nums[i] ,temp);
        }
        return ans;
    }

    @Test
    public void test01() {
        int[] nums = {1,2,3,1,3,2};
        int k = 3;
        System.out.println(subarraySum(nums, k));
    }
}

```