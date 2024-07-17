---
title: "RocketMQ  消息集成：多类型业务消息——定时消息"
date: "2022/07/27"
author: "凯易、明锻"
img: "https://img.alicdn.com/imgextra/i3/O1CN01Ago4G41ZX1QobSLyJ_!!6000000003203-0-tps-685-383.jpg"
tags: ["explore"]
description: "本篇将继续业务消息集成的场景，从使用场景、应用案例、功能原理以及最佳实践等角度介绍 RocketMQ 的定时消息功能。"
---
## 引言


Apache RocketMQ 诞生至今，历经十余年大规模业务稳定性打磨，服务了 100% 阿里集团内部业务以及阿里云数以万计的企业客户。作为金融级可靠的业务消息方案，RocketMQ 从创建之初就一直专注于业务集成领域的异步通信能力构建。

本篇将继续业务消息集成的场景，从使用场景、应用案例、功能原理以及最佳实践等角度介绍 RocketMQ 的定时消息功能。

点击下方链接，查看直播讲解：
[https://yqh.aliyun.com/live/detail/29063](https://yqh.aliyun.com/live/detail/29063)

## 概念：什么是定时消息


在业务消息集成场景中，定时消息是，生产者将一条消息发送到消息队列后并不期望这条消息马上会被消费者消费到，而是期望到了指定的时间，消费者才可以消费到。

相似地，延迟消息其实是对于定时消息的另外一种解释，指的是生产者期望消息延迟一定时间，消费者才可以消费到。可以理解为定时到当前时间加上一定的延迟时间。

对比一下定时消息和普通消息的流程。普通消息，可以粗略的分为消息发送，消息存储和消息消费三个过程。当一条消息发送到 Topic 之后，那么这条消息就可以马上处于等待消费者消费的状态了。

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492769699-78b0a221-297b-4abf-8aa5-969ce9dc4118.png#clientId=ucc2bf0f1-fd9a-4&height=328&id=g5Vtf&name=1.png&originHeight=328&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uab5025a5-dd4a-4a16-823d-198fba25554&title=&width=1080)

而对于定时/延时消息来说，其可以理解为在普通消息的基础上叠加了定时投递到消费者的特性。生产者发送了一条定时消息之后，消息并不会马上进入用户真正的Topic里面，而是会被 RocketMQ 暂存到一个系统 Topic 里面，当到了设定的时间之后，RocketMQ 才会将这条消息投递到真正的 Topic 里面，让消费者可以消费到。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492769629-d52a2775-c1b0-4a23-adee-d856a093f14d.gif#clientId=ucc2bf0f1-fd9a-4&height=1&id=Bxcmi&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u04c9b271-3b06-4834-a1eb-679b59dacd9&title=&width=1)

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492771471-abe17ab4-8921-4af3-9263-4eeb6e60cbd6.png#clientId=ucc2bf0f1-fd9a-4&height=404&id=ZqnT0&name=2.png&originHeight=404&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua8ea9c0b-7431-4607-9a67-04127ba2a76&title=&width=1080)

## 场景：为什么需要使用定时消息


在分布式定时调度触发、任务超时处理等场景，需要实现精准、可靠的定时事件触发。往往这类定时事件触发都会存在以下诉求：

- 高性能吞吐：需要大量事件触发，不能有性能瓶颈。
- 高可靠可重试：不能丢失事件触发。
- 分布式可扩展：定时调度不能是单机系统，需要能够均衡的调度到多个服务负载。 

传统的定时调度方案，往往基于数据库的任务表扫描机制来实现。大概的思路就是将需要定时触发的任务放到数据库，然后微服务应用定时触发扫描数据库的操作，实现任务捞取处理。

这类方案虽然可以实现定时调度，但往往存在很多不足之处：

- 重复扫描：在分布式微服务架构下，每个微服务节点都需要去扫描数据库，带来大量冗余的任务处理，需要做去重处理。
- 定时间隔不准确：基于定时扫描的机制无法实现任意时间精度的延时调度。
- 横向扩展性差：为规避重复扫描的问题，数据库扫表的方案里往往会按照服务节点拆分表，但每个数据表只能被单节点处理，这样会产生性能瓶颈。

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492769623-e686c2bf-bd57-4ced-9e4a-bba2613efdf7.png#clientId=ucc2bf0f1-fd9a-4&height=540&id=FbOCM&name=3.png&originHeight=540&originWidth=960&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9dd46430-1d93-4f87-a374-e4f182ecfb2&title=&width=960)

在这类定时调度类场景中，使用 RocketMQ 的定时消息可以简化定时调度任务的开发逻辑，实现高性能、可扩展、高可靠的定时触发能力。

- 精度高、开发门槛低：基于消息通知方式不存在定时阶梯间隔。可以轻松实现任意精度事件触发，无需业务去重。
- 高性能可扩展：传统的数据库扫描方式较为复杂，需要频繁调用接口扫描，容易产生性能瓶颈。消息队列 RocketMQ 版的定时消息具有高并发和水平扩展的能力。

![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492769456-9b6b8f3b-2682-41aa-8036-1db80ce13125.gif#clientId=ucc2bf0f1-fd9a-4&height=1&id=eFoJL&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0af24e16-13d3-4dae-93ba-7a277021dd0&title=&width=1)![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492771691-2ae1a843-337d-495f-a3ed-9924798a180d.png#clientId=ucc2bf0f1-fd9a-4&height=428&id=BRnmF&name=4.png&originHeight=428&originWidth=890&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5b28b06c-0454-4cb5-a845-20b2450fb8e&title=&width=890)

## 案例：使用定时消息实现金融支付超时需求


利用定时消息可以实现在一定的时间之后才进行某些操作而业务系统不用管理定时的状态。下面介绍一个典型的案例场景：金融支付超时。现在有一个订单系统，希望在用户下单 30 分钟后检查用户的订单状态，如果用户还没有支付，那么就自动取消这笔订单。

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492771701-ca0e9df5-e91a-498e-9897-60d53ac7f054.png#clientId=ucc2bf0f1-fd9a-4&height=468&id=FEFJl&name=5.png&originHeight=468&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua333e04b-b2e8-42ed-b8a5-c9e8ed2e3b6&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492771789-8aa47832-f929-4506-8a13-5b61aa2b8d3f.gif#clientId=ucc2bf0f1-fd9a-4&height=1&id=O15hE&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u04f73a26-7786-4523-8923-376b347621f&title=&width=1)
基于 RocketMQ 定时消息，我们可以在用户下单之后发送一条定时到 30 分钟之后的定时消息。同时，我们可以使用将订单 ID 设置为 MessageKey。当 30 分钟之后，订单系统收到消息之后，就可以通过订单 ID 检查订单的状态。如果用户超时未支付，那么就自动的将这笔订单关闭。

## 原理：RocketMQ 定时消息如何实现


### 固定间隔定时消息

如前文介绍，定时消息的核心是如何在特定的时间把处于系统定时 Topic 里面的消息转移到用户的 Topic 里面去。

![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492771859-fd7b772f-4593-4601-afe3-278171474cf1.png#clientId=ucc2bf0f1-fd9a-4&height=349&id=Z9yMv&name=6.png&originHeight=349&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1593a0e9-769e-4fc4-8179-ad9fb15d561&title=&width=1080)

Apache RocketMQ 4.x 的版本的定时消息是先将定时消息放到按照 DelayLevel 放到 SCHEDULE_TOPIC_XXXX 这个系统的不同 Queue 里面，然后为每一个 Queue 启动一个定时任务，定时的拉取消息并将到了时间的消息转投到用户的 Topic 里面去。这样虽然实现简单，但也导致只能支持特定 DelayLevel 的定时消息。

当下，支持定时到任意秒级时间的定时消息的实现的 pr 提出到了社区，下面简单的介绍一下其基本的实现原理。

### 时间轮算法

在介绍具体的实现原理之前，先介绍一下经典的时间轮算法，这是定时消息实现的核心算法。

![7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492772011-3fdd220a-04f6-4f5c-8e62-4adff5b80d9c.png#clientId=ucc2bf0f1-fd9a-4&height=462&id=n1rgq&name=7.png&originHeight=462&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u960332bd-b939-4207-9770-a4e622781e9&title=&width=1080)

如上所示，这是一个一圈定时为 7 秒的时间轮，定时的最小精度的为秒。同时，时间轮上面会有一个指向当前时间的指针，其会定时的移向下一个刻度。

现在我们想定时到 1 秒以后，那么就将数据放到 “1” 这个刻度里面，同时如果有多个数据需要定时到同一个时间，

那么会以链表的方式添加到后面。当时间轮转到 “1” 这个刻度之后，就会将其读取并从链表出队。那如果想定到超过时间轮一圈的时间怎么处理呢？例如我们想定时到 14 秒，由于一圈的时间是 7 秒，那么我们将其放在“6”这个刻度里面。当第一次时间轮转到“6” 时，发现当前时间小于期望的时间，那么忽略这条数据。当第二次时间轮转到“6”时，这个时候就会发现已经到了我们期望的 14 秒了。

### 任意秒级定时消息

在 RocketMQ 中，使用 TimerWheel 对于时间轮进行描述和存储，同时使用一个 AppendOnly 的 TimerLog 记录时间轮上面每一个刻度所对应的所有的消息。

TimerLog 记录了一条定时消息的一些重要的元数据，用于后面定时的时间到了之后，将消息转移到用户的 Topic 里面去。其中几个重要的属性如下：
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492772282-6b87d5c0-349b-423a-a096-f3cf97a1d9bf.gif#clientId=ucc2bf0f1-fd9a-4&height=1&id=sUPbK&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5e3feb43-54b6-4594-ac8e-d8282fb8ea4&title=&width=1)
![8.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492772282-4cdbb8bf-c71e-4532-af55-b022d25a3bc4.png#clientId=ucc2bf0f1-fd9a-4&height=368&id=LYuaI&name=8.png&originHeight=368&originWidth=1040&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub16edfea-942a-4662-97d4-b2f05988622&title=&width=1040)

对于 TimerWheel 来说，可以抽象的认为是一个定长的数组，数组中的每一格代表时间轮上面的一个“刻度”。TimerWheel 的一个“刻度”拥有以下属性。
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492772246-4f994ada-e5e5-4c22-a280-8f300f62068d.gif#clientId=ucc2bf0f1-fd9a-4&height=1&id=U1zBj&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u70bf3ab9-50a0-48d0-9011-a19920f5c27&title=&width=1)
![9.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492772516-d205d96b-52e8-4b44-b15e-e4e008d606d9.png#clientId=ucc2bf0f1-fd9a-4&height=212&id=d4idS&name=9.png&originHeight=212&originWidth=1042&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u72aa12c6-5ec5-45b7-8fe7-4f83bcf0830&title=&width=1042)

TimerWheel 和 TimerLog 直接的关系如下图所示：![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492772514-9fb42267-a70e-47b7-9b16-2e5a9c5cd8ee.gif#clientId=ucc2bf0f1-fd9a-4&height=1&id=kQGXy&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u397613e9-2975-41aa-ab7b-646f8ea3cce&title=&width=1)

![10.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492772765-c10e8cd5-0590-4f68-99ff-100311221238.png#clientId=ucc2bf0f1-fd9a-4&height=604&id=AhJMA&name=10.png&originHeight=604&originWidth=992&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5dbd8928-4d89-4624-a046-54f7b2246e6&title=&width=992)

TimerWheel 中的每一格代表着一个时间刻度，同时会有一个 firstPos 指向这个刻度下所有定时消息的首条 TimerLog 记录的地址，一个 lastPos 指向这个刻度下所有定时消息最后一条 TimerLog 的记录的地址。并且，对于所处于同一个刻度的的消息，其 TimerLog 会通过 prevPos 串联成一个链表。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492772751-eec8c473-c598-454e-936a-a81048679a66.gif#clientId=ucc2bf0f1-fd9a-4&height=1&id=LheFf&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9e0d26f5-7850-49b4-89e2-6aaf6abcc4b&title=&width=1)

![11.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492772792-257af952-430e-4cc8-b8a1-43ebbd79d6d0.png#clientId=ucc2bf0f1-fd9a-4&height=604&id=wjMVL&name=11.png&originHeight=604&originWidth=992&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue4d0bf02-222d-476e-88f3-0e6bb458fc2&title=&width=992)

当需要新增一条记录的时候，例如现在我们要新增一个 “1-4”。那么就将新记录的 prevPos 指向当前的 lastPos，即 “1-3”，然后修改 lastPos 指向 “1-4”。这样就将同一个刻度上面的 TimerLog 记录全都串起来了。

有了 TimerWheel 和 TimerLog 之后，我们再来看一下一条定时消息从发送到 RocketMQ 之后是怎么最终投递给用户的。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492772967-f3177a3b-4f6a-4a7f-a43f-549506731f02.gif#clientId=ucc2bf0f1-fd9a-4&height=1&id=mxFjb&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue3f9387d-92d9-44b2-bb16-532abc71cd1&title=&width=1)

![12.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492772999-0bd22793-b128-4808-9770-5fd2ce278444.png#clientId=ucc2bf0f1-fd9a-4&height=481&id=tkEiG&name=12.png&originHeight=481&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7edd01d8-a1f1-4836-944d-f385c541c29&title=&width=1080)

首先，当发现用户发送的是一个定时消息过后，RocketMQ 实际上会将这条消息发送到一个专门用于处理定时消息的系统 Topic 里面去

然后在 TimerMessageStore 中会有五个 Service 进行分工合作，但整体可以分为两个阶段：入时间轮和出时间轮

对于入时间轮：

- TimerEnqueueGetService 负责从系统定时 Topic 里面拉取消息放入 enqueuePutQueue 等待 TimerEnqueuePutService 的处理
- TimerEnqueuePutService 负责构建 TimerLog 记录，并将其放入时间轮的对应的刻度中 

对于出时间轮：

- TimerDequeueGetService 负责转动时间轮，并取出当前时间刻度的所有 TimerLog 记录放入 dequeueGetQueue
- TimerDequeueGetMessageService 负责根据 TimerLog 记录，从 CommitLog 中读取消息
- TimerDequeuePutMessageService 负责判断队列中的消息是否已经到期，如果已经到期了，那么将其投入用户的 Topic 中，等待消费消费；如果还没有到期，那么重新投入系统定时 Topic，等待重新进入时间轮。 



## 实战：使用定时消息

了解了 RocketMQ 秒级定时消息的原理后，我们看下如何使用定时消息。首先，我们需要创建一个 “定时/延时消息” 类型的 Topic，可以使用控制台或者 CLi 命令创建。

![13.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492773282-8e7d3d81-02cd-40f7-886a-84ad6d9ac6ab.png#clientId=ucc2bf0f1-fd9a-4&height=782&id=ub5HR&name=13.png&originHeight=782&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ubb6821e8-f8ad-4c94-aaf7-e00234f0311&title=&width=1080)

从前面可以看出，对于定时消息来说，是在发送消息的时候 “做文章”。所以，对于生产者，相对于发送普通消息，我们可以在发送的时候设置期望的投递时间。

![14.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492773317-3aacf04e-aa9f-4c22-8367-5fe16ab0c12c.png#clientId=ucc2bf0f1-fd9a-4&height=962&id=hTnQh&name=14.png&originHeight=962&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u18b2b630-ebbf-45e2-8c59-111dc9c3fb2&title=&width=1080)

当定时的时间到了之后，这条消息其实就是一条投递到用户 Topic 的普通消息而已。所以对于消费者来说，和普通消息的消费没有区别。![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492773336-77c20912-709d-4138-a70e-092a182d6aad.gif#clientId=ucc2bf0f1-fd9a-4&height=1&id=luGJ6&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u14303272-30b1-4402-b997-65a59172a8c&title=&width=1)

![15.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680492773497-f58b59c2-6a1b-4a42-93a4-e4049cb61a52.png#clientId=ucc2bf0f1-fd9a-4&height=836&id=fYyYx&name=15.png&originHeight=836&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u213cfb20-0528-452a-9f22-dba5848887f&title=&width=1080)

注意：定时消息的实现逻辑需要先经过定时存储等待触发，定时时间到达后才会被投递给消费者。因此，如果将大量定时消息的定时时间设置为同一时刻，则到达该时刻后会有大量消息同时需要被处理，会造成系统压力过大。所以一般建议尽量不要设置大量相同触发时刻的消息。

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
