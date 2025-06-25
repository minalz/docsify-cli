使用了阿里云的镜像，pull image的时候仍然显示超时
如：
```shell
Error response from daemon: Get https://registry-1.docker.io/v2/: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
```

可以尝试更换其他的源
如：
```shell
{
	"registry-mirrors": [
	"https://docker.1panelproxy.com",
	"https://2a6bf1988cb6428c877f723ec7530dbc.mirror.swr.myhuaweicloud.com",
	"https://docker.m.daocloud.io",
	"https://hub-mirror.c.163.com",
	"https://mirror.baidubce.com",
	"https://your_preferred_mirror",
	"https://dockerhub.icu",
	"https://docker.registry.cyou",
	"https://docker-cf.registry.cyou",
	"https://dockercf.jsdelivr.fyi",
	"https://docker.jsdelivr.fyi",
	"https://dockertest.jsdelivr.fyi",
	"https://mirror.aliyuncs.com",
	"https://dockerproxy.com",
	"https://mirror.baidubce.com",
	"https://docker.m.daocloud.io",
	"https://docker.nju.edu.cn",
	"https://docker.mirrors.sjtug.sjtu.edu.cn",
	"https://docker.mirrors.ustc.edu.cn",
	"https://mirror.iscas.ac.cn",
	"https://docker.rainbond.cc"
	]
}
```