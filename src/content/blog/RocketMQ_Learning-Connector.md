---
title: "基于 RocketMQ Connect 构建数据流转处理平台"
description: "基于 RocketMQ Connect 构建数据流转处理平台"
date: "2024-07-24"
tags: ["practice", "bestPractice"]
author: "周波"
img: "https://img.alicdn.com/imgextra/i4/O1CN01LyddeK28iwQm11NMB_!!6000000007967-2-tps-496-276.png"
---

<a name="iek6y"></a>
## 从问题中来的 RocketMQ Connect
在电商系统、金融系统及物流系统，我们经常可以看到 RocketMQ 的身影。原因不难理解，随着数字化转型范围的扩大及进程的加快，业务系统的数据也在每日暴增，此时为了保证系统的稳定运行，就需要把运行压力分担出去。RocketMQ 就担任着这样的角色，它的异步消息处理与高并发读写能力，决定了系统底层的重构不会影响上层应用的功能。而 RocketMQ 的另一个优势——可伸缩能力，使系统在面临流量的不确定性时，实现对流量的缓冲处理。此外，RocketMQ 的顺序设计特性使其成为一个天然的排队引擎，例如，三个应用同时对一个后台引擎发起请求，确保不引起“撞车”事故。因此，RocketMQ 被用在异步解耦、削峰填谷以及事务消息等场景中。

但是，数字化转型浪潮也带来了更多用户对数据价值的关注——如何让数据产生更大利用价值？RocketMQ 自身不具备数据分析能力，但是有不少用户希望从 RocketMQ Topic 中获取数据并进行在线或离线的数据分析。然而，使用市面上的数据集成或数据同步工具，将 RocketMQ Topic 数据同步到一些分析系统中虽然是一种可行方案，却会引入新的组件，造成数据同步的链路较长，时延相对较高，用户体验不佳。

举个例子，假设业务场景中使用 OceanBase 作为数据存储，同时希望将这些数据同步到 Elasticsearch 进行全文搜索，有两种可行的数据同步方案。

方案一：<br />从 OceanBase 中获取数据，写入 Elasticsearch 组件并进行数据同步，在数据源较少时此方案没什么问题，一旦数据增多，开发和维护都非常复杂，此时就要用到第二种方案。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721805959801-61137c8d-f6eb-43dd-b12e-a842f19b1bee.webp#clientId=u331a9ddb-5ef4-4&from=paste&id=ue1735d00&originHeight=96&originWidth=712&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ucbb8aeae-903a-4763-bfec-e120e9f78b2&title=)

方案二：<br />引入消息中间件对上下游进行解藕，这能解决第一种方案的问题，但是一些较为复杂的问题还没有完全解决。比如，如何将数据从源数据同步到目标系统并保证高性能，如果保证同步任务的部分节点挂掉，数据同步依然正常进行，节点恢复依然可以断点续传，同时随着数据管道的增多，如何管理数据管道也变得十分困难。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721805957760-654fca1b-3586-4871-9169-00c7b87420e1.webp#clientId=u331a9ddb-5ef4-4&from=paste&id=ucb146434&originHeight=75&originWidth=811&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=uc67b0a41-aa34-4cdb-9635-7d5e69696ef&title=)

总的来说，数据集成过程中的挑战主要有五个。

- 挑战一：数据源多，市面上可能有上百个数据源，且各数据源的系统差异较大，实现任意数据源之间的数据同步工作量较大，研发周期很长。
- 挑战二：高性能问题，如何高效地从源数据系统同步到目的数据系统，并保障其性能。
- 挑战三：高可用问题，即Failover能力，当一个节点挂掉是否这个节点的任务就停止了，任务重新启动是否还可以断点续传。
- 挑战四：弹性扩缩容能力，根据系统流量动态增加或减少节点数量，既能通过扩容满足高峰期业务，也能在低峰期缩减节点，节省成本。
- 挑战五：数据管道的管理运维，随着数据管道的增多，运维监控的数据管道也会变得越来越复杂，如何高效管理监控众多的同步任务。

面对上述挑战 RocketMQ 如何解决？

- 第一，标准化数据集成 API （Open Messaging Connect API）。在 RocketMQ 生态中增加 Connect 组件，一方面对数据集成过程抽象，抽象标准的数据格式以及描述数据的 Schema，另一方面对同步任务进行抽象，任务的创建、分片都抽象成一套标准化的流程。
- 第二，基于标准的 API 实现 Connect Runtime。Runtime 提供了集群管理、配置管理、位点管理、负载均衡相关的能力，拥有了这些能力，开发者或者用户就只需要关注数据如何获取或如何写入，从而快速构建数据生态，如与 OceanBase、MySQL、Elasticsearch 等快速建立连接，搭建数据集成平台。整个数据集成平台的构建也非常简单，通过 Runtime 提供的 RESTFull API 进行简单调用即可。
- 第三，提供完善的运维工具，方便管理同步任务，同时提供丰富的 Metrics 信息，方便查看同步任务的 TPS，流量等信息。
<a name="x2rVY"></a>
## RocketMQ Connect 两大使用场景
这里为大家整理了 RocketMQ Connect 的两大使用场景。

