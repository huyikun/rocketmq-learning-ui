---
title: "EventBridge 生态实践：融合  SLS 构建一体化日志服务"
date: "2022/10/24"
author: "昶风"
img: "https://img.alicdn.com/imgextra/i3/O1CN01o5TDKB248yjMSU48d_!!6000000007347-0-tps-685-383.jpg"
tags: ["practice"]
description: "本文将从 SLS 在 EventBridge上 的使用以及若干最佳实践场景等方面，为大家介绍如何基于 EventBridge 构建 SLS 相关应用。"
---
## 引言


阿里云日志服务 SLS 是一款优秀的日志服务产品，提供一站式地数据采集、加工、查询与分析、可视化、告警、消费与投递等服务。对于使用 SLS 的用户业务而言，SLS 上存储的日志信息反映着业务的运行状态，通过适当地流转加工即可创建一定价值。

另一方面，阿里云 EventBridge 作为云上事件枢纽，每天承载着大量事件的流转。云上资源的操作事件、消息队列中的数据、用户业务中的自定义事件等，是否有一站式的配置工具来将这些数据统一收敛到 SLS，进而使用 SLS 强大的加工、分析能力也是一个具有价值的问题。

为了支持上述日志、数据流入流出 SLS 的场景，阿里云 EventBridge 在近期支持了 SLS 能力。用户在 EventBridge 上通过简单地配置，即可实现数据写入 SLS 和将 SLS 中日志路由到不同的 EventBridge 目标端。EventBridge 对 SLS 的支持是全面的，用户既可以在事件总线中使用 SLS，也可以在事件流中使用。本文将从 SLS 在 EventBridge上 的使用以及若干最佳实践场景等方面，为大家介绍如何基于 EventBridge 构建 SLS 相关应用。

## 基于 EventBridge 使用 SLS


### 阿里云 SLS

日志服务 SLS**[****1]** 是一款云原生观测与分析平台，为 Log、Metric、Trace 等数据提供大规模、低成本、实时的平台化服务，提供数据采集、加工、查询与分析、可视化、告警、消费与投递等功能。

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500746970-627fec1b-e719-4a3b-aa83-162f85c595d1.png#clientId=u747c3400-43a3-4&height=585&id=Jd0W1&name=1.png&originHeight=585&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8aa6da49-dc27-4669-9fef-bc3e7a5d846&title=&width=1080)

### SLS 在 EventBridge 上的应用

阿里云 EventBridge 提供了事件总线**[****2]**与事件流**[****3]**两款不同应用场景的事件路由服务。

事件总线底层拥有事件的持久化能力，可以按照需要将事件经事件规则路由到多个目标。而事件流则更轻量化，对源端产生的事件实时抽取、转换和分析并加载至目标端，无需创建事件总线，端到端转储效率更高，使用更轻便，适用于端到端的流式数据处理场景。SLS 目前对事件总线与事件流均已支持。

针对 SLS 事件源，EventBridge 会构造一个 SLS source connector，其会实时地从 SLS 服务端拉取日志。数据拉取到 EventBridge 后，会进行一定的结构封装，保留用户日志、SLS 系统参数等数据，同时增加 event 所需要的一些系统属性。

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500746950-f69d2ac9-4e1a-47c0-a7b5-6c24117956e7.png#clientId=u747c3400-43a3-4&height=424&id=e1PaN&name=2.png&originHeight=424&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc8204717-0d87-475d-bde3-2e38d55a658&title=&width=1080)

SLS Event 样例可参考如下示例。

data 部分代表用户日志内容，其中以“__”开头和结尾的字段表示日志项的 SLS 系统属性。

{
    "datacontenttype": "application/json;charset=utf-8",
    "aliyunaccountid": "175********6789",
    "data": {
        "key1": "value1",
        "key2": "value2",
        "__topic__": "TopicCategory",
        "__source__": "SourceCategory",
        "__client_ip__": "122.231.***.***",
        "__receive_time__": "1663487595",
        "__pack_id__": "59b662b225779628-0"
    },
    "subject": "acs:log:cn-qingdao:175********6789:project/demoproject/logstore/logstore-1",
    "aliyunoriginalaccountid": "175********6789",
    "source": "test-SLS",
    "type": "sls:connector",
    "aliyunpublishtime": "2022-09-18T07:53:15.387Z",
    "specversion": "1.0",
    "aliyuneventbusname": "demoBus",
    "id": "demoproject-logstore-1-1-MTY2MzExODM5ODY4NjAxOTQyMw==-0",
    "time": "2022-09-18T07:53:12Z",
    "aliyunregionid": "cn-qingdao",
    "aliyunpublishaddr": "10.50.132.112"
}


针对 SLS 事件目标，EventBridge 使用 logProducer 将 event 整体作为一个字段投递到 SLS，字段 key 名称为“content”。

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500748753-ceb51377-1030-44d1-a396-6970a3153fca.png#clientId=u747c3400-43a3-4&height=360&id=ggTnU&name=3.png&originHeight=360&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ufeaa0593-a462-49b7-80df-8c0bcdcac6a&title=&width=1080)

