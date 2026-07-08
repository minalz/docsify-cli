# 🌐 Docker 安装 Nginx

> 📦 使用 Docker 部署 Nginx 并配置 HTTPS 和负载均衡

---

## 📁 1. 创建文件目录

### 创建证书和配置文件

```bash
# 创建证书目录
mkdir -p /usr/local/myapp/nginx/cert

# 将证书文件上传到该目录

# 创建配置文件
mkdir -p /usr/local/myapp/nginx
touch /usr/local/myapp/nginx/nginx.conf
```

---

## 📝 2. Nginx 配置文件

### nginx.conf 完整配置

```nginx
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
  
    # HTTP 自动跳转 HTTPS
    server {
        listen 80;
        server_name yourdomainname;
        # Http访问也会转成Https的访问
        rewrite ^(.*) https://$server_name$1 permanent;
    }
    
    # HTTPS 配置（443 端口）
    server {
        listen 443 ssl;
        server_name yourdomainname;
        root html;
        index index.html index.htm;
        
        # SSL 证书配置
        ssl_certificate /etc/nginx/cert/domain.name_bundle.crt;
        ssl_certificate_key /etc/nginx/cert/domain.name.key;
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;

        location / {
            proxy_pass http://balance;
        }
    }
    
    # 多应用 HTTPS 支持（例如 Jenkins）
    server {
        listen 9090 ssl;
        server_name yourdomainname;
        root html;
        index index.html index.htm;
        
        ssl_certificate /etc/nginx/cert/domain.name_bundle.crt;
        ssl_certificate_key /etc/nginx/cert/domain.name.key;
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        error_page 497 http://yourIp1:9090;

        location / {
            proxy_pass http://yourIp1:9090;
            # 显示具体负载的机器的IP
            # add_header X-Route-Ip $upstream_addr;
            # add_header X-Route-Status $upstream_status;
        }
    }

    # 负载均衡配置（默认轮询）
    upstream balance { 
        server yourIp1:3000;
        server yourIp2:3000;
    }
}
```

> 💡 **配置说明**：
> - 将 `yourdomainname` 替换为你的域名
> - 将 `domain.name_bundle.crt` 和 `domain.name.key` 替换为你的证书文件名
> - 将 `yourIp1:3000` 等替换为实际的应用服务器地址

---

## 🚀 3. 启动 Nginx 容器

```bash
docker run -d \
  --name docsify-nginx \
  -p 80:80 \
  -p 443:443 \
  -p 9020:9020 \
  -v /usr/local/myapp/nginx/cert:/etc/nginx/cert \
  -v /usr/local/myapp/nginx/nginx.conf:/etc/nginx/nginx.conf \
  nginx
```

### 📝 端口说明

| 端口 | 说明 |
|:---|:---|
| `80` | HTTP 端口 |
| `443` | HTTPS 端口 |
| `9020` | 自定义应用端口 |

### 📂 挂载说明

| 宿主机路径 | 容器路径 | 说明 |
|:---|:---|:---|
| `/usr/local/myapp/nginx/cert` | `/etc/nginx/cert` | SSL 证书 |
| `/usr/local/myapp/nginx/nginx.conf` | `/etc/nginx/nginx.conf` | 配置文件 |

---

> 💡 **提示**：Nginx 是一款高性能的 HTTP 和反向代理服务器，支持负载均衡、SSL/TLS 等功能！
