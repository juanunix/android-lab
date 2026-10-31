import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { LogItem } from '../../types/sideEffects';
import { useLanguage } from '../../context/LanguageContext';

interface RememberUpdatedStateDemoProps {
  onLog: (tag: string, level: LogItem['level'], message: string) => void;
}

export const RememberUpdatedStateDemo: React.FC<RememberUpdatedStateDemoProps> = ({ onLog }) => {
  const { language } = useLanguage();
  const t = {
    es: {
      strategyLabel: 'Estrategia implementada:',
      withUpdated: 'Con rememberUpdatedState',
      withUpdatedHint: 'El timer NO se reinicia',
      withoutUpdated: 'Sin él (Key reactiva)',
      withoutUpdatedHint: 'El timer vuelve a 0s',
      progressLabel: 'Progreso del SplashScreen (5 seg):',
      running: 'Temporizador corriendo... Cambia el destino abajo para probar.',
      finished: '¡Temporizador finalizado!',
      targetLabel: 'Destino de navegación (Callback):',
      changedLog: (screen: string) => `Callback modificado a: "${screen}"`,
      excellent: 'Excelente: Al cambiar el destino a mitad de camino, el temporizador continúa en su segundo actual y llamará a la pantalla seleccionada.',
      problem: 'Problema: Como el callback forma parte de las keys, cada clic resetea el timer a 0s, atrapando al usuario.',
      reset: 'Reiniciar prueba',
      withLog: 'LaunchedEffect(Unit) iniciado. currentOnTimeout by rememberUpdatedState(onTimeout)',
      withoutLog: (screen: string) => `LaunchedEffect(onTimeout = "${screen}") iniciado. ¡Se reiniciará si cambia!`,
      navigate: (screen: string) => `Navegando a [${screen}] al completar los 5 segundos`,
      callbackExecuted: (msg: string) => `CALLBACK EJECUTADO: ${msg}`,
      cancelledLog: "LaunchedEffect cancelado y reiniciado a 0s porque 'onTimeout' cambió",
    },
    pt: {
      strategyLabel: 'Estratégia implementada:',
      withUpdated: 'Com rememberUpdatedState',
      withUpdatedHint: 'O timer NÃO reinicia',
      withoutUpdated: 'Sem ele (Key reativa)',
      withoutUpdatedHint: 'O timer volta a 0s',
      progressLabel: 'Progresso do SplashScreen (5 seg):',
      running: 'Temporizador em execução... Altere o destino abaixo para testar.',
      finished: 'Temporizador finalizado!',
      targetLabel: 'Destino de navegação (Callback):',
      changedLog: (screen: string) => `Callback alterado para: "${screen}"`,
      excellent: 'Excelente: ao alterar o destino no meio do caminho, o temporizador continua no segundo atual e chamará a tela selecionada.',
      problem: 'Problema: como o callback faz parte das keys, cada clique reinicia o timer para 0s, prendendo o usuário.',
      reset: 'Reiniciar teste',
      withLog: 'LaunchedEffect(Unit) iniciado. currentOnTimeout by rememberUpdatedState(onTimeout)',
      withoutLog: (screen: string) => `LaunchedEffect(onTimeout = "${screen}") iniciado. Será reiniciado se mudar!`,
      navigate: (screen: string) => `Navegando para [${screen}] ao completar os 5 segundos`,
      callbackExecuted: (msg: string) => `CALLBACK EXECUTADO: ${msg}`,
      cancelledLog: "LaunchedEffect cancelado e reiniciado para 0s porque 'onTimeout' mudou",
    },
    en: {
      strategyLabel: 'Implemented strategy:',
      withUpdated: 'With rememberUpdatedState',
      withUpdatedHint: 'The timer does NOT restart',
      withoutUpdated: 'Without it (Reactive key)',
      withoutUpdatedHint: 'The timer resets to 0s',
      progressLabel: 'SplashScreen progress (5 sec):',
      running: 'Timer running... Change the destination below to test.',
      finished: 'Timer finished!',
      targetLabel: 'Navigation destination (Callback):',
      changedLog: (screen: string) => `Callback changed to: "${screen}"`,
      excellent: 'Excellent: changing the destination midway keeps the timer at its current second and will call the selected screen.',
      problem: 'Problem: because the callback is part of the keys, every click resets the timer to 0s, trapping the user.',
      reset: 'Reset test',
      withLog: 'LaunchedEffect(Unit) started. currentOnTimeout by rememberUpdatedState(onTimeout)',
      withoutLog: (screen: string) => `LaunchedEffect(onTimeout = "${screen}") started. It will restart if it changes!`,
      navigate: (screen: string) => `Navigating to [${screen}] after 5 seconds`,
      callbackExecuted: (msg: string) => `CALLBACK EXECUTED: ${msg}`,
      cancelledLog: "LaunchedEffect cancelled and restarted at 0s because 'onTimeout' changed",
    },
  }[language];

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
        ? t.withLog
        : t.withoutLog(targetScreen)
    );

    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= totalSeconds - 1) {
          clearInterval(interval);
          const finalDestination =
            strategy === 'with_updated_state'
              ? currentTargetScreenRef.current
              : targetScreen;

          const msg = t.navigate(finalDestination);
          setExecutedMessage(msg);
          onLog('rememberUpdatedState', 'INFO', t.callbackExecuted(msg));
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
          t.cancelledLog
        );
      }
    };
  }, [strategy === 'without_updated_state' ? targetScreen : null, strategy, language]);

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Strategy Toggle */}
      <div className="space-y-1">
        <span className="text-[11px] font-mono text-slate-400">{t.strategyLabel}</span>
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setStrategy('with_updated_state')}
            className={`py-1.5 px-2 rounded-md font-medium transition-all text-left flex flex-col ${
              strategy === 'with_updated_state'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="font-semibold">{t.withUpdated}</span>
            <span className="text-[10px] opacity-80">{t.withUpdatedHint}</span>
          </button>
          <button
            onClick={() => setStrategy('without_updated_state')}
            className={`py-1.5 px-2 rounded-md font-medium transition-all text-left flex flex-col ${
              strategy === 'without_updated_state'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="font-semibold">{t.withoutUpdated}</span>
            <span className="text-[10px] opacity-80">{t.withoutUpdatedHint}</span>
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-center">
        <span className="text-xs text-slate-400">{t.progressLabel}</span>
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
            {t.running}
          </p>
        ) : (
          <p className="text-[11px] text-emerald-400 font-semibold mt-2">
            ✓ {t.finished}
          </p>
        )}
      </div>

      {/* Changing Callback / Target Destination */}
      <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-300 font-medium">{t.targetLabel}</span>
          <span className="text-[11px] font-mono text-emerald-400">{targetScreen}</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {['HomeScreen', 'ProfileScreen', 'DashboardScreen'].map((screen) => (
            <button
              key={screen}
              onClick={() => {
                setTargetScreen(screen);
                onLog('rememberUpdatedState', 'INFO', t.changedLog(screen));
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
                {t.excellent}
              </span>
            </span>
          ) : (
            <span className="text-rose-400 flex items-start gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                {t.problem}
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
            title={t.reset}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
