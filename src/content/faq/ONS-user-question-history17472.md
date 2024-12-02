---
id: "question-history-17472"
title: "RocketMQ的基本概念有什么？"
date: "2024-12-02"
category: "expertConsultation"
description: "RocketMQ的基本概念包括多个组成部分及其功能，这些概念共同构成了RocketMQ消息传递系统的基础。以下是基于提供的我了解的信息对RocketMQ基本概念的概述：1. **消息模型（Message Model）**：   - RocketMQ主要由三部分组成：Producer、Broker和C"
tags: ["RocketMQ","概念","解析","基础","知识","消息队列","分布式"]
keywords: ["RocketMQ","概念","解析","基础","知识","消息队列","分布式"]
---

## 用户问题 ： 
 RocketMQ的基本概念有什么？  

---------------
## 专家官方解答 ：

RocketMQ的基本概念包括多个组成部分及其功能，这些概念共同构成了RocketMQ消息传递系统的基础。以下是基于提供的我了解的信息对RocketMQ基本概念的概述：

1. **消息模型（Message Model）**：
   - RocketMQ主要由三部分组成：Producer、Broker和Consumer。
   - Producer负责生产并发送消息到Broker。
   - Broker作为消息存储与转发中心，承担着接收来自Producer的消息，并为Consumer提供消息的服务。
   - Consumer则负责从Broker处拉取消息进行消费。

2. **消息生产者（Producer）**：
   - 负责生成消息并将它们发送给Broker。支持多种发送方式如同步、异步、顺序及单向发送。

3. **消息消费者（Consumer）**：
   - 用于处理从Broker接收到的消息。根据使用场景的不同，可以采用拉取式(Pull)或推动式(Push)的方式获取消息。

4. **主题（Topic）**：
   - 表示一组具有相同特性的消息集合。它是RocketMQ中消息订阅的基本单位。

5. **代理服务器（Broker Server）**：
   - 消息的实际存储位置，也负责维护消息相关元数据信息，如消费者组状态等。

6. **名字服务（Name Server）**：
   - 提供路由信息查询服务，帮助Producer和Consumer找到相应的Broker IP列表。

7. **拉取式消费（Pull Consumer）**：
   - 应用主动请求Broker以获取消息的一种消费模式。

8. **推动式消费（Push Consumer）**：
   - 应用无需手动调用拉取消息的方法，而是由框架自动完成消息的拉取与推送。

9. **生产者组（Producer Group）**：
   - 一组执行相同逻辑的Producers，用于保证消息发送的一致性以及支持事务消息的处理。

10. **消费者组（Consumer Group）**：
    - 由多个遵循相同消费逻辑的Consumers组成，实现了负载均衡及容错机制。

11. **集群消费（Clustering）**：
    - 同一Consumer Group内的各个实例平均分配消息进行消费。

12. **广播消费（Broadcasting）**：
    - 在这种模式下，同一个Consumer Group中的所有实例都会接收到全部消息。

13. **普通顺序消息（Normal Ordered Message）**：
    - 确保同一Message Queue内消息按顺序被消费，但不同Queue间无序。

14. **严格顺序消息（Strictly Ordered Message）**：
    - 保证了特定条件下整个Topic内消息的全局有序性。

15. **消息（Message）**：
    - 作为信息传输的基本单元，每个消息属于一个特定的主题，并且拥有唯一的标识符(Message ID)。

16. **标签（Tag）**：
    - 用来标记消息，使得在同一主题下能够区分不同类型的消息，便于实现更精细的消息过滤和处理策略。

以上就是关于RocketMQ基本概念的一个全面介绍。通过理解这些核心组件的作用与特点，可以帮助更好地利用RocketMQ来构建高效可靠的消息传递解决方案。


<font color="#949494">---------------</font> 


## 参考链接 ：

* 专家经验：rocketmq  基本概念 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>,使用方法：
用法1： 在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。
用法2： 点击[专家答疑页](https://answer.opensource.alibaba.com/docs/intro)（针对部分网站不支持插件嵌入的情况）
### 另：


有其他开源产品的使用问题？[点击访问阿里AI专家答疑服务](https://answer.opensource.alibaba.com/docs/intro)。
### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=17486)给我们反馈。
