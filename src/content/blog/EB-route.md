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

通过一层转发将消息分发给不同的 Topic 消费，是消息路由的核心能力。随着企业转型遇到消息拆分且做业务脱敏的场景会越来越多。如下图是一个较为典型的路由分流场景。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490412611-d6831694-c190-4630-a3b3-ba6426640be4.gif#clientId=u0b9c6118-e92b-4&height=1&id=ciJOq&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub8e97f17-cdf1-4ceb-a939-2958aa5e46f&title=&width=1)

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490412710-765a8eff-6867-4474-a014-916eae7596d1.png#clientId=u0b9c6118-e92b-4&height=279&id=j8JHA&name=1.png&originHeight=279&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7367a08d-a4b6-4266-ba78-811b1f02027&title=&width=1080)

### 消息多活场景

消息多活场景指每个数据中心均部署了完整、独立的 MQ 集群。数据中心内的应用服务只连接本地的 MQ 集群，不连接其他单元的 MQ 集群。MQ 集群中包含的消息路由模块，负责在不同单元 MQ 集群之间同步指定主题的消息。

根据应用服务是否具有单元化能力，可分为中心服务和单元服务两类。中心服务只在一个数据中心提供服务；单元服务在各个数据中心都提供服务，但只负责符合规则的部分用户，而非全量用户。

所有部署了单元服务的数据中心都是一个单元，所有单元的单元服务同时对外提供服务，从而形成一个异地多活架构或者叫单元化架构。通过多活管控平台可动态调整各个单元服务负责的流量。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490414618-ef91d5bd-bfc9-45a3-93c9-7c58cd0c33f8.gif#clientId=u0b9c6118-e92b-4&height=1&id=oCD4A&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2024d49b-2ca2-45bf-ab0a-d105925740f&title=&width=1)

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490412619-6e2a8bd3-24cb-41eb-a375-55443762a5c3.png#clientId=u0b9c6118-e92b-4&height=441&id=QX8W5&name=2.png&originHeight=441&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc892c84e-c8fb-4b52-b2d0-642dd89032b&title=&width=1080)

### 多协议适配场景

随着业务团队的逐渐庞大，对消息的建设诉求与日俱增，由于部门技术栈的不同会导致部门间的消息协议也不尽相同。多协议适配是指用一种消息协议平滑迁移到多种消息协议的能力。

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490412618-88055af6-f070-4b87-8479-e8b8c89c4df6.png#clientId=u0b9c6118-e92b-4&height=407&id=pz0Ff&name=3.png&originHeight=407&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ufcc69301-bf3e-407c-b183-0a008d6778d&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490414816-0eabe9f5-068e-415a-86d3-6da3cc8dc59d.gif#clientId=u0b9c6118-e92b-4&height=1&id=scbgt&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc1f94086-4f28-463f-b831-c32c40b0a27&title=&width=1)
## 架构描述

使用 EventBridge 的事件流能力做消息路由，事件流模型是 EventBridge 在消息领域主打的处理模型，适用标准 Streaming（1:1）流式处理场景，无总线概念。用于端到端的消息路由，消息转储，消息同步及处理等，帮助开发者轻松构建云上数据管道服务。

