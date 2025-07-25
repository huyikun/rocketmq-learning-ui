---
title: "Apache RocketMQ for AI 战略升级，开启 AI MQ 新时代"
description: "Apache RocketMQ for AI 战略升级，开启 AI MQ 新时代"
date: "2025-07-25"
category: "article"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

<font style="color:rgb(145, 145, 145);">作者 | 阿里云消息团队文婷、不铭、墨岭、稚柳</font>

### <font style="color:#2F8EF4;">前言</font>
<font style="color:rgb(74, 74, 74);">随着 AIGC（生成式人工智能）浪潮席卷全球，大语言模型（LLM）正在深刻重塑千行百业、重构应用开发范式。这场由模型与算法驱动的技术革命，带来了前所未有的机遇，也为开发者构建 AI 应用带来了全新而严峻的工程挑战：如何保障长耗时对话的连续性？如何公平高效地调度有限的算力资源？如何避免多 AI Agent 或复杂工作流的级联阻塞问题？......  
</font><font style="color:rgb(74, 74, 74);">这些挑战的核心诉求在于：我们需要一种可靠且高效的异步通信机制，来支撑应用、数据与模型之间的协同交互。作为分布式系统不可或缺的基础组件，Apache RocketMQ 在微服务异步解耦与数据流处理等方面表现出色。在 AI 时代，如何应对复杂多变的业务场景、满足更高的性能与体验要求，已成为 Apache RocketMQ 演进过程中的关键课题。</font>

### <font style="color:rgb(0, 179, 139);"> </font><font style="color:#2F8EF4;">挑战显现：传统消息队列在 AI 场景中的局限性</font>
<font style="color:rgb(74, 74, 74);">在传统分布式架构中，消息队列作为实现异步解耦、流量削峰及数据流处理的成熟方案，其可靠性已得到广泛验证。然而，随着 AI 应用在交互模式、资源形态和应用架构上的根本性变革，如果客户采用同步阻塞架构、或者基于传统消息队列的异步化架构，都会面临很多新挑战。</font>

+ <font style="color:rgb(74, 74, 74);">交互模式：从“请求 - 响应”到“长时会话”</font>

<font style="color:rgb(74, 74, 74);">传统应用的交互模式一般是无状态，短平快的请求 - 响应模式，一个用户请求会在毫秒级返回结果，如收藏商品、加购物车、下单等场景。</font>

<font style="color:rgb(74, 74, 74);">而 AI 应用交互（如多轮对话，多模态）具有持续时间长（单次推理可达数秒至分钟级）、多轮次上下文依赖（对话历史可达数十轮）、计算资源消耗大等特征。现有的 AI 应用若采用 HTTP 长连接、 WebSocket 等协议结合后端同步阻塞架构，极易因为网络抖动、网关重启或连接超时等偶发问题，导致上下文丢失、推理任务中断，造成不可逆的算力浪费和用户体验的损害。</font>

+ <font style="color:rgb(74, 74, 74);">资源形态：从“通用服务器”到“稀缺算力”</font>

<font style="color:rgb(74, 74, 74);">AI 推理依赖昂贵的 GPU 资源，瞬时高并发流量可能冲击推理服务稳定性，导致算力资源浪费。传统消息队列虽能实现流量削峰填谷，但在多租户共享资源池场景下，由于缺乏精细的消费流量控制机制，难以实现精细化、差异化的资源调度，导致资源利用率低下。</font>

+ <font style="color:rgb(74, 74, 74);">应用架构：从“服务调用”到“智能体协作”</font>

<font style="color:rgb(74, 74, 74);">AI Agent 或多步工作流本质上是长周期任务的协同。若采用同步调用机制，任何单节点阻塞都可能引发整个任务链级联失败。因此，需要一个高效、可靠的异步通信枢纽，来连接这些独立且长时间运行的智能体或任务节点，实现非阻塞协同，保障分布式智能系统稳定运行。</font>

<font style="color:rgb(74, 74, 74);">此外，传统消息队列还面临其他挑战，如：在处理 AI 多模态等大负载时，因传统消息队列对消息大小有更严格的限制，需要采取繁琐的变通方案，从而增加了系统复杂度和故障风险；传统消息队列通常需要手动配置或复杂脚本进行 Topic 管理，会带来运维成本攀升与资源泄漏隐患等。</font>

