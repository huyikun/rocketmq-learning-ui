---
title: "同程旅行网基于 RocketMQ  高可用架构实践"
date: "2021/06/30"
author: "阿里云云原生 "
img: "https://img.alicdn.com/imgextra/i1/O1CN014qaKZI1uYx29y6HT6_!!6000000006050-0-tps-685-383.jpg"
tags: ["practice"]
description: "我们在几年前决定引入 MQ 时，市场上已经有不少成熟的解决方案，比如 RabbitMQ , ActiveMQ，NSQ，Kafka 等。考虑到稳定性、维护成本、公司技术栈等因素，我们选择了 RocketMQ。"
---
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680488719050-8b1990f3-92d9-427d-9bc5-3147f6ac2349.jpeg#clientId=u111e1e84-2636-4&from=paste&id=u0ff033b8&originHeight=523&originWidth=800&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ued30e642-2290-49e3-a39d-8c582f4aedc&title=)
# 背景介绍
## 为何选择 RocketMQ
我们在几年前决定引入 MQ 时，市场上已经有不少成熟的解决方案，比如 RabbitMQ , ActiveMQ，NSQ，Kafka 等。考虑到稳定性、维护成本、公司技术栈等因素，我们选择了 RocketMQ ：

- 纯 Java 开发，无依赖，使用简单，出现问题能 hold ；
- 经过阿里双十一考验，性能、稳定性可以保障；
- 功能实用，发送端：同步、异步、单边、延时发送；消费端：消息重置，重试队列，死信队列；
- 社区活跃，出问题能及时沟通解决。
## 使用情况

- 主要用于削峰、解耦、异步处理；
- 已在火车票、机票、酒店等核心业务广泛使用，扛住巨大的微信入口流量；
- 在支付、订单、出票、数据同步等核心流程广泛使用；
- 每天 1000+ 亿条消息周转。

下图是 MQ 接入框架图

由于公司技术栈原因，client sdk 我们提供了 java sdk ；对于其他语言，收敛到 http proxy ，屏蔽语言细节，节约维护成本。按照各大业务线，对后端存储节点进行了隔离，相互不影响。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488719066-4159a6e9-d376-43a3-ad67-e7da68e62b8b.png#clientId=u111e1e84-2636-4&from=paste&id=ub49ef748&originHeight=437&originWidth=866&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u08074ef1-a275-45f0-8b2f-e372cbcb876&title=)
# MQ 双中心改造
之前单机房出现过网络故障，对业务影响较大。为保障业务高可用，同城双中心改造提上了日程。

## 为何做双中心

- 单机房故障业务可用；
- 保证数据可靠：若所有数据都在一个机房，一旦机房故障，数据有丢失风险；
- 横向扩容：单机房容量有限，多机房可分担流量。
## 双中心方案
做双中心之前，对同城双中心方案作了些调研，主要有冷（热）备份、双活两种。（当时社区 Dledger 版本还没出现，Dledger 版本完全可做为双中心的一种可选方案。）

1）同城冷（热）备份

两个独立的 MQ 集群, 用户流量写到一个主集群，数据实时同步到备用集群，社区有成熟的 RocketMQ Replicator 方案，需要定期同步元数据，比如主题，消费组，消费进度等。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488721086-66e309ce-fea1-417c-850c-125c6bdd2b26.png#clientId=u111e1e84-2636-4&from=paste&id=ub2220cc8&originHeight=420&originWidth=866&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua0399fa0-6b62-4c6b-a98e-dba141fbfc7&title=)
2）同城双活

两个独立 MQ 集群，用户流量写到各自机房的 MQ 集群，数据相互不同步。

平时业务写入各自机房的 MQ 集群，若一个机房挂了，可以将用户请求流量全部切到另一个机房，消息也会生产到另一个机房。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488718943-09774a0c-cc23-4aa4-bf4f-329b38c56a2f.png#clientId=u111e1e84-2636-4&from=paste&id=u587b592b&originHeight=391&originWidth=675&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub9d0dd62-66fb-4bf9-b277-1721f673475&title=)

