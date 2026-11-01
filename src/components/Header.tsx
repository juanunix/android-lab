import React from 'react';
import { HelpCircle, Globe, Layers, Cpu, Code2, AlertTriangle, Sparkles, Palette } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useDesignSystem } from '../context/ThemeContext';
import { Language } from '../i18n/types';
import { APP_VERSION_LABEL } from '../config/version';
import { SITE_NAME } from '../config/site';

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
  const { designSystem, toggleDesignSystem } = useDesignSystem();

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

  const headerLabels = {
    es: {
      mviTab: 'Arquitectura MVI',
      udf: 'Ciclo UDF',
      simulator: 'Simulador MVI',
      channel: 'Channel vs State',
      code: 'Plantillas de Código',
      rules: '5 Reglas',
      generate: 'Generar MVI',
      languagePrefix: 'Cambiar idioma a',
      themeToggle: 'Cambiar design system',
    },
    pt: {
      mviTab: 'Arquitetura MVI',
      udf: 'Ciclo UDF',
      simulator: 'Simulador MVI',
      channel: 'Channel vs State',
      code: 'Modelos de Código',
      rules: '5 Regras',
      generate: 'Gerar MVI',
      languagePrefix: 'Trocar idioma para',
      themeToggle: 'Trocar design system',
    },
    en: {
      mviTab: 'MVI Architecture',
      udf: 'UDF Cycle',
      simulator: 'MVI Simulator',
      channel: 'Channel vs State',
      code: 'Code Templates',
      rules: '5 Rules',
      generate: 'Generate MVI',
      languagePrefix: 'Switch language to',
      themeToggle: 'Switch design system',
    },
  }[language];

  return (
    <header className="site-header flex flex-wrap items-center justify-between gap-x-4 gap-y-2 sm:gap-x-8 px-4 sm:px-6 py-4 bg-surface/80 backdrop-blur-2xl sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigateSection('hero');
          }}
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-on-surface whitespace-nowrap hover:text-brand transition-colors"
        >
          <span>{SITE_NAME}</span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-mono font-semibold tracking-wider text-brand">
            {APP_VERSION_LABEL}
          </span>
        </a>

        {/* Lab Switcher Toggle */}
        <div className="flex items-center gap-1 p-1 bg-surface-high/60 rounded-full text-xs">
          <button
            onClick={() => onSelectLab('side_effects')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeLab === 'side_effects'
                ? 'bg-brand text-on-brand shadow-[0_0_24px_rgba(0,241,94,0.2)]'
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
                ? 'bg-brand text-on-brand shadow-[0_0_24px_rgba(0,241,94,0.2)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{headerLabels.mviTab}</span>
            <span className="sm:hidden">MVI</span>
          </button>
          <button
            onClick={() => onSelectLab('mistakes')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeLab === 'mistakes'
                ? 'bg-brand text-on-brand shadow-[0_0_24px_rgba(0,241,94,0.2)]'
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
              className="hover:text-brand transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.effects}
            </button>
            <button
              onClick={() => onNavigateSection('lifecycle')}
              className="hover:text-brand transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.lifecycle}
            </button>
            <button
              onClick={() => onNavigateSection('matrix')}
              className="hover:text-brand transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.matrix}
            </button>
            <button
              onClick={() => onNavigateSection('pitfalls')}
              className="hover:text-brand transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.pitfalls}
            </button>
          </>
        ) : activeLab === 'mvi' ? (
          <>
            <button
              onClick={() => onNavigateSection('udf')}
              className="hover:text-brand transition-colors whitespace-nowrap shrink-0"
            >
              {headerLabels.udf}
            </button>
            <button
              onClick={() => onNavigateSection('simulator')}
              className="hover:text-brand transition-colors whitespace-nowrap shrink-0"
            >
              {headerLabels.simulator}
            </button>
            <button
              onClick={() => onNavigateSection('channel-vs-state')}
              className="hover:text-brand transition-colors whitespace-nowrap shrink-0"
            >
              {headerLabels.channel}
            </button>
            <button
              onClick={() => onNavigateSection('code-explorer')}
              className="hover:text-brand transition-colors whitespace-nowrap shrink-0"
            >
              {headerLabels.code}
            </button>
            <button
              onClick={() => onNavigateSection('rules')}
              className="hover:text-brand transition-colors whitespace-nowrap shrink-0"
            >
              {headerLabels.rules}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onNavigateSection('mistakes-list')}
              className="hover:text-brand transition-colors whitespace-nowrap shrink-0"
            >
              {mistakesLabels.navList}
            </button>
            <button
              onClick={() => onNavigateSection('mistakes-toolbar')}
              className="hover:text-brand transition-colors whitespace-nowrap shrink-0"
            >
              {mistakesLabels.navFilters}
            </button>
            <button
              onClick={() => onNavigateSection('mistakes-source')}
              className="hover:text-brand transition-colors whitespace-nowrap shrink-0"
            >
              {mistakesLabels.navSource}
            </button>
          </>
        )}
      </nav>

      {/* Zone 3: Language Switcher + Primary Action */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={toggleDesignSystem}
          title={headerLabels.themeToggle}
          aria-label={headerLabels.themeToggle}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-surface-high/70 hover:bg-surface-highest text-xs font-semibold text-on-surface transition-colors"
        >
          <Palette className="w-3.5 h-3.5 text-brand" />
          <span className="hidden lg:inline">{designSystem === 'sidi' ? 'SiDi' : 'Monolith'}</span>
        </button>

        {/* Language Switcher Selector */}
        <div className="flex items-center gap-0.5 p-1 bg-surface-high/70 rounded-full">
          <Globe className="w-3.5 h-3.5 text-on-surface-variant ml-1 mr-0.5 hidden sm:inline" />
          {languages.map((item) => (
            <button
              key={item.id}
              onClick={() => setLanguage(item.id)}
              className={`px-2 py-1 rounded-full text-xs font-mono font-medium transition-all ${
                language === item.id
                  ? 'bg-brand/15 text-brand shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={`${headerLabels.languagePrefix} ${item.label}`}
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
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-on-primary bg-primary hover:bg-primary-container rounded-full transition-colors whitespace-nowrap shrink-0 shadow-[0_8px_24px_-8px_rgba(0,241,94,0.45)]"
          >
            <HelpCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{t.nav.whichToUse}</span>
          </button>
        ) : activeLab === 'mvi' ? (
          <button
            onClick={() => onNavigateSection('generator')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-on-primary bg-primary hover:bg-primary-container rounded-full transition-colors whitespace-nowrap shrink-0 shadow-[0_8px_24px_-8px_rgba(0,241,94,0.45)]"
          >
            <Code2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{headerLabels.generate}</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigateSection('mistakes-list')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-on-primary bg-primary hover:bg-primary-container rounded-full transition-colors whitespace-nowrap shrink-0 shadow-[0_8px_24px_-8px_rgba(0,241,94,0.45)]"
          >
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{mistakesLabels.cta}</span>
          </button>
        )}
      </div>
    </header>
  );
};

