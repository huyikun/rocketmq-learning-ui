---
title: "RocketMQ在搜狐的创新实践"
date: "2021/07/30"
author: ""
img: "https://img.alicdn.com/imgextra/i1/O1CN01wWIvMn1q3ZQgaYLz7_!!6000000005440-0-tps-685-383.jpg"
tags: ["practice"]
description: "大多数的视频各部门中使用过的消息中间件，包括有 RedisMQ、ActiveMQ、RocketMQ、Kafka 等，本文将选取几个典型的业务介绍一下其使用场景及问题。"
---
# MQ使用场景及选型

大多数的视频各部门中使用过的消息中间件，包括有 RedisMQ、ActiveMQ、RocketMQ、Kafka 等，本文将选取几个典型的业务介绍一下其使用场景及问题。

## 1、引入RocketMQ


最开始使用 RocketMQ 的是计数业务，计数业务需要将客户端的播放量实时计算并展示。当时采用 Redis 进行实时计数，再异步调用数据库进行计数。起初这种模式没什么问题，但是随着业务量变大，数据库压力也进一步增大。甚至有时候数据库机器的 CPU 快被打满了，另外当数据库迁移时，需要暂停写入，计数将面临数据丢失。

这时计数业务迫切需要一个可靠的，能实时消费，且能够堆积的 MQ 来改变这种状况.

当时我们考虑了 RocketMQ 和 Kafka，却最终选择了 RocketMQ，原因请参考下方。

## 2、放弃 Kafka


放弃 Kafka 投放业务需要将为用户推荐的内容投放到各个区域，但是推荐业务需要知道用户对于推荐内容的反馈，所以投放业务选择了使用 Kafka 来跟推荐业务交互。但是由于某次机器故障，导致 Kafka 集群发生故障转移，而不幸的是，这个集群的分区数过多，导致转移耗时几分钟才完成。

进而导致业务线程阻塞，服务进入无响应状态。而之后了解到 RocketMQ 即使某个 broker 宕机，消息会发送到其他 broker，不会产生整个集群阻塞情况，后来投放业务就将消息交互全部迁移到了 RocketMQ 上。

## 3、不可靠的 RedisMQ 

之前视频基础服务使用了 RedisMQ，用来通知调用方，视频数据发生了变化，进行数据更新。而redis的消息推送基于 pub/sub 模式，虽然实时性很高，但是却不保证可靠，而且消息不会进行持久化。

这两个缺点就导致了某些情况下，调用方收不到通知，而且消息丢失时基本无据可查。

所以此业务最终放弃了 RedisMQ，转而投向 RocketMQ。RocketMQ 能够保证消息至少被投递一次，而且消息支持持久化，即使客户端重启，仍然可以从上次消费的地方继续消费。

## 4、低性能 ActiveMQ 

用户视频基础服务之前使用了 ActiveMQ，主要用于通知依赖方数据变更，它的消息体里包含了变更的数据。遗憾的是，当消息量很大时，ActiveMQ 经常出现无法响应的情况，甚至消费者出现长时间接收不到消息的情况。而了解到 RocketMQ 单个 broker 可以承担几十万 TPS，亿级消息堆积时，此业务也迁移到 了RocketMQ 上。

目前使用 RocketMQ 的业务，包括视频基础服务，用户服务，直播业务，付费业务，审核等等业务系统。而 Kafka 大部分只用于日志相关的处理服务上，比如日志上报，业务日志收集等等。

另外，随着 RocketMQ 支持的客户端越来越丰富，也便于我们很多其他语言的业务接入，比如 AI 组使用 python 客户端，一些 GO 开发的业务，使用 GO 客户端等。


# 运维之痛

初期，我们运维 RocketMQ 基本靠命令行和 RocketMQ-Console。业务方经常来询问的问题包括如下：

- 我有哪些机器在往这个topic发送消息？
- 发送消息怎么超时了？
- 发送失败能通知我吗？
- 消费失败了能通知我吗？
- 消息体是啥样的？
- RocketMQ集群不可用了能不能降级隔离？
- 我消费我的topic为啥导致别的业务消费混乱？
- 为啥还需要我自己序列化？

问题很多，而且千奇百怪！

