---
id: "question-history-16366"
title: "broker负载怎么看"
date: "2024-07-30"
category: "expertConsultation"
description: "要查看RocketMQ Broker的负载情况，可以采取以下步骤：1. **使用监控工具**：首先，利用如`top`、`dstat`、`iostat`等命令行工具来观察Broker服务器的CPU、内存使用率及磁盘I/O状况。这能帮助你大致判断系统是否处于高负载状态。2. **识别流控警告**：根据提"
---

## 用户问题 ： 
 broker负载怎么看  

---------------
## 专家官方解答 ：

要查看RocketMQ Broker的负载情况，可以采取以下步骤：

1. **使用监控工具**：首先，利用如`top`、`dstat`、`iostat`等命令行工具来观察Broker服务器的CPU、内存使用率及磁盘I/O状况。这能帮助你大致判断系统是否处于高负载状态。

2. **识别流控警告**：根据提供的知识内容，当Broker遇到高负载并启动流控机制时，会抛出不同类型的系统或Broker繁忙错误。监控RocketMQ的日志文件，查找诸如`[REJECTREQUEST]system busy`、`[OVERLOAD]system busy`、`[PC_SYNCHRONIZED]broker busy`、`[PCBUSY_CLEAN_QUEUE]broker busy`、`[TIMEOUT_CLEAN_QUEUE]broker busy`等错误信息。这些错误直接指示了Broker在处理请求时遇到的压力点。

3. **调优配置参数**：如果发现Broker确实存在负载压力，可以考虑调整以下参数以优化性能，根据实际情况调整：
   - `sendMessageThreadPoolNums`和`sendThreadPoolQueueCapacity`：增加消息发送线程池的线程数量和队列容量，以减少请求处理线程池拒绝任务的可能性。
   - `waitTimeMillsInSendQueue`：适当增大发送请求队列中的最大等待时间，避免因等待超时而导致的快速失败。
   - `osPageCacheBusyTimeOutMills`：这个参数的调整需谨慎，增大它可以减少因PageCache繁忙导致的错误，但根本上需要解决的是系统资源瓶颈。
   - `brokerFastFailureEnable`：保持快速失败机制开启，除非有特殊需求，否则不建议关闭。

4. **资源扩容与升级**：如果上述调整无法有效缓解负载，应考虑对Broker集群进行横向扩展，即增加更多的Broker实例来分散消息处理的压力，或者对现有Broker服务器进行硬件升级，提升单机处理能力。

5. **利用Kubernetes部署**：对于在Kubernetes环境下的RocketMQ部署，可以参考[Apache RocketMQ Docker项目中的K8s Helm Chart](https://github.com/apache/rocketmq-docker/tree/master/rocketmq-k8s-helm)或者使用[Apache RocketMQ Operator](https://github.com/apache/rocketmq-operator)，这两种方式都能更灵活地管理和自动扩缩RocketMQ集群，适应动态变化的负载需求。

通过上述步骤，你可以有效地监控和管理RocketMQ Broker的负载情况，及时采取措施应对高负载问题。


<font color="#949494">---------------</font> 


## 参考链接 ：

* 专家经验：broker负载怎么看 
 
 * 专家经验：将rocketmq部署k8s 


 <font color="#949494">---------------</font> 
 


## <font color="#FF0000">答疑服务说明：</font> 

本内容经由技术专家审阅的用户问答的镜像生成，我们提供了<font color="#FF0000">专家智能答疑服务</font>，在<font color="#FF0000">页面的右下的浮窗”专家答疑“</font>。您也可以访问 : [全局专家答疑](https://answer.opensource.alibaba.com/docs/intro) 。 咨询其他产品的的问题

### 反馈
如问答有错漏，欢迎点：[差评](https://ai.nacos.io/user/feedbackByEnhancerGradePOJOID?enhancerGradePOJOId=16371)给我们反馈。