### 使用介绍

- **SLS 事件源**
** **

在使用 SLS 作为事件源时（这里包含了事件总线中的事件源和事件流中的事件源），需要提供以下参数：

- 日志项目（SLS Project）
- 日志库（SLS LogStore）
- 起始消费位点
- 调用角色 

在创建 SLS 事件源时，EventBridge 会自动在对应 LogStore 下创建一个以“eventbridge-”开头的消费组，事件源或事件流被删除时，对应消费组资源也会被清理。

日志项目与日志库参数，用户根据已创建的 Project 和 LogStore 去填写即可。

起始消费位点参数指定了新任务启动时的初始消费位点。这里可以选择“最早位点”、“最新位点”与“指定时间”。“最早位点”即从当前 LogStore 中最早的日志开始消费，会导致大量历史日志被读取，建议结合业务谨慎选择；“最新位点”则表示消费对应 EventBridge 任务启动后的日志；“指定时间”需要用户填写时间戳（以秒为单位），消费从此时刻开始的日志。

针对调用角色，其实是允许 EventBridge 以这个角色的身份去调用读取用户 SLS 日志。用户需要创建一个自定义角色，并将其授信给事件总线 EventBridge。角色的权限方面则可以按照需要去进行设置，在权限最小的原则基础上，权限策略提供的角色应保证事件总线 EventBridge 可以读取对应 LogStore 日志与消费组的增删操作，至少赋予角色 LogStore 消费权限与消费组的增删操作。参考示例：


{
  "Version": "1",
  "Statement": [
    {
      "Action": [
        "log:ListShards",
        "log:GetCursorOrData",
        "log:GetConsumerGroupCheckPoint",
        "log:UpdateConsumerGroup",
        "log:ConsumerGroupHeartBeat",
        "log:ConsumerGroupUpdateCheckPoint",
        "log:ListConsumerGroup",
        "log:CreateConsumerGroup",
        "log:DeleteConsumerGroup"
      ],
      "Resource": [
        "acs:log:*:*:project/<指定的project名称>/logstore/<指定的Logstore名称>",
        "acs:log:*:*:project/<指定的project名称>/logstore/<指定的Logstore名称>/*"
      ],
      "Effect": "Allow"
    }
  ]
}


- **SLS 事件目标**
** **

在使用 SLS 作为事件目标时（这里包含了事件总线中的事件目标和事件流中的事件目标），需要提供以下参数：

- 日志项目（SLS Project）
- 日志库（SLS LogStore）
- Topic
- 调用角色 

日志项目、日志库参数含义同 SLS 事件源。Topic 即 SLS 日志主题，用户可以根据需要进行设置，非必填内容。

在创建 SLS 事件目标时，确保使用的调用角色有写入给定日志库权限即可。参考示例：


{
  "Version":"1",
  "Statement":[
    {
      "Effect":"Allow",
      "Action":[
        "log:PostLogStoreLogs"
      ],
      "Resource":[
        "acs:log:*:*:project/<指定的Project名称>/logstore/<指定的Logstore名称>"
      ]
    }
  ]
}


### 使用示例

SLS 事件源和事件目标，其事件总线与事件流的参数配置相同，这里示例了如何创建  SLS 事件源和事件目标的 EventBridge 事件流。

- **前期准备**
** **

1. 开通 EventBridge 服务；
2. 开通 SLS 服务并创建 Project 与 Store。

- **创建 SLS 事件源**
** **

1. 登陆 EventBridge 控制台，点击左侧导航栏，选择“事件流”，在事件流列表页点击“创建事件流”；

2. “基本信息”中“事件流名称”与“描述”按照需要填写即可；

3. 在创建事件流，选择事件提供方时，下拉框选择“日志服务 SLS”；

4. 在“日志服务 SLS”一栏中选配置 SLS Project、LogStore、起始消费位点与角色配置。

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500746973-25f449a5-f3a8-466b-93ac-f63f608d18ae.png#clientId=u747c3400-43a3-4&height=709&id=LCldu&name=4.png&originHeight=709&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u33c0c427-70a4-4fa1-9ef5-9f144ae3bd1&title=&width=1080)

- **创建 SLS 事件目标**
** **

1. 在创建事件流的事件目标时，服务类型选择“日志服务”；

2. 配置 SLS Project、LogStore、日志主题、日志内容、角色配置等参数。

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500746874-df3e7565-e1e8-4898-8568-740680f9f736.png#clientId=u747c3400-43a3-4&height=899&id=dMEDA&name=5.png&originHeight=899&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2168a2dc-cfe0-43d9-b80b-ff260f6be56&title=&width=1080)

3. 保存启动即可创建事件流。