而作为运维人员，除了调查解答业务方的问题之外，在命令行运维 RocketMQ，更让我们小心翼翼。生怕脑子一时糊涂，敲错一个命令，造成大面积故障。随着运维的深入，我们总结了一篇又一篇的使用规范，最佳实践，命名约定，操作步骤等等的文章。但是，随之发现，这些文章对生产效率的提升并不明显。所以与其写文档不如将经验和实践转换为产品，能够更好的服务于业务，因此 MQCloud 应运而生。

# MQCloud 诞生

先看一下 MQCloud 的定位：

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488789588-fe49d37b-6f42-48ec-80f0-08a3a19e6bd6.png#clientId=u77d27230-571f-4&height=360&id=VDNnR&name=1.png&originHeight=360&originWidth=434&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u70d658a1-b87f-4cb0-b0bc-29b077e5678&title=&width=434)

它是集客户端 SDK，监控预警，集群运维于一体的一站式服务平台。MQCloud 的系统架构如下：

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488789688-88db5e56-c4f9-4ca7-8faa-f4493c0f31a7.png#clientId=u77d27230-571f-4&height=414&id=N6WAh&name=2.png&originHeight=414&originWidth=694&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud772c0a4-fa71-4ebd-8a11-c0603209837&title=&width=694)

接下来分别说明一下 MQCloud 如何解决上面提到的痛点。

## 1、业务端和运维端分离，使业务用户只聚焦于业务数据

为了实现这个目的，引入了用户，资源两大维度。针对用户和资源加以控制，使不同的用户只聚焦于自己的数据。

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488791487-7365c409-12f1-4e99-beb2-1bb68dffe80a.png#clientId=u77d27230-571f-4&height=319&id=ChXY4&name=3.png&originHeight=319&originWidth=686&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1e19e74f-59a0-469a-8316-5c79f795ac0&title=&width=686)

- 对于生产方来说，他关心的是 topic 配置，消息的发送数据，谁在消费等等问题，这样只对他展示相应的数据即可；
- 对于消费者来说，只关心消费状况，有没有堆积，消费失败等情况；
- 对于管理员来说，可以进行部署，监控，统一配置，审批等日常运维；

## 2、清晰明了的操作

通过对不同角色展示不同的视图，使用户可以进行的操作一目了然。

## 3、规范和安全

为了保障集群操作的安全性和规范性，所有的操作都会以申请单的形式进入后台审批系统，管理员来进行相关审批，安全性大大提升。

## 4、多维的数据统计和监控预警


MQCloud 核心功能之一就是**监控预警**，目前支持如下预警：

- 生产消息异常预警
- 消费消息堆积预警（broker 角度）
- 消费客户端阻塞（客户端角度）
- 消费失败预警
- 消费偏移量错误预警
- 消费订阅错误预警
- 消费落后预警（超出内存阈值，从硬盘拉数据）
- 死消息预警（消费失败太多，消息进入死信队列）
- 消息流量异常预警
- 消息存储耗时过长预警（broker 存储消息耗时）
- broker&NameServer 宕机预警
- 服务器宕机预警
- 服务器 cpu，内存，网络流量等指标预警

要想做监控，必须先做统计，为了更好的知道 RocketMQ 集群的运行状况，MQCloud 做了大量的统计工作（大部分依赖于 broker 的统计），主要包括如下几项：

- 每分钟 topic 的生产流量：用于绘制 topic 生产流量图及监控预警。
- 每分钟消费者流量：用于绘制消费流量图及监控预警。
- 每10分钟 topic 生产流量：用于按照流量展示 topic 排序。
- 每分钟 broker 生产、消费流量：用于绘制 broker 生产消费流量图。
- 每分钟集群生产、消费流量：用于绘制集群的生产流量图。
- 每分钟生产者百分位耗时、异常统计：以 ip 维度绘制每个生产者的耗时流量图及监控预警。
- 机器的 cpu，内存，io，网络流量，网络连接等统计：用于服务器的状况图和监控预警。

下面捡一两点进行一下说明：

### 1、生产异常耗时统计：

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488789560-f808eada-5c58-4d72-b54e-29a2f98d6ebe.png#clientId=u77d27230-571f-4&height=331&id=TcnGr&name=4.png&originHeight=331&originWidth=907&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0c894fd7-c2e2-46a6-9f01-61399238708&title=&width=907)

