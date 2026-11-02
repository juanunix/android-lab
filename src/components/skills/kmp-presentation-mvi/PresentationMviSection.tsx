import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Layers,
  MessageSquare,
  MousePointerClick,
  RefreshCw,
  Repeat,
  Save,
  Smartphone,
  Sparkles,
  XCircle,
  Zap,
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

type LogKind = 'action' | 'event' | 'nav';

interface LogEntry {
  id: number;
  kind: LogKind;
  text: string;
}

interface ClassifyItem {
  label: string;
  example: string;
  correct: 0 | 1;
}

interface Scenario {
  label: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const PresentationMviSection: React.FC = () => {
  const { language } = useLanguage();
  const t = {
    es: {
      kicker: 'Presentación · MVI multiplataforma',
      title: 'Presentación KMP con MVI',
      subtitle:
        'State, Action, Event opcional, ViewModel, UiText y SavedStateHandle en commonMain. Un solo flujo de datos para Android e iOS, con eventos solo cuando el ViewModel es el único que puede decidir.',
      flowTitle: 'Las piezas de una pantalla',
      steps: [
        { title: 'State', description: 'Una sola data class con todo el estado de UI y valores por defecto.' },
        { title: 'Action', description: 'Sealed interface con cada interacción del usuario.' },
        { title: 'ViewModel', description: 'StateFlow<State> y onAction(); el único dueño de la lógica.' },
        { title: 'Event', description: 'Opcional: solo efectos que únicamente el ViewModel puede decidir.' },
      ],
      simulatorTitle: 'Simulador de flujo MVI',
      simulatorDescription:
        'Interactúa con la pantalla y observa qué entra como Action, qué se actualiza en State y cuándo se emite un Event.',
      simulatorEventsOn: 'Events activados',
      simulatorEventsOff: 'Sin Events',
      simulatorRefresh: 'Refrescar',
      simulatorDelete: 'Borrar primera',
      simulatorReset: 'Reiniciar',
      simulatorNotes: 'Notas',
      simulatorEmpty: 'Sin notas',
      simulatorState: 'Estado expuesto',
      simulatorLog: 'Flujo de eventos',
      simulatorNoLog: 'Interactúa con la pantalla para ver el flujo.',
      simulatorClickHint: 'toca una nota',
      simulatorLoading: 'cargando…',
      simulatorSnackbar: 'Notas actualizadas',
      simulatorEventExplain:
        'Con Events, el snackbar se emite porque solo el ViewModel sabe que la carga terminó. Sin Events, el resultado se renderiza desde State.',
      simulatorNavExplain:
        'La navegación directa no pasa por el ViewModel: el Screen llama a onNoteClick en el onClick. No necesita Action ni Event.',
      eventsTitle: '¿Event o no?',
      eventsDescription:
        'Añade un Event solo cuando el ViewModel es el único que puede decidir el efecto. Elige el caso correcto.',
      eventScenarios: [
        {
          label: 'Login exitoso',
          prompt: 'Tras un login async exitoso hay que navegar al home. ¿Qué usas?',
          options: ['Un Event', 'Un boolean en State', 'Navegación directa en onClick', 'Un Action'],
          correctIndex: 0,
          explanation:
            'Solo el ViewModel sabe cuándo termina la llamada. LoginSucceeded es un Event legítimo porque la UI no puede decidirlo.',
        },
        {
          label: 'Abrir detalle',
          prompt: 'El usuario toca una nota y debe abrirse el detalle. ¿Qué usas?',
          options: ['Un Event', 'Un Action + Event', 'Navegación directa en onClick', 'State'],
          correctIndex: 2,
          explanation:
            'La UI puede decidirlo sola. Llama a onNoteClick directamente desde el item; no hagas roundtrip por onAction ni Events.',
        },
        {
          label: 'Diálogo de confirmación',
          prompt: 'Mostrar un diálogo de confirmación cuando se pulsa borrar. ¿Qué usas?',
          options: ['Un Event', 'Un boolean o nullable en State', 'Un Channel', 'Un CompositionLocal'],
          correctIndex: 1,
          explanation:
            'La visibilidad del diálogo se puede derivar y observar desde State. No necesita un Event.',
        },
        {
          label: 'Snackbar por error de red',
          prompt: 'Un error de red debe mostrarse como snackbar. ¿Qué usas?',
          options: ['Un Event', 'Navegación directa', 'Un Action', 'remember'],
          correctIndex: 0,
          explanation:
            'El ViewModel transforma el error en UiText y emite ShowSnackbar. Es un efecto de una sola vez que solo él puede decidir.',
        },
      ],
      uiTextTitle: 'UiText vs String',
      uiTextDescription:
        'Clasifica cada valor: UiText cuando podría venir de un recurso localizable; String cuando siempre es dinámico.',
      uiTextLabels: { correct: 'Correcto', incorrect: 'Incorrecto' },
      uiTextItems: [
        {
          label: 'Mensaje de error de red',
          example: 'error = UiText.Resource(Res.string.network_error)',
          correct: 0,
        },
        {
          label: 'Nombre del usuario',
          example: 'authorName = "Philipp"',
          correct: 1,
        },
        {
          label: 'Fecha formateada',
          example: 'formattedDate = "15 mar 2026"',
          correct: 1,
        },
        {
          label: 'Mensaje de validación',
          example: 'validationError = UiText.Resource(Res.string.invalid_email)',
          correct: 0,
        },
      ],
      uiTextExplainUiText:
        'Viene (o podría venir) de Res.string.* y debe resolverse con asString() en Compose o asStringAsync() fuera de composición.',
      uiTextExplainString:
        'Siempre es dinámico y nunca viene de recursos. Exponlo como String directamente en el estado o UI model.',
      splitTitle: 'Root vs Screen',
      splitDescription:
        'Asigna cada responsabilidad al composable que le corresponde.',
      splitLabels: { correct: 'Correcto', incorrect: 'Incorrecto' },
      splitItems: [
        {
          label: 'Contiene koinViewModel()',
          example: 'viewModel: NoteListViewModel = koinViewModel()',
          correct: 0,
        },
        {
          label: 'Recibe state y onAction',
          example: 'fun NoteListScreen(state: NoteListState, onAction: (NoteListAction) -> Unit)',
          correct: 1,
        },
        {
          label: 'Se puede previsualizar con @Preview',
          example: '@Preview fun NoteListScreenPreview()',
          correct: 1,
        },
        {
          label: 'Observa events con ObserveAsEvents',
          example: 'ObserveAsEvents(viewModel.events) { … }',
          correct: 0,
        },
        {
          label: 'Colecta el StateFlow con lifecycle',
          example: 'viewModel.state.collectAsStateWithLifecycle()',
          correct: 0,
        },
        {
          label: 'Llama a la navegación directa en onClick',
          example: 'onNoteClick = onNavigateToDetail',
          correct: 1,
        },
      ],
      splitExplainRoot:
        'El Root es dueño del ViewModel: lo inyecta, colecta el estado con lifecycle y añade ObserveAsEvents solo si existen events.',
      splitExplainScreen:
        'El Screen es puro: state + onAction + callbacks directos. Sin ViewModel, así que se puede previsualizar y testear aislado.',
      deathTitle: 'Muerte de proceso con SavedStateHandle',
      deathDescription:
        'Elige qué campos sobreviven a la muerte del proceso. Solo guarda lo esencial; no el estado completo.',
      deathKill: 'Simular muerte de proceso',
      deathRestore: 'Volver a la vida',
      deathFields: 'Campos del formulario',
      deathCurrent: 'Antes',
      deathRestored: 'Después',
      deathSurvives: 'sobrevive',
      deathLost: 'se pierde',
      deathNotSavedLabel: 'sin guardar',
      deathWarning:
        'SavedStateHandle puede guardar primitivas, String y listas de estos. Nada de Parcelable: serializa estructuras como String con kotlinx.serialization. En iOS no se restaura automáticamente si la app se mata.',
      deathFieldTitle: 'title',
      deathFieldBody: 'body',
      deathFieldLoading: 'isLoading',
      deathFieldDialog: 'dialogVisible',
      deathTitleValue: 'Notas de reunión',
      deathBodyValue: 'Revisar arquitectura KMP',
      deathEssential: 'esencial',
      deathNotEssential: 'no esencial',
      concept1Title: 'State único',
      concept1Body:
        'Un solo data class con valores por defecto. Se actualiza siempre con .update { it.copy(...) }, nunca reemplazando el flow.',
      concept2Title: 'Event opcional',
      concept2Body:
        'Sin efecto de una sola vez que solo el ViewModel decida, no definas Event, ni Channel, ni events Flow.',
      concept3Title: 'Nombres predecibles',
      concept3Body:
        'NoteListViewModel, NoteListState, NoteListAction, NoteListRoot, NoteListScreen y NoteUi. Siempre con esos sufijos.',
      codeStateTitle: 'Actualizar State, no reemplazar el flow',
      codeBadState: `// MAL: se pierde cualquier valor previo y se rompe la fuente única
_state.value = NoteListState(notes = loadedNotes)`,
      codeGoodState: `// BIEN: copia inmutable del estado
_state.update { it.copy(isLoading = true) }
_state.update { it.copy(notes = loadedNotes, isLoading = false) }`,
      codeEventsTitle: 'Event solo para lo que el ViewModel decide',
      codeBadEvents: `// MAL: Event para algo que el Screen puede hacer solo
onAction(NoteListAction.OnNoteClick(noteId)) // → Event(Navigate)`,
      codeGoodEvents: `// BIEN: navegación directa desde el click
NoteItem(
    note = note,
    onNoteClick = { onNoteClick(note.id) }
)`,
      codeSplitTitle: 'Root y Screen en el mismo archivo',
      codeBadSplit: `// MAL: el Screen depende del ViewModel
@Composable
fun NoteListScreen(viewModel: NoteListViewModel) {
    val state by viewModel.state.collectAsStateWithLifecycle()
}`,
      codeGoodSplit: `// BIEN: Root dueño del ViewModel, Screen puro
@Composable
fun NoteListRoot(viewModel: NoteListViewModel = koinViewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    NoteListScreen(state = state, onAction = viewModel::onAction)
}

@Composable
fun NoteListScreen(state: NoteListState, onAction: (NoteListAction) -> Unit) { … }`,
      quiz: '¿Cuándo debes añadir un Event a la pantalla?',
      quizOptions: [
        'Siempre, es parte obligatoria de MVI',
        'Cuando el ViewModel debe empujar un efecto de una sola vez que solo él puede decidir',
        'Para abrir un diálogo',
        'Para navegar desde un botón',
      ],
      quizAnswer: 1,
      quizExplanation:
        'Los Events solo existen para efectos de una sola vez que el ViewModel decide. Diálogos y navegación directa se resuelven con State o callbacks del Screen.',
      checklistTitle: 'Checklist: nueva pantalla',
      checklist: [
        'Definir State y Action en feature:presentation',
        'Decidir si hace falta Event; si no, omitir Channel y events Flow',
        'Implementar el ViewModel con StateFlow y onAction',
        'Crear <Screen>Root con el ViewModel y ObserveAsEvents solo si hay events',
        'Crear <Screen>Screen puro: state + onAction + navegación directa',
        'La navegación por click directo no pasa por onAction',
        'Mapear errores a UiText con extensiones de DataError',
        'Añadir SavedStateHandle solo a los campos esenciales',
        'Nombrar con sufijos ViewModel / State / Action / Root / Screen / Ui',
      ],
    },
    pt: {
      kicker: 'Apresentação · MVI multiplataforma',
      title: 'Apresentação KMP com MVI',
      subtitle:
        'State, Action, Event opcional, ViewModel, UiText e SavedStateHandle em commonMain. Um único fluxo de dados para Android e iOS, com eventos só quando o ViewModel é o único que pode decidir.',
      flowTitle: 'As peças de uma tela',
      steps: [
        { title: 'State', description: 'Uma única data class com todo o estado da UI e valores padrão.' },
        { title: 'Action', description: 'Sealed interface com cada interação do usuário.' },
        { title: 'ViewModel', description: 'StateFlow<State> e onAction(); o único dono da lógica.' },
        { title: 'Event', description: 'Opcional: apenas efeitos que só o ViewModel pode decidir.' },
      ],
      simulatorTitle: 'Simulador de fluxo MVI',
      simulatorDescription:
        'Interaja com a tela e veja o que entra como Action, o que atualiza o State e quando um Event é emitido.',
      simulatorEventsOn: 'Events ativados',
      simulatorEventsOff: 'Sem Events',
      simulatorRefresh: 'Atualizar',
      simulatorDelete: 'Excluir primeira',
      simulatorReset: 'Reiniciar',
      simulatorNotes: 'Notas',
      simulatorEmpty: 'Sem notas',
      simulatorState: 'Estado exposto',
      simulatorLog: 'Fluxo de eventos',
      simulatorNoLog: 'Interaja com a tela para ver o fluxo.',
      simulatorClickHint: 'toque numa nota',
      simulatorLoading: 'carregando…',
      simulatorSnackbar: 'Notas atualizadas',
      simulatorEventExplain:
        'Com Events, o snackbar é emitido porque só o ViewModel sabe que o carregamento terminou. Sem Events, o resultado é renderizado a partir do State.',
      simulatorNavExplain:
        'A navegação direta não passa pelo ViewModel: o Screen chama onNoteClick no onClick. Não precisa de Action nem Event.',
      eventsTitle: 'Event ou não?',
      eventsDescription:
        'Adicione um Event apenas quando o ViewModel é o único que pode decidir o efeito. Escolha o caso correto.',
      eventScenarios: [
        {
          label: 'Login bem-sucedido',
          prompt: 'Após um login async bem-sucedido é preciso navegar para o home. O que usa?',
          options: ['Um Event', 'Um boolean no State', 'Navegação direta no onClick', 'Um Action'],
          correctIndex: 0,
          explanation:
            'Só o ViewModel sabe quando a chamada termina. LoginSucceeded é um Event legítimo porque a UI não pode decidir.',
        },
        {
          label: 'Abrir detalhe',
          prompt: 'O usuário toca numa nota e o detalhe deve abrir. O que usa?',
          options: ['Um Event', 'Um Action + Event', 'Navegação direta no onClick', 'State'],
          correctIndex: 2,
          explanation:
            'A UI pode decidir sozinha. Chame onNoteClick direto do item; não faça roundtrip por onAction nem Events.',
        },
        {
          label: 'Diálogo de confirmação',
          prompt: 'Mostrar um diálogo de confirmação ao tocar em excluir. O que usa?',
          options: ['Um Event', 'Um boolean ou nullable no State', 'Um Channel', 'Um CompositionLocal'],
          correctIndex: 1,
          explanation:
            'A visibilidade do diálogo pode ser derivada e observada a partir do State. Não precisa de Event.',
        },
        {
          label: 'Snackbar por erro de rede',
          prompt: 'Um erro de rede deve aparecer como snackbar. O que usa?',
          options: ['Um Event', 'Navegação direta', 'Um Action', 'remember'],
          correctIndex: 0,
          explanation:
            'O ViewModel transforma o erro em UiText e emite ShowSnackbar. É um efeito pontual que só ele pode decidir.',
        },
      ],
      uiTextTitle: 'UiText vs String',
      uiTextDescription:
        'Classifique cada valor: UiText quando pode vir de um recurso localizável; String quando é sempre dinâmico.',
      uiTextLabels: { correct: 'Correto', incorrect: 'Incorreto' },
      uiTextItems: [
        {
          label: 'Mensagem de erro de rede',
          example: 'error = UiText.Resource(Res.string.network_error)',
          correct: 0,
        },
        {
          label: 'Nome do usuário',
          example: 'authorName = "Philipp"',
          correct: 1,
        },
        {
          label: 'Data formatada',
          example: 'formattedDate = "15 mar 2026"',
          correct: 1,
        },
        {
          label: 'Mensagem de validação',
          example: 'validationError = UiText.Resource(Res.string.invalid_email)',
          correct: 0,
        },
      ],
      uiTextExplainUiText:
        'Vem (ou pode vir) de Res.string.* e deve ser resolvido com asString() no Compose ou asStringAsync() fora da composição.',
      uiTextExplainString:
        'É sempre dinâmico e nunca vem de recursos. Exponha como String direto no estado ou UI model.',
      splitTitle: 'Root vs Screen',
      splitDescription:
        'Atribua cada responsabilidade ao composable correspondente.',
      splitLabels: { correct: 'Correto', incorrect: 'Incorreto' },
      splitItems: [
        {
          label: 'Contém koinViewModel()',
          example: 'viewModel: NoteListViewModel = koinViewModel()',
          correct: 0,
        },
        {
          label: 'Recebe state e onAction',
          example: 'fun NoteListScreen(state: NoteListState, onAction: (NoteListAction) -> Unit)',
          correct: 1,
        },
        {
          label: 'Pode ser previsualizado com @Preview',
          example: '@Preview fun NoteListScreenPreview()',
          correct: 1,
        },
        {
          label: 'Observa events com ObserveAsEvents',
          example: 'ObserveAsEvents(viewModel.events) { … }',
          correct: 0,
        },
        {
          label: 'Coleta o StateFlow com lifecycle',
          example: 'viewModel.state.collectAsStateWithLifecycle()',
          correct: 0,
        },
        {
          label: 'Chama a navegação direta no onClick',
          example: 'onNoteClick = onNavigateToDetail',
          correct: 1,
        },
      ],
      splitExplainRoot:
        'O Root é dono do ViewModel: injeta, coleta o estado com lifecycle e adiciona ObserveAsEvents apenas se existirem events.',
      splitExplainScreen:
        'O Screen é puro: state + onAction + callbacks diretos. Sem ViewModel, então pode ser previsualizado e testado isolado.',
      deathTitle: 'Morte de processo com SavedStateHandle',
      deathDescription:
        'Escolha quais campos sobrevivem à morte do processo. Guarde apenas o essencial; não o estado inteiro.',
      deathKill: 'Simular morte de processo',
      deathRestore: 'Voltar à vida',
      deathFields: 'Campos do formulário',
      deathCurrent: 'Antes',
      deathRestored: 'Depois',
      deathSurvives: 'sobrevive',
      deathLost: 'se perde',
      deathNotSavedLabel: 'sem salvar',
      deathWarning:
        'SavedStateHandle pode guardar primitivas, String e listas destes. Nada de Parcelable: serialize estruturas como String com kotlinx.serialization. No iOS não é restaurado automaticamente se o app for morto.',
      deathFieldTitle: 'title',
      deathFieldBody: 'body',
      deathFieldLoading: 'isLoading',
      deathFieldDialog: 'dialogVisible',
      deathTitleValue: 'Notas de reunião',
      deathBodyValue: 'Revisar arquitetura KMP',
      deathEssential: 'essencial',
      deathNotEssential: 'não essencial',
      concept1Title: 'State único',
      concept1Body:
        'Uma única data class com valores padrão. Atualize sempre com .update { it.copy(...) }, nunca substituindo o flow.',
      concept2Title: 'Event opcional',
      concept2Body:
        'Sem efeito pontual que só o ViewModel decida, não defina Event, Channel nem events Flow.',
      concept3Title: 'Nomes previsíveis',
      concept3Body:
        'NoteListViewModel, NoteListState, NoteListAction, NoteListRoot, NoteListScreen e NoteUi. Sempre com esses sufixos.',
      codeStateTitle: 'Atualizar State, não substituir o flow',
      codeBadState: `// ERRADO: perde qualquer valor anterior e quebra a fonte única
_state.value = NoteListState(notes = loadedNotes)`,
      codeGoodState: `// CERTO: cópia imutável do estado
_state.update { it.copy(isLoading = true) }
_state.update { it.copy(notes = loadedNotes, isLoading = false) }`,
      codeEventsTitle: 'Event só para o que o ViewModel decide',
      codeBadEvents: `// ERRADO: Event para algo que o Screen faz sozinho
onAction(NoteListAction.OnNoteClick(noteId)) // → Event(Navigate)`,
      codeGoodEvents: `// CERTO: navegação direta do click
NoteItem(
    note = note,
    onNoteClick = { onNoteClick(note.id) }
)`,
      codeSplitTitle: 'Root e Screen no mesmo arquivo',
      codeBadSplit: `// ERRADO: o Screen depende do ViewModel
@Composable
fun NoteListScreen(viewModel: NoteListViewModel) {
    val state by viewModel.state.collectAsStateWithLifecycle()
}`,
      codeGoodSplit: `// CERTO: Root dono do ViewModel, Screen puro
@Composable
fun NoteListRoot(viewModel: NoteListViewModel = koinViewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    NoteListScreen(state = state, onAction = viewModel::onAction)
}

@Composable
fun NoteListScreen(state: NoteListState, onAction: (NoteListAction) -> Unit) { … }`,
      quiz: 'Quando você deve adicionar um Event à tela?',
      quizOptions: [
        'Sempre, é parte obrigatória do MVI',
        'Quando o ViewModel deve empurrar um efeito pontual que só ele pode decidir',
        'Para abrir um diálogo',
        'Para navegar a partir de um botão',
      ],
      quizAnswer: 1,
      quizExplanation:
        'Events existem apenas para efeitos pontuais que o ViewModel decide. Diálogos e navegação direta se resolvem com State ou callbacks do Screen.',
      checklistTitle: 'Checklist: nova tela',
      checklist: [
        'Definir State e Action em feature:presentation',
        'Decidir se precisa de Event; se não, omitir Channel e events Flow',
        'Implementar o ViewModel com StateFlow e onAction',
        'Criar <Screen>Root com o ViewModel e ObserveAsEvents apenas se houver events',
        'Criar <Screen>Screen puro: state + onAction + navegação direta',
        'A navegação por click direto não passa por onAction',
        'Mapear erros para UiText com extensões de DataError',
        'Adicionar SavedStateHandle apenas aos campos essenciais',
        'Nomear com sufixos ViewModel / State / Action / Root / Screen / Ui',
      ],
    },
    en: {
      kicker: 'Presentation · Cross-platform MVI',
      title: 'KMP presentation with MVI',
      subtitle:
        'State, Action, optional Event, ViewModel, UiText, and SavedStateHandle in commonMain. One data flow for Android and iOS, with events only when the ViewModel is the only one that can decide.',
      flowTitle: 'The pieces of a screen',
      steps: [
        { title: 'State', description: 'A single data class with all UI state and default values.' },
        { title: 'Action', description: 'A sealed interface with every user interaction.' },
        { title: 'ViewModel', description: 'StateFlow<State> and onAction(); the sole owner of logic.' },
        { title: 'Event', description: 'Optional: only effects that solely the ViewModel can decide.' },
      ],
      simulatorTitle: 'MVI flow simulator',
      simulatorDescription:
        'Interact with the screen and watch what enters as an Action, what updates State, and when an Event is emitted.',
      simulatorEventsOn: 'Events enabled',
      simulatorEventsOff: 'No Events',
      simulatorRefresh: 'Refresh',
      simulatorDelete: 'Delete first',
      simulatorReset: 'Reset',
      simulatorNotes: 'Notes',
      simulatorEmpty: 'No notes',
      simulatorState: 'Exposed state',
      simulatorLog: 'Flow log',
      simulatorNoLog: 'Interact with the screen to see the flow.',
      simulatorClickHint: 'tap a note',
      simulatorLoading: 'loading…',
      simulatorSnackbar: 'Notes updated',
      simulatorEventExplain:
        'With Events, the snackbar is emitted because only the ViewModel knows the load finished. Without Events, the result is rendered from State.',
      simulatorNavExplain:
        'Direct navigation does not go through the ViewModel: the Screen calls onNoteClick in onClick. It needs no Action or Event.',
      eventsTitle: 'Event or not?',
      eventsDescription:
        'Add an Event only when the ViewModel is the only one that can decide the effect. Pick the right case.',
      eventScenarios: [
        {
          label: 'Successful login',
          prompt: 'After a successful async login you must navigate home. What do you use?',
          options: ['An Event', 'A boolean in State', 'Direct navigation in onClick', 'An Action'],
          correctIndex: 0,
          explanation:
            'Only the ViewModel knows when the call finishes. LoginSucceeded is a legitimate Event because the UI cannot decide it.',
        },
        {
          label: 'Open detail',
          prompt: 'The user taps a note and the detail must open. What do you use?',
          options: ['An Event', 'An Action + Event', 'Direct navigation in onClick', 'State'],
          correctIndex: 2,
          explanation:
            'The UI can decide on its own. Call onNoteClick directly from the item; do not round-trip through onAction or Events.',
        },
        {
          label: 'Confirmation dialog',
          prompt: 'Show a confirmation dialog when delete is tapped. What do you use?',
          options: ['An Event', 'A boolean or nullable in State', 'A Channel', 'A CompositionLocal'],
          correctIndex: 1,
          explanation:
            'Dialog visibility can be derived and observed from State. It needs no Event.',
        },
        {
          label: 'Network error snackbar',
          prompt: 'A network error must show as a snackbar. What do you use?',
          options: ['An Event', 'Direct navigation', 'An Action', 'remember'],
          correctIndex: 0,
          explanation:
            'The ViewModel turns the error into UiText and emits ShowSnackbar. It is a one-time effect only it can decide.',
        },
      ],
      uiTextTitle: 'UiText vs String',
      uiTextDescription:
        'Classify each value: UiText when it could come from a localizable resource; String when it is always dynamic.',
      uiTextLabels: { correct: 'Correct', incorrect: 'Incorrect' },
      uiTextItems: [
        {
          label: 'Network error message',
          example: 'error = UiText.Resource(Res.string.network_error)',
          correct: 0,
        },
        {
          label: 'User name',
          example: 'authorName = "Philipp"',
          correct: 1,
        },
        {
          label: 'Formatted date',
          example: 'formattedDate = "Mar 15, 2026"',
          correct: 1,
        },
        {
          label: 'Validation message',
          example: 'validationError = UiText.Resource(Res.string.invalid_email)',
          correct: 0,
        },
      ],
      uiTextExplainUiText:
        'It comes (or could come) from Res.string.* and must be resolved with asString() in Compose or asStringAsync() outside composition.',
      uiTextExplainString:
        'It is always dynamic and never comes from resources. Expose it as a plain String in state or the UI model.',
      splitTitle: 'Root vs Screen',
      splitDescription:
        'Assign each responsibility to the composable it belongs to.',
      splitLabels: { correct: 'Correct', incorrect: 'Incorrect' },
      splitItems: [
        {
          label: 'Holds koinViewModel()',
          example: 'viewModel: NoteListViewModel = koinViewModel()',
          correct: 0,
        },
        {
          label: 'Receives state and onAction',
          example: 'fun NoteListScreen(state: NoteListState, onAction: (NoteListAction) -> Unit)',
          correct: 1,
        },
        {
          label: 'Can be previewed with @Preview',
          example: '@Preview fun NoteListScreenPreview()',
          correct: 1,
        },
        {
          label: 'Observes events with ObserveAsEvents',
          example: 'ObserveAsEvents(viewModel.events) { … }',
          correct: 0,
        },
        {
          label: 'Collects the StateFlow with lifecycle',
          example: 'viewModel.state.collectAsStateWithLifecycle()',
          correct: 0,
        },
        {
          label: 'Invokes direct navigation in onClick',
          example: 'onNoteClick = onNavigateToDetail',
          correct: 1,
        },
      ],
      splitExplainRoot:
        'The Root owns the ViewModel: it injects it, collects state with lifecycle, and adds ObserveAsEvents only when events exist.',
      splitExplainScreen:
        'The Screen is pure: state + onAction + direct callbacks. No ViewModel, so it can be previewed and tested in isolation.',
      deathTitle: 'Process death with SavedStateHandle',
      deathDescription:
        'Pick which fields survive process death. Save only what matters; not the whole state.',
      deathKill: 'Simulate process death',
      deathRestore: 'Bring back to life',
      deathFields: 'Form fields',
      deathCurrent: 'Before',
      deathRestored: 'After',
      deathSurvives: 'survives',
      deathLost: 'is lost',
      deathNotSavedLabel: 'not saved',
      deathWarning:
        'SavedStateHandle can store primitives, String, and lists of them. No Parcelable: serialize structures as String with kotlinx.serialization. On iOS it is not restored automatically if the app is killed.',
      deathFieldTitle: 'title',
      deathFieldBody: 'body',
      deathFieldLoading: 'isLoading',
      deathFieldDialog: 'dialogVisible',
      deathTitleValue: 'Meeting notes',
      deathBodyValue: 'Review KMP architecture',
      deathEssential: 'essential',
      deathNotEssential: 'not essential',
      concept1Title: 'Single State',
      concept1Body:
        'One data class with default values. Always update with .update { it.copy(...) }, never by replacing the flow.',
      concept2Title: 'Optional Event',
      concept2Body:
        'Without a one-time effect only the ViewModel decides, define no Event, no Channel, and no events Flow.',
      concept3Title: 'Predictable names',
      concept3Body:
        'NoteListViewModel, NoteListState, NoteListAction, NoteListRoot, NoteListScreen, and NoteUi. Always with those suffixes.',
      codeStateTitle: 'Update State, do not replace the flow',
      codeBadState: `// WRONG: loses any previous value and breaks the single source
_state.value = NoteListState(notes = loadedNotes)`,
      codeGoodState: `// RIGHT: immutable copy of the state
_state.update { it.copy(isLoading = true) }
_state.update { it.copy(notes = loadedNotes, isLoading = false) }`,
      codeEventsTitle: 'Event only for what the ViewModel decides',
      codeBadEvents: `// WRONG: Event for something the Screen can do alone
onAction(NoteListAction.OnNoteClick(noteId)) // → Event(Navigate)`,
      codeGoodEvents: `// RIGHT: direct navigation from the click
NoteItem(
    note = note,
    onNoteClick = { onNoteClick(note.id) }
)`,
      codeSplitTitle: 'Root and Screen in the same file',
      codeBadSplit: `// WRONG: the Screen depends on the ViewModel
@Composable
fun NoteListScreen(viewModel: NoteListViewModel) {
    val state by viewModel.state.collectAsStateWithLifecycle()
}`,
      codeGoodSplit: `// RIGHT: Root owns the ViewModel, Screen is pure
@Composable
fun NoteListRoot(viewModel: NoteListViewModel = koinViewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    NoteListScreen(state = state, onAction = viewModel::onAction)
}

@Composable
fun NoteListScreen(state: NoteListState, onAction: (NoteListAction) -> Unit) { … }`,
      quiz: 'When should you add an Event to the screen?',
      quizOptions: [
        'Always, it is a mandatory part of MVI',
        'When the ViewModel must push a one-time effect only it can decide',
        'To open a dialog',
        'To navigate from a button',
      ],
      quizAnswer: 1,
      quizExplanation:
        'Events exist only for one-time effects the ViewModel decides. Dialogs and direct navigation are handled with State or Screen callbacks.',
      checklistTitle: 'Checklist: new screen',
      checklist: [
        'Define State and Action in feature:presentation',
        'Decide whether an Event is needed; if not, skip Channel and events Flow',
        'Implement the ViewModel with StateFlow and onAction',
        'Create <Screen>Root with the ViewModel and ObserveAsEvents only if events exist',
        'Create a pure <Screen>Screen: state + onAction + direct navigation',
        'Click-triggered navigation does not go through onAction',
        'Map errors to UiText with DataError extensions',
        'Add SavedStateHandle only for essential fields',
        'Name with ViewModel / State / Action / Root / Screen / Ui suffixes',
      ],
    },
  }[language];

  const [eventsEnabled, setEventsEnabled] = useState(true);
  const [notes, setNotes] = useState<string[]>(['n1', 'n2', 'n3']);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const logId = useRef(0);

  const pushLog = (kind: LogKind, text: string) => {
    const entry: LogEntry = { id: ++logId.current, kind, text };
    setLog((previous) => [entry, ...previous].slice(0, 5));
  };

  const resetFlow = () => {
    setNotes(['n1', 'n2', 'n3']);
    setIsLoading(false);
    setSelectedId(null);
    setLog([]);
  };

  const refresh = () => {
    pushLog('action', 'OnRefreshClick → viewModel.onAction()');
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      if (eventsEnabled) {
        pushLog('event', t.simulatorSnackbar + ' → Event(ShowSnackbar)');
      }
    }, 700);
  };

  const deleteFirst = () => {
    if (notes.length === 0) return;
    const target = notes[0];
    setNotes((previous) => previous.slice(1));
    setSelectedId((current) => (current === target ? null : current));
    pushLog('action', `OnDeleteNote("${target}") → _state.update { … }`);
  };

  const clickNote = (id: string) => {
    setSelectedId(id);
    pushLog('nav', `onNoteClick("${id}") → navegación directa`);
  };

  const noteTitle = (id: string) => t.simulatorNotes + ' ' + id.replace('n', '');

  const [eventScenario, setEventScenario] = useState(0);
  const event = t.eventScenarios[eventScenario];

  const [savedFields, setSavedFields] = useState<Set<string>>(() => new Set(['title', 'body']));
  const [killed, setKilled] = useState(false);

  const deathFields = [
    { key: 'title', label: t.deathFieldTitle, value: t.deathTitleValue, essential: true },
    { key: 'body', label: t.deathFieldBody, value: t.deathBodyValue, essential: true },
    { key: 'isLoading', label: t.deathFieldLoading, value: 'false', essential: false },
    { key: 'dialogVisible', label: t.deathFieldDialog, value: 'false', essential: false },
  ];

  const toggleSaved = (key: string) => {
    setSavedFields((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setKilled(false);
  };

  const hasNonEssential = Array.from(savedFields).some(
    (key) => !deathFields.find((field) => field.key === key)?.essential
  );

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

      <SimulatorFrame title={t.simulatorTitle} description={t.simulatorDescription}>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setEventsEnabled(true)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              eventsEnabled
                ? 'bg-brand text-on-brand'
                : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.simulatorEventsOn}
          </button>
          <button
            onClick={() => setEventsEnabled(false)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              !eventsEnabled
                ? 'bg-brand text-on-brand'
                : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.simulatorEventsOff}
          </button>
          <button
            onClick={resetFlow}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-high text-on-surface-variant text-xs font-semibold hover:text-on-surface"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t.simulatorReset}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-surface-lowest space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface">{t.simulatorNotes}</span>
              {isLoading && (
                <span className="text-[10px] font-mono text-brand animate-pulse">{t.simulatorLoading}</span>
              )}
            </div>
            <div className="space-y-1.5">
              {notes.length === 0 ? (
                <p className="text-[11px] text-on-surface-variant">{t.simulatorEmpty}</p>
              ) : (
                notes.map((id) => (
                  <button
                    key={id}
                    onClick={() => clickNote(id)}
                    className={`w-full text-left p-2.5 rounded-lg text-[11px] font-semibold transition-colors ${
                      selectedId === id
                        ? 'bg-brand/15 text-brand'
                        : 'bg-surface-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {noteTitle(id)}
                    <span className="block text-[9px] font-mono text-on-surface-variant mt-0.5">
                      {t.simulatorClickHint}
                    </span>
                  </button>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={refresh}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand text-on-brand text-[11px] font-bold"
              >
                <Repeat className="w-3.5 h-3.5" />
                {t.simulatorRefresh}
              </button>
              <button
                onClick={deleteFirst}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-high text-on-surface-variant text-[11px] font-semibold hover:text-on-surface"
              >
                <XCircle className="w-3.5 h-3.5" />
                {t.simulatorDelete}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-surface-lowest space-y-1">
              <p className="ds-label text-on-surface-variant">{t.simulatorState}</p>
              <pre className="text-[10px] font-mono text-sky-300 whitespace-pre-wrap leading-relaxed">
{`NoteListState(
  notes = ${notes.length},
  isLoading = ${isLoading},
  selectedId = ${selectedId ? `"${selectedId}"` : 'null'}
)`}
              </pre>
            </div>
            <div className="p-3 rounded-xl bg-surface-lowest space-y-2">
              <p className="ds-label text-on-surface-variant">{t.simulatorLog}</p>
              {log.length === 0 ? (
                <p className="text-[10px] text-on-surface-variant">{t.simulatorNoLog}</p>
              ) : (
                <ul className="space-y-1">
                  {log.map((entry) => (
                    <li key={entry.id} className="flex items-start gap-1.5 text-[10px] font-mono">
                      {entry.kind === 'action' && <Zap className="w-3 h-3 text-sky-400 shrink-0 mt-0.5" />}
                      {entry.kind === 'event' && <Bell className="w-3 h-3 text-brand shrink-0 mt-0.5" />}
                      {entry.kind === 'nav' && <MousePointerClick className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />}
                      <span className="text-on-surface-variant break-all">{entry.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <Callout tone={eventsEnabled ? 'brand' : 'neutral'}>
          {eventsEnabled ? t.simulatorEventExplain : t.simulatorNavExplain}
        </Callout>
      </SimulatorFrame>

      <SkillSection title={t.eventsTitle} description={t.eventsDescription}>
        <div className="rounded-2xl bg-surface-low p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {t.eventScenarios.map((scenario, index) => (
              <button
                key={scenario.label}
                onClick={() => setEventScenario(index)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold transition-colors ${
                  eventScenario === index
                    ? 'bg-brand text-on-brand'
                    : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {scenario.label}
              </button>
            ))}
          </div>
          <Quiz
            key={`event-${eventScenario}`}
            question={event.prompt}
            options={event.options}
            correctIndex={event.correctIndex}
            explanation={event.explanation}
          />
        </div>
      </SkillSection>

      <SkillSection title={t.uiTextTitle} description={t.uiTextDescription}>
        <div className="rounded-2xl bg-surface-low p-4 space-y-2">
          {(t.uiTextItems as ClassifyItem[]).map((item) => (
            <PickerRow
              key={item.label}
              label={item.label}
              example={item.example}
              options={['UiText', 'String']}
              correctIndex={item.correct}
              labels={t.uiTextLabels}
              explanation={item.correct === 0 ? t.uiTextExplainUiText : t.uiTextExplainString}
            />
          ))}
        </div>
      </SkillSection>

      <SkillSection title={t.splitTitle} description={t.splitDescription}>
        <div className="rounded-2xl bg-surface-low p-4 space-y-2">
          {(t.splitItems as ClassifyItem[]).map((item) => (
            <PickerRow
              key={item.label}
              label={item.label}
              example={item.example}
              options={['Root', 'Screen']}
              correctIndex={item.correct}
              labels={t.splitLabels}
              explanation={item.correct === 0 ? t.splitExplainRoot : t.splitExplainScreen}
            />
          ))}
        </div>
      </SkillSection>

      <SimulatorFrame title={t.deathTitle} description={t.deathDescription}>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setKilled((value) => !value)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              killed ? 'bg-brand text-on-brand' : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
            }`}
          >
            {killed ? <Save className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
            {killed ? t.deathRestore : t.deathKill}
          </button>
        </div>

        <p className="ds-label text-on-surface-variant">{t.deathFields}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {deathFields.map((field) => {
            const isSaved = savedFields.has(field.key);
            const survives = killed && isSaved;
            return (
              <button
                key={field.key}
                onClick={() => toggleSaved(field.key)}
                className={`text-left p-3 rounded-xl border transition-colors space-y-1 ${
                  isSaved ? 'border-brand/40 bg-brand/10' : 'border-transparent bg-surface-lowest'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-on-surface">{field.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${
                      field.essential
                        ? 'bg-brand/20 text-brand'
                        : 'bg-amber-500/15 text-amber-300'
                    }`}
                  >
                    {field.essential ? t.deathEssential : t.deathNotEssential}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-on-surface-variant truncate">{field.value}</span>
                  {killed ? (
                    survives ? (
                      <span className="text-brand flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> {t.deathSurvives}
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1 shrink-0">
                        <XCircle className="w-3 h-3" /> {t.deathLost}
                      </span>
                    )
                  ) : (
                    <span className="text-on-surface-variant shrink-0">
                      {isSaved ? t.deathEssential : t.deathNotSavedLabel}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {killed && (
          <div className="p-3 rounded-xl bg-surface-lowest space-y-1">
            <p className="ds-label text-on-surface-variant">{t.deathRestored}</p>
            <pre className="text-[10px] font-mono text-sky-300 whitespace-pre-wrap leading-relaxed">
{`NoteEditorState(
  title = "${savedFields.has('title') ? t.deathTitleValue : ''}",
  body = "${savedFields.has('body') ? t.deathBodyValue : ''}"
)`}
            </pre>
          </div>
        )}

        <Callout tone={hasNonEssential ? 'warning' : 'brand'} title={hasNonEssential ? t.deathNotEssential : undefined}>
          {t.deathWarning}
        </Callout>
      </SimulatorFrame>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ConceptCard icon={Layers} title={t.concept1Title}>
          {t.concept1Body}
        </ConceptCard>
        <ConceptCard icon={Bell} title={t.concept2Title} tone="brand">
          {t.concept2Body}
        </ConceptCard>
        <ConceptCard icon={Sparkles} title={t.concept3Title} tone="warning">
          {t.concept3Body}
        </ConceptCard>
      </div>

      <SkillSection title={t.codeStateTitle}>
        <CodeCompare title={t.codeStateTitle} badCode={t.codeBadState} goodCode={t.codeGoodState} />
      </SkillSection>

      <SkillSection title={t.codeEventsTitle}>
        <CodeCompare title={t.codeEventsTitle} badCode={t.codeBadEvents} goodCode={t.codeGoodEvents} />
      </SkillSection>

      <SkillSection title={t.codeSplitTitle}>
        <CodeCompare title={t.codeSplitTitle} badCode={t.codeBadSplit} goodCode={t.codeGoodSplit} />
      </SkillSection>

      <Quiz question={t.quiz} options={t.quizOptions} correctIndex={t.quizAnswer} explanation={t.quizExplanation} />

      <Checklist title={t.checklistTitle} items={t.checklist} />

      <div className="flex items-center gap-2 text-[11px] font-mono text-on-surface-variant">
        <Smartphone className="w-3.5 h-3.5 text-brand" />
        <MessageSquare className="w-3.5 h-3.5 text-brand" />
        <AlertTriangle className="w-3.5 h-3.5 text-brand" />
        <span>{t.flowTitle}</span>
      </div>
    </div>
  );
};
