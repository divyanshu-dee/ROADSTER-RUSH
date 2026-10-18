'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from '@/lib/game/engine';
import {
  GameState,
  CarSkin,
  GameSettings,
  PlayerStats,
} from '@/lib/game/types';
import {
  loadPlayerStats,
  savePlayerStats,
  loadGameSettings,
  saveGameSettings,
  CAR_SKINS,
  getDailySeed,
  ProgressionUpdate,
} from '@/lib/game/progression';
import { soundManager } from '@/lib/game/audio';
import { GameHUD } from './GameHUD';
import { StartScreen } from './StartScreen';
import { CountdownOverlay } from './CountdownOverlay';
import { GameOverScreen } from './GameOverScreen';
import { PauseMenu } from './PauseMenu';
import { GarageModal } from './GarageModal';
import { AchievementsModal } from './AchievementsModal';
import { ChallengesModal } from './ChallengesModal';
import { SettingsModal } from './SettingsModal';
import { TutorialOverlay } from './TutorialOverlay';
import { IntroAnimation } from './IntroAnimation';

export const RoadsterGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  // Intro animation state
  const [showIntro, setShowIntro] = useState(true);

  // Reactive UI State
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [orbs, setOrbs] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(3);
  const [isDailyRun, setIsDailyRun] = useState<boolean>(false);

  // Progression & Settings
  const [stats, setStats] = useState<PlayerStats>(() => loadPlayerStats());
  const [settings, setSettings] = useState<GameSettings>(() => loadGameSettings());
  const [selectedSkin, setSelectedSkin] = useState<CarSkin>(() => {
    const initialStats = loadPlayerStats();
    return CAR_SKINS.find((s) => s.id === initialStats.selectedSkinId) || CAR_SKINS[0];
  });
  const settingsRef = useRef(settings);
  const selectedSkinRef = useRef(selectedSkin);

  // End of run results
  const [lastRunStats, setLastRunStats] = useState<{
    score: number;
    distance: number;
    orbs: number;
    time: number;
  }>({ score: 0, distance: 0, orbs: 0, time: 0 });
  const [progressionUpdate, setProgressionUpdate] = useState<ProgressionUpdate | null>(null);

  // Modals & Overlays
  const [isGarageOpen, setIsGarageOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isChallengesOpen, setIsChallengesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(!stats.tutorialCompleted);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle intro completion
  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    selectedSkinRef.current = selectedSkin;
  }, [selectedSkin]);

  // Initialize Game Engine on Canvas Mount (after intro)
  useEffect(() => {
    if (showIntro) return;
    if (!canvasRef.current) return;

    const engine = new GameEngine(
      canvasRef.current,
      selectedSkinRef.current,
      settingsRef.current,
      {
        onScoreUpdate: (curScore, curDistance, curOrbs) => {
          setScore(curScore);
          setDistance(curDistance);
          setOrbs(curOrbs);
        },
        onStateChange: (state) => {
          setGameState(state);
        },
        onGameOver: (update, runMetrics) => {
          setProgressionUpdate(update);
          setLastRunStats(runMetrics);
          setStats(update.updatedStats);
        },
        onCountdownTick: (count) => {
          setCountdown(count);
        },
      }
    );

    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [showIntro]);

  // Update Engine when Skin Changes
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setSkin(selectedSkin);
    }
  }, [selectedSkin]);

  // Update Engine when Settings Change
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateSettings(settings);
    }
    saveGameSettings(settings);
  }, [settings]);

  // Game Start & Restart Handlers
  const startGame = useCallback((daily: boolean = false) => {
    setIsDailyRun(daily);
    setScore(0);
    setDistance(0);
    setOrbs(0);
    setProgressionUpdate(null);

    const dailySeed = daily ? getDailySeed() : undefined;
    engineRef.current?.startCountdown(daily, dailySeed);
  }, []);

  const restartGame = useCallback(() => {
    setScore(0);
    setDistance(0);
    setOrbs(0);
    setProgressionUpdate(null);
    const dailySeed = isDailyRun ? getDailySeed() : undefined;
    engineRef.current?.startRun(isDailyRun, dailySeed);
  }, [isDailyRun]);

  // Handle Controls & Keyboard Bindings
  const handleBoost = useCallback((isTouch: boolean = false) => {
    if (gameState === 'PLAYING') {
      engineRef.current?.handleBoostPress(isTouch);
    } else if (
      gameState === 'START' &&
      !isGarageOpen &&
      !isAchievementsOpen &&
      !isChallengesOpen &&
      !isSettingsOpen &&
      !showTutorial
    ) {
      startGame(false);
    } else if (gameState === 'GAMEOVER') {
      restartGame();
    }
  }, [gameState, isGarageOpen, isAchievementsOpen, isChallengesOpen, isSettingsOpen, showTutorial, startGame, restartGame]);

  const handleBoostRelease = useCallback(() => {
    if (gameState === 'PLAYING') {
      engineRef.current?.handleBoostRelease();
    }
  }, [gameState]);

  const toggleMute = useCallback(() => {
    setSettings((prev) => {
      const updated = { ...prev, isMuted: !prev.isMuted };
      soundManager.setMuted(updated.isMuted);
      return updated;
    });
  }, []);

  const togglePause = useCallback(() => {
    if (gameState === 'PLAYING') {
      engineRef.current?.pause();
    } else if (gameState === 'PAUSED') {
      engineRef.current?.resume();
    }
  }, [gameState]);

  useEffect(() => {
    if (showIntro) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleBoost(false);
      } else if (e.code === 'Escape' || e.key.toLowerCase() === 'p') {
        e.preventDefault();
        togglePause();
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleMute();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleBoostRelease();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('pointerup', handleBoostRelease);
    window.addEventListener('blur', handleBoostRelease);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('pointerup', handleBoostRelease);
      window.removeEventListener('blur', handleBoostRelease);
    };
  }, [showIntro, handleBoost, handleBoostRelease, togglePause, toggleMute]);

  const returnHome = () => {
    engineRef.current?.pause();
    setGameState('START');
    setScore(0);
    setDistance(0);
    setOrbs(0);
    const freshStats = loadPlayerStats();
    setStats(freshStats);
  };

  const handleSelectSkin = (skin: CarSkin) => {
    setSelectedSkin(skin);
    const updatedStats = { ...stats, selectedSkinId: skin.id };
    setStats(updatedStats);
    savePlayerStats(updatedStats);
  };

  const handleDismissTutorial = () => {
    setShowTutorial(false);
    const updated = { ...stats, tutorialCompleted: true };
    setStats(updated);
    savePlayerStats(updated);
  };

  // Show intro animation first
  if (showIntro) {
    return <IntroAnimation onComplete={handleIntroComplete} />;
  }

  return (
    <div className="relative w-full h-full min-h-[100dvh] bg-black overflow-hidden select-none flex items-center justify-center">
      {/* 2D / 3D Canvas Game Viewport */}
      <div
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
        onPointerDown={(e) => {
          if (gameState === 'PLAYING') {
            handleBoost(e.pointerType === 'touch');
          }
        }}
        onPointerUp={() => {
          if (gameState === 'PLAYING') {
            handleBoostRelease();
          }
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block touch-none"
        />

        {/* Retro CRT Scanlines & Vignette Layer */}
        {settings.crtScanlines && (
          <div className="absolute inset-0 pointer-events-none z-10 crt-overlay opacity-50" />
        )}

        {/* Active In-Game HUD */}
        {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
          <GameHUD
            score={score}
            distance={distance}
            orbs={orbs}
            highScore={stats.highScore}
            isMuted={settings.isMuted}
            onToggleMute={toggleMute}
            onPause={togglePause}
            isDaily={isDailyRun}
            isMobile={isMobile}
          />
        )}

        {/* 3-2-1 Countdown Overlay */}
        {gameState === 'COUNTDOWN' && <CountdownOverlay count={countdown} />}

        {/* Start / Intro Screen */}
        {gameState === 'START' && (
          <StartScreen
            stats={stats}
            selectedSkin={selectedSkin}
            onStartGame={() => startGame(false)}
            onStartDaily={() => startGame(true)}
            onOpenGarage={() => setIsGarageOpen(true)}
            onOpenChallenges={() => setIsChallengesOpen(true)}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenTutorial={() => setShowTutorial(true)}
            isMobile={isMobile}
          />
        )}

        {/* Pause Menu Overlay */}
        {gameState === 'PAUSED' && (
          <PauseMenu
            onResume={togglePause}
            onRestart={restartGame}
            onHome={returnHome}
            onOpenSettings={() => setIsSettingsOpen(true)}
            isMuted={settings.isMuted}
            onToggleMute={toggleMute}
          />
        )}

        {/* Game Over Screen */}
        {gameState === 'GAMEOVER' && (
          <GameOverScreen
            runStats={lastRunStats}
            selectedSkin={selectedSkin}
            progressionUpdate={progressionUpdate}
            onRestart={restartGame}
            onHome={returnHome}
          />
        )}

        {/* Modals & Overlays */}
        {showTutorial && <TutorialOverlay onDismiss={handleDismissTutorial} />}

        {isGarageOpen && (
          <GarageModal
            stats={stats}
            selectedSkin={selectedSkin}
            onSelectSkin={handleSelectSkin}
            onClose={() => setIsGarageOpen(false)}
          />
        )}

        {isChallengesOpen && (
          <ChallengesModal
            stats={stats}
            onClose={() => setIsChallengesOpen(false)}
          />
        )}

        {isAchievementsOpen && (
          <AchievementsModal
            stats={stats}
            onClose={() => setIsAchievementsOpen(false)}
          />
        )}

        {isSettingsOpen && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={setSettings}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}

        {/* Mobile Boost Button - Large tap zone at bottom for gameplay */}
        {isMobile && gameState === 'PLAYING' && (
          <div
            className="absolute bottom-0 left-0 right-0 h-[40%] z-[5] pointer-events-auto"
            onTouchStart={(e) => {
              e.preventDefault();
              handleBoost(true);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleBoostRelease();
            }}
            style={{ touchAction: 'none' }}
          >
            {/* Visual hint for touch area */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/30 text-[10px] font-mono tracking-widest pointer-events-none">
              TAP & HOLD TO BOOST
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
