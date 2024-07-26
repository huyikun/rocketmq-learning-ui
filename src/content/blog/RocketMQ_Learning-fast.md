---
title: "RocketMQ 快速上手体验"
description: "介绍 Apache RocketMQ 的快速上手体验教程"
date: "2024-07-24"
img: "https://img.alicdn.com/imgextra/i2/O1CN01QV0A1x1bz54BmqOIk_!!6000000003535-2-tps-496-220.png"
tags: ["baseLearn"]
author: ""
---

<a name="YKFTd"></a>
## 体验准备
<a name="LIYoW"></a>
### 体验开源 RocketMQ 准备
本教程旨在让开发者们快速体验开源 RocketMQ 环境配置、集群搭建、消息快速收发体验等环节。为降低部署门槛，提升上手体验，故仅在单机上部署整个 RocketMQ 集群，暂不考虑高可用部署形态。其它拓展部署形式，请参见第四章的参考资料自行尝试部署。<br />因此，本部分需要您准备：

- 运行机器，64 位操作系统，推荐 Linux/Unix/macOS
- 64 位 JDK 1.8+

具体体验内容请参见第二章。
<a name="qPFUK"></a>
### 体验阿里云云消息队列 RocketMQ 版准备
本部分教程旨在让开发者快速上手阿里云云消息队列 RocketMQ 版的资源创建、消息收发等流程。为降低使用门槛，优化上手体验，本教程将在阿里云云消息队列 RocketMQ 版推出的按量付费实例上进行。该类实例随买随用，用后即可释放，使用过程可能会产生极少量费用。<br />因此，本部分需要您准备：

- 阿里云账号
- 确保账号余额能够支持按量付费类型实例的体验费用

