# 🌐 静态网站部署方案对比

> 💡 本文档整理了几种常用的静态网站托管平台，包括 Gitee Pages、GitHub Pages 和 Cloudflare Pages 的特点与部署步骤

---

## 📋 方案概览

| 平台 | 自定义域名 | 国内访问 | 备注 |
|------|-----------|---------|------|
| Gitee Pages | ❌ | ⚡ 快 | **2024年5月后已下线** |
| GitHub Pages | ✅ | 🐢 慢 | 国际访问快，国内需优化 |
| Cloudflare Pages | ✅ | 🐢 慢 | 需绑定 GitHub 仓库部署 |
| 腾讯云国外 EdgeOne | ❌ | ⚡ 快 | 无需实名，速度优秀 |
| 腾讯云国内 EdgeOne | ✅ | ⚡ 快 | 需域名备案 |

---

## 1️⃣ Gitee Pages

> ⚠️ **服务已下线**: Gitee Pages 个人免费版已于 **2024年5月** 停止服务，新项目无法创建，已有项目可能无法更新

---

## 2️⃣ GitHub Pages

- ✅ 支持自定义域名
- 🐢 国内访问速度较慢（可通过 CDN 优化）

![](http://img.minalz.cn/typora/image-20260711224823662.png)

---

## 3️⃣ Cloudflare Pages

- ✅ 支持自定义域名
- 🐢 国内访问速度一般
> 💡 **自定义域名建议**: 想配置DNS，要把腾讯云的DNS解析换成Cloudflare的DNS解析，对于我来说是本末倒置，所以后续没有配置自定义域名了，另外对于GitHub Pages的访问来说，速度反而更慢一点

---

## 4️⃣ 腾讯云国外 EdgeOne Makers

📋 **控制台**: [https://console.tencentcloud.com/edgeone/makers/project/makers-tu74zqdqkaas/setting](https://console.tencentcloud.com/edgeone/makers/project/makers-tu74zqdqkaas/setting)

> ⚠️ **注意**: 只能使用默认域名，想自定义域名需要实名认证，因为这是用于大陆外的地址注册的，没有外面的身份证和护照等是无法完成实名认证的

![腾讯云国外 EdgeOne](http://img.minalz.cn/typora/image-20260711223839198.png)

> 💡 **速度优势**: 速度比 GitHub Pages 和 Cloudflare Pages 快很多

---

## 5️⃣ 腾讯云国内 EdgeOne Makers

📋 **控制台**: [https://console.cloud.tencent.com/edgeone/makers](https://console.cloud.tencent.com/edgeone/makers)

![腾讯云国内 EdgeOne 1](http://img.minalz.cn/typora/image-20260711225248283.png)

![腾讯云国内 EdgeOne 2](http://img.minalz.cn/typora/image-20260711224450593.png)

> 💡 **自定义域名**: 因为国内我的域名是实名和备案过的，所以可以直接配置

---

## 📖 Cloudflare Pages 部署教程

### 🔗 3.1 访问地址

📋 **控制台**: [https://dash.cloudflare.com/](https://dash.cloudflare.com/)

---

### 🧭 3.2 找到 Worker & Pages 入口

![Worker & Pages 入口](http://img.minalz.cn/typora/image-20260711181245357.png)

---

### ➕ 3.3 创建应用

点击 **Create application**:

![Create application](http://img.minalz.cn/typora/image-20260711181315748.png)

---

### 🚀 3.4 配置 Pages - Get Started

![Pages Get Started](http://img.minalz.cn/typora/image-20260711181344866.png)

---

### 🔗 3.5 选择 GitHub 项目

选择需要部署的 GitHub 仓库:

![选择 GitHub 项目](http://img.minalz.cn/typora/image-20260711181415111.png)

---

### ⚙️ 3.6 配置 Root Directory

> ⚠️ **非常重要**: Root directory 配置错误会导致部署失败，请确保填写正确的构建输出目录

![配置 Root Directory](http://img.minalz.cn/typora/image-20260711181526829.png)

---

### 💾 3.7 保存并部署

点击 **Save and Deploy**:

![Save and Deploy](http://img.minalz.cn/typora/image.png)

> 💡 **提示**: 首次部署如果显示失败不用管，查看管理应用的地方是否添加成功即可

---

### 🛠️ 3.8 管理页面

部署完成后，可在管理页面查看项目状态:

![管理页面](http://img.minalz.cn/typora/image-20260711182236784.png)

---

### 🌐 3.9 访问地址

部署成功后，Cloudflare 会分配一个默认域名供访问:

![访问地址](http://img.minalz.cn/typora/image-20260711182307884.png)

---

## 📌 总结建议

| 场景 | 推荐方案 |
|------|---------|
| 纯国内用户访问 | 🚫 Gitee Pages 已不可用，建议 Vercel 或自托管 |
| 国际用户为主 | ✅ GitHub Pages |
| 需要 CDN 加速 | ✅ Cloudflare Pages |
| 追求国内访问速度 | ✅ 腾讯云国外 EdgeOne（免实名）/ 腾讯云国内 EdgeOne（需备案） |
| 追求简单免费 | ✅ GitHub Pages / Vercel |
