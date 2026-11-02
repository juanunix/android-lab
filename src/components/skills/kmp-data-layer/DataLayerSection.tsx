import React, { useState } from 'react';
import { Cloud, CloudOff, Database, HardDrive, Layers, RefreshCw, Server, Star } from 'lucide-react';
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

export const DataLayerSection: React.FC = () => {
  const { language } = useLanguage();
  const t = {
    es: {
      kicker: 'Datos · KMP',
      title: 'Capa de datos KMP',
      subtitle:
        'Data source para una sola fuente, repository solo cuando coordina varias. DTOs y entidades separados del dominio, mappers como extensiones y offline-first con Room como única fuente de verdad.',
      flowTitle: 'El viaje de un dato',
      steps: [
        { title: 'Network', description: 'Ktor devuelve DTOs o un DataError.Network tipado.' },
        { title: 'Mapper', description: 'NoteDto.toNote() y Note.toNoteEntity() como extensiones.' },
        { title: 'Storage', description: 'Room guarda entidades; las DAO son suspend o Flow.' },
        { title: 'Domain', description: 'El ViewModel solo ve modelos de dominio e interfaces.' },
      ],
      classesTitle: 'Data source vs repository',
      classesDescription:
        'Elige el escenario y revisa la interfaz y la implementación que le corresponde.',
      classKinds: [
        {
          key: 'local',
          label: 'Room',
          code: `// Una sola fuente local → data source
interface NoteLocalDataSource {
    suspend fun getNotes(): Result<List<Note>, DataError.Local>
}

class RoomNoteDataSource(
    private val dao: NoteDao
) : NoteLocalDataSource`,
          why: 'Sufijo DataSource porque accede a una única fuente. El nombre de la implementación dice qué envuelve: RoomNoteDataSource.',
        },
        {
          key: 'remote',
          label: 'Ktor',
          code: `// Una sola fuente remota → data source
interface NoteRemoteDataSource {
    suspend fun fetchNotes(): Result<List<Note>, DataError.Network>
}

class KtorNoteDataSource(
    private val httpClient: HttpClient
) : NoteRemoteDataSource`,
          why: 'KtorNoteDataSource describe el transporte. Los errores quedan tipados como DataError.Network.',
        },
        {
          key: 'repository',
          label: 'Offline-first',
          code: `// Varias fuentes → repository
interface NoteRepository {
    suspend fun getNotes(): Result<List<Note>, DataError>
}

class OfflineFirstNoteRepository(
    private val local: NoteLocalDataSource,
    private val remote: NoteRemoteDataSource
) : NoteRepository`,
          why: 'Repository solo cuando coordina varias fuentes. OfflineFirstNoteRepository dice cómo se comporta, sin sufijo Impl.',
        },
      ],
      offlineTitle: 'Simulador offline-first',
      offlineDescription:
        'Refresca con red disponible o caída y observa el flujo remoto → Room → ViewModel.',
      offlineRefresh: 'Refrescar',
      offlineOnline: 'Red disponible',
      offlineOffline: 'Sin red',
      offlineLocal: 'Cache Room',
      offlineRemote: 'Remote',
      offlineLog: 'Flujo',
      offlineEmpty: 'Cache vacía',
      offlineExplainOnline:
        'Remoto primero, persistencia en Room y la UI observa el Flow de la base de datos. El ViewModel nunca ve la respuesta de red directamente.',
      offlineExplainOffline:
        'Si el remoto falla, el repositorio cae al cache local. La UI sigue mostrando datos y no conoce el origen.',
      namesTitle: 'Nombres y modelos',
      namesDescription: 'Clasifica cada tipo y cada nombre según la capa a la que pertenece.',
      namesLabels: { correct: 'Correcto', incorrect: 'Incorrecto' },
      namesItems: [
        {
          label: 'Body de la respuesta HTTP',
          example: 'class NoteDto(val id: String, val title: String)',
          options: ['Domain model', 'NoteDto'],
          correct: 1,
        },
        {
          label: 'Fila de SQLite',
          example: '@Entity class NoteEntity(...)',
          options: ['NoteEntity', 'NoteDto'],
          correct: 0,
        },
        {
          label: 'Modelo que usa el ViewModel',
          example: 'class Note(val id: String, val title: String)',
          options: ['Note', 'NoteEntity'],
          correct: 0,
        },
        {
          label: 'Implementación del repositorio',
          example: 'class ??? : NoteRepository',
          options: ['NoteRepositoryImpl', 'OfflineFirstNoteRepository'],
          correct: 1,
        },
      ],
      namesExplainDto:
        'El DTO vive en data y modela el contrato de red. Nunca cruza al dominio: se mapea con NoteDto.toNote().',
      namesExplainEntity:
        'La entidad modela la tabla de Room. Se mapea a dominio con NoteEntity.toNote().',
      namesExplainDomain:
        'El dominio es Kotlin puro, sin anotaciones de Room ni Ktor. Es lo que consume presentation.',
      namesExplainName:
        'Nunca sufijo Impl. El nombre describe qué hace la implementación o qué envuelve.',
      engineTitle: 'Ktor engine por plataforma',
      engineDescription: 'El engine es la única pieza de Ktor que cambia por plataforma. El cliente se configura una vez.',
      engines: [
        {
          key: 'android',
          label: 'Android',
          code: `// androidMain
single<HttpClientEngine> { OkHttp.create() }`,
        },
        {
          key: 'ios',
          label: 'iOS',
          code: `// iosMain
single<HttpClientEngine> { Darwin.create() }`,
        },
        {
          key: 'test',
          label: 'Test',
          code: `// integration test
val engine = MockEngine { request ->
    respond(
        content = "[]",
        status = HttpStatusCode.OK,
        headers = headersOf(HttpHeaders.ContentType, "application/json")
    )
}`,
        },
      ],
      engineNote:
        'El HttpClient recibe el engine por constructor. En tests se inyecta MockEngine, así el resto de la configuración real se mantiene.',
      concept1Title: 'Data source primero',
      concept1Body:
        'La mayoría de clases de la capa de datos acceden a una sola fuente. Llámalas DataSource; reserva Repository para coordinación real.',
      concept2Title: 'Interfaces en dominio',
      concept2Body:
        'Todo data source o repository usado por un ViewModel tiene interfaz en domain. Presentation nunca depende de data.',
      concept3Title: 'Room como SSOT',
      concept3Body:
        'En offline-first: red → Room → Flow a la UI. El ViewModel no observa respuestas de red directamente.',
      codeModelsTitle: 'DTO y entidad no cruzan al dominio',
      codeBadModels: `// MAL: la entidad de Room se filtra al dominio
@Serializable data class Note(
    @PrimaryKey val id: String,
    val title: String
)`,
      codeGoodModels: `// BIEN: capas separadas y mappers como extensiones
@Serializable data class NoteDto(val id: String, val title: String)
@Entity data class NoteEntity(@PrimaryKey val id: String, val title: String)
data class Note(val id: String, val title: String)

fun NoteDto.toNote(): Note = Note(id, title)
fun Note.toNoteEntity(): NoteEntity = NoteEntity(id, title)`,
      codeNameTitle: 'Nombres que explican',
      codeBadName: `// MAL: Impl no dice nada
class NoteRepositoryImpl(
    private val local: NoteLocalDataSource,
    private val remote: NoteRemoteDataSource
) : NoteRepository`,
      codeGoodName: `// BIEN: el nombre describe el comportamiento
class OfflineFirstNoteRepository(
    private val local: NoteLocalDataSource,
    private val remote: NoteRemoteDataSource
) : NoteRepository`,
      quiz: '¿Cuándo una clase debe llamarse Repository en lugar de DataSource?',
      quizOptions: [
        'Siempre, es el nombre estándar',
        'Cuando coordina varias fuentes de datos',
        'Cuando solo usa Room',
        'Cuando devuelve Flow',
      ],
      quizAnswer: 1,
      quizExplanation:
        'Repository implica coordinación de varias fuentes. Si accede a una sola (solo Room o solo HTTP), es un DataSource.',
      checklistTitle: 'Checklist: nuevo data source o repository',
      checklist: [
        'Definir el modelo de dominio en feature:domain',
        'Definir la interfaz en feature:domain',
        'Definir el error del feature implementando Error',
        'Crear DTOs y entidades en feature:data',
        'Escribir mappers como extensiones',
        'Nombrar la implementación por lo que envuelve o hace',
        'Mantener APIs de plataforma detrás de interfaz o expect/actual',
        'En Room: DAO suspend o Flow, sin APIs Android-only',
      ],
    },
    pt: {
      kicker: 'Dados · KMP',
      title: 'Camada de dados KMP',
      subtitle:
        'Data source para uma única fonte, repository só quando coordena várias. DTOs e entidades separados do domínio, mappers como extensões e offline-first com Room como única fonte de verdade.',
      flowTitle: 'A viagem de um dado',
      steps: [
        { title: 'Network', description: 'Ktor retorna DTOs ou um DataError.Network tipado.' },
        { title: 'Mapper', description: 'NoteDto.toNote() e Note.toNoteEntity() como extensões.' },
        { title: 'Storage', description: 'Room guarda entidades; as DAO são suspend ou Flow.' },
        { title: 'Domain', description: 'O ViewModel só vê modelos de domínio e interfaces.' },
      ],
      classesTitle: 'Data source vs repository',
      classesDescription:
        'Escolha o cenário e veja a interface e a implementação correspondente.',
      classKinds: [
        {
          key: 'local',
          label: 'Room',
          code: `// Uma única fonte local → data source
interface NoteLocalDataSource {
    suspend fun getNotes(): Result<List<Note>, DataError.Local>
}

class RoomNoteDataSource(
    private val dao: NoteDao
) : NoteLocalDataSource`,
          why: 'Sufixo DataSource porque acessa uma única fonte. O nome da implementação diz o que envolve: RoomNoteDataSource.',
        },
        {
          key: 'remote',
          label: 'Ktor',
          code: `// Uma única fonte remota → data source
interface NoteRemoteDataSource {
    suspend fun fetchNotes(): Result<List<Note>, DataError.Network>
}

class KtorNoteDataSource(
    private val httpClient: HttpClient
) : NoteRemoteDataSource`,
          why: 'KtorNoteDataSource descreve o transporte. Os erros ficam tipados como DataError.Network.',
        },
        {
          key: 'repository',
          label: 'Offline-first',
          code: `// Várias fontes → repository
interface NoteRepository {
    suspend fun getNotes(): Result<List<Note>, DataError>
}

class OfflineFirstNoteRepository(
    private val local: NoteLocalDataSource,
    private val remote: NoteRemoteDataSource
) : NoteRepository`,
          why: 'Repository só quando coordena várias fontes. OfflineFirstNoteRepository diz como se comporta, sem sufixo Impl.',
        },
      ],
      offlineTitle: 'Simulador offline-first',
      offlineDescription:
        'Atualize com rede disponível ou caída e veja o fluxo remoto → Room → ViewModel.',
      offlineRefresh: 'Atualizar',
      offlineOnline: 'Rede disponível',
      offlineOffline: 'Sem rede',
      offlineLocal: 'Cache Room',
      offlineRemote: 'Remote',
      offlineLog: 'Fluxo',
      offlineEmpty: 'Cache vazia',
      offlineExplainOnline:
        'Remoto primeiro, persistência no Room e a UI observa o Flow do banco. O ViewModel nunca vê a resposta de rede diretamente.',
      offlineExplainOffline:
        'Se o remoto falha, o repositório cai para o cache local. A UI continua mostrando dados e não conhece a origem.',
      namesTitle: 'Nomes e modelos',
      namesDescription: 'Classifique cada tipo e cada nome conforme a camada a que pertence.',
      namesLabels: { correct: 'Correto', incorrect: 'Incorreto' },
      namesItems: [
        {
          label: 'Body da resposta HTTP',
          example: 'class NoteDto(val id: String, val title: String)',
          options: ['Domain model', 'NoteDto'],
          correct: 1,
        },
        {
          label: 'Linha de SQLite',
          example: '@Entity class NoteEntity(...)',
          options: ['NoteEntity', 'NoteDto'],
          correct: 0,
        },
        {
          label: 'Modelo que o ViewModel usa',
          example: 'class Note(val id: String, val title: String)',
          options: ['Note', 'NoteEntity'],
          correct: 0,
        },
        {
          label: 'Implementação do repositório',
          example: 'class ??? : NoteRepository',
          options: ['NoteRepositoryImpl', 'OfflineFirstNoteRepository'],
          correct: 1,
        },
      ],
      namesExplainDto:
        'O DTO vive em data e modela o contrato de rede. Nunca cruza para o domínio: é mapeado com NoteDto.toNote().',
      namesExplainEntity:
        'A entidade modela a tabela do Room. É mapeada para domínio com NoteEntity.toNote().',
      namesExplainDomain:
        'O domínio é Kotlin puro, sem anotações de Room ou Ktor. É o que presentation consome.',
      namesExplainName:
        'Nunca sufixo Impl. O nome descreve o que a implementação faz ou envolve.',
      engineTitle: 'Ktor engine por plataforma',
      engineDescription: 'O engine é a única peça do Ktor que muda por plataforma. O cliente é configurado uma vez.',
      engines: [
        {
          key: 'android',
          label: 'Android',
          code: `// androidMain
single<HttpClientEngine> { OkHttp.create() }`,
        },
        {
          key: 'ios',
          label: 'iOS',
          code: `// iosMain
single<HttpClientEngine> { Darwin.create() }`,
        },
        {
          key: 'test',
          label: 'Test',
          code: `// integration test
val engine = MockEngine { request ->
    respond(
        content = "[]",
        status = HttpStatusCode.OK,
        headers = headersOf(HttpHeaders.ContentType, "application/json")
    )
}`,
        },
      ],
      engineNote:
        'O HttpClient recebe o engine por construtor. Em testes injeta-se MockEngine, mantendo o resto da configuração real.',
      concept1Title: 'Data source primeiro',
      concept1Body:
        'A maioria das classes da camada de dados acessa uma única fonte. Chame-as DataSource; reserve Repository para coordenação real.',
      concept2Title: 'Interfaces no domínio',
      concept2Body:
        'Todo data source ou repository usado por um ViewModel tem interface em domain. Presentation nunca depende de data.',
      concept3Title: 'Room como SSOT',
      concept3Body:
        'Em offline-first: rede → Room → Flow para a UI. O ViewModel não observa respostas de rede diretamente.',
      codeModelsTitle: 'DTO e entidade não cruzam para o domínio',
      codeBadModels: `// ERRADO: a entidade do Room vaza para o domínio
@Serializable data class Note(
    @PrimaryKey val id: String,
    val title: String
)`,
      codeGoodModels: `// CERTO: camadas separadas e mappers como extensões
@Serializable data class NoteDto(val id: String, val title: String)
@Entity data class NoteEntity(@PrimaryKey val id: String, val title: String)
data class Note(val id: String, val title: String)

fun NoteDto.toNote(): Note = Note(id, title)
fun Note.toNoteEntity(): NoteEntity = NoteEntity(id, title)`,
      codeNameTitle: 'Nomes que explicam',
      codeBadName: `// ERRADO: Impl não diz nada
class NoteRepositoryImpl(
    private val local: NoteLocalDataSource,
    private val remote: NoteRemoteDataSource
) : NoteRepository`,
      codeGoodName: `// CERTO: o nome descreve o comportamento
class OfflineFirstNoteRepository(
    private val local: NoteLocalDataSource,
    private val remote: NoteRemoteDataSource
) : NoteRepository`,
      quiz: 'Quando uma classe deve se chamar Repository em vez de DataSource?',
      quizOptions: [
        'Sempre, é o nome padrão',
        'Quando coordena várias fontes de dados',
        'Quando usa apenas Room',
        'Quando retorna Flow',
      ],
      quizAnswer: 1,
      quizExplanation:
        'Repository implica coordenar várias fontes. Se acessa uma só (apenas Room ou apenas HTTP), é um DataSource.',
      checklistTitle: 'Checklist: novo data source ou repository',
      checklist: [
        'Definir o modelo de domínio em feature:domain',
        'Definir a interface em feature:domain',
        'Definir o erro do feature implementando Error',
        'Criar DTOs e entidades em feature:data',
        'Escrever mappers como extensões',
        'Nomear a implementação pelo que envolve ou faz',
        'Manter APIs de plataforma atrás de interface ou expect/actual',
        'No Room: DAO suspend ou Flow, sem APIs Android-only',
      ],
    },
    en: {
      kicker: 'Data · KMP',
      title: 'KMP data layer',
      subtitle:
        'Data source for a single source, repository only when it coordinates several. DTOs and entities kept out of domain, mappers as extensions, and offline-first with Room as the single source of truth.',
      flowTitle: 'The journey of a datum',
      steps: [
        { title: 'Network', description: 'Ktor returns DTOs or a typed DataError.Network.' },
        { title: 'Mapper', description: 'NoteDto.toNote() and Note.toNoteEntity() as extensions.' },
        { title: 'Storage', description: 'Room stores entities; DAOs are suspend or Flow.' },
        { title: 'Domain', description: 'The ViewModel only sees domain models and interfaces.' },
      ],
      classesTitle: 'Data source vs repository',
      classesDescription:
        'Pick a scenario and review the interface and implementation it needs.',
      classKinds: [
        {
          key: 'local',
          label: 'Room',
          code: `// A single local source → data source
interface NoteLocalDataSource {
    suspend fun getNotes(): Result<List<Note>, DataError.Local>
}

class RoomNoteDataSource(
    private val dao: NoteDao
) : NoteLocalDataSource`,
          why: 'The DataSource suffix means it touches one source. The implementation name says what it wraps: RoomNoteDataSource.',
        },
        {
          key: 'remote',
          label: 'Ktor',
          code: `// A single remote source → data source
interface NoteRemoteDataSource {
    suspend fun fetchNotes(): Result<List<Note>, DataError.Network>
}

class KtorNoteDataSource(
    private val httpClient: HttpClient
) : NoteRemoteDataSource`,
          why: 'KtorNoteDataSource describes the transport. Errors stay typed as DataError.Network.',
        },
        {
          key: 'repository',
          label: 'Offline-first',
          code: `// Several sources → repository
interface NoteRepository {
    suspend fun getNotes(): Result<List<Note>, DataError>
}

class OfflineFirstNoteRepository(
    private val local: NoteLocalDataSource,
    private val remote: NoteRemoteDataSource
) : NoteRepository`,
          why: 'Repository only when it coordinates several sources. OfflineFirstNoteRepository describes behavior, with no Impl suffix.',
        },
      ],
      offlineTitle: 'Offline-first simulator',
      offlineDescription:
        'Refresh with the network up or down and watch remote → Room → ViewModel.',
      offlineRefresh: 'Refresh',
      offlineOnline: 'Network available',
      offlineOffline: 'No network',
      offlineLocal: 'Room cache',
      offlineRemote: 'Remote',
      offlineLog: 'Flow',
      offlineEmpty: 'Empty cache',
      offlineExplainOnline:
        'Remote first, persist to Room, and the UI observes the database Flow. The ViewModel never sees network responses directly.',
      offlineExplainOffline:
        'If remote fails, the repository falls back to the local cache. The UI keeps showing data and does not know the origin.',
      namesTitle: 'Names and models',
      namesDescription: 'Classify each type and name by the layer it belongs to.',
      namesLabels: { correct: 'Correct', incorrect: 'Incorrect' },
      namesItems: [
        {
          label: 'HTTP response body',
          example: 'class NoteDto(val id: String, val title: String)',
          options: ['Domain model', 'NoteDto'],
          correct: 1,
        },
        {
          label: 'SQLite row',
          example: '@Entity class NoteEntity(...)',
          options: ['NoteEntity', 'NoteDto'],
          correct: 0,
        },
        {
          label: 'Model used by the ViewModel',
          example: 'class Note(val id: String, val title: String)',
          options: ['Note', 'NoteEntity'],
          correct: 0,
        },
        {
          label: 'Repository implementation',
          example: 'class ??? : NoteRepository',
          options: ['NoteRepositoryImpl', 'OfflineFirstNoteRepository'],
          correct: 1,
        },
      ],
      namesExplainDto:
        'The DTO lives in data and models the network contract. It never crosses into domain: it is mapped with NoteDto.toNote().',
      namesExplainEntity:
        'The entity models the Room table. It maps to domain with NoteEntity.toNote().',
      namesExplainDomain:
        'Domain is pure Kotlin, with no Room or Ktor annotations. It is what presentation consumes.',
      namesExplainName:
        'Never the Impl suffix. The name describes what the implementation does or wraps.',
      engineTitle: 'Ktor engine per platform',
      engineDescription: 'The engine is the only Ktor piece that changes per platform. The client is configured once.',
      engines: [
        {
          key: 'android',
          label: 'Android',
          code: `// androidMain
single<HttpClientEngine> { OkHttp.create() }`,
        },
        {
          key: 'ios',
          label: 'iOS',
          code: `// iosMain
single<HttpClientEngine> { Darwin.create() }`,
        },
        {
          key: 'test',
          label: 'Test',
          code: `// integration test
val engine = MockEngine { request ->
    respond(
        content = "[]",
        status = HttpStatusCode.OK,
        headers = headersOf(HttpHeaders.ContentType, "application/json")
    )
}`,
        },
      ],
      engineNote:
        'HttpClient receives the engine through its constructor. Tests inject MockEngine while keeping the rest of the real configuration.',
      concept1Title: 'Data source first',
      concept1Body:
        'Most data layer classes touch a single source. Call them DataSource; reserve Repository for real coordination.',
      concept2Title: 'Interfaces in domain',
      concept2Body:
        'Every data source or repository used by a ViewModel has an interface in domain. Presentation never depends on data.',
      concept3Title: 'Room as SSOT',
      concept3Body:
        'In offline-first: network → Room → Flow to the UI. The ViewModel does not observe network responses directly.',
      codeModelsTitle: 'DTO and entity never cross into domain',
      codeBadModels: `// WRONG: the Room entity leaks into domain
@Serializable data class Note(
    @PrimaryKey val id: String,
    val title: String
)`,
      codeGoodModels: `// RIGHT: separate layers and extension mappers
@Serializable data class NoteDto(val id: String, val title: String)
@Entity data class NoteEntity(@PrimaryKey val id: String, val title: String)
data class Note(val id: String, val title: String)

fun NoteDto.toNote(): Note = Note(id, title)
fun Note.toNoteEntity(): NoteEntity = NoteEntity(id, title)`,
      codeNameTitle: 'Names that explain',
      codeBadName: `// WRONG: Impl says nothing
class NoteRepositoryImpl(
    private val local: NoteLocalDataSource,
    private val remote: NoteRemoteDataSource
) : NoteRepository`,
      codeGoodName: `// RIGHT: the name describes the behavior
class OfflineFirstNoteRepository(
    private val local: NoteLocalDataSource,
    private val remote: NoteRemoteDataSource
) : NoteRepository`,
      quiz: 'When should a class be called Repository instead of DataSource?',
      quizOptions: [
        'Always, it is the standard name',
        'When it coordinates several data sources',
        'When it only uses Room',
        'When it returns a Flow',
      ],
      quizAnswer: 1,
      quizExplanation:
        'Repository implies coordinating several sources. If it touches one (only Room or only HTTP), it is a DataSource.',
      checklistTitle: 'Checklist: new data source or repository',
      checklist: [
        'Define the domain model in feature:domain',
        'Define the interface in feature:domain',
        'Define the feature error implementing Error',
        'Create DTOs and entities in feature:data',
        'Write mappers as extension functions',
        'Name the implementation for what it wraps or does',
        'Keep platform APIs behind an interface or expect/actual',
        'In Room: suspend or Flow DAOs, no Android-only APIs',
      ],
    },
  }[language];

  const [classKey, setClassKey] = useState('local');
  const classKind = t.classKinds.find((item) => item.key === classKey) ?? t.classKinds[0];

  const [online, setOnline] = useState(true);
  const [cache, setCache] = useState<string[]>([]);
  const [offlineLog, setOfflineLog] = useState<string[]>([]);

  const remoteNotes = ['Servidor: nota A', 'Servidor: nota B'];

  const refresh = () => {
    const steps: string[] = ['remote.fetchNotes() → Result'];
    if (online) {
      steps.push('Success(DTOs) → NoteDto.toNote()');
      steps.push('Room.insertAll(notes)');
      setCache(remoteNotes);
      steps.push('Room Flow emite → UI');
    } else {
      steps.push('Error(NO_INTERNET)');
      steps.push('local.getNotes() → cache');
      steps.push('Room Flow emite → UI');
    }
    setOfflineLog(steps);
  };

  const resetOffline = () => {
    setCache([]);
    setOfflineLog([]);
    setOnline(true);
  };

  const [engineKey, setEngineKey] = useState('android');
  const engine = t.engines.find((item) => item.key === engineKey) ?? t.engines[0];

  const nameExplanations = [
    t.namesExplainDto,
    t.namesExplainEntity,
    t.namesExplainDomain,
    t.namesExplainName,
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

      <SimulatorFrame title={t.classesTitle} description={t.classesDescription}>
        <div className="flex flex-wrap gap-2">
          {t.classKinds.map((item) => (
            <button
              key={item.key}
              onClick={() => setClassKey(item.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
                classKey === item.key
                  ? 'bg-brand text-on-brand'
                  : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <pre className="code-surface p-4 rounded-xl bg-surface-lowest text-xs text-sky-300 overflow-x-auto">
          {classKind.code}
        </pre>
        <Callout tone="brand">{classKind.why}</Callout>
      </SimulatorFrame>

      <SimulatorFrame title={t.offlineTitle} description={t.offlineDescription}>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setOnline(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              online ? 'bg-brand text-on-brand' : 'bg-surface-high text-on-surface-variant'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            {t.offlineOnline}
          </button>
          <button
            onClick={() => setOnline(false)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              !online ? 'bg-rose-500 text-on-surface' : 'bg-surface-high text-on-surface-variant'
            }`}
          >
            <CloudOff className="w-3.5 h-3.5" />
            {t.offlineOffline}
          </button>
          <button
            onClick={refresh}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand text-on-brand text-xs font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t.offlineRefresh}
          </button>
          <button
            onClick={resetOffline}
            className="ml-auto text-[10px] font-mono text-on-surface-variant hover:text-on-surface"
          >
            reset
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-surface-lowest space-y-2">
            <p className="ds-label text-on-surface-variant flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-brand" /> {t.offlineLocal}
            </p>
            {cache.length === 0 ? (
              <p className="text-[11px] text-on-surface-variant">{t.offlineEmpty}</p>
            ) : (
              <ul className="space-y-1">
                {cache.map((note) => (
                  <li key={note} className="text-[11px] font-mono text-on-surface-variant">
                    • {note}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-3 rounded-xl bg-surface-lowest space-y-2">
            <p className="ds-label text-on-surface-variant flex items-center gap-1.5">
              {online ? <Server className="w-3.5 h-3.5 text-brand" /> : <CloudOff className="w-3.5 h-3.5 text-rose-400" />}
              {t.offlineLog}
            </p>
            {offlineLog.length === 0 ? (
              <p className="text-[11px] text-on-surface-variant">—</p>
            ) : (
              <ol className="space-y-1">
                {offlineLog.map((step) => (
                  <li key={step} className="text-[10px] font-mono text-on-surface-variant">
                    {step}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <Callout tone={online ? 'brand' : 'warning'}>
          {online ? t.offlineExplainOnline : t.offlineExplainOffline}
        </Callout>
      </SimulatorFrame>

      <SkillSection title={t.namesTitle} description={t.namesDescription}>
        <div className="rounded-2xl bg-surface-low p-4 space-y-2">
          {t.namesItems.map((item, index) => (
            <PickerRow
              key={item.label}
              label={item.label}
              example={item.example}
              options={item.options}
              correctIndex={item.correct}
              labels={t.namesLabels}
              explanation={nameExplanations[index]}
            />
          ))}
        </div>
      </SkillSection>

      <SimulatorFrame title={t.engineTitle} description={t.engineDescription}>
        <div className="flex flex-wrap gap-2">
          {t.engines.map((item) => (
            <button
              key={item.key}
              onClick={() => setEngineKey(item.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
                engineKey === item.key
                  ? 'bg-brand text-on-brand'
                  : 'bg-surface-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <pre className="code-surface p-4 rounded-xl bg-surface-lowest text-xs text-sky-300 overflow-x-auto">
          {engine.code}
        </pre>
        <Callout tone="neutral">{t.engineNote}</Callout>
      </SimulatorFrame>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ConceptCard icon={Database} title={t.concept1Title}>
          {t.concept1Body}
        </ConceptCard>
        <ConceptCard icon={Layers} title={t.concept2Title} tone="brand">
          {t.concept2Body}
        </ConceptCard>
        <ConceptCard icon={Star} title={t.concept3Title} tone="warning">
          {t.concept3Body}
        </ConceptCard>
      </div>

      <SkillSection title={t.codeModelsTitle}>
        <CodeCompare title={t.codeModelsTitle} badCode={t.codeBadModels} goodCode={t.codeGoodModels} />
      </SkillSection>

      <SkillSection title={t.codeNameTitle}>
        <CodeCompare title={t.codeNameTitle} badCode={t.codeBadName} goodCode={t.codeGoodName} />
      </SkillSection>

      <Quiz question={t.quiz} options={t.quizOptions} correctIndex={t.quizAnswer} explanation={t.quizExplanation} />

      <Checklist title={t.checklistTitle} items={t.checklist} />

      <div className="flex items-center gap-2 text-[11px] font-mono text-on-surface-variant">
        <Cloud className="w-3.5 h-3.5 text-brand" />
        <HardDrive className="w-3.5 h-3.5 text-brand" />
        <Database className="w-3.5 h-3.5 text-brand" />
        <span>{t.flowTitle}</span>
      </div>
    </div>
  );
};
