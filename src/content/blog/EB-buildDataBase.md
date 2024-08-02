---
title: "基于 EventBridge  构建数据库应用集成"
date: "2022/04/13"
author: "赵海"
img: "https://img.alicdn.com/imgextra/i4/O1CN01DTOjFH1Xnqkj0jHjm_!!6000000002969-0-tps-685-383.jpg"
tags: ["practice"]
description: "本文重点介绍 EventBridge 的新特性：数据库 Sink 事件目标。"
---

## 引言

事件总线 EventBridge 是阿里云提供的一款无服务器事件总线服务，支持将阿里云服务、自定义应用、SaaS 应用以标准化、中心化的方式接入，并能够以标准化的 CloudEvents 1.0 协议在这些应用之间路由事件，帮助您轻松构建松耦合、分布式的事件驱动架构。事件驱动架构是一种松耦合、分布式的驱动架构，收集到某应用产生的事件后实时对事件采取必要的处理，然后路由至下游系统，无需等待系统响应。使用事件总线 EventBridge 可以构建各种简单或复杂的事件驱动架构，以标准化的 CloudEvents 1.0 协议连接云产品和应用、应用和应用等。[更多 EventBridge 介绍参考**[****1]**](https://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247523210&idx=1&sn=3f1f479023b5054d2c66843907c95c8a&scene=21#wechat_redirect)[《EventBridge 事件总线及 EDA 架构解析》](http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247523210&idx=1&sn=3f1f479023b5054d2c66843907c95c8a&chksm=fae69045cd911953be7225644680deccdeca11ccdd3ca18dcf36416302c9ca67ccb532516f21&scene=21#wechat_redirect)

事件目标（Target）负责事件的处理终端与消费事件，是 EventBridge 的核心模块。针对市场上其他云厂商和垂直领域的 DB 服务，EventBridge 发布基于事件目标模块的数据库 Sink，提供简单且易于集成的 DB 落库能力，帮助开发者更加高效、便捷地实现业务上云。

## 数据库 Sink 概述

![640 - 2022-04-14T135929.496.png](https://img.alicdn.com/imgextra/i2/O1CN01Hv8pso1Oh8XwRnSZg_!!6000000001736-0-tps-1080-656.jpg)
数据库 Sink 事件目标是 EventBridge 支持的事件目标的一种，主要能力是通过 EventBridge 将数据投递至指定数据库表中。

得益于 EventBridge 生态体系，数据库 Sink 支持众多接入方式：

- 阿里云云产品事件，EventBridge 支持云服务总线，通过简单配置即可直接对云服务相关事件进行入库操作；
- SaaS 应用事件，EventBridge 支持三方 SaaS 事件接入，支持对 SaaS 触发事件落库、查询；
- 用户自定义应用，用户可以使用 EventBridge 官方的 API 接口、多语言客户端、HTTP Source 以及 CloudEvents 社区的开源客户端来完成接入。

数据库 Sink 能力重点聚焦在如何将 EventBridge 业务的半结构化 Json 数据转为结构化 SQL 语句，提供 LowCode 交互接入，帮助开发者一站式完成数据入库。

![640 - 2022-04-14T140005.286.png](https://img.alicdn.com/imgextra/i4/O1CN01WCBkrU1W9GB2D1cE9_!!6000000002745-0-tps-1080-272.jpg)
## 数据库 Sink 最佳实践


###  典型案例：

- 希望把一些 MNS 的消费消息或者 RocketMQ 的消费消息存储到指定的数据库表中，方便后面的数据分析和消息排查，也可以通过这种方式把数据新增到数据库表中；
- 通过 HTTP 的事件源把一些重要的日志或者是埋点数据直接存储到 DB 中，不需要经过用户业务系统，可以方便后续的客户场景分析。

### 使用介绍：

首先现阶段数据库 Sink For MySQL 支持两种方式：一种是基于阿里云的 **RDS MySQL（VPC）**，另一种是用户**自建的 MySQL（公网）**，可根据业务场景选择的不同方式接入。

#### **步骤一 ：点击事件规则并创建事件规则**
![640 - 2022-04-14T140043.033.png](https://img.alicdn.com/imgextra/i1/O1CN01JIrBA71t29BmkKGwr_!!6000000005843-2-tps-1080-219.png)

#### **步骤二 ：选择事件源**


可以选择阿里云官方或者自定义事件源

<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491415559-c42e8240-8660-4a49-8894-8914bd93d8d7.gif#clientId=u0e920f6f-ad33-4&height=1&id=mKypm&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc3ab7b90-e9f7-428d-b3b4-76b82750391&title=&width=1) -->
![640 - 2022-04-14T140056.156.png](https://img.alicdn.com/imgextra/i3/O1CN01G9EFze1njIoUU4XDx_!!6000000005125-2-tps-1080-292.png)
#### **步骤三 ：选择事件目标**


1）在事件目标下面的服务类型选择数据库，这时会有两个选项就是一个是阿里云的 RDS MySQL，一个是自建 MySQL；

![640 - 2022-04-14T140119.900.png](https://img.alicdn.com/imgextra/i4/O1CN017OcLJN1wE0I0cEjI6_!!6000000006275-2-tps-1080-485.png)

2）如果是阿里云 RDS MySQL，需要创建服务的关联角色。

![640 - 2022-04-14T140133.244.png](https://img.alicdn.com/imgextra/i4/O1CN019mLXDV1QI46462GHb_!!6000000001952-2-tps-597-108.png)

3）授权以后就可以选择用户自己创建的 RDS MySQL 数据库的实例 ID 和数据库名称。

数据库账号和密码需手动填写，并发配置可以根据实际业务需要进行填写。因为 RDS MySQL 涉及到了跨地域访问，所以需要专有网络 VPC 的支持。

#### **步骤四 ：入库配置**


入库配置支持**快速配置**与**自定义 SQL** 两种方式：

1）快速配置，支持 LowCode 方式快速选择入库内容。

<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491435504-9b0d00e8-d72d-4b3e-a06b-575bd9a3f0ab.gif#clientId=u0e920f6f-ad33-4&height=1&id=l7a8p&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=udac15dd3-3648-45dc-82b5-90e23f4378c&title=&width=1) -->
![640 - 2022-04-14T140150.795.png](https://img.alicdn.com/imgextra/i4/O1CN01oupZhL1rQlF83xz0L_!!6000000005626-2-tps-1080-428.png)

2）自定义 SQL，支持自定义高级 SQL 语法。

<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491437553-750eafa9-fdc4-4d05-9fd9-412914f01ea3.gif#clientId=u0e920f6f-ad33-4&height=1&id=q9AJo&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud9df0da2-02dc-4ec9-b5a7-c8881f9dd27&title=&width=1) -->
![640 - 2022-04-14T140206.829.png](https://img.alicdn.com/imgextra/i2/O1CN016TwE101GZKsHnj8ig_!!6000000000636-2-tps-1080-281.png)
#### **步骤五：事件发布**


当创建成功以后可以通过控制台进行事件发布：
![640 - 2022-04-14T140224.657.png](https://img.alicdn.com/imgextra/i3/O1CN01NSndqM1V78j954pEE_!!6000000002605-2-tps-633-612.png)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491437655-874bf9cd-8ca3-4950-82ae-51a93d13e430.gif#clientId=u0e920f6f-ad33-4&height=1&id=hKS2v&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc3859405-7b4b-4952-8289-4dbfd4bb233&title=&width=1) -->
#### **步骤六 ：事件状态追踪和查询**


可以通过上个步骤中的事件 ID 可看到轨迹的详细信息，包括事件执行成功与否等信息。如果事件执行失败，会在页面展示异常信息。

通过事件追踪也可以看到详细的事件轨迹 ：

![640 - 2022-04-14T140243.222.png](https://img.alicdn.com/imgextra/i4/O1CN01O0GBua1X1lJCywxIb_!!6000000002864-0-tps-1080-444.jpg)

## 总结

本文重点介绍 EventBridge 的新特性：数据库 Sink 事件目标。

作为一款无服务器事件总线服务，EventBridge 已经将阿里云云产品管控链路数据和消息产品业务数据整合到事件源生态中，提高了上云用户业务集成的便捷性，满足 Open API 与多语言 sdk 的支持，在此基础之上，通过 EventBridge 将数据投递至指定的数据库表中，为客户自身业务接入 EventBridge 提供了便利。

## 相关链接


[1] [更多 EventBridge 介绍](https://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247523210&idx=1&sn=3f1f479023b5054d2c66843907c95c8a&scene=21#wechat_redirect)
[_https://developer.aliyun.com/article/878927_](https://developer.aliyun.com/article/878927)


[2] RDS 官方文档
[_https://www.aliyun.com/product/rds/mysqlspm=5176.14414305.J_8058803260.32.267f5960ZjKXR3_](https://www.aliyun.com/product/rds/mysqlspm=5176.14414305.J_8058803260.32.267f5960ZjKXR3)

[3] EventBridge 官方文档
[_https://help.aliyun.com/product/161886.html_](https://help.aliyun.com/product/161886.html)


想要了解更多 EventBridge 相关信息，扫描下方二维码加入钉钉群～

![640 - 2022-04-14T140328.772.png](https://img.alicdn.com/imgextra/i4/O1CN01L0gsCV1F2WtC4vMMP_!!6000000000429-0-tps-1080-1412.jpg)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://img.alicdn.com/imgextra/i4/O1CN01Xi1rcu1DM6aIC7ypz_!!6000000000201-0-tps-1920-675.jpg)