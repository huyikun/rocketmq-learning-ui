---
title: "阿里云基于全新 RocketMQ 5.0  内核的落地实践"
date: "2022/08/29"
author: ""
img: "https://img.alicdn.com/imgextra/i1/O1CN01yDSfpS1eZNYFZNpuB_!!6000000003885-0-tps-685-383.jpg"
tags: ["practice"]
description: "本篇文章的核心就消息架构以及产品能力的云原生化，介绍了阿里云是如何基于全新的 RocketMQ 5.0 内核做出自己的判断和演进，以及如何适配越来越多的企业客户在技术和能力方面的诉求。"
---
## 前言

在上个月结束的 RocketMQ Summit 全球开发者峰会中，Apache RocketMQ 社区发布了新一代 RocketMQ 的能力全景图，为众多开发者阐述 RocketMQ 5.0 这一大版本的技术定位与发展方向。

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680493044197-6ea509e8-13ae-41b5-b713-c884a3d299d4.png#clientId=udb4ee6c5-dc95-4&height=545&id=AR74u&name=1.png&originHeight=545&originWidth=969&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2795ba46-32b4-42a1-846a-4dbfaf05803&title=&width=969)

在过去七年大规模云计算实践中，RocketMQ 不断自我演进，今天，RocketMQ 正式迈进 5.0 时代。

从社区关于 5.0 版本的解读可以看到，在云原生以及企业全面上云的大潮下，为了更好地匹配业务开发者的诉求，Apache RocketMQ 做了很多的架构升级和产品化能力的适配。那么如何在企业的生产实践中落地 RocketMQ 5.0 呢？本篇文章的核心就消息架构以及产品能力的云原生化，介绍了阿里云是如何基于全新的 RocketMQ 5.0 内核做出自己的判断和演进，以及如何适配越来越多的企业客户在技术和能力方面的诉求。

## 云原生消息服务的演进方向

首先我们来看下云原生消息服务有哪些演进？

面向未来，适应云原生架构的消息产品能力应该在以下方面做出重要突破：

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680493044098-24d4d6d8-9ab3-4f52-b286-b1d9ca9a7627.png#clientId=udb4ee6c5-dc95-4&height=566&id=dpx7i&name=2.png&originHeight=566&originWidth=969&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1556b88e-2e25-451c-94a0-9f6ae915b27&title=&width=969)

- **大规模弹性**：企业上云的本质是解放资源供给的负担和压力，专注于业务的集成和发展。作为消息服务的运维方，应该为上层业务提供与模型匹配的资源供给能力，伴随业务流量的发展提供最贴合的弹性能力。一方面可以解决面向不确定突发流量的系统风险，另一方面也可以实现资源利用率的提升。 

- **易用性**：易用性是集成类中间件的重要能力，消息服务应该从 API 设计到集成开发、再到配置运维，全面地降低用户的负担，避免犯错。低门槛才能打开市场，扩大心智和群体。  

- **可观测性**：可观测性对于消息服务的所有参与方来说都很重要，服务提供方应提供边界清晰、标准开放的观测诊断能力，这样才能解放消息运维方的负担，实现使用者自排查和边界责任的清晰化。 

- **稳定性高 SLA**：稳定性是生产系统必备的核心能力，消息来说往往集成在核心交易链路，消息系统应该明确服务的可用性、可靠性指标。使用方应基于明确的 SLA 去设计自己的故障兜底和冗余安全机制。

立足于这个四个关键的演进方向，下面为大家整体介绍一下阿里云 RocketMQ 5.0 在这些方面是如何落地实践的。

### 大规模弹性：提供匹配业务模型的最佳资源供给能力

消息服务一般集成在业务的核心链路，比如交易、支付等场景，这一类场景往往存在波动的业务流量，例如大促、秒杀、早高峰等。

面对波动的业务场景，阿里云 RocketMQ 5.0 的消息服务可以伴随业务的诉求进行自适应实现资源扩缩。一方面在比较稳定的业务处理基线范围内，按照最低的成本预留固定的资源；另一方面在偶尔存在的突发流量毛刺时，支持自适应弹性，按量使用，按需付费。两种模式相互结合，可以实现稳定安全的高水位运行，无需一直为不确定的流量峰值预留大量资源。

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680493045902-11c0254a-d718-4eff-ab2a-028fa9dee285.png#clientId=udb4ee6c5-dc95-4&height=327&id=gzpez&name=3.png&originHeight=327&originWidth=969&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud6085df1-76e2-4dbd-87a1-b1047ce1649&title=&width=969)

除了消息处理流量的弹性适应外，消息系统也是有状态的系统，存储了大量高价值的业务数据。当系统调用压力变化时，存储本身也需要具备弹性能力，一方面需要保障数据不丢失，另一方面还需要节省存储的成本，避免浪费。传统的基于本地磁盘的架构天然存在扩缩容问题，其一本地磁盘容量有限，当需要扩大容量时只能加节点，带来计算资源的浪费；其二本地磁盘无法动态缩容，只能基于业务侧流量的隔离下线才能缩减存储成本，操作非常复杂。

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680493044043-3d26a037-b9e1-44e1-b1b7-5dbf21618433.png#clientId=udb4ee6c5-dc95-4&height=369&id=DSROu&name=4.png&originHeight=369&originWidth=969&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u19bc3ff7-c67d-44e4-abad-08947f9e632&title=&width=969)

阿里云 RocketMQ 5.0 的消息存储具备天然的 Serverless 能力，存储空间按需使用，按量付费，业务人员只需要按照需求设置合理的 TTL 时间，即可保障长时间存储时的数据完整性。

