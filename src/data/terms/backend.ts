import type { Term } from './types';

/** backend 领域术语 */
export const BE_BACKEND: Term[] = [
  // ==================== 架构风格 ====================
  {
    id: 'be-monolith',
    name: '单体架构',
    en: 'Monolithic Architecture',
    cat: 'backend',
    sub: '架构风格',
    tags: ['架构', '软件工程', '基础'],
    summary: '将所有业务功能打包在一个应用中统一开发、测试与部署，结构简单直接，是项目起步期的默认选择。',
    detail: `将整个应用（界面、业务逻辑、数据访问）打包为**一个进程**统一开发与部署。
**解决什么问题**：起步期的快速交付——无分布式复杂性，一个代码库、一次部署即可运行。
**关键机制**：
- 模块间通过**进程内函数调用**协作，无网络开销
- 共享同一数据库，天然享受 **ACID 事务**的一致性
- 整体打包复制多实例，挂负载均衡即可水平扩展
**实践要点**：单体不等于不能扩展，早期往往是最优解；但团队与代码规模增长后，构建变慢、模块边界模糊、"改一处、全量发布"的困境会显现，此时再向微服务演进——拆分要先划清边界，再动代码。`,
    relations: [
      { to: 'be-microservices', desc: '业务与团队复杂到一定程度后，单体常演进为微服务' },
      { to: 'be-lb', desc: '单体通过多实例加负载均衡即可实现水平扩展' },
      { to: 'be-acid', desc: '共享数据库让单体天然获得 ACID 事务一致性' },
      { to: 'ops-ci', desc: '单体构建产物单一，CI/CD 流水线简单直接' },
    ],
    interview: '面试常问"单体 vs 微服务怎么选"：从团队规模、业务边界清晰度、部署频率、运维能力四个维度回答，并强调"先单体后按需拆分"是主流路径，避免为微服务而微服务。',
  },
  {
    id: 'be-microservices',
    name: '微服务',
    en: 'Microservices',
    cat: 'backend',
    sub: '架构风格',
    tags: ['架构', '微服务', '分布式'],
    summary: '按业务边界把系统拆为一组独立部署的小服务，各服务可独立开发、扩展与容错，是大型系统的主流形态。',
    detail: `按**业务边界**把系统拆成一组可独立开发、测试、部署的小服务，服务间通过网络接口通信。
**解决什么问题**：单体在大型团队中的协作阻塞、全局发布风险与局部扩容困难。
**关键机制**：
- 每个服务对应一个业务能力，**数据私有**（独享数据库）
- 服务间用 **RPC/REST** 同步调用，或经**消息队列**异步解耦
- 依赖**注册中心**互相发现，用**熔断限流**防雪崩，用**链路追踪**排障
**代价与误区**：分布式复杂性（网络抖动、最终一致、跨服务排障）显著上升；拆分过细会得到"分布式单体"——调用链长、发布仍要协同，比单体更糟。DDD 的限界上下文是划定边界的首选方法。`,
    relations: [
      { to: 'be-ddd', desc: '用限界上下文划定微服务边界的核心方法论' },
      { to: 'be-registry', desc: '服务实例动态变化，依赖注册中心互相发现' },
      { to: 'be-circuit-breaker', desc: '调用链放大故障，需要熔断限流降级防雪崩' },
      { to: 'ops-k8s', desc: 'K8s 是微服务编排部署的事实标准底座' },
    ],
    interview: '高频考点：微服务拆分原则——按业务能力/限界上下文拆、数据库私有、接口版本化；能说出拆得过细的坏处（分布式事务、运维成本、调用链过长）体现真实经验。',
  },
  {
    id: 'be-soa',
    name: 'SOA',
    en: 'Service-Oriented Architecture',
    cat: 'backend',
    sub: '架构风格',
    tags: ['架构', '企业集成', '历史演进'],
    summary: '把系统能力封装为可复用的服务，经企业服务总线（ESB）集成互通的企业级架构，是微服务的前身。',
    detail: `**面向服务架构**：将系统能力封装为可复用的"服务"，通过标准接口集成。
**解决什么问题**：企业内多套异构系统（不同语言、平台）重复建设、难以互通。
**关键机制**：
- 服务经 **ESB（企业服务总线）**接入：负责路由、协议转换、消息编排
- 接口契约多用 **SOAP/WSDL** 等重量级 Web Service 标准
- 强调服务**复用与集中治理**，粒度偏粗
**与微服务的区别**：SOA 依赖中心化 ESB、服务于企业系统集成；微服务去中心化（服务直连或轻量网关）、粒度更细、围绕业务能力独立部署。可以把 SOA 理解为微服务的思想前身。`,
    relations: [
      { to: 'be-microservices', desc: '微服务是 SOA 思想的轻量化演进，去掉了中心化 ESB' },
      { to: 'be-middleware', desc: 'ESB 本质是承担集成逻辑的重量级中间件' },
      { to: 'be-api-gateway', desc: '微服务用轻量 API 网关接管了 ESB 的大部分职责' },
    ],
    interview: '对比记忆四组词：ESB vs API 网关、SOAP vs REST、粗粒度 vs 细粒度服务、中心化治理 vs 去中心化自治。',
  },
  {
    id: 'be-service-mesh',
    name: '服务网格',
    en: 'Service Mesh',
    cat: 'backend',
    sub: '架构风格',
    tags: ['架构', '微服务', '云原生'],
    summary: '在服务旁注入 Sidecar 代理接管所有进出流量，把重试、加密、灰度等治理能力从业务代码下沉到基础设施。',
    detail: `处理服务间通信的**基础设施层**：每个服务旁注入一个 **Sidecar 代理**（如 Envoy），所有出入流量都经过它。
**解决什么问题**：服务数量多时，治理逻辑要在各语言 SDK 中重复实现、升级困难。
**关键机制**：
- **数据平面**：Sidecar 拦截并处理真实流量（重试、熔断、mTLS 加密、灰度）
- **控制平面**（如 Istio）：统一下发路由规则与安全策略
- 业务代码**零侵入**，多语言团队无需各自维护治理库
**误区**：网格带来每跳代理的延迟与运维复杂度，中小规模用 SDK + K8s 通常更简单；服务多、语言杂、灰度要求高时收益才明显。`,
    relations: [
      { to: 'be-microservices', desc: '服务网格是微服务治理逻辑下沉到基础设施的形态' },
      { to: 'ops-k8s', desc: 'Sidecar 以容器形式与业务容器共存于同一 Pod' },
      { to: 'be-tracing', desc: 'Sidecar 统一注入 Trace 上下文，天然产出链路数据' },
      { to: 'be-api-gateway', desc: '网关管南北向入口流量，网格管东西向服务间流量' },
    ],
    interview: '关键词：Sidecar、数据面/控制面、东西向流量、mTLS；能对比 SDK 方案（Spring Cloud）说明零侵入与多语言成本即算掌握。',
  },
  {
    id: 'be-eda',
    name: '事件驱动架构',
    en: 'Event-Driven Architecture',
    cat: 'backend',
    sub: '架构风格',
    tags: ['架构', '异步', '消息'],
    summary: '组件间不直接调用，通过发布与订阅异步协作的架构风格，天然解耦削峰，适合高并发与状态传播场景。',
    detail: `组件间不直接调用，而是通过**产生与消费事件**协作：生产者发布事件到**消息通道**，一个或多个消费者订阅响应。
**解决什么问题**：同步调用链的阻塞、级联故障与突发流量冲击。
**关键机制**：
- **发布/订阅**：生产者不关心谁消费，双方互不感知、可独立伸缩
- 事件可**重放**，消费者故障恢复后能追平进度
- 常与 **CQRS** 搭配：写侧发布事件，读侧异步更新查询视图
**误区**：异步链路带来**最终一致性**与排查难度（消息丢失、重复消费需幂等设计）；强一致的核心交易（如扣款）往往仍用同步事务，事件化要有取舍。`,
    relations: [
      { to: 'be-mq', desc: '消息队列是事件驱动架构最常用的传输载体' },
      { to: 'be-cqrs', desc: '写侧事件异步刷新读模型，是 CQRS 的经典实现' },
      { to: 'be-microservices', desc: '微服务间用事件通信可深度解耦、独立演进' },
      { to: 'emb-mqtt', desc: 'MQTT 的发布/订阅是嵌入式侧的轻量事件通信' },
    ],
    interview: '考点：事件驱动 vs 请求响应的取舍——解耦削峰 vs 一致性与排障成本；能结合下单后发短信/加积分的例子说明异步化即可。',
  },
  {
    id: 'be-cqrs',
    name: 'CQRS',
    en: 'Command Query Responsibility Segregation',
    cat: 'backend',
    sub: '架构风格',
    tags: ['架构', '读写分离', '建模'],
    summary: '把改变状态的写操作与只读查询拆成两个模型分别设计优化，写侧经事件同步到读模型，各取所长。',
    detail: `**命令查询职责分离**：把改变状态的**命令**（写）与不改变状态的**查询**（读）拆成两个模型。
**解决什么问题**：读写诉求差异大——写入要严格校验与事务，查询要灵活多变、高性能，单一模型顾此失彼。
**关键机制**：
- 写模型负责业务规则与**事务一致性**；读模型按查询需求物化
- 写侧变更以**事件**形式（常经消息队列）同步到读模型，读模型最终一致
- 常与**事件溯源（Event Sourcing）**搭配出现
**误区**：复杂度高，读写比例悬殊或查询形态复杂时才值得用；不要一上来就拆两个库，可先在代码层分离命令与查询对象，按需再物理拆分。`,
    relations: [
      { to: 'be-eda', desc: '写侧通过事件驱动刷新读模型，是 CQRS 的经典实现' },
      { to: 'be-ddd', desc: 'DDD 聚合适合作写模型，CQRS 常在 DDD 项目中落地' },
      { to: 'be-read-write-split', desc: '库级读写分离是数据层简化版，CQRS 是模型级分离' },
      { to: 'be-sharding', desc: '读模型可独立冗余与分片，缓解海量查询压力' },
    ],
  },
  {
    id: 'be-ddd',
    name: '领域驱动设计 DDD',
    en: 'Domain-Driven Design',
    cat: 'backend',
    sub: '架构风格',
    tags: ['架构', '建模', '方法论'],
    summary: '以业务模型为中心的软件设计方法论，用限界上下文划分边界、通用语言统一认知，指导微服务拆分。',
    detail: `**Domain-Driven Design**：以对业务的深入建模为中心，让代码结构与业务语言一致。
**解决什么问题**：技术实现与业务脱节，复杂业务系统"改一处、崩三处"。
**核心概念**：
- **通用语言**：业务与技术共用一套词汇，减少翻译损耗
- **限界上下文**：一个模型适用的边界，是微服务拆分的天然依据
- **聚合/实体/值对象**：聚合根保证事务边界内的一致性
- **领域事件**：描述业务上有意义的事，驱动上下文间协作
**误区**：DDD 不是框架也不是万能药，适合业务规则复杂的领域；战术模式（实体、仓储）用得再多，不先划好限界上下文也是白费。`,
    relations: [
      { to: 'be-microservices', desc: '限界上下文是微服务划分边界的最佳指导' },
      { to: 'be-cqrs', desc: 'DDD 聚合作为写模型，与 CQRS 天然互补' },
      { to: 'be-eda', desc: '领域事件是上下文之间集成协作的主要手段' },
    ],
    interview: '高频题："什么是限界上下文？如何指导微服务拆分？"——答上下文映射、防腐层，以及"一个微服务对应一个限界上下文、独享数据库"。',
  },
  {
    id: 'be-bff',
    name: 'BFF',
    en: 'Backend for Frontend',
    cat: 'backend',
    sub: '架构风格',
    tags: ['架构', '聚合', '多端'],
    summary: '为每类终端单独建一个聚合裁剪下游数据的服务层，让接口贴合页面结构，减少前端的请求往返。',
    detail: `**Backend for Frontend**：为特定前端（Web、App、小程序）各建一个专属后端层，负责**聚合、裁剪与编排**下游数据。
**解决什么问题**：多端诉求不同导致接口爆炸——App 要精简字段、Web 要聚合多服务数据，前端被迫多次往返。
**关键机制**：
- BFF 调多个下游服务，**合并裁剪**成贴合页面结构的响应
- 端侧通用逻辑（鉴权转换、缓存、埋点）收敛在 BFF
- 常用 **GraphQL** 实现，让前端自选字段
**误区**：BFF 是胶水层，不应沉淀业务规则，否则变成臃肿中间层；每端一个 BFF 由对应前端团队自治，避免共用大杂烩。`,
    relations: [
      { to: 'be-api-gateway', desc: '网关管通用入口策略，BFF 管端侧数据聚合，常配合部署' },
      { to: 'be-graphql', desc: 'GraphQL 是实现 BFF 字段级聚合的主流方案' },
      { to: 'fe-spa', desc: 'SPA 页面结构多变，BFF 为其聚合裁剪接口减少往返' },
      { to: 'be-microservices', desc: 'BFF 屏蔽微服务拆分细节，给前端稳定的数据视图' },
    ],
  },

  // ==================== 通信与接口 ====================
  {
    id: 'be-middleware',
    name: '中间件',
    en: 'Middleware',
    cat: 'backend',
    sub: '通信与接口',
    tags: ['基础设施', '架构', '组件'],
    summary: '介于操作系统与应用之间提供通用能力的软件层，如消息队列、缓存、网关，让应用专注业务逻辑。',
    detail: `位于**操作系统与应用之间**、为应用提供通用能力的软件层。
**解决什么问题**：让应用复用通信、存储、调度等横切能力，屏蔽异构环境差异，专注业务。
**常见类别**：
- **消息中间件**：Kafka、RocketMQ——异步解耦、削峰填谷
- **缓存中间件**：Redis——加速热点数据读取
- **网关/注册中心**：统一入口与服务发现
- 注意语境：Web 框架里的 **middleware** 另有所指，指请求处理管道中的拦截函数（鉴权、日志），与系统级中间件不是一回事
**要点**：中间件是全局稳定性依赖，需要像业务系统一样做高可用与容量规划。`,
    relations: [
      { to: 'be-mq', desc: '消息队列是最典型的异步消息中间件' },
      { to: 'be-redis', desc: 'Redis 是最常用的缓存中间件' },
      { to: 'be-api-gateway', desc: 'API 网关属于流量控制类中间件' },
      { to: 'be-soa', desc: 'SOA 时代的 ESB 是承担集成职责的重量级中间件' },
    ],
  },
  {
    id: 'be-rpc',
    name: 'RPC',
    en: 'Remote Procedure Call',
    cat: 'backend',
    sub: '通信与接口',
    tags: ['通信', '接口', '微服务'],
    summary: '让调用远端服务像调用本地函数一样自然的通信技术，常基于二进制序列化与长连接，面向内部高性能场景。',
    detail: `**远程过程调用**：屏蔽网络细节，调用远程服务**像调用本地函数一样**——定义接口、传参、拿返回值。
**解决什么问题**：手工构造网络请求、解析响应繁琐且易错。
**关键机制**：
- **序列化**：参数与返回值编码为二进制（如 Protobuf），比 JSON 更小更快
- **代码生成**：客户端存根与服务端骨架由 IDL（接口定义语言）生成
- 底层常基于 **TCP 或 HTTP/2 长连接**多路复用
**与 REST 的区别**：RPC 面向"动作"（getUserById），强类型、高性能，适合内部服务互调；REST 面向"资源"，语义通用、调试友好，适合对外开放。`,
    relations: [
      { to: 'be-grpc', desc: 'gRPC 是当前最主流的 RPC 框架' },
      { to: 'net-tcp', desc: 'RPC 的高性能依赖 TCP 长连接与可靠传输' },
      { to: 'be-registry', desc: '调用前需从注册中心获取服务提供者地址' },
      { to: 'be-rest', desc: 'REST 面向资源、RPC 面向动作，两种接口风格取向' },
    ],
    interview: '高频题："RPC 与 HTTP 接口的区别"——RPC 并非与 HTTP 对立（可跑在 HTTP/2 上），区别在序列化效率、IDL 契约、治理集成度与使用场景（内部 vs 对外）。',
  },
  {
    id: 'be-rest',
    name: 'REST',
    en: 'Representational State Transfer',
    cat: 'backend',
    sub: '通信与接口',
    tags: ['接口', 'HTTP', '架构风格'],
    summary: '面向资源的接口风格，用 URL 定位资源、标准 HTTP 方法表达操作，无状态、语义清晰，是 Web API 事实标准。',
    detail: `一种**架构风格**（而非协议）：把一切抽象为**资源**，用 URL 定位、用标准 HTTP 方法表达操作。
**解决什么问题**：异构系统间接口的统一语义与可预测性。
**关键原则**：
- **资源化 URL**：/users/42 而非 /getUser?id=42
- **方法语义**：GET 查、POST 建、PUT 全量改、PATCH 部分改、DELETE 删
- **无状态**：每个请求自含全部上下文（如 Token），便于水平扩展
- 正确使用**状态码**（200/201/400/401/404/500）
**要点**：实操中"RESTful"程度常打折（动词混入 URL），要能指出并解释取舍；与 RPC 相比性能不如二进制协议，但生态与调试体验胜出。`,
    relations: [
      { to: 'net-http', desc: 'REST 完全构建在 HTTP 方法与状态码语义之上' },
      { to: 'be-grpc', desc: '常见组合：内部高性能调用用 gRPC，对外开放用 REST' },
      { to: 'be-api-gateway', desc: 'REST API 通常经网关统一暴露、鉴权与限流' },
      { to: 'fe-spa', desc: '前端 SPA 通过 REST API 与后端交换 JSON 数据' },
    ],
    interview: '高频题："设计一个 RESTful 接口"——资源命名复数、方法与状态码语义、版本号、分页过滤；追问"REST 为什么无状态、无状态怎么做登录"引出 Token/JWT。',
    example: `GET    /api/v1/articles?page=2&size=10   # 列表
POST   /api/v1/articles                  # 创建 → 201
GET    /api/v1/articles/42               # 详情
PATCH  /api/v1/articles/42               # 部分更新
DELETE /api/v1/articles/42               # 删除 → 204`,
    exampleLang: 'http',
  },
  {
    id: 'be-grpc',
    name: 'gRPC',
    en: 'gRPC',
    cat: 'backend',
    sub: '通信与接口',
    tags: ['RPC', '微服务', '高性能'],
    summary: '基于 HTTP/2 与 Protobuf 的高性能远程调用框架，强类型契约、支持四种流式通信，适合内部微服务互调。',
    detail: `Google 开源的**高性能 RPC 框架**：用 **Protobuf** 定义服务契约（.proto）并生成多语言代码，默认跑在 **HTTP/2** 上。
**解决什么问题**：JSON 文本协议在内部海量调用时的体积、性能与契约松散问题。
**关键机制**：
- **Protobuf 二进制序列化**：比 JSON 小 3~5 倍，编解码更快
- **HTTP/2 多路复用**：一条连接并发多个请求，避免队头阻塞
- **四种通信模式**：一元、服务端流、客户端流、双向流
- 强类型 IDL：接口变更直接编译报错，契约安全
**要点**：二进制报文不可直接阅读、浏览器原生支持有限，因此 gRPC 多用于**内部东西向调用**，对外仍常配 REST 网关。`,
    relations: [
      { to: 'be-rpc', desc: 'gRPC 是 RPC 理念的工业级实现' },
      { to: 'net-http', desc: '建立在 HTTP/2 之上，靠多路复用提升并发' },
      { to: 'be-rest', desc: '与 REST 构成"内部 gRPC + 外部 REST"的常见组合' },
      { to: 'be-service-mesh', desc: '网格 Sidecar 可透明代理 gRPC 流量并注入治理' },
    ],
    example: `// user.proto
syntax = "proto3";
service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc ListUsers (Page) returns (stream User); // 服务端流
}
message GetUserRequest { int64 id = 1; }`,
    exampleLang: 'protobuf',
  },
  {
    id: 'be-graphql',
    name: 'GraphQL',
    en: 'GraphQL',
    cat: 'backend',
    sub: '通信与接口',
    tags: ['接口', '查询语言', '聚合'],
    summary: 'API 查询语言，客户端按需声明所需字段，一次请求取齐多源数据，解决过度获取与多次往返问题。',
    detail: `Facebook 开源的 **API 查询语言与运行时**：客户端在请求里**声明需要哪些字段**，服务端按声明精确返回。
**解决什么问题**：REST 的**过度获取**（返回冗余字段）与**多次往返**（一个页面打多个接口）。
**关键机制**：
- **单一端点**（通常 POST /graphql）+ **Schema 类型系统**自文档化
- 客户端按需取字段，一次查询聚合多资源
- **Resolver** 解析每个字段、可对接任意数据源——天然适配 BFF 聚合层
**误区**：难以按 URL 缓存、限流粒度变粗，需限制查询深度防恶意复杂查询；N+1 问题要靠 DataLoader 批量处理；内部小 API 用 REST 往往更省事。`,
    relations: [
      { to: 'be-bff', desc: 'GraphQL 是实现 BFF 按端聚合的主流技术' },
      { to: 'fe-spa', desc: '前端按页面需要精确取数，减少请求数与冗余字段' },
      { to: 'be-rest', desc: '与 REST 互补：资源粒度简单通用 vs 字段粒度灵活聚合' },
    ],
    example: `query {
  user(id: 42) {
    name
    posts(last: 3) { title }   # 只取声明的字段
  }
}`,
    exampleLang: 'graphql',
  },
  {
    id: 'be-api-gateway',
    name: 'API 网关',
    en: 'API Gateway',
    cat: 'backend',
    sub: '通信与接口',
    tags: ['网关', '流量入口', '微服务'],
    summary: '系统的统一流量入口，集中处理认证、限流、路由与协议转换等横切逻辑，是微服务的守门人。',
    detail: `部署在所有客户端与后端服务之间的**统一入口**。
**解决什么问题**：认证、限流、日志等横切逻辑散落在每个微服务中，重复且难统一管理。
**关键机制**：
- **路由转发**：按路径/头部把请求转发到对应微服务
- **认证鉴权**：统一校验 JWT/OAuth，向下传递用户上下文
- **流量防护**：限流、熔断、黑白名单
- **协议转换与轻量聚合**：对外 REST、对内 gRPC
**辨析**：负载均衡工作在连接/IP 层做分发；网关是七层业务入口，理解路由与身份。与 BFF 的分工：网关管通用策略，BFF 管端侧数据形态。常见实现：Nginx、Kong、Spring Cloud Gateway。`,
    relations: [
      { to: 'be-lb', desc: '请求通常先经负载均衡分发到网关实例，两者分层协作' },
      { to: 'be-jwt', desc: '网关统一验签 JWT，微服务内部免重复鉴权' },
      { to: 'be-microservices', desc: '微服务架构中网关是收敛接口、隔离内部结构的守门人' },
      { to: 'net-proxy', desc: '网关本质是叠加了业务能力的七层反向代理' },
    ],
    interview: '高频题："网关与 Nginx 反代的区别"——Nginx 偏通用转发，网关在其上叠加认证、限流、灰度、聚合等业务级能力；另注意网关自身要无状态可水平扩展，避免成为单点。',
    example: `# Nginx 反向代理 + 传递用户身份
location /api/user/ {
    proxy_pass http://user-service:8080/;
    proxy_set_header X-User-Id $jwt_claim_sub;
}`,
    exampleLang: 'nginx',
  },
  {
    id: 'be-lb',
    name: '负载均衡',
    en: 'Load Balancing',
    cat: 'backend',
    sub: '通信与接口',
    tags: ['流量', '高可用', '扩展'],
    summary: '把请求按策略分发到多个后端实例，消除单点并提升整体吞吐，是系统水平扩展与高可用的第一道分流。',
    detail: `将流量按策略分发到多个后端实例。
**解决什么问题**：单实例容量有限且宕机即不可用；负载均衡让系统**水平扩展**并**自动剔除故障节点**。
**关键机制**：
- **四层（L4）**：基于 IP+端口转发（如 LVS），性能高、不解析内容
- **七层（L7）**：基于 HTTP 内容转发（如 Nginx），可按路径/域名分流
- **常见算法**：轮询、加权轮询、最少连接、源地址哈希（会话保持）
- 结合**健康检查**自动摘除不健康实例
**要点**：LB 自身需高可用（主备/云 LB）；后端服务应尽量无状态才能任意分发，有会话时用粘性会话或外置存储。`,
    relations: [
      { to: 'ops-k8s-service', desc: 'K8s Service 内置集群级负载均衡，把流量分给 Pod' },
      { to: 'be-health-check', desc: '健康检查结果决定实例是否留在负载均衡池' },
      { to: 'be-api-gateway', desc: '请求常先经 LB 再到网关，两层各司其职' },
      { to: 'net-proxy', desc: '反向代理是最常见的七层负载均衡实现' },
    ],
    interview: '高频题："四层与七层负载均衡的区别？常见算法与适用场景？"——L4 高性能不解析内容，L7 可按业务路由；哈希做会话保持，加权应对异构实例。',
  },

  // ==================== 数据与存储 ====================
  {
    id: 'be-rdbms',
    name: '关系型数据库',
    en: 'RDBMS',
    cat: 'backend',
    sub: '数据与存储',
    tags: ['数据库', '存储', 'SQL'],
    summary: '以表、行、列与 SQL 管理结构化数据的数据库，靠事务与约束保证强一致，是业务系统的数据基石。',
    detail: `基于**关系模型**的数据库：数据组织为**表**，用 **SQL** 查询，靠主键、外键、约束表达数据关系。代表：MySQL、PostgreSQL、Oracle。
**解决什么问题**：业务数据的**强一致与可靠存储**——账务、订单等不容出错的场景。
**关键机制**：
- **ACID 事务**：操作要么全成要么全败
- **B+ 树索引**：加速等值与范围查询
- **约束与范式**：从结构上防止脏数据
- **锁与 MVCC**：并发下读写互不阻塞（InnoDB）
**要点**：数据量大后先做读写分离、分库分表，再考虑换 NoSQL；不要为"大数据量"过早放弃事务能力——多数系统九成数据仍是关系型的。`,
    relations: [
      { to: 'be-acid', desc: '关系型数据库是 ACID 事务最主要的承载者' },
      { to: 'be-index', desc: 'B+ 树索引是关系库查询优化的第一手段' },
      { to: 'be-sharding', desc: '单库容量与写入到达瓶颈后，演进方向是分库分表' },
      { to: 'be-orm', desc: 'ORM 在对象世界与关系表之间做映射' },
    ],
    interview: '高频题："为什么业务系统默认选 MySQL/PostgreSQL？"——事务、一致性、生态与团队熟悉度；能讲清 B+ 树为何适合磁盘（矮胖、叶子链表利于范围扫描）是加分项。',
  },
  {
    id: 'be-nosql',
    name: 'NoSQL',
    en: 'Not Only SQL',
    cat: 'backend',
    sub: '数据与存储',
    tags: ['数据库', '存储', '扩展性'],
    summary: 'KV、文档、宽列、图等不依赖关系模型的数据库统称，以灵活模型与水平扩展见长，常与关系库混用。',
    detail: `不依赖关系模型的数据库总称，四大类型：**KV 存储**（Redis）、**文档库**（MongoDB）、**宽列/列族**（Cassandra、HBase）、**图库**（Neo4j）。
**解决什么问题**：海量数据、高并发写入下，关系库的固定 Schema 与扩展成本成为瓶颈。
**关键机制**：
- **灵活 Schema**：文档字段随需增减，免迁移
- **水平分片**：数据按 key 分布到多节点，扩容即加机器
- 多为**最终一致**（BASE），用副本与共识协议保可用
**选型**：结构稳定、多表事务选关系库；模型多变、超大规模写入、单对象整体读写选 NoSQL——两者是互补而非替代，主流系统都混用。`,
    relations: [
      { to: 'be-rdbms', desc: '与关系型数据库互补，按数据特征选型' },
      { to: 'be-cap', desc: '多数 NoSQL 选择 AP，牺牲强一致换取可用性' },
      { to: 'be-base', desc: '最终一致性是 NoSQL 的理论基石' },
      { to: 'be-redis', desc: 'Redis 是 KV 型 NoSQL 的代表，常做缓存层' },
    ],
    interview: '高频题："什么时候不用关系型数据库？"——模型天然文档化、写入量级远超单库极限、JOIN 成本高于冗余；但要能说出跨文档事务缺失的代价。',
  },
  {
    id: 'be-acid',
    name: 'ACID 事务',
    en: 'ACID Transaction',
    cat: 'backend',
    sub: '数据与存储',
    tags: ['数据库', '事务', '一致性'],
    summary: '事务的四大特性——原子性、一致性、隔离性、持久性，保证并发与故障之下数据依然正确。',
    detail: `数据库事务的**四大特性**：**A 原子性**（要么全做要么全不做）、**C 一致性**（数据从一个合法状态到另一个合法状态）、**I 隔离性**（并发事务互不干扰）、**D 持久性**（提交后断电不丢）。
**解决什么问题**：并发读写与中途故障导致的数据错乱，如转账扣款一半失败。
**实现机制**：
- 原子性 → **undo log** 回滚
- 持久性 → **redo log** 崩溃恢复（WAL：先写日志再写数据）
- 隔离性 → **锁 + MVCC**，分四个隔离级别
**要点**：隔离级别越严性能越低；MySQL 默认可重复读。分布式下 ACID 难以兼得，由此引出 CAP 与 BASE。`,
    relations: [
      { to: 'be-rdbms', desc: 'RDBMS 是 ACID 的标准实现场所' },
      { to: 'be-cap', desc: '分布式下强一致与可用难兼得，是 ACID 理想的边界' },
      { to: 'be-base', desc: 'BASE 是放弃强隔离后对 ACID 的松化替代' },
      { to: 'ops-backup-dr', desc: '持久性之外，极端故障还需备份与多副本兜底' },
    ],
    interview: '必考：四个特性各自的实现机制（undo/redo/锁+MVCC）；四个隔离级别与脏读、不可重复读、幻读的对应关系。',
  },
  {
    id: 'be-index',
    name: '索引',
    en: 'Index',
    cat: 'backend',
    sub: '数据与存储',
    tags: ['数据库', '性能', 'B+树'],
    summary: '以额外存储换查询加速的有序数据结构（常为 B+ 树），让百万级数据的查找从全表扫描变为毫秒定位。',
    detail: `为加速查询而建的**有序数据结构**，关系库最常用 **B+ 树**。
**解决什么问题**：无索引只能全表扫描，百万行查询秒级耗时；索引把查找降为树上的 O(log n) 路径。
**关键机制**：
- **B+ 树**：矮胖多层、叶子用链表串联——等值快、范围扫描也快
- **聚簇索引**（主键，叶子存整行）与**二级索引**（叶子存主键，需回表）
- **联合索引**遵循**最左前缀**原则；覆盖索引可免回表
- 写入需同步维护所有索引——**索引不是越多越好**
**误区**：低区分度列建索引几乎无效；对列套函数会使索引失效；索引也占空间并拖慢写入。`,
    relations: [
      { to: 'be-rdbms', desc: '索引是关系型数据库查询优化的第一手段' },
      { to: 'be-sharding', desc: '分表后各表仍需独立索引，全局唯一要额外设计' },
      { to: 'agent-vector-db', desc: '向量库的 HNSW 等结构是索引思想在高维检索上的延伸' },
    ],
    interview: '必考："为什么用 B+ 树而不是红黑树/哈希/B 树？"——磁盘 IO 次数（矮胖）、范围查询（叶子链表）、哈希无法排序；联合索引最左前缀与回表是追问热点。',
  },
  {
    id: 'be-sharding',
    name: '分库分表',
    en: 'Database Sharding',
    cat: 'backend',
    sub: '数据与存储',
    tags: ['数据库', '扩展', '分布式'],
    summary: '把单张大表的数据按键值水平拆到多个库表中，突破单机存储与写入瓶颈，是海量数据场景的必经之路。',
    detail: `把大表数据按**分片键**（如用户 ID）**水平拆分**到多个库、多张表。
**解决什么问题**：单库连接数、磁盘容量、写入 QPS 有物理上限，索引再优化也救不了百亿行。
**关键机制**：
- **垂直拆分**：按业务把不同表拆到不同库（先做）
- **水平拆分**：同表数据按 hash 或 range 散到 N 个库
- **分片路由**：中间件（如 ShardingSphere）解析 SQL 定位目标库表
- **全局唯一 ID**：雪花算法等替代自增主键
**误区**：跨分片 JOIN、聚合、事务变难；分片键选错造成数据倾斜与全片扫描。原则：先垂直后水平，读写分离能解决就不急着分片。`,
    relations: [
      { to: 'be-read-write-split', desc: '读写分离解读压力，分片解数据量与写压力，常先后实施' },
      { to: 'be-rdbms', desc: '关系库容量与写入到达瓶颈后的演进手段' },
      { to: 'be-cap', desc: '数据分布到多节点后必须面对一致性与可用性权衡' },
      { to: 'be-replication', desc: '每个分片内部仍要做主从复制保证高可用' },
    ],
    interview: '高频题："分片键怎么选？"——高频查询条件、数据均匀、避免热点；追问"跨片分页/事务怎么办"——异构索引表、冗余字段、最终一致对账。',
  },
  {
    id: 'be-read-write-split',
    name: '读写分离',
    en: 'Read-Write Splitting',
    cat: 'backend',
    sub: '数据与存储',
    tags: ['数据库', '扩展', '高可用'],
    summary: '写入走主库、查询走从库的架构，用多副本分摊读压力，是应对读多写少场景最经济的扩展手段。',
    detail: `主库负责**写**，一个或多个从库负责**读**，数据经**主从复制**同步。
**解决什么问题**：读多写少场景（多数互联网业务读占九成以上）单库读性能不足。
**关键机制**：
- 应用或代理层（如 ShardingSphere）**路由 SQL**
- 从库可加多个，读能力近线性扩展
- 主库故障可提升从库为主，兼顾高可用
**核心陷阱——主从延迟**：写完立刻读，从库可能尚未同步。对策：关键读强制走主库、会话内粘主库、半同步复制。
**与分库分表的关系**：读写分离只解决读扩展，不解决数据量与写瓶颈，量大时两者叠加使用。`,
    relations: [
      { to: 'be-replication', desc: '主从复制是读写分离的数据同步基础' },
      { to: 'be-rdbms', desc: '读多写少场景下关系库最常用的扩展手段' },
      { to: 'be-sharding', desc: '读写分离缓解读压力，分片解决容量与写压力' },
    ],
  },
  {
    id: 'be-replication',
    name: '主从复制',
    en: 'Master-Slave Replication',
    cat: 'backend',
    sub: '数据与存储',
    tags: ['数据库', '高可用', '副本'],
    summary: '主库写入、从库实时同步数据的机制，提供读扩展、热备与故障切换能力，是数据库高可用的基石。',
    detail: `主库把数据变更记录到 **binlog**，从库拉取并重放，保持一致。
**解决什么问题**：单点故障与读瓶颈——有副本才有**热备、读写分离与故障切换**。
**关键机制**（MySQL 为例）：
- 主库写 **binlog**；从库 IO 线程拉取写入**中继日志**
- SQL 线程重放日志，异步执行
- **三种模式**：异步（默认，可能丢数据）、半同步（至少一从库确认）、组复制（多节点共识）
**要点**：主从延迟是常态，需监控 Seconds_Behind_Master；切换要用成熟工具避免**脑裂**（两个主库同时可写导致数据分叉）。`,
    relations: [
      { to: 'be-read-write-split', desc: '复制是读写分离的技术前提' },
      { to: 'ops-backup-dr', desc: '多副本与异地复制是容灾体系的核心组成' },
      { to: 'be-rdbms', desc: '关系库的标准高可用手段，NoSQL 多副本思想同源' },
      { to: 'be-cap', desc: '多副本必然引入一致性与可用性的权衡' },
    ],
    interview: '高频题："异步与半同步复制的取舍？"——性能 vs 数据安全；"主从延迟怎么处理？"——监控、关键读走主库、GTID 等待、并行复制优化。',
  },
  {
    id: 'be-cap',
    name: 'CAP 定理',
    en: 'CAP Theorem',
    cat: 'backend',
    sub: '数据与存储',
    tags: ['分布式', '理论', '一致性'],
    summary: '分布式系统中一致性、可用性、分区容错三者最多同时满足两个；分区不可避免，实际只能权衡 C 与 A。',
    detail: `分布式系统三个性质——**C 一致性**（所有节点读到相同数据）、**A 可用性**（每个请求都得到响应）、**P 分区容错**（网络分区时系统仍能工作）——**最多同时满足两个**。
**关键结论**：网络分区在分布式环境中必然发生，P 不可放弃，真正的选择是**分区发生时保 C 还是保 A**。
- **CP**：分区时拒绝写入保一致（ZooKeeper、etcd）
- **AP**：分区时继续响应但可能读到旧值（Eureka、Cassandra）
- 无分区时可同时享受 C 与 A，这正是日常运行状态
**误区**：CAP 是分区瞬间的取舍，不是永久的非黑即白；同一系统不同数据可有不同选择（订单 CP、评论 AP）。`,
    relations: [
      { to: 'be-base', desc: 'BASE 是在 CAP 中选择 AP 之后的工程化落地' },
      { to: 'be-replication', desc: '多副本复制正是 CAP 讨论的典型场景' },
      { to: 'be-nosql', desc: 'NoSQL 的 AP/CP 取舍是定理的典型应用' },
      { to: 'be-acid', desc: '单机强一致事务在分布式下被迫让渡给 CAP 权衡' },
    ],
    interview: '高频题："为什么 P 不能放弃？举例说明 CP/AP 系统分区时的行为"——能讲出 ZooKeeper 选举期间不可写、Eureka 自我保护机制才算真懂。',
  },
  {
    id: 'be-base',
    name: 'BASE 理论',
    en: 'BASE Theory',
    cat: 'backend',
    sub: '数据与存储',
    tags: ['分布式', '理论', '最终一致'],
    summary: '基本可用、软状态、最终一致——AP 路线的工程化理论，接受短暂不一致换取高可用与扩展性。',
    detail: `对 ACID 的**松化**：**BA 基本可用**（过载或分区时允许降级响应）、**S 软状态**（允许存在中间态与副本不一致）、**E 最终一致**（停止写入后一段时间数据收敛一致）。
**解决什么问题**：CAP 选择可用性之后，如何给出可工程化的指导而非放任混乱。
**典型手段**：
- 异步复制 + 读时容忍旧值
- 消息队列重试直到消费成功
- 定时**对账任务**兜底纠偏
**要点**：最终一致不是"不一致没关系"，而是要**能感知收敛进度并兜底**；业务上要明确"多久之内必须一致"。与 ACID 是场景选择，不是优劣关系。`,
    relations: [
      { to: 'be-cap', desc: 'BASE 是选择 AP 后的落地方法论' },
      { to: 'be-acid', desc: '与 ACID 相对，代表弱一致路线' },
      { to: 'be-mq', desc: '消息重试与对账是最终一致的核心工程手段' },
      { to: 'be-eda', desc: '事件驱动的异步集成天然运行在 BASE 语义下' },
    ],
  },
  {
    id: 'be-cache',
    name: '缓存',
    en: 'Cache',
    cat: 'backend',
    sub: '数据与存储',
    tags: ['性能', '缓存', '高并发'],
    summary: '把热点数据放到更快的存储层，用空间与一致性成本换读性能，是高并发系统的第一优化手段。',
    detail: `用**更快的介质**（内存）暂存**热点数据副本**，请求先查缓存、未命中再回源并回填。
**解决什么问题**：磁盘与数据库扛不住高并发读——内存比磁盘快几个数量级。
**核心模式**：
- **Cache Aside**：读未命中回源回填；写先更新库再删缓存，最常用
- **穿透**（查不存在的 key）：缓存空值/布隆过滤器
- **击穿**（热 key 过期瞬间打穿）：互斥重建/逻辑过期
- **雪崩**（大量 key 同时失效）：过期时间加随机
**要点**：缓存是**易失的加速层而非数据源**，必须允许随时丢失重建；多级缓存（浏览器→CDN→本地→Redis）是通用套路。`,
    relations: [
      { to: 'be-redis', desc: 'Redis 是分布式缓存的事实标准实现' },
      { to: 'net-cdn', desc: 'CDN 是离用户最近的静态资源缓存层' },
      { to: 'be-rdbms', desc: '缓存在数据库前扛住热点读，构成加速与持久的分层' },
      { to: 'be-read-write-split', desc: '缓存先扛读，扛不住再上读写分离，层层分流' },
    ],
    interview: '必考：Cache Aside 为什么是"先更新库再删缓存"而不是更新缓存；穿透/击穿/雪崩三连问是标配，每问要给出至少一种解法。',
    example: `// Cache Aside 模式
val = redis.get(key)
if (val == null) {
    val = db.query(key)
    redis.setex(key, 300, val)   // 回填 + 过期时间
}
// 写路径：先更新数据库，再删除缓存
db.update(row)
redis.del(key)`,
    exampleLang: 'java',
  },
  {
    id: 'be-redis',
    name: 'Redis',
    en: 'Redis',
    cat: 'backend',
    sub: '数据与存储',
    tags: ['缓存', 'KV存储', '高性能'],
    summary: '基于内存的高性能 KV 数据库，内置丰富数据结构与持久化、主从、分片能力，扛高并发读的第一选择。',
    detail: `开源**内存 KV 数据库**，除字符串外提供 **List、Hash、Set、ZSet、Stream** 等结构，单机 QPS 十万级。
**解决什么问题**：热数据读取、分布式协调、轻量队列等场景下关系库力不从心。
**关键机制**：
- 命令执行**单线程**（6.0 后 IO 多线程），无锁竞争、天然原子
- **持久化**：RDB 快照 + AOF 日志，可兼用
- **过期**（惰性+定期抽样）与**淘汰策略**（常用 LRU/LFU）
- **高可用**：主从复制、哨兵自动切换、Cluster 分片
**要点**：大 key（百万成员的 Set）会阻塞单线程；热 key 叠加本地缓存；结构即 API——ZSet 做排行榜、Stream 做队列，别只会 GET/SET。`,
    relations: [
      { to: 'be-cache', desc: 'Redis 是分布式缓存的事实标准实现' },
      { to: 'be-conn-pool', desc: '访问 Redis 必须池化连接，避免频繁建连开销' },
      { to: 'be-mq', desc: 'List/Stream 可承担轻量队列，重负载场景仍需 Kafka 级 MQ' },
      { to: 'agent-memory', desc: 'Redis 常被用来存储 Agent 的会话短期记忆' },
    ],
    interview: '高频题："Redis 为什么快？"——内存、单线程无锁、IO 多路复用、高效数据结构；"缓存与数据库一致性方案"是必追问。',
  },
  {
    id: 'be-conn-pool',
    name: '连接池',
    en: 'Connection Pool',
    cat: 'backend',
    sub: '数据与存储',
    tags: ['性能', '复用', '中间件'],
    summary: '预先建立并复用一组网络连接的组件，免去每次请求的握手与认证开销，是访问数据库与缓存的标准做法。',
    detail: `维护一组**已建立的连接**供请求复用：用完归还而非销毁。
**解决什么问题**：TCP 建连（三次握手+认证+TLS）耗时数毫秒到数十毫秒，短连接在高并发下耗尽 CPU 与端口。
**关键机制**：
- **初始化预热**：启动即建好最小连接数
- **借还与超时**：借不到等待或快速失败；空闲连接定期保活
- **参数调优**：最大连接数、空闲回收、**泄漏检测**（借出不还的告警）
**要点**：连接数不是越大越好——数据库连接是昂贵资源，池上限要匹配 DB 的 max_connections；HTTP 客户端、Redis 客户端、微服务长连接，处处都是池化思想。`,
    relations: [
      { to: 'net-tcp', desc: '池化复用的正是昂贵的 TCP 连接' },
      { to: 'be-rdbms', desc: '数据库连接池是最经典的应用场景' },
      { to: 'be-redis', desc: 'Redis 客户端同样依赖连接池降低开销' },
      { to: 'be-cache', desc: '与缓存同属"复用昂贵资源"的性能思想' },
    ],
    interview: '要点：连接池满时的行为（等待/拒绝）必须显式配置；连接数经验公式只是起点，真实值靠压测确定；能解释"借出不还"导致的池耗尽事故是加分项。',
  },
  {
    id: 'be-orm',
    name: 'ORM',
    en: 'Object-Relational Mapping',
    cat: 'backend',
    sub: '数据与存储',
    tags: ['数据库', '框架', '开发效率'],
    summary: '把类映射到表、对象映射到行，用面向对象语法操作数据库的框架层技术，屏蔽手写 SQL 的样板代码。',
    detail: `在**对象世界与关系表**之间自动映射：类↔表、属性↔列、对象↔行，用 user.save() 代替拼 SQL。代表：Hibernate、MyBatis（半自动）、GORM、SQLAlchemy。
**解决什么问题**：面向对象与关系模型的"阻抗不匹配"，手写 SQL 与结果集转换繁琐易错。
**关键机制**：
- **元数据映射**：注解/配置声明映射关系，自动生成 SQL 并装配对象
- **懒加载/预加载**：控制关联查询的时机
- **脏检查**：提交时自动比对并 UPDATE 变更
**误区**：ORM 生成的 SQL 未必最优——N+1 查询、全表更新是重灾区；复杂查询仍应手写 SQL。用 ORM 管样板代码，用原生 SQL 保关键路径性能。`,
    relations: [
      { to: 'be-rdbms', desc: 'ORM 的映射目标就是关系型数据库' },
      { to: 'be-conn-pool', desc: 'ORM 通常运行在数据库连接池之上' },
      { to: 'be-index', desc: 'ORM 生成不当的 SQL 最容易埋下索引失效的坑' },
    ],
    interview: '高频题："ORM 的 N+1 问题？"——查列表后逐条查关联，解法是预加载/JOIN/批量 IN；能答"何时放弃 ORM 写原生 SQL"体现工程判断力。',
  },

  // ==================== 异步与消息 ====================
  {
    id: 'be-mq',
    name: '消息队列',
    en: 'Message Queue',
    cat: 'backend',
    sub: '异步与消息',
    tags: ['消息', '异步', '解耦'],
    summary: '生产者将待办消息写入队列、消费者按自身节奏取用处理，实现系统解耦、削峰填谷与异步化。',
    detail: `生产者与消费者通过**中间的队列**传递消息，互不直接调用。代表：Kafka、RocketMQ、RabbitMQ。
**三大价值**：
- **解耦**：下单服务发一条"订单已创建"，物流、积分各自订阅，新增消费者不动上游
- **削峰**：秒杀请求先入队，下游按自己的速率消费，扛住流量尖刺
- **异步**：非核心流程（发短信）不等同步返回，缩短响应时间
**关键机制**：持久化、消费确认（ack）、重试与死信队列、至少一次投递。
**误区**：链路变长带来**最终一致**与排障难度；消费者必须**幂等**（重复投递不可避免）；消息丢失要在生产、存储、消费三环节分别设防。`,
    relations: [
      { to: 'be-kafka', desc: 'Kafka 是高吞吐日志流场景的代表性消息平台' },
      { to: 'be-eda', desc: '消息队列是事件驱动架构的基础设施' },
      { to: 'emb-mqtt', desc: 'MQTT broker 常与后端 MQ 桥接，汇聚设备消息' },
      { to: 'be-base', desc: '消息重试与对账是最终一致的工程化落地手段' },
    ],
    interview: '必考："为什么用 MQ？会带来什么问题？"——解耦削峰异步 vs 一致性/幂等/积压；"如何保证消息不丢"要从生产端确认、broker 持久化、消费端 ack 三环节作答。',
  },
  {
    id: 'be-kafka',
    name: 'Kafka',
    en: 'Kafka',
    cat: 'backend',
    sub: '异步与消息',
    tags: ['消息', '流处理', '高吞吐'],
    summary: '以顺序写磁盘与零拷贝实现百万级每秒吞吐的分布式日志流平台，常作高吞吐消息管道与流处理底座。',
    detail: `LinkedIn 开源的**分布式提交日志/流平台**：消息按 **Topic** 分类存于**分区（Partition）**的**顺序追加日志**，消费者以**消费组**拉取。
**解决什么问题**：海量日志与事件流的**高吞吐、可持久化、可重放**传输。
**为什么快**：
- **顺序写磁盘** + **零拷贝（sendfile）**：吞吐达百万级消息/秒
- **分区并行**：分区数即消费并行度上限
- **消费位移（offset）**由消费者管理：可重放历史数据
- **ISR 副本机制**平衡可靠性与性能
**要点**：同 key 同分区才有顺序保证；消费组重平衡会造成短暂停顿；积压时先加分区再扩消费者（注意 key 的有序性要求）。`,
    relations: [
      { to: 'be-mq', desc: 'Kafka 是消息队列家族中流式、高吞吐路线的代表' },
      { to: 'be-eda', desc: '事件驱动架构中 Kafka 常作为事件主干道' },
      { to: 'ops-metrics', desc: '指标与日志管道常以 Kafka 作为汇聚缓冲' },
      { to: 'be-tracing', desc: '全链路 Trace 数据的大规模上报也常经 Kafka 汇聚' },
    ],
    interview: '高频题："Kafka 为什么快？"——顺序 IO、零拷贝、批量压缩、分区并行；"如何保证消息顺序与不重复消费"围绕分区键与幂等消费作答。',
  },

  // ==================== 服务治理 ====================
  {
    id: 'be-registry',
    name: '注册中心',
    en: 'Service Registry',
    cat: 'backend',
    sub: '服务治理',
    tags: ['微服务', '服务发现', '治理'],
    summary: '微服务的"通讯录"——服务上线注册地址，调用方实时查询可用实例列表，实现动态发现与故障剔除。',
    detail: `微服务架构中记录**服务名 → 实例地址列表**的组件：服务启动时**注册**地址，调用方**订阅**目标列表，实例宕机时被**摘除**。代表：Nacos、Eureka、Consul、etcd/ZooKeeper。
**解决什么问题**：云环境实例 IP 随扩缩随时变化，地址不可能写死在配置里。
**关键机制**：
- **注册 + 心跳续约**：超时未续约视为下线
- **订阅推送/拉取**：列表变更及时通知调用方
- **AP/CP 取舍**：Eureka 保可用（AP），ZooKeeper/Consul 保一致（CP）
**与 DNS 的关系**：DNS 也能做粗粒度发现，但缓存时效差、不带健康状态——注册中心本质是**高时效、带健康检查的动态 DNS**。`,
    relations: [
      { to: 'be-microservices', desc: '服务发现是微服务动态扩缩的前提设施' },
      { to: 'be-cap', desc: '注册中心自身就是 CAP 取舍的教科书案例' },
      { to: 'net-dns', desc: '注册中心可类比为高时效、带健康状态的动态 DNS' },
      { to: 'be-config-center', desc: '常由同一组件（如 Nacos）提供，职责互补' },
    ],
    interview: '高频题："Eureka 与 ZooKeeper 的 AP/CP 差异与适用场景"；"注册中心挂了服务还能调用吗"——客户端有本地缓存列表，短时间仍可运行，但要尽快恢复。',
  },
  {
    id: 'be-config-center',
    name: '配置中心',
    en: 'Configuration Center',
    cat: 'backend',
    sub: '服务治理',
    tags: ['配置', '治理', '微服务'],
    summary: '集中管理应用配置并支持动态刷新的服务，改配置免重启、可灰度推送、可回滚审计，避免配置散落各处。',
    detail: `把应用的开关、阈值、地址等配置**集中存储与推送**，修改后**动态生效**、无需重启。代表：Nacos、Apollo、Consul KV。
**解决什么问题**：配置散落在各实例本地，改一个超时时间要滚动发布上百台机器，还容易改漏。
**关键机制**：
- **版本管理**：配置可回滚、可审计谁在何时改了什么
- **长轮询/推送**：变更秒级下发到所有实例
- **环境与集群隔离**：dev/staging/prod 各一份
- **灰度发布**：先推一台验证再全量
**要点**：敏感配置（密码）需加密与权限管控；要有兜底——配置中心不可用时用本地缓存配置启动，避免启动强依赖。`,
    relations: [
      { to: 'be-registry', desc: '与注册中心同为运行时治理设施，常集成于 Nacos 等组件' },
      { to: 'be-microservices', desc: '微服务实例多、变更频繁，配置中心是标配' },
      { to: 'ops-iac', desc: 'IaC 管基础设施声明，配置中心管应用运行时配置' },
    ],
  },
  {
    id: 'be-circuit-breaker',
    name: '熔断、限流与降级',
    en: 'Circuit Breaking, Rate Limiting & Degradation',
    cat: 'backend',
    sub: '服务治理',
    tags: ['稳定性', '容错', '微服务'],
    summary: '防止局部故障演变为全站雪崩的三种自我保护手段：调用方跳闸止损、入口控制准入、牺牲非核心保可用。',
    detail: `微服务**稳定性三件套**，作用方向不同：
- **熔断**：调用某下游错误率超阈值后**跳闸**，一段时间内快速失败不再真实调用，定期半开探测恢复——像保险丝，止住对故障方的无效等待
- **限流**：按自身容量**拒绝超额请求**，保护自己不被打垮
- **降级**：熔断或高负载时**返回兜底数据/关闭非核心功能**（显示缓存旧值、关闭推荐），保住核心链路
**辨析**：熔断是**调用方**的出向保护，限流是**被调方**的入向准入，降级是牺牲体验保可用的策略——三者常被混为一谈，面试必须分清。配合重试退避（防重试风暴）才是完整防护。`,
    relations: [
      { to: 'be-rate-limit', desc: '令牌桶、漏桶等限流算法是这一组合的深入方向' },
      { to: 'be-microservices', desc: '调用链放大故障，微服务必须内置稳定性防护' },
      { to: 'be-health-check', desc: '健康检查发现故障节点，熔断限制对故障节点的调用' },
      { to: 'net-ddos', desc: '限流也是应用层抗 DDoS 的基础手段' },
    ],
    interview: '高频题："熔断和限流的区别？"——一答方向（出向保护 vs 入向保护）、二答触发条件（错误率 vs 容量）、三答动作（跳闸 vs 拒绝）；能提 Sentinel/Hystrix 的滑动窗口统计更佳。',
  },
  {
    id: 'be-rate-limit',
    name: '限流算法',
    en: 'Rate Limiting Algorithms',
    cat: 'backend',
    sub: '服务治理',
    tags: ['稳定性', '算法', '流量控制'],
    summary: '控制单位时间请求数量的算法族——计数器、滑动窗口、漏桶、令牌桶，保护系统不超容量运行。',
    detail: `限制单位时间内的请求量，是限流的具体实现。
**常见算法**：
- **固定窗口计数器**：每分钟一个桶计数，简单但边界突刺（前后两分钟各满额=瞬时双倍）
- **滑动窗口**：把窗口切成小格统计，平滑边界问题
- **漏桶**：恒定速率放行，超出即拒绝——整流，不允许突发
- **令牌桶**：恒定速率发令牌、桶可积攒——**允许合理突发**，最常用
**分布式限流**：多实例共享配额需集中计数（Redis+Lua）或交给网关/Sentinel。
**要点**：区分全局限流与按用户/IP 限流（防刷）；被拒请求应返回 429 并带 Retry-After，而不是静默丢弃。`,
    relations: [
      { to: 'be-circuit-breaker', desc: '限流与熔断降级构成稳定性防护组合' },
      { to: 'be-api-gateway', desc: '网关是执行全局限流策略的最佳位置' },
      { to: 'fe-debounce-throttle', desc: '前端防抖节流与后端限流是同源的流量整形思想' },
      { to: 'net-ddos', desc: 'DDoS 防护在更大尺度上依赖限流与流量清洗' },
    ],
    interview: '必考：令牌桶与漏桶的区别（是否容忍突发）、固定窗口的临界突刺问题；Redis+Lua 实现分布式限流为何要用脚本保证原子性。',
    example: `-- 令牌桶（Redis+Lua 原子限流）
local rate = tonumber(ARGV[1])      -- 每秒生成令牌数
local capacity = tonumber(ARGV[2])  -- 桶容量
local now = tonumber(ARGV[3])
local t = redis.call('HMGET', KEYS[1], 'tokens', 'ts')
-- 补充令牌 = (now - ts) * rate，扣减 1 个
-- 令牌不足则返回 0（拒绝）`,
    exampleLang: 'lua',
  },
  {
    id: 'be-tracing',
    name: '链路追踪',
    en: 'Distributed Tracing',
    cat: 'backend',
    sub: '服务治理',
    tags: ['可观测性', '微服务', '排障'],
    summary: '给跨服务请求分配唯一 TraceId 并逐跳透传，把一次请求经过的所有服务串成调用树，快速定位慢点与故障。',
    detail: `为一次请求生成全局 **TraceId**，跨服务调用时**透传**下去，每跳记录 Span（服务、耗时、状态），最终还原完整调用树。代表：OpenTelemetry、SkyWalking、Zipkin、Jaeger。
**解决什么问题**：微服务下"一个请求慢了，锅在谁"——日志分散在几十个服务里无法关联。
**关键机制**：
- **上下文透传**：TraceId/SpanId 经 HTTP 头或 RPC 元数据传播，断链则链路断裂
- **采样**：全量成本高，通常按比例或尾部采样（优先保留慢/错请求）
- 与日志关联：打印 TraceId 聚合现场
**要点**：前端、网关、MQ 都要传递上下文，MQ 是断链重灾区；运维侧的分布式追踪与本词条同一套原理。`,
    relations: [
      { to: 'ops-tracing', desc: '同一技术体系在运维可观测性领域的落地形态' },
      { to: 'be-microservices', desc: '服务越多链路越深，追踪是微服务排障刚需' },
      { to: 'ops-logging', desc: '日志带上 TraceId 才能与链路互相跳转' },
      { to: 'be-api-gateway', desc: '网关常作为 TraceId 的源头生成点' },
    ],
    interview: '要点：能画出 Trace→Span 树并解释采样策略；说出 W3C Trace Context（traceparent 头）标准与 OpenTelemetry 统一化趋势是加分项。',
  },
  {
    id: 'be-health-check',
    name: '健康检查',
    en: 'Health Check',
    cat: 'backend',
    sub: '服务治理',
    tags: ['高可用', '探针', '稳定性'],
    summary: '主动探测服务是否存活可用，决定流量是否分发、实例是否摘除，是负载均衡与自愈机制的基础。',
    detail: `周期性探测实例状态，作为流量分发与自愈的依据。
**两类探针**：
- **存活探针**：进程还活着吗？失败则**重启**实例（K8s liveness）
- **就绪探针**：能接流量吗？失败则**摘出负载均衡**但不重启（K8s readiness）
**检查方式**：TCP 端口连通（最浅）、HTTP 返回 200（应用层验证）、自定义脚本（最深但最贵）。
**解决什么问题**：实例"假活"——进程在但数据库连接全断，无探针时流量照打、用户报障。
**要点**：检查要覆盖关键依赖但别过重，避免正常波动就摘除；间隔与超时要容忍瞬时抖动（连续 3 次失败才判死）。`,
    relations: [
      { to: 'be-lb', desc: '健康检查结果是负载均衡摘除实例的依据' },
      { to: 'ops-k8s', desc: 'K8s 的 liveness/readiness 探针是云原生标准实现' },
      { to: 'be-circuit-breaker', desc: '探测发现故障，熔断限制流量，共同构成故障响应' },
      { to: 'ops-rolling-update', desc: '发布时靠就绪探针判断新版本实例可接流量' },
    ],
    interview: '要点：liveness 与 readiness 的语义区别（重启 vs 摘流量）；健康检查端点应检查哪些依赖、不应依赖什么——答出"轻量、快速、不级联"即合格。',
  },

  // ==================== 认证与安全 ====================
  {
    id: 'be-cookie-session',
    name: 'Cookie 与 Session',
    en: 'Cookie & Session',
    cat: 'backend',
    sub: '认证与安全',
    tags: ['认证', 'HTTP', '会话'],
    summary: '浏览器保存 Cookie 并随请求自动携带；Session 把状态存在服务端、靠 Cookie 中的 ID 关联，实现有状态登录。',
    detail: `**Cookie**：服务器下发、浏览器存储并**自动随请求携带**的键值数据；**Session**：服务端为每个用户保存的状态（登录态、购物车），通过 Cookie 里的 **SessionID** 关联。
**解决什么问题**：HTTP 无状态，服务端需要办法"认出"连续请求来自同一用户。
**关键机制**：
- 登录成功 → 服务端建 Session 并下发其 ID
- 后续请求浏览器自动携带 → 服务端查存储还原身份
- **安全属性**：HttpOnly（防 JS 读取，抗 XSS）、Secure（仅 HTTPS）、SameSite（防 CSRF）
**局限**：集群需粘性路由或集中存储；跨域与移动端不友好——这正是 JWT 的动机。`,
    relations: [
      { to: 'be-jwt', desc: 'JWT 把状态存进令牌本身，是无 Session 的替代路线' },
      { to: 'net-https', desc: 'Cookie 应配合 Secure 属性只在 HTTPS 下传输' },
      { to: 'be-sso', desc: '单点登录依赖认证中心的全局会话 Cookie 免登' },
      { to: 'be-rbac', desc: 'Session 中通常保存用户角色，供后续鉴权使用' },
    ],
    interview: '高频题："Cookie 与 Session 的区别？"——存储位置（浏览器 vs 服务端）、安全性、集群扩展问题；追问"分布式下 Session 怎么共享"（Redis 集中存储）。',
  },
  {
    id: 'be-jwt',
    name: 'JWT',
    en: 'JSON Web Token',
    cat: 'backend',
    sub: '认证与安全',
    tags: ['认证', 'Token', '无状态'],
    summary: '带签名的自包含令牌（头部.载荷.签名三段式），服务端验签即可识别用户，无需存储会话的无状态认证方案。',
    detail: `三段式结构 **Header.Payload.Signature**：前两段是 Base64Url 编码的 JSON，签名用密钥（HMAC）或私钥（RSA/ES256）生成，**篡改即验签失败**。
**解决什么问题**：分布式下 Session 共享困难——JWT 自带身份信息，任何实例本地验签即可，无需中心存储。
**关键机制**：
- Payload 放 userId、角色、过期时间（exp）等**声明**
- 验签通过即信任，无需查库；常放于 Bearer 头
**要点**：
- Payload 仅编码不加密，**严禁放敏感信息**
- 签发后**无法主动作废**——改密踢人需短过期 + 刷新令牌或黑名单
- 与 Session 是权衡而非替代：有状态可控 vs 无状态易扩`,
    relations: [
      { to: 'be-cookie-session', desc: '有状态（Session）与无状态（JWT）两条认证路线的代表' },
      { to: 'net-https', desc: 'JWT 必须在 HTTPS 下传输，否则令牌可被窃听重放' },
      { to: 'be-oauth2', desc: 'OAuth 2.0 常以 JWT 作为访问令牌的格式' },
      { to: 'be-api-gateway', desc: '网关统一验签 JWT，下游零成本获取用户身份' },
    ],
    interview: '必考：三段结构与验签原理、"payload 为什么不能放密码"、"JWT 如何注销"（短 TTL + refresh token / Redis 黑名单）。',
    example: `Header  {"alg":"HS256","typ":"JWT"}
Payload {"sub":"1001","role":"admin","exp":1735689600}
Signature = HMACSHA256(base64(h) + "." + base64(p), secret)

最终令牌: eyJhbGciOi....eyJzdWIiOi....SflKxwRJSMeKKF2QT4fwpMeJf36`,
    exampleLang: 'text',
  },
  {
    id: 'be-oauth2',
    name: 'OAuth 2.0',
    en: 'OAuth 2.0',
    cat: 'backend',
    sub: '认证与安全',
    tags: ['授权', '协议', '安全'],
    summary: '开放授权框架，让用户无需交出密码即可授权第三方应用有限访问自己的资源，"用微信登录"背后的协议。',
    detail: `**授权框架**（RFC 6749）：资源拥有者授权客户端**有限的访问权**而不泄露密码。四种角色：资源拥有者（用户）、客户端（第三方应用）、授权服务器、资源服务器。
**四种授权模式**：
- **授权码模式**（最常用最安全）：跳转授权页 → 用户同意 → 带 code 回调 → 后端用 code+密钥换 access_token
- **客户端凭证**：服务对服务的机器授权
- 隐式与密码模式已不推荐
**关键机制**：access_token **短生命周期** + refresh_token 续期；scope 限定权限范围。
**误区**：OAuth 2.0 管"授权"不管"认证身份"——登录场景需配合 OIDC；它是授权协议，JWT 是令牌格式，两者常组合。`,
    relations: [
      { to: 'be-jwt', desc: 'OAuth 2.0 常用 JWT 作为 access_token 的实现格式' },
      { to: 'be-sso', desc: 'SSO 产品多基于 OAuth2/OIDC 协议族构建' },
      { to: 'net-https', desc: '授权流程依赖 HTTPS 保护令牌与授权码' },
      { to: 'be-rbac', desc: '拿到令牌后的细粒度权限判定仍靠 RBAC 等模型' },
    ],
    interview: '高频题："为什么授权码模式要先用 code 换 token 而不直接返回 token？"——code 经前端回调易泄露，token 交换在后端用密钥完成，防劫持；refresh_token 的安全意义。',
  },
  {
    id: 'be-sso',
    name: 'SSO 单点登录',
    en: 'Single Sign-On',
    cat: 'backend',
    sub: '认证与安全',
    tags: ['认证', '登录', '企业架构'],
    summary: '一次登录、全站通行——多个应用共享统一认证中心，用户登录一次即可访问所有信任的系统。',
    detail: `用户在认证中心登录一次，即可访问所有接入的子系统。
**解决什么问题**：企业内部几十个系统各有一套账号密码，用户崩溃、IT 难管。
**关键机制**：
- **统一认证中心（IdP）**负责登录与签发票据，各应用（SP）只验证票据
- 首次访问系统 A → 重定向到 IdP 登录 → 携票据回 A 验证
- 再访问系统 B → 跳到 IdP 时已有全局会话 → **免登**直接发票据
- 常用协议：**CAS**（自建经典）、**OAuth2/OIDC**（互联网标准）、**SAML**（企业老牌）
**要点**：IdP 是风险单点，必须高可用；"单点登出"（一处退出全站失效）比单点登录更难实现，常被追问。`,
    relations: [
      { to: 'be-oauth2', desc: '现代 SSO 多基于 OAuth2/OIDC 协议族构建' },
      { to: 'be-cookie-session', desc: 'SSO 依赖认证中心的全局会话 Cookie 实现免登' },
      { to: 'be-jwt', desc: '子系统可用 JWT 承载从 IdP 获得的身份票据' },
      { to: 'be-rbac', desc: '登录之后"能干什么"由各系统的权限模型决定' },
    ],
    interview: '要点：能画出"用户-子系统-IdP"三方重定向时序图；区分**认证**（你是谁）与**授权**（你能干嘛）是答题骨架。',
  },
  {
    id: 'be-rbac',
    name: 'RBAC 权限模型',
    en: 'Role-Based Access Control',
    cat: 'backend',
    sub: '认证与安全',
    tags: ['授权', '权限', '建模'],
    summary: '用户绑定角色、角色持有权限的间接授权模型，三层映射解耦"人"与"权限"，是后台管理系统的标配。',
    detail: `不给用户直接配权限，而是建立**用户→角色→权限**的三层映射。
**解决什么问题**：人员变动频繁时逐人调权限的管理成本爆炸——新员工入职只需赋予"运营"角色即获全部对应权限。
**关键机制**：
- 用户-角色（多对多）、角色-权限（多对多）两张关系表
- 鉴权时判断：用户角色集合 ∩ 所需权限
- 进阶：**角色继承**（主管继承专员权限）、**约束**（互斥角色、最小权限）
**与 ACL 的区别**：ACL 直接给资源配"谁能访问"，粒度细但管理成本高；RBAC 以角色为中间层，是管理系统的默认选择，常与 JWT（角色入 payload）或 Session 结合落地。`,
    relations: [
      { to: 'be-jwt', desc: '用户角色可写入 JWT payload，随请求携带供鉴权' },
      { to: 'be-oauth2', desc: 'OAuth 的 scope 是粗粒度授权，与 RBAC 细粒度权限互补' },
      { to: 'be-cookie-session', desc: '传统方案把用户角色存在服务端会话中供鉴权' },
      { to: 'agent-guardrails', desc: 'Agent 执行敏感操作同样需要权限模型约束范围' },
    ],
    interview: '高频题："RBAC 与 ACL 的区别与取舍"；"如何设计表结构"（user/role/permission + 两张关联表）是建模基本功。',
  },
];
