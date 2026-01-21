---
title: "定义 AI 时代消息引擎，ApacheRocketMQ 荣获 InfoQ“2025 AI 开源明星项目”"
description: "定义 AI 时代消息引擎，ApacheRocketMQ 荣获 InfoQ“2025 AI 开源明星项目”"
date: "2026-01-21"
category: "announcement"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

<font style="color:rgba(0, 0, 0, 0.9);">12 月 19 日，由 InfoQ 极客传媒与模力工场联合发起的“2025 中国技术力量榜单”评选结果正式揭晓，</font>**<font style="color:rgb(0, 128, 255);">Apache RocketMQ</font>**<font style="color:rgba(0, 0, 0, 0.9);"> 凭借其在 AI 时代的创新性突破——</font>**<font style="color:rgb(0, 128, 255);">面向 AI 应用的事件驱动架构解决方案</font>**<font style="color:rgba(0, 0, 0, 0.9);">，从众多参选项目中脱颖而出，成功斩获</font>**<font style="color:rgba(0, 0, 0, 0.9);">“AI 开源明星项目”</font>**<font style="color:rgba(0, 0, 0, 0.9);">权威奖项。该奖项标志着业界对</font>**<font style="color:rgba(0, 0, 0, 0.9);"> Apache RocketMQ 从传统消息中间件向 AI 时代消息引擎演进</font>**<font style="color:rgba(0, 0, 0, 0.9);">的技术领导力与行业影响力的高度认可。</font>

![](https://img.alicdn.com/imgextra/i2/O1CN01q5KPKO1EkfaJTGynM_!!6000000000390-2-tps-1080-1920.png)

<font style="color:rgba(0, 0, 0, 0.9);">  
</font>

<font style="color:rgba(0, 0, 0, 0.9);">随着 AI 技术重塑应用架构，传统的“服务连接”模式正向“智能协同”跃迁，对底层通信基础设施提出了前所未有的挑战。为精准应对这一范式转变，Apache RocketMQ 前瞻性地完成了</font><font style="color:rgba(0, 0, 0, 0.9);">战略升级</font><font style="color:rgba(0, 0, 0, 0.9);">，进化为专为 AI 时代打造的消息引擎。其以</font>**<font style="color:rgba(0, 0, 0, 0.9);">轻量级通信模型 LiteTopic</font>**<font style="color:rgba(0, 0, 0, 0.9);"> 为核心的创新特性，为海量长时会话（Session）、多智能体（Multi-Agent）系统及大规模 AI 任务调度等场景提供了高效、可靠的事件驱动架构解决方案。</font>

<font style="color:rgba(0, 0, 0, 0.9);">  
</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01bis2r61zxIRdyDqbW_!!6000000006780-2-tps-1080-500.png)

<font style="color:rgba(0, 0, 0, 0.9);">  
</font>

## <font style="color:rgba(0, 0, 0, 0.9);">Apache RocketMQ for AI 核心价值解读</font>
1. **<font style="color:rgba(0, 0, 0, 0.9);">多智能体异步通信，破解协同难题</font>**

