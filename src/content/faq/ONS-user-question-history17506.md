---
id: "question-history-17506"
title: "RocketMQ 的消息过滤机制是如何工作的？"
date: "2024-12-16"
category: "expertConsultation"
description: "### RocketMQ的消息过滤机制工作原理RocketMQ 的消息过滤机制允许消费者根据特定条件筛选并消费感兴趣的消息，从而减少无效消息的处理压力。这种机制主要通过以下两个方面来实现：**Tag标签过滤**和**SQL属性过滤**。这两种方法都是在消息消费端进行设置，由服务端完成实际的过滤操作。"
tags: ["RocketMQ","消息","过滤","机制","工作","原理","内容"]
keywords: ["RocketMQ","消息","过滤","机制","工作","原理","内容"]
---

## 用户问题 ： 
 RocketMQ 的消息过滤机制是如何工作的？  

---------------
## 专家官方解答 ：

### RocketMQ的消息过滤机制工作原理

RocketMQ 的消息过滤机制允许消费者根据特定条件筛选并消费感兴趣的消息，从而减少无效消息的处理压力。这种机制主要通过以下两个方面来实现：**Tag标签过滤**和**SQL属性过滤**。这两种方法都是在消息消费端进行设置，由服务端完成实际的过滤操作。

#### 1. Tag标签过滤
- **过滤目标**: 主要针对消息的Tag标签。
- **过滤能力**: 实现精准匹配。
- **适用场景**: 简单且轻量级的过滤需求。

**具体步骤**:
1. 生产者发送消息时为每条消息设置一个或多个Tag标签。
2. 消费者订阅Topic时指定感兴趣的Tag标签作为过滤条件。可以是一个单独的Tag、多个Tag（使用`||`分隔）或者所有Tag（用`*`表示）。
3. 当Broker从存储中读取消息准备投递给Consumer前，会根据Consumer提供的Tag标签信息对消息进行过滤。这里首先基于消息Tag哈希值做快速判断，然后对符合条件的消息再进一步验证原始Tag字符串以确保精确性。
4. 最终只有满足过滤条件的消息才会被传递给相应的消费者。

**示例代码**：
```java
// 发送带有特定Tag的消息
Message message = new Message("topic", "TagA", "messageBody".getBytes());
producer.send(message);

// 订阅具有某个特定Tag的消息
FilterExpression filterExpression = new FilterExpression("TagA", FilterExpressionType.TAG);
consumer.subscribe("topic", filterExpression);
```

#### 2. SQL属性过滤
- **过滤目标**: 涉及到消息的用户自定义属性以及系统属性（包括Tag）。
- **过滤能力**: 支持更复杂的逻辑表达式匹配，利用SQL92语法。
- **适用场景**: 需要基于多种属性执行复杂过滤规则的情况。

**具体步骤**:
1. 在生产者侧为待发送的消息添加自定义属性，这些属性可以是任何键值对形式。
2. 消费者订阅Topic时，除了指定Topic外还需提供SQL92格式的过滤表达式，用于描述想要接收的消息属性组合。
3. Broker接收到订阅请求后，在每次拉取数据前先构建相应的MessageFilter对象，并据此对ConsumeQueue中的记录执行过滤。
4. 过滤过程可能会涉及BloomFilter等技术优化性能，特别是当过滤条件较为复杂时。
5. 只有那些满足SQL条件的消息会被真正地投递给消费者。

**示例代码**：
```java
// 发布带有额外属性的消息
Message message = new Message("topic", "messageBody".getBytes());
message.putUserProperty("Region", "Hangzhou");
producer.send(message);

// 设置基于SQL92标准的过滤条件
FilterExpression sqlFilter = new FilterExpression("Region IS NOT NULL AND Region='Hangzhou'", FilterExpressionType.SQL92);
consumer.subscribe("topic", sqlFilter);
```

### 总结
- 无论采用哪种方式，关键在于正确配置消息的附加信息（如Tag或属性），并在消费者端准确表述出希望获取的消息特征。
- 使用过程中需要注意保持同一消费者组内的所有成员拥有相同的订阅关系，以避免潜在的数据不一致问题。
- 对于大量消息的高效处理，合理规划主题与标签的划分也非常重要。例如，对于不同业务领域或是显著不同的消息流量模式，建议分别创建独立的主题来隔离管理。


<font color="#949494">---------------</font> 


## 参考链接 ：

* 专家经验：rocketmq   设计(design) 
 
 * 专家经验：消息过滤 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>,使用方法：
用法1： 在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。
用法2： 点击[专家答疑页](https://answer.opensource.alibaba.com/docs/intro)（针对部分网站不支持插件嵌入的情况）
### 另：


有其他开源产品的使用问题？[点击访问阿里AI专家答疑服务](https://answer.opensource.alibaba.com/docs/intro)。
### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=17526)给我们反馈。
