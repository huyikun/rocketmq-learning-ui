---
title: "RocketMQ 监控告警：生产环境如何快速通过监控预警发现堆积、收发失败等问题？"
date: "2023/01/06"
author: "合伯"
img: "https://img.alicdn.com/imgextra/i1/O1CN01T1FsqR1b5Cbhi3mBo_!!6000000003413-0-tps-685-383.jpg"
tags: ["explore"]
description: "本文主要向大家介绍如何利用 RocketMQ 可观测体系中的指标监控，对生产环境中典型场景：消息堆积、消息收发失败等场景配置合理的监控预警，快速发现问题，定位问题。"
---

本文主要向大家介绍如何利用 RocketMQ 可观测体系中的指标监控，对生产环境中典型场景：消息堆积、消息收发失败等场景配置合理的监控预警，快速发现问题，定位问题。

## RocketMQ 可观测体系


作为一款典型的分布式中间件产品，RocketMQ 被广泛应用于业务核心链路中，每条消息都关联着核心业务数据的变化。业务链路有其明显的复杂性：

    - 生产者、消费者多对多：业务调用链路网状结构，上下游梳理困难
    - 上下游解耦、异步链路：异步化调用，信息收集不完整
    - 消息是状态数据：未消费成功、定时中等状态增加排查的复杂度
    - 消息链路耦合复杂的业务处理逻辑：无法快速定位问题边界

鉴于消息链路耦合业务系统，复杂带状态，RocketMQ 通过强大的可观测系统和经验支撑，及时发现问题、定位问题、解决问题有助于提升运维效率，对于业务运行是一项重要的保障能力。

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502102048-8eba0f0a-6263-420b-8eb9-08000c84b61c.png#clientId=ueacb93f6-0fd6-4&height=576&id=I66Ee&name=1.png&originHeight=576&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ufe2d1f04-7609-401c-bcd6-00afe634532&title=&width=1080)

RocketMQ 的可观测体系主要由指标（Metrics）、轨迹（Tracing）和日志（Logging）组成。

- 指标

RocketMQ中定义了详细的Metrics指标，这些指标覆盖生产者、消费者、服务端及消息收发关键接口和流程的统计数据，并支持从实例、Topic和Group等多个维度进行聚合展示，帮助您实时监控消息业务或RocketMQ服务的运行状态。和4.x版本相比，RocketMQ服务端5.x版本增加了消息堆积场景相关指标、关键接口的耗时指标、错误分布指标、存储读写流量等指标，帮助您更好地监控异常场景。

- 消息轨迹

在分布式应用中，RocketMQ作为全链路中异步解耦的关键服务，提供的Tracing数据可有效将业务上下游信息串联起来，帮助您更好地排查异常，定位问题。和4.x版本相比，RocketMQ服务端5.x版本支持OpenTelemetry开源标准，提供更加丰富的轨迹指标，针对消费场景、高级消息类型场景等细化轨迹内容，为问题定位提供更多关键信息。

- 日志

RocketMQ为不同的异常情况定义唯一的错误码及错误信息，并划分不同的错误级别，您可以根据客户端返回的错误码信息快速获取异常原因。和4.x版本相比，RocketMQ服务端5.x版本统一了ErrorCode和ErrorMessage，异常日志中增加了RequestID、资源信息，细化了错误信息，保证日志内容明确靠。

## RocketMQ 监控告警介绍


RocketMQ 联合阿里云云监控提供了开箱即用且免费的监控报警服务，可帮助您解决如下问题：

- 实例规格水位监控预警

若您实际使用的指标值超过实例的规格限制，RocketMQ会进行强制限流。提前配置实例规格水位告警可以提前发现规格超限风险并及时升配，避免因限流导致的业务故障。

- 业务逻辑错误监控预警

您在消息收发时可能会收到异常报错，配置调用错误告警可以提前在业务反馈前发现异常，帮助您提前判断异常来源并及时修复。

- 业务性能指标监控预警

如果您的消息链路有相关性能指标要求，例如RT耗时、消息延迟等，提前配置业务指标告警可以帮助您提前治理业务风险。

RocketMQ 版提供了丰富的 Metric 指标和告警监控项。各监控项可分为运行水位、收发性能、异常错误事件三类告警。根据大量生产环境实践经验，建议您根据以下原则配置如下告警

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502102068-59cf9b47-b2f0-49a4-849b-75eb83fd2f6c.png#clientId=ueacb93f6-0fd6-4&height=844&id=Ha5lg&name=2.png&originHeight=844&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u3a8d5ba3-a1b1-41d5-b789-10a8b590e1d&title=&width=1080)

接下来重点通过消息堆积和消息收发失败这两个典型场景来阐述基于可观测体系中的指标（Metrics），RocketMQ 如何通过云监控创建监控规则，将关键的 Metrics 指标作为告警项，帮助您自动监控服务的运行状态，并自动发送报警通知， 便于您及时预警服务的异常信息，提高运维效率。

### 应用场景1：消息堆积问题

