## 1. 进制介绍

二进制：逢2进1

八进制：逢8进1

十进制：逢10进1

十六进制：逢16进1

注意：在电子设备中，数据的存储最小单位是字节。

表示方法：

1个字节 = 8个比特位

## 2. Java中把数据共计划分成2大类型

1）引用数据类型：它表示是数组 、 类 、接口等

2）基本数据类型：

对基本的数据进行的类型划分：

整数：由于整数有非常大的数据，也有非常小的数据。于是把整数类型又区分成4种：
`byte` 、 `short` 、 `int` 、 `long`

小数：

`float`(单精度)、`double`(双精度)

字符：

`char`

布尔：

`boolean` true 真 false 假

这八种基本类型数据，就是前面介绍过的关键字。

注意：JAVA语言是强类型语言，对于每一种数据都定义了明确的具体数据类型。

## 3. 进制转换

### 3.1 十进制9转成二进制

![image-20200928141742358](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20200928141742358.png)

### 3.2 十进制9转八进制

![image-20200928141749506](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20200928141749506.png)

### 3.3 十进制21转十六进制

![image-20200928141800967](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20200928141800967.png)

由此 如果想将各种进制反过来求取对应的十进制，应该是先转成对应的二进制，然后再通过二进制转成十进制

## 4. 位运算

(`<<`)有符号左移,(`>>`)有符号右移，(`<<<`)无符号左移,(`>>>`)无符号右移，(`&`)按位与运算，(`|`)按位或运算，(`^`)按位异或运算

### 4.1 与、或、异或运算

![image-20200928141835695](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20200928141835695.png)

### 4.2左移右移计算分析

![image-20200928141849975](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20200928141849975.png)

### 4.3 Int强转为byte精度缺失的原因

#### 4.3.1 Int = 130  byte=？

![image-20200928141902391](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20200928153843493.png)

#### 4.3.2 示例代码

```java
class Demo {

	public static void main(String[] args) {
		int a = 130;
		byte b = (byte)a;
		System.out.println(b);
	}
}
```


#### 4.3.3 编译执行

![image-20200928141934028](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20200928141934028.png)

