import React, { useState, useEffect, useRef } from 'react';
import { Search, RotateCcw, Play, Pause, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { LogItem } from '../../types/sideEffects';
import { useLanguage } from '../../context/LanguageContext';

interface LaunchedEffectDemoProps {
  onLog: (tag: string, level: LogItem['level'], message: string) => void;
}

export const LaunchedEffectDemo: React.FC<LaunchedEffectDemoProps> = ({ onLog }) => {
  const { language } = useLanguage();
  // Demo Mode: 'search' | 'timer'
  const [mode, setMode] = useState<'search' | 'timer'>('search');

  // Search state (LaunchedEffect with key: query)
  const [query, setQuery] = useState('Compose');
  const [searchResults, setSearchResults] = useState<string[]>([
    'Jetpack Compose 1.7',
    'Compose Multiplatform',
    'Compose Compiler',
  ]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchJobStatus, setSearchJobStatus] = useState<
    'IDLE' | 'ACTIVE' | 'CANCELLED' | 'COMPLETED'
  >('IDLE');
  const activeJobIdRef = useRef(0);

  // Timer state
  const [timerDuration, setTimerDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const tSearch = {
    es: {
      modeSearch: 'Búsqueda Reactiva',
      modeTimer: 'Temporizador Cancelable',
      statusLabel: 'Estado Coroutine:',
      placeholder: 'Escribe rápido para cancelar...',
      tryPreset: 'Prueba:',
      resultsTitle: 'Resultados en UI:',
      loading: 'Consultando API suspendida...',
      timeLeft: 'Tiempo restante en LaunchedEffect:',
      sliderLabel: 'Cambiar Clave (timerDuration):',
      sliderHint: 'Al mover el slider, la clave cambia y el temporizador se reinicia.',
      pause: 'Pausar Efecto',
      resume: 'Reanudar Efecto',
      activeStatus: 'En ejecución (debounce 600ms)...',
      cancelledStatus: 'Cancelada (Job descartado)',
      completedStatus: 'Completada con éxito',
      idleStatus: 'Inactiva',
    },
    pt: {
      modeSearch: 'Busca Reativa',
      modeTimer: 'Temporizador Cancelável',
      statusLabel: 'Status da Corrotina:',
      placeholder: 'Digite rápido para cancelar...',
      tryPreset: 'Teste:',
      resultsTitle: 'Resultados na UI:',
      loading: 'Consultando API suspensa...',
      timeLeft: 'Tempo restante no LaunchedEffect:',
      sliderLabel: 'Alterar Chave (timerDuration):',
      sliderHint: 'Ao mover o slider, a chave muda e o temporizador reinicia.',
      pause: 'Pausar Efeito',
      resume: 'Retomar Efeito',
      activeStatus: 'Em execução (debounce 600ms)...',
      cancelledStatus: 'Cancelada (Job descartado)',
      completedStatus: 'Concluída com sucesso',
      idleStatus: 'Inativa',
    },
    en: {
      modeSearch: 'Reactive Search',
      modeTimer: 'Cancellable Timer',
      statusLabel: 'Coroutine Status:',
      placeholder: 'Type rapidly to cancel job...',
      tryPreset: 'Try:',
      resultsTitle: 'UI Results:',
      loading: 'Calling suspend API...',
      timeLeft: 'Time remaining in LaunchedEffect:',
      sliderLabel: 'Change Key (timerDuration):',
      sliderHint: 'Adjusting slider changes the key and restarts timer.',
      pause: 'Pause Effect',
      resume: 'Resume Effect',
      activeStatus: 'Running (600ms debounce)...',
      cancelledStatus: 'Cancelled (Job aborted)',
      completedStatus: 'Completed successfully',
      idleStatus: 'Idle',
    },
  }[language];

  // Simulation of LaunchedEffect(query)
  useEffect(() => {
    if (mode !== 'search') return;
    const currentJobId = ++activeJobIdRef.current;

    const startMsg =
      language === 'en'
        ? `LaunchedEffect(key = "${query}") launched. Active scope (Job #${currentJobId})`
        : language === 'pt'
        ? `LaunchedEffect(key = "${query}") disparado. Escopo ativo (Job #${currentJobId})`
        : `LaunchedEffect(key = "${query}") lanzado. Scope activo (Job #${currentJobId})`;

    onLog('LaunchedEffect', 'DEBUG', startMsg);
    setSearchJobStatus('ACTIVE');
    setIsSearching(true);

    const timer = setTimeout(() => {
      const mockDatabase: Record<string, string[]> = {
        compose: ['Jetpack Compose 1.7', 'Compose Multiplatform', 'Compose Compiler'],
        side: ['SideEffect Composable', 'Side-effects vs Pure Functions', 'DisposableEffect Cleanup'],
        effect: ['LaunchedEffect', 'DisposableEffect', 'SideEffect'],
        state: ['rememberUpdatedState', 'produceState', 'derivedStateOf', 'MutableState'],
      };

      const matchedKey = Object.keys(mockDatabase).find((k) =>
        query.toLowerCase().includes(k)
      );
      const results = matchedKey
        ? mockDatabase[matchedKey]
        : [`Result for "${query}" #1`, `Result for "${query}" #2`];

      setSearchResults(results);
      setIsSearching(false);
      setSearchJobStatus('COMPLETED');

      const okMsg =
        language === 'en'
          ? `Job #${currentJobId} completed. Results loaded for "${query}"`
          : language === 'pt'
          ? `Job #${currentJobId} concluído. Resultados carregados para "${query}"`
          : `Job #${currentJobId} completado con éxito. Resultados para "${query}"`;
      onLog('LaunchedEffect', 'INFO', okMsg);
    }, 600);

    return () => {
      clearTimeout(timer);
      if (currentJobId === activeJobIdRef.current && isSearching) {
        const cancelMsg =
          language === 'en'
            ? `LaunchedEffect(key = "${query}") CANCELLED because key changed before completion (Job #${currentJobId})`
            : language === 'pt'
            ? `LaunchedEffect(key = "${query}") CANCELADO porque a chave mudou antes da conclusão (Job #${currentJobId})`
            : `LaunchedEffect(key = "${query}") CANCELADO porque la clave cambió antes de terminar (Job #${currentJobId})`;
        onLog('LaunchedEffect', 'WARN', cancelMsg);
        setSearchJobStatus('CANCELLED');
      }
    };
  }, [query, mode, language]);

  // Simulation of LaunchedEffect(isTimerRunning, timerDuration)
  useEffect(() => {
    if (mode !== 'timer' || !isTimerRunning) return;

    onLog(
      'LaunchedEffect',
      'DEBUG',
      `LaunchedEffect(key1 = ${isTimerRunning}, key2 = ${timerDuration})`
    );
    setTimeLeft(timerDuration);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          const doneMsg =
            language === 'en'
              ? 'Timer finished (0s). Action triggered.'
              : language === 'pt'
              ? 'Temporizador finalizado (0s). Ação executada.'
              : 'Temporizador finalizado (0s). Acción ejecutada.';
          onLog('LaunchedEffect', 'INFO', doneMsg);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isTimerRunning, timerDuration, mode, language]);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Mode Switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 shrink-0">
        <button
          onClick={() => setMode('search')}
          className={`flex-1 py-1 px-2 text-xs font-medium rounded-md transition-all ${
            mode === 'search'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {tSearch.modeSearch}
        </button>
        <button
          onClick={() => setMode('timer')}
          className={`flex-1 py-1 px-2 text-xs font-medium rounded-md transition-all ${
            mode === 'timer'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {tSearch.modeTimer}
        </button>
      </div>

      {mode === 'search' ? (
        <div className="flex-1 flex flex-col space-y-3">
          {/* Status Indicator */}
          <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span>{tSearch.statusLabel}</span>
              <span className="font-mono text-[11px] text-slate-300">key = "{query}"</span>
            </div>
            <div className="flex items-center gap-2">
              {searchJobStatus === 'ACTIVE' && (
                <div className="flex items-center gap-1.5 text-sky-400 font-medium">
                  <Zap className="w-3.5 h-3.5 animate-pulse" />
                  <span>{tSearch.activeStatus}</span>
                </div>
              )}
              {searchJobStatus === 'CANCELLED' && (
                <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{tSearch.cancelledStatus}</span>
                </div>
              )}
              {searchJobStatus === 'COMPLETED' && (
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{tSearch.completedStatus}</span>
                </div>
              )}
              {searchJobStatus === 'IDLE' && (
                <span className="text-slate-500">{tSearch.idleStatus}</span>
              )}
            </div>
          </div>

          {/* Search Input in Android UI */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tSearch.placeholder}
              className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="text-slate-500 self-center">{tSearch.tryPreset}</span>
            {['Compose', 'SideEffect', 'State', 'Android'].map((kw) => (
              <button
                key={kw}
                onClick={() => setQuery(kw)}
                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700/50"
              >
                {kw}
              </button>
            ))}
          </div>

          {/* Simulated Results */}
          <div className="flex-1 overflow-y-auto space-y-1.5 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wide">
              {tSearch.resultsTitle}
            </span>
            {isSearching ? (
              <div className="py-6 flex flex-col items-center justify-center text-slate-400 gap-2">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">{tSearch.loading}</span>
              </div>
            ) : (
              searchResults.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-slate-900/60 border border-slate-800 text-xs text-slate-200 flex items-center justify-between"
                >
                  <span>{item}</span>
                  <span className="text-[10px] text-emerald-400 font-mono">OK</span>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 text-center">
            <span className="text-xs text-slate-400">{tSearch.timeLeft}</span>
            <div className="text-4xl font-bold font-mono text-emerald-400 my-2">
              {timeLeft}s
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${(timeLeft / timerDuration) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 flex justify-between mb-1">
                <span>{tSearch.sliderLabel}</span>
                <span className="font-mono text-white font-bold">{timerDuration} s</span>
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={timerDuration}
                onChange={(e) => setTimerDuration(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-0.5">
                {tSearch.sliderHint}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 text-xs font-medium"
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" /> {tSearch.pause}
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400" /> {tSearch.resume}
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setTimeLeft(timerDuration);
                  onLog('LaunchedEffect', 'DEBUG', 'Timer reset');
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
