---
title: "Apache RocketMQ 荣获 2024 开源创新榜单“年度开源项目”"
description: "Apache RocketMQ 荣获 2024 开源创新榜单“年度开源项目”"
date: "2024-12-20"
category: "event"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

近日，以“新纪天工、开物焕彩——致敬开源的力量”为活动主题的“重大科技成就发布会（首场）”在国家科技传播中心成功举办，并隆重揭晓了 2024 开源创新榜单，旨在致敬中国开源力量，传播推广开源科技成就，营造中国开源创新生态。  

2024 年开源创新榜单由中国科协科学技术传播中心、中国计算机学会、中国通信学会、中国科学院软件研究所共同主办，中国开发者社区承办，以王怀民院士为首组建评审委员会，进行研讨评审，面向中国开源行业领域，遴选具有创新性、贡献度和影响力的开源项目、社区、应用场景与开源事件。  

在评审出的 10 个年度开源项目中，**Apache RocketMQ 成功入选**。

## Apache RocketMQ 社区近况
### Apache RocketMQ 创新论文连续被软件工程顶级会议录用
（1）2024 年 9 月，由阿里云消息队列团队发表的关于 RocketMQ 锁性能优化论文《Beyond the Bottleneck: Enhancing High-Concurrency Systems with Lock Tuning》被 CCF-A 类软件工程顶级会议 FM 2024 录用。  

高并发系统常常面临性能瓶颈，主要是由于线程间激烈竞争锁导致的等待和上下文切换。作为一家云计算公司，我们非常重视性能的最大化。为此，我们对轻量级自旋锁进行了改进，并提出了一种简洁的参数微调策略，能够在最低风险条件下突破系统性能瓶颈。该策略在高吞吐量消息队列系统 Apache RocketMQ 中得到了验证，实现了 X86 CPU 性能提升 37.58% 和 ARM CPU 性能提升 32.82%。此外，我们还确认了这种方法在不同代码版本和 IO 刷新策略下的一致有效性，显示出其在实际应用中的广泛适用性。这项工作不仅为解决高并发系统的性能问题提供了实用工具，还突显了形式化技术在工程问题解决中的实际价值。

![](https://img.alicdn.com/imgextra/i3/O1CN01T79n9n1oNbiE6SKcz_!!6000000005213-0-tps-1080-1631.jpg)

（2）2023 年 9 月，由阿里云消息队列团队发表的关于 RocketMQ 高可用范式设计论文《RocketHA: A Log-based Storage High Availability Paradigm for Messaging and Streaming Scenarios》被软件工程 CCF-A 类顶级会议 ASE 2023 录用。  

该论文详细探讨了 RocketMQ 在其发展历程中所蕴含的高可用性设计理念，凝聚了团队在行业应用中积累的宝贵经验。为了应对分布式系统中常见的故障，如崩溃和网络分区，RocketHA 提出了一种基于日志存储的高可用性设计框架。该框架由六个基本组件构成，旨在实现系统在面对各种故障时的自动集群恢复。具体而言，RocketHA 通过模块化设计，实现了消息、事件及流场景的高可用性，确保系统能够在发生意外故障时迅速且有效地恢复。此外，该设计还优先考虑了高吞吐量与数据丢失防护，以保障系统在进行大规模数据处理时的稳定性和可靠性。评估结果表明，RocketMQ 在多种负载和故障场景下都表现出卓越的高可用性和快速恢复能力。本文提出的 RocketHA 的设计理念可为其他基于日志存储的系统提供参考和借鉴，推动相关领域的研究与开发。

![](https://img.alicdn.com/imgextra/i3/O1CN01ghcEuZ1zCZwvAKVJB_!!6000000006678-0-tps-1298-1658.jpg)

### GSoC(Google Summer of Code) 2024
在谷歌主办的 GSoC 2024 中，Apache RocketMQ 开源社区共提报通过两个选题：

1. RocketMQ Dashboard Supports RocketMQ 5.0 Architecture and Enhances Usability：该题目旨在强化 RocketMQ 的开源控制台能力。

2. Optimizing Lock Mechanisms in Apache RocketMQ：该题目旨在优化锁行为，优化 RocketMQ 的性能以及资源占用。  

两个题目均成功结项，第一个题目为 Apache RocketMQ 发布了 rocketmq-dashboard 2.0.0，自此RocketMQ Dashboard 支持 Apache RocketMQ 5.0 。第二个题目创新性地提出了 ABS 锁，为轻量化的自旋锁提供了一套退避策略，从而实现低成本、有限制的锁自旋行为，同时适应不同强度的资源争抢情况

### Apache RocketMQ 社区 5.3.0、5.3.1 版本发布
Apache RocketMQ 社区近期发布了 5.3.0 和 5.3.1 两个版本，两个版本主要修复现有的 bug 并提升系统的整体稳定性和性能。值得一提的是，Apache RocketMQ 5.3.0 引入了 Apache RocketMQ ACL 2.0 支持，为用户带来了更加灵活和安全的访问控制机制。这些改进和新增功能将显著提升 Apache RocketMQ 在生产环境中的稳定性和安全性，进一步满足用户的业务需求。

### Apache RocketMQ 中文社区全新升级
2024 年 7 月，Apache RocketMQ 中文社区（https://rocketmq.io）全新升级，致力于为每一位热衷于 RocketMQ 技术探索与实践的开发者，打造一个集时效性、全面性、深度于一体的一站式学习平台。  

- **最全最新资讯：** Apache RocketMQ 中文社区提供从基础到深入的全面学习资料，涵盖原理介绍、架构解读、源码分析等基础知识，高级性能使用、技术前沿探索、场景最佳实践等博客文章，用户反馈的真实答疑样例等，并及时更新版本发布、架构演进和功能迭代等社区动态，以及社区相关活动和会议信息，为您提供更多学习和交流的机会。  
- **智能专家答疑：** Apache RocketMQ 中文社区基于 Apache RocketMQ 领域专业知识库，并结合先进的大模型技术进行优化，为您提供 AI 问答助手，作为您的智能学习伴侣。通过自然语言问答，让您的疑问得到迅速解答，使您的学习之旅更加轻松有趣。

![](https://img.alicdn.com/imgextra/i3/O1CN01HyRM281qKWH64U6ac_!!6000000005477-0-tps-2880-1552.jpg)

### 关于 Apache RocketMQ
RocketMQ 致力于构建低延迟、高并发、高可用、高可靠的分布式“消息、事件、流”统一处理平台，覆盖云边端⼀体化数据处理场景，帮助企业和开发者在智能化时代，轻松构建事件驱动架构的云原生应用。

RocketMQ 自 2012 年诞生于阿里巴巴集团的核心交易链路，至今已经历十余年“双十一”的万亿级数据洪峰验证。2015 年，阿里云面向企业提供商业化的消息队列服务，其中包括云消息队列 RocketMQ 版。2016 年，阿里巴巴向 Apache 软件基金会捐赠了 RocketMQ 项目，RocketMQ 进入 Apache 孵化器。2017 年，Apache RocketMQ 成为 Apache 顶级项目，在开源消息中间件领域占据领导地位。2022 年，Apache RocketMQ 5.0 正式发布，全面拥抱云原生架构、超融合架构，进一步拓展事件驱动、物联网等场景。
