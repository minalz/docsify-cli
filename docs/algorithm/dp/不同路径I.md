# 🛤️ 不同路径 I

> 📝 LeetCode 62. 不同路径 | 动态规划 | 网格遍历

---

## 📖 题目描述

一个机器人位于 `m x n` 网格的左上角。机器人每次只能向下或向右移动一步，试图到达网格的右下角。问总共有多少条不同的路径。

---

## 💡 解题思路

- 使用动态规划，`dp[i][j]` 表示到达位置 `(i, j)` 的路径数
- 状态转移方程：`dp[i][j] = dp[i-1][j] + dp[i][j-1]`
- 初始条件：第一行和第一列都只有 1 条路径

---

## 🔧 代码实现

```java
/**
 * @description: 62. 不同路径
 * @author: minalz
 * @date: 2021-06-05 19:00
 **/
public class UniquePaths {

    public int uniquePaths(int m, int n) {
        if (m == 0 || n == 0) {
            return 1;
        }
        int[][] path = new int[m][n];
        for (int i = 0; i < m; i++) {
            path[i][0] = 1;
        }
        for (int i = 0; i < n; i++) {
            path[0][i] = 1;
        }
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                path[i][j] = path[i - 1][j] + path[i][j - 1];
            }
        }
        return path[m - 1][n - 1];
    }
}

```