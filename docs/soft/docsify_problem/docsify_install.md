# Linux安装Docsify文档博客

## 1.1 推荐的安装方法

参考链接：https://www.cnblogs.com/zhuawang/p/7617176.html

但是会出现一个问题，如果docsify一直不成功，并显示命令

```shell
-bash: docsify: command not found
```

也需要配置一下软链接

```shell
ln -s /usr/local/nodejs/bin/docsify /usr/local/bin/
```

再看是否安装成功了

```shell
docsify -v
```

结果

```she
docsify-cli version:
  4.4.2
```



## 1.2 源码安装

+ 安装wget

  ```bash
  yum install -y gcc make gcc-c++ openssl-devel wget
  ```

+ 想存到哪个目录下

  ```bash
  /usr/local/myapp
  ```

+ 下载NodeJs

  ```bash
  wget https://nodejs.org/dist/v12.16.1/node-v12.16.1.tar.gz
  ```

+ 解压

  ```bash
  tar -zvxf node-v12.16.1.tar.gz
  ```

+ 进入文件夹

  ```bash
  cd node-v12.16.1
  ```

+ 编译

  ```bash
  ./configure
  ```

+ 安装

  ```bash
  make && make install
  ```

+ 测试是否安装成功

  ```bash
  node -v
  ```

  如果出现`v8.17.0`,那么说明安装成功

  ```bash
  npm -v
  ```

  如果出现`6.13.4`,那么说明安装成功

## 1.3 快速开始

推荐全局安装 `docsify-cli` 工具，可以方便地创建及在本地预览生成的文档。

```bash
npm i docsify-cli -g
```

## 1.4 初始化项目

如果想在项目的 `./docs` 目录里写文档，直接通过 `init` 初始化项目。

```bash
docsify init ./docs
```

## 1.5 开始写文档

初始化成功后，可以看到 `./docs` 目录下创建的几个文件

- `index.html` 入口文件
- `README.md` 会做为主页内容渲染
- `.nojekyll` 用于阻止 GitHub Pages 忽略掉下划线开头的文件

直接编辑 `docs/README.md` 就能更新文档内容，当然也可以添加更多页面。

## 1.6 本地预览

通过运行 `docsify serve` 启动一个本地服务器，可以方便地实时预览效果。默认访问地址 http://localhost:3000。

```bash
docsify serve docs
```

