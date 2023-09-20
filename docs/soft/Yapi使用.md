# Yapi使用

### 1.官网教程

```javascript
https://hellosean1025.github.io/yapi/documents/index.html
```



### 2.安装方式

#### 2.1 命令行部署

```javascript
https://hellosean1025.github.io/yapi/devops/index.html#%e5%ae%89%e8%a3%85
```



#### 2.2 docker搭建方式

```dockerfile
# docker-compose方式
version: '3.1'
services:
  yapi-web:
    image: liuqingzheng/yapi:latest
    container_name: yapi-web
    ports:
      - 9001:3000
    environment:
      - YAPI_ADMIN_ACCOUNT=你的账号
      - YAPI_ADMIN_PASSWORD=你的密码
      - YAPI_CLOSE_REGISTER=true
      - YAPI_DB_SERVERNAME=yapi-mongo
      - YAPI_DB_PORT=27017
      - YAPI_DB_DATABASE=yapi
      - YAPI_MAIL_ENABLE=false
      - YAPI_LDAP_LOGIN_ENABLE=false
      - YAPI_PLUGINS=[]
    depends_on:
      - yapi-mongo
    links:
      - yapi-mongo
    restart: unless-stopped
  yapi-mongo:
    image: mongo:latest
    container_name: yapi-mongo
    volumes:
      - ./data/db:/data/db
    expose:
      - 27017
    restart: unless-stopped
```

### 3.执行命令

```shell
docker-compose up -d
```



### 4.测试地址

```
地址：https://minalz.cn:3001
账号：你的账号
密码：你的密码
```



### 5.EasyYapi插件链接

```javascript
https://easyyapi.com/documents/index.html
```



### 6.Idea安装EasyYapi插件

第一步：Plugins->Marketplace->EasyYapi install

![image-20230315175258922](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20230315175258922.png)



### 7.安装好了进行配置

![image-20230315175506022](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20230315175506022.png)



### 8.获取token

![image-20230315175529452](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20230315175529452.png)



### 9.手动推送

#### 9.1 类注释

```java
/**
 * 测试控制器
 * 这一行是备注
 * @author zhouwei
 * @date 2023/3/15 17:59
 */
```



#### 9.2 方法注释

```java
/**
 * 测试方法1
 * test1备注
 * @param name 姓名
 * @return 返回实体类
 */
```



#### 9.3 推送方式Ctrl+Alt+E

![image-20230315183353900](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20230315183353900.png)



### 10.查看

#### 10.1 基本信息和请求参数

![image-20230315183222163](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20230315183222163.png)



#### 10.2 返回数据

![image-20230315183238940](http://sjluyi7xe.hd-bkt.clouddn.com/typora/image-20230315183238940.png)