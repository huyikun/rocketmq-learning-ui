---
title: "阿里云 EventBridge  事件驱动架构实践"
date: "2021/11/17"
author: "周新宇"
img: "https://img.alicdn.com/imgextra/i4/O1CN01qqyU5F1flZi93xzbU_!!6000000004047-0-tps-685-383.jpg"
tags: ["practice"]
description: "我们认为 EventBridge 是云原生时代新的计算驱动力，这些数据可以驱动云的计算能力，创造更多业务价值。"
---
_作者：周新宇_
_审核&校对：白玙、佳佳_
_编辑&排版：雯燕_


_本文内容整理自 中国开源年会 演讲_
首先做一个自我介绍，我是 RocketMQ 的 PMC member 周新宇，目前负责阿里云 RocketMQ 以及 EventBridge 的产品研发。今天我的分享主要包括以下几部分：

- 消息与事件、微服务与事件驱动架构



- 阿里云 EventBridge：事件驱动架构实践



- 基于 RocketMQ 内核构建阿里云统一的事件枢纽



- 云原生时代的新趋势：Serverless+ 事件驱动



- 事件驱动架构的未来展望



## 消息与事件、微服务与事件驱动架构


首先，我们先讲一下消息跟事件的区别：大家都知道 RocketMQ 里面的消息，它是非常泛化的概念，是一个比事件更加抽象的概念。因为消息的内容体就是 Byte 数组，没有任何一个定义，是个弱 Data，所以它是非常通用的抽象。

与之相反的，事件可能是更加具象化的。一般情况下，它有一个 Schema 来精准描述事件有哪些字段，比如 CloudEvents 就对事件有一个明确的 Schema 定义。事件也往往代表了某个事情的发生、某个状态的变化，所以非常具象化。

从用途来讲，消息往往用于微服务的异步解耦的架构。但这一块的话，事件驱动跟消息是稍微类似的。消息的应用场景往往发生在一个组织内部，消息的生产方知道这个消息要将被如何处理。比如说在一个团队里，消息的生产者跟发送者可能是同一个团队同一块业务，对这个消息内容有一个非常强的约定。相比之下，事件更加松耦合，比如说事件发送方也不知道这个事件将被投递到什么地方，将被谁消费，谁对他感兴趣，对事件被如何处理是没有任何预期的。所以说，基于事件的架构是更加解耦的。消息的应用往往还是脱离不了同一个业务部门，即使一些大公司里最多涉及到跨部门合作。消息的使用通过文档进行约束，事件通过 Schema 进行约束，所以我们认为事件是比消息更加彻底解耦的方式。
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489263018-c8294355-b857-4619-a7e7-7a8cbe30a12f.gif#clientId=u5222ad5f-7c04-4&from=paste&id=uf8ce45d9&originHeight=1&originWidth=1&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ucf47f6d0-1377-48d6-b62c-7229d41ea2f&title=)
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489263039-41b12f0b-1764-44ec-a697-0b9ee54ac69d.png#clientId=u5222ad5f-7c04-4&from=paste&id=ub3371823&originHeight=506&originWidth=902&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u85b56de7-da97-4e4d-bdcf-448fb2b24b8&title=)

接下来，微服务架构跟 EDA 架构有什么区别？

首先是微服务架构，微服务作为从单体应用演进而来的架构，比如说把一个单体应用拆成了很多微服务，微服务之间通过 RPC 进行组织和串联。过去一个业务可能是在本地编排了一堆 function，现在通过一堆 RPC 将之串起来。比如说用户去做一个前端的下单操作，可能后台就是好几个微服务进行订单操作，一个微服务去新建订单，一个微服务去对订单进行处理，处理完再调另一个微服务去把订单已完成的消息通知出去，这是一个典型的 RPC 架构。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489264814-84a36a77-e7d2-4c79-ab0d-1940c7173c54.png#clientId=u5222ad5f-7c04-4&from=paste&id=u117a8487&originHeight=506&originWidth=902&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4d60c06b-b287-4ba6-9c55-dbe9613cb19&title=)
但纯粹的 RPC 架构有很多问题，比如所有业务逻辑是耦合在一起的，只是把本地方法调用换成了远程调用。当业务增速达到一定阶段，会发现各个微服务之间的容量可能是不对等的，比如说短信通知可以通过异步化完成，却同步完成。这就导致前端有多大流量，短信通知也需要准备同样规模的流量。当准备资源不充足，上下游流量不对等时，就有可能导致某个微服被打挂，从而影响到上游，进而产生雪崩效应。