### <font style="color:#2F8EF4;"> 破局之道：Apache RocketMQ 进化为 AI 消息引擎</font>
<font style="color:rgb(74, 74, 74);">系化重构：采用存算分离架构实现资源弹性、通过存储层多副本机制保障高可用性、引入轻量级 SDK 提升客户端灵活性等等，最终达成了"高弹性、高可用、低成本"的核心目标，也为解决 AI 时代的工程难题打下了坚实的基础。</font>

<font style="color:rgb(74, 74, 74);">面对 AI 时代带来的全新挑战，Apache RocketMQ 进行了前瞻性战略升级，从传统消息中间件进化为专为 AI 时代打造的消息引擎，成为构建下一代 AI 应用不可或缺的关键基础设施。</font>



<font style="color:rgb(74, 74, 74);">这一演进的核心在于两大“颠覆性创新”：</font>

+ <font style="color:rgb(74, 74, 74);">轻量化通信模型：支持动态创建百万级 Lite-Topic，特别适用于长时会话、AI 工作流和 Agent-to-Agent 交互等场景。显著提升系统的扩展性与灵活性，满足 AI 应用复杂的通信需求。</font>
+ <font style="color:rgb(74, 74, 74);">智能化资源调度：通过削峰填谷、定速消费、自适应负载均衡和优先级队列等功能，实现对稀缺算力资源的精细化管理和平稳高效调度，确保在高并发和多租户环境下高效利用资源。</font>



<font style="color:rgb(74, 74, 74);">这些创新使 Apache RocketMQ 成功突破了传统消息队列的局限，精准匹配 AI 应用的独特需求，为现代 AI 系统提供稳定且高效的消息中枢服务。</font>

### <font style="color:#2F8EF4;">场景实践：RocketMQ for AI 如何破解 AI 工程挑战</font>
#### <font style="color:#2F8EF4;">“会话即主题”：用 Lite-Topic 终结长会话状态管理难题</font>
<font style="color:rgb(74, 74, 74);">AI 应用的交互模式具有特殊性，即长耗时、多轮次且高度依赖高成本计算的会话。当应用依赖 SSE 或WebSocket 等长连接时，一旦连接中断（如网关重启、链接超时、网络不稳定触发），不仅会导致当前会话上下文的丢失，更会直接造成已投入的 AI 任务作废，从而浪费宝贵的算力资源。因此，构建一个健壮的会话管理机制，实现在长耗时的对话过程中保障会话上下文的连续性和完整性，减少重试带来的算力资源浪费，同时降低应用程序代码的复杂度，是该场景的核心技术攻坚点。 </font>

<font style="color:rgb(74, 74, 74);">为解决长会话状态管理难题，RocketMQ for AI 提出了一种革命性的轻量化解决方案——“会话即主题”，系统可为每个独立会话（Session）或问题（Question）动态创建一个专属的轻量级主题（Lite-Topic）。</font>

<font style="color:rgb(74, 74, 74);">当客户端与 AI 服务建立会话时，系统将动态创建一个以 SessionID 命名的专属队列（例如 chatbot/{sessionID}或 chatbot/{questionID}）。该会话的所有交互历史和中间结果均以消息形式在该主题中有序传递 。即使客户端断连，重连后只需继续订阅原主题 Lite-Topic chatbot/{sessionID}，即可无缝恢复上下文，实现断点续传，继续推送响应结果。</font>

<font style="color:rgb(74, 74, 74);">该模型有效解决了“无状态后端”与“有状态体验”之间的矛盾，将开发者从繁琐的会话状态保持、重连处理与数据一致性校验中彻底解放出来。不仅大幅简化了工程实现，也从根本上避免了因任务中断重试造成的算力资源浪费，为用户带来流畅、连续、稳定的 AI 交互体验。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01UVTmnx1z6cr6MiVzg_!!6000000006665-2-tps-3000-1688.png)

<font style="color:rgb(136, 136, 136);">图 1</font>

<font style="color:rgb(74, 74, 74);">这一创新模式的实现，得益于 RocketMQ 专为 AI 场景设计的强大特性：</font>

