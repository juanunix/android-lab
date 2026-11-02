import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Lock,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSkillAuth } from '../../context/SkillAuthContext';
import { SKILLS, getSkill } from '../../data/skills';
import { SkillId } from '../../types/skills';
import { SkillsLogin } from './SkillsLogin';
import { SKILL_COMPONENTS } from './registry';
import { ProgressBadge, SkillSection } from './shared/primitives';

const PROGRESS_KEY = 'compose_lab_skills_visited';

const readVisited = (): SkillId[] => {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((entry): entry is SkillId =>
        SKILLS.some((skill) => skill.id === entry)
      );
    }
  } catch {
    // Ignore
  }
  return [];
};

const SkillPlaceholder: React.FC<{ skillId: SkillId }> = ({ skillId }) => {
  const { language } = useLanguage();
  const skill = getSkill(skillId);
  if (!skill) return null;
  const labels = {
    es: {
      soon: 'Laboratorio interactivo en construcción',
      body: 'Esta sección se implementará en su propia branch con simuladores, ejemplos de código, quiz y checklist.',
      topics: 'Temas de la skill',
    },
    pt: {
      soon: 'Laboratório interativo em construção',
      body: 'Esta seção será implementada em sua própria branch com simuladores, exemplos de código, quiz e checklist.',
      topics: 'Tópicos da skill',
    },
    en: {
      soon: 'Interactive lab under construction',
      body: 'This section will be implemented in its own branch with simulators, code examples, quiz, and checklist.',
      topics: 'Skill topics',
    },
  }[language];

  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 rounded-2xl bg-surface-low space-y-3">
        <span className="text-xs font-mono text-brand uppercase font-semibold">
          {skill.category}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-on-surface">
          {skill.title[language]}
        </h2>
        <p className="text-sm text-on-surface-variant max-w-3xl leading-relaxed">
          {skill.summary[language]}
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-gradient-to-b from-brand/10 to-transparent text-center space-y-3">
        <Sparkles className="w-6 h-6 text-brand mx-auto" />
        <h3 className="text-lg font-bold text-on-surface">{labels.soon}</h3>
        <p className="text-xs text-on-surface-variant max-w-lg mx-auto">{labels.body}</p>
      </div>
    </div>
  );
};

