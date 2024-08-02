---
title: "“全”事件触发：阿里云函数计算与事件总线产品完成全面深度集成"
date: "2021/12/11"
author: "史明伟（世如）"
img: "https://img.alicdn.com/imgextra/i3/O1CN01LJvem01gp4LnBZXXN_!!6000000004190-0-tps-685-383.jpg"
tags: ["practice"]
description: "目前，函数计算已具备接入EventBridge所有事件源的触发能力，实现触达阿里云全系产品服务的“最后一公里”。"
---
# _作者：史明伟（世如）阿里云高级技术专家_

随着云原生技术的普及和落地，企业在构建业务系统时，往往需要依赖多个云产品和服务，产品互联、系统协同的需求越来越强。事件驱动架构将事件应用于解耦服务之间的触发和交互， 能够帮助用户很好实现产品、系统之间的互联互动。函数计算作为事件驱动架构的最佳选择，需要为用户提供丰富的事件源触发能力。

对于函数计算而言，事件源接入需要清晰地了解上游每一个事件源的诸多细节和鉴权要求，同时事件处理和系统错误追踪变得越加困难，集成效率成为阻碍产品能力的最大障碍。**为了加速事件源集成的效率，函数计算需要找到一种统一标准的事件源接入方式，基于通用的接入层进行基础能力和可观测性的建设，为客户提供丰富的事件源触发选择。**

**在这样的背景和需求下，阿里云函数计算（Function Compute）和阿里云事件总线（EventBridge）产品完成全面深度集成。**这意味着函数计算和阿里云生态各产品及业务 SaaS 系统有了统一标准的接入方式，意味着函数计算将具备接入 EventBridge 所有事件源的触发能力，Serverless 函数计算将实现触达阿里云全系产品服务的“最后一公里”，为基于阿里云生态产品提供重要的架构扩展能力。

## 为什么是 EventBridge？

阿里云事件总线（EventBridge）是一种无服务器事件总线，支持将用户的应用程序、第三方软件即服务（SaaS）数据和阿里云服务的数据通过事件的方式轻松的连接到一起，这里汇聚了来自云产品及 SaaS 服务的丰富事件，EventBridge 具备事件标准化和接入标准化的能力：

- 事件标准化：EventBridge 遵循业界标准的 CloudEvent 事件规范，汇聚了来自阿里云生态和 EventBridge 合作伙伴丰富事件源的各种事件，同时提供了完善的事件投递机制和消费策略，整个系统事件流转遵循统一的事件格式；

- 接入标准化：函数计算选择和 EventBridge 集成，无论是产品服务类型众多的阿里云官方事件源，还是第三方 SaaS 系统，EventBridge 都能够为函数计算和其它系统集成提供统一的集成界面，函数计算无需关注上游事件源的具体实现细节，只需要专注于事件处理，将事件的集成和投递全部交给 EventBridge 来处理；

