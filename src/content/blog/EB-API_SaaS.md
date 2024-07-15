---
title: "基于 EventBridge API Destination 构建 SaaS 集成实践方案"
date: "2023/01/06"
author: "赵海"
img: "https://img.alicdn.com/imgextra/i4/O1CN01ra0WNz1UgZcDVf3Q4_!!6000000002547-0-tps-685-383.jpg"
tags: ["practice"]
description: "本次新增集成中心（Integration Center）是负责 EventBridge 与外界系统对接的模块，通过抽象与配置快速获取第三方事件并将事件集成到第三方系统。并且优化现有 HTTP Sink 集成方案，为用户下游集成创造更多适配场景。"
---

## 引言

事件总线 EventBridge 是阿里云提供的一款无服务器事件总线服务，支持阿里云服务、自定义应用、SaaS 应用以标准化、中心化的方式接入，并能够以标准化的 CloudEvents 1.0 协议在这些应用之间路由事件，帮助您轻松构建松耦合、分布式的事件驱动架构。事件驱动架构是一种松耦合、分布式的驱动架构，收集到某应用产生的事件后实时对事件采取必要的处理后路由至下游系统，无需等待系统响应。使用事件总线 EventBridge 可以构建各种简单或复杂的事件驱动架构，以标准化的 CloudEvents 1.0 协议连接云产品和应用、应用和应用等。

目前 HTTP 的不足有以下几点：

- HTTP 的能力较弱，比如：授权方式单一、只支持 Body 传参、网络互通能力未对齐。只能满足客户最简单的场景。
- 用户无法基于 API 来统一管理（修改/下线）Target，用户体验交叉口；
- 对于基于 HTTP 实现的 SaaS API，无法简单快捷的引入到 EB 中，作为 Target 给用户使用。

**本次新增集成中心（Integration Center）是负责 EventBridge 与外界系统对接的模块，通过抽象与配置快速获取第三方事件并将事件集成到第三方系统。并且优化现有 HTTP Sink 集成方案，为用户下游集成创造更多适配场景。**

**集成中心重点服务对象包括但不限于 SaaS 系统，对标 IPaaS 平台的能力提供完整的全面的通用系统集成方案。**

- 集成源（Integration Source）：指集成到 EventBridge 的第三方源；
- API 端点（API Destination ）：指被集成到 EventBridge 的第三方 API 端点；
   - 连接配置（Connection）：是 API 端点模块的子集，与API 端点的平级资源，主要负责记录连接及配置信息，连接配置可被任意 API 端点复用。

针对市场上其他云厂商服务，EventBridge 发布了 API 端点 Sink 能力，主要作用在于承接 EventBridge 下游端数据，帮助用户快速完成下游数据集成。提供简单且易于集成的三方事件推送 ，帮助客户更加高效、便捷地实现业务上云。

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501547813-075bc363-b3c9-44e9-a215-9357042bee61.png#clientId=ue8cee252-7e15-4&height=431&id=BlMRp&name=1.png&originHeight=431&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u857b1aa3-6c0c-4b1f-95ec-80dcc94c29e&title=&width=1080)

## API 端点 Sink 概述

接入 EventBridge 应用有多种情况：用户自定义应用、阿里云服务、其他云厂商服务或者其他 DB 产品。

具体而言，API 端点 Sink 事件目标是 EventBridge 支持的事件目标的一种，是通过 EventBridge 将数据投递至指定 Web Server 中。

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501547879-41aa6082-99c6-4007-a8e6-6adf1130d22d.png#clientId=ue8cee252-7e15-4&height=322&id=xfAsx&name=2.png&originHeight=322&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub9c3ef03-b8cc-4183-bd7d-04248e4c137&title=&width=1080)

## API 端点 Sink 基本使用

首先现阶段 API 端点的 Sink 支持三种鉴权方式：

同时网络支持公网和专有网络（后续支持）。

### 1、创建 Connection

**添加连接配置基本信息，并配置鉴权。**

**链接配置支持三种鉴权方式 ：**

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501549717-f0b21787-f723-4df6-8106-e0eda257afd8.png#clientId=ue8cee252-7e15-4&height=638&id=wccCN&name=3.png&originHeight=638&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u689eaa63-16ef-49c7-ba90-df9fc79a9be&title=&width=1080)

#### Basic 鉴权方式 ：

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501547749-cee81490-b06a-44ce-a883-49558d2e38d4.png#clientId=ue8cee252-7e15-4&height=661&id=Qv7Ji&name=4.png&originHeight=661&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud3c0338a-97ac-4f5c-a228-1316f8edf5e&title=&width=1080)

#### OAuth 2.0 鉴权方式：

**添加授权接入点、授权请求方式、Client ID、ClientSecret 和授权相关的 Http 请求参数。**

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501547779-f9221b9b-eef4-44d8-b355-bd4ff0b0e2d7.png#clientId=ue8cee252-7e15-4&height=695&id=jknNw&name=5.png&originHeight=695&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue7f1d6bb-0a9d-4246-8650-b518f2221e4&title=&width=1080)

#### API Key 鉴权方式：

