import React, { useState } from 'react';
import { ArrowRight, RefreshCw, LogOut, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LifecycleDiagramProps {
  onSelectEffect: (effectId: string) => void;
}

export const LifecycleDiagram: React.FC<LifecycleDiagramProps> = ({ onSelectEffect }) => {
  const { t, language } = useLanguage();
  const [selectedPhase, setSelectedPhase] = useState<'INITIAL' | 'RECOMPOSITION' | 'LEAVING'>('RECOMPOSITION');

  const effectDescriptionsByLang: Record<string, Record<'INITIAL' | 'RECOMPOSITION' | 'LEAVING', { name: string; desc: string }[]>> = {
    es: {
      INITIAL: [
        { name: 'rememberUpdatedState', desc: 'Almacena la referencia inicial del valor o lambda en State.' },
        { name: 'produceState', desc: 'Inicializa con initialValue y lanza su corrutina productora.' },
        { name: 'LaunchedEffect(keys)', desc: 'Lanza una corrutina en el CoroutineScope del Composable.' },
        { name: 'DisposableEffect(keys)', desc: 'Ejecuta el bloque y prepara la lambda onDispose { ... }.' },
        { name: 'SideEffect', desc: 'Se ejecuta inmediatamente después de que la composición tiene éxito.' },
      ],
      RECOMPOSITION: [
        { name: 'derivedStateOf', desc: 'Filtra cambios de alta frecuencia. Solo notifica si el resultado cambia.' },
        { name: 'rememberUpdatedState', desc: 'Actualiza su referencia interna sin reiniciar efectos que lo leen.' },
        { name: 'LaunchedEffect (si cambian keys)', desc: 'Cancela la corrutina en ejecución y relanza una nueva con los nuevos keys.' },
        { name: 'DisposableEffect (si cambian keys)', desc: 'Ejecuta onDispose del key anterior y ejecuta el bloque para el nuevo key.' },
        { name: 'SideEffect', desc: 'Se ejecuta de nuevo de forma síncrona tras CADA recomposición exitosa.' },
      ],
      LEAVING: [
        { name: 'DisposableEffect -> onDispose', desc: 'Ejecuta obligatoriamente onDispose { ... } para liberar sensores y listeners.' },
        { name: 'LaunchedEffect -> Cancelación', desc: 'Cancela inmediatamente el Job de la corrutina en ejecución.' },
        { name: 'rememberCoroutineScope -> Cancelación', desc: 'Cancela todas las corrutinas hijas lanzadas desde eventos onClick.' },
        { name: 'produceState -> Cancelación', desc: 'Cancela la corrutina productora de datos de fondo.' },
      ],
    },
    pt: {
      INITIAL: [
        { name: 'rememberUpdatedState', desc: 'Armazena a referência inicial do valor ou lambda no State.' },
        { name: 'produceState', desc: 'Inicializa com initialValue e dispara sua corrotina produtora.' },
        { name: 'LaunchedEffect(keys)', desc: 'Dispara uma corrotina no CoroutineScope do Composable.' },
        { name: 'DisposableEffect(keys)', desc: 'Executa o bloco e prepara a lambda onDispose { ... }.' },
        { name: 'SideEffect', desc: 'Executa imediatamente após a composição ter sucesso.' },
      ],
      RECOMPOSITION: [
        { name: 'derivedStateOf', desc: 'Filtra alterações de alta frequência. Só notifica se o resultado mudar.' },
        { name: 'rememberUpdatedState', desc: 'Atualiza sua referência interna sem reiniciar efeitos que a leem.' },
        { name: 'LaunchedEffect (se keys mudarem)', desc: 'Cancela a corrotina anterior e relança uma nova com as novas keys.' },
        { name: 'DisposableEffect (se keys mudarem)', desc: 'Executa onDispose da chave anterior e executa o bloco para a nova chave.' },
        { name: 'SideEffect', desc: 'Executa novamente de forma síncrona após CADA recomposição bem-sucedida.' },
      ],
      LEAVING: [
        { name: 'DisposableEffect -> onDispose', desc: 'Executa obrigatoriamente onDispose { ... } para liberar sensores e listeners.' },
        { name: 'LaunchedEffect -> Cancelamento', desc: 'Cancela imediatamente o Job da corrotina em execução.' },
        { name: 'rememberCoroutineScope -> Cancelamento', desc: 'Cancela todas as corrotinas filhas disparadas a partir de eventos onClick.' },
        { name: 'produceState -> Cancelamento', desc: 'Cancela a corrotina produtora de dados em segundo plano.' },
      ],
    },
    en: {
      INITIAL: [
        { name: 'rememberUpdatedState', desc: 'Stores initial value or lambda reference in State.' },
        { name: 'produceState', desc: 'Initializes with initialValue and launches producer coroutine.' },
        { name: 'LaunchedEffect(keys)', desc: 'Launches a coroutine in the Composable CoroutineScope.' },
        { name: 'DisposableEffect(keys)', desc: 'Runs setup block and prepares onDispose { ... } lambda.' },
        { name: 'SideEffect', desc: 'Executes immediately after composition succeeds.' },
      ],
      RECOMPOSITION: [
        { name: 'derivedStateOf', desc: 'Filters high-frequency changes; notifies only on output change.' },
        { name: 'rememberUpdatedState', desc: 'Updates internal reference without restarting dependent effects.' },
        { name: 'LaunchedEffect (on key change)', desc: 'Cancels running coroutine and relaunches with new keys.' },
        { name: 'DisposableEffect (on key change)', desc: 'Executes onDispose for old key and runs block for new key.' },
        { name: 'SideEffect', desc: 'Executes synchronously after EVERY successful recomposition.' },
      ],
      LEAVING: [
        { name: 'DisposableEffect -> onDispose', desc: 'Mandatory onDispose execution to tear down listeners.' },
        { name: 'LaunchedEffect -> Cancellation', desc: 'Immediately cancels the active coroutine Job.' },
        { name: 'rememberCoroutineScope -> Cancellation', desc: 'Cancels all active child jobs launched from onClick handlers.' },
        { name: 'produceState -> Cancellation', desc: 'Cancels background data producer coroutine.' },
      ],
    },
  };

  const idMap: Record<string, string> = {
    'rememberUpdatedState': 'remember-updated-state',
    'produceState': 'produce-state',
    'LaunchedEffect': 'launched-effect',
    'DisposableEffect': 'disposable-effect',
    'SideEffect': 'side-effect',
    'derivedStateOf': 'derived-state-of',
    'rememberCoroutineScope': 'remember-coroutine-scope',
  };

  const getEffectId = (name: string) => {
    for (const [key, val] of Object.entries(idMap)) {
      if (name.includes(key)) return val;
    }
    return 'launched-effect';
  };

  const phases = [
    {
      id: 'INITIAL' as const,
      title: t.lifecycle.initialPhase,
      icon: Play,
      description: t.lifecycle.initialDesc,
    },
    {
      id: 'RECOMPOSITION' as const,
      title: t.lifecycle.recompPhase,
      icon: RefreshCw,
      description: t.lifecycle.recompDesc,
    },
    {
      id: 'LEAVING' as const,
      title: t.lifecycle.leavingPhase,
      icon: LogOut,
      description: t.lifecycle.leavingDesc,
    },
  ];

  const currentPhaseData = phases.find((p) => p.id === selectedPhase)!;
  const currentEffectsList = effectDescriptionsByLang[language][selectedPhase];

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0e1424] p-6 space-y-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
            {t.lifecycle.kicker}
          </span>
          <h3 className="text-xl font-bold text-white mt-0.5">
            {t.lifecycle.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {t.lifecycle.subtitle}
          </p>
        </div>

        {/* Phase Selectors */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
          {phases.map((phase) => {
            const Icon = phase.icon;
            const isSelected = selectedPhase === phase.id;
            return (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id)}
                className={`flex items-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-slate-800 text-white shadow border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : ''}`} />
                <span>{phase.title.split('.')[1] || phase.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Phase Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {phases.map((p) => {
          const isSelected = selectedPhase === p.id;
          return (
            <div
              key={p.id}
              onClick={() => setSelectedPhase(p.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-900/90 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/20'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 font-mono">
                  {p.title}
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-mono">
                  {t.lifecycle.phasePrefix} {p.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {p.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Detailed Action List for the Active Phase */}
      <div className="bg-slate-950/70 rounded-xl p-5 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h4 className="text-sm font-bold text-white">
              {currentPhaseData.title}
            </h4>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {currentEffectsList.length} {t.lifecycle.activeHandlers}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentEffectsList.map((item, idx) => {
            const effectId = getEffectId(item.name);
            return (
              <div
                key={idx}
                onClick={() => onSelectEffect(effectId)}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-900 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-300 group-hover:text-emerald-200">
                      {item.name}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-3 self-end">
                  {t.lifecycle.viewDemoAndCode}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

