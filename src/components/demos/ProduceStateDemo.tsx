import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { LogItem } from '../../types/sideEffects';

interface ProduceStateDemoProps {
  onLog: (tag: string, level: LogItem['level'], message: string) => void;
}

interface Product {
  id: string;
  name: string;
  price: string;
  stock: number;
}

type UiState<T> =
  | { status: 'LOADING' }
  | { status: 'SUCCESS'; data: T }
  | { status: 'ERROR'; message: string };

export const ProduceStateDemo: React.FC<ProduceStateDemoProps> = ({ onLog }) => {
  const [productId, setProductId] = useState('PROD-101');
  const [uiState, setUiState] = useState<UiState<Product>>({ status: 'LOADING' });
  const [shouldFail, setShouldFail] = useState(false);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // Simulation of produceState(initialValue = UiState.Loading, key1 = productId, key2 = retryTrigger)
  useEffect(() => {
    // 1. Initial State
    setUiState({ status: 'LOADING' });
    onLog(
      'produceState',
      'DEBUG',
      `produceState(initialValue = Loading, key = "${productId}"): Corrutina del productor iniciada`
    );

    const timer = setTimeout(() => {
      if (shouldFail) {
        setUiState({
          status: 'ERROR',
          message: 'Error 503: Servidor de inventario no disponible',
        });
        onLog(
          'produceState',
          'ERROR',
          `value = UiState.Error("Error 503...") emitido al State`
        );
      } else {
        const mockCatalog: Record<string, Product> = {
          'PROD-101': { id: 'PROD-101', name: 'Google Pixel 9 Pro', price: '$999', stock: 14 },
          'PROD-102': { id: 'PROD-102', name: 'Pixel Tablet con Base', price: '$499', stock: 8 },
          'PROD-103': { id: 'PROD-103', name: 'Pixel Watch 3 (45mm)', price: '$349', stock: 22 },
        };
        const product = mockCatalog[productId] || {
          id: productId,
          name: 'Dispositivo Android Generico',
          price: '$199',
          stock: 5,
        };

        setUiState({ status: 'SUCCESS', data: product });
        onLog(
          'produceState',
          'INFO',
          `value = UiState.Success("${product.name}") asignado a value en ProduceStateScope`
        );
      }
    }, 700);

    return () => {
      clearTimeout(timer);
      onLog('produceState', 'WARN', `Productor anterior cancelado por cambio de key o recomposición`);
    };
  }, [productId, shouldFail, retryTrigger]);

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Product Key Selector */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono text-slate-400">
          Clave reactiva (productId):
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {['PROD-101', 'PROD-102', 'PROD-103'].map((id) => (
            <button
              key={id}
              onClick={() => {
                setShouldFail(false);
                setProductId(id);
              }}
              className={`py-1.5 px-2 rounded text-[11px] font-mono border transition-all ${
                productId === id && !shouldFail
                  ? 'bg-emerald-600 text-white font-bold border-emerald-400 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {/* Network Failure Toggle */}
      <div className="flex items-center justify-between p-2 bg-slate-900/80 rounded-lg border border-slate-800 text-xs">
        <span className="text-slate-300">Simular fallo de red:</span>
        <button
          onClick={() => {
            const next = !shouldFail;
            setShouldFail(next);
            setRetryTrigger((c) => c + 1);
          }}
          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
            shouldFail
              ? 'bg-rose-950 text-rose-300 border border-rose-800'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          {shouldFail ? 'Fallo Activado' : 'Conexión Normal'}
        </button>
      </div>

      {/* Screen Rendered by UiState */}
      <div className="flex-1 bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex flex-col justify-center items-center text-center">
        {uiState.status === 'LOADING' && (
          <div className="space-y-3 flex flex-col items-center">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-200 block">
                initialValue = UiState.Loading
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Consultando backend asíncrono...
              </span>
            </div>
          </div>
        )}

        {uiState.status === 'SUCCESS' && (
          <div className="space-y-3 w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center mx-auto text-emerald-400">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider block">
                UiState.Success
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {uiState.data.name}
              </h4>
              <p className="text-xs font-mono text-emerald-300 mt-1 font-bold">
                {uiState.data.price}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>SKU: {uiState.data.id}</span>
              <span className="text-emerald-400">Disponibles: {uiState.data.stock}</span>
            </div>
          </div>
        )}

        {uiState.status === 'ERROR' && (
          <div className="space-y-3 w-full animate-in fade-in duration-200">
            <div className="w-10 h-10 rounded-full bg-rose-950/80 border border-rose-800 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-rose-400 font-mono uppercase tracking-wider block">
                UiState.Error
              </span>
              <p className="text-xs text-rose-200 mt-1">{uiState.message}</p>
            </div>
            <button
              onClick={() => {
                setShouldFail(false);
                setRetryTrigger((c) => c + 1);
              }}
              className="py-1.5 px-3 bg-rose-900/60 hover:bg-rose-800/60 text-white rounded-lg text-xs font-medium border border-rose-700/60 flex items-center gap-1.5 mx-auto"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reintentar llamada</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
