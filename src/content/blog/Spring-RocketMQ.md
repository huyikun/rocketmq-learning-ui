---
title: "如何在 Spring 生态中玩转  RocketMQ？"
date: "2021/03/18"
author: ""
img: "https://img.alicdn.com/imgextra/i2/O1CN01vBZ27Z1dyHSwjweXq_!!6000000003804-0-tps-685-383.jpg"
description: " RocketMQ 作为业务消息的首选，在消息和流处理领域被广泛应用。而微服务生态 Spring 框架也是业务开发中最受欢迎的框架，两者的完美契合使得 RocketMQ 成为 Spring Messaging 实现中最受欢迎的消息实现。本文展示了 5 种在 Spring 生态中文玩转 RocketMQ 的方式，并描述了每个项目的特点和使用场景。"
tags: ["dynamic","home"]
---
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487210139-bdaac6d1-d772-4ca3-ab00-e609fa17e1e7.png#clientId=u18ef6ec0-1e83-4&from=paste&id=u79f352f0&originHeight=251&originWidth=1000&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u35be2d07-a5b6-481b-9b1e-c26ac28ed75&title=)
**在 Spring 生态中玩转 RocketMQ 系列教程现已登陆知行动手实验室，**[点击这里](https://start.aliyun.com/course?spm=a2ck6.17690074.0.0.503c31503dSfLf&id=hzidp9W1)**立即体验！**
移动端同学，需要在PC端登录 start.aliyun.com 进行体验。
RocketMQ 作为业务消息的首选，在消息和流处理领域被广泛应用。而微服务生态 Spring 框架也是业务开发中最受欢迎的框架，两者的完美契合使得 RocketMQ 成为 Spring Messaging 实现中最受欢迎的消息实现。本文展示了 5 种在 Spring 生态中文玩转 RocketMQ 的方式，并描述了每个项目的特点和使用场景。
# 一、前言
上世纪 90 年代末，随着 Java EE（Enterprise Edition）的出现，特别是 Enterprise Java Beans 的使用需要复杂的描述符配置和死板复杂的代码实现，增加了广大开发者的学习曲线和开发成本，由此基于简单的 XML 配置和普通 Java 对象（Plain Old Java Objects）的 Spring 技术应运而生，依赖注入（Dependency Injection），控制反转（Inversion of Control）和面向切面编程（AOP）的技术更加敏捷地解决了传统 Java 企业及版本的不足。随着 Spring 的持续演进，基于注解（Annotation）的配置逐渐取代了 XML 文件配置。除了依赖注入、控制翻转、AOP 这些技术，Spring 后续衍生出 AMQP、Transactional、Security、Batch、Data Access 等模块，涉及开发的各个领域。
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487210247-cb20e154-6628-4ecd-bbd7-1499055be0d5.png#clientId=u18ef6ec0-1e83-4&from=paste&id=u1b3e101e&originHeight=510&originWidth=671&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub2e23753-0f81-4b6c-9530-479138055c7&title=)
2014 年 4 月 1 日，Spring Boot 1.0.0 正式发布。它基于“约定大于配置”（Convention over configuration)这一理念来快速地开发，测试，运行和部署 Spring 应用，并能通过简单地与各种启动器(如spring-boot-web-starter)结合，让应用直接以命令行的方式运行，不需再部署到独立容器中。Spring Boot 的出现可以说是 Spring 框架的第二春，它不但简化了开发的流程，目前更是事实标准。下面这幅图可以看出相同功能的 Spring 和 Spring Boot 的代码实现对比。
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487212212-effab8b5-2512-4660-bf83-9eb1d9fed2c6.png#clientId=u18ef6ec0-1e83-4&from=paste&id=u137ee03a&originHeight=1125&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8a72012d-d5f7-473b-8c80-4d02a8d487f&title=)
Apache RocketMQ 是一款是业界知名的分布式消息和流处理中间件，它主要功能是消息分发、异步解耦、削峰填谷等。RocketMQ 是一款金融级消息及流数据平台，RocketMQ 在交易、支付链路上用的很多，主要是对消息链路质量要求非常高的场景，能够支持万亿级消息洪峰。RocketMQ 在业务消息中被广泛应用，并衍生出顺序消息、事务消息、延迟消息等匹配各类业务场景的特殊消息。
本文的主角就是 Spring 和 RocketMQ，那几乎每个 Java 程序员都会使用 Spring 框架与支持丰富业务场景的 RocketMQ 会碰撞出怎么样的火花？
# 二、RocketMQ 与 Spring 的碰撞
在介绍 RocketMQ 与 Spring 故事之前，不得不提到 Spring 中的两个关于消息的框架，Spring Messaging 和 Spring Cloud Stream。它们都能够与 Spring Boot 整合并提供了一些参考的实现。和所有的实现框架一样，消息框架的目的是实现轻量级的消息驱动的微服务，可以有效地简化开发人员对消息中间件的使用复杂度，让系统开发人员可以有更多的精力关注于核心业务逻辑的处理。
### 1. Spring Messaging
Spring Messaging 是 Spring Framework 4 中添加的模块，是 Spring 与消息系统集成的一个扩展性的支持。它实现了从基于 JmsTemplate 的简单的使用 JMS 接口到异步接收消息的一整套完整的基础架构，Spring AMQP 提供了该协议所要求的类似的功能集。在与 Spring Boot 的集成后，它拥有了自动配置能力，能够在测试和运行时与相应的消息传递系统进行集成。单纯对于客户端而言，Spring Messaging 提供了一套抽象的 API 或者说是约定的标准，对消息发送端和消息接收端的模式进行规定，比如消息 Messaging 对应的模型就包括一个消息体 Payload 和消息头 Header。不同的消息中间件提供商可以在这个模式下提供自己的 Spring 实现：在消息发送端需要实现的是一个 XXXTemplate 形式的 Java Bean，结合 Spring Boot 的自动化配置选项提供多个不同的发送消息方法；在消息的消费端是一个 XXXMessageListener 接口（实现方式通常会使用一个注解来声明一个消息驱动的 POJO），提供回调方法来监听和消费消息，这个接口同样可以使用 Spring Boot 的自动化选项和一些定制化的属性。
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487210086-f5bc83b8-1b76-41a9-b206-1b48a5788dc2.png#clientId=u18ef6ec0-1e83-4&from=paste&id=ucf1a3c91&originHeight=191&originWidth=238&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u914afc3b-338a-4383-9bb4-164144b3e3d&title=)
在 Apache RocketMQ 生态中，RocketMQ-Spring-Boot-Starter（下文简称 RocketMQ-Spring）就是一个支持 Spring Messaging API 标准的项目。该项目把 RocketMQ 的客户端使用 Spring Boot 的方式进行了封装，可以让用户通过简单的 annotation 和标准的 Spring Messaging API 编写代码来进行消息的发送和消费，也支持扩展出 RocketMQ 原生 API 来支持更加丰富的消息类型。在 RocketMQ-Spring 毕业初期，RocketMQ 社区同学请 Spring 社区的同学对 RocketMQ-Spring 代码进行 review，引出一段罗美琪（RocketMQ）和春波特（Spring Boot）故事的佳话[1]，著名 Spring 布道师 Josh Long 向国外同学介绍如何使用 RocketMQ-Spring 收发消息[2]。RocketMQ-Spring 也在短短两年时间超越 Spring-Kafka 和 Spring-AMQP（注:两者均由 Spring 社区维护），成为 Spring Messaging 生态中最活跃的消息项目。
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487210098-e8503c79-8b90-4947-8ba4-d837fc444055.png#clientId=u18ef6ec0-1e83-4&from=paste&id=uaede052b&originHeight=231&originWidth=746&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u34589660-c181-4228-a542-13d793059a1&title=)
### 2. Spring Cloud Stream
Spring Cloud Stream 结合了 Spring Integration 的注解和功能，它的应用模型如下：
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487212312-f586877f-011e-44de-b17f-084ee44fa859.png#clientId=u18ef6ec0-1e83-4&from=paste&id=ub160dc9b&originHeight=890&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u39561644-e51f-4d74-8bcb-73b399fa1fc&title=)
Spring Cloud Stream 框架中提供一个独立的应用内核，它通过输入(@Input)和输出(@Output)通道与外部世界进行通信，消息源端(Source)通过输入通道发送消息，消费目标端(Sink)通过监听输出通道来获取消费的消息。这些通道通过专用的 Binder 实现与外部代理连接。开发人员的代码只需要针对应用内核提供的固定的接口和注解方式进行编程，而不需要关心运行时具体的 Binder 绑定的消息中间件。
在运行时，Spring Cloud Stream 能够自动探测并使用在 classpath 下找到的 Binder。这样开发人员可以轻松地在相同的代码中使用不同类型的中间件：仅仅需要在构建时包含进不同的 Binder。在更加复杂的使用场景中，也可以在应用中打包多个 Binder 并让它自己选择 Binder，甚至在运行时为不同的通道使用不同的 Binder。 
Binder 抽象使得 Spring Cloud Stream 应用可以灵活的连接到中间件，加之 Spring Cloud Stream 使用利用了 Spring Boot 的灵活配置配置能力，这样的配置可以通过外部配置的属性和 Spring Boot 支持的任何形式来提供（包括应用启动参数、环境变量和 application.yml 或者 application.properties 文件），部署人员可以在运行时动态选择通道连接 destination（例如，RocketMQ 的 topic 或者 RabbitMQ 的 exchange）。
Spring Cloud Stream 屏蔽了底层消息中间件的实现细节，希望以统一的一套 API 来进行消息的发送/消费，底层消息中间件的实现细节由各消息中间件的 Binder 完成。Spring 官方实现了 Rabbit binder 和 Kafka Binder。Spring Cloud Alibaba 实现了 RocketMQ Binder[3]，其主要实现原理是把发送消息最终代理给了 RocketMQ-Spring 的 RocketMQTemplate，在消费端则内部会启动 RocketMQ-Spring Consumer Container 来接收消息。以此为基础，Spring Cloud Alibaba 还实现了 Spring Cloud Bus RocketMQ， 用户可以使用 RocketMQ 作为 Spring Cloud 体系内的消息总线，来连接分布式系统的所有节点。通过 Spring Cloud Stream RocketMQ Binder，RocketMQ 可以与 Spring Cloud 生态更好的结合。比如与 Spring Cloud Data Flow、Spring Cloud Funtion 结合，让 RocketMQ 可以在 Spring 流计算生态、Serverless(FaaS) 项目中被使用。
如今 Spring Cloud Stream RocketMQ Binder 和 Spring Cloud Bus RocketMQ 做为 Spring Cloud Alibaba 的实现已登陆 Spring 的官网[4]，Spring Cloud Alibaba 也成为 Spring Cloud 最活跃的实现。
# 三、如何在 Spring 生态中选择 RocketMQ 实现？
通过介绍 Spring 中的消息框架，介绍了以 RocketMQ 为基础与 Spring 消息框架结合的几个项目，主要是 RocketMQ-Spring、Spring Cloud Stream RocketMQ Binder、Spring Cloud Bus RocketMQ、Spring Data Flow 和 Spring Cloud Function。它们之间的关系可以如下图表示。
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487212362-67ef5995-537f-451b-8bf5-c33d02272109.png#clientId=u18ef6ec0-1e83-4&from=paste&id=u5350d2b1&originHeight=835&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua98492f4-981e-4940-9c32-31725b61772&title=)
如何在实际业务开发中选择相应项目进行使用？下面分别列出每个项目的特点和使用场景。
### 1. RocketMQ-Spring
**特点：**

