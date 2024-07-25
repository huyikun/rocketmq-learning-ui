---
title: "融合数据库生态：利用  EventBridge 构建 CDC 应用"
date: "2022/07/17"
author: "昶风"
img: "https://img.alicdn.com/imgextra/i2/O1CN0113L7eI1xTP5634eVI_!!6000000006444-0-tps-685-383.jpg"
tags: ["practice"]
description: "近期，EventBridge 事件流已经支持了基于阿里云 DTS服务的 CDC 能力。本文将从 CDC、CDC 在 EventBridge 上的应用以及若干最佳实践场景等方面，为大家介绍如何利用 EventBridge 轻松构建 CDC 应用。"
---
## 引言

CDC（Change Data Capture）指的是监听上游数据变更，并将变更信息同步到下游业务以供进一步处理的一种应用场景。近年来事件驱动架构（EDA）热度逐步上升，日渐成为项目架构设计者的第一选择。EDA 天然契合 CDC 的底层基础架构，其将数据变更作为事件，各个服务通过监听自己感兴趣的事件来完成一些列业务驱动。阿里云 EventBridge 是阿里云推出的一款无服务器事件总线服务，能够帮助用户轻松快捷地搭建基于 EDA 架构的应用。近期，EventBridge 事件流已经支持了基于阿里云 DTS**[****1]**服务的 CDC 能力。本文将从 CDC、CDC 在 EventBridge 上的应用以及若干最佳实践场景等方面，为大家介绍如何利用 EventBridge 轻松构建 CDC 应用。

## CDC 概述

### 基本原理与应用场景

CDC 从源数据库捕获增量的数据以及数据模式变更，以高可靠、低延时的数据传输将这些变更有序地同步到目标数据库、数据湖或者其他数据分析服务。目前业界主流的开源 CDC 工具包括 Debezium**[2****]**、Canal**[3****]** 以及 Maxwell**[4****]**。

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1691118122922-25527a11-0176-4b78-94c1-d1e063778663.png#clientId=u73f1d353-8f4c-4&height=646&id=afvnq&originHeight=646&originWidth=716&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub56ae9ec-96b9-4d0d-aec0-1c5a3cd44ee&title=&width=716)

