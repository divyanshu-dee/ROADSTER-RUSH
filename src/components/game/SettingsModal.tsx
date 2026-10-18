'use client';

import React from 'react';
import { X, Volume2, VolumeX, Tv, Sparkles, Eye, Sliders } from 'lucide-react';
import { GameSettings } from '@/lib/game/types';
import { soundManager } from '@/lib/game/audio';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (settings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const updateSetting = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    const updated = { ...settings, [key]: value };
    onUpdateSettings(updated);
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900/95 border border-slate-700/80 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-xl font-bold font-mono text-white">SETTINGS</h2>
              <p className="text-xs font-mono text-slate-400">Audio, graphics, and gameplay preferences</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            aria-label="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex flex-col gap-4 my-4 overflow-y-auto pr-1 py-1">
          {/* Audio Section */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-3.5">
            <div className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
              Audio Settings
            </div>

            {/* Mute Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-mono text-slate-200">
                {settings.isMuted ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                )}
                <span>Mute All Sounds</span>
              </div>
              <input
                type="checkbox"
                checked={settings.isMuted}
                onChange={(e) => updateSetting('isMuted', e.target.checked)}
                className="w-5 h-5 accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* SFX Volume */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Sound Effects (Thrusters, Orbs, Collisions)</span>
                <span>{Math.round(settings.sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.sfxVolume}
                disabled={settings.isMuted}
                onChange={(e) => updateSetting('sfxVolume', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer disabled:opacity-40"
              />
            </div>

            {/* Music Volume */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Synthwave Music Loop</span>
                <span>{Math.round(settings.musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.musicVolume}
                disabled={settings.isMuted}
                onChange={(e) => updateSetting('musicVolume', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer disabled:opacity-40"
              />
            </div>
          </div>

          {/* Graphics & Accessibility Section */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-3.5">
            <div className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
              Visuals & Accessibility
            </div>

            {/* CRT Scanlines */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-mono text-slate-200">
                <Tv className="w-4 h-4 text-purple-400" />
                <span>Retro CRT Scanlines Overlay</span>
              </div>
              <input
                type="checkbox"
                checked={settings.crtScanlines}
                onChange={(e) => updateSetting('crtScanlines', e.target.checked)}
                className="w-5 h-5 accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Screen Shake */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-mono text-slate-200">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Screen Shake on Impact</span>
              </div>
              <input
                type="checkbox"
                checked={settings.screenShake}
                onChange={(e) => updateSetting('screenShake', e.target.checked)}
                className="w-5 h-5 accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-mono text-slate-200">
                <Eye className="w-4 h-4 text-emerald-400" />
                <span>Reduced Motion</span>
              </div>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                className="w-5 h-5 accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Controls Quick Reference */}
          <div className="bg-slate-950/40 border border-slate-800/60 rounded-2xl p-4 text-xs font-mono text-slate-400 flex flex-col gap-1.5">
            <div className="text-[10px] font-bold text-slate-300 uppercase">Input Controls</div>
            <div>• <strong className="text-cyan-300">Space / Arrow Up / Click / Tap:</strong> Rocket Boost</div>
            <div>• <strong className="text-cyan-300">Esc / P:</strong> Pause / Resume</div>
            <div>• <strong className="text-cyan-300">M:</strong> Toggle Audio Mute</div>
          </div>
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
            SAVE & CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
