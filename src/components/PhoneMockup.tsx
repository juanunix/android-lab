import React, { useState } from 'react';
import { Wifi, Battery, Signal, RotateCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type Orientation = 'portrait' | 'landscape';

interface PhoneMockupProps {
  children: React.ReactNode;
  appName?: string;
  recompositionCount?: number;
  onRotate?: (orientation: Orientation) => void;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  children,
  appName = 'Jetpack Compose Preview',
  recompositionCount,
  onRotate,
}) => {
  const { language } = useLanguage();
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [rotationCount, setRotationCount] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const t = {
    es: {
      rotate: 'Rotar dispositivo',
      portrait: 'Vertical',
      landscape: 'Horizontal',
      hint: 'Doble clic en la pantalla para rotar el dispositivo',
      recreated: 'Actividad recreada',
    },
    pt: {
      rotate: 'Girar dispositivo',
      portrait: 'Vertical',
      landscape: 'Horizontal',
      hint: 'Clique duas vezes na tela para girar o dispositivo',
      recreated: 'Activity recriada',
    },
    en: {
      rotate: 'Rotate device',
      portrait: 'Portrait',
      landscape: 'Landscape',
      hint: 'Double-click the screen to rotate the device',
      recreated: 'Activity recreated',
    },
  }[language];

  const isLandscape = orientation === 'landscape';

  const rotateDevice = () => {
    const next: Orientation = isLandscape ? 'portrait' : 'landscape';
    setOrientation(next);
    setRotationCount((count) => count + 1);
    setIsRotating(true);
    onRotate?.(next);
  };

  return (
    <div className="mx-auto w-full flex flex-col items-center">
      <div
        className={`relative w-full transition-all duration-500 ease-out ${
          isLandscape ? 'max-w-[560px]' : 'max-w-[340px]'
        }`}
      >
        <div
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget) setIsRotating(false);
          }}
          className={`relative w-full rounded-[36px] p-3 bg-gradient-to-b from-slate-800 via-slate-900 to-[#0b101e] border-2 border-slate-700/80 shadow-2xl ring-1 ring-white/10 ${
            isRotating ? 'device-is-rotating' : ''
          }`}
        >
          <div
            className={`relative rounded-[28px] bg-[#111827] overflow-hidden border border-slate-700 flex flex-col transition-all duration-500 ease-out ${
              isLandscape ? 'h-[340px]' : 'h-[520px]'
            }`}
          >
            <div className="h-7 bg-slate-950/80 px-4 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none border-b border-slate-800/40 shrink-0">
              <span>09:41</span>
              <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 mx-auto" />
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={rotateDevice}
                  title={t.rotate}
                  aria-label={t.rotate}
                  className="mr-1 w-6 h-6 rounded-full flex items-center justify-center text-brand hover:bg-surface-high transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="px-3 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full bg-brand" />
                <span className="text-xs font-semibold text-slate-200 truncate max-w-[170px]">
                  {appName}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand bg-brand/10 px-1.5 py-0.5 rounded">
                  {isLandscape ? t.landscape : t.portrait}
                </span>
                {typeof recompositionCount === 'number' && (
                  <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/60 px-1.5 py-0.5 rounded">
                    <span className="text-slate-400">Recomps:</span>
                    <span className="font-bold tabular-nums">{recompositionCount}</span>
                  </div>
                )}
              </div>
            </div>

            <div
              key={rotationCount}
              onDoubleClick={rotateDevice}
              title={t.hint}
              className="flex-1 overflow-y-auto p-3 bg-[#0d1424] text-slate-100 flex flex-col relative"
            >
              {children}
            </div>

            <div className="h-4 bg-slate-950/90 flex items-center justify-center shrink-0">
              <div
                className={`h-1 bg-slate-600 rounded-full transition-all duration-500 ${
                  isLandscape ? 'w-40' : 'w-24'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-slate-500">
        <RotateCw className="w-3 h-3" />
        <span>{t.hint}</span>
        {rotationCount > 0 && (
          <>
            <span className="text-slate-600">·</span>
            <span className="text-brand">{t.recreated}</span>
          </>
        )}
      </div>
    </div>
  );
};
