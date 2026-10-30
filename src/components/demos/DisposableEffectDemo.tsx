import React, { useState, useEffect } from 'react';
import { Radio, Power, Activity } from 'lucide-react';
import { LogItem } from '../../types/sideEffects';

interface DisposableEffectDemoProps {
  onLog: (tag: string, level: LogItem['level'], message: string) => void;
}

export const DisposableEffectDemo: React.FC<DisposableEffectDemoProps> = ({ onLog }) => {
  const [isMounted, setIsMounted] = useState(true);
  const [sensorRate, setSensorRate] = useState<'NORMAL' | 'FAST' | 'GAME'>('NORMAL');
  const [sensorValues, setSensorValues] = useState({ x: 0.12, y: 9.81, z: 0.45 });
  const [isListening, setIsListening] = useState(false);

  // Simulation of DisposableEffect(sensorRate) inside Composable
  useEffect(() => {
    if (!isMounted) {
      setIsListening(false);
      return;
    }

    // Effect setup
    setIsListening(true);
    onLog(
      'DisposableEffect',
      'INFO',
      `DisposableEffect(key = ${sensorRate}): sensorManager.registerListener(listener, Sensor.TYPE_ACCELEROMETER, ${sensorRate})`
    );

    const intervalTime = sensorRate === 'GAME' ? 100 : sensorRate === 'FAST' ? 300 : 700;
    const interval = setInterval(() => {
      setSensorValues({
        x: Number((Math.sin(Date.now() / 500) * 2).toFixed(2)),
        y: Number((9.8 + Math.cos(Date.now() / 600) * 0.5).toFixed(2)),
        z: Number((Math.sin(Date.now() / 800) * 1.5).toFixed(2)),
      });
    }, intervalTime);

    // onDispose cleanup
    return () => {
      clearInterval(interval);
      setIsListening(false);
      onLog(
        'DisposableEffect',
        'WARN',
        `onDispose { sensorManager.unregisterListener(listener) } ejecutado. Recursos liberados.`
      );
    };
  }, [isMounted, sensorRate]);

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Composable Mount Toggle */}
      <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs">
        <div>
          <span className="text-slate-300 font-semibold">Estado del Composable:</span>
          <p className="text-[11px] text-slate-500">Monta o desmonta la pantalla para ver onDispose</p>
        </div>
        <button
          onClick={() => {
            const next = !isMounted;
            setIsMounted(next);
            onLog(
              'DisposableEffect',
              next ? 'DEBUG' : 'WARN',
              next ? 'Composable montado en el árbol' : 'Composable salió de la composición'
            );
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${
            isMounted
              ? 'bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/80'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{isMounted ? 'Desmontar (Salir)' : 'Montar Composable'}</span>
        </button>
      </div>

      {isMounted ? (
        <div className="flex-1 flex flex-col space-y-3">
          {/* Status Panel */}
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">SensorEventListener:</span>
              <span
                className={`font-mono text-[11px] px-2 py-0.5 rounded font-bold ${
                  isListening
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isListening ? 'REGISTRADO Y ESCUCHANDO' : 'DESREGISTRADO'}
              </span>
            </div>

            {/* Sensor Live Data */}
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Eje X</span>
                <span className="text-sm font-bold text-sky-400 tabular-nums">
                  {sensorValues.x}
                </span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Eje Y (Gravedad)</span>
                <span className="text-sm font-bold text-emerald-400 tabular-nums">
                  {sensorValues.y}
                </span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Eje Z</span>
                <span className="text-sm font-bold text-amber-400 tabular-nums">
                  {sensorValues.z}
                </span>
              </div>
            </div>
          </div>

          {/* Sensor Rate Key Selector */}
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Radio className="w-3.5 h-3.5 text-indigo-400" />
              <span>Cambiar Key (sensorRate):</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {(['NORMAL', 'FAST', 'GAME'] as const).map((rate) => (
                <button
                  key={rate}
                  onClick={() => setSensorRate(rate)}
                  className={`py-1.5 px-2 rounded text-[11px] font-mono border transition-all ${
                    sensorRate === rate
                      ? 'bg-indigo-600 text-white font-bold border-indigo-400 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {rate}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-slate-400">
              Al seleccionar una nueva tasa, primero se ejecuta <code className="text-rose-400 font-mono">onDispose</code> para desregistrar el listener anterior y luego se suscribe el nuevo.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-950/40 rounded-xl border border-slate-800/60 text-slate-400">
          <Activity className="w-8 h-8 text-slate-600 mb-2" />
          <p className="text-xs font-semibold text-slate-300">Composable Desmontado</p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
            Se ejecutó <span className="text-rose-400 font-mono">onDispose</span>. Cero fugas de memoria en segundo plano.
          </p>
        </div>
      )}
    </div>
  );
};
