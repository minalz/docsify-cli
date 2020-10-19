## 校验值为Double型

```java
/**
 * 判断值是否是Double类型
 * @param val 需要校验的值
 * @return
 */
public boolean verifyDouble(String val){
    String regex = "([+\\-]?[0-9]+[.]?[\\d]*)";
    Pattern NUMBER_PATTERN = Pattern.compile(regex);
    boolean matches = NUMBER_PATTERN.matcher(val).matches();
    return matches;
}
```

测试：

```java
public static void main(String[] args) {
    System.out.println(verifyDouble("+2.22"));
    System.out.println(verifyDouble("-2.22"));
    System.out.println(verifyDouble("2.22d"));
    System.out.println(verifyDouble("2"));
    System.out.println(verifyDouble("aa"));
}

true
true
false
true
false
```

## 校验值为整型

```java
/**
 * 判断值是否为整数类型（Integer：整数）
 * @param val
 * @return
 */
public static boolean verifyInteger(String val){
    String regex = "^[+\-]?[1-9]\d*$";
    Pattern INTEGER_PATTERN = Pattern.compile(regex);
    boolean matches = INTEGER_PATTERN.matcher(val).matches();
    return matches;
}
```

测试：

```java
public static void main(String[] args) {
    System.out.println(verifyInteger("+2"));
    System.out.println(verifyInteger("-2"));
    System.out.println(verifyInteger("2d"));
    System.out.println(verifyInteger("2"));
    System.out.println(verifyInteger("aa"));
}

true
true
false
true
false
```