---
title: "基于消息队列 RocketMQ  的大型分布式应用上云最佳实践"
date: "2021/11/02"
author: "绍舒"
img: "https://img.alicdn.com/imgextra/i2/O1CN01Ewqv5p1ehcgFLd7a2_!!6000000003903-0-tps-685-383.jpg"
tags: ["practice"]
description: " Apache RocketMQ 作为阿里巴巴开源的支撑万亿级数据洪峰的分布式消息中间件，在众多行业广泛应用。在选型过程中，开发者一定会关注开源版与商业版的业务价值对比。 那么，今天就围绕着商业版本的消息队列 RocketMQ和开源版本 RocketMQ 进行比较，并结合实践中场景全面展示大型分布式应用的上云最佳实践。"
---
_作者｜绍舒_
_审核&校对：岁月、佳佳_
_编辑&排版：雯燕_

# 前言

消息队列是分布式互联网架构的重要基础设施，在以下场景都有着重要的应用：

- 应用解耦
- 削峰填谷
- 异步通知
- 分布式事务
- 大数据处理

并涉及互动直播、移动互联网&物联网，IM 实时通信、Cache 同步、日志监控等多个领域。

而本文主要围绕着商业版本的消息队列 RocketMQ，和开源版本 RocketMQ 进行比较，并结合一些实践中的场景来展示大型分布式应用的上云最佳实践。

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489184790-a57de127-142f-4858-98e1-658927815207.png#clientId=ud2c97884-e439-4&height=447&id=mFxhA&name=1.png&originHeight=447&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub12517d0-79d3-42fe-aaf2-944cdf1d4e2&title=&width=1080)

# 核心能力
## 

商业版本消息队列 RocketMQ 相比较开源版本 RocketMQ 和其他竞品，主要有以下几点优势。

1. 开箱即用、功能丰富
2. 高性能、无限扩展能力
3. 可观测、免运维能力
4. 高 SLA 和稳定性保证

