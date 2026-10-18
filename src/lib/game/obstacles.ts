import { ObstaclePylon, EnergyOrb, ObstacleFamily } from './types';
import { WORLD_WIDTH, WORLD_HEIGHT } from './physics';

export const OBSTACLE_CONFIG = {
  pylonWidth: 64,
  initialSpacing: 360,
  minSpacing: 290,
  baseSpeed: 230,
  maxSpeed: 350,
  initialGap: 195,
  minGap: 160,
  minPylonHeight: 65,
  oscillationStartScore: 9,
  maxVerticalDeltaBetweenGates: 170, // Prevents impossible cliff-drops or steep spikes
};

// Seeded pseudorandom number generator for Daily Challenge
export class SeededRNG {
  private state: number;

  constructor(seed: number) {
    this.state = seed % 2147483647;
    if (this.state <= 0) this.state += 2147483646;
  }

  public next(): number {
    this.state = (this.state * 16807) % 2147483647;
    return (this.state - 1) / 2147483646;
  }
}

export function calculateGameSpeed(score: number): number {
  const progress = Math.min(1, score / 45);
  return OBSTACLE_CONFIG.baseSpeed + progress * (OBSTACLE_CONFIG.maxSpeed - OBSTACLE_CONFIG.baseSpeed);
}

export function calculateGapSize(score: number, family: ObstacleFamily): number {
  if (family === 'bonus_gate') {
    return 215; // Generous gap for bonus gate
  }
  if (family === 'cyber_tunnel') {
    return Math.max(165, OBSTACLE_CONFIG.initialGap - 20 - Math.min(15, score * 0.4));
  }
  const progress = Math.min(1, score / 40);
  return OBSTACLE_CONFIG.initialGap - progress * (OBSTACLE_CONFIG.initialGap - OBSTACLE_CONFIG.minGap);
}

// Select appropriate obstacle family based on current flight progression
export function selectObstacleFamily(score: number, rng: () => number): ObstacleFamily {
  const roll = rng();

  // Occasional bonus gate with golden plasma cores
  if (score > 3 && roll < 0.14) {
    return 'bonus_gate';
  }

  if (score < 6) {
    return 'quantum_gate';
  } else if (score < 14) {
    return roll < 0.5 ? 'quantum_gate' : 'neon_pylon';
  } else if (score < 24) {
    if (roll < 0.35) return 'quantum_gate';
    if (roll < 0.70) return 'neon_pylon';
    return 'floating_barrier';
  } else {
    // Advanced flight gauntlet
    if (roll < 0.25) return 'quantum_gate';
    if (roll < 0.50) return 'neon_pylon';
    if (roll < 0.75) return 'floating_barrier';
    return 'cyber_tunnel';
  }
}

export function generatePylon(
  spawnX: number,
  score: number,
  previousCenterY?: number,
  rngInstance?: SeededRNG
): ObstaclePylon {
  const random = rngInstance ? () => rngInstance.next() : Math.random;
  const family = selectObstacleFamily(score, random);
  const gapSize = calculateGapSize(score, family);
  const minH = OBSTACLE_CONFIG.minPylonHeight;
  const maxTopH = WORLD_HEIGHT - gapSize - minH - 35; // 35px safety buffer for ground deck

  // Calculate target center Y constrained by previous gate center (fair obstacle succession)
  let targetCenterY: number;
  if (previousCenterY !== undefined) {
    const maxDelta = OBSTACLE_CONFIG.maxVerticalDeltaBetweenGates;
    const minCenter = Math.max(minH + gapSize / 2, previousCenterY - maxDelta);
    const maxCenter = Math.min(WORLD_HEIGHT - 35 - gapSize / 2, previousCenterY + maxDelta);
    targetCenterY = minCenter + random() * (maxCenter - minCenter);
  } else {
    targetCenterY = minH + gapSize / 2 + random() * (maxTopH - minH);
  }

  const topHeight = Math.max(minH, targetCenterY - gapSize / 2);
  const bottomY = topHeight + gapSize;
  const bottomHeight = WORLD_HEIGHT - bottomY;

  // Decide if obstacle oscillates vertically (from score >= 9)
  const isOscillating =
    family !== 'bonus_gate' &&
    score >= OBSTACLE_CONFIG.oscillationStartScore &&
    random() > (score > 20 ? 0.45 : 0.65);

  const oscillationSpeed = 1.1 + random() * 1.3;
  const oscillationAmplitude = isOscillating ? 22 + Math.min(26, score * 0.7) : 0;
  const warningBeacon = isOscillating || family === 'cyber_tunnel';

  // Has energy orb (100% on bonus_gate, 45% on normal)
  const hasOrb = family === 'bonus_gate' ? true : random() > 0.45;
  const orbYOffset = (random() - 0.5) * (gapSize * 0.3);
  const orbY = topHeight + gapSize / 2 + orbYOffset;

  const theme: 'laser' | 'cyber' | 'pylon' =
    family === 'bonus_gate' ? 'laser' : family === 'neon_pylon' ? 'pylon' : 'cyber';

  return {
    x: spawnX,
    width: OBSTACLE_CONFIG.pylonWidth,
    topHeight,
    bottomY,
    bottomHeight,
    gapSize,
    passed: false,
    speed: calculateGameSpeed(score),
    isOscillating,
    oscillationOffset: random() * Math.PI * 2,
    oscillationSpeed,
    oscillationAmplitude,
    hasOrb,
    orbY,
    orbCollected: false,
    theme,
    family,
    warningBeacon,
  };
}

