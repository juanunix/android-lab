import { ComposeMistake, LocalizedCategory } from '../types/mistakes';

export const MISTAKE_CATEGORIES: LocalizedCategory[] = [
  { id: 'composition', label: { es: 'Composición', pt: 'Composição', en: 'Composition' } },
  { id: 'state', label: { es: 'Estado', pt: 'Estado', en: 'State' } },
  { id: 'lists', label: { es: 'Listas', pt: 'Listas', en: 'Lists' } },
  { id: 'performance', label: { es: 'Rendimiento', pt: 'Desempenho', en: 'Performance' } },
  { id: 'lifecycle', label: { es: 'Ciclo de Vida', pt: 'Ciclo de Vida', en: 'Lifecycle' } },
  { id: 'architecture', label: { es: 'Arquitectura', pt: 'Arquitetura', en: 'Architecture' } },
  { id: 'layout', label: { es: 'Layout', pt: 'Layout', en: 'Layout' } },
  { id: 'animation', label: { es: 'Animación', pt: 'Animação', en: 'Animation' } },
  { id: 'accessibility', label: { es: 'Accesibilidad', pt: 'Acessibilidade', en: 'Accessibility' } },
];

export const COMPOSE_MISTAKES: ComposeMistake[] = [
  {
    id: 'non-compose-code',
    number: 1,
    category: 'composition',
    title: {
      es: 'Llamar código que no es Compose dentro de un composable',
      pt: 'Chamar código que não é Compose dentro de um composable',
      en: 'Calling non-Compose code in composable functions',
    },
    why: {
      es: 'Cada recomposición vuelve a ejecutar el cuerpo del composable. Lanzar una corrutina o hacer una llamada de red ahí dispara el trabajo una y otra vez.',
      pt: 'Cada recomposição executa novamente o corpo do composable. Lançar uma corrotina ou fazer uma chamada de rede ali dispara o trabalho repetidas vezes.',
      en: 'Every recomposition runs the composable body again. Launching a coroutine or making a network call there fires the work over and over.',
    },
    fix: {
      es: 'Mueve el trabajo a LaunchedEffect o DisposableEffect con las claves correctas.',
      pt: 'Mova o trabalho para LaunchedEffect ou DisposableEffect com as chaves corretas.',
      en: 'Move the work into LaunchedEffect or DisposableEffect with the right keys.',
    },
    badCode: `@Composable
fun BookingList() {
    val scope = rememberCoroutineScope()
    var bookings by remember {
        mutableStateOf<List<Booking>>(emptyList())
    }

    scope.launch {
        bookings = loadBookings()
    }

    LazyColumn {
        items(bookings) {
            // ...
        }
    }
}`,
    goodCode: `@Composable
fun BookingList() {
    var bookings by remember {
        mutableStateOf<List<Booking>>(emptyList())
    }
    LaunchedEffect(true) {
        bookings = loadBookings()
    }

    LazyColumn {
        items(bookings) {
            // ...
        }
    }
}`,
  },
  {
    id: 'mutable-list-state',
    number: 2,
    category: 'state',
    title: {
      es: 'Usar MutableList como estado',
      pt: 'Usar MutableList como estado',
      en: 'Using MutableList as a state',
    },
    why: {
      es: 'Compose no puede observar mutaciones internas de una MutableList: agregar elementos no invalida la composición.',
      pt: 'O Compose não consegue observar mutações internas de uma MutableList: adicionar elementos não invalida a composição.',
      en: 'Compose cannot observe internal mutations of a MutableList: adding items does not invalidate composition.',
    },
    fix: {
      es: 'Haz que el estado sea una lista inmutable y reemplaza el valor completo en cada cambio.',
      pt: 'Faça o estado ser uma lista imutável e substitua o valor completo a cada mudança.',
      en: 'Make the state an immutable list and replace the whole value on every change.',
    },
    badCode: `@Composable
fun NamesList() {
    val names by remember {
        mutableStateOf(mutableListOf<String>())
    }

    LazyColumn {
        item {
            Button(onClick = { names.add("Hans") }) {
                Text(text = "Add name")
            }
        }
        items(names) { name ->
            Text(name)
        }
    }
}`,
    goodCode: `@Composable
fun NamesList() {
    var names by remember {
        mutableStateOf(listOf<String>())
    }

    LazyColumn {
        item {
            Button(onClick = {
                names = names + "Hans"
            }) {
                Text(text = "Add name")
            }
        }
        items(names) { name ->
            Text(name)
        }
    }
}`,
  },
  {
    id: 'remember-state',
    number: 3,
    category: 'state',
    title: {
      es: 'Crear estado solo con remember',
      pt: 'Criar estado apenas com remember',
      en: 'Creating state with remember',
    },
    why: {
      es: 'remember sobrevive a recomposiciones, pero no a cambios de configuración ni a la muerte del proceso. El texto se pierde al rotar la pantalla.',
      pt: 'remember sobrevive a recomposições, mas não a mudanças de configuração nem à morte do processo. O texto se perde ao girar a tela.',
      en: 'remember survives recompositions, but not configuration changes or process death. The text is lost when the screen rotates.',
    },
    fix: {
      es: 'Guarda el estado en un ViewModel (con SavedStateHandle) o usa rememberSaveable si debe vivir en el composable.',
      pt: 'Guarde o estado em um ViewModel (com SavedStateHandle) ou use rememberSaveable se ele precisar viver no composable.',
      en: 'Keep state in a ViewModel (with SavedStateHandle) or use rememberSaveable if it must live in the composable.',
    },
    badCode: `@Composable
fun LoginScreen() {
    var emailText by remember {
        mutableStateOf("")
    }

    TextField(
        value = emailText,
        onValueChange = { emailText = it }
    )
}`,
    goodCode: `// LoginViewModel.kt
class LoginViewModel(
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {

    val emailText by savedStateHandle.saveable("emailText") {
        mutableStateOf("")
    }

    fun onEmailTextChange(value: String) {
        savedStateHandle["emailText"] = value
    }
}

// AppRoot.kt
@Composable
fun AppRoot() {
    val navController = rememberNavController()
    NavHost(
        navController = navController,
        startDestination = "login"
    ) {
        composable("login") {
            val viewModel = viewModel<LoginViewModel>()
            LoginScreen(
                emailText = viewModel.emailText,
                onEmailTextChange = viewModel::onEmailTextChange
            )
        }
    }
}

// LoginScreen.kt
@Composable
fun LoginScreen(
    emailText: String,
    onEmailTextChange: (String) -> Unit
) {
    TextField(
        value = emailText,
        onValueChange = onEmailTextChange
    )
}`,
  },
  {
    id: 'lazy-column-keys',
    number: 4,
    category: 'lists',
    title: {
      es: 'No usar keys dentro de un LazyColumn',
      pt: 'Não usar keys dentro de um LazyColumn',
      en: 'Not using keys inside a LazyColumn',
    },
    why: {
      es: 'Sin keys, la lista no sabe qué elemento cambió y recompone todos los elementos visibles.',
      pt: 'Sem keys, a lista não sabe qual item mudou e recompõe todos os itens visíveis.',
      en: 'Without keys, the list does not know which item changed and recomposes every visible item.',
    },
    fix: {
      es: 'Define key = { it.id } para identificar cada elemento y, de paso, poder animar los cambios.',
      pt: 'Defina key = { it.id } para identificar cada item e, de bônus, poder animar as mudanças.',
      en: 'Define key = { it.id } to identify each item and, as a bonus, animate list changes.',
    },
    badCode: `@Composable
fun NoteList(notes: List<Note>) {
    LazyColumn {
        items(notes) { note ->
            // ...
        }
    }
}`,
    goodCode: `@Composable
fun NoteList(notes: List<Note>) {
    LazyColumn {
        items(
            items = notes,
            key = { note ->
                note.id
            }
        ) { note ->
            // ...
        }
    }
}`,
  },
  {
    id: 'unstable-external-classes',
    number: 5,
    category: 'performance',
    title: {
      es: 'Usar clases inestables de módulos externos',
      pt: 'Usar classes instáveis de módulos externos',
      en: 'Using unstable classes from external modules',
    },
    why: {
      es: 'Las clases de módulos que no usan Compose son inestables por defecto, así que cualquier cambio en cualquier campo puede recomponer todo lo que las use.',
      pt: 'Classes de módulos que não usam Compose são instáveis por padrão, então qualquer mudança em qualquer campo pode recompor tudo que as usa.',
      en: 'Classes from modules that do not use Compose are unstable by default, so any field change can recompose everything that uses them.',
    },
    fix: {
      es: 'Mapea el modelo externo a un modelo estable dentro de tu módulo Compose.',
      pt: 'Mapeie o modelo externo para um modelo estável dentro do seu módulo Compose.',
      en: 'Map the external model to a stable model inside your Compose module.',
    },
    badCode: `data class User(
    val id: String,
    val name: String,
    val isAdmin: Boolean,
    val profilePictureUrl: String
)

@Composable
fun UserProfile(user: User) {
    Column {
        ProfilePicture(user.profilePictureUrl)
        Text(text = user.name)

        if (user.isAdmin) {
            Text(text = "ADMIN")
        }
    }
}`,
    goodCode: `fun User.toComposeUser(): ComposeUser {
    return ComposeUser(id, name, isAdmin, profilePictureUrl)
}

fun ComposeUser.toUser(): User {
    return User(id, name, isAdmin, profilePictureUrl)
}

@Composable
fun UserProfile(user: ComposeUser) {
    Column {
        ProfilePicture(user.profilePictureUrl)
        Text(text = user.name)

        if (user.isAdmin) {
            Text(text = "ADMIN")
        }
    }
}`,
  },
  {
    id: 'collect-as-state',
    number: 6,
    category: 'lifecycle',
    title: {
      es: 'Consumir Flows con collectAsState()',
      pt: 'Consumir Flows com collectAsState()',
      en: 'Consuming Flows with collectAsState()',
    },
    why: {
      es: 'collectAsState() no conoce el ciclo de vida de la Activity: el Flow sigue recolectando y ejecutando efectos aunque la app esté en segundo plano.',
      pt: 'collectAsState() não conhece o ciclo de vida da Activity: o Flow continua coletando e executando efeitos mesmo com o app em segundo plano.',
      en: 'collectAsState() knows nothing about the Activity lifecycle: the Flow keeps collecting and running side effects while the app is in the background.',
    },
    fix: {
      es: 'Usa collectAsStateWithLifecycle() de lifecycle-runtime-compose.',
      pt: 'Use collectAsStateWithLifecycle() do lifecycle-runtime-compose.',
      en: 'Use collectAsStateWithLifecycle() from lifecycle-runtime-compose.',
    },
    badCode: `class CounterViewModel : ViewModel() {

    private val _counter = MutableStateFlow(0)
    val counter = _counter
        .onEach {
            saveCounterToDb(it)
        }
        .stateIn(
            viewModelScope,
            SharingStarted.WhileSubscribed(5000),
            0
        )
}

@Composable
fun Counter() {
    val viewModel = viewModel<CounterViewModel>()
    val counter by viewModel.counter.collectAsState()

    Text(text = counter.toString())
}`,
    goodCode: `// build.gradle
// implementation("androidx.lifecycle:lifecycle-runtime-compose:2.6.1")

@Composable
fun Counter() {
    val viewModel = viewModel<CounterViewModel>()
    val counter by viewModel.counter.collectAsStateWithLifecycle()

    Text(text = counter.toString())
}`,
  },
  {
    id: 'transform-animation',
    number: 7,
    category: 'animation',
    title: {
      es: 'Animar transformaciones fuera de graphicsLayer',
      pt: 'Animar transformações fora do graphicsLayer',
      en: 'Animating transform outside of graphicsLayer',
    },
    why: {
      es: 'Cambiar rotación, escala o posición con modificadores provoca una recomposición por cada frame de la animación.',
      pt: 'Alterar rotação, escala ou posição com modificadores provoca uma recomposição a cada frame da animação.',
      en: 'Changing rotation, scale or position with modifiers triggers a recomposition on every animation frame.',
    },
    fix: {
      es: 'Aplica transformaciones, clipping y alpha dentro de graphicsLayer.',
      pt: 'Aplique transformações, clipping e alpha dentro do graphicsLayer.',
      en: 'Apply transforms, clipping and alpha inside graphicsLayer.',
    },
    badCode: `@Composable
fun RotatingBox() {
    val transition = rememberInfiniteTransition()
    val rotationRatio by transition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(5000),
        )
    )
    Box(
        modifier = Modifier
            .rotate(rotationRatio * 360f)
            .size(100.dp)
            .background(Color.Red)
    )
}`,
    goodCode: `@Composable
fun RotatingBox() {
    val transition = rememberInfiniteTransition()
    val rotationRatio by transition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(5000),
        )
    )
    Box(
        modifier = Modifier
            .graphicsLayer {
                rotationZ = rotationRatio * 360f
            }
            .size(100.dp)
            .background(Color.Red)
    )
}`,
  },
  {
    id: 'viewmodel-screen-level',
    number: 8,
    category: 'architecture',
    title: {
      es: 'Crear ViewModels a nivel de pantalla con Hilt',
      pt: 'Criar ViewModels no nível da tela com Hilt',
      en: 'Creating ViewModels on screen level with Hilt',
    },
    why: {
      es: 'Si el composable de pantalla instancia el ViewModel, la pantalla deja de poder usarse en previews y tests aislados.',
      pt: 'Se o composable da tela instancia o ViewModel, a tela deixa de poder ser usada em previews e testes isolados.',
      en: 'If the screen composable instantiates the ViewModel, the screen can no longer be used in previews or isolated tests.',
    },
    fix: {
      es: 'Separa un <Screen>Screen sin estado y un <Screen>Root que instancia el ViewModel y pasa state + onEvent.',
      pt: 'Separe um <Screen>Screen sem estado e um <Screen>Root que instancia o ViewModel e passa state + onEvent.',
      en: 'Split into a stateless <Screen>Screen and a <Screen>Root that creates the ViewModel and passes state + onEvent.',
    },
    badCode: `@Composable
fun LoginScreen() {
    val viewModel: LoginViewModel = hiltViewModel()
    val state = viewModel.state
    Column {
        if (state.isLoading) {
            CircularProgressIndicator()
        }
        Button(onClick = { viewModel.login() }) {
            Text(text = "Login")
        }
    }
}`,
    goodCode: `sealed interface LoginEvent {
    object Login : LoginEvent
    // More events...
}

class LoginViewModel : ViewModel() {

    var state by mutableStateOf(LoginState())
        private set

    fun onEvent(event: LoginEvent) {
        when (event) {
            is LoginEvent.Login -> { /* Handle login */ }
            // ...
        }
    }
}

@Composable
fun LoginScreen(
    state: LoginState,
    onEvent: (LoginEvent) -> Unit
) {
    Column {
        if (state.isLoading) {
            CircularProgressIndicator()
        }
        Button(onClick = { onEvent(LoginEvent.Login) }) {
            Text(text = "Login")
        }
    }
}

@Composable
fun LoginScreenRoot() {
    val viewModel = hiltViewModel<LoginViewModel>()
    LoginScreen(
        state = viewModel.state,
        onEvent = viewModel::onEvent
    )
}`,
  },
  {
    id: 'expanding-sizes',
    number: 9,
    category: 'layout',
    title: {
      es: 'Fijar tamaños expansivos en sub-composables',
      pt: 'Fixar tamanhos expansivos em sub-composables',
      en: 'Setting expanding sizes in sub-composables',
    },
    why: {
      es: 'Un fillMaxWidth() dentro de un componente reutilizable obliga a todas sus instancias a ocupar el ancho completo y rompe la composición con otros elementos.',
      pt: 'Um fillMaxWidth() dentro de um componente reutilizável obriga todas as instâncias a ocupar a largura total e quebra a composição com outros elementos.',
      en: 'A fillMaxWidth() inside a reusable component forces every instance to fill the parent width and breaks composing it next to other elements.',
    },
    fix: {
      es: 'No pongas modificadores de tamaño expansivo en la raíz del componente; pásalos desde fuera.',
      pt: 'Não coloque modificadores de tamanho expansivo na raiz do componente; passe-os de fora.',
      en: 'Do not put expanding size modifiers on the component root; pass them from the outside.',
    },
    badCode: `@Composable
fun MyButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Button(
        onClick = onClick,
        modifier = modifier
            .clip(RoundedCornerShape(100))
            .fillMaxWidth()
    ) {
        Text(text = "Cool button")
    }
}`,
    goodCode: `@Composable
fun MyButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Button(
        onClick = onClick,
        modifier = modifier
            .clip(RoundedCornerShape(100))
    ) {
        Text(text = "Cool button")
    }
}

// Usage
MyButton(
    onClick = { /*TODO*/ },
    modifier = Modifier.fillMaxWidth()
)`,
  },
  {
    id: 'remember-heavy-computations',
    number: 10,
    category: 'performance',
    title: {
      es: 'No usar remember para cálculos pesados',
      pt: 'Não usar remember para cálculos pesados',
      en: 'Not using remember for heavy computations',
    },
    why: {
      es: 'El cálculo pesado se repite en cada recomposición, aunque sus entradas no hayan cambiado.',
      pt: 'O cálculo pesado se repete a cada recomposição, mesmo que suas entradas não tenham mudado.',
      en: 'The heavy computation runs on every recomposition, even when its inputs have not changed.',
    },
    fix: {
      es: 'Cachea el resultado con remember(keys) para recalcular solo cuando la clave cambie.',
      pt: 'Cacheie o resultado com remember(keys) para recalcular apenas quando a chave mudar.',
      en: 'Cache the result with remember(keys) so it recomputes only when the key changes.',
    },
    badCode: `@Composable
fun EncryptedImage(
    encryptedBytes: ByteArray,
    modifier: Modifier = Modifier
) {
    val decryptedBytes = CryptoManager.decrypt(encryptedBytes)
    val bitmap = BitmapFactory.decodeByteArray(
        decryptedBytes,
        0,
        decryptedBytes.size
    )
    Image(
        bitmap = bitmap.asImageBitmap(),
        contentDescription = null,
        modifier = modifier
    )
}`,
    goodCode: `@Composable
fun EncryptedImage(
    encryptedBytes: ByteArray,
    modifier: Modifier = Modifier
) {
    val bitmap = remember(encryptedBytes) {
        val decryptedBytes = CryptoManager.decrypt(encryptedBytes)
        BitmapFactory.decodeByteArray(
            decryptedBytes,
            0,
            decryptedBytes.size
        )
    }
    Image(
        bitmap = bitmap.asImageBitmap(),
        contentDescription = null,
        modifier = modifier
    )
}`,
  },
  {
    id: 'hardcoded-dp',
    number: 11,
    category: 'layout',
    title: {
      es: 'Abusar de unidades dp fijas',
      pt: 'Abusar de unidades dp fixas',
      en: 'Overusing hardcoded dp units',
    },
    why: {
      es: 'Un ancho fijo que se ve bien en tu dispositivo puede verse mal en pantallas pequeñas o en tablets.',
      pt: 'Uma largura fixa que parece boa no seu dispositivo pode ficar ruim em telas pequenas ou tablets.',
      en: 'A fixed width that looks fine on your device may look wrong on smaller screens or tablets.',
    },
    fix: {
      es: 'Combina fillMaxWidth() con widthIn(max = ...) o usa weight() para tamaños relativos.',
      pt: 'Combine fillMaxWidth() com widthIn(max = ...) ou use weight() para tamanhos relativos.',
      en: 'Combine fillMaxWidth() with widthIn(max = ...) or use weight() for relative sizes.',
    },
    badCode: `@Composable
fun LoginScreen(state: LoginState) {
    Column {
        TextField(
            value = state.email,
            onValueChange = { /* ... */ },
            modifier = Modifier.width(300.dp)
        )
    }
}`,
    goodCode: `@Composable
fun LoginScreen(state: LoginState) {
    Column {
        TextField(
            value = state.email,
            onValueChange = { /* ... */ },
            modifier = Modifier
                .widthIn(max = 400.dp)
                .fillMaxWidth()
        )
    }
}`,
  },
  {
    id: 'touch-target-size',
    number: 12,
    category: 'accessibility',
    title: {
      es: 'Olvidar el tamaño del área táctil',
      pt: 'Esquecer o tamanho da área de toque',
      en: 'Forgetting about touch target size',
    },
    why: {
      es: 'Un icono pequeño es más difícil de pulsar que un dedo. Un área táctil insuficiente frustra al usuario.',
      pt: 'Um ícone pequeno é mais difícil de tocar do que um dedo. Uma área de toque insuficiente frustra o usuário.',
      en: 'A small icon is harder to tap than a finger. An insufficient touch target frustrates users.',
    },
    fix: {
      es: 'Usa IconButton o envuelve el elemento en un área clickable de al menos 48dp.',
      pt: 'Use IconButton ou envolva o elemento em uma área clicável de pelo menos 48dp.',
      en: 'Use IconButton or wrap the element in a clickable area of at least 48dp.',
    },
    badCode: `@Composable
fun OptionsButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Icon(
        imageVector = Icons.Default.Menu,
        contentDescription = "Options",
        modifier = modifier
            .clickable { onClick() }
    )
}`,
    goodCode: `@Composable
fun OptionsButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    IconButton(
        onClick = onClick,
        modifier = modifier
    ) {
        Icon(
            imageVector = Icons.Default.Menu,
            contentDescription = "Options"
        )
    }
}`,
  },
  {
    id: 'fragment-composition-strategy',
    number: 13,
    category: 'lifecycle',
    title: {
      es: 'No configurar la estrategia de composición en Fragments',
      pt: 'Não configurar a estratégia de composição em Fragments',
      en: 'Not checking view composition strategy in Fragments',
    },
    why: {
      es: 'Por defecto la composición se destruye cuando el ComposeView se desadjunta, lo que puede provocar pérdida de estado al integrar Compose en Fragments.',
      pt: 'Por padrão a composição é destruída quando o ComposeView é desanexado, o que pode causar perda de estado ao integrar Compose em Fragments.',
      en: 'By default the composition is disposed when the ComposeView detaches, which can lose state when integrating Compose into Fragments.',
    },
    fix: {
      es: 'Configura ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed.',
      pt: 'Configure ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed.',
      en: 'Set ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed.',
    },
    badCode: `class LoginFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return ComposeView(requireContext()).apply {
            setContent {
                // Composable screen
            }
        }
    }
}`,
    goodCode: `return ComposeView(requireContext()).apply {
    setViewCompositionStrategy(
        ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed
    )
    setContent {
        // Composable screen
    }
}`,
  },
  {
    id: 'mixed-state-naming',
    number: 14,
    category: 'architecture',
    title: {
      es: 'Mezclar convenciones al nombrar el estado',
      pt: 'Misturar convenções ao nomear o estado',
      en: 'Mixing state naming',
    },
    why: {
      es: 'Mezclar nombres por efecto visual (isProgressBarVisible) y por comportamiento (isLoginFailed) hace que el estado sea inconsistente y difícil de razonar.',
      pt: 'Misturar nomes por efeito visual (isProgressBarVisible) e por comportamento (isLoginFailed) torna o estado inconsistente e difícil de raciocinar.',
      en: 'Mixing names by visual effect (isProgressBarVisible) and by behavior (isLoginFailed) makes state inconsistent and hard to reason about.',
    },
    fix: {
      es: 'Nombra todo por comportamiento lógico, por ejemplo isLoggingIn, y deja que cada composable decida cómo representarlo.',
      pt: 'Nomeie tudo por comportamento lógico, por exemplo isLoggingIn, e deixe cada composable decidir como representá-lo.',
      en: 'Name everything by logical behavior, such as isLoggingIn, and let each composable decide how to render it.',
    },
    badCode: `data class LoginState(
    val emailText: String = "",
    val isProgressBarVisible: Boolean = false,
    val isLoginFailed: Boolean = false
)`,
    goodCode: `data class LoginState(
    val emailText: String = "",
    val isLoggingIn: Boolean = false,
    val isLoginFailed: Boolean = false
)`,
  },
  {
    id: 'scrollable-columns',
    number: 15,
    category: 'layout',
    title: {
      es: 'Olvidar hacer scrollables las Column',
      pt: 'Esquecer de tornar as Column roláveis',
      en: 'Forgetting about making Columns scrollable',
    },
    why: {
      es: 'Que todo quepa en tu dispositivo de prueba no garantiza que quepa en pantallas más pequeñas o con fuente grande.',
      pt: 'O fato de tudo caber no seu dispositivo de teste não garante que caiba em telas menores ou com fonte grande.',
      en: 'Everything fitting on your test device does not guarantee it fits on smaller screens or with large fonts.',
    },
    fix: {
      es: 'Añade verticalScroll(rememberScrollState()) a la Column exterior cuando la pantalla tenga contenido abundante.',
      pt: 'Adicione verticalScroll(rememberScrollState()) à Column externa quando a tela tiver conteúdo abundante.',
      en: 'Add verticalScroll(rememberScrollState()) to the outer Column when the screen has plenty of content.',
    },
    badCode: `@Composable
fun AgendaScreen() {
    Column {
        // Lots of composables
    }
}`,
    goodCode: `@Composable
fun AgendaScreen() {
    Column(
        modifier = Modifier
            .verticalScroll(rememberScrollState())
    ) {
        // Lots of composables
    }
}`,
  },
  {
    id: 'unnamed-lambdas',
    number: 16,
    category: 'architecture',
    title: {
      es: 'No nombrar las lambdas de los composables',
      pt: 'Não nomear as lambdas dos composables',
      en: 'Not naming lambdas in composables',
    },
    why: {
      es: 'Usar siempre el último parámetro como trailing lambda oculta cuándo se ejecuta y para qué sirve ese callback.',
      pt: 'Usar sempre o último parâmetro como trailing lambda esconde quando o callback é executado e para que serve.',
      en: 'Always using the last parameter as a trailing lambda hides when that callback runs and what it is for.',
    },
    fix: {
      es: 'Nombra los callbacks que no sean contenido; deja el trailing lambda solo para el contenido composable.',
      pt: 'Nomeie os callbacks que não são conteúdo; deixe o trailing lambda apenas para o conteúdo composable.',
      en: 'Name callbacks that are not content; reserve the trailing lambda for composable content.',
    },
    badCode: `@Composable
fun LoginScreen() {
    VerticalScrollContainer(
        content = {
            // ...
        }
    ) {

    }
}`,
    goodCode: `@Composable
fun LoginScreen() {
    VerticalScrollContainer(
        content = {
            // ...
        },
        onScroll = { scrollOffset ->

        }
    )
}`,
  },
  {
    id: 'misuse-remember-coroutine-scope',
    number: 17,
    category: 'lifecycle',
    title: {
      es: 'Mal uso de rememberCoroutineScope',
      pt: 'Mau uso de rememberCoroutineScope',
      en: 'Misusing rememberCoroutineScope',
    },
    why: {
      es: 'El scope de la composición se cancela con ella: una rotación de pantalla cancela el login o la operación de negocio en curso.',
      pt: 'O scope da composição é cancelado com ela: uma rotação de tela cancela o login ou a operação de negócio em andamento.',
      en: 'The composition scope is cancelled with it: a screen rotation cancels the login or business operation in progress.',
    },
    fix: {
      es: 'Ejecuta la lógica en viewModelScope y expón estado; usa el scope de Compose solo para UI (animaciones, snackbars).',
      pt: 'Execute a lógica em viewModelScope e exponha estado; use o scope do Compose apenas para UI (animações, snackbars).',
      en: 'Run the logic in viewModelScope and expose state; use the Compose scope only for UI work (animations, snackbars).',
    },
    badCode: `@Composable
fun LoginScreen(
    viewModel: LoginViewModel,
    navController: NavController
) {
    val scope = rememberCoroutineScope()
    Button(onClick = {
        scope.launch {
            val result = viewModel.login() // Suspending function
            if (result == Result.SUCCESS) {
                navController.navigate("home")
            }
        }
    }) {
        Text(text = "Login")
    }
}`,
    goodCode: `@Composable
fun LoginScreen(
    viewModel: LoginViewModel,
    navController: NavController
) {
    LaunchedEffect(key1 = viewModel.isLoggedIn) {
        if (viewModel.isLoggedIn) {
            navController.navigate("home") {
                popUpTo("home") {
                    inclusive = false
                }
            }
        }
    }
    Button(onClick = {
        viewModel.login() // Not suspending
    }) {
        Text(text = "Login")
    }
}`,
  },
  {
    id: 'frequent-state-sub-composable',
    number: 18,
    category: 'performance',
    title: {
      es: 'Pasar estado que cambia frecuentemente a un sub-composable',
      pt: 'Passar estado que muda frequentemente para um sub-composable',
      en: 'Frequently changing state in sub-composable and graphicsLayer',
    },
    why: {
      es: 'Aunque uses graphicsLayer, pasar el valor como parámetro hace que el hijo se recomponga en cada cambio de scroll.',
      pt: 'Mesmo usando graphicsLayer, passar o valor como parâmetro faz o filho recompor a cada mudança de scroll.',
      en: 'Even with graphicsLayer, passing the value as a parameter makes the child recompose on every scroll change.',
    },
    fix: {
      es: 'Pasa una lambda que lea el estado y usa alpha() dentro de graphicsLayer para saltar la fase de composición.',
      pt: 'Passe uma lambda que leia o estado e use alpha() dentro do graphicsLayer para pular a fase de composição.',
      en: 'Pass a lambda that reads the state and call alpha() inside graphicsLayer to skip the composition phase.',
    },
    badCode: `@Composable
fun ListScreen() {
    val scrollState = rememberScrollState()
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
    ) {
        for (i in 1..50) {
            ListItem(
                alpha = scrollState.value / 50f,
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

@Composable
fun ListItem(
    alpha: Float,
    modifier: Modifier = Modifier
) {
    Text(
        text = "List item",
        modifier = modifier
            .padding(32.dp)
            .graphicsLayer {
                this.alpha = alpha
            }
    )
}`,
    goodCode: `@Composable
fun ListScreen() {
    val scrollState = rememberScrollState()
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
    ) {
        for (i in 1..50) {
            ListItem(
                alpha = { scrollState.value / 50f },
                modifier = Modifier.fillMaxWidth()
            )
        }
    }
}

@Composable
fun ListItem(
    alpha: () -> Float,
    modifier: Modifier = Modifier
) {
    Text(
        text = "List item",
        modifier = modifier
            .padding(32.dp)
            .graphicsLayer {
                this.alpha = alpha()
            }
    )
}`,
  },
  {
    id: 'scaffold-content-padding',
    number: 19,
    category: 'layout',
    title: {
      es: 'No usar el content padding del Scaffold',
      pt: 'Não usar o content padding do Scaffold',
      en: 'Not using content padding of Scaffold',
    },
    why: {
      es: 'Ignorar paddingValues puede ocultar el contenido detrás de barras de navegación, toolbars o insets del sistema.',
      pt: 'Ignorar paddingValues pode esconder o conteúdo atrás de barras de navegação, toolbars ou insets do sistema.',
      en: 'Ignoring paddingValues can hide content behind navigation bars, toolbars or system insets.',
    },
    fix: {
      es: 'Aplica el paddingValues al contenedor raíz del contenido del Scaffold.',
      pt: 'Aplique o paddingValues ao contêiner raiz do conteúdo do Scaffold.',
      en: 'Apply paddingValues to the root container of the Scaffold content.',
    },
    badCode: `@Composable
fun LoginScreen() {
    Scaffold(
        modifier = Modifier.fillMaxSize()
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            // Screen content
        }
    }
}`,
    goodCode: `@Composable
fun LoginScreen() {
    Scaffold(
        modifier = Modifier.fillMaxSize()
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Screen content
        }
    }
}`,
  },
  {
    id: 'return-in-composable',
    number: 20,
    category: 'composition',
    title: {
      es: 'Usar return dentro de funciones composable',
      pt: 'Usar return dentro de funções composable',
      en: 'Returning in composable functions',
    },
    why: {
      es: 'Un return dentro de @Composable puede provocar comportamiento indefinido cuando Compose omite la fase de composición.',
      pt: 'Um return dentro de @Composable pode causar comportamento indefinido quando o Compose pula a fase de composição.',
      en: 'A return inside @Composable can cause undefined behavior when Compose skips the composition phase.',
    },
    fix: {
      es: 'Usa if o let para condicionales y comprobaciones de nulos en lugar de return.',
      pt: 'Use if ou let para condicionais e verificações de nulos em vez de return.',
      en: 'Use if or let for conditionals and null checks instead of return.',
    },
    badCode: `@Composable
fun LoginScreen(state: LoginState) {
    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        EmailTextField(/* ... */)
        PasswordTextField(/* ... */)
        Text(
            text = state.loginError ?: return@Column,
        )
    }
}`,
    goodCode: `@Composable
fun LoginScreen(state: LoginState) {
    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        EmailTextField(/* ... */)
        PasswordTextField(/* ... */)
        state.loginError?.let { error ->
            Text(
                text = error
            )
        }
    }
}`,
  },
];
