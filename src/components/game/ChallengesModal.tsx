'use client';

import React from 'react';
import { X, Target, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { INITIAL_CHALLENGES } from '@/lib/game/progression';
import { PlayerStats } from '@/lib/game/types';
import { soundManager } from '@/lib/game/audio';

interface ChallengesModalProps {
  stats: PlayerStats;
  onClose: () => void;
}

export const ChallengesModal: React.FC<ChallengesModalProps> = ({ stats, onClose }) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900/95 border border-slate-700/80 rounded-3xl p-4 sm:p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col max-h-[90dvh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-xl font-bold font-mono text-white">ACTIVE MISSIONS</h2>
              <p className="text-xs font-mono text-slate-400">Complete challenges to earn bonus plasma cores</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            aria-label="Close Missions"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Missions List */}
        <div className="touch-scroll flex flex-col gap-3 my-4 overflow-y-auto pr-1 py-1">
          {INITIAL_CHALLENGES.map((ch) => {
            const isCompleted = Boolean(stats.completedChallenges[ch.id]);

            return (
              <div
                key={ch.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-slate-950/80 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                      isCompleted
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                        : 'bg-slate-800/80 border-slate-700 text-cyan-400'
                    }`}
                  >
                    <Target className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-sm text-white">{ch.title}</span>
                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">
                          COMPLETED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{ch.description}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-mono mt-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Reward: {ch.rewardDescription}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-slate-500" />
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
