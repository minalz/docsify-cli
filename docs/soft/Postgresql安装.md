# 🗄️ PostgreSQL 安装指南

> 💡 本文档提供 PostgreSQL 16 的多种安装方式，包括 Linux 一键脚本安装和 Docker 容器化部署。

---

## 📋 目录

- [方式一：Linux 一键脚本安装](#方式一linux-一键脚本安装)
- [方式二：Docker 容器化部署](#方式二docker-容器化部署)
- [卸载 PostgreSQL](#卸载-postgresql)
- [常见问题排查](#常见问题排查)

---

## 🐧 方式一：Linux 一键脚本安装

### 功能说明

该脚本将自动完成以下配置：

- ✅ 安装 PostgreSQL 16
- ✅ 创建用户 `postgre`（密码：`123456`）
- ✅ 创建数据库 `test_db`
- ✅ 配置远程连接
- ✅ 设置开机自启

### 安装脚本

```bash
#!/bin/bash
# ============================================
# PostgreSQL 16 一键安装脚本（修复版）
# 用户: postgre / 123456
# 数据库: test_db
# 允许远程连接
# ============================================

set -e

echo "=========================================="
echo "  PostgreSQL 16 一键安装脚本"
echo "=========================================="
echo ""

# 1. 更新包列表并安装依赖
echo "[1/9] 更新包列表并安装依赖..."
sudo apt update -y
sudo apt install -y curl gnupg2 lsb-release software-properties-common

# 2. 添加 PostgreSQL 官方仓库
echo "[2/9] 添加 PostgreSQL 官方仓库..."
DISTRO=$(lsb_release -cs)

# 3. 导入签名密钥（修复：使用 gpg --dearmor 替代 apt-key）
echo "[3/9] 导入签名密钥..."
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /usr/share/keyrings/postgresql-keyring.gpg

# 4. 添加仓库（修复：使用 signed-by 指定密钥路径）
echo "[4/9] 添加仓库配置..."
echo "deb [signed-by=/usr/share/keyrings/postgresql-keyring.gpg] http://apt.postgresql.org/pub/repos/apt ${DISTRO}-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list > /dev/null

# 5. 更新并安装 PostgreSQL 16
echo "[5/9] 安装 PostgreSQL 16..."
sudo apt update -y
sudo apt install -y postgresql-16 postgresql-client-16 postgresql-contrib-16

# 6. 启动并设置开机自启
echo "[6/9] 启动 PostgreSQL 服务..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 7. 配置远程连接
echo "[7/9] 配置远程连接..."
sudo cp /etc/postgresql/16/main/postgresql.conf /etc/postgresql/16/main/postgresql.conf.bak
sudo cp /etc/postgresql/16/main/pg_hba.conf /etc/postgresql/16/main/pg_hba.conf.bak

# 修改 postgresql.conf
sudo sed -i "s/^#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/16/main/postgresql.conf
sudo sed -i "s/^listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/16/main/postgresql.conf

# 修改 pg_hba.conf
sudo tee /etc/postgresql/16/main/pg_hba.conf > /dev/null <<'EOF'
# PostgreSQL Client Authentication Configuration File
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
host    all             all             0.0.0.0/0               md5
host    all             all             ::/0                    md5
EOF

# 8. 设置密码和创建用户
echo "[8/9] 配置用户和密码..."
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '123456';" || true
sudo -u postgres psql -c "DROP USER IF EXISTS postgre;" || true
sudo -u postgres psql -c "CREATE USER postgre WITH PASSWORD '123456' SUPERUSER CREATEDB CREATEROLE LOGIN;"

# 9. 创建数据库并授权
echo "[9/9] 创建数据库并配置权限..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS test_db;" || true
sudo -u postgres psql -c "CREATE DATABASE test_db OWNER postgre;"
sudo -u postgres psql -d test_db -c "GRANT ALL ON SCHEMA public TO postgre;"
sudo -u postgres psql -d test_db -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgre;"
sudo -u postgres psql -d test_db -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgre;"

# 重启服务使配置生效
sudo systemctl restart postgresql
sleep 2

# 验证安装
echo ""
echo "=========================================="
echo "  安装完成！"
echo "=========================================="
echo ""
echo "  用户名: postgres / 123456"
echo "  用户名: postgre / 123456"
echo "  数据库: test_db"
echo "  连接: postgresql://postgre:123456@localhost:5432/test_db"
echo ""
```

### 使用说明

1. 将脚本保存为 `install-postgresql.sh`
2. 添加执行权限：`chmod +x install-postgresql.sh`
3. 运行脚本：`sudo ./install-postgresql.sh`

### 连接信息

安装完成后，您可以使用以下信息连接数据库：

| 配置项 | 值 |
|--------|-----|
| 用户名 | `postgre` |
| 密码 | `123456` |
| 数据库 | `test_db` |
| 端口 | `5432` |
| 连接字符串 | `postgresql://postgre:123456@<IP>:5432/test_db` |

### 防火墙配置

如果需要远程访问，请开放 5432 端口：

```bash
# 使用 UFW
sudo ufw allow 5432/tcp

# 或使用 iptables
sudo iptables -A INPUT -p tcp --dport 5432 -j ACCEPT
```

### 测试连接

```bash
psql -U postgre -d test_db -h localhost
# 输入密码: 123456
```

---

## 🐳 方式二：Docker 容器化部署

### Windows PowerShell 环境

#### 1. 配置 Docker 镜像加速器

> ⚠️ **重要提示**：不要配置阿里云的加速器，Windows 环境下会导致 403 Forbidden 错误。

在 Docker Desktop 中配置以下镜像源：

```json
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false,
  "registry-mirrors": [
    "https://docker.xuanyuan.me",
    "https://docker.1ms.run",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```

#### 2. 运行 PostgreSQL 容器

```powershell
docker run -d --name postgres `
  -p 5432:5432 `
  -e POSTGRES_USER=postgre `
  -e POSTGRES_PASSWORD=123456 `
  -e POSTGRES_DB=test_db `
  postgres:16.4
```

### 连接信息

| 配置项 | 值 |
|--------|-----|
| 容器名称 | `postgres` |
| 用户名 | `postgre` |
| 密码 | `123456` |
| 数据库 | `test_db` |
| 端口映射 | `5432:5432` |

---

## 🗑️ 卸载 PostgreSQL

### 完全卸载命令

```bash
sudo systemctl stop postgresql && \
sudo apt remove --purge postgresql* -y && \
sudo rm -rf /var/lib/postgresql/ /var/log/postgresql/ /etc/postgresql/ /etc/postgresql-common/ && \
sudo deluser postgres 2>/dev/null; sudo delgroup postgres 2>/dev/null && \
sudo apt autoremove -y && \
sudo apt autoclean && \
echo "PostgreSQL 已完全卸载"
```

### 验证卸载

```bash
# 检查是否还有 PostgreSQL 包
dpkg -l | grep postgresql

# 检查进程
ps aux | grep postgres

# 检查端口
sudo ss -tlnp | grep 5432
```

如果以上命令无输出，说明 PostgreSQL 已完全卸载。

---

## ❓ 常见问题排查

### 1. 服务启动失败

```bash
# 查看服务状态
sudo systemctl status postgresql

# 查看日志
sudo journalctl -u postgresql -xe
```

### 2. 无法远程连接

- 检查 `postgresql.conf` 中的 `listen_addresses` 是否设置为 `'*'`
- 检查 `pg_hba.conf` 是否允许远程 IP 连接
- 确认防火墙已开放 5432 端口
- 重启服务：`sudo systemctl restart postgresql`

### 3. Docker 拉取镜像失败

- 检查 Docker 镜像加速器配置
- 避免使用阿里云加速器（Windows 环境）
- 尝试更换其他镜像源

---

## 📖 参考资料

- [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
- [Docker Hub - PostgreSQL](https://hub.docker.com/_/postgres)









