---
title: "Apache RocketMQ  在阿里云大规模商业化实践之路"
date: "2022/09/23"
author: "周新宇"
img: "https://img.alicdn.com/imgextra/i4/O1CN01ZYQ1XY1KBknq9j7MM_!!6000000001126-0-tps-685-383.jpg"
tags: ["practice", "home"]
description: "RocketMQ 5.0 发布后，阿里云商业会持续采取 OpenCore 的发展模式，秉承上游优先的社区发展原则，与社区一起将 RocketMQ 打造为一个超融合的数据处理平台。"
---

## 阿里云消息队列 RocketMQ 商业化历程


![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500243177-88395440-d444-4f69-8d5e-1234465d57cd.png#clientId=uafa6c11d-42c2-4&height=604&id=vTpgh&name=1.png&originHeight=604&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8d465533-127b-4a59-bb73-3f402cc51a4&title=&width=1080)

RocketMQ 诞生于 2012 年，诞生即开源。2012～2015 年，RocketMQ 一直在通过内部电商业务打磨自身服务能力,并在 2015 年于阿里云上线公测。2016 年，阿里云 RocketMQ 完成商业化，同时被捐赠给 Apache 基金会，同年获得了年度受欢迎中国开源软件荣誉。

在 Apache 孵化期间，Apache RocketMQ 经历了快速发展，2017 年即毕业成为了 Apache 顶级项目。同年，Apache RocketMQ TLP RocketMQ 4.0 正式发布。此后，RocketMQ 4.0 经历了长足发展，期间阿里云商业和开源相辅相成、齐头并进，直到今天，共同迈入 RocketMQ 5.0 时代。

RocketMQ 5.0 发布后，阿里云商业会持续采取 OpenCore 的发展模式，秉承上游优先的社区发展原则，与社区一起将 RocketMQ 打造为一个超融合的数据处理平台。

## 阿里云消息队列产品矩阵

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500243280-acd657cd-b3a0-4998-b74d-e64cf4b680b2.png#clientId=uafa6c11d-42c2-4&height=604&id=QxR9B&name=2.png&originHeight=604&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u77fa6ce6-1612-4ba2-9322-1333b0b7fb2&title=&width=1080)

阿里云基于 RocketMQ 消息底座，构建了多元化的消息产品系列。

RocketMQ 是阿里云主打的消息品牌，互联网新兴业务领域首选的数据通道。消息队列 Kafka 是大数据的首选数据通道，微消息队列 MQTT 是移动互联网和物联网的数据通道，消息队列 RocketMQ 是传统业务领域的数据通道。消息服务 MNS 是 RocketMQ 轻量版，主要应用于应用集成领域，为平台型应用提供简单的队列服务。事件总线 Event Bridge 定位为云上事件枢纽，旨在阿里云上构建统一的事件中心。

阿里云消息队列产品矩阵完全构建在 RocketMQ 之上，基本实现了应用场景全覆盖，包括微服务解耦、SaaS 集成、物联网、大数据或日志收集生态，同时也在内部覆盖了阿里巴巴所有业务，在云上为数万阿里云企业提供了优质的消息服务。阿里云的消息产品矩阵涵盖了互联网、大数据、移动互联网等领域业务场景，为云原生客户提供不可或缺的一站式解决方案。

RocketMQ 在阿里云商业化历程中，一直致力于探索业务消息实践，也孵化了大量业务消息特性，并持续反哺到开源社区。

## RocketMQ 4.0 业务消息探索之路

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500244884-49adb844-83dc-474e-8eb3-b90cad1a612e.png#clientId=uafa6c11d-42c2-4&height=599&id=ETqo6&name=3.png&originHeight=599&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7921b071-7b20-41b6-9f8a-2b5b22e44f8&title=&width=1080)

RocketMQ 在商业化过程中，陆续推出了四种消息类型来满足丰富的业务场景。

- 普通消息：普通消息提供极致弹性、海量堆积能力，内置重试与死信队列来满足业务对失败重试的需求，同时具备高吞吐、高可用、低延迟等特性，广泛应用于应用集成、异步解耦、削峰填谷等场景。

- 定时消息：提供秒级定时精度， 40 天超长定时，主要面向分布式定时调度、任务超时处理等场景，目前正在开源中。 

- 顺序消息：支持全局与局部严格有序，从发送、存储到消费，保证端到端有序。面向有序事件处理、撮合交易、数据实时增量同步等场景。

- 事务消息：分布式、高性能、高可用的最终一致性事务解决方案，广泛应用于电商交易系统中服务的一致性协调场景并且已经开源。 

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500243117-3cbac1e0-22de-43db-8bfe-6625389f01e7.png#clientId=uafa6c11d-42c2-4&height=597&id=YGdJq&name=4.png&originHeight=597&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5bd123fa-258c-4ab8-99a9-350d6dbd7f2&title=&width=1080)

RocketMQ 4.0 期间，商业和开源都致力于全方位拓展消息接入能力，使 RocketMQ 能够非常轻松地连接应用开源和云产品生态。比如商业上提供了多语言 SDK ，开源也有相应的 SDK 能够覆盖 Java、Go、Python 、C++使用 RocketMQ。同时支持 Spring 生态，能够通过 Spring Cloud 的方式使用 RocketMQ。商业上提供了一组非常简单易用的 HTTP API，提供了 6-7 种语言的实现。

除了 SDK 接入，RocketMQ 也在积极拥抱社区标准，在云产品侧提供了 AMQP 和 MQTT 的接入能力，其中 MQTT 已开源。

RocketMQ 也大力在发展 connector 生态，能够通过 RocketMQ connector 接入很多数据源，包括 Redis、MongoDB、Hudi 等大数据系统。

另外，阿里云构建的事件总线 EventBridge 也已开源，通过该产品能够将阿里云的云产品、SaaS 应用、自建数据平台的数据引入 RocketMQ。

RocketMQ 4.0 版本做了大量尝试，提供了全方位的消息接入能力。

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500243121-f8fa259d-5ef6-4ef6-b3e1-68438027780d.png#clientId=uafa6c11d-42c2-4&height=603&id=GhRWW&name=5.png&originHeight=603&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uae69e4d2-bef6-4b50-8b71-26b3d0d7cc2&title=&width=1080)

RocketMQ 在服务阿里集团用户和商业化历程中，沉淀了大量领先的业务消息处理与服务能力。比如消息订阅方面，RocketMQ 支持集群分布式消费能力，也支持广播消费。在消息处理方面支持基于 Tag 和 SQL 做灵活过滤，其中基于 SQL 过滤是电商交易中非常重要的特性，能够支持在非常订阅比的情况下实现较低的投递比。

全球消息路由能力具备性能高、实时性强的特点。在云时代，数据中心天然分布在各个地域，各个地域之间还有 VPC 网络隔离。但是通过全球消息路由功能可以将地域与网络打通，能够满足更多业务场景。比如在阿里内部基于该能力实现了异地多活、异地容灾等企业级特性。

另外，全球消息路由具备非常高的易用性，提供了可视化任务管理界面，通过简单配置即可创建复制链路。

消息治理方面，RocketMQ 提供了访问控制、命名空间、实例限流、消息回放、重试消息、死信消息、堆积治理等能力。

服务能力方面，RocketMQ 经历了非常多沉淀，它在为交易链路服务了 12  年，参加了 10 年双 11，这也保证了 RocketMQ 能够在阿里云上提供非常高的可靠性。双 11 消息收发 TPS 峰值过亿，日消息收发总量超过 3 万亿。而即使在双十一万亿级数据洪峰下，消息也能做到 99.996% 毫秒级响应能力，消息发布平均响应时间不超过 3 毫秒，最大不超过 20 毫秒，真正实现了低延迟消息发布。

![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500247587-609898dc-a7b0-482e-85b1-1d54afdfedf5.png#clientId=uafa6c11d-42c2-4&height=619&id=wWY6C&name=6.png&originHeight=619&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua950dff4-aec5-4d47-b9fa-34c396aa135&title=&width=1080)

商业化初期，客户遇到最大难题是在分布式环境下如何完整地追踪异步消息链路。基于此背景，我们打造了可视化全生命周期消息轨迹追踪系统，能够提供丰富的消息查询、消息下载、定点重投、轨迹追踪能力，通过可观测系统帮助用户解决分布式环境中不可观测的问题。

如上图所示，一条消息从产生、发送至服务端存储到最终投递到消费者，整个发送和消费轨迹都有迹可循，包括投递给哪些消费者、哪些消费者在什么地方成功消费或者消费失败、何时进行重投，真正帮助客户解决了分布式观测难题。

![7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500247513-11e5508c-1251-4e89-b1a7-ff0616684dd9.png#clientId=uafa6c11d-42c2-4&height=602&id=ghc3R&name=7.png&originHeight=602&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf0589782-1f1a-41cb-bd15-b370ead3ddc&title=&width=1080)

除了功能特性，RocketMQ 在稳定性方面也做了很多建设。我们始终坚持，SLA 是云原生的根本，因此整个研发运维链路都有严格的稳定性保障措施：

- **架构开发**：每个方案设计都会面向失败设计，代码开发阶段会有严格 Code Review 阶段，也会完整经历单元测试、集成测试、性能测试和容灾测试流程。

- **变更管理**：有着非常严格的变更制度，要做到每个变更可灰度、可监控、可回滚、可降级。

- **稳定性防护**：提供了限流、降级、容量评估、应急方案、大促保障等能力，会定期进行故障和预案演练，定期进行风险梳理。

- **体系化巡检**：在云上有全方位的生产环境黑盒巡检。基于用户视角，会对全地域所有功能做全功能扫描，包含高达 50 多项检测项，任意项功能出问题都能立刻被监测到。在白盒巡检方面，会对 JVM 运行时指标、内核系统、集群指标进行巡检。

- **故障应急**：有完整地故障应急流程，包括监控报警、故障发生、快速止血、排查根因、故障复盘。

## RocketMQ 5.0 云原生架构升级之路

云原生时代，云上用户对云产品服务化程度、弹性能力、可控制性能力以及韧性都有了更高的要求。在此背景之下，我们对 RocketMQ 进行了云原生架构升级，这也是 RocketMQ 5.0 的诞生背景。

![8.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500248876-b5ebf0f7-4bc4-4cb8-a689-e7b433434468.png#clientId=uafa6c11d-42c2-4&height=600&id=Z7Bnx&name=8.png&originHeight=600&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u3d64fe38-0205-41de-8ebc-e809dea4f34&title=&width=1080)

- 轻量级 SDK：基于云原生通信标准 gRPC 开发了一组轻量级 SDK，能够与当前富客户端优势互补。  

- 无状态消息网关：在核心数据链路推出了无状态消息网关。通过搭建无状态服务节点Proxy，再通过 LB 进行服务暴露，将存储节点数据分离来独立负责核心消息存储和高可用。Proxy 与 Store 节点分离部署，独立弹性。 

- Leaderless 高可用架构：Store 节点身份完全对等，完全 Leaderless 化，去 ZK 和 HA 管控节点，能够做到非常高的可用性。同时相比传统的 Raft 一致性协议，该 Leaderless 架构能够做到副本数灵活选择，同步异步自动升降级，实现秒级故障转移。高可用架构目前已经完成开源并与 Dledger 进行了融合。 

- 云原生基础设施：可观测验能力云原生化，OpenTelemetry 标准化。整体架构走向 Kubernetes 化，能够充分利用售卖区的资源弹性能力。

![9.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500248951-38f30665-0357-4961-bc92-4df2784c324c.png#clientId=uafa6c11d-42c2-4&height=603&id=T7syq&name=9.png&originHeight=603&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0ff4444b-a2aa-4540-886e-349dc7f263f&title=&width=1080)

RocketMQ 4.0 推荐的接入方式主要是富客户端。富客户端提供了诸如客户端侧负载均衡、消息缓存、故障转移等一系列企业级特性。但在云原生时代，轻量级、高性能的客户端更容易被云原生技术栈所集成。

因此，RocketMQ 5.0 重磅推出了全新多语言轻量级 SDK，具有以下优势：

- **全新极简 API 设计**：不可变 API，有完善的错误处理。多语言 SDK 保障 API 在 Native 层面对齐。同时引入了全新的 Simple Consumer，能够支持按消息模型进行消费，用户不再需要关心消息队列，只需要关注消息。 

- **通信层采用 gRPC 协议**：拥抱云原生通信标准，gRPC 能够使服务更易被集成。多语言 SDK 通信代码也可以通过 gRPC 快速生成，更 Native 。 

- **轻量级实现**：采用无状态消费模式，能够大幅降低客户端的实现复杂度。客户端更轻量，采用的应用也更容易被 Serverless化、Mesh 化。 

- **云原生可观测性**：客户端实现了 OpenTelemetry 标准，能够支持以 OpenTelemetry 形式导出 Metrics 与 Tracing。

![10.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500249850-6dbd6c06-cd8a-4237-bee6-92b562314636.png#clientId=uafa6c11d-42c2-4&height=608&id=yD7Yi&name=10.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6d0251d7-9f73-4a92-b88c-feb05e39a30&title=&width=1080)

RocketMQ 5.0 的另一个重大升级是引入了全新的无状态消费模型。该消费模型完全构建在原先的队列模型之上。队列模型是与存储模型一致的消费模型，消费者完全按照队列做负载均衡，也按照队列做消息拉取，非常适合批量高速拉取以及对单条消息状态不敏感的场景，比如流计算等。

RocketMQ 5.0 推出了 PoP 机制，巧妙地在队列模型之上构建了消息模型，实现了鱼与熊掌兼得。在此消息模型的设计上，业务可以只关心消息而无需关心队列，所有 API 都能够支持单条消息级别的消费、重试、修改不可见时间、删除。

在消息模型下，消息发送过来被存储后，即对消费者可见。消费者通过 Receive Message API 对消息进行消费后，消息进入定时不可见状态。消息超时过后又会重新处于可见状态，能被其他消费者继续消费。某消费者确认消息后，服务端会对该消息进行删除，随即不可见。

基于消息系模型的消费流程下，API 完全面向消息而不是面向队列。而当 PoP 机制遇见了无状态 Proxy，除了存储层，其他节点都是无状态的；客户端、连接和消费也是无状态的，可任意在 Proxy 节点上飘移，真正做到轻量级。

![11.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500251963-06ed6933-8a44-42b2-a76e-fa79530bffb3.png#clientId=uafa6c11d-42c2-4&height=606&id=NVP3T&name=11.png&originHeight=606&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf69c781f-9bd1-4e77-ab36-5293d7e0010&title=&width=1080)

经过重构，RocketMQ 5.0 的可观测性也走向了云原生标准。

**Metrics 侧：**

- 指标涵盖丰富：设计了更丰富的指标，包含消息量、堆积量、各个阶段耗时等指标，每个指标从实例、Topic、消费 GroupID 多维度做聚合和展示。
- 消息团队实践模板：为用户提供实践模板，并持续迭代更新。
- Prometheus + Grafana：Prometheus 标准数据格式，利用 Grafana 展示。除了模板，用户也可以自定义展示大盘。

**Tracing 侧：**

- OpenTelemetry Tracing 标准：RocketMQ Tracing 标准已经合并到 OpenTelemetry 开源标准，提供了规范和丰富的 messaging tracing 场景定义。
- 消息领域定制化展示：按照消息维度重新组织抽象的请求 span数据，展示一对多的消费，多次消费信息直观且方便理解。
- 可衔接 tracing 链路上下游：消息的 tracing 可继承调用上下文，补充到完整的调用链路中，消息链路信息串联了异步链路的上游和下游链路信息。

**Logging 侧：**

- Error Code 标准化：不同的错误有唯一的 Error Code。
- Error Message 完整：包含完整的错误信息和排序所需要的资源信息。
- Error Level 标准化：细化了各种不同错误信息的日志级别，用户可根据 Error、Warn 等级别配置更适合的监控告警。

![12.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500252131-fa26ff1b-3c64-40d4-9184-035885b5431e.png#clientId=uafa6c11d-42c2-4&height=586&id=t82hE&name=12.png&originHeight=586&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u330e278b-7e2c-40f6-b3c1-35f84b16c77&title=&width=1080)

弹性方面，RocketMQ 5.0 商业版能够充分撬动云的计算、存储和网络的池化资源。比如在计算方面，RocketMQ 5.0 所有工作负载完全部署在 ACK 之上，充分利用了 ACK 弹性能力，撬动 ACK 弹性资源。主要依赖 ACK 的两项技术，一是弹性资源池，另一个是 HPA 支持计算能力快速弹性。同时也会在 ACK 之上做跨可用区部署以提供高可用保障。

网络层面，RocketMQ 5.0 也会充分利用阿里云网络设施，为用户提供更便捷的网络访问能力。比如 RocketMQ 5.0 实例能够支持公网随开随用，需要依赖公网做测试的时候即开即用，测试完立即关闭，安全与方便兼具。同时支持多种私网类型的网络形态，包括 Single Tunnel、Private Link，另外也基于 CEN 构建了全球互通设计网络。

存储方面，RocketMQ 5.0 商业版率先引入多级存储概念，基于 OSS 构建二级存储，能够充分利用 OSS 存储的弹性能力，存储计费也转向了按量付费。而用户能够在 RocketMQ 之上自定义消息存储时长，比如将消息从 3 天有效时长延长至 30 天，能够真正将消息变为数据资产。同时利用二级存储能力，将冷热数据分离，为用户提供一致的冷读 SLA 。

## RocketMQ 5.0 商业版发布预告

RocketMQ 4.0 历经了五年发展，开源和商业版本共同迈入了 5.0 时代。7 月底，阿里云消息队列将会基于开源版发布全新的 5.0 商业化版本。注：截止发稿前，RocketMQ 5.0 已经在阿里云消息队列 RocketMQ 产品上全新发布，目前支持国内主要地域。

![13.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500252912-fb5c8303-2616-4755-b056-7cea455991ad.png#clientId=uafa6c11d-42c2-4&height=603&id=HM0lK&name=13.png&originHeight=603&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5c5da9e6-5259-4597-a85f-8dc67980adb&title=&width=1080)

RocketMQ 5.0 版相对于 4.0 版实例主要有以下几大改变：

第一，新版本、新售卖，更便宜。新版本采取了全新计量方式，有包年、包月型，也有按量付费和公网流量弹性计费。也有更全的售卖体系，比如新增专业版实例，能够满足部分用户需求。同时每个商品系列都新增了测试环境专用实例，能够方便用户以低成本的方式搭建自己的开发环境。

第二，更强弹性，降本提效利器。存储完全走向弹性，能够通过 Serverless 按需使用，按量付费。预留弹性，实例基础规格支持实时升降配，用户可以很方便地在流量到来之前做弹性。此外，专业版支持突发流量弹性，能够解决线上稳定性风险。

第三，全新架构，增强可观测运维。无状态消息消费模型能够解决一些老版本的痛点。同时在可观测上全面采取了云原生接入栈。

## 消息的全新形态：事件总线 EventBridge

事件总线 EventBridge 已经开源到 RocketMQ 社区中。云原生时代，事件无处不在，云计算资源散落在各地，各类生态孤岛随处可见。因此，以事件和事件驱动的方式来集成这一切是大势所趋。

基于此，阿里云推出了全新事件型产品 EventBridge。该产品构建在 RocketMQ 之上，是 RocketMQ 之上的一个事件驱动架构实践。

![14.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500254845-faaa3663-a421-4f17-a25e-79ad1819b4cd.png#clientId=uafa6c11d-42c2-4&height=600&id=yTfvx&name=14.png&originHeight=600&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1165425e-88b9-408d-a1d8-f76db1e6d40&title=&width=1080)

EventBridge 的事件源包括阿里云服务的管控事件比如资源变更事件、审计事件、配置变更事件，阿里云服务的数据事件，也包括自定义应用、SaaS 应用、自建数据平台、其他云厂商服务等。

事件经过 EventBridge 处理后会投递到事件目标，事件目标包括函数计算、消息服务、自建网关、HTTP(S)、短信、邮箱、钉钉等。

事件源到事件目标之间会经历完整的事件处理，包括事件源接入到 EB 后，可以对事件进行过滤、转换、归档、回放等。事件在 EventBridge 整个流程中也有完善的可观测性设计，包括事件查询、链路追踪。事件的接入方式非常丰富，可以通过 OpenAPI 来接入、7 种多语言 SDK、CloudEvents SDK、Web Console 和 Webhook 。

EventBridge 具有如下特点：

- 能够大幅度减少用户开发成本，用户无需额外开发，通过创建 EventBridge 源、事件目标、事件规则等资源即可实现事件架构。用户可以编写事件规则，对事件做过滤、转换。 

- 提供原生 CloudEvents 支持，拥抱 CNCF 社区，能够无缝对接社区 SDK 。标准协议也能统一个阿里云事件规范。 

- 事件 Schema 支持：能够支持事件 Schema 自动探测和校验，支持 Source 和 Target 的 Schema 绑定。 

- 全球事件任意互通：组建了全球事件任意互通网络，组件了跨地域、跨账户的事件网络，能够支持跨云、跨数据中心的事件路由。

![15.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500255756-fa379aae-125b-4490-8a3a-73ccf073056a.png#clientId=uafa6c11d-42c2-4&height=602&id=r1bvx&name=15.png&originHeight=602&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9eb20352-e2a8-4891-af43-5571d717d71&title=&width=1080)

EventBridge在云上生态已经初具规模，已经集成了 255+ 云产品事件源和 1000+ 事件类型。

EventBridge率先对消息生态做了融合。阿里云的消息产品矩阵生态均通过 EventBridge 做了完全融合。任何一款消息产品与另一款消息产品的数据都能互通。同时，依靠 EventBridge 的全球事件网络，能够为所有消息产品赋予全球消息路由的能力。

EventBridge 目前已经在内部接入钉钉 ISV、聚石塔 ISV，外部也有 50+ SaaS 系统可以通过 Webhook 的方式接入。另外，海量事件源可以触达 10 多种事件目标，已经对接了全系云产品 API ，任何事件都可以驱动全量云产品 API。

作者介绍：
周新宇 - Apache Member，Apache RocketMQ PMC Member，阿里云消息队列 RocketMQ 研发负责人。

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)


