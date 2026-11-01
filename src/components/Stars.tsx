/** 星级展示：earned = 已得星数；size 控制尺寸；dim 显示灰色空星 */
export function Stars({ earned, max = 3, size = 'sm' }: { earned: number; max?: number; size?: 'xs' | 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-sm' : 'text-[11px]';
  return (
    <span className={`inline-flex items-center gap-0.5 ${cls}`} aria-label={`${earned} / ${max} 星`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < earned ? 'text-gold-300' : 'text-night-600'}>
          ★
        </span>
      ))}
    </span>
  );
}
