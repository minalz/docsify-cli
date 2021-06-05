```java
/**
 * @description: 62.不同路径
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