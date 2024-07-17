---
title: "阿里云消息队列 RocketMQ 5.0  全新升级：消息、事件、流融合处理平台"
date: "2021/10/28"
author: ""
img: "https://img.alicdn.com/imgextra/i3/O1CN01h9Qszd1xd1OkLUOOi_!!6000000006465-0-tps-685-383.jpg"
tags: ["explore"]
description: "RocketMQ5.0 的发布标志着阿里云消息从消息领域正式迈向了“消息、事件、流”场景大融合的新局面。未来阿里云消息产品的演进也将继续围绕消息、事件、流核心场景而开展。"
---
      # 从“消息”到“消息、事件、流”的大融合

消息队列作为当代应用的通信基础设施，微服务架构应用的核心依赖，通过异步解耦能力让用户更高效地构建分布式、高性能、弹性健壮的应用程序。

从数据价值和业务价值角度来看，消息队列的价值不断深化。消息队列中流动的业务核心数据涉及集成传输、分析计算和处理等不同环节与场景。伴随着不断演进，我们可以预见消息队列势必在数据通道、事件集成驱动、分析计算等场景不断产生新价值，创造新的“化学反应”。

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489151454-48c7b725-e210-4098-b161-1f031da134bb.png#clientId=u5b080165-605c-4&height=608&id=QPn4f&name=1.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf61ea890-da07-4c14-a4c7-dd04399b127&title=&width=1080)

RocketMQ 诞生于阿里巴巴内部电商系统，发展至今日，其核心架构经历了多次关键演进：

早在 2007 年，淘宝电商系统做服务化拆分的时候，就诞生了第一代消息服务 Notify，这是 RocketMQ 最早雏形。Notify 采用了关系型数据库作为存储，使用推模式。在阿里淘宝这种高频交易场景中，具有非常广泛地应用。

在 2007-2013 年期间，随着阿里集团业务发展，不仅需要交易场景异步调用，同时需要支持大量传输埋点数据、数据同步。此时，内部衍生出 MetaQ 以及 RocketMQ3.0 版本，这两个版本开始探索自研存储引擎，采用了自研专有消息存储，支持了单机海量 Topic，并前瞻性地去除了 Zookeeper 等组件的外部依赖。在十年后的今天，我们看到去各种 keeper 已成为整个消息领域的发展主流。

经历了前三代的内部业务打磨后，阿里巴巴积极参与开源并将 RocketMQ3.0 贡献到开源社区，并于 2017 年从 Apache 孵化器毕业，成为中国首个非 Hadoop 生态体系的 Apache 社区顶级项目。此后，RocketMQ 也开始服务于阿里云企业客户。秉承开源、商业、内部三位一体发展策略，18 年发布的 4.x 版，在高可靠低延迟方面重点优化，构建了全新的低延迟存储引擎和多场景容灾解决方案、并提供了丰富的消息特性。这也使得 RocketMQ 成为金融级的业务消息首选方案。

上个月社区发布了 RocketMQ5.0-preview 版，正式宣告 5.0 的到来。RocketMQ5.0 将不再局限于消息解耦的基本场景，更是通过统一内核、存储的优势，提供消息、事件、流一体化的处理能力。

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489151460-59616fe6-acb6-4c26-8a29-6b2d2882ebea.png#clientId=u5b080165-605c-4&height=257&id=VGHtj&name=2.png&originHeight=257&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u13b936bf-9042-42a3-ac8d-aefb9d6336c&title=&width=1080)

回顾 RocketMQ 发展的十余年，良好的社区环境和商业支持使得大量企业开发者可以很方便的跟进业务特点和诉求进行选型和验证。在社区活跃影响力方面，RocketMQ 社区项目收获 15000+Star，活跃的贡献者有 400+ 位，多语言、生态连接等周边活跃项目 30+ 个，深受社区开发者欢迎。在应用规模方面，RocketMQ 作为金融级业务消息方案，积累了互联网游戏、在线教育、金融证券、银行、政企能源、汽车出行等众多行业数以万计的企业客户。同时，在阿里巴巴内部担负业务核心链路，每天流转万亿级消息流量，扛过了历届双十一的零点峰值。在行业评测方面，RocketMQ 也多次斩获大奖。

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489153239-53238d31-3b44-4d45-9105-a8f69f80b88f.png#clientId=u5b080165-605c-4&height=237&id=H4cjQ&name=3.png&originHeight=237&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1be4e767-efcd-4f00-baee-8b3a3f979f9&title=&width=1080)

