---
title: "消息队列RocketMQ应对双十一流量洪峰的“六大武器”"
date: "2021/11/06"
author: "不周"
img: "https://img.alicdn.com/imgextra/i1/O1CN01EGgQZx1aDcGiiedzz_!!6000000003296-0-tps-685-383.jpg"
tags: ["practice"]
description: "消息队列 RocketMQ 是如何帮助各企业交易系统扛住瞬间千万级 TPS、万亿级流量洪峰的冲击，并保持各个应用之间的消息通畅的呢？下文将为您介绍消息队列 RocketMQ 应对双十一流量洪峰的“六大武器”。"
---

_作者：不周_
_审核&校对：岁月、明锻_
_编辑&排版：雯燕_

# **“ 4982 亿，58.3 万笔/秒 ”的背后**


在新冠肺炎疫情催化下，数字化生活方式渐成新常态。“4982 亿，58.3 万笔/秒”是 2020 天猫双 11 全球狂欢节（简称:天猫双 11 ）对数字经济的先发优势和巨大潜能的直观体现。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489222254-8d83b16d-74b1-49f7-abea-2b4d5cb94ea9.png#clientId=uc9a0e5b0-fb0e-4&from=paste&id=uf43bc348&originHeight=470&originWidth=712&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u83a30bc7-172f-4719-be06-f55ba37c99d&title=)

面对千万级并发、万亿级的流量洪峰，背后有力支撑的便是双十一交易核心链路的官方指定产品：消息队列 RocketMQ 。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489222401-8a71e773-94e9-487f-9a7e-3b2e1c488763.png#clientId=uc9a0e5b0-fb0e-4&from=paste&id=u0ff220a9&originHeight=312&originWidth=812&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6039e836-d24e-4ed1-8b11-27428efecc3&title=)

# **双十一交易场景业务痛点**


随着双十一的逐年升温，保障交易场景的稳定性已成为各企业在双十一业务中的关键，每年双十一活动的凌晨，是“万民狂欢”的日子，同时也是各企业交易系统备受考验的时候，保证核心交易系统的业务处理能力、有效应对每秒数十万笔的交易订单成为重中之重，若不能进行流量缓冲将直接引发这些系统的崩溃。避免系统崩溃的核心“秘诀”便是消息队列 RocketMQ。

消息队列 RocketMQ 是如何帮助各企业交易系统扛住瞬间千万级 TPS、万亿级流量洪峰的冲击，并保持各个应用之间的消息通畅的呢？下面为您介绍消息队列 RocketMQ 应对双十一流量洪峰的“六大武器”。**

# **消息队列 RocketMQ 的“六大武器”**


双十一的流量洪峰究竟会给用户和商家系统业务带来哪些问题？消息队列 RocketMQ 的“六大武器”是如何解决这些问题的呢？小编带您初探一二：

### 武器一：“异步解耦”


**背景：**双十一的夜晚，当用户在手机上“指点江山”时，可曾想，一个小小的购物 APP 背后其实是一个个庞大的系统，从用户选购商品的那一刻起，就要和成百个业务系统打交道，每一笔交易订单数据都会有几百个下游业务系统的关联，包括物流、购物车、积分、直充、流计算分析等等，整个系统庞大而且复杂，架构设计稍有不合理，将直接影响主站业务的连续性。

面对如此复杂且庞大的系统，避免系统业务之间相互耦合影响，便要用到消息队列 RocketMQ 的“异步解耦”功能，通过消息队列 RocketMQ 实现上、下游业务系统松耦合，松耦合可以降低系统的复杂度，缩短用户请求的响应时间（将原多个步骤的所需时间之和压缩到只需一条消息的时间），保证下游某个子系统的故障不影响整个链路。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489223890-bacab0d1-2000-4b9e-8736-aa958c4a10e7.png#clientId=uc9a0e5b0-fb0e-4&from=paste&id=ue07eeae8&originHeight=486&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud3f24c5d-b594-46f1-81bd-3a6da5765ba&title=)

### 武器二：“削峰填谷”


**背景：**在处理完交易业务背后庞大的系统所带来的耦合性问题后，从用户视角出发来看，双十一期间 0 点这个时间有成百上千万的用户在同时点击着购买页面，由于用户海量请求，导致流量激增，面对如此大量的访问流量，下游的通知系统可能无法承载海量的调用量，甚至会导致系统崩溃等问题而发生漏通知的情况。

为解决这些问题，就要用到消息队列 RocketMQ 的“削峰填谷”功能，可在应用和下游通知系统之间加入消息队列 RocketMQ，RocketMQ 支持高并发的消息低延迟写入，以及无限的堆积能力，可以避免超高流量的冲击，确保下游业务在安全水位内平滑稳定的运行。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489222067-f6c7cef5-9ad3-44d7-9f49-80e77e82a8a1.png#clientId=uc9a0e5b0-fb0e-4&from=paste&id=uf7c307c9&originHeight=485&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8bfb3a77-b19d-4b54-bb8a-88b86fef5f0&title=)

