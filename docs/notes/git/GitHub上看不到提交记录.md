# 👀 GitHub 上看不到提交记录

> 🔍 解决 GitHub 提交记录不显示问题 | 用户名配置 | 提交历史修复

---

## 📖 问题描述

GitHub 上看不到我的提交记录，发现提交的用户名不是自己的用户名。

**原因分析：**
- 一台电脑既配置了公司的 GitLab 账号，又配置了 GitHub 账号
- 使用的 `git config` 配置的全局用户名不是自己的
- 导致提交正常，但是看不到 GitHub 上的提交记录

---

## 🔧 解决方案

### 1️⃣ 检查全局配置

首先检查你本地 Git 的全局配置。使用以下命令可以查看当前的 Git 全局配置：

```bash
git config --global --list
```

确保 `user.name` 和 `user.email` 设置为你在 GitHub 上注册的用户名和邮箱。如果不是，请使用以下命令更改：

```bash
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"
```

### 2️⃣ 配置单个仓库

有时候，单个仓库可能有自己的配置信息，可能会覆盖全局配置。在仓库目录下使用以下命令来检查并设置单个仓库的用户名和邮箱：

```bash
git config --local user.name "Your Name"
git config --local user.email "your_email@example.com"
```

### 3️⃣ 强制修改提交历史

> ⚠️ **注意**：如果之前的提交已经使用了错误的用户名和邮箱，你可以使用 `git filter-branch` 或者 `git rebase` 来修改提交历史。这样做会改变历史记录，**谨慎操作**。

可以参考 Git 文档或其他资源学习如何修改提交历史。

### 4️⃣ 使用脚本命令提交

```bash
git filter-branch --commit-filter 'if [ "$GIT_AUTHOR_NAME" = "<old_username>" ];
  then
      export GIT_AUTHOR_NAME="<new_username>";
      export GIT_AUTHOR_EMAIL="<new_email>";
      git commit-tree "$@";
  else
      git commit-tree "$@";
  fi' -- --all
  
git push --force --all
```

### 5️⃣ 在 GitHub 上添加提交记录的邮箱

> ✅ **最终解决方案**（如果以上都不行）

**步骤：**

1. 登录到 GitHub 账户
2. 点击右上角的用户头像，选择 **"Settings"（设置）**
3. 在左侧菜单中选择 **"Emails"（邮件）**
4. 这里会列出你在 GitHub 上添加的所有邮箱
5. 你可以看到哪些邮箱被确认，以及它们的状态（验证过或未验证）
6. 添加你本地 Git 配置中使用的邮箱并验证

---

## 💡 预防措施

- 在使用新电脑或新环境时，第一时间配置正确的 Git 全局用户信息
- 定期检查 Git 配置是否与 GitHub 账户匹配
- 多账户环境下，建议使用 `--local` 配置而非 `--global`
