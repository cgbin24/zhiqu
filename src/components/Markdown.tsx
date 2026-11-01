import { useMemo } from 'react';
import { renderMarkdown } from '@/lib/markdown';

export function Markdown({ text, className = '' }: { text: string; className?: string }) {
  const html = useMemo(() => renderMarkdown(text), [text]);
  return (
    <div className={`md-body ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
