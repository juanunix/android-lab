import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Cpu,
  RotateCw,
  Code2,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { MVI_CONCEPTS_DATA } from '../../data/mviData';
import { MviConceptId } from '../../types/mvi';
import { useLanguage } from '../../context/LanguageContext';
import { MviUdfDiagram } from './MviUdfDiagram';
import { MviScreenSimulator } from './MviScreenSimulator';
import { MviChannelVsStateLab } from './MviChannelVsStateLab';
import { MviCodeExplorer } from './MviCodeExplorer';
import { MviTemplateGenerator } from './MviTemplateGenerator';
import { CodeViewer } from '../CodeViewer';

export const MviLabMain: React.FC = () => {
  const { language } = useLanguage();
  const [selectedConceptId, setSelectedConceptId] = useState<MviConceptId>('udf_flow');

  const concepts = MVI_CONCEPTS_DATA[language];
  const activeConcept = concepts.find((c) => c.id === selectedConceptId) || concepts[0];

  const tMain = {
    es: {
      kicker: 'Arquitectura Android & KMP Moderna',
      title: 'Laboratorio de Arquitectura MVI',
      subtitle:
        'Aprende a diseñar aplicaciones robustas con Flujo Unidireccional de Datos (UDF), Estado Inmutable (SSOT), Acciones Selladas y Manejo de Eventos Únicos con Channel en Jetpack Compose.',
      conceptsTitle: 'Pilares Arquitectónicos de MVI',
      rulesTitle: 'Las 5 Reglas de Oro de la Arquitectura MVI',
      exploreBtn: 'Explorar Simulador',
    },
    pt: {
      kicker: 'Arquitetura Android & KMP Moderna',
      title: 'Laboratório de Arquitetura MVI',
      subtitle:
        'Aprenda a estruturar aplicativos robustos com Fluxo Unidirecional de Dados (UDF), Estado Único Imutável (SSOT), Ações Seladas e Tratamento de Eventos Únicos com Channel no Jetpack Compose.',
      conceptsTitle: 'Pilares Arquiteturais do MVI',
      rulesTitle: 'Os 5 Mandamentos da Arquitetura MVI',
      exploreBtn: 'Explorar Simulador',
    },
    en: {
      kicker: 'Modern Android & KMP Architecture',
      title: 'MVI Architecture Lab',
      subtitle:
        'Master robust architecture with Unidirectional Data Flow (UDF), Single Immutable State (SSOT), Sealed Actions, and Channel-backed One-Shot Events in Jetpack Compose.',
      conceptsTitle: 'Core MVI Architectural Pillars',
      rulesTitle: 'The 5 Golden Rules of MVI Architecture',
      exploreBtn: 'Explore Simulator',
    },
  }[language];

  return (
    <div className="space-y-12">
      {/* Hero of MVI Lab */}
      <section className="bg-gradient-to-b from-[#0f172a] via-[#0a0f1d] to-[#070b14] border-b border-slate-800/80 -mx-4 sm:-mx-6 px-4 sm:px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span>{tMain.kicker}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white" style={{ textWrap: 'balance' }}>
            {tMain.title}
          </h2>

          <p className="text-base text-slate-300 leading-relaxed max-w-3xl">
            {tMain.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#simulator"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              {tMain.exploreBtn}
            </a>
            <a
              href="#rules"
              className="px-5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm border border-slate-700 transition-all"
            >
              Reglas de Oro MVI
            </a>
          </div>
        </div>
      </section>

      {/* Interactive UDF Loop */}
      <section id="udf">
        <MviUdfDiagram />
      </section>

      {/* Live Interactive Screen Simulator with StateFlow & Action Dispatcher */}
      <section id="simulator" className="space-y-4">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
            Simulador de Producción
          </span>
          <h3 className="text-2xl font-bold text-white mt-0.5">
            MVI en Acción en una Pantalla Real de Android
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactúa con la tienda Pixel: busca productos, añade favoritos, agrega al carrito y observa el StateFlow mutar atómicamente mientras los eventos viajan por el Channel.
          </p>
        </div>

        <MviScreenSimulator />
      </section>

      {/* Channel vs State Rotation Bug Experiment */}
      <section id="channel-vs-state">
        <MviChannelVsStateLab />
      </section>

      {/* Architectural Pillars Explorer */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
            Fundamentos Detallados
          </span>
          <h3 className="text-2xl font-bold text-white mt-0.5">
            {tMain.conceptsTitle}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Haz clic en cada componente para ver las directrices canónicas de MVI, buenas prácticas y ejemplos en Kotlin.
          </p>
        </div>

        {/* Pillars selector cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {concepts.map((concept) => {
            const isSelected = concept.id === selectedConceptId;
            return (
              <button
                key={concept.id}
                onClick={() => setSelectedConceptId(concept.id)}
                className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/95 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-[#0b101e] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <span
                  className={`font-mono text-xs font-bold truncate block ${
                    isSelected ? 'text-emerald-400' : 'text-slate-200'
                  }`}
                >
                  {concept.name}
                </span>
                <span className="text-[10px] text-slate-500 font-medium mt-1 truncate">
                  {concept.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Concept Details */}
        <div className="bg-[#0b1120] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono text-emerald-400">
                {activeConcept.badge}
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                {activeConcept.name}
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              Directrices Canónicas MVI
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {activeConcept.description}
          </p>

          {/* MVI Golden Rule Banner */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">
              {activeConcept.architectureRule}
            </span>
          </div>

          {/* Code Viewer */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-slate-400">Implementación en Kotlin:</span>
            <CodeViewer
              title={`${activeConcept.name}.kt`}
              code={activeConcept.kotlinCode}
            />
          </div>

          {/* Do's & Don'ts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#070b14] border border-emerald-900/60 space-y-2">
              <span className="text-xs font-bold text-emerald-400 font-mono">
                ✓ Buenas Prácticas (Do's)
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeConcept.dos.map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#070b14] border border-rose-900/60 space-y-2">
              <span className="text-xs font-bold text-rose-400 font-mono">
                ✕ Errores y Antipatrones (Don'ts)
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeConcept.donts.map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Code Explorer (Canonical Files) */}
      <section id="code-explorer">
        <MviCodeExplorer />
      </section>

      {/* 1-Click Template Generator */}
      <section id="generator">
        <MviTemplateGenerator />
      </section>

      {/* 5 Golden Rules */}
      <section id="rules" className="space-y-4 pt-4">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
            Guía Definitiva
          </span>
          <h3 className="text-2xl font-bold text-white mt-0.5">
            {tMain.rulesTitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#0b1120] border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-emerald-400 font-bold">Regla 1</span>
            <h4 className="font-bold text-white text-sm">Una sola función onAction()</h4>
            <p className="text-slate-300 leading-relaxed">
              No expongas múltiples métodos públicos en tu ViewModel. Toda interacción de la UI viaja a través de un único <code className="text-sky-300 font-mono">fun onAction(action: ScreenAction)</code> en un when exhaustivo.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b1120] border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-emerald-400 font-bold">Regla 2</span>
            <h4 className="font-bold text-white text-sm">Updates atómicos con _state.update</h4>
            <p className="text-slate-300 leading-relaxed">
              Nunca uses <code className="text-rose-400 font-mono">_state.value = _state.value.copy(...)</code>. Usa siempre <code className="text-emerald-400 font-mono">_state.update &#123; it.copy(...) &#125;</code> para proteger la concurrencia de corrutinas contra condiciones de carrera.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b1120] border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-emerald-400 font-bold">Regla 3</span>
            <h4 className="font-bold text-white text-sm">Channel para eventos de un solo uso</h4>
            <p className="text-slate-300 leading-relaxed">
              Nunca guardes flags booleanos de navegación o snackbar en el State. Envíalos por un <code className="text-sky-300 font-mono">Channel&lt;ScreenEvent&gt;</code> para erradicar el bug de repetición al girar la pantalla.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b1120] border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-emerald-400 font-bold">Regla 4</span>
            <h4 className="font-bold text-white text-sm">Orden Canónico: &lt;Screen&gt;Root y &lt;Screen&gt;Screen</h4>
            <p className="text-slate-300 leading-relaxed">
              En el mismo archivo <code className="text-sky-300 font-mono">&lt;Screen&gt;Screen.kt</code>: 1. <code className="text-sky-300 font-mono">&lt;Screen&gt;Root</code> (ViewModel, eventos y ciclo de vida), 2. <code className="text-sky-300 font-mono">&lt;Screen&gt;Screen</code> (stateless puro con state y onAction), y 3. <code className="text-sky-300 font-mono">&lt;Screen&gt;ScreenPreview</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b1120] border border-slate-800 space-y-2">
            <span className="text-xs font-mono text-emerald-400 font-bold">Regla 5</span>
            <h4 className="font-bold text-white text-sm">UiText para desacoplar Context</h4>
            <p className="text-slate-300 leading-relaxed">
              Nunca inyectes Android Context en tu ViewModel para resolver strings. Usa la abstracción <code className="text-sky-300 font-mono">UiText.StringResource</code> y resuélvela en Compose mediante <code className="text-sky-300 font-mono">.asString()</code>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
