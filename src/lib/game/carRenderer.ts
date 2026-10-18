import {
  PlayerCar,
  CarSkin,
  ObstaclePylon,
  EnergyOrb,
  Particle,
  FloatingText,
  GraphicsPreset,
} from './types';
import { WORLD_WIDTH, WORLD_HEIGHT, NOZZLE_OFFSETS } from './physics';

export class SceneRenderer {
  // Parallax offsets
  private starOffset = 0;
  private cloudOffset = 0;
  private mountainOffset = 0;
  private forestOffset = 0;
  private cityOffset = 0;
  private roadOffset = 0;
  private foregroundStreakOffset = 0;

  // Starfield, Clouds, and Foreground Streaks
  private stars: Array<{ x: number; y: number; size: number; speed: number; brightness: number }> = [];
  private clouds: Array<{ x: number; y: number; width: number; height: number; speed: number; alpha: number }> = [];
  private foregroundStreaks: Array<{ x: number; y: number; length: number; speed: number; alpha: number }> = [];

  constructor() {
    // Generate twinkling starfield
    for (let i = 0; i < 85; i++) {
      this.stars.push({
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * (WORLD_HEIGHT * 0.65),
        size: Math.random() * 2 + 0.8,
        speed: Math.random() * 0.25 + 0.08,
        brightness: Math.random() * 0.7 + 0.3,
      });
    }

    // Generate layered pixel-art clouds
    for (let i = 0; i < 7; i++) {
      this.clouds.push({
        x: Math.random() * WORLD_WIDTH,
        y: 40 + Math.random() * 140,
        width: 140 + Math.random() * 120,
        height: 28 + Math.random() * 24,
        speed: 0.12 + Math.random() * 0.18,
        alpha: 0.15 + Math.random() * 0.18,
      });
    }

    // Generate fast foreground speed streaks
    for (let i = 0; i < 16; i++) {
      this.foregroundStreaks.push({
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * WORLD_HEIGHT,
        length: 40 + Math.random() * 90,
        speed: 1.4 + Math.random() * 0.6,
        alpha: 0.2 + Math.random() * 0.25,
      });
    }
  }

  public render(
    ctx: CanvasRenderingContext2D,
    car: PlayerCar,
    skin: CarSkin,
    obstacles: ObstaclePylon[],
    orbs: EnergyOrb[],
    particles: Particle[],
    floatingTexts: FloatingText[],
    gameSpeed: number,
    gameTime: number,
    dt: number,
    isSlowMo: boolean,
    preset: GraphicsPreset = 'balanced',
    cameraOffsetY: number = 0
  ) {
    const speed = gameSpeed * (isSlowMo ? 0.2 : 1);

    // Scroll parallax layers with depth separation
    this.starOffset = (this.starOffset + speed * 0.04 * dt) % WORLD_WIDTH;
    this.cloudOffset = (this.cloudOffset + speed * 0.12 * dt) % WORLD_WIDTH;
    this.mountainOffset = (this.mountainOffset + speed * 0.22 * dt) % WORLD_WIDTH;
    this.forestOffset = (this.forestOffset + speed * 0.38 * dt) % WORLD_WIDTH;
    this.cityOffset = (this.cityOffset + speed * 0.55 * dt) % WORLD_WIDTH;
    this.roadOffset = (this.roadOffset + speed * 1.1 * dt) % 60;
    this.foregroundStreakOffset = (this.foregroundStreakOffset + speed * 1.6 * dt) % WORLD_WIDTH;

    ctx.save();
    // Subtle camera vertical response
    ctx.translate(0, cameraOffsetY);

    // 1. Deep Midnight Cosmic Sky
    this.drawSky(ctx);

    // 2. Twinkling Starfield
    this.drawStars(ctx, gameTime);

    // 3. Pixel-Art Clouds
    if (preset !== 'performance') {
      this.drawClouds(ctx);
    }

    // 4. Distant Mountain Peaks
    this.drawMountains(ctx);

    // 5. Pine Forest Silhouettes
    if (preset !== 'performance') {
      this.drawForest(ctx);
    }

    // 6. Neo-Tokyo Skyline with Lit Billboards
    this.drawCitySkyline(ctx, gameTime);

    // 7. Pseudo-3D Perspective Racing Corridor
    this.drawPerspectiveHighway(ctx);

    // 8. 3D-Shaded Obstacles & Warning Beacons
    this.drawObstacles(ctx, obstacles, gameTime, preset);

    // 9. Golden Plasma Cores
    this.drawOrbs(ctx, orbs, gameTime, preset);

    // 10. Exhaust Particles & Debris
    this.drawParticles(ctx, particles, preset);

    // 11. Realistic Silver Tesla Roadster with Quad Underside Thrusters
    this.drawRoadster(ctx, car, skin, gameTime, preset);

    // 12. Foreground Speed Streaks
    if (preset === 'quality') {
      this.drawForegroundStreaks(ctx);
    }

    // 13. Floating Score Popups
    this.drawFloatingTexts(ctx, floatingTexts);

    ctx.restore();
  }

