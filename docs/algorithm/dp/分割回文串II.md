```java
/**
 * @description: 132.分割回文串 II
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