---
title: "消息队列 RocketMQ  5.0：从消息服务到云原生事件流平台"
date: "2022/11/09"
author: ""
img: "https://img.alicdn.com/imgextra/i4/O1CN01y2qoHQ1ogqA2tn4aN_!!6000000005255-0-tps-685-383.jpg"
description: "11 月 5 日，2022 杭州 · 云栖大会上，阿里云智能高级产品专家杨秋弟在云原生峰会上发表主题演讲，发布消息队列 RocketMQ 5.0：从消息服务到云原生事件流处理平台。"
tags: ["dynamic","home"]
---
**前言**

回顾 RocketMQ 的发展历程，至今已十年有余。2022 年 RocketMQ 5.0 正式发布，全面迈进云原生时代。
11 月 5 日，2022 杭州 · 云栖大会上，阿里云智能高级产品专家杨秋弟在云原生峰会上发表主题演讲，发布消息队列 RocketMQ 5.0：从消息服务到云原生事件流处理平台。
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500970825-eb9e9076-d125-4a78-b640-6553e653eb26.png#clientId=uc9cc4b77-1d62-4&from=paste&id=u3229d4e9&originHeight=577&originWidth=865&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6cb40a0f-5426-43f1-bf7c-f3c221bd2fb&title=)
阿里云智能高级产品专家&Apache RocketMQ 联合创始人 杨秋弟
**Apache RocketMQ 发展史**

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500970856-c4be2adf-bc36-4925-9832-7fc9790ae3c9.png#clientId=uc9cc4b77-1d62-4&from=paste&id=uf439ae9e&originHeight=486&originWidth=865&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7b210078-0e3b-496d-b4e1-5a6f8b77167&title=)
回顾 Apache RocketMQ 过去十年的发展历程，可分为“诞生于互联网”与“成长于云计算”两大阶段。
**第一个阶段是 RocketMQ 的从 0 到 1，在阿里内部规模化落地。**2012 年，为了支撑超大规模电商互联网架构，阿里中间件研发了 RocketMQ，并在产品诞生初期开源，2017 年 RocketMQ 统一了阿里消息技术体系。
**第二个阶段是云计算。**2015 年 RocketMQ 上云，这也是业界首个提供公共云 SaaS 形态的开源消息队列；2016 年，阿里把 RocketMQ 捐赠给 Apache，2017 年孵化毕业，成为国内首个 TLP 的互联网中间件。
十年磨一剑，出鞘必锋芒。在这十年的过程中，通过集团打磨稳定性，依托云计算孵化创新，开源共建加速标准化建立与生态连接，RocketMQ 始终坚持开源、集团、商业三位一体的发展思路，内核演进和产品迭代齐头并进。2022 年 RocketMQ 5.0 正式发布宣告着全面迈进云原生时代。
**RocketMQ 5.0：从消息服务到云原生事件流平台**

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500972508-9070a072-21ae-41b8-9261-44a3e859c887.png#clientId=uc9cc4b77-1d62-4&from=paste&id=u15656c63&originHeight=395&originWidth=865&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u401f892e-aa0b-495d-9c6a-73f56b20b03&title=)
回顾过去这十年，RocketMQ 服务于集团几乎所有的业务，在阿里云上更是累计服务了 10 万余家企业客户，覆盖互联网、零售、金融、汽车等 20 多个行业，大规模的生产实践持续累积产品的核心优势。

- **多样性。**企业级应用复杂的业务诉求，催生 RocketMQ 提供丰富的消息类型，比如定时消息、事务消息、顺序消息等等。此外，也提供了像消息轨迹、消息回溯等一系列的消息治理能力。
- **一致性。**无论是淘宝交易还是蚂蚁支付都天然对数据一致性有着极高的要求，RocketMQ 提供的分布式事务消息是业内第一个提供该特性的消息产品，将异步解耦与数据一致性完美融合，是金融客户中不可或缺的产品能力。
- **稳定性。**稳定性是产品的根基，更是一个系统工程，RocketMQ 长期在电商和金融领域中打磨，不仅提供最高达 99.99% SLA，更是帮助客户提供全方位的健康巡检与故障排查能力，如消息轨迹、消息回溯、死信机制等等，提供多样化的稳定性兜底手段。
- **高性能。**在双十一的极限流量下，RocketMQ 具备无限扩展能力，支持千万级并发与万亿级消息洪峰，P9999 写延迟在 1ms 内，100%在 100ms 内。

