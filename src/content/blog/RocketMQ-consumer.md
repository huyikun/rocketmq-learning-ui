---
title: "RocketMQ  的消费者类型详解与最佳实践"
date: "2022/11/25"
author: "凌楚"
img: "https://img.alicdn.com/imgextra/i3/O1CN01a5ozcs1QZvP1YzjsP_!!6000000001991-0-tps-685-383.jpg"
tags: ["practice"]
description: "在 RocketMQ 5.0 中，更加强调了客户端类型的概念，尤其是消费者类型。为了满足多样的 RocketMQ 中一共有三种不同的消费者类型，分别是 PushConsumer、SimpleConsumer 和 PullConsumer。不同的消费者类型对应着不同的业务场景。"
---

在 RocketMQ 5.0 中，更加强调了客户端类型的概念，尤其是消费者类型。为了满足多样的 RocketMQ 中一共有三种不同的消费者类型，分别是 PushConsumer、SimpleConsumer 和 PullConsumer。不同的消费者类型对应着不同的业务场景。

## 消费者类型概览

本篇文章也会根据不同的消费者类型来进行讲述。在介绍不同的消息类型之前，先明确一下不同 RocketMQ 消费者中的一个通用工作流程：在消费者中，到达客户端的消息都是由客户端主动向服务端请求并挂起长轮询获得的。为了保证消息到达的及时性，客户端需要不断地向服务端发起请求（请求是否需要由客户端主动发起则与具体的客户端类型有关），而新的符合条件的消息一旦到达服务端，就会客户端请求走。最终根据客户端处理的结果不同，服务端对消息的处理结果进行记录。

