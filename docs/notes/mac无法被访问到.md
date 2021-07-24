# Mac无法被ping通

防火墙已经关闭的情况下,仍然无法访问

最终定位到VPN上,退出客户端,都不行,卸载后,ping通了,然后针对于查找问题,找到了解决方案

参考链接:

https://blog.csdn.net/weixin_39560657/article/details/111108974

这个 dropping 行为在安装后就生效。关闭客户端没有效果。需要在命令行手动卸载 kernel extension

在 Mac OS 下，当不需要连入 VPN 的时候，执行

```sh
sudo launchctl unload /Library/LaunchDaemons/com.checkpoint.epc.service.plist
sudo kextunload /Library/Extensions/cpfw.kext
```

重新开启 VPN 服务

```sh
sudo launchctl load /Library/LaunchDaemons/com.checkpoint.epc.service.plist
sudo kextload /Library/Extensions/cpfw.kext
```

另外，DMG 安装包里还有个卸载脚本，可以彻底卸载这些 extension 和自启动配置残留。所以这个安装包要留好

也就是说装了这个VPN客户端,虚拟机和Mac主机,就ping不通