具体体验内容请参见第三章。
<a name="CeO20"></a>
## 快速体验开源 RocketMQ
<a name="Y75a9"></a>
### 环境配置
RocketMQ 的安装包分为两种，二进制包和源码包。二进制包是已经编译完成后可以直接运行的，源码包是需要编译后运行的。为提升体验过程的流畅性，这边建议下载二进制包，直接运行 RocketMQ。<br />您可以点击[这里](https://dist.apache.org/repos/dist/release/rocketmq/5.2.0/rocketmq-all-5.2.0-bin-release.zip)下载二进制包。也可以点击[这里](https://dist.apache.org/repos/dist/release/rocketmq/5.2.0/rocketmq-all-5.2.0-source-release.zip)下载 Apache RocketMQ 5.2.0 的源码包。<br />若您想从源码包开始进行上手体验，需要您[安装maven](https://maven.apache.org/install.html)，进入下载源码的目录，执行如下编译命令：
```bash
$ unzip rocketmq-all-5.2.0-source-release.zip
$ cd rocketmq-all-5.2.0-source-release/
$ mvn -Prelease-all -DskipTests -Dspotbugs.skip=true clean install -U
```
<a name="PVfxP"></a>
### 集群部署
若您直接下载 RocketMQ 的二进制包，则可以直接进入二进制包的目录中：
```bash
$ cd rocketmq-all-5.2.0-bin-release
```
若您选择从源码开始体验，且已经在本地自行编译完成了二进制文件，则可进入源码目录下的 distribution/target 中的二进制文件目录：
```bash
$ cd distribution/target/rocketmq-5.2.0/rocketmq-5.2.0
```
后续体验中的所有指令均在上述目录下执行。
<a name="DMUJc"></a>
#### 启动 NameServer
安装完 RocketMQ 包后，我们执行下面的指令启动 NameServer：
```shell
### 启动namesrv
$ nohup sh bin/mqnamesrv &
 
### 验证namesrv是否启动成功
$ cat ~/logs/rocketmqlogs/namesrv.log
```
若一切正常，则会在执行完上述命令后，输出如下内容：
```shell
The Name Server boot success...
```
<a name="vNWHA"></a>
#### 启动 Broker + Proxy
NameServer 成功启动后，我们启动 Broker 和 Proxy。这里我们使用 Local 模式部署，即 Broker 和 Proxy 同进程部署。5.x 版本也支持 Broker 和 Proxy 分离部署以实现更灵活的集群能力。详情参考[部署教程](https://rocketmq.apache.org/zh/docs/deploymentOperations/01deploy)。
```shell
### 先启动broker
$ nohup sh bin/mqbroker -n localhost:9876 --enable-proxy &

### 验证broker是否启动成功, 比如, broker的ip是192.168.1.2 然后名字是broker-a
$ cat ~/logs/rocketmqlogs/proxy.log 
```
我们可以在执行完上述命令后看到 proxy.log 中的内容，若看到如下信息，则表明 broker 已成功启动：
```shell
The broker[broker-a,192.169.1.2:10911] boot success...
```
至此，一个单节点副本的 RocketMQ 集群已经部署起来了，我们可以利用脚本进行简单的消息收发。
<a name="lvybJ"></a>
### 消息收发
<a name="JNI2z"></a>
#### 工具测试消息收发
在进行工具测试消息收发之前，我们需要告诉客户端 NameServer 的地址，RocketMQ 有多种方式在客户端中设置 NameServer 地址，这里我们利用环境变量 NAMESRV_ADDR。
```shell
$ export NAMESRV_ADDR=localhost:9876
```
完成环境变量配置后，可以在命令行输入如下指令，启动生产者：
```shell
$ sh bin/tools.sh org.apache.rocketmq.example.quickstart.Producer
```
若生产成功，会输出如下内容：
```shell
SendResult [sendStatus=SEND_OK, msgId= ...
```
消息生产完成后，该消息便已经保存在本地 Broker 的存储中了。接下去再输入命令，启动消费者：
```shell
$ sh bin/tools.sh org.apache.rocketmq.example.quickstart.Consumer
```
若消费成功，则会出现如下的输出内容：
```shell
ConsumeMessageThread_%d Receive New Messages: [MessageExt...
```
<a name="NU9Wj"></a>
#### SDK 测试消息收发
工具测试完成后，我们可以尝试使用 SDK 收发消息。使用 SDK 进行消息收发的教程较为复杂，若有一定工程代码编写、运行经验，可以参考该[教程](https://rocketmq.apache.org/docs/quickStart/01quickstart/#5-send-and-receive-messages-with-sdk)自行尝试，本文不再赘述。
<a name="K00vE"></a>
### 配套运维能力
<a name="O7hvY"></a>
#### mqadmin 工具介绍
mqadmin 是 RocketMQ 配套的运维工具，能够非常简便的查看集群状态，创建、修改 topic 等元数据。<br />该工具的使用方式可以参考该[说明文档](https://rocketmq.apache.org/docs/deploymentOperations/02admintool)。本文档仅举例如何使用该工具进行集群状态查看。
<a name="BGmnt"></a>
#### 查看集群状态
对于刚刚启动的 Broker，我们可以尝试使用 mqadmin 工具对它状态进行查看，在二进制包目录下输入如下命令：
```shell
sh bin/mqadmin clusterlist -n localhost:9876
```
若集群运行正常，则输出如下：<br />![image.png](https://img.alicdn.com/imgextra/i4/O1CN01ONSbEq1RXT1tdOMBd_!!6000000002121-0-tps-2084-98.jpg)<br />在该输出中，您可以看到该 NameServer 下的集群名称、Broker 名称、对应 IP 地址、Broker 代码版本、消息生产速度、消息消费速度、定时消息总数、刷盘等待时长、消息保留时长、磁盘使用率等信息。<br />善用 mqadmin 工具，将能在集群故障时快速定位问题所在，并有能力人工介入作恢复。
<a name="gqTd9"></a>
### 关闭集群
当上述测试均完成后，您需要将集群进程（NameServer, Proxy, Broker）进行关闭，关闭方法如下：
```shell
# 关闭Broker
$ sh bin/mqshutdown broker
# 若一切正常，则会输出如下内容：
# The mqbroker(36695) is running...
# Send shutdown request to mqbroker with proxy enable OK(36695)

# 关闭NameServer
$ sh bin/mqshutdown namesrv
# 若一切正常，则会输出如下内容：
# The mqnamesrv(36664) is running...
# Send shutdown request to mqnamesrv(36664) OK
```
<a name="Xy00V"></a>
## 快速体验阿里云云消息队列 RocketMQ 版
体验阿里云云消息队列 RocketMQ 版主要需要如下图所示的几个步骤。本文将按照下面的流程，分三部分引导您快速体验。<br />![](https://img.alicdn.com/imgextra/i2/O1CN01X6iLEA1loDphZNV96_!!6000000004865-0-tps-2080-190.jpg)
<a name="lrI0S"></a>
### 创建账号 & 授权
**注意：若您的账号为阿里云账号，则默认拥有云消息队列 RocketMQ 版服务的所有权限，无需进行授权操作。**<br />账号角色查看方法如下：
> 登录阿里云控制台，页面右上角区域显示账号基本信息，若账号 ID 下显示主账号，表示该账号为阿里云账号，无需授权；若显示 RAM 用户，则该账号需要进行授权。

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01ehSzqw1HE67clpk2d_!!6000000000725-0-tps-1348-778.jpg)![image.png](https://img.alicdn.com/imgextra/i3/O1CN01kK842U1n2Fa0k15Km_!!6000000005031-0-tps-1336-866.jpg)<br />（左图为主账号，无需授权；右图为 RAM 角色账号，需要授权）<br />若您使用的是 RAM 账号，则需要按[该文档](https://help.aliyun.com/zh/apsaramq-for-rocketmq/cloud-message-queue-rocketmq-5-x-series/getting-started/step-1-optional-grant-permissions-to-ram-users?spm=a2c4g.11186623.0.0.7f1b5077gVvBlm)进行授权。考虑到大部分体验者应是个人开发者，授权过程故不在本文中展开说明。
<a name="YI4PE"></a>
### 创建资源
在调用 SDK 收发消息前，您需要提前创建云消息队列 RocketMQ 版的相关资源，包括创建云消息队列 RocketMQ 版实例、获取实例的接入点、创建 Topic、创建 ConsumerGroup。调用 SDK 时，需要将这些资源信息填写到 SDK 代码中。<br />需要注意的是，由于云消息队列 RocketMQ 版需要您预先准备网络、安全组等资源，所以在开通云消息队列 RocketMQ 版实例前，请尽量先参考如下教程做好准备工作：

- [创建专有网络和交换机](https://help.aliyun.com/zh/vpc/user-guide/create-and-manage-a-vpc#section-znz-rbv-vrx)
- [创建安全组](https://help.aliyun.com/zh/ecs/user-guide/create-a-security-group-1)

当然，若您觉得跟着文档走比较复杂，云消息队列 RocketMQ 版在开通过程中也提供了全面的引导，辅助您在开通过程中自查资源准备情况，并立即补齐资源。下面我们直接以“零准备”的主账号进行云消息队列 RocketMQ 版实例购买、配置。
<a name="ba2mW"></a>
#### 创建实例

1. 进入云消息队列 RocketMQ 版产品控制台。可以直接从阿里云官网的产品下拉框中进入，选择“中间件”，并从中找到“云消息队列 RocketMQ 版”。

![image.png](https://img.alicdn.com/imgextra/i1/O1CN01lLdpdL1zSblVNz1gY_!!6000000006713-0-tps-2078-1142.jpg)

2. 进入控制台后，点击“创建实例”按钮。

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01nP3kvF1XGsNSbkntR_!!6000000002897-0-tps-2084-1050.jpg)

3. 选择“Serverless 按累积量”的实例类型，进入创建配置页面。请注意，若您要创建 Serverless 类型实例，请确保您的购买地域支持该实例类型。

![image.png](https://img.alicdn.com/imgextra/i1/O1CN01CLQKUo1buV6ffZZVE_!!6000000003525-0-tps-1358-838.jpg)

4. 确认您在该地域是否已经有 VPC 资源。若无，则点击创建 VPC 专有网络。

![image.png](https://img.alicdn.com/imgextra/i2/O1CN017dwe1P1vuJFytXnfL_!!6000000006232-0-tps-2080-1078.jpg)

5. 进入专有网络的创建页面后，请输入专有网络名称、网段、交换机名称等信息：

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01mjiITb1ysss4Z4FXn_!!6000000006635-0-tps-2082-1354.jpg)

6. 请注意，由于云消息队列 RocketMQ 版的多可用区容灾高可用设计，需要您至少在两个可用区创建交换机。点击图中的“添加(1/10)”，可以同时创建多个交换机。

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01dDVXWm23nSFuUP1wk_!!6000000007300-0-tps-2080-1354.jpg)<br />若您已经创建完成，仍可以进入专有网络控制台独立进行交换机的创建：<br />![image.png](https://img.alicdn.com/imgextra/i2/O1CN016HCdIy1xMzg2NBvCK_!!6000000006430-0-tps-2080-778.jpg)<br />需要注意的是，创建交换机时，请选取和已创建交换机不同可用区进行创建。<br />![image.png](https://img.alicdn.com/imgextra/i2/O1CN012nr02u1gJvYcvUeiU_!!6000000004122-0-tps-1512-916.jpg)

7. 创建完成后，重新返回云消息队列 RocketMQ 版控制台，即可在此处进行 VPC 专有网络的选择，以及 VSwitch（交换机）的选择。此处我们勾选两个可用区进行配置。

![image.png](https://img.alicdn.com/imgextra/i2/O1CN016A4toi1QNYqeiOy3m_!!6000000001964-0-tps-1448-452.jpg)

7. 若您未创建安全组，则可以在安全组选择栏下直接进入“创建安全组”的流程。

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01VrtgMP1jt8rFJIfP9_!!6000000004605-0-tps-1300-306.jpg)<br />进入创建页面后，选择创建安全组。<br />![image.png](https://img.alicdn.com/imgextra/i2/O1CN01RzH50N1WQfE4WheJv_!!6000000002783-0-tps-1108-422.jpg)<br />在网络栏选择刚刚配置的专有网络，其余安全组规则按默认即可，即可完成创建。<br />![image.png](https://img.alicdn.com/imgextra/i3/O1CN016TXvUf1iFSvkGaAyY_!!6000000004383-0-tps-2076-720.jpg)

8. 返回云消息队列 RocketMQ 版控制台，查看“服务关联角色”是否已经创建。若未创建，则可点击该按钮直接进行创建。

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01BOBTlD21xs1w5iFQa_!!6000000007052-0-tps-1404-416.jpg)<br />创建完成的效果如下：<br />![image.png](https://img.alicdn.com/imgextra/i4/O1CN01KjYiBT1n6pXZUv7lu_!!6000000005041-0-tps-1310-324.jpg)

9. 若上述均已配置完成，但是购买按钮仍然显示灰色，且显示 PrivateLink 未开通，则点击进行开通即可。

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01JKR9261NodPil8cba_!!6000000001617-0-tps-1072-404.jpg)<br />![image.png](https://img.alicdn.com/imgextra/i3/O1CN01R4ow4u1lzfjiT3ptf_!!6000000004890-0-tps-1782-758.jpg)<br />注意，此处开通完成后，返回云消息队列 RocketMQ 版控制台，页面需要进行刷新才可正常购买。刷新可通过页面中“选择 VPC”等下拉框后面的“刷新”小按钮完成。

10. 刷新完成后，即可正常购买云消息队列 RocketMQ 版实例了，创建若干分钟后，您就拥有了一个按量付费的云消息队列 RocketMQ 版实例。

![image.png](https://img.alicdn.com/imgextra/i1/O1CN01JfMx5s1PK4D7WRPhY_!!6000000001821-0-tps-938-580.jpg)
<a name="hVXjs"></a>
#### 获取接入点

1. 在**实例列表**页面中单击目标实例名称。

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01jCtzLO1YIzpJMxSSz_!!6000000003037-0-tps-1602-660.jpg)

2. 在**实例详情**页面的 **TCP 协议接入点**区域即可查看实例的接入点信息。
   - VPC 专有网络接入点：使用 VPC 专有网络访问云消息队列 RocketMQ 版时使用。云消息队列 RocketMQ 版默认提供的接入点。
   - 公网接入点：使用公网访问云消息队列 RocketMQ 版时使用该接入点。仅当开启公网访问时显示。

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01KwO3sh29E5MdmYv72_!!6000000008035-0-tps-2078-876.jpg)
<a name="XuqDg"></a>
#### 获取账号密码 
客户端接入云消息队列 RocketMQ 版服务端时，需要根据接入方式配置实例用户名密码。

   - 使用公网访问云消息队列 RocketMQ 版服务端：需要配置实例的用户名密码。
   - 使用VPC网络访问云消息队列 RocketMQ 版服务端：无需配置实例的用户名密码，系统会根据VPC接入点智能识别用户身份。

此处我们以公网访问为例，查看如何获取 Serverless 系列实例的账号密码：<br />![image.png](https://img.alicdn.com/imgextra/i1/O1CN01z0DsGt24dD0fusPNc_!!6000000007413-0-tps-2078-904.jpg)<br />如上图所示，在您实例下点击“访问控制”按钮，进入“智能身份识别”一栏，下面便是您的实例账号、密码。<br />后续若您需要用公网操作您的实例便需要填入此处的内容。
<a name="flxAz"></a>
#### 创建 Topic
现在我们已经拥有了一个 RocketMQ 实例，下面我们便在该实例下创建 Topic 资源。

1. 在**实例列表**页面中单击目标实例名称。
2. 在左侧导航栏单击 **Topic 管理**，然后在 **Topic 管理**页面单击**创建 Topic**。

![image.png](https://img.alicdn.com/imgextra/i4/O1CN014dW60n1qiKp54pyC9_!!6000000005529-0-tps-1496-934.jpg)

3. 在**创建 Topic **面板中填写Topic名称和描述，此处我们将 Topic 命名为"test", 选择**消息类型**为**普通消息**，然后单击**确定**，一个 Topic 便创建完成了。

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01D4LcNj1xYRa2vqGsX_!!6000000006455-0-tps-1574-850.jpg)
<a name="SISkt"></a>
#### 创建订阅组(Group)
拥有一个 Topic 后，我们再创建一个订阅组(Group)。订阅组将被用于消息消费过程。

1. 在**实例列表**页面中单击目标实例名称。
2. 在左侧导航栏单击 **Group 管理**，然后在 **Group 管理**页面单击**创建 Group**。

![image.png](https://img.alicdn.com/imgextra/i2/O1CN01uDr0ON1nUBjvopVwH_!!6000000005092-0-tps-1196-724.jpg)

3. 在**创建 Group **面板填写**Group ID**，此处我们将 Group ID 设置为"test-group"。其他参数可使用默认配置，然后单击**确定**。此时，一个订阅组便创建完成了。

![image.png](https://img.alicdn.com/imgextra/i1/O1CN01gByR4r1vr6U6ZC6l7_!!6000000006225-0-tps-1586-1424.jpg)
<a name="X8Bc6"></a>
### 收发消息
为方便体验，我们选择在控制台进行消息的发送，编写消费者代码并运行，以消费控制台发送的那条消息。

1. 控制台发送消息。首先进入 Topic 详情页面，点击右侧“快速体验”按钮。

![image.png](https://img.alicdn.com/imgextra/i4/O1CN01kYilG51yUbscnmQWD_!!6000000006582-0-tps-2084-578.jpg)

2. 填入消息内容，即可点击发送。发送成功后，这条消息便已进入您实例所在的存储中，您可点击查看其消息轨迹。

![image.png](https://img.alicdn.com/imgextra/i1/O1CN019eLJCj26huIwEKbH9_!!6000000007694-0-tps-1530-762.jpg)

3. 编写消费者代码，本教程将说明如何在 IntelliJ IDEA 中完成消费者的启动。本教程将从 0 开始教您从零开始构建一个 Java 项目。若您已有一定开发经验，请您根据真实情况选择性跳过。
   1. 首先，安装 IntelliJ IDEA。点击该[链接](https://www.jetbrains.com.cn/idea/download)，下滑页面，选择社区版（Community）进行下载。
   2. 新建 Java 工程：

![image.png](https://img.alicdn.com/imgextra/i3/O1CN01W4v0NS1tzgfyv3hyW_!!6000000005973-0-tps-2078-924.jpg)

   3. 在运行代码前，请在您的工程中添加 pom 依赖：
```xml
<dependencies>
  <dependency>
    <groupId>org.apache.rocketmq</groupId>
    <artifactId>rocketmq-client-java</artifactId>
    <version>5.0.7</version>
  </dependency>
</dependencies>
```
添加完成后，pom 文件如下所示：<br />![image.png](https://img.alicdn.com/imgextra/i2/O1CN01yPZhwZ1HuEYpmAaMy_!!6000000000817-0-tps-2082-932.jpg)

   4. 完成依赖添加后，您可以直接复制下面的代码并运行，但是需要注意的是，您要在代码中填入您的实例相关信息，这些信息均已经使用中括号({})框起。
```java
import org.apache.rocketmq.client.apis.*;
import org.apache.rocketmq.client.apis.consumer.ConsumeResult;
import org.apache.rocketmq.client.apis.consumer.FilterExpression;
import org.apache.rocketmq.client.apis.consumer.FilterExpressionType;
import org.apache.rocketmq.client.apis.consumer.PushConsumer;
import org.apache.rocketmq.shaded.org.slf4j.Logger;
import org.apache.rocketmq.shaded.org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Collections;

public class PushConsumerExample {
    private static final Logger LOGGER = LoggerFactory.getLogger(PushConsumerExample.class);

    private PushConsumerExample() {
    }

    public static void main(String[] args) throws ClientException, IOException, InterruptedException {
        /**
         * 实例接入点，从控制台实例详情页的接入点页签中获取。
         * 如果是在阿里云ECS内网访问，建议填写VPC接入点。
         * 如果是在本地公网访问，或者是线下IDC环境访问，可以使用公网接入点。使用公网接入点访问，必须开启实例的公网访问功能。
         */
        String endpoints = "{实例接入点，如rmq-cn-xxx.cn-zhangjiakou.rmq.aliyuncs.com:8080}";
        //指定需要订阅哪个目标Topic，Topic需要提前在控制台创建，如果不创建直接使用会返回报错。
        String topic = "{Topic名称，如test}";
        //为消费者指定所属的消费者分组，Group需要提前在控制台创建，如果不创建直接使用会返回报错。
        String consumerGroup = "{Group ID, 如test-group}";
        String instanceId = "{实例id，如rmq-cn-xxx}";
        String userName = "{账号名}";
        String passWord = "{密码}";
        
        final ClientServiceProvider provider = ClientServiceProvider.loadService();
        ClientConfigurationBuilder builder = ClientConfiguration.newBuilder().setEndpoints(endpoints);
        ClientConfiguration clientConfiguration = ClientConfiguration.newBuilder()
                .setEndpoints(endpoints)
                .setNamespace(instanceId)
                .setCredentialProvider(new StaticSessionCredentialsProvider(userName, passWord))
                .build();

        //订阅消息的过滤规则，表示订阅所有Tag的消息。
        String tag = "*";
        FilterExpression filterExpression = new FilterExpression(tag, FilterExpressionType.TAG);
        //初始化PushConsumer，需要绑定消费者分组ConsumerGroup、通信参数以及订阅关系。
        PushConsumer pushConsumer = provider.newPushConsumerBuilder()
                .setClientConfiguration(clientConfiguration)
                //设置消费者分组。
                .setConsumerGroup(consumerGroup)
                //设置预绑定的订阅关系。
                .setSubscriptionExpressions(Collections.singletonMap(topic, filterExpression))
                //设置消费监听器。
                .setMessageListener(messageView -> {
                    //处理消息并返回消费结果。
                    // LOGGER.info("Consume message={}", messageView);
                    System.out.println("Consume Message: " + messageView);
                    return ConsumeResult.SUCCESS;
                })
                .build();
        Thread.sleep(Long.MAX_VALUE);
        //如果不需要再使用PushConsumer，可关闭该进程。
        //pushConsumer.close();
    }
}
```
启动后，消费成功即可拿到之前在控制台发送的消息：<br />![image.png](https://img.alicdn.com/imgextra/i2/O1CN01ltAzhy1bVlieZQ7gW_!!6000000003471-0-tps-1582-484.jpg)
<a name="EUyrY"></a>
### 可观测能力
刚刚发送消息后，我们可以在控制台进行消息轨迹的查看。进入仪表盘时，会提示您创建服务关联角色，点击创建、授权即可。阿里云云消息队列 RocketMQ 版的可观测能力多样，细粒度的有消息级别的查询、轨迹查询。粗粒度的有仪表盘，能够在实例维度查看消息的生产、发送、堆积等情况。
<a name="grmV4"></a>
#### 消息查询 & 轨迹
针对我们刚刚发送的消息，可以点击“消息查询”功能，查询该消息的具体内容、查看消息轨迹，并可指定消费者进行消费能力验证等。![image.png](https://img.alicdn.com/imgextra/i3/O1CN01QYO4ow1mDs0yl8DOR_!!6000000004921-0-tps-2082-704.jpg)<br />尤其是消息轨迹功能，我们能够支持对特定消息进行全生命周期的展示，包括其生产者、存储时间、存储 ID、投递事件、消费者等信息。通过该可观测能力，我们能够十分清晰地了解消息收发的细节。<br />![image.png](https://img.alicdn.com/imgextra/i3/O1CN01FOtfNt1T5Bo8Q6aBZ_!!6000000002330-0-tps-2082-670.jpg)
<a name="GWI3m"></a>
#### 仪表盘
相对于消息查询功能，仪表盘属于粗粒度的可观测能力。该能力可以展现实例维度、Topic 维度、Group 维度的整体情况，包括但不限于收发速率、堆积情况等数据。且依托于 Grafana 的可视化能力，这些指标的展示都是十分直观且灵活的。如下图，我们可以看到刚刚测试的消息在何时进入实例，消费延迟时间等信息。<br />![image.png](https://img.alicdn.com/imgextra/i1/O1CN01SwtElq1LTuFvkCWvX_!!6000000001301-0-tps-2080-1012.jpg)
<a name="fJ0Yo"></a>
## 其它拓展能力以及参考文档
开源 RocketMQ 在 GitHub 社区中不断迭代成长，定期发布版本，您可以在社区内查看最新特性、提出 Bug，甚至参与 Bug 的修复。

- Apache RocketMQ 的官网为：[https://rocketmq.apache.org/zh/docs/bestPractice/06FAQ](https://rocketmq.apache.org/zh/docs/bestPractice/06FAQ)
- Apache RocketMQ 的开源 Github 社区为：[https://github.com/apache/rocketmq](https://github.com/apache/rocketmq)

此外，阿里云云消息队列 RocketMQ 版的更多特性、教程、最佳实践均可在官方文档中找到。基于 Serverless 系列可以让体验成本可控，若对其它消息队列特性感兴趣，请自行上手尝试。

- 阿里云云消息队列 RocketMQ 版的官方文档为：[https://help.aliyun.com/zh/apsaramq-for-rocketmq/cloud-message-queue-rocketmq-5-x-series/?spm=5176.234368.J_5253785160.5.2e4b4ef6ujTZNV](https://help.aliyun.com/zh/apsaramq-for-rocketmq/cloud-message-queue-rocketmq-5-x-series/?spm=5176.234368.J_5253785160.5.2e4b4ef6ujTZNV)

