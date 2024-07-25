---
title: "Apache RocketMQ，构建云原生统一消息引擎"
description: "Apache RocketMQ，构建云原生统一消息引擎"
date: "2024-07-24"
tags: ["recommend"]
authors: "隆基"
img: "https://img.alicdn.com/imgextra/i2/O1CN01b7uXIi1bmFycwldBc_!!6000000003507-2-tps-498-220.png"
---

> 演讲嘉宾：林清山（花名：隆基），Apache RocketMQ 联合创始人，阿里云资深技术专家，阿里云消息产品线负责人。国际消息领域专家，致力于消息、实时计算、事件驱动等方向的研究与探索，推进 RocketMQ 云原生架构、超融合架构的演进。
> ![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/57656509/1721807800793-04988698-3373-4921-9165-0e59be85c526.png#clientId=u8d714979-f8fa-4&from=paste&height=360&id=u6e321ff6&originHeight=720&originWidth=1080&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1080968&status=done&style=none&taskId=u7bbc30f5-7739-4bfd-b385-94006dc944b&title=&width=540)
> 本文整理于 2023 年云栖大会林清山带来的主题演讲《Apache RocketMQ 云原生统一消息引擎》

<a name="FGRog"></a>
## Apache RocketMQ 简介
<a name="i3MHJ"></a>
### 消息队列演进趋势
操作系统、数据库、中间件是基础软件的三驾马车，而消息队列属于最经典的中间件之一，已经有 30 多年的历史。它的发展主要经历了以下几个阶段：

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721807775412-72075bb4-9ba5-4182-9ada-d4ea6f7225de.webp#clientId=u8d714979-f8fa-4&from=paste&id=u7f254272&originHeight=521&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u410c8b42-b4e1-4921-a8a6-b1999bb72ef&title=)

第一个阶段，2000 年之前。80 年代诞生了第一款消息队列是 The Information Bus，第一次提出发布订阅模式来解决软件之间的通信问题；到了 90 年代，则是国际商业软件巨头的时代，IBM、Oracle、Microsoft 纷纷推出了自己的 MQ，其中最具代表性的是 IBM MQ，价格昂贵，面向高端企业，主要是大型金融、电信等企业；这类商业 MQ 一般采用高端硬件，软硬件一体机交付，MQ 本身的软件架构是单机架构。

第二阶段，2000-2007 年。进入 00 年代后，初代开源消息队列崛起，诞生了 JMS、AMQP 两大标准，与之对应的两个实现分别为 ActiveMQ、RabbitMQ，他们引领了初期的开源消息队列技术。开源极大的促进了消息队列的流行、降低了使用门槛，技术普惠化，逐渐成为了企业级架构的标配。相比于今天而言，这类 MQ 主要还是面向传统企业级应用，面向小流量场景，横向扩展能力比较弱。

第三阶段，2007-2017 年。PC 互联网、移动互联网爆发式发展。由于传统的消息队列无法承受亿级用户的访问流量和海量数据传输，诞生了互联网消息中间件，核心能力是全面采用分布式架构、具备很强的横向扩展能力，开源典型代表有 Kafka、RocketMQ，闭源的还有淘宝 Notify。Kafka 的诞生还将消息中间件从消息领域延伸到了流领域，从分布式应用的异步解耦场景延伸到大数据领域的流存储和流计算场景。

第四阶段，2014-至今。云计算、IoT、大数据引领了新的浪潮。
<a name="NAuHq"></a>
### Apache RocketMQ 发展历程  
伴随着消息队列行业的发展，Apache RocketMQ 自身也发展了十年，可分为“诞生于互联网”与“成长于云计算”两大阶段。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721807775341-a55ac242-0755-41b0-9dc6-307866d903f7.webp#clientId=u8d714979-f8fa-4&from=paste&id=ub01f03fe&originHeight=424&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u6ce60dd4-4855-4b09-9e33-3f0eb794126&title=)

第一个阶段是 RocketMQ 的从 0 到 1，在阿里内部规模化落地。2012 年，为了支撑超大规模电商互联网架构，阿里中间件研发了 RocketMQ，并在产品诞生初期开源，2017 年 RocketMQ 统一了阿里消息技术体系。

第二个阶段是云计算 , 2016 年 RocketMQ 上云，这也是业界首个提供公共云 SaaS 形态的开源消息队列。2016 年，阿里把 RocketMQ 捐赠给 Apache，17 年孵化毕业，成为国内首个 TLP 的互联网中间件。在云计算和开源双轮驱动下，RocketMQ 在阿里外部完成全面规模化，帮助千行百业完成数字化转型，产品能力也得到进一步的飞跃。2022 年 5.0 正式发布，Apache RocketMQ 正式迈进云原生时代。
<a name="p3oVf"></a>
## Apache RocketMQ 5.x 统一消息引擎
<a name="ZeIBb"></a>
### Apache RocketMQ 5.X 业务全景    
为了满足云时代多样化的用户需求，RocketMQ 5.0 从原来的互联网业务消息中间件，扩展到"消息、事件、流"超融合处理平台，解锁更全面的能力。    

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721807775366-5af52f5d-fa43-459c-9a4d-ec1f30c4fa99.webp#clientId=u8d714979-f8fa-4&from=paste&id=ua9c55c78&originHeight=545&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u5b060372-c98b-451c-bec7-ee43b8bfb30&title=)

- 在消息领域，全面拥抱云原生技术，更好的弹性架构和高可用能力。
- 在事件领域，支持 CloudEvent 规范，以事件为中心的产品新界面，助力客户建设跨业务、跨组织的数字化商业生态。
- 在流领域，流存储增强批量特性，大幅度提高数据吞吐量；新增逻辑队列能力，解耦逻辑资源和物理资源，在流场景也具备无缝伸缩能力；新增流数据库 RSQLDB，提供实时事件流处理、流分析能力。
- RocketMQ 基于端云一体化架构实现了完整的物联网消息队列的能力，从原来的连接应用扩展到连接物联网设备。同时 RocketMQ 5.0 也继续保持极简架构的原则，能够以最低的资源消耗、运维成本搭建服务，适合边缘计算。

为什么说 Apache RocketMQ 是统一的消息引擎，主要有以下几方面的统一。
<a name="t9FHI"></a>
### 消息和流的统一  
![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721807778582-3fbc7c0c-b22e-4ba1-ae67-0a8e0f5a9e47.webp#clientId=u8d714979-f8fa-4&from=paste&id=uec15f356&originHeight=553&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ud0e6aa17-7306-46ad-9730-5b4ebe663c0&title=)

第一个统一是 Apache RocketMQ 统一了消息和流的场景。

通过这个对比图来看，消息和流的区别。常说的消息场景、队列场景侧重于业务集成，在这个场景里 RocketMQ 的主要作用是连接业务应用，解耦业务架构的上下游系统，比如交易系统的解耦。这类场景，更多的是在线业务，由用户触发某个业务流程，比如购买。为了保障用户体验，消息系统要优先保障低延迟。这个场景里和同步通信 RPC 对应，消息系统承担都是异步通信职责。在消息消费层面，更多的是基于消息数据执行对应的业务逻辑，触发下一个业务流程。每条消息的处理都是不相关的，无状态的。侧重于业务数字化场景，可类比于数据库的 OLTP，单次操作数据量少，用于在线交易。

再来看流场景的话，它主要是侧重于数据集成，连接各种数据组件，进行数据分发，解耦数据架构的上下游系统。比如日志解决方案，采集日志数据，进行ETL将日志数据分发到搜索引擎、流计算、数据仓库等。除了日志之外，数据库 Binlog 分发、页面点击流也是常见的数据源。在这种场景里里面，由于是离线业务，它对低延迟的需求较弱，更加侧重于大批量吞吐型负载。另外在消息消费阶段，不再是单条消息处理，更多的是批量转储，或者批量进行流计算。侧重于数字业务化场景，可类比于数据库的 OLAP，单次操作数据量大，用于离线分析场景。    

具体来说，RocketMQ 如何实现消息和流的统一呢？

主要体现在领域模型的 统一，包含 Producer、Consumer、Topic、Topic 逻辑分区 MessageQueue。在统一的领域模型下采用不同的访问模式来满足消息和流的不同场景。

在消息场景，客户端只感知 Topic，往 Topic 发送消息，基于订阅关系消费Topic的消息，触发对应的业务逻辑，返回消费成功或者失败，消费失败还会有重试。

而在流的场景，对于消息数据的访问模式有所不同。由于是用在数据集成的场景，对于大规模的数据集成，不可避免的要涉及到数据的分片，基于数据分片来连接上下游数据系统。在消息的读写方式上，不再是指定 Topic 读写，而是指定 Topic 分片，也就是队列进行读写操作。作为流存储系统，下游的消费通常会是一些流计算引擎，用于有状态计算。为了支撑流计算引擎的容错处理，它需要支持 checkpoint 机制，类似于为流计算引擎提供 redolog，能够按照队列位点重放消息，重新恢复流计算的状态。他也会要求分片内有序，同一个 key 的数据会 hash 到同一个分片，用于实现 keyby 的操作。

这个就是流存储访问模式跟消息访问模式的区别。在消息场景里，用户只需要关注到 topic 资源，无需了解队列、位点等概念。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721807775355-8c15c24d-96a4-4543-841a-0a0e394808d8.webp#clientId=u8d714979-f8fa-4&from=paste&id=u7a59900c&originHeight=545&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u5508e5ce-c104-4292-89e7-1f45e6f002c&title=)

在流场景里面，还有一个很重要的变化，就是数据类型的变化。

做个简单对比，业务集成场景，消息的数据承载的是业务事件，比如说订单操作、物流操作，它特点就是数据规模较小，但是它每一条数据的价值都特别高，它的访问模式是偏向于在线的，单条事务的短平快访问模式。

而在流的场景里面呢，它更多的是一些非交易型的数据。比如说用户日志，系统的监控、IoT 的一些传感器数据、网站的点击流等等。他的特点是数据规模有数量级的提升，但单条数据的价值比较低的，然后它的访问模式偏向于离线批量传输。所以在流的场景里面，RocketMQ 存储要面向高吞吐做更多的优化。

在 RocketMQ 5.0 里面， 引入了端到端的批量消息。从客户端开始，在发送阶段，消息在客户端攒批到一定数量，直接 1 个 RPC 请求里面直接发到 broker 端。broker 存储阶段，直接把整批消息存储，用批量索引的技术，一批消息只会构建一个索引，大幅度提升索引构建速度。在消费阶段，也是按照整批数据读取到消费端，先进行解包操作，最后执行消费逻辑。这样整个 Broker 的消息 TPS 可以从原来的 10 万级提升至百万级。    
<a name="gBo1j"></a>
### 端和云的统一    
第二个统一是端和云的统一，端指物联网设备端、移动端，云指云端服务和应用。

我们先来了解一下物联网的场景是什么，以及消息在物联网里面有什么作用。<br />物联网肯定是最近几年最火的技术趋势之一，有大量的研究机构、行业报告都提出了物联网快速发展的态势。

- 物联网设备规模爆发式增长，会在 2025 年达到 200 多亿台。
- 物联网的数据规模，来自物联网的数据增速接近 28%，并且未来有 90% 以上的实时数据来自物联网场景。这也就意味着未来的实时流数据处理数据类型会有大量物联网数据。
- 重要的趋势是边缘计算，未来会有 75% 的数据在传统数据中心或者云环境之外来处理，这里的边缘指的是商店、工厂、火车等等这些离数据源更近的地方。

通过这个图能看出消息在物联网场景发挥的作用：

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721807776161-42124a72-9671-4d72-94fc-282c7cd8db1b.webp#clientId=u8d714979-f8fa-4&from=paste&id=u54ef1aa5&originHeight=558&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u7c3ad442-f8cd-467a-bddd-fcd2dc32fbc&title=)

- 第一个作用是连接，承担通信的职责，支持设备和设备的通信，设备和云端应用的通信，比如传感器数据上报、云端指令下发等等这些功能，支撑 IoT 的应用架构，连接云边端。
- 第二个作用是数据处理，物联网设备源源不断的产生数据流，有大量需要实时流处理的场景，比如设备维护，高温预警等等。基于 MQ 的事件流存储和流计算能力，可以构建物联网场景的数据架构。

在一个完整的物联网解决方案中，会同时涉及到端和云的协同，端用于采集数据、执行设备指令，云用于存储数据、分析数据，执行复杂业务逻辑。所以在 RocketMQ 5.0 里发布了 MQTT 子产品，实现端云一体化。它有三个核心特点：

1. 采用标准的物联网协议 MQTT，该协议面向物联网弱网环境、低算力的特点设计，协议十分精简。同时有很丰富的特性，支持多种订阅模式，多种消息的 QoS，比如有最多一次，最少一次，当且仅当一次。它的领域模型设计也是 消息、 主题、发布订阅等等这些概念，和 RocketMQ 特别匹配，这为打造一个云端一体的 RocketMQ 产品形态奠定了基础。
2. 采用端云一体化的架构，因为领域模型接近、并且以 RocketMQ 作为存储层，每条消息只存一份，这份消息既能被物联网设备消费，也能被云端应用消费。另外 RocketMQ 本身是天然的流存储，流计算引擎可以无缝对 IoT 数据进行实时分析。消息可以来自各个接入场景（如服务端的 RocketMQ，设备端的 MQTT），但只会写一份存到 commitlog 里面，然后分发出多个需求场景的队列索引，比如服务端场景（RocketMQ）可以按照一级 Topic 队列进行传统的服务端消费，设备端场景可以按照 MQTT 多级 Topic 以及通配符订阅进行消费消息。这样就可以基于同一套存储引擎，同时支持服务端应用集成和 IoT 场景的消息收发，达到端云一体化。
3. 将原来 RocketMQ 的万级队列能力提升到百万级队列能力。例如 Kafka 这样的消息队列每个Topic 是独立文件，但是随着 Topic 增多消息文件数量也增多，顺序写就退化成了随机写，性能明显下降。RocketMQ 在 Kafka 的基础上进行了改进，使用了一个 Commitlog 文件来保存所有的消息内容，再使用 CQ 索引文件来表示每个 Topic 里面的消息队列，因为 CQ 索引数据比较小，文件增多对 IO 影响要小很多，所以在队列数量上可以达到十万级。但是这个终端设备队列的场景下，十万级的队列数量还是太小了， 希望进一步提升一个数量级，达到百万级队列数量，所以， 引入了 Rocksdb 引擎来进行 CQ 索引分发，实现了百万级队列。    

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721807775999-591f8167-0408-4b0b-a50d-48b9720b4a1a.webp#clientId=u8d714979-f8fa-4&from=paste&id=u0d1688ee&originHeight=554&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ubbb9d352-3fd8-4e9f-b825-8c6650f645c&title=)
<a name="GYDIT"></a>
### 消息和事件的统一
第三个统一是消息和事件的统一。

在这之前， 我们先了解一下什么是事件驱动。事件驱动本质上是一种软件设计模式，它能够最大化降低不同模块以及不同系统之间的耦合度。

下面是一个典型的事件驱动架构图，首先是事件生产者发送事件到 EventBroker，然后 EventBroker 会把事件路由到对应的消费者进行事件处理。事件处理能够灵活扩展，随时增减事件消费者，事件生产者对此透明。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721807775981-95c81d23-f0b0-4b52-b0ec-7c07193ea700.webp#clientId=u8d714979-f8fa-4&from=paste&id=uac0c9820&originHeight=463&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ub44335ed-eb0e-4b36-b3c7-b127a6df0b0&title=)

事件驱动架构其实是个很经典的设计模式，因为早在几十年前，就出现过多种事件驱动的技术。比如桌面客户端编程框架，点击按钮就可以触发 onclick 事件，开发者编写业务逻辑响应事件；在编程语言上，也经常会采用事件驱动的代码模式，比如 callback、handler 这类的函数；进入分布式系统的时代，系统之间的通信协同也会采用事件驱动的方式。

从这个图我们可以发现事件驱动架构其实和基于消息的应用解耦差别不大，他们本质上要解决的都是解耦的问题。无论是消息的发布订阅，还是事件的生产消费都是为了进行代码解耦、系统解耦。消息队列更偏技术实现，大部分的 EventBroker 都是基于消息队列实现的，而事件驱动更偏向于架构理念。

事件驱动跟消息驱动最大的区别就是，事件是一种特殊的消息，只有消息满足了某些特征，才能把它叫做事件。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721807778587-4300635e-dc9c-4504-9c72-77622cb9e182.webp#clientId=u8d714979-f8fa-4&from=paste&id=u8f22dfd0&originHeight=464&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u17ab6ee6-f646-4a11-8ac8-85ae364f441&title=)

打个比方，来看上面这个图。消息就像是一个抽象类，有多种子类，最主要的就是 Command 和 Event 两种。以信号灯为例，向信号灯发送打开的消息，这就是一种 Command，信号灯接受这个 Command 并开灯。开灯后，信号灯对外发出信号灯变成绿色的消息，这个就是一种 Event。

对于 Event 来说，有四个主要的特征：

1. 它是一个不可变的，事件就是表示已经发生了的事情，已经成为事实。
2. 事件有时间概念，并且对同一个实体来说事件的发送是有序的。如信号灯按顺序发送了绿、黄、红等事件
3. 事件是无预期的，这个就是 EDA 架构之所以能够实现最大化解耦的特点，事件的产生者对于谁是事件消费者，怎么消费这个事件是不关心的
4. 由于事件驱动是彻底解耦的，并且对于下游怎么去消费事件没有预期，所以事件是具象化的，应该包括尽可能详尽的信息，让下游消费者各取所需。这就是消息和事件的区别。
<a name="hPYn9"></a>
## 走向 Serverless 
<a name="yd2ue"></a>
### Serverless 大势  
Serverless 被认为是下一代的云原生代表技术；云原生的本质则是通过一套技术体系和方法论，帮助客户更好的用云，充分释放云计算红利，让使用云计算的客户能够实现更高效、更低成本的数字化转型。关于云原生的技术， 听的比较多有微服务、容器化等。微服务侧重于应用架构理念的革新，用微服务来实现业务高内聚、低耦合，从而提高研发效率、协作效率、业务敏捷度；而容器化则涉及应用运维层面，用容器化来屏蔽基础设施的差异，提高可移植性，借助 K8S 平台，还能提高应用的运维效率、资源利用率。

而 Serverless 在云原生所代表的含义则是，基础技术下沉，云服务界面上移的趋势，本质上还是让客户把更多的精力聚焦在业务研发上，无需关心底层技术和物理资源。

如下面这个图，在云计算之前，用户需要自建 IDC、购买物理机、自行虚拟化、搭建中间件，然后才能进行业务研发，有大量的时间、精力、资源都花在和业务无关的项目上。进入云计算之后，越来越多的基础设施由云厂商来提供，从最早的 IaaS，直接使用云厂商的计算、存储、网络资源；再到 PaaS，无需自建数据库和中间件，直接使用托管基础软件服务；再到现在云计算演进到 Serverless 的阶段，客户完全把大部分精力聚焦在业务代码的开发上。<br /> <br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721807776380-96f4d7f2-7c88-4d2a-b708-07cb89b8c63a.webp#clientId=u8d714979-f8fa-4&from=paste&id=uba09bbd5&originHeight=442&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ue36725eb-e835-4f8a-b985-70166f06d36&title=)

对云服务厂商来说，Serverless 的云产品也从最早的少数产品如对象存储、函数计算等，发展到现在的 all on Serverless，具备了完备的 Serverless 产品体系，如 Serverless 消息队列、微服务、数据库、搜索、大数据产品等。
<a name="RQuMT"></a>
### 全面 Serverless 的应用场景    
进入 Serverless 时代，全面使用 Serverless 的客户会为消息队列带来哪些场景变化呢？

- 如在应用侧，越来越多的应用不在部署在自行购买的 ECS 上面，直接托管在 Serverless 容器、应用引擎、函数计算上，云服务会根据其业务流量或者系统负载自动进行弹性伸缩，对应的消息服务也要能根据消息流量自行弹性伸缩。
- 在车联网消息解决方案场景里，汽车每天都有早晚高峰，上下行的消息流量也出现明显的波峰波谷，车联网客户无需为波峰流量预先购买消息资源，而是根据实际消息量，用多少付多少钱。
- 在移动 App 推送场景，也会面临更多维度的资源指标，比如需要维持大量的连接数、偶尔的峰值消息推送、极小的消息存储空间，客户无需预先购买计算、存储、网络绑定的消息实例，而是分别面向连接数、消息流量、存储空间分别付费。
- 除了核心的弹性能力之外，消息队列的核心架构场景“事件驱动”在 Serverless 时代成为最重要的架构模式，事件驱动架构有助于开发更加敏捷、可扩展、韧性的 Serverless 应用，事件驱动天然匹配 Serverless 研发范式。因此 Serverless 全云开发模式中，客户希望消息队列的服务界面也需要上移，具备“事件总线”的能力。客户不仅需要开箱即用的 Serverless 云服务，也需要开箱即用的事件驱动集成服务，无需像以前一样编写集成的胶水代码，研发效率进一步提升，走向 lowcode、nocode。比如云产品事件集成，OSS 文件上传事件发送到事件总线，用户订阅这个事件，并基于函数计算进行文件加工处理响应事件，驱动 Serverless 算力。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721807776501-c51464c8-57ad-41b2-b858-32d1c851dbfa.webp#clientId=u8d714979-f8fa-4&from=paste&id=ub84c2f8d&originHeight=490&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u6689ebcc-5776-496d-b5b0-2f34e7b6ae8&title=)

面向 Serverless 的趋势，RocketMQ 5.0 从产品形态到技术架构都做了巨大的演进。  
<a name="hbqZ3"></a>
### 面向 Serverless 应用的新 SDK
当应用大量使用 Serverless 技术之后，应用的实例数将会随着流量的变化动态弹性伸缩，相比于过去的场景，实例数变化将十分频繁，这就对消息收发的负载均衡提出比较大的挑战。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/57656509/1721807776736-7d08263f-d72e-4a87-a8d1-e68231becb23.png#clientId=u8d714979-f8fa-4&from=paste&id=ud46334a7&originHeight=448&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ub8752fe4-0b57-473b-aee8-af227505ff7&title=)

- 先来看生产链路的负载均衡，生产者通过服务发现机制，知道了 Topic 的数据分片以及对应的 Broker 地址。他的服务发现机制是比较简单的，在默认情况下采用 RoundRobin 的方式轮询发送到各个 Topic 队列，保证了 Broker 集群的流量均衡。生产者是彻底无状态的，所以无论如何弹性伸缩，都没有太多影响。
- 再来看下消费者的负载均衡，相对来说它会比生产者更复杂，旧模式是队列级负载均衡，消费者知道Topic的队列总数，也知道同一个 ConsumerGroup 下的实例数，就可以按照统一的分配算法，类似一致性 hash 的方式，让每个消费者实例绑定对应的队列，只消费绑定队列的消息，每个队列的消息也只会被一个消费者实例消费。这种模式最大的缺点就是负载不均衡，消费者实例要绑定队列、有临时状态。当应用实例数变化频繁的时候，这种负载不均衡会导致应用的 Serverless 扩容无效，扩容的新阶段无法分担消息的流量。如图 Topic 有 2 个分区，扩容第三个节点会出现空跑；如果 把 Topic 扩容成 3 个分区，随后消费者实例又缩容回 2 个，那么就会出现其中一个消费者实例承担三分之二的流量，出现过载。    

所以在 RocketMQ 5.0 里面， 引入了消息粒度的负载均衡机制，无需绑定队列，消息在消费者集群随机分发，这样就可以保障消费者集群的负载均衡。更重要的是这种模式更加符合全链路 Serverless 化的场景，Broker 的机器数、Topic 的队列数和消费者实例数完全解耦，可以独立扩缩容。
<a name="UC1Vm"></a>
### Serverless事件驱动的挑战  
在上一个章节， 提到消息和事件的统一，事件是一种包含业务语义的消息。下面结合一个典型事件驱动的案例来看看。<br />如下图是一个基于消息队列 RocketMQ 实现的一个交易系统，采用事件驱动的架构，围绕“订单”事件完成交易业务。事件生产者是交易中心，消费者是交易的下游系统。比如发送订单创建事件，购物车响应事件，删除之前的加购商品；发生订单付款事件，会员系统响应事件，给客户增加积分，物流系统响应事件，执行后续的发货履约环节。整个交易系统是由“事件驱动”的微服务构建而成。    

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721807776912-6dcd38ef-f5a9-4a24-89ed-5aea7d067982.webp#clientId=u8d714979-f8fa-4&from=paste&id=u4dbb6eb7&originHeight=453&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u53ff5c84-be68-476e-8508-880fe4e9c6c&title=)

基于经典消息队列的事件驱动方案在一个组织内部、部门内部是一个不错的选择。但是在 Serverless 时代面临很多全新的挑战。

- 越来越多的商业数字化解决方案是由多个不同组织协作完成的，比如 SaaS 平台（钉钉）和它的合作伙伴，钉钉平台发布各种事件，包括视频会议、日程、通讯录、审批流、钉盘等事件，下游合作伙伴消费这些事件，研发行业应用。在这类新型数字化解决方案中，往往事件的生产者和消费者属于不同的公司，开发者无法进行密集的交流，低成本的了解“事件”定义、格式、使用方法。目前的模式过于依赖开发者之间的交流，以及公司的内部文档沉淀。
- 不同的公司往往会使用不同的技术体系，比如使用不同的消息队列，事件生产者使用 RocketMQ，事件消费者使用 RabbitMQ；比如使用不同的消息传输协议，HTTP 或 AMQP。
- 事件的消费者多样化，哪怕是同一个业务的事件，事件消费者可能只需要其中的某种子类型；哪怕是同一个事件，事件消费者也可能只能访问其中的部分字段。    
- 缺少开箱即用的事件集成能力，客户全面用云后，需要响应各种云产品事件，比如响应 OSS 上传事件，使用函数计算对文件进行处理，这种预先集成的特性，经典的消息队列不具备。

Serverless 的事件驱动技术需要更加彻底的解耦，只关注“事件”本身，解耦技术实现细节，如传输协议、SDK、生产消费模式。
<a name="a8E6P"></a>
### Serverless 事件驱动的设计
为了实现 Serverless 的事件驱动， 在消息队列的基础上面，将“事件驱动”场景的服务界面上移，围绕“事件”的领域模型进行重新设计。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721807777033-b18e93ca-529b-435d-8b36-63dbac34ab1b.webp#clientId=u8d714979-f8fa-4&from=paste&id=u9905f6f5&originHeight=443&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u728ff06e-ed7f-4e3f-a819-5aa182e6263&title=)

最左边是事件源，由于事件需要具备跨平台生产消费的能力，所以采用 CNCF 的 CloudEvents 来作为事件的格式。这个是业界事件的事实标准，它标准简化了事件声明，提升事件在跨服务、跨平台的互操作性。  

由于事件是有可能被跨组织消费的，所以需要一个统一的事件中心，让这些不同的事件源都注册到这个事件中心。对消费者来说就好比是一个事件商店，能够选择自己感兴趣的事件订阅。

在事件消费者开始编写消费逻辑的时候，开发者还需要对这个事件的格式有更清楚的了解，需要知道这个事件有哪些内容，有哪些字段，分别是什么含义，才能编写正确的消费业务逻辑。所以，事件总线还提供了 schema 中心，有这个 schema 中心后，消费者对于事件的格式也就一目了然，不用跟事件源的发起者进行沟通了，整个效率也得到了大幅度的提升。

再往后面看，就到了事件消费的环节，因为事件的消费者种类很多，不同消费者关注不同的事件类型，事件总线需要提供丰富的过滤规则。即便多个消费者对同一个事件感兴趣，但是可能只需要事件的部分内容，事件总线还提供了事件转换的能力。这就是 RocketMQ 5.0 对事件驱动的能力抽象。
<a name="vaXI7"></a>
### Serverless 事件驱动的新形态
基于上面的全新设计， 以 RocketMQ 作为事件存储的内核，实现了全新的事件总线 EventBridge。<br />在产品界面上，面向事件驱动的业务进行一层抽象，核心领域对象从消息变成 CloudEvents。基于统一事件标准来构建事件驱动的数字生态。    

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721807777484-619290b4-358d-462e-87a7-154c7bc48efc.webp#clientId=u8d714979-f8fa-4&from=paste&id=u5ce81f6e&originHeight=471&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u0d8c1cce-d4c1-4b65-aa56-f825f6114a4&title=)

事件源是多样化的，可以是云产品事件、数据流事件、也可以是 SaaS 平台事件，应用自定义事件、通用的 WebHook。当然，它的事件目标也是多样化的，通过事件规则引擎把事件路由到不同的消费者，典型的消费者包括函数计算、消息系统（用于解耦生产者、消费者使用不同的消息队列技术）、存储系统、流计算引擎、通用的 webhook，甚至可以是消息通知如语音\短信\邮件。事件驱动架构更适合建设混合云、多云的数字化系统。

通过 EventBridge 实现彻底的事件驱动架构，真正做到只关心“事件”本身，生产者和消费者实现更加彻底的解耦，包括组织解耦、技术体系解耦。
<a name="XoPRe"></a>
### 面向 Serverless 消息内核的重构  
前面提到的主要是面向 Serverless 应用场景，如一些 Serverless 化的应用，Serverless 化的事件驱动架构，RocketMQ 在产品形态、使用界面上做出的改变。现在我们从技术架构演进的角度来看 RocketMQ 如何实现一个 Serverless 化的消息云服务。在 Serverless 场景下，客户需要的是声明式的逻辑资源，不同逻辑资源可以解绑，分别弹性、按量服务。

面向 Serverless 的场景，RocketMQ 演进到三层存算分离的架构。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721807777723-b186d4ab-4772-4d88-b57d-613110cd7802.webp#clientId=u8d714979-f8fa-4&from=paste&id=u3a3e61ee&originHeight=424&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u101574ad-eb11-4d69-9c74-ed21a3ca5af&title=)

- 第一层是 RocketMQ proxy，它主要承载的是多协议，多领域场景的覆盖。这里面的领域场景有 RocketMQ 场景，经典的服务端应用集成；还有 MQTT，面向物联网的应用；还有 EventBridge 面向事件驱动型的应用。Proxy 可以认为是计算资源的主要载体，它是一个彻底的无状态的网关。它可以面向客户不同的连接数，不同的消息 TPS 以及不同的消息的读写的比例的变化，进行一个计算、网络资源的独立弹性。这样才可以匹配到客户在 Serverless 场景下，对多种资源解耦弹性的需求。
- 第二层是 RocketMQ 的存储引擎，它主要专注于消息多副本实现、多副本如何进行高可用切换。同时它也要负责本地存储跟云存储的统一抽象。由于消息的存储主要在云盘和对象存储上面，大部分的消息数据存储在对象存储，store 自身的状态被弱化了，弹性效率也得以提升。RocketMQ store 可以根据客户的消息流量特点，如消息吞吐量、TPS、消息大小、批量因素等和存储资源 IOPS、带宽、存储空间进行弹性匹配，实现消息存储和计算的解耦。    
- 第三层是云存储层这一块，大部分的消息存储在对象存储上，这是公共云基础设施级的存储池化。通过将冷数据卸载到了对象存储，然后缩短了 RocketMQ Store 的生命周期，同时也具备一个低成本的无限消息存储空间。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721807777685-448fb827-b249-430b-938d-bc0bd9fc0981.webp#clientId=u8d714979-f8fa-4&from=paste&id=u99280fce&originHeight=331&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u0fc2d177-a220-41dc-a364-3d19615470a&title=)

现在 RocketMQ 5.0 已经具备弹性架构，采用云服务形态的 RocketMQ 能够进一步和云的基础设施深度结合，充分释放云计算红利。

- 在计算层面，RocketMQ 5.0 通过容器服务充分利用 ECS 弹性能力，采取弹性资源池 + HPA 相关技术支持计算能力快速弹性，同时 ACK 自带的跨可用区部署能力为云产品提供了充足的高可用保障。
- 在网络层面，RocketMQ 5.0 可接入了多种云原生网络能力，满足用户对多样性网络的需求，公网随开随用，支持多种私网网络形态，基于 CEN 构建了全球互通的消息网络，实现异地多活。
- 在存储方面，基于盘古 DFS、对象存储的多级存储架构，提供低成本的无限存储能力，冷热数据链路分离，提供更高的 SLA。    
<a name="Dsdnc"></a>
### 事件驱动赋能 Serverless 技术栈 
最后，基于 Apache RocketMQ 打造的消息产品体系，以事件驱动 + 集成两大场景，赋能全面 Serverless 技术栈。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721807778013-b1f827ec-8b0c-4e1e-b73b-5c02f4a33dca.webp#clientId=u8d714979-f8fa-4&from=paste&id=ud52b3e09&originHeight=479&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u904a07b9-b996-4ace-bc3e-b2a0378365d&title=)

以上是一个典型的 Serverless 产品体系，一些头部云厂商已经实现了核心产品的全面 Serverless 化，无论是计算、存储，还是大数据分析都具备了 Serverless 服务能力，基于这些能力客户能够打造端到端的 Serverless 应用，聚焦核心业务，把降本增效做到极致。

