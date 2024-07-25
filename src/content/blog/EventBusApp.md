---
title: "事件总线 +  函数计算构建云上最佳事件驱动架构应用"
date: "2022/12/14"
author: "世如"
img: "https://img.alicdn.com/imgextra/i4/O1CN01OqQHJP1VESvF4h9jh_!!6000000002621-0-tps-685-383.jpg"
tags: ["practice"]
description: "今天的主题围绕事件总线+函数计算，构建云上最佳事件驱动架构应用。"
---

> 距离阿里云事件总线（EventBridge）和 Serverless 函数计算（Function Compute，FC）宣布全面深度集成已经过去一年，站在系统元数据互通，产品深度集成的肩膀上，这一年我们又走过了哪些历程？从事件总线到事件流，从基于 CloudEvents 的事件总线触发到更具个性化的事件流触发，函数计算已成为事件总线生态不可或缺的重要组成部分，承载了 EventBridge 系统架构中越来越多的角色，事件流基础架构的函数 Transform，基于函数计算的多种下游 Sink Connector 投递目标支持，函数作为 EventBridge 端点 API Destination；基于事件总线统一，标准的事件通道能力，和基于函数计算敏捷、轻量、弹性的计算能力，我们将又一次起航探索云上事件驱动架构的最佳实践。


今天的主题围绕事件总线+函数计算，构建云上最佳事件驱动架构应用。希望通过今天的分享，能够帮助大家深入理解 Serverless 函数计算、EventBridge 事件总线对于构建云上事件驱动架构应用的价值和背后的逻辑、 为什么函数计算是云上事件驱动服务最佳实践？为什么我们如此需要事件总线服务？伴随着这些谜题的解开，最后，让我们一起了解应用于实际生产的一些 Serverless 事件驱动客户案例。

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501621550-9474db21-c5cf-41ca-8cbf-2af995c5ea0d.png#clientId=uc0d08939-b5ae-4&height=610&id=A2lba&name=1.png&originHeight=610&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1d64f154-c99d-41a9-87d7-c5f0996e344&title=&width=1080)

## 事件驱动架构的本质

### Back to the Nature of Event-Driven

大家可能会疑惑，事件驱动家喻户晓，为什么我们又要重新讨论事件驱动呢？我想这也正是我们需要讨论它的原因，回归本质，重新起航；事件驱动可能是一个比较宽泛的概念，而本文聚焦事件驱动架构的讨论，事件驱动架构作为一种软件设计模式，的确不是一个新的概念，伴随着计算机软件架构的演进，它已经存在了一段很久的时间，大家对它的讨论也从未停止过，当我们需要重新讨论一个已经存在的概念的时候，我想我们有必要重新回到它最开始的定义，一起探索那些本质的东西，重新认识它。

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501621514-a8edf6f2-8785-4fba-90e7-ad111ad704f4.png#clientId=uc0d08939-b5ae-4&height=608&id=wMEoF&name=2.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=udf5aae34-dcec-40ee-b5ca-7d2321ba742&title=&width=1080)

上面的这些内容是我从相关的一些资料上摘录的关于事件驱动的一些描述，“abstract”，“simple”，“asynchronous”，“message-driven”这些具有代表性的词汇很好的给予事件驱动一个宏观的描述；从事件驱动的抽象概念，到它简洁的架构，以及事件驱动架构要达成的目的，和它在实际的系统架构中所展现的形态。

### 事件驱动架构基本概念及形态

