# 🐧 Linux 安装 Docsify 文档博客

> 💡 在 Linux 环境下安装 Docsify 静态文档博客的完整步骤

---

## 📥 1. 推荐的安装方法

参考链接：[cnblogs 教程](https://www.cnblogs.com/zhuawang/p/7617176.html)

> **注意**：如果 docsify 一直安装不成功，并显示以下错误：
> ```shell
> -bash: docsify: command not found
> ```
> 需要配置一下软链接：
> ```shell
> ln -s /usr/local/nodejs/bin/docsify /usr/local/bin/
> ```
> 再检查是否安装成功：
> ```shell
> docsify -v
> ```
> 结果：
> ```bash
> docsify-cli version:
>   4.4.2
> ```

## 🏗️ 2. 源码安装

### 2.1 安装依赖

```bash
yum install -y gcc make gcc-c++ openssl-devel wget
```

### 2.2 下载 NodeJs

```bash
# 进入想存储的目录，例如
/usr/local/myapp

# 下载 NodeJs
wget https://nodejs.org/dist/v12.16.1/node-v12.16.1.tar.gz
```

### 2.3 解压并安装

```bash
# 解压
tar -zvxf node-v12.16.1.tar.gz

# 进入文件夹
cd node-v12.16.1

# 编译
./configure

# 安装
make && make install
```

### 2.4 测试是否安装成功

```bash
node -v
# 如果出现版本号（如 v8.17.0），则说明安装成功

npm -v
# 如果出现版本号（如 6.13.4），则说明安装成功
```

## 🚀 3. 快速开始

推荐全局安装 `docsify-cli` 工具，可以方便地创建及在本地预览生成的文档。

```bash
npm i docsify-cli -g
```

## 📁 4. 初始化项目

如果想在项目的 `./docs` 目录里写文档，直接通过 `init` 初始化项目。

```bash
docsify init ./docs
```

## ✍️ 5. 开始写文档

初始化成功后，可以看到 `./docs` 目录下创建的几个文件：

- `index.html`：入口文件
- `README.md`：会做为主页内容渲染
- `.nojekyll`：用于阻止 GitHub Pages 忽略掉下划线开头的文件

直接编辑 `docs/README.md` 就能更新文档内容，当然也可以添加更多页面。

## 👀 6. 本地预览

通过运行 `docsify serve` 启动一个本地服务器，可以方便地实时预览效果。默认访问地址 http://localhost:3000。

```bash
docsify serve docs
```

