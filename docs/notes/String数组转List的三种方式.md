## 1.通过Arrays.asList()方法

数组转成list后，不能对list进行增删，只能查改，否则会抛异常

```java
@Test
public void test1(){
    String[] arr = {"0","1","2"};
    List<String> list = Arrays.asList(arr);
    // 对转换后的list插入一条数据
    list.add("aa");
    System.out.println(list);
}
```

会在add操作时报异常`java.lang.UnsupportedOperationException`

## 2.通过ArrayList的构造器

支持增删改查

```java
@Test
public void test2(){
    String[] arr = {"0","1","2"};
    ArrayList<String> list = new ArrayList<>(Arrays.asList(arr));
    // 对转换后的list插入一条数据
    list.add("aa");
    System.out.println(list);
}
```

执行成功，结果为`[0, 1, 2, aa]`

## 3.通过集合工具类Collections.addAll()

支持增删改查，如果数据量大，效率高

```java
@Test
public void test3(){
    String[] arr = {"0","1","2"};
    ArrayList<String> list = new ArrayList<>(arr.length);
    Collections.addAll(list, arr);
    // 对转换后的list插入一条数据
    list.add("aa");
    System.out.println(list);
}
```

执行成功，结果为`[0, 1, 2, aa]`