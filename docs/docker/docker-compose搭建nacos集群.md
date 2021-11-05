## 参考链接

https://nacos.io/zh-cn/docs/quick-start-docker.html

> 单机
```dockerfile
version: '3'

services:
  mysqlnacos:
    image: nacos/nacos-mysql:5.7
    container_name: nacos-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: nacos
      MYSQL_USER: nacos
      MYSQL_PASSWORD: nacos
    ports:
      - 3306:3306
    volumes:
      - ./mysql/data/:/var/lib/mysql/
      - ./mysql/my.cnf:/etc/mysql/my.cnf
  nacos:
    image: nacos/nacos-server
    container_name: nacos
    restart: always
    depends_on:
      - mysqlnacos
    environment:
      NACOS_AUTH_ENABLE: "true"
      #SPRING_DATASOURCE_PLATFORM: mysql
      MODE: standalone
      NACOS_REPLICAS: 1
      MYSQL_SERVICE_HOST: mysqlnacos
      MYSQL_SERVICE_DB_NAME: nacos
      MYSQL_SERVICE_PORT: 3306
      MYSQL_SERVICE_USER: nacos
      MYSQL_SERVICE_PASSWORD: liubei@2021
      NACOS_APPLICATION_PORT: 8848
      NACOS_SERVER_PORT: 8848
      PREFER_HOST_MODE: hostname
    # volumes:
      # - ./nacos/standalone-logs:/home/nacos/logs
      # - ./nacos/plugins:/home/nacos/plugins
      # - ./nacos/conf:/home/nacos/conf
    ports:
      - "80:8848"
```