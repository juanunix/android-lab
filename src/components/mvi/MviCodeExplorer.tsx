import React, { useState } from 'react';
import { Code2, Copy, Check, FileCode, Layers } from 'lucide-react';
import { CodeViewer } from '../CodeViewer';
import { useLanguage } from '../../context/LanguageContext';

export const MviCodeExplorer: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('screen');

  const files = [
    {
      id: 'screen',
      fileName: 'ProductListScreen.kt',
      title: '1. Composable File (<Screen>Screen.kt)',
      description: 'Canonical order from skills: 1. Root composable, 2. Screen composable, 3. Preview in the same file.',
      code: `package com.example.shop.presentation.product_list

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.shop.presentation.util.ObserveAsEvents
import org.koin.androidx.compose.koinViewModel

/**
 * =========================================================================
 * 1. ROOT COMPOSABLE (<Screen>Root)
 * =========================================================================
 * Receives the ViewModel (via koinViewModel()) and navigation callbacks.
 * Observes events ONLY when the ViewModel exposes an events Flow.
 * Passes state and onAction down to <Screen>Screen.
 * For plain button navigation, invokes navigation callback directly from Screen.
 */
@Composable
fun ProductListRoot(
    onNavigateToCheckout: () -> Unit,
    onNavigateToDetails: (String) -> Unit,
    viewModel: ProductListViewModel = koinViewModel(),
    snackbarHostState: SnackbarHostState = remember { SnackbarHostState() }
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val context = LocalContext.current

    // Observe one-time Channel events with repeatOnLifecycle
    ObserveAsEvents(viewModel.events) { event ->
        when (event) {
            ProductListEvent.NavigateToCheckout -> onNavigateToCheckout()
            is ProductListEvent.NavigateToDetails -> onNavigateToDetails(event.productId)
            is ProductListEvent.ShowSnackbar -> {
                snackbarHostState.showSnackbar(event.message.asString(context))
            }
        }
    }

    ProductListScreen(
        state = state,
        onAction = viewModel::onAction,
        onCheckoutClick = onNavigateToCheckout,
        onProductClick = onNavigateToDetails
    )
}

/**
 * =========================================================================
 * 2. SCREEN COMPOSABLE (<Screen>Screen)
 * =========================================================================
 * 100% Stateless UI: receives state, onAction, and direct navigation callbacks.
 * Zero references to ViewModel. Fully previewable and independently testable.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProductListScreen(
    state: ProductListState,
    onAction: (ProductListAction) -> Unit,
    onCheckoutClick: () -> Unit,
    onProductClick: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text("Pixel Store") },
                actions = {
                    IconButton(onClick = onCheckoutClick) {
                        BadgedBox(
                            badge = {
                                if (state.cartCount > 0) {
                                    Badge { Text("\${state.cartCount}") }
                                }
                            }
                        ) {
                            Icon(Icons.Default.ShoppingCart, contentDescription = "Carrito")
                        }
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            item {
                OutlinedTextField(
                    value = state.searchQuery,
                    onValueChange = { onAction(ProductListAction.OnSearchQueryChange(it)) },
                    placeholder = { Text("Buscar en la tienda...") },
                    modifier = Modifier.fillMaxWidth()
                )
            }

            items(state.products, key = { it.id }) { product ->
                ElevatedCard(
                    onClick = { onProductClick(product.id) },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(product.name, style = MaterialTheme.typography.titleMedium)
                            Text("$\${product.price}", style = MaterialTheme.typography.bodyMedium)
                        }
                        Button(
                            onClick = { onAction(ProductListAction.OnAddToCart(product.id)) }
                        ) {
                            Text("Agregar")
                        }
                    }
                }
            }
        }
    }
}

/**
 * =========================================================================
 * 3. SCREEN PREVIEW (<Screen>ScreenPreview)
 * =========================================================================
 * Renders instantly inside Android Studio with static mock state.
 */
@Preview(showBackground = true)
@Composable
private fun ProductListScreenPreview() {
    MaterialTheme {
        ProductListScreen(
            state = ProductListState(
                products = listOf(
                    ProductUi("1", "Pixel 9 Pro", 999.0, inStock = true, isFavorite = true),
                    ProductUi("2", "Pixel Watch 3", 349.0, inStock = true, isFavorite = false)
                ),
                cartCount = 2
            ),
            onAction = {},
            onCheckoutClick = {},
            onProductClick = {}
        )
    }
}`,
    },
    {
      id: 'state',
      fileName: 'ProductListState.kt',
      title: '2. Immutable UI State & UI Model',
      description: 'Single Source of Truth (<Screen>State) and UI presentation models (<Model>Ui).',
      code: `package com.example.shop.presentation.product_list

import com.example.shop.presentation.util.UiText

/**
 * UI presentation model suffixed with 'Ui' as specified in skills.
 */
data class ProductUi(
    val id: String,
    val name: String,
    val price: Double,
    val inStock: Boolean,
    val isFavorite: Boolean
)

enum class ProductFilter {
    ALL, FAVORITES, IN_STOCK
}

/**
 * Single immutable state for the screen (<Screen>State).
 * Default parameter values allow instant instantiation as ProductListState().
 */
data class ProductListState(
    val products: List<ProductUi> = emptyList(),
    val searchQuery: String = "",
    val cartCount: Int = 0,
    val isLoading: Boolean = false,
    val selectedFilter: ProductFilter = ProductFilter.ALL,
    val errorMessage: UiText? = null
)`,
    },
    {
      id: 'action',
      fileName: 'ProductListAction.kt',
      title: '3. Sealed Action Interface (<Screen>Action)',
      description: 'Models all user interactions into an exhaustive sealed interface with On... prefix.',
      code: `package com.example.shop.presentation.product_list

/**
 * All actions that the user or system can trigger from the UI.
 * Prefix actions with 'On...' to describe user intent (canonical MVI standard).
 */
sealed interface ProductListAction {
    data class OnSearchQueryChange(val query: String): ProductListAction
    data class OnProductClick(val productId: String): ProductListAction
    data class OnFavoriteToggle(val productId: String): ProductListAction
    data class OnAddToCart(val productId: String): ProductListAction
    data class OnFilterChange(val filter: ProductFilter): ProductListAction
    data object OnRefreshClick: ProductListAction
    data object OnCheckoutClick: ProductListAction
}`,
    },
    {
      id: 'event',
      fileName: 'ProductListEvent.kt',
      title: '4. One-Shot Event Interface (<Screen>Event)',
      description: 'Transient UI events sent through a Channel (never stored in State!).',
      code: `package com.example.shop.presentation.product_list

import com.example.shop.presentation.util.UiText

/**
 * Transient, one-shot side-effects that should be executed exactly once.
 * Sent through a Channel and consumed via ObserveAsEvents.
 */
sealed interface ProductListEvent {
    data class ShowSnackbar(val message: UiText): ProductListEvent
    data object NavigateToCheckout: ProductListEvent
    data class NavigateToDetails(val productId: String): ProductListEvent
}`,
    },
    {
      id: 'viewmodel',
      fileName: 'ProductListViewModel.kt',
      title: '5. Canonical ViewModel (<Screen>ViewModel)',
      description: 'Handles onAction exhaustively with atomic state updates (_state.update).',
      code: `package com.example.shop.presentation.product_list

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.shop.domain.ProductRepository
import com.example.shop.presentation.util.UiText
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class ProductListViewModel(
    private val repository: ProductRepository
): ViewModel() {

    // 1. Single private StateFlow with public immutable accessor
    private val _state = MutableStateFlow(ProductListState())
    val state = _state.asStateFlow()

    // 2. Private Channel for one-time events with receiveAsFlow()
    private val _events = Channel<ProductListEvent>(Channel.BUFFERED)
    val events = _events.receiveAsFlow()

    init {
        loadProducts()
    }

    // 3. Single entry point for all UI interactions
    fun onAction(action: ProductListAction) {
        when(action) {
            is ProductListAction.OnSearchQueryChange -> {
                _state.update { it.copy(searchQuery = action.query) }
            }
            is ProductListAction.OnFavoriteToggle -> {
                toggleFavorite(action.productId)
            }
            is ProductListAction.OnAddToCart -> {
                addToCart(action.productId)
            }
            is ProductListAction.OnFilterChange -> {
                _state.update { it.copy(selectedFilter = action.filter) }
            }
            ProductListAction.OnRefreshClick -> {
                loadProducts()
            }
            ProductListAction.OnCheckoutClick -> {
                viewModelScope.launch {
                    _events.send(ProductListEvent.NavigateToCheckout)
                }
            }
            is ProductListAction.OnProductClick -> {
                viewModelScope.launch {
                    _events.send(ProductListEvent.NavigateToDetails(action.productId))
                }
            }
        }
    }

    // Business methods remain private to encapsulate logic
    private fun toggleFavorite(productId: String) {
        _state.update { currentState ->
            currentState.copy(
                products = currentState.products.map { product ->
                    if (product.id == productId) {
                        product.copy(isFavorite = !product.isFavorite)
                    } else product
                }
            )
        }
        viewModelScope.launch {
            _events.send(ProductListEvent.ShowSnackbar(UiText.DynamicString("Favoritos actualizados")))
        }
    }

    private fun addToCart(productId: String) {
        _state.update { it.copy(cartCount = it.cartCount + 1) }
        viewModelScope.launch {
            _events.send(ProductListEvent.ShowSnackbar(UiText.DynamicString("Agregado al carrito")))
        }
    }

    private fun loadProducts() {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true) }
            val result = repository.getProducts()
            _state.update { it.copy(isLoading = false, products = result) }
        }
    }
}`,
    },
    {
      id: 'observe_helper',
      fileName: 'ObserveAsEvents.kt',
      title: '6. ObserveAsEvents Helper',
      description: 'Canonical lifecycle-safe event collector with repeatOnLifecycle.',
      code: `package com.example.shop.presentation.util

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.repeatOnLifecycle
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.withContext

/**
 * Safely collects one-time events from a Channel or Flow in Compose.
 * Ensures events are ONLY consumed when the screen lifecycle is STARTED or RESUMED,
 * preventing lost events or crashes during configuration changes.
 */
@Composable
fun <T> ObserveAsEvents(
    flow: Flow<T>,
    key1: Any? = null,
    key2: Any? = null,
    onEvent: suspend (T) -> Unit
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
    },
    {
      id: 'uitext',
      fileName: 'UiText.kt',
      title: '7. UiText Pattern',
      description: 'Decouples Android String resources from ViewModel.',
      code: `package com.example.shop.presentation.util

import android.content.Context
import androidx.annotation.StringRes
import androidx.compose.runtime.Composable
import androidx.compose.ui.res.stringResource

/**
 * Allows ViewModels in Clean Architecture & Kotlin Multiplatform
 * to provide localized UI text without depending on Android Context.
 */
sealed interface UiText {
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
    },
  ];

  const activeFile = files.find((f) => f.id === activeTab) || files[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
            Plantilla Canónica de Código MVI
          </span>
          <h3 className="text-xl font-bold text-white mt-0.5">
            Estructura Canónica de Archivos MVI (Skills)
          </h3>
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs overflow-x-auto max-w-full">
          {files.map((file) => (
            <button
              key={file.id}
              onClick={() => setActiveTab(file.id)}
              className={`px-3 py-1.5 rounded-md font-medium font-mono text-xs transition-colors whitespace-nowrap shrink-0 ${
                activeTab === file.id
                  ? 'bg-slate-800 text-emerald-300 font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {file.fileName}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div>
            <span className="font-bold text-white">{activeFile.title}</span>
            <span className="mx-2 text-slate-600">·</span>
            <span>{activeFile.description}</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400">
            {activeFile.fileName}
          </span>
        </div>

        <CodeViewer
          title={activeFile.fileName}
          code={activeFile.code}
        />
      </div>
    </div>
  );
};
