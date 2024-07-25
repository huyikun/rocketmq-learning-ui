---
title: "RocketMQ 多语言 SDK  开源贡献召集令"
date: "2022/12/27"
author: "艾阳坤"
img: "https://img.alicdn.com/imgextra/i2/O1CN01LfuVSm1sSsY6kzXI1_!!6000000005766-0-tps-685-383.jpg"
tags: ["dynamic"]
description: "我们欢迎任何形式的贡献，包括且不限于新 feature、bugfix、代码优化、生态集成、测试工作、文档撰写。更加欢迎能够认领一个完整的特定语言实现的同学！不要犹豫，欢迎大家以 issue/pull request 的形式将你的想法反馈到社区，一起来建设更好的 RocketMQ！"
---

目前 **Apache RocketMQ 5.0 SDK** **[****1]**正在社区开源，开发与迭代也在火热进行中，欢迎广大社区的朋友们能够参与其中。我们欢迎任何形式的贡献，包括但不限于新 feature、bugfix、代码优化、生态集成、测试工作、文档撰写。更加欢迎能够认领一个完整的特定语言实现的同学，踏出第一步，你就是 contributor！更有惊喜礼品和成为 committer 的机会等着你！

## 写在前面

Apache RocketMQ 是由阿里巴巴集团捐赠给 Apache 开源基金会的一款低延迟、高并发、高可用、高可靠的分布式消息中间件，并于 2017 年正式从 Apache 社区毕业，成为 Apache 顶级项目（TLP）。也是国内首个非 Hadoop 生态体系的互联网中间件顶级项目。

面向过去，RocketMQ 经过多年淘宝双十一的洗礼和考验，赢得了诸多客户的认可和青睐。面向未来，RocketMQ 历久弥新，为了更好地迎接云原生时代的来临，基于存算分离架构的 RocketMQ 5.0 应运而生。

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501766574-9f3ffcc9-07e1-43e4-83a7-dd44a5bdc5fb.png#clientId=u490b8bc6-eac1-4&height=602&id=SgZhh&name=1.png&originHeight=602&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ufbff2449-8026-4aa5-8d0e-7c563e48d13&title=&width=1080)

RocketMQ 5.0 中引入了全新的无状态 Proxy 组件，在水平拓展，故障应急，多协议等方面都进行了诸多支持与改进（关于 RocketMQ 5.0 的详细介绍，欢迎关注 **Rocketmq 官网[2]**）。同时也为接下来多语言客户端的实现打下了良好基础。

## 新的多语言SDK

RocketMQ 5.0 客户端相比较于 4.x 的版本进行了诸多改进，会是未来社区客户端演进的主流方向。RocketMQ 4.x SDK 的多语言支持并不完美，协议的较高复杂度和语言绑定的实现细节使得多语言的支持与维护都变得棘手，而用户对多语言的诉求是强烈的。值此契机，RocketMQ 5.0 基于 gRPC 正式推出了全新的多语言 SDK。

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501766579-d3a040da-bb6b-4219-8b05-09b847197291.png#clientId=u490b8bc6-eac1-4&height=1019&id=lNCm4&name=2.png&originHeight=1019&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf3c89db2-66b7-4d2e-87e2-d009412d300&title=&width=1080)

相比较于 RocketMQ 4.x 的 SDK。RocketMQ 5.0 展现出了一副全新的面貌：

- 采用全新极简的，immutable 的 API 设计，使得 API 上手更简单，跨语言的对齐也变得更加简单；
- 完善的错误处理体系和错误码设计，开发者和用户对错误的处理可以更加得心应手；
- 在 PushConsumer/PullConsumer 之外新推出无状态 SimpleConsumer，实现逻辑轻量，用户可以自行管理消费侧消息的接收与应答，同时也对有更多定制化需求的客户提供了便利。
- 实现轻量化，代码量相比较旧有实现缩减 3/4 以上，开发和维护的成本更低；
- 标准化的 logging/tracing/metrics 输出，降低实现复杂度的同时，可观测性的提升会使得生产环境下的问题更容易被捕捉；

gRPC 多语言特性，为 RocketMQ 5.0 客户端的多语言实现提供了支撑。RocketMQ 全新的客户端的协议层被替换，语言无关的 IDL 使得协议的维护和实现都更为极为简单。同时得益于 gRPC 强大的生态体系，使得 RocketMQ 与周边的集成也变得更为简便。

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501768314-8df54f36-5acc-4803-9cc0-c200ab6fd8fd.png#clientId=u490b8bc6-eac1-4&height=564&id=hiC3I&name=3.png&originHeight=564&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u56b8fd88-7da4-444a-97bb-e739c97599f&title=&width=1080)

