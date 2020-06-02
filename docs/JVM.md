# JVM

1. 类加载机制

   + 装载

     全路径、类加载器、寻找类(双亲委派)、

   + 链接

     验证：文件格式验证、元数据验证、字节码验证、符号引用验证

     准备：为类的静态变量分配内存，并将其初始化为默认值，这是`默认值的初始化`，并不是赋值，需要注意

     解析：将类中的符号引用转换为直接引用(我的理解就是本来是通过变量引用，现在直接把空间地址传给它)

   + 初始化

     对类的成员变量，静态代码执行初始化操作

2. 双亲委派模型

   ​	`往上找父，保证唯一`

   + 2.1 类加载器类型:
     + BootStrap ClassLoader 启动类加载器、跟加载器
     + ExtClassLoader 扩展类加载器
     + AppClassLoader 应用类加载器
     + Customer ClassLoader 自定义类加载器

   + 2.2 作用
     + 保证JDK核心类的优先加载
   + 2.3 如何打破
     + 自定义类加载器，重写loadClass方法
     + 使用线程上下文类加载器

3. 运行时数据区 

   JVM运行时数据区，由此可引申到JMM内存模型

   + 内存划分：栈内存、堆内存、方法区、本地方法区、寄存器

   + JVM运行时数据区，方法区和堆内存

     堆内存又分为，老年代(Old -- Major GC)、新生代(Young -- Eden、Survivor(S0、S1))

     新生代:S0:S1 = 8:1:1

     S0和S1 存在的意义是 虽然浪费了10%的空间，但是避免了空间碎片

     当S0或S1存储不了大的对象的时候，存在一个`内存担保机制`，可以向Old借空间，用完了，再还给它

   + 垃圾回收算法

     + 标记删除
       + 空间碎片，内存不连续
       + 标记和清除都比较耗时，要扫描两次，效率比较低
       + Old
     + 标记复制
       + 浪费10%的空间
       + 空间连续
       + Young（Eden、S0、S1）
     + 标记整理
       + 没有保留区域
       + 没有空间碎片
       + Old

     `Full GC = Major GC + Young  GC`

   + 垃圾回收器

     ​	所有的垃圾回收期都有`STW`(Stop The World) 只是`暂停`时间长短不同而已

     ​	吞吐量：用户业务代码执行的时间/(业务代码执行的时间+垃圾收集的时间)

     ​	吞吐量越大，垃圾收集时间越短，用户代码就可以充分利用CPU资源

     ​	`jdk1.8默认使用Parallel GC`

     ​	`jdk1.9默认使用G1`

     + 串行收集器 单线程
       + Serial -> ParNew (多线程)
       + Serial Old
     + 并行收集器 吞吐量优先
       + Parallel Scanvenge
       + Parallel Old
     + 并发收集器 停顿时间优先
       + CMS
       + G1 jdk1.9之后是默认的
       + jdk11 还有一个ZGC(Z Garbage Collector) 停顿时间小于10ms

   + CMS：Concurrent Mark Sweep 并发类的垃圾收集器

     初始标记->并发标记->重新标记->并发清除

   + G1：Garbage-First Jdk1.9默认 再1.8中比较普遍

     垃圾优化，整体上属于`标记整理`算法，不会导致空间碎片

     Region区域，对堆重新进行了布局，逻辑存在Young、Old、Eden，物理上已经不是隔离的了

     初始标记->并发标记->最终标记->筛选回收->应用程序线程

4. 如何减少GC的频率

   + 适当的增加堆内存的空间
   + 合理的设置G1垃圾收集器的停顿时间
   + 垃圾回收临界线 -XX:initialtingHeapOccupancyPercent=50(默认是45吧?记不清了)
   + 增加垃圾回收线程数量

5. 什么样的对象才是垃圾

   + 引用计数法

   + 可达性分析 GC Root

6. 如何选择合适的垃圾收集器

   + 优先调整堆的大小让服务器自己来选择
   + 如果内存小于100M，使用串行收集器
   + 如果是单核，并且没有停顿时间要求，使用串行或JVM自己选
   + 如果允许停顿时间超过1秒，选择并行或JVM自己选
   + 如果相应时间最重要，并且不能超过1秒，使用并发收集器

7. JVM参数

   1. 标准参数

      java -version/ -help

   2. -X 参数

      非标准参数：JDK版本变动会导致变动

      java -Xint/-Xcomp/-Xmixed   Hotspot

      mixed混合模式 JVM自己选择

   3. -XX 参数

      + Boolean类型

        -XX：[+/1]name 启动或者停止

      + 非Boolean类型

        -XX: name=value

        -XX: maxHeapSize=100M

   4. 其他参数

      -Xms100M = -XX: InitiaHeapSize=100M 初始化堆内存

      -Xmx100M = -XX: MaxHeapSize=100M 最大化堆内存

      -Xss100M=-XX: ThreadStackSize=100M 栈内存

8. 内存分析过程中会用到的一些指令

   + JPS 查看当前Java进行

   + Jinfo 查看或者修改JVM参数 试试修改Jinfo -flag name = value PID

   + Jstat class/gc

   + Jstack PID

   + Jmap: 生成堆内存的快照

     Jmap -heap PID

     生成快照文件： Jmap dump:format = b.file:heap.hprof PID

   + 分析内存

     + 查看内存工具

       + Jconsole 
       + Jvisualvm(windows需要安装插件 Mac直接就可以在上面下载插件)

       + MAT
       + perfma 在线的 dump分析文件 (你假笨 笨神)

     + 分析日志工具

       + gcviewer
       + gc easy 在线网站

9. 垃圾收集发生的时机是什么时候

   GC由JVM自己完成，时间不确定，也可以手动调用`System.gc()`,手动调用会有一个问题，强引用类型无法清除掉，就算内存不够用，报异常，也不清楚，需要了解强引用、软引用、弱引用、虚引用的区别

   + Eden区或S区不够用了 Minor GC
   + 老年代空间不够用了 Major GC
   + 方法区空间不够用了 Full GC
   + System.gc()->手动调用

10. 评价一个垃圾收集器的好坏

    + 停顿时间
    + 吞吐量
    + GC次数
