---
title: "构建企业级 AI 应用：为什么我们需要 AI 中间件？"
description: "构建企业级 AI 应用：为什么我们需要 AI 中间件？"
date: "2025-09-28"
category: "article"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

## <font style="color:rgb(0, 128, 255);">前言</font>
![](https://img.alicdn.com/imgextra/i3/O1CN01AON4o61mBa9XP4DMY_!!6000000004916-2-tps-1080-720.png)

<font style="color:rgba(0, 0, 0, 0.9);">9 月 26 日，2025 云栖大会 AI 中间件：AI 时代的中间件技术演进与创新实践论坛上，</font>**<font style="color:rgba(0, 0, 0, 0.9);">阿里云智能集团资深技术专家林清山</font>**<font style="color:rgba(0, 0, 0, 0.9);">发表主题演讲《未来已来：下一代 AI 中间件重磅发布，解锁 AI 应用架构新范式》，重磅发布阿里云 AI 中间件，提供面向分布式多 Agent 架构的基座，包括：AgentScope-Java（兼容 Spring AI Alibaba 生态），AI MQ（基于Apache RocketMQ 的 AI 能力升级），AI 网关 Higress，AI 注册与配置中心 Nacos，以及覆盖模型与算力的 AI 可观测体系。阿里云 AI 中间件核心技术全面开源，全面拥抱行业标准，加速企业级 AI 应用规模化落地。</font>

## <font style="color:rgb(0, 128, 255);">AI Agent 大爆发</font>
<font style="color:rgba(0, 0, 0, 0.9);">自从</font><font style="color:rgba(0, 0, 0, 0.9);"> ChatGPT </font><font style="color:rgba(0, 0, 0, 0.9);">掀起了大模型浪潮，短短三年间，</font><font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">技术几乎以月为单位迭代：从能对话、写文案的</font><font style="color:rgba(0, 0, 0, 0.9);"> Chatbot</font><font style="color:rgba(0, 0, 0, 0.9);">，进化到协助编码与办公的</font><font style="color:rgba(0, 0, 0, 0.9);"> Copilot</font><font style="color:rgba(0, 0, 0, 0.9);">，如今进一步迈向具备自主规划、工具调用、记忆与协作能力的</font><font style="color:rgba(0, 0, 0, 0.9);"> Agent</font><font style="color:rgba(0, 0, 0, 0.9);">。</font><font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">不再只是</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">会说话的软件</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">，而是</font>**<font style="color:rgba(0, 0, 0, 0.9);">能理解目标、拆解任务、选择策略并执行的</font>****<font style="color:rgba(0, 0, 0, 0.9);">“</font>****<font style="color:rgba(0, 0, 0, 0.9);">行动主体</font>****<font style="color:rgba(0, 0, 0, 0.9);">”</font>**<font style="color:rgba(0, 0, 0, 0.9);">，能够在复杂场景中进行多轮推理与闭环反馈。</font>

<font style="color:rgba(0, 0, 0, 0.9);">如果说 2022 年是 Chatbot 的起点，2023 年是 Copilot 的浪潮，那么 2025 年，注定是 Agentic AI 全面爆发的元年。我们来回顾一下近几年的演进路线图。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01WpIvc121YgMk22PHi_!!6000000006997-0-tps-2560-1440.jpg)

+ <font style="color:rgba(0, 0, 0, 0.9);">2022 </font><font style="color:rgba(0, 0, 0, 0.9);">年，</font><font style="color:rgba(0, 0, 0, 0.9);">Chatbot </font><font style="color:rgba(0, 0, 0, 0.9);">进入大众视野。以 </font><font style="color:rgba(0, 0, 0, 0.9);">GPT-3 </font><font style="color:rgba(0, 0, 0, 0.9);">为代表，大家用它生成文本、做自然语言交互</font><font style="color:rgba(0, 0, 0, 0.9);">——</font><font style="color:rgba(0, 0, 0, 0.9);">简单客服、文案写作是典型场景。但它仍然是</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">被动应答</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">2023 年，Copilot 革命来了。GPT-4 带来更长上下文、多模态输入，加上检索增强（RAG）的成熟，让 AI 从</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">被动回答</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">升级为</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">主动协作</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">。开发者使用代码 Copilot，写代码效率可以提升 50% 以上；</font><font style="color:rgba(0, 0, 0, 0.9);">Office Copilot 深度融合 AI 技术于 Word、Excel、PPT 等应用中，深刻改变传统办公模式，大幅减少重复性工作。</font><font style="color:rgba(0, 0, 0, 0.9);">AI 开始深度融入企业核心工作中。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">2025 年，我们将迎来</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">能理解、会规划、能协作、敢行动</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">的 Agentic AI 的集中爆发。一方面，从 GPT-5、Qwen3 到 DeepSeek，模型在自主规划、多模态融合能力上高速发展；另一方面，针对 Agent 和工具的集成，多 Agent 通信的能力，也在走向标准化，如 MCP、A2A 标准。应用层面，人形机器人走上春晚舞台；企业里的“数字员工”开始上岗，如财务 Agent 能够自动审批流程，AI 的角色从辅助者走向“能自主决策、能自动闭环”的主体。</font>

