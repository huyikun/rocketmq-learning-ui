---
title: "生于云、长于云，RocketMQ 5.0再出发"
date: "2022/07/22"
author: ""
img: "https://img.alicdn.com/imgextra/i2/O1CN015LKToj1LpQjRJXu4K_!!6000000001348-0-tps-685-383.jpg"
tags: ["dynamic"]
description: "万物皆云的时代，RocketMQ 让数字化转型更简单高效，也将消息、事件、流的价值最大程度释放。Apache RocketMQ 将不断推动技术演进与落地实践，帮助企业真正实现高质量数字化转型与创新。"
---
      7 月 21 日-7 月 22 日，由 Apache RocketMQ 社区主办，阿里云天池平台、云原生应用平台承办的首届 RocketMQ Summit 全球开发者峰会拉开帷幕。Apache RocketMQ 联合创始人林清山发布 RocketMQ 能力全景图，为众多开发者阐述 RocketMQ 5.0 的技术定位与发展方向，来自快手、小米、字节跳动等互联网头部企业的 40 位演讲嘉宾与众多开发者分享各自行业的最佳实践与技术探索经验。

阿里云云原生应用平台负责人丁宇表示，开源让云计算更加的标准化、云计算让开源产品化和规模化，未来的数字世界，将构建在云计算和开源之上。阿里巴巴将以开源的方式，践行开放共享好科技理念，把开源作为技术战略的重要组成部分。

今天，阿里巴巴的开源项目总数超过 3000 个，涵盖云计算、大数据、AI、中间件、数据库、容器、Serverless、高可用等领域，拥有超过 30000 名 Contributor，超过百万 Star，位列中国企业社区贡献榜首，连续十年蝉联中国厂商开源活跃度第一、影响力第一。未来，阿里云也将会持续投入 RocketMQ 的开源建设，构建更加繁荣的社区生态。希望与更多的开发者、贡献者一起，追求极致、开放共享，实现开源技术的普惠。

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492646027-aad98c91-3b2a-4f98-bfd3-1fc704b0d18a.png#clientId=u7c4ad3bf-943a-4&height=608&id=wFHHj&name=1.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua6f262c0-0df3-49b0-bc88-ce7f5bf53c7&title=&width=1080)

## 基于自身实践，RocketMQ 社区对于消息队列演进趋势的洞察


消息队列作为最经典的中间件之一，已经有三十多年历史。伴随着技术发展，消息队列领域不断扩展，迸发新生命力，作为国内大规模实践先行者，RocketMQ 社区认为消息领域将迎来以下趋势变化：

### 1. 全面拥抱云原生

消息队列将向上演进消息型的产品形态，更好去支撑微服务、事件驱动、Serverless 化等云原生应用架构；向下演进消息系统自身云原生架构，通过系统重构充分释放基础设施的弹性计算、存储、网络等能力，全方位提升消息技术指标，降低消息成本，提高消息队列弹性能力。

### 2. 全面拥抱物联网

物联网技术将更广泛的落地到各行各业，万物互联、边缘计算进一步拓展消息的边界。面向物联网的消息队列要海量异构设备接入，海量消息队列存储，能够随处运行，具备云边端一体的无边界部署能力。

### 3. 全面拥抱实时数据

企业的数字化转型的步伐不断加速，从业务数字化迈向数字业务化。数字化企业持续产生业务数据，对业务数据实时洞察与决策，才能帮助企业快速响应商机、把握商机，使得业务获得更大成功。同时，消息队列也将从在线业务架构的基础设施延伸到实时数据架构的基础设施，达到事务分析一体化。

## 四大方向，全面解读 RocketMQ 5.0 架构演进


