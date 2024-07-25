---
title: "RocketMQ 集成生态再升级：轻松构建云上数据管道"
date: "2023/01/13"
author: "昶风"
img: "https://img.alicdn.com/imgextra/i1/O1CN014hIhFw1quhNLOjVOe_!!6000000005556-0-tps-685-383.jpg"
tags: ["explore"]
description: "本文将从业务架构和 API 使用等方面讲解如何使用 EventBridge 创建阿里云 RocketMQ 4.0、5.0 版本，开源自建版本以及消息路由的相关任务。"
---
阿里云消息队列 RocketMQ 版是阿里云基于 Apache RocketMQ 构建的低延迟、高并发、高可用、高可靠的分布式“消息、事件、流”统一处理平台，面向互联网分布式应用场景提供微服务异步解耦、流式数据处理、事件驱动处理等核心能力。其自诞生以来一直为阿里集团提供稳定可靠的消息服务，历经多年双十一万亿级流量洪峰的验证。

随着业务需求场景日渐丰富，在多年经验积累后，阿里云 RocketMQ 也迎来了革命性的更新，正式发布了阿里云消息队列 RocketMQ 版 5.0，在架构、网络、负载均衡、存储等诸多方面进行了显著优化。其定位不再局限于消息解耦场景，将全新布局事件驱动和消息流式处理场景。

阿里云 EventBridge 作为云上事件枢纽一直以来都保持着对云上事件、数据的友好生态支持。随着 RocketMQ 5.0版本的用户日渐增多，EventBridge 在近期对 RocketMQ Connector 进行了全面升级。升级之后的 RocketMQ Connector 不仅可以支持RocketMQ 5.0 版本，同时也能支持云上自建 RocketMQ 实例。除此之外，基于成熟的事件流能力，用户使用 EventBridge 也能轻松构建消息路由能力，实现对灾备、数据同步的需求。

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502145743-94777b80-5a55-4061-9a6a-ad175b88ab44.png#clientId=u530d7dc4-3557-4&height=544&id=snCIp&name=1.png&originHeight=544&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u49161fb3-1708-4bcb-a038-5b0a7b6dc9f&title=&width=1080)

本文将从业务架构和 API 使用等方面讲解**如何使用 EventBridge 创建阿里云 RocketMQ 4.0、5.0 版本**，开源自建版本以及消息路由的相关任务。

## EventBridge-RocketMQ 4.0

### 业务架构


RocketMQ 4.0 版本使用较为经典的 client-nameserver-broker 架构，整个应用主要由生产者、消费者、NameServer 和 Broker 组成。

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502145744-a8f5c31b-b5fb-484a-ae3c-537f70a14ce5.png#clientId=u530d7dc4-3557-4&height=545&id=pOcUl&name=2.png&originHeight=545&originWidth=929&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5fa09b1d-18d4-40b4-9bb7-6cd9783f20a&title=&width=929)

- Name Server：是一个几乎无状态节点，可集群部署，在消息队列 RocketMQ 版中提供命名服务，更新和发现 Broker 服务。
- Broker：消息中转角色，负责存储消息，转发消息。分为 Master Broker 和 Slave Broker，一个 Master Broker 可以对应多个 Slave Broker，但是一个 Slave Broker 只能对应一个 Master Broker。Broker 启动后需要完成一次将自己注册至 Name Server 的操作；随后每隔 30s 定期向 Name Server 上报 Topic 路由信息。
- 生产者：与 Name Server 集群中的其中一个节点（随机）建立长连接（Keep-alive），定期从 Name Server 读取 Topic 路由信息，并向提供 Topic 服务的 Master Broker 建立长连接，且定时向 Master Broker 发送心跳。
- 消费者：与 Name Server 集群中的其中一个节点（随机）建立长连接，定期从  Name Server 拉取 Topic 路由信息，并向提供 Topic 服务的 Master Broker、Slave Broker 建立长连接，且定时向 Master Broker、Slave Broker 发送心跳。Consumer 既可以从 Master Broker 订阅消息，也可以从 Slave Broker 订阅消息，订阅规则由 Broker 配置决定。

EventBridge在获取用户授权之后，利用生成的 sts 临时授权对客户的  RocketMQ 实例进行消息读取或写入。

### API 使用

在 API 介绍方面，我们以创建**「自定义总线--自定义事件源」**为例，事件目标以及事件流中的API基本一致。

基于 EventBridge 创建 RocketMQ 4.0 任务的 API 和之前基本保持了一致。具体参数如下

- 版本：代表阿里云消息队列 RocketMQ 版本，可选择 4.x 或 5.x；
- RocketMQ 实例：RocketMQ 对应的实例 ID。用户在阿里云 RocketMQ控制台每创建一个实例都会有一个对应的实例 ID，如MQ_INST_123456789***_BX6zY7ah；
- Topic：RocketMQ Topic。选择此 topic 作为事件源的读取对象或者事件目标的写入对象；
- Tag：RocketMQ 消费 Tag，用于消费者过滤消息使用；
- Group ID：RocketMQ 消费组，标识一组特定的消费者，仅事件源有此参数；
- 消费位点：初始消费位点。可选择最新位点、最早位点、或者指定时间戳。



