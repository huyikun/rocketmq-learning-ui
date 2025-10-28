---
title: "PalmPay 基于 Apache RocketMQ 搭建非洲普惠金融“高速通道”"
description: "PalmPay 基于 Apache RocketMQ 搭建非洲普惠金融“高速通道”"
date: "2025-10-28"
category: "case"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

_<font style="color:rgb(136, 136, 136);">作者：横槊、建源、文婷、稚柳</font>_

## <font style="color:#2F8EF4;">PalmPay：非洲领先的移动支付平台</font>
<font style="color:rgba(0, 0, 0, 0.9);">PalmPay 是非洲知名的移动支付平台，目前主要在尼日利亚、加纳、</font><font style="color:rgba(0, 0, 0, 0.9);">坦桑尼亚、</font><font style="color:rgba(0, 0, 0, 0.9);">肯尼亚</font><font style="color:rgba(0, 0, 0, 0.9);">开展金融科技服务，</font><font style="color:rgba(0, 0, 0, 0.9);">提供</font><font style="color:rgba(0, 0, 0, 0.9);">包括电子支付、转账汇款、手机话费及流量充值、水电煤及有线电视等便民缴费服务。</font>

<font style="color:rgba(0, 0, 0, 0.9);">自 2018 年成立以来，PalmPay 深耕非洲市场，也迅速成为非洲领先的金融科技公司，对非洲的金融格局产生了切实的影响。</font><font style="color:rgba(0, 0, 0, 0.9);">PalmPay 致力于提供安全、易用、创新的数字支付服务，获得了数百万用户和商家的信任与支持，推动了整个非洲大陆普惠金融的发展。</font>

<font style="color:rgba(0, 0, 0, 0.9);">随着非洲基础设施的不断完善和互联网消费需求的持续增长，</font><font style="color:rgba(0, 0, 0, 0.9);">PalmPay </font><font style="color:rgba(0, 0, 0, 0.9);">未来会拓展更多国家，不断实现更强大的技术创新和更广阔的地域覆盖，为更多非洲用户提供便捷的支付服务。通过在本地化内容领域的不懈深耕，致力于为非洲用户带来更方便、更多元的互联网体验。</font>

