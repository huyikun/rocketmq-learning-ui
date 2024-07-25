---
title: "解析 RocketMQ  业务消息--顺序消息"
date: "2022/08/18"
author: "绍舒"
img: "https://img.alicdn.com/imgextra/i1/O1CN01cmNvVx26TFUSKmdmq_!!6000000007662-0-tps-685-383.jpg"
tags: ["explore"]
description: "本篇将继续业务消息集成的场景，从功能原理、应用案例、最佳实践以及实战等角度介绍 RocketMQ 的顺序消息功能。"
---
## 引言

Apache RocketMQ 诞生至今，历经十余年大规模业务稳定性打磨，服务了阿里集团内部业务以及阿里云数以万计的企业客户。作为金融级可靠的业务消息方案，RocketMQ 从创建之初就一直专注于业务集成领域的异步通信能力构建。本篇将继续业务消息集成的场景，从功能原理、应用案例、最佳实践以及实战等角度介绍 RocketMQ 的顺序消息功能。

## 简介


顺序消息是消息队列 RocketMQ 版提供的一种对消息发送和消费顺序有严格要求的消息。对于一个指定的 Topic，同一 MessageGroup 的消息按照严格的先进先出（FIFO）原则进行发布和消费，即先发布的消息先消费，后发布的消息后消费，服务端严格按照发送顺序进行存储、消费。同一 MessageGroup 的消息保证顺序，不同 MessageGroup 之间的消息顺序不做要求，因此需做到两点，发送的顺序性和消费的顺序性。