![3.jpeg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680502147463-0e87e007-03b1-45c2-bb28-06ec8a92853c.jpeg#clientId=u530d7dc4-3557-4&height=1282&id=VaOkK&name=3.jpeg&originHeight=1282&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uda2f470b-e361-402a-b523-d165278b29c&title=&width=1080)

## EventBridge-RocketMQ 5.0

### 业务架构


RocketMQ 5.0 版将通用的存储逻辑下沉，集中解决消息存储的多副本、低延迟、海量队列分区等技术问题，将上层的消息处理剥离出完全的无状态计算层，主要完成协议适配、权限管理、消费状态、可观测运维体系支持，Broker 则继续专注于存储能力的持续优化。存算分离的架构设计，使得从 SDK 接入到线上运维全链路带来全面提升：

1. 轻量版 SDK 的开放和全链路可观测系统的提升：同时支持 4.x 通信协议和全新的 gRPC 通信协议，并内置 OpenTelemetry 埋点支持，新版本 SDK 新增了 10 余个指标埋点。
2. 消息级负载均衡：新版本 SDK 不再参与实际存储队列的负载均衡，消息负载均衡将更加轻量，以单条消息为调度最小单元。
3. 多网络访问支持：新版本支持单一实例同时暴露公网、内网等访问形式，方便客户多网络接入访问。
4. 海量分级存储：新版本开放分级存储历史消息保存能力，消息低成本无大小限制，最长保存 30 天。冷热数据进行分离设计，极大降低消费历史消息对实例的性能影响。

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502145658-2dfe9cb1-0256-45ac-a84e-876fc4963580.png#clientId=u530d7dc4-3557-4&height=828&id=hfO9D&name=4.png&originHeight=828&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4bc65a69-483b-43ab-9152-f6462633b9b&title=&width=1080)

RocketMQ 5.0 版本 可以支持 VPC 内部安全识别，用户上云无需修改代码。在用户授予 EventBridge 网络和 RocketMQ 相关权限之后，用户在 EventBridge 创建 MQ 5.0 Source&Sink 任务的时，EventBridge 会根据 RocketMQ 5.0 实例的 VPC 信息，调用网络组件获取相应代理信息。MQ sdk 侧通过配置代理实现消息的收发。

### API 使用


相比于 4.0 实例，5.0 实例多了 VPC、交换机和安全组 3 个参数。

5.0 实例新增了 VPC 属性，用户需要在对应 vpc 内去访问 MQ 5.0 实例。EventBridge 在获得用户授权之后，也是经由 5.0 实例对应的 VPC 内进行消息的收发。创建任务时前端会自动填充好实例的 vpc 和交换机信息。

安全组参数限制了 EventBridge 在 vpc 内的访问策略，用户可以选择使用已有安全组也可以选择快速创建，让 EventBridge 快速创建一个安全组供任务使用。安全组策略推荐使用默认的安全组策略。使用上推荐第一次在此vpc内创建任务时，使用 EventBridge 自动创建一个安全组，后续在此 VPC 内再创建其他任务时，在使用已有中选择 EventBridge 创建的安全组。

![5.jpeg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680502145624-068bad2a-271d-4f11-a45b-7f30c68c9f26.jpeg#clientId=u530d7dc4-3557-4&height=766&id=Bd5Xe&name=5.jpeg&originHeight=766&originWidth=459&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uda0daf4f-0bd8-46f9-81a6-0ee24033f90&title=&width=459)

## EventBridge-自建 Apache RocketMQ


针对用户在阿里云自建 Apache RocketMQ 集群的场景，EventBridge 也支持了消息导出能力。用户通过配置接入点、topic、groupID、VPC 等信息，即可将自建集群中的消息导入 EventBridge，进而对接 EventBridge 目前支持的大量下游生态。

### 业务架构


抽象来看，EventBridge 访问自建 MQ 实例的链路和阿里云 5.0 版本基本一致，都是从用户 vpc 发起对 MQ 实例的访问。区别在于接入点的不同，前者是用户自建 MQ 集群的nameserver，而后者为阿里云 RocketMQ 提供的接入点，不需要感知真实的 MQ 集群是部署在用户 vpc 还是阿里云 RocketMQ 自身的生产环境。

![6.jpeg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680502147672-c9e9c52d-da40-4524-8a33-09ad53d8f733.jpeg#clientId=u530d7dc4-3557-4&height=418&id=cTpsa&name=6.jpeg&originHeight=418&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ucb90824c-93a9-457f-873b-a216444bc47&title=&width=1080)

### API 使用


在 API 使用方面，自建集群的大部分参数需要用户手动填入。

- 接入点：nameserver 地址。后续会支持 proxy 地址；
- Topic：RocketMQ Topic。选择此 topic 作为事件源的读取对象或者事件目标的写入对象；
- Tag：RocketMQ 消费 Tag，用于消费者过滤消息使用；
- Group ID：RocketMQ 消费组，标识一组特定的消费者，仅事件源有此参数；
- FilterType：过滤模式，目前支持 Tag 过滤；
- 认证模式：如果开启 ACL 鉴权，可在此配置鉴权信息；
- 消费位点：初始消费位点；
- VPC：自建 MQ 集群对应的 VPC 参数信息；
- 交换机：自建 MQ 集群对应的交换机信息；
- 安全组：EventBridge使用此安全组访问用户自建 MQ 集群，安全组规定了 EventBridge 在此 vpc 内的访问策略。



![7.jpeg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680502147797-6d3b1004-57ff-4736-bcde-dd381122d3fc.jpeg#clientId=u530d7dc4-3557-4&height=787&id=sMaNy&name=7.jpeg&originHeight=787&originWidth=420&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud3cbc72f-0ed8-4d6d-9edd-38cd4105e7e&title=&width=420)

## RocketMQ 消息路由


当用户有灾备或者消息同步的需求时，可能就会需要消息路由能力，即将 A region 下某实例 topic 的消息同步到 B region 的某 topic 中。

![8.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502147894-a173dfdc-f3f4-44c0-8ae7-625ca9eda62a.png#clientId=u530d7dc4-3557-4&height=580&id=D23xv&name=8.png&originHeight=580&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u08010f48-0db1-4dd2-ae01-6bb9f8d519f&title=&width=1080)

对于 EventBridge 而言，消息路由并非单独的一个产品能力，用户通过使用事件流即可实现消息路由。

针对非跨境场景的消息路由，如从北京同步消息到上海，跨 region 网络打通能力由 EventBridge 来实现，用户无需关注过多实现细节。

针对跨境场景，如北京同步消息到新加坡，EventBridge 使用的是公网链路完成对目标实例的写入，使用的是目标 MQ 实例的公网接入点。消息出公网的能力需要用户提供，即需要用户提供 VPC、交换机和安全组配置，此VPC须带有NAT等访问公网能力， EventBridge 使用此 VPC 实现写入目标端公网接入点。

在 API 使用方面，创建消息路由任务本质上是创建事件流，API 参数和上面各类型 RocketMQ 实例任务一致，这里以创建一个青岛到呼和浩特的 RocketMQ 消息路由为例。

1.进入 EventBridge 控制台，regionBar 选择到呼和浩特，点击左侧“事件流”，然后选择“创建事件流”。

![9.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502148235-8969935c-45f1-468c-bd4f-9840c563791d.png#clientId=u530d7dc4-3557-4&height=355&id=vHIYF&name=9.png&originHeight=355&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc46ad6b5-9d3a-4d6d-bb8f-a6015449a56&title=&width=1080)

2.在事件源页面，事件提供方选择“消息队列 RocketMQ 版”，地域选择青岛，剩余 RocketMQ 相关参数按需求选择。

![10.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502148269-f69d48dc-aabf-4901-9b15-dd98a651a116.png#clientId=u530d7dc4-3557-4&height=1038&id=Yrios&name=10.png&originHeight=1038&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0fad7e18-21fc-416d-a51e-0f07f478842&title=&width=1080)

3.规则页面按需填写，这里选择默认内容。

![11.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502148304-c620c2ad-3098-49f6-a874-c557d2babb0b.png#clientId=u530d7dc4-3557-4&height=535&id=Qu71b&name=11.png&originHeight=535&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u41496edf-1022-46ad-b604-a4d0beab48f&title=&width=1080)

4.在“目标”页面，服务类型选择“消息队列 RocketMQ 版”，剩余参数按需填写。

![12.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502148348-c63b6df3-ae48-4789-be2a-ce1355a8bda7.png#clientId=u530d7dc4-3557-4&height=1244&id=OXub6&name=12.png&originHeight=1244&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7f0710a8-2f60-4fc5-8f16-15b45c1ba73&title=&width=1080)

5.点击“创建”，等待事件流任务启动即可。

![13.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502148988-8d4dc585-7dd7-40e2-bab7-4674c787de81.png#clientId=u530d7dc4-3557-4&height=284&id=TmvQq&name=13.png&originHeight=284&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua8461b90-2b04-43f2-860d-55ae33426e6&title=&width=1080)

## 总结


本文介绍了 EventBridge 对接各类型 RocketMQ 实例的基本原理与对应的 API 使用说明，便于已经使用了 RocketMQ 5.0 版本和自建 MQ 实例的用户可以借助 EventBridge 的能力实现事件驱动业务架构的搭建。同时针对灾备和业务消息同步的场景，本文也基于事件流讲解了如何基于 EventBridge 创建 RocketMQ 消息路由任务。

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
