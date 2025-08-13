---
title: "Apache RocketMQ EventBridge：为什么 GenAI 需要 EDA？"
description: "Apache RocketMQ EventBridge：为什么 GenAI 需要 EDA？"
date: "2025-08-13"
category: "article"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

> <font style="color:rgba(0, 0, 0, 0.55);">沈林，Apache RocketMQ PMC 成员，阿里云 EventBridge 负责人，专注于 EDA 研究。本文整理自作者在 Community Over Code Asia 2025 会议发表的主题演讲《Apache RocketMQ EventBridge: Why Your GenAI Needs EDA？》。</font>
>

<font style="color:rgba(0, 0, 0, 0.9);">EDA 的核心特点是：以事件为中心，实时响应变化。它不像传统“请求-响应”模式那样被动等待，而是“感知→触发→行动”全自动流转。在 AI 系统中，数据流、模型训练和推理、外部反馈等都可以作为“事件”，触发 AI 自动决策和联动执行。EDA 就像是 AI 时代的“神经系统”，让 AI 不仅能“思考”，还能“感知”和“行动”。它提升了系统的实时性、灵活性和自动化水平，是构建智能系统的关键支撑。AI 赋予系统“大脑”，EDA 构建系统的“神经”。  
</font>

<font style="color:rgba(0, 0, 0, 0.9);">本文主要探讨在 AI 时代，EDA 的重要价值及它可以帮助我们解决的问题。</font>

## <font style="color:#2F8EF4;">EDA 的第一重价值：通过 RAG 缓解 AI 幻觉</font>
<font style="color:rgba(0, 0, 0, 0.9);">大家可能还有印象，2023 年上半年，Google 的早期 AI 模型发布时，回答一个关于詹姆斯·韦伯空间望远镜的问题时，犯了一个低级“错误”，这个答案本来在 Google 上很容易搜索到，但是 AI“一本正经”的给了一个错误答案，直接导致谷歌当天的股价跌了 8% 左右。但 AI 完全没有意识到自己的错误，这是为什么？</font>

### <font style="color:rgba(0, 0, 0, 0.9);">1. 为什么会有 AI 幻觉？</font>
<font style="color:rgba(0, 0, 0, 0.9);">AI 幻觉的产生机制比较复杂，可简单从训练和推理两个阶段进行分析：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">训练阶段：</font>**
    - **<font style="color:rgba(0, 0, 0, 0.9);">数据覆盖不足：</font>**<font style="color:rgba(0, 0, 0, 0.9);">若训练数据不包含特定信息，模型无法“无师自通”；</font>
    - **<font style="color:rgba(0, 0, 0, 0.9);">过拟合：</font>**<font style="color:rgba(0, 0, 0, 0.9);">模型过度学习训练数据中的细节与噪声，导致在面对新数据时泛化能力差；</font>
    - **<font style="color:rgba(0, 0, 0, 0.9);">通用性与精度取舍：</font>**<font style="color:rgba(0, 0, 0, 0.9);">通用大模型为覆盖广泛领域，在特定垂直领域的准确性可能有所牺牲。</font>**<font style="color:rgba(0, 0, 0, 0.9);"></font>**
+ **<font style="color:rgba(0, 0, 0, 0.9);">推理阶段：</font>**
    - **<font style="color:rgba(0, 0, 0, 0.9);">自回归生成：</font>**<font style="color:rgba(0, 0, 0, 0.9);">LLM（大语言模型）推理本质上是一个自回归过程，基于现有 Token 预测下一个最可能的 Token，这种概率性生成机制使得幻觉成为其固有潜在分布的一部分。</font>
    - **<font style="color:rgba(0, 0, 0, 0.9);">连贯性优先于准确性：</font>**<font style="color:rgba(0, 0, 0, 0.9);">GenAI 输出的时候倾向于生成流畅连贯的答案，而非绝对准确的答案。</font>