![图片 1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501414016-00c5a230-71d4-45af-980a-9069a02bdcfd.png#clientId=u59381ef7-019b-4&height=381&id=F0ctB&name=%E5%9B%BE%E7%89%87%201.png&originHeight=381&originWidth=958&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0f5ef084-a897-4072-8429-5f84a010b0c&title=&width=958)

另外 **PushConsumer **和** SimpleConsumer **中还会有一个 ConsumerGroup 的概念，ConsumerGroup 相当于是一组相同订阅关系的消费者的共同身份标识。而服务端也会根据 ConsumerGroup 来记录对应的消费进度。同一个 ConsumerGroup 下的消息消费者将共同消费符合当前订阅组要求的所有消息，而不是独立进行消费。相比较于 **PullConsumer**，**PushConsumer **和** SimpleConsumer **更加适用于业务集成的场景，由服务端来托管消费状态和进度，相对来说更加的轻量与简单。

简单来说：

- **PushConsumer ：**全托管的消费者类型，用户只需要注册消息监听器即可，符合对应订阅关系的消息就会调用对应的消费方法，是与业务集成最为普遍的消费者类型。

- **SimpleConsumer：**解耦消息消费与进度同步的消费者类型，用户自主接受来自服务端的消息，并对单条消息进行消息确认。和 PushConsumer 一样也由服务端托管消费进度，适用于用户需要自主控制消费速率的业务场景。

- **PullConsumer：**使用流处理框架进行管理的消费者类型，用户按照队列（Topic 的最小逻辑组成单位）来进行消息的接收并可以选择自动或者手动提交消费位点。

## PushConsumer

PushConsumer 是 RocketMQ 目前使用最为广泛的消费者。用户只需要确认好订阅关系之后，注册相对应的 Listener 即可。符合对应订阅关系的消息在由 Producer 发出后，消费者的 Listener 接口也会被即时调用，那么此时用户需要在 Listener 中去实现对应的业务逻辑。

### 使用简介

以下是 Push 消费者的使用示例：
      
      
      PushConsumer pushConsumer = provider.newPushConsumerBuilder()
       .setClientConfiguration(clientConfiguration)
          // set the consumer group name.
          .setConsumerGroup(consumerGroup)
          // set the subscription for the consumer.
          .setSubscriptionExpressions(Collections.singletonMap(topic, filterExpression))
          .setMessageListener(messageView -> {
              // handle the received message and return consume result.
              LOGGER.info("consume message={}", messageView);
              return ConsumeResult.SUCCESS;
          })
          .build();
      // block the main thread, no need for production environment.
      Thread.sleep(Long.MAX_VALUE);
      // close the push consumer when you don't need it anymore.
      pushConsumer.close();
      
      
用户需要根据自己业务处理结果的不同来返回 ConsumeResult.SUCCESS或者 ConsumeResult.FAILURE。当用户返回 ConsumeResult.SUCCESS时，消息则被视为消费成功；当用户返回 ConsumeResult.FAILURE时，则服务端视为消费失败，会进行该条消息的退避重试，消息的退避重试是指，在消息被消费成功之前，当前消息会被多次投递到用户注册的 MessageListener 中直到消费成功，而两次消费之间的时间间隔则是符合退避规律的。

特别的，每个 ConsumerGroup 都会有一个最大消费次数的设置，如果当前消息的消费次数超过了这个设置，则消息不会再被投递，转而被投递进入死信队列。这个消费次数在消息每次被投递到 MessageListener 时都会进行自增。譬如：如果消息的最大消费次数为 1，那么无论对于这条消息，当前是被返回消费成功还是消费失败，都只会被消费这一次。

### 应用场景与最佳实践

PushConsumer 是一种近乎全托管的消费者，这里的托管的含义在于用户本身并不需要关心消息的接收，而只需要关注消息的消费过程，除此之外的所有逻辑都在 Push 消费者的实现中封装掉了，用户只需要根据每条收到的消息返回不同的消费结果即可，因此也是最为普适的消费者类型。

MessageListener 是针对单条消息设计的监听器接口：
      
   
      /**
      * MessageListener is used only for the push consumer to process message consumption synchronously.
       *
       * <p> Refer to {@link PushConsumer}, push consumer will get message from server and dispatch the message to the
       * backend thread pool to consumer message concurrently.
       */
      public interface MessageListener {
          /**
           * The callback interface to consume the message.
           *
           * <p>You should process the {@link MessageView} and return the corresponding {@link ConsumeResult}.
           * The consumption is successful only when {@link ConsumeResult#SUCCESS } is returned, null pointer is returned
           * or exception is thrown would cause message consumption failure too.
           */
          ConsumeResult consume(MessageView messageView);
      }
    
      
绝大多数场景下，使用方应该快速处理消费逻辑并返回消费成功，不宜长时间阻塞消费逻辑。对于消费逻辑比较重的情形，建议可以先行提交消费状态，然后对消息进行异步处理。

实际在 Push 消费者的实现中，为了保证消息消费的及时性，消息是会被预先拉取客户端再进行后续的消费的，因此在客户端中存在对已拉取消息大小的缓存。为了防止缓存的消息过多导致客户端内存泄漏，也提前预留了客户端参数供使用者自行进行设置。


// 设置本地最大缓存消息数目为 16 条
pushConsumer.setMaxCachedMessageCount(16);
// 设置本地最大缓存消息占用内存大小为 128 MB
pushConsumer.setMaxCachedMessageSizeInBytes(128 * 1024 * 1024);


## SimpleConsumer

相比较** PushConsumer**，**SimpleConsumer** 则暴露了更多的细节给使用者。在** SimpleConsumer** 中，用户将自行控制消息的接收与处理。

### 使用简介

以下是** SimpleConsumer **的使用示例：
      
      
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
      Duration invisibleDuration = Duration.ofSeconds(15);
      final List<MessageView> messages = consumer.receive(maxMessageNum, invisibleDuration);
      LOGGER.info("Received {} message(s)", messages.size());
      for (MessageView message : messages) {
          final MessageId messageId = message.getMessageId();
          try {
              consumer.ack(message);
              LOGGER.info("Message is acknowledged successfully, messageId={}", messageId);
          } catch (Throwable t) {
              LOGGER.error("Message is failed to be acknowledged, messageId={}", messageId, t);
          }
      }
      // Close the simple consumer when you don't need it anymore.
      consumer.close();
      
      
在 **SimpleConsumer** 中用户需要自行进行消息的拉取，这一动作通过 SimpleConsumer#receive 这个接口进行，然后再根据自己业务逻辑处理结果的不同再对拉取到的消息进行不同的处理。SimpleConsumer#receive 也是通过长轮询来接受来自服务端的消息，具体的长轮询时间可以使用 SimpleConsumerBuilder#setAwaitDuration 来进行设置。

在 **SimpleConsumer** 中，用户需要通过 SimpleConsumer#receive 设置一个消息不重复的时间窗口（或者说关于通过这个接口收到的消息的一个不可见时间窗口），这个时间窗口从用户接受到这条消息开始计时，在这段时间之内消息是不会重复投递到消费者的，而超出这个时间窗口之后，则会对这条消息进行再一次的投递。在这个过程中，消息的消费次数也会进行递增。与 **PushConsumer** 类似的是，一旦消费次数超出 ConsumerGroup 的最大次数，也就不会进行重投了。

![图片 2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501413860-cb78f33d-ee10-48cf-8f97-dd2a91817b54.png#clientId=u59381ef7-019b-4&height=306&id=xhNZh&name=%E5%9B%BE%E7%89%87%202.png&originHeight=306&originWidth=958&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u971fdcde-7cae-4ecf-bb52-8bfa93937fb&title=&width=958)

相比较于** PushConsumer** 而言，**SimpleConsumer** 用户可以自主控制接受消息的节奏。SimpleConsumer#receive 会针对于当前的订阅关系去服务端拉取符合条件的消息。**SimpleConsumer** 实际上的每次消息接收请求是按照具体 Topic 的分区来 one by one 发起请求的，实际的 Topic 分区可能会比较多，因此为了保证消息接收的及时性，建议综合自己的业务处理能力一定程度上提高 SimpleConsumer#receive 的并发度。

用户在接受到消息之后，可以选择对消息使用 ack 或者 changeInvisibleDuration，前者即对服务端表示对这条消息的确认，与 **PushConsumer** 中的消费成功类似，而 changeInvisibleDuration 则表示延迟当前消息的可见时间，即需要服务端在当前一段时间之后再向客户端进行投递。值得注意的是，这里消息的再次投递也是需要遵循 ConsumerGroup 的最大消费次数的限制，即一旦消息的最大消费次数超出了最大消费次数（每次消息到达可见时间都会进行消费次数的自增），则不再进行投递，转而进入死信队列。举例来说：

- 进行 ack，即表示消息消费成功被确认，消费进度被服务端同步。

- 进行 changeInvisibleDuration，

1）如果消息已经超过当前 ConsumerGroup 的最大消费次数，那么消息后续会被投递进入死信队列

2）如果消息未超过当前 ConsumerGroup 的最大消费次数，若请求在上一次消息可见时间到来之前发起，则修改成功，否则则修改失败。

### 应用场景与最佳实践

在 **PushConsumer** 中，消息是单条地被投递进入 MessageListener来处理的，而在 **SimpleConsumer** 中用户可以同时拿到一批消息，每批消息的最大条数也由 SimpleConsumer#receive 来决定。在一些 IO 密集型的应用中，会是一个更加方便的选择。此时用户可以每次拿到一批消息并集中进行处理从而提高消费速度。

## PullConsumer


**PullConsumer** 也是 RocketMQ 一直以来都支持的消费者类型，RocketMQ 5.0 中全新的 **PullConsumer API** 还在演进中，敬请期待。下文中的 **PullConsumer** 会使用 4.0 中现存的 LitePullConsumer 进行论述，也是当前推荐的方式。

### 使用简介

现存的 LitePullConsumer 中的主要接口
      
   
      // PullConsumer 中的主要接口
      public interface LitePullConsumer {
       // 注册路由变化监听器
      void registerTopicMessageQueueChangeListener(String topic,
              TopicMessageQueueChangeListener topicMessageQueueChangeListener) throws MQClientException;
          // 将队列 assign 给当前消费者
          void assign(Collection<MessageQueue> messageQueues);
          // 针对当前 assigned 的队列获取消息
          List<MessageExt> poll(long timeout);
          // 查找当前队列在服务端提交的位点
          Long committed(MessageQueue messageQueue) throws MQClientException;
          // 设置是否自动提交队列位点
          void setAutoCommit(boolean autoCommit);
          // 同步提交队列位点
          void commitSync();
      }
      

在 RocketMQ 中，无论是消息的发送还是接收，都是通过队列来进行的，一个 Topic 由若干个队列组成，消息本身也是按照队列的形式来一个个进行存储的，同一个队列中的消息拥有不同的位点，且位点的大小是随随消息达到服务端的时间逐次递增的，本质上不同 ConsumerGroup 在服务端的消费进度就是一个个队列中的位点信息，客户端将自己的消费进度同步给服务端本质上其实就是在同步一个个消息的位点。
![图片 3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501415607-212317db-f29a-4d4e-9ba2-8ad8ac863804.png#clientId=u59381ef7-019b-4&height=458&id=WleOO&name=%E5%9B%BE%E7%89%87%203.png&originHeight=458&originWidth=883&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u37144154-7666-4db9-bc56-b1225088def&title=&width=883)

在 PullConsumer 中将队列这个概念完整地暴露给了用户。用户可以针对自己关心的 topic 设置路由监听器从而感知队列的变化，并将队列 assign 给当前消费者，当用户使用 LitePullConsumer#poll 时会尝试获取已经 assign 好了的队列中的消息。如果设置了 LitePullConsumer#setAutoCommit 的话，一旦消息达到了客户端就会自动进行位点的提交，否则则需要使用 LitePullConsumer#commitSync 接口来进行手动提交。

### 应用场景与最佳实践

**PullConsumer** 中用户拥有对消息位点管理的绝对自主权，可以自行管理消费进度，这是与 PushConsumer 和 SimpleConsumer 最为本质的不同，这也使得 PullConsumer 在流计算这种需要同时自主控制消费速率和消费进度的场景能得到非常广泛的应用。更多情况下，PullConsumer 是与具体的流计算框架进行集成的。

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
