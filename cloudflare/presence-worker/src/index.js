/**
 * 智码 CodeQuest —— 在线人数统计 API（真实心跳在线）
 *
 * 架构：单个 Durable Object（global 实例）维护会话表，
 * 客户端每 30s 发一次心跳（带会话 id），90s 无心跳视为离线。
 * 每次心跳/查询都返回当前在线数，前端零额外请求。
 *
 * 路由（wrangler.toml 配置）：zhiqu.cgbin.xyz/api/*
 * CORS 全开：本地预览 / pages.dev 备用入口也能调用。
 */

const TTL = 95_000; // 心跳超时：90s 容差 + 5s 余量

export class Presence {
  constructor(state, env) {
    this.state = state;
    /** @type {Map<string, number>} sid -> lastSeen */
    this.sessions = new Map();
    this.loaded = false;
  }

  /** 冷启动：从持久化存储恢复会话并清理过期项 */
  async load() {
    if (this.loaded) return;
    const now = Date.now();
    for (const [k, v] of await this.state.storage.list()) {
      if (now - v > TTL) await this.state.storage.delete(k);
      else this.sessions.set(k, v);
    }
    this.loaded = true;
  }

  async fetch(request) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    await this.load();
    const now = Date.now();
    const url = new URL(request.url);

    // 心跳：记录会话活跃时间
    if (request.method === 'POST' && url.pathname.endsWith('/heartbeat')) {
      try {
        const body = await request.json();
        if (body && typeof body.sid === 'string' && body.sid.length <= 64) {
          await this.state.storage.put(body.sid, now);
          this.sessions.set(body.sid, now);
        }
      } catch { /* 心跳体异常：仍返回当前计数 */ }
    }

    // 清理过期会话
    for (const [k, v] of this.sessions) {
      if (now - v > TTL) {
        this.sessions.delete(k);
        await this.state.storage.delete(k);
      }
    }

    return new Response(JSON.stringify({ ok: true, count: this.sessions.size, ts: now }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
}

export default {
  async fetch(request, env) {
    const id = env.PRESENCE.idFromName('global');
    return env.PRESENCE.get(id).fetch(request);
  },
};
