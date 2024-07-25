---
title: "解析 RocketMQ  业务消息——事务消息"
date: "2022/08/03"
author: "合伯"
img: "https://img.alicdn.com/imgextra/i4/O1CN01psS0be1qv9lt83SAY_!!6000000005557-0-tps-685-383.jpg"
tags: ["explore"]
description: "本篇文章通过拆解 RocketMQ 事务消息的使用场景、基本原理、实现细节和实战使用，帮助大家更好的理解和使用 RocketMQ 的事务消息。"
---

> 引言：在分布式系统调用场景中存在这样一个通用问题，即在执行一个核心业务逻辑的同时，还需要调用多个下游做业务处理，而且要求多个下游业务和当前核心业务必须同时成功或者同时失败，进而避免部分成功和失败的不一致情况出现。简单来说，消息队列中的“事务”，主要解决的是消息生产者和消费者的数据一致性问题。本篇文章通过拆解 RocketMQ 事务消息的使用场景、基本原理、实现细节和实战使用，帮助大家更好的理解和使用 RocketMQ 的事务消息。



**点击下方链接，查看视频讲解：**
[https://yqh.aliyun.com/live/detail/29199](https://yqh.aliyun.com/live/detail/29199)

## 场景：为什么需要事务消息


以电商交易场景为例，用户支付订单这一核心操作的同时会涉及到下游物流发货、积分变更、购物车状态清空等多个子系统的变更。当前业务的处理分支包括：

- 主分支订单系统状态更新：由未支付变更为支付成功；
- 物流系统状态新增：新增待发货物流记录，创建订单物流记录；
- 积分系统状态变更：变更用户积分，更新用户积分表；
- 购物车系统状态变更：清空购物车，更新用户购物车记录。 

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492813984-8aed153b-3493-4ac8-beb3-27f2f8cfebe8.png#clientId=u35af942e-4c6f-4&height=491&id=yydqB&name=1.png&originHeight=491&originWidth=1018&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u99ec056f-afa4-4804-bd90-ecb5b08b67e&title=&width=1018)

分布式系统调用的特点是：一个核心业务逻辑的执行，同时需要调用多个下游业务进行处理。因此，如何保证核心业务和多个下游业务的执行结果完全一致，是分布式事务需要解决的主要问题。

### 传统 XA 事务方案：性能不足

为了保证上述四个分支的执行结果一致性，典型方案是基于XA协议的分布式事务系统来实现。将四个调用分支封装成包含四个独立事务分支的大事务，基于XA分布式事务的方案可以满足业务处理结果的正确性，但最大的缺点是多分支环境下资源锁定范围大，并发度低，随着下游分支的增加，系统性能会越来越差。

### 基于普通消息方案：一致性保障困难

将上述基于 XA 事务的方案进行简化，将订单系统变更作为本地事务，剩下的系统变更作为普通消息的下游来执行，事务分支简化成普通消息+订单表事务，充分利用消息异步化的能力缩短链路，提高并发度。

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492814005-2f99264a-157a-45b3-a6e2-1ecb26e9b894.png#clientId=u35af942e-4c6f-4&height=726&id=uUGKh&name=2.png&originHeight=726&originWidth=1056&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue7c42ae6-8fb5-436a-939d-9f90274a53e&title=&width=1056)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492815682-287945a7-7d23-47c9-a43a-f9147fc18907.gif#clientId=u35af942e-4c6f-4&height=1&id=PkpP8&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u881eb248-235f-4d9f-919f-d7f373d868f&title=&width=1)
该方案中消息下游分支和订单系统变更的主分支很容易出现不一致的现象，例如：

- 消息发送成功，订单没有执行成功，需要回滚整个事务；
- 订单执行成功，消息没有发送成功，需要额外补偿才能发现不一致；
- 消息发送超时未知，此时无法判断需要回滚订单还是提交订单变更。

### 基于RocketMQ分布式事务消息：支持最终一致性

上述普通消息方案中，普通消息和订单事务无法保证一致的本质原因是普通消息无法像单机数据库事务一样，具备提交、回滚和统一协调的能力。

而基于消息队列 RocketMQ 版实现的分布式事务消息功能，在普通消息基础上，支持二阶段的提交能力。将二阶段提交和本地事务绑定，实现全局提交结果的一致性。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492813785-bb23b248-89a6-4be3-93e7-f02c479e322b.gif#clientId=u35af942e-4c6f-4&height=1&id=msDpx&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9fab5182-caa6-48c6-b720-2004fdf2ee8&title=&width=1)

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492813948-58f34318-551d-417c-8c39-309eb096ac07.png#clientId=u35af942e-4c6f-4&height=726&id=Ilk98&name=3.png&originHeight=726&originWidth=1056&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u692bc24e-3b90-4bc8-8a24-eb1cf7d28cf&title=&width=1056)

消息队列 RocketMQ 版事务消息的方案，具备**高性能、可扩展、业务开发简单**的优势。

## 基本原理


### 概念介绍

- **事务消息**：RocketMQ 提供类似 XA 或 Open XA 的分布式事务功能，通过 RocketMQ 事务消息能达到分布式事务的最终一致； 

- **半事务消息**：暂不能投递的消息，生产者已经成功地将消息发送到了 RocketMQ 服务端，但是 RocketMQ 服务端未收到生产者对该消息的二次确认，此时该消息被标记成“暂不能投递”状态，处于该种状态下的消息即半事务消息； 

- **消息回查**：由于网络闪断、生产者应用重启等原因，导致某条事务消息的二次确认丢失，RocketMQ 服务端通过扫描发现某条消息长期处于“半事务消息”时，需要主动向消息生产者询问该消息的最终状态（Commit 或是 Rollback），该询问过程即消息回查。

### 事务消息生命周期

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492816011-3437d2ed-48f4-4a07-855e-6348fc753245.png#clientId=u35af942e-4c6f-4&height=198&id=Zbdyf&name=4.png&originHeight=198&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub99b8da6-36ae-46cb-b1b8-6117c07f6c9&title=&width=1080)

- **初始化**：半事务消息被生产者构建并完成初始化，待发送到服务端的状态； 

- **事务待提交**：半事务消息被发送到服务端，和普通消息不同，并不会直接被服务端持久化，而是会被单独存储到事务存储系统中，等待第二阶段本地事务返回执行结果后再提交。此时消息对下游消费者不可见； 

- **消息回滚**：第二阶段如果事务执行结果明确为回滚，服务端会将半事务消息回滚，该事务消息流程终止； 

- **提交待消费**：第二阶段如果事务执行结果明确为提交，服务端会将半事务消息重新存储到普通存储系统中，此时消息对下游消费者可见，等待被消费者获取并消费； 

- **消费中**：消息被消费者获取，并按照消费者本地的业务逻辑进行处理的过程。此时服务端会等待消费者完成消费并提交消费结果，如果一定时间后没有收到消费者的响应，RocketMQ 会对消息进行重试处理。具体信息，请参见消息重试； 

- **消费提交**：消费者完成消费处理，并向服务端提交消费结果，服务端标记当前消息已经被处理（包括消费成功和失败）；RocketMQ 默认支持保留所有消息，此时消息数据并不会立即被删除，只是逻辑标记已消费。消息在保存时间到期或存储空间不足被删除前，消费者仍然可以回溯消息重新消费。 

- **消息删除**：当消息存储时长到期或存储空间不足时，RocketMQ 会按照滚动机制清理最早保存的消息数据，将消息从物理文件中删除。

### 事务消息基本流程

事务消息交互流程如下图所示：

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492816008-1c651a79-f41c-48a1-af46-8a5a01f2b31b.png#clientId=u35af942e-4c6f-4&height=342&id=tC6cv&name=5.png&originHeight=342&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9b63e509-ec4a-47ce-8d81-682e4dcfe54&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492816001-59a93f21-763f-4e15-b9c1-23726c4e1d87.gif#clientId=u35af942e-4c6f-4&height=1&id=rmtwm&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf5a6a7ba-d02e-4df5-9a7e-da69fe65821&title=&width=1)

1. 生产者将消息发送至 RocketMQ 服务端； 

2. RocketMQ 服务端将消息持久化成功之后，向生产者返回 Ack 确认消息已经发送成功，此时消息被标记为“暂不能投递”，这种状态下的消息即为半事务消息； 

3. 生产者开始执行本地事务逻辑； 

4. 生产者根据本地事务执行结果向服务端提交二次确认结果（Commit 或是 Rollback），服务端收到确认结果后处理逻辑如下：
   - 二次确认结果为 Commit：服务端将半事务消息标记为可投递，并投递给消费者；
   - 二次确认结果为 Rollback：服务端将回滚事务，不会将半事务消息投递给消费者。 

5. 在断网或者是生产者应用重启的特殊情况下，若服务端未收到发送者提交的二次确认结果，或服务端收到的二次确认结果为Unknown未知状态，经过固定时间后，服务端将对消息生产者即生产者集群中任一生产者实例发起消息回查；

 

6. 生产者收到消息回查后，需要检查对应消息的本地事务执行的最终结果； 

7. 生产者根据检查到的本地事务的最终状态再次提交二次确认，服务端仍按照步骤 4 对半事务消息进行处理。

## 实现细节：RocketMQ 事务消息如何实现


![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492816190-9736b0b6-0ee8-40be-88eb-04c8079bf4a1.png#clientId=u35af942e-4c6f-4&height=510&id=CCRu6&name=6.png&originHeight=510&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uec030975-976d-42b3-b64e-326f3a6ef46&title=&width=1080)

根据发送事务消息的基本流程的需要，实现分为三个主要流程：接收处理 Half 消息、Commit 或 Rollback 命令处理、事务消息 check。

### 处理 Half 消息

发送方第一阶段发送 Half 消息到 Broker 后，Broker 处理 Half 消息。Broker 流程参考下图：

![7.jpeg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680492816300-7fe70ac9-eb6e-4fbc-a527-7edf57437873.jpeg#clientId=u35af942e-4c6f-4&height=345&id=JsL6Z&name=7.jpeg&originHeight=345&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9465080a-f596-4b2c-b6b6-cfd920f5d82&title=&width=1080)

具体流程是首先把消息转换 Topic 为 RMQ_SYS_TRANS_HALF_TOPIC，其余消息内容不变，写入 Half 队列。具体实现参考 SendMessageProcessor 的逻辑处理。

### Commit 或 Rollback 命令处理
### 
发送方完成本地事务后，继续发送 Commit 或 Rollback 到 Broker。由于当前事务已经完结，Broker 需要删除原有的 Half 消息，由于 RocketMQ 的 appendOnly 特性，Broker通过 OP 消息实现标记删除。Broker 流程参考下图：![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492816557-37a5d464-3ea2-4dc4-8b34-f0df37c939b8.gif#clientId=u35af942e-4c6f-4&height=1&id=uDJk5&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u45ac00d9-16dd-4e65-b345-a1cdea492a3&title=&width=1)

![8.jpeg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680492816628-b31376d7-d4da-4889-9bb8-b887a9082ef6.jpeg#clientId=u35af942e-4c6f-4&height=704&id=rK8HD&name=8.jpeg&originHeight=704&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf688ce6c-d3e0-4249-a962-afe8b0b59b7&title=&width=1080)

- **Commit**。Broker 写入 OP 消息，OP 消息的 body 指定 Commit 消息的 queueOffset，标记之前 Half 消息已被删除；同时，Broker 读取原 Half 消息，把 Topic 还原，重新写入 CommitLog，消费者则可以拉取消费； 

- **Rollback**。Broker 同样写入 OP 消息，流程和 Commit 一样。但后续不会读取和还原 Half 消息。这样消费者就不会消费到该消息。 

具体实现在 EndTransactionProcessor 中。

### 事务消息 check

如果发送端事务时间执行过程，发送 UNKNOWN 命令，或者 Broker/发送端重启发布等原因，流程 2 的标记删除的 OP 消息可能会缺失，因此增加了事务消息 check 流程，该流程是在异步线程定期执行（transactionCheckInterval 默认 30s 间隔），针对这些缺失 OP 消息的 Half 消息进行 check 状态。具体参考下图：

![9.jpeg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680492816772-cbf88134-3b8c-49c0-8de9-0cc4a19b5a54.jpeg#clientId=u35af942e-4c6f-4&height=588&id=ztRQu&name=9.jpeg&originHeight=588&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc221fa3c-9717-4941-b253-7bd6ffb0b46&title=&width=1080)

![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492816903-d594744f-9a68-43e7-bf1e-94f33e71c299.gif#clientId=u35af942e-4c6f-4&height=1&id=JXHsc&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u931f4cbd-8038-4040-9de5-1cee4689811&title=&width=1)事务消息 check 流程扫描当前的 OP 消息队列，读取已经被标记删除的 Half 消息的 queueOffset。如果发现某个 Half 消息没有 OP 消息对应标记，并且已经超时（transactionTimeOut 默认 6 秒），则读取该 Half 消息重新写入 half 队列，并且发送 check 命令到原发送方检查事务状态；如果没有超时，则会等待后读取 OP 消息队列，获取新的 OP 消息。

另外，为了避免发送方的异常导致长期无法确定事务状态，如果某个 Half 消息的 bornTime 超过最大保留时间（transactionCheckMaxTimeInMs 默认 12 小时），则会自动跳过此消息，不再 check。

具体实现参考：

TransactionalMessageServiceImpl#check 方法。

## 实战：使用事务消息


了解了 RocketMQ 事务消息的原理后，我们看下如何使用事务。首先，我们需要创建一个 “事务消息” 类型的 Topic，可以使用控制台或者 CLi 命令创建。

![10.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492817125-b6015170-9bd2-4ccb-b7bd-f1d3065ad8fa.png#clientId=u35af942e-4c6f-4&height=721&id=BPFZh&name=10.png&originHeight=721&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9fd70bf7-937e-46c4-be21-41c5760b4b0&title=&width=1080)

事务消息相比普通消息发送时需要修改以下几点：

- 发送事务消息前，需要开启事务并关联本地的事务执行。
- 为保证事务一致性，在构建生产者时，必须设置事务检查器和预绑定事务消息发送的主题列表，客户端内置的事务检查器会对绑定的事务主题做异常状态恢复。 

![11.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492817226-2641f95d-0e16-4a80-90de-075312bc8b9b.png#clientId=u35af942e-4c6f-4&height=847&id=Snh24&name=11.png&originHeight=847&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u80ea107e-2505-4e6b-95bc-11d341243a5&title=&width=1080)

当事务消息 commit 之后，这条消息其实就是一条投递到用户 Topic 的普通消息而已。所以对于消费者来说，和普通消息的消费没有区别。

![12.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492817294-1ef67e95-53ac-4e44-b7a1-6445578dc3e4.png#clientId=u35af942e-4c6f-4&height=899&id=qdbtC&name=12.png&originHeight=899&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0124df0b-3cf5-4a9c-a36a-292ddee409d&title=&width=1080)

注意：

1. 避免大量未决事务导致超时：在事务提交阶段异常的情况下发起事务回查，保证事务一致性；但生产者应该尽量避免本地事务返回未知结果；大量的事务检查会导致系统性能受损，容易导致事务处理延迟；
2. 事务消息的 Group ID 不能与其他类型消息的 Group ID 共用:与其他类型的消息不同，事务消息有回查机制，回查时服务端会根据 Group ID 去查询生产者客户端；
3. 事务超时机制：半事务消息被生产者发送服务端后，如果在指定时间内服务端无法确认提交或者回滚状态，则消息默认会被回滚。 

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
