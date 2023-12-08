# GitHub上看不到提交记录

> github上看不到我的提交记录，发现提交的用户名不是自己的用户名
> 因为一台电脑既配置了公司的gitlab账号，又配置了github账号，使用的git config 配置的全局用户名是一个，导致提交正常，但是看不到github上的提交记录

1. 全局配置错误： 首先检查你本地 Git 的全局配置。使用以下命令可以查看当前的 Git 全局配置

    ```shell
    git config --global --list
    ```

确保 user.name 和 user.email 设置为你在 GitHub 上注册的用户名和邮箱。如果不是，请使用以下命令更改：

    ```shell
    git config --global user.name "Your Name"
    git config --global user.email "your_email@example.com"
    ```

2. 单个仓库配置： 有时候，单个仓库可能有自己的配置信息，可能会覆盖全局配置。在仓库目录下使用以下命令来检查并设置单个仓库的用户名和邮箱

    ```shell
    git config --local user.name "Your Name"
    git config --local user.email "your_email@example.com"
    ```

3. 强制修改提交历史： 如果之前的提交已经使用了错误的用户名和邮箱，你可以使用 git filter-branch 或者 git rebase 来修改提交历史。这样做会改变历史记录，谨慎操作。可以参考 Git 文档或其他资源学习如何修改提交历史。

4. 最后使用的方式

```shell
git filter-branch --commit-filter 'if [ "$GIT_AUTHOR_NAME" = "<old_username>" ];
  then
      export GIT_AUTHOR_NAME="<new_username>";
      export GIT_AUTHOR_EMAIL="<new_email>";
      git commit-tree "$@";
  else
      git commit-tree "$@";
  fi' -- --all
```