在这种情况下，大家一般就会引入消息队列进行异步解耦。这个架构已非常接近于事件驱动架构了，还是以用户前端创建一个订单举例，订单创建的事件就会就发到事件总线、event broker、 event bus 上，下游各个不同订阅方去对这个事件做监听处理。

不同之处在于消息订阅者基于消息中间件厂商提供 SDK 的去做消息处理，业务往往需要进行改造，也会被厂商提供的技术栈绑定；事件驱动架构中订阅者属于泛化订阅，即不要求订阅方基于什么样的技术栈去开发，可以是一个 HTTP 网关，也可以是一个function，甚至可以是历史遗留的存量系统。只要 event broker 兼容业务的协议，就可以把事件推送到不同订阅方。可以看到，泛化订阅的用途更加广泛，更加解耦，改造成本也最低。
**

### 阿里云 EventBridge：事件驱动架构实践


Gartner 曾预测， EDA 架构将来会成为微服务主流。在 2022 年它将会成为 60% 的新型数字化商业解决方案，也会有 50% 的商业组织参与其中。

同时， CNCF 基金会也提出了 CloudEvents 规范，旨在利用统一的规范格式来声明事件通信。EventBridge也是遵循这一标准。CloudEvents作为社区标准，解除了大家对于厂商锁定的担忧，提高了各个系统之间的互操作性，相当于说对各个系统约定了统一的语言，这个是非常关键的一步。

事件在开源社区有了统一的规范，但在云上，很多用户购买了云厂商很多云产品，这些云产品每天可能有数以亿计的事件在不停产生，这些事件躺在不同云服务的日志、内部实现里。用户也看不着，也不知道云产品实例在云上发生什么事情。各个厂商对事件的定义也不一样，整体是没有同一类标准。各个云服务之间的事件是孤立的，就是说没有打通，这不利于挖掘事件的价值。在使用开源产品时也有类似问题，用户往往也没有统一标准进行数据互通，想去把这些生态打通时需要付出二次开发成本。 

最后，事件驱动在很多场景应用的现状是偏离线的，现在比较少的人把 EDA 架构用于在线场景。一方面是因为没有事件型中间件基础设施，很难做到一个事件被实时获取，被实时推送的同时，能被业务方把整个链路给追踪起来。所以，以上也是阿里云为什么要做这款产品的背景。 

因此，我们对 EventBridge 做了定义，它有几个核心价值：
**

**一、统一事件枢纽：**统一事件界面，定义事件标准，打破云产品事件孤岛。
**

**二、事件驱动引擎：**海量事件源，毫秒级触发能力，加速 EDA/Serverless 架构升级。
**

**三、开放与集成：**提供丰富的跨产品、跨平台连接能力，促进云产品、应用程序、SaaS服务相互集成。 
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489262779-ece0e84e-2891-4956-95bc-cab824f63080.gif#clientId=u5222ad5f-7c04-4&from=paste&id=u59c82839&originHeight=1&originWidth=1&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u46e4f1c8-f1ac-4b3f-8826-0e6b329af0c&title=)
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpg/59356401/1680489262952-985dd573-3eb0-4802-b4d4-2da6e5e77d32.jpg#clientId=u5222ad5f-7c04-4&from=paste&id=u851e146a&originHeight=1440&originWidth=2560&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1de7cea9-6986-43a1-a858-19827e9a775&title=)
首先讲一下，EventBridge 基本模型，EventBridge 有四大部分。第一部分是事件源，这其中包括云服务的事件、自定义应用、SaaS应用、自建数据平台。

