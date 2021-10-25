# Docker命令

1. 根据镜像创建容器 

   ```sh
   docker run -d --name -p 9090:8080 my-tomcat tomcat 
   ```

2. 查看运行中的container 

   ```sh
   docker ps 
   ```

3. 查看所有的container[包含退出的] 

   ```sh
   docker ps -a 
   ```

4. 删除container 

   ```sh
   docker rm containerid 
   
   docker rm -f $(docker ps -a) 删除所有container 
   
   ##单个镜像删除，相当于：docker rmi redis:latest
   docker rmi redis
   ##强制删除(针对基于镜像有运行的容器进程)
   docker rmi -f redis
   ##多个镜像删除，不同镜像间以空格间隔
   docker rmi -f redis tomcat nginx
   ##删除本地全部镜像
   docker rmi -f $(docker images -q)
   ```

5. 进入到一个container中 

   ```sh
   # 方式一
   命令：docker exec -it 容器id bash
   
   # 方式二
   命令：docker attach 容器id bash
   
   exec：进入容器后，开启一个新的终端，可以在里面操作；
   attach：进入容器正在执行的终端，不会启动新的终端进程；
   
   ##使用run方式在创建时进入
   docker run -it centos /bin/bash
   ##关闭容器并退出
   exit
   ##仅退出容器，不关闭
   快捷键：Ctrl + P + Q
   
   ```

6. 根据container生成image 

   ```sh
   docker commit my-centos new-centos-image 
   ```

7. 查看某个container的日志 

   ```sh
   docker logs container 
   
   ##查看redis容器日志，默认参数
   docker logs rabbitmq
   ##查看redis容器日志，参数：-f  跟踪日志输出；-t   显示时间戳；--tail  仅列出最新N条容器日志；
   docker logs -f -t --tail=20 redis
   ##查看容器redis从2021年08月10日后的最新10条日志。
   docker logs --since="2021-08-10" --tail=10 redis
   
   ```

8. 查看容器资源使用情况 

   ```sh
   docker stats 
   ```

9. 查看容器详情信息 

   ```sh
   docker inspect container 
   ```

10. 停止/启动容器

    ```sh
    docker stop/start container
    ```

11. 如何从docker容器中下载文件

    ```shell
    # docker cp 容器id:容器内路径  目的主机路径
    docker cp container_created:path <path>
    ```

12. 如何将文件从本机上传到docker容器

    ```shell
    docker cp container_created:path <path>
    ```


13. docker login 脚本登陆的方式

    > 明文登录 不安全

    ```shell
    cat pwd.txt | docker login -u [镜像库账户名] [镜像库] --password-stdin
    ```

    > 通过 STDIN 输入密码 查看指令是看不到密码的

    ```shell
    cat pwd.txt | docker login -u [镜像库账户名] [镜像库] --password-stdin
    ```

