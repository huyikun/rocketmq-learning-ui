---
title: "AgentScope x RocketMQ：打造企业级高可靠 A2A 智能体通信基座"
description: "AgentScope x RocketMQ：打造企业级高可靠 A2A 智能体通信基座"
date: "2025-12-16"
category: "article"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

## <font style="color:#2F8EF4;">引言</font>
<font style="color:rgba(0, 0, 0, 0.9);">Agentic AI 时代已至，在智能客服、代码生成、流程自动化等场景中，多智能体（Multi-Agent）协作正从构想走向落地。然而，当多个 Agent 需要像一个团队那样高效协作时，脆弱的通信机制可能因网络抖动或服务宕机，就让整个系统瞬间瘫痪，导致昂贵的计算任务失败、会话状态丢失。</font>

<font style="color:rgba(0, 0, 0, 0.9);">如何为这些聪明的“数字员工”们构建一个真正可靠、高效的通信基座？</font>

<font style="color:rgba(0, 0, 0, 0.9);">本文将为您介绍 Apache RocketMQ 全新推出的</font>**<font style="color:rgba(0, 0, 0, 0.9);">轻量级通信模型 LiteTopic</font>**<font style="color:rgba(0, 0, 0, 0.9);">，如何在 AI 应用场景中有效简化系统架构、提升稳定性与可靠性，并结合 </font>**<font style="color:rgba(0, 0, 0, 0.9);">A2A（Agent-to-Agent）协议</font>**<font style="color:rgba(0, 0, 0, 0.9);">与</font>**<font style="color:rgba(0, 0, 0, 0.9);">阿里巴巴 AgentScope 框架</font>**<font style="color:rgba(0, 0, 0, 0.9);">的生产实践案例，深入剖析面向智能体通信的落地实践与技术实现。</font>

## <font style="color:#2F8EF4;">RocketMQ for AI：重新定义 AI 应用通信范式</font>
### <font style="color:rgb(0, 0, 0);">1.1 传统应用：单向、无反馈的事件驱动模式</font>
<font style="color:rgba(0, 0, 0, 0.9);">在传统应用的事件驱动场景中，业务逻辑编排通常由人工预先约定，消息生产方成功发送消息后，便无需关注后续的处理逻辑。</font>

<font style="color:rgba(0, 0, 0, 0.9);">下图以注册系统为例：用户发起账户注册请求后，注册系统向 RocketMQ 发送“新用户注册”的消息后便立即返回，无需关心下游的邮件或短信通知系统如何处理。邮件或短信通知系统再分别从 RocketMQ 拉取消息，驱动各自的发送流程。整条业务链路为</font>**<font style="color:rgba(0, 0, 0, 0.9);">单向、无反馈的事件驱动模式</font>**<font style="color:rgba(0, 0, 0, 0.9);">。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01Lg0idb1i4vxThjEBu_!!6000000004360-2-tps-2788-1466.png)

### <font style="color:rgb(0, 0, 0);">1.2 从单向事件到双向交互：AI 应用对通信提出新挑战</font>
<font style="color:rgba(0, 0, 0, 0.9);">在 AI 应用场景中，业务逻辑编排通常由大模型动态生成，消息生产方需等待并处理响应结果，才能驱动后续的逻辑执行。</font>

<font style="color:rgba(0, 0, 0, 0.9);">下图以典型的 AI 会话场景为例：用户所连接的 Gateway 不仅需要发送请求，还需要处理推理响应结果，并将结果推送给浏览器，形成完整的交互闭环。</font><font style="color:rgba(0, 0, 0, 0.9);">  
</font>