![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492647706-478a9e1b-66a7-41fc-90fb-4c8151351fcd.png#clientId=u7c4ad3bf-943a-4&height=608&id=Ekxgu&name=2.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u04e71bed-6cc6-4f5c-926e-b57d62a5c61&title=&width=1080)

### 1. 面向微服务

引入微服务架构，数字化企业以“高内聚、低耦合”的方式高效协作。微服务架构也带来新问题，比如大量同步微服务会面临延迟增大、可用性降低等风险。为了解决这个问题，越来越多的企业引入消息队列建设异步微服务体系，进一步提高微服务的韧性，降低响应延迟。

业界的微服务技术趋势，一方面是已经形成了事实标准，比如说像 Spring Cloud 体系，Dubbo 体系，通信协议有 HTTP、AMQP 等，另一方面下一代的微服务体系也在快速发展中，主要体现在基础设施下沉，比如 Servicemesh，Serverless 等技术。

在这个趋势下，RocketMQ 5.0, 在 SDK 层面将原来的重型客户端往轻量客户端演进，基于标准 gRPC 作为 remoting 层实现 SDK，同时也将更多客户端逻辑下沉到服务端，比如消息重试、负载均衡等，大幅度降低多语言 SDK 的实现成本。轻量客户端更好的匹配了 ServiceMesh 的需求，RocketMQ 的 Mesh 能力已正式合入 CNCF Envoy 官方社区。

在负载均衡方面，RocketMQ 从原来的队列粒度负载均衡演进到了消息粒度负载均衡模式，消息粒度负载均衡更加匹配 Serverless 应用的场景，无状态 Serverless 应用弹性伸缩过程不会触发频繁的队列重平衡，降低消息重复率和端到端延迟。

RocketMQ 5.0 提供无状态 proxy，通过 proxy 可以很方便的扩展更多标准消息协议以及流量治理功能。无状态 proxy 也具备良好的的网络穿透能力，可以灵活应对企业在上云过程中面临复杂跨网络访问场景。

今天我们以 RocketMQ 5.0 核心能力为基础，支撑了阿里云 RocketMQ、MNS、RabbitMQ 等多款云消息产品。其中阿里云 RabbitMQ 是一款兼容 AMQP 协议、RabbitMQ SDK 的消息服务，可以帮助开源存量用户无缝上云。同时它也充分释放了底层 RocketMQ 云原生架构的技术红利，具备和 RocketMQ 一致的高性能、无限扩展、高可用等特点，是云原生的 RabbitMQ。

### 2. 事件驱动（EDA）

事件驱动在 18 年被 Gartner 评为年度十大技术趋势。在未来新型的数字化商业解决方案中，会有 60% 以上的商业数字化解决方案采纳 EDA 架构。EDA 为软件架构带来彻底解耦，实现更灵活的业务扩展和业务敏捷能力，不仅可以用于单一业务领域的微服务解耦，还可以用于跨部门、跨组织、跨业务领域的事件集成。消息队列是 EDA 架构中最核心的组件，承担 eventbroker 的职责。随着 EDA 架构被大规模跨组织的落地，要进一步提高行业级生产力，标准化也迫在眉睫。为此 CNCF 推出了 CloudEvent 规范，基于统一的规范，跨系统、跨组织的数字化协同有了共同的“语言”，能够实现更高效的系统集成，有了规范也方便沉淀面向事件的统一基础软件设施，提高研发效率。

面向 EDA 趋势，RocketMQ 5.0 发布全新产品形态——Eventbridge。整个领域模型以事件为中心，并拥抱 CloudEvent 规范，CloudEvent 社区开源 SDK 可无缝接入 Eventbridge。同时，还提供各种低代码事件编排、过滤、路由能力，灵活实现各种事件集成。

今天我们以 RocketMQ 5.0 核心能力为基础，支撑了阿里云 EventBridge 产品，助力云客户实现事件驱动、事件集成的商业生态。

### 3. 物联网

全球的 IoT 设备爆发式增长，预计到了 2025 年将达到 200 多亿台，。并且物联网也带来了边缘计算的兴起，未来将有 75% 的数据将在传统数据中心或云环境之外进行处理。目前物联网行业已经形成了多个标准协议，其中最流行莫过于 MQTT，这是"发布-订阅"模式的消息协议，除此之外还有各种车联网协议、工业协议等等，物联网消息队列要具备多样化异构海量设备接入能力。RocketMQ 可作为物联网应用的基础通信设施，用于 IoT、移动设备的数据上报，还有指令下行，为 IoT 业务连接云边端。

面向 IoT 的趋势，RocketMQ 5.0 发布轻量级百万队列引擎，轻量元数据服务。在新存储内核之上，建设物联网形态消息队列 MQTT，支持标准物联网协议，支持海量物联网设备接入和海量队列存储。

RocketMQ 5.0 遵循零外部依赖的精简架构原则，新 HA 架构为低资源消耗场景提供更多选择，用户可以权衡可靠性、成本、可用性，选择最优副本策略。比如边缘场景由于资源受限，RocketMQ 不一定需要提供三副本存储，可以是 2 副本，甚至是单副本就能满足业务需求。

今天以 RocketMQ 5.0 核心能力为基础，支撑了阿里云微消息队列 MQTT，为客户提供云端一体化消息解决方案，实现万物互联、云端互联。

### 4. 实时大数据

未来大数据将走向实时化，预测在 2025 年实时大数据的比例将达到 30%。数字化企业通过实时感知、实时分析、实时决策，能够抓住商机、快速响应用户，实时大数据的重要性愈发突出。消息队列是实时大数据的关键技术之一，作为事件流的核心存储，它承担数据的分发，数据的缓冲，还有轻量的流处理的作用。

事件流技术越来越多的在 IoT 场景进行使用，IDC 预测未来 95% 的实时事件流将来自IoT场景；另外有越来越多的交易事件需要进行实时分析，挖掘更多业务价值，事件流技术也开始呈现事务分析一体化的趋势。

面向事件流的趋势，RocketMQ 5.0 在流存储和流分析能力进行重点打造：

- 流存储方面，支持批量索引，大幅度提高 RocketMQ 吞吐量。支持 compacttopic，用于实现流处理过程中的状态存储，零外部依赖。除了功能特性之外，RocketMQ 5.0 的流存储同时进行了云原生架构改造，引入逻辑队列的概念，解耦了数据逻辑分区跟物理存储之间的绑定关系，能够实现全局固定分区前提下进行无缝扩缩容，零数据迁移。
 
- 流分析方面，RocketMQ 5.0 全新发布了轻量的流计算引擎，它可以兼容 flink SQL，方便用户在不同场景无缝切换。如果用户需要大而全流计算能力，可以使用大型计算平台。如果用户有边缘计算、资源受限、简单流处理场景可以直接使用 RocketMQ 的 RSQL 来支持。

今天我们以 RocketMQ 5.0 事件流能力为基础，支撑了阿里云 Kafka 产品，存量 Kafka 用户实现无缝上云。同时基于 RocketMQ 的逻辑队列能力，阿里云 Kafka 具备快速弹性伸缩能力，提供了 Serverless 化的产品形态。让存量 Kafka 用户也能够体验到云原生架构的红利。

## 不断演进，RocketMQ 正式迈进 5.0 时代


在过去七年大规模云计算实践中，RocketMQ 不停自我演进。今天 RocketMQ 正式迈进了 5.0 的时代。从互联网业务消息中间扩展到“消息、事件、流”超融合处理平台，解锁了更全面能力。

在消息领域，全面拥抱云原生技术，以获得更好的弹性伸缩。在事件领域产品形态进行全面升级，拥抱行业标准，让事件驱动的架构无处不在，从单一业务的数字化系统扩展到跨组织跨业务的数字化商业生态事件驱动的架构，也同时让云计算原生的技术能够更大规模的落地，提高云产品跟用户业务的集中度。让 Serverless 的技术能够被更大范围的采纳，帮助企业客户去降本增效。在流存储和流计算领域，流存储增强批量的特性，大幅度提高 RocketMQ 数据吞吐量，新增逻辑队列能力，解耦逻辑资源跟物理资源，在流场景也具备无缝伸缩能力；新增轻量流处理引擎也提供了实时事件流处理、流分析能力。

RocketMQ 基于端云一体化架构，实现完整物联网消息队列能力，从原来连接应用扩展到连接物联网设备。同时 RocketMQ 5.0 也继续保持着极简架构原则，即便产品能力全面提升，也依然能够以最低资源消耗，最低运维代价去搭建服务。

现在 RocketMQ 已经真正具备连接一切，随处运行的能力，提供云、边端一体化实时数据解决方案。物联网设备持续的产生的数据，边缘 RocketMQ 可以进行实时数据分析，快速响应业务。通过实时 ETL，实时决策产生的高价值事件，或者数据可以传输到云端，通过 RocketMQ  eventing 能力连接更强大的公有云平台，利用云的一站式平台技术，进一步放大每份数据的价值。

## 不止于开源，RocketMQ 赋能海量行业客户


今天，基于 RocketMQ 5.0 为内核，阿里云也打造一站式消息平台，在统一云原生消息内核基础上，提供 6 种消息产品形态，有面向 IoT 场景的微消息队列 MQTT，有面向 EDA 场景的 EventBridge，有面向开源用户无缝上云的托管开源产品如 Kafka、RabbitMQ、RocketMQ。

通过多样化产品形态，RocketMQ 在阿里云上面已服务数万个企业用户，帮助其完成数字化转型的同时。RocketMQ 也得到业界的广泛认可。近期获得多个奖项，包括 OSCHINA 优秀技术团队奖、中国开源云联盟优秀基础软件、中国科学技术协会颁布的科创中国开源创新榜等，并进入 Apache 中国开源项目领导者象限。RocketMQ 成为第一个通过信通院可信云分布式消息队列服务的“增强级”认证，第一个通过信通院金融级稳定性评测的“先进级”认证。

随着潜在用户数的增大，RocketMQ 的商业价值也被进一步的放大。目前已经有十家的云厂商提供 Apache RocketMQ 的商业服务，它几乎覆盖了国内主流的公共云厂商。这样 RocketMQ 的用户就有了更多的选择，真正实现无厂商锁定，RocketMQ 已经成为原生消息的事实标准。

万物皆云的时代，RocketMQ 让数字化转型更简单高效，也将消息、事件、流的价值最大程度释放。Apache RocketMQ 将不断推动技术演进与落地实践，帮助企业真正实现高质量数字化转型与创新。

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)