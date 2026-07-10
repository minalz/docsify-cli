# 🌐 SakuraFrp 使用手册

> 💡 内网穿透工具使用指南 | 域名配置 | SSL 证书配置 | 官方文档：[SakuraFrp](https://doc.natfrp.com/launcher/usage.html)

---

## 🔧 一、Linux 版本前置条件：安装 zstd 工具

### 1️⃣ 安装编译工具和依赖项

```bash
sudo yum group install "Development Tools"
sudo yum install cmake
```

这将安装编译工具和 CMake。

### 2️⃣ 下载并编译源代码

首先，下载 zstd 的源代码。你可以从[官方 GitHub 仓库](https://github.com/facebook/zstd/releases)下载最新的稳定版。

解压下载的压缩包，然后进入解压后的目录。在目录中执行以下命令编译 zstd：

```bash
make
```

这将编译 zstd。如果编译成功，你可以继续安装它。

### 3️⃣ 安装 zstd

编译成功后，运行以下命令安装 zstd：

```bash
sudo make install
```

这将把 zstd 安装到系统中。

### 4️⃣ 验证安装

```bash
zstd --version
```

如果 zstd 安装成功，你应该会看到版本信息。

---

## ❓ 二、常见问题

### 1️⃣ 如何执行

安装了启动器后，Web UI 上要单独配置隧道，并且 frpc 还要单独执行命令行的命令，此时远程管理上才能看到隧道的状态。

### 2️⃣ 自定义域名验证步骤

- 不需要添加 `WorkingDirectory=/etc/frpc`，默认就是当前目录
- 启动了 https 后，生成的证书就在当前目录下
- 需要申请 ssl 证书，腾讯云上申请的免费证书，验证的时候选择自动验证
- 手动验证的时候，那个主键值需要注意一下 `.后缀名`，加上可能是验证不了的，给的配置有问题
- 验证通过大概 30 分钟
- 下载 apache 版本的证书，Nginx 不行，不是对应的 crt 和 key
- 将 `.crt` 和 `.key` 放到对应的文件夹下（web ui 开启了 https 后，会生成自生成的默认证书）
- 然后再到 sakura frp web ui 上验证域名是否备案

### 3️⃣ Jenkins Hook URL 配置报错

**错误信息：**

```
Caused: sun.security.validator.ValidatorException: PKIX path building failed
```

**原因：** 这是由于 Java 不信任证书的原因。

**解决方案：**

```bash
keytool -import -trustcacerts -keystore $JAVA_HOME/lib/security/cacerts -storepass changeit -noprompt -alias myserver -file server.crt
```

> 💡 **提示**：Jenkins 需要重启。

### 4️⃣ 一直 Delivery 500

此时都能访问了，然后我们配置 GitHub Webhooks 时，发现一直 delivery 失败 500。

**解决方案：** 将 ssl 配置禁用接口（这就是证书验证失败的原因），找了很多方法都无法解决，最后只能修改 GitHub Webhooks 中的校验配置。

![image-20240315143151236](http://img.minalz.cn/typora/image-20240315143151236.png)

重新验证 delivery，推送是成功的。

### 5️⃣ 安装 SakuraFrp 报错

**问题：** 启动的时候，创建不了 `.config` 的文件，发现是新创建的 `natfrp` 用户没有 `/home/natfrp` 下创建文件的权限导致的。

**解决方案：**

```bash
sudo chown natfrp:natfrp /home/natfrp
```

重新启动：

```bash
systemctl start natfrp.service
sleep 3
systemctl stop natfrp.service
```