图片来源：[https://dbconvert.com](https://dbconvert.com)

目前业界主要有以下几类 CDC 的实现：

**1. 基于时间戳或版本号**

基于时间戳的方式要求数据库表有一个字段代表更新时间戳，当存在数据插入或更新时，对应时间戳字段就会随之更新。CDC 组件周期性检索更新时间大于上次同步时间的数据记录，即可捕获本周期内数据的变更。基于版本号跟踪和基于时间戳跟踪原理基本一致，要求开发者变更数据时必须更新数据的版本号。

**2. 基于快照**

基于快照的 CDC 实现在存储层面使用到了数据源 3 份副本，分别是原始数据、先前快照和当前快照。通过对比 2 次快照之间的差异来获取这之间的数据变更内容。

**3. 基于触发器**

基于触发器的 CDC 实现方式事实上是在源表上建立触发器将对数据的变更操作（INSERT、UPDATE、DELETE）记录存储下来。例如专门建立一张表记录用户的变更操作，随后创建 INSERT、UPDATE、DELETE 三种类型的触发器将用户变更同步到此表。

**4. 基于日志**

以上三种方式都对源数据库存在一定侵入性，而基于日志的方式则是一种非侵入性的 CDC 方式。数据库利用事务日志实现灾备，例如 MySQL 的 binlog 就记录了用户对数据库的所有变更操作。基于日志的 CDC 通过持续监听事务日志来实时获取数据库的变化情况。

CDC 的应用场景广泛，包括但不限于这些方面：异地机房数据库同步、异构数据库数据同步、微服务解耦、缓存更新与 CQRS 等。

### 基于阿里云的 CDC 解决方案：DTS

数据传输服务 DTS（Data Transmission Service）是阿里云提供的实时数据流服务，支持关系型数据库（RDBMS）、非关系型的数据库（NoSQL）、数据多维分析（OLAP）等数据源间的数据交互，集数据同步、迁移、订阅、集成、加工于一体。其中，DTS 数据订阅**[****5****]**功能可以帮助用户获取自建 MySQL、RDS MySQL、Oracle 等数据库的实时增量数据。

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1691118122961-c640e15e-a1f0-4867-9aa6-97315c3a5f78.png#clientId=u73f1d353-8f4c-4&height=614&id=ZaBEK&originHeight=614&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4a428208-65fd-4e29-93dd-5e927e6a417&title=&width=1080)

## CDC 在EventBrige上的应用

阿里云 EventBridge 提供了事件总线**[6****]**与事件流**[7****]** 2 款不同应用场景的事件路由服务。

事件总线底层拥有事件的持久化能力，可以按照需要将事件路由到多个事件目标中。

事件流适用于端到端的流式数据处理场景，对源端产生的事件实时抽取、转换和分析并加载至目标端，无需创建事件总线，端到端转储效率更高，使用更轻便。

为了更好地支持用户在 CDC 场景下的需求，EventBridge 在事件流源端支持了阿里云 DTS 的数据订阅功能，用户仅需简单配置，即可将数据库变更信息同步到 EventBridge 事件流。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1691118122543-33919504-8e68-4a6f-a652-2d7cb6fbd363.gif#clientId=u73f1d353-8f4c-4&height=1&id=JOeS7&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1f5d8ad0-72e3-468a-9114-9544e267cd1&title=&width=1)

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1691118122883-1f53bbf5-83df-4947-9c2a-e614dcdf9c7a.png#clientId=u73f1d353-8f4c-4&height=407&id=xlUd1&originHeight=407&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u55aa3122-8b8f-46fb-810f-43e606a7fac&title=&width=1080)

EventBridge 定制了基于 DTS sdk 的 DTS Source Connector。当用户配置事件提供方为 DTS 的事件流时，source connector 会实时地从 DTS 服务端拉取 DTS record 数据。数据拉取到本地后，会进行一定的结构封装，保留 id、operationType、topicPartition、beforeImage、afterImage 等数据，同时增加 streaming event 所需要的一些系统属性。

DTS Event 样例可参考 EventBridge 官方文档![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1691118122549-bca69239-5585-4222-a063-ce76c531c64e.gif#clientId=u73f1d353-8f4c-4&height=1&id=LIkn1&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue1a895a4-a56b-4fb1-8f52-beb64b4ae77&title=&width=1)

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1691118123464-5844da09-ca38-46eb-bde5-bcc2e6024434.png#clientId=u73f1d353-8f4c-4&height=755&id=ene0M&originHeight=755&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2e5fde4f-ec73-44e9-a6be-09e1ad17134&title=&width=1080)

EventBridge Streaming 保证了 DTS 事件的顺序性，但存在事件重复投递的可能性，EventId 在保证了和每条 DTS record 的一一映射关系，用户可依据此字段来对事件做幂等处理。

### 创建源为 DTS 的 EventBridge 事件流

下面展示如何在 EventBridge 控制台创建源为 DTS 的事件流

- **前期准备**** **

1. 开通 EventBridge 服务；

2. 创建 DTS 数据订阅任务；

3. 创建用于消费订阅数据的消费组账号信息。

- **创建事件流**** **

1. 登陆 EventBridge 控制台，点击左侧导航栏，选择“事件流”，在事件流列表页点击“创建事件流”；

2. “基本信息”中“事件流名称”与“描述”按照需要填写即可；

3. 在创建事件流，选择事件提供方时，下拉框选择“数据库 DTS”；

4. 在“数据订阅任务”一栏中选择已创建的 DTS 数据订阅任务。在消费组一栏，选择要使用哪个消费组消费订阅数据，同时填写消费组密码与初始消费时间。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1691118123354-eb1dec72-a916-459f-9e2b-59d5f5a9b1b2.gif#clientId=u73f1d353-8f4c-4&height=1&id=z8qYR&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0a6fa307-ac20-4539-b5b1-c2949fe7ab6&title=&width=1)

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1691118123724-d97a7bfb-13f8-410d-89c7-88b8dad00a66.png#clientId=u73f1d353-8f4c-4&height=1402&id=OBMwW&originHeight=1402&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub52a3c52-1b13-41fd-b505-b9ef6979d42&title=&width=1080)

5. 事件流规则与目标按照需要填写，保存启动即可创建以 DTS 数据订阅为事件源的事件流。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1691118124002-7d2ad2c7-6217-4f16-8d23-6adedbef34e1.gif#clientId=u73f1d353-8f4c-4&height=1&id=FmyL6&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uce5d06cd-3d26-44bd-8185-c7e00c6351f&title=&width=1)

![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1691118123979-5df846cc-f029-432d-b81a-c9f299d2d109.png#clientId=u73f1d353-8f4c-4&height=289&id=oeJQ9&originHeight=289&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0ef530d0-1e83-4ba2-a68f-74a81c3f3b2&title=&width=1080)

### 注意事项 

使用时有以下几点需要注意：

1. EventBridge 使用的是 SUBSCRIBE 消费模式**[8****]**，所以请保证当前 DTS 消费组没有其他客户端实例在运行。如果设置的消费组在之前有运行，则传入的位点失效，会基于此消费组上次消费过的位点继续消费；

2. 创建 DTS 事件源时传入的位点仅在新消费组第一次运行时起效，后续任务重启后会基于上次消费位点继续消费；

3. EventBridge 事件流订阅 OperationType 为 INSERT、DELETE、UPDATE、DDL 类型的 DTS 数据；

4. 使用 DTS  事件源可能会有消息重复，即保证消息不丢，但无法保证仅投递一次，建议用户做好幂等处理；

5.用户如果需要保证顺序消费，则需要将异常容忍策略设置为“NONE”，即不容忍异常。在这种情况下，如果事件流目标端消费消息异常，整个事件流将暂停，直至恢复目标端正常。

## 最佳实践示例

### 基于EventBridge 实现 CQRS

在 CQRS（Command Query Responsibility Segregation）模型中，命令模型用于执行写以及更新操作，查询模型用于支持高效的读操作。读操作和写操作使用的数据模型存在一定区别，需要使用一定方式保证数据的同步，基于 EventBridge 事件流的 CDC 可以满足这样的需求。

基于云上服务，用户可以使用如下方式轻松构建基于 EventBridge 的 CQRS：

1. 命令模型操作数据库进行变更，查询模型读取 elasticsearch 获取数据；

2. 开启 DTS 数据订阅任务，捕获 DB 变更内容；

3.配置 EventBridge 事件流，事件提供方为 DTS 数据订阅任务，事件接收方为函数计算 FC；

4. FC 中的服务即为更新 elasticsearch 数据操作。

![7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1691118123833-37c4e58e-e8cd-459b-8127-414bdbe797ff.png#clientId=u73f1d353-8f4c-4&height=747&id=LPMMS&originHeight=747&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u51d80149-a653-4df6-acb9-290a5a18edf&title=&width=1080)

### 微服务解耦

CDC 也可以用于微服务解耦。例如下文是一个电商平台的订单处理系统，当有新建的未付款订单产生时，数据库会有一条 INSERT 操作，而当某笔订单状态由“未付款”变为“已付款”时，数据库会有一条 UPDATE 操作。根据订单状态变化的不同，后端会有不同的微服务来对此进行处理。

1. 用户下单/付款，订单系统进行业务处理，将数据变更写入 DB；

2. 新建 DTS 订阅任务捕获 DB 数据变更；

3. 搭建 EventBridge 事件流。事件提供方为 DTS 数据订阅任务，事件接收方为 RocketMQ；

4. 在消费 RocketMQ 数据时，同一个 topic 下启用 3 个 group 代表不同的业务消费逻辑；

a. GroupA 将捕获到的 DB 变更用户缓存更新，便于用户查询订单状态；

b. GroupB 下游关联财务系统，仅处理新建订单，即处理 DB 操作类型为 INSERT 的事件，丢弃其余类型事件；

c. GroupC 仅关心订单状态由“未付款”变为“已付款”的事件，当有符合条件事件到达时，调用下游物流、仓储系统，对订单进行进一步处理。

如果采用接口调用方式，那么用户在下单之后订单系统将分别需要调用缓存更新接口、新建订单接口以及订单付款接口，业务耦合性过高。除此之外，这种模式使得数据消费端不用担心上游订单处理接口返回内容的语义信息，在存储模型不变的情况下，直接从数据层面判断此次数据变更是否需要处理以及需要怎样的处理。同时，消息队列天然的消息堆积能力也可以帮助用户在订单峰值到来时实现业务削峰填谷。

事实上，目前 EventBridge Streaming 支持的消息产品还包括 RabbitMQ、Kafka、MNS 等，在实际操作中用户可以根据自己的需要进行选择。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1691118124425-1b8ab8a1-8d13-4971-9f6a-d9ecfc029091.gif#clientId=u73f1d353-8f4c-4&height=1&id=XZVmg&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5999f87a-38cd-43ec-a2b1-9dc871f8e79&title=&width=1)

![8.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1691118124629-d2aa1b3e-1e76-48b5-ba12-de5999fbe6c4.png#clientId=u73f1d353-8f4c-4&height=381&id=GxPxD&originHeight=381&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf6b45a3d-476c-4632-bbac-49d15be8fa3&title=&width=1080)

### 数据库备份&异构数据库同步

数据库灾备和异构数据库数据同步也是 CDC 重要的应用场景。使用阿里云 EventBridge 亦可以快速搭建此类应用。

1. 新建 DTS 数据订阅任务，捕获用户 MySQL 数据库变更；

2. 搭建 EventBridge 事件流，事件提供方为 DTS 数据订阅任务；

3. 使用 EventBridge 在目的数据库执行指定 sql，实现数据库备份；

4. 数据变更事件投递到函数计算，用户业务根据数据变化内容更新对应异构数据库。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1691118124571-79a622f0-ba98-4f2d-b6c9-faa37f801b12.gif#clientId=u73f1d353-8f4c-4&height=1&id=eUIs5&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua83d1fc3-c229-4f50-b76f-2b56d8fdb97&title=&width=1)

![9.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1691118124730-70c887c8-0aa0-47ca-a7d6-f151adb8e3d5.png#clientId=u73f1d353-8f4c-4&height=530&id=AzNZ3&originHeight=530&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf0e6e988-7eea-4542-b855-ddd42ace021&title=&width=1080)

### 自建 SQL 审计

对于用户有自建 SQL 审计的需求，使用 EventBridge 也可以轻松实现。

1. 新建 DTS 数据订阅任务，捕获数据库变更；

2. 搭建 EventBridge 事件流，事件提供方为 DTS，事件接收方为日志服务 SLS；

3. 用户需要对 SQL 进行审计时，通过查询 SLS 进行。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1691118124858-6f87d929-1211-4ae4-92af-507625752dcc.gif#clientId=u73f1d353-8f4c-4&height=1&id=q0KS1&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue3daafde-06cb-4a2b-8a11-28b05280de6&title=&width=1)

![10.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1691118124946-dd839503-ee8b-4493-bf33-0e2e9f5bf39f.png#clientId=u73f1d353-8f4c-4&height=629&id=O9NQx&originHeight=629&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uca5c3a0d-9c2b-42f5-840f-69645723377&title=&width=1080)

## 总结


本文介绍了 CDC 的一些概念、CDC 在 EventBridge 上的应用以及若干最佳实践场景。随着支持产品的不断增加，EventBridge 所承载的生态版图也不断扩大，从消息生态到数据库生态，从日志生态到大数据生态，EventBridge 不断扩大其适用领域，巩固云上事件枢纽的地位，此后也将按照这个方向继续发展，技术做深，生态做广。

_**参考链接：**_

_[1] DTS：_[_https://www.aliyun.com/product/dts_](https://www.aliyun.com/product/dts)

_[2] Debezium：_[_https://debezium.io/_](https://debezium.io/)

_[3] Canal：_[_https://github.com/alibaba/canal_](https://github.com/alibaba/canal)

_[4] Maxwell：_[_https://github.com/zendesk/maxwell_](https://github.com/zendesk/maxwell)

_[5] DTS 数据订阅：_[_https://help.aliyun.com/document_detail/145716.html_](https://help.aliyun.com/document_detail/145716.html)

_[6] 事件总线：_[_https://help.aliyun.com/document_detail/163897.html_](https://help.aliyun.com/document_detail/163897.html)

_[7] 事件流：_[_https://help.aliyun.com/document_detail/329940.html_](https://help.aliyun.com/document_detail/329940.html)

_[8] SUBSCRIBE 消费模式：_[_https://help.aliyun.com/document_detail/223371.html_](https://help.aliyun.com/document_detail/223371.html)

感兴趣的小伙伴们可以扫描下方二维码加入钉钉群讨论（群号：44552972）

![11.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1691118125400-69c199d4-2f5a-48b2-9457-40a2cac2205c.png#clientId=u73f1d353-8f4c-4&height=150&id=AEOYu&originHeight=804&originWidth=802&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u70e13794-7e35-4b54-a958-e301c2fdf37&title=&width=150)

点击[此处](https://www.aliyun.com/product/aliware/eventbridge)，进入 EventBridge 官网了解更多信息～

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)