![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489184662-4afc6afa-6d7e-4f31-8af6-fe97f2bfd441.gif#clientId=ud2c97884-e439-4&height=1&id=qACuN&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u48a36e07-349b-4592-a30b-593c0b82cea&title=&width=1)![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489186631-0c02bbcf-b77b-42db-b271-dd51a4490b8a.png#clientId=ud2c97884-e439-4&height=375&id=XtxLH&name=2.png&originHeight=375&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua61c9e6e-bb12-4ff0-ad71-9053e769d66&title=&width=1080)

### 开箱即用、功能丰富

消息队列 RocketMQ 提供了定时、事务、顺序等多类型消息的支持，且支持广播、集群两种消费模式；另外在协议层面，提供 TCP/HTTP 多协议支持，还提供了 TAG/SQL 属性过滤功能，极大程度地拓宽了用户的使用场景。

### 高性能、无限拓展能力

消息队列 RocketMQ 经受了阿里核心电商历年双十一洪峰的考验，支持千万级 TPS 消息收发和亿级消息堆积的能力，并且能够为消息提供毫秒级端到端延迟保障，另外还提供分级存储，支持海量消息的任意保存时间。

### 可观测、免运维能力

消息队列 RocketMQ 提供了一个可观测性大盘，支持细粒度数据大盘，提供了消息全链路生命周期追踪和查询能力，对各个指标提供了相应的监控报警功能；此外，还提供了消息回溯和死信队列功能，能够保证用户的消息能够随时回溯消费。

### 高 SLA 和稳定性保障

消息队列 RocketMQ 的稳定性是我们一贯、持续、稳定投入的重要领域，提供了高可用部署和多副本写入功能；另外也支持同城多 AZ 容灾和异地多活。

# 产品剖面
## 

接下来，我们会从以上的产品核心能力中挑选几个剖面，并且结合具体的场景和实践来做进一步的介绍。

### 多消息类型支持

#### 高可用顺序消息

商业版本消息队列 RocketMQ 使用的顺序消息我们称之为高可用顺序消息。在介绍高可用顺序消息之前，首先简要介绍下开源版本 RocketMQ 的顺序消息。

顺序消息分为两种类型，全局顺序消息和分区顺序消息。

- 全局顺序消息：在 RocketMQ 存储层只会分配一个分区，也就是说全局顺序 Topic 的可用性跟单一副本的可用性强相关，且不具备可扩展的能力。
- 分区顺序消息：所有消息根据 Sharding Key 进行分区。同一个分区内的消息按照严格的 FIFO 顺序进行发布和消费。Sharding Key 是顺序消息中用来区分不同分区的关键字段。

下图是分区顺序消息的应用场景，order ID 即为此时顺序消息的 Sharding Key。

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489184664-c2a2bd93-3779-4285-89a7-8e39e6647f8d.png#clientId=ud2c97884-e439-4&height=576&id=Gz2xN&name=3.png&originHeight=576&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua282042b-e63f-4c58-bf09-14dd8f45849&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489184344-14a0d230-4707-4071-a06c-ae72b605eed7.gif#clientId=ud2c97884-e439-4&height=1&id=ayImr&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u52870d98-7d8f-42dc-9134-73ee118ccd5&title=&width=1)
可以看到，无论是全局顺序消息还是分区顺序消息，都依赖了单一分区天然的 FIFO 特性来保证顺序，因此顺序性也只能在同一个分区内保证，当此分区所在的副本不可用时，顺序消息并不具备重试到其他副本的能力，此时消息的顺序性就难以得到保证。

为了解决这一问题，我们设计并实现了高可用顺序消息。

高可用顺序消息有以下几个特点：

- 一个逻辑顺序分区（PartitionGroup）下有多个物理分区。
- 其中任意一个物理分区是可写的，那么整个逻辑分区是可写且有序的。
- 我们基于 happened-before 的原则设计了一套基于分区位点的排序算法。
- 根据该算法，消费者在消费某一逻辑分区时，会从其所属的各个物理分区中拉取消息并进行合并排序，得出正确的消息顺序流。

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489186816-0331c212-4141-46ae-8a76-1c90e11314a9.png#clientId=ud2c97884-e439-4&height=1480&id=nbSPF&name=4.png&originHeight=1480&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua539032a-321c-4ce8-b6ec-3e8b64b1369&title=&width=1080)

通过这样的设计，高可用顺序消息解决了下列几点问题：

- 可用性问题：高可用顺序消息将具备与普通消息一致的可用性，在某副本不可用时，可快速重试至其它副本。
- 可扩展性问题：普通顺序消息，特别是普通全局顺序消息，不具备良好的扩展能力，只能固定在特定的副本中。高可用顺序消息的逻辑顺序分区可以将物理顺序分区分散在多个副本中。
- 热点问题：普通顺序消息根据 Key 将一类消息 Hash 至同一个分区中，热点 Key 会导致热点分区，高可用顺序消息具备横向扩展能力，可以为逻辑顺序分区添加多个物理分区来消除热点问题。
- 单点问题：普通全局顺序消息，仅包含单分区，极易出现单点故障，高可用顺序消息可以消除全局顺序消息的单点问题。

尤其需要注意的是热点问题，在阿里巴巴内部某电商业务大促时，因发送到顺序 Topic 的某一特定的 ShardingKey 数量过多，集群中一个副本接收到了大量该 ShardingKey 的消息，导致该副本超出其负荷上限，造成了消息的延迟和堆积，一定程度上影响了业务。在使用了高可用顺序消息之后，由于其在多物理分区中的负载均衡特性，提升了集群顺序消息的承载能力，从而避免了热点问题的出现。

#### 秒级精准定时消息

定时消息，是指客户端当前发送但希望在未来的某个时间内收到的消息。定时消息广泛应用于各类调度系统或者业务系统之中。比如支付订单，产生一个支付消息，系统通常需要在一定时间后处理该消息，判断用户是否支付成功，然后系统做相应处理。

开源版本的 RocketMQ 只支持几个指定的延迟级别，并不支持秒级精度的定时消息。而面向集团内和云上多样化的需求，开源版本的定时消息并不能满足我们的需求，因此我们推出了秒级精准定时消息。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489186718-7a493d5c-f884-4c9e-8585-ae57c320d568.gif#clientId=ud2c97884-e439-4&height=1&id=bylSE&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u61079152-9551-48ad-b231-19e791f3c3b&title=&width=1)

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489186817-7f281b2f-9392-4fb8-a3f1-ef063d227768.png#clientId=ud2c97884-e439-4&height=581&id=nbDl4&name=5.png&originHeight=581&originWidth=765&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u965e9e9b-3b22-4fac-a446-9f8fc6bf32a&title=&width=765)

如下图所示，我们基于时间轮设计并实现了支持任意定时时间的秒级精准定时消息，同时满足以下特性：

- 任意定时时间
- 超长定时时间
- 海量定时消息
- 删除定时消息
- 高可用
- 高性能

![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489186857-0602be07-1b6a-478c-8bfb-a61550ab81bb.png#clientId=ud2c97884-e439-4&height=769&id=jQSwd&name=6.png&originHeight=769&originWidth=1076&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u461407c5-8aad-4e69-a20e-cb01b97a305&title=&width=1076)

内部某用户有这样的场景，期望在未来的某一分钟的 30s 时刻处理这样一个定时请求，开源版本的定时消息并不符合其需要，而秒级精准定时消息在保证高可用、高性能的同时，满足了其业务需求。

#### 分布式事务消息

如下图所示，在传统的事务处理中，多个系统之间的交互耦合到一个事务中，造成整体的相应时间长，回滚过程复杂，从而潜在影响了系统的可用性；而 RocketMQ 提供的分布式事务功能，在保证了系统松耦合和数据最终一致性的前提下，实现了分布式事务。

![7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489187513-573cf4e3-1dda-458c-9924-8e0313d3af28.png#clientId=ud2c97884-e439-4&height=1126&id=uxrAn&name=7.png&originHeight=1126&originWidth=1036&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1f59359b-ea28-45cc-b924-7bd1d77eef6&title=&width=1036)

消息队列 RocketMQ 提供的事务消息处理步骤如下：

- 发送方将半事务消息发送至消息队列 RocketMQ 版服务端。
- 消息队列 RocketMQ 版服务端将消息持久化成功之后，向发送方返回 Ack 确认消息已经发送成功，此时消息为半事务消息。
- 发送方开始执行本地事务逻辑。
- 发送方根据本地事务执行结果向服务端提交二次确认（Commit 或是 Rollback），服务端收到 Commit 状态则将半事务消息标记为可投递，订阅方最终将收到该消息；服务端收到 Rollback 状态则删除半事务消息，订阅方将不会接受该消息。

基于这样的实现，我们通过消息实现了分布式事务特性，即本地事务的执行结果会最终反应到订阅方是否能接收到该条消息。

![8.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489187527-c2d7d005-70cf-4459-80b2-810ce6a1bdef.png#clientId=ud2c97884-e439-4&height=604&id=qrJ0X&name=8.png&originHeight=604&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua5dc3332-2717-4a38-99f2-bf8f469008b&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489187481-28f267cb-92cf-49d0-8fd6-401de21ccfd7.gif#clientId=ud2c97884-e439-4&height=1&id=AH4yg&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8be9dd73-835a-49a7-87ca-7a027869d87&title=&width=1)
消息队列 RocketMQ 的分布式事务消息广泛地应用于阿里巴巴核心交易链路中，通过分布式事务消息，实现了最小事务单元；交易系统和消息队列之间，组成一个事务处理；下游系统（购物车、积分、其它）相互隔离，并行处理。

### 分级存储

#### 背景

随着云上客户的不断增多，存储逐渐成为 RocketMQ 运维的重要瓶颈，这包括并且不限于：

1. 内存大小有限，服务端不能将所有用户的数据全部缓存在内存中；在多租户场景下，当有用户拉取冷数据时，会对磁盘造成较大 IO 压力，从而影响共享集群的其他用户，亟需做到数据的冷热分离。
2. 云上有单租户定制化消息存储时长的需求。而 RocketMQ Broker 中所有用户的消息是放在一个连续文件中进行存储的，无法针对任何单一用户定制存储时长，即现有的存储结构无法满足这样的需求。
3. 如果能对海量数据提供更低成本的存储方式，可以大幅降低云上 RocketMQ 的磁盘存储成本。

基于以上现状，分级存储方案应运而生。

#### 架构

分级存储的整体架构如下：

1. connector 节点负责将 broker 上的消息实时同步到 OSS 上
2. historyNode 节点将用户对冷数据的拉取请求转发至 OSS 上
3. 在 OSS 中是按照 Queue 粒度来组织文件结构的，即每个 Queue 会由独立的文件进行存储，从而保证了我们可以针对于租户定义消息的存储时长。

![9.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489187715-af2c6885-bb01-4eda-82bf-ab80e8a94b94.png#clientId=ud2c97884-e439-4&height=662&id=tGH2x&name=9.png&originHeight=662&originWidth=746&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u79480cd4-42e3-400f-b428-c4252fac679&title=&width=746)

通过这样的设计，我们实现了消息数据的冷热分离。
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489187701-178bcfc3-2e61-419a-b854-4a3033e7e867.gif#clientId=ud2c97884-e439-4&height=1&id=t30sj&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf29db23e-1f2e-40bc-8fbe-dd620ed1c57&title=&width=1)
![10.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489188235-04da98a4-519f-4a31-9b56-3cc7d079ff97.png#clientId=ud2c97884-e439-4&height=441&id=g6Ew8&name=10.png&originHeight=441&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u68998531-7cf6-45f2-b8c6-f99dafb39ff&title=&width=1080)

#### 使用场景

基于分级存储，我们进一步拓展了用户的使用场景：

1. 自定义存储时间：在消息数据的冷热分离之后，我们将冷数据存储到 OSS 这样的存储系统中，能够实现用户自定义的存储时间。
2. 消息审计：在消息的存储之间从数天扩展到自定义后，消息的属性从一个临时性的中转数据变成了用户的数据资产，而消息系统也从数据中枢转变成了数据仓库；用户能够基于数据仓库实现更多样的审计、分析、处理功能。
3. 消息回放：在流计算场景中，消息回放是非常重要的一个场景；通过拓展消息的存储时间之后，流计算能够实现更加丰富的计算分析场景。

### 稳定性

消息队列 RocketMQ 的稳定性是我们一贯、持续、稳定投入的重要领域。在介绍我们在稳定性的最新工作之前，首先带大家回顾下 RocketMQ 高可用架构的演进路线。

#### 高可用架构演进路线

2012 年，RocketMQ 作为阿里巴巴全新一代的消息引擎问世，并随后开源至社区，第一代 RocketMQ 高可用架构也随之诞生。如下图所示，第一代高可用架构采取当时流行的 Master-Slave 主从架构，写流量经过 Master 节点同步至 Slave 节点，读流量也经过 Master 节点并将消费记录同步至 Slave 节点。当 Master 节点不可用时，整个副本组可读不可写。

![11.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489188312-4c3ed072-f998-4bdb-8492-9d3ef7e63afc.png#clientId=ud2c97884-e439-4&height=231&id=PLFuL&name=11.png&originHeight=231&originWidth=761&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4c7e8f9e-0f7b-45b9-879b-7bdd2ecf31a&title=&width=761)

2016 年，RocketMQ 云产品正式开始商业化，云时代单点故障频发，云产品需要完全面向失败而设计，因此 RocketMQ 推出了第二代多副本架构，依托于 Zookeeper 的分布式锁和通知机制，引入 Controller 组件负责 Broker 状态的监控以及主备状态机转换，在主不可用时，备自动切换为主。第二代架构是消息云产品规模化进程中的核心高可用架构，为云产品规模化立下了汗马功劳。

2018 年，RocketMQ 社区对 Paxos 和 Raft 引入分布式协议有极大的热情，RocketMQ 研发团队在开源社区推出了基于 Raft 协议的 Dledger 存储引擎，原生支持 Raft 多副本。

RocketMQ 高可用架构已经走过了三代，在集团、公有云和专有云多样场景的实践中，我们发现这三套高可用架构都存在一些弊端：

- 第一代主备架构只起到了冷备的作用，且主备切换需要人工介入，在大规模场景下有较大的资源浪费以及运维成本。
- 第二代架构引入了 Zookeeper 和 Controller 节点，架构上更加复杂，在主备切换做到了自动化，但故障转移时间较长，一般是 10 秒左右完成选主。
- 第三代 Raft 架构目前暂未在云上和阿里集团内大规模应用，且 Raft 协议就决定了需要选主，新主还需要被客户端路由发现，整个故障转移时间依然较长；另外，强一致的 Raft 版本并未支持灵活的降级策略，无法在可用性和可靠性之间做灵活的权衡。

为了应对云上日益增长的业务规模、更严苛的 SLA 要求、复杂多变的专有云部署环境，当前的消息系统需要一种架构简单、运维简单、有基于当前架构落地路径的方案，我们将其称作秒级 RTO 多副本架构。

#### 新一代秒级 RTO 多副本架构

秒级 RTO 多副本架构是消息中间件团队设计实现的新一代高可用架构，包含副本组成机制、Failover 机制、对现有组件的侵入性修改等。

整个副本组有以下特点：

- Strong Leader/No Election：Leader 在部署时确定，整个生命周期内不会发生切换，但可在故障时被替换。
- 仅 Leader 支持消息写入：每一个副本组仅 Leader 接受消息写入，Leader 不可用时，整个副本组不可写入。
- 所有的副本支持消息读取：虽然 Leader 上拥有全量的消息，Follower 上的消息量不对等，但所有的副本都支持消息的读取。
- 灵活的副本组数量：可以基于可靠性、可用性和成本自由选择副本组的数量。
- 灵活的 Quorum 数量：最终所有的消息都会同步到整个副本组上，但副本组内可以灵活配置写成功最小副本数。例如 2-3 模式，3 副本情况下，2 副本成功即为写成功。同时，在副本不可用的情况下，Quorum 数量也可以动态自行降级。

在上述副本组的概念下，故障转移可以复用当前 RocketMQ 客户端的机制来完成。如下图所示：
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489188294-93beebb9-e62a-44f7-9985-559fbc9d790d.gif#clientId=ud2c97884-e439-4&height=1&id=XhVyP&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0ef72eab-6374-4f70-80eb-532c1502bb0&title=&width=1)
![12.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489188398-da9d407b-154a-40a6-86f4-028cd0a609d4.png#clientId=ud2c97884-e439-4&height=341&id=X61Pg&name=12.png&originHeight=341&originWidth=705&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uda4fb940-3dc7-44e9-9160-a6136d2020a&title=&width=705)

- Producer 在主不可用时，灵活快速地切换至另一个副本组。
- Consumer 在某个副本不可用时可快速切换至同副本组另一个副本上进行消息消费。

### 可观测性

#### 健康大盘

我们在可观测性方面也做了大量的工作，为用户提供了一个消息系统的可观测性健康数据大盘。如下图所示，用户能够清晰的看到实例级别、topic 级别、group 级别的各种监控数据，能够全方面地监控、诊断问题。

![13.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489188509-84c2bb3f-d67d-4d4f-930b-19a318b1b77c.png#clientId=ud2c97884-e439-4&height=594&id=d8fGS&name=13.png&originHeight=594&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5075c9a1-80a3-4c30-bb23-ed498a2c70e&title=&width=1080)

#### 消息链路追踪

另外我们还基于消息轨迹提供了消息全链路轨迹追踪功能。如下图所示，用户能够在控制台上看到完整的消息生命周期、从消息的发送、存储、到消费，整个链路都能被完整地记录下来。

![14.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489188904-3f314ee2-c8a3-40ff-82a8-29c922091d0b.png#clientId=ud2c97884-e439-4&height=628&id=KSWgc&name=14.png&originHeight=628&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u3dbb1eea-fd82-4083-9c0f-045091dacee&title=&width=1080)

#### 应用场景

客户痛点：业务出现消费堆积的用户需要根据消息轨迹抽样数据，综合分析后才能大致判断引起问题原因，排查困难。

核心价值：提高线上运行问题排查的效率，和问题定位的准确性。直接在健康大盘上快速发现风险最高的 Topic 和 Group，并根据各个指标的变化情况快速定位原因。例如消息处理时间过长可以扩容消费者机器或优化消费业务逻辑，如果是失败率过高可以快速查看日志排除错误原因。

### 事件驱动

大家一定非常熟悉 Gartner，在2018年的一个评估报告里，Gartner 将 Event-Driven Model，列为了未来10大战略技术趋势之一，并且，做出了两个预测：

- 2022年，超过 60% 的新型数字化商业解决方案，都会采用事件通知的软件模型。
- 2022年，超过 50% 的商业组织，将会参与到EDA生态系统当中去。

同一年，CNCF 基金会也提出了 CloudEvents，意在规范不同云服务之间的事件通讯协议标准。到目前为止，CloudEvents也已经发布了多个消息中间件的绑定规范。

可见事件驱动是未来业务系统的一个重要趋势，而消息天然具备和事件的亲近性，因此消息队列 RocketMQ，是坚决拥抱事件驱动的。

谈到消息和事件，这里做一个简单的阐述：消息和事件是两种不同形态的抽象，也意味着满足不同的场景：

- 消息：消息是比事件更通用的抽象，常用于微服务调用之间的异步解耦，微服务调用之间往往需要等到服务能力不对等时才会去通过消息对服务调用进行异步化改造；消息的内容往往绑定了较强的业务属性，消息的发送方对消息处理逻辑是有明确的预期的。
- 事件：事件相对于消息更加具像化，代表了事情的发送、条件和状态的变化；事件源来自不同的组织和环境，所以事件总线天然需要跨组织；事件源对事件将被如何响应没有任何预期的，所以采用事件的应用架构是更彻底的解耦，采用事件的应用架构将更加具备可扩展性和灵活性。

在2020年，阿里云发布了事件总线 EventBridge 这一产品，其使命是作为云事件的枢纽，以标准化的 CloudEvents 1.0 协议连接云产品和云应用，提供中心化的事件治理和驱动能力，帮助用户轻松构建松耦合、分布式的事件驱动架构；另外，在阿里云之外的云市场上有海量垂直领域的 SaaS 服务，EventBridge 将以出色的跨产品、跨组织以及跨云的集成与被集成能力，助力客户打造一个完整的、事件驱动的、高效可控的上云新界面。

而借助事件总线 EventBridge 提供的事件源功能，我们能够打通消息到事件的链路，使得消息队列 RocketMQ 具备事件驱动的动力，从而拥抱整个事件生态。接下来我们将借助一个案例，如下图所示，为大家展示这一功能。

![15.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489188943-e2f140fb-5332-4596-be27-fff1c6619cde.png#clientId=ud2c97884-e439-4&height=312&id=JDweQ&name=15.png&originHeight=312&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u00d3c22b-4bdf-4834-b779-9876614eec8&title=&width=1080)

#### 创建消息队列 RocketMQ 主题

![16.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489189001-9b1466aa-5cb7-4470-8e1b-bc7c3cf2be30.png#clientId=ud2c97884-e439-4&height=449&id=hjZr3&name=16.png&originHeight=449&originWidth=781&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5b74a5f8-962b-4c61-9484-789ab3c5b97&title=&width=781)

#### 创建目标服务

我们基于容器服务快速创建一个事件驱动的服务，计算负载 Deployment 的 yaml 如下，该服务能够响应事件并将结果打印到标准输出中。


    apiVersion: apps/v1 # for versions before 1.8.0 use apps/v1beta1
    kind: Deployment
    metadata:
      name: eventbridge-http-target-deployment
      labels:
        app: eventbridge-http-target
    spec:
      replicas: 2
      selector:
        matchLabels:
          app: eventbridge-http-target
      template:
        metadata:
          labels:
            app: eventbridge-http-target
        spec:
          containers:
          - name: eb-http-target
            # 下述镜像暴露了一个 HTTP 地址(/cloudevents)用于接收 CloudEvents，源码参考：https://github.com/aliyuneventbridge/simple-http-target
            image: registry.cn-hangzhou.aliyuncs.com/eventbridge-public/simple-http-target:latest
            ports:
            - containerPort: 8080


前往容器服务控制台，进入服务与路由的服务页面，创建一个私网访问类型的 Service，并做好端口映射。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489188971-eda72710-f4f9-464d-9827-b00eb6606a0b.gif#clientId=ud2c97884-e439-4&height=1&id=q877Y&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf4f1208c-cdac-4d55-928b-171b1d85cd7&title=&width=1)

![17.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489189166-905cac56-5718-4ebb-a64b-4373ebb4b210.png#clientId=ud2c97884-e439-4&height=658&id=QBcGV&name=17.png&originHeight=658&originWidth=783&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2afa9d6b-75da-4838-aa9f-ed4287d9445&title=&width=783)

#### 创建事件总线 EventBridge 自定义总线

我们来到事件总线 EventBridge 控制台，创建一个自定义总线 demo-with-k8s。

![18.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489189638-1de96cbf-1ae5-4d41-949e-097099f0378b.png#clientId=ud2c97884-e439-4&height=200&id=hSC3M&name=18.png&originHeight=200&originWidth=782&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9a573d54-006e-4f0c-a936-79a013e290d&title=&width=782)

#### 创建事件总线 EventBridge 自定义总线规则

我们为总线 demo-with-k8s 创建一个规则，并选择 HTTP 作为事件目标，选择专有网络类型，选中对应的 VPC、 VSwitch 以及安全组，并指定目标URL，如下图所示：

![19.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489189590-a723ca4d-fb62-4dd5-aff7-8a12e558c81c.png#clientId=ud2c97884-e439-4&height=487&id=NuGFw&name=19.png&originHeight=487&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud00b3178-fbbc-4b67-b1ef-edf7eff9660&title=&width=1080)

#### **创建事件总线 EventBridge 事件源**

我们为该自定义事件总线添加消息队列 RocketMQ 版的自定义事件源。

![20.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489189589-e5f63e67-5520-4992-a7bf-11541eb8fb7f.png#clientId=ud2c97884-e439-4&height=1207&id=lcVfR&name=20.png&originHeight=1207&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u40d464da-c216-4f81-9498-5a2a9ac1325&title=&width=1080)

#### 发送 RocketMQ 消息

接下来我们回到消息队列 RocketMQ 控制台，通过控制台的快速体验消息生产功能发送一条内容为 hello eventbridge 的消息到对应的主题中去。

![21.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489189603-2c0eefcf-17b0-488b-abc4-c76e91137585.png#clientId=ud2c97884-e439-4&height=395&id=lPejf&name=21.png&originHeight=395&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u664ec143-7d91-4cd2-924e-06a7652b48f&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489189726-e2fa2125-ef24-4a1f-924c-5a8e42bc2c91.gif#clientId=ud2c97884-e439-4&height=1&id=tHa99&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u29888cad-002a-466b-9ac1-186f834861f&title=&width=1)
接下来我们就可以发现，这条 RocketMQ 消息，以 CloudEvent 的形式被投递到了对应的服务中去，我们从而打通了消息到事件的链路。同时，基于我们上述提到的分级存储功能，消息队列 RocketMQ 转变成了一个能够源源不断提供事件的数据仓库，为整个事件生态提供了更加广阔的场景。

事件驱动是未来商业组织和业务系统的重要趋势，而消息队列 RocketMQ 会坚定地拥抱这一趋势，将消息融入到事件的生态中。
# 总结
我们选取了消息队列 RocketMQ 的几个产品剖面，从多消息类型、分级存储到稳定性、可观测性，再到面向未来的事件驱动，并结合与开源 RocketMQ 的对比，及具体应用场景的分析，为大家展示了基于消息队列 RocketMQ 的大型分布式应用上云最佳实践。 

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)