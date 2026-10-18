export type GameState = 'START' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

export interface CarSkin {
  id: string;
  name: string;
  description: string;
  bodyColor: string;
  accentColor: string;
  glowColor: string;
  unlocked: boolean;
  unlockCondition: string;
  requirementType: 'default' | 'score' | 'orbs' | 'runs';
  requirementValue: number;
}

export interface PlayerCar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  rotation: number;
  targetRotation: number;
  isBoosting: boolean;
  boostEnergy: number;
  trail: Array<{ x: number; y: number; alpha: number; size: number }>;
}

export interface ObstaclePylon {
  x: number;
  width: number;
  topHeight: number;
  bottomY: number;
  bottomHeight: number;
  gapSize: number;
  passed: boolean;
  speed: number;
  isOscillating: boolean;
  oscillationOffset: number;
  oscillationSpeed: number;
  oscillationAmplitude: number;
  hasOrb: boolean;
  orbY: number;
  orbCollected: boolean;
  theme: 'laser' | 'cyber' | 'pylon';
}

export interface EnergyOrb {
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  value: number;
  pulsePhase: number;
  sparkleTimer: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  glow: boolean;
  shape?: 'circle' | 'spark' | 'smoke' | 'ring';
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  opacity: number;
  vy: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface PlayerStats {
  highScore: number;
  bestDistance: number;
  totalDistance: number;
  totalRuns: number;
  totalOrbs: number;
  gatesPassed: number;
  selectedSkinId: string;
  unlockedSkins: string[];
  achievements: Record<string, boolean>;
  lastDailyDate?: string;
  dailyHighScore?: number;
}

export interface GameSettings {
  sfxVolume: number;
  musicVolume: number;
  isMuted: boolean;
  crtScanlines: boolean;
  screenShake: boolean;
  reducedMotion: boolean;
  showFps: boolean;
}
