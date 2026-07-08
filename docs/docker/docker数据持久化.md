# 💾 Docker 数据持久化

> 📦 使用 Volume 和 Bind Mounting 实现数据持久化

---

## 1️⃣ Volume（数据卷）

### 📥 创建 MySQL 容器

```bash
docker run -d \
  --name mysql01 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  mysql:5.7
```

### 🔍 查看 Volume

```bash
docker volume ls
```

### 📖 查看 Volume 详情

```bash
docker volume inspect 48507d0e7936f94eb984adf8177ec50fc6a7ecd8745ea0bc165ef485371589e8
```

### 🏷️ 使用自定义 Volume 名称

```bash
docker run -d \
  --name mysql01 \
  -v mysql01_volume:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=123456 \
  mysql:5.7
```

> 💡 `-v mysql01_volume:/var/lib/mysql` 表示给 volume 起一个容易识别的名字

### 🔎 查看自定义 Volume

```bash
docker volume ls
docker volume inspect mysql01_volume
```

### ✅ 测试数据持久化

#### 1. 进入容器并创建数据库

```bash
# 进入容器
docker exec -it mysql01 bash

# 登录 MySQL
mysql -uroot -p123456

# 创建测试数据库
create database db_test;
```

#### 2. 删除容器

```bash
docker rm -f mysql01
```

#### 3. 查看 Volume（仍然存在）

```bash
docker volume ls
```

输出：
```
DRIVER    VOLUME NAME
local     mysql01_volume
```

#### 4. 创建新容器并使用原有 Volume

```bash
docker run -d \
  --name test-mysql \
  -v mysql01_volume:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=123456 \
  mysql:5.7
```

#### 5. 验证数据是否保留

```bash
# 进入容器
docker exec -it test-mysql bash

# 登录 MySQL
mysql -uroot -p123456

# 查看数据库
show databases;
```

输出：
```
+--------------------+
| information_schema |
| db_test            |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
```

> ✅ 可以发现 `db_test` 仍然存在！数据持久化成功！

---

## 2️⃣ Bind Mounting（绑定挂载）

### 🚀 创建 Tomcat 容器

```bash
docker run -d \
  --name tomcat01 \
  -p 9090:8080 \
  -v /tmp/test:/usr/local/tomcat/webapps/test \
  tomcat
```

### 🔍 查看两个目录

```bash
# 在宿主机上
cd /tmp/test

# 在容器中
docker exec -it tomcat01 bash
cd /usr/local/tomcat/webapps/test
```

### 📝 在宿主机创建文件

在 `/tmp/test` 中创建 `1.html`：

```html
<p style="color:blue; font-size:20pt;">Only test content!!!</p>
```

### ✅ 验证同步

#### 1. 在容器中查看

进入 tomcat01 的对应目录，发现也有一个 `1.html`，并且内容相同

#### 2. 访问测试

```bash
# 在宿主机上访问
curl localhost:9090/test/1.html
```

#### 3. 浏览器访问

在 Windows 浏览器中通过 IP 访问，会显示：`Only test content!!!`

---

## 📊 Volume vs Bind Mounting 对比

| 特性 | Volume | Bind Mounting |
|:---|:---|:---|
| 存储位置 | Docker 管理的目录 | 宿主机指定路径 |
| 可移植性 | 高 | 低 |
| 性能 | 较好 | 好 |
| 适用场景 | 数据库持久化 | 开发时代码同步 |
| 管理方式 | `docker volume` 命令 | 直接操作文件系统 |

---

> 💡 **提示**：数据持久化是 Docker 的重要特性，确保容器删除后数据不会丢失！