**场景一，RocketMQ 作为中间媒介，可以将上下游数据打通。**

比如在新旧系统迁移的过程中，如果在业务量不大时使用 MySQL 就可以满足业务需求，而随着业务的增长，MySQL 性能无法满足业务要求时，需要对系统进行升级，选用分布式数据库 OceanBase 提升系统性能。

如何将旧系统数据无缝迁移到 OceanBase 中呢？在这个场景中 RocketMQ  Connect 就可以发挥作用，RocketMQ Connect 可以构建一个从 MySQL 到 OceanBase 的数据管道，实现数据的平滑迁移。RocketMQ Connect 还可以用在搭建数据湖、搜索引擎、ETL 平台等场景。例如将各个数据源的数据集成到 RocketMQ Topic 当中，目标存储只需要对接 Elasticsearch 就可以构建一个搜索平台，目标存储如果是数据湖就可以构建一个数据湖平台。

除此之外，RocketMQ 自身也可以作为一个数据源，将一个 RocketMQ 集群的数据同步到另一个集群，可以构建 RocketMQ 多活容灾能力，这是社区正在孵化的 Replicator 可以实现的能力。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721805959872-ab94c4f0-e9bf-4c0b-a95a-9660ca9dc9dc.webp#clientId=u331a9ddb-5ef4-4&from=paste&id=ud0a2eb21&originHeight=482&originWidth=721&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u73889ade-8113-4cc6-969b-3c1e823ba6a&title=)

**场景二，RocketMQ 作为端点。**

RocketMQ 的生态中提供了流计算能力组件——RocketMQ Streams，Connector 将各个存储系统的数据集成到RocketMQ Topic 当中，下游使用 RocketMQ Streams 流计算的能力就可以构建一个实时的流计算平台。当然也可以配合业务系统的 Service 实现业务系统快速从其它存储统一快速获取数据的能力。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721805959792-c377be7b-12f1-4521-8f46-82c89d975e5e.webp#clientId=u331a9ddb-5ef4-4&from=paste&id=ubfb15ec2&originHeight=371&originWidth=484&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u1be8a54d-f172-4d02-ada5-f7a733b67ca&title=)

还可以将 RocketMQ 作为端点的上游，将业务消息发到 Topic 中，使用 Connector 对数据做持久化或转存的操作。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721805957812-011f76ec-5423-4a79-8bfa-5287be110cc1.webp#clientId=u331a9ddb-5ef4-4&from=paste&id=u053f4aef&originHeight=371&originWidth=495&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=udf0de24b-1fa8-4ba3-8c87-9b32006ce4a&title=)

如此一来，RocketMQ 就具备数据集成能力，可以实现任意任意异构数据源之间的数据同步，同时也具备统一的集群管理、监控能力及配置化搭建数据管道搭建能力，开发者或者用户只需要专注于数据拷贝，简单配置就可以得到一个具备配置化、低代码、低延时、高可用，支持故障处理和动态扩缩容数据集成平台。
<a name="qCGD8"></a>
## RocketMQ Connect 实现原理
那么， RocketMQ Connect 是如何实现的呢？在介绍实现原理前，先来了解两个概念。

**概念一：什么是 Connector（连接器）？**

它定义数据从哪复制到哪，是从源数据系统读取数据写入 RocketMQ，这种是 SourceConnector，或从 RocketMQ 读数据写入到目标系统，这种是 SinkConnector。Connector 决定需要创建任务的数量，从 Worker 接收配置传递给任务。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721805958408-472caef4-02e2-482f-9073-3f93a13ebf74.webp#clientId=u331a9ddb-5ef4-4&from=paste&id=u1131589a&originHeight=598&originWidth=966&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u3187cfd5-cacf-4186-9912-18dee549898&title=)

**概念二：什么是 Task ？**

Task 是 Connector 任务分片的最小分配单位，是实际将源数据源数据复制到 RocketMQ（SourceTask），或者将数据从 RocketMQ 读出写入到目标系统（SinkTask）真正的执行者，Task 是无状态的，可以动态的启停任务，多个 Task 可以并行执行，Connector 复制数据的并行度主要体现在 Task 上。一个 Task 任务可以理解为一个线程，多个 Task 则以多线程的方式运行。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721805958524-54cc9343-ce9d-43c0-9d18-6259714298d3.webp#clientId=u331a9ddb-5ef4-4&from=paste&id=uaea3cdbe&originHeight=558&originWidth=988&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u408fb900-f02a-4bdf-aae9-45d7580c77f&title=)

