'use client';

import React from 'react';
import { X, Check, Lock, Palette, Sparkles } from 'lucide-react';
import { CAR_SKINS } from '@/lib/game/progression';
import { CarSkin, PlayerStats } from '@/lib/game/types';
import { soundManager } from '@/lib/game/audio';

interface GarageModalProps {
  stats: PlayerStats;
  selectedSkin: CarSkin;
  onSelectSkin: (skin: CarSkin) => void;
  onClose: () => void;
}

export const GarageModal: React.FC<GarageModalProps> = ({
  stats,
  selectedSkin,
  onSelectSkin,
  onClose,
}) => {
  const unlockedSet = new Set(stats.unlockedSkins);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-xl font-bold font-mono text-white">ROADSTER GARAGE</h2>
              <p className="text-xs font-mono text-slate-400">
                Metallic hypercar finishes & quad cold-gas underside thrusters
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            aria-label="Close Garage"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Skins Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4 overflow-y-auto pr-1 py-1">
          {CAR_SKINS.map((skin) => {
            const isUnlocked = unlockedSet.has(skin.id);
            const isSelected = selectedSkin.id === skin.id;

            return (
              <div
                key={skin.id}
                onClick={() => {
                  if (isUnlocked) {
                    soundManager.playClick();
                    onSelectSkin(skin);
                  }
                }}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)] ring-1 ring-cyan-400'
                    : isUnlocked
                    ? 'bg-slate-950/70 border-slate-700/80 hover:border-slate-500 cursor-pointer'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-65 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold font-mono text-sm text-white flex items-center gap-1.5">
                      {skin.name}
                    </span>

                    {isSelected ? (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-[10px] font-mono font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        ACTIVE
                      </span>
                    ) : isUnlocked ? (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
                        READY
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-red-950/40 border border-red-800/50 text-red-400 text-[10px] font-mono flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        LOCKED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 font-mono mb-3">{skin.description}</p>
                </div>

                {/* Color Swatch Preview */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: skin.bodyColor }}
                      title="Body Color"
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: skin.accentColor }}
                      title="Accent Color"
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: skin.glowColor }}
                      title="Glow Color"
                    />
                  </div>

                  {!isUnlocked && (
                    <div className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{skin.unlockCondition}</span>
                    </div>
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
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