<font style="color:rgba(0, 0, 0, 0.9);">针对多智能体应用中普遍存在的长耗时调用阻塞和协作扩展性问题，RocketMQ 的 LiteTopic 模型以其百万级轻量资源创建、自动化生命周期管理、细粒度订阅管理及顺序性保障，为 Agent 之间提供了高效、有序的异步通信机制。  
</font>![](https://img.alicdn.com/imgextra/i4/O1CN01F1tgXL1XV4nctSM1C_!!6000000002928-2-tps-1080-464.png)

<font style="color:rgba(0, 0, 0, 0.9);">  
</font>

2. **<font style="color:rgba(0, 0, 0, 0.9);">智能任务调度，最大化 AI 算力价值</font>**

<font style="color:rgba(0, 0, 0, 0.9);">面对稀缺的 AI 算力，Apache RocketMQ 作为前端请求与后端算力服务之间的缓冲层，通过流量整形平滑请求洪峰，通过消息优先级将宝贵算力优先分配给高价值任务，并通过消费者限流保障核心服务的稳定性，实现算力价值最大化。  
</font>![](https://img.alicdn.com/imgextra/i4/O1CN010AAax21bglMwNY8Zu_!!6000000003495-2-tps-1080-345.png)

<font style="color:rgba(0, 0, 0, 0.9);">  
</font>

3. **<font style="color:rgba(0, 0, 0, 0.9);">无状态、高可靠的分布式会话管理</font>**

<font style="color:rgba(0, 0, 0, 0.9);">Apache RocketMQ 动态为每个会话创建专属队列（LiteTopic），以连续消息流完整保存上下文，从而实现上层应用的“无状态化”，极大简化开发。通过顺序保障与排他消费机制，它能严格确保会话上下文的完整性与一致性，并以极低成本实现了生产级的会话续传与恢复，同时原生支持 AI 场景下的大规模数据负载传输。  
</font>![](https://img.alicdn.com/imgextra/i2/O1CN01VZdZX91wJ2mwg0ncf_!!6000000006286-2-tps-1080-348.png)

<font style="color:rgba(0, 0, 0, 0.9);">  
</font>

<font style="color:rgba(0, 0, 0, 0.9);">目前，Apache RocketMQ for AI 的核心特性已在阿里云云消息队列 RocketMQ 版产品中发布，并在阿里巴巴集团内部，以及阿里云大模型服务平台百炼、通义灵码等产品中经过了大规模生产环境验证，展现出卓越的成熟度与可靠性。</font>

<font style="color:rgba(0, 0, 0, 0.9);"></font>

<font style="color:rgba(0, 0, 0, 0.9);">值得一提的是，Apache RocketMQ 与本次同获“AI 开源明星项目”的阿里巴巴开源智能体开发框架 AgentScope 深度集成，联合打造</font>**<font style="color:rgba(0, 0, 0, 0.9);">企业级、高可靠的 A2A（Agent-to-Agent）智能体通信基座</font>**<font style="color:rgba(0, 0, 0, 0.9);">，为开发者构建复杂多智能体应用提供了开箱即用的解决方案。  
</font>

<font style="color:rgba(0, 0, 0, 0.9);">我们相信，开放与协作是推动 AI 技术普惠的基石。Apache RocketMQ for AI 的部分核心代码已在社区开源，我们诚邀全球开发者体验、交流与共建。  
</font>

+ <font style="color:rgba(0, 0, 0, 0.9);">项目地址：基于 RocketMQ 实现的 A2A 通信 RocketMQTransport 部分代码现已开源</font><u><font style="color:rgba(0, 0, 0, 0.9);"> </font></u><u><font style="color:rgba(0, 0, 0, 0.9);">https://github.com/apache/rocketmq-a2a</font></u>
+ <font style="color:rgba(0, 0, 0, 0.9);">免费体验：“通过 RocketMQ 实现多智能体异步通信” </font><u><font style="color:rgba(0, 0, 0, 0.9);">https://www.aliyun.com/solution/tech-solution/rocketmq-for-multi-agent-communication</font></u>
+ <font style="color:rgba(0, 0, 0, 0.9);">社区交流：欢迎钉钉扫码或搜索群号 110085036316，加入 RocketMQ for AI 用户交流群。</font>

<font style="color:rgba(0, 0, 0, 0.9);">  
</font>

![](https://img.alicdn.com/imgextra/i4/O1CN01vmnXe61Q74jTiXJd3_!!6000000001928-2-tps-443-443.png)

<font style="color:rgba(0, 0, 0, 0.9);">  
</font>

<font style="color:rgba(0, 0, 0, 0.9);">展望未来，Apache RocketMQ 社区将持续深耕 AI 领域，与更多生态伙伴携手，共建智能时代的数字新基建，并将更多经过验证的优秀方案回馈给开源社区。</font>