![](https://img.alicdn.com/imgextra/i2/O1CN013ci51p1fFyf4DJ2LG_!!6000000003978-2-tps-2164-574.png)

<font style="color:rgba(0, 0, 0, 0.9);">结合真实 AI 应用场景的深度调研，我们发现 AI 场景具有四个显著特征，对底层通信模式提出了全新且严苛的挑战：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">更长的响应时间：</font>**<font style="color:rgba(0, 0, 0, 0.9);">传统互联网应用追求毫秒级响应延时，而 AI 应用的响应时长普遍达到分钟级以上。更关键的是，AI 应用单次业务的运行时间具有高度不可预测性。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">更复杂的交互：</font>**<font style="color:rgba(0, 0, 0, 0.9);">AI 应用的多轮对话持续时间长，对话历史可达数十轮甚至更多。单次上下文传输可能达到几十甚至上百 MB，上下文管理难度高。多 Agent 之间的协同编排逻辑更加复杂，需要精确的状态同步。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">更昂贵的计算资源：</font>**<font style="color:rgba(0, 0, 0, 0.9);">AI 推理依赖昂贵的 GPU 资源，瞬时高并发流量可能冲击推理服务稳定性，导致算力资源浪费，并且任务失败重试的成本极高。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">更精细化的事件驱动：</font>**<font style="color:rgba(0, 0, 0, 0.9);">由于计算能力有限，异步事件驱动需要更精准的消费速度控制。同时，必须实现分级的事件驱动策略，以确保高优先级任务优先获得宝贵的计算资源。</font>

### <font style="color:rgb(0, 0, 0);">1.3 RocketMQ LiteTopic：专为 AI 场景设计的通信模型</font>
<font style="color:rgba(0, 0, 0, 0.9);">为了应对上述挑战，Apache RocketMQ 推出了以</font><font style="color:rgba(0, 0, 0, 0.9);">轻量级通信模型 LiteTopic</font><font style="color:rgba(0, 0, 0, 0.9);"> 为核心的一系列新特性：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">轻量级通信模型 —— 为海量会话而生</font>**

<font style="color:rgba(0, 0, 0, 0.9);">其核心是</font><font style="color:rgba(0, 0, 0, 0.9);">百万级轻量资源管理能力</font><font style="color:rgba(0, 0, 0, 0.9);">。基于极低的资源动态创建开销，可轻松支持海量会话（Session）场景，并提供</font><font style="color:rgba(0, 0, 0, 0.9);">更细粒度的订阅管理</font><font style="color:rgba(0, 0, 0, 0.9);">，适用于长时 Session、AI 工作流和 Agent-to-Agent 交互等场景。</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">企业级上下文管理 —— 让会话状态可靠持久</font>**

<font style="color:rgba(0, 0, 0, 0.9);">以连续的消息流完整保存 Session 上下文，通过顺序保障、排他消费等机制严格确保上下文的完整性与一致性。同时原生支持大消息体（数十 MB 甚至更大），轻松满足 AI 场景下庞大数据负载的传输需求。</font>

### <font style="color:rgb(0, 0, 0);">1.4 LiteTopic 技术解析：百万队列支撑海量并发会话</font>
<font style="color:rgba(0, 0, 0, 0.9);">LiteTopic 基于 </font>**<font style="color:rgba(0, 0, 0, 0.9);">RocketMQ 业界领先的百万队列</font>**<font style="color:rgba(0, 0, 0, 0.9);">核心技术构建，其底层本质是</font>**<font style="color:rgba(0, 0, 0, 0.9);">独立的 Queue</font>**<font style="color:rgba(0, 0, 0, 0.9);">。</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">它为每个独立会话（Session）创建一个专属的、低成本的“私有通道”——即轻量主题（LiteTopic），从而能够以极低的资源开销支撑海量并发会话的需求。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">轻量级的 LiteTopic 在消息分配与发送行为上与顺序 Topic 一致（其所属 Queue 由单一 Broker 独占，消息始终路由至该 Broker，而非在多个 Broker 间轮询发送），这种设计天然确保了消息的严格顺序性，并极大降低了资源管理和路由的复杂度。</font>

![](https://img.alicdn.com/imgextra/i3/O1CN01L6JXme1EFWe1zNB6X_!!6000000000322-2-tps-1520-1248.png)

#### <font style="color:#2F8EF4;">1.4.1 LiteConsumer 支持单节点粒度的订阅关系管理</font>
<font style="color:rgba(0, 0, 0, 0.9);">与传统消息队列中“同一 Consumer Group ID（CID）必须全局一致订阅相同 Topic”的强约束不同，LiteConsumer 创新性地支持 CID 内各节点按需进行差异化订阅。每个节点可根据实际负载、业务场景或运行时需求，独立订阅不同的 LiteTopic，从而构建更加灵活、弹性的消费拓扑。</font>

<font style="color:rgba(0, 0, 0, 0.9);">这一机制从根本上规避了因订阅关系不一致所引发的消费异常、重复消费或 Rebalance 风暴等问题，显著提升了系统的灵活性、可扩展性与稳定性。同时，它更契合 AI 时代轻量、动态、点对点的交互模式，为构建轻量级请求-响应式消息收发模型提供了原生支持。</font>

#### <font style="color:#2F8EF4;">1.4.2 LiteConsumer 的核心能力</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">多节点差异化订阅：同一 CID 下的不同节点可独立订阅各自的 LiteTopic，实现细粒度、个性化的订阅策略。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">动态订阅扩展：支持在运行时实时为单个节点新增 LiteTopic 订阅，无需重启服务或影响其他节点的正常消费。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">动态退订能力：支持在运行时实时取消单个节点对特定 LiteTopic 的订阅，实现精准的资源释放与流量治理。</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01ctOtEu1rWG88RIhpl_!!6000000005638-2-tps-1820-1462.png)

### <font style="color:rgb(0, 0, 0);">1.5 生产案例：RocketMQ LiteTopic 如何重塑 AI 应用架构？</font>
<font style="color:rgba(0, 0, 0, 0.9);">以下案例基于某客户真实的 AI 应用场景，通过架构对比直观展示采用传统 RocketMQ 通信模型与引入 LiteTopic 轻量级通信模型前后的显著差异。</font>

<font style="color:rgba(0, 0, 0, 0.9);">采用 RocketMQ LiteTopic 轻量级通信模型后，客户架构</font><font style="color:rgba(0, 0, 0, 0.9);">实现了</font>**<font style="color:rgba(0, 0, 0, 0.9);">质的提升</font>**<font style="color:rgba(0, 0, 0, 0.9);">：不仅彻底移除了对 Redis 的依赖，还避免了广播推送带来的带宽与计算资源浪费。整体架构更轻量，系统稳定性与可靠性也得到显著提升。</font>

#### <font style="color:#2F8EF4;">1.5.1 改造前：依赖 Redis + 广播的臃肿架构</font>
![](https://img.alicdn.com/imgextra/i3/O1CN01yhn2sx1lNCbP5VfFE_!!6000000004806-2-tps-1456-466.png)

<font style="color:rgba(0, 0, 0, 0.9);">整体的业务流程步骤如下：</font>

1. **<font style="color:rgba(0, 0, 0, 0.9);">任务提交</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">用户请求到达后，应用接入层节点将推理任务写入 Redis。</font>
2. **<font style="color:rgba(0, 0, 0, 0.9);">任务处理</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">Worker 集群扫描 Redis 并处理推理任务，将推理过程中的中间结果以多条顺序消息的形式发送至 RocketMQ。</font>
3. **<font style="color:rgba(0, 0, 0, 0.9);">结果持久化与通知</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">Consumer </font><font style="color:rgba(0, 0, 0, 0.9);">集群顺序消费 </font><font style="color:rgba(0, 0, 0, 0.9);">RocketMQ </font><font style="color:rgba(0, 0, 0, 0.9);">消息，将最终推理结果存入 Redis，并基于 RocketMQ 广播通知所有应用接入层节点。</font>
4. **<font style="color:rgba(0, 0, 0, 0.9);">结果推送</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">应用接入层节点收到广播消息后，仅当结果归属于自身连接时，才从 Redis 获取完整结果并推送给客户端；否则直接忽略该消息。</font>

<font style="color:rgba(0, 0, 0, 0.9);">传统架构采用“先存储、再广播、后过滤”的模式，在高并发 AI 场景下效率低下且成本高昂：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">架构臃肿且脆弱</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">强依赖外部组件 Redis，增加了系统的复杂度和潜在故障点，运维成本高，可用性受限。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">资源浪费严重</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">无效的广播机制导致大量带宽被占用，且每个应用接入层节点都需进行计算密集型的过滤操作。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">链路冗长低效</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">数据流转需多次读写 Redis，通信链路长、延迟高，应用接入层节点宕机后会话状态将全部丢失，严重影响用户体验。</font>

#### <font style="color:#2F8EF4;">1.5.2 改造后：基于 RocketMQ LiteTopic 的极简可靠架构</font>
![](https://img.alicdn.com/imgextra/i1/O1CN01l1KXmP1NLmb7Sx0aq_!!6000000001554-2-tps-1156-434.png)

<font style="color:rgba(0, 0, 0, 0.9);">引入 LiteTopic 后，业务流程被大幅简化，实现了端到端的可靠、高效通信：</font>

1. **<font style="color:rgba(0, 0, 0, 0.9);">会话绑定与动态订阅</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">应用接入层节点在发起推理请求时携带唯一身份标识（如 Session ID），并立即订阅该标识对应的 LiteTopic（无需预创建 consumer group、topic）。</font>
2. **<font style="color:rgba(0, 0, 0, 0.9);">结果持久化发送</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">智能应用（Worker）根据请求中的身份标识，将推理结果直接发送至对应的 LiteTopic（同样无需预创建）。</font>
3. **<font style="color:rgba(0, 0, 0, 0.9);">精准接收消费</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">应用接入层节点各自精准接收属于自己的 response 消息，无需过滤，无任何冗余消费。</font>

#### **<font style="color:#2F8EF4;">1.5.3 核心价值：为 AI 会话注入“记忆”，实现断点续传与恢复</font>**
<font style="color:rgba(0, 0, 0, 0.9);">客户接入 LiteTopic 轻量级通信模型后，通过将 LiteTopic 与 Session 维度进行细粒度绑定，以极低成本实现了生产级的会话续传与恢复能力。</font>

<font style="color:rgba(0, 0, 0, 0.9);">在按照上一小节的流程实现端到端的可靠通信后，在网关机器下线/宕机时：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">自动重连</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">客户端检测到连接断开后，自动发起重连请求。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">动态订阅</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">新接管的应用接入层节点实例根据 Session ID，动态订阅原 session 对应的 LiteTopic（无需预创建）。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">断点续传</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">新应用接入层节点从上次成功消费的 Offset 位点开始拉取消息，精准恢复到故障前的状态（不会丢消息，也不会重复消费已处理的消息）。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">恢复会话</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">自动恢复 Session 的完整上下文，用户完全无感知，业务流程无缝衔接。</font>

## ![](https://img.alicdn.com/imgextra/i2/O1CN01WW8wng1twU2YYXcIU_!!6000000005966-2-tps-1162-404.png)<font style="color:#2F8EF4;">基于 RocketMQ LiteTopic 打造企业级 Session 管理</font>
### <font style="color:rgb(0, 0, 0);">2.1 AI 场景下 Session 的四大核心要求</font>
<font style="color:rgba(0, 0, 0, 0.9);">在 AI 应用场景下，业界对 Session 的特性提出了以下四项核心要求：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">低延迟</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">面向实时交互场景，要求快速响应。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">时序性</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">必须严格按对话时间顺序组织内容，确保上下文的连续性与逻辑一致性。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">单会话隔离</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">保障不同用户/会话间的数据隔离，避免消息串话或状态混淆。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">上下文压缩</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">支持通过截断或摘要控制上下文长度，避免超出模型窗口限制导致溢出。</font>

### <font style="color:rgb(0, 0, 0);">2.2 RocketMQ LiteTopic 实现 Session 的四大优势</font>
<font style="color:rgba(0, 0, 0, 0.9);">基于 RocketMQ LiteTopic 实现 Session 的核心价值，在于将“Session”从内存易失状态转化为</font>**<font style="color:rgba(0, 0, 0, 0.9);">可持久、可追溯、可恢复</font>**<font style="color:rgba(0, 0, 0, 0.9);">的事件流</font><font style="color:rgba(0, 0, 0, 0.9);">，为多智能体系统提供企业级会话韧性，彻底解决传统架构中会话状态丢失、无法恢复等痛点。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">1. 会话状态持久化 —— 进程重启不丢会话</font>**

<font style="color:rgba(0, 0, 0, 0.9);">消息天然持久化存储于 CommitLog，即使应用宕机或网络中断，也能</font>**<font style="color:rgba(0, 0, 0, 0.9);">通过消息重放完整重建会话上下文</font>**<font style="color:rgba(0, 0, 0, 0.9);">（如对话历史、任务状态、中间结果）。</font>

<font style="color:rgba(0, 0, 0, 0.9);">如下图所示，应用 A 将响应输出的 TaskEvent / TaskUpdateEvent 转换为 RocketMQ LiteTopic 中存储的消息（Message）。当应用 A 重启后，可从 CommitLog 中重放所有消息，完整恢复会话状态。</font>

![](https://img.alicdn.com/imgextra/i2/O1CN01Ef86Cs1aynL6ULqqL_!!6000000003399-2-tps-2960-1092.png)

**<font style="color:rgba(0, 0, 0, 0.9);">2. 消息回溯与重放 —— 断点精准恢复</font>**

<font style="color:rgba(0, 0, 0, 0.9);">支持按时间 / Offset 回溯消费，应用重启后可从断点精确恢复会话，实现无缝续聊与任务接力，避免重复推理带来的算力浪费。</font>

<font style="color:rgba(0, 0, 0, 0.9);">当应用宕机后重新启动，可以指定某个 Session（LiteTopic）中的具体位点开始继续消费，或从上次消费成功的位点开始消费。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN013Oha3g22ITzSqV491_!!6000000007097-2-tps-2472-1434.png)

**<font style="color:rgba(0, 0, 0, 0.9);">3. Session 隔离与路由 —— 多会话并行无干扰</font>**

<font style="color:rgba(0, 0, 0, 0.9);">通过轻量级 LiteTopic 实现会话级隔离（如 Session ID 作为 LiteTopic 的唯一标识），确保多用户/多会话并行运行时互不干扰。</font>

<font style="color:rgba(0, 0, 0, 0.9);">多用户多 Session 的消息存储于不同的 LiteTopic，在数据存储维度实现天然隔离，无需应用层手动过滤。</font>

![](https://img.alicdn.com/imgextra/i2/O1CN01sgpVVy1FquahSvJgx_!!6000000000539-2-tps-3204-1030.png)

**<font style="color:rgba(0, 0, 0, 0.9);">4. 流量削峰与缓冲 —— 保护下游应用稳定性</font>**

<font style="color:rgba(0, 0, 0, 0.9);">高并发会话请求被缓冲至 Broker，避免下游 Agent 瞬时过载崩溃，提升系统整体稳定性。下游应用根据自身处理能力按需消费消息，实现“削峰填谷”。</font>

<font style="color:rgba(0, 0, 0, 0.9);">如下图所示，应用 A 发出的任务请求可在 Broker 中持久化堆积，下游应用 B 根据自身消费能力按需拉取并处理，有效保障系统稳定性。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01lj0EHm1P9XEo1IFb6_!!6000000001798-2-tps-2820-1008.png)

## <font style="color:#2F8EF4;">基于 RocketMQ 构建高可靠 A2A 通信通道</font>
<font style="color:rgba(0, 0, 0, 0.9);">在上一章，我们解决了单个会话的持久化与恢复问题。现在，让我们将视野放大：当成百上千个功能各异的 Agent 需要协作时，它们之间如何建立标准化的通信？这正是 A2A 协议诞生的意义所在。</font>

### <font style="color:rgb(0, 0, 0);">3.1 A2A 协议</font>
<font style="color:rgba(0, 0, 0, 0.9);">Agent-to-Agent（简称 A2A）是一项由 Google 于 2025 年发起，并贡献至 Linux 基金会的开源通信协议。其核心目标是建立跨厂商、跨框架的标准化互操作机制，使异构 AI 智能体（Agents）能够</font>**<font style="color:rgba(0, 0, 0, 0.9);">自动发现、可靠通信并高效协作</font>**<font style="color:rgba(0, 0, 0, 0.9);">，从而构建开放、可组合、可扩展的多智能体系统生态。</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01nLvgr71ocisABvyMH_!!6000000005246-2-tps-2642-904.png)

### <font style="color:rgb(0, 0, 0);">3.2 单智能体 vs. 多智能体架构：能力边界与协同范式的演进</font>
<font style="color:rgba(0, 0, 0, 0.9);">在深入探讨如何构建 A2A 通信之前，我们首先需要理解，为什么多智能体协同是必然趋势。我们从六个维度对比单智能体与多智能体的能力差异：</font>

![](https://img.alicdn.com/imgextra/i3/O1CN01tq871k1WVFK6ncEgk_!!6000000002793-2-tps-3311-1263.png)

### <font style="color:rgb(0, 0, 0);">3.3 同步 RPC 与 RocketMQ 异步通信的对比</font>
<font style="color:rgba(0, 0, 0, 0.9);">明确了多智能体架构的优势后，下一个关键问题是：如何实现 Agent 之间的通信？</font>

<font style="color:rgba(0, 0, 0, 0.9);">A2A 协议原生支持的同步 RPC 协议包括 JSON-RPC、gRPC 和 REST。然而，在企业级的复杂场景下，这些同步协议面临诸多挑战。下表从多个维度对比同步 RPC 与 RocketMQ 异步通信模型的差异：</font>

![](https://img.alicdn.com/imgextra/i3/O1CN01MnhEHw1vUColLyvHZ_!!6000000006175-2-tps-3458-828.png)

### <font style="color:rgb(0, 0, 0);">3.4 开箱即用：基于 RocketMQ 的 A2A 协议实现</font>
<font style="color:rgba(0, 0, 0, 0.9);">为加速 A2A 协议在异步通信场景的落地，我们基于 RocketMQ SDK 实现了 A2A 协议的 </font><font style="color:rgb(0, 122, 170);background-color:rgba(27, 31, 35, 0.05);">ClientTransport</font><font style="color:rgba(0, 0, 0, 0.9);"> 接口。该实现旨在帮助用户在搭建多智能体应用时，能够专注于自身业务逻辑，快速构建高可靠、开箱即用的 A2A 通信方案。</font>

<font style="color:rgb(51, 51, 51);background-color:rgba(0, 0, 0, 0.03);">发送普通同步请求：EventKind sendMessage(MessageSendParams request, @Nullable ClientCallContext context)发送Stream请求：void sendMessageStreaming(MessageSendParams request, Consumer<StreamingEventKind> eventConsumer…)重订订阅任务数据：void resubscribe(TaskIdParams request, Consumer<StreamingEventKind> eventConsumer, Consumer<Throwable> errorConsumer查询任务完成状态：Task getTask(TaskQueryParams request, @Nullable ClientCallContext context)取消任务执行Task cancelTask(TaskIdParams request, @Nullable ClientCallContext context)以及其他方法</font>

#### **<font style="color:#2F8EF4;">开源项目地址</font>**
<font style="color:rgba(0, 0, 0, 0.9);">基于 RocketMQ 实现的 A2A 通信 RocketMQTransport 部分代码现已开源，欢迎关注！</font>

<font style="color:rgba(0, 0, 0, 0.9);">项目地址：</font>_<u><font style="color:rgb(0, 122, 170);">https://github.com/apache/rocketmq-a2a</font></u>_

![](https://img.alicdn.com/imgextra/i4/O1CN01GVAEcE1Cofo9MZRlb_!!6000000000128-2-tps-1746-1530.png)

### <font style="color:rgb(0, 0, 0);">3.5 架构解析：如何通过 RocketMQ 实现 Agent 间通信？</font>
<font style="color:rgba(0, 0, 0, 0.9);">在一个典型的多智能体协作架构中，通信流程如下：</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">应用 A 扮演 Supervisor 角色，负责对用户输入的需求进行任务分解，并将拆分后的子任务分别发送至应用 B 的业务 Topic（Normal Topic1）和应用 C 的业务 Topic（Normal Topic2）。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">应用 B 集群从 Normal Topic1 拉取消息并执行相应逻辑处理，随后将结果发布到应用 A 订阅的 LiteTopic。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">应用 C 集群则从 Normal Topic2 拉取消息进行处理，并同样将结果写入该 LiteTopic。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">应用 A 集群通过拉取 LiteTopic 中的消息，汇聚各子任务的响应结果，进而驱动后续的业务逻辑编排。</font>

![](https://img.alicdn.com/imgextra/i4/O1CN0168RSZc219UbGvzmKS_!!6000000006942-2-tps-2890-1536.png)

## <font style="color:#2F8EF4;">AgentScope × RocketMQ：构建多智能体应用的最佳组合</font>
<font style="color:rgba(0, 0, 0, 0.9);">理论与架构已经铺垫完毕，接下来，让我们结合一个完整的实战案例，看看如何将这套强大的通信基座，与顶尖的智能体开发框架 AgentScope 相结合，构建一个真正可用的多智能体应用。</font>

### <font style="color:rgb(0, 0, 0);">4.1 AgentScope：面向多智能体的开发者友好框架</font>
<font style="color:rgba(0, 0, 0, 0.9);">AgentScope 是阿里巴巴继 AI 模型社区 ModelScope 后，在 Agent 领域的又一战略级开源力作。它以“开发者为中心”，专注于提供智能体开发的开源框架，为构建复杂的多智能体应用提供了从设计、开发到调试的全套解决方案。它具备以下核心优势：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">对开发者透明</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">拒绝隐式魔法，所有环节（提示、API、智能体、工作流）可见、可控。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">实时可介入：</font>**<font style="color:rgba(0, 0, 0, 0.9);">原生支持运行时中断与自定义处理。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">更智能：</font>**<font style="color:rgba(0, 0, 0, 0.9);">内置工具管理、长期记忆、智能 RAG 等能力。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">模型无关：</font>**<font style="color:rgba(0, 0, 0, 0.9);">一次编写，无缝适配各类大模型。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">乐高式构建：</font>**<font style="color:rgba(0, 0, 0, 0.9);">模块化设计，组件解耦、自由组合。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">面向多智能体：</font>**<font style="color:rgba(0, 0, 0, 0.9);">显式消息传递与工作流编排，专为协作场景打造。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">高度可定制：</font>**<font style="color:rgba(0, 0, 0, 0.9);">全面开放工具、提示、智能体、工作流及可视化扩展，鼓励深度定制。</font>

![](https://img.alicdn.com/imgextra/i3/O1CN01rlSh9r1dYBAbOed3w_!!6000000003747-2-tps-2542-1320.png)

### <font style="color:rgb(0, 0, 0);">4.2 AgentScope x RocketMQ 的集成架构与合作展望</font>
<font style="color:rgba(0, 0, 0, 0.9);">在明确了 AgentScope 的功能定位与应用价值之后，我们将进一步探讨其通信层与 RocketMQ 的现有集成机制，并展望双方在技术协同与生态共建方面的未来合作方向。</font>

#### **<font style="color:#2F8EF4;">4.2.1 AgentScope 与 RocketMQ 集成架构</font>**
<font style="color:rgba(0, 0, 0, 0.9);">当 AgentScope 作为 Agent 应用服务提供者时，其内部支持符合 A2A（Agent-to-Agent）协议的多种通信方式，包括基于 JSONRPC 的 WebService 和 RocketMQ Service，用于接收并处理来自其他 Agent 的 A2A 协议请求。同时，AgentScope 通过 well-known 服务接口向外标准化地透出其所承载 Agent 的核心能力信息，包括但不限于：</font>

<font style="color:rgba(0, 0, 0, 0.9);">- name（名称） </font>

<font style="color:rgba(0, 0, 0, 0.9);">- description（描述） </font>

<font style="color:rgba(0, 0, 0, 0.9);">- capabilities（能力列表） </font>

<font style="color:rgba(0, 0, 0, 0.9);">- additionalInterfaces（额外支持的接口或协议）</font>

<font style="color:rgba(0, 0, 0, 0.9);">这些元数据使调用方能够清晰识别该 Agent 提供的主要功能、所支持的通信协议及其对应的接入方式。</font>

<font style="color:rgba(0, 0, 0, 0.9);">当 AgentScope 作为 Agent 应用服务的调用者时，它首先通过访问目标 Agent 暴露的 well-known 服务，动态获取其详细的能力描述、支持的协议类型及对应的服务接入点（如 JSONRPC 端点或 RocketMQ Topic 信息）。随后，在通信层，AgentScope 利用 A2A 协议定义的传输客户端（如 </font><font style="color:rgb(0, 122, 170);background-color:rgba(27, 31, 35, 0.05);">JSONRPCTransport</font><font style="color:rgba(0, 0, 0, 0.9);"> 或 </font><font style="color:rgb(0, 122, 170);background-color:rgba(27, 31, 35, 0.05);">RocketMQTransport</font><font style="color:rgba(0, 0, 0, 0.9);">）发起请求，并对返回的响应结果进行统一解析与处理，从而实现跨 Agent 的标准化、可互操作的协同调用。</font>

##### **<font style="color:rgba(0, 0, 0, 0.9);">1. 基于 RocketMQ 协议通信架构图</font>**
![](https://img.alicdn.com/imgextra/i4/O1CN01Iw7EoR1tYfRd7xtTa_!!6000000005914-2-tps-1112-1330.png)

##### <font style="color:rgba(0, 0, 0, 0.9);">2. 基于 JSONRPC 协议通信架构图</font>
![](https://img.alicdn.com/imgextra/i1/O1CN01A65mwk1G61f3PiRkF_!!6000000000572-2-tps-1110-1076.png)

#### **<font style="color:rgb(255, 104, 39);">4.2.2 合作展望</font>**
<font style="color:rgba(0, 0, 0, 0.9);">随着人工智能与分布式系统技术的深度融合，消息中间件与智能体（Agent）平台的协同正成为构建下一代智能分布式应用的关键路径。作为 Apache 软件基金会顶级项目，RocketMQ 凭借高吞吐、低延迟和高可靠等核心特性，已成为全球广泛采用的分布式消息队列，在金融、电商、物联网等关键领域积累了深厚的技术积淀，并于近期推出了轻量级通信模型 LiteTopic，进一步拓展了其在 AI 应用场景中的适用性。与此同时，AgentScope 作为新兴的智能体编排与运行平台，专注于为多智能体系统提供统一的调度、通信与治理能力。二者在技术理念与应用场景上高度契合，展现出广阔的合作前景与协同创新潜力。</font>

##### **<font style="color:rgba(0, 0, 0, 0.9);">1. 技术互补：构建“消息驱动 + 智能决策”的新型架构</font>**
<font style="color:rgba(0, 0, 0, 0.9);">RocketMQ 提供了强大的异步通信、事件驱动和流式处理能力。AgentScope 则聚焦于智能体生命周期管理、任务分解、上下文感知与自主协作。未来，二者可深度融合，形成“消息即事件、事件触发智能体行为”的新型架构：</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">智能体间通信的标准化通道</font><font style="color:rgba(0, 0, 0, 0.9);">：利用 RocketMQ 作为 AgentScope 内部或跨集群智能体之间的可靠通信总线，保障高并发、有序、可追溯的消息传递，提升多智能体系统的鲁棒性与扩展性。</font>

##### **<font style="color:rgba(0, 0, 0, 0.9);">2. 生态共建：推动开源与标准协同发展</font>**
<font style="color:rgba(0, 0, 0, 0.9);">双方可基于开源社区开展深度合作：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">集成适配器开发</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">共同开发 RocketMQ 与 AgentScope 的官方集成插件，简化开发者接入流程。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">联合参考架构发布</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">推出面向典型场景（如智能客服等场景）的联合解决方案模板，加速行业落地。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">参与标准制定</font>****<font style="color:rgba(0, 0, 0, 0.9);">：</font>**<font style="color:rgba(0, 0, 0, 0.9);">在事件驱动架构（EDA）、智能体通信协议等领域协同推进开放标准，促进生态互操作性。</font>

### <font style="color:rgb(0, 0, 0);">4.3 场景案例：用 AgentScope 与 RocketMQ 打造“智能旅行助手”</font>
<font style="color:rgba(0, 0, 0, 0.9);">本案例以 AgentScope 作为 AI 智能体应用开发框架，构建了三个智能体：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">SupervisorAgent</font>****<font style="color:rgba(0, 0, 0, 0.9);">（总控）</font>**<font style="color:rgba(0, 0, 0, 0.9);">：负责与用户交互，任务分解与逻辑编排。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">WeatherAgent</font>****<font style="color:rgba(0, 0, 0, 0.9);">（天气专家）</font>**<font style="color:rgba(0, 0, 0, 0.9);">：负责查询天气信息。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">TravelAgent</font>****<font style="color:rgba(0, 0, 0, 0.9);">（旅行专家）</font>**<font style="color:rgba(0, 0, 0, 0.9);">：负责依据天气进行用户的行程规划。</font>

<font style="color:rgba(0, 0, 0, 0.9);">SupervisorAgent 应用具有如下逻辑：</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">如果用户只查询天气情况，则直接请求 WeatherAgent 进行天气信息查询；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">如果用户希望做出行程规划，则先向 WeatherAgent 发出天气查询请求，获取对应天气信息后，再带着天气信息向 TravelAgent 发出行程规划请求，TravelAgent 对行程结果进行规划后将响应结果发送至 SupervisorAgent 订阅的 LiteTopic，SupervisorAgent 应用将结果发送至用户侧。</font>

![](https://img.alicdn.com/imgextra/i2/O1CN01FbMz3s1dSE1NraaWz_!!6000000003734-2-tps-2438-1110.png)

## <font style="color:#2F8EF4;">实战演练：三步构建高可靠多智能体应用</font>
<font style="color:rgba(0, 0, 0, 0.9);">阿里云官网现已提供</font>**<font style="color:rgba(0, 0, 0, 0.9);">免费试用、一键部署</font>**<font style="color:rgba(0, 0, 0, 0.9);">的</font><font style="color:rgba(0, 0, 0, 0.9);">《</font>[<font style="color:rgb(87, 107, 149);">RocketMQ for AI：企业级 AI 应用集成的异步通信方案</font>](https://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247579154&idx=1&sn=04bf8e31f323ee5121430a55737d863f&scene=21#wechat_redirect)<font style="color:rgba(0, 0, 0, 0.9);">》</font><font style="color:rgba(0, 0, 0, 0.9);">，带您亲手搭建并运行一个多智能体应用，并基于 RocketMQ LiteTopic 实现多智能体异步通信能力——具备持久化、高可靠、可追溯等特性，显著提升 AI 应用交互的稳定性与可观测性。</font>

### <font style="color:rgb(0, 0, 0);">5.1 方案概览：技术架构与云资源</font>
<font style="color:rgba(0, 0, 0, 0.9);">本方案将带领您搭建一个多智能体（Multi-Agent）系统，能够根据用户的需求查询天气信息并制定行程规划。</font>

<font style="color:rgba(0, 0, 0, 0.9);">为简化部署过程，我们将在 1 台云服务器 ECS 上部署 3 个独立的 Agent（SupervisorAgent，WeatherAgent 和 TravelAgent，具体功能可参考 4.3），并且通过 RocketMQ 消息服务实现 Agent 之间的异步通信。</font>

![](https://img.alicdn.com/imgextra/i2/O1CN01agGkSC1KfWpFtfXJL_!!6000000001191-2-tps-2407-1025.png)

<font style="color:rgba(0, 0, 0, 0.9);">本方案的技术架构包含构建一个完整多智能体应用所需的所有云资源：</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01OXdPSN1uVkXMFPaGA_!!6000000006043-2-tps-747-206.png)

### <font style="color:rgb(0, 0, 0);">5.2 三步体验：从创建资源到部署 Agent</font>
**<font style="color:rgba(0, 0, 0, 0.9);">1. 免费一键部署资源</font>**

<font style="color:rgba(0, 0, 0, 0.9);">访问体验方案页面，点击“免费试用”，进入实验操作界面后，点击“立即试用”即可领取免费试用点，自动开始创建资源。</font>

![](https://img.alicdn.com/imgextra/i3/O1CN011wT4eJ1NMhOEdGvuU_!!6000000001556-2-tps-1588-784.png)

![](https://img.alicdn.com/imgextra/i1/O1CN01KtME1M1vAVmqTVFsq_!!6000000006132-2-tps-1308-808.png)

![](https://img.alicdn.com/imgextra/i1/O1CN01h2dlre1cjLCtV8l27_!!6000000003636-2-tps-1530-590.png)

**<font style="color:rgba(0, 0, 0, 0.9);">2. 创建 Topic 和 Group</font>**

<font style="color:rgba(0, 0, 0, 0.9);">共创建 3 个 Topic，配置参数见下表，其余参数保持默认。</font>

![](https://img.alicdn.com/imgextra/i3/O1CN01IVHPKT1Icf7Eep0yV_!!6000000000914-2-tps-743-190.png)

<font style="color:rgba(0, 0, 0, 0.9);">共创建 3 个 Group，配置参数见下表，其余参数保持默认。</font>

![](https://img.alicdn.com/imgextra/i3/O1CN01as6I1b28DndRHHB9F_!!6000000007899-2-tps-745-167.png)

![](https://img.alicdn.com/imgextra/i3/O1CN01rgiwYq23sUkSYoqdq_!!6000000007311-2-tps-746-127.png)

**<font style="color:rgba(0, 0, 0, 0.9);">3. 创建部署智能体应用</font>**

<font style="color:rgba(0, 0, 0, 0.9);">在阿里云百炼的应用管理页面，根据示例文档中提供的模型参数和提示词，分别创建并发布两个智能体应用（天气助手 Agent、行程助手 Agent）。</font>

<font style="color:rgba(0, 0, 0, 0.9);">远程连接云服务器 ECS 根据提供的执行脚本部署示例应用程序。等待应用启动完毕，大约需要 3~5 分钟，直到终端显示 </font>`<font style="color:rgba(0, 0, 0, 0.9);">You > </font>`<font style="color:rgba(0, 0, 0, 0.9);">提示符，便可直接在终端中输入信息与智能体交互。</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01N3qCZx1OtVNLLVJVD_!!6000000001763-2-tps-2484-386.png)

**<font style="color:rgb(0, 0, 0);">5.3 结果验证：任务执行与消息轨迹追踪</font>**

<font style="color:rgba(0, 0, 0, 0.9);">1. 在 </font><font style="color:rgb(0, 122, 170);background-color:rgba(27, 31, 35, 0.05);">You ></font>`<font style="color:rgba(0, 0, 0, 0.9);"> </font>`<font style="color:rgba(0, 0, 0, 0.9);">提示符后，输入</font><font style="color:rgb(0, 122, 170);"> </font><font style="color:rgb(0, 122, 170);background-color:rgba(27, 31, 35, 0.05);">帮我做一个下周三到下周日杭州周边自驾游方案</font>`<font style="color:rgba(0, 0, 0, 0.9);"> </font>`<font style="color:rgba(0, 0, 0, 0.9);">并回车。</font>

<font style="color:rgba(0, 0, 0, 0.9);">2. 等待智能体执行任务，最终会返回结合天气信息的行程规划内容，过程如下：</font>

<font style="color:rgba(0, 0, 0, 0.9);">a. SupervisorAgent 接收用户输入，向消息队列发送一条消息 </font><font style="color:rgb(0, 122, 170);background-color:rgba(27, 31, 35, 0.05);">杭州下周三到周日的天气情况怎么样?</font><font style="color:rgba(0, 0, 0, 0.9);">。</font>

<font style="color:rgba(0, 0, 0, 0.9);">b. WeatherAgent 监听到上述消息，执行天气查询，并将结果发往消息队列。</font>

<font style="color:rgba(0, 0, 0, 0.9);">c. SupervisorAgent 监听到上述消息，获取了天气查询结果，然后向消息队列发送一条消息 </font><font style="color:rgb(0, 122, 170);background-color:rgba(27, 31, 35, 0.05);">杭州下周三至周日天气已知，天气为***，请基于此制定一份从杭州出发的周边2人3天4晚自驾游行程规划（下周三出发，周日返回），包含住宿、餐饮与景点推荐。</font>

<font style="color:rgba(0, 0, 0, 0.9);">d. TravelAgent 监听到上述消息，执行行程规划，并将结果发往消息队列。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN019IJDOh1F24cyXGU5J_!!6000000000428-2-tps-2178-1206.png)<font style="color:rgba(0, 0, 0, 0.9);">  
</font>

<font style="color:rgba(0, 0, 0, 0.9);">3. 查看消息轨迹：在云消息队列 RocketMQ 版实例详情页，可以按 Topic 或按 LiteTopic 查询到相关的消息轨迹。</font>

![](https://img.alicdn.com/imgextra/i2/O1CN016gTexP22SYhhzaF65_!!6000000007119-2-tps-1974-500.png)

<font style="color:rgba(0, 0, 0, 0.9);">目前，该解决方案已在阿里云官网上线，欢迎点击</font>[**阅读原文**](https://www.aliyun.com/solution/tech-solution/rocketmq-for-multi-agent-communication)<font style="color:rgba(0, 0, 0, 0.9);">即可部署体验～</font>

<font style="color:rgba(0, 0, 0, 0.9);">邀请您</font>**<font style="color:rgba(0, 0, 0, 0.9);">钉钉扫码</font>**<font style="color:rgba(0, 0, 0, 0.9);">加入 RocketMQ for AI 用户交流群，探索更多产品功能与应用场景，与我们共建 AI MQ 的未来！</font>

![](https://img.alicdn.com/imgextra/i4/O1CN018Vk3cv240jsTmTRNm_!!6000000007329-2-tps-444-443.png)


