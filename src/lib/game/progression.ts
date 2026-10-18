import {
  CarSkin,
  Achievement,
  Challenge,
  PlayerStats,
  GameSettings,
} from './types';

export const CAR_SKINS: CarSkin[] = [
  {
    id: 'roadster_red',
    name: 'Plasma Red',
    description: 'Signature multi-coat hypercar red with carbon aero splitter',
    bodyColor: '#e82127',
    accentColor: '#ff4d52',
    glowColor: '#ff2222',
    unlocked: true,
    unlockCondition: 'Unlocked by default',
    requirementType: 'default',
    requirementValue: 0,
  },
  {
    id: 'silver_streak',
    name: 'Silver Streak',
    description: 'Liquid metallic mercury finish with electric cyan aerospace trim',
    bodyColor: '#d1d5db',
    accentColor: '#00f0ff',
    glowColor: '#38bdf8',
    unlocked: false,
    unlockCondition: 'Score 10+ in a single flight',
    requirementType: 'score',
    requirementValue: 10,
  },
  {
    id: 'cyber_cyan',
    name: 'Neo Cyan',
    description: 'Radioactive neon cyan chassis with radioactive magenta underglow',
    bodyColor: '#00f0ff',
    accentColor: '#ff007f',
    glowColor: '#00f0ff',
    unlocked: false,
    unlockCondition: 'Score 20+ in a single flight',
    requirementType: 'score',
    requirementValue: 20,
  },
  {
    id: 'stealth_matte',
    name: 'Midnight Plaid',
    description: 'Matte carbon black weave with crimson cyber edge piping',
    bodyColor: '#16161e',
    accentColor: '#ff2d55',
    glowColor: '#ff375f',
    unlocked: false,
    unlockCondition: 'Collect 25 total Energy Orbs',
    requirementType: 'orbs',
    requirementValue: 25,
  },
  {
    id: 'solar_flare',
    name: 'Solar Flare Gold',
    description: 'Polished hyper-reflective gold mirror with solar plasma thrusters',
    bodyColor: '#ffd700',
    accentColor: '#ff8c00',
    glowColor: '#ffae19',
    unlocked: false,
    unlockCondition: 'Score 35+ in a single flight',
    requirementType: 'score',
    requirementValue: 35,
  },
  {
    id: 'vaporwave',
    name: 'Synthwave Sunset',
    description: 'Dual-tone violet-to-peach gradient with laser reflection sheen',
    bodyColor: '#a855f7',
    accentColor: '#f43f5e',
    glowColor: '#ec4899',
    unlocked: false,
    unlockCondition: 'Complete 15 total flight runs',
    requirementType: 'runs',
    requirementValue: 15,
  },
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'survive_30',
    title: 'Iron Glider',
    description: 'Survive in flight for 30 seconds in one run',
    rewardDescription: '+10 Orbs Bonus',
    targetValue: 30,
    currentValue: 0,
    completed: false,
    type: 'survive_time',
  },
  {
    id: 'pass_10',
    title: 'Precision Pilot',
    description: 'Navigate through 10 energy gates in a single flight',
    rewardDescription: '+15 Orbs Bonus',
    targetValue: 10,
    currentValue: 0,
    completed: false,
    type: 'pass_gates_single',
  },
  {
    id: 'collect_15',
    title: 'Plasma Magnet',
    description: 'Collect 15 energy orbs in a single run',
    rewardDescription: '+20 Orbs Bonus',
    targetValue: 15,
    currentValue: 0,
    completed: false,
    type: 'collect_orbs_single',
  },
  {
    id: 'beat_high_score',
    title: 'Break The Limit',
    description: 'Set a brand new Personal Best score',
    rewardDescription: '+25 Orbs Bonus',
    targetValue: 1,
    currentValue: 0,
    completed: false,
    type: 'new_high_score',
  },
  {
    id: 'score_20',
    title: 'Plaid Overdrive',
    description: 'Reach a flight score of 20 or higher',
    rewardDescription: '+30 Orbs Bonus',
    targetValue: 20,
    currentValue: 0,
    completed: false,
    type: 'reach_score',
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_flight',
    title: 'First Ignition',
    description: 'Launch your first Roadster flight',
    icon: '🚀',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'gate_10',
    title: 'Aero Navigator',
    description: 'Pass 10 energy gates in a single run',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'gate_25',
    title: 'Plaid Velocity',
    description: 'Pass 25 energy gates in a single run',
    icon: '🏎️',
    unlocked: false,
    progress: 0,
    maxProgress: 25,
  },
  {
    id: 'gate_50',
    title: 'Quantum Glider',
    description: 'Pass 50 energy gates in a single run',
    icon: '🌌',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
  },
  {
    id: 'orb_collector_10',
    title: 'Core Harvester',
    description: 'Collect 10 energy orbs in one run',
    icon: '🔮',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'total_orbs_50',
    title: 'Supercharged Fleet',
    description: 'Collect 50 total energy orbs across all runs',
    icon: '🔋',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
  },
  {
    id: 'survivor_60',
    title: 'Endurance Legend',
    description: 'Survive in flight for over 60 seconds',
    icon: '⏱️',
    unlocked: false,
    progress: 0,
    maxProgress: 60,
  },
  {
    id: 'skin_collector',
    title: 'Hypercar Garage',
    description: 'Unlock 3 or more Roadster skins',
    icon: '🎨',
    unlocked: false,
    progress: 1,
    maxProgress: 3,
  },
  {
    id: 'daily_champ',
    title: 'Daily Pioneer',
    description: 'Complete a run in the seeded Daily Challenge',
    icon: '📅',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
];

