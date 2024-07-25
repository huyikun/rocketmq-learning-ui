---
title: "RocketMQ x OpenTelemetry 分布式全链路追踪最佳实践"
date: "2023/03/28"
author: "艾阳坤"
description: "分布式全链路追踪技术帮助我们在复杂的网络通信和数据传输中快速定位到根因，它能够跟踪和记录请求在系统中的传输过程，并提供详细的性能和日志信息，使得开发人员能够快速诊断和定位问题。对于分布式系统的可靠性、性能和可维护性起到了非常重要的作用。"
img: "https://img.alicdn.com/imgextra/i4/O1CN01LR0Zkj1zyfMLasGa0_!!6000000006783-0-tps-685-383.jpg"
tags: ["practice", "home"]
---

作者简介：艾阳坤，Apache RocketMQ PMC Member/Committer，CNCF OpenTelemetry Member，CNCF Envoy contributor。

在分布式系统中，多个服务之间的交互涉及到复杂的网络通信和数据传输，其中每个服务可能由不同的团队或组织负责维护和开发。因此，在这样的环境下，当一个请求被发出并经过多个服务的处理后，如果出现了问题或错误，很难快速定位到根因。分布式全链路追踪技术则可以帮助我们解决这个问题，它能够跟踪和记录请求在系统中的传输过程，并提供详细的性能和日志信息，使得开发人员能够快速诊断和定位问题。对于分布式系统的可靠性、性能和可维护性起到了非常重要的作用。

## **RocketMQ 5.0 与分布式全链路追踪**

Apache RocketMQ 5.0 版本作为近几年来最大的一次迭代，在整个可观测性上也进行了诸多改进。其中，支持标准化的分布式全链路追踪就是一个重要的特性。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/200096/1678775470861-a5e9338d-93b8-485f-90e6-1de9bab5772c.png#clientId=u05438468-4731-4&from=paste&height=381&id=ueca9b08e&originHeight=539&originWidth=541&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ud04c8a39-4127-40ba-ac48-c0d9d1e2ecc&title=&width=382)

RocketMQ 5.0 可观测

而由 Google、Microsoft、Uber 和 LightStep 联合发起的 CNCF OpenTelemetry 作为 OpenTracing 和 OpenCensus 的官方继任者，已经成为可观测领域的事实标准，RocketMQ 的分布式全链路追踪也围绕 OpenTelemetry 进行展开。

