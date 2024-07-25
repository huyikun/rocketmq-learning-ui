---
title: "Apache RocketMQ ACL 2.0 全新升级"
description: "Apache RocketMQ ACL 2.0 全新升级"
date: "2024-07-24"
tags: ["practice", "bestPractice"]
author: "徒钟"
img: "https://img.alicdn.com/imgextra/i4/O1CN01NkY3Jh27qRIaYQBkf_!!6000000007848-2-tps-496-276.png"
---

<a name="dibYq"></a>
## 引言
RocketMQ 作为一款流行的分布式消息中间件，被广泛应用于各种大型分布式系统和微服务中，承担着异步通信、系统解耦、削峰填谷和消息通知等重要的角色。随着技术的演进和业务规模的扩大，安全相关的挑战日益突出，消息系统的访问控制也变得尤为重要。然而，RocketMQ 现有的 ACL 1.0 版本已经无法满足未来的发展。因此，我们推出了 RocketMQ ACL 2.0 升级版，进一步提升 RocketMQ 数据的安全性。本文将介绍 RocketMQ ACL 2.0 的新特性、工作原理，以及相关的配置和实践。
<a name="jdxir"></a>
## 升级的背景
<a name="Lv69W"></a>
### ACL 1.0 痛点问题
![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803989383-9a388e3e-26c3-4ae9-ac1e-de321c2ea70f.webp#clientId=u19d2670f-b9c0-4&from=paste&id=u3f802884&originHeight=1196&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u5a0df2b0-ffbe-401d-b58b-0382414339e&title=)<br />RocketMQ ACL 1.0 的认证和授权流程如上图所示，在使用过程中，存在着以下痛点问题：

- 绕过访问控制的 IP 白名单：在标准安全实践中，IP 白名单通常用于限制客户端只能从特定 IP 或 IP 段访问资源。然而，ACL 1.0 中，IP 白名单被异常用于绕过鉴权验证的手段， 偏离了标准实践中的安全意图。这种设计上的偏差可能造成潜在的安全隐患，特别是在公网场景中，多个客户端共享同一个 IP 的情况下，会导致未授权的 IP 地址绕过正常的访问控制检查对集群中的数据进行访问。
- 缺乏管控 API 精细化控制：RocketMQ 提供了 130 多个管控 API，支持了集群配置，Topic、Group 的元数据管理，以及消息查询、位点重置等操作。这些操作涉及到敏感数据的处理，以及影响系统的稳定性。因此，根据用户不同角色或职责，精确定义可访问的 API 和数据范围变得至关重要。然而，ACL 1.0 仅对其中 9 个 API 进行了支持，包括 Topic、Group 元数据，以及Broker配置，剩下的 API 有可能被攻击者利用，对系统进行攻击，窃取敏感的数据。此外，要实施对这么多的管控 API 进行访问控制，现有的设计会导致大量的编码工作，并且在新增 API 时也增加了遗漏的风险。
- 缺少集群组件间访问控制：在 RocketMQ 架构中，涵盖了 NameServer、Broker 主从节点、Proxy 等多个关键组件。目前，这些组件之间的互相访问缺失了关键的的权限验证机制。因此，一但旦在集群外自行搭建 Broker 从节点或 Proxy 组件，便可以绕过现有的安全机制，访问并获取集群内的敏感数据，这无疑给系统的数据安全和集群的稳定性造成巨大的威胁。
<a name="li6JA"></a>
## 特性与原理
<a name="erftt"></a>
### ACL 2.0 新特性
![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803989374-f5125df4-eb23-4158-b2c9-d8939ae2cc13.webp#clientId=u19d2670f-b9c0-4&from=paste&id=u1fa71b00&originHeight=847&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u6935d19b-c43b-457f-b7fc-31e8c66079c&title=)<br />RocketMQ ACL 2.0 针对 ACL 1.0 中的问题进行了解决，同时还带来了六个主要的新特性，具体如下：

- 精细的API资源权限定义：ACL 2.0 对 RocketMQ 系统中所有的资源都进行了定义，包括集群、命名空间、主题、消费者组，以实现对所有类型的资源进行独立的访问控制。此外，它将所有的 API 都纳入权限控制范畴，覆盖了包括消息收发、集群管理、元数据等各项操作，确保所有资源的任何操作都施加了严格的权限控制。
- 授权资源的多种匹配模式：在资源众多的集群环境中，为每个资源进行逐一授权会带来繁复的配置过程和管理负担。因此，ACL 2.0 引入了三种灵活的匹配模式：完全匹配、前缀匹配，以及通配符匹配。这些模式可以让用户根据资源的命名规范和结构特点，快速地进行统一的设定，简化权限的管理操作，提升配置的效率。
- 支持集群组件间访问控制：由于将所有资源类型和API操作都纳入了访问控制体系，集群内部组件之间的连接和访问也受到了权限控制，包括 Broker 主从之间的 Leader 选举、数据复制的过程，以及 Proxy 到 Broker 的数据访问等环节，这可以有效地避免潜在的数据泄露问题和对系统稳定性的风险，加强了整个集群的安全性和可靠性。
- 用户认证和权限校验分离：通过对认证和授权这两个关键模块进行解耦，系统可以提供类似“只认证不鉴权”等方式的灵活选择，以适应各种不同场景的需求。此外，两个组件可以分别演进、独立发展，从而诞生出多样的认证方式和先进的鉴权方法。
- 安全性和性能之间的平衡：当启用 ACL 后，客户端的每次请求都必须会经过完整的认证和授权流程。这确保了系统的安全性，但同时也引入了性能上的开销。在 ACL 2.0 中，提供了无状态认证授权策略和有状态认证授权策略，来分别满足对安全有极致要求，以及安全可控但性能优先这两种不同的安全和性能需求。
- 灵活可扩展的插件化机制：当前市场上，认证方式存在多种实现，授权方式也有不同场景的定制需求。因此，ACL 2.0 设计了一套插件化的框架，在不同层面上进行接口的定义和抽象，以支持未来对认证和授权进行扩展，满足用户根据自身业务需求定制和实现相应的解决方案。
<a name="YVLOS"></a>
### 访问控制模型
基于角色的访问控制（RBAC）和基于属性的访问控制（ABAC）是访问控制体系中两种主要的方法。RocketMQ ACL 2.0 将这两种方法进行了融合，打造出了一套更加灵活和强大的访问控制系统。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803989390-8b36991e-3ff3-4ce4-b81d-f3a6babd1c67.webp#clientId=u19d2670f-b9c0-4&from=paste&id=u2893fbfd&originHeight=434&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ubee8a1a7-6667-4211-857c-05e65d8e655&title=)<br />RBAC 是基于角色的访问控制模型，通过角色进行权限的分配。RocketMQ ACL 2.0 将用户角色划分为超级用户（Super）和普通用户（Normal），超级用户具有最高级别的权限，能够无需授权即可访问资源，这简化了集群初始化及日常运维过程中的权限依赖问题。而普通用户在访问资源之前，需要被赋予相应的权限，适用于业务场景中，对资源进行按需访问。<br />ABAC 是基于属性的访问控制模型，通过用户、资源、环境、操作等多维属性来表达访问控制策略。RocketMQ ACL 2.0 为普通用户提供了这种灵活的访问控制机制。帮助管理员根据业务需求、用户职责等因素，对资源进行更加精细的访问控制。<br />在安全体系中，认证和授权分别扮演着不同的角色，RocetMQ ACL 2.0 将认证和授权进行了模块分离。这可以确保两个组件各司其职，降低系统的复杂度。认证服务致力于验证用户身份的合法性，而授权服务则专注于管理用户权限和访问控制。这样的划分不仅可以让代码更易于管理、维护和扩展，也为用户提供了使用上的灵活性。根据需求，用户可以选择单独启用认证或授权服务，也可以选择同时启用两者。这使得 RocketMQ ACL 既可以满足简单场景的快速部署，也能够适应复杂环境下对安全性的严格要求。
<a name="WV9EP"></a>
### 认证（Authentication）
认证作为一种安全机制，旨在验证发起访问请求者的身份真实性。它用于确保只有那些经过身份验证的合法用户或实体才能访问受保护的资源或执行特定的操作。简而言之，认证就是在资源或服务被访问之前回答“你是谁？”这个问题。<br />RocketMQ ACL 2.0 版本维持了与 ACL 1.0 相同的认证机制，即基于 AK/SK 的认证方式。这种方式主要通过对称加密技术来核验客户端的身份，保证敏感的认证信息（如密码）不会在网络上明文传输，从而提升了整体的认证安全性。
<a name="n6sKt"></a>
#### 主体模型
![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803989391-fcc581e8-7e9a-444d-b3e6-15fc71f83a5d.webp#clientId=u19d2670f-b9c0-4&from=paste&id=ud0ee6a26&originHeight=505&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=uf7a80736-0c06-4788-ac7d-464a90cab7b&title=)<br />为了提升 RocketMQ 系统的访问控制和权限管理，ACL 2.0 针对主体模型做了以下改进和扩展：

1. 统一主体模型的抽象：为了实现不同实体的访问控制和权限管理，设计了统一的主体接口，允许系统中多个实例作为资源访问的主体。用户作为访问资源的主体之一，按照该模型实现了主体的接口。这为未来新实体类型的权限适配提供了扩展能力。
2. 角色分级与权限赋予：
   - 超级用户：为了简化管理流程，超级用户被自动授予了全部权限，无需单独配置，从而简化了系统的初始化和日常的运维管理工作。
   - 普通用户：普通用户的权限则需要明确授权。ACL 2.0 提供了相关的权限管理工具，可以根据组织的政策和安全需求，为普通用户赋予合适的权限。
3. 支持用户状态管理：为了应对可能出现的安全风险，比如用户密码泄露，ACL 2.0 提供了用户的启用与禁用功能。当发生安全事件，可以通过禁用用户状态，快速进行止血，从而达到阻止非法访问的目的。
<a name="bekmn"></a>
#### 认证流程
![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803989402-c8a5cc3f-194d-4136-b6ed-81f3b3b6e9ff.webp#clientId=u19d2670f-b9c0-4&from=paste&id=uc00ebcd1&originHeight=653&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=udfbfe2b6-209c-409c-95ce-0f91467bd95&title=)<br />客户端流程：

1. 客户端在构建 RPC 请求时，检查是否设置了用户名和密码，若未配置，则直接发送请求；
2. 若已配置，则使用预设的加密算法对请求参数进行加密处理，并生成对应的数字签名（Signature）。
3. 在请求中附加用户名和 Signature，并将其发送至服务端以进行身份验证。

服务端流程：

1. 服务端接收到请求后，首先检查是否开启认证，若未开启，则不校验直接通过；若已开启了，则进入下一步。
2. 服务端对请求进行认证相关的参数进行解析和组装，获取包括用户名和 Signature 等信息。
3. 通过用户名在本地库中查询用户相关信息，用户不存在，则返回处理无；用户存在，则进入下一步。
4. 获取用户密码，采用相同的加密算法对请求进行加密生成 Signature，并和客户端传递的 Signature 进行比对，若两者一致，则认证成功，不一致，则认证失败。
<a name="d5WmN"></a>
### 授权（Authorization）
<a name="KHKIG"></a>
#### 核心概念
授权作为一种安全机制，旨在确定访问请求者是否拥有对特定资源进行操作的权限。简而言之，授权就是在资源被访问之前回答“谁在何种环境下对哪些资源执行何种操作”这个问题。<br />基于“属性的访问控制（ABAC）”模型，RocketMQ ACL 2.0 涵盖了以下一系列的核心概念。在系统实现中，都会以以下概念作为指导，完成整个权限管理和授权机制的设计和实现。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803989961-fd8e00a0-325e-48bf-b2ab-81a46000c544.webp#clientId=u19d2670f-b9c0-4&from=paste&id=ucab33c52&originHeight=1078&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u3e39113b-6489-49d3-8dc8-d74d6ca9f95&title=)
<a name="iJWW7"></a>
#### 权限模型
![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803989986-c2c849d0-bfa9-466c-910a-9923674aafed.webp#clientId=u19d2670f-b9c0-4&from=paste&id=ucffb724e&originHeight=608&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u5f1b764e-1206-4f22-b9d5-918c8f353b6&title=)<br />基于属性的访问控制（ABAC）模型的核心概念，ACL 2.0 对权限模型做了精心的设计，要点如下：

- 向后兼容的权限策略：默认情况下，ACL 2.0 只匹配和检验用户自定义的权限，若未找到匹配项，则视为无权限访问资源。但考虑到 ACL 1.0 中，存在默认权限的设置，允许对未匹配资源进行“无权限访问”和“有权限访问”的默认判定。因此，我们针对默认权限策略进行了兼容，确保 ACL 1.0 到 ACL 2.0 的无缝迁移。
- 灵活的资源匹配模式：在资源类型方面，ACL 2.0 支持了集群（Cluster）、命名空间（Namespace）、主题（Topic）、消费者组（Group）等类型，用于对不同类型的资源进行访问控制。在资源名称方面，引入了完全匹配（LITERAL）、前缀匹配（PREFIXED），以及通配符匹配（ANY）三种模式，方便用户根据资源的命名规范和结构，快速设定统一的访问规则，简化权限的管理。
- 精细的资源操作类型：在消息的发送和消费的接口方面，分别定义为 PUB 和 SUB 这两种操作。在集群和资源的管理的接口方面，分别定义为 CREATE、UPDATE、DELETE、LIST、GET 五种操作。通过这种操作类型的细化，可以帮助用户在资源的操作层面，无需关心具体的接口定义，简化对操作的理解和配置。
- 坚实的访问环境校验：在请求访问的环境方面，ACL 2.0 加入了客户端请求 IP 来源的校验，这个校验控制在每个资源的级别，可以精确到对每个资源进行控制。IP 来源可以是特定的 IP 地址或者是一个 IP 段，来满足不同粒度的 IP 访问控制，为系统的安全性增添一道坚实的防线。
<a name="NGG5m"></a>
#### 授权流程
![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803989953-8881404f-de9c-4345-b0e2-76973e195965.webp#clientId=u19d2670f-b9c0-4&from=paste&id=u41ba71f7&originHeight=698&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u1a433bc0-f1ce-41e0-a649-37009d7637d&title=)<br />客户端流程：

1. 客户端在构建 RPC 请求时，构建本次调用的接口入参，接口对应权限背后的操作定义。
2. 客户端在接口入参中设置本次访问的资源信息，然后将用户和资源等参数传递到服务端。

服务端流程：

1. 服务端在收到请求后，首先检查是否开启授权，若未开启，则不校验直接通过；若已开启了，则进入下一步。
2. 服务端对请求中和授权相关的参数进行解析和组装，这些数据包括用户信息、访问的资源、执行的操作，以及请求的环境等。
3. 通过用户名在本地数据存储中查询用户相关信息，若用户不存在，则返回错误；若用户存在，则进入下一步。
4. 判断当前用户是否是超级用户，若超级用户，则直接通过请求，无需做授权检查，若普通用户，则进入下一步进行详细的授权检查。
5. 根据用户名获取相关的授权策略列表，并对本次请求的资源、操作，以及环境进行匹配，同时按照优先级进行排序。
6. 根据优先级最高的授权策略做出决策，若授权策略允许该操作，则返回授权成功，若拒绝该操作，则返回无权限错误。
<a name="Z8mzA"></a>
#### 授权参数的解析
在 ACL 2.0 中，更具操作类型和请求频率，对授权相关参数（包括资源、操作等）的解析进行了优化。<br />1. 硬编码方式解析<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803989966-e6226b43-9957-48ec-98d6-1e6f1fc6f199.webp#clientId=u19d2670f-b9c0-4&from=paste&id=u7ea15250&originHeight=288&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ua1ab4175-6d65-42b9-b994-41f86497a36&title=)<br />对于消息发送和消费这类接口，参数相对较为复杂，且请求频次也相对较高。考虑到解析的便捷性和性能上的要求，采用硬编码的方式进行解析。<br />2. 注解方式解析<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/57656509/1721803990019-c8367768-db3a-4b29-bc83-ad48efd6f5b8.png#clientId=u19d2670f-b9c0-4&from=paste&id=uafc1fea2&originHeight=216&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ud2d727c5-dcd0-46b4-9a04-8035c49b225&title=)<br />对于大量的管控接口，采用硬编码的方式工作量巨大，且这些接口调用频次较低，对性能要求不高，所以采用注解的方式进行解析，提高编码效率。
<a name="FGOhP"></a>
#### 权限策略优先级
在权限策略匹配方面，由于支持了模糊的资源匹配模式，可能出现同一个资源对应多个权限策略。因此，需要一套优先级的机制来确定最终使用哪一套权限策略。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803990467-b227981e-fba4-448b-a214-75b9b1acc45e.webp#clientId=u19d2670f-b9c0-4&from=paste&id=uaeb9e4c4&originHeight=238&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ufcace113-ecb1-4056-91e8-ee2946f0e07&title=)<br />假设配置了以下授权策略，按照以上优先级资源的匹配情况如下：<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803990599-9f283369-9605-44f2-8ccc-1842425b9fc6.webp#clientId=u19d2670f-b9c0-4&from=paste&id=ua3c115e0&originHeight=347&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ua60b017f-a1ac-428f-a629-2fdc5e4383f&title=)
<a name="GioGK"></a>
### 认证授权策略
出于安全和性能的权衡和考虑，RocketMQ ACL 2.0 为认证和授权提供了两种策略：无状态认证授权策略（Stateless）和有状态认证授权策略（Stateful）。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803990432-662ad663-2402-4228-9f62-776cdd843e97.webp#clientId=u19d2670f-b9c0-4&from=paste&id=u88f08c1a&originHeight=382&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u68bbda23-6b3b-43f4-8b29-c22ea59e57b&title=)

- 无状态认证授权策略（Stateless）: 在这种策略下，每个请求都会经过独立的认证和授权过程，不依赖于任何先前的会话和状态信息。这种严格的策略可以保证更高级别的安全保证。对权限进行变更，可以更加实时的反应在随后的请求中，无需任何等待。然而，这种策略在高吞吐的场景中可能会导致显著的性能负担，如增加系统 CPU 的使用率以及请求的耗时。
- 有状态认证授权策略（Stateful）: 在这种策略下，同一个客户端连接，相同资源以及相同的操作下，第一次请求会经过完整的认证和授权，后续请求则不再进行重复认证和授权。这种方法可以有效地降低性能小号，减少请求的耗时，特别适合吞吐量较高的场景。但是，这种策略可能引入了安全上的妥协，对权限的变更也无法做到实时的生效。

在这两者策略的选择上，需要权衡系统的安全性要求和性能需求。如果系统对安全性的要求很高，并且可以容忍一定的性能损耗，那么无状态认证授权策略可能是更好的选择。相反，如果系统需要处理大量的并发请求，且可以在一定程度上放宽安全要求，那么有状态认证授权策略可能更合适。在实际部署时，还应该结合具体的业务场景和安全要求来做出决策。
<a name="F8faf"></a>
### 插件化机制
为了适应未来持续发展的认证鉴权方式，以及满足用户针对特定场景的定制需求，RocketMQ ACL 2.0 在多个环节上提供了灵活性和可扩展性。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803990419-7586d6c4-3581-4e89-8e8e-dc92ab7ca9a8.webp#clientId=u19d2670f-b9c0-4&from=paste&id=u94317cbd&originHeight=552&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=ubab34eb9-a036-4f0c-a29a-0702ee05e3b&title=)

- 认证和授权策略的扩展：默认情况下，RocketMQ ACL 2.0 提供了无状态认证授权策略（Stateless）和有状态认证授权策略（Stateful），以满足绝大多数用户对安全和性能的要求。但是，后续仍然可以探索出更优的策略，来兼顾安全和性能之间的平衡。
- 认证和授权方式的扩展：当前，在认证方面，市场上已经沉淀了多种成熟的实现，RocketMQ 目前只实现了其中一种，通过插件化的能力进行预留，未来可以轻松的引入更多的认证机制。在授权方面，RocketMQ 基于 ABAC 模型实现了一套主流的授权方式，以适应广泛的用户需求。但也提供了插件化的能力，方便未来能适配出更多贴合未来发展的解决方案。
- 认证和授权流程的编排：基于责任链设计模式，RocketMQ ACL 2.0 对其默认的认证和授权流程进行了灵活的编排。用户可以扩展或重写这些责任链节点，从而能够定制针对其具体业务场景的认证和授权逻辑。
- 用户和权限存储的扩展：RocketMQ 默认采用 RocksDB 在 Broker 节点上本地存储用户和权限数据。然而，通过实现预定义的接口，用户可以轻松地将这些数据迁移至任何第三方服务或存储系统中，从而优化其架构设计和操作效率。
<a name="keH47"></a>
### 审计日志
审计日志，用于记录和监控所有关于认证和授权的访问控制操作。通过升级日志，我们可以追踪到每一个访问的请求，确保系统的可靠性和安全性，同时，它也有助于问题的排查，进行安全的升级和满足合规的要求。<br />RocketMQ ACL 2.0 对认证和授权相关的审计日志都进行了支持，格式如下：

- 认证日志
```
# 认证成功日志
[AUTHENTICATION] User:rocketmq is authenticated success with Signature = eMX/+tH/7Bc0TObtDYMcK9Ls+gg=.

# 认证失败日志
[AUTHENTICATION] User:rocketmq is authenticated failed with Signature = eMX/+tH/7Bc0TObtDYMcK9Ls+xx=.
```

- 授权日志
```
# 授权成功日志
[AUTHORIZATION] Subject = User:rocketmq is Allow Action = Pub from sourceIp = 192.168.0.2 on resource = Topic:TP-TEST for request = 10.

# 授权失败日志
[AUTHORIZATION] Subject = User:rocketmq is Deny Action = Sub from sourceIp = 192.168.0.2 on resource = Topic:GID-TEST for request = 10.
```
<a name="XWEz0"></a>
## 配置与使用
<a name="MUu3B"></a>
### 部署架构
在部署架构方面，RocketMQ 提供了两种部署形态，分别是存算一体架构和存算分离架构。
<a name="jxeQD"></a>
#### 存算一体架构
![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803990523-8205c00f-b97c-4515-b726-15e6b342813a.webp#clientId=u19d2670f-b9c0-4&from=paste&id=uc1b8b719&originHeight=481&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=udd85534a-37dc-4b82-9ac8-f3063bdfd68&title=)<br />在 RocketMQ 存算一体架构中，Broker 组件同时承担了计算和存储的职责，并对外提供服务，接收所有客户端的访问请求。因此，由 Broker 组件承担认证和授权的重要角色。此外，Broker 组件还负责认证和授权相关的元数据的维护和存储。
<a name="uVLwY"></a>
#### 存算分离架构
![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803990800-e4466c6f-2f37-4ed7-9d13-efc7351d9a9b.webp#clientId=u19d2670f-b9c0-4&from=paste&id=u20eca57e&originHeight=476&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=udd095cdc-f6fd-4051-b02f-54cfb4f65b3&title=)<br />在 RocketMQ 存算分离架构中，存储由 Broker 组件负责，计算由 Proxy 组件负责，所有的对外请求都是由 Proxy 对外进行服务。因此，请求的认证和授权都由 Proxy 组件承担。Broker 承担元数据存储，为 Proxy 组件提供所需的认证和授权元数据的查询和管理服务。
<a name="ju5GA"></a>
### 集群配置
<a name="ngpzz"></a>
#### 认证配置

- 参数列表

想要在服务端开启认证功能，相关的参数和使用案例主要包含如下：<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803990923-c6447c22-6d82-45e9-a0e6-463ae759b042.webp#clientId=u19d2670f-b9c0-4&from=paste&id=u3a718685&originHeight=1648&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u09637866-c332-4fbc-95a0-75172cdf635&title=)

- Broker 配置
```
authenticationEnabled = true
authenticationProvider = org.apache.rocketmq.auth.authentication.provider.DefaultAuthenticationProvider
initAuthenticationUser = {"username":"rocketmq","password":"12345678"}
innerClientAuthenticationCredentials = {"accessKey":"rocketmq","secretKey":"12345678"}
authenticationMetadataProvider = org.apache.rocketmq.auth.authentication.provider.LocalAuthenticationMetadataProvider
```

- Proxy 配置
```
{
  "authenticationEnabled": true,
  "authenticationProvider": "org.apache.rocketmq.auth.authentication.provider.DefaultAuthenticationProvider",
  "authenticationMetadataProvider": "org.apache.rocketmq.proxy.auth.ProxyAuthenticationMetadataProvider",
  "innerClientAuthenticationCredentials": "{\"accessKey\":\"rocketmq\", \"secretKey\":\"12345678\"}"
}
```
<a name="Hg0gM"></a>
#### 授权配置

- 参数列表

想要在服务端开启授权功能，相关的参数和使用案例主要包含如下：<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803990907-5788758e-c0dd-4272-ba80-b38db3d8793e.webp#clientId=u19d2670f-b9c0-4&from=paste&id=u26d02018&originHeight=995&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u59567c62-2bee-40ca-aabe-5ea6746c3c2&title=)

- Broker 配置
```
authorizationEnabled = true
authorizationProvider = org.apache.rocketmq.auth.authorization.provider.DefaultAuthorizationProvider
authorizationMetadataProvider = org.apache.rocketmq.auth.authorization.provider.LocalAuthorizationMetadataProvider
```

- Proxy 配置
```
{
  "authorizationEnabled": true,
  "authorizationProvider": "org.apache.rocketmq.auth.authorization.provider.DefaultAuthorizationProvider",
  "authorizationMetadataProvider": "org.apache.rocketmq.proxy.auth.ProxyAuthorizationMetadataProvider"
}
```
<a name="C6NWV"></a>
### 如何使用
<a name="mp55h"></a>
#### 命令行使用
**用户管理**<br />关于 ACL 用户的管理，相关的接口定义和使用案例如下。

- 接口定义

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803990983-43bc5f04-827d-4fcc-8ee6-13e5d2b67484.webp#clientId=u19d2670f-b9c0-4&from=paste&id=u316fc66e&originHeight=561&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u8fa37c81-ad75-45eb-bb73-d8930b2b17e&title=)

- 使用案例
```
# 创建用户
sh mqadmin createUser -n 127.0.0.1:9876 -c DefaultCluster -u rocketmq -p rocketmq
# 创建用户，指定用户类型
sh mqadmin createUser -n 127.0.0.1:9876 -c DefaultCluster -u rocketmq -p rocketmq -t Super
# 更新用户
sh mqadmin updateUser -n 127.0.0.1:9876 -c DefaultCluster -u rocketmq -p 12345678
# 删除用户
sh mqadmin deleteUser -n 127.0.0.1:9876 -c DefaultCluster -u rocketmq
# 查询用户详情
sh mqadmin getUser -n 127.0.0.1:9876 -c DefaultCluster -u rocketmq
# 查询用户列表
sh mqadmin listUser -n 127.0.0.1:9876 -c DefaultCluster
# 查询用户列表，带过滤条件
sh mqadmin listUser -n 127.0.0.1:9876 -c DefaultCluster -f mq
```
**ACL 管理**<br />关于 ACL 授权的管理，相关的接口定义和使用案例如下。

- 接口定义

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803991071-f0af3408-bda0-4e9a-9ba5-e89cc9f10097.webp#clientId=u19d2670f-b9c0-4&from=paste&id=ud7b9d04f&originHeight=564&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u2ce80b8b-7021-4b75-a354-ece2550511b&title=)

- 使用案例
```
# 创建授权
sh mqadmin createAcl -n 127.0.0.1:9876 -c DefaultCluster -s User:rocketmq -r Topic:*,Group:* -a Pub,Sub -i 192.168.1.0/24 -d Allow
# 更新授权
sh mqadmin updateAcl -n 127.0.0.1:9876 -c DefaultCluster -s User:rocketmq -r Topic:*,Group:* -a Pub,Sub -i 192.168.1.0/24 -d Deny
# 删除授权
sh mqadmin deleteAcl -n 127.0.0.1:9876 -c DefaultCluster -s User:rocketmq
# 删除授权，指定资源
sh mqadmin deleteAcl -n 127.0.0.1:9876 -c DefaultCluster -s User:rocketmq -r Topic:*
# 查询授权列表
sh mqadmin listAcl -n 127.0.0.1:9876 -c DefaultCluster
# 查询授权列表，带过滤条件
sh mqadmin listAcl -n 127.0.0.1:9876 -c DefaultCluster -s User:rocketmq -r Topic:*
# 查询授权详情
sh mqadmin getAcl -n 127.0.0.1:9876 -c DefaultCluster -s User:rocketmq
```
<a name="Upxna"></a>
#### 客户端使用
关于 ACL 的使用，ACL 2.0 和 ACL 1.0 的使用方式一样，没有任何区别，具体参考官方案例。

- 消息发送
```
ClientServiceProvider provider = ClientServiceProvider.loadService();
StaticSessionCredentialsProvider sessionCredentialsProvider = 
  new StaticSessionCredentialsProvider(ACCESS_KEY, SECRET_KEY);
ClientConfiguration clientConfiguration = ClientConfiguration.newBuilder()
    .setEndpoints(ENDPOINTS)
    .setCredentialProvider(sessionCredentialsProvider)
    .build();
Producer producer = provider.newProducerBuilder()
    .setClientConfiguration(clientConfiguration)
    .setTopics(TOPICS)
    .build();
```

- 消息消费
```
ClientServiceProvider provider = ClientServiceProvider.loadService();
ClientConfiguration clientConfiguration = ClientConfiguration.newBuilder()
    .setEndpoints(ENDPOINTS)
    .setCredentialProvider(sessionCredentialsProvider)
    .build();
FilterExpression filterExpression = new FilterExpression(TAG, FilterExpressionType.TAG);
PushConsumer pushConsumer = provider.newPushConsumerBuilder()
    .setClientConfiguration(clientConfiguration)
    .setConsumerGroup(CONSUMER_GROUP)
    .setSubscriptionExpressions(Collections.singletonMap(TOPIC, filterExpression))
    .setMessageListener(messageView -> {
        return ConsumeResult.SUCCESS;
    })
    .build();
```
<a name="lY6PU"></a>
### 扩容与迁移
<a name="w3Y4q"></a>
#### 扩容
如果想要在运行过程中的集群扩容一台 Broker，就需要将所有的元数据都同步到这台新的 Broker 上，ACL 2.0 提供了相应的拷贝用户和拷贝授权的接口来支持这项操作。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803991252-f84a2c1e-e0f9-401e-a364-87b931f668b8.webp#clientId=u19d2670f-b9c0-4&from=paste&id=u5f954f13&originHeight=448&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u5bb7bc81-ee30-4a27-bf30-b292f2f611a&title=)

- 接口定义

![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803991333-f7377558-2f31-4616-884c-7a8d432b1004.webp#clientId=u19d2670f-b9c0-4&from=paste&id=u6f06d441&originHeight=249&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u11013842-3a0c-48e9-8655-157f4409530&title=)

- 使用案例
```
# 拷贝用户
sh mqadmin copyUser -n 127.0.0.1:9876 -f 192.168.0.1:10911 -t 192.168.0.2:10911
# 拷贝授权
sh mqadmin copyAcl -n 127.0.0.1:9876 -f 192.168.0.1:10911 -t 192.168.0.2:10911
```
<a name="BAGvo"></a>
#### 迁移
如果已经使用上了 ACL 1.0，想要无缝地迁移至 ACL 2.0，也提供了相应的解决方案，只需要做以下配置即可。<br />![](https://intranetproxy.alipay.com/skylark/lark/0/2024/webp/57656509/1721803991384-e4c6393a-5bd1-4f9d-8236-0a310d330002.webp#clientId=u19d2670f-b9c0-4&from=paste&id=u8f6d4799&originHeight=426&originWidth=1080&originalType=url&ratio=2&rotation=0&showTitle=false&status=done&style=none&taskId=u91f856ca-1e5d-4111-936e-52834e4307e&title=)

- 配置定义

在 Broker 的配置文件中开启以下配置：
```
migrateAuthFromV1Enabled = true
```

- 特别说明

启用以上配置后，将在 Broker 启动过程中自动触发执行。该迁移功能会把 ACL 1.0 中的用户权限信息写入 ACL 2.0 的相应存储结构中。<br />对于在 ACL 2.0 中尚未存在的用户和权限，系统将自动添加。对于已存在的用户和权限，迁移功能不会进行覆盖，以避免重写 ACL 2.0 中已经进行的任何修改。<br />ACL 1.0 中关于 IP 白名单，由于是用于绕过访问控制的检查，和 ACL 2.0 的行为不匹配，所以不会迁移到 ACL 2.0 中。如果已经使用相关的能力，请完成改造后再做迁移。
<a name="evjIA"></a>
## 规划与总结
<a name="SVKc6"></a>
### 规划
关于 RocketMQ ACL 的未来规划，可能会体现在以下两个方面：

- 丰富的认证和授权扩展：市场上存在丰富的认证和授权解决方案，其他的存储或计算产品也都采用了各种各样的实现方式。为了紧跟行业的发展趋势，RocketMQ ACL 未来也将努力创新，以满足更为广泛和多变的客户需求。同时，也将持续深化研究和发展更加出色的认证和授权策略，以达到安全性和性能之间的理想平衡。
- 可视化的用户权限操作：当前，在 ACL 中进行用户和权限的配置仅能通过命令行工具，不够友好。未来我们希望能在 RocketMQ Dashboard 上提供一个清晰、易用的可视化管理界面，从而简化配置流程并降低管理的技术门槛。另一方面，现有的 Dashboard 尚未集成 ACL 访问控制体系，后续也要将它纳入进来，以实现用户在 Dashboard 上对各项资源进行操作的访问权限。
<a name="RdbvY"></a>
### 总结
RocketMQ ACL 2.0 不管是在模型设计、可扩展性方面，还是安全性和性能方面都进行了全新的升级。旨在能够为用户提供精细化的访问控制，同时，简化权限的配置流程。欢迎大家尝试体验新版本，并应用在生产环境中。非常期待大家的在社区中反馈、讨论，和参与贡献，共同推进 RocketMQ 社区的成长和技术进步。
