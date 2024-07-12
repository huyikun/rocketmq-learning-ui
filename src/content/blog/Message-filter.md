---
title: "解析 RocketMQ  多样消费功能-消息过滤"
date: "2022/10/20"
author: "徒钟"
img: "https://img.alicdn.com/imgextra/i4/O1CN01VGWlAI22sf0BVh6Fy_!!6000000007176-0-tps-685-383.jpg"
tags: ["explore"]
description: "在消息中间件的使用过程中，一个主题对应的消费者想要通过规则只消费这个主题下具备某些特征的消息，过滤掉自己不关心的消息，这个功能就叫消息过滤。"
---

## 什么是消息过滤


在消息中间件的使用过程中，一个主题对应的消费者想要通过规则只消费这个主题下具备某些特征的消息，过滤掉自己不关心的消息，这个功能就叫消息过滤。

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500707650-b3063936-286f-4de4-a1fa-68b6db7cf8f9.png#clientId=uf1e4bd52-62c0-4&height=344&id=qwedE&name=1.png&originHeight=344&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u119ed94d-78c3-4b8f-aa5b-219f910a094&title=&width=1080)

就如上图所描述的，生产者会向主题中写入形形色色的消息，有橙色的、黄色的、还有灰色的，而这个主题有两个消费者，第一个消费者只想要消费橙色的消息，第二个消费者只想要消费黄色的和灰色的消息，那么这个效果就需要通过消息过滤来实现。

## 消息过滤的应用场景


我们以常见的电商场景为例，来看看消息过滤在实际应用过程中起到的作用。

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500707750-6aba9f45-c1de-48c6-ba25-94e34a35070a.png#clientId=uf1e4bd52-62c0-4&height=691&id=KM2y6&name=2.png&originHeight=691&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5a33cf43-ef65-477d-b6eb-2b8bda3895e&title=&width=1080)

电商平台在设计时，往往存在系统拆分细、功能模块多、调用链路长、系统依赖复杂等特点，消息中间件在其中就起到了异步解耦、异步通信的作用，特别是在双十一这样的流量高峰期，消息中间件还起到了削峰填谷的作用。

而在消息中间件使用方面，电商平台因为覆盖的领域众多会产生很多的消息主题，消息收发量也随着交易量和订阅系统的增加而增大。随着业务系统的水平拆解和垂直增加，相关的消息呈现出高订阅比和低投递比的状态，比如一个主题订阅比是 300:1，即 1 个主题的订阅者有 300 个，但是投递比却只有 15:300，即一条消息只有 15 个订阅者需要投递，其他 285 个订阅者全部过滤了这条消息。那解决这些场景，就需要使用到消息过滤。

举例来说，在交易链路中，一个订单的处理流程分为下单、扣减库存、支付等流程，这个流程会涉及订单操作和状态机的变化。下游的系统，如积分、物流、通知、实时计算等，他们会通过消息中间件监听订单的变更消息。但是它们对订单不同操作和状态的消息有着不同的需求，如积分系统只关心下单消息，只要下单就扣减积分。物流系统只关系支付和收货消息，支付就发起物流订单，收货就完成物流订单。实时计算系统会统计订单不同状态的数据，所有消息都要接收。

试想一下如果没有消息过滤这个功能，我们会怎么支持以上消息过滤的功能呢？能想到的一般有以下两个方案：

### 1. 通过将主题进行拆分，将不同的消息发送到不同主题上。

对于生产者来说，这意味着消费者有多少消费场景，就需要新建多少个 Topic，这无疑会给生产者带来巨大的维护成本。对消费者来说，消费者有可能需要同时订阅多个 Topic，这同样带来了很大的维护成本。另外，消息被主题拆分后，他们之间的消费顺序就无法保证了，比如对于一个订单，它的下单、支付等操作显然是要被顺序处理的。

### 2. 消费者收到消息后，根据消息体对消息按照规则硬编码自行过滤。

这意味着所有的消息都会推送到消费者端进行计算，这无疑增加了网络带宽，也增加了消费者在内存和 CPU 上的消耗。

有了消息过滤这个功能，生产者只需向一个主题进行投递消息，服务端根据订阅规则进行计算，并按需投递给每个消费者。这样对生产者和消费者的代码维护就非常友好，同时也能很大程度上降低网络带宽，同时减少消费者的内存占用和 CPU 的消耗。

## RocketMQ 消息过滤的模式


RocketMQ 是众多消息中间件中为数不多支持消息过滤的系统。这也是其作为业务集成消息首选方案的重要基础之一。

在功能层面，RocketMQ 支持两种过滤方式，Tag 标签过滤和 SQL 属性过滤，下面我来这两个过滤方式使用方式和技术原理进行介绍