可以说，在消息领域，尤其在业务消息领域，RocketMQ 在国内已经做到顶尖，成为企业客户的首选。
而随着云原生以及数字化时代的到来，RocketMQ 也在快速的发生着变化，那么变化主要体现在哪些方面呢？
首先，全面拥抱云原生。向下，消息系统自身实现云原生架构的演进，充分释放云基础设施的池化能力，全方位提高消息的核心技术指标。向上，消息产品形态持续演进，成为云原生应用架构的核心引擎。比如微服务、事件驱动、Serverless 等现代化应用架构。
其次，全面拥抱实时数据。企业的数字化转型从原来的业务数字化迈向了数字业务化。对业务数据的实时洞察、实时决策成为指导业务成功的关键要素。消息队列也将从在线业务架构的基础设施，延伸到实时数据架构的基础设施，从而实现事务分析一体化。
随着 5.0 的发布，RocketMQ也正式从消息服务升级到云原生事件流处理平台。

**RocketMQ 5.0：云原生架构升级**

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500970837-06985016-04ea-477e-bc64-b6202f968368.png#clientId=uc9cc4b77-1d62-4&from=paste&id=u5803bfeb&originHeight=365&originWidth=865&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4b2b9abf-e1de-463a-8850-ce03ffa88b1&title=)
首先来看 RocketMQ 自身的云原生架构演进。从下面的全景图可以看出，RocketMQ 从客户端到服务端都进行了全方位的改造，具体体现在以下几个方面：

- **轻量化。**RocketMQ 4.0 诞生于 2012 年的淘宝电商，当时大部分的业务还跑在物理机上，单节点计算能力强，客户端节点数少且较为稳定，因此，富客户端的接入方式不仅更加高效，更可以提供诸如客户端侧负载均衡、消息缓存、故障转移等一系列企业级特性。但这种模式在云原生时代发生了改变，轻量客户端更容易被云原生技术栈所集成。因此，RocketMQ 5.0 客户端采用轻量 SDK 设计理念，将原来富客户端的逻辑下沉到服务端，满足现代化应用轻量化、Serverless 化以及 Mesh 化的趋势，更容易被集成；同时也正是因为轻量化，使得 SDK 多语言开发成本低了很多，快速覆盖当下主流的多语言版本。
- **弹性。**存算分离架构让无状态计算节点可以快速伸缩，而分级存储以及冷热分离架构更是让消息存储具备更强的弹性能力。
- **高可用。**基于全新的 Leaderless 架构，去 ZK 依赖的同时，可以做到副本数灵活选择，同步异步自动升降级，实现秒级故障转移；面向云的多可用区、多地域组建全局高可用能力。
- **基础设施云原生化。**RocketMQ 整体架构走向 Kubernetes 化，拥抱 OpenTelemetry，依托于阿里云提供的 ARMS、Prometheus 以及Grafana 实现可观测能力的云原生化。

