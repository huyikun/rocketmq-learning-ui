---
title: "EventBridge 事件总线及 EDA  架构解析"
date: "2022/03/18"
author: "肯梦"
img: "https://img.alicdn.com/imgextra/i1/O1CN01GDeXAo1dVsudLV4bS_!!6000000003742-0-tps-685-383.jpg"
tags: ["explore"]
description: "EventBridge 是事件驱动的具体落地产品，也是 EDA 的最佳实践方式。"
---
作为 Gartner 定义的 10 大战略技术趋势之一，事件驱动架构（EDA）逐渐成为主流技术架构。根据 Gartner 的预估，在新型数字化商业的解决方案中，将有 60%使用 EDA，在商业组织参与的技术栈中，EDA 有一半的占比。

当下比较成功的企业已然认识到，要想最大限度提升运营效率和客户体验，务必要将业务和技术两方面的举措紧密结合起来。运营事件或业务形势的变化是时下众多企业关注的焦点，这些变化能够为企业领导者带来切实有用的信息，而架构设计的主旨恰恰是从客户联系人、交易、运营等方面的信息中获取洞见，两者相辅相成。传统技术历来对企业从事件中获取洞见的速度有着诸多限制，比如用于记录、收集和处理此类事件的批处理 ETL（提取、转换、加载）等。基于以上背景，阿里云 EventBridge 应运而生。

EventBridge 是事件驱动的具体落地产品，也是 EDA 的最佳实践方式。

## 事件驱动（EDA）是什么

早在 2018 年，Gartner 评估报告将 Event-Driven Model 列为 10 大战略技术趋势之一，事件驱动架构（EDA）将成为未来微服务的主流。该报告同时做出了以下断言：

- 到 2022 年，事件通知的软件模型将成为超过 60% 的新型数字化商业的解决方案；
- 到 2022 年，超过 50% 的商业组织将参与到事件驱动的数字化商业服务的生态系统当中。

很喜欢 George Santayana 在《 The Life of Reason》说的一句话 Those who fail to learn History are doomed to repeat it.（不懂历史的人注定会重蹈覆辙）。我们以史为鉴，来看看为什么会架构会演进到事件驱动。

