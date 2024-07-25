---
title: "消息驱动、事件驱动、流”基础概念解析"
date: "2022/03/23"
author: "肯梦"
img: "https://img.alicdn.com/imgextra/i4/O1CN01mJWXys1hFdJx7ykqV_!!6000000004248-0-tps-685-383.jpg"
tags: ["explore"]
description: "本文旨在帮助大家对近期消息领域的高频词“消息驱动（Message-Driven），事件驱动（Event-Driven）和流（Streaming）”有更清晰的了解和认知，其中事件驱动 EDA 作为 Gartner 预测的十大技术趋势之一， EventBridge 作为下一代消息中间件，也是目前的重点方向之一。"
---
> 阿里云消息队列 RocketMQ 5.0 实现了全新升级，实现了从“消息”到“消息、事件、流”的大融合，基于此，Message-Driven、Event-Driven、Streaming 这三个词是近期消息领域高频词，但由于概念过于新，很多同学其实是不太理解这里的异同。本文把三个概念重新整理下，梳理出比较明确的概念讲给大家。


## 背景

首先这三个概念具体翻译如下：

- **Message-Driven：**消息驱动的通信；
- **Event- Driven：**事件驱动的通信；
- **Streaming：**流模式。

这三个模式都是类似异步通信的模式，发送消息的服务不会等待消费消息服务响应任何数据，做服务解耦是三个模式共同的特性；

只要是在服务通讯领域内，在选型时还要考虑如下特性：

- **排序：**是否可以保证特定的顺序交付；
- **事务：**生产者或消费者是否可以参与分布式事务；
- **持久化：**数据如何被持久化，以及是否可以重放数据；
- **订阅过滤：**是否拥有根据Tag或其他字段做订阅过滤的能力；
- At – least -once（最少交付一次），At-most-once（最多交付一次），Exactly-once （精确交付）。

通用背景介绍完，依次来看看各个模型代表的是什么意思。

## 消息驱动 Message-Driven

在消息驱动通信中，一般链路就是消息生产者（Producer）向消息消费者（Consumer）发送消息。模型如下：

