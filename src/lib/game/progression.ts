import { CarSkin, Achievement, PlayerStats, GameSettings } from './types';

export const CAR_SKINS: CarSkin[] = [
  {
    id: 'roadster_red',
    name: 'Signature Red',
    description: 'Iconic metallic multi-coat red with carbon aero accents',
    bodyColor: '#e82127',
    accentColor: '#ff4d52',
    glowColor: '#ff2222',
    unlocked: true,
    unlockCondition: 'Unlocked by default',
    requirementType: 'default',
    requirementValue: 0,
  },
  {
    id: 'cyber_cyan',
    name: 'Neo Cyberpunk',
    description: 'Electric neon cyan with radioactive magenta underglow',
    bodyColor: '#00f0ff',
    accentColor: '#ff007f',
    glowColor: '#00f0ff',
    unlocked: false,
    unlockCondition: 'Score 15+ in a single run',
    requirementType: 'score',
    requirementValue: 15,
  },
  {
    id: 'stealth_matte',
    name: 'Plaid Stealth',
    description: 'Matte carbon black with crimson cyber detailing',
    bodyColor: '#1c1c24',
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
    description: 'Polished hyper-reflective gold with solar plasma exhaust',
    bodyColor: '#ffd700',
    accentColor: '#ff8c00',
    glowColor: '#ffae19',
    unlocked: false,
    unlockCondition: 'Score 30+ in a single run',
    requirementType: 'score',
    requirementValue: 30,
  },
  {
    id: 'spacex_thruster',
    name: 'SpaceX Thruster',
    description: 'Starship pearl white chassis with composite cold gas thrusters',
    bodyColor: '#f0f4f8',
    accentColor: '#0070f3',
    glowColor: '#38bdf8',
    unlocked: false,
    unlockCondition: 'Score 50+ in a single run',
    requirementType: 'score',
    requirementValue: 50,
  },
  {
    id: 'vaporwave',
    name: 'Synthwave Sunset',
    description: 'Retro 80s violet-to-peach gradient with laser reflections',
    bodyColor: '#a855f7',
    accentColor: '#f43f5e',
    glowColor: '#ec4899',
    unlocked: false,
    unlockCondition: 'Complete 20 total flight runs',
    requirementType: 'runs',
    requirementValue: 20,
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

const STATS_STORAGE_KEY = 'roadster_rush_player_stats_v1';
const SETTINGS_STORAGE_KEY = 'roadster_rush_settings_v1';

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
  if (typeof window === 'undefined') {
    return {
      highScore: 0,
      bestDistance: 0,
      totalDistance: 0,
      totalRuns: 0,
      totalOrbs: 0,
      gatesPassed: 0,
      selectedSkinId: 'roadster_red',
      unlockedSkins: ['roadster_red'],
      achievements: {},
    };
  }

  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) {
      return {
        highScore: 0,
        bestDistance: 0,
        totalDistance: 0,
        totalRuns: 0,
        totalOrbs: 0,
        gatesPassed: 0,
        selectedSkinId: 'roadster_red',
        unlockedSkins: ['roadster_red'],
        achievements: {},
      };
    }
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
      lastDailyDate: parsed.lastDailyDate,
      dailyHighScore: Number(parsed.dailyHighScore) || 0,
    };
  } catch {
    return {
      highScore: 0,
      bestDistance: 0,
      totalDistance: 0,
      totalRuns: 0,
      totalOrbs: 0,
      gatesPassed: 0,
      selectedSkinId: 'roadster_red',
      unlockedSkins: ['roadster_red'],
      achievements: {},
    };
  }
}

export function savePlayerStats(stats: PlayerStats) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Storage might be full or disabled
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
  const totalOrbs = currentStats.totalOrbs + results.orbs;
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
    lastDailyDate: results.isDaily ? todayStr : currentStats.lastDailyDate,
    dailyHighScore,
  };

  savePlayerStats(updatedStats);

  return {
    newHighScore,
    newDailyHighScore,
    unlockedSkins: newlyUnlockedSkins,
    unlockedAchievements: newlyUnlockedAchievements,
    updatedStats,
  };
}
