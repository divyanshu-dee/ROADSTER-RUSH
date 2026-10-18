'use client';

import React, { useState } from 'react';
import {
  Play,
  Calendar,
  Palette,
  Trophy,
  Settings,
  Sparkles,
  Navigation,
  Flame,
  Target,
  HelpCircle,
} from 'lucide-react';
import { PlayerStats, CarSkin } from '@/lib/game/types';
import { INITIAL_CHALLENGES } from '@/lib/game/progression';
import { soundManager } from '@/lib/game/audio';

interface StartScreenProps {
  stats: PlayerStats;
  selectedSkin: CarSkin;
  onStartGame: () => void;
  onStartDaily: () => void;
  onOpenGarage: () => void;
  onOpenChallenges: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
  onOpenTutorial: () => void;
  isMobile?: boolean;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  stats,
  selectedSkin,
  onStartGame,
  onStartDaily,
  onOpenGarage,
  onOpenChallenges,
  onOpenAchievements,
  onOpenSettings,
  onOpenTutorial,
  isMobile = false,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Find next uncompleted mission
  const nextChallenge = INITIAL_CHALLENGES.find((ch) => !stats.completedChallenges[ch.id]) || INITIAL_CHALLENGES[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return; // Skip parallax on mobile for performance
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX / width - 0.5) * 16;
    const y = (clientY / height - 0.5) * 16;
    setMousePos({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="touch-scroll absolute inset-0 z-20 flex flex-col items-center justify-between p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-b from-slate-950/75 via-slate-900/60 to-slate-950/85 backdrop-blur-sm select-none overflow-y-auto animate-in fade-in duration-500"
      style={{ minHeight: '100dvh' }}
    >
      {/* Top Header Row */}
      <div className="w-full max-w-4xl flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            {isMobile ? 'v2.0' : 'Pixel Velocity Engine v2.0'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Tutorial / Help Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenTutorial();
            }}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700/60 text-xs font-mono transition-all active:scale-95"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenSettings();
            }}
            className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700/60 text-xs font-mono transition-all active:scale-95"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* Hero Center Section with interactive parallax tilt */}
      <div
        className="start-screen-hero flex flex-col items-center text-center my-auto py-2 sm:py-3 max-w-xl transition-transform duration-200 ease-out w-full"
        style={{
          transform: isMobile ? 'none' : `perspective(1000px) rotateY(${mousePos.x * 0.4}deg) rotateX(${-mousePos.y * 0.4}deg)`,
        }}
      >
        {/* Subtitle Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] sm:text-xs font-mono tracking-widest uppercase mb-1.5 sm:mb-2">
          <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden xs:inline">A Cinematic 3D Flappy Car Adventure</span>
          <span className="xs:hidden">Flappy Car Adventure</span>
        </div>

        {/* Main Logo */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-cyan-500 drop-shadow-[0_0_25px_rgba(0,240,255,0.7)] font-mono leading-tight">
          ROADSTER<span className="text-cyan-400">RUSH</span>
        </h1>

        {/* Selected Vehicle Tag */}
        <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-mono text-slate-300 flex items-center gap-1.5 sm:gap-2">
          <span>EQUIPPED:</span>
          <span
            className="font-bold px-2 sm:px-3 py-0.5 rounded-full border text-[10px] sm:text-xs shadow-md"
            style={{
              borderColor: selectedSkin.glowColor,
              color: selectedSkin.accentColor,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
          >
            {selectedSkin.name}
          </span>
        </div>

        {/* Active Mission Preview Pill */}
        {nextChallenge && !isMobile && (
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenChallenges();
            }}
            className="mt-2 sm:mt-3 inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 text-xs font-mono text-slate-300 transition-all shadow-sm active:scale-95"
          >
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              MISSION: <strong className="text-white">{nextChallenge.title}</strong>
            </span>
          </button>
        )}

        <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs md:text-sm text-slate-400 max-w-md font-mono tracking-wide px-2">
          {isMobile ? 'TAP & HOLD TO FIRE THRUSTERS' : 'HOLD OR TAP TO FIRE QUAD THRUSTERS. GLIDE TO SURVIVE.'}
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-4 sm:mt-7 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3.5 w-full max-w-md px-2">
          {/* Main Launch Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onStartGame();
            }}
            className="group relative w-full sm:flex-1 py-3.5 sm:py-4 px-5 sm:px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-base sm:text-lg md:text-xl font-mono tracking-wider shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:shadow-[0_0_35px_rgba(0,240,255,0.9)] transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 sm:gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950" />
            <span>{isMobile ? 'PLAY' : 'START ENGINE'}</span>
          </button>

          {/* Daily Challenge Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onStartDaily();
            }}
            className="w-full sm:w-auto py-3 sm:py-4 px-4 sm:px-5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/40 hover:border-amber-400 font-bold text-xs sm:text-sm font-mono tracking-wide shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all active:scale-95 flex items-center justify-center gap-2"
            title="Daily Challenge with seeded track"
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>DAILY RUN</span>
          </button>
        </div>

        {/* Sub-actions: Garage, Missions & Achievements */}
        <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 px-2">
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenGarage();
            }}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-cyan-500/50 text-[10px] sm:text-xs font-mono tracking-wide transition-all flex items-center gap-1 sm:gap-1.5 active:scale-95"
          >
            <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            <span>GARAGE ({stats.unlockedSkins.length}/6)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenChallenges();
            }}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-cyan-500/50 text-[10px] sm:text-xs font-mono tracking-wide transition-all flex items-center gap-1 sm:gap-1.5 active:scale-95"
          >
            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            <span>MISSIONS</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenAchievements();
            }}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 hover:border-amber-500/50 text-[10px] sm:text-xs font-mono tracking-wide transition-all flex items-center gap-1 sm:gap-1.5 active:scale-95"
          >
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span>{isMobile ? 'TROPHIES' : 'ACHIEVEMENTS'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Stats Footer */}
      <div className="start-screen-footer w-full max-w-4xl pt-3 sm:pt-4 border-t border-slate-800/80 flex-shrink-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2.5 text-center">
          <div className="bg-slate-950/60 rounded-xl p-1.5 sm:p-2 border border-slate-800/60">
            <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono uppercase">Personal Best</div>
            <div className="text-lg sm:text-xl font-black text-cyan-400 font-mono">{stats.highScore}</div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-1.5 sm:p-2 border border-slate-800/60">
            <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono uppercase flex items-center justify-center gap-1">
              <Navigation className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>Max Dist</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-slate-200 font-mono">{stats.bestDistance}m</div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-1.5 sm:p-2 border border-slate-800/60">
            <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono uppercase flex items-center justify-center gap-1">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
              <span>Total Orbs</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-amber-300 font-mono">{stats.totalOrbs}</div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-1.5 sm:p-2 border border-slate-800/60">
            <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono uppercase">Total Runs</div>
            <div className="text-lg sm:text-xl font-black text-slate-300 font-mono">{stats.totalRuns}</div>
          </div>
        </div>

        {/* Fan Tribute Disclaimer Notice */}
        <div className="mt-2 sm:mt-3 text-center text-[9px] sm:text-[10px] text-slate-500 font-mono px-2">
          {isMobile
            ? 'ROADSTER RUSH — Independent fan-made arcade game.'
            : 'ROADSTER RUSH is an independent fan-made creative arcade game celebrating electric hypercars and retro-pixel games. Not affiliated with or endorsed by Tesla.'}
        </div>
        <div className="mt-1 text-center text-[9px] sm:text-[10px] text-slate-500 font-mono">
          Made by{' '}
          <a
            href="https://github.com/divyanshu-dee"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
          >
            divyanshu-dee
          </a>
        </div>
      </div>
    </div>
  );
};
