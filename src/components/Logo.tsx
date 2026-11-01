/** 品牌 Logo：渐变圆角方块 + 代码括号 + 金色火花 */
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c5cf0" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#logo-g)" />
      <path
        d="M23 21 12 32l11 11M41 21l11 11-11 11"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="32" cy="32" r="3.4" fill="#ffd76e" />
    </svg>
  );
}
