---
title: "EventBridge消息路由｜高效构建消息路由能力"
date: "2022/02/22"
author: "肯梦"
img: "https://img.alicdn.com/imgextra/i1/O1CN01a1cXDP1pmANiuxAzD_!!6000000005402-0-tps-685-383.jpg"
tags: ["explore"]
description: "企业数字化转型过程中，天然会遇到消息路由，异地多活，协议适配，消息备份等场景。本篇主要通过 EventBridge 消息路由的应用场景和应用实验介绍，帮助大家了解如何通过 EventBridge 的消息路由高效构建消息路由能力。"
---
企业数字化转型过程中，天然会遇到消息路由，异地多活，协议适配，消息备份等场景。本篇主要通过 EventBridge 消息路由的应用场景和应用实验介绍，帮助大家了解如何通过 EventBridge 的消息路由高效构建消息路由能力。

## 背景知识


EventBridge 消息路由主要涉及以下云产品和服务：

- **事件总线 EventBridge**

事件总线 EventBridge 是阿里云提供的一款无服务器事件总线服务，支持阿里云服务、自定义应用、SaaS 应用以标准化、中心化的方式接入，并能够以标准化的 CloudEvents 1.0 协议在这些应用之间路由事件，帮助您轻松构建松耦合、分布式的事件驱动架构。

- **消息队列 RabbitMQ 版**

阿里云消息队列 RabbitMQ 版支持 AMQP 协议，完全兼容 RabbitMQ 开源生态以及多语言客户端，打造分布式、高吞吐、低延迟、高可扩展的云消息服务。开箱即用，用户无需部署免运维，轻松实现快速上云，阿里云提供全托管服务，更专业、更可靠、更安全。

- **消息队列 MNS 版**

阿里云消息服务 MNS 版是一款高效、可靠、安全、便捷、可弹性扩展的分布式消息通知服务。MNS 能够帮助应用开发者在他们应用的分布式组件上自由的传递数据、通知消息，构建松耦合系统。

## 场景应用

EventBridge 消息路由功能在构建在构建消息系统过程中主要应用于下面三个场景，一是消息路由场景，二是消息多活场景，三是多协议适配场景，下面对这三个场景进行简要介绍。

### 消息路由场景

该场景是指希望对消息进行二次分发，通过简单过滤或者筛选将消息分发到其他 Topic 或跨地域 Topic，实现消息共享 & 消息脱敏的场景。

通过一层转发将消息分发给不同的 Topic 消费，是消息路由的核心能力。随着企业转型遇到消息拆分且做业务脱敏的场景会越来越多。如下图是一个较为典型的路由分流场景。
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490412611-d6831694-c190-4630-a3b3-ba6426640be4.gif#clientId=u0b9c6118-e92b-4&height=1&id=ciJOq&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub8e97f17-cdf1-4ceb-a939-2958aa5e46f&title=&width=1) -->

