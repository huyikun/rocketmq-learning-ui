---
title: "云消息队列 Confluent 版正式上线！"
description: "云消息队列 Confluent 版正式上线！"
date: "2025-06-13"
category: "announcement"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

## <font style="color:#2F8EF4;">前言</font>
<font style="color:rgba(0, 0, 0, 0.9);">在 2023 年杭州云栖大会上，Confluent 成为阿里云技术合作伙伴，在此基础上，双方展开了深度合作，并在今天（3月1日）正式上线“云消息队列 Confluent 版”。</font>

<font style="color:rgba(0, 0, 0, 0.9);">通过将</font><font style="color:rgba(0, 0, 0, 0.9);"> Confluent 在 Apache Kafka 领域的专业技术及实战经验与阿里云</font><font style="color:rgba(0, 0, 0, 0.9);">强大的</font><font style="color:rgba(0, 0, 0, 0.9);">云基础设施及服务体系相结合，基于 Apache Kafka 核心能力构建符合企业级标准的全托管消息队列服务，为企业客户提供更加高效、安全和兼容性更强的云原生消息队列解决方案。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">详情请参见：</font>**[<font style="color:rgb(87, 107, 149);">Confluent 与阿里云将携手拓展亚太市场，提供消息流平台服务</font>](http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247558643&idx=2&sn=28174aa7c554f5a5819af5637571172d&chksm=fae7ee3ccd90672a3dee10ab1fec3bf2d47202cd6289912da3a5980a90b7eb8dacfb793db8fe&scene=21#wechat_redirect)

## <font style="color:#2F8EF4;">什么是 Confluent Platform？</font>
<font style="color:rgba(0, 0, 0, 0.9);">Confluent 是一家专注动态数据（Data In Motion）的公司，以开源技术 Apache Kafka</font><font style="color:rgba(0, 0, 0, 0.9);">®</font><font style="color:rgba(0, 0, 0, 0.9);"> 为核心打造实时的消息流平台，在业内有着深厚的影响力，已被金融服务、全渠道零售、汽车和游戏等众多行业广泛应用。</font>

<font style="color:rgba(0, 0, 0, 0.9);">Confluent Platform 是一个综合性的企业级数据流处理平台，用户能够以实时、连续的流形式，轻松地访问、存储和管理数据。它由 Apache Kafka 的原始创建者开发，不仅继承了 Kafka 的核心优势，还通过增加企业级特性来扩展其功能，同时大幅降低了对 Kafka 的管理和监控压力。Confluent Platform 通过引入高级特性，进一步增强了 Kafka 的能力，旨在加快应用程序的开发和集成，通过流处理实现数据转换，简化大规模的企业级操作，并满足严格的体系结构要求。</font>

<font style="color:rgba(0, 0, 0, 0.9);">Confluent Platform 让用户专注于从数据中获取业务价值，而不必担心底层机制问题 —— 例如，数据如何在不同的系统之间进行传输或集成？具体来说，Confluent Platform 极大地简化了包括将数据源接入 Kafka、构建流应用程序，保护、监控以及管理 Kafka 基础设施的整个过程。</font>

<font style="color:rgba(0, 0, 0, 0.9);">Confluent Platform 已广泛应用于众多行业，如金融服务、全渠道零售、自动驾驶、欺诈监测、微服务和物联网等。详情请参见 What is Confluent Platform</font><sup>**<font style="color:#2F8EF4;">[1]</font>**</sup><font style="color:rgba(0, 0, 0, 0.9);">。</font>

