import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initTheme } from './store/theme';
import { OverlayScrollbars } from 'overlayscrollbars';
import 'overlayscrollbars/overlayscrollbars.css';
import './index.css';

initTheme();

/* 页面级悬浮滚动条：不占布局空间，滚动时自动显现 */
OverlayScrollbars(document.body, {
  scrollbars: {
    theme: 'os-theme',
    visibility: 'auto',
    autoHide: 'move',
    autoHideDelay: 500,
    autoHideSuspend: true,
  },
  overflow: { x: 'hidden' },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
