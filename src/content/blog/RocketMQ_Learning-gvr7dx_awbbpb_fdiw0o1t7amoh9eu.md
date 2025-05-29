---
title: "Apache RocketMQ 源码解析 —— 秒级定时消息介绍"
description: "Apache RocketMQ 源码解析 —— 秒级定时消息介绍"
date: "2025-05-29"
category: "article"
keywords: ["RocketMQ_Learning"]
authors: "heimanba"
---

# 背景
如今rocketmq的应用场景日益拓宽，延时消息的需求也在增加。原本的特定级别延时消息已经不足以支撑rocketmq灵活的使用场景。因此，我们需要一个支持任意时间的延迟消息feature。  
支持任意时间延迟的feature能够让使用者在消息发出时指定其消费时间，在生活与生产中具有非常重要的意义。

# 目标
1. 支持任意时延的延迟消息。
2. 提供延迟消息可靠的存储方式。
3. 保证延迟消息具有可靠的收发性能。
4. 提供延迟消息的可观测性排查能力。

# 架构
## 存储数据结构
本方案主要通过时间轮实现任意时延的定时消息。在此过程中，涉及两个核心的数据结构：TimerLog（存储消息索引）和TimerWheel（时间轮，用于定时消息到时）。

<font style="color:rgb(0, 0, 0);">TimerLog，为本RIP中所设计的定时消息的记录文件，Append Only。每条记录包含一个prev_pos，指向前一条</font>**<font style="color:rgb(0, 0, 0);">定时到同样时刻</font>**<font style="color:rgb(0, 0, 0);">的记录。每条记录的内容可以包含定时消息本身，也可以只包含定时消息的位置信息。每一条记录包含如下信息：</font>

| <font style="color:rgb(0, 0, 0);">名称</font> | <font style="color:rgb(0, 0, 0);">大小</font> | <font style="color:rgb(0, 0, 0);">备注</font> |
| --- | --- | --- |
| <font style="color:rgb(0, 0, 0);">size</font> | <font style="color:rgb(0, 0, 0);">4B</font> | <font style="color:rgb(0, 0, 0);">保存记录的大小</font> |
| <font style="color:rgb(0, 0, 0);">prev_pos</font> | <font style="color:rgb(0, 0, 0);">8B</font> | <font style="color:rgb(0, 0, 0);">前一条记录的位置</font> |
| <font style="color:rgb(0, 0, 0);">next_Pos</font> | <font style="color:rgb(0, 0, 0);">8B</font> | <font style="color:rgb(0, 0, 0);">后一条记录的位置，暂时为-1，作为保留字段</font> |
| <font style="color:rgb(0, 0, 0);">magic</font> | <font style="color:rgb(0, 0, 0);">4B</font> | <font style="color:rgb(0, 0, 0);">magic value</font> |
| <font style="color:rgb(0, 0, 0);">delayed_time</font> | <font style="color:rgb(0, 0, 0);">4B</font> | <font style="color:rgb(0, 0, 0);">该条记录的定时时间</font> |
| <font style="color:rgb(0, 0, 0);">offset_real</font> | <font style="color:rgb(0, 0, 0);">8B</font> | <font style="color:rgb(0, 0, 0);">该条消息在commitLog中的位置</font> |
| size_real | 4B | 该条消息在commitLog中的大小 |
| hash_topic | 4B | 该条消息topic的hash code |
| <font style="color:rgb(0, 0, 0);">varbody</font> | <font style="color:rgb(0, 0, 0);"></font> | <font style="color:rgb(0, 0, 0);">存储可变的body，暂时没有</font> |


<font style="color:rgb(0, 0, 0);">TimerWheel是对时刻表的一种抽象，通常使用数组实现。时刻表上的每一秒，顺序对应到数组中的位置，然后数组循环使用。时间轮的每一格，指向了TimerLog中的对应位置，如果这一格的时间到了，则按TimerLog中的对应位置以及prev_pos位置依次读出每条消息。</font>

