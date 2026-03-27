# OpenClaw配置插件

## 1.配置飞书

```bash
openclaw onboard --install-daemon

openclaw plugins install @openclaw/feishu

openclaw channels add


openclaw pairing approve feishu <配对码>
```







## 2.配置QQ

qq开放平台

注意：

白名单一旦设置了，就不能删除了，那么沙箱里面的机器人环境也会使用正式环境，想要继续本地测试，查询一下ip地址

```bash
curl ip.sb
```

然后将这个ip配置到白名单中，就可以继续使用沙箱本地测试了



```bash
curl -fsSL https://raw.githubusercontent.com/tencent-connect/openclaw-qqbot/main/scripts/upgrade-via-npm.sh \
  | bash -s -- --appid appid --secret 密钥
```





配置文件如下: 

```json
channels: {
    feishu: {
      enabled: true,
      appId: 'cli_a9329cc831781bb4',
      appSecret: '__OPENCLAW_REDACTED__',
      connectionMode: 'websocket',
      domain: 'feishu',
      groupPolicy: 'allowlist',
      groupAllowFrom: [
        'oc_afeff39c182ad0a6d67d85b1d5fbb2ef',
      ],
      dmPolicy: 'pairing',
      accounts: {
        main: {
          appId: 'cli_a9329cc831781bb4',
          appSecret: '__OPENCLAW_REDACTED__',
          botName: 'My OpenClaw AI助手',
        },
      },
    },
    qqbot: {
      appId: '1903666148',
      clientSecret: '__OPENCLAW_REDACTED__',
      sandbox: true,
      apiBase: 'https://sandbox.api.sgroup.qq.com',
    },
  }
```