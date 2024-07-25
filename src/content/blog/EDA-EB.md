---
title: "EDA 事件驱动架构与  EventBridge 二三事"
date: "2021/10/12"
author: "肯梦"
img: "https://img.alicdn.com/imgextra/i2/O1CN01spxFy425Qfdz9Fufv_!!6000000007521-0-tps-685-383.jpg"
tags: ["explore"]
description: "事件驱动型架构 (EDA) 方兴未艾，作为一种 Serverless 化的应用概念对云原生架构具有着深远影响。当我们讨论到一个具体架构时，首当其冲的是它的发展是否具有技术先进性。这里从我们熟悉的 MVC 架构，SOA 架构谈起，聊一聊关于消息事件领域的历史与发展趋势。"
---

当下比较成功的企业已然认识到，要想最大限度提升运营效率和客户体验，务必将业务和技术两方面的举措紧密结合起来。运营事件或业务形势的变化是时下众多企业关注的焦点，这些变化能够为企业领导者带来切实有用的信息，而架构设计的主旨恰恰是从客户联系人、交易、运营等方面的信息中获取洞见，两者相辅相成。传统技术历来对企业从事件中获取洞见的速度有着诸多限制，比如用于记录、收集和处理此类事件的批处理 ETL（提取、转换、加载）。

事件驱动型架构 (EDA) 方兴未艾，作为一种 Serverless 化的应用概念对云原生架构具有着深远影响。当我们讨论到一个具体架构时，首当其冲的是它的发展是否具有技术先进性。这里从我们熟悉的 MVC 架构，SOA 架构谈起，聊一聊关于消息事件领域的历史与发展趋势。

# **消息事件领域的发展趋势**