export function updateObstacles(
  obstacles: ObstaclePylon[],
  orbs: EnergyOrb[],
  dt: number,
  currentScore: number,
  gameTime: number,
  rng?: SeededRNG
): { updatedObstacles: ObstaclePylon[]; updatedOrbs: EnergyOrb[]; newSpawnsPassed: number } {
  const currentSpeed = calculateGameSpeed(currentScore);
  const updatedObstacles: ObstaclePylon[] = [];
  const updatedOrbs: EnergyOrb[] = [];

  // Update existing obstacles
  for (let i = 0; i < obstacles.length; i++) {
    const ob = obstacles[i];
    ob.x -= currentSpeed * dt;

    // Apply vertical oscillation if enabled
    if (ob.isOscillating) {
      const deltaY = Math.sin(gameTime * ob.oscillationSpeed + ob.oscillationOffset) * ob.oscillationAmplitude * dt;
      const safeMargin = 45;
      if (ob.topHeight + deltaY > safeMargin && ob.bottomY + deltaY < WORLD_HEIGHT - safeMargin) {
        ob.topHeight += deltaY;
        ob.bottomY += deltaY;
        if (!ob.orbCollected) {
          ob.orbY += deltaY;
        }
      }
    }

    // Keep if not off screen
    if (ob.x + ob.width > -60) {
      updatedObstacles.push(ob);
    }
  }

  // Update standalone orbs
  for (let i = 0; i < orbs.length; i++) {
    const orb = orbs[i];
    orb.x -= currentSpeed * dt;
    orb.pulsePhase += dt * 4.5;
    if (orb.x + orb.radius > -40 && !orb.collected) {
      updatedOrbs.push(orb);
    }
  }

  // Spawn new obstacles as needed to keep world populated
  const lastObstacle = updatedObstacles[updatedObstacles.length - 1];
  const rightmostX = lastObstacle ? lastObstacle.x : 0;
  const previousCenterY = lastObstacle ? lastObstacle.topHeight + lastObstacle.gapSize / 2 : undefined;

  const spacing = Math.max(
    OBSTACLE_CONFIG.minSpacing,
    OBSTACLE_CONFIG.initialSpacing - Math.min(65, currentScore * 1.5)
  );

  if (rightmostX < WORLD_WIDTH + 220) {
    const spawnX = Math.max(WORLD_WIDTH + 110, rightmostX + spacing);
    const newOb = generatePylon(spawnX, currentScore, previousCenterY, rng);
    updatedObstacles.push(newOb);

    if (newOb.hasOrb) {
      const isSuper = newOb.family === 'bonus_gate';
      updatedOrbs.push({
        x: newOb.x + newOb.width / 2,
        y: newOb.orbY,
        radius: isSuper ? 15 : 12,
        collected: false,
        value: isSuper ? 10 : 5,
        pulsePhase: 0,
        sparkleTimer: 0,
        type: isSuper ? 'super' : 'standard',
      });
    }
  }

  return {
    updatedObstacles,
    updatedOrbs,
    newSpawnsPassed: 0,
  };
}
