import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  ShieldAlert,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { CodeViewer } from '../../CodeViewer';
import { useLanguage } from '../../../context/LanguageContext';

interface SkillSectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const SkillSection: React.FC<SkillSectionProps> = ({
  id,
  eyebrow,
  title,
  description,
  children,
}) => (
  <section id={id} className="space-y-4">
    <div>
      {eyebrow && (
        <span className="text-xs font-mono text-brand uppercase font-semibold">
          {eyebrow}
        </span>
      )}
      <h3 className="text-2xl font-bold text-on-surface mt-0.5">{title}</h3>
      {description && (
        <p className="text-xs text-on-surface-variant mt-0.5 max-w-4xl">{description}</p>
      )}
    </div>
    {children}
  </section>
);

interface ConceptCardProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  tone?: 'neutral' | 'brand' | 'warning';
}

export const ConceptCard: React.FC<ConceptCardProps> = ({
  icon: Icon,
  title,
  children,
  tone = 'neutral',
}) => {
  const toneClass =
    tone === 'brand'
      ? 'bg-brand/10 border-brand/20'
      : tone === 'warning'
      ? 'bg-amber-500/10 border-amber-500/20'
      : 'bg-surface-low border-transparent';

  return (
    <div className={`p-5 rounded-2xl border ${toneClass} space-y-2`}>
      <div className="flex items-center gap-2 text-on-surface">
        {Icon && <Icon className="w-4 h-4 text-brand shrink-0" />}
        <h4 className="text-sm font-bold">{title}</h4>
      </div>
      <div className="text-xs text-on-surface-variant leading-relaxed">{children}</div>
    </div>
  );
};

interface CodeCompareProps {
  title: string;
  description?: string;
  badCode: string;
  goodCode: string;
}

export const CodeCompare: React.FC<CodeCompareProps> = ({
  title,
  description,
  badCode,
  goodCode,
}) => {
  const { language } = useLanguage();
  const labels = {
    es: { bad: 'Incorrecto', good: 'Correcto' },
    pt: { bad: 'Incorreto', good: 'Correto' },
    en: { bad: 'Incorrect', good: 'Correct' },
  }[language];

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-bold text-on-surface">{title}</h4>
        {description && <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400">
            <XCircle className="w-3.5 h-3.5" />
            <span>{labels.bad}</span>
          </div>
          <CodeViewer title="Bad.kt" code={badCode} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-brand">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{labels.good}</span>
          </div>
          <CodeViewer title="Good.kt" code={goodCode} />
        </div>
      </div>
    </div>
  );
};

interface QuizProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const Quiz: React.FC<QuizProps> = ({ question, options, correctIndex, explanation }) => {
  const { language } = useLanguage();
  const [selected, setSelected] = useState<number | null>(null);
  const labels = {
    es: { correct: 'Correcto', incorrect: 'Incorrecto', retry: 'Intentar de nuevo' },
    pt: { correct: 'Correto', incorrect: 'Incorreto', retry: 'Tentar novamente' },
    en: { correct: 'Correct', incorrect: 'Incorrect', retry: 'Try again' },
  }[language];
  const answered = selected !== null;
  const isCorrect = selected === correctIndex;

