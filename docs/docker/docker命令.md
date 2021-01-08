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
   ```

5. 进入到一个container中 

   ```sh
   docker exec -it container bash 
   ```

6. 根据container生成image 

   ```sh
   docker commit my-centos new-centos-image 
   ```

7. 查看某个container的日志 

   ```sh
   docker logs container 
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
    docker cp container_created:path <path>
    ```

12. 如何将文件从本机上传到docker容器

    ```shell
    docker cp container_created:path <path>
    ```


13. docker login 脚本登陆的方式

    + 明文登录 不安全

      ```shell
      cat pwd.txt | docker login -u [镜像库账户名] [镜像库] --password-stdin
      ```

    + 通过 STDIN 输入密码 查看指令是看不到密码的

      ```shell
      cat pwd.txt | docker login -u [镜像库账户名] [镜像库] --password-stdin
      ```