- 作为起步依赖，简单引入一个包就能在 Spring 生态用到 RocketMQ 客户端的所有功能。
- 利用了大量自动配置和注解简化了编程模型，并且支持 Spring Messaging API。
- 与 RocketMQ 原生 Java SDK 的功能完全对齐。

**使用场景：**

- 适合在 Spring Boot 中使用 RocketMQ 的用户，希望能用到 RocketMQ 原生 java 客户端的所有功能，并通过 Spring 注解和自动配置简化编程模型。
### 2. Spring Cloud Stream RocketMQ Binder
**特点：**

- 屏蔽底层 MQ 实现细节，上层 Spring Cloud Stream 的 API 是统一的。如果想从 Kafka 切到 RocketMQ，直接改个配置即可。
- 与 Spring Cloud 生态整合更加方便。比如 Spring Cloud Data Flow，这上面的流计算都是基于 Spring Cloud Stream；Spring Cloud Bus 消息总线内部也是用的 Spring Cloud Stream。
- Spring Cloud Stream 提供的注解，编程体验都是非常棒。

**使用场景：**

- 在代码层面能完全屏蔽底层消息中间件的用户，并且希望能项目能更好的接入 Spring Cloud 生态（Spring Cloud Data Flow、Spring Cloud Funtcion 等）。
### 3. Spring Cloud Bus RocketMQ
**特点：**