通过 Connect 的 API 也可以看到 Connector 和 Task 各自的职责，Connector 实现时就已经确定数据复制的流向，Connector 接收数据源相关的配置，taskClass 获取需要创建的任务类型，通过 taskConfigs 的数量确定任务数量，并且为 Task 分配好配置。Task 拿到配置以后数据源建立连接并获取数据写入到目标存储。通过下面的两张图可以清楚的看到，Connector 和 Task 处理基本流程。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721805958835-806e38a8-a89f-4817-91de-9388ea4cd784.webp#clientId=u331a9ddb-5ef4-4&from=paste&id=u63ebc07f&originHeight=378&originWidth=902&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u22c92033-f058-4e59-967d-39267c60e61&title=)

一个 RocketMQ Connect 集群中会有多个 Connector ，每个 Connector 会对应一个或多个 Task，这些任务运行在 Worker（进程）中。Worker 进程是 Connector 和 Task 运行环境，它提供 RESTFull 能力，接收 HTTP 请求，将获取到的配置传递给 Connector 和 Task，它还负责启动 Connector 和 Task，保存 Connector 配置信息，保存 Task 同步数据的位点信息，除此以外，Worker 还提供负载均衡能力，Connect 集群高可用、扩缩容、故障处理主要依赖 Worker 的负责均衡能力实现的。Worker 提供服务的流程如下：

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721805958937-45a7eda4-f94b-49db-9707-fbe2ae7af6a5.webp#clientId=u331a9ddb-5ef4-4&from=paste&id=ub7c5a76b&originHeight=726&originWidth=850&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u267bee22-45a2-488a-9f2a-184fd1b13e8&title=)

Worker 提供的服务发现及负载均衡的实现原理如下：

**服务发现：**

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721805959241-aa51b42b-f468-4cdf-8b70-83486e2dbead.webp#clientId=u331a9ddb-5ef4-4&from=paste&id=u62ef2344&originHeight=169&originWidth=828&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=udb23a0cc-0b9e-4234-9006-c9fcf7a0f3b&title=)

用过 RocketMQ 的开发者应该知道，它的使用很简单，就是发送和接收消息。消费模式分为集群模式和广播模式两种，集群消费模式下一个 Topic 可以有多个 Consumer 消费消息，任意一个 Consumer 的上线或下线 RocketMQ 服务端都有感知，并且还可以将客户端上下线信息通知给其它节点，利用 RocketMQ 这个特性就实现了 Worker 的服务发现。

**配置 / Offset 同步：**

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721805959316-aa512856-fd82-4d8c-965d-0c29397caa12.webp#clientId=u331a9ddb-5ef4-4&from=paste&id=ued936421&originHeight=132&originWidth=860&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u31c21ad6-f6f5-430e-8af6-ace3c35eb45&title=)

Connector 的配置/Offset 信息同步通过每个 Worker 订阅相同的 Topic，不同 Worker 使用不同的 Consumer Group 实现的， Worker 节点可以通过这种方式消费到相同 Topic 的所有数据，即 Connector 配置/ Offset 信息，这类似于广播消费模式，这种数据同步模式可以保证任何一个 Worker 挂掉，该 Worker 上的任务依旧可以在存活的 Worker 正常拉起运行 ，并且可以获取到任务对应的 Offset 信息实现断点续传， 这是故障转移以及高可用能力的基础。

**负载均衡：**

RocketMQ 消费场景中，消费客户端 与 Topic Queue 之间有负载均衡能力，Connector 在这一部分也是类似的，只不过它负载均衡的对象不一样，Connector 是 Worker 节点和 Task 之间的负载均衡，与 RocketMQ 客户端负载均衡一样，可以根据使用场景选择不同负载均衡算法。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721805959608-b9fed0e0-96a6-4c78-978e-e8d0d65c2c3a.webp#clientId=u331a9ddb-5ef4-4&from=paste&id=u1dbf75fd&originHeight=287&originWidth=588&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u2fa93dea-f9f5-41a1-bd8f-7c6b6abb006&title=)

上文提到过 RocketMQ Connect 提供 RESTFull API能力。通过 RESTFull AP可以创建 Connector，管理Connector 以及查看 Connector 状态，简单列举：

- POST /connectors/{connector name}
- GET /connectors/{connector name}/config
- GET /connectors/{connector name}/status
- POST /connectors/{connector name}/stop

