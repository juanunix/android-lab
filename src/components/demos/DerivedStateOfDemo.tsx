import React, { useState } from 'react';
import { ArrowUp, Zap, Sparkles, AlertCircle } from 'lucide-react';
import { LogItem } from '../../types/sideEffects';
import { useLanguage } from '../../context/LanguageContext';

interface DerivedStateOfDemoProps {
  onLog: (tag: string, level: LogItem['level'], message: string) => void;
}

export const DerivedStateOfDemo: React.FC<DerivedStateOfDemoProps> = ({ onLog }) => {
  const { language } = useLanguage();
  const t = {
    es: {
      withoutDerived: 'Sin derivedStateOf',
      withDerived: 'Con derivedStateOf',
      recomposeEveryPixel: 'Recompone cada pixel',
      onlyValueChanges: 'Solo cambios de valor',
      scrollOffset: 'Scroll Offset:',
      start: '0px (Inicio)',
      threshold: 'Umbral:',
      end: '300px (Fondo)',
      uiState: 'Estado de la UI:',
      showFab: 'Mostrar Botón FAB:',
      visible: 'VISIBLE (> 120px)',
      hidden: 'OCULTO (<= 120px)',
      savings: (n: number) => `Ahorro: ${n} recomposiciones evitadas.`,
      reset: 'Reiniciar prueba',
      logDerived: (value: boolean) =>
        `Recomposición optimizada: el valor derivado cambió a ${value ? 'TRUE' : 'FALSE'}`,
      logReset: 'Contadores de recomposición reiniciados',
    },
    pt: {
      withoutDerived: 'Sem derivedStateOf',
      withDerived: 'Com derivedStateOf',
      recomposeEveryPixel: 'Recompõe a cada pixel',
      onlyValueChanges: 'Somente mudanças de valor',
      scrollOffset: 'Scroll Offset:',
      start: '0px (Início)',
      threshold: 'Limite:',
      end: '300px (Fim)',
      uiState: 'Estado da UI:',
      showFab: 'Mostrar Botão FAB:',
      visible: 'VISÍVEL (> 120px)',
      hidden: 'OCULTO (<= 120px)',
      savings: (n: number) => `Economia: ${n} recomposições evitadas.`,
      reset: 'Reiniciar teste',
      logDerived: (value: boolean) =>
        `Recomposição otimizada: o valor derivado mudou para ${value ? 'TRUE' : 'FALSE'}`,
      logReset: 'Contadores de recomposição reiniciados',
    },
    en: {
      withoutDerived: 'Without derivedStateOf',
      withDerived: 'With derivedStateOf',
      recomposeEveryPixel: 'Recomposes every pixel',
      onlyValueChanges: 'Only value changes',
      scrollOffset: 'Scroll Offset:',
      start: '0px (Top)',
      threshold: 'Threshold:',
      end: '300px (Bottom)',
      uiState: 'UI State:',
      showFab: 'Show FAB Button:',
      visible: 'VISIBLE (> 120px)',
      hidden: 'HIDDEN (<= 120px)',
      savings: (n: number) => `Savings: ${n} recompositions avoided.`,
      reset: 'Reset test',
      logDerived: (value: boolean) =>
        `Optimized recomposition: derived value changed to ${value ? 'TRUE' : 'FALSE'}`,
      logReset: 'Recomposition counters reset',
    },
  }[language];

  const [scrollOffset, setScrollOffset] = useState(0);
  const [recompsWithoutDerived, setRecompsWithoutDerived] = useState(0);
  const [recompsWithDerived, setRecompsWithDerived] = useState(0);
  const [prevDerivedBoolean, setPrevDerivedBoolean] = useState(false);

  const threshold = 120;
  const showFab = scrollOffset > threshold;

  const handleScrollChange = (newOffset: number) => {
    setScrollOffset(newOffset);

    // 1. Without derivedStateOf: recomposes every single pixel/step change
    setRecompsWithoutDerived((prev) => prev + 1);

    // 2. With derivedStateOf: only notifies when calculation boolean changes
    const currentDerived = newOffset > threshold;
    if (currentDerived !== prevDerivedBoolean) {
      setPrevDerivedBoolean(currentDerived);
      setRecompsWithDerived((prev) => prev + 1);
      onLog('derivedStateOf', 'INFO', t.logDerived(currentDerived));
    } else {
      // Recomposition was skipped by Compose!
    }
  };

  const handleReset = () => {
    setScrollOffset(0);
    setRecompsWithoutDerived(0);
    setRecompsWithDerived(0);
    setPrevDerivedBoolean(false);
    onLog('derivedStateOf', 'DEBUG', t.logReset);
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Live Recomposition Comparison Counters */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/60 text-center">
          <span className="text-[10px] uppercase font-mono text-rose-400 block font-semibold">
            {t.withoutDerived}
          </span>
          <span className="text-2xl font-bold font-mono text-rose-300 tabular-nums my-0.5 block">
            {recompsWithoutDerived}
          </span>
          <span className="text-[10px] text-rose-400/80">{t.recomposeEveryPixel}</span>
        </div>

        <div className="bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/60 text-center">
          <span className="text-[10px] uppercase font-mono text-emerald-400 block font-semibold">
            {t.withDerived}
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-300 tabular-nums my-0.5 block">
            {recompsWithDerived}
          </span>
          <span className="text-[10px] text-emerald-400/80">{t.onlyValueChanges}</span>
        </div>
      </div>

      {/* Simulated Scroll Slider */}
      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center justify-between font-mono">
          <span className="text-slate-400">{t.scrollOffset}</span>
          <span className="text-sky-400 font-bold tabular-nums">
            {scrollOffset}px / 300px
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="300"
          value={scrollOffset}
          onChange={(e) => handleScrollChange(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>{t.start}</span>
          <span className="text-amber-400 font-mono font-medium">{t.threshold} {threshold}px</span>
          <span>{t.end}</span>
        </div>
      </div>

      {/* Simulated Screen with Floating Button */}
      <div className="flex-1 bg-slate-950/80 rounded-xl p-3 border border-slate-800 relative overflow-hidden flex flex-col justify-between">
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-slate-500 uppercase">
            {t.uiState}
          </span>
          <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
            <span className="text-slate-300">{t.showFab}</span>
            <span
              className={`font-mono text-[11px] px-2 py-0.5 rounded font-bold ${
                showFab
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {showFab ? t.visible : t.hidden}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 pt-1">
            {recompsWithoutDerived > 0 && (
              <p className="text-emerald-400 flex items-center gap-1 font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {t.savings(Math.max(0, recompsWithoutDerived - recompsWithDerived))}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Animated FAB button at bottom-right */}
        <div className="flex justify-end p-1">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
              showFab
                ? 'opacity-100 scale-100 bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                : 'opacity-0 scale-75 pointer-events-none'
            }`}
          >
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleReset}
          className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
        >
          {t.reset}
        </button>
      </div>
    </div>
  );
};