分布式链路追踪系统的起源可以追溯到 2007 年 Google 发布的[《Dapper, a Large-Scale Distributed Systems Tracing Infrastructure》](https://research.google/pubs/pub36356.pdf)论文。这篇论文详细介绍了 Google 内部使用的链路追踪系统 Dapper，其中使用的 span 概念被广泛采用，并成为后来开源链路追踪系统中的基础概念之一。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/200096/1678775472870-add1e07d-268e-4ce7-9204-89893f3fca75.png#clientId=u05438468-4731-4&from=paste&height=464&id=ucd20496c&originHeight=736&originWidth=836&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ud97c8c49-a588-4d75-a720-2d2bee77189&title=&width=527)

Dapper Trace Tree

在 Dapper 中，每个请求或事务被追踪时都会创建一个 span，记录整个请求或事务处理过程中的各个组件和操作的时间和状态信息。这些 span 可以嵌套，形成一个树形结构，用于表示整个请求或事务处理过程中各个组件之间的依赖关系和调用关系。后来，很多开源链路追踪系统，如 Zipkin 和 OpenTracing，也采用了类似的 span 概念来描述分布式系统中的链路追踪信息。现在，合并了 OpenTracing 和 OpenCensus 的 CNCF OpenTelemetry 自然也一样采用了 span 概念，并在此基础上进行了进一步发展。

OpenTelemetry 为 messaging 相关的 span 定义了[一组语义约定（semantic convention）](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/messaging.md)，旨在制定一套与特定消息系统无关的 specification，而 OpenTelmetry 自身的开发其实也都是由 specification 驱动进行展开。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/200096/1678775470885-b0271503-1eb7-4fc2-ade1-b7c2f285b0a9.png#clientId=u05438468-4731-4&from=paste&height=429&id=u3c44d76f&originHeight=1199&originWidth=1600&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u13bdcf02-3de6-42ac-b57f-38cb5e16c8c&title=&width=572)

Specification Driven Development

### **Messaging Span 定义**

Specifaition 中描述了 messaging span 的拓扑关系，包括代表消息发送、接收和处理的不同 span 之间的父子和链接关系。关于具体的定义可以参考：[Semantic Conventions of Messaging](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/messaging.md)。对应到 RocketMQ 中，有三种不同的 span：

| **Span** | **Description**                                                                                                            |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| send     | 消息的发送过程。span 以一次发送行为开始，成功或者失败/抛异常结束。消息发送的内部重试会被记录成多条 span。                  |
| receive  | 消费者中接收消息的长轮询过程，与长轮询的生命周期保持一致。                                                                 |
| process  | 对应 PushConsumer 里 MessageListener 中对消息的处理过程，span 以进入 MessageListener 为开始，离开 MessageListener 为结束。 |

特别地，默认情况下，receive span 是不启用的。在 receive span 启用和不启用的两种情况下，span 之间的组织关系是不同的：

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/200096/1678775472906-25b5cc24-773a-479f-8e80-768a0334ab37.png#clientId=u05438468-4731-4&from=paste&id=u10096f2c&originHeight=580&originWidth=1652&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u0b2cbfd8-f32f-4341-83c8-c651d218d97&title=)

启用 receive span 前后的 span 关系

在没有启用 receive span 的情况下，process span 会作为 send span 的 child；而当 receive span 启用的情况下，process span 会作为 receive span 的 child，同时 link 到 send span。

### **Messaging Attributes 定义**

语义约定中规定了随 span 携带的通用属性的统一名称，这包括但不限于：

- messaging.message.id: 消息的唯一标识符。
- messaging.destination：消息发送的目的地，通常是一个队列或主题名称。
- messaging.operation：对消息的操作类型，例如发送、接收、确认等。

具体可以查看 [Messaging Attributes  的部分](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/messaging.md#messaging-attributes)。

特别地，不同的消息系统可能会有自己特定的行为和属性，[RocketMQ  也和  Kafka  以及  RabbitMQ  一起，将自己特有的属性推进了社区规范中](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/semantic_conventions/messaging.md#apache-rocketmq)，这包括：

| **Attribute**                                 | **Type** | **Description**                                                       |
| --------------------------------------------- | -------- | --------------------------------------------------------------------- |
| messaging.rocketmq.namespace                  | string   | RocketMQ 资源命名空间，暂未启用                                       |
| messaging.rocketmq.client_group               | string   | RocketMQ producer/consumer 负载均衡组，5.0 只对 consumer 生效         |
| messaging.rocketmq.client_id                  | string   | 客户端唯一标识符                                                      |
| messaging.rocketmq.message.delivery_timestamp | int      | 定时消息定时时间，只对 5.0 生效                                       |
| messaging.rocketmq.message.delay_time_level   | int      | 定时消息定时级别，只对 4.0 生效                                       |
| messaging.rocketmq.message.group              | string   | 顺序消息分组，只对 5.0 生效                                           |
| messaging.rocketmq.message.type               | string   | 消息类型，可能为 normal/fifo/delay/transaction，只对 5.0 生效         |
| messaging.rocketmq.message.tag                | string   | 消息 tag                                                              |
| messaging.rocketmq.message.keys               | string[] | 消息 keys，可以有多个                                                 |
| messaging.rocketmq.consumption_model          | string   | 消息消费模型，可能为 clustering/broadcasting，5.0 broadcasting 被废弃 |

### **快速开始**

在 OpenTelemetry 中有两种不同的方式可以为应用程序添加可观测信息：

- Automatic Instrumentation：无需编写任何代码，只需进行简单的配置即可自动生成可观测信息，包括应用程序中使用的类库和框架，这样可以更方便地获取基本的性能和行为数据。
- Manual Instrumentation：需要编写代码来创建和管理可观测数据，并通过 exporter 导出到指定的目标。这样可以更灵活自由地控制用户想要观测的逻辑和功能。

在 Java 类库中，前者是一种更为常见的使用形式。RocketMQ 5.0 客户端的 trace 也依托于 automatic instrumentation 进行实现。在 Java 程序中，automatic instrumentation 的表现形式为挂载 Java agent。在过去的一年里，我们将[基于  RocketMQ 5.0  客户端的  instrumentation](https://github.com/open-telemetry/opentelemetry-java-instrumentation/tree/main/instrumentation/rocketmq/rocketmq-client/rocketmq-client-5.0) 推入了 OpenTelemetry 官方社区。现在，只需要在 Java 程序运行时挂载上 OpenTelemetry agent，即可实现对应用程序透明的分布式全链路追踪。

除此之外，Automatic Instrumentation 和 Manual Instrumentation 并不冲突，Automatic Instrumentation 中所使用的关键对象会被注册成全局对象，在 Manual Instrumentation 的使用方式中也可以非常方便的获取。实现两个 Instrumentation 共用一套配置，非常灵活和方便。

首先准备好 RocketMQ 5.0 Java 客户端，可以参考 [example](https://github.com/apache/rocketmq-clients/tree/master/java/client/src/main/java/org/apache/rocketmq/client/java/example) 进行消息的收发。关于 RocketMQ 5.0 的更多细节，欢迎大家参考和关注 [rocketmq-clients  仓库](https://github.com/apache/rocketmq-clients) 和 [RocketMQ  官网](https://rocketmq.apache.org/)。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/200096/1678775471016-ddaa59be-0c21-419c-bd51-918ba88ac824.png#clientId=u05438468-4731-4&from=paste&height=268&id=ud5ac64df&originHeight=462&originWidth=1078&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ufe95e76a-af0c-4c24-8f7d-fdaced74fc4&title=&width=625)

然后准备好 OpenTelemetry agent jar，可以从 OpenTelemetry 官方[下载最新  agent](https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar)，在应用程序启动时增加 -javaagent:yourpath/opentelemetry-javaagent.jar 即可。可以通过设置 OTEL_EXPORTER_OTLP_ENDPOINT 环境变量来设置 OpenTelemetry collector 的接入点。

默认情况下，按照 OpenTelemetry 中关于 messaging 的规范，只有 send 和 process 的 span 会被启用，receive 的 span 是默认不启用的，如果想要启用 receive span，需要手动设置 -Dotel.instrumentation.messaging.experimental.receive-telemetry.enabled=true。

## **场景最佳实践**

目前，主流的云服务供应商都为 OpenTelemetry 提供了良好的支持，阿里云上的 SLS 和 ARMS 两款可观测产品都提供了基于 OpenTelemetry 的分布式全链路追踪服务。

为了更好地展示分布式全链路追踪的过程，这里提供了一个代码示例：[rocketmq-opentelemetry](https://github.com/aaron-ai/rocketmq-opentelemetry) 。在这个代码示例中，会启动三个不同的进程，涉及三种不同类库和业务逻辑之间的相互调用，展示了一个在分布式环境较复杂中间件之间进行交互的典型案例。
请求首先会从 gRPC 客户端发往 gRPC 服务端，在 gRPC 服务端收到请求之后，会向 RocketMQ 5.0 的 Producer 往服务端发送一条消息，然后再回复对应的 response 给客户端。在 RocketMQ 5.0 的 PushConsumer 接受到消息之后，会在 MessageListener 中使用 Apache HttpClient 往淘宝网发送一条 GET 请求。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/200096/1678775472062-88375d95-8629-4dd0-9ead-5d6453f3ad7f.png#clientId=u05438468-4731-4&from=paste&height=183&id=ueb3c0812&originHeight=252&originWidth=896&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ueb729332-f5b6-470f-8034-e8240c18953&title=&width=649)

示例代码调用链路

特别地，gRPC 客户端在发起具体的调用是在一个上游业务 span 的生命周期之内进行的，这个 span 我们称之为 ExampleUpstreamSpan，RocketMQ 5.0 PushConsumer 在收到消息之后，也会在 MessageListener 里执行其他的业务操作，也会有对应的 span，我们称之为 ExampleDownstreamSpan。那么默认在 receive span 没有启用的情况下，按照开始时间的顺序，会先后存在 7 个 span。分别是：

- ExampleUpstreamSpan。
- gRPC 客户端请求 span。
- gRPC 服务端响应 span。
- RocketMQ 5.0 Producer 的 send span。
- RocketMQ 5.0 Producer 的 process span。
- HTTP 请求 span。
- ExampleDownstreamSpan。

### **RocketMQ 5.0 对接 SLS Trace 服务**

首先在阿里云日志服务中创建 Trace 服务。然后获取接入点，项目和实例名称等信息，具体可以参考[使用  OpenTelemetry  接入  SLS Trace  服务](https://help.aliyun.com/document_detail/208894.html?spm=a2c4g.11186623.0.0.473f641cXr5AMo)。

在补充好信息之后完成接入之后，稍等一会就可以看到对应的 Trace 信息已经被上传到 SLS trace 服务中：

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/200096/1678775472069-37122401-90da-40cb-8e99-425ccddd0d99.png#clientId=u05438468-4731-4&from=paste&height=267&id=u0de97000&originHeight=1248&originWidth=3032&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ud9892440-94d8-4f78-aa96-322db9802dc&title=&width=649)

SLS Trace 服务分布式全链路展示

Trace 服务其实是将相关数据存储到日志中，因此这些数据也可以通过 SLS 的 SQL 语法查询得到。

通过 Trace 数据，我们可以很方便知道用户的操作系统环境，Java 版本等一系列基础信息。消息的发送延时，失败与否，消息是否准时投递到了客户端，以及客户端本地消费耗时，消费失败与否等一系列有效信息，可以帮助我们十分有效地进行问题排查。

除此之外，SLS Trace 服务的 demo 页也提供了基于 RocketMQ 5.0 定制的消息中间件大盘，生动展示了利用 Trace 数据得到的发送成功率，端到端延时等一系列指标。

- [消息中间件分析  Tab](https://sls4service.console.aliyun.com/lognext/trace/qs-demos/sls-mall?resource=/project/qs-demos/dashboard/dashboard-1678326718269-786886)：展示利用 Trace 数据得到的包括发送延时、发送成功率、消费成功率、端到端延时在内的一系列指标。
- [查看  RocketMQ Trace Tab](https://sls4service.console.aliyun.com/lognext/trace/qs-demos/sls-mall?resource=/project/qs-demos/dashboard/dashboard-1678679142159-569590)：可以根据上一步得到的差错长 message id 进行进一步的细粒度查询。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/200096/1678775472711-4590d186-5519-4d2d-8bb3-3c36502f9c40.png#clientId=u05438468-4731-4&from=paste&height=321&id=u910fec7c&originHeight=2436&originWidth=5064&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u7bdc2243-c28d-45df-a95a-ed08a50420e&title=&width=668)

消息中间件分析

### **RocketMQ 5.0 对接应用实时监控服务（ARMS）**

首先进入应用实时监控服务 ARMS 控制台，点击接入中心中的 OpenTelemetry，选择 java 应用程序下的自动探测，获取启动参数并修改至自己的 java 应用程序，具体可以参考[通过  OpenTelemetry  接入  ARMS](https://help.aliyun.com/document_detail/407604.html)。

配置好参数之后，启动自己的相关应用程序，稍等一会儿，就可以在 ARMS Trace Explorer 里看到对应的数据了。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/200096/1678775473024-fc094fd8-b434-4a9e-917e-0f379a1d4dd8.png#clientId=u05438468-4731-4&from=paste&id=u85651ea5&originHeight=1278&originWidth=4204&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=uf7462d14-4757-4ec1-af99-2772005b59a&title=)

Trace Explorer

还可以查看 span 之间的时序关系。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/200096/1678775473725-1a63bb6f-7294-4e5f-9d66-0581769597ca.png#clientId=u05438468-4731-4&from=paste&id=ue0e5b149&originHeight=928&originWidth=4012&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=uf608fe7d-2a61-48be-8fb1-6cad83ab996&title=)

ARMS Trace Explorer 分布式全链路追踪展示

具体地，可以点进每个 span 查看详细的 attributes/resources/events 等信息。除此之外，ARMS 还支持通过使用 OpenTelemetry Collector 转发的形式来收集应用程序的 Trace 数据。

## **趋势与思考**

随着现代应用程序架构的不断演进，可观测性的重要性日益凸显。它不仅可以帮助我们快速发现和解决系统中的问题，还提高应用程序的可靠性和性能，同时也是实现 DevOps 的关键部分。在相关领域，也陆续诞生了像 DataDog 和 Dynatrace 这样的明星公司。

近年来涌现了一些新兴技术，如 eBPF（Extended Berkeley Packet Filter）和 Service Mesh 也为可观测领域提供了一些新的思路：

eBPF 可以在内核层面运行，通过动态注入代码来监控系统的行为。它被广泛应用于实时网络和系统性能监控、安全审计和调试等任务，并且性能影响很小，未来也可以作为 continuous profiling 的一种选择。Service Mesh 则通过在应用程序之间注入代理层实现流量管理、安全和可观测性等功能。代理层可以收集和报告有关流量的各种指标和元数据，从而帮助我们了解系统中各个组件的行为和性能。

Service Mesh 中反映出的技术趋势很大一部分已经在 RocketMQ 5.0 proxy 中得到了应用，我们也在更多地将可观测指标往 proxy 进行收敛。当前的 Trace 链路未来也在考虑和服务端一起进行关联，并打造用户侧，运维侧，跨多应用的全方位链路追踪体系。除此之外还可以将 Trace 数据与 Metrics 数据通过 Exemplars 等技术进行联动。实现面到线，线到点的终极排查效果。

在可观测领域，RocketMQ 也在不断探索和摸索更加领先的可观测手段，以帮助开发者和客户更快更省心地发现系统中的隐患。

特别感谢阿里云 SLS 团队的千乘同学和 ARMS 团队的垆皓同学在接入过程提供的帮助和支持！

## **相关链接**

- RocketMQ 5.0 客户端：[https://github.com/apache/rocketmq-clients](https://github.com/apache/rocketmq-clients)
- OpenTelemetry Instrumentation for RocketMQ 5.0：[https://github.com/open-telemetry/opentelemetry-java-instrumentation/tree/main/instrumentation/rocketmq/rocketmq-client/rocketmq-client-5.0](https://github.com/open-telemetry/opentelemetry-java-instrumentation/tree/main/instrumentation/rocketmq/rocketmq-client/rocketmq-client-5.0)
- RocketMQ OpenTelemetry 示例：[https://github.com/aaron-ai/rocketmq-opentelemetry](https://github.com/aaron-ai/rocketmq-opentelemetry)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列 RocketMQ 5.0 版现开启活动：

1、新用户免费试用（2000TPS，1 个月），优惠金额 2000 元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85 折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
