import React from 'react';
import { HelpCircle, Globe, Layers, Cpu, Code2, AlertTriangle, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n/types';

export type ActiveLab = 'side_effects' | 'mvi' | 'mistakes';

interface HeaderProps {
  activeLab: ActiveLab;
  onSelectLab: (lab: ActiveLab) => void;
  onOpenDecisionTree: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeLab,
  onSelectLab,
  onOpenDecisionTree,
  onNavigateSection,
}) => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { id: Language; label: string; flag: string }[] = [
    { id: 'en', label: 'EN', flag: '🇺🇸' },
    { id: 'pt', label: 'PT', flag: '🇧🇷' },
    { id: 'es', label: 'ES', flag: '🇪🇸' },
  ];

  const mistakesLabels = {
    es: { navList: 'Los 20 Errores', navFilters: 'Filtros', navSource: 'Fuente', cta: 'Empezar' },
    pt: { navList: 'Os 20 Erros', navFilters: 'Filtros', navSource: 'Fonte', cta: 'Começar' },
    en: { navList: 'The 20 Mistakes', navFilters: 'Filters', navSource: 'Source', cta: 'Start' },
  }[language];

  return (
    <header className="flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-4 bg-surface/80 backdrop-blur-2xl sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigateSection('hero');
          }}
          className="font-display text-lg font-bold tracking-tight text-on-surface whitespace-nowrap hover:text-primary transition-colors"
        >
          Compose & MVI Lab
        </a>

        {/* Lab Switcher Toggle */}
        <div className="flex items-center gap-1 p-1 bg-surface-high/60 rounded-full text-xs">
          <button
            onClick={() => onSelectLab('side_effects')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeLab === 'side_effects'
                ? 'bg-primary text-on-primary shadow-[0_0_24px_rgba(65,239,107,0.22)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Side-Effects</span>
          </button>
          <button
            onClick={() => onSelectLab('mvi')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeLab === 'mvi'
                ? 'bg-primary text-on-primary shadow-[0_0_24px_rgba(65,239,107,0.22)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Arquitectura MVI</span>
            <span className="sm:hidden">MVI</span>
          </button>
          <button
            onClick={() => onSelectLab('mistakes')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeLab === 'mistakes'
                ? 'bg-primary text-on-primary shadow-[0_0_24px_rgba(65,239,107,0.22)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Top 20</span>
          </button>
        </div>
      </div>

      {/* Zone 2: Contextual nav links */}
      <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-on-surface-variant">
        {activeLab === 'side_effects' ? (
          <>
            <button
              onClick={() => onNavigateSection('catalog')}
              className="hover:text-primary transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.effects}
            </button>
            <button
              onClick={() => onNavigateSection('lifecycle')}
              className="hover:text-primary transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.lifecycle}
            </button>
            <button
              onClick={() => onNavigateSection('matrix')}
              className="hover:text-primary transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.matrix}
            </button>
            <button
              onClick={() => onNavigateSection('pitfalls')}
              className="hover:text-primary transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.pitfalls}
            </button>
          </>
        ) : activeLab === 'mvi' ? (
          <>
            <button
              onClick={() => onNavigateSection('udf')}
              className="hover:text-primary transition-colors whitespace-nowrap shrink-0"
            >
              Ciclo UDF
            </button>
            <button
              onClick={() => onNavigateSection('simulator')}
              className="hover:text-primary transition-colors whitespace-nowrap shrink-0"
            >
              Simulador MVI
            </button>
            <button
              onClick={() => onNavigateSection('channel-vs-state')}
              className="hover:text-primary transition-colors whitespace-nowrap shrink-0"
            >
              Channel vs State
            </button>
            <button
              onClick={() => onNavigateSection('code-explorer')}
              className="hover:text-primary transition-colors whitespace-nowrap shrink-0"
            >
              Plantillas de Código
            </button>
            <button
              onClick={() => onNavigateSection('rules')}
              className="hover:text-primary transition-colors whitespace-nowrap shrink-0"
            >
              5 Reglas
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onNavigateSection('mistakes-list')}
              className="hover:text-primary transition-colors whitespace-nowrap shrink-0"
            >
              {mistakesLabels.navList}
            </button>
            <button
              onClick={() => onNavigateSection('mistakes-toolbar')}
              className="hover:text-primary transition-colors whitespace-nowrap shrink-0"
            >
              {mistakesLabels.navFilters}
            </button>
            <button
              onClick={() => onNavigateSection('mistakes-source')}
              className="hover:text-primary transition-colors whitespace-nowrap shrink-0"
            >
              {mistakesLabels.navSource}
            </button>
          </>
        )}
      </nav>

      {/* Zone 3: Language Switcher + Primary Action */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Language Switcher Selector */}
        <div className="flex items-center gap-0.5 p-1 bg-surface-high/70 rounded-full">
          <Globe className="w-3.5 h-3.5 text-on-surface-variant ml-1 mr-0.5 hidden sm:inline" />
          {languages.map((item) => (
            <button
              key={item.id}
              onClick={() => setLanguage(item.id)}
              className={`px-2 py-1 rounded-full text-xs font-mono font-medium transition-all ${
                language === item.id
                  ? 'bg-primary/15 text-primary shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={`Trocar idioma para ${item.label}`}
            >
              <span className="mr-1 text-[11px]">{item.flag}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Primary Action Button */}
        {activeLab === 'side_effects' ? (
          <button
            onClick={onOpenDecisionTree}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-on-primary bg-primary hover:bg-primary-container rounded-full transition-colors whitespace-nowrap shrink-0 shadow-[0_8px_24px_-8px_rgba(65,239,107,0.5)]"
          >
            <HelpCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{t.nav.whichToUse}</span>
          </button>
        ) : activeLab === 'mvi' ? (
          <button
            onClick={() => onNavigateSection('generator')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-on-primary bg-primary hover:bg-primary-container rounded-full transition-colors whitespace-nowrap shrink-0 shadow-[0_8px_24px_-8px_rgba(65,239,107,0.5)]"
          >
            <Code2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Generar MVI</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigateSection('mistakes-list')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-on-primary bg-primary hover:bg-primary-container rounded-full transition-colors whitespace-nowrap shrink-0 shadow-[0_8px_24px_-8px_rgba(65,239,107,0.5)]"
          >
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{mistakesLabels.cta}</span>
          </button>
        )}
      </div>
    </header>
  );
};