### Tag 标签过滤

- **功能介绍**

Tag 标签过滤方式是 RocketMQ 提供的基础消息过滤能力，基于生产者为消息设置的 Tag 标签进行匹配。生产者在发送消息时，设置消息的 Tag 标签，消费者按需指定已有的 Tag 标签来进行匹配订阅。

- **过滤语法**

1. 单 Tag 匹配：过滤表达式为目标 Tag，表示只有消息标签为指定目标 Tag 的消息符合匹配条件，会被发送给消费者；

2. 多 Tag 匹配：多个 Tag 之间为或的关系，不同 Tag 间使用两个竖线（||）隔开。例如，Tag1||Tag2||Tag3，表示标签为 Tag1 或 Tag2 或 Tag3 的消息都满足匹配条件，都会被发送给消费者进行消费；

3. 全 Tag 匹配：使用星号（*）作为全匹配表达式。表示主题下的所有消息都将被发送给消费者进行消费。

- **使用方式**

1. 发送消息，设置 Tag 标签


    Message message = provider.newMessageBuilder()
        .setTopic("TopicA")
        .setKeys("messageKey")
        //设置消息Tag，用于消费端根据指定Tag过滤消息
        .setTag("TagA")
        .setBody("messageBody".getBytes())
        .build();


2. 订阅消息，匹配单个 Tag 标签


    //只订阅消息标签为“TagA”的消息
    FilterExpression filterExpression = new FilterExpression("TagA", FilterExpressionType.TAG);
    pushConsumer.subscribe("TopicA", filterExpression);


3. 订阅消息，匹配多个 Tag 标签


    //只订阅消息标签为“TagA”、“TagB”或“TagC”的消息
    FilterExpression filterExpression = new FilterExpression("TagA||TagB||TagC", FilterExpressionType.TAG);
    pushConsumer.subscribe("TopicA", filterExpression);


4. 订阅消息，匹配所有 Tag 标签，即不过滤


    //使用Tag标签过滤消息，订阅所有消息
    FilterExpression filterExpression = new FilterExpression("*", FilterExpressionType.TAG);
    pushConsumer.subscribe("TopicA", filterExpression);


- **技术原理**

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500709366-fc57e2b7-a324-40ef-ab26-36a523bd003a.png#clientId=uf1e4bd52-62c0-4&height=551&id=U4mtt&name=3.png&originHeight=551&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6d876282-a243-4d63-9684-cdfe1102998&title=&width=1080)

RocketMQ 在存储消息的时候，是通过 Append-Only 的方式将所有主题的消息都写在同一个 CommitLog 文件中，这可以有效的提升了消息的写入速率。为了消费时能够快速检索消息，它会在后台启动异步方式将消息所在位点、消息的大小，以及消息的标签哈希值存储到 ConsumeQueue 索引文件中。将标签存储到这个索引文件中，就是为了在通过标签进行消息过滤的时候，可以在索引层面就可以获取到消息的标签，不需要从 CommitLog 文件中读取，这样就减少消息读取产生的系统 IO 和内存开销。标签存储哈希值，主要是为了保证 ConsumeQueue 索引文件能够定长处理，这样可以有效较少存储空间，提升这个索引文件的读取效率。

整个 Tag 标签过滤的流程如下：

1. 生产者对消息打上自己的业务标签，发送给我们的服务端 Broker；
2. Broker 将消息写入 CommitLog 中，然后通过异步线程将消息分发到 ConsumeQueue 索引文件中；
3. 消费者启动后，定时向 Broker 发送心跳请求，将订阅关系上传到 Broker 端，Broker 将订阅关系及标签的哈希值保存在内存中；
4. 消费者向 Broker 拉取消息，Broker 会通过订阅关系和队列去 ConsumeQueue 中检索消息，将订阅关系中的标签哈希值和消息中的标签哈希值做比较，如果匹配就返回给消费者；
5. 消费者收到消息后，会将消息中的标签值和本地订阅关系中标签值做精确匹配，匹配成功才会交给消费线程进行消费。

### SQL 属性过滤

- **功能介绍**

SQL 属性过滤是 RocketMQ 提供的高级消息过滤方式，通过生产者为消息设置的属性（Key）及属性值（Value）进行匹配。生产者在发送消息时可设置多个属性，消费者订阅时可设置S QL 语法的过滤表达式过滤多个属性。

- **过滤语法**

1. 数值比较：>, >=, <, <=, BETWEEN, =

2. 字符比较：=, <>, IN

3. 判空运算：IS NULL or IS NOT NULL

4. 逻辑运算：AND, OR, NOT

- **使用方式**

