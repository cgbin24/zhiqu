/**
 * 智码 CodeQuest Service Worker —— 离线可刷
 * 策略：
 *  - 导航请求（HTML）：network-first，离线回退缓存的 index.html
 *  - /assets/（带内容哈希，永久不变）：cache-first
 *  - logo / 图标 / manifest：cache-first
 *  - 其余同源 GET：stale-while-revalidate
 */
const CACHE = 'zhiqu-cache-v1';
const PRECACHE = ['./', './index.html', './logo.svg', './manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // 导航：network-first（拿最新 index.html），失败回退缓存
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html')),
    );
    return;
  }

  // 内容哈希资源与静态图标：cache-first
  const cacheFirst = url.pathname.startsWith('/assets/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname === '/logo.svg' || url.pathname === '/manifest.webmanifest';
  if (cacheFirst) {
    event.respondWith(
      caches.match(req).then((hit) =>
        hit ??
        fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        }),
      ),
    );
    return;
  }

  // 其余同源 GET：stale-while-revalidate
  event.respondWith(
    caches.match(req).then((hit) => {
      const fetching = fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit ?? fetching;
    }),
  );
});