# 官宣：阿里云新一代 RocketMQ 
# “消息、事件、流”融合处理平台

今天发布阿里云消息队列 RocketMQ 版 5.0，我们称之为一站式“消息、事件、流”融合处理平台。

新版本核心诞生两大新亮点，首先是消息核心场景的扩展和布局，RocketMQ 5.0 不再局限于消息解耦场景，将全新布局事件驱动和消息流式处理场景；其次则是一站式融合处理的技术架构和趋势。

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489151444-6f886d6b-f28e-4a93-91e3-ce8c221b152b.png#clientId=u5b080165-605c-4&height=373&id=OPU5s&name=4.png&originHeight=373&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5ad040ce-7168-41d4-88ff-683a633311c&title=&width=1080)

“消息、事件、流”一站式融合处理的技术架构可以实现一份消息存储，支持消息的流式计算、异步投递、集成驱动多种场景，极大地降低业务人员运维多套系统的技术复杂度和运维成本。可以说，无论是微服务的指令调用、异步通知，还是 CDC 变更日志、行为埋点数据，亦或是资源运维、审计事件，统一的 RocketMQ5.0 产品栈都能统一处理。

# 重大发布一：
# RocketMQ 基础架构全新升级

首先，最重要的升级是阿里云 RocketMQ 的技术架构全面焕新。

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489151446-9a17712d-6b4e-4344-91ea-681acb8914b4.png#clientId=u5b080165-605c-4&height=427&id=WwhkT&name=5.png&originHeight=427&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u448310af-cc0f-48c9-bfb7-db5a2497628&title=&width=1080)

全新的 RocketMQ5.0 版将通用的存储逻辑下沉，集中解决消息存储的多副本、低延迟、海量队列分区等技术问题，将上层的消息处理和剥离出完全的无状态计算层，主要完成协议适配、权限管理、消费状态、可观测运维体系支持。得益于存算分离的架构设计，从 SDK 接入到线上运维全链路带来全面提升：

1. 轻量版 SDK 的开放和全链路可观测系统的提升：同时支持 4.x 通信协议和全新的 gRPC 通信协议，并内置 OpenTelemetry 埋点支持，新版本 SDK 新增了 10 余个指标埋点。

2. 消息级负载均衡：新版本 SDK 不再参与实际存储队列的负载均衡，消息负载均衡将更加轻量，以单条消息为调度最小单元。

3. 多网络访问支持：新版本支持单一实例同时暴露公网、内网等访问形式，方便客户多网络接入访问。

4. 海量分级存储：新版本开放分级存储历史消息保存能力，消息低成本无大小限制，最长保存 30 天。冷热数据进行分离设计，极大降低消费历史消息对实例的性能影响。

# 重大发布二：
# RocketMQ Streaming 云上最佳实践——消息ETL

消息基础架构的能力提升之外，阿里云 RocketMQ 在 Streaming 流式处理场景推出了轻量级消息 ETL 功能。

