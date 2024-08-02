---
title: "基于 RocketMQ  的基金数字化陪伴体系的架构实践"
date: "2021/10/17"
author: "伍振河"
img: "https://img.alicdn.com/imgextra/i3/O1CN01mnEA4B1V311CQsBgV_!!6000000002596-0-tps-685-383.jpg"
tags: ["practice"]
description: "本文以博时基金的金融场景为案例，阐述 RocketMQ 在提升客户陪伴效率和丰富金融场景化能力等方面的提升作用。"
---

# **行业背景**

基金公司的核心业务主要分为两部分，一部分是投研线业务，即投资管理和行业研究业务，它体现了基金公司核心竞争力。另一部分是市场线业务，即基金公司利用自身渠道和市场能力完成基金销售并做好客户服务。

博时基金管作为中国内地首批成立的五家基金管理公司之一，截至 2021 年 6 月 30 日，博时基金公司共管理 276 只公募基金，管理资产总规模逾 15482 亿元人民币，累计分红逾 1465 亿元人民币。

![图片 1.png](https://img.alicdn.com/imgextra/i4/O1CN01GDqrIY1qwzV0FSl46_!!6000000005561-2-tps-864-487.png)

随着互联网技术发展，基金销售渠道更加多元化，线上成为基金销售重要渠道。相比传统基金客户，线上渠道具有客户基数大，水平参差不齐的特点。对于那些还不成熟的客户，我们需要做好陪伴，让他们理解风险，理解投资。

# **RocketMQ 在陪伴体系中的应用**

### 1、陪伴场景概述

博时基金建立了一套全方位多层次陪伴体系，从用户层面、市场层面和产品层面为用户提供投前、投中、投后的有温度的投资陪伴体验。
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489107222-4e657188-0beb-441c-a267-65cd8ececb9e.gif#clientId=uffd2b56b-90af-4&height=1&id=uqRDY&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u28125897-ab61-4580-95ce-30fd11be21f&title=&width=1) -->
![图片 2.png](https://img.alicdn.com/imgextra/i3/O1CN01nMQ9fI1Nzcv80ZkBW_!!6000000001641-0-tps-2088-1090.jpg)

每个陪伴场景的达成，需要公司多个部门不同团队协同配合来完成。依赖与投研、合规、运营、大数据等上下游多个系统。但这些系统可能采用不同技术架构，实现方式各异，如果采用同步调用方式来实现协同，耦合度太高，不利于未来扩展。

### 2、RocketMQ 解耦异构系统

RocketMQ 提供高效可靠的消息传递特性和发布订阅机制，非常适合用于这种上下游异构系统间的解耦。我们把原来基于文件、邮件的协作方式全部线上化、流程化和机制化，大大提升了陪伴输出效率。对于这种涉及多方系统的协作，需要对消息进行合理地归类，以便进行过滤和索引。RocketMQ 提供的 Topic 和 Tags 就是用来做这件事的。
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489107183-de64035c-5318-4e66-a691-6ea67df39507.gif#clientId=uffd2b56b-90af-4&height=1&id=Ft9Ub&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4211c289-5925-4a74-8d24-678d5c4dd22&title=&width=1) -->
![图片 3.png](https://img.alicdn.com/imgextra/i3/O1CN01fzRF7s1eG93ajlEzr_!!6000000003843-0-tps-2114-1014.jpg)

### 3、Topic 和 Tags 最佳实践

Topic 与 Tag 作为业务上用来归类的标识，分别属于一级分类和二级分类，这种层次化的分类标识与企业组织架构比较类似，可以结合起来实现消息过滤。举个例子，对于陪伴系统的 Topic，运营系统订阅运营类消息，我们给这类消息打上 TagA 的标签，客服系统订阅客服类消息 TagB，陪伴编排系统订阅编排类消息 TagC，合规系统需要对运营和陪伴消息进行合规审查，因此它需要订阅 TagA 和 TagC，最后是数据中心，所有的消息都要处理，因此它需要监听所有 Tag。

![图片 4.png](https://img.alicdn.com/imgextra/i4/O1CN01za5QX0255bZHwCSyg_!!6000000007475-0-tps-2210-1194.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489109381-a2a86a2c-18bd-46a5-8098-3a895341087f.gif#clientId=uffd2b56b-90af-4&height=1&id=bgoHY&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u430bae29-cc2a-443a-b1dc-9ed2f2961a3&title=&width=1) -->

# **RocketMQ 事务消息的金融应用场景**

### 1、金融场景概述

接下来，我们讲解一下典型的金融场景--优惠购。在博时基金 APP 上申购基金可以享受低至 0 折的费率优惠，具体业务怎么样实现？这里有有两种方式，第一种先充值博时钱包，底层是替客户购买了一笔货币基金，然后再用博时钱包购买目标基金。这种方式需要用户操作两次，比较繁琐，容易引起客单流失。另外一种方式就是优惠购，把两步购买基金封装成一次事务操作。对投资者来说，开启优惠购服务后，操作少一步，投资更简单！

![图片 5.png](https://img.alicdn.com/imgextra/i3/O1CN01sc7HfM1itlmnsEk7e_!!6000000004471-0-tps-2228-914.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489110199-68b325ae-6467-42cc-9025-2cc3bb5ff86e.gif#clientId=uffd2b56b-90af-4&height=1&id=tM4qe&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6f298de3-69f5-483d-8cc7-74d907c0cb8&title=&width=1) -->

### 2、领域事件理论模型

领域事件是指业务流程的一个步骤将导致进一步的业务操作，比方说登录事件，比方说基金购买事件等。在领域模型里面，领域事件事务采用的是最终一致性，区别于强一致性，它是弱一致性的一种。在领域模型映射到微服务系统架构时，微服务之间的数据不必要求强一致，因此领域事件可以解耦微服务。依据是否跨微服务，可以分为两种场景： 

第一种场景：当领域事件发生在同一个微服务。由于大部分事件发生在同一个进程内，自身可以很好地控制事务。但如果一个事件需要同时更新多个聚合，按照 DDD 中一次事务只更新一个聚合的原则，就需要引入事件总线，就是 eventbus 这种模式。 

第二种场景：跨微服务。领域事件发生在微服务之间的场景比较多，事件处理的机制也更加复杂。跨微服务的事件可以推动业务流程或者数据在不同的子域或微服务间直接流转，因此需要一个协调者来推进全局事务。跨微服务的事件机制要总体考虑事件构建、发布和订阅、事件数据持久化、消息中间件、分布式事务机制等，其中具备事务消息功能的消息中间件是这个解决方案的核心组件。

![图片 6.png](https://img.alicdn.com/imgextra/i4/O1CN01NRzqOf1EPbDuJYunN_!!6000000000344-0-tps-2134-1064.jpg)

### 3、分布式事务方案对比

在博时基金的业务场景下，需要解决的问题是事务一致性与服务解耦度之间的矛盾，因此我们的目标是让主从事务解耦，保证核心逻辑稳定，同时不因为解耦而牺牲最终一致性。因此，当时做出了几种不同的解决方案： 

- 第一种方案：最常见普通消息+异步对账，这个方案的问题是无法保证主事务的执行和入队同时成功，需要时效性低的对账补偿解决，一致性只是较高。
- 第二种方案：本地消息表，对比上一种做法，它由业务将写入消息表放到主事务中，把主事务和入队变成一个原子操作，然后业务读取入队记录，自己投递给从事务。它的缺点是主事务和消息表在存储上是耦合的，没有解耦度。
- 第三种方案：引入 XA 事务，是个两阶段提交的协议，实现难度较大。而且面临两个问题：一是这是一种同步阻塞协议，有锁占用导致并发不会太高，另外就是 XA 事务过程中，在参与者投赞成票后，如果协调者发生故障，节点不清楚应该提交还是中止，只能等待协调者恢复。这时候可能会出现业务中断。
- 第四种方案：TCC，专门处理分布式事务的 TCC，只侧重于一致性，无解耦度，也是不可行。
- 第五种方案：事务消息，它能同时兼顾解耦度和一致性，是最合适的模式。

最终我们选择了 RocketMQ 的事务消息作为分布式事务的解决方案。

<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489111473-60709829-787b-4b2d-b879-2cd58ec533fb.gif#clientId=uffd2b56b-90af-4&height=1&id=JtEad&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=udcf2dafa-f461-44d5-a823-01d965a3226&title=&width=1) -->
![图片 7.png](https://img.alicdn.com/imgextra/i4/O1CN014dcVRQ27dcD8ywMny_!!6000000007820-0-tps-2110-954.jpg)

### 4、RocketMQ 事务消息核心流程

基于 RocketMQ 的事务消息搭建事务中心，协调分布式事务的推进和回滚。以优惠购为例，核心流程如下：

- 第一阶段：Prepare 阶段 ，即业务系统将 RocketMQ 的半事务消息发送到事务中心，事务中心不做发布，等待二次确认。这个阶段 RocketMQ 的半消息在消费者端是感知不到的。
- 第二阶段：业务系统执行主事务，即购买货币基金。
- 第三阶段：主事务成功后 commit 到事务中心，由事务中心投递消息到从事务。如果主事务失败，就投递 rollback 给事务中心。这里需要两阶段提交的原因是：普通的入队操作无论放在主事务之前还是之后都无法保证最终一致。如果先执行主事务，再入队，那么可能在入队前，业务会宕机，就没有机会再入队了。如果先入队再执行主事务，那么可能主事务没有执行成功，但是从事务执行成功了，业务逻辑就会发生错乱。

![图片 8.png](https://img.alicdn.com/imgextra/i3/O1CN01uE2rSN1HRNbm67whN_!!6000000000754-0-tps-1776-1194.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489112637-83a8e2e5-27fd-4520-b64b-a29f8a37e322.gif#clientId=uffd2b56b-90af-4&height=1&id=g7lKk&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u280d1204-41ce-4abd-b62d-61e9b527398&title=&width=1) -->

由于网络抖动等原因，可能导致事务消息的二次确认丢失。此时需要依赖某种机制恢复整个分布式事务的上下文，RocketMQ 提供的反查机制正是为解决分布式事务中的超时问题而设计的。我们的事务中心的反查机制流程主要是，先检查事务中心的内部状态，再通过反查接口检查本地事务的执行结果，恢复事务上下文后，正常推进后续的流程。
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489113210-1d40165b-e3f8-4c58-bd90-fc4d62a814ba.gif#clientId=uffd2b56b-90af-4&height=1&id=XIQ9x&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9d9fdb52-8b19-4377-a430-91b81e9a420&title=&width=1) -->
![图片 9.png](https://img.alicdn.com/imgextra/i2/O1CN01Gl2zAq1QMBf5NcaDW_!!6000000001961-0-tps-1914-1322.jpg)

### 5、RocketMQ 如何保证事务消息在消费端正常消费

消费端消费失败后，MQ 服务端需要进行一定次数的重试，我们需要制定合理的重试策略。因为有消费重试，这要求消费方接口需要实现幂等性；如果重试多次后仍失败，我们会把消息压入死信队列 DLQ，RocketMQ 提供了死信队列的功能，对进入死信队列的消息进行告警处理。

![图片 10.png](https://img.alicdn.com/imgextra/i3/O1CN01ZJaVqJ1QvuYRnShxH_!!6000000002039-0-tps-2170-932.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489114454-34b1976a-cfb5-424d-b79b-3a582f26f7ac.gif#clientId=uffd2b56b-90af-4&height=1&id=fgx1x&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uda364d49-81f7-4cd0-8475-10070d87f71&title=&width=1) -->
 
### 6、事务消息的适用场景

第一类场景：需要同步执行的领域事件，比如说领域事件逻辑失败概率大，业务要及时将返回码告知客户端，自然不能放在异步流程中。举个例子，做过支付系统的小伙伴都知道，支付扣款前要检查余额是否足够，如果余额不足，那在异步流程中重试多少次都是失败。 

第二类场景：是事务不可重入场景，例如业务系统发送消息时没有确定一个唯一事务 ID，那后续的业务逻辑就无法保证幂等，假设其中一个事务是创建订单，如果不能保证幂等的话，重试多次就会产生多个订单；所以这里需要使用到事务消息，用来明确一个分布式事务的开始，生成一个唯一事务 ID，让后续的流程能以这个事务 ID 来保证幂等。 

# **未来规划**

![图片 11.png](https://img.alicdn.com/imgextra/i4/O1CN01AgmkKf1HnMcZw37o0_!!6000000000802-2-tps-864-320.png)
目前，我们基于 RocketMQ 在客户陪伴体系上解耦了上下游的服务，提升了运营和陪伴的效率。同时，我们在 RocketMQ 事务消息的基础上，搭建了这样一个支持分布式事务的服务协调平台，也就是我们的事务中心，大大提升了对金融场景化的产品包装能力。未来，我们将围绕着事务中心，拓宽更多的金融应用场景，创造更大的业务价值。

![图片 12.png](https://img.alicdn.com/imgextra/i2/O1CN01D1L51G1uVI0JfTuPx_!!6000000006042-0-tps-1898-1314.jpg)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://img.alicdn.com/imgextra/i4/O1CN01Xi1rcu1DM6aIC7ypz_!!6000000000201-0-tps-1920-675.jpg)