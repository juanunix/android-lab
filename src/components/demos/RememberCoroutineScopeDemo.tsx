import React, { useState, useRef } from 'react';
import { ArrowDown, ArrowUp, Bell, MessageSquare, Loader2 } from 'lucide-react';
import { LogItem } from '../../types/sideEffects';

interface RememberCoroutineScopeDemoProps {
  onLog: (tag: string, level: LogItem['level'], message: string) => void;
}

export const RememberCoroutineScopeDemo: React.FC<RememberCoroutineScopeDemoProps> = ({ onLog }) => {
  const [items] = useState(
    Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      title: `Elemento #${i + 1} de la lista LazyColumn`,
      subtitle: `Datos cacheados en memoria local (índice ${i})`,
    }))
  );

  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Simulated: scope.launch { listState.animateScrollToItem(target) }
  const handleScroll = (position: 'top' | 'bottom') => {
    setActiveJobsCount((c) => c + 1);
    onLog(
      'rememberCoroutineScope',
      'DEBUG',
      `scope.launch { listState.animateScrollToItem(${position === 'top' ? 0 : items.length - 1}) } invocado desde onClick`
    );

    if (listContainerRef.current) {
      listContainerRef.current.scrollTo({
        top: position === 'top' ? 0 : listContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }

    setTimeout(() => {
      setActiveJobsCount((c) => Math.max(0, c - 1));
      onLog('rememberCoroutineScope', 'INFO', `Animación de scroll completada en el CoroutineScope`);
    }, 600);
  };

  // Simulated: scope.launch { snackbarHostState.showSnackbar("...") }
  const handleShowSnackbar = (text: string) => {
    setActiveJobsCount((c) => c + 1);
    onLog('rememberCoroutineScope', 'DEBUG', `scope.launch { snackbarHostState.showSnackbar("${text}") }`);
    setSnackbarMessage(text);

    setTimeout(() => {
      setSnackbarMessage(null);
      setActiveJobsCount((c) => Math.max(0, c - 1));
      onLog('rememberCoroutineScope', 'INFO', `Snackbar ocultado. Corrutina finalizada.`);
    }, 3000);
  };

  // Simulated async computation from button
  const handleAsyncAction = () => {
    setIsProcessing(true);
    setActiveJobsCount((c) => c + 1);
    onLog('rememberCoroutineScope', 'DEBUG', 'scope.launch { withContext(Dispatchers.IO) { syncData() } }');

    setTimeout(() => {
      setIsProcessing(false);
      setActiveJobsCount((c) => Math.max(0, c - 1));
      onLog('rememberCoroutineScope', 'INFO', 'Sincronización completada exitosamente');
      handleShowSnackbar('¡Datos sincronizados vía scope.launch!');
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full space-y-3 relative">
      {/* Scope Status Badge */}
      <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 text-xs flex items-center justify-between">
        <div>
          <span className="text-slate-400">CoroutineScope:</span>
          <span className="ml-1.5 text-emerald-400 font-semibold">Atado al Composable</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="text-slate-400">Jobs activos:</span>
          <span className="px-1.5 py-0.2 bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 rounded font-bold">
            {activeJobsCount}
          </span>
        </div>
      </div>

      {/* Control Buttons (Simulating Compose Buttons with scope.launch in onClick) */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={() => handleScroll('bottom')}
          className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700/80 transition-colors"
        >
          <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
          <span>Scroll a Fondo</span>
        </button>

        <button
          onClick={() => handleScroll('top')}
          className="flex items-center justify-center gap-1.5 py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700/80 transition-colors"
        >
          <ArrowUp className="w-3.5 h-3.5 text-sky-400" />
          <span>Scroll al Inicio</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          onClick={() => handleShowSnackbar('¡Acción guardada en base de datos!')}
          className="flex items-center justify-center gap-1.5 py-2 px-2 bg-indigo-950/50 hover:bg-indigo-900/50 text-indigo-300 rounded-lg border border-indigo-800/60 transition-colors"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Show Snackbar</span>
        </button>

        <button
          onClick={handleAsyncAction}
          disabled={isProcessing}
          className="flex items-center justify-center gap-1.5 py-2 px-2 bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-300 rounded-lg border border-emerald-800/60 transition-colors disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <MessageSquare className="w-3.5 h-3.5" />
          )}
          <span>Sincronizar (IO)</span>
        </button>
      </div>

      {/* Simulated LazyColumn */}
      <div
        ref={listContainerRef}
        className="flex-1 overflow-y-auto space-y-1.5 bg-slate-950/60 p-2 rounded-lg border border-slate-800/70"
      >
        <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wide">
          LazyColumn (25 items):
        </span>
        {items.map((item) => (
          <div
            key={item.id}
            className="p-2 rounded bg-slate-900/70 border border-slate-800 text-xs flex flex-col hover:border-slate-700 transition-colors"
          >
            <span className="font-medium text-slate-200">{item.title}</span>
            <span className="text-[10px] text-slate-400">{item.subtitle}</span>
          </div>
        ))}
      </div>

      {/* Simulated Snackbar Notification */}
      {snackbarMessage && (
        <div className="absolute bottom-1 left-2 right-2 bg-slate-800 text-slate-100 p-2.5 rounded-lg border border-slate-700 shadow-xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span>{snackbarMessage}</span>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">DESHACER</span>
        </div>
      )}
    </div>
  );
};