### <font style="color:rgba(0, 0, 0, 0.9);">2. 如何减少 AI 幻觉？</font>
<font style="color:rgba(0, 0, 0, 0.9);">为了解决 AI 幻觉，现在一般有三种主流的方式：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">模型微调（Fine-tuning）：  
</font>**<font style="color:rgba(0, 0, 0, 0.9);">模型不好？最能直接想到的方法就是优化模型：丰富模型训练的数据、优化模型的参数，让其在垂直场景领域，回答更加精准。这种方式在很多场景是非常有效的，而且依旧被广泛采用。但是这种方式，要求也是比较高的，如果没有一定的人力和算力成本投入，将很难实现。尤其是在知识更新频繁的领域，模型需要不断调整，长期维护，投入代价相对较高。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">提示词工程（Prompt Engineering）：  
</font>**<font style="color:rgba(0, 0, 0, 0.9);">那可不可以不调整模型，而是在向 LLM 提问的时候，把相关的数据和限定条件一起给到 LLM？答案是可以的，这就是提示词工程。  
</font><font style="color:rgba(0, 0, 0, 0.9);">但是如何构造一个好的提示词，把 LLM 需要的上下文信息给到它，这个要求也是非常高的。不同人使用，提示词的构造水平也不同：这种方式就像是把“问问题”变成了一件“手工艺术活”。而且提示词优化虽然可以“压平”部分幻觉，但只要模型权重未变，提示词没有带上相关数据，提示词只能暂时把幻觉“藏”起来，而无法真正去除。</font>**<font style="color:rgba(0, 0, 0, 0.9);"></font>**
+ **<font style="color:rgba(0, 0, 0, 0.9);">检索增强生成（RAG）：  
</font>**<font style="color:rgba(0, 0, 0, 0.9);">那可不可以自动帮我们生成一个高质量的提示词呢？在这个提示词中，包含了 LLM 回答需要的关键信息。这个就和我们最后一个要讲的 RAG 非常像了，让我们看下 RAG 到底是什么。</font>

### <font style="color:rgba(0, 0, 0, 0.9);">3. 什么是 RAG？</font>
<font style="color:rgba(0, 0, 0, 0.9);">RAG 可以简单理解为：向 LLM 提问的时候，同时给这个问题，检索一个上下文，一起给到 LLM。比如：如果我们问 DeepSeek：本次 Apache 峰会有哪些讲师聊到了 RAG 这个话题？DeepSeek 肯定不知道，因为它没有这个数据，网上暂时也还没有相关数据。但如果给到它一个关于本次大会讲师的讲稿资料包。这样 DeepSeek 就有非常强相关的上下文，回答问题的时候，就不会跑题答偏。</font>

<font style="color:rgba(0, 0, 0, 0.9);">那 AI 要如何做到这一点呢？主要分两步：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">建立索引：</font>**<font style="color:rgba(0, 0, 0, 0.9);">首先，需要提前把讲师资料包存起来。但资料包可能非常大，我们需要快速找到跟提问的问题相关联的数据，这里就需要用到向量化。向量化本质上是对一个事物，从多个特征维度，进行数值标记。比如，标记我这个人，可以从年龄、身高、性别等多个特征标记，标记越多越清晰。如果两个向量在多维空间中的“位置”越接近，说明它们越相似。所以，我们需要提前把数据进行向量化，存到向量数据库里。</font>**<font style="color:rgba(0, 0, 0, 0.9);"></font>**
+ **<font style="color:rgba(0, 0, 0, 0.9);">检索生成：</font>**<font style="color:rgba(0, 0, 0, 0.9);">然后，当我们向 LLM 提问时，可以先把问题向量化，根据向量化后的结果，去向量数据库查询关联性最大的原始知识数据。最后，将查到的知识数据，作为上下文和问题一起传给 LLM，LLM 就可以给一个更加准确的回答了。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01njBzp225It9uuTigZ_!!6000000007504-49-tps-1080-500.webp)

