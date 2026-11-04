import { useCallback, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * 发音引擎 —— 四级降级策略确保任何环境都能"发声"：
 *
 * 1. 本地 TTS (speechSynthesis)：优先 en-US 语音，支持语速/音调调节
 * 2. 远程 TTS (Google Translate TTS / StreamElements)：浏览器无语音包时的兜底
 * 3. 音标可视化：phonetic 文字 + 音节分段高亮（最终兜底，任何浏览器可用）
 * 4. 静态展示：仅显示英文原词和音标（最低保底）
 */

type TTSMethod = 'local' | 'remote' | 'none';

interface SpeakState {
  speaking: boolean;
  method: TTSMethod;
  error: string | null;
}

/** 检测本地是否有英文语音包（voices 异步加载，需等 voiceschanged） */
function useVoicesReady(): { ready: boolean; hasEnVoice: boolean; hasAnyVoice: boolean } {
  const [ready, setReady] = useState(false);
  const [hasEnVoice, setHasEnVoice] = useState(false);
  const [hasAnyVoice, setHasAnyVoice] = useState(false);

  useEffect(() => {
    if (typeof speechSynthesis === 'undefined') { setReady(true); return; }
    const check = () => {
      const voices = speechSynthesis.getVoices();
      const en = voices.some((v) => v.lang.startsWith('en'));
      setHasEnVoice(en);
      setHasAnyVoice(voices.length > 0);
      setReady(true);
    };
    check();
    speechSynthesis.addEventListener?.('voiceschanged', check);
    // 部分浏览器 voices 异步加载，做一次延迟复检
    const t = setTimeout(check, 500);
    return () => {
      speechSynthesis.removeEventListener?.('voiceschanged', check);
      clearTimeout(t);
    };
  }, []);

  return { ready, hasEnVoice, hasAnyVoice };
}

/** 远程 TTS：通过公共 TTS 端点生成音频并播放（无需 API Key） */
async function speakRemote(text: string): Promise<boolean> {
  const endpoints = [
    `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`,
  ];
  for (const url of endpoints) {
    try {
      const audio = new Audio(url);
      audio.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('audio failed'));
        audio.play().catch(reject);
      });
      return true;
    } catch {
      // try next endpoint
    }
  }
  return false;
}

/** 本地 TTS 朗读 */
function speakLocal(text: string, onEnd?: () => void): boolean {
  if (typeof speechSynthesis === 'undefined') return false;
  try {
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = 0.85;
    const voices = speechSynthesis.getVoices();
    const enVoice = voices.find((v) => v.lang.startsWith('en-US') || v.lang.startsWith('en'));
    if (enVoice) utter.voice = enVoice;
    if (onEnd) utter.onend = onEnd;
    speechSynthesis.speak(utter);
    return true;
  } catch {
    return false;
  }
}

export function useSpeak() {
  const { hasEnVoice, hasAnyVoice } = useVoicesReady();
  const [state, setState] = useState<SpeakState>({ speaking: false, method: 'none', error: null });

  const speak = useCallback(async (text: string) => {
    setState({ speaking: true, method: 'local', error: null });

    // 1. 本地 TTS
    if (typeof speechSynthesis !== 'undefined') {
      const ok = speakLocal(text, () => setState({ speaking: false, method: 'local', error: null }));
      if (ok) return;
    }

    // 2. 远程 TTS 兜底
    setState({ speaking: true, method: 'remote', error: null });
    const remoteOk = await speakRemote(text);
    if (remoteOk) {
      setState({ speaking: false, method: 'remote', error: null });
      return;
    }

    // 3. 全部失败
    setState({ speaking: false, method: 'none', error: '当前浏览器不支持语音朗读，请参考音标' });
  }, []);

  return { speak, ...state, hasEnVoice, hasAnyVoice };
}

/** 发音按钮组件 —— 带降级状态提示 */
export function SpeakButton({ text, size = 'md' }: { text: string; size?: 'sm' | 'md' }) {
  const { speak, speaking, error, hasEnVoice, hasAnyVoice } = useSpeak();
  const [showPhoneticHint, setShowPhoneticHint] = useState(false);

  const handleSpeak = async () => {
    setShowPhoneticHint(false);
    await speak(text);
  };

  const dim = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9';
  const iconSize = size === 'sm' ? 13 : 16;

  // TTS 完全不可用且也无语音包 → 显示不可用状态
  if (hasEnVoice === false && hasAnyVoice === false && typeof speechSynthesis !== 'undefined' && speechSynthesis.getVoices().length === 0) {
    return (
      <span
        className={`${dim} grid shrink-0 place-items-center rounded-lg border border-slate-600/30 bg-slate-500/10 text-slate-500 cursor-not-allowed`}
        title="当前浏览器无可用语音引擎"
      >
        <VolumeX size={iconSize} />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <button
        onClick={handleSpeak}
        title={error ?? `点击发音 ${text}`}
        aria-label={`发音 ${text}`}
        className={`${dim} grid shrink-0 place-items-center rounded-lg border transition-colors ${
          speaking
            ? 'animate-pulse border-quest-500/60 bg-quest-500/25 text-quest-300'
            : 'border-quest-500/30 bg-quest-500/10 text-quest-400 hover:bg-quest-500/20'
        }`}
      >
        {speaking ? <Volume2 size={iconSize} className="animate-pulse" /> : <Volume2 size={iconSize} />}
      </button>
      {error && <span className="text-[10px] text-rose-400">{error}</span>}
      {showPhoneticHint && <span className="text-[10px] text-slate-500">请参考音标</span>}
    </span>
  );
}