<font style="color:rgba(0, 0, 0, 0.9);">有几组数字也在印证这一发展趋势：根据 </font><font style="color:rgba(0, 0, 0, 0.9);">Gartner </font><font style="color:rgba(0, 0, 0, 0.9);">行业报告，全球 </font><font style="color:rgba(0, 0, 0, 0.9);">Agent </font><font style="color:rgba(0, 0, 0, 0.9);">市场正以 </font><font style="color:rgba(0, 0, 0, 0.9);">44.5% </font><font style="color:rgba(0, 0, 0, 0.9);">的年复合增长率扩张，预计到 </font><font style="color:rgba(0, 0, 0, 0.9);">2028 </font><font style="color:rgba(0, 0, 0, 0.9);">年将达到近三千亿美元规模；将有超过 </font><font style="color:rgba(0, 0, 0, 0.9);">15% </font><font style="color:rgba(0, 0, 0, 0.9);">的企业日常决策由 </font><font style="color:rgba(0, 0, 0, 0.9);">Agent </font><font style="color:rgba(0, 0, 0, 0.9);">自主完成；</font>**<font style="color:rgba(0, 0, 0, 0.9);">而有三分之一的企业软件，会原生嵌入 </font>****<font style="color:rgba(0, 0, 0, 0.9);">Agentic AI </font>****<font style="color:rgba(0, 0, 0, 0.9);">能力。</font>**

<font style="color:rgba(0, 0, 0, 0.9);">这不是一阵风，而是一个长周期的结构性趋势。技术、政策、市场这三股力量，正在同频共振，形成加速度。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">1. </font>****<font style="color:rgba(0, 0, 0, 0.9);">技术突破：</font>**<font style="color:rgba(0, 0, 0, 0.9);">开源模型的迅速成熟降低了门槛，推理成本呈断崖式下降，多模态和大小模型的协同拓宽边界。这让 Agent 不再是</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">概念验证</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">，而是可以规模化落地。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">2. </font>****<font style="color:rgba(0, 0, 0, 0.9);">政策引导：</font>**<font style="color:rgba(0, 0, 0, 0.9);">中国“十四五”明确把 AI 纳入新基建，国务院“人工智能+行动意见”为中国 AI 产业指明方向；美国、欧盟也在同步发力，形成全球共振。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">3. </font>****<font style="color:rgba(0, 0, 0, 0.9);">市场需求：</font>**<font style="color:rgba(0, 0, 0, 0.9);">企业端急需提效降本，消费端渴望更沉浸的体验，资本市场面向 AI 赛道持续加码，大量 AI 创业公司涌现。</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01bzF5ow1K5nulL2MwU_!!6000000001113-0-tps-2560-1440.jpg)

<font style="color:rgba(0, 0, 0, 0.9);">技术降低门槛，政策扫清障碍，市场反哺研发，形成闭环。算法、算力与场景叠加，</font><font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">从实验室跃迁万千行业，已经势不可挡。</font>

<font style="color:rgba(0, 0, 0, 0.9);">过去十年企业为了拥抱移动互联网浪潮，实现数字化转型，纷纷投入云原生应用的研发；而今天，企业要抓住 </font><font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">的浪潮，实现智能化转型，更需要投入 </font><font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">原生应用的研发，把 </font><font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">的能力融入到自己的核心业务中。</font>

## <font style="color:rgb(0, 128, 255);">AI 原生应用架构</font>
<font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">原生应用是指从架构设计到功能实现均以人工智能技术（</font><font style="color:rgba(0, 0, 0, 0.9);">大模型）为核心驱动力的应用。它将</font><font style="color:rgba(0, 0, 0, 0.9);"> AI </font><font style="color:rgba(0, 0, 0, 0.9);">能力深度嵌入系统底层，通过数据驱动决策、动态模型演化和端到端</font><font style="color:rgba(0, 0, 0, 0.9);"> AI </font><font style="color:rgba(0, 0, 0, 0.9);">流程重构业务逻辑。</font>

