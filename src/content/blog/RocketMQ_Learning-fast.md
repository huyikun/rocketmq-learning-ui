---
title: "RocketMQ 快速上手体验"
description: "介绍 Apache RocketMQ 的快速上手体验教程"
date: "2024-07-24"
img: "https://img.alicdn.com/imgextra/i3/O1CN01QVMIVL1c2kEeAnvsG_!!6000000003543-2-tps-496-220.png"
tags: ["baseLearn"]
author: "燧人"
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
若集群运行正常，则输出如下：<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720764479505-c1e07bcb-444e-4e0e-82b9-50b1894c92e4.png#clientId=uc7125b31-b10e-4&from=paste&height=78&id=u1de089a9&originHeight=156&originWidth=3300&originalType=binary&ratio=2&rotation=0&showTitle=false&size=249447&status=done&style=none&taskId=u1702e2fe-d8ee-4156-9cde-3655300f7e1&title=&width=1650)<br />在该输出中，您可以看到该 NameServer 下的集群名称、Broker 名称、对应 IP 地址、Broker 代码版本、消息生产速度、消息消费速度、定时消息总数、刷盘等待时长、消息保留时长、磁盘使用率等信息。<br />善用 mqadmin 工具，将能在集群故障时快速定位问题所在，并有能力人工介入作恢复。
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
体验阿里云云消息队列 RocketMQ 版主要需要如下图所示的几个步骤。本文将按照下面的流程，分三部分引导您快速体验。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/jpeg/231104/1720765276751-d7da7edc-11fb-441d-bea1-8d32178f577d.jpeg)
<a name="lrI0S"></a>
### 创建账号 & 授权
**注意：若您的账号为阿里云账号，则默认拥有云消息队列 RocketMQ 版服务的所有权限，无需进行授权操作。**<br />账号角色查看方法如下：
> 登录阿里云控制台，页面右上角区域显示账号基本信息，若账号 ID 下显示主账号，表示该账号为阿里云账号，无需授权；若显示 RAM 用户，则该账号需要进行授权。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720765849051-201e49d6-0342-4baf-9ba4-f0dd0d6576ef.png#clientId=uc7125b31-b10e-4&from=paste&height=195&id=u086671dc&originHeight=390&originWidth=676&originalType=binary&ratio=2&rotation=0&showTitle=false&size=166778&status=done&style=none&taskId=u442eb4c4-1960-4999-93a0-ee55b849a86&title=&width=338)![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720765963947-97c8193e-16db-42fe-93b0-913dc79d97fd.png#clientId=uc7125b31-b10e-4&from=paste&height=216&id=u320221ac&originHeight=432&originWidth=668&originalType=binary&ratio=2&rotation=0&showTitle=false&size=174627&status=done&style=none&taskId=uc7624d86-5fd3-4f13-b21c-07029ed85c5&title=&width=334)<br />（左图为主账号，无需授权；右图为 RAM 角色账号，需要授权）<br />若您使用的是 RAM 账号，则需要按[该文档](https://help.aliyun.com/zh/apsaramq-for-rocketmq/cloud-message-queue-rocketmq-5-x-series/getting-started/step-1-optional-grant-permissions-to-ram-users?spm=a2c4g.11186623.0.0.7f1b5077gVvBlm)进行授权。考虑到大部分体验者应是个人开发者，授权过程故不在本文中展开说明。
<a name="YI4PE"></a>
### 创建资源
在调用 SDK 收发消息前，您需要提前创建云消息队列 RocketMQ 版的相关资源，包括创建云消息队列 RocketMQ 版实例、获取实例的接入点、创建 Topic、创建 ConsumerGroup。调用 SDK 时，需要将这些资源信息填写到 SDK 代码中。<br />需要注意的是，由于云消息队列 RocketMQ 版需要您预先准备网络、安全组等资源，所以在开通云消息队列 RocketMQ 版实例前，请尽量先参考如下教程做好准备工作：

