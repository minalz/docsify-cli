# 📈 Docker Compose 搭建 Prometheus

> 📦 使用 Docker Compose 部署 Prometheus + Grafana 监控系统

---

## 📖 参考链接

- [Prometheus 搭建教程 1](https://blog.csdn.net/weixin_43547554/article/details/118361421)
- [Prometheus 搭建教程 2](https://blog.csdn.net/miss1181248983/article/details/107496421)
- [Prometheus 搭建教程 3](https://blog.csdn.net/weixin_34085658/article/details/91798960)

---

## 1️⃣ 创建网络

> 💡 可选步骤，也可以使用系统默认创建的网络

```bash
sudo docker network create prometheus-network
```

---

## 2️⃣ 创建持久化目录

```bash
mkdir -p /home/prom/{prometheus,prometheus/data,alertmanager,grafana}
chmod 777 /home/prom/{prometheus/data,grafana}
cd /home/prom
```

---

## 3️⃣ 创建 docker-compose.yml

```yaml
version: '3'
services:
  prometheus:
    container_name: prometheus
    image: prom/prometheus:latest
    volumes:
      - /home/prom/prometheus/prometheus-standalone.yaml:/etc/prometheus/prometheus.yml
    ports:
      - 9090:9090
    # depends_on: # 表示要在哪个服务之后启动 prometheus
    #   - nacos
    restart: always
  
  grafana:
    container_name: grafana
    image: grafana/grafana:latest
    environment:
      # 在容器建立过程中下载插件
      - "GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-simple-json-datasource,alexanderzobnin-zabbix-app"
    volumes:
      - /home/prom/grafana:/var/lib/grafana
    ports:
      - 3000:3000
    restart: always
    
networks:
  default:
    external:
      name: prometheus-network
```

---

## 4️⃣ 创建 Prometheus 配置文件

### prometheus-standalone.yaml

```yaml
global:
  scrape_interval: 15s  # 拉取 targets 的默认时间间隔
  # scrape_timeout: 10s # 拉取一个 target 的超时时间
  evaluation_interval: 15s  # 执行 rules 的时间间隔
  # external_labels: # 额外的属性，会添加到拉取的数据并存到数据库中

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          # - alertmanager:9093

rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries
  - job_name: 'prometheus'
    scheme: http
    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'
    static_configs:
      # 因为使用了网桥，所以 targets 可以直接使用容器名而不用 IP
      - targets: ['prometheus:9090']

  - job_name: 'elkdemo-node'
    metrics_path: '/actuator'
    static_configs:
      - targets: ['192.168.1.1:8088']
```

---

## 5️⃣ 启动服务

```bash
sudo docker-compose -f docker-compose-monitor.yml up -d
```

---

## 6️⃣ 查看日志

```bash
sudo docker-compose -f docker-compose-monitor.yml logs -f 服务名
```

---

## 7️⃣ 访问 Prometheus

**访问地址：** `http://ip:9090`

---

## 8️⃣ 访问 Grafana

**访问地址：** `http://ip:3000`

**默认账号：**
- 用户名：`admin`
- 密码：`admin`

---

## 📊 服务说明

| 服务 | 端口 | 说明 |
|:---|:---|:---|
| Prometheus | 9090 | 监控数据采集与存储 |
| Grafana | 3000 | 可视化仪表盘 |

---

> 💡 **提示**：Prometheus 是一款强大的开源监控系统，配合 Grafana 可以实现完美的可视化监控！