![1.png](https://img.alicdn.com/imgextra/i1/O1CN01dKT8AG1wqTYgzWYYw_!!6000000006359-0-tps-1080-279.jpg)

### 消息多活场景

消息多活场景指每个数据中心均部署了完整、独立的 MQ 集群。数据中心内的应用服务只连接本地的 MQ 集群，不连接其他单元的 MQ 集群。MQ 集群中包含的消息路由模块，负责在不同单元 MQ 集群之间同步指定主题的消息。

根据应用服务是否具有单元化能力，可分为中心服务和单元服务两类。中心服务只在一个数据中心提供服务；单元服务在各个数据中心都提供服务，但只负责符合规则的部分用户，而非全量用户。

所有部署了单元服务的数据中心都是一个单元，所有单元的单元服务同时对外提供服务，从而形成一个异地多活架构或者叫单元化架构。通过多活管控平台可动态调整各个单元服务负责的流量。
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490414618-ef91d5bd-bfc9-45a3-93c9-7c58cd0c33f8.gif#clientId=u0b9c6118-e92b-4&height=1&id=oCD4A&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2024d49b-2ca2-45bf-ab0a-d105925740f&title=&width=1) -->

![2.png](https://img.alicdn.com/imgextra/i4/O1CN01o6A7XT268BPiHAOfc_!!6000000007616-0-tps-1080-441.jpg)

### 多协议适配场景

随着业务团队的逐渐庞大，对消息的建设诉求与日俱增，由于部门技术栈的不同会导致部门间的消息协议也不尽相同。多协议适配是指用一种消息协议平滑迁移到多种消息协议的能力。

![3.png](https://img.alicdn.com/imgextra/i1/O1CN01q7NYPl1vpjIWHgYp0_!!6000000006222-0-tps-1080-407.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490414816-0eabe9f5-068e-415a-86d3-6da3cc8dc59d.gif#clientId=u0b9c6118-e92b-4&height=1&id=scbgt&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc1f94086-4f28-463f-b831-c32c40b0a27&title=&width=1) -->
## 架构描述

使用 EventBridge 的事件流能力做消息路由，事件流模型是 EventBridge 在消息领域主打的处理模型，适用标准 Streaming（1:1）流式处理场景，无总线概念。用于端到端的消息路由，消息转储，消息同步及处理等，帮助开发者轻松构建云上数据管道服务。

下面的架构展示了如何通过桥接 EventBridge 实现 MNS 消息路由至 RabbitMQ Queues，MNS Queues。（A/B 链路任选其一进行试验）
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490414925-a17ca711-db78-4ce7-9f1a-17f63d9f5ab2.gif#clientId=u0b9c6118-e92b-4&height=1&id=ER1X7&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub77b57a1-bea9-446a-a8e8-05694a8e65c&title=&width=1) -->

![4.png](https://img.alicdn.com/imgextra/i3/O1CN01ugzj8c1W5b0bjfjEm_!!6000000002737-0-tps-1080-411.jpg)
## 应用实验


### 目标

通过本实验教程的操作，您可以通过阿里云控制台，在事件总线控制台中创建消息路由服务，在 EventBridge 控制台实现消息路由与简单的消息脱敏。

体验此实验后，可以掌握的知识有：

- 创建消息路由任务；
- 创建 RabbitMQ 实例、MNS 实例与简单的消息发送。



### 资源

使用到的资源如下：（本次实验资源遵循最小原则，使用满足场景需求的最小化资源）

- 资源一：EventBridge 事件总线
- 资源二：阿里云消息队列 RabbitMQ 版
- 资源三：阿里云消息队列 MNS 版



### 步骤

#### 1）创建 MNS 资源

![5.png](https://img.alicdn.com/imgextra/i3/O1CN01Wrlre51QrKau7ybnE_!!6000000002029-0-tps-1080-411.jpg)

本实验分 A /B 两个可选场景：

A 、场景通过 MNS Queues1 投递至 MNS Queues2
B 、场景通过 MNS Queues1 投递至 RabbitMQ Queues

可根据兴趣选择不同场景。

本步骤将指导您如何通过控制台创建消息队列 MNS 版。

使用您自己的阿里云账号登录阿里云控制台，然后访问消息队列MNS版控制台。**[****1]**

在控制台左边导航栏中，单击队列列表。（资源地域为同地域即可，本次引导默认选杭州）

![6.png](https://img.alicdn.com/imgextra/i4/O1CN01x9sJvF1mbgbwKh6my_!!6000000004973-0-tps-1080-553.jpg)

在列表页面，单击创建队列并填写名称信息“test-mns-q”

![7.png](https://img.alicdn.com/imgextra/i3/O1CN01YBEDJc1NUwNr9LX9e_!!6000000001574-0-tps-1080-544.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490415473-ac60e0d3-5a33-4ae0-ba2c-a101571f7de0.gif#clientId=u0b9c6118-e92b-4&height=1&id=wVDWF&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u768d5149-e337-4969-b4a9-b93efafbb70&title=&width=1) -->

创建完成后点击“详情”

![8.png](https://img.alicdn.com/imgextra/i3/O1CN01knKqsi29WrbXmeeVP_!!6000000008076-0-tps-1080-439.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490416125-76e2b39e-fc2f-4691-90c7-8bc807fc767b.gif#clientId=u0b9c6118-e92b-4&height=1&id=r8lao&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1675d7df-0a66-4762-bdaf-89f0eb36934&title=&width=1) -->
找到 MNS 公网接入点信息，并记住该信息，后续实验会用到。

E.g.[_http://1825725063814405.mns.cn-hangzhou.aliyuncs.com_](http://1825725063814405.mns.cn-hangzhou.aliyuncs.com)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490416049-2ec3c071-f059-4f86-a33e-2cad554fbf7f.gif#clientId=u0b9c6118-e92b-4&height=1&id=A4mDI&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4f526172-c662-4bf8-9f51-f29f10cfd77&title=&width=1) -->
![9.png](https://img.alicdn.com/imgextra/i2/O1CN01IEWlzr1lgtV3d5OpG_!!6000000004849-0-tps-1080-578.jpg)

**注意：重复如上步骤即可创建 A 实验链路的 “test-mns-q2”**

![10.png](https://img.alicdn.com/imgextra/i1/O1CN01FhEgA129RMqmGy8my_!!6000000008064-0-tps-1080-334.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490416613-ed2f1e3c-2d78-4d70-be59-211cb2e55251.gif#clientId=u0b9c6118-e92b-4&height=1&id=c0tOF&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u78633de0-eeb5-47af-aa99-8162c6c7975&title=&width=1) -->
#### 2）创建 RabbitMQ 资源（B 实验可选）

本步骤将指导您如何通过控制台创建消息队列 RabbitMQ 版。

使用您自己的阿里云账号登录阿里云控制台，然后访问消息队列RabbitMQ版控制台。**[****2]**

在控制台左边导航栏中，单击实例列表。（资源地域为同地域即可，本次引导默认选杭州）
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490416660-bbbf4d3c-22b9-46a5-a1e2-095b983b9eb0.gif#clientId=u0b9c6118-e92b-4&height=1&id=nIqez&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u03805e5c-b9f3-452e-b64e-6c6307dab22&title=&width=1) -->
![11.png](https://img.alicdn.com/imgextra/i4/O1CN015L0iAy1dO6JxY4bY2_!!6000000003725-0-tps-1080-501.jpg)

在列表页面，单击创建实例，并完成创建。
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490417144-56e4fc3b-b8b7-432a-aa98-bada02e16245.gif#clientId=u0b9c6118-e92b-4&height=1&id=AlJ7s&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8c780840-f387-4328-99dc-244d8a232f4&title=&width=1) -->
![12.png](https://img.alicdn.com/imgextra/i4/O1CN01XMev0n1dDZDAGN1Dn_!!6000000003702-0-tps-1080-501.jpg)

创建完成后点击详情进入实例详情页；

![13.png](https://img.alicdn.com/imgextra/i1/O1CN01LUAcLy1eR8Ywgoafl_!!6000000003867-0-tps-1080-372.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490417604-86eda247-9e69-4967-8b5e-952eb4887d85.gif#clientId=u0b9c6118-e92b-4&height=1&id=E1uzw&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8b82e74a-a425-408e-92ac-f1b64bb59cb&title=&width=1) -->
在“Vhost 列表” 创建 “test-amqp-v”；

![14.png](https://img.alicdn.com/imgextra/i4/O1CN01aBxyS31Ux40wPvZLB_!!6000000002583-0-tps-1080-537.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490417969-ffe88587-7d90-4cc6-8fc3-973777e2d137.gif#clientId=u0b9c6118-e92b-4&height=1&id=NrlDr&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue5fb1ae9-a456-46cf-85b3-aa9492b467c&title=&width=1) -->
在“Queue 列表” ，选择 Vhost 为“test-amqp-v”，并创建 “test-amqp-q”；

![15.png](https://img.alicdn.com/imgextra/i3/O1CN01cGNr6G1QGEVoBrRWJ_!!6000000001948-0-tps-1080-531.jpg)![16.png](https://img.alicdn.com/imgextra/i4/O1CN01bC3ed71wBFufxrwSe_!!6000000006269-0-tps-1080-565.jpg)

#### 3）创建 EventBridge 事件流任务  - MNS TO MNS（A 实验可选）

本步骤将指导您如何通过控制台创建 EventBridge 事件流。

使用您自己的阿里云账号登录阿里云控制台，然后访问 EventBridge 控制台。**[****3]**
注：第一次使用需开通。

单击“事件流”列表，并在列表创建任务 （资源地域为同地域即可，本次引导默认选杭州）

![17.png](https://img.alicdn.com/imgextra/i1/O1CN01A67A5Q1Dzx2o63QdA_!!6000000000288-0-tps-1080-493.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490418461-08929069-0122-4d5b-ae29-4f98d88aa8a1.gif#clientId=u0b9c6118-e92b-4&height=1&id=ZONxc&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u30168792-f3a5-4ec7-809c-3e1919ba7db&title=&width=1) -->
创建事件流名称为“test-amqp-mns2mns”，点击下一步；

![18.png](https://img.alicdn.com/imgextra/i1/O1CN01mWCEJK1DC1sAwhjsG_!!6000000000179-0-tps-1080-563.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490418939-bc556b0e-2c8f-4a27-8d4d-28b80ac079aa.gif#clientId=u0b9c6118-e92b-4&height=1&id=LieOo&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u71ee59d2-087e-497e-a20f-fcf9c03183d&title=&width=1) -->
指定事件源，事件提供方为“消息服务 MNS”，队列名称为“test-mns-q”，点击下一步；

![19.png](https://img.alicdn.com/imgextra/i3/O1CN011B3tCe23G1LPZxDZU_!!6000000007227-0-tps-1080-568.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490418986-57dd6011-2ef0-480b-af8d-d7180abc2c7c.gif#clientId=u0b9c6118-e92b-4&height=1&id=OXFMN&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue7699d05-eff4-40e2-b74b-fc4f60e4553&title=&width=1) -->
指定规则，规则部分可不做筛选，默认匹配全部，直接点击下一步；

注意：规则内容可根据需求自行指定，为降低难度本次实验默认投递全部，更多详情请查阅：
[_https://help.aliyun.com/document_detail/181432.html_](https://help.aliyun.com/document_detail/181432.html)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490419008-f95f5540-1da4-4230-b127-3e56231e6afc.gif#clientId=u0b9c6118-e92b-4&height=1&id=yfMzY&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uaa5c2110-3b11-4bfd-9095-d7bc6b74659&title=&width=1) -->
![20.png](https://img.alicdn.com/imgextra/i4/O1CN01ymZRip1veHOddRdlU_!!6000000006197-0-tps-1080-566.jpg)

服务类型选择“消息服务 MNS”，队列名称选择“test-mns-q2”，消息内容选择“部分事件”，点击创建

注意：消息内容可根据需求自行指定，本次实验默认投递 data 字段，更多详情请查阅：
[_https://help.aliyun.com/document_detail/181429.html_](https://help.aliyun.com/document_detail/181429.html)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490419489-a8e64e8b-7d2d-494e-9e91-ed4d973a3c72.gif#clientId=u0b9c6118-e92b-4&height=1&id=DIxiw&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uda63e961-a36d-4eb1-b67d-b2f1c1f960e&title=&width=1) -->
![21.png](https://img.alicdn.com/imgextra/i1/O1CN017fMe6k1SGLqUILHPL_!!6000000002219-0-tps-1080-566.jpg)

创建完成后，可点击“启动”来启动事件流

![22.png](https://img.alicdn.com/imgextra/i2/O1CN01siSaKo1tLNpASHDv7_!!6000000005885-0-tps-1080-505.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490419675-0a609e82-9b87-4516-8e57-8be1cf3615a8.gif#clientId=u0b9c6118-e92b-4&height=1&id=g1UrL&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ucbb7cebf-c510-445f-a30f-d31785de397&title=&width=1) -->
#### 4）创建 EventBridge 事件流任务 - MNS TO RabbitMQ（B 实验可选）

本步骤将指导您如何通过控制台创建 EventBridge 事件流。

使用您自己的阿里云账号登录阿里云控制台，然后访问 EventBridge 控制台。**[****3]**注：第一次使用需开通。

单击“事件流”列表，并在列表创建任务 （资源地域为同地域即可，本次引导默认选杭州）

![23.png](https://img.alicdn.com/imgextra/i1/O1CN01TddZxD1faaLkZ7B8y_!!6000000004023-0-tps-1080-493.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490420061-47a21d93-84bb-4ecb-88b7-f027f45bd934.gif#clientId=u0b9c6118-e92b-4&height=1&id=EkTS4&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4c8580db-2313-46b3-83de-230b28b69cd&title=&width=1) -->
创建事件流名称为“test-amqp-mns2rabbitmq”，点击下一步

![24.png](https://img.alicdn.com/imgextra/i3/O1CN015VJG4s1TLg49rQTVp_!!6000000002366-0-tps-1080-568.jpg)

指定事件源，事件提供方为“消息服务 MNS”，队列名称为“test-mns-q”，点击下一步

![25.png](https://img.alicdn.com/imgextra/i4/O1CN01rVkkXN1xR7FFBs2cg_!!6000000006439-0-tps-1080-563.jpg)

指定规则，规则部分可不做筛选，默认匹配全部，直接点击下一步

注意：规则内容可根据需求自行指定，为降低难度本次实验默认投递全部，更多详情请查阅：
[_https://help.aliyun.com/document_detail/181432.html_](https://help.aliyun.com/document_detail/181432.html)

![26.png](https://img.alicdn.com/imgextra/i2/O1CN01WZs8cm1kvGJBExzg2_!!6000000004745-0-tps-1080-566.jpg)

服务类型选择“消息队列 RabbitMQ 版本”，具体配置如下，点击创建


    实例ID：选择创建好的RabbitMQ ID
    Vhost：选择“test-amqp-v”
    目标类型：选择“Queue”
    Queue：选择“test-amqp-q”
    Body：选择“部分事件”，填写“$.data”
    MessageId：选择“常量”，填写“0”
    Properties：选择“部分事件”，填写“$.source”


注意：消息内容可根据需求自行指定，本次实验默认投递 data 字段，更多详情请查阅：
[_https://help.aliyun.com/document_detail/181429.html_](https://help.aliyun.com/document_detail/181429.html)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490420574-c4af3d03-93cd-441b-83c0-6943cbe1da3c.gif#clientId=u0b9c6118-e92b-4&height=1&id=ARglp&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf30d3384-a669-41a3-bd69-b91acb400f0&title=&width=1)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490420758-b33d09e0-c18f-4d9c-9cae-d9f66bd83d78.gif#clientId=u0b9c6118-e92b-4&height=1&id=b5KSo&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf792992c-b749-47b0-96c3-779f97426f8&title=&width=1) -->
![27.png](https://img.alicdn.com/imgextra/i2/O1CN01Ft89W21mZOdCK5ZgI_!!6000000004968-0-tps-1080-564.jpg)
![28.png](https://img.alicdn.com/imgextra/i3/O1CN01lTKoBA1tylsvrJPdA_!!6000000005971-0-tps-1080-1177.jpg)

创建完成后，可点击“启动”来启动事件流

#### 5）验证路由任务

向 MNS Source  “test-mns-q ” 发送实验消息

点击下载 MNS SDK**[****4]**

修改 sample.cfg

![29.png](https://img.alicdn.com/imgextra/i4/O1CN016ysM4q1fdn7duDrwz_!!6000000004030-0-tps-1080-868.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490421336-3d6cc7fa-721e-4f80-9c10-5a8c729775c4.gif#clientId=u0b9c6118-e92b-4&height=1&id=exCRx&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1c924f7d-566f-4fb4-8660-26ceb226dd8&title=&width=1) -->
在 “sample.cfg ” 填写 AccessKeyId，AccessKeySecret，Endpoint 等信息

AccessKeyId，AccessKeySecret 可在阿里云 RAM 控制台**[****5]**创建

Endpoint 即步骤 1 ， MNS 公网接入点地址
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490421331-2853caa4-f99e-4623-a5b4-7c338707beba.gif#clientId=u0b9c6118-e92b-4&height=1&id=hiIQG&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9873407a-dcd9-46f1-bf2f-5075f41d9b9&title=&width=1) -->

![30.png](https://img.alicdn.com/imgextra/i3/O1CN01y5qI9122gIRzaMPjF_!!6000000007149-0-tps-1080-406.jpg)

    AccessKeyId = LTAI5t96yU2S2E84BYsNNQ33
    AccessKeySecret = xxxxxxx
    Endpoint = http://1825725063814405.mns.cn-hangzhou.aliyuncs.com


填完效果如下，保存
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490422033-762a2b33-add7-4b08-96c0-1bfbb98673b2.gif#clientId=u0b9c6118-e92b-4&height=1&id=rTaRY&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6662bd77-caab-484b-b5da-7dd05ed557c&title=&width=1) -->

![31.png](https://img.alicdn.com/imgextra/i3/O1CN01yzkEMP26TFdIDj2ju_!!6000000007662-0-tps-1080-868.jpg)

找到 sample 目录的“sendmessage.py” 示例

![32.png](https://img.alicdn.com/imgextra/i4/O1CN01KY1j0p1RKdwLgYZi0_!!6000000002093-0-tps-1080-868.jpg)

将循环参数调整为 200，并保存 (可选)

![33.png](https://img.alicdn.com/imgextra/i3/O1CN01eQjPqX1dKR9Xn44kh_!!6000000003717-0-tps-1080-868.jpg)

保存并运行 “python sendmessage.py test-mns-q”


    python sendmessage.py test-mns-q



![34.png](https://img.alicdn.com/imgextra/i1/O1CN0153pDnb29zG9xJR2IF_!!6000000008138-0-tps-1080-868.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490422858-7d5b4b03-e261-4714-aeb0-e57be4ada905.gif#clientId=u0b9c6118-e92b-4&height=1&id=CweaR&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc6ed4d48-08bf-4cc8-b246-84672162988&title=&width=1) -->
在事件流控制台**[****6]**，分别点开 “test-mns-q2”， “test-amqp-q” 查看详情转储详情。

注意：MNS Q 仅支持单订阅，不支持广播模式。故该测试需要将 MNS/RabbitMQ 两个实验，任选其一关停后进行实验。

如需广播模式，请创建 MNS Topic 资源。
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490423408-2be47692-6bcf-4226-9402-334b5e45d5eb.gif#clientId=u0b9c6118-e92b-4&height=1&id=cYeCc&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud52395d9-036a-467d-9f32-e51052088cf&title=&width=1) -->

![35.png](https://img.alicdn.com/imgextra/i1/O1CN017sWJz91oWJBxqWXcW_!!6000000005232-0-tps-1080-177.jpg)

A 链路实验结果：

![36.png](https://img.alicdn.com/imgextra/i4/O1CN01MOGOHz25y6hQA1ZDl_!!6000000007594-0-tps-1080-526.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490424814-971da9c2-9ee0-47fb-98c3-60ad1e4afc02.gif#clientId=u0b9c6118-e92b-4&height=1&id=KXxdk&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2c1526af-7aa3-4b89-88e4-eeb98ca3aac&title=&width=1) -->
B 链路实验结果：
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490424841-49932333-4c6c-4fca-8636-f57c67d1f43a.gif#clientId=u0b9c6118-e92b-4&height=1&id=Z14Q4&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue83b4a05-2fb8-4f71-8e96-664c383e5a8&title=&width=1) -->
![37.png](https://img.alicdn.com/imgextra/i2/O1CN01mPywHq1NnGE4vg29s_!!6000000001614-0-tps-1080-527.jpg)

## 优势及总结

EventBridge 事件流提供端到端的消息路由能力，通过简单配置即可完成消息分发，消息同步，跨地域消息备份，跨产品消息同步等能力。具有运维简单，成本低，效率高，使用稳定等优势。同时使用 EventBridge 可以实现基础的数据过滤，数据脱敏等数据处理类能力。是消息路由场景下运维成本最低的解决方案。

## 相关链接

[1] 消息队列MNS版控制台
[_https://mns.console.aliyun.com/accounttraceid=a42e9ca8e911475087856852d4526c4dsjeq_](https://mns.console.aliyun.com/accounttraceid=a42e9ca8e911475087856852d4526c4dsjeq)

[2] 消息队列RabbitMQ版控制台
[_https://amqp.console.aliyun.com/_](https://amqp.console.aliyun.com/)

[3] EventBridge 控制台
[_https://eventbridge.console.aliyun.com/overview_](https://eventbridge.console.aliyun.com/overview)

[4] 点击下载 MNS SDK
[_https://aliware-images.oss-cn-hangzhou.aliyuncs.com/mns/sdk/python/aliyun-mns-python-sdk-1.1.6.zip?spm=a2c4g.11186623.0.0.516e7538twGvPp&file=aliyun-mns-python-sdk-1.1.6.zip_](https://aliware-images.oss-cn-hangzhou.aliyuncs.com/mns/sdk/python/aliyun-mns-python-sdk-1.1.6.zip?spm=a2c4g.11186623.0.0.516e7538twGvPp&file=aliyun-mns-python-sdk-1.1.6.zip)

[5] 阿里云RAM 控制台
[_https://ram.console.aliyun.com/manage/ak_](https://ram.console.aliyun.com/manage/ak)

[6] 事件流控制台
[_https://eventbridge.console.aliyun.com/cn-hangzhou/event-streamings_](https://eventbridge.console.aliyun.com/cn-hangzhou/event-streamings)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://img.alicdn.com/imgextra/i4/O1CN01Xi1rcu1DM6aIC7ypz_!!6000000000201-0-tps-1920-675.jpg)
