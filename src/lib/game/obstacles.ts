import { ObstaclePylon, EnergyOrb } from './types';
import { WORLD_WIDTH, WORLD_HEIGHT } from './physics';

export const OBSTACLE_CONFIG = {
  pylonWidth: 64,
  initialSpacing: 340,
  minSpacing: 280,
  baseSpeed: 230,
  maxSpeed: 360,
  initialGap: 185,
  minGap: 155,
  minPylonHeight: 65,
  oscillationStartScore: 8,
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
  const progress = Math.min(1, score / 40);
  return OBSTACLE_CONFIG.baseSpeed + progress * (OBSTACLE_CONFIG.maxSpeed - OBSTACLE_CONFIG.baseSpeed);
}

export function calculateGapSize(score: number): number {
  const progress = Math.min(1, score / 35);
  return OBSTACLE_CONFIG.initialGap - progress * (OBSTACLE_CONFIG.initialGap - OBSTACLE_CONFIG.minGap);
}

export function generatePylon(
  spawnX: number,
  score: number,
  rng?: SeededRNG
): ObstaclePylon {
  const random = rng ? () => rng.next() : Math.random;
  const gapSize = calculateGapSize(score);
  const minH = OBSTACLE_CONFIG.minPylonHeight;
  const maxTopH = WORLD_HEIGHT - gapSize - minH - 30; // 30px buffer for floor boundary

  // Top height randomized
  const topHeight = minH + random() * (maxTopH - minH);
  const bottomY = topHeight + gapSize;
  const bottomHeight = WORLD_HEIGHT - bottomY;

  // Decide if obstacle oscillates vertically (from score >= 8)
  const isOscillating = score >= OBSTACLE_CONFIG.oscillationStartScore && random() > 0.45;
  const oscillationSpeed = 1.2 + random() * 1.5;
  const oscillationAmplitude = isOscillating ? 25 + Math.min(30, score * 0.8) : 0;

  // Has energy orb (65% chance)
  const hasOrb = random() > 0.35;
  // Orb position slightly randomized around center of gap
  const orbYOffset = (random() - 0.5) * (gapSize * 0.35);
  const orbY = topHeight + gapSize / 2 + orbYOffset;

  const themes: ('laser' | 'cyber' | 'pylon')[] = ['laser', 'cyber', 'pylon'];
  const theme = themes[Math.floor(random() * themes.length)];

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
  let newSpawnsPassed = 0;

  // Move obstacles left
  const updatedObstacles: ObstaclePylon[] = [];
  const updatedOrbs: EnergyOrb[] = [];

  // Update existing obstacles
  for (let i = 0; i < obstacles.length; i++) {
    const ob = obstacles[i];
    ob.x -= currentSpeed * dt;

    // Apply vertical oscillation if enabled
    if (ob.isOscillating) {
      const deltaY = Math.sin(gameTime * ob.oscillationSpeed + ob.oscillationOffset) * ob.oscillationAmplitude * dt;
      // Clamp within safe world bounds
      const safeMargin = 40;
      if (ob.topHeight + deltaY > safeMargin && ob.bottomY + deltaY < WORLD_HEIGHT - safeMargin) {
        ob.topHeight += deltaY;
        ob.bottomY += deltaY;
        if (!ob.orbCollected) {
          ob.orbY += deltaY;
        }
      }
    }

    // Keep if not off screen
    if (ob.x + ob.width > -50) {
      updatedObstacles.push(ob);
    }
  }

  // Update standalone orbs
  for (let i = 0; i < orbs.length; i++) {
    const orb = orbs[i];
    orb.x -= currentSpeed * dt;
    orb.pulsePhase += dt * 4;
    if (orb.x + orb.radius > -30 && !orb.collected) {
      updatedOrbs.push(orb);
    }
  }

  // Spawn new obstacles as needed to keep world populated
  const lastObstacle = updatedObstacles[updatedObstacles.length - 1];
  const rightmostX = lastObstacle ? lastObstacle.x : 0;
  const spacing = Math.max(
    OBSTACLE_CONFIG.minSpacing,
    OBSTACLE_CONFIG.initialSpacing - Math.min(60, currentScore * 1.5)
  );

  if (rightmostX < WORLD_WIDTH + 200) {
    const spawnX = Math.max(WORLD_WIDTH + 100, rightmostX + spacing);
    const newOb = generatePylon(spawnX, currentScore, rng);
    updatedObstacles.push(newOb);

    if (newOb.hasOrb) {
      updatedOrbs.push({
        x: newOb.x + newOb.width / 2,
        y: newOb.orbY,
        radius: 12,
        collected: false,
        value: 5,
        pulsePhase: 0,
        sparkleTimer: 0,
      });
    }
  }

  return {
    updatedObstacles,
    updatedOrbs,
    newSpawnsPassed,
  };
}
