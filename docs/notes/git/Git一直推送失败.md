# Git一直推送失败 22端口连接超时

> connect to host github.com port 22: Connection timed out

各种找方法改端口都试过了，无法成功，也进行了科学上网，仍然不行，结果第二天又可以了（没有任何改动），这是因为github的22端口关闭了

# git提交 443端口连接超时

由于https推送经常出现推送失败的情况，可以改成ssh的方式：
如
https://github.com/minalz/python-demo-01.git
更改为：
git remote set-url origin git@github.com:minalz/python-demo-01.git