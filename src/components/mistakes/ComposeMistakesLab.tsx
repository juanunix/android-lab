import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Lightbulb,
  Search,
  ShieldAlert,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { COMPOSE_MISTAKES, MISTAKE_CATEGORIES } from '../../data/composeMistakes';
import { MistakeCategory } from '../../types/mistakes';
import { useLanguage } from '../../context/LanguageContext';
import { CodeViewer } from '../CodeViewer';

const UI = {
  es: {
    kicker: 'Jetpack Compose · Buenas Prácticas',
    title: '20 cosas que NUNCA deberías hacer en Jetpack Compose',
    subtitle:
      'Una guía interactiva de los errores más comunes al construir UI con Compose. Cada tarjeta compara el código problemático con la solución recomendada.',
    byline: 'Basado en la guía de Philipp Lackner (PL Coding)',
    start: 'Ver los 20 errores',
    about: 'Sobre esta colección',
    filtersTitle: 'Filtrar por categoría',
    results: 'errores visibles',
    searchPlaceholder: 'Buscar error, tema o código...',
    all: 'Todas',
    expandAll: 'Expandir todo',
    collapseAll: 'Contraer todo',
    bad: 'Incorrecto',
    good: 'Correcto',
    why: 'Por qué es un problema',
    fix: 'Cómo corregirlo',
    empty: 'No hay errores que coincidan con tu búsqueda.',
    sourceTitle: 'Sobre esta colección',
    sourceBody:
      'Esta sección recopila los 20 errores más comunes al trabajar con Jetpack Compose. Úsala como checklist antes de dar por terminada una pantalla: composición, estado, listas, rendimiento, arquitectura, ciclo de vida y accesibilidad.',
    footerNote:
      'Cada ejemplo se centra únicamente en el error mostrado; un proyecto real puede requerir otros ajustes.',
    sourceLink: 'Ver el curso original',
  },
  pt: {
    kicker: 'Jetpack Compose · Boas Práticas',
    title: '20 coisas que você NUNCA deve fazer no Jetpack Compose',
    subtitle:
      'Um guia interativo dos erros mais comuns ao construir UI com Compose. Cada card compara o código problemático com a solução recomendada.',
    byline: 'Baseado no guia de Philipp Lackner (PL Coding)',
    start: 'Ver os 20 erros',
    about: 'Sobre esta coleção',
    filtersTitle: 'Filtrar por categoria',
    results: 'erros visíveis',
    searchPlaceholder: 'Buscar erro, tema ou código...',
    all: 'Todas',
    expandAll: 'Expandir tudo',
    collapseAll: 'Recolher tudo',
    bad: 'Incorreto',
    good: 'Correto',
    why: 'Por que é um problema',
    fix: 'Como corrigir',
    empty: 'Nenhum erro corresponde à sua busca.',
    sourceTitle: 'Sobre esta coleção',
    sourceBody:
      'Esta seção reúne os 20 erros mais comuns ao trabalhar com Jetpack Compose. Use-a como checklist antes de considerar uma tela pronta: composição, estado, listas, desempenho, arquitetura, ciclo de vida e acessibilidade.',
    footerNote:
      'Cada exemplo foca apenas no erro mostrado; um projeto real pode precisar de outros ajustes.',
    sourceLink: 'Ver o curso original',
  },
  en: {
    kicker: 'Jetpack Compose · Best Practices',
    title: '20 things you should NEVER do in Jetpack Compose',
    subtitle:
      'An interactive checklist of the most common mistakes when building UI with Compose. Each card compares the problematic code with the recommended fix.',
    byline: 'Based on Philipp Lackner’s guide (PL Coding)',
    start: 'See the 20 mistakes',
    about: 'About this collection',
    filtersTitle: 'Filter by category',
    results: 'visible mistakes',
    searchPlaceholder: 'Search mistakes or code...',
    all: 'All',
    expandAll: 'Expand all',
    collapseAll: 'Collapse all',
    bad: 'Incorrect',
    good: 'Correct',
    why: 'Why it is a problem',
    fix: 'How to fix it',
    empty: 'No mistakes match your search.',
    sourceTitle: 'About this collection',
    sourceBody:
      'This section collects the 20 most common Compose mistakes. Use it as a checklist before shipping a screen: composition, state, lists, performance, architecture, lifecycle, and accessibility.',
    footerNote:
      'Each snippet focuses only on the mistake shown; production code may need additional changes.',
    sourceLink: 'View the original course',
  },
} as const;