目前 Connector 支持单机、集群两种部署模式。集群模式至少要有两个节点，才能保证它的高可用。并且集群可以动态增加或者减少，做到了动态控制提升集群性能和节省成本节省的能力。单机模式更多方便了开发者开发测试 Connector 。

**如何实现一个 Connector呢？**

还是结合一个具体的场景看一看，例如业务数据当前是写入 MySQL 数据库中的，希望将 MySQL中数据实时同步到数据湖 Hudi 当中。只要实现 MySQL Source Connector 、Hudi Sink Connector 这两个 Connector 即可。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721805959739-e8632c0f-3f77-4f7e-9d4e-140617527465.webp#clientId=u331a9ddb-5ef4-4&from=paste&id=u56eecafb&originHeight=467&originWidth=1000&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u33c2c94c-925d-493b-ab48-6ff7a839928&title=)

下面就以 MySQLSource Connector 为例，来看一下具体的如何实现。

实现 Connector 最主要的就是实现两个 API 。第一个是 Connector API ，除了实现它生命周期相关的 API 外，还有任务如何分配，是通过 Topic、Table 还是通过数据库的维度去分。第二个API是需要创建的 Task，Connector 通过任务分配将相关的配置信息传递给 Task， Task 拿到这些信息，例如数据库账号，密码，IP，端口后就会创建数据库连接，再通过 MySQL 提供的 BINLOG 机智获取到表的数据，将这些数据写到一个阻塞队列中。Task 有个 Poll 方法，实现 Connector 时只要调用到 Poll 方法时可以获取到数据即可，这样 Connector 就基本写完了。然后打包以 Jar 包的形式提供出来，将它加载到 Worker 的节点中。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721805960062-d0ab810c-e342-414d-af95-4239422c72f7.webp#clientId=u331a9ddb-5ef4-4&from=paste&id=u1f523e9d&originHeight=494&originWidth=1000&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u5626aa71-8e57-4cb1-abf4-2023847fd52&title=)<br />创建 Connector 任务后， Worker 中会创建一个或者多个线程，不停的轮询 Poll 方法，从而获取到 MySQL 表中的数据，再通过 RocketMQ Producer 发送到 RocketMQ Broker中，这就是 Connector 从实现到运行的整体过程（见下图）。

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721805960288-b5cfe203-7374-4218-a76a-4acc3b642692.webp#clientId=u331a9ddb-5ef4-4&from=paste&id=u1e447014&originHeight=724&originWidth=802&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=uc20e89ec-4ce2-48e1-8fda-67bba6be03a&title=)
<a name="ajVEl"></a>
## RocketMQ Connect 现状与未来
RocketMQ Connect 的发展历程分为三个阶段。

**第一阶段：Preview 阶段**

RocketMQ Connect 发展的初期也即 Preview 阶段，实现了 Open Messaging Connect API 1.0 版本，基于该版本实现了 RocketMQ Connect Runtime ，同时提供了 10+ Connector 实现（MySQL，Redis，Kafka，Jms，MongoDB……）。在该阶段，RocketMQ Connect 可以简单实现端到端的数据源同步，但功能还不够完善，不支持数据转换，序列化等能力，生态相对还比较贫乏。

**第二阶段：1.0 阶段**

在 1.0 阶段，Open Messaging Connect API 进行了升级，支持Schema、Transform，Converter等能力，在此基础上对 Connect Runtime 也进行了重大升级，对数据转换，序列化做了支持，复杂Schema也做了完善的支持。该阶段的 API、Runtime 能力已经基本完善，在此基础上，还有30+ Connecotor 实现，覆盖了 CDC、JDBC、SFTP、NoSQL、缓存Redis、HTTP、AMQP、JMS、数据湖、实时数仓、Replicator、等Connector实现，还做了Kafka Connector Adaptor可以运行Kafka生态的Connector。

**第三阶段：2.0 阶段**

RocketMQ Connect当前处于这个阶段，重点发展Connector生态，当 RocketMQ 的 Connector生态达到 100 + 时，RocketMQ 基本上可以与任意的一个数据系统去做连接。

目前 RocketMQ 社区正在和 OceanBase 社区合作，进行 OceanBase 到 RocketMQ Connect 的研发工作，提供 JDBC 和 CDC 两种模式接入模式，后续会在社区中发布，欢迎感兴趣的同学试用。
<a name="zeSw8"></a>
## 总结
RocketMQ 是一个可靠的数据集成组件，具备分布式、伸缩性、故障容错等能力，可以实现 RocketMQ 与其他数据系统之间的数据流入与流出。通过 RocketMQ Connect 可以实现 CDC，构建数据湖，结合流计算可实现数据价值。

