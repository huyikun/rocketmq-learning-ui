---
title: "消息收发弹性——生产集群如何解决大促场景消息收发的弹性&降本诉求"
date: "2022/12/21"
author: "宸罡"
img: "https://img.alicdn.com/imgextra/i4/O1CN01IDHnK01wGkWUiMc9W_!!6000000006281-0-tps-685-383.jpg"
type: "#技术探索"
tags: ["explore"]
description: "今天来给大家分享下阿里云 RocketMQ5.0 实例的消息弹性收发功能，并且通过该功能生产集群是如果解决大促场景消息收发的弹性以及降本诉求的。"
---
## 产品介绍—什么是消息收发弹性

大家好，我是来自阿里云云原生消息团队的赖福智，花名宸罡，今天来给大家分享下阿里云 RocketMQ5.0 实例的消息弹性收发功能，并且通过该功能生产集群是如果解决大促场景消息收发的弹性以及降本诉求的。

### 阿里云弹性策略

![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501696621-dfb9e844-7d24-4673-b030-3368c78d64e6.png#clientId=ucadfa756-d77a-4&height=594&id=Fvu1o&name=1.png&originHeight=594&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9742f5fa-5375-476b-b5e9-baf3af92c10&title=&width=1080)

本次将会从产品介绍，产品使用及限制，使用方式及演示三个方面来介绍。在介绍 Rocketmq5.0 实例的消息首发弹性之前，先从整体上看下阿里云的弹性策略。我们通常认为业务方往往存在预期外的突发业务热点和毛刺流量，常规扩容无法及时应对，这样一来服务会有不确定性的风险。因此为了应对突发流量，我们设计了一套处理机制，最基本的是要满足规格内的预期流量，然后是应对弹性区间内的突发流量可以随时开启的弹性能力，最后是要有对完全超过弹性上限流量的限流限流能力。针对弹性区间的突发流量，传统自建集群通过常规扩容方式应对，需要分钟级的处理时间，在这段时间内业务会受损，并且为了这部分偶尔的突发流量扩容到一个较大的规格并不划算。云上5.0实例的消息收发弹性能力对弹性区间内的突发流量可以做到秒级响应，针对大促这种预期内的短期突发流量可以按量收费更加实惠，仅当用户真正用到这部分弹性能力才收费。

### 消息收发弹性简介

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501696684-7b786bc1-176a-47a5-a372-99d66449f023.png#clientId=ucadfa756-d77a-4&height=608&id=us1sR&name=2.png&originHeight=608&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9efbb06a-3e33-4bb4-b5bd-30d87ff3069&title=&width=1080)

接下来我们就看具体看下 5.0 实例的消息收发弹性，消息收发弹性最直观的感受就是在 5.0 实例的详情页面的自适应弹性 TPS 这部分，可以看到在正常消息收发 TPS 的旁边额外有一个自适应弹性 TPS。通过这部分弹性 TPS 的设置，用户可以快速、低成本的应对大促这种短时间突发流量的场景。

这时可能有小伙伴会问为什么我不直接升级规格提高标准收发 TPS，而是使用弹性 TPS 呢？让我们假设一个典型的大促场景，比如在今晚 0 点有大促活动，使用消息弹性功能的用户完全可以提前几天就把弹性功能打开，大促结束等流量恢复后再把弹性功能关闭，实际上不关闭也不会有什么问题，不使用则不收费。

如果通过升级规格来提升标准 TPS 应对大促流量，用户同样是提前几天就把规格升高了，那么在大促前这几天按照高规格收费但实际又跑不到高规格的 TPS，实际上花了更多的钱但是确造成了资源的浪费。如果用户为了避免资源浪费在大促当天 0 点前升级规格，一个是需要用户付出额外的精力来关注 RocketMQ 按时升配，再就是实例的升配是一个重资源操作，扩容耗时长，无法做到即开即用秒级生效，很有可能已经到 0 点了但是升配还没有完成。

使用消息弹性功能的话可以做到秒级生效开箱即用，并且如果没有使用到这部分额外的弹性 TPS 是不会收费的。但是弹性 TPS 也不是个解决问题的万能银弹，也是有上限的，基本上可以在规格标准 TPS 的基础上额外有一半的弹性 TPS，如果标准 TPS+ 弹性 TPS 仍然无法满足用户业务需求，此时意味着仅扩容弹性节点已经无法满足需求，同时需要扩容存储节点，所以需要升配规格，这部分的原理后面会详细解释。

也有用户会问，如果我的日常 TPS 在 2500 左右，可不可以购买一个 2000 标准 TPS 的实例并且一直开着 1000 的弹性 TPS 满足需求呢？这种情况我们建议直接使用标准 TPS 大于 2500 的实例，因为弹性 TPS 这部分的使用会额外计费，如果一天 24 小时都在大量使用弹性 TPS，从计费上来说直接使用更高规格的实例更实惠。

### 5.0 实例消息收发弹性的实现方式，和传统自建方式的对比

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501698438-e6ca80ac-ccf1-49a4-a96b-b581e4d6fbfd.png#clientId=ucadfa756-d77a-4&height=588&id=oJNPI&name=3.png&originHeight=588&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6630a1fb-50d7-4206-8354-2b79dbdee34&title=&width=1080)

接下来我们看下阿里云 RocketMQ5.0 实例是怎么实现消息收发弹性的，并且在扩容场景和自建 RocketMQ 有什么优势。传统自建 RocketMQ 集群如左图显示，是一个存储计算不分离的架构，这种架构下 Broker 是一个很重的组件，因为它同时需要处理客户端的请求，也要负责数据的读取写入，Broker 同时负责计算和存储。作为一个有状态的节点，Broker 扩容是一个很重的操作，时间会很慢，而且在很多时候我们并不需要扩容存储能力，仅仅需要应对高 TPS 请求的计算能力，此时随着 Broker 扩容的存储扩容实际上被浪费了。

再来看下 RocketMQ5.0 实例消息收发弹性是怎么做的，首先 5.0 实例的架构是存储计算分离的模式，用户的客户端仅会请求计算层的计算节点，计算节点操作存储节点读写消息，客户端并不会直接访问存储节点。开启消息收发弹性功能意味着开启了计算层的弹性能力。得益于这种存储计算分离的架构，可以让我们快速低成本的扩容计算层节点，计算层节点作为无状态应用可以做到秒级扩容，十分便捷。而且在云厂商拥有大量资源池的前提下可以做到资源的弹性扩容。可以说 RocketMQ5.0 实例的消息收发弹性能力依赖于阿里云作为云厂商的弹性能力和存算分离的技术方案得以实现。

在大促这种短时间大流量的场景下，大部分都是不需要扩容存储节点的，此时就可以通过开通消息收发弹性的能力满足需求。

## 产品使用及限制：消息收发弹性的使用及限制

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501696610-451919fd-253b-40b5-a3d0-6888c13a5ff5.png#clientId=ucadfa756-d77a-4&height=591&id=H9GVm&name=4.png&originHeight=591&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=udcb8a352-728e-4aa9-bf65-2f411b25f22&title=&width=1080)

### 支持版本

消息收发弹性的功能仅在专业版和铂金版支持，标准版实例不支持，并且专业版的单机规格作为给用户使用的测试版本也不支持。

### 弹性上限

不同规格实例的弹性 TPS 上限不同，基本上在标准 TPS 的基础上额外有一半的弹性 TPS，下图所示为专业版的弹性 TPS 上限。受篇幅所限，其他规格的弹性上限可以参考官方文档，就不再列出了。

### 计费方式

弹性 TPS 是额外计费的，计费周期按小时计费，不足 1 小时，按 1 小时计算。计费方式为超过限制的 TPS× 使用时长（小时）× 弹性规格单价（元/TPS/小时）弹性规格单价如下图，不同地域的单价会有略微差异。

### SLA

可能有小伙伴会担心使用到这部分额外的弹性 TPS 会不会有问题，毕竟这部分是在标准 TPS 之上额外的能力，有一种自己实例超负荷运转的感觉。这个是完全不用担心的，不同规格的弹性上限已经经过压测验证，和规格标准 TPS 享受一样的稳定性 SLA 保证。

## 使用方式及演示：结合业务场景的最佳使用方式

### 开启方式、生效时间、收发比例

最后我们来实际操作下开启弹性收发能力并且验证该功能。RocketMQ5.0实例依然支持使用 RocketMQ4.0 实例的 1.x 客户端访问，所以这里分别提供了 1.x 客户端和 5.x 客户端的测试代码实例。

该程序开启了 200 个线程的线程池通过 ratelimiter 根据输入参数设置每秒最大的发送消息条数，打印失败的原因，并且每秒统计成功发送的消息量 在这里我已经提前购买好了一个专业版的实例，默认是不会开启消息收发弹性能力的。我们可以点击这里的开启弹性按钮进入实例修改页面开启弹性功能。这里要注意的是开启之后的弹性 TPS 依然受实例整体的消息收发占比设置，用户可以根据自己的消息收发场景设置该比例。

再开启之前我们来尝试下每秒发送 2300 个消息会怎么样，可以看到已经被限流了，并且每秒成功发送的量要比 2000 多一些。接着我们将弹性开启，并且将默认的收发比 1:1 改为 4:5，这是修改后的实例状态，现在让我们继续每秒发送 2300 个消息来验证下，可以看到已经都成功发送了。

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680501696567-ab78f54f-63f8-4529-9a70-3f5bb1481917.png#clientId=ucadfa756-d77a-4&height=1281&id=GlOvP&name=5.png&originHeight=1281&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u953f8134-5527-4aae-9af4-a5c28a18e5c&title=&width=1080)
![6.png](https://ucc.alicdn.com/pic/developer-ecology/pawmkwdq37c7s_c98bd149a852461bb78a17d7d8fa9cb7.png#clientId=ucadfa756-d77a-4&height=1335&id=hj18Q&name=6.png&originHeight=1335&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7fca6b3f-020a-4a25-bf21-c2f8d07cb25&title=&width=1080)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