<font style="color:rgb(0, 0, 0);">时间轮一格一格向前推进，配合TimerLog，依次读出到期的消息，从而达到定时消息的目的。时间轮的每一格设计如下：</font>

| <font style="color:rgb(0, 0, 0);">delayed_time(8B) 延迟时间</font> | <font style="color:rgb(0, 0, 0);">first_pos(8B) 首条位置</font> | <font style="color:rgb(0, 0, 0);">last_pos(8B) 最后位置</font> | num(4B)消息条数 |
| --- | --- | --- | --- |


上述设计的TimerLog与TimerWheel的协作如下图所示。

![](https://img.alicdn.com/imgextra/i3/O1CN01nzvXOn25vonqVCGKo_!!6000000007589-2-tps-594-347.png)

## pipeline
在存储方面，采用本地文件系统作为可靠的延时消息存储介质。延时消息另存TimerLog文件中。通过时间轮对定时消息进行定位以及存取。针对长时间定时消息，通过消息滚动的方式避免过大的消息存储量。其具体架构如下所示：

![](https://img.alicdn.com/imgextra/i1/O1CN01JILCDW1j5DludVEBe_!!6000000004496-2-tps-3458-2116.png)

从图中可以看出，<font style="color:rgb(0, 0, 0);">共有五个Service分别处理定时消息的放置和存储。</font>工作流如下：

1.  <font style="color:rgb(0, 0, 0);">针对放置定时消息的service，每50ms从commitLog读取指定主题(TIMER_TOPIC)的定时消息。</font>
    1. <font style="color:rgb(0, 0, 0);background-color:#D9D9D9;">TimerEnqueueGetService</font><font style="color:rgb(0, 0, 0);">从commitLog读取得到定时主题的消息，并先将其放入enqueuePutQueue。</font>
    2. <font style="color:rgb(0, 0, 0);">另一个线程</font><font style="color:rgb(0, 0, 0);background-color:#D9D9D9;">TimerEnqueuePutService</font><font style="color:rgb(0, 0, 0);">将其放入timerLog,更新时间轮的存储内容。将该任务放进时间轮的指定位置。</font>
2. <font style="color:rgb(0, 0, 0);">针对取出定时消息的service，每50ms读取下一秒的slot。有三个线程将读取到的消息重新放回commitLog。</font>
    1. <font style="color:rgb(0, 0, 0);">首先，</font><font style="color:rgb(0, 0, 0);background-color:#D9D9D9;">TimerDequeueGetService</font><font style="color:rgb(0, 0, 0);">每50ms读一次下一秒的slot，从timerLog中得到指定的msgs，并放进dequeueGetQueue。</font>
    2. <font style="color:rgb(0, 0, 0);">而后</font><font style="color:rgb(0, 0, 0);background-color:#D9D9D9;">TimerDequeueGetMessageService</font><font style="color:rgb(0, 0, 0);">从dequeueGetQueue中取出msg，并将其放入队列中。该队列为待写入commitLog的队列，dequeuePutQueue。</font>
    3. <font style="color:rgb(0, 0, 0);">最后</font><font style="color:rgb(0, 0, 0);background-color:#D9D9D9;">TimerDequeuePutMessageService</font><font style="color:rgb(0, 0, 0);">将这个queue中的消息取出，若已到期则修改topic，放回commitlog，否则继续按原topic写回CommitLog滚动。</font>

# 代码实现
### <font style="color:#000000;">TimerLog与TimerWheel的协作实现</font>
<font style="color:#000000;">定时消息的核心存储由</font>`<font style="color:#000000;">TimerLog</font>`<font style="color:#000000;">和</font>`<font style="color:#000000;">TimerWheel</font>`<font style="color:#000000;">协同完成。</font>`<font style="color:#000000;">TimerLog</font>`<font style="color:#000000;">作为顺序写入的日志文件，每条记录包含消息在CommitLog中的物理偏移量（</font>`<font style="color:#000000;">offsetPy</font>`<font style="color:#000000;">）和延迟时间（</font>`<font style="color:#000000;">delayed_time</font>`<font style="color:#000000;">）。当消息到达时，</font>`<font style="color:#000000;">TimerEnqueuePutService</font>`<font style="color:#000000;">会将其索引信息追加到</font>`<font style="color:#000000;">TimerLog</font>`<font style="color:#000000;">，并通过</font>`<font style="color:#000000;">prev_pos</font>`<font style="color:#000000;">字段构建链表结构，确保同一时刻的多个消息可被快速遍历。</font>

```java
// TimerLog.java 核心写入逻辑
public long append(byte[] data, int pos, int len) {
    MappedFile mappedFile = this.mappedFileQueue.getLastMappedFile();
    // 处理文件切换：当当前文件剩余空间不足时，填充空白段并创建新文件
    if (len + MIN_BLANK_LEN > mappedFile.getFileSize() - mappedFile.getWrotePosition()) {
        ByteBuffer blankBuffer = ByteBuffer.allocate(MIN_BLANK_LEN);
        blankBuffer.putInt(mappedFile.getFileSize() - mappedFile.getWrotePosition());
        blankBuffer.putLong(0); // prev_pos置空
        blankBuffer.putInt(BLANK_MAGIC_CODE); // 标记空白段
        mappedFile.appendMessage(blankBuffer.array());
        mappedFile = this.mappedFileQueue.getLastMappedFile(0); // 切换到新文件
    }
    // 写入实际数据并返回物理偏移量
    long currPosition = mappedFile.getFileFromOffset() + mappedFile.getWrotePosition();
    mappedFile.appendMessage(data, pos, len);
    return currPosition;
}
```

<font style="color:#000000;">此代码展示了消息追加的核心流程：</font>

1. <font style="color:#000000;">检查当前文件的剩余空间，不足时填充空白段并创建新文件</font>
2. <font style="color:#000000;">将消息索引数据写入内存映射文件</font>
3. <font style="color:#000000;">返回写入位置的全局偏移量，供时间轮记录</font>

---

### <font style="color:#000000;">时间轮槽位管理</font>
`<font style="color:#000000;">TimerWheel</font>`<font style="color:#000000;">通过数组结构管理时间槽位，每个槽位记录该时刻的首尾指针和消息数量。当消息入队时，</font>`<font style="color:#000000;">putSlot</font>`<font style="color:#000000;">方法会更新对应槽位的链表结构：</font>

```java
// TimerWheel.java 槽位更新逻辑
public void putSlot(long timeMs, long firstPos, long lastPos, int num, int magic) {
    localBuffer.get().position(getSlotIndex(timeMs) * Slot.SIZE);
    localBuffer.get().putLong(timeMs / precisionMs); // 标准化时间戳
    localBuffer.get().putLong(firstPos);  // 链表头指针
    localBuffer.get().putLong(lastPos);   // 链表尾指针
    localBuffer.get().putInt(num);        // 当前槽位消息总数
    localBuffer.get().putInt(magic);      // 特殊标记（如滚动/删除）
}
```

<font style="color:#000000;">该方法的实现细节：</font>

+ `<font style="color:#000000;">getSlotIndex(timeMs)</font>`<font style="color:#000000;">将时间戳映射到环形数组的索引</font>
+ <font style="color:#000000;">同时记录首尾指针以实现O(1)复杂度插入</font>

---

### <font style="color:#000000;">消息入队流程</font>
#### **<font style="color:#000000;">TimerEnqueueGetService：消息扫描服务</font>**
<font style="color:#000000;">该服务作为定时消息入口，持续扫描CommitLog中的</font>`<font style="color:#000000;">TIMER_TOPIC</font>`<font style="color:#000000;">消息。其核心逻辑通过</font>`<font style="color:#000000;">enqueue</font>`<font style="color:#000000;">方法实现：</font>

```java
// TimerMessageStore.java
public boolean enqueue(int queueId) {
ConsumeQueueInterface cq = this.messageStore.getConsumeQueue(TIMER_TOPIC, queueId);
ReferredIterator<CqUnit> iterator = cq.iterateFrom(currQueueOffset);

while (iterator.hasNext()) {
    CqUnit cqUnit = iterator.next();
    MessageExt msgExt = getMessageByCommitOffset(cqUnit.getPos(), cqUnit.getSize());

    // 构造定时请求对象
    TimerRequest timerRequest = new TimerRequest(
        cqUnit.getPos(), 
        cqUnit.getSize(),
        Long.parseLong(msgExt.getProperty(TIMER_OUT_MS)),
        System.currentTimeMillis(),
        MAGIC_DEFAULT,
        msgExt
    );

    // 放入入队队列（阻塞式）
    while (!enqueuePutQueue.offer(timerRequest, 3, TimeUnit.SECONDS)) {
        if (!isRunningEnqueue()) return false;
    }
    currQueueOffset++; // 更新消费进度
}
}
```

**<font style="color:#000000;">关键设计点</font>**<font style="color:#000000;">：</font>

1. **<font style="color:#000000;">增量扫描</font>**<font style="color:#000000;">：通过</font>`<font style="color:#000000;">currQueueOffset</font>`<font style="color:#000000;">记录消费位移，避免重复处理</font>
2. **<font style="color:#000000;">消息转换</font>**<font style="color:#000000;">：将ConsumeQueue中的索引转换为包含完整元数据的</font>`<font style="color:#000000;">TimerRequest</font>`

---

#### **<font style="color:#000000;">TimerEnqueuePutService：时间轮写入服务</font>**
<font style="color:#000000;">从队列获取请求后，该服务执行核心的定时逻辑：</font>

```java
// TimerMessageStore.java
public boolean doEnqueue(long offsetPy, int sizePy, long delayedTime, MessageExt messageExt) {
    // 计算目标时间槽位
    Slot slot = timerWheel.getSlot(delayedTime);

    // 构造TimerLog记录
    ByteBuffer buffer = ByteBuffer.allocate(TimerLog.UNIT_SIZE);
    buffer.putLong(slot.lastPos);    // 前驱指针指向原槽位尾
    buffer.putLong(offsetPy);        // CommitLog物理偏移
    buffer.putInt(sizePy);           // 消息大小
    buffer.putLong(delayedTime);     // 精确到毫秒的延迟时间

    // 写入TimerLog并更新时间轮
    long pos = timerLog.append(buffer.array());
    timerWheel.putSlot(delayedTime, slot.firstPos, pos, slot.num + 1);
}
```

**<font style="color:#000000;">写入优化策略</font>**<font style="color:#000000;">：</font>

+ **<font style="color:#000000;">空间预分配</font>**<font style="color:#000000;">：当检测到当前MappedFile剩余空间不足时，自动填充空白段并切换文件</font>
+ **<font style="color:#000000;">链表式存储</font>**<font style="color:#000000;">：通过</font>`<font style="color:#000000;">prev_pos</font>`<font style="color:#000000;">字段构建时间槽位的倒序链表，确保新消息快速插入</font>
+ **<font style="color:#000000;">批量提交</font>**<font style="color:#000000;">：积累多个请求后批量写入，减少文件I/O次数</font>

`<font style="color:#000000;">TimerEnqueuePutService</font>`<font style="color:#000000;">从队列获取消息请求，处理消息滚动逻辑。当检测到延迟超过时间轮窗口时，将消息重新写入并标记为滚动状态：</font>

```java
// TimerMessageStore.java 消息滚动处理
boolean needRoll = delayedTime - tmpWriteTimeMs >= (long) timerRollWindowSlots * precisionMs;
if (needRoll) {
    magic |= MAGIC_ROLL;
    // 调整延迟时间为时间轮窗口中间点，确保滚动后仍有处理时间
    delayedTime = tmpWriteTimeMs + (long) (timerRollWindowSlots / 2) * precisionMs; 
}
```

<font style="color:#000000;">此逻辑的关键设计：</font>

1. <font style="color:#000000;">当延迟时间超过当前时间轮容量时触发滚动</font>
2. <font style="color:#000000;">将消息的</font>`<font style="color:#000000;">delayed_time</font>`<font style="color:#000000;">调整为窗口中间点，避免频繁滚动</font>
3. <font style="color:#000000;">设置</font>`<font style="color:#000000;">MAGIC_ROLL</font>`<font style="color:#000000;">标记，出队时识别滚动消息</font>

---

### <font style="color:#000000;">消息出队处理</font>
#### **<font style="color:#000000;">TimerDequeueGetService：到期扫描服务</font>**
<font style="color:#000000;">该服务以固定频率推进时间指针，触发到期消息处理：</font>

```java
// TimerMessageStore.java
public int dequeue() throws Exception {
// 获取当前时间槽位
Slot slot = timerWheel.getSlot(currReadTimeMs);

// 遍历TimerLog链表
long currPos = slot.lastPos;
while (currPos != -1) {
    SelectMappedBufferResult sbr = timerLog.getTimerMessage(currPos);
    ByteBuffer buf = sbr.getByteBuffer();

    // 解析记录元数据
    long prevPos = buf.getLong();
    long offsetPy = buf.getLong();
    int sizePy = buf.getInt();
    long delayedTime = buf.getLong();

    // 分类处理（普通消息/删除标记）
    if (isDeleteMarker(buf)) {
        deleteMsgStack.add(new TimerRequest(offsetPy, sizePy, delayedTime));
    } else {
        normalMsgStack.addFirst(new TimerRequest(offsetPy, sizePy, delayedTime));
    }
    currPos = prevPos; // 前向遍历链表
}

// 分发到处理队列
splitAndDispatch(normalMsgStack); 
splitAndDispatch(deleteMsgStack);
moveReadTime(); // 推进时间指针
}
```

---

#### **<font style="color:#000000;">TimerDequeuePutMessageService：消息投递服务</font>**
`<font style="color:#000000;">TimerDequeuePutMessageService</font>`<font style="color:#000000;">将到期消息重新写入CommitLog。对于滚动消息，会修改主题属性并增加重试计数：</font>

```java
// TimerMessageStore.java 消息转换逻辑
MessageExtBrokerInner convert(MessageExt messageExt, long enqueueTime, boolean needRoll) {
    if (needRoll) {
        // 增加滚动次数标记
        MessageAccessor.putProperty(messageExt, TIMER_ROLL_TIMES, 
                                    Integer.parseInt(messageExt.getProperty(TIMER_ROLL_TIMES)) + 1 + "");
    }
    // 恢复原始主题和队列ID
    messageInner.setTopic(messageInner.getProperty(MessageConst.PROPERTY_REAL_TOPIC));
    messageInner.setQueueId(Integer.parseInt(
        messageInner.getProperty(MessageConst.PROPERTY_REAL_QUEUE_ID)));
    return messageInner;
}
```

<font style="color:#000000;">此转换过程确保：</font>

+ <font style="color:#000000;">滚动消息保留原始主题信息</font>
+ <font style="color:#000000;">每次滚动增加</font>`<font style="color:#000000;">TIMER_ROLL_TIMES</font>`<font style="color:#000000;">属性</font>

<font style="color:#000000;">该服务最终将到期消息重新注入CommitLog：</font>

```java
// TimerMessageStore.java
public void run() {
    while (!stopped) {
        TimerRequest req = dequeuePutQueue.poll(10, TimeUnit.MILLISECONDS);
        MessageExtBrokerInner innerMsg = convert(req.getMsg(), req.needRoll());

        // 消息重投递逻辑
        int result = doPut(innerMsg, req.needRoll());
        switch (result) {
            case PUT_OK: 
                // 成功：更新监控指标
                timerMetrics.recordDelivery(req.getTopic()); 
                break;
            case PUT_NEED_RETRY:
                // 重试：重新放回队列头部
                dequeuePutQueue.putFirst(req); 
                break;
            case PUT_NO_RETRY:  
                // 丢弃：记录错误日志
                log.warn("Discard undeliverable message:{}", req); 
        }
    }
}
```

---

### <font style="color:#000000;">故障恢复机制</font>
<font style="color:#000000;">系统重启时通过</font>`<font style="color:#000000;">recover</font>`<font style="color:#000000;">方法重建时间轮状态。关键步骤包括遍历</font>`<font style="color:#000000;">TimerLog</font>`<font style="color:#000000;">文件并修正槽位指针：</font>

```java
// TimerMessageStore.java 恢复流程
private long recoverAndRevise(long beginOffset, boolean checkTimerLog) {
    List<MappedFile> mappedFiles = timerLog.getMappedFileQueue().getMappedFiles();
    for (MappedFile mappedFile : mappedFiles) {
        SelectMappedBufferResult sbr = mappedFile.selectMappedBuffer(0);
        ByteBuffer bf = sbr.getByteBuffer();
        while (position < sbr.getSize()) {
            // 解析每条记录并更新时间轮
            long delayTime = bf.getLong() + bf.getInt();
            timerWheel.reviseSlot(delayTime, IGNORE, sbr.getStartOffset() + position, true);
            position += TimerLog.UNIT_SIZE;
        }
    }
    return checkOffset; // 返回已处理的有效偏移量
}
```

# Q&A
问题一：在我的理解中,timerLog中存储的是CommitLog中的消息的索引，但是CommitLog中的消息是有存储时间上限的，如果要收发长时间定时消息（半个月），该定时消息方案是如何避免消息丢失的问题的？

针对长时间定时消息，该方案采用滚动的方式避免消息的丢失。举例来说，若该时间轮只能存储3天的消息（同样的，CommitLog中也只能存储3天消息），那在消息尚未到达三天时，便先将其按到时处理取出，再发回CommitLog。这样一来，消息重新进入CommitLog，销毁时间又可以重新开始计算，消息丢失的问题便解决了。



问题二：如果在定时消息发送完毕后机器宕机，再次重启时该方案的时间轮和TimerLog的恢复流程是怎样的？

由于在定时消息的接收过程中，TimerLog和TimerWheel都是有定时的持久化操作的，因此宕机对已经持久化进入磁盘的文件影响不大。在此过程中可能受到影响并需要恢复的仅有尚未进行刷盘的部分消息。对此，我们设置了Checkpoint文件，以记录TimerLog中已经被TimerWheel记录的消息offset。在重新启动时，将从该checkpoint记录的位置重新开始向后遍历TimerLog文件，并开始订正TimerWheel每一格中的头尾消息索引。



问题三：在该方案中，取回定时消息时是否有可能存在大量随机读导致污染pagecache的情况？

定时消息的写入在timerLog中是顺序的，因此有可能出现定时久的消息写在前面，而即将到时的消息出现在timerLog的尾部的情况。确实，出现这种情况时，随机读是不可避免的：当TimerWheel中的某一格到时，将前往TimerWheel中检索消息的位置，再进一步到CommitLog中取消息。若要避免这个情况，势必要对消息的写入作进一步优化：排序，或者按时间轮的定位情况写入多个文件。但是这样可能带来另一个问题：大量的随机写。正如俗话说的，“读写难两全”。由于定时消息对于写入更加敏感，所以可以牺牲一定的读性能来保障写入的速度——当然，在性能测试中，该方案的读性能同样令人满意。



RocketMQ代码仓库：[https://github.com/apache/rocketmq](https://github.com/apache/rocketmq)

RIP文档原文：

+ <font style="color:rgb(36, 41, 47);">Google Doc: </font>[https://docs.google.com/document/d/1D6XWwY39p531c2aVi5HQll9iwzTUNT1haUFHqMoRkT0/edit?usp=sharing](https://docs.google.com/document/d/1D6XWwY39p531c2aVi5HQll9iwzTUNT1haUFHqMoRkT0/edit?usp=sharing)
+ <font style="color:rgb(36, 41, 47);">Shimo:</font>[https://shimo.im/docs/gXqme9PKKpIeD7qo/](https://shimo.im/docs/gXqme9PKKpIeD7qo/)


