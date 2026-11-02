import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  Layers,
  ShieldAlert,
  ShieldCheck,
  WifiOff,
  XCircle,
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

const HTTP_CASES = [
  { key: '200', label: '200 OK', kind: 'success' as const, error: '—' },
  { key: '401', label: '401', kind: 'error' as const, error: 'DataError.Network.UNAUTHORIZED' },
  { key: '404', label: '404', kind: 'error' as const, error: 'DataError.Network.UNKNOWN' },
  { key: '429', label: '429', kind: 'error' as const, error: 'DataError.Network.TOO_MANY_REQUESTS' },
  { key: '500', label: '500', kind: 'error' as const, error: 'DataError.Network.SERVER_ERROR' },
  { key: 'offline', label: 'Offline', kind: 'error' as const, error: 'DataError.Network.NO_INTERNET' },
];

export const ErrorHandlingSection: React.FC = () => {
  const { language } = useLanguage();
  const t = {
    es: {
      kicker: 'Errores · KMP',
      title: 'Manejo de errores tipado',
      subtitle:
        'Result<T, E> en todas las capas, DataError para la red y el disco, errores de feature implementando Error y nunca excepciones para fallos esperados.',
      flowTitle: 'El error viaja tipado',
      steps: [
        { title: 'Origen', description: 'Red, disco o validación produce un error concreto.' },
        { title: 'Capa dueña', description: 'La capa que conoce la excepción la convierte a Result.Error.' },
        { title: 'Result', description: 'Se encadena con map / onSuccess / onFailure / asEmptyResult.' },
        { title: 'UiText', description: 'Solo al mostrar: la presentación mapea a Res.string.*.' },
      ],
      mapperTitle: 'HTTP → DataError',
      mapperDescription:
        'Elige una respuesta y observa cómo responseToResult la convierte en Result tipado.',
      mapperResult: 'Resultado',
      mapperCode: 'Regla de mapeo',
      mapperRules: {
        success: 'in 200..299 → Result.Success(response.body<T>())',
        unauthorized: '401 → DataError.Network.UNAUTHORIZED',
        notFound: 'No listado → else → DataError.Network.UNKNOWN',
        rate: '429 → DataError.Network.TOO_MANY_REQUESTS',
        server: 'in 500..599 → DataError.Network.SERVER_ERROR',
        offline: 'UnknownHost / DarwinHttpRequestException → NO_INTERNET',
      } as Record<string, string>,
      chainTitle: 'Cadena de Result',
      chainDescription:
        'Observa cómo las extensiones devuelven Result y permiten encadenar sin romper el flujo.',
      chainSuccess: 'Simular éxito',
      chainError: 'Simular error',
      chainLabel: 'Cadena ejecutada',
      chainResult: 'Result final',
      chainSuccessExplain:
        'onSuccess se ejecuta, onFailure se salta y asEmptyResult transforma el valor en Unit. La cadena sigue siendo un Result.',
      chainErrorExplain:
        'onSuccess se salta, onFailure recibe el error tipado y asEmptyResult conserva el error. Nada se lanza como excepción.',
      layersTitle: '¿Quién captura y qué devuelve?',
      layersDescription: 'Asigna la responsabilidad correcta en cada caso.',
      layersLabels: { correct: 'Correcto', incorrect: 'Incorrecto' },
      layersItems: [
        {
          label: 'UnknownHostException de una llamada HTTP',
          example: 'fallo de red esperado',
          options: ['Presentación', 'Data'],
          correct: 1,
        },
        {
          label: 'Contraseña demasiado corta',
          example: 'validatePassword(pw)',
          options: ['Domain', 'Data'],
          correct: 0,
        },
        {
          label: 'Excepción dentro de un composable',
          example: 'fallo en presentation',
          options: ['Presentation', 'Data'],
          correct: 0,
        },
        {
          label: 'Fallo esperado en una función',
          example: 'fun getNotes()',
          options: ['throw Exception', 'Result.Error'],
          correct: 1,
        },
        {
          label: 'Repositorio que coordina Room + Ktor',
          example: 'interface NoteRepository',
          options: ['DataError', 'DataError.Network'],
          correct: 0,
        },
      ],
      layersExplanations: [
        'La capa de datos conoce las excepciones de red y las convierte a DataError.Network. Las capas superiores no ven excepciones.',
        'La validación es lógica de dominio: devuelve EmptyResult<PasswordValidationError>, no lanza.',
        'Presentation captura y mapea sus propias excepciones a Result.Error en esa capa.',
        'Los fallos esperados se modelan como Result.Error. Las excepciones se reservan para bugs o estados imposibles.',
        'Un repositorio multi-fuente devuelve el supertipo DataError; así puede expresar errores de red y de disco.',
      ],
      concept1Title: 'Result genérico',
      concept1Body:
        'Result<D, E : Error> con Success y Error. EmptyResult<E> es el alias para operaciones sin valor de retorno.',
      concept2Title: 'Una capa posee la excepción',
      concept2Body:
        'Solo la capa que entiende la excepción la captura y la convierte. Las de arriba nunca ven excepciones esperadas.',
      concept3Title: 'Errores del feature',
      concept3Body:
        'Cada feature define enums que implementan Error. Un Result lleva un único error, no una lista.',
      codeThrowTitle: 'No lances para fallos esperados',
      codeBadThrow: `// MAL: un fallo esperado se convierte en excepción
fun validatePassword(pw: String): String {
    if (pw.length < 8) throw IllegalArgumentException()
    return pw
}`,
      codeGoodThrow: `// BIEN: resultado tipado
fun validatePassword(pw: String): EmptyResult<PasswordValidationError> {
    return if (pw.length < 8) Result.Error(TOO_SHORT)
    else Result.Success(Unit)
}`,
      codeCatchTitle: 'Captura en la capa dueña',
      codeBadCatch: `// MAL: presentation intenta capturar excepciones de red
try { viewModel.refresh() }
catch (e: UnknownHostException) { … }`,
      codeGoodCatch: `// BIEN: data captura y devuelve Result tipado
suspend fun getNotes(): Result<List<Note>, DataError.Network> {
    return httpClient.get(route = "/notes")
}

// presentation solo observa State.error: UiText?`,
      quiz: '¿Qué devuelve una función de dominio cuando la validación falla?',
      quizOptions: [
        'throw IllegalArgumentException()',
        'null',
        'Result.Error(ValidationError.TOO_SHORT)',
        'Una lista de errores',
      ],
      quizAnswer: 2,
      quizExplanation:
        'Los fallos esperados se modelan como Result.Error con un único error tipado. No se lanzan excepciones ni se usa null.',
      checklistTitle: 'Checklist: manejo de errores',
      checklist: [
        'Definir Error, Result y EmptyResult en core:domain',
        'Añadir map / onSuccess / onFailure / asEmptyResult',
        'Definir DataError.Network y DataError.Local',
        'Definir errores de feature implementando Error',
        'Capturar excepciones en la capa que las entiende',
        'Usar safeCall / responseToResult para HTTP',
        'Mapear a UiText solo lo que se muestra al usuario',
        'Un único error por Result',
      ],
    },
    pt: {
      kicker: 'Erros · KMP',
      title: 'Tratamento de erros tipado',
      subtitle:
        'Result<T, E> em todas as camadas, DataError para rede e disco, erros de feature implementando Error e nunca exceções para falhas esperadas.',
      flowTitle: 'O erro viaja tipado',
      steps: [
        { title: 'Origem', description: 'Rede, disco ou validação produz um erro concreto.' },
        { title: 'Camada dona', description: 'A camada que conhece a exceção a converte em Result.Error.' },
        { title: 'Result', description: 'Encadeia com map / onSuccess / onFailure / asEmptyResult.' },
        { title: 'UiText', description: 'Só ao exibir: presentation mapeia para Res.string.*.' },
      ],
      mapperTitle: 'HTTP → DataError',
      mapperDescription:
        'Escolha uma resposta e veja como responseToResult a converte em Result tipado.',
      mapperResult: 'Resultado',
      mapperCode: 'Regra de mapeamento',
      mapperRules: {
        success: 'in 200..299 → Result.Success(response.body<T>())',
        unauthorized: '401 → DataError.Network.UNAUTHORIZED',
        notFound: 'Não listado → else → DataError.Network.UNKNOWN',
        rate: '429 → DataError.Network.TOO_MANY_REQUESTS',
        server: 'in 500..599 → DataError.Network.SERVER_ERROR',
        offline: 'UnknownHost / DarwinHttpRequestException → NO_INTERNET',
      } as Record<string, string>,
      chainTitle: 'Cadeia de Result',
      chainDescription:
        'Veja como as extensões retornam Result e permitem encadear sem quebrar o fluxo.',
      chainSuccess: 'Simular sucesso',
      chainError: 'Simular erro',
      chainLabel: 'Cadeia executada',
      chainResult: 'Result final',
      chainSuccessExplain:
        'onSuccess executa, onFailure é pulado e asEmptyResult transforma o valor em Unit. A cadeia continua sendo um Result.',
      chainErrorExplain:
        'onSuccess é pulado, onFailure recebe o erro tipado e asEmptyResult preserva o erro. Nada é lançado como exceção.',
      layersTitle: 'Quem captura e o que retorna?',
      layersDescription: 'Atribua a responsabilidade correta em cada caso.',
      layersLabels: { correct: 'Correto', incorrect: 'Incorreto' },
      layersItems: [
        {
          label: 'UnknownHostException de uma chamada HTTP',
          example: 'falha de rede esperada',
          options: ['Apresentação', 'Data'],
          correct: 1,
        },
        {
          label: 'Senha curta demais',
          example: 'validatePassword(pw)',
          options: ['Domain', 'Data'],
          correct: 0,
        },
        {
          label: 'Exceção dentro de um composable',
          example: 'falha em presentation',
          options: ['Presentation', 'Data'],
          correct: 0,
        },
        {
          label: 'Falha esperada em uma função',
          example: 'fun getNotes()',
          options: ['throw Exception', 'Result.Error'],
          correct: 1,
        },
        {
          label: 'Repositório que coordena Room + Ktor',
          example: 'interface NoteRepository',
          options: ['DataError', 'DataError.Network'],
          correct: 0,
        },
      ],
      layersExplanations: [
        'A camada de dados conhece as exceções de rede e as converte em DataError.Network. As camadas superiores não veem exceções.',
        'A validação é lógica de domínio: retorna EmptyResult<PasswordValidationError>, não lança.',
        'Presentation captura e mapeia suas próprias exceções para Result.Error nessa camada.',
        'Falhas esperadas são modeladas como Result.Error. Exceções ficam para bugs ou estados impossíveis.',
        'Um repositório multi-fonte retorna o supertipo DataError; assim expressa erros de rede e de disco.',
      ],
      concept1Title: 'Result genérico',
      concept1Body:
        'Result<D, E : Error> com Success e Error. EmptyResult<E> é o alias para operações sem valor de retorno.',
      concept2Title: 'Uma camada possui a exceção',
      concept2Body:
        'Só a camada que entende a exceção a captura e converte. As de cima nunca veem exceções esperadas.',
      concept3Title: 'Erros do feature',
      concept3Body:
        'Cada feature define enums que implementam Error. Um Result carrega um único erro, não uma lista.',
      codeThrowTitle: 'Não lance para falhas esperadas',
      codeBadThrow: `// ERRADO: uma falha esperada vira exceção
fun validatePassword(pw: String): String {
    if (pw.length < 8) throw IllegalArgumentException()
    return pw
}`,
      codeGoodThrow: `// CERTO: resultado tipado
fun validatePassword(pw: String): EmptyResult<PasswordValidationError> {
    return if (pw.length < 8) Result.Error(TOO_SHORT)
    else Result.Success(Unit)
}`,
      codeCatchTitle: 'Capture na camada dona',
      codeBadCatch: `// ERRADO: presentation tenta capturar exceções de rede
try { viewModel.refresh() }
catch (e: UnknownHostException) { … }`,
      codeGoodCatch: `// CERTO: data captura e retorna Result tipado
suspend fun getNotes(): Result<List<Note>, DataError.Network> {
    return httpClient.get(route = "/notes")
}

// presentation apenas observa State.error: UiText?`,
      quiz: 'O que uma função de domínio retorna quando a validação falha?',
      quizOptions: [
        'throw IllegalArgumentException()',
        'null',
        'Result.Error(ValidationError.TOO_SHORT)',
        'Uma lista de erros',
      ],
      quizAnswer: 2,
      quizExplanation:
        'Falhas esperadas são modeladas como Result.Error com um único erro tipado. Não se lançam exceções nem se usa null.',
      checklistTitle: 'Checklist: tratamento de erros',
      checklist: [
        'Definir Error, Result e EmptyResult em core:domain',
        'Adicionar map / onSuccess / onFailure / asEmptyResult',
        'Definir DataError.Network e DataError.Local',
        'Definir erros de feature implementando Error',
        'Capturar exceções na camada que as entende',
        'Usar safeCall / responseToResult para HTTP',
        'Mapear para UiText apenas o que é mostrado ao usuário',
        'Um único erro por Result',
      ],
    },
    en: {
      kicker: 'Errors · KMP',
      title: 'Typed error handling',
      subtitle:
        'Result<T, E> across every layer, DataError for network and disk, feature errors implementing Error, and never exceptions for expected failures.',
      flowTitle: 'Errors travel typed',
      steps: [
        { title: 'Origin', description: 'Network, disk, or validation produces a concrete error.' },
        { title: 'Owning layer', description: 'The layer that knows the exception turns it into Result.Error.' },
        { title: 'Result', description: 'Chain with map / onSuccess / onFailure / asEmptyResult.' },
        { title: 'UiText', description: 'Only when displaying: presentation maps to Res.string.*.' },
      ],
      mapperTitle: 'HTTP → DataError',
      mapperDescription:
        'Pick a response and watch responseToResult turn it into a typed Result.',
      mapperResult: 'Result',
      mapperCode: 'Mapping rule',
      mapperRules: {
        success: 'in 200..299 → Result.Success(response.body<T>())',
        unauthorized: '401 → DataError.Network.UNAUTHORIZED',
        notFound: 'Not listed → else → DataError.Network.UNKNOWN',
        rate: '429 → DataError.Network.TOO_MANY_REQUESTS',
        server: 'in 500..599 → DataError.Network.SERVER_ERROR',
        offline: 'UnknownHost / DarwinHttpRequestException → NO_INTERNET',
      } as Record<string, string>,
      chainTitle: 'Result chain',
      chainDescription:
        'See how the extensions return Result so the flow can be chained without breaking.',
      chainSuccess: 'Simulate success',
      chainError: 'Simulate error',
      chainLabel: 'Executed chain',
      chainResult: 'Final result',
      chainSuccessExplain:
        'onSuccess runs, onFailure is skipped, and asEmptyResult turns the value into Unit. The chain is still a Result.',
      chainErrorExplain:
        'onSuccess is skipped, onFailure receives the typed error, and asEmptyResult preserves it. Nothing is thrown as an exception.',
      layersTitle: 'Who catches and what does it return?',
      layersDescription: 'Assign the correct responsibility in each case.',
      layersLabels: { correct: 'Correct', incorrect: 'Incorrect' },
      layersItems: [
        {
          label: 'UnknownHostException from an HTTP call',
          example: 'expected network failure',
          options: ['Presentation', 'Data'],
          correct: 1,
        },
        {
          label: 'Password too short',
          example: 'validatePassword(pw)',
          options: ['Domain', 'Data'],
          correct: 0,
        },
        {
          label: 'Exception inside a composable',
          example: 'presentation failure',
          options: ['Presentation', 'Data'],
          correct: 0,
        },
        {
          label: 'Expected failure inside a function',
          example: 'fun getNotes()',
          options: ['throw Exception', 'Result.Error'],
          correct: 1,
        },
        {
          label: 'Repository coordinating Room + Ktor',
          example: 'interface NoteRepository',
          options: ['DataError', 'DataError.Network'],
          correct: 0,
        },
      ],
      layersExplanations: [
        'The data layer knows network exceptions and converts them to DataError.Network. Upper layers never see exceptions.',
        'Validation is domain logic: return EmptyResult<PasswordValidationError>, do not throw.',
        'Presentation catches and maps its own exceptions to Result.Error at that layer.',
        'Expected failures are modeled as Result.Error. Exceptions are reserved for bugs or impossible states.',
        'A multi-source repository returns the DataError supertype so it can express both network and disk errors.',
      ],
      concept1Title: 'Generic Result',
      concept1Body:
        'Result<D, E : Error> with Success and Error. EmptyResult<E> is the alias for operations with no return value.',
      concept2Title: 'One layer owns the exception',
      concept2Body:
        'Only the layer that understands the exception catches and converts it. Upper layers never see expected exceptions.',
      concept3Title: 'Feature errors',
      concept3Body:
        'Each feature defines enums implementing Error. A Result carries a single error, not a list.',
      codeThrowTitle: 'Do not throw for expected failures',
      codeBadThrow: `// WRONG: an expected failure becomes an exception
fun validatePassword(pw: String): String {
    if (pw.length < 8) throw IllegalArgumentException()
    return pw
}`,
      codeGoodThrow: `// RIGHT: typed result
fun validatePassword(pw: String): EmptyResult<PasswordValidationError> {
    return if (pw.length < 8) Result.Error(TOO_SHORT)
    else Result.Success(Unit)
}`,
      codeCatchTitle: 'Catch in the owning layer',
      codeBadCatch: `// WRONG: presentation tries to catch network exceptions
try { viewModel.refresh() }
catch (e: UnknownHostException) { … }`,
      codeGoodCatch: `// RIGHT: data catches and returns a typed Result
suspend fun getNotes(): Result<List<Note>, DataError.Network> {
    return httpClient.get(route = "/notes")
}

// presentation only observes State.error: UiText?`,
      quiz: 'What does a domain function return when validation fails?',
      quizOptions: [
        'throw IllegalArgumentException()',
        'null',
        'Result.Error(ValidationError.TOO_SHORT)',
        'A list of errors',
      ],
      quizAnswer: 2,
      quizExplanation:
        'Expected failures are modeled as Result.Error with a single typed error. No exceptions are thrown and null is not used.',
      checklistTitle: 'Checklist: error handling',
      checklist: [
        'Define Error, Result, and EmptyResult in core:domain',
        'Add map / onSuccess / onFailure / asEmptyResult',
        'Define DataError.Network and DataError.Local',
        'Define feature errors implementing Error',
        'Catch exceptions in the layer that understands them',
        'Use safeCall / responseToResult for HTTP',
        'Map to UiText only what the user sees',
        'One error per Result',
      ],
    },
  }[language];

  const [httpKey, setHttpKey] = useState('200');
  const httpCase = HTTP_CASES.find((item) => item.key === httpKey) ?? HTTP_CASES[0];
  const ruleKey = httpCase.key === '200' ? 'success' : httpCase.key === '401' ? 'unauthorized' : httpCase.key === '404' ? 'notFound' : httpCase.key === '429' ? 'rate' : httpCase.key === '500' ? 'server' : 'offline';

  const [chainMode, setChainMode] = useState<'success' | 'error'>('success');
  const chain = chainMode === 'success'
    ? [
        'repository.getNotes() → Result.Success(notes)',
        '.onSuccess { update UI }',
        '.onFailure { show error }  // skipped',
        '.asEmptyResult() → Result.Success(Unit)',
      ]
    : [
        'repository.getNotes() → Result.Error(NO_INTERNET)',
        '.onSuccess { … }  // skipped',
        '.onFailure { show error }',
        '.asEmptyResult() → Result.Error(NO_INTERNET)',
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

      <SimulatorFrame title={t.mapperTitle} description={t.mapperDescription}>
        <div className="flex flex-wrap gap-2">
          {HTTP_CASES.map((item) => (
            <button
              key={item.key}
              onClick={() => setHttpKey(item.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
                httpKey === item.key
                  ? 'bg-brand text-on-brand'
                  : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl bg-surface-lowest space-y-2">
            <p className="ds-label text-on-surface-variant">{t.mapperResult}</p>
            <div className={`flex items-center gap-2 text-xs font-mono ${httpCase.kind === 'success' ? 'text-brand' : 'text-rose-300'}`}>
              {httpCase.kind === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span>
                {httpCase.kind === 'success'
                  ? 'Result.Success(body)'
                  : `Result.Error(${httpCase.error})`}
              </span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-surface-lowest space-y-1">
            <p className="ds-label text-on-surface-variant">{t.mapperCode}</p>
            <p className="text-[11px] font-mono text-sky-300 break-all">{t.mapperRules[ruleKey]}</p>
          </div>
        </div>
      </SimulatorFrame>

      <SimulatorFrame title={t.chainTitle} description={t.chainDescription}>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setChainMode('success')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              chainMode === 'success'
                ? 'bg-brand text-on-brand'
                : 'bg-surface-high text-on-surface-variant'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t.chainSuccess}
          </button>
          <button
            onClick={() => setChainMode('error')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              chainMode === 'error'
                ? 'bg-rose-500 text-on-surface'
                : 'bg-surface-high text-on-surface-variant'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            {t.chainError}
          </button>
        </div>

        <div className="p-4 rounded-xl bg-surface-lowest space-y-2">
          <p className="ds-label text-on-surface-variant">{t.chainLabel}</p>
          <ol className="space-y-1">
            {chain.map((line, index) => (
              <li key={line} className="flex items-start gap-1.5 text-[10px] font-mono">
                <span className="text-brand shrink-0">{index + 1}.</span>
                <span className="text-on-surface-variant break-all">{line}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-on-surface-variant">{t.chainResult}:</span>
          <span className={chainMode === 'success' ? 'text-brand' : 'text-rose-300'}>
            {chainMode === 'success' ? 'Result.Success(Unit)' : 'Result.Error(NO_INTERNET)'}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-brand" />
        </div>

        <Callout tone={chainMode === 'success' ? 'brand' : 'warning'}>
          {chainMode === 'success' ? t.chainSuccessExplain : t.chainErrorExplain}
        </Callout>
      </SimulatorFrame>

      <SkillSection title={t.layersTitle} description={t.layersDescription}>
        <div className="rounded-2xl bg-surface-low p-4 space-y-2">
          {t.layersItems.map((item, index) => (
            <PickerRow
              key={item.label}
              label={item.label}
              example={item.example}
              options={item.options}
              correctIndex={item.correct}
              labels={t.layersLabels}
              explanation={t.layersExplanations[index]}
            />
          ))}
        </div>
      </SkillSection>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ConceptCard icon={GitBranch} title={t.concept1Title}>
          {t.concept1Body}
        </ConceptCard>
        <ConceptCard icon={ShieldCheck} title={t.concept2Title} tone="brand">
          {t.concept2Body}
        </ConceptCard>
        <ConceptCard icon={ShieldAlert} title={t.concept3Title} tone="warning">
          {t.concept3Body}
        </ConceptCard>
      </div>

      <SkillSection title={t.codeThrowTitle}>
        <CodeCompare title={t.codeThrowTitle} badCode={t.codeBadThrow} goodCode={t.codeGoodThrow} />
      </SkillSection>

      <SkillSection title={t.codeCatchTitle}>
        <CodeCompare title={t.codeCatchTitle} badCode={t.codeBadCatch} goodCode={t.codeGoodCatch} />
      </SkillSection>

      <Quiz question={t.quiz} options={t.quizOptions} correctIndex={t.quizAnswer} explanation={t.quizExplanation} />

      <Checklist title={t.checklistTitle} items={t.checklist} />

      <div className="flex items-center gap-2 text-[11px] font-mono text-on-surface-variant">
        <GitBranch className="w-3.5 h-3.5 text-brand" />
        <AlertTriangle className="w-3.5 h-3.5 text-brand" />
        <Layers className="w-3.5 h-3.5 text-brand" />
        <WifiOff className="w-3.5 h-3.5 text-brand" />
        <span>{t.flowTitle}</span>
      </div>
    </div>
  );
};
