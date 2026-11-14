/**
 * 课程品牌标识 —— 全部为本地内联 SVG 绘制的简化官方风格 logo。
 * 无远程加载 → 无空窗、无闪烁、无网络依赖。
 */

export type BrandId = 'go' | 'rust' | 'cpp' | 'linux' | 'algo' | 'agentdev' | 'collab' | 'git' | 'kb' | 'cron' | 'harmony';

/** Go：官方青色 "GO" 字标 + 速度线 */
export function GoLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#00ADD8" />
      <g fill="#ffffff">
        <rect x="8" y="22" width="14" height="4" rx="2" opacity="0.85" />
        <rect x="5" y="29" width="11" height="4" rx="2" opacity="0.6" />
        <rect x="9" y="36" width="13" height="4" rx="2" opacity="0.4" />
        <text x="24" y="44" fontSize="26" fontWeight="900" fontFamily="system-ui, sans-serif" fontStyle="italic">GO</text>
      </g>
    </svg>
  );
}

/** Rust：官方齿轮中的 "R" 标识（简化齿轮环 + 中心 R） */
export function RustLogo({ size = 32 }: { size?: number }) {
  const teeth = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2;
    return { x: 32 + 24 * Math.cos(a), y: 32 + 24 * Math.sin(a) };
  });
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#1f2937" />
      <circle cx="32" cy="32" r="21" fill="none" stroke="#f74c00" strokeWidth="4.5" />
      {teeth.map((t, i) => (
        <circle key={i} cx={t.x} cy={t.y} r="3.4" fill="#f74c00" />
      ))}
      <text x="32" y="41" textAnchor="middle" fontSize="24" fontWeight="900" fontFamily="system-ui, sans-serif" fill="#ffffff">R</text>
    </svg>
  );
}

/** C++：官方蓝色六边形 + C++ 字样 */
export function CppLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0b1c33" />
      <path d="M32 8 L52 19 L52 45 L32 56 L12 45 L12 19 Z" fill="#00599C" />
      <path d="M32 8 L52 19 L52 27 L32 16 Z" fill="#659AD2" />
      <text x="30" y="40" textAnchor="middle" fontSize="15" fontWeight="900" fontFamily="system-ui, sans-serif" fill="#ffffff">C</text>
      <text x="41" y="34" textAnchor="middle" fontSize="10" fontWeight="900" fontFamily="system-ui, sans-serif" fill="#ffffff">++</text>
    </svg>
  );
}

/** Linux：Tux 企鹅简化形象 */
export function LinuxLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#1a1a2e" />
      {/* 身体 */}
      <ellipse cx="32" cy="36" rx="16" ry="19" fill="#0f0f1a" />
      {/* 白肚 */}
      <ellipse cx="32" cy="40" rx="10" ry="13" fill="#fdf6e3" />
      {/* 头 */}
      <circle cx="32" cy="18" r="9" fill="#0f0f1a" />
      {/* 眼睛 */}
      <circle cx="28.5" cy="16" r="1.8" fill="#ffffff" />
      <circle cx="35.5" cy="16" r="1.8" fill="#ffffff" />
      <circle cx="28.9" cy="16.4" r="0.9" fill="#0f0f1a" />
      <circle cx="35.1" cy="16.4" r="0.9" fill="#0f0f1a" />
      {/* 喙 */}
      <path d="M28 20 Q32 24 36 20 Q32 22.5 28 20 Z" fill="#f9a825" />
      {/* 脚 */}
      <ellipse cx="25" cy="54" rx="5" ry="2.4" fill="#f9a825" />
      <ellipse cx="39" cy="54" rx="5" ry="2.4" fill="#f9a825" />
      {/* 翅膀 */}
      <path d="M17 32 Q13 42 18 50 Q20 44 20 36 Z" fill="#0f0f1a" />
      <path d="M47 32 Q51 42 46 50 Q44 44 44 36 Z" fill="#0f0f1a" />
    </svg>
  );
}

/** 算法：分治树 + 节点连线 emblem */
export function AlgoLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="url(#algo-g)" />
      <defs>
        <linearGradient id="algo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c5cf0" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      <g stroke="#ffffff" strokeWidth="2.4" fill="none" opacity="0.95">
        <line x1="32" y1="14" x2="18" y2="30" />
        <line x1="32" y1="14" x2="46" y2="30" />
        <line x1="18" y1="30" x2="26" y2="46" />
        <line x1="18" y1="30" x2="12" y2="46" />
        <line x1="46" y1="30" x2="52" y2="46" />
      </g>
      <circle cx="32" cy="14" r="4.5" fill="#ffd76e" />
      <circle cx="18" cy="30" r="4" fill="#ffffff" />
      <circle cx="46" cy="30" r="4" fill="#ffffff" />
      <circle cx="12" cy="46" r="3.6" fill="#ffd76e" opacity="0.9" />
      <circle cx="26" cy="46" r="3.6" fill="#ffffff" opacity="0.85" />
      <circle cx="52" cy="46" r="3.6" fill="#ffd76e" opacity="0.9" />
    </svg>
  );
}

