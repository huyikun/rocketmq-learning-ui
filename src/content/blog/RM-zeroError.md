---
title: "阿里的 RocketMQ  如何让双十一峰值之下 0 故障？"
date: "2021/04/03"
author: "愈安"
img: "https://img.alicdn.com/imgextra/i2/O1CN01wm5r0z1xnYVbMfyLp_!!6000000006488-0-tps-685-383.jpg"
tags: ["practice"]
description: "2020 年双十一交易峰值达到 58.3 W 笔/秒，消息中间件 RocketMQ 继续数年 0 故障丝般顺滑地完美支持了整个集团大促的各类业务平稳。"
---

2020 年双十一交易峰值达到 58.3 W 笔/秒，消息中间件 RocketMQ 继续数年 0 故障丝般顺滑地完美支持了整个集团大促的各类业务平稳。2020 年双十一大促中，消息中间件 RocketMQ 发生了以下几个方面的变化：

- **云原生化实践**：完成运维层面的云原生化改造，实现 Kubernetes 化。
- **性能优化**：消息过滤优化交易集群性能提升 30%。
- **全新的消费模型**：对于延迟敏感业务提供新的消费模式，降低因发布、重启等场景下导致的消费延迟。
# 云原生化实践
## 1. 背景
Kubernetes 作为目前云原生化技术栈实践中重要的一环，其生态已经逐步建立并日益丰富。目前，服务于集团内部的 RocketMQ 集群拥有巨大的规模以及各种历史因素，因此在运维方面存在相当一部分痛点，我们希望能够通过云原生技术栈来尝试找到对应解决方案，并同时实现降本提效，达到无人值守的自动化运维。
消息中间件早在 2016 年，通过内部团队提供的中间件部署平台实现了容器化和自动化发布，整体的运维比 2016 年前已经有了很大的提高，但是作为一个有状态的服务，在运维层面仍然存在较多的问题。
中间件部署平台帮我们完成了资源的申请，容器的创建、初始化、镜像安装等一系列的基础工作，但是因为中间件各个产品都有自己不同的部署逻辑，所以在应用的发布上，就是各应用自己的定制化了。中间件部署平台的开发也不完全了解集团内 RocketMQ 的部署过程是怎样的。
因此在 2016 年的时候，部署平台需要我们去亲自实现消息中间件的应用发布代码。虽然部署平台大大提升了我们的运维效率，甚至还能实现一键发布，但是这样的方案也有不少的问题。比较明显的就是，当我们的发布逻辑有变化的时候，还需要去修改部署平台对应的代码，需要部署平台升级来支持我们，用最近比较流行的一个说法，就是相当不云原生。
同样在故障机替换、集群缩容等操作中，存在部分人工参与的工作，如切流，堆积数据的确认等。我们尝试过在部署平台中集成更多消息中间件自己的运维逻辑，不过在其他团队的工程里写自己的业务代码，确实也是一个不太友好的实现方案，因此我们希望通过 Kubernetes 来实现消息中间件自己的 operator 。我们同样希望利用云化后云盘的多副本能力来降低我们的机器成本并降低主备运维的复杂程度。
经过一段时间的跟进与探讨，最终再次由内部团队承担了建设云原生应用运维平台的任务，并依托于中间件部署平台的经验，借助云原生技术栈，实现对有状态应用自动化运维的突破。
## 2. 实现
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487316738-dc09fad9-5273-4056-bee1-319eba8c92d5.png#clientId=ua6eecafb-d364-4&from=paste&id=uf9fc11af&originHeight=623&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua7425122-4ec2-465b-872f-98d47db497a&title=)
整体的实现方案如上图所示，通过自定义的 CRD 对消息中间件的业务模型进行抽象，将原有的在中间件部署平台的业务发布部署逻辑下沉到消息中间件自己的 operator 中，托管在内部 Kubernetes 平台上。该平台负责所有的容器生产、初始化以及集团内一切线上环境的基线部署，屏蔽掉 IaaS 层的所有细节。
Operator 承担了所有的新建集群、扩容、缩容、迁移的全部逻辑，包括每个 pod 对应的 brokerName 自动生成、配置文件，根据集群不同功能而配置的各种开关，元数据的同步复制等等。同时之前一些人工的相关操作，比如切流时候的流量观察，下线前的堆积数据观察等也全部集成到了 operator 中。当我们有需求重新修改各种运维逻辑的时候，也再也不用去依赖通用的具体实现，修改自己的 operator 即可。
最后线上的实际部署情况去掉了图中的所有的 replica 备机。在 Kubernetes 的理念中，一个集群中每个实例的状态是一致的，没有依赖关系，而如果按照消息中间件原有的主备成对部署的方案，主备之间是有严格的对应关系，并且在上下线发布过程中有严格的顺序要求，这种部署模式在 Kubernetes 的体系下是并不提倡的。若依然采用以上老的架构方式，会导致实例控制的复杂性和不可控性，同时我们也希望能更多的遵循 Kubernetes 的运维理念。
云化后的 ECS 使用的是高速云盘，底层将对数据做了多备份，因此数据的可用性得到了保障。并且高速云盘在性能上完全满足 MQ 同步刷盘，因此，此时就可以把之前的异步刷盘改为同步，保证消息写入时的不丢失问题。云原生模式下，所有的实例环境均是一致性的，依托容器技术和 Kubernetes 的技术，可实现任何实例挂掉（包含宕机引起的挂掉），都能自动自愈，快速恢复。
解决了数据的可靠性和服务的可用性后，整个云原生化后的架构可以变得更加简单，只有 broker 的概念，再无主备之分。
## 3. 大促验证
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487316721-4b13e169-d8df-47c8-9931-aebfc217b5da.png#clientId=ua6eecafb-d364-4&from=paste&id=ud0fd178c&originHeight=377&originWidth=864&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u758ec9b6-0d97-4a83-b912-1ff6ecabfa9&title=)
上图是 Kubernetes 上线后双十一大促当天的发送 RT 统计，可见大促期间的发送 RT 较为平稳，整体符合预期，云原生化实践完成了关键性的里程碑。
# 性能优化
## 1. 背景
RocketMQ 至今已经连续七年 0 故障支持集团的双十一大促。自从 RocketMQ 诞生以来，为了能够完全承载包括集团业务中台交易消息等核心链路在内的各类关键业务，复用了原有的上层协议逻辑，使得各类业务方完全无感知的切换到 RocketMQ 上，并同时充分享受了更为稳定和强大的 RocketMQ 消息中间件的各类特性。
当前，申请订阅业务中台的核心交易消息的业务方一直都在不断持续增加，并且随着各类业务复杂度提升，业务方的消息订阅配置也变得更加复杂繁琐，从而使得交易集群的进行过滤的计算逻辑也变得更为复杂。这些业务方部分沿用旧的协议逻辑（Header 过滤），部分使用 RocketMQ 特有的 SQL 过滤。
## 2. 主要成本
目前集团内部 RocketMQ 的大促机器成本绝大部分都是交易消息相关的集群，在双十一零点峰值期间，交易集群的峰值和交易峰值成正比，叠加每年新增的复杂订阅带来了额外 CPU 过滤计算逻辑，交易集群都是大促中机器成本增长最大的地方。
## 3. 优化过程
由于历史原因，大部分的业务方主要还是使用 Header 过滤，内部实现其实是aviator 表达式。仔细观察交易消息集群的业务方过滤表达式，可以发现绝大部分都指定类似MessageType == xxxx这样的条件。翻看 aviator 的源码可以发现这样的条件最终会调用 Java 的字符串比较String.compareTo()。
由于交易消息包括大量不同业务的 MessageType，光是有记录的起码有几千个，随着交易业务流程复杂化，MessageType 的增长更是繁多。随着交易峰值的提高，交易消息峰值正比增长，叠加这部分更加复杂的过滤，持续增长的将来，交易集群的成本极可能和交易峰值指数增长，因此决心对这部分进行优化。
原有的过滤流程如下，每个交易消息需要逐个匹配不同 group 的订阅关系表达式，如果符合表达式，则选取对应的 group 的机器进行投递。如下图所示：
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487318573-394213d4-b7fb-45f7-9fb9-2a9bbc1cb582.png#clientId=ua6eecafb-d364-4&from=paste&id=u406fbbd5&originHeight=218&originWidth=841&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6ff78400-0121-4b9b-8ce6-2e906fefec6&title=)
对此流程进行优化的思路需要一定的灵感，在这里借助数据库索引的思路：原有流程可以把所有订阅方的过滤表达式看作数据库的记录，每次消息过滤就相当于一个带有特定条件的数据库查询，把所有匹配查询（消息）的记录（过滤表达式）选取出来作为结果。为了加快查询结果，可以选择 MessageType 作为一个索引字段进行索引化，每次查询变为先匹配 MessageType 主索引，然后把匹配上主索引的记录再进行其它条件(如下图的 sellerId 和 testA )匹配，优化流程如下图所示：
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487316597-b223b1b1-21fb-4ace-9998-7992dbbd7aad.png#clientId=ua6eecafb-d364-4&from=paste&id=u774a19ba&originHeight=229&originWidth=844&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u94bc5c53-b451-4ee2-915e-37d2f250c80&title=)
以上优化流程确定后，要关注的技术点有两个：

