import { lazy, Suspense, useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { LearnPath } from '@/pages/LearnPath';

/**
 * 路由级代码分割：
 * - 仪表盘 / 关卡地图保持 eager（落地页）
 * - 关卡页 / 练习场拉走 Monaco（3.3MB）、术语页拉走术语库与效果演示 —— 冷启动体积减半以上
 * - 首屏渲染完成后空闲预取全部路由 chunk，后续导航零等待
 */
const LevelPlay = lazy(() => import('@/pages/LevelPlay').then((m) => ({ default: m.LevelPlay })));
const Playground = lazy(() => import('@/pages/Playground').then((m) => ({ default: m.Playground })));
const TeamDashboard = lazy(() => import('@/pages/TeamDashboard').then((m) => ({ default: m.TeamDashboard })));
const TermsHome = lazy(() => import('@/pages/TermsHome').then((m) => ({ default: m.TermsHome })));
const TermsGraph = lazy(() => import('@/pages/TermsGraph').then((m) => ({ default: m.TermsGraph })));
const TermQuiz = lazy(() => import('@/pages/TermQuiz').then((m) => ({ default: m.TermQuiz })));
const TermCategoryPage = lazy(() => import('@/pages/TermCategoryPage').then((m) => ({ default: m.TermCategoryPage })));
const TermDetailPage = lazy(() => import('@/pages/TermCategoryPage').then((m) => ({ default: m.TermDetailPage })));
const Achievements = lazy(() => import('@/pages/Achievements').then((m) => ({ default: m.Achievements })));
const Profile = lazy(() => import('@/pages/Profile').then((m) => ({ default: m.Profile })));

/** 路由懒加载期间的占位（与 index.html 启动加载器同款视觉） */
function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-quest-500/25 border-t-quest-500" />
      <p className="text-xs text-slate-500">加载中…</p>
    </div>
  );
}

/** 空闲时预取全部懒路由 chunk：首次冷启动后，后续导航即时切换 */
function usePrefetchRoutes() {
  useEffect(() => {
    const kick = () => {
      void import('@/pages/LevelPlay');
      void import('@/pages/Playground');
      void import('@/pages/TeamDashboard');
      void import('@/pages/TermsHome');
      void import('@/pages/TermsGraph');
      void import('@/pages/TermQuiz');
      void import('@/pages/TermCategoryPage');
      void import('@/pages/Achievements');
      void import('@/pages/Profile');
    };
    const w = window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void };
    if (w.requestIdleCallback) w.requestIdleCallback(kick, { timeout: 3000 });
    else setTimeout(kick, 1500);
  }, []);
}

export default function App() {
  usePrefetchRoutes();
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/learn" element={<Navigate to="/learn/go" replace />} />
          <Route path="/learn/:lang" element={<LearnPath />} />
          <Route
            path="/team"
            element={
              <Suspense fallback={<RouteFallback />}>
                <TeamDashboard />
              </Suspense>
            }
          />
          <Route
            path="/level/:id"
            element={
              <Suspense fallback={<RouteFallback />}>
                <LevelPlay />
              </Suspense>
            }
          />
          <Route
            path="/playground"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Playground />
              </Suspense>
            }
          />
          <Route
            path="/terms"
            element={
              <Suspense fallback={<RouteFallback />}>
                <TermsHome />
              </Suspense>
            }
          />
          <Route
            path="/terms/graph"
            element={
              <Suspense fallback={<RouteFallback />}>
                <TermsGraph />
              </Suspense>
            }
          />
          <Route
            path="/terms/quiz"
            element={
              <Suspense fallback={<RouteFallback />}>
                <TermQuiz />
              </Suspense>
            }
          />
          <Route
            path="/terms/:cat"
            element={
              <Suspense fallback={<RouteFallback />}>
                <TermCategoryPage />
              </Suspense>
            }
          />
          <Route
            path="/terms/:cat/:tid"
            element={
              <Suspense fallback={<RouteFallback />}>
                <TermDetailPage />
              </Suspense>
            }
          />
          <Route
            path="/achievements"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Achievements />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense fallback={<RouteFallback />}>
                <Profile />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