+ **<font style="color:rgb(74, 74, 74);">百万级队列支持</font>**<font style="color:rgb(74, 74, 74);">：RocketMQ 支持在单个集群中高效管理百万级 Lite-Topic，能够为海量并发会话或任务提供独立 Topic，并且保障性能无损。</font>
+ **<font style="color:rgb(74, 74, 74);">轻量化资源管理</font>**<font style="color:rgb(74, 74, 74);">：RocketMQ 队列的创建和销毁极其轻量和自动化，系统可按需自动创建与回收 Lite-Topic（如客户端连接断开或 TTL 到期时），避免资源泄漏和手动干预，显著降低运维复杂度和成本。</font>
+ **<font style="color:rgb(74, 74, 74);">大消息体传输</font>**<font style="color:rgb(74, 74, 74);">：RocketMQ 可处理数十 MB 甚至更大的消息体，充分满足 AIGC 场景中常见的庞大数据负载的传输需求，如大量上下文的 Prompt、高清图像或长篇文档等。</font>
+ **<font style="color:rgb(74, 74, 74);">顺序消息保障</font>**<font style="color:rgb(74, 74, 74);">：在单个会话队列中，通常采用 LLM 的流式输出模式以降低问答延迟，RocketMQ 原生支持顺序消息，确保推理结果流式输出到客户端的顺序性，保障会话体验连贯流畅。</font>
+ **<font style="color:rgb(74, 74, 74);">全面可观测性</font>**<font style="color:rgb(74, 74, 74);">：RocketMQ 全面支持 OpenTelemetry 标准的 Metrics 和 Tracing，可实时监控消息收发量、消息堆积等关键指标，查询消息收发轨迹详情，为多 Agent 系统的调试与优化提供有力支撑。</font>

##### <font style="color:#2F8EF4;">应用案例：阿里巴巴安全团队“安全小蜜”智能助手</font>
<font style="color:rgb(74, 74, 74);">阿里巴巴安全团队推出的“安全小蜜”智能助手，在应对大规模并发会话时，曾面临会话上下文丢失、任务中断导致资源浪费等挑战。</font>

<font style="color:rgb(74, 74, 74);">通过引入 RocketMQ 的 Lite-Topic 能力重构会话保持机制，“安全小蜜”成功实现了会话状态的自动持久化与快速恢复。这不仅能够在多轮对话中，对用户的安全问题进行快速、精准的理解和响应，还大幅简化了工程实现复杂度，有效降低了因任务中断引发的资源浪费，整体提升了用户体验与业务处理效率。</font>

<font style="color:rgb(74, 74, 74);">目前，阿里云多个产品线的 AI 答疑机器人也已采用该方案完成升级，进一步验证了该架构在多样化 AI 场景下的通用性与有效性。</font>

#### <font style="color:#2F8EF4;">智能算力编排：不止于负载均衡，构建可控算力调度中枢</font>
<font style="color:rgb(74, 74, 74);">大模型服务在资源调度上，普遍面临两大核心挑战：</font>

+ **<font style="color:rgb(74, 74, 74);">负载不匹配</font>**<font style="color:rgb(74, 74, 74);">：前端请求突发性强，而后端算力资源有限且相对稳定，直接对接易导致服务过载崩溃或算力资源浪费。</font>
+ **<font style="color:rgb(74, 74, 74);">无差别分配</font>**<font style="color:rgb(74, 74, 74);">：在实现流量平稳后，如何确保高优先级任务优先获得宝贵的计算资源，成为提升整体服务价值的关键。</font>

<font style="color:rgb(74, 74, 74);">在此背景下，Apache RocketMQ 发挥了关键作用：不仅作为前端请求与后端算力服务之间的缓冲调度层，将不规则的流量“整形”为平稳、可控的请求流，还通过定速消费、优先级队列等能力，提供“可控的算力调度中枢” ，实现对请求流量的细粒度控制，大幅提升资源利用效率与服务质量。</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01Kb4wlI1op5X0MnaBG_!!6000000005273-2-tps-3000-1688.png)

<font style="color:rgb(136, 136, 136);">图 2</font>

<font style="color:rgb(74, 74, 74);">RocketMQ 所具备的一系列核心特性，为实现智能算力调度提供了坚实的基础：</font>