![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489153591-31909631-c513-42cb-b8a8-b4df7ffa92f3.png#clientId=u5b080165-605c-4&height=395&id=iy7aH&name=6.png&originHeight=395&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u62cdbe2d-cf65-4e38-98d9-86cd842b1ed&title=&width=1080)

用户在数据库变更、终端数据上报、后台埋点日志等场景产生的消息，典型的消费场景就是数据清洗转化，同时再存储到外部的存储和离线分析、在线分析系统中。传统实现方案需要搭建 Flink 等重量级实时计算服务或者自建消费应用做消息处理。而使用商业版 RocketMQ ETL 功能，简单控制台配置即可实现消息的清洗和转化。RocketMQ ETL 功能有三大优势：

1. 轻量无依赖：作为阿里云消息原生功能，使用时不需要部署外部计算服务或消费程序，方案更轻量。

2. 开发门槛低：内置常见清洗转化模板，满足绝大多数消息内容处理需求，并支持用户快速编写自定义函数来支持特殊的业务逻辑。整体开发成本非常低，1 小时即可完成业务上线。

3. Serverless 弹性：无需预先估算容量，采取 Serverless 无服务器模式，实现按需弹性伸缩。



# 重大发布三：
# EDA 云上最佳实践——事件中心 EventBridge

本次 RocketMQ 最后一个发布点是在事件驱动的业务场景的布局和演进。早在 2018 年，Gartner 评估报告将 EDA（Event-Driven-Architecture） 列为十大战略技术趋势之一，事件驱动架构将成为未来微服务主流。我们首先下一个定义：

事件驱动其本质是对消息驱动的再升级，是企业IT架构深度演进的下一个必然阶段。

事件驱动架构和消息驱动架构的区别和关联主要集中于以下三点：

1. EDA 更加强调深层次解耦：消息驱动是同一业务、组织系统内不同组件之间在技术架构层面的调用解耦，其信息封装和处理都是有预期、预定义的。事件驱动适配是更宽泛的业务、组织系统，基于事件的解耦上下游之间无需有预期和行为定义，上下游统一遵循标准化的规范，这是更深度的解耦。

2. EDA 更加强调连接能力：消息驱动更多是单一系统内的调用，而事件驱动往往会涉及到不同的地域、账户主体以及三方 SaaS 的协同，事件驱动的一大特征就是生态的强连接能力。

3. EDA 更加强调 Serverless 低代码开发：类比于消息和微服务的协同关系，未来业务架构 Serverless 化的大趋势会推动业务开发模式逐步转向低代码配置化。事件驱动的另一大特征就是低代码开发，基于丰富的工具能力，业务侧不需要像消息驱动一样编写大量的生产消费代码。

![7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489153599-9ece15d7-af34-4e75-8428-b83a33558b8b.png#clientId=u5b080165-605c-4&height=432&id=VEZKs&name=7.png&originHeight=432&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue99a09bc-8c25-4514-b4bc-fd039ad53d6&title=&width=1080)

因此，阿里云统一事件中心 EventBridge 产品带来如下能力：

1. 统一标准化的事件集成生态：作为阿里云事件中心，集成 80 余款云产品的业务事件，支持 800 多种事件类型，用户使用 EventBridge 可以一次性管理所有云产品资源的变更、操作使用事件，避免对接多个产品接口的重复性劳动。

2. 全球事件互通网络：贯彻事件驱动强连接的属性能力，本次发布了全球事件互通网络，首批支持国内五大地域事件互通。企业客户简单配置即可实现跨账号、跨地域、跨网络的事件聚合和流转。

3. Serverless 低代码开发：内置十余种事件目标和处理模板，涵盖了大多数业务场景，客户简单配置、低代码，无需部署服务即可完成事件的驱动和处理。

# 面向未来：
# 坚定推动“消息、事件、流”大融合的发展

RocketMQ5.0 的发布标志着阿里云消息从消息领域正式迈向了“消息、事件、流”场景大融合的新局面。未来阿里云消息产品的演进也将继续围绕消息、事件、流核心场景而开展。消息基础架构本身也必将步伐不断，继续朝着 Serverless 弹性、强容灾能力、可观测免运维方向推进，给客户带来高性能、高可靠、强容灾的高 SLA 服务；并在 Streaming 的场景会基于客户业务诉求，联合生态产品持续推出更多的消息处理计算服务；打造面向未来的企业集成模式，联合生态伙伴和开源社区大力推动事件驱动进一步发展。

![8.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489153666-911139a7-4eb9-43bb-bd5b-289f78892876.png#clientId=u5b080165-605c-4&height=4186&id=PKvwP&name=8.png&originHeight=4186&originWidth=800&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub6d95f07-6bd1-4cbc-aae3-2a4ded599d2&title=&width=800)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
