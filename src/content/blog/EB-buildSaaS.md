---
title: "基于 EventBridge 构建  SaaS 应用集成方案"
date: "2022/03/11"
author: "昶风"
img: "https://img.alicdn.com/imgextra/i1/O1CN01NRNriz1rfPm6Tarfu_!!6000000005658-0-tps-685-383.jpg"
tags: ["practice"]
description: "事件源是事件驱动的基石，如何获取更多事件源也是 EventBridge 一直在探索和尝试的方向。针对市场上其他云厂商和垂直领域的 Saas 服务，EventBridge 发布了 HTTP Source 能力，提供简单且易于集成的三方事件推送 ，帮助客户更加高效、便捷地实现业务上云。"
---

## 引言

事件驱动架构（EDA）是一种以事件为纽带，将不同系统进行解耦的异步架构设计模型。在 EDA 中，事件驱动的运行流程天然地划分了各个系统的业务语义，用户可以根据需求对事件与针对此事件做出的响应灵活定制，这使得基于 EDA 架构可以方便地构建出高伸缩性的应用。据 Daitan Group 的调研报告，早在 2017 年，例如 UBER、Deliveroo、Monzo 等公司就已经采用了 EDA 去设计他们的系统。

![640.png](https://img.alicdn.com/imgextra/i4/O1CN01RUqbAF1e8oif2RRgN_!!6000000003827-2-tps-569-297.png)

为了便于用户更加轻松地开发以 EDA 为架构的应用，在 2020 年云栖大会上，阿里云正式推出了 EventBridge。EventBridge 是一款无服务器事件总线服务，能够以标准化的 CloudEvents 1.0 协议在应用之间路由事件。目前，EventBridge 已经集成了众多成熟的阿里云产品，用户可以低代码甚至零代码完成各个阿里云产品和应用之间的打通，轻松高效地构建分布式事件驱动架构。

事件源是事件驱动的基石，如何获取更多事件源也是 EventBridge 一直在探索和尝试的方向。针对市场上其他云厂商和垂直领域的 Saas 服务，EventBridge 发布了 HTTP Source 能力，提供简单且易于集成的三方事件推送 ，帮助客户更加高效、便捷地实现业务上云。

## HTTP Source 概述

接入 EventBridge 应用有多种情况：用户自定义应用、阿里云服务、其他云厂商服务或者其他 SaaS 产品。

- 对于用户自定义应用，用户可以使用 EventBridge 官方的 API 接口、多语言客户端以及 CloudEvents 社区的开源客户端来完成接入。

- 对于阿里云的云产品，EventBridge 原生支持，用户可以在默认事件总线中选择对应的云产品与其相关的触发事件。

- 而对于其他云厂商、SaaS 产品，EventBridge 同样也提供便捷的接入方式便于用户进行集成，HTTP Source 事件源便是一种典型的接入方式。

![2.png](https://img.alicdn.com/imgextra/i4/O1CN0199pCvh1lHhiS4dBJO_!!6000000004794-2-tps-1080-427.png)

具体而言，HTTP Source 事件源是 EventBridge 支持的事件源的一种，它以 Webhook 形式暴露了发布事件的 HTTP 请求地址，用户可以在有 URL 回调的场景配置 HTTP Source 事件源，或者直接使用最简单的 HTTP 客户端来完成事件的发布。HTTP Source 事件源提供了支持 HTTP 与 HTTPS，公网与阿里云 VPC 等不同请求方式、不同网络环境的 Webhook URL，便于用户将其集成到各类应用中。接入时无需使用客户端，仅需保证应用可以访问到对应 Webhook URL 即可，这使得接入过程变得简单而高效。

在将 HTTP 请求转换为 CloudEvent 的时候，EventBridge 会将请求的头部和消息体部分置于 CloudEvent 字段中，其余字段会依据用户 EventBridge 资源属性以及系统默认规则进行填充。用户可以在事件规则中，对所需的内容进行过滤、提取，最终按照模板拼装成所需的消息内容投递给事件目标。

![3.png](https://img.alicdn.com/imgextra/i1/O1CN01iYmImK1vkEXpnLAoz_!!6000000006210-2-tps-972-507.png)

HTTP Source 事件源目前支持 3 种类型的安全设置，分别是请求方法、源 IP 以及请求来源域名。

- 请求方法：用户可以配置当前请求此事件源时合法的 HTTP 请求方法，如果方法类型不满足配置规则，请求将被过滤，不会投递到事件总线。

- 源 IP：用户可以设置允许访问此事件源时合法的源 IP（支持 IP 段和 IP），当请求源 IP 不在设置的范围内时，请求将被过滤，不会投递到事件总线。

- 请求来源域名：即 HTTP 请求的 referer 字段，当请求的 referer 与用户配置不相符时，请求被过滤，不会投递到事件总线。

抛砖引玉，下面就介绍如何使用 HTTP Source 来构建 SaaS 应用集成的最佳实践，帮助大家快速上手 SaaS 集成方案。

## SaaS 集成最佳实践


### 钉钉监控 GitHub 代码推送事件

GitHub 提供了 Webhook 功能，代码仓库在发生某些特定操作（push、fork等）时，可以通过回调来帮助用户完成特定功能。针对多人开发的项目，将 GitHub 事件推送到特定钉钉群可以帮助成员有效关注代码变更，提高协同效率。
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490635846-3fc1ae05-4bc6-49e1-bc73-c807dddc6a16.gif#clientId=ubddd7b44-8131-4&height=1&id=QhR0w&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub2d92a16-6a45-43ac-babe-1808721dbed&title=&width=1) -->
本节我们展示如何通过钉钉监控 GitHub 代码推送事件的最佳实践，主要包含以下几个步骤：

- 创建一个钉钉机器人；
- 创建 EventBridge 相关资源：事件总线、事件源（HTTP Source 类型）、事件规则、事件目标（钉钉）；
- 创建自定义事件总线；
- 选择 GitHub 代码仓库创建 Webhook；
- 向 GitHub 代码仓库推送代码变更；
- 钉钉群接收此次代码推送相关信息。

#### 1）创建钉钉机器人


参考钉钉官方文档**[****1]**，创建一个群机器人。创建群机器人时，安全设置请勾选“加签”并妥善保管密钥和稍后生成的机器人 Webhook 地址。

#### 2）创建 EventBridge 相关资源


创建 EventBus 事件总线
![5.png](https://img.alicdn.com/imgextra/i4/O1CN01ddzp3Z1wWK8DzLvbX_!!6000000006315-0-tps-1080-502.jpg)创建事件源。事件源配置完成之后，点击跳过，我们接下来会专门配置事件规则与目标。
![66.png](https://img.alicdn.com/imgextra/i3/O1CN0119N5FW1w838nOTnuC_!!6000000006262-0-tps-1080-1186.jpg)创建完成后，进入事件源详情页，保存刚刚生成的 Webhook URL。

![77.png](https://img.alicdn.com/imgextra/i2/O1CN01Ut8ySy1QaqKtjO4Iw_!!6000000001993-0-tps-1080-348.jpg)在 EventBridge 控制台页面点击进入刚刚创建的 EventBus 详情页，在左侧一栏中“事件规则”选择“创建规则”。

![88.png](https://img.alicdn.com/imgextra/i1/O1CN01OQciGJ1IKL8eKZeBG_!!6000000000874-0-tps-1080-264.jpg)
![99.png](https://img.alicdn.com/imgextra/i3/O1CN01hc7rnn1HrUBcI9Ct5_!!6000000000811-0-tps-1080-390.jpg)


创建时间目标。选择钉钉，并将钉钉机器人的 Webhook 地址和密钥填入，推送内容侧可以按照需求设计。

![100.png](https://img.alicdn.com/imgextra/i1/O1CN01tKwLe91htTvBpg95Y_!!6000000004335-0-tps-1080-576.jpg)
<!-- ![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680490639248-6eff3f03-b22d-489d-82c2-485dbeee4deb.gif#clientId=ubddd7b44-8131-4&height=1&id=lcDQN&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6001c813-1811-4345-9d37-8f4306e1ed6&title=&width=1) -->
我们填写模板变量为：
{"repo":"$.data.body.repository.full_name","branch":"$.data.body.ref","pusher":"$.data.body.pusher.name"}

模板为：
{"msgtype": "text","text": {"content": "Github push event is triggered. repository: {repo}, git reference: {branch}, pusher: {pusher}." } }

#### 3）在 GitHub 代码仓库创建 Webhook


登陆 GitHub，在 GitHub 代码仓库“setting”中选择左侧“Webhooks”，选择新建 Webhook。

在创建 Webhook 的配置项中填入 HTTP Source 事件源的 Webhook 地址，Content type 部分选择“application/json”，下方触发事件类型选择“Just the push event.”，随后点击“Add Webhook”，创建完成。

![111.png](https://img.alicdn.com/imgextra/i1/O1CN01uNbQtZ1UOFui2cNsR_!!6000000002507-0-tps-1080-724.jpg)
![122.png](https://img.alicdn.com/imgextra/i3/O1CN01ss8m6d1kIKdxgAPpb_!!6000000004660-0-tps-1080-305.jpg)

#### 4）向 GitHub 代码仓库推送代码变更


本地仓库做一定变更，commit 后推送 GitHub。

#### 5）钉钉群接收此次代码推送相关信息


![133.png](https://img.alicdn.com/imgextra/i2/O1CN01AoxNMb1soPJ7U6x8g_!!6000000005813-0-tps-1080-196.jpg)

## _异步消费监控报警信息_

业务上存在异步消费报警信息的场景，例如报警内容备份，根据报警频率自适应调整报警阈值等。而且对于多云业务的用户，如何将跨云服务的报警信息整合起来也是一个麻烦的问题。依托 HTTP Source，用户可以将不同云厂商（腾讯云、华为云等）、不同监控产品（Grafana、Zabbix、Nagios等）统一集成到 EventBridge 平台，以便于实现对报警信息的异步消费。
![14.png](https://img.alicdn.com/imgextra/i3/O1CN01XuA0QD1kPCaGLnZcX_!!6000000004675-2-tps-901-208.png)

本节我们介绍如何使用 EventBridge 集成 Grafana，实现异步消费监控报警信息。Grafana 是一款开源数据可视化工具，也同时具有监控报警功能，具体使用可以参阅Grafana 官方文档**[****2]**。本节主要包含以下步骤：

- 创建 MNS 队列；
- 创建 EventBridge 相关资源；
- Grafana 上配置 Webhook；
- 测试接收结果。

### 创建 MNS 队列

在 MNS 控制台，选择“队列列表-创建队列”。

![15.png](https://img.alicdn.com/imgextra/i4/O1CN01VKmOY41GRY8oUKNBN_!!6000000000619-0-tps-1080-931.jpg)
### 创建 EventBridge 相关资源

同上文所述，这里仅示例创建事件目标时相关配置。

![16.png](https://img.alicdn.com/imgextra/i1/O1CN01EUUo5G1HgUg6tNgla_!!6000000000787-0-tps-1080-564.jpg)

### Grafana 上配置 Webhook

点击 Grafana 控制台左侧“Alerting-Notification channels”，选择“Add channel”。

![17.png](https://img.alicdn.com/imgextra/i4/O1CN01y0SBxX20MwTtsNIld_!!6000000006836-0-tps-1080-562.jpg)

在“type”一栏中选择“Webhook”，url 填写 HTTP Source 事件源的 Webhook 地址，点击下方“Test”。

![18.png](https://img.alicdn.com/imgextra/i4/O1CN01Pr8N4v1PP6ZKfnSdG_!!6000000001832-0-tps-1080-758.jpg)

### 测试接收结果

登陆 MNS 控制台，进入队列详情页，点击页面右上角“收发消息”，可以看到 MNS 已经接收到刚刚 Grafana 发送的消息。
![212121.png](https://img.alicdn.com/imgextra/i3/O1CN01ieboEI1xdTw9RYOBc_!!6000000006466-0-tps-1080-289.jpg)
![19.png](https://img.alicdn.com/imgextra/i2/O1CN01CqhfB822S6AmnMdAl_!!6000000007118-0-tps-1080-211.jpg)


点击对应消息详情可以看到消息内容，说明消息已经被成功消费。

![20.png](https://img.alicdn.com/imgextra/i4/O1CN01O6TgdJ1pxcQRAlKDh_!!6000000005427-0-tps-1080-409.jpg)

## _更多集成_



HTTP Source 支持的三方集成包括 Prometheus，Zabbix，Skywalking，Grafana，Open-Falcon，Cacti，Nagios，Dynatrace，Salesforce，Shopify，Gitee 等 SaaS 应用。通过简单配置 Webhook 无需开发既可实现事件接收能力。

## _总结_

本文重点介绍 EventBridge 的新特性：HTTP Source 事件源。作为一款无服务器事件总线服务，EventBridge 已经将阿里云云产品管控链路数据、消息产品业务数据整和到事件源生态中，提高了上云用户业务集成的便捷性，Open API 与多语言 sdk 的支持，为客户自身业务接入 EventBridge 提供了便利。
在此基础之上，HTTP Source 事件源更进一步，以 Webhook 形式开放了针对了其他云厂商、SaaS 应用的集成能力，无需代码改动，仅需要简单配置即可完成 EventBridge 集成操作。

## _相关链接_

[1] 钉钉官方文档[_https://open.dingtalk.com/document/group/custom-robot-access_](https://open.dingtalk.com/document/group/custom-robot-access)

[2] Grafana 官方文档[_https://grafana.com/docs/_](https://grafana.com/docs/)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://img.alicdn.com/imgextra/i4/O1CN01Xi1rcu1DM6aIC7ypz_!!6000000000201-0-tps-1920-675.jpg)