# 🔎 SonarQube 扫描前端代码

> 📦 使用 SonarQube 进行前端代码质量检测

---

## 1️⃣ 安装插件

![安装前端插件](http://img.minalz.cn/typora/image-20210630005213646.png)

在 SonarQube 应用市场中搜索并安装前端语言支持插件（如 JavaScript、TypeScript 等）

---

## 2️⃣ 创建配置文件

在项目根路径下创建 `sonar-project.properties` 文件：

```properties
# 必须唯一，在 SonarQube 实例中不能重复
sonar.projectKey=front-pc-scanner

# 项目名称和版本（SonarQube 6.1 之前是必填项）
sonar.projectName=front-pc-scanner
sonar.projectVersion=1.0

# 源代码路径（相对于 sonar-project.properties 文件）
# Windows 系统中将 "\" 替换为 "/"
sonar.sources=./src

# 源代码编码（默认使用系统编码）
sonar.sourceEncoding=UTF-8
```

### 📝 配置说明

| 参数 | 说明 | 示例 |
|:---|:---|:---|
| `sonar.projectKey` | 项目唯一标识 | `front-pc-scanner` |
| `sonar.projectName` | 项目名称 | `front-pc-scanner` |
| `sonar.projectVersion` | 项目版本 | `1.0` |
| `sonar.sources` | 源代码路径 | `./src` |
| `sonar.sourceEncoding` | 源代码编码 | `UTF-8` |

---

## 3️⃣ 执行扫描

```bash
sonar-scanner
```

> 💡 确保已安装 `sonar-scanner` 命令行工具

---

## 4️⃣ 查看结果

![扫描结果](http://img.minalz.cn/typora/image-20210630005437459.png)

登录 SonarQube 控制台，查看代码质量报告，包括：
- 🐛 Bug 数量
- 🔒 安全漏洞
- 📈 代码异味
- ✅ 测试覆盖率

---

> 💡 **提示**：SonarQube 支持多种前端框架，包括 React、Vue、Angular 等，可以有效提升代码质量！
