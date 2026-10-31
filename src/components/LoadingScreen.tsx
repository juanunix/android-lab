import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { APP_VERSION_LABEL } from '../config/version';
import { SITE_NAME } from '../config/site';

export const LoadingScreen: React.FC = () => {
  const { language } = useLanguage();
  const [leaving, setLeaving] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const boot = async () => {
      const minimumDelay = new Promise((resolve) => setTimeout(resolve, 700));
      const fontsReady = document.fonts?.ready ?? Promise.resolve();
      await Promise.all([minimumDelay, fontsReady]);
      if (cancelled) return;
      setLeaving(true);
      hideTimer = setTimeout(() => setHidden(true), 450);
    };

    boot();

    return () => {
      cancelled = true;
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  const label = {
    es: 'Inicializando laboratorio',
    pt: 'Inicializando laboratório',
    en: 'Initializing lab',
  }[language];

  if (hidden) return null;

  return (
    <div
      className={`loading-screen fixed inset-0 z-[100] flex items-center justify-center bg-surface transition-opacity duration-500 ${
        leaving ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,241,94,0.08),transparent_60%)]" />

      <div className="relative w-full max-w-sm px-8 space-y-6">
        <div className="flex items-center justify-center gap-3">
          <div className="loading-spinner w-9 h-9 rounded-full border-2 border-brand/25 border-t-brand animate-spin" />
          <span className="loading-brand font-mono text-brand text-xs tracking-[0.3em] uppercase">Compose</span>
        </div>

        <div className="text-center space-y-1">
          <h1 className="font-display text-2xl font-bold text-on-surface">{SITE_NAME}</h1>
          <p className="ds-label text-on-surface-variant">{label}</p>
        </div>

        <div className="loading-track h-[2px] w-full bg-surface-high overflow-hidden rounded-full">
          <div className="h-full w-1/3 bg-brand loader-sweep" />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-on-surface-variant/60">
          <span>ANDROID · JETPACK COMPOSE</span>
          <span>{APP_VERSION_LABEL}</span>
        </div>
      </div>
    </div>
  );
};
