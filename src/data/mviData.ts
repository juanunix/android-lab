import { MviConcept } from '../types/mvi';
import { Language } from '../i18n/types';

export const MVI_CONCEPTS_DATA: Record<Language, MviConcept[]> = {
  es: [
    {
      id: 'udf_flow',
      name: 'Unidirectional Data Flow (UDF)',
      badge: 'Patrón Central',
      summary: 'El ciclo cerrado unidireccional: la UI emite Acciones, el ViewModel calcula el nuevo Estado inmutable y lo emite a la UI.',
      description:
        'En la arquitectura MVI canónica, la información fluye estrictamente en un solo sentido. La UI nunca muta variables ni ejecuta lógica de negocio directamente. Al presionar un botón, despacha un Action; el ViewModel lo procesa de forma atómica y emite un State nuevo. Los efectos únicos (navegación, snackbars) viajan por un Channel separado.',
      architectureRule:
        'Regla de Oro MVI: El ViewModel solo expone un único StateFlow inmutable para el Estado y un Channel receiveAsFlow() para Eventos. La UI solo interactúa a través de una función pública onAction(action).',
      kotlinCode: `// 1. La UI despacha una Acción
onAction(ProductListAction.OnSearchQueryChange("Pixel 9"))

// 2. El ViewModel procesa la Acción
fun onAction(action: ProductListAction) {
    when(action) {
        is ProductListAction.OnSearchQueryChange -> {
            _state.update { it.copy(searchQuery = action.query) }
        }
        ProductListAction.OnCheckoutClick -> {
            viewModelScope.launch {
                _events.send(ProductListEvent.NavigateToCheckout)
            }
        }
    }
}

// 3. La UI recolecta StateFlow y renderiza
val state by viewModel.state.collectAsStateWithLifecycle()`,
      dos: [
        'Mantener una única dirección de flujo: UI -> Action -> ViewModel -> State -> UI.',
        'Hacer que todo cambio en la pantalla sea el resultado directo de una emisión de State.',
        'Separar eventos de un solo uso (Event) del estado duradero (State).',
      ],
      donts: [
        'No llamar a múltiples funciones públicas del ViewModel desde la UI (ej. viewModel.updateText(), viewModel.loadMore()). Usa una sola función onAction(action).',
        'No permitir que la UI muta propiedades de estado directamente.',
      ],
    },
    {
      id: 'state_definition',
      name: 'Single Immutable State (SSOT)',
      badge: 'Estado Único',
      summary: 'Un único data class inmutable que encapsula TODO el estado que la pantalla necesita renderizar.',
      description:
        'Evita tener 5 StateFlows separados en tu ViewModel (ej. nameState, isLoadingState, errorState). En su lugar, agrúpalos en un único data class con valores por defecto. Esto garantiza una sola fuente de verdad (Single Source of Truth), facilita las pruebas unitarias y hace que el estado de la UI sea completamente reproducible e inspeccionable.',
      architectureRule:
        'Regla de Oro MVI: Define siempre una sola clase de estado inmutable (ScreenState) con valores predeterminados para todos los campos.',
      kotlinCode: `data class ProductListState(
    val products: List<ProductUi> = emptyList(),
    val searchQuery: String = "",
    val isLoading: Boolean = false,
    val selectedCategory: Category? = null,
    val errorMessage: UiText? = null
)`,
      dos: [
        'Usar data class inmutable con todos los campos como val.',
        'Definir valores por defecto para que el estado inicial sea ProductListState().',
        'Representar textos de error con el patrón UiText para evitar acoplar Android Context al ViewModel.',
      ],
      donts: [
        'No usar var dentro de la clase de estado.',
        'No dispersar múltiples StateFlows primitivos en el ViewModel.',
        'No almacenar estados transitorios de navegación dentro del State.',
      ],
    },
    {
      id: 'action_interface',
      name: 'Sealed Action / Intent Interface',
      badge: 'Acciones de Usuario',
      summary: 'Representa cada interacción posible del usuario o del sistema como un sealed interface exhaustivo.',
      description:
        'Cualquier clic, deslizamiento, cambio de texto o evento del ciclo de vida se modela como un Action. Al usar sealed interface, el compilador de Kotlin obliga a que el ViewModel maneje todos los casos posibles en un bloque when exhaustivo sin necesidad de ramas else.',
      architectureRule:
        'Regla de Oro MVI: Nombra las acciones con prefijo On... describiendo la acción del usuario, no la consecuencia técnica (ej. OnSignInClick en lugar de TriggerSignInApi).',
      kotlinCode: `sealed interface ProductListAction {
    data class OnSearchQueryChange(val query: String): ProductListAction
    data class OnProductClick(val productId: String): ProductListAction
    data class OnFavoriteToggle(val productId: String): ProductListAction
    data object OnRefresh: ProductListAction
    data object OnCheckoutClick: ProductListAction
}`,
      dos: [
        'Usar data object para acciones sin parámetros y data class para acciones con carga útil (payload).',
        'Describir el qué hizo el usuario (OnProductClick) en vez de lo que debe hacer el ViewModel (FetchProductDetails).',
      ],
      donts: [
        'No usar interfaces abiertas o clases abstractas normales.',
        'No usar ramas else en el when(action) para que el compilador te avise si falta manejar alguna acción.',
      ],
    },
    {
      id: 'event_channel',
      name: 'Channel vs State for One-Shot Events',
      badge: 'Eventos Únicos',
      summary: 'Cómo evitar que un Snackbar o Navegación se repita al girar la pantalla o recomponer usando Channel.',
      description:
        'Uno de los errores más comunes en Android es almacenar eventos de un solo uso (como mostrar un error o navegar) como flags booleanos en el State (ej. showErrorSnackbar = true). Al girar la pantalla, la Activity se recrea, lee el estado persistido y VUELVE a mostrar el Snackbar. La arquitectura canónica prescribe usar Channel<Event> con receiveAsFlow(), garantizando entrega exactamente una vez (queue buffer).',
      architectureRule:
        'Regla de Oro MVI: Los efectos secundarios de un solo uso (navegación, snackbar, toast) deben enviarse a través de un Channel privado y exponerse como receiveAsFlow().',
      kotlinCode: `// En el ViewModel:
private val _events = Channel<ProductListEvent>()
val events = _events.receiveAsFlow()

fun onAction(action: ProductListAction) {
    when(action) {
        ProductListAction.OnCheckoutClick -> {
            viewModelScope.launch {
                // Se envía por el Channel: buffer seguro hasta ser consumido
                _events.send(ProductListEvent.NavigateToCheckout)
            }
        }
    }
}`,
      dos: [
        'Usar Channel<ScreenEvent>(Channel.BUFFERED) para eventos que no deben perderse durante giros de pantalla.',
        'Consumir el flow con el helper ObserveAsEvents en Compose.',
      ],
      donts: [
        'No guardar flags de navegación o snackbar dentro de data class ScreenState.',
        'No usar SharedFlow sin replay=0 porque puede descartar eventos si no hay suscriptores activos en ese instante.',
      ],
    },
    {
      id: 'viewmodel_onaction',
      name: 'ViewModel & Atomic State Updates',
      badge: 'ViewModel Seguro',
      summary: 'Estructura canónica del ViewModel: una sola función onAction y updates atómicos con _state.update {}.',
      description:
        'El ViewModel solo necesita dos propiedades expuestas: state y events, más la función onAction(action). Para actualizar el estado de manera segura y concurrente entre múltiples corrutinas, se usa siempre _state.update { it.copy(...) } en lugar de la asignación directa _state.value = ....',
      architectureRule:
        'Regla de Oro MVI: Nunca asignes directamente _state.value = .... Usa siempre _state.update { it.copy(...) } para garantizar actualizaciones atómicas libres de condiciones de carrera.',
      kotlinCode: `class ProductListViewModel(
    private val repository: ProductRepository
): ViewModel() {

    private val _state = MutableStateFlow(ProductListState())
    val state = _state.asStateFlow()

    private val _events = Channel<ProductListEvent>()
    val events = _events.receiveAsFlow()

    fun onAction(action: ProductListAction) {
        when(action) {
            is ProductListAction.OnSearchQueryChange -> {
                _state.update { it.copy(searchQuery = action.query) }
            }
            is ProductListAction.OnFavoriteToggle -> {
                toggleFavorite(action.productId)
            }
            ProductListAction.OnRefresh -> {
                loadProducts()
            }
        }
    }
    
    private fun toggleFavorite(id: String) {
        _state.update { currentState ->
            currentState.copy(
                products = currentState.products.map { 
                    if (it.id == id) it.copy(isFavorite = !it.isFavorite) else it 
                }
            )
        }
    }
}`,
      dos: [
        'Usar _state.update { it.copy(...) } para evitar condiciones de carrera entre hilos.',
        'Mantener los métodos de negocio privados (loadProducts, toggleFavorite) y exponer solo onAction.',
      ],
      donts: [
        'No usar _state.value = _state.value.copy(...) porque puede sobrescribir cambios concurrentes de otra corrutina.',
        'No inyectar dependencias de Android (Context, Resources) en el ViewModel.',
      ],
    },
    {
      id: 'screen_root_content',
      name: '<Screen>Root & <Screen>Screen Pattern',
      badge: 'Estructura Composable',
      summary: 'Estructura canónica en un solo archivo: 1. <Screen>Root, 2. <Screen>Screen (stateless) y 3. <Screen>ScreenPreview.',
      description:
        'Siguiendo los skills oficiales de arquitectura Android, cada pantalla se estructura en un único archivo (<Screen>Screen.kt) con tres componentes en orden canónico: 1) <Screen>Root (obtiene el ViewModel con koinViewModel(), recolecta el estado con collectAsStateWithLifecycle() y observa eventos con ObserveAsEvents); 2) <Screen>Screen (composable 100% stateless que recibe State, lambda onAction y callbacks de navegación directa); y 3) <Screen>ScreenPreview para previsualización inmediata en Android Studio sin mocks.',
      architectureRule:
        'Regla de Oro MVI (Skills): Mantén siempre <Screen>Root, <Screen>Screen y <Screen>ScreenPreview en el mismo archivo. Las navegaciones simples por clic se ejecutan directamente en callbacks del Screen sin pasar innecesariamente por el ViewModel.',
      kotlinCode: `// ProductListScreen.kt — Root + Screen + Preview en el mismo archivo

// 1. Root Composable (<Screen>Root)
@Composable
fun ProductListRoot(
    onNavigateToCheckout: () -> Unit,
    onNavigateToDetail: (String) -> Unit,
    viewModel: ProductListViewModel = koinViewModel(),
    snackbarHostState: SnackbarHostState = remember { SnackbarHostState() }
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val context = LocalContext.current

    // Observa eventos únicos de Channel
    ObserveAsEvents(viewModel.events) { event ->
        when (event) {
            ProductListEvent.NavigateToCheckout -> onNavigateToCheckout()
            is ProductListEvent.ShowError -> {
                snackbarHostState.showSnackbar(event.message.asString(context))
            }
        }
    }

    ProductListScreen(
        state = state,
        onAction = viewModel::onAction,
        onCheckoutClick = onNavigateToCheckout,
        onProductClick = onNavigateToDetail
    )
}

// 2. Screen Composable (<Screen>Screen - Stateless)
@Composable
fun ProductListScreen(
    state: ProductListState,
    onAction: (ProductListAction) -> Unit,
    onCheckoutClick: () -> Unit,
    onProductClick: (String) -> Unit
) {
    Scaffold { padding ->
        LazyColumn(modifier = Modifier.padding(padding)) {
            items(state.products, key = { it.id }) { product ->
                ProductItem(
                    product = product,
                    onClick = { onProductClick(product.id) },
                    onFavorite = { onAction(ProductListAction.OnFavoriteToggle(product.id)) }
                )
            }
        }
    }
}

// 3. Screen Preview (<Screen>ScreenPreview)
@Preview
@Composable
private fun ProductListScreenPreview() {
    AppTheme {
        ProductListScreen(
            state = ProductListState(),
            onAction = {},
            onCheckoutClick = {},
            onProductClick = {}
        )
    }
}`,
      dos: [
        'Organizar el archivo con el orden canónico: <Screen>Root, luego <Screen>Screen y finalmente <Screen>ScreenPreview.',
        'Hacer que Screen reciba state, onAction y callbacks directos de navegación.',
        'Disparar navegaciones de clics simples directamente desde callbacks del Screen sin ViewModel.',
      ],
      donts: [
        'No pasar la instancia de ViewModel a funciones composables hijas o a <Screen>Screen.',
        'No separar Root y Screen en archivos distintos; conviven en el mismo <Screen>Screen.kt.',
      ],
    },
    {
      id: 'observe_as_events',
      name: 'ObserveAsEvents Helper',
      badge: 'Ciclo de Vida Seguro',
      summary: 'El helper canónico para recolectar Channels en Compose respetando repeatOnLifecycle.',
      description:
        'Recolectar eventos de Channel directamente con LaunchedEffect(Unit) puede provocar que la UI reciba eventos cuando la app está en segundo plano (en estado STOPPED) o perderlos durante transiciones. El helper ObserveAsEvents utiliza LocalLifecycleOwner y repeatOnLifecycle(Lifecycle.State.STARTED) con Dispatchers.Main.immediate.',
      architectureRule:
        'Regla de Oro MVI: Utiliza el composable ObserveAsEvents para todas las suscripciones a flujos de eventos de un solo uso.',
      kotlinCode: `@Composable
fun <T> ObserveAsEvents(
    flow: Flow<T>,
    key1: Any? = null,
    key2: Any? = null,
    onEvent: (T) -> Unit
) {
    val lifecycleOwner = LocalLifecycleOwner.current
    LaunchedEffect(lifecycleOwner.lifecycle, flow, key1, key2) {
        lifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
            withContext(Dispatchers.Main.immediate) {
                flow.collect(onEvent)
            }
        }
    }
}`,
      dos: [
        'Asegurar que los eventos solo se consuman cuando la UI está visible en STARTED o RESUMED.',
        'Usar Dispatchers.Main.immediate para evitar retrasos de frame al procesar navegación.',
      ],
      donts: [
        'No recolectar eventos con LaunchedEffect sin comprobar el ciclo de vida del LifecycleOwner.',
      ],
    },
    {
      id: 'uitext_pattern',
      name: 'UiText Clean Architecture Pattern',
      badge: 'Desacoplamiento',
      summary: 'Representa textos y strings de recursos sin acoplar Android Context al ViewModel.',
      description:
        'En Clean Architecture y KMP, el ViewModel no debe importar android.content.Context ni R.string. Si el backend o una validación retorna un mensaje dinámico o necesitas un string localizado de strings.xml, la clase UiText encapsula ambas posibilidades limpiamente.',
      architectureRule:
        'Regla de Oro MVI: Nunca almacenes Strings planos cuando se dependa de recursos de Android. Usa UiText.StringResource y resuélvelo en Compose mediante .asString().',
      kotlinCode: `sealed interface UiText {
    data class DynamicString(val value: String): UiText
    
    class StringResource(
        @StringRes val resId: Int,
        vararg val args: Any
    ): UiText

    @Composable
    fun asString(): String {
        return when(this) {
            is DynamicString -> value
            is StringResource -> stringResource(resId, *args)
        }
    }

    fun asString(context: Context): String {
        return when(this) {
            is DynamicString -> value
            is StringResource -> context.getString(resId, *args)
        }
    }
}`,
      dos: [
        'Usar UiText para mensajes de error, validaciones de formularios y etiquetas dinámicas.',
        'Mantener el ViewModel 100% libre de dependencias de Android framework para pruebas unitarias instantáneas.',
      ],
      donts: [
        'No pasar Context al ViewModel para poder llamar a context.getString(R.string...).',
        'No guardar Strings formateados directamente si dependen del idioma del dispositivo.',
      ],
    },
  ],

  pt: [
    {
      id: 'udf_flow',
      name: 'Unidirectional Data Flow (UDF)',
      badge: 'Padrão Central',
      summary: 'O fluxo unidirecional: a UI emite Ações, o ViewModel calcula o novo Estado imutável e o emite de volta para a UI.',
      description:
        'No padrão MVI canônico, a informação flui em uma única direção. A UI nunca altera variáveis nem executa regras de negócio diretamente. Ao tocar em um botão, despacha uma Action; o ViewModel a processa atomicamente e emite um novo State. Efeitos únicos (navegação, snackbars) fluem por um Channel separado.',
      architectureRule:
        'Regra de Ouro MVI: O ViewModel expõe apenas um único StateFlow imutável para o Estado e um Channel receiveAsFlow() para Eventos. A UI se comunica exclusivamente via função onAction(action).',
      kotlinCode: `// 1. A UI dispara uma Action
onAction(ProductListAction.OnSearchQueryChange("Pixel 9"))

// 2. O ViewModel processa a Action
fun onAction(action: ProductListAction) {
    when(action) {
        is ProductListAction.OnSearchQueryChange -> {
            _state.update { it.copy(searchQuery = action.query) }
        }
        ProductListAction.OnCheckoutClick -> {
            viewModelScope.launch {
                _events.send(ProductListEvent.NavigateToCheckout)
            }
        }
    }
}

// 3. A UI coleta o StateFlow e renderiza
val state by viewModel.state.collectAsStateWithLifecycle()`,
      dos: [
        'Manter o fluxo estritamente unidirecional: UI -> Action -> ViewModel -> State -> UI.',
        'Garantir que toda alteração na tela decorra de uma emissão de State.',
        'Separar eventos efêmeros (Event) do estado persistente da tela (State).',
      ],
      donts: [
        'Não criar múltiplas funções públicas no ViewModel (ex: viewModel.loadData(), viewModel.updateText()). Use apenas onAction(action).',
        'Não permitir mutação de propriedades diretamente pela UI.',
      ],
    },
    {
      id: 'state_definition',
      name: 'Single Immutable State (SSOT)',
      badge: 'Estado Único',
      summary: 'Um único data class imutável encapsulando TODO o estado que a tela precisa exibir.',
      description:
        'Evite múltiplos StateFlows independentes no ViewModel. Reúna-os em um único data class com valores padrão. Isso assegura uma Fonte Única da Verdade (SSOT), simplifica testes de unidade e torna o estado da tela reproduzível e inspecionável.',
      architectureRule:
        'Regra de Ouro MVI: Sempre defina uma única classe de estado imutável (ScreenState) com valores padrão em todos os atributos.',
      kotlinCode: `data class ProductListState(
    val products: List<ProductUi> = emptyList(),
    val searchQuery: String = "",
    val isLoading: Boolean = false,
    val selectedCategory: Category? = null,
    val errorMessage: UiText? = null
)`,
      dos: [
        'Usar data class imutável com todas as propriedades como val.',
        'Definir valores padrão para inicialização simplificada ProductListState().',
        'Representar mensagens de erro com o padrão UiText.',
      ],
      donts: [
        'Não usar var dentro da classe de estado.',
        'Não espalhar múltiplos StateFlows primitivos no ViewModel.',
      ],
    },
    {
      id: 'action_interface',
      name: 'Sealed Action / Intent Interface',
      badge: 'Ações do Usuário',
      summary: 'Representa cada interação do usuário ou evento do sistema através de uma sealed interface exaustiva.',
      description:
        'Qualquer clique, scroll, alteração de texto ou evento de ciclo de vida é modelado como Action. O compilador do Kotlin obriga o ViewModel a tratar todos os casos em um when exaustivo sem necessidade de fallback else.',
      architectureRule:
        'Regra de Ouro MVI: Nomeie ações com o prefixo On... descrevendo o ato do usuário, e não a consequência técnica interna.',
      kotlinCode: `sealed interface ProductListAction {
    data class OnSearchQueryChange(val query: String): ProductListAction
    data class OnProductClick(val productId: String): ProductListAction
    data class OnFavoriteToggle(val productId: String): ProductListAction
    data object OnRefresh: ProductListAction
    data object OnCheckoutClick: ProductListAction
}`,
      dos: [
        'Usar data object para ações sem parâmetros e data class para ações com dados.',
        'Descrever o que o usuário realizou (OnProductClick).',
      ],
      donts: [
        'Não usar ramos else no when(action) para que o compilador aponte ações faltantes.',
      ],
    },
    {
      id: 'event_channel',
      name: 'Channel vs State para Eventos Únicos',
      badge: 'Eventos Únicos',
      summary: 'Como evitar repetição de Snackbars ou Navegação ao rotacionar a tela utilizando Channel.',
      description:
        'Armazenar flags de eventos como booleanos no State (ex: showError = true) causa re-execução indesejada na recriação da Activity (rotação de tela). O padrão canônico utiliza Channel<Event> com receiveAsFlow(), garantindo consumo exatamente uma vez.',
      architectureRule:
        'Regra de Ouro MVI: Efeitos únicos (navegação, snackbars) devem ser enviados por Channel privado e expostos via receiveAsFlow().',
      kotlinCode: `private val _events = Channel<ProductListEvent>()
val events = _events.receiveAsFlow()

fun onAction(action: ProductListAction) {
    when(action) {
        ProductListAction.OnCheckoutClick -> {
            viewModelScope.launch {
                _events.send(ProductListEvent.NavigateToCheckout)
            }
        }
    }
}`,
      dos: [
        'Usar Channel<ScreenEvent>(Channel.BUFFERED) para entrega resiliente.',
        'Consumir o fluxo com o helper ObserveAsEvents no Compose.',
      ],
      donts: [
        'Não salvar flags de navegação ou snackbars dentro do data class ScreenState.',
      ],
    },
    {
      id: 'viewmodel_onaction',
      name: 'ViewModel & Atomic State Updates',
      badge: 'ViewModel Seguro',
      summary: 'Estrutura canônica do ViewModel: única função onAction e atualizações atômicas com _state.update {}.',
      description:
        'O ViewModel expõe apenas state e events, além da função onAction(action). Para evitar condições de corrida entre corrotinas concorrentes, utilize sempre _state.update { it.copy(...) }.',
      architectureRule:
        'Regra de Ouro MVI: Nunca atribua diretamente _state.value = .... Use sempre _state.update { it.copy(...) } para modificações atômicas e thread-safe.',
      kotlinCode: `class ProductListViewModel(
    private val repository: ProductRepository
): ViewModel() {

    private val _state = MutableStateFlow(ProductListState())
    val state = _state.asStateFlow()

    private val _events = Channel<ProductListEvent>()
    val events = _events.receiveAsFlow()

    fun onAction(action: ProductListAction) {
        when(action) {
            is ProductListAction.OnSearchQueryChange -> {
                _state.update { it.copy(searchQuery = action.query) }
            }
            ProductListAction.OnRefresh -> loadProducts()
        }
    }
}`,
      dos: [
        'Usar _state.update { it.copy(...) } para prevenir race conditions.',
        'Manter métodos auxiliares de negócio privados.',
      ],
      donts: [
        'Não usar _state.value = _state.value.copy(...).',
      ],
    },
    {
      id: 'screen_root_content',
      name: 'Padrão <Screen>Root & <Screen>Screen',
      badge: 'Estrutura Composable',
      summary: 'Estrutura canônica no mesmo arquivo: 1. <Screen>Root, 2. <Screen>Screen (stateless) e 3. <Screen>ScreenPreview.',
      description:
        'Conforme as diretrizes oficiais de arquitetura Compose nos skills, cada tela reside em um arquivo único (<Screen>Screen.kt) com três componentes em ordem canônica: 1) <Screen>Root (injeta ViewModel via koinViewModel(), coleta estado via collectAsStateWithLifecycle() e observa eventos únicos via ObserveAsEvents); 2) <Screen>Screen (UI 100% stateless com state, lambda onAction e callbacks de navegação direta); e 3) <Screen>ScreenPreview para visualização instantânea.',
      architectureRule:
        'Regra de Ouro MVI (Skills): Mantenha sempre <Screen>Root, <Screen>Screen e <Screen>ScreenPreview no mesmo arquivo. Cliques simples de navegação são disparados diretamente no Screen sem passar pelo ViewModel.',
      kotlinCode: `// ProductListScreen.kt — Root + Screen + Preview no mesmo arquivo

// 1. Root Composable (<Screen>Root)
@Composable
fun ProductListRoot(
    onNavigateToCheckout: () -> Unit,
    viewModel: ProductListViewModel = koinViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    ObserveAsEvents(viewModel.events) { event ->
        when (event) {
            ProductListEvent.NavigateToCheckout -> onNavigateToCheckout()
        }
    }

    ProductListScreen(
        state = state,
        onAction = viewModel::onAction,
        onCheckoutClick = onNavigateToCheckout
    )
}

// 2. Screen Composable (<Screen>Screen - Stateless)
@Composable
fun ProductListScreen(
    state: ProductListState,
    onAction: (ProductListAction) -> Unit,
    onCheckoutClick: () -> Unit
) {
    Scaffold { padding ->
        // UI declarativa pura sem dependência do ViewModel
    }
}

// 3. Screen Preview (<Screen>ScreenPreview)
@Preview
@Composable
private fun ProductListScreenPreview() {
    AppTheme {
        ProductListScreen(
            state = ProductListState(),
            onAction = {},
            onCheckoutClick = {}
        )
    }
}`,
      dos: [
        'Organizar no mesmo arquivo: <Screen>Root, <Screen>Screen e <Screen>ScreenPreview.',
        'Fazer com que Screen receba apenas state, onAction e lambdas diretas de navegação.',
      ],
      donts: [
        'Não passar instâncias de ViewModel para composables filhos ou para <Screen>Screen.',
      ],
    },
    {
      id: 'observe_as_events',
      name: 'ObserveAsEvents Helper',
      badge: 'Ciclo de Vida Seguro',
      summary: 'O helper canônico para coletar Channels no Compose respeitando repeatOnLifecycle.',
      description:
        'Garante que eventos de Channel sejam coletados apenas quando a UI estiver no estado STARTED ou superior, evitando falhas em background ou perda de eventos.',
      architectureRule:
        'Regra de Ouro MVI: Use o composable ObserveAsEvents para todas as inscrições em fluxos de eventos únicos.',
      kotlinCode: `@Composable
fun <T> ObserveAsEvents(
    flow: Flow<T>,
    key1: Any? = null,
    key2: Any? = null,
    onEvent: (T) -> Unit
) {
    val lifecycleOwner = LocalLifecycleOwner.current
    LaunchedEffect(lifecycleOwner.lifecycle, flow, key1, key2) {
        lifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
            withContext(Dispatchers.Main.immediate) {
                flow.collect(onEvent)
            }
        }
    }
}`,
      dos: [
        'Proteger o consumo de eventos respeitando o ciclo de vida da Activity.',
      ],
      donts: [
        'Não coletar eventos brutos sem validação de ciclo de vida.',
      ],
    },
    {
      id: 'uitext_pattern',
      name: 'UiText Clean Architecture Pattern',
      badge: 'Desacoplamento',
      summary: 'Representa textos literais ou de recursos sem acoplar o Android Context ao ViewModel.',
      description:
        'Preserva o ViewModel 100% puro para KMP e testes de unidade, delegando a resolução do recurso de string para a camada de visualização no Compose.',
      architectureRule:
        'Regra de Ouro MVI: Nunca armazene Strings puras quando houver dependência de strings.xml. Utilize UiText.',
      kotlinCode: `sealed interface UiText {
    data class DynamicString(val value: String): UiText
    class StringResource(@StringRes val resId: Int, vararg val args: Any): UiText

    @Composable
    fun asString(): String = when(this) {
        is DynamicString -> value
        is StringResource -> stringResource(resId, *args)
    }
}`,
      dos: [
        'Garantir isolamento do Android framework no ViewModel.',
      ],
      donts: [
        'Não injetar Context no ViewModel apenas para obter strings.',
      ],
    },
  ],

  en: [
    {
      id: 'udf_flow',
      name: 'Unidirectional Data Flow (UDF)',
      badge: 'Core Pattern',
      summary: 'The single-direction loop: UI emits Actions, ViewModel atomically computes new immutable State, and emits back to UI.',
      description:
        'In canonical MVI architecture, data strictly flows in one direction. The UI never mutates properties or runs business logic directly. Clicking an element emits an Action; the ViewModel processes it and updates the single State. One-time transient effects travel via a separate Channel.',
      architectureRule:
        'MVI Golden Rule: The ViewModel exposes only a single immutable StateFlow for State and a Channel receiveAsFlow() for Events. The UI communicates strictly through a single onAction(action) function.',
      kotlinCode: `// 1. UI dispatches an Action
onAction(ProductListAction.OnSearchQueryChange("Pixel 9"))

// 2. ViewModel processes Action
fun onAction(action: ProductListAction) {
    when(action) {
        is ProductListAction.OnSearchQueryChange -> {
            _state.update { it.copy(searchQuery = action.query) }
        }
        ProductListAction.OnCheckoutClick -> {
            viewModelScope.launch {
                _events.send(ProductListEvent.NavigateToCheckout)
            }
        }
    }
}

// 3. UI collects StateFlow and renders
val state by viewModel.state.collectAsStateWithLifecycle()`,
      dos: [
        'Enforce strict single-direction flow: UI -> Action -> ViewModel -> State -> UI.',
        'Keep one-time events (Event) separated from persistent screen state (State).',
      ],
      donts: [
        'Do not expose multiple public methods in ViewModel (e.g. updateQuery(), refreshList()). Use a single onAction(action).',
        'Do not allow UI to mutate state variables.',
      ],
    },
    {
      id: 'state_definition',
      name: 'Single Immutable State (SSOT)',
      badge: 'Single State',
      summary: 'A single immutable data class encapsulating ALL UI properties required by the screen.',
      description:
        'Avoid scattering multiple independent StateFlows across your ViewModel. Consolidate them into a single data class with default values. This guarantees a Single Source of Truth (SSOT), simplifies unit testing, and makes UI states completely reproducible.',
      architectureRule:
        'MVI Golden Rule: Always declare a single immutable data class (ScreenState) with default arguments for all properties.',
      kotlinCode: `data class ProductListState(
    val products: List<ProductUi> = emptyList(),
    val searchQuery: String = "",
    val isLoading: Boolean = false,
    val selectedCategory: Category? = null,
    val errorMessage: UiText? = null
)`,
      dos: [
        'Use an immutable data class with val properties only.',
        'Provide default parameter values so initial state is ProductListState().',
        'Model error messages using the UiText pattern.',
      ],
      donts: [
        'Never use var inside State classes.',
        'Do not store transient navigation flags inside State.',
      ],
    },
    {
      id: 'action_interface',
      name: 'Sealed Action / Intent Interface',
      badge: 'User Actions',
      summary: 'Model every possible user interaction or system event as an exhaustive sealed interface.',
      description:
        'Every button tap, text change, or lifecycle event is captured as an Action. Kotlin sealed interfaces enforce exhaustive when blocks without fallback else branches.',
      architectureRule:
        'MVI Golden Rule: Prefix actions with On... describing user intent rather than internal implementation details.',
      kotlinCode: `sealed interface ProductListAction {
    data class OnSearchQueryChange(val query: String): ProductListAction
    data class OnProductClick(val productId: String): ProductListAction
    data class OnFavoriteToggle(val productId: String): ProductListAction
    data object OnRefresh: ProductListAction
    data object OnCheckoutClick: ProductListAction
}`,
      dos: [
        'Use data object for actions without parameters and data class for actions with payload.',
        'Describe what the user did (OnProductClick).',
      ],
      donts: [
        'Avoid else branches in when(action) to let compiler guard against missing actions.',
      ],
    },
    {
      id: 'event_channel',
      name: 'Channel vs State for One-Shot Events',
      badge: 'One-Shot Events',
      summary: 'Prevent re-showing Snackbars or re-triggering Navigation on screen rotation using Channel.',
      description:
        'Storing one-time events in State flags (e.g. showError = true) causes accidental re-executions when Activity recreates on screen rotation. Canonical MVI prescribes using Channel<Event> with receiveAsFlow() for single-consumer buffer guarantee.',
      architectureRule:
        'MVI Golden Rule: One-time UI events (navigation, snackbar, toast) must be emitted via a private Channel and exposed as receiveAsFlow().',
      kotlinCode: `private val _events = Channel<ProductListEvent>()
val events = _events.receiveAsFlow()

fun onAction(action: ProductListAction) {
    when(action) {
        ProductListAction.OnCheckoutClick -> {
            viewModelScope.launch {
                _events.send(ProductListEvent.NavigateToCheckout)
            }
        }
    }
}`,
      dos: [
        'Use Channel<ScreenEvent>(Channel.BUFFERED) for safe buffering across rotations.',
        'Consume the flow using ObserveAsEvents helper in Compose.',
      ],
      donts: [
        'Do not store navigation or snackbar boolean flags inside ScreenState.',
      ],
    },
    {
      id: 'viewmodel_onaction',
      name: 'ViewModel & Atomic State Updates',
      badge: 'Safe ViewModel',
      summary: 'Canonical ViewModel structure: single onAction function and atomic state updates via _state.update {}.',
      description:
        'Expose only state, events, and a single onAction(action) method. For thread-safe concurrent modifications, always use _state.update { it.copy(...) }.',
      architectureRule:
        'MVI Golden Rule: Never assign _state.value = .... Always use _state.update { it.copy(...) } to prevent race conditions.',
      kotlinCode: `class ProductListViewModel(
    private val repository: ProductRepository
): ViewModel() {

    private val _state = MutableStateFlow(ProductListState())
    val state = _state.asStateFlow()

    private val _events = Channel<ProductListEvent>()
    val events = _events.receiveAsFlow()

    fun onAction(action: ProductListAction) {
        when(action) {
            is ProductListAction.OnSearchQueryChange -> {
                _state.update { it.copy(searchQuery = action.query) }
            }
            ProductListAction.OnRefresh -> loadProducts()
        }
    }
}`,
      dos: [
        'Use _state.update { it.copy(...) } for atomic mutations.',
        'Keep internal business logic methods private.',
      ],
      donts: [
        'Avoid _state.value = _state.value.copy(...).',
      ],
    },
    {
      id: 'screen_root_content',
      name: '<Screen>Root & <Screen>Screen Pattern',
      badge: 'Composable Structure',
      summary: 'Canonical single-file structure: 1. <Screen>Root, 2. <Screen>Screen (stateless), and 3. <Screen>ScreenPreview.',
      description:
        'Following the official Android architecture skills, each screen lives in a single file (<Screen>Screen.kt) containing three components in exact order: 1) <Screen>Root (injects ViewModel via koinViewModel(), collects state via collectAsStateWithLifecycle(), observes events via ObserveAsEvents); 2) <Screen>Screen (100% stateless Composable receiving state, onAction lambda, and direct click navigation callbacks); and 3) <Screen>ScreenPreview for instant Android Studio previews without mocks.',
      architectureRule:
        'MVI Golden Rule (Skills): Always keep <Screen>Root, <Screen>Screen, and <Screen>ScreenPreview in the same file. Direct click navigation callbacks trigger directly in Screen without routing through ViewModel.',
      kotlinCode: `// ProductListScreen.kt — Root + Screen + Preview in a single file

// 1. Root Composable (<Screen>Root)
@Composable
fun ProductListRoot(
    onNavigateToCheckout: () -> Unit,
    viewModel: ProductListViewModel = koinViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    ObserveAsEvents(viewModel.events) { event ->
        when (event) {
            ProductListEvent.NavigateToCheckout -> onNavigateToCheckout()
        }
    }

    ProductListScreen(
        state = state,
        onAction = viewModel::onAction,
        onCheckoutClick = onNavigateToCheckout
    )
}

// 2. Screen Composable (<Screen>Screen - Stateless)
@Composable
fun ProductListScreen(
    state: ProductListState,
    onAction: (ProductListAction) -> Unit,
    onCheckoutClick: () -> Unit
) {
    Scaffold { padding ->
        // Stateless declarative UI without ViewModel dependency
    }
}

// 3. Screen Preview (<Screen>ScreenPreview)
@Preview
@Composable
private fun ProductListScreenPreview() {
    AppTheme {
        ProductListScreen(
            state = ProductListState(),
            onAction = {},
            onCheckoutClick = {}
        )
    }
}`,
      dos: [
        'Organize in the same file: <Screen>Root, then <Screen>Screen, then <Screen>ScreenPreview.',
        'Pass only state, onAction, and direct navigation callbacks to Screen.',
        'Trigger direct button-click navigation directly from Screen callbacks.',
      ],
      donts: [
        'Never pass ViewModel instances into child composables or <Screen>Screen.',
        'Do not split Root and Screen across different files.',
      ],
    },
    {
      id: 'observe_as_events',
      name: 'ObserveAsEvents Helper',
      badge: 'Safe Lifecycle',
      summary: 'Canonical helper for collecting Channels safely in Compose with repeatOnLifecycle.',
      description:
        'Ensures Channel events are collected only when the UI lifecycle is at least STARTED, preventing background crashes or dropped events during configuration changes.',
      architectureRule:
        'MVI Golden Rule: Use ObserveAsEvents for all one-time event stream collections.',
      kotlinCode: `@Composable
fun <T> ObserveAsEvents(
    flow: Flow<T>,
    key1: Any? = null,
    key2: Any? = null,
    onEvent: (T) -> Unit
) {
    val lifecycleOwner = LocalLifecycleOwner.current
    LaunchedEffect(lifecycleOwner.lifecycle, flow, key1, key2) {
        lifecycleOwner.repeatOnLifecycle(Lifecycle.State.STARTED) {
            withContext(Dispatchers.Main.immediate) {
                flow.collect(onEvent)
            }
        }
    }
}`,
      dos: [
        'Collect events safely within STARTED state.',
        'Use Dispatchers.Main.immediate for snappy navigation reactions.',
      ],
      donts: [
        'Do not collect Channel flows with raw LaunchedEffect without lifecycle check.',
      ],
    },
    {
      id: 'uitext_pattern',
      name: 'UiText Clean Architecture Pattern',
      badge: 'Decoupling',
      summary: 'Represents literal text or Android string resources without coupling Android Context to ViewModel.',
      description:
        'Keeps ViewModels 100% pure Kotlin for KMP and unit tests, deferring string resource resolution to Compose UI via asString().',
      architectureRule:
        'MVI Golden Rule: Never hold raw Strings in ViewModel when localized string resources are needed. Use UiText.',
      kotlinCode: `sealed interface UiText {
    data class DynamicString(val value: String): UiText
    class StringResource(@StringRes val resId: Int, vararg val args: Any): UiText

    @Composable
    fun asString(): String = when(this) {
        is DynamicString -> value
        is StringResource -> stringResource(resId, *args)
    }
}`,
      dos: [
        'Use UiText for form validations and error messages in ViewModels.',
      ],
      donts: [
        'Do not pass Context into ViewModels just to call context.getString().',
      ],
    },
  ],
};
