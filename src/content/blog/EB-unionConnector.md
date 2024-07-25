---
title: "云钉一体：EventBridge  联合钉钉连接器打通云钉生态"
date: "2022/05/17"
author: "尘央"
img: "https://img.alicdn.com/imgextra/i4/O1CN01W5X7L61wCAYmpcLHR_!!6000000006271-0-tps-685-383.jpg"
tags: ["practice"]
description: "今天，EventBridge 联合钉钉连接器，打通了钉钉生态和阿里云生态，钉钉的生态伙伴可以通过通道的能力驱动阿里云上海量的计算力。"
---

## 背景

以事件集成阿里云，从 EventBridge 开始”是 EventBridge 这款云产品的愿景和使命。作为一款无服务器事件总线服务，EventBridge 从发布以来，以标准化的 CloudEvents 1.0 协议连接了大量云产品和云事件，用户可以通过 EventBridge 轻松访问云上事件，驱动云上生态。

截止目前为止，EventBridge 已集成 85+ 阿里云产品，提供了 941+ 事件类型，集成 50+ SaaS产品，通过事件规则可轻松驱动 10+ 阿里系一方云产品的计算力。

![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491836935-17146771-964d-4e85-b58f-017175a177d3.gif#clientId=u2ba6174e-e813-4&height=1&id=CAA7l&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u02be674c-4fe2-48e7-993b-214c042ca6a&title=&width=1)![1.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491837045-3a1eb220-0c5e-4d4e-934b-35f406e801e3.png#clientId=u2ba6174e-e813-4&height=536&id=IKsQE&name=1.png&originHeight=536&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u8adc21b9-adb5-449d-afae-c90dbe381e5&title=&width=1080)

另一方面，钉钉生态空前繁荣，拥有 4000+ 家的生态伙伴，包括 ISV 生态伙伴、硬件生态伙伴、服务商、咨询生态和交付生态伙伴等。通过事件将钉钉生态与阿里云生态联通，是践行「云钉一体」战略的重要途径，EventBridge 作为阿里云标准化的事件枢纽，其重要性不言而喻。

今天，EventBridge 联合钉钉连接器，打通了钉钉生态和阿里云生态，钉钉的生态伙伴可以通过通道的能力驱动阿里云上海量的计算力。

## 关键技术

EventBridge 集成阿里云和钉钉生态的方案，核心能力由钉钉连接器和 EventBridge 的 HTTP 事件源能力提供。

### 钉钉连接器

钉钉连接平台通过可视化拖拽配置、一键订阅等零代码方式，简单高效的实现钉钉、企业内部系统、知名厂商系统（金蝶、用友、SAP 等）、钉钉第三方企业应用之间数据互通和集成。

![2.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491838724-8a484a0e-20de-43c7-b154-0e310712cb30.png#clientId=u2ba6174e-e813-4&height=282&id=Udix5&name=2.png&originHeight=282&originWidth=1013&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7b1f41f0-fdf4-452a-a5fd-f052150d2c5&title=&width=1013)

近期，钉钉连接器在「连接流」中发布了「HTTP Webhook」的执行动作能力，支持将钉钉生态开放给外部生态，EventBridge 正是通过该能力将钉钉生态接入到阿里云生态。

![3.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491836929-49d7c403-405d-4ec0-8ed0-c8b04da072d8.png#clientId=u2ba6174e-e813-4&height=786&id=mviIb&name=3.png&originHeight=786&originWidth=714&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1e810c44-2d6f-4e51-88c0-65c73f8da41&title=&width=714)

### EventBridge HTTP 事件源

事件源是事件驱动的基石，如何获取更多事件源也是 EventBridge 一直在探索和尝试的方向。针对市场上其他云厂商和垂直领域的 Saas 服务，EventBridge 发布了 HTTP 事件源能力，提供简单且易于集成的三方事件推送 ，帮助客户更加高效、便捷地实现业务上云。

![4.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491836834-20d67f07-4871-40be-a9ba-87dc67d36c0d.png#clientId=u2ba6174e-e813-4&height=427&id=PhFd0&name=4.png&originHeight=427&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6918f902-d875-4f33-902c-7f9c13ab55d&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491838982-aaedb785-8cd8-4e33-bb1a-5becc417562d.gif#clientId=u2ba6174e-e813-4&height=1&id=XO6C9&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9efb60cd-ce6f-491e-8763-2242ffd342c&title=&width=1)
具体而言，HTTP 事件源是 EventBridge 支持的事件源的一种，它以 Webhook 形式暴露了发布事件的 HTTP 请求地址，用户可以在有 URL 回调的场景配置 HTTP  事件源，或者直接使用最简单的 HTTP 客户端来完成事件的发布。HTTP  事件源提供了支持 HTTP 与 HTTPS，公网与阿里云 VPC 等不同请求方式、不同网络环境的 Webhook URL，便于用户将其集成到各类应用中。接入时无需使用客户端，仅需保证应用可以访问到对应 Webhook URL 即可，这使得接入过程变得简单而高效。

在将 HTTP 请求转换为 CloudEvent 的时候，EventBridge 会将请求的头部和消息体部分置于 CloudEvent 字段中，其余字段会依据用户 EventBridge 资源属性以及系统默认规则进行填充。用户可以在事件规则中，对所需的内容进行过滤、提取，最终按照模板拼装成所需的消息内容投递给事件目标。

![5.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491839341-0800a28e-a862-4314-8e61-dc42f35aebc6.png#clientId=u2ba6174e-e813-4&height=507&id=iZFVL&name=5.png&originHeight=507&originWidth=972&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u4bdba153-2311-41b5-a09f-9c96858bbfc&title=&width=972)

在安全方面，HTTP 事件源不需要用户进行复杂的签名鉴权，支持 3 种类型开箱即用的安全设置，分别是请求方法、源 IP 以及请求来源域名。

- 请求方法：用户可以配置当前请求此事件源时合法的 HTTP 请求方法，如果方法类型不满足配置规则，请求将被过滤，不会投递到事件总线。
- 源 IP：用户可以设置允许访问此事件源时合法的源 IP（支持 IP 段和 IP），当请求源 IP 不在设置的范围内时，请求将被过滤，不会投递到事件总线。
- 请求来源域名：即 HTTP 请求的 referer 字段，当请求的 referer 与用户配置不相符时，请求被过滤，不会投递到事件总线。

## 应用场景

钉钉连接器市场有数百款连接器，包含官方连接器和第三方生态连接器。

- 官方连接器，来源主要是钉钉官方的应用，比如视频会议、日程、通讯录、审批流、钉盘、宜搭等，企业和 SaaS 厂商可以充分利用这些官方应用的事件构建企业级的应用系统，也可以将钉钉的官方数据流与其他系统做深度集成。
- 第三方连接器，来源主要是钉钉的生态合作伙伴，比如金蝶、行翼云、集简云、用友、易快报、销帮帮等。SaaS 厂商可以通过开放连接器来开放数据，与其它应用互联互通。

![6.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491839384-8ee99a63-35ec-4cd7-b54a-fc0aea0f2e4c.png#clientId=u2ba6174e-e813-4&height=599&id=BMtmi&name=6.png&originHeight=599&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ud59c5677-fb30-4572-963d-bd01aff615e&title=&width=1080)

如上图所示，借助钉钉连接器，可以将钉钉官方事件源和钉钉 SaaS 事件源连接到阿里云 EventBridge，从而能驱动云上的弹性资源。SaaS 厂商能够借助 EventBridge 连接的能力快速构建云原生的 SaaS 应用，借助云的弹性能力，采用云原生最新的技术栈，快速高效地开发 SaaS 应用，同时利用 EventBridge 获取钉钉和其它 SaaS 应用的数据源，轻松进行业务创新。

当钉钉生态和 EventBridge 联通后，能产生哪些应用场景呢？

- 分析场景：企业借助 EventBridge 事件分析能力，对钉钉官方事件进行分析，快速洞察企业运转数据。比如审批效率，员工变更趋势、会议效率等。
- 通知场景：钉钉连接器 + EventBridge  可覆盖绝大多数消息通知场景，帮助企业用户快速感知 审批，员工变动，会议室信息等一些列企业基础支持系统。
- 集成场景：基于阿里云基础建设，可快速提升钉钉生态和企业内部数据的互通。例如当公司需要对钉钉和企业内部 IT 系统进行数据打通时，EventBridge 解决方案可以毫不费力地将建立在阿里云体系的 IT 系统连通起来，比如函数计算，云数据库，消息队列等连接扩展阿里云生态。
- EDA 场景：使用 EventBridge 快速构建 EDA 驱动的自动化业务流程。例如在新员工入职时，获取员工变动信息。并集中推送到邮箱系统，业务支持系统（DB），CRM 系统等。对企业新员工权限账户进行一站式授权，较少重复机械的业务审批流程。

## 最佳实践：新增员工 0 代码入库

本章节介绍使用钉钉连接器和 EventBridge 的最佳实践，通过一个例子展示如何 0 代码将钉钉的一个新员工入职记录录入到自定义的数据库当中，企业可以根据该数据库搭建各类员工管理系统。

### 方案简介

整个方案涉及到钉钉、钉钉连接器、EventBridge、阿里云数据库等产品，整个链路如下图所示：

![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491839522-7e586f31-4821-47da-8367-cf5cd1ddcee8.gif#clientId=u2ba6174e-e813-4&height=1&id=NTE5y&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u3bc64798-1c35-4f4b-8742-0901cac9696&title=&width=1)![7.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491839590-4ca9140a-0557-479d-a36a-ec4eed67b037.png#clientId=u2ba6174e-e813-4&height=247&id=FG9hc&name=7.png&originHeight=247&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u44c6a04f-044b-4350-b716-b7142ee9d47&title=&width=1080)
前置条件：

- 拥有一个钉钉账号，并创建一个团队成为管理员，并能登陆钉钉开放平台。
- 拥有一个阿里云账号，并开通 EventBridge 和阿里云数据库。

### 实践步骤

整个实践过程分为以下几个步骤。

#### 1）创建事件总线和 HTTP 事件源

首先登陆 EventBridge 控制台，创建一个事件总线和 HTTP 事件源，如下图所示，可以先跳过规则和目标的创建。

![8.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491839856-e595b77b-bcac-4a2e-8740-dada36c1e9fd.png#clientId=u2ba6174e-e813-4&height=859&id=kTtp0&name=8.png&originHeight=859&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub7c8d056-f7d9-4a6d-a8e6-64c876a08dc&title=&width=1080)

创建完成后，进入事件总线的详情列表，获取 HTTP 事件源的公网「Webhook 地址」，如下图所示：

#### ![9.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491840236-2c8ae4a7-1ad2-4113-a431-1444e22a4ec8.png#clientId=u2ba6174e-e813-4&height=606&id=iS2hS&name=9.png&originHeight=606&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf511cd6f-7b2d-4b19-a4fb-6aa7c89cad3&title=&width=1080)
#### 2）创建钉钉连接流

登陆钉钉开放平台，进入连接平台，在「我的连接」下创建连接流，在创建界面，选择触发器为「官方-通讯录-通讯录用户增加」。

![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491840395-c9c3d9ce-0b7a-476d-8e6b-77254bc018b2.gif#clientId=u2ba6174e-e813-4&height=1&id=VNeHG&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uefcd5ce8-2410-45e9-94da-d5bb3a7083a&title=&width=1)![10.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491840516-c9c0e09b-df31-48a1-934e-507785eaae9d.png#clientId=u2ba6174e-e813-4&height=681&id=zuIyB&name=10.png&originHeight=681&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uc59ac98c-a25f-43b6-a23e-8e7ce8e9d4c&title=&width=1080)

连接流创建完成后，进入编辑页面，添加一个「HTTP Webhook」的节点，在「请求地址」一栏填入上个步骤获取到的「HTTP 事件源」地址。

![11.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491840975-750ded52-7d79-498a-90ba-8916eee1817b.png#clientId=u2ba6174e-e813-4&height=922&id=CvgZ1&name=11.png&originHeight=922&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uec73e513-1095-48f0-9783-a7f25b8edde&title=&width=1080)
#### 
#### 3）钉钉触发新增员工事件


打开钉钉，进入团队，邀请另一个账号加入团队，然后进入事件总线的「事件追踪」页面，可以发现该员工新增事件已经投递到了事件总线之上。

![12.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491841066-196a8d53-687d-46c2-b0cd-7dfb905aa208.png#clientId=u2ba6174e-e813-4&height=313&id=enwlU&name=12.png&originHeight=313&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u37f4d4b9-efdd-4ec7-a114-2fe8a32ab9e&title=&width=1080)

该事件被转换成了一个「CloudEvents」格式，其「$.data.body」为事件的详情，包含 dingId, userId, department 等字段。


    {
      "datacontenttype": "application/json",
      "aliyunaccountid": "11*****48",
      "data": {
        "headers": {
        },
        "path": "/webhook/putEvents",
        "body": {
          "syncAction": "user_add_org",
          "orderInDepts": "{1:17626***32512}",
          "dingId": "$:***:$5RU***QhP/pK**+4A==",
          "active": true,
          "avatar": "",
          "isAdmin": false,
          "userId": "1411****46379",
          "isHide": false,
          "isLeaderInDepts": "{1:false}",
          "isBoss": false,
          "isSenior": false,
          "name": "小明",
          "department": [
            1
          ]
        },
        "httpMethod": "POST",
        "queryString": {}
      },
      "subject": "acs:eventbridge:cn-hangzhou:**:eventbus/**/eventsource/my.dingtalk",
      "aliyunoriginalaccountid": "118**48",
      "source": "my.dingtalk",
      "type": "eventbridge:Events:HTTPEvent",
      "aliyunpublishtime": "2022-05-13T07:28:29.505Z",
      "specversion": "1.0",
      "aliyuneventbusname": "chenyangbus",
      "id": "7059131c-**-**-b232-c4c3592120ae",
      "time": "2022-05-13T15:28:29.504+08:00",
      "aliyunregionid": "cn-hangzhou",
      "aliyunpublishaddr": "*.*.61.88"
    }



#### 4）数据库创建员工表


通过 RDS 控制台购买一个实例，并创建好数据库，然后根据上述新增员工事件的格式，提取部分字段对数据库进行建表。


    CREATE TABLE 'user_info' (
      'dingId' varchar(256) NULL,
      'active' varchar(256) NULL,
      'isAdmin' varchar(256) NULL,
      'userId' varchar(256) NULL,
      'name' varchar(256) NULL
    ) ENGINE=InnoDB
    DEFAULT CHARACTER SET=utf8;

#### 

#### 5）创建事件规则


数据库准备好后，返回 EventBridge 控制台，为第一步创建的事件总线创建事件规则，对「新增员工事件」进行转换并投递至数据库当中。

首先创建规则，过滤第一步创建的 HTTP 事件源。

![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491841088-fdfc2b17-8c8e-4fce-83fa-2878e67da676.gif#clientId=u2ba6174e-e813-4&height=1&id=ZNdz7&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u2d7f65d5-113d-454e-ab2a-130c1821ef0&title=&width=1)![13.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491841401-5d7f4da0-2f4e-49a2-bb47-8e153136564b.png#clientId=u2ba6174e-e813-4&height=336&id=uWh1y&name=13.png&originHeight=336&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua07910d7-4ee3-403e-bc3d-69ef4b4a7e8&title=&width=1080)

然后选择 RDS 目标，做好参数映射。
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491841560-3af20ed6-7499-43da-9acd-ab5d9fb4e324.gif#clientId=u2ba6174e-e813-4&height=1&id=UiT34&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua486071e-563d-40a1-8f1c-e2006b3277b&title=&width=1)
#### ![14.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491841797-682ba7cf-77b2-4347-a059-69059aaad266.png#clientId=u2ba6174e-e813-4&height=381&id=J74ht&name=14.png&originHeight=381&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uf9787f36-f583-4a65-8438-54713e0d71c&title=&width=1080)
#### 6）触发事件入库


第三步触发事件时，因未配置规则和目标，事件没有被消费，故需要通过钉钉重新触发一次事件，然后从 EventBridge 控制台观察推送轨迹。

![15.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491842041-0b46e844-eb70-4604-8734-7e09d153ff61.png#clientId=u2ba6174e-e813-4&height=487&id=ddGgL&name=15.png&originHeight=487&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u10786bea-8890-453e-b4d5-56e7775a31a&title=&width=1080)
从轨迹中可以看出推送成功，然后通过 RDS 控制台可以查询到该条记录。

![16.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491842092-aac238f3-6466-4fa9-8d17-1d358f69581a.png#clientId=u2ba6174e-e813-4&height=193&id=R92bB&name=16.png&originHeight=193&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7aab6397-fb44-4fb4-a42e-f722f821b56&title=&width=1080)
至此，一个钉钉团队新员工入职的记录通过 0 代码的方式入库到企业数据库当中，可以非常低的成本开发企业级管理应用。

_**参考链接：**_

[1] [阿里云 EventBridge 事件驱动架构实践](http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247518237&idx=1&sn=b97c106f238a72d9ea68367ed7d4012e&chksm=fae683d2cd910ac47a9070cb2af4646296086b6923fe6dca0b444c40d08491f4b17ada1d1eca&scene=21#wechat_redirect)

[2] [数据库应用集成](http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247524321&idx=2&sn=c06c162fb87f2caf8736a2e6f20636fe&chksm=fae6942ecd911d38fe767e4e8625a755b800c67f0a432f13609aee1f594d3cbe0903de8bf9d0&scene=21#wechat_redirect)

[3] [EDA 事件驱动架构与 EventBridge 二三事](http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247516149&idx=1&sn=1a0c0b562bbfb6df960a7f16b7fa3acd&chksm=fae6b43acd913d2ca0b5621f46b18488a796b23722d4664c8a116ae4a7e1ae66df9e2706f473&scene=21#wechat_redirect)

[4] [云事件驱动引擎EventBridge](http://mp.weixin.qq.com/s?__biz=MzU4NzU0MDIzOQ==&mid=2247502354&idx=2&sn=9e27b8292c562372a286012d7f53c7c0&chksm=fde8f872ca9f71640313776cb14899cb3686804925d6f33bcfe4e211e2e7ff92ec75af1332c7&scene=21#wechat_redirect)

[5][ “消息驱动、事件驱动、流 ”基础概念解析](http://mp.weixin.qq.com/s?__biz=MzUzNzYxNjAzMg==&mid=2247523343&idx=1&sn=54fb6f78cd444ce3e545eede5cc7e7c8&chksm=fae697c0cd911ed6623117aeb4ddd98e26b3c8641a5539ea0546090dec727ec6915860a997ea&scene=21#wechat_redirect)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)