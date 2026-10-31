import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CodeViewerProps {
  code: string;
  title?: string;
  highlightLines?: number[];
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ code, title, highlightLines = [] }) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const labels = {
    es: { copy: 'Copiar', copied: '¡Copiado!', aria: 'Copiar código' },
    pt: { copy: 'Copiar', copied: 'Copiado!', aria: 'Copiar código' },
    en: { copy: 'Copy', copied: 'Copied!', aria: 'Copy code' },
  }[language];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Simple, elegant syntax tokenization for Kotlin & Jetpack Compose
  const renderHighlightedLine = (line: string) => {
    // Comments
    if (line.trim().startsWith('//')) {
      return <span className="text-slate-500 italic">{line}</span>;
    }

    // Tokenize strings, annotations, keywords, types
    const tokens = line.split(/(".*?"|@\w+|[a-zA-Z_]\w*|[^\w\s"']+|\s+)/g).filter(Boolean);

    return tokens.map((token, index) => {
      // Strings
      if (token.startsWith('"') && token.endsWith('"')) {
        return <span key={index} className="text-brand">{token}</span>;
      }
      // Annotations (@Composable, @OptIn, etc.)
      if (token.startsWith('@')) {
        return <span key={index} className="text-amber-400 font-medium">{token}</span>;
      }
      // Keywords
      const keywords = [
        'fun', 'val', 'var', 'suspend', 'if', 'else', 'when', 'return', 'is', 'in',
        'by', 'remember', 'rememberCoroutineScope', 'LaunchedEffect', 'DisposableEffect',
        'SideEffect', 'produceState', 'derivedStateOf', 'snapshotFlow', 'rememberUpdatedState',
        'true', 'false', 'null', 'Unit', 'import', 'package', 'class', 'interface', 'object'
      ];
      if (keywords.includes(token)) {
        return <span key={index} className="text-sky-400 font-medium">{token}</span>;
      }
      // Types & Coroutine functions
      const types = [
        'String', 'Int', 'Boolean', 'List', 'State', 'CoroutineScope', 'Modifier',
        'SnackbarHostState', 'SnackbarDuration', 'LifecycleOwner', 'Lifecycle',
        'LifecycleEventObserver', 'ProduceStateScope', 'UiState', 'Flow', 'PagerState',
        'delay', 'launch', 'animateScrollToItem', 'showSnackbar', 'collect', 'collectLatest',
        'debounce', 'distinctUntilChanged', 'filter', 'onDispose'
      ];
      if (types.includes(token)) {
        return <span key={index} className="text-indigo-300 font-semibold">{token}</span>;
      }
      // Punctuation and brackets
      if (['(', ')', '{', '}', '[', ']', '->', '=', ':', '.', ',', ';'].includes(token)) {
        return <span key={index} className="text-slate-400">{token}</span>;
      }
      // Standard identifier or whitespace
      return <span key={index} className="text-slate-200">{token}</span>;
    });
  };

  const lines = code.trim().split('\n');

  return (
    <div className="rounded-2xl bg-surface-lowest border-l-4 border-l-brand overflow-hidden text-sm ds-ambient">
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-container">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400/70 inline-block"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-300/70 inline-block"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-brand/80 inline-block"></div>
          <span className="ml-2 text-xs font-mono text-on-surface-variant font-medium">{title || 'Kotlin / Compose'}</span>
        </div>
        <button
          onClick={handleCopy}
          aria-label={labels.aria}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-on-surface hover:text-brand bg-surface-highest hover:bg-surface-high rounded-full transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-brand" />
              <span className="text-brand">{labels.copied}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{labels.copy}</span>
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        <pre className="table w-full">
          <tbody>
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = highlightLines.includes(lineNum);
              return (
                <tr
                  key={idx}
                  className={`${isHighlighted ? 'bg-brand/10 -mx-4 px-4 border-l-2 border-brand' : ''} hover:bg-surface-container/60 transition-colors`}
                >
                  <td className="w-8 select-none pr-4 text-right text-on-surface-variant/40 text-xs tabular-nums font-mono">
                    {lineNum}
                  </td>
                  <td className="whitespace-pre">
                    {renderHighlightedLine(line)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </pre>
      </div>
    </div>
  );
};
