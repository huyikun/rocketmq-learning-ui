---
title: "EventBridge 在 SaaS  企业集成领域的探索与实践"
date: "2022/06/26"
author: "肯梦"
img: "https://img.alicdn.com/imgextra/i4/O1CN01mca2SR29CFdcqRhlh_!!6000000008031-0-tps-685-383.jpg"
tags: ["practice"]
description: "当下降本增效是各行各业的主题，而 SaaS 应用作为更快触达和服务业务场景的方式则被更多企业熟知和采用。本文将结合实际业务场景讲述在 SaaS 行业的洞察与 SaaS 集成的探索实践。"
---

> 当下降本增效是各行各业的主题，而 SaaS 应用作为更快触达和服务业务场景的方式则被更多企业熟知和采用。随着国内 SaaS 商业环境的逐渐成熟，传统企业中各个部门的工程师和管理者，能迅速决定采购提升效率的 SaaS 产品，然后快速投入生产和使用。但是随着行业 SaaS 越来越多，如何解决各个 SaaS 系统的数据孤岛，如何将SaaS 应用数据与现有系统数据进行打通，已然变成了企业使用 SaaS 的瓶颈。因此，业内也广泛提出 B2B integration 企业集成的概念。


> 本文将结合实际业务场景讲述在 SaaS 行业的洞察与 SaaS 集成的探索实践。



## 什么是 SaaS


### SaaS 概述

SaaS（Software-as-a-Service，软件即服务）源自于美国 Salesforce 公司（1999 年创立）创造的新软件服务模式。相比于传统软件，用户使用的 SaaS 软件，其数据保存在云端（国内有很多行业 SaaS 由于其数据敏感会单独部署在客户 IDC）。而且，SaaS 公司提供给客户的服务通常是按需租用的，比如按年缴纳使用费5年，第二年再续费，如果不满意也可以不续费，这会大大激发 SaaS 创业公司持续的打磨产品、持续的为客户提供更大价值的动力。

### SaaS 典型分类

SaaS 分类比较繁琐，一般有两个分类维度。一个维度按照使用场景，另一个维度按照商业价值。

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492002832-99d9ccee-4038-4a5c-a62c-85683a08b0d1.png#clientId=u1ec0614c-088a-4&height=713&id=bi5NP&name=1.png&originHeight=713&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u08f5511d-3de3-4cb9-b9d5-e48410dc20e&title=&width=1080)

SaaS 一般分类为 通用 SaaS 和 行业 SaaS 两个基础类。

通用 SaaS 顾名思义是通用的，跨行业的，比如钉钉即时通讯或者某司的 HR 产品，由于使用场景更广，因而客群也会更多。

行业 SaaS 是在某个行业内使用的产品，比如餐饮企业 SaaS、电商 SaaS 等。

当然，还有第二个维度是工具 SaaS 和 商业 SaaS。

工具 SaaS，为客户企业提供一个提高管理效率的工具；商业 SaaS，除了提供一部分“工具”价值外，还能为客户企业提供增值价值，比如增加营收、获得资金等。

商业 SaaS 产品虽然风险更大，但在国内特色的商业环境、管理水平及人才结构下，更容易快速实现客户价值和自我价值。

