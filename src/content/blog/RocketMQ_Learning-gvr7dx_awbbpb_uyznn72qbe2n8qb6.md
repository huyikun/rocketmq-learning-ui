---
title: "Apache RocketMQ for AI 荣获 2025 年度 OSCAR “开源+人工智能”典型案例"
description: "Apache RocketMQ for AI 荣获 2025 年度 OSCAR “开源+人工智能”典型案例"
date: "2025-10-28"
category: "announcement"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

2025 年 10 月 28 日，中国通信标准化协会在北京举办第九届 “OSCAR 开源产业大会”，重磅发布 2025 年度 OSCAR“开源+”典型案例评选结果。

近年来，开源技术驱动各领域飞速发展，深刻影响信息技术产业发展格局。为深化开源技术在各行业的融合应用，普及开源文化，推动形成“众研、众用、众创”的开源生态格局，中国信息通信研究院联合中国互联网协会启动 2025 年度 OSCAR“开源+”典型案例征集工作，旨在挖掘具有行业范式价值的典型实践，促进各行各业经验共享，为数字中国建设注入新动能。

其中，**<font style="color:#2F8EF4;">Apache RocketMQ for AI：AI 应用全链路异步解决方案</font>****荣获 “开源+人工智能”专项类别典型案例**。

![](https://img.alicdn.com/imgextra/i3/O1CN01PQ4ApS1p3HpjFyZsL_!!6000000005304-0-tps-2989-1993.jpg)

2025 OSCAR “开源+人工智能”专项类别典型案例聚焦人工智能领域开源突破，重点征集大模型及具身智能开源、AI 数据集开放、AI 原生应用开发工具链等前沿实践。

Apache RocketMQ 正在从传统消息中间件演进为专为 AI 时代打造的消息引擎，通过 LiteTopic 轻量模型、消息优先级、定速消费等核心能力，为企业级 AI 应用的多智能体（Multi-Agent）通信、大规模任务调度、长会话状态管理等场景提供全链路异步解决方案。![](https://img.alicdn.com/imgextra/i3/O1CN01TrTI8d2AI2WQ7fNkc_!!6000000008179-2-tps-1101-510.png)

###### Multi-Agent 异步通信
LiteTopic 模型凭借其百万级资源创建、自动化生命周期管理和顺序性保障，高效适配 Agent2Agent 异步通信需求，有效解决长耗时调用阻塞和 Multi-Agent 应用协作扩展性难题。

![](https://img.alicdn.com/imgextra/i4/O1CN01WNGtVf1cpILPAcRCi_!!6000000003649-2-tps-960-656.png)

###### AI 任务智能调度
RocketMQ 作为请求和后端算力服务的缓冲区，可平滑请求流量，最大化 AI 算力利用率；消费者限流能力保障核心 AI 算力服务稳定性；消息优先级将有限算力资源优先分配给高优先级请求任务。

![](https://img.alicdn.com/imgextra/i3/O1CN01B18heg29a4V2jG0IB_!!6000000008083-2-tps-960-656.png)

###### 分布式会话状态管理
当用户与应用服务开启会话时，RocketMQ 动态为该会话创建一个以会话 ID（SessionID）作为唯一标识的专属消息队列（LiteTopic）。所有会话相关数据，如历史记录和中间结果，均作为消息在此队列中有序传递。该架构实现了应用“无状态化”，显著简化开发复杂度、提升用户交互体验，并有效减少会话重试资源浪费。

![](https://img.alicdn.com/imgextra/i2/O1CN01rl2WfA1Exx3GavLU8_!!6000000000419-2-tps-960-656.png)

目前，RocketMQ for AI 的核心特性已在阿里云云消息队列 RocketMQ 版产品中发布，后续将逐步贡献到开源社区。相关能力已在阿里巴巴集团内部以及阿里云大模型服务平台百炼、通义灵码等产品中经过大规模生产环境的验证，且取得显著成效，充分证明了其在高并发、复杂的 AI 场景下的成熟度与可靠性。

展望未来，我们将持续在 AI 领域进行技术迭代与创新，并积极与生态伙伴（如业务框架、AI 平台等）合作集成，共建高效、智能的 AI 应用基础设施，并逐步将经过阿里集团 AI 业务验证过的方案与特性，持续反馈到开源社区。

欢迎钉钉搜索扫码加入 RocketMQ for AI 用户交流群（群号：110085036316），与我们交流探讨～

![](https://img.alicdn.com/imgextra/i1/O1CN01Xu1Ro61yOCSVbdNIa_!!6000000006568-2-tps-443-443.png)


