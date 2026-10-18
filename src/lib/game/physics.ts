import { PlayerCar, Particle, ControlProfile } from './types';

// Normalized simulation coordinates: 1000 width x 600 height
export const WORLD_WIDTH = 1000;
export const WORLD_HEIGHT = 600;

export const PHYSICS_CONFIG = {
  arcade: {
    gravity: 1050,         // pixels/s^2 downwards
    boostImpulse: -370,    // instant vertical velocity impulse
    maxFallSpeed: 580,     // terminal downward velocity
    maxRiseSpeed: -450,    // terminal upward velocity
  },
  casual: {
    gravity: 860,          // softer gravity for casual / forgiving flight
    boostImpulse: -330,    // gentler impulse
    maxFallSpeed: 480,
    maxRiseSpeed: -390,
  },
  carWidth: 64,
  carHeight: 26,
  carStartX: 180,
  carStartY: 270,
  rotationSmoothness: 8.5, // lerp speed for pitch
  maxUpAngle: -0.38,       // ~ -22 degrees nose up
  maxDownAngle: 0.58,      // ~ +33 degrees nose down
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
  isBoostTriggered: boolean,
  controlProfile: ControlProfile = 'arcade',
  onSpawnParticles?: (particles: Particle[]) => void
): void {
  // Clamping dt to avoid huge leaps if tab was hidden
  const clampedDt = Math.min(dt, 0.05);
  const cfg = PHYSICS_CONFIG[controlProfile] || PHYSICS_CONFIG.arcade;

  // Apply Boost or Gravity
  if (isBoostTriggered) {
    car.vy = cfg.boostImpulse;
    car.targetRotation = PHYSICS_CONFIG.maxUpAngle;
    car.isBoosting = true;

    // Spawn dramatic SpaceX cold gas rocket booster thruster particles
    if (onSpawnParticles) {
      const thrusterX = car.x - car.width * 0.45;
      const thrusterY = car.y + 4;
      const particles: Particle[] = [];

      // Core plasma flare
      particles.push({
        x: thrusterX,
        y: thrusterY,
        vx: -120,
        vy: 0,
        life: 0.18,
        maxLife: 0.18,
        color: '#ffffff',
        size: 14,
        glow: true,
        shape: 'ring',
      });

      // Jet sparks and shock diamonds
      for (let i = 0; i < 6; i++) {
        const angle = Math.PI + (Math.random() - 0.5) * 0.4;
        const speed = 280 + Math.random() * 220;
        particles.push({
          x: thrusterX + (Math.random() - 0.5) * 4,
          y: thrusterY + (Math.random() - 0.5) * 4,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + car.vy * 0.15,
          life: 0.25 + Math.random() * 0.2,
          maxLife: 0.45,
          color: Math.random() > 0.35 ? '#00f0ff' : '#ff007f', // Electric cyan & magenta
          size: 3 + Math.random() * 5,
          glow: true,
          shape: 'spark',
        });
      }
      onSpawnParticles(particles);
    }
  } else {
    // Gravity pulls down
    car.vy += cfg.gravity * clampedDt;
    car.isBoosting = false;

    // Pitch towards ground as velocity increases
    if (car.vy > 40) {
      const dropFactor = Math.min(1, (car.vy - 40) / 380);
      car.targetRotation = dropFactor * PHYSICS_CONFIG.maxDownAngle;
    } else {
      car.targetRotation = (car.vy / 370) * PHYSICS_CONFIG.maxUpAngle;
    }
  }

  // Velocity clamp
  car.vy = Math.max(cfg.maxRiseSpeed, Math.min(cfg.maxFallSpeed, car.vy));

  // Position update
  car.y += car.vy * clampedDt;

  // Rotation lerp
  car.rotation += (car.targetRotation - car.rotation) * Math.min(1, clampedDt * PHYSICS_CONFIG.rotationSmoothness);

  // Subtle trail tracking
  car.trail.unshift({
    x: car.x - car.width * 0.4,
    y: car.y + 4,
    alpha: 0.65,
    size: 7,
  });

  if (car.trail.length > 9) {
    car.trail.pop();
  }

  for (let i = 0; i < car.trail.length; i++) {
    car.trail[i].alpha *= 0.84;
    car.trail[i].size *= 0.88;
  }
}