![1.jpeg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680491163474-ee283a99-e9ce-4fcd-93bb-aca3193174b7.jpeg#clientId=ue9ed203b-b87a-4&height=335&id=kDnJi&name=1.jpeg&originHeight=335&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u3b51cbb7-6f15-4d90-b038-8a92e42b3d7&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491163215-69b9ffa4-c9b6-45a7-b800-645a8cee16f8.gif#clientId=ue9ed203b-b87a-4&height=1&id=P5ODO&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue8c53ffc-8f5a-4cea-94bd-790b8d9c1b4&title=&width=1)
消息驱动模式下通常会用到中间件，比较常见的中间组件有 RocketMQ，Kafka，RabbitMQ 等。这些中间件的目的是缓存生产者投递的消息直到消费者准备接收这些消息，以此将两端系统解耦。

在消息驱动架构中，消息的格式是基于消费者的需求制定的；消息传递可以是一对一，多对多，一对多或多对一。

消息驱动通讯比较常见的一个例子是商品订单推送，上游组件负责生成订单，下游组件负责接收订单并处理。通过这样的通讯方式上游生成组件其实无需关心整个订单的生命周期，更专注于如何快速生成订单，使单个组件的性能得以提升。
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491183334-049d5e71-f76e-4125-b00d-27d8928fc0db.gif#clientId=ue9ed203b-b87a-4&height=1&id=ctSVF&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud2538761-aa30-49f2-8425-99a946c2b52&title=&width=1)
![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491163427-a7a16f18-a45b-46a0-8f09-b1fc1e7b357c.png#clientId=ue9ed203b-b87a-4&height=486&id=KCJDl&name=2.png&originHeight=486&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u24f60468-7056-42b6-aaa5-ca17ef9e11b&title=&width=1080)

消息驱动模式在服务之间提供了轻的耦合（这部分耦合指代 Producer/Consumer SDK），并可以对生产和消费服务根据诉求进行扩展。

## 事件驱动 Event-Driven

首先要申明一个观点：事件驱动其实是对消息驱动方法的改进，它对消息体大小，消息格式做了较为严格的限制，这层基于消息的限制封装其实就称为事件（Event）。

在事件驱动模式中，生产者发布事件来表示系统变更，任何感兴趣且有权限接入的服务都可以订阅这些事件，并将这些事件作为触发器来启动某些逻辑/存储/任务。

![3.jpeg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680491165419-e397d37e-6602-4050-bcf4-f930a3eab706.jpeg#clientId=ue9ed203b-b87a-4&height=331&id=l8FCU&name=3.jpeg&originHeight=331&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc58b1150-63bc-48a8-a849-e264102b184&title=&width=1080)

事件驱动的模式可以是一对一，多对一，一对多或多对多。通常情况下一般是多个目标根据过滤条件执行不同的事件。

在事件驱动架构中，事件的格式是由生产者根据事件标准协议制定的；由于更规范限制和封装，事件的生产者完全不需要关心有哪些系统正在消费它生成的事件。

事件不是命令，事件不会告诉消费者如何处理信息，他们的作用只是告诉消费者此时此刻有个事件发生了；事件是一份不可变的数据，重要的数据，它与消息的数据价值相同；通常情况下当某个事件发生并执行时，往往伴随着另一个事件的产生。

事件驱动提供了服务间的最小耦合，并允许生产服务和消费服务根据需求进行扩展；事件驱动可以在不影响现有服务的情况下添加各类新增组件。

事件驱动也可以举一个非常贴切的例子，我们以“客户购买完一款商品”为一个事件，举证在事件场景的应用：

- CRM（客户关系系统）系统接收到客户购买信息，可自行更新客户的购买记录；
- EMR（库存管理系统） 系统接收到客户购买信息，动态调整库存并及时补货；
- 快递服务接收到客户购买信息，自行打单并通知快递公司派送。

这么看，事件驱动模式是不是可以应用并出现在任何地方！

在 EventBridge 产品化方向，也正是由于针对消息做了一些标准化封装，才有可能实现譬如针对事件本身的 filter（过滤） ，transform（转换），schema（事件结构），search（查询） 等能力。这些能力也拓展出更多针对事件驱动特有的场景功能及相关特性。

## 流 Streaming

流是一组有序的无界事件或数据，执行操作通常是固定的某个事件段（e.g. 00:00 – 12:00）或一个相对事件（E.g. 过去 12 小时）。

![4.jpeg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680491183960-918c4cf5-df2e-4427-b5a1-c9afeecaab9f.jpeg#clientId=ue9ed203b-b87a-4&height=289&id=RVgT8&name=4.jpeg&originHeight=289&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9afe4ba7-970d-4ad9-b43e-d44913a50a3&title=&width=1080)

通常情况下单个事件往往就是使用事件本身，但是对于流可能的操作大概率是过滤，组合，拆分，映射等等。

流的操作可以是无状态也可以是有状态的：

- 对于单个事件操作是无状态的，包括过滤和映射；
- 依赖消息在流的时间或位置（e.g. offset，time）是有状态的。有状态操作中，流处理逻辑必须保留一些已被消费消息的内存。有状态包括对数据做 Batch Size，Batch Window 等。

流这里也可以举一个比较简单的例子，比如我们的物流系统在物品通过一个物流节点时会生成一个事件，但是要查到这个物品完整的流转状态事件，则必须是各个物流节点单个事件的聚合，那这个聚合事件就是流事件。

Kafka 是最典型的流式中间件，在流式场景中，事件的位置信息至关重要。通常情况下位置信息（E.g. offset）是由消费者托管的。

## 事件规范标准

聊完 Event 和 Streaming 是什么，再来补充一点有关于它们的规范。

事件规范存在的目的是为了清晰事件生产者和消费者的关系，目前主要有两部分：AsyncAPI 和 CloudEvents；

**AsyncAPI：**基于事件 API 提供了与之对应的 Open API 和 Swagger 等；**CloudEvents：**侧重于处理事件的元数据。

下面也重点介绍一些关于 CloudEvents 的相关概念参考：CloudEvents 的核心其实是定义了一组关于不同组件间传输事件的元数据，以及这些元数据应该如何出现在消息体中。

其主旨大抵如下：

- 事件规范化；
- 降低平台集成难度；
- 提高 FaaS 的可移植性；
- 源事件可追踪；
- 提升事件关联性

准确的事件体，事件信息才可以做出更稳定的系统架构，永远保持对事件的敬畏。

**附 一些术语及定义：**
**Occurrence：**发生，指事件逻辑上的发生，基于某种情况，事件出现了；
**Event：**事件，表示事件以及上下文的数据记录。可以根据事件中的信息决定路由，但事件本身并不包含路由信息；
**Producer：**生产者，真正创造事件的实例或组件；
**Source：**源，事件发生的上下文，可以由多个 producer 组成；
**Consumer：**消费者，接收事件并对事件进行消费；
**Intermediary**：中介，接收包含事件的消息（message），并转发给下一个接收方，类似路由器；
**Context：**上下文，上下文元数据被封装到 context attributes 中，用来判断事件与其它系统的关系；
**Data：**数据，也可以叫做 payload；
**EventFormat**：事件格式，例如 json；
**Message：**消息，封装事件并将其从 source 传递到 destination；
**Protocol：**协议，可以是行业标准如 http，开源协议如 Kafka 或者供应商协议如 AWS Kinesis；
**Protocol Binding：**协议绑定，描述如何通过给定的协议收发事件，如何将事件放到消息里。

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