#### <font style="color:rgba(0, 0, 0, 0.9);">Confluent 成为现代技术栈的中枢神经系统</font>
![](https://img.alicdn.com/imgextra/i2/O1CN01huMlC522Qj4WkWqV7_!!6000000007115-49-tps-1080-526.webp)

#### <font style="color:rgba(0, 0, 0, 0.9);">Confluent Placement 在 《Forrester Wave</font><font style="color:rgba(0, 0, 0, 0.9);">™</font><font style="color:rgba(0, 0, 0, 0.9);">》报告中的位置</font>
#### ![](https://img.alicdn.com/imgextra/i2/O1CN01ItnHDY1VlRfYoZ4My_!!6000000002693-49-tps-668-783.webp)
> 《Forrester Wave™》报告由 Forrester Research, Inc. 版权所有。Forrester 和 Forrester Wave™ 是 Forrester Research, Inc. 的注册商标。Forrester 不对《Forrester Wave™》中所描绘的任何供应商、产品或服务进行背书。信息基于最佳可用资源，并且意见反映的是当时判断，可能随时发生变化。
>

#### **<font style="color:rgba(0, 0, 0, 0.9);">Confluent Platform 与开源 Kafka 的功能对比</font>**
#### ![](https://img.alicdn.com/imgextra/i4/O1CN01d7mq9K1LQFB3EBvvM_!!6000000001293-49-tps-710-889.webp)
#### ![](https://img.alicdn.com/imgextra/i1/O1CN01Fonh6I27te9zgjuVX_!!6000000007855-49-tps-679-453.webp)
## <font style="color:#2F8EF4;">云消息队列 Confluent 版发布速览</font>
#### **<font style="color:rgba(0, 0, 0, 0.9);">什么是云消息队列 Confluent 版？</font>**
云消息队列 Confluent 版是阿里云与 Apache Kafka 项目创始团队所创立的 Confluent 公司合作，在 Apache Kafka 核心能力基础上为企业提供的一站式、高效可靠的，集成消息流式处理与大数据系统的一体化解决方案。

利用云消息队列 Confluent 版，可以快速构建和扩展与生产集群规模相匹配的企业级 Kafka Confluent 集群，有效地应对以下常见痛点：

<font style="color:#2F8EF4;">1. 对云端全托管企业级 Kafka 服务有迫切需求</font>

如果需要云端全面托管的企业级 Kafka 服务时， 云消息队列 Confluent 版能够提供官方授权的 Confluent Platform 许可证，以经济高效的途径获取全套企业级特性。

<font style="color:#2F8EF4;">2. Kafka 集群搭建及运维复杂性挑战大</font>

借助云消息队列 Confluent 版的一站式服务， 在短短几十分钟内高效就能完成从机型选配、集群部署到消息事件处理的全流程操作，这将极大地节省用户自行部署和管理集群大数据系统的所需时间和成本投入。



云消息队列 Confluent 版是一个流消息平台，能够组织管理来自不同数据源的数据，是一个稳定高效的系统。如下图所示，它由六个组件构成，分别为 Kafka Broker、Rest Proxy、Connect、Zookeeper、ksqlDB、Control Center。

> 说明：默认情况下，云消息队列 Confluent 版集群 Kafka Broker、Rest Proxy、Connect、Zookeeper、ksqlDB、Control Center 组件的副本数分别为 3、2、2、3、2、1，也可以根据实际的业务需求设置合适的副本数量。
>

![](https://img.alicdn.com/imgextra/i1/O1CN01xf3bS023YnfazUb9Y_!!6000000007268-49-tps-1080-625.webp)

#### <font style="color:rgba(0, 0, 0, 0.9);">云消息队列 Confluent 版有哪些优势？</font>
<font style="color:#2F8EF4;">1. Apache Kafka 原厂商业化产品</font>

Confluent 团队倾力打造，其对 Kafka 项目贡献了超过 80% 的代码量，并积累了逾百万小时的技术实战经验；在 Apache Kafka 基础上进行了深度扩展和强化，为企业客户提供安全、稳定且性能卓越的企业级流数据处理平台。

<font style="color:#2F8EF4;">2. 高 SLA 保障，数据持久化</font>

确保消息数据持久化存储于消息队列中，即使在海量消息堆积情况下，仍可保持集群的高吞吐能力；提供全自动巡检运维保障体系，服务可用性 99.95%，确保业务连续性和数据可靠性。

<font style="color:#2F8EF4;">3. 免运维，易观测</font>

提供核心链路健康巡检，集群自动诊断及异常告警；每个消费组都可以针对消息堆积量设置监控和告警策略，以便及时发现和解决问题；提供完备的管控类 OpenAPI，实现各类资源的管理和运维。

<font style="color:#2F8EF4;">4. 开箱即用，无缝迁移</font>

全托管的 Confluent Platform 服务，无需搭建和运维基础设施环境，真正做到开箱即用；支持无缝迁移现有工作负载，无需修改任何代码，大幅降低了迁移成本和技术风险，轻松享有云计算弹性扩展、高可用和全球部署等优势。

#### 云消息队列 Confluent 版的核心功能
+ **多语言开发**：支持各种主流编程语言，如 Java、Python 和 Scala，便于开发团队使用熟悉的语言构建应用。
+ **丰富的内置生态系统**：内置企业级 Connectors，MQTT 代理以及 Schema Registry 等强大的生态工具。
+ **全兼容 Apache Kafka**：在 Apache Kafka 强大功能基础上构建，并始终保持对 Apache Kafka 的兼容性。
+ **消息流数据库 ksqlDB**：基于轻量级 SQL 语句的事件流数据库，极大地简化了数据流处理应用的构建过程。
+ **云资源弹性扩展能力**：基于强大的云基础设施，获得灵活且弹性的计算与存储资源，实现灵活地按需扩展。
+ **企业级安全能力**：支持 SSL 认证、RBAC 访问控制，以及可整合外部 LDAP，提供严格的企业级安全保障。
+ **企业级解决方案售后支持**：阿里云与 Confluent 共同提供全天候 24 x 7 x 365 专业客户服务和技术支持。
+ **阿里云产品集成互联互通**：阿里云 Flink、Databricks、EMR 等平台无缝集成进行数据消费和分布式计算。



#### 云消息队列 Confluent 版的应用场景
+ **<font style="color:rgba(0, 0, 0, 0.9);">通用数据流动性</font>**

<font style="color:rgba(0, 0, 0, 0.9);">拥抱云计算，并维护一个持久稳定的数据通道，以确保所有本地、混合云和多云环境中的数据同步。在逐步迁移到云端过程中，开发者能够充分利用先进的云计算工具，更高效地构建下一代应用程序。</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">人工智能</font>**

<font style="color:rgba(0, 0, 0, 0.9);">人工智能模型的性能优劣很大程度上取决于输入的数据质量。为人工智能系统和应用提供实时、上下文相关、高度管控、值得信赖的数据，能够高效地推动人工智能驱动的应用程序实现规模化生产与交付。</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">客户洞察与体验优化</font>**

<font style="color:rgba(0, 0, 0, 0.9);">实时响应客户互动行为，构建一个全面详尽的数据视图，去标识化地分析客户，以高效的方式实现与客户的互动——实时跨所有数据孤岛和系统，提供个性化的体验。</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">事件驱动型微服务</font>**

<font style="color:rgba(0, 0, 0, 0.9);">通过采用松耦合的微服务架构设计，能够实现更高的敏捷性和更快的创新。使用 Confluent 将微服务彻底解耦，统一服务间的通信标准，并且有效消除维护独立数据状态的繁琐需求。</font>

#### <font style="color:rgba(0, 0, 0, 0.9);">云消息队列 Confluent 版的版本说明</font>
<font style="color:rgba(0, 0, 0, 0.9);">云消息队列 Confluent 版对外提供两个版本，不同版本提供的功能不同，价格也不相同，详情请参见计费说明</font><sup>**<font style="color:#2F8EF4;">[2]</font>**</sup><font style="color:rgba(0, 0, 0, 0.9);">。</font>

<font style="color:rgba(0, 0, 0, 0.9);">版本的功能对比如下：</font>

![](https://img.alicdn.com/imgextra/i2/O1CN01mfnVKG1VnHFmH5MIR_!!6000000002697-49-tps-1080-738.webp)

## <font style="color:#2F8EF4;">如何快速上手云消息队列 Confluent 版？</font>
<font style="color:#2F8EF4;">1. 集群资源规格评估</font>

对于云消息队列 Confluent 版集群来说，影响资源使用的因素众多，包括使用的业务场景、业务应用程序性能等，我们结合一般场景给出云消息队列 Confluent 版集群资源评估参考建议，帮助用户在购买创建集群时评估集群规模。在集群创建完成后，仍然可以根据实际的资源使用率进行集群扩容来变更集群的资源配置。

<font style="color:#2F8EF4;">2. 购买和部署实例</font>

在使用 Confluent 集群前，需要先购买和部署实例。部署完成后，在实例详情页面，通过登录控制台进行 Control Center 登录，对集群的主要操作将在 Control Center 中进行。

![](https://img.alicdn.com/imgextra/i2/O1CN01u0t3K01siSFINe329_!!6000000005800-49-tps-604-472.webp)

<font style="color:#2F8EF4;">3. 权限管理</font>

作为集群安全的一部分，云消息队列 Confluent 版提供了用户管理功能，可以在控制台用户管理页面完成新增用户、删除用户等操作。此外，云消息队列 Confluent 版还支持 ACL 授权、RBAC 授权功能，支持使用 Control Center 或者安装命令行界面（CLI）进行相关操作。

**<font style="color:rgba(0, 0, 0, 0.9);">在 Control Center 页面进行 RBAC 授权</font>**

![](https://img.alicdn.com/imgextra/i4/O1CN01Zy0QYO1oVOUJTTPhS_!!6000000005230-49-tps-1080-592.webp)

![](https://img.alicdn.com/imgextra/i1/O1CN01vHLaW71T5eIElHe8G_!!6000000002331-49-tps-1080-515.webp)

![](https://img.alicdn.com/imgextra/i2/O1CN0183AAtZ1ysQZ2dcQMW_!!6000000006634-49-tps-1080-1054.webp)

<font style="color:#2F8EF4;">4. 集群配置与使用</font>

云消息队列 Confluent 版支持集群的网络访问与安全设置，跨集群进行数据的镜像和复制等操作，还可以通过云消息队列 Confluent 版的核心管理服务 Control Center 进行集群的可视化监控，以及检测监控数据中的异常事件并配置告警，还可以使用 Schema Registry 管理 Schema，使用 KsqlDB 简单的、完全交互式的 SQL 接口进行流处理操作。云消息队列 Confluent 版也支持安装命令行界面（CLI）进行相关操作。

**<font style="color:rgba(0, 0, 0, 0.9);">Brokers Overview 查看 Producer、Consumer 监控指标</font>**

![](https://img.alicdn.com/imgextra/i1/O1CN01WO3M961JXuZnfVJzY_!!6000000001039-49-tps-1080-531.webp)

![](https://img.alicdn.com/imgextra/i4/O1CN01GUIvMr1Xg4FYbnE9a_!!6000000002952-49-tps-794-359.webp)

阿里云和 Confluent 的合作始于 2021 年，双方联合发布了消息流服务，用户可以通过阿里云市场获得 Confluent 消息流平台服务，在节省部署集群大数据软件成本的同时，大幅度提升开发效率，并以企业级安全性处理消息流。



**相关链接：**



[1] What is Confluent Platform

[https://docs.confluent.io/platform/current/platform.html](https://docs.confluent.io/platform/current/platform.html)

[2] 计费说明

[https://help.aliyun.com/zh/apsaramq-for-kafka/cloud-message-queue-confluent-edition/confluent-billing-overview](https://help.aliyun.com/zh/apsaramq-for-kafka/cloud-message-queue-confluent-edition/confluent-billing-overview)

[3] 阿里云消息队列控制台

[https://account.aliyun.com/login/login.htm?oauth_callback=https%3A%2F%2Fkafkanext.console.aliyun.com%2Fcn-hangzhou%2Fconfluent%3Ffrom%3Dlists&lang=zh](https://account.aliyun.com/login/login.htm?oauth_callback=https%3A%2F%2Fkafkanext.console.aliyun.com%2Fcn-hangzhou%2Fconfluent%3Ffrom%3Dlists&lang=zh)


