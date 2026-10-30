import React, { useState, useEffect, useRef } from 'react';
import { GitBranch, Activity, ArrowRight, Check } from 'lucide-react';
import { LogItem } from '../../types/sideEffects';

interface SnapshotFlowDemoProps {
  onLog: (tag: string, level: LogItem['level'], message: string) => void;
}

export const SnapshotFlowDemo: React.FC<SnapshotFlowDemoProps> = ({ onLog }) => {
  const [inputText, setInputText] = useState('Kotlin Coroutines');
  const [pipelineStep, setPipelineStep] = useState<'IDLE' | 'SNAPSHOT_EMIT' | 'DEBOUNCING' | 'COLLECTED'>('IDLE');
  const [collectedValues, setCollectedValues] = useState<string[]>(['Kotlin Coroutines']);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Snapshot emitted
    setPipelineStep('SNAPSHOT_EMIT');
    onLog('snapshotFlow', 'DEBUG', `snapshotFlow { text }: Snapshot detectó cambio -> "${inputText}"`);

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
        onLog(
          'snapshotFlow',
          'INFO',
          `Flow.collect { "${inputText}" } disparado tras superar debounce de 500ms`
        );
      } else {
        setPipelineStep('IDLE');
      }
    }, 500);

    return () => {
      clearTimeout(stepTimer);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [inputText]);

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Input Field (Compose State) */}
      <div className="space-y-1">
        <label className="text-xs text-slate-300 font-medium flex justify-between">
          <span>Compose State (TextField value):</span>
          <span className="text-[11px] font-mono text-emerald-400 font-normal">
            snapshotFlow &#123; text &#125;
          </span>
        </label>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Escribe para probar el flujo reactivo..."
          className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
        />
      </div>

      {/* Reactive Pipeline Flow Visualization */}
      <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 space-y-2.5 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
          <GitBranch className="w-4 h-4 text-sky-400" />
          <span>Pipeline Reactivo de Operadores:</span>
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
            <span className="block text-[10px] text-slate-500">1. Snapshot</span>
            <span className="font-semibold">Emit</span>
          </div>

          {/* Step 2 */}
          <div
            className={`p-2 rounded-lg border transition-all ${
              pipelineStep === 'DEBOUNCING'
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 ring-1 ring-amber-500/50'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <span className="block text-[10px] text-slate-500">2. debounce</span>
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
            <span className="block text-[10px] text-slate-500">3. collect</span>
            <span className="font-semibold">Action</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Estado del Pipe:</span>
          <span className="font-mono text-emerald-400 font-medium">
            {pipelineStep === 'DEBOUNCING' && '⏳ Esperando a que el usuario termine de escribir...'}
            {pipelineStep === 'SNAPSHOT_EMIT' && '⚡ Snapshot emitido'}
            {pipelineStep === 'COLLECTED' && '✓ Valor recibido en el colector'}
            {pipelineStep === 'IDLE' && 'En reposo'}
          </span>
        </div>
      </div>

      {/* Emission Log Stream */}
      <div className="flex-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5 overflow-y-auto">
        <span className="text-[11px] font-mono text-slate-500 uppercase block">
          Emisiones colectadas en el Flow:
        </span>
        {collectedValues.map((val, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-1.5 bg-slate-900/60 rounded border border-slate-800 text-xs font-mono"
          >
            <span className="text-slate-300 truncate max-w-[200px]">"{val}"</span>
            <span className="text-[10px] text-emerald-400">Emitted</span>
          </div>
        ))}
      </div>
    </div>
  );
};