![图片 1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489020142-a4cd393f-ac45-4b3a-927a-5f91cc693104.png#clientId=uecb6297d-84a5-4&height=347&id=YiKoe&name=%E5%9B%BE%E7%89%87%201.png&originHeight=347&originWidth=866&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc5efde14-a312-4612-b3eb-972196825ac&title=&width=866)
早在 2018 年，Gartner 评估报告将 Event-Driven Model 列为 10 大战略技术趋势之一，事件驱动架构（EDA）将成为未来微服务的主流，并做出以下断言：

- 到 2022 年，事件通知的软件模型将成为超过 60% 的新型数字化商业的解决方案；
- 到 2022 年，超过 50% 的商业组织将参与到事件驱动的数字化商业服务的生态系统当中；

George Santayana 在《 The Life of Reason》曾提到， Those who fail to learn History are doomed to repeat it.（不懂历史的人注定会重蹈覆辙）。我们以史为鉴，来看看为什么会架构会演进到事件驱动。

![图片 2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489020282-316a2e9c-7257-4246-b062-2da043a19b2d.png#clientId=uecb6297d-84a5-4&height=381&id=Lkkzi&name=%E5%9B%BE%E7%89%87%202.png&originHeight=381&originWidth=866&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uaf1db095-ed15-4d4e-8015-13e7edc5768&title=&width=866)

架构本身没有优劣之分，它本身就是一组技术决策，决定后续项目的所有功能开发（框架，编码规范，文档，流程….），这里聊聊为什么会引入某些框架，这个框架解决了软件开发中的什么问题。

- 单体架构：在单节点服务中，单体应用的所有模块都封装在单个进程运行，通信通过相同堆栈调用完成。这种模式下非常容易导致结构和关系不明确，难以对系统进行更改和重构。就像一个不透明的，粘稠的，脆弱的，僵硬的 Big Ball of Mud！
- 分层架构：在经典的分层架构中，层以相当谨慎的方式使用。即一个层只能知道它下方层的数据。在随后的实际应用中，更多的方式是一个层可以访问它下面的任何层。分层架构解决了单体架构的的逻辑分离问题，每一层都可以被等效替换，层区分也更加标准化，同时一个层可以被几个不同/更高级别的层使用。当然，层也有比较明显的缺点，层不能封装掉一切，比如添加到UI的某个字段，可能也需要添加到DB，而且额外多余的层会严重损害系统性能。
- MVC 架构：MVC 架构产生的原因其实很简单，随着业务系统的复杂性增加，之前所谓“全栈工程师”已经不适用大部分场景。为了降低前端和后台的集成复杂性，故而开始推广 MVC 架构。其中，Model 代表业务逻辑，View 代表视图层比如前端UI的某个小组件，Controller 提供 View 和 Model 的协调比如将用户某项操作转为业务逻辑等。这里还有很多扩展架构，譬如 Model-View-Presenter ，Model-View-Presenter-ViewModel，Resource-Method-Representation，Action-Domain-Responder 。
- EBI 架构：即 Entity，Boundary（接口），Interactor（控制）。EBI架构将系统边界视为完整连接，而不仅仅是视图，控制器或接口。EBI 的实体代表持有数据并结束相关行为的实际实体，很类似阿里云的 POP API。EBI 主要还是后端概念，他是与 MVC 相辅相成的。
- 洋葱架构：洋葱架构是一种低耦合，高内聚的架构模型。所有的应用程序围绕独立的对象模型构建，内层定义接口外层实现接口，耦合方向向中心内聚，所有代码都可以独立与基础设施进行编译和运行。
- SOA 架构：SOA 是 Service Orientated Architure 的缩写，即面向服务架构。表示每一个功能都是通过一个独立的服务来提供，服务定义了明确的可调用接口，服务之间的编排调用完成一个完整的业务。其实这个架构也是目前架构中最成熟的，日常使用最多的架构模式。

# **什么是 EDA 架构**

我们聊完之前全部的架构趋势后，再回过头看看什么是 EDA 架构。

EDA 事件驱动架构( Event-Driven Architecture ) 是一种系统架构模型，它的核心能力在于能够发现系统“事件”或重要的业务时刻（例如交易节点、站点访问等）并实时或接近实时地对相应的事件采取必要行动。这种模式取代了传统的“ request/response ”模型，在这种传统架构中，服务必须等待回复才能进入下一个任务。事件驱动架构的流程是由事件提供运行的。

![图片 3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489022091-4feddd2b-e00f-4245-9b01-01017ca383fa.png#clientId=uecb6297d-84a5-4&height=285&id=nVfJI&name=%E5%9B%BE%E7%89%87%203.png&originHeight=285&originWidth=866&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7d308924-a1b7-4871-8bdb-d5d1ee3c53d&title=&width=866)

上图其实很好的解释了 EDA 架构的模型，但是其实还不够明确。所以，这里我们和单体架构一起对比看看他们之间差异。

![图片 4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489020071-89b25842-c247-4874-8994-4d2606125215.png#clientId=uecb6297d-84a5-4&height=416&id=uUnKi&name=%E5%9B%BE%E7%89%87%204.png&originHeight=416&originWidth=866&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue9334fad-36b8-44ba-a035-d6dc1e0acff&title=&width=866)

在如上对比图中，我们其实可以较为清楚看到它与传统架构的区别。在一般传统架构中，创建订单操作发生后，一系列的操作其实都是通过一个系统完成的。而事件驱动的概念则是将全部操作都转换为 “事件” 概念，下游通过捕获某个 “事件” 来决定调用什么系统完成什么样的操作。

总结来看，事件驱动其实是将比较重要的业务时刻封装成“事件”，并通过某个 EventBus 将事件路由给下游系统。

我们了解了 EDA 架构的整个处理过程，但是还没解决这个所谓的“EventBUS”到底是啥样。

![图片 5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489020111-98a16771-d1fe-420c-8679-a9492257fc64.png#clientId=uecb6297d-84a5-4&height=424&id=aqjpJ&name=%E5%9B%BE%E7%89%87%205.png&originHeight=424&originWidth=866&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7be0a374-d2f1-4816-b1af-79b28372313&title=&width=866)

上图就是事件驱动的核心逻辑架构。是不是非常像某个传统 MQ？别着急，下面我会讲到这个架构的复杂部分。讲完 EventBus，我们回过头来看“事件”，刚刚介绍中比较重要部分其实是将操作转换为某类事件进行分发。那这的事件我们怎么定义呢？

简单来看，其实事件就是状态的显著变化，当用户采取特定行动时触发。以 4S 店售卖汽车为例：

- 当客户购买汽车并且其状态从 For Sale 变为 Sold 是一个事件。
- 成功交易后，从帐户中扣除金额是一个事件。
- 单击预订试驾后，从将预约信息添加到指定用户就是一个事件。

每个事件都可能触发一个或多个选项作为响应。

关于事件其实云原生 CNCF 基金会在 2018 年托管了开源 CloudEvents 项目，该项目旨在用统一和规范的格式来描述事件，来加强不同的服务、平台以及系统之间的互操作性。在该项目定义下，通用的事件规范是这样的：
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489022546-7b95cd50-d701-4ed1-8848-d91051f3810f.gif#clientId=uecb6297d-84a5-4&height=1&id=DEQQv&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8b531103-9fa7-4662-9182-e3c447a9d91&title=&width=1)
![图片 6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489023302-1d320bcd-b46d-455f-b53c-56731d5fdf43.png#clientId=uecb6297d-84a5-4&height=602&id=sjwz7&name=%E5%9B%BE%E7%89%87%206.png&originHeight=602&originWidth=866&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6d1d3542-0e8d-435b-95f5-ff1be8f5908&title=&width=866)

事件主要由 Json 体构成，通过不同字段描述发生的事件。 

# **EDA 架构的落地实践思考**

在开始介绍落地实践时，我们先来看一个经典的 EDA 架构模型：
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489023109-d689b013-63c6-4fed-a3db-0d4cc26f0374.gif#clientId=uecb6297d-84a5-4&height=1&id=Wm5ZO&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc3d23bac-6955-430f-9ab1-d74c30be3f5&title=&width=1)
![图片 7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489023282-d3480417-02a8-49bd-b713-599fdbc6897c.png#clientId=uecb6297d-84a5-4&height=424&id=sVGYN&name=%E5%9B%BE%E7%89%87%207.png&originHeight=424&originWidth=866&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0657a278-5e7e-44d2-9d9f-a74bcea9d09&title=&width=866)

这是一个非常经典 EDA 订单架构，该架构主要使用了 EventBridge 和 FC 函数计算（如果不太熟悉 FaaS 的同学可以把 FC 节点当作 ECS 或 K8s 的某个 POD 节点），通过事件驱动各个业务进行协作。

所以这块的中心节点（EventBridge）其实有三个比较重要的能力：

1. For Event Capturing（事件收集）：具备采集事件的能力
2. For Routing（事件路由）：通过事件内容将事件路由分发至于下游的能力的
3. For Event Processing（事件过滤/替换）：对事件进行脱敏或初步过滤&筛选的能力

通常情况下，要实现这三个能力是比较困难的，比如：Event Capturing 可能需要熟悉 Dell Boomi, Snaplogic, MuleSoft, Dataflow, Apache Apex 等，Routing 部分可能通过 RocketMQ，RabbitMQ, ActiveMQ, Apache Kafka ，Event Processing 需要了解 Apache Storm, Apache Flink 。所以之前讲的逻辑架构其实非常理想，要想实现完成的 EDA 事件驱动还需要包括这些核心能力。
 
![图片 8.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489023218-38fe166d-8795-4dc4-a320-3839f232476f.png#clientId=uecb6297d-84a5-4&height=420&id=bkpZm&name=%E5%9B%BE%E7%89%87%208.png&originHeight=420&originWidth=866&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5f8fd59f-5bcc-4e3d-b376-35f49f85817&title=&width=866)

其实，从刚刚的架构中我们也能窥探到一些信息，EDA 架构其实看起来没有那么简单，那它有何优劣呢？下面我就简单罗列下 EDA 架构在实践中的优势：

- 松耦合：事件驱动架构是高度松耦合且高度分布式的架构模型，事件的创建者（来源）只知道发生的事件，并不知道事件的处理方式，也关心有多少相关方订阅该事件。
- 异步执行：EDA 架构是异步场景下最适合的执行工具，我们可以将需要事件保留在队列中，直到状态正常后执行。
- 可扩展性：事件驱动架构可以通过路由&过滤能力快速划分服务，提供更便捷的扩展与路由分发。
- 敏捷性：事件驱动架构可以通过将事件分发至任何地方，提供更敏捷高效的部署方案。


当然，劣势也很明显：

- 架构复杂：事件驱动架构复杂，路由节点多，系统结成复杂，功能要求多。
- 路由分发难：事件路由及分发难，灵活的事件路由需要依赖强大的实时计算能力，对整体分发系统要求较高。
- 无法追踪：事件追踪是整个 EDA 架构保证，EDA 架构中往往很难追踪到事件处理状态，需要大量的定制化开发。
- 可靠性差：事件驱动由于需要多系统集成，可靠性通常较差，且交付无法保障。

 
# **阿里云 EventBridge 如何解决 EDA 场景下的困境**

针对 EDA 场景下面临的这些问题，阿里云推出了 EventBridge，一款无服务器事件总线服务，其使命是作为云事件的枢纽，以标准化的 CloudEvents 1.0 协议连接云产品和应用，应用和应用，提供中心化的事件治理和驱动能力，帮助用户轻松构建松耦合、分布式的事件驱动架构；另外，在阿里云之外的云市场上有海量垂直领域的 SaaS 服务，EventBridge 将以出色的跨产品、跨组织以及跨云的集成与被集成能力，助力客户打造一个完整的、事件驱动的、高效可控的上云体验。并针对 EDA 困境提供了针对性的解决方案。
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489023194-a5a06202-d0fa-4b63-86d3-16d2c4c0ad90.gif#clientId=uecb6297d-84a5-4&height=1&id=QfRaG&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u3d611aa3-1325-4c2d-baab-1cfe22ff2c2&title=&width=1)
![图片 9.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489023656-58d0c43b-0e13-4129-a7a0-c17c8589e33a.png#clientId=uecb6297d-84a5-4&height=397&id=pSwpm&name=%E5%9B%BE%E7%89%87%209.png&originHeight=397&originWidth=866&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u730cfde8-b6f2-447f-b8f7-ff5d5ffe53a&title=&width=866)

架构复杂：提供业内通用的  Source ，Buses，Rules，Targets  模块管理能力，同时支持 EventBus 和 EventStream 两种模式。大幅度降低事件驱动架构难度。

路由分发：EventBridge 通过事件规则驱动，支持 8 大事件模式，4 重转换器，满足路由分发的全部诉求。

无法追踪：独家提供事件追踪能力，事件分析/查询能力。为用户完善整体事件链路。

可靠性差：支持 DLQ/ 重试机制，大幅度保证由于用户下游系统导致的事件故障与延迟。同时，在此基础上 EventBridge 支持 82 种阿里云产品，847 种事件类型。 

# **阿里云 EventBridge 更多场景介绍**

**1. 经典 EDA 事件驱动：**事件总线（EventBridge）最重要的能力是通过连接应用程序，云服务和 Serverless 服务构建 EDA（Event-driven Architectures） 事件驱动架构，驱动应用与应用，应用与云的连接。

![图片 10.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489023728-870278e8-9fad-485d-a14c-dbbb4ac623d8.png#clientId=uecb6297d-84a5-4&height=370&id=rReMe&name=%E5%9B%BE%E7%89%87%2010.png&originHeight=370&originWidth=866&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u92b92907-ac5d-4c00-ae84-d5fc12df23b&title=&width=866)

**2. 流式 ETL 场景：**EventBridge 另一个核心能力是为流式的数据管道的责任，提供基础的过滤和转换的能力，在不同的数据仓库之间、数据处理程序之间、数据分析和处理系统之间进行数据同步/跨地域备份等场景，连接不同的系统与不同服务。
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489023790-0378eff4-e69e-46d9-afbb-5b7fccddd799.gif#clientId=uecb6297d-84a5-4&height=1&id=ysVdy&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u3bd200a1-3446-45db-a2a8-87b1b30f538&title=&width=1)
![图片 11.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489024707-8f62d18f-9ac1-41f3-a3a5-b6c98bf2b8df.png#clientId=uecb6297d-84a5-4&height=279&id=QOacS&name=%E5%9B%BE%E7%89%87%2011.png&originHeight=279&originWidth=866&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf8c68694-b946-4085-9721-88ff60588b3&title=&width=866)

**3. 统一事件通知服务：**EventBridge 提供丰富的云产品事件源与事件的全生命周期管理工具，您可以通过总线直接监听云产品产生的数据，并上报至监控，通知等下游服务。 

![图片 12.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489024831-cf56a2b6-bfe2-4238-ac5d-06f98b930581.png#clientId=uecb6297d-84a5-4&height=412&id=TAowL&name=%E5%9B%BE%E7%89%87%2012.png&originHeight=412&originWidth=866&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua33c7f4b-9675-4125-bf9b-06c4893696a&title=&width=866)![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489024659-5a0d5753-576b-402e-ba65-478a44f94544.gif#clientId=uecb6297d-84a5-4&height=1&id=GO4K1&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua9c70133-fd0b-41dc-a3ce-571e84ba495&title=&width=1)

目前事件总线免费公测，点击下方链接，立即体验！
[https://www.aliyun.com/product/aliware/eventbridge?spm=5176.19720258.J_8058803260.46.70c22c4aFzf3Pq](https://www.aliyun.com/product/aliware/eventbridge?spm=5176.19720258.J_8058803260.46.70c22c4aFzf3Pq)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)