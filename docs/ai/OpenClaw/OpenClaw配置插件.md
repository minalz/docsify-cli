# 🔌 OpenClaw 配置插件

> 🎯 集成第三方平台，扩展 AI 助手能力

---

## 目录

- [1. 配置飞书](#1-配置飞书)
- [2. 配置 QQ](#2-配置-qq)
- [配置文件示例](#配置文件示例)

---

## 1. 配置飞书

### 📦 安装步骤

**步骤 1：初始化 OpenClaw**

```bash
openclaw onboard --install-daemon
```

**步骤 2：安装飞书插件**

```bash
openclaw plugins install @openclaw/feishu
```

**步骤 3：添加频道**

```bash
openclaw channels add
```

**步骤 4：批准配对**

```bash
openclaw pairing approve feishu <配对码>
```

### 📋 飞书配置说明

| 配置项 | 说明 |
|:---|:---|
| `appId` | 飞书开放平台应用 ID |
| `appSecret` | 飞书开放平台应用密钥 |
| `connectionMode` | 连接模式（websocket 推荐）|
| `domain` | 域名（feishu 或 lark）|
| `groupPolicy` | 群组策略（allowlist 白名单模式）|
| `dmPolicy` | 私聊策略（pairing 配对模式）|

---

## 2. 配置 QQ

### 🎮 QQ 开放平台配置

#### ⚠️ 重要注意事项

**白名单问题：**
- 白名单一旦设置，**无法删除**
- 设置后，沙箱环境的机器人也会使用正式环境配置
- 如需继续本地测试，需要查询当前 IP 并添加到白名单

**查询公网 IP：**

```bash
curl ip.sb
```

将返回的 IP 地址配置到白名单中，即可继续使用沙箱进行本地测试。

### 📥 安装 QQ 机器人插件

```bash
curl -fsSL https://raw.githubusercontent.com/tencent-connect/openclaw-qqbot/main/scripts/upgrade-via-npm.sh \
  | bash -s -- --appid <你的appid> --secret <你的密钥>
```

---

## 配置文件示例

完整的频道配置示例：

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "appId": "cli_a9329cc831781bb4",
      "appSecret": "__OPENCLAW_REDACTED__",
      "connectionMode": "websocket",
      "domain": "feishu",
      "groupPolicy": "allowlist",
      "groupAllowFrom": [
        "oc_afeff39c182ad0a6d67d85b1d5fbb2ef"
      ],
      "dmPolicy": "pairing",
      "accounts": {
        "main": {
          "appId": "cli_a9329cc831781bb4",
          "appSecret": "__OPENCLAW_REDACTED__",
          "botName": "My OpenClaw AI助手"
        }
      }
    },
    "qqbot": {
      "appId": "1903666148",
      "clientSecret": "__OPENCLAW_REDACTED__",
      "sandbox": true,
      "apiBase": "https://sandbox.api.sgroup.qq.com"
    }
  }
}
```

### 🔑 配置参数说明

#### 飞书配置

| 参数 | 类型 | 说明 |
|:---|:---|:---|
| `enabled` | boolean | 是否启用飞书频道 |
| `appId` | string | 飞书应用 ID |
| `appSecret` | string | 飞书应用密钥 |
| `connectionMode` | string | 连接模式：websocket / webhook |
| `domain` | string | 域名：feishu（国内）/ lark（海外）|
| `groupPolicy` | string | 群组策略：allowlist / denylist / all |
| `groupAllowFrom` | array | 允许响应的群组 ID 列表 |
| `dmPolicy` | string | 私聊策略：pairing / allow / deny |
| `botName` | string | 机器人显示名称 |

#### QQ 配置

| 参数 | 类型 | 说明 |
|:---|:---|:---|
| `appId` | string | QQ 开放平台应用 ID |
| `clientSecret` | string | 应用密钥 |
| `sandbox` | boolean | 是否使用沙箱环境 |
| `apiBase` | string | API 基础地址 |

---

## 💡 最佳实践

### 1. 安全建议

- ✅ 不要在配置文件中明文存储密钥
- ✅ 使用环境变量管理敏感信息
- ✅ 定期更新应用密钥
- ✅ 限制白名单范围

### 2. 开发测试流程

1. **沙箱环境测试**
   - 设置 `sandbox: true`
   - 使用测试账号
   - 验证功能正常

2. **生产环境部署**
   - 设置 `sandbox: false`
   - 配置正式环境密钥
   - 添加生产群组到白名单

### 3. 多平台管理

- 为不同平台创建独立的应用
- 分别管理各自的密钥和权限
- 使用不同的机器人名称区分

---

## 🔗 相关资源

- 📖 [飞书开放平台](https://open.feishu.cn/)
- 🎮 [QQ 开放平台](https://q.qq.com/)
- 📦 [OpenClaw 插件市场](https://openclaw.ai/plugins)
- 💬 [社区支持](https://github.com/openclaw/openclaw/discussions)
