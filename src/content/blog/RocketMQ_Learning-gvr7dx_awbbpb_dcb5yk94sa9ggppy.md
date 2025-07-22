---
title: "Apache RocketMQ 5.0 架构解析：如何基于云原生架构支撑多元化场景"
description: "Apache RocketMQ 5.0 架构解析：如何基于云原生架构支撑多元化场景"
date: "2025-07-22"
category: "article"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

<font style="color:rgba(0, 0, 0, 0.9);">本文将从技术角度了解 RocketMQ 的云原生架构，了解 RocketMQ 如何基于一套统一的架构支撑多元化的场景。</font>

<font style="color:rgba(0, 0, 0, 0.9);">文章主要包含三部分内容。首先介绍 RocketMQ 5.0 的核心概念和架构概览；然后从集群角度出发，从宏观视角学习 RocketMQ 的管控链路、数据链路、客户端和服务端如何交互；最后介绍消息队列最重要的模块存储系统，了解 RocketMQ 如何实现数据的存储和数据的高可用，以及如何利用云原生存储进一步提升竞争力。</font>

## <font style="color:#2F8EF4;">概览</font>
<font style="color:rgba(0, 0, 0, 0.9);">在介绍 RocketMQ 的架构之前，先从用户视角来看下 RocketMQ 的关键概念以及领域模型。如下图，这里按照消息的流转顺序来介绍。</font>

## ![](https://img.alicdn.com/imgextra/i2/O1CN01At3lox21TdzXchsne_!!6000000006986-2-tps-1080-554.png)
<font style="color:rgba(0, 0, 0, 0.9);">在 RocketMQ 中，消息生产者一般对应业务系统的上游应用，在某个业务动作触发后发送消息到 Broker。Broker 是消息系统数据链路的核心，负责接收消息、存储消息、维护消息状态、消费者状态。多个 broker 组成一个消息服务集群，共同服务一个或多个 Topic。</font>

<font style="color:rgba(0, 0, 0, 0.9);">生产者生产消息并发送到 Broker，消息是业务通信的载体，每个消息包含消息 ID、消息 Topic、消息体内容、消息属性、消息业务 key 等。每条消息都属于某个 Topic，表示同一个业务的语义。</font>

<font style="color:rgba(0, 0, 0, 0.9);">在阿里内部，交易消息的 Topic 被称为 Trade，购物车消息称为 Cart，生产者应用会将消息发送到对应的 Topic 上。Topic 里还有 MessageQueue，用于消息服务的负载均衡与数据存储分片，每个 Topic 包含一个或多个 MessageQueue，分布在不同的消息 Broker。</font>

<font style="color:rgba(0, 0, 0, 0.9);">生产者发送消息，Broker 存储消息，消费者负责消费消息。消费者一般对应业务系统的下游应用，同一个消费者应用集群共用一个 Consumer Group。消费者会与某个 Topic 产生订阅关系，订阅关系是 Consumer Group+Topic +过滤表达式的三元组，符合订阅关系的消息会被对应的消费者集群消费。</font>

<font style="color:rgba(0, 0, 0, 0.9);">接下来就从技术实现角度进一步深入了解 RocketMQ。</font>

## <font style="color:rgb(255, 255, 255);"></font><font style="color:#2F8EF4;">架构概览</font>
<font style="color:rgba(0, 0, 0, 0.9);">下图是一张 RocketMQ 5.0 的架构图，RocketMQ 5.0 的架构从上往下可分为 SDK、NameServer、Proxy 与 Store 层。</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01SUD5W522T143WOOS4_!!6000000007120-2-tps-1080-546.png)

<font style="color:rgba(0, 0, 0, 0.9);">SDK 层包括 RocketMQ 的 SDK，用户基于 RocketMQ 自身的领域模型来使用 SDK。除了 RocketMQ 自身的 SDK 之外，还包括细分领域场景的业界标准 SDK，比如面向事件驱动的场景，RocketMQ 5.0 支持 CloudEvents 的 SDK；面向 IoT 的场景，RocketMQ 支持物联网 MQTT 协议的 SDK；为了方便更多传统应用迁移到 RocketMQ，还支持了 AMQP 协议，未来也会开源到社区版本里。</font>

