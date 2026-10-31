import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { LogItem } from '../../types/sideEffects';
import { useLanguage } from '../../context/LanguageContext';

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
  const { language } = useLanguage();
  const t = {
    es: {
      keyLabel: 'Clave reactiva (productId):',
      simulateFailure: 'Simular fallo de red:',
      failureOn: 'Fallo Activado',
      connectionNormal: 'Conexión Normal',
      querying: 'Consultando backend asíncrono...',
      available: 'Disponibles:',
      retry: 'Reintentar llamada',
      errorMessage: 'Error 503: Servidor de inventario no disponible',
      tablet: 'Pixel Tablet con Base',
      genericDevice: 'Dispositivo Android Genérico',
      producerStarted: (id: string) => `produceState(initialValue = Loading, key = "${id}"): Corrutina del productor iniciada`,
      errorEmitted: 'value = UiState.Error("Error 503...") emitido al State',
      successAssigned: (name: string) => `value = UiState.Success("${name}") asignado a value en ProduceStateScope`,
      producerCancelled: 'Productor anterior cancelado por cambio de key o recomposición',
    },
    pt: {
      keyLabel: 'Chave reativa (productId):',
      simulateFailure: 'Simular falha de rede:',
      failureOn: 'Falha Ativada',
      connectionNormal: 'Conexão Normal',
      querying: 'Consultando backend assíncrono...',
      available: 'Disponíveis:',
      retry: 'Tentar novamente',
      errorMessage: 'Erro 503: Servidor de inventário indisponível',
      tablet: 'Pixel Tablet com Base',
      genericDevice: 'Dispositivo Android Genérico',
      producerStarted: (id: string) => `produceState(initialValue = Loading, key = "${id}"): Corrotina do produtor iniciada`,
      errorEmitted: 'value = UiState.Error("Erro 503...") emitido para o State',
      successAssigned: (name: string) => `value = UiState.Success("${name}") atribuído a value em ProduceStateScope`,
      producerCancelled: 'Produtor anterior cancelado por mudança de key ou recomposição',
    },
    en: {
      keyLabel: 'Reactive key (productId):',
      simulateFailure: 'Simulate network failure:',
      failureOn: 'Failure Enabled',
      connectionNormal: 'Normal Connection',
      querying: 'Querying async backend...',
      available: 'Available:',
      retry: 'Retry call',
      errorMessage: 'Error 503: Inventory server unavailable',
      tablet: 'Pixel Tablet with Dock',
      genericDevice: 'Generic Android Device',
      producerStarted: (id: string) => `produceState(initialValue = Loading, key = "${id}"): Producer coroutine started`,
      errorEmitted: 'value = UiState.Error("Error 503...") emitted to State',
      successAssigned: (name: string) => `value = UiState.Success("${name}") assigned to value in ProduceStateScope`,
      producerCancelled: 'Previous producer cancelled due to key change or recomposition',
    },
  }[language];

  const [productId, setProductId] = useState('PROD-101');
  const [uiState, setUiState] = useState<UiState<Product>>({ status: 'LOADING' });
  const [shouldFail, setShouldFail] = useState(false);
  const [retryTrigger, setRetryTrigger] = useState(0);

  // Simulation of produceState(initialValue = UiState.Loading, key1 = productId, key2 = retryTrigger)
  useEffect(() => {
    // 1. Initial State
    setUiState({ status: 'LOADING' });
    onLog('produceState', 'DEBUG', t.producerStarted(productId));

    const timer = setTimeout(() => {
      if (shouldFail) {
        setUiState({
          status: 'ERROR',
          message: t.errorMessage,
        });
        onLog('produceState', 'ERROR', t.errorEmitted);
      } else {
        const mockCatalog: Record<string, Product> = {
          'PROD-101': { id: 'PROD-101', name: 'Google Pixel 9 Pro', price: '$999', stock: 14 },
          'PROD-102': { id: 'PROD-102', name: t.tablet, price: '$499', stock: 8 },
          'PROD-103': { id: 'PROD-103', name: 'Pixel Watch 3 (45mm)', price: '$349', stock: 22 },
        };
        const product = mockCatalog[productId] || {
          id: productId,
          name: t.genericDevice,
          price: '$199',
          stock: 5,
        };

        setUiState({ status: 'SUCCESS', data: product });
        onLog('produceState', 'INFO', t.successAssigned(product.name));
      }
    }, 700);

    return () => {
      clearTimeout(timer);
      onLog('produceState', 'WARN', t.producerCancelled);
    };
  }, [productId, shouldFail, retryTrigger, language]);

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Product Key Selector */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono text-slate-400">
          {t.keyLabel}
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
        <span className="text-slate-300">{t.simulateFailure}</span>
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
          {shouldFail ? t.failureOn : t.connectionNormal}
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
                {t.querying}
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
              <span className="text-emerald-400">{t.available} {uiState.data.stock}</span>
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
              <span>{t.retry}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