<font style="color:rgba(0, 0, 0, 0.9);">从这个过程中，我们会发现 RAG 有两个非常明显的优点：</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">不需要用知识库数据给大模型训练，既节省了成本，又保证了数据隐私；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">不需要用提示词工程这样的“手工艺术活”，就可以让 AI 出现幻觉的概率变得足够低。</font>

### <font style="color:rgba(0, 0, 0, 0.9);">4. 为什么 EventBridge 适合做 RAG？</font>
<font style="color:rgba(0, 0, 0, 0.9);">为什么是 EventBridge 适合来做 RAG 呢？ 我们先来看下什么是 EventBridge：</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">EventBridge 的整个模型其实非常简洁：我们从下图左侧开始往右看，EventBridge 可以方便的把外部的数据，以标准化的事件格式，配合事件 Schema 集成到内部，中间可以存入事件总线（BUS），也可以选择不存储，然后通过过滤/转换，推送到下游服务中。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">这个链路，正好可以满足 RAG 过程中需要的三要素：获取上游丰富的数据、自定义切分和向量化、持久化到多种向量化数据库中。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01cfpjpU1eesY8v87WB_!!6000000003897-49-tps-1080-409.webp)

### <font style="color:rgba(0, 0, 0, 0.9);">5. EventBridge 如何实现 RAG？</font>
<font style="color:rgba(0, 0, 0, 0.9);">用一个场景举例，比如我们想建一个关于 EventBridge 知识的智能问答机器人，可以回答关于 EventBridge 的常见问题：</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">我们需要把存在上游 OSS 的 EventBridge 文档，通过 EventBridge 的事件流，进行 Chunk 切分、Embedding 向量化，然后存储到向量数据库；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">完成之后，当我们向 EventBridge 智能机器人提问“EventBridge 是什么？”，智能机器人会先把这个问题向量化，然后去向量数据库查找匹配度最高的相关内容，并一起传递给 LLM，LLM 就能结合查到的资料，给出非常精准的回答，减少幻觉产生。</font>

![](https://img.alicdn.com/imgextra/i4/O1CN017BZnuc1SiI74OqP7w_!!6000000002280-49-tps-1080-438.webp)

<font style="color:rgba(0, 0, 0, 0.9);">目前，阿里云大模型服务平台百炼的知识库 RAG 场景，已采用 EventBridge 的事件流能力，帮助众多客户减少了 LLM 问答中的幻觉问题，尤其在细分垂直领域效果显著。如果您感兴趣可以进行体验：</font>

_<u><font style="color:rgb(0, 82, 255);">https://bailian.console.aliyun.com/?&tab=app#/knowledge-base</font></u>_

## <font style="color:#2F8EF4;">EDA 的第二重价值：推理触发器（Inference Trigger）</font>
<font style="color:rgba(0, 0, 0, 0.9);">我们第二个想讨论的场景是推理触发器。</font>

### <font style="color:rgba(0, 0, 0, 0.9);">1. 程序使用 LLM 的规模将远超人类</font><font style="color:rgba(0, 0, 0, 0.9);"></font>
<font style="color:rgba(0, 0, 0, 0.9);">目前，我们日常接触最多的 LLM 场景是人与 LLM 服务直接对话，如问 DeepSeek 一个问题或智能客服等。 但更常见且增长迅速的方式是程序触发 LLM。例如供应链优化和金融订单风控。</font>

<font style="color:rgba(0, 0, 0, 0.9);">观察微服务就会发现，人调用 API 的量级远不如程序调用 API 的量级。相应地，我们可以想象，未来程序触发 LLM 的规模，也将远远超过人工使用 LLM。</font>

<font style="color:rgba(0, 0, 0, 0.9);">这其中的机会，我们应该怎么把握？</font>

### <font style="color:rgba(0, 0, 0, 0.9);">2. 推理诉求无处不在</font><font style="color:rgba(0, 0, 0, 0.9);"></font>
<font style="color:rgba(0, 0, 0, 0.9);">事实上，我们现有的商业系统中，已经存储了大量现成需要推理的场景。比如：</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">消息服务里，存储了客户的评论，需要对其打标分析，这条评论是积极的还是消极的，并给个分数；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">DB 里存储了产品的描述介绍信息，想让 AI 给一些产品描述优化建议；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">OSS 或 S3 存储了大量的文档，想让 AI 对每个文档生成一个 100 字的文档摘要。</font>

<font style="color:rgba(0, 0, 0, 0.9);">这些诉求在以前可能需要人工处理，但现在都可以交给 LLM，从而极大提升工作效率。那怎么让现有的商业系统，方便、快捷、低成本的使用 AI，甚至不需要写一行代码，这个就是 EventBridge 擅长的地方了。</font>

### <font style="color:rgba(0, 0, 0, 0.9);">3. 推理触发器：让模型被更好地使用</font>
<font style="color:rgba(0, 0, 0, 0.9);">为此，EventBridge 提供了三把武器：</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01yT6ZqN1wLn82SujVa_!!6000000006292-49-tps-1080-538.webp)