<font style="color:rgba(0, 0, 0, 0.9);">Nameserver 承担服务发现与负载均衡的职责。通过 NameServer，客户端能获取 Topic 的数据分片与服务地址，链接消息服务器进行消息收发。</font>

<font style="color:rgba(0, 0, 0, 0.9);">消息服务包含计算层 Proxy 与存储层 RocketMQ Store。RocketMQ 5.0 是存算分离的架构，这里的存算分离强调的主要是模块和职责的分离。Proxy 与 RocketMQ Store 面向不同的业务场景可以合并部署，也可以分开部署。</font>

<font style="color:rgba(0, 0, 0, 0.9);">计算层 Proxy 主要承载消息的上层业务逻辑，尤其是面向多场景、多协议的支持，比如承载 CloudEvents、MQTT、AMQP 的领域模型的实现逻辑与协议转换。面向不同的业务负载，还可将 Proxy 分离部署，独立弹性，比如在物联网场景，Proxy 层独立部署可以面向海量物联网设备连接数进行弹性伸缩，与存储流量扩缩容解耦。</font>

<font style="color:rgba(0, 0, 0, 0.9);">RocketMQ Store 层则负责核心的消息存储，包括基于 Commitlog 的存储引擎、多元索引、多副本技术与云存储集成扩展。消息系统的状态全部下沉到 RocketMQ Store，其组件全部实现无状态化。</font>

## <font style="color:#2F8EF4;">服务发现</font>
<font style="color:rgba(0, 0, 0, 0.9);">下面详细看一下 RocketMQ 的服务发现，如下图所示。RocketMQ 的服务发现的核心是 NameServer，下图是 Proxy 与 Broker 合并部署的模式，也是 RocketMQ 最常见的模式。</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01OZWjhx25fmxMgAsoP_!!6000000007554-2-tps-1080-608.png)

<font style="color:rgba(0, 0, 0, 0.9);">每个 Broker 集群会负责某些 Topic 的服务，每个 broker 都会将自身服务的 topic 信息注册到 NameServer（下面简称 NS）集群，与每个 NameServer 进行通信，并定时与 NS 通过心跳机制来维持租约。服务注册的数据结构包含 topic 与 topic 分片。示例中 broker1 与 broker2 分别承载 topicA 的一个分片。在 NS 机器上会维护全局视图，topicA 有两个分片分别在 broker1 与 broker2。</font>

<font style="color:rgba(0, 0, 0, 0.9);">RocketMQ SDK 在对 TopicA 进行正式的消息收发之前，会随机访问 NameServer 机器，从而获取到 topicA 有哪些分片，每个数据的分片在哪个 broker 上，与 broker 建立好长连接，然后再进行消息的收发。</font>

<font style="color:rgba(0, 0, 0, 0.9);">大部分项目的服务发现机制会通过 zookeeper 或 etcd 等强一致的分布式协调组件来担任注册中心的角色，而 RocketMQ 有自己的特点，如果从 CAP 的角度来看，注册中心采用 AP 模式，NameServer 节点无状态，是 shared-nothing 的架构，有更高的可用性。</font>

<font style="color:rgba(0, 0, 0, 0.9);">如下图，RocketMQ 的存算分离可分可合，采用分离的部署模式，RocketMQ SDK 直接访问无状态的 Proxy 集群。该模式可以应对更复杂的网络环境，支持多网络类型的访问如公网访问，实现更好的安全控制。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01vxQvwW1sSQOYdRGLq_!!6000000005765-2-tps-1080-526.png)

<font style="color:rgba(0, 0, 0, 0.9);">在整个服务发现机制中，NameServer、Proxy 都为无状态，可以随时进行节点增减。有状态节点 Broker 的增减基于 NS 的注册机制，客户端可以实时感知、动态发现。在缩容过程中，RocketMQ Broker 还可以进行服务发现的读写权限控制，对缩容的节点禁写开读，待未读消息全消费后，再实现无损平滑下线。</font>

