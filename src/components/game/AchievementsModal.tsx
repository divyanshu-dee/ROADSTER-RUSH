'use client';

import React from 'react';
import { X, Trophy, CheckCircle2, Lock } from 'lucide-react';
import { INITIAL_ACHIEVEMENTS } from '@/lib/game/progression';
import { PlayerStats } from '@/lib/game/types';
import { soundManager } from '@/lib/game/audio';

interface AchievementsModalProps {
  stats: PlayerStats;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ stats, onClose }) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900/95 border border-slate-700/80 rounded-3xl p-4 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col max-h-[90dvh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-xl font-bold font-mono text-white">ACHIEVEMENTS</h2>
              <p className="text-xs font-mono text-slate-400">Milestones and aerospace badges</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            aria-label="Close Achievements"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="touch-scroll flex flex-col gap-2.5 my-4 overflow-y-auto pr-1 py-1">
          {INITIAL_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = Boolean(stats.achievements[ach.id]);

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isUnlocked
                    ? 'bg-slate-950/80 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl p-2 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center">
                    {ach.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-sm text-white">{ach.title}</span>
                      {isUnlocked && (
                        <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold">
                          COMPLETED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{ach.description}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  {isUnlocked ? (
                    <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-all"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
