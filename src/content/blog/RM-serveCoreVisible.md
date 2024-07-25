---
title: "消息队列 RocketMQ  遇上可观测：业务核心链路可视化"
date: "2022/01/20"
author: "文婷、不周"
img: "https://img.alicdn.com/imgextra/i2/O1CN01iu5z0j270E0UwEh7g_!!6000000007734-0-tps-685-383.jpg"
tags: ["practice"]
description: "本篇文章主要介绍 RocketMQ 的可观测性工具在线上生产环境的最佳实践。RocketMQ的可观测性能力领先业界同类产品，RocketMQ 的 Dashboard 和消息轨迹等功能为业务核心链路保驾护航，有效应对线上大规模生产使用过程中遇到的容量规划、消息收发问题排查以及自定义监控等场景。"
---

> **引言：**本篇文章主要介绍 RocketMQ 的可观测性工具在线上生产环境的最佳实践。RocketMQ的可观测性能力领先业界同类产品，RocketMQ 的 Dashboard 和消息轨迹等功能为业务核心链路保驾护航，有效应对线上大规模生产使用过程中遇到的容量规划、消息收发问题排查以及自定义监控等场景。


## 消息队列简介

进入主题之前，首先简要介绍下什么是阿里云的消息队列？

阿里云提供了丰富的消息产品家族，消息产品矩阵涵盖了互联网、大数据、物联网等各个业务场景的领域，为云上客户提供了多维度可选的消息解决方案。无论哪一款消息队列产品，核心都是帮助用户解决业务和系统的异步、解耦以及应对流量洪峰时的削峰填谷，同时具备分布式、高吞吐、低延迟、高可扩展等特性。

但是不同的消息产品在面向客户业务的应用中也有不同的侧重。简单来做，消息队列 RocketMQ 是业务领域的首选消息通道；Kafka 是大数据领域不可或缺的消息产品；MQTT 是物联网领域的消息解决方案；RabbitMQ 侧重于传统业务消息领域；云原生的产品集成和事件流通道是通过消息队列 MNS 来完成；最后事件总线 EventBridge 是一个阿里云上的一个事件枢纽，统一构建事件中心。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489802644-d9729f2d-d3cc-4d0a-8658-f0711414ea34.gif#clientId=ud3a1a5d4-b8b3-4&height=1&id=yboA9&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0c5bec48-a264-48bc-a3a1-c622b2035bb&title=&width=1)

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489802729-4b9f8346-f9d8-4898-8b22-f380d995b290.png#clientId=ud3a1a5d4-b8b3-4&height=440&id=NlEA2&name=1.png&originHeight=440&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u82581e80-0551-4a43-812a-a8ad82a6fdf&title=&width=1080)