1. 发送消息，设置属性


    Message message = provider.newMessageBuilder()
        .setTopic("TopicA")
        .setKeys("messageKey")
        //设置消息属性，用于消费端根据指定属性过滤消息。
        .addProperty("Channel", "TaoBao")
        .addProperty("Price", "5999")
        .setBody("messageBody".getBytes())
        .build();


2. 订阅消息，匹配单个属性


    FilterExpression filterExpression = new FilterExpression("Channel='TaoBao'", FilterExpressionType.SQL92);
    pushConsumer.subscribe("TopicA", filterExpression);


3. 订阅消息，匹配多个属性


    FilterExpression filterExpression = new FilterExpression("Channel='TaoBao' AND Price>5000", FilterExpressionType.SQL92);
    pushConsumer.subscribe("TopicA", filterExpression);


4. 订阅消息，匹配所有属性


    FilterExpression filterExpression = new FilterExpression("True", FilterExpressionType.SQL92);
    pushConsumer.subscribe("TopicA", filterExpression);


- **技术原理**
** **

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500707487-9c5f0c5c-4f7c-4848-a141-7338bd7cc258.png#clientId=uf1e4bd52-62c0-4&height=542&id=HUwPi&name=4.png&originHeight=542&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u18e72149-2cb7-4423-89dd-af170046486&title=&width=1080)

由于 SQL 过滤需要将消息的属性和 SQL 表达式进行匹配，这会对服务端的内存和 CPU 增加很大的开销。为了降低这个开销，RocketMQ 采用了布隆过滤器进行优化。当 Broker 在收到消息后，会预先对所有的订阅者进行 SQL 匹配，并将匹配结果生成布隆过滤器的位图存储在 ConsumeQueueExt 索引扩展文件中。在消费时，Broker 就会使用使用这个过滤位图，通过布隆过滤器对消费者的 SQL 进行过滤，这可以避免消息在一定不匹配的时候，不需要去 CommitLog 中将消息的属性拉取到内存进行计算，可以有效地降低属性和 SQL 进行匹配的消息量，减少服务端的内存和 CPU 开销。

整个 SQL 过滤的处理流程如下：

1. 消费者通过心跳上传订阅关系，Broker 判断如果是 SQL 过滤，就会通过布隆过滤器的算法，生成这个 SQL 对应的布隆过滤匹配参数； 
2. 生产者对消息设置上自己的业务属性，发送给我们的服务端 Broker； 
3. Broker 收到后将消息写入 CommitLog 中，然后通过异步线程将消息分发到 ConsumeQueue 索引文件中。在写入之前，会将这条消息的属性和当前所有订阅关系中 SQL 进行匹配，如果通过，则将 SQL 对应的布隆过滤匹配参数合并成一个完整的布隆过滤位图； 
4. 消费者消费消息的时候，Broker 会先获取预先生成的布隆过滤匹配参数，然后通过布隆过滤器对 ConsumeQueueExt 的布隆过滤位图和消费者的布隆过滤匹配参数进行匹配； 
5. 布隆过滤器返回匹配成功只能说明消息属性和 SQL 可能匹配，Broker 还需要从 CommitLog 中将消息属性取出来，再做一次和 SQL 的精确匹配，这个时候匹配成功才会将消息投递给消费者 

### 差异及对比

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500707519-a29e25dc-82a5-4fce-847e-e4ed0db412a8.png#clientId=uf1e4bd52-62c0-4&height=568&id=mMeoY&name=5.png&originHeight=568&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u26c60fb3-51ad-4d00-8c80-57ca453964b&title=&width=1080)

## 最佳实践


### 主题划分及消息定义

主题和消息背后的本质其实就是业务实体的属性、行为或状态发生了变化。只有发生了变化，生产者才会往主题里面发送消息，消费者才需要监听这些的消息，去完成自身的业务逻辑。

那么如何做好主题划分和消息定义呢，我们以订单实体为例，来看看主题划分和消息定义的原则。

