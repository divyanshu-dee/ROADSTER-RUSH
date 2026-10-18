import { PlayerCar, CarSkin, ObstaclePylon, EnergyOrb, Particle, FloatingText } from './types';
import { WORLD_WIDTH, WORLD_HEIGHT } from './physics';

export class SceneRenderer {
  // Parallax offsets
  private starOffset = 0;
  private mountainOffset = 0;
  private cityOffset = 0;
  private roadOffset = 0;
  private stars: Array<{ x: number; y: number; size: number; speed: number; brightness: number }> = [];

  constructor() {
    // Generate starfield
    for (let i = 0; i < 90; i++) {
      this.stars.push({
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * (WORLD_HEIGHT * 0.7),
        size: Math.random() * 2 + 0.8,
        speed: Math.random() * 0.3 + 0.1,
        brightness: Math.random() * 0.7 + 0.3,
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
    isSlowMo: boolean
  ) {
    // Scroll parallax layers
    const speed = gameSpeed * (isSlowMo ? 0.2 : 1);
    this.starOffset = (this.starOffset + speed * 0.05 * dt) % WORLD_WIDTH;
    this.mountainOffset = (this.mountainOffset + speed * 0.2 * dt) % WORLD_WIDTH;
    this.cityOffset = (this.cityOffset + speed * 0.45 * dt) % WORLD_WIDTH;
    this.roadOffset = (this.roadOffset + speed * 1.0 * dt) % 60;

    // 1. Sky & Nebula
    this.drawSky(ctx, gameTime);

    // 2. Stars
    this.drawStars(ctx, gameTime);

    // 3. Distant Mountains (Parallax Layer 1)
    this.drawMountains(ctx);

    // 4. Futuristic City Skyline & Billboards (Parallax Layer 2)
    this.drawCitySkyline(ctx, gameTime);

    // 5. Airborne Racing Highway / Grid Corridor
    this.drawHighway(ctx);

    // 6. Obstacles & Energy Gates
    this.drawObstacles(ctx, obstacles, gameTime);

    // 7. Energy Orbs
    this.drawOrbs(ctx, orbs, gameTime);

    // 8. Particles (Thrusters, sparks, debris)
    this.drawParticles(ctx, particles);

    // 9. Tesla Roadster Player Vehicle
    this.drawRoadster(ctx, car, skin, gameTime);

    // 10. Floating Score Popups
    this.drawFloatingTexts(ctx, floatingTexts);
  }

  private drawSky(ctx: CanvasRenderingContext2D, gameTime: number) {
    const grad = ctx.createLinearGradient(0, 0, 0, WORLD_HEIGHT);
    grad.addColorStop(0, '#040714');
    grad.addColorStop(0.5, '#0a102a');
    grad.addColorStop(0.85, '#171336');
    grad.addColorStop(1, '#0b081c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Atmospheric Nebula Glow
    const nebulaGrad = ctx.createRadialGradient(
      WORLD_WIDTH * 0.7,
      WORLD_HEIGHT * 0.35,
      20,
      WORLD_WIDTH * 0.7,
      WORLD_HEIGHT * 0.35,
      350
    );
    nebulaGrad.addColorStop(0, 'rgba(168, 85, 247, 0.15)');
    nebulaGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.08)');
    nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebulaGrad;
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Distant Cyber Moon / Sun
    ctx.save();
    ctx.beginPath();
    ctx.arc(WORLD_WIDTH * 0.75, 120, 52, 0, Math.PI * 2);
    const moonGrad = ctx.createLinearGradient(WORLD_WIDTH * 0.75, 68, WORLD_WIDTH * 0.75, 172);
    moonGrad.addColorStop(0, '#ff007f');
    moonGrad.addColorStop(1, '#ffd000');
    ctx.fillStyle = moonGrad;
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 30;
    ctx.fill();

    // Synthwave horizontal scanlines across moon
    ctx.fillStyle = 'rgba(4, 7, 20, 0.75)';
    for (let y = 100; y < 172; y += 8) {
      const sliceH = (y - 95) * 0.06 + 2;
      ctx.fillRect(WORLD_WIDTH * 0.75 - 55, y, 110, sliceH);
    }
    ctx.restore();
  }

  private drawStars(ctx: CanvasRenderingContext2D, gameTime: number) {
    ctx.save();
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      const curX = (s.x - this.starOffset * s.speed + WORLD_WIDTH * 2) % WORLD_WIDTH;
      const twinkle = Math.sin(gameTime * 3 + i) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(220, 240, 255, ${s.brightness * twinkle})`;
      ctx.fillRect(curX, s.y, s.size, s.size);
    }
    ctx.restore();
  }

  private drawMountains(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const mountainY = WORLD_HEIGHT * 0.68;
    const offset = this.mountainOffset;

    for (let pass = 0; pass < 2; pass++) {
      const startX = pass * WORLD_WIDTH - offset;
      ctx.beginPath();
      ctx.moveTo(startX, WORLD_HEIGHT);
      ctx.lineTo(startX, mountainY);

      // Procedural pixelated mountain peaks
      const peaks = [
        [0, 0],
        [80, -90],
        [160, -40],
        [240, -120],
        [360, -30],
        [460, -110],
        [580, -50],
        [700, -140],
        [820, -70],
        [920, -100],
        [1000, 0],
      ];

      for (let p = 0; p < peaks.length; p++) {
        ctx.lineTo(startX + peaks[p][0], mountainY + peaks[p][1]);
      }
      ctx.lineTo(startX + WORLD_WIDTH, WORLD_HEIGHT);
      ctx.closePath();

      const mtnGrad = ctx.createLinearGradient(0, mountainY - 140, 0, WORLD_HEIGHT);
      mtnGrad.addColorStop(0, '#1c1538');
      mtnGrad.addColorStop(0.6, '#0f0c23');
      mtnGrad.addColorStop(1, '#070514');
      ctx.fillStyle = mtnGrad;
      ctx.fill();

      // Cyber Rim neon line on mountain edge
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawCitySkyline(ctx: CanvasRenderingContext2D, gameTime: number) {
    ctx.save();
    const baseY = WORLD_HEIGHT - 65;
    const offset = this.cityOffset;

    // Skyline silhouettes with lit windows
    const buildings = [
      { w: 60, h: 180, color: '#131936' },
      { w: 45, h: 220, color: '#0d132c' },
      { w: 80, h: 160, color: '#161c3e' },
      { w: 55, h: 250, color: '#0f1734' },
      { w: 90, h: 190, color: '#141a38' },
      { w: 50, h: 270, color: '#0c1228' },
      { w: 70, h: 210, color: '#181e42' },
      { w: 65, h: 230, color: '#101633' },
      { w: 85, h: 175, color: '#151b3b' },
      { w: 75, h: 260, color: '#0e142f' },
      { w: 90, h: 195, color: '#171e40' },
      { w: 60, h: 240, color: '#111835' },
      { w: 85, h: 215, color: '#141b3a' },
    ];

    for (let pass = 0; pass < 2; pass++) {
      let curX = pass * WORLD_WIDTH - offset;
      for (let b = 0; b < buildings.length; b++) {
        const build = buildings[b];
        ctx.fillStyle = build.color;
        ctx.fillRect(curX, baseY - build.h, build.w, build.h);

        // Cyber top antenna with blinking light
        ctx.strokeStyle = '#252e5c';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(curX + build.w / 2, baseY - build.h);
        ctx.lineTo(curX + build.w / 2, baseY - build.h - 18);
        ctx.stroke();

        const blink = Math.sin(gameTime * 4 + b) > 0.4;
        ctx.fillStyle = blink ? '#ff0055' : '#00f0ff';
        ctx.fillRect(curX + build.w / 2 - 2, baseY - build.h - 20, 4, 4);

        // Windows
        ctx.fillStyle = (b % 2 === 0) ? 'rgba(0, 240, 255, 0.4)' : 'rgba(255, 220, 100, 0.35)';
        for (let wy = baseY - build.h + 20; wy < baseY - 15; wy += 16) {
          for (let wx = curX + 8; wx < curX + build.w - 8; wx += 14) {
            if ((b * 7 + wx + wy) % 5 !== 0) {
              ctx.fillRect(wx, wy, 5, 8);
            }
          }
        }

        // Hologram billboard on tallest building
        if (build.h > 240 && curX > -100 && curX < WORLD_WIDTH) {
          ctx.save();
          ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
          ctx.fillRect(curX + 6, baseY - build.h + 25, build.w - 12, 30);
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 1;
          ctx.strokeRect(curX + 6, baseY - build.h + 25, build.w - 12, 30);
          ctx.fillStyle = '#00f0ff';
          ctx.font = 'bold 8px monospace';
          ctx.fillText('ROADSTER', curX + 9, baseY - build.h + 40);
          ctx.fillText('0-60: 1.9s', curX + 9, baseY - build.h + 50);
          ctx.restore();
        }

        curX += build.w + 12;
      }
    }
    ctx.restore();
  }

  private drawHighway(ctx: CanvasRenderingContext2D) {
    ctx.save();
    const groundY = WORLD_HEIGHT - 45;

    // Highway deck
    const roadGrad = ctx.createLinearGradient(0, groundY, 0, WORLD_HEIGHT);
    roadGrad.addColorStop(0, '#0c1222');
    roadGrad.addColorStop(0.3, '#080d19');
    roadGrad.addColorStop(1, '#03050a');
    ctx.fillStyle = roadGrad;
    ctx.fillRect(0, groundY, WORLD_WIDTH, 45);

    // Glowing Neon Guideline
    ctx.strokeStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 12;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(WORLD_WIDTH, groundY);
    ctx.stroke();

    // Road dashed stripes
    ctx.strokeStyle = '#ff007f';
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 8;
    ctx.lineWidth = 2;
    ctx.setLineDash([25, 35]);
    ctx.lineDashOffset = this.roadOffset;
    ctx.beginPath();
    ctx.moveTo(0, groundY + 18);
    ctx.lineTo(WORLD_WIDTH, groundY + 18);
    ctx.stroke();
    ctx.setLineDash([]);

    // Ceiling safety laser line
    ctx.strokeStyle = 'rgba(255, 30, 80, 0.4)';
    ctx.shadowColor = '#ff1e50';
    ctx.shadowBlur = 6;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(WORLD_WIDTH, 10);
    ctx.stroke();

    ctx.restore();
  }

  private drawObstacles(ctx: CanvasRenderingContext2D, obstacles: ObstaclePylon[], gameTime: number) {
    ctx.save();

    for (let i = 0; i < obstacles.length; i++) {
      const ob = obstacles[i];
      if (ob.x > WORLD_WIDTH + 50 || ob.x + ob.width < -50) continue;

      const pylonColor = '#101524';
      const beamPulse = Math.sin(gameTime * 8 + i) * 0.3 + 0.7;

      // TOP PYLON
      this.drawPylonStructure(ctx, ob.x, 0, ob.width, ob.topHeight, true, ob.theme);

      // BOTTOM PYLON
      this.drawPylonStructure(ctx, ob.x, ob.bottomY, ob.width, ob.bottomHeight, false, ob.theme);

      // CONNECTING LASER FORCEFIELD / ENERGY BEAM
      const laserX = ob.x + ob.width / 2;
      ctx.save();

      // Outer laser aura
      const laserColor = ob.theme === 'laser' ? 'rgba(0, 240, 255,' : 'rgba(255, 0, 127,';
      ctx.strokeStyle = `${laserColor} ${0.25 * beamPulse})`;
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(laserX, ob.topHeight);
      ctx.lineTo(laserX, ob.bottomY);
      ctx.stroke();

      // Middle bright beam
      ctx.strokeStyle = `${laserColor} ${0.7 * beamPulse})`;
      ctx.lineWidth = 6;
      ctx.stroke();

      // Core white laser beam
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * beamPulse})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Laser emitters node orbs
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(laserX, ob.topHeight - 2, 6, 0, Math.PI * 2);
      ctx.arc(laserX, ob.bottomY + 2, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
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
    theme: 'laser' | 'cyber' | 'pylon'
  ) {
    if (h <= 0) return;

    // Main dark composite housing
    const grad = ctx.createLinearGradient(x, 0, x + w, 0);
    grad.addColorStop(0, '#1c2238');
    grad.addColorStop(0.3, '#2a3454');
    grad.addColorStop(0.8, '#141829');
    grad.addColorStop(1, '#0d101c');

    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);

    // Beveled Border
    ctx.strokeStyle = theme === 'laser' ? '#00f0ff' : '#ff007f';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);

    // Hazard caution stripes
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
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

    // Glowing vertical conduit in center of pylon
    const conduitX = x + w / 2;
    ctx.strokeStyle = theme === 'laser' ? 'rgba(0, 240, 255, 0.7)' : 'rgba(255, 0, 127, 0.7)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(conduitX, y);
    ctx.lineTo(conduitX, y + h);
    ctx.stroke();

    ctx.restore();

    // Cap at tip
    const capY = isTop ? y + h - 6 : y;
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.fillRect(x + 4, capY, w - 8, 6);
    ctx.shadowBlur = 0;
  }

  private drawOrbs(ctx: CanvasRenderingContext2D, orbs: EnergyOrb[], gameTime: number) {
    ctx.save();
    for (let i = 0; i < orbs.length; i++) {
      const orb = orbs[i];
      if (orb.collected || orb.x < -30 || orb.x > WORLD_WIDTH + 30) continue;

      const pulse = Math.sin(orb.pulsePhase) * 3;
      const r = orb.radius + pulse;

      // Outer Glow Aura
      const glowGrad = ctx.createRadialGradient(orb.x, orb.y, 2, orb.x, orb.y, r * 2.8);
      glowGrad.addColorStop(0, 'rgba(0, 240, 255, 0.85)');
      glowGrad.addColorStop(0.4, 'rgba(0, 160, 255, 0.4)');
      glowGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, r * 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Core Sphere
      const coreGrad = ctx.createRadialGradient(orb.x - 3, orb.y - 3, 1, orb.x, orb.y, r);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.5, '#00f0ff');
      coreGrad.addColorStop(1, '#0066ff');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
      ctx.fill();

      // Orbiting Quantum Ring
      ctx.save();
      ctx.translate(orb.x, orb.y);
      ctx.rotate(gameTime * 3 + i);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.5, r * 0.55, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  private drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
    ctx.save();
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;

      if (p.glow) {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
      }

      if (p.shape === 'spark') {
        ctx.fillRect(p.x, p.y, p.size * 1.6, p.size * 0.8);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // --- TESLA ROADSTER RENDERING ---
  public drawRoadster(ctx: CanvasRenderingContext2D, car: PlayerCar, skin: CarSkin, gameTime: number) {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.rotation);

    const w = car.width;
    const h = car.height;

    // 1. Underglow Neon (Reflects off cyber ground and air)
    ctx.save();
    ctx.fillStyle = skin.glowColor;
    ctx.shadowColor = skin.glowColor;
    ctx.shadowBlur = 18;
    ctx.globalAlpha = 0.45 + (car.isBoosting ? 0.35 : 0);
    ctx.beginPath();
    ctx.ellipse(0, h * 0.4, w * 0.55, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Thruster Flame (SpaceX Cold Gas / Rocket Package)
    if (car.isBoosting) {
      ctx.save();
      const flameLength = 28 + Math.random() * 12;
      const flameGrad = ctx.createLinearGradient(-w * 0.45, 4, -w * 0.45 - flameLength, 4);
      flameGrad.addColorStop(0, '#ffffff');
      flameGrad.addColorStop(0.2, '#00f0ff');
      flameGrad.addColorStop(0.7, '#ff007f');
      flameGrad.addColorStop(1, 'rgba(255, 0, 127, 0)');

      ctx.fillStyle = flameGrad;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 15;

      ctx.beginPath();
      ctx.moveTo(-w * 0.45, 1);
      ctx.lineTo(-w * 0.45 - flameLength, 4);
      ctx.lineTo(-w * 0.45, 7);
      ctx.closePath();
      ctx.fill();

      // Shock diamond plasma rings
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      for (let d = 8; d < flameLength - 5; d += 8) {
        ctx.beginPath();
        ctx.ellipse(-w * 0.45 - d, 4, 2, 4, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 3. Main Roadster Body - Sleek Aerodynamic Curves
    ctx.save();
    ctx.beginPath();
    // Start at rear bumper bottom
    ctx.moveTo(-w * 0.45, 8);
    // Rear diffuser curve up to spoiler
    ctx.lineTo(-w * 0.46, -2);
    // Aero spoiler lip
    ctx.lineTo(-w * 0.42, -5);
    // Rear fastback deck curve
    ctx.quadraticCurveTo(-w * 0.28, -6, -w * 0.15, -7);
    // Cabin roofline (swept panoramic glass arch)
    ctx.quadraticCurveTo(0, -14, w * 0.15, -7);
    // Hood sweep to front nose
    ctx.quadraticCurveTo(w * 0.35, -4, w * 0.48, 2);
    // Front aero splitter nose
    ctx.lineTo(w * 0.49, 6);
    // Front chin splitter
    ctx.lineTo(w * 0.44, 9);
    // Front wheel arch
    ctx.lineTo(w * 0.28, 9);
    // Bottom rocker panel / side skirts
    ctx.lineTo(-w * 0.18, 9);
    // Rear wheel arch
    ctx.lineTo(-w * 0.32, 9);
    // Rear bumper bottom
    ctx.closePath();

    // Metallic Multi-coat Paint Gradient
    const paintGrad = ctx.createLinearGradient(0, -14, 0, 9);
    paintGrad.addColorStop(0, skin.accentColor);
    paintGrad.addColorStop(0.35, skin.bodyColor);
    paintGrad.addColorStop(0.7, skin.bodyColor);
    paintGrad.addColorStop(1, '#090a10');
    ctx.fillStyle = paintGrad;
    ctx.shadowColor = skin.glowColor;
    ctx.shadowBlur = 6;
    ctx.fill();

    // Carbon Fiber aero border / highlight
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.4;
    ctx.stroke();
    ctx.globalAlpha = 1.0;

    // 4. Specular Sunlight Glint reflection line across shoulder
    ctx.beginPath();
    ctx.moveTo(-w * 0.38, -3);
    ctx.quadraticCurveTo(0, -6, w * 0.42, 1);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 5. Panoramic Glass Canopy (Black Tint with Cyan Skylight Reflection)
    ctx.beginPath();
    ctx.moveTo(-w * 0.18, -6);
    ctx.quadraticCurveTo(0, -12, w * 0.13, -6);
    ctx.lineTo(w * 0.18, -3);
    ctx.lineTo(-w * 0.15, -3);
    ctx.closePath();

    const glassGrad = ctx.createLinearGradient(0, -12, 0, -3);
    glassGrad.addColorStop(0, 'rgba(0, 240, 255, 0.85)');
    glassGrad.addColorStop(0.4, 'rgba(15, 25, 45, 0.95)');
    glassGrad.addColorStop(1, 'rgba(5, 8, 15, 0.98)');
    ctx.fillStyle = glassGrad;
    ctx.fill();

    // Glass glare slash
    ctx.beginPath();
    ctx.moveTo(-w * 0.05, -10);
    ctx.lineTo(w * 0.05, -5);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 6. Signature Front LED Headlight Blade
    ctx.beginPath();
    ctx.moveTo(w * 0.44, 2);
    ctx.lineTo(w * 0.48, 3);
    ctx.lineTo(w * 0.42, 5);
    ctx.strokeStyle = '#00f0ff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Headlight forward illumination cone
    const beamGrad = ctx.createLinearGradient(w * 0.48, 3, w * 0.48 + 55, 4);
    beamGrad.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
    beamGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(w * 0.48, 3);
    ctx.lineTo(w * 0.48 + 55, -2);
    ctx.lineTo(w * 0.48 + 55, 9);
    ctx.closePath();
    ctx.fill();

    // 7. Signature Rear LED Light Bar (Curved Red Blade)
    ctx.beginPath();
    ctx.moveTo(-w * 0.44, -2);
    ctx.lineTo(-w * 0.46, 2);
    ctx.strokeStyle = '#ff0033';
    ctx.shadowColor = '#ff0033';
    ctx.shadowBlur = 12;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 8. Futuristic Turbine Aero Wheels
    this.drawAeroWheel(ctx, w * 0.26, 8, gameTime);
    this.drawAeroWheel(ctx, -w * 0.28, 8, gameTime);

    // 9. SpaceX Thruster Nozzle at rear
    ctx.fillStyle = '#222533';
    ctx.fillRect(-w * 0.48, 2, 3, 5);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(-w * 0.48, 2, 3, 5);

    ctx.restore();
    ctx.restore();
  }

  private drawAeroWheel(ctx: CanvasRenderingContext2D, x: number, y: number, gameTime: number) {
    ctx.save();
    ctx.translate(x, y);

    // Outer tire
    ctx.fillStyle = '#0a0d14';
    ctx.beginPath();
    ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
    ctx.fill();

    // Wheel rim
    ctx.fillStyle = '#1e2436';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();

    // Glowing turbine spokes spinning
    ctx.rotate(-gameTime * 25);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1;
    for (let s = 0; s < 4; s++) {
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 4.5);
      ctx.stroke();
    }

    // Center cap
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
    ctx.fill();

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
