# 🔍 Arthas 快速入门与使用文档

> 💡 阿里巴巴开源的 Java 线上诊断工具，不重启、不修改代码即可实时监控和诊断生产环境中的 Java 应用

## 📑 目录

- [📋 一、Arthas 简介](#📋-一arthas-简介)
- [📥 二、安装 Arthas](#📥-二安装-arthas)
- [🚀 三、快速入门 Demo（math-game）](#🚀-三快速入门-demomath-game)
- [⚡ 四、进阶使用](#⚡-四进阶使用)
- [🚪 五、退出 Arthas](#🚪-五退出-arthas)
- [📊 六、常用命令速查表](#📊-六常用命令速查表)
- [🔗 七、官方资源](#🔗-七官方资源)

---

## 📋 一、Arthas 简介

Arthas（阿尔萨斯）是阿里巴巴开源的 **Java 线上诊断工具**，能够在 **不重启、不修改代码** 的情况下，实时监控和诊断生产环境中的 Java 应用。

### ✨ 它能解决的问题

| 场景 | Arthas 能力 |
| :--- | :--- |
| 类加载异常 | 查看类从哪个 jar 包加载 |
| 代码未生效 | 验证代码变更是否生效，无需重启 |
| 线上无法 debug | 实时查看方法入参、返回值、异常 |
| 接口响应慢 | 追踪方法调用链路，定位耗时瓶颈 |
| JVM 状态监控 | 实时查看内存、线程、GC 状态 |
| 性能热点 | 生成火焰图，快速定位热点方法 |
| 动态调用 | 从 JVM 内部直接调用方法或获取对象实例 |

> 💡 **支持范围**：JDK 6+，支持 Linux/Mac/Windows，命令行交互，Tab 自动补全。

---

## 📥 二、安装 Arthas

### 1. 在线安装（推荐快速体验）

```bash
# 下载 arthas-boot.jar
curl -O https://arthas.aliyun.com/arthas-boot.jar

# 启动（会自动列出 Java 进程）
java -jar arthas-boot.jar

# 如果下载慢，使用阿里云镜像
java -jar arthas-boot.jar --repo-mirror aliyun --use-http
```

### 2. Linux/Mac 一键脚本

```bash
curl -L https://arthas.aliyun.com/install.sh | sh
# 安装后使用
./as.sh
```

### 3. 离线安装（生产环境推荐）

```bash
# 1. 下载全量包
wget https://arthas.aliyun.com/arthas-bin.zip

# 2. 解压
unzip arthas-bin.zip -d /opt/arthas

# 3. 启动
cd /opt/arthas
java -jar arthas-boot.jar
```

### 4. Windows

```bash
# 下载 arthas-boot.jar 后
java -jar arthas-boot.jar

# 或使用 as.bat（需指定 PID）
as.bat <PID>
```

---

## 🚀 三、快速入门 Demo（math-game）

> 💡 **说明**：官方提供了 `math-game.jar` 作为演示程序，下面完整走一遍诊断流程。

### 1. 启动 Demo 应用

```bash
# 下载示例程序
curl -O https://arthas.aliyun.com/math-game.jar

# 启动（保持终端运行）
java -jar math-game.jar
```

`math-game` 会每隔一秒生成一个随机数，执行质因数分解并打印结果。

### 2. 启动 Arthas 并 Attach

打开另一个终端：

```bash
java -jar arthas-boot.jar
```

输出示例：

```
[INFO] arthas-boot version: 3.x.x
[INFO] Found existing java process, please choose one and input the serial number of the process, eg: 1 . Then hit ENTER.
* [1]: 12345 math-game.jar
  [2]: 67890 idea
1
[INFO] arthas home: /root/.arthas/lib/3.x.x/arthas
[INFO] Try to attach process 12345
[INFO] Attach success.
[arthas@12345]$
```

### 3. 常用诊断命令演练

#### 3.1 dashboard — 全局运行状态

```bash
[arthas@12345]$ dashboard
```

输出包含：

- **线程信息**：ID、NAME、GROUP、优先级、状态、CPU 占用
- **内存信息**：堆内存、非堆内存、各代内存使用情况
- **GC 信息**：GC 次数、GC 耗时
- **运行时信息**：系统负载、uptime

#### 3.2 thread — 线程分析

```bash
# 查看所有线程
[arthas@12345]$ thread

# 查看 CPU 占用最高的 3 个线程
[arthas@12345]$ thread -n 3

# 查看指定线程的堆栈
[arthas@12345]$ thread 1

# 查找死锁
[arthas@12345]$ thread -b
```

#### 3.3 jad — 反编译类

```bash
# 反编译 math-game 的 MathGame 类
[arthas@12345]$ jad demo.MathGame
```

可以看到线上运行的实际源码，验证代码是否生效。

#### 3.4 watch — 监控方法入参和返回值

```bash
# 监控 MathGame.primeFactors 方法的返回值
[arthas@12345]$ watch demo.MathGame primeFactors returnObj

# 监控入参
[arthas@12345]$ watch demo.MathGame primeFactors params

# 监控入参和返回值
[arthas@12345]$ watch demo.MathGame primeFactors '{params,returnObj}'
```

输出示例：

```
ts=2025-07-26 21:42:30; [cost=1.715367ms] result=@ArrayList[
    @Integer[5],
    @Integer[47],
    @Integer[2675531],
]
```

#### 3.5 trace — 方法调用链路追踪

```bash
# 追踪 run 方法的内部调用耗时
[arthas@12345]$ trace demo.MathGame run
```

输出会展示方法内部每个节点的耗时，快速定位慢调用。

#### 3.6 stack — 查看方法调用栈

```bash
# 查看谁调用了 primeFactors
[arthas@12345]$ stack demo.MathGame primeFactors
```

#### 3.7 tt — 方法执行时空隧道

```bash
# 记录 primeFactors 的每次调用
[arthas@12345]$ tt -t demo.MathGame primeFactors

# 查看记录列表
[arthas@12345]$ tt -l

# 重放某次调用（index 为记录编号）
[arthas@12345]$ tt -p -i 1000
```

#### 3.8 sc / sm — 查看类和方法信息

```bash
# 查看已加载的类
[arthas@12345]$ sc demo.MathGame

# 查看类的方法信息
[arthas@12345]$ sm demo.MathGame
```

#### 3.9 heapdump — 堆内存 Dump

```bash
[arthas@12345]$ heapdump /tmp/dump.hprof
```

#### 3.10 profiler — 生成火焰图

```bash
# 开始采样
[arthas@12345]$ profiler start

# 停止并生成火焰图
[arthas@12345]$ profiler stop
```

会生成一个 `.html` 火焰图文件，用浏览器打开即可直观看到性能热点。

---

## ⚡ 四、进阶使用

### 1. 热更新代码（redefine）

```bash
# 1. 先用 jad 将类反编译到文件
[arthas@12345]$ jad --source-only demo.MathGame > /tmp/MathGame.java

# 2. 修改 /tmp/MathGame.java

# 3. 用 mc 命令内存编译
[arthas@12345]$ mc /tmp/MathGame.java -d /tmp

# 4. 用 redefine 热加载
[arthas@12345]$ redefine /tmp/demo/MathGame.class
```

> 💡 **提示**：无需重启应用即可更新代码！

### 2. 执行 OGNL 表达式

```bash
# 调用静态方法
[arthas@12345]$ ognl '@java.lang.System@out.println("hello")'

# 获取静态字段
[arthas@12345]$ ognl '@demo.MathGame@random'
```

### 3. 查看 JVM 信息

```bash
[arthas@12345]$ jvm        # JVM 详细信息
[arthas@12345]$ memory     # 内存信息
[arthas@12345]$ sysprop    # 系统属性
[arthas@12345]$ sysenv     # 环境变量
```

---

## 🚪 五、退出 Arthas

```bash
# 仅退出当前客户端（Arthas 服务端继续运行，可重新连接）
[arthas@12345]$ quit
# 或
[arthas@12345]$ exit

# 完全关闭 Arthas 服务端（所有客户端断开）
[arthas@12345]$ stop
```

---

## 📊 六、常用命令速查表

| 命令 | 功能 |
| :--- | :--- |
| `dashboard` | 系统实时数据面板 |
| `thread` | 线程信息 |
| `jad` | 反编译类 |
| `watch` | 方法执行数据观测 |
| `trace` | 方法内部调用路径和耗时 |
| `stack` | 方法被调用的路径 |
| `tt` | 方法执行时空隧道 |
| `sc` | 查看 JVM 已加载的类 |
| `sm` | 查看已加载类的方法 |
| `heapdump` | 导出堆内存快照 |
| `profiler` | 生成火焰图 |
| `jvm` | JVM 信息 |
| `memory` | 内存信息 |
| `redefine` | 热更新类 |
| `ognl` | 执行 OGNL 表达式 |
| `vmtool` | 强制 GC、查询对象 |

---

## 🔗 七、官方资源

- **官网**：[https://arthas.aliyun.com](https://arthas.aliyun.com)
- **GitHub**：[https://github.com/alibaba/arthas](https://github.com/alibaba/arthas)
- **快速入门**：[https://arthas.aliyun.com/doc/quick-start.html](https://arthas.aliyun.com/doc/quick-start.html)
- **命令列表**：[https://arthas.aliyun.com/doc/commands.html](https://arthas.aliyun.com/doc/commands.html)

---

> 💡 **提示**：以上就是 Arthas 的完整入门指南，从安装到常用命令都有覆盖。建议先用 `math-game.jar` 练习一遍，熟悉后再用于生产环境诊断！
