# Spring中的设计模式

## 1.设计模式在Spring中的体现
| 设计模式名称 | 涉及到的java类        |
| :----------- | --------------------- |
| 工厂模式     | BeanFactory           |
| 装饰器模式   | BeanWrapper           |
| 代理模式     | AopProxy              |
| 委派模式     | DispatcherServlet     |
| 策略模式     | HandlerMapping        |
| 适配器模式   | HandlerAdapter        |
| 模版方法     | JdbcTemplate          |
| 观察者模式   | ContextLoaderListener |

## 2.行为划分举例
<table>
    <tr>
        <th>类型</th><th>名称</th><th>英文</th>
    </tr>
    <tr>
        <td rowspan="3">创建型模式</td><td>工厂模式</td><td>Factory Pattern</td>
    </tr>
    <tr>
        <td>单例模式</td><td>Singleton Pattern</td>
    </tr>
    <tr>
        <td>原型模式</td><td>Prototype Pattern</td>
    </tr>
    <tr>
        <td rowspan="3">结构型模式</td><td>适配器模式</td><td>Adapter Pattern</td>
    </tr>
    <tr>
        <td>装饰器模式</td><td>Decorator Pattern</td>
    </tr>
    <tr>
        <td>代理模式</td><td>Proxy Pattern</td>
    </tr>
    <tr>
        <td rowspan="4">行为型模式</td><td>策略模式</td><td>Strategy Pattern</td>
    </tr>
    <tr>
        <td>模版方法模式</td><td>Template Pattern</td>
    </tr>
    <tr>
        <td>委派模式</td><td>Delegate Pattern</td>
    </tr>
    <tr>
        <td>观察者模式</td><td>Observer Pattern</td>
    </tr>
</table>
