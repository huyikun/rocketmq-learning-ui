---
title: "古茗奶茶：借助 RocketMQ Serverless 实现下单丝滑、大促自由，综合降本 40%"
description: "古茗奶茶：借助 RocketMQ Serverless 实现下单丝滑、大促自由，综合降本 40%"
date: "2026-02-25"
category: "case"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

> <font style="color:rgba(0, 0, 0, 0.55);">最近，“千问请全国人民喝奶茶”活动火爆全网，这种瞬时爆发的流量洪峰已成为新茶饮行业的常态化挑战。新茶饮行业的数字化演进已从最初的基础设施上云，演进为深度的云原生架构共创与能力共建，再到为 AI 原生提供确定性基座，古茗奶茶在阿里云云原生上的深度实践，正是这种演进的代表。</font>
>

<font style="color:rgb(63, 63, 63);">在新茶饮行业，每一次刷屏级的营销活动，每一杯奶茶的“丝滑”下单，背后都是对数字化基座的严峻考验，是一场应对瞬时高并发流量的技术硬仗。</font>

<font style="color:rgb(63, 63, 63);">作为拥有超万家门店的行业头部品牌，古茗不仅要支撑海量日常订单，更需在“周三会员日”等大促时刻，从容应对流量陡增，确保系统稳如磐石。面对高并发下的极速响应与弹性需求，古茗如何实现“大促自由”？</font>

<font style="color:rgb(63, 63, 63);">本期《云故事探索》栏目走进古茗，揭秘支撑新茶饮“万店时代”的云原生力量。</font>

## <font style="color:#2F8EF4;">从口味之争到体验之战，技术成为新茶饮竞争力</font>
<font style="color:rgb(63, 63, 63);">“如今，一杯奶茶的竞争已不仅限于口味。”古茗科技技术运维负责人刘星光表示，在新茶饮这条日趋激烈的赛道上，</font>**<font style="color:rgb(63, 63, 63);">“口味决定品牌的记忆度，但真正拉开差距的，是门店高峰期的稳定体验、新品迭代的速度，以及消费者触达的精准度。”</font>**

<font style="color:rgb(63, 63, 63);">对于古茗而言，数字化的核心价值并非上线了多少系统，而是</font><font style="color:rgb(63, 63, 63);">打通了供应链、门店与营销等环节，</font><font style="color:rgb(63, 63, 63);">以数据驱动决策，</font><font style="color:rgb(63, 63, 63);">让成功的运营模式能在全国范围内快速复制。</font>

<font style="color:rgb(63, 63, 63);">这意味着技术团队的角色已从“系统维护者”升级为“业务赋能者”，不仅要保障系统稳定运行，更要支撑业务的高速增长与敏捷创新。</font>