对于双活方案，需要解决 MQ 集群域名。
1）若两个集群用一个域名，域名可以动态解析到各自机房。此方式要求生产、消费必须在同一个机房。假如生产在 idc1 ，消费在 idc2 ，这样生产、消费各自连接一个集群，没法消费数据。
2）若一个集群一个域名，业务方改动较大，我们之前对外服务的集群是单中心部署的，业务方已经大量接入，此方案推广较困难。
为尽可能减少业务方改动，域名只能继续使用之前的域名，最终我们采用一个 Global MQ 集群，跨双机房，无论业务是单中心部署还是双中心部署都不影响；而且只要升级客户端即可，无需改动任何代码。
## 双中心诉求

- 就近原则：生产者在 A 机房，生产的消息存于 A 机房 broker ； 消费者在 A 机房，消费的消息来自 A 机房 broker 。
- 单机房故障：生产正常，消息不丢。
- broker 主节点故障：自动选主。
## 就近原则
简单说，就是确定两件事：

- 节点（客户端节点，服务端节点）如何判断自己在哪个 idc；
- 客户端节点如何判断服务端节点在哪个 idc。

**如何判断自己在哪个 idc?**

1) ip 查询
节点启动时可以获取自身 ip ，通过公司内部的组件查询所在的机房。

2）环境感知
需要与运维同学一起配合，在节点装机时，将自身的一些元数据，比如机房信息等写入本地配置文件，启动时直接读写配置文件即可。
我们采用了第二个方案，无组件依赖，配置文件中 logicIdcUK 的值为机房标志。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680488719009-3838b15c-79c4-40cf-ba3a-e01d3120fca6.jpeg#clientId=u111e1e84-2636-4&from=paste&id=u94185b25&originHeight=230&originWidth=1226&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u790673bb-d2ce-4421-be9b-1809a573d3e&title=)
**客户端节点如何识别在同一个机房的服务端节点？**

客户端节点可以拿到服务端节点的 ip 以及 broker 名称的，因此：

- ip 查询：通过公司内部组件查询 ip 所在机房信息；
- broker 名称增加机房信息：在配置文件中，将机房信息添加到 broker 名称上；
- 协议层增加机房标识：服务端节点向元数据系统注册时，将自身的机房信息一起注册。

相对于前两者，实现起来略复杂，改动了协议层， 我们采用了第二种与第三种结合的方式。
## 就近生产
基于上述分析，就近生产思路很清晰，默认优先本机房就近生产；

若本机房的服务节点不可用，可以尝试扩机房生产，业务可以根据实际需要具体配置。
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488721497-9d79e359-e974-488b-8fe7-723526716e6b.png#clientId=u111e1e84-2636-4&from=paste&id=u74414efe&originHeight=345&originWidth=866&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua47d93d6-c29f-47d3-b05a-f7332d21b3b&title=)
## 就近消费
优先本机房消费，默认情况下又要保证所有消息能被消费。

队列分配算法采用按机房分配队列

- 每个机房消息平均分给此机房消费端；
- 此机房没消费端，平分给其他机房消费端。

伪代码如下：


Map<String, Set> mqs = classifyMQByIdc(mqAll);
Map<String, Set> cids = classifyCidByIdc(cidAll);
Set<> result = new HashSet<>;
for(element in mqs){
                     result.add(allocateMQAveragely(element, cids, cid)); //cid为当前客户端
}

消费场景主要是消费端单边部署与双边部署。

单边部署时，消费端默认会拉取每个机房的所有消息。
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488721703-bef1ab62-57f1-48c0-b957-17e7e6caa3db.png#clientId=u111e1e84-2636-4&from=paste&id=ua8da3a05&originHeight=452&originWidth=866&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue3a583e6-2f3b-4c18-80a2-acf37cca6ea&title=)
双边部署时，消费端只会消费自己所在机房的消息，要注意每个机房的实际生产量与消费端的数量，防止出现某一个机房消费端过少。
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488721597-c143448c-32fa-4ff1-9cd7-944cbc45e680.png#clientId=u111e1e84-2636-4&from=paste&id=uc49e0132&originHeight=347&originWidth=866&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua5a36a23-6805-47b0-a53a-ded43403d74&title=)
## 单机房故障