+ **<font style="color:rgb(74, 74, 74);">天然削峰填谷，保护核心 AI 算力</font>**<font style="color:rgb(74, 74, 74);">：RocketMQ 天然具备“流量水库”的作用，能缓存突发请求，使后端 AI 模型服务根据自身处理能力，基于类似滑动窗口模式自适应消费负载均衡，避免系统过载或资源浪费。</font>
+ **<font style="color:rgb(74, 74, 74);">定速消费，最大化 AI 算力利用率</font>**<font style="color:rgb(74, 74, 74);">：RocketMQ 支持定速消费能力，可为消费者组 ConsumerGroup 设置消费 quota。开发者可灵活定义 AI 算力的每秒调用量，在保障核心 AI 算力不过载的前提下，最大限度提升吞吐量。</font>
+ **<font style="color:rgb(74, 74, 74);">优先级队列，智能调度与分配算力资源</font>**<font style="color:rgb(74, 74, 74);">：再进一步，RocketMQ 的消息优先级机制还为复杂的业务场景提供了灵活优雅的资源调度方案：</font>
    - **<font style="color:rgb(74, 74, 74);">抢占式分配</font>**<font style="color:rgb(74, 74, 74);">：当高价值任务（如 VIP 用户请求、关键系统分析）进入系统时，可将其标记为高优先级消息。RocketMQ 确保这些消息被优先消费，让宝贵的算力资源优先服务于最关键的任务。</font>
    - **<font style="color:rgb(74, 74, 74);">按权重分配</font>**<font style="color:rgb(74, 74, 74);">：在共享算力池场景下，可依据各业务请求的实时执行状态设置请求消息优先级，调整请求执行的先后顺序，既保障整体吞吐效率，又防止个别租户因资源饥饿而无法获得算力。</font>

##### <font style="color:#2F8EF4;">应用案例：阿里云大模型服务平台百炼、通义灵码</font>
<font style="color:rgb(74, 74, 74);">阿里云大模型服务平台百炼的网关系统通过引入 RocketMQ 实现了对请求流量的削峰填谷，有效将前端不规则的访问压力转化为平稳、可控的后端算力调度。同时，借助 RocketMQ 的消息优先级功能，根据用户的请求流量设置合理的优先级，避免了大流量用户请求导致小流量用户分配不到算力资源，显著提升了资源利用率和服务公平性。</font>

<font style="color:rgb(74, 74, 74);">通义灵码通过 RocketMQ 将其 codebase RAG 架构从原有的同步流程升级为异步流程，实现代码向量化与流量削峰填谷，保障了系统全链路的稳定性。</font>

#### <font style="color:#2F8EF4;">异步通信枢纽：Lite-Topic 让 A2A 与 AI 工作流彻底告别同步阻塞</font>
<font style="color:rgb(74, 74, 74);">Google 提出的 A2A 协议推荐采用异步通信机制来解决 AI 任务长耗时带来的同步阻塞问题。其核心机制是将一次请求 - 响应（Request-Reply）调用，解耦为一个初始请求和一个异步通知（pushNotificationConfig）。在各类 Agentic AI 平台的工作流中，每个节点执行完任务后都需要向下游节点通知执行结果，而异步通信正是支撑这种复杂协作的关键。</font>

<font style="color:rgb(74, 74, 74);">由于 AI 任务普遍运行时间长，工作流场景同样需要解决“同步调用导致级联阻塞”的问题。无论是 Agent 之间的外部通信，还是工作流内部的任务流转，都面临一个共同挑战：如何优雅地处理长耗时任务，避免系统阻塞？核心解决方案是采用统一的架构模式——</font>**<font style="color:rgb(74, 74, 74);">将长耗时、有状态的交互，转化为由无状态、事件驱动的可靠异步通知机制来连接</font>**<font style="color:rgb(74, 74, 74);">。</font>

<font style="color:rgb(74, 74, 74);">前文提到，Apache RocketMQ 全新推出的 </font>**<font style="color:rgb(74, 74, 74);">Lite-Topic 机制</font>**<font style="color:rgb(74, 74, 74);">，凭借其轻量化、自动化的动态管理能力，可高效实现 Request-Reply 模式的异步通信。核心流程如下：</font>

+ **<font style="color:rgb(74, 74, 74);">动态创建回复通道</font>**<font style="color:rgb(74, 74, 74);">：当 Agent A 向 Agent B 发起请求时（如 message/send），无需同步等待响应。而是在请求中嵌入唯一的动态回复地址，例如 a2a-topic/{taskID}。同时，Agent A 订阅该地址，RocketMQ 会在首次连接时自动创建这个轻量化的 Sub-Topic，相当于为本次任务开辟了一个专属的异步通信通道。</font>
+ **<font style="color:rgb(74, 74, 74);">异步投递执行结果</font>**<font style="color:rgb(74, 74, 74);">：Agent B 按照自己的节奏处理任务。在任务完成后，它将结果封装为消息，直接发布到请求中指定的回复地址 a2a-topic/{taskID}。</font>
+ **<font style="color:rgb(74, 74, 74);">自动回收通信资源</font>**<font style="color:rgb(74, 74, 74);">：当 Agent A 成功接收并处理完结果后，会断开与该 Lite-Topic 的连接。RocketMQ 的智能资源管理机制会检测到该 Topic 已无消费者，并在设定的 TTL（Time-To-Live）后自动清理该 Topic 资源。整个过程完全自动化，无需人工干预，杜绝了资源泄露的风险。</font>