![1.jpeg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680492932420-5ab4067f-3e79-4130-8cf4-08ce587deade.jpeg#clientId=uda4f2307-3453-4&height=119&id=zuIoa&name=1.jpeg&originHeight=159&originWidth=718&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u73abd44f-71d3-48ef-944e-1d5425b90f8&title=&width=539)

## 功能原理


在这里首先抛出一个问题，在日常的接触中，许多 RocketMQ 使用者会认为，既然顺序消息能在普通消息的基础上实现顺序，看起来就是普通消息的加强版，那么为什么不全部都使用顺序消息呢？接下来就会围绕这个问题，对比普通消息和顺序消息进行阐述。

### 顺序发送

在分布式环境下，保证消息的全局顺序性是十分困难的，例如两个 RocketMQ Producer A 与 Producer B，它们在没有沟通的情况下各自向 RocketMQ 服务端发送消息 a 和消息 b，由于分布式系统的限制，我们无法保证 a 和 b 的顺序。因此业界消息系统通常保证的是分区的顺序性，即保证带有同一属性的消息的顺序，我们将该属性称之为 MessageGroup。如图所示，ProducerA 发送了 MessageGroup 属性为 A 的两条消息 A1，A2 和 MessageGroup 属性为 B 的 B1，B2，而 ProducerB 发送了 MessageGroup 属性为 C 的两条属性 C1，C2。

![2.jpeg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680492932398-a647f435-9f10-4e9d-8a7f-62efe56613ec.jpeg#clientId=uda4f2307-3453-4&height=98&id=ayDTB&name=2.jpeg&originHeight=196&originWidth=718&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u12080fd9-84f5-457a-9c80-7851e8f4769&title=&width=359)

同时，对于同一 MessageGroup，为了保证其发送顺序的先后性，比较简单的做法是构造一个单线程的场景，即不同的 MessageGroup 由不同的 Producer 负责，并且对于每一个 Producer 而言，顺序消息是同步发送的。同步发送的好处是显而易见的，在客户端得到上一条消息的发送结果后再发送下一条，即能准确保证发送顺序，若使用异步发送或多线程则很难保证这一点。 

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492934184-5f2a9b90-2426-4029-a39f-8a2b9ef2e6ef.png#clientId=uda4f2307-3453-4&height=150&id=yB3qe&name=3.png&originHeight=300&originWidth=696&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud6d9a58f-a7ef-4bfa-abc2-07213798661&title=&width=348)

因此可以看到，虽然在底层原理上，顺序消息发送和普通消息发送并无二异，但是为了保证顺序消息的发送顺序性，同步发送的方式相比较普通消息，实际上降低了消息的最大吞吐。

### 顺序消费

与顺序消息不同的是，普通消息的消费实际上没有任何限制，消费者拉取的消息是被异步、并发消费的，而顺序消息，需要保证对于同一个 MessageGroup，同一时刻只有一个客户端在消费消息，并且在该条消息被确认消费完成之前（或者进入死信队列），消费者无法消费同一 MessageGroup 的下一条消息，否则消费的顺序性将得不到保证。因此这里存在着一个消费瓶颈，该瓶颈取决于用户自身的业务处理逻辑。极端情况下当某一 MessageGroup 的消息过多时，就可能导致消费堆积。当然也需要明确的是，这里的语境都指的是同一 MessageGroup，不同 MessageGroup 的消息之间并不存在顺序性的关联，是可以进行并发消费的。因此全文中提到的顺序实际上是一种偏序。

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492932328-80b42467-77ca-4564-8557-de7e04742b78.png#clientId=uda4f2307-3453-4&height=134&id=GVP9V&name=4.png&originHeight=268&originWidth=790&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua801e7e3-f369-4944-aea7-b960b6a4f47&title=&width=395)

### 小结

无论对于发送还是消费，我们通过 MessageGroup 的方式将消息分组，即并发的基本单元是 MessageGroup，不同的 MessageGroup 可以并发的发送和消费，从而一定程度具备了可拓展性，支持多队列存储、水平拆分、并发消费，且不受影响。回顾普通消息，站在顺序消息的视角，可以认为普通消息的并发基本单元是单条消息，即每条消息均拥有不同的 MessageGroup。

我们回到开头那个问题：

> 既然顺序消息能在普通消息的基础上实现顺序，看起来就是普通消息的加强版，那么为什么不全部都使用顺序消息呢？


现在大家对于这个问题可能有一个基本的印象了，消息的顺序性当然很好，但是为了实现顺序性也是有代价的。

下述是一个表格，简要对比了顺序消息和普通消息。

![5.jpeg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680492932308-55f5fc20-b393-4865-97c3-ed8fe1ed5d7f.jpeg#clientId=uda4f2307-3453-4&height=375&id=VD4it&name=5.jpeg&originHeight=500&originWidth=612&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u265744b0-c380-4418-b928-b42fb92da5c&title=&width=459)

## 最佳实践


### 合理设置 MessageGroup

MessageGroup 会有很多错误的选择，以某电商平台为例，某电商平台将商家 ID 作为 MessageGroup，因为部分规模较大的商家会产出较多订单，由于下游消费能力的限制，因此这部分商家所对应的订单就发生了严重的堆积。正确的做法应当是将订单号作为 MessageGroup，而且站在背后的业务逻辑上来说，同一订单才有顺序性的要求。即选择 MessageGroup 的最佳实践是：MessageGroup 生命周期最好较为短暂，且不同 MessageGroup 的数量应当尽量相同且均匀。

### 同步发送和发送重试

如之前章节所述，需使用同步发送和发送重试来保证发送的顺序性。

### 消费幂等

消息传输链路在异常场景下会有少量重复，业务消费是需要做消费幂等，避免重复处理带来的风险。

## 应用案例



- 用户注册需要发送验证码，以用户 ID 作为 MessageGroup，那么同一个用户发送的消息都会按照发布的先后顺序来消费。
 
- 电商的订单创建，以订单 ID 作为 MessageGroup，那么同一个订单相关的创建订单消息、订单支付消息、订单退款消息、订单物流消息都会按照发布的先后顺序来消费。
 

![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492934431-500164ed-dabc-4aba-a4b4-24b592753f66.png#clientId=uda4f2307-3453-4&height=450&id=C1ge4&name=6.png&originHeight=450&originWidth=843&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u40aafa84-5b6b-41f2-a466-73dc92e64a3&title=&width=843)

## 实战


### 发送

可以看到，该发送案例设置了 MessageGroup 并且使用了同步发送，发送的代码如下：


    public class ProducerFifoMessageExample {
        private static final Logger LOGGER = LoggerFactory.getLogger(ProducerFifoMessageExample.class);

        private ProducerFifoMessageExample() {
        }

        public static void main(String[] args) throws ClientException, IOException {
            final ClientServiceProvider provider = ClientServiceProvider.loadService();

            // Credential provider is optional for client configuration.
            String accessKey = "yourAccessKey";
            String secretKey = "yourSecretKey";
            SessionCredentialsProvider sessionCredentialsProvider =
                new StaticSessionCredentialsProvider(accessKey, secretKey);

            String endpoints = "foobar.com:8080";
            ClientConfiguration clientConfiguration = ClientConfiguration.newBuilder()
                .setEndpoints(endpoints)
                .setCredentialProvider(sessionCredentialsProvider)
                .build();
            String topic = "yourFifoTopic";
            final Producer producer = provider.newProducerBuilder()
                .setClientConfiguration(clientConfiguration)
                // Set the topic name(s), which is optional. It makes producer could prefetch the topic route before 
                // message publishing.
                .setTopics(topic)
                // May throw {@link ClientException} if the producer is not initialized.
                .build();
            // Define your message body.
            byte[] body = "This is a FIFO message for Apache RocketMQ".getBytes(StandardCharsets.UTF_8);
            String tag = "yourMessageTagA";
            final Message message = provider.newMessageBuilder()
                // Set topic for the current message.
                .setTopic(topic)
                // Message secondary classifier of message besides topic.
                .setTag(tag)
                // Key(s) of the message, another way to mark message besides message id.
                .setKeys("yourMessageKey-1ff69ada8e0e")
                // Message group decides the message delivery order.
                .setMessageGroup("youMessageGroup0")
                .setBody(body)
                .build();
            try {
                final SendReceipt sendReceipt = producer.send(message);
                LOGGER.info("Send message successfully, messageId={}", sendReceipt.getMessageId());
            } catch (Throwable t) {
                LOGGER.error("Failed to send message", t);
            }
            // Close the producer when you don't need it anymore.
            producer.close();
        }
    }


### 消费

消费的代码如下：


    public class SimpleConsumerExample {
        private static final Logger LOGGER = LoggerFactory.getLogger(SimpleConsumerExample.class);

        private SimpleConsumerExample() {
        }

        public static void main(String[] args) throws ClientException, IOException {
            final ClientServiceProvider provider = ClientServiceProvider.loadService();

            // Credential provider is optional for client configuration.
            String accessKey = "yourAccessKey";
            String secretKey = "yourSecretKey";
            SessionCredentialsProvider sessionCredentialsProvider =
                new StaticSessionCredentialsProvider(accessKey, secretKey);

            String endpoints = "foobar.com:8080";
            ClientConfiguration clientConfiguration = ClientConfiguration.newBuilder()
                .setEndpoints(endpoints)
                .setCredentialProvider(sessionCredentialsProvider)
                .build();
            String consumerGroup = "yourConsumerGroup";
            Duration awaitDuration = Duration.ofSeconds(30);
            String tag = "yourMessageTagA";
            String topic = "yourTopic";
            FilterExpression filterExpression = new FilterExpression(tag, FilterExpressionType.TAG);
            SimpleConsumer consumer = provider.newSimpleConsumerBuilder()
                .setClientConfiguration(clientConfiguration)
                // Set the consumer group name.
                .setConsumerGroup(consumerGroup)
                // set await duration for long-polling.
                .setAwaitDuration(awaitDuration)
                // Set the subscription for the consumer.
                .setSubscriptionExpressions(Collections.singletonMap(topic, filterExpression))
                .build();
            // Max message num for each long polling.
            int maxMessageNum = 16;
            // Set message invisible duration after it is received.
            Duration invisibleDuration = Duration.ofSeconds(5);
            final List<MessageView> messages = consumer.receive(maxMessageNum, invisibleDuration);
            for (MessageView message : messages) {
                try {
                    consumer.ack(message);
                } catch (Throwable t) {
                    LOGGER.error("Failed to acknowledge message, messageId={}", message.getMessageId(), t);
                }
            }
            // Close the simple consumer when you don't need it anymore.
            consumer.close();
        }
    }


# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
