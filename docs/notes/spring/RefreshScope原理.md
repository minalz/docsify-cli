# 🔄 @RefreshScope 原理详解：为什么 YAML 配置变更后 Config 类能感知到？

> 💡 深入理解 Spring Cloud `@RefreshScope` 的底层实现机制。

## 📑 目录

- [一、核心问题：为什么 Config 类能"感知"到配置变化？](#一核心问题为什么-config-类能感知到配置变化)
- [二、底层原理：五步拆解](#二底层原理五步拆解)
- [三、为什么普通单例 Bean 做不到？](#三为什么普通单例-bean-做不到)
- [四、关键源码类速查](#四关键源码类速查)
- [五、使用示例](#五使用示例)
- [六、注意事项](#六注意事项)

---

## 🎯 一、核心问题：为什么 Config 类能"感知"到配置变化？

**一句话回答：它不是"感知"到配置变了然后修改字段，而是直接销毁旧 Bean，下次调用时重新创建一个新 Bean，让 Spring 在创建过程中从最新的 `Environment` 注入新值。**

普通 Spring Bean（单例）在启动时创建一次，`@Value` 注入的值就固化在字段里了。即使后面 `Environment` 里的配置值变了，Bean 实例里的字段值也不会变。

而加了 `@RefreshScope` 的 Bean 走的是另一条路：

```text
配置变更 → 清空缓存 → 下次调用时重新创建 Bean → 从最新 Environment 注入新值
```

> 💡 **核心思想**：Config 类不是"感知"到了变化，而是**被销毁后重生了一次**，重生时读到的就是新配置。

---

## 🔧 二、底层原理：五步拆解

### 1. Step 1：@RefreshScope 的本质是自定义 Scope

```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Scope("refresh")  // ← 核心：自定义作用域
@Documented
public @interface RefreshScope {
    ScopedProxyMode proxyMode() default ScopedProxyMode.TARGET_CLASS; // CGLIB 代理
}
```

`@RefreshScope` 等价于 `@Scope("refresh")`，它告诉 Spring：**这个 Bean 不是单例，而是 `refresh` 作用域的**。

Spring 容器启动时，`GenericScope`（`RefreshScope` 的父类）作为 `BeanFactoryPostProcessor` 执行：

```java
beanFactory.registerScope("refresh", this);  // 把 "refresh" 作用域注册到容器
```

这样 Spring 就知道遇到 `scope="refresh"` 的 Bean 该怎么处理了。

---

### 2. Step 2：Spring 不会给你真实 Bean，而是给你一个代理

被 `@RefreshScope` 标注的类，Spring 在扫描时会生成 **两个 BeanDefinition**：

| BeanDefinition | 类型 | 作用 |
|:---|:---|:---|
| `scopedTarget.xxx` | 你的真实类 | 用来创建真实实例 |
| `xxx` | `LockedScopedProxyFactoryBean` | 用来创建代理对象 |

当你 `@Autowired` 注入或从容器中 `getBean("xxx")` 时，拿到的是**代理对象**（CGLIB 生成的子类），而不是真实实例。

这个代理对象内部持有一个 `TargetSource`，每次你调用代理对象的方法时，它会先问 `TargetSource`："我要用真实对象了，给我拿一个"。

---

### 3. Step 3：真实 Bean 被缓存在 GenericScope 中

`GenericScope` 内部维护了一个缓存（`BeanLifecycleWrapperCache`）：

```java
// 简化逻辑
public Object get(String name, ObjectFactory<?> objectFactory) {
    BeanLifecycleWrapper wrapper = this.cache.get(name);
    if (wrapper == null) {
        // 缓存里没有，创建新实例
        wrapper = new BeanLifecycleWrapper(name, objectFactory);
        this.cache.put(name, wrapper);
    }
    return wrapper.getBean();  // 返回真实 Bean 实例
}
```

- **第一次调用**：缓存为空，创建真实 Bean，Spring 正常走依赖注入（从 `Environment` 读配置），然后放进缓存
- **后续调用**：直接从缓存取，不再创建，性能同单例

---

### 4. Step 4：配置变更时，触发刷新链路

当 Nacos/Apollo/ConfigServer 检测到配置变更，或你手动调用 `/actuator/refresh` 时，最终都会走到：

```java
// ContextRefresher.java
public synchronized Set<String> refresh() {
    // ① 重新加载外部配置，更新 Environment 中的 PropertySource
    Set<String> keys = refreshEnvironment();

    // ② 清空 RefreshScope 的所有缓存
    this.scope.refreshAll();

    return keys;
}
```

`refreshEnvironment()` 做了三件事：

1. 重新读取 YAML/Properties 文件，生成新的 `PropertySource`
2. 替换 `Environment` 中的旧 `PropertySource`
3. 发布 `EnvironmentChangeEvent`（通知 `@ConfigurationProperties` 重新绑定）

`scope.refreshAll()` 做了关键的一步：

```java
// RefreshScope.java
public void refreshAll() {
    super.destroy();  // ← 清空 GenericScope 的缓存！
    this.context.publishEvent(new RefreshScopeRefreshedEvent());
}
```

> ⚠️ **注意**：这里只是清空缓存，并没有立即创建新 Bean。旧 Bean 实例被销毁（如果有 `DisposableBean` 会触发 `destroy()` 方法）。

---

### 5. Step 5：下次调用时，代理触发 Bean 重建

缓存被清空后，你的代码再次调用 Config 类的方法：

```text
你的代码 → 调用代理对象.method()
              ↓
        代理对象检查 TargetSource
              ↓
        TargetSource 调用 GenericScope.get()
              ↓
        发现缓存为空（已被 refreshAll 清空）
              ↓
        重新执行 objectFactory.getBean()
              ↓
        Spring 创建新实例 → @Value 从最新 Environment 注入新值
              ↓
        新实例放入缓存，方法正常执行
```

> 💡 **懒重建**：不是刷新时立即重建所有 Bean，而是等到真正用到时才创建，避免不必要的开销。

---

## 📊 三、为什么普通单例 Bean 做不到？

| 对比 | 普通单例 Bean | @RefreshScope Bean |
|:---|:---|:---|
| **创建时机** | 启动时一次 | 启动时创建代理，真实 Bean 延迟创建 |
| **@Value 注入** | 启动时从 Environment 注入，字段值固化 | 每次重建时从最新 Environment 注入 |
| **配置变更后** | 字段值不变 | 旧实例销毁，下次调用重建新实例 |
| **代理** | 无 | CGLIB 代理，拦截方法调用 |

普通单例 Bean 的 `@Value` 字段在启动时通过反射 `set` 进去后就定死了，Spring 不会回头去修改它。而 `@RefreshScope` 通过**代理 + 缓存 + 延迟重建**的机制，让"获取最新配置"这件事发生在 Bean 的重新创建阶段。

---

## 📖 四、关键源码类速查

| 类名 | 职责 |
|:---|:---|
| `RefreshScope` | 自定义 Scope 实现，继承 `GenericScope` |
| `GenericScope` | 核心：缓存管理、Bean 生命周期包装、代理创建 |
| `LockedScopedProxyFactoryBean` | 生成 CGLIB 代理，拦截方法调用，加锁保证线程安全 |
| `BeanLifecycleWrapper` | 包装真实 Bean 实例，管理创建和销毁 |
| `ContextRefresher` | 刷新入口：更新 Environment + 调用 `refreshAll()` |
| `RefreshEventListener` | 监听 `RefreshEvent`，触发 `ContextRefresher.refresh()` |

---

## 💻 五、使用示例

### 1. 引入依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter</artifactId>
</dependency>
```

### 2. 暴露 refresh 端点

```yaml
management:
  endpoints:
    web:
      exposure:
        include: refresh
```

### 3. 在需要热更新的 Bean 上加 @RefreshScope

```java
@Component
@RefreshScope
public class AppConfig {

    @Value("${app.timeout:30}")
    private int timeout;

    @Value("${app.feature-flag:false}")
    private boolean featureFlag;

    // getter...
}
```

或者配合 `@ConfigurationProperties`：

```java
@Component
@ConfigurationProperties(prefix = "app")
@RefreshScope
public class AppProperties {
    private int timeout;
    private boolean featureFlag;
    // getter/setter...
}
```

### 4. 触发刷新

```bash
# 手动触发
curl -X POST http://localhost:8080/actuator/refresh

# 返回变更的 key 列表
# ["app.timeout", "app.feature-flag"]
```

---

## ⚠️ 六、注意事项

1. **@RefreshScope 只对代理 Bean 生效**：静态变量、普通单例 Bean 中的 `@Value` 不会自动更新
2. **数据库连接池等基础设施不能热刷新**：如 DataSource 配置变更后，需要自定义 `RefreshScope` 的 `destroy()` 逻辑来重建连接池
3. **懒重建机制**：刷新时不会立即重建 Bean，而是等到下次调用时才创建，避免不必要的开销
4. **线程安全**：`LockedScopedProxyFactoryBean` 内部加了锁，保证并发场景下 Bean 创建的安全性
5. **生产环境建议**：微服务场景下配合 Spring Cloud Bus + 消息队列实现"一处修改，全局刷新"

---

## 📝 总结

> 💡 **提示**：`@RefreshScope` 不是让 Bean"感知"配置变化，而是让 Bean 变成一个**"可丢弃、可重建"**的代理对象。配置变更时清空缓存，下次调用时 Spring 重新创建 Bean 实例，自然就从最新的 `Environment` 中注入了最新配置值。