- 如何抽取每个表达式中的 MessageType 字段？
- 如何对 MessageType 字段进行索引化？

对于技术点 1 ，需要针对 aviator 的编译流程进行 hook ，深入 aviator 源码后，可以发现 aviator 的编译是典型的Recursive descent，同时需要考虑到提取后父表达式的短路问题。
在编译过程中针对 messageType==XXX 这种类型进行提取后，把原有的 message==XXX 转变为 true/false 两种情况，然后针对 true、false 进行表达式的短路即可得出表达式优化提取后的情况。例如：

表达式：
messageType=='200-trade-paid-done' && buyerId==123456
提取为两个子表达式：
子表达式1（messageType==200-trade-paid-done）：buyerId==123456 
子表达式2（messageType!=200-trade-paid-done）：false


- 具体到 aviator 的实现里，表达式编译会把每个 token 构建一个 List ，类似如下图所示(为方便理解，绿色方框的是 token ，其它框表示表达式的具体条件组合)：

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487316598-9cb1c79f-27cb-48f4-a341-1d7fd1a4d99d.png#clientId=ua6eecafb-d364-4&from=paste&id=ucf56bc94&originHeight=163&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2f0905de-126b-4f01-a407-dc0cdcbda0c&title=)
提取了 messageType ，有两种情况：