在了解了关于事件驱动架构的一些基本描述之后，我们需要进一步明确事件驱动架构所涉及的一些基本概念和架构形态。根据维基百科描述，事件驱动架构涉及的核心概念如下所示：

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501623542-b4f2917f-deab-4728-81ee-4c6da5a76833.png#clientId=uc0d08939-b5ae-4&height=608&id=OKdFd&name=3.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf77dcaa1-93a4-4e1a-b7fa-f1629918ca7&title=&width=1080)
![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501621395-c5898a2e-a32e-4c1c-946b-9a06e86ad6ef.png#clientId=uc0d08939-b5ae-4&height=608&id=GSxkA&name=4.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8569b28b-26a7-46f3-8810-f260077ae3d&title=&width=1080)

围绕事件的流转，根据事件驱动架构的概念和基本形态，主要涉及以下四个核心部分：

- Event Producer：负责产生事件，并将产生的事件投递到事件通道；
- Event Channel：负责接收事件，并将接收的事件持久化存储，投递给订阅该事件的后端处理引擎；
- Event Processing Engine：负责对于订阅的事件做出响应和处理，根据事件更新系统状态；
- Downstream event-driven activity：事件处理完成之后，对于事件处理响应的一种展示；

### 事件驱动架构要达成的目的

了解了事件驱动架构的基本形态，架构中事件通道的引入，解耦了事件生产和事件处理这两个最基本的系统角色，那么这样的架构模型所要达成的最终目的到底是什么？

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501621399-8677afcc-e910-49c4-bb73-1453d60a0425.png#clientId=uc0d08939-b5ae-4&height=608&id=asWQZ&name=5.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub5cc8dfe-4d20-42f5-8a8d-d0db1f1dbce&title=&width=1080)

#### 系统架构松耦合

事件生产者与事件订阅者在逻辑上是分开的。事件的生成与使用的分离意味着服务具有互操作性，但可以独立扩缩、更新和部署。

只面向事件的松散耦合可以减少系统依赖项，并允许您以不同的语言和框架实现服务。您无需更改任何一个服务的逻辑，即可添加或移除事件生成方和接收方。您无需编写自定义代码来轮询、过滤和路由事件。

#### **系统的可伸缩性**

基于事件驱动架构的松耦合特性，意味着可以独立对事件生产者，事件通道服务，以及事件处理引擎进行独立的扩缩容；尤其对于后端事件处理引擎，可以根据消息处理响应 SLA 和后端资源供给进行弹性扩缩容；同时可以基于事件粒度构建不同规格的后端处理服务，实现更细粒度的系统弹性伸缩。

#### 系统的可扩展性

系统的可扩展性，主要表现在当系统需要增加新的功能，如何快速的基于现有系统架构快速构建支持新的业务逻辑，在事件驱动架构应用中，围绕事件粒度的处理模式，能够天然快速支持增加新的基于事件的数据流抽象；当系统中增加新的事件类型的时候，无需调整变更发布整个系统，只需要关注需要订阅的事件进行事件处理逻辑的开发和部署即可，也可以基于原来的系统做很少的代码变更即可实现，也可以在业务初期通过独立的服务定于指定事件完成特定的业务逻辑支持。

## 为什么函数计算是云上事件驱动服务最佳实践？

在讨论完事件驱动架构基本模型之后，我想关于事件驱动的概念，形态我们有了统一的认识和理解，接下来我们进入议题的第二个部分，为什么函数计算是云上事件驱动服务最佳实践？

### 函数计算简介

函数计算是一款基于事件驱动的全托管计算服务，相关的产品细节可以见官网介绍。作为一款通用的事件驱动型计算服务，接下来我会从三个方面进行详细的介绍。

![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501624663-47c5b770-e40a-4731-9a54-dbbebef2a821.png#clientId=uc0d08939-b5ae-4&height=608&id=QwuCQ&name=6.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua0433529-94b5-47c8-8541-f2d91561650&title=&width=1080)

#### 编程范式

使用函数计算，用户无需采购与管理服务器等基础设施，只需编写并上传代码。函数计算为你准备好计算资源，弹性地、可靠地运行任务，并提供日志查询、性能监控和报警等开箱即用功能，编程范式带来开发的敏捷性。按照函数粒度进行独立的功能单元开发，快速调试，快速的部署上线，省去了大量资源购买，环境搭建的运维工作；同时函数计算是一个事件驱动的模型，事件驱动，意味着用户不需要关注服务产品数据传递的问题，省去了在编写代码中涉及的大量服务访问连接的逻辑；“事件驱动” + “函数粒度开发” + “免服务器运维”等几个维度特征帮助函数计算支撑“聚焦业务逻辑敏捷开发”的底层逻辑。

![7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501623728-12c4fdee-f267-4e12-b862-0c56f0b319cb.png#clientId=uc0d08939-b5ae-4&height=608&id=KrcZr&name=7.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4b6c196d-074c-4a36-8eef-5eb6ffdca48&title=&width=1080)

#### 计算模型

除了开发模式带来的研发效能提升之外，函数计算提供非常细粒度的计算资源和毫秒级计费模型，支撑按需计算，按量收费；能够支持按用户的请求，根据用户流量的模型为计算付费；当然按用户请求付费存在技术上巨大的挑战，要求函数计算实例的启动小于用户的 RT 要求，冷启动性能尤为重要，这时候极致弹性成为了 Serverless 按需付费，业务降本的底层技术支撑。函数计算通过“极致弹性” + “按需付费”的模型帮助 Serverless 函数计算实现真正的按需计算逻辑。

![8.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501623930-c2942cb4-b69a-4e54-9bcb-fe8de89ccc3c.png#clientId=uc0d08939-b5ae-4&height=608&id=neTDy&name=8.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ufe9a56b0-841c-44b4-a94a-49cb618e667&title=&width=1080)

#### 事件驱动

在基于云的开发环境，云产品承载的服务相对内聚，各自扮演着分布式系统架构中的各个重要角色，云产品之间的事件触发机制能够帮助客户更好的基于多个云产品构建自己的业务系统；否则在云产品之间 Watch 事件是非常复杂，开发代价非常昂贵的一件事；除了产品连接带来的开发效率之外，当用户订阅某个事件，并提供处理逻辑的时候，客户已经潜在的过滤掉了不需要处理的事件请求，事件驱动意味着每一次的事件触发请求都是一次完全有效的计算。

![9.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501624393-83179a6a-c1fa-4c4e-967b-e3277a5a7795.png#clientId=uc0d08939-b5ae-4&height=608&id=ElHtA&name=9.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=udc439d6a-d41d-4bad-9528-7480478e4ea&title=&width=1080)

### 函数计算对于事件驱动架构的价值

为什么函数计算是云上最佳的事件驱动架构服务？函数计算对于事件驱动架构的核心价值到底是什么？事件驱动架构一直存在，在没有函数计算的时候，同样也有事件驱动架构，在微服务的时候也同样有事件驱动架构。如今，当我们重新再来讨论事件驱动架构的时候，到底是什么发生了变化，有哪些本质的区别？在整个事件驱动架构中，函数计算最大的价值在于帮助构建 “Event Processing Engine” 这个角色，我想主要是以下两个方面发生了本质的变化：

![10.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501624725-146f5996-b414-4cc3-9163-2c17771c33c6.png#clientId=uc0d08939-b5ae-4&height=608&id=zDjpO&name=10.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u434256f2-484a-45cb-a632-7ec1323fea1&title=&width=1080)

#### 系统可扩展性价值

开发模式发生了本质的变化：函数计算提供的框架能力及编程模型，最大化的消除了客户业务逻辑之外的处理内容，极大的加速了客户业务开发，同时基于这样这样的开发模式，用户对于新增事件处理逻辑能够在最短的时间完成处理并上线，细粒度，专注业务的敏捷开发模式能够加速业务快速上线。

#### 系统可伸缩性价值

计算模式发生了本质的变化：基于事件驱动架构事件粒度的处理逻辑和函数计算更细粒度力度计算弹性能力，能够从多个维度实现 “Event Processing Engine” 组件的弹性能力， 这我想这也是函数计算对于事件驱动架构的一个最核心价值。

## 为什么我们如此需要事件总线服务？

### 构建云上事件驱动架构挑战

函数计算以其轻量，快捷，能够利用事件驱动的方式与其他云产品进行联动的特点， 成为很多客户利用事件驱动架构构建业务系统的首选，随着业务及客户需求的不断增加，客户对于函数计算和更多云产品及服务的连接需求变得越来越多，同时对于其他云产品的客户而言， 也希望能够利用 Serverless 函数计算的特点帮助处理一些系统任务和事件。

尽管函数计算和云上的众多云产品进行了集成，提供了一些开箱即用的事件触发能力，那么我们为什么还需要事件总线服务来构建事件驱动应用架构呢？围绕函数计算构建事件驱动架构生态的过程中，我们面临主要来自三个方面的挑战。面对这些挑战，基于函数计算和事件总线帮助云上客户构建完备的事件驱动架构生态迫在眉睫。

![11.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501624779-ca340f75-d1b9-4c50-9bf3-04f695c22b7f.png#clientId=uc0d08939-b5ae-4&height=608&id=KKZa7&name=11.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u54c45f7a-af19-46af-a051-bf98f763d00&title=&width=1080)

#### 事件源多样性挑战

事件驱动作为函数计算产品核心竞争力，打通函数计算和其它云产品，以及用户自定义应用，SaaS 服务的连通成为函数计算生态集成的迫切需求，但系统集成，生态建设从来都不是一件容易的事情。函数计算系统在和 EventBridge 集成之前，已经和 OSS，SLS 等用户典型场景的云产品进行了集成，也和阿里云的其它大概十多款产品进行了集成，不同系统具有不同的事件格式，不同系统的注册通知机制也各不相同，以及上游不同系统的失败处理机制也各不相同；部分系统支持同步的调用方式，部分系统支持异步的调用方式，调用方式的差异主要取决于上游系统在接入函数计算的时候当时面临的产品业务场景，对于新的产品能力和业务场景的扩展支持，在当时并未有太多的考虑。随着和更多云产品的集成，集成的投入，集成的困难度和底层数据管理难度越来越大。面对多种事件源集成的客观困难，函数计算急需提高和其他云产品的集成效率。

#### 授权复杂及安全隐患

除此之外， 函数计算希望提升用户体验，保证用户只关心事件的处理；同时希望能够在面对大量的云产品时保证系统授权层面的复杂度。用户在使用事件触发的时候， 需要了解不同产品接入函数计算的权限要求，针对不同的产品需要提供不同的授权策略，对于客户使用函数计算带来了非常大的困难，为了加速产品接入，大量用户经常使用FullAcees权限，造成较大产品安全隐患， 和其它云产品的集成急需统一的授权界面，统一用户体验。

#### 通用能力难以沉淀

面对上游不同的事件源， 如何更好的投递事件、更好的消费事件？如何进行事件的错误处理？函数计算调用方式如何选择？以及函数计算后端错误 Backpressure 能力的反馈、重试策略和上游系统参数设置、触发器数量的限制等问题获成为函数计算事件触发不得不面对的问题。为了更好的服务客户，提供可靠的消费处理能力，函数计算希望能够有一个统一的接入层，基于统一的接入层进行消费能力和流控能力的建设。通过沉淀在这样一个标准的层面，在保证调用灵活性的同时，提供可靠的服务质量。

### 事件总线简介

阿里云事件总线（EventBridge） 是一种无服务器事件总线，支持将用户的应用程序、第三方软件即服务 (SaaS)数据和阿里云服务的数据通过事件的方式轻松的连接到一起，这里汇聚了来自云产品及 SaaS 服务的丰富事件；

#### 总线模式（EventBus）

![12.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501625075-0f4abcac-29da-40dd-97a7-98e14cb3b0d2.png#clientId=uc0d08939-b5ae-4&height=608&id=JUNeJ&name=12.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u82dec543-379f-45d9-b5ac-f99bbf93f23&title=&width=1080)

从整个架构来看，EventBridge 通过事件总线，事件规则将事件源和事件目标进行连接。首先，让我们快速普及下 EventBridge 架构中涉及的几个核心概念：

- **事件：**状态变化的记录；
- **事件源：**事件的来源，事件的产生者，产生事件的系统和服务， 事件源生产事件并将其发布到事件总线；
- **事件总线：**负责接收来自事件源的事件；EventBridge 支持两种类型的事件总线：
   - **云服务专用事件总线：**无需创建且不可修改的内置事件总线，用于接收您的阿里云官方事件源的事件。
   - **自定义事件总线：**标准存储态总线，用于接收自定义应用或存量消息数据的事件，一般事件驱动可选该总线。
- **事件规则：**用于过滤，转化事件，帮助更好的投递事件；
- **事件目标：**事件的消费者，负责具体事件的处理。

通过上面的流程，完成了事件的产生，事件的投递，事件的处理整个过程。当然事件并不是一个新的概念，事件驱动架构也不是一个新的概念，事件在我们的系统中无处不在，事件驱动架构同样伴随着整个计算机的架构演进，不断地被讨论。对于 EventBridge，采用云原生事件标准 CloudEvents 来描述事件；带来事件的标准化，这样的标准化和事件标准的开放性带来一个最显著的优势：接入的标准化，无论是对于事件源还是事件目标。

#### 事件流模式（EventStreaming）

消息产品凭借其异步解耦、削峰填谷的特点，成为了互联网分布式架构的必要组成部分，Serverless 函数计算有着与其完全吻合的应用场景，针对消息产品生态集成，函数计算在架构层面做了专门的建设，基于 EventBridge 产品提供的 EventStreaming 通道能力建设了通用的消息消费服务 Poller Service，基于该架构对用户提供了 RocketMQ，Kafka，RabbitMQ，MNS 等多个消息类型触发能力。

将消费的逻辑服务化，从业务逻辑中剥离由平台提供，消费逻辑和处理逻辑的分离，将传统架构的消息拉模型转化成 Serverless 化的事件驱动推模型，能够支撑由函数计算承载消息处理的计算逻辑 ，实现消息处理的 Serverless 化。基于这样的架构，能够帮助客户解决消息客户端的集成连接问题，简化消息处理逻辑的实现，同时对于波峰波谷的业务模型，结合函数计算提供细粒度的计算弹性能力，能够实现资源的动态扩容，降低用户成本。

![13.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501625434-0ef95b4a-e879-4940-9991-ed9cd1eceb6d.png#clientId=uc0d08939-b5ae-4&height=608&id=gBUGc&name=13.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u180e3743-4041-4de1-9b42-78df234163a&title=&width=1080)

### 事件总线对于事件驱动架构的价值

简化统一事件源接入

![14.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501625959-baeb18cc-4bf3-45bb-9d0b-28c396ce4435.png#clientId=uc0d08939-b5ae-4&height=608&id=edXjF&name=14.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud190e919-e08c-4ca6-9242-bab4c6527cb&title=&width=1080)

#### 沉淀通用事件通道能力
#### 
![15.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501625956-9b39c97f-2ef7-412d-971b-cc0d5a05f11b.png#clientId=uc0d08939-b5ae-4&height=608&id=GckoY&name=15.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u53331e94-950b-4a34-a602-d8352a21a9a&title=&width=1080)
![16.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501625944-6b57dcfd-8e6e-473e-b6cd-3a98e27a21fc.png#clientId=uc0d08939-b5ae-4&height=608&id=jKt6Q&name=16.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uce74f10a-42ed-4fb1-8e1e-7e0ab66ec61&title=&width=1080)

#### 提升优化用户集成体验

利用函数计算提供的 HTTP 函数 URL 能力，结合事件总线端点 API 能力，能够快速的帮助客户进行系统扩展和集成。

![17.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501625992-84090c2d-17c7-4ebd-bb2f-b60f59d53177.png#clientId=uc0d08939-b5ae-4&height=608&id=wm6Ml&name=17.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ueef7e736-dbb0-4378-8127-53e9b927daa&title=&width=1080)

## 客户场景案例分享

### 总线模式 + 函数计算用户案例

#### 利用 ActionTrail 事件触发函数进行多账号审计管理

![18.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501626374-71e1d1db-f2cc-4426-82cb-26e675845504.png#clientId=uc0d08939-b5ae-4&height=608&id=PwPcJ&name=18.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc8c0d830-092b-47fc-9e73-18f59a67418&title=&width=1080)

#### 利用 OSS 文件上传事件触发函数扩容 ACK  集群资源

![19.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501626968-6567f08e-76bb-41db-b3c5-928af1478f6a.png#clientId=uc0d08939-b5ae-4&height=608&id=ARoEw&name=19.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue415a46b-fe0f-4083-b530-7071ae3a899&title=&width=1080)

#### 利用 OSS 文件上传执行 Terraform 文件并访问外部 API 做结果通知

![20.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501627121-e75f7c3c-53ba-4a01-b6dc-1560d5e49c35.png#clientId=uc0d08939-b5ae-4&height=608&id=jqFMq&name=20.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u941211b9-a59d-4219-a6c3-9e4a6bde290&title=&width=1080)

### 事件流模式 + 函数计算用户案例

利用函数计算细粒度资源弹性特征，结合业务波峰波谷的特点，实现快速的消息清洗和处理。

#### 事件流触发函数计算处理业务消息

![20.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501627151-6d210e7d-ad8d-45f9-8b07-b8d792821fb2.png#clientId=uc0d08939-b5ae-4&height=608&id=tflOt&name=20.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0bf00644-ae53-4043-a5ef-29c78b41476&title=&width=1080)

#### 事件流触发函数计算进行简单 ETL 数据同步

![22.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501627217-0d3a1bf4-fa4c-434f-809e-193467f57d19.png#clientId=uc0d08939-b5ae-4&height=608&id=wHN2E&name=22.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u761625e5-1ae4-45e7-8d69-2998b169f9c&title=&width=1080)

#### 事件流触发函数进行简单 ETL 数据清洗入库

![23.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501627444-25668b02-00a2-4581-b9fa-ed8e5b64a453.png#clientId=uc0d08939-b5ae-4&height=608&id=M4zbA&name=23.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc5661a9c-3844-486d-af02-677b04fe687&title=&width=1080)

#### 函数异步+事件流触发函数构建电商运营通知系统

在购物车加购，商品变更通知场景，利用函数计算异步系统（内部自带 Queue 能力），触发大量运营通知，利用函数异步的 Destination 能力将运营通知结果写入 MQ，然后利用事件流能力对 MQ 数据进行再次处理，写入HBase数据库中。

![24.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501628177-08683b02-83ee-465e-abea-65a06015d9c7.png#clientId=uc0d08939-b5ae-4&height=608&id=Xrui1&name=24.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud2900737-ad4a-4879-b787-46d28f415ea&title=&width=1080)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)