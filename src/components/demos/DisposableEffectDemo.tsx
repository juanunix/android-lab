import React, { useState, useEffect } from 'react';
import { Radio, Power, Activity } from 'lucide-react';
import { LogItem } from '../../types/sideEffects';
import { useLanguage } from '../../context/LanguageContext';

interface DisposableEffectDemoProps {
  onLog: (tag: string, level: LogItem['level'], message: string) => void;
}

export const DisposableEffectDemo: React.FC<DisposableEffectDemoProps> = ({ onLog }) => {
  const { language } = useLanguage();
  const t = {
    es: {
      composableStatus: 'Estado del Composable:',
      mountHint: 'Monta o desmonta la pantalla para ver onDispose',
      unmount: 'Desmontar (Salir)',
      mount: 'Montar Composable',
      registered: 'REGISTRADO Y ESCUCHANDO',
      unregistered: 'DESREGISTRADO',
      axisX: 'Eje X',
      axisY: 'Eje Y (Gravedad)',
      axisZ: 'Eje Z',
      changeKey: 'Cambiar Key (sensorRate):',
      keyHint:
        'Al seleccionar una nueva tasa, primero se ejecuta onDispose para desregistrar el listener anterior y luego se suscribe el nuevo.',
      unmountedTitle: 'Composable Desmontado',
      unmountedDesc: 'Se ejecutó onDispose. Cero fugas de memoria en segundo plano.',
      disposeLog: 'onDispose { sensorManager.unregisterListener(listener) } ejecutado. Recursos liberados.',
      mountedLog: 'Composable montado en el árbol',
      unmountedLog: 'Composable salió de la composición',
    },
    pt: {
      composableStatus: 'Estado do Composable:',
      mountHint: 'Monte ou desmonte a tela para ver o onDispose',
      unmount: 'Desmontar (Sair)',
      mount: 'Montar Composable',
      registered: 'REGISTRADO E ESCUTANDO',
      unregistered: 'DESREGISTRADO',
      axisX: 'Eixo X',
      axisY: 'Eixo Y (Gravidade)',
      axisZ: 'Eixo Z',
      changeKey: 'Alterar Key (sensorRate):',
      keyHint:
        'Ao selecionar uma nova taxa, o onDispose é executado primeiro para desregistrar o listener anterior e depois o novo é inscrito.',
      unmountedTitle: 'Composable Desmontado',
      unmountedDesc: 'O onDispose foi executado. Zero vazamentos de memória em segundo plano.',
      disposeLog: 'onDispose { sensorManager.unregisterListener(listener) } executado. Recursos liberados.',
      mountedLog: 'Composable montado na árvore',
      unmountedLog: 'Composable saiu da composição',
    },
    en: {
      composableStatus: 'Composable status:',
      mountHint: 'Mount or unmount the screen to see onDispose',
      unmount: 'Unmount (Leave)',
      mount: 'Mount Composable',
      registered: 'REGISTERED & LISTENING',
      unregistered: 'UNREGISTERED',
      axisX: 'X axis',
      axisY: 'Y axis (Gravity)',
      axisZ: 'Z axis',
      changeKey: 'Change Key (sensorRate):',
      keyHint:
        'When selecting a new rate, onDispose runs first to unregister the previous listener, then the new one is subscribed.',
      unmountedTitle: 'Composable Unmounted',
      unmountedDesc: 'onDispose executed. Zero memory leaks in the background.',
      disposeLog: 'onDispose { sensorManager.unregisterListener(listener) } executed. Resources released.',
      mountedLog: 'Composable mounted in the tree',
      unmountedLog: 'Composable left the composition',
    },
  }[language];

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
      onLog('DisposableEffect', 'WARN', t.disposeLog);
    };
  }, [isMounted, sensorRate, language]);

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Composable Mount Toggle */}
      <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs">
        <div>
          <span className="text-slate-300 font-semibold">{t.composableStatus}</span>
          <p className="text-[11px] text-slate-500">{t.mountHint}</p>
        </div>
        <button
          onClick={() => {
            const next = !isMounted;
            setIsMounted(next);
            onLog(
              'DisposableEffect',
              next ? 'DEBUG' : 'WARN',
              next ? t.mountedLog : t.unmountedLog
            );
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${
            isMounted
              ? 'bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/80'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{isMounted ? t.unmount : t.mount}</span>
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
                {isListening ? t.registered : t.unregistered}
              </span>
            </div>

            {/* Sensor Live Data */}
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">{t.axisX}</span>
                <span className="text-sm font-bold text-sky-400 tabular-nums">
                  {sensorValues.x}
                </span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">{t.axisY}</span>
                <span className="text-sm font-bold text-emerald-400 tabular-nums">
                  {sensorValues.y}
                </span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-500 block">{t.axisZ}</span>
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
              <span>{t.changeKey}</span>
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
              {t.keyHint}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-950/40 rounded-xl border border-slate-800/60 text-slate-400">
          <Activity className="w-8 h-8 text-slate-600 mb-2" />
          <p className="text-xs font-semibold text-slate-300">{t.unmountedTitle}</p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
            {t.unmountedDesc}
          </p>
        </div>
      )}
    </div>
  );
};
