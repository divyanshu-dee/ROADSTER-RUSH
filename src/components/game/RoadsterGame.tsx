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
import { SettingsModal } from './SettingsModal';

export const RoadsterGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

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

  // End of run results
  const [lastRunStats, setLastRunStats] = useState<{
    score: number;
    distance: number;
    orbs: number;
    time: number;
  }>({ score: 0, distance: 0, orbs: 0, time: 0 });
  const [progressionUpdate, setProgressionUpdate] = useState<ProgressionUpdate | null>(null);

  // Modals
  const [isGarageOpen, setIsGarageOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize Game Engine on Canvas Mount
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(
      canvasRef.current,
      selectedSkin,
      settings,
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
  }, []);

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

  // Handle Controls & Keyboard Bindings
  const handleBoost = useCallback(() => {
    if (gameState === 'PLAYING') {
      engineRef.current?.handleBoostPress();
    } else if (gameState === 'START' && !isGarageOpen && !isAchievementsOpen && !isSettingsOpen) {
      startGame(false);
    } else if (gameState === 'GAMEOVER') {
      restartGame();
    }
  }, [gameState, isGarageOpen, isAchievementsOpen, isSettingsOpen]);

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleBoost();
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

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleBoost, handleBoostRelease, togglePause, toggleMute]);

  // Game Start & Restart Handlers
  const startGame = (daily: boolean = false) => {
    setIsDailyRun(daily);
    setScore(0);
    setDistance(0);
    setOrbs(0);
    setProgressionUpdate(null);

    const dailySeed = daily ? getDailySeed() : undefined;
    engineRef.current?.startCountdown(daily, dailySeed);
  };

  const restartGame = () => {
    setScore(0);
    setDistance(0);
    setOrbs(0);
    setProgressionUpdate(null);
    const dailySeed = isDailyRun ? getDailySeed() : undefined;
    engineRef.current?.startRun(isDailyRun, dailySeed);
  };

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

  return (
    <div className="relative w-full h-full min-h-screen bg-black overflow-hidden select-none flex items-center justify-center">
      {/* 2D / 3D Canvas Game Viewport */}
      <div
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
        onPointerDown={(e) => {
          // If clicking background during play, trigger boost
          if (gameState === 'PLAYING') {
            handleBoost();
          }
        }}
        onPointerUp={(e) => {
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
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
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
            progressionUpdate={progressionUpdate}
            onRestart={restartGame}
            onHome={returnHome}
          />
        )}

        {/* Modals */}
        {isGarageOpen && (
          <GarageModal
            stats={stats}
            selectedSkin={selectedSkin}
            onSelectSkin={handleSelectSkin}
            onClose={() => setIsGarageOpen(false)}
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
      </div>
    </div>
  );
};
