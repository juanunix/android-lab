import React, { useState } from 'react';
import {
  Code2,
  Layers,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { LogItem, EffectCategory } from './types/sideEffects';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header, ActiveLab } from './components/Header';
import { CodeViewer } from './components/CodeViewer';
import { LogcatTerminal } from './components/LogcatTerminal';
import { PhoneMockup } from './components/PhoneMockup';
import { DecisionTreeModal } from './components/DecisionTreeModal';
import { LifecycleDiagram } from './components/LifecycleDiagram';

// MVI Architecture Lab Component
import { MviLabMain } from './components/mvi/MviLabMain';
import { ComposeMistakesLab } from './components/mistakes/ComposeMistakesLab';

// Demos
import { LaunchedEffectDemo } from './components/demos/LaunchedEffectDemo';
import { RememberCoroutineScopeDemo } from './components/demos/RememberCoroutineScopeDemo';
import { RememberUpdatedStateDemo } from './components/demos/RememberUpdatedStateDemo';
import { DisposableEffectDemo } from './components/demos/DisposableEffectDemo';
import { SideEffectDemo } from './components/demos/SideEffectDemo';
import { ProduceStateDemo } from './components/demos/ProduceStateDemo';
import { DerivedStateOfDemo } from './components/demos/DerivedStateOfDemo';
import { SnapshotFlowDemo } from './components/demos/SnapshotFlowDemo';

