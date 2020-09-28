## 1.Java中的内存分配：

### 1.1目前有三大Java虚拟机：HotSpot，oracle JRockit，IBM J9。

JRockit是oracle发明的，用于其WebLogic服务器，IBM JVM是IBM发明的用于其Websphere服务器（所以在某行开发的时候，他们用的是IBM的JDK，因为他们使用的IBM的应用程序服务器Websphere，使用其他JDK可能存在兼容性问题）。JRockit和J9不存在永久代这种说法。这里只讨论HotSpot虚拟机，这也是目前使用的最多的JVM。Sun JDK7 HotSpot虚拟机的内存模型如下图所示：

![image-20200928135810574](images2\image-20200928135810574.png)

### 1.2堆内存图解：

![image-20200928135830369](images2\image-20200928135830369.png)

### 1.3 JVM把内存划分成5片区域：

`栈内存`：栈内存主要是用来运行函数的，在函数中定义的所有变量，都会在这个内存开辟空间。
在栈内存中定义的变量，不初始化，是不能直接使用的。
`注意：所有的函数都必须在栈内存中运行。`
`而jvm只会运行处于栈内存顶部的函数。`
`函数被加载到栈内存的动作，称为函数的压栈（入栈）。`
`函数执行完之后就会从栈中消失（函数的弹栈，或者叫做出栈）`
`堆内存`：在程序中使用new 关键字创建出来的所有东西，都会保存在堆内存中。
堆内存中开辟的空间，不赋值，都会有默认的初始化数据。
整数：默认是0
小数 默认0.0.
boolean 默认是false
char 默认是 ‘\u0000’   在内存中表示空字符
`方法区`：JVM在加载class文件的时候，所有的class文件就要加载在这个内存中。(先了解，后面会详细讲解)

`本地方法区`：主要是保存native关键字标注的方法,简单地讲，一个Native Method就是一个java调用非java代码的接口。一个Native Method是这样一个java的方法：该方法的实现由非java语言实现，比如C。native关键字说明其修饰的方法是一个原生态方法，方法对应的实现不是在当前文件，而是在用其他语言（如C和C++）实现的文件中。Java语言本身不能对操作系统底层进行访问和操作，但是可以通过JNI接口调用其他语言来实现对底层的访问。

`寄存器`：也叫程序计数器,是给CPU使用的。JVM支持多个线程同时运行，每个线程都有自己的程序计数器。倘若当前执行的是 JVM 的方法，则该寄存器中保存当前执行指令的地址；倘若执行的是native 方法，则PC寄存器中为空。

## 2.函数的内存加载：

### 2.1示例代码：

```java
class Demo {

	public static void main(String[] args) {
		int x = add(3,7);
		System.out.println("x:"+x);
	}
	
	public static int add(int a, int b){
		int sum = a + b;
		return sum;
	}

}
```

### 2.2如下编译：

![image-20200928140013168](images2\image-20200928140013168.png)

### 2.3加载顺序：

![image-20200928140023681](images2\image-20200928140023681.png)

## 3.数组内存图解:

### 3.1 示例代码：

```java
class Demo {

	public static void main(String[] args) {
		int[] arr = new int[6];
		arr[2] = 3;
		arr[4] = 4;
		double[] dou = new double[3];
		dou[1] = 3.14d;
		System.out.println("arr:"+arr);
		for (int i = 0; i <= arr.length-1; i++) {
			System.out.println("i--" + arr[i]);
		}
		System.out.println("=============华丽的分割线============");
		System.out.println("dou"+dou);
		for (int a = 0; a <= dou.length-1; a++) {
			System.out.println("a--" + dou[a]);
		}
	}
}
```
![image-20200928140119052](images2\image-20200928140119052.png)

编译后的运行结果：

![image-20200928140125444](images2\image-20200928140125444.png)

这里的数组返回的一串数是空间地址，16进制表示的.(蓝色框所选)

### 3.2.这里的空间地址是16进制，为什么是16进制？

解释：`对象实例名称+@+对象所在的内存地址`
源码分析：

![image-20200928140146957](images2\image-20200928140146957.png)

`System.out.println("arr:"+arr);其实就是等同于下句`
`System.out.println("arr:"+arr.toString());`

打印字符串的println：

```java
public void println(String x) {
    synchronized (this) {
        print(x);
        newLine();
    }
}
```



打印对象的println():

```java
public void println(Object x) {
    String s = String.valueOf(x);
    synchronized (this) {
        print(s);
        newLine();
    }
}
```

继续翻下去：

```java
public static String valueOf(Object obj) {
    return (obj == null) ? "null" : obj.toString();
}
```

