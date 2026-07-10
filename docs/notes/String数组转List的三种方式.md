# 🔀 String 数组转 List 的三种方式

> 💡 Java 集合转换 | 数组操作 | 最佳实践

---

## 🔧 一、通过 Arrays.asList() 方法

> ⚠️ **注意**：数组转成 list 后，**不能对 list 进行增删**，只能查改，否则会抛异常。

```java
@Test
public void test1(){
    String[] arr = {"0","1","2"};
    List<String> list = Arrays.asList(arr);
    // 对转换后的 list 插入一条数据
    list.add("aa");
    System.out.println(list);
}
```

会在 `add` 操作时报异常：`java.lang.UnsupportedOperationException`

---

## 🔧 二、通过 ArrayList 的构造器（✅ 推荐）

**支持增删改查**

```java
@Test
public void test2(){
    String[] arr = {"0","1","2"};
    ArrayList<String> list = new ArrayList<>(Arrays.asList(arr));
    // 对转换后的 list 插入一条数据
    list.add("aa");
    System.out.println(list);
}
```

执行成功，结果为：`[0, 1, 2, aa]`

---

## 🔧 三、通过集合工具类 Collections.addAll()

**支持增删改查，如果数据量大，效率高**

```java
@Test
public void test3(){
    String[] arr = {"0","1","2"};
    ArrayList<String> list = new ArrayList<>(arr.length);
    Collections.addAll(list, arr);
    // 对转换后的 list 插入一条数据
    list.add("aa");
    System.out.println(list);
}
```

执行成功，结果为：`[0, 1, 2, aa]`