![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490739637-3deb746b-b4a9-4cff-9b40-b424e499f935.gif#clientId=uc13b1339-be13-4&height=1&id=HzXHA&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ude813bc2-c257-4385-9114-ddd58dc4cd8&title=&width=1)![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490739841-b4b0b2e4-194d-4f50-b124-9df430eb834a.png#clientId=uc13b1339-be13-4&height=449&id=Dibmi&name=1.png&originHeight=449&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u64fbceff-eaef-4541-ad2c-9e46a404148&title=&width=1080)

上图是关于架构演进时间轴线。架构本身没有优劣之分，它本身就是一组技术决策，决定后续项目的所有功能开发（框架，编码规范，文档，流程….），所以这里不谈选型好坏，只谈为什么会引入某些框架，这个框架解决了软件开发中的什么问题。

- **单体架构：**在单节点服务中，单体应用的所有模块都封装在单个进程运行，通信通过相同堆栈调用完成。这种模式下非常容易导致结构和关系不明确，难以对系统进行更改和重构。就像一个不透明的，粘稠的，脆弱的，僵硬的 Big Ball of Mud！

- **分层架构：**在经典的分层架构中，层以相当谨慎的方式使用。即一个层只能知道它下方层的数据。在随后的实际应用中，更多的方式是一个层可以访问它下面的任何层。分层架构解决了单体架构的的逻辑分离问题，每一层都可以被等效替换，是用层区分也更加标准化，同时一个层可以被几个不同/更高级别的层使用。当然，层也有比较明显的缺点，层不能封装掉一切，比如添加到 UI 的某个字段，可能也需要添加到 DB，而且额外多余的层会严重损害系统性能。

- **MVC 架构：**MVC 架构产生的原因其实很简单，随着业务系统的复杂性增加，之前所谓“全栈工程师”已经不适用大部分场景。为了降低前端和后台的集成复杂性，故而开始推广 MVC 架构。其中，Model 代表业务逻辑；View 代表视图层，比如前端 UI 的某个小组件；Controller 提供 View 和 Model 的协调，比如将用户某项操作转为业务逻辑等。此外还有很多扩展架构，譬如 Model-View-Presenter，Model-View-Presenter-ViewModel，Resource-Method-Representation，Action-Domain-Responder 就不在细说了，感兴趣的同学可以 wiki 搜索下。

- **EBI 架构：**即 Entity，Boundary（接口），Interactor （控制）。EBI 架构将系统边界视为完整连接，而不仅仅是视图，控制器或接口。EBI 的实体代表持有数据并结束相关行为的实际实体，很类似阿里云的 POP API。EBI 主要还是后端概念，它是与 MVC 相辅相成的。

- **洋葱架构：**洋葱架构是一种低耦合，高内聚的架构模型。所有的应用程序围绕独立的对象模型构建，内层定义接口，外层实现接口，耦合方向向中心内聚，所有代码都可以独立与基础设施进行编译和运行。

- **SOA 架构：**SOA 是 Service Orientated Architure 的缩写，即面向服务架构。表示每一个功能都是通过一个独立的服务来提供，服务定义了明确的可调用接口，服务之间的编排调用可完成一个完整的业务。其实这个架构也是目前架构中最成熟的，日常使用最多的架构模式。

在介绍完之前全部的架构趋势后，在回过头看看什么是 EDA 架构。

EDA 事件驱动架构( Event-Driven Architecture ) 是一种系统架构模型，它的核心能力在于能够发现系统“事件”或重要的业务时刻（例如交易节点、站点访问等）并实时或接近实时地对相应的事件采取必要行动。这种模式取代了传统的“ request/response ”模型，在这种传统架构中，服务必须等待回复才能进入下一个任务。事件驱动架构的流程是由事件提供运行的。

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490741665-8df88f49-a839-4a02-bb26-b64e38f8e0ff.png#clientId=uc13b1339-be13-4&height=356&id=b6A7v&name=2.png&originHeight=356&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue0519436-9781-43f7-97f7-999dbfc02b5&title=&width=1080)

上图其实很好的解释了 EDA 架构的模型，但是其实还不够明确，所以这里我们和单体架构一起对比看看他们之间差异。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490739580-89bad4d3-ac30-4aa7-ac34-656d8b3734be.gif#clientId=uc13b1339-be13-4&height=1&id=QKnjP&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u37cd2614-9bf0-4ee2-9f29-93a3e588c7a&title=&width=1)

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490739836-c58f99e0-abd7-449c-bd87-c2be3a806480.png#clientId=uc13b1339-be13-4&height=519&id=A9j58&name=3.png&originHeight=519&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue49cd553-5e3e-470d-8150-e13e8611122&title=&width=1080)

在如上对比图中，我们其实可以较为清楚看到它与传统架构的区别。在一般传统架构中，创建订单操作发生后，一系列的操作其实都是通过一个系统完成的。而事件驱动的概念则是将全部操作都转换为 “事件” 概念，下游通过捕获某个 “事件” 来决定调用什么系统完成什么样的操作。

我们回过头来看“事件”，刚刚介绍中比较的重要部分其实是将操作转换为某类事件进行分发。那这的事件我们怎么定义呢？

简单来看，其实事件就是状态的显著变化，当用户采取特定行动时触发。以 4S 店售卖汽车为例：

- 当客户购买汽车并且其状态从 For Sale 变为 Sold 是一个事件；
- 成功交易后，从帐户中扣除金额是一个事件；
- 单击预订试驾后，从将预约信息添加到指定用户就是一个事件；

每个事件都可能触发一个或多个选项作为响应。

事件其实云原生 CNCF 基金会在 2018 年托管了开源 CloudEvents 项目，该项目旨在用统一和规范的格式来描述事件，来加强不同的服务、平台以及系统之间的互操作性。在该项目定义下，通用的事件规范是这样的：

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490741984-0613c07e-c5c1-4324-a698-828752ea6c96.png#clientId=uc13b1339-be13-4&height=752&id=ahNXf&name=4.png&originHeight=752&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2fe9751d-03bb-4988-972b-8b0ebf0f1cc&title=&width=1080)

事件主要由 Json 体构成，通过不同字段描述发生的事件。

总结来看，事件驱动其实是将比较重要的业务时刻封装成“事件”，并通过某个 EventBus 将事件路由给下游系统。

了解了 EDA 架构的整个处理过程，但是还没解决这个所谓的“EventBus”到底是什么？

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490741993-4f3e5b6e-4e68-4a71-b829-f5aa0be6b700.png#clientId=uc13b1339-be13-4&height=530&id=vEkWi&name=5.png&originHeight=530&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uced9dc64-b702-42f6-a7de-67f7c83f4a7&title=&width=1080)

如上图就是 EventBus 的核心逻辑架构，它由 Event Producer 和 Event Consumer 两端组成，通过 Bus 解耦中间环节，是不是非常像某个传统的 MQ 架构？别着急，在接下来的落地实践部分会讲解这个架构的复杂部分。

## EDA 架构的落地实践思考

在开始介绍落地实践时，我们先来看一个经典的 EDA 架构模型：
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490742273-f768acc1-014e-4bbc-9ec8-e79cc8afd8ae.gif#clientId=uc13b1339-be13-4&height=1&id=f4jm8&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u03052852-80e9-42ca-aba2-742500e6ca9&title=&width=1)
![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490742298-1cc9d3c1-aecd-4f55-a34a-8c4a8aff092a.png#clientId=uc13b1339-be13-4&height=528&id=fvlcG&name=6.png&originHeight=528&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc0baac82-ad96-4d44-832d-7e4ccf160dc&title=&width=1080)

这是一个非常经典 EDA 订单架构，该架构主要使用了 EventBridge 和 FC 函数计算（如果不太熟悉 FaaS 的同学可以把 FC 节点当作 ECS 或 Kubernetes 的某个 POD 节点），通过事件驱动各个业务进行协作。

所以这块的中心节点（EventBridge）其实有三个比较重要的能力：

1. For Event Capturing（事件收集）：具备采集事件的能力；
2. For Routing（事件路由）：通过事件内容将事件路由分发至于下游的能力；
3. For Event Processing（事件过滤/替换）：对事件进行脱敏或初步过滤&筛选的能力。

通常情况下，要实现这三个能力是比较困难的，比如：Event Capturing 可能需要熟悉 Dell Boomi, Snaplogic, MuleSoft, Dataflow, Apache Apex 等，Routing 部分可能通过 RocketMQ、RabbitMQ、ActiveMQ、Apache Kafka，Event Processing 需要了解 Apache Storm, Apache Flink 。所以之前讲的逻辑架构其实非常理想，要想实现完成的 EDA 事件驱动还需要包括这些核心能力。
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490742898-6be49c16-71f2-4994-906d-2e6e7e58a969.gif#clientId=uc13b1339-be13-4&height=1&id=aCCIq&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4b41ef50-b293-4c07-9a87-6d44998b079&title=&width=1)

![7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490743168-6b84caca-758b-47cb-be0e-18a233f95a69.png#clientId=uc13b1339-be13-4&height=525&id=wUFZJ&name=7.png&originHeight=525&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ued8c92bf-fa53-47f6-8f3f-b7c40db4686&title=&width=1080)

其实，从刚刚的架构中我们也能窥探到一些信息，EDA 架构其实看起来没有那么简单，那它有何优劣呢？

下面简单罗列下 EDA 架构在实践中的优势：

**松耦合：**事件驱动架构是高度松耦合且高度分布式的架构模型，事件的创建者（来源）只知道发生的事件，并不知道事件的处理方式，也关心有多少相关方订阅该事件；

**异步执行：**EDA 架构是异步场景下最适合的执行工具，我们可以将需要事件保留在队列中，直到状态正常后执行；

**可扩展性：**事件驱动架构可以通过路由&过滤能力快速划分服务，提供更便捷的扩展与路由分发；

**敏捷性：**事件驱动架构可以通过将事件分发至任何地方，提供更敏捷高效的部署方案。

当然，劣势也很明显：

**架构复杂：**事件驱动架构复杂，路由节点多，系统结成复杂，功能要求多；

**路由分发难：**事件路由分发难，灵活的事件路由需要依赖强大的实时计算能力，对整体分发系统要求较高；

**无法追踪：**事件追踪是整个 EDA 架构的保证，EDA 架构中往往很难追踪到事件处理状态，需要大量的定制化开发；

**可靠性差：**事件驱动由于需要多系统集成，可靠性通常较差，且交付无法保障。

## _

针对 EDA 场景面临的这些问题，阿里云推出了 EventBridge，一款无服务器事件总线服务，其使命是作为云事件的枢纽，以标准化的 CloudEvents 1.0 协议连接云产品和应用、应用和应用，提供中心化的事件治理和驱动能力，帮助用户轻松构建松耦合、分布式的事件驱动架构；另外，在阿里云之外的云市场上有海量垂直领域的 SaaS 服务，EventBridge 将以出色的跨产品、跨组织以及跨云的集成与被集成能力，助力客户打造一个完整的、事件驱动的、高效可控的上云体验。

阿里云对 EventBridge 做了定义，核心价值包括：

- 统一事件枢纽：统一事件界面，定义事件标准，打破云产品事件孤岛；
- 事件驱动引擎：海量事件源，毫秒级触发能力，加速 EDA/Serverless 架构升级；
- 开放与集成：提供丰富的跨产品、跨平台连接能力，促进云产品、应用程序、SaaS 服务相互集成。

![8.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490743091-18709ae4-8d58-4aa7-82c6-6df8b766d4fa.png#clientId=uc13b1339-be13-4&height=434&id=kC3SZ&name=8.png&originHeight=434&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u55d6ba52-a2bb-4e30-9d2f-5a51c2d3641&title=&width=1080)

下面从架构层面和功能层面对 EventBridge 进行介绍：

###  架构层面

针对架构复杂问题，EventBridge 提供业内通用的 Source ，Buses，Rules，Targets 模块管理能力，同时支持 EventBus 和 EventStream 两种模式，大幅度降低事件驱动架构难度。

![9.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490743628-14aa5295-ad50-4c66-bd8f-23efcb186020.png#clientId=uc13b1339-be13-4&height=495&id=oINdG&name=9.png&originHeight=495&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud66ef20a-3345-4ec8-ab2e-56cb6d14a31&title=&width=1080)

1）事件总线模型经典 EDA（ 事件驱动）场景的 N：N 模型，提供多事件路由，事件匹配，事件转换等核心能力，帮助开发者快速搭建事件驱动架构。

![10.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490743784-3787acf9-3e5b-4025-abfe-0c033182536d.png#clientId=uc13b1339-be13-4&height=326&id=SLSrQ&name=10.png&originHeight=326&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua9d8cebf-33a0-41b9-b669-87040e069e3&title=&width=1080)

2）事件流模型标准 Streaming（1:1） 流式处理场景，无总线概念，用于端到端的数据转储，数据同步及数据处理等，帮助轻松构建云上端到端的数据管道服务。

![11.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490744002-41e431de-3677-4f17-8ea0-58682c6aadb1.png#clientId=uc13b1339-be13-4&height=231&id=EjYXa&name=11.png&originHeight=231&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1fd76337-e316-4887-924d-d77fecc4036&title=&width=1080)

### 功能层面

在功能层面，EventBridge 的核心亮点应用包括：

**1）事件规则驱动**
针对基于事件的路由分发，EventBridge 通过事件规则驱动，支持 8 大事件模式，4 重转换器，满足路由分发的全部诉求。

![12.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490743940-1bfde1f3-5ad7-42fc-945c-97cbefba177e.png#clientId=uc13b1339-be13-4&height=596&id=y58PK&name=12.png&originHeight=596&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2c09e182-f2ff-4704-8429-8fde9daa484&title=&width=1080)

**2）事件追踪**
针对事件无法追踪，独家提供事件追踪能力，事件分析/查询能力。为用户完善的全链路事件查询分析能力。

![13.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490743977-626eb74e-b8c0-43f7-a8a0-e3547b59825f.png#clientId=uc13b1339-be13-4&height=515&id=TA6ul&name=13.png&originHeight=515&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud90fc624-ec2d-411c-a141-12ca0d6ed14&title=&width=1080)

**3）DLQ/重试机制、事件全流程触发**
针对可靠性差，支持 DLQ/重试机制，与事件全流程触发，大幅度保证由于用户下游系统导致的事件故障与延迟。

![14.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490744617-c6c524bc-a84e-4d24-bd43-3b4397591943.png#clientId=uc13b1339-be13-4&height=522&id=y2F0H&name=14.png&originHeight=522&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1668b3db-cb33-418a-a282-fc59a649e51&title=&width=1080)

**4）Schema 注册中心**
针对事件管理复杂，支持 Schema 注册中心，支持事件信息的解释、预览和上下游代码生成能力，帮助用户低代码完成事件的收发处理。解决跨部门信息沟通困难，业务代码冗余等一系列事件管理问题。

**5）同时，基于以上功能 EventBridge 支持对接 85 种以上的阿里云产品，847 种事件类型。**

![15.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490744717-7b25c94a-f663-4c8f-aa5b-a8510ee9cc2d.png#clientId=uc13b1339-be13-4&height=522&id=tKEWU&name=15.png&originHeight=522&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue49b2fa6-a2d0-4f11-bf9a-0f1becddacd&title=&width=1080)

更多产品功能介绍，可访问 EventBridge 官网
[_https://www.aliyun.com/product/aliware/eventbridge_](https://www.aliyun.com/product/aliware/eventbridge)

## 阿里云 EventBridge 更多场景介绍


### 经典 EDA 事件驱动

事件总线（EventBridge）最重要的能力是通过连接应用程序、云服务和 Serverless 服务来构建 EDA（Event-driven Architectures） 事件驱动架构，驱动应用与应用，应用与云的连接。

![16.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490744699-fe72d880-15fb-4dc0-b926-07d834727e45.png#clientId=uc13b1339-be13-4&height=461&id=p96mH&name=16.png&originHeight=461&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u97c5e326-c6ec-4709-be72-aad7819ee10&title=&width=1080)

###  流式 ETL 场景

EventBridge 另一个核心能力是为流式的数据管道的责任，提供基础的过滤和转换的能力，在不同的数据仓库之间、数据处理程序之间、数据分析和处理系统之间进行数据同步/跨地域备份等场景，连接不同的系统与不同服务。

![17.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490744918-20c65b7f-6ea8-4a63-8b57-386aa411e4fe.png#clientId=uc13b1339-be13-4&height=349&id=Ooy0I&name=17.png&originHeight=349&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua03d73c6-a6b4-4f57-a3b3-fc3a4936c46&title=&width=1080)

###  统一事件通知服务

EventBridge 提供丰富的云产品事件源与事件的全生命周期管理工具，您可以通过总线直接监听云产品产生的数据，并上报至监控，通知等下游服务。

![18.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490745494-8871eb91-43eb-4a39-ae04-e1896b30ac94.png#clientId=uc13b1339-be13-4&height=514&id=YlUJM&name=18.png&originHeight=514&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uaa332973-6974-4354-a855-e33444574fd&title=&width=1080)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)