### 武器三：“分布式事务消息”


**背景：**通过前面的介绍了解到，通过消息的异步解耦，可实现消息的分布式处理，在传统的分布式事务处理方式中，用户创建了一条新的订单信息，伴着这条订单信息的变更，在整个业务链条中的购物车、用户表、积分等都需要变更，系统需要借助分布式事务协调组件来保证多个业务调用的事务一致性。传统的分布式事务组件追求强一致性，性能吞吐低，系统复杂。那如何才能既实现分布式事务，同时又不使系统过于复杂？

这个时候消息队列 RocketMQ 的“分布式事务消息”的功能便起到了关键作用，通过原创的轻量级订单流转事务协调能力，只需发送一条消息，就可以实现消息最终一致性的分布式事务，同时确保订单状态持久化和下游调用一致。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489222220-d45d4550-924d-4274-931a-ae54b940c606.png#clientId=uc9a0e5b0-fb0e-4&from=paste&id=u6c76e741&originHeight=511&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u3bf811fa-9eaf-4656-899b-88f6f659eb9&title=)

### 武器四：“消息过滤”


**背景：**通过以上介绍会发现从客户下单到客户收到商品这一过程会生产一系列消息，按消息种类可以分为交易消息、物流消息、购物车消息等，如何保证各个种类的消息进行有效投递并被准确消费？

这时候就要用到消息队列 RocketMQ 的“消息过滤”功能，可以通过 Tag 给不同种类的消息定义不同的属性，根据消息属性设置过滤条件对消息进行过滤，只有符合过滤条件的消息才会被投递到消费端进行消费。比如给物流消息定义地域属性，按照地域分为杭州和上海：

- 订单消息
- 物流消息
   - 物流消息且地域为杭州
   - 物流消息且地域为上海



![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489224306-f33ff257-deeb-4723-9f45-a028d51d560a.png#clientId=uc9a0e5b0-fb0e-4&from=paste&id=u78f01db1&originHeight=777&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue5997429-b7a1-4549-989c-db80e7e0f5c&title=)

### 武器五：“定时消息”


**背景：**除了以上系统级别中可能出现的问题外，用户自己在购物过程中可能都遇到过一些小细节，比如在点击了购买按钮后，会出现“请您在 30 分钟内完成支付”的提示，如果超过 30 分钟未支付，订单就会自动关闭。

这个业务用到的是消息队列 RocketMQ 的“定时消息”功能，消息队列 RocketMQ 可以实现自定义秒级精度间隔的定时消息，通过消息触发一些定时任务，比如在某一固定时间点向用户发送提醒消息，最终实现海量订单状态变更超时的中心调度。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489224301-e818e357-5a21-4543-a7d9-e41c508ff4ab.png#clientId=uc9a0e5b0-fb0e-4&from=paste&id=u580e89f4&originHeight=558&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7d2fb379-34d7-49cc-a0f3-9699a215f91&title=)

### ![](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489224303-4f438b9f-c370-47ce-a87b-13372771d28b.gif#clientId=uc9a0e5b0-fb0e-4&from=paste&id=u36694659&originHeight=1&originWidth=1&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud5ed3b08-361b-4bfd-96fd-72289a73cfa&title=)武器六：“顺序收发”


**背景：**在双 11 大促中，买家业务侧和交易系统本身会面临诸多问题，卖家侧也会遇到一些难点，比如，买家买了东西，卖家自己却看不到。

为了解决这个问题，一般需要使用消息队列的顺序消息同步能力将买家表的变更订阅同步到卖家表。此时依赖 RocketMQ 的无热点、高性能、高可靠顺序消息可以保障数据库变更的顺序同步，保证买卖家订单同步。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489224352-6aee7402-05eb-42a4-8f3c-ad09b680a4ed.png#clientId=uc9a0e5b0-fb0e-4&from=paste&id=u96694a11&originHeight=768&originWidth=1080&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0cfc2483-0ff9-43b3-bd28-cb4f21de0f4&title=)**

# **总结**


通过以上介绍，带您了解了消息队列 RocketMQ 的六大武器在双十一“战场”上的威力，2021 年“双十一”开战在即，消息队列 RocketMQ 为您双十一的业务保架护航，同时铂金版可提供 99.99% 的服务可用性和 99.99999999% 的数据可靠性，联系我们，期待陪您的业务一起在 2021 双十一中“乘风破浪”。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489224784-f9bc54c3-d395-4425-8795-3e6b268ee988.png#clientId=uc9a0e5b0-fb0e-4&from=paste&id=u2f322580&originHeight=2704&originWidth=800&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u90b6569f-4226-4d26-9b5f-d532b4ef96c&title=)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)