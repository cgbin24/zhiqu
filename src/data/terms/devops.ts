import type { Term } from './types';

/** devops 领域术语 */
export const DEVOPS_DEVOPS: Term[] = [
  // ==================== 基础设施 ====================
  {
    id: 'ops-server',
    name: '服务器',
    en: 'Server',
    cat: 'devops',
    sub: '基础设施',
    tags: ['硬件', '基础设施', '机房'],
    summary: '提供计算、存储、网络资源并持续响应请求的计算机系统，是一切软件服务运行的物理底座。',
    detail: `网络上为其他程序**持续提供服务**的计算机系统，既指物理机器（机架式/刀片），也泛指运行服务进程的主机。
**解决什么问题**：为应用提供稳定的算力、内存、磁盘与网络。
**关键认知**：
- 与家用 PC 的差别：**7x24 运行**（ECC 内存、冗余电源）、无显示器键盘、远程带外管理（BMC/IPMI）
- 规格维度：CPU 核数、内存、磁盘 IO（SSD/NVMe）、网卡带宽
- 部署形态演进：物理机 → 虚拟机 → 容器，密度与弹性逐级提升
**要点**：服务器是会坏的资产——硬盘年故障率常在 2% 以上，架构必须假设"任何一台随时会挂"，这也是副本、监控、告警存在的根本理由。`,
    relations: [
      { to: 'ops-virtualization', desc: '虚拟化把一台物理服务器切分为多个虚拟机' },
      { to: 'ops-cloud-models', desc: '云服务器（ECS/EC2）是 IaaS 的核心产品' },
      { to: 'be-monolith', desc: '单体应用最初就部署在少数几台服务器上' },
      { to: 'ops-oncall', desc: '服务器故障告警是 On-call 最常见的处理场景' },
    ],
  },
  {
    id: 'ops-virtualization',
    name: '虚拟化',
    en: 'Virtualization',
    cat: 'devops',
    sub: '基础设施',
    tags: ['虚拟化', '云计算', '资源管理'],
    summary: '在一台物理机上切分出多个带独立内核的隔离机器实例的技术，大幅提升资源利用率，是云计算的基石。',
    detail: `在物理机上运行 **Hypervisor**（VMware ESXi、KVM、Xen），把 CPU/内存/磁盘**虚拟切分**为多台**虚拟机（VM）**，每台拥有**独立操作系统内核**。
**解决什么问题**：物理机利用率低（常低于 15%）且部署慢；虚拟化让资源可切片、隔离、分钟级创建。
**关键机制**：
- **硬件辅助虚拟化**：Intel VT-x / AMD-V 加速指令执行
- **强隔离**：VM 之间连内核都不同，安全边界清晰
- **快照与热迁移**：整机快照、不停机迁移支撑运维弹性
**与容器的区别**：容器**共享宿主内核**，只隔离进程视图，秒级启动、密度高但隔离弱于 VM；云上常见"VM 里跑容器"的叠加形态，隔离与效率兼得。`,
    relations: [
      { to: 'ops-docker', desc: '容器是更轻量的操作系统级虚拟化，与 VM 构成对比' },
      { to: 'ops-cloud-models', desc: 'IaaS 本质是把虚拟化能力商品化对外售卖' },
      { to: 'ops-server', desc: '虚拟化是对物理服务器资源的切分复用' },
    ],
    interview: '高频题："容器与虚拟机的区别"——内核共享 vs 独立、启动速度、隔离强度、安全边界；能说出 Hypervisor 两类（Type 1 裸金属 / Type 2 宿主型）是加分项。',
  },
  {
    id: 'ops-cloud-models',
    name: '云计算服务模型 IaaS/PaaS/SaaS/FaaS',
    en: 'Cloud Service Models',
    cat: 'devops',
    sub: '基础设施',
    tags: ['云计算', 'IaaS', 'Serverless'],
    summary: '云服务按托管程度分层：IaaS 卖资源、PaaS 卖平台、SaaS 卖软件、FaaS 卖函数执行，层级越高运维负担越少。',
    detail: `云厂商按**托管层级**划分的服务模型：
- **IaaS**：出租虚拟机、网络、存储（EC2/ECS）——OS 以上全归你管
- **PaaS**：出租运行时与中间件（RDS、消息队列、对象存储）——只管代码与配置
- **SaaS**：出租成品软件（飞书、Salesforce）——开箱即用
- **FaaS**：出租"函数执行"，事件触发、按调用计费（Lambda），是 Serverless 的核心形态
**规律**：层级越高，你管理的越少、可定制的也越少。
**选型要点**：核心竞争力自建，通用能力买 SaaS；数据库这类"确定性运维负担"优先托管，把人力留给业务。`,
    relations: [
      { to: 'ops-serverless', desc: 'FaaS 与 BaaS 组合构成 Serverless 架构的完整形态' },
      { to: 'ops-iac', desc: 'IaaS 资源最适合用 Terraform 声明式管理' },
      { to: 'ops-virtualization', desc: 'IaaS 的底层支撑正是虚拟化技术' },
      { to: 'ops-k8s', desc: 'K8s 是介于 IaaS 与 PaaS 之间的容器编排平台' },
    ],
    interview: '考点：按"谁管哪一层"画出四模型的责任分界线（on-prem → IaaS → PaaS → SaaS）；能结合公司场景说出选型理由比背定义更有说服力。',
  },
  {
    id: 'ops-iac',
    name: '基础设施即代码',
    en: 'Infrastructure as Code',
    cat: 'devops',
    sub: '基础设施',
    tags: ['IaC', '自动化', 'GitOps'],
    summary: '用代码声明基础设施（主机、网络、DNS）并版本化管理，环境可重建、变更可评审，取代手工点控制台。',
    detail: `用**声明式代码**描述基础设施（VPC、主机、DNS、数据库），工具自动把真实环境**收敛到声明状态**。代表：Terraform、Pulumi、CloudFormation。
**解决什么问题**：手工搭环境不可复制、无法审查、配置漂移无感知；IaC 让环境像代码一样**可版本化、可评审、可回滚、可复制**。
**关键机制**：
- **声明式**：描述"要什么"而非"怎么做"，工具先算差异（plan）再执行（apply）
- **状态文件**记录声明与真实资源的映射
- 与 **GitOps** 结合：PR 合并即环境变更
**要点**：状态文件含敏感信息需加密远程存储并加锁；变更必须走 PR 评审；严禁在控制台手动改资源造成**配置漂移**。`,
    relations: [
      { to: 'ops-terraform', desc: 'Terraform 是 IaC 理念最主流的跨云实现' },
      { to: 'ops-ansible', desc: 'IaC 管资源创建，Ansible 管资源之上的软件配置' },
      { to: 'ops-pipeline', desc: 'IaC 变更常纳入 CI/CD 流水线自动执行' },
      { to: 'ops-cloud-models', desc: 'IaC 的管理对象主要是 IaaS 层资源' },
    ],
    interview: '要点：命令式 vs 声明式的本质区别（幂等性、可收敛、可重复执行）；配置漂移如何检测（plan 显示 diff）与治理（禁手工变更）。',
  },
  {
    id: 'ops-ansible',
    name: 'Ansible',
    en: 'Ansible',
    cat: 'devops',
    sub: '基础设施',
    tags: ['自动化', '配置管理', 'IaC'],
    summary: '基于 SSH 的免 Agent 批量自动化工具，用 YAML 剧本管理成百上千台主机的软件安装与配置。',
    detail: `Red Hat 开源的**自动化配置管理工具**：通过 **SSH** 直连目标机执行任务，**无需在被管机装 Agent**。
**解决什么问题**：几十上百台机器重复装软件、改配置、重启服务，手工低效且不一致。
**关键机制**：
- **Inventory** 定义主机清单与分组
- **Playbook（YAML）**声明任务序列，内置模块**幂等**执行
- **Role** 组织可复用的任务结构
- **推送模式**：控制机主动执行，实时看输出
**与 Terraform 的分工**：Terraform 创建资源，Ansible 管资源之上的软件配置。容器化后其价值转向宿主机初始化、临时批量运维与遗留系统部署。`,
    relations: [
      { to: 'ops-iac', desc: 'Ansible 是 IaC 在配置管理方向的实现之一' },
      { to: 'ops-terraform', desc: 'Terraform 建资源、Ansible 配软件，常接力使用' },
      { to: 'ops-server', desc: '批量管理服务器是 Ansible 的核心场景' },
    ],
    interview: '要点：幂等性如何保证（模块感知目标状态，已满足则跳过）；与 Puppet/SaltStack 的 push vs pull 架构差异；Ad-hoc 命令与 Playbook 的使用分界。',
    example: `# playbook.yml
- hosts: webservers
  tasks:
    - name: 安装 nginx
      apt: { name: nginx, state: present }
    - name: 部署配置
      template: { src: nginx.conf.j2, dest: /etc/nginx/nginx.conf }
      notify: restart nginx
handlers:
  - name: restart nginx
    service: { name: nginx, state: restarted }`,
    exampleLang: 'yaml',
  },
  {
    id: 'ops-terraform',
    name: 'Terraform',
    en: 'Terraform',
    cat: 'devops',
    sub: '基础设施',
    tags: ['IaC', '多云', '自动化'],
    summary: '声明式基础设施编排工具，一份 HCL 代码跨云创建、变更、销毁资源，plan 预览差异、状态文件追踪现实。',
    detail: `HashiCorp 出品的**声明式基础设施编排工具**：用 **HCL 语言**描述资源，经 Provider 插件对接 AWS/阿里云等上千种平台。
**解决什么问题**：多云资源手工管理混乱、环境无法复制。
**关键工作流**：
- init 初始化 provider → **plan 预览将发生的变化** → apply 执行 → destroy 销毁
- **状态文件**记录声明与真实资源的映射（Terraform 的"记忆"）
- **模块**封装可复用的资源组合
**与 Ansible 的区别**：Terraform 管资源**生命周期**（创建/销毁），Ansible 管机器内**配置**。
**要点**：state 必须远程存储并加锁，防止并发 apply 互相覆盖。`,
    relations: [
      { to: 'ops-iac', desc: 'Terraform 是 IaC 理念最成功的跨云实现' },
      { to: 'ops-cloud-models', desc: '主要编排对象是云上 IaaS/PaaS 资源' },
      { to: 'ops-ansible', desc: '与 Ansible 构成"建资源 + 配软件"的黄金搭档' },
      { to: 'ops-pipeline', desc: 'terraform plan/apply 常嵌入流水线并要求人工审批' },
    ],
    interview: '要点：plan 的价值（变更评审与防误操作）；state 文件的作用、加锁与远程存储原因；init/plan/apply/destroy 完整生命周期要能默写。',
    example: `resource "aws_instance" "web" {
  ami           = "ami-0abcd1234"
  instance_type = "t3.micro"
  tags = { Name = "web-server" }
}
# terraform plan  → 预览 1 to add
# terraform apply → 创建实例`,
    exampleLang: 'hcl',
  },

  // ==================== 容器化 ====================
  {
    id: 'ops-docker',
    name: 'Docker',
    en: 'Docker',
    cat: 'devops',
    sub: '容器化',
    tags: ['容器', '云原生', '部署'],
    summary: '把应用与依赖打包为标准化容器的引擎，一次构建到处运行，解决"在我机器上是好的"的环境一致性问题。',
    detail: `开源**容器引擎**：把应用连同依赖库、环境配置打包为**镜像**，运行起来就是**容器**。
**解决什么问题**："在我机器上是好的"——环境不一致；依赖安装繁琐。
**关键机制**：
- **Namespace** 隔离进程视图（PID/网络/挂载点），**Cgroups** 限制 CPU/内存用量
- **镜像分层**（UnionFS）：每层只读可缓存，构建快、传输省
- 容器**共享宿主内核**——秒级启动、密度远超虚拟机，但隔离弱于 VM
**生态位置**：Dockerfile 定义构建，镜像推仓库，K8s 负责大规模编排。
**要点**：容器内进程应前台单进程运行、日志输出 stdout；"SSH 进容器装东西"是反模式——容器不可变，改了重建即可。`,
    relations: [
      { to: 'ops-image', desc: 'Dockerfile 构建出镜像，镜像运行成容器' },
      { to: 'ops-virtualization', desc: '与虚拟机对比：共享内核更轻量，隔离性更弱' },
      { to: 'be-microservices', desc: '容器是微服务独立打包部署的理想载体' },
      { to: 'ops-k8s', desc: '单机 Docker 之上，K8s 接管跨主机编排' },
    ],
    interview: '必考："容器与虚拟机的区别"——内核共享 vs 独立、启动速度、隔离与安全边界；能讲 Namespace（六种隔离维度）与 Cgroups 原理是加分项。',
    example: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`,
    exampleLang: 'dockerfile',
  },
  {
    id: 'ops-image',
    name: '镜像',
    en: 'Container Image',
    cat: 'devops',
    sub: '容器化',
    tags: ['容器', '构建', '不可变'],
    summary: '容器的只读模板，分层存储、构建可缓存，保证应用在任何环境以完全一致的内容运行。',
    detail: `运行容器所需的**只读文件系统快照**：包含应用代码、运行时、依赖与启动命令。
**解决什么问题**：交付"环境"而非"程序"——镜像在任何机器上运行结果完全一致。
**关键机制**：
- **分层**：每条 Dockerfile 指令一层，下层不变则缓存命中，构建与拉取都增量
- **写时复制**：容器启动时叠加一个可写层，删除容器即丢弃
- **标签**：nginx:1.25-alpine；**latest 是易变标签，生产必须钉住具体版本与 digest**
**要点**：优化分层顺序——先 COPY 依赖清单装依赖（变化少），再 COPY 源码（变化多），最大化缓存；用**多阶段构建**剔除编译工具，镜像可从 1GB 减到几十 MB。`,
    relations: [
      { to: 'ops-docker', desc: 'Docker 的核心对象，由 Dockerfile 构建产出' },
      { to: 'ops-registry-hub', desc: '镜像构建后推送仓库，供各环境拉取' },
      { to: 'ops-ci', desc: 'CI 流水线的核心产物就是打了版本标签的镜像' },
    ],
    interview: '要点：分层与缓存原理（为什么先 COPY package.json 再 COPY 源码）、多阶段构建、latest 标签为何危险（不可复现的部署）。',
  },
  {
    id: 'ops-registry-hub',
    name: '镜像仓库',
    en: 'Image Registry',
    cat: 'devops',
    sub: '容器化',
    tags: ['容器', '分发', 'DevSecOps'],
    summary: '存储与分发镜像的服务，相当于镜像界的包管理仓库，Docker Hub、私有 Harbor、云厂商 ACR 均属此类。',
    detail: `集中**存储、版本管理与分发镜像**的服务，按 registry/namespace/repo:tag 寻址。
**解决什么问题**：镜像如何从构建机到达任意集群——推送一次，处处拉取。
**常见选择**：
- **Docker Hub**：公共默认仓库，有限速与可用性风险，生产慎依赖
- **云厂商托管**：ACR/ECR/GCR——免运维、与 IAM 集成
- **自建 Harbor**：私有可控，支持镜像签名、漏洞扫描、跨机房复制
**关键机制**：镜像按**层**存储与去重传输；私有仓库的拉取凭证经 imagePullSecret 注入 K8s。
**要点**：生产必须建**就近私有仓库**（公网拉取慢且不可控），并配置**漏洞扫描**阻断高危 CVE 镜像上线。`,
    relations: [
      { to: 'ops-image', desc: '仓库是镜像的集中存储与分发中心' },
      { to: 'ops-k8s', desc: 'K8s 集群从仓库拉取镜像创建 Pod' },
      { to: 'ops-ci', desc: 'CI 构建完成后自动推送仓库并打版本标签' },
      { to: 'ops-backup-dr', desc: '跨地域仓库复制是容灾准备的组成之一' },
    ],
  },
  {
    id: 'ops-k8s',
    name: 'Kubernetes',
    en: 'Kubernetes',
    cat: 'devops',
    sub: '容器化',
    tags: ['容器编排', '云原生', '集群'],
    summary: '容器编排平台，自动完成大规模容器的调度、扩缩、自愈与发布，是云原生时代的事实标准"操作系统"。',
    detail: `Google 开源的**容器编排平台**（K8s）：把一组机器抽象为资源池，按**声明式 API** 管理容器化工作负载。
**解决什么问题**：几百个容器跨几百台机器，人工管不过来——调度、自愈、扩容全部交给它。
**关键机制**：
- **声明式模型**：提交期望状态（YAML），控制器**持续调和（reconcile）**现实与期望
- **调度器**：按资源请求与亲和性把 Pod 放到合适节点
- **自愈**：探针发现故障重建，节点宕机 Pod 迁移
- **核心对象**：Pod / Deployment / Service / Ingress / ConfigMap
**要点**：小团队优先用托管版（EKS/ACK）；YAML 进 Git，与 CI/CD、GitOps 天然契合。`,
    relations: [
      { to: 'ops-docker', desc: 'K8s 编排的对象正是容器（及 Pod）' },
      { to: 'ops-deployment', desc: 'Deployment 是 K8s 管理无状态应用的核心控制器' },
      { to: 'be-microservices', desc: '微服务大规模部署的事实标准底座' },
      { to: 'ops-ingress', desc: 'Ingress 是 K8s 集群的七层流量入口' },
    ],
    interview: '必考："声明式 API 与命令式的区别、控制器调和循环"；"Pod 与 Deployment 的关系"；能说清 etcd / API Server / Scheduler / Controller Manager 分工是加分项。',
  },
  {
    id: 'ops-pod',
    name: 'Pod',
    en: 'Pod',
    cat: 'devops',
    sub: '容器化',
    tags: ['K8s', '调度', '容器'],
    summary: 'K8s 最小部署与调度单元，由一个或多个共享网络与存储的容器组成，容器需包裹成 Pod 才能被调度。',
    detail: `K8s **最小部署与调度单元**：一个或多个**紧耦合容器**的组合，共享**网络命名空间**（同一 IP、localhost 互访）与存储卷。
**解决什么问题**：有些容器天生"同生共死"——主容器与日志 Sidecar、本地代理。
**关键机制**：
- **生命周期**：Pending → Running → Failed；可挂 Init 容器先行启动
- **一次性**：Pod 随时可能被重建（漂移、驱逐），**IP 不保证不变**——稳定访问靠 Service
- 存活/就绪探针挂在容器上
**要点**：不要直接创建裸 Pod——用 Deployment 管理以获得副本、自愈与滚动更新；**Sidecar 模式**（日志、网格代理）是 Pod 设计的经典套路。`,
    relations: [
      { to: 'ops-k8s', desc: 'Pod 是 K8s 调度与管理的原子单位' },
      { to: 'ops-deployment', desc: 'Deployment 经 ReplicaSet 控制一组 Pod 副本' },
      { to: 'ops-k8s-service', desc: 'Service 按标签选择器为动态变化的 Pod 提供稳定地址' },
      { to: 'be-service-mesh', desc: '网格 Sidecar 以容器形式注入同一 Pod' },
    ],
    interview: '要点：为什么需要 Pod 而不直接调度容器（紧耦合容器的共享与生命周期绑定）；Sidecar 适用场景；Pod IP 不可依赖的原因。',
  },
  {
    id: 'ops-deployment',
    name: 'Deployment',
    en: 'Deployment',
    cat: 'devops',
    sub: '容器化',
    tags: ['K8s', '无状态', '控制器'],
    summary: '声明 Pod 副本数与镜像版本的控制器，自动滚动更新、保留历史支持回滚，是无状态应用部署的标准方式。',
    detail: `K8s 中管理**无状态应用**的控制器：声明"要 3 个 v2.1 的 Pod"，它创建 **ReplicaSet** 维持副本数，并在镜像更新时**滚动重建**。
**解决什么问题**：裸管 Pod 无法应对更新与故障——挂了没人补、发新版会断流。
**关键机制**：
- **副本维持**：Pod 挂了自动重建，数量永远收敛到声明值
- **滚动更新**：新旧 ReplicaSet 交替，参数控制节奏
- **版本历史**：每次更新留记录，rollout undo 一键回滚
**要点**：有状态应用（数据库）用 StatefulSet 而非 Deployment；更新镜像时 tag 没变（仍用 latest）不会触发更新——经典坑。`,
    relations: [
      { to: 'ops-pod', desc: 'Deployment 通过 ReplicaSet 创建并维持 Pod 副本' },
      { to: 'ops-rolling-update', desc: '滚动更新是 Deployment 默认且核心的发布方式' },
      { to: 'ops-rollback', desc: '保留历史版本，rollout undo 即刻回滚' },
      { to: 'ops-canary', desc: '精细的金丝雀发布需两套 Deployment 配合流量权重' },
    ],
    interview: '要点：Deployment → ReplicaSet → Pod 三层关系与版本演进；maxSurge/maxUnavailable 的含义；为什么数据库不用 Deployment。',
    example: `apiVersion: apps/v1
kind: Deployment
spec:
  replicas: 3
  selector: { matchLabels: { app: web } }
  template:
    metadata: { labels: { app: web } }
    containers:
      - name: web
        image: myapp:1.4.2
        readinessProbe: { httpGet: { path: /healthz, port: 8080 } }`,
    exampleLang: 'yaml',
  },
  {
    id: 'ops-k8s-service',
    name: 'Service',
    en: 'Service (Kubernetes)',
    cat: 'devops',
    sub: '容器化',
    tags: ['K8s', '网络', '负载均衡'],
    summary: '为一组动态变化的 Pod 提供固定访问地址与负载均衡，靠标签选择器自动跟随 Pod 的增删重建。',
    detail: `K8s 中为一组 Pod 提供**稳定访问入口**的抽象：固定的 ClusterIP + 端口 + DNS 名，后端自动负载均衡到当前健康的 Pod。
**解决什么问题**：Pod 随时销毁重建、IP 漂移，调用方不能直连 Pod IP。
**关键机制**：
- **标签选择器**：自动发现匹配的 Pod，增删无需改配置
- **kube-proxy**：以 iptables/IPVS 规则实现转发
- **四种类型**：ClusterIP、NodePort、LoadBalancer、ExternalName
- 集群内经 DNS 名直接访问
**要点**：Service 是**四层**转发，按域名/路径分流交给 Ingress；Pod 被选中靠标签——标签规范从第一天做起。`,
    relations: [
      { to: 'ops-pod', desc: '通过标签选择器动态绑定一组 Pod' },
      { to: 'ops-ingress', desc: 'Ingress 把外部 HTTP 流量路由到 Service' },
      { to: 'be-lb', desc: 'Service 本质是集群内置的四层负载均衡器' },
      { to: 'ops-k8s', desc: 'K8s 网络模型的核心组件之一' },
    ],
  },
  {
    id: 'ops-ingress',
    name: 'Ingress',
    en: 'Ingress',
    cat: 'devops',
    sub: '容器化',
    tags: ['K8s', '入口', 'TLS'],
    summary: '集群的七层流量入口，按域名与路径把外部 HTTP/HTTPS 请求路由到内部 Service，并统一管理 TLS 证书。',
    detail: `管理**外部访问集群内 HTTP/HTTPS 服务**的规则集合：按**域名、路径**路由到不同 Service，集中做 **TLS 终止**。
**解决什么问题**：每个 Service 都开 LB 太贵太乱——一个入口统一收口。
**关键机制**：
- **Ingress 资源**：YAML 声明路由规则
- **Ingress Controller**：真正干活的实现（Nginx、Traefik）——没有它 Ingress 只是摆设
- TLS 证书统一在入口卸载 HTTPS
**与网关的区别**：Ingress 偏传输路由，网关叠加认证、限流、聚合等业务能力。
**要点**：外部流量路径：云LB → Controller → Service → Pod，排障逐段确认。`,
    relations: [
      { to: 'ops-k8s-service', desc: 'Ingress 的路由目标是集群内的 Service' },
      { to: 'net-https', desc: 'TLS 证书常在 Ingress 层统一卸载' },
      { to: 'be-api-gateway', desc: 'Ingress 管七层路由，网关在其上叠加认证限流' },
      { to: 'ops-k8s', desc: '集群外部流量的标准入口组件' },
    ],
    example: `apiVersion: networking.k8s.io/v1
kind: Ingress
spec:
  tls: [{ hosts: [app.example.com], secretName: app-tls }]
  rules:
    - host: app.example.com
      http:
        paths:
          - path: /api
            backend: { service: { name: api-svc, port: { number: 80 } } }
          - path: /
            backend: { service: { name: web-svc, port: { number: 80 } } }`,
    exampleLang: 'yaml',
  },

  // ==================== CI/CD 与发布 ====================
  {
    id: 'ops-ci',
    name: '持续集成 CI',
    en: 'Continuous Integration',
    cat: 'devops',
    sub: 'CI/CD 与发布',
    tags: ['CI', '自动化', '工程效能'],
    summary: '每次提交自动触发构建与测试，几分钟内暴露集成问题，让主干始终保持在可发布状态。',
    detail: `开发者频繁（每天多次）把代码合入主干，每次合入**自动构建 + 自动测试**。
**解决什么问题**：传统"攒几个月一起集成"的合并地狱——CI 把集成问题**拆碎到每次提交、几分钟内发现**。
**关键实践**：
- **快速反馈**：流水线 10 分钟内出结果，红了立即修
- **测试金字塔**：单元测试为主，集成/E2E 补充
- **主干健康**：PR 必须过 CI 才能合并（分支保护）
- 产物（镜像）打版本标签推**镜像仓库**，一次构建处处使用
**工具**：Jenkins、GitLab CI、GitHub Actions。
**要点**：CI 的核心是**纪律**而非工具——测试覆盖率低、构建慢、红了不修，CI 就名存实亡。`,
    relations: [
      { to: 'ops-cd', desc: 'CI 产出可发布制品，CD 负责后续交付与部署' },
      { to: 'ops-pipeline', desc: '流水线是 CI 的具体执行载体' },
      { to: 'ops-image', desc: 'CI 的典型产出是打了版本标签的容器镜像' },
      { to: 'ops-registry-hub', desc: '构建出的镜像推送到镜像仓库供部署拉取' },
    ],
    interview: '要点：CI 的价值在于"小步集成、快速反馈"；能讨论主干开发 vs 分支模型的取舍（feature branch 寿命应短于两天）体现工程素养。',
  },
  {
    id: 'ops-cd',
    name: '持续交付/部署 CD',
    en: 'Continuous Delivery / Deployment',
    cat: 'devops',
    sub: 'CI/CD 与发布',
    tags: ['CD', '发布', '自动化'],
    summary: '在 CI 之后把制品自动推向各环境直至生产：交付到生产前保留人工审批，部署则测试全绿直接上线。',
    detail: `**Continuous Delivery / Deployment**：CI 产出制品后的下一段旅程。
**两种终点**：
- **持续交付**：自动发布到测试/预发，**生产前留人工审批**——按钮只按一下
- **持续部署**：测试全绿**自动上生产**——最快，但要求测试与可观测性极强
**解决什么问题**：发布慢、发布怕、环境不一致——让每次提交"随时可上生产"，发布从事件变成日常。
**关键机制**：
- **环境晋升**：dev → staging → prod，同一制品逐级验证
- **配置分离**：同一镜像不同环境只换配置
- **发布策略**：蓝绿、金丝雀、滚动 + 自动回滚
**要点**：没有测试与监控兜底别开自动部署——CD 是能力成熟度的结果而非开关。`,
    relations: [
      { to: 'ops-ci', desc: 'CD 承接 CI 产出的制品继续向生产推进' },
      { to: 'ops-blue-green', desc: '蓝绿部署是 CD 实现零停机发布的经典策略' },
      { to: 'ops-rollback', desc: '自动回滚是 CD 敢于快速发布的底气' },
      { to: 'ops-sli-slo', desc: 'SLO 达标与否可作为 CD 自动放行/回滚的判据' },
    ],
    interview: '要点：说清 Delivery 与 Deployment 一字之差的分界（人工审批）；制品只构建一次、逐环境晋升的原则（避免"各环境重新构建导致不一致"）。',
  },
  {
    id: 'ops-pipeline',
    name: '流水线',
    en: 'Pipeline',
    cat: 'devops',
    sub: 'CI/CD 与发布',
    tags: ['CI/CD', '自动化', '工程效能'],
    summary: '把构建、测试、部署编排为自动化的阶段链，代码提交即触发，是 CI/CD 的具体执行框架。',
    detail: `把软件交付过程建模为**阶段（Stage）→ 步骤（Job/Step）**的自动化工作流，由事件（push/PR/定时）触发。
**解决什么问题**：手工串行的构建测试部署慢且易错；流水线让交付**标准化、可重复、可审查**。
**典型阶段**：
- **构建**：编译、打镜像
- **测试**：单测 → 集成 → 安全扫描（可并行加速）
- **部署**：先 dev，再 staging，生产需审批
- **通知**：失败告警到群/邮件
**关键概念**：**制品晋级**（同制品逐环境流转不重建）、**依赖缓存**、**并行编排**。
**工具**：Jenkins、GitLab CI、GitHub Actions。
**要点**：流水线即代码，进 Git 评审。`,
    relations: [
      { to: 'ops-ci', desc: 'CI 的构建测试由流水线承载执行' },
      { to: 'ops-cd', desc: '部署阶段是流水线的后半程' },
      { to: 'ops-iac', desc: '基础设施变更也可纳入流水线，PR 合并即环境更新' },
      { to: 'ops-rollback', desc: '部署阶段的失败回滚步骤应内置在流水线中' },
    ],
    interview: '要点：制品"一次构建、多环境晋升"原则及原因；stages 并行与依赖的设计（快的放前面，安全扫描并行跑）；流水线即代码的评审价值。',
    example: `stages: [build, test, deploy]
build:
  stage: build
  script: [docker build -t app:$CI_COMMIT_SHA .]
test:
  stage: test
  script: [npm test]
deploy-prod:
  stage: deploy
  script: [kubectl set image deploy/web web=app:$CI_COMMIT_SHA]
  when: manual   # 生产部署需人工确认`,
    exampleLang: 'yaml',
  },
  {
    id: 'ops-blue-green',
    name: '蓝绿部署',
    en: 'Blue-Green Deployment',
    cat: 'devops',
    sub: 'CI/CD 与发布',
    tags: ['发布策略', '零停机', '回滚'],
    summary: '维护新旧两套完整环境，流量一次性全量切换，切换瞬时完成、回滚只需切回，代价是双倍资源。',
    detail: `准备**两套等价环境**：蓝（当前线上）与绿（新版本）。新版本在绿环境**独立验证**后，把流量**一次性切**到绿，蓝环境保留待命。
**解决什么问题**：发布停机窗口与"发布即冒险"——切换瞬时完成，出问题**切回蓝即秒级回滚**。
**关键机制**：
- 两套环境共享同一数据库——**数据库变更必须向后兼容**，这是蓝绿的前提
- 切换点在负载均衡/网关层
- 绿环境观察无异常后销毁或转为蓝
**与金丝雀的区别**：蓝绿是**全量切换**（0%→100%），金丝雀是**渐进放量**（1%→100%），后者能以最小代价发现问题。
**要点**：双倍资源成本高，适合关键系统；DB schema 兼容性是最大坑点。`,
    relations: [
      { to: 'ops-canary', desc: '金丝雀渐进放量 vs 蓝绿一次性切换，两种策略互补' },
      { to: 'ops-rollback', desc: '回滚即把流量切回旧环境，秒级完成' },
      { to: 'be-lb', desc: '切换的实现通常就是调整负载均衡指向' },
      { to: 'ops-k8s', desc: 'K8s 下可用双 Deployment + Service 切换标签实现' },
    ],
    interview: '要点：蓝绿的前提（无状态服务 + 向后兼容的数据库变更）；与金丝雀的选型对比——回滚速度 vs 资源成本 vs 风险暴露面。',
  },
  {
    id: 'ops-canary',
    name: '金丝雀发布',
    en: 'Canary Release',
    cat: 'devops',
    sub: 'CI/CD 与发布',
    tags: ['发布策略', '灰度', '风险控制'],
    summary: '新版本先承接小比例真实流量，观察指标无异常再逐步放量至全量，用最小代价提前暴露问题。',
    detail: `把新版本先暴露给**小比例真实流量**（如 1%），观察错误率、延迟、业务指标，无异常则**逐步放量**（1%→5%→25%→100%），发现问题立即回退流量。
**解决什么问题**：全量发布一旦有 bug 影响所有用户；金丝雀把爆炸半径限制到最小。
**关键机制**：
- **新旧版本共存**，入口层按权重或特定用户分流
- **自动放量/回滚**：对接监控，错误率超阈值自动回退
- 切分点：API 网关、Service Mesh、Ingress（按 header/注解）
**与蓝绿的区别**：金丝雀**渐进 + 按比例**，蓝绿**一步全切**；金丝雀省资源、周期长，蓝绿简单粗暴。
**要点**：金丝雀样本要有代表性；指标要**分版本对比**而非看全局均值。`,
    relations: [
      { to: 'ops-blue-green', desc: '并列的两大安全发布策略，渐进式与全量式互补' },
      { to: 'ops-rollback', desc: '指标异常即回退流量，与自动回滚深度绑定' },
      { to: 'be-api-gateway', desc: '网关按权重分流是实现金丝雀的常见位置' },
      { to: 'ops-sli-slo', desc: '放量决策的依据就是 SLO 指标是否达标' },
    ],
    interview: '要点：为什么用真实流量而非内部测试（长尾问题只有生产能暴露）；自动放量依赖哪些指标（错误率、P99、业务转化）；按 header 灰度给内部员工的实践。',
  },
  {
    id: 'ops-rolling-update',
    name: '滚动更新',
    en: 'Rolling Update',
    cat: 'devops',
    sub: 'CI/CD 与发布',
    tags: ['发布策略', '零停机', 'K8s'],
    summary: '用新版本逐批替换旧实例，无需双倍资源即可零停机发布，是 K8s Deployment 的默认更新方式。',
    detail: `发布时**不一次性替换全部实例**，而是分批：起一批新的 → 健康检查通过 → 承接流量 → 缩掉一批旧的，循环至全部替换。
**解决什么问题**：全量重启服务中断；双环境蓝绿资源翻倍。
**关键机制**（K8s Deployment）：
- **maxSurge**：更新中最多允许多出几个 Pod（保吞吐）
- **maxUnavailable**：最多允许多少个不可用（保容量）
- 新 Pod 通过**就绪探针**才进入流量池
- 更新记录进历史，可 rollout undo
**要点**：**数据库 schema 必须向前兼容**——更新窗口内新旧版本同时服务；要配**优雅终止**（preStop + SIGTERM 宽限期），让旧 Pod 处理完存量请求再退出，否则连接被掐断。`,
    relations: [
      { to: 'ops-deployment', desc: '滚动更新是 Deployment 的默认发布策略' },
      { to: 'ops-k8s', desc: '由 K8s 控制器自动编排逐批替换' },
      { to: 'ops-blue-green', desc: '滚动省资源，蓝绿切换更快、回滚更彻底' },
      { to: 'ops-canary', desc: '滚动重"平滑替换"，金丝雀重"小流量验证"' },
    ],
    interview: '要点：maxSurge 与 maxUnavailable 如何权衡吞吐与容量；优雅终止的完整链路（摘流量 → 等存量请求 → 退出）；新旧版本共存对 schema 的兼容要求。',
  },
  {
    id: 'ops-rollback',
    name: '回滚',
    en: 'Rollback',
    cat: 'devops',
    sub: 'CI/CD 与发布',
    tags: ['发布', '故障恢复', 'MTTR'],
    summary: '发布出问题时把系统快速恢复到上一个正常版本的能力，回滚速度直接决定故障持续时间。',
    detail: `把服务从故障版本**恢复到最近一次正常版本**。
**解决什么问题**：没有零风险的发布，**回滚速度决定故障持续时间**——是 MTTR 中最可控的一环。
**关键机制**：
- K8s：kubectl rollout undo deployment/web（Deployment 保留历史 ReplicaSet）
- 镜像层面：重新部署上一个 tag（版本标签不可复用）
- 配置与数据库：必须连同配置与 schema 一起回滚，只回代码常常没用
**实践要点**：
- 回滚要**定期演练**，不能只存在于文档里
- **数据库变更向后兼容**（加列不删列、双写过渡）是随时可回滚的前提
**误区**：盲目回滚前先确认是不是代码问题——配置变更、上游故障也会"看起来像发布翻车"。`,
    relations: [
      { to: 'ops-deployment', desc: 'K8s Deployment 内置历史记录支持一键回滚' },
      { to: 'ops-blue-green', desc: '蓝绿部署的回滚就是流量切回旧环境' },
      { to: 'ops-cd', desc: '自动回滚机制是持续部署敢于全自动上线的安全网' },
      { to: 'ops-oncall', desc: '回滚是 On-call 处理线上事故的第一止血动作' },
    ],
    interview: '要点：回滚是 MTTR 的核心抓手；"只回代码不回数据"的陷阱与 schema 兼容设计（expand-contract 模式）；回滚演练制度化。',
  },
  {
    id: 'ops-serverless',
    name: 'Serverless',
    en: 'Serverless',
    cat: 'devops',
    sub: 'CI/CD 与发布',
    tags: ['云原生', 'FaaS', '成本'],
    summary: '开发者只写函数与业务、平台托管一切运行与扩缩的计算形态，按实际用量计费，空闲时缩容到零。',
    detail: `**无服务器**并非没有服务器，而是**服务器对开发者完全透明**：上传函数代码，云平台负责运行、扩缩、高可用。两大组成：
- **FaaS**：Lambda、阿里云函数计算——事件触发（HTTP、消息、定时器）执行
- **BaaS**：托管数据库、认证、存储，直接调用免自建
**解决什么问题**：服务器运维、容量规划、闲时成本——低谷缩到零，峰值自动扩到数千并发。
**关键机制**：事件驱动触发、按执行时长/内存计费、毫秒到秒级**冷启动**（可用预留实例缓解）。
**适用边界**：突发流量、事件处理、定时任务、轻量 API 很合适；**长连接、高频稳定大流量、超低延迟**场景成本与性能反而吃亏。`,
    relations: [
      { to: 'ops-cloud-models', desc: 'FaaS 与 BaaS 是云服务模型的最高托管层级' },
      { to: 'be-eda', desc: 'Serverless 函数天然事件驱动，与消息队列/事件总线配合' },
      { to: 'ops-ci', desc: '流水线也可部署函数，构建产物从镜像变为代码包' },
      { to: 'ops-docker', desc: '容器与 Serverless 是两种部署形态：可控 vs 免运维' },
    ],
    interview: '要点：冷启动的成因与缓解（预热/预留实例/轻量运行时）；"不是所有场景都该 Serverless"的边界判断——稳定大流量自建容器更省。',
  },

  // ==================== 可观测性 ====================
  {
    id: 'ops-metrics',
    name: '指标监控',
    en: 'Metrics',
    cat: 'devops',
    sub: '可观测性',
    tags: ['可观测性', '监控', 'SRE'],
    summary: '以数值时间序列刻画系统状态（QPS、延迟、错误率、资源占用），可聚合可告警，是可观测性的第一支柱。',
    detail: `以**时间序列数值**记录系统状态：QPS、P99 延迟、错误率、CPU/内存、队列积压。
**解决什么问题**："系统现在健康吗"——数值可聚合、可设阈值，是**告警与容量规划**的原料。
**关键机制**：
- **四黄金指标**（Google SRE）：流量、延迟、错误、饱和度
- **USE 方法**：对每种资源问利用率/饱和度/错误
- 数据模型：指标名 + 标签 + 数值 + 时间戳，多维标签可下钻
- 采集模型：拉取（scrape）与推送（statsd）
**三支柱定位**：指标看趋势与告警（便宜可聚合），日志看现场细节，链路看调用关系。
**要点**：不要只监控机器指标——业务指标（下单量骤降）往往最早暴露问题。`,
    relations: [
      { to: 'ops-prometheus', desc: 'Prometheus 是指标采集存储告警的事实标准' },
      { to: 'ops-grafana', desc: 'Grafana 把指标数据渲染为可视化大盘' },
      { to: 'ops-alerting', desc: '阈值与异常检测都建立在指标序列之上' },
      { to: 'ops-sli-slo', desc: 'SLI 就是从指标体系中提炼的服务质量度量' },
    ],
  },
  {
    id: 'ops-logging',
    name: '日志',
    en: 'Logging',
    cat: 'devops',
    sub: '可观测性',
    tags: ['可观测性', '排障', '日志采集'],
    summary: '记录系统运行中离散事件的文本数据，保留最完整的现场细节，是排障定位根因的最终依据。',
    detail: `应用与系统运行中**离散事件**的文字记录（谁、何时、做了什么、结果如何）。
**解决什么问题**：指标只说"有问题"，日志回答"为什么"——堆栈、参数、决策路径都在这里。
**关键机制**：
- **结构化日志**（JSON）：字段化后才能高效检索聚合，优于纯文本
- **分级**：ERROR/WARN/INFO/DEBUG，生产默认 INFO 并支持动态调级
- **采集链路**：stdout → 采集器 → Kafka → ES/ClickHouse → Kibana 检索
- **TraceId 透传**：日志带链路 ID 才能跨服务串联
**要点**：日志易失可再生不必双活；严禁记录密码/令牌；Debug 打爆磁盘是常见事故源——按保留期滚动清理。`,
    relations: [
      { to: 'ops-metrics', desc: '指标发现异常、日志解释原因，两支柱互补' },
      { to: 'ops-tracing', desc: '日志携带 TraceId 即可跳转到完整调用链' },
      { to: 'be-tracing', desc: '后端在业务代码中把 TraceId 写入每条日志' },
      { to: 'ops-alerting', desc: '关键 ERROR 日志可触发告警规则' },
    ],
  },
  {
    id: 'ops-tracing',
    name: '分布式链路追踪',
    en: 'Distributed Tracing',
    cat: 'devops',
    sub: '可观测性',
    tags: ['可观测性', '微服务', 'OpenTelemetry'],
    summary: '跨服务记录一次请求的完整调用树与每跳耗时，让微服务架构下"慢在哪、错在哪"一目了然。',
    detail: `为每个请求生成 **TraceId**，跨服务传播并记录每一段的 **Span**（服务、耗时、状态、属性），最终还原调用树。
**解决什么问题**：请求穿过十几个服务、日志分散无法串联——追踪让"慢在哪、错在哪"一眼可见。
**关键机制**：
- **上下文传播**：TraceID/SpanID 经 HTTP 头/RPC 元数据透传，任何一环断链则链路断裂
- **Span 树 + 时间轴**：呈现调用瀑布图
- **采样**：头部采样简单省成本；尾部采样优先保留慢/错请求
- **OpenTelemetry**：统一 SDK 与协议的事实标准
**要点**：MQ 消费要用消息属性续接 Trace，是断链重灾区；与日志（带 TraceId）、指标（RED）联动构成完整排障闭环。`,
    relations: [
      { to: 'be-tracing', desc: '同一技术体系，后端视角讲上下文透传实现' },
      { to: 'ops-metrics', desc: '指标发现异常服务，追踪定位到具体调用与耗时' },
      { to: 'ops-logging', desc: '日志带 TraceId 与链路双向跳转' },
      { to: 'ops-prometheus', desc: '同属可观测性工具链：Prometheus 管指标，OTel 管追踪' },
    ],
  },
  {
    id: 'ops-prometheus',
    name: 'Prometheus',
    en: 'Prometheus',
    cat: 'devops',
    sub: '可观测性',
    tags: ['监控', '时序数据库', '云原生'],
    summary: '以 Pull 模型采集多维时序指标的监控系统，配 PromQL 查询与内置告警，是云原生监控的事实标准。',
    detail: `CNCF 的**指标监控与告警系统**：以**拉取模型**定期抓取目标暴露的 /metrics 端点，数据存为**多维时间序列**（指标名 + 标签集）。
**解决什么问题**：云环境实例动态生灭，传统推模型监控难维护目标清单。
**关键机制**：
- **PromQL**：按标签筛选、聚合、算速率（rate）、直方图分位数（histogram_quantile）
- **服务发现**：自动发现 K8s Pod 等采集目标
- **Alertmanager**：告警评估、分组、静默、路由
- 单机存储，长期存储靠 Thanos 等方案
**要点**：**标签基数爆炸是第一杀手**——别把 userId 等高基数值放标签；P99 延迟要用 Histogram 采集而非直接存值。`,
    relations: [
      { to: 'ops-metrics', desc: 'Prometheus 是指标监控的标准实现' },
      { to: 'ops-grafana', desc: 'Grafana 是 Prometheus 数据最常用的可视化前端' },
      { to: 'ops-alerting', desc: '告警规则在 Prometheus 评估，经 Alertmanager 分发' },
      { to: 'ops-k8s', desc: '原生服务发现对接 K8s，是云原生监控标配' },
    ],
    interview: '要点：Pull 与 Push 模型的取舍；PromQL 常用函数（rate、sum by、histogram_quantile）；高基数标签导致内存爆炸的事故案例要能复述。',
    example: `# PromQL：最近 5 分钟 QPS 与 P99 延迟
sum(rate(http_requests_total{job="api"}[5m])) by (status)
histogram_quantile(0.99,
  sum(rate(http_request_duration_seconds_bucket[5m])) by (le))`,
    exampleLang: 'promql',
  },
  {
    id: 'ops-grafana',
    name: 'Grafana',
    en: 'Grafana',
    cat: 'devops',
    sub: '可观测性',
    tags: ['可视化', '大盘', '监控'],
    summary: '对接 Prometheus、ES 等几十种数据源的开源可视化平台，把监控数据变成可共享的实时大盘。',
    detail: `开源**数据可视化平台**：连接 Prometheus、Elasticsearch、Loki、MySQL 等**几十种数据源**，用查询 + 面板构建**实时大盘**。
**解决什么问题**：监控数据"存起来了但看不见"——Grafana 把时序数据变成趋势图与热力图，全队共享同一事实。
**关键机制**：
- **Dashboard**：多面板组合，支持变量下拉（切换服务/机房）
- **数据源插件体系**：一个平台看所有系统的数据
- **告警**：也可独立定义告警规则
- 权限与分享：按团队组织大盘
**要点**：大盘设计遵循"**总览 → 下钻**"：第一屏放四黄金指标，异常时点进服务详情；一屏堆几十张图的"圣诞树大盘"等于没有大盘。`,
    relations: [
      { to: 'ops-prometheus', desc: '最常见组合：Prometheus 存数据，Grafana 展示' },
      { to: 'ops-metrics', desc: '指标数据经 Grafana 变成人可读的趋势大盘' },
      { to: 'ops-alerting', desc: '告警状态可在 Grafana 大盘上直观呈现' },
      { to: 'ops-oncall', desc: 'On-call 排障的第一入口通常就是 Grafana 大盘' },
    ],
  },
  {
    id: 'ops-alerting',
    name: '告警',
    en: 'Alerting',
    cat: 'devops',
    sub: '可观测性',
    tags: ['可观测性', 'On-call', 'SRE'],
    summary: '监控指标越界或异常时主动通知相关人，让团队先于用户发现故障，核心挑战是准确而非堆量。',
    detail: `基于监控数据设定**触发条件**，异常时通过 IM/电话/短信通知响应者。
**解决什么问题**：靠用户报障发现问题已经晚了——告警让团队**在用户之前**知道故障。
**关键机制**：
- **告警规则**：阈值（CPU>90%）、比率（5xx 率>1%）、PromQL 表达式、异常检测
- **分级**：P0 电话叫醒、P1 IM 即时、P2 工单次日处理
- **路由与分组**：按服务/值班表路由，同类告警合并防风暴
- **静默与抑制**：维护窗口静默、上级告警抑制子告警
**反模式**：误报太多导致**狼来了效应**，真告警被淹没。
**要点**：每条告警必须**可行动**——收到后知道做什么；不可行动的告警应删除而非静音。`,
    relations: [
      { to: 'ops-oncall', desc: '告警触发后由值班体系承接响应' },
      { to: 'ops-metrics', desc: '指标是告警规则的数据来源' },
      { to: 'ops-sli-slo', desc: '错误预算的燃尽速度是告警分级的高级依据' },
      { to: 'ops-prometheus', desc: 'Prometheus + Alertmanager 是云原生告警标配' },
    ],
    interview: '要点："告警疲劳"的成因与治理（合并、分级、砍不可行动告警）；能讨论"基于 SLO 燃尽率的告警优于静态阈值"体现 SRE 视野。',
  },
  {
    id: 'ops-sli-slo',
    name: 'SLI/SLO/SLA',
    en: 'SLI / SLO / SLA',
    cat: 'devops',
    sub: '可观测性',
    tags: ['SRE', '可靠性', '指标'],
    summary: '服务质量的度量契约分层：SLI 是具体指标、SLO 是内部目标、SLA 是对外的违约承诺，用错误预算平衡创新与稳定。',
    detail: `可靠性管理的**三层契约**：
- **SLI**（指标）：服务质量的具体度量——P99 延迟、成功率、可用性
- **SLO**（目标）：内部承诺的目标值——"99.9% 请求 < 300ms"，通常留有余量
- **SLA**（协议）：对外合同，违约要**赔偿**，因此必然比 SLO 宽松
**核心概念——错误预算**：100% - SLO = 允许失败的额度（99.9% 即每月约 43 分钟）。预算充足可激进发布，预算烧完则**冻结发布优先保稳定**——用数据终结"功能团队 vs 稳定团队"的争吵。
**要点**：SLO 要选**用户可感知**的 SLI（页面能否打开），而非 CPU 等内部指标；定 100% 必然失败，99.9%~99.95% 是多数服务的合理起点。`,
    relations: [
      { to: 'ops-alerting', desc: '错误预算燃尽速度可驱动分级告警' },
      { to: 'ops-metrics', desc: 'SLI 从监控指标体系中提炼而来' },
      { to: 'ops-chaos', desc: '混沌工程验证系统是否真能满足 SLO' },
      { to: 'ops-oncall', desc: 'SLO 达成情况是值班响应优先级的依据' },
    ],
    interview: '要点：三者宽严递进关系（SLI ⊂ SLO ⊂ SLA）；错误预算如何驱动发布节奏；能给出自己系统的 SLO 例子并算出月度预算时长最加分。',
  },
  {
    id: 'ops-oncall',
    name: '值班与 On-call',
    en: 'On-call',
    cat: 'devops',
    sub: '可观测性',
    tags: ['SRE', '故障响应', '团队协作'],
    summary: '轮班制承担线上故障第一响应的机制，目标是最短时间恢复服务（MTTR），核心是流程、工具与不透支的人。',
    detail: `团队**轮班**承担线上告警的第一响应：收到告警 → 快速定位 → 恢复服务（**先止血，再复盘**）。
**解决什么问题**：线上 7x24 都可能出故障，必须有人随时响应且不至于把人耗干。
**关键机制**：
- **值班表**：主班 + 副班（升级路径），轮换周期通常一周
- **响应流程**：确认影响面 → 止血（回滚/扩容/降级）→ 恢复验证 → **无指责复盘**
- **Runbook**：常见告警的处理手册，新人也能按图索骥
- **工具**：PagerDuty/Oncall 系统、一键回滚、值班大盘
**要点**：复盘对事不对人——**问责文化会杀死诚实暴露问题的意愿**；每次 P0 产出 action item 并跟踪闭环；持续告警风暴是告警治理欠债，不是值班不努力。`,
    relations: [
      { to: 'ops-alerting', desc: '告警是 On-call 的触发源，告警质量决定值班体验' },
      { to: 'ops-rollback', desc: '回滚是 On-call 最常用的止血手段' },
      { to: 'ops-sli-slo', desc: '事故影响按 SLO 违约程度定级' },
      { to: 'ops-backup-dr', desc: '超出日常响应能力的站点级灾难启动容灾预案' },
    ],
    interview: '要点：MTTR vs MTBF 的视角；无指责复盘的实践要义；"先止血再查因"的响应纪律——面试事故题先答恢复再答根因。',
  },

  // ==================== 稳定性保障 ====================
  {
    id: 'ops-backup-dr',
    name: '备份与容灾',
    en: 'Backup & Disaster Recovery',
    cat: 'devops',
    sub: '稳定性保障',
    tags: ['容灾', '高可用', '数据安全'],
    summary: '为最坏情况设计的最后防线：数据副本定期留存且验证可恢复，站点级故障时由备用体系接管业务。',
    detail: `- **备份**：数据副本的定期留存（全量+增量），**验证可恢复性**才有意义
- **容灾**：站点级失效时备用系统接管的**体系**（热备、双活、异地多活）
**两个关键指标**：
- **RPO**（恢复点目标）：最多丢多少数据——决定备份频率与复制方式
- **RTO**（恢复时间目标）：多久能恢复服务——决定容灾架构的实时性
**分级**：本地备份 → 同城双机房（防火灾断电）→ 异地容灾（防区域灾难）→ 异地多活（双地同时服务）。
**要点**：**没有恢复演练的备份等于没有备份**——文件损坏、脚本失效只有演练能暴露；牢记 3-2-1 原则：3 份副本、2 种介质、1 份异地。`,
    relations: [
      { to: 'be-replication', desc: '主从复制是实时容灾的数据同步基础' },
      { to: 'ops-cloud-models', desc: '云的多可用区/多地域能力大幅降低容灾门槛' },
      { to: 'ops-oncall', desc: '日常故障走值班止血，站点级灾难启动容灾预案' },
      { to: 'ops-chaos', desc: '混沌演练可验证容灾切换是否真的可用' },
    ],
    interview: '要点：RPO/RTO 的定义与相互制约（丢得越少、恢复越快，成本越高）；3-2-1 备份原则；"备份不可恢复"事故说明演练的必要性。',
  },
  {
    id: 'ops-chaos',
    name: '混沌工程',
    en: 'Chaos Engineering',
    cat: 'devops',
    sub: '稳定性保障',
    tags: ['SRE', '韧性', '故障演练'],
    summary: '主动向系统注入受控故障（杀容器、断网络、加延迟），在真实流量下验证韧性，把事故提前到可控的实验里。',
    detail: `**Chaos Engineering**：在**受控条件下**主动注入故障，验证系统"以为"具备的韧性是否真实存在。
**解决什么问题**：容灾预案、自愈机制、限流配置从没真被触发过——真出事时全是纸面能力。
**实验方法论**：
- **稳态假设**：先定义"正常"（SLO 指标保持达标）
- **注入故障**：杀 Pod、填满磁盘、加网络延迟、模拟依赖超时（Chaos Mesh 等工具）
- **观察对照**：系统自动恢复则假设成立，否则发现真实弱点
- **从小做起**：先测试环境、先小流量、先工作时间，逐步升级到生产
**要点**：混沌是**实验**不是瞎搞——没有稳态假设与回滚方案的注入等于制造事故；先有监控与自动恢复，混沌才有意义。`,
    relations: [
      { to: 'ops-sli-slo', desc: '稳态假设以 SLO 指标定义，实验成败以此为判据' },
      { to: 'ops-k8s', desc: 'Chaos Mesh 等工具直接面向 K8s 工作负载注入故障' },
      { to: 'ops-backup-dr', desc: '容灾切换能力需要混沌演练验证真实有效' },
      { to: 'ops-alerting', desc: '注入故障的同时验证告警是否如期触发' },
    ],
    interview: '要点：混沌工程四步法（稳态假设 → 注入 → 观察 → 改进）；与"故障演练/压测"的区别（科学实验方法论）；为什么必须先有可观测性与自动化恢复。',
  },
];
