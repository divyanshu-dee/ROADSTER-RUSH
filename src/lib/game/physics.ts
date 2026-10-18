import { PlayerCar, Particle } from './types';

// Normalized simulation coordinates: 1000 width x 600 height
export const WORLD_WIDTH = 1000;
export const WORLD_HEIGHT = 600;

export const PHYSICS_CONFIG = {
  gravity: 1050,         // pixels/s^2 downwards
  boostImpulse: -370,    // instant vertical velocity impulse
  maxFallSpeed: 580,     // terminal downward velocity
  maxRiseSpeed: -450,    // terminal upward velocity
  carWidth: 64,
  carHeight: 26,
  carStartX: 180,
  carStartY: 270,
  rotationSmoothness: 8, // lerp speed for pitch
  maxUpAngle: -0.38,     // ~ -22 degrees
  maxDownAngle: 0.60,    // ~ +35 degrees
};

export function createInitialCar(): PlayerCar {
  return {
    x: PHYSICS_CONFIG.carStartX,
    y: PHYSICS_CONFIG.carStartY,
    vx: 0,
    vy: 0,
    width: PHYSICS_CONFIG.carWidth,
    height: PHYSICS_CONFIG.carHeight,
    rotation: 0,
    targetRotation: 0,
    isBoosting: false,
    boostEnergy: 100,
    trail: [],
  };
}

export function updateCarPhysics(
  car: PlayerCar,
  dt: number,
  isBoostActive: boolean,
  onSpawnParticles?: (particles: Particle[]) => void
): void {
  // Clamping dt to avoid huge leaps if tab was hidden
  const clampedDt = Math.min(dt, 0.05);

  // Apply Boost or Gravity
  if (isBoostActive) {
    car.vy = PHYSICS_CONFIG.boostImpulse;
    car.targetRotation = PHYSICS_CONFIG.maxUpAngle;
    car.isBoosting = true;

    // Spawn rocket booster thruster particles
    if (onSpawnParticles) {
      const thrusterX = car.x - car.width * 0.45;
      const thrusterY = car.y + 4;
      const particles: Particle[] = [];

      for (let i = 0; i < 4; i++) {
        const angle = Math.PI + (Math.random() - 0.5) * 0.5;
        const speed = 250 + Math.random() * 200;
        particles.push({
          x: thrusterX + (Math.random() - 0.5) * 6,
          y: thrusterY + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + car.vy * 0.2,
          life: 0.25 + Math.random() * 0.2,
          maxLife: 0.45,
          color: Math.random() > 0.4 ? '#00f0ff' : '#ff007f', // Cyber plasma
          size: 3 + Math.random() * 5,
          glow: true,
          shape: 'spark',
        });
      }
      onSpawnParticles(particles);
    }
  } else {
    // Gravity pulls down
    car.vy += PHYSICS_CONFIG.gravity * clampedDt;
    car.isBoosting = false;

    // Pitch towards ground as velocity increases
    if (car.vy > 50) {
      const dropFactor = Math.min(1, (car.vy - 50) / 400);
      car.targetRotation = dropFactor * PHYSICS_CONFIG.maxDownAngle;
    } else {
      car.targetRotation = (car.vy / 370) * PHYSICS_CONFIG.maxUpAngle;
    }
  }

  // Velocity clamp
  car.vy = Math.max(PHYSICS_CONFIG.maxRiseSpeed, Math.min(PHYSICS_CONFIG.maxFallSpeed, car.vy));

  // Position update
  car.y += car.vy * clampedDt;

  // Rotation lerp
  car.rotation += (car.targetRotation - car.rotation) * Math.min(1, clampedDt * PHYSICS_CONFIG.rotationSmoothness);

  // Subtle trail tracking
  car.trail.unshift({
    x: car.x - car.width * 0.4,
    y: car.y + 4,
    alpha: 0.6,
    size: 6,
  });

  if (car.trail.length > 8) {
    car.trail.pop();
  }

  for (let i = 0; i < car.trail.length; i++) {
    car.trail[i].alpha *= 0.85;
    car.trail[i].size *= 0.9;
  }
}
