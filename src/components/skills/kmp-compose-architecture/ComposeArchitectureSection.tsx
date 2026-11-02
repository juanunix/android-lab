import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Layers,
  MousePointerClick,
  RefreshCw,
  Repeat,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import {
  Callout,
  Checklist,
  CodeCompare,
  ConceptCard,
  Quiz,
  SimulatorFrame,
  SkillSection,
  StepFlow,
} from '../shared/primitives';

interface Scenario {
  label: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const NOTE_IDS = ['n1', 'n2', 'n3'] as const;

const emptyCounts = (): Record<string, number> => ({ n1: 0, n2: 0, n3: 0 });

export const ComposeArchitectureSection: React.FC = () => {
  const { language } = useLanguage();
  const t = {
    es: {
      kicker: 'Compose · Pantallas KMP',
      title: 'Arquitectura de pantallas Compose',
      subtitle:
        'La UI es tonta: renderiza estado y reenvía acciones. Aprende estabilidad, propiedad del estado, side effects y lecturas diferidas con demos interactivas.',
      flowTitle: 'El flujo de una pantalla',
      steps: [
        { title: 'Screen', description: 'Renderiza el estado y reenvía acciones. Cero lógica de negocio.' },
        { title: 'State', description: 'Vive en el ViewModel como StateFlow y se colecta con lifecycle.' },
        { title: 'Action', description: 'Cada interacción despacha una acción tipada al ViewModel.' },
        { title: 'Effect', description: 'Solo cuando Compose lo exige, extraído en un composable dedicado.' },
      ],
      stabilityTitle: 'Simulador de estabilidad',
      stabilityDescription:
        'Actualiza una sola nota y observa cuántas tarjetas recomponen con y sin @Stable.',
      stableOn: '@Stable activado',
      stableOff: 'Sin @Stable',
      updateNote: 'Actualizar una nota',
      reset: 'Reiniciar',
      parentRenders: 'Renders del contenedor',
      itemRenders: 'recomposiciones',
      lastUpdated: 'actualizada',
      stableExplanation:
        'La lista contiene List<NoteUi>, un tipo que el compilador considera inestable. Con @Stable, Compose sabe que solo cambió una nota y recompone únicamente esa tarjeta.',
      unstableExplanation:
        'Sin @Stable, el compilador no puede confiar en la igualdad de la lista: cada cambio del contenedor obliga a recomponer todas las tarjetas.',
      noteTitles: ['Notas de reunión', 'Lista de compras', 'Ideas de diseño'],
      ownershipTitle: '¿Dónde vive el estado?',
      ownershipDescription:
        'Elige el lugar correcto para cada tipo de estado. Reacciona al instante como un linter mental.',
      ownershipScenarios: [
        {
          label: 'Texto del formulario',
          prompt: 'El texto que el usuario escribe en un TextField debe vivir en…',
          options: ['remember dentro del Screen', 'El ViewModel', 'rememberSaveable', 'Un CompositionLocal'],
          correctIndex: 1,
          explanation:
            'Todo el estado de aplicación vive en el ViewModel. Cada tecla despacha una acción que actualiza el StateFlow (y opcionalmente SavedStateHandle).',
        },
        {
          label: 'Scroll de LazyColumn',
          prompt: 'La posición de scroll de una LazyColumn debe vivir en…',
          options: ['El ViewModel', 'rememberLazyListState', 'Un objeto global', 'SavedStateHandle'],
          correctIndex: 1,
          explanation:
            'LazyListState es estado interno de Compose que la librería exige mantener en composición. Es la excepción aceptada a la regla del ViewModel.',
        },
        {
          label: 'Botón visible según scroll',
          prompt: 'Mostrar "ir arriba" cuando firstVisibleItemIndex > 5 se resuelve con…',
          options: ['LaunchedEffect', 'derivedStateOf sobre el LazyListState', 'Un Flow en el ViewModel', 'SideEffect'],
          correctIndex: 1,
          explanation:
            'Aquí la derivación depende de estado interno de Compose. derivedStateOf evita recomponer en cada pixel de scroll y es el uso legítimo de esta API.',
        },
        {
          label: 'Diálogo abierto',
          prompt: 'El estado de "diálogo de confirmación abierto" debe vivir en…',
          options: ['El ViewModel', 'rememberSaveable', 'La Activity', 'Una variable global'],
          correctIndex: 0,
          explanation:
            'Es estado de pantalla con significado de negocio. El ViewModel lo expone en su State y el Screen solo renderiza. remember es para estado puramente visual.',
        },
      ],
      deferredTitle: 'Lecturas diferidas',
      deferredDescription:
        'Mueve el slider y compara leer el valor animado en composición vs diferirlo a la fase de dibujo.',
      deferredOn: 'graphicsLayer (diferido)',
      deferredOff: 'Modifier.alpha (en composición)',
      sliderLabel: 'Progreso de la animación',
      composeReads: 'Lecturas en composición',
      drawUpdates: 'Actualizaciones de dibujo',
      deferredExplanation:
        'El valor se lee dentro de graphicsLayer {}. La animación corre en la fase de dibujo y no dispara recomposición: el contador de composición no se mueve.',
      immediateExplanation:
        'Modifier.alpha(alpha) lee el valor durante la composición. Cada cambio del slider recompone el composable completo: el contador sube en cada frame.',
      effectsTitle: 'Side effects: la alternativa correcta',
      effectsDescription:
        'Antes de añadir un efecto, pregúntate si el ViewModel puede resolverlo con una acción.',
      effectScenarios: [
        {
          label: 'Cargar al entrar',
          prompt: 'Una pantalla debe cargar sus datos al aparecer. ¿Qué usas?',
          options: ['LaunchedEffect(Unit)', 'Una acción del ViewModel en init', 'SideEffect', 'DisposableEffect'],
          correctIndex: 1,
          explanation:
            'Si el ViewModel puede hacerlo, que lo haga. Cargar datos es lógica de negocio: init del ViewModel o una acción disparada una vez, no un efecto de UI.',
        },
        {
          label: 'Listener de lifecycle',
          prompt: 'Necesitas reaccionar a ON_START y ON_STOP. ¿Qué usas?',
          options: ['LaunchedEffect', 'Un composable con DisposableEffect', 'SideEffect', 'remember'],
          correctIndex: 1,
          explanation:
            'Cuando no existe equivalente en el ViewModel, extrae el observer a su propio composable con DisposableEffect y elimínalo en onDispose.',
        },
        {
          label: 'Derivar del scroll',
          prompt: 'Calcular un valor a partir de LazyListState. ¿Qué usas?',
          options: ['LaunchedEffect', 'derivedStateOf', 'DisposableEffect', 'Un canal'],
          correctIndex: 1,
          explanation:
            'derivedStateOf es para estado interno de Compose. Solo debe usarse cuando la derivación no puede ocurrir en el ViewModel.',
        },
        {
          label: 'Snackbar tras navegar',
          prompt: 'Mostrar un snackbar después de una acción de negocio. ¿Qué usas?',
          options: ['Un Event del ViewModel', 'LaunchedEffect en el Screen', 'SideEffect', 'Un CompositionLocal'],
          correctIndex: 0,
          explanation:
            'El resultado es un evento de UI. El ViewModel lo emite y el Screen lo observa; el efecto no se usa para inventar lógica.',
        },
      ],
      concept1Title: 'UI tonta',
      concept1Body:
        'Composables renderizan estado y reenvían acciones. Nada de transformar datos ni de lógica de negocio dentro del árbol de UI.',
      concept2Title: 'Estado lifecycle-aware',
      concept2Body:
        'Colecta con collectAsStateWithLifecycle() desde org.jetbrains.androidx.lifecycle. En iOS se mapea a ON_START / ON_STOP.',
      concept3Title: '@Stable solo cuando hace falta',
      concept3Body:
        'Strong skipping está activo por defecto. Anota solo si el estado contiene List, Map, Set, interfaces o tipos abstractos.',
      codeStabilityTitle: 'Estabilidad en el estado de lista',
      codeBadStability: `// Sin anotación: List es inestable para el compilador
data class NoteListState(
    val notes: List<NoteUi> = emptyList(),
    val isLoading: Boolean = false
)`,
      codeGoodStability: `// @Stable: el compilador confía en la lista
@Stable
data class NoteListState(
    val notes: List<NoteUi> = emptyList(),
    val isLoading: Boolean = false
)`,
      codeFieldTitle: 'TextField que despacha acciones',
      codeBadField: `// MAL: estado local de dominio en el composable
var title by remember { mutableStateOf("") }
TextField(
    value = title,
    onValueChange = { title = it }
)`,
      codeGoodField: `// BIEN: el estado vive en el ViewModel
TextField(
    value = state.title,
    onValueChange = { onAction(NoteEditorAction.OnTitleChange(it)) }
)`,
      codeEffectTitle: 'Extraer efectos a un composable',
      codeBadEffect: `// MAL: efecto y lógica mezclados en el Screen
LaunchedEffect(Unit) {
    if (isAndroid) loadFromAndroid()
}`,
      codeGoodEffect: `// BIEN: efecto extraído y detrás de un contrato
@Composable
fun ObserveLifecycle(onStart: () -> Unit, onStop: () -> Unit) {
    val owner = LocalLifecycleOwner.current
    DisposableEffect(owner) {
        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_START -> onStart()
                Lifecycle.Event.ON_STOP -> onStop()
                else -> Unit
            }
        }
        owner.lifecycle.addObserver(observer)
        onDispose { owner.lifecycle.removeObserver(observer) }
    }
}`,
      quiz: '¿Qué anotación necesita un estado que contiene un List<NoteUi>?',
      quizOptions: ['Ninguna, strong skipping lo resuelve', '@Stable', '@Composable', '@Immutable siempre'],
      quizAnswer: 1,
      quizExplanation:
        'List es un tipo que el compilador considera inestable. @Stable le dice que puede confiar en la igualdad y evita recomponer de más.',
      checklistTitle: 'Checklist: diseñar una pantalla',
      checklist: [
        'El estado vive en el ViewModel y se colecta con lifecycle',
        'Los composables no transforman datos ni contienen lógica',
        'Anotar @Stable solo si hay tipos inestables',
        'Usar remember solo para estado interno de Compose',
        'Evitar side effects; si son necesarios, extraerlos',
        'Añadir key a los items de listas con id único',
        'Cada Screen tiene un @Preview con estado realista',
      ],
    },
    pt: {
      kicker: 'Compose · Telas KMP',
      title: 'Arquitetura de telas Compose',
      subtitle:
        'A UI é burra: renderiza estado e encaminha ações. Aprenda estabilidade, propriedade do estado, side effects e leituras diferidas com demos interativas.',
      flowTitle: 'O fluxo de uma tela',
      steps: [
        { title: 'Screen', description: 'Renderiza o estado e encaminha ações. Zero lógica de negócio.' },
        { title: 'State', description: 'Vive no ViewModel como StateFlow e é coletado com lifecycle.' },
        { title: 'Action', description: 'Cada interação despacha uma ação tipada ao ViewModel.' },
        { title: 'Effect', description: 'Só quando o Compose exige, extraído em um composable dedicado.' },
      ],
      stabilityTitle: 'Simulador de estabilidade',
      stabilityDescription:
        'Atualize uma única nota e observe quantos cards recompõem com e sem @Stable.',
      stableOn: '@Stable ativado',
      stableOff: 'Sem @Stable',
      updateNote: 'Atualizar uma nota',
      reset: 'Reiniciar',
      parentRenders: 'Renders do contêiner',
      itemRenders: 'recomposições',
      lastUpdated: 'atualizada',
      stableExplanation:
        'A lista contém List<NoteUi>, um tipo que o compilador considera instável. Com @Stable, o Compose sabe que só uma nota mudou e recompõe apenas esse card.',
      unstableExplanation:
        'Sem @Stable, o compilador não confia na igualdade da lista: cada mudança do contêiner obriga a recompor todos os cards.',
      noteTitles: ['Notas de reunião', 'Lista de compras', 'Ideias de design'],
      ownershipTitle: 'Onde vive o estado?',
      ownershipDescription:
        'Escolha o lugar correto para cada tipo de estado. Reaja na hora como um linter mental.',
      ownershipScenarios: [
        {
          label: 'Texto do formulário',
          prompt: 'O texto que o usuário digita em um TextField deve viver em…',
          options: ['remember dentro do Screen', 'O ViewModel', 'rememberSaveable', 'Um CompositionLocal'],
          correctIndex: 1,
          explanation:
            'Todo o estado da aplicação vive no ViewModel. Cada tecla despacha uma ação que atualiza o StateFlow (e opcionalmente o SavedStateHandle).',
        },
        {
          label: 'Scroll da LazyColumn',
          prompt: 'A posição de scroll de uma LazyColumn deve viver em…',
          options: ['O ViewModel', 'rememberLazyListState', 'Um objeto global', 'SavedStateHandle'],
          correctIndex: 1,
          explanation:
            'LazyListState é estado interno do Compose que a biblioteca exige manter na composição. É a exceção aceita à regra do ViewModel.',
        },
        {
          label: 'Botão visível conforme scroll',
          prompt: 'Mostrar "ir para cima" quando firstVisibleItemIndex > 5 se resolve com…',
          options: ['LaunchedEffect', 'derivedStateOf sobre o LazyListState', 'Um Flow no ViewModel', 'SideEffect'],
          correctIndex: 1,
          explanation:
            'Aqui a derivação depende de estado interno do Compose. derivedStateOf evita recompor a cada pixel de scroll e é o uso legítimo dessa API.',
        },
        {
          label: 'Diálogo aberto',
          prompt: 'O estado de "diálogo de confirmação aberto" deve viver em…',
          options: ['O ViewModel', 'rememberSaveable', 'A Activity', 'Uma variável global'],
          correctIndex: 0,
          explanation:
            'É estado de tela com significado de negócio. O ViewModel o expõe no State e o Screen apenas renderiza. remember é para estado puramente visual.',
        },
      ],
      deferredTitle: 'Leituras diferidas',
      deferredDescription:
        'Mova o slider e compare ler o valor animado na composição vs diferi-lo para a fase de desenho.',
      deferredOn: 'graphicsLayer (diferido)',
      deferredOff: 'Modifier.alpha (na composição)',
      sliderLabel: 'Progresso da animação',
      composeReads: 'Leituras na composição',
      drawUpdates: 'Atualizações de desenho',
      deferredExplanation:
        'O valor é lido dentro de graphicsLayer {}. A animação roda na fase de desenho e não dispara recomposição: o contador de composição não se move.',
      immediateExplanation:
        'Modifier.alpha(alpha) lê o valor durante a composição. Cada mudança do slider recompõe o composable inteiro: o contador sobe a cada frame.',
      effectsTitle: 'Side effects: a alternativa correta',
      effectsDescription:
        'Antes de adicionar um efeito, pergunte se o ViewModel pode resolver com uma ação.',
      effectScenarios: [
        {
          label: 'Carregar ao entrar',
          prompt: 'Uma tela deve carregar seus dados ao aparecer. O que usa?',
          options: ['LaunchedEffect(Unit)', 'Uma ação do ViewModel no init', 'SideEffect', 'DisposableEffect'],
          correctIndex: 1,
          explanation:
            'Se o ViewModel pode fazer, que faça. Carregar dados é lógica de negócio: init do ViewModel ou uma ação disparada uma vez, não um efeito de UI.',
        },
        {
          label: 'Listener de lifecycle',
          prompt: 'Você precisa reagir a ON_START e ON_STOP. O que usa?',
          options: ['LaunchedEffect', 'Um composable com DisposableEffect', 'SideEffect', 'remember'],
          correctIndex: 1,
          explanation:
            'Quando não existe equivalente no ViewModel, extraia o observer para seu próprio composable com DisposableEffect e remova em onDispose.',
        },
        {
          label: 'Derivar do scroll',
          prompt: 'Calcular um valor a partir de LazyListState. O que usa?',
          options: ['LaunchedEffect', 'derivedStateOf', 'DisposableEffect', 'Um canal'],
          correctIndex: 1,
          explanation:
            'derivedStateOf é para estado interno do Compose. Só deve ser usado quando a derivação não pode ocorrer no ViewModel.',
        },
        {
          label: 'Snackbar após navegar',
          prompt: 'Mostrar um snackbar depois de uma ação de negócio. O que usa?',
          options: ['Um Event do ViewModel', 'LaunchedEffect no Screen', 'SideEffect', 'Um CompositionLocal'],
          correctIndex: 0,
          explanation:
            'O resultado é um evento de UI. O ViewModel o emite e o Screen observa; o efeito não é usado para inventar lógica.',
        },
      ],
      concept1Title: 'UI burra',
      concept1Body:
        'Composables renderizam estado e encaminham ações. Nada de transformar dados nem lógica de negócio dentro da árvore de UI.',
      concept2Title: 'Estado lifecycle-aware',
      concept2Body:
        'Colete com collectAsStateWithLifecycle() de org.jetbrains.androidx.lifecycle. No iOS é mapeado para ON_START / ON_STOP.',
      concept3Title: '@Stable só quando necessário',
      concept3Body:
        'Strong skipping está ativo por padrão. Anote apenas se o estado contém List, Map, Set, interfaces ou tipos abstratos.',
      codeStabilityTitle: 'Estabilidade no estado de lista',
      codeBadStability: `// Sem anotação: List é instável para o compilador
data class NoteListState(
    val notes: List<NoteUi> = emptyList(),
    val isLoading: Boolean = false
)`,
      codeGoodStability: `// @Stable: o compilador confia na lista
@Stable
data class NoteListState(
    val notes: List<NoteUi> = emptyList(),
    val isLoading: Boolean = false
)`,
      codeFieldTitle: 'TextField que despacha ações',
      codeBadField: `// ERRADO: estado local de domínio no composable
var title by remember { mutableStateOf("") }
TextField(
    value = title,
    onValueChange = { title = it }
)`,
      codeGoodField: `// CERTO: o estado vive no ViewModel
TextField(
    value = state.title,
    onValueChange = { onAction(NoteEditorAction.OnTitleChange(it)) }
)`,
      codeEffectTitle: 'Extrair efeitos para um composable',
      codeBadEffect: `// ERRADO: efeito e lógica misturados no Screen
LaunchedEffect(Unit) {
    if (isAndroid) loadFromAndroid()
}`,
      codeGoodEffect: `// CERTO: efeito extraído e atrás de um contrato
@Composable
fun ObserveLifecycle(onStart: () -> Unit, onStop: () -> Unit) {
    val owner = LocalLifecycleOwner.current
    DisposableEffect(owner) {
        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_START -> onStart()
                Lifecycle.Event.ON_STOP -> onStop()
                else -> Unit
            }
        }
        owner.lifecycle.addObserver(observer)
        onDispose { owner.lifecycle.removeObserver(observer) }
    }
}`,
      quiz: 'Qual anotação precisa um estado que contém List<NoteUi>?',
      quizOptions: ['Nenhuma, strong skipping resolve', '@Stable', '@Composable', '@Immutable sempre'],
      quizAnswer: 1,
      quizExplanation:
        'List é um tipo que o compilador considera instável. @Stable diz que pode confiar na igualdade e evita recompor demais.',
      checklistTitle: 'Checklist: projetar uma tela',
      checklist: [
        'O estado vive no ViewModel e é coletado com lifecycle',
        'Os composables não transformam dados nem contêm lógica',
        'Anotar @Stable apenas se houver tipos instáveis',
        'Usar remember apenas para estado interno do Compose',
        'Evitar side effects; se necessários, extraí-los',
        'Adicionar key aos itens de listas com id único',
        'Cada Screen tem um @Preview com estado realista',
      ],
    },
    en: {
      kicker: 'Compose · KMP screens',
      title: 'Compose screen architecture',
      subtitle:
        'The UI is dumb: it renders state and forwards actions. Learn stability, state ownership, side effects, and deferred reads with interactive demos.',
      flowTitle: 'A screen’s flow',
      steps: [
        { title: 'Screen', description: 'Renders state and forwards actions. No business logic.' },
        { title: 'State', description: 'Lives in the ViewModel as StateFlow and is collected with lifecycle.' },
        { title: 'Action', description: 'Every interaction dispatches a typed action to the ViewModel.' },
        { title: 'Effect', description: 'Only when Compose requires it, extracted into a dedicated composable.' },
      ],
      stabilityTitle: 'Stability simulator',
      stabilityDescription:
        'Update a single note and watch how many cards recompose with and without @Stable.',
      stableOn: '@Stable enabled',
      stableOff: 'No @Stable',
      updateNote: 'Update one note',
      reset: 'Reset',
      parentRenders: 'Container renders',
      itemRenders: 'recompositions',
      lastUpdated: 'updated',
      stableExplanation:
        'The list holds List<NoteUi>, a type the compiler considers unstable. With @Stable, Compose knows only one note changed and recomposes just that card.',
      unstableExplanation:
        'Without @Stable, the compiler cannot trust the list’s equality: every container change forces all cards to recompose.',
      noteTitles: ['Meeting notes', 'Shopping list', 'Design ideas'],
      ownershipTitle: 'Where does state live?',
      ownershipDescription:
        'Pick the right home for each kind of state. React instantly like a mental linter.',
      ownershipScenarios: [
        {
          label: 'Form text',
          prompt: 'The text a user types in a TextField should live in…',
          options: ['remember inside the Screen', 'The ViewModel', 'rememberSaveable', 'A CompositionLocal'],
          correctIndex: 1,
          explanation:
            'All application state lives in the ViewModel. Each keystroke dispatches an action that updates the StateFlow (and optionally SavedStateHandle).',
        },
        {
          label: 'LazyColumn scroll',
          prompt: 'The scroll position of a LazyColumn should live in…',
          options: ['The ViewModel', 'rememberLazyListState', 'A global object', 'SavedStateHandle'],
          correctIndex: 1,
          explanation:
            'LazyListState is Compose-internal state the library requires you to hold in composition. It is the accepted exception to the ViewModel rule.',
        },
        {
          label: 'Button visible on scroll',
          prompt: 'Showing “scroll to top” when firstVisibleItemIndex > 5 is solved with…',
          options: ['LaunchedEffect', 'derivedStateOf over LazyListState', 'A Flow in the ViewModel', 'SideEffect'],
          correctIndex: 1,
          explanation:
            'The derivation depends on Compose-internal state. derivedStateOf avoids recomposing on every scroll pixel and is the legitimate use of this API.',
        },
        {
          label: 'Open dialog',
          prompt: 'The “confirmation dialog open” state should live in…',
          options: ['The ViewModel', 'rememberSaveable', 'The Activity', 'A global variable'],
          correctIndex: 0,
          explanation:
            'It is screen state with business meaning. The ViewModel exposes it in its State and the Screen only renders. remember is for purely visual state.',
        },
      ],
      deferredTitle: 'Deferred reads',
      deferredDescription:
        'Move the slider and compare reading the animated value during composition vs deferring it to the draw phase.',
      deferredOn: 'graphicsLayer (deferred)',
      deferredOff: 'Modifier.alpha (in composition)',
      sliderLabel: 'Animation progress',
      composeReads: 'Composition reads',
      drawUpdates: 'Draw updates',
      deferredExplanation:
        'The value is read inside graphicsLayer {}. The animation runs in the draw phase and does not trigger recomposition: the composition counter stays still.',
      immediateExplanation:
        'Modifier.alpha(alpha) reads the value during composition. Every slider change recomposes the whole composable: the counter climbs on every frame.',
      effectsTitle: 'Side effects: the right alternative',
      effectsDescription:
        'Before adding an effect, ask whether the ViewModel can handle it with an action.',
      effectScenarios: [
        {
          label: 'Load on enter',
          prompt: 'A screen must load its data on appear. What do you use?',
          options: ['LaunchedEffect(Unit)', 'A ViewModel action in init', 'SideEffect', 'DisposableEffect'],
          correctIndex: 1,
          explanation:
            'If the ViewModel can do it, let it. Loading data is business logic: the ViewModel init or a once-triggered action, not a UI effect.',
        },
        {
          label: 'Lifecycle listener',
          prompt: 'You need to react to ON_START and ON_STOP. What do you use?',
          options: ['LaunchedEffect', 'A composable with DisposableEffect', 'SideEffect', 'remember'],
          correctIndex: 1,
          explanation:
            'When there is no ViewModel equivalent, extract the observer into its own composable with DisposableEffect and remove it in onDispose.',
        },
        {
          label: 'Derive from scroll',
          prompt: 'Computing a value from LazyListState. What do you use?',
          options: ['LaunchedEffect', 'derivedStateOf', 'DisposableEffect', 'A channel'],
          correctIndex: 1,
          explanation:
            'derivedStateOf is for Compose-internal state. Use it only when the derivation cannot happen in the ViewModel.',
        },
        {
          label: 'Snackbar after navigating',
          prompt: 'Showing a snackbar after a business action. What do you use?',
          options: ['A ViewModel Event', 'LaunchedEffect in the Screen', 'SideEffect', 'A CompositionLocal'],
          correctIndex: 0,
          explanation:
            'The result is a UI event. The ViewModel emits it and the Screen observes it; the effect is not used to invent logic.',
        },
      ],
      concept1Title: 'Dumb UI',
      concept1Body:
        'Composables render state and forward actions. No data transformation or business logic inside the UI tree.',
      concept2Title: 'Lifecycle-aware state',
      concept2Body:
        'Collect with collectAsStateWithLifecycle() from org.jetbrains.androidx.lifecycle. On iOS it maps to ON_START / ON_STOP.',
      concept3Title: '@Stable only when needed',
      concept3Body:
        'Strong skipping is on by default. Annotate only if the state holds List, Map, Set, interfaces, or abstract types.',
      codeStabilityTitle: 'Stability in list state',
      codeBadStability: `// No annotation: List is unstable to the compiler
data class NoteListState(
    val notes: List<NoteUi> = emptyList(),
    val isLoading: Boolean = false
)`,
      codeGoodStability: `// @Stable: the compiler trusts the list
@Stable
data class NoteListState(
    val notes: List<NoteUi> = emptyList(),
    val isLoading: Boolean = false
)`,
      codeFieldTitle: 'TextField dispatching actions',
      codeBadField: `// WRONG: local domain state in the composable
var title by remember { mutableStateOf("") }
TextField(
    value = title,
    onValueChange = { title = it }
)`,
      codeGoodField: `// RIGHT: state lives in the ViewModel
TextField(
    value = state.title,
    onValueChange = { onAction(NoteEditorAction.OnTitleChange(it)) }
)`,
      codeEffectTitle: 'Extract effects into a composable',
      codeBadEffect: `// WRONG: effect and logic mixed in the Screen
LaunchedEffect(Unit) {
    if (isAndroid) loadFromAndroid()
}`,
      codeGoodEffect: `// CORRECT: effect extracted behind a contract
@Composable
fun ObserveLifecycle(onStart: () -> Unit, onStop: () -> Unit) {
    val owner = LocalLifecycleOwner.current
    DisposableEffect(owner) {
        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_START -> onStart()
                Lifecycle.Event.ON_STOP -> onStop()
                else -> Unit
            }
        }
        owner.lifecycle.addObserver(observer)
        onDispose { owner.lifecycle.removeObserver(observer) }
    }
}`,
      quiz: 'Which annotation does a state holding List<NoteUi> need?',
      quizOptions: ['None, strong skipping handles it', '@Stable', '@Composable', '@Immutable always'],
      quizAnswer: 1,
      quizExplanation:
        'List is a type the compiler considers unstable. @Stable tells it to trust equality and avoids extra recompositions.',
      checklistTitle: 'Checklist: designing a screen',
      checklist: [
        'State lives in the ViewModel and is collected with lifecycle',
        'Composables do not transform data or hold logic',
        'Annotate @Stable only when unstable types are present',
        'Use remember only for Compose-internal state',
        'Avoid side effects; if needed, extract them',
        'Add keys to list items with a unique id',
        'Every Screen has a @Preview with realistic state',
      ],
    },
  }[language];

  const [stable, setStable] = useState(false);
  const [parentRenders, setParentRenders] = useState(0);
  const [itemRenders, setItemRenders] = useState<Record<string, number>>(emptyCounts);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const resetStability = (nextStable = stable) => {
    setStable(nextStable);
    setParentRenders(0);
    setItemRenders(emptyCounts());
    setLastUpdated(null);
  };

  const updateOneNote = () => {
    const target = 'n1';
    setParentRenders((value) => value + 1);
    setLastUpdated(target);
    setItemRenders((previous) => {
      const next = { ...previous };
      if (stable) {
        next[target] = (next[target] ?? 0) + 1;
      } else {
        NOTE_IDS.forEach((id) => {
          next[id] = (next[id] ?? 0) + 1;
        });
      }
      return next;
    });
  };

  const [ownershipScenario, setOwnershipScenario] = useState(0);
  const [effectScenario, setEffectScenario] = useState(0);

  const [progress, setProgress] = useState(35);
  const [deferred, setDeferred] = useState(true);
  const [composeReads, setComposeReads] = useState(0);
  const [drawUpdates, setDrawUpdates] = useState(0);

  const changeProgress = (value: number) => {
    setProgress(value);
    setDrawUpdates((count) => count + 1);
    if (!deferred) {
      setComposeReads((count) => count + 1);
    }
  };

  const ownership = t.ownershipScenarios[ownershipScenario];
  const effect = t.effectScenarios[effectScenario];

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

      <SimulatorFrame title={t.stabilityTitle} description={t.stabilityDescription}>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => resetStability(true)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              stable
                ? 'bg-brand text-on-brand'
                : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.stableOn}
          </button>
          <button
            onClick={() => resetStability(false)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              !stable
                ? 'bg-brand text-on-brand'
                : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.stableOff}
          </button>
          <span className="text-[11px] font-mono text-on-surface-variant ml-auto">
            {t.parentRenders}: <span className="text-brand font-bold">{parentRenders}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {NOTE_IDS.map((id, index) => {
            const count = itemRenders[id] ?? 0;
            const isUpdated = lastUpdated === id;
            return (
              <div
                key={id}
                className={`p-3 rounded-xl border space-y-2 transition-colors ${
                  isUpdated
                    ? 'bg-brand/10 border-brand/40'
                    : 'bg-surface-lowest border-outline-variant/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-on-surface-variant">{id}</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-surface-high text-[10px] font-mono text-brand">
                    {count} {t.itemRenders}
                  </span>
                </div>
                <p className="text-xs font-semibold text-on-surface leading-snug">
                  {t.noteTitles[index]}
                </p>
                {isUpdated && (
                  <span className="text-[10px] font-mono text-brand">● {t.lastUpdated}</span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={updateOneNote}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand text-on-brand text-xs font-bold"
          >
            <Repeat className="w-3.5 h-3.5" />
            {t.updateNote}
          </button>
          <button
            onClick={() => resetStability()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-high text-on-surface-variant text-xs font-semibold hover:text-on-surface"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t.reset}
          </button>
        </div>

        <Callout tone={stable ? 'brand' : 'warning'}>
          {stable ? t.stableExplanation : t.unstableExplanation}
        </Callout>
      </SimulatorFrame>

      <SkillSection title={t.ownershipTitle} description={t.ownershipDescription}>
        <div className="rounded-2xl bg-surface-low p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {t.ownershipScenarios.map((scenario, index) => (
              <button
                key={scenario.label}
                onClick={() => setOwnershipScenario(index)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold transition-colors ${
                  ownershipScenario === index
                    ? 'bg-brand text-on-brand'
                    : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {scenario.label}
              </button>
            ))}
          </div>
          <Quiz
            key={`ownership-${ownershipScenario}`}
            question={ownership.prompt}
            options={ownership.options}
            correctIndex={ownership.correctIndex}
            explanation={ownership.explanation}
          />
        </div>
      </SkillSection>

      <SimulatorFrame title={t.deferredTitle} description={t.deferredDescription}>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDeferred(true)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              deferred
                ? 'bg-brand text-on-brand'
                : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.deferredOn}
          </button>
          <button
            onClick={() => setDeferred(false)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              !deferred
                ? 'bg-brand text-on-brand'
                : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.deferredOff}
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant">
            <span>{t.sliderLabel}</span>
            <span className="text-brand font-bold">{progress}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(event) => changeProgress(Number(event.target.value))}
            className="w-full accent-brand"
          />
        </div>

        <div className="p-6 rounded-xl bg-surface-lowest flex items-center justify-center">
          <div
            className="w-16 h-16 rounded-2xl bg-brand transition-[opacity]"
            style={{ opacity: 0.2 + progress / 125 }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-surface-lowest space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
              {t.composeReads}
            </span>
            <p className="text-xl font-bold text-on-surface">{composeReads}</p>
          </div>
          <div className="p-3 rounded-xl bg-surface-lowest space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
              {t.drawUpdates}
            </span>
            <p className="text-xl font-bold text-brand">{drawUpdates}</p>
          </div>
        </div>

        <Callout tone={deferred ? 'brand' : 'warning'}>
          {deferred ? t.deferredExplanation : t.immediateExplanation}
        </Callout>
      </SimulatorFrame>

      <SkillSection title={t.effectsTitle} description={t.effectsDescription}>
        <div className="rounded-2xl bg-surface-low p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {t.effectScenarios.map((scenario, index) => (
              <button
                key={scenario.label}
                onClick={() => setEffectScenario(index)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold transition-colors ${
                  effectScenario === index
                    ? 'bg-brand text-on-brand'
                    : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {scenario.label}
              </button>
            ))}
          </div>
          <Quiz
            key={`effect-${effectScenario}`}
            question={effect.prompt}
            options={effect.options}
            correctIndex={effect.correctIndex}
            explanation={effect.explanation}
          />
        </div>
      </SkillSection>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ConceptCard icon={Sparkles} title={t.concept1Title}>
          {t.concept1Body}
        </ConceptCard>
        <ConceptCard icon={Activity} title={t.concept2Title} tone="brand">
          {t.concept2Body}
        </ConceptCard>
        <ConceptCard icon={Layers} title={t.concept3Title} tone="warning">
          {t.concept3Body}
        </ConceptCard>
      </div>

      <SkillSection title={t.codeStabilityTitle}>
        <CodeCompare
          title={t.codeStabilityTitle}
          badCode={t.codeBadStability}
          goodCode={t.codeGoodStability}
        />
      </SkillSection>

      <SkillSection title={t.codeFieldTitle}>
        <CodeCompare title={t.codeFieldTitle} badCode={t.codeBadField} goodCode={t.codeGoodField} />
      </SkillSection>

      <SkillSection title={t.codeEffectTitle}>
        <CodeCompare title={t.codeEffectTitle} badCode={t.codeBadEffect} goodCode={t.codeGoodEffect} />
      </SkillSection>

      <Quiz question={t.quiz} options={t.quizOptions} correctIndex={t.quizAnswer} explanation={t.quizExplanation} />

      <Checklist title={t.checklistTitle} items={t.checklist} />

      <div className="flex items-center gap-2 text-[11px] font-mono text-on-surface-variant">
        <MousePointerClick className="w-3.5 h-3.5 text-brand" />
        <ArrowRight className="w-3.5 h-3.5 text-brand" />
        <SlidersHorizontal className="w-3.5 h-3.5 text-brand" />
        <span>{t.flowTitle}</span>
        {stable && <CheckCircle2 className="w-3.5 h-3.5 text-brand ml-auto" />}
        {!stable && <Zap className="w-3.5 h-3.5 text-brand ml-auto" />}
      </div>
    </div>
  );
};
