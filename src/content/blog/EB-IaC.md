---
title: "EventBridge 特性介绍｜以  IaC 的方式使用 EventBridge"
date: "2022/04/10"
author: "王川（弗丁）"
img: "https://img.alicdn.com/imgextra/i2/O1CN01LJ8ywV1juVu8ZA3qP_!!6000000004608-0-tps-685-383.jpg"
tags: ["explore"]
description: "本文将重点介绍 EventBridge 和 IaC 的重点概念和特性，然后演示如何应用 IaC 理念自动化部署 EventBridge 来使用这些概念和特性。"
---
## 引言

EventBridge 作为构建 EDA 架构的基础设施，通过一些核心概念和特性提供了灵活丰富的事件收集、处理和路由的能力。对于不少用户来说，通过控制台里的便捷的引导来使用 EventBridge 应该是最快的上手方式。此外，也有很多用户面临着大量的云产品的管理，使用控制台管理每一个资源的方式变成了沉重的手工操作负担。

为了解决这个问题，现在已经能够通过 OpenAPI、terraform 等方式将 EventBridge 的能力方便快捷的带给用户。本文将重点介绍 EventBridge 和 IaC 的重点概念和特性，然后演示如何应用 IaC 理念自动化部署 EventBridge 来使用这些概念和特性。

## EventBridge 概述


### 事件驱动架构

事件驱动架构是一种松耦合、分布式的驱动架构，收集到某应用产生的事件后实时对事件采取必要的处理，紧接着路由至下游系统，无需等待系统响应。使用事件总线 EventBridge 可以构建各种简单或复杂的事件驱动架构，以标准化的 CloudEvents 1.0 协议连接云产品和应用、应用和应用等。

事件驱动架构体系架构具备以下三个能力：

- **事件收集：**负责收集各种应用发生的事件，如新建订单，退换货订单等其他状态变更；
- **事件处理：**对事件进行脱敏处理，并对事件进行初步的过滤和筛选；
- **事件路由：**分析事件内容并将事件路由分发至下游产品。

