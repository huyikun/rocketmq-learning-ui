---
title: "使用  rocketmq-spring-boot-starter 来配置、发送和消费 RocketMQ 消息"
author: "辽天"
date: "2021/04/22"
img: "https://img.alicdn.com/imgextra/i3/O1CN01amydvQ1WOpV8A8UEo_!!6000000002779-0-tps-685-383.jpg"
tags: ["explore"]
description: "本文将 rocktmq-spring-boot 的设计实现做一个简单的介绍，读者可以通过本文了解将 RocketMQ Client 端集成为 spring-boot-starter 框架的开发细节，然后通过一个简单的示例来一步一步的讲解如何使用这个 spring-boot-starter 工具包来配置，发送和消费 RocketMQ 消息。"
---
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487565749-0f14a70a-b9ce-4cd3-8d28-4ca61b3cc232.png#clientId=u85f6412e-2d24-4&from=paste&id=u3fb53a9a&originHeight=523&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u3cea0133-c097-4ae7-ae03-fa6e2cfcb4f&title=)

**导读**：本文将 rocktmq-spring-boot 的设计实现做一个简单的介绍，读者可以通过本文了解将 RocketMQ Client 端集成为 spring-boot-starter 框架的开发细节，然后通过一个简单的示例来一步一步的讲解如何使用这个 spring-boot-starter 工具包来配置，发送和消费 RocketMQ 消息。
在 Spring 生态中玩转 RocketMQ 系列文章：

