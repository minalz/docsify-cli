# Docker Nginx 安装

## 1.创建文件,然后volume进行挂载

```
mkdir /usr/local/myapp/nginx/cert 将证书文件传到这个文件夹中

mkdir /usr/local/myapp/nginx/nginx.conf
```

nginx.conf文件如下:

```shell
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
  
    server {
        listen 80;
        server_name yourdomainname;
        # Http访问也会转成Https的访问
        rewrite ^(.*) https://$server_name$1 permanent;
    }
    # 以下属性中以ssl开头的属性代表与证书配置有关，其他属性请根据自己的需要进行配置。
    server {
        listen 443 ssl;   #SSL协议访问端口号为443。此处如未添加ssl，可能会造成Nginx无法启动。
        server_name yourdomainname;  #将localhost修改为您证书绑定的域名，例如：www.example.com。
        root html;
        index index.html index.htm;
        ssl_certificate /etc/nginx/cert/domain.name_bundle.crt;   #将domain name.pem替换成您证书的文件名。
        ssl_certificate_key /etc/nginx/cert/domain.name.key;   #将domain name.key替换成您证书的密钥文件名。
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;  #使用此加密套件。
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;   #使用该协议进行配置。
        ssl_prefer_server_ciphers on;

        location / {
            proxy_pass http://balance;
        }

    }
    
    # 如果想要多个应用都用Nginx来进行转发,比如jenkins 也可以改成支持https
    # 以下属性中以ssl开头的属性代表与证书配置有关，其他属性请根据自己的需要进行配置。
    server {
        listen 9090 ssl;   #SSL协议访问端口号为443。此处如未添加ssl，可能会造成Nginx无法启动。
        server_name yourdomainname;  #将localhost修改为您证书绑定的域名，例如：www.example.com。
        root html;
        index index.html index.htm;
        ssl_certificate /etc/nginx/cert/domain.name_bundle.crt;   #将domain name.pem替换成您证书的文件名。
        ssl_certificate_key /etc/nginx/cert/domain.name.key;   #将domain name.key替换成您证书的密钥文件名。
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;  #使用此加密套件。
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;   #使用该协议进行配置。
        ssl_prefer_server_ciphers on;
        error_page 497 http://yourIp1:9090;

        location / {
            proxy_pass http://yourIp1:9090;
            # 显示具体负载的机器的ip,X-Route-Ip随便命名
            # add_header X-Route-Ip $upstream_addr;
            # add_header X-Route-Status $upstream_status;
        }

    }

	# 这个可以配置负载均衡,如果有多个应用,默认是轮询
    upstream balance{ 
        server yourIp1:3000;
        server yourIp2:3000;
    }
}
```

## 2.启动命令

```shell
docker run -d --name docsify-nginx -p 80:80 -p 443:443 -p 9020:9020 -v /usr/local/myapp/nginx/cert:/etc/nginx/cert -v /usr/local/myapp/nginx/nginx.conf:/etc/nginx/nginx.conf nginx
```

