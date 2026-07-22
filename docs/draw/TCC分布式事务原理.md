# 🔄 TCC 分布式事务原理

> 📊 TCC（Try-Confirm-Cancel）分布式事务模式原理可视化

---

## 🖼️ 原理图

![TCC分布式事务原理图](http://img.minalz.cn/typora/TCC%E5%88%86%E5%B8%83%E4%BA%8B%E5%8A%A1%E5%8E%9F%E7%90%86%E5%9B%BE.png)

---

## 📝 说明

> 💡 TCC 是一种两阶段补偿型事务模式：Try 阶段预留资源，Confirm 阶段确认提交，Cancel 阶段取消回滚，适用于对一致性要求较高的分布式业务场景