  private drawSky(ctx: CanvasRenderingContext2D) {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, WORLD_HEIGHT);
    skyGrad.addColorStop(0, '#020510');
    skyGrad.addColorStop(0.45, '#070f24');
    skyGrad.addColorStop(0.75, '#101738');
    skyGrad.addColorStop(1, '#070c20');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Atmospheric Nebula Glow
    const nebulaGrad = ctx.createRadialGradient(
      WORLD_WIDTH * 0.72,
      WORLD_HEIGHT * 0.32,
      30,
      WORLD_WIDTH * 0.72,
      WORLD_HEIGHT * 0.32,
      380
    );
    nebulaGrad.addColorStop(0, 'rgba(0, 240, 255, 0.12)');
    nebulaGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.07)');
    nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebulaGrad;
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Synthwave Dual-Tone Moon
    ctx.save();
    const moonX = WORLD_WIDTH * 0.76;
    const moonY = 115;
    const moonRadius = 54;

    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    const moonGrad = ctx.createLinearGradient(moonX, moonY - moonRadius, moonX, moonY + moonRadius);
    moonGrad.addColorStop(0, '#ff007f');
    moonGrad.addColorStop(0.7, '#ff9900');
    moonGrad.addColorStop(1, '#ffee55');
    ctx.fillStyle = moonGrad;
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 26;
    ctx.fill();

    // Horizontal retro scanline cuts across moon
    ctx.fillStyle = '#05091b';
    for (let y = moonY - 5; y < moonY + moonRadius; y += 9) {
      const sliceH = (y - moonY + 10) * 0.065 + 2.5;
      ctx.fillRect(moonX - moonRadius - 5, y, moonRadius * 2 + 10, sliceH);
    }
    ctx.restore();
  }

  private drawStars(ctx: CanvasRenderingContext2D, gameTime: number) {
    ctx.save();
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      const curX = (s.x - this.starOffset * s.speed + WORLD_WIDTH * 2) % WORLD_WIDTH;
      const twinkle = Math.sin(gameTime * 2.5 + i * 1.5) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(210, 240, 255, ${s.brightness * twinkle})`;
      ctx.fillRect(curX, s.y, s.size, s.size);
    }
    ctx.restore();
  }

  private drawClouds(ctx: CanvasRenderingContext2D) {
    ctx.save();
    for (let i = 0; i < this.clouds.length; i++) {
      const c = this.clouds[i];
      const curX = (c.x - this.cloudOffset * c.speed + WORLD_WIDTH * 2) % (WORLD_WIDTH + c.width) - c.width;

      ctx.fillStyle = `rgba(0, 240, 255, ${c.alpha})`;
      ctx.fillRect(curX + 20, c.y, c.width - 40, c.height);
      ctx.fillRect(curX, c.y + 6, c.width, c.height - 10);
      ctx.fillRect(curX + 35, c.y - 6, c.width - 70, c.height + 12);
    }
    ctx.restore();
  }

  private drawMountains(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const mountainY = WORLD_HEIGHT * 0.69;
    const offset = this.mountainOffset;

    for (let pass = 0; pass < 2; pass++) {
      const startX = pass * WORLD_WIDTH - offset;
      ctx.beginPath();
      ctx.moveTo(startX, WORLD_HEIGHT);
      ctx.lineTo(startX, mountainY);

      const peaks = [
        [0, 0],
        [90, -95],
        [170, -45],
        [260, -130],
        [380, -35],
        [490, -115],
        [600, -55],
        [720, -145],
        [830, -75],
        [930, -110],
        [1000, 0],
      ];

      for (let p = 0; p < peaks.length; p++) {
        ctx.lineTo(startX + peaks[p][0], mountainY + peaks[p][1]);
      }
      ctx.lineTo(startX + WORLD_WIDTH, WORLD_HEIGHT);
      ctx.closePath();

      const mtnGrad = ctx.createLinearGradient(0, mountainY - 145, 0, WORLD_HEIGHT);
      mtnGrad.addColorStop(0, '#102538');
      mtnGrad.addColorStop(0.5, '#0b1626');
      mtnGrad.addColorStop(1, '#050a14');
      ctx.fillStyle = mtnGrad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawForest(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const forestY = WORLD_HEIGHT - 65;
    const offset = this.forestOffset;

    for (let pass = 0; pass < 2; pass++) {
      const startX = pass * WORLD_WIDTH - offset;
      ctx.fillStyle = '#081220';

      for (let tx = startX; tx < startX + WORLD_WIDTH; tx += 28) {
        ctx.beginPath();
        ctx.moveTo(tx - 10, forestY);
        ctx.lineTo(tx, forestY - 32 - ((tx * 3) % 18));
        ctx.lineTo(tx + 10, forestY);
        ctx.closePath();
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private drawCitySkyline(ctx: CanvasRenderingContext2D, gameTime: number) {
    ctx.save();
    const baseY = WORLD_HEIGHT - 48;
    const offset = this.cityOffset;

    const buildings = [
      { w: 60, h: 190, color: '#111a36' },
      { w: 45, h: 235, color: '#0c142e' },
      { w: 80, h: 170, color: '#141d3e' },
      { w: 55, h: 260, color: '#0f1836' },
      { w: 90, h: 200, color: '#131c3a' },
      { w: 50, h: 280, color: '#0a1228' },
      { w: 70, h: 220, color: '#162044' },
      { w: 65, h: 245, color: '#101834' },
      { w: 85, h: 185, color: '#141d3c' },
      { w: 75, h: 270, color: '#0e1631' },
      { w: 90, h: 205, color: '#151e40' },
      { w: 60, h: 250, color: '#101936' },
      { w: 85, h: 225, color: '#131c3b' },
    ];

    for (let pass = 0; pass < 2; pass++) {
      let curX = pass * WORLD_WIDTH - offset;
      for (let b = 0; b < buildings.length; b++) {
        const build = buildings[b];
        ctx.fillStyle = build.color;
        ctx.fillRect(curX, baseY - build.h, build.w, build.h);

        // Antenna
        ctx.strokeStyle = '#223055';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(curX + build.w / 2, baseY - build.h);
        ctx.lineTo(curX + build.w / 2, baseY - build.h - 22);
        ctx.stroke();

        const blink = Math.sin(gameTime * 4 + b * 2) > 0.3;
        ctx.fillStyle = blink ? '#ff0055' : '#00f0ff';
        ctx.fillRect(curX + build.w / 2 - 2, baseY - build.h - 24, 4, 4);

        // Windows
        ctx.fillStyle = b % 2 === 0 ? 'rgba(0, 240, 255, 0.45)' : 'rgba(255, 215, 0, 0.38)';
        for (let wy = baseY - build.h + 22; wy < baseY - 12; wy += 17) {
          for (let wx = curX + 7; wx < curX + build.w - 7; wx += 14) {
            if ((b * 5 + wx + wy) % 7 !== 0) {
              ctx.fillRect(wx, wy, 5, 9);
            }
          }
        }

        // Billboard
        if (build.h > 245 && curX > -120 && curX < WORLD_WIDTH) {
          ctx.save();
          ctx.fillStyle = 'rgba(0, 240, 255, 0.16)';
          ctx.fillRect(curX + 5, baseY - build.h + 30, build.w - 10, 32);
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 1;
          ctx.strokeRect(curX + 5, baseY - build.h + 30, build.w - 10, 32);
          ctx.fillStyle = '#00f0ff';
          ctx.font = 'bold 8px monospace';
          ctx.fillText('ROADSTER', curX + 8, baseY - build.h + 45);
          ctx.fillText('1.9s 0-60', curX + 8, baseY - build.h + 56);
          ctx.restore();
        }

        curX += build.w + 14;
      }
    }
    ctx.restore();
  }

  private drawPerspectiveHighway(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const groundY = WORLD_HEIGHT - 46;

    // Road Deck Gradient
    const roadGrad = ctx.createLinearGradient(0, groundY, 0, WORLD_HEIGHT);
    roadGrad.addColorStop(0, '#0a1020');
    roadGrad.addColorStop(0.3, '#060a16');
    roadGrad.addColorStop(1, '#02040a');
    ctx.fillStyle = roadGrad;
    ctx.fillRect(0, groundY, WORLD_WIDTH, 46);

    // Glowing Horizon Line
    ctx.strokeStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 14;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(WORLD_WIDTH, groundY);
    ctx.stroke();

    // 3D Perspective Grid Longitudinal Lines
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
    ctx.lineWidth = 1.2;
    for (let x = -200; x < WORLD_WIDTH + 400; x += 90) {
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.lineTo(x + (x - WORLD_WIDTH * 0.5) * 0.7, WORLD_HEIGHT);
      ctx.stroke();
    }

    // Animated Corridor Guideline
    ctx.strokeStyle = '#ff007f';
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2.5;
    ctx.setLineDash([30, 40]);
    ctx.lineDashOffset = this.roadOffset;
    ctx.beginPath();
    ctx.moveTo(0, groundY + 20);
    ctx.lineTo(WORLD_WIDTH, groundY + 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Ceiling safety line
    ctx.strokeStyle = 'rgba(255, 0, 80, 0.45)';
    ctx.shadowColor = '#ff0050';
    ctx.shadowBlur = 8;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.lineTo(WORLD_WIDTH, 12);
    ctx.stroke();

    ctx.restore();
  }

  private drawObstacles(
    ctx: CanvasRenderingContext2D,
    obstacles: ObstaclePylon[],
    gameTime: number,
    preset: GraphicsPreset
  ) {
    ctx.save();

    for (let i = 0; i < obstacles.length; i++) {
      const ob = obstacles[i];
      if (ob.x > WORLD_WIDTH + 60 || ob.x + ob.width < -60) continue;

      const beamPulse = Math.sin(gameTime * 7 + i) * 0.3 + 0.7;

      // 1. TOP PYLON (3D Shaded Structure)
      this.drawPylonStructure(ctx, ob.x, 0, ob.width, ob.topHeight, true, ob);

      // 2. BOTTOM PYLON (3D Shaded Structure)
      this.drawPylonStructure(ctx, ob.x, ob.bottomY, ob.width, ob.bottomHeight, false, ob);

      // 3. Forcefield Energy Beam
      const laserX = ob.x + ob.width / 2;
      const isBonus = ob.family === 'bonus_gate';
      const laserColor = isBonus
        ? 'rgba(255, 215, 0,'
        : ob.theme === 'laser'
        ? 'rgba(0, 240, 255,'
        : 'rgba(255, 0, 127,';

      ctx.save();
      ctx.strokeStyle = `${laserColor} ${0.25 * beamPulse})`;
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(laserX, ob.topHeight);
      ctx.lineTo(laserX, ob.bottomY);
      ctx.stroke();

      ctx.strokeStyle = `${laserColor} ${0.75 * beamPulse})`;
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.strokeStyle = `rgba(255, 255, 255, ${0.92 * beamPulse})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = isBonus ? '#ffd700' : '#00f0ff';
      if (preset !== 'performance') {
        ctx.shadowColor = isBonus ? '#ffd700' : '#00f0ff';
        ctx.shadowBlur = 12;
      }
      ctx.beginPath();
      ctx.arc(laserX, ob.topHeight - 2, 6.5, 0, Math.PI * 2);
      ctx.arc(laserX, ob.bottomY + 2, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Warning beacon
      if (ob.warningBeacon && ob.x > WORLD_WIDTH * 0.4 && ob.x < WORLD_WIDTH) {
        ctx.save();
        const warnY = ob.topHeight + ob.gapSize / 2;
        const warnAlpha = Math.sin(gameTime * 12) * 0.4 + 0.6;
        ctx.strokeStyle = `rgba(255, 215, 0, ${warnAlpha})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(ob.x - 22, warnY, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgba(255, 215, 0, ${warnAlpha})`;
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('!', ob.x - 22, warnY + 4);
        ctx.restore();
      }
    }

    ctx.restore();
  }

  private drawPylonStructure(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    isTop: boolean,
    ob: ObstaclePylon
  ) {
    if (h <= 0) return;

    ctx.save();
    const pylonGrad = ctx.createLinearGradient(x, 0, x + w, 0);
    pylonGrad.addColorStop(0, '#1e2844');
    pylonGrad.addColorStop(0.25, '#2e3d66');
    pylonGrad.addColorStop(0.75, '#161e34');
    pylonGrad.addColorStop(1, '#0e1422');

    ctx.fillStyle = pylonGrad;
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = ob.family === 'bonus_gate' ? '#ffd700' : ob.theme === 'laser' ? '#00f0ff' : '#ff007f';
    ctx.lineWidth = 1.6;
    ctx.strokeRect(x, y, w, h);

    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    ctx.fillStyle =
      ob.family === 'bonus_gate'
        ? 'rgba(255, 215, 0, 0.22)'
        : ob.theme === 'pylon'
        ? 'rgba(255, 215, 0, 0.28)'
        : 'rgba(0, 240, 255, 0.18)';

    const stripeSpacing = 24;
    for (let s = -h; s < w + h; s += stripeSpacing) {
      ctx.beginPath();
      ctx.moveTo(x + s, y);
      ctx.lineTo(x + s + 10, y);
      ctx.lineTo(x + s + 10 - h, y + h);
      ctx.lineTo(x + s - h, y + h);
      ctx.closePath();
      ctx.fill();
    }

    const conduitX = x + w / 2;
    ctx.strokeStyle = ob.family === 'bonus_gate' ? 'rgba(255, 215, 0, 0.8)' : 'rgba(0, 240, 255, 0.8)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(conduitX, y);
    ctx.lineTo(conduitX, y + h);
    ctx.stroke();

    ctx.restore();

    const capY = isTop ? y + h - 8 : y;
    ctx.fillStyle = ob.family === 'bonus_gate' ? '#ffd700' : '#00f0ff';
    ctx.fillRect(x + 3, capY, w - 6, 8);

    ctx.restore();
  }

  private drawOrbs(
    ctx: CanvasRenderingContext2D,
    orbs: EnergyOrb[],
    gameTime: number,
    preset: GraphicsPreset
  ) {
    ctx.save();
    for (let i = 0; i < orbs.length; i++) {
      const orb = orbs[i];
      if (orb.collected || orb.x < -40 || orb.x > WORLD_WIDTH + 40) continue;

      const isSuper = orb.type === 'super';
      const pulse = Math.sin(orb.pulsePhase) * 3;
      const r = orb.radius + pulse;

      const glowGrad = ctx.createRadialGradient(orb.x, orb.y, 2, orb.x, orb.y, r * 3);
      if (isSuper) {
        glowGrad.addColorStop(0, 'rgba(255, 215, 0, 0.9)');
        glowGrad.addColorStop(0.5, 'rgba(255, 140, 0, 0.4)');
        glowGrad.addColorStop(1, 'rgba(255, 215, 0, 0)');
      } else {
        glowGrad.addColorStop(0, 'rgba(0, 240, 255, 0.9)');
        glowGrad.addColorStop(0.5, 'rgba(0, 150, 255, 0.4)');
        glowGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      }
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, r * 3, 0, Math.PI * 2);
      ctx.fill();

      const coreGrad = ctx.createRadialGradient(orb.x - 3, orb.y - 3, 1, orb.x, orb.y, r);
      if (isSuper) {
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.4, '#ffd700');
        coreGrad.addColorStop(1, '#ff6600');
      } else {
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.4, '#00f0ff');
        coreGrad.addColorStop(1, '#0066ff');
      }
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
      ctx.fill();

      if (preset !== 'performance') {
        ctx.save();
        ctx.translate(orb.x, orb.y);
        ctx.rotate(gameTime * 3.5 + i);
        ctx.strokeStyle = isSuper ? 'rgba(255, 255, 255, 0.9)' : 'rgba(220, 250, 255, 0.85)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(0, 0, r * 1.55, r * 0.55, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
    ctx.restore();
  }

  private drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[], preset: GraphicsPreset) {
    ctx.save();
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;

      if (p.shape === 'vapor') {
        // Soft billowing white vapor clouds for quad underside air jets
        const expandSize = p.size * (1 + (1 - alpha) * 2.2);
        const vaporGrad = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, expandSize);
        vaporGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.85})`);
        vaporGrad.addColorStop(0.5, `rgba(230, 240, 250, ${alpha * 0.45})`);
        vaporGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = vaporGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, expandSize, 0, Math.PI * 2);
        ctx.fill();
      } else {
        if (p.glow && preset !== 'performance') {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
        }

        if (p.shape === 'spark') {
          ctx.fillRect(p.x, p.y, p.size * 1.8, p.size * 0.8);
        } else if (p.shape === 'ring') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 + (1 - alpha)), 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  // --- REALISTIC METALLIC SILVER ROADSTER WITH 4 UNDERSIDE THRUSTER NOZZLES ---
  public drawRoadster(
    ctx: CanvasRenderingContext2D,
    car: PlayerCar,
    skin: CarSkin,
    gameTime: number,
    preset: GraphicsPreset
  ) {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.rotation);

    const w = car.width;
    const h = car.height;
    const thrust = car.thrustPower; // 0.0 to 1.0

    // =========================================================================
    // 1. FOUR INDIVIDUAL WHITE DOWNWARD AIR JETS (STREAMING FROM UNDERSIDE NOZZLES)
    // =========================================================================
    if (thrust > 0.02) {
      ctx.save();

      // Soft ambient white underglow reflecting off the ground and bottom of chassis
      const underglowGrad = ctx.createRadialGradient(0, 18, 5, 0, 24, w * 0.6);
      underglowGrad.addColorStop(0, `rgba(255, 255, 255, ${0.4 * thrust})`);
      underglowGrad.addColorStop(0.5, `rgba(225, 238, 255, ${0.18 * thrust})`);
      underglowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = underglowGrad;
      ctx.fillRect(-w * 0.5, 9, w, 40);

      // Render all 4 separate white air jets
      NOZZLE_OFFSETS.forEach((offset, idx) => {
        const nx = offset.x * w;
        const ny = offset.y;

        // Individual jet length with high-frequency micro-flicker
        const microFlicker = Math.sin(gameTime * 48 + idx * 2.2) * 4;
        const jetLength = (36 + idx % 2 * 6 + microFlicker) * thrust;
        const jetWidth = 6.5 * thrust;

        // A. Outer Expanding Vapor Cone (soft white / pale sky grey)
        const outerGrad = ctx.createLinearGradient(nx, ny, nx, ny + jetLength);
        outerGrad.addColorStop(0, `rgba(255, 255, 255, ${0.85 * thrust})`);
        outerGrad.addColorStop(0.3, `rgba(235, 245, 255, ${0.65 * thrust})`);
        outerGrad.addColorStop(0.7, `rgba(215, 230, 245, ${0.35 * thrust})`);
        outerGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = outerGrad;
        ctx.beginPath();
        ctx.moveTo(nx - jetWidth * 0.45, ny);
        ctx.lineTo(nx + jetWidth * 0.45, ny);
        ctx.lineTo(nx + jetWidth * 1.5, ny + jetLength);
        ctx.lineTo(nx - jetWidth * 1.5, ny + jetLength);
        ctx.closePath();
        ctx.fill();

        // B. Intense Solid White Core Jet Beam
        const coreGrad = ctx.createLinearGradient(nx, ny, nx, ny + jetLength * 0.65);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.95)');
        coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.moveTo(nx - 2, ny);
        ctx.lineTo(nx + 2, ny);
        ctx.lineTo(nx + 1, ny + jetLength * 0.65);
        ctx.lineTo(nx - 1, ny + jetLength * 0.65);
        ctx.closePath();
        ctx.fill();

        // C. Nozzle Ignition Glow Dot
        ctx.fillStyle = '#ffffff';
        if (preset !== 'performance') {
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 8;
        }
        ctx.beginPath();
        ctx.arc(nx, ny + 1, 2.5 * thrust, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.restore();
    }

    // =========================================================================
    // 2. THE FOUR VISIBLE UNDERSIDE THRUSTER NOZZLES (HARDWARE HOUSINGS)
    // =========================================================================
    ctx.save();
    NOZZLE_OFFSETS.forEach((offset) => {
      const nx = offset.x * w;
      const ny = offset.y;

      // Dark metallic nozzle housing bracket
      ctx.fillStyle = '#1c212a';
      ctx.fillRect(nx - 3.5, ny - 3.5, 7, 4.5);

      // Beveled titanium rim
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.strokeRect(nx - 3.5, ny - 3.5, 7, 4.5);

      // Circular downward exhaust orifice
      ctx.fillStyle = thrust > 0.05 ? '#ffffff' : '#0c0e14';
      ctx.beginPath();
      ctx.ellipse(nx, ny + 0.5, 2.8, 1.2, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // =========================================================================
    // 3. MAIN ROADSTER BODY — REALISTIC METALLIC SILVER / TITANIUM PROFILE
    // =========================================================================
    ctx.save();

    // Determine paint finish colors (Default is Titanium Silver)
    const isDefaultSilver = !skin || skin.id === 'roadster_silver' || skin.id === 'silver_streak';
    const mainBodyBase = isDefaultSilver ? '#cbd5e1' : skin.bodyColor;
    const mainBodyHighlight = isDefaultSilver ? '#f8fafc' : skin.accentColor;
    const mainBodyShadow = isDefaultSilver ? '#94a3b8' : '#334155';

    // A. Lower Graphite / Carbon Rocker Panel & Aero Splitters
    ctx.beginPath();
    ctx.moveTo(-w * 0.46, 7.5);
    ctx.lineTo(w * 0.48, 7.5);
    ctx.lineTo(w * 0.45, 9.5);
    ctx.lineTo(-w * 0.44, 9.5);
    ctx.closePath();
    ctx.fillStyle = '#1e2430';
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // B. Main Sculpted Aerodynamic Body
    ctx.beginPath();
    // Rear diffuser edge
    ctx.moveTo(-w * 0.46, 7.5);
    // Rear bumper upward sweep
    ctx.lineTo(-w * 0.47, -1.5);
    // Rear ducktail aerodynamic spoiler lip
    ctx.lineTo(-w * 0.44, -4.5);
    // Rear fastback deck contour
    ctx.quadraticCurveTo(-w * 0.28, -6.5, -w * 0.16, -7.5);
    // Swept panoramic glass canopy roofline
    ctx.quadraticCurveTo(0, -14.5, w * 0.16, -7.5);
    // Low sweeping wedge hood terminating at sharp nose
    ctx.quadraticCurveTo(w * 0.36, -4, w * 0.49, 1.5);
    // Front aero nose tip
    ctx.lineTo(w * 0.50, 4.5);
    // Front chin splitter
    ctx.lineTo(w * 0.45, 7.5);
    // Front wheel cutout
    ctx.lineTo(w * 0.32, 7.5);
    ctx.arc(w * 0.24, 7.5, 8.5, 0, Math.PI, true);
    // Underside rocker panel between wheels
    ctx.lineTo(-w * 0.16, 7.5);
    // Rear wheel cutout
    ctx.arc(-w * 0.24, 7.5, 8.5, 0, Math.PI, true);
    ctx.lineTo(-w * 0.46, 7.5);
    ctx.closePath();

    // Multi-stage Metallic Silver Gradient with specular sheen
    const bodyGrad = ctx.createLinearGradient(0, -14.5, 0, 9.5);
    bodyGrad.addColorStop(0, mainBodyHighlight);
    bodyGrad.addColorStop(0.35, mainBodyBase);
    bodyGrad.addColorStop(0.7, mainBodyBase);
    bodyGrad.addColorStop(1, mainBodyShadow);
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // Subtle metallic contour edge line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // C. Shoulder Specular Light Reflection (Along the door and fender)
    ctx.beginPath();
    ctx.moveTo(-w * 0.40, -2.5);
    ctx.quadraticCurveTo(0, -5.5, w * 0.43, 0.5);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // D. Subtle Door Shut Line & Body Panel Seams
    ctx.beginPath();
    ctx.moveTo(w * 0.05, -6.5);
    ctx.lineTo(w * 0.03, 6.5);
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Hood character crease line
    ctx.beginPath();
    ctx.moveTo(w * 0.17, -5);
    ctx.lineTo(w * 0.42, 0.5);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 0.9;
    ctx.stroke();

    // E. Panoramic Tinted Glass Canopy with Sky Reflections
    ctx.beginPath();
    ctx.moveTo(-w * 0.19, -6.5);
    ctx.quadraticCurveTo(0, -13, w * 0.14, -6.5);
    ctx.lineTo(w * 0.19, -3.5);
    ctx.lineTo(-w * 0.16, -3.5);
    ctx.closePath();

    const canopyGrad = ctx.createLinearGradient(0, -13, 0, -3.5);
    canopyGrad.addColorStop(0, 'rgba(215, 235, 255, 0.85)');
    canopyGrad.addColorStop(0.35, 'rgba(15, 23, 42, 0.96)');
    canopyGrad.addColorStop(1, 'rgba(6, 9, 18, 0.98)');
    ctx.fillStyle = canopyGrad;
    ctx.fill();

    // Glass glare slash
    ctx.beginPath();
    ctx.moveTo(-w * 0.04, -11);
    ctx.lineTo(w * 0.06, -5.5);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // F. Front Narrow LED Light Strip (Pure Icy-White DRL)
    ctx.beginPath();
    ctx.moveTo(w * 0.45, 1.5);
    ctx.lineTo(w * 0.49, 2.5);
    ctx.lineTo(w * 0.44, 4);
    ctx.strokeStyle = '#f8fafc';
    if (preset !== 'performance') {
      ctx.shadowColor = '#f8fafc';
      ctx.shadowBlur = 10;
    }
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Subtle forward headlight illumination cone
    const beamGrad = ctx.createLinearGradient(w * 0.49, 2.5, w * 0.49 + 60, 3.5);
    beamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    beamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(w * 0.49, 2.5);
    ctx.lineTo(w * 0.49 + 60, -3);
    ctx.lineTo(w * 0.49 + 60, 9);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    // G. Curved Red Rear LED Taillight Blade
    ctx.beginPath();
    ctx.moveTo(-w * 0.45, -2);
    ctx.lineTo(-w * 0.47, 1.5);
    ctx.strokeStyle = '#ef4444';
    if (preset !== 'performance') {
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
    }
    ctx.lineWidth = 2.2;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // H. Detailed Black Alloy Turbine Wheels
    this.drawDetailedAlloyWheel(ctx, w * 0.24, 7.5, gameTime);
    this.drawDetailedAlloyWheel(ctx, -w * 0.24, 7.5, gameTime);

    ctx.restore();
    ctx.restore();
  }

  // Realistic Detailed Black Alloy Turbine Wheel
  private drawDetailedAlloyWheel(ctx: CanvasRenderingContext2D, x: number, y: number, gameTime: number) {
    ctx.save();
    ctx.translate(x, y);

    // Outer performance rubber tire
    ctx.fillStyle = '#0a0d14';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();

    // Outer tire tread rim
    ctx.strokeStyle = '#1e2430';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Graphite wheel rim lip
    ctx.fillStyle = '#181d26';
    ctx.beginPath();
    ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Spinning multi-spoke turbine blades
    ctx.rotate(-gameTime * 28);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.1;
    for (let s = 0; s < 5; s++) {
      ctx.rotate((Math.PI * 2) / 5);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 5);
      ctx.stroke();
    }

    // Center metallic hub cap
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(0, 0, 1.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawForegroundStreaks(ctx: CanvasRenderingContext2D) {
    ctx.save();
    for (let i = 0; i < this.foregroundStreaks.length; i++) {
      const fs = this.foregroundStreaks[i];
      const curX = (fs.x - this.foregroundStreakOffset * fs.speed + WORLD_WIDTH * 2) % WORLD_WIDTH;

      ctx.strokeStyle = `rgba(0, 240, 255, ${fs.alpha})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(curX, fs.y);
      ctx.lineTo(curX + fs.length, fs.y);
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawFloatingTexts(ctx: CanvasRenderingContext2D, texts: FloatingText[]) {
    ctx.save();
    for (let i = 0; i < texts.length; i++) {
      const ft = texts[i];
      ctx.globalAlpha = Math.max(0, ft.opacity);
      ctx.fillStyle = ft.color;
      ctx.shadowColor = ft.color;
      ctx.shadowBlur = 8;
      ctx.font = 'bold 16px "Press Start 2P", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.restore();
  }
}