+ **<font style="color:rgba(0, 0, 0, 0.9);">第一把武器——实时推理并将结果存到目标端：</font>**<font style="color:rgba(0, 0, 0, 0.9);">通过 EventBridge 可以实时监听并获取存在 DB、消息、或者存储服务中的数据，然后实时调用 LLM 推理服务，并将推理结果输出存到目标端。此过程也可以结合上一部分讲到的 RAG，但中间不一定是一个 LLM，也可以是一个 Agent，甚至是一个 AI Workflow。  
</font><font style="color:rgba(0, 0, 0, 0.9);">这个过程看似简单，但有很多需要注意的地方：</font>
    - **<font style="color:rgba(0, 0, 0, 0.9);">数据合并：</font>**<font style="color:rgba(0, 0, 0, 0.9);">我们刚才聊到，LLM 的推理本质上是一个自回归过程，这次的输出会作为下一次的输入，无法一次性拿到结果，很多 LLM 只能支持以流式的方式返回数据，但下游往往需要的是一个确定性的结果，所以我们需要对流式数据进行合并再输出；</font>
    - **<font style="color:rgba(0, 0, 0, 0.9);">数据格式：</font>**<font style="color:rgba(0, 0, 0, 0.9);">很多业务场景下有明确的格式要求。比如上面提到的例子，让 LLM 对客户评论打标和评分，需要输出一个 JSON 结构。但不是所有 LLM 在 API 层面都支持 JSON 结构输出，我们需要通过提示词进行优化，让它尽可能输出一个符合要求的 JSON 结构。 </font>
    - **<font style="color:rgba(0, 0, 0, 0.9);">推理吞吐：</font>**<font style="color:rgba(0, 0, 0, 0.9);">LLM 的自回归生成方式，导致单次请求 RT 长、TPS 低。所以，我们需要提升高并发能力，把昂贵的 GPU 资源使用效率发挥到极致，同时需要做好 TPM 和 RPM 的限流，也就是每分钟请求次数和每分钟 Token 数的限流，以保证链路不会有大量限流异常。</font>

<font style="color:rgba(0, 0, 0, 0.9);">可以看到，具体落地会遇到很多挑战，但 EventBridge 可以帮助客户便捷高效地解决这些问题。</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">第二把武器——基于推理结果触发任务执行：  
</font>**<font style="color:rgba(0, 0, 0, 0.9);">除了让 LLM 推理输出结果存到目标端，EventBridge 还可以让 Agent 基于上游的某条消息，去调用某一个 Service，执行某一个动作，如发送邮件。</font>**<font style="color:rgba(0, 0, 0, 0.9);"></font>**
+ **<font style="color:rgba(0, 0, 0, 0.9);">第三把武器——离线异步推理提高资源利用率：  
</font>**<font style="color:rgba(0, 0, 0, 0.9);">对于实时性要求不高的推理场景，可以通过 EventBridge 实现离线异步推理，让稀缺的 GPU 资源被更好地调度利用，在云上的成本至少比实时推理便宜一半。</font>

