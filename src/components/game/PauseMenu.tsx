'use client';

import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Settings } from 'lucide-react';
import { soundManager } from '@/lib/game/audio';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  onOpenSettings: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestart,
  onHome,
  onOpenSettings,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col items-center text-center">
        <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-1">
          SIMULATION SUSPENDED
        </div>
        <h2 className="text-3xl font-black font-mono tracking-tight text-white mb-6">
          GAME PAUSED
        </h2>

        {/* Buttons Stack */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              onResume();
            }}
            className="w-full py-3.5 px-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black font-mono text-base tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.5)] transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>RESUME (ESC)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onRestart();
            }}
            className="w-full py-3 px-5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 font-mono text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>RESTART RUN</span>
          </button>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={() => {
                soundManager.playClick();
                onToggleMute();
              }}
              className="py-3 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-red-400" />
                  <span>UNMUTE</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span>MUTE (M)</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenSettings();
              }}
              className="py-3 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>SETTINGS</span>
            </button>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onHome();
            }}
            className="w-full mt-2 py-3 px-5 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-800/40 hover:border-red-600/60 text-red-300 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>EXIT TO MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
