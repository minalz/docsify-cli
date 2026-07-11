# 📖 博客简介

> 💡 技术笔记与学习分享 | Docsify 静态站点 | CI/CD 自动化部署

---

## 🚀 博客搭建方式

### 🐙 GitHub CI/CD 方案

- **技术栈**: Docker + Docsify + Jenkins + GitHub
- **状态**: ✅ 已实现 CI/CD 自动化部署

> ⚠️ **注意**: GitHub Webhook 触发速度较慢，但运行稳定

---

### 🚀 Gitee CI/CD 方案

- **技术栈**: Docker + Docsify + Jenkins + Gitee
- **状态**: ✅ 已实现 CI/CD 自动化部署

> 💡 **优势**: Gitee 部署速度超快，Webhook 触发成功率高

---

## 🔄 方案演变

> 📚 博客部署方案从服务器自托管到各类 Pages 平台的探索历程

1️⃣ **阿里云服务器 CICD**

> 💰 需要购买云服务器，存在一定成本

---

2️⃣ **腾讯云服务器 CICD**

> 💰 同样需要服务器资源，维护成本较高

---

3️⃣ **GitHub Pages**

> 🐢 免费托管，但国内访问速度较慢

---

4️⃣ **Gitee Pages**

> ⚡ 国内访问速度快，但 **2024年5月后已下线**

---

5️⃣ **CloudFlare Pages**

> 🌐 支持自定义域名，但国内访问速度一般，且需切换 DNS 解析

---

6️⃣ **腾讯云国外 EdgeOne Pages**

> ⚡ 访问速度快，但自定义域名需要海外实名认证

---

7️⃣ **腾讯云国内 EdgeOne Pages**

> 🏆 访问速度最快，国内域名已备案可直接配置

```mermaid
graph LR
    A[🖥️ 阿里云服务器 CICD] --> B[🖥️ 腾讯云服务器 CICD]
    B --> C[🐙 GitHub Pages]
    C --> D[🚀 Gitee Pages]
    D --> E[☁️ CloudFlare Pages]
    E --> F[🌍 腾讯云国外 EdgeOne]
    F --> G[🏠 腾讯云国内 EdgeOne]

    style A fill:#ffcccc
    style B fill:#ffcccc
    style D fill:#ffeb99
    style G fill:#ccffcc
```

## 📚 参考文档

> 📖 详细了解各类部署平台的对比与操作步骤

- [🌐 静态网站部署方案对比](pages部署方案.md)

---

## 📝 最终方案

> 🎯 **决策**: 选择腾讯云国内 EdgeOne Pages，免费且访问速度最快

---

## 📌 快速导航

- [💻 查看代码片段](codes/README.md)
- [📚 浏览学习笔记](notes/README.md)
- [🛠️ 软件环境配置](soft/README.md)
- [🐳 Docker 实践](docker/README.md)
- [🧮 算法题解](algorithm/README.md)
