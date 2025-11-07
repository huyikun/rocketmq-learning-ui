---
title: "官宣上线！RocketMQ for AI：企业级 AI 应用异步通信首选方案"
description: "官宣上线！RocketMQ for AI：企业级 AI 应用异步通信首选方案"
date: "2025-11-07"
category: "article"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

## <font style="color:rgb(0, 128, 255);">企业级 AI 应用开发面临新挑战</font>
<font style="color:rgba(0, 0, 0, 0.9);">随着人工智能技术的飞速发展，模型迭代日新月异，企业正积极构建 AI 应用以提升用户体验和降低人力成本。然而，与传统微服务应用相比，企业在推进 AI 应用落地的过程中，普遍呈现出三个显著特征：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">任务处理耗时长：</font>**<font style="color:rgba(0, 0, 0, 0.9);">传统微服务应用通常能实现毫秒级响应，而 AI 应用的处理周期跨度极大——从几分钟到数小时不等。这种长耗时与不确定性，要求系统架构必须在任务调度、资源分配和用户体验设计上进行重新考量，避免同步调用带来的长时间阻塞。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">算力资源稀缺性且成本高昂：</font>**<font style="color:rgba(0, 0, 0, 0.9);">A</font><font style="color:rgba(0, 0, 0, 0.9);">I 应用的训练与推理高度依赖</font><font style="color:rgba(0, 0, 0, 0.9);"> GPU 等稀缺且昂贵的算力资源</font><font style="color:rgba(0, 0, 0, 0.9);">。因此，任何因网络或应用异常导致的任务重复处理，都会直接造成算力资源浪费和成本增加。如何保障任务在异常情况下不丢失、不重复，成为控制成本的关键。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">算力利用率与业务流量波动的矛盾：</font>**<font style="color:rgba(0, 0, 0, 0.9);">业务请求天然存在波峰波谷。为应对流量高峰以保障服务稳定，企业需要预留大量算力，导致流量低谷时资源闲置；反之，若为节约成本而缩减资源，又难以应对高峰请求，可能导致系统过载或任务积压。如何在有限算力下实现高效调度，既提高资源利用率，又保障高优任务及时响应和系统稳定性，构成了一个核心矛盾。</font>

