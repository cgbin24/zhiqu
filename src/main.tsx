import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initTheme } from './store/theme';
import './index.css';

initTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// 应用完成首次绘制后再移除启动加载器（双 rAF 确保真实内容已上屏）
requestAnimationFrame(() =>
  requestAnimationFrame(() => document.getElementById('boot-loader')?.remove()),
);
