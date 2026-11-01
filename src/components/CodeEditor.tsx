import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { Editor, loader, type OnMount } from '@monaco-editor/react';
import { useTheme } from '@/store/theme';

/* Monaco 本地打包：worker 走 vite ?worker，不依赖任何 CDN */
self.MonacoEnvironment = {
  getWorker: () => new editorWorker(),
};

loader.config({ monaco });

function defineThemes() {
  monaco.editor.defineTheme('codequest', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'c4b5fd' },
      { token: 'string', foreground: '86efac' },
      { token: 'number', foreground: 'fdba74' },
      { token: 'type', foreground: '7dd3fc' },
      { token: 'function', foreground: '93c5fd' },
    ],
    colors: {
      'editor.background': '#0d1322',
      'editor.lineHighlightBackground': '#131c33',
      'editorLineNumber.foreground': '#3b4d78',
      'editorLineNumber.activeForeground': '#8b7cf6',
      'editorCursor.foreground': '#8b7cf6',
      'editor.selectionBackground': '#2b3a5c',
      'editorIndentGuide.background1': '#1e2942',
    },
  });
  monaco.editor.defineTheme('codequest-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '94a3b8', fontStyle: 'italic' },
      { token: 'keyword', foreground: '7c3aed' },
      { token: 'string', foreground: '15803d' },
      { token: 'number', foreground: 'c2410c' },
      { token: 'type', foreground: '0369a1' },
      { token: 'function', foreground: '1d4ed8' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.lineHighlightBackground': '#f3f5fd',
      'editorLineNumber.foreground': '#b6c0da',
      'editorLineNumber.activeForeground': '#7c3aed',
      'editorCursor.foreground': '#7c5cf0',
      'editor.selectionBackground': '#dbe4ff',
      'editorIndentGuide.background1': '#e5eaf6',
    },
  });
}

interface Props {
  value: string;
  language: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  height?: string;
}

export function CodeEditor({ value, language, onChange, readOnly = false, height = '100%' }: Props) {
  const ref = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const theme = useTheme((s) => s.theme);

  useEffect(() => {
    defineThemes();
  }, []);

  // 主题切换：全局 Monaco 主题联动（顺滑无闪烁）
  useEffect(() => {
    monaco.editor.setTheme(theme === 'light' ? 'codequest-light' : 'codequest');
  }, [theme]);

  const handleMount: OnMount = (editor) => {
    ref.current = editor;
    monaco.editor.setTheme(useTheme.getState().theme === 'light' ? 'codequest-light' : 'codequest');
  };

  return (
    <div className="monaco-wrap h-full w-full overflow-hidden rounded-xl border border-night-700">
      <Editor
        language={language}
        theme={theme === 'light' ? 'codequest-light' : 'codequest'}
        value={value}
        onChange={(v) => onChangeRef.current?.(v ?? '')}
        onMount={handleMount}
        options={{
          readOnly,
          fontSize: 14,
          fontLigatures: true,
          fontFamily: "ui-monospace, 'Cascadia Code', Consolas, monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          padding: { top: 14, bottom: 14 },
          tabSize: 4,
          automaticLayout: true,
          renderLineHighlight: 'line',
          scrollbar: { verticalScrollbarSize: 9, horizontalScrollbarSize: 9 },
        }}
        height={height}
      />
    </div>
  );
}
