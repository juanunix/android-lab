import React, { useState, useEffect, useRef } from 'react';
import { GitBranch, Activity, ArrowRight, Check } from 'lucide-react';
import { LogItem } from '../../types/sideEffects';
import { useLanguage } from '../../context/LanguageContext';

interface SnapshotFlowDemoProps {
  onLog: (tag: string, level: LogItem['level'], message: string) => void;
}

export const SnapshotFlowDemo: React.FC<SnapshotFlowDemoProps> = ({ onLog }) => {
  const { language } = useLanguage();
  const t = {
    es: {
      stateLabel: 'Compose State (TextField value):',
      placeholder: 'Escribe para probar el flujo reactivo...',
      pipelineTitle: 'Pipeline Reactivo de Operadores:',
      stepSnapshot: '1. Snapshot',
      stepEmit: 'Emit',
      stepDebounce: '2. debounce',
      stepCollect: '3. collect',
      stepAction: 'Action',
      pipeState: 'Estado del Pipe:',
      waiting: '⏳ Esperando a que el usuario termine de escribir...',
      emitted: '⚡ Snapshot emitido',
      collected: '✓ Valor recibido en el colector',
      idle: 'En reposo',
      emissionsTitle: 'Emisiones colectadas en el Flow:',
      emittedLabel: 'Emitido',
      snapshotLog: (text: string) => `snapshotFlow { text }: Snapshot detectó cambio -> "${text}"`,
      collectLog: (text: string) => `Flow.collect { "${text}" } disparado tras superar debounce de 500ms`,
    },
    pt: {
      stateLabel: 'Compose State (TextField value):',
      placeholder: 'Digite para testar o fluxo reativo...',
      pipelineTitle: 'Pipeline Reativo de Operadores:',
      stepSnapshot: '1. Snapshot',
      stepEmit: 'Emit',
      stepDebounce: '2. debounce',
      stepCollect: '3. collect',
      stepAction: 'Action',
      pipeState: 'Estado do Pipe:',
      waiting: '⏳ Aguardando o usuário terminar de digitar...',
      emitted: '⚡ Snapshot emitido',
      collected: '✓ Valor recebido no coletor',
      idle: 'Em repouso',
      emissionsTitle: 'Emissões coletadas no Flow:',
      emittedLabel: 'Emitido',
      snapshotLog: (text: string) => `snapshotFlow { text }: Snapshot detectou mudança -> "${text}"`,
      collectLog: (text: string) => `Flow.collect { "${text}" } disparado após superar debounce de 500ms`,
    },
    en: {
      stateLabel: 'Compose State (TextField value):',
      placeholder: 'Type to test the reactive flow...',
      pipelineTitle: 'Reactive Operator Pipeline:',
      stepSnapshot: '1. Snapshot',
      stepEmit: 'Emit',
      stepDebounce: '2. debounce',
      stepCollect: '3. collect',
      stepAction: 'Action',
      pipeState: 'Pipe state:',
      waiting: '⏳ Waiting for the user to stop typing...',
      emitted: '⚡ Snapshot emitted',
      collected: '✓ Value received by the collector',
      idle: 'Idle',
      emissionsTitle: 'Emissions collected in the Flow:',
      emittedLabel: 'Emitted',
      snapshotLog: (text: string) => `snapshotFlow { text }: Snapshot detected change -> "${text}"`,
      collectLog: (text: string) => `Flow.collect { "${text}" } triggered after 500ms debounce`,
    },
  }[language];

  const [inputText, setInputText] = useState('Kotlin Coroutines');
  const [pipelineStep, setPipelineStep] = useState<'IDLE' | 'SNAPSHOT_EMIT' | 'DEBOUNCING' | 'COLLECTED'>('IDLE');
  const [collectedValues, setCollectedValues] = useState<string[]>(['Kotlin Coroutines']);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Snapshot emitted
    setPipelineStep('SNAPSHOT_EMIT');
    onLog('snapshotFlow', 'DEBUG', t.snapshotLog(inputText));

    // 2. Debouncing
    const stepTimer = setTimeout(() => {
      setPipelineStep('DEBOUNCING');
    }, 150);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // 3. Debounce(500) & Collect
    debounceTimerRef.current = setTimeout(() => {
      if (inputText.trim().length > 0) {
        setPipelineStep('COLLECTED');
        setCollectedValues((prev) => [inputText, ...prev.slice(0, 4)]);
        onLog('snapshotFlow', 'INFO', t.collectLog(inputText));
      } else {
        setPipelineStep('IDLE');
      }
    }, 500);

    return () => {
      clearTimeout(stepTimer);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [inputText, language]);

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Input Field (Compose State) */}
      <div className="space-y-1">
        <label className="text-xs text-slate-300 font-medium flex justify-between">
          <span>{t.stateLabel}</span>
          <span className="text-[11px] font-mono text-emerald-400 font-normal">
            snapshotFlow &#123; text &#125;
          </span>
        </label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.placeholder}
          className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
        />
      </div>

      {/* Reactive Pipeline Flow Visualization */}
      <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-2.5 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
          <GitBranch className="w-4 h-4 text-sky-400" />
          <span>{t.pipelineTitle}</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px] text-center">
          {/* Step 1 */}
          <div
            className={`p-2 rounded-lg border transition-all ${
              pipelineStep === 'SNAPSHOT_EMIT'
                ? 'bg-sky-950/80 border-sky-500 text-sky-300 ring-1 ring-sky-500/50'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <span className="block text-[10px] text-slate-500">{t.stepSnapshot}</span>
            <span className="font-semibold">{t.stepEmit}</span>
          </div>

          {/* Step 2 */}
          <div
            className={`p-2 rounded-lg border transition-all ${
              pipelineStep === 'DEBOUNCING'
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 ring-1 ring-amber-500/50'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <span className="block text-[10px] text-slate-500">{t.stepDebounce}</span>
            <span className="font-semibold">500ms</span>
          </div>

          {/* Step 3 */}
          <div
            className={`p-2 rounded-lg border transition-all ${
              pipelineStep === 'COLLECTED'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/50'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <span className="block text-[10px] text-slate-500">{t.stepCollect}</span>
            <span className="font-semibold">{t.stepAction}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>{t.pipeState}</span>
          <span className="font-mono text-emerald-400 font-medium">
            {pipelineStep === 'DEBOUNCING' && t.waiting}
            {pipelineStep === 'SNAPSHOT_EMIT' && t.emitted}
            {pipelineStep === 'COLLECTED' && t.collected}
            {pipelineStep === 'IDLE' && t.idle}
          </span>
        </div>
      </div>

      {/* Emission Log Stream */}
      <div className="flex-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5 overflow-y-auto">
        <span className="text-[11px] font-mono text-slate-500 uppercase block">
          {t.emissionsTitle}
        </span>
        {collectedValues.map((val, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-1.5 bg-slate-900/60 rounded border border-slate-800 text-xs font-mono"
          >
            <span className="text-slate-300 truncate max-w-[200px]">"{val}"</span>
            <span className="text-[10px] text-emerald-400">{t.emittedLabel}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