## <font style="color:#2F8EF4;">负载均衡</font>
<font style="color:rgba(0, 0, 0, 0.9);">通过上文的介绍了解了 SDK 是如何通过 NameServer 来发现 Topic 的分片信息 MessageQueue，以及 Broker 地址的，基于这些服务发现的元数据，下面再来详细介绍下消息流量是如何在生产者、RocketMQ Broker 和消费者集群进行负载均衡的。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01xF6uj21bSZ31fqiwx_!!6000000003464-2-tps-1080-526.png)

<font style="color:rgba(0, 0, 0, 0.9);">生产链路的负载均衡如下图如所示：生产者通过服务发现机制获取到 Topic 的数据分片以及对应的 Broker 地址。服务发现机制是比较简单，在默认情况下采用 RoundRobin 的方式轮询发送到各个 Topic 队列，保证 Broker 集群的流量均衡。在顺序消息的场景下会略有不同，基于消息的业务主键 Hash 到某个队列发送，如果有热点业务主键，Broker 集群也可能出现热点。除此之外，基于元数据还能根据业务需要扩展更多的负载均衡算法，比如同机房优先算法，可以降低多机房部署场景下的延迟，提升性能。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01KGJX9x1HIgBUpJXXX_!!6000000000735-2-tps-1080-552.png)

<font style="color:rgba(0, 0, 0, 0.9);">消费者的负载均衡：拥有两种类型的负载均衡方式，包括队列级负载均衡和消息粒度的负载均衡。</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01ZeQbVA26rz7N8DFW5_!!6000000007716-2-tps-1080-564.png)

<font style="color:rgba(0, 0, 0, 0.9);">最经典的模式是队列级负载均衡，消费者知道 Topic 的队列总数和同一个 Consumer Group 下的实例数，可以按照统一的分配算法，类似于一致性 hash 的方式，使每个消费者实例绑定对应队列，只消费绑定队列的消息，每个队列的消息也只会被消费者实例消费。该模式最大的缺点是负载不均衡，消费者实例要绑定队列且有临时状态。如果有三个队列，有两个消费者实例，则必然有消费者需要消费 2/3 的数据，如果有 4 个消费者，则第四个消费者会空跑。因此，RocketMQ 5.0 引入了消息粒度的负载均衡机制，无需绑定队列，消息在消费者集群随机分发，保障消费者集群的负载均衡。更重要的是，该模式更加符合未来 Serverless 化的趋势，Broker 的机器数、Topic 的队列数与消费者实例数完全解耦，可以独立扩缩容。</font>

## <font style="color:#2F8EF4;">存储系统</font>
<font style="color:rgba(0, 0, 0, 0.9);">前面通过架构概览和服务发现机制，已经对 RocketMQ 有比较全局性的了解，接下来将深入 RocketMQ 的存储系统。存储系统对 RocketMQ 的性能、成本、可用性有决定性作用。</font>

<font style="color:rgba(0, 0, 0, 0.9);">RocketMQ 的存储核心由 commitlog、ConsumeQueue 与 index 文件组成。</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01ta6OCu1wFNZp07q2G_!!6000000006278-2-tps-1080-571.png)

<font style="color:rgba(0, 0, 0, 0.9);">消息存储首先写到 commitlog，刷盘并复制到 slave 节点完成持久化，commitlog 是 RocketMQ 存储的 source of true，可以通过它构建完整的消息索引。</font>

<font style="color:rgba(0, 0, 0, 0.9);">相比于 Kafka，RocketMQ 将所有 topic 的数据都写到 commitlog 文件，最大化顺序 IO，使得 RocketMQ 单机可支撑万级的 topic。</font>

<font style="color:rgba(0, 0, 0, 0.9);">写完 commitlog 之后，RocketMQ 会异步分发出多个索引，首先是 ConsumeQueue 索引，与 MessageQueue 对应，基于索引可以实现消息的精准定位，可以按照 topic、队列 ID 与位点定位到消息，消息回溯功能也是基于该能力实现的。</font>

<font style="color:rgba(0, 0, 0, 0.9);">另外一个很重要的索引是哈希索引，它是消息可观测的基础。通过持久化的 hash 表来实现消息业务主键的查询能力，消息轨迹主要基于该能力实现。</font>

