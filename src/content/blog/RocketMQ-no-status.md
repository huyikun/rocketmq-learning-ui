---
title: "RocketMQ 5.0 无状态实时性消费详解"
date: "2023/07/13"
author: ""
img: "https://img.alicdn.com/imgextra/i2/O1CN01N5e6Nb1c6rgnWpGTy_!!6000000003552-0-tps-685-383.jpg"
description: "RocketMQ 5.0 的 SimpleConsumer 客户端采用了无状态的 pop 机制，彻底解决了在客户端发布消息、上下线时可能出现的负载均衡问题。"
tags: ["explore"]
---
## 背景
RocketMQ 5.0版本引入了Proxy模块、无状态pop消费机制和gRPC协议等创新功能，同时还推出了一种全新的客户端类型：SimpleConsumer。SimpleConsumer客户端采用了无状态的pop机制，彻底解决了在客户端发布消息、上下线时可能出现的负载均衡问题。然而，这种新机制也带来了一个新的挑战：当客户端数量较少且消息数量较少时，可能会出现消息消费延时的情况。。

在当前的消息产品中，消费普通使用了长轮询机制，即客户端向服务端发送一个超时时间相对较长的请求，该请求会一直挂起，除非队列中存在消息或该请求到达设定的长轮询时间。

然而，在引入Proxy之后，目前的长轮询机制出现了一个问题。客户端层面的长轮询和Proxy与Broker内部的长轮询之间互相耦合，也就是说，一次客户端对Proxy的长轮询只对应一次Proxy对Broker的长轮询。因此，在以下情况下会出现问题：当客户端数量较少且后端存在多个可用的Broker时，如果请求到达了没有消息的Broker，就会触发长轮询挂起逻辑。此时，即使另一台Broker存在消息，由于请求挂在了另一个Broker上，也无法拉取到消息。这导致客户端无法实时接收到消息，即false empty response。

这种情况可能导致以下现象：用户发送一条消息后，再次发起消费请求，但该请求却无法实时拉取到消息。这种情况对于消息传递的实时性和可靠性产生了不利影响。

AWS的文档里也有描述此等现象，他们的解决方案是通过查询是所有的后端服务，减少false empty response。

