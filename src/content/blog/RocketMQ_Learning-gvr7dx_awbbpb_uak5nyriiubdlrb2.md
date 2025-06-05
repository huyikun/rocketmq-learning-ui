---
title: "Apache RocketMQ 5.3.1"
description: "Apache RocketMQ 5.3.1"
date: "2025-06-05"
category: "article"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

2024年9月25号发布

# Highlight 
1. 优化Pop Revive 远程Broker消息读取流程
2. 支持定时消息查询功能
3. LMQ特性增强，支持LMQ Pop消费特性；增加多项LMQ的admin命令实现，如<font style="color:rgb(31, 35, 40);">topicStatus、consumerProgress、resetOffsetByTime、queryMsgByUniqueKey等等</font>
4. 支持元数据、位点管理从json文件存储升级到rocksdb存储实现
5. 提供netty worker线程池优化开关，大幅度提升网络性能。

更多细节详见 [https://github.com/apache/rocketmq/releases/tag/rocketmq-all-5.3.1](https://github.com/apache/rocketmq/releases/tag/rocketmq-all-5.3.1)


