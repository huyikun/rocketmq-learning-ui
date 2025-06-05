---
title: "Apache RocketMQ 5.3.2"
description: "Apache RocketMQ 5.3.2"
date: "2025-06-05"
category: "article"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

2025年3月8号发布

# Highlight 
1. 实现rocksdb版的Pop消费模式，[RIP-73](Apache%20RocketMQ%20打破锁性能瓶颈之道)
2. 支持rocksdb版的消息堆积估算
3. 支持pop消费状态异步存储机制，提升pop消费性能
4. 支持rocksdb版的LMQ存储实现
5. 基于RocketMQ顶会论文实现自适应锁优化，提升性能，[RIP 70](https://github.com/apache/rocketmq/wiki/%5BRIP%E2%80%9070%5D-Optimizing-Lock-Mechanisms)，[Apache RocketMQ 打破锁性能瓶颈之道](https://rocketmq-learning.com/learning/rocketmq_learning-gvr7dx_awbbpb_ergp3yyr06icvwtu/?spm=5176.29160081.0.0.a2807833covzmp&source=learning)
6. 增加定时消息取消特性

更多细节详见[https://github.com/apache/rocketmq/releases/tag/rocketmq-all-5.3.2](https://github.com/apache/rocketmq/releases/tag/rocketmq-all-5.3.2)


