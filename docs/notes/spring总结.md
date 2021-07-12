# Spring总结

## 1.如何统一配置文件的标准?

BeanDefinition 编程式

## 2.如何对不同的配置文件进行解析?

策略模式 -> xml、Annotation

## 3.Bean的创建 生命周期?

UserService类 -> 无参的构造函数反射(看设置哪个构造函数作为默认的,加@AutoWired就行了) -> 创建对象(这时候是原始对象,内部的属性是null) -> 依赖注入(DI) -> 初始化前(@PostConstruct) -> 初始化(实现InitializingBean#afterPropertiesSet) -> 初始化后(AOP) -> 代理对象 -> Bean -> Map

存到Spring容器中的是代理对象(如果有AOP的话),如果没有AOP,那么就是原始对象

## 4.@AutoWired原理

ByType -> ByName

如果type查到多个,再根据name,名字要对象

如果type查到一个,不再根据name查了,名字错了也不影响

## 5.@resourse原理

ByName -> ByType