- 将 RocketMQ 作为事件的“传输器”，通过发送事件（消息）到消息队列上，从而广播到订阅该事件（消息）的所有节点上，完成事件的分发和通知。

**使用场景：**

- 在 Spring 生态中希望用 RocketMQ 做消息总线的用户，可以用在应用间事件的通信，配置中心客户端刷新等场景。
### 4. Spring Cloud Data Flow
**特点：**

- 以 Source/Processor/Sink 组件进行流式任务处理。RocketMQ 作为流处理过程中的中间存储组件。

**使用场景：**

- 流处理，大数据处理场景。
### 5. Spring Cloud Function
**特点：**

- 消息的消费/生产/处理都是一次函数调用，融合 Java 生态的 Function 模型。

**使用场景：**

- Serverless 场景。

本文整体介绍了在 Spring 生态中接入 RockeMQ 的 5 种方法，让各位开发者对几种经典场景有宏观的了解。后续会有专栏详细介绍上述各个项目的具体使用方法和应用场景，真正地在 Spring 生态中玩转 RocketMQ！

---

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487213708-a35d5a42-878d-499d-a70b-1dc2deabd9eb.png#clientId=u18ef6ec0-1e83-4&from=paste&id=u8c098d8f&originHeight=251&originWidth=1000&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u65af362c-65d2-42ff-b873-de762db24a3&title=)
**在 Spring 生态中玩转 RocketMQ 系列教程现已登陆知行动手实验室，**[点击这里](https://start.aliyun.com/course?spm=a2ck6.17690074.0.0.503c31503dSfLf&id=hzidp9W1)**立即体验！**
移动端同学，需要在PC端登录 start.aliyun.com 进行体验。
相关链接：
[1] [https://www.infoq.cn/article/G-og5V8x3BK8i4z90y6P](https://www.infoq.cn/article/G-og5V8x3BK8i4z90y6P)
[2] [https://spring.io/blog/2020/02/25/spring-tips-apache-rocketmq](https://spring.io/blog/2020/02/25/spring-tips-apache-rocketmq)
[3] [https://github.com/alibaba/spring-cloud-alibaba/wiki/RocketMQ](https://github.com/alibaba/spring-cloud-alibaba/wiki/RocketMQ)
[4] [https://spring.io/projects/spring-cloud-alibaba](https://spring.io/projects/spring-cloud-alibaba)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)