const STATS_STORAGE_KEY = 'roadster_rush_player_stats_v2';
const SETTINGS_STORAGE_KEY = 'roadster_rush_settings_v2';

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getDailySeed(): number {
  const dateStr = getTodayDateString();
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function loadPlayerStats(): PlayerStats {
  const defaults: PlayerStats = {
    highScore: 0,
    bestDistance: 0,
    totalDistance: 0,
    totalRuns: 0,
    totalOrbs: 0,
    gatesPassed: 0,
    selectedSkinId: 'roadster_red',
    unlockedSkins: ['roadster_red'],
    achievements: {},
    completedChallenges: {},
    tutorialCompleted: false,
  };

  if (typeof window === 'undefined') return defaults;

  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return {
      highScore: Number(parsed.highScore) || 0,
      bestDistance: Number(parsed.bestDistance) || 0,
      totalDistance: Number(parsed.totalDistance) || 0,
      totalRuns: Number(parsed.totalRuns) || 0,
      totalOrbs: Number(parsed.totalOrbs) || 0,
      gatesPassed: Number(parsed.gatesPassed) || 0,
      selectedSkinId: parsed.selectedSkinId || 'roadster_red',
      unlockedSkins: Array.isArray(parsed.unlockedSkins) && parsed.unlockedSkins.length ? parsed.unlockedSkins : ['roadster_red'],
      achievements: parsed.achievements || {},
      completedChallenges: parsed.completedChallenges || {},
      lastDailyDate: parsed.lastDailyDate,
      dailyHighScore: Number(parsed.dailyHighScore) || 0,
      tutorialCompleted: Boolean(parsed.tutorialCompleted),
    };
  } catch {
    return defaults;
  }
}

export function savePlayerStats(stats: PlayerStats) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Storage quota or disabled
  }
}

export function loadGameSettings(): GameSettings {
  const defaults: GameSettings = {
    sfxVolume: 0.8,
    musicVolume: 0.45,
    isMuted: false,
    crtScanlines: true,
    screenShake: true,
    reducedMotion: false,
    showFps: false,
    graphicsPreset: 'balanced',
    controlProfile: 'arcade',
  };

  if (typeof window === 'undefined') return defaults;

  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export function saveGameSettings(settings: GameSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage quota or disabled
  }
}

export interface RunResults {
  score: number;
  distance: number;
  orbs: number;
  survivalTime: number;
  isDaily: boolean;
}

export interface ProgressionUpdate {
  newHighScore: boolean;
  newDailyHighScore: boolean;
  unlockedSkins: CarSkin[];
  unlockedAchievements: Achievement[];
  completedChallenges: Challenge[];
  updatedStats: PlayerStats;
}

