---
title: "博时基金基于 RocketMQ  的互联网开放平台 Matrix 架构实践"
date: "2021/06/23"
author: "伍振河、曾志"
img: "https://img.alicdn.com/imgextra/i4/O1CN01nx36881UQ5MAhiFfP_!!6000000002511-0-tps-685-383.jpg"
tags: ["practice"]
description: "Matrix 经过一年多的建设，目前已具备多渠道统一接入、第三方生态互联互通、基金特色交易场景化封装等功能特性。Matrix 通过建设有品质、有温度的陪伴，从技术上和体验上，让用户理解风险，理解投资，进而为客户持续创造价值。"
---
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488606860-420ff3e5-21ae-49f8-9d30-5bd91867f299.png#clientId=u18583d16-efd9-4&from=paste&id=u2102c632&originHeight=651&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua6aa11e9-64e5-4044-8a73-99c04801b21&title=)
作者｜伍振河 博时基金互联网金融部架构师 、曾志 博时基金互联网金融部开发主管
随着近两年业绩的抢眼，公募基金迎来了乘风破浪式的发展，截至 2021 年 1 月底，资产管理规模已破 20 万亿，创下了历史新高。

在中国新经济高质量及科技创新发展的背景下，众多金融类的互联网平台与基金公司展开合作。互联网金融科技与传统金融业务的融合，促使传统金融公司的信息技术系统更加开放。

据此，2020 年，博时基金互联网金融部启动了互联网开放平台 Matrix 的建设工作。

# 博时基金互联网开放平台 Matrix 建设背景与目标
## 1、传统金融架构遇到的问题与挑战
传统的金融系统架构受到了互联网化的挑战，主要表现在以下几个方面：

1) 互联网入口缺乏管控

有多个团队提供不同形式的互联网服务，接口协议和权限管控方式不一致。当服务和接口越来越多时，API 管控能力不足的问题将会突显。

2) 系统较为封闭，开放能力不足

传统基金行业系统生态较为封闭，与合作伙伴开放生态的能力有待提升。

3) 金融场景化封装能力不足

传统基金行业系统普遍依赖于底层数据库提供的 ACID 特性实现事务一致性。微服务化之后，这套机制对金融场景化的产品包装能力显得捉襟见肘。
## 2、系统建设目标
1）多渠道统一安全接入

为自有系统与运营厂商提供标准化统一接入，实现内外部 API 统一的管控。

Matrix 开放给经过博时互联网平台资质认证后的第三方平台使用，需要根据第三方平台识别的不同身份，进行接口级别权限管控。

2）提供开放能力

搭建开放平台，与合作伙伴共建开放生态。在得到 Matrix 平台的授权后，第三方平台开发者可以通过调用博时基金互联网开放平台的接口能力，为第三方平台提供基金产品信息查询、注册开户、积分兑换、基金申赎、资产查询、联合登录等全方位服务；第三方平台可以根据自身实际情况自由选择或组合 APP 、微信公众号、微信小程序、H5 等前端方式对接。
3）封装基金行业特色功能

应用层实现分布式事务框架以保证整体事务的一致性。基于此，封装优惠购、投资陪伴等复杂的金融场景化功能，让开发者专注于业务开发，提升客户的投资体验。
# Matrix 建设思路
## 1、总体架构
1）互联网架构图

基于 Spring Cloud 微服务套件和 RocketMQ 消息中间件，搭建的企业级云原生架构。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488606931-63b03bd1-64b1-478f-981a-55d3b43b3cac.png#clientId=u18583d16-efd9-4&from=paste&id=u9627624a&originHeight=485&originWidth=866&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u05850bd7-1f51-48ed-b4d1-4541cf1444c&title=)
## 2、关键组件
1）API 网关

API 网关是微服务架构重要组件之一，是服务唯一入口。API 网关封装内部系统架构，横向抽离通用功能，如：权限校验、熔断限流、负载均衡等。通过 API 网关可以把内部 API 统一管控起来。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488608635-7cf14e1e-0336-430d-b6ac-0810dbd663d0.png#clientId=u18583d16-efd9-4&from=paste&id=ueac8e770&originHeight=389&originWidth=866&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8234c0db-ce6a-466d-ad01-abc4222b59c&title=)

目前博时基金的互联网业务接入入口主要分为 3 类：

- 面向自营业务的博时基金移动端 APP 和 H5 。
- 面向合作伙伴的 OpenAPI 。即作为开放平台的入口，服务的 OpenAPI 会提供有条件的访问限制（时间、流量、频率），需要考虑流量控制、安全认证、接口授权方面的管理。
- 面向企业内部管理系统的 API ，提供企业内部系统访问。

Matrix 的 API 网关基于 Spring Cloud Gateway 构建，SCG 内置的 Route、Predicate 和 Filter 模块可以方便扩展出路由转发、统一鉴权等跨横切面的功能。基于内外部网络隔离的需求，我们独立部署了两套网关，其中 Kylin 网关提供互联网接入。Phoenix 网关用于域内系统接入，提供域账户的访问权限控制。

2）认证中心