![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501549973-ba82926b-4380-4566-b71a-b6cc6ff119a3.png#clientId=ue8cee252-7e15-4&height=664&id=gV0Kd&name=6.png&originHeight=664&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8d21eddd-02bf-402e-9002-2af8f96c794&title=&width=1080)

### 2、创建 ApiDestination

**API 端点配置 ：配置需要访问 API 的 URL 地址和 HTTP 调用类型。**

**添加请求地址和请求方式：**

![7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501550151-8b12e28a-8c38-4445-b6ca-839fbf19fdce.png#clientId=ue8cee252-7e15-4&height=643&id=tS2a8&name=7.png&originHeight=643&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9558221e-cc43-4211-80ea-c9f2e23908a&title=&width=1080)

在创建 API 端点时可以直接创建连接配置也可以选择已有的连接配置，例如上面已经创建成功的连接配置。

![8.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501550158-bdde2a39-05c3-4085-9cd8-5c1903369bf4.png#clientId=ue8cee252-7e15-4&height=796&id=rqfiz&name=8.png&originHeight=796&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u725719f7-0d6f-4d48-97ec-28cf3315602&title=&width=1080)

### 3、创建 Rule

创建事件规则，用于将事件投递到具体的 API 端点中。

#### 步骤一 ：点击事件规则并创建事件规则
![9.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501550259-b57928f3-cb03-49c5-a13d-06bf5deb4da0.png#clientId=ue8cee252-7e15-4&height=807&id=Uq0Ma&name=9.png&originHeight=807&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u688391eb-2310-46ad-bd5c-1bf0d70e779&title=&width=1080)

#### 步骤二 ：是选择事件源，可以选择阿里云官方的或者选择自定义事件源，这里选择的是自定义事件源

![10.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501550628-c1bee41a-0591-4736-8e11-02deec1c3131.png#clientId=ue8cee252-7e15-4&height=764&id=kdoAt&name=10.png&originHeight=764&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u63283d73-d46f-48db-bcb8-ab1b08b2045&title=&width=1080)

#### 步骤三 ：第三步是选择 API 端点事件目标

支持自定义创建和使用已有，同时可以添加请求 HTTP 参数。

![11.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501550797-c630f082-c7a7-40a8-b77e-7f21d8420eb2.png#clientId=ue8cee252-7e15-4&height=791&id=zqQhs&name=11.png&originHeight=791&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u11e0f11d-0cfc-468a-9641-d23933f9e59&title=&width=1080)

**使用已有**

**使用选择已有的以后只需要添加请求 HTTP 参数即可：**

![12.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501550880-d7614582-31eb-4e93-9be3-25523f031161.png#clientId=ue8cee252-7e15-4&height=772&id=GcodK&name=12.png&originHeight=772&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7f44706e-8e79-41fb-8565-dfb791ec00d&title=&width=1080)

选择已有的 API 端点来自于集成中心下面的 API 端点：

![13.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501551016-c57b42cd-7f1d-45dd-8294-5fc26ccb5a38.png#clientId=ue8cee252-7e15-4&height=411&id=JOTg6&name=13.png&originHeight=411&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u43201a90-c8f8-4f76-b188-aa473b45a94&title=&width=1080)

## 最佳实践

**常见场景案例**，比如：

- 用户可以把 RocketMQ 或者 RabbitMQ 的消息产品的消息动态投递到不同的 Web Server 中，这样可以让不同的 web 平台处理消息数据，实现了跨平台或者跨语言的消息流通。

- 用户可以把日志服务 SLS 数据投递到指定的 Web Server 或者 ELK 中，方便业务部门或者大数据平台对日志数据处理，可以更好的完善用户画像和用户行为分析，方便给用户打标签，从而可以进一步完善大数据个性化用户推荐系统。

例如下面是访问的国内外 SaaS 生态：

### 典型场景 ：与 Buildkite 集成

场景介绍 ：利用 EventBridge 丰富的云产品事件源和目标集成能力，快速与 Buildkite 的持续集成和持续交付（CI / CD）平台进行集成。

集成产品背景描述 ：Buildkite 是大型持续集成和持续交付（CI / CD）平台会有各种管理的变更、构建和作业等任务，运维人员需要快速感知、处理这些变更，以便决赛风险。

用户痛点 ：构建的事件收集困难，需要手动触发构建和手动创建管道。

方案优势 ：EventBridge 支持集成 Buildkite 的持续集成和持续交付平台，用户只需要简单配置即可创建和处理平台的事件。

![14.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501551191-64a678f5-a5ad-4916-95eb-6891fd2167f6.png#clientId=ue8cee252-7e15-4&height=394&id=YKZSJ&name=14.png&originHeight=394&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4164cc6e-7b28-4322-99a3-191798163eb&title=&width=1080)

举例介绍：可以通过 API 文档中提供的接口实现动态的创建管道、创建构建和重试作业等。

文档地址 ：
[_https://buildkite.com/docs/apis/rest-api/organizations_](https://buildkite.com/docs/apis/rest-api/organizations)

创建 API 端点

![15.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501551632-f4f0490f-111e-4e13-a3e9-73e8e4f5a76c.png#clientId=ue8cee252-7e15-4&height=544&id=Rpzwp&name=15.png&originHeight=544&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6b9697b6-cf22-4249-b2a2-50f4927e04a&title=&width=1080)

创建规则

![16.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501551569-1fd6ecdf-70ea-42cd-8995-bacaf6948257.png#clientId=ue8cee252-7e15-4&height=837&id=pveU1&name=16.png&originHeight=837&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ucb31720e-25b4-4cdf-acba-1ab980412c0&title=&width=1080)

发布事件，发布完成以后可以到事件轨迹查询详情

![17.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501551638-ae22958d-46b3-4982-98e1-993e8860bb6a.png#clientId=ue8cee252-7e15-4&height=431&id=qolDq&name=17.png&originHeight=431&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u59d8e5fb-6e73-49e6-8733-a661dc71748&title=&width=1080)

### 典型场景 ：与 Freshdesk 集成

场景介绍 ：利用 EventBridge 丰富的云产品事件源和目标集成能力，快速与 CRM（Freshdesk）进行集成。

集成产品背景描述 ：不同的平台都需要对接 CRM（Freshdesk）管理系统。

用户痛点 ：不同的平台的事件收集困难，需要用户自定义实现。

方案优势 ：EventBridge 支持集成 CRM（Freshdesk）平台，用户只需要简单配置即可实现动态的创建会话、创建联系人和创建技能等事件。
![18.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501551760-15a3a813-b727-401b-b88e-12d32e848809.png#clientId=ue8cee252-7e15-4&height=478&id=EcYyZ&name=18.png&originHeight=478&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua1c29b4c-1323-440d-a96c-5d7bc93e4a6&title=&width=1080)

举例介绍：可以通过 API 文档中提供的接口实现动态的创建会话、创建联系人和创建技能等。

文档地址 ：
[_https://developers.freshdesk.com/api/_](https://developers.freshdesk.com/api/)

创建 API 端点
![19.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501552207-f892e27b-7c0e-4d72-80e9-b69e463d3686.png#clientId=ue8cee252-7e15-4&height=599&id=ii17n&name=19.png&originHeight=599&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1e161de9-f93c-4ed7-b909-54a16d37796&title=&width=1080)

创建事件规则

![20.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501552294-e2f8a287-6a28-48f6-8d54-33a4d752b4fb.png#clientId=ue8cee252-7e15-4&height=561&id=W4k0H&name=20.png&originHeight=561&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ucf1baa2f-2252-4915-a289-ef7f822a063&title=&width=1080)

发布事件，发布完成以后可以到事件轨迹查询详情

![21.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501552396-56437ce1-7ba0-446c-b69a-cb631b2d33fe.png#clientId=ue8cee252-7e15-4&height=499&id=cFkU1&name=21.png&originHeight=499&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u73414543-6185-4391-9558-c623260709d&title=&width=1080)

### 典型场景 ：与有成财务集成

场景介绍 ：利用 EventBridge 丰富的云产品事件源和目标集成能力，快速与有成财务进行集成

集成产品背景描述 ：不同的 HR 系统或者 OA 系统需要对接有成财务时

用户痛点 ：不同的系统的事件收集困难，需要用户自定义实现

方案优势 ：EventBridge 支持集成有成财务平台，用户只需要简单配置即可实现动态生成报销科目和财务凭证等事件

![22.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501552375-6ed9708d-75eb-43bc-93cd-147c49090bfa.png#clientId=ue8cee252-7e15-4&height=522&id=mRlqA&name=22.png&originHeight=522&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u55ef9f76-9da3-4f37-a189-c9937db7e73&title=&width=1080)

举例介绍：比如用户想把 mns 的消息或者其他消息产品，同步到钉钉产品等接口中，或者也可以利用消息生成报销单据，可以生成报销科目和财务凭证等

地址 ：
[_https://yiqbopenapi.superboss.cc/#/share/awXPk8nW/K8Mg3rzl_](https://yiqbopenapi.superboss.cc/#/share/awXPk8nW/K8Mg3rzl)

创建 API 端点

![23.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501552597-a3bcff90-8791-487b-8cd2-a2de01a016e8.png#clientId=ue8cee252-7e15-4&height=524&id=ZiQHv&name=23.png&originHeight=524&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u397cc86e-5b9b-4293-b900-60860bac0b4&title=&width=1080)

创建规则

![24.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501553072-cd4cf115-e239-458e-9e29-fc21646f0371.png#clientId=ue8cee252-7e15-4&height=850&id=bQLhY&name=24.png&originHeight=850&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5bee1c30-7520-4ada-86f3-3bc69f831cb&title=&width=1080)

发布事件，发布完成以后可以到事件轨迹查询详情。

![25.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501553016-6101cca0-edb3-42b9-ab7d-634971c2c7fd.png#clientId=ue8cee252-7e15-4&height=496&id=A2ice&name=25.png&originHeight=496&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4086b588-fb9f-4c2c-9ada-ab3558fea6a&title=&width=1080)

# 活动推荐


阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
