# 💊 TCC 简单案例

> 💡 以医院收费 + 药房扣库存为例，演示 TCC 分布式事务的完整流程与兜底策略

---

## 📑 目录

1. 🖼️ 案例流程图
2. 📋 TCC 三阶段说明
3. 🔄 执行流程
4. 🛡️ 兜底策略：三层补偿
5. ⏰ Layer 2：定时对账补偿
6. 👨‍💼 Layer 3：人工介入 + 资金兜底
7. 🏗️ 完整兜底架构图
8. 📝 总结

---

## 🖼️ 案例流程图

![TCC简单案例](http://img.minalz.cn/typora/TCC%E7%AE%80%E5%8D%95%E6%A1%88%E4%BE%8B.png)

---

## 📋 TCC 三阶段说明

| 阶段 | 动作 | 收费服务示例 | 药房服务示例 |
|:---|:---|:---|:---|
| **Try** | 预留资源，不真正扣减 | 创建收费单，状态"待支付" | 处方审核通过，冻结药品库存 |
| **Confirm** | 真正执行（全部 Try 成功） | 更新状态"已支付"，开发票 | 真正扣减库存，打印标签 |
| **Cancel** | 释放资源（任一 Try 失败） | 删除收费单或标记作废 | 释放冻结库存，处方作废 |

---

## 🔄 执行流程

```
① Try  →  预留资源（占座，不真正扣减）
  ↓
② 判断  →  全部成功？
  ↓
是 → ③ Confirm → 确认执行（真正扣减）→ ✅ 事务完成
否 → ③ Cancel  → 取消回滚（释放资源）→ ❌ 事务回滚
```

---

## 🛡️ 兜底策略：三层补偿

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: TCC 本身（Try-Confirm-Cancel）                    │
│  → 正常流程，处理 90% 场景                                   │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: 定时对账补偿（T+1 兜底）                           │
│  → 每天扫描异常数据，自动修复                                │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: 人工介入 + 资金兜底（终极兜底）                   │
│  → 对账发现金额差异，人工核查 + 财务调账                      │
└─────────────────────────────────────────────────────────────┘
```

---

## ⏰ Layer 2：定时对账补偿（核心兜底）

```java
@Component
public class TccReconciliationJob {
    
    @Autowired
    private ChargeMapper chargeMapper;
    @Autowired
    private PharmacyMapper pharmacyMapper;
    @Autowired
    private StockMapper stockMapper;
    
    /**
     * 每 5 分钟扫描一次异常事务
     */
    @Scheduled(fixedRate = 300000)
    public void reconcile() {
        // 1. 找出"已支付"但药房没扣减库存的订单
        List<ChargeOrder> abnormalCharges = chargeMapper
            .selectPaidButStockNotDeducted();
        
        for (ChargeOrder order : abnormalCharges) {
            log.error("对账异常: 收费已支付但库存未扣减, orderId={}", order.getId());
            
            // 自动补偿：补扣库存
            stockService.compensateDeduct(order.getId());
        }
        
        // 2. 找出"已取消"但库存没释放的订单
        List<ChargeOrder> cancelledButLocked = chargeMapper
            .selectCancelledButStockStillLocked();
        
        for (ChargeOrder order : cancelledButLocked) {
            log.error("对账异常: 订单已取消但库存未释放, orderId={}", order.getId());
            
            // 自动补偿：释放库存
            stockService.compensateRelease(order.getId());
        }
        
        // 3. 金额对账：收费金额 = 药房金额 + 库存金额
        // 差异 > 0.01 元就告警
    }
}
```

---

## 👨‍💼 Layer 3：人工介入 + 资金兜底

```java
// 对账发现无法自动修复的差异
if (diffAmount > 0) {
    // 1. 发送告警（钉钉/企业微信/邮件）
    alertService.sendAlert("资金差异告警", 
        String.format("订单 %s 差异金额 %.2f 元", orderId, diffAmount));
    
    // 2. 标记待人工审核
    reconciliationMapper.markForManualReview(orderId, diffAmount);
    
    // 3. 冻结相关资金，防止继续扩散
    accountService.freeze(orderId, diffAmount);
}
```

---

## 🏗️ 完整兜底架构图

```
正常流程：
  Try → Confirm/Cancel → 事务结束

异常流程：
  Try → Confirm 超时 → 协调器触发 Cancel → Confirm 最终到达
    ↓
  定时对账发现"已支付但库存未扣减"
    ↓
  自动补偿：补扣库存
    ↓
  补偿失败 → 人工介入 → 财务调账 → 资金兜底
```

---

## 📝 总结

> 💡 **TCC 是"尽力而为"的最终一致性，不是银弹。必须配合定时对账 + 自动补偿 + 人工兜底，才能保证资金安全。**

注意:
"TCC 不是银弹" = TCC 不是万能药，不能解决所有分布式事务问题。
| 场景        | TCC 能搞定？ | 说明     |
| --------- | -------- | ------ |
| 网络正常，服务正常 | ✅ 能      | 正常流程   |
| 网络超时，重试成功 | ✅ 能      | 幂等设计   |
| 服务宕机，对账修复 | ⚠️ 部分能   | 需要兜底补偿 |
| 资金差异，需要调账 | ❌ 不能     | 必须人工介入 |


软件领域常见的"银弹"误区
| 技术     | 被吹成银弹    | 实际局限        |
| ------ | -------- | ----------- |
| 微服务    | 解决一切扩展问题 | 引入分布式复杂度    |
| 中台     | 解决一切复用问题 | 建设成本高，容易变烟囱 |
| 低代码    | 不需要程序员   | 复杂业务搞不定     |
| AI 大模型 | 替代所有程序员  | 幻觉、合规、成本问题  |
| TCC    | 完美分布式事务  | 需要多层兜底      |

一句话
银弹 = 万能药。软件工程里没有银弹，任何技术都有适用边界和兜底成本。