为了保护 OpenAPI 的安全，避免恶意访问、未授权访问、黑客攻击等导致的安全隐患，开放平台需要增加授权认证模块。同时，在博时的内部的应用系统之间，也有单点登录的需求。统一的认证中心是微服务架构的必备组件。
Matrix 基于 OAuth2 协议构建了统一认证中心，实现用户、应用、接口的统一认证和鉴权。OAuth2 核心思路是通过各类认证手段认证用户身份，并颁发 Token ，使得第三方应用可以使用该令牌在限定时间、限定范围访问指定资源。Matrix 支持 OAuth2 的 Authorization Code 、Resource Owner Credentials 和 Client Credentials 三种授权类型，根据不同的应用场景，采用不同的授权类型颁发 Token ，为开放平台的安全保驾护航。
3）RocketMQ 消息中间件
**技术选型**
在技术选型过程中，我们主要考虑以下几点：
首先必须是国产化的产品，其次是比较流行并且社区活跃度高的开源产品。
另外，重点关注的 MQ 特性：

- 消息可靠传递，即确保不丢消息。
- 分布式事务，需要支持分布式事务，降低业务的复杂性。
- 性能，我们的场景主要是在线的金融类业务，需要 MQ 具备支持金融级的低延迟特性。

最后，从架构演进的角度来考虑，需要无缝对接我们的混合云架构，最终我们选择了 RocketMQ。
RocketMQ 是阿里巴巴自主研发及双 11 交易核心链路消息产品，提供金融级高可靠消息服务。在开源方面，开源 RocketMQ 已经完成了云原生技术栈的集成，包括Knative 中的事件源，Prometheus 的 Exporter，K8s 的 Operator 等；也支持了微服务框架 SpringCloud 以及函数计算框架 OpenWhisk ；同时开发了很多 Connector 作为 Sink 或者 Source 去连接了 ELK、Flume、Flink、Hadoop 等大数据和数据分析领域的优秀开源产品。

## 在 Matrix 开放平台，RocketMQ 主要有三类应用场景。
1) 用于金融产品的场景化包装

业务场景：

典型的业务场景如优惠购，基民通过优惠购功能申购基金，可将交易费率降为0。简单来说就是先购买博时货币基金，再通过快速转购的方式买入目标基金，豁免相关转换费率。
实现原理：

Matrix 基于 RocketMQ 的事务消息搭建了一个高可靠、高可用的事务消息平台---事务中心，涉及业务流程如下：
第一阶段是 Prepare ，即业务系统将 RocketMQ 的半事务消息发送到事务中心，事务中心不做发布，等待二次确认。Prepare 完成之后，业务系统执行主事务，即购买货币基金，成功后 commit 到事务中心，由事务中心投递消息到从事务。如果主事务失败，就投递 rollback 给事务中心。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488607037-228141d8-d120-4763-bbef-a6fcd23aa207.png#clientId=u18583d16-efd9-4&from=paste&id=uedee76cc&originHeight=527&originWidth=806&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u99b3c696-3b2d-4e32-8781-0b951070791&title=)
反查机制：

由于网络抖动、业务系统重启等原因，可能导致事务消息的二次确认丢失。此时需要依赖反查机制恢复整个分布式事务的上下文。RocketMQ 提供的 Message Status Check 机制正是为解决分布式事务中的超时问题而设计的。事务中心的反查机制流程主要是，先检查事务中心的内部状态，再通过反查接口检查本地事务的执行结果，恢复事务上下文后，正常推进后续的流程。
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488606976-abc24b7c-8e0b-4821-b8ad-b577bf3c5e62.png#clientId=u18583d16-efd9-4&from=paste&id=ua46ae4cc&originHeight=529&originWidth=787&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf05913bb-0fc9-4b1b-839a-c860a1dc85d&title=)
依赖于 RocketMQ 提供的事务消息，事务中心在应用层实现了分布式事务，大大提升了对金融产品的场景化包装能力。
2) 用于系统间解耦

业务场景：

部门 A 负责根据市场、产品和客户的陪伴场景输出优质的陪伴内容，部门 B 负责把这些陪伴内容触达到不同的渠道和用户。

实现原理：

部门 A 的陪伴事件触发服务和部门 B 的陪伴触达服务之间通过 RocketMQ 消息进行业务解耦，即双方没有依赖关系，也不必同时在线。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488609338-0a59c2d7-6c57-4ec8-a437-aee5236a6240.png#clientId=u18583d16-efd9-4&from=paste&id=u46cfc9b5&originHeight=554&originWidth=866&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u64351dd5-7d31-41a9-91f5-890502e0310&title=)

3) 异步调用

业务场景：

异步调用的使用场景比较多，如用户注册、用户关键行为跟踪等。其中用户行为跟踪场景，在服务端异步记录用户的关键行为及相关属性，可为用户分等级运营和精准营销打下基础。

实现原理：

将非核心的业务流程异步化可以减少系统的响应时间，提高吞吐量，是系统优化的常用手段。RocketMQ 提供了高效的通信机制，业务系统使用起来非常方便。
# 总结与未来展望
随着互联网技术在金融领域的不断渗透和金融创新业态的发展，公募基金互联网业务需要不断进行流程改造、模式创新及服务能力升级，在优化场景体验的基础上，持续打造基于平台、场景和产品三位一体的互联网服务平台。

Matrix 经过一年多的建设，目前已具备多渠道统一接入、第三方生态互联互通、基金特色交易场景化封装等功能特性。Matrix 通过建设有品质、有温度的陪伴，从技术上和体验上，让用户理解风险，理解投资，进而为客户持续创造价值。

在未来，将会有更多的合作伙伴接入 Matrix ，希望我们能一起畅游在创新科技的星辰大海中，合作共赢。

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)
![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)