---
title: "Apache RocketMQ 源码解析 —— POP 消费模式逻辑介绍"
description: "Apache RocketMQ 源码解析 —— POP 消费模式逻辑介绍"
date: "2025-05-29"
category: "article"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

# 一、背景
在RocketMQ 5.0之前，消费有两种方式可以从Broker获取消息，分别为Pull模式和Push模式。

1. Pull模式：消费需要不断的从阻塞队列中获取数据，如果没有数据就等待，这个阻塞队列中的数据由消息拉取线程从Broker拉取消息之后加入的，所以Pull模式下消费需要不断主动从Broker拉取消息。
2. Push模式：需要注册消息监听器，当有消息到达时会通过回调函数进行消息消费，从表面上看就像是Broker主动推送给消费者一样，所以叫做推模式，底层依旧是消费者从Broker拉取数据然后触发回调函数进行消息消费，只不过不需要像Pull模式一样不断判断是否有消息到来。

不过不管是Pull模式还是Push模式，在集群模式下，一个消息队列只能分配给同一个消费组内的某一个消费者进行消费，所以需要进行Rebalance负载均衡为每个消费者分配消息队列之后才可以进行消息消费。 Rebalance的工作是在每个消费者端进行的，消费端负责的工作太多，除了负载均衡还有消费位点管理等功能，如果新增一种语言的支持，就需要重新实现一遍对应的业务逻辑代码。

除此以外，在RocketMQ 5.0以前负载均衡是以消息队列为维度为每个消费者分配的，一个消息队列只能分给组内一个消费者消费，所以会存在以下问题：

（1）队列一次只能分给组内一个消费者消费，扩展能力有限。

（2）消息队列数量与消费者数量比例不均衡时，可能会导致某些消费者没有消息队列可以分配或者某些消费者承担过多的消息队列，分配不均匀； 

（3）如果某个消费者hang住，会导致分配到该消费者的消息队列中的消息无法消费，导致消息积压；

在RocketMQ 5.0增加了Pop模式消费，将负载均衡、消费位点管理等功能放到了Broker端，减少客户端的负担，使其变得轻量级，并且5.0之后支持消息粒度的负载均衡。当前支持任意时延的定时消息已在开源社区开源，而其支持的任意时延定时特性可以帮助POP进行一定优化。主要优化点在于InvisibleTime的设置。

# 二、原理
POP模式下，消息的消费有如下几个过程：

客户端发起POP消费请求->Broker处理POP请求，返回消息->客户端消费完成，返回ACK->Broker处理Ack请求，在内部进行消费完成的位点更新。

可以用下图表示：

