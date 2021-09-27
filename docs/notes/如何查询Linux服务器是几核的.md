# 如何查询Linux服务器是几核的

```
grep -c 'processor' /proc/cpuinfo
  321  cat /proc/cpuinfo | grep "model name" && cat /proc/cpuinfo | grep "physical id"
  322  free -h
  323  fdisk -l
  324  free -h
  325  free -m
  326  cat /proc/cpuinfo | grep "model name" && cat /proc/cpuinfo | grep "physical id"


查看cpu核数
https://zhidao.baidu.com/question/552768001.html
```

