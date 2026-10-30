import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  title?: string;
  highlightLines?: number[];
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ code, title, highlightLines = [] }) => {
  const [copied, setCopied] = useState(false);

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
        return <span key={index} className="text-emerald-400">{token}</span>;
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
    <div className="rounded-xl border border-slate-800 bg-[#0d1322] overflow-hidden text-sm shadow-xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a0e19] border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></div>
          <span className="ml-2 text-xs font-mono text-slate-400 font-medium">{title || 'Kotlin / Compose'}</span>
        </div>
        <button
          onClick={handleCopy}
          aria-label="Copiar código"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-md transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">¡Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar</span>
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
                  className={`${isHighlighted ? 'bg-sky-500/10 -mx-4 px-4 border-l-2 border-sky-400' : ''} hover:bg-slate-800/30 transition-colors`}
                >
                  <td className="w-8 select-none pr-4 text-right text-slate-600 text-xs tabular-nums font-mono">
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