  return (
    <div className="p-5 rounded-2xl bg-surface-low border-transparent space-y-3">
      <div className="flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-brand shrink-0 mt-0.5" />
        <h4 className="text-sm font-bold text-on-surface">{question}</h4>
      </div>
      <div className="grid gap-2">
        {options.map((option, index) => {
          const chosen = selected === index;
          const showCorrect = answered && index === correctIndex;
          const showWrong = answered && chosen && index !== correctIndex;
          return (
            <button
              key={option}
              onClick={() => setSelected(index)}
              disabled={answered}
              className={`text-left p-3 rounded-xl text-xs border transition-colors ${
                showCorrect
                  ? 'border-brand/40 bg-brand/10 text-on-surface'
                  : showWrong
                  ? 'border-rose-500/40 bg-rose-500/10 text-on-surface'
                  : 'border-transparent bg-surface-high/60 text-on-surface-variant hover:bg-surface-highest'
              }`}
            >
              <span className="font-mono text-[10px] text-brand mr-2">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          );
        })}
      </div>
      {answered && (
        <div
          className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
            isCorrect ? 'bg-brand/10 text-on-surface' : 'bg-amber-500/10 text-on-surface'
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <div>
            <p className="font-bold">{isCorrect ? labels.correct : labels.incorrect}</p>
            <p className="text-on-surface-variant mt-0.5">{explanation}</p>
            {!isCorrect && (
              <button
                onClick={() => setSelected(null)}
                className="mt-2 text-brand font-semibold hover:underline"
              >
                {labels.retry}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface ChecklistProps {
  title: string;
  items: string[];
}

export const Checklist: React.FC<ChecklistProps> = ({ title, items }) => {
  const [checked, setChecked] = useState<Set<number>>(() => new Set());
  const toggle = (index: number) => {
    setChecked((previous) => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="p-5 rounded-2xl bg-surface-low space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-on-surface">{title}</h4>
        <span className="text-[10px] font-mono text-brand">
          {checked.size}/{items.length}
        </span>
      </div>
      <ul className="space-y-2 text-xs text-on-surface-variant">
        {items.map((item, index) => {
          const isChecked = checked.has(index);
          return (
            <li key={item}>
              <button
                onClick={() => toggle(index)}
                className="w-full text-left flex items-start gap-2"
              >
                <span
                  className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center ${
                    isChecked
                      ? 'bg-brand border-brand text-on-primary'
                      : 'border-outline-variant'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3" />}
                </span>
                <span className={isChecked ? 'line-through opacity-60' : ''}>{item}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

interface CalloutProps {
  tone?: 'brand' | 'neutral' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({ tone = 'brand', title, children }) => {
  const config = {
    brand: { icon: Lightbulb, className: 'bg-brand/10 text-on-surface' },
    neutral: { icon: Lightbulb, className: 'bg-surface-low text-on-surface' },
    warning: { icon: AlertTriangle, className: 'bg-amber-500/10 text-on-surface' },
    danger: { icon: ShieldAlert, className: 'bg-rose-500/10 text-on-surface' },
  }[tone];
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-2xl text-xs flex items-start gap-3 ${config.className}`}>
      <Icon className="w-4 h-4 text-brand shrink-0 mt-0.5" />
      <div className="space-y-1">
        {title && <p className="font-bold">{title}</p>}
        <div className="text-on-surface-variant leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

interface StepFlowProps {
  steps: { title: string; description: string }[];
}

export const StepFlow: React.FC<StepFlowProps> = ({ steps }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
    {steps.map((step, index) => (
      <div key={step.title} className="p-4 rounded-2xl bg-surface-low space-y-2 relative">
        <span className="text-[10px] font-mono text-brand font-bold">
          {String(index + 1).padStart(2, '0')}
        </span>
        <h4 className="text-xs font-bold text-on-surface">{step.title}</h4>
        <p className="text-[11px] text-on-surface-variant leading-relaxed">{step.description}</p>
        {index < steps.length - 1 && (
          <ChevronRight className="hidden xl:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand" />
        )}
      </div>
    ))}
  </div>
);

interface SimulatorFrameProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const SimulatorFrame: React.FC<SimulatorFrameProps> = ({
  title,
  description,
  children,
  footer,
}) => (
  <div className="rounded-2xl bg-surface-low overflow-hidden">
    <div className="p-4 bg-surface-container">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
        <h4 className="text-sm font-bold text-on-surface">{title}</h4>
      </div>
      {description && (
        <p className="text-xs text-on-surface-variant mt-1">{description}</p>
      )}
    </div>
    <div className="p-4 space-y-4">{children}</div>
    {footer && <div className="px-4 pb-4 text-[11px] text-on-surface-variant">{footer}</div>}
  </div>
);

interface ProgressBadgeProps {
  current: number;
  total: number;
}

export const ProgressBadge: React.FC<ProgressBadgeProps> = ({ current, total }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 rounded-full bg-surface-high overflow-hidden">
        <div
          className="h-full bg-brand transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-on-surface-variant">
        {current}/{total}
      </span>
    </div>
  );
};
