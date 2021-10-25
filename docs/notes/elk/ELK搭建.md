# ELK搭建

## 1.docker安装完成

## 2.docker-compose安装完成

## 3.elk安装

```dockerfile
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

## 4.配置文件

```
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

## 5.创建

```bash
docker-compose up -d
```

## 6.查看运行状态是否成功

```bash
docker ps -a
```

## 7.访问

kibana: http://10.0.3.85:5601/

