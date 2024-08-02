---
title: "云原生事件驱动引擎(RocketMQ-EventBridge)应用场景与技术解析"
date: "2022/08/10"
author: "静罗"
img: "https://img.alicdn.com/imgextra/i1/O1CN013QCbzD1q0p3UTQJ6W_!!6000000005434-0-tps-685-383.jpg"
tags: ["explore", "recommend"]
description: " RocketMQ 给人最大的印象一直是一个消息引擎。那什么是事件驱动引擎？为什么我们这次要推出事件驱动引擎这个产品？他有哪些应用场景，以及对应的技术方案是什么？本文我们就一起来看下。"
---

在刚刚过去的 RocketMQ Summit 2022 全球开发者峰会上，我们对外正式开源了我们的新产品 RocketMQ-Eventbridge 事件驱动引擎。

RocketMQ 给人最大的印象一直是一个消息引擎。那什么是事件驱动引擎？为什么我们这次要推出事件驱动引擎这个产品？他有哪些应用场景，以及对应的技术方案是什么？

今天我们就一起来看下，整篇文章包含三部分：

第一部分，我们一起看下什么是事件。

第二部分，和大家一起看看，事件有哪些不一样的“超能力”，使用这些“超能力”呢，我们又能干些什么？

第三部分，我们讲一下 RocketMQ 给出的关于事件的解决方案，也是我们这次开源的项目：RocketMQ-EventBridge。

## 什么是事件


大家自己可以先在脑袋里想一下，什么是事件？我们给事件下的一个定义是：

过去已经发生的事，尤其是比较重要的事。

> A thing that happens, especially one of importance.


这个很好理解。比如说，昨天下午我做了一次核酸检测；今天上午又吃了一个冰激淋。这些都是过去已经发生的事件。但是，如果我再问：事件跟消息有什么区别？这个时候，大家是不是觉得事件这个定义，好像又不那么清晰？

刚才说的那些事件，是不是也可以理解为消息啊？如果，老张给我发送了一条短信，这个算是事件，还是消息啊？平常开发过程中，“什么时候使用消息，什么时候使用事件？”

不过，在回答这个问题之前，我们一起来看一个典型的微服务。
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492872450-b9ac5f4b-8072-4b08-a7df-957b9eeeff32.gif#clientId=ueeb82efb-2fb6-4&height=1&id=cCk86&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u42f7eee6-2f4d-46ac-9dfb-f9547130c41&title=&width=1) -->

