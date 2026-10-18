import { PlayerCar, Particle, ControlProfile } from './types';

// Normalized simulation coordinates: 1000 width x 600 height
export const WORLD_WIDTH = 1000;
export const WORLD_HEIGHT = 600;

export const PHYSICS_CONFIG = {
  arcade: {
    gravity: 1020,               // pixels/s^2 downwards
    tapImpulse: -260,            // immediate upward impulse on press
    continuousThrustAccel: 1450, // continuous upward acceleration while holding
    maxFallSpeed: 560,           // terminal downward velocity
    maxRiseSpeed: -380,          // safe terminal upward velocity
  },
  casual: {
    gravity: 840,
    tapImpulse: -230,
    continuousThrustAccel: 1250,
    maxFallSpeed: 460,
    maxRiseSpeed: -320,
  },
  carWidth: 72,
  carHeight: 25,
  carStartX: 180,
  carStartY: 270,
  rotationSmoothness: 8.5,
  maxUpAngle: -0.28,             // ~ -16 degrees nose up
  maxDownAngle: 0.52,            // ~ +30 degrees nose down
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
    thrustPower: 0,
    boostEnergy: 100,
    trail: [],
  };
}

// Underside nozzles relative to vehicle center (width = 72, height = 25)
export const NOZZLE_OFFSETS = [
  { x: 0.18, y: 8.5 },   // Front-Outer Nozzle
  { x: 0.06, y: 8.5 },   // Front-Inner Nozzle
  { x: -0.06, y: 8.5 },  // Rear-Inner Nozzle
  { x: -0.18, y: 8.5 },  // Rear-Outer Nozzle
];

export function getNozzleWorldPositions(car: PlayerCar): Array<{ x: number; y: number }> {
  const cosR = Math.cos(car.rotation);
  const sinR = Math.sin(car.rotation);

  return NOZZLE_OFFSETS.map((offset) => {
    const lx = offset.x * car.width;
    const ly = offset.y;
    return {
      x: car.x + lx * cosR - ly * sinR,
      y: car.y + lx * sinR + ly * cosR,
    };
  });
}

export function updateCarPhysics(
  car: PlayerCar,
  dt: number,
  isBoostActive: boolean,
  isInitialPress: boolean,
  controlProfile: ControlProfile = 'arcade',
  onSpawnParticles?: (particles: Particle[]) => void
): void {
  // Clamping dt to avoid huge leaps if tab was hidden
  const clampedDt = Math.min(dt, 0.05);
  const cfg = PHYSICS_CONFIG[controlProfile] || PHYSICS_CONFIG.arcade;

  // 1. Initial Press Impulse
  if (isInitialPress) {
    // If currently falling or slow, give immediate crisp upward lift
    car.vy = Math.min(car.vy, -160) + cfg.tapImpulse * 0.75;
  }

  // 2. Continuous Lift while holding Boost
  if (isBoostActive) {
    car.isBoosting = true;
    car.vy -= cfg.continuousThrustAccel * clampedDt;
    car.targetRotation = PHYSICS_CONFIG.maxUpAngle;
    car.thrustPower += (1 - car.thrustPower) * Math.min(1, clampedDt * 16);

    // Spawn distinct white compressed air / vapor particles from each of the 4 nozzles
    if (onSpawnParticles) {
      const nozzleWorldPositions = getNozzleWorldPositions(car);
      const particles: Particle[] = [];

      for (let n = 0; n < nozzleWorldPositions.length; n++) {
        const nozzle = nozzleWorldPositions[n];

        // Downward jet vapor puff
        const spreadAngle = Math.PI / 2 + car.rotation + (Math.random() - 0.5) * 0.25;
        const speed = 180 + Math.random() * 140;

        particles.push({
          x: nozzle.x + (Math.random() - 0.5) * 3,
          y: nozzle.y,
          vx: Math.cos(spreadAngle) * speed - 50, // Slight backward drift from forward flight
          vy: Math.sin(spreadAngle) * speed,     // Strongly downward
          life: 0.25 + Math.random() * 0.18,
          maxLife: 0.42,
          color: Math.random() > 0.35 ? '#ffffff' : '#e2e8f0', // Crisp white & pale vapor
          size: 3 + Math.random() * 3,
          glow: true,
          shape: 'vapor',
        });
      }

      onSpawnParticles(particles);
    }
  } else {
    // Boost Released: Gravity takes over naturally
    car.isBoosting = false;
    car.vy += cfg.gravity * clampedDt;
    car.thrustPower += (0 - car.thrustPower) * Math.min(1, clampedDt * 8);

    // Pitch attitude reflects velocity
    if (car.vy > 50) {
      const dropFactor = Math.min(1, (car.vy - 50) / 380);
      car.targetRotation = dropFactor * PHYSICS_CONFIG.maxDownAngle;
    } else {
      car.targetRotation = (car.vy / 370) * PHYSICS_CONFIG.maxUpAngle;
    }
  }

  // 3. Velocity clamp
  car.vy = Math.max(cfg.maxRiseSpeed, Math.min(cfg.maxFallSpeed, car.vy));

  // 4. Position update
  car.y += car.vy * clampedDt;

  // 5. Rotation lerp
  car.rotation += (car.targetRotation - car.rotation) * Math.min(1, clampedDt * PHYSICS_CONFIG.rotationSmoothness);

  // 6. Subtle aerodynamic trail
  car.trail.unshift({
    x: car.x - car.width * 0.42,
    y: car.y + 2,
    alpha: 0.55,
    size: 5,
  });

  if (car.trail.length > 8) {
    car.trail.pop();
  }

  for (let i = 0; i < car.trail.length; i++) {
    car.trail[i].alpha *= 0.82;
    car.trail[i].size *= 0.88;
  }
}
