# Ribbon

## 1.轮询算法

```java
package cn.minalz.cloud.lb;

import org.springframework.cloud.client.ServiceInstance;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @description:
 * @author: minalz
 * @date: 2020-06-08 00:02
 **/
@Component
public class MyLoadBalancerImpl implements LoadBalancer {

    private AtomicInteger atomicInteger = new AtomicInteger(0);

    public final int getAndIncrement(){
        int current;
        int next;
        do{
            current = atomicInteger.get();
            next = current >= Integer.MAX_VALUE ? 1 : current + 1;
        }while(!this.atomicInteger.compareAndSet(current,next));
        System.out.println("*****第几次访问，次数next：" + next);
        return next;
    }

    //负载均衡算法：rest接口第几次请求数 % 服务器集群总数量 = 实际调用服务器位置下标  ，每次服务重启动后rest接口计数从1开始。
    @Override
    public ServiceInstance instances(List<ServiceInstance> instances) {
        int index = getAndIncrement() % instances.size();
        return instances.get(index);
    }
}
```

