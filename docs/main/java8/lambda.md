# Lambda

### 1. 语法格式

```java
    /**
     * Lambda表达式中所需执行的功能，即Lambda体
     * 有六种语法格式：
     *      一：无参数，无返回值
     *          () -> System.out.println("Hello World");
     *      二：有一个参数，并且没有返回值
     *          (x) -> System.out.println(x);
     *      三：若只有一个参数，小括号可以省略不写
     *          x -> System.out.println(x);
     *      四：有两个以上的参数，有返回值，并且Lambda体中有多条语句，用{}括起来
     *          Comparator<Integer> com = (x, y) -> {
     *             System.out.println("有两个以上的参数，有返回值，并且Lambda体中有多条语句，用{}括起来");
     *             return x.compareTo(y);
     *         };
     *      五：若Lambda体中只有一条语句，return和{}都可以省略不写
     *          (x, y) -> x.compareTo(y);
     *      六：Lambda表达式的参数列表的数据类型可以省略不写，因为JVM编译器通过上下文推断出，数据类型，即"数据推断"
     *          (Integer x, Integer y) -> x.compareTo(y);
     *
     */
    @Test
    public void test2(){
        // 1.无参数，无返回值
        Runnable hello_world = () -> System.out.println("Hello World");

        // 2.有一个参数，并且没有返回值
        Consumer<String> consumer = (x) -> System.out.println(x);
        consumer.accept("有一个参数，并且没有返回值");

        // 3.若只有一个参数，小括号可以省略不写
        Consumer<String> consumer1 = x -> System.out.println(x);
        consumer.accept("若只有一个参数，小括号可以省略不写");

        // 4.有两个以上的参数，有返回值，并且Lambda体中有多条语句，用{}括起来
        Comparator<Integer> com = (x, y) -> {
            System.out.println("有两个以上的参数，有返回值，并且Lambda体中有多条语句，用{}括起来");
//            return Integer.compare(x, y);
            return x.compareTo(y);
        };

        // 5.若Lambda体中只有一条语句，return和{}都可以省略不写
        Comparator<Integer> com1 = (x, y) -> x.compareTo(y);

        // 6.Lambda表达式的参数列表的数据类型可以省略不写，因为JVM编译器通过上下文推断出，数据类型，即"数据推断"
        Comparator<Integer> com2 = (Integer x, Integer y) -> x.compareTo(y);
    }
```

### 2.方法引用和构造器引用

```java
/**
     * 方法引用：若Lambda体中的内容有方法已经实现了，那么可以使用"方法引用"
     * 三种格式：
     *     对象：实例方法名 instance::method
     *       类：静态方法名 ClassName:mthod
     *       类：实力方法名 ClassName::static_method
     * 注意：
     *   1.Lambda体中调用方法的参数列表和返回值类型，要与函数式接口中抽象方法的参数列表和返回值类型相同
     *   2.若Lambda参数列表中的第一参数是实例方法的调用者，而第二个参数是实例方法的参数时，可以使用ClassName::method进行调用
     */
public class Car {
    //Supplier是jdk1.8的接口，这里和Lambda一起使用了
    public static Car create(final Supplier<Car> supplier) {
        return supplier.get();
    }
 
    public static void collide(final Car car) {
        System.out.println("Collided " + car.toString());
    }
 
    public void follow(final Car another) {
        System.out.println("Following the " + another.toString());
    }
 
    public void repair() {
        System.out.println("Repaired " + this.toString());
    }

    public static void main(String[] args) {
        
        // 静态方法引用：它的语法是Class::static_method，实例如下：
        cars.forEach(Car::collide);

        // 特定类的任意对象的方法引用：它的语法是Class::method实例如下：
        cars.forEach(Car::repair);

        // 特定对象的方法引用：它的语法是instance::method实例如下：
        Car instance = Car.create(Car::new);
        cars.forEach(instance::follow);
    }
}
```

### 3. 构造器引用

```java
/**
     * 构造器引用：
     *     格式：ClassName:new
     */
 public static void main(String[] args) {
        // 构造器引用：它的语法是Class::new，或者更一般的Class< T >::new实例如下：
        Car car = Car.create(Car::new);
        List<Car> cars = Arrays.asList(car);
 }
```

### 4. 数组引用

```java
/**
 * 数组引用：
 *     格式：Type[]::new
 */
@Test
public void test(){
    Function<Integer,String[]> fun = (x) -> new String[x];
    String[] strs = fun.apply(10);
    System.out.println(strs.length);

    Function<Integer,String[]> fun1 = String[]::new;
    String[] strs1 = fun1.apply(20);
    System.out.println(strs1.length);
}
```