![](https://img.alicdn.com/imgextra/i2/O1CN01Ecjz8h1zgoBygKVal_!!6000000006744-2-tps-1080-564.png)

_<font style="color:rgb(136, 136, 136);">古茗科技 技术运维负责人 刘星光</font>_

## <font style="color:#2F8EF4;">架构升级：微服务+DevOps，实现业务敏捷与体验统一</font>
<font style="color:rgb(63, 63, 63);">为支撑万店扩张与高频营销，</font><font style="color:rgb(63, 63, 63);">古茗构建了以“微服务 + DevOps”为核心的云原生架构。</font><font style="color:rgb(63, 63, 63);">订单、会员、库存、营销等核心业务被拆分为独立微服务，可独立开发、部署与扩缩容。其中</font><font style="color:rgb(63, 63, 63);">，</font>**<font style="color:rgb(63, 63, 63);">阿里云微服务引擎 MSE</font>**<font style="color:rgb(63, 63, 63);"> </font><font style="color:rgb(63, 63, 63);">作为服务注册与配置中心，在保障系统高可用的同时，也让古茗更聚焦业务研发。</font>

<font style="color:rgb(63, 63, 63);">架构升级带来的直接收益是迭代速度显著提升。刘星光表示：“一个新的优惠策略，如今可在数天内完成验证并上线，实现快速试错、快速复制。”2025 年，古茗完成底层架构的全面云原生升级，确保全国用户下单体验的一致性。</font>

<font style="color:rgb(63, 63, 63);">但微服务化也带来了调用链路复杂、峰值压力集中等挑战。要在流量洪峰下保持系统稳定，</font>**<font style="color:rgb(63, 63, 63);">“异步解耦”</font>**<font style="color:rgb(63, 63, 63);">与</font>**<font style="color:rgb(63, 63, 63);">“流量削峰”</font>**<font style="color:rgb(63, 63, 63);">成为关键，这正是消息队列的核心价值。</font>

## <font style="color:#2F8EF4;">大促自由：RocketMQ Serverless 稳定可靠、弹性降本</font>
<font style="color:rgb(63, 63, 63);">每周三“会员日”，古茗中午 12 点的瞬时订单量可达平日数倍。传统架构下，需提前数天甚至数周预估流量、规划资源并手动扩容，不仅耗时费力，</font><font style="color:rgb(63, 63, 63);">还伴随着稳定性风险与资源浪费。</font>

<font style="color:rgb(63, 63, 63);">在支付、营销、库存等核心链路中，古茗引入了</font>**<font style="color:rgb(63, 63, 63);">阿里云云消息队列 RocketMQ 版 Serverless 系列</font>**<font style="color:rgb(63, 63, 63);">，</font><font style="color:rgb(63, 63, 63);">精准解决了三大痛点：</font>

**<font style="color:#2F8EF4;">1. 极致弹性，告别容量焦虑与资源浪费</font>**

<font style="color:rgb(63, 63, 63);">面对</font>**<font style="color:rgb(63, 63, 63);">十万级 TPS 的瞬时并发请求</font>**<font style="color:rgb(63, 63, 63);">，RocketMQ Serverless 无需人工干预即可</font>**<font style="color:rgb(63, 63, 63);">秒级自动扩容</font>**<font style="color:rgb(63, 63, 63);">，保障消息高吞吐、低延迟、不丢失、不积压，并在峰值结束后自动释放资源，真正实现按需使用、按量付费。据测算，该方案帮助古茗</font>**<font style="color:rgb(63, 63, 63);">节省超 40% 成本</font>**<font style="color:rgb(63, 63, 63);">。</font>

**<font style="color:#2F8EF4;">2. 事务消息，保障业务数据最终一致性</font>**

<font style="color:rgb(63, 63, 63);">在“支付成功后扣减库存并发放优惠券”</font><font style="color:rgb(63, 63, 63);">等场景，数据一致性至关重要。</font><font style="color:rgb(63, 63, 63);">RocketMQ </font>**<font style="color:rgb(63, 63, 63);">事务消息</font>**<font style="color:rgb(63, 63, 63);">确保支付主流程与下游操作的</font>**<font style="color:rgb(63, 63, 63);">最终一致性</font>**<font style="color:rgb(63, 63, 63);">。即使下游服务短暂异常，</font><font style="color:rgb(63, 63, 63);">可靠的重试机制也能保证业务最终成功，从根源上避免因数据不一致导致的资损与客诉风险。</font>

**<font style="color:#2F8EF4;">3. 稳定可靠，让技术团队聚焦业务创新</font>**

<font style="color:rgb(63, 63, 63);">RocketMQ 历经阿里巴巴十余年“双十一”万亿级数据洪峰验证</font><font style="color:rgb(63, 63, 63);">，具备</font>**<font style="color:rgb(63, 63, 63);">稳定可靠的 SLA 保障</font>**<font style="color:rgb(63, 63, 63);">，并提供</font>**<font style="color:rgb(63, 63, 63);">消息过滤、顺序消息等功能及完善的可观测工具</font>**<font style="color:rgb(63, 63, 63);">，帮助古茗技术团队从繁琐的维稳工作中解放出来，更专注于业务创新。会员日由此成为业务增长的“加速器”，而非技术压力的“爆发点”。</font>

![](https://img.alicdn.com/imgextra/i3/O1CN01tEJABn1Vvyq5C80Bt_!!6000000002716-2-tps-1080-501.png)

_<font style="color:rgb(136, 136, 136);">RocketMQ Serverless 架构及弹性示意图</font>_

<font style="color:rgb(63, 63, 63);">“拥抱云原生后，我们终于可以放手策划大规模活动了。”刘星光的话语中透露出十足的底气，“以前最怕系统崩溃，现在我们只需关心活动玩法能否打动用户。”这份底气，正源于以 RocketMQ Serverless 为代表的阿里云原生技术栈。</font>

## <font style="color:#2F8EF4;">稳定第一：全链路可观测，让风险“可见可控”</font>
<font style="color:rgb(63, 63, 63);">“稳定，永远是第一位的。”刘星光反复强调，</font>**<font style="color:rgb(63, 63, 63);">“第一是稳定，第二是效率，第三是成本。”</font>**

<font style="color:rgb(63, 63, 63);">为保障稳定性，古茗基于阿里云</font>**<font style="color:rgb(63, 63, 63);">日志服务 SLS</font>****<font style="color:rgb(63, 63, 63);">、</font>****<font style="color:rgb(63, 63, 63);">应用实时监控服务 ARMS</font>**<font style="color:rgb(63, 63, 63);"> </font><font style="color:rgb(63, 63, 63);">等产品，构建了覆盖底层基础设施到上层业务逻辑的</font>**<font style="color:rgb(63, 63, 63);">全链路可观测</font>**<font style="color:rgb(63, 63, 63);">体系</font><font style="color:rgb(63, 63, 63);">，实现</font>**<font style="color:rgb(63, 63, 63);">多维度监控与实时告警</font>**<font style="color:rgb(63, 63, 63);">，全面掌握系统状态。</font>

<font style="color:rgb(63, 63, 63);">刘星光表示：“任何一笔异常订单（如支付或领券失败），我们都能通过全链路追踪，在分钟乃至秒级内定位根因，从而快速修复，保障用户体验。”</font>

## <font style="color:#2F8EF4;">从工具采纳到能力共建，从云原生迈向 AI 原生</font>
<font style="color:rgb(63, 63, 63);">古茗与阿里云的合作，已从</font>**<font style="color:rgb(63, 63, 63);">工具采纳</font>**<font style="color:rgb(63, 63, 63);">深化</font><font style="color:rgb(63, 63, 63);">为</font>**<font style="color:rgb(63, 63, 63);">场景共创</font>**<font style="color:rgb(63, 63, 63);">（如优化事务消息延迟）与</font>**<font style="color:rgb(63, 63, 63);">能力共建</font>**<font style="color:rgb(63, 63, 63);">（如增强消息轨迹）</font><font style="color:rgb(63, 63, 63);">。古茗真实的业务场景</font><font style="color:rgb(63, 63, 63);">（如节假日大促、爆款联名发布）成为 RocketMQ Serverless 等阿里云产品的“极限压测场景”与“最佳实践样板”</font><font style="color:rgb(63, 63, 63);">；阿里云则将经过古茗验证的架构模式产品化，赋能更多零售客户，形成相互成就、共同成长的深度伙伴关系。</font>

<font style="color:rgb(63, 63, 63);">面向未来，古茗</font><font style="color:rgb(63, 63, 63);">正积极探索 AI 与业务的深度融合，包括智能推荐、经营分析、AIGC 营销等。他们的思路清晰而坚定：</font>**<font style="color:rgb(63, 63, 63);">并非“从云原生切换到 AI 原生”，而是在云原生基础上，将 AI 能力逐步叠加，让技术架构与业务共同演进。</font>**

<font style="color:rgb(63, 63, 63);">“云原生解决了弹性、稳定和标准化的问题，这恰恰是 AI 大规模落地的前提。”刘星光总结道，“只有底座足够稳，AI 才能真正服务于业务，而不是制造新的复杂性。”</font>

## <font style="color:#2F8EF4;">一杯奶茶，一场深刻的技术革命</font>
<font style="color:rgb(63, 63, 63);">从一杯奶茶的“丝滑”下单，到一场大促的从容应对，古茗的故事是新茶饮数字化转型的缩影，也是云原生技术释放业务潜能的证明：</font>**<font style="color:rgb(63, 63, 63);">新消费品牌的护城河，</font>****<font style="color:rgb(63, 63, 63);">正在从产品和供应链向技术深度延伸。</font>**

<font style="color:rgb(63, 63, 63);">以云消息队列 RocketMQ 版为代表的阿里云云原生产品，正凭借其极致弹性、高稳定性和领先技术，帮助像古茗这类</font><font style="color:rgb(63, 63, 63);">高速发展的</font><font style="color:rgb(63, 63, 63);">企业卸下技术包袱，在激烈的市场竞争中轻装上阵，将更多精力聚焦于业务创新，让“下单丝滑，大促自由”成为新常态。</font>

<font style="color:rgb(63, 63, 63);">未来，随着云原生与 AI 的进一步融合，每一杯奶茶的背后，都将蕴藏着一个更智能、更高效、更稳定的数字世界。</font>


