import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DecisionTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEffect: (effectId: string) => void;
}

export const DecisionTreeModal: React.FC<DecisionTreeModalProps> = ({
  isOpen,
  onClose,
  onSelectEffect,
}) => {
  const { t, sideEffects } = useLanguage();
  const m = t.decisionModal;

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<{
    purpose?: 'coroutine' | 'lifecycle' | 'state';
    coroutineOrigin?: 'composition' | 'user_event';
    lifecycleCleanup?: 'yes_cleanup' | 'no_sync_only';
    stateGoal?: 'produce_state' | 'optimize_recomp' | 'flow_operators' | 'persist_callback';
  }>({});

  if (!isOpen) return null;

  const handleReset = () => {
    setStep(1);
    setAnswers({});
  };

  // Determine final recommendation
  let recommendedId: string | null = null;
  let reason = '';

  if (answers.purpose === 'coroutine') {
    if (answers.coroutineOrigin === 'composition') {
      recommendedId = 'launched-effect';
      reason = m.q2CoroutinesOpt1Desc;
    } else if (answers.coroutineOrigin === 'user_event') {
      recommendedId = 'remember-coroutine-scope';
      reason = m.q2CoroutinesOpt2Desc;
    }
  } else if (answers.purpose === 'lifecycle') {
    if (answers.lifecycleCleanup === 'yes_cleanup') {
      recommendedId = 'disposable-effect';
      reason = m.q2LifecycleOpt1Desc;
    } else if (answers.lifecycleCleanup === 'no_sync_only') {
      recommendedId = 'side-effect';
      reason = m.q2LifecycleOpt2Desc;
    }
  } else if (answers.purpose === 'state') {
    if (answers.stateGoal === 'produce_state') {
      recommendedId = 'produce-state';
      reason = m.q2StateOpt1Desc;
    } else if (answers.stateGoal === 'optimize_recomp') {
      recommendedId = 'derived-state-of';
      reason = m.q2StateOpt2Desc;
    } else if (answers.stateGoal === 'flow_operators') {
      recommendedId = 'snapshot-flow';
      reason = m.q2StateOpt3Desc;
    } else if (answers.stateGoal === 'persist_callback') {
      recommendedId = 'remember-updated-state';
      reason = m.q2StateOpt4Desc;
    }
  }

  const recommendedEffect = recommendedId
    ? sideEffects.find((e) => e.id === recommendedId)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#131d35] border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              {m.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!recommendedEffect ? (
            <>
              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                      {m.stepOf.replace('{step}', '1')}
                    </span>
                    <h4 className="text-sm font-semibold text-white">
                      {m.q1Title}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setAnswers({ ...answers, purpose: 'coroutine' });
                        setStep(2);
                      }}
                      className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/70 hover:border-emerald-500/50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 group-hover:text-white text-sm">
                          {m.q1Opt1Title}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {m.q1Opt1Desc}
                      </p>
                    </button>

                    <button
                      onClick={() => {
                        setAnswers({ ...answers, purpose: 'lifecycle' });
                        setStep(2);
                      }}
                      className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/70 hover:border-emerald-500/50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 group-hover:text-white text-sm">
                          {m.q1Opt2Title}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {m.q1Opt2Desc}
                      </p>
                    </button>

                    <button
                      onClick={() => {
                        setAnswers({ ...answers, purpose: 'state' });
                        setStep(2);
                      }}
                      className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/70 hover:border-emerald-500/50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 group-hover:text-white text-sm">
                          {m.q1Opt3Title}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {m.q1Opt3Desc}
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 for Coroutines */}
              {step === 2 && answers.purpose === 'coroutine' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                      {m.stepOf.replace('{step}', '2')}
                    </span>
                    <h4 className="text-sm font-semibold text-white">
                      {m.q2CoroutinesTitle}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        setAnswers({ ...answers, coroutineOrigin: 'composition' })
                      }
                      className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/70 hover:border-emerald-500/50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 group-hover:text-white text-sm">
                          {m.q2CoroutinesOpt1Title}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {m.q2CoroutinesOpt1Desc}
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        setAnswers({ ...answers, coroutineOrigin: 'user_event' })
                      }
                      className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/70 hover:border-emerald-500/50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 group-hover:text-white text-sm">
                          {m.q2CoroutinesOpt2Title}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {m.q2CoroutinesOpt2Desc}
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 for Lifecycle */}
              {step === 2 && answers.purpose === 'lifecycle' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                      {m.stepOf.replace('{step}', '2')}
                    </span>
                    <h4 className="text-sm font-semibold text-white">
                      {m.q2LifecycleTitle}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        setAnswers({ ...answers, lifecycleCleanup: 'yes_cleanup' })
                      }
                      className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/70 hover:border-emerald-500/50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 group-hover:text-white text-sm">
                          {m.q2LifecycleOpt1Title}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {m.q2LifecycleOpt1Desc}
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        setAnswers({ ...answers, lifecycleCleanup: 'no_sync_only' })
                      }
                      className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/70 hover:border-emerald-500/50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200 group-hover:text-white text-sm">
                          {m.q2LifecycleOpt2Title}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {m.q2LifecycleOpt2Desc}
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 for State */}
              {step === 2 && answers.purpose === 'state' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                      {m.stepOf.replace('{step}', '2')}
                    </span>
                    <h4 className="text-sm font-semibold text-white">
                      {m.q2StateTitle}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setAnswers({ ...answers, stateGoal: 'produce_state' })}
                      className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/70 hover:border-emerald-500/50 transition-all group"
                    >
                      <span className="font-semibold text-slate-200 group-hover:text-white text-sm block">
                        {m.q2StateOpt1Title}
                      </span>
                      <p className="text-xs text-slate-400 mt-1">
                        {m.q2StateOpt1Desc}
                      </p>
                    </button>

                    <button
                      onClick={() => setAnswers({ ...answers, stateGoal: 'optimize_recomp' })}
                      className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/70 hover:border-emerald-500/50 transition-all group"
                    >
                      <span className="font-semibold text-slate-200 group-hover:text-white text-sm block">
                        {m.q2StateOpt2Title}
                      </span>
                      <p className="text-xs text-slate-400 mt-1">
                        {m.q2StateOpt2Desc}
                      </p>
                    </button>

                    <button
                      onClick={() => setAnswers({ ...answers, stateGoal: 'flow_operators' })}
                      className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/70 hover:border-emerald-500/50 transition-all group"
                    >
                      <span className="font-semibold text-slate-200 group-hover:text-white text-sm block">
                        {m.q2StateOpt3Title}
                      </span>
                      <p className="text-xs text-slate-400 mt-1">
                        {m.q2StateOpt3Desc}
                      </p>
                    </button>

                    <button
                      onClick={() => setAnswers({ ...answers, stateGoal: 'persist_callback' })}
                      className="w-full text-left p-3 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/70 hover:border-emerald-500/50 transition-all group"
                    >
                      <span className="font-semibold text-slate-200 group-hover:text-white text-sm block">
                        {m.q2StateOpt4Title}
                      </span>
                      <p className="text-xs text-slate-400 mt-1">
                        {m.q2StateOpt4Desc}
                      </p>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Recommended Result */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-mono uppercase font-bold tracking-wider">
                    {m.recommendedTag}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-mono text-white">
                    {recommendedEffect.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {reason}
                  </p>
                </div>

                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto">
                  {recommendedEffect.kotlinSignature}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    onSelectEffect(recommendedEffect.id);
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <span>{m.exploreBtn} {recommendedEffect.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleReset}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-colors"
                >
                  {m.restartBtn}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#131d35] border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
          {step > 1 && !recommendedEffect && (
            <button
              onClick={() => setStep(step - 1)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {m.backBtn}
            </button>
          )}
          <span className="ml-auto">{m.footerNote}</span>
        </div>
      </div>
    </div>
  );
};