<font style="color:rgb(74, 74, 74);">RocketMQ 的 Lite-Topic 方案优势在于其系统性的设计：</font>**<font style="color:rgb(74, 74, 74);">百万级 Lite-Topic 的海量并发能力，结合按需创建、用后即焚的零开销资源管理</font>**<font style="color:rgb(74, 74, 74);">，从根本上解决了大规模 Agent 协作场景下的扩展性与易用性问题。同时，顺序消息保障机制确保了流式或多步任务的逻辑正确，而内置的</font>**<font style="color:rgb(74, 74, 74);">持久化与高可用机制</font>**<font style="color:rgb(74, 74, 74);">则保障了异步通信的最终一致性与可靠性。这些能力共同为 A2A 场景构建了一个真正健壮、高效且可扩展的异步通信基础设施。</font>

##### <font style="color:#2F8EF4;">应用案例：阿里 AI 实验室</font>
<font style="color:rgb(74, 74, 74);">阿里 AI 实验室在其多 AI Agent 工作流中，基于 RocketMQ 构建了一套高效、可靠的 Agent 编排体系。工作流中的每个节点均采用事件驱动架构，实现可靠、持久化的通信。借助 Lite-Topic 机制，还能实现 Agent 之间的节点级通信，从而实现任务流程的精细化编排。</font>

<font style="color:rgb(74, 74, 74);">在多 Agent 协同执行 AI 任务的过程中，即使遇到 Agent 发布重启、调用超时等情况导致完整任务链中断，也能通过持久化事件流的可靠重试，继续推进中断的 AI 任务，既有效避免了资源浪费，又显著提升了用户体验。</font>

### <font style="color:#2F8EF4;"> 架构解析：RocketMQ for AI 的关键技术升级</font>
<font style="color:rgb(74, 74, 74);">为实现前文所述的创新模型，Apache RocketMQ 需具备在单个集群中高效管理百万级 Lite-Topic 的能力，但原有架构在支持该能力时面临两大核心挑战：在存储层面，原先基于文件的索引和元数据管理机制已难以支撑如此量级的 Topic；在消息分发投递过程中，当单个消费者订阅大量的 Lite-Topic 时，旧有的长轮询通知机制在延迟和并发性能上也显得捉襟见肘。</font>

<font style="color:rgb(74, 74, 74);">因此，要实现海量 Lite-Topic 的高效管理，必须攻克以下两个关键技术难题：</font>

+ **<font style="color:rgb(74, 74, 74);">百万级 Lite-Topic 的元数据存储与索引结构的技术方案；</font>**
+ **<font style="color:rgb(74, 74, 74);">面向海量 Lite-Topic 订阅场景的高效消息分发与投递机制。</font>**