![640 (45).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491364006-798798da-92e9-4821-bf44-bf5ce179171f.png#clientId=ub53ea64b-fcbe-4&height=355&id=QoZ3I&name=640%20%2845%29.png&originHeight=355&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ub6850d02-3102-4a27-b057-fd80d172fea&title=&width=1080)

事件驱动架构具有以下优势：

- **降低耦合：**降低事件生产者和订阅者的耦合性。事件生产者只需关注事件的发生，无需关注事件如何处理以及被分发给哪些订阅者；任何一个环节出现故障，都不会影响其他业务正常运行；
- **异步执行：**事件驱动架构适用于异步场景，即便是需求高峰期，收集各种来源的事件后保留在事件总线中，然后逐步分发传递事件，不会造成系统拥塞或资源过剩的情况；
- **可扩展性：**事件驱动架构中路由和过滤能力支持划分服务，便于扩展和路由分发；
- **敏捷性：**事件驱动架构支持与各种阿里云产品和应用集成，支持事件路由至任何系统服务，提供各种敏捷高效的部署方案。



###  使用 EventBridge 构建 EDA 架构

事件总线 EventBridge 是阿里云提供的一款无服务器事件总线服务。EventBridge 提供的几个核心概念，可以满足构建 EDA 架构的需要。

![640 (46).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491363997-81791963-0ccc-4ba8-b338-516b1befc253.png#clientId=ub53ea64b-fcbe-4&height=808&id=BrSqJ&name=640%20%2846%29.png&originHeight=808&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ua48177fa-8e26-4e8b-aa40-1360fc54252&title=&width=1080)
![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491365810-808c76c0-df47-45fd-a685-08453fef7ee5.gif#clientId=ub53ea64b-fcbe-4&height=1&id=oXC6d&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u7532c365-c7ae-40b4-9f89-6a9fe1b1e42&title=&width=1)
事件总线 EventBridge 支持以下事件源：

- **阿里云官方事件源**
- **自定义事件源**

事件总线 EventBridge 的事件总线包括以下类型：

- **云服务专用事件总线：**一个无需创建且不可修改的内置事件总线，用于接收您的阿里云官方事件源的事件；阿里云官方事件源的事件只能发布到云服务专用总线；
- **自定义事件总线：**需要您自行创建并管理的事件总线，用于接收自定义应用或存量消息数据的事件；自定义应用或存量消息数据的事件只能发布到自定义总线。

在 EventBridge 中，一个事件规则包含以下内容：

- **事件模式：**用于过滤事件并将事件路由到事件目标；
- **事件目标：**包括事件的转换和处理，负责消费事件。

EventBridge 提供了简洁的事件模式匹配语法，同时具备灵活的事件转换能力，后面将会通过演示来展示一些具体的例子。

此外，EventBridge 还提供了一些增强能力，这些能力使得 EDA 架构中流经的事件更加透明，具备了开箱即用的观测和分析能力：

- **事件追踪：**可以查看发布到事件总线 EventBridge 的事件内容和处理轨迹；
- **事件分析：**对发布到事件总线的各种事件进行查询分析处理和可视化图表展示，以便发现事件内在价值。

![640 (47).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491364042-93d8efdc-1d3e-406d-ba4c-1c5dbe5e13b7.png#clientId=ub53ea64b-fcbe-4&height=382&id=CFChf&name=640%20%2847%29.png&originHeight=382&originWidth=960&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u280778f3-cd5d-479e-9234-3c90e310ba4&title=&width=960)

## IaC 简介

在介绍完事件总线 EventBridge 的相关基础内容后，接下来一起了解下 IaC。在 DevOps 的实践中，IaC 是非常重要的部分，通过将基础设施代码化，版本化，便可以轻松的借助版本控制工具来提供 single source of truth、协调多人合作的变更、实施严格的 review、借助一些 CI/CD pipeline 工具（甚至 GitOps）来自动触发部署。软件系统的开发者仅付出很小的努力去描述需求，就可以在几分钟后得到所需的虚拟机、网络等云上的服务，极大的缩短了部署时间，同时还能够保证多个环境的配置一致性，通过减少人为操作也降低了引入错误的概率。

IaC的代码实践中一般有两种方式，命令式和声明式。

- **命令式：**顾名思义，需要明确发出每一个动作的指令，描述的是 How，比如“创建一台 xx 规格的 ECS”。代码需要对每一步动作的顺序仔细编排，处理各种可能的错误，尤其要注意处理好每次变更对已经存在的资源的影响，否则稍有不慎就可能造成服务中断。举例来说，作为开发者可以通过自己熟悉的编程语言调用阿里云的 OpenAPI 来管理资源，因为这些 API 是类似 Create、Describe、Delete 等操作，这就是一种命令式的 IaC 实践。

- **声明式：**意味着开发者仅描述自己的需求终态是什么样子，即描述 What，比如“一台 xx 规格的 ECS”。熟悉 Kubernetes 的同学应该对这个概念很熟悉了。IaC 工具可以通过描述资源之间的依赖关系自动编排顺序，如果有已经存在的资源，则比对期望的状态和实际状态的差异，并根据差异做出更新；如果不存在，需要进行创建。可以看出，声明式对开发者非常友好，极大的降低了开发者的心智负担。

IaC 带来的优势：

- **降低成本：**有效管理资源，并减少为此投入的人力；
- **提升效率：**加快资源交付和软件部署的速度；
- **风险控制：**
   - 减少错误；
   - 提高基础架构一致性；
   - 消除配置偏移

terraform 作为 IaC 领域的佼佼者，提供了强大的自动化管理基础设施的能力。生态丰富，很多云厂商都提供了官方插件，阿里云的大多数产品（包括 EventBridge）都对 terraform 做了很全面的支持，使得跨多云部署基础设施变得极其简单。既然是 IaC，terraform 提供了自己的语言 HCL（hashicorp configuration language），HCL 具有类似 json 的简洁的语法，通过声明式的资源描述，可以让开发者快速上手。

## 动手实践


### 准备工作

- 安装 terraform cli 工具，可以参见 [_https://www.terraform.io/cli_](https://www.terraform.io/cli) 的内容。
- 创建一个 tf 文件 terraform.tf，内容如下（需要替换<>内的值）

    provider "alicloud" {
      access_key = "<your access key>"
      secret_key = "<your secret key>"
      region = "<region id>"
    }




###  案例1：通过钉钉监控云上资源变化

假设一个用户使用了很多云上的资源作为生产环境，需要感知线上资源的变更操作，一个可行的方案是利用 EventBridge 将来自于 ActionTrail 的审计事件投递到用户的钉钉。

首先根据钉钉官方文档创建一个机器人，记下 webhook url 和加签的秘钥，接下来会用到。

创建一个 tf 文件 1_actiontrail2dingding.tf，内容如下（需要替换<>内的值）



    # 案例1：通过钉钉监控云上资源变化
    # 目标：
    # - 熟悉部署使用EventBridge的default总线
    # - 熟悉EventBridge的事件模式匹配
    # - 熟悉EventBridge的事件转换配置

    # 声明一个default总线上的规则
    resource "alicloud_event_bridge_rule" "audit_notify" {
      # default总线默认存在，所以这里可以直接使用
      event_bus_name = "default"
      rule_name      = "audit_notify"
      description    = "demo"
      # 通过后缀匹配的方式过滤来自所有云产品事件源的ActionTrail:ApiCall事件
      # 其他更多模式匹配的介绍可以查阅文档：https://help.aliyun.com/document_detail/181432.html
      filter_pattern = jsonencode(
        {
          "type" : [
            {
              "suffix" : ":ActionTrail:ApiCall"
            }
          ]
        }
      )

      targets {
        target_id = "test-target"
        endpoint  = "<your dingtalk bot webhook url>"
        # type的取值可以查阅文档：https://registry.terraform.io/providers/aliyun/alicloud/latest/docs/resources/event_bridge_rule#type
        type      = "acs.dingtalk"
        # 每个事件目标都有一组对应的param_list，具体可以查阅文档：https://help.aliyun.com/document_detail/185887.html
        # 每一个param的form关系到事件转换的配置，可以查阅文档：https://help.aliyun.com/document_detail/181429.html
        param_list {
          resource_key = "URL"
          form         = "CONSTANT"
          value        = "<your dingtalk bot webhook url>"
        }
        param_list {
          resource_key = "SecretKey"
          form         = "CONSTANT"
          value        = "<your dingtalk bot secret key>"
        }
        # 这里展示了TEMPLATE类型的事件转换描述
        # value是使用jsonpath引用事件内容的字典，template则是模板内容，EventBridge最终会根据这两者结合事件本身渲染出这个参数的值
        param_list {
          resource_key = "Body"
          form         = "TEMPLATE"
          value        = jsonencode(
            {
              "source": "$.source",
              "type": "$.type"
              "region": "$.data.acsRegion",
              "accountId" : "$.data.userIdentity.accountId",
              "eventName" : "$.data.eventName",
            }
          )
          template = jsonencode(
            {
              "msgtype" : "text",
              "text" : {
                "content": "来自 {source} 的 {type} 审计事件：{accountId} 在 {region} 执行了 {eventName} 操作"
              }
            }
          )
        }
      }
    }



在命令行窗口依次执行命令：

- 初始化 terraform init
- 预览变更 terraform plan
- 应用变更 terraform apply

![image.gif](https://intranetproxy.alipay.com/skylark/lark/0/2023/gif/59356401/1680491363761-0dd8121e-8b73-4bd9-9542-b7515a9cee39.gif#clientId=ub53ea64b-fcbe-4&height=1&id=LEZHj&name=image.gif&originHeight=1&originWidth=1&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u40087170-2d11-4dec-97e7-459ceae5369&title=&width=1)
![640 (48).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491366319-03dc4bb2-96a4-4a2b-ad1b-cd6cad4b38c4.png#clientId=ub53ea64b-fcbe-4&height=573&id=ZZKsZ&name=640%20%2848%29.png&originHeight=573&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u5cc02484-4862-4907-938d-b13b035e1ba&title=&width=1080)
在云产品控制台进行操作，这里以 KMS 为例

![640 (49).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491366516-16655be4-8ba0-435d-8213-aa287d4a9dc7.png#clientId=ub53ea64b-fcbe-4&height=629&id=qKCEP&name=640%20%2849%29.png&originHeight=629&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u9731c220-7840-43c7-91ca-34493214f83&title=&width=1080)

钉钉上收到消息通知

![640 (50).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491366522-0b32fe1a-8be1-4705-9bcf-56475ffabfad.png#clientId=ub53ea64b-fcbe-4&height=294&id=IVRiR&name=640%20%2850%29.png&originHeight=294&originWidth=960&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=ubd94db5b-6b8a-4abb-a682-1f3be4a7475&title=&width=960)

在 EventBridge 控制台查看事件轨迹

![640 (51).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491366580-cca2b7df-87da-46b4-9bf5-bd2b888002f4.png#clientId=ub53ea64b-fcbe-4&height=519&id=COdws&name=640%20%2851%29.png&originHeight=519&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u936804e6-6430-45be-9794-fef9e707239&title=&width=1080)
### 案例 2：自定义总线触发 FunctionCompute

假设一个用户的应用会产生一些事件，其中一个链路是通过 FunctionCompute 对这些事件进行弹性的处理。那么就可以通过 EventBridge 的自定义事件源和函数计算事件目标来实现这个方案。

创建一个模拟对事件进行处理的 python 脚本文件 src/index.py，内容如下：


    # -*- coding: utf-8 -*-
    import logging

    def handler(event, context):
      logger = logging.getLogger()
      logger.info('evt: ' + str(event))
      return str(event)
      


创建一个 tf 文件 2_trigger_function.tf，内容如下（需要替换<>内的值）


# 案例2：自定义总线触发FunctionCompute
# 目标：
# - 熟悉部署使用EventBridge的自定义总线
# - 熟悉"自定义应用"事件源配置
# - 熟悉“FunctionCompute”事件目标配置


# 由于用户自己产生的事件需要投递到自定义总线，这里声明一个叫demo_event_bus的自定义总线
resource "alicloud_event_bridge_event_bus" "demo_event_bus" {
  event_bus_name = "demo_event_bus"
  description    = "demo"
}

# 声明一个在demo_event_bus总线上的自定义事件源，用于通过sdk或者控制台向EventBridge投递事件
resource "alicloud_event_bridge_event_source" "demo_event_source" {
  event_bus_name         = alicloud_event_bridge_event_bus.demo_event_bus.event_bus_name
  event_source_name      = "demo_event_source"
  description            = "demo"
  linked_external_source = false
}

# 声明一个叫fc_service的函数计算服务，publish=true意味着会立即部署上传的函数代码。
resource "alicloud_fc_service" "fc_service" {
  name        = "eb-fc-service"
  description = "demo"
  publish     = true
}

# 将前面准备的python脚本文件打包成zip用于部署到函数计算
data "archive_file" "code" {
  type        = "zip"
  source_file = "{path.module}/src/index.py"
  output_path = "{path.module}/code.zip"
}

# 声明一个fc_service服务中的函数，其中filename引用了上面描述的zip包，会将这个代码包上传。
resource "alicloud_fc_function" "fc_function" {
  service     = alicloud_fc_service.fc_service.name
  name        = "eb-fc-function"
  description = "demo"
  filename    = data.archive_file.code.output_path
  memory_size = "128"
  runtime     = "python3"
  handler     = "index.handler"
}

# 声明一个在demo_event_bus总线上的规则
resource "alicloud_event_bridge_rule" "demo_rule" {
  event_bus_name = alicloud_event_bridge_event_bus.demo_event_bus.event_bus_name
  rule_name      = "demo_rule"
  description    = "demo"
  # 通过匹配source过滤来自于前面创建的自定义事件源的事件
  filter_pattern = jsonencode(
    {
      "source" : ["{alicloud_event_bridge_event_source.demo_event_source.id}"]
    }
  )

  targets {
    target_id = "demo-fc-target"
    # type的取值可以查阅文档：https://registry.terraform.io/providers/aliyun/alicloud/latest/docs/resources/event_bridge_rule#type
    type      = "acs.fc.function"
    endpoint  = "acs:fc:<region id>:<your account id>:services/{alicloud_fc_service.fc_service.name}.LATEST/functions/{alicloud_fc_function.fc_function.name}"
    param_list {
      resource_key = "serviceName"
      form         = "CONSTANT"
      value        = alicloud_fc_service.fc_service.name
    }
    param_list {
      resource_key = "functionName"
      form         = "CONSTANT"
      value        = alicloud_fc_function.fc_function.name
    }
    param_list {
      resource_key = "Qualifier"
      form         = "CONSTANT"
      value        = "LATEST"
    }
    # 注意form=ORIGINAL意味着每次投递事件都会将事件的原始内容作为这个参数的值
    param_list {
      resource_key = "Body"
      form         = "ORIGINAL"
    }
  }
}


在命令行窗口依次执行命令

- 初始化 terraform init
- 预览变更 terraform plan
- 应用变更 terraform apply

![640 (52).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491366566-3ade7840-45c2-4854-a392-a19aa935fdd0.png#clientId=ub53ea64b-fcbe-4&height=633&id=qVICT&name=640%20%2852%29.png&originHeight=633&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=uea77055b-5134-427a-95db-6f7d9087ef5&title=&width=1080)

在控制台模拟自定义事件源发布事件

![640 (53).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491367210-22a79b62-9608-427f-b808-57ccbce25ac1.png#clientId=ub53ea64b-fcbe-4&height=631&id=TXD0q&name=640%20%2853%29.png&originHeight=631&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1c28d231-413e-48d7-8f9d-ee6a90f21fa&title=&width=1080)

在 FunctionCompute 的控制台页面查看函数调用日志

![640 (54).png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491367311-c5eb08f1-8155-45a0-811f-d1d3f02be62a.png#clientId=ub53ea64b-fcbe-4&height=485&id=m3NWT&name=640%20%2854%29.png&originHeight=485&originWidth=960&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u6232f107-e944-48df-8e75-a2390a474ec&title=&width=960)

在 EventBridge 控制台查看事件轨迹

![55.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/59356401/1680491367379-8c18765f-b73b-4d45-a270-072b473c4f2f.png#clientId=ub53ea64b-fcbe-4&height=491&id=qOKLW&name=55.png&originHeight=491&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&taskId=u1fd1d9dd-4cf1-4c44-bc5d-9367aed262e&title=&width=1080)
**_总结_**

EventBridge 作为构建 EDA 架构的基础设施，通过一些核心概念和特性提供了灵活丰富的事件收集、处理和路由的能力，并支持通过 OpenAPI、terraform 等方式将这些能力方便快捷的带给用户。本文介绍了 EventBridge 和 IaC 的重点概念和特性，然后演示了如何应用 IaC 理念自动化部署 EventBridge 来使用这些概念和特性。

期待大家可以发掘更多利用 EventBridge 快速搭建 EDA 架构的 idea，并使用 terraform 快捷的将这些 idea 变为现实。

## 相关链接

[1] 阿里云 terraform 文档
[_https://help.aliyun.com/product/95817.html_](https://help.aliyun.com/product/95817.html)

[2] terraform registry 文档
[_https://registry.terraform.io/providers/aliyun/alicloud/latest/docs/resources/event_bridge_event_bus_](https://registry.terraform.io/providers/aliyun/alicloud/latest/docs/resources/event_bridge_event_bus)

[3] 钉钉官方文档
[_https://open.dingtalk.com/document/group/custom-robot-access_](https://open.dingtalk.com/document/group/custom-robot-access)

# 活动推荐

阿里云基于 Apache RocketMQ 构建的企业级产品-消息队列RocketMQ 5.0版现开启活动：

1、新用户首次购买包年包月，即可享受全系列 85折优惠！ 了解活动详情：[https://www.aliyun.com/product/rocketmq](https://www.aliyun.com/product/rocketmq)

![e728c42e80cb67bf020e646e58619bcd.jpg](https://intranetproxy.alipay.com/skylark/lark/0/2023/jpeg/59356401/1680576637562-9af35fbf-d64b-4f81-b950-7e72f91b5ca2.jpeg#clientId=u449ffa34-59ce-4&from=paste&height=675&id=u462ad3c6&name=e728c42e80cb67bf020e646e58619bcd.jpg&originHeight=675&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&size=258156&status=done&style=none&taskId=u26cea311-dc98-45bd-8c8c-c7884e57c37&title=&width=1920)