export function AgentLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0c4a6e" />
      <rect x="14" y="20" width="36" height="26" rx="6" fill="#38bdf8" />
      <circle cx="24" cy="32" r="4" fill="#0c4a6e" />
      <circle cx="40" cy="32" r="4" fill="#0c4a6e" />
      <rect x="28" y="27" width="8" height="2.5" rx="1" fill="#0c4a6e" />
      <line x1="32" y1="12" x2="32" y2="20" stroke="#38bdf8" strokeWidth="2.5" />
      <circle cx="32" cy="10" r="3" fill="#fbbf24" />
      <line x1="14" y1="46" x2="14" y2="52" stroke="#38bdf8" strokeWidth="3" />
      <line x1="50" y1="46" x2="50" y2="52" stroke="#38bdf8" strokeWidth="3" />
    </svg>
  );
}

/** AI 协作：人机双气泡对话 + 共创火花 */
export function CollabLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="collab-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ec4899" />
          <stop offset="1" stopColor="#fb7185" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#500724" />
      {/* 人的气泡（左上，实心） */}
      <path d="M12 16 a6 6 0 0 1 6 -6 h16 a6 6 0 0 1 6 6 v10 a6 6 0 0 1 -6 6 h-12 l-6 6 v-6 h-2 a6 6 0 0 1 -6 -6 Z" fill="url(#collab-g)" />
      <circle cx="22" cy="21" r="2" fill="#500724" />
      <circle cx="29" cy="21" r="2" fill="#500724" />
      <circle cx="36" cy="21" r="2" fill="#500724" />
      {/* AI 的气泡（右下，描边） */}
      <path d="M52 48 a6 6 0 0 1 -6 6 h-16 a6 6 0 0 1 -6 -6 v-10 a6 6 0 0 1 6 -6 h12 l6 -6 v6 h2 a6 6 0 0 1 6 6 Z" fill="#134e4a" stroke="#2dd4bf" strokeWidth="2" />
      <rect x="30" y="36" width="14" height="2.4" rx="1.2" fill="#2dd4bf" />
      <rect x="30" y="41" width="9" height="2.4" rx="1.2" fill="#2dd4bf" opacity="0.7" />
      {/* 共创火花 */}
      <circle cx="46" cy="14" r="3" fill="#fbbf24" />
      <circle cx="52" cy="21" r="2" fill="#fbbf24" opacity="0.75" />
      <circle cx="42" cy="8" r="1.6" fill="#fbbf24" opacity="0.5" />
    </svg>
  );
}


/** Git：分支图徽标（主线 + 分叉节点） */
export function GitLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#431407" />
      <path d="M20 14 L20 50" stroke="#f05133" strokeWidth="4" strokeLinecap="round" />
      <path d="M20 32 Q20 22 44 22" stroke="#fb923c" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M20 32 Q20 42 44 42" stroke="#fb923c" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="20" cy="14" r="5" fill="#f05133" />
      <circle cx="20" cy="50" r="5" fill="#f05133" />
      <circle cx="44" cy="22" r="5" fill="#fbbf24" />
      <circle cx="44" cy="42" r="5" fill="#fbbf24" />
    </svg>
  );
}


/** 知识库：书本 + 完成勾 */
export function KbLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#451a03" />
      <rect x="14" y="12" width="24" height="40" rx="3" fill="#f59e0b" />
      <rect x="18" y="18" width="16" height="3" rx="1.5" fill="#451a03" opacity="0.7" />
      <rect x="18" y="24" width="12" height="3" rx="1.5" fill="#451a03" opacity="0.5" />
      <rect x="30" y="18" width="20" height="28" rx="3" fill="#fbbf24" />
      <rect x="34" y="24" width="12" height="2.5" rx="1.25" fill="#451a03" opacity="0.6" />
      <rect x="34" y="29" width="9" height="2.5" rx="1.25" fill="#451a03" opacity="0.45" />
      <circle cx="48" cy="48" r="7" fill="#22c55e" />
      <path d="M45 48 L47.5 50.5 L51.5 45.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}


/** 定时任务：时钟表盘 + 指针 */
export function CronLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#042f2e" />
      <circle cx="32" cy="32" r="20" fill="#134e4a" stroke="#2dd4bf" strokeWidth="3" />
      <path d="M32 32 L32 18" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 32 L43 38" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="32" r="2.5" fill="#fbbf24" />
      <path d="M32 6 L32 12 M58 32 L52 32 M32 58 L32 52 M6 32 L12 32" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function BrandLogo({ brand, size = 32 }: { brand: BrandId; size?: number }) {
  switch (brand) {
    case 'go': return <GoLogo size={size} />;
    case 'rust': return <RustLogo size={size} />;
    case 'cpp': return <CppLogo size={size} />;
    case 'linux': return <LinuxLogo size={size} />;
    case 'algo': return <AlgoLogo size={size} />;
    case 'agentdev': return <AgentLogo size={size} />;
    case 'collab': return <CollabLogo size={size} />;
case 'git': return <GitLogo size={size} />;
case 'kb': return <KbLogo size={size} />;
case 'cron': return <CronLogo size={size} />;
case 'harmony': return <HarmonyLogo size={size} />;
  }
}

export function HarmonyLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#061a3d" />
      <circle cx="32" cy="32" r="17" fill="none" stroke="#3b82f6" strokeWidth="4" />
      <circle cx="32" cy="32" r="6" fill="#60a5fa" />
      <path d="M32 15 A17 17 0 0 1 47.4 40.5" stroke="#93c5fd" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