- 每组 broker 配置

一主两从，一主一从在一机房，一从在另一机房；某一从同步完消息，消息即发送成功。

- 单机房故障

消息生产跨机房；未消费消息在另一机房继续被消费。
## 故障切主
在某一组 broker 主节点出现故障时，为保障整个集群的可用性，需要在 slave 中选主并切换。要做到这一点，首先得有个broker 主故障的仲裁系统，即 nameserver（以下简称 ns ）元数据系统（类似于 redis 中的哨兵）。

ns 元数据系统中的节点位于三个机房（有一个第三方的云机房，在云上部署 ns 节点，元数据量不大，延时可以接受），三个机房的 ns 节点通过 raft 协议选一个leader，broker 节点会将元数据同步给 leader, leader 在将元数据同步给 follower 。

客户端节点获取元数据时, 从 leader，follower 中均可读取数据。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488721983-a151ab1e-7114-4ab1-95cc-a814fa0e9f9a.png#clientId=u111e1e84-2636-4&from=paste&id=u2d8c2dbb&originHeight=375&originWidth=866&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua02f717b-7b2e-4726-a70e-c13419fda6d&title=)
### 切主流程

- 若 nameserver leader 监控到 broker 主节点异常, 并要求其他 follower 确认；半数 follower 认为 broker 节点异常，则 leader 通知在 broker 从节点中选主，同步进度大的从节点选为主;
- 新选举的 broker 主节点执行切换动作并注册到元数据系统；
- 生产端无法向旧 broker 主节点发送消息。

流程图如下
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488722091-d710b0a2-c44b-4e3a-9cb5-307a1d749cae.png#clientId=u111e1e84-2636-4&from=paste&id=ub7381f19&originHeight=393&originWidth=866&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u71b59458-11b6-40e1-8766-05afd246cdc&title=)![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488722510-025c0e7e-157e-40fe-bf49-77d679693a32.png#clientId=u111e1e84-2636-4&from=paste&id=u99c2efe1&originHeight=1&originWidth=1&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub8294af3-fe4f-4738-9426-9a0bd8c2840&title=)

**切中心演练**

用户请求负载到双中心，下面的操作先将流量切到二中心---回归双中心---切到一中心。确保每个中心均可承担全量用户请求。
先将用户流量全部切到二中心
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488722606-0f0c0a80-8ab2-472b-a56e-16b9efba732f.png#clientId=u111e1e84-2636-4&from=paste&id=u0e063d06&originHeight=381&originWidth=866&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud67a6d80-07a6-41be-b9dc-ffc6953b4f4&title=)
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488722613-a414e06f-8e5c-4b13-a932-c94fd08e8a1a.png#clientId=u111e1e84-2636-4&from=paste&id=ud4407da3&originHeight=1&originWidth=1&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6db61a33-c97d-40b4-918b-a316390d41c&title=)
流量回归双中心，并切到一中心

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488722752-14a1dd8a-91cd-422d-84ee-ab75324b3077.png#clientId=u111e1e84-2636-4&from=paste&id=u7ff90971&originHeight=370&originWidth=866&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub573ef39-67f4-423b-944c-1775d8668e8&title=)
**回顾**

- 全局 Global 集群
- 就近原则
- 一主二从，写过半消息即及写入成功
- 元数据系统 raft 选主
- broker 主节点故障，自动选主
# MQ 平台治理
即使系统高性能、高可用，倘若随便使用或使用不规范，也会带来各种各样的问题，增加了不必要的维护成本，因此必要的治理手段不可或缺。

## 目的
让系统更稳定

- 及时告警
- 快速定位、止损
## 治理哪些方面
**主题/消费组治理**

- 申请使用

生产环境 MQ 集群，我们关闭了自动创建主题与消费组，使用前需要先申请并记录主题与消费组的项目标识与使用人。一旦出现问题，我们能够立即找到主题与消费组的负责人，了解相关情况。若存在测试，灰度，生产等多套环境，可以一次申请多个集群同时生效的方式，避免逐个集群申请的麻烦。