<font style="color:rgba(0, 0, 0, 0.9);">和传统应用相比，它带来四方面的根本性变化。</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">第一是交互界面。</font>**<font style="color:rgba(0, 0, 0, 0.9);">过去我们点击按钮、填写表单；现在我们对话、拖拽、上传图像或音频，进行多模态的</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">共创</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">第二是业务逻辑。</font>**<font style="color:rgba(0, 0, 0, 0.9);">过去是规则驱动、静态代码、确定性执行；现在是数据驱动、动态推理、概率性决策，系统可以在不确定中找到更优路径。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">第三是技术栈。</font>**<font style="color:rgba(0, 0, 0, 0.9);">传统的</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">微服务+关键词检索+关系型数据库+CPU</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">的组合，正被</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">Agent 智能体+语义检索+知识图谱+向量数据库+GPU</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">所取代。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">第四是架构哲学。</font>**<font style="color:rgba(0, 0, 0, 0.9);">以前我们用 RPC、消息队列把微服务拼接起来；现在以 Agent 为执行单元，用上下文工程、记忆机制、工具调用来实现自主决策与行动。我们从“流程自动化”迈向“认知自动化”，软件范式从“人适应机器”，转向“机器理解人”。 这场变革不是空中楼阁，它有一条清晰的历史脉络。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN014Kn3Ht1PGPA1dG66u_!!6000000001813-0-tps-2560-1440.jpg)<font style="color:rgba(0, 0, 0, 0.9);">  
</font>

<font style="color:rgba(0, 0, 0, 0.9);">回看传统应用架构的演进，从单体到微服务再到云原生，本质是业务复杂度上升和技术红利出现的合力。早期的单体应用，只要把交易、商品、支付、物流这些核心功能堆在一起就够了。但移动互联网爆发后，业务碎片化、场景多样化，迫使我们用微服务把系统“</font><font style="color:rgba(0, 0, 0, 0.9);">解耦</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">，让不同团队能并行迭代，敏捷开发；海量访问压力需要系统能够灵活弹性扩展；基于云计算提供的弹性基础设施，结合微服务、容器技术、和可观测体系，则让资源调度更智能、故障恢复更自动。那是一条从</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">大泥球</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">走向</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">乐高拼装</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">的道路，也为今天的 </font><font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">原生应用打下了分布式协作的基石。</font>

![](https://img.alicdn.com/imgextra/i2/O1CN017Vqdjp1aYgkFvfWe3_!!6000000003342-2-tps-3820-1223.png)

<font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">应用自身也在沿着一条清晰的路径进化：</font>**<font style="color:rgba(0, 0, 0, 0.9);">从单体的 </font>****<font style="color:rgba(0, 0, 0, 0.9);">Chatbot</font>****<font style="color:rgba(0, 0, 0, 0.9);">，走向分布式的 </font>****<font style="color:rgba(0, 0, 0, 0.9);">Agentic AI</font>****<font style="color:rgba(0, 0, 0, 0.9);">。</font>**

<font style="color:rgba(0, 0, 0, 0.9);">业务层面的驱动力是，从</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">对话</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">走向</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">行动</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">。单体 </font><font style="color:rgba(0, 0, 0, 0.9);">Chatbot </font><font style="color:rgba(0, 0, 0, 0.9);">只能回答问题；而在很多企业里，我们需要 </font><font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">深度参与业务流程，承担企业不同业务模块的职责，不同业务板块有不同的上下文、工具、业务流程，大模型在注意力聚焦的情况下具备更好的准确性，这就推动架构走向多 Agent 协作，每个 Agent 专注于自己的核心能力。比如我们要构建一个全栈 </font><font style="color:rgba(0, 0, 0, 0.9);">Web </font><font style="color:rgba(0, 0, 0, 0.9);">开发平台，支持用户用自然语言构建 </font><font style="color:rgba(0, 0, 0, 0.9);">Web </font><font style="color:rgba(0, 0, 0, 0.9);">应用，</font><font style="color:rgba(0, 0, 0, 0.9);">Agentic AI </font><font style="color:rgba(0, 0, 0, 0.9);">将构建一个</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">数字员工团队</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">，包含开发 </font><font style="color:rgba(0, 0, 0, 0.9);">Agent</font><font style="color:rgba(0, 0, 0, 0.9);">、产品 </font><font style="color:rgba(0, 0, 0, 0.9);">Agent</font><font style="color:rgba(0, 0, 0, 0.9);">、文档 </font><font style="color:rgba(0, 0, 0, 0.9);">Agent</font><font style="color:rgba(0, 0, 0, 0.9);">，多 </font><font style="color:rgba(0, 0, 0, 0.9);">Agent </font><font style="color:rgba(0, 0, 0, 0.9);">自动协作，最终完成构建 </font><font style="color:rgba(0, 0, 0, 0.9);">Web </font><font style="color:rgba(0, 0, 0, 0.9);">应用的完整任务。</font>

<font style="color:rgba(0, 0, 0, 0.9);">技术层面，这种升级依赖几个关键突破：模型从理解到规划，从“会答”到“会想”（比如深度思考模式、ReAct）；Agent 范式形成统一认知，它是一个具备“感知—决策—执行”能力的实体，记忆层存储历史经验（向量库+KV），决策层由大模型驱动进行规划（ReAct、思维链），行动层通过工具调用与多 Agent 协作来完成；关键标准也在逐渐形成，如 MCP 让智能体工具调用有了通用标准，A2A 把智能体分布式协作也定义了统一语言；而云原生能力，让这些智能体可以充分利用云的弹性能力，按需弹性、按量付费。</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01yHi8Zt20t0K8DsLa5_!!6000000006906-2-tps-3820-1223.png)