### SaaS 在中国的发展历程
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492002582-8c18d9ee-4498-4f4a-bdc5-155b89be57e5.gif#clientId=u1ec0614c-088a-4&height=1&id=Z8E7z&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ude6a8e09-f808-40d5-9aeb-1d7a98a886c&title=&width=1)
![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492004473-b0f9ae58-ee08-4998-86b7-1adf9db0f0af.png#clientId=u1ec0614c-088a-4&height=346&id=iNzDb&name=2.png&originHeight=346&originWidth=924&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua41abf39-6c52-4b06-beef-bb4d92f790e&title=&width=924)

对于 SaaS 领域来讲，云服务的普及提振了大家对 SaaS 服务稳定性和数据安全性的信心。同时，人口红利消退使得 SaaS 成本优势凸显。当下疫情环境也加快了市场教育，企业主转变思路，降本增效的需求显著上升。随着整个行业的渗透率加快，SaaS 场景和行业越做越深，SaaS 市场可以遇见在未来会有高速的增长。很多企业会在新业务场景使用 SaaS 服务，小步快跑试错，解决活下来的问题，而不是重复造轮子。

### 什么是 B2B ？

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492002964-6d52c1fe-4f73-4a04-a654-b943b1cdb4fa.png#clientId=u1ec0614c-088a-4&height=534&id=c5HZs&name=3.png&originHeight=534&originWidth=929&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u47978067-61d0-4211-b533-a9e97f61b17&title=&width=929)

B2B 即 Business-to-Business (B2B) integration 是指将两个或者多个组织之间的业务流程和通讯自动化，通过自动化关键业务流程，实现不用应用和组织关系的打通，有效促进应用提供方和客户之间的数据打通与合作。

可以断言，随着 SaaS 行业逐渐渗透，企业集成的诉求会逐渐增多。数据同步、用户同步、接口同步的诉求会逐步增多，包括自建服务与 SaaS 服务的打通，SaaS 服务与 SaaS 服务的打通等。

## SaaS 集成领域场景分析


随着行业类 SaaS 的逐渐丰富，在企业生产实践中，应用和应用的数据集成和互通变得至关重要。包括 API 集成，数据集成，流程集成等场景。

### API 集成

通过 API 将 SaaS 应用的业务流程串联，现阶段大部分 SaaS 集成对接都是通过标准 API 协议实现的。源端采用 WebHook 机制推送到指定 HTTP 端点，目标端则采用类似 API 接口调用的方式，主动调取执行动作。

实现结构如下：

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492002777-6057ac6c-af93-4245-8d38-0cdb2bca33d4.png#clientId=u1ec0614c-088a-4&height=222&id=VpCm2&name=4.png&originHeight=222&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf9387f72-d0e7-4304-9654-726943a5ac4&title=&width=1080)

业内通用方案通几乎均为同步方案，通过 API + 中间网关对调用做解耦和映射。该方案的主要问题是调用追溯难；其次如出现上下游接口限制不一致问题，会导致下游调用大量失败。

### 数据集成

数据集成场景主要是企业自建系统和 SaaS 系统的打通。当企业使用的行业 SaaS 逐渐增多，数据一致性问题就会变的迫在眉睫。

大部分企业通常会面临云上数据导入/同步到 SaaS 应用的场景，而业内对 SaaS 应用的数据集成方案并没有类似 CDC 场景下的 Debezium 那么标准和通用。

## 企业在 SaaS 集成领域的痛点


### 接入成本高

对大量使用 SaaS 应用的企业来讲， SaaS 集成是必须做的基础建设。但是该部分基础建设通常会消耗大量人力，由于各个行业的 SaaS 百花齐放，通常很难使用一套架构满足全部集成场景。意味着通常情况下，企业使用每一款 SaaS 都会面临 SaaS 系统与自身系统集成的困难。

### 异构数据多

异构数据多是集成领域又一个比较典型的特点，异构数据通常有结构化数据，非机构化数据，半结构化数据。比如企业自建关系型数据库就是典型的结构化数据，但是要被其他 SaaS 系统集成通常是 Json 这种半结构数据入参。当然这部分内容可以通过定制代码搞定，但这个思路一定不是做消息枢纽的思路；

异构数据如何高效的统一处理其实是当前 SaaS 集成亟待解决的问题，也是最大的冲突点。

### 分发/路由困难

当很多集成需求同时涌现时，如何对已集成数据进行合理分发，会变成集成领域又一个难以解决的问题。每个细分场景甚至每个集成链路所需要的数据内容甚至数据类型都不一样。如果路由/分发无法完成，那么企业统一集成将无法实现。

### 集成追踪困难

当全部采用同步链路时，这里的集成状态追踪就会变成玄学，除非将链路接入 Tracing ，但是这部分又回产生高额的改造成本，同时多源 Tracing 的复杂相对于单链路会呈几何倍数的增加。

### 老系统迁移困难

老系统迁移主要是数据集成部分，如果将新老系统对接，并构建统一的应用网是当下企业构建 SaaS 建设的难点。企业迫切的需要一种能将"新"“老”应用联接起来的方式，打破企业应用发展的时间与空间界限，协同企业原有核心数据资产及创新应用，构建可平滑演进的企业IT架构。

## EventBridge 一站式企业 SaaS 集成方案

针对业内 SaaS 系统集成的种种痛点，EventBridge 推出一站式企业 SaaS 集成方案。通过收敛 SaaS 集成痛点诉求，EventBridge 推出 API 集成方案和数据集成方案，打通应用与应用，云与应用的连接。

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492004890-5b37f95e-9d35-42d3-af5c-f9c80fb6630d.png#clientId=u1ec0614c-088a-4&height=556&id=iyjWI&name=5.png&originHeight=556&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ubd5289ab-1abc-4639-bac8-09f6321c3c8&title=&width=1080)

### 低代码集成平台

提供完全托管的集成平台服务，仅需在控制台进行简单配置即可在几分钟内完成应用集成。客户无需关心底层资源及实现细节即可打通云下到云上，SaaS 到 SaaS 的集成与连接，轻松完成异构数据接入。

### 金融级稳定性

满足不同客户企业级集成项目的要求，提供高可用性、灾难恢复、安全性、服务等级协议（SLA）和全方面的技术支持。

### 全方位的集成能力

支持各种集成场景，打通云上云下企业应用、物联网、设备及合作伙伴之间的信息孤岛。支持事件规则，事件路由等多种路由方式，实现跨云跨地域互通和信息共享。同时强大的链路追踪能力可以帮助企业快速排障。

### 开放的平台

拥抱 CloudEvents 社区，提供标准化的事件集成方案。提供丰富的开发者工具，拥有海量的生态伙伴及开发者，丰富开箱即用的连接器和应用组件可以帮助加速企业业务创新。

## EventBridge 在 SaaS 领域的典型应用场景

### SaaS 应用同步

应用同步是指在特定时间点将一组特定的事件从一个系统迁移到另一个系统的行为。事件同步模式允许开发人员创建数据自动迁移集成服务；业务人员和开发人员可以通过配置集成应用，自动化的将特定范围内的数据传递到下游应用；创建可重用的服务可以为开发和运营团队节省大量时间。

例如：
把销售机会数据从一个旧式 CRM (客户关系管理) 系统迁移到新的 CRM 实例；
把销售订单数据从一个 CRM 组织迁移到另一个组织；
从 ERP (企业资源计划) 同步产品主数据到 CRM 系统中。

### 事件广播

事件广播是在连续的、近实时或实时的基础上将事件从单个源系统移动到多个目标系统的行为。本质上，它是一对多的单向同步。通常，“单向同步”表示 1:1 关系。但是，广播模式也可以是 1:n（n 大于 1）的关系。

例如：
当一个销售机会在 CRM 中被标记为成功关单的时候，应在 ERP 中创建销售订单。

### SaaS 应用通知

事件通知是指当 SaaS 应用发生某个类型的事件，可以通过钉钉，短信等通知方式告知用户。用户可及时获取到关键事件信息。

例如：
当一个销售机会在 CRM 中被标记为重要商机的时候，会及时通知给其他同事进行跟进并关注。

### 自建系统到云上迁移

EventBridge 支持云上数据库、云上消息队列、云产品事件对接 SaaS 系统，完善企业用户建设应用一张网的诉求，打破企业应用发展的时间和空间界限，协同企业原有核心资产与 SaaS 系统，构建可演进的企业 IT 架构。

例如：
当引入一个新的 SaaS 应用时，可通过 EventBridge 将数据库/大数据平台的核心资产（如人员信息等）同步至 SaaS 应用。

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