第二个部分就是事件总线，这是存储实体，事件过来，它要存在某个地方进行异步解耦。类似于说 RocketMQ 里面 topic 的概念，具备一定存储的同时，提供了异步能力。事件总线涵盖两种，一种默认事件总线，用于收集所有云产品的事件，另一种自定义事件总线就是用户自己去管理、去定义、去收发事件，用来实践 EDA 架构概念。第三部分就是规则，规则与 RocketMQ 的消费者、订阅比较类似，但我们赋予规则包括过滤跟转换在内的更多计算能力。第四部分就是事件目标即订阅方，对某事件感兴趣就创建规则关联这个事件，这其中包括函数计算、消息服务、HTTP 网关等等。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489265145-dec2f8e7-53d4-4feb-90b0-fcf7ea12e008.png#clientId=u5222ad5f-7c04-4&from=paste&id=ub4353b34&originHeight=506&originWidth=902&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1419ca6f-722a-48f3-b56d-e044467c1fb&title=)
这里具体讲一下这个事件规则，虽然类似于订阅，但事件规则拥有事件轻量级处理能力。比如在使用消息时可能需要把这个消息拿到本地，再决定是否消费掉。但基于规则，可以在服务端就把这个消息处理掉。

事件规则支持非常复杂的事件模式过滤，包括对指定值的匹配，比如前缀匹配、后缀匹配、数值匹配、数组匹配，甚至把这些规则组合起来形成复杂的逻辑匹配能力。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489265269-18fd2c33-350d-4d6e-bad9-182c6f30b757.png#clientId=u5222ad5f-7c04-4&from=paste&id=ua94a99c2&originHeight=506&originWidth=902&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u60494f7a-59c3-4f3c-a15a-6decd590777&title=)
另一个，就是转换器能力，事件目标泛化定义，其接受的事件格式可能有很多种，但下游服务不一定。比如说你要把事件推到钉钉，钉钉 API 已经写好了并只接受固定格式。那么，把事件推过去，就需要对事件进行转换。我们提供了包括：

- **完整事件：**不做转换，直接投递原生 CloudEvents。

- **部分事件：**通过 JsonPath 语法从 CloudEvents 中提取部分内容投递至事件目标。

- **常量：**事件只起到触发器的作用，投递内容为常量。

- **模板转换器：**通过定义模板，灵活地渲染自定义的内容投递至事件模板。

- **函数：**通过指定处理函数，对事件进行自定义函数处理，将返回值投递至事件目标。

目前，EventBridge 集成了 80 多种云产品，约 800 多种事件类型，第一时间打通了消息生态，比如说 RocketMQ 作为一个微服务生态，我们去实践消息事件理念，就可以把 RocketMQ 的事件直接投递到 EventBridge，通过事件驱动架构去对这些消息进行处理，甚至 MQTT、KafKa 等消息生态，都进行打通集成。除了阿里云消息产品的打通，下一步也会把一些开源自建的消息系统进行打通。另一个生态就是 ISV 生态，为什么 ISV 需要 EventBridge？以钉钉 6.0 举例，其最近发布了连接器能力。钉钉里面要安装很多软件，这些软件可能是官方提供，也可能是 ISV、第三方开发者提供，这就造成数据的互通性差。因此，我们提供这个能力让 ISV 的数据流通起来。最后就是事件驱动生态，我们当前能够触达到大概 10 多种事件目标，目前也在持续丰富当中。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489265295-88a9d5ec-8cd3-4481-9b5a-db92c0ea9190.gif#clientId=u5222ad5f-7c04-4&from=paste&id=ub1039563&originHeight=1&originWidth=1&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u97f38405-eccc-4c69-859e-f07f818e42b&title=)
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489265509-35f0ddef-cc06-415d-910c-00d5182d7199.png#clientId=u5222ad5f-7c04-4&from=paste&id=u92e27475&originHeight=506&originWidth=902&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u03a948a7-512a-4c6a-a660-fe685b39152&title=)
事件因相对消息更加解耦、离散，所以事件治理也更加困难。所以，我们制作了事件中心并提供三块能力：

- **事件追踪：**对每一个事件能有完整的追踪，它从在哪里产生，什么时候被投递，什么时候被过滤掉了，什么时候被投递到某个目标，什么时候被处理成功了。使整个生命周期完全追踪起来。



- **事件洞察&分析：**让用户从 EDA 编程视角变成用户视角，让用户更加迅速的了解 EventBridge 里面到底有哪些事件，并进行可视化分析。通过 EB 做到就近计算分析，直接把业务消息导入到事件总线中，对消息进行及时分析。