- 情况一：messageType == '200-trade-paid-done'，则把之前 token 的位置合并成true，然后进行表达式短路计算，最后优化成 buyerId==123456 ，具体如下：

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487319225-d850b13f-a234-47dd-bfae-cd100d5f2d3c.png#clientId=ua6eecafb-d364-4&from=paste&id=u6cd8a6d4&originHeight=145&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1220a4d4-fe73-4383-b027-437f877e516&title=)

- 情况二：messageType != '200-trade-paid-done'，则把之前 token 的位置合并成 false ，表达式短路计算后，最后优化成 false ，具体如下：

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487319313-21f6948a-7e38-4646-a25f-91c016314684.png#clientId=ua6eecafb-d364-4&from=paste&id=u3d53f622&originHeight=175&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u314f0ba7-ed99-4acb-9ff7-2418653ba9a&title=)
这样就完成 messageType 的提取。这里可能有人就有一个疑问，为什么要考虑到上面的情况二，messageType != '200-trade-paid-done'，这是因为必须要考虑到多个条件的时候，比如：
(messageType=='200-trade-paid-done' && buyerId==123456) || (messageType=='200-trade-success' && buyerId==3333)
就必须考虑到不等于的情况了。同理，如果考虑到多个表达式嵌套，需要逐步进行短路计算。但整体逻辑是类似的，这里就不再赘述。
说完技术点 1，我们继续关注技术点 2，考虑到高效过滤，直接使用 HashMap 结构进行索引化即可，即把 messageType 的值作为 HashMap 的 key ，把提取后的子表达式作为 HashMap 的 value ，这样每次过滤直接通过一次 hash 计算即可过滤掉绝大部分不适合的表达式，大大提高了过滤效率。
## 3. 优化效果
该优化最主要降低了 CPU 计算逻辑，根据优化前后的性能情况对比，我们发现不同的交易集群中的订阅方订阅表达式复杂度越高，优化效果越好，这个是符合我们的预期的，其中最大的 CPU 优化有**32%**的提升，大大降低了本年度 RocketMQ 的部署机器成本。
# 全新的消费模型 —— POP 消费
## 1. 背景
RocketMQ 的 PULL 消费对于机器异常 hang 时并不十分友好。如果遇到客户端机器 hang 住，但处于半死不活的状态，与 broker 的心跳没有断掉的时候，客户端 rebalance 依然会分配消费队列到 hang 机器上，并且 hang 机器消费速度很慢甚至无法消费的时候，这样会导致消费堆积。另外类似还有服务端 Broker 发布时，也会由于客户端多次 rebalance 导致消费延迟影响等无法避免的问题。如下图所示：
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487319490-91d4089d-0726-40de-9bb9-1e85820b98ab.png#clientId=ua6eecafb-d364-4&from=paste&id=uba90007e&originHeight=538&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u417c93cf-c39d-410a-8e89-e548d36633d&title=)
当 Pull Client 2 发生 hang 机器的时候，它所分配到的三个 Broker 上的 Q2 都出现严重的红色堆积。对于此，我们增加了一种新的消费模型 —— POP 消费，能够解决此类稳定性问题。如下图所示：
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487319751-c4f06ba5-354e-4470-9f2f-8cc9ca7f1bc6.png#clientId=ua6eecafb-d364-4&from=paste&id=uaf68221d&originHeight=486&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4c8c0348-8edb-4f74-af55-8051f1d8e77&title=)
POP 消费中，三个客户端并不需要 rebalance 去分配消费队列，取而代之的是，它们都会使用 POP 请求所有的 broker 获取消息进行消费。broker 内部会把自身的三个队列的消息根据一定的算法分配给请求的 POP Client。即使 Pop Client 2 出现 hang，但内部队列的消息也会让 Pop Client1 和 Pop Client2 进行消费。这样就 hang 机器造成的避免了消费堆积。
## 2. 实现
POP 消费和原来 PULL 消费对比，最大的一点就是弱化了队列这个概念，PULL 消费需要客户端通过 rebalance 把 broker 的队列分配好，从而去消费分配到自己专属的队列，新的 POP 消费中，客户端的机器会直接到每个 broker 的队列进行请求消费， broker 会把消息分配返回给等待的机器。随后客户端消费结束后返回对应的 Ack 结果通知 broker，broker 再标记消息消费结果，如果超时没响应或者消费失败，再会进行重试。
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487319801-491c09a9-6788-4485-a658-75e14d346147.png#clientId=ua6eecafb-d364-4&from=paste&id=ub992389b&originHeight=578&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u927f1333-ffc8-47a3-bdbc-545a076bbe0&title=)
POP 消费的架构图如上图所示。Broker 对于每次 POP 的请求，都会有以下三个操作：

- 对应的队列进行加锁，然后从 store 层获取该队列的消息；
- 然后写入 CK 消息，表明获取的消息要被 POP 消费；
- 最后提交当前位点，并释放锁。

CK 消息实际上是记录了 POP 消息具体位点的定时消息，当客户端超时没响应的时候，CK 消息就会重新被 broker 消费，然后把 CK 消息的位点的消息写入重试队列。如果 broker 收到客户端的消费结果的 Ack ，删除对应的 CK 消息，然后根据具体结果判断是否需要重试。
从整体流程可见，POP 消费并不需要 reblance ，可以避免 rebalance 带来的消费延时，同时客户端可以消费 broker 的所有队列，这样就可以避免机器 hang 而导致堆积的问题。
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680487320148-257d8a64-c00b-4975-8311-40591e671eb4.png#clientId=ua6eecafb-d364-4&from=paste&id=ufddff238&originHeight=271&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u362bf374-281c-4abb-8604-ab6d34a786f&title=)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)