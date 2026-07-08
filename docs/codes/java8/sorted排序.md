# 🔄 Stream Sorted 排序

> 💡 Java8 Stream排序处理null值的方法

---

## 📖 创建排序字段带null的List

```java
Student User{
private String name;
private int age;
}

List<User> list = Lists.newArrayList(new User("xiao_ming", 21), new User("xiao_hua", 22), new User(null, 23));
```



## 🔹 Comparator.nullsFirst/Comparator.nullsLast使用示例

```java
List<User> nList = list.stream().sorted(
    Comparator.comparing(User::getName, Comparator.nullsFirst(String::compareTo)))
    .collect(Collectors.toList());
```



## 🔹 类型说明

| 方法                  | 描述                                       |
| --------------------- | ------------------------------------------ |
| Comparator.nullsFirst | 排序字段为null的对象放在排序后的List最后面 |
| Comparator.nullsLast  | 排序字段为null的对象放在排序后的List最前面 |

