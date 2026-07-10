# 📝 Spring 总结

> 💡 Spring 框架核心原理 | Bean 生命周期 | 依赖注入

---

## 📚 一、如何统一配置文件的标准？

**BeanDefinition** - 编程式

---

## 📚 二、如何对不同的配置文件进行解析？

**策略模式** → XML、Annotation

---

## 📚 三、Bean 的创建与生命周期

```
UserService 类 
→ 无参的构造函数反射（看设置哪个构造函数作为默认的，加 @Autowired 就行了）
→ 创建对象（这时候是原始对象，内部的属性是 null）
→ 依赖注入 (DI)
→ 初始化前 (@PostConstruct)
→ 初始化（实现 InitializingBean#afterPropertiesSet）
→ 初始化后 (AOP)
→ 代理对象
→ Bean
→ Map
```

> 💡 **核心要点**：存到 Spring 容器中的是代理对象（如果有 AOP 的话）。如果没有 AOP，那么就是原始对象。

---

## 📚 四、@Autowired 原理

**查找顺序：** ByType → ByName

- 如果 type 查到多个，再根据 name，名字要匹配
- 如果 type 查到一个，不再根据 name 查了，名字错了也不影响

---

## 📚 五、@Resource 原理

**查找顺序：** ByName → ByType

