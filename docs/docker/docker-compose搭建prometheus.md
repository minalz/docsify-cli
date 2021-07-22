# Docker-compose搭建Prometheus

> 参考链接:

https://blog.csdn.net/weixin_43547554/article/details/118361421?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_title~default-0.pc_relevant_baidujshouduan&spm=1001.2101.3001.4242

> 参考链接:

https://blog.csdn.net/miss1181248983/article/details/107496421

> 参考链接

https://blog.csdn.net/weixin_34085658/article/details/91798960?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EsearchFromBaidu%7Edefault-1.pc_relevant_baidujshouduan&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EsearchFromBaidu%7Edefault-1.pc_relevant_baidujshouduan

## 1.创建网卡,也可以不创建,用系统默认创建的

```sh
sudo docker network create prometheus-network
```



## 2.创建volume的文件见,用于持久化

```sh
mkdir -p /home/prom/{prometheus,prometheus/data,alertmanager,grafana}
chmod 777 /home/prom/{prometheus/data,grafana}
cd /home/prom
```



## 3..docker-compose.yml

```yml
version: '3'
services:
  prometheus:
    container_name: prometheus
    image: prom/prometheus:latest
    volumes: #镜像挂载,需要在/home下建立prometheus文件夹并将配置文件放入其中
    - /home/prom/prometheus/prometheus-standalone.yaml:/etc/prometheus/prometheus.yml
    ports:
      - 9090:9090
 #   depends_on: #表示要在哪个服务之后启动prometheus
 #     - nacos
    restart: always
  
  grafana:
    container_name: grafana
    image: grafana/grafana:latest
    environment: #在容器建立过程中就下载插件
      - "GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-simple-json-datasource,alexanderzobnin-zabbix-app"
    volumes: #镜像挂载,需要在/data建立grafana文件夹
    - /home/prom/grafana:/var/lib/grafana
    ports:
      - 3000:3000
    restart: always
    
networks:
  default:
    external:
      name: prometheus-network
```



## 4.prometheus-standalone.yaml

```yaml
global:
  scrape_interval:     15s #拉取 targets 的默认时间间隔
  #scrape_timeout: 10s #拉取一个 target 的超时时间。
  evaluation_interval: 15s #执行 rules 的时间间隔。
  #external_labels: #额外的属性，会添加到拉取的数据并存到数据库中。

# Alertmanager configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets:
          # - alertmanager:9093

rule_files:
# - "first_rules.yml"
# - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: 'prometheus'
    scheme: http
    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.
    static_configs: #因为使用了网桥所以targets可以直接使用容器名而不用ip
      - targets: ['prometheus:9090']

  - job_name: 'elkdemo-node'
    metrics_path: '/actuator'
    static_configs:
      - targets: ['192.168.1.1:8088']
```



## 5.创建容器

```sh
sudo docker-compose -f docker-compose-monitor.yml up -d
```



## 6.查看日志

```sh
sudo docker-compose -f docker-compose-monitor.yml logs -f 服务名
```



## 7.登录Prometheus

```http
ip:9090
```



## 8.登录Grafana

```http
ip:3000
```