![](https://img.alicdn.com/imgextra/i1/O1CN01J51l991FoAAAua0aj_!!6000000000533-2-tps-1788-1110.png)

# 三、核心代码
## 3.1 核心Processor
### 3.1.1 PopMessageProcessor
该线程用于处理客户端发出的POP请求。在收到POP请求后，将处理该请求，找到待POP的队列：

```java
int index = (PermName.isPriority(topicConfig.getPerm()) ? i : randomQ + i) % queueIdList.size();
int queueId = queueIdList.get(index);
if (brokerController.getBrokerConfig().isMarkTaintWhenPopQueueList()) {
    this.brokerController.getPullMessageProcessor().getPullRebalanceManager()
        .addOrUpdateTaint(requestHeader.getTopic(), requestHeader.getConsumerGroup(), queueId);
}
if (queueId >= 0 && queueId < topicConfig.getReadQueueNums()) {
    restNum = popMsgFromQueue(false, getMessageResult, requestHeader, queueId, restNum, reviveQid, channel, popTime, messageFilter,
                              startOffsetInfo, msgOffsetInfo, orderCountInfo);
}
```

处理的核心方法为`**popMsgFromQueue**`，会从Queue中取出msg，然后在broker中调用`appendCheckPoint`创建CK。

```java
final PopCheckPoint ck = new PopCheckPoint();
ck.setBm(0);
ck.setN((byte) getMessageTmpResult.getMessageMapedList().size());
ck.setPt(popTime);
ck.setIt(invisibleTime);
ck.setSo(offset);
ck.setC(group);
ck.setT(topic);
ck.setQ((byte) queueId);
```

创建时，会从requestHead中取出invisibleTime进行设置。完成CK的基本配置后，会将CK进行存放，有两种存放方式：1. 存入buffer中，2. 作为定时消息存储到commitLog中。

```java
// 创建完CK后，先尝试放入bufferMergeSevice的buffer中，即内存中。
final boolean addBufferSuc = this.popBufferMergeService.addCk(
            ck, reviveQid, -1, getMessageTmpResult.getNextBeginOffset()
        );

// 如果放置成功，直接返回
if (addBufferSuc) {
    return;
}

// 否则，创建一条定时消息，进入磁盘。
this.popBufferMergeService.addCkJustOffset(
    ck, reviveQid, -1, getMessageTmpResult.getNextBeginOffset()
);
```

存储进入磁盘的过程，主要通过`putCkToStore`实现。在这个过程中，必然涉及到该定时消息的定时时间设置，即invisibleTime的设置，这个设置体现在`buildCkMsg`中：

```java
public final MessageExtBrokerInner buildCkMsg(final PopCheckPoint ck, final int reviveQid) {
    MessageExtBrokerInner msgInner = new MessageExtBrokerInner();
    msgInner.setTopic(reviveTopic);
    msgInner.setBody(JSON.toJSONString(ck).getBytes(DataConverter.charset));
    msgInner.setQueueId(reviveQid);
    msgInner.setTags(PopAckConstants.CK_TAG);
    msgInner.setBornTimestamp(System.currentTimeMillis());
    msgInner.setBornHost(this.brokerController.getStoreHost());
    msgInner.setStoreHost(this.brokerController.getStoreHost());
    // 定时时间设置，即invisibleTime的设置。
    msgInner.putUserProperty(MessageConst.PROPERTY_TIMER_DELIVER_MS, String.valueOf(ck.getRt() - PopAckConstants.ackTimeInterval));
    msgInner.getProperties().put(MessageConst.PROPERTY_UNIQ_CLIENT_MESSAGE_ID_KEYIDX, genCkUniqueId(ck));
    msgInner.setPropertiesString(MessageDecoder.messageProperties2String(msgInner.getProperties()));
    return msgInner;
}
```

至此，POP请求的处理逻辑基本完成，在该过程中，完成了对客户端POP请求的响应，待消费消息的返回，并在broker中创建了相对应的CK。

### 3.1.2 AckMessageProcessor
该Processor和`POPMessageProcessor`逻辑有些相似。均处理客户端发送的请求，但不同之处在于，`AckMessageProcessor`不需要返回待消费的消息，主要逻辑在于Broker中已Ck的消息确认。

在请求被处理时，主要工作在于`putAckMessage`方法中：

```java
public PutMessageResult putAckMessage(AckMsg ackMsg, int reviveQid, long deliverMs) {
    if (this.brokerController.getPopMessageProcessor().getPopBufferMergeService().addAk(reviveQid, ackMsg)) {
        return null;
    }
    String reviveTopic = PopAckConstants.REVIVE_TOPIC + this.brokerController.getBrokerConfig().getBrokerClusterName();
    String ackUniqueId = PopMessageProcessor.genAckUniqueId(ackMsg);
    MessageExtBrokerInner ackMessageInner = MessageExtBrokerInner.buildAckInnerMessage(reviveTopic, ackMsg, reviveQid, brokerController.getStoreHost(), deliverMs, ackUniqueId);
    PutMessageResult result = this.brokerController.getMessageStore().putMessage(ackMessageInner);
```

在该过程中，首先会通过`PopBufferMergeService().addAk()`，将Ack消息尝试加入buffer中。该加入过程通过位运算进行。位运算通过`indexOfAck()`以及`markBitCAS`实现：

```java
// 获取CK的Ack位点，并与ackMsg的位点比较
int indexOfAck = point.indexOfAck(ackMsg.getAo());
if (indexOfAck > -1) {
    // 通过位运算，标记指定下标的CK消息被ACK标记。
    markBitCAS(pointWrapper.getBits(), indexOfAck);
}
```

在上述存储完成后，后续通过其它线程进行处理。处理包括CK、AK的存储，以及抵消等操作。主要在3.2节中阐述。

### 3.1.3 ChangeInvisibleTimeProcessor
该Processor主要用于修改消息不可见时间。此外，其中还定义了一些实用的方法，例如CK的buffer存储方法，以及持久化CK的方法。此处不过多展开。

## 3.2 核心Service
### 3.2.1 PopReviveService
该Service被AckMessageProcessor启动。该Service主要对重试队列中的消息进行merge，尝试消除此前没有CK、ACK的消息。

![](https://img.alicdn.com/imgextra/i4/O1CN01hFLELU1CMjb1eOjY0_!!6000000000067-2-tps-3010-1228.png)

在该Service中，会定期消费Revive队列中的CK、ACK对。在其中会维护一个map，将CK和ACK进行存放与检索：

```java
if (PopAckConstants.CK_TAG.equals(messageExt.getTags())) {
        ......
    // 将CK存放入map
    map.put(point.getT() + point.getC() + point.getQ() + point.getSo() + point.getPt(), point);
    point.setRo(messageExt.getQueueOffset());
        ......
}
else if (PopAckConstants.ACK_TAG.equals(messageExt.getTags())) {
    
        ......
        
    // 从map中检索是否有CK
    AckMsg ackMsg = JSON.parseObject(raw, AckMsg.class);
    String mergeKey = ackMsg.getT() + ackMsg.getC() + ackMsg.getQ() + ackMsg.getSo() + ackMsg.getPt();
    PopCheckPoint point = map.get(mergeKey);
        ......
}
```

在完成消息的取出后，会进行revive过程中未ACK消息的重试，以及位点提交：

![](https://img.alicdn.com/imgextra/i1/O1CN019tkC2z1fJdmKDRro8_!!6000000003986-2-tps-1442-362.png)

### 3.2.2 PopBufferMergeService
该Service主要对Buffer中的CK、ACK进行检查。根据检查结果将展开不同的操作。此外，在该Service中还定义了许多实用的CK、ACK操作方法，能够对CK、ACK进行检查以及存储等相关操作。

该Service会启动一个线程，定期执行`scan()`方法。此外，在扫描达到一定次数之后，将执行`scanGarbage()`方法清理数据。

在`scan()`中将会执行如下操作：

    1. 获取buffer中所有键值对，作为CK集合。

```java
Iterator<Map.Entry<String, PopCheckPointWrapper>> iterator = buffer.entrySet().iterator();
while (iterator.hasNext()) {
    Map.Entry<String, PopCheckPointWrapper> entry = iterator.next();
    PopCheckPointWrapper pointWrapper = entry.getValue();
```

    2. 针对每一个CK集合，检查其中的每个CK是否均被ACK，如果已经被ACK，则删除该CK集合。

```java
if ((pointWrapper.isJustOffset() && pointWrapper.isCkStored()) || isCkDone(pointWrapper)
                    || (isCkDoneForFinish(pointWrapper) && pointWrapper.isCkStored())) {
    if (brokerController.getBrokerConfig().isEnablePopLog()) {
        POP_LOGGER.info("[PopBuffer]ck done, {}", pointWrapper);
    }
    iterator.remove();
    counter.decrementAndGet();
    continue;
}
```

    3. 针对未被ACK的CK，将CK、ACK信息进行存储，待一定时间后进行重试。

```java
if (removeCk) {
    // put buffer ak to store
    if (pointWrapper.getReviveQueueOffset() < 0) {
        putCkToStore(pointWrapper, false);
        countCk++;
    }

    if (!pointWrapper.isCkStored()) {
        continue;
    }

    for (byte i = 0; i < point.getN(); i++) {
        // reput buffer ak to store
        if (DataConverter.getBit(pointWrapper.getBits().get(), i)
            && !DataConverter.getBit(pointWrapper.getToStoreBits().get(), i)) {
            if (putAckToStore(pointWrapper, i)) {
                count++;
                markBitCAS(pointWrapper.getToStoreBits(), i);
            }
        }
    }
```

	在上述操作中，CK与ACK能够成对存储，且定时重试。直到消费者发送回成对的ACK、CK请求，这对请求方可抵消，也象征该消息被消费成功。

## 代码详解
可参考如下PPT中的介绍内容：

[POP原理简述.pptx](https://yuque.antfin.com/attachments/lark/0/2025/pptx/231104/1747993819774-f0c68924-01d7-4adc-98fd-88f392a098cc.pptx)

##
