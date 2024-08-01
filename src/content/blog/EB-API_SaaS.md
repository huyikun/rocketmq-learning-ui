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

![1.png](https://img.alicdn.com/imgextra/i2/O1CN01fLQVsm1LxDbTmUEst_!!6000000001365-0-tps-1080-431.jpg)

## API 端点 Sink 概述

接入 EventBridge 应用有多种情况：用户自定义应用、阿里云服务、其他云厂商服务或者其他 DB 产品。

具体而言，API 端点 Sink 事件目标是 EventBridge 支持的事件目标的一种，是通过 EventBridge 将数据投递至指定 Web Server 中。

![2.png](https://img.alicdn.com/imgextra/i2/O1CN0126Ehfm1zZThqraT7Q_!!6000000006728-0-tps-1080-322.jpg)

## API 端点 Sink 基本使用

首先现阶段 API 端点的 Sink 支持三种鉴权方式：

同时网络支持公网和专有网络（后续支持）。

### 1、创建 Connection

**添加连接配置基本信息，并配置鉴权。**

**链接配置支持三种鉴权方式 ：**

![3.png](https://img.alicdn.com/imgextra/i3/O1CN01cmAI8825N0cMPDpgX_!!6000000007513-0-tps-1080-638.jpg)

#### Basic 鉴权方式 ：

![4.png](https://img.alicdn.com/imgextra/i4/O1CN01aL5uUW1EvewlNbEH6_!!6000000000414-0-tps-1080-661.jpg)

#### OAuth 2.0 鉴权方式：

**添加授权接入点、授权请求方式、Client ID、ClientSecret 和授权相关的 Http 请求参数。**

![5.png](https://img.alicdn.com/imgextra/i1/O1CN01XDZRN71pknKrxjfVM_!!6000000005399-0-tps-1080-695.jpg)

#### API Key 鉴权方式：

![6.png](https://img.alicdn.com/imgextra/i4/O1CN012gPC321lWomlbns4B_!!6000000004827-0-tps-1080-664.jpg)

### 2、创建 ApiDestination

**API 端点配置 ：配置需要访问 API 的 URL 地址和 HTTP 调用类型。**

**添加请求地址和请求方式：**

![7.png](https://img.alicdn.com/imgextra/i1/O1CN01SQkVY91Zot1EpE2BW_!!6000000003242-0-tps-1080-643.jpg)

在创建 API 端点时可以直接创建连接配置也可以选择已有的连接配置，例如上面已经创建成功的连接配置。

![8.png](https://img.alicdn.com/imgextra/i2/O1CN01TF0aFJ1qeDG4QBth5_!!6000000005520-0-tps-1080-796.jpg)

### 3、创建 Rule

创建事件规则，用于将事件投递到具体的 API 端点中。

#### 步骤一 ：点击事件规则并创建事件规则
![9.png](https://img.alicdn.com/imgextra/i3/O1CN01lTzgSR1yV4HAVC8BS_!!6000000006583-0-tps-1080-807.jpg)

#### 步骤二 ：是选择事件源，可以选择阿里云官方的或者选择自定义事件源，这里选择的是自定义事件源

![10.png](https://img.alicdn.com/imgextra/i3/O1CN01ZeInI71IdZlul30qR_!!6000000000916-0-tps-1080-764.jpg  )

#### 步骤三 ：第三步是选择 API 端点事件目标

支持自定义创建和使用已有，同时可以添加请求 HTTP 参数。

![11.png](https://img.alicdn.com/imgextra/i1/O1CN01rYUc3H1n6N9Cf0X5T_!!6000000005040-0-tps-1080-791.jpg)

**使用已有**

**使用选择已有的以后只需要添加请求 HTTP 参数即可：**

![12.png](https://img.alicdn.com/imgextra/i4/O1CN01FJH3DO1xdTw2BODEB_!!6000000006466-0-tps-1080-772.jpg)

选择已有的 API 端点来自于集成中心下面的 API 端点：

![13.png](https://img.alicdn.com/imgextra/i4/O1CN01dCEa8L1oVqnRqzSFH_!!6000000005231-0-tps-1080-411.jpg)

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

![14.png](https://img.alicdn.com/imgextra/i4/O1CN01zQefnd1hWa7NxJFQ9_!!6000000004285-2-tps-1080-394.png)

举例介绍：可以通过 API 文档中提供的接口实现动态的创建管道、创建构建和重试作业等。

文档地址 ：
[_https://buildkite.com/docs/apis/rest-api/organizations_](https://buildkite.com/docs/apis/rest-api/organizations)

创建 API 端点

![15.png](https://img.alicdn.com/imgextra/i3/O1CN011wVeHf1EL1GHcWssO_!!6000000000334-0-tps-1080-544.jpg)

创建规则

![16.png](https://img.alicdn.com/imgextra/i4/O1CN01oTRYGh1GgCoaBAH1x_!!6000000000651-0-tps-1080-524.jpg)

发布事件，发布完成以后可以到事件轨迹查询详情

![17.png](https://img.alicdn.com/imgextra/i3/O1CN01s2yx3f1meQzHZdnbT_!!6000000004979-0-tps-1080-431.jpg)

### 典型场景 ：与 Freshdesk 集成

场景介绍 ：利用 EventBridge 丰富的云产品事件源和目标集成能力，快速与 CRM（Freshdesk）进行集成。

集成产品背景描述 ：不同的平台都需要对接 CRM（Freshdesk）管理系统。

用户痛点 ：不同的平台的事件收集困难，需要用户自定义实现。

方案优势 ：EventBridge 支持集成 CRM（Freshdesk）平台，用户只需要简单配置即可实现动态的创建会话、创建联系人和创建技能等事件。
![18.png](https://img.alicdn.com/imgextra/i4/O1CN01FgwBb91gj7LION3zn_!!6000000004177-2-tps-1080-478.png)

举例介绍：可以通过 API 文档中提供的接口实现动态的创建会话、创建联系人和创建技能等。

文档地址 ：
[_https://developers.freshdesk.com/api/_](https://developers.freshdesk.com/api/)

创建 API 端点
![19.png](https://img.alicdn.com/imgextra/i1/O1CN01kNdpUn1iVUnMB6Q0p_!!6000000004418-0-tps-1080-599.jpg)

创建事件规则

![20.png](https://img.alicdn.com/imgextra/i2/O1CN01Qw5n3Y1SqzWyEwHn5_!!6000000002299-0-tps-1080-561.jpg)

发布事件，发布完成以后可以到事件轨迹查询详情

![21.png](https://img.alicdn.com/imgextra/i3/O1CN01hIgW6n1nSoYJZ6W67_!!6000000005089-0-tps-1080-499.jpg)

### 典型场景 ：与有成财务集成

场景介绍 ：利用 EventBridge 丰富的云产品事件源和目标集成能力，快速与有成财务进行集成

集成产品背景描述 ：不同的 HR 系统或者 OA 系统需要对接有成财务时

用户痛点 ：不同的系统的事件收集困难，需要用户自定义实现

方案优势 ：EventBridge 支持集成有成财务平台，用户只需要简单配置即可实现动态生成报销科目和财务凭证等事件

![22.png](https://img.alicdn.com/imgextra/i3/O1CN01BzOc6l1HgUgBdMLpf_!!6000000000787-2-tps-1080-522.png)

举例介绍：比如用户想把 mns 的消息或者其他消息产品，同步到钉钉产品等接口中，或者也可以利用消息生成报销单据，可以生成报销科目和财务凭证等

地址 ：
[_https://yiqbopenapi.superboss.cc/#/share/awXPk8nW/K8Mg3rzl_](https://yiqbopenapi.superboss.cc/#/share/awXPk8nW/K8Mg3rzl)

创建 API 端点

![23.png](https://img.alicdn.com/imgextra/i4/O1CN01oTRYGh1GgCoaBAH1x_!!6000000000651-0-tps-1080-524.jpg)

创建规则

![24.png](https://img.alicdn.com/imgextra/i2/O1CN01KHbeYm22Wg8HKEBnY_!!6000000007128-0-tps-1080-850.jpg)

发布事件，发布完成以后可以到事件轨迹查询详情。

![25.png](https://img.alicdn.com/imgextra/i3/O1CN01UJn5GA1qtmj130lrh_!!6000000005554-0-tps-1080-496.jpg)

# 活动推荐


阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://img.alicdn.com/imgextra/i4/O1CN01Xi1rcu1DM6aIC7ypz_!!6000000000201-0-tps-1920-675.jpg)