- [创建专有网络和交换机](https://help.aliyun.com/zh/vpc/user-guide/create-and-manage-a-vpc#section-znz-rbv-vrx)
- [创建安全组](https://help.aliyun.com/zh/ecs/user-guide/create-a-security-group-1)

当然，若您觉得跟着文档走比较复杂，云消息队列 RocketMQ 版在开通过程中也提供了全面的引导，辅助您在开通过程中自查资源准备情况，并立即补齐资源。下面我们直接以“零准备”的主账号进行云消息队列 RocketMQ 版实例购买、配置。
<a name="ba2mW"></a>
#### 创建实例

1. 进入云消息队列 RocketMQ 版产品控制台。可以直接从阿里云官网的产品下拉框中进入，选择“中间件”，并从中找到“云消息队列 RocketMQ 版”。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720768547156-667074cd-f2e3-4461-bd3a-56f56c5cdff7.png#clientId=uc7125b31-b10e-4&from=paste&height=370&id=u6083a50f&originHeight=740&originWidth=1345&originalType=binary&ratio=2&rotation=0&showTitle=false&size=456926&status=done&style=none&taskId=ua7217799-2651-4c40-a6bc-93da46dc150&title=&width=672.5)

2. 进入控制台后，点击“创建实例”按钮。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720767882772-b794f58d-af75-43eb-ac66-ef5b9165bccd.png#clientId=uc7125b31-b10e-4&from=paste&height=647&id=u02a513c5&originHeight=1294&originWidth=2564&originalType=binary&ratio=2&rotation=0&showTitle=false&size=1247876&status=done&style=none&taskId=u49133bf3-f860-4cdf-8a6f-ad2367bdf24&title=&width=1282)

3. 选择“Serverless 按累积量”的实例类型，进入创建配置页面。请注意，若您要创建 Serverless 类型实例，请确保您的购买地域支持该实例类型。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720767901652-04d5b1b5-5ba5-4d08-8b60-e80e3c8f45fa.png#clientId=uc7125b31-b10e-4&from=paste&height=308&id=u1d8e427c&originHeight=418&originWidth=678&originalType=binary&ratio=2&rotation=0&showTitle=false&size=154259&status=done&style=none&taskId=u561361ff-e05a-4a7e-a5c8-d28d88bf64b&title=&width=500)

4. 确认您在该地域是否已经有 VPC 资源。若无，则点击创建 VPC 专有网络。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720767970527-27c2580e-0805-4b57-8abd-ff8909710d4a.png#clientId=uc7125b31-b10e-4&from=paste&height=324&id=u79925bef&originHeight=648&originWidth=1253&originalType=binary&ratio=2&rotation=0&showTitle=false&size=375840&status=done&style=none&taskId=ud57e8815-2722-488b-8171-d9896834be7&title=&width=626.5)

5. 进入专有网络的创建页面后，请输入专有网络名称、网段、交换机名称等信息：

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720768022806-c27dfeb0-8cc3-41b5-8699-c81fc2926e3a.png#clientId=uc7125b31-b10e-4&from=paste&height=592&id=ua47a99d3&originHeight=1184&originWidth=1816&originalType=binary&ratio=2&rotation=0&showTitle=false&size=536699&status=done&style=none&taskId=ua9d1bda1-68e8-43fe-a95d-65798bc82e1&title=&width=908)

6. 请注意，由于云消息队列 RocketMQ 版的多可用区容灾高可用设计，需要您至少在两个可用区创建交换机。点击图中的“添加(1/10)”，可以同时创建多个交换机。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720768022806-c27dfeb0-8cc3-41b5-8699-c81fc2926e3a.png#clientId=uc7125b31-b10e-4&from=paste&height=441&id=ZebxI&originHeight=1184&originWidth=1816&originalType=binary&ratio=2&rotation=0&showTitle=false&size=536699&status=done&style=none&taskId=ua9d1bda1-68e8-43fe-a95d-65798bc82e1&title=&width=676)<br />若您已经创建完成，仍可以进入专有网络控制台独立进行交换机的创建：<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720768250515-5b28b673-0dd3-48ff-8f58-181e41737990.png#clientId=uc7125b31-b10e-4&from=paste&height=249&id=nDlcI&originHeight=411&originWidth=1096&originalType=binary&ratio=2&rotation=0&showTitle=false&size=176100&status=done&style=none&taskId=u9d9bef65-97cc-4d31-9438-9290c39a0ae&title=&width=664)<br />需要注意的是，创建交换机时，请选取和已创建交换机不同可用区进行创建。<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720768277935-94e74a80-6141-46f1-8e70-2bebad4d3253.png#clientId=uc7125b31-b10e-4&from=paste&height=387&id=Dz5sm&originHeight=456&originWidth=756&originalType=binary&ratio=2&rotation=0&showTitle=false&size=167298&status=done&style=none&taskId=u2c0e9fb2-3104-42ac-b872-36312b4aacb&title=&width=642)

7. 创建完成后，重新返回云消息队列 RocketMQ 版控制台，即可在此处进行 VPC 专有网络的选择，以及 VSwitch（交换机）的选择。此处我们勾选两个可用区进行配置。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720768316717-ff90d9ea-f667-4710-bae5-2b104f36170f.png#clientId=uc7125b31-b10e-4&from=paste&height=174&id=DgpJH&originHeight=227&originWidth=723&originalType=binary&ratio=2&rotation=0&showTitle=false&size=81420&status=done&style=none&taskId=ueb59d63c-82da-4f57-a5aa-72ed6b19258&title=&width=554.5)

7. 若您未创建安全组，则可以在安全组选择栏下直接进入“创建安全组”的流程。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720768080943-f5db126e-fc17-4235-877f-c8f9bb984e41.png#clientId=uc7125b31-b10e-4&from=paste&height=124&id=u21abd420&originHeight=153&originWidth=649&originalType=binary&ratio=2&rotation=0&showTitle=false&size=63673&status=done&style=none&taskId=u26a1d7f7-b353-453c-9edd-3a7c82e7023&title=&width=527.5)<br />进入创建页面后，选择创建安全组。<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720768099962-cdc08859-5e42-4ca2-9a5a-388d045afd47.png#clientId=uc7125b31-b10e-4&from=paste&height=200&id=u3f81de2e&originHeight=211&originWidth=553&originalType=binary&ratio=2&rotation=0&showTitle=false&size=78438&status=done&style=none&taskId=u85463ee6-ed31-4db1-a3ea-348a72c27f1&title=&width=523.5)<br />在网络栏选择刚刚配置的专有网络，其余安全组规则按默认即可，即可完成创建。<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720768126848-12cc583b-960c-46bd-a54b-568697614ce8.png#clientId=uc7125b31-b10e-4&from=paste&height=192&id=u90fc48cc&originHeight=383&originWidth=1105&originalType=binary&ratio=2&rotation=0&showTitle=false&size=136340&status=done&style=none&taskId=u5524d858-7eb9-4175-9415-3587a509331&title=&width=552.5)

8. 返回云消息队列 RocketMQ 版控制台，查看“服务关联角色”是否已经创建。若未创建，则可点击该按钮直接进行创建。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720768153693-a9551cdb-f7f8-4d38-9e7d-4c09786a38ae.png#clientId=uc7125b31-b10e-4&from=paste&height=177&id=uedd6407b&originHeight=207&originWidth=704&originalType=binary&ratio=2&rotation=0&showTitle=false&size=75398&status=done&style=none&taskId=uf7802122-fed9-4278-9534-d5eb188b8bb&title=&width=601)<br />创建完成的效果如下：<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720768162840-b941e672-fcc5-458d-a8c5-6276f7686c6c.png#clientId=uc7125b31-b10e-4&from=paste&height=151&id=ud9366816&originHeight=165&originWidth=656&originalType=binary&ratio=2&rotation=0&showTitle=false&size=58775&status=done&style=none&taskId=u24a64ebb-dc71-47b8-a147-1b2c38e9eae&title=&width=602)

9. 若上述均已配置完成，但是购买按钮仍然显示灰色，且显示 PrivateLink 未开通，则点击进行开通即可。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720768173289-e206c322-0200-4e52-aba1-9201ed89f27d.png#clientId=uc7125b31-b10e-4&from=paste&height=235&id=ufaa24397&originHeight=202&originWidth=537&originalType=binary&ratio=2&rotation=0&showTitle=false&size=55785&status=done&style=none&taskId=u6e5df092-89d9-49f7-8b24-803b4159428&title=&width=623.5)<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720768195398-1511fc63-8bf0-47c2-b9b1-437f9d47390e.png#clientId=uc7125b31-b10e-4&from=paste&height=263&id=WhlMq&originHeight=380&originWidth=891&originalType=binary&ratio=2&rotation=0&showTitle=false&size=157037&status=done&style=none&taskId=u1a417b76-3877-4952-bfeb-5d03a28cbcd&title=&width=617.5)<br />注意，此处开通完成后，返回云消息队列 RocketMQ 版控制台，页面需要进行刷新才可正常购买。刷新可通过页面中“选择 VPC”等下拉框后面的“刷新”小按钮完成。

10. 刷新完成后，即可正常购买云消息队列 RocketMQ 版实例了，创建若干分钟后，您就拥有了一个按量付费的云消息队列 RocketMQ 版实例。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720768340567-c854c9ab-e0f2-404b-add4-121e9b4c17a7.png#clientId=uc7125b31-b10e-4&from=paste&height=398&id=uc433ed2f&originHeight=289&originWidth=470&originalType=binary&ratio=2&rotation=0&showTitle=false&size=80401&status=done&style=none&taskId=u793e520d-d387-4f4f-aadd-94c1ee3445b&title=&width=647)
<a name="hVXjs"></a>
#### 获取接入点

1. 在**实例列表**页面中单击目标实例名称。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720769908153-a1336065-7499-426c-90fb-a2fbb051c499.png#clientId=uc7125b31-b10e-4&from=paste&height=271&id=u93a22d0a&originHeight=332&originWidth=802&originalType=binary&ratio=2&rotation=0&showTitle=false&size=138433&status=done&style=none&taskId=u9ec5d252-0647-4f53-8202-9ee4370cd0a&title=&width=655)

2. 在**实例详情**页面的 **TCP 协议接入点**区域即可查看实例的接入点信息。
   - VPC 专有网络接入点：使用 VPC 专有网络访问云消息队列 RocketMQ 版时使用。云消息队列 RocketMQ 版默认提供的接入点。
   - 公网接入点：使用公网访问云消息队列 RocketMQ 版时使用该接入点。仅当开启公网访问时显示。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720770241125-9ac82e1b-a5bd-4f56-9f78-45970bcec720.png#clientId=uc7125b31-b10e-4&from=paste&height=422&id=Iv9kV&originHeight=844&originWidth=2006&originalType=binary&ratio=2&rotation=0&showTitle=false&size=479646&status=done&style=none&taskId=ub4712155-7e81-4a7a-9df1-1f6576ed83b&title=&width=1003)
<a name="XuqDg"></a>
#### 获取账号密码 
客户端接入云消息队列 RocketMQ 版服务端时，需要根据接入方式配置实例用户名密码。

   - 使用公网访问云消息队列 RocketMQ 版服务端：需要配置实例的用户名密码。
   - 使用VPC网络访问云消息队列 RocketMQ 版服务端：无需配置实例的用户名密码，系统会根据VPC接入点智能识别用户身份。

此处我们以公网访问为例，查看如何获取 Serverless 系列实例的账号密码：<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720770497376-ebc1e24a-6cd9-4f2c-9666-73413801efc4.png#clientId=uc7125b31-b10e-4&from=paste&height=266&id=u940a338b&originHeight=531&originWidth=1222&originalType=binary&ratio=2&rotation=0&showTitle=false&size=277637&status=done&style=none&taskId=ub84eeff4-520b-47ee-aa49-a4caf15eb81&title=&width=611)<br />如上图所示，在您实例下点击“访问控制”按钮，进入“智能身份识别”一栏，下面便是您的实例账号、密码。<br />后续若您需要用公网操作您的实例便需要填入此处的内容。
<a name="flxAz"></a>
#### 创建 Topic
现在我们已经拥有了一个 RocketMQ 实例，下面我们便在该实例下创建 Topic 资源。

1. 在**实例列表**页面中单击目标实例名称。
2. 在左侧导航栏单击 **Topic 管理**，然后在 **Topic 管理**页面单击**创建 Topic**。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720770781443-cbd30b41-1500-40dd-b602-f5e7605ac70b.png#clientId=uc7125b31-b10e-4&from=paste&height=379&id=u8a1d5f91&originHeight=467&originWidth=750&originalType=binary&ratio=2&rotation=0&showTitle=false&size=148872&status=done&style=none&taskId=u5e37562e-9e6d-4b28-a736-b628bf16696&title=&width=608)

3. 在**创建 Topic **面板中填写Topic名称和描述，此处我们将 Topic 命名为"test", 选择**消息类型**为**普通消息**，然后单击**确定**，一个 Topic 便创建完成了。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720770841240-4ba050ad-3e61-4db9-9b2e-6e2b27b84338.png#clientId=uc7125b31-b10e-4&from=paste&height=319&id=ue532e5a5&originHeight=423&originWidth=790&originalType=binary&ratio=2&rotation=0&showTitle=false&size=161136&status=done&style=none&taskId=u73712985-8e2f-482f-9b39-7f1fa1decab&title=&width=596)
<a name="SISkt"></a>
#### 创建订阅组(Group)
拥有一个 Topic 后，我们再创建一个订阅组(Group)。订阅组将被用于消息消费过程。

1. 在**实例列表**页面中单击目标实例名称。
2. 在左侧导航栏单击 **Group 管理**，然后在 **Group 管理**页面单击**创建 Group**。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720770950338-03adf3c0-4cbd-49cc-9a81-d7bc4b10606d.png#clientId=uc7125b31-b10e-4&from=paste&height=347&id=u68cba4d2&originHeight=361&originWidth=598&originalType=binary&ratio=2&rotation=0&showTitle=false&size=116219&status=done&style=none&taskId=u13a29810-dad6-412e-89cf-455236ab4f9&title=&width=575)

3. 在**创建 Group **面板填写**Group ID**，此处我们将 Group ID 设置为"test-group"。其他参数可使用默认配置，然后单击**确定**。此时，一个订阅组便创建完成了。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720770978040-6ed72c68-6ad8-447d-9458-7bca7433489e.png#clientId=uc7125b31-b10e-4&from=paste&height=499&id=u1f1c77e9&originHeight=711&originWidth=793&originalType=binary&ratio=2&rotation=0&showTitle=false&size=279865&status=done&style=none&taskId=u4066a725-0387-479d-aa20-b09fa17832c&title=&width=556)
<a name="X8Bc6"></a>
### 收发消息
为方便体验，我们选择在控制台进行消息的发送，编写消费者代码并运行，以消费控制台发送的那条消息。

1. 控制台发送消息。首先进入 Topic 详情页面，点击右侧“快速体验”按钮。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720771112332-0cb18040-e389-47f8-b5aa-f9b5b28ef112.png#clientId=uc7125b31-b10e-4&from=paste&height=354&id=u3ca99509&originHeight=708&originWidth=2553&originalType=binary&ratio=2&rotation=0&showTitle=false&size=418764&status=done&style=none&taskId=ue4429d6b-4924-43e0-b0fd-455ae57ca14&title=&width=1276.5)

2. 填入消息内容，即可点击发送。发送成功后，这条消息便已进入您实例所在的存储中，您可点击查看其消息轨迹。

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720771151241-b06abeae-4427-46a4-99bc-bd9aac044c23.png#clientId=uc7125b31-b10e-4&from=paste&height=359&id=ubdbab0b3&originHeight=381&originWidth=766&originalType=binary&ratio=2&rotation=0&showTitle=false&size=129147&status=done&style=none&taskId=uca6468ce-4b8b-4de6-8bef-108dcd5eddf&title=&width=722)

3. 编写消费者代码，本教程将说明如何在 IntelliJ IDEA 中完成消费者的启动。本教程将从 0 开始教您从零开始构建一个 Java 项目。若您已有一定开发经验，请您根据真实情况选择性跳过。
   1. 首先，安装 IntelliJ IDEA。点击该[链接](https://www.jetbrains.com.cn/idea/download)，下滑页面，选择社区版（Community）进行下载。
   2. 新建 Java 工程：

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720776407267-5822a3e4-0993-4461-af05-d1167b265622.png#clientId=uc7125b31-b10e-4&from=paste&height=356&id=u808a54a0&originHeight=712&originWidth=1600&originalType=binary&ratio=2&rotation=0&showTitle=false&size=570136&status=done&style=none&taskId=uf61879c3-9f63-4397-8320-f0434a5697a&title=&width=800)

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
添加完成后，pom 文件如下所示：<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720776628948-31cda264-c23d-4080-b0ea-f599d1cceeb5.png#clientId=uc7125b31-b10e-4&from=paste&height=283&id=u970b9551&originHeight=566&originWidth=1267&originalType=binary&ratio=2&rotation=0&showTitle=false&size=454695&status=done&style=none&taskId=ufeee8e0b-81e7-4e3a-be88-83396625754&title=&width=633.5)

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
启动后，消费成功即可拿到之前在控制台发送的消息：<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720775681483-28a7ea11-808c-4c97-84ba-49e6ca4c4122.png#clientId=uc7125b31-b10e-4&from=paste&height=226&id=u7d8e7616&originHeight=244&originWidth=790&originalType=binary&ratio=2&rotation=0&showTitle=false&size=109340&status=done&style=none&taskId=uc3b2d5ec-2da4-44dc-965a-f058f097cd5&title=&width=732)
<a name="EUyrY"></a>
### 可观测能力
刚刚发送消息后，我们可以在控制台进行消息轨迹的查看。进入仪表盘时，会提示您创建服务关联角色，点击创建、授权即可。阿里云云消息队列 RocketMQ 版的可观测能力多样，细粒度的有消息级别的查询、轨迹查询。粗粒度的有仪表盘，能够在实例维度查看消息的生产、发送、堆积等情况。
<a name="grmV4"></a>
#### 消息查询 & 轨迹
针对我们刚刚发送的消息，可以点击“消息查询”功能，查询该消息的具体内容、查看消息轨迹，并可指定消费者进行消费能力验证等。![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720777128428-fa0ba6ac-c315-48d1-8ff6-10f9cb0ea586.png#clientId=uc7125b31-b10e-4&from=paste&height=254&id=ue0f547d8&originHeight=507&originWidth=1490&originalType=binary&ratio=2&rotation=0&showTitle=false&size=245694&status=done&style=none&taskId=u170d2feb-f0a0-444b-9da3-8933b72d87d&title=&width=745)<br />尤其是消息轨迹功能，我们能够支持对特定消息进行全生命周期的展示，包括其生产者、存储时间、存储 ID、投递事件、消费者等信息。通过该可观测能力，我们能够十分清晰地了解消息收发的细节。<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720777010590-66ba80e7-8a86-4cd1-b0ac-2d65faa48ed6.png#clientId=uc7125b31-b10e-4&from=paste&height=242&id=u165fe41f&originHeight=484&originWidth=1508&originalType=binary&ratio=2&rotation=0&showTitle=false&size=249446&status=done&style=none&taskId=u649bd620-8c88-4a8d-b316-8d0b02e4e4f&title=&width=754)
<a name="GWI3m"></a>
#### 仪表盘
相对于消息查询功能，仪表盘属于粗粒度的可观测能力。该能力可以展现实例维度、Topic 维度、Group 维度的整体情况，包括但不限于收发速率、堆积情况等数据。且依托于 Grafana 的可视化能力，这些指标的展示都是十分直观且灵活的。如下图，我们可以看到刚刚测试的消息在何时进入实例，消费延迟时间等信息。<br />![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/231104/1720776893170-c1fff2ac-4451-463c-9acf-05f6d6bf2bb7.png#clientId=uc7125b31-b10e-4&from=paste&height=623&id=u1ebc405b&originHeight=1245&originWidth=2559&originalType=binary&ratio=2&rotation=0&showTitle=false&size=868656&status=done&style=none&taskId=u89c729ac-bcd8-47a6-b61a-562231976ab&title=&width=1279.5)
<a name="fJ0Yo"></a>
## 其它拓展能力以及参考文档
开源 RocketMQ 在 GitHub 社区中不断迭代成长，定期发布版本，您可以在社区内查看最新特性、提出 Bug，甚至参与 Bug 的修复。

- Apache RocketMQ 的官网为：[https://rocketmq.apache.org/zh/docs/bestPractice/06FAQ](https://rocketmq.apache.org/zh/docs/bestPractice/06FAQ)
- Apache RocketMQ 的开源 Github 社区为：[https://github.com/apache/rocketmq](https://github.com/apache/rocketmq)

此外，阿里云云消息队列 RocketMQ 版的更多特性、教程、最佳实践均可在官方文档中找到。基于 Serverless 系列可以让体验成本可控，若对其它消息队列特性感兴趣，请自行上手尝试。

- 阿里云云消息队列 RocketMQ 版的官方文档为：[https://help.aliyun.com/zh/apsaramq-for-rocketmq/cloud-message-queue-rocketmq-5-x-series/?spm=5176.234368.J_5253785160.5.2e4b4ef6ujTZNV](https://help.aliyun.com/zh/apsaramq-for-rocketmq/cloud-message-queue-rocketmq-5-x-series/?spm=5176.234368.J_5253785160.5.2e4b4ef6ujTZNV)

