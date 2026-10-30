import { Language, Translations, SideEffectTranslation } from './types';

export const TRANSLATIONS: Record<Language, Translations> = {
  es: {
    nav: {
      effects: 'Efectos',
      lifecycle: 'Ciclo de Vida',
      matrix: 'Comparativa',
      pitfalls: 'Buenas Prácticas',
      whichToUse: '¿Cuál Usar?',
    },
    hero: {
      kicker: 'Android Jetpack Compose · Side-Effects Lab · Kotlin 2.x',
      title: 'Side-Effects en Jetpack Compose de forma Visual e Interactiva',
      subtitle:
        'Experimenta en tiempo real cómo funcionan LaunchedEffect, DisposableEffect, derivedStateOf y todos los efectos de Compose. Interactúa con simulaciones en vivo, inspecciona el Logcat y domina el código Kotlin.',
      exploreBtn: 'Explorar los 8 Efectos',
      whichToUseBtn: '¿Cuál efecto debo usar?',
    },
    catalog: {
      title: 'Laboratorio Interactivo de Side-Effects',
      subtitle:
        'Selecciona un efecto para probar su comportamiento en la pantalla de Android y ver su código.',
      categories: {
        all: 'Todos',
        coroutines: 'Corrutinas',
        lifecycle: 'Ciclo de Vida',
        state_conversion: 'Conversión',
        optimization: 'Optimización',
      },
    },
    simulator: {
      title: 'Simulador Android en Vivo',
      recompositions: 'Recomps:',
      runtime: 'Jetpack Compose Runtime',
      parametersTitle: 'Parámetros Principales:',
      codeTitle: 'Código Fuente Kotlin',
      exampleLabel: 'Ejemplo',
      whenToUseTitle: 'Cuándo Usarlo (Casos Ideales)',
      pitfallsTitle: 'Errores Comunes a Evitar',
    },
    logcat: {
      title: 'Android Logcat Simulator',
      eventsCount: 'eventos',
      emptyWaiting: 'Esperando eventos de ciclo de vida o recomposición...',
      emptyHint:
        'Interactúa con los controles arriba para ver los logs en tiempo real.',
      clearTooltip: 'Limpiar registros',
    },
    matrix: {
      kicker: 'Matriz Técnica de Comparación',
      title: 'Side-Effects de un Vistazo',
      subtitle:
        'Compara las características clave de ejecución, corrutinas y mecanismos de limpieza.',
      colEffect: 'Side-Effect',
      colCoroutines: '¿Maneja Corrutinas?',
      colCleanup: '¿Requiere Limpieza?',
      colTrigger: 'Disparador Principal',
      colPurpose: 'Objetivo Principal',
      colAction: 'Acción',
      viewInLab: 'Ver en Lab →',
      yesSuspend: 'Sí (suspend)',
      noSync: 'No (síncrono)',
      automaticOrNA: 'Automática / N/A',
    },
    lifecycle: {
      kicker: 'Ciclo de Vida de Jetpack Compose',
      title: '¿Cuándo se ejecuta cada Side-Effect?',
      subtitle:
        'Haz clic en cada fase del ciclo de vida para entender qué ocurre con las corrutinas, los listeners y la recomposición.',
      initialPhase: '1. Composición Inicial',
      initialDesc:
        'El Composable entra al árbol por primera vez tras invocar la función.',
      recompPhase: '2. Recomposición (N veces)',
      recompDesc:
        'Uno o más objetos State observados cambiaron de valor en la jerarquía.',
      leavingPhase: '3. Abandono de Composición',
      leavingDesc:
        'El Composable se elimina de la jerarquía UI (navegación o visibilidad false).',
      phasePrefix: 'Fase',
      activeHandlers: 'handlers activos',
      viewDemoAndCode: 'Ver demo y código →',
    },
    pitfallsSection: {
      kicker: 'Guía de Arquitectura',
      title: 'Las 4 Reglas de Oro de los Side-Effects',
      subtitle:
        'Consejos esenciales para escribir Composables limpios, predecibles y de alto rendimiento.',
      rules: {
        rule1Title: 'Las funciones Composables deben ser puras e idempotentes',
        rule1Desc:
          'Nunca modifiques variables globales, escribas en bases de datos o realices llamadas de red directamente en el cuerpo de una función @Composable. Compose puede ejecutar, saltarse o descartar recomposiciones en cualquier momento. Envuelve siempre tus efectos en los manejadores dedicados.',
        rule2Title: 'Elige con precisión las claves (keys) de LaunchedEffect',
        rule2Desc:
          'Usa Unit o true solo si el efecto debe correr una única vez en toda la vida del Composable. Si el efecto depende de una variable (como un ID o filtro), inclúyela como key para que la corrutina anterior se cancele y relance automáticamente al cambiar.',
        rule3Title: 'No mezcles eventos de usuario con LaunchedEffect',
        rule3Desc:
          'Si una corrutina se dispara por la interacción explícita del usuario (por ejemplo un clic en un botón para abrir un BottomSheet o hacer scroll), obtén un scope con val scope = rememberCoroutineScope() y llama a scope.launch { ... } dentro de onClick.',
        rule4Title:
          'Usa derivedStateOf solo cuando la frecuencia de entrada supera a la de salida',
        rule4Desc:
          'No uses derivedStateOf para simples concatenaciones de texto. Su verdadero poder surge cuando una variable cambia continuamente (como los píxeles de scroll de 0 a 1000) pero tu UI solo necesita saber una condición booleana discreta (scroll > 100).',
      },
    },
    decisionModal: {
      title: '¿Cuál Side-Effect debo utilizar?',
      stepOf: 'Paso {step} de 2',
      q1Title: '¿Qué tipo de operación necesitas realizar?',
      q1Opt1Title: '1. Ejecutar una Corrutina (suspend fun)',
      q1Opt1Desc:
        'Llamadas a API, timers con delay(), animaciones o carga de datos asíncrona.',
      q1Opt2Title: '2. Ciclo de Vida, Sensores o Limpieza',
      q1Opt2Desc:
        'Observadores de Activity/Lifecycle, BroadcastReceivers, o enviar analíticas al recomponer.',
      q1Opt3Title: '3. Transformación o Estabilidad de Estados',
      q1Opt3Desc:
        'Convertir flujos a State, evitar recomposiciones de scroll, o debouncing reactivo.',
      q2CoroutinesTitle: '¿Desde dónde se dispara la corrutina?',
      q2CoroutinesOpt1Title: 'Automáticamente en la Composición',
      q2CoroutinesOpt1Desc:
        'Al entrar la pantalla al árbol o cuando un parámetro (key) cambia.',
      q2CoroutinesOpt2Title: 'En un Callback de Usuario (onClick, gestos)',
      q2CoroutinesOpt2Desc:
        'Por ejemplo al presionar un botón flotante para hacer scroll suave o abrir un modal.',
      q2LifecycleTitle:
        '¿La operación necesita desregistrarse o limpiarse al salir?',
      q2LifecycleOpt1Title: 'Sí, requiere bloque onDispose',
      q2LifecycleOpt1Desc:
        'Sensores, receptores de broadcast, o listeners que causarían fuga de memoria si no se desconectan.',
      q2LifecycleOpt2Title: 'No, solo publicar estado a un SDK externo',
      q2LifecycleOpt2Desc:
        'Enviar eventos a Firebase Analytics o sincronizar colores del System Bar tras recomposiciones exitosas.',
      q2StateTitle: '¿Cuál es tu meta específica con el estado?',
      q2StateOpt1Title:
        'Convertir fuente asíncrona no-Compose en State<T>',
      q2StateOpt1Desc:
        'Cargar datos directamente en un Composable con initialValue y corrutina automática.',
      q2StateOpt2Title:
        'Optimizar recomposiciones de un cálculo frecuente',
      q2StateOpt2Desc:
        'Por ejemplo saber si el scroll superó un umbral sin recomponer en cada píxel intermedio.',
      q2StateOpt3Title:
        'Convertir un State en Flow para usar debounce o filter',
      q2StateOpt3Desc:
        'Monitorear texto o estados de Pager aplicando operadores de Kotlin Flow.',
      q2StateOpt4Title:
        'Acceder a la versión más reciente de un callback sin reiniciar un timer',
      q2StateOpt4Desc:
        'Evitar que un LaunchedEffect(Unit) de 5 segundos se reinicie cuando cambia una lambda.',
      recommendedTag: 'Efecto Recomendado',
      exploreBtn: 'Explorar en el Lab',
      restartBtn: 'Comenzar de nuevo',
      backBtn: '← Volver atrás',
      footerNote: 'Guía oficial de arquitectura Compose',
    },
    footer: {
      copy: 'Compose Effects Lab · Guía Interactiva de Efectos Secundarios en Android',
      assistantLink: 'Asistente de Decisión',
      diagramLink: 'Diagrama de Ciclo de Vida',
    },
  },
  pt: {
    nav: {
      effects: 'Efeitos',
      lifecycle: 'Ciclo de Vida',
      matrix: 'Comparativo',
      pitfalls: 'Boas Práticas',
      whichToUse: 'Qual Usar?',
    },
    hero: {
      kicker: 'Android Jetpack Compose · Side-Effects Lab · Kotlin 2.x',
      title: 'Side-Effects no Jetpack Compose de Forma Visual e Interativa',
      subtitle:
        'Experimente em tempo real como funcionam LaunchedEffect, DisposableEffect, derivedStateOf e todos os efeitos do Compose. Interaja com simulações ao vivo, inspecione o Logcat e domine o código Kotlin.',
      exploreBtn: 'Explorar os 8 Efeitos',
      whichToUseBtn: 'Qual efeito devo usar?',
    },
    catalog: {
      title: 'Laboratório Interativo de Side-Effects',
      subtitle:
        'Selecione um efeito para testar seu comportamento na tela do Android e ver o código-fonte.',
      categories: {
        all: 'Todos',
        coroutines: 'Corrotinas',
        lifecycle: 'Ciclo de Vida',
        state_conversion: 'Conversão',
        optimization: 'Otimização',
      },
    },
    simulator: {
      title: 'Simulador Android em Tempo Real',
      recompositions: 'Recomps:',
      runtime: 'Jetpack Compose Runtime',
      parametersTitle: 'Parâmetros Principais:',
      codeTitle: 'Código-Fonte Kotlin',
      exampleLabel: 'Exemplo',
      whenToUseTitle: 'Quando Usar (Casos Ideais)',
      pitfallsTitle: 'Erros Comuns a Evitar',
    },
    logcat: {
      title: 'Android Logcat Simulator',
      eventsCount: 'eventos',
      emptyWaiting: 'Aguardando eventos de ciclo de vida ou recomposição...',
      emptyHint:
        'Interaja com os controles acima para visualizar logs em tempo real.',
      clearTooltip: 'Limpar registros',
    },
    matrix: {
      kicker: 'Matriz Técnica Comparativa',
      title: 'Side-Effects em um Relance',
      subtitle:
        'Compare as características fundamentais de execução, corrotinas e mecanismos de limpeza.',
      colEffect: 'Side-Effect',
      colCoroutines: 'Executa Corrotinas?',
      colCleanup: 'Requer Limpeza?',
      colTrigger: 'Gatilho Principal',
      colPurpose: 'Objetivo Principal',
      colAction: 'Ação',
      viewInLab: 'Ver no Lab →',
      yesSuspend: 'Sim (suspend)',
      noSync: 'Não (síncrono)',
      automaticOrNA: 'Automático / N/A',
    },
    lifecycle: {
      kicker: 'Ciclo de Vida do Jetpack Compose',
      title: 'Quando cada Side-Effect é executado?',
      subtitle:
        'Clique em cada fase do ciclo de vida para entender o que acontece com corrotinas, listeners e recomposição.',
      initialPhase: '1. Composição Inicial',
      initialDesc:
        'O Composable entra na árvore pela primeira vez após a invocação da função.',
      recompPhase: '2. Recomposição (N vezes)',
      recompDesc:
        'Um ou mais objetos State observados mudaram de valor na hierarquia UI.',
      leavingPhase: '3. Saída da Composição',
      leavingDesc:
        'O Composable é removido da hierarquia UI (por navegação ou visibilidade false).',
      phasePrefix: 'Fase',
      activeHandlers: 'handlers ativos',
      viewDemoAndCode: 'Ver demo e código →',
    },
    pitfallsSection: {
      kicker: 'Guia de Arquitetura',
      title: 'As 4 Regras de Ouro dos Side-Effects',
      subtitle:
        'Diretrizes essenciais para escrever Composables limpos, previsíveis e de alta performance.',
      rules: {
        rule1Title: 'Funções Composables devem ser puras e idempotentes',
        rule1Desc:
          'Nunca altere variáveis globais, grave em bancos de dados ou realize chamadas de rede diretamente no corpo de uma função @Composable. O Compose pode executar, pular ou descartar recomposições a qualquer momento. Sempre envolva efeitos nos handlers dedicados.',
        rule2Title: 'Escolha com precisão as chaves (keys) do LaunchedEffect',
        rule2Desc:
          'Utilize Unit ou true somente se o efeito deve rodar uma única vez durante toda a vida do Composable. Se o efeito depender de uma variável (como um ID ou filtro), inclua-a como chave para cancelar e reiniciar a corrotina automaticamente ao mudar.',
        rule3Title: 'Não misture eventos de usuário com LaunchedEffect',
        rule3Desc:
          'Se uma corrotina é disparada pela interação direta do usuário (como um clique em botão para abrir um BottomSheet ou rolar uma lista), obtenha um scope com val scope = rememberCoroutineScope() e chame scope.launch { ... } dentro de onClick.',
        rule4Title:
          'Use derivedStateOf somente quando a frequência de entrada superar a de saída',
        rule4Desc:
          'Não use derivedStateOf para concatenações simples de texto. Seu real benefício surge quando uma variável muda continuamente (como pixels de scroll de 0 a 1000), mas sua UI precisa apenas de uma condição booleana discreta (scroll > 100).',
      },
    },
    decisionModal: {
      title: 'Qual Side-Effect devo utilizar?',
      stepOf: 'Passo {step} de 2',
      q1Title: 'Que tipo de operação você precisa realizar?',
      q1Opt1Title: '1. Executar uma Corrotina (suspend fun)',
      q1Opt1Desc:
        'Chamadas de API, temporizadores com delay(), animações ou carregamento assíncrono.',
      q1Opt2Title: '2. Ciclo de Vida, Sensores ou Limpeza',
      q1Opt2Desc:
        'Observadores de Activity/Lifecycle, BroadcastReceivers ou envio de métricas na recomposição.',
      q1Opt3Title: '3. Transformação ou Estabilidade de Estado',
      q1Opt3Desc:
        'Converter fluxos em State, evitar recomposições em listas ou debouncing reativo.',
      q2CoroutinesTitle: 'De onde parte o disparo da corrotina?',
      q2CoroutinesOpt1Title: 'Automaticamente na Composição',
      q2CoroutinesOpt1Desc:
        'Ao entrar na tela ou quando um parâmetro-chave (key) for alterado.',
      q2CoroutinesOpt2Title: 'Em um Callback de Usuário (onClick, gestos)',
      q2CoroutinesOpt2Desc:
        'Exemplo: ao pressionar um botão flutuante para rolagem suave ou abrir um modal.',
      q2LifecycleTitle:
        'A operação precisa ser desregistrada ou liberada ao sair?',
      q2LifecycleOpt1Title: 'Sim, requer bloco onDispose',
      q2LifecycleOpt1Desc:
        'Sensores, receptores de broadcast ou listeners que causariam vazamento de memória se não liberados.',
      q2LifecycleOpt2Title: 'Não, apenas publicar estado para um SDK externo',
      q2LifecycleOpt2Desc:
        'Enviar eventos para o Firebase Analytics ou sincronizar a System Bar após recomposições com sucesso.',
      q2StateTitle: 'Qual é seu objetivo específico com o estado?',
      q2StateOpt1Title:
        'Converter fonte assíncrona externa em State<T>',
      q2StateOpt1Desc:
        'Carregar dados diretamente em um Composable com initialValue e corrotina automática.',
      q2StateOpt2Title:
        'Otimizar recomposições de cálculo frequente',
      q2StateOpt2Desc:
        'Por exemplo: verificar se a rolagem passou de um limite sem recompor a cada pixel.',
      q2StateOpt3Title:
        'Converter um State em Flow para usar debounce ou filter',
      q2StateOpt3Desc:
        'Monitorar texto ou estados de Pager aplicando operadores de Kotlin Flow.',
      q2StateOpt4Title:
        'Acessar a versão mais recente de um callback sem reiniciar um timer longo',
      q2StateOpt4Desc:
        'Evitar que um LaunchedEffect(Unit) de 5 segundos reinicie quando uma lambda for atualizada.',
      recommendedTag: 'Efeito Recomendado',
      exploreBtn: 'Explorar no Lab',
      restartBtn: 'Recomeçar',
      backBtn: '← Voltar',
      footerNote: 'Guia oficial de arquitetura Compose',
    },
    footer: {
      copy: 'Compose Effects Lab · Guia Interativo de Side-Effects no Android',
      assistantLink: 'Assistente de Decisão',
      diagramLink: 'Diagrama de Ciclo de Vida',
    },
  },
  en: {
    nav: {
      effects: 'Effects',
      lifecycle: 'Lifecycle',
      matrix: 'Comparison',
      pitfalls: 'Best Practices',
      whichToUse: 'Which to Use?',
    },
    hero: {
      kicker: 'Android Jetpack Compose · Side-Effects Lab · Kotlin 2.x',
      title: 'Jetpack Compose Side-Effects Made Visual & Interactive',
      subtitle:
        'Experience how LaunchedEffect, DisposableEffect, derivedStateOf, and all Compose effects work in real time. Interact with live Android simulations, inspect Logcat output, and master Kotlin code patterns.',
      exploreBtn: 'Explore all 8 Effects',
      whichToUseBtn: 'Which effect should I use?',
    },
    catalog: {
      title: 'Interactive Side-Effects Lab',
      subtitle:
        'Select an effect to test its live behavior inside the simulated Android device and inspect its source code.',
      categories: {
        all: 'All',
        coroutines: 'Coroutines',
        lifecycle: 'Lifecycle',
        state_conversion: 'Conversion',
        optimization: 'Optimization',
      },
    },
    simulator: {
      title: 'Live Android Simulator',
      recompositions: 'Recomps:',
      runtime: 'Jetpack Compose Runtime',
      parametersTitle: 'Key Parameters:',
      codeTitle: 'Kotlin Source Code',
      exampleLabel: 'Example',
      whenToUseTitle: 'When to Use (Best Scenarios)',
      pitfallsTitle: 'Common Pitfalls to Avoid',
    },
    logcat: {
      title: 'Android Logcat Simulator',
      eventsCount: 'events',
      emptyWaiting: 'Waiting for lifecycle or recomposition events...',
      emptyHint:
        'Interact with the controls above to observe real-time logcat output.',
      clearTooltip: 'Clear logs',
    },
    matrix: {
      kicker: 'Technical Comparison Matrix',
      title: 'Side-Effects at a Glance',
      subtitle:
        'Compare execution characteristics, coroutine dispatch, and cleanup requirements across all handlers.',
      colEffect: 'Side-Effect',
      colCoroutines: 'Runs Coroutines?',
      colCleanup: 'Needs Cleanup?',
      colTrigger: 'Primary Trigger',
      colPurpose: 'Primary Purpose',
      colAction: 'Action',
      viewInLab: 'View in Lab →',
      yesSuspend: 'Yes (suspend)',
      noSync: 'No (sync)',
      automaticOrNA: 'Automatic / N/A',
    },
    lifecycle: {
      kicker: 'Jetpack Compose Lifecycle',
      title: 'When Does Each Side-Effect Run?',
      subtitle:
        'Click through each lifecycle stage to understand what happens to coroutines, listeners, and recompositions.',
      initialPhase: '1. Initial Composition',
      initialDesc:
        'The Composable enters the composition tree for the first time upon function invocation.',
      recompPhase: '2. Recomposition (N times)',
      recompDesc:
        'One or more observed State objects changed value in the composition tree.',
      leavingPhase: '3. Leaving Composition',
      leavingDesc:
        'The Composable leaves the UI tree (screen navigation or visibility changed to false).',
      phasePrefix: 'Stage',
      activeHandlers: 'active handlers',
      viewDemoAndCode: 'View demo & code →',
    },
    pitfallsSection: {
      kicker: 'Architecture Guide',
      title: 'The 4 Golden Rules of Side-Effects',
      subtitle:
        'Essential guidelines for writing predictable, leak-free, and high-performance Composables.',
      rules: {
        rule1Title: 'Composable functions must be pure and idempotent',
        rule1Desc:
          'Never modify global variables, write to databases, or make network calls directly inside the body of a @Composable function. Compose may execute, skip, or discard recompositions at any time. Always wrap side-effects inside dedicated effect handlers.',
        rule2Title: 'Choose LaunchedEffect keys with precision',
        rule2Desc:
          'Use Unit or true only if the effect should run exactly once during the entire lifespan of the Composable. If the effect depends on an external variable (like an ID or query), provide it as a key so previous coroutines are automatically canceled and restarted when the value changes.',
        rule3Title: "Don't trigger user-initiated coroutines in LaunchedEffect",
        rule3Desc:
          'If a coroutine is triggered by direct user interaction (such as a button tap to open a BottomSheet or perform smooth scrolling), obtain a scope via val scope = rememberCoroutineScope() and call scope.launch { ... } directly inside onClick.',
        rule4Title:
          'Use derivedStateOf only when input frequency exceeds output frequency',
        rule4Desc:
          "Avoid using derivedStateOf for simple string concatenations. Its true power shines when an input state changes continuously (such as scroll pixel offsets from 0 to 1000) but your UI only cares about a discrete boolean condition (scroll > 100).",
      },
    },
    decisionModal: {
      title: 'Which Side-Effect Should I Use?',
      stepOf: 'Step {step} of 2',
      q1Title: 'What type of operation do you need to perform?',
      q1Opt1Title: '1. Run a Coroutine (suspend fun)',
      q1Opt1Desc:
        'API requests, timers with delay(), animations, or asynchronous data loading.',
      q1Opt2Title: '2. Lifecycle, Hardware Sensors or Cleanup',
      q1Opt2Desc:
        'Activity/Lifecycle observers, BroadcastReceivers, or syncing analytics on recomposition.',
      q1Opt3Title: '3. State Transformation or Optimization',
      q1Opt3Desc:
        'Convert flows into State, suppress high-frequency scroll recompositions, or reactive debouncing.',
      q2CoroutinesTitle: 'Where is the coroutine dispatched from?',
      q2CoroutinesOpt1Title: 'Automatically in Composition',
      q2CoroutinesOpt1Desc:
        'Upon entering the composition tree or whenever a key parameter updates.',
      q2CoroutinesOpt2Title: 'Inside a User Callback (onClick, gestures)',
      q2CoroutinesOpt2Desc:
        'Example: pressing a floating action button to smoothly scroll a list or open a modal sheet.',
      q2LifecycleTitle:
        'Does the operation require unregistration or cleanup on exit?',
      q2LifecycleOpt1Title: 'Yes, requires an onDispose block',
      q2LifecycleOpt1Desc:
        'Sensors, broadcast receivers, or listeners that would cause memory leaks if left active.',
      q2LifecycleOpt2Title: 'No, just publish state to an external SDK',
      q2LifecycleOpt2Desc:
        'Send tracking events to Firebase Analytics or sync System Bar colors after successful recompositions.',
      q2StateTitle: 'What is your specific goal with the state?',
      q2StateOpt1Title: 'Convert non-Compose async source into State<T>',
      q2StateOpt1Desc:
        'Load data directly inside a Composable with initialValue and an automatic background coroutine.',
      q2StateOpt2Title: 'Optimize high-frequency calculation recompositions',
      q2StateOpt2Desc:
        'For instance, checking if scroll exceeded a threshold without recomposing on every pixel.',
      q2StateOpt3Title: 'Convert State to Flow for debounce or filter operators',
      q2StateOpt3Desc:
        'Monitor text input or Pager states utilizing standard Kotlin Flow operators.',
      q2StateOpt4Title:
        'Access the latest callback version without restarting a long-running timer',
      q2StateOpt4Desc:
        'Prevent a 5-second LaunchedEffect(Unit) from resetting whenever an event lambda updates.',
      recommendedTag: 'Recommended Effect',
      exploreBtn: 'Explore in Lab',
      restartBtn: 'Start Over',
      backBtn: '← Go Back',
      footerNote: 'Official Compose Architecture Guidelines',
    },
    footer: {
      copy: 'Compose Effects Lab · Interactive Guide to Android Side-Effects',
      assistantLink: 'Decision Assistant',
      diagramLink: 'Lifecycle Diagram',
    },
  },
};
