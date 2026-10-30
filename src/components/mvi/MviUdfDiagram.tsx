import React, { useState } from 'react';
import { ArrowRight, RotateCw, Sparkles, Layers, Cpu, Smartphone, Bell, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const MviUdfDiagram: React.FC = () => {
  const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState(false);

  const tDiagram = {
    es: {
      kicker: 'Arquitectura Unidireccional (UDF)',
      title: 'El Ciclo Cerrado de MVI en Jetpack Compose',
      subtitle:
        'Basado en las directrices canónicas de MVI: los datos fluyen en una sola dirección predecible y atómica.',
      step1: '1. UI Interaction',
      step1Desc: 'El usuario interactúa con la pantalla (clic, texto, swipe).',
      step2: '2. Action (Intent)',
      step2Desc: 'La UI emite un sealed interface Action hacia el ViewModel.',
      step3: '3. ViewModel.onAction()',
      step3Desc: 'El ViewModel procesa la intención y ejecuta lógica atómica.',
      step4: '4. State & Event Channel',
      step4Desc: '_state.update {} para Estado y _events.send() para navegación.',
      step5: '5. Renderizado & ObserveAsEvents',
      step5Desc: 'Compose recompone con el nuevo State y consume eventos de un solo uso.',
      simulateBtn: 'Simular Ciclo UDF Completo',
      codePreview: 'Código de esta fase:',
    },
    pt: {
      kicker: 'Arquitetura Unidirecional (UDF)',
      title: 'O Ciclo Fechado do MVI no Jetpack Compose',
      subtitle:
        'Baseado nas diretrizes canônicas de MVI: os dados fluem em uma única direção previsível e atômica.',
      step1: '1. Interação na UI',
      step1Desc: 'O usuário interage com a tela (toque, digitação, swipe).',
      step2: '2. Action (Intent)',
      step2Desc: 'A UI despacha uma sealed interface Action para o ViewModel.',
      step3: '3. ViewModel.onAction()',
      step3Desc: 'O ViewModel processa a intenção e executa lógica atômica.',
      step4: '4. State & Event Channel',
      step4Desc: '_state.update {} para Estado e _events.send() para navegação.',
      step5: '5. Renderização & ObserveAsEvents',
      step5Desc: 'Compose recompõe com o novo State e consome eventos únicos.',
      simulateBtn: 'Simular Ciclo UDF Completo',
      codePreview: 'Código desta fase:',
    },
    en: {
      kicker: 'Unidirectional Data Flow (UDF)',
      title: 'The Closed MVI Loop in Jetpack Compose',
      subtitle:
        'Based on canonical MVI guidelines: state and events flow in a predictable, atomic single direction.',
      step1: '1. UI Interaction',
      step1Desc: 'User triggers an interaction (click, input, swipe).',
      step2: '2. Action (Intent)',
      step2Desc: 'UI dispatches a sealed interface Action to the ViewModel.',
      step3: '3. ViewModel.onAction()',
      step3Desc: 'ViewModel processes the intent with atomic business logic.',
      step4: '4. State & Event Channel',
      step4Desc: '_state.update {} for State and _events.send() for one-time effects.',
      step5: '5. Render & ObserveAsEvents',
      step5Desc: 'Compose renders new State and observes single-shot Channel events.',
      simulateBtn: 'Simulate Complete UDF Cycle',
      codePreview: 'Code in this stage:',
    },
  }[language];

  const steps = [
    {
      num: 1,
      title: tDiagram.step1,
      desc: tDiagram.step1Desc,
      icon: Smartphone,
      accent: 'emerald',
      code: `// ProductListScreen (Stateless Compose UI)
Button(onClick = { onAction(ProductListAction.OnFavoriteToggle(productId)) }) {
    Icon(Icons.Default.Favorite, contentDescription = null)
}`,
    },
    {
      num: 2,
      title: tDiagram.step2,
      desc: tDiagram.step2Desc,
      icon: Layers,
      accent: 'sky',
      code: `// Sealed Interface (MVI Standard)
sealed interface ProductListAction {
    data class OnFavoriteToggle(val productId: String): ProductListAction
    data class OnSearchQueryChange(val query: String): ProductListAction
    data object OnCheckoutClick: ProductListAction
}`,
    },
    {
      num: 3,
      title: tDiagram.step3,
      desc: tDiagram.step3Desc,
      icon: Cpu,
      accent: 'indigo',
      code: `// Single entry point in ViewModel
fun onAction(action: ProductListAction) {
    when(action) {
        is ProductListAction.OnFavoriteToggle -> toggleFavorite(action.productId)
        is ProductListAction.OnSearchQueryChange -> _state.update { it.copy(searchQuery = action.query) }
        ProductListAction.OnCheckoutClick -> viewModelScope.launch { _events.send(ProductListEvent.Navigate) }
    }
}`,
    },
    {
      num: 4,
      title: tDiagram.step4,
      desc: tDiagram.step4Desc,
      icon: RotateCw,
      accent: 'amber',
      code: `// Atomic State update + Safe Channel event
_state.update { currentState ->
    currentState.copy(
        products = currentState.products.map { ... }
    )
}
// One-shot event via Channel:
_events.send(ProductListEvent.ShowSnackbar(UiText.DynamicString("Item salvo!")))`,
    },
    {
      num: 5,
      title: tDiagram.step5,
      desc: tDiagram.step5Desc,
      icon: Bell,
      accent: 'emerald',
      code: `// In ProductListRoot:
val state by viewModel.state.collectAsStateWithLifecycle()

ObserveAsEvents(viewModel.events) { event ->
    when(event) {
        is ProductListEvent.ShowSnackbar -> snackbarHostState.showSnackbar(event.message.asString(context))
        ProductListEvent.Navigate -> onNavigateToCheckout()
    }
}

ProductListScreen(
    state = state,
    onAction = viewModel::onAction,
    onCheckoutClick = onNavigateToCheckout
)`,
    },
  ];

  const handleSimulateCycle = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    let current = 1;
    setActiveStep(1);

    const interval = setInterval(() => {
      current++;
      if (current > 5) {
        clearInterval(interval);
        setIsSimulating(false);
      } else {
        setActiveStep(current);
      }
    }, 1100);
  };

  const currentStepData = steps.find((s) => s.num === activeStep) || steps[0];

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
            {tDiagram.kicker}
          </span>
          <h3 className="text-xl font-bold text-white mt-0.5">
            {tDiagram.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {tDiagram.subtitle}
          </p>
        </div>

        <button
          onClick={handleSimulateCycle}
          disabled={isSimulating}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 disabled:opacity-60 shrink-0 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isSimulating ? 'Simulando UDF...' : tDiagram.simulateBtn}</span>
        </button>
      </div>

      {/* Visual Pipeline Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
        {steps.map((st) => {
          const isCurrent = activeStep === st.num;
          const isPassed = activeStep > st.num;
          const Icon = st.icon;

          return (
            <div
              key={st.num}
              onClick={() => setActiveStep(st.num)}
              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'bg-slate-900 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                  : isPassed
                  ? 'bg-[#0f172a] border-slate-700/60 opacity-90'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                    isCurrent
                      ? 'bg-emerald-500 text-slate-950'
                      : isPassed
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : st.num}
                </span>
                <Icon
                  className={`w-4 h-4 ${
                    isCurrent ? 'text-emerald-400 animate-pulse' : 'text-slate-500'
                  }`}
                />
              </div>

              <div>
                <span className="text-xs font-bold text-slate-200 block truncate">
                  {st.title}
                </span>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {st.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Code for active step */}
      <div className="bg-[#070b14] p-4 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Fase #{activeStep}: {currentStepData.title}</span>
          </span>
          <span>Kotlin / Jetpack Compose</span>
        </div>

        <pre className="font-mono text-xs text-sky-300 overflow-x-auto p-2 bg-[#050810] rounded-lg border border-slate-800/60 leading-relaxed">
          <code>{currentStepData.code}</code>
        </pre>
      </div>
    </div>
  );
};
