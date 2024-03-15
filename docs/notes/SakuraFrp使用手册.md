# SakuraFrp使用手册

官方链接：https://doc.natfrp.com/launcher/usage.html#macos-autostart

> 如果是Linux版本，前提条件需要安装zstd工具：

1. **安装编译工具和依赖项**：

   在编译 zstd 之前，你需要安装一些编译工具和依赖项。运行以下命令安装所需的软件包：

   ```sh
   bashCopy codesudo yum groupinstall "Development Tools"
   sudo yum install cmake
   ```

   这将安装编译工具和 CMake。

2. **下载并编译源代码**：

   首先，下载 zstd 的源代码。你可以从官方 GitHub 仓库（https://github.com/facebook/zstd/releases）下载最新的稳定版本。

   解压下载的压缩包，然后进入解压后的目录。在目录中执行以下命令编译 zstd：

   ```sh
   bashCopy code
   make
   ```

   这将编译 zstd。如果编译成功，你可以继续安装它。

3. **安装 zstd**：

   编译成功后，运行以下命令安装 zstd：

   ```sh
   bashCopy code
   sudo make install
   ```

   这将把 zstd 安装到系统中。

4. **验证安装**：

   最后，你可以使用以下命令验证 zstd 是否成功安装：

   ```sh
   bashCopy code
   zstd --version
   ```

   如果 zstd 安装成功，你应该会看到版本信息。



安装了启动器后，Web UI上要单独配置隧道，并且frpc还要单独执行命令行的命令，此时远程管理上才能看到隧道的状态



自定义域名验证步骤：

不需要添加WorkingDirectory=/ect/frpc 默认就是当前目录

启动了https后 生成的证书就在当前目录下

需要申请ssl证书 腾讯云上申请的免费证书 验证的时候选择自动验证 手动验证的时候 那个主键值需要注意一下.后缀名 加上可能是验证不了的 给的配置有问题 验证通过大概30分钟

下载apache版本的证书 Nginx不行 不是对应的crt和key

将.crt和.key放到对应的文件夹下（web ui开启了https后 会生成自生成的默认证书）

然后再到sakura frp web ui上验证域名是否备案



jenkins hook url配置的地方报错

```
Caused: sun.security.validator.ValidatorException: PKIX path building failed
```

这是由于java不信任证书的原因

```sh
keytool -import -trustcacerts -keystore $JAVA_HOME/lib/security/cacerts -storepass changeit -noprompt -alias myserver -file server.crt
```

jenkins需要重启

此时都能访问了，然后我们配置github webhooks时，发现一只delivery失败 500

将ssl配置禁用接口（这就是证书验证失败的原因），找了很多方法都无法解决，最后只能修改github webhooks中的校验配置了

![image-20240315143151236](http://img.minalz.cn/typora/image-20240315143151236.png)

重新验证delivery,推送是成功的