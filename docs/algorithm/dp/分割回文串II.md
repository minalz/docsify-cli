# ✂️ 分割回文串 II

> 📝 LeetCode 132. 分割回文串 II | 动态规划 | 回文判断

---

## 📖 题目描述

给定一个字符串 `s`，将 `s` 分割成一些子串，使每个子串都是回文串。返回符合要求的最少分割次数。

---

## 💡 解题思路

- 使用双 DP：
  - `pali[i][j]` 判断子串 `s[i..j]` 是否为回文
  - `minCut[i]` 表示前 `i` 个字符的最少分割次数
- 状态转移：`minCut[i] = min(minCut[j] + 1)`，其中 `s[j..i-1]` 是回文

---

## 🔧 代码实现

```java
/**
 * @description: 132. 分割回文串 II
 * @author: minalz
 * @date: 2021-06-05 23:28
 **/
public class MinCut {

    public int minCut(String s) {
        if (s == null || s.length() == 0) {
            return 0;
        }
        int[] minCut = new int[s.length() + 1];
        for (int i = 0; i <= s.length(); i++) {
            minCut[i] = i - 1;
        }
        boolean[][] pali = new boolean[s.length()][s.length()];
        assignPali(pali, s);
        for (int i = 1; i <= s.length(); i++) {
            for (int j = 0; j < i; j++) {
                if (pali[j][i - 1]) {
                    minCut[i] = Math.min(minCut[j] + 1, minCut[i]);
                }
            }
        }
        return minCut[s.length()];
    }

    public void assignPali(boolean[][] pali, String s) {
        int length = s.length();
        for (int i = 0; i < length; i++) {
            pali[i][i] = true;
        }
        for (int i = 0; i < length - 1; i++) {
            pali[i][i + 1] = (s.charAt(i) == s.charAt(i + 1));
        }
        for (int i = 2; i < length; i++) {
            for (int j = 0; j + i < length; j++) {
                pali[j][i + j] = pali[j + 1][i + j - 1] && s.charAt(j) == s.charAt(i + j);
            }
        }
    }
}

```