- **事件大盘：**针对云产品，引导云产品对业务事件进行定义，让云产品更加开放，从而提供大盘能力。



## 基于 RocketMQ 内核构建阿里云统一的事件枢纽
EventBridge 一开始就构建在云原生的容器服务之上。在这之上首先是 RocketMQ 内核，内核在这个产品里扮演的角色有两种，一种就是事件存储，当成存储来用；另一方面是利用订阅能力，把订阅转化成泛化订阅。在 RocketMQ 内核之上就是 connect 集群。EventBridge 比较重要的能力是连接，所以 EventBridge 首先要具备 Source 的能力，把事件 Source 过来，然后再存下来；其核心是 Connect 集群，每个 Connect 集群有很多 Worker。每个 Worker 要负责很多事情，包括事件的摄入，事件过滤，事件转换，事件回放，事件追踪等，同时在 Connect 集群之上有 Connect 控制面，来完成集群的治理，Worker 的调度等。

在更上面一层是 API Server，一个事件的入口网关，EventBridge 的世界里，摄入事件有两种方式，一种是通过 Connect 的 Source Connector，把事件主动的 Source 过来，另一种用户或者云产品可以通过 API server，通过我们的 SDK 把事件给投递过来。投递的方式有很多种，包括有 OpenAPI，有多语言的官方 SDK，同时考虑 CloudEvents 有社区的标准，EventBridge 也完全兼容社区开源的 SDK，用户也可以通过 Webhook 将事件投递过来。

这个架构优点非常明显：
**

**（1）减少用户开发成本**
**


- 用户无需额外开发进行事件处理

- 编写规则对事件过滤、转换

**（2）原生 CloudEvents 支持**
**


- 拥抱 CNCF 社区，无缝对接社区 SDK

- 标准协议统一阿里云事件规范

**（3）事件 Schema 支持**
**


- 支持事件 Schema 自动探测和校验

- Source 和 Target 的 Schema 绑定

**（4）全球事件任意互通**
**


- 组建了跨地域、跨账户的事件网络

