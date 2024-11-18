---
title: "基于事件驱动构建 AI 原生应用"
description: "基于事件驱动构建 AI 原生应用"
date: "2024-11-18"
category: "case"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

作者｜寒斜

AI 应用在商业化服务的阶段会面临诸多挑战，比如更快的服务交付速度，更实时、精准的结果以及更人性化的体验等，传统架构限制于同步交互，无法满足上述需求，本篇文章给大家分享一下如何基于事件驱动架构应对上述挑战。

## 盘点 AI 应用场景

在深入探讨事件驱动架构跟 AI 结合前，我们先梳理一下 AI 应用的现状。

从应用架构层面，大致可以把 AI 应用分为以下三类：

**1）基于基础模型的扩展应用**，典型的如 ChatGpt（文本生成）、StableDiffusion（图像生成）、CosyVoice（声音生成）等，这类应用通常会以模型能力为核心，提供相对原子化的服务。

![](https://img.alicdn.com/imgextra/i3/O1CN01uvk17U1jTx6t2umrz_!!6000000004550-0-tps-3000-1688.jpg)

**2）智能知识库应用**，如 Langchain chatchat，这类应用是以 LLM 为核心，基于 RAG（增强检索技术）构建的具有广泛的业务场景的应用。

![](https://img.alicdn.com/imgextra/i1/O1CN01vIxIl727O2mNcrWP6_!!6000000007786-0-tps-3556-1720.jpg)

**3）智能体应用**，智能体应用核心要点是应用以 LLM 为交互中枢，能够通过工具的调用联通外部世界，复杂的表现形式如多智能体协作等，是企业 AI 应用落地最具想象空间的一类应用。

![](https://img.alicdn.com/imgextra/i4/O1CN01RZBDQS1GX2vcqlg0s_!!6000000000631-0-tps-2522-622.jpg)

## 浅析 AI “原生”

说到“原生”二字，它代表的是对某种概念的广泛认知，比如提移动原生应用立马可以联想到手机端的 APP，提云原生应用很多开发者立马可以想到容器化等，而对于 AI “原生”，除了 ChatGpt，Midjourney 等几款头部 AI 应用，我们似乎还没有看到像移动应用那样广泛的“原生”应用被定义出来，当然今天也没有办法给出明确的结论，只是通过一些事实，帮大家推演 AI “原生”的方向，希望能够帮助慢慢凝聚在内心中那个对“AI 原生”的影像。

### AI 给应用架构带来的变化

当 AI 能力加入后，我们的应用架构发生了较大的变化。RAG，Agent 等编程范式被引入，传统的工作流也因为有了 AI 节点，变得与以往有所不同。

![](https://img.alicdn.com/imgextra/i2/O1CN01xp2fGP1SbsUrFyTub_!!6000000002266-0-tps-2338-1134.jpg)

**AI 应用架构-RAG**

![](https://img.alicdn.com/imgextra/i4/O1CN01AQ2mGj243U9Z595sR_!!6000000007335-0-tps-2608-1254.jpg)

**AI 应用架构-Agent**

![](https://img.alicdn.com/imgextra/i4/O1CN01w2Uq2f1xdTyMv7qse_!!6000000006466-0-tps-2598-1330.jpg)

**加入 AI 节点的工作流**

![](https://img.alicdn.com/imgextra/i3/O1CN01aRMMSC1xJmwT1fXrV_!!6000000006423-0-tps-3416-1742.jpg)

### AI 应用的变化趋势

从观察知名 AI 厂商的产品形态演进看，AI 应用由前面提到的基础模型扩展、智能知识库、智能体三类叠加又相对分离，在慢慢向由智能体统一管控约束的方向发展。

![](https://img.alicdn.com/imgextra/i2/O1CN01aQq1Eh1qIgg9uVwlG_!!6000000005473-0-tps-1018-884.jpg)

比如 Open AI 的 Canvas，Claude Artifacts，Vercel v0 等产品特性。它们都表现出了一系列的共性：**智能内核，多模态，LUI 交互。**

![](https://img.alicdn.com/imgextra/i1/O1CN01teVGZU24GldjjwqZY_!!6000000007364-0-tps-924-1356.jpg)

从另外一个角度理解，AI 原生的应用只有突破之前的用户体验才有可能让用户买单。分散的基础模型能力，多模态能力都只能在某些场景下有体验提升，某些方面甚至不如传统应用的用户体验。所以需要整合，将对话式交互，智能模型和多模态叠加从而构建出超越传统应用的使用体验。

## 使用事件驱动构建 AI 原生

这里并不是单纯为了追求技术的先进性而使用事件驱动架构，是因为实践中顺序式的架构有时候无法满足业务需求。

### 传统顺序式的架构在构建 AI 原生的挑战

**顺序调用无法保障推理体验**

![](https://img.alicdn.com/imgextra/i1/O1CN01OzVWz61HMngTKjutT_!!6000000000744-0-tps-2474-1078.jpg)

模型服务的推理耗时远高于传统意义的网络服务调用，比如在文生图这个场景下使用 StableDiffusion 服务，即使经过算法优化后最快也是秒级，并发量较大的时候，会很容易导致服务器宕机。此外如声音的合成，数字人的合成等耗时可能是分钟级的，此时顺序调用明显就不太合适。选择事件驱动的架构可以快速响应用户，推理服务按需执行，这样既能够保障用户体验，同时也降低系统宕机风险。

**顺序调用无法支持实时数据构建的需求**

![](https://img.alicdn.com/imgextra/i3/O1CN01VERCOq1MYm7Gysl7Q_!!6000000001447-0-tps-2466-1062.jpg)

在智能问答系统中，结果的好坏跟数据有很大的关系。问答召回数据的实时性和准确性很大程度影响着智能问答系统的用户体验，从系统架构层面，问答和数据的更新是分开的。靠人工去更新海量数据不现实，通过设置定时任务以及构建知识库数据更新的工作流能够更加有效的解决数据实时更新的问题，事件驱动架构在这个场景下优势非常明显。

**双向互动场景无法实现**

![](https://img.alicdn.com/imgextra/i2/O1CN014a1VTb1DuSKD0tpPb_!!6000000000276-0-tps-1952-818.jpg)

在问答服务场景下，拟人化的行为能够得到用户好感从而扩展商机，传统的问答式应用架构相对机械死板，而使用消息队列作为信息传输可以有效主动触达用户，通过合理的意图判断，主动向用户问好，是有效的留存手段。

## 事件驱动构建 AI 原生的实践

接下来分享一下基于事件驱动架构构建的 AI 应用的一些实践。

### StableDiffusion 异步推理

![](https://img.alicdn.com/imgextra/i4/O1CN015jdfY71Wkogm0zApp_!!6000000002827-2-tps-2884-1366.png)

前面提到了关于文生图模型 StableDiffusion 在服务客户中遇到的问题，我们利用事件驱动架构，使用函数计算和轻量消息队列（原 MNS）构建了 StableDiffusion 的异步推理架构，用户请求到来时经过函数计算网关到达 API 代理函数，API 代理函数对请求进行打标鉴权，之后将请求发送到 MNS 队列，同时记录请求的元数据和推理信息到表格存储 TableStore，推理函数根据任务队列进行消费，调度 GPU 实例启动 StableDiffusion 进行服务，结束后返回图片结果以及更新请求状态，端侧通过页面上的轮询告知用户。

### VoiceAgent 实时对话

![](https://img.alicdn.com/imgextra/i1/O1CN013vaPlI28rBb3Fh7Fx_!!6000000007985-0-tps-2020-1132.jpg)

这是一个相对复杂的应用，使用者可以通过语音跟背后的智能问答服务实时对话，同时还能够接收到来自智能服务的主动询问。

![](https://img.alicdn.com/imgextra/i3/O1CN01pJmblb1IqrIFBDSm4_!!6000000000945-0-tps-2470-1194.jpg)

整体依然采用事件驱动架构，其 RTC Server 部分安装 rocketmq-client，订阅中心化的服务 topic，由定时任务（主要是意图分析）触发向队列 topic 生产消息内容，然后由 rocketmq-client 消费，进行主动询问。

### VoiceAgent 知识库实时数据流

![](https://img.alicdn.com/imgextra/i4/O1CN01rbY9Eh1WLcuDVrR49_!!6000000002772-0-tps-2524-1396.jpg)

对于问答的另外一端，知识库的自动更新，则是通过 Catch Data Capture 策略，比如由外部系统数据源触发，或者通过将文档上传 OSS 触发。数据经过切片，向量化之后存储到向量数据库以及全文检索数据库。

## 面向 AI 原生应用的事件驱动架构

![](https://img.alicdn.com/imgextra/i1/O1CN01614xiw21xs45iDSLo_!!6000000007052-0-tps-2640-1140.jpg)

最后分享一下作为 AI 应用开发者的一套组合方案：通过 **阿里云云应用平台 CAP（Cloud Application Platform）** 选出基础模型服务，如 Ollama，ComfyUI，Cosyvoice，Embedding 等进行快速托管，使用 RcoketMQ，Kafka，MNS， Eventbridge 等搭建数据流管道和消息中心，本地利用 Spring AI Alibaba 等框架开发后端服务，实现 RAG，Agent 等能力。前端使用 Nextjs 框架构建界面，之后将开发好的前后端通过 Serverless Devs 工具部署到 CAP 平台，进行线上调用访问，最终上生产采用云原生网关保驾护航，对于长期的知识库或者智能体的运维则通过 ARMS 进行指标监控。
