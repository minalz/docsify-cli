# FTP上传文件

## 1.引入包

```java
<dependency>
    <groupId>commons-net</groupId>
    <artifactId>commons-net</artifactId>
    <version>3.3</version>
</dependency>
```

## 2.上传方法

首先需要有一个FTP的服务端，安装方法见[FTP安装](https://blog.csdn.net/putao2062/article/details/79668880)

```java
/**
 * FTP工具类
 */
public class FTPUtils {

    private static String host = "你的FTP服务器的IP";
    private static int port = 21;
    private static String username = "ftp的账号";
    private static String password = "ftp账号的密码";
    private static String uploadPath = "上传路径";

    public static Boolean uloadFile(String filePath){
        // 创建客户端对象
        FTPClient ftp = new FTPClient();
        Boolean result = Boolean.TRUE;
        InputStream local=null;
        try {
            // 连接ftp服务器
            ftp.connect(host, port);
            if (!FTPReply.isPositiveCompletion(ftp.getReplyCode())) {
                throw new Exception("FTP服务器无响应");
            }
            if (!ftp.login(username, password)) {
                throw new Exception("FTP用户名密码错误");
            }
            // 检查上传路径是否存在 如果不存在返回false
            boolean flag = ftp.changeWorkingDirectory(uploadPath);
            if(!flag){
                // 创建上传的路径  该方法只能创建一级目录，在这里如果/home/ftpuser存在则可创建image
                ftp.makeDirectory(uploadPath);
            }
            // 指定上传路径
            ftp.changeWorkingDirectory(uploadPath);
            // 指定上传文件的类型  二进制文件
            ftp.setFileType(FTP.BINARY_FILE_TYPE);
            // 读取本地文件
            File file = new File(filePath);
            local = new FileInputStream(file);
            // 第一个参数是文件名 因为如果有一个进程在处理文件 而文件又没有上传完 那么就会出现文件缺失的
            // 问题，所以这里用了一个临时文件 等上传完之后 再将名称改成真正的名称
            result = ftp.storeFile(file.getName() + ".tmp", local);
            if(result){
                ftp.rename(file.getName() + ".tmp", file.getName());
            }
        } catch (Exception e) {
            result = Boolean.FALSE;
            e.printStackTrace();
        } finally {
            try {
                // 关闭文件流
                local.close();
                // 退出
                ftp.logout();
                // 断开连接
                ftp.disconnect();
            } catch (IOException e) {
                result = Boolean.FALSE;
                e.printStackTrace();
            }
        }
        return result;
    }
}
```

## 3.测试

```java
@Test
public void test6(){
    String filePath = "D:\\test.txt";
    Boolean result = FTPUtils.uloadFile(filePath);
    System.out.println("操作结果 -- " + result);
}
```