<font style="color:rgba(0, 0, 0, 0.9);">但是，要构建企业级 </font><font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">应用，远不止</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">会调几个大模型 </font><font style="color:rgba(0, 0, 0, 0.9);">API</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">这么简单，将面临以下几个挑战。</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">第一类是开发效率。</font>**<font style="color:rgba(0, 0, 0, 0.9);">今天做一个像样的 Agent，往往要手工编织记忆、决策、工具调用的细节，缺少开箱即用的框架和工具，开发效率不高。更不用说随着业务发展，AI 应用持续扩展业务能力，如何实现业务敏捷迭代也是个难题。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">第二类是集成。</font>**<font style="color:rgba(0, 0, 0, 0.9);">要提升模型准确性以及业务深度融合，不可避免要采用上下文工程技术，引入 </font><font style="color:rgba(0, 0, 0, 0.9);">RAG </font><font style="color:rgba(0, 0, 0, 0.9);">架构。</font><font style="color:rgba(0, 0, 0, 0.9);">RAG </font><font style="color:rgba(0, 0, 0, 0.9);">架构往往涉及多源数据接入，数据 </font><font style="color:rgba(0, 0, 0, 0.9);">ETL</font><font style="color:rgba(0, 0, 0, 0.9);">。要构建实时可用的企业知识库，将面对异构系统对接、数据治理等复杂工程。更别提如何让全新的 </font><font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">应用和存量的传统系统交互集成，如何将存量系统纳入 </font><font style="color:rgba(0, 0, 0, 0.9);">Agent</font><font style="color:rgba(0, 0, 0, 0.9);">、</font><font style="color:rgba(0, 0, 0, 0.9);">MCP </font><font style="color:rgba(0, 0, 0, 0.9);">的集成体系。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">第三类是稳定运行和持续优化。</font>**<font style="color:rgba(0, 0, 0, 0.9);">多 </font><font style="color:rgba(0, 0, 0, 0.9);">Agent </font><font style="color:rgba(0, 0, 0, 0.9);">协作带来复杂的调用链路，推理 </font><font style="color:rgba(0, 0, 0, 0.9);">Tokens </font><font style="color:rgba(0, 0, 0, 0.9);">流量波动大，延迟不可控，传统体系难以灵活弹性扩展；稳定与安全也充满风险</font><font style="color:rgba(0, 0, 0, 0.9);">——</font><font style="color:rgba(0, 0, 0, 0.9);">模型幻觉可能造成决策偏差，工具调用可能越权，</font><font style="color:rgba(0, 0, 0, 0.9);">A2A </font><font style="color:rgba(0, 0, 0, 0.9);">通信链路里可能泄露敏感数据；更糟糕的是，可观测性不足，一旦出现故障，你将在 10 个 Agent 协同的链路里找不到故障点。没有评估体系，很难衡量 Agent 的决策质量；数据质量会随着业务环境变化而衰减；模型一旦迭代，推理行为也可能漂移，今天还很稳的客服 Agent，明天可能输出不合规的内容。</font>