![](https://img.alicdn.com/imgextra/i2/O1CN01iKud7m22qpf29CE40_!!6000000007172-2-tps-3000-1688.png)

<font style="color:rgb(136, 136, 136);">图 3</font>

<font style="color:rgb(74, 74, 74);">百万级 Lite-Topic 的数量级跃升，意味着索引和元数据无法沿用之前的模型。若为每个主题维护一个或者多个基于物理文件的索引结构，将带来巨大的系统开销和运维负担。</font>

<font style="color:rgb(74, 74, 74);">为此，Apache RocketMQ 基于其 LMQ 存储引擎 和 KV Store 能力，重新设计了元数据管理和索引存储：</font>

+ **<font style="color:rgb(74, 74, 74);">统一存储、多路分发</font>**<font style="color:rgb(74, 74, 74);">：所有消息在底层的 CommitLog 文件中仅存储一份，但通过多路分发机制，可以为不同的 Lite-Topic 生成各自的消费索引（ConsumerQueue，简称 CQ）。</font>
+ **<font style="color:rgb(74, 74, 74);">索引存储引擎升级</font>**<font style="color:rgb(74, 74, 74);">：摒弃了传统的文件型 CQ 结构，替换为高性能的 KV 存储引擎 RocksDB。通过将队列索引信息和消息物理偏移量（Physical Offset）作为键值对存储，充分发挥 RocksDB 在顺序写入方面的高性能优势，从而实现对百万级队列的高效管理。</font>

<font style="color:rgb(74, 74, 74);">在 Lite-Topic 存储模型的基础上，RocketMQ 进一步对消息分发与投递机制进行优化，针对单个消费者订阅上万个 Lite-Topic 的场景，重新设计了一套创新的事件驱动拉取（Event-Driven Pull）机制，如图 3 所示：</font>

+ **<font style="color:rgb(74, 74, 74);">订阅关系（Subscription Set）管理</font>**<font style="color:rgb(74, 74, 74);">：Broker 负责管理消费者订阅关系 Subscription 的 Lite-Topic Set，并支持增量更新，从而能够实时、主动地感知消息与订阅的匹配状态。</font>
+ **<font style="color:rgb(74, 74, 74);">事件驱动与就绪集（Ready Set）维护</font>**<font style="color:rgb(74, 74, 74);">：每当有新消息写入，Broker 会立即根据其维护的 Subscription Set 进行匹配，并将符合条件的消息（或其索引）添加到为消费者维护的 Ready Set 中。</font>
+ **<font style="color:rgb(74, 74, 74);">高效 Poll Ready Set</font>**<font style="color:rgb(74, 74, 74);">：消费者只需对 Ready Set 发起 poll 请求，即可从 Ready Set 中获取所有匹配的消息。这种方式允许 Broker 将来自不同主题、不同流量的消息进行合并与攒批，在一次响应中高效地返回给消费者，显著降低了网络交互频率，从而提升整体性能。</font>

<font style="color:rgb(74, 74, 74);">通过在存储层与分发机制的创新升级，Apache RocketMQ 有效解决了 Lite-Topic 模型的关键挑战：在存储层面，</font>**<font style="color:rgb(74, 74, 74);">采用高性能的 RocksDB 替代传统文件索引</font>**<font style="color:rgb(74, 74, 74);">，实现了对百万级元数据的高效管理；在消息分发层面，通过</font>**<font style="color:rgb(74, 74, 74);">创新的“事件驱动拉取”模型</font>**<font style="color:rgb(74, 74, 74);">，由 Broker 主动维护订阅集与就绪集，将消费者的海量轮询转变为对聚合消息的单次高效拉取，确保了在海量订阅场景下的低延迟与高吞吐。</font>

### <font style="color:#2F8EF4;">展望未来：开启 AI MQ 新时代，RocketMQ for AI 持续演进</font>
<font style="color:rgb(74, 74, 74);">Apache RocketMQ for AI 的演进，标志着其已从传统消息中间件，全面升级为专为 AI 时代打造的消息引擎。通过在</font>**<font style="color:rgb(74, 74, 74);">轻量化通信模型与智能化资源调度</font>**<font style="color:rgb(74, 74, 74);">方面的“颠覆性创新”，Apache RocketMQ 突破了传统消息中间件的能力边界，成为构建高可用、可扩展 AI 应用的关键基础设施，展现出其在 AI 工程化体系中的核心价值。</font>

<font style="color:rgb(74, 74, 74);">Apache RocketMQ for AI 的增强能力已在阿里巴巴集团内部以及阿里云大模型服务平台百炼、通义灵码等产品中经过大规模生产环境的验证，充分证明了其在高并发、复杂的 AI 场景下的成熟度与可靠性。</font>

<font style="color:rgb(74, 74, 74);">当然，这只是一个开始。AI 工程化仍处于快速发展阶段，Apache RocketMQ 作为核心基础设施，仍有广阔的优化与创新空间。未来，阿里云消息团队将持续围绕用户 AI 场景迭代升级，协同 Apache RocketMQ 开源社区的贡献者们打磨核心 AI 能力，并逐步将经过阿里集团 AI 业务验证过的方案与特性，持续反馈到开源社区。</font>

<font style="color:rgb(74, 74, 74);">我们坚信，通过持续的技术探索与开放共建，Apache RocketMQ for AI 将推动“AI 原生消息队列”（AI MQ）成为行业标准，助力全球开发者更轻松、更高效地构建下一代智能应用，共同推动 AI 工程实践的标准化、普及化与生态繁荣。  
</font><font style="color:rgb(74, 74, 74);"> </font>

<font style="color:#2F8EF4;">  
</font><font style="color:#2F8EF4;"> </font>



<font style="color:rgb(74, 74, 74);">  
</font><font style="color:rgb(74, 74, 74);"> </font>