![](https://img.alicdn.com/imgextra/i3/O1CN01hZLEFo26L0cwmYcVh_!!6000000007644-49-tps-1080-586.webp)

## <font style="color:#2F8EF4;">高速增长下的“阵痛”：支付业务面临的技术挑战</font>
<font style="color:rgba(0, 0, 0, 0.9);">作为一家金融科技公司，PalmPay 致力于为用户提供便捷、安全且灵活的移动支付与金融服务。随着业务规模持续扩张，用户基数与终端设备数量激增，对后台系统提出了更高要求。为了提升运营效率和服务质量，PalmPay 面临着以下技术挑战：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">交易事务一致性</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">在分布式系统中，业务逻辑通常涉及数据库操作和消息发送（如支付后发送扣款通知）。若数据库操作成功但消息发送失败，会导致数据不一致。传统方式需自行实现补偿机制，复杂且容易出错。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">高效的消息处理</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">在高并发支付场景下，消息系统的性能至关重要。当业务量突增导致消息中间件性能下降时，会大幅增加平均响应时间，致使业务处理出现明显延迟，从而影响用户体验。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">资源的弹性伸缩：</font>**<font style="color:rgba(0, 0, 0, 0.9);">按照业务峰值配置资源的传统方式，在业务低谷期会造成资源闲置浪费，当面对突发流量时，实例扩容速度较慢，可能无法在短时间内完成扩容，进而影响服务稳定性。</font>

<font style="color:rgba(0, 0, 0, 0.9);">为应对上述挑战，</font>**<font style="color:#2F8EF4;">PalmPay 采用了基于阿里云 RocketMQ 消息中间件——云消息队列 RocketMQ 版，</font>**<font style="color:rgba(0, 0, 0, 0.9);">显著提升了整体架构的稳定性和可扩展性，提高了消息处理效率，确保了高并发场景下的业务连续性，最终优化了用户体验。</font>

## <font style="color:#2F8EF4;">破局之道：阿里云 RocketMQ 如何化解三大挑战</font>
![](https://img.alicdn.com/imgextra/i1/O1CN01YXHvUO24Wnah3irV9_!!6000000007399-49-tps-1080-556.webp)

<font style="color:rgba(0, 0, 0, 0.9);">PalmPay 通过</font>**<font style="color:rgba(0, 0, 0, 0.9);">云消息队列 RocketMQ 版与业务系统集成的解决方案</font>****<font style="color:rgba(0, 0, 0, 0.9);">，</font>**<font style="color:rgba(0, 0, 0, 0.9);">结合其支付核心系统的特点，显著提升了整体架构的稳定性与可扩展性，优化了消息处理效率，确保了高并发交易场景下的业务连续性与数据一致性，从而进一步提升了用户体验和服务质量。此外</font><font style="color:rgba(0, 0, 0, 0.9);">，通过在本地进行私有化部署，满足了其合规性要求。</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">RocketMQ 事务消息在支付业务中的应用</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">在支付业务中，用户完成交易后，系统需将支付结果（如支付成功/失败）实时推送至用户端（如 App 通知、短信或邮件），并确保支付系统内部的交易状态与消息推送系统保持一致。</font><font style="color:rgba(0, 0, 0, 0.9);">RocketMQ 事务消息通过“半消息（Half Message）”与“事务回查（Transaction Check）”机制，确保了本地事务提交与消息发送紧密耦合。只有本地事务提交成功，消息才会被真正发送并对消费者可见；若本地事务失败，消息则会被回滚或丢弃。该机制极大地保证了本地数据与消息通知之间的一致性。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">RocketMQ 在高并发交易处理中的作用</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">业务高峰期，PalmPay 面临巨大的交易并发压力。传统架构下，交易请求直接打到业务系统，容易造成系统拥堵甚至雪崩。为此，PalmPay 将 RocketMQ 作为交易异步处理的核心组件，通过消息队列实现交易请求的缓冲与削峰填谷。RocketMQ 的高性能写入能力和横向扩展架构，使其能够轻松应对突发流量，确保系统在高负载下依然保持稳定运行。同时，RocketMQ 的广播与集群消费模式支持多种消费策略，帮助 PalmPay 实现了灵活的负载均衡机制，进而提升了系统整体的吞吐能力和响应速度，SLA 稳定性支持 99.99%。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">资源弹性伸缩与运维效率提升</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">结合阿里云 RocketMQ Serverless 的技术优势，PalmPay 实现了消息队列资源的按需弹性伸缩。系统可在业务低谷时自动释放闲置资源以降低运营成本，并在流量高峰时快速扩容以保障服务稳定性。同时，RocketMQ 提供了完善的消息追踪、监控告警和自动运维能力，显著降低了系统运维的复杂度，提升了整体运维效率。</font>

<font style="color:rgba(0, 0, 0, 0.9);">通过这一系列基于 RocketMQ 的技术优化，PalmPay 成功构建了一个高可用、高可靠、高弹性的消息中间件体系。这不仅为非洲地区日益增长的数字支付需求提供了坚实的技术支撑，也为未来业务的持续扩展和全球化布局奠定了坚实的基础。</font>

## <font style="color:#2F8EF4;">云消息队列 RocketMQ 版 5.x Serverless 系列核心优势</font>
<font style="color:rgba(0, 0, 0, 0.9);">云消息队列 RocketMQ 版 5.x Serverless 系列基于存算分离架构，可在保证稳定性的前提下，通过资源快速伸缩实现资源使用量与实际业务负载紧密匹配，并支持按照实际使用量计费，从而有效降低运维压力和使用成本。</font>

<font style="color:rgba(0, 0, 0, 0.9);">在业务波动较大的场景下，非 Serverless 实例（包年包月和按量付费）与 Serverless 实例</font><font style="color:rgba(0, 0, 0, 0.9);">在使用规格上存在明显差异，具体</font><font style="color:rgba(0, 0, 0, 0.9);">变化情况如下图所示：</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01CilfQg216kDDTkI3I_!!6000000006936-2-tps-1401-596.png)

<font style="color:rgba(0, 0, 0, 0.9);">云消息队列 RocketMQ 版 Serverless 实例具备灵活的资源伸缩能力，能够满足业务在不同发展阶段的资源需求。其核心优势如下：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">开箱即用，兼容开源版本：</font>**<font style="color:rgba(0, 0, 0, 0.9);">以业务应用为中心，</font><font style="color:rgba(0, 0, 0, 0.9);">使开发人员</font><font style="color:rgba(0, 0, 0, 0.9);">无需关注 Serverless 实例的资源规模与稳定性，能更专注于核心业务代码的开发，进而降低企业的运维成本。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">自适应弹性：</font>**<font style="color:rgba(0, 0, 0, 0.9);">Serverless 实例采用动态资源调整策略，可根据实时业务负载自动弹性伸缩，企业因此无需预先估算并配置实例规格，减少资源闲置浪费。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">按实际使用量付费：</font>**<font style="color:rgba(0, 0, 0, 0.9);">根据实际使用的消息量、Topic 资源、网络流量、存储等资源计算费用，并按小时结算，真正实现按量付费，从而节省使用成本。</font>

## <font style="color:#2F8EF4;">展望未来：加速非洲普惠金融发展创新</font>
<font style="color:rgba(0, 0, 0, 0.9);">通过采用阿里云云消息队列 RocketMQ 版，PalmPay 成功构建了一套高可用、高可靠、高弹性的消息中间件体系，全面提升了系统的稳定性、消息处理效率与业务连续性。云消息队列 RocketMQ 版在支付消息通知、高并发交易处理以及资源弹性伸缩等方面发挥了关键作用，有力支撑了 PalmPay 在非洲市场快速增长的数字支付需求。</font>

<font style="color:rgba(0, 0, 0, 0.9);">借助云消息队列 RocketMQ 版的高性能、低延迟和灵活扩展能力，PalmPay 实现了支付业务的异步化、解耦化与智能化升级，不仅优化了用户体验，也显著提升了系统运维效率和业务响应能力。未来，随着 PalmPay 持续拓展更多金融服务场景，云消息队列 RocketMQ 版将继续为其提供坚实的技术底座，助力其在非洲乃至全球推动普惠金融的深入发展与数字化创新。</font>