RocketMQ 5.0 中引入了新的的 pop 消费，创造性地在原生的队列模型之上支持了这种无状态的消费模式。不同于原始的更适用于流场景的队列模型，pop 机制更面向于业务消息的场景，使得开发者和用户可以只关心消息本身，可以通过「SimpleConsumer」提供单条消息级别的接受/重试/修改不可见时间以及删除等 API 能力。

## Roadmap

目前 5.0 多语言 SDK 的 Java/C++ 已经有了相对比较完整的实现。

Go/C# 已经提供了基础的 Producer/SimpleConsumer 的实现，其余的语言实现（PHP/Python/JavaScript/Rust 等）还在社区进行中，欢迎大家广泛参与。

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501766482-ac9afa9e-074c-4464-ad67-88a726a1f99d.png#clientId=u490b8bc6-eac1-4&height=609&id=GGuu7&name=4.png&originHeight=609&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2bc69d0a-e733-41ba-abcc-2195290abf1&title=&width=1080)

对于一个从零开始的特定语言实现，一个大概的步骤如下：

- 部署 **rocketmq-namesrv****[****3]**和 **rocketmq-proxy[4] **方便与客户端进行调试，为降低部署成本，rocketmq-proxy 可以采用 LOCAL 模式进行部署。
- 熟悉 rocketmq-apis中的 IDL，适配新的 gRPC/Protobuf 协议：IDL 中描述了 5.0 SDK 中的语言无关的协议描述，通过 gRPC protoc 工具自动生成协议层代码。
- 应用新的 API 规范和设计：可以参考 **Java 的 API 设计[5]**，总体指导思想是不可变性且行为明确。
- 实现 Producer/SimpleConsumer：Producer 提供最基本的四种不同类型消息的发送功能（普通/顺序/定时/事务），SimpleConsumer 提供基于 pop 语义的无状态消息接受/重试/修改不可见时间等能力。
- 统一的错误处理体系：由服务端产生的异常与错误均有完善的异常错误码和异常信息，各个语言实现需要以最适合的方式暴露给客户。
- 实现 PushConsumer：RocketMQ 4.x 中最为常用的消费者类型，用户侧只需要明确订阅关系和定义消息监听器行为即可，客户端实现中需要自动帮用户从远端获取消息。
- 客户端全方位可观测性：规范的日志输出，实现基于 OpenTelemetry/OpenCensus 的客户端 metrics 体系。

按照以上流程开发者在开发过程中出现的任何问题，都欢迎以 issue/pull request 的形式反馈到社区。

## 如何参与贡献

我们欢迎任何形式的贡献，包括且不限于新 feature、bugfix、代码优化、生态集成、测试工作、文档撰写。更加欢迎能够认领一个完整的特定语言实现的同学！不要犹豫，欢迎大家以 issue/pull request 的形式将你的想法反馈到社区，一起来建设更好的 RocketMQ！

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501766529-00ef3975-97df-4df4-9f98-03b91a299644.png#clientId=u490b8bc6-eac1-4&height=1465&id=J2ern&name=5.png&originHeight=1465&originWidth=828&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ucef82587-3aab-4666-a3bd-d940fb28061&title=&width=828)

## 相关资料


rocketmq-clients: RocketMQ 5.0 多语言客户端实现
[_https://github.com/apache/rocketmq-clients_](https://github.com/apache/rocketmq-clients)

rocketmq: RocketMQ 主仓库（内置 5.0 proxy 实现）
[_https://github.com/apache/rocketmq_](https://github.com/apache/rocketmq)

rocketmq-apis: RocketMQ 5.0 协议具体定义
[_https://github.com/apache/rocketmq-apis_](https://github.com/apache/rocketmq-apis)

《RIP-37: RocketMQ 全新统一 API 设计》
[_https://shimo.im/docs/m5kv92OeRRU8olqX_](https://shimo.im/docs/m5kv92OeRRU8olqX)

《RIP-39: RocketMQ gRPC 协议支持》
[_https://shimo.im/docs/gXqmeEPYgdUw5bqo_](https://shimo.im/docs/gXqmeEPYgdUw5bqo)

## 相关链接

[1] Apache RocketMQ 5.0 SDK
[_https://github.com/apache/rocketmq-clients_](https://github.com/apache/rocketmq-clients)

[2] rocketmq 官网
[_https://rocketmq.apache.org/docs/_](https://rocketmq.apache.org/docs/)

[3] rocketmq-namesrv
[_https://github.com/apache/rocketmq/tree/develop/namesrv_](https://github.com/apache/rocketmq/tree/develop/namesrv)

[4] rocketmq-proxy
[_https://github.com/apache/rocketmq/tree/develop/proxy_](https://github.com/apache/rocketmq/tree/develop/proxy)

[5] Java 的 API 设计
[_https://github.com/apache/rocketmq-clients/tree/master/java/client-apis_](https://github.com/apache/rocketmq-clients/tree/master/java/client-apis)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)