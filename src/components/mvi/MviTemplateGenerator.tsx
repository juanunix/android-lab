import React, { useState } from 'react';
import { Sparkles, Wand2, Copy, Check, FileCode, CheckCircle2 } from 'lucide-react';
import { CodeViewer } from '../CodeViewer';
import { useLanguage } from '../../context/LanguageContext';

export const MviTemplateGenerator: React.FC = () => {
  const { language } = useLanguage();
  const [featureName, setFeatureName] = useState('Task');
  const [preset, setPreset] = useState<'task' | 'auth' | 'profile' | 'search'>('task');

  const gen = {
    es: {
      kicker: 'Generador Canónico de Código MVI',
      title: 'Crea tu pantalla MVI en 1 Clic',
      description:
        'Genera la arquitectura completa según los skills oficiales: <Screen>State, <Screen>Action, <Screen>Event, <Screen>ViewModel y el archivo <Screen>Screen.kt con el orden exacto: 1. <Screen>Root, 2. <Screen>Screen y 3. <Screen>ScreenPreview.',
      featureLabel: 'Nombre del Feature / Pantalla:',
      placeholder: 'Ej: Order, Crypto, Setting',
      templateTitle: 'Plantilla Canónica MVI',
      presets: {
        task: 'Task Manager (Tareas)',
        auth: 'Login / Autenticación',
        profile: 'Perfil de Usuario',
        search: 'Búsqueda & Catálogo',
      },
      itemSelected: 'Item seleccionado',
      loadComment: '// Simulación de carga desde repositorio',
      itemDetail: 'Detalle de',
      itemExtra: 'Información complementaria',
      composablesHeader: 'Root + Screen + Preview en el mismo archivo',
      rootDoc: 'Obtiene el ViewModel, recolecta el estado con ciclo de vida, observa eventos únicos (ObserveAsEvents) y delega a <Screen>Screen.',
      observeComment: '// Observa eventos únicos de canal (si existen)',
      screenDoc1: '100% Stateless: recibe state, onAction y callbacks directos de navegación.',
      screenDoc2: 'No tiene referencias al ViewModel, haciéndola totalmente testeable.',
      back: 'Regresar',
      searchIn: 'Buscar en',
      directNav: '// Navegación directa en clic',
      previewDoc: 'Previsualización inmediata en Android Studio con datos muestra estáticos.',
      example: 'Ejemplo',
      elementDesc: 'Descripción del elemento',
      detailedInfo: 'Información detallada',
    },
    pt: {
      kicker: 'Gerador Canônico de Código MVI',
      title: 'Crie sua tela MVI em 1 Clique',
      description:
        'Gera a arquitetura completa segundo os skills oficiais: <Screen>State, <Screen>Action, <Screen>Event, <Screen>ViewModel e o arquivo <Screen>Screen.kt com a ordem exata: 1. <Screen>Root, 2. <Screen>Screen e 3. <Screen>ScreenPreview.',
      featureLabel: 'Nome do Feature / Tela:',
      placeholder: 'Ex: Order, Crypto, Setting',
      templateTitle: 'Modelo Canônico MVI',
      presets: {
        task: 'Task Manager (Tarefas)',
        auth: 'Login / Autenticação',
        profile: 'Perfil de Usuário',
        search: 'Busca & Catálogo',
      },
      itemSelected: 'Item selecionado',
      loadComment: '// Simulação de carga do repositório',
      itemDetail: 'Detalhe de',
      itemExtra: 'Informação complementar',
      composablesHeader: 'Root + Screen + Preview no mesmo arquivo',
      rootDoc: 'Obtém o ViewModel, coleta o estado com ciclo de vida, observa eventos únicos (ObserveAsEvents) e delega para <Screen>Screen.',
      observeComment: '// Observa eventos únicos do canal (se existirem)',
      screenDoc1: '100% Stateless: recebe state, onAction e callbacks diretos de navegação.',
      screenDoc2: 'Não possui referências ao ViewModel, tornando-a totalmente testável.',
      back: 'Voltar',
      searchIn: 'Buscar em',
      directNav: '// Navegação direta no clique',
      previewDoc: 'Pré-visualização imediata no Android Studio com dados de amostra estáticos.',
      example: 'Exemplo',
      elementDesc: 'Descrição do elemento',
      detailedInfo: 'Informação detalhada',
    },
    en: {
      kicker: 'Canonical MVI Code Generator',
      title: 'Create your MVI screen in 1 Click',
      description:
        'Generates the complete architecture following official skills: <Screen>State, <Screen>Action, <Screen>Event, <Screen>ViewModel and the <Screen>Screen.kt file in exact order: 1. <Screen>Root, 2. <Screen>Screen and 3. <Screen>ScreenPreview.',
      featureLabel: 'Feature / Screen name:',
      placeholder: 'e.g. Order, Crypto, Setting',
      templateTitle: 'Canonical MVI Template',
      presets: {
        task: 'Task Manager',
        auth: 'Login / Authentication',
        profile: 'User Profile',
        search: 'Search & Catalog',
      },
      itemSelected: 'Item selected',
      loadComment: '// Simulated repository load',
      itemDetail: 'Detail of',
      itemExtra: 'Additional information',
      composablesHeader: 'Root + Screen + Preview in the same file',
      rootDoc: 'Obtains the ViewModel, collects state with lifecycle awareness, observes one-shot events (ObserveAsEvents), and delegates to <Screen>Screen.',
      observeComment: '// Observe one-shot channel events (if any)',
      screenDoc1: '100% Stateless: receives state, onAction, and direct navigation callbacks.',
      screenDoc2: 'No ViewModel references, making it fully testable.',
      back: 'Back',
      searchIn: 'Search in',
      directNav: '// Direct navigation on click',
      previewDoc: 'Instant preview in Android Studio with static sample data.',
      example: 'Example',
      elementDesc: 'Element description',
      detailedInfo: 'Detailed information',
    },
  }[language];

  const presets = [
    { id: 'task' as const, name: gen.presets.task, feature: 'Task' },
    { id: 'auth' as const, name: gen.presets.auth, feature: 'Auth' },
    { id: 'profile' as const, name: gen.presets.profile, feature: 'Profile' },
    { id: 'search' as const, name: gen.presets.search, feature: 'Search' },
  ];

  const handleSelectPreset = (p: 'task' | 'auth' | 'profile' | 'search', feat: string) => {
    setPreset(p);
    setFeatureName(feat);
  };

  const generateKotlinCode = () => {
    const raw = featureName.trim().replace(/[^a-zA-Z0-9]/g, '');
    const f = raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : 'Custom';
    const pkgName = f.toLowerCase();

    return `package com.example.app.presentation.${pkgName}

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import com.example.app.core.presentation.UiText
import com.example.app.core.presentation.ObserveAsEvents
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.koin.androidx.compose.koinViewModel

// ==========================================
// 1. UI MODEL (<Model>Ui)
// ==========================================
data class ${f}Ui(
    val id: String,
    val title: String,
    val description: String = ""
)

// ==========================================
// 2. STATE (<Screen>State - SSOT)
// ==========================================
data class ${f}State(
    val items: List<${f}Ui> = emptyList(),
    val searchQuery: String = "",
    val isLoading: Boolean = false,
    val errorMessage: UiText? = null
)

// ==========================================
// 3. ACTION (<Screen>Action - Sealed Intent)
// ==========================================
sealed interface ${f}Action {
    data class OnSearchQueryChange(val query: String): ${f}Action
    data class OnItemClick(val id: String): ${f}Action
    data object OnRefreshClick: ${f}Action
    data object OnSubmitClick: ${f}Action
}

// ==========================================
// 4. EVENT (<Screen>Event - One-Shot Side Effects)
// ==========================================
sealed interface ${f}Event {
    data class ShowSnackbar(val message: UiText): ${f}Event
    data object ActionSucceeded: ${f}Event
}

// ==========================================
// 5. VIEWMODEL (<Screen>ViewModel)
// ==========================================
class ${f}ViewModel(
    private val repository: ${f}Repository
): ViewModel() {

    private val _state = MutableStateFlow(${f}State())
    val state = _state.asStateFlow()

    private val _events = Channel<${f}Event>(Channel.BUFFERED)
    val events = _events.receiveAsFlow()

    init {
        loadData()
    }

    fun onAction(action: ${f}Action) {
        when (action) {
            is ${f}Action.OnSearchQueryChange -> {
                _state.update { it.copy(searchQuery = action.query) }
            }
            is ${f}Action.OnItemClick -> {
                viewModelScope.launch {
                    _events.send(${f}Event.ShowSnackbar(UiText.DynamicString("${gen.itemSelected}: \${action.id}")))
                }
            }
            ${f}Action.OnRefreshClick -> loadData()
            ${f}Action.OnSubmitClick -> submitData()
        }
    }

    private fun loadData() {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true) }
            ${gen.loadComment}
            _state.update {
                it.copy(
                    isLoading = false,
                    items = listOf(
                        ${f}Ui("1", "${f} Item #1", "${gen.itemDetail} ${f}"),
                        ${f}Ui("2", "${f} Item #2", "${gen.itemExtra}")
                    )
                )
            }
        }
    }

    private fun submitData() {
        viewModelScope.launch {
            _events.send(${f}Event.ActionSucceeded)
        }
    }
}

// =========================================================================
// 6. COMPOSABLES: ${f}Screen.kt (${gen.composablesHeader})
// =========================================================================

/**
 * 1. Root Composable (<Screen>Root)
 * ${gen.rootDoc}
 */
@Composable
fun ${f}Root(
    onNavigateBack: () -> Unit,
    onNavigateToDetail: (String) -> Unit,
    viewModel: ${f}ViewModel = koinViewModel(),
    snackbarHostState: SnackbarHostState = remember { SnackbarHostState() }
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val context = LocalContext.current

    ${gen.observeComment}
    ObserveAsEvents(viewModel.events) { event ->
        when (event) {
            ${f}Event.ActionSucceeded -> onNavigateBack()
            is ${f}Event.ShowSnackbar -> {
                snackbarHostState.showSnackbar(event.message.asString(context))
            }
        }
    }

    ${f}Screen(
        state = state,
        onAction = viewModel::onAction,
        onItemClick = onNavigateToDetail,
        onBackClick = onNavigateBack
    )
}

/**
 * 2. Screen Composable (<Screen>Screen)
 * ${gen.screenDoc1}
 * ${gen.screenDoc2}
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ${f}Screen(
    state: ${f}State,
    onAction: (${f}Action) -> Unit,
    onItemClick: (String) -> Unit,
    onBackClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("${f}") },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "${gen.back}")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            OutlinedTextField(
                value = state.searchQuery,
                onValueChange = { onAction(${f}Action.OnSearchQueryChange(it)) },
                label = { Text("${gen.searchIn} ${f}") },
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(16.dp))

            if (state.isLoading) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.CenterHorizontally))
            } else {
                LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(state.items, key = { it.id }) { item ->
                        ElevatedCard(
                            onClick = { 
                                onAction(${f}Action.OnItemClick(item.id))
                                onItemClick(item.id) ${gen.directNav}
                            },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = item.title,
                                style = MaterialTheme.typography.titleMedium,
                                modifier = Modifier.padding(16.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

/**
 * 3. Screen Preview (<Screen>ScreenPreview)
 * ${gen.previewDoc}
 */
@Preview(showBackground = true)
@Composable
private fun ${f}ScreenPreview() {
    MaterialTheme {
        ${f}Screen(
            state = ${f}State(
                items = listOf(
                    ${f}Ui("1", "${gen.example} ${f} Alpha", "${gen.elementDesc}"),
                    ${f}Ui("2", "${gen.example} ${f} Beta", "${gen.detailedInfo}")
                )
            ),
            onAction = {},
            onItemClick = {},
            onBackClick = {}
        )
    }
}`;
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-xl space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
            {gen.kicker}
          </span>
          <h3 className="text-xl font-bold text-white mt-0.5">
            {gen.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {gen.description}
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPreset(p.id, p.feature)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                preset === p.id
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom feature name input */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#0b1120] p-3.5 rounded-xl border border-slate-800 text-xs">
        <span className="text-slate-300 font-semibold shrink-0">
          {gen.featureLabel}
        </span>
        <div className="flex items-center gap-2 flex-1 w-full">
          <input
            type="text"
            value={featureName}
            onChange={(e) => setFeatureName(e.target.value.replace(/\s+/g, ''))}
            placeholder={gen.placeholder}
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500"
          />
          <span className="text-emerald-400 font-mono text-xs">
            {featureName}State · {featureName}Root · {featureName}Screen
          </span>
        </div>
      </div>

      {/* Generated Code Output */}
      <div className="space-y-2">
        <CodeViewer
          title={`${featureName}Screen.kt (${gen.templateTitle})`}
          code={generateKotlinCode()}
        />
      </div>
    </div>
  );
};