export function processRunEnd(results: RunResults): ProgressionUpdate {
  const currentStats = loadPlayerStats();
  const todayStr = getTodayDateString();

  const newHighScore = results.score > currentStats.highScore;
  const highScore = Math.max(currentStats.highScore, results.score);
  const bestDistance = Math.max(currentStats.bestDistance, results.distance);
  const totalDistance = currentStats.totalDistance + results.distance;
  const totalRuns = currentStats.totalRuns + 1;
  let totalOrbs = currentStats.totalOrbs + results.orbs;
  const gatesPassed = currentStats.gatesPassed + results.score;

  let dailyHighScore = currentStats.dailyHighScore || 0;
  let newDailyHighScore = false;
  if (results.isDaily) {
    if (currentStats.lastDailyDate !== todayStr) {
      dailyHighScore = results.score;
      newDailyHighScore = true;
    } else if (results.score > dailyHighScore) {
      dailyHighScore = results.score;
      newDailyHighScore = true;
    }
  }

  // Check Challenges / Missions
  const newlyCompletedChallenges: Challenge[] = [];
  const completedChallengesRecord = { ...currentStats.completedChallenges };

  INITIAL_CHALLENGES.forEach((ch) => {
    if (completedChallengesRecord[ch.id]) return;

    let satisfied = false;
    if (ch.type === 'survive_time' && results.survivalTime >= ch.targetValue) satisfied = true;
    if (ch.type === 'pass_gates_single' && results.score >= ch.targetValue) satisfied = true;
    if (ch.type === 'collect_orbs_single' && results.orbs >= ch.targetValue) satisfied = true;
    if (ch.type === 'new_high_score' && newHighScore && results.score > 0) satisfied = true;
    if (ch.type === 'reach_score' && results.score >= ch.targetValue) satisfied = true;

    if (satisfied) {
      completedChallengesRecord[ch.id] = true;
      newlyCompletedChallenges.push({ ...ch, completed: true });
      totalOrbs += 15; // Mission bonus reward!
    }
  });

  // Check skins unlock
  const newlyUnlockedSkins: CarSkin[] = [];
  const currentUnlockedSkinIds = new Set(currentStats.unlockedSkins);

  CAR_SKINS.forEach((skin) => {
    if (currentUnlockedSkinIds.has(skin.id)) return;

    let unlocked = false;
    if (skin.requirementType === 'score' && highScore >= skin.requirementValue) {
      unlocked = true;
    } else if (skin.requirementType === 'orbs' && totalOrbs >= skin.requirementValue) {
      unlocked = true;
    } else if (skin.requirementType === 'runs' && totalRuns >= skin.requirementValue) {
      unlocked = true;
    }

    if (unlocked) {
      currentUnlockedSkinIds.add(skin.id);
      newlyUnlockedSkins.push(skin);
    }
  });

  // Check achievements
  const newlyUnlockedAchievements: Achievement[] = [];
  const achievementsRecord = { ...currentStats.achievements };

  INITIAL_ACHIEVEMENTS.forEach((ach) => {
    if (achievementsRecord[ach.id]) return;

    let unlocked = false;
    if (ach.id === 'first_flight' && totalRuns >= 1) unlocked = true;
    if (ach.id === 'gate_10' && results.score >= 10) unlocked = true;
    if (ach.id === 'gate_25' && results.score >= 25) unlocked = true;
    if (ach.id === 'gate_50' && results.score >= 50) unlocked = true;
    if (ach.id === 'orb_collector_10' && results.orbs >= 10) unlocked = true;
    if (ach.id === 'total_orbs_50' && totalOrbs >= 50) unlocked = true;
    if (ach.id === 'survivor_60' && results.survivalTime >= 60) unlocked = true;
    if (ach.id === 'skin_collector' && currentUnlockedSkinIds.size >= 3) unlocked = true;
    if (ach.id === 'daily_champ' && results.isDaily && results.score > 0) unlocked = true;

    if (unlocked) {
      achievementsRecord[ach.id] = true;
      newlyUnlockedAchievements.push({ ...ach, unlocked: true });
    }
  });

  const updatedStats: PlayerStats = {
    highScore,
    bestDistance,
    totalDistance,
    totalRuns,
    totalOrbs,
    gatesPassed,
    selectedSkinId: currentStats.selectedSkinId,
    unlockedSkins: Array.from(currentUnlockedSkinIds),
    achievements: achievementsRecord,
    completedChallenges: completedChallengesRecord,
    lastDailyDate: results.isDaily ? todayStr : currentStats.lastDailyDate,
    dailyHighScore,
    tutorialCompleted: currentStats.tutorialCompleted,
  };

  savePlayerStats(updatedStats);

  return {
    newHighScore,
    newDailyHighScore,
    unlockedSkins: newlyUnlockedSkins,
    unlockedAchievements: newlyUnlockedAchievements,
    completedChallenges: newlyCompletedChallenges,
    updatedStats,
  };
}