由于 RocketMQ 并没有提供生产者的流量统计（只提供了 topic，但是并不知道每个生产者的情况），所以 MQCloud 实现了对生产者数据进行统计（通过 RocketMQ 的回调钩子实现）:

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488789528-6949de87-d4b1-401d-9ade-afcdec96d8c6.png#clientId=u77d27230-571f-4&height=190&id=hky7s&name=5.png&originHeight=190&originWidth=370&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u80ac9a5e-d104-44de-8678-9cb3ae1a80e&title=&width=370)

主要统计如下信息：

- 客户端 ip->broker ip
- 发送消息耗时
- 消息数量
- 发送异常

统计完成后，定时发送到 MQCloud 进行存储，并做实时监控和展示。

关于统计部分有一点说明，一般耗时统计有最大，最小和平均值，而通常 99% (即 99% 的请求耗时都低于此数值)的请求的耗时情况才能反映真实响应情况。99% 请求耗时统计最大的问题是如何控制内存占用，因为需要对某段时间内所有的耗时做排序后才能统计出这段时间的 99% 的耗时状况。而对于流式数据做这样的统计是有一些算法和数据结构的，例如 t-digest，但是 MQCloud 采用了非精确的但是较为简单的分段统计的方法，具体如下：

1、创建一个按照最大耗时预哈希的时间跨度不同的**耗时分段数组**：

第一段：耗时范围 0ms~10ms，时间跨度为 1ms。

