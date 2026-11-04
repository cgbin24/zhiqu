/**
 * 课程品牌标识 —— 全部为本地内联 SVG 绘制的简化官方风格 logo。
 * 无远程加载 → 无空窗、无闪烁、无网络依赖。
 */

export type BrandId = 'go' | 'rust' | 'cpp' | 'linux' | 'algo';

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

export function BrandLogo({ brand, size = 32 }: { brand: BrandId; size?: number }) {
  switch (brand) {
    case 'go': return <GoLogo size={size} />;
    case 'rust': return <RustLogo size={size} />;
    case 'cpp': return <CppLogo size={size} />;
    case 'linux': return <LinuxLogo size={size} />;
    case 'algo': return <AlgoLogo size={size} />;
  }
}
