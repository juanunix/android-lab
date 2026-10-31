import React, { useState } from 'react';
import { Plus, RefreshCw, BarChart2, ShieldCheck } from 'lucide-react';
import { LogItem } from '../../types/sideEffects';
import { useLanguage } from '../../context/LanguageContext';

interface SideEffectDemoProps {
  onLog: (tag: string, level: LogItem['level'], message: string) => void;
}

export const SideEffectDemo: React.FC<SideEffectDemoProps> = ({ onLog }) => {
  const { language } = useLanguage();
  const t = {
    es: {
      recompositions: 'Recomposiciones:',
      analyticsEvents: 'Eventos Analytics:',
      cartTitle: 'Carrito de Compras (Compose State):',
      items: 'artículos',
      addItem: 'Agregar Artículo (+1)',
      categoryLabel: 'Categoría del catálogo:',
      categories: { electronics: 'Electrónica', home: 'Hogar', clothing: 'Ropa' },
      guaranteeTitle: 'Garantía de ejecución post-composición:',
      guaranteeDesc:
        'Si llamas a librerías externas directamente en el cuerpo del Composable, corres el riesgo de enviar eventos duplicados si la recomposición es cancelada o recalculada. Con SideEffect { ... }, solo se ejecuta tras confirmar que la composición fue exitosa y se aplicó a la UI.',
      reset: 'Reiniciar métricas',
      resetLog: 'Contadores reseteados a estado inicial',
      syncLog: (count: number, category: string) =>
        `SideEffect: Sincronizando estado con Analytics SDK externo -> [cart_items: ${count}, category: "${category}"]`,
    },
    pt: {
      recompositions: 'Recomposições:',
      analyticsEvents: 'Eventos Analytics:',
      cartTitle: 'Carrinho de Compras (Compose State):',
      items: 'itens',
      addItem: 'Adicionar Item (+1)',
      categoryLabel: 'Categoria do catálogo:',
      categories: { electronics: 'Eletrônicos', home: 'Casa', clothing: 'Roupas' },
      guaranteeTitle: 'Garantia de execução pós-composição:',
      guaranteeDesc:
        'Se você chamar bibliotecas externas diretamente no corpo do Composable, corre o risco de enviar eventos duplicados se a recomposição for cancelada ou recalculada. Com SideEffect { ... }, ele só executa após confirmar que a composição foi bem-sucedida e aplicada à UI.',
      reset: 'Reiniciar métricas',
      resetLog: 'Contadores redefinidos para o estado inicial',
      syncLog: (count: number, category: string) =>
        `SideEffect: Sincronizando estado com Analytics SDK externo -> [cart_items: ${count}, category: "${category}"]`,
    },
    en: {
      recompositions: 'Recompositions:',
      analyticsEvents: 'Analytics Events:',
      cartTitle: 'Shopping Cart (Compose State):',
      items: 'items',
      addItem: 'Add Item (+1)',
      categoryLabel: 'Catalog category:',
      categories: { electronics: 'Electronics', home: 'Home', clothing: 'Clothing' },
      guaranteeTitle: 'Post-composition execution guarantee:',
      guaranteeDesc:
        'If you call external libraries directly inside the composable body, you risk sending duplicate events if the recomposition is cancelled or recalculated. With SideEffect { ... }, it only runs after confirming the composition succeeded and was applied to the UI.',
      reset: 'Reset metrics',
      resetLog: 'Counters reset to initial state',
      syncLog: (count: number, category: string) =>
        `SideEffect: Syncing state with external Analytics SDK -> [cart_items: ${count}, category: "${category}"]`,
    },
  }[language];

  type CategoryId = 'electronics' | 'home' | 'clothing';

  const [cartCount, setCartCount] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('electronics');
  const [recompositions, setRecompositions] = useState(1);
  const [analyticsEventsSent, setAnalyticsEventsSent] = useState(1);

  const categories: { id: CategoryId; label: string }[] = [
    { id: 'electronics', label: t.categories.electronics },
    { id: 'home', label: t.categories.home },
    { id: 'clothing', label: t.categories.clothing },
  ];

  // Simulates a recomposition triggered by state change
  const triggerRecomposition = (newCount: number, newCategory?: CategoryId) => {
    const nextRecomp = recompositions + 1;
    setRecompositions(nextRecomp);
    setCartCount(newCount);
    if (newCategory) setSelectedCategory(newCategory);

    // SideEffect runs after composition completes successfully
    const nextAnalytics = analyticsEventsSent + 1;
    setAnalyticsEventsSent(nextAnalytics);

    const activeCategory = newCategory ?? selectedCategory;
    const label = t.categories[activeCategory];

    onLog('SideEffect', 'INFO', t.syncLog(newCount, label));
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block">{t.recompositions}</span>
          <span className="text-xl font-bold font-mono text-amber-400 tabular-nums">
            {recompositions}
          </span>
        </div>

        <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 block">{t.analyticsEvents}</span>
          <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
            {analyticsEventsSent}
          </span>
        </div>
      </div>

      {/* Interactive Android Screen UI */}
      <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800 text-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200">{t.cartTitle}</span>
          <span className="text-emerald-400 font-mono font-bold">{cartCount} {t.items}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerRecomposition(cartCount + 1)}
            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addItem}</span>
          </button>

          <button
            onClick={() => triggerRecomposition(Math.max(0, cartCount - 1))}
            className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
          >
            -1
          </button>
        </div>

        <div>
          <span className="text-[11px] text-slate-400 block mb-1">{t.categoryLabel}</span>
          <div className="grid grid-cols-3 gap-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => triggerRecomposition(cartCount, cat.id)}
                className={`py-1 px-1.5 rounded text-[11px] font-mono border transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white font-bold border-indigo-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Explanation of SideEffect guarantee */}
      <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 text-xs space-y-1.5">
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>{t.guaranteeTitle}</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-normal">
          {t.guaranteeDesc}
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => {
            setRecompositions(1);
            setAnalyticsEventsSent(1);
            setCartCount(1);
            onLog('SideEffect', 'DEBUG', t.resetLog);
          }}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
        >
          <RefreshCw className="w-3 h-3" />
          <span>{t.reset}</span>
        </button>
      </div>
    </div>
  );
};
