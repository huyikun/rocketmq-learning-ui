---
title: "RocketMQ-Streams  首个版本发布，轻量级计算的新选择"
date: "2022/02/22"
author: "袁小栋、程君杰"
img: "https://img.alicdn.com/imgextra/i2/O1CN01w7ApJ81fa7oMnJ60X_!!6000000004022-0-tps-685-383.jpg"
tags: ["dynamic"]
description: "RocketMQ-Streams 聚焦「大数据量-&gt;高过滤-&gt;轻窗口计算」场景，核心打造轻资源，高性能优势，在资源敏感场景有很大优势，最低 1Core，1G 可部署。通过大量过滤优化，性能比其他大数据提升 2-5 倍性能。广泛应用于安全，风控，边缘计算，消息队列流计算。"
---

RocketMQ-Streams 聚焦「大数据量->高过滤->轻窗口计算」场景，核心打造轻资源，高性能优势，在资源敏感场景有很大优势，最低 1Core，1G 可部署。通过大量过滤优化，性能比其他大数据提升 2-5 倍性能。广泛应用于安全，风控，边缘计算，消息队列流计算。

RocketMQ-Streams 兼容 Flink 的 SQL，udf/udtf/udaf，将来我们会和 Flink 生态做深度融合，即可以独立运行，也可发布成 Flink 任务，跑在 Flink 集群，对于有 Flink 集群的场景，即能享有轻资源优势，可以做到统一部署和运维。

**01**
## _RocketMQ-Streams 特点及应用场景_


###   RocketMQ-Streams 应用场景

