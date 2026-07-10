# 🔍 校验值为什么类型的

> 💡 Java 数据类型校验 | 正则表达式 | Double 和 Integer 类型验证

---

## 🔢 一、校验值为 Double 型

### 1️⃣ 校验方法

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

### 2️⃣ 测试代码

```java
public static void main(String[] args) {
    System.out.println(verifyDouble("+2.22"));
    System.out.println(verifyDouble("-2.22"));
    System.out.println(verifyDouble("2.22d"));
    System.out.println(verifyDouble("2"));
    System.out.println(verifyDouble("aa"));
}
```

### 3️⃣ 测试结果

```
true
true
false
true
false
```

---

## 🔢 二、校验值为整型

### 1️⃣ 校验方法

```java
/**
 * 判断值是否为整数类型（Integer：整数）
 * @param val
 * @return
 */
public static boolean verifyInteger(String val){
    String regex = "^[+\\-]?[0-9]\\d*$";
    Pattern INTEGER_PATTERN = Pattern.compile(regex);
    boolean matches = INTEGER_PATTERN.matcher(val).matches();
    return matches;
}
```

### 2️⃣ 测试代码

```java
public static void main(String[] args) {
    System.out.println(verifyInteger("+2"));
    System.out.println(verifyInteger("-2"));
    System.out.println(verifyInteger("2d"));
    System.out.println(verifyInteger("2"));
    System.out.println(verifyInteger("aa"));
}
```

### 3️⃣ 测试结果

```
true
true
false
true
false
```