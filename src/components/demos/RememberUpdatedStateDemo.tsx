import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { LogItem } from '../../types/sideEffects';

interface RememberUpdatedStateDemoProps {
  onLog: (tag: string, level: LogItem['level'], message: string) => void;
}

export const RememberUpdatedStateDemo: React.FC<RememberUpdatedStateDemoProps> = ({ onLog }) => {
  const [strategy, setStrategy] = useState<'with_updated_state' | 'without_updated_state'>('with_updated_state');
  const [targetScreen, setTargetScreen] = useState('HomeScreen');
  const [elapsed, setElapsed] = useState(0);
  const totalSeconds = 5;
  const [executedMessage, setExecutedMessage] = useState<string | null>(null);

  // Reference holding latest targetScreen to emulate rememberUpdatedState
  const currentTargetScreenRef = useRef(targetScreen);
  currentTargetScreenRef.current = targetScreen;

  // Stale ref to emulate capturing closure without rememberUpdatedState
  const staleRef = useRef(targetScreen);

  // Timer simulation
  useEffect(() => {
    setElapsed(0);
    setExecutedMessage(null);
    staleRef.current = targetScreen;

    onLog(
      'rememberUpdatedState',
      'DEBUG',
      strategy === 'with_updated_state'
        ? `LaunchedEffect(Unit) iniciado. currentOnTimeout by rememberUpdatedState(onTimeout)`
        : `LaunchedEffect(onTimeout = "${targetScreen}") iniciado. ¡Se reiniciará si cambia!`
    );

    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= totalSeconds - 1) {
          clearInterval(interval);
          const finalDestination =
            strategy === 'with_updated_state'
              ? currentTargetScreenRef.current
              : targetScreen;

          const msg = `Navegando a [${finalDestination}] al completar los 5 segundos`;
          setExecutedMessage(msg);
          onLog('rememberUpdatedState', 'INFO', `CALLBACK EJECUTADO: ${msg}`);
          return totalSeconds;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      if (strategy === 'without_updated_state') {
        onLog(
          'rememberUpdatedState',
          'WARN',
          `LaunchedEffect cancelado y reiniciado a 0s porque 'onTimeout' cambió`
        );
      }
    };
  }, [strategy === 'without_updated_state' ? targetScreen : null, strategy]);

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Strategy Toggle */}
      <div className="space-y-1">
        <span className="text-[11px] font-mono text-slate-400">Estrategia implementada:</span>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setStrategy('with_updated_state')}
            className={`py-1.5 px-2 rounded-md font-medium transition-all text-left flex flex-col ${
              strategy === 'with_updated_state'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="font-semibold">Con rememberUpdatedState</span>
            <span className="text-[10px] opacity-80">El timer NO se reinicia</span>
          </button>
          <button
            onClick={() => setStrategy('without_updated_state')}
            className={`py-1.5 px-2 rounded-md font-medium transition-all text-left flex flex-col ${
              strategy === 'without_updated_state'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="font-semibold">Sin él (Key reactiva)</span>
            <span className="text-[10px] opacity-80">El timer vuelve a 0s</span>
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-center">
        <span className="text-xs text-slate-400">Progreso del SplashScreen (5 seg):</span>
        <div className="text-3xl font-mono font-bold text-white my-1 tabular-nums">
          {elapsed}s / {totalSeconds}s
        </div>
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              strategy === 'with_updated_state' ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
            style={{ width: `${(elapsed / totalSeconds) * 100}%` }}
          />
        </div>
        {elapsed < totalSeconds ? (
          <p className="text-[11px] text-sky-400 mt-2">
            ⏳ Temporizador corriendo... Cambia el destino abajo para probar.
          </p>
        ) : (
          <p className="text-[11px] text-emerald-400 font-semibold mt-2">
            ✓ ¡Temporizador finalizado!
          </p>
        )}
      </div>

      {/* Changing Callback / Target Destination */}
      <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-300 font-medium">Destino de navegación (Callback):</span>
          <span className="text-[11px] font-mono text-emerald-400">{targetScreen}</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {['HomeScreen', 'ProfileScreen', 'DashboardScreen'].map((screen) => (
            <button
              key={screen}
              onClick={() => {
                setTargetScreen(screen);
                onLog('rememberUpdatedState', 'INFO', `Callback modificado a: "${screen}"`);
              }}
              className={`py-1 px-1.5 rounded text-[11px] font-mono border transition-all ${
                targetScreen === screen
                  ? 'bg-indigo-600 border-indigo-400 text-white font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {screen.replace('Screen', '')}
            </button>
          ))}
        </div>

        <p className="text-[11px] text-slate-400 leading-normal">
          {strategy === 'with_updated_state' ? (
            <span className="text-emerald-400 flex items-start gap-1">
              <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                <strong>Excelente:</strong> Al cambiar el destino a mitad de camino, el temporizador continúa en su segundo actual y llamará a la pantalla seleccionada.
              </span>
            </span>
          ) : (
            <span className="text-rose-400 flex items-start gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                <strong>Problema:</strong> Como el callback forma parte de las keys, cada clic resetea el timer a 0s, atrapando al usuario.
              </span>
            </span>
          )}
        </p>
      </div>

      {/* Result notification */}
      {executedMessage && (
        <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-xs text-emerald-200 flex items-center justify-between">
          <span>{executedMessage}</span>
          <button
            onClick={() => setElapsed(0)}
            className="p-1 hover:bg-emerald-900/60 rounded"
            title="Reiniciar prueba"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