![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500709992-0a43b3fd-3402-4f89-a7aa-b8f2ee6557c5.png#clientId=uf1e4bd52-62c0-4&height=733&id=TJJmr&name=6.png&originHeight=733&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u53958556-6c7e-4a7d-8b5c-56b981c4b17&title=&width=1080)

- **主题划分的原则**
** **

1. 业务领域是否一致

不同的业务领域背后有不同的业务实体，其属性、行为及状态的定义天差地别。比如商品和订单，他们属于两个完全独立且不同的领域，就不能定义成同一个主题。

2. 业务场景是否一致

同一个业务领域不同的业务场景或者技术场景，不能定义一个主题。如订单流程和订单缓存刷新都和订单有关系，但是订单缓存刷新可能需要被不同的流程触发，放在一起就会导致部分场景订单缓存不刷新的情况。

3. 消息类型是否一致

同一个业务领域和业务场景，对消息类型有不同需求，比如订单处理过程中，我们需要发送一个事务消息，同时也需要发送一个定时消息，那么这两个消息就不能共用一个主题。

- **消息定义的原则**
** **

1. 无标签无属性

对于业务实体极其简单的消息，是可以不需要定义标签和属性，比如 MySQLBinlog 的同步。所有的消费者都没有消息过滤需求的，也无需定义标签和属性。

2. 如何定义标签

标签过滤是 RocketMQ 中使用最简单，且过滤性能最好的一种过滤方式。为了发挥其巨大的优势，可以考虑优先使用。在使用时，我们需要确认这个字段在业务实体和业务流程中是否是唯一定义的，并且它是被绝大多数消费者作为过滤条件的，那么可以将它作为标签来定义。比如订单中有下单渠道和订单操作这两个字段，并且在单次消息发送过程中都是唯一定义，但是订单操作被绝大多数消费者应用为过滤条件，那么它最合适作为标签。

3. 如何定义属性

属性过滤的开销相对比较大，所以只有在标签过滤无法满足时，才推荐使用。比如标签已经被其他字段占用，或者过滤条件不可枚举，需要支持多属性复杂逻辑的过滤，就只能使用属性过滤了。

### 保持订阅关系一致

订阅关系一致是指同一个消费者组下面的所有的消费者所订阅的 Topic 和过滤表达式都必须完全一致。

![7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680500710113-c3d77011-3f1d-45ad-8900-b8a3907ff353.png#clientId=uf1e4bd52-62c0-4&height=782&id=ahfDB&name=7.png&originHeight=782&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u49274bed-a2db-4cfd-9164-2740f17769e&title=&width=1080)

正如上图所示，一个消费者组包含两个消费者，他们同时订阅了 Topic-A 这个主题，但是消费者一订阅的是 Tag-A 这个标签的消息，消费者二订阅的是 Tag-B 这个标签的消息，那么他们两者的订阅关系就存在不一致。

- **导致的问题：**

那么订阅关系不一致会导致什么问题呢？

1. 频繁复杂均衡

在 RocketMQ 实现中，消费者客户端默认每 30 秒向 Broker 发送一次心跳，这个过程会上传订阅关系，Broker 发现变化了就进行订阅关系覆盖，同时会触发客户端进行负载均衡。那么订阅关系不一致的两个客户端会交叉上传自己的订阅关系，从而导致客户端频繁进行负载均衡。

2. 消费速率下降

客户端触发了负载均衡，会导致消费者所持有的消费队列发生变化，出现间断性暂停消息拉取，导致整体消费速率下降，甚至出现消息积压。

3. 消息重复消费

客户端触发了负载均衡，会导致已经消费成功的消息因为消费队列发生变化而放弃向 Broker 提交消费位点。Broker 会认为这条消息没有消费成功而重新向消费者发起投递，从而导致消息重复消费。

4. 消息未消费

订阅关系的不一致，会有两种场景会导致消息未消费。第一种是消费者的订阅关系和 Broker 当前订阅关系不一致，导致消息在 Broker 服务端就被过滤了。第二种是消费者的订阅关系和 Broker 当前的虽然一致，但是 Broker 投递给了其他的消费者，被其他消费者本地过滤了。

- **使用的建议**

在消息过滤使用中，有以下建议：

1. 不要共用消费者组

不同业务系统千万不要使用同一个消费者组订阅同一个主题的消息。一般不同业务系统由不同团队维护，很容易发生一个团队修改了订阅关系而没有通知到其他团队，从而导致订阅关系不一致的情况。

2. 不频繁变更订阅关系

频繁变更订阅关系这种情况比较少，但也存在部分用户实现在线规则或者动态参数来设置订阅关系。这有可能导致订阅关系发生变化，触发客户端负载均衡的情况。

3. 变更做好风险评估

由于业务的发展，需求的变更，订阅关系不可能一直不变，但是变更订阅关系过程中，需要考虑整体发布完成需要的总体时间，以及发布过程中订阅关系不一致而对业务可能带来的风险。

4. 消费做好幂等处理

不管是订阅关系不一致，还是客户端上下线，都会导致消息的重复投递，所以消息幂等处理永远是消息消费的黄金法则。在业务逻辑中，消费者需要保证对已经处理过的消息直接返回成功，避免二次消费对业务造成的损害，如果返回失败就会导致消息一直重复投递直到进死信。

到此，本文关于消息过滤的分享就到此结束了，非常感谢大家能够花费宝贵的时间阅读，有不对的地方麻烦指正，感谢大家对 RocketMQ 的关注。

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
