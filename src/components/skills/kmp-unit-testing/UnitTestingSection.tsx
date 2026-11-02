import React, { useState } from 'react';
import {
  Bug,
  Check,
  FlaskConical,
  Smartphone,
  Target,
  Terminal,
  TestTube,
  TestTube2,
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

interface BreakVectorSet {
  key: string;
  label: string;
  unit: string;
  vectors: string[];
}

export const UnitTestingSection: React.FC = () => {
  const { language } = useLanguage();
  const t = {
    es: {
      kicker: 'Testing · KMP',
      title: 'Testing unitario adversarial',
      subtitle:
        'Antes de escribir un test, pregúntate cómo romperías el código. Enumerar vectores de ruptura, usar fakes en vez de mocks y correr en Android e iOS.',
      flowTitle: 'Metodología',
      steps: [
        { title: 'Attack surface', description: 'Lista funciones, estado, ramas, colaboradores e inputs implícitos.' },
        { title: 'Break vectors', description: 'Escribe cómo romperías cada item antes de tocar el código.' },
        { title: 'Distinct angles', description: 'Un test por ángulo; descarta los que fallarían por la misma razón.' },
        { title: 'Both targets', description: 'Verde en Android host y en iOS simulator.' },
      ],
      vectorsTitle: 'Explorador de vectores de ruptura',
      vectorsDescription:
        'Elige una unidad y revisa los vectores que debes considerar. Marca los que ya cubriste.',
      vectorsCovered: 'cubiertos',
      vectorsHint:
        'No todos aplican a toda unidad, pero debes considerarlos conscientemente. El happy path es solo un ítem de la lista.',
      vectorSets: [
        {
          key: 'email',
          label: 'Validador de email',
          unit: 'validateEmail(email)',
          vectors: ['Vacío', 'Solo espacios', 'Sin @', '@ sin local', 'Mayúsculas', 'Emoji', 'Homóglifos', '10k caracteres'],
        },
        {
          key: 'counter',
          label: 'Contador / acumulador',
          unit: 'Counter.add(value): Int',
          vectors: ['0', '-1', 'Int.MAX_VALUE', 'Int.MIN_VALUE', 'abs(MIN_VALUE)', 'Suma con overflow'],
        },
        {
          key: 'pager',
          label: 'Paginador',
          unit: 'Pager.page(index)',
          vectors: ['Lista vacía', '1 elemento', 'exact pageSize', 'pageSize + 1', 'page * pageSize overflow', 'Duplicados'],
        },
        {
          key: 'viewmodel',
          label: 'ViewModel',
          unit: 'NoteListViewModel',
          vectors: ['Doble tap submit', 'Respuesta stale', 'Cancelación', 'Error → retry', 'SavedStateHandle restaurado', 'Flow sin emitir'],
        },
      ] as BreakVectorSet[],
      trapsTitle: 'Trampas de input',
      trapsDescription: 'Cada escenario esconde un vector que rompe código que "parece" correcto.',
      trapsLabels: { correct: 'Correcto', incorrect: 'Incorrecto' },
      trapsItems: [
        {
          label: '"👨‍👩‍👧‍👦".length en Kotlin',
          options: ['4', '7', '11'],
          correct: 2,
          explanation: 'Es una secuencia ZWJ: 11 unidades UTF-16. Contar caracteres, truncar o extraer iniciales puede partirla.',
        },
        {
          label: 'Int.MAX_VALUE + 1',
          options: ['Lanza excepción', 'Int.MIN_VALUE', 'Se queda en MAX'],
          correct: 1,
          explanation: 'Kotlin envuelve silenciosamente. Todo contador, suma o page * pageSize necesita test de overflow.',
        },
        {
          label: '-7 % 3',
          options: ['2', '-1', '1'],
          correct: 1,
          explanation: 'El módulo de negativos es negativo: rompe round-robin e index-wrapping. -7 % 3 == -1.',
        },
        {
          label: 'Doble tap en "Enviar"',
          options: ['Test de idempotencia', 'No hace falta testearlo', 'Solo test de UI'],
          correct: 0,
          explanation: 'La misma acción dos veces debe ser idempotente o estar bloqueada. Es un vector de estado, no solo de UI.',
        },
      ],
      doublesTitle: 'Fakes, mocks y tests de integración',
      doublesDescription: 'Clasifica el doble de test correcto para cada colaborador.',
      doublesLabels: { correct: 'Correcto', incorrect: 'Incorrecto' },
      doublesItems: [
        {
          label: 'NoteRepository en commonTest',
          example: 'interfaz que tú controlas',
          options: ['Fake', 'MockK'],
          correct: 0,
          explanation: 'MockK no corre en Kotlin/Native. Un fake es una implementación in-memory real y corre en ambos targets.',
        },
        {
          label: 'LoginValidator puro',
          options: ['Real', 'Fake'],
          correct: 0,
          explanation: 'Si es lógica pura y barata de construir, usa la clase real. El "unit" es un comportamiento lógico, no una clase.',
        },
        {
          label: 'UserDao + Room en memoria',
          options: ['Unit test', 'Integration test'],
          correct: 1,
          explanation: 'Cruza el límite de SQLite real: es integración, no unit test. Usa la skill de integration testing.',
        },
        {
          label: 'Clock en lógica de expiración',
          options: ['Fake Clock', 'Clock del sistema'],
          correct: 0,
          explanation: 'Un test unitario no usa el reloj real. Inyecta Clock y controla instantes, incluso uno que retrocede.',
        },
        {
          label: 'Context de Android en androidHostTest',
          options: ['MockK', 'Fake'],
          correct: 0,
          explanation: 'MockK es aceptable solo en tests Android-only y para clases finales del framework que no posees.',
        },
      ],
      runTitle: 'Dónde correr los tests',
      runDescription: 'Selecciona el target para ver el comando de Gradle.',
      runTargets: [
        { key: 'android', label: 'Android host', command: './gradlew :feature:notes:presentation:testAndroidHostTest' },
        { key: 'ios', label: 'iOS simulator', command: './gradlew :feature:notes:presentation:iosSimulatorArm64Test' },
        { key: 'all', label: 'Todos', command: './gradlew :feature:notes:presentation:allTests' },
      ],
      runNote:
        'Un test unitario está terminado cuando pasa en Android y en iOS. Los nombres con espacios y backticks funcionan en ambos.',
      concept1Title: 'Adversario primero',
      concept1Body:
        'Enumerar los vectores de ruptura por escrito antes de escribir tests. El happy path no es el punto de partida.',
      concept2Title: 'Fakes, no mocks',
      concept2Body:
        'Un fake es una implementación in-memory real. MockK y Mockito dependen de JVM y no corren en iOS.',
      concept3Title: 'Ángulos distintos',
      concept3Body:
        'Dos tests son redundantes si un solo cambio de producción hace fallar a ambos por la misma razón. Conserva uno.',
      codeDoublesTitle: 'Fake y estado, no verify',
      codeBadDoubles: `// MAL: verifica patrones de llamada con un mock
verify { repository.getNotes() }`,
      codeGoodDoubles: `// BIEN: fake y aserción sobre el estado resultante
val repo = FakeNoteRepository().apply { notes = listOf(Note("1", "Hello")) }
val viewModel = NoteListViewModel(repo)

viewModel.state.test {
    awaitItem()
    viewModel.onAction(OnRefreshClick)
    assertThat(awaitItem().isLoading).isTrue()
    assertThat(awaitItem().notes).hasSize(1)
}`,
      codeCasesTitle: 'Happy path no es suficiente',
      codeBadCases: `// MAL: solo el caso feliz
@Test
fun \`email is valid\`() {
    assertThat(validator.validateEmail("a@b.com")).isEqualTo(Success)
}`,
      codeGoodCases: `// BIEN: tabla de inputs que rompen la misma rama
@Test
fun \`malformed emails are rejected\`() {
    listOf("", "   ", "no-at-sign", "@no-local", "a@b", "a@@b.com").forEach { email ->
        assertThat(validator.validateEmail(email), name = "email=\\"$email\\"")
            .isEqualTo(Result.Error(EmailError.INVALID))
    }
}`,
      quiz: '¿Por qué no se usan mocks en commonTest?',
      quizOptions: [
        'Porque son más lentos',
        'Porque dependen de bytecode JVM y no corren en Kotlin/Native',
        'Porque no permiten verificar llamadas',
        'Porque kotlin.test los prohíbe',
      ],
      quizAnswer: 1,
      quizExplanation:
        'MockK y Mockito manipulan bytecode JVM. En commonTest debes usar fakes que compilen y corran también en iOS.',
      checklistTitle: 'Checklist: test unitario',
      checklist: [
        'Enumerar el attack surface por escrito',
        'Escribir los break vectors antes de los tests',
        'Un ángulo distinto por test; evitar redundancia',
        'Cubrir texto con emoji y unicode',
        'Cubrir boundaries y overflow numérico',
        'Cubrir doble tap, stale response y cancelación',
        'Usar fakes en commonTest, no mocks',
        'Usar la clase real para lógica pura barata',
        'Correr en Android host y iOS simulator',
      ],
    },
    pt: {
      kicker: 'Testing · KMP',
      title: 'Testes unitários adversariais',
      subtitle:
        'Antes de escrever um teste, pergunte como você quebraria o código. Enumerar vetores de quebra, usar fakes em vez de mocks e rodar em Android e iOS.',
      flowTitle: 'Metodologia',
      steps: [
        { title: 'Attack surface', description: 'Liste funções, estado, ramos, colaboradores e inputs implícitos.' },
        { title: 'Break vectors', description: 'Escreva como quebraria cada item antes de tocar no código.' },
        { title: 'Distinct angles', description: 'Um teste por ângulo; descarte os que falhariam pelo mesmo motivo.' },
        { title: 'Both targets', description: 'Verde no Android host e no iOS simulator.' },
      ],
      vectorsTitle: 'Explorador de vetores de quebra',
      vectorsDescription:
        'Escolha uma unidade e veja os vetores a considerar. Marque os que já cobriu.',
      vectorsCovered: 'cobertos',
      vectorsHint:
        'Não se aplicam todos a toda unidade, mas você deve considerá-los conscientemente. O happy path é só um item da lista.',
      vectorSets: [
        {
          key: 'email',
          label: 'Validador de email',
          unit: 'validateEmail(email)',
          vectors: ['Vazio', 'Só espaços', 'Sem @', '@ sem local', 'Maiúsculas', 'Emoji', 'Homóglifos', '10k caracteres'],
        },
        {
          key: 'counter',
          label: 'Contador / acumulador',
          unit: 'Counter.add(value): Int',
          vectors: ['0', '-1', 'Int.MAX_VALUE', 'Int.MIN_VALUE', 'abs(MIN_VALUE)', 'Soma com overflow'],
        },
        {
          key: 'pager',
          label: 'Paginador',
          unit: 'Pager.page(index)',
          vectors: ['Lista vazia', '1 elemento', 'exact pageSize', 'pageSize + 1', 'page * pageSize overflow', 'Duplicados'],
        },
        {
          key: 'viewmodel',
          label: 'ViewModel',
          unit: 'NoteListViewModel',
          vectors: ['Duplo tap submit', 'Resposta stale', 'Cancelamento', 'Error → retry', 'SavedStateHandle restaurado', 'Flow sem emitir'],
        },
      ] as BreakVectorSet[],
      trapsTitle: 'Armadilhas de input',
      trapsDescription: 'Cada cenário esconde um vetor que quebra código que "parece" correto.',
      trapsLabels: { correct: 'Correto', incorrect: 'Incorreto' },
      trapsItems: [
        {
          label: '"👨‍👩‍👧‍👦".length no Kotlin',
          options: ['4', '7', '11'],
          correct: 2,
          explanation: 'É uma sequência ZWJ: 11 unidades UTF-16. Contar caracteres, truncar ou extrair iniciais pode quebrá-la.',
        },
        {
          label: 'Int.MAX_VALUE + 1',
          options: ['Lança exceção', 'Int.MIN_VALUE', 'Fica em MAX'],
          correct: 1,
          explanation: 'Kotlin faz wrap silencioso. Todo contador, soma ou page * pageSize precisa de teste de overflow.',
        },
        {
          label: '-7 % 3',
          options: ['2', '-1', '1'],
          correct: 1,
          explanation: 'O módulo de negativos é negativo: quebra round-robin e index-wrapping. -7 % 3 == -1.',
        },
        {
          label: 'Duplo tap em "Enviar"',
          options: ['Teste de idempotência', 'Não precisa testar', 'Só teste de UI'],
          correct: 0,
          explanation: 'A mesma ação duas vezes deve ser idempotente ou estar bloqueada. É um vetor de estado, não só de UI.',
        },
      ],
      doublesTitle: 'Fakes, mocks e testes de integração',
      doublesDescription: 'Classifique o dublê de teste correto para cada colaborador.',
      doublesLabels: { correct: 'Correto', incorrect: 'Incorreto' },
      doublesItems: [
        {
          label: 'NoteRepository em commonTest',
          example: 'interface que você controla',
          options: ['Fake', 'MockK'],
          correct: 0,
          explanation: 'MockK não roda em Kotlin/Native. Um fake é uma implementação in-memory real e roda nos dois targets.',
        },
        {
          label: 'LoginValidator puro',
          options: ['Real', 'Fake'],
          correct: 0,
          explanation: 'Se é lógica pura e barata de construir, use a classe real. A "unit" é um comportamento lógico, não uma classe.',
        },
        {
          label: 'UserDao + Room em memória',
          options: ['Unit test', 'Integration test'],
          correct: 1,
          explanation: 'Cruza o limite do SQLite real: é integração, não unit test. Use a skill de integration testing.',
        },
        {
          label: 'Clock na lógica de expiração',
          options: ['Fake Clock', 'Clock do sistema'],
          correct: 0,
          explanation: 'Um teste unitário não usa o relógio real. Injete Clock e controle instantes, inclusive um que retrocede.',
        },
        {
          label: 'Context do Android em androidHostTest',
          options: ['MockK', 'Fake'],
          correct: 0,
          explanation: 'MockK é aceitável só em testes Android-only e para classes finais do framework que você não possui.',
        },
      ],
      runTitle: 'Onde rodar os testes',
      runDescription: 'Selecione o target para ver o comando do Gradle.',
      runTargets: [
        { key: 'android', label: 'Android host', command: './gradlew :feature:notes:presentation:testAndroidHostTest' },
        { key: 'ios', label: 'iOS simulator', command: './gradlew :feature:notes:presentation:iosSimulatorArm64Test' },
        { key: 'all', label: 'Todos', command: './gradlew :feature:notes:presentation:allTests' },
      ],
      runNote:
        'Um teste unitário está pronto quando passa no Android e no iOS. Nomes com espaços e backticks funcionam nos dois.',
      concept1Title: 'Adversário primeiro',
      concept1Body:
        'Enumerar os vetores de quebra por escrito antes de escrever testes. O happy path não é o ponto de partida.',
      concept2Title: 'Fakes, não mocks',
      concept2Body:
        'Um fake é uma implementação in-memory real. MockK e Mockito dependem da JVM e não rodam no iOS.',
      concept3Title: 'Ângulos distintos',
      concept3Body:
        'Dois testes são redundantes se uma única mudança de produção faz ambos falharem pelo mesmo motivo. Mantenha um.',
      codeDoublesTitle: 'Fake e estado, não verify',
      codeBadDoubles: `// ERRADO: verifica padrões de chamada com um mock
verify { repository.getNotes() }`,
      codeGoodDoubles: `// CERTO: fake e asserção sobre o estado resultante
val repo = FakeNoteRepository().apply { notes = listOf(Note("1", "Hello")) }
val viewModel = NoteListViewModel(repo)

viewModel.state.test {
    awaitItem()
    viewModel.onAction(OnRefreshClick)
    assertThat(awaitItem().isLoading).isTrue()
    assertThat(awaitItem().notes).hasSize(1)
}`,
      codeCasesTitle: 'Happy path não basta',
      codeBadCases: `// ERRADO: só o caso feliz
@Test
fun \`email is valid\`() {
    assertThat(validator.validateEmail("a@b.com")).isEqualTo(Success)
}`,
      codeGoodCases: `// CERTO: tabela de inputs que quebram o mesmo ramo
@Test
fun \`malformed emails are rejected\`() {
    listOf("", "   ", "no-at-sign", "@no-local", "a@b", "a@@b.com").forEach { email ->
        assertThat(validator.validateEmail(email), name = "email=\\"$email\\"")
            .isEqualTo(Result.Error(EmailError.INVALID))
    }
}`,
      quiz: 'Por que não se usam mocks em commonTest?',
      quizOptions: [
        'Porque são mais lentos',
        'Porque dependem de bytecode JVM e não rodam em Kotlin/Native',
        'Porque não permitem verificar chamadas',
        'Porque kotlin.test os proíbe',
      ],
      quizAnswer: 1,
      quizExplanation:
        'MockK e Mockito manipulam bytecode JVM. Em commonTest use fakes que compilam e rodam também no iOS.',
      checklistTitle: 'Checklist: teste unitário',
      checklist: [
        'Enumerar o attack surface por escrito',
        'Escrever os break vectors antes dos testes',
        'Um ângulo distinto por teste; evitar redundância',
        'Cobrir texto com emoji e unicode',
        'Cobrir boundaries e overflow numérico',
        'Cobrir duplo tap, stale response e cancelamento',
        'Usar fakes em commonTest, não mocks',
        'Usar a classe real para lógica pura barata',
        'Rodar no Android host e no iOS simulator',
      ],
    },
    en: {
      kicker: 'Testing · KMP',
      title: 'Adversarial unit testing',
      subtitle:
        'Before writing a test, ask how you would break the code. Enumerate break vectors, use fakes instead of mocks, and run on Android and iOS.',
      flowTitle: 'Methodology',
      steps: [
        { title: 'Attack surface', description: 'List functions, state, branches, collaborators, and implicit inputs.' },
        { title: 'Break vectors', description: 'Write down how you would break each item before touching code.' },
        { title: 'Distinct angles', description: 'One test per angle; drop those that fail for the same reason.' },
        { title: 'Both targets', description: 'Green on the Android host and the iOS simulator.' },
      ],
      vectorsTitle: 'Break-vector explorer',
      vectorsDescription:
        'Pick a unit and review the vectors to consider. Mark the ones you have covered.',
      vectorsCovered: 'covered',
      vectorsHint:
        'Not every vector applies to every unit, but you must consciously consider them. The happy path is just one item on the list.',
      vectorSets: [
        {
          key: 'email',
          label: 'Email validator',
          unit: 'validateEmail(email)',
          vectors: ['Empty', 'Whitespace only', 'No @', '@ without local', 'Uppercase', 'Emoji', 'Homoglyphs', '10k chars'],
        },
        {
          key: 'counter',
          label: 'Counter / accumulator',
          unit: 'Counter.add(value): Int',
          vectors: ['0', '-1', 'Int.MAX_VALUE', 'Int.MIN_VALUE', 'abs(MIN_VALUE)', 'Overflowing sum'],
        },
        {
          key: 'pager',
          label: 'Pager',
          unit: 'Pager.page(index)',
          vectors: ['Empty list', '1 item', 'exact pageSize', 'pageSize + 1', 'page * pageSize overflow', 'Duplicates'],
        },
        {
          key: 'viewmodel',
          label: 'ViewModel',
          unit: 'NoteListViewModel',
          vectors: ['Double-tap submit', 'Stale response', 'Cancellation', 'Error → retry', 'Restored SavedStateHandle', 'Flow with no emission'],
        },
      ] as BreakVectorSet[],
      trapsTitle: 'Input traps',
      trapsDescription: 'Each scenario hides a vector that breaks code which “looks” correct.',
      trapsLabels: { correct: 'Correct', incorrect: 'Incorrect' },
      trapsItems: [
        {
          label: '"👨‍👩‍👧‍👦".length in Kotlin',
          options: ['4', '7', '11'],
          correct: 2,
          explanation: 'It is a ZWJ sequence: 11 UTF-16 units. Counting characters, truncating, or extracting initials can slice it.',
        },
        {
          label: 'Int.MAX_VALUE + 1',
          options: ['Throws an exception', 'Int.MIN_VALUE', 'Stays at MAX'],
          correct: 1,
          explanation: 'Kotlin wraps silently. Every counter, sum, or page * pageSize needs an overflow test.',
        },
        {
          label: '-7 % 3',
          options: ['2', '-1', '1'],
          correct: 1,
          explanation: 'Modulo of negatives is negative: it breaks round-robin and index wrapping. -7 % 3 == -1.',
        },
        {
          label: 'Double tap on “Submit”',
          options: ['Idempotency test', 'No test needed', 'Only a UI test'],
          correct: 0,
          explanation: 'The same action twice must be idempotent or blocked. It is a state vector, not just a UI one.',
        },
      ],
      doublesTitle: 'Fakes, mocks, and integration tests',
      doublesDescription: 'Classify the right test double for each collaborator.',
      doublesLabels: { correct: 'Correct', incorrect: 'Incorrect' },
      doublesItems: [
        {
          label: 'NoteRepository in commonTest',
          example: 'an interface you own',
          options: ['Fake', 'MockK'],
          correct: 0,
          explanation: 'MockK does not run on Kotlin/Native. A fake is a real in-memory implementation and runs on both targets.',
        },
        {
          label: 'Pure LoginValidator',
          options: ['Real', 'Fake'],
          correct: 0,
          explanation: 'If it is pure logic and cheap to construct, use the real class. The “unit” is a behavior, not a class.',
        },
        {
          label: 'UserDao + in-memory Room',
          options: ['Unit test', 'Integration test'],
          correct: 1,
          explanation: 'It crosses the real SQLite boundary: it is integration, not a unit test. Use the integration testing skill.',
        },
        {
          label: 'Clock in expiry logic',
          options: ['Fake Clock', 'System clock'],
          correct: 0,
          explanation: 'A unit test does not use the real clock. Inject Clock and control instants, including one that goes backwards.',
        },
        {
          label: 'Android Context in androidHostTest',
          options: ['MockK', 'Fake'],
          correct: 0,
          explanation: 'MockK is acceptable only in Android-only tests and for final framework classes you do not own.',
        },
      ],
      runTitle: 'Where to run tests',
      runDescription: 'Select a target to see the Gradle command.',
      runTargets: [
        { key: 'android', label: 'Android host', command: './gradlew :feature:notes:presentation:testAndroidHostTest' },
        { key: 'ios', label: 'iOS simulator', command: './gradlew :feature:notes:presentation:iosSimulatorArm64Test' },
        { key: 'all', label: 'All', command: './gradlew :feature:notes:presentation:allTests' },
      ],
      runNote:
        'A unit test is done when it passes on Android and iOS. Backticked names with spaces work on both.',
      concept1Title: 'Adversary first',
      concept1Body:
        'Enumerate break vectors in writing before writing tests. The happy path is not the starting point.',
      concept2Title: 'Fakes, not mocks',
      concept2Body:
        'A fake is a real in-memory implementation. MockK and Mockito rely on the JVM and do not run on iOS.',
      concept3Title: 'Distinct angles',
      concept3Body:
        'Two tests are redundant if a single production change makes both fail for the same reason. Keep one.',
      codeDoublesTitle: 'Fake and state, not verify',
      codeBadDoubles: `// WRONG: verifies call patterns with a mock
verify { repository.getNotes() }`,
      codeGoodDoubles: `// RIGHT: fake and assertion on the resulting state
val repo = FakeNoteRepository().apply { notes = listOf(Note("1", "Hello")) }
val viewModel = NoteListViewModel(repo)

viewModel.state.test {
    awaitItem()
    viewModel.onAction(OnRefreshClick)
    assertThat(awaitItem().isLoading).isTrue()
    assertThat(awaitItem().notes).hasSize(1)
}`,
      codeCasesTitle: 'Happy path is not enough',
      codeBadCases: `// WRONG: only the happy case
@Test
fun \`email is valid\`() {
    assertThat(validator.validateEmail("a@b.com")).isEqualTo(Success)
}`,
      codeGoodCases: `// RIGHT: table of inputs that break the same branch
@Test
fun \`malformed emails are rejected\`() {
    listOf("", "   ", "no-at-sign", "@no-local", "a@b", "a@@b.com").forEach { email ->
        assertThat(validator.validateEmail(email), name = "email=\\"$email\\"")
            .isEqualTo(Result.Error(EmailError.INVALID))
    }
}`,
      quiz: 'Why are mocks not used in commonTest?',
      quizOptions: [
        'Because they are slower',
        'Because they rely on JVM bytecode and do not run on Kotlin/Native',
        'Because they cannot verify calls',
        'Because kotlin.test forbids them',
      ],
      quizAnswer: 1,
      quizExplanation:
        'MockK and Mockito manipulate JVM bytecode. In commonTest use fakes that compile and run on iOS too.',
      checklistTitle: 'Checklist: unit test',
      checklist: [
        'Enumerate the attack surface in writing',
        'Write break vectors before tests',
        'One distinct angle per test; avoid redundancy',
        'Cover text with emoji and unicode',
        'Cover numeric boundaries and overflow',
        'Cover double tap, stale response, and cancellation',
        'Use fakes in commonTest, not mocks',
        'Use the real class for cheap pure logic',
        'Run on the Android host and iOS simulator',
      ],
    },
  }[language];

  const [vectorKey, setVectorKey] = useState('email');
  const vectorSet = t.vectorSets.find((item) => item.key === vectorKey) ?? t.vectorSets[0];
  const [covered, setCovered] = useState<Record<string, Set<string>>>({});

  const coveredForSet = covered[vectorSet.key] ?? new Set<string>();

  const toggleVector = (vector: string) => {
    setCovered((previous) => {
      const next = new Set(previous[vectorSet.key] ?? []);
      if (next.has(vector)) next.delete(vector);
      else next.add(vector);
      return { ...previous, [vectorSet.key]: next };
    });
  };

  const [runKey, setRunKey] = useState('android');
  const runTarget = t.runTargets.find((item) => item.key === runKey) ?? t.runTargets[0];

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

      <SimulatorFrame title={t.vectorsTitle} description={t.vectorsDescription}>
        <div className="flex flex-wrap gap-2">
          {t.vectorSets.map((item) => (
            <button
              key={item.key}
              onClick={() => setVectorKey(item.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
                vectorKey === item.key
                  ? 'bg-brand text-on-brand'
                  : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono text-on-surface-variant">{vectorSet.unit}</span>
          <span className="text-[10px] font-mono text-brand">
            {coveredForSet.size}/{vectorSet.vectors.length} {t.vectorsCovered}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {vectorSet.vectors.map((vector) => {
            const active = coveredForSet.has(vector);
            return (
              <button
                key={vector}
                onClick={() => toggleVector(vector)}
                className={`text-left p-2.5 rounded-xl border transition-colors flex items-start gap-2 ${
                  active
                    ? 'border-brand/40 bg-brand/10'
                    : 'border-transparent bg-surface-lowest hover:bg-surface-container'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center ${
                    active ? 'bg-brand border-brand text-on-brand' : 'border-outline-variant'
                  }`}
                >
                  {active && <Check className="w-3 h-3" />}
                </span>
                <span className={`text-[11px] ${active ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                  {vector}
                </span>
              </button>
            );
          })}
        </div>

        <Callout tone="warning">{t.vectorsHint}</Callout>
      </SimulatorFrame>

      <SkillSection title={t.trapsTitle} description={t.trapsDescription}>
        <div className="rounded-2xl bg-surface-low p-4 space-y-2">
          {t.trapsItems.map((item) => (
            <PickerRow
              key={item.label}
              label={item.label}
              options={item.options}
              correctIndex={item.correct}
              labels={t.trapsLabels}
              explanation={item.explanation}
            />
          ))}
        </div>
      </SkillSection>

      <SkillSection title={t.doublesTitle} description={t.doublesDescription}>
        <div className="rounded-2xl bg-surface-low p-4 space-y-2">
          {t.doublesItems.map((item) => (
            <PickerRow
              key={item.label}
              label={item.label}
              example={item.example}
              options={item.options}
              correctIndex={item.correct}
              labels={t.doublesLabels}
              explanation={item.explanation}
            />
          ))}
        </div>
      </SkillSection>

      <SimulatorFrame title={t.runTitle} description={t.runDescription}>
        <div className="flex flex-wrap gap-2">
          {t.runTargets.map((item) => (
            <button
              key={item.key}
              onClick={() => setRunKey(item.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
                runKey === item.key
                  ? 'bg-brand text-on-brand'
                  : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <pre className="code-surface p-4 rounded-xl bg-surface-lowest text-xs text-sky-300 overflow-x-auto">
          {runTarget.command}
        </pre>
        <Callout tone="neutral">{t.runNote}</Callout>
      </SimulatorFrame>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ConceptCard icon={Target} title={t.concept1Title}>
          {t.concept1Body}
        </ConceptCard>
        <ConceptCard icon={TestTube2} title={t.concept2Title} tone="brand">
          {t.concept2Body}
        </ConceptCard>
        <ConceptCard icon={Bug} title={t.concept3Title} tone="warning">
          {t.concept3Body}
        </ConceptCard>
      </div>

      <SkillSection title={t.codeDoublesTitle}>
        <CodeCompare title={t.codeDoublesTitle} badCode={t.codeBadDoubles} goodCode={t.codeGoodDoubles} />
      </SkillSection>

      <SkillSection title={t.codeCasesTitle}>
        <CodeCompare title={t.codeCasesTitle} badCode={t.codeBadCases} goodCode={t.codeGoodCases} />
      </SkillSection>

      <Quiz question={t.quiz} options={t.quizOptions} correctIndex={t.quizAnswer} explanation={t.quizExplanation} />

      <Checklist title={t.checklistTitle} items={t.checklist} />

      <div className="flex items-center gap-2 text-[11px] font-mono text-on-surface-variant">
        <FlaskConical className="w-3.5 h-3.5 text-brand" />
        <TestTube className="w-3.5 h-3.5 text-brand" />
        <Smartphone className="w-3.5 h-3.5 text-brand" />
        <Terminal className="w-3.5 h-3.5 text-brand" />
        <span>{t.flowTitle}</span>
      </div>
    </div>
  );
};