![](https://img.alicdn.com/imgextra/i2/O1CN01N37YHk22dYCVFPzB2_!!6000000007143-0-tps-3000-1688.jpg)

<font style="color:rgba(0, 0, 0, 0.9);">这些业务特点在 AI 应用的开发和集成过程中，引出了以下典型的业务场景问题：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">单智能体（Agent）局限性与多智能体（Multi-Agent）协作：</font>**<font style="color:rgba(0, 0, 0, 0.9);">由于单智能体缺乏专业分工、难以整合多领域知识，无法在复杂场景中实现动态协作决策。因此，随着 AI 应用场景变得更加复杂，单 Agent 应用会逐步向多 Agent 应用演进。然而，在 AI 任务处理耗时长的背景下，智能体间的通信（Agent2Agent）必须解决长耗时同步调用带来的阻塞问题以及应用的协作扩展性问题。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">大规模会话状态管理，并保障会话连续性和任务处理可靠性：</font>**<font style="color:rgba(0, 0, 0, 0.9);">在网络或应用节点发生异常时，如何保障用户会话的连续性体验，并确保会话任务不被重复处理以避免算力资源浪费，成为一大挑战。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">在有限算力下实现高效调度，并保障高优任务的及时响应：</font>**<font style="color:rgba(0, 0, 0, 0.9);">如何在有限算力资源下实现高效任务调度，从而既能提高算力资源利用率，保障高优任务被及时处理，又能确保算力服务整体稳定性。</font>

<font style="color:rgba(0, 0, 0, 0.9);">在上述场景中，消息队列能够起到至关重要的作用：</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">首先，通过消息队列</font>**<font style="color:rgba(0, 0, 0, 0.9);">将同步调用改为异步通知</font>**<font style="color:rgba(0, 0, 0, 0.9);">，是解决长耗时阻塞的关键。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">其次，消息队列天然的“削峰填谷”能力可以</font>**<font style="color:rgba(0, 0, 0, 0.9);">平滑请求流量</font>**<font style="color:rgba(0, 0, 0, 0.9);">，缓解算力资源的处理压力。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">再结合</font>**<font style="color:rgba(0, 0, 0, 0.9);">定速消费和消息优先级</font>****<font style="color:rgba(0, 0, 0, 0.9);">等</font>**<font style="color:rgba(0, 0, 0, 0.9);">高级特性，便能更有效地调度有限的算力资源。</font>

<font style="color:rgba(0, 0, 0, 0.9);">为能够有效解决上述问题，RocketMQ 推出了针对性的解决方案。</font>

## <font style="color:rgb(0, 128, 255);">RocketMQ for AI 重磅发布</font>
![](https://img.alicdn.com/imgextra/i3/O1CN01Wwk0uf1bsDFpDsjSV_!!6000000003520-0-tps-3000-1688.jpg)

<font style="color:rgba(0, 0, 0, 0.9);">RocketMQ 专门为 AI 场景推出了</font>**<font style="color:rgba(0, 0, 0, 0.9);">全新 LiteTopic 模型</font>**<font style="color:rgba(0, 0, 0, 0.9);">，相较于 RocketMQ 其他类型的  Topic，LiteTopic 具备以下核心特点：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">轻量资源：</font>**<font style="color:rgba(0, 0, 0, 0.9);">LiteTopic 是轻量资源，支持在父 Topic 下创建百万数量级的 LiteTopic，满足大规模任务需求。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">自动化生命周期管理：</font>**<font style="color:rgba(0, 0, 0, 0.9);">LiteTopic 可在收发请求时自动创建，并可设置过期时间，到期后自动删除，简化了业务开发和资源管理。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">高性能订阅：</font>**<font style="color:rgba(0, 0, 0, 0.9);">在消费订阅方面，每个消费者可以动态订阅或取消订阅多达万级的 LiteTopic 集合。如图中所示，消费者 1 订阅列表是 LiteTopic 1 和 LiteTopic 2，消费者 2 订阅列表是 LiteTopic 3 和 LiteTopic 4。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">排他消费：</font>**<font style="color:rgba(0, 0, 0, 0.9);">确保一个 LiteTopic 在同一时间只被一个消费者订阅，这在会话保持等场景中至关重要。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">顺序性保障：</font>**<font style="color:rgba(0, 0, 0, 0.9);">每个 LiteTopic 内部的消息严格保证顺序存储。</font>

<font style="color:rgba(0, 0, 0, 0.9);">目前，这些能力</font>**<font style="color:rgb(0, 128, 255);">已在阿里云云消息队列 RocketMQ 版 5.x 系列实例上正式发布</font>**<font style="color:rgba(0, 0, 0, 0.9);">，并会逐步贡献到 Apache RocketMQ 开源社区，欢迎大家使用。</font>

## <font style="color:rgb(0, 128, 255);">场景应用一：Multi-Agent 异步通信</font>_<font style="color:rgb(242, 98, 46);"></font>_
![](https://img.alicdn.com/imgextra/i1/O1CN01K6vPHh1wbp0jloewy_!!6000000006327-0-tps-3000-1688.jpg)

<font style="color:rgba(0, 0, 0, 0.9);">延续前文对多智能体（Multi-Agent）通信场景的讨论，我们在此详细阐述 RocketMQ 如何解决多智能体应用开发中的长耗时阻塞问题。</font>

<font style="color:rgba(0, 0, 0, 0.9);">图中展示了多智能体（Multi-Agent）应用中一个 Supervisor Agent（主智能体）和两个 Sub Agent（子智能体）之间的异步通信流程：</font>

**<font style="color:rgba(0, 0, 0, 0.9);">1. 接收请求阶段：</font>**<font style="color:rgba(0, 0, 0, 0.9);">为每个 Sub Agent 创建一个 Topic 作为请求任务的缓冲队列，可以是优先级 Topic，从而保障高优任务能够被优先处理。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">2. 返回结果阶段：</font>**

<font style="color:rgba(0, 0, 0, 0.9);">a. 为 Supervisor Agent 创建一个用于接收响应结果的 Topic，并让其订阅这个 Response Topic。该 Topic 可采用 RocketMQ 专为 AI 场景新发布的 Lite Topic 类型；</font>

<font style="color:rgba(0, 0, 0, 0.9);">b. 当 Sub-Agent 完成任务后，它会将结果发送至该 Response Topic，可以为每个独立任务动态创建一个专属的子 LiteTopic（例如，以任务 ID 或问题 ID 命名）；</font>

<font style="color:rgba(0, 0, 0, 0.9);">c. Supervisor Agent 通过 MQ 的异步通知机制实时获取这些子 LiteTopic 中的结果，并可通过 HTTP SSE（</font><font style="color:rgba(0, 0, 0, 0.9);">Server-Sent Events）等</font><font style="color:rgba(0, 0, 0, 0.9);">协议推送给 Web 端。</font>

<font style="color:rgba(0, 0, 0, 0.9);">这一架构充分利用了 Lite Topic 的以下核心能力，解决了长耗时调用的难题：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">轻量资源：</font>**<font style="color:rgba(0, 0, 0, 0.9);">支持创建百万量级的子 LiteTopic，可以满足海量请求任务的通信需求。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">自动化生命周期管理：</font>**<font style="color:rgba(0, 0, 0, 0.9);">子 LiteTopic 支持自动创建和删除，可以简化业务代码，降低资源管理投入。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">顺序性保障：</font>**<font style="color:rgba(0, 0, 0, 0.9);">每个子 LiteTopic 的消息均按顺序存储和消费，可以保证流式响应结果的顺序性。</font>

## <font style="color:rgb(0, 128, 255);">场景应用二：分布式会话状态管理</font>
![](https://img.alicdn.com/imgextra/i1/O1CN01ofije11ERtKUtocDh_!!6000000000349-0-tps-3000-1688.jpg)

<font style="color:rgba(0, 0, 0, 0.9);">LiteTopic 的能力还可以有效解决会话场景中的挑战，例如保障长耗时会话的状态连续性、避免任务重试带来的成本增加等。</font>

<font style="color:rgba(0, 0, 0, 0.9);">实现原理如图所示：在一个多节点高可用集群的应用服务中，不同用户的会话被分发到不同节点上。与前述的返回响应结果场景类似，系统为每个会话分配一个专属 LiteTopic 来传递消息（如会话结果）。每个应用服务节点仅订阅其关联会话所对应的 LiteTopic 集合，并将接收到的消息按顺序推送至 Web 端。</font>

<font style="color:rgba(0, 0, 0, 0.9);">在此基础上，系统通过分布式架构和 RocketMQ 的一系列核心特性，实现</font>**<font style="color:rgba(0, 0, 0, 0.9);">高可用性保障</font>**<font style="color:rgba(0, 0, 0, 0.9);">：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">故障切换：</font>**<font style="color:rgba(0, 0, 0, 0.9);">当网络异常等原因导致 Web 端 2 重连到集群中的另一个节点 2 时，节点 2 会立即订阅此会话对应的 LiteTopic 2。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">消费转移：</font>**<font style="color:rgba(0, 0, 0, 0.9);">由于</font>**<font style="color:rgba(0, 0, 0, 0.9);">排他消费</font>**<font style="color:rgba(0, 0, 0, 0.9);">特性，LiteTopic 2 的消息将不再推送给节点 1，转为推送给节点 2。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">无缝续传：</font>**<font style="color:rgba(0, 0, 0, 0.9);">得益于</font>**<font style="color:rgba(0, 0, 0, 0.9);">消息持久化</font>**<font style="color:rgba(0, 0, 0, 0.9);">和</font>**<font style="color:rgba(0, 0, 0, 0.9);">消费位点持久化</font>**<font style="color:rgba(0, 0, 0, 0.9);">两大特性，节点 2 能够从上一次中断的位置无缝衔接，推送的数据流会接着之前的消费进度推送给节点 2。</font>

<font style="color:rgba(0, 0, 0, 0.9);">最终，用户在 Web 端感受到的是会话没有中断，从而获得连续的会话体验。同时系统也避免了因连接切换而触发不必要的任务重试，有效节约了宝贵的算力资源和成本。</font>

## <font style="color:rgb(0, 128, 255);">场景应用三：算力资源高效调度</font>
![](https://img.alicdn.com/imgextra/i2/O1CN01vqK86S1p57Q6dafKM_!!6000000005308-0-tps-3000-1688.jpg)

<font style="color:rgba(0, 0, 0, 0.9);">在算力资源成本高昂且供给有限的背景下，如何实现资源的高效调度，是一个典型的应用场景。消息队列在此扮演了关键角色：</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">首先，利用其天然的</font>**<font style="color:rgba(0, 0, 0, 0.9);">异步解耦</font>**<font style="color:rgba(0, 0, 0, 0.9);">和</font>**<font style="color:rgba(0, 0, 0, 0.9);">“</font>****<font style="color:rgba(0, 0, 0, 0.9);">削峰填谷</font>****<font style="color:rgba(0, 0, 0, 0.9);">”</font>**<font style="color:rgba(0, 0, 0, 0.9);">能力，可以平滑波动的请求流量，平稳地调用模型服务或算力服务。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">其次，通过</font>**<font style="color:rgba(0, 0, 0, 0.9);">消费者限流（定速消费）</font>**<font style="color:rgba(0, 0, 0, 0.9);">能力，可以有效保护核心算力资源的稳定性，防止其因瞬时流量冲击而过载。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">最后，</font>**<font style="color:rgba(0, 0, 0, 0.9);">消息优先级</font>**<font style="color:rgba(0, 0, 0, 0.9);">能力能够确保有限的算力资源被优先分配给高优任务（如高价值或高紧急度的任务）使用。</font>

<font style="color:rgba(0, 0, 0, 0.9);">值得一提的是，RocketMQ 的优先级能力具备一个独特优势：</font>**<font style="color:rgba(0, 0, 0, 0.9);">消息的优先级支持在投递后动态修改</font>****<font style="color:rgba(0, 0, 0, 0.9);">。</font>**

<font style="color:rgba(0, 0, 0, 0.9);">例如，一个普通用户的任务正在队列中排队，此时该用户付费充值将账号升级为 VIP 账号。系统便可以动态提高其已在排队中的任务消息的优先级，让任务立刻被优先执行。</font>

## <font style="color:rgb(0, 128, 255);">LiteTopic 模型技术解析</font>
![](https://img.alicdn.com/imgextra/i3/O1CN01cfgM0Z1EiNaWiFzXb_!!6000000000385-0-tps-3000-1688.jpg)

<font style="color:rgba(0, 0, 0, 0.9);">为支持百万量级的 LiteTopic，同时保障高并发与低延迟的消息发送和消费流程，其技术实现的核心要点如下：</font>

**<font style="color:rgba(0, 0, 0, 0.9);">1. 发送流程：</font>**

<font style="color:rgba(0, 0, 0, 0.9);">为实现快速、自动创建与删除 LiteTopic，基于 RocketMQ 新版本 RocksDB 的 KV Store 存储能力，实现对海量元数据信息的高效管理。</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">统一存储、多路分发：</font>**<font style="color:rgba(0, 0, 0, 0.9);">RocketMQ</font><font style="color:rgba(0, 0, 0, 0.9);">服务端接收到消息后，将所有消息数据统一存储在底层的 CommitLog 文件中且仅存储一份，这种单一文件的追加模式（Append）避免了磁盘碎片化，保障了极致的写入性能。但通过多路分发机制，可以为不同的 LiteTopic 生成独立的消费索引（ConsumerQueue，简称 CQ）。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">索引存储引擎升级：</font>**<font style="color:rgba(0, 0, 0, 0.9);">摒弃了传统的文件型 CQ 结构，而是替换为高性能的 KV 存储引擎 RocksDB。通过将队列索引信息和消息物理偏移量（Physical Offset）作为键值对存储，充分发挥 RocksDB 在顺序写入方面的高性能优势，从而实现对百万级队列的高效管理。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">2. 消费流程：</font>**

<font style="color:rgba(0, 0, 0, 0.9);">消费流程的核心挑战是：当每个 LiteTopic 内仅有少量消息时，若逐一推送，将导致并发处理能力和系统性能大幅下降。</font>

<font style="color:rgba(0, 0, 0, 0.9);">为解决此问题，RocketMQ 在 Lite-Topic 存储模型的基础上，</font>**<font style="color:rgba(0, 0, 0, 0.9);">进一步对消息分发与投递机制进行优化，针对单个消费者订阅上万个 Lite-Topic 的场景，重新设计了一套创新的事件驱动拉取（Event-Driven Pull）机制：</font>**

<font style="color:rgba(0, 0, 0, 0.9);">每当有新消息到达时，系统会立即触发订阅关系匹配，并将所有符合订阅条件的消息聚合到一个“就绪集合”（Ready Set）中。消费者可以直接从这个 Ready Set 中合并批量拉取来自多个 LiteTopic 的消息。通过这种方式，有效提高了消费并发度，降低了网络开销，从而显著提升了整体性能。</font>

## <font style="color:rgb(0, 128, 255);">为企业级 AI 应用提供全方面的异步通信保障</font>
![](https://img.alicdn.com/imgextra/i3/O1CN01FOfwZg1suMa8lDyAl_!!6000000005826-0-tps-3000-1688.jpg)

<font style="color:rgba(0, 0, 0, 0.9);">随着 AI 技术的快速发展和应用落地，RocketMQ 已完成向“AI MQ”方向的战略升级，不仅支持传统的微服务应用，也致力于为企业级 AI 应用的开发和集成提供一站式异步通信解决方案，涵盖会话管理、Agent 通信、知识库构建以及模型算力调度等典型场景。同时，阿里云云消息队列 RocketMQ 版产品通过在成本与稳定性方面的持续优化，进一步帮助用户降本增效。</font>

<font style="color:rgba(0, 0, 0, 0.9);">目前，RocketMQ for AI 相关能力已在阿里巴巴集团内部以及阿里云大模型服务平台百炼、通义灵码等产品中经过大规模生产环境的验证，且取得显著成效，充分证明了其在高并发、复杂的 AI 场景下的成熟度与可靠性。</font>

<font style="color:rgba(0, 0, 0, 0.9);">展望未来，RocketMQ 将持续在 AI 领域进行技术迭代与创新，赋能更多应用场景，并积极与 AgentScope、Spring AI alibaba、Dify 等主流 AI 生态系统/服务合作集成，共建高效、智能的 AI 应用基础设施，以及逐步将经过阿里集团 AI 业务验证过的方案与特性，持续反馈到开源社区。</font>

<font style="color:rgba(0, 0, 0, 0.9);">诚邀您</font>**<font style="color:rgba(0, 0, 0, 0.9);">扫码参与问卷调研</font>****<font style="color:rgba(0, 0, 0, 0.9);">，</font>**<font style="color:rgba(0, 0, 0, 0.9);">反馈真实使用场景和痛点，帮助我们打造更符合 AI 时代需求的消息引擎。</font><font style="color:rgba(0, 0, 0, 0.9);">也欢迎</font>**<font style="color:rgba(0, 0, 0, 0.9);">钉钉扫码加入交流群</font>**<font style="color:rgba(0, 0, 0, 0.9);">（群号：110085036316），与我们交流探讨～</font>

![](https://img.alicdn.com/imgextra/i3/O1CN01JM3Yz71IapWRswVum_!!6000000000910-0-tps-3000-1688.jpg)

<font style="color:rgba(0, 0, 0, 0.9);">目前，</font><font style="color:rgba(0, 0, 0, 0.9);">轻量主题（LiteTopic）</font><sup>**<font style="color:rgb(255, 104, 39);">[</font>**</sup><sup>**<font style="color:rgb(255, 104, 39);">1]</font>**</sup><font style="color:rgba(0, 0, 0, 0.9);">功能已在阿里云</font><font style="color:rgba(0, 0, 0, 0.9);">云消息队列 RocketMQ 版</font><sup>**<font style="color:rgb(255, 104, 39);">[</font>**</sup><sup>**<font style="color:rgb(255, 104, 39);">2]</font>**</sup><font style="color:rgba(0, 0, 0, 0.9);">非 Serverless 系列（包年包月、按量付费）和 Serverless 系列的独享实例支持，可提交工单申请白名单（提单时需要提供购买实例的主账号 uid 和实例所属地域）。</font>

<font style="color:rgba(0, 0, 0, 0.9);">同时，阿里云官网已上线 RocketMQ for AI 的解决方案，欢迎</font>[立即部署体验](https://www.aliyun.com/solution/tech-solution/rocketmq-for-multi-agent-communication)<font style="color:rgba(0, 0, 0, 0.9);">！</font>

**<font style="color:rgba(0, 0, 0, 0.9);">相关链接：</font>**

<font style="color:rgba(0, 0, 0, 0.9);">[1] </font><font style="color:rgba(0, 0, 0, 0.9);">轻量主题（LiteTopic）</font>

_<u><font style="color:rgb(0, 122, 170);">https://help.aliyun.com/zh/apsaramq-for-rocketmq/cloud-message-queue-rocketmq-5-x-series/developer-reference/litetopic</font></u>_<font style="color:rgba(0, 0, 0, 0.9);">  
</font>

<font style="color:rgba(0, 0, 0, 0.9);">[2]</font><font style="color:rgba(0, 0, 0, 0.9);"> </font><font style="color:rgba(0, 0, 0, 0.9);">云消息队列 RocketMQ 版</font>

_<u><font style="color:rgb(0, 122, 170);">https://www.aliyun.com/product/rocketmq</font></u>_


