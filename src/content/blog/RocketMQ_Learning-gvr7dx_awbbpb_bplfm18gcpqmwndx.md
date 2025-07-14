---
title: "朗新科技集团如何用Apache RocketMQ“快、准、狠”破解业务难题？"
description: "朗新科技集团如何用Apache RocketMQ“快、准、狠”破解业务难题？"
date: "2025-07-08"
category: "case"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

![](https://img.alicdn.com/imgextra/i2/O1CN01XuPZRM1N0FwVM67tG_!!6000000001507-2-tps-820-154.png)

## <font style="color:#2F8EF4;">朗新科技集团：让数字化的世界更美好</font>
<font style="color:rgba(0, 0, 0, 0.9);">朗新科技集团股份有限公司是领先的能源科技企业，长期深耕电力能源领域，通过新一代数字化、人工智能、物联网、电力电子技术等新质生产力，服务城市、产业、生活中的能源场景，推动社会绿色发展。</font>

<font style="color:rgba(0, 0, 0, 0.9);">朗新科技集团初创于 1996 年，总部位于江苏无锡，在国内外设有多个研发中心和分支机构，长期为超过 1.2 万多家政企客户和 4.7 亿多大众生活用户提供技术与运营服务，在电力营销数字化、新能源汽车聚合充电、分布式光伏云以及家庭能源缴费等领域处于全国领先地位。</font>

<font style="color:rgba(0, 0, 0, 0.9);">朗新科技集团持续在相关领域探索创新，推动能源绿色低碳转型，惠及千家万户。作为国家鼓励的重点软件企业，朗新荣获了多项行业权威认证和奖项，连续四年荣登中国新经济企业 500 强榜单，并在多个能源科技细分领域保持领先地位，促进整个行业的繁荣发展。</font>

![](https://img.alicdn.com/imgextra/i3/O1CN01FGOwqM1s2Job884ue_!!6000000005708-49-tps-760-428.webp)



## <font style="color:#2F8EF4;">业务扩张背景下，消息队列面临诸多挑战</font>
<font style="color:rgba(0, 0, 0, 0.9);">朗新科技集团的核心业务之一聚焦于聚合充电场景，专注面向企业（ToB）和政府（ToG）提供充电桩业务。在充电桩系统中，关键事件包括“充电开始”、“充电结束”、“故障告警”等。通过分布式消息队列 RocketMQ 可以实现这些事件消息的异步处理，以增强系统的灵活性和可扩展性。此外，RocketMQ 还承担着传递计费请求、支付状态等消息的重要职责，对于确保整个支付流程顺畅进行至关重要。</font><font style="color:rgba(0, 0, 0, 0.9);">  
</font>

<font style="color:rgba(0, 0, 0, 0.9);">然而，随着新能源汽车产业的迅猛发展，新能源汽车保有量激增，充电桩规模以及充电服务需求呈现指数级增长趋势。在此背景下，朗新科技集团积极实施战略扩张，但原先基于阿里云 ECS 自建并维护的开源 RocketMQ 却逐渐暴露出诸多问题，包括运维成本高、系统稳定性不足以及难以应对大规模的数据吞吐量等，这些问题对用户体验造成了显著影响。核心业务痛点如下：</font>

**<font style="color:rgba(0, 0, 0, 0.9);">1. 稳定性问题：</font>**<font style="color:rgba(0, 0, 0, 0.9);">出现消息丢失现象。ToB 和 ToG 业务对于服务的可用性和数据的可靠性要求极高，消息数据丢失是不可接受的。因为一条充电桩状态消息的丢失，就可能导致用户跑空电却无法充电的问题，对用户体验造成很大影响。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">2. 系统架构缺少容灾：</font>**<font style="color:rgba(0, 0, 0, 0.9);">充电桩业务对跨可用区、跨地域容灾有迫切需求，随着业务规模增长，以及产业中心的分布式转移规划，明确需要建设跨地域容灾系统。然而，技术团队在多可用区容灾方面的技术储备与经验不够丰富。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">3. 运维成本过高：</font>**<font style="color:rgba(0, 0, 0, 0.9);">每天业务消息量的波峰波谷明显且差值较大，波谷期资源利用率偏低，容易导致资源浪费，造成成本冗余。此外，临时扩容周期长且需大量人力投入。</font>



## <font style="color:#2F8EF4;">共建云消息队列 RocketMQ 版：优势显著，业务难题迎刃而解</font><font style="color:rgba(0, 0, 0, 0.9);background-color:rgb(242, 98, 46);"></font>
### <font style="color:rgba(0, 0, 0, 0.9);">稳定可靠&弹性降本</font><font style="color:rgb(33, 33, 34);"></font>
<font style="color:rgba(0, 0, 0, 0.9);">针对业务痛点 1 和 3，</font>**<font style="color:rgba(0, 0, 0, 0.9);">朗新决定与阿里云共建云消息队列 RocketMQ 版 5.0 Serverless系列。</font>**<font style="color:rgba(0, 0, 0, 0.9);">其作为 RocketMQ 的商业版本，在确保消息收、发的可靠性以及实现数据多副本存储方面，都有卓越的表现。Serverless 系列能够有效应对流量波峰波谷显著的问题，不仅有助于降低资源成本，还减少了实例弹性伸缩和运维的人力投入。带来的核心优势如下：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">提高服务可用性：</font>**<font style="color:rgba(0, 0, 0, 0.9);">自建开源 RocketMQ 的 SLA 保障不充分，一旦出现故障，需要运维人员自行处理和恢复等。而云消息队列 RocketMQ 版原生支持多可用区部署，</font><font style="color:rgba(0, 0, 0, 0.9);">服务可用性最高可达 99.99%。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">提高数据可靠性：</font>**<font style="color:rgba(0, 0, 0, 0.9);">自建开源 RocketMQ 需要运维人员自行管理多副本 HA，运维门槛高。而云消息队列 RocketMQ 版默认支持三副本 HA，提供数据的多级存储，数据可靠性最高可达 10个9。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">提高资源利用率，降低成本：</font>**<font style="color:rgba(0, 0, 0, 0.9);">自建开源 RocketMQ 为了确保能够处理业务峰值流量，需要按照最高需求购买实例规格，容易造成资源浪费。而云消息队列 RocketMQ 版 5.0 Serverless 系列采用动态资源调整策略，根据实时业务负载自动弹性伸缩，按量付费，无需预先估算并配置实例规格。</font>

![](https://img.alicdn.com/imgextra/i2/O1CN01lhjaXr1QaqQfSDGDQ_!!6000000001993-2-tps-1080-328.png)

<font style="color:rgba(0, 0, 0, 0.9);background-color:rgb(242, 98, 46);">  
</font>

### <font style="color:rgba(0, 0, 0, 0.9);">提高可用性和容错力</font><font style="color:rgb(33, 33, 34);"></font>
<font style="color:rgba(0, 0, 0, 0.9);">针对业务痛点 2，朗新当前自建开源 RocketMQ 采用的是单中心系统架构，当单中心异常时，将影响整个业务系统。为此，</font>**<font style="color:rgba(0, 0, 0, 0.9);">朗新计划采用云消息队列 RocketMQ 版建设双活中心，</font>**<font style="color:rgba(0, 0, 0, 0.9);">以提升系统的可用性和容错能力。云消息队列 RocketMQ 版提供全球消息备份的容灾能力，能够支持多中心灾备、双活系统架构的系统建设。带来的核心优势如下：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">提高数据可靠性：</font>**<font style="color:rgba(0, 0, 0, 0.9);">通过在两地数据中心的消息中间件之间实现全量数据同步备份，提高数据可靠性。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">增强服务连续性：</font>**<font style="color:rgba(0, 0, 0, 0.9);">借助消息服务的两地容灾机制，保证服务高可用性，业务可快速恢复，延续性强。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">降低开发成本：</font>**<font style="color:rgba(0, 0, 0, 0.9);">简化配置和管理，轻松实现两地数据的相互备份，提高效率并节省业务的开发成本。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01eP4suX1QvSFllZ7HL_!!6000000002038-2-tps-1080-597.png)

## <font style="color:#2F8EF4;">为何选择云消息队列 RocketMQ 版？</font>
<font style="color:rgba(0, 0, 0, 0.9);">朗新之所以和阿里云共建云消息队列 RocketMQ 版，主要归于以下几个关键因素：</font><font style="color:rgba(0, 0, 0, 0.9);"></font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">高可靠性和高可用性：</font>**<font style="color:rgba(0, 0, 0, 0.9);">RocketMQ 诞生于阿里巴巴集团，历经多年“双十一”万亿级数据洪峰验证。作为国内领先的云服务提供商之一，阿里云运营着国内规模最大的 RocketMQ 集群，支撑了云上数十万客户的生产应用实践。云消息队列 RocketMQ 版提供 SLA，保障服务的高可用性和数据的高可靠性，为企业核心业务链路保驾护航。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">支持灾备与双活架构：</font>**<font style="color:rgba(0, 0, 0, 0.9);">云消息队列 RocketMQ 版通过成熟的产品化能力和解决方案，助力企业快速构建灾备、双活系统架构。面对数据中心或地域级别的故障时，能够实现业务的快速切换与恢复，从而有效避免业务上的巨大损失，显著增强系统的整体稳定性。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">Serverless 弹性降本：</font>**<font style="color:rgba(0, 0, 0, 0.9);">云消息队列 RocketMQ 版 5.0 Serverless 系列采用存储计算分离架构，具备自适应弹性能力，能够高效处理突发流量，并且无需运维，按实际使用量计费。朗新在切换到云消息队列 RocketMQ 版 Serverless 实例后，</font>**<font style="color:#2F8EF4;">使用成本相较自建降低了 30%。</font>**

<font style="color:rgba(0, 0, 0, 0.9);">展望未来，朗新科技集团将进一步深化与阿里云消息队列团队的合作，依托自身丰富的能源领域技术实践，以及阿里云强大的基础设施、产品能力，携手推进行业数字化进程，促进能源科技行业的发展。</font>