EventBridge  + Function Compute 的结合让事件驱动型应用程序的构建变得简单，因为它可以为您完成事件摄取和交付、安全保障、授权以及错误处理工作。允许您构建松散耦合和分布的事件驱动型架构，帮助提高开发人员敏捷性和应用程序弹性。函数计算系统提供了完善的函数创建， 发布和运行体系，灵活的构建能力结合极致的运行时弹性能力将帮助业务构建云原生时代最富显著特征的事件驱动型架构。
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489430222-c6dce613-fa31-4344-a860-1966def27d85.gif#clientId=u6d65494b-96a0-4&height=1&id=QpXMi&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf437c26f-bb6c-48b9-a41c-18b580f8dbb&title=&width=1) -->
![1.png](https://img.alicdn.com/imgextra/i1/O1CN01AlsLN8272W86Kdskf_!!6000000007739-49-tps-1080-604.webp)

同时，EventBridge 能够提供来自事件源（例如 MQ、OSS、RDB等）的实时数据流，并将该数据路由到阿里云函数计算作为目标。您可以设置路由规则来确定发送数据的目的地，以便构建能够实时响应所有数据源的应用程序架构。

## 函数计算 + EventBridge 带来的变化？

### 提供 90+ 事件源接入

在和 EventBridge 集成之前， 函数计算已经实现了和阿里云部分核心系统的集成，随着函数计算 EventBridge 的深度集成，阿里云生态大量服务实现了和函数计算集成， 这些服务或产品的事件将作为事件源触发函数；目前函数计算触发器类型已经从原来的 15+ 增加到 90+，并随着 EventBridge 上游接入系统的增加而不断丰富；

### 控制台享受一站式服务

EventBridge 和函数计算控制台数据互通，用户在 EventBridge 控制台能够以事件为主体选择函数计算作为事件处理目标，在 EventBridge 控制台享受一站式服务；同样在函数计算控制台，用户能够根据不同触发器类型根据对应的事件类型编写函数；用户无需在函数计算控制台和事件总线控制台来回跳转；

### 保证数据一致性和稳定性

用户无论是在函数计算控制台上通过创建触发器的方式处理指定事件源的事件；还是在 EventBridge 控制台使用函数计算作为事件处理目标，提供统一的资源视图；同时在底层系统实现上，由于后端系统 API 的深度集成，能够保证上层业务逻辑采用统一的 API 及处理逻辑，从技术层面确保了多个入口功能实现的一致性，为客户系统稳定运行奠定坚实的基础； 

### 简化数据消费投递的复杂度

对于数据消费场景，EventBridge 负责了上游系统的对接和数据消费，用户无需关心事件源系统数据具体消费方式，这部分工作统一由 EventBridge 完成；对于函数计算用户，只需要考虑数据投递的逻辑；用户可以直接选择 EventBridge 提供的下游 Target 实现数据投递，也可以在代码层面仅使用 EventBridge 提供的 SDK 实现数据的投递，大大简化了数据投递的复杂度。

## 触发器业务应用场景

下面就让我们一起探索， 实际的业务生产环境，我们如何利用这两把利器让这一切简单的发生：

### 自动化运营分析和展示

业务系统会产生大量动态指标数据，需要提取指标数据做运营分析和展示，通过 EventBridge 和 FC 异步化串联实现自动化运营分析和展示。传统方案需要基于实时计算或者离线计算产品做数据提取和分析，整个方案较重，配置复杂。数据分析结果需要做预定义的展示渲染和推送，需要手工对接业务系统，步骤繁琐。

采用新的 EDA 架构，采用 EventBridge 对接业务自定义事件数据，规则驱动过滤逻辑简单。采用 FC 可以轻量化实现常见的数据分析操作，代码编写调试更简单；同时利用EventBridge 丰富的推送能力，可以实现分析结果快速触达受众。

![2.png](https://img.alicdn.com/imgextra/i2/O1CN01m215RT2696ClQjkYl_!!6000000007618-49-tps-1080-523.webp)

### 异步解耦

以交易引擎为例，交易系统引擎作为最核心的系统，每笔交易订单数据需要被几十几个下游业务系统关注，包括物品批价、发货、积分、流计算分析等等，多个系统对消息的处理逻辑不一致，单个系统不可能去适配每一个关联业务。结合 EventBridge 事件中心和函数计算灵活的逻辑扩展能力构建业务逻辑。

![3.png](https://img.alicdn.com/imgextra/i4/O1CN01atPtYA1owsA8nkAkS_!!6000000005290-49-tps-1080-526.webp)

### 新零售大促场景 Serverless + EDA 整合

大型新零售场景会伴随不定期大促，平时流量不大的业务在大促场景也会产生系统流量突增，极致弹性和稳定解耦的架构至关重要。基于传统模式开发稳定可靠、高弹性的后台服务人力不足、工期紧张；大促场景保障峰值流量需要预留大量资源，平时低峰期资源闲置浪费。新零售大促场景利用函数计算 + EventBridge + API 网关搭建 Serverless 模式服务中台，支撑海量请求访问， 系统具备极致弹性，无需预留管理 IaaS 资源，极大程度降低闲置成本；同时函数计算提供敏捷开发结合 EventBridge 低代码异步驱动，业务迭代效率大幅提升。

![4.png](https://img.alicdn.com/imgextra/i3/O1CN01EW7GQO2A7VI2ZRFYp_!!6000000008156-49-tps-1080-545.webp)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489432467-f4bcacbb-fcc0-41c0-88cc-3deb9238ea46.gif#clientId=u6d65494b-96a0-4&height=1&id=EAXFB&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u292a9460-437a-4432-856b-cc3c20b5d5f&title=&width=1) -->
## 总结

如果说事件背后的服务是阿里云生态服务的积木， 那么 Serverless 函数计算将是能够将这些积木通过轻巧的方式组合起来艺术化的最佳手段；你可以利用函数计算为这些积木涂上更绚丽的色彩，同时能够将他们串联起来，搭建一个具有无比想象空间的 SaaS/PaaS 服务艺术品。

**EventBridge 触发器现已在阿里云函数计算控制台所有地域（Region）开放，欢迎大家点击**[**此处**](https://www.aliyun.com/product/fc)**进行使用体验！**

关于触发器具体创建，配置，参考阿里云函数计算官方帮助文档：[_https://help.aliyun.com/document_detail/146104.html_](https://help.aliyun.com/document_detail/146104.html)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://img.alicdn.com/imgextra/i4/O1CN01Xi1rcu1DM6aIC7ypz_!!6000000000201-0-tps-1920-675.jpg)