# Stream API

### 1. 执行流程

主要步骤有三个：

①创建Stream

②中间操作：未终止前，不进行任何操作，是`懒加载`的

③终止操作(终端操作)

```java
/**
 * 创建Stream有四种方式
 * 注意：如果不执行终止操作，那么中间操作无论执行多少步，都是不执行的，即懒加载
 */
@Test
public void test1(){
    // 1.通过Collection系列集合提供的stream() 或 parallelStream()
    ArrayList<String> list = new ArrayList<>();
    Stream<String> stream1 = list.stream();

    // 2.通过Arrays中的静态方法stream()获取数组流
    String[] strings = new String[10];
    Stream<String> stream2 = Arrays.stream(strings);

    // 3.通过Stream类中的静态方法of()
    Stream<String> stream3 = Stream.of("aaa", "bbb", "ccc");

    // 4.创建无限流 -- 有两种方式
    // 迭代: iterate
    Stream<Integer> stream4 = Stream.iterate(0, (x) -> x + 2);
    stream4.forEach(System.out::println);
    // 产生: generate
    Stream<Double> stream5 = Stream.generate(() -> Math.random());
    stream5.forEach(System.out::println);
}
```

