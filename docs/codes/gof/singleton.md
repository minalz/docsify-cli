# 单例模式

## 1.饿汉式

```java
public class Singleton {
    
    // 在定义实例对象的时候直接初始化
    private static Singleton instance = new Singleton();
    
    // 私有化构造函数
    private Singleton(){
        
    }
    
    // 对外提供获取实例的方法
    public static Singleton getInstance(){
        return instance;
    }
}
```

## 2.懒汉式

```java
public class Singleton {

    // 在定义实例对象的时候不直接初始化
    private static Singleton instance = null;

    // 私有化构造函数
    private Singleton(){

    }

    // 对外提供获取实例的方法
    public static Singleton getInstance(){
        if (null == instanc){
            instance = new Singleton();
        }
        return instance;
    }
}
```

## 3.懒汉式+同步方法

```java
public class Singleton {

    // 在定义实例对象的时候不直接初始化
    private static Singleton instance = null;

    // 私有化构造函数
    private Singleton(){

    }

    // 对外提供获取实例的方法
    public static synchronized Singleton getInstance(){
        if (null == instanc){
            instance = new Singleton();
        }
        return instance;
    }
}
```

## 4.Double-Check

```java
public class Singleton {

    // 在定义实例对象的时候不直接初始化
    private static Singleton instance = null;

    // 私有化构造函数
    private Singleton(){

    }

    // 对外提供获取实例的方法
    public static Singleton getInstance(){
        // 当instance为null时，进入同步代码块，同时该判断避免了每次都需要进入同步代码块，可以提高效率
        if (null == instance){
            synchronized (Singleton.class){
                if (null == instance){
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

## 5.Volatile+Double-Check

```java
public class Singleton {

    // 在定义实例对象的时候不直接初始化
    private volatile static Singleton instance = null;

    // 私有化构造函数
    private Singleton(){

    }

    // 对外提供获取实例的方法
    public static Singleton getInstance(){
        // 当instance为null时，进入同步代码块，同时该判断避免了每次都需要进入同步代码块，可以提高效率
        if (null == instance){
            synchronized (Singleton.class){
                if (null == instance){
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

## 6.Holder方式

```java
public class Singleton {

    // 私有化构造函数
    private Singleton(){

    }

    // 在静态内部类中持有Singleton的实例，并且可被直接初始化
    private static class Holder {
        private static Singleton instance = new Singleton();
    }

    // 对外提供获取实例的方法
    public static Singleton getInstance(){
        return Holder.instance;
    }
}
```

## 7.枚举方式

```java
public enum Singleton {
    
    INSTANCE;

    // 私有化构造函数
    private Singleton(){
        System.out.println("INSTACE will be initialized immediately");
    }

    private static void method() {
        // 调用该方法则会主动使用Singleton，INSTANCE将会被实例化
    }

    // 对外提供获取实例的方法
    public static Singleton getInstance(){
        return INSTANCE;
    }
}
```