本篇主要讲的是业务领域的消息首选通道：消息队列 RocketMQ。RocketMQ 诞生于阿里的电商系统，具有高性能、低延迟、削峰填谷等能力，并且提供了丰富的在业务和消息场景上应对瞬时流量洪峰的功能，被集成在用户的核心业务链路上。
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489804456-b6a462bc-1189-4118-b1b3-3180a294a95d.gif#clientId=ud3a1a5d4-b8b3-4&height=1&id=DoKVQ&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud85c34d5-c235-4da0-b496-30951133914&title=&width=1)
![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489802644-c57b147d-a1a7-458b-b4cc-546b6bd16f72.png#clientId=ud3a1a5d4-b8b3-4&height=755&id=XAIcO&name=2.png&originHeight=755&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6fa0ffea-c334-4e0e-ab8d-262a0ccc393&title=&width=1080)

作为一个核心业务链路上的消息，就要求 RocketMQ 具备非常高的可观测性能力，用户能通过可观测性能力及时的监控定位异常波动，同时对具体的业务数据问题进行排查。由此，可观测性能力逐步成为消息队列 RocketMQ 的核心能力之一。

那么什么是可观测能力呢？下面简单对可观测能力进行介绍。

## 可观测能力

提到可观测能力，大家可能最先想到的是可观测的三要素：Metrics（指标）、Tracing（追踪）和 Logging（日志）。

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489802710-c153109a-d139-433e-9cb3-8ebbe81ea3cd.png#clientId=ud3a1a5d4-b8b3-4&height=619&id=mre63&name=3.png&originHeight=619&originWidth=723&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8fbd515a-a459-4a20-a55f-4c52b18cf64&title=&width=723)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489804577-c210c5af-f4ab-47f8-bf01-11a683ef0643.gif#clientId=ud3a1a5d4-b8b3-4&height=1&id=cNln0&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua3c3d9c6-6aad-4cc3-976d-af402415d15&title=&width=1)
结合消息队列的理解，可观测能力三要素的细化解释如下：

### Metrics：Dashborad 大盘

**1）指标涵盖丰富：**包含消息量、堆积量、各个阶段耗时等指标，每个指标从实例、Topic、消费 GroupID 多维度做聚合和展示；

**2）消息团队最佳实践模板：**为用户提供最佳模板，特别是在复杂的消费消息场景，提供了丰富的指标帮助快速定位问题，并持续迭代更新；

**3）Prometheus + Grafana：**Prometheus标准数据格式、利用Grafana展示，除了模板，用户也可以自定义展示大盘。

### Tracing：消息轨迹


**1）OpenTelemetry tracing标准：**RocketMQ tracing 标准已经合并到 OpenTelemetry 开源标准，规范和丰富 messaging tracing 场景定义；

**2）消息领域定制化展示：**按照消息维度重新组织抽象的请求 span 数据，展示一对多的消费，多次消费信息，直观、方便理解；

**3）可衔接 tracing链路上下游：**消息的 tracing 可继承调用上下文，补充到完整调用链路中，消息链路信息串联了异步链路的上游和下游链路信息。

### Logging：客户端日志标准化

**1）Error Code标准化：**不同的错误有唯一的 error code；

**2）Error Message 完整：**包含完整的错误信息和排序所需要的资源信息；

**3）Error Level 标准化：**细化了各种不同错误信息的日志级别，让用户根据 Error、Warn 等级别配置更合适和监控告警。

了解消息队列和可观测能力的基础概念，让我们来看看当消息队列 RocketMQ 遇到可观测，会产生什么样的火花？

## RocketMQ 的可观测性工具的概念介绍

从上文的介绍中可以看到 RocketMQ 的可观测能力能够帮助用户根据错误信息排查消息在生产和消费过程中哪些环节出了问题，为了帮助大家更好的理解功能的应用，先简要介绍下消息生产消费流程过程中的一些概念。

### 消息生产和消费流程概念

首先我们先明确以下几个概念：

- Topic：消息主题，一级消息类型，通过Topic对消息进行分类；

- 消息（Message）：消息队列中信息传递的载体；

- Broker：消息中转角色，负责存储消息，转发消息；

- Producer：消息生产者，也称为消息发布者，负责生产并发送消息；

- Consumer：消息消费者，也称为消息订阅者，负责接收并消费消息。

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489804691-b61b0967-8d05-4a6b-b565-fafd8d5f04ba.png#clientId=ud3a1a5d4-b8b3-4&height=415&id=KLnrB&name=4.png&originHeight=415&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub6fd91c9-3c77-4e24-a98d-1c7a8de1420&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489804701-5b8a5a2b-c49d-43c8-af77-007cf0c1b56b.gif#clientId=ud3a1a5d4-b8b3-4&height=1&id=SOEFw&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u746f27af-2c0e-4b64-a60c-305cf700c1b&title=&width=1)
消息生产和消费的流程简单来说就是生产者将消息发送到 topic 的 MessageQueue 上进行存储，然后消费者去消费这些 MessageQueue 上的消息，如果有多个消费者，那么一个完整的一次消息生产发生的生命周期是什么样子的？

这里我们以定时消息为例，生产者 Producer 发送消息经过一定的耗时到达 MQ Server，MQ 将消息存储在 MessageQueue，这时队列中有一个存储时间，如果是定时消息，还需要经过一定的定时时间之后才能被消费者消费，这个时间就是消息就绪的时间；经过定时的时间后消费者 Consumer 开始消费，消费者从 MessageQueue 中拉取消息，然后经过网络的耗时之后到达消费者客户端，这时候不是低码进行消费的，会有一个等待消费者资源线程的过程，等到消费者的线程资源后才开始进行真正的业务消息处理。

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489804759-a0a3c8ae-8a34-4dc3-9a23-844595b6f634.png#clientId=ud3a1a5d4-b8b3-4&height=327&id=jQAWH&name=5.png&originHeight=327&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u56e7bbd7-97c8-4357-bc3b-134be174d9e&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489804914-90311ba2-e04d-4c31-ba36-4b387c06aaf5.gif#clientId=ud3a1a5d4-b8b3-4&height=1&id=G82xt&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2619f1cf-6759-4a21-9666-d1a8d80b557&title=&width=1)
从上面的介绍中可以看出，业务消息有一定的耗时处理，完成之后才会向服务端返回ack的结果，在整个生产和消费的过程中，最复杂的便是消费的过程，因为耗时等原因，会经常有消息堆积的场景，下面来重点看一下在消息堆积场景下各个指标表示的含义。

### 消息堆积场景

![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489805019-f54829da-5d0b-4545-9f28-28102c5e4b61.png#clientId=ud3a1a5d4-b8b3-4&height=300&id=Mixfh&name=6.png&originHeight=300&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8b1869da-59a3-4f6e-b02d-4ad647b2a83&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489805080-6ce4c539-a90d-4239-b3da-aa06979c9908.gif#clientId=ud3a1a5d4-b8b3-4&height=1&id=yZi8J&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2b4360b8-4299-4d8f-a888-17ceb25d2cc&title=&width=1)
如上图，消息队列中，灰色部分的消息表示是已完成的消息量，就是消费者已处理完成并返回 ack 的消息；橙色部分的消息表示这些消息已经被拉取到消费者客户端，正在被处理中，但是还没有返回处理结果的消息，这个消息其实有一个非常重要的指标，就是消息处理耗时；最后绿色的消息表示这些消息在已经发生的 MQ 队列中已存储完成，并且已经是可被消费者消费的一个状态，称为已就绪的消息。

_已就绪消息量（Ready messages）：_
_含义：已就绪消息的消息的条数。_
_作用：消息量的大小反映还未被消费的消息规模，在消费者异常情况下，就绪消息量会变多。_

_消息排队时间（Queue time）_
_含义：最早一条就绪消息的就绪时间和当前时间差。_
_作用：这个时间大小反映了还未被处理消息的时间延迟情况，对于时间敏感的业务来说是非常重要的度量指标。_

## RocketMQ 的可观测性工具的功能介绍

结合上文介绍的消息队列 RocketMQ 可观测概念，下面具体对 RocketMQ 的可观测性工具的两个核心功能进行介绍。

![7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489805239-29ef9761-711e-401a-af73-1b4b341d1263.png#clientId=ud3a1a5d4-b8b3-4&height=740&id=fuko5&name=7.png&originHeight=740&originWidth=834&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uab1d688e-1b4b-4997-942c-f03a2eed34f&title=&width=834)

### 可观测功能介绍 - Dashboard

Dashboard 大盘可以根据各种参数查看指定的指标数据，主要的指标数据包含下面三点：

#### 1）Overview（概览）：



- 查看实例据总的消息收发量、TPS、消息类型分布情况。

- 查看是的各个指标当前的分布和排序情况：发送消息量最多的 Topic、消费消息量最多的 GroupID、堆积消息量最多的 GroupID、排队时间最长的 GroupID 等。

![8.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489805269-1ff62459-3f19-4a49-baf6-dfe9db2e2dbe.png#clientId=ud3a1a5d4-b8b3-4&height=367&id=IRVS7&name=8.png&originHeight=367&originWidth=817&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8ead290c-70bc-4472-8c2b-edca23aabae&title=&width=817)

#### 2）Topic（消息发送）：

- 查看指定 Topic 的发送消息量曲线图。

- 查看指定 Topic 的发送成功率曲线图。

- 查看指定 Topic 的发送耗时曲线图。

![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489805339-f8193b17-6516-407f-9ac0-98846e3ae4ed.gif#clientId=ud3a1a5d4-b8b3-4&height=1&id=L5nRE&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7860e880-7e0c-4a4a-b51c-c4f8e2c795f&title=&width=1)
![9.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489805497-53f1bb4f-5635-4069-a1ce-23f105dbea7c.png#clientId=ud3a1a5d4-b8b3-4&height=287&id=XZKuh&name=9.png&originHeight=287&originWidth=802&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u35e20bce-ac5a-41bf-8bde-201b549898d&title=&width=802)

#### 3）GroupID（消息消费）：



- 查看指定 Group 订阅指定 Topic 的消息量曲线图。

- 查看指定 Group 订阅指定 Topic 的消费成功率。

- 查看指定 Group 订阅指定 Topic 的消费耗时等指标。

- 查看指定 Group 订阅指定 Topic 的消息堆积相关指标。

![10.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489805548-40e57e31-cfd8-4f2c-8f1c-15a5253511f1.png#clientId=ud3a1a5d4-b8b3-4&height=287&id=CwQT8&name=10.png&originHeight=287&originWidth=816&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u263a4e52-e2cd-489b-a1b3-7627d66ea55&title=&width=816)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489805804-1cc8af50-d946-491a-8805-d9289fa00fa0.gif#clientId=ud3a1a5d4-b8b3-4&height=1&id=g1hlg&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub70b3c34-1416-4b38-b802-3b824ca7b55&title=&width=1)
### 可观测功能介绍 - 消息轨迹

在 Tracing 方面提供了消息轨迹功能，主要包含以下三方面能力：

**1）便捷的查询能力：**可根据消息基本信息查询相关的轨迹；二期还可以根据结果状态、耗时时长来过滤查询，过滤出有效轨迹快速定位问题。

**2）详细的 tracing 信息：**除了各个生命周期的时间和耗时数据，还包含了生产者、消费者的账号和机器信息。

**3）优化展示效果：**不同的消息类型轨迹；多个消费 GroupID 的场景；同个消费 GroupID 多次重投的场景等。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489805878-ec81ac4d-cfff-496a-882d-7b24b9727e31.gif#clientId=ud3a1a5d4-b8b3-4&height=1&id=AyH0s&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=udd0159f1-af32-414f-8fb6-fd3ef571370&title=&width=1)

![11（1）.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489805902-646de5af-7074-4a1e-9b22-fa31e5213f58.png#clientId=ud3a1a5d4-b8b3-4&height=429&id=xuerE&name=11%EF%BC%881%EF%BC%89.png&originHeight=429&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc0a97de8-ba5d-4965-a89c-6d5877e2101&title=&width=1080)

## 最佳实践


### 场景一：问题排查

**1）目标：**消息生产消费健康情况

**2）原则**

- 一级指标：用来报警的指标，公认的没有异议的指标。

- 二级指标：一级指标发生变化的时候，通过查看二级指标，能够快速定位问题的原因所在。

- 三级指标：定位二级指标波动原因。根据各自业务的特点和经验添加。

基于目标和原则，生产者用户和消费者用户问题排查和分析方式如下：

![11.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489805970-7c43944b-9154-4335-94a1-367e304d41ef.png#clientId=ud3a1a5d4-b8b3-4&height=378&id=r0rcb&name=11.png&originHeight=378&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u953a9b80-fb4b-4f75-8133-738831fe4a3&title=&width=1080)

### 场景二：容量规划

![12.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489805977-38fc2feb-8c25-4f25-b8bf-f25c7e59992f.png#clientId=ud3a1a5d4-b8b3-4&height=637&id=xMpCJ&name=12.png&originHeight=637&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u66b38a4b-e79e-45da-94d5-6e82afc22a3&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489806236-72bb64d4-651a-458c-93a8-081142a3dec3.gif#clientId=ud3a1a5d4-b8b3-4&height=1&id=K7ypd&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud50ec861-0fdb-4342-bfae-f276f4379ca&title=&width=1)
容量规划场景下只要解决下面三个问题：

#### 1）问题一：怎样评估实例容量？

解决方法：

- 实例详情页》查看指定实例数据统计，可以看到所选时间段内的最大消息收发的 TPS 峰值。

- 铂金版实例可以根据这个数据来添加报警监控和判断业务。

#### 2）问题二：怎样查看标准版实例的消耗

解决方法：

- 可以查看概览总消息量模块

#### 3）问题三：有哪些已下线，需要清理资源？

解决方法：

- 指定一段时间内（例如近一周），按 Topic 的消息发送量由小到大排序，查看是否有消息发送量为 0 的 Topic，这些 Topic 相关的业务或许已下线。

- 指定一段时间内（例如近一周），按 GroupID 的消息消费量由小到大排序，查看是否有消息消费量为 0 的 GroupID，这些 GroupID 相关的业务或许已下线。

### 场景三：业务规划

![13.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489806382-e97c84b7-60b8-4e56-b02d-38849fb1552c.png#clientId=ud3a1a5d4-b8b3-4&height=767&id=VpIKU&name=13.png&originHeight=767&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8a10ba27-58e2-4884-b3a7-2e59a121114&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489806384-5bbcf651-7a70-4b2a-ae2e-bc923321c7f7.gif#clientId=ud3a1a5d4-b8b3-4&height=1&id=kcQyX&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ube51e12c-6da5-400c-bc36-db6eea67e9a&title=&width=1)
业务规划场景下主要解决以下三个问题：

#### 1）问题一：如何查看业务峰值分布情况？

解决方法：

- 查看 Topic 消息接收量的每天的高峰时间段。

- 查看 Topic 消息接收量周末和非周某的消息量差别。

- 查看 Topic 消息接收量节假日的变化情况。

#### 2）问题二：如何判断目前哪些业务有上升趋势？

解决方法：

- 查看消息量辅助判断业务量变化趋势。

#### 3）问题三 ：怎样优化消费者系统性能？

解决方法：

- 查看消息处理耗时，判断是否在合理范围内有提升的空间。

本篇文章通过消息队列、可观测能力、RocketMQ 可观测概念及功能和最佳实践的介绍，呈现了 RocketMQ 的可观测性工具在业务核心链路上的可视化能力，希望给大家在日常的线上的一些问题排查和运维过程中带来一些帮助。

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)