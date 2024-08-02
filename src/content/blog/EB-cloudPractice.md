---
title: "EventBridge 集成云服务实践"
date: "2022/04/20"
author: "李凯（凯易）"
img: "https://img.alicdn.com/imgextra/i3/O1CN01CVTplV26Vzrhj29C4_!!6000000007668-0-tps-685-383.jpg"
tags: ["practice"]
description: "本篇文章主要向大家分享了通过 EventBridge 如何集成云产品事件源，如何集成云产品事件目标以及通过事件流如何集成消息产品。"
---
## EvenBridge 集成概述

EventBridge 是阿里云所推出了一款无服务器事件总线，其目标是拓展事件生态，打破系统间的数据孤岛，建立事件集成生态。提供统一的事件标准化接入及管理能力，完善集成与被集成通路，帮助客户快速实现事件驱动的核心原子功能，可将 EventBridge 快速集成至 BPM、RPA、CRM 等系统。

![640 - 2022-04-21T190144.085.png](https://img.alicdn.com/imgextra/i3/O1CN0132O5ls1KMI3UfCOqU_!!6000000001149-0-tps-1080-717.jpg)

EventBridge 通过事件标准化，接入标准化，组件标准化三个方向作为支点拓展 EventBridge 事件生态：


- **事件标准化**：拥抱 CloudEvents 1.0 开源社区标准协议，原生支持 CloudEvents 社区 SDK 和 API，全面拥抱开源社区事件标准生态；
- **接入标准化**：提供标准事件推送协议 PutEvent，并支持 Pull 和 Push 两种事件接入模型，可有效降低事件接入难度，提供云上完善的事件接入标准化流程；
- **组件标准化**：封装标准的事件下游组件工具链体系，包括 Schema 注册、事件分析、事件检索、事件仪表盘等。提供完善的事件工具链生态。

在集成领域 EventBridge 重点打造事件集成和数据集成两类核心场景，下面将围绕这两类场景具体展开描述。

## 事件集成

目前 EventBridge 已经拥有 80+ 云产品的事件源，800+ 种事件类型。整个事件生态还正在逐步丰富中。

![640 - 2022-04-21T203639.802.png](https://img.alicdn.com/imgextra/i2/O1CN01396QFl1D4F8YMdVpq_!!6000000000162-2-tps-1080-433.png)

那么，EventBridge 如何实现云产品的事件集成呢？

- 首先在 EventBridge 控制台可以看见一个名为 default 的事件总线，云产品的事件都会投递到这个总线；

![640 - 2022-04-21T203655.434.png](https://img.alicdn.com/imgextra/i4/O1CN01l0NcnH28Aaj9TriPP_!!6000000007892-2-tps-1080-413.png)

- 然后点击创建规则，就可以选择所关心的云产品以及它的相关事件进行事件的监听和投递。


![640 - 2022-04-21T203711.484.png](https://img.alicdn.com/imgextra/i4/O1CN01B5vDwV1qji0rbncwH_!!6000000005532-2-tps-1080-487.png)
下面以两个例子为例，来看下 EventBridge 事件集成的方式。

###  OSS 事件集成

以 OSS 事件源为例，来讲解一下如何集成 OSS 事件。


![640 - 2022-04-21T203733.675.png](https://img.alicdn.com/imgextra/i3/O1CN01w1jBFF1qpClTiOfEo_!!6000000005544-2-tps-1080-837.png)

OSS 事件现在主要分为 4 类，操作审计相关、云监控相关、配置审计相关、以及云产品相关的事件例如 PutObject 上传文件等等。其他的云产品的事件源也类似，基本都可以分为这几个类型的事件。

下面演示一下事件驱动的在线文件解压服务：

![640 - 2022-04-21T203752.649.png](https://img.alicdn.com/imgextra/i1/O1CN017wJMnT25It3P7Hsdn_!!6000000007504-2-tps-1080-379.png)

- 在 OSS Bucket 下面会有一个  zip 文件夹存放需要解压的文件，一个 unzip 文件夹存放解压后的文件；
- 当上传文件到 OSS Bucket 之后，会触发文件上传的事件并投递到 EventBridge 的云服务专用总线；
- 然后会使用一个事件规则过滤 zip 这个 bucket 的事件并投递到解压服务的 HTTP Endpoint；
- 解压服务会在收到事件之后，根据事件里面的文件路径从 OSS 下载文件解压，并在解压之后将文件传到 unzip 目录下；
- 同时，还会有一个事件规则，监听 unzip 目录的文件上传事件，并将事件转换后推送到钉钉群。

一起来看下是如何实现的：

前往下方链接查看视频：
[https://www.bilibili.com/video/BV1s44y1g7dk/](https://www.bilibili.com/video/BV1s44y1g7dk/)

1）首先创建一个 bucket，下面有一个 zip 目录用于存放上传的压缩文件，一个 unzip 目录用于存放解压后的文件。

![640 - 2022-04-21T204237.609.png](https://img.alicdn.com/imgextra/i4/O1CN011B28gp1a8a3MXgRSx_!!6000000003285-0-tps-780-388.jpg)

2) 部署解压服务，并且暴露公网访问的地址。
解压服务的源码地址为：
[_https://github.com/AliyunContainerService/serverless-k8s-examples/tree/master/oss-unzip?spm=a2c6h.12873639.article-detail.15.5a585d52apSWbk_](https://github.com/AliyunContainerService/serverless-k8s-examples/tree/master/oss-unzip?spm=a2c6h.12873639.article-detail.15.5a585d52apSWbk)

也可以使用 ASK 直接部署，yaml 文件地址为：
[_https://github.com/AliyunContainerService/serverless-k8s-examples/blob/master/oss-unzip/hack/oss-unzip.yaml_](https://github.com/AliyunContainerService/serverless-k8s-examples/blob/master/oss-unzip/hack/oss-unzip.yaml)

3）创建一个事件规则监听 zip 目录下的上传文件的事件，并投递到解压服务的 HTTP  Endpoint。


![640 - 2022-04-21T204346.454.png](https://img.alicdn.com/imgextra/i1/O1CN01azkFmS1TxgwJKEK2e_!!6000000002449-0-tps-1080-784.jpg)

这里使用 subject，匹配 zip 目录。
4）再创建一个事件规则监听 unzip 目录的事件，投递解压事件到钉钉群。

![640 - 2022-04-21T204409.526.png](https://img.alicdn.com/imgextra/i2/O1CN01553dQJ1Pa64gI5iFl_!!6000000001856-0-tps-1080-964.jpg)

这里同样使用 subject，匹配 unzip 目录。


对于变量和模板的配置可以参考官方文档 ：
[_https://help.aliyun.com/document_detail/181429.html_](https://help.aliyun.com/document_detail/181429.html)。

EventBridge 会通过 JSONPath 的方式从事件中提取参数，然后把这些值放到变量中，最后通过模板的定义渲染出最终的输出投递到事件目标。OSS 事件源的事件格式也可以参考官方文档 ：
[_https://help.aliyun.com/document_detail/205739.html#section-g8i-7p9-xpk_](https://help.aliyun.com/document_detail/205739.html#section-g8i-7p9-xpk)_ _，并根据实际的业务需要使用 JSONPath 定义变量。5）最后，通过 oss 控制台上传一个文件进行验证。

![640 - 2022-04-21T204450.912.png](https://img.alicdn.com/imgextra/i3/O1CN017cavWq1NqSzzSIY7Q_!!6000000001621-0-tps-1080-521.jpg)
![640 - 2022-04-21T204513.042.png](https://img.alicdn.com/imgextra/i1/O1CN01aLeXJN2AGfD7zmX5q_!!6000000008176-0-tps-1080-416.jpg)

可以看到刚刚上传的 eventbridge.zip 已经解压到并上传上来了，也可以在钉钉群里面，收到解压完成的通知。此外，还可以在事件追踪这边查看事件的内容已经投递的轨迹。

![640 - 2022-04-21T204843.753.png](https://img.alicdn.com/imgextra/i4/O1CN01ngWpHq1c3CdDTT34L_!!6000000003544-0-tps-1080-276.jpg)

可以看到有两个上传事件：一个是通过控制台上传的事件，一个是解压文件后上传的事件。


![640 - 2022-04-21T204854.592.png](https://img.alicdn.com/imgextra/i4/O1CN01LrCVo21fZDA1PgTUK_!!6000000004020-0-tps-1080-455.jpg)

可以查看轨迹，都成功投递到了解压服务的 HTTP Endpoint 以及钉钉机器人。

###  以自定义事件源以及云产品事件目标的方式集成云产品

刚才演示的 demo 是集成云服务的事件源，下面再通过一个 demo 看一下如何通过以自定义事件源以及云产品事件目标的方式集成云产品。

前往下方链接查看视频：
[https://www.bilibili.com/video/BV1QF411M7xv/](https://www.bilibili.com/video/BV1QF411M7xv/)

这个 demo 的最终效果是通过 EventBridge 自动进行数据的清洗，并投递到 RDS 中去。事件内容是一个 JSON，拥有两个字段一个名字一个年龄，现在希望将把大于 10 岁的用户过滤出来并存储到 RDS 中。

![640 - 2022-04-21T204921.765.png](https://img.alicdn.com/imgextra/i2/O1CN01eQYoQp1T2tpRrPLlg_!!6000000002325-2-tps-1080-334.png)

整体的架构如图所示，使用一个 MNS Queue 作为自定义事件源，并通过 EventBridge 过滤并转换事件最终直接输出到 RDS 中去。

![640 - 2022-04-21T204934.571.png](https://img.alicdn.com/imgextra/i2/O1CN01kkYZBJ1ZZJYXpfd7w_!!6000000003208-2-tps-1080-268.png)


1）首先已经创建好了一个 MNS Queue，创建好一个 RDS 实例以及数据库表，表结构如下所示：

![640 - 2022-04-21T205023.666.png](https://img.alicdn.com/imgextra/i1/O1CN01z5gEv01dTb4c2w6dF_!!6000000003737-0-tps-1080-220.jpg)

2）创建一个自定事件总线，选择事件提供方为 MNS，队列为提前创建好的队列；

![640 - 2022-04-21T205040.510.png](https://img.alicdn.com/imgextra/i3/O1CN01CcROeK1y2DKFQEcjM_!!6000000006520-0-tps-619-607.jpg)

创建好了之后，我们就可以在事件源这里看见一个已经正在运行中的事件源；

![640 - 2022-04-21T205057.959.png](https://img.alicdn.com/imgextra/i3/O1CN01r3RWet1hMVPDSzpYh_!!6000000004263-2-tps-1080-152.png)

3）接下来创建规则投递到 RDS

![640 - 2022-04-21T205113.747.png](https://img.alicdn.com/imgextra/i4/O1CN01a5CIxn1OQeHshxiIP_!!6000000001700-2-tps-1050-386.png)
配置的事件模式内容如下：


    {
        "source": [
            "my.user"
        ],
        "data": {
            "messageBody": {
                "age": [
                    {
                        "numeric": [
                            ">",
                            10
                        ]
                    }
                ]
            }
        }
    }


数值匹配可以参考官方文档：
 [_https://help.aliyun.com/document_detail/181432.html#section-dgh-5cq-w6c_](https://help.aliyun.com/document_detail/181432.html#section-dgh-5cq-w6c)


4) 点击下一步，选择事件目标为数据库，填写数据库信息，配置转化规则，完成创建。

![640 - 2022-04-21T205154.428.png](https://img.alicdn.com/imgextra/i2/O1CN01ChMIog1UjmWhP26AU_!!6000000002554-0-tps-1080-258.jpg)
5）最后，先用 MNS Queue 发送一个消息，这个的 age 是大于 10 的。

![640 - 2022-04-21T205209.436.png](https://img.alicdn.com/imgextra/i4/O1CN01DYYrsA1tP2zbMN88N_!!6000000005893-0-tps-1080-355.jpg)

可以看见这条事件就输出到了 RDS 里面了。

![640 - 2022-04-21T205222.908.png](https://img.alicdn.com/imgextra/i2/O1CN01LMWqQA1UCo0p1du6N_!!6000000002482-0-tps-831-273.jpg)

下面再发一个小于 10 的消息到 MNS Queue。


![640 - 2022-04-21T205236.916.png](https://img.alicdn.com/imgextra/i4/O1CN01IF0OsN1pt2Ss6WijC_!!6000000005417-0-tps-1080-332.jpg)
这条事件就被过滤掉了，没有输出到 RDS。

![640 - 2022-04-21T205251.070.png](https://img.alicdn.com/imgextra/i2/O1CN01SzhxDP1ltiaaDUPfZ_!!6000000004877-0-tps-1080-241.jpg)

也可通过事件追踪查看事件：

![640 - 2022-04-21T205303.484.png](https://img.alicdn.com/imgextra/i3/O1CN01vXkNi71abtOvTkFM9_!!6000000003349-0-tps-1080-388.jpg)
可以看到一条事件成功投递到了 RDS，一条事件被过滤掉了，没有进行投递。

## 数据集成

事件流是 EventBridge 为数据集成提供的一个更为轻量化、实时的端到端的事件流试的通道，主要目标是将事件在两个端点之间进行数据同步，同时提供过滤和转换的功能。目前已经支持阿里云各消息产品之间的事件流转。

![640 - 2022-04-21T205326.119.png](https://img.alicdn.com/imgextra/i3/O1CN01RVVw3029Ls66SeeOd_!!6000000008052-2-tps-1080-671.png)

不同于事件总线模型，在事件流中，并不需要事件总线，其 1：1 的模型更加的轻量，直接到目标的方式也让事件更加的实时；通过事件流，我们可以实现不同系统之间的协议转换，数据同步，跨地域备份的能力。

![640 - 2022-04-21T205339.724.png](https://img.alicdn.com/imgextra/i4/O1CN01oFHPNK1OeOAdKlnma_!!6000000001730-2-tps-1080-978.png)


下面将通过一个例子讲解如何使用事件流，将 RocketMQ 的消息路由到 MNS Queue，将两个产品集成起来。

整体的结构如图所示，通过EventBridge 将 RocketMQ 中 TAG 为 MNS 的消息路由到 MNQ Queue。

![640 - 2022-04-21T205355.726.png](https://img.alicdn.com/imgextra/i1/O1CN01nqy7MD1adiz7tJiv7_!!6000000003353-2-tps-1080-292.png)

一起看下怎么实现：

前往下方链接查看视频：
[https://www.bilibili.com/video/BV1D44y1G7GK/](https://www.bilibili.com/video/BV1D44y1G7GK/)

- 首先创建一个事件流，选择源 RocketMQ 实例，填写 Tag 为 mns。


![640 - 2022-04-21T205417.161.png](https://img.alicdn.com/imgextra/i2/O1CN01pSG5rv1QextvKF81F_!!6000000002002-0-tps-1080-394.jpg)
![640 - 2022-04-21T205420.718.png](https://img.alicdn.com/imgextra/i3/O1CN01PxD0Vy1skHk68kvao_!!6000000005804-0-tps-1080-466.jpg)

- 事件模式内容留空表示匹配所有。


![640 - 2022-04-21T205443.128.png](https://img.alicdn.com/imgextra/i1/O1CN01g0uOzp1Yie0XuW92h_!!6000000003093-0-tps-1080-549.jpg)

- 目标选择 MNS，选择目标队列完成创建。

![640 - 2022-04-21T205455.746.png](https://img.alicdn.com/imgextra/i1/O1CN01XBnfXL1X2g6HqhOWn_!!6000000002866-0-tps-1080-304.jpg)

- 完成创建之后，点击启动，启动事件流任务。

事件流启动完成之后，我们就可以通过控制台或者 SDK 发送消息到源 RocketMQ Topic 里面。当有 Tag 为 mns 的时候，我们可以看见消息路由到了 mns；当有 Tag 不为 mns 的时候，消息就不会路由到 mns。

## 总结

本篇文章主要向大家分享了通过 EventBridge 如何集成云产品事件源，如何集成云产品事件目标以及通过事件流如何集成消息产品.

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://img.alicdn.com/imgextra/i4/O1CN01Xi1rcu1DM6aIC7ypz_!!6000000000201-0-tps-1920-675.jpg)