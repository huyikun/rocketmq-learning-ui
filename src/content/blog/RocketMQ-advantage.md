---
title: "RocketMQ 在业务消息场景的优势详解"
date: "2023/07/27"
author: "隆基"
img: "https://img.alicdn.com/imgextra/i3/O1CN01wEawlC1MAxNKy6LWz_!!6000000001395-0-tps-685-383.jpg"
description: "通过本文，我们将深入了解 RocketMQ 5.0 在业务消息场景的优势能力，了解为什么 RocketMQ 能够成为业务消息领域的事实标准。"
tags: ["explore"]
---
## 一、消息场景
RocketMQ5.0是消息事件流一体的实时数据处理平台，是业务消息领域的事实标准，很多互联网公司在业务消息场景会使用RocketMQ。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1684916836708-f1c07de9-7364-4d06-8561-ea30543514f0.png#id=kHfuA&originHeight=648&originWidth=1351&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

我们反复提到的“消息、业务消息”，指的是分布式应用解耦，是RocketMQ的业务基本盘。通过本文，我们将深入了解RocketMQ5.0在业务消息场景的优势能力，了解为什么RocketMQ能够成为业务消息领域的事实标准。

RocketMQ在业务消息领域的经典场景是应用解耦，这也是RocketMQ诞生初期解决阿里电商分布式互联网架构的核心场景，主要承担分布式应用（微服务）的异步集成，达到应用解耦的效果。解耦是所有的软件架构最重要的追求。

分布式应用（微服务）采用同步RPC与异步消息的对比。比如在业务系统中，有三个上游应用与4个下游应用，采用同步RPC的方式，会有3*4的依赖复杂度；而采用异步消息的方式则可以化繁为简，简化为3+4的依赖复杂度，从乘法简化为加法。

通过引入消息队列实现应用的异步集成可以获得四大解耦优势。

- 代码解耦：极大提升业务敏捷度。如果用同步调用的方式，每次扩展业务逻辑都需要上游应用显式调用下游应用接口，代码直接耦合，上游应用要做变更发布，业务迭代互相掣肘。而通过使用消息队列扩展新的业务逻辑，只需要增加下游应用订阅某个Topic，上下游应用互相透明，业务可以保持灵活独立快速迭代。
- 延迟解耦：如果使用同步调用的方式，随着业务逻辑的增加，用户操作的远程调用次数会越来越多，业务响应越来越慢，性能衰减，业务发展不可持续。而使用消息队列，无论增加多少业务，上游应用只需调用一次消息队列的发送接口即可响应线上用户，延迟为常量，基本在5ms以内。
- 可用性解耦：如果使用同步调用的方式，任何下游业务不可用都会导致整个链路失败。该种结构下类似于串联电路，甚至在部分调用失败的情况下，还会出现状态不一致。而采用RocketMQ进行异步集成，只要RocketMQ服务可用，用户的业务操作便可用。RocketMQ服务通过多对主备组成的broker集群提供，只要有一对主备可用，则整体服务可用，作为基础软件，可用性远大于普通的业务应用，下游应用的业务推进都可以通过MQ的可靠消息投递来达成。
- 流量解耦：即削峰填谷。如果采用同步调用的方式，上下游的容量必须对齐，否则会出现级联不可用。容量完全对齐需要投入大量精力进行全链路压测与更多机器成本。而通过引入RocketMQ，基于RocketMQ亿级消息的堆积能力，对于实时性要求不高的下游业务，可以尽最大努力消费，既保证了系统稳定性，又降低了机器成本与研发运维成本。
## 二、基础特性
阿里的交易应用流程为：用户在淘宝上下单时会调用交易应用创建订单，交易应用将订单落到数据库，然后生产一条订单创建的消息到RocketMQ，返回给终端用户订单创建成功的接口。完成的交易流程推进则是依赖RocketMQ将订单创建消息投递给下游应用，会员应用收到订单消息，需要给买家赠送积分、淘金币，触发用户激励相关的业务。购物车应用则是负责删除在购物车里面的商品，避免用户重复购买。同时，支付系统与物流系统也都会基于订单状态的变更，推进支付环节与履约环节。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1684916837180-4eac911d-006b-4bc0-b8f6-70b342d9578e.png#id=fiIvC&originHeight=664&originWidth=1346&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

过去十年多年，阿里电商业务持续蓬勃发展，交易的下游应用已达数百个，并且还在不断增加。基于RocketMQ的电商架构极大提高了阿里电商业务的敏捷度，上游核心的交易系统完全无需关心哪些应用在订阅交易消息，交易应用的延迟与可用性也一直保持在很高水准，只依赖少量的核心系统与RocketMQ，不会受数百个下游应用的影响。

交易的下游业务类型不一，有大量的业务场景不需要实时消费交易数据，比如物流场景能容忍一定的延迟。通过RocketMQ的亿级堆积能力，极大降低了机器成本。RocketMQ的shared-nothing架构具备无限横向扩展的能力，已经连续10年支撑了高速增长的双十一消息峰值，在几年前达到亿级TPS。
## 三、增强能力
经典场景下，RocketMQ相对于其他消息队列，拥有诸多差异化优势与增强。

首先，稳定性方面，稳定性交易是金融场景最重要的需求。RocketMQ的稳定性不仅限于高可用架构，而是通过全方位的产品能力来构建稳定性竞争力。比如重试队列，当下游消费者因为业务数据不ready或其他原因导致某条消息消费失败，RocketMQ不会因此阻塞消费，而是能将此消息加入到重试队列，然后按时间衰减重试。如果某条消息因为某些因素经过十几次重试始终无法消费成功，则RocketMQ会将它转到死信队列，用户可以通过其他手段来处理失败的消息，是金融行业的刚需。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1684916837858-ae44a932-3294-414c-a4ac-01d55f316a59.png#id=h8GrE&originHeight=677&originWidth=1355&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