- 支持跨云、跨数据中心事件路由

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489265504-ea76ef8a-54d2-4eac-bac1-f687a42b7542.png#clientId=u5222ad5f-7c04-4&from=paste&id=ub71bc52c&originHeight=506&originWidth=902&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u732a61d3-286b-4232-9993-601271f4fc1&title=)
![](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489265904-8e57e9f0-3a57-45d1-891f-0ebb22b7cd11.gif#clientId=u5222ad5f-7c04-4&from=paste&id=ubea3f1c3&originHeight=1&originWidth=1&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1ae984b2-4da0-46c3-b429-648cf2a0c48&title=)
## 云原生时代的新趋势：Serverless+ 事件驱动


我们认为 Serverless 加事件驱动是新的研发方式，各个厂商对 Serverless 理解各有侧重，但是落地方式大道趋同。

首先，Serverless 基础设施把底层 IaaS 屏蔽掉，上层 Serverless 运行时即计算托管，托管的不仅仅是微服务应用、K8s 容器，不仅仅是函数。 

EventBridge 首先把这种驱动的事件源连接起来，能够触发这些运行时。因为 Serverless 最需要的就是驱动方，事件驱动带给他这样的能力，即计算入口。EventBridge 驱动 Serverless 运行时，再去连接与后端服务。目前，EventBridge 与 Serverless 结合的场景主要是松耦合场景，比如前端应用、SaaS 服务商小程序，以及音视频编解码等落地场景。

那么，Serverless 的 EDA 架构开发模式到底是怎样的呢？以函数计算为例，首先开发者从应用视角需要转换为函数视角，将各个业务逻辑在一个个函数中进行实现；一个函数代表了一个代码片段，代表了一个具体的业务，当这段代码上传后就变成了一个函数资源，然后 EventBridge 可以通过事件来驱动函数，将函数通过事件编排起来组成一个具体的应用。

这里面 function 还需要做很多事情，大家也知道 function 有很多弊端，它最受诟病的就是冷启动。因为 Serverless 需要 scale to zero 按量付费，在没有请求没有事件去触发时，应该是直接收到 0 的，从 0~1 就是一个冷启动。这个冷启动有些时候可能要秒级等待，因为它可能涉及到下载代码、下载镜像，涉及到 namespace 的构建，存储挂载，root 挂载，这里面很多事情，各个云厂商投入很大精力优化这一块。Serverless 价格优势很明显，它资源利用率特别高，因按量付费的，所以能做到接近百分百的资源利用率，也不需要去做容量规划。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489266006-debfb905-f4b8-4114-831f-5db94faed90a.png#clientId=u5222ad5f-7c04-4&from=paste&id=ud2dcd897&originHeight=506&originWidth=902&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uae7ac081-c0ab-46ce-88be-cd559a20e87&title=)
举一个简单的例子，就是基于 Serverless 加 EDA 的极简编程范式，再举一个具体的例子，新零售场景下 EDA 架构对这个业务进行改造。首先来讲，业务中有几个关键资源，可能有 API 网关、函数计算，首先可以去打通一些数据，打通 rds 并把 rds 数据同步过来，兼容一些历史架构，同时去触发计算资源、function、网关。整个架构优势非常明显，所以具备极致弹性能力，不需要去预留资源。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489266508-f2e86ea2-32fa-4b0c-8bc1-4129247f0d13.png#clientId=u5222ad5f-7c04-4&from=paste&id=u9c2b657c&originHeight=506&originWidth=902&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u83bf2eb8-9513-436a-8724-b942a80d03d&title=)
## 事件驱动的未来展望


我们认为事件驱动的未来有两部分，一是要做好连接，做好云内、跨云的集成，让用户的多元架构更加高效。二是开源生态的集成，我们可以看到开源生态愈发蓬勃，所以也需要把这些开源生态中的数据集成好。此外，还有传统 IDC 计算能力、边缘计算能力这些生态都需要有连接性软件把它连接起来。

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489266686-0a3014fb-092a-4527-89c5-e713381fc177.png#clientId=u5222ad5f-7c04-4&from=paste&id=u3b6dde43&originHeight=506&originWidth=902&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uca6607f1-1a38-4f4b-b576-c36c4eb9311&title=)![](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489266535-b519e952-2729-42a8-8f0e-633a821a4972.gif#clientId=u5222ad5f-7c04-4&from=paste&id=u0c41a539&originHeight=1&originWidth=1&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u10ba763d-2d53-43ca-a1cf-318516de743&title=)

EventBridge 是云原生时代新的计算驱动力，这些数据可以去驱动云的计算能力，创造更多业务价值。

### 往期推荐


[基于消息队列 RocketMQ 的大型分布式应用上云最佳实](https://developer.aliyun.com/article/799142)![](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489266582-e87fb156-059b-4f17-aae9-cdc65ef27d63.gif#clientId=u5222ad5f-7c04-4&from=paste&id=u6c39190b&originHeight=1&originWidth=1&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u89bac52d-0e6c-43f5-921d-0a649f270a4&title=)

[阿里云消息队列 RocketMQ 5.0 全新升级：消息、事件、流融合处理平台](https://developer.aliyun.com/article/797277)

![](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489266986-6bbef93a-ee11-4ef5-9b9d-aae09864003e.gif#clientId=u5222ad5f-7c04-4&from=paste&id=uf7bc8fa2&originHeight=1&originWidth=1&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1086b91f-0056-4806-adea-8d4badf6928&title=)[EDA 事件驱动架构与](http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247516149&idx=1&sn=1a0c0b562bbfb6df960a7f16b7fa3acd&chksm=fae6b43acd913d2ca0b5621f46b18488a796b23722d4664c8a116ae4a7e1ae66df9e2706f473&scene=21#wechat_redirect)[EventBridge 二三事](https://developer.aliyun.com/article/793861)![](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489266996-8654d812-03d1-4679-a945-0563addd1654.gif#clientId=u5222ad5f-7c04-4&from=paste&id=uccf8b305&originHeight=1&originWidth=1&originalType=url&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u93d8d0e9-29e3-4333-aa32-34347284a24&title=)

[云栖发布｜企业级互联网架构全新升级 ，助力数字创新](https://developer.aliyun.com/article/795756)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动： 

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)