![](https://img.alicdn.com/imgextra/i3/O1CN015soZuk22aLQ0Buow1_!!6000000007136-0-tps-2560-1440.jpg)

<font style="color:rgba(0, 0, 0, 0.9);">而这些问题，单靠大模型内置的能力解决不了，它们需要一整套工程化、平台化的</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">中间层</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">来承接。</font>

<font style="color:rgba(0, 0, 0, 0.9);">而这个中间层便是 </font><font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">中间件的定位。它在 </font><font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">应用与大模型之间，承担三件事。第一是连接与集成：把大模型、工具链、数据存储、微服务这些碎片打通，让 </font><font style="color:rgba(0, 0, 0, 0.9);">Agent </font><font style="color:rgba(0, 0, 0, 0.9);">可以无缝调用知识、使用工具、对接业务。第二是能力抽象：把 </font><font style="color:rgba(0, 0, 0, 0.9);">A2A </font><font style="color:rgba(0, 0, 0, 0.9);">通信、状态管理、数据集成这些</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">非业务共性能力</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">封装起来，屏蔽底层复杂度，让开发者聚焦业务。第三是工程化支撑：提供可观测、安全治理、弹性扩缩容等企业级能力，保障生产环境的稳定性与高效运维。</font>

<font style="color:rgba(0, 0, 0, 0.9);">为什么说它是规模化落地的最后一块拼图？很简单。它能帮你突破 </font><font style="color:rgba(0, 0, 0, 0.9);">POC </font><font style="color:rgba(0, 0, 0, 0.9);">陷阱</font><font style="color:rgba(0, 0, 0, 0.9);">——</font><font style="color:rgba(0, 0, 0, 0.9);">很多原型之所以上不了线，不是因为算法不行，而是工程体系不行。换句话说，</font>**<font style="color:rgb(0, 128, 255);">AI </font>****<font style="color:rgb(0, 128, 255);">中间件是企业级 </font>****<font style="color:rgb(0, 128, 255);">AI </font>****<font style="color:rgb(0, 128, 255);">应用的</font>****<font style="color:rgb(0, 128, 255);">“</font>****<font style="color:rgb(0, 128, 255);">操作系统</font>****<font style="color:rgb(0, 128, 255);">”</font>****<font style="color:rgb(0, 128, 255);">。它把 </font>****<font style="color:rgb(0, 128, 255);">Agent </font>****<font style="color:rgb(0, 128, 255);">从</font>****<font style="color:rgb(0, 128, 255);">“</font>****<font style="color:rgb(0, 128, 255);">技术概念</font>****<font style="color:rgb(0, 128, 255);">”</font>****<font style="color:rgb(0, 128, 255);">变成</font>****<font style="color:rgb(0, 128, 255);">“</font>****<font style="color:rgb(0, 128, 255);">真正的生产力引擎</font>****<font style="color:rgb(0, 128, 255);">”</font>****<font style="color:rgb(0, 128, 255);">，打通落地的最后一公里。</font>**

![](https://img.alicdn.com/imgextra/i1/O1CN01pniNya26YkVCRYHJU_!!6000000007674-0-tps-2560-1440.jpg)

## <font style="color:rgb(0, 128, 255);">阿里云 AI 中间件全新发布</font>
**<font style="color:rgb(0, 128, 255);">为了应对规模化落地企业级 </font>****<font style="color:rgb(0, 128, 255);">AI </font>****<font style="color:rgb(0, 128, 255);">应用的挑战，我们发布了全新的阿里云 </font>****<font style="color:rgb(0, 128, 255);">AI </font>****<font style="color:rgb(0, 128, 255);">中间件，</font>**<font style="color:rgba(0, 0, 0, 0.9);">它是一个面向分布式多 </font><font style="color:rgba(0, 0, 0, 0.9);">Agent </font><font style="color:rgba(0, 0, 0, 0.9);">架构的基座，核心技术全面开源，全面拥抱行业标准。</font>

<font style="color:rgba(0, 0, 0, 0.9);">它包括：AgentScope-Java（兼容 Spring AI Alibaba 生态），AI MQ（基于Apache RocketMQ 的 AI 能力升级），AI 网关 Higress，AI 注册与配置中心 Nacos，以及覆盖模型与算力的 AI 可观测体系。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">我们的目标是：</font>**<font style="color:rgba(0, 0, 0, 0.9);">把复杂留下，把标准、能力、工具开放出来，让企业不用重复从头搭架子。</font>

![](https://img.alicdn.com/imgextra/i2/O1CN01K3wPAG1PCHb04xNI0_!!6000000001804-0-tps-2560-1440.jpg)

<font style="color:rgba(0, 0, 0, 0.9);background-color:rgb(242, 98, 46);">  
</font>

#### <font style="color:rgba(0, 0, 0, 0.9);">AI 编程框架-AgentScope</font>
<font style="color:rgba(0, 0, 0, 0.9);">首先是 AI 编程框架，Spring AI Alibaba 内核正式升级为 AgentScope-Java，这是 Java 生态拥抱 Agentic AI 的重要里程碑。对数百万 Java 开发者来说，一套熟悉的开发范式，就能构建企业级智能体应用。</font>**<font style="color:rgba(0, 0, 0, 0.9);">AgentScope-Java 为 Java 开发者提供最低学习门槛的 AI 开发框架。</font>**

<font style="color:rgba(0, 0, 0, 0.9);">它的架构有两层，在核心编排层，提供 Agentic API，开发者能够声明式地定义 Agent 的记忆、决策、工具调用等能力，代码复用明显提升；原生支持 MCP 协议，便于扩展工具与伙伴智能体；支持流式通信，端到端的交互延迟显著降低；支持 Human-in-the-loop，把关键决策交回给人审核。在安全运行时层面，它提供沙箱隔离，阻断越权工具调用；提供上下文管理，动态维护短期状态与长期记忆；并且原生支持 A2A，实现分布式多 Agent 自动编排与协作。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01kTNSl427wqxkioMcJ_!!6000000007862-0-tps-2560-1440.jpg)

<font style="color:rgba(0, 0, 0, 0.9);background-color:rgb(242, 98, 46);">  
</font>

#### <font style="color:rgba(0, 0, 0, 0.9);">AI MQ-ApsaraMQ</font>
<font style="color:rgba(0, 0, 0, 0.9);">再说 AI 通信与集成的</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">中枢</font><font style="color:rgba(0, 0, 0, 0.9);">”——</font><font style="color:rgba(0, 0, 0, 0.9);">AI MQ。传统消息队列是为交易类、日志类场景设计的，到了 Agent 时代，它们很多特性不够用，因此我们对 ApsaraMQ 面向 Agentic AI 做了全方位能力升级，ApsaraMQ 是基于 Apache RocketMQ 构建的云原生消息服务。</font>

<font style="color:rgba(0, 0, 0, 0.9);">在消息存储引擎（Apache RocketMQ 内核）方面，</font>**<font style="color:rgba(0, 0, 0, 0.9);">支持百万级 Topic 资源管理、百万级队列存储、百万级订阅分发。</font>**

<font style="color:rgba(0, 0, 0, 0.9);">得益于消息存储引擎的增强，我们推出了面向 AI 场景的消息模型 LiteTopic，它具备轻量资源、有状态异步通信的特性，可实现 AI 多轮对话 Session 保持、Session 级顺序流式输出、Agent 2 Agent 的可靠通信、多模态大消息体（50MB 以上）。提供面向 AI 稀缺算力的消费调度模式，包括优先级、定速、权重等模式，最大化资源有效利用率。提供 AI 数据集成，支持多数据源实时构建知识库，构建实时 RAG 架构；支持事件流异步推理，批量异步推理；支持流式 AI ETL 处理。</font>

![](https://img.alicdn.com/imgextra/i3/O1CN01oQXMpr1ESo72CkvFA_!!6000000000351-0-tps-2560-1440.jpg)

<font style="color:rgba(0, 0, 0, 0.9);">聊到分布式多 Agent 架构，就必须说 A2A 通信机制。目前在分布式多 Agent 通信实现上，一开始往往采用同步调用的方式，一旦业务继续发展，Agent 之间的交互、依赖关系也会变得更加复杂。同步调用的模式将面临多重痛点：</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">多 Agent 多次 LLM 调用，全同步调用延迟高，降低客户体验。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">上下游 Agent 吞吐量难以完全对齐，易出现部分 Agent 流量过载、雪崩。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">任务涉及多</font><font style="color:rgba(0, 0, 0, 0.9);"> Agent </font><font style="color:rgba(0, 0, 0, 0.9);">协作完成，单点</font><font style="color:rgba(0, 0, 0, 0.9);"> Agent </font><font style="color:rgba(0, 0, 0, 0.9);">失败，没有可靠重试，导致任务整体失败，浪费中间过程的算力资源多。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">Agent </font><font style="color:rgba(0, 0, 0, 0.9);">调用同步强依赖，如串联电路，可用性降低。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">在算力资源不足的情况下，</font><font style="color:rgba(0, 0, 0, 0.9);">Agent </font><font style="color:rgba(0, 0, 0, 0.9);">无法实现任务优先级处理。</font>

<font style="color:rgba(0, 0, 0, 0.9);">基于 </font><font style="color:rgba(0, 0, 0, 0.9);">AI MQ </font><font style="color:rgba(0, 0, 0, 0.9);">的全新特性 </font><font style="color:rgba(0, 0, 0, 0.9);">LiteTopic </font><font style="color:rgba(0, 0, 0, 0.9);">实现 </font><font style="color:rgba(0, 0, 0, 0.9);">A2A </font><font style="color:rgba(0, 0, 0, 0.9);">可靠异步通信模式则可以免除这些痛点，让系统具备更好的可扩展性：</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">主</font><font style="color:rgba(0, 0, 0, 0.9);"> Agent </font><font style="color:rgba(0, 0, 0, 0.9);">任务规划完成，可异步并发请求多个 </font><font style="color:rgba(0, 0, 0, 0.9);">Agent</font><font style="color:rgba(0, 0, 0, 0.9);">，缩短任务完成时间。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">Agent </font><font style="color:rgba(0, 0, 0, 0.9);">解除调用强依赖和吞吐量强依赖，可用性提升。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">Agent 通信的请求和处理结果均持久化到 MQ，具备 checkpoint 能力，基于 MQ 的可靠重试，无中间资源浪费。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">有限资源下，</font><font style="color:rgba(0, 0, 0, 0.9);">Agent </font><font style="color:rgba(0, 0, 0, 0.9);">支持按优先级处理任务，比如优先处理付费用户。</font>
+ <font style="color:rgba(0, 0, 0, 0.9);">基于</font><font style="color:rgba(0, 0, 0, 0.9);"> 1 </font><font style="color:rgba(0, 0, 0, 0.9);">对多的发布订阅通信模式，系统具备良好的扩展能力，可以异步构建历史对话存储、</font><font style="color:rgba(0, 0, 0, 0.9);">Agent </font><font style="color:rgba(0, 0, 0, 0.9);">记忆等。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01UK8gyx1lJ51LHLR8d_!!6000000004797-0-tps-2560-1440.jpg)

<font style="color:rgba(0, 0, 0, 0.9);background-color:rgb(242, 98, 46);">  
</font>

#### <font style="color:rgba(0, 0, 0, 0.9);">AI 网关-Higress</font>
<font style="color:rgba(0, 0, 0, 0.9);">第三块是 AI 网关 Higress。</font>**<font style="color:rgba(0, 0, 0, 0.9);">它提供统一接入与管理</font>**<font style="color:rgba(0, 0, 0, 0.9);">，能同时接入不同的大模型、MCP 服务、Agent，做协议兼容与流量调度，实现智能路由与负载均衡。在 LLM 层，统一调度通用大模型与垂类小模型，支持语义缓存和灾备降级；在 MCP 层，支持通过协议转换复用存量微服务，让企业多年积累的数字化资产快速转换为 AI Agent 的工具；在 Agent 层，提供 REST 到 A2A 的协议桥接，打通传统微服务与智能体协作。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">它也具备企业级安全治理能力</font>**<font style="color:rgba(0, 0, 0, 0.9);">，包括 </font><font style="color:rgba(0, 0, 0, 0.9);">Token </font><font style="color:rgba(0, 0, 0, 0.9);">限流、敏感信息过滤、</font><font style="color:rgba(0, 0, 0, 0.9);">WebSocket </font><font style="color:rgba(0, 0, 0, 0.9);">无损变更、零信任鉴权，保障服务稳定与数据安全。</font>

<font style="color:rgba(0, 0, 0, 0.9);">最新版的 </font>**<font style="color:rgba(0, 0, 0, 0.9);">Higress 还发布了 AI 开放平台 </font>****<font style="color:rgba(0, 0, 0, 0.9);">HiMarket</font>**<font style="color:rgba(0, 0, 0, 0.9);">，让企业可以把自有 Agent/MCP 服务标准化发布，按调用量进行精细化运营。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01G2Cedm1vA3N9OUXZ5_!!6000000006131-0-tps-2560-1440.jpg)

<font style="color:rgba(0, 0, 0, 0.9);background-color:rgb(242, 98, 46);">  
</font>

#### <font style="color:rgba(0, 0, 0, 0.9);">AI 注册/配置中心-Nacos</font>
**<font style="color:rgba(0, 0, 0, 0.9);">第四块是 AI 注册和配置中心 Nacos。</font>**<font style="color:rgba(0, 0, 0, 0.9);">在微服务时代，Nacos 国内市场占有率高达 70% 以上，包含 Azure 在内的海内外主流云厂商都提供了 Nacos 托管产品。面向 AI 时代的今天，Nacos 3.1.0 版本重磅发布，围绕 AI Agent 解决 AI A2A 场景和 AI Tools 场景的问题。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">在 AI 工具方面，</font>**<font style="color:rgba(0, 0, 0, 0.9);">Nacos 支持了 MCP Registry 官方协议，无需任何代码改造，就能将传统应用快速转变为 MCP Server 并动态统一管理。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">在多 Agent 协作方面，</font>**<font style="color:rgba(0, 0, 0, 0.9);">Nacos 是首个支持 A2A 协议的注册中心。Agent 可以将描述自身能力的 AgentCard 注册到 Nacos，其他 Agent 只需填写 Nacos 地址，即可实现分布式多 Agent 的能力编排，让 Agent 的分布式协作，像普通应用一样的顺滑和稳定。</font>

**<font style="color:rgba(0, 0, 0, 0.9);">在配置管理方面，</font>**<font style="color:rgba(0, 0, 0, 0.9);">AI 时代下，API Key 等凭证的安全至关重要。Nacos 提供动态加密配置能力，支持敏感数据的加密存储与安全推送，有效保障 AI 资产的安全性。此外，基于 Nacos 的动态配置推送能力，还能实现 Agent 能力的动态更新</font><font style="color:rgba(0, 0, 0, 0.9);">——</font><font style="color:rgba(0, 0, 0, 0.9);">无需重新部署，即可灵活调整 Agent 运行时的配置。</font>

![](https://img.alicdn.com/imgextra/i2/O1CN019aTsw31ruzV33KYZd_!!6000000005692-0-tps-2560-1440.jpg)

<font style="color:rgba(0, 0, 0, 0.9);background-color:rgb(242, 98, 46);">  
</font>

#### <font style="color:rgba(0, 0, 0, 0.9);">AI 可观测</font>
<font style="color:rgba(0, 0, 0, 0.9);">第五块是</font><font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">可观测。做 </font><font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">应用的同学都有体会：传统可观测体系，面对大模型与智能体协作，往往力不从心。我们做的是一次</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">从 </font><font style="color:rgba(0, 0, 0, 0.9);">IaaS </font><font style="color:rgba(0, 0, 0, 0.9);">到 </font><font style="color:rgba(0, 0, 0, 0.9);">MaaS</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">的全栈、一体化进化，目标是为企业提供一个智算应用的</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">上帝视角</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">。</font><font style="color:rgba(0, 0, 0, 0.9);">这个体系有四根支柱：</font>

+ **<font style="color:rgba(0, 0, 0, 0.9);">端到端诊断：</font>**<font style="color:rgba(0, 0, 0, 0.9);">对主流 </font><font style="color:rgba(0, 0, 0, 0.9);">Agent </font><font style="color:rgba(0, 0, 0, 0.9);">与应用框架实现无侵入追踪，不管是复杂的 </font><font style="color:rgba(0, 0, 0, 0.9);">RAG</font><font style="color:rgba(0, 0, 0, 0.9);">，还是多 </font><font style="color:rgba(0, 0, 0, 0.9);">Agent </font><font style="color:rgba(0, 0, 0, 0.9);">协作，都能把调用链清清楚楚地呈现出来，帮助快速定位故障与性能瓶颈。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">全栈智算监控：</font>**<font style="color:rgba(0, 0, 0, 0.9);">从底层 </font><font style="color:rgba(0, 0, 0, 0.9);">GPU</font><font style="color:rgba(0, 0, 0, 0.9);">、网络、存储，到容器编排，再到模型推理、训练，以及上层应用与智能体交互，建立多维度的指标与日志体系，实时感知全局健康度。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">精细成本管理：</font>**<font style="color:rgba(0, 0, 0, 0.9);">对 </font><font style="color:rgba(0, 0, 0, 0.9);">Token </font><font style="color:rgba(0, 0, 0, 0.9);">消耗、</font><font style="color:rgba(0, 0, 0, 0.9);">GPU </font><font style="color:rgba(0, 0, 0, 0.9);">利用率做多维分析，与网关联动支持预算限额、访问限流、智能路由，帮助企业在探索 </font><font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">价值的同时，把成本效益做到最好。</font>
+ **<font style="color:rgba(0, 0, 0, 0.9);">质量与安全评估：</font>**<font style="color:rgba(0, 0, 0, 0.9);">覆盖从输入、规划到输出的全流程，自动化评估语义准确性、内容质量、偏见与安全风险，为上线运行提供</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">持续体检</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">，让输出更安全、更可控、更合规。</font>

![](https://img.alicdn.com/imgextra/i1/O1CN01t3iqxt1PPZ59FNI3e_!!6000000001833-0-tps-2560-1440.jpg)

## <font style="color:rgb(0, 128, 255);">展望</font>
<font style="color:rgba(0, 0, 0, 0.9);">AI </font><font style="color:rgba(0, 0, 0, 0.9);">从来不是一个单点技术，而是一张系统工程的</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">网</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">。大模型是大脑，工具是四肢，数据是血液，算力是肌肉，而中间件，是把这一切组织起来的</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">神经系统</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">和</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">骨架</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">。</font>**<font style="color:rgba(0, 0, 0, 0.9);">阿里云 AI 中间件核心技术目前已全面开源，包括 Nacos、Higress、Apache RocketMQ、AgentScope-Java 等等，</font>**<font style="color:rgba(0, 0, 0, 0.9);">未来也将持续围绕开源生态和社区开发者一起共建、共同成长。我们相信，只有把标准和能力开放出来，行业才会更快地形成</font><font style="color:rgba(0, 0, 0, 0.9);">“</font><font style="color:rgba(0, 0, 0, 0.9);">共识与共用</font><font style="color:rgba(0, 0, 0, 0.9);">”</font><font style="color:rgba(0, 0, 0, 0.9);">，企业才会更专注于业务创新，少做重复劳动。我们愿意和用户、社区一起，推动下一代 AI 基础设施的标准化、工程化。</font>

<font style="color:rgba(0, 0, 0, 0.9);">未来两三年，我们将见证越来越多的企业，从一个个“单体 Chatbot”，走向一个个“可协作、可演进、可闭环”的数字员工团队；我们也将见证 AI 在生产线、仓储、金融风控、客服中台、研发协作等场景的落地，真正带来效率、质量与体验的跃迁。</font>