![640.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490352789-60decf13-62cb-45ee-b651-6d0065d79bc4.png#clientId=uf107d51d-3374-4&height=266&id=XIRPM&name=640.png&originHeight=266&originWidth=1068&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5aaa8c04-06f7-440e-af10-7973adc4411&title=&width=1068)

- **计算场景：**适合大数据量->高过滤->轻窗口计算的场景。不同于主流计算引擎，需要先部署集群，写任务，发布，调优，运行这么复杂的过程。RocketMQ-Streams 本身就是一个 lib 包，基于 SDK 写完流任务，可以直接运行。支持大数据开发需要的计算特性：Exactly-ONCE，灵活窗口（滚动、滑动、会话），双流Join，高吞吐、低延迟、高性能。最低 1Core，1G 可以运行。
- **SQL引擎：**RocketMQ-Streams 可视作一个 SQL 引擎，兼容 Flink SQL 语法，支持 Flink udf/udtf/udaf 的扩展。支持 SQL 热升级，写完 SQL，通过 SDK 提交 SQL，就可以完成 SQL 的热发布。

- **ETL引擎：**RocketMQ-Streams 还可视作 ETL 引擎，在很多大数据场景，需要完成数据从一个源经过 ETl，汇聚到统一存储，里面内置了 grok，正则解析等函数，可以结合 SQL 一块完成数据 ETL 。

- 开发 SDK，它也是一个数据开发 SDK 包，里面的大多数组件都可以单独使用，如 Source/sink，它屏蔽了数据源，数据存储细节，提供统一编程接口，一套代码，切换输入输出，不需要改变代码。

###   RocketMQ-Streams 设计思路

![640 (1).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490352855-e3857810-ad51-4d66-b8e6-16afc4eae034.png#clientId=uf107d51d-3374-4&height=604&id=idkj3&name=640%20%281%29.png&originHeight=604&originWidth=748&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u528234e5-56f5-4d04-ab6e-fd066331410&title=&width=748)

**设计目标**

- 依赖少，部署简单，1Core，1G 单实例可部署，可随意扩展规模。
- 实现需要的大数据特性：Exactly-ONCE，灵活窗口（滚动、滑动、会话），双流 Join，高吞吐、低延迟、高性能。
- 实现成本可控，实现低资源，高性能。
- 兼容 Flink SQL，UDF/UDTF，让非技术人员更易上手。


**设计思路**

- 采用 shared-nothing 的分布式架构设计，依赖消息队列做负载均衡和容错机制，单实例可启动，增加实例实现能力扩展。并发能力取决于分片数。
- 利用消息队列的分片做 shuffle，利用消息队列负载均衡实现容错。
- 利用存储实现状态备份，实现 Exactly-ONCE 的语义。用结构化远程存储实现快速启动，不必等本地存储恢复。

###   RocketMQ-Streams 特点和创新
![640 (2).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490354991-4996c9f9-fa56-434e-adfa-a0ac16162905.png#clientId=uf107d51d-3374-4&height=485&id=eD5JV&name=640%20%282%29.png&originHeight=485&originWidth=928&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud7f69971-9845-4d82-a025-67c628e5e37&title=&width=928)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490352589-75a25006-8950-4012-ad52-b93e40f6b978.gif#clientId=uf107d51d-3374-4&height=1&id=OBoX3&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud66e78c0-7043-49bb-976a-8bbe6a9b246&title=&width=1)
**02**
## _RocketMQ-Streams SDK 详解_


###   Hello World

按照惯例，我们先从一个例子来了解 RocketMQ-Streams
![640 (3).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490352756-d6748111-3011-47a0-985e-d06e145dfebb.png#clientId=uf107d51d-3374-4&height=144&id=zi6rQ&name=640%20%283%29.png&originHeight=144&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u36b86828-3be4-4db1-ab59-e7b4ce17d52&title=&width=1080)

- namespace：相同 namespace 的任务可以跑在一个进程里，可以共享配置
- pipelineName：job name
- DataStreamSource：创建 source 节点
- map：用户函数，可以通过实现 MapFunction 扩展功能
- toPrint：结果打印出来
- start：启动任务
- 运行上面代码就会启动一个实例。如果想多实例并发，可以启动多个实例，每个实例消费部分 RocketMQ 的数据。
- 运行结果：把原始消息拼接上“---”，并打印出来


###   RocketMQ-Streams SDK

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490355317-7a8d3946-e223-407c-bc5e-02e7b5f98381.png#clientId=uf107d51d-3374-4&height=263&id=Q4ctj&name=1.png&originHeight=263&originWidth=971&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u49747017-2240-4bfc-9e23-9500232cd2b&title=&width=971)

- StreamBuilder 做为起点，通过设置 namespace，jobName 创建一个 DataStreamSource 。
- DataStreamSource 通过 from 方法，设置 source，创建 DataStream 对象。
- DataStream 提供多种操作，会产生不同的流：
- to 操作产生 DataStreamAction
- window 操作产生 WindowStream 配置 window 参数
- join 操作产生 JoinStream 配置 join 条件
- Split 操作产生 SplitStream 配置 split 条件
- 其他操作产生 DataStream
- DataStreamAction 启动整个任务，也可以配置任务的各种策略参数。支持异步启动和同步启动。

###   RocketMQ-Streams 算子

![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490355485-17bf307f-7e3c-4034-a10f-70abb87e8867.gif#clientId=uf107d51d-3374-4&height=1&id=c9Kod&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5eac9b94-0eb1-4f75-a1ec-b3e52820606&title=&width=1)![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490355585-c7da949a-8f2c-4d53-83ac-a0281db764c3.png#clientId=uf107d51d-3374-4&height=483&id=XVgHd&name=2.png&originHeight=483&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u85604699-39db-4674-b0ab-e98423fbb2b&title=&width=1080)

###   RocketMQ-Streams 算子

SQL 有两种部署模式，1 是直接运行 client 启动 SQL，见第一个红框；2 是搭建 server 集群，通过 client 提交 SQL 实现热部署，见第二个红框。
![640 (4).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490355528-3b906f53-a7c4-4d6c-b428-ba70e68ad8c5.png#clientId=uf107d51d-3374-4&height=291&id=A7hd1&name=640%20%284%29.png&originHeight=291&originWidth=749&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8f789e11-b9f2-41fb-b5f2-4214cc98bbb&title=&width=749)

RocketMQ-Streams SQL 扩展，支持多种扩展方式：


- 通过 FlinkUDF,UDTF,UDAF 扩展 SQL 能力，在 SQL 中通过 create function 引入，有个限制条件，即 UDF 在 open 时未用到 Flink FunctionContext 的内容。
- 通过内置函数扩展 SQL 的函数，语法同 Flink 语法，函数名是内置函数的名称，类名是固定的。如下图，引入了一个 now 的函数，输出当前时间。系统内置了 200 多个函数，可按需引入。

![555.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490356017-2ab86487-6067-4df2-8653-229c892138ab.png#clientId=uf107d51d-3374-4&height=33&id=qsljs&name=555.png&originHeight=33&originWidth=742&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u17c61b58-9701-4e70-966f-56b18aa94a1&title=&width=742)

- 通过扩展函数实现，实现一个函数很简单，只需要在 class 上标注 Function，在需要发布成函数的方法上标注 FunctionMethod，并设置需要发布的函数名即可，如果需要系统信息，前面两个函数可以是 IMessage 和 Abstract，如果不需要，直接写参数即可，参数无格式要求。如下图，创建了一个 now 的函数，两种写法都可以。可以通过 currentTime=now()来调用，会在 Message 中增加一个 key=currentTime，value=当前时间的变量。

![666.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490356016-b408822c-ca6d-4b3f-8318-f09a95903f68.png#clientId=uf107d51d-3374-4&height=235&id=JUB6c&name=666.png&originHeight=235&originWidth=690&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2872a53d-7a8f-42b0-ab22-f615171bdfa&title=&width=690)

- 把现有 java 代码发布成函数，通过策略配置，把 java 代码的类名，方法名，期望用到的函数名，配置进去，把 java 的 jar 包 copy 到 jar 包目录即可。下图是几种扩展的应用实例。

**03**
## _RocketMQ-Streams 架构及原理实现_


###   整体架构

![66.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490356109-e929d918-1cc9-4e3d-9e0f-bd93016eeb79.png#clientId=uf107d51d-3374-4&height=337&id=z34lg&name=66.png&originHeight=337&originWidth=627&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u855eba79-70f9-47ed-a47a-ec8983665a8&title=&width=627)
###   Source 实现

- Source 要求实现最少消费一次的语义，系统通过 checkpoint 系统消息实现，在提交 offset 前发送 checkpoint 消息，通知所有算子刷新内存。
- Source 支持分片的自动负载均衡和容错。
- 数据源在分片移除时，发送移除系统消息，让算子完成分片清理工作。
- 当有新分片时， 发送新增分片消息，让算子完成分片的初始化。
- 数据源通过 start 方法，启动 consuemr 获取消息。
- 原始消息经过编码，附加头部信息包装成 Message 投递给后续算子。

![640 (5).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490356567-3cc377a0-7228-4ea0-ace7-eac7c1333150.png#clientId=uf107d51d-3374-4&height=682&id=W1jmZ&name=640%20%285%29.png&originHeight=682&originWidth=966&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=udac24801-de34-4220-b052-fa7ad354d0b&title=&width=966)

###   Sink 实现

- Sink 是实时性和吞吐的一个结合。
- 实现一个 Sink 只要继承 AbstractSink 类实现 batchInsert 方法即可。batchInsert 的含义是一批数据写入存储，需要子类调用存储接口实现，尽量应用存储的批处理接口，提高吞吐。
- 常规的使用方式是写 Message->cache->flush->存储的方式，系统会严格保证，每次批次写入存储的量不超过 batchsize 的量，如果超了，会拆分成多批写入。

![777.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490356688-26ee8cd9-eb49-4154-b7d3-16d4dbd1b061.png#clientId=uf107d51d-3374-4&height=474&id=shIpK&name=777.png&originHeight=474&originWidth=875&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4e06187d-9001-4dbe-848a-6eaf9767ed4&title=&width=875)

- Sink 有一个 cache，数据默认写 cache，批次写入存储，提高吞吐量。（一个分片一个 cache）。
- 可以开启自动刷新，每个分片会有一个线程，定时刷新 cache 数据到存储，提高实时性。实现类：DataSourceAutoFlushTask 。
- 也可以通过调用 flush 方法刷新 cache 到存储。
- Sink 的 cache 会有内存保护，当 cache 的消息条数>batchSize，会强制刷新，释放内存。

###   RocketMQ-Streams Exactly-ONCE

- Source 确保在 commit offset 时，会发送 checkpoint 系统消息，收到消息的组件会完成存盘操作。消息至少消费一次。
- 每条消息会有消息头部，里面封装了 QueueId 和 offset 。
- 组件在存储数据时，会把 QueueId 和处理的最大 offset 存储下来，当有消息重复时，根据 maxoffset 去重。
- 内存保护，一个 checkpoint 周期可能有多次 flush（条数触发），保障内存占用可控。

![88.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490356708-dea88a97-5b0e-4360-b56b-db9db6266ed1.png#clientId=uf107d51d-3374-4&height=464&id=Gx4LX&name=88.png&originHeight=464&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u31a557c0-faf2-4f58-9532-0a00c557ac4&title=&width=1080)
###   RocketMQ-Streams Window

- 支持滚动，滑动和会话窗口。支持事件时间和自然时间（消息进入算子的时间）。
- 支持高性能模式和高可靠模式，高性能模式不依赖远程存储，但在分片切换时的窗口数据会有丢失。
- 快速启动，无需等本地存储恢复，在发生错误或分片切换时，异步从远程存储恢复数据，同时直接访问远程存储计算。
- 利用消息队列负载均衡，实现扩容缩容，每个 Queue 是一个分组，一个分组同一刻只被一台机器消费。
- 正常计算依赖本地存储，具备 Flink 相似的计算性能。

![99.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490357308-fcccc263-9947-4d52-839a-89b2fb073adc.png#clientId=uf107d51d-3374-4&height=295&id=tDq0k&name=99.png&originHeight=295&originWidth=957&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2a3f0049-7da0-4dcb-8b64-047d1ccb548&title=&width=957)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490357375-5eeeb04f-529d-4c1e-8625-b44b7ff8df2f.gif#clientId=uf107d51d-3374-4&height=1&id=gQVHU&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uad70468b-df10-4385-8b42-c9c20387fb0&title=&width=1)
支持三种触发模式，可以均衡 watermark 延迟和实时性要求
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490357911-8aee21c4-670a-4ae4-821f-b73286381332.gif#clientId=uf107d51d-3374-4&height=1&id=O6LSx&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0fdce307-a232-431a-b4c9-f76b8978936&title=&width=1)![999.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490358056-a577fde8-0a41-4816-a053-b6198c4f667e.png#clientId=uf107d51d-3374-4&height=543&id=vdZB9&name=999.png&originHeight=543&originWidth=794&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue4ea0519-cab3-45cf-ae15-20f890d4128&title=&width=794)
**04**
## _RocketMQ-Streams 在云安全的应用_


###   在安全应用的背景
![640 (6).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490358095-6f3cb9f6-3893-417b-8001-02b17f563791.png#clientId=uf107d51d-3374-4&height=373&id=mvgrG&name=640%20%286%29.png&originHeight=373&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud847df26-269d-47f2-a0f5-e0fcb3faa45&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490357966-80f3c8cf-fc3c-4a3b-a6b9-c3b5fff797b6.gif#clientId=uf107d51d-3374-4&height=1&id=vQntd&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u833e2001-39b4-4931-8388-3945bb7371d&title=&width=1)

- 公共云转战专有云，在入侵检测计算方面遇到了资源问题，大数据集群默认不输出，输出最低 6 台高配机器，用户很难接受因为买云盾增配一套大数据集群。
- 专有云用户升级，运维困难，无法快速升级能力和修复 bug。

###   流计算在安全的应用

- 基于安全特点（大数据->高过滤->轻窗口计算）打造轻量级计算引擎：经过分析所有的规则都会做前置过滤，然后才会做较重的统计，窗口，join 操作，且过滤率比较高，基于此特点，可以用更轻的方案实现统计，join 操作。

![23.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490358128-a2e05f19-0c22-4629-95a8-a919e0767f3a.png#clientId=uf107d51d-3374-4&height=521&id=OjRyq&name=23.png&originHeight=521&originWidth=968&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uda0d77c8-62b8-431b-80b5-67dcd9b757c&title=&width=968)

- 通过 RocketMQ-Streams，覆盖 100%专有云规则（正则，join，统计）。
- 轻资源，内存是公共云引擎的 1/70，CPU 是 1/6，通过指纹过滤优化，性能提升 5 倍以上，且资源不随规则线性增加，新增规则无资源压力。复用以前的正则引擎资源，可支持 95%以上局点，不需要增加额外物理资源。
- 通过高压缩维表，支持千万情报。1000 W 数据只需要 330 M 内存。
- 通过 C/S 部署模式，SQL 和引擎可热发布，尤其护网场景，可快速上线规则。

**05**
## _RocketMQ-Streams 未来规划_
![640 (7).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680490358525-f94be9f8-7447-4b68-ab17-915c383f367e.png#clientId=uf107d51d-3374-4&height=480&id=Wdgii&name=640%20%287%29.png&originHeight=480&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua1a571a0-bbfa-48b0-9759-4a8dedef1f7&title=&width=1080)

新版本下载地址：[_https://github.com/apache/rocketmq-streams/releases/tag/rocketmq-streams-1.0.0-preview_](https://github.com/apache/rocketmq-streams/releases/tag/rocketmq-streams-1.0.0-preview)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)