这里调用了toString()的方法了：

```java
public String toString() {
    return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```

可以看到是获取哈希码的十六进制，返回的格式是：
`对象实例名称+@+对象所在的内存地址`
`所以@符号后的一串数字是十六进制数`

### 3.3内存分配分析：

![image-20200928140632269](images2\image-20200928140632269.png)

### 3.4数组中的异常：

#### 3.4.1数组角标异常：

![image-20200928140658510](images2\image-20200928140658510.png)

因为在堆内存中根本就没有分配第七个空间了

![image-20200928140705656](images2\image-20200928140705656.png)

#### 3.4.2数组的空指针异常：

![image-20200928140712499](images2\image-20200928140712499.png)

因为原本执行堆内存空间的地址被null给赋值了
如下图所示：

![image-20200928140718813](images2\image-20200928140718813.png)

![image-20200928140728311](images2\image-20200928140728311.png)

## 4.对象内存图解：

### 4.1示例代码:

`Demo.java`

```java
class Car {

	String driver = "张三";
	String carNo = "沪A32212";
	String name = "普桑";
	
	void work(){
		System.out.println("今天值班司机是:"+driver+"--车牌号:"+carNo+"--车型:"+name);
	}
	
}

class Demo {

	public static void main(String[] args) {
		Car car = new Car();
		car.name = "大众";
		car.carNo = "HU0001";
		car.driver = "李四";
		car.work();
	}
}
```



### 4.2给java类文件起名：

一个java类中可以写多个class，但是只能有一个public类，并且public修饰的class的名称必须和文件名相同，类的修饰符只有public，没有所谓的默认修饰符，如果没有public修饰，那么文件名可以随便起，否则报错：

![image-20200928140924289](images2\image-20200928140924289.png)

### 4.3为什么一个java源文件中只能有一个public类？

在java编程思想（第四版）一书中有这样3段话（6.4 类的访问权限，P121）:

1. 每个编译单元（文件）都只能有一个`public`类，这表示，每个编译单元都有单一的公共接口，用public类来表现。该接口可以按要求包含众多的支持包访问权限的类。如果在某个编译单元内有一个以上的public类，编译器就会给出错误信息。
2. `public`类的名称必须完全与含有该编译单元的文件名相同，包含大小写。如果不匹配，同样将得到编译错误。
3. 虽然不是很常用，但编译单元内完全不带`public`类也是可能的。在这种情况下，可以随意对文件命名。

### 4.4控制台编译：javac Demo.java 出现如下错误

#### 4.4.1解决方法：

```bash
javac -encoding UTF-8 Demo.java
```

#### 4.4.2为什么会乱码?：

通常我们手动建立一个`java`文件`Demo.java`，并保存。此时`Demo.java`文件的编码为`ANSI`，中文操作系统下就是GBK。然后使用javac命令来编译该源文件。`javac Demo.java`。`javac`也需要读取`java`文件，那么`javac`是使用什么编码来解码我们读取的字节呢？其实`javac`采用了操作系统默认的GBK编码解码我们读取的字节，这个编码正好也是`Demo.java`文件的编码，二者一致，所以不会出现乱码情况。
让我们来做点手脚，在保存`Demo.java`文件时，我们选择`UTF-8`保存。此时`Demo.java`文件编码就是`UTF-8`了。我们再使用`javac Demo.java`来编译，如果`Demo.java`里含有中文字符，此时控制台会出现警告信息，也出现了乱码。究其原因，就是因为`javac`采用了`GBK`编码解码我们读取的字节。因为我们的字节是`UTF-8`编码的，所以会出现乱码。

#### 4.5上述代码的内存图解：

![image-20200928141326230](images2\image-20200928141326230.png)

## 5.自加自减分析：a++  ++a

### 5.1示例代码：

```java
class Demo {

	public static void main(String[] args) {
		int a = 3;
		int b;
		b = (a++)+(++a)+(a++)*2+a+(++a);
		System.out.println(b);
	}
}
```



`内存加载分析`：

![image-20200928141404698](images2\image-20200928141404698.png)

### 5.2练习：

示例代码：

```java
class Demo {

	public static void main(String[] args) {
		int a = 3;
		int b = a++;
		System.out.println("b -- " + b);
		int c = 3;
		int d = ++c;
		System.out.println("d -- " + d);
		int i = 3;
		i = i++;
		System.out.println("i -- " + i);
		int e = 3;
		e = ++e;
		System.out.println("e -- " + e);
	}
}
```



运行结果：

![image-20200928141431291](images2\image-20200928141431291.png)

内存分析：

![image-20200928141437277](images2\image-20200928141437277.png)


