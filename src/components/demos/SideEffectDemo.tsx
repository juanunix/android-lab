import React, { useState } from 'react';
import { Plus, RefreshCw, BarChart2, ShieldCheck } from 'lucide-react';
import { LogItem } from '../../types/sideEffects';

interface SideEffectDemoProps {
  onLog: (tag: string, level: LogItem['level'], message: string) => void;
}

export const SideEffectDemo: React.FC<SideEffectDemoProps> = ({ onLog }) => {
  const [cartCount, setCartCount] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Electrónica');
  const [recompositions, setRecompositions] = useState(1);
  const [analyticsEventsSent, setAnalyticsEventsSent] = useState(1);

  // Simulates a recomposition triggered by state change
  const triggerRecomposition = (newCount: number, newCategory?: string) => {
    const nextRecomp = recompositions + 1;
    setRecompositions(nextRecomp);
    setCartCount(newCount);
    if (newCategory) setSelectedCategory(newCategory);

    // SideEffect runs after composition completes successfully
    const nextAnalytics = analyticsEventsSent + 1;
    setAnalyticsEventsSent(nextAnalytics);

    onLog(
      'SideEffect',
      'INFO',
      `SideEffect: Sincronizando estado con Analytics SDK externo -> [cart_items: ${newCount}, category: "${newCategory || selectedCategory}"]`
    );
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block">Recomposiciones:</span>
          <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
            {recompositions}
          </span>
        </div>

        <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block">Eventos Analytics:</span>
          <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            {analyticsEventsSent}
          </span>
        </div>
      </div>

      {/* Interactive Android Screen UI */}
      <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 text-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200">Carrito de Compras (Compose State):</span>
          <span className="text-emerald-400 font-mono font-bold">{cartCount} artículos</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerRecomposition(cartCount + 1)}
            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar Artículo (+1)</span>
          </button>

          <button
            onClick={() => triggerRecomposition(Math.max(0, cartCount - 1))}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
          >
            -1
          </button>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block mb-1">Categoría del catálogo:</span>
          <div className="grid grid-cols-3 gap-1">
            {['Electrónica', 'Hogar', 'Ropa'].map((cat) => (
              <button
                key={cat}
                onClick={() => triggerRecomposition(cartCount, cat)}
                className={`py-1 px-1.5 rounded text-[11px] font-mono border transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-bold border-indigo-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Explanation of SideEffect guarantee */}
      <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Garantía de ejecución post-composición:</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-normal">
          Si llamas a librerías externas directamente en el cuerpo del Composable, corres el riesgo de enviar eventos duplicados si la recomposición es cancelada o recalculada. Con <code className="text-sky-300 font-mono">SideEffect &#123; ... &#125;</code>, solo se ejecuta tras confirmar que la composición fue exitosa y se aplicó a la UI.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => {
            setRecompositions(1);
            setAnalyticsEventsSent(1);
            setCartCount(1);
            onLog('SideEffect', 'DEBUG', 'Contadores reseteados a estado inicial');
          }}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reiniciar métricas</span>
        </button>
      </div>
    </div>
  );
};