### 集成易用性：简化业务开发，降低心智负担和理解成本

集成易用性是一种系统设计约束，要求消息服务应该从 API 设计到集成开发、再到配置运维，全面地降低用户的负担，避免犯错。举个典型场景，在消息队列例如 RocketMQ 4.x 版本或 Kafka 中，业务消费消息时往往被负载均衡策略所困扰，业务方需要关注当前消息主题的队列数（分区数）以及当前消费者的数量。因为消费者是按照队列粒度做负载均衡和任务分配，只要消费者能力不对等，或者数量不能平均分配，必然造成部分消费者堆积、无法恢复的问题。

在典型的业务集成场景，客户端其实只需要以无状态的消息模型进行消费，业务只需关心消息本身是否处理即可，而不应该关心内部的存储模型和策略。

阿里云 RocketMQ 5.0 正是基于这种思想提供了全新的 SimpleConsumer 模型，支持任意单条消息粒度的消费、重试和提交等原子能力。

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680493043993-a56a5298-4b6c-4aa3-a3a6-4634e9bd4f75.png#clientId=udb4ee6c5-dc95-4&height=648&id=fFfLk&name=5.png&originHeight=648&originWidth=947&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u31fd55ca-a1bc-4f34-8f22-08eefb8aeb8&title=&width=947)

### 可观测性：提供边界清晰、标准开放的自助诊断能力

![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680493046321-aac98dcf-1bcd-465d-97bc-0b225646003f.png#clientId=udb4ee6c5-dc95-4&height=455&id=LyFa8&name=6.png&originHeight=455&originWidth=446&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u74f49fbd-655c-4488-a4e7-0e3967bc82a&title=&width=446)

有运维消息队列经验的同学都会发现，消息系统耦合了业务的上游生产和下游消费处理，往往业务侧出问题时无法清晰地界定是消息服务异常还是业务处理逻辑的异常。

阿里云 RocketMQ 5.0 的可观测性就是为这种模糊不确定的边界提供解法，以事件、轨迹、指标这三个方面为基础，依次从点、线、面的纬度覆盖链路中的所有细节。关于事件、轨迹、指标的定义涵盖如下内容：

- 事件：覆盖服务端的运维事件，例如宕机、重启、变更配置；客户端侧的变更事件，例如触发订阅、取消订阅、上线、下线等；

 

- 轨迹：覆盖消息或者调用链的生命周期，展示一条消息从生产到存储，最后到消费完成的整个过程，按时间轴抓出整个链路的所有参与方，锁定问题的范围； 

- 指标：指标则是更大范围的观测和预警，量化消息系统的各种能力，例如收发 TPS、吞吐、流量、存储空间、失败率和成功率等。

![7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680493046465-6d049e12-1aa0-4869-85c2-79fb47d5be59.png#clientId=udb4ee6c5-dc95-4&height=419&id=yYK1Q&name=7.png&originHeight=419&originWidth=969&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u711f462b-b294-45c7-a191-4a85d0ce51f&title=&width=969)

阿里云 RocketMQ 在可观测性方面也是积累良多，不仅率先支持了完善的消息轨迹链路查询，而且在 5.0 新版本中还支持将客户端和服务端的 Trace、Metrics 信息以标准的 OpenTelemetry协议上报到第三方Trace、Metrics中存储，借助开源的 Prometheus 和 Grafana 等产品可以实现标准化的展示和分析。

### 稳定性 SLA：提供可评估、可量化、边界明确的服务保障能力

稳定性是生产系统必备的核心能力，消息系统往往集成在核心交易链路，消息系统是否稳定直接影响了业务是否完整和可用。但稳定性的保障本身并不只是运维管理，而是要从系统架构的设计阶段开始梳理，量化服务边界和服务指标，只有明确了服务的可用性和可靠性指标，使用方才能设计自己的故障兜底和冗余安全机制。

![8.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680493046683-bee4f1f2-4f70-402b-9855-3d35eca93933.png#clientId=udb4ee6c5-dc95-4&height=432&id=SjSEH&name=8.png&originHeight=432&originWidth=969&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u10ab412e-12d3-41b7-98b9-d038eeb3817&title=&width=969)

传统的基于运维手段的被动保障方式，只能做基本的扩缩容和系统指标监控，对于消息的各种复杂边界场景，例如消息堆积、冷读、广播等并不能很好的提供量化服务能力。一旦上层业务方触发这些场景，系统则会被打穿，从而丧失服务能力。

阿里云 RocketMQ 5.0 体系化的稳定性建设，是从系统设计阶段就提供对消息堆积、冷读等场景量化服务的能力，确定合理的消息发送 RT、端到端延迟和收发吞吐 TPS 能力等，一旦系统触发这些情况，可在承受范围内做限制和保护。

本篇文章从大规模弹性、集成易用性、可观测性和稳定性 SLA 等方面介绍了 RocketMQ 5.0 的演进和方向，同时针对性介绍了阿里云消息队列 RocketMQ 5.0 在这些方面的实践和落地。

---


阿里云消息队列 RocketMQ 5.0 目前已正式商业化，在功能、弹性、易用性和运维便捷性等方面进行了全面增强，同时定价相比上一代实例最高降低 50%，助力企业降本增效，以更低的门槛实现业务开发和集成。新一代实例支持 0～100 万 TPS 规模自伸缩、支持突发流量弹性和存储 Serverless；在可观测性方面，支持全链路轨迹集成和自定义 Metrics 集成；在集成易用性方面，支持新一代轻量原生多语言 SDK，更加稳定和易用。

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