<font style="color:rgba(0, 0, 0, 0.9);">AI 的强大在于其应用，而 EDA（事件驱动架构）非常适合作为推理触发器，激活 AI 的价值。</font>**<font style="color:rgba(0, 0, 0, 0.9);"></font>**

## <font style="color:#2F8EF4;">EDA 的第三重价值：构建 Agent 通信基础设施</font>
<font style="color:rgba(0, 0, 0, 0.9);">现在 AI Infra 非常热门，其概念非常广泛。对标 IT Infrastructure，我们这里讨论的话题是 AI 的通信。</font>

### <font style="color:rgba(0, 0, 0, 0.9);">1. 微服务的通信离不开 Messaging，Agent 间的通信应该如何？</font>
<font style="color:rgba(0, 0, 0, 0.9);">在微服务时代，消息系统在微服务间的通信中扮演了重要角色。到了 AI 时代，消息系统是否依然起着关键作用？具体形式和产品又会有哪些变化？</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01JECrpc28duBNGnZcH_!!6000000007956-49-tps-816-236.webp)

### <font style="color:rgba(0, 0, 0, 0.9);">2. Agent 和 Service 的通信：Function Calling、MCP</font>
<font style="color:rgba(0, 0, 0, 0.9);">为了回答这个问题，我们先看下现在 AI 的通信是怎么做的。</font>

<font style="color:rgba(0, 0, 0, 0.9);">首先，我们看下 Agent 和传统 Service 之间的通信。目前有两种主流的方式：Function Calling和MCP。</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">Function Calling：</font>**<font style="color:rgba(0, 0, 0, 0.9);">是 OpenAI 公司在 2023 年提出的。因为 LLM 本身是文本生成器, 不具备访问外部系统的能力。但是我们可以对 LLM 进行训练微调，让 LLM 理解外部的一些工具函数的定义，这样在遇到提问时，就可以按需生成这些工具函数需要的参数，然后调用这些工具函数。</font>**<font style="color:rgba(0, 0, 0, 0.9);"></font>**
+ **<font style="color:rgba(0, 0, 0, 0.9);">MCP：</font>**<font style="color:rgba(0, 0, 0, 0.9);">是 2024 年 11 月 Anthropic 提出的，全称 Model Context Protocol‌，其本意是用来解决 LLM 无状态的问题。LLM 每次调用都是独立的，而 MCP 是用来给 LLM 提供运行上下文，相当于一个“Session 机制”。但是为什么 MCP 会被拿来和 Function Calling 放在一起呢？因为它也可以拿来调用工具函数。和 Function Calling 不同的是，它不需要 LLM 提前训练微调来理解函数的入参和返回值，而是通过上下文“提示词”告诉 LLM 参数返回值。所以 MCP 相比 Function Calling，对模型的依赖更小，更加通用，但效果相比 Function Calling 要差一点。</font>

### <font style="color:rgba(0, 0, 0, 0.9);">3. Agent 和 Agent 的通信：A2A</font>
<font style="color:rgba(0, 0, 0, 0.9);">我们再来看下 Agent 与 Agent 之间是怎么通信的。</font>

<font style="color:rgba(0, 0, 0, 0.9);">Google 在今年 4 月份的时候，提出了一个 A2A 的通讯协议，其核心运行机制分为四步：</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">第一步：Client Agent 通过 Agent Card，看下远端 Agent 有哪些能力；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">第二步：根据 Agent Card 的能力描述，调用远端 Agent，创建一个 Task，让其帮忙完成一个任务；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">第三步：由于任务可能比较耗时，不一定能够立即响应。所以 A2A 协议允许远端 Agent 通过 SSE 协议，不间断的将任务的状态信息更新给 Client Agent；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">第四步：再将结果返回给 Client Agent，当然结果本身也是可以流式返回的。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01ZWub4X1mu0YpcpeUM_!!6000000005013-49-tps-1080-728.webp)

