export type GameState = 'START' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

export type GraphicsPreset = 'quality' | 'balanced' | 'performance';
export type ControlProfile = 'arcade' | 'casual';

export type ObstacleFamily =
  | 'quantum_gate'     // Pulsing high-energy laser beam
  | 'neon_pylon'       // Cyber-grid industrial pillar with hazard chevrons
  | 'floating_barrier' // Hovering quantum barrier blocks
  | 'cyber_tunnel'     // Narrow speed corridor section
  | 'bonus_gate';      // Golden archway with guaranteed energy cores

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
  thrustPower: number; // 0.0 to 1.0 for dynamic plume length & brightness
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
  family: ObstacleFamily;
  warningBeacon?: boolean;
}

export interface EnergyOrb {
  x: number;
  y: number;
  radius: number;
  collected: boolean;
  value: number;
  pulsePhase: number;
  sparkleTimer: number;
  type?: 'standard' | 'super';
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
  shape?: 'circle' | 'spark' | 'smoke' | 'ring' | 'diamond' | 'vapor';
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

export interface Challenge {
  id: string;
  title: string;
  description: string;
  rewardDescription: string;
  targetValue: number;
  currentValue: number;
  completed: boolean;
  type: 'survive_time' | 'pass_gates_single' | 'collect_orbs_single' | 'new_high_score' | 'reach_score';
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
  completedChallenges: Record<string, boolean>;
  lastDailyDate?: string;
  dailyHighScore?: number;
  tutorialCompleted: boolean;
}

export interface GameSettings {
  sfxVolume: number;
  musicVolume: number;
  isMuted: boolean;
  crtScanlines: boolean;
  screenShake: boolean;
  reducedMotion: boolean;
  showFps: boolean;
  graphicsPreset: GraphicsPreset;
  controlProfile: ControlProfile;
}
