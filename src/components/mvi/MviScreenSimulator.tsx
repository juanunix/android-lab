import React, { useState } from 'react';
import {
  Search,
  Heart,
  ShoppingCart,
  RefreshCw,
  RotateCw,
  Zap,
  Filter,
  Check,
  Bell,
  Package,
} from 'lucide-react';
import { DemoScreenState, ProductItem, MviActionItem, MviEventItem } from '../../types/mvi';
import { useLanguage } from '../../context/LanguageContext';

export const MviScreenSimulator: React.FC = () => {
  const { language } = useLanguage();

  const initialProducts: ProductItem[] = [
    { id: '1', name: 'Google Pixel 9 Pro (128GB)', price: 999, inStock: true, isFavorite: true },
    { id: '2', name: 'Pixel Watch 3 (45mm LTE)', price: 399, inStock: true, isFavorite: false },
    { id: '3', name: 'Pixel Buds Pro 2 (Hazel)', price: 229, inStock: true, isFavorite: false },
    { id: '4', name: 'Pixel Tablet with Speaker Dock', price: 499, inStock: false, isFavorite: true },
    { id: '5', name: 'Google 30W USB-C Charger', price: 29, inStock: true, isFavorite: false },
  ];

  const [state, setState] = useState<DemoScreenState>({
    searchQuery: '',
    products: initialProducts,
    cartCount: 2,
    isLoading: false,
    selectedFilter: 'all',
    isDeviceRotated: false,
  });

  const [actionsHistory, setActionsHistory] = useState<MviActionItem[]>([
    { id: 'a-1', timestamp: '09:41:00', name: 'OnRefresh' },
  ]);

  const [isRotating, setIsRotating] = useState(false);

  const [eventsChannel, setEventsChannel] = useState<MviEventItem[]>([]);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const tSim = {
    es: {
      screenTitle: 'Pixel Store MVI Screen',
      searchPlaceholder: 'Buscar producto...',
      all: 'Todos',
      favorites: 'Favoritos',
      in_stock: 'En stock',
      inStock: 'En stock',
      outOfStock: 'Agotado',
      addToCart: 'Agregar',
      checkoutBtn: 'Finalizar Compra (Event)',
      refreshBtn: 'Refrescar Catálogo',
      rotateBtn: 'Simular Giro de Pantalla (Recreación Activity)',
      portrait: 'Vertical',
      landscape: 'Horizontal',
      stateInspectorTitle: 'StateFlow Inspector (Single State)',
      actionsTitle: 'Action Dispatcher (UI -> ViewModel)',
      eventsTitle: 'Channel<Event> (One-Shot Flow)',
      noEvents: 'Canal vacío (esperando eventos únicos)',
      addedToCart: '¡Artículo agregado al carrito!',
      catalogUpdated: 'Catálogo actualizado con éxito',
      loadingProducts: 'Cargando productos...',
      noProducts: 'No se encontraron productos',
      favorite: 'Favorito',
      refreshTooltip: 'Refrescar',
    },
    pt: {
      screenTitle: 'Pixel Store MVI Screen',
      searchPlaceholder: 'Buscar produto...',
      all: 'Todos',
      favorites: 'Favoritos',
      in_stock: 'Em estoque',
      inStock: 'Em estoque',
      outOfStock: 'Esgotado',
      addToCart: 'Adicionar',
      checkoutBtn: 'Finalizar Compra (Event)',
      refreshBtn: 'Atualizar Catálogo',
      rotateBtn: 'Simular Rotação de Tela (Recriação Activity)',
      portrait: 'Retrato',
      landscape: 'Paisagem',
      stateInspectorTitle: 'StateFlow Inspector (Estado Único)',
      actionsTitle: 'Action Dispatcher (UI -> ViewModel)',
      eventsTitle: 'Channel<Event> (Fluxo Único)',
      noEvents: 'Canal vazio (aguardando eventos únicos)',
      addedToCart: 'Item adicionado ao carrinho!',
      catalogUpdated: 'Catálogo atualizado com sucesso',
      loadingProducts: 'Carregando produtos...',
      noProducts: 'Nenhum produto encontrado',
      favorite: 'Favorito',
      refreshTooltip: 'Atualizar',
    },
    en: {
      screenTitle: 'Pixel Store MVI Screen',
      searchPlaceholder: 'Search products...',
      all: 'All',
      favorites: 'Favorites',
      in_stock: 'In Stock',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      addToCart: 'Add',
      checkoutBtn: 'Checkout (Event)',
      refreshBtn: 'Refresh Catalog',
      rotateBtn: 'Simulate Screen Rotation (Activity Recreate)',
      portrait: 'Portrait',
      landscape: 'Landscape',
      stateInspectorTitle: 'StateFlow Inspector (Single State)',
      actionsTitle: 'Action Dispatcher (UI -> ViewModel)',
      eventsTitle: 'Channel<Event> (One-Shot Flow)',
      noEvents: 'Channel empty (waiting for one-time events)',
      addedToCart: 'Item added to cart!',
      catalogUpdated: 'Catalog updated successfully',
      loadingProducts: 'Loading products...',
      noProducts: 'No products found',
      favorite: 'Favorite',
      refreshTooltip: 'Refresh',
    },
  }[language];

  // Helper to log action in MVI flow
  const dispatchAction = (actionName: string, payload?: string) => {
    const time = new Date().toLocaleTimeString();
    setActionsHistory((prev) => [
      { id: `act-${Date.now()}`, timestamp: time, name: actionName, payload },
      ...prev.slice(0, 9),
    ]);
  };

  // Helper to send event through Channel
  const sendChannelEvent = (eventName: string, payload?: string) => {
    const time = new Date().toLocaleTimeString();
    const eventItem: MviEventItem = {
      id: `ev-${Date.now()}`,
      timestamp: time,
      name: eventName,
      payload,
      delivered: true,
    };
    setEventsChannel((prev) => [eventItem, ...prev.slice(0, 5)]);

    // Trigger UI snackbar via simulated ObserveAsEvents
    if (eventName.includes('ShowSnackbar') || eventName.includes('Navigate')) {
      setSnackbarMessage(payload || eventName);
      setTimeout(() => setSnackbarMessage(null), 3000);
    }
  };

  // ViewModel.onAction implementation
  const onAction = (action: string, param?: any) => {
    switch (action) {
      case 'OnSearchQueryChange': {
        const query = param as string;
        dispatchAction('OnSearchQueryChange', `query="${query}"`);
        // Atomic state update
        setState((prev) => ({ ...prev, searchQuery: query }));
        break;
      }

      case 'OnFavoriteToggle': {
        const productId = param as string;
        dispatchAction('OnFavoriteToggle', `productId="${productId}"`);
        setState((prev) => ({
          ...prev,
          products: prev.products.map((p) =>
            p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
          ),
        }));
        const target = state.products.find((p) => p.id === productId);
        sendChannelEvent(
          'ShowSnackbar',
          target?.isFavorite ? 'Removido de favoritos' : 'Agregado a favoritos'
        );
        break;
      }

      case 'OnAddToCart': {
        const productId = param as string;
        dispatchAction('OnAddToCart', `productId="${productId}"`);
        setState((prev) => ({
          ...prev,
          cartCount: prev.cartCount + 1,
        }));
        sendChannelEvent('ShowSnackbar', tSim.addedToCart);
        break;
      }

      case 'OnFilterChange': {
        const filter = param as 'all' | 'favorites' | 'in_stock';
        dispatchAction('OnFilterChange', `filter=${filter}`);
        setState((prev) => ({ ...prev, selectedFilter: filter }));
        break;
      }

      case 'OnRefresh': {
        dispatchAction('OnRefresh');
        setState((prev) => ({ ...prev, isLoading: true }));
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            products: initialProducts,
          }));
          sendChannelEvent('ShowSnackbar', tSim.catalogUpdated);
        }, 600);
        break;
      }

      case 'OnCheckoutClick': {
        dispatchAction('OnCheckoutClick');
        sendChannelEvent('NavigateToCheckout', 'Navegando a CheckoutScreen via Channel');
        break;
      }
    }
  };

  // Simulate device rotation (recreates Compose UI, tests State preservation and Channel non-replay)
  const handleRotateDevice = () => {
    setState((prev) => ({ ...prev, isDeviceRotated: !prev.isDeviceRotated }));
    setIsRotating(true);
    dispatchAction('OnConfigurationChange', 'SCREEN_ROTATION');
  };

  // Filtered products list
  const visibleProducts = state.products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(state.searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (state.selectedFilter === 'favorites') return p.isFavorite;
    if (state.selectedFilter === 'in_stock') return p.inStock;
    return true;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Column 1: Simulated Android Phone with MVI UI */}
      <div className="lg:col-span-5 space-y-4">
        <div
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget) setIsRotating(false);
          }}
          className={`phone-device mx-auto w-full bg-[#0b101e] p-3 sm:p-4 rounded-2xl border-2 border-slate-700/80 shadow-2xl relative transition-all duration-500 ease-out ${
            state.isDeviceRotated ? 'max-w-[560px]' : 'max-w-[360px]'
          } ${isRotating ? 'device-is-rotating' : ''}`}
        >
          <div
            className={`rounded-2xl bg-[#0e1628] overflow-hidden border border-slate-700 flex flex-col shadow-inner relative transition-all duration-500 ease-out ${
              state.isDeviceRotated ? 'h-[340px]' : 'h-[520px]'
            }`}
          >
            {/* Top Bar of Android Phone */}
            <div className="h-7 bg-slate-950 px-4 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none border-b border-slate-800 shrink-0">
              <span>09:41</span>
              <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-brand font-mono uppercase tracking-wider">
                  {state.isDeviceRotated ? tSim.landscape : tSim.portrait}
                </span>
                <span className="text-[10px] text-slate-400">100%</span>
              </div>
            </div>

            {/* Compose TopAppBar */}
            <div className="px-3.5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-white truncate">
                {tSim.screenTitle}
              </span>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <ShoppingCart className="w-4 h-4 text-slate-300" />
                  {state.cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 px-1 bg-emerald-500 text-slate-950 text-[9px] font-bold rounded-full">
                      {state.cartCount}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* PixelStoreScreen (Stateless Composable) */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#0b101e] text-xs">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={state.searchQuery}
                  onChange={(e) => onAction('OnSearchQueryChange', e.target.value)}
                  placeholder={tSim.searchPlaceholder}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {(['all', 'favorites', 'in_stock'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => onAction('OnFilterChange', filter)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                      state.selectedFilter === filter
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tSim[filter]}
                  </button>
                ))}
              </div>

              {/* Product List */}
              <div className="space-y-1.5">
                {state.isLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-emerald-400" />
                    <span>{tSim.loadingProducts}</span>
                  </div>
                ) : visibleProducts.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    {tSim.noProducts}
                  </div>
                ) : (
                  visibleProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <span className="font-semibold text-slate-200 block truncate text-xs">
                          {p.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-emerald-400 font-bold">
                            ${p.price}
                          </span>
                          {!p.inStock && (
                            <span className="text-[10px] text-rose-400 font-mono">
                              ({tSim.outOfStock})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => onAction('OnFavoriteToggle', p.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
                          title={tSim.favorite}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              p.isFavorite
                                ? 'fill-rose-500 text-rose-500'
                                : 'text-slate-400'
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => onAction('OnAddToCart', p.id)}
                          disabled={!p.inStock}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-md text-[11px] font-semibold transition-colors"
                        >
                          {tSim.addToCart}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Checkout Action */}
            <div className="p-2.5 bg-slate-900/95 border-t border-slate-800 shrink-0">
              <button
                onClick={() => onAction('OnCheckoutClick')}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>{tSim.checkoutBtn}</span>
              </button>
            </div>

            {/* Simulated Snackbar Notification */}
            {snackbarMessage && (
              <div className="absolute bottom-14 left-3 right-3 bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 shadow-2xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-bottom-2 duration-150 z-30">
                <span className="truncate pr-2">{snackbarMessage}</span>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold shrink-0">
                  OBSERVED
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Rotate and Refresh Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRotateDevice}
            className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5 text-sky-400" />
            <span>{tSim.rotateBtn}</span>
          </button>
          <button
            onClick={() => onAction('OnRefresh')}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
            title={tSim.refreshTooltip}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Column 2: MVI Diagnostic Panels (StateFlow Inspector + Action Log + Event Channel) */}
      <div className="lg:col-span-7 space-y-4">
        {/* StateFlow Inspector */}
        <div className="bg-[#0b1120] p-4 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
                {tSim.stateInspectorTitle}
              </h4>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              StateFlow&lt;ProductListState&gt;
            </span>
          </div>

          <pre className="font-mono text-xs text-sky-300 bg-[#070b14] p-3 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed max-h-44">
            <code>
{`ProductListState(
  searchQuery = "${state.searchQuery}",
  cartCount = ${state.cartCount},
  selectedFilter = ${state.selectedFilter.toUpperCase()},
  isLoading = ${state.isLoading},
  productsCount = ${state.products.length},
  favoritesCount = ${state.products.filter((p) => p.isFavorite).length}
)`}
            </code>
          </pre>
        </div>

        {/* Action Dispatcher Log */}
        <div className="bg-[#0b1120] p-4 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
                {tSim.actionsTitle}
              </h4>
            </div>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
              sealed interface Action
            </span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-xs">
            {actionsHistory.map((act) => (
              <div
                key={act.id}
                className="p-1.5 rounded bg-[#070b14] border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-slate-500 text-[10px]">{act.timestamp}</span>
                  <span className="text-amber-300 font-bold">{act.name}</span>
                  {act.payload && (
                    <span className="text-slate-400 text-[11px] truncate">
                      ({act.payload})
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">onAction()</span>
              </div>
            ))}
          </div>
        </div>

        {/* Event Channel Queue */}
        <div className="bg-[#0b1120] p-4 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-400" />
              <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
                {tSim.eventsTitle}
              </h4>
            </div>
            <span className="text-[11px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
              Channel&lt;Event&gt; (receiveAsFlow)
            </span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto font-mono text-xs">
            {eventsChannel.length === 0 ? (
              <p className="text-slate-500 text-xs py-2 text-center">
                {tSim.noEvents}
              </p>
            ) : (
              eventsChannel.map((ev) => (
                <div
                  key={ev.id}
                  className="p-1.5 rounded bg-[#070b14] border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-slate-500 text-[10px]">{ev.timestamp}</span>
                    <span className="text-sky-300 font-bold">{ev.name}</span>
                    {ev.payload && (
                      <span className="text-slate-300 text-[11px] truncate">
                        "{ev.payload}"
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    ✓ CONSUMED (1-shot)
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
