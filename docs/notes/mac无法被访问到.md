# 🍎 Mac 无法被 ping 通

> 💡 macOS 系统网络问题排查 | VPN 冲突 | 防火墙配置

---

## ❌ 一、问题描述

防火墙已经关闭的情况下，仍然无法访问 Mac。

最终定位到 VPN 上，退出客户端都不行，卸载后，ping 通了。

---

## ✅ 二、解决方案

### 1️⃣ 问题原因

这个 `dropping` 行为在安装后就生效。关闭客户端没有效果。需要在命令行手动卸载 kernel extension。

### 2️⃣ 关闭 VPN 服务

在 Mac OS 下，当不需要连入 VPN 的时候，执行：

```bash
sudo launchctl unload /Library/LaunchDaemons/com.checkpoint.epc.service.plist
sudo kextunload /Library/Extensions/cpfw.kext
```

### 3️⃣ 重新开启 VPN 服务

```bash
sudo launchctl load /Library/LaunchDaemons/com.checkpoint.epc.service.plist
sudo kextload /Library/Extensions/cpfw.kext
```

> 💡 **提示**：DMG 安装包里还有个卸载脚本，可以彻底卸载这些 extension 和自启动配置残留。所以这个安装包要留好。

---

## 📌 三、总结

装了 VPN 客户端后，虚拟机和 Mac 主机之间会 ping 不通。

---

## 🔗 四、参考链接

- [VPN 导致 Mac 无法被 ping 通解决方案](https://blog.csdn.net/weixin_39560657/article/details/111108974)