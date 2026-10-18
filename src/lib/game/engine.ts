import {
  GameState,
  PlayerCar,
  ObstaclePylon,
  EnergyOrb,
  Particle,
  FloatingText,
  CarSkin,
  GameSettings,
} from './types';
import { WORLD_WIDTH, WORLD_HEIGHT, createInitialCar, updateCarPhysics } from './physics';
import { SeededRNG, updateObstacles, calculateGameSpeed } from './obstacles';
import { checkCarObstacleCollision, checkOrbPickups } from './collision';
import { SceneRenderer } from './carRenderer';
import { soundManager } from './audio';
import { processRunEnd, ProgressionUpdate } from './progression';

export interface GameEngineCallbacks {
  onScoreUpdate: (score: number, distance: number, orbs: number) => void;
  onStateChange: (state: GameState) => void;
  onGameOver: (update: ProgressionUpdate, runStats: { score: number; distance: number; orbs: number; time: number }) => void;
  onCountdownTick?: (count: number) => void;
}

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private renderer: SceneRenderer;
  private callbacks: GameEngineCallbacks;

  // Game Entities
  private car: PlayerCar;
  private obstacles: ObstaclePylon[] = [];
  private orbs: EnergyOrb[] = [];
  private particles: Particle[] = [];
  private floatingTexts: FloatingText[] = [];

  // State
  private state: GameState = 'START';
  private skin: CarSkin;
  private settings: GameSettings;
  private isDaily: boolean = false;
  private seededRNG?: SeededRNG;

  // Loop & Timing
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private gameTime: number = 0;
  private score: number = 0;
  private distance: number = 0;
  private orbsCollected: number = 0;
  private survivalTime: number = 0;

  // Four-Thruster Flight Input State
  private isHoldingBoost: boolean = false;
  private isInitialPress: boolean = false;

  // Camera & Easing
  private cameraOffsetY: number = 0;
  private targetCameraOffsetY: number = 0;
  private cameraShakeIntensity: number = 0;

  // Crash & Slow-mo
  private isSlowMo: boolean = false;
  private slowMoTimer: number = 0;

  // Screen scale
  private scale: number = 1;
  private offsetX: number = 0;
  private offsetY: number = 0;

  // Touch Debounce
  private touchHandled: boolean = false;

  constructor(
    canvas: HTMLCanvasElement,
    skin: CarSkin,
    settings: GameSettings,
    callbacks: GameEngineCallbacks
  ) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Failed to get 2D context');
    this.ctx = context;

    this.renderer = new SceneRenderer();
    this.skin = skin;
    this.settings = settings;
    this.callbacks = callbacks;
    this.car = createInitialCar();

    this.resize();
    window.addEventListener('resize', this.handleResize);

    // Initial render loop for start screen background animation
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  private handleResize = () => {
    this.resize();
  };

  public resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    const parentWidth = parent ? parent.clientWidth : window.innerWidth;
    const parentHeight = parent ? parent.clientHeight : window.innerHeight;

    // Device Pixel Ratio scaling (capped at 2 for performance)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = parentWidth * dpr;
    this.canvas.height = parentHeight * dpr;

    // Fit 1000x600 coordinate system within viewport with letterbox/fit
    const scaleX = (parentWidth * dpr) / WORLD_WIDTH;
    const scaleY = (parentHeight * dpr) / WORLD_HEIGHT;
    this.scale = Math.min(scaleX, scaleY);

    this.offsetX = (parentWidth * dpr - WORLD_WIDTH * this.scale) / 2;
    this.offsetY = (parentHeight * dpr - WORLD_HEIGHT * this.scale) / 2;
  }

  public setSkin(skin: CarSkin) {
    this.skin = skin;
  }

  public updateSettings(settings: GameSettings) {
    this.settings = settings;
    soundManager.setMuted(settings.isMuted);
    soundManager.setSfxVolume(settings.sfxVolume);
    soundManager.setMusicVolume(settings.musicVolume);
  }

  public startRun(isDaily: boolean = false, dailySeed?: number) {
    soundManager.init();
    soundManager.resume();

    this.isDaily = isDaily;
    this.seededRNG = isDaily && dailySeed ? new SeededRNG(dailySeed) : undefined;

    this.car = createInitialCar();
    this.obstacles = [];
    this.orbs = [];
    this.particles = [];
    this.floatingTexts = [];
    this.score = 0;
    this.distance = 0;
    this.orbsCollected = 0;
    this.survivalTime = 0;
    this.gameTime = 0;
    this.isSlowMo = false;
    this.slowMoTimer = 0;
    this.cameraShakeIntensity = 0;
    this.cameraOffsetY = 0;
    this.targetCameraOffsetY = 0;
    this.isHoldingBoost = false;
    this.isInitialPress = false;

    this.state = 'PLAYING';
    this.callbacks.onStateChange(this.state);
    this.callbacks.onScoreUpdate(this.score, this.distance, this.orbsCollected);

    soundManager.startMusic();
    this.lastTime = performance.now();
  }

  public startCountdown(isDaily: boolean = false, dailySeed?: number, onFinish?: () => void) {
    soundManager.init();
    soundManager.resume();

    this.state = 'COUNTDOWN';
    this.callbacks.onStateChange('COUNTDOWN');

    let count = 3;
    soundManager.playCountdownBeep(false);
    if (this.callbacks.onCountdownTick) this.callbacks.onCountdownTick(count);

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        soundManager.playCountdownBeep(false);
        if (this.callbacks.onCountdownTick) this.callbacks.onCountdownTick(count);
      } else {
        clearInterval(interval);
        soundManager.playCountdownBeep(true);
        if (this.callbacks.onCountdownTick) this.callbacks.onCountdownTick(0);
        this.startRun(isDaily, dailySeed);
        if (onFinish) onFinish();
      }
    }, 800);
  }

  public pause() {
    if (this.state !== 'PLAYING') return;
    this.state = 'PAUSED';
    this.isHoldingBoost = false;
    this.isInitialPress = false;
    this.callbacks.onStateChange(this.state);
    soundManager.stopMusic();
  }

  public resume() {
    if (this.state !== 'PAUSED') return;
    this.state = 'PLAYING';
    this.callbacks.onStateChange(this.state);
    soundManager.startMusic();
    this.lastTime = performance.now();
  }

  public handleBoostPress(isTouch: boolean = false) {
    if (isTouch) {
      this.touchHandled = true;
      setTimeout(() => {
        this.touchHandled = false;
      }, 350);
    } else if (this.touchHandled) {
      return;
    }

    soundManager.init();
    soundManager.resume();

    if (this.state === 'PLAYING') {
      if (!this.isHoldingBoost) {
        this.isInitialPress = true;
        soundManager.playBoost();
      }
      this.isHoldingBoost = true;
    }
  }

  public handleBoostRelease() {
    this.isHoldingBoost = false;
    this.isInitialPress = false;
  }

  public spawnParticles = (newParticles: Particle[]) => {
    const maxParticles =
      this.settings.graphicsPreset === 'performance' ? 40 : this.settings.graphicsPreset === 'balanced' ? 90 : 160;

    this.particles.push(...newParticles);
    if (this.particles.length > maxParticles) {
      this.particles.splice(0, this.particles.length - maxParticles);
    }
  };

  private loop = (timestamp: number) => {
    const rawDt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    const dt = Math.min(rawDt, 0.05); // Frame clamp

    if (this.state === 'PLAYING' || this.isSlowMo) {
      this.update(dt);
    } else if (this.state === 'START') {
      // Gentle hovering idle animation for Roadster on start screen
      this.gameTime += dt;
      this.car.y = 280 + Math.sin(this.gameTime * 2.2) * 10;
      this.car.rotation = Math.sin(this.gameTime * 1.5) * 0.04;
      this.car.thrustPower += (0 - this.car.thrustPower) * Math.min(1, dt * 8);
    }

    this.render();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    const effectiveDt = this.isSlowMo ? dt * 0.2 : dt;
    this.gameTime += effectiveDt;

    if (!this.isSlowMo) {
      this.survivalTime += dt;
      const curSpeed = calculateGameSpeed(this.score);
      this.distance += Math.round(curSpeed * dt * 0.1);

      // Update Car Physics with Four-Thruster Lift and selected Control Profile
      updateCarPhysics(
        this.car,
        effectiveDt,
        this.isHoldingBoost,
        this.isInitialPress,
        this.settings.controlProfile || 'arcade',
        this.spawnParticles
      );
      this.isInitialPress = false; // Reset after single frame impulse

      // Smooth camera easing tracking car vertical position
      const targetOffset = (this.car.y - WORLD_HEIGHT * 0.5) * -0.06;
      this.targetCameraOffsetY = targetOffset;
      this.cameraOffsetY += (this.targetCameraOffsetY - this.cameraOffsetY) * Math.min(1, dt * 4.5);

      // Update Engine Audio
      soundManager.updateEnginePitch(this.car.vy / 400, this.car.isBoosting);

      // Update Obstacles & Orbs
      const { updatedObstacles, updatedOrbs } = updateObstacles(
        this.obstacles,
        this.orbs,
        effectiveDt,
        this.score,
        this.gameTime,
        this.seededRNG
      );
      this.obstacles = updatedObstacles;
      this.orbs = updatedOrbs;

      // Check Gate Passed
      for (let i = 0; i < this.obstacles.length; i++) {
        const ob = this.obstacles[i];
        if (!ob.passed && ob.x + ob.width < this.car.x) {
          ob.passed = true;
          this.score += 1;
          soundManager.playScore();
          this.callbacks.onScoreUpdate(this.score, this.distance, this.orbsCollected);

          // Milestone celebrations
          if (this.score % 10 === 0) {
            soundManager.playAchievement();
            this.addFloatingText(`MILESTONE ${this.score}!`, this.car.x, this.car.y - 32, '#ffd700');
          } else {
            this.addFloatingText('+1', this.car.x, this.car.y - 20, '#00f0ff');
          }
        }
      }

      // Check Orb Pickups
      checkOrbPickups(this.car, this.orbs, (orb) => {
        this.orbsCollected += 1;
        this.score += orb.value;
        soundManager.playOrbPickup();
        this.callbacks.onScoreUpdate(this.score, this.distance, this.orbsCollected);
        this.addFloatingText(`+${orb.value} ORB`, orb.x, orb.y - 15, orb.type === 'super' ? '#ffd700' : '#00f0ff');

        // Sparkle burst
        const burstCount = this.settings.graphicsPreset === 'performance' ? 6 : 14;
        for (let s = 0; s < burstCount; s++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = 60 + Math.random() * 90;
          this.particles.push({
            x: orb.x,
            y: orb.y,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            life: 0.35,
            maxLife: 0.35,
            color: orb.type === 'super' ? '#ffd700' : '#00f0ff',
            size: 3,
            glow: true,
            shape: 'circle',
          });
        }
      });

      // Check Collision
      const collision = checkCarObstacleCollision(this.car, this.obstacles);
      if (collision.hasCollided) {
        this.triggerCrash(collision.contactX || this.car.x, collision.contactY || this.car.y);
      }
    } else {
      // In Slow-mo crash sequence
      this.slowMoTimer += dt;
      if (this.slowMoTimer >= 0.45) {
        this.isSlowMo = false;
        this.isHoldingBoost = false;
        this.isInitialPress = false;
        this.state = 'GAMEOVER';
        this.callbacks.onStateChange('GAMEOVER');

        const update = processRunEnd({
          score: this.score,
          distance: this.distance,
          orbs: this.orbsCollected,
          survivalTime: this.survivalTime,
          isDaily: this.isDaily,
        });

        this.callbacks.onGameOver(update, {
          score: this.score,
          distance: this.distance,
          orbs: this.orbsCollected,
          time: Math.round(this.survivalTime),
        });
      }
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= effectiveDt;
      p.x += p.vx * effectiveDt;
      p.y += p.vy * effectiveDt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * effectiveDt;
      ft.opacity -= effectiveDt * 1.5;
      if (ft.opacity <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // Camera shake decay
    if (this.cameraShakeIntensity > 0) {
      this.cameraShakeIntensity = Math.max(0, this.cameraShakeIntensity - dt * 25);
    }
  }

  private triggerCrash(contactX: number, contactY: number) {
    this.isSlowMo = true;
    this.slowMoTimer = 0;
    this.isHoldingBoost = false;
    this.isInitialPress = false;
    soundManager.playCrash();
    soundManager.stopMusic();

    if (this.settings.screenShake && !this.settings.reducedMotion) {
      this.cameraShakeIntensity = 18;
    }

    // Spawn explosion debris & cyber shockwave
    const debrisCount = this.settings.graphicsPreset === 'performance' ? 18 : 36;
    for (let i = 0; i < debrisCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 120 + Math.random() * 320;
      this.particles.push({
        x: contactX,
        y: contactY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.5 + Math.random() * 0.4,
        maxLife: 0.9,
        color: Math.random() > 0.5 ? this.skin.accentColor : '#ef4444',
        size: 3 + Math.random() * 6,
        glow: true,
        shape: Math.random() > 0.5 ? 'spark' : 'circle',
      });
    }

    // White core shockwave
    this.particles.push({
      x: contactX,
      y: contactY,
      vx: 0,
      vy: 0,
      life: 0.35,
      maxLife: 0.35,
      color: '#ffffff',
      size: 20,
      glow: true,
      shape: 'ring',
    });
  }

  private addFloatingText(text: string, x: number, y: number, color: string) {
    this.floatingTexts.push({
      id: Math.random().toString(),
      text,
      x,
      y,
      color,
      opacity: 1,
      vy: -50,
    });
  }

  private render() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Camera Shake
    let shakeX = 0;
    let shakeY = 0;
    if (this.cameraShakeIntensity > 0) {
      shakeX = (Math.random() - 0.5) * this.cameraShakeIntensity;
      shakeY = (Math.random() - 0.5) * this.cameraShakeIntensity;
    }

    this.ctx.translate(this.offsetX + shakeX, this.offsetY + shakeY);
    this.ctx.scale(this.scale, this.scale);

    // Clip to world bounds
    this.ctx.beginPath();
    this.ctx.rect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.ctx.clip();

    // Render Scene with graphics preset & camera offset
    const curSpeed = calculateGameSpeed(this.score);
    this.renderer.render(
      this.ctx,
      this.car,
      this.skin,
      this.obstacles,
      this.orbs,
      this.particles,
      this.floatingTexts,
      curSpeed,
      this.gameTime,
      0.016,
      this.isSlowMo,
      this.settings.graphicsPreset || 'balanced',
      this.cameraOffsetY
    );

    this.ctx.restore();
  }

  public destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    soundManager.stopMusic();
    window.removeEventListener('resize', this.handleResize);
  }
}