### <font style="color:rgba(0, 0, 0, 0.9);">4. MCP 和 A2A 之间的区别</font>
<font style="color:rgba(0, 0, 0, 0.9);">那 MCP 和 A2A 协议有什么区别呢？Google 给它们的关系做了一个描述：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">A2A 协议像一种沟通语言：</font>**<font style="color:rgba(0, 0, 0, 0.9);">如果把 Agent 比做人，一个人如果能力有限，想让其他 Agent 帮忙怎么办？A2A 协议就可以派上用场了，A2A 协议像一种沟通语言，可以让 Agent 和其他 Agent 用同一种语言交流，不至于说话的时候驴唇不对马嘴。</font>**<font style="color:rgba(0, 0, 0, 0.9);"></font>**
+ **<font style="color:rgba(0, 0, 0, 0.9);">MCP 就像工具使用说明书：</font>**<font style="color:rgba(0, 0, 0, 0.9);">Service 等价于人使用工具，可以提升人解决问题的能力。不过，使用工具也需要有些技巧，MCP 就像工具使用说明书，可以让Agent 更方便的使用这些 Service，来扩展 Agent 的能力。</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01uYcYat1TDtRQXzi44_!!6000000002349-49-tps-1080-463.webp)

<font style="color:rgba(0, 0, 0, 0.9);">我们把 Agent 比做人，把 Service 比做工具。但是，请人帮忙和请工具帮忙，真的可以分得这么清楚吗？</font>

### <font style="color:rgba(0, 0, 0, 0.9);">5. 预测 1：A2A and MCP 可能走向融合</font>
<font style="color:rgba(0, 0, 0, 0.9);">A2A 和 MCP的职责，设想很完美，但是实际运行的时候会遇到很多挑战。我们先来一起看看在 MCP 和 A2A 协议下，两者用来声明一个 Agent 或者 Service 能力的时候是怎么样的？</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">这里举例了一个“查询北京天气”的服务，会发现两者声明自己能力的时候，非常类似：</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01O1lqQi1MlbHPhf5hw_!!6000000001475-49-tps-1080-708.webp)

+ <font style="color:rgba(0, 0, 0, 0.9);">其次，两者的传输层协议也都非常相似，都支持 SSE 和 JSON-GRPC；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">最后，我们从工程师开发角度，推演一个场景：当一个 Agent 需要获取“查询天气”的能力时，它并不真正关心该能力是由一个 Service 还是另一个 Agent 提供的。Agent 的核心关注点在于能力的接口定义：即有哪些可用能力、如何调用，以及预期的返回结果是什么。至于该能力的后端提供者是 Service 还是 Agent，对于调用方而言是无需关注的实现细节。</font>

<font style="color:rgba(0, 0, 0, 0.9);">这里我们的第一个预测是：A2A and MCP 未来可能会合并，但具体怎么发展，还要看生态的选择。</font>

### <font style="color:rgba(0, 0, 0, 0.9);">6. 预测 2: 点对点的通信是不够的</font>
<font style="color:rgba(0, 0, 0, 0.9);">这里的第二个预测是：现有 MCP 和 A2A 协议中，只包含的点对点通信是不够的。按照 A2A 协议的推演，当一个系统中有很多 Agent 时，所有 Agent 都通过“长连接”集成在一起：大家第一个直观的感受是什么？ </font>

