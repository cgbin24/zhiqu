import type { Term } from './types';

/** embedded 领域术语：硬件平台 / 外设与接口 / 底层机制 / 软件架构 / 行业协议 */
export const EMB_EMBEDDED: Term[] = [
  // ==================== 硬件平台 ====================
  {
    id: 'emb-mcu',
    name: 'MCU 微控制器',
    en: 'Microcontroller Unit',
    cat: 'embedded',
    sub: '硬件平台',
    tags: ['芯片', '单片机', '硬件基础'],
    summary: 'MCU 将 CPU、存储器与常用外设集成到单颗芯片，以低成本、低功耗成为嵌入式设备的核心大脑。',
    detail: `**是什么**：MCU（微控制器）是把 CPU 内核、Flash 程序存储器、SRAM 以及 GPIO、定时器、ADC、串口等外设全部集成在一颗芯片上的微型计算机，俗称单片机。

**解决什么问题**：用一颗几元到几十元的芯片替代"处理器 + 内存 + 多颗外设芯片"的分立方案，大幅降低成本、体积与功耗，让家电、玩具、传感器都能智能化。

**如何工作**：
- 上电后从 Flash 固定启动地址取出第一条指令执行
- CPU 内核通过外设总线访问各外设的寄存器
- 中断系统让外设事件能主动打断主程序

**实践要点**：选型主要看主频、Flash/RAM 容量、外设种类数量、功耗与封装；主流代表有 STM32、ESP32、GD32、瑞萨 RA 等。`,
    relations: [
      { to: 'emb-soc', desc: 'MCU 可视为轻量级 SoC，偏控制场景、资源小、实时性强' },
      { to: 'emb-mpu', desc: 'MPU 主打算力、需外挂存储跑 Linux，MCU 自带存储跑裸机或 RTOS' },
      { to: 'emb-register', desc: 'MCU 片上外设全部通过读写寄存器来控制' },
      { to: 'emb-bare-metal', desc: 'MCU 最常运行裸机前后台程序' },
    ],
    interview: '高频考点：MCU 与 MPU 的区别（集成度、实时性、操作系统）；评估一颗 MCU 要看哪些参数。',
  },
  {
    id: 'emb-mpu',
    name: 'MPU 微处理器',
    en: 'Microprocessor Unit',
    cat: 'embedded',
    sub: '硬件平台',
    tags: ['芯片', '处理器', '嵌入式 Linux'],
    summary: 'MPU 是主打计算性能的微处理器，需外挂内存与存储，常运行 Linux，用于网关、工控与智能终端。',
    detail: `**是什么**：MPU（微处理器）指以 CPU 计算能力为核心、需要外挂 DRAM 与存储介质的处理器芯片，主频通常数百 MHz 到数 GHz。

**解决什么问题**：当任务超出 MCU 能力——要跑图形界面、复杂协议栈、文件系统或多进程应用时，就得换成 MPU + 操作系统的方案。

**关键差异（vs MCU）**：
- 主频与算力高一个数量级，多为 Cortex-A 系列内核
- 无大容量片上存储，依赖 DDR 外挂内存
- 通常运行嵌入式 Linux / Android，开发重心在驱动与应用层

**实践要点**：树莓派、NXP i.MX、瑞芯微/全志系列是常见平台；MPU 方案开发效率高，但成本、功耗、启动速度都不如 MCU，按需求边界选型。`,
    relations: [
      { to: 'emb-mcu', desc: 'MPU 与 MCU 是性能与集成度的两个极端' },
      { to: 'emb-cross-compile', desc: 'MPU 跑 Linux，程序必须在主机上交叉编译' },
      { to: 'emb-firmware', desc: 'MPU 平台的系统镜像与应用包同样统称固件' },
      { to: 'emb-soc', desc: '高端 SoC 常以 MPU 内核为核心集成专用加速器' },
    ],
    interview: '面试常问：MPU 与 MCU 的选型边界；为什么 MPU 平台几乎都选嵌入式 Linux 而不是 RTOS。',
  },
  {
    id: 'emb-soc',
    name: 'SoC 片上系统',
    en: 'System on Chip',
    cat: 'embedded',
    sub: '硬件平台',
    tags: ['芯片', '集成', '硬件架构'],
    summary: 'SoC 把 CPU、GPU、内存控制器、无线基带等完整系统集成进单颗芯片，是手机与智能设备的核心。',
    detail: `**是什么**：SoC（System on Chip，片上系统）在一颗芯片里集成完整的计算系统：CPU、GPU、内存控制器、视频编解码、WiFi/蓝牙基带，乃至 NPU。

**解决什么问题**：手机、可穿戴设备对体积和功耗极度敏感，分立芯片方案装不下、电不够；SoC 用高度集成把整个系统塞进指甲盖大小。

**如何工作**：
- 内部通过 AMBA 总线（AXI/AHB/APB）互联各模块
- 大小核 + DVFS 动态调频调压，平衡性能与功耗
- 模块按需上断电，配合低功耗模式节能

**实践要点**：MCU 也可视为轻量 SoC；手机 SoC（骁龙、天玑）与物联网 SoC（ESP32）复杂度差异巨大，选型按集成需求与预算走。`,
    relations: [
      { to: 'emb-mcu', desc: 'MCU 是简化版 SoC：CPU + 存储 + 基础外设' },
      { to: 'emb-mpu', desc: 'SoC 融合 MPU 内核与 GPU/NPU 等专用模块' },
      { to: 'emb-lowpower', desc: 'SoC 的电源域与时钟门控是低功耗设计的硬件基础' },
    ],
    interview: '面试常问：SoC 与 MCU 的区别；AMBA 总线上 AXI/AHB/APB 各自的分工。',
  },
  {
    id: 'emb-register',
    name: '寄存器',
    en: 'Register',
    cat: 'embedded',
    sub: '硬件平台',
    tags: ['底层', '外设控制', '位操作'],
    summary: '寄存器是外设的控制开关与状态窗口，嵌入式软件通过读写特定位来直接操控硬件行为。',
    detail: `**是什么**：寄存器是芯片内外设暴露给软件的存储单元，每个寄存器有固定地址，按位定义含义：使能位、模式位、状态位、数据位等。

**解决什么问题**：CPU 无法直接"摸"到外设电路，寄存器就是软硬件之间的合约——软件写 1 置位、读状态，硬件按位含义动作。

**如何工作**：
- 查芯片手册找到寄存器地址与位定义
- 用"读-改-写"三步更新控制位，避免破坏其他位
- 访问指针声明为 volatile，防止编译器优化掉硬件访问

**误区与要点**：部分状态位是"写 1 清零"语义，直接写 0 无效；读改写不是原子操作，中断里改同一寄存器需要关中断保护。`,
    relations: [
      { to: 'emb-mmio', desc: '寄存器通过内存映射 IO 暴露在统一地址空间中' },
      { to: 'emb-gpio', desc: '点亮 LED 的第一步就是操作 GPIO 的方向与数据寄存器' },
      { to: 'emb-mcu', desc: 'MCU 的每个片上外设都由一组寄存器控制' },
    ],
    example: `/* STM32 风格的寄存器位操作：点亮 PA5 的 LED */

#define GPIOA_BASE  0x40010800UL
#define GPIOA_ODR   (*(volatile unsigned int *)(GPIOA_BASE + 0x0C))
#define GPIOA_CRL   (*(volatile unsigned int *)(GPIOA_BASE + 0x00))

/* 1. 配置 PA5 为通用推挽输出：读-改-写，不破坏其他位 */
GPIOA_CRL = (GPIOA_CRL & ~(0xFu << 20)) | (0x2u << 20);

/* 2. 置位：输出高电平 */
GPIOA_ODR |= (1u << 5);

/* 3. 清零：输出低电平 */
GPIOA_ODR &= ~(1u << 5);`,
    exampleLang: 'c',
    interview: '实践考点：为什么访问硬件寄存器必须加 volatile；读-改-写为什么会破坏其他位。',
  },
  {
    id: 'emb-mmio',
    name: '内存映射 IO',
    en: 'Memory-Mapped I/O',
    cat: 'embedded',
    sub: '硬件平台',
    tags: ['底层', '地址空间', '硬件接口'],
    summary: '内存映射 IO 把外设寄存器编入统一内存地址空间，CPU 用普通读写指令即可访问硬件。',
    detail: `**是什么**：内存映射 IO（MMIO）把外设寄存器安排进 CPU 的统一内存地址空间，访问外设与访问内存使用相同的 load/store 指令。

**解决什么问题**：早期 x86 用独立 IN/OUT 端口指令访问 IO，寻址能力受限；MMIO 让内存的全部寻址与指针运算能力都可用于硬件访问，架构更统一。

**如何工作**：
- 芯片手册给出外设基址，如 GPIOA 位于 0x40010800
- C 语言把地址强转成 volatile 指针后直接读写
- Linux 下通过设备树描述寄存器段，驱动用 ioremap 映射

**要点**：编译器可能重排内存访问，关键时序处需要内存屏障；映射出的地址不能被缓存，缓存属性要设对。`,
    relations: [
      { to: 'emb-register', desc: 'MMIO 是寄存器的统一访问通道' },
      { to: 'emb-gpio', desc: 'GPIO 寄存器组就映射在内存地址空间里' },
      { to: 'emb-dma', desc: 'DMA 与 CPU 在同一地址空间里搬运数据' },
    ],
    example: `/* volatile 告诉编译器：每次都必须真实访问硬件，不许优化 */

volatile unsigned int *status_reg =
    (volatile unsigned int *)0x40020000UL;

unsigned int status = *status_reg;   /* 读状态寄存器 */

/* 轮询等待外设就绪（检查最低状态位） */
while ((*status_reg & 0x01u) == 0) {
    /* busy wait */
}`,
    exampleLang: 'c',
    interview: '底层考点：MMIO 与端口 IO（Port IO）的区别；volatile 与内存屏障为什么都不可少。',
  },

  // ==================== 外设与接口 ====================
  {
    id: 'emb-gpio',
    name: 'GPIO',
    en: 'General Purpose Input/Output',
    cat: 'embedded',
    sub: '外设与接口',
    tags: ['外设', '数字信号', '基础'],
    summary: 'GPIO 是可编程的通用输入输出口，能读按键电平、控制 LED 与继电器，是嵌入式点灯第一课。',
    detail: `**是什么**：GPIO（通用输入输出）是芯片上可由软件配置方向与功能的引脚：输出时驱动高低电平，输入时读取外部电平。

**解决什么问题**：让数字系统与物理世界对话——读按键、检测限位开关，控制 LED、蜂鸣器、继电器，几乎一切控制类功能都从 GPIO 开始。

**关键机制**：
- 方向寄存器决定输入/输出模式
- 上拉/下拉电阻定义引脚悬空时的默认电平
- 推挽输出驱动能力强，开漏输出可线与、跨电压域
- 多数 GPIO 可映射为外部中断源

**实践要点**：机械按键要软件消抖（延时确认）；驱动继电器、电机时注意 GPIO 拉电流能力有限，通常要三极管或 MOS 管驱动。`,
    relations: [
      { to: 'emb-register', desc: 'GPIO 由方向、数据、上下拉等寄存器控制' },
      { to: 'emb-irq', desc: 'GPIO 电平跳变可触发外部中断' },
      { to: 'emb-pwm', desc: 'GPIO 复用为 PWM 输出引脚，实现调光调速' },
    ],
    example: `/* GPIO 控制三步曲：使能时钟 -> 配置模式 -> 读写电平 */

RCC->AHB1ENR |= RCC_AHB1ENR_GPIOAEN;  /* 1. 打开 GPIOA 时钟 */
GPIOA->MODER  |= (1u << (2 * 5));     /* 2. PA5 设为输出模式 */

GPIOA->BSRR = (1u << 5);              /* 3a. 置高：点亮 LED */
GPIOA->BSRR = (1u << (5 + 16));       /* 3b. 置低：熄灭 LED */

/* 输入读取：检查按键是否按下（低电平有效） */
if ((GPIOC->IDR & (1u << 13)) == 0) {
    /* 按键按下，执行处理（记得消抖） */
}`,
    exampleLang: 'c',
    interview: '必考实践：推挽与开漏的区别及适用场景；按键消抖的硬件与软件方案。',
  },
  {
    id: 'emb-uart',
    name: 'UART 串口',
    en: 'Universal Asynchronous Receiver/Transmitter',
    cat: 'embedded',
    sub: '外设与接口',
    tags: ['通信', '串口', '调试'],
    summary: 'UART 是异步串行通信接口，两根信号线即可全双工收发，是嵌入式调试日志与模块通信标配。',
    detail: `**是什么**：UART（通用异步收发器）是最简单的串行通信接口：TX 发、RX 收，加上地线共三根线即可全双工通信。

**解决什么问题**：调试要看日志、模块要收指令，UART 以极低的软硬件成本满足"能通信"的基本需求，几乎所有 MCU 都带多个 UART。

**帧格式**：起始位 + 数据位（5-9 位）+ 可选校验位 + 停止位；双方约定相同波特率（如 115200）各自用本地时钟采样，这就是"异步"的含义。

**实践要点**：
- 两端波特率、数据位、校验必须一致，否则乱码
- 长距离或跨电压域需电平转换（TTL/RS232/RS485）
- printf 重定向到串口是嵌入式最常用的调试手段`,
    relations: [
      { to: 'emb-spi', desc: 'SPI 带独立时钟线同步传输，速率高于异步的 UART' },
      { to: 'emb-i2c', desc: 'I2C 同步多从机寻址，UART 异步点对点，按拓扑选型' },
      { to: 'emb-mqtt', desc: '设备常经 UART 接蜂窝/WiFi 模组，再以 MQTT 上云' },
    ],
    example: `UART 帧格式（8N1：8 数据位、无校验、1 停止位）

 空闲   起始  D0  D1  D2  D3  D4  D5  D6  D7  停止  空闲
─────┐     ┌───┬───┬───┬───┬───┬───┬───┬───┐     ┌─────
 高  │  0  │ 1 │ 0 │ 1 │ 0 │ 0 │ 1 │ 1 │ 0 │  1  │  高
     └─────┴───┴───┴───┴───┴───┴───┴───┴───┘     ┘
      LSB ──────> MSB      每位时长 = 1 / 波特率

调试口常用参数：115200-8-N-1（波特率-数据位-校验-停止位）
115200 波特时每位约 8.68 微秒`,
    exampleLang: 'text',
    interview: '基础考点：UART 帧格式；异步通信为什么靠约定波特率就能对齐；TTL 与 RS232 电平差异。',
  },
  {
    id: 'emb-spi',
    name: 'SPI',
    en: 'Serial Peripheral Interface',
    cat: 'embedded',
    sub: '外设与接口',
    tags: ['通信', '总线', '高速'],
    summary: 'SPI 是主从式同步四线总线，全双工高速传输，常驱动 Flash、TFT 屏与 SD 卡等高速外设。',
    detail: `**是什么**：SPI（串行外设接口）是同步全双工主从总线，四条信号线：SCLK 时钟、MOSI 主出从入、MISO 主入从出、CS 片选。

**解决什么问题**：Flash、屏幕、高速 ADC 需要 Mbps 级以上的传输速率，UART/I2C 不够用；SPI 靠独立时钟线同步，速率可达数十 Mbps。

**关键机制**：
- 主机拉低对应 CS 选中一个从机，随后产生时钟收发数据
- 时钟极性 CPOL 与相位 CPHA 组成四种模式，主从必须匹配
- 每根 CS 管一个从机，无地址冲突问题

**实践要点**：模式配错的表现是读到全 0 或全 FF；长走线注意信号完整性；刷屏、读写 Flash 等大批量传输建议配合 DMA。`,
    relations: [
      { to: 'emb-i2c', desc: '高速用 SPI、省引脚用 I2C 是经典选型组合' },
      { to: 'emb-dma', desc: 'SPI 大数据量传输常配 DMA 自动搬运' },
      { to: 'emb-uart', desc: '同为串行接口，SPI 同步带时钟线，UART 异步' },
    ],
    interview: '高频考点：SPI 四种模式（CPOL/CPHA）如何确定；SPI 与 I2C 的选型对比。',
  },
  {
    id: 'emb-i2c',
    name: 'I2C',
    en: 'Inter-Integrated Circuit',
    cat: 'embedded',
    sub: '外设与接口',
    tags: ['通信', '总线', '两线制'],
    summary: 'I2C 仅用两根线经地址寻址挂载多个从设备，是低速传感器与配置寄存器读写的首选总线。',
    detail: `**是什么**：I2C（Inter-Integrated Circuit）是两线制同步总线：SDA 数据、SCL 时钟，通过 7 位地址区分总线上的多个从设备。

**解决什么问题**：一块板子上常挂七八个传感器，不可能每个都拉一束线；I2C 用两根线 + 地址寻址解决多设备共享问题，省引脚、省布线。

**关键机制**：
- SDA/SCL 均为开漏输出，必须外接上拉电阻
- 起始/停止条件由主机在 SCL 高电平时拉 SDA 产生
- 每字节后从机回 ACK 应答，无应答说明设备不在或忙
- 标准模式 100kHz，快速模式 400kHz

**误区**：两个同地址传感器无法共存（需改地址引脚）；上拉阻值不当会导致波形边沿变差、通信偶发失败。`,
    relations: [
      { to: 'emb-spi', desc: '低速配置类用 I2C，高速数据流用 SPI' },
      { to: 'emb-uart', desc: '同步多从机 vs 异步点对点的典型对比' },
      { to: 'emb-modbus', desc: '板内低速传感走 I2C，工业现场走 RS485 + Modbus' },
    ],
    example: `I2C 一次完整写操作时序要点

[起始] -> [从机地址+写位] -> [ACK] -> [寄存器地址] -> [ACK] -> [数据] -> [ACK] -> [停止]

要点：
1. 起始条件：SCL 高电平期间，SDA 由高变低
2. 每传完 8 位，第 9 个时钟由接收方拉低 SDA 表示 ACK
3. 停止条件：SCL 高电平期间，SDA 由低变高
4. SDA 只允许在 SCL 低电平期间变化，否则被解析成起止条件
5. 读操作要先写寄存器地址，再重复起始后切换为读方向`,
    exampleLang: 'text',
    interview: '必考点：起始/停止条件的波形定义；为什么 I2C 必须上拉电阻；如何排查从机拉死 SDA 的总线卡死问题。',
  },
  {
    id: 'emb-can',
    name: 'CAN 总线',
    en: 'Controller Area Network',
    cat: 'embedded',
    sub: '外设与接口',
    tags: ['通信', '汽车', '工业'],
    summary: 'CAN 是高可靠差分总线，靠报文 ID 仲裁与完善的错误处理机制，广泛用于汽车与工业控制。',
    detail: `**是什么**：CAN（Controller Area Network）是博世为汽车设计的多主差分总线，双绞线差分传输（CAN_H/CAN_L），显性电平可覆盖隐性电平。

**解决什么问题**：汽车里几十个 ECU 互联，电磁干扰严重且不允许通信瘫痪；CAN 从物理层到协议层都为可靠实时而生。

**关键机制**：
- 多主仲裁：ID 数值越小优先级越高，非破坏性逐位仲裁
- 帧内 CRC、ACK 校验与错误计数器，故障节点自动隔离
- 标准帧 11 位 ID、扩展帧 29 位 ID，典型速率 500kbps

**实践要点**：总线两端各需 120 欧终端电阻；错误计数累积到 bus-off 状态要设计恢复策略；车载诊断 OBD 协议即基于 CAN。`,
    relations: [
      { to: 'emb-uart', desc: 'UART 点对点通信，CAN 多主广播且自带仲裁' },
      { to: 'emb-irq', desc: 'CAN 收发依赖中断驱动保证实时性' },
      { to: 'emb-modbus', desc: '工业现场 CAN 与 RS485 + Modbus 常并存' },
    ],
    interview: '汽车电子必考：CAN 的非破坏性逐位仲裁原理；错误帧与 bus-off 恢复流程。',
  },
  {
    id: 'emb-adc',
    name: 'ADC 模数转换',
    en: 'Analog-to-Digital Converter',
    cat: 'embedded',
    sub: '外设与接口',
    tags: ['外设', '模拟信号', '采样'],
    summary: 'ADC 把连续模拟电压转换成数字量，让 MCU 能读取温度、光照、电池电压等模拟信号。',
    detail: `**是什么**：ADC（模数转换器）把连续变化的模拟电压按参考电压量化为离散数字值，是 MCU 感知模拟世界的入口。

**解决什么问题**：温度、光照、声音、电池电压都是模拟量，CPU 只认识数字；没有 ADC，一切模拟传感器的数据都进不了软件。

**关键参数**：
- 分辨率：12 位 ADC 把参考电压分成 4096 级，读数 = V_in / V_ref × 4095
- 采样率：每秒采样次数，越高越能还原快速变化的信号
- 通道数：多路输入经内部多路开关共用一个转换核心

**实践要点**：信号源阻抗高时要延长采样时间；读数抖动用均值/中值滤波；精密测量关注参考电压的稳定性与噪声。`,
    relations: [
      { to: 'emb-dac', desc: 'DAC 是反向过程：数字量转模拟电压' },
      { to: 'emb-dma', desc: '连续高速采样常用 DMA 自动搬运转换结果' },
      { to: 'emb-register', desc: '采样配置与结果读取全部经由 ADC 寄存器' },
    ],
    example: `/* 12 位 ADC、3.3V 参考电压下的换算 */

#define VREF 3.3f
#define ADC_MAX 4095.0f

uint16_t raw = adc_read(CH_TEMP);            /* 0..4095 */
float voltage = raw / ADC_MAX * VREF;        /* 实际电压 */
float temp = (voltage - 0.5f) * 100.0f;      /* 按传感器公式换算 */

/* 简单滑动均值滤波抑制抖动 */
static uint16_t buf[8]; static int idx = 0;
buf[idx++ % 8] = raw;
float smooth = average(buf, 8);`,
    exampleLang: 'c',
    interview: '常见问题：12 位 ADC、3.3V 参考电压下的最小分辨电压；为什么采样要做滤波。',
  },
  {
    id: 'emb-dac',
    name: 'DAC 数模转换',
    en: 'Digital-to-Analog Converter',
    cat: 'embedded',
    sub: '外设与接口',
    tags: ['外设', '模拟输出', '信号生成'],
    summary: 'DAC 把数字量还原为模拟电压输出，用于波形生成、音频输出与模拟量控制。',
    detail: `**是什么**：DAC（数模转换器）把数字值按参考电压比例还原成模拟电压输出，与 ADC 互为逆过程。

**解决什么问题**：有些执行机构只认模拟量——音频功放、激光器电流、模拟仪表；DAC 让数字系统也能"说出"模拟语言。

**关键参数**：
- 分辨率：位数越高输出台阶越细腻
- 建立时间：输出稳定到目标值所需时间，决定最高更新速率
- 输出缓冲：能否直接驱动负载

**实践要点**：不带 DAC 的 MCU 可用 PWM + RC 低通滤波低成本近似；音频类输出注意按奈奎斯特速率更新，用定时器触发 + DMA 播放波形表。`,
    relations: [
      { to: 'emb-adc', desc: 'ADC 与 DAC 是模拟世界进出数字系统的两个方向' },
      { to: 'emb-pwm', desc: 'PWM 加低通滤波是不带 DAC 芯片时的廉价替代' },
      { to: 'emb-timer', desc: '定时器触发 DAC 按固定速率输出波形' },
    ],
    interview: '概念考点：DAC 建立时间与更新速率的关系；PWM 加低通滤波为什么能替代 DAC。',
  },
  {
    id: 'emb-pwm',
    name: 'PWM 脉宽调制',
    en: 'Pulse Width Modulation',
    cat: 'embedded',
    sub: '外设与接口',
    tags: ['外设', '占空比', '控制'],
    summary: 'PWM 通过调节脉冲占空比等效控制平均功率，是电机调速、LED 调光与舵机控制的核心手段。',
    detail: `**是什么**：PWM（脉宽调制）输出固定频率的方波，通过改变一个周期内高电平的占比（占空比）来等效调节平均输出功率。

**解决什么问题**：数字系统只能输出 0 和 1，怎么让 LED"半亮"、电机"半速"？PWM 用快速通断欺骗惯性负载，实现无级调节。

**关键机制**：
- 由定时器计数比较产生，硬件自动翻转输出
- 频率决定响应速度与噪声，占空比决定平均功率
- 高级定时器支持互补输出与死区，可驱动半桥电路

**实践要点**：LED 调光频率低于约 200Hz 会肉眼可见闪烁；电机驱动要设死区时间防上下管直通；舵机需要 50Hz、0.5-2.5ms 脉宽的专用时序。`,
    relations: [
      { to: 'emb-timer', desc: 'PWM 本质是定时器的比较输出功能' },
      { to: 'emb-gpio', desc: 'GPIO 引脚复用为 PWM 输出' },
      { to: 'emb-dac', desc: 'PWM 加 RC 滤波可低成本模拟 DAC 输出' },
    ],
    example: `/* 定时器 PWM 输出：72MHz 主频，目标 1kHz、50% 占空比 */

/* 频率公式：f_pwm = f_clk / (PSC+1) / (ARR+1) */
/* 取 PSC=71（72 分频得 1MHz），ARR=999 -> 1MHz/1000 = 1kHz */

TIM3->PSC   = 71;          /* 预分频：72MHz -> 1MHz 计数频率 */
TIM3->ARR   = 999;         /* 计数上限：周期 1000 个计数 = 1ms */
TIM3->CCR1  = 500;         /* 比较值 500/1000 = 50% 占空比 */
TIM3->CCMR1 = TIM_CCMR1_OC1M_1 | TIM_CCMR1_OC1M_2; /* PWM 模式1 */
TIM3->CCER |= TIM_CCER_CC1E;   /* 使能通道 1 输出 */
TIM3->CR1  |= TIM_CR1_CEN;     /* 启动计数器 */

/* 调速/调光只需在运行中修改 CCR1：0~999 对应 0%~100% */`,
    exampleLang: 'c',
    interview: '必考：占空比与平均电压的关系；死区时间为什么必要；选择 PWM 频率要考虑哪些因素。',
  },

  // ==================== 底层机制 ====================
  {
    id: 'emb-irq',
    name: '中断',
    en: 'Interrupt',
    cat: 'embedded',
    sub: '底层机制',
    tags: ['底层机制', '事件驱动', 'ISR'],
    summary: '中断让硬件事件主动打断 CPU 转去执行 ISR，实现事件驱动响应，是嵌入式实时性的根基。',
    detail: `**是什么**：中断是硬件通知 CPU 的机制：事件发生时 CPU 暂停当前程序，跳到中断向量表对应的 ISR（中断服务函数）执行，完毕后回到原处继续。

**解决什么问题**：轮询检测外设既浪费 CPU 又响应慢；中断让 CPU 平时干正事、事件来了第一时间处理，实现"事件驱动"。

**关键机制**：
- 向量表存放各中断的入口地址
- 优先级分组决定抢占关系，高优先级可打断低优先级
- ISR 内禁止耗时操作，通常只置标志位，主循环或任务里再处理

**误区与要点**：ISR 里调用 printf、加延时是大忌；共享数据需关中断保护；中断嵌套过深会拖垮实时性。`,
    relations: [
      { to: 'emb-bare-metal', desc: '前后台系统 = 主循环后台 + 中断前台' },
      { to: 'emb-rtos', desc: 'RTOS 的任务切换与系统调用建立在中断机制之上' },
      { to: 'emb-timer', desc: '定时器溢出中断产生系统节拍' },
    ],
    example: `/* 经典前后台协作：中断只置标志，处理放主循环 */

volatile uint8_t uart_rx_flag = 0;
volatile uint8_t uart_rx_buf[64];
volatile uint8_t uart_rx_len  = 0;

/* 前台：中断服务函数，短平快 */
void USART1_IRQHandler(void)
{
    if (USART1->SR & USART_SR_RXNE) {
        uart_rx_buf[uart_rx_len++] = USART1->DR;  /* 只取数据 */
        uart_rx_flag = 1;                          /* 置标志位 */
    }
}

/* 后台：主循环负责真正处理 */
int main(void)
{
    while (1) {
        if (uart_rx_flag) {
            uart_rx_flag = 0;
            process_frame(uart_rx_buf, uart_rx_len); /* 耗时处理 */
            uart_rx_len = 0;
        }
    }
}`,
    exampleLang: 'c',
    interview: '核心考点：为什么 ISR 要尽量短；中断嵌套与优先级分组；如何在 ISR 与主程序间安全传递数据（volatile + 标志位）。',
  },
  {
    id: 'emb-dma',
    name: 'DMA',
    en: 'Direct Memory Access',
    cat: 'embedded',
    sub: '底层机制',
    tags: ['底层机制', '数据搬运', '性能'],
    summary: 'DMA 让外设与内存直接搬运数据而无需 CPU 参与，大批量传输时显著释放算力。',
    detail: `**是什么**：DMA（Direct Memory Access，直接存储器访问）是独立于 CPU 的数据搬运引擎，可在内存与外设、内存与内存之间直接传送数据。

**解决什么问题**：CPU 逐字节收串口数据、逐像素刷屏既慢又占用算力；DMA 只需配置一次源地址、目标地址与长度，传输全程 CPU 可以去做别的。

**关键机制**：
- 多通道并行服务不同外设，带仲裁优先级
- 支持循环模式与外设触发（如 ADC 每次转换完成自动搬走结果）
- 传输完成/半完成产生中断通知 CPU

**实践要点**：CPU 与 DMA 同时访问同一 SRAM 区域存在总线竞争；开启 D-Cache 的平台要处理缓存一致性（地址对齐、无效化操作）。`,
    relations: [
      { to: 'emb-uart', desc: '串口收发大数据包配 DMA 防丢字节' },
      { to: 'emb-adc', desc: 'ADC 连续采样经 DMA 自动写入缓冲区' },
      { to: 'emb-mmio', desc: 'DMA 与 CPU 共享同一内存映射地址空间' },
    ],
    interview: '高频考点：DMA 传输期间 CPU 在做什么；缓存一致性问题如何处理；什么场景该用 DMA。',
  },
  {
    id: 'emb-timer',
    name: '定时器',
    en: 'Timer',
    cat: 'embedded',
    sub: '底层机制',
    tags: ['底层机制', '计时', '系统节拍'],
    summary: '定时器按预设周期计数溢出产生中断或输出波形，支撑系统节拍、精确延时与 PWM。',
    detail: `**是什么**：定时器是对时钟脉冲计数的硬件外设：从预分频后的时钟计数，计到设定值溢出，触发中断或改变输出电平。

**解决什么问题**：软件延时靠空转浪费 CPU 且不精确；硬件定时器在 CPU 忙时也能精确计时，是系统节拍、超时检测、波形生成的统一底座。

**关键机制**：
- 计数周期 = (预分频 + 1) × (自动重装值 + 1) / 时钟频率
- 溢出中断可作为 RTOS 的系统节拍
- 比较输出生成 PWM，输入捕获测量脉冲宽度
- 看门狗本质是一个必须按时清零的特殊定时器

**实践要点**：低功耗设计选低功耗定时器（LPTIM）维持计时；定时器资源紧张时注意复用规划。`,
    relations: [
      { to: 'emb-pwm', desc: '定时器的比较输出功能即 PWM' },
      { to: 'emb-irq', desc: '定时器溢出中断是系统节拍的来源' },
      { to: 'emb-watchdog', desc: '看门狗是"不喂就复位"的特殊定时器' },
      { to: 'emb-rtos', desc: 'RTOS 的 tick 由硬件定时器中断驱动' },
    ],
    example: `定时周期计算公式（以 STM32 通用定时器为例）

定时周期 T = (PSC + 1) * (ARR + 1) / f_clk

例：f_clk = 72MHz，目标 1ms 中断一次
  0.001 = (PSC+1) * (ARR+1) / 72,000,000
  取 PSC = 71（72 分频 -> 计数频率 1MHz）
  则 ARR + 1 = 1000 -> ARR = 999

验证：72,000,000 / 72 / 1000 = 1000 Hz = 1ms`,
    exampleLang: 'text',
    interview: '计算题：72MHz 时钟、预分频 71、重装值 999 时的定时周期；定时器与 SysTick 的分工。',
  },
  {
    id: 'emb-watchdog',
    name: '看门狗',
    en: 'Watchdog Timer',
    cat: 'embedded',
    sub: '底层机制',
    tags: ['可靠性', '复位', '容错'],
    summary: '看门狗在程序跑飞或死循环未按时"喂狗"时自动复位芯片，是无人值守设备的最后防线。',
    detail: `**是什么**：看门狗（Watchdog Timer）是一个递减计数的特殊定时器：程序必须周期性"喂狗"（重置计数），否则计数到 0 就复位整个系统。

**解决什么问题**：设备部署在野外、车顶、水表井里，死机意味着上门维护；看门狗把"程序跑飞"从需要人工复位变成几秒内自动自愈。

**关键机制**：
- 独立看门狗（IWDG）用独立低速时钟，主时钟失效也照常工作
- 窗口看门狗（WWDG）规定喂狗时间窗口，太快太慢都复位，防止跑飞后机械喂狗
- 喂狗点应分布在不同任务/主循环的关键路径上

**误区**：只在某个定时中断里喂狗等于没喂——主循环死了看门狗还活着；喂狗过频会掩盖卡顿问题。`,
    relations: [
      { to: 'emb-timer', desc: '看门狗是递减计数的定时器变体' },
      { to: 'emb-rt', desc: '高可靠系统要求复位恢复时间可预期' },
      { to: 'emb-fota', desc: 'FOTA 升级失败时靠看门狗复位并回滚' },
    ],
    interview: '可靠性考点：独立看门狗与窗口看门狗的区别；为什么不能只在一个定时中断里喂狗。',
  },
  {
    id: 'emb-lowpower',
    name: '低功耗模式',
    en: 'Low Power Mode',
    cat: 'embedded',
    sub: '底层机制',
    tags: ['功耗', '睡眠', '电池'],
    summary: '低功耗模式通过逐级关断时钟、外设与电源域，让电池设备的待机时间从数天延长到数年。',
    detail: `**是什么**：低功耗模式是 MCU 提供的多级节能状态：从仅停 CPU 时钟的睡眠模式，到关断大部分外设时钟的停止模式，再到几乎整机断电的待机模式。

**解决什么问题**：水表、传感器标签可能要求一节纽扣电池用五年；靠持续运行绝无可能，必须"没活儿就睡、有事再醒"。

**模式层级与权衡**：
- 睡眠：唤醒最快（微秒级），功耗中等
- 停止：保留 SRAM 与寄存器内容，唤醒后接着跑
- 待机：几乎全断电，功耗最低，唤醒后等同复位重启

**实践要点**：睡前配置好唤醒源（外部中断、RTC、低功耗定时器）；实测功耗，外设漏电与 GPIO 悬空常是"降不下来"的主因；RTOS 用 tickless 模式停掉空闲节拍。`,
    relations: [
      { to: 'emb-irq', desc: '外部中断是停止模式最常用的唤醒源' },
      { to: 'emb-rtos', desc: 'RTOS 的 tickless 空闲策略联动低功耗' },
      { to: 'emb-ble', desc: 'BLE 协议按事件间歇收发，依赖睡眠调度省电' },
    ],
    interview: '功耗题：睡眠/停止/待机三级模式的功耗与唤醒时间排序；为什么实测电流总是比数据手册高。',
  },

  // ==================== 软件架构 ====================
  {
    id: 'emb-bare-metal',
    name: '裸机与前后台系统',
    en: 'Bare-Metal / Foreground-Background',
    cat: 'embedded',
    sub: '软件架构',
    tags: ['软件架构', '主循环', '中断'],
    summary: '裸机系统不依赖操作系统，以"主循环 + 中断"的前后台模式组织程序，是最简嵌入式执行模型。',
    detail: `**是什么**：裸机（Bare-Metal）指不使用操作系统的开发方式，程序直接运行在硬件上；典型组织是前后台系统——主循环 while(1) 为后台，中断服务为前台。

**解决什么问题**：小项目上操作系统是浪费：多占 RAM、引入调度不确定性、还有授权成本；前后台模型足够简单透明，行为完全可预测。

**如何工作**：
- 中断捕获异步事件，置标志或写入环形缓冲
- 主循环轮询标志，按优先级顺序处理各项任务
- 时间相关的轮询借助系统节拍计时

**局限与要点**：任务一多主循环变成长队，实时性靠运气；没有抢占，长任务会饿死其他事件——任务超过三五个就该考虑 RTOS。`,
    relations: [
      { to: 'emb-irq', desc: '中断是前后台系统的"前台"主角' },
      { to: 'emb-rtos', desc: 'RTOS 用抢占调度解决裸机模型的实时性瓶颈' },
      { to: 'emb-firmware', desc: '裸机程序烧录后即整个固件' },
    ],
    example: `/* 前后台系统：主循环 + 中断标志位 */

int main(void)
{
    system_init();            /* 时钟、GPIO、UART、定时器初始化 */

    while (1) {               /* 后台：超级循环 */
        if (flag_100ms) {     /* 定时器中断每 100ms 置位 */
            flag_100ms = 0;
            scan_keys();      /* 按键扫描（带消抖） */
        }
        if (flag_uart) {      /* 串口中断收到一帧数据 */
            flag_uart = 0;
            handle_uart_cmd();
        }
        if (flag_adc_done) {  /* ADC 转换完成 */
            flag_adc_done = 0;
            update_display();
        }
    }
}`,
    exampleLang: 'c',
    interview: '架构题：前后台系统如何安排任务优先级；出现哪些信号说明该迁移到 RTOS。',
  },
  {
    id: 'emb-rtos',
    name: 'RTOS 实时操作系统',
    en: 'Real-Time Operating System',
    cat: 'embedded',
    sub: '软件架构',
    tags: ['操作系统', '任务调度', 'FreeRTOS'],
    summary: 'RTOS 以确定性抢占调度运行多任务，提供信号量、队列等同步机制，让嵌入式软件模块化并发。',
    detail: `**是什么**：RTOS（实时操作系统）是专为确定性响应设计的轻量操作系统：按优先级抢占调度任务，内核通常只有几十 KB。

**解决什么问题**：裸机前后台在任务多时响应不可控；RTOS 让每个功能独立成任务，高优先级事件永远先被处理，截止期有保证。

**核心机制**：
- 任务（线程）+ 优先级抢占式调度，同优先级可时间片轮转
- 信号量/互斥锁做同步，队列传递数据
- 互斥锁支持优先级继承，缓解优先级反转
- FreeRTOS、Zephyr、RT-Thread、RTX 是主流代表

**实践要点**：任务栈按最大调用深度估算并留余量，栈溢出是最常见死因；中断回调里只发信号量/队列，不在 ISR 里做业务逻辑。`,
    relations: [
      { to: 'emb-rt', desc: 'RTOS 的存在意义就是兑现硬实时承诺' },
      { to: 'emb-bare-metal', desc: '裸机的进阶替代，以任务化组织代码' },
      { to: 'emb-timer', desc: '系统节拍 tick 由硬件定时器中断提供' },
    ],
    interview: '必考：RTOS 与 Linux 的实时性差异；优先级反转与优先级继承；任务栈大小的估算方法。',
  },
  {
    id: 'emb-rt',
    name: '硬实时与软实时',
    en: 'Hard / Soft Real-Time',
    cat: 'embedded',
    sub: '软件架构',
    tags: ['实时性', '确定性', 'Deadline'],
    summary: '硬实时要求截止期绝对不可错过，软实时允许偶尔超时；实时性指确定性而非单纯跑得快。',
    detail: `**是什么**：实时系统指计算结果必须在限定时间（Deadline）内完成的系统。硬实时：错过即灾难，如安全气囊、电机 FOC 控制；软实时：偶尔超时可容忍，如视频播放丢一帧。

**解决什么问题**：普通系统追求平均性能，实时系统追求"最坏情况可控"——刹车信号 10ms 内必须有响应，平均 1ms 没有意义。

**如何保证**：
- 可抢占调度 + 明确的中断延迟上界
- 限制关中断时间、控制临界区长度
- 避免动态内存分配与不可预测的算法复杂度
- 用逻辑分析仪实测最坏路径的响应时间

**误区**：实时 ≠ 快。慢而准时是实时，快而不准时不是；提高主频解决不了抖动问题。`,
    relations: [
      { to: 'emb-rtos', desc: 'RTOS 是实现实时调度的基础设施' },
      { to: 'emb-irq', desc: '中断延迟是实时性指标的核心组成' },
      { to: 'emb-watchdog', desc: '硬实时系统仍需看门狗兜底极端故障' },
    ],
    interview: '概念辨析：硬实时与软实时的典型例子；为什么"平均响应时间"对硬实时系统没有意义。',
  },
  {
    id: 'emb-bootloader',
    name: 'Bootloader',
    en: 'Bootloader',
    cat: 'embedded',
    sub: '软件架构',
    tags: ['启动', '固件升级', '引导'],
    summary: 'Bootloader 是上电运行的第一段程序，负责初始化硬件、校验固件并决定加载应用或进入升级。',
    detail: `**是什么**：Bootloader 是芯片复位后最先执行的一段固件：初始化最基本硬件，检查应用区固件是否有效，然后跳转应用或进入升级流程。

**解决什么问题**：固件可能损坏、需要现场或远程更新；Bootloader 是"永远不变的地基"，让应用可以安全地被替换。

**典型流程**：
- 上电 → 初始化时钟/内存 → 检查升级标志
- 有升级请求：经串口/USB/网络接收新固件写入备用区
- CRC/签名校验通过 → 设置启动分区 → 跳转应用
- 校验失败或应用损坏 → 停留在 Bootloader 等待重刷

**实践要点**：双分区（A/B）+ 回滚是 FOTA 的标配设计；Bootloader 自身务必精简稳定，它坏了就只能上烧录器了。`,
    relations: [
      { to: 'emb-fota', desc: 'FOTA 依赖 Bootloader 完成写入与分区切换' },
      { to: 'emb-firmware', desc: 'Bootloader 与应用固件分区存放、独立更新' },
      { to: 'emb-cross-compile', desc: 'Bootloader 与应用分开编译，链接地址各不相同' },
    ],
    example: `双分区（A/B）固件升级流程

Flash 布局：
+------------+------------+------------+
| Bootloader |   App A    |   App B    |
|   32KB     |   480KB    |   480KB    |
+------------+------------+------------+

运行 App A 时收到升级请求：
1. 下载新固件 -> 写入 App B（备用分区）
2. CRC + 签名校验通过 -> 设置启动标志为 B
3. 复位 -> Bootloader 读标志 -> 跳转 App B
4. App B 首次自检失败 -> 标志回退 A -> 复位重启
5. 最坏情况：B 写到一半断电 -> A 分区完好，照常启动`,
    exampleLang: 'text',
    interview: '升级考点：双分区 A/B 升级如何回滚；为什么 Bootloader 不能依赖应用区的任何代码。',
  },
  {
    id: 'emb-firmware',
    name: '固件',
    en: 'Firmware',
    cat: 'embedded',
    sub: '软件架构',
    tags: ['软件', '镜像', '烧录'],
    summary: '固件是烧写在设备 Flash 中、赋予硬件具体功能的软件程序，是嵌入式开发的核心交付物。',
    detail: `**是什么**：固件（Firmware）是固化在设备非易失存储器中的软件：从裸机程序、RTOS 应用到路由器的嵌入式 Linux 系统镜像都属于固件。

**解决什么问题**：硬件出厂时是"白纸"，固件赋予它行为；固件设计也决定设备的可维护性——能否升级、能否修复漏洞。

**生命周期**：
- 开发：交叉编译生成 .bin/.hex/.elf 镜像
- 烧录：SWD/JTAG 调试器或出厂治具烧录
- 运行：Bootloader 引导加载
- 升级：FOTA 远程或本地工具更新

**实践要点**：固件必须带版本号便于现场排查；量产镜像关闭调试口与冗余日志；安全敏感设备的固件要签名防篡改。`,
    relations: [
      { to: 'emb-bootloader', desc: 'Bootloader 负责固件的加载与升级' },
      { to: 'emb-fota', desc: '固件的远程更新通道' },
      { to: 'emb-cross-compile', desc: '固件由交叉编译工具链生成' },
    ],
    interview: '工程考点：.bin/.hex/.elf 的区别；量产固件为什么必须做签名与版本管理。',
  },
  {
    id: 'emb-fota',
    name: 'FOTA 远程升级',
    en: 'Firmware Over-The-Air',
    cat: 'embedded',
    sub: '软件架构',
    tags: ['升级', 'OTA', '物联网'],
    summary: 'FOTA 通过网络远程推送并安装固件更新，配合双分区与回滚机制保证升级失败也能恢复。',
    detail: `**是什么**：FOTA（Firmware Over-The-Air）指设备通过网络（蜂窝/WiFi/以太网）远程下载并安装固件更新，无需人工接触设备。

**解决什么问题**：百万台设备铺在户外，一个安全漏洞逐台返厂不现实；FOTA 是物联网设备全生命周期的"救命通道"。

**典型流程**：
- 云端发布带版本与签名的固件包
- 设备收到升级通知（MQTT 下发），闲时下载差分或全量包
- 写入备用分区，做 CRC/签名校验
- 重启由 Bootloader 切换分区，失败自动回滚旧版本

**实践要点**：断点续传与断电保护必须设计；"升级过程掉电不变砖"是底线；差分升级省流量但依赖严格的版本匹配。`,
    relations: [
      { to: 'emb-bootloader', desc: 'Bootloader 执行分区切换与回滚' },
      { to: 'emb-firmware', desc: 'FOTA 更新的对象就是固件' },
      { to: 'emb-mqtt', desc: 'MQTT 常用于下发升级指令与上报进度' },
    ],
    interview: '物联网考点：FOTA 如何保证断电不死机（双分区 + 原子切换）；全量与差分升级的取舍。',
  },
  {
    id: 'emb-cross-compile',
    name: '交叉编译',
    en: 'Cross Compilation',
    cat: 'embedded',
    sub: '软件架构',
    tags: ['工具链', '构建', 'GCC'],
    summary: '交叉编译在 x86 主机上生成 ARM 等目标平台的可执行代码，是嵌入式软件的标准构建方式。',
    detail: `**是什么**：交叉编译（Cross Compilation）是在一种架构的主机（如 x86 PC）上，用交叉工具链编译出另一种架构（如 ARM Cortex-M/A）可执行代码的过程。

**解决什么问题**：目标机性能弱、没有操作系统或键盘屏幕，无法"自己编译自己"；只能在强大的主机上隔山打牛，产物再传到目标机运行。

**关键要素**：
- 工具链前缀区分目标架构：arm-none-eabi-gcc、aarch64-linux-gnu-gcc
- 目标文件格式与链接脚本由目标平台决定
- 依赖库也必须为目标架构交叉编译，不能混用主机库

**实践要点**：工具链版本与目标库要配套；构建脚本传入目标三元组即可切换平台；CI 固定工具链版本保证可复现构建。`,
    relations: [
      { to: 'emb-firmware', desc: '交叉编译的产物就是固件镜像' },
      { to: 'emb-mpu', desc: '嵌入式 Linux 平台的应用与内核必须交叉编译' },
      { to: 'ops-ci', desc: 'CI 流水线自动交叉编译并产出固件包' },
    ],
    interview: '构建考点：什么是工具链三元组（target triplet）；为什么依赖库也必须交叉编译。',
  },

  // ==================== 行业协议 ====================
  {
    id: 'emb-modbus',
    name: 'Modbus',
    en: 'Modbus',
    cat: 'embedded',
    sub: '行业协议',
    tags: ['协议', '工业', '主从'],
    summary: 'Modbus 是工业界最普及的主从式通信协议，围绕寄存器读写设计，支持串口与 TCP 传输。',
    detail: `**是什么**：Modbus 是 1979 年诞生的工业通信协议，主从架构：主机发起请求，从机应答；数据模型是线圈、离散输入、保持寄存器、输入寄存器四类地址。

**解决什么问题**：PLC、变频器、电表、传感器来自不同厂商，需要统一"方言"互通；Modbus 简单、公开、够用，成为工业领域事实标准。

**两种传输形态**：
- Modbus RTU：跑在 RS485/RS232 串口上，二进制帧，工业现场主流
- Modbus TCP：跑在以太网上，端口 502，便于接入网关与上位机

**实践要点**：从机地址 1-247；功能码 03 读保持寄存器、06/16 写寄存器最常用；RS485 总线注意终端电阻与半双工方向切换。`,
    relations: [
      { to: 'emb-uart', desc: 'Modbus RTU 的底层承载就是 UART/RS485 串口' },
      { to: 'emb-register', desc: 'Modbus 的数据模型就是一张外设寄存器表' },
      { to: 'emb-mqtt', desc: '网关常把 Modbus 设备数据转成 MQTT 上云' },
    ],
    interview: '工业必考：Modbus RTU 与 TCP 的区别；四类地址的用途；主从架构为什么不适合设备主动上报。',
  },
  {
    id: 'emb-mqtt',
    name: 'MQTT',
    en: 'Message Queuing Telemetry Transport',
    cat: 'embedded',
    sub: '行业协议',
    tags: ['协议', '物联网', '发布订阅'],
    summary: 'MQTT 是发布订阅模型的轻量级消息协议，专为低带宽不稳定网络设计，是物联网上云的事实标准。',
    detail: `**是什么**：MQTT 是基于 TCP 的轻量级发布/订阅消息协议：设备（发布者）向 Broker 的主题发消息，订阅该主题的云服务或其他设备收到副本。

**解决什么问题**：海量设备直连服务器互拉数据不可扩展；MQTT 用 Broker 中转解耦，报文头最小仅 2 字节，弱网环境下依然可靠。

**核心机制**：
- 三种 QoS：0 至多一次、1 至少一次、2 恰好一次
- 遗嘱消息（LWT）：设备异常掉线时由 Broker 代发遗言
- 保留消息：新订阅者立即收到该主题最后一条状态

**实践要点**：主题设计要有产品与设备维度；遥测上行 QoS1 足够，控制指令建议带幂等 ID；生产环境必须配 TLS 加密。`,
    relations: [
      { to: 'emb-fota', desc: 'MQTT 下发 FOTA 升级指令与进度上报' },
      { to: 'be-mq', desc: 'MQTT Broker 是物联网版的消息队列' },
      { to: 'be-kafka', desc: '云端常把 MQTT 数据汇入 Kafka 做流转' },
      { to: 'net-tcp', desc: 'MQTT 构建在 TCP 长连接之上' },
    ],
    example: `物联网主题（Topic）设计示例

设备上报：
  dev/{productKey}/{deviceId}/state        # 在线状态（保留消息）
  dev/{productKey}/{deviceId}/telemetry    # 遥测数据 JSON
  dev/{productKey}/{deviceId}/event/fota   # 升级进度上报

云端下发：
  dev/{productKey}/{deviceId}/cmd          # 控制指令（QoS1 + 幂等 msgId）
  dev/{productKey}/{deviceId}/cmd/ota      # OTA 升级通知

规则：
- 用 device-id 隔离权限，ACL 限制只能收发自己的主题
- 状态主题设 retain，新订阅者立刻知道设备当前状态
- 遥测消息带 ts 时间戳，服务端按序去重`,
    exampleLang: 'text',
    interview: '物联网必考：QoS 0/1/2 的含义与取舍；遗嘱消息与保留消息的用途；MQTT 相比 HTTP 轮询省在哪。',
  },
  {
    id: 'emb-ble',
    name: 'BLE 低功耗蓝牙',
    en: 'Bluetooth Low Energy',
    cat: 'embedded',
    sub: '行业协议',
    tags: ['无线', '蓝牙', '低功耗'],
    summary: 'BLE 低功耗蓝牙以间歇收发与深度睡眠实现年级续航，通过 GATT 服务模型与手机交换数据。',
    detail: `**是什么**：BLE（Bluetooth Low Energy）是蓝牙 4.0 起的低功耗分支：设备只在极短的事件窗口收发，其余时间深度睡眠，峰值电流低至毫安级。

**解决什么问题**：手环、胎压计、体温贴要求续航以年计且成本敏感；经典蓝牙的持续连接模式撑不住，BLE 为"偶尔说一句话"而生。

**关键机制**：
- 广播（Advertising）：从机周期广播供主机发现，广播包可携带数据
- 连接后按连接间隔间歇通信，间隔越长越省电
- GATT 数据模型：服务 → 特征值 → 读写/通知
- 安全：配对绑定与链路加密

**实践要点**：连接间隔、从机延迟、超时三参数决定功耗与实时性的平衡；大数据量用通知分段发送；BLE 模块常以透传方式充当"无线串口"。`,
    relations: [
      { to: 'emb-lowpower', desc: 'BLE 的省电依赖设备侧的睡眠调度配合' },
      { to: 'emb-uart', desc: 'BLE 模块常以透传方式替代串口线' },
      { to: 'emb-mqtt', desc: '手机 App 经 BLE 收数据后再以 MQTT 上云' },
    ],
    interview: '蓝牙考点：广播与连接两种状态的功耗差异；GATT 中 Service 与 Characteristic 的关系；连接间隔如何影响续航。',
  },
];