- [《如何在 Spring 生态中玩转 RocketMQ？》](http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247502546&idx=1&sn=ed1bc0ef63fb3c6ef17e2db43b532671&chksm=fae6c11dcd91480b20cd87473aab17df87a39577cc001751e948ad061982256a85556bd8cecf&scene=21#wechat_redirect)
- [《罗美琪和春波特的故事...》](http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247504338&idx=1&sn=1953910b4ce73bc5de63ee469f825e29&chksm=fae6da1dcd91530b335e04d6ba263d054a440f861615d9435aa9332c327721d69d7c87e4687a&scene=21#wechat_redirect)
- [《RocketMQ-Spring 毕业两周年，为什么能成为 Spring 生态中最受欢迎的 messaging 实现？》](http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247500442&idx=1&sn=277a29dab2c75fc97e6726bf23355f71&chksm=fae6c955cd914043940059a0c7c700893cca4e56eed098e9cfb7e956bd8827856ee7a85c5427&scene=21#wechat_redirect)

本文配套可交互教程已登录阿里云知行动手实验室，PC 端登录[start.aliyun.com](https://developer.aliyun.com/article/start.aliyun.com) 在浏览器中立即体验。
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487565661-75ee4220-7599-49ff-9f9c-7a9557a48ce5.png#clientId=u85f6412e-2d24-4&from=paste&id=u97335b2b&originHeight=251&originWidth=999&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf20d1e47-fb36-4580-a756-e9eabacbcf3&title=)
通过本文，您将了解到：

- Spring 的消息框架介绍
- rocketmq-spring-boot 具体实现
- 使用示例
# 前言
上世纪 90 年代末，随着 Java EE(Enterprise Edition) 的出现，特别是 Enterprise Java Beans 的使用需要复杂的描述符配置和死板复杂的代码实现，增加了广大开发者的学习曲线和开发成本，由此基于简单的 XML 配置和普通 Java 对象（Plain Old Java Objects）的 Spring 技术应运而生，依赖注入（Dependency Injection）, 控制反转（Inversion of Control）和面向切面编程（AOP）的技术更加敏捷地解决了传统 Java 企业及版本的不足。
随着 Spring 的持续演进，基于注解（Annotation）的配置逐渐取代了 XML 文件配置，2014 年 4 月 1 日，Spring Boot 1.0.0 正式发布，它基于“约定大于配置”（Convention over configuration）这一理念来快速地开发、测试、运行和部署 Spring 应用，并能通过简单地与各种启动器（如 spring-boot-web-starter）结合，让应用直接以命令行的方式运行，不需再部署到独立容器中。这种简便直接快速构建和开发应用的过程，可以使用约定的配置并且简化部署，受到越来越多的开发者的欢迎。
Apache RocketMQ 是业界知名的分布式消息和流处理中间件，简单地理解，它由 Broker 服务器和客户端两部分组成：
其中客户端一个是消息发布者客户端（Producer），它负责向 Broker 服务器发送消息；另外一个是消息的消费者客户端（Consumer），多个消费者可以组成一个消费组，来订阅和拉取消费 Broker 服务器上存储的消息。
为了利用 Spring Boot 的快速开发和让用户能够更灵活地使用 RocketMQ 消息客户端，Apache RocketMQ 社区推出了 spring-boot-starter 实现。随着分布式事务消息功能在 RocketMQ 4.3.0 版本的发布，近期升级了相关的 spring-boot 代码，通过注解方式支持分布式事务的回查和事务消息的发送。
本文将对当前的设计实现做一个简单的介绍，读者可以通过本文了解将 RocketMQ Client 端集成为 spring-boot-starter 框架的开发细节，然后通过一个简单的示例来一步一步的讲解如何使用这个 spring-boot-starter 工具包来配置，发送和消费 RocketMQ 消息。
# Spring 中的消息框架
顺便在这里讨论一下在 Spring 中关于消息的两个主要的框架，即 Spring Messaging 和 Spring Cloud Stream。它们都能够与 Spring Boot 整合并提供了一些参考的实现。和所有的实现框架一样，消息框架的目的是实现轻量级的消息驱动的微服务，可以有效地简化开发人员对消息中间件的使用复杂度，让系统开发人员可以有更多的精力关注于核心业务逻辑的处理。
## 1. Spring Messaging
Spring Messaging 是 Spring Framework 4 中添加的模块，是 Spring 与消息系统集成的一个扩展性的支持。它实现了从基于 JmsTemplate 的简单的使用 JMS 接口到异步接收消息的一整套完整的基础架构，Spring AMQP 提供了该协议所要求的类似的功能集。在与 Spring Boot 的集成后，它拥有了自动配置能力，能够在测试和运行时与相应的消息传递系统进行集成。
单纯对于客户端而言，Spring Messaging 提供了一套抽象的 API 或者说是约定的标准，对消息发送端和消息接收端的模式进行规定，不同的消息中间件提供商可以在这个模式下提供自己的 Spring 实现：在消息发送端需要实现的是一个 XXXTemplate 形式的 Java Bean，结合 Spring Boot 的自动化配置选项提供多个不同的发送消息方法；在消息的消费端是一个 XXXMessageListener 接口（实现方式通常会使用一个注解来声明一个消息驱动的 POJO），提供回调方法来监听和消费消息，这个接口同样可以使用 Spring Boot 的自动化选项和一些定制化的属性。
如果有兴趣深入的了解 Spring Messaging 及针对不同的消息产品的使用，推荐阅读这个文件。参考 Spring Messaging 的既有实现，RocketMQ 的 spring-boot-starter 中遵循了相关的设计模式并结合 RocketMQ 自身的功能特点提供了相应的 API（如顺序、异步和事务半消息等)。
## 2. Spring Cloud Stream
Spring Cloud Stream 结合了 Spring Integration 的注解和功能，它的应用模型如下：
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680487567022-09b7349f-0277-4192-84f3-3ca147c974b2.jpeg#clientId=u85f6412e-2d24-4&from=paste&id=u661e6c8d&originHeight=416&originWidth=511&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua0194347-858a-4901-a9a6-f44a888b5de&title=)
该图片引自 spring cloud stream
Spring Cloud Stream 框架中提供一个独立的应用内核，它通过输入（@Input）和输出（@Output）通道与外部世界进行通信，消息源端（Source）通过输入通道发送消息，消费目标端（Sink）通过监听输出通道来获取消费的消息。这些通道通过专用的 Binder 实现与外部代理连接。开发人员的代码只需要针对应用内核提供的固定的接口和注解方式进行编程，而不需要关心运行时具体的 Binder 绑定的消息中间件。在运行时，Spring Cloud Stream 能够自动探测并使用在 classpath 下找到的Binder。
这样开发人员可以轻松地在相同的代码中使用不同类型的中间件：仅仅需要在构建时包含进不同的 Binder。在更加复杂的使用场景中，也可以在应用中打包多个 Binder 并让它自己选择 Binder，甚至在运行时为不同的通道使用不同的 Binder。
Binder 抽象使得 Spring Cloud Stream 应用可以灵活的连接到中间件，加之 Spring Cloud Stream 使用利用了 Spring Boot 的灵活配置配置能力，这样的配置可以通过外部配置的属性和 Spring Boot 支持的任何形式来提供（包括应用启动参数、环境变量和 application.yml 或者 application.properties 文件），部署人员可以在运行时动态选择通道连接 destination（例如，Kafka 的 topic 或者 RabbitMQ 的 exchange）。
Binder SPI 的方式来让消息中间件产品使用可扩展的 API 来编写相应的 Binder，并集成到 Spring Cloud Steam 环境，目前 RocketMQ 还没有提供相关的 Binder，我们计划在下一步将完善这一功能，也希望社区里有这方面经验的同学积极尝试，贡献 PR 或建议。
# spring-boot-starter的实现
在开始的时候我们已经知道，spring boot starter 构造的启动器对于使用者是非常方便的，使用者只要在 pom.xml引入starter 的依赖定义，相应的编译，运行和部署功能就全部自动引入。因此常用的开源组件都会为 Spring 的用户提供一个 spring-boot-starter 封装给开发者，让开发者非常方便集成和使用，这里我们详细的介绍一下 RocketMQ（客户端）的 starter 实现过程。
## 1. spring-boot-starter 的实现步骤
对于一个 spring-boot-starter 实现需要包含如下几个部分：
### **1）在 pom.xml 的定义**

- 定义最终要生成的 starter 组件信息

    <groupId>org.apache.rocketmq</groupId>
    <artifactId>spring-boot-starter-rocketmq</artifactId>
    <version>1.0.0-SNAPSHOT</version>


- 定义依赖包

它分为两个部分：Spring 自身的依赖包和 RocketMQ 的依赖包。
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487565100-24705719-b552-42b3-ad67-039f77477837.png#clientId=u85f6412e-2d24-4&from=paste&id=u66e7951a&originHeight=783&originWidth=820&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uef0da1e5-56c9-4d26-96f9-24171d9fd49&title=)
### **2）配置文件类**
定义应用属性配置文件类 RocketMQProperties，这个 Bean 定义一组默认的属性值。用户在使用最终的 starter 时，可以根据这个类定义的属性来修改取值，当然不是直接修改这个类的配置，而是 spring-boot 应用中对应的配置文件：src/main/resources/application.properties。
### **3）定义自动加载类**
定义 src/resources/META-INF/spring.factories 文件中的自动加载类， 其目的是让 spring boot 更具文中中所指定的自动化配置类来自动初始化相关的 Bean、Component 或 Service，它的内容如下：

    org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
    org.apache.rocketmq.spring.starter.RocketMQAutoConfiguration

在 RocketMQAutoConfiguration 类的具体实现中，定义开放给用户直接使用的 Bean 对象包括：

- RocketMQProperties 加载应用属性配置文件的处理类；
- RocketMQTemplate 发送端用户发送消息的发送模板类；
- ListenerContainerConfiguration 容器 Bean 负责发现和注册消费端消费实现接口类，这个类要求：由 @RocketMQMessageListener 注解标注；实现 RocketMQListener 泛化接口。
### **4）最后具体地进行 RpcketMQ 相关的封装**
在发送端（producer）和消费端（consumer）客户端分别进行封装，在当前的实现版本提供了对 Spring Messaging 接口的兼容方式。
## 2. 消息发送端实现
### **1）普通发送端**
发送端的代码封装在 RocketMQTemplate POJO 中，下图是发送端的相关代码的调用关系图：
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487565082-1e336031-2969-4ed8-845a-62fe5b977178.png#clientId=u85f6412e-2d24-4&from=paste&id=u108ff501&originHeight=409&originWidth=903&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub3fc4a2e-f802-4bf3-94a0-6b0f732986b&title=)
为了与 Spring Messaging 的发送模板兼容，在 RocketMQTemplate 集成了 AbstractMessageSendingTemplate 抽象类，来支持相关的消息转换和发送方法，这些方法最终会代理给 doSend() 方法、doSend() 以及 RocoketMQ 所特有的一些方法如异步，单向和顺序等方法直接添加到 RoketMQTempalte 中，这些方法直接代理调用到 RocketMQ 的 Producer API 来进行消息的发送。
### **2）事务消息发送端**
对于事务消息的处理，在消息发送端进行了部分的扩展，参考上面的调用关系类图。
RocketMQTemplate 里加入了一个发送事务消息的方法 sendMessageInTransaction()，并且最终这个方法会代理到 RocketMQ 的 TransactionProducer 进行调用，在这个 Producer 上会注册其关联的 TransactionListener 实现类，以便在发送消息后能够对 TransactionListener 里的方法实现进行调用。
## 3. 消息消费端实现
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487567335-a2e6b0c9-391d-45b0-921c-8b8bd929d632.png#clientId=u85f6412e-2d24-4&from=paste&id=ucdd19fed&originHeight=351&originWidth=918&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue921b666-8027-40f7-8766-115e5e48835&title=)
在消费端 Spring-Boot 应用启动后，会扫描所有包含 @RocketMQMessageListener 注解的类（这些类需要集成 RocketMQListener 接口，并实现 onMessage()方法），这个 Listener 会一对一的被放置到。
DefaultRocketMQListenerContainer 容器对象中，容器对象会根据消费的方式（并发或顺序），将 RocketMQListener 封装到具体的 RocketMQ 内部的并发或者顺序接口实现。在容器中创建 RocketMQ Consumer 对象，启动并监听定制的 Topic 消息，如果有消费消息，则回调到 Listener 的 onMessage() 方法。
# 使用示例
上面的一章介绍了 RocketMQ 在 spring-boot-starter 方式的实现，这里通过一个最简单的消息发送和消费的例子来介绍如何使这个 rocketmq-spring-boot-starter。
## 1. RocketMQ 服务端的准备
### **1）启动 NameServer 和 Broker**
要验证 RocketMQ 的 Spring-Boot 客户端，首先要确保 RocketMQ 服务正确的下载并启动。可以参考 RocketMQ 主站的快速开始来进行操作。确保启动 NameServer 和 Broker 已经正确启动。
### **2）创建实例中所需要的 Topics**
在执行启动命令的目录下执行下面的命令行操作：

    bash bin/mqadmin updateTopic -c DefaultCluster -t string-topic

## 2. 编译 rocketmq-spring-boot-starter
目前的 spring-boot-starter 依赖还没有提交的 Maven 的中心库，用户使用前需要自行下载 git 源码，然后执行 mvn clean install 安装到本地仓库。

    git clone https://github.com/apache/rocketmq-externals.git
    cd rocketmq-spring-boot-starter
    mvn clean install

## 3. 编写客户端代码
用户如果使用它，需要在消息的发布和消费客户端的 maven 配置文件 pom.xml 中添加如下的依赖：
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487567339-5dfc96bf-ee7a-437c-aef8-849fc140df37.png#clientId=u85f6412e-2d24-4&from=paste&id=u078a6ad7&originHeight=182&originWidth=1069&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u06fb5430-8c44-4f94-a647-a364faf6c9a&title=)
属性 spring-boot-starter-rocketmq-version 的取值为：1.0.0-SNAPSHOT， 这与上一步骤中执行安装到本地仓库的版本一致。
### **1）消息发送端的代码**
发送端的配置文件 application.properties：
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487567427-41028f31-e4ac-4f59-bd72-8be22a6f531f.png#clientId=u85f6412e-2d24-4&from=paste&id=ucf181358&originHeight=173&originWidth=850&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ueed8b99d-1d0c-4265-92c0-3b44bf8497d&title=)
发送端的 Java 代码：
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487567752-8eacf16f-65ca-4a1d-ad9c-0ef4b690d51b.png#clientId=u85f6412e-2d24-4&from=paste&id=u56f7eafb&originHeight=598&originWidth=841&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub9a8f680-a12d-491f-93f1-66dbc1312c8&title=)
### **2）消息消费端代码**
消费端的配置文件 application.properties：
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487567751-fb3bac86-b807-4285-a851-151aa49f6383.png#clientId=u85f6412e-2d24-4&from=paste&id=u1d79e8db&originHeight=170&originWidth=866&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u22923d63-4c81-4857-ae5b-4f7a5608e24&title=)
消费端的 Java 代码：
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487567968-de06ee1b-b853-4aeb-b8ba-502eca716b5e.png#clientId=u85f6412e-2d24-4&from=paste&id=u8e767bff&originHeight=401&originWidth=1192&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7a4cb2db-f7f9-470d-b0c7-37c42258d97&title=)
这里只是简单的介绍了使用 spring-boot 来编写最基本的消息发送和接收的代码，如果需要了解更多的调用方式，如: 异步发送，对象消息体，指定 tag 标签以及指定事务消息，请参看 github 的说明文档和详细的代码。我们后续还会对这些高级功能进行陆续的介绍。
### **作者简介**
**辽天**，阿里巴巴技术专家，Apache RocketMQ 内核控，拥有多年分布式系统研发经验，对 Microservice、Messaging 和 Storage 等领域有深刻理解， 目前专注 RocketMQ 内核优化以及 Messaging 生态建设。
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487568005-4045c1c9-e13b-4db4-a4bb-4c07f0867eed.png#clientId=u85f6412e-2d24-4&from=paste&id=uc2e8d44a&originHeight=251&originWidth=999&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ubfca7509-e174-4368-a833-7dcf85aed72&title=)
**在 PC 端登录 start.aliyun.com 知行动手实验室，沉浸式体验在线交互教程。**

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
