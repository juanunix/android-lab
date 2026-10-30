import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneMockupProps {
  children: React.ReactNode;
  appName?: string;
  recompositionCount?: number;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  children,
  appName = 'Jetpack Compose Preview',
  recompositionCount,
}) => {
  return (
    <div className="relative mx-auto w-full max-w-[340px] rounded-[36px] p-3 bg-gradient-to-b from-slate-800 via-slate-900 to-[#0b101e] border-2 border-slate-700/80 shadow-2xl ring-1 ring-white/10">
      {/* Outer bezel highlights */}
      <div className="relative rounded-[28px] bg-[#111827] overflow-hidden border border-slate-700 flex flex-col h-[520px] shadow-inner">
        {/* Android Status Bar */}
        <div className="h-7 bg-slate-950/80 px-4 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none border-b border-slate-800/40 shrink-0">
          <span>09:41</span>
          {/* Camera punch-hole */}
          <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 mx-auto" />
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Top App Bar (Material 3 style) */}
        <div className="px-3 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-slate-200 truncate max-w-[170px]">
              {appName}
            </span>
          </div>
          {typeof recompositionCount === 'number' && (
            <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-950/40 border border-amber-800/60 px-1.5 py-0.5 rounded">
              <span className="text-slate-400">Recomps:</span>
              <span className="font-bold tabular-nums">{recompositionCount}</span>
            </div>
          )}
        </div>

        {/* Screen Content */}
        <div className="flex-1 overflow-y-auto p-3 bg-[#0d1424] text-slate-100 flex flex-col relative">
          {children}
        </div>

        {/* Android Gesture Bar */}
        <div className="h-4 bg-slate-950/90 flex items-center justify-center shrink-0">
          <div className="w-24 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
