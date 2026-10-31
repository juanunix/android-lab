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
      rulesBtn: 'Reglas de Oro MVI',
      simulatorKicker: 'Simulador de Producción',
      simulatorTitle: 'MVI en Acción en una Pantalla Real de Android',
      simulatorDesc:
        'Interactúa con la tienda Pixel: busca productos, añade favoritos, agrega al carrito y observa el StateFlow mutar atómicamente mientras los eventos viajan por el Channel.',
      fundamentalsKicker: 'Fundamentos Detallados',
      fundamentalsDesc:
        'Haz clic en cada componente para ver las directrices canónicas de MVI, buenas prácticas y ejemplos en Kotlin.',
      canonicalBadge: 'Directrices Canónicas MVI',
      implementationLabel: 'Implementación en Kotlin:',
      dosTitle: 'Buenas Prácticas (Do’s)',
      dontsTitle: 'Errores y Antipatrones (Don’ts)',
      definitiveKicker: 'Guía Definitiva',
      rulePrefix: 'Regla',
      rules: [
        {
          title: 'Una sola función onAction()',
          desc: 'No expongas múltiples métodos públicos en tu ViewModel. Toda interacción de la UI viaja a través de un único fun onAction(action: ScreenAction) en un when exhaustivo.',
        },
        {
          title: 'Updates atómicos con _state.update',
          desc: 'Nunca uses _state.value = _state.value.copy(...). Usa siempre _state.update { it.copy(...) } para proteger la concurrencia de corrutinas contra condiciones de carrera.',
        },
        {
          title: 'Channel para eventos de un solo uso',
          desc: 'Nunca guardes flags booleanos de navegación o snackbar en el State. Envíalos por un Channel<ScreenEvent> para erradicar el bug de repetición al girar la pantalla.',
        },
        {
          title: 'Orden Canónico: <Screen>Root y <Screen>Screen',
          desc: 'En el mismo archivo <Screen>Screen.kt: 1. <Screen>Root (ViewModel, eventos y ciclo de vida), 2. <Screen>Screen (stateless puro con state y onAction) y 3. <Screen>ScreenPreview.',
        },
        {
          title: 'UiText para desacoplar Context',
          desc: 'Nunca inyectes Android Context en tu ViewModel para resolver strings. Usa la abstracción UiText.StringResource y resuélvela en Compose mediante .asString().',
        },
      ],
    },
    pt: {
      kicker: 'Arquitetura Android & KMP Moderna',
      title: 'Laboratório de Arquitetura MVI',
      subtitle:
        'Aprenda a estruturar aplicativos robustos com Fluxo Unidirecional de Dados (UDF), Estado Único Imutável (SSOT), Ações Seladas e Tratamento de Eventos Únicos com Channel no Jetpack Compose.',
      conceptsTitle: 'Pilares Arquiteturais do MVI',
      rulesTitle: 'Os 5 Mandamentos da Arquitetura MVI',
      exploreBtn: 'Explorar Simulador',
      rulesBtn: 'Regras de Ouro MVI',
      simulatorKicker: 'Simulador de Produção',
      simulatorTitle: 'MVI em Ação em uma Tela Real de Android',
      simulatorDesc:
        'Interaja com a loja Pixel: busque produtos, adicione favoritos, coloque no carrinho e observe o StateFlow mudar atomicamente enquanto os eventos viajam pelo Channel.',
      fundamentalsKicker: 'Fundamentos Detalhados',
      fundamentalsDesc:
        'Clique em cada componente para ver as diretrizes canônicas de MVI, boas práticas e exemplos em Kotlin.',
      canonicalBadge: 'Diretrizes Canônicas MVI',
      implementationLabel: 'Implementação em Kotlin:',
      dosTitle: 'Boas Práticas (Do’s)',
      dontsTitle: 'Erros e Antipadrões (Don’ts)',
      definitiveKicker: 'Guia Definitivo',
      rulePrefix: 'Regra',
      rules: [
        {
          title: 'Uma única função onAction()',
          desc: 'Não exponha múltiplos métodos públicos no seu ViewModel. Toda interação da UI passa por um único fun onAction(action: ScreenAction) em um when exaustivo.',
        },
        {
          title: 'Updates atômicos com _state.update',
          desc: 'Nunca use _state.value = _state.value.copy(...). Use sempre _state.update { it.copy(...) } para proteger a concorrência de corrotinas contra condições de corrida.',
        },
        {
          title: 'Channel para eventos de uso único',
          desc: 'Nunca guarde flags booleanos de navegação ou snackbar no State. Envie-os por um Channel<ScreenEvent> para eliminar o bug de repetição ao girar a tela.',
        },
        {
          title: 'Ordem Canônica: <Screen>Root e <Screen>Screen',
          desc: 'No mesmo arquivo <Screen>Screen.kt: 1. <Screen>Root (ViewModel, eventos e ciclo de vida), 2. <Screen>Screen (stateless puro com state e onAction) e 3. <Screen>ScreenPreview.',
        },
        {
          title: 'UiText para desacoplar Context',
          desc: 'Nunca injete Android Context no ViewModel para resolver strings. Use a abstração UiText.StringResource e resolva no Compose com .asString().',
        },
      ],
    },
    en: {
      kicker: 'Modern Android & KMP Architecture',
      title: 'MVI Architecture Lab',
      subtitle:
        'Master robust architecture with Unidirectional Data Flow (UDF), Single Immutable State (SSOT), Sealed Actions, and Channel-backed One-Shot Events in Jetpack Compose.',
      conceptsTitle: 'Core MVI Architectural Pillars',
      rulesTitle: 'The 5 Golden Rules of MVI Architecture',
      exploreBtn: 'Explore Simulator',
      rulesBtn: 'MVI Golden Rules',
      simulatorKicker: 'Production Simulator',
      simulatorTitle: 'MVI in Action on a Real Android Screen',
      simulatorDesc:
        'Interact with the Pixel store: search products, add favorites, add to cart, and watch StateFlow mutate atomically while events travel through the Channel.',
      fundamentalsKicker: 'Detailed Fundamentals',
      fundamentalsDesc:
        'Click each component to see canonical MVI guidelines, best practices, and Kotlin examples.',
      canonicalBadge: 'Canonical MVI Guidelines',
      implementationLabel: 'Kotlin implementation:',
      dosTitle: 'Best Practices (Do’s)',
      dontsTitle: 'Errors & Anti-patterns (Don’ts)',
      definitiveKicker: 'Definitive Guide',
      rulePrefix: 'Rule',
      rules: [
        {
          title: 'A single onAction() function',
          desc: 'Do not expose multiple public methods on your ViewModel. Every UI interaction travels through a single fun onAction(action: ScreenAction) in an exhaustive when.',
        },
        {
          title: 'Atomic updates with _state.update',
          desc: 'Never use _state.value = _state.value.copy(...). Always use _state.update { it.copy(...) } to protect coroutine concurrency against race conditions.',
        },
        {
          title: 'Channel for one-shot events',
          desc: 'Never store boolean navigation or snackbar flags in State. Send them through a Channel<ScreenEvent> to eliminate the replay bug on screen rotation.',
        },
        {
          title: 'Canonical order: <Screen>Root and <Screen>Screen',
          desc: 'In the same <Screen>Screen.kt file: 1. <Screen>Root (ViewModel, events, lifecycle), 2. <Screen>Screen (pure stateless UI with state and onAction), and 3. <Screen>ScreenPreview.',
        },
        {
          title: 'UiText to decouple Context',
          desc: 'Never inject Android Context into your ViewModel to resolve strings. Use the UiText.StringResource abstraction and resolve it in Compose with .asString().',
        },
      ],
    },
  }[language];

  return (
    <div className="space-y-16">
      {/* Hero of MVI Lab */}
      <section className="bg-gradient-to-b from-surface-high via-surface to-surface-lowest -mx-4 sm:-mx-6 px-4 sm:px-6 py-16">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span>{tMain.kicker}</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-on-surface tracking-[-0.04em]" style={{ textWrap: 'balance' }}>
            {tMain.title}
          </h2>

          <p className="text-base text-slate-300 leading-relaxed max-w-3xl">
            {tMain.subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#simulator"
              className="px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-full text-sm transition-all shadow-[0_16px_40px_-16px_rgba(0,241,94,0.45)]"
            >
              {tMain.exploreBtn}
            </a>
            <a
              href="#rules"
              className="px-6 py-2.5 bg-surface-high hover:bg-surface-highest text-on-surface font-semibold rounded-full text-sm transition-all"
            >
              {tMain.rulesBtn}
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
            {tMain.simulatorKicker}
          </span>
          <h3 className="text-2xl font-bold text-white mt-0.5">
            {tMain.simulatorTitle}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {tMain.simulatorDesc}
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
            {tMain.fundamentalsKicker}
          </span>
          <h3 className="text-2xl font-bold text-white mt-0.5">
            {tMain.conceptsTitle}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {tMain.fundamentalsDesc}
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
        <div className="bg-surface-low p-6 rounded-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
            <div>
              <span className="text-xs font-mono text-emerald-400">
                {activeConcept.badge}
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                {activeConcept.name}
              </h3>
            </div>
            <span className="text-xs font-mono text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full">
              {tMain.canonicalBadge}
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
            <span className="text-xs font-mono text-slate-400">{tMain.implementationLabel}</span>
            <CodeViewer
              title={`${activeConcept.name}.kt`}
              code={activeConcept.kotlinCode}
            />
          </div>

          {/* Do's & Don'ts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-surface-lowest space-y-2">
              <span className="text-xs font-bold text-emerald-400 font-mono">
                ✓ {tMain.dosTitle}
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

            <div className="p-4 rounded-xl bg-surface-lowest space-y-2">
              <span className="text-xs font-bold text-rose-400 font-mono">
                ✕ {tMain.dontsTitle}
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
            {tMain.definitiveKicker}
          </span>
          <h3 className="text-2xl font-bold text-white mt-0.5">
            {tMain.rulesTitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {tMain.rules.map((rule, index) => (
            <div key={rule.title} className="p-6 rounded-2xl bg-surface-low space-y-3">
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {tMain.rulePrefix} {index + 1}
              </span>
              <h4 className="font-bold text-white text-sm">{rule.title}</h4>
              <p className="text-slate-300 leading-relaxed">{rule.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
