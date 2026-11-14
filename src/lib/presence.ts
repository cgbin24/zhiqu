import { useEffect, useState } from 'react';

/**
 * 真实在线人数 —— 基于心跳的会话在线统计客户端。
 *
 * 服务端：Cloudflare Worker + Durable Object（cloudflare/presence-worker），
 * 路由挂载在 zhiqu.cgbin.xyz/api/*。客户端每 30s POST 一次心跳（带
 * sessionStorage 会话 id），响应直接携带当前在线数，零额外请求。
 * 90s 无心跳的会话由服务端视为离线。
 *
 * 兼容策略：优先同源 /api（自定义域名主站），失败自动回退生产域名；
 * 连续失败后返回 null，界面优雅隐藏计数器（不影响任何功能）。
 */

const FALLBACK_BASE = 'https://zhiqu.cgbin.xyz/api';

function sessionId(): string {
  let sid = sessionStorage.getItem('zhiqu-sid');
  if (!sid) {
    sid = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`).slice(0, 64);
    sessionStorage.setItem('zhiqu-sid', sid);
  }
  return sid;
}

/** 在线人数订阅：返回 null 表示服务不可达（界面隐藏计数） */
export function useOnlineCount(intervalMs = 30_000): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    let base: string | null = null; // 探测成功后锁定
    let fails = 0;

    const beat = async () => {
      const bases = base ? [base] : ['/api', FALLBACK_BASE];
      for (const b of bases) {
        try {
          const res = await fetch(`${b}/heartbeat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sid: sessionId() }),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = (await res.json()) as { count?: number };
          if (!alive) return;
          base = b;
          fails = 0;
          setCount(typeof data.count === 'number' ? data.count : null);
          return;
        } catch { /* 换下一个 base 重试 */ }
      }
      if (alive) {
        fails++;
        if (fails >= 2) setCount(null);
      }
    };

    void beat();
    const timer = setInterval(beat, intervalMs);
    const onVisible = () => { if (document.visibilityState === 'visible') void beat(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      alive = false;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [intervalMs]);

  return count;
}
