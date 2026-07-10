# 🔍 如何查询 Linux 服务器是几核的

> 💡 Linux 系统 CPU 核心数查询 | 硬件信息查看 | 常用命令

---

## 💻 一、常用查询命令

### 1️⃣ 查看 CPU 核心数

```bash
grep -c 'processor' /proc/cpuinfo
```

### 2️⃣ 查看 CPU 型号和物理 ID

```bash
cat /proc/cpuinfo | grep "model name" && cat /proc/cpuinfo | grep "physical id"
```

### 3️⃣ 查看内存信息

```bash
# 以人类可读格式显示
free -h

# 以 MB 为单位显示
free -m
```

### 4️⃣ 查看磁盘信息

```bash
fdisk -l
```

---

## 📚 二、参考链接

查看 CPU 核心数详细说明：https://zhidao.baidu.com/question/552768001.html

