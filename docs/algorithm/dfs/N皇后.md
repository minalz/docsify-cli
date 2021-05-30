```java
/**
 * @description: 51.N 皇后
 * @author: minalz
 * @date: 2021-05-31 00:36
 **/
public class NQueenDemo {

    public List<List<String>> solveNQueens(int n) {
        List<List<String>> results = new ArrayList<>();
        if (n < 0) {
            return results;
        }
        List<Integer> cols = new ArrayList<>();
        search(results, cols, n);
        return results;
    }

    public void search(List<List<String>> results, List<Integer> cols, int n) {
        if (cols.size() == n) {
            results.add(drawChessboard(cols));
            return;
        }
        for (int colIndex = 0; colIndex < n; colIndex++) {
            if (!isValid(cols, colIndex)) {
                continue;
            }
            cols.add(colIndex);
            search(results, cols, n);
            cols.remove(cols.size() - 1);
        }
    }

    private boolean isValid(List<Integer> cols, int column) {
        int row = cols.size();
        for (int rowIndex = 0; rowIndex < cols.size(); rowIndex++) {
            // 同一竖线
            if (cols.get(rowIndex) == column) {
                return false;
            }
            // 左到右斜线
            if (rowIndex - cols.get(rowIndex) == row - column) {
                return false;
            }
            // 右到左斜线
            if (rowIndex + cols.get(rowIndex) == row + column) {
                return false;
            }
        }
        return true;
    }

    public List<String> drawChessboard(List<Integer> cols) {
        List<String> chessboard = new ArrayList<>();
        for (int i = 0; i < cols.size(); i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < cols.size(); j++) {
                sb.append(j == cols.get(i) ? 'Q' : '.');
            }
            chessboard.add(sb.toString());
        }
        return chessboard;
    }

    @Test
    public void test01() {
        List<List<String>> chessboard = solveNQueens(4);
        chessboard.forEach(x -> {
            x.forEach(y -> {
                System.out.println(y + "");
            });
            System.out.println();
        });
    }
}

```