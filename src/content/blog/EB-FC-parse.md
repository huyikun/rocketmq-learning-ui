---
title: "EventBridge 与 FC  一站式深度集成解析"
date: "2022/04/06"
author: "史明伟（世如）"
img: "https://img.alicdn.com/imgextra/i1/O1CN01ldbQhQ1PQTcALgCRd_!!6000000001835-0-tps-685-383.jpg"
tags: ["practice"]
description: "本篇文章通过对 EventBridge 与 FC 一站式深度集成解析和集成场景的介绍，旨在帮助大家更好的了解面对丰富的事件时，如何使用 EventBridge 与 FC 的一站式集成方案，快速基于事件驱动（EDA）架构建云上业务系统。"
---

前言：事件总线 EventBridge 产品和 FC (Serverless 函数计算) 产品全面深度集成，意味着函数计算和阿里云生态各产品及业务 SaaS 系统有了统一标准的接入方式；依托 EventBridge 统一标准的事件源接入能力，结合 Serverless 函数计算高效敏捷的开发特点，能够帮助客户基于丰富的事件，结合 EDA 架构快速构建云上业务系统。为了帮助大家更好的理解，今天的介绍主要分为三部分：为什么需要一站式深度集成、FC 和 EventBridge 产品集成功能演示及场景介绍、EventBridge 和函数计算深度集成下一阶段规划。

## 为什么需要一站式深度集成？

首先让我们一起来看看什么是 EventBridge，什么是函数计算？

### 什么是 EventBridge?

## 
阿里云事件总线（EventBridge）是一种无服务器事件总线，支持将用户的应用程序、第三方软件即服务 (SaaS)数据和阿里云服务的数据通过事件的方式轻松的连接到一起，这里汇聚了来自云产品及 SaaS 服务的丰富事件；

