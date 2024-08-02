---      
title: "重新定义分析 -  EventBridge实时事件分析平台发布"
date: "2021/12/15"
author: "肯梦"
img: "https://img.alicdn.com/imgextra/i2/O1CN01ooyJqT1e1UEun50q0_!!6000000003811-0-tps-685-383.jpg"
tags: ["explore"]
description: "为了解决事件领域中针对流式事件做分析的难题，EventBridge 近日发布了针对事件/消息领域的全新分析工具--EventBridge 实时事件分析平台。下面简要对 EventBridge 实时事件分析平台的内容进行介绍。"
---

对于日志分析大家可能并不陌生，在分布式计算、大数据处理和 Spark 等开源分析框架的支持下，每天可以对潜在的数百万日志进行分析。

事件分析则和日志分析是两个完全不同的领域，事件分析对实时性的要求更高，需要磨平事件领域中从半结构化到结构化的消息转换管道，实现查询检索，可视化等功能。但是目前针对流式的事件做分析的可用工具非常少，这对于期望使用Serverless架构或 EDA（事件驱动）架构的开发者会非常不便。（更多 EDA 架构介绍参考 ：[https://developer.aliyun.com/article/806605](https://developer.aliyun.com/article/806605)）
基于事件的特征，无法追溯事件内容，无法跟踪事件流转，无法对事件做可视化分析成为了事件驱动架构演进的绊脚石。为了解决事件领域中针对流式事件做分析的难题，EventBridge 近日发布了针对事件/消息领域的全新分析工具--EventBridge 实时事件分析平台。下面简要对 EventBridge 实时事件分析平台的内容进行介绍。

## EventBridge 实时事件分析平台简介_



EventBridge 实时事件分析平台依托基于事件的实时处理引擎，提供数值检索、可视化分析、多组态分析、事件轨迹、事件溯源和 Schema 管理等能力。EventBridge 实时事件分析平台具有无入侵、无需数据上报，低成本，操作快捷等特点，通过简单的引导式交互，即可快速实现基于事件的流式查询与分析。

EventBridge 实时事件分析平台依托基于事件的实时处理引擎，提供数值检索，可视化分析，多组态分析，事件轨迹，事件溯源，Schema 管理等能力。EventBridge 实时事件具有无入侵，无需数据上报，低成本，操作快捷等特点，通过简单的引导式交互，即可快速实现基于事件的流式查询与分析。

![](https://img.alicdn.com/imgextra/i3/O1CN01GNFES41j6asTA20g2_!!6000000004499-1-tps-3840-2160.gif)

## 核心功能


### 多场景支持


![](https://img.alicdn.com/imgextra/i1/O1CN01jlerwm20kIgHyZw9m_!!6000000006887-49-tps-1080-792.webp)

目前市面上比较流行的是事件查询平台，但是分析和查询还是有些本质区别，分析基于查询，但是查询并不是分析的全部。

EventBridge 构建了一套完整的事件工具链，帮助开发，运维，甚至运营团队更高效的使用分析工具，统一在一个分析平台上无缝整合全部事件，提供高效、可靠、通用的事件分析能力。

- Serverless 领域：得益于 Serverless 架构的推广，事件驱动被更多用在企业核心链路。无服务器的定义是不必管理任何基础设施，但是无服务器的不透明且难以调试却是整个架构必需解决的痛点，当我们配置完触发器后不会知道什么数据在什么时刻触发了函数，触发链路是否异常。**EventBridge 事件分析能力将彻底解决 Serverless触发数据黑箱的问题，让所有事件触发都清晰可见。**

- 微服务领域：微服务在现代开发架构中比较常见，该架构由小型、松耦合、可独立部署的服务集合而成，这导致微服务架构很难调试，系统中某一部分的小故障可能会导致大规模服务崩溃。很多时候不得不跳过某些正常服务来调试单个请求。**EventBridge 事件分析可将全部链路微服务消息通过事件 ID 染色做有效追踪与排障，帮助微服务做可视化排障。**

- 消息领域：在传统消息领域，消息 Schema 管理、消息内容检索一直是无法解决的难题，大部分情况下需要增加订阅者来对消息做离线分析。**EventBridge 事件分析平台提供消息 Schema 管理与消息内容查询能力，为消息可视化提供更完全的解决方案。**

- 云产品领域：云产品在极大程度降低了企业对基础设施建设的复杂性，但同样带来了诸多问题，以 ECS 为例，很多情况会因系统错误或云盘性能受损而触发故障类事件，这类事件通常会涉及到周边产品（比如 ACK 等），捕获全部云上事件做基础排障的挑战性比较大。**EventBridge 支持全部云服务事件无缝接入，更大程度降低由云产品变更导致的运维故障。**

EventBridge 提供更高效、通用的事件分析平台，基于该平台可以解决大部分场景对事件分析、事件查询、事件轨迹的诉求。
### 
开箱即用


支持提供 Schema 管理，数值检索，可视化分析，多组态分析，事件轨迹，事件溯源等核心能力，无需额外部署，即开即用。

- 数值检索：提供基础数值检索能力，支持键入 key，value ，= ，!= , exists ，AND，OR 等参数，满足事件检索场景的基本诉求。



![](https://img.alicdn.com/imgextra/i1/O1CN01vNBvvV1sOl7yJOHbC_!!6000000005757-49-tps-371-453.webp)
<!-- ![](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489523502-58404d2b-02b9-4a07-883e-3862d72da94b.gif#clientId=ua2acb84e-22c2-4&from=paste&id=u33b44958&originHeight=1&originWidth=1&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u47f04250-95ca-4faf-9ed3-02aac481e37&title=) -->

- 可视化分析：提供 GROUP BY，ORDER BY 等可视化分析能力，支持多组态，多图表，多维度分析能力。



![](https://img.alicdn.com/imgextra/i4/O1CN01wKnM3Q1GkmmAwNmen_!!6000000000661-49-tps-1080-353.webp)

- 链路追踪：提供事件轨迹能力，还原事件整体链路状态。帮助开发者快速排障，快速定位链路问题。



![](https://img.alicdn.com/imgextra/i1/O1CN01lxUrIq1N2XpMv3JhT_!!6000000001512-49-tps-1080-336.webp)
### 
低成本接入


![](https://img.alicdn.com/imgextra/i2/O1CN01J0Zkyu1qHlqsRLOBR_!!6000000005471-49-tps-1080-456.webp)

EventBridge 支持以事件总线（EventBus）形式接入，分为云服务事件总线和自定义事件总线。云服务总线支持几乎全部阿里云产品事件，无缝支持云服务事件接入事件分析平台；自定义事件总线支持 RocketMQ、Kafka 或其他自定义事件接入（当前版本仅支持少量云服务事件）。

整体接入流程较为简单，对原有业务入侵小，可随时关闭或开启事件分析，同时实现在线配置，且具备实时生效功能。

## 总结_

EventBridge 提供更便捷高效的事件分析工具，可以帮助开发人员简单定义查询条件，及时进行可视化的事件内容分析。

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://img.alicdn.com/imgextra/i4/O1CN01Xi1rcu1DM6aIC7ypz_!!6000000000201-0-tps-1920-675.jpg)
