# Spring的事务传播行为

| 传播属性                  | 当前不存在事务 | 当前存在事务           |
| ------------------------- | -------------- | ---------------------- |
| PROPAGATION_REQUIRED      | 新建事务       | 使用当前事务           |
| PROPAGATION_REQUIRES_NEW  | 新建事务       | 挂起当前事务，新建事务 |
| PROPAGATION_NOT_SUPPORTED | 不使用事务     | 挂起当前事务           |
| PROPAGATION_SUPPORTS      | 不使用事务     | 使用当前事务           |
| PROPAGATION_NESTED        | 新建事务       | 嵌套事务               |
| PROPAGATION_MANDATORY     | 抛出异常       | 使用当前事务           |
| PROPAGATION_NEVER         | 不使用事务     | 抛出异常               |