![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500749410-be24f38f-cb73-4a07-bf8c-4aa5f6bfc77b.png#clientId=u747c3400-43a3-4&height=271&id=aRCu5&name=6.png&originHeight=271&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua09a4b3e-a883-43a2-a88b-442b5bae2e4&title=&width=1080)

## 最佳实践示例


### 异步架构完备性校验

在使用消息队列搭建异步应用架构时，会偶发遇到消息丢失的情况，这种情况下的问题排查通常较为麻烦，需要确定问题到底是出在发送端、消费端还是消息队列上，这种场景可以使用 SLS + EventBridge 来进行相关预警和现场保留。

1. 业务 1 发送消息到消息队列，业务 2 异步消费 MQ 中的消息，实现架构解耦；

2. 消息发送端和消费端，在完成消费发送、消费的相关操作后，均将操作日志打印出来，并采集到 SLS 上，日志中可以包含消息 ID 等字段以确保可溯源；

3. 配置 EventBridge 事件流，事件提供方为 SLS，事件接收方为函数计算 FC；

4. FC 中的服务读取 SLS 中日志内容，若发现针对某条消息，若仅有发送日志无消费日志，则说明可能存在漏消息的可能性，需要相关人员及时介入排查。

![7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500749520-535714fd-edc1-48bb-b093-24a11d87da4d.png#clientId=u747c3400-43a3-4&height=717&id=jBuyz&name=7.png&originHeight=717&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ube8570f9-b62b-4184-8bfd-67161ee73da&title=&width=1080)

### 异常业务异步处理

部分消息队列如 RocketMQ 有死信队列能力，当用户消费失败达到一定次数时，消息会被投递到死信队列。用户也可以使用 SLS + EventBridge 构建业务死信队列，以完成对异常情况的处理。

例如下图是一个电商平台的订单处理系统，当订单处理成功时，相关信息会被写入 DB 或者进行后续操作。但如果订单处理异常用户又不想要阻塞现有订单处理流程，则可以将处理异常订单的流程异步处理。

1. 用户下单/付款，订单系统进行业务处理，处理成功则将数据变更写入 DB；

2. 订单处理异常，记录相关信息日志；

3. 搭建 EventBridge 事件规则。事件源为 SLS，事件目标为函数计算 FC；

4. 当有异常业务日志产生时，日志内容被 SLS 事件源拉取，随后投递到 FC，由专门的服务来处理异常订单。当然，在架构设计时也可以将异常订单信息直接投递到函数计算，但对于大部分业务系统而言，当有异常出现时通常都会进行相关日志的打印，即异常日志大概率是存在的，这个时候使用 SLS + EventBridge 则无需再使用函数计算的发送客户端，仅按需打印日志即可，对业务的侵入性更小。

![8.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500750470-2b79afec-09d8-4047-a5b7-c6adcebec44b.png#clientId=u747c3400-43a3-4&height=640&id=cSD5G&name=8.png&originHeight=640&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u74a2082f-d5e4-4f39-8fdd-bfdfac2f7ff&title=&width=1080)

### 消息备份

目前阿里云上的消息队列产品种类丰富，用户在使用消息队列实现业务解耦的同时，也会产生对消息内容进行加工分析的需求。SLS 拥有强大的数据加工能力，使用 EventBridge 将消息路由到 SLS，在实现消息备份的同时也可以利用 SLS 的分析加工能力来提升业务的可观测性。

1. 搭建 EventBridge 事件流。事件提供方为各种云上消息队列，事件目标方为日志服务 SLS；

2. 使用 SLS 的能力完成消息的加工、查询、分析与可视化。

![9.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500750553-fdb39592-da9a-4aaf-8c6a-c863d3cf2462.png#clientId=u747c3400-43a3-4&height=713&id=CQZ0e&name=9.png&originHeight=713&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue63ef95c-2dc1-41d1-a828-7dbc5d15054&title=&width=1080)

### 自建 SQL 审计

目前 EventBridge 已经支持了 DTS 作为事件源的能力，使用 EventBridge 可以轻松实现构建自定义 SQL 审计的需求。

1. 用户新建 DTS 数据订阅任务，捕获数据库变更；

2. 搭建 EventBridge 事件流，事件提供方为 DTS，事件接收方为日志服务 SLS；

3. 用户需要对 SQL 进行审计时，通过查询 SLS 进行。

![10.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500750586-9b12fed5-791f-47fc-bb83-1dae1973964e.png#clientId=u747c3400-43a3-4&height=629&id=LQQuo&name=10.png&originHeight=629&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6b1979e2-149d-4bf7-a8ab-07d3c73523f&title=&width=1080)

## _相关链接_


_[1] 日志服务SLS_
[_https://www.aliyun.com/product/sls_](https://www.aliyun.com/product/sls)

_[2] 事件总线_
[_https://help.aliyun.com/document_detail/163897.html_](https://help.aliyun.com/document_detail/163897.html)

_[3] 事件流_
[_https://help.aliyun.com/document_detail/329940.html_](https://help.aliyun.com/document_detail/329940.html)

感
# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