<font style="color:rgba(0, 0, 0, 0.9);">连接太多了！ 如果两个 Agent 通过“长连接”集成在一起，感觉可能也没有什么。但是如果一个 Agent 同时需要和数百个甚至上千个 Agent 通信，系统中就会产生大量的长连接。</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">首先对每一个 Agent 来讲，资源开销就非常大；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">其次，网状的连接，一旦某一个 Agent 出现问题，hang 住了某些资源，会不会拖垮其他 Agent 的服务？甚至拖垮整个系统？这类问题在微服务中，再常见不过了。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">最后，即使不会被出问题的 Agent 拖垮服务，但当这个出问题的 Agent 恢复时，之前的通讯是否依旧可以继续追踪？再次执行，是否已经幂等，是否有风险？</font>

<font style="color:rgba(0, 0, 0, 0.9);">这里面有非常多的稳定、性能、成本、扩展性的挑战。这些问题在微服务中已经被多次验证过，有些经验我们可以学习过来。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01s5I8tn26kemz9drrR_!!6000000007700-49-tps-1080-581.webp)

### <font style="color:rgba(0, 0, 0, 0.9);">7. EventBridge Super Agent</font><font style="color:rgba(0, 0, 0, 0.9);"></font>
<font style="color:rgba(0, 0, 0, 0.9);">基于上面两个预测判断，我们给出了一个 RocketMQ EventBridge 的回答: 在这个模型中，我们引入了一个 EventBridge Agent Proxy 的角色。我们姑且称它为“Super”Agent ，但它不是一个真正的 Agent，而是可以代理 Agent 的能力。</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">首先，所有 Agent 都可以写一份自己的个人简历，把自己拥有的能力，注册到“Super”Agent上；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">如果某个 Agent 需要调用其他 Agent 的能力，它可以在 “Super” Agent 中查找是否有其需要的 Agent。如果有，就可以直接通过与 “Super” Agent 的交互，来获得这个能力；</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">当这个 Agent 需要多个其他 Agent 的能力时，也不需要和每一个 Agent 交互，都可以通过 “Super” Agent 代理实现，将原本的 N:N 模型简化为 1:1 模型。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">除此之外，“Super” Agent 中的 Proxy 除了 A2A 协议，还会路由和跟踪每一个 Task 的运行状态，即使在异常/重启/集群扩容等场景下，每一个 Task 都能被按预期处理，并把状态同步回 Agent。</font>

<font style="color:rgba(0, 0, 0, 0.9);">“Super”Agent 和微服务注册中心有点类似，不过区别在于，它不光是提供了微服务查找寻址的作用，同时还起到了服务代理的作用。如果我们脑洞再大一点，可以不仅局限于 Task 级别的任务追踪和管理，甚至还可以往上考虑一层，提供“User”级别的上下文： </font>

+ <font style="color:rgba(0, 0, 0, 0.9);">我们现在的 Agent 都是没有记忆的，我们之前跟它说过的话，过几天再问它，它就不记得你了。 </font>
+ <font style="color:rgba(0, 0, 0, 0.9);">但是每个人使用工具的习惯是不一样的。如果 Agent 能更好的理解你，记得你，就可以提供更加人性化的服务。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">作为 Agent 注册和代理中心，如果在为 Agent 提供代理的同时，还能同时提供“User”的上下文，并且用 Agent 的越多，“User”的身份画像越完善；反过来，Agent 越依赖，进入一个正向循环。</font>

![](https://img.alicdn.com/imgextra/i2/O1CN01XxOcoU1XHKsguO8kr_!!6000000002898-49-tps-1080-428.webp)

<font style="color:rgba(0, 0, 0, 0.9);">目前，EventBridge Agent 代理还处于理论探索阶段，欢迎大家一起交流。</font>

## <font style="color:#2F8EF4;">参考文献与延伸阅读</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">[Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks, Lewis et al., 2020]</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">[Model Context Protocol (MCP) Specification, 2024]</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">[A2A: Agent-to-Agent Communication Protocol, Google, 2024]</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">Apache RocketMQ EventBridge 官方文档：  
</font>_<u><font style="color:rgb(0, 82, 255);">https://rocketmq.apache.org/</font></u>_