export const SkillsLab: React.FC = () => {
  const { language } = useLanguage();
  const { isAuthenticated, logout } = useSkillAuth();
  const [activeSkillId, setActiveSkillId] = useState<SkillId>(() => {
    const hash = window.location.hash.replace('#skills/', '');
    return SKILLS.some((skill) => skill.id === hash) ? (hash as SkillId) : SKILLS[0].id;
  });
  const [visited, setVisited] = useState<SkillId[]>(readVisited);

  const t = {
    es: {
      kicker: 'Marky Skills · Aprendizaje interactivo',
      title: 'Domina la arquitectura de apps KMP',
      subtitle:
        'Nueve laboratorios interactivos basados en las skills de Marky para construir apps Kotlin Multiplatform listas para producción.',
      private: 'Área privada',
      progress: 'Progreso',
      logout: 'Cerrar sesión',
      catalog: 'Skills disponibles',
      source: 'Contenido adaptado de Marky Skills',
      sourceLink: 'Ver repositorio original',
      openSource: 'Abrir fuente',
    },
    pt: {
      kicker: 'Marky Skills · Aprendizado interativo',
      title: 'Domine a arquitetura de apps KMP',
      subtitle:
        'Nove laboratórios interativos baseados nas skills do Marky para construir apps Kotlin Multiplatform prontos para produção.',
      private: 'Área privada',
      progress: 'Progresso',
      logout: 'Sair',
      catalog: 'Skills disponíveis',
      source: 'Conteúdo adaptado do Marky Skills',
      sourceLink: 'Ver repositório original',
      openSource: 'Abrir fonte',
    },
    en: {
      kicker: 'Marky Skills · Interactive learning',
      title: 'Master KMP app architecture',
      subtitle:
        'Nine interactive labs based on Marky skills to build production-ready Kotlin Multiplatform apps.',
      private: 'Private area',
      progress: 'Progress',
      logout: 'Log out',
      catalog: 'Available skills',
      source: 'Content adapted from Marky Skills',
      sourceLink: 'View original repository',
      openSource: 'Open source',
    },
  }[language];

  useEffect(() => {
    if (!isAuthenticated) return;
    setVisited((previous) => {
      if (previous.includes(activeSkillId)) return previous;
      const next = [...previous, activeSkillId];
      try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
    window.history.replaceState(null, '', `#skills/${activeSkillId}`);
  }, [activeSkillId, isAuthenticated]);

  const activeSkill = useMemo(() => getSkill(activeSkillId), [activeSkillId]);
  const ActiveSection = SKILL_COMPONENTS[activeSkillId];

  if (!isAuthenticated) {
    return (
      <div className="space-y-8">
        <div id="skills-catalog" />
        <SkillsLogin />
        <section
          id="skills-source"
          className="p-6 rounded-2xl bg-surface-low flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2 text-xs text-on-surface-variant">
            <BookOpen className="w-4 h-4 text-brand" />
            <span>{t.source}</span>
          </div>
          <a
            href="https://github.com/philipplackner/Marky/tree/master/.claude/skills"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-container"
          >
            <span>{t.sourceLink}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="bg-gradient-to-b from-surface-high via-surface to-surface-lowest -mx-4 sm:-mx-6 px-4 sm:px-6 py-12 rounded-2xl">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-brand">
              <Lock className="w-4 h-4" />
              <span>{t.private}</span>
              <span className="text-on-surface-variant">·</span>
              <span>{t.kicker}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
                  {t.progress}
                </span>
                <ProgressBadge current={visited.length} total={SKILLS.length} />
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-high/70 hover:bg-surface-highest text-xs font-semibold text-on-surface transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.logout}</span>
              </button>
            </div>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-on-surface max-w-3xl">
            {t.title}
          </h2>
          <p className="text-sm text-on-surface-variant max-w-3xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <aside id="skills-catalog" className="lg:col-span-4 xl:col-span-3 space-y-3">
          <h3 className="ds-label text-on-surface-variant">{t.catalog}</h3>
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {SKILLS.map((skill, index) => {
              const Icon = skill.icon;
              const isActive = activeSkillId === skill.id;
              const isVisited = visited.includes(skill.id);
              return (
                <button
                  key={skill.id}
                  onClick={() => setActiveSkillId(skill.id)}
                  className={`min-w-[220px] lg:min-w-0 text-left p-3 rounded-2xl transition-all flex items-start gap-3 ${
                    isActive
                      ? 'bg-brand/10 text-on-surface'
                      : 'bg-surface-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-brand text-on-primary' : 'bg-surface-high text-brand'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="min-w-0 space-y-1">
                    <span className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-brand font-bold">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {isVisited && <CheckCircle2 className="w-3 h-3 text-brand" />}
                    </span>
                    <span className="block text-xs font-bold leading-snug">
                      {skill.title[language]}
                    </span>
                    <span className="block text-[10px] font-mono uppercase tracking-wider opacity-70">
                      {skill.category}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="lg:col-span-8 xl:col-span-9 space-y-8">
          {ActiveSection ? (
            <ActiveSection />
          ) : (
            activeSkill && <SkillPlaceholder skillId={activeSkill.id} />
          )}

          <SkillSection
            id="skills-source"
            eyebrow={t.source}
            title={t.source}
            description={activeSkill?.summary[language]}
          >
            <a
              href="https://github.com/philipplackner/Marky/tree/master/.claude/skills"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-container"
            >
              <span>{t.sourceLink}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </SkillSection>
        </main>
      </div>
    </div>
  );
};
