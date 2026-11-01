import type { Term } from './types';

/** network 领域术语：分层模型 / 地址与路由 / 传输层 / 应用与安全 */
export const NET_NETWORK: Term[] = [
  // ==================== 分层模型 ====================
  {
    id: 'net-osi',
    name: 'OSI 七层模型',
    en: 'OSI Seven-Layer Model',
    cat: 'network',
    sub: '分层模型',
    tags: ['模型', '基础'],
    summary: 'OSI 将网络通信自下而上分为物理到应用的七层，每层各司其职，是理解与排障网络的通用框架。',
    detail: `**是什么**：OSI 七层模型是 ISO 制定的网络通信概念框架，自下而上为：物理层、数据链路层、网络层、传输层、会话层、表示层、应用层；每层向上层提供服务、依赖下层的能力。

**解决什么问题**：把复杂通信拆成职责单一的分层协议栈，各层独立演进、故障可逐层定位——"网络问题先问到了第几层"由此而来。

**逐层对应**：
- 物理层：网线、光纤、电信号
- 链路层：以太网、MAC 地址、交换机
- 网络层：IP 与路由器；传输层：TCP/UDP 与端口
- 会话/表示/应用：TLS 加密、数据格式、HTTP

**提示**：实际互联网采用更精简的 TCP/IP 四层模型，OSI 主要作为教学与排障的通用语言。`,
    relations: [
      { to: 'net-tcpip', desc: 'TCP/IP 四层是 OSI 七层的工程化简化版，实际互联网采用前者' },
      { to: 'net-packet', desc: '分层是封装的基础，每层给数据加上自己的头部' },
      { to: 'net-packet-capture', desc: '抓包工具按 OSI 层次逐层解析数据包，排障即"定位到层"' },
    ],
    interview: '高频：七层名称与顺序、每层的代表设备与协议；"第几层问题"是排障面试的常见切入点。',
  },
  {
    id: 'net-tcpip',
    name: 'TCP/IP 四层模型',
    en: 'TCP/IP Model',
    cat: 'network',
    sub: '分层模型',
    tags: ['模型', '协议栈'],
    summary: 'TCP/IP 四层模型（链路、网络、传输、应用）是互联网实际运行的协议栈结构。',
    detail: `**是什么**：TCP/IP 模型是互联网真实运行的协议栈结构：网络接口（链路）层、网络层（IP）、传输层（TCP/UDP）、应用层（HTTP/DNS 等），对应 OSI 七层的压缩与落地。

**解决什么问题**：WiFi、以太网、4G 等异构网络互联需要统一规则；IP 层向上屏蔽链路差异，把全球网络连成"一张网"。

**关键点**：
- 链路层负责相邻节点传输（以太网帧、MAC 地址）
- IP 层负责跨网段寻址与路由
- 传输层提供端口区分与可靠/不可靠两种传输
- 应用层定义语义（HTTP、DNS、SMTP）

**提示**：排障自下而上逐层验证：网线信号 → IP 可达（ping）→ 端口可达（telnet）→ 应用响应。`,
    relations: [
      { to: 'net-osi', desc: 'TCP/IP 四层与 OSI 七层一一映射，后者是前者的概念细化' },
      { to: 'net-ip', desc: 'IP 协议是网络层的核心，负责寻址与路由' },
      { to: 'net-tcp', desc: 'TCP 在 IP 之上提供可靠有序的字节流传输' },
    ],
  },
  {
    id: 'net-packet',
    name: '数据包与封装',
    en: 'Packet & Encapsulation',
    cat: 'network',
    sub: '分层模型',
    tags: ['基础', '协议'],
    summary: '封装指每层协议给上层数据加上自己的头部形成数据包，接收方按相反顺序逐层解封还原数据。',
    detail: `**是什么**：封装是把上层数据逐层"加头"的过程：应用数据 → TCP 段（加端口）→ IP 包（加 IP 地址）→ 以太网帧（加 MAC）；接收方按相反顺序逐层剥离解封。

**解决什么问题**：每层只关心自己的职责与寻址信息，封装让各层协议互不干扰地叠加工作，如同信件层层装信封。

**关键点**：
- 各层数据单元：段（Segment）、包（Packet）、帧（Frame）
- MTU 限制单帧负载，超出会触发 IP 分片或由 TCP 的 MSS 协商规避
- 抓包看到的就是逐层头部结构

**提示**：理解封装是读懂抓包结果与排障的前提：连 IP 包都看不到，问题往往在链路层。`,
    relations: [
      { to: 'net-osi', desc: 'OSI 分层模型正是封装行为的理论依据' },
      { to: 'net-tcpip', desc: 'TCP/IP 协议栈中每层对应一种封装头部' },
      { to: 'net-packet-capture', desc: '抓包工具按封装结构逐层解析报文' },
    ],
    example: `应用数据:    [ HTTP 请求报文 ]
传输层封装:  [ TCP 头 | HTTP 数据 ]        ← 段(Segment)
网络层封装:  [ IP 头 | TCP 头 | HTTP ]     ← 包(Packet)
链路层封装:  [ 帧头 | IP 包 | 帧尾校验 ]   ← 帧(Frame)

发送方逐层加头，接收方逐层解封；
每层头部携带该层的寻址信息（端口 / IP / MAC）。`,
    exampleLang: 'text',
  },

  // ==================== 地址与路由 ====================
  {
    id: 'net-ip',
    name: 'IP 地址',
    en: 'IP Address',
    cat: 'network',
    sub: '地址与路由',
    tags: ['寻址', '基础'],
    summary: 'IP 地址是网络中主机的逻辑地址（IPv4 32 位 / IPv6 128 位），配合子网掩码实现网段划分与路由寻址。',
    detail: `**是什么**：IP 地址是网络层为主机分配的逻辑地址。IPv4 为 32 位（点分十进制如 192.168.1.10），IPv6 为 128 位（冒号十六进制），用于在全球网络中定位主机。

**解决什么问题**：MAC 地址只适合本地链路寻址；IP 让跨网段、跨大陆的通信有了统一编址，路由器据此逐跳转发。

**关键点**：
- 分为网络位与主机位，由子网掩码划分边界
- 分公网地址（全球唯一）与私网地址（10 / 172.16 / 192.168 段，经 NAT 出网）
- DHCP 自动分配，服务器常用静态地址
- IPv4 地址已枯竭，IPv6 提供近乎无限的地址空间

**提示**：ipconfig/ifconfig 查看本机地址、ping 测连通性，是网络排障的第一步。`,
    relations: [
      { to: 'net-subnet', desc: '子网掩码划分 IP 的网络位与主机位' },
      { to: 'net-nat', desc: '私网 IP 经 NAT 转换为公网 IP 访问互联网' },
      { to: 'net-mac', desc: 'ARP 协议把同网段 IP 地址解析为 MAC 地址' },
    ],
    interview: '高频：IPv4 私网地址段；为什么有了 MAC 还需要 IP——逻辑编址才能支持跨网路由。',
  },
  {
    id: 'net-port',
    name: '端口',
    en: 'Port',
    cat: 'network',
    sub: '地址与路由',
    tags: ['传输层', '寻址'],
    summary: '端口是 0-65535 的传输层编号，与 IP 组合把数据送达主机上的具体应用进程。',
    detail: `**是什么**：端口是传输层的 16 位编号（0-65535），与 IP 组成"套接字"（IP:port），把到达主机的数据分发给具体进程。

**解决什么问题**：一台主机同时运行 Web 服务、数据库、SSH 等多个程序；IP 只能送到主机，端口才能送到"具体门牌号"。

**约定与分类**：
- 0-1023 知名端口：HTTP 80、HTTPS 443、SSH 22、DNS 53
- 1024-49151 注册端口；49152-65535 动态/临时端口（客户端出站使用）
- netstat/ss 可查看监听与连接端口

**提示**：安全上遵循最小开放原则，公网只放行必要端口；本地开发常遇端口冲突（Address already in use）。`,
    relations: [
      { to: 'net-tcp', desc: 'TCP 通过端口建立进程级的可靠连接' },
      { to: 'net-udp', desc: 'UDP 同样以端口区分应用，但无连接' },
      { to: 'net-firewall', desc: '防火墙的核心规则之一就是按端口放行或封禁' },
      { to: 'net-nat', desc: 'NAT 端口映射把公网端口转发到内网服务端口' },
    ],
  },
  {
    id: 'net-mac',
    name: 'MAC 地址',
    en: 'MAC Address',
    cat: 'network',
    sub: '地址与路由',
    tags: ['链路层', '寻址'],
    summary: 'MAC 地址是网卡固化的 48 位物理地址，用于同一局域网内设备之间的帧级寻址。',
    detail: `**是什么**：MAC 地址是网络接口卡固化（或可配置）的 48 位硬件地址，如 00:1A:2B:3C:4D:5E，前 24 位是厂商标识（OUI）。

**解决什么问题**：IP 负责全球寻址，但数据最终要经过本地网段"最后一跳"；交换机依据 MAC 地址表把帧准确送到对应端口。

**关键点**：
- 只在本地链路有效：跨网段路由时源/目的 MAC 每跳重写，IP 保持不变
- ARP 负责把同网段 IP 解析成 MAC
- 交换机学习源 MAC 与端口的映射，构建转发表

**提示**：MAC 可被伪造，不能作为可靠的身份标识；无线网络的 MAC 过滤只是弱防护手段。`,
    relations: [
      { to: 'net-ip', desc: 'ARP 将同网段 IP 映射为 MAC，两者配合完成端到端投递' },
      { to: 'net-osi', desc: 'MAC 是数据链路层的寻址标识' },
      { to: 'net-packet', desc: '以太网帧头部封装源与目的 MAC 地址' },
    ],
  },
  {
    id: 'net-subnet',
    name: '子网掩码与网段',
    en: 'Subnet & Subnet Mask',
    cat: 'network',
    sub: '地址与路由',
    tags: ['IP', '规划'],
    summary: '子网掩码划分 IP 地址的网络位与主机位，决定哪些地址同网段可直接互通、哪些须经网关。',
    detail: `**是什么**：子网掩码（如 255.255.255.0，即 /24）是连续 1 标识网络位、连续 0 标识主机位的 32 位掩码；IP 与掩码按位与运算得到网段地址。

**解决什么问题**：主机需要判断目的地址是否"同网段"：同网段直接 ARP 交付，否则交给网关转发——掩码就是这个判断的依据。

**关键点**：
- /24 有 254 个可用主机地址；/30 只有 2 个，常用于点对点链路
- VLSM/CIDR 灵活划分子网，减少地址浪费
- 网段地址与广播地址不可分配给主机

**误区**：192.168.1.1/24 与 192.168.2.1/24 网络位不同必然不通，须经过路由或修改掩码，而不是"改个数字就能连"。`,
    relations: [
      { to: 'net-ip', desc: '掩码划分 IP 的网络位与主机位' },
      { to: 'net-gateway', desc: '主机发现目的非本网段时，把流量交给默认网关' },
      { to: 'net-routing', desc: '路由表按目的网段（IP + 掩码）做最长前缀匹配选路' },
    ],
    example: `IP 地址:    192.168.1.130
子网掩码:   255.255.255.0  (/24)

按位与 → 网段地址:  192.168.1.0
广播地址:           192.168.1.255
可用主机范围:       192.168.1.1 ~ 192.168.1.254 (254 个)

判断同网段：目的 IP 与掩码相与后等于本机网段 → 直接连通；
否则把数据包发给默认网关。`,
    exampleLang: 'text',
  },
  {
    id: 'net-gateway',
    name: '网关',
    en: 'Gateway',
    cat: 'network',
    sub: '地址与路由',
    tags: ['路由', '基础'],
    summary: '网关是主机通往其他网段的出口设备，跨网段流量都交给默认网关逐跳转发。',
    detail: `**是什么**：网关是主机通往其他网段的"出口大门"，通常由路由器或三层交换机担任；主机配置的"默认网关"接收所有非本网段的目的流量。

**解决什么问题**：主机只懂"同网段直发、异网段问网关"的简单规则；复杂的跨网络寻址与逐跳转发由一串网关/路由器接力完成。

**关键点**：
- 默认网关必须与本机 IP 同网段，否则配置无效
- 家庭路由器的 LAN 口既是网关，通常还兼任 DHCP 与 NAT
- 网关不通则只能访问本网段："能 ping 通内网不能上外网"多因网关或 WAN 故障

**提示**：tracert/traceroute 可以看到数据包逐跳经过的网关链。`,
    relations: [
      { to: 'net-subnet', desc: '主机判断目的非本网段后，把数据包交给默认网关' },
      { to: 'net-nat', desc: '家庭网关通常同时执行 NAT，共享公网出口' },
      { to: 'net-routing', desc: '网关是路由选择在主机侧的具象：即下一跳地址' },
    ],
  },
  {
    id: 'net-nat',
    name: 'NAT',
    en: 'Network Address Translation',
    cat: 'network',
    sub: '地址与路由',
    tags: ['地址', '路由器'],
    summary: 'NAT 在路由边界把私网 IP 与端口映射为公网 IP 与端口，让多设备共享公网地址上网。',
    detail: `**是什么**：NAT（网络地址转换）在路由边界改写数据包的 IP 与端口：内网多台设备共享一个公网 IP 出网，最常见的形式是端口多路复用（NAPT）。

**解决什么问题**：IPv4 地址枯竭，不可能给每台设备分配公网 IP；NAT 让成千上万私网设备复用少量公网地址，同时天然隐藏内网结构。

**工作方式**：
- 出站：把源地址改写为公网 IP + 随机端口，并记录映射表
- 回包：查映射表改回内网地址送还主机
- 外部主动访问内网服务需配置端口映射或 DMZ

**代价**：NAT 破坏端到端原则，P2P 打洞、部分协议需要穿透技术；IPv6 普及后 NAT 有望退居安全用途。`,
    relations: [
      { to: 'net-ip', desc: 'NAT 桥接私网 IP 与公网 IP 两个编址空间' },
      { to: 'net-port', desc: 'NAPT 靠端口区分共享同一公网 IP 的不同内网主机' },
      { to: 'net-gateway', desc: 'NAT 功能通常由家庭或企业网关路由器执行' },
    ],
    interview: '高频：NAT 如何让多设备共享一个公网 IP；NAT 对 P2P 连通性与服务端部署的影响。',
  },
  {
    id: 'net-dhcp',
    name: 'DHCP',
    en: 'Dynamic Host Configuration Protocol',
    cat: 'network',
    sub: '地址与路由',
    tags: ['地址分配', 'UDP'],
    summary: 'DHCP 让设备接入网络后自动获取 IP、掩码、网关与 DNS 配置，经四步交互免手工配置。',
    detail: `**是什么**：DHCP（动态主机配置协议）为新接入网络的设备自动下发网络配置：IP 地址、子网掩码、默认网关、DNS 服务器与租约期。

**解决什么问题**：手动为每台设备配置 IP 易冲突、难管理；DHCP 实现"插上网线就能用"。

**四步流程（DORA）**：
- Discover：客户端广播寻找 DHCP 服务器
- Offer：服务器提供可用地址
- Request：客户端正式请求该地址
- Ack：服务器确认并附带租约与配置

**提示**：DHCP 基于 UDP 广播实现；地址租约到期需续租；拿到 169.254.x.x 说明未从 DHCP 获取到地址，应检查网络或 DHCP 服务。`,
    relations: [
      { to: 'net-ip', desc: 'DHCP 负责自动分配与续租 IP 地址' },
      { to: 'net-udp', desc: 'DHCP 报文基于 UDP 67/68 端口广播' },
      { to: 'net-dns', desc: 'DHCP 下发的配置中就包含 DNS 服务器地址' },
    ],
  },
  {
    id: 'net-dns',
    name: 'DNS',
    en: 'Domain Name System',
    cat: 'network',
    sub: '地址与路由',
    tags: ['域名', '解析'],
    summary: 'DNS 将域名分层解析为 IP 地址，是互联网的电话簿，靠递归查询与多级缓存加速访问。',
    detail: `**是什么**：DNS（域名系统）把人类易记的域名（example.com）翻译成机器使用的 IP 地址，采用树状分层结构：根服务器 → 顶级域（.com）→ 权威域名服务器。

**解决什么问题**：IP 难记且会变化；域名提供稳定标识，DNS 负责动态映射，迁移服务器只需改解析记录。

**解析流程**：
- 先查浏览器与系统缓存 → 再问本地 DNS（运营商或 8.8.8.8）
- 本地 DNS 未命中则迭代查询根、顶级域、权威服务器
- 结果按 TTL 缓存

**记录类型**：A/AAAA（IP）、CNAME（别名）、MX（邮件）、TXT（验证）。

**实践**：TTL 影响切换生效时间；CDN 依赖 DNS 智能解析实现就近调度。`,
    relations: [
      { to: 'net-cdn', desc: 'CDN 通过 DNS 智能解析把用户调度到最近边缘节点' },
      { to: 'net-udp', desc: 'DNS 查询默认走 UDP 53 端口，响应过大或区域传送用 TCP' },
      { to: 'net-http', desc: '浏览器发起 HTTP 请求前必须先完成 DNS 解析' },
    ],
    interview: '高频：完整解析流程（缓存 → 递归 → 迭代）；DNS 劫持风险与 DoH/DoT 加密 DNS 的意义。',
  },
  {
    id: 'net-routing',
    name: '路由与交换',
    en: 'Routing & Switching',
    cat: 'network',
    sub: '地址与路由',
    tags: ['转发', '网络层'],
    summary: '交换在同一网段内按 MAC 转发帧，路由跨网段按 IP 查路由表逐跳转发，共同构成数据通路。',
    detail: `**是什么**：交换指链路层设备（交换机）依据 MAC 地址表在同一网段内转发数据帧；路由指网络层设备（路由器）依据路由表跨网段为 IP 包选择下一跳。

**解决什么问题**：互联网由无数网段互联而成，需要机制决定"包往哪发"——局部靠交换，跨段靠路由。

**关键点**：
- 交换机自学习源 MAC 构建转发表，转发即查表
- 路由表条目：目的网段 → 下一跳/出接口，最长前缀匹配优先
- 静态路由手工配置；OSPF、BGP 等动态路由协议自动学习全网拓扑
- 路由器是网络边界，隔离广播域

**提示**：traceroute 观察逐跳路由路径；"路由黑洞"指包被转发后无人回应、悄然丢失。`,
    relations: [
      { to: 'net-ip', desc: '路由依据 IP 目的地址与最长前缀匹配选路' },
      { to: 'net-mac', desc: '交换依据 MAC 地址表在网段内转发帧' },
      { to: 'net-gateway', desc: '默认网关就是主机视角的下一跳路由器' },
    ],
  },

  // ==================== 传输层 ====================
  {
    id: 'net-tcp',
    name: 'TCP 协议',
    en: 'Transmission Control Protocol',
    cat: 'network',
    sub: '传输层',
    tags: ['传输层', '可靠传输'],
    summary: 'TCP 是面向连接的可靠传输协议，用确认重传、排序与流控保证字节流不丢、不乱、不重。',
    detail: `**是什么**：TCP（传输控制协议）是传输层面向连接的协议，为应用提供可靠、有序、基于字节流的数据传输，HTTP、SSH、数据库连接都构建其上。

**解决什么问题**：IP 只管尽力交付，丢包、乱序、重复不可避免；TCP 用确认与重传把不可靠的网络变成可靠通道。

**核心机制**：
- 序号 + 确认（ACK）：检测丢失并按序重组数据
- 超时重传与快速重传（三个重复 ACK）
- 滑动窗口做流量控制，拥塞控制避免压垮网络
- 全双工字节流，应用层需处理粘包/拆包

**提示**：可靠性有代价——握手延迟、头部开销、队头阻塞；实时性优先的场景常改用 UDP。`,
    relations: [
      { to: 'net-tcp-handshake', desc: '三次握手建立 TCP 连接，四次挥手优雅断开' },
      { to: 'net-tcp-window', desc: '滑动窗口与拥塞控制是 TCP 流控的核心算法' },
      { to: 'net-http', desc: 'HTTP/1.1 与 HTTP/2 都构建在 TCP 连接之上' },
    ],
    interview: '高频：为什么握手三次、挥手四次；TIME_WAIT 的作用；TCP 如何保证可靠。',
  },
  {
    id: 'net-tcp-handshake',
    name: '三次握手与四次挥手',
    en: 'TCP Handshake & Teardown',
    cat: 'network',
    sub: '传输层',
    tags: ['TCP', '连接管理'],
    summary: '三次握手同步双方初始序号建立连接，四次挥手按半关闭语义分别关闭两个方向的数据流。',
    detail: `**是什么**：三次握手是 TCP 建连过程：SYN → SYN+ACK → ACK，双方交换初始序号（ISN）并确认双向可达；四次挥手是断连过程：FIN、ACK 在两个方向上各自独立完成。

**为什么三次而不是两次**：两次握手无法让服务端确认"客户端能收到自己的数据"，也无法防止历史重复 SYN 建立旧连接；三次让双方都确认了双向通道。

**挥手为何四次**：TCP 支持半关闭——一端发 FIN 只表示它不再发送数据，另一端可能还有数据要传，因此 ACK 与 FIN 分开发送。

**关键点**：主动关闭方进入 TIME_WAIT 等待 2MSL，确保最后的 ACK 可达并让旧报文消亡；高并发短连接会产生大量 TIME_WAIT。`,
    relations: [
      { to: 'net-tcp', desc: '握手与挥手是 TCP 连接生命周期管理机制' },
      { to: 'net-http', desc: 'HTTP 短连接每次请求都要完整握手，长连接复用可省去' },
      { to: 'net-quic', desc: 'QUIC 把传输与 TLS 握手合并，1-RTT 建连远快于 TCP 握手加 TLS' },
    ],
    example: `三次握手（建立连接）
客户端                    服务端
  | ---- SYN, seq=x -----------> |  我要连你，初始序号 x
  | <--- SYN+ACK, seq=y, ack=x+1 |  收到！我的序号是 y
  | ---- ACK, ack=y+1 ---------> |  确认，连接建立

四次挥手（断开连接）
  | ---- FIN ------------------> |  我发完了
  | <--- ACK -------------------- |  知道了（可能还有数据要发）
  | <--- FIN -------------------- |  我也发完了
  | ---- ACK -------------------> |  确认，进入 TIME_WAIT`,
    exampleLang: 'text',
    interview: '高频：三次握手能否两次、TIME_WAIT 为什么等 2MSL、SYN flood 攻击原理。',
  },
  {
    id: 'net-tcp-window',
    name: '滑动窗口与拥塞控制',
    en: 'Sliding Window & Congestion Control',
    cat: 'network',
    sub: '传输层',
    tags: ['TCP', '流控'],
    summary: '滑动窗口允许发送方连续发送无需逐包等待确认，拥塞控制则按网络状况动态调节发送速率。',
    detail: `**是什么**：滑动窗口是 TCP 的流量控制机制：接收方通告窗口大小，发送方在未收到确认前最多发送窗口内的数据；拥塞控制（慢启动、拥塞避免、快重传、快恢复）则探测并顺应网络的承载能力。

**解决什么问题**：逐包确认效率极低；无节制发送会淹没接收方或压垮网络。窗口机制同时约束"接收方能收"与"网络能扛"。

**关键点**：
- 实际发送速率取流量窗口与拥塞窗口的较小值
- 慢启动指数增长、丢包后乘性减小，吞吐呈锯齿曲线
- 接收窗口过小或网络丢包都会限制吞吐

**提示**：高带宽高延迟链路需调大缓冲与窗口缩放；BBR 等新算法改变了传统丢包驱动的策略。`,
    relations: [
      { to: 'net-tcp', desc: '滑动窗口与拥塞控制是 TCP 可靠且高效传输的核心' },
      { to: 'net-udp', desc: 'UDP 没有窗口与拥塞控制，节奏由应用自己把握' },
      { to: 'net-quic', desc: 'QUIC 在 UDP 上自建窗口与可插拔的拥塞控制算法' },
    ],
    interview: '高频：流量控制与拥塞控制的区别；慢启动为什么指数增长；BBR 与丢包驱动算法的思路差异。',
  },
  {
    id: 'net-udp',
    name: 'UDP',
    en: 'User Datagram Protocol',
    cat: 'network',
    sub: '传输层',
    tags: ['传输层', '无连接'],
    summary: 'UDP 是无连接、不可靠但开销极低的传输协议，适合 DNS、实时音视频等低延迟场景。',
    detail: `**是什么**：UDP（用户数据报协议）是传输层的无连接协议：在 IP 之上仅增加端口复用与校验和，不保证送达、不保证顺序、不重传。

**解决什么问题**：直播、语音、游戏中"迟到一秒的数据毫无价值"，为可靠性付出的重传与等待反而是负担；UDP 用最小开销换取最低延迟。

**特点**：
- 无握手，一包即发，头部仅 8 字节
- 支持一对一、一对多（广播/组播）
- 丢包与乱序由应用层按需处理（如 QUIC 自建可靠性）

**典型用户**：DNS 查询、DHCP、QUIC/HTTP3、实时音视频（RTP）。

**提示**：选 UDP 不等于接受不可靠——是把可靠性的责任上移到应用层，按需实现。`,
    relations: [
      { to: 'net-tcp', desc: 'TCP 可靠有序、UDP 轻量低延迟，按场景选型' },
      { to: 'net-quic', desc: 'QUIC 基于 UDP 自建可靠性与加密，兼得两者优点' },
      { to: 'net-dns', desc: 'DNS 查询通常走 UDP，一问一答开销最小' },
    ],
    interview: '高频：TCP 与 UDP 的场景选型；为什么 QUIC 选择在 UDP 上重建可靠性而非改造 TCP。',
  },
  {
    id: 'net-quic',
    name: 'QUIC',
    en: 'QUIC (HTTP/3 Transport)',
    cat: 'network',
    sub: '传输层',
    tags: ['传输层', 'HTTP3'],
    summary: 'QUIC 基于 UDP 重建可靠传输并内建 TLS1.3，1-RTT 建连、无队头阻塞，是 HTTP/3 的底座。',
    detail: `**是什么**：QUIC 是 Google 提出并由 IETF 标准化的传输协议：基于 UDP 在用户态重建可靠传输、加密与多路复用，HTTP/3 即运行于 QUIC 之上。

**解决什么问题**：TCP+TLS 建连需要多次往返、TCP 队头阻塞拖累多路复用、内核协议栈升级缓慢——QUIC 把三者一并解决。

**关键特性**：
- 传输握手与 TLS1.3 握手合并，首次 1-RTT 建连，重连可 0-RTT
- 流级别独立重传，消除跨流队头阻塞
- 连接以 Connection ID 标识，WiFi 切 4G 不断线（连接迁移）

**提示**：Chrome 已默认尝试 HTTP/3；服务端需开放 UDP 443 端口。`,
    relations: [
      { to: 'net-udp', desc: 'QUIC 构建于 UDP 之上，绕开内核 TCP 的演进僵局' },
      { to: 'net-tcp-handshake', desc: 'QUIC 把传输与 TLS 握手合并为 1-RTT/0-RTT，快于 TCP 握手加 TLS' },
      { to: 'net-https', desc: 'QUIC 强制加密，TLS1.3 内置于协议自身' },
    ],
  },

  // ==================== 应用与安全 ====================
  {
    id: 'net-http',
    name: 'HTTP 协议',
    en: 'HyperText Transfer Protocol',
    cat: 'network',
    sub: '应用与安全',
    tags: ['应用层', 'Web'],
    summary: 'HTTP 是浏览器与服务器之间的请求-响应式应用层协议，以方法、头部与状态码交换资源。',
    detail: `**是什么**：HTTP 是 Web 的应用层协议，采用请求-响应模型：客户端发送方法（GET/POST 等）+ 头部 + 可选 body，服务器返回状态码 + 头部 + 响应体。

**解决什么问题**：让异构系统以统一语义交换超文本资源；无状态设计让服务端可以水平扩展。

**关键点**：
- 无状态，靠 Cookie/Session/token 维持会话
- 版本演进：HTTP/1.1 长连接 → HTTP/2 二进制多路复用 → HTTP/3 跑在 QUIC 上
- 缓存头（Cache-Control/ETag）大幅减少重复传输
- 明文走 TCP 80 端口，加密版 HTTPS 走 443

**提示**：GET 幂等可缓存，POST 不幂等；理解幂等性对接口设计至关重要。`,
    relations: [
      { to: 'net-https', desc: 'HTTPS 是 HTTP over TLS 的加密版本' },
      { to: 'net-tcp', desc: 'HTTP/1.1 与 HTTP/2 基于 TCP 连接传输' },
      { to: 'fe-spa', desc: 'SPA 通过 fetch/XHR 发起 HTTP 请求与服务器交换数据' },
    ],
    example: `GET /terms/fe-dom HTTP/1.1
Host: codequest.example.com
Accept: application/json
Cookie: session=abc123

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: max-age=3600

{ "id": "fe-dom", "name": "DOM", "summary": "..." }`,
    exampleLang: 'http',
    interview: '高频：GET 与 POST 的语义区别；HTTP 各版本的演进动机（队头阻塞、多路复用）。',
  },
  {
    id: 'net-http-status',
    name: 'HTTP 状态码',
    en: 'HTTP Status Codes',
    cat: 'network',
    sub: '应用与安全',
    tags: ['HTTP', '排障'],
    summary: 'HTTP 状态码以三位数字表示请求结果，分 1xx-5xx 五大类：信息、成功、重定向、客户端错误、服务端错误。',
    detail: `**是什么**：状态码是 HTTP 响应首行的三位数字，标准化描述请求处理结果，客户端据此决定下一步（重试、跳转、报错）。

**五大类**：
- 1xx 信息：101 协议切换（WebSocket 升级）
- 2xx 成功：200 OK、201 Created、204 No Content
- 3xx 重定向：301 永久、302 临时、304 协商缓存命中
- 4xx 客户端错误：400 参数错、401 未认证、403 禁止、404 不存在、429 请求过多
- 5xx 服务端错误：500 内部错误、502 网关无效、503 不可用、504 网关超时

**排障提示**：502/504 多为后端宕机或超时，由反向代理返回；401 是没登录，403 是登录了也没权限。`,
    relations: [
      { to: 'net-http', desc: '状态码是 HTTP 响应的语义核心' },
      { to: 'net-proxy', desc: '反向代理在源站故障时生成 502/504 响应' },
      { to: 'net-cdn', desc: 'CDN 与 304 协商缓存配合减少回源请求' },
    ],
    interview: '高频：301 与 302 对 SEO 的影响；401 与 403 的区别；304 如何配合 ETag 工作。',
  },
  {
    id: 'net-https',
    name: 'HTTPS 与 TLS',
    en: 'HTTPS & TLS',
    cat: 'network',
    sub: '应用与安全',
    tags: ['安全', '加密'],
    summary: 'HTTPS 是 HTTP over TLS：握手协商对称密钥，为传输提供加密、完整性与服务器身份认证。',
    detail: `**是什么**：HTTPS = HTTP + TLS：先经 TCP 建连，再由 TLS 握手完成证书验证与密钥协商，之后 HTTP 报文全程加密传输（默认 443 端口）。

**解决什么问题**：明文 HTTP 可被窃听、篡改、劫持插广告；HTTPS 提供加密（防窃听）、完整性（防篡改）与身份认证（防冒名）三重保障。

**TLS 握手要点**：
- 服务器出示 CA 签发的证书，客户端验证信任链
- 基于 ECDHE 完成密钥交换，生成对称会话密钥
- TLS1.3 握手仅需 1-RTT，并支持会话恢复

**提示**：证书过期、域名不匹配是常见线上故障；全站 HTTPS 还是 PWA、HTTP/2 的前提条件。`,
    relations: [
      { to: 'net-http', desc: 'HTTPS 即加密的 HTTP，语义与状态码完全一致' },
      { to: 'net-proxy', desc: '中间人代理需安装自签证书才能解密查看 HTTPS 流量' },
      { to: 'fe-pwa', desc: 'PWA 的 Service Worker 只能在 HTTPS 环境注册' },
    ],
    interview: '高频：对称与非对称加密在 TLS 中的分工；中间人攻击为何依赖证书体系来防御。',
  },
  {
    id: 'net-proxy',
    name: '正向与反向代理',
    en: 'Forward & Reverse Proxy',
    cat: 'network',
    sub: '应用与安全',
    tags: ['代理', '架构'],
    summary: '正向代理代表客户端出网并隐藏来源，反向代理代表服务端接请求，做负载均衡与缓存。',
    detail: `**是什么**：代理是位于通信两端之间的中间服务器。正向代理站在客户端侧（公司出口、访问代理），代替用户访问外网；反向代理站在服务端侧（如 Nginx），代表后端集群对外提供服务。

**区分口诀**：正向代理隐藏"谁在访问"，反向代理隐藏"谁在服务"。

**典型用途**：
- 正向代理：内网出网管控、访问中转、匿名
- 反向代理：负载均衡、TLS 卸载、静态缓存、安全隔离、灰度分流

**关键点**：反向代理常是 API 网关的基础形态；X-Forwarded-For 链路传递真实客户端 IP，排障时注意代理会改变连接的可见信息。`,
    relations: [
      { to: 'net-cdn', desc: 'CDN 本质是部署在全球边缘节点的分布式反向代理' },
      { to: 'be-lb', desc: '反向代理常承担负载均衡，把请求分发到后端服务器集群' },
      { to: 'net-http-status', desc: '反向代理在后端故障时生成 502/504 响应' },
    ],
    interview: '高频：正向与反向代理的区别；Nginx 反向代理如何获取真实 IP（X-Forwarded-For 链）。',
  },
  {
    id: 'net-cdn',
    name: 'CDN',
    en: 'Content Delivery Network',
    cat: 'network',
    sub: '应用与安全',
    tags: ['加速', '缓存'],
    summary: 'CDN 把静态资源缓存到全球边缘节点，经 DNS 调度让用户就近获取，降低延迟并减轻源站压力。',
    detail: `**是什么**：CDN（内容分发网络）把图片、JS/CSS、视频等资源复制到分布各地的边缘节点，通过 DNS 智能解析把用户调度到最近节点获取内容。

**解决什么问题**：物理距离决定延迟，用户与源站越远越慢；CDN 就近服务，同时为源站挡掉绝大多数静态流量与攻击流量。

**工作机制**：
- 边缘节点未命中 → 回源拉取并按缓存策略存储
- 缓存时长由 Cache-Control / 过期时间决定
- 命中率是核心指标；动态内容可走动态加速链路优化

**实践**：静态资源文件名带 hash 实现长缓存；源站设置合理缓存头；版本更新用 CDN 主动 purge 刷新。`,
    relations: [
      { to: 'net-dns', desc: 'CDN 依赖 DNS 智能解析实现就近调度' },
      { to: 'fe-lazy-loading', desc: '前端懒加载的后续资源请求由 CDN 就近快速响应' },
      { to: 'fe-ssg', desc: 'SSG 产出的纯静态站点最适合全站 CDN 分发' },
    ],
    interview: '实践：浏览器缓存、CDN 缓存、源站缓存三层要协同设计；hash 文件名 + 长缓存是标配。',
  },
  {
    id: 'net-websocket',
    name: 'WebSocket',
    en: 'WebSocket',
    cat: 'network',
    sub: '应用与安全',
    tags: ['长连接', '实时'],
    summary: 'WebSocket 经 HTTP 握手升级为全双工长连接，服务器可主动推送，适合聊天与行情场景。',
    detail: `**是什么**：WebSocket 是基于 TCP 的全双工应用层协议：先借 HTTP 发起带 Upgrade 头的握手，成功后协议切换为 WebSocket，双方随时互发消息。

**解决什么问题**：HTTP 请求-响应模型中服务器无法主动推送，轮询既浪费又延迟大；WebSocket 提供一条低延迟的常驻通道。

**关键点**：
- 握手走 HTTP 101 Switching Protocols，之后帧开销极小（2-10 字节）
- 天然双向，支持文本与二进制帧
- 需自建心跳保活与断线重连；网关与负载均衡要支持长连接
- 只需服务器单向推送时，SSE 是更轻量的替代

**实践**：鉴权放在握手阶段（Cookie 或 URL token），消息层再校验权限。`,
    relations: [
      { to: 'net-http', desc: 'WebSocket 借用 HTTP 握手完成协议升级' },
      { to: 'net-tcp', desc: 'WebSocket 底层依赖 TCP 的可靠字节流' },
      { to: 'fe-spa', desc: 'SPA 中 WebSocket 常用于实时消息与状态同步' },
    ],
    example: `const ws = new WebSocket('wss://chat.example.com/socket');

ws.onopen = () => ws.send(JSON.stringify({ type: 'join', room: 'fe' }));

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  console.log('收到推送:', msg.text);
};

// 简化的断线重连
ws.onclose = () => setTimeout(() => location.reload(), 3000);`,
    exampleLang: 'js',
  },
  {
    id: 'net-firewall',
    name: '防火墙',
    en: 'Firewall',
    cat: 'network',
    sub: '应用与安全',
    tags: ['安全', '边界'],
    summary: '防火墙按地址、端口、协议与连接状态等规则过滤进出流量，划定可信与不可信的网络边界。',
    detail: `**是什么**：防火墙是网络安全设备或模块，依据预定义规则放行、拒绝或丢弃流量，部署在信任边界（内外网之间）或主机之上（iptables、Windows 防火墙）。

**解决什么问题**：并非所有端口都应对外开放；防火墙把"默认拒绝、按需放行"变成硬约束，最大限度缩小攻击面。

**关键技术**：
- 包过滤：按 IP/端口/协议五元组匹配
- 状态检测：跟踪连接状态，只放行合法会话的回包
- 应用层防火墙/WAF：深入 HTTP 内容拦截注入与 XSS

**实践**：遵循最小开放——公网只开 80/443 与必要管理端口；云上的安全组是防火墙的云化形态。`,
    relations: [
      { to: 'net-port', desc: '防火墙规则的核心维度之一是端口放行范围' },
      { to: 'net-ddos', desc: '防火墙配合清洗中心过滤 DDoS 异常流量' },
      { to: 'net-vpn', desc: 'VPN 隧道流量需在防火墙上显式放行' },
    ],
  },
  {
    id: 'net-vpn',
    name: 'VPN',
    en: 'Virtual Private Network',
    cat: 'network',
    sub: '应用与安全',
    tags: ['安全', '隧道'],
    summary: 'VPN 在公网建立加密隧道，把远程设备安全接入企业内网，或整体加密用户的网络出口。',
    detail: `**是什么**：VPN（虚拟专用网络）利用隧道与加密技术在公共网络上构建逻辑专用网络：远程办公接入公司内网，或将用户全部流量经 VPN 服务器中转。

**解决什么问题**：公网不可信、内网不可直达；VPN 让远程设备"逻辑上身处内网"，传输内容对中间链路保密。

**关键技术**：
- 隧道协议：IPsec、OpenVPN（TLS）、WireGuard（现代高性能）
- 加密与认证保证机密性、完整性与身份
- 分割隧道（仅内网走 VPN）与全网隧道两种路由策略

**提示**：VPN 加密链路但 VPN 服务器可见明文流量，选择需基于信任；与 HTTPS 的区别在于保护范围是整个网络层。`,
    relations: [
      { to: 'net-https', desc: 'HTTPS 只加密单条 HTTP 通道，VPN 在网络层加密整机流量' },
      { to: 'net-firewall', desc: '防火墙需放行 VPN 隧道协议端口，并管控接入后的内网访问' },
      { to: 'net-ip', desc: 'VPN 隧道封装 IP 数据包，并为客户端分配虚拟内网 IP' },
    ],
  },
  {
    id: 'net-ddos',
    name: 'DDoS 攻击',
    en: 'Distributed Denial of Service',
    cat: 'network',
    sub: '应用与安全',
    tags: ['攻击', '可用性'],
    summary: 'DDoS 用海量受控主机从多点向目标发送流量或请求，耗尽带宽与资源使服务瘫痪。',
    detail: `**是什么**：DDoS（分布式拒绝服务攻击）指攻击者操纵僵尸网络中的大量主机，同时向目标发送海量流量或请求，使其带宽、连接表、CPU 或内存耗尽，正常用户无法访问。

**攻击与防御的逻辑**：攻击者无需入侵目标，仅靠"量大"即可瘫痪服务；防御方的课题是识别并丢弃恶意流量、保住正常业务。

**攻击分类**：
- 流量型：UDP flood、反射放大（NTP/DNS）——拼带宽
- 协议型：SYN flood——耗尽连接表
- 应用型：HTTP flood、CC 攻击——耗尽后端计算

**防御体系**：CDN/高防 IP 吸收流量、清洗中心过滤异常、限流与验证码拦截应用层、弹性扩容兜底。`,
    relations: [
      { to: 'net-cdn', desc: 'CDN 边缘节点分散并吸收攻击流量，是 DDoS 的第一道缓冲' },
      { to: 'net-firewall', desc: '防火墙与清洗设备按特征过滤攻击流量' },
      { to: 'be-rate-limit', desc: '应用层限流（令牌桶、验证码）可缓解 CC 类应用型攻击' },
    ],
    interview: '高频：SYN flood 原理与 SYN Cookie 防御；为什么单靠防火墙扛不住大流量攻击。',
  },
  {
    id: 'net-packet-capture',
    name: '抓包分析',
    en: 'Packet Capture & Analysis',
    cat: 'network',
    sub: '应用与安全',
    tags: ['排障', '工具'],
    summary: '抓包分析用 Wireshark/tcpdump 截获并逐层解析网络报文，是定位协议问题最直接的排障手段。',
    detail: `**是什么**：抓包是在网络接口上截获流经的数据包并逐层解析还原协议细节，工具以 Wireshark（图形化）与 tcpdump（命令行）为代表。

**解决什么问题**："应用说发了、对方说没收到"的扯皮，抓包给出链路上的客观证据；握手慢、重传多、TLS 失败一目了然。

**关键能力**：
- 按过滤表达式定位流量（host、port、协议）
- 观察 TCP 三次握手、窗口通告、重传与 RTT
- HTTPS 报文默认密文，需用 SSLKEYLOGFILE 导出会话密钥才能解密查看明文

**实践**：生产环境抓包注意隐私与合规；配合交换机镜像端口/span 获取完整双向流量。`,
    relations: [
      { to: 'net-packet', desc: '抓包直接观察逐层封装结构与各层头部' },
      { to: 'net-tcp-handshake', desc: '抓包是验证握手时序与重传行为的首选手段' },
      { to: 'net-https', desc: 'HTTPS 流量需导出密钥才能在抓包中看到明文' },
    ],
    interview: '实践：tcpdump -i any host 1.2.3.4 -w out.pcap 后用 Wireshark 分析；先过滤再抓，减少数据量。',
  },
];
