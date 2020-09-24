# Spring AOP + Redis解决重复提交的问题

用户在点击操作的时候，可能会连续点击多次，虽然前端可以通过设置按钮的disable的属性来控制按钮不可连续点击，但是如果别人拿到请求进行模拟，依然会出现问题，项目是用JWT进行认证的，所以用的token+url来作为key，value无所谓，因为用不到value

## 1.自定义注解

```java
/**
 * 自定义不重复提交的注解
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface NoRepeatSubmit {

    /**
     * 设置请求锁定时间 默认锁定一分钟 防止死锁
     * @return
     */
    int lockTime() default 60;

}
```

## 2.自定义AOP

```java
/**
 * 自定义不重复提交的切面
 */
@Slf4j
@Aspect
@Component
public class RepeatSubmitAspect {

    @Autowired
    private RedisUtil redisUtil;

    @Pointcut("@annotation(noRepeatSubmit)")
    public void pointCut(NoRepeatSubmit noRepeatSubmit) {
    }

    @Around("pointCut(noRepeatSubmit)")
    public Object around(ProceedingJoinPoint pjp, NoRepeatSubmit noRepeatSubmit) {
        int lockSeconds = noRepeatSubmit.lockTime();
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        String key = getKey(request);
        try {
            Boolean isLock = redisUtil.tryLock(key);
            // 如果缓存中有这个url视为重复提交
            if (!isLock) {
                // 执行前 添加锁
                redisUtil.addLock(key, 0, lockSeconds);
                Object o = pjp.proceed();
                return o;
            } else {
                log.info("重复提交");
                return ResponseData.oferror("请勿重复提交");
            }
        } catch (Throwable e) {
            e.printStackTrace();
            log.error("验证重复提交时出现未知异常!");
            throw new RuntimeException(e);
        }finally {
            // 执行后 删除锁
            redisUtil.releaseLock(key);
        }
    }

    private String getKey(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        String key = token + ":" + request.getServletPath();
        return key;
    }

}
```

## 3.Redis工具类

和重复提交无关的Redis操作方法我都给删除了，因为占空间

```java
/**
 * @author minalz
 * @Description Redis工具类
 * @create 2020-01-29 21:21
 */
@Component
public final class RedisUtil {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    /**
     * 普通缓存获取
     *
     * @param key 键
     * @return 值
     */
    public Object get(String key) {
        return key == null ? null : redisTemplate.opsForValue().get(key);
    }

    /**
     * 普通缓存放入并设置时间
     *
     * @param key   键
     * @param value 值
     * @param time  时间(秒) time要大于0 如果time小于等于0 将设置无限期
     * @return true成功 false 失败
     */
    public boolean set(String key, Object value, long time) {
        try {
            if (time > 0) {
                redisTemplate.opsForValue().set(key, value, time, TimeUnit.SECONDS);
            } else {
                set(key, value);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    /**
     * 删除缓存
     *
     * @param key 可以传一个值 或多个
     */
    @SuppressWarnings("unchecked")
    public void del(String... key) {
        if (key != null && key.length > 0) {
            if (key.length == 1) {
                redisTemplate.delete(key[0]);
            } else {
                redisTemplate.delete(CollectionUtils.arrayToList(key));
            }
        }
    }

    /**
     * 获取分布式锁
     * @return
     */
    public Boolean tryLock(String key){
        Object o = this.get(key);
        if(o != null){
            return true;
        }
        return false;
    }

    /**
     * 添加锁
     */
    public void addLock(String key, Object value, int time){
        this.set(key, value,time);
    }

    /**
     * 释放锁
     */
    public void releaseLock(String key){
        this.del(key);
    }
}
```

## 4.统一返回的封装对象

```java
/**
 * 接口返回封装对象
 */
public class ResponseData implements Serializable {

    private static final long serialVersionUID = 1L;
    public String code = "200"; // 200:成功 01:失败
    public String msg = "OK";

    public ResponseData() {
    }

    public ResponseData(String type, String message) {
        this.code = type;
        this.msg = message;
    }

    public static ResponseData oferror(String message){
        return new ResponseData("01",message);
    }

    public static ResponseData ofok(){
        return new ResponseData("200","OK");
    }

}
```

## 5.测试方法

在测试方法上添加`@NoRepeatSubmit(lockTime = 300)`

```java
@PostMapping("/normal")
@NoRepeatSubmit(lockTime = 300)
public ResponseData normal() {
    ResponseData responseData = new ResponseData();
    responseData.msg = "我是普通用户";
    return responseData;
}
```