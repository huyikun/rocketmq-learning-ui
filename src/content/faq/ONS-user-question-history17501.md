---
id: "question-history-17501"
title: "RocketMQ 支持哪些消息模式？"
date: "2024-12-16"
category: "expertConsultation"
description: "根据我了解的信息中的描述，RocketMQ 支持以下几种消息模式：1. **集群消费（Clustering）**   - 在集群消费模式下，相同Consumer Group的每个Consumer实例平均分摊消息。这种方式有利于实现负载均衡和容错的目标。2. **广播消费（Broadcasting）*"
tags: ["RocketMQ","消息模式","类型","支持","发布","订阅","广播"]
keywords: ["RocketMQ","消息模式","类型","支持","发布","订阅","广播"]
---

## 用户问题 ： 
 RocketMQ 支持哪些消息模式？  

---------------
## 专家官方解答 ：

根据我了解的信息中的描述，RocketMQ 支持以下几种消息模式：

1. **集群消费（Clustering）**
   - 在集群消费模式下，相同Consumer Group的每个Consumer实例平均分摊消息。这种方式有利于实现负载均衡和容错的目标。

2. **广播消费（Broadcasting）**
   - 广播消费模式下，相同Consumer Group的每个Consumer实例都接收全量的消息。这适合需要所有消费者都能收到同样信息的应用场景。

3. **普通顺序消息（Normal Ordered Message）**
   - 普通顺序消费模式保证了消费者通过同一个消息队列收到的消息是有顺序的，但不同消息队列间的消息顺序不作保证。

4. **严格顺序消息（Strictly Ordered Message）**
   - 与普通顺序消息相比，严格顺序消息确保了消费者收到的所有消息均是有顺序的，提供了更高的顺序保障。

这些不同的消息模式允许开发者根据实际业务需求选择最适合的消息传递机制，以满足不同的应用场景要求。例如，在某些对数据处理顺序有严格要求的场景中，可以使用严格顺序消息；而对于需要高吞吐量而不要求绝对顺序的情况，则可以选择集群消费模式等。


<font color="#949494">---------------</font> 


## 参考链接 ：

* 专家经验：rocketmq  基本概念 
 
 * 专家经验：rocketmq  Basic Sample 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>,使用方法：
用法1： 在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。
用法2： 点击[专家答疑页](https://answer.opensource.alibaba.com/docs/intro)（针对部分网站不支持插件嵌入的情况）
### 另：


有其他开源产品的使用问题？[点击访问阿里AI专家答疑服务](https://answer.opensource.alibaba.com/docs/intro)。
### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=17521)给我们反馈。
