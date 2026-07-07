# 🛤️ 不同路径 II

> 📝 LeetCode 63. 不同路径 II | 动态规划 | 障碍物处理

---

## 📖 题目描述

一个机器人位于 `m x n` 网格的左上角。网格中有障碍物，`1` 表示障碍物，`0` 表示空格。机器人每次只能向下或向右移动一步，试图到达网格的右下角。问总共有多少条不同的路径。

---

## 💡 解题思路

- 在「不同路径 I」的基础上增加障碍物判断
- 遇到障碍物时，`dp[i][j] = 0`
- 注意初始行和初始列遇到障碍物时，后续格子都不可达

---

## 🔧 代码实现

```java
/**
 * @description: 63. 不同路径 II（带有障碍物）
 * @author: minalz
 * @date: 2021-06-05 19:02
 **/
public class UniquePathsWithObstacles {

    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        if (obstacleGrid == null || obstacleGrid.length == 0) {
            return 1;
        }
        if (obstacleGrid[0] == null || obstacleGrid[0].length == 0) {
            return 1;
        }
        int m = obstacleGrid.length;
        int n = obstacleGrid[0].length;
        int[][] result = new int[m][n];
        for (int i = 0; i < m; i++) {
            if (obstacleGrid[i][0] != 1) {
                result[i][0] = 1;
            } else {
                break;
            }
        }
        for (int i = 0; i < n; i++) {
            if (obstacleGrid[0][i] != 1) {
                result[0][i] = 1;
            } else {
                break;
            }
        }
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                if (obstacleGrid[i][j] == 1) {
                    result[i][j] = 0;
                } else {
                    result[i][j] = result[i - 1][j] + result[i][j - 1];
                }
            }
        }
        return result[m - 1][n - 1];
    }
}

```