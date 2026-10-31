import React, { useState } from 'react';
import { RotateCcw, RotateCw, AlertTriangle, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const MviChannelVsStateLab: React.FC = () => {
  const { language } = useLanguage();
  const [architectureApproach, setArchitectureApproach] = useState<'bad_state' | 'good_channel'>('good_channel');
  const [stateShowError, setStateShowError] = useState(false);
  const [channelEventConsumed, setChannelEventConsumed] = useState(false);
  const [rotationCount, setRotationCount] = useState(0);
  const [snackbarHistory, setSnackbarHistory] = useState<string[]>([]);

  const tLab = {
    es: {
      title: 'El Gran Dilema: Channel vs State para Eventos Únicos',
      subtitle:
        'Prueba interactiva del bug de rotación: ¿por qué nunca debes almacenar eventos efímeros (navegación, snackbar) en el State?',
      approachGood: 'Padrón Canónico: Channel<Event>',
      approachGoodDesc: 'Entrega exactamente una vez (Queue buffer). Cero repeticiones al girar.',
      approachBad: 'Antipadrón: Flag booleano en State',
      approachBadDesc: 'showSnackbar = true. Se repite en cada rotación de pantalla.',
      triggerErrorBtn: 'Disparar Error (Ej: fallo de red)',
      rotateBtn: 'Girar Pantalla (Rotación de Dispositivo)',
      resetBtn: 'Reiniciar prueba',
      replaysTitle: 'Historial de Snackbars disparados en UI:',
      goodVerdict: '✓ ¡Correcto! El Channel se vació al ser consumido. Girar la pantalla NO disparó un segundo Snackbar.',
      badVerdict: '✕ ¡Bug de repetición! Como el booleano sigue en el State, la nueva Activity al recomponer volvió a disparar el Snackbar.',
      codeTitle: 'Diferencia en el Código Kotlin:',
      kicker: 'Laboratorio Comparativo de Arquitectura',
      recommended: 'RECOMENDADO',
      antiPattern: 'ANTIPATRÓN',
      rotationsLabel: 'Rotaciones simuladas:',
      recordsLabel: 'registros',
      emptyHint: 'Presiona "Disparar Error" y luego "Girar Pantalla" para observar el comportamiento.',
      canonicalCodeLabel: '✓ Padrón Canónico (Channel)',
      antiCodeLabel: '✕ Antipadrón (Boolean en State)',
      logFromState: 'Snackbar mostrado (desde State.showError = true)',
      logFromChannel: 'Snackbar consumido (Channel.send -> ObserveAsEvents)',
      logBug: 'BUG! Pantalla girada -> State re-leído -> Snackbar REPETIDO',
      logChannel: 'Pantalla girada -> Channel vacío -> Ningún snackbar duplicado',
      goodCode: `// ViewModel
private val _events = Channel<ScreenEvent>()
val events = _events.receiveAsFlow()

fun onError() {
    viewModelScope.launch {
        _events.send(ScreenEvent.ShowError)
    }
}

// UI (ObserveAsEvents)
ObserveAsEvents(viewModel.events) { event ->
    snackbarHostState.showSnackbar("Error")
}`,
      badCode: `// State
data class ScreenState(
    val showError: Boolean = false // ¡BUG!
)

// La UI se recompone al girar
if (state.showError) {
    LaunchedEffect(state.showError) {
        snackbarHostState.showSnackbar("Error")
        // Debes reiniciarlo manualmente
        // o se repetirá al girar
    }
}`,
    },
    pt: {
      title: 'O Grande Dilema: Channel vs State para Eventos Únicos',
      subtitle:
        'Teste interativo do bug de rotação: por que nunca armazenar eventos efêmeros (navegação, snackbar) no State?',
      approachGood: 'Padrão Canônico: Channel<Event>',
      approachGoodDesc: 'Entrega exatamente uma vez. Zero repetições ao rotacionar a tela.',
      approachBad: 'Antipadrão: Flag booleano no State',
      approachBadDesc: 'showSnackbar = true. Repete a cada rotação de tela.',
      triggerErrorBtn: 'Disparar Erro (Ex: falha de rede)',
      rotateBtn: 'Girar Tela (Rotação do Dispositivo)',
      resetBtn: 'Reiniciar teste',
      replaysTitle: 'Histórico de Snackbars disparados na UI:',
      goodVerdict: '✓ Correto! O Channel foi esvaziado após o consumo. Girar a tela NÃO disparou um segundo Snackbar.',
      badVerdict: '✕ Bug de repetição! Como o booleano permaneceu no State, a nova Activity disparou o Snackbar novamente.',
      codeTitle: 'Diferença no Código Kotlin:',
      kicker: 'Laboratório Comparativo de Arquitetura',
      recommended: 'RECOMENDADO',
      antiPattern: 'ANTIPADRÃO',
      rotationsLabel: 'Rotações simuladas:',
      recordsLabel: 'registros',
      emptyHint: 'Pressione "Disparar Erro" e depois "Girar Tela" para observar o comportamento.',
      canonicalCodeLabel: '✓ Padrão Canônico (Channel)',
      antiCodeLabel: '✕ Antipadrão (Boolean no State)',
      logFromState: 'Snackbar exibido (de State.showError = true)',
      logFromChannel: 'Snackbar consumido (Channel.send -> ObserveAsEvents)',
      logBug: 'BUG! Tela girada -> State relido -> Snackbar REPETIDO',
      logChannel: 'Tela girada -> Channel vazio -> Nenhum snackbar duplicado',
      goodCode: `// ViewModel
private val _events = Channel<ScreenEvent>()
val events = _events.receiveAsFlow()

fun onError() {
    viewModelScope.launch {
        _events.send(ScreenEvent.ShowError)
    }
}

// UI (ObserveAsEvents)
ObserveAsEvents(viewModel.events) { event ->
    snackbarHostState.showSnackbar("Error")
}`,
      badCode: `// State
data class ScreenState(
    val showError: Boolean = false // BUG!
)

// A UI recompõe ao girar
if (state.showError) {
    LaunchedEffect(state.showError) {
        snackbarHostState.showSnackbar("Error")
        // Você precisa reiniciar manualmente
        // ou ele se repetirá ao girar
    }
}`,
    },
    en: {
      title: 'The Great Debate: Channel vs State for One-Shot Events',
      subtitle:
        'Interactive rotation bug experiment: why transient events (navigation, snackbars) must never live inside State.',
      approachGood: 'Canonical Standard: Channel<Event>',
      approachGoodDesc: 'Exactly-once delivery (buffered queue). Zero replays on rotation.',
      approachBad: 'Anti-pattern: Boolean flag in State',
      approachBadDesc: 'showSnackbar = true. Replays automatically on device rotation.',
      triggerErrorBtn: 'Trigger Error (e.g. network failure)',
      rotateBtn: 'Rotate Screen (Device Rotation)',
      resetBtn: 'Reset experiment',
      replaysTitle: 'Snackbar Triggers Recorded in UI:',
      goodVerdict: '✓ Clean! The Channel emptied after delivery. Screen rotation produced ZERO duplicate Snackbars.',
      badVerdict: '✕ Replay Bug! Because the flag remained in State, the newly recreated Activity re-read and re-displayed the Snackbar.',
      codeTitle: 'Kotlin Code Comparison:',
      kicker: 'Architecture Comparison Lab',
      recommended: 'RECOMMENDED',
      antiPattern: 'ANTI-PATTERN',
      rotationsLabel: 'Simulated rotations:',
      recordsLabel: 'records',
      emptyHint: 'Press "Trigger Error" and then "Rotate Screen" to observe the behavior.',
      canonicalCodeLabel: '✓ Canonical Pattern (Channel)',
      antiCodeLabel: '✕ Anti-pattern (Boolean in State)',
      logFromState: 'Snackbar shown (from State.showError = true)',
      logFromChannel: 'Snackbar consumed (Channel.send -> ObserveAsEvents)',
      logBug: 'BUG! Screen rotated -> State re-read -> Snackbar REPLAYED',
      logChannel: 'Screen rotated -> Channel empty -> No duplicate snackbar',
      goodCode: `// ViewModel
private val _events = Channel<ScreenEvent>()
val events = _events.receiveAsFlow()

fun onError() {
    viewModelScope.launch {
        _events.send(ScreenEvent.ShowError)
    }
}

// UI (ObserveAsEvents)
ObserveAsEvents(viewModel.events) { event ->
    snackbarHostState.showSnackbar("Error")
}`,
      badCode: `// State
data class ScreenState(
    val showError: Boolean = false // BUG!
)

// UI recomposes on rotation
if (state.showError) {
    LaunchedEffect(state.showError) {
        snackbarHostState.showSnackbar("Error")
        // You must reset it manually
        // or it will replay on rotation
    }
}`,
    },
  }[language];

  const handleTriggerError = () => {
    const timestamp = new Date().toLocaleTimeString();
    if (architectureApproach === 'bad_state') {
      setStateShowError(true);
      setSnackbarHistory((prev) => [
        `[${timestamp}] ${tLab.logFromState}`,
        ...prev,
      ]);
    } else {
      setChannelEventConsumed(true);
      setSnackbarHistory((prev) => [
        `[${timestamp}] ${tLab.logFromChannel}`,
        ...prev,
      ]);
    }
  };

  const handleRotate = () => {
    const nextRot = rotationCount + 1;
    setRotationCount(nextRot);
    const timestamp = new Date().toLocaleTimeString();

    if (architectureApproach === 'bad_state' && stateShowError) {
      // THE BUG HAPPENS! The Activity recreates and re-reads state.showError = true
      setSnackbarHistory((prev) => [
        `[${timestamp}] ${tLab.logBug} #${nextRot}`,
        ...prev,
      ]);
    } else {
      setSnackbarHistory((prev) => [
        `[${timestamp}] ${tLab.logChannel} #${nextRot}`,
        ...prev,
      ]);
    }
  };

  const handleReset = () => {
    setStateShowError(false);
    setChannelEventConsumed(false);
    setRotationCount(0);
    setSnackbarHistory([]);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
            {tLab.kicker}
          </span>
          <h3 className="text-xl font-bold text-white mt-0.5">
            {tLab.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {tLab.subtitle}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{tLab.resetBtn}</span>
        </button>
      </div>

      {/* Approach Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => {
            setArchitectureApproach('good_channel');
            handleReset();
          }}
          className={`p-4 rounded-xl text-left border transition-all ${
            architectureApproach === 'good_channel'
              ? 'bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-400 text-sm">
              {tLab.approachGood}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              {tLab.recommended}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            {tLab.approachGoodDesc}
          </p>
        </button>

        <button
          onClick={() => {
            setArchitectureApproach('bad_state');
            handleReset();
          }}
          className={`p-4 rounded-xl text-left border transition-all ${
            architectureApproach === 'bad_state'
              ? 'bg-rose-950/40 border-rose-500 shadow-md ring-1 ring-rose-500/30'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-rose-400 text-sm">
              {tLab.approachBad}
            </span>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
              {tLab.antiPattern}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            {tLab.approachBadDesc}
          </p>
        </button>
      </div>

      {/* Interactive Trigger Controls */}
      <div className="bg-[#0b1120] p-4 rounded-xl border border-slate-800 flex flex-wrap items-center gap-3">
        <button
          onClick={handleTriggerError}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-sm"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{tLab.triggerErrorBtn}</span>
        </button>

        <button
          onClick={handleRotate}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-2 shadow-sm"
        >
          <RotateCw className="w-4 h-4" />
          <span>{tLab.rotateBtn}</span>
        </button>

        <span className="text-xs font-mono text-slate-400 ml-auto">
          {tLab.rotationsLabel} <strong className="text-white">{rotationCount}</strong>
        </span>
      </div>

      {/* Outcome Verdict & Live Log */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold text-slate-300">
            {tLab.replaysTitle}
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            {snackbarHistory.length} {tLab.recordsLabel}
          </span>
        </div>

        {snackbarHistory.length > 0 && (
          <div
            className={`p-3 rounded-xl border text-xs leading-relaxed ${
              architectureApproach === 'good_channel'
                ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300'
                : snackbarHistory.some((h) => h.includes('BUG'))
                ? 'bg-rose-950/30 border-rose-800/80 text-rose-300'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}
          >
            {architectureApproach === 'good_channel' ? (
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{tLab.goodVerdict}</span>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{tLab.badVerdict}</span>
              </div>
            )}
          </div>
        )}

        <div className="p-3 bg-[#070b14] rounded-xl border border-slate-800 max-h-36 overflow-y-auto font-mono text-xs space-y-1.5">
          {snackbarHistory.length === 0 ? (
            <p className="text-slate-500 text-center py-4">
              {tLab.emptyHint}
            </p>
          ) : (
            snackbarHistory.map((item, idx) => (
              <div
                key={idx}
                className={`py-0.5 ${
                  item.includes('BUG') ? 'text-rose-400 font-bold' : 'text-slate-300'
                }`}
              >
                {item}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Side by side Kotlin code */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-slate-400">
          {tLab.codeTitle}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 bg-[#070b14] rounded-xl border border-emerald-900/60 space-y-1.5">
            <span className="text-emerald-400 font-bold block text-[11px]">
              {tLab.canonicalCodeLabel}
            </span>
            <pre className="text-slate-300 leading-relaxed overflow-x-auto text-[11px]">
              {tLab.goodCode}
            </pre>
          </div>

          <div className="p-3 bg-[#070b14] rounded-xl border border-rose-900/60 space-y-1.5">
            <span className="text-rose-400 font-bold block text-[11px]">
              {tLab.antiCodeLabel}
            </span>
            <pre className="text-slate-400 leading-relaxed overflow-x-auto text-[11px]">
              {tLab.badCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
