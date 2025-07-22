---
title: "ApsaraMQ Serverless 能力再升级，事件驱动架构赋能 AI 应用"
description: "ApsaraMQ Serverless 能力再升级，事件驱动架构赋能 AI 应用"
date: "2025-07-22"
category: "article"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

> _<font style="color:rgb(136, 136, 136);">本文整理于 2024 年云栖大会阿里云智能集团高级技术专家金吉祥（牟羽）带来的主题演讲《ApsaraMQ Serverless 能力再升级，事件驱动架构赋能 AI 应用》</font>_
>

![](https://img.alicdn.com/imgextra/i2/O1CN01ynC1ed1isOhEbON9V_!!6000000004468-2-tps-1080-720.png)

<font style="color:rgba(0, 0, 0, 0.9);">云消息队列 ApsaraMQ 全系列产品 Serverless 化，支持按量付费、自适应弹性、跨可用区容灾，帮助客户降低使用和维护成本，专注业务创新。那 ApsaraMQ 是如何一步一步完成 Serverless 能力升级的？在智能化时代，我们的事件驱动架构又是如何拥抱 AI、赋能 AI 的？</font>

<font style="color:rgba(0, 0, 0, 0.9);">本次分享将从以下四个方面展开：</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">首先，回顾 ApsaraMQ Serverless 化的完整历程，即 ApsaraMQ 从阿里内部诞生、开源，到捐赠给 Apache 进行孵化，再到完成 Serverless 化升级的不断突破、与时俱进的过程。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">然后，重点介绍 ApsaraMQ 的存算分离架构，这是全面 Serverless 化进程中不可或缺的前提。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">接下来，会从技术层面重点解读近一年 ApsaraMQ Serverless 能力的演进升级，包括弹性能力的升级、基于 RDMA 进一步降低存储和计算层之间的 CPU 开销，以及对无感扩缩容的优化。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">最后，介绍我们在面向 AI 原生应用的事件驱动架构上的探索，以及基于阿里云事件总线定向更新向量数据库，为 AI 应用融入实时最新数据的最佳实践。</font>

## <font style="color:#2F8EF4;">ApsaraMQ Serverless 化历程</font>
<font style="color:rgba(0, 0, 0, 0.9);">首先，我们来看 ApsaraMQ Serverless 化的整个发展历程。</font><font style="color:rgba(0, 0, 0, 0.9);">  
</font>

![](https://img.alicdn.com/imgextra/i2/O1CN01JquVkJ1LISSKdHvQH_!!6000000001276-2-tps-1080-575.png)

+ <font style="color:rgba(0, 0, 0, 0.9);">2012 年，RocketMQ 在阿里巴巴内部诞生，并将代码在 Github 上开源；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">2016 年，云消息队列 RocketMQ 版开启商业化的同时，阿里云将 RocketMQ 捐赠给了 Apache，进入孵化期；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">2017 年，RocketMQ 以较短的时间孵化成为 Apache TLP，并快速迭代新功能特性，顺利发布 4.0 版本，支持了顺序、事务、定时等特殊类型的消息；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">2018 年，随着大数据、互联网技术的发展，数据量爆发式增长，云消息队列 Kafka 版商业化发布；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">2019 年，云消息队列 RabbitMQ 版、云消息队列 MQTT 版两款产品商业化发布，补齐了 ApsaraMQ 在 AMQP、MQTT 协议适配上的缺失；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">2021 年，经过一段时间的孵化，ApsaraMQ 家族中的另一款产品事件总线 EventBridge 开始公测，开始融合事件、消息、流处理；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">2023 年，ApsaraMQ 全系列产品依托存算分离架构，完成 Serverless 化升级，打造事件、消息、流一体的融合型消息处理平台；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">今年，我们专注提升核心技术能力，包括秒级弹性、无感发布、计算存储层之间的 RDMA 等，实现 Serverless 能力的进一步升级，并结合当下客户需求，通过事件驱动架构赋能 AI 原生应用。</font>

## <font style="color:#2F8EF4;">存算分离架构全景</font>
<font style="color:rgba(0, 0, 0, 0.9);">第二部分，我们来看 ApsaraMQ 存算分离架构的全景，这是 Serverless 化升级不可或缺的前序准备。</font><font style="color:rgba(0, 0, 0, 0.9);">  
</font>

### <font style="color:rgba(0, 0, 0, 0.9);">ApsaraMQ 存算分离架构全景：云原生时代的选择</font>
![](https://img.alicdn.com/imgextra/i2/O1CN01WnPpOy1RXvWlUZAof_!!6000000002122-2-tps-1080-603.png)

<font style="color:rgba(0, 0, 0, 0.9);">ApsaraMQ 的存算分离架构，是云原生时代的选择。</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">从下往上看，这套架构是完全构建在云原生基础之上的，整个架构 K8s 化，充分利用 IaaS 层的资源弹性能力，同时也基于 OpenTelemetry 的标准实现了metrics、tracing 和 logging 的标准化。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">再往上一层是基于阿里云飞天盘古构建的存储层，存储节点身份对等，Leaderless 化，副本数量灵活选择，可以在降低存储成本和保证消息可靠性之间实现较好的平衡。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">再往上一层是在本次架构升级中独立抽出来的计算层，即无状态消息代理层，负责访问控制、模型抽象、协议适配、消息治理等。比较关键的点是，它是无状态的，可独立于存储层进行弹性。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">在用户接入层，我们基于云原生的通信标准 gRPC 开发了一个全新的轻量级 SDK，与之前的富客户端形成了很好的互补。</font>

### <font style="color:rgba(0, 0, 0, 0.9);">“Proxy” 需要代理什么？</font>
![](https://img.alicdn.com/imgextra/i2/O1CN010A8X9r1oKOzcW2mSw_!!6000000005206-2-tps-1080-599.png)

<font style="color:rgba(0, 0, 0, 0.9);">接下来我们重点看下这套架构里的核心点，即独立抽出来的 Proxy。</font>

<font style="color:rgba(0, 0, 0, 0.9);">它是一层代理，那到底需要代理什么呢？</font>

<font style="color:rgba(0, 0, 0, 0.9);">在之前的架构中，客户端与 Broker/NameServer 是直连模式，我们需要在中间插入一个代理层，由原先的二层变成三层。然后，将原先客户端侧部分业务逻辑下移，Broker、Namesrv 的部分业务逻辑上移，至中间的代理层，并始终坚持一个原则：往代理层迁移的能力必须是无状态的。</font>

<font style="color:rgba(0, 0, 0, 0.9);">从这张图中，我们将原先客户端里面比较重的负载均衡、流量治理（小黑屋机制）以及 Push/Pull 的消费模型下移至了 Proxy，将原先 Broker 和 Namesrv 侧的访问控制（ACL）、客户端治理、消息路由等无状态能力上移至了 Proxy。然后在 Proxy 上进行模块化设计，抽象出访问控制、多协议适配、通用业务能力、流量治理以及通用的可观测性。</font>

### <font style="color:rgba(0, 0, 0, 0.9);">ApsaraMQ 存算分离的技术架构</font>
![](https://img.alicdn.com/imgextra/i2/O1CN012vHy2N1oPRLpJN0qI_!!6000000005217-2-tps-1080-612.png)

<font style="color:rgba(0, 0, 0, 0.9);">接下来看 ApsaraMQ 存算分离的技术架构，在原先的架构基础上剥离出了无状态Proxy 组件，承接客户端侧所有的请求和流量；将无状态 Broker，即消息存储引擎和共享存储层进行剥离，让存储引擎的职责更加聚焦和收敛的同时，充分发挥共享存储层的冷热数据分离、跨可用区容灾的核心优势。</font>

<font style="color:rgba(0, 0, 0, 0.9);">这个架构中无状态 Proxy 承担的职责包括：</font>

**<font style="color:rgba(0, 0, 0, 0.9);">1. 多协议适配：</font>**<font style="color:rgba(0, 0, 0, 0.9);">能够识别多种协议的请求，包括 remoting、gRPC 以及 Http 等协议，然后统一翻译成 Proxy 到 Broker、Namesrv 的 remoting 协议。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">2. 流量治理、分发：</font>**<font style="color:rgba(0, 0, 0, 0.9);">Proxy 具备按照不同维度去识别客户端流量的能力，然后根据分发规则将客户端的流量导到后端正确的 Broker 集群上。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">3. 通用业务能力扩展：</font>**<font style="color:rgba(0, 0, 0, 0.9);">包含但不限于访问控制、消息的 Tracing 以及可观测性等。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">4. Topic 路由代理：</font>**<font style="color:rgba(0, 0, 0, 0.9);">Proxy 还代理了 Namesrv 的 TopicRoute 功能，客户端可以向 Proxy 问询某个 topic 的详细路由信息。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">5. 消费模型升级：</font>**<font style="color:rgba(0, 0, 0, 0.9);">使用 Pop 模式来避免单客户端消费卡住导致消息堆积的历史问题。</font>

<font style="color:rgba(0, 0, 0, 0.9);">无状态 Broker，即消息存储引擎的职责更加的聚焦和收敛，包括：</font>

**<font style="color:rgba(0, 0, 0, 0.9);">1. 核心存储能力的迭代：</font>**<font style="color:rgba(0, 0, 0, 0.9);">专注消息存储能力的演进，包括消息缓存、索引的构建、消费状态的维护以及高可用的切换等。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">2. 存储模型的抽象：</font>**<font style="color:rgba(0, 0, 0, 0.9);">负责冷热存储的模型统一抽象。</font>

<font style="color:rgba(0, 0, 0, 0.9);">共享存储为无状态 Broker 交付了核心的消息读写的能力，包括：</font>

**<font style="color:rgba(0, 0, 0, 0.9);">1. 热存储 EBS：</font>**<font style="color:rgba(0, 0, 0, 0.9);">热存储 EBS，提供高性能、高可用存储能力。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">2. 冷存储 OSS：</font>**<font style="color:rgba(0, 0, 0, 0.9);">将冷数据卸载到对象存储 OSS，获取无限低成本存储空间。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">3. 跨可用区容灾：</font>**<font style="color:rgba(0, 0, 0, 0.9);">基于 OSS 的同城冗余、Regional EBS 的核心能力构建跨可用区容灾，交付一写多读的消息存储能力。</font>

### <font style="color:rgba(0, 0, 0, 0.9);">基于云存储的存算分离架构，兼顾消息可靠性和成本</font>
![](https://img.alicdn.com/imgextra/i2/O1CN01n95V0X1OMWp6roci2_!!6000000001691-2-tps-1080-602.png)

<font style="color:rgba(0, 0, 0, 0.9);">存算分离架构中的存储层是完全构建在阿里云飞天盘古存储体系之上的。基于这套架构，我们能够灵活控制消息的副本数量，在保证消息可靠性和降低存储成本之间做到一个比较好的平衡。</font>

<font style="color:rgba(0, 0, 0, 0.9);">左图是存算分离存储架构中上传和读取的流程。可以看到，我们是在 CommitLog 异步构建 consumeQueue 和 Index 的过程中额外添加了按照 topic 拆分上传到对象存储的过程；在读取过程中智能识别读取消息的存储 Level，然后进行定向化读取。</font>

<font style="color:rgba(0, 0, 0, 0.9);">基于云存储的架构，我们提供了 ApsaraMQ 的核心能力，包括：</font>

**<font style="color:rgba(0, 0, 0, 0.9);">1. 超长时间定时消息：</font>**<font style="color:rgba(0, 0, 0, 0.9);">超过一定时间的定时消息所在的时间轮会保存至对象存储上，快到期时时间轮再拉回到本地进行秒级精准定时。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">2. 集群缩容自动接管：</font>**<font style="color:rgba(0, 0, 0, 0.9);">消息数据实时同步到对象存储，对象存储的数据能够动态挂载到任意 Broker，实现彻底存算分离，Broker 的无状态化。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">3. 按需设置 TTL 成本优化：</font>**<font style="color:rgba(0, 0, 0, 0.9);">支持按需设置消息 TTL，不同重要程度的消息可设置不同的 TTL，满足消息保存时长需求的同时兼顾成本控制。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">4. 冷热消息分离、分段预取：</font>**<font style="color:rgba(0, 0, 0, 0.9);">热数据的读取命中本地存储，速度快；冷数据的读取命中远端存储，速率恒定且不会影响热数据的读取。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">5. 动态调控云存储的比例：</font>**<font style="color:rgba(0, 0, 0, 0.9);">动态调控 EBS 和 OSS 的比例，大比例的 EBS 能够具备更高的稳定性，应对 OSS 负载过高的背压，提升 EBS 作为 OSS 的前置容灾的能力；小比例的 EBS 则是可以最大化降低消息单位存储成本，让整体的存储成本趋同于 OSS 存储成本。 </font>

## <font style="color:#2F8EF4;">Serverless 能力再升级</font>
<font style="color:rgba(0, 0, 0, 0.9);">有了存算分离架构的铺垫，ApsaraMQ 全系列产品 Serverless 化就更加顺畅了。接下来展开介绍 ApsaraMQ Serverless 能力的升级。</font><font style="color:rgba(0, 0, 0, 0.9);"></font>

### <font style="color:rgba(0, 0, 0, 0.9);">消息场景下的 Serverless 化</font>
![](https://img.alicdn.com/imgextra/i1/O1CN01GMNwgH1raNewet4O1_!!6000000005647-2-tps-1080-602.png)

<font style="color:rgba(0, 0, 0, 0.9);">在消息场景下通常会有两个角色：消息服务的使用方和提供方。</font>

<font style="color:rgba(0, 0, 0, 0.9);">在传统架构中通常是这样的流程：使用方会给提供方提需求：我要大促了，你保障下；提供方说给你部署 10 台够不够，使用方说好的；结果真到大促那一刻，真实流量比预估的要大很多倍，整个消息服务被击穿，硬生生挂了半小时。</font>

<font style="color:rgba(0, 0, 0, 0.9);">在 Serverless 化改造前，仍需提前规划容量；但相比传统架构的提升点是，依托 IaaS 层的快速扩容能力，能够极大缩短扩容时间；再演进到当前的 Serverless 架构，我们期望消息服务提供方是能够非常淡定地应对大促。</font>

<font style="color:rgba(0, 0, 0, 0.9);">Serverless 现在已经成为了一个趋势和云的发展方向。ApsaraMQ 全线产品实现弹性灵活的 Serverless 架构，既彰显了技术架构的先进性，也提升了客户的安全感。业务部门减少了容量评估的沟通成本，用多少付多少，更省成本；运维部门免去了容量规划，实现自动弹性扩缩，降低运维人员投入的同时，大大提升了资源的利用率。</font>

### <font style="color:rgba(0, 0, 0, 0.9);">Serverless 方案的 Why / What / How</font>
![](https://img.alicdn.com/imgextra/i4/O1CN01ovi0cP1XhtqYCIIV7_!!6000000002956-2-tps-1080-610.png)

<font style="color:rgba(0, 0, 0, 0.9);">Serverless 化预期达到的收益是：省心——秒级弹性，免容量规划；省钱——用多少付多少；省力——少运维、免运维。</font>

<font style="color:rgba(0, 0, 0, 0.9);">要解决的痛点是：用户使用容量模型比较难做精准预估；运维侧手动扩容，是一个非常耗时耗力的过程。</font>

<font style="color:rgba(0, 0, 0, 0.9);">核心目标是：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">弹性要快：</font>**<font style="color:rgba(0, 0, 0, 0.9);">特别是针对一些脉冲型的秒杀业务，需要具备秒级万 TPS 的弹性能力。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">缩容无感：</font>**<font style="color:rgba(0, 0, 0, 0.9);">应对 MQ 客户端与服务侧 TCP 长连接的特性，缩容、服务端发布时要无感。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">成本要低：</font>**<font style="color:rgba(0, 0, 0, 0.9);">极致的性能优化，才能进一步降低用户侧的单位 TPS 成本。</font>

<font style="color:rgba(0, 0, 0, 0.9);">通过如下几个关键路径构建 ApsaraMQ Serverless 核心能力：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">多租、安全隔离、业务流量隔离：</font>**<font style="color:rgba(0, 0, 0, 0.9);">是构建 Serverless 核心能力的基础。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">物理预弹&逻辑弹性：</font>**<font style="color:rgba(0, 0, 0, 0.9);">物理预弹和逻辑弹性结合的极致弹性方案，通过镜像加速、元数据批量创建、主动路由更新等核心技术加速物理弹性，结合逻辑弹性最终交付秒级万 TPS 的极致弹性能力。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">RDMA：</font>**<font style="color:rgba(0, 0, 0, 0.9);">在存储和计算层之间引入 RDMA 技术，充分利用 RDMA 的零拷贝、内核旁路、CPU 卸载等特性进一步降低计算层与存储层之间的通信开销。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">优雅上下线：</font>**<font style="color:rgba(0, 0, 0, 0.9);">依托 gRPC 协议的 GOAWAY 以及 Remoting 协议的扩展实现 TCP 长连接的优雅上下线。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">控制资源水位：</font>**<font style="color:rgba(0, 0, 0, 0.9);">通过智能化的集群流量调度以及平滑 Topic 迁移方案，进一步控制单个集群的资源水位在一个合理的值。</font>

<font style="color:rgba(0, 0, 0, 0.9);">这套 Serverless 方案可以同时满足如下几种场景：</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">第一种是平稳型：流量上升到一定水位后会平稳运行。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">第二种是稳中有“进”型：流量平稳运行的同时，偶尔会有一些小脉冲。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">第三种是周期性“脉冲型”：流量会周期性地变化。</font>

### <font style="color:rgba(0, 0, 0, 0.9);">计算、存储与网络：充分利用云的弹性能力</font>
![](https://img.alicdn.com/imgextra/i2/O1CN01AskyXN1wUUeCiAlxP_!!6000000006311-2-tps-1080-598.png)

<font style="color:rgba(0, 0, 0, 0.9);">我们前面也有提到，这套架构是完全构建在云原生基础设施之上的，我们在计算、存储、网络上都充分利用了云的弹性能力，具体来看：</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">在计算侧，通过 K8s 充分利用 ECS 的弹性能力，通过弹性资源池、HPA 等核心技术支持计算层的快速弹性，并通过跨可用区部署提升可用性。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">在存储侧，充分利用飞天盘古存储的弹性能力，支持自定义消息的存储时长，冷热数据分离，额外保障冷读的 SLA。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">在网络侧，公网随开随用，安全和方便兼具，支持多种私网形态接入，并基于 CEN 构建全球互通的消息网络。</font>

<font style="color:rgba(0, 0, 0, 0.9);">在这之上，结合 SRE 平台的智能集群流量调度、集群水位监控、物理预弹性等核心能力，最终交付了一套完整的 ApsaraMQ Serverless 化物理弹性能力。</font>

### <font style="color:rgba(0, 0, 0, 0.9);">秒级万 TPS 的极致弹性能力保障</font>
![](https://img.alicdn.com/imgextra/i3/O1CN01YVAIlO1LI03m7jSFZ_!!6000000001275-2-tps-1080-604.png)

<font style="color:rgba(0, 0, 0, 0.9);">依托于上面的基础物理资源的弹性能力，来看下我们是如何保障秒级万 TPS 的极致弹性能力的？</font>

<font style="color:rgba(0, 0, 0, 0.9);">从两个维度来看用户视角的弹性：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">从限流维度看：</font>**<font style="color:rgba(0, 0, 0, 0.9);">在无损弹性上限以内的 TPS，都不会触发限流；超过无损弹性 TPS 上限后，会有秒级别的限流，通过逻辑弹性调整实例级别的限流阈值后，即可实现最终的 TPS 弹性。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">从付费角度看：</font>**<font style="color:rgba(0, 0, 0, 0.9);">在预留规格内按规格进行预付费；超过预留规格的上限 TPS，超过部分按量付费，即用多少付多少。</font>

<font style="color:rgba(0, 0, 0, 0.9);">为了满足用户视角的秒级弹性能力，我们通过物理弹性和逻辑弹性相结合的方式来进行保障：</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">物理弹性是预弹的机制，弹性时间在分钟级，用户侧无任何感知，由服务侧来 Cover 成本。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">逻辑弹性是实时生效的，弹性时间在秒级，同时在触发无损弹性 TPS 上限时，用户侧是会有秒级别的限流感知的，另一方面，用户是需要为弹出来的那部分流量进行按量付费的。</font>

<font style="color:rgba(0, 0, 0, 0.9);">两者的关系是：物理弹性是逻辑弹性的支撑，逻辑弹性依赖物理弹性。从弹性流程上看，当用户的流量触发无损弹性上限时，优先判断物理资源是否充足，充足的话就进行秒级逻辑弹性，不充足的话就等待物理资源扩容后再进行逻辑弹性。当然这里会有个预弹的机制，尽量保障逻辑弹性时物理资源都是充足的。</font>

<font style="color:rgba(0, 0, 0, 0.9);">从物理弹性加速来看，通过以下几个方面进行加速：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">计算、存储层按需弹性：</font>**<font style="color:rgba(0, 0, 0, 0.9);">计算层更关注 CPU、客户端连接数等核心指标；存储层更关注内存、磁盘 IO 等性能指标。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">镜像下载加速：</font>**<font style="color:rgba(0, 0, 0, 0.9);">通过 PlaceHolder + 镜像缓存组件加速新节点的扩容。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">新增元数据批量创建的机制：</font>**<font style="color:rgba(0, 0, 0, 0.9);">新增存储节点创建 5000 级别的 Topic 下降至 3 秒。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">新增主动路由更新机制：</font>**<font style="color:rgba(0, 0, 0, 0.9);">降低存储节点物理扩容后承接读写流量的延迟。</font>

<font style="color:rgba(0, 0, 0, 0.9);">我们的系统设计精密，旨在确保用户体验到极致的弹性能力，特别是实现每秒万次事务处理（TPS）的秒级弹性扩展。这一能力的保障策略围绕两个核心维度展开，并深度融合物理与逻辑弹性机制，确保在高吞吐需求下的无缝响应与成本效率。</font>

### <font style="color:rgba(0, 0, 0, 0.9);">ApsaraMQ on RDMA：降低计算与存储层之间通信开销</font>
![](https://img.alicdn.com/imgextra/i4/O1CN01Njy25A1SZaa4KMb5O_!!6000000002261-2-tps-1080-599.png)

<font style="color:rgba(0, 0, 0, 0.9);">RDMA（全称远程内存直接访问）是一种高性能的网络通信技术，相比 TCP/IP 的网络模式，具有零拷贝、内核旁路、CPU 卸载等核心优势。ApsaraMQ Serverless 化架构具备存算分离的特点，非常适合在计算层和存储层之间引入 RDMA 技术，进一步降低内部组件之间的数据通信开销。</font>

<font style="color:rgba(0, 0, 0, 0.9);">具体来看，计算层 Proxy 在接收到客户端各种协议的消息收发请求以后，通过内置的 Remoting Client 和存储层 Broker 进行数据交换。在原先的 TCP/IP 网络模式中，这些数据是需要从操作系统的用户态拷贝到内核态后，再经由网卡和对端进行交互。依托 RDMA 内核旁路特性，通过实现 RdmaEventLoop 的适配器，消息直接由用户态到 RDMA 网卡和对端进行交互。</font>

<font style="color:rgba(0, 0, 0, 0.9);">从最终 BenchMark 的测试效果来看，引入 RDMA 技术后，存储层 Broker 的 CPU 资源消耗下降了 26.7%，计算层 Proxy 的 CPU 资源消耗下降了 10.1%，计算到存储的发送 RT 下降了 23.8%。</font>

### <font style="color:rgba(0, 0, 0, 0.9);">优雅上下线：ApsaraMQ Serverless 弹性如丝般顺滑</font>
![](https://img.alicdn.com/imgextra/i2/O1CN01uvEBjM1XQ2OqYv2VF_!!6000000002917-2-tps-1080-602.png)

<font style="color:rgba(0, 0, 0, 0.9);">在 Serverless 场景下，物理资源的水平弹性扩缩是一个常态化的过程，同时结合 MQ 客户端和计算层 Proxy TCP 长连接的特点，在 Proxy 上下线过程中是比较容易出现连接断开的感知，比如客户端刚发出一个接收消息的请求，连接就被服务侧强行关闭了，是非常容易造成单次请求超时的异常的。</font>

<font style="color:rgba(0, 0, 0, 0.9);">因此，我们通过 gRPC 协议 Http2 的 Go Away 机制以及 Remoting 协议层的扩展，结合 SLB 连接优雅终端的能力来实现 ApsaraMQ 在扩容态、缩容态、以及发布态的无感。</font>

<font style="color:rgba(0, 0, 0, 0.9);">右图展示了缩容态下单台 Proxy 优雅下线的过程：</font>

<font style="color:rgba(0, 0, 0, 0.9);">1. 当收到 Proxy-0 需要下线的指令后，SLB 会将 Proxy-0 摘除，保障新的连接不再建立到 Proxy-0 上，同时 Proxy-0 进入 Draining 状态，旧连接进行会话保持。</font>

<font style="color:rgba(0, 0, 0, 0.9);">2. Proxy-0 上收到新的请求后，返回的 Response Code 都更新为 Go Away；同时客户单收到 Go Away 的 Response 后，断开原先的连接，向 SLB 发起新建连接的请求。</font>

<font style="color:rgba(0, 0, 0, 0.9);">3. SLB 收到新建连接的请求，会导流至 Proxy-1。</font>

<font style="color:rgba(0, 0, 0, 0.9);">4. 等待一段时间后 Proxy-0 上的连接会自然消亡，最终达到无感下线的目的。</font>

## <font style="color:#2F8EF4;">事件驱动架构赋能 AI 应用</font>
<font style="color:rgba(0, 0, 0, 0.9);">接下来，将阐述面向 AI 原生应用的事件驱动架构如何拥抱 AI，赋能 AI 应用蓬勃发展。</font><font style="color:rgba(0, 0, 0, 0.9);">  
</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01MuHAQj1Y9NbuoAjEl_!!6000000003016-2-tps-1080-608.png)

+ <font style="color:rgba(0, 0, 0, 0.9);">面向 AI 应用的实时处理，具备实时 Embedding 至向量数据库、更新私有数据存储的能力，全面提升 AI 应用实时性、个性化和准确度。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">面向 AI 应用的异步解耦，解耦 AI 推理链路的快慢服务，加快应用响应速度。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">面向 AI 应用的消息负载，ApsaraMQ 支持主动 Pop 消费模式，允许动态设置每一条消息的个性化消费时长. 同时也支持优先级队列，满足下游多个大模型服务的优先级调度。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">面向 AI 应用的消息弹性，ApsaraMQ 提供全模式的 Serverless 弹性能力，支持纯按量和预留+弹性、定时弹性等多种流量配置模型；</font>

![](https://img.alicdn.com/imgextra/i3/O1CN01Llamtl23WVhTOMeEH_!!6000000007263-2-tps-1080-601.png)

<font style="color:rgba(0, 0, 0, 0.9);">最后，让我们来看下阿里云事件总线 EventBridge 是如何实现数据实时向量化，提升 AI 应用的实时性和准确度的？</font>

<font style="color:rgba(0, 0, 0, 0.9);">阿里云事件总线的 Event Streaming 事件流处理框架，具备监听多样化数据源，然后经过多次 Transform 之后再投递给下游数据目标的原子能力；依托这个框架，我们是很容易去实现数据的实时向量化的，从 RocketMQ、Kafka、OSS 等多个源监听到实时数据流入之后，经过文本化、切片、向量化等操作，最终存入向量数据库，作为 AI 应用实时问答的多维度数据检索的依据，最终提升了 AI 应用的实时性和准确度。</font>


