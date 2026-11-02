import React, { useState } from 'react';
import { Boxes, Cable, Layers, Plug, Smartphone, Sparkles } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  Callout,
  Checklist,
  CodeCompare,
  ConceptCard,
  PickerRow,
  Quiz,
  SimulatorFrame,
  SkillSection,
  StepFlow,
} from '../shared/primitives';

export const DiKoinSection: React.FC = () => {
  const { language } = useLanguage();
  const t = {
    es: {
      kicker: 'Arquitectura · Koin',
      title: 'Inyección de dependencias con Koin',
      subtitle:
        'Un módulo por capa, ensamblado en composeApp y koinViewModel() en los Root. Lo específico de plataforma va en módulos expect/actual.',
      flowTitle: 'Cómo se conecta todo',
      steps: [
        { title: 'Feature module', description: 'notesDataModule y notesPresentationModule en commonMain.' },
        { title: 'Platform module', description: 'expect/actual para Ktor engine, Room y DataStore.' },
        { title: 'initKoin', description: 'composeApp registra todos los módulos una sola vez.' },
        { title: 'koinViewModel', description: 'El Root inyecta el ViewModel; nunca se pasa hacia abajo.' },
      ],
      builderTitle: 'Constructor de módulos',
      builderDescription:
        'Elige una capa y revisa el módulo Koin que le corresponde.',
      modules: [
        {
          key: 'data',
          label: 'data',
          code: `val notesDataModule = module {
    singleOf(::RoomNoteRepository) { bind<NoteRepository>() }
}`,
        },
        {
          key: 'presentation',
          label: 'presentation',
          code: `val notesPresentationModule = module {
    viewModelOf(::NoteListViewModel)
    viewModelOf(::NoteDetailViewModel)
}`,
        },
        {
          key: 'core',
          label: 'core:data',
          code: `val coreDataModule = module {
    includes(coreDataPlatformModule)
    singleOf(::SessionPreferences)
    single { HttpClientFactory.create(get()) }
}`,
        },
        {
          key: 'platform',
          label: 'platform',
          code: `// commonMain
expect val coreDataPlatformModule: Module

// androidMain
actual val coreDataPlatformModule = module {
    single<HttpClientEngine> { OkHttp.create() }
}

// iosMain
actual val coreDataPlatformModule = module {
    single<HttpClientEngine> { Darwin.create() }
}`,
        },
      ],
      scopeTitle: 'Selector de scope',
      scopeDescription: 'Elige qué estás proveyendo y descubre la forma recomendada.',
      scopes: [
        {
          key: 'singleton',
          label: 'Repositorio',
          code: `singleOf(::RoomNoteRepository) { bind<NoteRepository>() }`,
          why: 'Una instancia para toda la app. La interfaz queda enlazada para que presentation no dependa de data.',
        },
        {
          key: 'viewmodel',
          label: 'ViewModel',
          code: `viewModelOf(::NoteListViewModel)`,
          why: 'Ciclo de vida del ViewModel. SavedStateHandle se resuelve automáticamente.',
        },
        {
          key: 'factory',
          label: 'Instancia nueva',
          code: `factoryOf(::NoteFormatter)`,
          why: 'Nueva instancia en cada inyección. Es raro: prefiere singleton o ViewModel.',
        },
        {
          key: 'lambda',
          label: 'Necesita setup',
          code: `single { HttpClientFactory.create(get()) }`,
          why: 'La forma lambda se usa cuando no basta con una referencia a constructor: factory methods, qualifiers o post-construcción.',
        },
      ],
      assemblerTitle: 'Ensamblador de initKoin',
      assemblerDescription:
        'Activa los módulos disponibles y observa el bloque modules(...) generado.',
      assemblerModules: ['coreDataModule', 'notesDataModule', 'notesPresentationModule', 'authDataModule', 'authPresentationModule'],
      assemblerEmpty: 'Selecciona al menos un módulo.',
      rulesTitle: 'Reglas de scoping',
      rulesDescription: 'Asigna la forma correcta de Koin a cada dependencia.',
      rulesLabels: { correct: 'Correcto', incorrect: 'Incorrecto' },
      rulesItems: [
        {
          label: 'Repositorio Room de toda la app',
          example: 'interface NoteRepository',
          options: ['factoryOf', 'singleOf + bind'],
          correct: 1,
        },
        {
          label: 'ViewModel de pantalla',
          example: 'NoteListViewModel',
          options: ['singleOf', 'viewModelOf'],
          correct: 1,
        },
        {
          label: 'Ktor engine por plataforma',
          example: 'OkHttp / Darwin',
          options: ['singleOf en common', 'módulo expect/actual'],
          correct: 1,
        },
        {
          label: 'ViewModel en el Root',
          example: 'NoteListRoot',
          options: ['koinViewModel()', 'pasar como parámetro'],
          correct: 0,
        },
      ],
      rulesExplainSingleton:
        'Repositorios, HttpClient y DB son singletons. Usa singleOf con bind para exponer la interfaz.',
      rulesExplainViewModel:
        'Los ViewModel usan viewModelOf para respetar su ciclo de vida; SavedStateHandle se inyecta solo.',
      rulesExplainPlatform:
        'Lo que se construye distinto por plataforma va en un módulo expect/actual incluido por el módulo común.',
      rulesExplainInject:
        'koinViewModel() se usa en el Root. Nunca pases ViewModels hacia abajo del árbol.',
      concept1Title: 'Módulos por capa',
      concept1Body:
        'notesDataModule y notesPresentationModule viven en el feature, en commonMain. Solo se crean si hay dependencias que proveer.',
      concept2Title: 'Ensamblado único',
      concept2Body:
        'composeApp registra todos los módulos en initKoin. Android y iOS lo llaman una sola vez al arrancar.',
      concept3Title: 'Plataforma aislada',
      concept3Body:
        'Ktor engine, Room builder y DataStore path son las únicas piezas por plataforma; van en expect/actual.',
      codeModuleTitle: 'Constructor reference vs lambda',
      codeBadModule: `// La forma lambda añade ruido cuando basta el constructor
val notesDataModule = module {
    single { RoomNoteRepository(get()) }
}`,
      codeGoodModule: `// singleOf resuelve los parámetros y permite el bind
val notesDataModule = module {
    singleOf(::RoomNoteRepository) { bind<NoteRepository>() }
}`,
      codeInjectTitle: 'Inyectar en el Root',
      codeBadInject: `// MAL: el ViewModel se pasa por el árbol
NoteListScreen(viewModel = viewModel)`,
      codeGoodInject: `// BIEN: solo el Root conoce el ViewModel
@Composable
fun NoteListRoot(
    viewModel: NoteListViewModel = koinViewModel()
) {
    NoteListScreen(state = state, onAction = viewModel::onAction)
}`,
      quiz: '¿Qué forma de Koin usas para un repositorio singleton que debe exponerse como interfaz?',
      quizOptions: [
        'factory { RoomNoteRepository(get()) }',
        'viewModelOf(::RoomNoteRepository)',
        'singleOf(::RoomNoteRepository) { bind<NoteRepository>() }',
        'singleOf(::NoteRepository)',
      ],
      quizAnswer: 2,
      quizExplanation:
        'singleOf con bind registra una única instancia y expone la interfaz, manteniendo data fuera de presentation.',
      checklistTitle: 'Checklist: DI de un feature',
      checklist: [
        'Definir <feature>DataModule en feature:data',
        'Definir <feature>PresentationModule en feature:presentation',
        'Añadir módulo expect/actual si hay dependencias de plataforma',
        'Registrar los módulos en initKoin de composeApp',
        'Llamar a initKoin una vez por plataforma',
        'Usar koinViewModel() solo en los Root',
      ],
    },
    pt: {
      kicker: 'Arquitetura · Koin',
      title: 'Injeção de dependências com Koin',
      subtitle:
        'Um módulo por camada, montado no composeApp e koinViewModel() nos Root. O que é específico de plataforma vai em módulos expect/actual.',
      flowTitle: 'Como tudo se conecta',
      steps: [
        { title: 'Feature module', description: 'notesDataModule e notesPresentationModule em commonMain.' },
        { title: 'Platform module', description: 'expect/actual para Ktor engine, Room e DataStore.' },
        { title: 'initKoin', description: 'composeApp registra todos os módulos uma única vez.' },
        { title: 'koinViewModel', description: 'O Root injeta o ViewModel; nunca é passado para baixo.' },
      ],
      builderTitle: 'Construtor de módulos',
      builderDescription:
        'Escolha uma camada e veja o módulo Koin correspondente.',
      modules: [
        {
          key: 'data',
          label: 'data',
          code: `val notesDataModule = module {
    singleOf(::RoomNoteRepository) { bind<NoteRepository>() }
}`,
        },
        {
          key: 'presentation',
          label: 'presentation',
          code: `val notesPresentationModule = module {
    viewModelOf(::NoteListViewModel)
    viewModelOf(::NoteDetailViewModel)
}`,
        },
        {
          key: 'core',
          label: 'core:data',
          code: `val coreDataModule = module {
    includes(coreDataPlatformModule)
    singleOf(::SessionPreferences)
    single { HttpClientFactory.create(get()) }
}`,
        },
        {
          key: 'platform',
          label: 'platform',
          code: `// commonMain
expect val coreDataPlatformModule: Module

// androidMain
actual val coreDataPlatformModule = module {
    single<HttpClientEngine> { OkHttp.create() }
}

// iosMain
actual val coreDataPlatformModule = module {
    single<HttpClientEngine> { Darwin.create() }
}`,
        },
      ],
      scopeTitle: 'Seletor de scope',
      scopeDescription: 'Escolha o que está provendo e descubra a forma recomendada.',
      scopes: [
        {
          key: 'singleton',
          label: 'Repositório',
          code: `singleOf(::RoomNoteRepository) { bind<NoteRepository>() }`,
          why: 'Uma instância para toda a app. A interface fica ligada para que presentation não dependa de data.',
        },
        {
          key: 'viewmodel',
          label: 'ViewModel',
          code: `viewModelOf(::NoteListViewModel)`,
          why: 'Ciclo de vida do ViewModel. SavedStateHandle é resolvido automaticamente.',
        },
        {
          key: 'factory',
          label: 'Instância nova',
          code: `factoryOf(::NoteFormatter)`,
          why: 'Nova instância em cada injeção. É raro: prefira singleton ou ViewModel.',
        },
        {
          key: 'lambda',
          label: 'Precisa setup',
          code: `single { HttpClientFactory.create(get()) }`,
          why: 'A forma lambda é usada quando não basta uma referência de construtor: factory methods, qualifiers ou pós-construção.',
        },
      ],
      assemblerTitle: 'Montador de initKoin',
      assemblerDescription:
        'Ative os módulos disponíveis e veja o bloco modules(...) gerado.',
      assemblerModules: ['coreDataModule', 'notesDataModule', 'notesPresentationModule', 'authDataModule', 'authPresentationModule'],
      assemblerEmpty: 'Selecione ao menos um módulo.',
      rulesTitle: 'Regras de scoping',
      rulesDescription: 'Atribua a forma correta do Koin a cada dependência.',
      rulesLabels: { correct: 'Correto', incorrect: 'Incorreto' },
      rulesItems: [
        {
          label: 'Repositório Room de toda a app',
          example: 'interface NoteRepository',
          options: ['factoryOf', 'singleOf + bind'],
          correct: 1,
        },
        {
          label: 'ViewModel de tela',
          example: 'NoteListViewModel',
          options: ['singleOf', 'viewModelOf'],
          correct: 1,
        },
        {
          label: 'Ktor engine por plataforma',
          example: 'OkHttp / Darwin',
          options: ['singleOf em common', 'módulo expect/actual'],
          correct: 1,
        },
        {
          label: 'ViewModel no Root',
          example: 'NoteListRoot',
          options: ['koinViewModel()', 'passar como parâmetro'],
          correct: 0,
        },
      ],
      rulesExplainSingleton:
        'Repositórios, HttpClient e DB são singletons. Use singleOf com bind para expor a interface.',
      rulesExplainViewModel:
        'ViewModels usam viewModelOf para respeitar seu ciclo de vida; SavedStateHandle é injetado sozinho.',
      rulesExplainPlatform:
        'O que é construído diferente por plataforma vai num módulo expect/actual incluído pelo módulo comum.',
      rulesExplainInject:
        'koinViewModel() é usado no Root. Nunca passe ViewModels para baixo da árvore.',
      concept1Title: 'Módulos por camada',
      concept1Body:
        'notesDataModule e notesPresentationModule vivem no feature, em commonMain. Só são criados se houver dependências a prover.',
      concept2Title: 'Montagem única',
      concept2Body:
        'composeApp registra todos os módulos em initKoin. Android e iOS o chamam uma única vez na inicialização.',
      concept3Title: 'Plataforma isolada',
      concept3Body:
        'Ktor engine, Room builder e DataStore path são as únicas peças por plataforma; vão em expect/actual.',
      codeModuleTitle: 'Constructor reference vs lambda',
      codeBadModule: `// A forma lambda adiciona ruído quando o construtor basta
val notesDataModule = module {
    single { RoomNoteRepository(get()) }
}`,
      codeGoodModule: `// singleOf resolve os parâmetros e permite o bind
val notesDataModule = module {
    singleOf(::RoomNoteRepository) { bind<NoteRepository>() }
}`,
      codeInjectTitle: 'Injetar no Root',
      codeBadInject: `// ERRADO: o ViewModel é passado pela árvore
NoteListScreen(viewModel = viewModel)`,
      codeGoodInject: `// CERTO: só o Root conhece o ViewModel
@Composable
fun NoteListRoot(
    viewModel: NoteListViewModel = koinViewModel()
) {
    NoteListScreen(state = state, onAction = viewModel::onAction)
}`,
      quiz: 'Qual forma do Koin você usa para um repositório singleton exposto como interface?',
      quizOptions: [
        'factory { RoomNoteRepository(get()) }',
        'viewModelOf(::RoomNoteRepository)',
        'singleOf(::RoomNoteRepository) { bind<NoteRepository>() }',
        'singleOf(::NoteRepository)',
      ],
      quizAnswer: 2,
      quizExplanation:
        'singleOf com bind registra uma única instância e expõe a interface, mantendo data fora de presentation.',
      checklistTitle: 'Checklist: DI de um feature',
      checklist: [
        'Definir <feature>DataModule em feature:data',
        'Definir <feature>PresentationModule em feature:presentation',
        'Adicionar módulo expect/actual se houver dependências de plataforma',
        'Registrar os módulos em initKoin do composeApp',
        'Chamar initKoin uma vez por plataforma',
        'Usar koinViewModel() apenas nos Root',
      ],
    },
    en: {
      kicker: 'Architecture · Koin',
      title: 'Dependency injection with Koin',
      subtitle:
        'One module per layer, assembled in composeApp, and koinViewModel() in Roots. Platform-specific pieces go in expect/actual modules.',
      flowTitle: 'How everything connects',
      steps: [
        { title: 'Feature module', description: 'notesDataModule and notesPresentationModule in commonMain.' },
        { title: 'Platform module', description: 'expect/actual for the Ktor engine, Room, and DataStore.' },
        { title: 'initKoin', description: 'composeApp registers all modules exactly once.' },
        { title: 'koinViewModel', description: 'The Root injects the ViewModel; it is never passed down.' },
      ],
      builderTitle: 'Module builder',
      builderDescription:
        'Pick a layer and review its Koin module.',
      modules: [
        {
          key: 'data',
          label: 'data',
          code: `val notesDataModule = module {
    singleOf(::RoomNoteRepository) { bind<NoteRepository>() }
}`,
        },
        {
          key: 'presentation',
          label: 'presentation',
          code: `val notesPresentationModule = module {
    viewModelOf(::NoteListViewModel)
    viewModelOf(::NoteDetailViewModel)
}`,
        },
        {
          key: 'core',
          label: 'core:data',
          code: `val coreDataModule = module {
    includes(coreDataPlatformModule)
    singleOf(::SessionPreferences)
    single { HttpClientFactory.create(get()) }
}`,
        },
        {
          key: 'platform',
          label: 'platform',
          code: `// commonMain
expect val coreDataPlatformModule: Module

// androidMain
actual val coreDataPlatformModule = module {
    single<HttpClientEngine> { OkHttp.create() }
}

// iosMain
actual val coreDataPlatformModule = module {
    single<HttpClientEngine> { Darwin.create() }
}`,
        },
      ],
      scopeTitle: 'Scope selector',
      scopeDescription: 'Pick what you are providing and discover the recommended form.',
      scopes: [
        {
          key: 'singleton',
          label: 'Repository',
          code: `singleOf(::RoomNoteRepository) { bind<NoteRepository>() }`,
          why: 'One instance for the app lifetime. The interface is bound so presentation never depends on data.',
        },
        {
          key: 'viewmodel',
          label: 'ViewModel',
          code: `viewModelOf(::NoteListViewModel)`,
          why: 'Scoped to the ViewModel lifecycle. SavedStateHandle is resolved automatically.',
        },
        {
          key: 'factory',
          label: 'New instance',
          code: `factoryOf(::NoteFormatter)`,
          why: 'A new instance on every injection. It is rare: prefer singleton or ViewModel.',
        },
        {
          key: 'lambda',
          label: 'Needs setup',
          code: `single { HttpClientFactory.create(get()) }`,
          why: 'The lambda form is for factory methods, named qualifiers, or post-construction setup.',
        },
      ],
      assemblerTitle: 'initKoin assembler',
      assemblerDescription:
        'Toggle available modules and watch the generated modules(...) block.',
      assemblerModules: ['coreDataModule', 'notesDataModule', 'notesPresentationModule', 'authDataModule', 'authPresentationModule'],
      assemblerEmpty: 'Select at least one module.',
      rulesTitle: 'Scoping rules',
      rulesDescription: 'Assign the correct Koin form to each dependency.',
      rulesLabels: { correct: 'Correct', incorrect: 'Incorrect' },
      rulesItems: [
        {
          label: 'App-wide Room repository',
          example: 'interface NoteRepository',
          options: ['factoryOf', 'singleOf + bind'],
          correct: 1,
        },
        {
          label: 'Screen ViewModel',
          example: 'NoteListViewModel',
          options: ['singleOf', 'viewModelOf'],
          correct: 1,
        },
        {
          label: 'Per-platform Ktor engine',
          example: 'OkHttp / Darwin',
          options: ['singleOf in common', 'expect/actual module'],
          correct: 1,
        },
        {
          label: 'ViewModel in the Root',
          example: 'NoteListRoot',
          options: ['koinViewModel()', 'pass as parameter'],
          correct: 0,
        },
      ],
      rulesExplainSingleton:
        'Repositories, HttpClient, and the database are singletons. Use singleOf with bind to expose the interface.',
      rulesExplainViewModel:
        'ViewModels use viewModelOf to respect their lifecycle; SavedStateHandle is injected for free.',
      rulesExplainPlatform:
        'Anything constructed differently per platform lives in an expect/actual module included by the common module.',
      rulesExplainInject:
        'koinViewModel() is used in the Root. Never pass ViewModels down the tree.',
      concept1Title: 'Modules per layer',
      concept1Body:
        'notesDataModule and notesPresentationModule live in the feature, in commonMain. Create them only if there are dependencies to provide.',
      concept2Title: 'Single assembly',
      concept2Body:
        'composeApp registers every module in initKoin. Android and iOS call it once at startup.',
      concept3Title: 'Isolated platform code',
      concept3Body:
        'The Ktor engine, Room builder, and DataStore path are the only per-platform pieces; they go in expect/actual.',
      codeModuleTitle: 'Constructor reference vs lambda',
      codeBadModule: `// The lambda form adds noise when the constructor is enough
val notesDataModule = module {
    single { RoomNoteRepository(get()) }
}`,
      codeGoodModule: `// singleOf resolves parameters and enables the bind
val notesDataModule = module {
    singleOf(::RoomNoteRepository) { bind<NoteRepository>() }
}`,
      codeInjectTitle: 'Inject in the Root',
      codeBadInject: `// WRONG: the ViewModel is passed down the tree
NoteListScreen(viewModel = viewModel)`,
      codeGoodInject: `// RIGHT: only the Root knows the ViewModel
@Composable
fun NoteListRoot(
    viewModel: NoteListViewModel = koinViewModel()
) {
    NoteListScreen(state = state, onAction = viewModel::onAction)
}`,
      quiz: 'Which Koin form do you use for a singleton repository exposed as an interface?',
      quizOptions: [
        'factory { RoomNoteRepository(get()) }',
        'viewModelOf(::RoomNoteRepository)',
        'singleOf(::RoomNoteRepository) { bind<NoteRepository>() }',
        'singleOf(::NoteRepository)',
      ],
      quizAnswer: 2,
      quizExplanation:
        'singleOf with bind registers a single instance and exposes the interface, keeping data out of presentation.',
      checklistTitle: 'Checklist: feature DI',
      checklist: [
        'Define <feature>DataModule in feature:data',
        'Define <feature>PresentationModule in feature:presentation',
        'Add an expect/actual module if there are platform dependencies',
        'Register the modules in composeApp’s initKoin',
        'Call initKoin once per platform',
        'Use koinViewModel() only in Roots',
      ],
    },
  }[language];

  const [moduleKey, setModuleKey] = useState('data');
  const module = t.modules.find((item) => item.key === moduleKey) ?? t.modules[0];

  const [scopeKey, setScopeKey] = useState('singleton');
  const scope = t.scopes.find((item) => item.key === scopeKey) ?? t.scopes[0];

  const [selectedModules, setSelectedModules] = useState<Set<string>>(
    () => new Set(['coreDataModule', 'notesDataModule', 'notesPresentationModule'])
  );

  const toggleModule = (name: string) => {
    setSelectedModules((previous) => {
      const next = new Set(previous);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const selectedList = t.assemblerModules.filter((name) => selectedModules.has(name));

  const ruleExplanations = [
    t.rulesExplainSingleton,
    t.rulesExplainViewModel,
    t.rulesExplainPlatform,
    t.rulesExplainInject,
  ];

  return (
    <div className="space-y-10">
      <div className="p-6 sm:p-8 rounded-2xl bg-surface-low space-y-3">
        <span className="text-xs font-mono text-brand uppercase font-semibold">{t.kicker}</span>
        <h2 className="text-3xl md:text-4xl font-bold text-on-surface">{t.title}</h2>
        <p className="text-sm text-on-surface-variant max-w-3xl leading-relaxed">{t.subtitle}</p>
      </div>

      <SkillSection title={t.flowTitle}>
        <StepFlow steps={t.steps} />
      </SkillSection>

      <SimulatorFrame title={t.builderTitle} description={t.builderDescription}>
        <div className="flex flex-wrap gap-2">
          {t.modules.map((item) => (
            <button
              key={item.key}
              onClick={() => setModuleKey(item.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
                moduleKey === item.key
                  ? 'bg-brand text-on-brand'
                  : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <pre className="code-surface p-4 rounded-xl bg-surface-lowest text-xs text-sky-300 overflow-x-auto">
          {module.code}
        </pre>
      </SimulatorFrame>

      <SimulatorFrame title={t.scopeTitle} description={t.scopeDescription}>
        <div className="flex flex-wrap gap-2">
          {t.scopes.map((item) => (
            <button
              key={item.key}
              onClick={() => setScopeKey(item.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
                scopeKey === item.key
                  ? 'bg-brand text-on-brand'
                  : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <pre className="code-surface p-4 rounded-xl bg-surface-lowest text-xs text-sky-300 overflow-x-auto">
            {scope.code}
          </pre>
          <Callout tone="brand">{scope.why}</Callout>
        </div>
      </SimulatorFrame>

      <SimulatorFrame title={t.assemblerTitle} description={t.assemblerDescription}>
        <div className="flex flex-wrap gap-2">
          {t.assemblerModules.map((name) => {
            const active = selectedModules.has(name);
            return (
              <button
                key={name}
                onClick={() => toggleModule(name)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono transition-colors ${
                  active
                    ? 'bg-brand text-on-brand'
                    : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
        <pre className="code-surface p-4 rounded-xl bg-surface-lowest text-xs text-sky-300 overflow-x-auto">
{`fun initKoin() {
    startKoin {
        modules(
${selectedList.length === 0 ? '            // ' + t.assemblerEmpty : selectedList.map((name) => `            ${name},`).join('\n')}
        )
    }
}`}
        </pre>
      </SimulatorFrame>

      <SkillSection title={t.rulesTitle} description={t.rulesDescription}>
        <div className="rounded-2xl bg-surface-low p-4 space-y-2">
          {t.rulesItems.map((item, index) => (
            <PickerRow
              key={item.label}
              label={item.label}
              example={item.example}
              options={item.options}
              correctIndex={item.correct}
              labels={t.rulesLabels}
              explanation={ruleExplanations[index]}
            />
          ))}
        </div>
      </SkillSection>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ConceptCard icon={Layers} title={t.concept1Title}>
          {t.concept1Body}
        </ConceptCard>
        <ConceptCard icon={Cable} title={t.concept2Title} tone="brand">
          {t.concept2Body}
        </ConceptCard>
        <ConceptCard icon={Smartphone} title={t.concept3Title} tone="warning">
          {t.concept3Body}
        </ConceptCard>
      </div>

      <SkillSection title={t.codeModuleTitle}>
        <CodeCompare title={t.codeModuleTitle} badCode={t.codeBadModule} goodCode={t.codeGoodModule} />
      </SkillSection>

      <SkillSection title={t.codeInjectTitle}>
        <CodeCompare title={t.codeInjectTitle} badCode={t.codeBadInject} goodCode={t.codeGoodInject} />
      </SkillSection>

      <Quiz question={t.quiz} options={t.quizOptions} correctIndex={t.quizAnswer} explanation={t.quizExplanation} />

      <Checklist title={t.checklistTitle} items={t.checklist} />

      <div className="flex items-center gap-2 text-[11px] font-mono text-on-surface-variant">
        <Plug className="w-3.5 h-3.5 text-brand" />
        <Boxes className="w-3.5 h-3.5 text-brand" />
        <Sparkles className="w-3.5 h-3.5 text-brand" />
        <span>{t.flowTitle}</span>
      </div>
    </div>
  );
};