![1.png](https://img.alicdn.com/imgextra/i3/O1CN016za0W91FTYFopSU8l_!!6000000000488-0-tps-1080-507.jpg)

一个微服务系统和外部系统的交互，可以简单分为两部分：一是接收外部请求（就是图中上面黄色的部分）；二是是调用外部服务（就是图中下面绿色的部分）。

接收外部请求，我们有两种方式：一种是提供 API，接收外部发过来的 Query 请求和 Command 请求；另外一种是主动订阅外部 Command 消息。这两类操作，进入系统内部之后呢，我们常常还会，调用其他为微服务系统，一起协同处理，来完成一个具体的操作。当这些操作，使得系统状态发生改变时，就会产生事件。

这里呢，我们把从外部接收到的 Command 消息，和系统内部产生的事件，都称之为消息。

我们总结一下，消息和事件的关系是这样的：消息包含两部分，Command 消息和 Event 消息

1、看图中左半部分，Command 是外部系统发送给本系统的一条操作命令；

2、再看图中右半部分，Event 则是本系统收到 Command 操作请求，系统内部发生改变之后，随之而产生了事件；
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492874440-4809e556-43cf-47f6-90af-e7ca8590806c.gif#clientId=ueeb82efb-2fb6-4&height=1&id=Tz2HF&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ueb8c9cfa-1c3d-493a-864a-51ac38c476f&title=&width=1) -->

![2.png](https://img.alicdn.com/imgextra/i1/O1CN01limplp1gwOpOHFbUc_!!6000000004206-0-tps-1080-506.jpg)

所以，事件和消息是不同的，事件可以理解为是一种特殊的消息。其特殊的点，主要在 4 个地方：

### 已发生、且不可变

事件，一定是“已发的”。“已发生”的代表什么呢？不可变的。我们不可能改变过去。这个特性非常重要，在我们处理事件、分析事件的时候，这就意味着，我们绝对可以相信这些事件，只要是收到的事件，一定是系统真实发生过的行为。而且是不可修改。

对比 Command 和 Query。Command 的中文是什么？命令。很显然，它是还没有发生的，只是表达了一种期望。我们知道“期望的”，不一定会成功发生。

比如：把厨房的灯打开、去按下门铃、转给 A 账户 10w……

这些都是 Command，都是期望发生的行为。但是，最终有没有发生？并不知道。

Event 则是明确已经发生的事情。比如：厨房灯被打开了、有人按了门铃、A 账户收到了 10w……

再对比 Query，它则是查询系统当前状态的一种请求，比如：厨房的灯是打开着的、门铃正在响、查下账户显示余额 11w……

### 无期望的

这个怎么理解？事件是客观的描述一个事物的状态或属性值的变化，但对于如何处理事件本身并没有做任何期望。

相比之下，Command 和 Query 则都是有期望的，他们希望系统做出改变或则返回结果，但是 Event 呢，它只是客观描述系统的一个变化。

我们看一个例子：交通信号灯，从绿灯变成红灯，事件本身并没有要求行人或汽车禁止通行，而是交通法规需要红绿灯，并赋予了其规则。
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492872223-0da5373a-6ed5-495d-832c-4e8e7ff421ee.gif#clientId=ueeb82efb-2fb6-4&height=1&id=juJAc&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4c116565-2c72-4164-aa0b-6cb6e2a1545&title=&width=1) -->

![3.png](https://img.alicdn.com/imgextra/i3/O1CN01aEksfT1LqLfHcHvkV_!!6000000001350-0-tps-542-320.jpg)

所以，系统一般不会定向的、单独向另外一个系统发送事件，而是统一的告诉“事件中心”，“事件中心”呢，那里面有各个系统上报上来的，各式各样的事件。系统会向事件中心说明：自己这个系统，会产生哪些事件呀，这些事件的格式是怎么样的呀。

别的系统如果感兴趣呢，就可以来主动订阅这些事件。真正赋予事件价值的，是事件消费者。事件消费者想看看,某个系统发生了什么变化呀？OK，那他就去订阅这些事件，所以事件是消费者驱动的。

这跟消息有什么区别呢？Command 消息的发送和订阅，是双方约定好的，外人不知道，往往是以文档或代码的形式，大家按约定好的协议，发送和订阅消费，所以消息是生产者驱动的。

我们打个比喻，事件就像市场经济，商品被生产出来，具体有什么价值，有多大价值，很大程度上看其消费者。我们能看到系统中各种各样的事件，就像橱窗里摆放了各种各样的商品。而 Command 消息呢，有点像计划经济，一出生就带着很强的目的性，我就是要“分配”给谁消费。

### 天然有序

事件的第三个特性是：“天然有序”。含义：同一个实体，不能同时发生 A 又发生 B，必有先后关系；如果是，则这两个事件必属于不同的事件类型。

比如：针对同一个交通信号灯，不能既变成绿灯，又变成红灯，同一时刻，只能变成一种状态。

![4.png](https://img.alicdn.com/imgextra/i3/O1CN01JLeMdq1Odvm1YGWqq_!!6000000001729-0-tps-1080-249.jpg)

大家可能发现了一点，这里其实隐藏了事件的一个额外属性：因为天然有序，跟时间轴上的某一时刻强绑定，且不能同时发生，所以它一定是唯一的。

如果我们看到了两个内容一样的事件，那么一定是发生了两次，而且一次在前，一次在后。（这对于我们处理数据最终一致性、以及系统行为分析都很有价值：我们看到的，不光光是系统的一个最终结果，而是看到变成这个结果之前的，一系列中间过程）

### 具像化

事件的第四个特性是：“具象化”的。

事件会尽可能的把“案发现场”完整的记录下来，因为它也不知道消费者会如何使用它，所以它会做到尽量的详尽，比如：

●是由谁产生的事件？Subject

●是什么类型的事件？Type

●是谁发送的事件？Source

●事件的唯一性标志是什么？Id

●什么时候发生？Time

●事件的内容是什么？Data

●事件的内容有哪些信息？Dataschema

我们还是以交通信号灯举例子：
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492874813-4fee1ef7-8c87-458b-b7bb-4427aeddae59.gif#clientId=ueeb82efb-2fb6-4&height=1&id=dKhj3&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf48e2dc3-eb8c-4a12-a191-ea1993da053&title=&width=1) -->

![5.png](https://img.alicdn.com/imgextra/i1/O1CN01wuhWAP1lij5BuolYX_!!6000000004853-2-tps-695-432.png)

对比我们常见的消息，因为上下游一般是确定的，常常为了性能和传输效率，则会做到尽可能的精简，只要满足“计划经济”指定安排的消费者需求即可。

总结一下，事件上面的 4 个特性，是对事件巨大的一个属性加成，让事件拥有了跟普通消息不一样的“超能力”。使事件，常常被用到 4 个典型场景：事件通知、事件溯源、系统间集成和 CQRS。
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492874914-78160d58-8238-40a1-9f6b-4ca5cc49d81b.gif#clientId=ueeb82efb-2fb6-4&height=1&id=f9gOR&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ufffb0dbb-e326-4e13-b5d3-f010ba35937&title=&width=1) -->

![6.png](https://img.alicdn.com/imgextra/i3/O1CN01Kl1H9M1rN64ep9tIt_!!6000000005618-0-tps-1080-592.jpg)

下面让我们一个个展开，具体看看这些应用场景。

## 事件的典型应用场景


### 事件通知

事件通知是我们系统中很常见的一个场景。比如：用户下单事件通知给支付系统；用户付款事件通知给交易系统。

这里，让我们回到一开始信号灯那个例子。当交通信号灯，从红灯变成绿灯时，可能存在很多系统都需要这个信息。

**方式 1:发送方主动调用，适配接收方**

一种最简单的方式是，我们依次 call 每个系统，并把信息传递出去。比如：信号灯系统，主动调用地图导航的 API 服务、调用交警中控的 API 服务，调用城市大脑的 API 服务，把红绿灯变化信号发送出去。
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492875318-d7e295e5-6ec6-4a71-8d8a-4d817cdc4764.gif#clientId=ueeb82efb-2fb6-4&height=1&id=K0umh&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5bd04ee6-9268-4f1b-a7ee-d80ff3e3390&title=&width=1) -->

![7.png](https://img.alicdn.com/imgextra/i1/O1CN01hzZNf11r173vsagQt_!!6000000005570-0-tps-676-590.jpg)

但我们都知道，这个设计非常糟糕。尤其当系统越来越多时，这无疑是灾难的，不仅开发成本高，而且其中一个系统出现问题，可能会 hang 住整个服务，则导致调用其他系统都会受到影响。

**方式 2：接收方主动订阅，适配发送方**

一个很自然的解决方案是，我们将这些信息发送到中间消息服务 Broker，其他系统如果有需要，则主动去订阅这些消息即可。
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492875385-5eac7019-64f3-4dba-84c3-a97dc8666b00.gif#clientId=ueeb82efb-2fb6-4&height=1&id=FNMBv&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ubfe77eb7-d3ae-4b6c-a3b0-3ceca7e844f&title=&width=1) -->

![8.png](https://img.alicdn.com/imgextra/i3/O1CN01yBjwcJ1DespC6Sydt_!!6000000000242-0-tps-648-552.jpg)

这个时候，信号灯系统与其他系统并没有直接的调用依赖，交警中控服务、地图导航服务、城市大脑服务，只要按照约定的协议，去订阅信号灯的消息，并解析这些信息即可。

但是，这里同样存在一个问题：这个架构中，是以“信号灯”为中心。消费者需要理解发送者的业务领域，并主动添加适配层，（就是图中白色回旋镖部分），将消息转化为自己业务领域内的语言。但对于每一个微服务来说，他都希望都是高内聚低耦合的。

如果交警中控需要全国的信号灯数据，但是每个地域的消息格式又不一样，这就意味着，交警中控需要适配每一个地域的协议，做一层转换。而且万一后面变化了怎么办？想想就知道这个运维成本有多可怕。

![9.png](https://img.alicdn.com/imgextra/i4/O1CN01lemboh1VmMNEDV96H_!!6000000002695-0-tps-1080-527.jpg)

那是否交警中控系统，可以要求全国所有红绿灯系统，都按同一种数据协议给到自己呢？不好意思，这些信号灯数据地图服务也在用，城市大脑也在用，不能更改。

**方式 3：引入事件，Borker 根据接收方协议，进行灵活适配**

但如果使用事件，就不一样了。因为事件是“无期望的”，“具像化的”，天然的保留了案发现场尽可能多的信息，且更加规范标准，对于消费者（也就是交警中空）来说，可以轻易将不同省份，收集上来的事件，轻易组装成，符合自己业务要求的格式。

![10.png](https://img.alicdn.com/imgextra/i2/O1CN017J0bR81EL1GLAMP1S_!!6000000000334-0-tps-1080-555.jpg)

而且，这一组装，是在中间层 Broker 发生的。对于交警中控来说，它只需要，按照自己业务领域的设计，提供一个接收事件的 API，然后其他事件，通过 Broker，主动投递到这个 API 上即可。从头到尾，对交警中控系统，没有一行适配外部业务的代码。

所以，这种方式有 3 个明显的优势：

1、只关注自己业务领域本身，不需要做适配外部的代码；

2、所有对系统的变更，收敛到 API，为唯一入口；同一个 API，可能既是用来接收事件的，也可能同时用于控制台操作；

3、因为事件是推送过来的，所以，也不需要像之前一样，引入一个 SDK，和 Broker 发生连接，获取消息，降低了系统的复杂度。

这样，我们一开始的图，就会变成这个样子：交通信号灯产生事件，投递到事件中心，其他需要这些事件的消费者，在事件中心订阅，再由事件中心，按照他们期望的事件格式，主动投递过去。
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492876112-f487a8e3-f521-4608-8ef9-181d87c05f65.gif#clientId=ueeb82efb-2fb6-4&height=1&id=zZmC7&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uee3defaa-48b0-42ab-b0b1-6d1a3a5c23f&title=&width=1) -->

![11.png](https://img.alicdn.com/imgextra/i3/O1CN01Ua2YKs1MyQGPPOc3p_!!6000000001503-0-tps-1080-656.jpg)

让我们再来回顾下整个过程：
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492876267-227c0948-54d5-4cf2-93f8-f3e50051e219.gif#clientId=ueeb82efb-2fb6-4&height=1&id=iNEQS&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua33b04f8-a619-44be-955f-afd47ddd31d&title=&width=1) -->

![12.png](https://img.alicdn.com/imgextra/i2/O1CN01sRQNVD1Coffm9FYZN_!!6000000000128-0-tps-1080-464.jpg)

第 1 幅图：一开始，我们通过强依赖的方式，让信号灯系统，主动将信息发送给各个系统。那这张图里，我们是以各个下游服务为中心，信号灯系统去适配各个下游服务。

第 2 幅图：后来，我们采用传统消息的方式，对调用链路进行了解耦，两边系统不再直接依赖了，但是依旧会存在业务上的依赖。消费者需要去理解生产者的消息格式，并在自己系统内部，进行转换适配。所以，这里其实是以生产者为中心。

第 3 幅图：最后，我们引入了事件通知的方式，对于这种方式，生产者和消费者，他们都只需要关注自己系统本身就可以了。生产者，生产什么样的事件，消费者，消费什么样的数据格式，都各自以自己的业务为中心，不需要为对方做适配。真正做到我们说的高内聚低耦合，实现彻底的完全解耦。

现在，回到我们一开始提到的典型微服务模型，对于有些场景，我们就可以变为下面这种方式：对微服务的变更操作，统一收敛到 API 操作入口，去掉 Command 消息入口。收敛入口，对于我们维护微服务，保障系统稳定性，常常非常有好处的。
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492876994-40850047-f5f1-4b15-9082-4b39c6e3a022.gif#clientId=ueeb82efb-2fb6-4&height=1&id=VbVWU&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub9285288-be64-47e9-b53a-39be971e4c4&title=&width=1) -->

![13.png](https://img.alicdn.com/imgextra/i3/O1CN01UKrulL1zzaHW4a1YS_!!6000000006785-0-tps-1080-450.jpg)

### 事件溯源

事件溯源是什么？事件溯源简单理解就是让系统回到过去任意时刻。那怎么样，才能让系统可以回到过去呢？很简单，首先系统所有发生的变化，都得以事件的方式记录下来；然后，我们就可以通过回放事件的方式，回到过去任何一个时刻。

那为什么只有事件才能做这个事，其他普通消息不行呢？这个还是要回到我们刚才说的几个事件特性：已发生不可变的、天然有序且唯一的、而且是非常详细具体的，完整的记录了事件的案发现场。所以，对于事件溯源这个场景，事件可以说是系统的一等一的公民。

举个例子：比如说，如果我们能够完整地收集路上的各种事件信息，包括信号灯、车量、天气、拥堵路况等等，那么，我们就可以“穿越时间”，回到交通现场，重新做一次决策。比如，在智慧交通场景，当我们想去验证一个调度算法的时候，我们就可以回放当时发生的所有事件，来重现现场。

![14.png](https://img.alicdn.com/imgextra/i2/O1CN012cIB7p1K85m9FU14d_!!6000000001118-0-tps-1080-525.jpg)

大家可能觉得这个很神奇，但是，其实我们平常一直有接触，大家知道是什么吗？就是我们常用的代码版本-管理系统，比如：github。

这里有大家可能会问，如果一个系统积赞了很多事件，想重放是不是得很久？比如在一些交易场景，每天都会产生大量的事件，那应该怎么处理呢？这里呢，系统一般每天晚上都会打一份快照。如果系统意外宕机，想回到某一个时刻，就可以把前一天的快照取出，然后再重新跑下当天的事件，即可恢复。而白天呢，所有的事件都是在内存中进行处理，不会跟数据库交互，所以系统性能非常快，只有事件会落盘。

当然，事件溯源也不是适合所有场景，它有优点也有缺点，详细看上图。

### 系统间集成

刚才讲的第1个场景：事件通知，一般涉及到两个上下游团队的协作开发；讲的第 2 个场景：事件溯源，则一般是 1 个团队内的开发；但系统间集成，则往往面对的是三个业务团队的协作开发。这个怎么理解呢？

其实这个也很常见：比如公司里购买了 ERP 系统，同时也购买了外部考勤系统、外部营销系统服务等等。这些系统都有一个共同点，是什么？都不是我们自己开发的，是而买来的。

![15.png](https://img.alicdn.com/imgextra/i1/O1CN01hKJZQD1rZSlbGlUrp_!!6000000005645-0-tps-1080-558.jpg)

如果我们想把 ERP 系统的人员信息，实时且自动同步到考勤系统中去怎么办？其实这个是有点麻烦的，因为这些都不是我们自己开发的。

1、我们不能修改 ERP 系统的代码，主动去调用考勤系统，把人员变更信息发送过去；

2、也不能修改考情系统的代码，主动去调用外部 ERP 系统的 API；

但是我们可以通过事件总线，借助 webhook 或则标准 API 等等方式，收集上游的 ERP 系统产生的人员变更事件，然后进行过滤和转换，推送到下游考勤系统中去，当然，这里也可以是内部自研服务。

所以，现在的研发模式变成了：事件中心管理了所有 SaaS 服务，包括内部自研系统产生的所有事件。然后呢，我们只需要在事件中心，寻找我们需要的事件，进行订阅，对 SaaS 服务和内部自研系统，进行简单服务编排，即可完成开发。

### CQRS

CQRS 中的 C 代表 Command，Command 什么意思？就是明令，一般包含：Create/Update/Delete，Q 代表 Query，是指查询。所以 CQRS 本质是读写分离：所有的写操作，在图中左边的系统中完成，然后将系统因为 Command 产生变化的事件,同步到右边的查询系统。

![16.png](https://img.alicdn.com/imgextra/i1/O1CN011SKTjt1bz54GK47V7_!!6000000003535-0-tps-1080-712.jpg)

这里同学可能有疑问，这跟数据库的读写分离有什么区别？数据库读写分离也是提供一个写的 DB，一个读的 DB，两边做同步。对吧…

那这里很大的一个区别是：对于数据库的读写分离，是以数据库为中心，两边的数据库是一模一样的，甚至数据的存储结构也是一模一样的。

但是对于 CQRS 的读写分离场景，是以业务为中心，两边存储的数据结构格式，往往是不一样的，甚至数据库都不是同一种。完全围绕各自的读写业务逻辑，设计最佳技术选型。对于写场景，为了保障事务，我们可能使用关系性数据库；对于读的场景，我们为了提高性能，我们可能会使用 Redis、HBase 等 Nosql 数据库。

当然 CQRS 也不是适合所有场景，他往往比较适合：

●希望同时满足高并发的写、高并发的读；

●写模型和读模型差别比较大时；

●读/写比非常高时；

我们刚才讲了事件的 4 个应用场景，但是，事件不是万能的，就像软件研发也没有银弹，有很多场景也并不适合-使用事件。包括：

1. 强依赖 Response 的同步调用场景；

2. 要求服务调用保持事务强一致性的场景。

## RocketMQ 关于事件的解决方案


### 需要什么样的能力？

首先，按照之前讲到的事件应用场景，我们整理下，如果我们做好事件驱动这块，我们的系统，需要具备什么样的能力呢？

![17.png](https://img.alicdn.com/imgextra/i1/O1CN01kZ8Hwe27qRIftq7t7_!!6000000007848-0-tps-1080-517.jpg)

第一，我们肯定得有一个事件标准，对吧…因为，事件不是给自己看的，也不是给他看的，而是给所有人看的。刚才，我们也讲到事件是无期望的，它没有明确的消费者，所有都是潜在的消费者，所以，我们得规范化事件的定义，让所有人都能看得懂，一目了然。

第二，我们得有一个事件中心，事件中心里面有所有系统，注册上来的各种事件，（这个跟消息不一样，我们没有消息中心，因为消息一般是定向的，是生产者和消费者约定的，有点像计划经济，消息生产出来的时候，带着很强的目的性，是给谁谁消费的。而事件有点像市场经济，事件中心呢，）这个有点类似市场经济大卖场，玲琅满目，里面分类摆放了各种各样的事件，所有人即使不买，也都可以进来瞧一瞧，看一看，有哪些事件，可能是我需要的，那就可以买回去。

第三，我们得有一个事件格式，用来描述事件的具体内容。这相当于市场经济的一个买卖契约。生产者发送的事件格式是什么，得确定下来，不能总是变；消费者以什么格式接收事件也得确定下来，不然整个市场就乱套了。

第四，我们得给消费者一个，把投递事件到目标端的能力。并且投递前，可以对事件进行过滤和转换，让它可以适配目标端 API 接收参数的格式，我们把这个过程呢，统一叫做订阅规则。

第五，我们还得有一个存储事件的地方，就是最中间的事件总线。

### 事件标准

关于刚才提到的第一点事件标准，我们选取了 CNCF 旗下的开源项目 CloudEvents，目前已被广泛集成，算是一个事实上的标准。

![18.png](https://img.alicdn.com/imgextra/i3/O1CN01MQQFqa1vejn96IhXc_!!6000000006198-0-tps-1080-547.jpg)

它的协议也很简单，主要规范了 4 个必选字段：id，source、type、specversion；以及多个可选字段：subject、time、dataschema、datacontenttype和data。上图右边，我们有一个简单的例子,大家可以看下，这里就不具体展开了。

另外，事件的传输也需要定义一种协议，方便不同系统之间的沟通，默认支持三种 HTTP 的传输方式：Binary Content Mode、Structured Content Mode 和 Batched Content Mode。通过 HTTP 的 Content-Type，就可以区分这三种不同的模式。其中前两种，都是传递单个事件；第三种则是传递批量事件。
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492878206-23b7cb83-a362-43dd-8f05-9d1ad155fb46.gif#clientId=ueeb82efb-2fb6-4&height=1&id=aovTX&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u49cecba9-8832-4c93-a209-c1d44157201&title=&width=1) -->

![19.png](https://img.alicdn.com/imgextra/i1/O1CN011lIM6q1eJoE5cR3CZ_!!6000000003851-0-tps-1080-405.jpg)

### 事件 Schema

事件的 Schema，用来描述事件中有哪些属性、对应的含义、约束等等信息。目前我们选取了 Json Schema. 和 OpenAPI 3.0，根据事件的 Schema 描述，我们可以对事件进行合法性校验。，当然 Schema 本身的修改，也需要符合兼容性原则，这里不作具体展开。

### 事件过滤和转换

关于事件的过滤和转换，我们提供了 7 种事件过滤方式和 4 种事件转换方式，详细可以下图描述：

![20.png](https://img.alicdn.com/imgextra/i2/O1CN01roBUJW1w4NyI30K2N_!!6000000006254-0-tps-1080-615.jpg)

### 技术架构

我们 RocketMQ 围绕事件驱动推出的产品，叫做 EventBridge，也是我们这次要开源的新产品。

他的整个架构可以分为两部分：上面是我们的控制面、下面是我们的数据面。

![21.png](https://img.alicdn.com/imgextra/i1/O1CN01dMDtcu1cx4x7an6rP_!!6000000003666-2-tps-1080-469.png)

控制面中最上面的 EventSource 是各个系统注册上来的事件源，这些事件可以通过 APIGateway 发送事件到事件总线，也可以通过配置的 EventSource，生成 SouceRuner，主动从我们的系统中，去拉取事件。事件到达事件总线 EventBus 之后，我们就可以配置订阅规则了 EventRule，在规则 EventRule 里我们设置了事件怎么过滤，以及投递到目标端前，做哪些转换。系统基于创建的规则会生成 TargetRunner，就可以将事件推送到指定的目标端。

那这里 SouceRuner 和 TargetRunner 是什么呢？我们具体能对接哪些上下游 Source 和 Target？

这些我们都可以在下面的 SourceRegister 和 TargetRegister 提前进行注册。

所以 EventBridge 的数据面是一个开放的架构，他定义了事件处理的SPI，底下可以有多种实现。比如，我们把 RocketMQ 的 HTTPConnector 注册到 EventBridge 中，那我们就可以把事件推送到 HTTP 服务端。

如果我们把 Kafka 的 JDBC Connector 注册到 EventBridge 中，我们就可以把事件推送到数据库。

当然，如果你的系统不是通用的像 HTTP/JDPC 等协议，也可以开发自己的 Connector，这样就能将事件实时同步到 EventBridge，或则接收来自 EventBridge 的事件。

除此之外，我们还会有一些附加的运维能力，包括：事件追踪、事件回放、事件分析、事件归档。

### RocketMQ-EventBridge 与云上

在所有开源的，与其他上下游系统做集成的 Connector 当中，我们有一个特殊的 Connector，叫：EventBridgeConnector，通过它可以方便的和阿里云云上的事件总线进行集成。这里有两个典型的应用场景：

第一个场景是：IDC 系统内部产生的事件，不仅可以用来做内部系统间的解耦，还可以实时同步到云上，驱动云上的一些计算服务，比如通过云上 Maxcompute 对内部产生的事件进行离线分析，或则驱动云上的图像识别服务，实时分析事件中标注的图片。

第二个场景是：如果 IDC 内部使用到了自建 MQ，我们同样可以通过 MQConnector 和 EventBridgeConnector，实时同步事件到云上，逐步将内部自建 MQ，迁移到云上MQ。
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680492879024-c92a87f7-2943-4235-8dfe-33421237a29d.gif#clientId=ueeb82efb-2fb6-4&height=1&id=kzFjC&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uddc20f2c-0ccb-4dd9-986a-3b8fbae8c79&title=&width=1) -->

![22.png](https://img.alicdn.com/imgextra/i1/O1CN01U06FnY1OaGbblwMsy_!!6000000001721-0-tps-1080-435.jpg)

### 生态发展

关于 EventBridge 的未来方向，我们希望是在开源，构建一个支持多云架构的事件总线生态。这个怎么理解？简单来说，我们希望在不同云厂商之间，包括云厂商和内部 IDC 系统之间，可以通过事件，来打破围墙，实现互通。虽然，这几年云计算发展很快，但是对于一些特别大的客户来讲，有时候并不希望跟某家云厂商强绑定。这不光是市场充分竞争的结果，也是大客户一种降低风险的手段。所以，这个时候，如何在不同云厂商之间，包括云厂商系统和自己内部 IDC 系统之间，灵活的交互，甚至灵活的迁移，是企业非常重要的一个诉求。

![23.png](https://img.alicdn.com/imgextra/i4/O1CN01Od4MYr20MU5P9tLtq_!!6000000006835-2-tps-1080-534.png)

当然，实现这个是有一定难度的。不过如果我们在进行企业架构设计的时候，是基于事件驱动架构进行设计开发——不同系统之间的交互，围绕事件展开，就会容易很多。

事件，在这里，就好比一种通用语言，通过这个通用语言，就可以实现和不同系统之间的沟通交流。比如：用 IDC 系统内部的事件，去驱动阿里云上服务；甚至用阿里云上的事件，去驱动 AWS 上的服务运行；

为了实现这个目标，我们在和不同云厂商，不同 SaaS 系统服务商，进行系统间集成的时候，需要开发与之对应的连接器。

也欢迎大家，一起来共建 RocketMQ-EventBridge 的生态。

源码地址：

[https://github.com/apache/rocketmq-eventbridge](https://github.com/apache/rocketmq-eventbridge)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://img.alicdn.com/imgextra/i4/O1CN01Xi1rcu1DM6aIC7ypz_!!6000000000201-0-tps-1920-675.jpg)