同时，消费成功后如果因为代码bug导致业务不符合预期，应用可以对业务bug进行修复并重新发布，然后应用消息回溯的功能将消息拉回到之前的时间点，让业务按照正确逻辑重新处理。

RocketMQ的消费实现机制采用自适应拉模式的消费，在极端的场景下能够避免消费者被大流量打垮。同时，在消费者的SDK里，做了缓存本地的消息数量与消息内存占用的阈值保护，防止消费应用的内存风险。

其次，RocketMQ还具备优秀的可观测能力，是稳定性的重要辅助手段。RocketMQ是业界第一个提供消息消息级别可观测能力的消息队列，每条消息都可以带上业务主键，比如在交易场景，用户可以将订单ID作为消息的业务主键。当某个订单的业务需要排查，用户可以基于订单ID查询该条消息的生成时间以及消息内容。消息的可观测数据还能继续下钻，通过消息轨迹查看消息由哪台生产者机器发送、由哪些消费者机器在什么时间消费、消费状态是成功或失败等。![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1684916838383-a27887c8-c31d-4f4f-8830-34a75a56574d.png#id=oMD41&originHeight=675&originWidth=1352&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1684916838993-da694dec-2e7c-4a52-a508-d3917f0306e1.png#id=OtL6k&originHeight=673&originWidth=1347&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

除此之外，它支持了几十种核心的度量数据，包括集群生产者流量分布、慢消费者排行、消费的平均延迟、消费堆积数量、消费成功率等。基于丰富的指标，用户可以搭建更加完善的监控报警体系来进一步加固稳定性。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1684916839691-b78efcb8-a997-475e-8f54-c216d666b249.png#id=vmnvv&originHeight=653&originWidth=1356&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1684916840267-d212de5b-d4c6-487d-8d2c-af30a2e75a4b.png#id=uOnAF&originHeight=684&originWidth=1344&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

为了支撑更灵活的应用架构，RocketMQ在生产与消费等关键接口提供了多种模式。

生产者接口：RocketMQ同时提供了同步发送接口与异步发送接口。同步发送是最常用的模式，业务流程的编排是串行的，在应用发完消息、Broker完成存储后返回成功后，应用再执行下一步逻辑。然而在某些场景下，完成业务涉及多个远程调用，应用为了进一步降低延迟、提高性能，会采用全异步化的方式，并发发出远程调用（可以是多次发消息或RPC的组合），异步收集结果推，进业务逻辑。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1684916840863-8f5bdc7d-1fd7-4a02-8ec9-50eb2a4c8fc6.png#id=N0trZ&originHeight=629&originWidth=1349&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

在消费者的接口方面也提供了两种方式：

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1684916841481-fa30ea77-af21-480f-98b8-37e63ec3538c.png#id=gngiB&originHeight=670&originWidth=1352&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

- 监听器模式被动消费：这是目前使用最广泛的方式，用户无需关心客户端何时去Broker拉取消息，何时向Broker发出消费成功的确认，也无需维护消费线程池、本地消息缓存等细节。只需要写一段消息监听器的业务逻辑，根据业务执行结果返回Success或Failure。它属于全托管的模式，用户可以专注于业务逻辑的编写，而将实现细节完全委托给RocketMQ客户端。
- 主动消费模式：将更多的自主权交给用户，也称为Simple Consumer。在该种模式下，用户可以自己决定何时去Broker读取消息、何时发起消费确认消息。对业务逻辑的执行线程也有自主可控性，读取完消息后，可以将消费逻辑放在自定义的线程池执行。在某些场景下，不同消息的处理时长与优先级会有所不同，采用Simple Consumer的模式，用户可根据消息的属性、大小做二次分发，隔离到不同的业务线程池执行处理。该模式还提供了消息粒度消费超时时间的设定能力，针对某些消费耗时长的消息，用户能够调用change Invisible Duration接口，延长消费时间，避免超时重试。
## 四、总结

- 消息经典场景：应用解耦；

![图片1.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1684917267211-e7c050cd-5b79-4811-b845-10f517f81cab.jpeg#clientId=u63115f95-6be3-4&from=ui&id=ud1ecc6f5&originHeight=269&originWidth=1544&originalType=binary&ratio=0.8999999761581421&rotation=0&showTitle=false&size=64688&status=done&style=none&taskId=u2842a68d-e2f5-4631-bea2-5e43fc035a4&title=)

- RocketMQ基础特性：发布订阅、可靠消息、亿级堆积、无限扩展；
- 业务消息场景的增强能力：稳定性、可观测、多样化接口。


【活动】一键体验 RocketMQ 六大生产环境

免费试用+30秒一键体验，低门槛、快速、高效、易操作，带你了解“历经万亿级数据洪峰考验”的云消息队列RocketMQ！

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/30656771/1689211082265-ddbe5caa-071a-4921-bdc1-dc4a8099b824.png#clientId=u6a07a021-eeeb-4&from=paste&height=810&id=ufdab231a&originHeight=1620&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=580839&status=done&style=none&taskId=u8624f1a3-1162-4a92-b05f-db83d68e752&title=&width=540)

点击阅读原文，立即参与活动！

[https://developer.aliyun.com/topic/messagefree](https://developer.aliyun.com/topic/messagefree)



# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)