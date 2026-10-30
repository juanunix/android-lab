import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Trash2, Filter } from 'lucide-react';
import { LogItem } from '../types/sideEffects';
import { useLanguage } from '../context/LanguageContext';

interface LogcatTerminalProps {
  logs: LogItem[];
  onClear: () => void;
}

export const LogcatTerminal: React.FC<LogcatTerminalProps> = ({ logs, onClear }) => {
  const { t } = useLanguage();
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'>('ALL');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = logs.filter((log) => {
    if (filterLevel === 'ALL') return true;
    return log.level === filterLevel;
  });

  const getLevelStyle = (level: LogItem['level']) => {
    switch (level) {
      case 'DEBUG':
        return 'text-sky-400 bg-sky-950/40 border-sky-800/50';
      case 'INFO':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50';
      case 'WARN':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/50';
      case 'ERROR':
        return 'text-rose-400 bg-rose-950/40 border-rose-800/50';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0a0f1d] overflow-hidden flex flex-col h-72 shadow-lg">
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#0d1424] border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-semibold text-slate-300">{t.logcat.title}</span>
          <span className="text-xs text-slate-500 font-mono tabular-nums">({filteredLogs.length} {t.logcat.eventsCount})</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Level Filter */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 text-xs">
            <Filter className="w-3 h-3 text-slate-400 ml-1.5" />
            {(['ALL', 'DEBUG', 'INFO', 'WARN'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  filterLevel === level
                    ? 'bg-slate-700 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <button
            onClick={onClear}
            title={t.logcat.clearTooltip}
            className="p-1 text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1.5">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-8 text-center px-4">
            <p>{t.logcat.emptyWaiting}</p>
            <p className="text-[11px] text-slate-600 mt-1">{t.logcat.emptyHint}</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2.5 leading-relaxed group">
              <span className="text-slate-600 tabular-nums shrink-0 select-none text-[11px] font-mono">
                {log.timestamp}
              </span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold border shrink-0 ${getLevelStyle(
                  log.level
                )}`}
              >
                {log.level[0]}
              </span>
              <span className="text-indigo-400 font-semibold shrink-0">
                {log.tag}:
              </span>
              <span className="text-slate-200 break-words flex-1">
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

