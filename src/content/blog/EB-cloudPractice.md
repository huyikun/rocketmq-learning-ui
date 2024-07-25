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

![640 - 2022-04-21T190144.085.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491637529-2874db8c-ff60-4c3e-9f1e-acaab2135280.png#clientId=ud37db2a4-d6fc-4&height=717&id=dVib6&name=640%20-%202022-04-21T190144.085.png&originHeight=717&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud5f86ea8-591c-4f28-8d32-5cf58fbe7e8&title=&width=1080)

EventBridge 通过事件标准化，接入标准化，组件标准化三个方向作为支点拓展 EventBridge 事件生态：


- **事件标准化**：拥抱 CloudEvents 1.0 开源社区标准协议，原生支持 CloudEvents 社区 SDK 和 API，全面拥抱开源社区事件标准生态；
- **接入标准化**：提供标准事件推送协议 PutEvent，并支持 Pull 和 Push 两种事件接入模型，可有效降低事件接入难度，提供云上完善的事件接入标准化流程；
- **组件标准化**：封装标准的事件下游组件工具链体系，包括 Schema 注册、事件分析、事件检索、事件仪表盘等。提供完善的事件工具链生态。

在集成领域 EventBridge 重点打造事件集成和数据集成两类核心场景，下面将围绕这两类场景具体展开描述。

## 事件集成

目前 EventBridge 已经拥有 80+ 云产品的事件源，800+ 种事件类型。整个事件生态还正在逐步丰富中。

![640 - 2022-04-21T203639.802.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491637493-23409a59-8138-4ced-9981-13e4d913d13b.png#clientId=ud37db2a4-d6fc-4&height=433&id=q0W88&name=640%20-%202022-04-21T203639.802.png&originHeight=433&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7b49232d-980f-4ddb-9d2b-d70e9ecb756&title=&width=1080)

那么，EventBridge 如何实现云产品的事件集成呢？

- 首先在 EventBridge 控制台可以看见一个名为 default 的事件总线，云产品的事件都会投递到这个总线；

![640 - 2022-04-21T203655.434.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491639480-0f75392f-87c1-45e6-89f0-58a5a9adec11.png#clientId=ud37db2a4-d6fc-4&height=413&id=zbVvr&name=640%20-%202022-04-21T203655.434.png&originHeight=413&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf5cd0f2c-8b68-42f1-81fd-e995657926e&title=&width=1080)

- 然后点击创建规则，就可以选择所关心的云产品以及它的相关事件进行事件的监听和投递。


![640 - 2022-04-21T203711.484.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491637390-ce742a84-54df-499d-b78f-a6d534fa8f65.png#clientId=ud37db2a4-d6fc-4&height=487&id=E4StT&name=640%20-%202022-04-21T203711.484.png&originHeight=487&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1ebfb6ce-009e-4ab0-900a-7de25ef401d&title=&width=1080)
下面以两个例子为例，来看下 EventBridge 事件集成的方式。

###  OSS 事件集成

以 OSS 事件源为例，来讲解一下如何集成 OSS 事件。


![640 - 2022-04-21T203733.675.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491637396-ea3d0889-aeaa-4740-ac98-1eb5c5ce5476.png#clientId=ud37db2a4-d6fc-4&height=837&id=AiLHq&name=640%20-%202022-04-21T203733.675.png&originHeight=837&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uad6f9348-ba2b-4d64-aabe-20a96bdc59c&title=&width=1080)

OSS 事件现在主要分为 4 类，操作审计相关、云监控相关、配置审计相关、以及云产品相关的事件例如 PutObject 上传文件等等。其他的云产品的事件源也类似，基本都可以分为这几个类型的事件。

下面演示一下事件驱动的在线文件解压服务：

![640 - 2022-04-21T203752.649.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491641121-d7933dd8-69a1-4038-9984-d4828c89ef03.png#clientId=ud37db2a4-d6fc-4&height=379&id=IX6WK&name=640%20-%202022-04-21T203752.649.png&originHeight=379&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u68007168-9d34-4d98-8b36-4fbf29b4873&title=&width=1080)

- 在 OSS Bucket 下面会有一个  zip 文件夹存放需要解压的文件，一个 unzip 文件夹存放解压后的文件；
- 当上传文件到 OSS Bucket 之后，会触发文件上传的事件并投递到 EventBridge 的云服务专用总线；
- 然后会使用一个事件规则过滤 zip 这个 bucket 的事件并投递到解压服务的 HTTP Endpoint；
- 解压服务会在收到事件之后，根据事件里面的文件路径从 OSS 下载文件解压，并在解压之后将文件传到 unzip 目录下；
- 同时，还会有一个事件规则，监听 unzip 目录的文件上传事件，并将事件转换后推送到钉钉群。

一起来看下是如何实现的：

前往下方链接查看视频：
[https://www.bilibili.com/video/BV1s44y1g7dk/](https://www.bilibili.com/video/BV1s44y1g7dk/)

1）首先创建一个 bucket，下面有一个 zip 目录用于存放上传的压缩文件，一个 unzip 目录用于存放解压后的文件。

![640 - 2022-04-21T204237.609.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491641141-3f7c9fe4-9450-4194-93cf-11b29804a55f.png#clientId=ud37db2a4-d6fc-4&height=388&id=V1dsQ&name=640%20-%202022-04-21T204237.609.png&originHeight=388&originWidth=780&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u43719ae2-7fba-4177-867a-c1f4b1172dc&title=&width=780)

2) 部署解压服务，并且暴露公网访问的地址。
解压服务的源码地址为：
[_https://github.com/AliyunContainerService/serverless-k8s-examples/tree/master/oss-unzip?spm=a2c6h.12873639.article-detail.15.5a585d52apSWbk_](https://github.com/AliyunContainerService/serverless-k8s-examples/tree/master/oss-unzip?spm=a2c6h.12873639.article-detail.15.5a585d52apSWbk)

也可以使用 ASK 直接部署，yaml 文件地址为：
[_https://github.com/AliyunContainerService/serverless-k8s-examples/blob/master/oss-unzip/hack/oss-unzip.yaml_](https://github.com/AliyunContainerService/serverless-k8s-examples/blob/master/oss-unzip/hack/oss-unzip.yaml)

3）创建一个事件规则监听 zip 目录下的上传文件的事件，并投递到解压服务的 HTTP  Endpoint。


![640 - 2022-04-21T204346.454.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491641111-7ab20757-01f7-46c7-b951-7fd960b99e56.png#clientId=ud37db2a4-d6fc-4&height=784&id=zNFP8&name=640%20-%202022-04-21T204346.454.png&originHeight=784&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue84c3afe-94d3-4a67-b9de-eef0d9f1374&title=&width=1080)

这里使用 subject，匹配 zip 目录。
4）再创建一个事件规则监听 unzip 目录的事件，投递解压事件到钉钉群。

![640 - 2022-04-21T204409.526.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491641113-7f686d9f-cc5e-4daa-ac56-13a828481ff5.png#clientId=ud37db2a4-d6fc-4&height=964&id=S67MP&name=640%20-%202022-04-21T204409.526.png&originHeight=964&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u143ef512-0938-4ed4-9f39-8c890123a53&title=&width=1080)

这里同样使用 subject，匹配 unzip 目录。


对于变量和模板的配置可以参考官方文档 ：
[_https://help.aliyun.com/document_detail/181429.html_](https://help.aliyun.com/document_detail/181429.html)。

EventBridge 会通过 JSONPath 的方式从事件中提取参数，然后把这些值放到变量中，最后通过模板的定义渲染出最终的输出投递到事件目标。OSS 事件源的事件格式也可以参考官方文档 ：
[_https://help.aliyun.com/document_detail/205739.html#section-g8i-7p9-xpk_](https://help.aliyun.com/document_detail/205739.html#section-g8i-7p9-xpk)_ _，并根据实际的业务需要使用 JSONPath 定义变量。5）最后，通过 oss 控制台上传一个文件进行验证。

![640 - 2022-04-21T204450.912.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491641162-71100b95-10d1-4df7-9e86-99582df6d550.png#clientId=ud37db2a4-d6fc-4&height=521&id=akHBt&name=640%20-%202022-04-21T204450.912.png&originHeight=521&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc822f771-a932-4e6d-b013-3b92ec5316b&title=&width=1080)
![640 - 2022-04-21T204513.042.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491642012-ddd0a519-9d29-42e8-9263-4ee1ec920f73.png#clientId=ud37db2a4-d6fc-4&height=416&id=fpLI2&name=640%20-%202022-04-21T204513.042.png&originHeight=416&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9fe27536-8fea-43f7-a563-3dcbffbdd6a&title=&width=1080)

可以看到刚刚上传的 eventbridge.zip 已经解压到并上传上来了，也可以在钉钉群里面，收到解压完成的通知。此外，还可以在事件追踪这边查看事件的内容已经投递的轨迹。

![640 - 2022-04-21T204843.753.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491641958-19348e37-4114-4a0f-9968-aa73764baa9a.png#clientId=ud37db2a4-d6fc-4&height=276&id=Frla7&name=640%20-%202022-04-21T204843.753.png&originHeight=276&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6e56d47e-99f7-4e3a-858b-e0ec1c2f138&title=&width=1080)

可以看到有两个上传事件：一个是通过控制台上传的事件，一个是解压文件后上传的事件。


![640 - 2022-04-21T204854.592.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491642213-c74bd5c7-b46f-4c6d-a856-73be07377d42.png#clientId=ud37db2a4-d6fc-4&height=455&id=I3Fua&name=640%20-%202022-04-21T204854.592.png&originHeight=455&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u380f5534-848a-4fd8-aadb-f01e213ab30&title=&width=1080)

可以查看轨迹，都成功投递到了解压服务的 HTTP Endpoint 以及钉钉机器人。

###  以自定义事件源以及云产品事件目标的方式集成云产品

刚才演示的 demo 是集成云服务的事件源，下面再通过一个 demo 看一下如何通过以自定义事件源以及云产品事件目标的方式集成云产品。

前往下方链接查看视频：
[https://www.bilibili.com/video/BV1QF411M7xv/](https://www.bilibili.com/video/BV1QF411M7xv/)

这个 demo 的最终效果是通过 EventBridge 自动进行数据的清洗，并投递到 RDS 中去。事件内容是一个 JSON，拥有两个字段一个名字一个年龄，现在希望将把大于 10 岁的用户过滤出来并存储到 RDS 中。

![640 - 2022-04-21T204921.765.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491642120-f6e035a0-8ae3-4135-81ea-bf3e20a04b15.png#clientId=ud37db2a4-d6fc-4&height=334&id=JwjzS&name=640%20-%202022-04-21T204921.765.png&originHeight=334&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc7f9651e-4c62-4f5c-b5b4-162bd4c7769&title=&width=1080)

整体的架构如图所示，使用一个 MNS Queue 作为自定义事件源，并通过 EventBridge 过滤并转换事件最终直接输出到 RDS 中去。

![640 - 2022-04-21T204934.571.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491642181-fa33e591-11b7-4e6a-8586-10a1b7f56123.png#clientId=ud37db2a4-d6fc-4&height=268&id=BqejR&name=640%20-%202022-04-21T204934.571.png&originHeight=268&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1711fb43-0185-465d-a828-73f6b5511c0&title=&width=1080)


1）首先已经创建好了一个 MNS Queue，创建好一个 RDS 实例以及数据库表，表结构如下所示：

![640 - 2022-04-21T205023.666.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491642602-f0d1eb26-6653-4826-bdb6-0c6702eab929.png#clientId=ud37db2a4-d6fc-4&height=220&id=eyL9F&name=640%20-%202022-04-21T205023.666.png&originHeight=220&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u72c81995-54fc-4478-acda-dcb0800690f&title=&width=1080)

2）创建一个自定事件总线，选择事件提供方为 MNS，队列为提前创建好的队列；

![640 - 2022-04-21T205040.510.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491642572-a424d249-0992-4239-b618-c0f14cafaa13.png#clientId=ud37db2a4-d6fc-4&height=607&id=YGOES&name=640%20-%202022-04-21T205040.510.png&originHeight=607&originWidth=619&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u63b9e359-20cd-4c25-8d61-b055d163840&title=&width=619)

创建好了之后，我们就可以在事件源这里看见一个已经正在运行中的事件源；

![640 - 2022-04-21T205057.959.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491642801-938c1265-6b60-43d1-86e3-2e229034af08.png#clientId=ud37db2a4-d6fc-4&height=152&id=BwQXU&name=640%20-%202022-04-21T205057.959.png&originHeight=152&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uba96a280-884f-4d59-adfc-9084e01cfa4&title=&width=1080)

3）接下来创建规则投递到 RDS

![640 - 2022-04-21T205113.747.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491642808-27b9d6d6-de9a-4185-be63-adf5e23db72e.png#clientId=ud37db2a4-d6fc-4&height=386&id=nwbjo&name=640%20-%202022-04-21T205113.747.png&originHeight=386&originWidth=1050&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u59d1ca45-76d4-44e3-a86e-d642b143dca&title=&width=1050)
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

![640 - 2022-04-21T205154.428.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491642876-7b337fc5-1851-4d58-8ac5-e36829480325.png#clientId=ud37db2a4-d6fc-4&height=258&id=FANOE&name=640%20-%202022-04-21T205154.428.png&originHeight=258&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud7da3d34-905e-41bb-a7f1-cbac4edc69c&title=&width=1080)
5）最后，先用 MNS Queue 发送一个消息，这个的 age 是大于 10 的。

![640 - 2022-04-21T205209.436.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491643086-4f9cb7e4-02aa-4848-ae5e-864b70c67103.png#clientId=ud37db2a4-d6fc-4&height=355&id=dewzW&name=640%20-%202022-04-21T205209.436.png&originHeight=355&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf1984989-e4ad-4c8c-a07b-3c084736200&title=&width=1080)

可以看见这条事件就输出到了 RDS 里面了。

![640 - 2022-04-21T205222.908.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491643118-ef543f9b-8c82-4656-963a-c3d8a9187b88.png#clientId=ud37db2a4-d6fc-4&height=273&id=r4RWh&name=640%20-%202022-04-21T205222.908.png&originHeight=273&originWidth=831&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9736903f-24ea-41ac-987f-7520ffefd97&title=&width=831)

下面再发一个小于 10 的消息到 MNS Queue。


![640 - 2022-04-21T205236.916.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491643284-04b661f9-67a6-4928-8c48-74c43c3612ea.png#clientId=ud37db2a4-d6fc-4&height=332&id=UbmCN&name=640%20-%202022-04-21T205236.916.png&originHeight=332&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u46e84b76-3d44-4111-8235-68e3cc57651&title=&width=1080)
这条事件就被过滤掉了，没有输出到 RDS。

![640 - 2022-04-21T205251.070.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491643404-fa5f3361-21bf-4e2c-8350-a3dd510c0e34.png#clientId=ud37db2a4-d6fc-4&height=241&id=KiBYH&name=640%20-%202022-04-21T205251.070.png&originHeight=241&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u939da39f-95f6-4323-b206-6223aa30322&title=&width=1080)

也可通过事件追踪查看事件：

![640 - 2022-04-21T205303.484.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491643548-b7fa22b0-7a11-46a3-8e59-e5d51b3a7c82.png#clientId=ud37db2a4-d6fc-4&height=388&id=Vc9Kw&name=640%20-%202022-04-21T205303.484.png&originHeight=388&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u64ea6193-443a-4835-bdf2-d20d3304bcf&title=&width=1080)
可以看到一条事件成功投递到了 RDS，一条事件被过滤掉了，没有进行投递。

## 数据集成

事件流是 EventBridge 为数据集成提供的一个更为轻量化、实时的端到端的事件流试的通道，主要目标是将事件在两个端点之间进行数据同步，同时提供过滤和转换的功能。目前已经支持阿里云各消息产品之间的事件流转。

![640 - 2022-04-21T205326.119.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491643686-bc3e60b5-a0a5-4707-b1ef-2576347a8bda.png#clientId=ud37db2a4-d6fc-4&height=671&id=FxIME&name=640%20-%202022-04-21T205326.119.png&originHeight=671&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4f39365e-52e3-451f-a714-83c53252d31&title=&width=1080)

不同于事件总线模型，在事件流中，并不需要事件总线，其 1：1 的模型更加的轻量，直接到目标的方式也让事件更加的实时；通过事件流，我们可以实现不同系统之间的协议转换，数据同步，跨地域备份的能力。

![640 - 2022-04-21T205339.724.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491643684-4c398c4f-3c53-4b50-9cca-e7475c206e41.png#clientId=ud37db2a4-d6fc-4&height=978&id=BN3Us&name=640%20-%202022-04-21T205339.724.png&originHeight=978&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4e051adb-b60a-4cb0-9e76-fff227bc3a0&title=&width=1080)


下面将通过一个例子讲解如何使用事件流，将 RocketMQ 的消息路由到 MNS Queue，将两个产品集成起来。

整体的结构如图所示，通过EventBridge 将 RocketMQ 中 TAG 为 MNS 的消息路由到 MNQ Queue。

![640 - 2022-04-21T205355.726.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491643808-0ab5c9b8-a8cf-4081-a061-5cee7de739e1.png#clientId=ud37db2a4-d6fc-4&height=292&id=yh6jS&name=640%20-%202022-04-21T205355.726.png&originHeight=292&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u3c598f63-8c52-481a-8019-8fb50f7d8d4&title=&width=1080)

一起看下怎么实现：

前往下方链接查看视频：
[https://www.bilibili.com/video/BV1D44y1G7GK/](https://www.bilibili.com/video/BV1D44y1G7GK/)

- 首先创建一个事件流，选择源 RocketMQ 实例，填写 Tag 为 mns。


![640 - 2022-04-21T205417.161.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491643926-79392284-bcbd-460e-b2cd-7474949237c1.png#clientId=ud37db2a4-d6fc-4&height=394&id=xhWo9&name=640%20-%202022-04-21T205417.161.png&originHeight=394&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc2bc49a8-044f-49a3-9388-66594d190a7&title=&width=1080)
![640 - 2022-04-21T205420.718.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491644117-3bbc7af2-3acb-4394-8ce1-f09ed0f202f0.png#clientId=ud37db2a4-d6fc-4&height=466&id=nnyhO&name=640%20-%202022-04-21T205420.718.png&originHeight=466&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u86206da1-8677-41a4-84c9-169cccde7cb&title=&width=1080)

- 事件模式内容留空表示匹配所有。


![640 - 2022-04-21T205443.128.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491644450-2656a227-15b2-426c-b9ea-9d1383d51908.png#clientId=ud37db2a4-d6fc-4&height=549&id=xfkn2&name=640%20-%202022-04-21T205443.128.png&originHeight=549&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud8ba1fd8-a1a0-4e96-b883-0ded4d69384&title=&width=1080)

- 目标选择 MNS，选择目标队列完成创建。

![640 - 2022-04-21T205455.746.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491644463-90bdbec4-0551-4178-a781-9711bc102c05.png#clientId=ud37db2a4-d6fc-4&height=304&id=Tdq26&name=640%20-%202022-04-21T205455.746.png&originHeight=304&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9ea94bc5-b094-4379-ad98-bb5fc706155&title=&width=1080)

- 完成创建之后，点击启动，启动事件流任务。

事件流启动完成之后，我们就可以通过控制台或者 SDK 发送消息到源 RocketMQ Topic 里面。当有 Tag 为 mns 的时候，我们可以看见消息路由到了 mns；当有 Tag 不为 mns 的时候，消息就不会路由到 mns。

## 总结

本篇文章主要向大家分享了通过 EventBridge 如何集成云产品事件源，如何集成云产品事件目标以及通过事件流如何集成消息产品.

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)