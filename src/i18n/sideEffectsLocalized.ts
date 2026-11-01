import { Language, SideEffectTranslation } from './types';
import { EffectCategory } from '../types/sideEffects';

export interface LocalizedSideEffectInfo extends SideEffectTranslation {
  category: EffectCategory;
}

export const LOCALIZED_SIDE_EFFECTS: Record<Language, LocalizedSideEffectInfo[]> = {
  es: [
    {
      id: 'launched-effect',
      name: 'LaunchedEffect',
      badge: 'Corrutinas',
      category: 'coroutines',
      categoryLabel: 'Manejo de Corrutinas',
      summary: 'Ejecuta funciones suspendidas en el alcance (scope) de la composición.',
      description:
        'LaunchedEffect entra en acción cuando el Composable entra por primera vez a la composición y cancela su corrutina cuando sale de ella. Si uno o varios de sus parámetros clave (key1, key2...) cambian de valor, la corrutina en curso se cancela inmediatamente y se relanza una nueva.',
      lifecycleStage: 'Se ejecuta después de la composición inicial o cuando una de las keys cambia. Se cancela al salir.',
      kotlinSignature: '@Composable fun LaunchedEffect(vararg keys: Any?, block: suspend CoroutineScope.() -> Unit)',
      parameters: [
        {
          name: 'keys',
          type: 'vararg Any?',
          description: 'Valores que determinan el ciclo de vida de la corrutina. Si cambian, se cancela y relanza.',
        },
        {
          name: 'block',
          type: 'suspend CoroutineScope.() -> Unit',
          description: 'Bloque suspendido para llamar funciones suspend (delay, llamadas de red, animaciones).',
        },
      ],
      whenToUse: [
        'Cargar datos de red o base de datos cuando una pantalla o ID de usuario cambia.',
        'Mostrar un Snackbar cuando cambia un estado de error o éxito.',
        'Iniciar una animación suspendida (Animatable.animateTo) al montar el Composable.',
        'Escuchar flujos o timers que deben cancelarse si el usuario navega fuera.',
      ],
      commonPitfalls: [
        'Usar LaunchedEffect(true) cuando necesitas reaccionar a cambios en una variable cambiante.',
        'Pasar un objeto mutable que cambia en cada recomposición sin control, provocando cancelaciones continuas.',
        'Intentar lanzar corrutinas desde onClick usando LaunchedEffect (usa rememberCoroutineScope).',
      ],
      snippets: [
        {
          title: 'Ejemplo 1: Búsqueda reactiva con cancelación',
          description: 'Cancela la búsqueda anterior si el usuario sigue escribiendo antes de que transcurran 400ms.',
          code: `@Composable
fun SearchScreen(query: String, onResults: (List<String>) -> Unit) {
    // Cada vez que 'query' cambia, la corrutina anterior se cancela automáticamente
    LaunchedEffect(query) {
        if (query.isBlank()) return@LaunchedEffect

        // Debounce de 400ms
        delay(400)
        val results = searchApi.fetchResults(query)
        onResults(results)
    }
}`,
        },
        {
          title: 'Ejemplo 2: Mostrar Snackbar al detectar error',
          description: 'Reacciona al cambio del mensaje de error en el ViewModel.',
          code: `@Composable
fun UserProfileScreen(
    errorMessage: String?,
    snackbarHostState: SnackbarHostState
) {
    LaunchedEffect(errorMessage) {
        errorMessage?.let { message ->
            snackbarHostState.showSnackbar(
                message = message,
                actionLabel = "Reintentar",
                duration = SnackbarDuration.Short
            )
        }
    }
}`,
        },
      ],
    },
    {
      id: 'remember-coroutine-scope',
      name: 'rememberCoroutineScope',
      badge: 'Eventos UI',
      category: 'coroutines',
      categoryLabel: 'Manejo de Corrutinas',
      summary: 'Obtiene un CoroutineScope atado al Composable para lanzar corrutinas fuera de la composición (ej. en callbacks onClick).',
      description:
        'Dado que LaunchedEffect solo puede invocarse dentro de funciones composables, no puedes usarlo dentro de onClick. rememberCoroutineScope devuelve un CoroutineScope vinculado al punto de la composición donde se invoca. Cuando el Composable se destruye, el scope cancela automáticamente sus corrutinas hijas.',
      lifecycleStage: 'Se crea durante la composición y cancela sus trabajos al salir del árbol de composición.',
      kotlinSignature: '@Composable fun rememberCoroutineScope(): CoroutineScope',
      parameters: [],
      whenToUse: [
        'Ejecutar una acción asíncrona tras un clic de usuario (ej. guardar datos, scroll programático).',
        'Desplazar un LazyList suavemente (listState.animateScrollToItem(index)) desde un botón.',
        'Abrir o cerrar un ModalBottomSheetState o DrawerState desde un botón.',
        'Mostrar un Snackbar provocado manualmente por el usuario.',
      ],
      commonPitfalls: [
        'Usar rememberCoroutineScope para iniciar tareas automáticamente durante la composición en lugar de LaunchedEffect.',
        'Olvidar que las corrutinas se cancelan cuando el Composable se destruye (no usar para sincronizaciones críticas de fondo; usa WorkManager).',
      ],
      snippets: [
        {
          title: 'Ejemplo: Scroll animado y apertura de BottomSheet',
          description: 'Lanza corrutinas desde los eventos onClick de botones.',
          code: `@Composable
fun ItemListScreen(items: List<String>) {
    val listState = rememberLazyListState()
    val scope = rememberCoroutineScope()
    val sheetState = rememberModalBottomSheetState()

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    scope.launch {
                        listState.animateScrollToItem(0)
                        sheetState.show()
                    }
                }
            ) {
                Icon(Icons.Default.ArrowUpward, contentDescription = "Subir")
            }
        }
    ) { padding ->
        LazyColumn(state = listState, modifier = Modifier.padding(padding)) {
            items(items) { item -> Text(item) }
        }
    }
}`,
        },
      ],
    },
    {
      id: 'remember-updated-state',
      name: 'rememberUpdatedState',
      badge: 'Estabilidad',
      category: 'optimization',
      categoryLabel: 'Estabilidad y Optimización',
      summary: 'Mantiene una referencia al valor más reciente sin forzar el reinicio de un efecto de larga duración.',
      description:
        'Si tienes un LaunchedEffect o DisposableEffect con una clave constante (ej. Unit) para un temporizador largo, pero necesita llamar a un callback que cambia frecuentemente, colocar ese callback como key reiniciaría el temporizador desde cero. rememberUpdatedState permite leer siempre el último dato sin reiniciar el efecto.',
      lifecycleStage: 'Actualiza su referencia interna en cada recomposición sin alterar la identidad del State devuelto.',
      kotlinSignature: '@Composable fun <T> rememberUpdatedState(newValue: T): State<T>',
      parameters: [
        {
          name: 'newValue',
          type: 'T',
          description: 'El nuevo valor o callback que deseas mantener actualizado dentro del efecto de larga duración.',
        },
      ],
      whenToUse: [
        'Efectos con temporizadores o delays prolongados (como SplashScreen) donde el callback onTimeout cambia pero no quieres resetear la cuenta atrás.',
        'Suscripciones a eventos externos de ciclo de vida donde no deseas desuscribirte y volverte a suscribir solo porque cambió una lambda.',
      ],
      commonPitfalls: [
        'Colocar la variable cambiante en las keys de LaunchedEffect por error, reiniciando el proceso costoso cada vez que cambia.',
        'Usar rememberUpdatedState cuando realmente sí deseabas que la corrutina se reiniciara al cambiar el valor.',
      ],
      snippets: [
        {
          title: 'Ejemplo: SplashScreen sin reiniciar el temporizador',
          description: 'Garantiza que onTimeout ejecute la versión más reciente sin resetear la espera de 3 segundos.',
          code: `@Composable
fun SplashScreen(
    onTimeout: () -> Unit,
    modifier: Modifier = Modifier
) {
    val currentOnTimeout by rememberUpdatedState(onTimeout)

    LaunchedEffect(Unit) {
        delay(3000L)
        currentOnTimeout()
    }

    Box(modifier, contentAlignment = Alignment.Center) {
        Image(painterResource(R.drawable.logo), contentDescription = "Logo")
    }
}`,
        },
      ],
    },
    {
      id: 'disposable-effect',
      name: 'DisposableEffect',
      badge: 'Limpieza',
      category: 'lifecycle',
      categoryLabel: 'Ciclo de Vida y Limpieza',
      summary: 'Para efectos secundarios que requieren registrar observadores y limpiarlos (onDispose) al salir o cambiar de claves.',
      description:
        'Ideal para integrar APIs imperativas tradicionales de Android (como BroadcastReceiver, SensorEventListener, LifecycleObserver o MediaPlayer). Cuando las claves cambian o el Composable abandona la composición, se ejecuta obligatoriamente el bloque onDispose { ... } para liberar recursos y evitar fugas de memoria.',
      lifecycleStage: 'Se ejecuta tras la composición. Ejecuta onDispose al cambiar keys o antes de salir de la composición.',
      kotlinSignature: '@Composable fun DisposableEffect(vararg keys: Any?, effect: DisposableEffectScope.() -> DisposableEffectResult)',
      parameters: [
        {
          name: 'keys',
          type: 'vararg Any?',
          description: 'Claves que determinan cuándo reiniciar el efecto y ejecutar onDispose.',
        },
        {
          name: 'effect',
          type: 'DisposableEffectScope.() -> DisposableEffectResult',
          description: 'Bloque donde configuras el listener. Debe terminar obligatoriamente con onDispose { ... }.',
        },
      ],
      whenToUse: [
        'Registrar y desregistrar BroadcastReceivers.',
        'Observar eventos del Android Lifecycle (ON_START, ON_STOP, ON_RESUME).',
        'Conectar y desconectar listeners de sensores del hardware (acelerómetro, giroscopio).',
        'Pausar o liberar reproductores multimedia como ExoPlayer.',
      ],
      commonPitfalls: [
        'Olvidar colocar la limpieza dentro de onDispose { ... }, dejando listeners vivos que provocan fugas de memoria.',
        'Intentar llamar a funciones suspendidas dentro de DisposableEffect (para corrutinas usa LaunchedEffect).',
      ],
      snippets: [
        {
          title: 'Ejemplo: Observador del ciclo de vida de la Activity',
          description: 'Registra un LifecycleObserver y lo remueve en onDispose para evitar fugas.',
          code: `@Composable
fun LifecycleObserverScreen(
    lifecycleOwner: LifecycleOwner = LocalLifecycleOwner.current,
    onStart: () -> Unit,
    onStop: () -> Unit
) {
    val currentOnStart by rememberUpdatedState(onStart)
    val currentOnStop by rememberUpdatedState(onStop)

    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_START -> currentOnStart()
                Lifecycle.Event.ON_STOP -> currentOnStop()
                else -> Unit
            }
        }

        lifecycleOwner.lifecycle.addObserver(observer)

        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }
    }
}`,
        },
      ],
    },
    {
      id: 'side-effect',
      name: 'SideEffect',
      badge: 'Sincronización',
      category: 'lifecycle',
      categoryLabel: 'Ciclo de Vida y Limpieza',
      summary: 'Publica el estado de Compose en objetos externos que no son de Compose tras CADA recomposición exitosa.',
      description:
        'Compose puede reintentar o descartar recomposiciones intermedias si el estado cambia rápidamente. Si ejecutas una operación fuera de Compose directamente en el cuerpo de la función, podría ejecutarse múltiples veces de forma errática. SideEffect garantiza que su bloque solo se ejecute tras confirmar que la composición finalizó con éxito.',
      lifecycleStage: 'Se ejecuta después de cada recomposición exitosa. No se ejecuta si la recomposición es cancelada.',
      kotlinSignature: '@Composable fun SideEffect(effect: () -> Unit)',
      parameters: [
        {
          name: 'effect',
          type: '() -> Unit',
          description: 'Lambda no suspendida que se ejecuta de forma síncrona tras cada recomposición exitosa.',
        },
      ],
      whenToUse: [
        'Actualizar bibliotecas externas o SDKs que no pertenecen a Compose (ej. Firebase Analytics, Mixpanel).',
        'Sincronizar barras del sistema (SystemBars / StatusBar color) con el estado de Compose.',
        'Enviar telemetría sobre el estado actual renderizado.',
      ],
      commonPitfalls: [
        'Ejecutar operaciones pesadas o que bloquean el hilo principal dentro de SideEffect.',
        'Modificar un Compose State dentro de un SideEffect, ya que causará un bucle infinito de recomposiciones.',
      ],
      snippets: [
        {
          title: 'Ejemplo: Sincronizar usuario activo con Analytics SDK',
          description: 'Garantiza que la librería externa siempre tenga el usuario tras cada recomposición exitosa.',
          code: `@Composable
fun ProfileScreen(user: User, analytics: FirebaseAnalytics) {
    SideEffect {
        analytics.setUserProperty("user_type", user.userType)
        analytics.setUserId(user.id)
    }

    Text("Bienvenido, \${user.name}")
}`,
        },
      ],
    },
    {
      id: 'produce-state',
      name: 'produceState',
      badge: 'Transformación',
      category: 'state_conversion',
      categoryLabel: 'Transformación de Estado',
      summary: 'Convierte fuentes de datos que no son de Compose (Flow, LiveData, llamadas de red) en un State<T> de Compose.',
      description:
        'produceState lanza una corrutina vinculada a la composición que puede actualizar el State<T> devuelto utilizando la propiedad value. Se cancela automáticamente cuando el Composable abandona la composición o cuando sus claves cambian.',
      lifecycleStage: 'Crea el State con un valor inicial y lanza una corrutina que actualiza value cuando recibe datos.',
      kotlinSignature: '@Composable fun <T> produceState(initialValue: T, vararg keys: Any?, producer: suspend ProduceStateScope<T>.() -> Unit): State<T>',
      parameters: [
        {
          name: 'initialValue',
          type: 'T',
          description: 'El valor inicial del State mientras se resuelve la corrutina.',
        },
        {
          name: 'keys',
          type: 'vararg Any?',
          description: 'Claves opcionales que al cambiar cancelan y relanzan el productor.',
        },
        {
          name: 'producer',
          type: 'suspend ProduceStateScope<T>.() -> Unit',
          description: 'Bloque suspendido donde actualizas el estado usando value = nuevoValor.',
        },
      ],
      whenToUse: [
        'Cargar imágenes o datos de red dentro de un Composable cuando no tienes un ViewModel intermedio.',
        'Transformar callbacks asíncronos o eventos de WebSocket en un State observable por la UI.',
        'Consumir flujos externos que requieren cleanup automático.',
      ],
      commonPitfalls: [
        'Olvidar especificar un valor inicial representativo (como un estado Loading o Empty).',
        'Reemplazar la arquitectura de ViewModels en aplicaciones grandes.',
      ],
      snippets: [
        {
          title: 'Ejemplo: Cargar detalles de producto desde API',
          description: 'Transforma una petición suspendida en un estado de Compose con clave productId.',
          code: `@Composable
fun ProductDetailScreen(productId: String, repository: ProductRepository) {
    val uiState by produceState<UiState<Product>>(
        initialValue = UiState.Loading,
        key1 = productId
    ) {
        val result = repository.fetchProduct(productId)
        value = if (result.isSuccess) {
            UiState.Success(result.getOrThrow())
        } else {
            UiState.Error("No se pudo cargar el producto")
        }
    }

    when (val state = uiState) {
        is UiState.Loading -> CircularProgressIndicator()
        is UiState.Success -> ProductView(state.data)
        is UiState.Error -> Text(state.message, color = MaterialTheme.colorScheme.error)
    }
}`,
        },
      ],
    },
    {
      id: 'derived-state-of',
      name: 'derivedStateOf',
      badge: 'Rendimiento',
      category: 'optimization',
      categoryLabel: 'Estabilidad y Optimización',
      summary: 'Calcula un State derivado a partir de otros estados y solo dispara recomposición cuando el resultado calculado cambia.',
      description:
        'Cuando un estado como el scroll offset cambia con cada píxel (60-120 veces por segundo), calcular directamente la visibilidad de un botón provocaría recomposiciones masivas. derivedStateOf garantiza que la recomposición SOLO ocurra cuando el resultado calculado cambia de false a true o viceversa. Es costoso: úsalo solo cuando el resultado cambie con menos frecuencia que sus entradas.',
      lifecycleStage: 'Solo notifica a los observadores cuando el resultado final de la expresión cambia.',
      kotlinSignature: 'fun <T> derivedStateOf(calculation: () -> T): State<T>',
      parameters: [
        {
          name: 'calculation',
          type: '() -> T',
          description: 'La función de cálculo que lee objetos State de Compose para derivar un nuevo valor.',
        },
      ],
      whenToUse: [
        'Mostrar u ocultar un botón flotante "Volver arriba" basado en el desplazamiento de una lista.',
        'Validar un formulario donde solo te interesa saber si isValid es verdadero o falso.',
        'Habilitar/deshabilitar botones en base a umbrales numéricos de estados de alta frecuencia.',
      ],
      commonPitfalls: [
        'Usar derivedStateOf para operaciones simples donde ambos estados cambian con la misma frecuencia.',
        'Olvidar remember { derivedStateOf { ... } }, recreando el objeto en cada recomposición.',
        'Usar derivedStateOf para concatenar strings o cálculos triviales: añade sobrecarga sin evitar recomposiciones.',
      ],
      snippets: [
        {
          title: 'Ejemplo correcto: botón "Volver arriba"',
          description: 'derivedStateOf evita recomposiciones mientras el primer ítem visible no cambie. Ejemplo adaptado de la guía oficial de Android.',
          code: `@Composable
fun MessageList(messages: List<Message>) {
    Box {
        val listState = rememberLazyListState()

        LazyColumn(state = listState) {
            // ...
        }

        // Mostrar el botón cuando el primer ítem visible deja de ser el primero.
        // Usamos un estado derivado recordado para minimizar recomposiciones.
        val showButton by remember {
            derivedStateOf {
                listState.firstVisibleItemIndex > 0
            }
        }

        AnimatedVisibility(visible = showButton) {
            ScrollToTopButton()
        }
    }
}`,
        },
        {
          title: 'Ejemplo incorrecto vs correcto',
          description: 'No uses derivedStateOf para concatenaciones o cálculos triviales: añade sobrecarga sin evitar recomposiciones.',
          code: `// MAL: derivedStateOf innecesario y costoso
var firstName by remember { mutableStateOf("") }
var lastName by remember { mutableStateOf("") }

val fullNameBad by remember {
    derivedStateOf { "$firstName $lastName" }
}

// BIEN: una expresión directa es suficiente
val fullNameCorrect = "$firstName $lastName"`,
        },
      ],
    },
    {
      id: 'snapshot-flow',
      name: 'snapshotFlow',
      badge: 'Flow Reactivo',
      category: 'state_conversion',
      categoryLabel: 'Transformación de Estado',
      summary: 'Convierte un State<T> de Compose en un Flow frío de Kotlin para aprovechar operadores como debounce, filter y distinctUntilChanged.',
      description:
        'snapshotFlow toma un bloque que lee objetos State de Compose y emite un nuevo valor en el Flow cada vez que alguno de los estados leídos cambia en un snapshot. Permite aplicar los operadores reactivos habituales de Coroutines antes de procesar el resultado.',
      lifecycleStage: 'Emite valores cuando el snapshot de Compose detecta cambios en las propiedades leídas.',
      kotlinSignature: 'fun <T> snapshotFlow(block: () -> T): Flow<T>',
      parameters: [
        {
          name: 'block',
          type: '() -> T',
          description: 'Expresión que lee al menos un State de Compose para ser monitoreado.',
        },
      ],
      whenToUse: [
        'Monitorear la posición de scroll de un Pager para enviar eventos de telemetría con debounce.',
        'Escuchar cambios continuos de un campo de texto y aplicar debounce antes de consultar una API.',
        'Combinar estados de Compose con otros Flows existentes usando combine o zip.',
      ],
      commonPitfalls: [
        'Llamar a snapshotFlow fuera de un LaunchedEffect o corrutina y no colectarlo.',
        'No usar distinctUntilChanged si el bloque retorna objetos con cálculo repetitivo.',
      ],
      snippets: [
        {
          title: 'Ejemplo: Telemetría de Pager con debounce',
          description: 'Envía un evento de analíticas solo cuando el usuario se detiene en una página.',
          code: `@Composable
fun PageAnalyticsTracker(pagerState: PagerState, analytics: AnalyticsTracker) {
    LaunchedEffect(pagerState) {
        snapshotFlow { pagerState.currentPage }
            .distinctUntilChanged()
            .debounce(600)
            .collect { page ->
                analytics.logEvent("page_viewed", bundleOf("page_index" to page))
            }
    }
}`,
        },
      ],
    },
  ],

  pt: [
    {
      id: 'launched-effect',
      name: 'LaunchedEffect',
      badge: 'Corrotinas',
      category: 'coroutines',
      categoryLabel: 'Manejo de Corrotinas',
      summary: 'Executa funções suspensas no escopo da composição.',
      description:
        'O LaunchedEffect entra em ação quando o Composable entra pela primeira vez na composição e cancela sua corrotina ao sair dela. Se uma ou mais de suas chaves (key1, key2...) mudarem de valor, a corrotina em execução é imediatamente cancelada e uma nova é reiniciada.',
      lifecycleStage: 'Executa após a composição inicial ou quando uma das chaves muda. É cancelado ao sair.',
      kotlinSignature: '@Composable fun LaunchedEffect(vararg keys: Any?, block: suspend CoroutineScope.() -> Unit)',
      parameters: [
        {
          name: 'keys',
          type: 'vararg Any?',
          description: 'Valores que determinam o ciclo de vida da corrotina. Se mudarem, ela é cancelada e reiniciada.',
        },
        {
          name: 'block',
          type: 'suspend CoroutineScope.() -> Unit',
          description: 'Bloco suspenso onde você pode chamar funções suspend (delay, rede, animações).',
        },
      ],
      whenToUse: [
        'Carregar dados de rede ou banco de dados quando uma tela ou ID de usuário mudar.',
        'Exibir um Snackbar quando um estado de erro ou sucesso mudar.',
        'Iniciar uma animação suspensa (Animatable.animateTo) ao montar o Composable.',
        'Ouvir fluxos ou timers que devem ser cancelados se o usuário navegar para fora.',
      ],
      commonPitfalls: [
        'Usar LaunchedEffect(true) quando você precisa reagir a alterações em uma variável dinâmica.',
        'Passar um objeto mutável que muda a cada recomposição sem controle, provocando cancelamentos contínuos.',
        'Tentar disparar corrotinas a partir de onClick usando LaunchedEffect (use rememberCoroutineScope).',
      ],
      snippets: [
        {
          title: 'Exemplo 1: Busca reativa com cancelamento',
          description: 'Cancela a busca anterior se o usuário continuar digitando antes de transcorridos 400ms.',
          code: `@Composable
fun SearchScreen(query: String, onResults: (List<String>) -> Unit) {
    // Sempre que 'query' muda, a corrotina anterior é cancelada automaticamente
    LaunchedEffect(query) {
        if (query.isBlank()) return@LaunchedEffect

        // Debounce de 400ms
        delay(400)
        val results = searchApi.fetchResults(query)
        onResults(results)
    }
}`,
        },
        {
          title: 'Exemplo 2: Exibir Snackbar ao detectar erro',
          description: 'Reage à mudança da mensagem de erro no ViewModel.',
          code: `@Composable
fun UserProfileScreen(
    errorMessage: String?,
    snackbarHostState: SnackbarHostState
) {
    LaunchedEffect(errorMessage) {
        errorMessage?.let { message ->
            snackbarHostState.showSnackbar(
                message = message,
                actionLabel = "Tentar novamente",
                duration = SnackbarDuration.Short
            )
        }
    }
}`,
        },
      ],
    },
    {
      id: 'remember-coroutine-scope',
      name: 'rememberCoroutineScope',
      badge: 'Eventos UI',
      category: 'coroutines',
      categoryLabel: 'Manejo de Corrotinas',
      summary: 'Obtém um CoroutineScope atrelado ao Composable para disparar corrotinas fora da composição (ex: em callbacks onClick).',
      description:
        'Como o LaunchedEffect só pode ser chamado dentro de funções composables, você não pode usá-lo dentro de onClick. O rememberCoroutineScope retorna um CoroutineScope vinculado ao ponto da composição onde é invocado. Quando o Composable é destruído, o escopo cancela automaticamente suas corrotinas filhas ativas.',
      lifecycleStage: 'Criado durante a composição e cancela seus jobs ao sair da árvore de composição.',
      kotlinSignature: '@Composable fun rememberCoroutineScope(): CoroutineScope',
      parameters: [],
      whenToUse: [
        'Executar uma ação assíncrona após clique do usuário (ex: salvar dados, scroll programático).',
        'Rolar uma LazyList suavemente (listState.animateScrollToItem(index)) a partir de um botão.',
        'Abrir ou fechar ModalBottomSheetState ou DrawerState a partir de um botão.',
        'Exibir um Snackbar disparado manualmente pelo usuário.',
      ],
      commonPitfalls: [
        'Usar rememberCoroutineScope para iniciar tarefas automaticamente durante a composição em vez de LaunchedEffect.',
        'Esquecer que as corrotinas são canceladas quando o Composable sai de cena (não use para sincronizações críticas de background; use WorkManager).',
      ],
      snippets: [
        {
          title: 'Exemplo: Scroll animado e abertura de BottomSheet',
          description: 'Dispara corrotinas a partir de eventos onClick de botões.',
          code: `@Composable
fun ItemListScreen(items: List<String>) {
    val listState = rememberLazyListState()
    val scope = rememberCoroutineScope()
    val sheetState = rememberModalBottomSheetState()

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    scope.launch {
                        listState.animateScrollToItem(0)
                        sheetState.show()
                    }
                }
            ) {
                Icon(Icons.Default.ArrowUpward, contentDescription = "Subir")
            }
        }
    ) { padding ->
        LazyColumn(state = listState, modifier = Modifier.padding(padding)) {
            items(items) { item -> Text(item) }
        }
    }
}`,
        },
      ],
    },
    {
      id: 'remember-updated-state',
      name: 'rememberUpdatedState',
      badge: 'Estabilidade',
      category: 'optimization',
      categoryLabel: 'Estabilidade e Otimização',
      summary: 'Mantém uma referência ao valor mais recente sem forçar o reinício de um efeito de longa duração.',
      description:
        'Se você possui um LaunchedEffect ou DisposableEffect com uma chave constante (ex: Unit) para um temporizador longo, mas precisa invocar um callback que muda frequentemente, incluir esse callback como chave reiniciaria o temporizador do zero. O rememberUpdatedState permite ler sempre o dado mais recente sem reiniciar o efeito.',
      lifecycleStage: 'Atualiza sua referência interna a cada recomposição sem alterar a identidade do State retornado.',
      kotlinSignature: '@Composable fun <T> rememberUpdatedState(newValue: T): State<T>',
      parameters: [
        {
          name: 'newValue',
          type: 'T',
          description: 'O novo valor ou callback que você deseja manter atualizado dentro do efeito de longa duração.',
        },
      ],
      whenToUse: [
        'Efeitos com timers prolongados (como SplashScreen) onde o callback onTimeout muda mas você não deseja resetar a contagem.',
        'Inscrições em eventos externos de ciclo de vida onde não é desejável desinscrever e reinscrever apenas pela mudança de uma lambda.',
      ],
      commonPitfalls: [
        'Colocar a variável dinâmica nas chaves do LaunchedEffect por engano, reiniciando o processo custoso a cada mudança.',
        'Usar rememberUpdatedState quando você realmente desejava que a corrotina reiniciasse ao mudar o valor.',
      ],
      snippets: [
        {
          title: 'Exemplo: SplashScreen sem reiniciar o temporizador',
          description: 'Garante que onTimeout execute a versão mais recente sem resetar a espera de 3 segundos.',
          code: `@Composable
fun SplashScreen(
    onTimeout: () -> Unit,
    modifier: Modifier = Modifier
) {
    val currentOnTimeout by rememberUpdatedState(onTimeout)

    LaunchedEffect(Unit) {
        delay(3000L)
        currentOnTimeout()
    }

    Box(modifier, contentAlignment = Alignment.Center) {
        Image(painterResource(R.drawable.logo), contentDescription = "Logo")
    }
}`,
        },
      ],
    },
    {
      id: 'disposable-effect',
      name: 'DisposableEffect',
      badge: 'Limpeza',
      category: 'lifecycle',
      categoryLabel: 'Ciclo de Vida e Limpeza',
      summary: 'Para efeitos colaterais que exigem registrar observadores e limpá-los (onDispose) ao sair ou mudar de chaves.',
      description:
        'Ideal para integrar APIs imperativas do Android (como BroadcastReceiver, SensorEventListener, LifecycleObserver ou MediaPlayer). Quando as chaves mudam ou o Composable sai da composição, o bloco onDispose { ... } é executado obrigatoriamente para liberar recursos e evitar vazamentos de memória.',
      lifecycleStage: 'Executa após a composição. Executa onDispose ao mudar chaves ou antes de sair da composição.',
      kotlinSignature: '@Composable fun DisposableEffect(vararg keys: Any?, effect: DisposableEffectScope.() -> DisposableEffectResult)',
      parameters: [
        {
          name: 'keys',
          type: 'vararg Any?',
          description: 'Chaves que determinam quando reiniciar o efeito e executar onDispose.',
        },
        {
          name: 'effect',
          type: 'DisposableEffectScope.() -> DisposableEffectResult',
          description: 'Bloco onde você configura o listener. Deve obrigatoriamente terminar com onDispose { ... }.',
        },
      ],
      whenToUse: [
        'Registrar e desregistrar BroadcastReceivers.',
        'Observar eventos do Android Lifecycle (ON_START, ON_STOP, ON_RESUME).',
        'Conectar e desconectar listeners de sensores de hardware (acelerômetro, giroscópio).',
        'Pausar ou liberar reprodutores de mídia como ExoPlayer.',
      ],
      commonPitfalls: [
        'Esquecer de posicionar a limpeza dentro de onDispose { ... }, mantendo listeners ativos que causam vazamentos de memória.',
        'Tentar invocar funções suspensas dentro de DisposableEffect (para corrotinas use LaunchedEffect).',
      ],
      snippets: [
        {
          title: 'Exemplo: Observador do ciclo de vida da Activity',
          description: 'Registra um LifecycleObserver e o remove no onDispose para evitar vazamentos.',
          code: `@Composable
fun LifecycleObserverScreen(
    lifecycleOwner: LifecycleOwner = LocalLifecycleOwner.current,
    onStart: () -> Unit,
    onStop: () -> Unit
) {
    val currentOnStart by rememberUpdatedState(onStart)
    val currentOnStop by rememberUpdatedState(onStop)

    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_START -> currentOnStart()
                Lifecycle.Event.ON_STOP -> currentOnStop()
                else -> Unit
            }
        }

        lifecycleOwner.lifecycle.addObserver(observer)

        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }
    }
}`,
        },
      ],
    },
    {
      id: 'side-effect',
      name: 'SideEffect',
      badge: 'Sincronização',
      category: 'lifecycle',
      categoryLabel: 'Ciclo de Vida e Limpeza',
      summary: 'Publica o estado do Compose em objetos externos que não são do Compose após CADA recomposição bem-sucedida.',
      description:
        'O Compose pode reexecutar ou descartar recomposições intermediárias se o estado mudar rapidamente. Se você chamar uma biblioteca externa diretamente no corpo do Composable, ela poderá ser executada várias vezes indevidamente. O SideEffect garante execução somente após a composição ter sido concluída com êxito.',
      lifecycleStage: 'Executa após cada recomposição bem-sucedida. Não executa se a recomposição for descartada.',
      kotlinSignature: '@Composable fun SideEffect(effect: () -> Unit)',
      parameters: [
        {
          name: 'effect',
          type: '() -> Unit',
          description: 'Lambda não suspensa executada de forma síncrona após cada recomposição concluída.',
        },
      ],
      whenToUse: [
        'Atualizar bibliotecas externas ou SDKs fora do Compose (ex: Firebase Analytics, Mixpanel).',
        'Sincronizar barras do sistema (SystemBars / StatusBar color) com o estado do Compose.',
        'Enviar telemetria sobre o estado renderizado atual.',
      ],
      commonPitfalls: [
        'Executar operações pesadas ou bloqueantes da thread principal dentro de SideEffect.',
        'Modificar um State do Compose dentro de SideEffect, gerando loop infinito de recomposições.',
      ],
      snippets: [
        {
          title: 'Exemplo: Sincronizar usuário ativo com Analytics SDK',
          description: 'Garante que o SDK externo receba o usuário após cada recomposição com sucesso.',
          code: `@Composable
fun ProfileScreen(user: User, analytics: FirebaseAnalytics) {
    SideEffect {
        analytics.setUserProperty("user_type", user.userType)
        analytics.setUserId(user.id)
    }

    Text("Bem-vindo, \${user.name}")
}`,
        },
      ],
    },
    {
      id: 'produce-state',
      name: 'produceState',
      badge: 'Transformação',
      category: 'state_conversion',
      categoryLabel: 'Transformação de Estado',
      summary: 'Converte fontes de dados fora do Compose (Flow, LiveData, chamadas de rede) em um State<T> do Compose.',
      description:
        'O produceState lança uma corrotina vinculada à composição que pode atualizar o State<T> retornado utilizando a propriedade value. É cancelado automaticamente quando o Composable sai da árvore ou quando suas chaves mudam.',
      lifecycleStage: 'Cria o State com valor inicial e dispara uma corrotina que atualiza value ao receber dados.',
      kotlinSignature: '@Composable fun <T> produceState(initialValue: T, vararg keys: Any?, producer: suspend ProduceStateScope<T>.() -> Unit): State<T>',
      parameters: [
        {
          name: 'initialValue',
          type: 'T',
          description: 'O valor inicial do State enquanto a corrotina é processada.',
        },
        {
          name: 'keys',
          type: 'vararg Any?',
          description: 'Chaves opcionais que, ao mudarem, cancelam e relançam o produtor.',
        },
        {
          name: 'producer',
          type: 'suspend ProduceStateScope<T>.() -> Unit',
          description: 'Bloco suspenso onde você atualiza o estado usando value = novoValor.',
        },
      ],
      whenToUse: [
        'Carregar imagens ou dados de rede dentro de um Composable quando não há um ViewModel intermediário.',
        'Transformar callbacks assíncronos ou eventos de WebSocket em um State observável pela UI.',
        'Consumir fluxos externos que exigem limpeza automática.',
      ],
      commonPitfalls: [
        'Esquecer de fornecer um valor inicial representativo (como estado Loading ou Empty).',
        'Substituir a arquitetura de ViewModels em aplicações corporativas.',
      ],
      snippets: [
        {
          title: 'Exemplo: Carregar detalhes de produto via API',
          description: 'Transforma uma chamada suspensa em estado do Compose com a chave productId.',
          code: `@Composable
fun ProductDetailScreen(productId: String, repository: ProductRepository) {
    val uiState by produceState<UiState<Product>>(
        initialValue = UiState.Loading,
        key1 = productId
    ) {
        val result = repository.fetchProduct(productId)
        value = if (result.isSuccess) {
            UiState.Success(result.getOrThrow())
        } else {
            UiState.Error("Não foi possível carregar o produto")
        }
    }

    when (val state = uiState) {
        is UiState.Loading -> CircularProgressIndicator()
        is UiState.Success -> ProductView(state.data)
        is UiState.Error -> Text(state.message, color = MaterialTheme.colorScheme.error)
    }
}`,
        },
      ],
    },
    {
      id: 'derived-state-of',
      name: 'derivedStateOf',
      badge: 'Desempenho',
      category: 'optimization',
      categoryLabel: 'Estabilidade e Otimização',
      summary: 'Calcula um State derivado de outros estados e só dispara recomposição quando o resultado final calculado muda.',
      description:
        'Quando um estado como scroll offset muda a cada pixel (60 a 120 vezes por segundo), calcular visibilidade diretamente causa recomposições contínuas. O derivedStateOf garante que a recomposição OCORRA APENAS quando o resultado final mudar de false para true ou vice-versa. Ele é caro: use apenas quando o resultado mudar com menos frequência que suas entradas.',
      lifecycleStage: 'Notifica os observadores somente quando o resultado final da expressão se altera.',
      kotlinSignature: 'fun <T> derivedStateOf(calculation: () -> T): State<T>',
      parameters: [
        {
          name: 'calculation',
          type: '() -> T',
          description: 'A função de cálculo que lê objetos State do Compose para derivar um novo valor.',
        },
      ],
      whenToUse: [
        'Exibir ou ocultar botão flutuante "Voltar ao Topo" baseado no deslocamento da lista.',
        'Validar formulários onde interessa apenas saber se isValid é verdadeiro ou falso.',
        'Habilitar/desabilitar botões a partir de limites numéricos de estados de alta frequência.',
      ],
      commonPitfalls: [
        'Usar derivedStateOf em operações simples onde ambos os estados mudam na mesma frequência.',
        'Esquecer de usar remember { derivedStateOf { ... } }, recriando o objeto a cada recomposição.',
        'Usar derivedStateOf para concatenar strings ou cálculos triviais: adiciona sobrecarga sem evitar recomposições.',
      ],
      snippets: [
        {
          title: 'Exemplo correto: botão "Voltar ao topo"',
          description: 'derivedStateOf evita recomposições enquanto o primeiro item visível não mudar. Exemplo adaptado do guia oficial do Android.',
          code: `@Composable
fun MessageList(messages: List<Message>) {
    Box {
        val listState = rememberLazyListState()

        LazyColumn(state = listState) {
            // ...
        }

        // Mostrar o botão quando o primeiro item visível deixar de ser o primeiro.
        // Usamos um estado derivado lembrado para minimizar recomposições.
        val showButton by remember {
            derivedStateOf {
                listState.firstVisibleItemIndex > 0
            }
        }

        AnimatedVisibility(visible = showButton) {
            ScrollToTopButton()
        }
    }
}`,
        },
        {
          title: 'Exemplo incorreto vs correto',
          description: 'Não use derivedStateOf para concatenações ou cálculos triviais: adiciona sobrecarga sem evitar recomposições.',
          code: `// ERRADO: derivedStateOf desnecessário e caro
var firstName by remember { mutableStateOf("") }
var lastName by remember { mutableStateOf("") }

val fullNameBad by remember {
    derivedStateOf { "$firstName $lastName" }
}

// CERTO: uma expressão direta é suficiente
val fullNameCorrect = "$firstName $lastName"`,
        },
      ],
    },
    {
      id: 'snapshot-flow',
      name: 'snapshotFlow',
      badge: 'Flow Reativo',
      category: 'state_conversion',
      categoryLabel: 'Transformação de Estado',
      summary: 'Converte um State<T> do Compose em um Flow frio do Kotlin para aplicar operadores como debounce, filter e distinctUntilChanged.',
      description:
        'O snapshotFlow recebe um bloco que lê objetos State do Compose e emite um novo valor no Flow sempre que qualquer estado lido sofrer alteração no snapshot. Permite aplicar operadores reativos antes de processar o resultado.',
      lifecycleStage: 'Emite valores quando o snapshot do Compose identifica alterações nas propriedades lidas.',
      kotlinSignature: 'fun <T> snapshotFlow(block: () -> T): Flow<T>',
      parameters: [
        {
          name: 'block',
          type: '() -> T',
          description: 'Expressão que lê pelo menos um State do Compose para ser monitorado.',
        },
      ],
      whenToUse: [
        'Monitorar posição de scroll de um Pager para enviar métricas de telemetria com debounce.',
        'Ouvir digitação contínua de um campo de texto e aplicar debounce antes de consultar uma API.',
        'Combinar estados do Compose com outros Flows existentes via combine ou zip.',
      ],
      commonPitfalls: [
        'Invocar snapshotFlow fora de um LaunchedEffect ou corrotina e não coletá-lo.',
        'Não utilizar distinctUntilChanged se o bloco retornar objetos com cálculo repetitivo.',
      ],
      snippets: [
        {
          title: 'Exemplo: Telemetria de Pager com debounce',
          description: 'Dispara evento de análise apenas quando o usuário se detém em uma página.',
          code: `@Composable
fun PageAnalyticsTracker(pagerState: PagerState, analytics: AnalyticsTracker) {
    LaunchedEffect(pagerState) {
        snapshotFlow { pagerState.currentPage }
            .distinctUntilChanged()
            .debounce(600)
            .collect { page ->
                analytics.logEvent("page_viewed", bundleOf("page_index" to page))
            }
    }
}`,
        },
      ],
    },
  ],

  en: [
    {
      id: 'launched-effect',
      name: 'LaunchedEffect',
      badge: 'Coroutines',
      category: 'coroutines',
      categoryLabel: 'Coroutine Management',
      summary: 'Runs suspend functions within the scope of a composable.',
      description:
        'LaunchedEffect enters action when the Composable first enters composition and cancels its coroutine when it leaves. If one or more key parameters (key1, key2...) change, the running coroutine is immediately canceled and restarted with the new key value.',
      lifecycleStage: 'Executes after initial composition or when keys change. Automatically canceled upon leaving.',
      kotlinSignature: '@Composable fun LaunchedEffect(vararg keys: Any?, block: suspend CoroutineScope.() -> Unit)',
      parameters: [
        {
          name: 'keys',
          type: 'vararg Any?',
          description: 'Values governing the lifecycle of the coroutine. When they change, it cancels and restarts.',
        },
        {
          name: 'block',
          type: 'suspend CoroutineScope.() -> Unit',
          description: 'Suspended block for calling suspend functions (delay, network requests, animations).',
        },
      ],
      whenToUse: [
        'Fetch network data or database records when a screen or user ID parameter changes.',
        'Show a Snackbar when an error or success state arrives.',
        'Trigger a suspend animation (Animatable.animateTo) when mounting the Composable.',
        'Observe flows or timers that must be canceled if the user navigates away.',
      ],
      commonPitfalls: [
        'Using LaunchedEffect(true) when you need to react to changes in a dynamic variable.',
        'Passing an uncontrolled mutable object that changes every recomposition, causing infinite restarts.',
        'Attempting to trigger coroutines from onClick using LaunchedEffect (use rememberCoroutineScope instead).',
      ],
      snippets: [
        {
          title: 'Example 1: Reactive Search with Cancellation',
          description: 'Cancels previous in-flight requests if the user keeps typing before 400ms elapse.',
          code: `@Composable
fun SearchScreen(query: String, onResults: (List<String>) -> Unit) {
    // Whenever 'query' changes, the previous coroutine job is automatically cancelled
    LaunchedEffect(query) {
        if (query.isBlank()) return@LaunchedEffect

        // 400ms debounce
        delay(400)
        val results = searchApi.fetchResults(query)
        onResults(results)
    }
}`,
        },
        {
          title: 'Example 2: Display Snackbar on Error Event',
          description: 'Replaces error state changes from ViewModel with a Snackbar.',
          code: `@Composable
fun UserProfileScreen(
    errorMessage: String?,
    snackbarHostState: SnackbarHostState
) {
    LaunchedEffect(errorMessage) {
        errorMessage?.let { message ->
            snackbarHostState.showSnackbar(
                message = message,
                actionLabel = "Retry",
                duration = SnackbarDuration.Short
            )
        }
    }
}`,
        },
      ],
    },
    {
      id: 'remember-coroutine-scope',
      name: 'rememberCoroutineScope',
      badge: 'UI Events',
      category: 'coroutines',
      categoryLabel: 'Coroutine Management',
      summary: 'Obtains a CoroutineScope bound to the Composable lifecycle to launch coroutines outside composition (e.g., inside onClick callbacks).',
      description:
        'Because LaunchedEffect can only be called from inside composable functions, it cannot be called directly inside an onClick lambda. rememberCoroutineScope returns a CoroutineScope bound to the composition point. When the Composable leaves composition, the scope automatically cancels any active child jobs.',
      lifecycleStage: 'Created during composition; cancels child jobs upon leaving the composition tree.',
      kotlinSignature: '@Composable fun rememberCoroutineScope(): CoroutineScope',
      parameters: [],
      whenToUse: [
        'Execute async actions following user clicks (e.g., save data, programmatic scrolling).',
        'Smoothly scroll a LazyList (listState.animateScrollToItem(index)) from a button.',
        'Open or close ModalBottomSheetState or DrawerState from a button.',
        'Display a Snackbar triggered directly by a user gesture.',
      ],
      commonPitfalls: [
        'Using rememberCoroutineScope to launch tasks automatically during composition instead of LaunchedEffect.',
        'Assuming coroutines persist across screens (they cancel when Composable leaves; use WorkManager for persistent background work).',
      ],
      snippets: [
        {
          title: 'Example: Animated Scroll and BottomSheet expansion',
          description: 'Launches coroutines from button onClick event handlers.',
          code: `@Composable
fun ItemListScreen(items: List<String>) {
    val listState = rememberLazyListState()
    val scope = rememberCoroutineScope()
    val sheetState = rememberModalBottomSheetState()

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    scope.launch {
                        listState.animateScrollToItem(0)
                        sheetState.show()
                    }
                }
            ) {
                Icon(Icons.Default.ArrowUpward, contentDescription = "Scroll to top")
            }
        }
    ) { padding ->
        LazyColumn(state = listState, modifier = Modifier.padding(padding)) {
            items(items) { item -> Text(item) }
        }
    }
}`,
        },
      ],
    },
    {
      id: 'remember-updated-state',
      name: 'rememberUpdatedState',
      badge: 'Stability',
      category: 'optimization',
      categoryLabel: 'Stability & Optimization',
      summary: 'Captures the latest value of a variable or callback without restarting a long-running effect.',
      description:
        'If you have a LaunchedEffect or DisposableEffect with a constant key (e.g. Unit) for a long delay or timer, but it invokes a callback that changes frequently, passing that callback as a key would restart the timer from zero. rememberUpdatedState lets you read the newest callback without resetting the timer.',
      lifecycleStage: 'Updates its internal reference on every recomposition without altering the identity of the returned State.',
      kotlinSignature: '@Composable fun <T> rememberUpdatedState(newValue: T): State<T>',
      parameters: [
        {
          name: 'newValue',
          type: 'T',
          description: 'The updated value or callback to keep accessible inside the long-running effect.',
        },
      ],
      whenToUse: [
        'Effects with long delays or timers (such as a SplashScreen) where the onTimeout callback updates but you want to preserve elapsed time.',
        'Subscriptions to external lifecycle events where unsubscribing and resubscribing on callback changes is undesirable.',
      ],
      commonPitfalls: [
        'Accidentally placing dynamic variables in LaunchedEffect keys, causing long-running processes to restart on every change.',
        'Using rememberUpdatedState when you actually did want the coroutine to cancel and restart when the value changed.',
      ],
      snippets: [
        {
          title: 'Example: SplashScreen without Timer Restarts',
          description: 'Ensures onTimeout invokes the latest lambda without resetting the 3-second wait.',
          code: `@Composable
fun SplashScreen(
    onTimeout: () -> Unit,
    modifier: Modifier = Modifier
) {
    val currentOnTimeout by rememberUpdatedState(onTimeout)

    LaunchedEffect(Unit) {
        delay(3000L)
        currentOnTimeout()
    }

    Box(modifier, contentAlignment = Alignment.Center) {
        Image(painterResource(R.drawable.logo), contentDescription = "Logo")
    }
}`,
        },
      ],
    },
    {
      id: 'disposable-effect',
      name: 'DisposableEffect',
      badge: 'Cleanup',
      category: 'lifecycle',
      categoryLabel: 'Lifecycle & Teardown',
      summary: 'For side-effects requiring listener registration and mandatory cleanup (onDispose) upon key changes or leaving composition.',
      description:
        'Ideal for integrating legacy Android imperative APIs (such as BroadcastReceiver, SensorEventListener, LifecycleObserver, or MediaPlayer). Whenever keys change or the Composable leaves composition, the onDispose { ... } block executes to free resources and eliminate memory leaks.',
      lifecycleStage: 'Executes after composition. Runs onDispose on key changes or prior to leaving composition.',
      kotlinSignature: '@Composable fun DisposableEffect(vararg keys: Any?, effect: DisposableEffectScope.() -> DisposableEffectResult)',
      parameters: [
        {
          name: 'keys',
          type: 'vararg Any?',
          description: 'Keys that control when the effect restarts and executes onDispose.',
        },
        {
          name: 'effect',
          type: 'DisposableEffectScope.() -> DisposableEffectResult',
          description: 'Block where listeners are attached. Must conclude with onDispose { ... }.',
        },
      ],
      whenToUse: [
        'Register and unregister BroadcastReceivers.',
        'Observe Android Lifecycle events (ON_START, ON_STOP, ON_RESUME).',
        'Attach and detach hardware sensor listeners (accelerometer, gyroscope).',
        'Pause and release media players such as ExoPlayer.',
      ],
      commonPitfalls: [
        'Omitting teardown logic inside onDispose { ... }, leaving orphaned listeners and creating memory leaks.',
        'Attempting to invoke suspend functions inside DisposableEffect (use LaunchedEffect for coroutines).',
      ],
      snippets: [
        {
          title: 'Example: Activity Lifecycle Observer',
          description: 'Registers a LifecycleObserver and removes it inside onDispose to prevent leaks.',
          code: `@Composable
fun LifecycleObserverScreen(
    lifecycleOwner: LifecycleOwner = LocalLifecycleOwner.current,
    onStart: () -> Unit,
    onStop: () -> Unit
) {
    val currentOnStart by rememberUpdatedState(onStart)
    val currentOnStop by rememberUpdatedState(onStop)

    DisposableEffect(lifecycleOwner) {
        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_START -> currentOnStart()
                Lifecycle.Event.ON_STOP -> currentOnStop()
                else -> Unit
            }
        }

        lifecycleOwner.lifecycle.addObserver(observer)

        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
        }
    }
}`,
        },
      ],
    },
    {
      id: 'side-effect',
      name: 'SideEffect',
      badge: 'Sync',
      category: 'lifecycle',
      categoryLabel: 'Lifecycle & Teardown',
      summary: 'Publishes Compose state to external non-Compose objects after EVERY successful recomposition.',
      description:
        'Compose may retry or discard intermediate recompositions if state updates in rapid succession. Calling external libraries directly in the composable body risks duplicate or erratic calls. SideEffect guarantees its block runs only after composition completes and applies to the UI.',
      lifecycleStage: 'Runs synchronously after every successful recomposition. Does not run if recomposition is aborted.',
      kotlinSignature: '@Composable fun SideEffect(effect: () -> Unit)',
      parameters: [
        {
          name: 'effect',
          type: '() -> Unit',
          description: 'Non-suspend lambda executed synchronously following each successful recomposition.',
        },
      ],
      whenToUse: [
        'Update external SDKs and services outside Compose (e.g. Firebase Analytics, Mixpanel).',
        'Sync System Bars (StatusBar / NavigationBar colors) with current Compose state.',
        'Transmit telemetry regarding currently committed UI state.',
      ],
      commonPitfalls: [
        'Performing heavy or main-thread blocking operations inside SideEffect.',
        'Modifying Compose State inside SideEffect, which triggers an infinite recomposition loop.',
      ],
      snippets: [
        {
          title: 'Example: Sync Active User with Analytics SDK',
          description: 'Guarantees the external SDK always has committed user properties after each recomposition.',
          code: `@Composable
fun ProfileScreen(user: User, analytics: FirebaseAnalytics) {
    SideEffect {
        analytics.setUserProperty("user_type", user.userType)
        analytics.setUserId(user.id)
    }

    Text("Welcome, \${user.name}")
}`,
        },
      ],
    },
    {
      id: 'produce-state',
      name: 'produceState',
      badge: 'Conversion',
      category: 'state_conversion',
      categoryLabel: 'State Conversion',
      summary: 'Converts non-Compose async sources (Flow, LiveData, network calls) into a Compose State<T>.',
      description:
        'produceState launches a coroutine scoped to composition that pushes updates to the returned State<T> via value = .... It automatically cancels when leaving composition or when its key arguments change.',
      lifecycleStage: 'Yields State with initialValue and launches a coroutine updating value upon receiving data.',
      kotlinSignature: '@Composable fun <T> produceState(initialValue: T, vararg keys: Any?, producer: suspend ProduceStateScope<T>.() -> Unit): State<T>',
      parameters: [
        {
          name: 'initialValue',
          type: 'T',
          description: 'Initial state value shown while the producer coroutine is in flight.',
        },
        {
          name: 'keys',
          type: 'vararg Any?',
          description: 'Optional keys that cancel and restart the producer coroutine when changed.',
        },
        {
          name: 'producer',
          type: 'suspend ProduceStateScope<T>.() -> Unit',
          description: 'Suspended block where you update state by assigning value = newValue.',
        },
      ],
      whenToUse: [
        'Load images or network entities inside a Composable when no intermediate ViewModel is required.',
        'Transform async callbacks or WebSocket streams into an observable UI State.',
        'Consume external streams that need automatic lifecycle cleanup.',
      ],
      commonPitfalls: [
        'Forgetting a representative initial value (such as a Loading or Empty state).',
        'Replacing standard ViewModel architecture in enterprise-scale applications.',
      ],
      snippets: [
        {
          title: 'Example: Fetch Product Details from Repository',
          description: 'Converts a suspend repository call into Compose State keyed by productId.',
          code: `@Composable
fun ProductDetailScreen(productId: String, repository: ProductRepository) {
    val uiState by produceState<UiState<Product>>(
        initialValue = UiState.Loading,
        key1 = productId
    ) {
        val result = repository.fetchProduct(productId)
        value = if (result.isSuccess) {
            UiState.Success(result.getOrThrow())
        } else {
            UiState.Error("Failed to load product")
        }
    }

    when (val state = uiState) {
        is UiState.Loading -> CircularProgressIndicator()
        is UiState.Success -> ProductView(state.data)
        is UiState.Error -> Text(state.message, color = MaterialTheme.colorScheme.error)
    }
}`,
        },
      ],
    },
    {
      id: 'derived-state-of',
      name: 'derivedStateOf',
      badge: 'Performance',
      category: 'optimization',
      categoryLabel: 'Stability & Optimization',
      summary: 'Derives State from other state objects, only notifying observers when the calculated result changes.',
      description:
        'When a state like scroll pixel offset updates continuously (60-120 times/sec), calculating button visibility directly would cause non-stop recompositions. derivedStateOf ensures recomposition happens ONLY when the boolean condition flips from false to true or vice versa. It is expensive: use it only when the result changes less often than its inputs.',
      lifecycleStage: 'Notifies observers exclusively when the final computed result changes.',
      kotlinSignature: 'fun <T> derivedStateOf(calculation: () -> T): State<T>',
      parameters: [
        {
          name: 'calculation',
          type: '() -> T',
          description: 'Calculation lambda reading Compose State objects to derive a new value.',
        },
      ],
      whenToUse: [
        'Show or hide a "Scroll to Top" floating action button based on list scroll offset.',
        'Form validation where UI only needs to know if isValid is true or false.',
        'Enable or disable buttons based on numerical thresholds of high-frequency states.',
      ],
      commonPitfalls: [
        'Using derivedStateOf for trivial calculations where both inputs and outputs update at identical rates.',
        'Omitting remember { derivedStateOf { ... } }, causing object re-creation on every pass.',
        'Using derivedStateOf for string concatenation or trivial math: it adds overhead without avoiding recompositions.',
      ],
      snippets: [
        {
          title: 'Correct example: "Scroll to top" button',
          description: 'derivedStateOf prevents recompositions while the first visible item does not change. Adapted from the official Android guide.',
          code: `@Composable
fun MessageList(messages: List<Message>) {
    Box {
        val listState = rememberLazyListState()

        LazyColumn(state = listState) {
            // ...
        }

        // Show the button if the first visible item is past
        // the first item. We use a remembered derived state to
        // minimize unnecessary compositions.
        val showButton by remember {
            derivedStateOf {
                listState.firstVisibleItemIndex > 0
            }
        }

        AnimatedVisibility(visible = showButton) {
            ScrollToTopButton()
        }
    }
}`,
        },
        {
          title: 'Incorrect vs correct example',
          description: 'Do not use derivedStateOf for concatenation or trivial calculations: it adds overhead without avoiding recompositions.',
          code: `// BAD: unnecessary and expensive derivedStateOf
var firstName by remember { mutableStateOf("") }
var lastName by remember { mutableStateOf("") }

val fullNameBad by remember {
    derivedStateOf { "$firstName $lastName" }
}

// GOOD: a direct expression is enough
val fullNameCorrect = "$firstName $lastName"`,
        },
      ],
    },
    {
      id: 'snapshot-flow',
      name: 'snapshotFlow',
      badge: 'Reactive Flow',
      category: 'state_conversion',
      categoryLabel: 'State Conversion',
      summary: 'Converts Compose State<T> into a cold Kotlin Flow to apply operators like debounce, filter, and distinctUntilChanged.',
      description:
        'snapshotFlow accepts a block that reads Compose State objects and emits a new item into the Flow whenever any read state changes inside a snapshot. Enables applying reactive coroutine operators before reacting to changes.',
      lifecycleStage: 'Emits values whenever the Compose snapshot detects changes in read properties.',
      kotlinSignature: 'fun <T> snapshotFlow(block: () -> T): Flow<T>',
      parameters: [
        {
          name: 'block',
          type: '() -> T',
          description: 'Expression that reads at least one Compose State object to be observed.',
        },
      ],
      whenToUse: [
        'Monitor Pager scroll position to send debounced analytics events.',
        'Observe continuous text field typing and apply debounce before querying a search API.',
        'Combine Compose state with other existing Flows using combine or zip.',
      ],
      commonPitfalls: [
        'Calling snapshotFlow outside a LaunchedEffect or coroutine scope without collecting it.',
        'Omitting distinctUntilChanged when the block returns repetitive non-distinct objects.',
      ],
      snippets: [
        {
          title: 'Example: Debounced Pager Analytics Tracker',
          description: 'Fires an analytics event only after the user settles on a page.',
          code: `@Composable
fun PageAnalyticsTracker(pagerState: PagerState, analytics: AnalyticsTracker) {
    LaunchedEffect(pagerState) {
        snapshotFlow { pagerState.currentPage }
            .distinctUntilChanged()
            .debounce(600)
            .collect { page ->
                analytics.logEvent("page_viewed", bundleOf("page_index" to page))
            }
    }
}`,
        },
      ],
    },
  ],
};
