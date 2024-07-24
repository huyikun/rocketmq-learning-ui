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

![640 - 2022-04-14T135929.496.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491415667-64f005d5-1366-4a41-a712-d3b3d09f52e1.png#clientId=u0e920f6f-ad33-4&height=656&id=dqSW8&name=640%20-%202022-04-14T135929.496.png&originHeight=656&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub6fd0d63-0102-438b-b2ef-691349320d3&title=&width=1080)
数据库 Sink 事件目标是 EventBridge 支持的事件目标的一种，主要能力是通过 EventBridge 将数据投递至指定数据库表中。

得益于 EventBridge 生态体系，数据库 Sink 支持众多接入方式：

- 阿里云云产品事件，EventBridge 支持云服务总线，通过简单配置即可直接对云服务相关事件进行入库操作；
- SaaS 应用事件，EventBridge 支持三方 SaaS 事件接入，支持对 SaaS 触发事件落库、查询；
- 用户自定义应用，用户可以使用 EventBridge 官方的 API 接口、多语言客户端、HTTP Source 以及 CloudEvents 社区的开源客户端来完成接入。

数据库 Sink 能力重点聚焦在如何将 EventBridge 业务的半结构化 Json 数据转为结构化 SQL 语句，提供 LowCode 交互接入，帮助开发者一站式完成数据入库。

![640 - 2022-04-14T140005.286.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491415665-79f0654a-2464-4ccf-a2f6-e907b5a5869f.png#clientId=u0e920f6f-ad33-4&height=272&id=IvwFe&name=640%20-%202022-04-14T140005.286.png&originHeight=272&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud452624c-66bd-4156-ad42-73694b02a0e&title=&width=1080)
## 数据库 Sink 最佳实践


###  典型案例：

- 希望把一些 MNS 的消费消息或者 RocketMQ 的消费消息存储到指定的数据库表中，方便后面的数据分析和消息排查，也可以通过这种方式把数据新增到数据库表中；
- 通过 HTTP 的事件源把一些重要的日志或者是埋点数据直接存储到 DB 中，不需要经过用户业务系统，可以方便后续的客户场景分析。

### 使用介绍：

首先现阶段数据库 Sink For MySQL 支持两种方式：一种是基于阿里云的 **RDS MySQL（VPC）**，另一种是用户**自建的 MySQL（公网）**，可根据业务场景选择的不同方式接入。

#### **步骤一 ：点击事件规则并创建事件规则**
![640 - 2022-04-14T140043.033.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491435545-876c7d5b-77e1-4222-ae41-abb704523b68.png#clientId=u0e920f6f-ad33-4&height=219&id=lGelG&name=640%20-%202022-04-14T140043.033.png&originHeight=219&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u49391aa2-8123-4500-84e8-ab994acb5c7&title=&width=1080)

#### **步骤二 ：选择事件源**


可以选择阿里云官方或者自定义事件源

![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491415559-c42e8240-8660-4a49-8894-8914bd93d8d7.gif#clientId=u0e920f6f-ad33-4&height=1&id=mKypm&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc3ab7b90-e9f7-428d-b3b4-76b82750391&title=&width=1)![640 - 2022-04-14T140056.156.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491415690-18356ef3-1925-4d3c-9018-afb79669230f.png#clientId=u0e920f6f-ad33-4&height=292&id=DERrq&name=640%20-%202022-04-14T140056.156.png&originHeight=292&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1d77f8f6-32cf-4227-b804-971890ed441&title=&width=1080)
#### **步骤三 ：选择事件目标**


1）在事件目标下面的服务类型选择数据库，这时会有两个选项就是一个是阿里云的 RDS MySQL，一个是自建 MySQL；

![640 - 2022-04-14T140119.900.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491435523-d9ec14de-9f41-4625-8f53-3e969743b3ee.png#clientId=u0e920f6f-ad33-4&height=485&id=jGvuU&name=640%20-%202022-04-14T140119.900.png&originHeight=485&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u84cb9f16-88a7-4657-9e36-10917dd0bb0&title=&width=1080)

2）如果是阿里云 RDS MySQL，需要创建服务的关联角色。

![640 - 2022-04-14T140133.244.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491435537-36a814ad-70ef-42b3-917b-5028363d7b07.png#clientId=u0e920f6f-ad33-4&height=108&id=oxZhq&name=640%20-%202022-04-14T140133.244.png&originHeight=108&originWidth=597&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u356a2c82-d517-4227-a3f5-c3e25d6a4eb&title=&width=597)

3）授权以后就可以选择用户自己创建的 RDS MySQL 数据库的实例 ID 和数据库名称。

数据库账号和密码需手动填写，并发配置可以根据实际业务需要进行填写。因为 RDS MySQL 涉及到了跨地域访问，所以需要专有网络 VPC 的支持。

#### **步骤四 ：入库配置**


入库配置支持**快速配置**与**自定义 SQL** 两种方式：

1）快速配置，支持 LowCode 方式快速选择入库内容。

![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491435504-9b0d00e8-d72d-4b3e-a06b-575bd9a3f0ab.gif#clientId=u0e920f6f-ad33-4&height=1&id=l7a8p&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=udac15dd3-3648-45dc-82b5-90e23f4378c&title=&width=1)![640 - 2022-04-14T140150.795.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491437318-a351696b-6dfd-4ce3-94cf-53162bb3fffe.png#clientId=u0e920f6f-ad33-4&height=428&id=BPIfc&name=640%20-%202022-04-14T140150.795.png&originHeight=428&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u65ef4a41-ecc8-4471-ae36-55369547d28&title=&width=1080)

2）自定义 SQL，支持自定义高级 SQL 语法。

![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491437553-750eafa9-fdc4-4d05-9fd9-412914f01ea3.gif#clientId=u0e920f6f-ad33-4&height=1&id=q9AJo&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud9df0da2-02dc-4ec9-b5a7-c8881f9dd27&title=&width=1)![640 - 2022-04-14T140206.829.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491437661-75a00619-d152-4112-9832-561cc6ad34ba.png#clientId=u0e920f6f-ad33-4&height=281&id=pSD1m&name=640%20-%202022-04-14T140206.829.png&originHeight=281&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4c891977-9d0d-4d8f-a34e-8a5fcaa3e11&title=&width=1080)
#### **步骤五：事件发布**


当创建成功以后可以通过控制台进行事件发布：
![640 - 2022-04-14T140224.657.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491437692-e0807373-da49-44dd-809d-8fd8398936e1.png#clientId=u0e920f6f-ad33-4&height=612&id=fs3L2&name=640%20-%202022-04-14T140224.657.png&originHeight=612&originWidth=633&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0eca6129-b13e-43f7-a4a0-e01dc5cee06&title=&width=633)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491437655-874bf9cd-8ca3-4950-82ae-51a93d13e430.gif#clientId=u0e920f6f-ad33-4&height=1&id=hKS2v&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc3859405-7b4b-4952-8289-4dbfd4bb233&title=&width=1)
#### **步骤六 ：事件状态追踪和查询**


可以通过上个步骤中的事件 ID 可看到轨迹的详细信息，包括事件执行成功与否等信息。如果事件执行失败，会在页面展示异常信息。

通过事件追踪也可以看到详细的事件轨迹 ：

![640 - 2022-04-14T140243.222.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491438195-3eefe443-b29b-44c8-84c6-1720d869c455.png#clientId=u0e920f6f-ad33-4&height=444&id=xeU0x&name=640%20-%202022-04-14T140243.222.png&originHeight=444&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue5344db8-2642-4a11-9b01-3799e8ca896&title=&width=1080)

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

![640 - 2022-04-14T140328.772.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491438343-bd4d1a0b-fd95-471d-9df4-4cfda622ffb4.png#clientId=u0e920f6f-ad33-4&height=424&id=we1Gp&name=640%20-%202022-04-14T140328.772.png&originHeight=1412&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1a67102b-ce0f-4f88-8c9e-b89dfa9cfa1&title=&width=324.1676025390625)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)