![image.png](https://img.alicdn.com/imgextra/i1/O1CN01el1qPn1f4WcjY6LD6_!!6000000003953-2-tps-2456-422.png)

[Amazon SQS short and long polling - Amazon Simple Queue Service](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html)

### 其他产品
在设计方案时，首先是需要目前存在的消息商业化产品是如何处理该问题的。

MNS采取了以下策略，主要是将长轮询时间切割为多个短轮询时间片，以尽可能覆盖所有的Broker。

首先，在长轮询时间内，会对后端的Broker进行多次请求。其次，当未超过短轮询配额时，优先使用短轮询消费请求来与Broker进行通信，否则将使用长轮询，其时间等于客户端的长轮询时间。此外，考虑到过多的短轮询可能会导致CPU和网络资源消耗过多的问题，因此在短轮询超过一定数量且剩余时间充足时，最后一次请求将转为长轮询。

然而，上述策略虽以尽可能轮询完所有的Broker为目标，但并不能解决所有问题。当轮询时间较短或Broker数量较多时，无法轮询完所有的Broker。即使时间足够充足的情况下，也有可能出现时间错位的情况，即在短轮询请求结束后，才有消息在该Broker上就绪，导致无法及时取回该消息。
## 解法
### 技术方案
首先，需要明确该问题的范围和条件。该问题只会在客户端数量较少且请求较少的情况下出现。当客户端数量较多且具备充足的请求能力时，该问题不会出现。因此，理想情况是设计一个自适应的方案，能够在客户端数量较多时不引入额外成本来解决该问题。

为了解决该问题，关键在于将前端的客户端长轮询和后端的Broker长轮询解耦，并赋予Proxy感知后端消息个数的能力，使其能够优先选择有消息的Broker，避免false empty response。

考虑到Pop消费本身的无状态属性，期望设计方案的逻辑与Pop一致，而不在代理中引入额外的状态来处理该问题。

另外，简洁性是非常重要的，因此期望该方案能够保持简单可靠，不引入过多的复杂性。

1. 为了解决该问题，本质上是要将前端的客户端长轮询和后端的Broker长轮询解耦开来，并赋予Proxy感知后端消息个数的能力，能够优先选择有消息的Broker，避免false empty response。
2. 由于Pop消费本身的无状态属性，因此期望该方案的设计逻辑和Pop一致，而不在Proxy引入额外的状态来处理这个事情。
3. Simplicity is ALL，因此期望这个方案简单可靠。

我们使用了NOTIFICATION，可以获取到后端是否有尚未消费的消息。拥有了上述后端消息情况的信息，就能够更加智能地指导Proxy侧的消息拉取。

通过重构NOTIFICATION，我们对其进行了一些改进，以更好地适应这个方案的要求。
#### pop with notify
一个客户端的请求可以被抽象为一个长轮询任务，该轮询任务由通知任务和请求任务组成。

通知任务的目的是获取Broker是否存在可消费的消息，对应的是Notification请求；而请求任务的目的是消费Broker上的消息，对应的是Pop请求。

首先，长轮询任务会执行一次Pop请求，以确保在消息积压的情况下能够高效处理。如果成功获取到消息，则会正常返回结果并结束任务。如果没有获取到消息，并且还有剩余的轮询时间，则会向每个Broker提交一个异步通知任务。

在任务通知返回时，如果不存在任何消息，长轮询任务将被标记为已完成状态。然而，如果相关的Broker存在消息，该结果将被添加到队列中，并且消费任务将被启动。该队列的目的在于缓存多个返回结果，以备将来的重试之需。对于单机代理而言，只要存在一个通知结果返回消息，Proxy即可进行消息拉取操作。然而，在实际的分布式环境中，可能会存在多个代理，因此即使通知结果返回消息存在，也不能保证客户端能够成功拉取消息。因此，该队列的设计旨在避免发生这种情况。

![pop-real-time.png](https://img.alicdn.com/imgextra/i3/O1CN01YMm7V61oe5vMMLE31_!!6000000005249-0-tps-1844-1124.jpg)

消费任务会从上述队列中获取结果，若无结果，则直接返回。这是因为只有在通知任务返回该Broker存在消息时，消费任务才会被触发。因此，若消费任务无法获取结果，可推断其他并发的消费任务已经处理了该消息。

消费任务从队列获取到结果后，会进行加锁，以确保一个长轮询任务只有一个正在进行的消费任务，以避免额外的未被处理的消息。

![pop-real-time-2.png](https://img.alicdn.com/imgextra/i2/O1CN01sKZbPb1JsWJLTOXwa_!!6000000001084-0-tps-3204-324.jpg)

如果获取到消息或长轮询时间结束，该任务会被标记完成并返回结果。但如果没有获取到消息（可能是其他客户端的并发操作），则会继续发起该路由所对应的异步通知任务，并尝试进行消费。
#### 自适应切换
考虑到当请求较多时，无需采用pop with notify机制，可使用原先的pop长轮询broker方案，但是需要考虑的是，如何在两者之间进行自适应切换。目前是基于当前Proxy统计的pop请求数做判断，当请求数少于某一值时，则认为当前请求较少，使用pop with notify；反之则使用pop长轮询。

由于上述方案基于的均为单机视角，因此当消费请求在proxy侧不均衡时，可能会导致判断条件结果有所偏差。
### Metric
为了之后进一步调优长轮询和观察长轮询的效果，我们设计了一组metric指标，来记录并观测实时长轮询的表现和损耗。

1. 客户端发起的长轮询次数 (is_long_polling)
2. pop with notify次数 (通过现有rpc metric统计)
3. 首次pop请求命中消息次数 (未触发notify)  (is_short_polling_hit)
## 总结
通过如上方案，我们成功设计了一套基于无状态消费方式的实时消费方案，在做到客户端无状态消费的同时，还能够避免false empty response，保证消费的实时性，同时，相较于原先PushConsumer的长轮询方案，能够大量减少用户侧无效请求数量，降低网络开销，
### 产品侧
需明确长轮询和短轮询的区分，可以参考AWS的定义，当轮询时间大于0时，长轮询生效。

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01sXjvTk1EphnaeVCii_!!6000000000401-2-tps-2504-348.png)

且需明确一个长轮询最小时间，因为长轮询时间过小时无意义，AWS的最小值采取了1s，我们是否需要follow，还是采取一个更大的值。

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01DZ1Y3U29dH9FXMNs5_!!6000000008090-2-tps-2342-256.png)

[Working with Amazon SQS messages - Amazon Simple Queue Service](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/working-with-messages.html#setting-up-long-polling)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://img.alicdn.com/imgextra/i4/O1CN01Xi1rcu1DM6aIC7ypz_!!6000000000201-0-tps-1920-675.jpg)
    

