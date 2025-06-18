---
title: "曹操出行借助 ApsaraMQ for Kafka Serverless 提升效率，成本节省超 20%"
description: "曹操出行借助 ApsaraMQ for Kafka Serverless 提升效率，成本节省超 20%"
date: "2025-06-18"
category: "case"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

![](https://img.alicdn.com/imgextra/i3/O1CN018kAIMl1XASvI5rz5A_!!6000000002883-49-tps-1080-720.webp)

> <font style="color:rgb(136, 136, 136);">本文整理于 2024 年云栖大会主题演讲《云消息队列 ApsaraMQ Serverless 演进》，杭州优行科技有限公司消息中间件负责人王智洋分享 ApsaraMQ for Kafka Serverless 助力曹操出行实现成本优化和效率提升的实践经验。</font>
>

## <font style="color:#2F8EF4;">曹操出行：科技驱动共享出行未来</font>
<font style="color:rgba(0, 0, 0, 0.9);">曹操出行创立于 2015 年 5 月 21 日，是吉利控股集团布局“新能源汽车共享生态”的战略性投资业务，目前已经发展为中国领先的共享出行平台，曹操出行以“科技重塑绿色共享出行”为使命，将全球领先的互联网、车联网、自动驾驶技术以及新能源科技，创新应用于共享出行领域，以“用心服务国民出行”为品牌主张，致力于打造服务口碑最好的出行品牌。  
</font>

![](https://img.alicdn.com/imgextra/i3/O1CN01RlGFFs1VfUWIqyJrT_!!6000000002680-49-tps-1080-608.webp)

## <font style="color:#2F8EF4;">曹操出行的 Kafka 应用实践</font>
<font style="color:rgba(0, 0, 0, 0.9);">曹操出行将 Apache Kafka 应用于在线服务、可观测性、车联网、业务运营数据分析等业务场景。业务流量有明显的波峰波谷，如早晚高峰、节假日、极端天气等，都会导致流量突增。</font><font style="color:rgba(0, 0, 0, 0.9);">  
</font>

<font style="color:rgba(0, 0, 0, 0.9);">曹操出行的数据来源广泛，包括 LBS、乘客、司机、新能源、车联网、基础研发等业务线。</font><font style="color:rgba(0, 0, 0, 0.9);">这些数据，如日志、binlog、链路追踪等，被采集并缓存到 Kafka 中，然后分发给不同的数据系统进行处理。</font><font style="color:rgba(0, 0, 0, 0.9);">  
</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01Zl0awv29mtYU0TT0N_!!6000000008111-49-tps-1080-608.webp)

## <font style="color:#2F8EF4;">曹操出行的 Kafka 架构演进</font>
<font style="color:rgba(0, 0, 0, 0.9);">随着业务规模的不断扩大，曹操出行决定将 Kafka 迁移上云，以实现业务效率与成本控制的双重优化。曹操出行从自建 Kafka 迁移到阿里云云消息队列 Kafka 版（ApsaraMQ for Kafka）v3 版本后，不仅实现了效率的显著提升和成本的有效降低，还简化了架构，大幅减轻了运维的复杂性。</font><font style="color:rgba(0, 0, 0, 0.9);">  
</font>

<font style="color:rgba(0, 0, 0, 0.9);">下图清晰地展示了曹操出行的 Kafka 架构迁移至云端前后的对比。左侧为迁移前的自建 Kafka 架构，右侧为迁移至阿里云云消息队列 Kafka 版 v3 后的架构。</font>

![](https://img.alicdn.com/imgextra/i3/O1CN01HIQQ891VE0l3dU8nw_!!6000000002620-49-tps-1080-608.webp)

<font style="color:rgba(0, 0, 0, 0.9);">以下是迁移后架构的主要优化点：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">全托管、免运维：</font>**<font style="color:rgba(0, 0, 0, 0.9);">云消息队列 Kafka 版提供全托管服务，基于存算分离架构，实现了计算的无状态化和存储的托管化，从而帮助曹操出行免除了系统级运维的投入，显著提升了运维效率。原先复杂繁琐的运维工作，如集群的部署、升级、扩缩容、topic 迁移、leader rebalance 等操作，现在简化为购买集群、升级集群、集群升配三个主要操作，曹操出行无需感知和参与扩缩容和 topic 迁移的具体过程。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">高可用、高可靠：</font>**<font style="color:rgba(0, 0, 0, 0.9);">开源 Kafka 通过 ISR 机制实现服务高可用和数据高可靠，但计算和存储混杂，副本机制复杂度高，问题排查难度大。云消息队列 Kafka 版基于存算分离架构，实现各计算节点无状态且共享存储，不仅降低了复杂度，还提高了可运维性。计算节点高可用基于自研轻量 Leader 切换机制实现，在稳定提供读写服务的同时又能优雅轻便地 Leader 转移，是云消息队列 Kafka 版高效弹缩的核心底座。云消息队列 Kafka 版在存储层面基于阿里云飞天盘古 DFS，支持跨数据中心容灾，提供百微秒级平均延迟、毫秒级长尾延迟，数据可靠性 12个9，可用性 5个9。因此，迁移后的架构可靠性和可用性都得到了显著的提升。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">全面的可观测性：</font>**<font style="color:rgba(0, 0, 0, 0.9);">云消息队列 Kafka 版 v3 提供了全面的可观测能力，帮助曹操出行构建了一套全方位的监控告警体系，以确保系统运行的稳定性和问题的响应速度。它不仅提供了曹操出行日常查看和定位业务问题所需的关键指标，如消息的生产消费速度和堆积程度、分区生产和消费倾斜等，还通过自动监控和处理 zk、broker 的负载信息，磁盘使用情况和 topic 分布信息等，简化了曹操出行需要关注的指标，使其能够更专注于业务本身，而无需过多关注底层细节。</font>



## <font style="color:#2F8EF4;">ApsaraMQ for Kafka Serverless助力曹操出行降本提效</font>
<font style="color:rgba(0, 0, 0, 0.9);">随着业务持续增长，曹操出行采用了 ApsaraMQ for Kafka Serverless 系列，凭借其秒级弹性扩展和按需付费的优势，在实现灵活扩缩容的同时，保证了服务的敏捷性和稳定性，并节省了</font><font style="color:#2F8EF4;">超过 20% </font><font style="color:rgba(0, 0, 0, 0.9);">的成本。</font><font style="color:rgba(0, 0, 0, 0.9);">  
</font>

<font style="color:rgba(0, 0, 0, 0.9);">具体业务价值包括：</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">无需系统级运维，提供全托管服务</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">存算分离架构升级、服务高可用、数据高可靠</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">兼容开源大数据生态、兼容阿里云特色生态</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">秒级弹性，灵活扩缩容，成本节省 20% 以上</font>

![](https://img.alicdn.com/imgextra/i3/O1CN016a8dAM1Q3PVo9u2ut_!!6000000001920-49-tps-1080-608.webp)

## <font style="color:#2F8EF4;">ApsaraMQ for Kafka 的架构优势</font>
<font style="color:rgba(0, 0, 0, 0.9);">随着云计算的广泛采纳和云基础设施的日益成熟，ApsaraMQ for Kafka 依托于阿里云成熟、强大的基础设施，如云服务器、飞天盘古存储系统、容器服务等经过大规模验证的产品，为系统的整体性能和稳定性提供了坚实的基础。  
</font>

<font style="color:rgba(0, 0, 0, 0.9);">ApsaraMQ for Kafka 基于存算分离架构，对 Apache Kafka 的存储引擎进行了深度重构，实现了计算节点 Broker 的无状态化，充分利用弹性云存储，从而做到 Kafka 云服务的端到端弹性，实现了真正的 Serverless 架构。其中弹性云存储采用飞天盘古 DFS ，其构建于高性能的分布式存储系统之上，能够支持百万级客户，达到百微秒级平均延迟、毫秒级长尾延迟，并具备多 AZ 强一致多副本数据冗余。Serverless架构为 ApsaraMQ for Kafka 带来低成本、高性能等诸多价值。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01FzcVlb1uRAWwg0soF_!!6000000006033-49-tps-1080-608.webp)

<font style="color:rgba(0, 0, 0, 0.9);">在成本方面，由于数据直接写入高可靠的盘古 DFS，计算层 Broker 无流量复制，极大地降低了计算节点的 CPU 和网络带宽消耗，计算成本节约 60% 以上。存储层依赖盘古 DFS 实现高可靠的数据存储，并通过纠删码、冷热分层、基于 CIPU 软硬件协同优化等技术，有效降低了存储成本。同时消息存储数据还能够动态调控转冷比例，转储到对象存储，持续降低存储成本，按量阶梯付费，用得越多越便宜。得益于这套架构，ApsaraMQ for Kafka 相比社区版 Kafka 在支持同等业务规模的场景下，实际使用的资源成本得以数倍降低。</font>

<font style="color:rgba(0, 0, 0, 0.9);">在性能方面，采用 OpenMessaging Benchmark Framework</font><sup>**<font style="color:#2F8EF4;">[1]</font>**</sup><font style="color:rgba(0, 0, 0, 0.9);">对 ApsaraMQ for Kafka 和 Apache Kafka 3.3 进行了攒批发送与碎片化发送场景下的吞吐延迟对比测试，测试结果显示，在攒批发送与碎片化发送场景下，ApsaraMQ for Kafka 在 TP999 的延迟表现整体均优于 Apache Kafka，并且随着吞吐的增加，这种性能优势更加明显，碎片化发送场景快十倍。</font>

![](https://img.alicdn.com/imgextra/i2/O1CN01FP7xZD1L7vKt462Pb_!!6000000001253-49-tps-1080-513.webp)

<font style="color:rgb(136, 136, 136);">攒批发送，不同吞吐下 TP999 发送延迟对比</font>

![](https://img.alicdn.com/imgextra/i3/O1CN01jIqEff1da0hxs4UGB_!!6000000003751-49-tps-1080-510.webp)

<font style="color:rgb(136, 136, 136);">攒批发送，不同吞吐下 TP999 端到端延迟对比  
</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01H5Stgr1uybRWqeVRx_!!6000000006106-49-tps-860-572.webp)

<font style="color:rgb(136, 136, 136);">碎片化发送，不同吞吐下 TP999 发送延迟对比</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01qJAlIS21gT4SSqooP_!!6000000007014-49-tps-874-588.webp)
<font style="color:rgb(136, 136, 136);">碎片化发送，不同吞吐下 TP999 端到端延迟对比</font>

## <font style="color:#2F8EF4;">未来展望</font>
<font style="color:rgba(0, 0, 0, 0.9);">曹操出行将与阿里云消息队列团队继续深化合作，共同探索并优化其消息队列架构，以应对日益增长的业务需求及挑战。并通过实际应用场景中的反馈，推动阿里云云消息队列 ApsaraMQ 产品迭代升级，不断完善解决方案，满足更多企业复杂多变的业务需求。</font><font style="color:rgba(0, 0, 0, 0.9);">  
</font>

**<font style="color:rgba(0, 0, 0, 0.9);">相关链接：  
</font>**

<font style="color:rgba(0, 0, 0, 0.9);">[1] </font><font style="color:rgba(0, 0, 0, 0.9);">OpenMessaging Benchmark Framework</font>

_<u><font style="color:rgb(0, 122, 170);">https://openmessaging.cloud/docs/benchmarks/</font></u>_

<font style="color:rgba(0, 0, 0, 0.9);">  
</font>

<font style="color:rgba(0, 0, 0, 0.9);">点击</font>[**阅读原文**](https://yunqi.aliyun.com/2024/group?spm=5176.29615464.J_7493026540.23.4f414c84pvnkag&groupId=9415)<font style="color:rgba(0, 0, 0, 0.9);">，观看本场直播回放。</font>