<font style="color:rgba(0, 0, 0, 0.9);">除了消息本身的存储之外，broker 还承载了消息元数据的存储以及 topic 的文件，包括 broker 会对哪些 topic 提供服务，还维护了每个 topic 的队列数、读写权限、顺序性等属性，subscription、consumer offset 文件维护了 topic 的订阅关系以及每个消费者的消费进度，abort、checkpoint 文件则用于完成重启后的文件恢复，保障数据完整性。</font>

## <font style="color:#2F8EF4;">Topic 高可用</font>
<font style="color:rgba(0, 0, 0, 0.9);">前面站在单机的视角，从功能的层面学习 RocketMQ 的存储引擎，包括 commitlog 和索引。现在重新跳出来再从集群视角看 RocketMQ 的高可用。</font>

![](https://img.alicdn.com/imgextra/i2/O1CN01xUcnhZ1SjCtkX2dS8_!!6000000002282-2-tps-1080-569.png)

<font style="color:rgba(0, 0, 0, 0.9);">RocketMQ 的高可用指当 RocketMQ 集群出现 NameServer、Broker 局部不可用时，指定的 topic 依然可读可写。</font>

<font style="color:rgba(0, 0, 0, 0.9);">RocketMQ 可以应对三类故障场景。</font>

#### <font style="color:#2F8EF4;">场景 1：某对 Broker 的单机不可用</font>
<font style="color:rgba(0, 0, 0, 0.9);">比如，当 Broker2 主节点宕机，备节点可用，TopicA 依然可读可写，其中分片 1 可读可写，分片 2 可读不可写，TopicA 在分片 2 的未读消息依然可以消费。总结来说，即只要 Broker 集群里任意一组 Broker 存活一个节点，则 Topic 的读写可用性不受影响。如果某组 Broker 主备全部宕机，则 Topic 新数据的读写也不受影响，未读消息会延迟，待任意主备启动才能继续消费。</font>

![](https://img.alicdn.com/imgextra/i3/O1CN0150yq4g1o9rsvroeQW_!!6000000005183-2-tps-1080-549.png)

#### <font style="color:#2F8EF4;">场景 2：NameServer 集群部分不可用</font>
<font style="color:rgba(0, 0, 0, 0.9);">由于 NameServer 是 shared-nothing 架构，每个节点都为无状态，并且为 AP 模式，无需依赖多数派算法，因此只要有一台 NameServer 存活，则整个服务发现机制都正常，Topic 的读写可用性不受影响。</font>

![](https://img.alicdn.com/imgextra/i2/O1CN01YEhftp1WZMqtjek6q_!!6000000002802-2-tps-1080-545.png)

#### <font style="color:#2F8EF4;">场景 3：NameServer 全部不可用</font>
![](https://intranetproxy.alipay.com/skylark/lark/0/2025/webp/59356401/1753150113892-e52a2a61-ce4d-4c74-9e42-a59bddf3c2ab.webp)

<font style="color:rgba(0, 0, 0, 0.9);">由于 RocketMQ 的 SDK 对服务发现元数据有缓存，只要 SDK 不重启，依然可以按照当下的 topic 元数据继续进行消息收发。</font>

## <font style="color:#2F8EF4;">MessageQueue 的高可用基础概念</font>
<font style="color:rgba(0, 0, 0, 0.9);">上一个小节中讲到 Topic 的高可用原理，从它的实现中可以发现虽然 Topic 持续可读可写，但是 Topic 的读写队列数发生变化。队列数变化，会对某些数据集成的业务有影响，比如说异构数据库 Binlog 同步，同一个记录的变更 binlog 会写入不同的队列，重放 binlog 可能会出现乱序，导致脏数据。所以还需要对现有的高可用进一步增强，要保障在局部节点不可用时，不仅 Topic 可读可写，并且 Topic 的可读写队列数量不变，指定的队列也是可读可写的。</font>

<font style="color:rgba(0, 0, 0, 0.9);">如下图，NameServer 或 Broker 任意出现单点不可用，Topic A 依然保持 2 个队列，每个队列都具备读写能力。</font>

![](https://img.alicdn.com/imgextra/i2/O1CN01DMpoaN1NuafBbZlaX_!!6000000001630-2-tps-1080-586.png)

<font style="color:#2F8EF4;">5.0 HA 的特点</font>

<font style="color:rgba(0, 0, 0, 0.9);">为了解决上述的场景，RocketMQ 5.0 引入全新的高可用机制，核心概念如下：</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">DLedger Controller：基于 raft 协议的强一致元数据组件，执行选主命令，维护状态机信息。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">SynStateSet：维护处于同步状态的副本组集合，集合里的节点都有完整的数据，主节点宕机后，从集合中选择新的主节点。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">Replication：用于不同副本之间的数据复制、数据校验、截断对齐等事项。</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01mEWkSK1MTHQjuCqhL_!!6000000001435-2-tps-1080-572.png)

<font style="color:rgba(0, 0, 0, 0.9);">下面是 5.0 HA 的架构全景图，新的高可用架构具备多个优势。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01zkLuWi1TwmFVdyzk5_!!6000000002447-2-tps-1080-567.png)

+ <font style="color:rgba(0, 0, 0, 0.9);">在消息存储引入了朝代与开始位点的数据，基于这两个数据完成数据校验、截断对齐，在构建副本组的过程中简化数据一致性逻辑。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">基于 DledgerController，无需引入 zk、etcd 等外部分布式一致性系统，并且 DledgerController 还可与 NameServer 合并部署，简化运维、节约机器资源。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">RocketMQ 对 DledgerController 是弱依赖，即便 Dledger 整体不可用，也只会影响选主，不影响正常的消息收发流程。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">可定制，用户可以根据业务对数据可靠性、性能、成本综合选择，比如副本数可以是 2、3、4，副本直接可以是同步复制或异步复制。如 2-2 模式表示 2 副本并且两个副本的数据同步复制；2-3 模式表示 3 副本，只要有 2 个副本写成功即认为消息持久化成功。用户还可以将其中的副本部署在异地机房，异步复制实现容灾。如下图：</font>

![](https://img.alicdn.com/imgextra/i3/O1CN01Q9tcj51PJbupTGXeM_!!6000000001820-2-tps-1080-574.png)

## <font style="color:#2F8EF4;">云原生存储-对象存储</font>
<font style="color:rgba(0, 0, 0, 0.9);">上文讲到的存储系统都是 RMQ 面向本地文件系统的实现，在云原生时代，将 RocketMQ 部署到云环境可以进一步利用云原生基础设施，比如云存储来进一步增强 RocketMQ 的存储能力。RocketMQ 5.0 提供了多级存储的特性，是内核级的存储扩展，面向对象存储扩展了对应的 Commitlog、ConsumeQueue 与 IndexFile。且采用了插件化的设计，多级存储可以有多种实现，在阿里云上基于 OSS 对象服务实现，在 AWS 上则可以面向 S3 的接口来实现。</font>

<font style="color:rgba(0, 0, 0, 0.9);">通过引入了云原生的存储，RocketMQ 释放了很多红利。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01pYLjvB1L4GB65mOFr_!!6000000001245-2-tps-1080-582.png)

<font style="color:rgba(0, 0, 0, 0.9);">第一个是无限存储能力，消息存储空间不受本地磁盘空间的限制，原来是保存几天，现在可以几个月、甚至存一年。另外对象存储也是业界成本最低的存储系统，特别适合冷数据存储。</font>

<font style="color:rgba(0, 0, 0, 0.9);">第二个是 Topic 的 TTL，原来多个 Topic 的生命周期是和 Commitlog 绑定，统一的保留时间。现在每个 Topic 都会使用独立的对象存储 Commitlog 文件，可以有独立的 TTL。</font>

<font style="color:rgba(0, 0, 0, 0.9);">第三个是存储系统进一步的存算分离，能把存储吞吐量的弹性和存储空间的弹性分离。</font>

<font style="color:rgba(0, 0, 0, 0.9);">第四个是冷热数据隔离，分离了冷热数据的读链路，能大幅度提升冷读性能，不会影响在线业务。</font>

## <font style="color:#2F8EF4;">总结</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">RocketMQ 整体架构：</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01lg2tAO1JqgpKrwZrL_!!6000000001080-2-tps-1080-298.png)

+ <font style="color:rgba(0, 0, 0, 0.9);">RocketMQ 负载均衡：AP 优先、分合模式、横向扩展、负载粒度；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">RocketMQ 存储设计：存储引擎、高可用、云存储。</font>


