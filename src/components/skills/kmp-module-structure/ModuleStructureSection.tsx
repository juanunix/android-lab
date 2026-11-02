import React, { useState } from 'react';
import { ArrowRight, Boxes, Layers, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  Callout,
  Checklist,
  CodeCompare,
  ConceptCard,
  Quiz,
  SkillSection,
  StepFlow,
} from '../shared/primitives';

type ModuleType = 'app' | 'feature' | 'core';

interface ModuleNode {
  id: string;
  type: ModuleType;
  name: string;
}

const MODULES: ModuleType[] = ['app', 'feature', 'core'];

const MODULE_NAMES: Record<ModuleType, string> = {
  app: 'composeApp',
  feature: 'feature:notes',
  core: 'core:domain',
};

const isAllowed = (source: ModuleType, target: ModuleType) => {
  if (source === 'app') return true;
  if (source === 'feature') return target === 'core';
  if (source === 'core') return target === 'core';
  return false;
};

export const ModuleStructureSection: React.FC = () => {
  const { language } = useLanguage();
  const t = {
    es: {
      kicker: 'Arquitectura · Gradle 9',
      stepsTitle: 'Flujo de dependencias',
      dependencyTitle: 'Comprobador de dependencias',
      appCard: 'composeApp ensambla features, navegación y DI. No contiene lógica de negocio.',
      featureCard: 'Cada feature agrupa UI, ViewModel y contratos de dominio.',
      title: 'Constructor de módulos KMP',
      subtitle:
        'Elige un origen y un destino para comprobar si la dependencia respeta la arquitectura: app → feature → core.',
      source: 'Módulo origen',
      target: 'Módulo destino',
      check: 'Comprobar dependencia',
      allowed: 'Dependencia permitida',
      forbidden: 'Dependencia prohibida',
      allowedReason:
        'La dirección respeta la jerarquía. Las features solo conocen core, y la app conoce features y core.',
      forbiddenReason:
        'Una feature no debe depender de otra feature. Comunica features mediante callbacks en composeApp.',
      pluginTitle: 'Convention plugin por tipo de módulo',
      pluginHint: 'Selecciona un módulo para ver los plugins que debe aplicar.',
      steps: [
        { title: 'app', description: 'Solo ensambla features y core; no contiene lógica de negocio.' },
        { title: 'feature', description: 'UI + ViewModel + contratos de dominio de una funcionalidad.' },
        { title: 'core', description: 'Tipos compartidos, red, base de datos y utilidades estables.' },
        { title: 'build-logic', description: 'Convention plugins y version catalog compartidos.' },
      ],
      ruleTitle: 'Regla de oro',
      ruleBody:
        'Una feature nunca depende de otra feature. La navegación entre features se resuelve en composeApp mediante callbacks.',
      codeTitle: 'Aplicar el plugin correcto',
      codeBad: `// INCORRECTO: lógica de aplicación en un módulo feature
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.multiplatform)
}`,
      codeGood: `// CORRECTO: un módulo feature usa el plugin cmp.feature
plugins {
    alias(libs.plugins.cmp.feature)
}

kotlin {
    // ViewModel + Compose UI en commonMain
}`,
      quiz:
        '¿Qué plugin debe aplicar un módulo feature de Compose Multiplatform?',
      quizOptions: ['android.application', 'kmp.library', 'cmp.feature', 'room'],
      quizAnswer: 2,
      quizExplanation:
        'cmp.feature aplica KMP, Compose Multiplatform, ViewModel, navegación y serialización en commonMain.',
      checklistTitle: 'Checklist: añadir un feature',
      checklist: [
        'Elegir el nombre del módulo feature:<nombre>',
        'Aplicar cmp.feature y no android.application',
        'Definir rutas @Serializable en presentation',
        'Exponer un callback de navegación hacia composeApp',
        'Añadir tests en commonTest',
      ],
    },
    pt: {
      kicker: 'Arquitetura · Gradle 9',
      stepsTitle: 'Fluxo de dependências',
      dependencyTitle: 'Verificador de dependências',
      appCard: 'composeApp monta features, navegação e DI. Não contém lógica de negócio.',
      featureCard: 'Cada feature agrupa UI, ViewModel e contratos de domínio.',
      title: 'Construtor de módulos KMP',
      subtitle:
        'Escolha uma origem e um destino para verificar se a dependência respeita a arquitetura: app → feature → core.',
      source: 'Módulo de origem',
      target: 'Módulo de destino',
      check: 'Verificar dependência',
      allowed: 'Dependência permitida',
      forbidden: 'Dependência proibida',
      allowedReason:
        'A direção respeita a hierarquia. Features conhecem apenas core, e o app conhece features e core.',
      forbiddenReason:
        'Uma feature não deve depender de outra feature. Comunique features por callbacks no composeApp.',
      pluginTitle: 'Convention plugin por tipo de módulo',
      pluginHint: 'Selecione um módulo para ver os plugins que ele deve aplicar.',
      steps: [
        { title: 'app', description: 'Apenas monta features e core; não contém lógica de negócio.' },
        { title: 'feature', description: 'UI + ViewModel + contratos de domínio de uma funcionalidade.' },
        { title: 'core', description: 'Tipos compartilhados, rede, banco de dados e utilitários estáveis.' },
        { title: 'build-logic', description: 'Convention plugins e version catalog compartilhados.' },
      ],
      ruleTitle: 'Regra de ouro',
      ruleBody:
        'Uma feature nunca depende de outra feature. A navegação entre features é resolvida no composeApp por callbacks.',
      codeTitle: 'Aplicar o plugin correto',
      codeBad: `// ERRADO: lógica de aplicação em um módulo feature
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.multiplatform)
}`,
      codeGood: `// CORRETO: um módulo feature usa o plugin cmp.feature
plugins {
    alias(libs.plugins.cmp.feature)
}

kotlin {
    // ViewModel + Compose UI em commonMain
}`,
      quiz: 'Qual plugin um módulo feature de Compose Multiplatform deve aplicar?',
      quizOptions: ['android.application', 'kmp.library', 'cmp.feature', 'room'],
      quizAnswer: 2,
      quizExplanation:
        'cmp.feature aplica KMP, Compose Multiplatform, ViewModel, navegação e serialização em commonMain.',
      checklistTitle: 'Checklist: adicionar um feature',
      checklist: [
        'Escolher o nome do módulo feature:<nome>',
        'Aplicar cmp.feature e não android.application',
        'Definir rotas @Serializable em presentation',
        'Expor um callback de navegação para o composeApp',
        'Adicionar testes em commonTest',
      ],
    },
    en: {
      kicker: 'Architecture · Gradle 9',
      stepsTitle: 'Dependency flow',
      dependencyTitle: 'Dependency checker',
      appCard: 'composeApp assembles features, navigation, and DI. It holds no business logic.',
      featureCard: 'Each feature groups UI, ViewModel, and domain contracts.',
      title: 'KMP module builder',
      subtitle:
        'Pick a source and target module to check whether the dependency respects the architecture: app → feature → core.',
      source: 'Source module',
      target: 'Target module',
      check: 'Check dependency',
      allowed: 'Allowed dependency',
      forbidden: 'Forbidden dependency',
      allowedReason:
        'The direction respects the hierarchy. Features only know core, and the app knows features and core.',
      forbiddenReason:
        'A feature must not depend on another feature. Connect features through callbacks in composeApp.',
      pluginTitle: 'Convention plugin per module type',
      pluginHint: 'Select a module to see which plugins it should apply.',
      steps: [
        { title: 'app', description: 'Only assembles features and core; no business logic.' },
        { title: 'feature', description: 'UI + ViewModel + domain contracts for one feature.' },
        { title: 'core', description: 'Shared types, network, database, and stable utilities.' },
        { title: 'build-logic', description: 'Shared convention plugins and version catalog.' },
      ],
      ruleTitle: 'Golden rule',
      ruleBody:
        'A feature never depends on another feature. Cross-feature navigation is resolved in composeApp with callbacks.',
      codeTitle: 'Apply the right plugin',
      codeBad: `// WRONG: application logic inside a feature module
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.multiplatform)
}`,
      codeGood: `// CORRECT: a feature module uses the cmp.feature plugin
plugins {
    alias(libs.plugins.cmp.feature)
}

kotlin {
    // ViewModel + Compose UI in commonMain
}`,
      quiz: 'Which plugin should a Compose Multiplatform feature module apply?',
      quizOptions: ['android.application', 'kmp.library', 'cmp.feature', 'room'],
      quizAnswer: 2,
      quizExplanation:
        'cmp.feature applies KMP, Compose Multiplatform, ViewModel, navigation, and serialization in commonMain.',
      checklistTitle: 'Checklist: add a feature',
      checklist: [
        'Choose the feature module name: feature:<name>',
        'Apply cmp.feature, not android.application',
        'Define @Serializable routes in presentation',
        'Expose a navigation callback to composeApp',
        'Add tests in commonTest',
      ],
    },
  }[language];

  const [source, setSource] = useState<ModuleType>('app');
  const [target, setTarget] = useState<ModuleType>('feature');
  const [result, setResult] = useState<boolean | null>(null);
  const [pluginModule, setPluginModule] = useState<ModuleType>('feature');

  const pluginCode: Record<ModuleType, string> = {
    app: `plugins {
    alias(libs.plugins.cmp.application)
}`,
    feature: `plugins {
    alias(libs.plugins.cmp.feature)
}`,
    core: `plugins {
    alias(libs.plugins.kmp.library)
}`,
  };

  return (
    <div className="space-y-10">
      <div className="p-6 sm:p-8 rounded-2xl bg-surface-low space-y-3">
        <span className="text-xs font-mono text-brand uppercase font-semibold">{t.kicker}</span>
        <h2 className="text-3xl md:text-4xl font-bold text-on-surface">{t.title}</h2>
        <p className="text-sm text-on-surface-variant max-w-3xl leading-relaxed">{t.subtitle}</p>
      </div>

      <SkillSection title={t.stepsTitle}>
        <StepFlow steps={t.steps} />
      </SkillSection>

      <SkillSection title={t.pluginTitle} description={t.pluginHint}>
        <div className="rounded-2xl bg-surface-low p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {MODULES.map((moduleType) => (
              <button
                key={moduleType}
                onClick={() => setPluginModule(moduleType)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
                  pluginModule === moduleType
                    ? 'bg-brand text-on-primary'
                    : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {MODULE_NAMES[moduleType]}
              </button>
            ))}
          </div>
          <pre className="code-surface p-4 rounded-xl bg-surface-lowest text-xs text-sky-300 overflow-x-auto">
            {pluginCode[pluginModule]}
          </pre>
        </div>
      </SkillSection>

      <SkillSection title={t.dependencyTitle}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-surface-low space-y-3">
            <p className="ds-label text-on-surface-variant">{t.source}</p>
            <div className="flex flex-wrap gap-2">
              {MODULES.map((moduleType) => (
                <button
                  key={moduleType}
                  onClick={() => {
                    setSource(moduleType);
                    setResult(null);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono ${
                    source === moduleType
                      ? 'bg-brand text-on-primary'
                      : 'bg-surface-high text-on-surface-variant'
                  }`}
                >
                  {MODULE_NAMES[moduleType]}
                </button>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-surface-low space-y-3">
            <p className="ds-label text-on-surface-variant">{t.target}</p>
            <div className="flex flex-wrap gap-2">
              {MODULES.map((moduleType) => (
                <button
                  key={moduleType}
                  onClick={() => {
                    setTarget(moduleType);
                    setResult(null);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono ${
                    target === moduleType
                      ? 'bg-brand text-on-primary'
                      : 'bg-surface-high text-on-surface-variant'
                  }`}
                >
                  {MODULE_NAMES[moduleType]}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setResult(isAllowed(source, target))}
            className="px-5 py-2 bg-brand text-on-brand rounded-full text-xs font-bold"
          >
            {t.check}
          </button>
          <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant">
            <span>{MODULE_NAMES[source]}</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand" />
            <span>{MODULE_NAMES[target]}</span>
          </div>
        </div>
        {result !== null && (
          <Callout tone={result ? 'brand' : 'danger'} title={result ? t.allowed : t.forbidden}>
            {result ? t.allowedReason : t.forbiddenReason}
          </Callout>
        )}
      </SkillSection>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ConceptCard icon={Layers} title="app">
          {t.appCard}
        </ConceptCard>
        <ConceptCard icon={Boxes} title="feature">
          {t.featureCard}
        </ConceptCard>
        <ConceptCard icon={ShieldAlert} title={t.ruleTitle} tone="warning">
          {t.ruleBody}
        </ConceptCard>
      </div>

      <SkillSection title={t.codeTitle}>
        <CodeCompare title={t.codeTitle} badCode={t.codeBad} goodCode={t.codeGood} />
      </SkillSection>

      <Quiz
        question={t.quiz}
        options={t.quizOptions}
        correctIndex={t.quizAnswer}
        explanation={t.quizExplanation}
      />

      <Checklist title={t.checklistTitle} items={t.checklist} />
    </div>
  );
};