而 RocketMQ 5.0 本次的升级，除了在技术架构云原生化之外，在产品能力以及成本优化方面都有着重大的提升，我们来逐一分解。
**轻量无状态消费模型**

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500970855-7f281d30-ac7a-493b-b90a-8d6bc6156e96.png#clientId=uc9cc4b77-1d62-4&from=paste&id=u284f7936&originHeight=378&originWidth=865&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u17fadc5b-b1d3-4899-956e-e924ce9e61a&title=)
RocketMQ 4.0 采用按队列消费模型，消费者完全按照队列负载均衡，非常适合批量拉取快速消费，对单一消息状态不敏感的场景，比如流计算。然而在业务消息领域，尤其是金融场景以及事件驱动架构之下，每一条消息状态都是极为重要的。再加上不同业务类型的消息处理耗时也是各不相同，从毫秒级、到秒级甚至到分钟级，队列的负载不均衡或者短暂的 Block 都可能会引发消息的局部堆积，从而影响到最终用户的体验。因此，RocketMQ 5.0 全新推出按消息负载的轻量无状态消费模型，通过 PoP 机制巧妙地在队列模型之上构建了消息模型，业务只需要关心消息而无需关心队列，所有 API 都能够支持单条消息级别控制，如消息的消费、重试、删除等。而基于消息消费模型，客户端、连接和消费都是无状态的，可在任意 Proxy 节点上飘移，真正做到轻量化。
RocketMQ 5.0 提供按队列消费模型以及按消息消费模型，更好的满足事件与流的业务场景，正可谓鱼与熊掌兼得。
**海量消息分级存储**

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500973237-9e7a6b28-c640-48b0-8c4d-e7a56a049603.png#clientId=uc9cc4b77-1d62-4&from=paste&id=u0ae55935&originHeight=366&originWidth=865&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub9887e11-23e0-4b8f-9706-5b8e08334d5&title=)
RocketMQ 5.0 的另一个重大升级则是海量消息的分级存储。对消息队列了解的同学都知道，消息通常都是流动的短时间的存储，业内大部分消息产品对消息的保留时间都比较优先，3 天，7 天，最长 15 天不等。有限的存储空间使不仅限制了消息的保留时长，更在某些场景下可能会导致业务资损，比如在消息还没有被消费的时候，因为磁盘空间不足或者消息过期而被清除，这在金融等领域都是不可接受的。所以，RocketMQ 一直想要解决这样的问题，让存储变得更有弹性。
RocketMQ 5.0 基于ESSD、对象存储打造冷热分离以及分级存储架构，提供低成本的无限存储能力，确保消息不会因为本地磁盘空间不足而提前被清除，造成业务资损。我们提供消息存储的 Serverless，客户只需按实际存储使用量付费，而无需预购存储空间。
此外，流量削峰是消息队列极为常见的场景，而由此带来的海量消息堆积能力以及在堆积情况下的性能稳定性成为衡量产品性能的核心指标。RocketMQ 5.0 基于冷热数据分离架构进一步做到读写隔离，避免在堆积的场景下影响热数据的写入性能。分级存储的冷数据碎片规整能力更是提高了冷数据的读取性能，为用户提供一致的冷读 SLA。
**售卖系列全线升级，最高降本 50%**

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500973337-d5e7fe40-a1bb-48ae-997a-fe0045583947.png#clientId=uc9cc4b77-1d62-4&from=paste&id=uf135ac57&originHeight=374&originWidth=865&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4d0cb6d0-d2e9-4787-af71-789b475deec&title=)
从前面的介绍我们已经了解到，RocketMQ 5.0 在技术架构以及产品能力上都有着明显提升。
而 5.0 推出全新的售卖形态与计费策略相比 4.0 更简单、更灵活也更为普惠。实例的综合成本最高可降低 50%。接入门槛最低可降至 390 元/月，远低于自建成本。消息存储支持 Serverless 弹性能力，按需付费可大幅降低闲置成本。结合冷热分离的多级存储能力，相比开源自建可降低 67%，大幅降低消息队列的使用成本。
**EventBridge：云上事件枢纽**

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500973398-5fe29cce-5078-49ad-ab2a-d668422d1b44.png#clientId=uc9cc4b77-1d62-4&from=paste&id=u507bc6e2&originHeight=354&originWidth=865&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc480d61a-c63a-45f3-94f8-92c1deb6a03&title=)
事件驱动是一个起源很早的概念，早在几十年前，无论是操作系统内核的设计、还是客户端编程框架都大量采用了事件驱动技术。RocketMQ PushConsumer 提供的 API 其实就是一种事件驱动的编程范式，但在微服务应用架构当中，集成与通信才是刚需，事件驱动的价值并没有那么明显的体现。
而随着云原生时代的到来，计算力的构成越来越多样化。作为云原生的代表技术，Serverless 架构范式也是事件驱动的。无论是阿里云的函数计算、还是 AWS 的 Lambda，它们的主要触发源都是各种形态的事件，云产品事件，如 OSS 文件上传触发用户基于函数进行文件加工处理；用户业务事件，如 RocketMQ 触发函数运行消费逻辑处理等等。
以事件驱动为核心理念，阿里云推出了 EventBridge 产品，其使命就是打造云上的事件枢纽。通过EventBridge 可以兑现四大业务价值：

- **统一事件枢纽。**阿里云从 IaaS、PaaS到第三方的 SaaS，每天都有数以亿计的事件产生，但却没有一种简单和统一的方式来触达这些事件；这些事件散落在各个地方形成『事件孤岛』，很难挖掘出有用的业务价值。只有充分发挥数据的规模效应，建立起数据之间的血缘关系，我们才能更好的发掘出数据的价值；所以 EventBridge 首要任务便是统一阿里云上的事件规范，拥抱CloudEvents 事件标准，打造阿里云统一的事件枢纽。
- **事件驱动引擎。**当 EventBridge 连接了海量的事件源后，基于 RocketMQ 毫秒级的事件触发能力，必将加速企业 EDA/Serverless 的架构升级。
- **开放与集成。**EventBridge 提供丰富的跨云、跨平台、跨产品、跨地域以及跨账号的连接能力，能够促进云产品、应用程序、SaaS 服务的相互集成。
- **低代码。**EventBridge 借助Serverless 的应用中心，通过简单的规则匹配以及丰富的模板，即可实现事件的分发、过滤、转换等处理，进一步提升事件驱动的效率。

