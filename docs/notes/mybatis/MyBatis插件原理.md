# MyBatis插件原理 

## 一.编写拦截器：三个步骤

 1.实现Interceptor接口
 2.实现响应的方法，最关键的是intercept()方法，里面是拦截的逻辑，需要增强的功能代码就写在这里
 3.在拦截器类上加上朱姐，注解签名指定了需要拦截的对象、拦截的方法、参数(因为方法有不同的重载，所以要指定具体的参数)
 原理：
 代理模式+责任链模式
 可以进行拦截的四个对象：
 1.Executor 上层的对象，SQL执行全过程，包括组装参数，组装结果集返回和执行SQL过程
 --> 因为Executor有可能被二级缓存装饰，那么是先代理再装饰，还是先装饰再代理呢？
 Executor会先拦截到CachingExecutor或者BaseExecutor
 DefaultSqlSessionFactory.openSessionFromDataSource():
 看执行步骤后得知：先创建基本类型，再二级缓存装饰，最后插件拦截。所以这里拦截的是CachingExecutor.
 2.StatementHandler 执行SQL的过程，最常用的拦截对象
 3.ParameterHandler SQL参数组装的过程
 4.ResultSetHandler 结果集的组装

##  二.插件实现原理

 1.代理类怎么创建？动态代理是JDK Proxy还是Cglib？怎么样创建代理？
 -> 调用InterceptorChain的pluginAll()方法，做了什么事？
 遍历InterceptorChain，使用Interceptor实现类的plugin()方法，对目标核心对象进行代理
 这个plugin()方法是我们自己实现的，要返回一个代理对象
 如果是JDK动态代理，那我们必须要写一个实现了InvocationHandler接口的触发管理类。然后用Proxy.newProxyInstance()创建一个代理对象
 MyBatis的插件机制已经把这些类封装好了，它已经提供了一个触发管理类Plugin，实现了InvocationHandler
 创建代理对象的newProxyInstance()在这个类里面也进行了封装，就是wrap()方法
 2.代理类在什么时候创建？实在解析配置的时候创建，还是获取会话的时候创建，还是在调用的时候创建？
 -> 对Executor拦截的代理类是openSession()的时候创建的
 StatementHandler是SimpleExecutor.doQuery()创建的，里面包含了ParamterHandler和ResultSetHandler的创建和代理
 3.核心对象被代理之后，调用的流程是怎么样的？怎么依次执行多个插件的逻辑？在执行完了插件的逻辑之后，怎么执行原来的逻辑？
 -> 如果对象被调用了多次，会继续调用下一个拆案的逻辑，再走一次Plugin的invoke()方法
 配置的顺序和执行的顺序是相反的。InterceptorChain的List是按照插件从上往下的顺序解析、添加的，而创建代理的时候也是按照List的顺序代理。
 那么执行的时候当然是从最后代理的对象开始

| 插件定义顺序 | 代理顺序 | 代理执行顺序(invoke()) |
| ------------ | -------- | ---------------------- |
| 插件1        | 1        | 3                      |
| 插件2        | 2        | 2                      |
| 插件3        | 3        | 1                      |

 总结:
 Interceptor: 自定义插件需要实现接口，实现4个方法
 InterceptorChain: 配置的插件解析后会保存在Configuration的InterceptorChain中
 Plugin: 触发管理类，还可以用来创建代理对象
 Invocation: 对被代理类进行包装，可以调用proceed()调用到被拦截的方法

## 三.应用场景分析

| 作用         | 描述                                                         | 实现方式                                                     |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 水平分表     | 一张费用表按月度拆分成12张表。<br />fee_202101-202112。<br />当查询条件出现月度(tran_month)时，把select语句中的逻辑表名修改为对应的月份表 | 对query update方法进行拦截，<br />在接口上添加注解，通过反射获取接口注解，<br />根据注解上配置的参数进行分表，<br />修改原SQL，例如id取模，按月分表 |
| 数据脱敏     | 手机号和身份证在数据库完整存储。<br />但是返回给用户，屏蔽手机号的中间四位。<br />屏蔽身份证号中的出生日期。 | query--对结果集脱敏                                          |
| 菜单权限控制 | 不同的用户登录，<br />查询菜单权限表时获得不同的结果，在前端展示不同的菜单 | 对query方法进行拦截，在方法上添加注解，<br />根据权限配置，以及用户登录信息，在SQL加上权限过滤条件 |

