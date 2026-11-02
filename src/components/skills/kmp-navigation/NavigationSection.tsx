import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CornerDownRight,
  Layers,
  Map,
  Route,
  Smartphone,
} from 'lucide-react';
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

interface RouteSample {
  key: string;
  label: string;
  declaration: string;
  usage: string;
}

export const NavigationSection: React.FC = () => {
  const { language } = useLanguage();
  const t = {
    es: {
      kicker: 'Navegación · Compose Multiplatform',
      title: 'Navegación type-safe',
      subtitle:
        'Rutas @Serializable, un nav graph por feature y callbacks para cruzar features. El NavController solo vive dentro de su feature y todo se ensambla en composeApp.',
      flowTitle: 'De rutas a pantallas',
      steps: [
        { title: 'Route', description: 'Objeto o data class @Serializable en feature:presentation.' },
        { title: 'Feature graph', description: 'NavGraphBuilder.<feature>Graph con NavController y callbacks.' },
        { title: 'NavController', description: 'Navega dentro del feature; recibe argumentos con toRoute().' },
        { title: 'composeApp', description: 'Ensambla todos los graphs y resuelve la navegación cruzada.' },
      ],
      routeTitle: 'Constructor de rutas',
      routeDescription:
        'Elige una pantalla y revisa su declaración y cómo se navega o recibe el argumento.',
      routeDeclaration: 'Declaración',
      routeUsage: 'Uso',
      routes: [
        {
          key: 'list',
          label: 'Lista',
          declaration: `@Serializable data object NoteListRoute`,
          usage: `navController.navigate(NoteListRoute)`,
        },
        {
          key: 'detail',
          label: 'Detalle',
          declaration: `@Serializable data class NoteDetailRoute(val noteId: String)`,
          usage: `navController.navigate(NoteDetailRoute(noteId = "abc123"))

// En el composable
val route: NoteDetailRoute = backStackEntry.toRoute()
route.noteId`,
        },
        {
          key: 'editor',
          label: 'Editor',
          declaration: `@Serializable data class NoteEditorRoute(
    val noteId: String,
    val isNew: Boolean
)`,
          usage: `navController.navigate(
    NoteEditorRoute(noteId = "abc123", isNew = false)
)`,
        },
      ],
      stackTitle: 'Simulador de pila',
      stackDescription:
        'Navega dentro del feature y observa cómo crece y decrece el back stack.',
      stackReset: 'Ir a la lista',
      stackOpenDetail: 'Abrir detalle',
      stackOpenEditor: 'Abrir editor',
      stackBack: 'Atrás',
      stackLabel: 'Back stack',
      stackNote:
        'Android resuelve el back del sistema y predictive back por ti. En iOS el gesto de borde lo aporta la librería, pero cada pantalla no-root necesita un botón visible de volver.',
      graphTitle: 'Así se ensambla en composeApp',
      crossTitle: 'Reglas entre features',
      crossDescription:
        'Asigna cómo debe comportarse cada caso de navegación.',
      crossLabels: { correct: 'Correcto', incorrect: 'Incorrecto' },
      crossItems: [
        {
          label: 'Ir de notas a editor (features distintas)',
          example: 'features: notes → editor',
          options: ['Importar ruta', 'Callback'],
          correct: 1,
        },
        {
          label: 'Abrir detalle dentro del feature notes',
          example: 'navController.navigate(NoteDetailRoute(id))',
          options: ['NavController', 'Callback'],
          correct: 0,
        },
        {
          label: 'Importar la ruta del feature editor desde notes',
          example: 'import feature.editor.EditorRoute',
          options: ['Permitido', 'Prohibido'],
          correct: 1,
        },
        {
          label: 'Interceptar back en commonMain',
          example: 'BackHandler {}',
          options: ['BackHandler de activity', 'ui-backhandler'],
          correct: 1,
        },
      ],
      crossExplainCallback:
        'La navegación cruzada se expone como lambda callback. composeApp decide el destino; el feature no conoce rutas ajenas.',
      crossExplainDirect:
        'Dentro del feature sí usas NavController; es el único caso donde el feature navega por sí mismo.',
      crossExplainForbidden:
        'Un feature nunca importa rutas de otro feature. Eso crea acoplamiento; usa un callback.',
      crossExplainBack:
        'androidx.activity.compose.BackHandler es Android-only. En commonMain usa el back handler multiplataforma de compose ui-backhandler.',
      concept1Title: 'Rutas serializables',
      concept1Body:
        'data object para pantallas sin argumentos; data class para pantallas con argumentos. El tipo es la ruta.',
      concept2Title: 'Un graph por feature',
      concept2Body:
        'Cada feature expone una extensión de NavGraphBuilder. composeApp la ensambla en el NavHost compartido.',
      concept3Title: 'Callbacks, no imports',
      concept3Body:
        'Cruzar features se expresa con lambdas. Las rutas de un feature no salen de su módulo.',
      codeRoutesTitle: 'Rutas tipadas vs strings',
      codeBadRoutes: `// MAL: strings sin tipo, sin argumentos seguros
navController.navigate("note_detail/$noteId")`,
      codeGoodRoutes: `// BIEN: ruta serializable con argumento tipado
@Serializable data class NoteDetailRoute(val noteId: String)
navController.navigate(NoteDetailRoute(noteId))`,
      codeCrossTitle: 'Navegación cruzada con callbacks',
      codeBadCross: `// MAL: notes conoce la ruta del feature editor
import com.example.feature.editor.EditorRoute
navController.navigate(EditorRoute(noteId))`,
      codeGoodCross: `// BIEN: callback que composeApp resuelve
fun NavGraphBuilder.notesGraph(
    navController: NavController,
    onNavigateToEditor: (String) -> Unit
) { … }

// composeApp
notesGraph(
    navController = navController,
    onNavigateToEditor = { navController.navigate(EditorRoute(it)) }
)`,
      quiz: '¿Cómo navega un feature hacia otro feature?',
      quizOptions: [
        'Importando la ruta del otro feature',
        'Con un callback lambda resuelto en composeApp',
        'Compartiendo el NavController global',
        'Con strings hardcodeados',
      ],
      quizAnswer: 1,
      quizExplanation:
        'Los features se mantienen desacoplados. El callback sube a composeApp, que conoce ambas rutas y decide el destino.',
      checklistTitle: 'Checklist: añadir navegación a un feature',
      checklist: [
        'Definir rutas @Serializable en feature:presentation',
        'Añadir <feature>Graph(NavController, callbacks)',
        'Usar NavController solo para navegación interna',
        'Exponer destinos cruzados como lambdas',
        'Ensamblar el graph en el NavHost de composeApp',
        'Cada pantalla no-root tiene botón visible de volver',
        'No usar androidx.activity.compose.BackHandler en commonMain',
      ],
    },
    pt: {
      kicker: 'Navegação · Compose Multiplatform',
      title: 'Navegação type-safe',
      subtitle:
        'Rotas @Serializable, um nav graph por feature e callbacks para cruzar features. O NavController só vive dentro do seu feature e tudo é montado no composeApp.',
      flowTitle: 'De rotas a telas',
      steps: [
        { title: 'Route', description: 'Objeto ou data class @Serializable em feature:presentation.' },
        { title: 'Feature graph', description: 'NavGraphBuilder.<feature>Graph com NavController e callbacks.' },
        { title: 'NavController', description: 'Navega dentro do feature; recebe argumentos com toRoute().' },
        { title: 'composeApp', description: 'Monta todos os graphs e resolve a navegação cruzada.' },
      ],
      routeTitle: 'Construtor de rotas',
      routeDescription:
        'Escolha uma tela e veja sua declaração e como navegar ou receber o argumento.',
      routeDeclaration: 'Declaração',
      routeUsage: 'Uso',
      routes: [
        {
          key: 'list',
          label: 'Lista',
          declaration: `@Serializable data object NoteListRoute`,
          usage: `navController.navigate(NoteListRoute)`,
        },
        {
          key: 'detail',
          label: 'Detalhe',
          declaration: `@Serializable data class NoteDetailRoute(val noteId: String)`,
          usage: `navController.navigate(NoteDetailRoute(noteId = "abc123"))

// No composable
val route: NoteDetailRoute = backStackEntry.toRoute()
route.noteId`,
        },
        {
          key: 'editor',
          label: 'Editor',
          declaration: `@Serializable data class NoteEditorRoute(
    val noteId: String,
    val isNew: Boolean
)`,
          usage: `navController.navigate(
    NoteEditorRoute(noteId = "abc123", isNew = false)
)`,
        },
      ],
      stackTitle: 'Simulador de pilha',
      stackDescription:
        'Navegue dentro do feature e veja a back stack crescer e diminuir.',
      stackReset: 'Ir para a lista',
      stackOpenDetail: 'Abrir detalhe',
      stackOpenEditor: 'Abrir editor',
      stackBack: 'Voltar',
      stackLabel: 'Back stack',
      stackNote:
        'O Android resolve o back do sistema e predictive back por você. No iOS o gesto de borda vem da biblioteca, mas cada tela não-root precisa de um botão visível de voltar.',
      graphTitle: 'Assim é montado no composeApp',
      crossTitle: 'Regras entre features',
      crossDescription:
        'Atribua como cada caso de navegação deve se comportar.',
      crossLabels: { correct: 'Correto', incorrect: 'Incorreto' },
      crossItems: [
        {
          label: 'Ir de notas para editor (features distintas)',
          example: 'features: notes → editor',
          options: ['Importar rota', 'Callback'],
          correct: 1,
        },
        {
          label: 'Abrir detalhe dentro do feature notes',
          example: 'navController.navigate(NoteDetailRoute(id))',
          options: ['NavController', 'Callback'],
          correct: 0,
        },
        {
          label: 'Importar a rota do feature editor a partir de notes',
          example: 'import feature.editor.EditorRoute',
          options: ['Permitido', 'Proibido'],
          correct: 1,
        },
        {
          label: 'Interceptar back em commonMain',
          example: 'BackHandler {}',
          options: ['BackHandler de activity', 'ui-backhandler'],
          correct: 1,
        },
      ],
      crossExplainCallback:
        'A navegação cruzada é exposta como lambda callback. O composeApp decide o destino; o feature não conhece rotas alheias.',
      crossExplainDirect:
        'Dentro do feature você usa o NavController; é o único caso em que o feature navega por si.',
      crossExplainForbidden:
        'Um feature nunca importa rotas de outro feature. Isso cria acoplamento; use um callback.',
      crossExplainBack:
        'androidx.activity.compose.BackHandler é Android-only. Em commonMain use o back handler multiplataforma do compose ui-backhandler.',
      concept1Title: 'Rotas serializáveis',
      concept1Body:
        'data object para telas sem argumentos; data class para telas com argumentos. O tipo é a rota.',
      concept2Title: 'Um graph por feature',
      concept2Body:
        'Cada feature expõe uma extensão de NavGraphBuilder. O composeApp a monta no NavHost compartilhado.',
      concept3Title: 'Callbacks, não imports',
      concept3Body:
        'Cruzar features é expresso com lambdas. As rotas de um feature não saem do seu módulo.',
      codeRoutesTitle: 'Rotas tipadas vs strings',
      codeBadRoutes: `// ERRADO: strings sem tipo, sem argumentos seguros
navController.navigate("note_detail/$noteId")`,
      codeGoodRoutes: `// CERTO: rota serializável com argumento tipado
@Serializable data class NoteDetailRoute(val noteId: String)
navController.navigate(NoteDetailRoute(noteId))`,
      codeCrossTitle: 'Navegação cruzada com callbacks',
      codeBadCross: `// ERRADO: notes conhece a rota do feature editor
import com.example.feature.editor.EditorRoute
navController.navigate(EditorRoute(noteId))`,
      codeGoodCross: `// CERTO: callback que o composeApp resolve
fun NavGraphBuilder.notesGraph(
    navController: NavController,
    onNavigateToEditor: (String) -> Unit
) { … }

// composeApp
notesGraph(
    navController = navController,
    onNavigateToEditor = { navController.navigate(EditorRoute(it)) }
)`,
      quiz: 'Como um feature navega para outro feature?',
      quizOptions: [
        'Importando a rota do outro feature',
        'Com um callback lambda resolvido no composeApp',
        'Compartilhando o NavController global',
        'Com strings hardcoded',
      ],
      quizAnswer: 1,
      quizExplanation:
        'Os features ficam desacoplados. O callback sobe ao composeApp, que conhece ambas as rotas e decide o destino.',
      checklistTitle: 'Checklist: adicionar navegação a um feature',
      checklist: [
        'Definir rotas @Serializable em feature:presentation',
        'Adicionar <feature>Graph(NavController, callbacks)',
        'Usar NavController apenas para navegação interna',
        'Expor destinos cruzados como lambdas',
        'Montar o graph no NavHost do composeApp',
        'Cada tela não-root tem botão visível de voltar',
        'Não usar androidx.activity.compose.BackHandler em commonMain',
      ],
    },
    en: {
      kicker: 'Navigation · Compose Multiplatform',
      title: 'Type-safe navigation',
      subtitle:
        'Serializable routes, one nav graph per feature, and callbacks to cross features. The NavController only lives inside its feature and everything is assembled in composeApp.',
      flowTitle: 'From routes to screens',
      steps: [
        { title: 'Route', description: 'A @Serializable object or data class in feature:presentation.' },
        { title: 'Feature graph', description: 'NavGraphBuilder.<feature>Graph with NavController and callbacks.' },
        { title: 'NavController', description: 'Navigates inside the feature; reads arguments via toRoute().' },
        { title: 'composeApp', description: 'Assembles every graph and resolves cross-feature navigation.' },
      ],
      routeTitle: 'Route builder',
      routeDescription:
        'Pick a screen and review its declaration and how to navigate or receive its argument.',
      routeDeclaration: 'Declaration',
      routeUsage: 'Usage',
      routes: [
        {
          key: 'list',
          label: 'List',
          declaration: `@Serializable data object NoteListRoute`,
          usage: `navController.navigate(NoteListRoute)`,
        },
        {
          key: 'detail',
          label: 'Detail',
          declaration: `@Serializable data class NoteDetailRoute(val noteId: String)`,
          usage: `navController.navigate(NoteDetailRoute(noteId = "abc123"))

// In the composable
val route: NoteDetailRoute = backStackEntry.toRoute()
route.noteId`,
        },
        {
          key: 'editor',
          label: 'Editor',
          declaration: `@Serializable data class NoteEditorRoute(
    val noteId: String,
    val isNew: Boolean
)`,
          usage: `navController.navigate(
    NoteEditorRoute(noteId = "abc123", isNew = false)
)`,
        },
      ],
      stackTitle: 'Back stack simulator',
      stackDescription:
        'Navigate inside the feature and watch the back stack grow and shrink.',
      stackReset: 'Go to list',
      stackOpenDetail: 'Open detail',
      stackOpenEditor: 'Open editor',
      stackBack: 'Back',
      stackLabel: 'Back stack',
      stackNote:
        'Android handles system back and predictive back for you. On iOS the edge gesture comes from the library, but every non-root screen needs a visible back button.',
      graphTitle: 'How it is assembled in composeApp',
      crossTitle: 'Cross-feature rules',
      crossDescription:
        'Assign how each navigation case should behave.',
      crossLabels: { correct: 'Correct', incorrect: 'Incorrect' },
      crossItems: [
        {
          label: 'Go from notes to editor (different features)',
          example: 'features: notes → editor',
          options: ['Import route', 'Callback'],
          correct: 1,
        },
        {
          label: 'Open detail inside the notes feature',
          example: 'navController.navigate(NoteDetailRoute(id))',
          options: ['NavController', 'Callback'],
          correct: 0,
        },
        {
          label: 'Import the editor route from notes',
          example: 'import feature.editor.EditorRoute',
          options: ['Allowed', 'Forbidden'],
          correct: 1,
        },
        {
          label: 'Intercept back in commonMain',
          example: 'BackHandler {}',
          options: ['activity BackHandler', 'ui-backhandler'],
          correct: 1,
        },
      ],
      crossExplainCallback:
        'Cross-feature navigation is exposed as a lambda callback. composeApp decides the destination; the feature does not know foreign routes.',
      crossExplainDirect:
        'Inside the feature you do use the NavController; it is the only case where the feature navigates on its own.',
      crossExplainForbidden:
        'A feature never imports routes from another feature. That creates coupling; use a callback.',
      crossExplainBack:
        'androidx.activity.compose.BackHandler is Android-only. In commonMain use the multiplatform back handler from compose ui-backhandler.',
      concept1Title: 'Serializable routes',
      concept1Body:
        'data object for screens without arguments; data class for screens with arguments. The type is the route.',
      concept2Title: 'One graph per feature',
      concept2Body:
        'Each feature exposes a NavGraphBuilder extension. composeApp assembles it in the shared NavHost.',
      concept3Title: 'Callbacks, not imports',
      concept3Body:
        'Crossing features is expressed with lambdas. A feature’s routes never leave its module.',
      codeRoutesTitle: 'Typed routes vs strings',
      codeBadRoutes: `// WRONG: untyped strings, unsafe arguments
navController.navigate("note_detail/$noteId")`,
      codeGoodRoutes: `// RIGHT: serializable route with a typed argument
@Serializable data class NoteDetailRoute(val noteId: String)
navController.navigate(NoteDetailRoute(noteId))`,
      codeCrossTitle: 'Cross-feature navigation with callbacks',
      codeBadCross: `// WRONG: notes knows the editor feature route
import com.example.feature.editor.EditorRoute
navController.navigate(EditorRoute(noteId))`,
      codeGoodCross: `// RIGHT: callback resolved by composeApp
fun NavGraphBuilder.notesGraph(
    navController: NavController,
    onNavigateToEditor: (String) -> Unit
) { … }

// composeApp
notesGraph(
    navController = navController,
    onNavigateToEditor = { navController.navigate(EditorRoute(it)) }
)`,
      quiz: 'How does one feature navigate to another?',
      quizOptions: [
        'By importing the other feature’s route',
        'With a lambda callback resolved in composeApp',
        'By sharing a global NavController',
        'With hardcoded strings',
      ],
      quizAnswer: 1,
      quizExplanation:
        'Features stay decoupled. The callback goes up to composeApp, which knows both routes and decides the destination.',
      checklistTitle: 'Checklist: add navigation to a feature',
      checklist: [
        'Define @Serializable routes in feature:presentation',
        'Add <feature>Graph(NavController, callbacks)',
        'Use NavController only for internal navigation',
        'Expose cross-feature destinations as lambdas',
        'Assemble the graph in composeApp’s NavHost',
        'Every non-root screen has a visible back button',
        'Do not use androidx.activity.compose.BackHandler in commonMain',
      ],
    },
  }[language];

  const [routeKey, setRouteKey] = useState('list');
  const route = t.routes.find((item) => item.key === routeKey) ?? t.routes[0];

  const [stack, setStack] = useState<string[]>(['NoteListRoute']);
  const push = (screen: string) => setStack((previous) => [...previous, screen]);
  const back = () => setStack((previous) => (previous.length > 1 ? previous.slice(0, -1) : previous));
  const resetStack = () => setStack(['NoteListRoute']);

  const crossExplanations = [
    t.crossExplainCallback,
    t.crossExplainDirect,
    t.crossExplainForbidden,
    t.crossExplainBack,
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

      <SimulatorFrame title={t.routeTitle} description={t.routeDescription}>
        <div className="flex flex-wrap gap-2">
          {t.routes.map((item) => (
            <button
              key={item.key}
              onClick={() => setRouteKey(item.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
                routeKey === item.key
                  ? 'bg-brand text-on-brand'
                  : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <p className="ds-label text-on-surface-variant">{t.routeDeclaration}</p>
            <pre className="code-surface p-4 rounded-xl bg-surface-lowest text-xs text-sky-300 overflow-x-auto">
              {route.declaration}
            </pre>
          </div>
          <div className="space-y-1.5">
            <p className="ds-label text-on-surface-variant">{t.routeUsage}</p>
            <pre className="code-surface p-4 rounded-xl bg-surface-lowest text-xs text-sky-300 overflow-x-auto">
              {route.usage}
            </pre>
          </div>
        </div>
      </SimulatorFrame>

      <SimulatorFrame title={t.stackTitle} description={t.stackDescription}>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={resetStack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-high text-on-surface-variant text-xs font-semibold hover:text-on-surface"
          >
            <Map className="w-3.5 h-3.5" />
            {t.stackReset}
          </button>
          <button
            onClick={() => push('NoteDetailRoute("abc123")')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand text-on-brand text-xs font-bold"
          >
            <Route className="w-3.5 h-3.5" />
            {t.stackOpenDetail}
          </button>
          <button
            onClick={() => push('NoteEditorRoute("abc123", false)')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand text-on-brand text-xs font-bold"
          >
            <Route className="w-3.5 h-3.5" />
            {t.stackOpenEditor}
          </button>
          <button
            onClick={back}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-high text-on-surface-variant text-xs font-semibold hover:text-on-surface"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t.stackBack}
          </button>
        </div>

        <div className="p-4 rounded-xl bg-surface-lowest space-y-2">
          <p className="ds-label text-on-surface-variant">{t.stackLabel}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            {stack.map((screen, index) => (
              <React.Fragment key={`${screen}-${index}`}>
                <span
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono ${
                    index === stack.length - 1
                      ? 'bg-brand text-on-brand'
                      : 'bg-surface-high text-on-surface-variant'
                  }`}
                >
                  {screen}
                </span>
                {index < stack.length - 1 && <CornerDownRight className="w-3 h-3 text-brand" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Callout tone="neutral">{t.stackNote}</Callout>
      </SimulatorFrame>

      <SkillSection title={t.crossTitle} description={t.crossDescription}>
        <div className="rounded-2xl bg-surface-low p-4 space-y-2">
          {t.crossItems.map((item, index) => (
            <PickerRow
              key={item.label}
              label={item.label}
              example={item.example}
              options={item.options}
              correctIndex={item.correct}
              labels={t.crossLabels}
              explanation={crossExplanations[index]}
            />
          ))}
        </div>
      </SkillSection>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ConceptCard icon={Route} title={t.concept1Title}>
          {t.concept1Body}
        </ConceptCard>
        <ConceptCard icon={Layers} title={t.concept2Title} tone="brand">
          {t.concept2Body}
        </ConceptCard>
        <ConceptCard icon={Smartphone} title={t.concept3Title} tone="warning">
          {t.concept3Body}
        </ConceptCard>
      </div>

      <SkillSection title={t.codeRoutesTitle}>
        <CodeCompare title={t.codeRoutesTitle} badCode={t.codeBadRoutes} goodCode={t.codeGoodRoutes} />
      </SkillSection>

      <SkillSection title={t.codeCrossTitle}>
        <CodeCompare title={t.codeCrossTitle} badCode={t.codeBadCross} goodCode={t.codeGoodCross} />
      </SkillSection>

      <Quiz question={t.quiz} options={t.quizOptions} correctIndex={t.quizAnswer} explanation={t.quizExplanation} />

      <Checklist title={t.checklistTitle} items={t.checklist} />

      <div className="flex items-center gap-2 text-[11px] font-mono text-on-surface-variant">
        <ArrowRight className="w-3.5 h-3.5 text-brand" />
        <CheckCircle2 className="w-3.5 h-3.5 text-brand" />
        <span>{t.graphTitle}</span>
      </div>
    </div>
  );
};