**让消息无处不在，让事件无所不及**

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500974060-d8620655-5c68-4ea8-a1db-36bc556f86fb.png#clientId=uc9cc4b77-1d62-4&from=paste&id=u6e3f913b&originHeight=376&originWidth=865&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u84dbb2f0-c553-46d1-8e41-f01c428eb75&title=)
依托于 EventBridge、RocketMQ 以及函数计算 FC 的强强联合，目前 EventBridge 的事件生态已初具规模。
在云产品事件集成方面，目前已经集成 200+云产品事件源，3000 多种事件类型。
在数据集成与处理方面，EventBridge 与微服务应用、大数据、IoT 等场景深度集成。比如与消息生态的融合，阿里云 6 款消息队列产品通过 EventBridge 实现消息数据的互联互通，并且通过 EventBridge 的全球事件网络赋予消息全球消息路由的能力，同时也可以通过EventBridge 提供的丰富的模板，实现 ETL 数据处理能力。
在 SaaS 应用集成方面，包括钉钉、聚石塔以及云上 50 多个 SaaS 服务都可以通过 EventBridgehook 方式连接到 EventBridge。
在事件触发方面，EventBridge 目前已经触达 10 多个事件目标，海量的事件源都可以通过 EventBridge 触发包括 FC/SAE 等在内的 10 多款事件目标云产品。除此之外，目前 EventBridge 已经对接了阿里云全量的云产品 API，任何一个事件都可以通过云产品 API 的方式进行触达。
未来还有会更多的事件源以及事件目标接入到 EventBridge 上来。
**RocketMQ Streams：轻量级计算的新选择**

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500974716-3f193a80-9841-4acc-9661-d46349ff7e51.png#clientId=uc9cc4b77-1d62-4&from=paste&id=u537f818c&originHeight=324&originWidth=865&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u642ca384-9d7d-4774-8503-9a95c9a534f&title=)
正如开篇所提到的，基于云原生架构的全面升级，RocketMQ 5.0 也将从在线业务架构的基础设施，延伸到实时数据架构的基础设施，实现事务分析一体化。将 RocketMQ Streams 打造成为轻量级计算的新选择。
业内最常见如 Flink、Spark 等大数据框架大多采用中心化的 Master-Slave 架构，依赖和部署比较重，每个任务的执行都需要很大的开销，有较高的使用成本。而与之不同的是，RocketMQ Streams 着重打造轻资源，高性能的轻量计算引擎，无额外依赖，最低1core，1g 即可完成部署，适用于大数据量、高过滤、轻窗口计算的场景，在资源敏感型场景，如消息队列流计算、安全风控，边缘计算等，RocketMQ Streams 具有有很大优势。阿里云消息团队与安全团队合作，通过对过滤场景做大量优化，性能提升 3-5 倍，资源节省 50%-80%。
目前，RocketMQ Streams 已经在开源社区发布，未来计划在 2023 年 4 月在阿里云完成商业化。

**RocketMQ 这十年，我们一同向前**

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500974889-c016177b-576d-4b89-a256-7e59916eb098.png#clientId=uc9cc4b77-1d62-4&from=paste&id=u36f63fc9&originHeight=335&originWidth=865&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u20fbf39a-2793-4b89-bfb6-5b72f909764&title=)
RocketMQ历经十余年的打磨，已经取得了众多成果。全球拥有 700+的贡献者，1.8w Star 数，超过 80%的主流云厂商提供了 RocketMQ 的商业托管服务，Apache RocketMQ 社区始终保持着极高的活跃度，因此，也荣获了科创中国“开源创新榜”，中日韩开源软件优秀技术奖等十多个国内外开源奖项。
而阿里云作为 RocketMQ 的起源和核心贡献者，不仅 100%覆盖全集团业务，承载千万级并发万亿级消息洪峰。十多年以来更是累计服务 10w+万企业客户，覆盖互联网、零售、汽车等 20 多个行业，超过 75%的头部企业选择使用 RocketMQ。期望阿里云的消息队列 RocketMQ 可以成为广大企业客户的心之所选。也诚邀更广大的开发者来积极参与RocketMQ 的开源社区建设，一起将 RocketMQ 打造为消息领域的引领者。

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)

