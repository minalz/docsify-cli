# 🔍 Docker 安装 Elasticsearch

> 💡 Windows Docker Desktop 部署 Elasticsearch 完整指南（单节点、开发测试专用）

---

## 📦 1. 拉取镜像

> 💡 推荐 8.x 稳定版，医疗检索常用

```bash
docker pull docker.elastic.co/elasticsearch/elasticsearch:8.15.0
```

---

## 🚀 2. 启动 ES 容器

> ⚠️ **注意**：以下命令适用于 PowerShell 执行多行

```bash
docker run -d \
  --name es-single \
  --restart always \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  -e "xpack.security.enrollment.enabled=false" \
  -e "xpack.security.http.ssl.enabled=false" \
  -e "xpack.security.transport.ssl.enabled=false" \
  -e "ES_JAVA_OPTS=-Xms1g -Xmx1g" \
  -v es-data:/usr/share/elasticsearch/data \
  docker.elastic.co/elasticsearch/elasticsearch:8.15.0
```

### 📋 参数说明

| 参数 | 说明 |
|:---|:---|
| `discovery.type=single-node` | 单节点模式，关闭集群校验，本地开发必须加 |
| `xpack.security.enabled=false` 等 | 关闭全部 xpack ssl / 安全认证，本地调试免账号密码，直接访问 `http://127.0.0.1:9200` |
| `ES_JAVA_OPTS=-Xms1g -Xmx1g` | 内存限制，4G 内存电脑可改成 `-Xms512m -Xmx512m` |
| `-v es-data:/usr/share/elasticsearch/data` | 持久化卷，重启数据不丢失 |
| `-p 9200:9200` | HTTP 端口（Java RestClient 连接） |
| `-p 9300:9300` | 集群内部通信端口 |

### 📝 单行命令

```bash
docker run -d --name es-single --restart always -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e "xpack.security.enabled=false" -e "xpack.security.enrollment.enabled=false" -e "xpack.security.http.ssl.enabled=false" -e "xpack.security.transport.ssl.enabled=false" -e "ES_JAVA_OPTS=-Xms1g -Xmx1g" -v es-data:/usr/share/elasticsearch/data docker.elastic.co/elasticsearch/elasticsearch:8.15.0
```

---

## 📊 3. 配套 Kibana（可选）

> 💡 可视化调试 BM25 查询
>
> ⚠️ **注意**：以下命令适用于 PowerShell 执行多行

**拉取 Kibana 镜像：**

```bash
docker pull docker.elastic.co/kibana/kibana:8.15.0
```

**启动 Kibana 容器：**

```bash
docker run -d \
  --name kibana \
  --restart always \
  -p 5601:5601 \
  -e "ELASTICSEARCH_HOSTS=http://es-single:9200" \
  --link es-single \
  docker.elastic.co/kibana/kibana:8.15.0
```

**访问地址：** http://127.0.0.1:5601

### 📝 单行命令

```bash
docker run -d --name kibana --restart always -p 5601:5601 -e "ELASTICSEARCH_HOSTS=http://es-single:9200" --link es-single docker.elastic.co/kibana/kibana:8.15.0
```

---

## 🛠️ 4. 常用运维命令

> 💡 PowerShell / CMD 通用

```bash
# 查看容器运行状态
docker ps

# 查看ES日志（排查启动失败）
docker logs -f es-single

# 停止ES
docker stop es-single

# 重启ES
docker restart es-single

# 删除容器（数据卷保留）
docker rm es-single

# 彻底删除数据（清空所有索引）
docker volume rm es-data
```

---

## ⚠️ 5. Windows 专属前置坑点

- 🖥️ **Docker Desktop 开启 WSL2 后端**，内存分配至少 2G
- 🔐 **若启动报错权限不足**：WSL 文件挂载权限问题，改用命名卷 `es-data`（上面命令已处理）
- 🔥 **防火墙放行** 9200、5601 端口
- ☕ **Java HighLevelRestClient 连接地址**：`http://localhost:9200`，无账号密码

---

## ✅ 6. 验证 ES 是否正常启动

**浏览器访问：**

```
http://127.0.0.1:9200
```

返回 JSON 即部署成功，可直接创建病历索引、执行 BM25 multi_match 检索。