- 生产速度

为避免业务疏忽发送大量无用的消息，有必要在服务端对主题生产速度进行流控，避免这个主题挤占其他主题的处理资源。

- 消息积压

对消息堆积敏感的消费组，使用方可设置消息堆积数量的阈值以及报警方式，超过这个阈值，立即通知使用方；亦可设置消息堆积时间的阈值，超过一段时间没被消费，立即通知使用方。

- 消费节点掉线

消费节点下线或一段时间无响应，需要通知给使用方。
**客户端治理**

- 发送、消费耗时检测

监控发送/消费一条消息的耗时，检测出性能过低的应用，通知使用方着手改造以提升性能；同时监控消息体大小，对消息体大小平均超过 10 KB 的项目，推动项目启用压缩或消息重构，将消息体控制在 10 KB 以内。

- 消息链路追踪

一条消息由哪个 ip 、在哪个时间点发送，又由哪些 ip 、在哪个时间点消费，再加上服务端统计的消息接收、消息推送的信息，构成了一条简单的消息链路追踪，将消息的生命周期串联起来，使用方可通过查询msgId或事先设置的 key 查看消息、排查问题。

- 过低或有隐患版本检测

随着功能的不断迭代，sdk 版本也会升级并可能引入风险。定时上报 sdk 版本，推动使用方升级有问题或过低的版本。
**服务端治理**

- 集群健康巡检

如何判断一个集群是健康的？定时检测集群中节点数量、集群写入 tps 、消费 tps ，并模拟用户生产、消费消息。

- 集群性能巡检

性能指标最终反映在处理消息生产与消费的时间上。服务端统计处理每个生产、消费请求的时间，一个统计周期内，若存在一定比例的消息处理时间过长，则认为这个节点性能有问题；引起性能问题的原因主要是系统物理瓶颈，比如磁盘 io util 使用率过高，cpu load 高等，这些硬件指标通过夜鹰监控系统自动报警。

- 集群高可用

高可用主要针对 broker 中 master 节点由于软硬件故障无法正常工作，slave 节点自动被切换为 master ，适合消息顺序、集群完整性有要求的场景。

**部分后台操作展示**
主题与消费组申请
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488722977-40cf6d14-2b7f-4c43-992c-1992228f31cc.png#clientId=u111e1e84-2636-4&from=paste&id=u5d4b7496&originHeight=437&originWidth=866&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0375c15e-6082-4679-a613-d75011f9904&title=)
生产，消费，堆积实时统计

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680488723438-aa1308c0-d752-41de-9692-52091aa2fde6.png#clientId=u111e1e84-2636-4&from=paste&id=ue4041d3e&originHeight=481&originWidth=866&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u838695df-fa49-4817-92ff-ea88a3402eb&title=)

集群监控
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680488723374-35b53c61-558a-4cb0-bf9c-a88ceef5ad9e.jpeg#clientId=u111e1e84-2636-4&from=paste&id=uc399a8a5&originHeight=443&originWidth=864&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u67e15dd2-464d-4779-9483-9b14cad222d&title=)
**踩过的坑**

社区对 MQ 系统经历了长时间的改进与沉淀，我们在使用过程中也到过一些问题，要求我们能从深入了解源码，做到出现问题心不慌，快速止损。

- 新老消费端并存时，我们实现的队列分配算法不兼容，做到兼容即可；
- 主题、消费组数量多，注册耗时过长，内存 oom ，通过压缩缩短注册时间，社区已修复；
- topic 长度判断不一致，导致重启丢消息，社区已修复；
- centos 6.6 版本中，broker 进程假死，升级 os 版本即可。
### **MQ 未来展望**
目前消息保留时间较短，不方便对问题排查以及数据预测，我们接下来将对历史消息进行归档以及基于此的数据预测。

- 历史数据归档
- 底层存储剥离，计算与存储分离
- 基于历史数据，完成更多数据预测
- 服务端升级到 Dledger ，确保消息的严格一致

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)