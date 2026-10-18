'use client';

import React, { useEffect, useState } from 'react';
import { RotateCcw, Home, Share2, Trophy, Sparkles, Navigation, Clock, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProgressionUpdate } from '@/lib/game/progression';
import { soundManager } from '@/lib/game/audio';

interface GameOverScreenProps {
  runStats: {
    score: number;
    distance: number;
    orbs: number;
    time: number;
  };
  progressionUpdate: ProgressionUpdate | null;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  runStats,
  progressionUpdate,
  onRestart,
  onHome,
}) => {
  const [copied, setCopied] = useState(false);
  const isHighScore = progressionUpdate?.newHighScore ?? false;

  useEffect(() => {
    // Fire celebratory confetti if high score was achieved
    if (isHighScore) {
      soundManager.playAchievement();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#ff007f', '#ffd700', '#ffffff'],
        });
      } catch {
        // Ignored
      }
    }
  }, [isHighScore]);

  const handleShare = async () => {
    soundManager.playClick();
    const shareText = `🚀 I just scored ${runStats.score} points and flew ${runStats.distance}m in ROADSTER RUSH! Can you beat my run?`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ROADSTER RUSH',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignored
    }
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col items-center text-center">
        {/* Status Header */}
        <div className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase mb-1">
          SYSTEM IMPACT • CRITICAL
        </div>
        <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,0,80,0.6)]">
          RUN FINISHED
        </h2>

        {/* High Score Banner */}
        {isHighScore ? (
          <div className="mt-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border border-amber-400/60 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>NEW ALL-TIME RECORD!</span>
          </div>
        ) : (
          <div className="mt-2 text-xs font-mono text-slate-400">
            One more run to beat your best?
          </div>
        )}

        {/* Unlocked Alerts if any */}
        {progressionUpdate && progressionUpdate.unlockedSkins.length > 0 && (
          <div className="mt-3 w-full bg-cyan-950/40 border border-cyan-500/50 rounded-xl p-2.5 text-xs font-mono text-cyan-300 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>UNLOCKED: {progressionUpdate.unlockedSkins[0].name} SKIN!</span>
          </div>
        )}

        {/* Big Score Display */}
        <div className="my-6 flex flex-col items-center">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">Final Score</div>
          <div className="text-6xl sm:text-7xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-300 to-cyan-500 drop-shadow-[0_0_20px_rgba(0,240,255,0.7)]">
            {runStats.score}
          </div>
        </div>

        {/* Run Metrics Grid */}
        <div className="w-full grid grid-cols-3 gap-2.5 mb-6">
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-2.5">
            <div className="text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1">
              <Navigation className="w-3 h-3 text-cyan-400" />
              <span>Distance</span>
            </div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">{runStats.distance}m</div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-2.5">
            <div className="text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Orbs</span>
            </div>
            <div className="text-lg font-bold font-mono text-amber-300 mt-0.5">{runStats.orbs}</div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-2.5">
            <div className="text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Time</span>
            </div>
            <div className="text-lg font-bold font-mono text-slate-300 mt-0.5">{runStats.time}s</div>
          </div>
        </div>

        {/* Primary Action: Instant Restart */}
        <button
          onClick={() => {
            soundManager.playClick();
            onRestart();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-lg font-mono tracking-wider shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:shadow-[0_0_35px_rgba(0,240,255,0.9)] transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>RESTART FLIGHT</span>
        </button>

        {/* Secondary Actions */}
        <div className="w-full grid grid-cols-2 gap-3 mt-3">
          <button
            onClick={handleShare}
            className="py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">COPIED!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>SHARE SCORE</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              onHome();
            }}
            className="py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