#### 消息堆积指标及监控配置

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502103776-224e38d1-e3a5-4e27-9d3a-cba071111280.png#clientId=ueacb93f6-0fd6-4&height=246&id=bODQ4&name=3.png&originHeight=246&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u361edf7d-8b9f-4a16-8fdd-35a0ea312f4&title=&width=1080)

业界通用指标：使用消息堆积量（ready + inflight）来度量消费健康度，表示未处理完成的消息量；部分产品额外增加已就绪消息量来度量消息拉取的及时性；使用上述 2 个指标直接来配置报警有以下缺点：

- 有误报或无法触发报警的问题
- 及时性的间接指标，不直观

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502102046-3febfd28-5a2f-4400-82db-75b4672c52a7.png#clientId=ueacb93f6-0fd6-4&height=317&id=gx2OO&name=4.png&originHeight=317&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u96210f7d-32d0-42fb-bd3c-1413b8756ce&title=&width=1080)

RocketMQ 指标：额外支持延时时间来度量消费健康度，涵盖了所有业务场景，根据业务容忍延迟度直接配置时间告警阈值。

- 消息处理延迟时间：表示业务处理完成及时度
- 已就绪消息排队时间：表示拉取消息及时度

建议对消息堆积敏感的用户，都在 RocketMQ 实例页的监控报警，添加如下报警指标，并设置符合业务需求的阈值。

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502102146-42561ecc-2f72-433f-a32b-5ef795b921c4.png#clientId=ueacb93f6-0fd6-4&height=1092&id=MmzIc&name=5.png&originHeight=1092&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9dd71db8-9aeb-49a9-ad97-ab937b18747&title=&width=1080)
![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502104287-77021ec9-cc90-461d-83a8-ba92c9b768b7.png#clientId=ueacb93f6-0fd6-4&height=1106&id=zCqSP&name=6.png&originHeight=1106&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ubbde3f63-f589-4287-ace7-7108b2a5867&title=&width=1080)

#### 如何定位和处理堆积问题

假如收到堆积报警，确认消息出现堆积情况，可参考以下措施进行定位和处理。

1. 判断消息堆积在 RocketMQ 服务端还是客户端
- 查看客户端本地日志文件 ons.log，搜索是否出现如下信息：the cached message count exceeds the threshold
- 出现相关日志信息，说明客户端本地缓冲队列已满，消息堆积在客户端，请执行步骤2。
- 若未出现相关日志，说明消息堆积不在客户端，若出现这种特殊情况，请直接提交工单联系阿里云技术支持。
2. 确认消息的消费耗时是否合理
- 若查看到消费耗时较长，则需要查看客户端堆栈信息排查具体业务逻辑，请执行步骤3。
- 若查看到消费耗时正常，则有可能是因为消费并发度不够导致消息堆积，需要逐步调大消费线程或扩容节点来解决。

消息的消费耗时可以通过以下方式查看：

查看消费者状态，在客户端连接信息中查看业务处理时间，获取消费耗时的平均值。

![7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502104364-9d14e659-4d33-4b6b-b10c-c509f2adf088.png#clientId=ueacb93f6-0fd6-4&height=183&id=OBrIj&name=7.png&originHeight=183&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud8a36b4d-f740-42b1-b0c7-7ffa89e3d8d&title=&width=1080)

3. 查看客户端堆栈信息。只需要关注线程名为 ConsumeMessageThread 的线程，这些都是业务消费消息的逻辑。
- 客户端堆栈信息可以通过以下方式获取：查看消费者状态，在客户端连接信息中查看 Java 客户端堆栈信息

![8.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502104522-5c30207e-c77a-42ca-8531-54e07774fd3b.png#clientId=ueacb93f6-0fd6-4&height=341&id=piErC&name=8.png&originHeight=341&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ufdfb2830-2eb2-4e20-b0af-689a99de0a4&title=&width=1080)
![9.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502104545-75fd8374-5a81-4dbe-8b46-5af197fbfd51.png#clientId=ueacb93f6-0fd6-4&height=596&id=Zef3v&name=9.png&originHeight=596&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6db26489-9b4f-45bd-b232-404ff1a0af2&title=&width=1080)

- 使用 Jstack 工具打印堆栈信息。

常见的异常堆栈信息如下：

消费逻辑有抢锁休眠等待等情况。消费线程阻塞在内部的一个睡眠等待上，导致消费缓慢。

    - 示例一：

![10.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502104611-406c05f8-3634-46b0-b06f-c78d3ac19651.png#clientId=ueacb93f6-0fd6-4&height=230&id=ZoeAt&name=10.png&originHeight=230&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud04fb9c2-6f19-4055-945f-2766c4295f0&title=&width=1080)

消费逻辑操作数据库等外部存储卡住。消费线程阻塞在外部的 HTTP 调用上，导致消费缓慢。

    - 示例二：

![11.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502104944-bd616f1a-b7f4-469b-84ff-89a6ac224969.png#clientId=ueacb93f6-0fd6-4&height=320&id=jJGUs&name=11.png&originHeight=320&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue5baefee-5311-41e3-b7ce-1d4fed4e298&title=&width=1080)

4. 针对某些特殊业务场景，如果消息堆积已经影响到业务运行，且堆积的消息本身可以跳过不消费，您可以通过重置消费位点跳过这些堆积的消息从最新位点开始消费，快速恢复业务。

#### 如何避免消息堆积

为了避免在业务使用时出现非预期的消息堆积和延迟问题，需要在前期设计阶段对整个业务逻辑进行完善的排查和梳理。整理出正常业务运行场景下的性能基线，才能在故障场景下迅速定位到阻塞点。其中最重要的就是梳理消息的消费耗时和消息消费的并发度。

- 梳理消息的消费耗时通过压测获取消息的消费耗时，并对耗时较高的操作的代码逻辑进行分析。梳理消息的消费耗时需要关注以下信息：
    - 消息消费逻辑的计算复杂度是否过高，代码是否存在无限循环和递归等缺陷。
    - 消息消费逻辑中的 I/O 操作（如：外部调用、读写存储等）是否是必须的，能否用本地缓存等方案规避。外部 I/O 操作通常包括如下业务逻辑：
    - 读写外部数据库，例如 MySQL 数据库读写。
    - 读写外部缓存等系统，例如 Redis 读写。
    - 下游系统调用，例如 Dubbo 调用或者下游 HTTP 接口调用。
    - 消费逻辑中的复杂耗时的操作是否可以做异步化处理，如果可以是否会造成逻辑错乱（消费完成但异步操作未完成）。
- 设置消息的消费并发度
    - 逐步调大线程的单个节点的线程数，并观测节点的系统指标，得到单个节点最优的消费线程数和消息吞吐量。
    - 得到单个节点的最优线程数和消息吞吐量后，根据上下游链路的流量峰值计算出需要设置的节点数，节点数=流量峰值/单线程消息吞吐量。

### 应用场景2：消息收发失败问题

#### 消息收发的核心流程

![12.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502105169-77fccc1e-9097-4500-9d69-0f02369d1b76.png#clientId=ueacb93f6-0fd6-4&height=693&id=qx1Il&name=12.png&originHeight=693&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud9293803-e7f9-48a5-808b-4f89c6dd9c5&title=&width=1080)

从上图中可以看出消息收发都要先从 NameServer 返回路由，再通过 broker 的鉴权以及实例规格是否超限的判断，才能进行正常收发消息。根据经验检消息收发失败的原因有如下情况：

- API 请求频率是否超过实例规格限制
- 查网络是否正常
- 服务端是否是有重启造成的短期收发失败
- 操作资源是否有权限

#### 常见的消息收发失败异常

在无论开发阶段还是生产运行阶段，遇到收发失败问题，我们都可以从客户端日志出发进行排查。以下列举下常见的消息收发失败异常场景：

1. 在客户端日志中出现ClusterName ** consumer groupId ** consumer topic ** messages flow control, flow limit threshold is ***, remainMs **异常信息

原因：RocketMQ 每个实例都明确了消息收发 API 调用 TPS，例如，标准版实例支持每秒 5000 次 API 调用，若实例消息收发 API 调用频率超过规格限制，会导致实例被限流。实例被限流后，导致部分消息收发请求失败。

建议措施：

    1. 配置实例 API 调用频率监控告警

建议设置为规格上限的 70%。例如，您购买的实例消息收发 TPS 上限为 10000，则告警阈值建议设置为 7000。

![13.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502105280-21e5905b-5269-43f4-9ba1-dabd303ddef8.png#clientId=ueacb93f6-0fd6-4&height=575&id=wXqUI&name=13.png&originHeight=575&originWidth=629&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua139f008-1434-4a2e-a10a-f2c2f137b45&title=&width=629)

    1. 配置限流次数告警

RocketMQ 支持将指定实例触发限流的事件作为监控项，通过对限流次数的监控，可以帮助您了解当前业务的受损情况。

![14.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680502105524-37bde2b4-182f-4a6f-a667-99f07b1eaf2f.png#clientId=ueacb93f6-0fd6-4&height=577&id=DSuSX&name=14.png&originHeight=577&originWidth=615&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u3fc6101a-b8b9-402a-8caa-9703650260e&title=&width=615)

2. 在客户端日志中出现RemotingConnectException: connect to <118.xx.xx.xx:80> failed 或者 RemotingTimeoutException 等异常信息。

可能有如下原因：

    - MQ 服务升级过程中 , 会出现短暂的网络闪断，查看官网公告看是否在服务升级窗口
    - 检查应用服务器到broker的网络是否通畅，是否有网络延迟
    - 检查应用的网络带宽情况，是否被打满
    - 确认下应用是否出现 FGC 现象，FGC 会造成一定的网络延迟

3. 在客户端日志当中出现 system busy, start flow control for a while 或者 broker busy, start flow control for a while等异常信息。

可能原因：共享集群 broker（出现网络，磁盘，IO 等抖动）压力大，造成消息收发出现排队现象；若是偶尔短暂抖动，此类错误 SDK 会自动重试，但建议在自己的业务代码做好异常处理，当自动重试次数超限仍失败情况下，业务根据需要做好容灾。若长时间持续出现，可以提工单让技术人员跟进排查。

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)

