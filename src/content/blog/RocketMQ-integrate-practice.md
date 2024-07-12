---
title: "行业实践：RocketMQ  业务集成典型行业应用和实践"
date: "2022/09/30"
author: "洛浩"
img: "https://img.alicdn.com/imgextra/i1/O1CN01YxKicC1eox14xCepv_!!6000000003919-0-tps-685-383.jpg"
tags: ["practice", "home"]
description: "本文讲述了 RocketMQ 的业务消息场景、一些功能特性的使用方法，包括事务消息、定时消息、消息全链路灰度等，欢迎大家尝试使用。"
---
## 消息典型应用场景


![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500336373-d286a5e9-9af8-41c9-875a-d250541631e5.png#clientId=u450def5c-519f-4&height=484&id=YLxG3&name=1.png&originHeight=484&originWidth=967&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf053b5a6-1313-48c1-98c5-a0a38da1dfc&title=&width=967)

阿里云拥有丰富的消息产品家族，除了 RocketMQ 以外，还有大家熟知的对标开源的云 Kafka、支持 AMQP 协议的开源消息队列 RabbitMQ、物联网通信网关 MQTT、 对标 AWS SQS/SNS 的 Serverless 版消息 MNS（现在也是轻量版 RocketMQ）以及云上事件总线、事件中心 EeventBridge 。

阿里云所有消息产品均采用 RocketMQ 作为底层存储引擎，为用户提供稳定、可靠、高性能的消息通信能力，比如百万 TPS、百万队列、毫秒级通信延迟、分级存储、 Serverless 弹性等众多的消息产品。也带来了丰富的应用场景，分为应用集成和数据集成两大类。

应用集成以 RocketMQ 为主，应用最为广泛，本文也将分享 RocketMQ 在微服务解耦、电商交易、金融支付等场景下的最佳实践，比如银行的交易流水、保单的支付流转等。RabbitMQ 、MQTT 也主要用于应用集成场景，比如物联网、 IoT 双向通信、云产品的事件通知以及后处理等。对于新建的业务场景，一般首推 RocketMQ 作为消息选型，因为 RocketMQ 拥有最丰富的功能特性；而对于存量的业务迁移，则可以根据具体使用的消息产品来进行选择，以降低迁移成本。

数据集成以云 Kafka 为主，在大数据分析、日志采集分析等场景下应用最为广泛，比如游戏的玩家操作、广告埋点、数据分析、应用数据监控等。各种 SaaS 类的集成、聚石塔、电商数据打通等场景，则主要使用 EventBridge。更多的产品选型对比，可以参考专题页中的消息队列产品选型。

> [https://www.aliyun.com/product/ons](https://www.aliyun.com/product/ons)



## 业务消息使用场景


![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500336333-11837272-20fe-4836-975a-29519146250a.png#clientId=u450def5c-519f-4&height=476&id=SYuwL&name=2.png&originHeight=476&originWidth=966&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u906cca36-3c28-4147-86a1-df3f6d9d034&title=&width=966)

RocketMQ 经过阿里集团内部十年锤炼，经过双 11 大促等万亿级规模的实时场景验证，SLA 最高可支持 4 个9，数据可靠性支持 9 个9。

以微服务解耦、订单交易、金融支付等场景为例，在互联网、电商、零售、金融等行业，消息的使用量非常大。尤其是在秒杀大促时，为了保障系统的稳定运行，需要 RocketMQ 进行削峰填谷。另外金融客户对每笔交易、每个订单也都要求数据不能丢失。因此在此类场景普遍对消息的可靠传输、海量并发、低延迟、稳定性与容灾等有着非常高的要求。RocketMQ 提供了丰富的消息类型，比如事务消息、定时消息、顺序消息等。

在交易系统里，为了简化交易流程，一般使用事务消息和定时消息。同时 RocketMQ 也提供了消息轨迹查询、消息 dashboard ，可以非常方便地对每个消息进行回溯，对每个 topic 或者 group 进行监测。RocketMQ 5.0 也提供了丰富的实例规格，从百级别 QPS 到百万级 QPS ，可以覆盖大部分应用场景。RocketMQ 默认提供多副本、多可用区部署，也提供了跨地域消息路由能力，支持客户构建高可用容灾或多活，且 RocketMQ 能够支持 99.9%的消息 RT 在 10ms 传输。

## RocketMQ 事务消息举例


### 实现订单状态机异步流转

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500337958-a31c6acd-a926-4a20-84a1-0e6202327663.png#clientId=u450def5c-519f-4&height=482&id=tA7Un&name=3.png&originHeight=482&originWidth=967&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud8731471-c5c4-4b2f-b5b1-289d2309547&title=&width=967)

以订单状态机异步流转为例。此前，如果收到一笔订单交易，需要逐个通知下游的服务模块，比如需要更新购物车、更新积分等。每个业务模块耦合在一起会导致大促时的流量峰值非常大，需要每个服务模块保障其处理性能。而基于 RocketMQ 的事务消息能力，即可轻松实现订单子流程系统的异步解耦和流量的削峰填谷，事务消息可以确保数据库订单状态持久化和下游通知的事务性。

收到 LBL 订单交易时，可以先向 RocketMQ 发送一条半事务消息，此时 RocketMQ 会 hold 住消息，等核心交易事务完成后再向 MQ 提交确认半事务消息的状态，并执行下游服务模块的通知。假设核心交易模块失败，则会废弃之前提交的半事务消息，不通知下游。

对比此前的传统事务模块，使用 RocketMQ 可以大幅简化交易链路，缩短下单耗时。尤其是在大促场景下，可以解耦下游的服务模块，提供削峰填谷的能力。

### 超时中心

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500336456-a1f927ab-ebed-44d6-a9e1-4aea9daf5d30.png#clientId=u450def5c-519f-4&height=469&id=TtSot&name=4.png&originHeight=469&originWidth=967&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue0046679-013a-4deb-8974-e90de91858d&title=&width=967)

RocketMQ 的定时消息场景也是常见的使用方式。

比如双 11 等大促场景存在大量预售订单、定点尾款等，会带来大量定时任务。在电商交易过程中，订单流转也存在多个超时状态的任务，处理超时状态的任务需要确保可靠及时。以传统的方案进行构建分布式调度机制实现的时候，比如基于定时器调度延迟大,可能会存在性能瓶颈。

而采用 RocketMQ 的定时消息，实现将变得非常简单。定时任务只需提交一条延迟消息到 RocketMQ ，由 RocketMQ 保障定时消息达到秒级的精度，最高可支持百万级别的 TPS 能力，同时也能支持消息的消费重试，保障任务可靠触发，相比传统的使用方式大大简化了定时的复杂度。

## RocketMQ 灰度策略举例


### 微服务全链路灰度

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500336343-cd01f25b-d3b4-4b4b-a184-62a7fdbdc161.png#clientId=u450def5c-519f-4&height=494&id=dde2Q&name=5.png&originHeight=494&originWidth=967&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u89da6a2c-b9b8-4d8c-b648-bb5bf01dc38&title=&width=967)

微服务场景下，精准地控制灰度流量并进行灰度版本验证，是保障线上业务稳定运行的关键。大部分情况下，用户通过划分不同的环境来进行灰度发布，对应 RocketMQ 的不同实例。但是很多用户希望能够简化环境管理，尽可能复用线上资源，结合消息来提供微服务全链路灰度能力。

如上图所示，线上已经在运行的微服务模块游 A、B、C，C 模块会产生消息，并由 A 模块进行消费。此时对服务模块 A 和 C 做灰度发布，则线上会存在两条泳道，一条是正常的业务流量，一条是灰度链路。我们希望线上版本 C 模块生产的消息能够被线上版本 A 模块进行消费，灰度版本 C 模块生产的消息能够被灰度版本 A 模块进行消费。

RocketMQ 支持透传环境标签，可在生产端给消息属性添加标签，然后开启 RocketMQ 的 SQL 92 语法过滤，服务端即可完成消息的过滤和路由，从而降低客户端的压力。

本文讲述了 RocketMQ 的业务消息场景、一些功能特性的使用方法，包括事务消息、定时消息、消息全链路灰度等，欢迎大家尝试使用。
# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
