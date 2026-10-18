import { PlayerCar, ObstaclePylon, EnergyOrb } from './types';
import { WORLD_HEIGHT } from './physics';

export interface CollisionResult {
  hasCollided: boolean;
  type?: 'ceiling' | 'ground' | 'pylon_top' | 'pylon_bottom';
  contactX?: number;
  contactY?: number;
}

export function checkCarObstacleCollision(
  car: PlayerCar,
  obstacles: ObstaclePylon[]
): CollisionResult {
  // 1. Boundary collisions
  const topCeilingLimit = 14;
  const bottomGroundLimit = WORLD_HEIGHT - 26;

  if (car.y <= topCeilingLimit) {
    return {
      hasCollided: true,
      type: 'ceiling',
      contactX: car.x,
      contactY: topCeilingLimit,
    };
  }

  if (car.y >= bottomGroundLimit) {
    return {
      hasCollided: true,
      type: 'ground',
      contactX: car.x,
      contactY: bottomGroundLimit,
    };
  }

  // 2. Obstacle collisions
  // Forgiving car bounding box (inset by 5px horizontally and 4px vertically)
  const carLeft = car.x - car.width * 0.42;
  const carRight = car.x + car.width * 0.42;
  const carTop = car.y - car.height * 0.38;
  const carBottom = car.y + car.height * 0.38;

  for (let i = 0; i < obstacles.length; i++) {
    const ob = obstacles[i];
    const obLeft = ob.x + 4; // slight inset for fair hitbox
    const obRight = ob.x + ob.width - 4;

    // Check horizontal overlap
    if (carRight > obLeft && carLeft < obRight) {
      // Top Pylon overlap
      if (carTop < ob.topHeight) {
        return {
          hasCollided: true,
          type: 'pylon_top',
          contactX: Math.min(carRight, obRight),
          contactY: ob.topHeight,
        };
      }

      // Bottom Pylon overlap
      if (carBottom > ob.bottomY) {
        return {
          hasCollided: true,
          type: 'pylon_bottom',
          contactX: Math.min(carRight, obRight),
          contactY: ob.bottomY,
        };
      }
    }
  }

  return { hasCollided: false };
}

export function checkOrbPickups(
  car: PlayerCar,
  orbs: EnergyOrb[],
  onCollect: (orb: EnergyOrb) => void
): void {
  // Magnetic attraction radius (45px) and collection radius (32px)
  const collectRadius = 32;

  for (let i = 0; i < orbs.length; i++) {
    const orb = orbs[i];
    if (orb.collected) continue;

    const dx = orb.x - car.x;
    const dy = orb.y - car.y;
    const distSq = dx * dx + dy * dy;

    // Magnetic pull if close
    if (distSq < 70 * 70) {
      orb.x -= dx * 0.12;
      orb.y -= dy * 0.12;
    }

    if (distSq < collectRadius * collectRadius) {
      orb.collected = true;
      onCollect(orb);
    }
  }
}
