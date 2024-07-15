---
title: "RocketMQ  客户端负载均衡机制详解及最佳实践"
date: "2022/11/18"
author: "玄珏"
img: "https://img.alicdn.com/imgextra/i3/O1CN01uOYOt9232jiRNYk6n_!!6000000007198-0-tps-685-383.jpg"
tags: ["practice"]
description: "本文介绍 RocketMQ 负载均衡机制，主要涉及负载均衡发生的时机、客户端负载均衡对消费的影响（消息堆积/消费毛刺等）并且给出一些最佳实践的推荐"
---

## 前言


本文介绍 RocketMQ 负载均衡机制，主要涉及负载均衡发生的时机、客户端负载均衡对消费的影响（消息堆积/消费毛刺等）并且给出一些最佳实践的推荐。

## 负载均衡意义


![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501218700-1ed7e3be-c828-46c0-bbb7-45b4eb312c76.png#clientId=ufa3f06d3-882d-4&height=618&id=lYwPO&name=1.png&originHeight=618&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u37f534ef-7fd9-4f4d-96fb-c263fd1faba&title=&width=1080)

上图是 RocketMQ 的消息储存模型：消息是按照队列的方式分区有序储存的。RocketMQ 的队列模型使得生产者、消费者和读写队列都是多对多的映射关系，彼此之间都可以无限水平扩展。对比传统的消息队列如 RabbitMQ 是很大的优势。尤其是在流式处理场景下有天然优势，能够保证同一队列的消息被相同的消费者处理，对于批量处理、聚合处理更友好。

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501218852-1f98130d-3d3e-424e-9318-25507597574e.png#clientId=ufa3f06d3-882d-4&height=565&id=rXHZp&name=2.png&originHeight=565&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0373f99b-af27-4a5c-b21d-8d5336d377c&title=&width=1080)

消费者消费某个 topic 的消息等同于消费这个 topic 上所有队列的消息（上图中 Consumer A1 消费队列 1，Consumer A2 消费队列 2、3）。

所以，要保证每个消费者的负载尽量均衡，也就是要给这些消费者分配相同数量的队列，并保证在异常情况下（如客户端宕机）队列可以在不同消费者之间迁移。

## 负载均衡机制解析


### 负载均衡时机

负载均衡是客户端与服务端互相配合的过程，我们先综合服务端和客户端的职责回答第一个问题：何时会发生负载均衡。

- **客户端主动负载均衡**
** **

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501220551-73bc168e-e9c0-4a0b-aed7-fb79fefa4aea.png#clientId=ufa3f06d3-882d-4&height=450&id=ms7Dr&name=3.png&originHeight=450&originWidth=582&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc7f15aad-9c69-46f7-9344-6e712e767d7&title=&width=582)

上图是 RocketMQ 客户端相关类的结构，其中 MQClientInstance 负责和服务端的交互以及底层服务的协调，这其中就包括负载均衡。

MQClientInstance 中有两个相关的方法 rebalanceImmediately 和 doRebalance，我们分析负载均衡的时机只要找到何时调用这两个方法即可：

1. 启动时立即进行负载均衡；
2. 定时（默认 20s）负载均衡一次。

 

- **服务端通知负载均衡**
** **

服务端通知客户端进行负载均衡也是通过 MQClientInstance#rebalanceImmediately 方法实现的，我们同样在服务端代码中寻找相关调用。

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501218762-d6e855f2-177a-4ec6-9c9d-a9ffd082a28c.png#clientId=ufa3f06d3-882d-4&height=139&id=HeuTK&name=4.png&originHeight=139&originWidth=660&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6440c658-83e4-4224-b00a-6cd3ad15666&title=&width=660)

分析以上几个方法可以得出结论，在如下场景服务端会主动通知客户端触发负载均衡：

1. 客户端上下线
    - 上线
    1. 新客户端发送心跳到服务端
    - 下线
    2. 客户端发送下线请求到服务端
    3. 底层连接异常：响应 netty channel 的 IDLE/CLOSE/EXCEPTION 事件

2. 订阅关系变化：订阅新 topic 或有旧的 topic 不再订阅

### 负载均衡策略

前文已经介绍了负载均衡实际是变更消费者负责处理的队列数量，这里每次需要变更的队列数量和受到影响的客户端数量是由负载均衡策略决定的。

我们来分析一下比较常见的负载均衡策略：

- **平均分配**



平均分配（AllocateMessageQueueAveragely）是默认的负载均衡策略：

如果我们有 4 个客户端，24 个队列，当第二个客户端下线时：

以默认的负载均衡策略（AllocateMessageQueueAveragely）为例，重新分配队列数量为 8。

默认的负载均衡策略能将队列尽量均衡的分配到每个客户端，但是每次负载均衡重新分配队列数量较多，尤其是在客户端数量很多的场景。

| 客户端 | 队列分配变化 | 队列数变化 |
| --- | --- | --- |
| Client1 | 1~6 -> 1~8 | 6 -> 8 |
| Client2 | 7~12 -> - | 6 -> 0 |
| Client3 | 13~18 -> 9~16 | 6 -> 8 |
| Client4 | 19~24 -> 17~24 | 6 -> 8 |

#### 

- **一致性哈希**



基于一致性哈希算法的负载均衡策略（AllocateMessageQueueConsistentHash）每次负载均衡会重新分配尽可能少的队列数量，但是可能会出现负载不均的情况。

| 客户端 | 队列分配变化 | 队列数变化 |
| --- | --- | --- |
| Client1 | 1~6 -> 1~9 | 6 -> 9 |
| Client2 | 7~12 -> - | 6 -> 0 |
| Client3 | 13~18 -> 10~18 | 6 -> 9 |
| Client4 | 19~24 -> 19~24 | 6 -> 8 |


## 负载均衡对消费的影响


我们以一个真实的线上场景来举例：

下图中绿色的线代表发送 tps，黄色的线代表消费 tps，我们很容易发现在 21:00 和 21:50 分左右存在消费毛刺。

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501218672-65ed1409-e713-4a4e-9342-afbd133c776d.png#clientId=ufa3f06d3-882d-4&height=401&id=aGerR&name=5.png&originHeight=401&originWidth=725&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue67e0213-8f96-4575-b501-84c067b5b14&title=&width=725)

这两个时间点在进行应用发布，根据我们上文的分析某个消费者下线后同组的其他消费者感知这一变化需要一定时间，导致有秒级的消费延迟产生。在发布结束后消费者快速处理堆积的消息，可以发现消费速度有一个明显的上涨。

这个例子展示了下线时由于负载均衡带来了短暂的消息处理延迟，新的消费者会从服务端获取消费位点继续之前的消费进度。如果消费者异常宕机或者没有调用 shutdown 优雅下线，没有上传自己的最新消费位点，会使得新分配的消费者重复消费。

这里我们总结下负载均衡对消费的影响，当某个客户端触发负载均衡时：

1. 对于新分配的队列可能会重复消费，这也是官方要求消费要做好幂等的原因；
2. 对于不再负责的队列会短时间消费停止，如果原本的消费 TPS 很高或者正好出现生产高峰就会造成消费毛刺。 

## 最佳实践


### 避免频繁上下线

为了避免负载均衡的影响应该尽量减少客户端的上下线，同时做好消费幂等。

同时在有应用重启或下线前要调用 shutdown 方法，这样服务端在收到客户端的下线请求后会通知客户端及时触发负载均衡，减少消费延迟。

### 选择合适的负载均衡策略

需要根据业务需要灵活选择负载均衡策略：

- 需要保证客户端的负载尽可能的均衡：选择默认的平均分配策略；
- 需要降低应用重启带来的消费延迟：选择一致性哈希的分配策略。 

当然还有其他负载均衡策略由于时间关系不一一介绍了，留给读者自行探索。

### 保证客户端订阅一致

RocketMQ 的负载均衡是每个客户端独立进行计算，所以务必要保证每个客户端的负载均衡算法和订阅语句一致。

- 负载均衡策略不一致会导致多个客户端分配到相同队列或有客户端分不到队列；
- 订阅语句不一致会导致有消息未能消费。 



## RocketMQ 5.0 消息级别负载均衡


为了彻底解决客户端负载均衡导致的重复消费和消费延迟问题，RocketMQ 5.0 提出了消息级别的负载均衡机制。

同一个队列的消息可以由多个消费者消费，服务端会确保消息不重不漏的被客户端消费到：

![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501220705-c4979118-32df-4a9a-9c23-bbc8a83ca31d.png#clientId=ufa3f06d3-882d-4&height=328&id=IVKwp&name=6.png&originHeight=328&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7749d9b1-da85-44e8-97a8-c8fd76ade9a&title=&width=1080)

消息粒度的负载均衡机制，是基于内部的单条消息确认语义实现的。消费者获取某条消息后，服务端会将该消息加锁，保证这条消息对其他消费者不可见，直到该消息消费成功或消费超时。因此，即使多个消费者同时消费同一队列的消息，服务端也可保证消息不会被多个消费者重复消费。

在 4.x 的客户端中，顺序消费的实现强依赖于队列的分配。RocketMQ 5.0 在消息维度的负载均衡的基础上也实现了顺序消费的语意：不同消费者处理同一个消息组内的消息时，会严格按照先后顺序锁定消息状态，确保同一消息组的消息串行消费。

![7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501220869-7b8f2e56-5156-4304-8110-97aa6cc2b051.png#clientId=ufa3f06d3-882d-4&height=464&id=YjkTu&name=7.png&originHeight=464&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ucafdfcf4-5099-43d0-9221-527086df6bd&title=&width=1080)

如上图所述，队列 Queue1 中有 4 条顺序消息，这 4 条消息属于同一消息组 G1，存储顺序由 M1 到 M4。在消费过程中，前面的消息 M1、M2 被 消费者Consumer A1 处理时，只要消费状态没有提交，消费者 A2 是无法并行消费后续的 M3、M4 消息的，必须等前面的消息提交消费状态后才能消费后面的消息。

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
