---
title: "全链路灰度之 RocketMQ  灰度"
date: "2022/01/14"
author: "亦盏"
img: "https://img.alicdn.com/imgextra/i1/O1CN01ITLV0821D9UbS02gz_!!6000000006950-0-tps-685-383.jpg"
tags: ["practice"]
description: " 本文将以上次介绍过的《如何用 20 分钟就能获得同款企业级全链路灰度能力？》中的场景为基础，来进一步介绍消息场景的全链路灰度。"
---

之前的系列文章中，我们已经通过全链路金丝雀发布这个功能来介绍了 MSE 对于全链路流量控制的场景，我们已经了解了 Spring Cloud 和 Dubbo 这一类 RPC 调用的全链路灰度应该如何实现，但是没有涉及到消息这类异步场景下的流量控制，今天我们将以上次介绍过的《[如何用 20 分钟就能获得同款企业级全链路灰度能力？](https://developer.aliyun.com/article/804022)》中的场景为基础，来进一步介绍消息场景的全链路灰度。

虽然绝大多数业务场景下对于消息的灰度的要求并不像 RPC 的要求得这么严格，但是在以下两个场景下，还是会对消息的全链路有一定的诉求的。

1、第一种场景是在消息消费时，可能会产生新的 RPC 调用，如果没有在消息这一环去遵循之前设定好的全链路流量控制的规则，会导致通过消息产生的这部分流量“逃逸”，从而导致全链路灰度的规则遭到破坏，导致出现不符合预期的情况。

为了防止出现这个情况，我们需要在消费时候将消息里原来的流量标复原，并在 RPC 调用的时候遵循原来的规则。我们通过架构图来详细描述一下，满足这个逻辑之后，调用链路是怎样的，从下图中我们可以看到，灰度和基线环境生产出来的消息，虽然在消息推送的时候是随机的，但是在消费过程中，产生的新的 RPC 调用，还是能够回到流量原来所属的环境。
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489754193-793293b8-8d3e-4920-bf65-b206fa2ba2a0.gif#clientId=u39dc73d9-f460-4&height=1&id=mDhVb&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u86011bc7-0274-4425-829f-417423c1934&title=&width=1)
![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489754249-eaf26ed6-f2d2-4463-a105-a476e9b286f4.png#clientId=u39dc73d9-f460-4&height=654&id=hCeyq&name=1.png&originHeight=654&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uefafd2ca-e30c-4e2f-9669-97912bf05fe&title=&width=1080)

2、第二种场景需要更加严格的消息灰度隔离。比如当消息的消费逻辑进行了修改时，这时候希望通过小流量的方式来验证新的消息消费逻辑的正确性，要严格地要求灰度的消息只能被推送给灰度的消息消费者。
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489755979-fd7d2992-9e73-4976-a401-2cf9c7a9591e.gif#clientId=u39dc73d9-f460-4&height=1&id=KPlxH&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u94e9b667-b251-4688-92ad-430c05a98a4&title=&width=1)
![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489754384-56c837b2-84b9-46e6-bfda-604110d1b3e6.png#clientId=u39dc73d9-f460-4&height=305&id=meSXb&name=2.png&originHeight=305&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uced6b0a1-a32c-4b3f-bb8b-ecbfab6e9ba&title=&width=1080)

今天我们就来实操一下第二种场景消息的全链路灰度，目前 MSE 仅支持 RocketMQ 消息的灰度。若您使用的是开源版 RocketMQ，那么版本需要在 4.5.0 及以上，若您使用的是阿里云商业版 RocketMQ，那么需要使用铂金版，且 Ons Client 版本在 1.8.0.Final 及以上。如果只是想使用第一种场景，只需要给 B 应用开启全链路灰度的功能即可，不需要做额外的消息灰度相关的配置。

在这次最佳实践的操作中，我们是将应用部署在阿里云容器服务 Kubernetes 版本，即 ACK 集群来演示，但是事实上，消息灰度对于应用的部署模式是没有限制性要求的，您可以参考 MSE 帮助文档，找到自己所使用的部署模式对应的接入方式，也能使用消息全链路灰度。

## 前提条件

1. 开通 MSE 专业版，请参见开通 MSE 微服务治理专业版**[****1]**。

2. 创建 ACK 集群，请参见创建 Kubernetes 集群**[2****]**。

## 操作步骤


### 步骤一：接入 MSE 微服务治理

#### 1、安装 mse-ack-pilot

1. 登录容器服务控制台**[3****]**。
2. 在左侧导航栏单击**市场 > 应用目录**。
3. 在应用目录页面点击**阿里云应用**，选择**微服务**，并单击 **ack-mse-pilot**。
4. 在 ack-mse-pilot 页面右侧集群列表中选择集群，然后单击创建。

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489754114-3e4d7195-76a9-458a-9e40-879de088572c.png#clientId=u39dc73d9-f460-4&height=382&id=iJKYT&name=3.png&originHeight=382&originWidth=523&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u695ff8e8-de06-4e11-831d-44fe4258624&title=&width=523)

安装 MSE 微服务治理组件大约需要 2 分钟，请耐心等待。
创建成功后，会自动跳转到目标集群的 Helm 页面，检查安装结果。如果出现以下页面，展示相关资源，则说明安装成功。
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489756287-1687c4ca-0b50-44a6-8492-979bb8a8b3d3.gif#clientId=u39dc73d9-f460-4&height=1&id=vxdke&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u54c1c8e2-c236-43a5-beec-29f6f0a4d12&title=&width=1)
![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489756405-5d2cc632-8b5a-4e4f-9e9e-7753b17ec09f.png#clientId=u39dc73d9-f460-4&height=422&id=s9foB&name=4.png&originHeight=422&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc88e95dd-b55c-4d41-a9ac-48efaa4c3eb&title=&width=1080)

#### 2、为 ACK 命名空间中的应用开启 MSE 微服务治理



1. 登录 MSE 治理中心控制台**[4****]**，如果您尚未开通 MSE 微服务治理，请根据提示开通。
2. 在左侧导航栏选择**微服务治理中心 > Kubernetes 集群列表**。

3. 在 Kubernetes 集群列表页面搜索框列表中选择集群名称或集群 ID，然后输入相应的关键字，单击搜索图标。

4. 单击目标集群操作列的**管理**。

5. 在集群详情页面命名空间列表区域，单击目标命名空间操作列下的**开启微服务治理**。

6. 在开启微服务治理对话框中单击确认。

![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489756331-0da7a92e-c344-40c0-b5f6-90d235859bf7.gif#clientId=u39dc73d9-f460-4&height=1&id=elGlV&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5f43ea98-7029-4767-87ef-0f4c28a56c7&title=&width=1)
### 步骤二：还原线上场景

首先，我们将分别部署  spring-cloud-zuul、spring-cloud-a、spring-cloud-b、spring-cloud-c 这四个业务应用，以及注册中心 Nacos Server 和消息服务 RocketMQ Server，模拟出一个真实的调用链路。

Demo 应用的结构图下图，应用之间的调用，既包含了 Spring Cloud 的调用，也包含了 Dubbo 的调用，覆盖了当前市面上最常用的两种微服务框架。其中 C 应用会生产出 RocketMQ 消息，由 A 应用进行消费，A 在消费消息时，也会发起新的调用。这些应用都是最简单的 Spring Cloud 、 Dubbo 和 RocketMQ 的标准用法，您也可以直接在 [_https://github.com/aliyun/alibabacloud-microservice-demo/tree/master/mse-simple-demo_](https://github.com/aliyun/alibabacloud-microservice-demo/tree/master/mse-simple-demo) 项目上查看源码。

![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489756309-f4b9b49e-a144-4d37-ba94-7e1a9ee2c165.gif#clientId=u39dc73d9-f460-4&height=1&id=Rmgie&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc951c06c-cbb8-4cf4-b4ca-3563c27abb6&title=&width=1)![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489756521-34721ebd-7fff-40b3-9841-41b60fc0168a.png#clientId=u39dc73d9-f460-4&height=424&id=nkXVb&name=5.png&originHeight=424&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6fbd5b12-0d6a-4dec-80ec-d551e145936&title=&width=1080)

部署之前，简单介绍一下这个调用链路

spring-cloud-zuul 应用在收到 “/A/dubbo” 的请求时，会把请求转发给 spring-cloud-a ，然后 spring-cloud-a 通过 dubbo 协议去访问 spring-cloud-b， spring-cloud-b 也通过 dubbo 协议去访问 spring-cloud-c，spring-cloud-c 在收到请求后，会生产一个消息，并返回自己的环境标签和 ip。这些生产出来的消息会由 spring-cloud-a 应用消费，spring-cloud-a 应用在消费消息的时候，会通过 spring cloud 去调用 B，B 进而通过 spring cloud 去调用 C，并且将结果输出到自己的日志中。


    当我们调用 /A/dubbo 的时候
    返回值是这样 A[10.25.0.32] -> B[10.25.0.152] -> C[10.25.0.30]


    同时，A 应用在接收到消息之后，输出的日志如下

    2021-12-28 10:58:50.301  INFO 1 --- [essageThread_15] c.a.mse.demo.service.MqConsumer          : topic:TEST_MQ,producer:C[10.25.0.30],invoke result:A[10.25.0.32] -> B[10.25.0.152] -> C[10.25.0.30]


熟悉了调用链路之后，我们继续部署应用，您可以使用 kubectl 或者直接使用 ACK 控制台来部署应用。部署所使用的 yaml 文件如下，您同样可以直接在 [_https://github.com/aliyun/alibabacloud-microservice-demo/tree/master/mse-simple-demo_](https://github.com/aliyun/alibabacloud-microservice-demo/tree/master/mse-simple-demo) 上获取对应的源码。


# 部署 Nacos Server

    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: nacos-server
    spec:
      selector:
        matchLabels:
          app: nacos-server
      template:
        metadata:
          annotations:
          labels:
            app: nacos-server
        spec:
          containers:
            - env:
                - name: MODE
                  value: "standalone"
              image: registry.cn-shanghai.aliyuncs.com/yizhan/nacos-server:latest
              imagePullPolicy: IfNotPresent
              name: nacos-server
              ports:
                - containerPort: 8848

    ---
    apiVersion: v1
    kind: Service
    metadata:
      name: nacos-server
    spec:
      type: ClusterIP
      selector:
        app: nacos-server
      ports:
        - name: http
          port: 8848
          targetPort: 8848

    # 部署业务应用
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: spring-cloud-zuul
    spec:
      selector:
        matchLabels:
          app: spring-cloud-zuul
      template:
        metadata:
          annotations:
            msePilotCreateAppName: spring-cloud-zuul
          labels:
            app: spring-cloud-zuul
        spec:
          containers:
            - env:
                - name: JAVA_HOME
                  value: /usr/lib/jvm/java-1.8-openjdk/jre
                - name: enable.mq.invoke
                  value: 'true'
              image: registry.cn-shanghai.aliyuncs.com/yizhan/spring-cloud-zuul:1.0.0
              imagePullPolicy: Always
              name: spring-cloud-zuul
              ports:
                - containerPort: 20000

    ---
    apiVersion: v1
    kind: Service
    metadata:
      annotations:
        service.beta.kubernetes.io/alibaba-cloud-loadbalancer-spec: slb.s1.small
        service.beta.kubernetes.io/alicloud-loadbalancer-address-type: internet
      name: zuul-slb
    spec:
      ports:
        - port: 80
          protocol: TCP
          targetPort: 20000
      selector:
        app: spring-cloud-zuul
      type: LoadBalancer
    status:
      loadBalancer: {}

    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: spring-cloud-a
    spec:
      selector:
        matchLabels:
          app: spring-cloud-a
      template:
        metadata:
          annotations:
            msePilotCreateAppName: spring-cloud-a
          labels:
            app: spring-cloud-a
        spec:
          containers:
            - env:
                - name: JAVA_HOME
                  value: /usr/lib/jvm/java-1.8-openjdk/jre
              image: registry.cn-shanghai.aliyuncs.com/yizhan/spring-cloud-a:1.0.0
              imagePullPolicy: Always
              name: spring-cloud-a
              ports:
                - containerPort: 20001
              livenessProbe:
                tcpSocket:
                  port: 20001
                initialDelaySeconds: 10
                periodSeconds: 30


    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: spring-cloud-b
    spec:
      selector:
        matchLabels:
          app: spring-cloud-b
      template:
        metadata:
          annotations:
            msePilotCreateAppName: spring-cloud-b
          labels:
            app: spring-cloud-b
        spec:
          containers:
            - env:
                - name: JAVA_HOME
                  value: /usr/lib/jvm/java-1.8-openjdk/jre
              image: registry.cn-shanghai.aliyuncs.com/yizhan/spring-cloud-b:1.0.0
              imagePullPolicy: Always
              name: spring-cloud-b
              ports:
                - containerPort: 20002
              livenessProbe:
                tcpSocket:
                  port: 20002
                initialDelaySeconds: 10
                periodSeconds: 30

    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: spring-cloud-c
    spec:
      selector:
        matchLabels:
          app: spring-cloud-c
      template:
        metadata:
          annotations:
            msePilotCreateAppName: spring-cloud-c
          labels:
            app: spring-cloud-c
        spec:
          containers:
            - env:
                - name: JAVA_HOME
                  value: /usr/lib/jvm/java-1.8-openjdk/jre
              image: registry.cn-shanghai.aliyuncs.com/yizhan/spring-cloud-c:1.0.0
              imagePullPolicy: Always
              name: spring-cloud-c
              ports:
                - containerPort: 20003
              livenessProbe:
                tcpSocket:
                  port: 20003
                initialDelaySeconds: 10
                periodSeconds: 30
    ---

    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: rockectmq-broker
    spec:
      selector:
        matchLabels:
          app: rockectmq-broker
      template:
        metadata:
          labels:
            app: rockectmq-broker
        spec:
          containers:
            - command:
                - sh
                - mqbroker
                - '-n'
                - 'mqnamesrv:9876'
                - '-c /home/rocketmq/rocketmq-4.5.0/conf/broker.conf'
              env:
                - name: ROCKETMQ_HOME
                  value: /home/rocketmq/rocketmq-4.5.0
              image: registry.cn-shanghai.aliyuncs.com/yizhan/rocketmq:4.5.0
              imagePullPolicy: Always
              name: rockectmq-broker
              ports:
                - containerPort: 9876
                  protocol: TCP
                - containerPort: 10911
                  protocol: TCP
                - containerPort: 10912
                  protocol: TCP
                - containerPort: 10909

    ---

    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: rocketmq-name-server
    spec:
      selector:
        matchLabels:
          app: rocketmq-name-server
      template:
        metadata:
          labels:
            app: rocketmq-name-server
        spec:
          containers:
            - command:
                - sh
                - mqnamesrv
              env:
                - name: ROCKETMQ_HOME
                  value: /home/rocketmq/rocketmq-4.5.0
              image: registry.cn-shanghai.aliyuncs.com/yizhan/rocketmq:4.5.0
              imagePullPolicy: Always
              name: rocketmq-name-server
              ports:
                - containerPort: 9876
                  protocol: TCP
                - containerPort: 10911
                  protocol: TCP
                - containerPort: 10912
                  protocol: TCP
                - containerPort: 10909
                  protocol: TCP

    ---  

    apiVersion: v1
    kind: Service
    metadata:
      name: mqnamesrv
    spec:
      type: ClusterIP
      selector:
        app: rocketmq-name-server
      ports:
        - name: mqnamesrv-9876-9876
          port: 9876
          targetPort: 9876


安装成功后，示例如下：


    ➜  ~ kubectl get svc,deploy
    NAME                   TYPE           CLUSTER-IP        EXTERNAL-IP    PORT(S)        AGE
    service/kubernetes     ClusterIP      192.168.0.1       <none>         443/TCP        7d
    service/mqnamesrv      ClusterIP      192.168.213.38    <none>         9876/TCP       47h
    service/nacos-server   ClusterIP      192.168.24.189    <none>         8848/TCP       47h
    service/zuul-slb       LoadBalancer   192.168.189.111   123.56.253.4   80:30260/TCP   47h

    NAME                                   READY   UP-TO-DATE   AVAILABLE   AGE
    deployment.apps/nacos-server           1/1     1            1           4m
    deployment.apps/rockectmq-broker       1/1     1            1           4m
    deployment.apps/rocketmq-name-server   1/1     1            1           5m
    deployment.apps/spring-cloud-a         1/1     1            1           5m
    deployment.apps/spring-cloud-b         1/1     1            1           5m
    deployment.apps/spring-cloud-c         1/1     1            1           5m
    deployment.apps/spring-cloud-zuul      1/1     1            1           5m


同时这里我们可以通过 zuul-slb 来验证一下刚才所说的调用链路


    ➜  ~ curl http://123.56.253.4/A/dubbo
    A[10.25.0.32] -> B[10.25.0.152] -> C[10.25.0.30]


### 步骤三：开启消息灰度功能

现在根据控制台的提示，在消息的生产者 spring-cloud-c 和消息的消费者 spring-cloud-a 都开启消息的灰度。我们直接通过 MSE 的控制台开启，点击进入应用的详情页，选择“消息灰度”标签。

![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489756771-68e52d5c-c14b-4250-8a0e-efc56549e785.png#clientId=u39dc73d9-f460-4&height=689&id=rNOmc&name=6.png&originHeight=689&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2f7c327b-ff2d-460d-897f-4168cc425e3&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489756724-c1f1f856-db13-4c10-a587-77a335b5f696.gif#clientId=u39dc73d9-f460-4&height=1&id=bBdSO&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2903c045-a71c-44ee-9d78-2831315ad21&title=&width=1)
可以看到，在未打标环境忽略的标签中，我们输入了 gray，这里意味着，带着 gray 环境标的消息，只能由 spring-cloud-a-gray 消费，不能由 spring-cloud-a 来消费。

_1、这里需要额外说明一下，因为考虑到实际场景中，spring-cloud-c 应用和 spring-cloud-a  应用的所有者可能不是同一个人，不一定能够做到两者同时进行灰度发布同步的操作，所以在消息的灰度中，未打标环境默认的行为是消费所有消息。这样 spring-cloud-c 在进行灰度发布的时候，可以不需要强制 spring-cloud-a 应用也一定要同时灰度发布。_
_2、我们把未打标环境消费行为的选择权交给 spring-cloud-a 的所有者，如果需要实现未打标环境不消费 c-gray 生产出来的消息，只需要在控制台进行配置即可，配置之后实时生效。_

- 使用此功能您无需修改应用的代码和配置。

- 消息的生产者和消息的消费者，需要同时开启消息灰度，消息的灰度功能才能生效。

- 消息类型目前只支持 RocketMQ，包含开源版本和阿里云商业版。

   - 如果您使用开源 RocketMQ，则 RocketMQ Server 和 RocketMQ Client 都需要使用 4.5.0 及以上版本。

   - 如果您使用阿里云 RocketMQ，需要使用铂金版，且 Ons Client 使用 1.8.0.Final 及以上版本。

- 开启消息灰度后，MSE 会修改消息的 Consumer Group。例如原来的 Consumer Group 为 group1，环境标签为 gray，开启消息灰度后，则 group 会被修改成 group1_gray，如果您使用的是阿里云 RocketMQ ，请提前创建好 group。

- 默认使用 SQL92 的过滤方式，如果您使用的开源 RocketMQ，需要在服务端开启此功能（即在 broker.conf 中配置 enablePropertyFilter=true）。

- 默认情况下，未打标节点将消费所有环境的消息，若需要指定 未打标环节点 不消费 某个标签环境生产出来的消息，请配置“未打标环境忽略的标签”，修改此配置后动态生效，无需重启应用。

### 步骤四：重启节点，部署新版本应用，并引入流量进行验证

首先，因为开启和关闭应用的消息灰度功能后都需要重启节点才能生效，所以首先我们需要重启一下 spring-cloud-a 和 spring-cloud-c 应用，重启的方式可以在控制台上选择重新部署，或者直接使用 kubectl 命令删除现有的 pod。

![7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489756809-2b44dd7a-cd70-4537-8e46-1cea7d2262f2.png#clientId=u39dc73d9-f460-4&height=205&id=I0s3Y&name=7.png&originHeight=205&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u98b95f8a-b39f-4282-ad62-508080d437c&title=&width=1080)

然后，继续使用 yaml 文件的方式在 Kubernetes 集群中部署新版本的 spring-cloud-a-gray、spring-cloud-b-gray 和 spring-cloud-c-gray


    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: spring-cloud-a-gray
    spec:
      selector:
        matchLabels:
          app: spring-cloud-a-gray
      template:
        metadata:
          annotations:
            alicloud.service.tag: gray
            msePilotCreateAppName: spring-cloud-a
          labels:
            app: spring-cloud-a-gray
        spec:
          containers:
            - env:
                - name: JAVA_HOME
                  value: /usr/lib/jvm/java-1.8-openjdk/jre
              image: registry.cn-shanghai.aliyuncs.com/yizhan/spring-cloud-a:1.0.0
              imagePullPolicy: Always
              name: spring-cloud-a-gray
              ports:
                - containerPort: 20001
              livenessProbe:
                tcpSocket:
                  port: 20001
                initialDelaySeconds: 10
                periodSeconds: 30
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: spring-cloud-b-gray
    spec:
      selector:
        matchLabels:
          app: spring-cloud-b-gray
      template:
        metadata:
          annotations:
            alicloud.service.tag: gray
            msePilotCreateAppName: spring-cloud-b
          labels:
            app: spring-cloud-b-gray
        spec:
          containers:
            - env:
                - name: JAVA_HOME
                  value: /usr/lib/jvm/java-1.8-openjdk/jre
              image: registry.cn-shanghai.aliyuncs.com/yizhan/spring-cloud-b:1.0.0
              imagePullPolicy: Always
              name: spring-cloud-b-gray
              ports:
                - containerPort: 20002
              livenessProbe:
                tcpSocket:
                  port: 20002
                initialDelaySeconds: 10
                periodSeconds: 30

    ---

    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: spring-cloud-c-gray
    spec:
      selector:
        matchLabels:
          app: spring-cloud-c-gray
      template:
        metadata:
          annotations:
            alicloud.service.tag: gray
            msePilotCreateAppName: spring-cloud-c
          labels:
            app: spring-cloud-c-gray
        spec:
          containers:
            - env:
                - name: JAVA_HOME
                  value: /usr/lib/jvm/java-1.8-openjdk/jre
              image: registry.cn-shanghai.aliyuncs.com/yizhan/spring-cloud-c:1.0.0
              imagePullPolicy: Always
              name: spring-cloud-c-gray
              ports:
                - containerPort: 20003
              livenessProbe:
                tcpSocket:
                  port: 20003
                initialDelaySeconds: 10
                periodSeconds: 30


部署完成之后，我们引入流量，并进行验证

1. 登录 MSE 治理中心控制台**[4****]**，选择**应用列表**。

2. 单击应用 spring-cloud-a **应用详情**菜单，此时可以看到，所有的流量请求都是去往 spring-cloud-a 应用未打标的版本，即稳定版本。

![8.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489756897-d88e92c0-312d-4d03-967a-5454ff90b908.png#clientId=u39dc73d9-f460-4&height=552&id=kudGV&name=8.png&originHeight=552&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5a48d0a9-3056-48f8-9ecd-c92aa93adaf&title=&width=1080)

3. 点击页面下方的 标签路由中的添加按钮，为 spring-cloud-a 应用的 gray 版本设置灰度规则。

![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489757042-23f9961b-0755-4d72-ac33-524ecc26ef7c.gif#clientId=u39dc73d9-f460-4&height=1&id=LKJff&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2195a542-dc92-4381-87d0-d561df2bb60&title=&width=1)![9.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489757165-a29cc311-9234-4f23-a913-fa2aad17e5fb.png#clientId=u39dc73d9-f460-4&height=930&id=nOoby&name=9.png&originHeight=930&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7c76c3ff-ca54-4692-887d-ee2fdb4e8b4&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489757323-ac228286-4de9-48c6-8c87-a7b93e84639a.gif#clientId=u39dc73d9-f460-4&height=1&id=tJ9cu&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u0f2d0eac-0dea-4a1b-943d-f2faced402c&title=&width=1)![10.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489757370-f6da6930-e52e-4b88-820d-e8bd9ec73dc9.png#clientId=u39dc73d9-f460-4&height=381&id=cpyjc&name=10.png&originHeight=381&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ue256664f-b5c6-4267-a22b-22fefc7fa35&title=&width=1080)

4. 发起流量调用，我们通过 zuul-slb，分别发起流量调用，并查看灰度的情况。

![11.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489757442-8d1f690c-a642-48f1-a08c-91ae31265e39.png#clientId=u39dc73d9-f460-4&height=597&id=X3ulX&name=11.png&originHeight=597&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u403556d3-e55e-4c9d-aa0f-6a4454bf5b6&title=&width=1080)
![12.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489757472-d861f65e-d923-43c0-a587-80128365d048.png#clientId=u39dc73d9-f460-4&height=526&id=TSVMB&name=12.png&originHeight=526&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf30ec2b8-e9cd-41dc-a651-209f1ce88e5&title=&width=1080)
![13.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489757595-d1e8592d-cde1-4f08-8f1e-122a6be7b345.png#clientId=u39dc73d9-f460-4&height=612&id=QbCU6&name=13.png&originHeight=612&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8aaface0-43af-489f-9178-b77df8414ae&title=&width=1080)

我们通过 spring-cloud-a 和 spring-cloud-a-gray 的日志去查看消息消费的情况。可以看到，消息的灰度功能已经生效， spring-cloud-a-gray 这个环境，只会消费带有 gray 标的消息，spring-cloud-a 这个环境，只会消费未打标的流量生产出来的消息。

在截图中我们可以看见，spring-cloud-a-gray 环境输出的日志  topic:TEST_MQ, producer: Cgray [10.25.0.102] , invoke result: Agray[10.25.0.101] -> Bgray[10.25.0.25] -> Cgray[10.25.0.102]， spring-cloud-a-gray 只会消费 Cgray 生产出来的消息，而且消费消息过程中发起的 Spring Cloud 调用，结果也是 Agray[10.25.0.101] -> Bgray[10.25.0.25] -> Cgray[10.25.0.102]，即在灰度环境闭环。

而 spring-cloud-a 这个环境，输出的日志为 topic:TEST_MQ,producer:C[10.25.0.157],invoke result:A[10.25.0.100] -> B[10.25.0.152] -> C[10.25.0.157]，只会消费 C 的基线环境生产出来的消息，且在这个过程中发起的 Spring Cloud 调用，也是在基线环境闭环。
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489757736-a3d8d86b-94a7-425e-a40f-99493e537fdd.gif#clientId=u39dc73d9-f460-4&height=1&id=WcZAT&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u31141b75-8658-4090-85e5-951903f5288&title=&width=1)![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489757869-b7285573-6e4e-4969-bdfb-276fc0a6681c.gif#clientId=u39dc73d9-f460-4&height=1&id=ZZbY1&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u542cb6c5-d727-4816-8b10-fddeeed4be4&title=&width=1)
![14.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489757965-4fc14b7f-2a59-45a1-ae61-32ee81fb5837.png#clientId=u39dc73d9-f460-4&height=471&id=vCb7a&name=14.png&originHeight=471&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4843929e-b607-4de5-a37d-e1a28eb7175&title=&width=1080)
![15.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489758014-9c2df162-d8d9-4c54-bb8c-3b9d71f86873.png#clientId=u39dc73d9-f460-4&height=471&id=Y6Net&name=15.png&originHeight=471&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9875a228-62f0-44b4-befd-2fe3d1db31d&title=&width=1080)

### 步骤五：调整消息的标签过滤规则，并进行验证

因为考虑到实际场景中，spring-cloud-c 应用和 spring-cloud-a  应用的所有者可能不是同一个人，不一定能够做到两者同时进行灰度发布同步的操作，所以在消息的灰度中，未打标环境默认的行为是消费所有消息。这样 spring-cloud-c 在进行灰度发布的时候，可以不需要强制 spring-cloud-a 应用也一定要同时灰度发布，且使用相同的环境标。

spring-cloud-a 在消费时候，未打标环境的行为的选择权是交给 spring-cloud-a 的所有者，如果需要实现未打标环境不消费 c-gray 生产出来的消息，只需要在控制台进行配置即可，配置之后实时生效。

1. 调整 spring-cloud-a 未打标环境的过滤规则。比如这里我们要选择未打标环境不再消费 gray 环境生产出来的消息，只需要在“未打标环境忽略的标签”里面选择 gray，然后点击确定即可。

![16.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489758081-edd43be5-e099-457b-a4f8-e7b25ca14273.png#clientId=u39dc73d9-f460-4&height=782&id=BXRqD&name=16.png&originHeight=782&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u968f531b-495e-40bf-8056-63a8411bcba&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489758165-0d10cb31-d430-46e2-b860-316ad9a5fd1e.gif#clientId=u39dc73d9-f460-4&height=1&id=XQj7H&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u253b4f7a-d459-4cfb-8e22-7aadf5ffc70&title=&width=1)

2. 调整规则之后，规则是可以动态地生效，不需要进行重启的操作，我们直接查看 spring-cloud-a 的日志，验证规则调整生效。

从这个日志中，我们可以看到，此时基线环境可以同时消费 gray 和 基线环境生产出来的消息，而且在消费对应环境消息时产生的 Spring Cloud 调用分别路由到 gray 和 基线环境中。

![17.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680489758341-ea9f9b86-3406-4e73-adb0-8cb6445eb9f9.png#clientId=u39dc73d9-f460-4&height=474&id=Tg75I&name=17.png&originHeight=474&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ucd4c571a-501f-4e91-828d-828c5cb86b4&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680489758445-e0cde971-9269-49e1-9036-84f187a71ebb.gif#clientId=u39dc73d9-f460-4&height=1&id=orULd&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u13f9bb15-5f00-447f-b440-f146595967d&title=&width=1)
## 操作总结

1. 全链路消息灰度的整个过程是不需要修改任何代码和配置的。

2. 目前仅支持 RocketMQ，Client 版本需要在 4.5.0 之后的版本。RocketMQ Server 端需要支持 SQL92 规则过滤，即开源 RocketMQ 需要配置 enablePropertyFilter=true，阿里云 RocketMQ 需要使用铂金版。

3. 开启消息灰度后，MSE Agent 会修改消息消费者的 group，如原来的消费 group 为 group1，环境标签为 gray，则 group 会被修改成 group1_gray，如果使用的是阿里云 RocketMQ，需要提前创建好修改后的 group。

4. 开启和关闭消息灰度后，应用需要重启才能生效；修改未打标环境忽略的标签功能可以动态生效，不需要重启。

## 相关链接

[1] MSE 微服务治理专业版：
[_https://help.aliyun.com/document_detail/333529.html_](https://help.aliyun.com/document_detail/333529.html)

[2] Kubernetes 集群：
[_https://help.aliyun.com/document_detail/86488.html_](https://help.aliyun.com/document_detail/86488.html)

[3] 容器服务控制台：
[_https://cs.console.aliyun.com/_](https://cs.console.aliyun.com/)

[4] MSE 治理中心控制台
[_https://mse.console.aliyun.com/#/msc/home_](https://mse.console.aliyun.com/#/msc/home)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户免费试用（2000TPS，1个月），优惠金额2000元！点击立即领取：[https://free.aliyun.com/?product=9724382](https://free.aliyun.com/?product=9724382)

2、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)