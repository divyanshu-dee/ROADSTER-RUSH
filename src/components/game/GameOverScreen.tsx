'use client';

import React, { useEffect, useState } from 'react';
import {
  RotateCcw,
  Home,
  Share2,
  Trophy,
  Sparkles,
  Navigation,
  Clock,
  Check,
  Target,
  Download,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProgressionUpdate } from '@/lib/game/progression';
import { CarSkin } from '@/lib/game/types';
import { soundManager } from '@/lib/game/audio';

interface GameOverScreenProps {
  runStats: {
    score: number;
    distance: number;
    orbs: number;
    time: number;
  };
  selectedSkin: CarSkin;
  progressionUpdate: ProgressionUpdate | null;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  runStats,
  selectedSkin,
  progressionUpdate,
  onRestart,
  onHome,
}) => {
  const [copied, setCopied] = useState(false);
  const [cardGenerated, setCardGenerated] = useState(false);
  const isHighScore = progressionUpdate?.newHighScore ?? false;

  useEffect(() => {
    // Fire celebratory confetti if high score was achieved
    if (isHighScore) {
      soundManager.playAchievement();
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#ff007f', '#ffd700', '#ffffff'],
        });
      } catch {
        // Ignored
      }
    }
  }, [isHighScore]);

  const handleShareText = async () => {
    soundManager.playClick();
    const shareText = `⚡ ROADSTER RUSH 🚀\nVehicle: ${selectedSkin.name}\nScore: ${runStats.score} | Distance: ${runStats.distance}m | Time: ${runStats.time}s\nCan you beat my flight?`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ROADSTER RUSH — Score Card',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignored
    }
  };

  // Generate a downloadable 600x400 high-res cyber score card image
  const handleDownloadCard = () => {
    soundManager.playClick();
    const c = document.createElement('canvas');
    c.width = 600;
    c.height = 400;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    // Dark cyber gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 400);
    bgGrad.addColorStop(0, '#040714');
    bgGrad.addColorStop(0.5, '#0a102a');
    bgGrad.addColorStop(1, '#050716');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 600, 400);

    // Cyan border frame
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 580, 380);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px monospace';
    ctx.fillText('ROADSTER RUSH', 40, 65);
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('A CINEMATIC 3D FLAPPY CAR ADVENTURE', 40, 90);

    // Line divider
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 105);
    ctx.lineTo(560, 105);
    ctx.stroke();

    // Final Score
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '14px monospace';
    ctx.fillText('FINAL SCORE', 40, 145);
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 64px monospace';
    ctx.fillText(String(runStats.score), 40, 210);

    // Vehicle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '14px monospace';
    ctx.fillText('EQUIPPED HYPERCAR', 300, 145);
    ctx.fillStyle = selectedSkin.accentColor;
    ctx.font = 'bold 22px monospace';
    ctx.fillText(selectedSkin.name, 300, 175);

    // Stats Grid
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '16px monospace';
    ctx.fillText(`Distance: ${runStats.distance}m`, 40, 270);
    ctx.fillText(`Orbs: ${runStats.orbs}`, 40, 305);
    ctx.fillText(`Survival Time: ${runStats.time}s`, 300, 270);

    if (isHighScore) {
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('★ NEW ALL-TIME RECORD! ★', 300, 305);
    }

    // Watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '12px monospace';
    ctx.fillText('Play online at roadster-rush.vercel.app', 40, 360);

    // Download trigger
    const link = document.createElement('a');
    link.download = `roadster-rush-score-${runStats.score}.png`;
    link.href = c.toDataURL('image/png');
    link.click();
    setCardGenerated(true);
    setTimeout(() => setCardGenerated(false), 2500);
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-300 overflow-y-auto" style={{ minHeight: '100dvh' }}>
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-700/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.85)] flex flex-col items-center text-center my-auto">
        {/* Status Header */}
        <div className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase mb-1">
          SYSTEM IMPACT • RUN FINISHED
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,0,80,0.6)]">
          FLIGHT SUMMARY
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

        {/* Unlocked Skin Alerts if any */}
        {progressionUpdate && progressionUpdate.unlockedSkins.length > 0 && (
          <div className="mt-3 w-full bg-cyan-950/40 border border-cyan-500/50 rounded-xl p-2.5 text-xs font-mono text-cyan-300 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>NEW SKIN UNLOCKED: {progressionUpdate.unlockedSkins[0].name.toUpperCase()}!</span>
          </div>
        )}

        {/* Unlocked Mission Alerts if any */}
        {progressionUpdate && progressionUpdate.completedChallenges.length > 0 && (
          <div className="mt-2.5 w-full bg-emerald-950/40 border border-emerald-500/50 rounded-xl p-2.5 text-xs font-mono text-emerald-300 flex items-center justify-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>MISSION COMPLETE: {progressionUpdate.completedChallenges[0].title}! (+15 Orbs)</span>
          </div>
        )}

        {/* Big Score Display */}
        <div className="my-3 sm:my-5 flex flex-col items-center">
          <div className="text-[10px] sm:text-xs font-mono text-slate-400 uppercase tracking-widest">Final Score</div>
          <div className="text-5xl sm:text-6xl md:text-7xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-300 to-cyan-500 drop-shadow-[0_0_20px_rgba(0,240,255,0.7)]">
            {runStats.score}
          </div>
        </div>

        {/* Run Metrics Grid */}
        <div className="w-full grid grid-cols-3 gap-1.5 sm:gap-2.5 mb-3 sm:mb-5">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5">
            <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1">
              <Navigation className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
              <span>Dist</span>
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-white mt-0.5">{runStats.distance}m</div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5">
            <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
              <span>Orbs</span>
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-amber-300 mt-0.5">{runStats.orbs}</div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5">
            <div className="text-[9px] sm:text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1">
              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400" />
              <span>Time</span>
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-slate-300 mt-0.5">{runStats.time}s</div>
          </div>
        </div>

        {/* Primary Action: Instant Restart */}
        <button
          onClick={() => {
            soundManager.playClick();
            onRestart();
          }}
          className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-base sm:text-lg font-mono tracking-wider shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:shadow-[0_0_35px_rgba(0,240,255,0.9)] transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>RESTART FLIGHT</span>
        </button>

        {/* Share & Download Actions */}
        <div className="w-full grid grid-cols-2 gap-2.5 mt-3">
          <button
            onClick={handleShareText}
            className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5"
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
            onClick={handleDownloadCard}
            className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            title="Download graphical score card image"
          >
            {cardGenerated ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">SAVED!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-cyan-400" />
                <span>SCORE CARD</span>
              </>
            )}
          </button>
        </div>

        {/* Main Menu Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onHome();
          }}
          className="w-full mt-2.5 py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>RETURN TO MAIN MENU</span>
        </button>
      </div>
    </div>
  );
};
