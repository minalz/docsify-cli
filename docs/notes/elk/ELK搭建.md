# 📊 ELK 搭建指南

> 📦 使用 Docker Compose 快速部署 ELK 技术栈

---

## 📖 前置条件

- ✅ Docker 安装完成
- ✅ Docker Compose 安装完成

---

## 🏗️ 1. 创建 docker-compose.yml

```yaml
version: "3.2"
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.4.2
    container_name: elasticsearch
    environment:
      - discovery.type=single-node
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms1g -Xmx1g"
    ports:
      - 9200:9200
    networks:
      - "elk-net"
      
  logstash:
    image: docker.elastic.co/logstash/logstash:7.4.2
    container_name: logstash
    volumes:
      - type: bind
        source: "./logstash/logstash_stdout.conf"
        target: "/usr/share/logstash/pipeline/logstash.conf"
    ports:
      - "9250:9250"
    networks:
      - "elk-net"
      
  kibana:
    image: docker.elastic.co/kibana/kibana:7.4.2
    ports:
      - "5601:5601"
    networks:
      - "elk-net"
      
networks:
  elk-net:
```

---

## 📝 2. 创建 Logstash 配置文件

创建 `logstash/logstash_stdout.conf` 文件：

```conf
# logstash_stdout.conf
input {
  tcp {
    mode => "server"
    tags => ["tags"]
    host => "0.0.0.0"  # 允许任意主机发送日志
    port => 9250
    codec => json_lines
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "elkdemo"
  }
  stdout { codec => rubydebug }
}
```

---

## 🚀 3. 启动 ELK 服务

```bash
docker-compose up -d
```

---

## 🔍 4. 查看运行状态

```bash
docker ps -a
```

> 💡 检查所有容器是否正常运行

---

## 🌐 5. 访问 Kibana

浏览器访问：`http://10.0.3.85:5601/`

---

## 📚 配置说明

| 组件 | 端口 | 说明 |
|:---|:---|:---|
| ElasticSearch | 9200 | 搜索引擎，存储日志数据 |
| Logstash | 9250 | 日志收集与处理管道 |
| Kibana | 5601 | 可视化仪表盘 |

---

> 💡 **提示**：ELK 是 ElasticSearch、Logstash、Kibana 三个开源软件的组合，常用于日志收集、存储和分析！