![640 (77).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491278979-09afd966-0c81-49c6-89ea-556cfd3438b3.png#clientId=u44cec7fe-0f7c-4&height=443&id=OMYoZ&name=640%20%2877%29.png&originHeight=443&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc1685899-d6f8-4a56-b383-7cb7ceaa010&title=&width=1080)

从整个架构来看，EventBridge 通过事件总线，事件规则将事件源和事件目标进行连接。首先，让我们快速普及下 EventBridge 架构中涉及的几个核心概念：

- **事件：**状态变化的记录；
- **事件源：**事件的来源，事件的产生者，产生事件的系统和服务， 事件源生产事件并将其发布到事件总线；
- **事件总线：**负责接收来自事件源的事件；EventBridge支持两种类型的事件总线：
   - **云服务专用事件总线：**无需创建且不可修改的内置事件总线，用于接收您的阿里云官方事件源的事件。
   - **自定义事件总线**：标准存储态总线，用于接收自定义应用或存量消息数据的事件，一般事件驱动可选该总线。
- **事件规则：**用于过滤，转化事件，帮助更好的投递事件；
- **事件目标：**事件的消费者，负责具体事件的处理。

通过上面的流程，完成了事件的产生，事件的投递，事件的处理整个过程。当然事件并不是一个新的概念，事件驱动架构也不是一个新的概念，事件在我们的系统中无处不在，事件驱动架构同样伴随着整个计算机的架构演进，不断地被讨论。对于 EventBridge，采用云原生事件标准 CloudEvents 来描述事件；带来事件的标准化，这样的标准化和事件标准的开放性带来一个最显著的优势：接入的标准化，无论是对于事件源还是事件目标。

![640 (78).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491279165-fd9b8afa-d039-4659-9ca4-edd752220a1a.png#clientId=u44cec7fe-0f7c-4&height=593&id=POmED&name=640%20%2878%29.png&originHeight=593&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc7840bc8-0f85-4ac1-a785-f1c98fac5f2&title=&width=1080)

### 什么是函数计算（FC）？

函数计算是事件驱动的全托管计算服务。使用函数计算，您无需采购与管理服务器等基础设施，只需编写并上传代码。函数计算为您准备好计算资源，弹性地、可靠地运行任务，并提供日志查询、性能监控和报警等功能。

![640 (79).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491281067-b3d3a797-8251-46a4-86d3-72fe2ff41f90.png#clientId=u44cec7fe-0f7c-4&height=547&id=tJ7Ry&name=640%20%2879%29.png&originHeight=547&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8f92d673-e31f-41ff-98af-247b5fc5662&title=&width=1080)

通过上面的描述，总结起来大家只需要记住几点：

- 简单易用：快速上线，极大提升业务研发效率；
- 无服务器运维：节省运维投入；
- 按需付费：沉稳应对突发流量场景；
- 事件驱动：云产品互通，快速联动。

###  为什么函数计算需要 EventBridge?

函数计算以其轻量，快捷，能够利用事件驱动的方式与其他云产品进行联动的特点， 成为很多客户利用事件驱动架构构建业务系统的首选，随着业务及客户需求的不断增加，客户对于函数计算和更多云产品及服务的连接需求变得越来越多，同时对于其他云产品的客户而言， 也希望能够利用Serverless函数计算的特点帮助处理一些系统任务和事件。
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491278852-ffee7713-141f-402b-a5da-604230fc3a6b.gif#clientId=u44cec7fe-0f7c-4&height=1&id=sBBrP&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u70464f02-d0dd-44a8-9e82-501845b100c&title=&width=1)
![640 (80).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491279070-2828580a-93cc-41ba-ad43-f61916d5309c.png#clientId=u44cec7fe-0f7c-4&height=536&id=yMIow&name=640%20%2880%29.png&originHeight=536&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0e847b6a-4702-4ad3-b495-b1a1d1d862c&title=&width=1080)
### **1）事件源多样性挑战**


事件驱动作为函数计算产品核心竞争力，打通函数计算和其它云产品，以及用户自定义应用，SaaS 服务的连通成为函数计算生态集成的迫切需求，但系统集成，生态建设从来都不是一件容易的事情。函数计算系统在和 EventBridge 集成之前，已经和 OSS，SLS 等用户典型场景的云产品进行了集成，也和阿里云的其它大概十多款产品进行了集成，不同系统具有不同的事件格式，不同系统的注册通知机制也各不相同，以及上游不同系统的失败处理机制也各不相同；部分系统支持同步的调用方式，部分系统支持异步的调用方式，调用方式的差异主要取决于上游系统在接入函数计算的时候当时面临的产品业务场景，对于新的产品能力和业务场景的扩展支持，在当时并未有太多的考虑。随着和更多云产品的集成，集成的投入，集成的困难度和底层数据管理难度越来越大。面对多种事件源集成的客观困难，函数计算希望提高和其他云产品的集成效率。

### **2）授权复杂及安全隐患**


除此之外， 函数计算希望提升用户体验，保证用户关心事件的处理；同时希望能够在面对大量的云产品时保证系统授权层面的复杂度。用户在使用事件触发的时候， 需要了解不同产品接入函数计算的权限要求， 对于客户使用函数计算带来了非常大的困难，为了加速产品接入，大量用户经常使用 FullAcees 权限，造成较大产品安全隐患。
### **3）通用能力难以沉淀**


面对上游不同的事件源， 如何更好的投递事件、更好的消费事件？如何进行事件的错误处理？函数计算调用方式如何选择？以及函数计算后端错误 Backpressure 能力的反馈、重试策略和上游系统参数设置、触发器数量的限制等问题成为函数计算事件触发不得不面对的问题。为了更好的服务客户，提供可靠的消费处理能力，函数计算希望能够有一个统一的接入层，基于统一的接入层进行消费能力和流控能力的建设。通过沉淀在这样一个标准的层面，在保证调用灵活性的同时，提供可靠的服务质量。

### 为什么 EventBridge 同样需要函数计算？

EventBridge 作为标准的事件中心，目的是希望能够帮助客户把这些事件利用起来，能够通过事件将产品的能力进行联动，为了达成这样的目的，势必需要帮助客户通过更便捷的路径来快速消费处理这些事件。EventBridge 和函数计算的深度集成正是为了这样的共同目标 —— 帮助客户快速的构建基于 EDA 架构的业务系统，促进业务获得成功。

![640 (81).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491281373-5e8310ad-6c24-42c2-a0a6-9bc9939ef696.png#clientId=u44cec7fe-0f7c-4&height=547&id=nA0Va&name=640%20%2881%29.png&originHeight=547&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2e5eae00-a58a-4862-8f8c-bbcf3d8746f&title=&width=1080)

## FC 和 EventBridge 产品集成功能演示及场景介绍

# 
EventBridge 具体支持的事件类型， 基本上包括了阿里云所有的官方产品。可以通过 EventBridge 官方主页查看目前支持的阿里云官方产品事件源类型 。

![640 (82).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491281609-eb4b98d1-29c6-4e0b-b7d8-1318c5abad9f.png#clientId=u44cec7fe-0f7c-4&height=491&id=ik4MR&name=640%20%2882%29.png&originHeight=491&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u64a391fc-11ce-4e6e-a9fb-79ec1fddadf&title=&width=1080)

### EventBridge 触发器及异步集成
点击下方链接跳转查看：
[https://www.bilibili.com/video/BV1NY4y1e7fE/](https://www.bilibili.com/video/BV1NY4y1e7fE/)

函数计算异步链路支持将处理结果直接投递到 MQ 和 EventBridge，用户可以利用 EventBridge 将相关的结果投递到 SAAS 服务；

点击下方链接跳转查看：
[https://www.bilibili.com/video/BV1FY411j7yz/](https://www.bilibili.com/video/BV1FY411j7yz/)
###  双向集成的变化

## 
**

   1. 函数计算支持 85+阿里云官方事件源；
   2. 函数计算支持整个阿里云消息队列的事件触发，包括 RocketMQ， RabbitMQ，MNS 等；

**

   1. EventBridge 和函数计算控制台数据互通，用户无需在函数计算控制台和事件总线控制台来回跳转；
   2. 用户通过触发器详情，快速跳转，利用 EventBridge 事件追踪能力帮助用户快速排查问题；

###  官方事件源运维场景总结

基于官方事件源的事件驱动场景，大概可以总结抽象成四个场景。

**场景一**：单账号下某个云产品的运维需求。通常客户希望基于这样的一个事件，包括类似像云服务器事件 ECS，或者容器服务镜像事件，通过这样的事件监听做一些自动化诊断和运维操作。

**场景二：**实际是在场景一的基础上的一个扩展，针对多个云产品的事件，希望能够进一步分析，做一些故障处理。

**场景三：**我们观察到，大的一些企业，在使用云产品的时候，实际上是由多个账号去使用阿里云的产品。在多个账号，多个产品的情况下，希望能够对多个账号中的云资源使用情况有一个全局统一的视角进行实践分析，同时进行账号配额的一些调整。那这样的话就是可以利用到 EventBridge 跨账号事件投递的能力，然后再利用函数计算做一个统一处理。

**场景四：**这个场景实际上是一个账号跨域事件处理场景，EventBridge 目前并没有去提供这样一个跨域的能力，这种情况下，可以借助函数计算提供的 HTTP 函数能力，自动生成 HTTP Endpoint，通过 EventBridge 的 HTTP 事件源，完成事件的跨域消费。

![640 (83).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491281734-6c7a8382-d623-419a-a017-2e9320fe881a.png#clientId=u44cec7fe-0f7c-4&height=490&id=D2Ucr&name=640%20%2883%29.png&originHeight=490&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua603621d-b9f1-4f97-90ed-b54cf37f0be&title=&width=1080)

###  自定义事件源场景总结

1）MNS 队列自定义事件源触发场景：客户在 OSS 中上传文件之后，根据文件上传事件对 ACK 进行扩容，目前通过 OSS 事件发送到 MNS 中，然后由 MNSQueue 消息通过 EventBridge 触发函数计算， 在函数计算中根据一定的逻辑进行 ECI 资源的创建；同时客户希望通过 MNS 进行通知服务；利用 EventBridge 订阅模式，通过事件规则的定义，让通知服务和函数计算共享同一个事件订阅规则，可以大大的简化用户的方案。

![640 (84).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491283734-8b34082f-d90f-46e3-960d-5c776e63ec56.png#clientId=u44cec7fe-0f7c-4&height=356&id=PKNPt&name=640%20%2884%29.png&originHeight=356&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1dcc081d-76fb-44d9-a9d7-a4bf5df6db7&title=&width=1080)

2）RabbitMQ 队列自定义事件源触发场景：鉴于 RabbitMQ 在稳定性和可靠性方面的表现，在 IOT 场景具有非常普遍的使用，客户通常会选择使用 RabbitMQ 来进行端设备数据采集和存储， 考虑到 IOT 相关的嵌入式设备性能使用环境，通常端设备采集的数据比较偏向底层裸数据，在实际业务层面，客户需要找到一种快速高效的途径对 RabbitMQ 中的数据进行加工，通过 EventBridge 提供的自定义事件总线，利用函数计算对 RabbitMQ 中的数据快速处理， 实现 ETL 目的。
![640 (85).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491281828-60415b72-b22a-459f-a13a-d8bce88456aa.png#clientId=u44cec7fe-0f7c-4&height=479&id=ORIJm&name=640%20%2885%29.png&originHeight=479&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud79dfa5e-3abd-431c-9b9a-252c27e48e0&title=&width=1080)

## EventBridge 和函数计算深度集成下一阶段规划


### 事件过滤高级 ETL 处理

## 
将函数计算和 EventBridge 进行更紧密的集成，由函数计算提供一些高级的 ETL 能力，提升整个事件过滤转换的能力。

![640 (86).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491282313-bdbc98d0-9906-49f0-a529-2fa7f664f07c.png#clientId=u44cec7fe-0f7c-4&height=618&id=T5xBn&name=640%20%2886%29.png&originHeight=618&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u35e6989d-f767-4457-b166-72ab9873afc&title=&width=1080)


###  提供更丰富的事件目标

目前 EventBridge 整个下游的事件目标相对来说较少，我们希望能够通过函数计算和 EventBridge 的一个密切集成，利用函数计算敏捷的开发能力，分别通过大账号模式和用户自持的这样一个能力，构建一些更丰富的 EventBridge 下游事件目标，帮助丰富整个事件目标的生态。

![640 (87).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491282536-2aec12a4-5032-4652-8ae0-5d5561b9f15f.png#clientId=u44cec7fe-0f7c-4&height=605&id=Ex4bm&name=640%20%2887%29.png&originHeight=605&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u156d4b38-5e01-4a70-b06a-a3b31e1b69f&title=&width=1080)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)