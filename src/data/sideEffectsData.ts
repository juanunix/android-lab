import { SideEffectInfo } from '../types/sideEffects';

export const SIDE_EFFECTS: SideEffectInfo[] = [
  {
    id: 'launched-effect',
    name: 'LaunchedEffect',
    badge: 'Corrutinas',
    category: 'coroutines',
    categoryLabel: 'Manejo de Corrutinas',
    summary: 'Ejecuta funciones suspendidas en el alcance (scope) de la composición.',
    description:
      'LaunchedEffect entra en acción cuando el Composable entra por primera vez a la composición y cancela su corrutina cuando sale de ella. Si uno o varios de sus parámetros clave (`key1`, `key2`, etc.) cambian de valor, la corrutina en curso se cancela inmediatamente y se relanza una nueva con el nuevo valor de la clave.',
    lifecycleStage: 'Se ejecuta después de la composición inicial o cuando una de las keys cambia. Se cancela al salir.',
    kotlinSignature: '@Composable fun LaunchedEffect(vararg keys: Any?, block: suspend CoroutineScope.() -> Unit)',
    parameters: [
      {
        name: 'keys',
        type: 'vararg Any?',
        description: 'Uno o más valores que determinan el ciclo de vida de la corrutina. Si cambian, se cancela y relanza. Usa Unit o true para ejecutarlo solo una vez.',
        isRequired: true,
      },
      {
        name: 'block',
        type: 'suspend CoroutineScope.() -> Unit',
        description: 'Bloque suspendido donde puedes llamar funciones suspend (delay, llamadas de red, animaciones).',
        isRequired: true,
      },
    ],
    whenToUse: [
      'Cargar datos de red o base de datos cuando una pantalla o ID de usuario cambia.',
      'Mostrar un Snackbar cuando cambia un estado de error o éxito.',
      'Iniciar una animación suspendida (Animatable.animateTo) al montar el Composable.',
      'Escuchar flujos o timers que deben cancelarse si el usuario navega fuera.',
    ],
    commonPitfalls: [
      'Usar `LaunchedEffect(true)` cuando necesitas reaccionar a cambios en una variable (el efecto nunca se reiniciará).',
      'Pasar un objeto mutable o un estado que cambia en cada recomposición sin control, provocando cancelaciones y relanzamientos continuos innecesarios.',
      'Intentar lanzar corrutinas desde `onClick` usando LaunchedEffect (para eventos de usuario se debe usar `rememberCoroutineScope`).',
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
    // Se dispara únicamente cuando errorMessage cambia de valor
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
    summary: 'Obtiene un CoroutineScope atado al ciclo de vida del Composable para lanzar corrutinas fuera de la composición (ej. en callbacks onClick).',
    description:
      'Dado que `LaunchedEffect` solo puede invocarse dentro de funciones composables, no puedes usarlo dentro de una lambda de evento como `onClick`. `rememberCoroutineScope` devuelve un `CoroutineScope` que está vinculado al punto exacto de la composición donde se llama. Cuando el Composable abandona la composición, este Scope cancela automáticamente todas sus corrutinas hijas activas.',
    lifecycleStage: 'Se crea durante la composición y cancela sus trabajos al salir del árbol de composición.',
    kotlinSignature: '@Composable fun rememberCoroutineScope(): CoroutineScope',
    parameters: [],
    whenToUse: [
      'Ejecutar una acción asíncrona tras un clic de usuario (ej. guardar datos, scroll programático).',
      'Desplazar un LazyList suavemente (`listState.animateScrollToItem(index)`) desde un botón.',
      'Abrir o cerrar un ModalBottomSheetState o DrawerState desde un botón.',
      'Mostrar un Snackbar provocado manualmente por el usuario.',
    ],
    commonPitfalls: [
      'Usar `rememberCoroutineScope` para iniciar tareas automáticamente durante la composición en lugar de `LaunchedEffect`.',
      'Olvidar que las corrutinas lanzadas se cancelan cuando el Composable se destruye (no debe usarse para sincronizaciones críticas de fondo; para eso usa WorkManager).',
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
                    // Lanzamos una corrutina en respuesta directa al clic del usuario
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
      'Si tienes un `LaunchedEffect` o `DisposableEffect` con una clave constante (ej. `Unit`) porque realiza una tarea costosa o un temporizador largo, pero necesita llamar a un callback o leer un valor que cambia frecuentemente, usar ese valor como key reiniciaría el temporizador desde cero. `rememberUpdatedState` envuelve el valor actual de modo que el efecto puede leer siempre el último dato sin reiniciarse.',
    lifecycleStage: 'Actualiza su referencia interna en cada recomposición sin alterar la identidad del State devuelto.',
    kotlinSignature: '@Composable fun <T> rememberUpdatedState(newValue: T): State<T>',
    parameters: [
      {
        name: 'newValue',
        type: 'T',
        description: 'El nuevo valor o callback que deseas mantener actualizado dentro del efecto de larga duración.',
        isRequired: true,
      },
    ],
    whenToUse: [
      'Efectos con temporizadores o delays prolongados (como una pantalla de bienvenida SplashScreen) donde el callback onTimeout cambia pero no quieres resetear la cuenta atrás.',
      'Suscripciones a eventos externos de ciclo de vida donde no deseas desuscribirte y volverte a suscribir solo porque cambió una lambda de callback.',
    ],
    commonPitfalls: [
      'Colocar la variable cambiante en las keys de `LaunchedEffect` por error, reiniciando el proceso costoso cada vez que cambia.',
      'Usar `rememberUpdatedState` cuando realmente SÍ querías que la corrutina se reiniciara al cambiar el valor (en ese caso el parámetro debe ser una key de LaunchedEffect).',
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
    // Captura siempre la última versión de onTimeout
    val currentOnTimeout by rememberUpdatedState(onTimeout)

    // El efecto corre con key Unit (solo una vez), pero usará el último callback
    LaunchedEffect(Unit) {
        delay(3000L)
        // Ejecuta la referencia más actualizada
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
      'Ideal para integrar APIs imperativas tradicionales de Android (como `BroadcastReceiver`, `SensorEventListener`, `LifecycleObserver`, `LocationListener` o `MediaPlayer`). Cuando el Composable entra a la composición o cambia una de sus claves, ejecuta su bloque. Cuando la clave cambia o el Composable abandona la composición, se ejecuta obligatoriamente el bloque `onDispose { ... }` para liberar recursos y evitar fugas de memoria (memory leaks).',
    lifecycleStage: 'Se ejecuta tras la composición. Ejecuta onDispose al cambiar keys o antes de salir de la composición.',
    kotlinSignature: '@Composable fun DisposableEffect(vararg keys: Any?, effect: DisposableEffectScope.() -> DisposableEffectResult)',
    parameters: [
      {
        name: 'keys',
        type: 'vararg Any?',
        description: 'Claves que determinan cuándo reiniciar el efecto y ejecutar onDispose.',
        isRequired: true,
      },
      {
        name: 'effect',
        type: 'DisposableEffectScope.() -> DisposableEffectResult',
        description: 'Bloque donde configuras el listener. Debe terminar obligatoriamente con una llamada a onDispose { ... }.',
        isRequired: true,
      },
    ],
    whenToUse: [
      'Registrar y desregistrar BroadcastReceivers.',
      'Observar eventos del Android Lifecycle (ON_START, ON_STOP, ON_RESUME).',
      'Conectar y desconectar listeners de sensores del hardware (acelerómetro, giroscopio).',
      'Pausar o liberar reproductores multimedia como ExoPlayer.',
    ],
    commonPitfalls: [
      'Olvidar colocar la limpieza dentro de `onDispose { ... }`, dejando listeners vivos que provocan fugas de memoria.',
      'Intentar llamar a funciones suspendidas dentro de `DisposableEffect` (para corrutinas usa `LaunchedEffect`).',
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

        // Limpieza obligatoria al cambiar de lifecycleOwner o abandonar la pantalla
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
      'Durante la recomposición, Compose puede reintentar o descartar ejecuciones intermedias si el estado cambia rápido. Si ejecutas una operación fuera de Compose directamente en el cuerpo de la función (ej. `analytics.setUser(user)`), podría ejecutarse múltiples veces en recomposiciones descartadas. `SideEffect` garantiza que su bloque solo se ejecute una vez que la composición haya finalizado con éxito y se haya aplicado al árbol.',
    lifecycleStage: 'Se ejecuta después de cada recomposición exitosa. No se ejecuta si la recomposición es cancelada.',
    kotlinSignature: '@Composable fun SideEffect(effect: () -> Unit)',
    parameters: [
      {
        name: 'effect',
        type: '() -> Unit',
        description: 'Lambda no suspendida que se ejecuta de forma síncrona tras cada recomposición exitosa.',
        isRequired: true,
      },
    ],
    whenToUse: [
      'Actualizar bibliotecas externas o SDKs que no pertenecen a Compose (ej. Firebase Analytics, Mixpanel, Crashlytics).',
      'Sincronizar barras del sistema (SystemBars / StatusBar color) con el estado de Compose.',
      'Enviar telemetría sobre el estado actual renderizado.',
    ],
    commonPitfalls: [
      'Ejecutar operaciones pesadas o que bloquean el hilo principal dentro de `SideEffect` (afecta la fluidez a 60/120 fps).',
      'Modificar un Compose `State` dentro de un `SideEffect`, ya que causará un bucle infinito de recomposiciones.',
    ],
    snippets: [
      {
        title: 'Ejemplo: Sincronizar usuario activo con Analytics SDK',
        description: 'Garantiza que la librería externa siempre tenga el usuario tras cada recomposición exitosa.',
        code: `@Composable
fun ProfileScreen(user: User, analytics: FirebaseAnalytics) {
    // Se ejecuta tras cada recomposición exitosa
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
      '`produceState` lanza una corrutina vinculada a la composición que puede actualizar el `State<T>` devuelto utilizando la propiedad `value`. Se cancela automáticamente cuando el Composable abandona la composición o cuando sus claves cambian, permitiendo inicializar y suspender fuentes de datos reactivas fácilmente.',
    lifecycleStage: 'Crea el State con un valor inicial y lanza una corrutina que actualiza `value` cuando recibe datos.',
    kotlinSignature: '@Composable fun <T> produceState(initialValue: T, vararg keys: Any?, producer: suspend ProduceStateScope<T>.() -> Unit): State<T>',
    parameters: [
      {
        name: 'initialValue',
        type: 'T',
        description: 'El valor inicial del State mientras se resuelve la corrutina.',
        isRequired: true,
      },
      {
        name: 'keys',
        type: 'vararg Any?',
        description: 'Claves opcionales que al cambiar cancelan y relanzan el productor.',
        isRequired: false,
      },
      {
        name: 'producer',
        type: 'suspend ProduceStateScope<T>.() -> Unit',
        description: 'Bloque suspendido donde actualizas el estado usando value = nuevoValor.',
        isRequired: true,
      },
    ],
    whenToUse: [
      'Cargar imágenes o datos de red dentro de un Composable cuando no tienes un ViewModel intermedio.',
      'Transformar callbacks asíncronos o eventos de WebSocket en un State observable por la UI.',
      'Consumir flujos externos que requieren cleanup automático.',
    ],
    commonPitfalls: [
      'Olvidar especificar un valor inicial representativo (como un estado Loading o Empty).',
      'Reemplazar la arquitectura limpia de ViewModels en aplicaciones grandes (produceState es ideal para utilidades UI o librerías, pero los datos de negocio suelen residir en el ViewModel).',
    ],
    snippets: [
      {
        title: 'Ejemplo: Cargar detalles de producto desde API',
        description: 'Transforma una petición suspendida en un estado de Compose con clave productId.',
        code: `@Composable
fun ProductDetailScreen(productId: String, repository: ProductRepository) {
    // produceState lanza la corrutina y maneja el estado
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
      'Imagina un `LazyListState.firstVisibleItemIndex` o `firstVisibleItemScrollOffset` que cambia en cada píxel que el usuario desplaza (60-120 veces por segundo). Si calculas `val showButton = scrollState.firstVisibleItemIndex > 0` directamente, el Composable se recompondrá en cada pequeño píxel. Al envolverlo en `derivedStateOf`, la recomposición SOLO ocurrirá cuando el resultado booleano cambie de `false` a `true` o viceversa, ahorrando cientos de recomposiciones innecesarias.',
    lifecycleStage: 'Solo notifica a los observadores cuando el resultado final de la expresión cambia.',
    kotlinSignature: 'fun <T> derivedStateOf(calculation: () -> T): State<T>',
    parameters: [
      {
        name: 'calculation',
        type: '() -> T',
        description: 'La función de cálculo que lee uno o más objetos State de Compose para derivar un nuevo valor.',
        isRequired: true,
      },
    ],
    whenToUse: [
      'Mostrar u ocultar un botón flotante "Volver arriba" basado en el desplazamiento de una lista.',
      'Validar un formulario donde solo te interesa saber si `isValid` es verdadero o falso.',
      'Habilitar/deshabilitar botones en base a umbrales numéricos de estados que cambian con alta frecuencia.',
    ],
    commonPitfalls: [
      'Usar `derivedStateOf` para operaciones simples que no involucran estados que cambian a alta frecuencia (añade una sobrecarga innecesaria si ambos estados cambian con la misma frecuencia).',
      'Olvidar `remember { derivedStateOf { ... } }`, lo que causaría recrear el objeto en cada pasada de composición.',
    ],
    snippets: [
      {
        title: 'Ejemplo: Botón "Scroll to Top" optimizado',
        description: 'Evita recomponer el Composable en cada píxel de scroll.',
        code: `@Composable
fun OptimizedListScreen() {
    val listState = rememberLazyListState()
    val scope = rememberCoroutineScope()

    // OPTIMIZACIÓN CLAVE: solo recompone cuando showButton pasa de false a true o viceversa
    val showButton by remember {
        derivedStateOf {
            listState.firstVisibleItemIndex > 0
        }
    }

    Scaffold(
        floatingActionButton = {
            AnimatedVisibility(visible = showButton) {
                FloatingActionButton(onClick = { scope.launch { listState.scrollToItem(0) } }) {
                    Icon(Icons.Default.KeyboardArrowUp, contentDescription = "Arriba")
                }
            }
        }
    ) { padding ->
        LazyColumn(state = listState, modifier = Modifier.padding(padding)) {
            items(100) { index -> ItemRow(index) }
        }
    }
}`,
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
      '`snapshotFlow` toma un bloque que lee objetos State de Compose y emite un nuevo valor en el Flow cada vez que alguno de los estados leídos dentro del bloque cambia su valor en un snapshot. Permite aplicar los operadores reactivos habituales de Coroutines / Flow (como `debounce(300)`, `mapLatest`, `buffer`) antes de procesar el resultado.',
    lifecycleStage: 'Emite valores cuando el snapshot de Compose detecta cambios en las propiedades leídas.',
    kotlinSignature: 'fun <T> snapshotFlow(block: () -> T): Flow<T>',
    parameters: [
      {
        name: 'block',
        type: '() -> T',
        description: 'Expresión que lee al menos un State de Compose para ser monitoreado.',
        isRequired: true,
      },
    ],
    whenToUse: [
      'Monitorear la posición de scroll de un Pager o LazyList para enviar eventos de telemetría con debounce.',
      'Escuchar cambios continuos de un campo de texto y aplicar `debounce(500.milliseconds)` antes de consultar una API.',
      'Combinar estados de Compose con otros Flows existentes usando `combine` o `zip`.',
    ],
    commonPitfalls: [
      'Llamar a `snapshotFlow` fuera de un `LaunchedEffect` o corrutina y no colectarlo.',
      'No usar `distinctUntilChanged` si el bloque retorna objetos con cálculo repetitivo.',
    ],
    snippets: [
      {
        title: 'Ejemplo: Telemetría de Pager con debounce',
        description: 'Envía un evento de analíticas solo cuando el usuario se detiene en una página.',
        code: `@Composable
fun PageAnalyticsTracker(pagerState: PagerState, analytics: AnalyticsTracker) {
    LaunchedEffect(pagerState) {
        // Convierte el estado de Compose en un Flow y aplica operadores
        snapshotFlow { pagerState.currentPage }
            .distinctUntilChanged()
            .debounce(600) // Solo dispara si el usuario permanece más de 600ms en la página
            .collect { page ->
                analytics.logEvent("page_viewed", bundleOf("page_index" to page))
            }
    }
}`,
      },
    ],
  },
];
