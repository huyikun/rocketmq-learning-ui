---
id: "question-history-17499"
title: "RocketMQ 的基本架构是什么？"
date: "2024-12-16"
category: "expertConsultation"
description: "RocketMQ 的基本架构可以分为几个主要部分：Producer（生产者）、Consumer（消费者）、NameServer 和 BrokerServer。每个部分在消息传递过程中扮演着不同的角色，共同确保了消息的高效传输和存储。## 1. 技术架构### 1.1 主要组件- **Producer"
tags: ["RocketMQ","架构","消息队列","分布式","系统设计","发布订阅","模型"]
keywords: ["RocketMQ","架构","消息队列","分布式","系统设计","发布订阅","模型"]
---

## 用户问题 ： 
 RocketMQ 的基本架构是什么？  

---------------
## 专家官方解答 ：

RocketMQ 的基本架构可以分为几个主要部分：Producer（生产者）、Consumer（消费者）、NameServer 和 BrokerServer。每个部分在消息传递过程中扮演着不同的角色，共同确保了消息的高效传输和存储。

## 1. 技术架构
### 1.1 主要组件
- **Producer**：负责生成消息并将其发送到Broker集群中。它支持分布式部署，通过负载均衡机制选择合适的Broker队列进行消息投递。
- **Consumer**：负责接收并处理消息。同样支持分布式部署，并提供Push（推送）和Pull（拉取）两种消费模式，满足不同场景下的需求。
- **NameServer**：作为路由注册中心，负责管理和维护Broker的信息，包括Broker的地址、状态以及路由信息等。NameServer之间相互独立，不共享信息，Broker会向所有NameServer注册自己的信息，保证了高可用性。
- **BrokerServer**：是RocketMQ的核心服务节点，负责消息的存储、转发及查询等功能。它包含以下子模块：
  - **Remoting Module**：处理来自客户端的所有请求。
  - **Client Manager**：管理客户端连接和消费者的订阅信息。
  - **Store Service**：提供消息持久化存储及查询功能。
  - **HA Service**：实现Broker间的高可用性，例如Master与Slave之间的数据同步。
  - **Index Service**：根据消息Key为消息创建索引，便于快速检索。

### 1.2 工作流程
- **启动阶段**：首先启动NameServer，接着启动Broker，Broker启动后会向NameServer集群中的每一个节点注册自己的信息，包括IP地址、端口等。
- **消息发送**：Producer启动时，随机选择一个NameServer建立长连接，获取Topic对应的Broker列表，然后选择其中一个Broker发送消息。
- **消息接收**：Consumer也与NameServer建立长连接，获取Topic对应的Broker列表，之后直接与这些Broker建立连接以消费消息。

## 2. 部署架构
RocketMQ 支持多种部署方式，包括但不限于直连模式和存储计算分离模式。
- **直连模式**：这种模式下，Producer/Consumer直接与NameServer和Broker通信，适用于简单场景。
- **存储计算分离模式**：引入Proxy层作为数据流量入口，将计算逻辑与存储逻辑分离，有利于提高系统的灵活性和可扩展性。

通过以上描述可以看出，RocketMQ 采用了一种灵活且高效的架构设计来支撑大规模的消息传递需求。更多信息请参考[官方文档](https://rocketmq.apache.org/zh/docs/introduction/02concepts)了解RocketMQ的基本概念和技术细节。


<font color="#949494">---------------</font> 


## 参考链接 ：

* 专家经验：rocketmq  架构设计 
 
 * 专家经验：RocketMQ 原理和架构 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>,使用方法：
用法1： 在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。
用法2： 点击[专家答疑页](https://answer.opensource.alibaba.com/docs/intro)（针对部分网站不支持插件嵌入的情况）
### 另：


有其他开源产品的使用问题？[点击访问阿里AI专家答疑服务](https://answer.opensource.alibaba.com/docs/intro)。
### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=17519)给我们反馈。
