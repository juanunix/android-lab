import React from 'react';
import { HelpCircle, Globe, Layers, Cpu, Code2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n/types';

export type ActiveLab = 'side_effects' | 'mvi';

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

  return (
    <header className="flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-[#0a0f1d]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigateSection('hero');
          }}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap hover:text-emerald-400 transition-colors"
        >
          Compose & MVI Lab
        </a>

        {/* Lab Switcher Toggle */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => onSelectLab('side_effects')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeLab === 'side_effects'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Side-Effects</span>
          </button>
          <button
            onClick={() => onSelectLab('mvi')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeLab === 'mvi'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Arquitectura MVI</span>
            <span className="sm:hidden">MVI</span>
          </button>
        </div>
      </div>

      {/* Zone 2: Contextual nav links */}
      <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-slate-300">
        {activeLab === 'side_effects' ? (
          <>
            <button
              onClick={() => onNavigateSection('catalog')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.effects}
            </button>
            <button
              onClick={() => onNavigateSection('lifecycle')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.lifecycle}
            </button>
            <button
              onClick={() => onNavigateSection('matrix')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.matrix}
            </button>
            <button
              onClick={() => onNavigateSection('pitfalls')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.pitfalls}
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onNavigateSection('udf')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Ciclo UDF
            </button>
            <button
              onClick={() => onNavigateSection('simulator')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Simulador MVI
            </button>
            <button
              onClick={() => onNavigateSection('channel-vs-state')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Channel vs State
            </button>
            <button
              onClick={() => onNavigateSection('code-explorer')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Plantillas de Código
            </button>
            <button
              onClick={() => onNavigateSection('rules')}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              5 Reglas
            </button>
          </>
        )}
      </nav>

      {/* Zone 3: Language Switcher + Primary Action */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Language Switcher Selector */}
        <div className="flex items-center gap-0.5 p-1 bg-slate-900/90 rounded-lg border border-slate-800">
          <Globe className="w-3.5 h-3.5 text-slate-400 ml-1 mr-0.5 hidden sm:inline" />
          {languages.map((item) => (
            <button
              key={item.id}
              onClick={() => setLanguage(item.id)}
              className={`px-2 py-1 rounded text-xs font-mono font-medium transition-all ${
                language === item.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
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
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-emerald-500/20"
          >
            <HelpCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{t.nav.whichToUse}</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigateSection('generator')}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-emerald-500/20"
          >
            <Code2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Generar MVI</span>
          </button>
        )}
      </div>
    </header>
  );
};