![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488791877-d4d96528-dceb-409c-83b9-9958fc2854b0.png#clientId=u77d27230-571f-4&height=112&id=cevW9&name=6.png&originHeight=112&originWidth=288&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u91c1ac39-47a2-4627-ad9e-00961a36a9d&title=&width=288)![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488791958-d4893ebc-f05b-4769-a36c-7776514fe56d.png#clientId=u77d27230-571f-4&height=1&id=Ss9OI&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u91f91e9e-3bb3-4acb-b74e-34bc994f199&title=&width=1)

第二组：耗时范围 11ms~100ms，时间跨度 5ms。

![7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488791902-0c98a27a-7fd7-4656-98a7-d4e17775afb0.png#clientId=u77d27230-571f-4&height=114&id=MQxTE&name=7.png&originHeight=114&originWidth=582&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u60541029-cbcb-461e-a5c6-85977a94ee2&title=&width=582)![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488791952-eb0e9045-30cd-4120-bd4b-69d1577bb3a1.png#clientId=u77d27230-571f-4&height=1&id=HAjh2&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u698a4034-9bb8-4cd8-877c-86bdd4cfee8&title=&width=1)

第三组：耗时范围 101ms~3500ms，时间跨度 50ms。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488792156-7d823f7e-161a-4462-a76d-28b2f719028f.png#clientId=u77d27230-571f-4&height=1&id=GAgha&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua96236d4-dbcb-48ac-9d5c-88e05db9353&title=&width=1)![8.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488792637-b3179818-a7a7-47df-bba0-24777ab5f208.png#clientId=u77d27230-571f-4&height=114&id=JWbyN&name=8.png&originHeight=114&originWidth=587&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uedf820bf-8cf5-4359-b834-293834774b8&title=&width=587)

_优点：此种分段方法占用内存是固定的，比如最大耗时如果为3500ms，那么只需要空间大小为96的数组即可缺点：分段精度需要提前设定好，且不可更改。_

2、针对上面的分段数组，创建一个大小对应的AtomicLong的**计数数组**，支持并发统计：

![9.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488792816-fef34760-04d5-4166-bf11-c9a3c957f65d.png#clientId=u77d27230-571f-4&height=65&id=KfjAM&name=9.png&originHeight=65&originWidth=628&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ucf37a7f4-6c75-4533-b988-1dd1de24e84&title=&width=628)![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488792779-dd99d456-f55a-4881-b45c-0834f7df4e0d.png#clientId=u77d27230-571f-4&height=1&id=bxSIS&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf6017885-1436-4939-b6df-a49924f62a0&title=&width=1)

3、耗时统计时，计算耗时对应的**耗时分段数组**下标，然后调用**计数数组**进行统计即可，参考下图：

![10.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488792770-4beef574-8672-45c3-907e-6a4bdd01f1b2.png#clientId=u77d27230-571f-4&height=300&id=k3NzH&name=10.png&originHeight=300&originWidth=633&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9b4cc982-a624-406f-9093-588d1550cbc&title=&width=633)![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488792841-33668c49-3904-4396-899c-c316a335a033.png#clientId=u77d27230-571f-4&height=1&id=ZxkRd&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u994f53a0-66ef-44cd-860b-75c44eb2377&title=&width=1)

- 例如某次耗时为18ms，首先找到它所属的区间，即归属于[16~20]ms之间，对应的数组下标为12。

- 根据第一步找到的数组下标12，获取对应的计数数组下标12。

- 获取对应的计数器进行+1操作，即表示18ms发生了一次调用。


这样，从**计数数组**就可以得到实时耗时统计，类似如下：

![11.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488793213-aefaf33e-339c-416b-94b9-7787189e7518.png#clientId=u77d27230-571f-4&height=153&id=y2RiM&name=11.png&originHeight=153&originWidth=669&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2a8fd38a-e861-44f4-b77a-885f7961967&title=&width=669)

4、然后定时采样任务会每分钟对**计数数组**进行快照，产生如下**耗时数据**：

![12.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488793371-e9b29c86-2122-4fcb-9569-1da0319d9c71.png#clientId=u77d27230-571f-4&height=107&id=VDyJA&name=12.png&originHeight=107&originWidth=670&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u298151c3-8137-4645-9eec-273dd787872&title=&width=670)

5、由于上面的**耗时数据**天然就是排好序的，可以很容易计算 99%、90%、平均耗时等数据了。

_另外提一点，由于 RocketMQ 4.4.0 新增的 trace 功能也使用 hook 来实现，与 MQCloud 的统计有冲突，MQCloud 已经做了兼容。Trace 和统计是两种维度，trace 反映的是消息从生产->存储->消费的流程，而 MQCloud 做的是针对生产者状况的统计，有了这些统计数据，才可以做到生产耗时情况展示，生产异常情况预警等功能。_

### 2、机器统计

关于集群状况收集主要采用了将nmon自动放置到/tmp目录，定时采用ssh连接到机器执行nmon命令，解析返回的数据，然后进行存储。

上面这些工作就为监控和预警奠定了坚实的数据基础。

## 一、单独定制的客户端

![13.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488793438-780780ca-488a-4ac6-9c2b-73354557e7f8.png#clientId=u77d27230-571f-4&height=290&id=QGFIc&name=13.png&originHeight=290&originWidth=365&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u41d956d4-b68f-4720-ba47-66203ed5f6e&title=&width=365)
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488793500-07b24f5e-d744-4dc2-a602-b8cd5bff1916.png#clientId=u77d27230-571f-4&height=1&id=masoN&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u65e1553f-aa80-48e6-bfc4-44079f7ee9b&title=&width=1)
针对客户端的一些需求，mq-client 在 rocketmq-client 的基础上进行了开发定制：

### 1、多集群支持
MQCloud储存了生产者、消费者和集群的关系，通过路由适配，客户端可以自动路由到目标集群上，使客户端对多集群透明。

### 2、透明的trace集群
通过搭建单独的trace集群和定制客户端，使trace数据能够发往独立的集群，防止影响主集群。

### 3、序列化

通过集成不同的序列化机制，配合MQCloud，客户端无需关心序列化问题。
目前支持的序列化为protobuf和json，并且通过类型检测支持在线修改序列化方式。

### 4、流控
通过提供令牌桶和漏桶限流机制，自动开启流控机制，防止消息洪峰冲垮业务端，也为需要精准控制流速的业务提供了方便。

### 5、隔离降级
针对生产消息使用hystrix提供了隔离api，使业务端在broker故障时可以避免拖累。

### 6、埋点监控
通过对客户端数据进行统计，收集，在MQCloud里进行监控，使客户端任何风吹草动都能及时得知。

### 7、规范问题

通过编码保障，使某些约定，规范和最佳实践得以实现。包括但不限于：

- 命名规范

- 消费组全局唯一，防止重复导致消费问题

- 重试消息跳过

- 安全关闭等等

- 更完善的重试机制


## 二、近乎自动化运维


### 1、部署

手动部署一台 broker 实例没什么问题，但是当实例变多时，手动部署极易出错且耗时耗力。

MQCloud 提供了一套自动化部署机制，包括停止写入，上下线，本地更新，远程迁移（包含数据校验）:

![14.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488793740-d102d128-d3b0-45dd-bd71-b0c6e00e7d88.png#clientId=u77d27230-571f-4&height=175&id=lVeHJ&name=14.png&originHeight=175&originWidth=1217&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0cb48a82-4e37-4d63-8f84-c4ccede0124&title=&width=1217)

**支持一键部署：**

![15.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488793909-4e2b3413-f6ae-49dd-8c4c-7f7c6d662f2e.png#clientId=u77d27230-571f-4&height=937&id=cNGGB&name=15.png&originHeight=937&originWidth=982&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ueb3ee678-6ed2-4a02-956b-ed06e1a13f4&title=&width=982)

另外，broker 作为 RocketMQ 的核心，其配置有百项之多，而且好多涉及到性能调优，调整时往往需要根据服务器的状况谨慎调整，MQCloud 开发了**配置模板**功能来支持灵活的部署项：

![16.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488794193-07a8f8f9-9bae-4a60-8216-c42e44d25f29.png#clientId=u77d27230-571f-4&height=751&id=YNnRb&name=16.png&originHeight=751&originWidth=945&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u503112d1-56b4-4936-abb7-4419efff8a4&title=&width=945)

### 2、机器运维

MQCloud 提供了一整套机器的运维机制，大大提升了生产力。

### 3、可视化的集群拓扑


![17.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680488794268-3af15836-1925-4a6d-8d0a-ed3c39929e65.gif#clientId=u77d27230-571f-4&height=538&id=lZS9Z&name=17.gif&originHeight=538&originWidth=756&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5f3fc37f-2217-481a-867d-0174365c91a&title=&width=756)

## 三、安全性加固

### 1、开启管理员权限


RocketMQ 从 4.4.0 开始支持 ACL，但是默认没有开启，也就是任何人使用管理工具或 API 就可以直接操纵线上集群。但是开启 ACL 对现有业务影响太大，针对这种情况 MQCloud 进行专门定制。

借鉴 RocketMQ ACL 机制，只针对 RocketMQ 管理员操作加固权限校验：

![18.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488794190-017d06d7-788d-4052-9d05-53977b21a710.png#clientId=u77d27230-571f-4&height=536&id=KU9nU&name=18.png&originHeight=536&originWidth=219&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u3df45d4b-7d23-435c-a87a-5a68142e28f&title=&width=219)

并且支持自定义和热加载管理员请求码，使得非法操作 RocketMQ 集群成为不可能，安全性大大提升。

**2broker 通信加固**

broker 同步数据代码由于没有校验，存在安全隐患，只要连接 master 监听的 slave 通信端口，发送数据大于 8 个字节，就可能导致同步偏移量错误，代码如下：

MQCloud 通过验证数据首包的策略，保障了通信的安全性。

if ((this.byteBufferRead.position() - this.processPostion) >= 8) {
  int pos = this.byteBufferRead.position() - (this.byteBufferRead.position() % 8);
  long readOffset = this.byteBufferRead.getLong(pos - 8);
  this.processPostion = pos;
  HAConnection.this.slaveAckOffset = readOffset;
  if (HAConnection.this.slaveRequestOffset < 0) {
      HAConnection.this.slaveRequestOffset = readOffset;
      log.info("slave[" + HAConnection.this.clientAddr + "] request offset " + readOffset);
  }
  HAConnection.this.haService.notifyTransferSome(HAConnection.this.slaveAckOffset);
}

# 开源之路

目前 MQCloud 运维规模如下：

- 服务器：50台+
- 集群：5个+
- topic：800个+
- consumer：1400+
- 生产消费消息量/日：4 亿条+
- 生产消费消息大小/日：400G+

MQCloud 在充分考虑和吸收实际业务的需求后，以各个角色聚焦为核心，以全面监控为目标，以满足各业务端需求为己任，在不断地发展和完善。

在 MQCloud 逐渐成熟之后，秉承着服务于社区和吸收更多经验的理念，我们开放了源代码。经过设计和拆分，MQCloud 于 18 年开源了，从第一个版本 release 到现在已经过去两年了，期间随着更新迭代大大小小一共 release 了 20 多个版本。其中不但包含功能更新、bug 修复、wiki 说明等，而且每个大版本都经过详细的测试和内部的运行。之后很多小伙伴跃跃欲试，来试用它，并提出一些建议和意见，我们根据反馈来进一步完善它。

我们将一直遵循我们的目标，坚定的走自己的开源之路：

- 为业务提供可监控，可预警，可满足其各种需求的稳定的 MQ 服务。
- 积累 MQ 领域经验，将经验转化为产品，更好的服务业务。

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)