function AppContent() {
  const { t, sideEffects, language } = useLanguage();
  const [activeLab, setActiveLab] = useState<ActiveLab>('mvi'); // Show the newly requested MVI lab by default, with instant 1-click toggle to Side-Effects!
  const [selectedEffectId, setSelectedEffectId] = useState('launched-effect');
  const [selectedCategory, setSelectedCategory] = useState<EffectCategory | 'all'>('all');
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [selectedSnippetIndex, setSelectedSnippetIndex] = useState(0);

  // Initial logs translated based on active language
  const initialLogMessage =
    language === 'en'
      ? 'Initial composition tree committed successfully'
      : language === 'pt'
      ? 'Composição inicial da árvore concluída com sucesso'
      : 'Composición inicial del árbol completada con éxito';

  const initialEffectLogMessage =
    language === 'en'
      ? 'LaunchedEffect initialized on main dispatcher'
      : language === 'pt'
      ? 'LaunchedEffect inicializado na thread principal'
      : 'LaunchedEffect inicializado en el hilo principal';

  // Simulated Logcat logs
  const [logs, setLogs] = useState<LogItem[]>([
    {
      id: 'log-init-1',
      timestamp: '09:41:00.102',
      tag: 'Composition',
      level: 'INFO',
      message: initialLogMessage,
    },
    {
      id: 'log-init-2',
      timestamp: '09:41:00.125',
      tag: 'LaunchedEffect',
      level: 'DEBUG',
      message: initialEffectLogMessage,
    },
  ]);

  const addLog = (tag: string, level: LogItem['level'], message: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(
      now.getMilliseconds()
    ).padStart(3, '0')}`;

    const newLog: LogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: timeStr,
      tag,
      level,
      message,
    };

    setLogs((prev) => [...prev.slice(-49), newLog]);
  };

  const clearLogs = () => setLogs([]);

  const currentEffect =
    sideEffects.find((e) => e.id === selectedEffectId) || sideEffects[0];

  const filteredEffects =
    selectedCategory === 'all'
      ? sideEffects
      : sideEffects.filter((e) => e.category === selectedCategory);

  const handleSelectEffect = (id: string) => {
    setSelectedEffectId(id);
    setSelectedSnippetIndex(0);
    const target = sideEffects.find((e) => e.id === id);
    if (target) {
      const switchMsg =
        language === 'en'
          ? `Switched active effect inspector to: ${target.name}`
          : language === 'pt'
          ? `Visualizador ativo alterado para: ${target.name}`
          : `Cambiando visualizador activo a: ${target.name}`;
      addLog(target.name, 'INFO', switchMsg);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
      {/* Top Bar with Lab Switcher & Language Switcher */}
      <Header
        activeLab={activeLab}
        onSelectLab={(lab) => {
          setActiveLab(lab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDecisionTree={() => setIsDecisionModalOpen(true)}
        onNavigateSection={scrollToSection}
      />

      {/* Conditionally render the selected Laboratory */}
      {activeLab === 'mvi' ? (
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 flex-1">
          <MviLabMain />
        </main>
      ) : activeLab === 'mistakes' ? (
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 flex-1">
          <ComposeMistakesLab />
        </main>
      ) : (
        <>
          {/* Hero Section */}
          <section id="hero" className="border-b-0 bg-gradient-to-b from-surface-high via-surface to-surface-lowest py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span>{t.hero.kicker}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-on-surface tracking-[-0.04em]" style={{ textWrap: 'balance' }}>
              {t.hero.title}
            </h1>

            <p className="text-base text-slate-300 leading-relaxed">
              {t.hero.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollToSection('catalog')}
                className="px-6 py-2.5 bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-full text-sm transition-all shadow-[0_16px_40px_-16px_rgba(65,239,107,0.5)]"
              >
                {t.hero.exploreBtn}
              </button>
              <button
                onClick={() => setIsDecisionModalOpen(true)}
                className="px-6 py-2.5 bg-surface-high hover:bg-surface-highest text-on-surface font-semibold rounded-full text-sm transition-all flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>{t.hero.whichToUseBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Sandbox */}
      <main id="catalog" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-16 space-y-16 flex-1">
        {/* Category Filters & Effect Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-0 bg-transparent">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <span>{t.catalog.title}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.catalog.subtitle}
              </p>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-surface-high/60 rounded-full text-xs self-start md:self-auto overflow-x-auto max-w-full">
              {(
                [
                  { id: 'all', label: t.catalog.categories.all },
                  { id: 'coroutines', label: t.catalog.categories.coroutines },
                  { id: 'lifecycle', label: t.catalog.categories.lifecycle },
                  { id: 'state_conversion', label: t.catalog.categories.state_conversion },
                  { id: 'optimization', label: t.catalog.categories.optimization },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-surface-highest text-on-surface shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Effect Selector Segmented Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {filteredEffects.map((effect) => {
              const isSelected = effect.id === selectedEffectId;
              return (
                <button
                  key={effect.id}
                  onClick={() => handleSelectEffect(effect.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
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
                    {effect.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium mt-1 truncate">
                    {effect.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-Zone Interactive Sandbox Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Android Mockup & Logcat */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-low p-4 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                    {t.simulator.title}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                  {currentEffect.name}
                </span>
              </div>

              {/* Phone Mockup Screen */}
              <PhoneMockup appName={currentEffect.name}>
                {selectedEffectId === 'launched-effect' && (
                  <LaunchedEffectDemo onLog={addLog} />
                )}
                {selectedEffectId === 'remember-coroutine-scope' && (
                  <RememberCoroutineScopeDemo onLog={addLog} />
                )}
                {selectedEffectId === 'remember-updated-state' && (
                  <RememberUpdatedStateDemo onLog={addLog} />
                )}
                {selectedEffectId === 'disposable-effect' && (
                  <DisposableEffectDemo onLog={addLog} />
                )}
                {selectedEffectId === 'side-effect' && (
                  <SideEffectDemo onLog={addLog} />
                )}
                {selectedEffectId === 'produce-state' && (
                  <ProduceStateDemo onLog={addLog} />
                )}
                {selectedEffectId === 'derived-state-of' && (
                  <DerivedStateOfDemo onLog={addLog} />
                )}
                {selectedEffectId === 'snapshot-flow' && (
                  <SnapshotFlowDemo onLog={addLog} />
                )}
              </PhoneMockup>
            </div>

            {/* Android Logcat Terminal */}
            <LogcatTerminal logs={logs} onClear={clearLogs} />
          </div>

          {/* Right Column: Documentation, Kotlin Code, Parameters, Pitfalls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Effect Description Card */}
            <div className="bg-surface-low p-6 rounded-3xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span>{currentEffect.categoryLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-400">{currentEffect.badge}</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white font-mono mt-1">
                    {currentEffect.name}
                  </h3>
                </div>

                <div className="text-xs text-slate-400 font-mono bg-surface-container px-3 py-1.5 rounded-full">
                  {t.simulator.runtime}
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {currentEffect.description}
              </p>

              {/* Kotlin Signature */}
              <div className="space-y-1">
                <span className="text-xs font-mono text-slate-400">Firma Kotlin:</span>
                <div className="p-3 rounded-xl bg-surface-lowest text-xs font-mono text-sky-300 overflow-x-auto leading-relaxed">
                  {currentEffect.kotlinSignature}
                </div>
              </div>

              {/* Parameters Breakdown */}
              {currentEffect.parameters.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-300">
                    {t.simulator.parametersTitle}
                  </span>
                  <div className="rounded-xl bg-surface-lowest overflow-hidden text-xs">
                    {currentEffect.parameters.map((param) => (
                      <div key={param.name} className="p-3 flex flex-col sm:flex-row sm:items-start gap-2">
                        <div className="w-32 shrink-0">
                          <code className="text-emerald-400 font-mono font-bold">
                            {param.name}
                          </code>
                          <span className="block text-[10px] text-slate-500 font-mono">
                            {param.type}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-normal flex-1">
                          {param.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Code Snippets Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">
                    {t.simulator.codeTitle}
                  </span>
                </div>

                {/* Snippet Tabs */}
                {currentEffect.snippets.length > 1 && (
                  <div className="flex items-center gap-1 bg-surface-high/60 p-0.5 rounded-full text-xs">
                    {currentEffect.snippets.map((snip, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSnippetIndex(idx)}
                        className={`px-2.5 py-1 rounded text-xs transition-colors ${
                          selectedSnippetIndex === idx
                            ? 'bg-slate-800 text-white font-medium'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {t.simulator.exampleLabel} {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {currentEffect.snippets[selectedSnippetIndex] && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">
                    {currentEffect.snippets[selectedSnippetIndex].description}
                  </p>
                  <CodeViewer
                    title={currentEffect.snippets[selectedSnippetIndex].title}
                    code={currentEffect.snippets[selectedSnippetIndex].code}
                  />
                </div>
              )}
            </div>

            {/* Do's & Don'ts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* When to use */}
              <div className="bg-surface-low p-5 rounded-3xl bg-gradient-to-b from-emerald-950/25 to-transparent space-y-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                    {t.simulator.whenToUseTitle}
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {currentEffect.whenToUse.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-500 font-bold shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pitfalls */}
              <div className="bg-surface-low p-5 rounded-3xl bg-gradient-to-b from-rose-950/20 to-transparent space-y-3">
                <div className="flex items-center gap-2 text-rose-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                    {t.simulator.pitfallsTitle}
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  {currentEffect.commonPitfalls.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-rose-500 font-bold shrink-0">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Jetpack Compose Lifecycle Interactive Diagram */}
        <section id="lifecycle" className="pt-16">
          <LifecycleDiagram onSelectEffect={handleSelectEffect} />
        </section>

        {/* Side-Effects Master Comparison Table */}
        <section id="matrix" className="pt-16 space-y-6">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
              {t.matrix.kicker}
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              {t.matrix.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.matrix.subtitle}
            </p>
          </div>

          <div className="rounded-3xl bg-surface-low overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080d19] border-b border-slate-800 text-slate-400 font-mono">
                  <tr>
                    <th className="py-3 px-4">{t.matrix.colEffect}</th>
                    <th className="py-3 px-4">{t.matrix.colCoroutines}</th>
                    <th className="py-3 px-4">{t.matrix.colCleanup}</th>
                    <th className="py-3 px-4">{t.matrix.colTrigger}</th>
                    <th className="py-3 px-4">{t.matrix.colPurpose}</th>
                    <th className="py-3 px-4 text-right">{t.matrix.colAction}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-sans">
                  {sideEffects.map((eff) => (
                    <tr
                      key={eff.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        eff.id === selectedEffectId ? 'bg-slate-800/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-white whitespace-nowrap">
                        {eff.name}
                      </td>
                      <td className="py-3 px-4">
                        {eff.category === 'coroutines' || eff.id === 'produce-state' ? (
                          <span className="text-emerald-400 font-mono">{t.matrix.yesSuspend}</span>
                        ) : (
                          <span className="text-slate-500 font-mono">{t.matrix.noSync}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {eff.id === 'disposable-effect' ? (
                          <span className="text-amber-400 font-mono font-semibold">onDispose &#123; ... &#125;</span>
                        ) : (
                          <span className="text-slate-500 font-mono">{t.matrix.automaticOrNA}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {eff.id === 'remember-coroutine-scope'
                          ? language === 'en'
                            ? 'UI Events (onClick, gestures)'
                            : language === 'pt'
                            ? 'Eventos UI (onClick, gestos)'
                            : 'Eventos UI (onClick, gestos)'
                          : eff.id === 'side-effect'
                          ? language === 'en'
                            ? 'Every successful recomposition'
                            : language === 'pt'
                            ? 'A cada recomposição concluída'
                            : 'Cada recomposición exitosa'
                          : eff.id === 'derived-state-of'
                          ? language === 'en'
                            ? 'Change in calculation output'
                            : language === 'pt'
                            ? 'Mudança no resultado calculado'
                            : 'Cambio en resultado del cálculo'
                          : language === 'en'
                          ? 'Initial composition or key changes'
                          : language === 'pt'
                          ? 'Composição inicial ou mudança de keys'
                          : 'Composición inicial o cambio de keys'}
                      </td>
                      <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                        {eff.summary}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            handleSelectEffect(eff.id);
                            scrollToSection('catalog');
                          }}
                          className="px-3 py-1 rounded-full bg-surface-highest hover:bg-surface-high text-on-surface transition-colors text-[11px] font-mono"
                        >
                          {t.matrix.viewInLab}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Buenas Prácticas y Reglas de Oro */}
        <section id="pitfalls" className="pt-16 pb-24 space-y-8">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
              {t.pitfallsSection.kicker}
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              {t.pitfallsSection.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.pitfallsSection.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-surface-low space-y-3">
              <span className="text-xs font-mono text-emerald-400 font-bold">1</span>
              <h4 className="text-sm font-bold text-white">
                {t.pitfallsSection.rules.rule1Title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.pitfallsSection.rules.rule1Desc}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface-low space-y-3">
              <span className="text-xs font-mono text-emerald-400 font-bold">2</span>
              <h4 className="text-sm font-bold text-white">
                {t.pitfallsSection.rules.rule2Title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.pitfallsSection.rules.rule2Desc}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface-low space-y-3">
              <span className="text-xs font-mono text-emerald-400 font-bold">3</span>
              <h4 className="text-sm font-bold text-white">
                {t.pitfallsSection.rules.rule3Title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.pitfallsSection.rules.rule3Desc}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-surface-low space-y-3">
              <span className="text-xs font-mono text-emerald-400 font-bold">4</span>
              <h4 className="text-sm font-bold text-white">
                {t.pitfallsSection.rules.rule4Title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.pitfallsSection.rules.rule4Desc}
              </p>
            </div>
          </div>
        </section>
      </main>
      </>
      )}

      {/* Footer */}
      <footer className="bg-surface-low py-10 px-6 text-center text-xs text-on-surface-variant">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{t.footer.copy}</p>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsDecisionModalOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              {t.footer.assistantLink}
            </button>
            <button
              onClick={() => scrollToSection('lifecycle')}
              className="hover:text-emerald-400 transition-colors"
            >
              {t.footer.diagramLink}
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Decision Wizard Modal */}
      <DecisionTreeModal
        isOpen={isDecisionModalOpen}
        onClose={() => setIsDecisionModalOpen(false)}
        onSelectEffect={(id) => {
          handleSelectEffect(id);
          scrollToSection('catalog');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