export const ComposeMistakesLab: React.FC = () => {
  const { language } = useLanguage();
  const t = UI[language];
  const [category, setCategory] = useState<MistakeCategory | 'all'>('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set<string>());

  const filteredMistakes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return COMPOSE_MISTAKES.filter((mistake) => {
      const matchesCategory = category === 'all' || mistake.category === category;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;
      const haystack = [
        mistake.title.es,
        mistake.title.pt,
        mistake.title.en,
        mistake.why[language],
        mistake.fix[language],
        mistake.badCode,
        mistake.goodCode,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [category, query, language]);

  const allFilteredExpanded =
    filteredMistakes.length > 0 && filteredMistakes.every((mistake) => expanded.has(mistake.id));

  const toggleMistake = (id: string) => {
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (allFilteredExpanded) {
      setExpanded(new Set());
      return;
    }
    setExpanded(new Set(filteredMistakes.map((mistake) => mistake.id)));
  };

  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-b from-[#0f172a] via-[#0a0f1d] to-[#070b14] border-b border-slate-800/80 -mx-4 sm:-mx-6 px-4 sm:px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-5">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>{t.kicker}</span>
          </div>

          <h2
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-white max-w-4xl"
            style={{ textWrap: 'balance' }}
          >
            {t.title}
          </h2>

          <p className="text-base text-slate-300 leading-relaxed max-w-3xl">{t.subtitle}</p>

          <p className="text-xs text-slate-500 font-mono">{t.byline}</p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="#mistakes-list"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              {t.start}
            </a>
            <a
              href="#mistakes-source"
              className="px-5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm border border-slate-700 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>{t.about}</span>
            </a>
          </div>
        </div>
      </section>

      <section id="mistakes-toolbar" className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
              Jetpack Compose Checklist
            </span>
            <h3 className="text-2xl font-bold text-white mt-0.5">{t.filtersTitle}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {filteredMistakes.length} {t.results}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <label className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full sm:w-64 pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/70"
              />
            </label>

            <button
              onClick={toggleAll}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors whitespace-nowrap"
            >
              {allFilteredExpanded ? t.collapseAll : t.expandAll}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
              category === 'all'
                ? 'bg-slate-800 text-white border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.all} ({COMPOSE_MISTAKES.length})
          </button>
          {MISTAKE_CATEGORIES.map((item) => {
            const count = COMPOSE_MISTAKES.filter((mistake) => mistake.category === item.id).length;
            return (
              <button
                key={item.id}
                onClick={() => setCategory(item.id)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                  category === item.id
                    ? 'bg-slate-800 text-white border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label[language]} ({count})
              </button>
            );
          })}
        </div>
      </section>

      <section id="mistakes-list" className="space-y-3 pb-4">
        {filteredMistakes.length === 0 && (
          <div className="p-8 rounded-2xl border border-slate-800 bg-[#0b1120] text-center space-y-2">
            <ShieldAlert className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm text-slate-300">{t.empty}</p>
          </div>
        )}

        {filteredMistakes.map((mistake) => {
          const isExpanded = expanded.has(mistake.id);
          const categoryInfo = MISTAKE_CATEGORIES.find((item) => item.id === mistake.category);
          return (
            <article
              key={mistake.id}
              className={`rounded-2xl border bg-[#0b1120] overflow-hidden transition-colors ${
                isExpanded ? 'border-slate-700' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => toggleMistake(mistake.id)}
                className="w-full text-left p-4 sm:p-5 flex items-start gap-4"
                aria-expanded={isExpanded}
              >
                <span className="w-9 h-9 shrink-0 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-sm font-bold flex items-center justify-center">
                  {String(mistake.number).padStart(2, '0')}
                </span>

                <span className="flex-1 min-w-0 space-y-1.5">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-white leading-snug">
                      {mistake.title[language]}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/50 border border-emerald-900/70 rounded px-1.5 py-0.5">
                      {categoryInfo?.label[language]}
                    </span>
                  </span>
                  <span className="block text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {mistake.why[language]}
                  </span>
                </span>

                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-slate-500 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 space-y-4 border-t border-slate-800/80 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/50 space-y-1">
                      <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-mono font-bold uppercase tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{t.why}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{mistake.why[language]}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/50 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-mono font-bold uppercase tracking-wider">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>{t.fix}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{mistake.fix[language]}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                        <XCircle className="w-4 h-4" />
                        <span>{t.bad}</span>
                      </div>
                      <CodeViewer title="Bad.kt" code={mistake.badCode} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t.good}</span>
                      </div>
                      <CodeViewer title="Good.kt" code={mistake.goodCode} />
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </section>

      <section
        id="mistakes-source"
        className="pb-8 p-5 sm:p-6 rounded-2xl bg-[#0b1120] border border-slate-800 space-y-3"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">{t.sourceTitle}</h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">{t.sourceBody}</p>
        <p className="text-xs text-slate-500 leading-relaxed">{t.footerNote}</p>
        <a
          href="https://pl-coding.com/premium-courses"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>{t.sourceLink}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </section>
    </div>
  );
};