下面的架构展示了如何通过桥接 EventBridge 实现 MNS 消息路由至 RabbitMQ Queues，MNS Queues。（A/B 链路任选其一进行试验）![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490414925-a17ca711-db78-4ce7-9f1a-17f63d9f5ab2.gif#clientId=u0b9c6118-e92b-4&height=1&id=ER1X7&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub77b57a1-bea9-446a-a8e8-05694a8e65c&title=&width=1)

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490415116-b14d4a6f-1092-4e95-aec5-f5f7d77a9e59.png#clientId=u0b9c6118-e92b-4&height=411&id=vC8w5&name=4.png&originHeight=411&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u78fb79b3-a755-4aea-b686-c7fc1eb656a&title=&width=1080)
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

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490415317-898089a3-8122-4f9a-b267-3ca1b23e6551.png#clientId=u0b9c6118-e92b-4&height=411&id=ypzTL&name=5.png&originHeight=411&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7e7618d9-92a7-4f03-a2d4-095fd00cf9c&title=&width=1080)

本实验分 A /B 两个可选场景：

A 、场景通过 MNS Queues1 投递至 MNS Queues2
B 、场景通过 MNS Queues1 投递至 RabbitMQ Queues

可根据兴趣选择不同场景。

本步骤将指导您如何通过控制台创建消息队列 MNS 版。

使用您自己的阿里云账号登录阿里云控制台，然后访问消息队列MNS版控制台。**[****1]**

在控制台左边导航栏中，单击队列列表。（资源地域为同地域即可，本次引导默认选杭州）

![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490415564-e4280727-e986-44d1-a56d-c50135f0c0d6.png#clientId=u0b9c6118-e92b-4&height=553&id=GtVkQ&name=6.png&originHeight=553&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uab467e82-2e35-4b20-8cd4-ffcbe58c01f&title=&width=1080)

在列表页面，单击创建队列并填写名称信息“test-mns-q”

![7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490417409-cc56bfb8-96cf-4bba-a606-463a1911206b.png#clientId=u0b9c6118-e92b-4&height=544&id=PtT25&name=7.png&originHeight=544&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u99ad5a45-22e4-4235-90a0-4bc16768da5&title=&width=1080)![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490415473-ac60e0d3-5a33-4ae0-ba2c-a101571f7de0.gif#clientId=u0b9c6118-e92b-4&height=1&id=wVDWF&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u768d5149-e337-4969-b4a9-b93efafbb70&title=&width=1)

创建完成后点击“详情”

![8.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490415807-ed16487a-e950-4d24-a8f9-fbb9d4943c50.png#clientId=u0b9c6118-e92b-4&height=439&id=raZXs&name=8.png&originHeight=439&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue9ed1224-bea4-4830-84c3-d62eada03cc&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490416125-76e2b39e-fc2f-4691-90c7-8bc807fc767b.gif#clientId=u0b9c6118-e92b-4&height=1&id=r8lao&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1675d7df-0a66-4762-bdaf-89f0eb36934&title=&width=1)
找到 MNS 公网接入点信息，并记住该信息，后续实验会用到。

E.g.[_http://1825725063814405.mns.cn-hangzhou.aliyuncs.com_](http://1825725063814405.mns.cn-hangzhou.aliyuncs.com)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490416049-2ec3c071-f059-4f86-a33e-2cad554fbf7f.gif#clientId=u0b9c6118-e92b-4&height=1&id=A4mDI&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4f526172-c662-4bf8-9f51-f29f10cfd77&title=&width=1)
![9.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490416281-7ec0217e-13a3-4805-b3e1-eb6a99ca6aad.png#clientId=u0b9c6118-e92b-4&height=578&id=w2zXu&name=9.png&originHeight=578&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uce2c1186-2ea6-484c-9f00-af0a3df8998&title=&width=1080)

**注意：重复如上步骤即可创建 A 实验链路的 “test-mns-q2”**

![10.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490416502-1330536d-e55d-4a1d-a961-4c718e46fa5d.png#clientId=u0b9c6118-e92b-4&height=334&id=CYNAA&name=10.png&originHeight=334&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uef8d73d5-fb0f-4c16-9d8c-d9748df3bba&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490416613-ed2f1e3c-2d78-4d70-be59-211cb2e55251.gif#clientId=u0b9c6118-e92b-4&height=1&id=c0tOF&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u78633de0-eeb5-47af-aa99-8162c6c7975&title=&width=1)
#### 2）创建 RabbitMQ 资源（B 实验可选）

本步骤将指导您如何通过控制台创建消息队列 RabbitMQ 版。

使用您自己的阿里云账号登录阿里云控制台，然后访问消息队列RabbitMQ版控制台。**[****2]**

在控制台左边导航栏中，单击实例列表。（资源地域为同地域即可，本次引导默认选杭州）
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490416660-bbbf4d3c-22b9-46a5-a1e2-095b983b9eb0.gif#clientId=u0b9c6118-e92b-4&height=1&id=nIqez&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u03805e5c-b9f3-452e-b64e-6c6307dab22&title=&width=1)
![11.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490416970-f444a8ce-f5bd-4ee5-a027-508de5fb1356.png#clientId=u0b9c6118-e92b-4&height=501&id=KOhBK&name=11.png&originHeight=501&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u398d0ae7-9492-4ec7-91c0-69c1216a936&title=&width=1080)

在列表页面，单击创建实例，并完成创建。
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490417144-56e4fc3b-b8b7-432a-aa98-bada02e16245.gif#clientId=u0b9c6118-e92b-4&height=1&id=AlJ7s&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8c780840-f387-4328-99dc-244d8a232f4&title=&width=1)
![12.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490417294-217bbced-0711-4b38-b936-2a5b1dcae4ee.png#clientId=u0b9c6118-e92b-4&height=501&id=huNg7&name=12.png&originHeight=501&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ubc5b509b-363e-4115-a048-cccd1e29162&title=&width=1080)

创建完成后点击详情进入实例详情页；

![13.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490417314-b05c4f87-7f9b-4ff4-84e8-0efd82934825.png#clientId=u0b9c6118-e92b-4&height=372&id=Z6vwn&name=13.png&originHeight=372&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u66d5866d-0fae-45b0-b1d4-a4f93053ec1&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490417604-86eda247-9e69-4967-8b5e-952eb4887d85.gif#clientId=u0b9c6118-e92b-4&height=1&id=E1uzw&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8b82e74a-a425-408e-92ac-f1b64bb59cb&title=&width=1)
在“Vhost 列表” 创建 “test-amqp-v”；

![14.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490417724-6594b864-f3b9-4855-a994-e7544c3150dd.png#clientId=u0b9c6118-e92b-4&height=537&id=yYde0&name=14.png&originHeight=537&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u38b7afad-4484-47f4-a40c-32aedb5be15&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490417969-ffe88587-7d90-4cc6-8fc3-973777e2d137.gif#clientId=u0b9c6118-e92b-4&height=1&id=NrlDr&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue5fb1ae9-a456-46cf-85b3-aa9492b467c&title=&width=1)
在“Queue 列表” ，选择 Vhost 为“test-amqp-v”，并创建 “test-amqp-q”；

![15.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490418252-1bd87c15-9407-467f-9040-9d70201ec228.png#clientId=u0b9c6118-e92b-4&height=531&id=IXf6e&name=15.png&originHeight=531&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u95ca0105-7108-48c5-8b91-77c9bfc8494&title=&width=1080)![16.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490418240-67493c85-96c6-420d-acd2-773e29e9fda0.png#clientId=u0b9c6118-e92b-4&height=565&id=WTX4g&name=16.png&originHeight=565&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u472a995f-5ca7-4d3b-93a2-14a8a90a609&title=&width=1080)

#### 3）创建 EventBridge 事件流任务  - MNS TO MNS（A 实验可选）

本步骤将指导您如何通过控制台创建 EventBridge 事件流。

使用您自己的阿里云账号登录阿里云控制台，然后访问 EventBridge 控制台。**[****3]**
注：第一次使用需开通。

单击“事件流”列表，并在列表创建任务 （资源地域为同地域即可，本次引导默认选杭州）

![17.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490418231-7b890371-ee5d-499d-a741-5822ff20fb24.png#clientId=u0b9c6118-e92b-4&height=493&id=o1Xdx&name=17.png&originHeight=493&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ucbc96696-ca5a-49af-84ee-8ca84657cff&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490418461-08929069-0122-4d5b-ae29-4f98d88aa8a1.gif#clientId=u0b9c6118-e92b-4&height=1&id=ZONxc&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u30168792-f3a5-4ec7-809c-3e1919ba7db&title=&width=1)
创建事件流名称为“test-amqp-mns2mns”，点击下一步；

![18.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490418515-e76c0622-3e7c-4a03-88bd-8d14c09adccc.png#clientId=u0b9c6118-e92b-4&height=563&id=Q4DFg&name=18.png&originHeight=563&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u673ed8c7-6e32-4376-bed5-f182eb4a148&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490418939-bc556b0e-2c8f-4a27-8d4d-28b80ac079aa.gif#clientId=u0b9c6118-e92b-4&height=1&id=LieOo&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u71ee59d2-087e-497e-a20f-fcf9c03183d&title=&width=1)
指定事件源，事件提供方为“消息服务 MNS”，队列名称为“test-mns-q”，点击下一步；

![19.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490419010-7233bf38-9caf-4bb1-9342-0d2c4875bb5e.png#clientId=u0b9c6118-e92b-4&height=568&id=epzm4&name=19.png&originHeight=568&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uddb18829-a9ee-49d3-89e4-3ebc0cbc35f&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490418986-57dd6011-2ef0-480b-af8d-d7180abc2c7c.gif#clientId=u0b9c6118-e92b-4&height=1&id=OXFMN&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue7699d05-eff4-40e2-b74b-fc4f60e4553&title=&width=1)
指定规则，规则部分可不做筛选，默认匹配全部，直接点击下一步；

注意：规则内容可根据需求自行指定，为降低难度本次实验默认投递全部，更多详情请查阅：
[_https://help.aliyun.com/document_detail/181432.html_](https://help.aliyun.com/document_detail/181432.html)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490419008-f95f5540-1da4-4230-b127-3e56231e6afc.gif#clientId=u0b9c6118-e92b-4&height=1&id=yfMzY&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uaa5c2110-3b11-4bfd-9095-d7bc6b74659&title=&width=1)
![20.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490419210-207b689c-b8e5-4733-bcd9-b3462d541c9f.png#clientId=u0b9c6118-e92b-4&height=566&id=t85QD&name=20.png&originHeight=566&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u170baddc-9da8-4fd6-8211-d0f7271ccd9&title=&width=1080)

服务类型选择“消息服务 MNS”，队列名称选择“test-mns-q2”，消息内容选择“部分事件”，点击创建

注意：消息内容可根据需求自行指定，本次实验默认投递 data 字段，更多详情请查阅：
[_https://help.aliyun.com/document_detail/181429.html_](https://help.aliyun.com/document_detail/181429.html)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490419489-a8e64e8b-7d2d-494e-9e91-ed4d973a3c72.gif#clientId=u0b9c6118-e92b-4&height=1&id=DIxiw&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uda63e961-a36d-4eb1-b67d-b2f1c1f960e&title=&width=1)
![21.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490419700-529580b1-771b-4871-a301-8ff618ab1787.png#clientId=u0b9c6118-e92b-4&height=566&id=nf04G&name=21.png&originHeight=566&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u251a00ba-5608-48eb-a3de-0c299d72ca7&title=&width=1080)

创建完成后，可点击“启动”来启动事件流

![22.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490419615-45c66106-0e4d-48c3-979e-05c96b01bac5.png#clientId=u0b9c6118-e92b-4&height=505&id=LQwuC&name=22.png&originHeight=505&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u08c03469-d3a1-4e95-ae32-cca625ee87b&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490419675-0a609e82-9b87-4516-8e57-8be1cf3615a8.gif#clientId=u0b9c6118-e92b-4&height=1&id=g1UrL&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ucbb7cebf-c510-445f-a30f-d31785de397&title=&width=1)
#### 4）创建 EventBridge 事件流任务 - MNS TO RabbitMQ（B 实验可选）

本步骤将指导您如何通过控制台创建 EventBridge 事件流。

使用您自己的阿里云账号登录阿里云控制台，然后访问 EventBridge 控制台。**[****3]**注：第一次使用需开通。

单击“事件流”列表，并在列表创建任务 （资源地域为同地域即可，本次引导默认选杭州）

![23.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490420107-dfca948d-8aa1-4ee9-aec1-f548c2a51c41.png#clientId=u0b9c6118-e92b-4&height=493&id=oR9ZR&name=23.png&originHeight=493&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud35399ed-32f4-4fc5-8968-2010f60651a&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490420061-47a21d93-84bb-4ecb-88b7-f027f45bd934.gif#clientId=u0b9c6118-e92b-4&height=1&id=EkTS4&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4c8580db-2313-46b3-83de-230b28b69cd&title=&width=1)
创建事件流名称为“test-amqp-mns2rabbitmq”，点击下一步

![24.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490420239-080b9156-1dae-4cb7-858f-3bb0a5c2416b.png#clientId=u0b9c6118-e92b-4&height=563&id=AhOAq&name=24.png&originHeight=563&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4f9d4a93-4483-41b5-b322-09cb34bad74&title=&width=1080)

指定事件源，事件提供方为“消息服务 MNS”，队列名称为“test-mns-q”，点击下一步

![25.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490420390-d44e7f70-2b37-4df0-8f53-af80f60d29b1.png#clientId=u0b9c6118-e92b-4&height=568&id=PtnHT&name=25.png&originHeight=568&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u88ce4f8e-436d-48a8-9388-7ec5cc59af2&title=&width=1080)

指定规则，规则部分可不做筛选，默认匹配全部，直接点击下一步

注意：规则内容可根据需求自行指定，为降低难度本次实验默认投递全部，更多详情请查阅：
[_https://help.aliyun.com/document_detail/181432.html_](https://help.aliyun.com/document_detail/181432.html)

![26.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490420491-e230eb2e-b2a9-455b-ba6c-2afee046cd3f.png#clientId=u0b9c6118-e92b-4&height=566&id=xfSyi&name=26.png&originHeight=566&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2357ca25-04de-4ced-9e65-2ce120f92c6&title=&width=1080)

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
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490420574-c4af3d03-93cd-441b-83c0-6943cbe1da3c.gif#clientId=u0b9c6118-e92b-4&height=1&id=ARglp&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf30d3384-a669-41a3-bd69-b91acb400f0&title=&width=1)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490420758-b33d09e0-c18f-4d9c-9cae-d9f66bd83d78.gif#clientId=u0b9c6118-e92b-4&height=1&id=b5KSo&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf792992c-b749-47b0-96c3-779f97426f8&title=&width=1)![27.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490421391-67abfb2a-1ff3-41cf-acc2-8fa8c3f70da4.png#clientId=u0b9c6118-e92b-4&height=564&id=bCnRA&name=27.png&originHeight=564&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8868effd-060c-4206-a544-5b965ff8ff8&title=&width=1080)![28.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490421359-abea540f-0196-4d43-874d-7dabd0cc4ad5.png#clientId=u0b9c6118-e92b-4&height=1177&id=BxDPO&name=28.png&originHeight=1177&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u339d0df1-5193-4381-bf7b-4485bf02ed6&title=&width=1080)

创建完成后，可点击“启动”来启动事件流

#### 5）验证路由任务

向 MNS Source  “test-mns-q ” 发送实验消息

点击下载 MNS SDK**[****4]**

修改 sample.cfg

![29.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490421392-62fa3d99-4f0b-4069-a45f-872de170858a.png#clientId=u0b9c6118-e92b-4&height=868&id=TgCNN&name=29.png&originHeight=868&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u30b3994c-3747-4292-bc3d-09563552208&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490421336-3d6cc7fa-721e-4f80-9c10-5a8c729775c4.gif#clientId=u0b9c6118-e92b-4&height=1&id=exCRx&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1c924f7d-566f-4fb4-8660-26ceb226dd8&title=&width=1)
在 “sample.cfg ” 填写 AccessKeyId，AccessKeySecret，Endpoint 等信息

AccessKeyId，AccessKeySecret 可在阿里云 RAM 控制台**[****5]**创建

Endpoint 即步骤 1 ， MNS 公网接入点地址![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490421331-2853caa4-f99e-4623-a5b4-7c338707beba.gif#clientId=u0b9c6118-e92b-4&height=1&id=hiIQG&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9873407a-dcd9-46f1-bf2f-5075f41d9b9&title=&width=1)

![30.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490421863-1f225449-7bcc-4e88-8f30-81b8d3c25017.png#clientId=u0b9c6118-e92b-4&height=406&id=zSiXp&name=30.png&originHeight=406&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ufdf04853-d648-4a5e-a2b3-3fb675eb386&title=&width=1080)

    AccessKeyId = LTAI5t96yU2S2E84BYsNNQ33
    AccessKeySecret = xxxxxxx
    Endpoint = http://1825725063814405.mns.cn-hangzhou.aliyuncs.com


填完效果如下，保存![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490422033-762a2b33-add7-4b08-96c0-1bfbb98673b2.gif#clientId=u0b9c6118-e92b-4&height=1&id=rTaRY&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6662bd77-caab-484b-b5da-7dd05ed557c&title=&width=1)

![31.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490422445-a3164873-741c-4156-839f-91733c361205.png#clientId=u0b9c6118-e92b-4&height=868&id=L6OQR&name=31.png&originHeight=868&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u676bc7e5-81db-4faa-bb16-1db84c4e6c2&title=&width=1080)

找到 sample 目录的“sendmessage.py” 示例

![32.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490422780-28a1179e-7af3-41e4-9c1c-1087e348d496.png#clientId=u0b9c6118-e92b-4&height=868&id=itnIf&name=32.png&originHeight=868&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ucb089d51-3bdf-42f7-b7bf-4839005a026&title=&width=1080)

将循环参数调整为 200，并保存 (可选)

![33.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490422815-b1eee456-9f6e-4974-8a71-75f06a358d71.png#clientId=u0b9c6118-e92b-4&height=868&id=WfpLZ&name=33.png&originHeight=868&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub5031eef-2f90-40aa-9031-f2957557867&title=&width=1080)

保存并运行 “python sendmessage.py test-mns-q”


    python sendmessage.py test-mns-q



![34.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490422902-5b296dfc-4844-41c5-9cec-7b610ab444d5.png#clientId=u0b9c6118-e92b-4&height=868&id=oEVBP&name=34.png&originHeight=868&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2979804c-8578-467c-9cdc-f7b11332cd7&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490422858-7d5b4b03-e261-4714-aeb0-e57be4ada905.gif#clientId=u0b9c6118-e92b-4&height=1&id=CweaR&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc6ed4d48-08bf-4cc8-b246-84672162988&title=&width=1)
在事件流控制台**[****6]**，分别点开 “test-mns-q2”， “test-amqp-q” 查看详情转储详情。

注意：MNS Q 仅支持单订阅，不支持广播模式。故该测试需要将 MNS/RabbitMQ 两个实验，任选其一关停后进行实验。

如需广播模式，请创建 MNS Topic 资源。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490423408-2be47692-6bcf-4226-9402-334b5e45d5eb.gif#clientId=u0b9c6118-e92b-4&height=1&id=cYeCc&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud52395d9-036a-467d-9f32-e51052088cf&title=&width=1)

![35.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490423583-54e92f92-f127-4da9-93fa-a68d98458f19.png#clientId=u0b9c6118-e92b-4&height=177&id=uz8UR&name=35.png&originHeight=177&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8784ef8b-5be4-4390-9864-8ca8e3f6d24&title=&width=1080)

A 链路实验结果：

![36.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490424854-dbcbe569-613a-4db6-8442-4b2aaec3ad4f.png#clientId=u0b9c6118-e92b-4&height=526&id=gqEBY&name=36.png&originHeight=526&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7aba811d-78fd-49ec-8109-d966916a6be&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490424814-971da9c2-9ee0-47fb-98c3-60ad1e4afc02.gif#clientId=u0b9c6118-e92b-4&height=1&id=KXxdk&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2c1526af-7aa3-4b89-88e4-eeb98ca3aac&title=&width=1)
B 链路实验结果：
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490424841-49932333-4c6c-4fca-8636-f57c67d1f43a.gif#clientId=u0b9c6118-e92b-4&height=1&id=Z14Q4&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue83b4a05-2fb8-4f71-8e96-664c383e5a8&title=&width=1)
![37.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490424994-8b334195-d403-4679-865a-f6226b0bea68.png#clientId=u0b9c6118-e92b-4&height=527&id=M4p78&name=37.png&originHeight=527&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u87fbabe8-722d-49c0-9dec-4d93f7bf8da&title=&width=1080)

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

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