## 四.Spring如何集成MyBatis的

1.在Spring的配置文件中配置了一个SqlSessionFactoryBean，它实现了三个接口：InitializingBean、FactoryBean、ApplicationListener

2.通过定义一个实现了InitializingBean接口的SqlSessionFactoryBean类，里面有一个afterPropertiesSet()方法会在bean的属性值设置完的时候被调用。Spring在启动初始化这个Bean的时候，完成了解析和工厂类的创建工作。

3.实现了FactoryBean接口,让用户可以自定义示例话FactoryBean的逻辑

4.实现了ApplicationListener接口让SqlSessionFactoryBean有能力监控应用发出的一些事件通知,比如这里监听ContextRefreshedEvent(上下文监听事件),会在Spring容器加载完之后执行,这里做的事情是检查ms是否加载完毕

```java
if (this.failFast && event instanceof ContextRefreshedEvent) {
  this.sqlSessionFactory.getConfiguration().getMappedStatementNames();
}
```

5.SqlSessionFactoryBean用到的Spring扩展点总结

| 接口                | 方法                 | 作用                            |
| ------------------- | -------------------- | ------------------------------- |
| FactoryBean         | getObject()          | 返回由FactoryBean创建的Bean实例 |
| InitializingBean    | afterPropertiesSet() | bean属性初始化完成后添加操作    |
| ApplicationListener | onApplicationEvent() | 对应用的时间进行监听            |

## 五.创建会话SqlSession

1.提供了SqlSession的替代品SqlSessionTemplate，里面有一个实现了InvocationHandler的内部SqlSessionInterceptor，本质是对SqlSession的代理

2.提供了获取SqlSessionTemplate的抽象类SqlSessionDaoSupport

3.扫描Mapper接口，注册到容器中的是MapperFactoryBean，它继承了SqlSessionDaoSupport，可以获得SqlSessionTemplate

4.把Mapper注入使用的时候，调用的是getObject()方法，它实际上是调用了SqlSessionTemplate的getMapper()方法，注入了一个JDK动态代理对象

5.执行Mapper接口的任意方法，会走到出发管理类MapperProxy，进入SQL处理流程

| 对象                          | 生命周期                                                     |
| ----------------------------- | ------------------------------------------------------------ |
| SqlSessionTemplate            | Spring中SqlSession的替代品,是线程安全的                      |
| SqlSessionDaoSupport          | 用于获取SqlSessionTemplate                                   |
| SqlSessionInterceptor(内部类) | 代理对象,用来代理DefaultSqlSession,在SqlSessionTemplate中使用 |
| MapperFactoryBean             | 代理对象,继承了SqlSessionDaoSupport用来获取SqlSessionTemplate |
| SqlSessionHolder              | 控制SqlSession和事务                                         |

## 六.涉及到的设计模式

| 设计模式   | 类                                                           |
| ---------- | ------------------------------------------------------------ |
| 工厂模式   | SqlSessionFactory、ObjectFactory、MapperProxyFactory         |
| 建造者     | XMLConfigbuilder、XMLMapperBuilder、XMLStatementBuilder      |
| 单例模式   | SqlSessionFactory、Configuration、ErrorContext               |
| 代理模式   | 绑定: MapperProxy  <br />延迟加载: ProxyFactory  <br />插件: Plugin  <br />Spring继承MyBatis: SqlSessionTemplate的内部SqlSessionInterceptor  <br />MyBatis自带连接池:  PooledConnection  <br />日志打印: ConnectionLogger、StatementLogger |
| 适配器模式 | Log,对于Log4J、JDK logging 这些没有直接实现slf4j接口的日志组件,需要适配器 |
| 模板方法   | BaseExecutor、SimpleExecutor、BatchExecutor、ReuseExecutor   |
| 装饰器模式 | LogginCache、LruCache对PerpetualCache <br />CachingExecutor对其他Executor |
| 责任链模式 | Interceptor、InterceptorChain                                |

