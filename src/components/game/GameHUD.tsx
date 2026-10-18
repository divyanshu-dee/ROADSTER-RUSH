'use client';

import React from 'react';
import { Volume2, VolumeX, Pause, Sparkles, Navigation } from 'lucide-react';
import { soundManager } from '@/lib/game/audio';

interface GameHUDProps {
  score: number;
  distance: number;
  orbs: number;
  highScore: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  isDaily?: boolean;
  isMobile?: boolean;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  distance,
  orbs,
  highScore,
  isMuted,
  onToggleMute,
  onPause,
  isDaily,
  isMobile = false,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-2 sm:p-4 md:p-6 z-10">
      {/* Top Header Row */}
      <div className="flex items-start justify-between">
        {/* Left: Score & Distance Counters */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Main Score Box */}
          <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            <div className="text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-cyan-400">Score</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-mono tracking-wider drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
              {score}
            </div>
          </div>

          {/* Distance & Orbs Counters - compact on mobile */}
          {isMobile ? (
            <div className="flex flex-col gap-0.5 bg-slate-950/70 backdrop-blur-md border border-slate-700/60 rounded-lg px-2 py-1">
              <div className="flex items-center gap-1 text-[10px] text-slate-300 font-mono">
                <Navigation className="w-3 h-3 text-cyan-400" />
                <span>{distance}m</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-amber-300 font-mono">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{orbs}</span>
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex flex-col gap-1.5 bg-slate-950/70 backdrop-blur-md border border-slate-700/60 rounded-xl px-3 py-1.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                <span>{distance} m</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{orbs} Orbs</span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Daily Badge or High Score record badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {isDaily && (
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 backdrop-blur-md rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-amber-300 tracking-wider flex items-center gap-1">
              <span>{isMobile ? '📅 DAILY' : '📅 DAILY CHALLENGE'}</span>
            </div>
          )}
          {score > highScore && highScore > 0 && (
            <div className="animate-pulse bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/60 backdrop-blur-md rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-emerald-300 tracking-wider">
              🏆 {isMobile ? 'RECORD!' : 'NEW RECORD!'}
            </div>
          )}
        </div>

        {/* Right: Quick Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Audio Mute Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleMute();
            }}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700/60 hover:border-cyan-500/60 backdrop-blur-md transition-all shadow-md active:scale-95"
            title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Pause Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onPause();
            }}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700/60 hover:border-cyan-500/60 backdrop-blur-md transition-all shadow-md active:scale-95"
            title="Pause (Esc)"
            aria-label="Pause Game"
          >
            <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="flex justify-between items-end text-[9px] sm:text-[11px] text-slate-400/80 font-mono">
        <div className="hidden md:block">
          HOLD OR TAP [SPACE] / [CLICK] TO FIRE QUAD THRUSTERS • [ESC] PAUSE
        </div>
        {isMobile && (
          <div className="block md:hidden text-slate-500/60 text-[9px]">
            TAP & HOLD TO BOOST
          </div>
        )}
        <div className="text-right">
          BEST: <span className="text-cyan-400 font-bold">{highScore}</span>
        </div>
      </div>
    </div>
  );
};
